#!/usr/bin/env tsx
// Data-relations review queue CLI.
//
// Subcommands:
//   list                                  status snapshot of empty-field rates
//   queue --domain=X --field=Y [--limit=N] generate a review queue JSON
//   status                                list queue files with progress
//   review <queue-file>                   interactive accept/reject loop
//   apply <queue-file> [--dry-run]        write decisions back to src/data/*.ts
//
// Design: docs/20260507-data-relations-review-queue-design.md.

import { mkdirSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { debates } from '../../src/data/debates';
import { categories } from '../../src/data/policies';
import { allPeople } from '../../src/data/people';

import { candidatesForDebate, candidatesForPolicy, type Candidate } from './lib/heuristics';
import {
  type Domain,
  type Field,
  type QueueEntry,
  type QueueFile,
  QUEUE_DIR,
  queueFilename,
  queuePath,
  readQueue,
  writeQueue,
  recomputeStats,
  listQueueFiles,
} from './lib/queue';
import { loadSource, applyAcceptedToRecord, persist, runPrettier, SIBLING } from './lib/codemod';

// ── argv parsing (zero deps) ────────────────────────────────────────────

interface Args {
  cmd: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgv(argv: string[]): Args {
  const out: Args = { cmd: '', positional: [], flags: {} };
  const rest = argv.slice(2);
  if (rest.length === 0) {
    out.cmd = 'help';
    return out;
  }
  out.cmd = rest[0];
  for (const tok of rest.slice(1)) {
    if (tok.startsWith('--')) {
      const eq = tok.indexOf('=');
      if (eq === -1) out.flags[tok.slice(2)] = true;
      else out.flags[tok.slice(2, eq)] = tok.slice(eq + 1);
    } else {
      out.positional.push(tok);
    }
  }
  return out;
}

// ── Data flatteners ─────────────────────────────────────────────────────

function allPolicies() {
  return categories.flatMap((c) => c.policies).filter((p) => !!p.id);
}

// ── Subcommand: list ────────────────────────────────────────────────────

function cmdList(): void {
  const policies = allPolicies();

  const debatesEmpty = debates.filter((d) => !d.relatedPolicyIds || d.relatedPolicyIds.length === 0);
  const policiesEmpty = policies.filter((p) => !p.relatedDebateIds || p.relatedDebateIds.length === 0);

  console.log('data-relations: empty-field summary\n');
  console.log(
    `  debates.relatedPolicyIds   ${debatesEmpty.length}/${debates.length}  (${pct(debatesEmpty.length, debates.length)})`
  );
  console.log(
    `  policies.relatedDebateIds  ${policiesEmpty.length}/${policies.length}  (${pct(policiesEmpty.length, policies.length)})`
  );
  console.log(
    '\nNext: npx tsx scripts/data-relations/review.ts queue --domain=debates --field=relatedPolicyIds [--limit=20]'
  );
}

function pct(n: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((100 * n) / total)}%`;
}

// ── Subcommand: queue ───────────────────────────────────────────────────

type Anchorable = { id?: string; title: string; titleEn?: string; date: string };
type Targetable = { id?: string; title: string; titleEn?: string };

interface AnchorSpec<TAnchor extends Anchorable, TTarget extends Targetable> {
  source: TAnchor[];
  hasEmptyTargetField: (a: TAnchor) => boolean;
  candidates: (a: TAnchor) => Candidate<TTarget>[];
  contextPersonIds: (a: TAnchor) => string[];
  currentTargets: (a: TAnchor) => string[];
}

function buildEntries<TAnchor extends Anchorable, TTarget extends Targetable>(
  spec: AnchorSpec<TAnchor, TTarget>,
  limit: number | null
): QueueEntry[] {
  const targets = spec.source.filter(spec.hasEmptyTargetField);
  const slice = limit ? targets.slice(0, limit) : targets;
  const entries: QueueEntry[] = [];
  for (const anchor of slice) {
    if (!anchor.id) continue;
    const candidates = spec.candidates(anchor);
    if (candidates.length === 0) continue;
    entries.push({
      id: anchor.id,
      title: anchor.titleEn || anchor.title,
      date: anchor.date,
      contextPersonIds: spec.contextPersonIds(anchor),
      current: spec.currentTargets(anchor),
      candidates: candidates.map((c) => ({
        targetId: c.target.id!,
        targetTitle: c.target.titleEn || c.target.title,
        confidence: c.confidence,
        signals: c.signals,
      })),
      decision: null,
      reviewedAt: null,
    });
  }
  return entries;
}

function cmdQueue(args: Args): void {
  const domain = String(args.flags.domain || '') as Domain;
  const field = String(args.flags.field || '') as Field;
  const limitRaw = args.flags.limit;
  const limit = limitRaw === undefined || limitRaw === true ? null : Number(limitRaw);

  if (!isValidPair(domain, field)) {
    console.error(
      'queue: must pass --domain=debates --field=relatedPolicyIds  OR  --domain=policies --field=relatedDebateIds'
    );
    process.exit(2);
  }

  const policies = allPolicies();
  const entries: QueueEntry[] =
    domain === 'debates'
      ? buildEntries(
          {
            source: debates,
            hasEmptyTargetField: (d) => !d.relatedPolicyIds || d.relatedPolicyIds.length === 0,
            candidates: (d) => candidatesForDebate(d, policies, allPeople, 5),
            contextPersonIds: (d) => d.personIds || [],
            currentTargets: (d) => [...(d.relatedPolicyIds || [])],
          },
          limit
        )
      : buildEntries(
          {
            source: policies,
            hasEmptyTargetField: (p) => !p.relatedDebateIds || p.relatedDebateIds.length === 0,
            candidates: (p) => candidatesForPolicy(p, debates, allPeople, 5),
            contextPersonIds: (p) => p.authorPersonIds || [],
            currentTargets: (p) => [...(p.relatedDebateIds || [])],
          },
          limit
        );

  const queue: QueueFile = {
    domain,
    field,
    generatedAt: new Date().toISOString(),
    limit,
    stats: { total: entries.length, reviewed: 0, accepted: 0, skipped: 0 },
    entries,
  };

  ensureDir(QUEUE_DIR);
  const path = queuePath(queueFilename(domain, field));
  writeQueue(path, queue);
  console.log(`queue: wrote ${entries.length} entries to ${path}`);
  console.log(`next: npx tsx scripts/data-relations/review.ts review ${path}`);
}

function isValidPair(domain: string, field: string): domain is Domain {
  return (
    (domain === 'debates' && field === 'relatedPolicyIds') ||
    (domain === 'policies' && field === 'relatedDebateIds')
  );
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ── Subcommand: status ──────────────────────────────────────────────────

function cmdStatus(): void {
  const files = listQueueFiles();
  if (files.length === 0) {
    console.log('status: no queue files. Run `queue` first.');
    return;
  }
  console.log('data-relations queue files (newest first):\n');
  for (const path of files) {
    try {
      const queue = readQueue(path);
      const s = queue.stats;
      console.log(
        `  ${path}\n    domain=${queue.domain} field=${queue.field}  reviewed=${s.reviewed}/${s.total}  accepted=${s.accepted}  skipped=${s.skipped}`
      );
    } catch (err) {
      console.log(`  ${path}\n    [unreadable: ${(err as Error).message}]`);
    }
  }
}

// ── Subcommand: review (interactive) ────────────────────────────────────

async function cmdReview(args: Args): Promise<void> {
  const path = args.positional[0];
  if (!path) {
    console.error('review: pass a queue file path');
    process.exit(2);
  }
  const queue = readQueue(path);
  const rl = createInterface({ input, output });
  const pending = queue.entries.filter((e) => e.decision === null);
  console.log(`review: ${pending.length} entries pending (of ${queue.entries.length} total)\n`);

  for (let i = 0; i < queue.entries.length; i++) {
    const entry = queue.entries[i];
    if (entry.decision !== null) continue;

    console.log('─'.repeat(72));
    console.log(`[${i + 1}/${queue.entries.length}] ${entry.id}  (${entry.date})`);
    console.log(`  "${truncate(entry.title, 100)}"`);
    if (entry.contextPersonIds.length > 0) {
      console.log(`  context: ${entry.contextPersonIds.slice(0, 4).join(', ')}`);
    }
    console.log('\n  Candidates:');
    entry.candidates.forEach((c, idx) => {
      const tag = `[${c.confidence.toUpperCase().padEnd(6)}]`;
      console.log(`    ${idx + 1}. ${tag} ${c.targetId}`);
      console.log(`       "${truncate(c.targetTitle, 80)}"`);
      console.log(`       signals: ${c.signals.map((s) => `${s.type}:${s.detail}`).join(', ')}`);
    });

    const ans = (await rl.question('\n  Action [a]ll / [n]one / [s]kip / [1,3] indexes / [q]uit: ')).trim();
    if (ans === 'q') {
      writeQueue(path, queue);
      console.log('review: saved progress, exiting.');
      rl.close();
      return;
    }
    if (ans === 's' || ans === '') {
      // Skip = leave decision null, advance.
      continue;
    }

    const allIds = entry.candidates.map((c) => c.targetId);
    let acceptedIds: string[] = [];
    if (ans === 'a') {
      acceptedIds = [...allIds];
    } else if (ans === 'n') {
      acceptedIds = [];
    } else {
      const indexes = ans
        .split(/[\s,]+/)
        .map((t) => Number(t))
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= entry.candidates.length);
      if (indexes.length === 0) {
        console.log('  unrecognized input — skipping (leaves entry unreviewed).');
        continue;
      }
      acceptedIds = indexes.map((idx) => allIds[idx - 1]);
    }

    entry.decision = {
      accepted: acceptedIds,
      rejected: allIds.filter((id) => !acceptedIds.includes(id)),
    };
    entry.reviewedAt = new Date().toISOString();

    queue.stats = recomputeStats(queue);
    writeQueue(path, queue); // persist after each decision
  }

  rl.close();
  console.log(`\nreview: done. ${queue.stats.accepted} accepted / ${queue.stats.skipped} skipped.`);
  console.log(`next: npx tsx scripts/data-relations/review.ts apply ${path} --dry-run`);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}

// ── Subcommand: apply ───────────────────────────────────────────────────

function cmdApply(args: Args): void {
  const path = args.positional[0];
  if (!path) {
    console.error('apply: pass a queue file path');
    process.exit(2);
  }
  const dryRun = args.flags['dry-run'] === true || args.flags['dry-run'] === 'true';
  const queue = readQueue(path);
  const decided = queue.entries.filter((e) => e.decision !== null && e.decision.accepted.length > 0);
  if (decided.length === 0) {
    console.log('apply: no accepted entries — nothing to write.');
    return;
  }

  // Same-side updates first, then bidirectional.
  const sameSide = loadSource(queue.domain);
  const sibling = SIBLING[queue.domain];
  const otherSide = loadSource(sibling.domain);

  const sameResults: ReturnType<typeof applyAcceptedToRecord>[] = [];
  const otherResults: ReturnType<typeof applyAcceptedToRecord>[] = [];

  for (const entry of decided) {
    const accepted = entry.decision!.accepted;
    sameResults.push(applyAcceptedToRecord(sameSide, queue.domain, queue.field, entry.id, accepted));
    // Reverse: each accepted target gets `entry.id` added on the other side.
    for (const targetId of accepted) {
      otherResults.push(applyAcceptedToRecord(otherSide, sibling.domain, sibling.field, targetId, [entry.id]));
    }
  }

  if (dryRun) {
    console.log('apply (dry-run): would update');
    summarize(`  ${sameSide.path}`, sameResults);
    summarize(`  ${otherSide.path}`, otherResults);
    return;
  }

  persist(sameSide);
  persist(otherSide);
  console.log(`apply: wrote ${sameSide.path} + ${otherSide.path}; running prettier ...`);
  runPrettier([sameSide.path, otherSide.path]);
  console.log('apply: done.');
  console.log('next: npm run check && npm run build && npm run check:dist');
}

function summarize(label: string, results: ReturnType<typeof applyAcceptedToRecord>[]): void {
  const found = results.filter((r) => r.found);
  const missed = results.filter((r) => !r.found && r.after.length > 0);
  console.log(label);
  console.log(`    records updated: ${found.length}`);
  if (missed.length > 0) {
    console.log(`    records not found (skipped): ${missed.map((r) => r.recordId).join(', ')}`);
  }
  for (const r of found.slice(0, 10)) {
    const beforeLen = r.before?.length ?? 0;
    console.log(`    ${r.recordId}: ${beforeLen} → ${r.after.length}`);
  }
  if (found.length > 10) console.log(`    ... and ${found.length - 10} more`);
}

// ── Help ────────────────────────────────────────────────────────────────

function cmdHelp(): void {
  console.log(
    [
      'data-relations review queue — fill empty cross-references in src/data/*.ts',
      '',
      'Subcommands:',
      '  list                                       Empty-field summary',
      '  queue --domain=X --field=Y [--limit=N]     Build a review queue JSON',
      '  status                                     List existing queue files',
      '  review <queue-file>                        Interactive accept/reject',
      '  apply <queue-file> [--dry-run]             Write accepted relations back',
      '',
      'Pairs:',
      '  --domain=debates  --field=relatedPolicyIds',
      '  --domain=policies --field=relatedDebateIds',
      '',
      'Design: docs/20260507-data-relations-review-queue-design.md',
    ].join('\n')
  );
}

// ── Main ────────────────────────────────────────────────────────────────

const args = parseArgv(process.argv);

(async () => {
  switch (args.cmd) {
    case 'list':
      cmdList();
      break;
    case 'queue':
      cmdQueue(args);
      break;
    case 'status':
      cmdStatus();
      break;
    case 'review':
      await cmdReview(args);
      break;
    case 'apply':
      cmdApply(args);
      break;
    case 'help':
    case '--help':
    case '-h':
      cmdHelp();
      break;
    default:
      console.error(`unknown subcommand: ${args.cmd}`);
      cmdHelp();
      process.exit(2);
  }
})();

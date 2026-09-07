// scripts/refresh/ecosystem/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for ecosystem refresh. Same shape as policies/run.ts.

import { resolve } from 'node:path';

import { loadState, saveState } from '../../lib/state.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { ensureClaudeAuthed } from '../../lib/llm.ts';
import { scan, readExistingEcosystemUrls, readExistingEcosystemIdentity } from './scan.ts';
import { enrich, type DroppedCandidate } from './enrich.ts';
import { emit } from './emit.ts';
import { DEFAULT_MAX_AGE_DAYS } from './sources.ts';
import { mergeRejectedUrls } from '../../lib/rejected-urls.ts';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  onlyDomain: string | null;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
  /** Old-news window; 0 disables. */
  maxAgeDays: number;
}

/** Scan over-collects so enrich can drop stale / off-topic / non-entity
 *  pages and still reach --limit accepted entries. */
const SCAN_POOL_MULTIPLIER = 4;

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  const onlyArg = argv.find((a) => a.startsWith('--only-domain='));
  const maxAgeArg = argv.find((a) => a.startsWith('--max-age-days='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 5,
    onlyDomain: onlyArg ? onlyArg.split('=')[1] : null,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
    maxAgeDays: maxAgeArg ? Number(maxAgeArg.split('=')[1]) : DEFAULT_MAX_AGE_DAYS,
  };
}

function formatDropped(dropped: DroppedCandidate[]): string {
  if (dropped.length === 0) return '';
  const lines = ['', '## Dropped before emit', ''];
  lines.push('Not proposed. Delete a line from the reject ledger or re-run with `--max-age-days=0` to override.');
  lines.push('');
  for (const d of dropped) lines.push(`- **${d.reason}** — ${d.sourceUrl} — ${d.detail}`);
  return lines.join('\n');
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[ecosystem-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan only\n');
  process.stdout.write(
    flags.maxAgeDays > 0 ? `  old-news window: ${flags.maxAgeDays} days\n` : '  old-news window: disabled\n'
  );

  // Preflight: prove `claude -p` can run inference before per-candidate AI
  // work. `claude --version` still passes with an expired token; fail fast here
  // with one clear message. Skip for --dry-run (scan only, no LLM).
  if (!flags.dryRun) {
    ensureClaudeAuthed();
    process.stdout.write('  preflight: claude auth OK\n');
  }

  const existingUrls = readExistingEcosystemUrls();
  process.stdout.write(`  existing ecosystem URLs: ${existingUrls.size}\n`);
  const rejectedCount = mergeRejectedUrls('ecosystem', existingUrls);
  if (rejectedCount > 0) process.stdout.write(`  rejected ecosystem URLs (skipped): ${rejectedCount}\n`);

  const state = loadState();
  // URLs the old-news gate already dropped on this machine: skip without
  // re-fetching, so an archive-heavy sitemap cannot clog every run's pool.
  const knownStale = new Set(state.domains.ecosystem.staleUrls ?? []);
  if (flags.maxAgeDays > 0) {
    for (const u of knownStale) existingUrls.add(u);
    if (knownStale.size > 0) process.stdout.write(`  known-stale URLs (skipped): ${knownStale.size}\n`);
  }

  const scanResult = await scan({
    state,
    existingUrls,
    dryRun: flags.dryRun,
    limit: flags.limit * SCAN_POOL_MULTIPLIER,
    onlyDomain: flags.onlyDomain || undefined,
    maxAgeDays: flags.maxAgeDays,
  });

  process.stdout.write(
    `  scan: ${scanResult.candidates.length} candidates (pool for --limit=${flags.limit}) from ${scanResult.perSource.length} sources\n`
  );
  for (const s of scanResult.perSource) {
    const errMark = s.error ? ` ⚠ ${s.error.slice(0, 80)}` : '';
    const staleMark = s.stale > 0 ? `, ${s.stale} stale` : '';
    process.stdout.write(`    ${s.domain}: ${s.matched}/${s.checked}${staleMark}${errMark}\n`);
  }

  if (scanResult.candidates.length === 0) {
    process.stdout.write('\n[ecosystem-refresh] no candidates. exiting.\n');
    saveState(state);
    return;
  }

  process.stdout.write('\n  Candidates:\n');
  for (const c of scanResult.candidates.slice(0, 10)) {
    process.stdout.write(`    [${c.domain}] ${c.hintedTitle || c.sourceUrl}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[ecosystem-refresh] dry-run complete.\n');
    return;
  }

  process.stdout.write('\n  Enriching...\n');
  // Gates live in enrich.ts (old-news → summary → empty-shell → AI judge →
  // entity extraction → already-covered); it stops at --limit accepted.
  const enrichResult = await enrich(scanResult.candidates, {
    force: flags.force,
    maxAgeDays: flags.maxAgeDays,
    targetCount: flags.limit,
    existing: readExistingEcosystemIdentity(),
  });
  process.stdout.write(
    `  enriched: ${enrichResult.enriched.length}, dropped: ${enrichResult.dropped.length}, failures: ${enrichResult.failures.length}\n`
  );
  for (const e of enrichResult.enriched) {
    process.stdout.write(`    ✓ ${e.entity.nameEn} [${e.entity.entityType ?? e.candidate.defaultEntityType}] ← ${e.headlineEn}\n`);
  }

  // Remember stale URLs so later scans skip them without a fetch.
  const staleNow = enrichResult.dropped.filter((d) => d.reason === 'stale').map((d) => d.sourceUrl);
  if (staleNow.length > 0) {
    const merged = new Set([...(state.domains.ecosystem.staleUrls ?? []), ...staleNow]);
    state.domains.ecosystem.staleUrls = [...merged].slice(-2000);
  }

  if (enrichResult.enriched.length === 0) {
    process.stdout.write('\n[ecosystem-refresh] no enriched items. exiting.\n');
    saveState(state);
    return;
  }

  // Translate entity name + description to ja + ko.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const flat = enrichResult.enriched.flatMap((e) => [e.entity.nameZh, e.summary.description]);
    const [jaValues, koValues] = await Promise.all([
      translateBatch(flat, { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }),
      translateBatch(flat, { direction: 'zh→ko', cacheDir: 'scripts/i18n/data/ko-cache' }),
    ]);
    for (let i = 0; i < enrichResult.enriched.length; i++) {
      enrichResult.enriched[i].entity.nameJa = jaValues[i * 2] || undefined;
      enrichResult.enriched[i].summary.descriptionJa = jaValues[i * 2 + 1] || undefined;
      enrichResult.enriched[i].entity.nameKo = koValues[i * 2] || undefined;
      enrichResult.enriched[i].summary.descriptionKo = koValues[i * 2 + 1] || undefined;
    }
    process.stdout.write(`  translated ${enrichResult.enriched.length} entries to ja + ko\n`);
  } catch (e) {
    process.stdout.write(`  [warn] ja/ko translation failed: ${e instanceof Error ? e.message : e}\n`);
  }

  process.stdout.write('\n  Emitting...\n');
  const emitResult = emit(enrichResult.enriched);
  process.stdout.write(`  added ${emitResult.recordsAdded} records\n`);
  for (const [cat, n] of Object.entries(emitResult.perCategory)) {
    if (n > 0) process.stdout.write(`    ${cat}: +${n}\n`);
  }

  if (flags.noCommit) {
    process.stdout.write('\n[ecosystem-refresh] --no-commit: stopping.\n');
    return;
  }

  // Pending-review entries don't get addedAt (set when promoted), so they
  // do not surface on the homepage feed via src/utils/derived-updates.ts.
  // This is intentional — humans review before public exposure.

  process.stdout.write('\n  Committing...\n');
  const commit = autoCommit({
    domain: 'ecosystem',
    files: [resolve('src/data/ecosystem.ts')],
    message: `data(ecosystem): refresh +${emitResult.recordsAdded} entries (pending review)`,
    allowDirtyPaths: ['scripts/refresh/ecosystem/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}\n  sha: ${commit.sha}\n`);

  let prUrl = '';
  let prNumber = 0;
  if (!flags.noPush) {
    process.stdout.write('\n  Pushing + opening PR...\n');
    const body = buildPRBody({
      domain: 'ecosystem',
      diffStat: commit.diffStat,
      newEntries: enrichResult.enriched.map((e) => ({
        title: `${e.entity.nameEn} (${e.summary.category}) — from "${e.headlineEn}"`,
        sourceUrl: e.candidate.sourceUrl,
        confidence: e.summary.confidence,
      })),
      failedSources: enrichResult.failures.map((f) => ({ url: f.sourceUrl, error: f.error })),
      checksPassed: [
        'i18n-pair (post-emit rollback guard)',
        `old-news gate (${flags.maxAgeDays} days)`,
        'entity-name extraction (record named after the entity, not the headline)',
      ],
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] ecosystem: +${emitResult.recordsAdded} entries (pending review)`,
      body:
        body +
        formatDropped(enrichResult.dropped) +
        '\n\n> All entries marked `_pendingReview: true` and hidden from listing pages until you flip the flag.',
      labels: ['data-refresh', 'ecosystem', 'pending-review'],
    });
    if (prResult.error) process.stdout.write(`  ⚠ PR step error: ${prResult.error}\n`);
    if (prResult.pr) {
      prUrl = prResult.pr.url;
      prNumber = prResult.pr.number;
      process.stdout.write(`  PR: ${prUrl}\n`);
    }
  }

  saveState(state);

  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write('\n[ecosystem-refresh] DONE\n');
  process.stdout.write(JSON.stringify({
    domain: 'ecosystem',
    added: emitResult.recordsAdded,
    failures: enrichResult.failures.length,
    branch: commit.branch,
    sha: commit.sha,
    pr_url: prUrl || null,
    pr_number: prNumber || null,
    elapsed_seconds: elapsed,
  }) + '\n');
}

await main();

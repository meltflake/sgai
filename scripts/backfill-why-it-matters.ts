// scripts/backfill-why-it-matters.ts
// ────────────────────────────────────────────────────────────────────────
// Backfill `whyItMatters` (+ En / Ja / Ko) on policies / videos / debates.
//
//   npx tsx scripts/backfill-why-it-matters.ts --only=policies --limit=3 --dry-run
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/backfill-why-it-matters.ts --only=policies,videos,debates
//
// Flags: --only=<kinds>  comma list of policies|videos|debates (default all)
//        --limit=N       first N records per kind that still lack the field
//        --dry-run       draft + translate, print, do not write
//        --force         re-draft even when the record already has whyItMatters
//        --concurrency=N parallel LLM drafts (default 3)
//        --model=<alias> draft model (default sonnet; translations use haiku)
//
// How it writes: pure text patching, no AST rewrite (would destroy comments
// and Prettier wrapping — see scripts/i18n/backfill-ko.ts). For each record
// it finds the `id: '<id>'` line, then the record's `summaryKo:` value, and
// inserts four sibling lines after that value. The proposed file must pass
// the TypeScript parser before it is written; then Prettier reflows it.
// Drafts and translations are sha256-cached, so a crash costs nothing and
// a re-run resumes.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { categories as policyCategories } from '../src/data/policies';
import { videos } from '../src/data/videos';
import { debates } from '../src/data/debates';
import { getVideoDigest } from '../src/data/video-transcripts';
import { draftWhyItMatters, type WhyInput, type WhyKind } from './lib/why-it-matters.ts';
import { translateBatch } from './lib/translate.ts';
import { ensureClaudeAvailable, ensureClaudeAuthed } from './lib/llm.ts';
import { tsParseDiagnostics } from './i18n/backfill-ko.ts';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const DRAFT_CACHE = resolve(REPO_ROOT, 'scripts/data/cache/why-it-matters');
const TRANSLATE_CACHE = resolve(REPO_ROOT, 'scripts/data/cache/why-it-matters-translate');

interface Args {
  only: WhyKind[];
  limit?: number;
  dryRun: boolean;
  force: boolean;
  concurrency: number;
  model?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { only: ['policy', 'video', 'debate'], dryRun: false, force: false, concurrency: 3 };
  for (const a of argv) {
    if (a.startsWith('--only=')) {
      const alias: Record<string, WhyKind> = {
        policies: 'policy',
        policy: 'policy',
        videos: 'video',
        video: 'video',
        debates: 'debate',
        debate: 'debate',
      };
      const kinds = a
        .slice(7)
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
        .map((k) => {
          if (!alias[k]) throw new Error(`unknown kind: ${k}`);
          return alias[k];
        });
      args.only = kinds;
    } else if (a.startsWith('--limit=')) args.limit = parseInt(a.slice(8), 10);
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a.startsWith('--concurrency=')) args.concurrency = Math.max(1, parseInt(a.slice(14), 10));
    else if (a.startsWith('--model=')) args.model = a.slice(8);
    else if (a === '--help') {
      process.stdout.write(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 20).join('\n') + '\n');
      process.exit(0);
    } else throw new Error(`unknown flag: ${a}`);
  }
  return args;
}

// ── Inputs per kind ─────────────────────────────────────────────────────

interface Target {
  kind: WhyKind;
  file: string;
  input: WhyInput;
  hasExisting: boolean;
}

const clip = (s: string | undefined, n: number) => (s ? (s.length > n ? s.slice(0, n) + '…' : s) : undefined);

function targets(kind: WhyKind): Target[] {
  if (kind === 'policy') {
    return policyCategories
      .flatMap((c) => c.policies)
      .filter((p) => p.id)
      .map((p) => ({
        kind,
        file: 'src/data/policies.ts',
        hasExisting: Boolean(p.whyItMatters),
        input: {
          kind,
          id: p.id!,
          title: p.title,
          date: p.date,
          actors: p.source,
          summary: p.summary,
          detail: clip(p.content, 1500),
          sourceUrl: p.sourceUrl,
        },
      }));
  }
  if (kind === 'video') {
    return videos.map((v) => {
      const digest = getVideoDigest(v.id, 'zh');
      const detail = digest ? [...(digest.keyPoints ?? []), digest.narrative ?? ''].filter(Boolean).join('；') : undefined;
      return {
        kind,
        file: 'src/data/videos.ts',
        hasExisting: Boolean(v.whyItMatters),
        input: {
          kind,
          id: v.id,
          title: v.title,
          date: v.date,
          actors: `${v.speaker}（${v.speakerTitle}）· ${v.channel}`,
          summary: v.summary,
          detail: clip(detail, 1500),
          sourceUrl: v.youtubeUrl,
        },
      };
    });
  }
  return debates.map((d) => ({
    kind,
    file: 'src/data/debates.ts',
    hasExisting: Boolean(d.whyItMatters),
    input: {
      kind,
      id: d.id,
      title: d.title,
      date: d.date,
      actors: d.speakers.join('、'),
      summary: d.summary,
      detail: clip([...d.keyPoints, d.policySignal ?? ''].filter(Boolean).join('；'), 1500),
      sourceUrl: d.sourceUrl,
    },
  }));
}

// ── Text patching ───────────────────────────────────────────────────────

function quote(s: string): string {
  // Prettier's rule: single quotes unless the string contains more single
  // than double quotes. Mirror it so the post-write Prettier pass is a no-op
  // on these lines. Backslashes always escaped.
  const singles = (s.match(/'/g) ?? []).length;
  const doubles = (s.match(/"/g) ?? []).length;
  const q = singles > doubles ? '"' : "'";
  const escaped = s.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), `\\${q}`).replace(/\n/g, ' ');
  return `${q}${escaped}${q}`;
}

interface Patch {
  id: string;
  zh: string;
  en: string;
  ja: string;
  ko: string;
}

/**
 * Find where to insert for `id` in `lines`: the index of the last line of the
 * record's `summaryKo:` value, plus the indent to use. Returns null when the
 * record or its summaryKo cannot be located unambiguously.
 */
function findInsertPoint(lines: string[], id: string): { after: number; indent: string } | null {
  const idRe = new RegExp(`^\\s*id:\\s*['"\`]${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`],?\\s*$`);
  const idLine = lines.findIndex((l) => idRe.test(l));
  if (idLine < 0) return null;
  for (let i = idLine + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (/^\s*id:\s*['"`]/.test(l)) return null; // ran into the next record
    if (/^\s*whyItMatters:/.test(l)) return null; // already present
    const m = l.match(/^(\s*)summaryKo:\s*(.*)$/);
    if (!m) continue;
    const indent = m[1];
    // Value may start on this line or the next; it ends on the first line
    // whose trimmed tail is a closing quote followed by a comma.
    for (let j = i; j < Math.min(i + 40, lines.length); j += 1) {
      if (/['"`],\s*$/.test(lines[j]) && (j > i || m[2].length > 0)) return { after: j, indent };
    }
    return null;
  }
  return null;
}

function applyPatches(file: string, patches: Patch[], dryRun: boolean): { inserted: number; skipped: string[] } {
  const abs = resolve(REPO_ROOT, file);
  const original = readFileSync(abs, 'utf8');
  const lines = original.split('\n');
  const plan: Array<{ after: number; indent: string; p: Patch }> = [];
  const skipped: string[] = [];
  for (const p of patches) {
    const at = findInsertPoint(lines, p.id);
    if (!at) {
      skipped.push(p.id);
      continue;
    }
    plan.push({ ...at, p });
  }
  plan.sort((a, b) => b.after - a.after);
  for (const { after, indent, p } of plan) {
    lines.splice(
      after + 1,
      0,
      `${indent}whyItMatters: ${quote(p.zh)},`,
      `${indent}whyItMattersEn: ${quote(p.en)},`,
      `${indent}whyItMattersJa: ${quote(p.ja)},`,
      `${indent}whyItMattersKo: ${quote(p.ko)},`
    );
  }
  const proposed = lines.join('\n');
  const errors = tsParseDiagnostics(abs, proposed);
  if (errors.length > 0) {
    process.stderr.write(`  ❌ ${file}: proposed text fails TS parse — not written\n`);
    for (const e of errors.slice(0, 5)) process.stderr.write(`     ${e}\n`);
    return { inserted: 0, skipped: patches.map((p) => p.id) };
  }
  if (!dryRun) {
    writeFileSync(abs, proposed);
    const r = spawnSync('npx', ['prettier', '--write', file], { cwd: REPO_ROOT, stdio: 'ignore' });
    if (r.status !== 0) process.stderr.write(`  WARN prettier exit ${r.status} on ${file}\n`);
  }
  return { inserted: plan.length, skipped };
}

// ── Main ────────────────────────────────────────────────────────────────

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureClaudeAvailable();
  ensureClaudeAuthed(args.model);
  const timeoutMs = Number(process.env.SGAI_LLM_TIMEOUT_MS || 300000);

  for (const kind of args.only) {
    let list = targets(kind).filter((t) => args.force || !t.hasExisting);
    if (args.limit) list = list.slice(0, args.limit);
    process.stderr.write(`\n[${kind}] ${list.length} record(s) to draft\n`);
    if (list.length === 0) continue;

    // 1) zh drafts (cached, concurrent)
    const drafted = await pool(list, args.concurrency, async (t) => {
      try {
        const d = await draftWhyItMatters(t.input, { cacheDir: DRAFT_CACHE, model: args.model, force: args.force, timeoutMs });
        process.stderr.write(`  ✓ ${t.input.id}: ${d.whyItMatters}\n`);
        return { t, zh: d.whyItMatters };
      } catch (e) {
        process.stderr.write(`  ✗ ${t.input.id}: ${(e as Error).message}\n`);
        return null;
      }
    });
    const ok = drafted.filter((x): x is { t: Target; zh: string } => x !== null);

    // 2) translations (batched, cached)
    const zhs = ok.map((x) => x.zh);
    const [ens, jas, kos] = await Promise.all([
      translateBatch(zhs, { direction: 'zh→en', cacheDir: TRANSLATE_CACHE, signal: undefined }),
      translateBatch(zhs, { direction: 'zh→ja', cacheDir: TRANSLATE_CACHE }),
      translateBatch(zhs, { direction: 'zh→ko', cacheDir: TRANSLATE_CACHE }),
    ]);
    const patches: Patch[] = ok.map((x, i) => ({ id: x.t.input.id, zh: x.zh, en: ens[i], ja: jas[i], ko: kos[i] }));
    const bad = patches.filter((p) => !p.en || !p.ja || !p.ko);
    if (bad.length) process.stderr.write(`  WARN ${bad.length} record(s) missing a translation — skipped: ${bad.map((b) => b.id).join(', ')}\n`);
    const good = patches.filter((p) => p.en && p.ja && p.ko);

    // 3) write
    const file = list[0].file;
    const r = applyPatches(file, good, args.dryRun);
    process.stderr.write(`[${kind}] ${args.dryRun ? 'DRY-RUN ' : ''}inserted ${r.inserted}, skipped ${r.skipped.length}${r.skipped.length ? ' (' + r.skipped.join(', ') + ')' : ''}\n`);
    if (args.dryRun) {
      for (const p of good) process.stdout.write(`${p.id}\n  zh: ${p.zh}\n  en: ${p.en}\n  ja: ${p.ja}\n  ko: ${p.ko}\n`);
    }
  }
}

main().catch((e) => {
  process.stderr.write(`${(e as Error).stack ?? e}\n`);
  process.exit(1);
});

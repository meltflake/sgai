// scripts/backfill-addedAt.ts
// ────────────────────────────────────────────────────────────────────────
// Backfill `addedAt` on pre-rule records by inferring each record's first
// appearance from git history. CLAUDE.md rule #7 promised exactly this
// ("回填工作可由 scripts/backfill-addedAt.ts（用 git log 推断首次出现日期）
// 单独 PR 完成") — built 2026-07-31 because the homepage domain-directory
// cards for startups / talent / benchmarking rendered no "latest addition"
// line: their records predate the addedAt rule, and the derive layer
// (src/utils/derived-updates.ts) skips records without the field.
//
// Scope: only the arrays the homepage harvest actually reads —
//   - startups.ts   verticals[].startups   (anchored by `name:` — no ids)
//   - talent.ts     programmes[]           (anchored by `id:`)
//   - benchmarking.ts benchmarkCases[]     (anchored by `id:`)
// levers/tracker are deliberately excluded: their harvest granularity is
// the 6 structural levers / 6 dashboard dimensions, where a backfilled
// "addition date" is meaningless as news.
//
// Method per record lacking addedAt:
//   1. anchor literal = `id: 'xxx'` (or `name: 'xxx'`), must appear
//      EXACTLY once in the data file — ambiguous anchors are skipped with
//      a warning, never guessed.
//   2. first-appearance date = `git log --follow --reverse --format=%as
//      -S"<anchor>" -- <file>` first line. This is "the day the record
//      entered the repo", which is what addedAt means (not the real-world
//      event date). Records older than the repo resolve to the initial
//      import commit — truthful for this repo's history.
//   3. insert `addedAt: 'YYYY-MM-DD',` on the line after the anchor.
//
// USAGE:
//   npx tsx scripts/backfill-addedAt.ts --dry-run   # report only
//   npx tsx scripts/backfill-addedAt.ts             # write files
//
// Idempotent: records that already carry addedAt are never touched, so
// re-running after new pipeline-emitted records is a no-op for them.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatWithPrettier } from './lib/prettier-format.ts';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = resolve('.');

interface TargetRecord {
  /** Property used to locate the record in source ('id' or 'name'). */
  anchorProp: 'id' | 'name';
  anchorValue: string;
}

interface Target {
  file: string;
  records: TargetRecord[];
}

function escapeForSource(v: string): string {
  return v.replace(/'/g, "\\'");
}

/** First commit date (author date, YYYY-MM-DD) that introduced the anchor
 *  string into the file. Empty string when git finds nothing. */
function firstAppearance(file: string, anchorLiteral: string): string {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--reverse', '--format=%as', `-S${anchorLiteral}`, '--', file],
      { cwd: ROOT, encoding: 'utf-8' }
    );
    return out.split('\n').find((l) => l.trim()) ?? '';
  } catch {
    return '';
  }
}

async function collectTargets(): Promise<Target[]> {
  const { verticals } = await import('../src/data/startups.ts');
  const { programmes } = await import('../src/data/talent.ts');
  const { benchmarkCases } = await import('../src/data/benchmarking.ts');

  const startupRecords: TargetRecord[] = verticals
    .flatMap((v: { startups: Array<{ name: string; addedAt?: string }> }) => v.startups)
    .filter((r) => !r.addedAt)
    .map((r) => ({ anchorProp: 'name' as const, anchorValue: r.name }));

  const talentRecords: TargetRecord[] = programmes
    .filter((r: { id: string; addedAt?: string }) => !r.addedAt)
    .map((r: { id: string }) => ({ anchorProp: 'id' as const, anchorValue: r.id }));

  const benchmarkRecords: TargetRecord[] = benchmarkCases
    .filter((r: { id: string; addedAt?: string }) => !r.addedAt)
    .map((r: { id: string }) => ({ anchorProp: 'id' as const, anchorValue: r.id }));

  return [
    { file: 'src/data/startups.ts', records: startupRecords },
    { file: 'src/data/talent.ts', records: talentRecords },
    { file: 'src/data/benchmarking.ts', records: benchmarkRecords },
  ];
}

async function main(): Promise<void> {
  const targets = await collectTargets();
  let written = 0;
  let skipped = 0;

  for (const target of targets) {
    const abs = resolve(ROOT, target.file);
    let src = readFileSync(abs, 'utf8');
    const inserts: Array<{ anchorLine: string; date: string }> = [];

    process.stdout.write(`\n${target.file}: ${target.records.length} record(s) missing addedAt\n`);

    for (const rec of target.records) {
      const anchorLiteral = `${rec.anchorProp}: '${escapeForSource(rec.anchorValue)}'`;
      // Anchor must be unique in the file, or the insertion is ambiguous.
      const occurrences = src.split(anchorLiteral).length - 1;
      if (occurrences !== 1) {
        process.stdout.write(`  ! SKIP (${occurrences} occurrences): ${anchorLiteral}\n`);
        skipped += 1;
        continue;
      }
      const date = firstAppearance(target.file, anchorLiteral);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        process.stdout.write(`  ! SKIP (no git history match): ${anchorLiteral}\n`);
        skipped += 1;
        continue;
      }
      inserts.push({ anchorLine: anchorLiteral, date });
      process.stdout.write(`  ${date}  ${rec.anchorValue}\n`);
    }

    if (DRY_RUN || inserts.length === 0) continue;

    for (const ins of inserts) {
      // Insert after the anchor's line. The anchor is unique (checked), so
      // a plain indexOf → end-of-line split is exact.
      const at = src.indexOf(ins.anchorLine);
      const lineEnd = src.indexOf('\n', at);
      const lineStart = src.lastIndexOf('\n', at) + 1;
      const indent = src.slice(lineStart).match(/^\s*/)?.[0] ?? '    ';
      src = `${src.slice(0, lineEnd + 1)}${indent}addedAt: '${ins.date}',\n${src.slice(lineEnd + 1)}`;
      written += 1;
    }
    writeFileSync(abs, src);
    formatWithPrettier(abs);
  }

  process.stdout.write(`\n${DRY_RUN ? '[dry-run] would write' : 'wrote'} ${written} addedAt field(s), skipped ${skipped}\n`);
  if (skipped > 0) process.exitCode = 0; // skips are reported, not fatal
}

await main();

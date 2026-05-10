// scripts/evals/addedAt-coverage/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the bug class that bit us on 2026-05-09 (commit a608bc0): a data
// file gets new records but src/data/updates.ts is never touched, so the
// homepage "最近更新" feed silently misses them.
//
// Architecture: src/utils/derived-updates.ts harvests every data record
// with `addedAt` and produces a homepage update entry. So the only thing
// a contributor must remember when adding a record is to set `addedAt`.
// This eval enforces that.
//
// Logic:
//   For each tracked data file (videos / policies / debates / ...):
//     git diff <base>..HEAD -- <file> → look at added lines
//     count `+    id: '...'` lines (each = one new record)
//     count `+    addedAt: '...'` lines (each = addedAt set on a record)
//     if newRecords > newAddedAts → FAIL: some new records missing addedAt
//
// Flags:
//   --base=<ref>            Base ref for diff (default: 'main')
//   --include-historical    Also flag records currently lacking addedAt
//                           in HEAD (audit mode — ignores diff). Useful
//                           for one-off backlog reports.
//   --dry-run               Skip writing JSON/MD reports
//
// Exit codes:
//   0 — every new record has addedAt
//   1 — at least one new record lacks addedAt
//   2 — invocation error

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Tracked data files. The list mirrors src/utils/derived-updates.ts —
// keep these two in sync when adding a new harvester.
const DATA_FILES = [
  'src/data/videos.ts',
  'src/data/policies.ts',
  'src/data/debates.ts',
  'src/data/people.ts',
  'src/data/tracker.ts',
  'src/data/benchmarking.ts',
  'src/data/ecosystem.ts',
  'src/data/levers.ts',
  'src/data/startups.ts',
  'src/data/legal-ai.ts',
  'src/data/talent.ts',
];

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REPORT_DIR = join(import.meta.dirname, 'reports');

interface CliOptions {
  base: string;
  includeHistorical: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = {
    base: process.env.GITHUB_BASE_REF || 'main',
    includeHistorical: false,
    dryRun: false,
  };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--include-historical') opts.includeHistorical = true;
    else if (a.startsWith('--base=')) opts.base = a.slice('--base='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:addedAt-coverage [--base=<ref>] [--include-historical] [--dry-run]\n' +
          '\nDefault scans `git diff <base>..HEAD` (PR mode). Use --include-historical to scan all of HEAD (audit mode).\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`git ${args.join(' ')} failed: ${msg}`);
  }
}

interface DiffStats {
  newRecordIds: string[]; // ids extracted from `+ id: 'xxx'` lines
  newAddedAtCount: number;
  // Heuristic: records added without an `id:` line (e.g. LegalItem,
  // unkeyed Startup). Each `+      {` block opener counts as one
  // "anonymous" new record.
  anonymousRecordOpens: number;
}

function diffFile(file: string, base: string): DiffStats {
  let raw: string;
  try {
    // Compare base → working tree (NOT base...HEAD). This catches both
    // committed-since-base changes AND uncommitted edits in the worktree,
    // which matters for local pre-commit runs and for catching the case
    // where someone forgot to stage `addedAt` after staging the record.
    raw = git(['diff', base, '--unified=0', '--', file]);
  } catch {
    // base ref may not exist locally (shallow clone) — bail out empty
    raw = '';
  }
  if (!raw.trim()) return { newRecordIds: [], newAddedAtCount: 0, anonymousRecordOpens: 0 };

  const newIdRe = /^\+\s*id:\s*['"]([^'"]+)['"]/;
  const newAddedAtRe = /^\+\s*addedAt:\s*['"][^'"]+['"]/;
  // Object literal opener at typical record indentation. Conservative:
  // only count `{` lines that look like the start of a new object inside
  // an array (4 or 6 leading spaces — the common record-block indent in
  // sgai data files).
  const newRecordOpenRe = /^\+\s{2,8}\{\s*$/;

  let inAddBlock = false;
  let blockHasId = false;
  let anonymousOpens = 0;
  const newRecordIds: string[] = [];
  let newAddedAtCount = 0;

  for (const line of raw.split('\n')) {
    const idMatch = line.match(newIdRe);
    if (idMatch) {
      newRecordIds.push(idMatch[1]);
      blockHasId = true;
      continue;
    }
    if (newAddedAtRe.test(line)) {
      newAddedAtCount += 1;
      continue;
    }
    if (newRecordOpenRe.test(line)) {
      if (inAddBlock && !blockHasId) anonymousOpens += 1;
      inAddBlock = true;
      blockHasId = false;
      continue;
    }
    if (line.startsWith('+') && line.includes('},')) {
      if (inAddBlock && !blockHasId) anonymousOpens += 1;
      inAddBlock = false;
      blockHasId = false;
    }
  }
  if (inAddBlock && !blockHasId) anonymousOpens += 1;

  return { newRecordIds, newAddedAtCount, anonymousRecordOpens: anonymousOpens };
}

interface FileFinding {
  file: string;
  newRecords: number; // ids + anonymous record opens
  newAddedAt: number;
  missing: number; // newRecords - newAddedAt
  newRecordIds: string[];
  status: 'PASS' | 'FAIL';
}

function scanDiffMode(opts: CliOptions): FileFinding[] {
  const out: FileFinding[] = [];
  for (const file of DATA_FILES) {
    const d = diffFile(file, opts.base);
    const newRecords = d.newRecordIds.length + d.anonymousRecordOpens;
    if (newRecords === 0) continue;
    const missing = Math.max(0, newRecords - d.newAddedAtCount);
    out.push({
      file,
      newRecords,
      newAddedAt: d.newAddedAtCount,
      missing,
      newRecordIds: d.newRecordIds,
      status: missing > 0 ? 'FAIL' : 'PASS',
    });
  }
  return out;
}

interface HistoricalFinding {
  file: string;
  totalRecords: number;
  withAddedAt: number;
  coveragePct: number;
}

function scanHistorical(): HistoricalFinding[] {
  const out: HistoricalFinding[] = [];
  for (const file of DATA_FILES) {
    const abs = join(REPO_ROOT, file);
    if (!existsSync(abs)) continue;
    const src = readFileSync(abs, 'utf8');
    // Count `id: 'xxx'` patterns (one per record-with-id)
    const idCount = (src.match(/^\s*id:\s*['"][^'"]+['"]/gm) || []).length;
    const addedAtCount = (src.match(/^\s*addedAt:\s*['"][^'"]+['"]/gm) || []).length;
    if (idCount === 0) continue;
    out.push({
      file,
      totalRecords: idCount,
      withAddedAt: addedAtCount,
      coveragePct: Math.round((100 * addedAtCount) / idCount),
    });
  }
  return out;
}

function writeReport(
  diffFindings: FileFinding[],
  historical: HistoricalFinding[] | null,
  opts: CliOptions,
) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);
  const fail = diffFindings.filter((f) => f.status === 'FAIL').length;
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        opts,
        diffFindings,
        historical,
        totals: { inspected: diffFindings.length, fail },
      },
      null,
      2,
    ) + '\n',
  );
  const lines: string[] = [];
  lines.push(`# addedAt Coverage Report — ${stamp}`);
  lines.push('');
  lines.push(`Mode: ${opts.includeHistorical ? 'historical (audit)' : `diff vs ${opts.base}`}`);
  lines.push(`Inspected files with new records: ${diffFindings.length}`);
  lines.push(`**FAIL: ${fail}**`);
  lines.push('');
  if (fail > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const f of diffFindings.filter((x) => x.status === 'FAIL')) {
      lines.push(
        `- \`${f.file}\` — added ${f.newRecords} record${f.newRecords > 1 ? 's' : ''} but only ${f.newAddedAt} addedAt → ${f.missing} missing`,
      );
      if (f.newRecordIds.length > 0) {
        lines.push(`  - ids in diff: ${f.newRecordIds.map((i) => `\`${i}\``).join(', ')}`);
      }
      lines.push(
        `  - fix: add \`addedAt: '${new Date().toISOString().slice(0, 10)}',\` to each new record block`,
      );
    }
    lines.push('');
  }
  if (historical) {
    lines.push('## Historical (audit) coverage');
    lines.push('');
    lines.push('| file | records w/ id | with addedAt | coverage |');
    lines.push('| ---- | ---: | ---: | ---: |');
    for (const h of historical) {
      lines.push(`| \`${h.file}\` | ${h.totalRecords} | ${h.withAddedAt} | ${h.coveragePct}% |`);
    }
    lines.push('');
  }
  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

function main() {
  const opts = parseCli(process.argv.slice(2));
  process.stdout.write(`[addedAt-coverage] base=${opts.base} historical=${opts.includeHistorical}\n`);

  const diffFindings = scanDiffMode(opts);
  const historical = opts.includeHistorical ? scanHistorical() : null;

  const fail = diffFindings.filter((f) => f.status === 'FAIL').length;
  process.stdout.write(
    `[addedAt-coverage] inspected files: ${diffFindings.length}, fail: ${fail}\n`,
  );
  if (fail > 0) {
    process.stdout.write('\n[addedAt-coverage] FAILED files:\n');
    for (const f of diffFindings.filter((x) => x.status === 'FAIL')) {
      process.stdout.write(
        `  ${f.file}: ${f.newRecords} new records, ${f.newAddedAt} addedAt, ${f.missing} missing\n`,
      );
      if (f.newRecordIds.length > 0) {
        process.stdout.write(`    ids: ${f.newRecordIds.join(', ')}\n`);
      }
    }
  }
  if (historical) {
    process.stdout.write('\n[addedAt-coverage] historical coverage:\n');
    for (const h of historical) {
      process.stdout.write(`  ${h.file}: ${h.withAddedAt}/${h.totalRecords} = ${h.coveragePct}%\n`);
    }
  }

  if (opts.dryRun) {
    process.stdout.write('[addedAt-coverage] --dry-run; skipping report write\n');
    process.exit(fail > 0 ? 1 : 0);
  }
  const { jsonPath, mdPath } = writeReport(diffFindings, historical, opts);
  process.stdout.write(`[addedAt-coverage] reports: ${jsonPath} ${mdPath}\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();

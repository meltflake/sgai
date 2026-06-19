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
  'src/data/voices.ts', // mddiSpeeches[] addedAt drives 'speech' derived updates
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

export interface DiffStats {
  newRecordIds: string[]; // ids extracted from `+ id: 'xxx'` lines
  newAddedAtCount: number;
  // Heuristic: records added without an `id:` line (e.g. LegalItem,
  // unkeyed Startup). Each `+      {` block opener counts as one
  // "anonymous" new record.
  anonymousRecordOpens: number;
}

// ── Pending-review exemption (CLAUDE.md rule #7) ─────────────────────────
// Pending-review records do NOT carry `addedAt` until a human promotes them,
// so the eval must not demand it. They appear in three shapes:
//   1. inside an `autoDiscovered` const array (startups / tracker / talent / benchmarking)
//   2. inside an object with a `_pendingReview` field/comment
//      (ecosystem `_pendingReview: true`; policies `// _pendingReview ...`)
//   3. inside an "Auto-discovered (pending review)" group / section (levers / legal-ai)
// exemptLineRanges scans the working-tree source and returns the 1-based line
// ranges occupied by such records; analyzeDiff maps each diff `+` line to a
// source line and drops records whose line falls inside a range.

/** Blank out string literals and `//` comments so brace/bracket counting
 *  isn't fooled by punctuation inside values. Strings are stripped first so a
 *  `//` inside a URL literal isn't mistaken for the start of a comment. */
function stripLiterals(line: string): string {
  let s = line
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, '``');
  const c = s.indexOf('//');
  if (c >= 0) s = s.slice(0, c);
  return s;
}

/** Match every balanced open/close pair across the file, returning
 *  [openLineIdx, closeLineIdx] (0-based) for each matched pair. */
function matchPairs(lines: string[], open: string, close: string): Array<[number, number]> {
  const stack: number[] = [];
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < lines.length; i += 1) {
    for (const ch of stripLiterals(lines[i])) {
      if (ch === open) stack.push(i);
      else if (ch === close) {
        const o = stack.pop();
        if (o !== undefined) pairs.push([o, i]);
      }
    }
  }
  return pairs;
}

/** Smallest pair (fewest lines) that contains `idx`, or null. */
function innermostContaining(pairs: Array<[number, number]>, idx: number): [number, number] | null {
  let best: [number, number] | null = null;
  for (const [o, c] of pairs) {
    if (o <= idx && idx <= c && (!best || c - o < best[1] - best[0])) best = [o, c];
  }
  return best;
}

export function exemptLineRanges(source: string): Array<[number, number]> {
  const lines = source.split('\n');
  const ranges: Array<[number, number]> = [];
  const bracketPairs = matchPairs(lines, '[', ']');
  const bracePairs = matchPairs(lines, '{', '}');

  for (let i = 0; i < lines.length; i += 1) {
    // (1) `export const autoDiscovered ... = [ ... ]` — the widest `[...]`
    // opening on the declaration line (skips the `AutoDiscoveredEntry[]` type).
    if (/export const autoDiscovered\b/.test(lines[i])) {
      let widest: [number, number] | null = null;
      for (const [o, c] of bracketPairs) {
        if (o === i && (!widest || c - o > widest[1] - widest[0])) widest = [o, c];
      }
      if (widest) ranges.push([widest[0] + 1, widest[1] + 1]);
    }
    // (2)/(3) `_pendingReview` field or comment, or an "Auto-discovered
    // (pending review)" marker → exempt the whole enclosing object.
    if (/_pendingReview/.test(lines[i]) || /Auto-discovered \(pending review\)/.test(lines[i])) {
      const r = innermostContaining(bracePairs, i);
      if (r) ranges.push([r[0] + 1, r[1] + 1]);
    }
  }
  return ranges;
}

/**
 * Parse a `git diff <base> --unified=0` patch for one data file and count
 * new records vs new `addedAt` fields.
 *
 * `currentSource` is the working-tree contents of the same file. Because the
 * diff is base → working tree, every `+` line maps to a line number in
 * `currentSource`; we use that mapping (via the `@@` hunk headers) to drop
 * records that live inside a pending-review region — see exemptLineRanges.
 * Pure (no git / fs) so it is unit-testable.
 */
export function analyzeDiff(diffText: string, currentSource: string): DiffStats {
  if (!diffText.trim()) return { newRecordIds: [], newAddedAtCount: 0, anonymousRecordOpens: 0 };

  const exempt = exemptLineRanges(currentSource);
  const isExempt = (n: number) => exempt.some(([a, b]) => n >= a && n <= b);

  const newIdRe = /^\+\s*id:\s*['"]([^'"]+)['"]/;
  const newAddedAtRe = /^\+\s*addedAt:\s*['"][^'"]+['"]/;
  // Object literal opener at the **outer** record indentation only (2–4
  // spaces). We deliberately exclude deeper-indented `{` openers — those
  // are sub-objects within an existing record (channels[], speakingRecord[],
  // notableQuotes[], etc. on Person; nested PolicySection on Policy) and
  // must not be counted as "new records needing addedAt." Nested records
  // that DO need addedAt (e.g. a new Policy inside an existing group) all
  // carry an `id:` field and are caught by newIdRe directly, regardless of
  // indent.
  const newRecordOpenRe = /^\+\s{2,4}\{\s*$/;
  // Hunk header carries the new-file start line — `@@ -a,b +c,d @@`. With
  // --unified=0 there are no context lines, so each subsequent `+` line is a
  // consecutive new-file line starting at c.
  const hunkRe = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

  let newLineNo = 0; // working-tree line number of the current `+` line
  let inAddBlock = false;
  let blockHasId = false;
  let blockOpenLineNo = 0;
  let anonymousOpens = 0;
  const newRecordIds: string[] = [];
  let newAddedAtCount = 0;

  for (const line of diffText.split('\n')) {
    const hunk = line.match(hunkRe);
    if (hunk) {
      newLineNo = Number(hunk[1]);
      continue;
    }
    // Diff/file headers carry no record content; deletions ('-') don't
    // advance the new-file line counter.
    if (
      line.startsWith('+++') ||
      line.startsWith('---') ||
      line.startsWith('diff ') ||
      line.startsWith('index ') ||
      line.startsWith('@@')
    ) {
      continue;
    }
    if (!line.startsWith('+')) continue;

    const lineNo = newLineNo;
    newLineNo += 1;

    const idMatch = line.match(newIdRe);
    if (idMatch) {
      blockHasId = true;
      if (!isExempt(lineNo)) newRecordIds.push(idMatch[1]);
      continue;
    }
    if (newAddedAtRe.test(line)) {
      // Symmetry with the record side: an exempt (pending-review) region
      // contributes neither records nor addedAts, so it can never mask a
      // real missing addedAt elsewhere in the file.
      if (!isExempt(lineNo)) newAddedAtCount += 1;
      continue;
    }
    if (newRecordOpenRe.test(line)) {
      if (inAddBlock && !blockHasId && !isExempt(blockOpenLineNo)) anonymousOpens += 1;
      inAddBlock = true;
      blockHasId = false;
      blockOpenLineNo = lineNo;
      continue;
    }
    if (line.includes('},')) {
      if (inAddBlock && !blockHasId && !isExempt(blockOpenLineNo)) anonymousOpens += 1;
      inAddBlock = false;
      blockHasId = false;
    }
  }
  if (inAddBlock && !blockHasId && !isExempt(blockOpenLineNo)) anonymousOpens += 1;

  return { newRecordIds, newAddedAtCount, anonymousRecordOpens: anonymousOpens };
}

function readDiffAndSource(file: string, base: string): { diffText: string; currentSource: string } {
  let diffText = '';
  try {
    // Compare base → working tree (NOT base...HEAD). This catches both
    // committed-since-base changes AND uncommitted edits in the worktree,
    // which matters for local pre-commit runs and for catching the case
    // where someone forgot to stage `addedAt` after staging the record.
    diffText = git(['diff', base, '--unified=0', '--', file]);
  } catch {
    // base ref may not exist locally (shallow clone) — bail out empty
    diffText = '';
  }
  let currentSource = '';
  const abs = join(REPO_ROOT, file);
  if (existsSync(abs)) {
    try {
      currentSource = readFileSync(abs, 'utf8');
    } catch {
      currentSource = '';
    }
  }
  return { diffText, currentSource };
}

export interface FileFinding {
  file: string;
  newRecords: number; // ids + anonymous record opens
  newAddedAt: number;
  missing: number; // newRecords - newAddedAt
  newRecordIds: string[];
  status: 'PASS' | 'FAIL';
}

/** Build a per-file finding from a diff + working-tree source. Pure. */
export function evaluateFileDiff(file: string, diffText: string, currentSource: string): FileFinding {
  const d = analyzeDiff(diffText, currentSource);
  const newRecords = d.newRecordIds.length + d.anonymousRecordOpens;
  const missing = Math.max(0, newRecords - d.newAddedAtCount);
  return {
    file,
    newRecords,
    newAddedAt: d.newAddedAtCount,
    missing,
    newRecordIds: d.newRecordIds,
    status: missing > 0 ? 'FAIL' : 'PASS',
  };
}

function scanDiffMode(opts: CliOptions): FileFinding[] {
  const out: FileFinding[] = [];
  for (const file of DATA_FILES) {
    const { diffText, currentSource } = readDiffAndSource(file, opts.base);
    const finding = evaluateFileDiff(file, diffText, currentSource);
    if (finding.newRecords === 0) continue;
    out.push(finding);
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

// Run as CLI only — importing this module (e.g. from a unit test) must not
// fire git / writeReport / process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('addedAt-coverage/check.ts')) {
  main();
}

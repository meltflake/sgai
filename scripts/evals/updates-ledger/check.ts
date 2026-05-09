// scripts/evals/updates-ledger/check.ts
// ────────────────────────────────────────────────────────────────────────
// Updates ledger coverage eval — closes the bug class where a data file
// (videos.ts / policies.ts / debates.ts / ...) gets new records added by a
// commit, but src/data/updates.ts is NOT updated, so the homepage
// "最近更新" feed silently misses the change.
//
// Originating incident: 2026-05-09. Commit a608bc0 added v059/v060 to
// videos.ts via a hand fix that bypassed scripts/refresh/videos/emit.ts
// (which is the only codepath calling appendUpdate). The 4 evals already
// in the suite (URL health + i18n A/B/C/D) had nothing covering this gap.
//
// Logic:
//   1. Look at git log of last N days for each tracked data file
//   2. For each commit that net-added records to a data file:
//        - PASS if the same commit also touched src/data/updates.ts
//        - PASS if updates.ts has an entry of the matching type within
//          ±TOLERANCE_DAYS of the commit date
//        - FAIL otherwise — emit commit sha + file + expected type
//
// Usage:
//   npx tsx scripts/evals/updates-ledger/check.ts            # default 14d window
//   npx tsx scripts/evals/updates-ledger/check.ts --window-days=7
//   npx tsx scripts/evals/updates-ledger/check.ts --tolerance-days=3
//   npx tsx scripts/evals/updates-ledger/check.ts --min-added=5
//   npx tsx scripts/evals/updates-ledger/check.ts --dry-run   # parse only
//
// Exit codes:
//   0 — every data-mutating commit has a matching ledger entry
//   1 — at least one commit lacks a ledger entry
//   2 — invocation error

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { UPDATES, type UpdateType } from '../../../src/data/updates.ts';

// ── Config ──────────────────────────────────────────────────────────────

// Map: data file (relative to repo root) → updateType the corresponding
// pipeline emits when it surfaces a row to the ledger. legal-ai surfaces
// as 'policy' (per scripts/refresh/legal-ai/run.ts:323); talent surfaces
// as 'people' (per scripts/refresh/talent/run.ts:25).
const DATA_FILE_TYPES: Record<string, UpdateType> = {
  'src/data/videos.ts': 'video',
  'src/data/policies.ts': 'policy',
  'src/data/debates.ts': 'debate',
  'src/data/people.ts': 'people',
  'src/data/tracker.ts': 'tracker',
  'src/data/benchmarking.ts': 'benchmark',
  'src/data/ecosystem.ts': 'ecosystem',
  'src/data/levers.ts': 'lever',
  'src/data/startups.ts': 'startup',
  'src/data/legal-ai.ts': 'policy',
  'src/data/talent.ts': 'people',
};

// Rule effective date — commits authored BEFORE this date are exempt.
// Lets a brand-new eval ignore the historical backlog without a separate
// allowlist file. Override with --since-date for one-off backfill audits.
const RULE_EFFECTIVE_DATE = '2026-05-09';

// Commit subject prefixes that don't add new content records (i18n backfill,
// refactors, typo fixes, dependency bumps). Touching a data file in these
// commits is fine — no ledger entry expected.
const SUBJECT_SKIP_RE =
  /^(fix\(i18n\)|i18n|chore|refactor|docs|test|style|ci|build|perf|revert)(\(|:)/i;

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REPORT_DIR = join(import.meta.dirname, 'reports');
const LEDGER_FILE = 'src/data/updates.ts';

// ── CLI ─────────────────────────────────────────────────────────────────

interface CliOptions {
  windowDays: number;
  toleranceDays: number;
  minAdded: number;
  sinceDate: string; // YYYY-MM-DD; commits authored before this are skipped
  includeSubjectSkip: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = {
    windowDays: 14,
    toleranceDays: 3,
    minAdded: 5,
    sinceDate: RULE_EFFECTIVE_DATE,
    includeSubjectSkip: false,
    dryRun: false,
  };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--include-subject-skip') opts.includeSubjectSkip = true;
    else if (a.startsWith('--window-days=')) opts.windowDays = Number(a.slice('--window-days='.length));
    else if (a.startsWith('--tolerance-days=')) opts.toleranceDays = Number(a.slice('--tolerance-days='.length));
    else if (a.startsWith('--min-added=')) opts.minAdded = Number(a.slice('--min-added='.length));
    else if (a.startsWith('--since-date=')) opts.sinceDate = a.slice('--since-date='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:updates-ledger [--window-days=N] [--tolerance-days=N] [--min-added=N] [--since-date=YYYY-MM-DD] [--include-subject-skip] [--dry-run]\n' +
          `\nDefault --since-date is ${RULE_EFFECTIVE_DATE} (rule effective date). Commits before this are exempt.\n` +
          '\nUse --include-subject-skip to also flag commits whose subject suggests non-content changes (i18n backfill, refactors, etc.) — useful for one-off audits.\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

// ── Git helpers ─────────────────────────────────────────────────────────

interface CommitInfo {
  sha: string;
  date: string; // YYYY-MM-DD (commit author date)
  subject: string;
}

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`git ${args.join(' ')} failed: ${msg}`);
  }
}

function listCommitsTouching(file: string, sinceDays: number): CommitInfo[] {
  const since = `${sinceDays}.days.ago`;
  const out = git([
    'log',
    `--since=${since}`,
    '--no-merges',
    '--pretty=format:%H|%aI|%s',
    '--',
    file,
  ]);
  if (!out.trim()) return [];
  return out
    .trim()
    .split('\n')
    .map((line) => {
      const [sha, isoDate, ...subjectParts] = line.split('|');
      return { sha, date: isoDate.slice(0, 10), subject: subjectParts.join('|') };
    });
}

function listFilesInCommit(sha: string): string[] {
  const out = git(['show', '--name-only', '--pretty=format:', sha]);
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function netAddedLines(sha: string, file: string): number {
  const out = git(['show', '--numstat', '--pretty=format:', sha, '--', file]);
  for (const line of out.split('\n')) {
    const m = line.trim().match(/^(\d+|-)\s+(\d+|-)\s+(.+)$/);
    if (!m) continue;
    if (m[3] !== file) continue;
    const adds = m[1] === '-' ? 0 : Number(m[1]);
    const dels = m[2] === '-' ? 0 : Number(m[2]);
    return adds - dels;
  }
  return 0;
}

// ── Ledger lookup ───────────────────────────────────────────────────────

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.abs(da - db) / (1000 * 60 * 60 * 24);
}

function ledgerHasMatching(type: UpdateType, commitDate: string, toleranceDays: number): boolean {
  return UPDATES.some((u) => u.type === type && daysBetween(u.date, commitDate) <= toleranceDays);
}

// ── Main scan ───────────────────────────────────────────────────────────

interface CommitFinding {
  sha: string;
  date: string;
  subject: string;
  file: string;
  type: UpdateType;
  netAdded: number;
  ledgerInCommit: boolean;
  ledgerInWindow: boolean;
  status: 'PASS-atomic' | 'PASS-window' | 'FAIL';
}

function scan(opts: CliOptions): CommitFinding[] {
  const findings: CommitFinding[] = [];
  for (const [file, type] of Object.entries(DATA_FILE_TYPES)) {
    const commits = listCommitsTouching(file, opts.windowDays);
    for (const c of commits) {
      // Rule cutoff: ignore commits authored before the rule took effect.
      if (c.date < opts.sinceDate) continue;
      // Subject heuristic: i18n backfill / refactor / chore commits often
      // touch data files without adding new records. Skip unless caller
      // explicitly opts in via --include-subject-skip (audit mode).
      if (!opts.includeSubjectSkip && SUBJECT_SKIP_RE.test(c.subject)) continue;
      const adds = netAddedLines(c.sha, file);
      if (adds < opts.minAdded) continue; // pure deletion / refactor / typo
      const filesInCommit = new Set(listFilesInCommit(c.sha));
      const ledgerInCommit = filesInCommit.has(LEDGER_FILE);
      const ledgerInWindow = ledgerHasMatching(type, c.date, opts.toleranceDays);
      let status: CommitFinding['status'];
      if (ledgerInCommit) status = 'PASS-atomic';
      else if (ledgerInWindow) status = 'PASS-window';
      else status = 'FAIL';
      findings.push({
        sha: c.sha,
        date: c.date,
        subject: c.subject,
        file,
        type,
        netAdded: adds,
        ledgerInCommit,
        ledgerInWindow,
        status,
      });
    }
  }
  return findings;
}

// ── Report ──────────────────────────────────────────────────────────────

function writeReports(findings: CommitFinding[], opts: CliOptions): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);

  const totals = {
    inspected: findings.length,
    passAtomic: findings.filter((f) => f.status === 'PASS-atomic').length,
    passWindow: findings.filter((f) => f.status === 'PASS-window').length,
    fail: findings.filter((f) => f.status === 'FAIL').length,
  };

  writeFileSync(
    jsonPath,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), opts, totals, findings },
      null,
      2,
    ) + '\n',
  );

  const lines: string[] = [];
  lines.push(`# Updates Ledger Coverage Report — ${stamp}`);
  lines.push('');
  lines.push(`- Window: last ${opts.windowDays} days`);
  lines.push(`- Tolerance: ±${opts.toleranceDays} days for ledger match`);
  lines.push(`- Min added lines: ${opts.minAdded}`);
  lines.push(`- Inspected commits: ${totals.inspected}`);
  lines.push(`- PASS (atomic ledger update): ${totals.passAtomic}`);
  lines.push(`- PASS (matching ledger entry in window): ${totals.passWindow}`);
  lines.push(`- **FAIL (no ledger entry): ${totals.fail}**`);
  lines.push('');

  if (totals.fail > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const f of findings.filter((x) => x.status === 'FAIL')) {
      lines.push(
        `- \`${f.sha.slice(0, 7)}\` ${f.date} — \`${f.file}\` (+${f.netAdded} lines, expected updates.ts entry of type=\`${f.type}\`)`,
      );
      lines.push(`  - subject: ${f.subject}`);
      lines.push(
        '  - fix: add an entry via `appendUpdate({...})` (or hand-edit `src/data/updates.ts`) of the matching type',
      );
    }
    lines.push('');
  }

  if (totals.passAtomic + totals.passWindow > 0) {
    lines.push('## Passing commits');
    lines.push('');
    for (const f of findings.filter((x) => x.status !== 'FAIL')) {
      const tag = f.status === 'PASS-atomic' ? '🔗 atomic' : '🪟 window';
      lines.push(`- ${tag} \`${f.sha.slice(0, 7)}\` ${f.date} — \`${f.file}\` (type=\`${f.type}\`)`);
    }
    lines.push('');
  }

  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

// ── Entry ───────────────────────────────────────────────────────────────

async function main() {
  const opts = parseCli(process.argv.slice(2));
  process.stdout.write(
    `[updates-ledger] window=${opts.windowDays}d tolerance=±${opts.toleranceDays}d minAdded=${opts.minAdded} sinceDate=${opts.sinceDate} subjectSkip=${opts.includeSubjectSkip ? 'off' : 'on'}\n`,
  );
  let findings: CommitFinding[];
  try {
    findings = scan(opts);
  } catch (err) {
    process.stderr.write(`[updates-ledger] scan failed: ${err instanceof Error ? err.message : err}\n`);
    process.exit(2);
  }

  const failures = findings.filter((f) => f.status === 'FAIL');
  process.stdout.write(
    `[updates-ledger] inspected=${findings.length} passAtomic=${findings.filter((f) => f.status === 'PASS-atomic').length} passWindow=${findings.filter((f) => f.status === 'PASS-window').length} fail=${failures.length}\n`,
  );

  if (failures.length > 0) {
    process.stdout.write('\n[updates-ledger] FAILED commits:\n');
    for (const f of failures) {
      process.stdout.write(
        `  ${f.sha.slice(0, 7)} ${f.date} ${f.file} (+${f.netAdded}) → expected type=${f.type}\n    ${f.subject}\n`,
      );
    }
  }

  if (opts.dryRun) {
    process.stdout.write('[updates-ledger] --dry-run; skipping report write\n');
    process.exit(failures.length > 0 ? 1 : 0);
  }

  const { jsonPath, mdPath } = writeReports(findings, opts);
  process.stdout.write(`[updates-ledger] reports: ${jsonPath} ${mdPath}\n`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main();

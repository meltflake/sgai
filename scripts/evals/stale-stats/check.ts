// scripts/evals/stale-stats/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the "homepage-grade number quietly rots" bug class. Several data
// files carry a manually-maintained `dataDate` stamp next to aggregate
// stats (startups ecosystemStats, opensource seaLionStats, benchmarking
// baseline, tracker readings...). Nothing ever asserted those stamps stay
// within their pipeline's cadence — ecosystemStats sat on a 2026-02-17
// baseline for 4.5 months while the startups index page kept quoting its
// numbers ("650+", "$8.4B+") as current. This eval is that alarm.
//
// Rule: for every `dataDate` occurrence in src/data/*.ts, the age (today −
// dataDate) must not exceed the owning pipeline's cadence × grace. The
// owning pipeline (and thus cadence) comes from scripts/refresh/registry.json
// `targets[]` — the same single source of truth coverage-audit enforces.
// Editorial files (no pipeline) get a fixed 365-day ceiling.
//
// Thresholds (schedule → max age in days):
//   daily/weekly → 14 · monthly → 60 · quarterly → 150 · half-yearly → 300
//   editorial / unowned → 365
// Generous on purpose: this is a rot alarm, not a freshness SLA. A failure
// means "someone forgot this stat block exists", not "refresh is 1 day late".
//
// Flags:
//   --dry-run       Skip writing the JSON/MD report
//   --today=DATE    Override "today" (ISO date) — for reproducible runs/tests
//   --help          Usage
//
// Exit codes:
//   0 — every dataDate within its threshold
//   1 — at least one stale dataDate
//   2 — invocation / setup error

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REGISTRY = join(REPO_ROOT, 'scripts/refresh/registry.json');
const DATA_DIR = 'src/data';
const REPORT_DIR = join(import.meta.dirname, 'reports');

export const MAX_AGE_DAYS: Record<string, number> = {
  daily: 14,
  weekly: 14,
  monthly: 60,
  quarterly: 150,
  'half-yearly': 300,
  editorial: 365,
};

interface CliOptions {
  dryRun: boolean;
  today: string | null;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { dryRun: false, today: null };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--today=')) opts.today = a.slice('--today='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:stale-stats [--dry-run] [--today=YYYY-MM-DD]\n' +
          '\nAsserts every `dataDate` stamp in src/data/*.ts is younger than its owning\n' +
          "pipeline's cadence allows (registry.json schedule × grace; editorial → 365d).\n",
      );
      process.exit(0);
    }
  }
  return opts;
}

export interface RegistryShape {
  pipelines?: Array<{ id?: string; schedule?: string; targets?: string[] }>;
  editorial?: Array<{ file?: string }>;
}

export interface StampFinding {
  file: string; // repo-relative
  dataDate: string; // ISO date as found
  ageDays: number;
  schedule: string; // owning pipeline schedule, or 'editorial'
  maxAgeDays: number;
  stale: boolean;
}

/** Extract every dataDate stamp from a TS source. Matches both shapes:
 *  `export const dataDate = 'YYYY-MM-DD'` and `dataDate: 'YYYY-MM-DD'`. */
export function extractDataDates(source: string): string[] {
  const re = /dataDate(?:\s*[:=])\s*'(\d{4}-\d{2}-\d{2})'/g;
  const out: string[] = [];
  for (const m of source.matchAll(re)) out.push(m[1]);
  return out;
}

/** Extract per-claim currency stamps (P0-2: MetricRow.asOfDate and
 *  headlineAsOf / qualitative asOfDate fields). Date granularity varies by
 *  design — YYYY, YYYY-MM, or YYYY-MM-DD — and these stamps can legitimately
 *  be OLD (e.g. an adoption headline resting on a 2024 survey). They are
 *  therefore warning-only, never a hard gate. */
export function extractAsOfDates(source: string): string[] {
  const re = /(?:headlineAsOf|asOfDate)\s*[:=]\s*'(\d{4}(?:-\d{2}(?:-\d{2})?)?)'/g;
  const out: string[] = [];
  for (const m of source.matchAll(re)) out.push(m[1]);
  return out;
}

/** Warning-only age audit for as-of stamps. Threshold fixed at 365 days —
 *  older than a year means "check whether the claim is being presented as
 *  current". Returns findings sorted oldest-first; callers decide reporting. */
export function auditAsOfWarnings(sources: Record<string, string>, today: string): StampFinding[] {
  const findings: StampFinding[] = [];
  for (const [file, content] of Object.entries(sources)) {
    for (const stamp of extractAsOfDates(content)) {
      const full = stamp.length === 10 ? stamp : stamp.length === 7 ? `${stamp}-01` : `${stamp}-01-01`;
      const ageDays = ageInDays(full, today);
      if (ageDays > 365) {
        findings.push({ file, dataDate: stamp, ageDays, schedule: 'as-of', maxAgeDays: 365, stale: true });
      }
    }
  }
  return findings.sort((a, b) => b.ageDays - a.ageDays || a.file.localeCompare(b.file));
}

/** Map each data file to its owning schedule via registry targets. */
export function scheduleForFile(registry: RegistryShape, repoRelPath: string): string {
  for (const p of registry.pipelines ?? []) {
    if ((p.targets ?? []).includes(repoRelPath)) return p.schedule ?? 'editorial';
  }
  return 'editorial';
}

export function ageInDays(dataDate: string, today: string): number {
  const ms = Date.parse(today) - Date.parse(dataDate);
  return Math.floor(ms / 86_400_000);
}

/** Pure audit over pre-read sources. No fs / process access. */
export function auditStaleStats(
  registry: RegistryShape,
  sources: Record<string, string>, // repo-relative path → file content
  today: string,
): StampFinding[] {
  const findings: StampFinding[] = [];
  for (const [file, content] of Object.entries(sources)) {
    const schedule = scheduleForFile(registry, file);
    const maxAgeDays = MAX_AGE_DAYS[schedule] ?? MAX_AGE_DAYS.editorial;
    for (const dataDate of extractDataDates(content)) {
      const ageDays = ageInDays(dataDate, today);
      findings.push({ file, dataDate, ageDays, schedule, maxAgeDays, stale: ageDays > maxAgeDays });
    }
  }
  return findings.sort((a, b) => b.ageDays - a.ageDays || a.file.localeCompare(b.file));
}

function writeReport(findings: StampFinding[], today: string) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = today.replace(/-/g, '');
  const stale = findings.filter((f) => f.stale);
  writeFileSync(
    join(REPORT_DIR, `report-${stamp}.json`),
    JSON.stringify({ generatedAt: new Date().toISOString(), today, findings, fail: stale.length }, null, 2) + '\n',
  );
  const lines = [
    `# Stale Stats Report — ${stamp}`,
    '',
    `dataDate stamps: ${findings.length} · stale: ${stale.length}`,
    '',
  ];
  if (stale.length) {
    lines.push('## Stale stamps', '');
    for (const f of stale) {
      lines.push(`- \`${f.file}\` dataDate ${f.dataDate} — ${f.ageDays}d old (max ${f.maxAgeDays}d, ${f.schedule})`);
    }
    lines.push('', '> Fix: re-verify the stat block against public sources and bump its dataDate.', '');
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

function main() {
  const opts = parseCli(process.argv.slice(2));
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  let findings: StampFinding[];
  const sources: Record<string, string> = {};
  try {
    const registry = JSON.parse(readFileSync(REGISTRY, 'utf8')) as RegistryShape;
    const dataDirAbs = join(REPO_ROOT, DATA_DIR);
    for (const f of readdirSync(dataDirAbs)) {
      if (!f.endsWith('.ts') || f.endsWith('.d.ts')) continue;
      sources[`${DATA_DIR}/${f}`] = readFileSync(join(dataDirAbs, f), 'utf8');
    }
    findings = auditStaleStats(registry, sources, today);
  } catch (err) {
    process.stderr.write(`[stale-stats] setup error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  }

  const stale = findings.filter((f) => f.stale);
  process.stdout.write(`[stale-stats] dataDate stamps: ${findings.length}, stale: ${stale.length}\n`);
  for (const f of stale) {
    process.stdout.write(
      `  STALE ${f.file}: dataDate ${f.dataDate} is ${f.ageDays}d old (max ${f.maxAgeDays}d for ${f.schedule})\n`,
    );
  }
  if (stale.length) {
    process.stdout.write('  → re-verify the stat block against public sources and bump its dataDate\n');
  }

  // P0-2: as-of stamps are warning-only (never a hard gate) — they exist so
  // a quietly-rotting per-claim date gets a weekly review nudge.
  const asOfWarnings = auditAsOfWarnings(sources, today);
  for (const w of asOfWarnings) {
    process.stdout.write(
      `  WARN as-of ${w.file}: stamp '${w.dataDate}' is ${w.ageDays}d old — confirm the claim is not presented as current\n`,
    );
  }

  if (!opts.dryRun) writeReport(findings, today);
  process.exit(stale.length > 0 ? 1 : 0);
}

// Run as CLI only — importing this module (e.g. from a unit test) must not
// fire fs / writeReport / process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('stale-stats/check.ts')) {
  main();
}

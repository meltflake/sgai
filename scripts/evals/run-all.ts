// scripts/evals/run-all.ts
// ────────────────────────────────────────────────────────────────────────
// Top-level eval runner. Sequences every eval in scripts/evals/ and emits
// a combined exit code:
//   0 — all evals passed
//   1 — at least one eval failed
//
// Frequency tiers:
//   - weekly (default): cheap evals — URL health, i18n coverage, addedAt,
//     source-i18n hardcode, schema rich-results (zero-LLM, fast)
//   - monthly (--frequency=monthly): adds AI summary + translation golden
//     regressions (LLM-backed, costs a few cents per run)
//   - all (--frequency=all): everything
//
// Used by:
//   - manual:  npm run eval                              (weekly tier)
//              npm run eval -- --frequency=monthly       (full LLM sweep)
//   - cron:    scripts/refresh/registry.json (weekly + monthly entries)
//
// Layers that need a build (i18n B/C/D, schema rich-results) are skipped
// automatically when dist/ is absent. To run the full sweep:
//
//     npm run build && npm run eval
//
// Adding a new eval: append to STAGES below. Each stage must be
// re-entrant and own its own report files.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { distState } from '../lib/dist-freshness.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../..');

type Frequency = 'weekly' | 'monthly' | 'all';

interface Stage {
  name: string;
  cmd: string[];
  needsDist: boolean;
  frequency: Frequency;
}

const STAGES: Stage[] = [
  { name: 'url-health', cmd: ['npx', 'tsx', 'scripts/evals/url-health/check.ts'], needsDist: false, frequency: 'weekly' },
  {
    name: 'i18n-coverage:layer-a',
    cmd: ['npx', 'tsx', 'scripts/evals/i18n-coverage/check.ts', '--layer=a'],
    needsDist: false,
    frequency: 'weekly',
  },
  {
    name: 'addedAt-coverage',
    cmd: ['npx', 'tsx', 'scripts/evals/addedAt-coverage/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  // coverage-audit — assert every src/data/*.ts is owned by a pipeline
  // `targets[]` or an `editorial` entry in registry.json (no orphan data
  // files, no stale manifest paths). Full-state check, no --base.
  {
    name: 'coverage-audit',
    cmd: ['npx', 'tsx', 'scripts/evals/coverage-audit/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  // stale-stats — assert every manually-stamped `dataDate` in src/data/*.ts
  // is younger than its owning pipeline's cadence allows. Rot alarm for
  // homepage-grade aggregate numbers (ecosystemStats, seaLionStats...).
  {
    name: 'stale-stats',
    cmd: ['npx', 'tsx', 'scripts/evals/stale-stats/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  // facade-stats — assert the front-door numbers in README.md and the
  // AboutPage.astro data interpolations agree with src/data/*.ts ground
  // truth (debates / policies / startups / unicorns / economies / metrics).
  // Companion to stale-stats: that one catches rotting dataDate stamps,
  // this one catches hand-written copies of the numbers themselves.
  {
    name: 'facade-stats',
    cmd: ['npx', 'tsx', 'scripts/evals/facade-stats/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  // gsc-monitor — Search Analytics watch: striking-distance queries, CTR
  // anomalies, /zh/ position recovery. Skips (exit 0) with setup guidance
  // when GSC_SERVICE_ACCOUNT_JSON / GSC_PROPERTY_URL are absent, so wiring
  // it here is safe before credentials land.
  {
    name: 'gsc-monitor',
    cmd: ['npx', 'tsx', 'scripts/evals/gsc-monitor/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  {
    name: 'transcript-coverage',
    cmd: ['npx', 'tsx', 'scripts/evals/transcript-coverage/check.ts', '--include-historical'],
    needsDist: false,
    frequency: 'weekly',
  },
  {
    name: 'transcript-quality',
    cmd: ['npx', 'tsx', 'scripts/evals/transcript-quality/check.ts', '--include-historical'],
    needsDist: false,
    frequency: 'weekly',
  },
  {
    name: 'video-transcript-coverage',
    cmd: ['npx', 'tsx', 'scripts/evals/video-transcript-coverage/check.ts', '--include-historical'],
    needsDist: false,
    frequency: 'weekly',
  },
  // Layer E — source-level i18n hardcode scan, no build required.
  // Tracks 2-locale ternaries in templates that silently strand JA on EN.
  {
    name: 'source-i18n-hardcode (Layer E)',
    cmd: ['npx', 'tsx', 'scripts/evals/source-i18n-hardcode/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  // entity-pages-i18n — synthesized page objects (benchmark drilldowns,
  // startup entities, AI relations) must carry Ja/Ko siblings for every
  // CJK base field that has an En sibling. Guards the 2026-07 regression
  // where entity-pages.ts synthesized En-only templates (2220 EN-sentence
  // hits on /ja/). Runtime import, no build required.
  {
    name: 'entity-pages-i18n',
    cmd: ['npx', 'tsx', 'scripts/evals/entity-pages-i18n/check.ts'],
    needsDist: false,
    frequency: 'weekly',
  },
  {
    name: 'i18n-coverage:layer-bcd',
    cmd: ['npx', 'tsx', 'scripts/evals/i18n-coverage/check.ts', '--layer=b,c,d'],
    needsDist: true,
    frequency: 'weekly',
  },
  {
    name: 'schema-richresults',
    cmd: ['npx', 'tsx', 'scripts/evals/schema-richresults/check.ts'],
    needsDist: true,
    frequency: 'weekly',
  },
  // zh-tw misconversion — scan dist/zh-tw/**/*.html for OpenCC phrase
  // substitution mistakes the PROTECTED_TERMS pipeline should prevent
  // (resp. 信息部→資訊部, IMDA, MCCY, etc.). Needs a build.
  {
    name: 'zh-tw-misconversion',
    cmd: ['npx', 'tsx', 'scripts/evals/zh-tw-misconversion/check.ts'],
    needsDist: true,
    frequency: 'weekly',
  },
  {
    name: 'ai-summary',
    cmd: ['npx', 'tsx', 'scripts/evals/ai-summary/check.ts'],
    needsDist: false,
    frequency: 'monthly',
  },
  {
    name: 'translation',
    cmd: ['npx', 'tsx', 'scripts/evals/translation/check.ts'],
    needsDist: false,
    frequency: 'monthly',
  },
];

function parseFrequency(argv: string[]): Frequency {
  for (const a of argv) {
    if (a.startsWith('--frequency=')) {
      const v = a.slice('--frequency='.length);
      if (v === 'weekly' || v === 'monthly' || v === 'all') return v;
      process.stderr.write(`Unknown frequency: ${v}. Use weekly|monthly|all.\n`);
      process.exit(2);
    }
  }
  return 'weekly';
}

function selectStages(stages: Stage[], target: Frequency): Stage[] {
  if (target === 'all') return stages;
  if (target === 'monthly') return stages.filter((s) => s.frequency === 'weekly' || s.frequency === 'monthly');
  return stages.filter((s) => s.frequency === 'weekly');
}

// ── dist freshness ───────────────────────────────────────────────────────
//
// dist-dependent evals used to trust WHATEVER dist/ was lying on disk —
// two phantom-failure incidents in two days (stacked-branch scan on
// 2026-07-12, stale-dist scan on 07-13). See scripts/lib/dist-freshness.ts
// for the full story; here we rebuild whenever the stamp doesn't match HEAD.

/** Rebuild dist when any selected stage depends on it and it isn't fresh.
 *  Returns whether dist is usable. `--no-build` keeps the old behaviour
 *  (scan whatever exists; skip when missing) for quick manual runs. */
function ensureFreshDist(stages: Stage[], noBuild: boolean): boolean {
  if (!stages.some((s) => s.needsDist)) return true;
  const state = distState(REPO_ROOT);
  if (state === 'fresh') return true;
  if (noBuild) {
    process.stdout.write(`\n[dist] state=${state}, --no-build set — scanning dist/ as-is (results may be stale)\n`);
    return existsSync(join(REPO_ROOT, 'dist'));
  }
  process.stdout.write(`\n[dist] state=${state} — rebuilding so dist-dependent evals scan HEAD, not a stale tree…\n`);
  const r = spawnSync('npm', ['run', 'build'], { cwd: REPO_ROOT, stdio: 'inherit' });
  if (r.status !== 0) {
    process.stdout.write('[dist] build FAILED — dist-dependent evals will be skipped\n');
    return false;
  }
  return true;
}

interface StageResult {
  name: string;
  exitCode: number;
  skipped: boolean;
}

function runStage(stage: Stage, distUsable: boolean): StageResult {
  if (stage.needsDist && !distUsable) {
    process.stdout.write(`\n[SKIP] ${stage.name} — no usable dist/ (build failed or absent)\n`);
    return { name: stage.name, exitCode: 0, skipped: true };
  }
  process.stdout.write(`\n=== ${stage.name} ===\n`);
  const [cmd, ...args] = stage.cmd;
  const r = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit' });
  return { name: stage.name, exitCode: r.status ?? 1, skipped: false };
}

function main() {
  const argv = process.argv.slice(2);
  const frequency = parseFrequency(argv);
  const stages = selectStages(STAGES, frequency);
  process.stdout.write(`Running ${stages.length} stage(s) at frequency=${frequency}.\n`);

  const distUsable = ensureFreshDist(stages, argv.includes('--no-build'));

  const results: StageResult[] = [];
  for (const stage of stages) results.push(runStage(stage, distUsable));

  process.stdout.write('\n=== Eval Summary ===\n');
  let anyFail = false;
  for (const r of results) {
    const tag = r.skipped ? 'SKIP' : r.exitCode === 0 ? 'PASS' : 'FAIL';
    if (!r.skipped && r.exitCode !== 0) anyFail = true;
    process.stdout.write(`  [${tag}] ${r.name}\n`);
  }
  process.exit(anyFail ? 1 : 0);
}

main();

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

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const HAS_DIST = existsSync(join(REPO_ROOT, 'dist'));

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
  {
    name: 'transcript-coverage',
    cmd: ['npx', 'tsx', 'scripts/evals/transcript-coverage/check.ts', '--include-historical'],
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

interface StageResult {
  name: string;
  exitCode: number;
  skipped: boolean;
}

function runStage(stage: Stage): StageResult {
  if (stage.needsDist && !HAS_DIST) {
    process.stdout.write(`\n[SKIP] ${stage.name} — dist/ not present (run \`npm run build\` first)\n`);
    return { name: stage.name, exitCode: 0, skipped: true };
  }
  process.stdout.write(`\n=== ${stage.name} ===\n`);
  const [cmd, ...args] = stage.cmd;
  const r = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit' });
  return { name: stage.name, exitCode: r.status ?? 1, skipped: false };
}

function main() {
  const frequency = parseFrequency(process.argv.slice(2));
  const stages = selectStages(STAGES, frequency);
  process.stdout.write(`Running ${stages.length} stage(s) at frequency=${frequency}.\n`);

  const results: StageResult[] = [];
  for (const stage of stages) results.push(runStage(stage));

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

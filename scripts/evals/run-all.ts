// scripts/evals/run-all.ts
// ────────────────────────────────────────────────────────────────────────
// Top-level eval runner. Sequences every eval in scripts/evals/ and emits
// a combined exit code:
//   0 — all evals passed
//   1 — at least one eval failed
//
// Used by:
//   - manual:  npm run eval
//   - cron:    scripts/refresh/registry.json (weekly entry)
//
// Layers that need a build (i18n B/C/D) are skipped automatically when
// dist/ is absent — the eval reports it as SKIPPED and the runner
// short-circuits to running just the no-build layers (A) on a clean tree.
// To run the full sweep:
//
//     npm run build && npm run eval
//
// Adding a new eval: import its main entry point and append to STAGES
// below. Each stage must be re-entrant and own its own report files.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const HAS_DIST = existsSync(join(REPO_ROOT, 'dist'));

interface Stage {
  name: string;
  cmd: string[];
  needsDist: boolean;
}

const STAGES: Stage[] = [
  { name: 'url-health', cmd: ['npx', 'tsx', 'scripts/evals/url-health/check.ts'], needsDist: false },
  {
    name: 'i18n-coverage:layer-a',
    cmd: ['npx', 'tsx', 'scripts/evals/i18n-coverage/check.ts', '--layer=a'],
    needsDist: false,
  },
  {
    name: 'addedAt-coverage',
    cmd: ['npx', 'tsx', 'scripts/evals/addedAt-coverage/check.ts'],
    needsDist: false,
  },
  // Layer E — source-level i18n hardcode scan, no build required.
  // Tracks 2-locale ternaries in templates that silently strand JA on EN.
  {
    name: 'source-i18n-hardcode (Layer E)',
    cmd: ['npx', 'tsx', 'scripts/evals/source-i18n-hardcode/check.ts'],
    needsDist: false,
  },
  {
    name: 'i18n-coverage:layer-bcd',
    cmd: ['npx', 'tsx', 'scripts/evals/i18n-coverage/check.ts', '--layer=b,c,d'],
    needsDist: true,
  },
];

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
  const results: StageResult[] = [];
  for (const stage of STAGES) results.push(runStage(stage));

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

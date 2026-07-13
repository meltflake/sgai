// scripts/lib/dist-freshness.ts
// ────────────────────────────────────────────────────────────────────────
// Is dist/ a build of the CURRENT tree, or a stale leftover?
//
// dist-dependent evals used to trust whatever dist/ was lying on disk.
// Two phantom-failure incidents in two days: 2026-07-12 (evals ran while
// the checkout sat on a stacked pipeline branch) and 2026-07-13 (weekly
// cron scanned a dist/ built before the previous day's merges — Layer D
// flagged 3 ja "regressions" that a fresh build doesn't have). A stale
// scan is worse than no scan: it files issues against code that no longer
// exists.
//
// `npm run build` stamps `dist/.build-commit` with HEAD (postbuild hook in
// package.json); distState() verifies the stamp and the src/ working tree.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type DistState = 'fresh' | 'missing' | 'unstamped' | 'stale-commit' | 'dirty-src';

function git(repoRoot: string, args: string[]): string {
  const r = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : '';
}

/**
 * - `missing`      — no dist/ at all
 * - `unstamped`    — dist/ predates the postbuild stamp hook
 * - `stale-commit` — stamp != HEAD (built from another commit / branch)
 * - `dirty-src`    — stamp matches but src/ has uncommitted edits
 * - `fresh`        — safe for dist-layer scans
 */
export function distState(repoRoot: string): DistState {
  if (!existsSync(join(repoRoot, 'dist'))) return 'missing';
  const stampFile = join(repoRoot, 'dist', '.build-commit');
  if (!existsSync(stampFile)) return 'unstamped';
  const stamp = readFileSync(stampFile, 'utf8').trim();
  if (stamp !== git(repoRoot, ['rev-parse', 'HEAD'])) return 'stale-commit';
  if (git(repoRoot, ['status', '--porcelain', '--', 'src/']) !== '') return 'dirty-src';
  return 'fresh';
}

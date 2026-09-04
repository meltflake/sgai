// scripts/lib/__tests__/auto-commit.test.ts
//
// auto-commit shells out to git/gh, so the testable surface is buildPRBody
// (pure formatter) and the dirty-detection helper logic. The branch +
// push + PR flow is verified manually in the e2e milestone (M1).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildPRBody } from '../auto-commit.ts';

test('buildPRBody: includes domain, count, sources, diff stat', () => {
  const body = buildPRBody({
    domain: 'policies',
    diffStat: ' src/data/policies.ts | 12 ++++\n 1 file changed, 12 insertions(+)',
    newEntries: [
      { title: 'IMDA AI Advisory 1', sourceUrl: 'https://imda.gov.sg/x', confidence: 'high' },
      { title: 'IMDA AI Advisory 2', sourceUrl: 'https://imda.gov.sg/y', confidence: 'medium' },
    ],
  });
  assert.ok(body.includes('Domain: `policies`'));
  assert.ok(body.includes('New entries: **2**'));
  assert.ok(body.includes('IMDA AI Advisory 1'));
  assert.ok(body.includes('https://imda.gov.sg/y'));
  assert.ok(body.includes('1 high · 1 medium · 0 low'));
  assert.ok(body.includes('1 file changed'));
});

test('buildPRBody: marks low-confidence entries with warning', () => {
  const body = buildPRBody({
    domain: 'ecosystem',
    diffStat: 'x',
    newEntries: [{ title: 'Maybe-real Co', sourceUrl: 'https://e27.co/x', confidence: 'low' }],
  });
  assert.ok(body.includes('1 low'));
  assert.ok(body.includes('_pendingReview'));
});

test('buildPRBody: lists failed sources when present', () => {
  const body = buildPRBody({
    domain: 'levers',
    diffStat: 'x',
    newEntries: [],
    failedSources: [
      { url: 'https://imda.gov.sg/down', error: '503 Service Unavailable' },
    ],
  });
  assert.ok(body.includes('Failed sources'));
  assert.ok(body.includes('503 Service Unavailable'));
});

test('buildPRBody: truncates new entries beyond 50', () => {
  const entries = Array.from({ length: 75 }, (_, i) => ({
    title: `Entry ${i}`,
    sourceUrl: `https://x.gov.sg/${i}`,
  }));
  const body = buildPRBody({ domain: 'policies', diffStat: 'x', newEntries: entries });
  assert.ok(body.includes('Entry 0'));
  assert.ok(body.includes('Entry 49'));
  assert.ok(body.includes('and 25 more'));
  assert.ok(!body.includes('Entry 60'));
});

test('buildPRBody: defaults entries with no confidence to "high"', () => {
  const body = buildPRBody({
    domain: 'x',
    diffStat: 'x',
    newEntries: [{ title: 'No-conf entry', sourceUrl: 'https://x.gov.sg/y' }],
  });
  assert.ok(body.includes('1 high · 0 medium · 0 low'));
});

// ── autoCommit branch-base behaviour (real temp git repos) ──────────────
//
// Regression for the 2026-07-12 stacked-branches incident: sequential
// pipeline runs cut each data-refresh branch from the previous pipeline's
// branch (current HEAD), so every PR carried its predecessors' commits.
// autoCommit must cut from `main` regardless of where HEAD sits.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { autoCommit, resolveBaseRef } from '../auto-commit.ts';

function tempRepo(defaultBranch: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'autocommit-test-'));
  const g = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
  g('init', '-b', defaultBranch);
  g('config', 'user.email', 'test@test.local');
  g('config', 'user.name', 'test');
  writeFileSync(join(dir, 'data.txt'), 'v1\n');
  g('add', '.');
  g('commit', '-m', 'init');
  return dir;
}

function inDir<T>(dir: string, fn: () => T): T {
  const prev = process.cwd();
  process.chdir(dir);
  try {
    return fn();
  } finally {
    process.chdir(prev);
  }
}

test('autoCommit: cuts branch from main even when HEAD is a stacked branch', () => {
  const dir = tempRepo('main');
  const g = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  const mainSha = g('rev-parse', 'main');
  // Simulate a previous pipeline: stacked branch with its own commit.
  g('checkout', '-b', 'data-refresh/previous/2026-07-12');
  writeFileSync(join(dir, 'other.txt'), 'prev pipeline\n');
  g('add', 'other.txt');
  g('commit', '-m', 'previous pipeline commit');
  // Current pipeline writes its target file into the working tree.
  writeFileSync(join(dir, 'data.txt'), 'v2\n');

  const result = inDir(dir, () =>
    autoCommit({ domain: 'test', files: ['data.txt'], message: 'test commit' })
  );

  // The new branch's parent must be main's HEAD, not the stacked branch.
  const parent = g('rev-parse', `${result.sha}^`);
  assert.equal(parent, mainSha);
  // And the stacked branch's commit must NOT be in the new branch's history.
  const log = g('log', '--oneline', result.branch);
  assert.ok(!log.includes('previous pipeline commit'));
  rmSync(dir, { recursive: true, force: true });
});

test('autoCommit: falls back to current HEAD in repos without main', () => {
  const dir = tempRepo('trunk');
  const g = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  writeFileSync(join(dir, 'data.txt'), 'v2\n');
  const headSha = g('rev-parse', 'HEAD');

  const result = inDir(dir, () =>
    autoCommit({ domain: 'test', files: ['data.txt'], message: 'test commit' })
  );

  const parent = g('rev-parse', `${result.sha}^`);
  assert.equal(parent, headSha);
  rmSync(dir, { recursive: true, force: true });
});

test('resolveBaseRef: explicit override wins', () => {
  const dir = tempRepo('main');
  const got = inDir(dir, () => resolveBaseRef('release/x'));
  assert.equal(got, 'release/x');
  rmSync(dir, { recursive: true, force: true });
});

import { getUnexpectedDirty, isPipelineStatePath } from '../auto-commit.ts';
import { mkdirSync, realpathSync } from 'node:fs';

test('isPipelineStatePath: refresh data / i18n cache / scan state are pipeline state; code and src are not', () => {
  assert.equal(isPipelineStatePath('scripts/refresh/voices/data/rejected-ids.json'), true);
  assert.equal(isPipelineStatePath('scripts/refresh/tracker/data/summaries/x.json'), true);
  assert.equal(isPipelineStatePath('scripts/i18n/data/ja-cache/abc.json'), true);
  assert.equal(isPipelineStatePath('scripts/data/last_scan_state.json'), true);
  assert.equal(isPipelineStatePath('scripts/refresh/voices/run.ts'), false);
  assert.equal(isPipelineStatePath('src/data/voices.ts'), false);
});

test('getUnexpectedDirty: ignores another pipeline\'s leftover state file but still flags foreign data edits', () => {
  // realpath: macOS tmpdir is a symlink (/var → /private/var) and git reports the real root.
  const dir = realpathSync(tempRepo('main'));
  mkdirSync(join(dir, 'scripts/refresh/voices/data'), { recursive: true });
  writeFileSync(join(dir, 'scripts/refresh/voices/data/rejected-ids.json'), '{}\n');
  writeFileSync(join(dir, 'unrelated.txt'), 'x\n');
  writeFileSync(join(dir, 'data.txt'), 'v2\n');
  const dirty = inDir(dir, () => getUnexpectedDirty([], [join(dir, 'data.txt')]));
  assert.deepEqual(dirty, ['unrelated.txt']);
  rmSync(dir, { recursive: true, force: true });
});

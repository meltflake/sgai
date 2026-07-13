// scripts/lib/__tests__/dist-freshness.test.ts
//
// Regression for the 2026-07-12/13 phantom eval failures: dist-layer scans
// must detect when dist/ was built from a different commit (stacked branch,
// pre-merge tree) or when src/ has uncommitted edits.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { distState } from '../dist-freshness.ts';

function repoWithDist(): { dir: string; g: (...args: string[]) => string } {
  const dir = mkdtempSync(join(tmpdir(), 'distfresh-test-'));
  const g = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  g('init', '-b', 'main');
  g('config', 'user.email', 'test@test.local');
  g('config', 'user.name', 'test');
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'data.ts'), 'export const x = 1;\n');
  g('add', '.');
  g('commit', '-m', 'init');
  mkdirSync(join(dir, 'dist'));
  writeFileSync(join(dir, 'dist', 'index.html'), '<html></html>');
  return { dir, g };
}

test('distState: missing when no dist/', () => {
  const { dir } = repoWithDist();
  rmSync(join(dir, 'dist'), { recursive: true });
  assert.equal(distState(dir), 'missing');
  rmSync(dir, { recursive: true, force: true });
});

test('distState: unstamped when dist/ predates the stamp hook', () => {
  const { dir } = repoWithDist();
  assert.equal(distState(dir), 'unstamped');
  rmSync(dir, { recursive: true, force: true });
});

test('distState: stale-commit when stamp != HEAD', () => {
  const { dir, g } = repoWithDist();
  writeFileSync(join(dir, 'dist', '.build-commit'), `${g('rev-parse', 'HEAD')}\n`);
  // Advance HEAD past the stamp.
  writeFileSync(join(dir, 'src', 'data.ts'), 'export const x = 2;\n');
  g('add', '.');
  g('commit', '-m', 'newer commit');
  assert.equal(distState(dir), 'stale-commit');
  rmSync(dir, { recursive: true, force: true });
});

test('distState: dirty-src when src/ has uncommitted edits', () => {
  const { dir, g } = repoWithDist();
  writeFileSync(join(dir, 'dist', '.build-commit'), `${g('rev-parse', 'HEAD')}\n`);
  writeFileSync(join(dir, 'src', 'data.ts'), 'export const x = 3;\n');
  assert.equal(distState(dir), 'dirty-src');
  rmSync(dir, { recursive: true, force: true });
});

test('distState: fresh when stamp matches HEAD and src/ is clean', () => {
  const { dir, g } = repoWithDist();
  writeFileSync(join(dir, 'dist', '.build-commit'), `${g('rev-parse', 'HEAD')}\n`);
  assert.equal(distState(dir), 'fresh');
  rmSync(dir, { recursive: true, force: true });
});

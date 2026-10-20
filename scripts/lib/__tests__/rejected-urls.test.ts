import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { appendRejectedUrls, loadRejectedUrls, mergeRejectedUrls } from '../rejected-urls.ts';

test('loadRejectedUrls: missing file → empty list', () => {
  assert.deepEqual(loadRejectedUrls('nope', '/definitely/missing/rejected-urls.json'), []);
});

test('loadRejectedUrls + mergeRejectedUrls: entries and bare strings both land in the existing set', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rejected-urls-'));
  const p = join(dir, 'rejected-urls.json');
  writeFileSync(
    p,
    JSON.stringify([{ url: 'https://a.example/x', reason: 'dup', decidedAt: '2026-09-05', ref: '#1' }, 'https://b.example/y'])
  );
  const rows = loadRejectedUrls('t', p);
  assert.equal(rows.length, 2);
  assert.equal(rows[1].url, 'https://b.example/y');
  const existing = new Set<string>(['https://c.example/z']);
  assert.equal(mergeRejectedUrls('t', existing, p), 2);
  assert.deepEqual([...existing].sort(), ['https://a.example/x', 'https://b.example/y', 'https://c.example/z']);
  rmSync(dir, { recursive: true, force: true });
});

test('loadRejectedUrls: rejects a non-array file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rejected-urls-'));
  const p = join(dir, 'rejected-urls.json');
  writeFileSync(p, '{"url":"x"}');
  assert.throws(() => loadRejectedUrls('t', p), /expected a JSON array/);
  rmSync(dir, { recursive: true, force: true });
});

test('mergeRejectedUrls: the shared ledger applies to every domain', () => {
  // Regression for #273: rejected for benchmarking in #205, re-proposed for
  // tracker three weeks later because the ledger was per-domain only.
  const existing = new Set<string>();
  const n = mergeRejectedUrls('tracker', existing);
  assert.ok(n > 0, 'expected the shared ledger to contribute entries');
  assert.ok(existing.has('https://hai.stanford.edu/ai-index/global-vibrancy-tool'));
  assert.ok(existing.has('https://hai.stanford.edu/ai-index/2026-ai-index-report'));
});

test('mergeRejectedUrls: a domain-only reject does not leak into another domain', () => {
  const eco = new Set<string>();
  mergeRejectedUrls('ecosystem', eco);
  const blog = 'https://aisingapore.org/leveraging-generative-ai-in-project-management/';
  assert.ok(eco.has(blog));
  const tracker = new Set<string>();
  mergeRejectedUrls('tracker', tracker);
  assert.equal(tracker.has(blog), false);
});

// 2026-10-21: pipelines dropped AI-judge off-topic pages without recording
// them, so the same five pages (a scholarship, a dialect drama, …) headed the
// policies candidate list every month and used the whole --limit budget.
test('appendRejectedUrls: creates the file, appends, and skips URLs already present', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rejected-urls-'));
  const path = join(dir, 'sub', 'rejected-urls.json');
  const n1 = appendRejectedUrls('x', [{ url: 'https://a/1', reason: 'off-topic', decidedAt: '2026-10-21' }], path);
  const n2 = appendRejectedUrls(
    'x',
    [
      { url: 'https://a/1', reason: 'off-topic', decidedAt: '2026-10-22' },
      { url: 'https://a/2', reason: 'off-topic', decidedAt: '2026-10-22', ref: 'judge: not AI' },
    ],
    path
  );
  assert.equal(n1, 1);
  assert.equal(n2, 1);
  const all = loadRejectedUrls('x', path);
  assert.deepEqual(
    all.map((r) => [r.url, r.decidedAt]),
    [
      ['https://a/1', '2026-10-21'],
      ['https://a/2', '2026-10-22'],
    ]
  );
  rmSync(dir, { recursive: true, force: true });
});

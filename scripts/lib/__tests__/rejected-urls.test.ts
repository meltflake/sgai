import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { loadRejectedUrls, mergeRejectedUrls } from '../rejected-urls.ts';

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

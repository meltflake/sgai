// scripts/refresh/research-digest/__tests__/openalex-key.test.ts
// OpenAlex now meters requests: without a key every client on the same IP
// shares US$0.10 a day, and the 2026-10-21 run got HTTP 401 mid-month.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { openAlexKey } from '../openalex.ts';

test('openAlexKey: env var wins, then the key file, else empty', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oa-key-'));
  const file = join(dir, 'openalex-key');
  assert.equal(openAlexKey({ OPENALEX_API_KEY: ' env-key ' }, file), 'env-key');
  assert.equal(openAlexKey({}, file), '');
  writeFileSync(file, 'file-key\n');
  assert.equal(openAlexKey({}, file), 'file-key');
  assert.equal(openAlexKey({ OPENALEX_API_KEY: 'env-key' }, file), 'env-key');
  rmSync(dir, { recursive: true, force: true });
});

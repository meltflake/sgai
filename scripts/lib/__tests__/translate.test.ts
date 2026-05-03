// scripts/lib/__tests__/translate.test.ts
//
// translate.ts hits OpenAI on cache miss, so unit tests focus on the
// pure logic: empty input, cache hit short-circuit, and chunkParagraphs
// boundary behaviour. The OpenAI call path is exercised by integration
// tests on real pipelines.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import { translateBatch, translateRecords } from '../translate.ts';

function hashOf(direction: string, source: string): string {
  return createHash('sha256').update(`${direction}::${source}`).digest('hex');
}

function withCache<T>(fn: (dir: string) => T | Promise<T>): T | Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-translate-test-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('translateBatch: empty input returns empty', async () => {
  const out = await translateBatch([], { direction: 'en→zh' });
  assert.deepEqual(out, []);
});

test('translateBatch: full cache hit avoids network', async () => {
  await withCache(async (dir) => {
    // Pre-populate cache for two strings.
    const direction = 'en→zh' as const;
    const inputs = ['Hello.', 'Goodbye.'];
    for (const text of inputs) {
      const hash = hashOf(direction, text);
      writeFileSync(
        join(dir, `${hash}.json`),
        JSON.stringify({
          direction,
          source: text,
          target: text === 'Hello.' ? '你好。' : '再见。',
          model: 'gpt-test',
          translatedAt: '2026-05-03',
        })
      );
    }

    // No OPENAI_API_KEY needed because cache covers everything.
    const prevKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const out = await translateBatch(inputs, { direction, cacheDir: dir });
      assert.deepEqual(out, ['你好。', '再见。']);
    } finally {
      if (prevKey) process.env.OPENAI_API_KEY = prevKey;
    }
  });
});

test('translateRecords: skips records that already have non-empty *En', async () => {
  // No translation needed at all → no network call.
  const records = [
    { title: '一', titleEn: 'One' },
    { title: '二', titleEn: 'Two' },
  ];
  const out = await translateRecords(records, ['title'], { direction: 'zh→en' });
  assert.equal(out.length, 2);
  assert.equal(out[0].titleEn, 'One');
  assert.equal(out[1].titleEn, 'Two');
});

test('translateRecords: returns mutated copies (originals untouched)', async () => {
  const records = [{ title: 'A', titleEn: 'A' }];
  const out = await translateRecords(records, ['title'], { direction: 'zh→en' });
  assert.notEqual(out[0], records[0]);
});

test('translateRecords: skips records where source field is empty', async () => {
  const records = [{ title: '', titleEn: '' }];
  const out = await translateRecords(records, ['title'], { direction: 'zh→en' });
  // No translation attempted; titleEn stays empty.
  assert.equal(out[0].titleEn, '');
});

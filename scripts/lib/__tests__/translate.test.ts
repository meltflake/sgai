// scripts/lib/__tests__/translate.test.ts
//
// translate.ts hits the claude CLI on cache miss, so unit tests focus on
// the pure logic: empty input, cache hit short-circuit, and chunk
// boundaries. The CLI call path is exercised by integration tests on
// real pipelines.

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

    // Cache covers everything, so no claude CLI call should fire.
    // Point claude binary at a non-existent path so any accidental call would fail loudly.
    const prevBin = process.env.SGAI_CLAUDE_BIN;
    process.env.SGAI_CLAUDE_BIN = '/nonexistent/claude-should-not-run';
    try {
      const out = await translateBatch(inputs, { direction, cacheDir: dir });
      assert.deepEqual(out, ['你好。', '再见。']);
    } finally {
      if (prevBin) process.env.SGAI_CLAUDE_BIN = prevBin;
      else delete process.env.SGAI_CLAUDE_BIN;
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

test('translateBatch: cache hits for many short strings (regression: batchItems must not deadlock)', async () => {
  // Pre-populate cache for 80 short strings. Even though they would fit
  // in a single 18000-char batch by char budget, the new batchItems cap
  // (default 30) splits them. Full cache hit means no chunking is
  // attempted at all — verifying that the cache path short-circuits
  // before chunkParagraphs runs.
  await withCache(async (dir) => {
    const direction = 'zh→en' as const;
    const inputs: string[] = [];
    for (let i = 0; i < 80; i += 1) inputs.push(`第${i}号`);
    for (const text of inputs) {
      const hash = hashOf(direction, text);
      writeFileSync(
        join(dir, `${hash}.json`),
        JSON.stringify({
          direction,
          source: text,
          target: `Item ${text}`,
          model: 'gpt-test',
          translatedAt: '2026-05-09',
        })
      );
    }

    const prevBin = process.env.SGAI_CLAUDE_BIN;
    process.env.SGAI_CLAUDE_BIN = '/nonexistent/claude-should-not-run';
    try {
      const out = await translateBatch(inputs, { direction, cacheDir: dir, batchItems: 5 });
      assert.equal(out.length, 80);
      assert.equal(out[0], 'Item 第0号');
      assert.equal(out[79], 'Item 第79号');
    } finally {
      if (prevBin) process.env.SGAI_CLAUDE_BIN = prevBin;
      else delete process.env.SGAI_CLAUDE_BIN;
    }
  });
});

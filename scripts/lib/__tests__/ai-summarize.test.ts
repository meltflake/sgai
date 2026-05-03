// scripts/lib/__tests__/ai-summarize.test.ts
//
// summarizePage hits OpenAI. Tests cover input validation only; the
// happy-path goes through cache (pre-seeded JSON) to avoid the network.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import { summarizePage } from '../ai-summarize.ts';

function withCache<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-summarize-test-'));
  return fn(dir).finally(() => rmSync(dir, { recursive: true, force: true }));
}

function hashOf(sourceUrl: string, contentText: string): string {
  return createHash('sha256').update(`${sourceUrl}::${contentText.slice(0, 5000)}`).digest('hex');
}

test('summarizePage: rejects empty sourceUrl', async () => {
  await assert.rejects(
    summarizePage(
      { sourceUrl: '', title: 'x', contentText: 'y' },
      { categories: ['治理框架'] }
    ),
    /sourceUrl must be an absolute http/
  );
});

test('summarizePage: rejects relative sourceUrl', async () => {
  await assert.rejects(
    summarizePage(
      { sourceUrl: '/news/x', title: 'x', contentText: 'y' },
      { categories: ['治理框架'] }
    ),
    /sourceUrl/
  );
});

test('summarizePage: rejects empty categories list', async () => {
  await assert.rejects(
    summarizePage(
      { sourceUrl: 'https://x.gov.sg/y', title: 'x', contentText: 'y' },
      { categories: [] }
    ),
    /categories list is required/
  );
});

test('summarizePage: returns cached result without network when cache present', async () => {
  await withCache(async (dir) => {
    const input = {
      sourceUrl: 'https://imda.gov.sg/news/x',
      title: 'AI Advisory',
      contentText: 'IMDA released an advisory on AI bias on 5 May 2026.',
    };
    const hash = hashOf(input.sourceUrl, input.contentText);
    const cached = {
      sourceUrl: input.sourceUrl,
      title: 'AI 顾问',
      titleEn: 'AI Advisory',
      description: '关于 AI 偏见的指引。',
      descriptionEn: 'Guidance on AI bias.',
      category: '治理框架',
      publishedDate: '2026-05-05',
      confidence: 'high' as const,
      model: 'gpt-test',
      generatedAt: '2026-05-03T00:00:00Z',
    };
    writeFileSync(join(dir, `${hash}.json`), JSON.stringify(cached));

    const prevKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const out = await summarizePage(input, { categories: ['治理框架'], cacheDir: dir });
      assert.equal(out.title, 'AI 顾问');
      assert.equal(out.category, '治理框架');
      assert.equal(out.confidence, 'high');
    } finally {
      if (prevKey) process.env.OPENAI_API_KEY = prevKey;
    }
  });
});

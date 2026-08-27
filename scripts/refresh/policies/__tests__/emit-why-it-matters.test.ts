// scripts/refresh/policies/__tests__/emit-why-it-matters.test.ts
// ────────────────────────────────────────────────────────────────────────
// The policies emit must write the four `whyItMatters` siblings for every
// NEW record (CLAUDE.md rule #5 — zh alone would fail
// check:i18n-completeness), and must degrade to writing none of them when
// the drafter fails rather than aborting the refresh PR.
//
// Fully offline: the LLM drafter and the translator are injected as stubs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { emit } from '../emit.ts';
import type { EnrichedPolicy } from '../enrich.ts';
import type { WhyDraft, WhyInput } from '../../../lib/why-it-matters.ts';

// `policies: [` must open on its own line: findCategoryArrayCloseLine walks
// bracket depth and a collapsed `policies: [],` has no separate close line.
const FIXTURE = `export const categories = [
  {
    name: '预算与资金',
    policies: [
    ],
  },
];
`;

function withFixture(fn: (path: string) => Promise<void>): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-policies-why-'));
  const path = join(dir, 'policies.ts');
  writeFileSync(path, FIXTURE);
  return fn(path).finally(() => rmSync(dir, { recursive: true, force: true }));
}

const policy: EnrichedPolicy = {
  candidate: {
    sourceUrl: 'https://www.mof.gov.sg/news/ai-budget-2026/',
    domain: 'mof.gov.sg',
    label: 'Ministry of Finance',
    defaultCategory: '预算与资金',
    defaultSource: '财政部 (MOF)',
    defaultSourceEn: 'Ministry of Finance (MOF)',
    defaultSourceJa: '財務省 (MOF)',
    defaultSourceKo: '재정부 (MOF)',
    defaultSourceOrgUrl: 'https://www.mof.gov.sg/',
    defaultMinistry: 'MOF',
  },
  summary: {
    sourceUrl: 'https://www.mof.gov.sg/news/ai-budget-2026/',
    title: 'AI 预算 2026',
    titleEn: 'AI Budget 2026',
    titleJa: 'AI予算2026',
    titleKo: 'AI 예산 2026',
    description: '面向 AI 的财政预算说明。',
    descriptionEn: 'A budget note for AI.',
    descriptionJa: 'AI向け予算の説明。',
    descriptionKo: 'AI 예산 설명.',
    category: '预算与资金',
    publishedDate: '2026-06-01',
    confidence: 'high',
    model: 'test',
    generatedAt: '2026-06-19T00:00:00Z',
  },
  id: 'ai-budget-2026',
  pageTitle: 'AI Budget 2026',
  pageDate: '2026-06-01',
  pdfUrl: null,
  contentText: 'Budget 2026 sets aside S$1 billion for AI.',
};

const okDraft = async (input: WhyInput): Promise<WhyDraft> => {
  assert.equal(input.kind, 'policy');
  assert.equal(input.id, 'ai-budget-2026');
  return { whyItMatters: '测试判断 2026', model: 'stub', generatedAt: '2026-06-19T00:00:00Z' };
};

const stubTranslate = async (
  paragraphs: string[],
  options: { direction: string }
): Promise<string[]> => paragraphs.map((p) => `${options.direction}:${p}`);

/** Field-name order inside the emitted record, quote-style agnostic. */
function fieldOrder(source: string): string[] {
  return source
    .split('\n')
    .map((l) => l.trim().match(/^([A-Za-z_][A-Za-z0-9_]*):/)?.[1])
    .filter((f): f is string => Boolean(f));
}

test('policies emit: whyItMatters ×4 land after summaryKo', async () => {
  await withFixture(async (path) => {
    const result = await emit([policy], {
      filePath: path,
      draft: okDraft,
      translate: stubTranslate,
      warn: () => {},
    });
    assert.equal(result.recordsAdded, 1);

    const written = readFileSync(path, 'utf8');
    const order = fieldOrder(written);
    for (const f of ['whyItMatters', 'whyItMattersEn', 'whyItMattersJa', 'whyItMattersKo']) {
      assert.ok(order.includes(f), `missing ${f} in emitted record:\n${written}`);
    }
    assert.ok(
      order.indexOf('summaryKo') > -1 && order.indexOf('summaryKo') < order.indexOf('whyItMatters'),
      `whyItMatters must come after summaryKo; order = ${order.join(', ')}`
    );
    assert.equal(order.indexOf('whyItMattersEn'), order.indexOf('whyItMatters') + 1);
    assert.equal(order.indexOf('whyItMattersJa'), order.indexOf('whyItMatters') + 2);
    assert.equal(order.indexOf('whyItMattersKo'), order.indexOf('whyItMatters') + 3);

    assert.ok(written.includes('测试判断 2026'), written);
    assert.ok(written.includes('zh→en:测试判断 2026'), written);
    assert.ok(written.includes('zh→ja:测试判断 2026'), written);
    assert.ok(written.includes('zh→ko:测试判断 2026'), written);
  });
});

test('policies emit: a throwing drafter omits all four fields and the emit still succeeds', async () => {
  await withFixture(async (path) => {
    const warnings: string[] = [];
    const result = await emit([policy], {
      filePath: path,
      draft: async () => {
        throw new Error('whyItMatters draft rejected twice for policy/ai-budget-2026: too long');
      },
      translate: async () => {
        throw new Error('translator must not be reached when the draft failed');
      },
      warn: (m) => warnings.push(m),
    });

    assert.equal(result.recordsAdded, 1);
    assert.equal(result.skipped.length, 0);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /ai-budget-2026/);

    const written = readFileSync(path, 'utf8');
    assert.ok(!written.includes('whyItMatters'), `no whyItMatters* line may be written:\n${written}`);
    // The record itself still landed.
    assert.ok(written.includes('ai-budget-2026'), written);
    assert.ok(written.includes('addedAt'), written);
  });
});

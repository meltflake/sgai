// scripts/refresh/videos/__tests__/emit-why-it-matters.test.ts
// ────────────────────────────────────────────────────────────────────────
// The videos emit must write the four `whyItMatters` siblings for every NEW
// record (CLAUDE.md rule #5 — zh alone would fail check:i18n-completeness),
// and must degrade to writing none of them when the drafter fails rather
// than aborting the refresh PR.
//
// Fully offline: the LLM drafter and the translator are injected as stubs.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { attachWhyItMatters, buildEntrySnippet, type ApprovedEntry } from '../emit.ts';
import type { WhyDraft, WhyInput } from '../../../lib/why-it-matters.ts';

function entry(): ApprovedEntry {
  return {
    videoId: 'AbCdEfGhIjK',
    title: 'Singapore AI strategy update',
    description: 'A talk on Singapore AI strategy.',
    date: '2026-08-20',
    channel: 'CNA',
    youtubeUrl: 'https://www.youtube.com/watch?v=AbCdEfGhIjK',
    id: 'v100',
    duration: '12:34',
    fields: {
      title: '新加坡 AI 战略更新',
      titleEn: 'Singapore AI strategy update',
      titleJa: 'シンガポールAI戦略の最新情報',
      titleKo: '싱가포르 AI 전략 업데이트',
      summary: '部长谈新加坡 AI 战略的下一步。',
      summaryEn: 'The minister on the next step of Singapore AI strategy.',
      summaryJa: '大臣がシンガポールAI戦略の次の一手を語ります。',
      summaryKo: '장관이 싱가포르 AI 전략의 다음 단계를 설명합니다.',
      topic: 'AI 战略与愿景',
      topicEn: 'AI Strategy & Vision',
      topicJa: 'AI戦略とビジョン',
      topicKo: 'AI 전략과 비전',
      speaker: 'Josephine Teo',
      speakerTitle: '通讯及新闻部长',
      speakerTitleEn: 'Minister for Digital Development and Information',
      speakerTitleJa: 'デジタル開発情報大臣',
      speakerTitleKo: '디지털개발정보부 장관',
      speakerType: 'government',
      model: 'test',
      generatedAt: '2026-08-20T00:00:00Z',
    },
  };
}

const okDraft = async (input: WhyInput): Promise<WhyDraft> => {
  assert.equal(input.kind, 'video');
  assert.equal(input.id, 'v100');
  return { whyItMatters: '测试判断 2026', model: 'stub', generatedAt: '2026-08-20T00:00:00Z' };
};

const stubTranslate = async (
  paragraphs: string[],
  options: { direction: string }
): Promise<string[]> => paragraphs.map((p) => `${options.direction}:${p}`);

const silent = () => {};

test('videos emit: whyItMatters ×4 land right after summaryKo', async () => {
  const e = entry();
  const n = await attachWhyItMatters([e], { draft: okDraft, translate: stubTranslate, warn: silent });
  assert.equal(n, 1);

  const snippet = buildEntrySnippet(e);
  const lines = snippet.split('\n');
  const at = (field: string) => lines.findIndex((l) => l.trim().startsWith(`${field}:`));

  assert.ok(at('whyItMatters') > -1, `missing whyItMatters:\n${snippet}`);
  assert.ok(at('whyItMattersEn') > -1, `missing whyItMattersEn:\n${snippet}`);
  assert.ok(at('whyItMattersJa') > -1, `missing whyItMattersJa:\n${snippet}`);
  assert.ok(at('whyItMattersKo') > -1, `missing whyItMattersKo:\n${snippet}`);

  assert.ok(at('summaryKo') < at('whyItMatters'), 'whyItMatters must come after summaryKo');
  assert.equal(at('whyItMattersEn'), at('whyItMatters') + 1);
  assert.equal(at('whyItMattersJa'), at('whyItMatters') + 2);
  assert.equal(at('whyItMattersKo'), at('whyItMatters') + 3);

  assert.match(lines[at('whyItMatters')], /'测试判断 2026'/);
  assert.match(lines[at('whyItMattersEn')], /'zh→en:测试判断 2026'/);
  assert.match(lines[at('whyItMattersJa')], /'zh→ja:测试判断 2026'/);
  assert.match(lines[at('whyItMattersKo')], /'zh→ko:测试判断 2026'/);
});

test('videos emit: a throwing drafter omits all four fields and the emit survives', async () => {
  const e = entry();
  const warnings: string[] = [];
  const n = await attachWhyItMatters([e], {
    draft: async () => {
      throw new Error('whyItMatters draft rejected twice for video/v100: no concrete anchor');
    },
    translate: async () => {
      throw new Error('translator must not be reached when the draft failed');
    },
    warn: (m) => warnings.push(m),
  });

  assert.equal(n, 0);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /v100/);

  const snippet = buildEntrySnippet(e);
  assert.doesNotMatch(snippet, /whyItMatters/, `no whyItMatters* line may be written:\n${snippet}`);
  // The rest of the record is untouched — the emit still produces a valid entry.
  assert.match(snippet, /id: 'v100',/);
  assert.match(snippet, /summaryKo: '/);
  assert.match(snippet, /addedAt: '/);
});

test('videos emit: an incomplete translation omits all four (never zh alone)', async () => {
  const e = entry();
  const warnings: string[] = [];
  const n = await attachWhyItMatters([e], {
    draft: okDraft,
    // ja comes back empty — the i18n gate would reject a partial set.
    translate: async (paragraphs: string[], options: { direction: string }) =>
      options.direction === 'zh→ja' ? paragraphs.map(() => '') : paragraphs.map((p) => `x:${p}`),
    warn: (m) => warnings.push(m),
  });

  assert.equal(n, 0);
  assert.equal(warnings.length, 1);
  assert.doesNotMatch(buildEntrySnippet(e), /whyItMatters/);
});

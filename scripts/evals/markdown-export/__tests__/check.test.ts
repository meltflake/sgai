// scripts/evals/markdown-export/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the markdown-export eval's pure core. A twin is
// only useful to an agent if it has a title, says where it came from,
// carries its reuse terms, and contains no field-access rot. Each of those
// is one assertion; this test pins all four plus the happy path.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { assertMarkdownTwin, sectionOf } from '../check.ts';

const GOOD = [
  '# 针对非自愿私密影像的限时下架措施',
  '',
  '- 日期: 2026-07-07',
  '- 来源: https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=written-answer-23654',
  '- sgai: https://sgai.md/zh/debates/written-answer-23654/',
  '- 许可：sgai 自产内容（摘要、译文、分析）CC BY 4.0，署名并链接 sgai.md 即可。',
  '',
  '## 摘要',
  '',
  '王诗尼女士书面质询数字发展与信息部。',
  '',
].join('\n');

test('assertMarkdownTwin: a well-formed twin has no violations', () => {
  assert.deepEqual(assertMarkdownTwin(GOOD), []);
});

test('assertMarkdownTwin: a broken twin reports every failed assertion', () => {
  // No H1 (starts with prose), no permalink line, no license marker, and
  // both flavours of field-access rot.
  const bad = [
    'Debate: undefined',
    '',
    '- Date: 2026-07-07',
    '- Who: [object Object]',
    '',
    'Body text.',
  ].join('\n');

  const rules = assertMarkdownTwin(bad)
    .map((v) => v.rule)
    .sort();
  assert.deepEqual(rules, [
    'missing-h1',
    'missing-license',
    'missing-permalink',
    'object-literal',
    'undefined-literal',
  ]);
});

test('assertMarkdownTwin: permalink must be the sgai canonical host, not any URL', () => {
  const wrongHost = GOOD.replace(
    '- sgai: https://sgai.md/zh/debates/written-answer-23654/',
    '- sgai: https://example.com/zh/debates/written-answer-23654/',
  );
  assert.deepEqual(
    assertMarkdownTwin(wrongHost).map((v) => v.rule),
    ['missing-permalink'],
  );
});

test('assertMarkdownTwin: "undefined" inside a longer word is not a violation', () => {
  // Guards against a naive `includes('undefined')`, which would fire on
  // ordinary prose such as "undefinedness" or a URL slug.
  const prose = GOOD.replace('王诗尼女士书面质询数字发展与信息部。', 'The notion of undefinedness was raised.');
  assert.deepEqual(assertMarkdownTwin(prose), []);
});

test('sectionOf: recognises root and locale-prefixed twins, ignores the rest', () => {
  assert.equal(sectionOf('debates/oral-answer-4088.md'), 'debates');
  assert.equal(sectionOf('ja/policies/nais-2.md'), 'policies');
  assert.equal(sectionOf('zh-tw/videos/v001.md'), 'videos');
  assert.equal(sectionOf('llms-full.txt'), undefined);
});

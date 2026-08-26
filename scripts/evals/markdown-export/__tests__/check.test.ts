// scripts/evals/markdown-export/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the markdown-export eval's pure core. A twin is
// only useful to an agent if it has a title, says where it came from,
// carries its reuse terms, and its generated metadata block contains no
// field-access rot. Each of those is one assertion; this test pins all
// four plus the happy path.
//
// The last two tests guard the boundary that matters most: rot detection
// is scoped to the metadata block, so verbatim Hansard / policy prose that
// happens to contain the word "undefined" can never fail a build gate.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { assertMarkdownTwin, metadataBlock, sectionOf } from '../check.ts';

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
  // both flavours of field-access rot — all inside the metadata block.
  const bad = ['Debate: undefined', '', '- Date: 2026-07-07', '- Who: [object Object]', '', 'Body text.'].join('\n');

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
    '- sgai: https://example.com/zh/debates/written-answer-23654/'
  );
  assert.deepEqual(
    assertMarkdownTwin(wrongHost).map((v) => v.rule),
    ['missing-permalink']
  );
});

test('assertMarkdownTwin: "undefined" inside a longer word is not a violation', () => {
  // Guards against a naive `includes('undefined')` in the metadata block.
  const head = GOOD.replace('- 日期: 2026-07-07', '- 日期: 2026-07-07 (undefinedness aside)');
  assert.deepEqual(assertMarkdownTwin(head), []);
});

test('assertMarkdownTwin: verbatim body prose may say "undefined" / "[object Object]"', () => {
  // The real shape this protects: a Hansard answer or policy document that
  // discusses undefined behaviour. The body is third-party text we render
  // verbatim — pattern-matching developer strings there would make an
  // unrelated debate able to fail `check:dist`.
  const body = [
    GOOD.trimEnd(),
    '',
    '## Full text',
    '',
    'The Minister said the term is undefined in the Act.',
    '',
    'A witness quoted a log line reading [object Object].',
    '',
  ].join('\n');
  assert.deepEqual(assertMarkdownTwin(body), []);
});

test('metadataBlock: stops at the first section heading', () => {
  const head = metadataBlock(GOOD);
  assert.ok(head.startsWith('# 针对非自愿私密影像的限时下架措施'));
  assert.ok(head.includes('- sgai: https://sgai.md/'));
  assert.ok(!head.includes('## 摘要'));
  // A twin with no sections at all is entirely metadata.
  assert.equal(metadataBlock('# Title\n\n- sgai: https://sgai.md/x/'), '# Title\n\n- sgai: https://sgai.md/x/');
});

test('sectionOf: recognises root and locale-prefixed twins, ignores the rest', () => {
  assert.equal(sectionOf('debates/oral-answer-4088.md'), 'debates');
  assert.equal(sectionOf('ja/policies/nais-2.md'), 'policies');
  assert.equal(sectionOf('zh-tw/videos/v001.md'), 'videos');
  assert.equal(sectionOf('llms-full.txt'), undefined);
});

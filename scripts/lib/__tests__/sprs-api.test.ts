// scripts/lib/__tests__/sprs-api.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { htmlToParagraphs, matchesAiKeywords, AI_TITLE_KEYWORDS } from '../sprs-api.ts';

test('htmlToParagraphs: splits on <br> and block tags', () => {
  const html = '<p>First</p><p>Second</p><br>Third';
  const paragraphs = htmlToParagraphs(html);
  assert.deepEqual(paragraphs, ['First', 'Second', 'Third']);
});

test('htmlToParagraphs: decodes common HTML entities', () => {
  const html = '<p>D&amp;D &nbsp; &rsquo;quote&rsquo;</p>';
  const paragraphs = htmlToParagraphs(html);
  assert.equal(paragraphs.length, 1);
  assert.ok(paragraphs[0].includes('D&D'));
  assert.ok(paragraphs[0].includes("'quote'"));
});

test('htmlToParagraphs: collapses whitespace', () => {
  const html = '<p>foo   bar\n\n\tbaz</p>';
  assert.deepEqual(htmlToParagraphs(html), ['foo bar baz']);
});

test('htmlToParagraphs: returns empty array for empty input', () => {
  assert.deepEqual(htmlToParagraphs(''), []);
  assert.deepEqual(htmlToParagraphs('<div></div>'), []);
});

test('matchesAiKeywords: case-insensitive AI / artificial intelligence', () => {
  assert.equal(matchesAiKeywords('Update on AI strategy'), true);
  assert.equal(matchesAiKeywords('Artificial Intelligence policy'), true);
  assert.equal(matchesAiKeywords('artificial intelligence policy'), true);
});

test('matchesAiKeywords: catches data centre / smart nation / deepfake', () => {
  assert.equal(matchesAiKeywords('New data centre approved in Tuas'), true);
  assert.equal(matchesAiKeywords('Smart Nation update'), true);
  assert.equal(matchesAiKeywords('Deepfake regulation in Singapore'), true);
});

test('matchesAiKeywords: rejects unrelated topics', () => {
  assert.equal(matchesAiKeywords('Public housing in Tampines'), false);
  assert.equal(matchesAiKeywords('Healthcare reform 2026'), false);
});

test('AI_TITLE_KEYWORDS: contains expected count of patterns', () => {
  assert.ok(AI_TITLE_KEYWORDS.length >= 10);
});

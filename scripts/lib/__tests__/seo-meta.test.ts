// Pins the word-boundary truncation behavior of src/utils/seo-meta.ts —
// the generation-side guarantee behind the scripts/check-meta.mjs dist gate.
// GSC 2026-07: /debates/budget-437/ shipped a description cut mid-word at
// 207 chars ("…NS needs identifica"); these tests make that class of cut
// impossible to reintroduce silently.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { synthesizeMetaDescription, truncateAtBoundary, weightedLength } from '../../../src/utils/seo-meta';

// ── weightedLength ──────────────────────────────────────────────────────

test('weightedLength: Latin counts 1 unit per char', () => {
  assert.equal(weightedLength('abc def'), 7);
});

test('weightedLength: CJK counts 2 units per char (Han, kana, Hangul, CJK punct)', () => {
  assert.equal(weightedLength('中文'), 4);
  assert.equal(weightedLength('カナ'), 4);
  assert.equal(weightedLength('한글'), 4);
  assert.equal(weightedLength('。'), 2);
  assert.equal(weightedLength('中a文b'), 6);
});

// ── truncateAtBoundary ──────────────────────────────────────────────────

test('truncateAtBoundary: text within budget passes through untouched', () => {
  assert.equal(truncateAtBoundary('Short and sweet.', 160), 'Short and sweet.');
});

test('truncateAtBoundary: collapses internal whitespace', () => {
  assert.equal(truncateAtBoundary('a  b\n\nc', 160), 'a b c');
});

test('truncateAtBoundary: never cuts a Latin word in half (the budget-437 bug)', () => {
  const text =
    'Budget: whether National Service needs identification systems for artificial intelligence deployment across public healthcare institutions';
  const out = truncateAtBoundary(text, 46);
  assert.ok(out.endsWith('…'), `expected ellipsis, got "${out}"`);
  const core = out.slice(0, -1);
  // The kept prefix must end exactly at a word boundary in the source.
  assert.ok(text.startsWith(core), `"${core}" is not a prefix of the source`);
  assert.equal(text[core.length], ' ', `cut mid-word: "${out}"`);
});

test('truncateAtBoundary: every cut across many budgets lands on a word boundary', () => {
  const text = 'alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november oscar papa';
  for (let budget = 12; budget < text.length; budget += 7) {
    const out = truncateAtBoundary(text, budget);
    if (!out.endsWith('…')) continue;
    const core = out.slice(0, -1);
    assert.ok(text.startsWith(core), `budget ${budget}: "${core}" not a prefix`);
    assert.equal(text[core.length], ' ', `budget ${budget}: cut mid-word → "${out}"`);
  }
});

test('truncateAtBoundary: result always fits the weighted budget', () => {
  const samples = [
    'word '.repeat(100),
    '新加坡人工智能治理框架的持续演进与落地执行情况观察。'.repeat(10),
    ('Mixed 中英 content with AI 政策 and long English words interspersed 治理框架 throughout the text. ').repeat(5),
  ];
  for (const s of samples) {
    for (const budget of [40, 80, 160]) {
      const out = truncateAtBoundary(s, budget);
      assert.ok(weightedLength(out) <= budget, `budget ${budget} exceeded: ${weightedLength(out)}`);
    }
  }
});

test('truncateAtBoundary: CJK cuts at character level within budget (≈80 chars per 160 units)', () => {
  const zh = '新加坡人工智能治理框架的持续演进与落地执行情况观察，覆盖政策、国会辩论与生态系统。'.repeat(4);
  const out = truncateAtBoundary(zh, 160);
  assert.ok(out.endsWith('…'));
  assert.ok(weightedLength(out) <= 160);
  // 160 units ≈ 79 CJK chars + ellipsis
  assert.ok(Array.from(out).length >= 70 && Array.from(out).length <= 81, `got ${Array.from(out).length} chars`);
});

test('truncateAtBoundary: no ellipsis when the cut lands on a sentence end', () => {
  const out = truncateAtBoundary('好句。'.repeat(50), 31);
  assert.ok(!out.endsWith('…'), `got "${out}"`);
  assert.ok(out.endsWith('。'));
});

test('truncateAtBoundary: strips dangling separators before the ellipsis', () => {
  const out = truncateAtBoundary('alpha bravo, charliedeltaecho foxtrot golf hotel', 15);
  assert.ok(!/[\s,;:、，]…$/.test(out), `dangling separator survived: "${out}"`);
  assert.ok(out.endsWith('…'));
});

test('truncateAtBoundary: text already ending in an ellipsis is not double-suffixed', () => {
  assert.equal(truncateAtBoundary('already cut…', 160), 'already cut…');
});

// ── synthesizeMetaDescription ───────────────────────────────────────────

test('synthesizeMetaDescription: joins parts and skips empties', () => {
  assert.equal(synthesizeMetaDescription(['2024 · MDDI.', null, undefined, ' ', 'A summary.']), '2024 · MDDI. A summary.');
});

test('synthesizeMetaDescription: drops fenced code blocks whole (2e35ebd regression)', () => {
  const out = synthesizeMetaDescription(['Before.\n```yaml\nnodes:\n  - input.visual\n```\nAfter.']);
  assert.equal(out, 'Before. After.');
});

test('synthesizeMetaDescription: strips markdown links, emphasis, and list markers', () => {
  const out = synthesizeMetaDescription(['- **Bold** [label](https://example.com) `code` # heading']);
  assert.equal(out, 'Bold label code heading');
});

test('synthesizeMetaDescription: default budget is 160 weighted units', () => {
  const out = synthesizeMetaDescription(['word '.repeat(60)]);
  assert.ok(out.endsWith('…'));
  assert.ok(weightedLength(out) <= 160, `got ${weightedLength(out)}`);
});

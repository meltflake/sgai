// scripts/lib/__tests__/i18n-check-en-sentence.test.ts
// ────────────────────────────────────────────────────────────────────────
// Finding C: the EN-sentence allow-list must NOT be a whole-sentence bypass.
//
// Before the fix, a leaking English sentence was fully exempted whenever it
// merely *contained* a brand allow-term (e.g. "OpenAI"). So a real fallback
// leak sitting next to a brand name slipped past the ratchet entirely. The
// fix strips allow-terms from the sentence and re-counts residual English;
// only a residue below the token threshold is exempt.
//
// These tests drive the pure helpers exported from scripts/i18n-check.mjs.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { enSentenceExempt, filterEnSentences } from '../../i18n-check.mjs';

// Mirrors EN_SENTENCE_ALLOW / the zh-tw & zh enSentence config (minTokens 6).
const ALLOW = ['Singapore AI Observatory', 'AI Singapore', 'Smart Nation', 'OpenAI', 'GovTech', 'sgai'];
const ZH_LIKE_CFG = { minTokens: 6, allowPatterns: ALLOW, nativeScriptRegex: /[一-鿿]/ };
const JA_LIKE_CFG = { minTokens: 4, allowPatterns: ALLOW, nativeScriptRegex: /[぀-ゟ゠-ヿ]/ };

// ── enSentenceExempt ────────────────────────────────────────────────────

test('enSentenceExempt: pure brand token is exempt', () => {
  assert.equal(enSentenceExempt('OpenAI', ALLOW, 6), true);
  assert.equal(enSentenceExempt('AI Singapore', ALLOW, 6), true);
});

test('enSentenceExempt: brand + long English sentence is NOT exempt', () => {
  // The Finding C repro sentence: contains "OpenAI" but the rest is a full
  // English clause that must still be flagged.
  const sent = 'OpenAI announced a comprehensive new national partnership across every sector this year';
  assert.equal(enSentenceExempt(sent, ALLOW, 6), false);
});

test('enSentenceExempt: residue just below threshold is exempt', () => {
  // "AI Singapore" stripped → residue "launches today" = 2 tokens < 6.
  assert.equal(enSentenceExempt('AI Singapore launches today', ALLOW, 6), true);
});

test('enSentenceExempt: empty allow-list never exempts', () => {
  assert.equal(enSentenceExempt('any english sentence here at all', [], 6), false);
});

test('enSentenceExempt: overlapping patterns removed longest-first', () => {
  // "AI Singapore" (longer) must be removed as a unit; if "sgai" or a shorter
  // term consumed first, the count could drift. Pure brand → exempt.
  assert.equal(enSentenceExempt('AI Singapore', ['AI Singapore', 'Singapore'], 6), true);
});

// ── filterEnSentences (full scan wiring) ────────────────────────────────

test('filterEnSentences: flags brand-adjacent leak (zh-like config)', () => {
  const text = 'OpenAI announced a comprehensive new national partnership across every sector this year.';
  const hits = filterEnSentences(text, ZH_LIKE_CFG);
  assert.equal(hits.length, 1);
});

test('filterEnSentences: does NOT flag a pure brand sentence', () => {
  const hits = filterEnSentences('OpenAI. AI Singapore. Smart Nation.', ZH_LIKE_CFG);
  assert.deepEqual(hits, []);
});

test('filterEnSentences: skips sentences containing native script', () => {
  // A sentence with Han is native zh content, not EN residue.
  const hits = filterEnSentences('OpenAI 与新加坡政府在各领域展开全面合作。', ZH_LIKE_CFG);
  assert.deepEqual(hits, []);
});

test('filterEnSentences: ja config (minTokens 4) still catches brand-adjacent leak', () => {
  const text = 'GovTech launched a major new nationwide digital platform.';
  const hits = filterEnSentences(text, JA_LIKE_CFG);
  assert.equal(hits.length, 1);
});

test('filterEnSentences: undefined config yields no hits', () => {
  assert.deepEqual(filterEnSentences('OpenAI announced a big new partnership today here.', undefined), []);
});

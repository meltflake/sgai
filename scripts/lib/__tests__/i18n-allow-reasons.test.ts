// scripts/lib/__tests__/i18n-allow-reasons.test.ts
// ────────────────────────────────────────────────────────────────────────
// Finding A: the six `langs: 'all'` verbatim reasons are an UNVALIDATED
// escape hatch. A block wrapped in one of them is stripped from the scan on
// every locale with no marker-violation recorded — so someone could quiet
// the scanner over fabricated English by wrapping it in, say,
// `data-i18n-allow-en="debate-title-original"`.
//
// This test is the proportionate mitigation: it pins the EXACT registry
// contents (each reason's attr + langs). Any silent widening of an existing
// reason to `langs: 'all'`, or a NEW all-locale reason added without review,
// fails here and forces a conscious update to this expected table (and the
// documented trust-boundary rationale). It does NOT attempt full structural
// mirror validation — that is a larger effort, out of scope for this fix.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ALLOW_REASONS } from '../i18n-allow-reasons.mjs';

// The intended, reviewed registry. Keep this table and the module in lockstep:
// changing one without the other is exactly what this test is here to catch.
const EXPECTED = {
  // Verbatim / original source — TRUSTED, valid on every locale.
  'hansard-original': { attr: 'both', langs: 'all' },
  'hansard-transcript-verbatim': { attr: 'data-i18n-allow-en', langs: 'all' },
  'speech-verbatim-source': { attr: 'both', langs: 'all' },
  'video-transcript-verbatim': { attr: 'data-i18n-allow-en', langs: 'all' },
  'citation-original': { attr: 'both', langs: 'all' },
  'debate-title-original': { attr: 'both', langs: 'all' },
  // EN-fallback — legitimate ONLY on ko (zh-tw appearing = leak).
  'video-digest-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  'benchmark-case-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  'benchmark-region-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  'about-prose-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
};

// The six reasons that are `langs: 'all'` — the trusted verbatim boundary.
// This set must not grow without review. If it does, the assertion below
// spells out the exact new reason so the reviewer can weigh it.
const EXPECTED_ALL_LOCALE = new Set([
  'hansard-original',
  'hansard-transcript-verbatim',
  'speech-verbatim-source',
  'video-transcript-verbatim',
  'citation-original',
  'debate-title-original',
]);

test('ALLOW_REASONS: exact attr + langs for every registered reason', () => {
  // Same key set (no additions, no removals).
  assert.deepEqual(Object.keys(ALLOW_REASONS).sort(), Object.keys(EXPECTED).sort());
  // Same shape for each entry.
  for (const [reason, spec] of Object.entries(EXPECTED)) {
    assert.deepEqual(
      ALLOW_REASONS[reason],
      spec,
      `Reason "${reason}" drifted from the reviewed registry (attr/langs mismatch).`
    );
  }
});

test('ALLOW_REASONS: the trusted all-locale set has not grown without review', () => {
  const actualAllLocale = new Set(
    Object.entries(ALLOW_REASONS)
      .filter(([, spec]) => (spec as { langs: unknown }).langs === 'all')
      .map(([reason]) => reason)
  );
  assert.deepEqual(
    [...actualAllLocale].sort(),
    [...EXPECTED_ALL_LOCALE].sort(),
    'A langs:"all" reason was added/removed. All-locale reasons are a trusted, ' +
      'unvalidated escape hatch — review the change and update EXPECTED_ALL_LOCALE + docs.'
  );
});

test('ALLOW_REASONS: every en-fallback reason is ko-only (never all-locale)', () => {
  for (const [reason, spec] of Object.entries(ALLOW_REASONS)) {
    if (!reason.endsWith('-en-fallback')) continue;
    assert.deepEqual(
      (spec as { langs: unknown }).langs,
      ['ko'],
      `"${reason}" is an en-fallback reason; it must stay ko-only. Widening it ` +
        'to zh-tw or all would re-open the 2026-07 fallback-leak bug class.'
    );
  }
});

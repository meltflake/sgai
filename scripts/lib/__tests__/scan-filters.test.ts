// Unit tests for the shared scan-noise filters (scripts/lib/scan-filters.ts).
// Fixtures are the actual noise URLs from the 2026-07-28 dry-run audit
// (issue #166) — each case is a real incident, not a hypothetical.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  extractYearFromUrl,
  isGenericOrLanding,
  normalizeUrl,
  selectCandidates,
} from '../scan-filters.ts';

// ── isGenericOrLanding ──────────────────────────────────────────────────

test('generic sections are rejected (policies denylist preserved)', () => {
  assert.equal(isGenericOrLanding('https://www.mddi.gov.sg/about-us/board/'), true);
  assert.equal(isGenericOrLanding('https://www.smartnation.gov.sg/community/events/road-show/'), true);
  assert.equal(isGenericOrLanding('https://www.imda.gov.sg/newsletter'), true);
});

test('bare listing roots are rejected, article slugs under them pass', () => {
  assert.equal(isGenericOrLanding('https://www.smartnation.gov.sg/initiatives/'), true);
  assert.equal(isGenericOrLanding('https://www.mddi.gov.sg/newsroom/'), true);
  assert.equal(isGenericOrLanding('https://www.tech.gov.sg/media/'), true);
  assert.equal(isGenericOrLanding('https://www.mddi.gov.sg/newsroom/some-real-speech-slug/'), false);
  assert.equal(isGenericOrLanding('https://www.tech.gov.sg/media/some-press-release-slug/'), false);
});

test('sso.agc.gov.sg /Browse/ statute-navigation shells are rejected (issue #166 legal-ai)', () => {
  assert.equal(isGenericOrLanding('https://sso.agc.gov.sg/Browse/Act/Current'), true);
  assert.equal(isGenericOrLanding('https://sso.agc.gov.sg/Browse/Bills-Supp'), true);
  // A specific statute page is NOT a browse shell.
  assert.equal(isGenericOrLanding('https://sso.agc.gov.sg/Act/PDPA2012'), false);
});

test('pagination query params mark a listing view (issue #166 tracker)', () => {
  const base =
    'https://www.imda.gov.sg/about-imda/research-and-statistics/support-for-industry-sectors/media/film/singapore-stories';
  assert.equal(isGenericOrLanding(`${base}?page=1`), true);
  assert.equal(isGenericOrLanding(`${base}?page=4`), true);
  // The un-paginated URL is judged on its path alone.
  assert.equal(isGenericOrLanding(base), false);
});

test('real IMDA content under /about-imda/ is NOT swept up by the /about/ rule', () => {
  assert.equal(
    isGenericOrLanding(
      'https://www.imda.gov.sg/about-imda/emerging-technologies-and-research/national-multimodal-llm-programme'
    ),
    false
  );
});

test('unparseable URLs are treated as noise', () => {
  assert.equal(isGenericOrLanding('not a url'), true);
});

// ── normalizeUrl ────────────────────────────────────────────────────────

test('normalizeUrl collapses pagination variants to one key', () => {
  const base = 'https://www.imda.gov.sg/x/singapore-stories';
  assert.equal(normalizeUrl(`${base}?page=1`), normalizeUrl(`${base}?page=4`));
  assert.equal(normalizeUrl(`${base}?page=2`), normalizeUrl(base));
});

test('normalizeUrl collapses trailing slash and fragment, keeps meaningful params', () => {
  assert.equal(normalizeUrl('https://a.gov.sg/doc/'), normalizeUrl('https://a.gov.sg/doc'));
  assert.equal(normalizeUrl('https://a.gov.sg/doc#section-2'), normalizeUrl('https://a.gov.sg/doc'));
  // Non-pagination params are meaningful — must survive.
  assert.notEqual(normalizeUrl('https://a.gov.sg/doc?id=42'), normalizeUrl('https://a.gov.sg/doc'));
});

test('normalizeUrl returns unparseable input unchanged', () => {
  assert.equal(normalizeUrl('not a url'), 'not a url');
});

// ── extractYearFromUrl ──────────────────────────────────────────────────

test('extractYearFromUrl finds archive years (issue #166 benchmarking)', () => {
  assert.equal(extractYearFromUrl('https://hai.stanford.edu/ai-index/2017-ai-index-report'), 2017);
  assert.equal(
    extractYearFromUrl('https://hai.stanford.edu/ai-index/2024-ai-index-report/responsible-ai'),
    2024
  );
});

test('extractYearFromUrl is fail-open on yearless and non-year numerics', () => {
  assert.equal(extractYearFromUrl('https://www.imd.org/wcc/rankings'), undefined);
  // 5-digit runs and non-year numbers are not years.
  assert.equal(extractYearFromUrl('https://a.gov.sg/report-123456'), undefined);
});

// ── selectCandidates ────────────────────────────────────────────────────

test('selectCandidates round-robins across sources instead of letting the first starve the rest', () => {
  const picked = selectCandidates(
    [
      ['a1', 'a2', 'a3', 'a4', 'a5'],
      ['b1', 'b2'],
      ['c1'],
    ],
    3
  );
  // One from each source before seconds from any — the old code would have
  // returned a1,a2,a3.
  assert.deepEqual(picked, ['a1', 'b1', 'c1']);
});

test('selectCandidates fills from deeper sources when others run dry', () => {
  assert.deepEqual(selectCandidates([['a1', 'a2', 'a3'], []], 3), ['a1', 'a2', 'a3']);
});

test('selectCandidates dedupes across sources and respects the total limit', () => {
  const picked = selectCandidates(
    [
      ['x', 'a2'],
      ['x', 'b2'],
    ],
    4
  );
  // Round 0: x (source A), x deduped (source B). Round 1: a2, b2.
  assert.deepEqual(picked, ['x', 'a2', 'b2']);
});

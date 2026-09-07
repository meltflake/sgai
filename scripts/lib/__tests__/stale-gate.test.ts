// scripts/lib/__tests__/stale-gate.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isStale, isStaleByUrlYear, parseDateLoose, staleVerdict } from '../stale-gate.ts';

const NOW = new Date('2026-09-07T00:00:00Z');

test('parseDateLoose: RFC 2822 pubDate, ISO, YYYY-MM, garbage', () => {
  assert.equal(parseDateLoose('Mon, 31 Aug 2026 09:15:00 +0800'), '2026-08-31');
  assert.equal(parseDateLoose('2020-06-08T10:00:00Z'), '2020-06-08');
  assert.equal(parseDateLoose('2020-06'), '2020-06-01');
  assert.equal(parseDateLoose('not a date'), null);
  assert.equal(parseDateLoose(''), null);
  assert.equal(parseDateLoose(undefined), null);
});

test('isStale: six-year-old GovTech page is stale at 180 days', () => {
  const v = isStale('2020-06-08', 180, NOW);
  assert.equal(v.stale, true);
  assert.equal(v.date, '2020-06-08');
  assert.ok(v.ageDays !== null && v.ageDays > 2000);
});

test('isStale: last week is fresh; exactly at the window is fresh', () => {
  assert.equal(isStale('2026-08-31', 180, NOW).stale, false);
  assert.equal(isStale('2026-03-11', 180, NOW).stale, false); // 180 days
  assert.equal(isStale('2026-03-10', 180, NOW).stale, true); // 181 days
});

test('isStale: unknown date is never stale; maxAgeDays=0 disables the gate', () => {
  assert.deepEqual(isStale(null, 180, NOW), { stale: false, date: null, ageDays: null });
  assert.equal(isStale('2020-06-08', 0, NOW).stale, false);
});

test('isStaleByUrlYear: year in path bounds the date; no year means unknown', () => {
  assert.equal(isStaleByUrlYear('https://x.gov.sg/media/2020/06/launch', 180, NOW).stale, true);
  assert.equal(isStaleByUrlYear('https://x.gov.sg/media/2026/launch', 180, NOW).stale, false);
  assert.equal(isStaleByUrlYear('https://x.gov.sg/media/launch-2020-plan', 180, NOW).stale, true); // slug year counts
  assert.equal(isStaleByUrlYear('https://x.gov.sg/products/foo', 180, NOW).date, null);
});

test('staleVerdict: a publication date decides outright, even against an old URL year', () => {
  const v = staleVerdict({ published: [undefined, 'junk', '2026-08-31'], url: 'https://x/2020/a' }, 180, NOW);
  assert.equal(v.date, '2026-08-31');
  assert.equal(v.stale, false);
});

test('staleVerdict: a fresh lastmod does not vouch for a page whose URL carries an old date', () => {
  // The 2026-09-07 GovTech case: CMS migration stamped every page with a
  // 2026 lastmod, but the slug says 2021-10-28.
  const v = staleVerdict(
    { modified: ['2026-08-04T10:00:28.888Z'], url: 'https://www.tech.gov.sg/media/2021-10-28-all-agencies-accept-singpass/' },
    180,
    NOW
  );
  assert.equal(v.stale, true);
  assert.equal(v.date, '2021-12-31');
});

test('staleVerdict: an old lastmod alone is enough; a fresh lastmod with no other hint is unknown-but-fresh', () => {
  assert.equal(staleVerdict({ modified: ['2024-01-05'], url: 'https://x/products/foo' }, 180, NOW).stale, true);
  const fresh = staleVerdict({ modified: ['2026-08-04'], url: 'https://x/products/foo' }, 180, NOW);
  assert.equal(fresh.stale, false);
  assert.equal(fresh.date, '2026-08-04');
  assert.deepEqual(staleVerdict({}, 180, NOW), { stale: false, date: null, ageDays: null });
});

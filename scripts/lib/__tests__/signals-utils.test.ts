// scripts/lib/__tests__/signals-utils.test.ts
// View logic for the /signals/ page and the homepage block.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { homeSignals, groupByIsoWeek, topicCounts } from '../../../src/utils/signals.ts';
import type { Signal } from '../../../src/data/signals.ts';

function sig(id: string, date: string, topicIds: string[] = ['national-strategy']): Signal {
  return {
    id,
    date,
    title: id,
    titleEn: id,
    titleJa: id,
    titleKo: id,
    whyItMatters: 'w',
    whyItMattersEn: 'w',
    whyItMattersJa: 'w',
    whyItMattersKo: 'w',
    sourceUrl: `https://example.org/${id}`,
    sourceName: 'X',
    topicIds,
    addedAt: date,
  };
}

test('homeSignals: returns the recent window when it has enough items', () => {
  const all = ['10-16', '10-15', '10-14', '10-12', '10-10', '09-01'].map((d, i) => sig(`s${i}`, `2026-${d}`));
  const out = homeSignals(all, '2026-10-16');
  assert.deepEqual(
    out.map((s) => s.id),
    ['s0', 's1', 's2', 's3', 's4']
  );
});

test('homeSignals: thin window falls back to the newest six overall', () => {
  const dates = ['10-16', '08-01', '07-30', '07-20', '07-10', '07-01', '06-20', '06-10'];
  const all = dates.map((d, i) => sig(`s${i}`, `2026-${d}`));
  const out = homeSignals(all, '2026-10-16');
  assert.equal(out.length, 6);
  assert.equal(out[0].id, 's0');
  assert.equal(out[5].id, 's5');
});

test('homeSignals: caps the window at six and sorts by date desc', () => {
  const all = ['10-03', '10-16', '10-05', '10-15', '10-06', '10-14', '10-07', '10-13'].map((d, i) =>
    sig(`s${i}`, `2026-${d}`)
  );
  const out = homeSignals(all, '2026-10-16');
  assert.deepEqual(
    out.map((s) => s.date),
    ['2026-10-16', '2026-10-15', '2026-10-14', '2026-10-13', '2026-10-07', '2026-10-06']
  );
});

test('homeSignals: empty input → empty output', () => {
  assert.deepEqual(homeSignals([], '2026-10-16'), []);
});

test('groupByIsoWeek: groups by ISO week across a year boundary, newest first', () => {
  const all = [sig('a', '2026-12-31'), sig('b', '2027-01-02'), sig('c', '2027-01-04'), sig('d', '2026-12-27')];
  const weeks = groupByIsoWeek(all);
  assert.deepEqual(
    weeks.map((w) => [w.key, w.monday, w.sunday, w.items.map((s) => s.id)]),
    [
      ['2027-W01', '2027-01-04', '2027-01-10', ['c']],
      ['2026-W53', '2026-12-28', '2027-01-03', ['b', 'a']],
      ['2026-W52', '2026-12-21', '2026-12-27', ['d']],
    ]
  );
});

test('topicCounts: counts topics, order by count desc then id', () => {
  const all = [sig('a', '2026-10-01', ['finance', 'healthcare']), sig('b', '2026-10-02', ['healthcare']), sig('c', '2026-10-03', ['economy-industry'])];
  assert.deepEqual(topicCounts(all), [
    { id: 'healthcare', count: 2 },
    { id: 'economy-industry', count: 1 },
    { id: 'finance', count: 1 },
  ]);
});

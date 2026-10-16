// scripts/refresh/signals/__tests__/select.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { selectSignals, withinWindow, type Judged } from '../select.ts';

test('withinWindow: null, too old and future dates are outside; today and edge are inside', () => {
  assert.equal(withinWindow(null, '2026-10-16', 7), false);
  assert.equal(withinWindow('2026-10-08', '2026-10-16', 7), false);
  assert.equal(withinWindow('2026-10-09', '2026-10-16', 7), true);
  assert.equal(withinWindow('2026-10-16', '2026-10-16', 7), true);
  assert.equal(withinWindow('2026-10-18', '2026-10-16', 7), false);
});

function judged(
  url: string,
  title: string,
  score: number,
  date: string,
  eventKey = url,
  singapore = true,
  ai = true
): Judged {
  return {
    candidate: { url, title, sourceId: 'x', sourceName: 'X', kind: 'rss' },
    judgment: { singapore, ai, score, reason: 'r', titleZh: '标题', topicIds: ['finance'], eventKey },
    pageDate: date,
    contentText: '',
  };
}

test('selectSignals: drops non-SG / non-AI / score < 4, sorts by score then date', () => {
  const out = selectSignals(
    [
      judged('https://a.com/1', 'one', 4, '2026-10-10'),
      judged('https://a.com/2', 'two', 5, '2026-10-09'),
      judged('https://a.com/3', 'three', 3, '2026-10-15'),
      judged('https://a.com/4', 'four', 4, '2026-10-14'),
      judged('https://a.com/5', 'five', 5, '2026-10-15', 'k5', false),
      judged('https://a.com/6', 'six', 5, '2026-10-15', 'k6', true, false),
    ],
    8
  );
  assert.deepEqual(
    out.map((j) => j.candidate.url),
    ['https://a.com/2', 'https://a.com/4', 'https://a.com/1']
  );
});

test('selectSignals: same event (same eventKey) keeps the gov.sg source', () => {
  const out = selectSignals(
    [
      judged('https://www.businesstimes.com.sg/tech/imda-sandbox', 'IMDA expands sandbox', 5, '2026-10-15', 'imda-sandbox'),
      judged('https://www.imda.gov.sg/resources/press-releases/sandbox', 'IMDA launches sandbox 2.0', 4, '2026-10-14', 'imda-sandbox'),
    ],
    8
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].candidate.url, 'https://www.imda.gov.sg/resources/press-releases/sandbox');
});

test('selectSignals: same event by headline overlap keeps the higher-priority source', () => {
  const out = selectSignals(
    [
      judged('https://www.channelnewsasia.com/x', 'Singapore launches national AI compute grid for startups', 5, '2026-10-15', 'a'),
      judged('https://aisingapore.org/y', 'Singapore launches national AI compute grid', 4, '2026-10-15', 'b'),
      judged('https://www.channelnewsasia.com/z', 'Unrelated healthcare AI pilot at SGH', 4, '2026-10-15', 'c'),
    ],
    8
  );
  assert.deepEqual(
    out.map((j) => j.candidate.url),
    ['https://aisingapore.org/y', 'https://www.channelnewsasia.com/z']
  );
});

test('selectSignals: respects the limit', () => {
  const heads = ['bank', 'clinic', 'port', 'school', 'court', 'grid', 'chip', 'farm', 'rail', 'drone', 'lab', 'museum'];
  const many = heads.map((h, i) => judged(`https://a.com/${i}`, `${h} pilot deploys assistant`, 4, '2026-10-10', `k${i}`));
  assert.equal(selectSignals(many, 8).length, 8);
});

// scripts/refresh/signals/__tests__/candidates.test.ts
// RSS feeds keep only the newest items (Business Times ~16, CNA latest ~20),
// so a weekly scan saw a few days of news at most (2026-10-21). A daily
// collect run stores candidates; the weekly run judges the whole backlog.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { mergeCandidates, type StoredCandidate } from '../candidates.ts';
import type { SignalCandidate } from '../scan.ts';

const c = (url: string, hintedDate?: string, title = 't'): SignalCandidate => ({
  url,
  title,
  sourceId: 'bt',
  sourceName: 'The Business Times',
  kind: 'rss',
  hintedDate,
});

test('mergeCandidates: adds new, keeps stored, de-duplicates by normalised URL', () => {
  const stored: StoredCandidate[] = [{ ...c('https://a.com/x', '2026-10-15'), firstSeen: '2026-10-15' }];
  const out = mergeCandidates(stored, [c('https://a.com/x/', '2026-10-15'), c('https://a.com/y', '2026-10-20')], '2026-10-20', 14);
  assert.deepEqual(
    out.map((x) => [x.url, x.firstSeen]),
    [
      ['https://a.com/x', '2026-10-15'],
      ['https://a.com/y', '2026-10-20'],
    ]
  );
});

test('mergeCandidates: drops entries older than keepDays by hinted date, else by first seen', () => {
  const stored: StoredCandidate[] = [
    { ...c('https://a.com/old', '2026-09-30'), firstSeen: '2026-10-19' },
    { ...c('https://a.com/undated'), firstSeen: '2026-10-01' },
    { ...c('https://a.com/keep'), firstSeen: '2026-10-10' },
  ];
  const out = mergeCandidates(stored, [], '2026-10-20', 14);
  assert.deepEqual(
    out.map((x) => x.url),
    ['https://a.com/keep']
  );
});

test('mergeCandidates: a fresh title fills an empty stored title', () => {
  const stored: StoredCandidate[] = [{ ...c('https://a.com/x', undefined, ''), firstSeen: '2026-10-19' }];
  const out = mergeCandidates(stored, [c('https://a.com/x', '2026-10-19', 'Headline')], '2026-10-20', 14);
  assert.equal(out[0].title, 'Headline');
  assert.equal(out[0].hintedDate, '2026-10-19');
});

// scripts/refresh/signals/__tests__/page.test.ts
// Lessons from the first live run (2026-10-17): a client-rendered IMDA page
// gave a 361-char body and the draft was written from the title alone; EDB's
// metadata date is its repost date, not the company's release date.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cleanHeadline, resolveCandidate, spaceCjkLatin } from '../page.ts';
import type { SignalCandidate } from '../scan.ts';

const body = (extra = '') => extra + ' ' + 'Singapore AI programme details. '.repeat(40);
const cand = (over: Partial<SignalCandidate> = {}): SignalCandidate => ({
  url: 'https://www.edb.gov.sg/en/news-and-insights/x',
  title: '',
  sourceId: 'edb',
  sourceName: 'EDB',
  kind: 'sitemap',
  ...over,
});

test('resolveCandidate: a body under 800 characters is too thin to judge', () => {
  const r = resolveCandidate(
    { title: 'New Initiatives', publishedDate: '2026-10-14', publishedDateSource: 'published', contentText: 'x'.repeat(500) },
    cand(),
    { today: '2026-10-17', days: 14 }
  );
  assert.deepEqual(r, { skip: 'thin body (500 chars)' });
});

test('resolveCandidate: the visible release date overrides the repost metadata date', () => {
  const r = resolveCandidate(
    {
      title: 'AST completes facility',
      publishedDate: '2026-10-07',
      publishedDateSource: 'published',
      contentText: body('AST completes facility 29 Sept 2026 • 2 min read This press release was issued by AST.'),
    },
    cand(),
    { today: '2026-10-17', days: 14, visibleDate: /(\d{1,2} [A-Za-z]{3,9} 20\d\d)\s*•\s*\d+ min read/ }
  );
  assert.deepEqual(r, { skip: 'date 2026-09-29 outside window' });
});

test('resolveCandidate: a modified-only page date falls back to the RSS hint', () => {
  const r = resolveCandidate(
    { title: 'T', publishedDate: '2026-10-17', publishedDateSource: 'modified', contentText: body() },
    cand({ kind: 'rss', title: 'Feed headline | Publisher', hintedDate: '2026-10-15' }),
    { today: '2026-10-17', days: 7 }
  );
  assert.ok('date' in r);
  assert.equal(r.date, '2026-10-15');
  assert.equal(r.title, 'Feed headline');
});

test('resolveCandidate: a sitemap page with only a modified date has no usable date', () => {
  const r = resolveCandidate(
    { title: 'T', publishedDate: '2026-10-17', publishedDateSource: 'modified', contentText: body() },
    cand(),
    { today: '2026-10-17', days: 7 }
  );
  assert.deepEqual(r, { skip: 'date unknown outside window' });
});

test('cleanHeadline: strips sentence punctuation at the end', () => {
  assert.equal(cleanHeadline('シンガポールが新施策を発表しました。'), 'シンガポールが新施策を発表しました');
  assert.equal(cleanHeadline('새 조치를 발표합니다. '), '새 조치를 발표합니다');
  assert.equal(cleanHeadline('Singapore launches it.'), 'Singapore launches it');
  assert.equal(cleanHeadline('A*STAR deal: S$40m'), 'A*STAR deal: S$40m');
});

test('spaceCjkLatin: one space between Chinese and Latin letters or digits', () => {
  assert.equal(spaceCjkLatin('Anthropic在新加坡设办公室并签AI备忘录'), 'Anthropic 在新加坡设办公室并签 AI 备忘录');
  assert.equal(spaceCjkLatin('投4000万新元'), '投 4000 万新元');
  assert.equal(spaceCjkLatin('已有空格 AI 不重复'), '已有空格 AI 不重复');
  assert.equal(spaceCjkLatin('与A*STAR合作'), '与 A*STAR 合作');
  assert.equal(spaceCjkLatin('MDDI：回应'), 'MDDI：回应');
});

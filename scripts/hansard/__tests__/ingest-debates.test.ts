// scripts/hansard/__tests__/ingest-debates.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { bumpStats, insertAfter, isoFromSitting, validateDraft, type Draft } from '../ingest-debates.ts';

const SOURCE = `37 Mr Saktiandi Supaat asked the Minister for Digital Development and Information whether export controls will affect data centres.
Mrs Josephine Teo : We are monitoring developments on export controls on artificial intelligence (AI) chips. Our data centre operators have diversified suppliers.`;

function draft(over: Partial<Draft> = {}): Draft {
  return {
    title: 'AI 芯片出口管制的影响',
    speakers: ['Mr Saktiandi Supaat', 'Mrs Josephine Teo'],
    topics: ['AI Infrastructure & Research'],
    summary: '议员询问出口管制影响。',
    summaryEn: 'An MP asked.',
    keyPoints: ['政府在监测'],
    keyPointsEn: ['The Government is monitoring'],
    governmentStance: '政府在监测。',
    governmentStanceEn: 'Monitoring.',
    oppositionStance: null,
    oppositionStanceEn: null,
    controversyLevel: 2,
    policySignal: '信号',
    policySignalEn: 'Signal',
    notableQuote: '我们在监测。',
    notableQuoteEn: 'We are monitoring developments on export controls on artificial intelligence (AI) chips.',
    transcriptEn: 'Digest.',
    ...over,
  };
}

test('isoFromSitting: D-M-YYYY to ISO', () => {
  assert.equal(isoFromSitting('6-10-2026'), '2026-10-06');
  assert.throws(() => isoFromSitting('2026-10-06'));
});

test('validateDraft: a good draft passes and keeps a verbatim quote', () => {
  const d = draft();
  assert.deepEqual(validateDraft(d, SOURCE), []);
  assert.ok(d.notableQuoteEn);
});

test('validateDraft: an invented quote is dropped, invented speakers removed, topics filtered', () => {
  const d = draft({
    notableQuoteEn: 'We will ban all AI chips.',
    speakers: ['Mr Saktiandi Supaat', 'Mr Invented Person'],
    topics: ['AI Strategy', 'Made-up Topic', 'AI Strategy'],
  });
  assert.deepEqual(validateDraft(d, SOURCE), []);
  assert.equal(d.notableQuoteEn, null);
  assert.equal(d.notableQuote, null);
  assert.deepEqual(d.speakers, ['Mr Saktiandi Supaat']);
  assert.deepEqual(d.topics, ['AI Strategy']);
});

test('validateDraft: reports unusable drafts', () => {
  const p = validateDraft(draft({ topics: ['Nope'], keyPointsEn: [], title: 'English only' }), SOURCE);
  assert.equal(p.length, 3);
});

test('insertAfter: inserts after the anchor, throws when missing', () => {
  assert.equal(insertAfter('export const x = [\n  a,\n];', 'export const x = [', '  b,\n'), 'export const x = [\n  b,\n  a,\n];');
  assert.throws(() => insertAfter('nothing', 'export const x = [', 'b'));
});

test('bumpStats: recounts total, year, type, topic and existing top speakers', () => {
  const src = `export const DEBATE_STATS = {
  total: 234,
  byYear: {
    '2025': 28,
    '2026': 112,
  },
  byType: {
    'Written Answers to Questions': 103,
    Budget: 59,
  },
  byTopic: {
    'AI Economy & Industry': 103,
    'AI & Employment': 70,
  },
  topSpeakers: {
    'Josephine Teo': 47,
    'Saktiandi Supaat': 21,
  },
};
`;
  const out = bumpStats(src, [
    { date: '2026-10-06', type: 'Written Answers to Questions', topics: ['AI & Employment'], speakers: ['Mrs Josephine Teo', 'Mr Saktiandi Supaat'] },
    { date: '2026-10-07', type: 'Written Answers to Questions', topics: ['AI & Employment', 'AI Economy & Industry'], speakers: ['Mrs Josephine Teo'] },
  ]);
  assert.match(out, /total: 236,/);
  assert.match(out, /'2026': 114,/);
  assert.match(out, /'2025': 28,/);
  assert.match(out, /'Written Answers to Questions': 105,/);
  assert.match(out, /Budget: 59,/);
  assert.match(out, /'AI & Employment': 72,/);
  assert.match(out, /'AI Economy & Industry': 104,/);
  assert.match(out, /'Josephine Teo': 49,/);
  assert.match(out, /'Saktiandi Supaat': 22,/);
});

import { cleanText } from '../ingest-debates.ts';

test('cleanText: the official MDDI name 数码发展及新闻部, no irregular whitespace', () => {
  assert.equal(cleanText('33号　莫哈默法理议员问数字发展与新闻部长'), '33号 莫哈默法理议员问数码发展及新闻部长');
  assert.equal(cleanText('数字发展与信息部（MDDI）'), '数码发展及新闻部（MDDI）');
  assert.equal(cleanText('数字发展和信息部'), '数码发展及新闻部');
  assert.equal(cleanText('a b​c'), 'a bc');
});

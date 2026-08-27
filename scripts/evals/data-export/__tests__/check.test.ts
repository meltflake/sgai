// scripts/evals/data-export/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the data-export eval's pure core. A gate that
// cannot fail is worse than no gate, so each assertion gets a sample that
// must pass and a sample that must not.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  checkEnvelope,
  checkExpectedFiles,
  checkFile,
  checkItems,
  checkRecordsOrder,
  DATA_LICENSE_URL,
  EXPECTED_DATASETS,
  LOCALE_KEYS,
} from '../check.ts';

const ORIGIN = 'https://sgai.md';

/** The five-locale map recordLinks() builds for a bare (en) path. */
function sgaiMap(path: string): Record<string, string> {
  return {
    en: `${ORIGIN}${path}`,
    zh: `${ORIGIN}/zh${path}`,
    'zh-tw': `${ORIGIN}/zh-tw${path}`,
    ja: `${ORIGIN}/ja${path}`,
    ko: `${ORIGIN}/ko${path}`,
  };
}

function sgaiLinks(path: string) {
  return { links: { sgai: sgaiMap(path) } };
}

function goodEnvelope(dataset: string, items: unknown[]) {
  return {
    schemaVersion: 1,
    dataset,
    siteVersion: '0.25.6',
    dataUpdated: '2026-08-26',
    license: { authored: { name: 'CC BY 4.0' }, verbatim: {}, terms: DATA_LICENSE_URL },
    attribution: { name: 'Singapore AI Observatory / sgai.md', url: ORIGIN, note: 'Link to the specific page.' },
    count: items.length,
    items,
  };
}

const goodRecord = {
  type: 'debate',
  source: 'debate',
  id: 'oral-answer-4088',
  addedAt: '2026-08-20',
  eventDate: '2026-08-05',
  title: { zh: '人工智能', en: 'Artificial intelligence', ja: 'AI', ko: 'AI' },
  summary: null,
  ...sgaiLinks('/debates/oral-answer-4088/'),
};

test('a well-formed envelope produces no violations', () => {
  assert.deepEqual(checkFile('records.json', goodEnvelope('records', [goodRecord])), []);
});

test('index.json rows carry no links and are still accepted', () => {
  const row = { dataset: 'debates', url: `${ORIGIN}/data/debates.json`, count: 3, description: 'Debates.' };
  assert.deepEqual(checkFile('index.json', goodEnvelope('index', [row])), []);
});

test('a bare array (envelope lost) is rejected', () => {
  const v = checkFile('policies.json', [goodRecord]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /bare array/);
});

test('count mismatch is rejected', () => {
  const env = { ...goodEnvelope('records', [goodRecord]), count: 7 };
  const v = checkFile('records.json', env);
  assert.equal(v.length, 1);
  assert.equal(v[0].file, 'records.json');
  assert.match(v[0].reason, /count is 7 but items\.length is 1/);
});

test('a missing locale key in links.sgai is rejected', () => {
  const sgai = sgaiMap('/debates/oral-answer-4088/');
  delete sgai.ko;
  const v = checkFile('debates.json', goodEnvelope('debates', [{ ...goodRecord, links: { sgai } }]));
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /missing locale "ko"/);
});

test('dataset must match the filename', () => {
  const v = checkEnvelope('videos.json', goodEnvelope('debates', []));
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /expected "videos"/);
});

test('schemaVersion other than 1 is rejected', () => {
  const v = checkEnvelope('records.json', { ...goodEnvelope('records', []), schemaVersion: 2 });
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /schemaVersion is 2/);
});

test('a license pointing somewhere other than DATA-LICENSE.md is rejected', () => {
  const env = goodEnvelope('records', []);
  env.license.terms = 'https://example.com/license';
  const v = checkEnvelope('records.json', env);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /license\.terms/);
});

test('a relative sgai link is rejected', () => {
  const sgai = { ...sgaiMap('/x/'), ja: '/ja/x/' };
  const v = checkItems('debates.json', [{ ...goodRecord, links: { sgai } }]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /not an absolute/);
});

test('a locale URL under the wrong prefix is rejected', () => {
  // The classic hand-built-URL bug: the ko key holding the ja page.
  const sgai = sgaiMap('/videos/v001/');
  sgai.ko = `${ORIGIN}/ja/videos/v001/`;
  const v = checkItems('videos.json', [{ ...goodRecord, links: { sgai } }]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /does not sit under "\/ko"/);
});

test('the en key must NOT be prefixed', () => {
  const sgai = sgaiMap('/videos/v001/');
  sgai.en = `${ORIGIN}/zh/videos/v001/`;
  const v = checkItems('videos.json', [{ ...goodRecord, links: { sgai } }]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /does not sit under "\/"/);
});

test('records.json rows need a non-empty English title', () => {
  const bad = { ...goodRecord, title: { zh: '标题', en: '  ', ja: '', ko: '' } };
  const v = checkItems('records.json', [bad]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /title\.en is empty/);
  // The same row in another dataset is not subject to the rule.
  assert.deepEqual(checkItems('debates.json', [bad]), []);
});

test('all five locales are covered by the check', () => {
  assert.deepEqual([...LOCALE_KEYS].sort(), ['en', 'ja', 'ko', 'zh', 'zh-tw']);
});

// ── The six exports must all be there ───────────────────────────────────

test('all six expected exports present → no violations', () => {
  const found = EXPECTED_DATASETS.map((d) => `${d}.json`);
  assert.deepEqual(checkExpectedFiles(found), []);
});

test('a missing export is a failure, not a smaller sample', () => {
  // videos.json stopped emitting — the four healthy files must not hide it.
  const found = EXPECTED_DATASETS.filter((d) => d !== 'videos').map((d) => `${d}.json`);
  const v = checkExpectedFiles(found);
  assert.equal(v.length, 1);
  assert.equal(v[0].file, 'videos.json');
  assert.match(v[0].reason, /missing from dist\/data/);
});

test('an empty dist/data reports every expected export', () => {
  assert.equal(checkExpectedFiles([]).length, EXPECTED_DATASETS.length);
});

test('an extra unexpected export is not a failure', () => {
  const found = [...EXPECTED_DATASETS.map((d) => `${d}.json`), 'experimental.json'];
  assert.deepEqual(checkExpectedFiles(found), []);
});

// ── records.json ordering ───────────────────────────────────────────────

const dated = (addedAt: string) => ({ ...goodRecord, addedAt });

test('records sorted newest-first pass; equal dates are allowed', () => {
  const items = [dated('2026-08-25'), dated('2026-08-25'), dated('2026-08-01'), dated('2025-12-31')];
  assert.deepEqual(checkRecordsOrder('records.json', items), []);
});

test('an out-of-order record is rejected', () => {
  const items = [dated('2026-08-01'), dated('2026-08-25')];
  const v = checkRecordsOrder('records.json', items);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /not sorted descending/);
});

test('ordering is enforced through checkFile for records.json only', () => {
  const items = [dated('2026-08-01'), dated('2026-08-25')];
  const bad = checkFile('records.json', goodEnvelope('records', items));
  assert.equal(bad.length, 1);
  assert.match(bad[0].reason, /not sorted descending/);
  // debates.json rows are data-file ordered on purpose — no ordering rule.
  assert.deepEqual(checkFile('debates.json', goodEnvelope('debates', items)), []);
});

test('a record with no addedAt cannot be ordered and is reported', () => {
  const noDate = { ...goodRecord } as Record<string, unknown>;
  delete noDate.addedAt;
  const v = checkRecordsOrder('records.json', [noDate]);
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /addedAt is missing/);
});

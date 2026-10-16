// scripts/refresh/signals/__tests__/emit.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { insertSignals, renderSignal, signalId } from '../emit.ts';
import type { Signal } from '../../../../src/data/signals.ts';

const rec: Signal = {
  id: 'sig-20261015-imda-sandbox',
  date: '2026-10-15',
  title: "新加坡's 沙盒",
  titleEn: "Singapore's sandbox \\ test",
  titleJa: 'サンドボックス',
  titleKo: '샌드박스',
  whyItMatters: '第一句',
  whyItMattersEn: 'One',
  whyItMattersJa: 'ひとつ',
  whyItMattersKo: '하나',
  sourceUrl: 'https://www.imda.gov.sg/x',
  sourceName: 'IMDA',
  topicIds: ['finance'],
  addedAt: '2026-10-16',
};

test('renderSignal: escapes quotes and backslashes, omits empty related', () => {
  const out = renderSignal(rec);
  assert.ok(out.includes("titleEn: 'Singapore\\'s sandbox \\\\ test',"));
  assert.ok(!out.includes('related'));
  const withRel = renderSignal({ ...rec, related: [{ kind: 'person', id: 'josephine-teo' }] });
  assert.ok(withRel.includes("related: [{ kind: 'person', id: 'josephine-teo' }],"));
});

test('renderSignal output evaluates back to the same record', () => {
  const obj = new Function(`return (${renderSignal(rec).trim().replace(/,$/, '')});`)();
  assert.deepEqual(obj, rec);
});

const EMPTY = "export interface Signal {}\n\nexport const signals: Signal[] = [];\n";
const ONE = "export const signals: Signal[] = [\n  {\n    id: 'sig-old',\n  },\n];\n";

test('insertSignals: into an empty array', () => {
  const out = insertSignals(EMPTY, [rec]);
  assert.ok(out.startsWith('export interface Signal {}'));
  assert.match(out, /export const signals: Signal\[\] = \[\n {2}\{\n {4}id: 'sig-20261015-imda-sandbox',/);
  assert.ok(out.trimEnd().endsWith('];'));
});

test('insertSignals: new records go before existing ones', () => {
  const out = insertSignals(ONE, [rec]);
  assert.ok(out.indexOf('sig-20261015-imda-sandbox') < out.indexOf('sig-old'));
});

test('insertSignals: throws when the array anchor is missing', () => {
  assert.throws(() => insertSignals('export const other = [];', [rec]));
});

test('signalId: date + slug, unique against existing ids', () => {
  assert.equal(signalId('2026-10-15', 'imda-sandbox', new Set()), 'sig-20261015-imda-sandbox');
  assert.equal(signalId('2026-10-15', 'imda-sandbox', new Set(['sig-20261015-imda-sandbox'])), 'sig-20261015-imda-sandbox-2');
  assert.equal(signalId('2026-10-15', '', new Set()), 'sig-20261015-item');
});

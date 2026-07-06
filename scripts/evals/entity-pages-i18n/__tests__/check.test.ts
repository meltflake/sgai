// Unit tests for the pure walker in scripts/evals/entity-pages-i18n/check.ts.
// Importing the module must NOT trigger the entity-pages import (main() is
// CLI-guarded), so these fixtures run in milliseconds.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { walkForMissingSiblings, DEFAULT_SKIP_KEYS } from '../check.ts';

test('CJK base with En sibling but no Ja/Ko → one violation missing both', () => {
  const v = walkForMissingSiblings({ title: '新加坡核心战略', titleEn: 'Singapore Core Strategy' }, 'src', 'p1');
  assert.equal(v.length, 1);
  assert.equal(v[0].path, 'title');
  assert.deepEqual(v[0].missing, ['Ja', 'Ko']);
});

test('all four siblings present → clean', () => {
  const v = walkForMissingSiblings(
    { title: '战略', titleEn: 'Strategy', titleJa: '戦略', titleKo: '전략' },
    'src',
    'p1',
  );
  assert.deepEqual(v, []);
});

test('Latin base (proper noun) with En sibling → skipped by CJK gate', () => {
  const v = walkForMissingSiblings({ acquirer: 'SoundCloud', acquirerEn: 'SoundCloud' }, 'src', 'p1');
  assert.deepEqual(v, []);
});

test('empty-string sibling counts as missing (whitespace too)', () => {
  const v = walkForMissingSiblings(
    { title: '战略', titleEn: 'Strategy', titleJa: '', titleKo: '  ' },
    'src',
    'p1',
  );
  assert.equal(v.length, 1);
  assert.deepEqual(v[0].missing, ['Ja', 'Ko']);
});

test('CJK field without an En sibling → not a localized pair, skipped', () => {
  const v = walkForMissingSiblings({ name: '深圳公司' }, 'src', 'p1');
  assert.deepEqual(v, []);
});

test('string-array fields: missing / empty / present', () => {
  const missing = walkForMissingSiblings({ sources: ['中文来源'], sourcesEn: ['Source'] }, 'src', 'p1');
  assert.equal(missing.length, 1);
  assert.deepEqual(missing[0].missing, ['Ja', 'Ko']);

  const emptyArr = walkForMissingSiblings(
    { sources: ['中文来源'], sourcesEn: ['Source'], sourcesJa: [], sourcesKo: ['한국어'] },
    'src',
    'p1',
  );
  assert.equal(emptyArr.length, 1);
  assert.deepEqual(emptyArr[0].missing, ['Ja']);

  const clean = walkForMissingSiblings(
    { sources: ['中文来源'], sourcesEn: ['Source'], sourcesJa: ['日本語'], sourcesKo: ['한국어'] },
    'src',
    'p1',
  );
  assert.deepEqual(clean, []);
});

test('nested object arrays report a dotted+indexed path', () => {
  const v = walkForMissingSiblings({ facts: [{ label: '年份', labelEn: 'Year' }] }, 'src', 'p1');
  assert.equal(v.length, 1);
  assert.equal(v[0].path, 'facts[0].label');
});

test('skip keys: raw-data back-references are not descended into', () => {
  const v = walkForMissingSiblings(
    { region: { overview: '中文概览', overviewEn: 'Overview' } },
    'src',
    'p1',
    DEFAULT_SKIP_KEYS,
  );
  assert.deepEqual(v, []);
});

test('locale-sibling keys are never treated as bases', () => {
  // bodyJa itself contains CJK but must not demand bodyJaEn/bodyJaJa.
  const v = walkForMissingSiblings(
    { body: '中文', bodyEn: 'English', bodyJa: '日本語の本文', bodyKo: '한국어' },
    'src',
    'p1',
  );
  assert.deepEqual(v, []);
});

test('cyclic references terminate without crashing', () => {
  const a: Record<string, unknown> = { title: '战略', titleEn: 'Strategy' };
  a.self = a;
  const v = walkForMissingSiblings(a, 'src', 'p1');
  assert.equal(v.length, 1); // the title violation, exactly once
});

test('maxDepth caps descent', () => {
  const deep = { l1: { l2: { l3: { title: '战略', titleEn: 'S' } } } };
  assert.equal(walkForMissingSiblings(deep, 'src', 'p1', new Set(), 2).length, 0);
  assert.equal(walkForMissingSiblings(deep, 'src', 'p1', new Set(), 8).length, 1);
});

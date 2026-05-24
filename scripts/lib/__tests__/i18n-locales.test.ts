import { test } from 'node:test';
import assert from 'node:assert/strict';

import { dataSiblingLocales, dataSiblingSuffixes, siblingSuffix } from '../i18n-locales.mjs';

test('siblingSuffix: converts kebab-cased locale codes to field suffixes', () => {
  assert.equal(siblingSuffix('zh'), '');
  assert.equal(siblingSuffix('en'), 'En');
  assert.equal(siblingSuffix('zh-tw'), 'ZhTw');
  assert.equal(siblingSuffix('pt-br'), 'PtBr');
});

test('dataSiblingLocales: excludes source and derived locales', () => {
  assert.deepEqual(dataSiblingLocales(['en', 'zh', 'zh-tw', 'ja', 'ko']), ['en', 'ja', 'ko']);
});

test('dataSiblingLocales: future authored locales are required by default', () => {
  assert.deepEqual(dataSiblingLocales(['en', 'zh', 'zh-tw', 'ja', 'ko', 'fr']), ['en', 'ja', 'ko', 'fr']);
  assert.deepEqual(dataSiblingSuffixes(['en', 'zh', 'zh-tw', 'ja', 'ko', 'fr']), ['En', 'Ja', 'Ko', 'Fr']);
});

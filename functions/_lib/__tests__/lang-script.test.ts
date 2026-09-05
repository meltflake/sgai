// Pins the script guard used by /api/suggest before candidates reach the
// LLM judge. Regression case: a Chinese question typed on the EN page was
// served on the English rail (2026-08-19 → 2026-09-05).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { matchesLangScript } from '../lang-script';

test('en rejects any CJK script', () => {
  assert.equal(matchesLangScript('What is NAIS 2.0?', 'en'), true);
  assert.equal(matchesLangScript('新加坡与 AI 相关的部门有哪些', 'en'), false);
  assert.equal(matchesLangScript('SEA-LION とは何ですか？', 'en'), false);
  assert.equal(matchesLangScript('싱가포르 AI 전략은?', 'en'), false);
});

test('zh and zh-tw require Han and reject kana / hangul', () => {
  assert.equal(matchesLangScript('中小企业在新加坡能拿到哪些 AI 补贴？', 'zh'), true);
  assert.equal(matchesLangScript('和其他國家比，新加坡 AI 的獨特優勢在哪裡？', 'zh-tw'), true);
  assert.equal(matchesLangScript('what is the B2C AI market size in Singapore?', 'zh'), false);
  assert.equal(matchesLangScript('SEA-LION とは何ですか？', 'zh'), false);
  assert.equal(matchesLangScript('G8 CK6', 'zh-tw'), false);
});

test('ja requires kana; Han-only text is treated as Chinese', () => {
  assert.equal(matchesLangScript('SEA-LION とは何ですか？どのくらい使われていますか？', 'ja'), true);
  assert.equal(matchesLangScript('新加坡有哪些 AI 安全公司', 'ja'), false);
  assert.equal(matchesLangScript('What AI topics has Parliament debated recently?', 'ja'), false);
});

test('ko requires hangul', () => {
  assert.equal(matchesLangScript('싱가포르의 AI 인재 양성 프로그램은?', 'ko'), true);
  assert.equal(matchesLangScript('新加坡 AI 人才有哪些培养计划？', 'ko'), false);
  assert.equal(matchesLangScript('hello', 'ko'), false);
});

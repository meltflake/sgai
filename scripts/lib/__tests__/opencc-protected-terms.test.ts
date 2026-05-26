// Unit tests for the PROTECTED_TERMS pre/post placeholder pipeline
// inside src/i18n/opencc.ts. Covers the integration path (toTraditional
// + protected-terms together) — protects against accidental regressions
// where someone bypasses the placeholder swap or breaks longest-first
// ordering.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { toTraditional, _internals } from '../../../src/i18n/opencc';
import { PROTECTED_TERMS } from '../../../src/i18n/protected-terms';

test('toTraditional: MDDI full name keeps 信息 instead of 資訊', () => {
  assert.equal(toTraditional('数字发展与信息部'), '數字發展與信息部');
});

test('toTraditional: bare 信息部 (MDDI short form) is protected', () => {
  assert.equal(toTraditional('信息部'), '信息部');
});

test('toTraditional: IMDA full name keeps 信息通信 instead of 資訊通訊', () => {
  assert.equal(toTraditional('信息通信媒体发展局'), '信息通信媒體發展局');
});

test('toTraditional: legacy IDA name protected', () => {
  assert.equal(toTraditional('信息通信发展管理局'), '信息通信發展管理局');
});

test('toTraditional: MCCY keeps 社区 instead of 社群', () => {
  assert.equal(toTraditional('文化、社区及青年部'), '文化、社區及青年部');
});

test('toTraditional: generic 信息 still phrase-converts to 資訊', () => {
  // proves the protection is substring-specific, not blanket 信息 block
  assert.equal(toTraditional('信息时代'), '資訊時代');
});

test('toTraditional: generic 项目 still phrase-converts to 專案', () => {
  assert.equal(toTraditional('这个项目很重要'), '這個專案很重要');
});

test('toTraditional: mixed sentence with protected ministry + generic 信息', () => {
  assert.equal(
    toTraditional('Josephine Teo 在数字发展与信息部讨论信息的未来。'),
    'Josephine Teo 在數字發展與信息部討論資訊的未來。'
  );
});

test('toTraditional: same sentence with compound + abbreviation both protected', () => {
  assert.equal(
    toTraditional('新加坡的数字发展与信息部和信息部是同一个机构'),
    '新加坡的數字發展與信息部和信息部是同一個機構'
  );
});

test('toTraditional: empty / falsy input passes through', () => {
  assert.equal(toTraditional(''), '');
});

test('PROTECTED_TERMS sorted longest-first inside opencc.ts internals', () => {
  // Guards the longest-match-first invariant. If two terms could match
  // overlapping substrings, the compound must win.
  const sorted = _internals.SORTED_TERMS;
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(
      sorted[i - 1].zh.length >= sorted[i].zh.length,
      `SORTED_TERMS[${i - 1}].zh (${sorted[i - 1].zh.length} chars) must be ≥ SORTED_TERMS[${i}].zh (${sorted[i].zh.length} chars)`
    );
  }
});

test('preProtect: returns empty hits map when input has no protected terms', () => {
  const { masked, hits } = _internals.preProtect('一段没有特殊词的普通中文');
  assert.equal(masked, '一段没有特殊词的普通中文');
  assert.equal(hits.size, 0);
});

test('preProtect / postRestore round-trip preserves each protected term', () => {
  // For every term in the registry, asserting the round-trip works.
  // Future-proofs: adding a new PROTECTED_TERMS entry auto-extends this.
  for (const term of PROTECTED_TERMS) {
    const out = toTraditional(term.zh);
    assert.equal(out, term.zhTw, `round-trip failed for "${term.zh}"`);
  }
});

test('toTraditional: protected term inside a longer paragraph survives', () => {
  // Realistic case: a long sentence with multiple OpenCC-affected words,
  // protected ministry name in the middle.
  const input = '2026 年 5 月 20 日，数字发展与信息部长 Josephine Teo 公布了人工智能项目的相关数据。';
  const output = toTraditional(input);
  // The protected substring "数字发展与信息部" should appear verbatim
  assert.ok(output.includes('數字發展與信息部'), `expected ministry name preserved, got: ${output}`);
  // 人工智能 should become 人工智慧 (generic phrase, not protected)
  assert.ok(output.includes('人工智慧'), `expected 人工智能→人工智慧 conversion, got: ${output}`);
  // 项目 should become 專案
  assert.ok(output.includes('專案'), `expected 项目→專案 conversion, got: ${output}`);
  // 数据 should become 資料
  assert.ok(output.includes('資料'), `expected 数据→資料 conversion, got: ${output}`);
});

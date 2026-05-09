// scripts/lib/__tests__/i18n-purity.test.ts
//
// Regression coverage for the locale-value-purity check (Layer A.2 of
// scripts/evals/i18n-coverage/check.ts) and the post-edit TS parse
// sanity check (scripts/i18n/backfill-ja.ts:tsParseDiagnostics).
//
// These two checks were added after a debugging spree that caught:
//   - codemod-leaked zh in *Ja fields (口头答复, 信息发布, AI 经济与产业)
//   - backfill-ja inserts misplaced into wrong-scope objects, surfacing
//     5 minutes later as cryptic ts(2304) cascades in astro check
// The tests below pin the canonical bug shapes so a future refactor
// can't silently drop coverage.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  checkLocaleValuePurity,
  findImpureLocaleFields,
} from '../../evals/i18n-coverage/check.ts';
import { tsParseDiagnostics } from '../../i18n/backfill-ja.ts';

// ── checkLocaleValuePurity ─────────────────────────────────────────────

test('checkLocaleValuePurity: en value with kanji is rejected', () => {
  const r = checkLocaleValuePurity('AI 战略', 'en');
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /CJK/);
});

test('checkLocaleValuePurity: en value with hiragana is rejected', () => {
  const r = checkLocaleValuePurity('シンガポール AI', 'en');
  assert.equal(r.ok, false);
});

test('checkLocaleValuePurity: en value with pure ASCII passes', () => {
  const r = checkLocaleValuePurity('National AI Strategy 2.0', 'en');
  assert.equal(r.ok, true);
});

test('checkLocaleValuePurity: en value with brand acronym + numbers passes', () => {
  const r = checkLocaleValuePurity('IMDA · AI Verify · MDDI', 'en');
  assert.equal(r.ok, true);
});

test('checkLocaleValuePurity: ja value with simplified-only char is rejected (口头答复 case)', () => {
  // The exact codemod-leaked-zh shape from DebatesIndex typeMap before
  // it was hand-fixed: '口头答复' uses 头 (zh) and 复 (zh-only-glyph
  // here, but 头 is the tell — JA uses 頭).
  const r = checkLocaleValuePurity('口头答复', 'ja');
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /simplified-Chinese/);
});

test('checkLocaleValuePurity: ja value with mixed zh tell mid-string is rejected (質询 case)', () => {
  // Real bug from debates.ts:165 — Japanese surrounding text but a
  // single zh-style 询 slipped in.
  const r = checkLocaleValuePurity(
    '労働党非選挙区議員の Low Wu Yang Andre は重要な質询を提出しました',
    'ja'
  );
  assert.equal(r.ok, false);
});

test('checkLocaleValuePurity: ja kanji-only label passes (出典 / 投入強度 / 第二期)', () => {
  // These are legitimate JA labels that the previous "must have kana
  // adjacent" heuristic in i18n-check.mjs was misflagging. Layer A.2
  // must NOT regress to that behaviour.
  for (const v of ['出典', '投入強度', '第二期', '議会討論', '計算能力基盤']) {
    const r = checkLocaleValuePurity(v, 'ja');
    assert.equal(r.ok, true, `expected ${v} to pass purity check`);
  }
});

test('checkLocaleValuePurity: ja value with kana + kanji passes', () => {
  const r = checkLocaleValuePurity(
    'シンガポールの AI 戦略はアルゴリズムにあるのではありません',
    'ja'
  );
  assert.equal(r.ok, true);
});

test('checkLocaleValuePurity: ja value verbatim copy of zh source (descriptionJa case) is rejected', () => {
  // The benchmarking.ts:2026 bug — translator returned the zh source
  // unchanged. Multiple simplified-only tells hit the regex.
  const r = checkLocaleValuePurity('全球首批国家 AI 战略之一，目标让 AI 贡献 GDP 的 33.5%', 'ja');
  assert.equal(r.ok, false);
});

// ── findImpureLocaleFields ─────────────────────────────────────────────

function withTempFile<T>(name: string, content: string, fn: (path: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-purity-test-'));
  const path = join(dir, name);
  writeFileSync(path, content);
  try {
    return fn(path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('findImpureLocaleFields: catches zh in *Ja sibling, ignores zh in bare key', () => {
  const src = `
    export const x = [
      { title: '关键信息', titleEn: 'Critical Information', titleJa: '重要情報' },
      { title: '关键信息', titleEn: 'Critical Information', titleJa: '关键信息' },
    ];
  `;
  const issues = withTempFile('test.ts', src, (p) => findImpureLocaleFields(p));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].field, 'titleJa');
  assert.equal(issues[0].locale, 'ja');
  assert.match(issues[0].preview, /关键信息/);
});

test('findImpureLocaleFields: catches kanji in *En sibling', () => {
  const src = `
    export const x = [
      { name: 'IMDA', nameEn: 'IMDA' },
      { name: 'IMDA', nameEn: '资讯通信媒体发展局' },
    ];
  `;
  const issues = withTempFile('test.ts', src, (p) => findImpureLocaleFields(p));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].field, 'nameEn');
  assert.equal(issues[0].locale, 'en');
});

test('findImpureLocaleFields: skips empty-string siblings (those are unpaired, not impure)', () => {
  const src = `
    export const x = [
      { title: '中文', titleEn: '', titleJa: '' },
    ];
  `;
  const issues = withTempFile('test.ts', src, (p) => findImpureLocaleFields(p));
  assert.equal(issues.length, 0);
});

test('findImpureLocaleFields: skips non-string initializers (arrays, expressions)', () => {
  // Arrays and identifier references can't be directly purity-checked
  // without evaluating expressions; the check should not throw.
  const src = `
    export const x = [
      { tagsEn: ['foo', 'bar'], titleEn: 'OK' },
    ];
  `;
  const issues = withTempFile('test.ts', src, (p) => findImpureLocaleFields(p));
  assert.equal(issues.length, 0);
});

test('findImpureLocaleFields: handles backtick template literals', () => {
  const src =
    'export const x = [\n' +
    "  { summary: '中文', summaryJa: `これは日本語です。シンガポール AI 観測` },\n" +
    "  { summary: '中文', summaryJa: `内容里夹着 经过 这个简体中文词` },\n" +
    '];\n';
  const issues = withTempFile('test.ts', src, (p) => findImpureLocaleFields(p));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].line, 3);
});

// ── tsParseDiagnostics ─────────────────────────────────────────────────

test('tsParseDiagnostics: clean source returns empty array', () => {
  const src = `
    export const x = [
      { id: 'a', title: 'Hello' },
    ];
  `;
  assert.deepEqual(tsParseDiagnostics('test.ts', src), []);
});

test('tsParseDiagnostics: unterminated single-quoted string is reported (multi-line in single quote case)', () => {
  // The exact backfill regression where a multi-line zh value got
  // wrapped in single quotes and the runtime newline broke the literal.
  const src = `
    export const x = [
      { titleJa: 'こんにちは
      に向けた', other: 'foo' },
    ];
  `;
  const diags = tsParseDiagnostics('test.ts', src);
  assert.notEqual(diags.length, 0);
});

test('tsParseDiagnostics: misplaced sibling outside object scope is reported', () => {
  // Mirrors the earlier "labelJa inserted as a top-level array element"
  // regression. Should produce at least one diagnostic.
  const src = `
    export const x = [
      { label: 'foo', labelEn: 'bar' },
      labelJa: 'モデル数',
    ];
  `;
  const diags = tsParseDiagnostics('test.ts', src);
  assert.notEqual(diags.length, 0);
});

test('tsParseDiagnostics: returns line numbers in human-readable form', () => {
  const src = `const x = 'unterminated`;
  const diags = tsParseDiagnostics('test.ts', src);
  assert.notEqual(diags.length, 0);
  assert.match(diags[0], /^L\d+:\d+: /);
});

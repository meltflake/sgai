// scripts/evals/source-i18n-hardcode/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for Layer E's scanFile() anti-pattern detector.
//
// These lock the two 2026-07 widenings that closed the eval blind spots the
// governance pass surfaced (methodology/evolution letting zh-tw fall to EN
// while every eval missed it):
//   1. binary-lang-alias now matches ANY identifier assigned `lang !== 'zh'`
//      (not just isEn/isZh) — `const isNonZh = lang !== 'zh'` must be caught,
//      while the equal-value form `const isZh = lang === 'zh'` must NOT.
//   2. copy-missing-locale replaces the old copy-no-ja: `COPY[lang] ?? COPY.en`
//      is only safe when the COPY literal has both `ja:` and `ko:` keys AND the
//      file handles zh-tw (a `'zh-tw'` branch or toTraditional/deepToTraditional).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { scanFile, type Finding } from '../check.ts';

/** Write `src` to a throwaway file, scan it, clean up, return findings. */
function scan(src: string, ext = '.astro'): Finding[] {
  const dir = mkdtempSync(join(tmpdir(), 'layer-e-'));
  const file = join(dir, `fixture${ext}`);
  try {
    writeFileSync(file, src);
    return scanFile(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function rules(findings: Finding[]): string[] {
  return findings.map((f) => f.rule);
}

// ── binary-lang-alias: arbitrary alias name ──────────────────────────────

test('binary-lang-alias: catches `const isNonZh = lang !== "zh"` (arbitrary alias)', () => {
  const findings = scan(`const isNonZh = lang !== 'zh';`);
  assert.ok(rules(findings).includes('binary-lang-alias'), 'isNonZh alias must be flagged');
});

test('binary-lang-alias: catches non-is-prefixed alias name', () => {
  const findings = scan(`const showEnglish = lang !== 'zh';`);
  assert.ok(rules(findings).includes('binary-lang-alias'), 'any identifier = lang !== zh must be flagged');
});

test('binary-lang-alias: still catches the historical `const isEn = lang !== "zh"`', () => {
  const findings = scan(`const isEn = lang !== 'zh';`);
  assert.ok(rules(findings).includes('binary-lang-alias'));
});

test('binary-lang-alias: does NOT flag the equal-value form `const isZh = lang === "zh"`', () => {
  const findings = scan(`const isZh = lang === 'zh';`);
  assert.ok(!rules(findings).includes('binary-lang-alias'), 'lang === zh is a legit single-locale gate');
});

test('binary-lang-alias: does NOT flag `const isEn = lang === "en"` (equal-value single-locale gate)', () => {
  const findings = scan(`const isEn = lang === 'en';`);
  assert.deepEqual(findings, [], 'equal-value alias is legitimate and must be clean');
});

// ── copy-missing-locale ──────────────────────────────────────────────────

const COPY_FALLBACK_LINE = `const c = COPY[lang] ?? COPY.en;`;

test('copy-missing-locale: flags COPY with zh/en/ja only + no zh-tw handling', () => {
  const src = [
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `  ja: { title: 'タイトル' },`,
    `};`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(rules(findings).includes('copy-missing-locale'), 'missing ko key + no zh-tw handling must be flagged');
});

test('copy-missing-locale: flags COPY missing ko even when zh-tw is handled', () => {
  const src = [
    `import { deepToTraditional } from '~/i18n/opencc';`,
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `  ja: { title: 'タイトル' },`,
    `};`,
    `const derived = deepToTraditional(COPY.zh);`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(rules(findings).includes('copy-missing-locale'), 'missing ko key alone must be flagged');
});

test('copy-missing-locale: flags COPY with all keys but NO zh-tw handling', () => {
  const src = [
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `  ja: { title: 'タイトル' },`,
    `  ko: { title: '제목' },`,
    `};`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(rules(findings).includes('copy-missing-locale'), 'no zh-tw derivation must be flagged');
});

test('copy-missing-locale: does NOT flag COPY with zh/en/ja/ko + deepToTraditional', () => {
  const src = [
    `import { deepToTraditional } from '~/i18n/opencc';`,
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `  ja: { title: 'タイトル' },`,
    `  ko: { title: '제목' },`,
    `};`,
    `const derived = deepToTraditional(COPY.zh);`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(!rules(findings).includes('copy-missing-locale'), 'complete COPY + zh-tw derivation is legitimate');
});

test('copy-missing-locale: does NOT flag COPY with all keys + explicit zh-tw branch', () => {
  const src = [
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `  ja: { title: 'タイトル' },`,
    `  ko: { title: '제목' },`,
    `};`,
    `if (lang === 'zh-tw') { /* handled */ }`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(!rules(findings).includes('copy-missing-locale'));
});

test('copy-missing-locale: respects // i18n-allow-hardcode on the fallback line', () => {
  const src = [
    `const COPY = {`,
    `  zh: { title: '标题' },`,
    `  en: { title: 'Title' },`,
    `};`,
    `// i18n-allow-hardcode: dev-only diagnostic copy`,
    COPY_FALLBACK_LINE,
  ].join('\n');
  const findings = scan(src);
  assert.ok(!rules(findings).includes('copy-missing-locale'), 'ignore marker must suppress the finding');
});

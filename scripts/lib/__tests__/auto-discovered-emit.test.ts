// Regression tests for appendAutoDiscovered's export detection.
// The 2026-07-28 live probe (PR #170) hit ts(2451): a data file whose
// autoDiscovered array was EMPTY held it as the prettier one-liner
// `= [];`, which the multi-line detection regex (`\n];` anchor) missed —
// the helper then appended a DUPLICATE interface + export and broke the
// build. Empty arrays are the normal steady state for these files
// (benchmarking.ts has one since its archive entries were promoted out).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { appendAutoDiscovered, type AutoDiscoveredEntry } from '../auto-discovered-emit.ts';

const ENTRY: AutoDiscoveredEntry = {
  title: '测试条目',
  titleEn: 'Test entry',
  titleJa: 'テスト項目',
  titleKo: '테스트 항목',
  description: '一条测试描述。',
  descriptionEn: 'A test description.',
  descriptionJa: 'テスト説明。',
  descriptionKo: '테스트 설명입니다.',
  category: '测试',
  confidence: 'high',
  sourceUrl: 'https://example.gov.sg/test',
  discoveredAt: '2026-07-28',
};

const INTERFACE = `export interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  description: string;
  descriptionEn: string;
  descriptionJa?: string;
  descriptionKo?: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}`;

function tmpFile(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'auto-discovered-'));
  const file = join(dir, 'data.ts');
  writeFileSync(file, content);
  return file;
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

test('empty one-liner `= [];` is populated in place — never redeclared (PR #170 regression)', () => {
  const file = tmpFile(`${INTERFACE}\n\nexport const autoDiscovered: AutoDiscoveredEntry[] = [];\n`);
  const result = appendAutoDiscovered(file, [ENTRY]);
  const out = readFileSync(file, 'utf8');
  assert.equal(result.added, 1);
  assert.equal(result.created, false);
  assert.equal(count(out, 'export const autoDiscovered'), 1);
  assert.equal(count(out, 'export interface AutoDiscoveredEntry'), 1);
  assert.match(out, /Test entry/);
});

test('populated multi-line array gets the entry appended, no duplicate export', () => {
  const existing = `${INTERFACE}\n\nexport const autoDiscovered: AutoDiscoveredEntry[] = [
  {
    title: '既有',
    titleEn: 'Existing',
    description: 'x',
    descriptionEn: 'x',
    category: 'c',
    confidence: 'high',
    sourceUrl: 'https://example.gov.sg/a',
    discoveredAt: '2026-07-01',
  },
];\n`;
  const file = tmpFile(existing);
  const result = appendAutoDiscovered(file, [ENTRY]);
  const out = readFileSync(file, 'utf8');
  assert.equal(result.added, 1);
  assert.equal(count(out, 'export const autoDiscovered'), 1);
  assert.match(out, /Existing/);
  assert.match(out, /Test entry/);
});

test('file with no export at all gets interface + export created once', () => {
  const file = tmpFile(`export const other = 1;\n`);
  const result = appendAutoDiscovered(file, [ENTRY]);
  const out = readFileSync(file, 'utf8');
  assert.equal(result.created, true);
  assert.equal(count(out, 'export const autoDiscovered'), 1);
  assert.equal(count(out, 'export interface AutoDiscoveredEntry'), 1);
});

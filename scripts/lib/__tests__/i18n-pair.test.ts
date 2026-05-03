// scripts/lib/__tests__/i18n-pair.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { findUnpairedFields } from '../i18n-pair.ts';

function withFile<T>(content: string, fn: (path: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-i18n-test-'));
  const path = join(dir, 'sample.ts');
  writeFileSync(path, content);
  try {
    return fn(path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('findUnpairedFields: detects missing *En sibling', () => {
  const src = `
export const policies = [
  {
    title: '智能国家 2.0',
    description: '描述文字',
    descriptionEn: 'Description',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'title');
    assert.equal(issues[0].reason, 'missing-sibling');
    assert.equal(issues[0].chineseValue, '智能国家 2.0');
  });
});

test('findUnpairedFields: detects empty-string *En sibling', () => {
  const src = `
export const x = [
  {
    title: '中文标题',
    titleEn: '',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].reason, 'empty-sibling');
  });
});

test('findUnpairedFields: passes when both fields present', () => {
  const src = `
export const x = [
  {
    title: '中文标题',
    titleEn: 'English Title',
    description: '描述',
    descriptionEn: 'Description',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p), []);
  });
});

test('findUnpairedFields: skips ASCII-only values', () => {
  const src = `
export const x = [
  {
    title: 'Pure ASCII Title',
    description: 'Pure description',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p), []);
  });
});

test('findUnpairedFields: respects ignore annotation comment on previous line', () => {
  const src = `
export const x = [
  {
    // i18n-allow-unpaired
    title: '允许的中文',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p), []);
  });
});

test('findUnpairedFields: only checks configured field names', () => {
  const src = `
export const x = [
  {
    note: '不在默认列表里? 是默认的',
    customField: '不会被检查',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { fields: ['title'] });
    assert.deepEqual(issues, []);
  });
});

test('findUnpairedFields: accepts multi-line *En string literal (Prettier wrap)', () => {
  // Real sgai data: long English strings get Prettier-wrapped onto next line.
  const src = `
export const x = [
  {
    description: '中文描述',
    descriptionEn:
      'Very long English description that Prettier wrapped onto the next line because it exceeds the print width.',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p), []);
  });
});

test('findUnpairedFields: accepts array-valued *En sibling', () => {
  const src = `
export const x = [
  {
    label: '中文标签',
    labelEn: ['Tag', 'Label'],
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p), []);
  });
});

test('findUnpairedFields: handles multiple records (one-field-per-line layout)', () => {
  // Real sgai data files always use one-field-per-line; the parser is
  // intentionally line-based and does not handle inline single-line records.
  const src = `
export const x = [
  {
    title: '一',
    titleEn: 'One',
  },
  {
    title: '二',
  },
  {
    title: '三',
    titleEn: 'Three',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].chineseValue, '二');
  });
});

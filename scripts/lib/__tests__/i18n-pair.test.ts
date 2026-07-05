// scripts/lib/__tests__/i18n-pair.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { findUnpairedFields, findIncompleteRecords, listDataDirFiles } from '../i18n-pair.ts';
import type { FileSchema } from '../../i18n-config.ts';

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
    const issues = findUnpairedFields(p, { locales: ['en'] });
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
    const issues = findUnpairedFields(p, { locales: ['en'] });
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
    assert.deepEqual(findUnpairedFields(p, { locales: ['en'] }), []);
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
    assert.deepEqual(findUnpairedFields(p, { locales: ['en'] }), []);
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
    assert.deepEqual(findUnpairedFields(p, { locales: ['en'] }), []);
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
    const issues = findUnpairedFields(p, { locales: ['en'] });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].chineseValue, '二');
  });
});

test('findUnpairedFields: AST handles single-line records (regression vs v1)', () => {
  // v1 was line-based and silently missed inline records; v2 walks AST.
  const src = `export const x = [{ title: '一', titleEn: 'One' }, { title: '二' }];\n`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { locales: ['en'] });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].chineseValue, '二');
  });
});

test('findUnpairedFields: AST handles template literals without substitutions', () => {
  // Backtick strings are common in long descriptions; v1 regex missed them.
  const src = `
export const x = [
  {
    summary: \`这是一段长中文摘要\`,
    summaryEn: \`English summary\`,
  },
  {
    summary: \`未配对中文\`,
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { locales: ['en'] });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].chineseValue, '未配对中文');
  });
});

test('findUnpairedFields: detects missing array sibling for Ko/Ja', () => {
  const src = `
export const x = [
  {
    keyPoints: ['AI 工程师需求结构性上升', '金融资讯通讯 PME 空缺'],
    keyPointsEn: ['AI engineer demand rising', 'Finance PME vacancies'],
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { fields: ['keyPoints'], locales: ['en', 'ja', 'ko'] });
    assert.equal(issues.length, 2);
    assert.equal(issues[0].locale, 'ja');
    assert.equal(issues[0].reason, 'missing-sibling');
    assert.equal(issues[1].locale, 'ko');
  });
});

test('findUnpairedFields: passes when array has all locale siblings', () => {
  const src = `
export const x = [
  {
    keyPoints: ['AI 需求上升'],
    keyPointsEn: ['AI demand rising'],
    keyPointsJa: ['AI需要上昇'],
    keyPointsKo: ['AI 수요 상승'],
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { fields: ['keyPoints'], locales: ['en', 'ja', 'ko'] });
    assert.equal(issues.length, 0);
  });
});

test('findUnpairedFields: default locales check en + ja + ko', () => {
  const src = `
export const x = [
  {
    title: '中文标题',
    titleEn: 'English',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p);
    assert.equal(issues.length, 2);
    const locales = issues.map((i) => i.locale).sort();
    assert.deepEqual(locales, ['ja', 'ko']);
  });
});

// ── en-only-base (opt-in) ───────────────────────────────────────────────
//
// Detects a base field (title/summary/description/headline/tagline) that
// carries an English multi-word value with NO CJK — i.e. the zh source side
// was never authored, only the English got filled. Distinct from the
// alignment check (which fires on a CJK base missing a sibling); this fires
// on an English base with a missing zh source.

test('en-only-base: flags English multi-word title with no CJK', () => {
  const src = `
export const x = [
  {
    title: 'National AI Strategy Review',
    description: 'A detailed English description with several words here.',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    const fields = issues.map((i) => i.field).sort();
    assert.deepEqual(fields, ['description', 'title']);
    assert.ok(issues.every((i) => i.reason === 'en-only-base'));
  });
});

test('en-only-base: does NOT flag single-token brand names', () => {
  const src = `
export const x = [
  {
    title: 'SEA-LION',
    summary: 'AIAP',
    tagline: 'Anthropic',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    assert.deepEqual(issues, []);
  });
});

test('en-only-base: does NOT flag values containing CJK (that is the alignment check)', () => {
  const src = `
export const x = [
  {
    title: '智能国家 Strategy Review',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    // A CJK-bearing base is the alignment check's job (missing-sibling), NOT
    // en-only-base. en-only-base must contribute nothing here.
    assert.equal(
      issues.filter((i) => i.reason === 'en-only-base').length,
      0
    );
  });
});

test('en-only-base: respects i18n-allow-unpaired annotation', () => {
  const src = `
export const x = [
  {
    // i18n-allow-unpaired
    title: 'English Only Allowed Title',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    assert.deepEqual(issues, []);
  });
});

test('en-only-base: respects per-field i18n-allow-unpaired annotation', () => {
  const src = `
export const x = [
  {
    // i18n-allow-unpaired
    title: 'English Only Allowed Title',
    description: 'Another English description without a Chinese source.',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    // title is exempt, description is not.
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'description');
    assert.equal(issues[0].reason, 'en-only-base');
  });
});

test('en-only-base: only checks title/summary/description/headline/tagline base fields', () => {
  const src = `
export const x = [
  {
    role: 'Chief Executive Officer',
    org: 'Some English Organisation Name',
    title: 'Board Member Appointment',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    // role / org are not en-only-base fields; only title fires.
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'title');
  });
});

test('en-only-base: flags array base fields with English multi-word elements', () => {
  const src = `
export const x = [
  {
    summary: ['First English point here', 'Second English point too'],
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'summary');
    assert.equal(issues[0].reason, 'en-only-base');
  });
});

test('en-only-base: number + word counts as multi-token (calibration boundary)', () => {
  // Real people.ts value: `100 Experiments（100E）`. Two whitespace tokens,
  // one is a real word → flag. Guards the token-count heuristic against a
  // regression to per-token letter-run counting (which would skip `100`).
  const src = `
export const x = [
  {
    title: '100 Experiments（100E）',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'title');
    assert.equal(issues[0].reason, 'en-only-base');
  });
});

test('en-only-base: hyphenated single brand token is exempt (calibration boundary)', () => {
  // `SEA-LION` is one whitespace token → must NOT flag (guards against
  // reverting to `/[A-Za-z]{2,}/g` match-counting, which sees SEA + LION).
  const src = `
export const x = [
  {
    title: 'SEA-LION',
    summary: 'GPT-4',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findUnpairedFields(p, { enOnlyBase: true, locales: ['en', 'ja'] }), []);
  });
});

test('en-only-base: default (opt-out) does not change alignment behaviour', () => {
  const src = `
export const x = [
  {
    title: 'English Only Title Value',
  },
];
`;
  withFile(src, (p) => {
    // Without enOnlyBase, a pure-English base is fine (no CJK to pair).
    assert.deepEqual(findUnpairedFields(p, { locales: ['en', 'ja'] }), []);
  });
});

// ── findIncompleteRecords ───────────────────────────────────────────────

const ECOSYSTEM_TEST_SCHEMA: FileSchema = {
  file: 'sample.ts',
  schemas: [
    {
      name: 'category',
      containingArray: 'cats',
      fields: [
        { field: 'name', locales: ['En'], required: true },
        { field: 'description', locales: ['En'], required: true },
      ],
    },
    {
      name: 'entity',
      containingArray: 'entities',
      fields: [
        { field: 'name', locales: ['En'], required: true },
        { field: 'description', locales: ['En'], required: true },
        { field: 'whatItIs', locales: ['En'], required: true },
      ],
    },
  ],
};

test('findIncompleteRecords: flags entity missing required deep field', () => {
  const src = `
export const cats = [
  {
    id: 'cat1',
    name: '类别一',
    nameEn: 'Category 1',
    description: '描述',
    descriptionEn: 'Desc',
    entities: [
      {
        id: 'ent1',
        name: '实体名',
        nameEn: 'Entity Name',
        description: '简介',
        descriptionEn: 'Brief',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].schema, 'entity');
    assert.equal(issues[0].recordIdentifier, 'ent1');
    // Both source-side and EN sibling are missing → both reported
    assert.deepEqual(issues[0].missingFields, ['whatItIs', 'whatItIsEn']);
  });
});

test('findIncompleteRecords: passes when all required fields complete', () => {
  const src = `
export const cats = [
  {
    id: 'cat1',
    name: '类别一',
    nameEn: 'Category 1',
    description: '描述',
    descriptionEn: 'Description',
    entities: [
      {
        id: 'ent1',
        name: '实体',
        nameEn: 'Entity',
        description: '简介',
        descriptionEn: 'Brief',
        whatItIs: '中文说明',
        whatItIsEn: 'English explanation',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA }), []);
  });
});

test('findIncompleteRecords: discriminates by containingArray name', () => {
  // Records inside `entities` get entity schema (3 required fields);
  // records in `cats` get category schema (2 required fields).
  const src = `
export const cats = [
  {
    name: '类别',
    nameEn: 'Cat',
    description: '描述',
    descriptionEn: 'Desc',
    entities: [
      {
        name: '实体',
        nameEn: 'Ent',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA });
    // category passes (name+description filled), entity fails (description, whatItIs missing)
    assert.equal(issues.length, 1);
    assert.equal(issues[0].schema, 'entity');
    // Source AND every locale sibling are checked independently. zh side missing
    // for description + whatItIs → 4 reports total (description, descriptionEn,
    // whatItIs, whatItIsEn). Both halves listed lets the human know exactly
    // what to fill in without re-scanning the record.
    assert.deepEqual(issues[0].missingFields, ['description', 'descriptionEn', 'whatItIs', 'whatItIsEn']);
  });
});

test('findIncompleteRecords: treats placeholder strings as empty', () => {
  const src = `
export const cats = [
  {
    name: '类别',
    nameEn: 'Cat',
    description: '描述',
    descriptionEn: 'Desc',
    entities: [
      {
        name: '实体',
        nameEn: 'Ent',
        description: '描述',
        descriptionEn: 'Desc',
        whatItIs: '[需补充] 待定',
        whatItIsEn: 'TBD',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA });
    assert.equal(issues.length, 1);
    // [需补充] is a placeholder → whatItIs flagged
    // 'TBD' is a placeholder → whatItIsEn flagged
    assert.deepEqual(issues[0].missingFields, ['whatItIs', 'whatItIsEn']);
  });
});

test('findIncompleteRecords: respects i18n-allow-unpaired on record', () => {
  const src = `
export const cats = [
  {
    name: '类别',
    nameEn: 'Cat',
    description: '描述',
    descriptionEn: 'Desc',
    entities: [
      // i18n-allow-unpaired
      {
        name: '实体',
        nameEn: 'Ent',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA }), []);
  });
});

test('findIncompleteRecords: returns empty when no schema configured', () => {
  const src = `export const x = [{ name: 'foo' }];\n`;
  withFile(src, (p) => {
    // No options.schema, no I18N_CONFIG entry that endsWith path → empty
    assert.deepEqual(findIncompleteRecords(p), []);
  });
});

test('findIncompleteRecords: flags missing locale sibling when source is filled', () => {
  // Whole point of the lock: zh side filled + En sibling missing = fail.
  const src = `
export const cats = [
  {
    name: '类别',
    nameEn: 'Cat',
    description: '描述',
    descriptionEn: 'Desc',
    entities: [
      {
        name: '实体',
        nameEn: 'Ent',
        description: '简介',
        descriptionEn: 'Brief',
        whatItIs: '中文说明已填',
      },
    ],
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema: ECOSYSTEM_TEST_SCHEMA });
    assert.equal(issues.length, 1);
    // zh side filled, En sibling missing → only whatItIsEn flagged
    assert.deepEqual(issues[0].missingFields, ['whatItIsEn']);
  });
});

// ── listDataDirFiles (Finding B: dynamic data-dir coverage) ─────────────
//
// The completeness gate used to hard-code a 13-file list; a NEW src/data/*.ts
// escaped it. listDataDirFiles backs the `--data-dir` flag that replaced the
// list. These tests lock in that (1) it discovers every *.ts, (2) it sorts,
// (3) it skips non-.ts, and (4) the REAL src/data dir has no file the
// completeness command would now miss.

function withDir<T>(files: Record<string, string>, fn: (dir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-datadir-test-'));
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
  }
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('listDataDirFiles: returns every .ts file, sorted, absolute', () => {
  withDir({ 'b.ts': '', 'a.ts': '', 'c.ts': '' }, (dir) => {
    const found = listDataDirFiles(dir);
    assert.deepEqual(
      found.map((p) => p.slice(dir.length + 1)),
      ['a.ts', 'b.ts', 'c.ts']
    );
    assert.ok(found.every((p) => p === resolve(p)), 'paths must be absolute');
  });
});

test('listDataDirFiles: skips non-.ts files (json, md, d.ts is still .ts)', () => {
  withDir({ 'x.ts': '', 'y.json': '', 'z.md': '', 'w.d.ts': '' }, (dir) => {
    const names = listDataDirFiles(dir).map((p) => p.slice(dir.length + 1));
    // .d.ts ends with .ts so it is included; json/md are excluded.
    assert.deepEqual(names, ['w.d.ts', 'x.ts']);
  });
});

test('listDataDirFiles: throws on a missing directory', () => {
  assert.throws(() => listDataDirFiles('/no/such/dir/anywhere'), /--data-dir not found/);
});

test('listDataDirFiles: covers every real src/data/*.ts (regression safeguard)', () => {
  // The point of Finding B: no data file may silently escape the completeness
  // gate. If a real src/data file is added it MUST show up here — this test
  // fails loudly if listDataDirFiles ever stops discovering the whole dir.
  const dataDir = resolve(import.meta.dirname, '../../../src/data');
  const found = listDataDirFiles(dataDir);
  assert.ok(found.length >= 25, `expected the full data dir, got ${found.length} files`);
  assert.ok(
    found.some((p) => p.endsWith('/ecosystem.ts')),
    'ecosystem.ts must be discovered'
  );
});

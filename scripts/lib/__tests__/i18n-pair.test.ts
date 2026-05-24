// scripts/lib/__tests__/i18n-pair.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { findUnpairedFields, findIncompleteRecords, findImpureLocaleFields } from '../i18n-pair.ts';
import { dataSiblingLocales } from '../i18n-locales.mjs';
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
    assert.deepEqual(findUnpairedFields(p, { locales: ['en'] }), []);
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
    assert.deepEqual(findUnpairedFields(p, { locales: ['en'] }), []);
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

test('findUnpairedFields: detects missing siblings for string arrays', () => {
  const src = `
export const x = [
  {
    highlights: ['中文要点', '第二个要点'],
    highlightsEn: ['Chinese point', 'Second point'],
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { fields: ['highlights'], locales: ['en', 'ja', 'ko'] });
    assert.equal(issues.length, 2);
    assert.deepEqual(
      issues.map((issue) => issue.locale),
      ['ja', 'ko']
    );
  });
});

test('findUnpairedFields: defaults to all authored sibling locales from project config', () => {
  const expectedLocales = dataSiblingLocales();
  const src = `
export const x = [
  {
    title: '中文标题',
  },
];
`;
  withFile(src, (p) => {
    const issues = findUnpairedFields(p, { fields: ['title'] });
    assert.deepEqual(
      issues.map((issue) => issue.locale),
      expectedLocales
    );
  });
});

// ── findImpureLocaleFields ──────────────────────────────────────────────

test('findImpureLocaleFields: rejects non-English script in *En fields', () => {
  const src = `
export const x = [
  {
    title: '中文标题',
    titleEn: 'English title',
    summaryEn: '残留中文',
    noteEn: 'Japanese residue シンガポール',
    labelEn: 'Korean residue 한국어',
  },
];
`;
  withFile(src, (p) => {
    const issues = findImpureLocaleFields(p);
    assert.deepEqual(
      issues.map((issue) => issue.field),
      ['summaryEn', 'noteEn', 'labelEn']
    );
  });
});

test('findImpureLocaleFields: rejects non-English script inside *En string arrays', () => {
  const src = `
export const x = [
  {
    tagsEn: ['AI policy', '治理 residue'],
  },
];
`;
  withFile(src, (p) => {
    const issues = findImpureLocaleFields(p);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].field, 'tagsEn');
  });
});

test('findImpureLocaleFields: respects i18n-allow-unpaired annotation', () => {
  const src = `
export const x = [
  {
    // i18n-allow-unpaired
    titleEn: 'Allowed quote 日本語',
  },
];
`;
  withFile(src, (p) => {
    assert.deepEqual(findImpureLocaleFields(p), []);
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

test('findIncompleteRecords: optional fields are gated once present', () => {
  const schema: FileSchema = {
    file: 'sample.ts',
    schemas: [
      {
        name: 'item',
        containingArray: 'items',
        fields: [
          { field: 'title', locales: ['En'], required: true },
          { field: 'note', locales: ['En'] },
        ],
      },
    ],
  };
  const src = `
export const items = [
  {
    title: '标题',
    titleEn: 'Title',
  },
  {
    title: '另一个标题',
    titleEn: 'Another title',
    note: '可选字段一旦出现，也要翻译',
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema });
    assert.equal(issues.length, 1);
    assert.deepEqual(issues[0].missingFields, ['noteEn']);
  });
});

test('findIncompleteRecords: treats empty string arrays as incomplete', () => {
  const schema: FileSchema = {
    file: 'sample.ts',
    schemas: [
      {
        name: 'item',
        containingArray: 'items',
        fields: [{ field: 'bullets', locales: ['En'], required: true }],
      },
    ],
  };
  const src = `
export const items = [
  {
    bullets: ['有效项目'],
    bulletsEn: [],
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema });
    assert.equal(issues.length, 1);
    assert.deepEqual(issues[0].missingFields, ['bulletsEn']);
  });
});

test('findIncompleteRecords: optional fields are gated when any locale sibling is present', () => {
  const schema: FileSchema = {
    file: 'sample.ts',
    schemas: [
      {
        name: 'item',
        containingArray: 'items',
        fields: [
          { field: 'title', locales: ['En'], required: true },
          { field: 'note', locales: ['En', 'Ja'] },
        ],
      },
    ],
  };
  const src = `
export const items = [
  {
    title: '标题',
    titleEn: 'Title',
    noteEn: 'English-only optional note',
  },
];
`;
  withFile(src, (p) => {
    const issues = findIncompleteRecords(p, { schema });
    assert.equal(issues.length, 1);
    assert.deepEqual(issues[0].missingFields, ['note', 'noteJa']);
  });
});

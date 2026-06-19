// scripts/refresh/policies/__tests__/emit-i18n-completeness.test.ts
// ────────────────────────────────────────────────────────────────────────
// The emit formatters must produce records that satisfy the i18n gate run by
// `i18n-pair --mode=both --locales=en,ja,ko` (CLAUDE.md rule #5):
//
//   - policies: `source` is a required, CJK-bearing field → it needs
//     sourceEn / sourceJa / sourceKo siblings (the org name per source).
//   - ecosystem: auto-discovered entities are `_pendingReview` stubs whose
//     required analytical fields (whatItIs / aiRelevance / singaporeRelevance)
//     and `sources[].label` siblings are filled by a human on promotion, so
//     the emit marks them `// i18n-allow-unpaired` (the sanctioned escape
//     hatch) — covering the entity AND its nested source object.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { formatPolicyRecord } from '../emit.ts';
import type { EnrichedPolicy } from '../enrich.ts';
import { formatEntity } from '../../ecosystem/emit.ts';
import type { EnrichedEntity } from '../../ecosystem/enrich.ts';
import { findUnpairedFields, findIncompleteRecords } from '../../../lib/i18n-pair.ts';
import { I18N_CONFIG } from '../../../i18n-config.ts';

function withTmpFile(content: string, fn: (path: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-emit-i18n-'));
  try {
    const path = join(dir, 'fixture.ts');
    writeFileSync(path, content);
    fn(path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const policy: EnrichedPolicy = {
  candidate: {
    sourceUrl: 'https://www.mof.gov.sg/news/ai-budget-2026/',
    domain: 'mof.gov.sg',
    label: 'Ministry of Finance',
    defaultCategory: '预算与资金',
    defaultSource: '财政部 (MOF)',
    defaultSourceEn: 'Ministry of Finance (MOF)',
    defaultSourceJa: '財務省 (MOF)',
    defaultSourceKo: '재정부 (MOF)',
    defaultSourceOrgUrl: 'https://www.mof.gov.sg/',
    defaultMinistry: 'MOF',
  },
  summary: {
    sourceUrl: 'https://www.mof.gov.sg/news/ai-budget-2026/',
    title: 'AI 预算 2026',
    titleEn: 'AI Budget 2026',
    titleJa: 'AI予算2026',
    titleKo: 'AI 예산 2026',
    description: '面向 AI 的财政预算说明。',
    descriptionEn: 'A budget note for AI.',
    descriptionJa: 'AI向け予算の説明。',
    descriptionKo: 'AI 예산 설명.',
    category: '预算与资金',
    publishedDate: '2026-06-01',
    confidence: 'high',
    model: 'test',
    generatedAt: '2026-06-19T00:00:00Z',
  },
  id: 'ai-budget-2026',
  pageTitle: 'AI Budget 2026',
  pageDate: '2026-06-01',
  pdfUrl: null,
  contentText: 'x',
};

const pendingEntity: EnrichedEntity = {
  candidate: {
    sourceUrl: 'https://aisingapore.org/labs/new-lab/',
    domain: 'aisingapore.org',
    label: 'AI Singapore',
    defaultCategory: 'research',
    defaultEntityType: 'research-lab',
  },
  summary: {
    sourceUrl: 'https://aisingapore.org/labs/new-lab/',
    title: '新实验室',
    titleEn: 'New Lab',
    titleJa: '新ラボ',
    titleKo: '새 연구소',
    description: '一个 AI 实验室。',
    descriptionEn: 'An AI lab.',
    descriptionJa: 'AIラボ。',
    descriptionKo: 'AI 연구소.',
    category: 'research',
    publishedDate: null,
    confidence: 'low',
    _pendingReview: true,
    model: 'test',
    generatedAt: '2026-06-19T00:00:00Z',
  },
  id: 'new-lab',
  pageTitle: 'New Lab',
  pageDate: null,
  contentText: 'x',
};

test('policies emit: source field carries en/ja/ko siblings', () => {
  const record = formatPolicyRecord(policy, policy.candidate.defaultMinistry);
  const wrapped = `export const x = [\n  {\n    policies: [\n${record}\n    ],\n  },\n];\n`;
  withTmpFile(wrapped, (path) => {
    const issues = findUnpairedFields(path, { fields: ['source'], locales: ['en', 'ja', 'ko'] });
    assert.deepEqual(
      issues,
      [],
      `source must carry en/ja/ko siblings; missing locales: ${JSON.stringify(issues.map((i) => i.locale))}`
    );
  });
});

const ecosystemSchema = I18N_CONFIG.find((c) => c.file === 'src/data/ecosystem.ts')!;

test('ecosystem emit: _pendingReview stub + its nested source are exempt (escape hatch)', () => {
  const entityStr = formatEntity(pendingEntity);
  const wrapped = `export const x = [\n  {\n    entities: [\n${entityStr}\n    ],\n  },\n];\n`;
  withTmpFile(wrapped, (path) => {
    const issues = findIncompleteRecords(path, { schema: ecosystemSchema });
    assert.deepEqual(
      issues,
      [],
      `pending stub must be exempt from completeness; still flagged: ${JSON.stringify(
        issues.map((i) => ({ schema: i.schema, missing: i.missingFields }))
      )}`
    );
  });
});

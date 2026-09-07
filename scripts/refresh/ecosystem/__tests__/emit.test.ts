// scripts/refresh/ecosystem/__tests__/emit.test.ts
//
// formatEntity is pure: no network, no LLM. These pin the two #294 fixes —
// the record is named after the entity, and `founded` never comes from the
// article date.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatEntity } from '../emit.ts';
import type { EnrichedEntity } from '../enrich.ts';

function fixture(overrides: Partial<EnrichedEntity['entity']> = {}): EnrichedEntity {
  return {
    candidate: {
      sourceUrl: 'https://www.businesstimes.com.sg/startups-tech/technology/ai-push-becoming-energy-race-sembcorp',
      domain: 'businesstimes.com.sg',
      label: 'Business Times Tech',
      defaultCategory: '产业伙伴',
      defaultEntityType: 'product',
      hintedTitle: 'The AI Push Is Becoming an Energy Race: Sembcorp',
    },
    summary: {
      sourceUrl: 'https://www.businesstimes.com.sg/startups-tech/technology/ai-push-becoming-energy-race-sembcorp',
      title: 'AI浪潮正成为能源竞赛：胜科工业',
      titleEn: 'The AI Push Is Becoming an Energy Race: Sembcorp',
      description: '胜科工业供应新加坡数据中心近三分之一的电力。',
      descriptionEn: 'Sembcorp supplies close to one-third of Singapore data-centre electricity.',
      category: '产业伙伴',
      publishedDate: '2026-08-31',
      confidence: 'high',
      model: 'haiku',
      generatedAt: '2026-09-07T00:00:00Z',
    },
    entity: {
      isEntity: true,
      nameEn: 'Sembcorp Industries',
      nameZh: '胜科工业',
      nameJa: 'センブコープ・インダストリーズ',
      nameKo: 'Sembcorp Industries',
      entityType: 'partner',
      foundedYear: null,
      confidence: 'high',
      reason: 'Op-ed by the Sembcorp COO about powering AI industries.',
      ...overrides,
    },
    id: 'sembcorp-industries',
    headlineEn: 'The AI Push Is Becoming an Energy Race: Sembcorp',
    pageTitle: 'The AI push is becoming an energy race',
    pageDate: '2026-08-31',
    contentText: '...',
  };
}

test('formatEntity: record is named after the entity, not the headline', () => {
  const out = formatEntity(fixture(), '2026-09-07');
  assert.match(out, /^\s+id: 'sembcorp-industries',$/m);
  assert.match(out, /^\s+name: '胜科工业',$/m);
  assert.match(out, /^\s+nameEn: 'Sembcorp Industries',$/m);
  assert.match(out, /^\s+nameJa: 'センブコープ・インダストリーズ',$/m);
  assert.match(out, /^\s+entityType: 'partner',$/m);
  assert.doesNotMatch(out, /nameEn: 'The AI Push/);
});

test('formatEntity: founded is omitted unless the source states it; article date only feeds sources[].date', () => {
  const out = formatEntity(fixture(), '2026-09-07');
  assert.doesNotMatch(out, /founded:/);
  assert.match(out, /date: '2026-08-31'/);
  const withYear = formatEntity(fixture({ foundedYear: '1998' }), '2026-09-07');
  assert.match(withYear, /^\s+founded: '1998',$/m);
});

test('formatEntity: headline survives in discoveryNote for provenance; entity type falls back to the source default', () => {
  const out = formatEntity(fixture({ entityType: null, confidence: 'medium', reason: 'Plausibly Sembcorp.' }), '2026-09-07');
  assert.match(out, /discoveryNote: 'Auto-discovered via Business Times Tech; headline: "The AI Push Is Becoming an Energy Race: Sembcorp"; confidence=high; entity=medium; entity note: Plausibly Sembcorp\.'/);
  assert.match(out, /^\s+entityType: 'product',$/m);
  assert.match(out, /_pendingReview: true/);
});

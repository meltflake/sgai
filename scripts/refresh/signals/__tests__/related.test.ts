// scripts/refresh/signals/__tests__/related.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { findRelated, type RelatedIndex } from '../related.ts';

const index: RelatedIndex = [
  { kind: 'person', id: 'josephine-teo', name: 'Josephine Teo' },
  { kind: 'ecosystem', id: 'ai-singapore', name: 'AI Singapore' },
  { kind: 'ecosystem', id: 'nvidia', name: 'NVIDIA' },
  { kind: 'startup', id: 'grab', name: 'Grab' },
  { kind: 'startup', id: 'near', name: 'Near' },
  { kind: 'startup', id: 'aspire', name: 'Aspire' },
];

test('findRelated: multi-word names match in the lead text', () => {
  const r = findRelated('IMDA expands sandbox', 'Minister Josephine Teo said AI Singapore will run it.', index);
  assert.deepEqual(r, [
    { kind: 'person', id: 'josephine-teo' },
    { kind: 'ecosystem', id: 'ai-singapore' },
  ]);
});

test('findRelated: single-word names only match in the headline', () => {
  assert.deepEqual(findRelated('Bank pilots assistant', 'Near the end of the year, firms aspire to use NVIDIA chips. Grab drivers too.', index), []);
  assert.deepEqual(findRelated('Grab rolls out AI fraud checks', '', index), [{ kind: 'startup', id: 'grab' }]);
});

test('findRelated: lead text beyond 400 characters is ignored', () => {
  const lead = 'x '.repeat(250) + 'Josephine Teo';
  assert.deepEqual(findRelated('Headline', lead, index), []);
});

test('findRelated: word boundaries, de-duplication and a cap of 3', () => {
  const big: RelatedIndex = [
    ...index,
    { kind: 'person', id: 'tan-kiat-how', name: 'Tan Kiat How' },
    { kind: 'person', id: 'jasmin-lau', name: 'Jasmin Lau' },
  ];
  const r = findRelated('Grabbing headlines', 'Josephine Teo, Tan Kiat How and Jasmin Lau met AI Singapore. Josephine Teo spoke.', big);
  assert.equal(r.length, 3);
  assert.ok(!r.some((x) => x.id === 'grab'));
});

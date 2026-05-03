// scripts/lib/__tests__/auto-commit.test.ts
//
// auto-commit shells out to git/gh, so the testable surface is buildPRBody
// (pure formatter) and the dirty-detection helper logic. The branch +
// push + PR flow is verified manually in the e2e milestone (M1).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildPRBody } from '../auto-commit.ts';

test('buildPRBody: includes domain, count, sources, diff stat', () => {
  const body = buildPRBody({
    domain: 'policies',
    diffStat: ' src/data/policies.ts | 12 ++++\n 1 file changed, 12 insertions(+)',
    newEntries: [
      { title: 'IMDA AI Advisory 1', sourceUrl: 'https://imda.gov.sg/x', confidence: 'high' },
      { title: 'IMDA AI Advisory 2', sourceUrl: 'https://imda.gov.sg/y', confidence: 'medium' },
    ],
  });
  assert.ok(body.includes('Domain: `policies`'));
  assert.ok(body.includes('New entries: **2**'));
  assert.ok(body.includes('IMDA AI Advisory 1'));
  assert.ok(body.includes('https://imda.gov.sg/y'));
  assert.ok(body.includes('1 high · 1 medium · 0 low'));
  assert.ok(body.includes('1 file changed'));
});

test('buildPRBody: marks low-confidence entries with warning', () => {
  const body = buildPRBody({
    domain: 'ecosystem',
    diffStat: 'x',
    newEntries: [{ title: 'Maybe-real Co', sourceUrl: 'https://e27.co/x', confidence: 'low' }],
  });
  assert.ok(body.includes('1 low'));
  assert.ok(body.includes('_pendingReview'));
});

test('buildPRBody: lists failed sources when present', () => {
  const body = buildPRBody({
    domain: 'levers',
    diffStat: 'x',
    newEntries: [],
    failedSources: [
      { url: 'https://imda.gov.sg/down', error: '503 Service Unavailable' },
    ],
  });
  assert.ok(body.includes('Failed sources'));
  assert.ok(body.includes('503 Service Unavailable'));
});

test('buildPRBody: truncates new entries beyond 50', () => {
  const entries = Array.from({ length: 75 }, (_, i) => ({
    title: `Entry ${i}`,
    sourceUrl: `https://x.gov.sg/${i}`,
  }));
  const body = buildPRBody({ domain: 'policies', diffStat: 'x', newEntries: entries });
  assert.ok(body.includes('Entry 0'));
  assert.ok(body.includes('Entry 49'));
  assert.ok(body.includes('and 25 more'));
  assert.ok(!body.includes('Entry 60'));
});

test('buildPRBody: defaults entries with no confidence to "high"', () => {
  const body = buildPRBody({
    domain: 'x',
    diffStat: 'x',
    newEntries: [{ title: 'No-conf entry', sourceUrl: 'https://x.gov.sg/y' }],
  });
  assert.ok(body.includes('1 high · 0 medium · 0 low'));
});

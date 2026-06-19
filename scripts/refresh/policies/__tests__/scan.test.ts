// scripts/refresh/policies/__tests__/scan.test.ts
// ────────────────────────────────────────────────────────────────────────
// Relevance filter regression. The 2026-06-19 sweep surfaced 5 candidates,
// all generic smartnation.gov.sg landing / engagement / about / event pages
// (captured in scripts/refresh/policies/data/raw/) — none substantive AI
// policy documents. applyFilters must reject these while keeping real
// article-depth policy URLs.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { applyFilters } from '../scan.ts';
import { POLICY_SOURCES } from '../sources.ts';

const smartnation = POLICY_SOURCES.find((s) => s.domain === 'smartnation.gov.sg')!;
const mddi = POLICY_SOURCES.find((s) => s.domain === 'mddi.gov.sg')!;

// The exact junk URLs the sweep surfaced (from data/raw/ snapshots).
const JUNK = [
  'https://www.smartnation.gov.sg/initiatives/',
  'https://www.smartnation.gov.sg/about/our-goals/goals-of-smart-nation/',
  'https://www.smartnation.gov.sg/initiatives/programmes-and-initiatives/',
  'https://www.smartnation.gov.sg/citizen-engagement/engagement-programmes/smart-nation-engagement-programmes/',
  'https://www.smartnation.gov.sg/citizen-engagement/showcases/smart-nation-playscape/',
  'https://www.smartnation.gov.sg/citizen-engagement/showcases/smart-nation-cityscape/',
  'https://www.smartnation.gov.sg/citizen-engagement/showcases/smart-nation-showcases/',
  'https://www.smartnation.gov.sg/events/singapore-ai-research-week-2025/',
  'https://www.smartnation.gov.sg/citizen-engagement/engagement-programmes/smart-nation-ambassadors/',
];

// Article-depth pages that look like real policy / news documents — must survive.
const LEGIT = [
  'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
  'https://www.smartnation.gov.sg/initiatives/digital-government-blueprint/',
  'https://www.smartnation.gov.sg/media-room/news/sg-launches-new-ai-testbed/',
];

test('applyFilters rejects all generic / landing / engagement smartnation pages', () => {
  const result = applyFilters(JUNK, smartnation);
  assert.deepEqual(result, [], `expected zero matches, got ${JSON.stringify(result)}`);
});

test('applyFilters keeps article-depth AI policy URLs', () => {
  const result = applyFilters(LEGIT, smartnation);
  assert.deepEqual([...result].sort(), [...LEGIT].sort(), `expected all legit URLs kept, got ${JSON.stringify(result)}`);
});

test('applyFilters keeps legit while dropping junk in a mixed batch', () => {
  const result = applyFilters([...JUNK, ...LEGIT], smartnation);
  assert.deepEqual([...result].sort(), [...LEGIT].sort());
});

test('generic-section denylist is shared across sources (mddi /about/ rejected)', () => {
  const result = applyFilters(
    [
      'https://www.mddi.gov.sg/about/our-leadership/',
      'https://www.mddi.gov.sg/newsroom/press-releases/2026/new-ai-governance-framework/',
    ],
    mddi
  );
  assert.deepEqual(result, ['https://www.mddi.gov.sg/newsroom/press-releases/2026/new-ai-governance-framework/']);
});

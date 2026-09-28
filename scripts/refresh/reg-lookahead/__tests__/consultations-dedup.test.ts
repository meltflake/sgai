// A consultation is "known" by id OR by sourceUrl. The 2026-09-28 run
// re-added the DIB consultation because its record id came from the
// call-for-views URL while its sourceUrl had moved to the outcome page.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isKnownConsultation } from '../consultations.ts';

const ids = new Set(['public-consultation-on-digital-infrastructure-bill']);
const urls = new Set(['https://www.mddi.gov.sg/newsroom/public-consultation-on-the-digital-infrastructure-bill']);

test('known by sourceUrl even when the slug differs from the id', () => {
  assert.equal(
    isKnownConsultation('https://www.mddi.gov.sg/newsroom/public-consultation-on-the-digital-infrastructure-bill/', ids, urls),
    true
  );
});

test('known by slug id', () => {
  assert.equal(isKnownConsultation('https://www.mddi.gov.sg/newsroom/public-consultation-on-digital-infrastructure-bill/', ids, urls), true);
});

test('unknown consultation passes', () => {
  assert.equal(isKnownConsultation('https://www.pdpc.gov.sg/news/public-consultation-on-agentic-ai-data-use', ids, urls), false);
});

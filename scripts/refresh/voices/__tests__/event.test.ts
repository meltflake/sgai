// scripts/refresh/voices/__tests__/event.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { extractEventEn } from '../event.ts';

test('extractEventEn: "at" inside a name (Kiat) must not start the event', () => {
  assert.equal(
    extractEventEn('Address by SMS Tan Kiat How at NVIDIA AI Day Singapore'),
    'NVIDIA AI Day Singapore'
  );
});

test('extractEventEn: strips trailing year and date', () => {
  assert.equal(extractEventEn('Opening Address by Minister Josephine Teo at ATxSummit 2026'), 'ATxSummit');
  assert.equal(extractEventEn('Speech by SMS Tan Kiat How at the SCS AI Conference on 12 March'), 'SCS AI Conference');
});

test('extractEventEn: returns empty when no at/for clause exists', () => {
  assert.equal(extractEventEn('Ministerial Statement on Artificial Intelligence'), '');
});

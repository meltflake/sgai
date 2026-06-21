// Unit tests for the shared transcript noise patterns. Guards two things:
// (1) the known page-chrome kinds that leaked on 2026-06-20 are caught;
// (2) real speech bodies — including ones that mention privacy / data /
// a newsletter in passing — are NOT flagged (no false positives that would
// make the CI gate unusable).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { findNoiseParagraphs, isNoiseParagraph } from '../transcript-noise.ts';

test('flags MDDI breadcrumb header (the 2026-06-20 bug)', () => {
  assert.equal(
    isNoiseParagraph('Newsroom Address by Minister Josephine Teo at ST Engineering InnoTech Conference 2025 Speeches'),
    true,
  );
});

test('flags CMS migration notice', () => {
  assert.equal(
    isNoiseParagraph(
      'This article has been migrated from an earlier version of the site and may display formatting inconsistencies.',
    ),
    true,
  );
});

test('flags footer / legal chrome', () => {
  assert.equal(isNoiseParagraph('© 2026 Government of Singapore. All Rights Reserved'), true);
  assert.equal(isNoiseParagraph('MDDI (P) 025/05/2026'), true);
  assert.equal(isNoiseParagraph('Privacy Statement'), true);
});

test('flags scam / newsletter / JS boilerplate', () => {
  assert.equal(isNoiseParagraph('Subscribe to our newsletter for updates'), true);
  assert.equal(isNoiseParagraph('Call the 24/7 ScamShield Helpline at 1799'), true);
});

test('does NOT flag a normal speech opening', () => {
  assert.equal(isNoiseParagraph('Good morning. Welcome to ATxEnterprise 2026.'), false);
  assert.equal(isNoiseParagraph('Distinguished Guests, Ladies and Gentlemen'), false);
  assert.equal(isNoiseParagraph('Chairman, ST Engineering, Mr. Teo Ming Kian'), false);
});

test('does NOT flag a speech that mentions privacy / data / newsletters in passing', () => {
  assert.equal(isNoiseParagraph('We must protect data privacy as AI systems scale across the economy.'), false);
  assert.equal(isNoiseParagraph('Our newsletter on AI reached 10,000 SMEs last year.'), false);
  assert.equal(isNoiseParagraph("Singapore's AI governance framework was the first in Asia."), false);
});

test('findNoiseParagraphs returns indexed hits, skips clean paragraphs', () => {
  const paras = [
    'Newsroom Keynote by Minister at AI Summit Speeches',
    'Good morning, everyone.',
    'This article has been migrated from an earlier version of the site.',
    'AI is central to our economy.',
  ];
  const hits = findNoiseParagraphs(paras);
  assert.equal(hits.length, 2);
  assert.equal(hits[0].index, 0);
  assert.equal(hits[0].label, 'breadcrumb:Newsroom');
  assert.equal(hits[1].index, 2);
  assert.equal(hits[1].label, 'cms:migrated');
});

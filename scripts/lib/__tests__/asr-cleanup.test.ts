// scripts/lib/__tests__/asr-cleanup.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { stripAsrHallucinations, stripAsrHallucinationsWithReport } from '../asr-cleanup.ts';

test('strips a long "Hey, hey, hey." preamble', () => {
  const junk = Array.from({ length: 20 }, () => 'Hey, hey, hey.');
  const real = [
    'Joining at 8:40 a.m. on a Saturday for day two of AI Engineer Singapore.',
    'I am Sherry from 65 Labs, one of the largest grassroots builder collectives here.',
  ];
  const { kept, report } = stripAsrHallucinationsWithReport([...junk, ...real]);
  assert.deepEqual(kept, real);
  assert.equal(report.removedFromStart, 20);
  assert.equal(report.removedFromEnd, 0);
  assert.equal(report.removedFromMiddle, 0);
  assert.equal(report.stripped, true);
});

test('strips inter-speaker junk runs in the middle of a transcript', () => {
  // Real conference recording: speaker A finishes → music transition
  // (captioned as "Hey, hey, hey") → speaker B begins. We need to drop
  // the music captions while preserving both speakers.
  const speakerA = [
    'Thank you for the introduction; today I want to talk about responsible AI.',
    'We trained the model on hours of her own guided meditation transcripts.',
  ];
  const transition = Array.from({ length: 12 }, () => 'Hey, hey, hey.');
  const speakerB = [
    'Hi everyone, I am up next to talk about agent runtime sandboxing on Cloudflare.',
    'Let me walk you through what we shipped last quarter and the trade-offs we made.',
  ];
  const { kept, report } = stripAsrHallucinationsWithReport([
    ...speakerA,
    ...transition,
    ...speakerB,
  ]);
  assert.deepEqual(kept, [...speakerA, ...speakerB]);
  assert.equal(report.removedFromStart, 0);
  assert.equal(report.removedFromEnd, 0);
  assert.equal(report.removedFromMiddle, 12);
  assert.equal(report.stripped, true);
});

test('strips embedded variant tokens in the junk run ("Heat. Heat.")', () => {
  const sentences = [
    'Hey, hey, hey.',
    'Hey, hey, hey.',
    'Heat. Heat.',
    'Hey, hey, hey.',
    'Hey, hey, hey.',
    'Hey, hey, hey.',
    'This is the real opening sentence with enough words to pass the diversity filter.',
  ];
  const kept = stripAsrHallucinations(sentences);
  assert.equal(kept.length, 1);
  assert.match(kept[0], /^This is the real opening/);
});

test('strips junk run at end too', () => {
  const real = [
    'Thanks for joining today; this concludes the keynote on responsible AI deployment.',
    'Please head to the next breakout room on the second floor for the afternoon track.',
  ];
  const junk = Array.from({ length: 8 }, () => 'Yeah, yeah.');
  const { kept, report } = stripAsrHallucinationsWithReport([...real, ...junk]);
  assert.deepEqual(kept, real);
  assert.equal(report.removedFromEnd, 8);
});

test('leaves short junk runs alone (below minRunLength)', () => {
  const sentences = [
    'Hey.',
    'Hi.',
    'Welcome to the show, ladies and gentlemen, and friends from around the world.',
    'Today we are talking about Singapore AI policy.',
  ];
  const kept = stripAsrHallucinations(sentences);
  assert.deepEqual(kept, sentences);
});

test('refuses to strip when junk fraction exceeds safety threshold', () => {
  // All sentences are low-diversity. Algorithm would happily strip all of
  // them — safety net should refuse.
  const sentences = Array.from({ length: 30 }, () => 'Hey, hey, hey.');
  const { kept, report } = stripAsrHallucinationsWithReport(sentences);
  assert.deepEqual(kept, sentences);
  assert.equal(report.stripped, false);
});

test('preserves CJK sentences (non-Latin content is treated as content)', () => {
  const sentences = [
    'これは日本語のテキストです、十分に長く、内容も豊富で多様な語彙を含んでいます。',
    '另一段中文内容也应该被完整保留，不应当被误判为 ASR 噪声而剔除。',
    'And here is some English content as well.',
  ];
  const kept = stripAsrHallucinations(sentences);
  assert.deepEqual(kept, sentences);
});

test('handles empty input gracefully', () => {
  const { kept, report } = stripAsrHallucinationsWithReport([]);
  assert.deepEqual(kept, []);
  assert.equal(report.stripped, false);
});

test('handles input that is entirely real content', () => {
  const sentences = [
    'Singapore unveiled its AI strategy update earlier this year.',
    'The strategy focuses on three pillars: talent, compute, and applications.',
    'Implementation will be led by MDDI and IMDA in close coordination.',
  ];
  const { kept, report } = stripAsrHallucinationsWithReport(sentences);
  assert.deepEqual(kept, sentences);
  assert.equal(report.stripped, false);
});

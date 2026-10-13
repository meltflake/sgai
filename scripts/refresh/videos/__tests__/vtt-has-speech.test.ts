// A caption track that holds only sound tags is not a transcript.
// 2026-10-09: v120's whole caption was "[music] >> Woo!". It was emitted as
// a 1-paragraph record and then translated into four languages of noise.
// hasSpeech() lets fetch-transcripts.ts store such a video as unavailable.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { hasSpeech } from '../../../videos/vtt-parse.ts';

test('sound tags and a cheer are not speech (the v120 case)', () => {
  assert.equal(hasSpeech(['[music] >> Woo!']), false);
  assert.equal(hasSpeech(['[Music] [Applause]', '>> [laughter]']), false);
  assert.equal(hasSpeech(['[音乐] >> 嗚！']), false);
});

test('a short real sentence is speech', () => {
  assert.equal(hasSpeech(['[Music] Welcome to the AI Singapore summit.']), true);
  assert.equal(hasSpeech(['欢迎来到新加坡人工智能峰会']), true);
});

test('an empty transcript is not speech', () => {
  assert.equal(hasSpeech([]), false);
});

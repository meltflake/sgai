// scripts/refresh/voices/__tests__/emit-close-line.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { findArrayCloseLine } from '../emit.ts';

const OPEN = /^export const speechTranscripts: Record<string, SpeechTranscript> = \{/;

test('findArrayCloseLine: unbalanced brackets inside speech text do not hide the close', () => {
  // 2026-11: a transcript line "he [moderator) does not need to be here"
  // left the old bracket counter one level deep, so the close was never found.
  const lines = [
    'export const speechTranscripts: Record<string, SpeechTranscript> = {',
    "  'some-speech': {",
    "    paragraphs: ['I think he [moderator) does not need to be here.'],",
    '  },',
    '};',
    '',
    'export function getSpeechTranscript() {',
    '}',
  ];
  assert.equal(findArrayCloseLine(lines, OPEN), 4);
});

test('findArrayCloseLine: closes an array literal at column 0', () => {
  const lines = ['export const speeches: Speech[] = [', '  {', "    id: 'a',", '  },', '];'];
  assert.equal(findArrayCloseLine(lines, /^export const speeches: Speech\[\] = \[/), 4);
});

test('findArrayCloseLine: throws when the opener is missing', () => {
  assert.throws(() => findArrayCloseLine(['const x = 1;'], OPEN), /Could not locate opening marker/);
});

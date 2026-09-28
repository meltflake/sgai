// appendHistoryEntry must handle both history shapes the data file holds:
// prettier keeps a one-entry array on one line, and the 2026-09-28 run
// dropped the Digital Infrastructure Bill's second-reading transition
// because the old regex only matched the multi-line form.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { appendHistoryEntry } from '../emit.ts';

const ENTRY = "{ stage: 'second-reading', observedAt: '2026-09-28' },";

test('appends to a single-line history array', () => {
  const block = `\n  {\n    id: 'x',\n    stageHistory: [{ stage: 'introduced', observedAt: '2026-09-14' }],\n    addedAt: '2026-09-14',\n  },`;
  const out = appendHistoryEntry(block, 'stageHistory', ENTRY);
  assert.match(out, /stage: 'introduced', observedAt: '2026-09-14' \},\s*\{ stage: 'second-reading', observedAt: '2026-09-28' \},\s*\],/);
  assert.match(out, /addedAt: '2026-09-14',/);
});

test('appends to a multi-line history array', () => {
  const block = `\n  {\n    id: 'x',\n    statusHistory: [\n      { status: 'closed', observedAt: '2026-08-03' },\n      { status: 'response-published', observedAt: '2026-09-14' },\n    ],\n  },`;
  const out = appendHistoryEntry(block, 'statusHistory', "{ status: 'closed', observedAt: '2026-09-28' },");
  assert.match(out, /'2026-09-14' \},\s*\{ status: 'closed', observedAt: '2026-09-28' \},\s*\],/);
});

test('throws when the history field is missing', () => {
  assert.throws(() => appendHistoryEntry(`\n  {\n    id: 'x',\n  },`, 'stageHistory', ENTRY), /stageHistory not found/);
});

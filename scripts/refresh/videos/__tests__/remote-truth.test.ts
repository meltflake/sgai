// Unit tests for the cross-checkout video id/dedupe facts (incident
// 2026-08-16/17: three daily PRs emitted the same video as v081 because
// allocation and dedupe only ever read the local videos.ts).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseVideosFile, unionFacts } from '../remote-truth.ts';

const FILE_A = `
export const videos: Video[] = [
  {
    id: 'v081',
    youtubeUrl: 'https://www.youtube.com/watch?v=mwISkfdRN4o',
  },
  {
    id: 'v080',
    youtubeUrl: 'https://www.youtube.com/watch?v=AbCdEfGhIjK',
  },
];
`;

const FILE_B = `
export const videos: Video[] = [
  {
    id: 'v083',
    youtubeUrl: 'https://youtube.com/watch?v=ZzYyXxWwVvU',
  },
];
`;

test('parseVideosFile: extracts youtube ids and max vNNN', () => {
  const f = parseVideosFile(FILE_A);
  assert.deepEqual([...f.youtubeIds].sort(), ['AbCdEfGhIjK', 'mwISkfdRN4o']);
  assert.equal(f.maxId, 81);
});

test('parseVideosFile: handles www-less youtube urls and empty files', () => {
  assert.equal(parseVideosFile(FILE_B).youtubeIds.has('ZzYyXxWwVvU'), true);
  const empty = parseVideosFile('export const videos = [];');
  assert.equal(empty.youtubeIds.size, 0);
  assert.equal(empty.maxId, 0);
});

test('unionFacts: ids union, max wins — the v081 collision scenario', () => {
  // Local checkout stale at v080; open PR branch already carries v081
  // with the same video a naive run would re-emit.
  const local = parseVideosFile(FILE_A.replace(/v081[\s\S]*?},\n/, ''));
  const openPr = parseVideosFile(FILE_A);
  const union = unionFacts(local, openPr);
  assert.equal(union.maxId, 81, 'allocation must start above the open PR');
  assert.equal(union.youtubeIds.has('mwISkfdRN4o'), true, 'PR video must dedupe');
});

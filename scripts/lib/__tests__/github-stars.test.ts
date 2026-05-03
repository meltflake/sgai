// scripts/lib/__tests__/github-stars.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseGithubUrl, findGithubBlocks, rewriteStarsLine } from '../github-stars.ts';

test('parseGithubUrl: parses owner/repo URL', () => {
  assert.deepEqual(parseGithubUrl('https://github.com/aisingapore/sealion'), {
    owner: 'aisingapore',
    repo: 'sealion',
  });
});

test('parseGithubUrl: strips .git suffix', () => {
  assert.deepEqual(parseGithubUrl('https://github.com/foo/bar.git'), {
    owner: 'foo',
    repo: 'bar',
  });
});

test('parseGithubUrl: ignores trailing path / query / fragment', () => {
  assert.deepEqual(parseGithubUrl('https://github.com/foo/bar/blob/main/README.md'), {
    owner: 'foo',
    repo: 'bar',
  });
  assert.deepEqual(parseGithubUrl('https://github.com/foo/bar?tab=readme'), {
    owner: 'foo',
    repo: 'bar',
  });
  assert.deepEqual(parseGithubUrl('https://github.com/foo/bar#section'), {
    owner: 'foo',
    repo: 'bar',
  });
});

test('parseGithubUrl: rejects org-only URL', () => {
  assert.equal(parseGithubUrl('https://github.com/aisingapore'), null);
});

test('parseGithubUrl: rejects non-github host', () => {
  assert.equal(parseGithubUrl('https://gitlab.com/foo/bar'), null);
  assert.equal(parseGithubUrl('https://huggingface.co/foo'), null);
});

test('findGithubBlocks: pairs stars line BEFORE url line', () => {
  const src = `
{
  name: 'foo',
  stars: 42,
  url: 'https://github.com/foo/bar',
},
`;
  const blocks = findGithubBlocks(src);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].url, 'https://github.com/foo/bar');
  assert.equal(blocks[0].starsValue, 42);
});

test('findGithubBlocks: pairs stars line AFTER url line', () => {
  const src = `
{
  name: 'foo',
  url: 'https://github.com/foo/bar',
  stars: 100,
},
`;
  const blocks = findGithubBlocks(src);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].starsValue, 100);
});

test('findGithubBlocks: returns null stars when no stars field present', () => {
  const src = `
{
  name: 'foo',
  url: 'https://github.com/foo/bar',
},
`;
  const blocks = findGithubBlocks(src);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].starsValue, null);
  assert.equal(blocks[0].starsLineIndex, null);
});

test('findGithubBlocks: stops at record boundary, does not pull stars from neighbour record', () => {
  const src = `
{
  stars: 999,
},
{
  url: 'https://github.com/foo/bar',
},
`;
  const blocks = findGithubBlocks(src);
  assert.equal(blocks.length, 1);
  // Looks back, hits "}", stops; then looks forward, hits "}", stops. So null.
  assert.equal(blocks[0].starsValue, null);
});

test('rewriteStarsLine: replaces stars value preserving formatting', () => {
  const lines = ['  stars: 100,', '  url: ...'];
  const out = rewriteStarsLine(lines, 0, 250);
  assert.equal(out[0], '  stars: 250,');
  assert.equal(out[1], '  url: ...');
});

test('rewriteStarsLine: pure (does not mutate input)', () => {
  const lines = ['  stars: 100,'];
  rewriteStarsLine(lines, 0, 999);
  assert.equal(lines[0], '  stars: 100,');
});

// scripts/evals/addedAt-coverage/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the addedAt-coverage eval's diff analyzer.
//
// CLAUDE.md rule #7: pending-review records do NOT carry `addedAt` until a
// human promotes them. They take several shapes:
//   - `autoDiscovered[]` const arrays   (startups / tracker / talent / benchmarking)
//   - "Auto-discovered (pending review)" group / section (levers / legal-ai)
//   - `_pendingReview: true` field        (ecosystem)
//   - `// _pendingReview` comment         (policies, low confidence)
// All four must PASS the eval without addedAt. A real record without addedAt
// must still FAIL.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { analyzeDiff, evaluateFileDiff, exemptLineRanges } from '../check.ts';

const FILE = 'src/data/test.ts';

/** Emit a minimal `git diff --unified=0` patch with one hunk. */
function makeDiff(newStart: number, addedLines: string[]): string {
  const head = [
    `diff --git a/${FILE} b/${FILE}`,
    `index 1111111..2222222 100644`,
    `--- a/${FILE}`,
    `+++ b/${FILE}`,
    `@@ -${newStart},0 +${newStart},${addedLines.length} @@`,
  ];
  return [...head, ...addedLines.map((l) => `+${l}`)].join('\n') + '\n';
}

/**
 * Given the full working-tree file as lines and the 1-based inclusive range
 * of lines that are "new" in the diff, return a consistent { source, diff }
 * pair (the diff's added lines are guaranteed to equal the source lines at
 * those positions — so `@@` line numbers line up with the source).
 */
function buildCase(lines: string[], addedStart: number, addedEnd: number) {
  const added = lines.slice(addedStart - 1, addedEnd);
  return { source: lines.join('\n') + '\n', diff: makeDiff(addedStart, added) };
}

// ── 1. autoDiscovered[] anonymous entry (startups style) — PASS ──────────
test('autoDiscovered[] entry without addedAt PASSES (anonymous, no id)', () => {
  const lines = [
    'export const startups = [',
    "  { id: 'real-existing', addedAt: '2026-01-01' },",
    '];',
    '',
    'export interface AutoDiscoveredEntry {',
    '  title: string;',
    '}',
    'export const autoDiscovered: AutoDiscoveredEntry[] = [',
    '  {',
    "    title: '新创业公司',",
    "    titleEn: 'New Startup',",
    "    description: '描述',",
    "    descriptionEn: 'Desc',",
    "    category: 'startup',",
    "    confidence: 'low',",
    "    sourceUrl: 'https://example.com',",
    "    discoveredAt: '2026-06-19',",
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 9, 18); // the entry `{ ... },`
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'PASS', `expected PASS, got ${JSON.stringify(finding)}`);
  assert.equal(finding.newRecords, 0);
});

// ── 2. levers "Auto-discovered (pending review)" item (has id) — PASS ────
test('Auto-discovered group item with id but no addedAt PASSES (levers style)', () => {
  const lines = [
    'export const levers = [',
    '  {',
    '    number: 1,',
    '    groups: [',
    '      {',
    "        title: 'Auto-discovered (pending review)',",
    "        titleEn: 'Auto-discovered (pending review)',",
    '        items: [',
    '          {',
    "            id: 'auto-item',",
    "            name: '自动项',",
    "            nameEn: 'Auto Item',",
    '          },',
    '        ],',
    '      },',
    '    ],',
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 9, 13); // the item `{ ... },`
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'PASS', `expected PASS, got ${JSON.stringify(finding)}`);
  assert.deepEqual(finding.newRecordIds, []);
});

// ── 3. ecosystem `_pendingReview: true` record (has id) — PASS ───────────
test('ecosystem _pendingReview:true record with id but no addedAt PASSES', () => {
  const lines = [
    'export const ecosystemCategories = [',
    '  {',
    "    name: 'Cat',",
    '    entities: [',
    '      {',
    "        id: 'eco-1',",
    "        name: '生态实体',",
    "        nameEn: 'Eco Entity',",
    '        _pendingReview: true,',
    '      },',
    '    ],',
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 5, 10);
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'PASS', `expected PASS, got ${JSON.stringify(finding)}`);
  assert.deepEqual(finding.newRecordIds, []);
});

// ── 4. policies `// _pendingReview` comment record (has id) — PASS ───────
test('policies record with // _pendingReview comment but no addedAt PASSES', () => {
  const lines = [
    'export const policies = [',
    '  {',
    "    name: 'Strat',",
    '    policies: [',
    '      {',
    "        id: 'pol-low',",
    "        title: '低置信政策',",
    "        titleEn: 'Low conf',",
    '        // _pendingReview: low confidence — uncertain',
    '      },',
    '    ],',
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 5, 10);
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'PASS', `expected PASS, got ${JSON.stringify(finding)}`);
});

// ── 5. real record without addedAt — must still FAIL ─────────────────────
test('real record (not pending-review) without addedAt FAILS', () => {
  const lines = [
    'export const videos = [',
    '  {',
    "    id: 'v999',",
    "    title: '真实视频',",
    "    titleEn: 'Real Video',",
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 2, 6);
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'FAIL', `expected FAIL, got ${JSON.stringify(finding)}`);
  assert.deepEqual(finding.newRecordIds, ['v999']);
  assert.equal(finding.missing, 1);
});

// ── 6. real record WITH addedAt — PASS (sanity) ──────────────────────────
test('real record with addedAt PASSES', () => {
  const lines = [
    'export const videos = [',
    '  {',
    "    id: 'v999',",
    "    title: '真实视频',",
    "    titleEn: 'Real Video',",
    "    addedAt: '2026-06-19',",
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 2, 7);
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'PASS', `expected PASS, got ${JSON.stringify(finding)}`);
});

// ── 7. multiple real records, one missing addedAt — FAILS ────────────────
test('two real records where one lacks addedAt FAILS (missing=1)', () => {
  const lines = [
    'export const videos = [',
    '  {',
    "    id: 'v100',",
    "    title: '甲',",
    "    titleEn: 'A',",
    "    addedAt: '2026-06-19',",
    '  },',
    '  {',
    "    id: 'v101',",
    "    title: '乙',",
    "    titleEn: 'B',",
    '  },',
    '];',
  ];
  const { source, diff } = buildCase(lines, 2, 12);
  const finding = evaluateFileDiff(FILE, diff, source);
  assert.equal(finding.status, 'FAIL', `expected FAIL, got ${JSON.stringify(finding)}`);
  assert.equal(finding.newRecords, 2);
  assert.equal(finding.newAddedAt, 1);
  assert.equal(finding.missing, 1);
});

// ── 8. exemptLineRanges directly ─────────────────────────────────────────
test('exemptLineRanges finds autoDiscovered array span', () => {
  const source = [
    'export const xs = [',
    "  { id: 'a' },",
    '];',
    'export const autoDiscovered: AutoDiscoveredEntry[] = [',
    '  {',
    "    title: 'x',",
    '  },',
    '];',
  ].join('\n');
  const ranges = exemptLineRanges(source);
  // The autoDiscovered array spans source lines 4..8 (1-based).
  assert.ok(
    ranges.some(([a, b]) => a === 4 && b === 8),
    `expected a [4,8] range, got ${JSON.stringify(ranges)}`
  );
  // The normal `xs` array (lines 1..3) must NOT be exempt.
  assert.ok(!ranges.some(([a, b]) => a <= 2 && 2 <= b), 'line 2 must not be exempt');
});

// ── 9. analyzeDiff: empty diff is a no-op ────────────────────────────────
test('analyzeDiff returns zero counts for empty diff', () => {
  const stats = analyzeDiff('', 'export const xs = [];\n');
  assert.deepEqual(stats, { newRecordIds: [], newAddedAtCount: 0, anonymousRecordOpens: 0 });
});

// scripts/evals/stale-stats/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the stale-stats eval's pure core. Verifies:
//   - both dataDate shapes are extracted (export const / object literal)
//   - schedule resolution walks registry targets, falls back to editorial
//   - staleness compares age against the schedule's ceiling
//   - a fresh stamp on a slow pipeline does not fail

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  auditStaleStats,
  extractDataDates,
  extractAsOfDates,
  auditAsOfWarnings,
  scheduleForFile,
  ageInDays,
  MAX_AGE_DAYS,
  type RegistryShape,
} from '../check.ts';

const REGISTRY: RegistryShape = {
  pipelines: [
    { id: 'startups', schedule: 'quarterly', targets: ['src/data/startups.ts'] },
    { id: 'github-stars', schedule: 'monthly', targets: ['src/data/opensource.ts'] },
  ],
  editorial: [{ file: 'src/data/timeline.ts' }],
};

test('extractDataDates: matches export-const and object-literal shapes', () => {
  const src = [
    "export const dataDate = '2026-02-17';",
    'export const stats = {',
    "  dataDate: '2026-07-01',",
    "  profileUpdated: '2026-05-04',",
    '};',
  ].join('\n');
  assert.deepEqual(extractDataDates(src), ['2026-02-17', '2026-07-01']);
});

test('scheduleForFile: pipeline target wins, unowned file is editorial', () => {
  assert.equal(scheduleForFile(REGISTRY, 'src/data/startups.ts'), 'quarterly');
  assert.equal(scheduleForFile(REGISTRY, 'src/data/timeline.ts'), 'editorial');
});

test('ageInDays: whole-day arithmetic', () => {
  assert.equal(ageInDays('2026-02-17', '2026-07-04'), 137);
});

test('stale quarterly stamp fails, fresh monthly stamp passes', () => {
  const findings = auditStaleStats(
    REGISTRY,
    {
      // 200 days old on a quarterly (150d ceiling) pipeline → stale
      'src/data/startups.ts': "export const s = { dataDate: '2025-12-17' };",
      // 3 days old on a monthly (60d ceiling) pipeline → fresh
      'src/data/opensource.ts': "export const s = { dataDate: '2026-07-01' };",
    },
    '2026-07-04',
  );
  const byFile = Object.fromEntries(findings.map((f) => [f.file, f]));
  assert.equal(byFile['src/data/startups.ts'].stale, true);
  assert.equal(byFile['src/data/startups.ts'].maxAgeDays, MAX_AGE_DAYS.quarterly);
  assert.equal(byFile['src/data/opensource.ts'].stale, false);
});

test('editorial file gets the 365d ceiling', () => {
  const findings = auditStaleStats(
    REGISTRY,
    { 'src/data/timeline.ts': "const x = { dataDate: '2025-08-01' };" }, // ~337d
    '2026-07-04',
  );
  assert.equal(findings[0].schedule, 'editorial');
  assert.equal(findings[0].stale, false);
});

test('file without dataDate yields no findings', () => {
  const findings = auditStaleStats(REGISTRY, { 'src/data/startups.ts': 'export const nothing = 1;' }, '2026-07-04');
  assert.equal(findings.length, 0);
});

test('extractAsOfDates: matches all three granularities, skips dataDate', () => {
  const src = [
    "  headlineAsOf: '2026-02',",
    "  asOfDate: '2026-08-03',",
    "  asOfDate: '2024',",
    "  dataDate: '2026-05-20',",
  ].join('\n');
  assert.deepEqual(extractAsOfDates(src), ['2026-02', '2026-08-03', '2024']);
});

test('auditAsOfWarnings: only flags stamps older than a year', () => {
  const warnings = auditAsOfWarnings(
    {
      'src/data/tracker.ts': [
        "  headlineAsOf: '2026-02',", // fresh
        "  headlineAsOf: '2024',", // 365d+ → warned, year-normalised
      ].join('\n'),
    },
    '2026-07-04',
  );
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].dataDate, '2024');
  assert.equal(warnings[0].schedule, 'as-of');
});

test('auditAsOfWarnings: no as-of stamps yields no warnings', () => {
  assert.equal(auditAsOfWarnings({ 'src/data/tracker.ts': 'export const x = 1;' }, '2026-07-04').length, 0);
});

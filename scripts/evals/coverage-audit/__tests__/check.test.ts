// scripts/evals/coverage-audit/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the coverage-audit eval's pure core. Verifies:
//   - a data file owned by a pipeline `targets[]` is accounted (not orphan)
//   - a data file owned by `editorial[]` is accounted
//   - a data file owned by nobody is reported as an orphan
//   - a manifest path (target or editorial) absent from disk is reported stale
//   - duplicate targets across pipelines dedupe in `accounted`

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { auditCoverage, type RegistryShape } from '../check.ts';

const REGISTRY: RegistryShape = {
  pipelines: [
    { id: 'policies', targets: ['src/data/policies.ts'] },
    { id: 'videos', targets: ['src/data/videos.ts', 'src/data/video-transcripts.ts'] },
    { id: 'evals', targets: [] },
  ],
  editorial: [
    { file: 'src/data/timeline.ts', reason: 'editorial' },
    { file: 'src/data/updates.ts', reason: 'derived' },
  ],
};

// All manifest-referenced files plus the data dir contents exist by default.
const ON_DISK = new Set([
  'src/data/policies.ts',
  'src/data/videos.ts',
  'src/data/video-transcripts.ts',
  'src/data/timeline.ts',
  'src/data/updates.ts',
]);
const existsIn = (set: Set<string>) => (p: string) => set.has(p);

test('fully-accounted tree → no orphans, no stale', () => {
  const dataFiles = [
    'src/data/policies.ts',
    'src/data/videos.ts',
    'src/data/video-transcripts.ts',
    'src/data/timeline.ts',
    'src/data/updates.ts',
  ];
  const r = auditCoverage(REGISTRY, dataFiles, existsIn(ON_DISK));
  assert.deepEqual(r.orphans, []);
  assert.deepEqual(r.staleManifest, []);
});

test('editorial entry counts as accounted', () => {
  const r = auditCoverage(REGISTRY, ['src/data/timeline.ts'], existsIn(ON_DISK));
  assert.deepEqual(r.orphans, []);
});

test('a data file owned by nobody is an orphan', () => {
  const dataFiles = ['src/data/policies.ts', 'src/data/brand-new.ts'];
  const r = auditCoverage(REGISTRY, dataFiles, existsIn(ON_DISK));
  assert.deepEqual(r.orphans, ['src/data/brand-new.ts']);
  assert.deepEqual(r.staleManifest, []);
});

test('a manifest path absent from disk is stale (renamed/deleted file)', () => {
  // policies.ts removed from disk but still listed as a target.
  const onDisk = new Set(ON_DISK);
  onDisk.delete('src/data/policies.ts');
  const r = auditCoverage(REGISTRY, ['src/data/videos.ts'], existsIn(onDisk));
  assert.equal(r.staleManifest.length, 1);
  assert.equal(r.staleManifest[0].path, 'src/data/policies.ts');
  assert.equal(r.staleManifest[0].source, 'pipeline:policies');
});

test('stale editorial entry is attributed to editorial', () => {
  const onDisk = new Set(ON_DISK);
  onDisk.delete('src/data/timeline.ts');
  const r = auditCoverage(REGISTRY, [], existsIn(onDisk));
  const stale = r.staleManifest.find((s) => s.path === 'src/data/timeline.ts');
  assert.ok(stale);
  assert.equal(stale.source, 'editorial');
});

test('duplicate targets across pipelines dedupe in accounted', () => {
  const reg: RegistryShape = {
    pipelines: [
      { id: 'a', targets: ['src/data/x.ts'] },
      { id: 'b', targets: ['src/data/x.ts'] },
    ],
    editorial: [],
  };
  const r = auditCoverage(reg, ['src/data/x.ts'], () => true);
  assert.deepEqual(r.accounted, ['src/data/x.ts']);
  assert.deepEqual(r.orphans, []);
});

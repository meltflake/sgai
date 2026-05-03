// scripts/lib/__tests__/state.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { loadState, saveState, getDomainState, setDomainState, DEFAULTS } from '../state.ts';

function withTmp<T>(fn: (dir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-state-test-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('loadState: returns DEFAULTS when file does not exist', () => {
  withTmp((dir) => {
    const path = join(dir, 'missing.json');
    const state = loadState(path);
    assert.equal(state.last_run, null);
    assert.equal(state.domains.hansard.max_oral_id, 4087);
    assert.deepEqual(state.domains.policies.maxDates, {});
  });
});

test('loadState: migrates legacy flat schema (videos/voices/hansard at top level)', () => {
  withTmp((dir) => {
    const path = join(dir, 'legacy.json');
    writeFileSync(
      path,
      JSON.stringify({
        last_run: '2026-04-30T08:00:19',
        videos: { video_ids: ['abc'] },
        voices: { urls: ['https://example.com/x'] },
        hansard: { max_oral_id: 4122, max_written_id: 21941 },
      })
    );
    const state = loadState(path);
    assert.equal(state.last_run, '2026-04-30T08:00:19');
    assert.deepEqual(state.domains.videos.video_ids, ['abc']);
    assert.deepEqual(state.domains.voices.urls, ['https://example.com/x']);
    assert.equal(state.domains.hansard.max_oral_id, 4122);
    assert.equal(state.domains.hansard.max_written_id, 21941);
    // New domains fall back to defaults
    assert.deepEqual(state.domains.policies.maxDates, {});
  });
});

test('saveState + loadState: round-trip new schema', () => {
  withTmp((dir) => {
    const path = join(dir, 'round.json');
    const state = structuredClone(DEFAULTS);
    state.domains.policies.maxDates['smartnation.gov.sg'] = '2026-05-15';
    state.domains['github-stars'].lastRun = '2026-05-03';
    saveState(state, { path });

    const reloaded = loadState(path);
    assert.equal(reloaded.domains.policies.maxDates['smartnation.gov.sg'], '2026-05-15');
    assert.equal(reloaded.domains['github-stars'].lastRun, '2026-05-03');
    assert.notEqual(reloaded.last_run, null);
  });
});

test('saveState: keepRun preserves existing last_run', () => {
  withTmp((dir) => {
    const path = join(dir, 'keeprun.json');
    const state = structuredClone(DEFAULTS);
    state.last_run = '2026-01-01T00:00:00.000Z';
    saveState(state, { path, keepRun: true });
    const reloaded = loadState(path);
    assert.equal(reloaded.last_run, '2026-01-01T00:00:00.000Z');
  });
});

test('getDomainState: returns deep clone of defaults for unknown domain', () => {
  const state = structuredClone(DEFAULTS);
  const policies = getDomainState(state, 'policies');
  policies.maxDates['x.gov.sg'] = '2026-05-01';
  const stillEmpty = getDomainState(structuredClone(DEFAULTS), 'policies');
  assert.deepEqual(stillEmpty.maxDates, {});
});

test('setDomainState: writes back into state object', () => {
  const state = structuredClone(DEFAULTS);
  setDomainState(state, 'policies', { maxDates: { 'mas.gov.sg': '2026-06-01' } });
  assert.equal(state.domains.policies.maxDates['mas.gov.sg'], '2026-06-01');
});

test('loadState: forward-compatible with unknown domains in file', () => {
  withTmp((dir) => {
    const path = join(dir, 'unknown.json');
    writeFileSync(
      path,
      JSON.stringify({
        domains: {
          'future-pipeline': { custom: 'value' },
          policies: { maxDates: { 'a.gov.sg': '2026-05-01' } },
        },
      })
    );
    const state = loadState(path);
    assert.equal((state.domains as Record<string, { custom?: string }>)['future-pipeline'].custom, 'value');
    assert.equal(state.domains.policies.maxDates['a.gov.sg'], '2026-05-01');
  });
});

test('loadState: malformed JSON throws clearly', () => {
  withTmp((dir) => {
    const path = join(dir, 'bad.json');
    writeFileSync(path, '{ not json');
    assert.throws(() => loadState(path), /Failed to parse/);
  });
});

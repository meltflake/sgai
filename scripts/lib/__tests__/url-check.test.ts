// scripts/lib/__tests__/url-check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Contract for url-check's status classification — the two pure predicates
// that decide (a) whether a URL counts as reachable and (b) whether a result
// is transient and worth retrying. The retry loop itself (checkWithRetry) is
// network-bound and exercised by the live url-health eval; here we lock the
// classification so a slow-but-live URL can never be a hard "broken" again.
//
// Regression context (2026-06-30): the weekly url-health eval intermittently
// flagged live URLs broken — a slow homepage (200 in 3–6 s) timed out under
// concurrent load → ERR:TypeError, and a big site blipped a 500. Both are
// transient; retrying clears them. A 404 must stay deterministically broken.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isReachable, isTransient } from '../url-check.ts';

test('isReachable: 2xx/3xx are reachable', () => {
  for (const s of [200, 204, 301, 302, 308, 399]) assert.equal(isReachable(s), true, `${s}`);
});

test('isReachable: anti-bot walls are soft-passed', () => {
  for (const s of [401, 403, 429, 999]) assert.equal(isReachable(s), true, `${s}`);
});

test('isReachable: 404/410/5xx and fetch errors are not reachable', () => {
  for (const s of [404, 410, 500, 503]) assert.equal(isReachable(s), false, `${s}`);
  assert.equal(isReachable('ERR:TypeError'), false);
  assert.equal(isReachable('ERR:AbortError'), false);
});

test('isTransient: fetch errors and 5xx are retryable', () => {
  assert.equal(isTransient('ERR:TypeError'), true);
  assert.equal(isTransient('ERR:AbortError'), true);
  assert.equal(isTransient('ERR:fetch'), true);
  for (const s of [500, 502, 503, 504]) assert.equal(isTransient(s), true, `${s}`);
});

test('isTransient: 4xx and success are deterministic (never retried)', () => {
  for (const s of [200, 301, 401, 403, 404, 410, 429]) assert.equal(isTransient(s), false, `${s}`);
});

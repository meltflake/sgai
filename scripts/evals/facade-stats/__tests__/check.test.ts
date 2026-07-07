// scripts/evals/facade-stats/__tests__/check.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the facade-stats eval's pure core. Verifies:
//   - claimed numbers are normalized ('1,024', '650+') before comparison
//   - a claim that matches the ground truth passes; a drifted one fails
//   - EVERY occurrence of a claim is checked (139 vs 179 in one file was
//     the original bug — two generations of the same number coexisting)
//   - a pattern that stops matching fails loudly instead of going silent
//   - the About page must keep its data-file interpolations, per locale

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { auditAboutSource, auditReadme, normalizeCount, type FacadeTruth } from '../check.ts';

const TRUTH: FacadeTruth = {
  debates: 179,
  policies: 44,
  startups: 548,
  unicorns: 9,
  economies: 10,
  trackerMetrics: 83,
};

test('normalizeCount: strips separators and trailing plus', () => {
  assert.equal(normalizeCount('548'), 548);
  assert.equal(normalizeCount('1,024'), 1024);
  assert.equal(normalizeCount('650+'), 650);
});

test('auditReadme: matching claims pass, drifted claims fail with expected value', () => {
  const readme = ['- 179 场议会辩论的中文摘要', '- summaries of 139 parliamentary debates'].join('\n');
  const claims = [
    { metric: 'debates' as const, label: 'zh', pattern: /(\d[\d,]*)\s*场议会辩论/g },
    { metric: 'debates' as const, label: 'en', pattern: /(\d[\d,]*)\s+parliamentary debates/g },
  ];
  const findings = auditReadme(readme, TRUTH, claims);
  assert.equal(findings.length, 2);
  assert.equal(findings[0].ok, true);
  assert.equal(findings[1].ok, false);
  assert.match(findings[1].detail, /ground truth is 179/);
});

test('auditReadme: every occurrence is checked — stale duplicate in the same file fails', () => {
  // The original bug shape: the same zh claim appearing twice with two values.
  const readme = ['- 139 场议会辩论（旧段落）', '- 179 场议会辩论（新段落）'].join('\n');
  const claims = [{ metric: 'debates' as const, label: 'zh', pattern: /(\d[\d,]*)\s*场议会辩论/g }];
  const findings = auditReadme(readme, TRUTH, claims);
  assert.equal(findings.length, 2);
  assert.deepEqual(
    findings.map((f) => f.ok),
    [false, true],
  );
});

test('auditReadme: a claim whose pattern matches nothing fails loudly', () => {
  const claims = [{ metric: 'policies' as const, label: 'zh', pattern: /(\d[\d,]*)\s*份政策文档/g }];
  const findings = auditReadme('reworded copy with no number', TRUTH, claims);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].ok, false);
  assert.match(findings[0].detail, /matched nothing/);
});

test('auditReadme: is re-runnable on the same shared claims array (lastIndex reset)', () => {
  const readme = '- 179 场议会辩论';
  const claims = [{ metric: 'debates' as const, label: 'zh', pattern: /(\d[\d,]*)\s*场议会辩论/g }];
  assert.equal(auditReadme(readme, TRUTH, claims)[0].ok, true);
  assert.equal(auditReadme(readme, TRUTH, claims)[0].ok, true);
});

test('auditAboutSource: interpolations present at required multiplicity pass', () => {
  const src = [
    'const debateCount = debates.length;',
    'zh: `${debateCount} 场`',
    'en: `${debateCount} records`',
    'ja: `${debateCount} 件`',
  ].join('\n');
  const findings = auditAboutSource(src, [
    { snippet: 'debates.length', minCount: 1, why: 'from data' },
    { snippet: '${debateCount}', minCount: 3, why: 'per locale' },
  ]);
  assert.deepEqual(
    findings.map((f) => f.ok),
    [true, true],
  );
});

test('auditAboutSource: a locale dropping its interpolation fails', () => {
  const src = ['const debateCount = debates.length;', 'zh: `${debateCount} 场`', 'en: `150 records`'].join('\n');
  const findings = auditAboutSource(src, [{ snippet: '${debateCount}', minCount: 3, why: 'per locale' }]);
  assert.equal(findings[0].ok, false);
  assert.match(findings[0].detail, /found 1×, expected ≥3/);
});

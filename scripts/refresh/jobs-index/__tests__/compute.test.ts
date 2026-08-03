// Unit tests for the AI Jobs Index aggregation core. The methodology is
// frozen (METHODOLOGY_VERSION 1) — these tests pin its exact semantics so
// a refactor cannot silently change the series definition.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  salaryMidpoint,
  salaryStats,
  nearestRank,
  dedupByUuid,
  topEmployers,
  classifyRoleByRules,
  roleTypeCounts,
  MIN_DISCLOSED_FOR_PERCENTILES,
  type McfJob,
} from '../compute.ts';

const job = (over: Partial<McfJob>): McfJob => ({ uuid: 'u', title: 't', ...over });
const monthly = (min: number, max: number): McfJob =>
  job({ salary: { minimum: min, maximum: max, type: { salaryType: 'Monthly' } } });

// ── salaryMidpoint ──────────────────────────────────────────────────────

test('midpoint: monthly disclosed range → (min+max)/2', () => {
  assert.equal(salaryMidpoint(monthly(8000, 12000)), 10000);
});

test('midpoint guards: non-monthly, absurd ranges and outliers are rejected', () => {
  assert.equal(salaryMidpoint(job({ salary: { minimum: 90000, maximum: 120000, type: { salaryType: 'Annual' } } })), null);
  assert.equal(salaryMidpoint(monthly(0, 5000)), null); // min <= 0
  assert.equal(salaryMidpoint(monthly(6000, 4000)), null); // max < min
  assert.equal(salaryMidpoint(monthly(1000, 30000)), null); // ratio > 10
  assert.equal(salaryMidpoint(monthly(100, 500)), null); // below S$800 floor
  assert.equal(salaryMidpoint(monthly(70000, 80000)), null); // above S$60k cap
  assert.equal(salaryMidpoint(job({})), null); // undisclosed
});

// ── nearestRank ─────────────────────────────────────────────────────────

test('nearest-rank percentiles are deterministic and S$10-rounded', () => {
  const sorted = [1004, 2000, 3000, 4000];
  assert.equal(nearestRank(sorted, 25), 1000); // rank ceil(0.25*4)=1 → 1004 → 1000
  assert.equal(nearestRank(sorted, 50), 2000);
  assert.equal(nearestRank(sorted, 75), 3000);
  assert.equal(nearestRank(sorted, 100), 4000);
});

// ── salaryStats small-sample suppression ────────────────────────────────

test(`percentiles are null under ${MIN_DISCLOSED_FOR_PERCENTILES} disclosed samples`, () => {
  const jobs = Array.from({ length: 10 }, () => monthly(5000, 7000));
  const s = salaryStats(jobs);
  assert.equal(s.disclosedCount, 10);
  assert.equal(s.median, null);
  assert.equal(s.p25, null);
});

test('salaryStats at threshold publishes percentiles and rate', () => {
  const jobs = [
    ...Array.from({ length: 30 }, (_, i) => monthly(4000 + i * 100, 6000 + i * 100)),
    ...Array.from({ length: 10 }, () => job({})), // undisclosed
  ];
  const s = salaryStats(jobs);
  assert.equal(s.disclosedCount, 30);
  assert.equal(s.disclosureRate, 0.75);
  assert.ok(s.median !== null && s.median % 10 === 0);
});

// ── dedup ───────────────────────────────────────────────────────────────

test('dedupByUuid unions batches, first occurrence wins', () => {
  const a = [job({ uuid: '1', title: 'A' }), job({ uuid: '2' })];
  const b = [job({ uuid: '1', title: 'B' }), job({ uuid: '3' })];
  const merged = dedupByUuid([a, b]);
  assert.equal(merged.length, 3);
  assert.equal(merged.find((j) => j.uuid === '1')!.title, 'A');
});

// ── topEmployers ────────────────────────────────────────────────────────

test('topEmployers normalizes casing/whitespace and keeps dominant casing', () => {
  const jobs = [
    job({ uuid: 'a', postedCompany: { name: 'DBS Bank' } }),
    job({ uuid: 'b', postedCompany: { name: 'DBS  BANK' } }),
    job({ uuid: 'c', postedCompany: { name: 'DBS Bank' } }),
    job({ uuid: 'd', postedCompany: { name: 'GovTech' } }),
  ];
  const top = topEmployers(jobs);
  assert.deepEqual(top[0], { employer: 'DBS Bank', openings: 3 });
  assert.deepEqual(top[1], { employer: 'GovTech', openings: 1 });
});

// ── role rules ──────────────────────────────────────────────────────────

test('role rules: precedence and coverage', () => {
  assert.equal(classifyRoleByRules('Senior AI Research Scientist'), 'research');
  assert.equal(classifyRoleByRules('Machine Learning Engineer'), 'data');
  assert.equal(classifyRoleByRules('Data Analyst, AI Products'), 'data');
  assert.equal(classifyRoleByRules('Backend Engineer (AI Platform)'), 'engineering');
  assert.equal(classifyRoleByRules('AI Product Manager'), 'product');
  assert.equal(classifyRoleByRules('AI Solutions Consultant'), 'gtm');
  assert.equal(classifyRoleByRules('Chief AI Officer'), null); // leftover → LLM
});

test('roleTypeCounts aggregates in stable display order', () => {
  const counts = roleTypeCounts(['data', 'engineering', 'data', 'ops-other']);
  assert.deepEqual(counts, [
    { roleType: 'engineering', count: 1 },
    { roleType: 'data', count: 2 },
    { roleType: 'ops-other', count: 1 },
  ]);
});

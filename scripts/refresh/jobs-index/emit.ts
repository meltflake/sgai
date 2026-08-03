// scripts/refresh/jobs-index/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Splice one JobsIndexSnapshot literal into src/data/ai-jobs-index.ts.
// Newest-first array order (matches the repo's other data files).
//
// Both array forms are handled: the prettier empty one-liner `= [];` AND
// the populated multi-line form — the 2026-07-28 appendAutoDiscovered
// incident (PR #170, ts(2451) duplicate export) came from a regex that
// only matched the multi-line form. See memory note
// sgai-empty-autodiscovered-oneliner-trap.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatWithPrettier } from '../../lib/prettier-format.ts';
import type { JobsIndexSnapshot } from '../../../src/data/ai-jobs-index.ts';

const TARGET = resolve('src/data/ai-jobs-index.ts');

function fmtEmployers(rows: JobsIndexSnapshot['topEmployers']): string {
  return rows
    .map((r) => `      { employer: '${r.employer.replace(/'/g, "\\'")}', openings: ${r.openings} },`)
    .join('\n');
}

function fmtRoleTypes(rows: JobsIndexSnapshot['roleTypes']): string {
  return rows.map((r) => `      { roleType: '${r.roleType}', count: ${r.count} },`).join('\n');
}

function fmtQueryTotals(qt: Record<string, number>): string {
  return Object.entries(qt)
    .map(([q, n]) => `      '${q.replace(/'/g, "\\'")}': ${n},`)
    .join('\n');
}

export function formatSnapshot(s: JobsIndexSnapshot): string {
  return [
    '  {',
    `    month: '${s.month}',`,
    `    capturedAt: '${s.capturedAt}',`,
    `    addedAt: '${s.addedAt}',`,
    `    totalOpenings: ${s.totalOpenings},`,
    '    queryTotals: {',
    fmtQueryTotals(s.queryTotals),
    '    },',
    `    salaryDisclosureRate: ${s.salaryDisclosureRate},`,
    `    disclosedCount: ${s.disclosedCount},`,
    `    salaryMidpointP25: ${s.salaryMidpointP25},`,
    `    salaryMidpointMedian: ${s.salaryMidpointMedian},`,
    `    salaryMidpointP75: ${s.salaryMidpointP75},`,
    '    topEmployers: [',
    fmtEmployers(s.topEmployers),
    '    ],',
    '    roleTypes: [',
    fmtRoleTypes(s.roleTypes),
    '    ],',
    `    sourceUrl: '${s.sourceUrl}',`,
    '  },',
  ].join('\n');
}

export function emitSnapshot(snapshot: JobsIndexSnapshot): { written: boolean; reason?: string } {
  const original = readFileSync(TARGET, 'utf8');
  if (original.includes(`month: '${snapshot.month}'`)) {
    return { written: false, reason: 'already-captured' };
  }
  const formatted = formatSnapshot(snapshot);

  const emptyRe = /export const jobsIndexSnapshots: JobsIndexSnapshot\[\] = \[\s*\];/;
  const populatedRe = /export const jobsIndexSnapshots: JobsIndexSnapshot\[\] = \[\n/;

  let updated: string;
  if (emptyRe.test(original)) {
    updated = original.replace(
      emptyRe,
      `export const jobsIndexSnapshots: JobsIndexSnapshot[] = [\n${formatted}\n];`
    );
  } else if (populatedRe.test(original)) {
    // Insert at the head — newest first.
    updated = original.replace(
      populatedRe,
      `export const jobsIndexSnapshots: JobsIndexSnapshot[] = [\n${formatted}\n`
    );
  } else {
    throw new Error('jobsIndexSnapshots array not found in ai-jobs-index.ts');
  }

  writeFileSync(TARGET, updated);
  formatWithPrettier(TARGET);
  return { written: true };
}

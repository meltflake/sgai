// scripts/refresh/jobs-index/compute.ts
// ────────────────────────────────────────────────────────────────────────
// Pure aggregation logic for the AI Jobs Index — everything deterministic
// lives here so it can be unit-tested without network or LLM. The
// methodology is FROZEN (see src/data/ai-jobs-index.ts header); changes
// require a METHODOLOGY_VERSION bump and break series comparability.

import type { RoleTypeId } from '../../../src/data/ai-jobs-index.ts';

/** Subset of the MyCareersFuture job payload we consume. */
export interface McfJob {
  uuid: string;
  title: string;
  postedCompany?: { name?: string } | null;
  salary?: {
    minimum?: number | null;
    maximum?: number | null;
    type?: { salaryType?: string } | null;
  } | null;
}

// ── Salary midpoints ────────────────────────────────────────────────────

/** Outlier guards, documented in the data-file methodology header. */
const MIDPOINT_MIN = 800;
const MIDPOINT_MAX = 60000;
const MAX_RANGE_RATIO = 10;

/** Usable disclosed midpoint for one job, or null. Monthly salaries only —
 *  mixing annual/monthly units would corrupt the series. */
export function salaryMidpoint(job: McfJob): number | null {
  const s = job.salary;
  if (!s || typeof s.minimum !== 'number' || typeof s.maximum !== 'number') return null;
  if (s.type?.salaryType && s.type.salaryType !== 'Monthly') return null;
  const { minimum, maximum } = s;
  if (minimum <= 0 || maximum < minimum) return null;
  if (maximum / minimum > MAX_RANGE_RATIO) return null;
  const mid = (minimum + maximum) / 2;
  if (mid < MIDPOINT_MIN || mid > MIDPOINT_MAX) return null;
  return mid;
}

/** Nearest-rank percentile (deterministic, no interpolation), rounded to
 *  the nearest S$10. sorted must be ascending and non-empty. */
export function nearestRank(sorted: number[], p: number): number {
  const rank = Math.max(1, Math.ceil((p / 100) * sorted.length));
  return Math.round(sorted[rank - 1] / 10) * 10;
}

export interface SalaryStats {
  disclosedCount: number;
  disclosureRate: number;
  p25: number | null;
  median: number | null;
  p75: number | null;
}

/** Percentiles are published only at disclosedCount >= 30 — below that the
 *  numbers are noise wearing precision. */
export const MIN_DISCLOSED_FOR_PERCENTILES = 30;

export function salaryStats(jobs: McfJob[]): SalaryStats {
  const midpoints = jobs
    .map(salaryMidpoint)
    .filter((m): m is number => m !== null)
    .sort((a, b) => a - b);
  const disclosedCount = midpoints.length;
  const disclosureRate = jobs.length === 0 ? 0 : Number((disclosedCount / jobs.length).toFixed(3));
  if (disclosedCount < MIN_DISCLOSED_FOR_PERCENTILES) {
    return { disclosedCount, disclosureRate, p25: null, median: null, p75: null };
  }
  return {
    disclosedCount,
    disclosureRate,
    p25: nearestRank(midpoints, 25),
    median: nearestRank(midpoints, 50),
    p75: nearestRank(midpoints, 75),
  };
}

// ── Dedup across the query basket ───────────────────────────────────────

export function dedupByUuid(batches: McfJob[][]): McfJob[] {
  const seen = new Map<string, McfJob>();
  for (const batch of batches) {
    for (const job of batch) {
      if (job.uuid && !seen.has(job.uuid)) seen.set(job.uuid, job);
    }
  }
  return [...seen.values()];
}

// ── Top employers ───────────────────────────────────────────────────────

/** Normalization key: trimmed, whitespace-collapsed, case-insensitive.
 *  Display name = the most frequent original casing. Recruiters stay in
 *  v1; AGENCY_DENYLIST grows via PR review when they crowd the table. */
export const AGENCY_DENYLIST: string[] = [];

export function topEmployers(jobs: McfJob[], limit = 10): Array<{ employer: string; openings: number }> {
  const groups = new Map<string, { casings: Map<string, number>; count: number }>();
  for (const job of jobs) {
    const raw = (job.postedCompany?.name || '').replace(/\s+/g, ' ').trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (AGENCY_DENYLIST.includes(key)) continue;
    const g = groups.get(key) ?? { casings: new Map(), count: 0 };
    g.count += 1;
    g.casings.set(raw, (g.casings.get(raw) ?? 0) + 1);
    groups.set(key, g);
  }
  return [...groups.values()]
    .map((g) => ({
      employer: [...g.casings.entries()].sort((a, b) => b[1] - a[1])[0][0],
      openings: g.count,
    }))
    .sort((a, b) => b.openings - a.openings || a.employer.localeCompare(b.employer))
    .slice(0, limit);
}

// ── Role types ──────────────────────────────────────────────────────────

/** Deterministic first pass; order matters (first match wins). Titles the
 *  rules can't place return null and go to the batched LLM fallback. */
const ROLE_RULES: Array<{ re: RegExp; role: RoleTypeId }> = [
  { re: /(research|scientist(?!.*data)|phd|postdoc)/i, role: 'research' },
  { re: /(data (scientist|analyst|engineer)|analytics|machine learning engineer|\bml\b.*(engineer|ops)|mlops)/i, role: 'data' },
  { re: /(engineer|developer|architect|devops|sre|programmer|full.?stack|backend|frontend)/i, role: 'engineering' },
  { re: /(product (manager|owner|lead)|\bpm\b|programme? manager)/i, role: 'product' },
  { re: /(sales|marketing|business development|account (manager|executive)|consultant|pre.?sales|partnership)/i, role: 'gtm' },
];

export function classifyRoleByRules(title: string): RoleTypeId | null {
  for (const { re, role } of ROLE_RULES) {
    if (re.test(title)) return role;
  }
  return null;
}

export function roleTypeCounts(assignments: RoleTypeId[]): Array<{ roleType: RoleTypeId; count: number }> {
  const counts = new Map<RoleTypeId, number>();
  for (const r of assignments) counts.set(r, (counts.get(r) ?? 0) + 1);
  const ORDER: RoleTypeId[] = ['engineering', 'research', 'data', 'product', 'gtm', 'ops-other'];
  return ORDER.filter((r) => counts.has(r)).map((roleType) => ({ roleType, count: counts.get(roleType)! }));
}

// ── Sanity bound ────────────────────────────────────────────────────────

/** A throttled or broken sweep must never enter the series — one bad
 *  snapshot silently corrupts every chart drawn over it. Single-query
 *  baseline was 472 (2026-08); the basket union can only be larger. */
export const MIN_PLAUSIBLE_TOTAL = 100;

// src/data/ai-jobs-index.ts
// ────────────────────────────────────────────────────────────────────────
// Singapore AI Jobs Index — monthly aggregate snapshots of live AI job
// postings on MyCareersFuture (Workforce Singapore's official portal).
//
// WHY THIS EXISTS (2026-08-03 source-expansion plan): nobody publishes a
// monthly AI-hiring series for Singapore. The API only exposes CURRENT
// listings — history cannot be collected retroactively, so every month
// captured is permanently exclusive data. Snapshots are IMMUTABLE: past
// months are never recomputed (the series is only meaningful if frozen).
//
// METHODOLOGY (v1 — frozen; bump METHODOLOGY_VERSION if it ever changes,
// and never compare across versions on the same chart):
//   - Query basket: QUERY_BASKET below, union'd, dedup by job uuid.
//   - Salary stats: only jobs with a disclosed Monthly salary range where
//     0 < min <= max; midpoint = (min+max)/2; outlier guard drops
//     midpoints outside [S$800, S$60,000]/month or ranges with
//     max/min > 10; percentiles are nearest-rank on sorted midpoints,
//     rounded to the nearest S$10; null when disclosedCount < 30.
//   - Top employers: normalized postedCompany.name, top 10 by openings.
//   - Role types: deterministic keyword pass over titles; leftovers
//     classified by one batched LLM call (see pipeline compute.ts).
//
// AGGREGATES ONLY — no individual listings are republished (they expire;
// the observatory value is the trend). Written by
// scripts/refresh/jobs-index/ (monthly auto-PR). Rendering:
//   - /talent "demand side" section (TalentIndex.astro)
//   - /tracker talent dimension via jobsIndexMetricRow() — render-time
//     derivation, no duplicated numbers in tracker.ts.
//
// i18n note: field names deliberately avoid title/summary/description and
// values carry no CJK literals, so this file has no translation
// obligations; display labels live as 4-lang dict keys (rule #13).

import type { MetricRow } from '~/data/tracker';

export const METHODOLOGY_VERSION = 1;

/** Frozen query basket — changing this breaks series comparability. */
export const QUERY_BASKET = ['artificial intelligence', 'machine learning', 'LLM', 'AI engineer'] as const;

export type RoleTypeId = 'engineering' | 'research' | 'data' | 'product' | 'gtm' | 'ops-other';

export interface JobsIndexSnapshot {
  /** 'YYYY-MM' — the record id; one snapshot per calendar month. */
  month: string;
  /** YYYY-MM-DD the API sweep ran. */
  capturedAt: string;
  /** YYYY-MM-DD the record entered the repo (rule #7). */
  addedAt: string;
  /** uuid-dedup'd union across the query basket. */
  totalOpenings: number;
  /** Per-query raw totals BEFORE dedup — drift debugging. */
  queryTotals: Record<string, number>;
  /** Share of openings with a usable disclosed Monthly salary range, 0-1. */
  salaryDisclosureRate: number;
  /** Sample size behind the percentiles. */
  disclosedCount: number;
  /** SGD/month, nearest-rank percentiles of range midpoints; null when
   *  disclosedCount < 30. */
  salaryMidpointP25: number | null;
  salaryMidpointMedian: number | null;
  salaryMidpointP75: number | null;
  topEmployers: Array<{ employer: string; openings: number }>;
  roleTypes: Array<{ roleType: RoleTypeId; count: number }>;
  /** Human-visitable search URL (url-health checked). */
  sourceUrl: string;
}

export const jobsIndexSnapshots: JobsIndexSnapshot[] = [
  {
    month: '2026-08',
    capturedAt: '2026-08-03',
    addedAt: '2026-08-03',
    totalOpenings: 1475,
    queryTotals: {
      'artificial intelligence': 474,
      'machine learning': 791,
      LLM: 393,
      'AI engineer': 396,
    },
    salaryDisclosureRate: 0.995,
    disclosedCount: 1467,
    salaryMidpointP25: 6000,
    salaryMidpointMedian: 8000,
    salaryMidpointP75: 10500,
    topEmployers: [
      { employer: 'TIKTOK PTE. LTD.', openings: 64 },
      { employer: 'RN CARE PTE. LTD.', openings: 57 },
      { employer: 'BYTEDANCE PTE. LTD.', openings: 55 },
      { employer: 'NANYANG TECHNOLOGICAL UNIVERSITY', openings: 53 },
      { employer: 'ITCAN PTE. LIMITED', openings: 52 },
      { employer: 'GOOGLE ASIA PACIFIC PTE. LTD.', openings: 49 },
      { employer: 'NATIONAL UNIVERSITY OF SINGAPORE', openings: 37 },
      { employer: 'FLINTEX CONSULTING PTE. LTD.', openings: 16 },
      { employer: 'HYPERSCAL SOLUTIONS PTE. LTD.', openings: 16 },
      { employer: 'MICRON SEMICONDUCTOR ASIA OPERATIONS PTE. LTD.', openings: 16 },
    ],
    roleTypes: [
      { roleType: 'engineering', count: 748 },
      { roleType: 'research', count: 303 },
      { roleType: 'data', count: 195 },
      { roleType: 'product', count: 29 },
      { roleType: 'gtm', count: 95 },
      { roleType: 'ops-other', count: 105 },
    ],
    sourceUrl: 'https://www.mycareersfuture.gov.sg/search?search=artificial%20intelligence&sortBy=relevancy',
  },
];

/** Newest snapshot by month, or undefined before the first capture. */
export function latestJobsSnapshot(): JobsIndexSnapshot | undefined {
  let latest: JobsIndexSnapshot | undefined;
  for (const s of jobsIndexSnapshots) {
    if (!latest || s.month > latest.month) latest = s;
  }
  return latest;
}

/** Snapshot immediately preceding the latest (for MoM deltas). */
export function previousJobsSnapshot(): JobsIndexSnapshot | undefined {
  const latest = latestJobsSnapshot();
  if (!latest) return undefined;
  let prev: JobsIndexSnapshot | undefined;
  for (const s of jobsIndexSnapshots) {
    if (s.month >= latest.month) continue;
    if (!prev || s.month > prev.month) prev = s;
  }
  return prev;
}

const SGD = (n: number) => `S$${n.toLocaleString('en-SG')}`;

/** Render-time metric row for the /tracker talent dimension. The 4-lang
 *  name/source labels are declared once here (literal siblings satisfy
 *  i18n alignment); values are assembled at runtime from the latest
 *  snapshot so tracker.ts never duplicates the numbers. Returns null
 *  before the first capture — the tracker row simply doesn't render. */
/** Array form for direct spread into a dimension's metrics literal —
 *  empty before the first capture, so the tracker row simply absent. */
export function jobsIndexMetricRows(): MetricRow[] {
  const row = jobsIndexMetricRow();
  return row ? [row] : [];
}

export function jobsIndexMetricRow(): MetricRow | null {
  const s = latestJobsSnapshot();
  if (!s) return null;
  const salaryPart = s.salaryMidpointMedian ? `${SGD(s.salaryMidpointMedian)}/月中位` : '';
  const salaryPartEn = s.salaryMidpointMedian ? `${SGD(s.salaryMidpointMedian)}/mo median` : '';
  return {
    name: '在招 AI 职位（MyCareersFuture 月度快照）',
    nameEn: 'Open AI job postings (MyCareersFuture monthly snapshot)',
    nameJa: 'AI 求人掲載数（MyCareersFuture 月次スナップショット）',
    nameKo: 'AI 채용 공고 수(MyCareersFuture 월간 스냅샷)',
    value: `${s.totalOpenings.toLocaleString('en-SG')} 个${salaryPart ? ` · ${salaryPart}` : ''}`,
    valueEn: `${s.totalOpenings.toLocaleString('en-SG')}${salaryPartEn ? ` · ${salaryPartEn}` : ''}`,
    valueJa: `${s.totalOpenings.toLocaleString('en-SG')} 件${salaryPart ? ` · ${SGD(s.salaryMidpointMedian!)} /月中央値` : ''}`,
    valueKo: `${s.totalOpenings.toLocaleString('en-SG')}건${salaryPart ? ` · 중위 ${SGD(s.salaryMidpointMedian!)}/월` : ''}`,
    source: `MyCareersFuture，${s.month} 快照（站方汇总）`,
    sourceEn: `MyCareersFuture, ${s.month} snapshot (our aggregation)`,
    sourceJa: `MyCareersFuture、${s.month} スナップショット（当サイト集計）`,
    sourceKo: `MyCareersFuture, ${s.month} 스냅샷(사이트 집계)`,
    sourceUrl: s.sourceUrl,
  };
}

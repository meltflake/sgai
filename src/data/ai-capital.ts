// src/data/ai-capital.ts
// ────────────────────────────────────────────────────────────────────────
// Capital & infrastructure ledger — the money behind Singapore AI (P1-1).
//
// WHY: the US$26B hyperscaler commitments, sovereign stakes in frontier
// labs, and the S$1→S$13 amplification ratio lived inside benchmarking
// prose (`assessment` strings) and scattered ecosystem entities — citable
// prose, not usable data. This file makes each capital event a first-class
// record with a date, an amount, and a verified source, and derives the
// amplification ratio at render time instead of hand-copying the 13×.
//
// SCHEMA DESIGN RULES:
//   - `parties` are Latin proper nouns ONLY (GIC / Temasek / Anthropic …).
//     Zero CJK in this file = zero translation burden (rule #13's spirit;
//     all display labels come from the t() dictionary in the UI).
//   - Every record carries `sourceUrl` verified HTTP-reachable at write
//     time (rule #6) and `addedAt` (rule #7).
//   - Registry ownership: editorial (see scripts/refresh/registry.json
//     `editorial[]`); future pipeline can claim it by adding a targets
//     entry.
//
// Rendering:
//   - /ecosystem "资本与基础设施" section (CapitalSection.astro)
//   - /tracker investment dimension via capitalMetricRows() — render-time
//     derivation, tracker.ts never duplicates these numbers.
//
// AMOUNT SEMANTICS: amountUsd/amountSgd carry the disclosed figure for the
// EVENT (round size / JV size / commitment total), NOT a party's share —
// GIC's stake in each round is undisclosed. `isFloor` marks "≥" figures.

import type { MetricRow } from '~/data/tracker';

export type CapitalKind = 'hyperscaler-commitment' | 'sovereign-investment' | 'fund';

export type AmountType =
  | 'round'
  | 'commitment'
  | 'exposure'
  | 'joint-venture'
  | 'cumulative'
  | 'envelope'
  | 'undisclosed';

export interface CapitalRecord {
  /** Stable slug id. */
  id: string;
  kind: CapitalKind;
  /** Announcement date: 'YYYY' / 'YYYY-MM' / 'YYYY-MM-DD' — the precision the source discloses. */
  announcedAt: string;
  /** USD, for USD-denominated events. */
  amountUsd?: number;
  /** SGD, for SGD-denominated events. */
  amountSgd?: number;
  /** The disclosed figure is a floor ("+" / ">"). */
  isFloor?: boolean;
  amountType: AmountType;
  /** Latin proper nouns only — participant names, no CJK. */
  parties: string[];
  /** Optional reference to an ecosystem entity for the deep-dive page. */
  ecosystemEntityId?: string;
  sourceUrl: string;
  addedAt: string;
}

export const capitalRecords: CapitalRecord[] = [
  {
    id: 'nais2-government-envelope',
    kind: 'fund',
    announcedAt: '2023-12',
    amountSgd: 2_000_000_000,
    isFloor: true,
    amountType: 'envelope',
    parties: ['Singapore Government'],
    sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
    addedAt: '2026-08-14',
  },
  {
    id: 'aisg-nrf-cumulative',
    kind: 'fund',
    announcedAt: '2017',
    amountSgd: 500_000_000,
    isFloor: true,
    amountType: 'cumulative',
    parties: ['AISG', 'NRF'],
    sourceUrl: 'https://aisingapore.org/',
    addedAt: '2026-08-14',
  },
  {
    id: 'hyperscaler-sg-commitments',
    kind: 'hyperscaler-commitment',
    announcedAt: '2025',
    amountUsd: 26_000_000_000,
    isFloor: true,
    amountType: 'commitment',
    parties: ['Microsoft', 'Google', 'AWS', 'Equinix', 'NVIDIA'],
    sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
    addedAt: '2026-08-14',
  },
  {
    id: 'gic-equinix-cpp-jv',
    kind: 'sovereign-investment',
    announcedAt: '2024-10',
    amountUsd: 15_000_000_000,
    isFloor: true,
    amountType: 'joint-venture',
    parties: ['GIC', 'Equinix', 'CPP Investments'],
    sourceUrl:
      'https://www.gic.com.sg/newsroom/all/equinix-agrees-to-form-greater-than-15b-jv-to-expand-hyperscale-data-centers-in-the-u-s-and-support-growing-ai-and-cloud-innovation/',
    addedAt: '2026-08-14',
  },
  {
    id: 'temasek-openai',
    kind: 'sovereign-investment',
    announcedAt: '2025',
    amountType: 'undisclosed',
    parties: ['Temasek', 'OpenAI'],
    ecosystemEntityId: 'openai',
    sourceUrl: 'https://www.temasekreview.com.sg/',
    addedAt: '2026-08-14',
  },
  {
    id: 'gic-anthropic-series-g',
    kind: 'sovereign-investment',
    announcedAt: '2026-02',
    amountUsd: 30_000_000_000,
    amountType: 'round',
    parties: ['GIC', 'Coatue', 'Anthropic'],
    sourceUrl: 'https://www.gic.com.sg/newsroom/all/gic-leads-30-billion-series-g-in-anthropic/',
    addedAt: '2026-08-14',
  },
  {
    id: 'gic-anthropic-series-h',
    kind: 'sovereign-investment',
    announcedAt: '2026-05',
    amountUsd: 65_000_000_000,
    amountType: 'round',
    parties: ['GIC', 'Anthropic'],
    sourceUrl:
      'https://www.gic.com.sg/newsroom/all/anthropic-raises-65b-in-series-h-funding-at-965b-post-money-valuation/',
    addedAt: '2026-08-14',
  },
  {
    id: 'temasek-ai-exposure',
    kind: 'fund',
    announcedAt: '2026-07-08',
    amountSgd: 31_000_000_000,
    amountType: 'exposure',
    parties: ['Temasek'],
    sourceUrl: 'https://www.temasekreview.com.sg/',
    addedAt: '2026-08-14',
  },
  {
    id: 'theseus-infrastructure',
    kind: 'sovereign-investment',
    announcedAt: '2026-08',
    amountType: 'undisclosed',
    parties: ['GIC', 'Macquarie Asset Management', 'Anthropic'],
    ecosystemEntityId: 'theseus-infrastructure',
    sourceUrl:
      'https://www.businesstimes.com.sg/startups-tech/technology/anthropic-macquarie-and-gic-form-venture-ai-data-centres',
    addedAt: '2026-08-14',
  },
];

export interface AmplificationRatio {
  /** Private (USD) per 1 unit of government (SGD) — nominal, no FX. */
  ratio: number;
  governmentSgd: number;
  privateUsd: number;
}

/**
 * The S$1→S$13 story, derived at render time. Numerator: the aggregate
 * hyperscaler-commitment figure (USD). Denominator: the NAIS-era government
 * envelope (SGD). No FX conversion is applied — the ratio is a nominal,
 * illustrative one and the UI must show the caveat alongside (rule: never
 * publish a ratio without its definition).
 */
export function amplificationRatio(): AmplificationRatio | null {
  let privateUsd = 0;
  let governmentSgd = 0;
  for (const r of capitalRecords) {
    if (r.kind === 'hyperscaler-commitment') privateUsd += r.amountUsd ?? 0;
    if (r.id === 'nais2-government-envelope') governmentSgd += r.amountSgd ?? 0;
  }
  if (privateUsd <= 0 || governmentSgd <= 0) return null;
  return { ratio: privateUsd / governmentSgd, governmentSgd, privateUsd };
}

const B = (n: number) => `$${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}B`;
const S = (n: number) => `S$${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}B`;

/** Tracker investment-dimension rows (same pattern as jobsIndexMetricRows). */
export function capitalMetricRows(): MetricRow[] {
  const r = amplificationRatio();
  if (!r) return [];
  const ratioStr = `1 : ${r.ratio.toFixed(1)}`;
  return [
    {
      name: '资本放大倍数',
      nameEn: 'Capital amplification ratio',
      nameJa: '資本増幅倍率',
      nameKo: '자본 증폭 배수',
      value: `${ratioStr}（${B(r.privateUsd)} 私人承诺 / ${S(r.governmentSgd)} 政府专项）`,
      valueEn: `${ratioStr} (${B(r.privateUsd)} private commitments / ${S(r.governmentSgd)} government envelope)`,
      valueJa: `${ratioStr}（民間コミットメント ${B(r.privateUsd)} / 政府専門枠 ${S(r.governmentSgd)}）`,
      valueKo: `${ratioStr}(${B(r.privateUsd)} 민간 커밋먼트 / ${S(r.governmentSgd)} 정부 전용)`,
      source: '站方派生（ai-capital.ts，见 /ecosystem 资本节）',
      sourceEn: 'Site derivation (ai-capital.ts; see the /ecosystem capital section)',
      sourceJa: '当サイト派生（ai-capital.ts、/ecosystem 資本セクション参照）',
      sourceKo: '사이트 파생(ai-capital.ts, /ecosystem 자본 섹션 참조)',
      sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
    },
  ];
}

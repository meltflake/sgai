// src/data/tracker.ts
//
// Singapore AI Observatory dashboard — 6-dimension view of Singapore's AI reality.
// No grading. Each dimension has: headline number + third-party ranking anchors +
// target progress + trend + editorial interpretation + key shortcoming + metrics table.
//
// Design doc: docs/20260502-tracker-dashboard-design.md

export type Trend = 'up' | 'flat' | 'down'; // visual: ↗ → ↘
export type DimensionId = 'investment' | 'talent' | 'compute' | 'adoption' | 'research' | 'governance';

export interface RankingAnchor {
  source: string;
  sourceEn?: string;
  rank: string;
  rankEn?: string;
  url: string;
}

export interface ProgressAgainstTarget {
  current?: string;
  currentEn?: string;
  target?: string;
  targetEn?: string;
  /** 0–100; when present, UI renders a progress bar. Caller must clamp. */
  pct?: number;
  description?: string;
  descriptionEn?: string;
  url?: string;
}

export interface MetricRow {
  name: string;
  nameEn?: string;
  value: string;
  valueEn?: string;
  source: string;
  sourceEn?: string;
  sourceUrl: string;
  /** Sub-group label (used by adoption dimension to split "enterprise adoption" vs "government use") */
  category?: string;
  categoryEn?: string;
}

export interface DimensionBase {
  id: DimensionId;
  icon: string;
  title: string;
  titleEn?: string;
  oneLiner: string;
  oneLinerEn?: string;
  trend: Trend;
  rankingAnchors: RankingAnchor[];
  shortcoming: string;
  shortcomingEn?: string;
  metrics: MetricRow[];
  relatedLeverNumbers?: number[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
}

export interface QuantifiedDimension extends DimensionBase {
  kind: 'quantified';
  headline: string;
  headlineEn?: string;
  benchmark: string;
  benchmarkEn?: string;
  progress?: ProgressAgainstTarget;
  judgment: string;
  judgmentEn?: string;
}

export interface QualitativeDimension extends DimensionBase {
  kind: 'qualitative';
  badge: string;
  badgeEn?: string;
  judgment: string;
  judgmentEn?: string;
}

export type Dimension = QuantifiedDimension | QualitativeDimension;

export interface OverallSummary {
  oneLiner: string;
  oneLinerEn?: string;
  asOf: string;
  topRankings: RankingAnchor[];
  methodologyNote: string;
  methodologyNoteEn?: string;
}

export const dataDate = '2026-05-02';

// TODO(Task 8): fill oneLiner / oneLinerEn / topRankings / methodologyNote / methodologyNoteEn
export const overallSummary: OverallSummary = {
  oneLiner: '',
  asOf: dataDate,
  topRankings: [],
  methodologyNote: '',
};

export const dimensions: Dimension[] = [
  {
    id: 'investment',
    kind: 'quantified',
    icon: '💰',
    title: '投入强度',
    oneLiner: '政府舍得花钱吗？',
    trend: 'up',
    headline: 'S$139/人',
    benchmark: 'vs US $33 / 中国 $7（人均）',
    progress: {
      description:
        '政府 AI 专项 > S$2B（NAIS 2.0 + 公共 AI 研究 2026–2030 + ECI）；Budget 2026 加码（400% 税收激励、S$1.5B FSDF）',
    },
    rankingAnchors: [
      {
        source: 'Stanford AI Index 2025',
        rank: '人均政府 AI 投入全球前列',
        url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        source: 'Budget 2026',
        rank: '400% AI 税收激励（创新政策）',
        url: 'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
    ],
    judgment:
      '人均 S$139 是美国 4.2 倍、中国 19 倍。Budget 2026 在已有 S$2B 基础上加 S$70M Multimodal LLM、S$1.5B FSDF、400% 税收激励——节奏不放缓。RIE2030 总盘 S$37B 兜底未来 5 年。资金强度处于全球第一梯队。',
    shortcoming:
      '私有部门跟投比例偏低，仍是政府推为主；钱花在算力和大企业上较多，SME 端补贴渗透不够；估算和披露口径偶尔不一致，跨年比较要小心。',
    metrics: [
      {
        name: '政府 AI 专项投入',
        nameEn: 'Government AI commitments',
        value: '> S$2B（NAIS 2.0 S$1B+ / 公共 AI 研究 2026-2030 S$1B+ / 企业计算 S$150M）',
        valueEn: '> S$2B (NAIS 2.0 S$1B+ / public AI research 2026-2030 S$1B+ / Enterprise Compute S$150M)',
        source: 'Budget 2024 / MDDI / Reuters, 2024-2026',
        sourceEn: 'Budget 2024 / MDDI / Reuters, 2024-2026',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: '公共 AI 研究投资 (2026-2030)',
        nameEn: 'Public AI R&D investment (2026-2030)',
        value: '> S$1B（7.79 亿美元）',
        valueEn: '> S$1B (US$779M)',
        source: 'MDDI, 2026.1.24',
        sourceEn: 'MDDI, 2026-01-24',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: '人均 AI 投资（政府）',
        nameEn: 'Government AI spend per capita',
        value: 'S$139/人（vs 美国 $33、中国 $7）',
        valueEn: 'S$139 per person (vs US $33, China $7)',
        source: 'Stanford AI Index 2025 + 人口数据估算',
        sourceEn: 'Stanford AI Index 2025 + population estimates',
        sourceUrl: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        name: 'AI 计算专项',
        nameEn: 'AI compute allocation',
        value: 'S$500M（高性能计算）',
        valueEn: 'S$500M (high-performance computing)',
        source: 'Budget 2024',
        sourceEn: 'Budget 2024',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: '下一代超算投资',
        nameEn: 'Next-generation supercomputer',
        value: 'S$270M（经典+量子混合，2025 年底投运）',
        valueEn: 'S$270M (classical + quantum hybrid, online by end of 2025)',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'AI 科学计划',
        nameEn: 'AI for Science programme',
        value: 'S$120M',
        valueEn: 'S$120M',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'RIE2030 研发总投入',
        nameEn: 'RIE2030 total R&D budget',
        value: 'S$37B（含 AI 相关，2026-2030）',
        valueEn: 'S$37B (incl. AI-related, 2026-2030)',
        source: 'NRF, 2025.12',
        sourceEn: 'NRF, 2025-12',
        sourceUrl: 'https://www.nrf.gov.sg/',
      },
      {
        name: 'AI Singapore 初始拨款',
        nameEn: 'AI Singapore seed funding',
        value: 'S$150M',
        valueEn: 'S$150M',
        source: 'NRF, 2017',
        sourceEn: 'NRF, 2017',
        sourceUrl: 'https://aisingapore.org/',
      },
      {
        name: '科技巨头基础设施承诺',
        nameEn: 'Big Tech infrastructure commitments',
        value: '~US$26B+（AWS $9B / Google $5B / Microsoft 等）',
        valueEn: '~US$26B+ (AWS $9B / Google $5B / Microsoft, et al.)',
        source: 'Introl 综合, 2025.8',
        sourceEn: 'Introl compilation, 2025-08',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'AI 创业融资总额',
        nameEn: 'AI startup funding (cumulative)',
        value: 'US$8.4B+（累计）',
        valueEn: 'US$8.4B+ (cumulative)',
        source: 'AiNewsHub, 2025',
        sourceEn: 'AiNewsHub, 2025',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: 'Budget 2026 AI 税收激励',
        nameEn: 'Budget 2026 AI tax incentive',
        value: '400% 税前扣除（上限 S$50K/年，YA2027-2028）',
        valueEn: '400% tax deduction (cap S$50K/year, YA2027-2028)',
        source: 'Budget 2026, 2026.2',
        sourceEn: 'Budget 2026, 2026-02',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: 'Microsoft 数据中心投资',
        nameEn: 'Microsoft data centre investment',
        value: 'S$5.5B（2024-2028）',
        valueEn: 'S$5.5B (2024-2028)',
        source: 'EDB / Microsoft, 2024',
        sourceEn: 'EDB / Microsoft, 2024',
        sourceUrl:
          'https://news.microsoft.com/source/asia/2024/05/07/microsoft-announces-singapore-investment-and-skilling-initiatives/',
      },
      {
        name: 'AWS 数据中心投资',
        nameEn: 'AWS data centre investment',
        value: 'S$12B（2024-2028）',
        valueEn: 'S$12B (2024-2028)',
        source: 'EDB / AWS, 2024',
        sourceEn: 'EDB / AWS, 2024',
        sourceUrl: 'https://www.aboutamazon.com/news/aws/aws-singapore-12-billion-investment',
      },
      {
        name: 'Google 数据中心 + AI 投资',
        nameEn: 'Google data centre + AI investment',
        value: 'US$9B / ~S$11.6B + DeepMind 实验室',
        valueEn: 'US$9B / ~S$11.6B + DeepMind lab',
        source: 'Google / EDB, 2026',
        sourceEn: 'Google / EDB, 2026',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'Enterprise Compute Initiative (ECI)',
        nameEn: 'Enterprise Compute Initiative (ECI)',
        value: 'S$150M（企业算力补贴）',
        valueEn: 'S$150M (enterprise compute subsidy)',
        source: 'IMDA, 2026.2',
        sourceEn: 'IMDA, 2026-02',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'Anchor Fund @ 65 第二批',
        nameEn: 'Anchor Fund @ 65 (second tranche)',
        value: 'S$1.5B（IPO 锚定基金，2026）',
        valueEn: 'S$1.5B (IPO anchor fund, 2026)',
        source: 'Budget 2026, 2026.2',
        sourceEn: 'Budget 2026, 2026-02',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'Future Sectors Development Fund (FSDF)',
        nameEn: 'Future Sectors Development Fund (FSDF)',
        value: 'S$1.5B（2026 启动）',
        valueEn: 'S$1.5B (launched 2026)',
        source: 'Budget 2026',
        sourceEn: 'Budget 2026',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'EQDP 私募股权基金扩张',
        nameEn: 'EQDP private equity expansion',
        value: 'S$6.5B（2026）',
        valueEn: 'S$6.5B (2026)',
        source: 'Budget 2026',
        sourceEn: 'Budget 2026',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'BCA BETC Grant',
        nameEn: 'BCA BETC Grant',
        value: 'S$100M（建造业数字基建，2025 起）',
        valueEn: 'S$100M (built environment digital infrastructure, from 2025)',
        source: 'BCA, 2025',
        sourceEn: 'BCA, 2025',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'Built Environment AI CoE',
        nameEn: 'Built Environment AI CoE',
        value: 'S$30M（2024 起）',
        valueEn: 'S$30M (from 2024)',
        source: 'BCA / NUS / NTU, 2024',
        sourceEn: 'BCA / NUS / NTU, 2024',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'NEA Weather Science Programme',
        nameEn: 'NEA Weather Science Programme',
        value: 'S$25M（2024 起）',
        valueEn: 'S$25M (from 2024)',
        source: 'NEA, 2024',
        sourceEn: 'NEA, 2024',
        sourceUrl: 'https://www.nea.gov.sg/',
      },
      {
        name: 'HTX 人形机器人中心 (H2RC)',
        nameEn: 'HTX Humanoid Robotics Centre (H2RC)',
        value: 'S$100M（2026 Q2 启动）',
        valueEn: 'S$100M (launching Q2 2026)',
        source: 'HTX, 2026',
        sourceEn: 'HTX, 2026',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'National Multimodal LLM Programme',
        nameEn: 'National Multimodal LLM Programme',
        value: 'S$70M（A*STAR 主导）',
        valueEn: 'S$70M (led by A*STAR)',
        source: 'A*STAR / AISG',
        sourceEn: 'A*STAR / AISG',
        sourceUrl: 'https://www.a-star.edu.sg/',
      },
      {
        name: 'Singapore AI Safety Institute (AISI)',
        nameEn: 'Singapore AI Safety Institute (AISI)',
        value: 'S$10M/年（治理研究）',
        valueEn: 'S$10M/year (governance research)',
        source: 'IMDA / AISI, 2024',
        sourceEn: 'IMDA / AISI, 2024',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
    ],
    relatedLeverNumbers: [1],
    relatedPolicyIds: [],
    relatedDebateIds: [],
    relatedPostSlugs: [],
  },
];

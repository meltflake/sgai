// src/data/tracker.ts
//
// Singapore AI Observatory dashboard — 6-dimension view of Singapore's AI reality.
// No grading. Each dimension has: headline number + third-party ranking anchors +
// target progress + trend + editorial interpretation + key shortcoming + metrics table.
//
// Design doc: docs/20260502-tracker-dashboard-design.md

export type Trend = 'up' | 'flat' | 'down'; // visual: ↗ → ↘
export type DimensionId = 'investment' | 'talent' | 'compute' | 'adoption' | 'research' | 'governance';

/**
 * External evidence anchor for a dimension.
 * Despite the name, not strictly a "ranking" — it covers any authoritative
 * external signal: third-party rankings (Tortoise / Oxford / WIPO / Stanford),
 * policy facts (Budget 2026 line items), signed international agreements
 * (Singapore Consensus / ASEAN Guide), etc. The `rank` field carries the
 * concrete claim (e.g. "#3", "11 countries signed", "400% tax deduction").
 */
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

export const overallSummary: OverallSummary = {
  oneLiner:
    '6 个维度看新加坡 AI：投入强、治理强、基建强；人才自给率低、原创研究偏少是结构性短板。数字和编辑解读各自呈现，访客自己判断。',
  oneLinerEn:
    'Six dimensions on Singapore AI: strong investment, governance, and infrastructure; low talent self-sufficiency and limited frontier research are structural weaknesses. Numbers and editorial interpretation are shown side by side — readers decide.',
  asOf: dataDate,
  topRankings: [
    {
      source: 'Tortoise Global AI Index 2024',
      rank: '#3',
      url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
    },
    {
      source: 'Oxford Government AI Readiness 2024',
      rank: '#2',
      url: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
    },
    {
      source: 'Microsoft AI Adoption 2026',
      rank: '#2 (60.9%)',
      url: 'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
    },
    {
      source: 'WIPO Global Innovation Index 2025',
      rank: '#5',
      url: 'https://www.wipo.int/',
    },
  ],
  methodologyNote: '每个维度呈现核心数字 + 第三方排名 + 目标进度 + 趋势 + 编辑解读，不打总评分。',
  methodologyNoteEn:
    'Each dimension shows headline numbers + third-party rankings + target progress + trend + editorial interpretation — no overall grade.',
};

export const dimensions: Dimension[] = [
  {
    id: 'investment',
    kind: 'quantified',
    icon: '💰',
    title: '投入强度',
    titleEn: 'Investment Intensity',
    oneLiner: '政府舍得花钱吗？',
    oneLinerEn: 'Is the government willing to spend?',
    trend: 'up',
    headline: 'S$139/人',
    headlineEn: 'S$139 per person',
    benchmark: 'vs US $33 / 中国 $7（人均）',
    benchmarkEn: 'vs US $33 / China $7 (per capita)',
    progress: {
      description:
        '政府 AI 专项 > S$2B（NAIS 2.0 + 公共 AI 研究 2026–2030 + ECI）；Budget 2026 加码（400% 税收激励、S$1.5B FSDF）',
      descriptionEn:
        'Government AI commitments > S$2B (NAIS 2.0 + Public AI R&D 2026–2030 + ECI); Budget 2026 adds 400% tax incentive + S$1.5B FSDF',
    },
    rankingAnchors: [
      {
        source: 'Stanford AI Index 2025',
        rank: '人均政府 AI 投入全球前列',
        rankEn: 'Per-capita government AI spend among global top',
        url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        source: 'Budget 2026',
        rank: '400% AI 税收激励（创新政策）',
        rankEn: '400% AI tax incentive (innovation policy)',
        url: 'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
    ],
    judgment:
      '人均 S$139 是美国 4.2 倍、中国 19 倍。Budget 2026 在已有 S$2B 基础上加 S$70M Multimodal LLM、S$1.5B FSDF、400% 税收激励——节奏不放缓。RIE2030 总盘 S$37B 兜底未来 5 年。资金强度处于全球第一梯队。',
    judgmentEn:
      "S$139 per capita is 4.2× the US and 19× China. Budget 2026 adds S$70M Multimodal LLM, S$1.5B FSDF, and a 400% tax incentive on top of an existing S$2B base — pace is not slowing. RIE2030's S$37B total backstops the next 5 years. Investment intensity sits in the global top tier.",
    shortcoming:
      '私有部门跟投比例偏低，仍是政府推为主；钱花在算力和大企业上较多，SME 端补贴渗透不够；估算和披露口径偶尔不一致，跨年比较要小心。',
    shortcomingEn:
      'Private sector co-investment ratio is low — government still drives most of the spend. Capital flows mostly to compute and large enterprises; SME-side subsidies underpenetrate. Disclosure conventions occasionally diverge year-over-year, so cross-year comparisons need care.',
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
  },
  {
    id: 'talent',
    kind: 'quantified',
    icon: '👩‍💻',
    title: '人才储备',
    titleEn: 'Talent Pipeline',
    oneLiner: '人够不够、自给率多少？',
    oneLinerEn: 'Are there enough people, and how self-sufficient is the supply?',
    trend: 'up',
    headline: '5,000 / 15,000',
    headlineEn: '5,000 / 15,000',
    benchmark: '目标 2029 完成 33%（外籍占比 35%）',
    benchmarkEn: '33% of 2029 target (35% foreign)',
    progress: {
      current: '5,000',
      currentEn: '5,000',
      target: '15,000 by 2029',
      targetEn: '15,000 by 2029',
      pct: 33,
      url: 'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
    },
    rankingAnchors: [
      {
        source: 'Tortoise Global AI Index Talent 子项',
        sourceEn: 'Tortoise Global AI Index — Talent sub-score',
        rank: '~#6–8',
        url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        source: 'SkillsFuture (2025)',
        rank: '105K 人 / 1,600 课程',
        rankEn: '105K people / 1,600 courses',
        url: 'https://www.skillsfuture.gov.sg/',
      },
      {
        source: 'TeSA',
        rank: '21K 本地人就业 + 340K 技能提升',
        rankEn: '21K locals placed + 340K reskilled',
        url: 'https://www.imda.gov.sg/',
      },
    ],
    judgment:
      '盘子在涨——SkillsFuture 105K 入读、TeSA 安置 21K、AIAP 22 批毕业 ~500–600 人——但目标完成度 33% 和外籍占比 35% 说明自给率仍是结构性问题。Tortoise Talent 子项在 #6–8 区间，距离美国差一截。',
    judgmentEn:
      'The pool is growing — 105K SkillsFuture enrolments, 21K TeSA placements, ~500–600 AIAP graduates over 22 cohorts — but 33% completion against the 15K target and a steady 35% foreign share point to a structural self-sufficiency gap. Tortoise Talent sits in the #6–8 range, well behind the US.',
    shortcoming:
      'AIAP 60 人/批是产能瓶颈；本地名校 AI 博士流失率高（去美/去工业界）；"AI Bilingual 100K" H1 2026 才上线（会计/法律首批），效果未知；非工程岗位（产品、设计、销售）培训供给薄弱。',
    shortcomingEn:
      'AIAP capacity is capped at ~60 apprentices per cohort. Top local AI PhDs leak to the US or industry. "AI Bilingual 100K" only launches H1 2026 (accounting/legal first) — outcomes unknown. Non-engineering AI roles (PM, design, sales) are undersupplied.',
    metrics: [
      {
        name: 'AI 专业人才目标',
        nameEn: 'AI professional headcount target',
        value: '2019 年 2,000 → 2023 年 5,000 → 2029 年目标 15,000（外籍占 35%）',
        valueEn: '2,000 (2019) → 5,000 (2023) → 15,000 target (2029, 35% foreign)',
        source: 'MDDI, 2026.1',
        sourceEn: 'MDDI, 2026-01',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: 'SkillsFuture AI 培训',
        nameEn: 'SkillsFuture AI training',
        value: '105,000+ 人参加 1,600+ AI 课程（2025）',
        valueEn: '105,000+ enrolments across 1,600+ AI courses (2025)',
        source: 'SSG / Straits Times, 2026.2',
        sourceEn: 'SSG / Straits Times, 2026-02',
        sourceUrl: 'https://www.straitstimes.com/tags/artificial-intelligence',
      },
      {
        name: 'TeSA 科技人才安置',
        nameEn: 'TeSA tech jobs placed',
        value: '21,000+ 本地人就业（自 2016）',
        valueEn: '21,000+ locals placed (since 2016)',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'TeSA 技能提升',
        nameEn: 'TeSA reskilling',
        value: '340,000+ 人（自 2016）',
        valueEn: '340,000+ people (since 2016)',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AIAP 学徒计划',
        nameEn: 'AIAP apprenticeship',
        value: '22 批完成，~500-600 毕业生，>90% 就业率，当前~60 人/批',
        valueEn: '22 cohorts completed, ~500-600 graduates, >90% placement, ~60 apprentices/cohort',
        source: 'AISG AIAP, 2026.2',
        sourceEn: 'AISG AIAP, 2026-02',
        sourceUrl: 'https://aiap.sg/apprenticeship/',
      },
      {
        name: 'Google AI 技能倡议',
        nameEn: 'Google AI skills initiative',
        value: '28,000 人（Skills Ignition SG）；目标 2027 年覆盖 50,000 学生',
        valueEn: '28,000 trained (Skills Ignition SG); target 50,000 students by 2027',
        source: 'Google for SG, 2026.2',
        sourceEn: 'Google for SG, 2026-02',
        sourceUrl: 'https://www.google.com/',
      },
      {
        name: '职场 AI 使用率',
        nameEn: 'Workplace AI usage',
        value: '3/4 工人定期使用 AI 工具，85% 认为提升效率',
        valueEn: '3 in 4 workers use AI tools regularly; 85% report productivity gains',
        source: 'IMDA SGDE Report, 2025',
        sourceEn: 'IMDA SGDE Report, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Springboard 企业计划',
        nameEn: 'AI Springboard enterprise scheme',
        value: '300 家企业，每家最高 S$600K 补贴',
        valueEn: '300 firms, up to S$600K subsidy per firm',
        source: 'EDB, 2025 Q3',
        sourceEn: 'EDB, Q3 2025',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'NAIIP 国家 AI 影响计划',
        nameEn: 'NAIIP National AI Impact Programme',
        value: '10K 企业 + 100K 工人（2026-2029）',
        valueEn: '10K firms + 100K workers (2026-2029)',
        source: 'IMDA + ESG, 2026.2',
        sourceEn: 'IMDA + ESG, 2026-02',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Bilingual 100K 计划',
        nameEn: 'AI Bilingual 100K programme',
        value: '首批落地：会计 (ISCA) + 法律 (SAL/SCCA)，1H 2026 上线',
        valueEn: 'First waves: accounting (ISCA) + legal (SAL/SCCA), launching H1 2026',
        source: 'MDDI COS 2026',
        sourceEn: 'MDDI COS 2026',
        sourceUrl: 'https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=budget-2895',
      },
      {
        name: 'SkillsFuture AI 课程补贴',
        nameEn: 'SkillsFuture AI course subsidy',
        value: '50% / 70% 分层补贴 + Mid-Career S$4,000 Credit',
        valueEn: '50% / 70% tiered subsidy + Mid-Career S$4,000 Credit',
        source: 'SSG, 2026',
        sourceEn: 'SSG, 2026',
        sourceUrl: 'https://www.skillsfuture.gov.sg/',
      },
      {
        name: '100E Programme（AI Singapore）',
        nameEn: '100E Programme (AI Singapore)',
        value: '每项目 S$150K 共投，累计 100+ 完成',
        valueEn: 'S$150K co-investment per project, 100+ completed',
        source: 'AISG',
        sourceEn: 'AISG',
        sourceUrl: 'https://aisingapore.org/innovation/100e/',
      },
    ],
    relatedLeverNumbers: [3],
  },
  {
    id: 'compute',
    kind: 'quantified',
    icon: '🖥️',
    title: '算力底座',
    titleEn: 'Compute Stack',
    oneLiner: '跑得起前沿模型吗？',
    oneLinerEn: 'Can it run frontier models?',
    trend: 'flat',
    headline: '1.4 GW',
    headlineEn: '1.4 GW',
    benchmark: '数据中心容量 + 70+ 设施 + NSCC ASPIRE 2A+ 20 PFLOPS',
    benchmarkEn: 'Data centre capacity + 70+ facilities + NSCC ASPIRE 2A+ at 20 PFLOPS',
    progress: {
      description: '额外 300MW 已分配 + 80MW 试点 2026–2028（增量在路上，但电力是天花板）',
      descriptionEn:
        '300MW additional capacity allocated + 80MW pilot 2026–2028 (incremental supply on the way, but power is the ceiling)',
    },
    rankingAnchors: [
      {
        source: 'Tortoise Global AI Index Infrastructure',
        rank: '#2',
        url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        source: 'NVIDIA Singapore (2025)',
        rank: '占全球营收 15%（人均 $600）',
        rankEn: '15% of global revenue (~$600 per capita)',
        url: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        source: 'Introl 2025',
        rank: '全球数据中心市场 $4.16B（2024）',
        rankEn: 'Global data centre market $4.16B (2024)',
        url: 'https://www.imda.gov.sg/',
      },
    ],
    judgment:
      'NSCC ASPIRE 2A+（H100, 20 PFLOPS）+ 商用集群（SMC 2,048 H100/集群）+ Singtel GPU-as-a-Service + 国家计算网格 + HTX NGINE B200 SuperPOD——分层覆盖完整，企业、科研、政府自用都够用。Tortoise 基建排 #2，仅次美国。趋势 → 而非 ↗ 是因为电力配额是天花板。',
    judgmentEn:
      'NSCC ASPIRE 2A+ (H100, 20 PFLOPS) + commercial clusters (SMC up to 2,048 H100s) + Singtel GPU-as-a-Service + National Compute Grid + HTX NGINE B200 SuperPOD — full-stack coverage for enterprise, research, and government use. Tortoise ranks infrastructure #2 globally, behind only the US. The trend is flat (→) rather than up because power quotas are the ceiling.',
    shortcoming:
      '电力配额 vs 绿电承诺的张力会卡未来 5 年扩张；前沿芯片（H100/B200）依赖进口，地缘风险存在；自研芯片或定制 ASIC 缺位；东南亚邻国（马来西亚、印尼）正在抢容量，新加坡的"算力中心"地位不是天然的。',
    shortcomingEn:
      'The tension between data-centre power quotas and green-energy commitments will cap expansion over the next 5 years. Frontier chips (H100 / B200) remain import-dependent — geopolitical exposure exists. Domestic chip or custom-ASIC capability is absent. Regional rivals (Malaysia, Indonesia) are competing for capacity — Singapore\'s "compute hub" status is not a given.',
    metrics: [
      // 11 rows from old "基础设施" section
      {
        name: 'NSCC ASPIRE 2A+',
        nameEn: 'NSCC ASPIRE 2A+',
        value: 'NVIDIA H100 集群，20 PetaFLOPS',
        valueEn: 'NVIDIA H100 cluster, 20 PetaFLOPS',
        source: 'TechTIQ, 2025.12',
        sourceEn: 'TechTIQ, 2025-12',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '国家 AI 计算网格',
        nameEn: 'National AI Compute Grid',
        value: '已宣布，链接全国计算资源',
        valueEn: 'Announced, linking national compute resources',
        source: 'SuperAI / DataCenters.com, 2025',
        sourceEn: 'SuperAI / DataCenters.com, 2025',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '商用 GPU 集群',
        nameEn: 'Commercial GPU clusters',
        value: 'SMC 最高 2,048 张 H100/集群；Singtel GPU-as-a-Service',
        valueEn: 'SMC up to 2,048 H100s per cluster; Singtel GPU-as-a-Service',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'NVIDIA 新加坡营收',
        nameEn: 'NVIDIA Singapore revenue',
        value: '占全球 15%（约 $2.7B/季度），人均 $600',
        valueEn: '15% of global revenue (~$2.7B/quarter), ~$600 per capita',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: '数据中心市场',
        nameEn: 'Data centre market',
        value: '$4.16B（2024），1.4GW 容量，70+ 设施',
        valueEn: '$4.16B (2024), 1.4GW capacity, 70+ facilities',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '新增数据中心容量',
        nameEn: 'New data centre capacity',
        value: '额外 300MW 已分配；80MW 试点（2026-2028）',
        valueEn: 'Additional 300MW allocated; 80MW pilot (2026-2028)',
        source: 'Reed Smith / Linklaters, 2025',
        sourceEn: 'Reed Smith / Linklaters, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '5G 覆盖',
        nameEn: '5G coverage',
        value: '95%+ 独立组网全国覆盖（2022.7 达成，提前 3 年）',
        valueEn: '95%+ standalone nationwide coverage (achieved 2022-07, 3 years ahead of schedule)',
        source: 'Singtel / CNA, 2022',
        sourceEn: 'Singtel / CNA, 2022',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'HTX NGINE — 家国安全算力',
        nameEn: 'HTX NGINE — homeland security compute',
        value: 'NVIDIA B200 DGX SuperPOD（自有）',
        valueEn: 'NVIDIA B200 DGX SuperPOD (owned)',
        source: 'HTX',
        sourceEn: 'HTX',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'Synapxe HEALIX',
        nameEn: 'Synapxe HEALIX',
        value: '国家医疗数据 + AI 基础设施',
        valueEn: 'National healthcare data + AI infrastructure',
        source: 'Synapxe',
        sourceEn: 'Synapxe',
        sourceUrl: 'https://www.synapxe.sg/',
      },
      {
        name: 'URA Virtual Singapore',
        nameEn: 'URA Virtual Singapore',
        value: '国家级数字孪生 + ePlanner 3D + Smart Planning Assistant',
        valueEn: 'National digital twin + ePlanner 3D + Smart Planning Assistant',
        source: 'URA',
        sourceEn: 'URA',
        sourceUrl: 'https://www.ura.gov.sg/',
      },
      {
        name: 'GovTech Agentspace',
        nameEn: 'GovTech Agentspace',
        value: '亚洲首例 air-gapped agentic AI（公共部门）',
        valueEn: "Asia's first air-gapped agentic AI (public sector)",
        source: 'GovTech',
        sourceEn: 'GovTech',
        sourceUrl: 'https://www.tech.gov.sg/',
      },
      // 3 data centre investment rows cross-listed from investment dimension
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
    ],
    relatedLeverNumbers: [1],
  },
  {
    id: 'adoption',
    kind: 'quantified',
    icon: '🏢',
    title: '产业渗透',
    titleEn: 'Industry Adoption',
    oneLiner: '企业真在用吗？',
    oneLinerEn: 'Are enterprises actually using AI?',
    trend: 'up',
    headline: '62.5% 大企业 / 14.5% SME',
    headlineEn: '62.5% large enterprises / 14.5% SMEs',
    benchmark: 'SME YoY 3 倍增长（2023 4.2% → 2024 14.5%）',
    benchmarkEn: 'SME adoption tripled YoY (4.2% in 2023 → 14.5% in 2024)',
    progress: {
      description: 'NAIIP 目标 10K 企业 + 100K 工人（2026–2029）',
      descriptionEn: 'NAIIP target: 10K firms + 100K workers (2026–2029)',
      url: 'https://www.imda.gov.sg/',
    },
    rankingAnchors: [
      {
        source: 'Microsoft AI Economy Institute 2026',
        rank: '全球第 2（60.9%，仅次 UAE）',
        rankEn: '#2 globally (60.9%, behind UAE only)',
        url: 'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
      },
      {
        source: 'IMDA SGDE 2025',
        rank: '数字经济占 GDP 18.6%（2024）',
        rankEn: 'Digital economy 18.6% of GDP (2024)',
        url: 'https://www.imda.gov.sg/',
      },
      {
        source: 'DBS (2024)',
        rank: '800+ 模型 / 350+ 用例 / S$750M 经济价值',
        rankEn: '800+ models / 350+ use cases / S$750M economic value',
        url: 'https://www.mas.gov.sg/',
      },
    ],
    judgment:
      '大企业达标——Microsoft 测全球 #2、DBS 等头部样板成熟。SME 14.5% YoY 3 倍是真增长，但绝对值仍低，离普及还远。政府自用（Pair / AIBots / VICA）目标 150K 公务员、Note Buddy 5K 医护、AV 巴士、ISO/IEC 42001 全球首张——案例厚但公开渗透率有限。',
    judgmentEn:
      "Large enterprises clear the bar — Microsoft puts Singapore #2 globally, with mature flagships like DBS. SME adoption at 14.5% is a real 3× YoY jump but absolute level is still low — broad penetration is 2–3 years out. Government use (Pair / AIBots / VICA) targets 150K civil servants; Note Buddy is in 5K clinicians; Punggol AV buses live; Changi holds the world's first ISO/IEC 42001 certification — case studies are thick but disclosed penetration rates are limited.",
    shortcoming:
      'SME 14.5% 看起来涨快、绝对值仍低，普惠 AI 还要 2–3 年；政府自用以效率工具为主，决策类 AI 渗透浅；NAIIP 拨款规模未公开，执行力存疑；政府公开渗透率仅有目标无进度，对账困难。',
    shortcomingEn:
      'SME 14.5% looks fast-growing but absolute level is low — broad-based AI usage takes another 2–3 years. Government use is mostly productivity tools; decision-grade AI is shallow. NAIIP funding sizing is not public — execution is hard to assess. Government-side public penetration data has targets but no tracked progress.',
    metrics: [
      // 17 rows from old "产业采用" section + 1 row from old "国际排名" (东南亚深科技融资份额) = 18 total
      {
        name: '数字经济占 GDP',
        nameEn: 'Digital economy share of GDP',
        value: '18.6%（2024，2019 年为 14.9%）',
        valueEn: '18.6% (2024, up from 14.9% in 2019)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '大企业 AI 采用率',
        nameEn: 'Large enterprise AI adoption',
        value: '62.5%（2024）',
        valueEn: '62.5% (2024)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '中小企业 AI 采用率',
        nameEn: 'SME AI adoption',
        value: '14.5%（2024，较 2023 年 4.2% 增长 3 倍）',
        valueEn: '14.5% (2024, 3x up from 4.2% in 2023)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: 'AI 创业公司',
        nameEn: 'AI startups',
        value: '650+（占东南亚深科技融资 91.1%）',
        valueEn: '650+ (91.1% of Southeast Asia deep-tech funding)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '独角兽',
        nameEn: 'Unicorns',
        value: '32 家（截至 2025.7）',
        valueEn: '32 (as of 2025-07)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '东盟 AI 交易份额',
        nameEn: 'ASEAN AI deal share',
        value: '58% 交易量，68% 交易金额（2024 前 9 个月）',
        valueEn: '58% of deal volume, 68% of deal value (first 9 months of 2024)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '企业 AI 培训意愿',
        nameEn: 'Enterprise AI training intent',
        value: '超过 2/3 使用 AI 的企业计划优先投资员工培训',
        valueEn: 'Over 2/3 of AI-using firms plan to prioritise employee training investment',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '医疗 AI 案例',
        nameEn: 'Healthcare AI deployments',
        value:
          'ACE-AI 预测糖尿病/高脂血症风险（Synapxe 开发，2027 年初推广至 1,100+ Healthier SG 诊所）；RUSSELL-GPT 减少医生文档时间 50%；Ng Teng Fong 医院流感暴发床位预测算法',
        valueEn:
          'ACE-AI predicts diabetes/hyperlipidemia risk (built by Synapxe, rolling out to 1,100+ Healthier SG clinics in early 2027); RUSSELL-GPT cuts physician documentation time by 50%; Ng Teng Fong Hospital flu-outbreak bed-demand forecasting algorithm',
        source: 'MOH COS 2026 / WEF / NUHS, 2025-2026',
        sourceEn: 'MOH COS 2026 / WEF / NUHS, 2025-2026',
        sourceUrl:
          'https://www.straitstimes.com/singapore/politics/ai-genetic-screening-and-flexible-financing-to-bolster-preventive-medicine-for-super-aged-spore-ong',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: '五大国家 AI 项目',
        nameEn: 'Five National AI Projects',
        value: '智能货运规划、市政服务、慢性病管理、个性化教育、边境清关（S$120M）',
        valueEn:
          'Smart freight planning, municipal services, chronic disease management, personalised education, border clearance (S$120M)',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Note Buddy 临床 AI 助手',
        nameEn: 'Note Buddy clinical AI assistant',
        value: '5,000+ 医护使用，67K 病历记录（截至 2025-12）',
        valueEn: '5,000+ clinicians using it, 67K case notes (as of 2025-12)',
        source: 'Synapxe / SingHealth, 2025',
        sourceEn: 'Synapxe / SingHealth, 2025',
        sourceUrl: 'https://www.synapxe.sg/',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'GovTech Pair 公务员 AI',
        nameEn: 'GovTech Pair (civil-service AI)',
        value: '150K 公务员目标',
        valueEn: '150K civil servants target',
        source: 'GovTech',
        sourceEn: 'GovTech',
        sourceUrl: 'https://www.tech.gov.sg/products-and-services/pair/',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Punggol 自动驾驶巴士',
        nameEn: 'Punggol autonomous buses',
        value: '首批商业化 AV，3 条线路（2025-12 上线）',
        valueEn: 'First commercial AV deployment, 3 routes (live from 2025-12)',
        source: 'LTA',
        sourceEn: 'LTA',
        sourceUrl: 'https://www.lta.gov.sg/',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'PSA Tuas Mega Port',
        nameEn: 'PSA Tuas Mega Port',
        value: '2040s 全球最大全自动港',
        valueEn: "World's largest fully automated port by the 2040s",
        source: 'PSA Singapore',
        sourceEn: 'PSA Singapore',
        sourceUrl: 'https://www.singaporepsa.com/our-commitment/innovation/tuas-port',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Changi 机场 AI 治理认证',
        nameEn: 'Changi Airport AI governance certification',
        value: '全球首张 ISO/IEC 42001 AI 治理认证',
        valueEn: "World's first ISO/IEC 42001 AI governance certification",
        source: 'Changi Airport Group, 2025',
        sourceEn: 'Changi Airport Group, 2025',
        sourceUrl: 'https://www.changiairport.com/',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'HDB Tengah 智能能源镇',
        nameEn: 'HDB Tengah smart-energy town',
        value: '首座智能能源镇，4.2 万户',
        valueEn: 'First smart-energy town, 42,000 households',
        source: 'HDB',
        sourceEn: 'HDB',
        sourceUrl: 'https://www.hdb.gov.sg/about-us/news-and-publications/news/details/tengah',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'JTC Punggol Digital District',
        nameEn: 'JTC Punggol Digital District',
        value: '首个全区智能区，能耗预计降 30%',
        valueEn: 'First district-wide smart precinct, projected 30% energy reduction',
        source: 'JTC',
        sourceEn: 'JTC',
        sourceUrl: 'https://www.jtc.gov.sg/our-work/spaces/punggol-digital-district',
        category: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'AI Verify Sandbox',
        nameEn: 'AI Verify Sandbox',
        value: '10+ 跨国大企业参与（IMDA Global AI Assurance Pilot）',
        valueEn: '10+ multinationals participating (IMDA Global AI Assurance Pilot)',
        source: 'IMDA, 2025',
        sourceEn: 'IMDA, 2025',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
      // 1 row migrated from old "国际排名" section
      {
        name: '东南亚深科技融资份额',
        nameEn: 'Share of Southeast Asia deep-tech funding',
        value: '91.1%',
        valueEn: '91.1%',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryEn: 'Enterprise Adoption',
      },
    ],
    relatedLeverNumbers: [4, 5],
  },
  {
    id: 'research',
    kind: 'quantified',
    icon: '🔬',
    title: '研究质量',
    titleEn: 'Research Quality',
    oneLiner: '有真东西出来吗？',
    oneLinerEn: 'Is original research coming out?',
    trend: 'flat',
    headline: '人均论文全球 #1',
    headlineEn: 'Per-capita papers #1 globally',
    benchmark: 'NTU AI #3（仅次 MIT/CMU）· NUS AI #9',
    benchmarkEn: 'NTU AI #3 (after MIT/CMU) · NUS AI #9',
    progress: {
      description: 'SEA-LION v4（11 语言、4B–33B 参数）+ 100E 100+ 项目 + ICLR 2025 主办',
      descriptionEn: 'SEA-LION v4 (11 languages, 4B–33B params) + 100E (100+ projects) + ICLR 2025 hosted',
    },
    rankingAnchors: [
      {
        source: 'Wiley 2024',
        rank: '人均 AI 论文全球 #1（每百万人 250 篇，2022）',
        rankEn: '#1 globally for AI papers per capita (250 per million people, 2022)',
        url: 'https://aiindex.stanford.edu/',
      },
      {
        source: 'CSRankings AI',
        rank: 'NTU #3',
        url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        source: 'QS',
        rank: 'NUS AI #9',
        url: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
    ],
    judgment:
      '产出量级和学校排名都很硬——人均论文 #1、NTU AI #3、NUS #9、ICLR 2025 主办、SEA-LION 是少有的非英美中有规模的基座模型。但顶级原创（FAIR/DeepMind 级 frontier work）仍少一档：顶会一作占比、被引大于 1000 的代表作、自研基座的市场份额都还差。',
    judgmentEn:
      'Volume and university rankings are strong — per-capita papers #1, NTU AI #3, NUS #9, ICLR 2025 hosted, SEA-LION is one of the few non-US/UK/China foundation models at scale. But frontier-grade originality (FAIR / DeepMind tier) still trails by a step: first-author share at top venues, signature works with >1000 citations, market share of self-developed foundation models — all behind.',
    shortcoming:
      '顶会一作占比、被引数、自研基座市场份额都还差一档；顶尖博士流失率高；产学研转化对企业自用强但对外输出弱（无 OpenAI / Anthropic 量级的 spinoff）；原创研究的国际可见度依赖少数明星教授。',
    shortcomingEn:
      'First-author share at top venues, citation counts, and self-developed foundation-model market share all trail by a step. Top PhD outflow is high. Research-to-industry transfer is strong for in-house enterprise use but weak as international export — no OpenAI / Anthropic-tier spinout. International visibility hinges on a small number of star professors.',
    metrics: [
      {
        name: 'AI 论文人均发表量',
        nameEn: 'AI papers per capita',
        value: '全球第 1（每百万人 250 篇，2022）',
        valueEn: '#1 globally (250 papers per million people, 2022)',
        source: 'Wiley, 2024.9',
        sourceEn: 'Wiley, 2024-09',
        sourceUrl: 'https://aiindex.stanford.edu/',
      },
      {
        name: 'NTU AI 研究排名',
        nameEn: 'NTU AI research ranking',
        value: '全球第 3（仅次于 MIT、CMU）',
        valueEn: '#3 globally (after MIT and CMU)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        name: 'NUS AI 学术声誉',
        nameEn: 'NUS AI academic reputation',
        value: '全球第 9',
        valueEn: '#9 globally',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        name: 'SEA-LION 大模型',
        nameEn: 'SEA-LION large language model',
        value: 'v4，11+ 语言，4B-33B 参数',
        valueEn: 'v4, 11+ languages, 4B-33B parameters',
        source: 'AISG, 2025',
        sourceEn: 'AISG, 2025',
        sourceUrl: 'https://sea-lion.ai/',
      },
      {
        name: '100 Experiments',
        nameEn: '100 Experiments',
        value: '100+ AI 项目完成（2018-2025，已归档）',
        valueEn: '100+ AI projects completed (2018-2025, archived)',
        source: 'AISG',
        sourceEn: 'AISG',
        sourceUrl: 'https://aisingapore.org/',
      },
      {
        name: 'ICLR 2025',
        nameEn: 'ICLR 2025',
        value: '在新加坡举办',
        valueEn: 'Hosted in Singapore',
        source: 'ICLR, 2025',
        sourceEn: 'ICLR, 2025',
        sourceUrl: 'https://iclr.cc/',
      },
      {
        name: 'DBS AI 模型',
        nameEn: 'DBS AI models',
        value: '800+ 模型，350+ 用例，2024 年创造 S$750M 经济价值',
        valueEn: '800+ models, 350+ use cases, S$750M economic value generated in 2024',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.mas.gov.sg/',
      },
    ],
  },
  {
    id: 'governance',
    kind: 'qualitative',
    icon: '🌐',
    title: '治理影响力',
    titleEn: 'Governance Influence',
    oneLiner: '规则上是不是话事人？',
    oneLinerEn: 'Is Singapore writing the rules?',
    trend: 'up',
    badge: '规则制定者',
    badgeEn: 'Rule-maker',
    judgment:
      'Singapore Consensus on AI Safety 11 国签署（含中美）、ASEAN Guide on AI Governance 10 国采纳（新加坡主导起草）、AI Verify Foundation 在全球被引、REAIM 联合主办、ISESEA 已办两届——新加坡是规则制定者而不是接受者，话语权显著超出体量。Bletchley、Seoul、Paris 三届 AI Safety Summit 全程参与；MAS Project MindForge 拉到 24 家机构 + 四大云厂；UN Independent International Scientific Panel 有席位。',
    judgmentEn:
      "Singapore Consensus on AI Safety signed by 11 countries (incl. US and China); ASEAN Guide on AI Governance adopted by all 10 ASEAN states (drafted under Singapore's lead); AI Verify Foundation cited globally; REAIM co-hosted; ISESEA held twice — Singapore is a rule-maker, not a rule-taker, with influence well above its size. Full participation in Bletchley, Seoul, and Paris AI Safety Summits; MAS Project MindForge has 24 institutions + the four major cloud vendors; UN Independent International Scientific Panel includes Singapore.",
    rankingAnchors: [
      {
        source: 'Oxford Government AI Readiness 2024',
        rank: '#2（仅次美国）',
        rankEn: '#2 (behind the US only)',
        url: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        source: 'Singapore Consensus',
        rank: '11 国签署',
        rankEn: 'Signed by 11 countries',
        url: 'https://aiverifyfoundation.sg/',
      },
      {
        source: 'ASEAN Guide on AI Governance',
        rank: '10 国采纳',
        rankEn: 'Adopted by 10 ASEAN states',
        url: 'https://asean.org/',
      },
    ],
    shortcoming:
      '规则制定 ≠ 规则被遵守——AI Verify 框架被采纳但执法层面影响力弱；中美 AI 治理分裂时新加坡的"居间者"定位可持续性存疑——任一方要求选边，回旋空间会塌；治理研究投入（AISI S$10M/年）和影响力规模不匹配，结构性投入偏轻。',
    shortcomingEn:
      'Setting rules ≠ rules being enforced — AI Verify is widely adopted but enforcement-side influence is weak. As US-China AI governance fragments, Singapore\'s "broker" position is hard to sustain — if either side demands picking a side, the room narrows fast. Governance-research investment (AISI at S$10M/year) is mismatched with influence scale — structurally underfunded.',
    metrics: [
      {
        name: 'Singapore Consensus on AI Safety',
        nameEn: 'Singapore Consensus on AI Safety',
        value: '11 国签署（含中美）',
        valueEn: 'Signed by 11 countries (incl. US and China)',
        source: 'IMDA / AISI, 2024',
        sourceEn: 'IMDA / AISI, 2024',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'ASEAN Guide on AI Governance',
        nameEn: 'ASEAN Guide on AI Governance',
        value: '10 国采纳（新加坡主导起草）',
        valueEn: "Adopted by all 10 ASEAN states (drafted under Singapore's lead)",
        source: 'ASEAN Digital Ministers, 2024',
        sourceEn: 'ASEAN Digital Ministers, 2024',
        sourceUrl: 'https://asean.org/',
      },
      {
        name: 'REAIM Seoul Summit 2024',
        nameEn: 'REAIM Seoul Summit 2024',
        value: '新加坡作为联合主办方（5 国）',
        valueEn: 'Singapore as a co-host (one of 5 countries)',
        source: 'MFA / MINDEF, 2024',
        sourceEn: 'MFA / MINDEF, 2024',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'AI Safety Summits 出席',
        nameEn: 'AI Safety Summits attended',
        value: 'Bletchley 2023 + Seoul 2024 + Paris 2025 全部参与',
        valueEn: 'Bletchley 2023, Seoul 2024 and Paris 2025 — full participation',
        source: 'MFA',
        sourceEn: 'MFA',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'International Scientific Exchange (ISESEA)',
        nameEn: 'International Scientific Exchange (ISESEA)',
        value: '已办两届（2024 + 2026）',
        valueEn: 'Two editions held (2024 and 2026)',
        source: 'IMDA / AISI',
        sourceEn: 'IMDA / AISI',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'UN Global Dialogue on AI Governance',
        nameEn: 'UN Global Dialogue on AI Governance',
        value: '新加坡参与 Independent International Scientific Panel',
        valueEn: 'Singapore on the Independent International Scientific Panel',
        source: 'UN / MFA',
        sourceEn: 'UN / MFA',
        sourceUrl: 'https://www.un.org/techenvoy/ai-advisory-body',
      },
      {
        name: 'MAS Project MindForge',
        nameEn: 'MAS Project MindForge',
        value: '24 家机构 + Microsoft / AWS / Google / NVIDIA',
        valueEn: '24 institutions + Microsoft / AWS / Google / NVIDIA',
        source: 'MAS',
        sourceEn: 'MAS',
        sourceUrl: 'https://www.mas.gov.sg/',
      },
    ],
    relatedLeverNumbers: [2, 6],
  },
];

export interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}

export const autoDiscovered: AutoDiscoveredEntry[] = [
  {
    title: '2017年人工智能指数报告',
    titleEn: 'The 2017 AI Index Report',
    description: '斯坦福大学HAI研究所发布的2017年AI指数报告，旨在追踪和衡量人工智能领域的发展趋势。报告通过汇总多维度数据（包括活动量、技术性能和衍生指标），为政策制定者、研究人员和公众提供对AI领域进展的深入理解。报告还引入了AI活力指数等创新性测量工具，并汇集了来自多位AI专家的主观评论。',
    descriptionEn: 'Stanford HAI\'s 2017 AI Index Report tracks and measures trends in artificial intelligence development by aggregating diverse datasets across multiple dimensions including activity volume, technical performance, and derivative measures. The report provides unbiased, rigorous data for policymakers, researchers, and the public to understand AI progress and includes an exploratory AI Vibrancy Index that combines academic and industry trends. Expert commentary from cross-disciplinary AI experts complements the quantitative data.',
    category: '研究',
    confidence: 'high',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2017-ai-index-report',
    discoveredAt: '2026-05-03',
  },
  {
    title: '2018年AI指数报告',
    titleEn: 'The 2018 AI Index Report',
    description: '斯坦福HAI发布的2018年AI指数报告是一份综合性数据基准，旨在为全球AI进展提供客观的、数据驱动的视角。报告分为四个主要部分：活动量度（如会议参加人数、VC投资）、技术性能（如计算机图像识别能力）、衍生性测度（包括AI活力指数）和与人类性能的对标。该报告为政策制定者、研究人员、记者和公众提供了理解AI领域复杂进展的基础数据。',
    descriptionEn: 'Stanford HAI\'s 2018 AI Index Report is a comprehensive data benchmark designed to provide an objective, data-driven perspective on global AI progress. The report is divided into four main sections: Volume of Activity (such as conference attendance and VC investments), Technical Performance (such as computer image recognition capabilities), Derivative Measures (including the AI Vibrancy Index), and progress towards Human Performance. The report provides foundational data for policymakers, researchers, journalists, and the public to understand the complex progress of the AI field.',
    category: '研究',
    confidence: 'high',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2018-ai-index-report',
    discoveredAt: '2026-05-03',
  },
  {
    title: '2019年AI指数报告',
    titleEn: 'The 2019 AI Index Report',
    description: '斯坦福HAI发布的2019年AI指数报告，通过追踪、整理和可视化与人工智能相关的数据，为政策制定者、研究人员和公众提供AI领域的全面理解。报告涵盖研究开发、会议、技术性能、经济、教育、自主系统、公众认知、社会考量和国家战略等九个主题，跟踪的数据集比2018版增加三倍。',
    descriptionEn: 'Stanford HAI\'s 2019 AI Index Report tracks, collates, and visualizes data on artificial intelligence to provide policymakers, researchers, and the public with comprehensive insights into the AI field. The report covers nine chapters including Research and Development, Conferences, Technical Performance, Economy, Education, Autonomous Systems, Public Perception, Societal Considerations, and National Strategies, tracking three times as many datasets as the 2018 edition.',
    category: '研究',
    confidence: 'high',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2019-ai-index-report',
    discoveredAt: '2026-05-03',
  },
  {
    title: '2024年AI指数报告',
    titleEn: 'The 2024 AI Index Report',
    description: '斯坦福大学HAI发布的第七版AI指数报告，全面追踪和分析AI领域的关键趋势。报告覆盖技术进展、公众认知、地缘政治动态、负责任AI、科学医学应用等九个主要章节，包含关于模型训练成本、行业主导地位、监管趋势等的新数据和估计。',
    descriptionEn: 'The seventh edition of Stanford HAI\'s AI Index Report, a comprehensive analysis of key trends across the AI field. The report covers technical advancements, public perception, geopolitical dynamics, responsible AI, and science-medicine applications across nine chapters, featuring new data on model training costs, industry dominance, regulatory trends, and workforce impacts.',
    category: '研究',
    confidence: 'high',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2024-ai-index-report',
    discoveredAt: '2026-05-03',
  },
  {
    title: '研究与开发 | 2024年AI指数报告',
    titleEn: 'Research and Development | The 2024 AI Index Report',
    description: '斯坦福人工智能指数报告第一章追踪AI研究与开发的关键趋势。报告显示，2023年工业界主导了前沿AI研究，发布了51个显著的机器学习模型，而学术界仅贡献15个。基础模型数量激增至149个，其中65.7%为开源。同时，尖端模型的训练成本急剧上升，GPT-4和Gemini Ultra的计算成本分别达到7800万和1.91亿美元。',
    descriptionEn: 'Chapter 1 of Stanford\'s AI Index Report tracks key trends in AI research and development. The report reveals that industry dominated frontier AI research in 2023, producing 51 notable machine learning models compared to academia\'s 15. Foundation models surged to 149 releases with 65.7% open-sourced. Concurrently, training costs for cutting-edge models skyrocketed, with GPT-4 and Gemini Ultra requiring $78 million and $191 million in compute respectively. Additionally, GitHub AI projects nearly doubled to 1.8 million by 2023, while global AI patent grants increased 62.7% from 2021 to 2022, with China leading in patent origins at 61.1%.',
    category: '研究',
    confidence: 'high',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2024-ai-index-report/research-and-development',
    discoveredAt: '2026-05-03',
  },
];

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
  sourceJa?: string;
  rank: string;
  rankEn?: string;
  rankJa?: string;
  url: string;
}

export interface ProgressAgainstTarget {
  current?: string;
  currentEn?: string;
  currentJa?: string;
  target?: string;
  targetEn?: string;
  targetJa?: string;
  /** 0–100; when present, UI renders a progress bar. Caller must clamp. */
  pct?: number;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  url?: string;
}

export interface MetricRow {
  name: string;
  nameEn?: string;
  nameJa?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  source: string;
  sourceEn?: string;
  sourceJa?: string;
  sourceUrl: string;
  /** Sub-group label (used by adoption dimension to split "enterprise adoption" vs "government use") */
  category?: string;
  categoryEn?: string;
  categoryJa?: string;
}

export interface DimensionBase {
  id: DimensionId;
  icon: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  oneLiner: string;
  oneLinerEn?: string;
  oneLinerJa?: string;
  trend: Trend;
  rankingAnchors: RankingAnchor[];
  shortcoming: string;
  shortcomingEn?: string;
  shortcomingJa?: string;
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
  headlineJa?: string;
  benchmark: string;
  benchmarkEn?: string;
  benchmarkJa?: string;
  progress?: ProgressAgainstTarget;
  judgment: string;
  judgmentEn?: string;
  judgmentJa?: string;
}

export interface QualitativeDimension extends DimensionBase {
  kind: 'qualitative';
  badge: string;
  badgeEn?: string;
  badgeJa?: string;
  judgment: string;
  judgmentEn?: string;
  judgmentJa?: string;
}

export type Dimension = QuantifiedDimension | QualitativeDimension;

export interface OverallSummary {
  oneLiner: string;
  oneLinerEn?: string;
  oneLinerJa?: string;
  asOf: string;
  topRankings: RankingAnchor[];
  methodologyNote: string;
  methodologyNoteEn?: string;
  methodologyNoteJa?: string;
}

export const dataDate = '2026-05-02';

export const overallSummary: OverallSummary = {
  oneLiner:
    '6 个维度看新加坡 AI：投入强、治理强、基建强；人才自给率低、原创研究偏少是结构性短板。数字和编辑解读各自呈现，访客自己判断。',
  oneLinerJa:
    '6つの側面からシンガポール AIを見ると：投入が強い、ガバナンスが強い、基盤が強い；人材の自給率が低く、オリジナル研究が不足しているのは構造的な短所です。数字と編集解読はそれぞれ提示され、訪問者自身が判断します。',
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
  methodologyNoteJa:
    '各側面は、中核数字 + サードパーティランキング + 目標進捗 + トレンド + 編集解読を提示し、総合スコアは付けません。',
  methodologyNoteEn:
    'Each dimension shows headline numbers + third-party rankings + target progress + trend + editorial interpretation — no overall grade.',
};

export const dimensions: Dimension[] = [
  {
    id: 'investment',
    kind: 'quantified',
    icon: '💰',
    title: '投入强度',
    titleJa: '投入強度',
    titleEn: 'Investment Intensity',
    oneLiner: '政府舍得花钱吗？',
    oneLinerJa: '政府は支出をいとわないのか？',
    oneLinerEn: 'Is the government willing to spend?',
    trend: 'up',
    headline: 'S$139/人',
    headlineJa: 'S$139/人',
    headlineEn: 'S$139 per person',
    benchmark: 'vs US $33 / 中国 $7（人均）',
    benchmarkJa: 'vs US $33 / 中国 $7（一人当たり）',
    benchmarkEn: 'vs US $33 / China $7 (per capita)',
    progress: {
      description:
        '政府 AI 专项 > S$2B（NAIS 2.0 + 公共 AI 研究 2026–2030 + ECI）；Budget 2026 加码（400% 税收激励、S$1.5B FSDF）',
      descriptionJa:
        '政府 AI 専項 > S$2B（NAIS 2.0 + 公共 AI 研究 2026–2030 + ECI）；Budget 2026 で増額（400% 税控除、S$1.5B FSDF）',
      descriptionEn:
        'Government AI commitments > S$2B (NAIS 2.0 + Public AI R&D 2026–2030 + ECI); Budget 2026 adds 400% tax incentive + S$1.5B FSDF',
    },
    rankingAnchors: [
      {
        source: 'Stanford AI Index 2025',
        rank: '人均政府 AI 投入全球前列',
        rankJa: '一人当たり政府 AI 投入は世界の最前列',
        rankEn: 'Per-capita government AI spend among global top',
        url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        source: 'Budget 2026',
        rank: '400% AI 税收激励（创新政策）',
        rankJa: '400% AI 税控除（イノベーション政策）',
        rankEn: '400% AI tax incentive (innovation policy)',
        url: 'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
    ],
    judgment:
      '人均 S$139 是美国 4.2 倍、中国 19 倍。Budget 2026 在已有 S$2B 基础上加 S$70M Multimodal LLM、S$1.5B FSDF、400% 税收激励——节奏不放缓。RIE2030 总盘 S$37B 兜底未来 5 年。资金强度处于全球第一梯队。',
    judgmentJa:
      '一人当たり S$139 は米国の 4.2 倍、中国の 19 倍。Budget 2026 は既存の S$2B を基礎に、S$70M Multimodal LLM、S$1.5B FSDF、400% 税控除を追加し、ペースは緩みません。RIE2030 総額 S$37B が今後 5 年の基礎となります。資金の強度は世界の第一梯隊にあります。',
    judgmentEn:
      "S$139 per capita is 4.2× the US and 19× China. Budget 2026 adds S$70M Multimodal LLM, S$1.5B FSDF, and a 400% tax incentive on top of an existing S$2B base — pace is not slowing. RIE2030's S$37B total backstops the next 5 years. Investment intensity sits in the global top tier.",
    shortcoming:
      '私有部门跟投比例偏低，仍是政府推为主；钱花在算力和大企业上较多，SME 端补贴渗透不够；估算和披露口径偶尔不一致，跨年比较要小心。',
    shortcomingJa:
      '民間部門の追加投資比率が低く、依然として政府主導；資金は計算能力と大企業に多く向けられ、SME 向けの補助の浸透度は不十分；推定と開示の口径がたまに不一致で、年間比較では注意が必要。',
    shortcomingEn:
      'Private sector co-investment ratio is low — government still drives most of the spend. Capital flows mostly to compute and large enterprises; SME-side subsidies underpenetrate. Disclosure conventions occasionally diverge year-over-year, so cross-year comparisons need care.',
    metrics: [
      {
        name: '政府 AI 专项投入',
        nameJa: '政府 AI 専項投入',
        nameEn: 'Government AI commitments',
        value: '> S$2B（NAIS 2.0 S$1B+ / 公共 AI 研究 2026-2030 S$1B+ / 企业计算 S$150M）',
        valueJa: '> S$2B（NAIS 2.0 S$1B+ / 公共 AI 研究 2026-2030 S$1B+ / エンタープライズコンピュータ S$150M）',
        valueEn: '> S$2B (NAIS 2.0 S$1B+ / public AI research 2026-2030 S$1B+ / Enterprise Compute S$150M)',
        source: 'Budget 2024 / MDDI / Reuters, 2024-2026',
        sourceEn: 'Budget 2024 / MDDI / Reuters, 2024-2026',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: '公共 AI 研究投资 (2026-2030)',
        nameJa: '公共 AI 研究投資（2026-2030）',
        nameEn: 'Public AI R&D investment (2026-2030)',
        value: '> S$1B（7.79 亿美元）',
        valueJa: '> S$1B（7.79 億米ドル）',
        valueEn: '> S$1B (US$779M)',
        source: 'MDDI, 2026.1.24',
        sourceEn: 'MDDI, 2026-01-24',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: '人均 AI 投资（政府）',
        nameJa: '一人当たり AI 投資（政府）',
        nameEn: 'Government AI spend per capita',
        value: 'S$139/人（vs 美国 $33、中国 $7）',
        valueJa: 'S$139/人（vs 米国 $33、中国 $7）',
        valueEn: 'S$139 per person (vs US $33, China $7)',
        source: 'Stanford AI Index 2025 + 人口数据估算',
        sourceJa: 'Stanford AI Index 2025 + 人口統計データの推定',
        sourceEn: 'Stanford AI Index 2025 + population estimates',
        sourceUrl: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        name: 'AI 计算专项',
        nameJa: 'AI コンピュータ専項',
        nameEn: 'AI compute allocation',
        value: 'S$500M（高性能计算）',
        valueJa: 'S$500M（高性能コンピュータ）',
        valueEn: 'S$500M (high-performance computing)',
        source: 'Budget 2024',
        sourceEn: 'Budget 2024',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: '下一代超算投资',
        nameJa: '次世代スーパーコンピュータ投資',
        nameEn: 'Next-generation supercomputer',
        value: 'S$270M（经典+量子混合，2025 年底投运）',
        valueJa: 'S$270M（クラシック+量子ハイブリッド、2025 年末に稼働開始）',
        valueEn: 'S$270M (classical + quantum hybrid, online by end of 2025)',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'AI 科学计划',
        nameJa: 'AI 科学計画',
        nameEn: 'AI for Science programme',
        value: 'S$120M',
        valueEn: 'S$120M',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'RIE2030 研发总投入',
        nameJa: 'RIE2030 研究開発総投入',
        nameEn: 'RIE2030 total R&D budget',
        value: 'S$37B（含 AI 相关，2026-2030）',
        valueJa: 'S$37B（AI 関連を含む、2026-2030）',
        valueEn: 'S$37B (incl. AI-related, 2026-2030)',
        source: 'NRF, 2025.12',
        sourceEn: 'NRF, 2025-12',
        sourceUrl: 'https://www.nrf.gov.sg/',
      },
      {
        name: 'AI Singapore 初始拨款',
        nameJa: 'AI Singapore 初期配分',
        nameEn: 'AI Singapore seed funding',
        value: 'S$150M',
        valueEn: 'S$150M',
        source: 'NRF, 2017',
        sourceEn: 'NRF, 2017',
        sourceUrl: 'https://aisingapore.org/',
      },
      {
        name: '科技巨头基础设施承诺',
        nameJa: '科学技術大手の基盤設備コミットメント',
        nameEn: 'Big Tech infrastructure commitments',
        value: '~US$26B+（AWS $9B / Google $5B / Microsoft 等）',
        valueJa: '~US$26B+（AWS $9B / Google $5B / Microsoft など）',
        valueEn: '~US$26B+ (AWS $9B / Google $5B / Microsoft, et al.)',
        source: 'Introl 综合, 2025.8',
        sourceJa: 'Introl 統合、2025.8',
        sourceEn: 'Introl compilation, 2025-08',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'AI 创业融资总额',
        nameJa: 'AI スタートアップ融資総額',
        nameEn: 'AI startup funding (cumulative)',
        value: 'US$8.4B+（累计）',
        valueJa: 'US$8.4B+（累計）',
        valueEn: 'US$8.4B+ (cumulative)',
        source: 'AiNewsHub, 2025',
        sourceEn: 'AiNewsHub, 2025',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: 'Budget 2026 AI 税收激励',
        nameJa: 'Budget 2026 AI 税控除',
        nameEn: 'Budget 2026 AI tax incentive',
        value: '400% 税前扣除（上限 S$50K/年，YA2027-2028）',
        valueJa: '400% 税前控除（上限 S$50K/年、YA2027-2028）',
        valueEn: '400% tax deduction (cap S$50K/year, YA2027-2028)',
        source: 'Budget 2026, 2026.2',
        sourceEn: 'Budget 2026, 2026-02',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: 'Microsoft 数据中心投资',
        nameJa: 'Microsoft データセンター投資',
        nameEn: 'Microsoft data centre investment',
        value: 'S$5.5B（2024-2028）',
        valueEn: 'S$5.5B (2024-2028)',
        source: 'EDB / Microsoft, 2024',
        sourceEn: 'EDB / Microsoft, 2024',
        sourceUrl:
          'https://news.microsoft.com/source/asia/2026/04/01/microsoft-announces-5-5-billion-spend-and-new-microsoft-elevate-programs-to-support-every-tertiary-student-educator-and-nonprofit-to-power-singapores-ai-future/',
      },
      {
        name: 'AWS 数据中心投资',
        nameJa: 'AWS データセンター投資',
        nameEn: 'AWS data centre investment',
        value: 'S$12B（2024-2028）',
        valueEn: 'S$12B (2024-2028)',
        source: 'EDB / AWS, 2024',
        sourceEn: 'EDB / AWS, 2024',
        sourceUrl:
          'https://press.aboutamazon.com/sg/aws/2024/5/aws-to-invest-an-additional-sg-12-billion-in-singapore-by-2028-and-announces-flagship-ai-programme',
      },
      {
        name: 'Google 数据中心 + AI 投资',
        nameJa: 'Google データセンター + AI 投資',
        nameEn: 'Google data centre + AI investment',
        value: 'US$9B / ~S$11.6B + DeepMind 实验室',
        valueJa: 'US$9B / ~S$11.6B + DeepMind ラボ',
        valueEn: 'US$9B / ~S$11.6B + DeepMind lab',
        source: 'Google / EDB, 2026',
        sourceEn: 'Google / EDB, 2026',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'Enterprise Compute Initiative (ECI)',
        nameEn: 'Enterprise Compute Initiative (ECI)',
        value: 'S$150M（企业算力补贴）',
        valueJa: 'S$150M（エンタープライズ計算補助）',
        valueEn: 'S$150M (enterprise compute subsidy)',
        source: 'IMDA, 2026.2',
        sourceEn: 'IMDA, 2026-02',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'Anchor Fund @ 65 第二批',
        nameJa: 'Anchor Fund @ 65 第二陣',
        nameEn: 'Anchor Fund @ 65 (second tranche)',
        value: 'S$1.5B（IPO 锚定基金，2026）',
        valueJa: 'S$1.5B（IPO アンカーファンド、2026）',
        valueEn: 'S$1.5B (IPO anchor fund, 2026)',
        source: 'Budget 2026, 2026.2',
        sourceEn: 'Budget 2026, 2026-02',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'Future Sectors Development Fund (FSDF)',
        nameEn: 'Future Sectors Development Fund (FSDF)',
        value: 'S$1.5B（2026 启动）',
        valueJa: 'S$1.5B（2026 年開始）',
        valueEn: 'S$1.5B (launched 2026)',
        source: 'Budget 2026',
        sourceEn: 'Budget 2026',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'EQDP 私募股权基金扩张',
        nameJa: 'EQDP プライベートエクイティファンド拡張',
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
        valueJa: 'S$100M（建設業デジタル基盤、2025 年から）',
        valueEn: 'S$100M (built environment digital infrastructure, from 2025)',
        source: 'BCA, 2025',
        sourceEn: 'BCA, 2025',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'Built Environment AI CoE',
        nameEn: 'Built Environment AI CoE',
        value: 'S$30M（2024 起）',
        valueJa: 'S$30M（2024 年から）',
        valueEn: 'S$30M (from 2024)',
        source: 'BCA / NUS / NTU, 2024',
        sourceEn: 'BCA / NUS / NTU, 2024',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'NEA Weather Science Programme',
        nameEn: 'NEA Weather Science Programme',
        value: 'S$25M（2024 起）',
        valueJa: 'S$25M（2024 年から）',
        valueEn: 'S$25M (from 2024)',
        source: 'NEA, 2024',
        sourceEn: 'NEA, 2024',
        sourceUrl: 'https://www.nea.gov.sg/',
      },
      {
        name: 'HTX 人形机器人中心 (H2RC)',
        nameJa: 'HTX ヒューマノイドロボットセンター(H2RC)',
        nameEn: 'HTX Humanoid Robotics Centre (H2RC)',
        value: 'S$100M（2026 Q2 启动）',
        valueJa: 'S$100M（2026 Q2 開始）',
        valueEn: 'S$100M (launching Q2 2026)',
        source: 'HTX, 2026',
        sourceEn: 'HTX, 2026',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'National Multimodal LLM Programme',
        nameEn: 'National Multimodal LLM Programme',
        value: 'S$70M（A*STAR 主导）',
        valueJa: 'S$70M（A*STAR が主導）',
        valueEn: 'S$70M (led by A*STAR)',
        source: 'A*STAR / AISG',
        sourceEn: 'A*STAR / AISG',
        sourceUrl: 'https://www.a-star.edu.sg/',
      },
      {
        name: 'Singapore AI Safety Institute (AISI)',
        nameEn: 'Singapore AI Safety Institute (AISI)',
        value: 'S$10M/年（治理研究）',
        valueJa: 'S$10M/年（ガバナンス研究）',
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
    titleJa: '人材貯蔵',
    titleEn: 'Talent Pipeline',
    oneLiner: '人够不够、自给率多少？',
    oneLinerJa: '十分な人材がいるか、自給率はどの程度か？',
    oneLinerEn: 'Are there enough people, and how self-sufficient is the supply?',
    trend: 'up',
    headline: '5,000 / 15,000',
    headlineEn: '5,000 / 15,000',
    benchmark: '目标 2029 完成 33%（外籍占比 35%）',
    benchmarkJa: '2029 年までの目標達成率 33%（外籍占有率 35%）',
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
        sourceJa: 'Tortoise Global AI Index Talent サブ項目',
        sourceEn: 'Tortoise Global AI Index — Talent sub-score',
        rank: '~#6–8',
        url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        source: 'SkillsFuture (2025)',
        rank: '105K 人 / 1,600 课程',
        rankJa: '105K 人 / 1,600 コース',
        rankEn: '105K people / 1,600 courses',
        url: 'https://www.skillsfuture.gov.sg/',
      },
      {
        source: 'TeSA',
        rank: '21K 本地人就业 + 340K 技能提升',
        rankJa: '21K 地元就業 + 340K スキル向上',
        rankEn: '21K locals placed + 340K reskilled',
        url: 'https://www.imda.gov.sg/',
      },
    ],
    judgment:
      '盘子在涨——SkillsFuture 105K 入读、TeSA 安置 21K、AIAP 22 批毕业 ~500–600 人——但目标完成度 33% 和外籍占比 35% 说明自给率仍是结构性问题。Tortoise Talent 子项在 #6–8 区间，距离美国差一截。',
    judgmentJa:
      '規模は拡大中——SkillsFuture 105K 入学、TeSA 配置 21K、AIAP 22 回卒業 ~500–600 人——しかし目標達成率 33% と外籍占有率 35% は自給率が依然として構造的課題であることを示しています。Tortoise Talent サブ項は #6–8 範囲で、米国とは一段階の差があります。',
    judgmentEn:
      'The pool is growing — 105K SkillsFuture enrolments, 21K TeSA placements, ~500–600 AIAP graduates over 22 cohorts — but 33% completion against the 15K target and a steady 35% foreign share point to a structural self-sufficiency gap. Tortoise Talent sits in the #6–8 range, well behind the US.',
    shortcoming:
      'AIAP 60 人/批是产能瓶颈；本地名校 AI 博士流失率高（去美/去工业界）；"AI Bilingual 100K" H1 2026 才上线（会计/法律首批），效果未知；非工程岗位（产品、设计、销售）培训供给薄弱。',
    shortcomingJa:
      'AIAP 60 人/回は生産能力のボトルネック；地元名門校の AI 博士の流出率が高い（米国へ、業界へ）；「AI 双言語 100K」H1 2026 にようやく上線（会計/法律が最初）、効果は不明；非エンジニア職（製品、設計、営業）の訓練供給が薄弱。',
    shortcomingEn:
      'AIAP capacity is capped at ~60 apprentices per cohort. Top local AI PhDs leak to the US or industry. "AI Bilingual 100K" only launches H1 2026 (accounting/legal first) — outcomes unknown. Non-engineering AI roles (PM, design, sales) are undersupplied.',
    metrics: [
      {
        name: 'AI 专业人才目标',
        nameJa: 'AI 専門人材目標',
        nameEn: 'AI professional headcount target',
        value: '2019 年 2,000 → 2023 年 5,000 → 2029 年目标 15,000（外籍占 35%）',
        valueJa: '2019 年 2,000 → 2023 年 5,000 → 2029 年目標 15,000（外籍占有 35%）',
        valueEn: '2,000 (2019) → 5,000 (2023) → 15,000 target (2029, 35% foreign)',
        source: 'MDDI, 2026.1',
        sourceEn: 'MDDI, 2026-01',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: 'SkillsFuture AI 培训',
        nameJa: 'SkillsFuture AI 訓練',
        nameEn: 'SkillsFuture AI training',
        value: '105,000+ 人参加 1,600+ AI 课程（2025）',
        valueJa: '105,000+ 人が 1,600+ AI コースに参加（2025）',
        valueEn: '105,000+ enrolments across 1,600+ AI courses (2025)',
        source: 'SSG / Straits Times, 2026.2',
        sourceEn: 'SSG / Straits Times, 2026-02',
        sourceUrl: 'https://www.straitstimes.com/tags/artificial-intelligence',
      },
      {
        name: 'TeSA 科技人才安置',
        nameJa: 'TeSA テック人材配置',
        nameEn: 'TeSA tech jobs placed',
        value: '21,000+ 本地人就业（自 2016）',
        valueJa: '21,000+ 地元労働者が就業（2016 年から）',
        valueEn: '21,000+ locals placed (since 2016)',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'TeSA 技能提升',
        nameJa: 'TeSA スキル向上',
        nameEn: 'TeSA reskilling',
        value: '340,000+ 人（自 2016）',
        valueJa: '340,000+ 人（2016 年から）',
        valueEn: '340,000+ people (since 2016)',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AIAP 学徒计划',
        nameJa: 'AIAP 研修生計画',
        nameEn: 'AIAP apprenticeship',
        value: '22 批完成，~500-600 毕业生，>90% 就业率，当前~60 人/批',
        valueJa: '22 回完了、~500-600 卒業生、>90% 就職率、現在 ~60 人/回',
        valueEn: '22 cohorts completed, ~500-600 graduates, >90% placement, ~60 apprentices/cohort',
        source: 'AISG AIAP, 2026.2',
        sourceEn: 'AISG AIAP, 2026-02',
        sourceUrl: 'https://aiap.sg/apprenticeship/',
      },
      {
        name: 'Google AI 技能倡议',
        nameJa: 'Google AI スキルイニシアティブ',
        nameEn: 'Google AI skills initiative',
        value: '28,000 人（Skills Ignition SG）；目标 2027 年覆盖 50,000 学生',
        valueJa: '28,000 人（Skills Ignition SG）；2027 年までの目標 50,000 人の学生を対象',
        valueEn: '28,000 trained (Skills Ignition SG); target 50,000 students by 2027',
        source: 'Google for SG, 2026.2',
        sourceEn: 'Google for SG, 2026-02',
        sourceUrl: 'https://www.google.com/',
      },
      {
        name: '职场 AI 使用率',
        nameJa: '職場 AI 使用率',
        nameEn: 'Workplace AI usage',
        value: '3/4 工人定期使用 AI 工具，85% 认为提升效率',
        valueJa: '3/4 の労働者が定期的に AI ツールを使用、85% は効率向上を認識',
        valueEn: '3 in 4 workers use AI tools regularly; 85% report productivity gains',
        source: 'IMDA SGDE Report, 2025',
        sourceEn: 'IMDA SGDE Report, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Springboard 企业计划',
        nameJa: 'AI Springboard エンタープライズ計画',
        nameEn: 'AI Springboard enterprise scheme',
        value: '300 家企业，每家最高 S$600K 补贴',
        valueJa: '300 企業、各社最高 S$600K 補助',
        valueEn: '300 firms, up to S$600K subsidy per firm',
        source: 'EDB, 2025 Q3',
        sourceEn: 'EDB, Q3 2025',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'NAIIP 国家 AI 影响计划',
        nameJa: 'NAIIP 国家 AI インパクト計画',
        nameEn: 'NAIIP National AI Impact Programme',
        value: '10K 企业 + 100K 工人（2026-2029）',
        valueJa: '10K 企業 + 100K 労働者（2026-2029）',
        valueEn: '10K firms + 100K workers (2026-2029)',
        source: 'IMDA + ESG, 2026.2',
        sourceEn: 'IMDA + ESG, 2026-02',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Bilingual 100K 计划',
        nameJa: 'AI 双言語 100K 計画',
        nameEn: 'AI Bilingual 100K programme',
        value: '首批落地：会计 (ISCA) + 法律 (SAL/SCCA)，1H 2026 上线',
        valueJa: '初回配備：会計(ISCA) + 法律(SAL/SCCA)、1H 2026 上線',
        valueEn: 'First waves: accounting (ISCA) + legal (SAL/SCCA), launching H1 2026',
        source: 'MDDI COS 2026',
        sourceEn: 'MDDI COS 2026',
        sourceUrl: 'https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=budget-2895',
      },
      {
        name: 'SkillsFuture AI 课程补贴',
        nameJa: 'SkillsFuture AI コース補助',
        nameEn: 'SkillsFuture AI course subsidy',
        value: '50% / 70% 分层补贴 + Mid-Career S$4,000 Credit',
        valueJa: '50% / 70% 段階的補助 + ミッドキャリア S$4,000 クレジット',
        valueEn: '50% / 70% tiered subsidy + Mid-Career S$4,000 Credit',
        source: 'SSG, 2026',
        sourceEn: 'SSG, 2026',
        sourceUrl: 'https://www.skillsfuture.gov.sg/',
      },
      {
        name: '100E Programme（AI Singapore）',
        nameEn: '100E Programme (AI Singapore)',
        value: '每项目 S$150K 共投，累计 100+ 完成',
        valueJa: '各プロジェクト S$150K 共同投資、累計 100+ 完了',
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
    titleJa: '計算能力基盤',
    titleEn: 'Compute Stack',
    oneLiner: '跑得起前沿模型吗？',
    oneLinerJa: '最先端モデルを実行できるか？',
    oneLinerEn: 'Can it run frontier models?',
    trend: 'flat',
    headline: '1.4 GW',
    headlineEn: '1.4 GW',
    benchmark: '数据中心容量 + 70+ 设施 + NSCC ASPIRE 2A+ 20 PFLOPS',
    benchmarkJa: 'データセンター容量 + 70+ 施設 + NSCC ASPIRE 2A+ 20 PFLOPS',
    benchmarkEn: 'Data centre capacity + 70+ facilities + NSCC ASPIRE 2A+ at 20 PFLOPS',
    progress: {
      description: '额外 300MW 已分配 + 80MW 试点 2026–2028（增量在路上，但电力是天花板）',
      descriptionJa: '追加 300MW が既に配分済み + 80MW パイロット 2026–2028（増分在来中だが、電力がボトルネック）',
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
        rankJa: '世界収益の 15%（一人当たり $600）',
        rankEn: '15% of global revenue (~$600 per capita)',
        url: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        source: 'Introl 2025',
        rank: '全球数据中心市场 $4.16B（2024）',
        rankJa: '世界的なデータセンター市場 $4.16B（2024）',
        rankEn: 'Global data centre market $4.16B (2024)',
        url: 'https://www.imda.gov.sg/',
      },
    ],
    judgment:
      'NSCC ASPIRE 2A+（H100, 20 PFLOPS）+ 商用集群（SMC 2,048 H100/集群）+ Singtel GPU-as-a-Service + 国家计算网格 + HTX NGINE B200 SuperPOD——分层覆盖完整，企业、科研、政府自用都够用。Tortoise 基建排 #2，仅次美国。趋势 → 而非 ↗ 是因为电力配额是天花板。',
    judgmentJa:
      'NSCC ASPIRE 2A+（H100、20 PFLOPS）+ 商用クラスター（SMC 2,048 H100/クラスター）+ Singtel GPU-as-a-Service + 国家コンピュータネットワーク + HTX NGINE B200 SuperPOD——層別カバレッジが完全で、エンタープライズ、科学研究、政府の自用には十分。Tortoise インフラはランク #2 で、米国のみに次ぐ。トレンドが → ではなく ↗ でないのは電力割当がボトルネックだから。',
    judgmentEn:
      'NSCC ASPIRE 2A+ (H100, 20 PFLOPS) + commercial clusters (SMC up to 2,048 H100s) + Singtel GPU-as-a-Service + National Compute Grid + HTX NGINE B200 SuperPOD — full-stack coverage for enterprise, research, and government use. Tortoise ranks infrastructure #2 globally, behind only the US. The trend is flat (→) rather than up because power quotas are the ceiling.',
    shortcoming:
      '电力配额 vs 绿电承诺的张力会卡未来 5 年扩张；前沿芯片（H100/B200）依赖进口，地缘风险存在；自研芯片或定制 ASIC 缺位；东南亚邻国（马来西亚、印尼）正在抢容量，新加坡的"算力中心"地位不是天然的。',
    shortcomingJa:
      '電力割当 vs グリーン電力公約の緊張が今後 5 年の拡張を制限；最先端チップ（H100/B200）の輸入依存、地政学リスク存在；自研チップまたはカスタム ASIC の欠位；東南アジア隣国（マレーシア、インドネシア）が容量を争奪中、シンガポールの「計算能力中心」地位は自然ではない。',
    shortcomingEn:
      'The tension between data-centre power quotas and green-energy commitments will cap expansion over the next 5 years. Frontier chips (H100 / B200) remain import-dependent — geopolitical exposure exists. Domestic chip or custom-ASIC capability is absent. Regional rivals (Malaysia, Indonesia) are competing for capacity — Singapore\'s "compute hub" status is not a given.',
    metrics: [
      // 11 rows from old "基础设施" section
      {
        name: 'NSCC ASPIRE 2A+',
        nameEn: 'NSCC ASPIRE 2A+',
        value: 'NVIDIA H100 集群，20 PetaFLOPS',
        valueJa: 'NVIDIA H100 クラスター、20 PetaFLOPS',
        valueEn: 'NVIDIA H100 cluster, 20 PetaFLOPS',
        source: 'TechTIQ, 2025.12',
        sourceEn: 'TechTIQ, 2025-12',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '国家 AI 计算网格',
        nameJa: '国家 AI コンピュータネットワーク',
        nameEn: 'National AI Compute Grid',
        value: '已宣布，链接全国计算资源',
        valueJa: '既に発表、全国のコンピュータリソースをリンク',
        valueEn: 'Announced, linking national compute resources',
        source: 'SuperAI / DataCenters.com, 2025',
        sourceEn: 'SuperAI / DataCenters.com, 2025',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '商用 GPU 集群',
        nameJa: '商用 GPU クラスター',
        nameEn: 'Commercial GPU clusters',
        value: 'SMC 最高 2,048 张 H100/集群；Singtel GPU-as-a-Service',
        valueJa: 'SMC 最高 2,048 張 H100/クラスター；Singtel GPU-as-a-Service',
        valueEn: 'SMC up to 2,048 H100s per cluster; Singtel GPU-as-a-Service',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'NVIDIA 新加坡营收',
        nameJa: 'NVIDIA シンガポール営収',
        nameEn: 'NVIDIA Singapore revenue',
        value: '占全球 15%（约 $2.7B/季度），人均 $600',
        valueJa: '世界の 15%（約 $2.7B/四半期）、一人当たり $600',
        valueEn: '15% of global revenue (~$2.7B/quarter), ~$600 per capita',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: '数据中心市场',
        nameJa: 'データセンター市場',
        nameEn: 'Data centre market',
        value: '$4.16B（2024），1.4GW 容量，70+ 设施',
        valueJa: '$4.16B（2024）、1.4GW 容量、70+ 施設',
        valueEn: '$4.16B (2024), 1.4GW capacity, 70+ facilities',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '新增数据中心容量',
        nameJa: '新増データセンター容量',
        nameEn: 'New data centre capacity',
        value: '额外 300MW 已分配；80MW 试点（2026-2028）',
        valueJa: '追加 300MW 既配分；80MW パイロット（2026-2028）',
        valueEn: 'Additional 300MW allocated; 80MW pilot (2026-2028)',
        source: 'Reed Smith / Linklaters, 2025',
        sourceEn: 'Reed Smith / Linklaters, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '5G 覆盖',
        nameJa: '5G カバレッジ',
        nameEn: '5G coverage',
        value: '95%+ 独立组网全国覆盖（2022.7 达成，提前 3 年）',
        valueJa: '95%+ スタンドアロンネットワーク全国カバレッジ（2022.7 達成、予定より 3 年早い）',
        valueEn: '95%+ standalone nationwide coverage (achieved 2022-07, 3 years ahead of schedule)',
        source: 'Singtel / CNA, 2022',
        sourceEn: 'Singtel / CNA, 2022',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'HTX NGINE — 家国安全算力',
        nameJa: 'HTX NGINE — 国家セキュリティコンピュータ',
        nameEn: 'HTX NGINE — homeland security compute',
        value: 'NVIDIA B200 DGX SuperPOD（自有）',
        valueJa: 'NVIDIA B200 DGX SuperPOD（自有）',
        valueEn: 'NVIDIA B200 DGX SuperPOD (owned)',
        source: 'HTX',
        sourceEn: 'HTX',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'Synapxe HEALIX',
        nameEn: 'Synapxe HEALIX',
        value: '国家医疗数据 + AI 基础设施',
        valueJa: '国家医療データ + AI 基盤設備',
        valueEn: 'National healthcare data + AI infrastructure',
        source: 'Synapxe',
        sourceEn: 'Synapxe',
        sourceUrl: 'https://www.synapxe.sg/',
      },
      {
        name: 'URA Virtual Singapore',
        nameEn: 'URA Virtual Singapore',
        value: '国家级数字孪生 + ePlanner 3D + Smart Planning Assistant',
        valueJa: '国家級デジタルツイン + ePlanner 3D + スマートプランニングアシスタント',
        valueEn: 'National digital twin + ePlanner 3D + Smart Planning Assistant',
        source: 'URA',
        sourceEn: 'URA',
        sourceUrl: 'https://www.ura.gov.sg/',
      },
      {
        name: 'GovTech Agentspace',
        nameEn: 'GovTech Agentspace',
        value: '亚洲首例 air-gapped agentic AI（公共部门）',
        valueJa: 'アジア初の air-gapped agentic AI（公共部門）',
        valueEn: "Asia's first air-gapped agentic AI (public sector)",
        source: 'GovTech',
        sourceEn: 'GovTech',
        sourceUrl: 'https://www.tech.gov.sg/',
      },
      // 3 data centre investment rows cross-listed from investment dimension
      {
        name: 'Microsoft 数据中心投资',
        nameJa: 'Microsoft データセンター投資',
        nameEn: 'Microsoft data centre investment',
        value: 'S$5.5B（2024-2028）',
        valueEn: 'S$5.5B (2024-2028)',
        source: 'EDB / Microsoft, 2024',
        sourceEn: 'EDB / Microsoft, 2024',
        sourceUrl:
          'https://news.microsoft.com/source/asia/2026/04/01/microsoft-announces-5-5-billion-spend-and-new-microsoft-elevate-programs-to-support-every-tertiary-student-educator-and-nonprofit-to-power-singapores-ai-future/',
      },
      {
        name: 'AWS 数据中心投资',
        nameJa: 'AWS データセンター投資',
        nameEn: 'AWS data centre investment',
        value: 'S$12B（2024-2028）',
        valueEn: 'S$12B (2024-2028)',
        source: 'EDB / AWS, 2024',
        sourceEn: 'EDB / AWS, 2024',
        sourceUrl:
          'https://press.aboutamazon.com/sg/aws/2024/5/aws-to-invest-an-additional-sg-12-billion-in-singapore-by-2028-and-announces-flagship-ai-programme',
      },
      {
        name: 'Google 数据中心 + AI 投资',
        nameJa: 'Google データセンター + AI 投資',
        nameEn: 'Google data centre + AI investment',
        value: 'US$9B / ~S$11.6B + DeepMind 实验室',
        valueJa: 'US$9B / ~S$11.6B + DeepMind ラボ',
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
    titleJa: '産業浸透',
    titleEn: 'Industry Adoption',
    oneLiner: '企业真在用吗？',
    oneLinerJa: '企業は本当に使用しているか？',
    oneLinerEn: 'Are enterprises actually using AI?',
    trend: 'up',
    headline: '62.5% 大企业 / 14.5% SME',
    headlineJa: '62.5% 大企業 / 14.5% SME',
    headlineEn: '62.5% large enterprises / 14.5% SMEs',
    benchmark: 'SME YoY 3 倍增长（2023 4.2% → 2024 14.5%）',
    benchmarkJa: 'SME YoY 3 倍増加（2023 4.2% → 2024 14.5%）',
    benchmarkEn: 'SME adoption tripled YoY (4.2% in 2023 → 14.5% in 2024)',
    progress: {
      description: 'NAIIP 目标 10K 企业 + 100K 工人（2026–2029）',
      descriptionJa: 'NAIIP 目標 10K 企業 + 100K 労働者（2026–2029）',
      descriptionEn: 'NAIIP target: 10K firms + 100K workers (2026–2029)',
      url: 'https://www.imda.gov.sg/',
    },
    rankingAnchors: [
      {
        source: 'Microsoft AI Economy Institute 2026',
        rank: '全球第 2（60.9%，仅次 UAE）',
        rankJa: '世界第 2（60.9%、UAE のみに次ぐ）',
        rankEn: '#2 globally (60.9%, behind UAE only)',
        url: 'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
      },
      {
        source: 'IMDA SGDE 2025',
        rank: '数字经济占 GDP 18.6%（2024）',
        rankJa: 'デジタル経済が GDP に占める割合 18.6%（2024）',
        rankEn: 'Digital economy 18.6% of GDP (2024)',
        url: 'https://www.imda.gov.sg/',
      },
      {
        source: 'DBS (2024)',
        rank: '800+ 模型 / 350+ 用例 / S$750M 经济价值',
        rankJa: '800+ モデル / 350+ ユースケース / S$750M 経済価値',
        rankEn: '800+ models / 350+ use cases / S$750M economic value',
        url: 'https://www.mas.gov.sg/',
      },
    ],
    judgment:
      '大企业达标——Microsoft 测全球 #2、DBS 等头部样板成熟。SME 14.5% YoY 3 倍是真增长，但绝对值仍低，离普及还远。政府自用（Pair / AIBots / VICA）目标 150K 公务员、Note Buddy 5K 医护、AV 巴士、ISO/IEC 42001 全球首张——案例厚但公开渗透率有限。',
    judgmentJa:
      '大企業は基準を達成——Microsoft テストが世界 #2、DBS など大手のサンプル成熟。SME 14.5% YoY 3 倍は真の成長ですが、絶対値はまだ低く、普及まではまだ遠い。政府自用（Pair / AIBots / VICA）は 150K 公務員目標、Note Buddy 5K 医療従事者、AV バス、ISO/IEC 42001 世界初——ケースは厚いですが公開浸透率は限定的。',
    judgmentEn:
      "Large enterprises clear the bar — Microsoft puts Singapore #2 globally, with mature flagships like DBS. SME adoption at 14.5% is a real 3× YoY jump but absolute level is still low — broad penetration is 2–3 years out. Government use (Pair / AIBots / VICA) targets 150K civil servants; Note Buddy is in 5K clinicians; Punggol AV buses live; Changi holds the world's first ISO/IEC 42001 certification — case studies are thick but disclosed penetration rates are limited.",
    shortcoming:
      'SME 14.5% 看起来涨快、绝对值仍低，普惠 AI 还要 2–3 年；政府自用以效率工具为主，决策类 AI 渗透浅；NAIIP 拨款规模未公开，执行力存疑；政府公开渗透率仅有目标无进度，对账困难。',
    shortcomingJa:
      'SME 14.5% は増加が速く見えますが、絶対値はまだ低く、包括的な AI はあと 2–3 年必要；政府自用は効率ツールが主で、決定支援 AI の浸透は浅い；NAIIP 配分規模は非公開で、実行力に疑問；政府公開浸透率は目標のみで進捗なく、対照が困難。',
    shortcomingEn:
      'SME 14.5% looks fast-growing but absolute level is low — broad-based AI usage takes another 2–3 years. Government use is mostly productivity tools; decision-grade AI is shallow. NAIIP funding sizing is not public — execution is hard to assess. Government-side public penetration data has targets but no tracked progress.',
    metrics: [
      // 17 rows from old "产业采用" section + 1 row from old "国际排名" (东南亚深科技融资份额) = 18 total
      {
        name: '数字经济占 GDP',
        nameJa: 'デジタル経済が GDP に占める割合',
        nameEn: 'Digital economy share of GDP',
        value: '18.6%（2024，2019 年为 14.9%）',
        valueJa: '18.6%（2024、2019 年は 14.9%）',
        valueEn: '18.6% (2024, up from 14.9% in 2019)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '大企业 AI 采用率',
        nameJa: '大企業 AI 導入率',
        nameEn: 'Large enterprise AI adoption',
        value: '62.5%（2024）',
        valueEn: '62.5% (2024)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '中小企业 AI 采用率',
        nameJa: '中小企業 AI 導入率',
        nameEn: 'SME AI adoption',
        value: '14.5%（2024，较 2023 年 4.2% 增长 3 倍）',
        valueJa: '14.5%（2024、2023 年の 4.2% から 3 倍増加）',
        valueEn: '14.5% (2024, 3x up from 4.2% in 2023)',
        source: 'IMDA SGDE Report, 2025.10',
        sourceEn: 'IMDA SGDE Report, 2025-10',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: 'AI 创业公司',
        nameJa: 'AI スタートアップ企業',
        nameEn: 'AI startups',
        value: '650+（占东南亚深科技融资 91.1%）',
        valueJa: '650+（東南アジア深科学テック融資の 91.1% を占める）',
        valueEn: '650+ (91.1% of Southeast Asia deep-tech funding)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '独角兽',
        nameJa: 'ユニコーン',
        nameEn: 'Unicorns',
        value: '32 家（截至 2025.7）',
        valueJa: '32 社（2025.7 時点）',
        valueEn: '32 (as of 2025-07)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '东盟 AI 交易份额',
        nameJa: 'ASEAN AI 取引シェア',
        nameEn: 'ASEAN AI deal share',
        value: '58% 交易量，68% 交易金额（2024 前 9 个月）',
        valueJa: '58% 取引量、68% 取引額（2024 年初 9 ヶ月）',
        valueEn: '58% of deal volume, 68% of deal value (first 9 months of 2024)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '企业 AI 培训意愿',
        nameJa: 'エンタープライズ AI 訓練意思',
        nameEn: 'Enterprise AI training intent',
        value: '超过 2/3 使用 AI 的企业计划优先投资员工培训',
        valueJa: 'AI を使用する企業の 2/3 以上が従業員訓練への優先投資を計画',
        valueEn: 'Over 2/3 of AI-using firms plan to prioritise employee training investment',
        source: 'IMDA, 2025.8',
        sourceEn: 'IMDA, 2025-08',
        sourceUrl: 'https://www.imda.gov.sg/',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      {
        name: '医疗 AI 案例',
        nameJa: '医療 AI ケース',
        nameEn: 'Healthcare AI deployments',
        value:
          'ACE-AI 预测糖尿病/高脂血症风险（Synapxe 开发，2027 年初推广至 1,100+ Healthier SG 诊所）；RUSSELL-GPT 减少医生文档时间 50%；Ng Teng Fong 医院流感暴发床位预测算法',
        valueJa:
          'ACE-AI は糖尿病/脂質異常症リスク予測（Synapxe 開発、2027 年初めに 1,100+ Healthier SG クリニックに展開）；RUSSELL-GPT は医師のドキュメント時間を 50% 削減；Ng Teng Fong 病院のインフルエンザ暴発ベッド予測アルゴリズム',
        valueEn:
          'ACE-AI predicts diabetes/hyperlipidemia risk (built by Synapxe, rolling out to 1,100+ Healthier SG clinics in early 2027); RUSSELL-GPT cuts physician documentation time by 50%; Ng Teng Fong Hospital flu-outbreak bed-demand forecasting algorithm',
        source: 'MOH COS 2026 / WEF / NUHS, 2025-2026',
        sourceEn: 'MOH COS 2026 / WEF / NUHS, 2025-2026',
        sourceUrl:
          'https://www.straitstimes.com/singapore/politics/ai-genetic-screening-and-flexible-financing-to-bolster-preventive-medicine-for-super-aged-spore-ong',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: '五大国家 AI 项目',
        nameJa: '5 大国家 AI プロジェクト',
        nameEn: 'Five National AI Projects',
        value: '智能货运规划、市政服务、慢性病管理、个性化教育、边境清关（S$120M）',
        valueJa: 'インテリジェント貨物計画、市政サービス、慢性疾患管理、個別教育、国境検査（S$120M）',
        valueEn:
          'Smart freight planning, municipal services, chronic disease management, personalised education, border clearance (S$120M)',
        source: 'Smart Nation 2.0, 2024.10',
        sourceEn: 'Smart Nation 2.0, 2024-10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Note Buddy 临床 AI 助手',
        nameJa: 'Note Buddy 臨床 AI アシスタント',
        nameEn: 'Note Buddy clinical AI assistant',
        value: '5,000+ 医护使用，67K 病历记录（截至 2025-12）',
        valueJa: '5,000+ 医療従事者が使用、67K 病歴記録（2025-12 時点）',
        valueEn: '5,000+ clinicians using it, 67K case notes (as of 2025-12)',
        source: 'Synapxe / SingHealth, 2025',
        sourceEn: 'Synapxe / SingHealth, 2025',
        sourceUrl: 'https://www.synapxe.sg/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'GovTech Pair 公务员 AI',
        nameJa: 'GovTech Pair 公務員 AI',
        nameEn: 'GovTech Pair (civil-service AI)',
        value: '150K 公务员目标',
        valueJa: '150K 公務員目標',
        valueEn: '150K civil servants target',
        source: 'GovTech',
        sourceEn: 'GovTech',
        sourceUrl:
          'https://www.tech.gov.sg/products-and-services/for-government-agencies/productivity-and-marketing/pair/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Punggol 自动驾驶巴士',
        nameJa: 'Punggol 自動運転バス',
        nameEn: 'Punggol autonomous buses',
        value: '首批商业化 AV，3 条线路（2025-12 上线）',
        valueJa: '初回商業化 AV、3 路線（2025-12 上線）',
        valueEn: 'First commercial AV deployment, 3 routes (live from 2025-12)',
        source: 'LTA',
        sourceEn: 'LTA',
        sourceUrl: 'https://www.lta.gov.sg/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'PSA Tuas Mega Port',
        nameEn: 'PSA Tuas Mega Port',
        value: '2040s 全球最大全自动港',
        valueJa: '2040 年代世界最大全自動港湾',
        valueEn: "World's largest fully automated port by the 2040s",
        source: 'PSA Singapore',
        sourceEn: 'PSA Singapore',
        sourceUrl:
          'https://www.singaporepsa.com/2022/09/01/psa-singapore-opens-tuas-port-a-focal-point-of-the-wider-tuas-ecosystem/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'Changi 机场 AI 治理认证',
        nameJa: 'Changi 空港 AI ガバナンス認証',
        nameEn: 'Changi Airport AI governance certification',
        value: '全球首张 ISO/IEC 42001 AI 治理认证',
        valueJa: '世界初 ISO/IEC 42001 AI ガバナンス認証',
        valueEn: "World's first ISO/IEC 42001 AI governance certification",
        source: 'Changi Airport Group, 2025',
        sourceEn: 'Changi Airport Group, 2025',
        sourceUrl: 'https://www.changiairport.com/',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'HDB Tengah 智能能源镇',
        nameJa: 'HDB Tengah スマートエネルギータウン',
        nameEn: 'HDB Tengah smart-energy town',
        value: '首座智能能源镇，4.2 万户',
        valueJa: '初座スマートエネルギータウン、4.2 万戸',
        valueEn: 'First smart-energy town, 42,000 households',
        source: 'HDB',
        sourceEn: 'HDB',
        sourceUrl: 'https://www.hdb.gov.sg/about-us/our-towns-and-estates/tengah',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'JTC Punggol Digital District',
        nameEn: 'JTC Punggol Digital District',
        value: '首个全区智能区，能耗预计降 30%',
        valueJa: '初全区スマート区、エネルギー消費は 30% 低下予定',
        valueEn: 'First district-wide smart precinct, projected 30% energy reduction',
        source: 'JTC',
        sourceEn: 'JTC',
        sourceUrl: 'https://www.jtc.gov.sg/find-space/punggol-digital-district',
        category: '政府自用',
        categoryJa: '政府自用',
        categoryEn: 'Government Adoption',
      },
      {
        name: 'AI Verify Sandbox',
        nameEn: 'AI Verify Sandbox',
        value: '10+ 跨国大企业参与（IMDA Global AI Assurance Pilot）',
        valueJa: '10+ 多国籍大企業参加（IMDA Global AI Assurance Pilot）',
        valueEn: '10+ multinationals participating (IMDA Global AI Assurance Pilot)',
        source: 'IMDA, 2025',
        sourceEn: 'IMDA, 2025',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
        categoryEn: 'Enterprise Adoption',
      },
      // 1 row migrated from old "国际排名" section
      {
        name: '东南亚深科技融资份额',
        nameJa: '東南アジア深科学テック融資シェア',
        nameEn: 'Share of Southeast Asia deep-tech funding',
        value: '91.1%',
        valueEn: '91.1%',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
        category: '企业采用',
        categoryJa: 'エンタープライズ導入',
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
    titleJa: '研究品質',
    titleEn: 'Research Quality',
    oneLiner: '有真东西出来吗？',
    oneLinerJa: '本当に成果は出ているのか？',
    oneLinerEn: 'Is original research coming out?',
    trend: 'flat',
    headline: '人均论文全球 #1',
    headlineJa: '論文一人当たり世界 #1',
    headlineEn: 'Per-capita papers #1 globally',
    benchmark: 'NTU AI #3（仅次 MIT/CMU）· NUS AI #9',
    benchmarkJa: 'NTU AI #3（MIT/CMU のみに次ぐ）· NUS AI #9',
    benchmarkEn: 'NTU AI #3 (after MIT/CMU) · NUS AI #9',
    progress: {
      description: 'SEA-LION v4（11 语言、4B–33B 参数）+ 100E 100+ 项目 + ICLR 2025 主办',
      descriptionJa: 'SEA-LION v4（11 言語、4B–33B パラメータ）+ 100E 100+ プロジェクト + ICLR 2025 主催',
      descriptionEn: 'SEA-LION v4 (11 languages, 4B–33B params) + 100E (100+ projects) + ICLR 2025 hosted',
    },
    rankingAnchors: [
      {
        source: 'Wiley 2024',
        rank: '人均 AI 论文全球 #1（每百万人 250 篇，2022）',
        rankJa: '論文一人当たり世界 #1（100 万人当たり 250 篇、2022）',
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
    judgmentJa:
      '出力規模と学校ランキングは両方堅実——一人当たり論文 #1、NTU AI #3、NUS #9、ICLR 2025 主催、SEA-LION は英米中以外の有規模なベースモデルは少ない。しかしトップレベルのオリジナル（FAIR/DeepMind クラスの frontier work）はまだ一段階足りない：トップカンファレンス第一著者比率、引用数 1000 超の代表作、自研ベースモデルの市場シェアはまだ足りない。',
    judgmentEn:
      'Volume and university rankings are strong — per-capita papers #1, NTU AI #3, NUS #9, ICLR 2025 hosted, SEA-LION is one of the few non-US/UK/China foundation models at scale. But frontier-grade originality (FAIR / DeepMind tier) still trails by a step: first-author share at top venues, signature works with >1000 citations, market share of self-developed foundation models — all behind.',
    shortcoming:
      '顶会一作占比、被引数、自研基座市场份额都还差一档；顶尖博士流失率高；产学研转化对企业自用强但对外输出弱（无 OpenAI / Anthropic 量级的 spinoff）；原创研究的国际可见度依赖少数明星教授。',
    shortcomingJa:
      'トップカンファレンス第一著者比率、引用数、自研ベースモデル市場シェアはまだ一段階足りない；トップ博士の流出率が高い；産学研転換は企業の自用に強いが、外向け出力は弱い（OpenAI / Anthropic クラスの spinoff がない）；オリジナル研究の国際可視性は少数の著名教授に頼っている。',
    shortcomingEn:
      'First-author share at top venues, citation counts, and self-developed foundation-model market share all trail by a step. Top PhD outflow is high. Research-to-industry transfer is strong for in-house enterprise use but weak as international export — no OpenAI / Anthropic-tier spinout. International visibility hinges on a small number of star professors.',
    metrics: [
      {
        name: 'AI 论文人均发表量',
        nameJa: 'AI 論文一人当たり発表量',
        nameEn: 'AI papers per capita',
        value: '全球第 1（每百万人 250 篇，2022）',
        valueJa: '世界第 1（100 万人当たり 250 篇、2022）',
        valueEn: '#1 globally (250 papers per million people, 2022)',
        source: 'Wiley, 2024.9',
        sourceEn: 'Wiley, 2024-09',
        sourceUrl: 'https://aiindex.stanford.edu/',
      },
      {
        name: 'NTU AI 研究排名',
        nameJa: 'NTU AI 研究ランキング',
        nameEn: 'NTU AI research ranking',
        value: '全球第 3（仅次于 MIT、CMU）',
        valueJa: '世界第 3（MIT、CMU のみに次ぐ）',
        valueEn: '#3 globally (after MIT and CMU)',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        name: 'NUS AI 学术声誉',
        nameJa: 'NUS AI 学術評判',
        nameEn: 'NUS AI academic reputation',
        value: '全球第 9',
        valueJa: '世界第 9',
        valueEn: '#9 globally',
        source: 'Introl, 2025.8',
        sourceEn: 'Introl, 2025-08',
        sourceUrl: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        name: 'SEA-LION 大模型',
        nameJa: 'SEA-LION 大規模モデル',
        nameEn: 'SEA-LION large language model',
        value: 'v4，11+ 语言，4B-33B 参数',
        valueJa: 'v4、11+ 言語、4B-33B パラメータ',
        valueEn: 'v4, 11+ languages, 4B-33B parameters',
        source: 'AISG, 2025',
        sourceEn: 'AISG, 2025',
        sourceUrl: 'https://sea-lion.ai/',
      },
      {
        name: '100 Experiments',
        nameEn: '100 Experiments',
        value: '100+ AI 项目完成（2018-2025，已归档）',
        valueJa: '100+ AI プロジェクト完了（2018-2025、既アーカイブ）',
        valueEn: '100+ AI projects completed (2018-2025, archived)',
        source: 'AISG',
        sourceEn: 'AISG',
        sourceUrl: 'https://aisingapore.org/',
      },
      {
        name: 'ICLR 2025',
        nameEn: 'ICLR 2025',
        value: '在新加坡举办',
        valueJa: 'シンガポールで開催',
        valueEn: 'Hosted in Singapore',
        source: 'ICLR, 2025',
        sourceEn: 'ICLR, 2025',
        sourceUrl: 'https://iclr.cc/',
      },
      {
        name: 'DBS AI 模型',
        nameJa: 'DBS AI モデル',
        nameEn: 'DBS AI models',
        value: '800+ 模型，350+ 用例，2024 年创造 S$750M 经济价值',
        valueJa: '800+ モデル、350+ ユースケース、2024 年に S$750M 経済価値を創造',
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
    titleJa: 'ガバナンス影響力',
    titleEn: 'Governance Influence',
    oneLiner: '规则上是不是话事人？',
    oneLinerJa: 'ルール制定では発言権があるのか？',
    oneLinerEn: 'Is Singapore writing the rules?',
    trend: 'up',
    badge: '规则制定者',
    badgeJa: 'ルール制定者',
    badgeEn: 'Rule-maker',
    judgment:
      'Singapore Consensus on AI Safety 11 国签署（含中美）、ASEAN Guide on AI Governance 10 国采纳（新加坡主导起草）、AI Verify Foundation 在全球被引、REAIM 联合主办、ISESEA 已办两届——新加坡是规则制定者而不是接受者，话语权显著超出体量。Bletchley、Seoul、Paris 三届 AI Safety Summit 全程参与；MAS Project MindForge 拉到 24 家机构 + 四大云厂；UN Independent International Scientific Panel 有席位。',
    judgmentJa:
      'Singapore Consensus on AI Safety 11 国署名（中米を含む）、ASEAN Guide on AI Governance 10 国採用（シンガポール主導起草）、AI Verify Foundation が世界的に引用、REAIM 共同主催、ISESEA 既に 2 回開催——シンガポールはルール制定者であり受け手ではなく、話語権は体量を大きく超えている。Bletchley、Seoul、Paris 3 回 AI Safety Summit に全程参加；MAS Project MindForge 24 機構 + 四大クラウド厂を引き寄せ；UN Independent International Scientific Panel に議席がある。',
    judgmentEn:
      "Singapore Consensus on AI Safety signed by 11 countries (incl. US and China); ASEAN Guide on AI Governance adopted by all 10 ASEAN states (drafted under Singapore's lead); AI Verify Foundation cited globally; REAIM co-hosted; ISESEA held twice — Singapore is a rule-maker, not a rule-taker, with influence well above its size. Full participation in Bletchley, Seoul, and Paris AI Safety Summits; MAS Project MindForge has 24 institutions + the four major cloud vendors; UN Independent International Scientific Panel includes Singapore.",
    rankingAnchors: [
      {
        source: 'Oxford Government AI Readiness 2024',
        rank: '#2（仅次美国）',
        rankJa: '#2（米国のみに次ぐ）',
        rankEn: '#2 (behind the US only)',
        url: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        source: 'Singapore Consensus',
        rank: '11 国签署',
        rankJa: '11 国署名',
        rankEn: 'Signed by 11 countries',
        url: 'https://aiverifyfoundation.sg/',
      },
      {
        source: 'ASEAN Guide on AI Governance',
        rank: '10 国采纳',
        rankJa: '10 国採用',
        rankEn: 'Adopted by 10 ASEAN states',
        url: 'https://asean.org/',
      },
    ],
    shortcoming:
      '规则制定 ≠ 规则被遵守——AI Verify 框架被采纳但执法层面影响力弱；中美 AI 治理分裂时新加坡的"居间者"定位可持续性存疑——任一方要求选边，回旋空间会塌；治理研究投入（AISI S$10M/年）和影响力规模不匹配，结构性投入偏轻。',
    shortcomingJa:
      'ルール制定 ≠ ルール遵守——AI Verify フレームワークは採用されるが、執行層で影響力が弱い；中米 AI ガバナンス分裂時にシンガポールの「仲介者」地位の持続可能性に疑問；ガバナンス研究投入（AISI S$10M/年）と影響力規模がマッチしない、構造的投入が軽い。',
    shortcomingEn:
      'Setting rules ≠ rules being enforced — AI Verify is widely adopted but enforcement-side influence is weak. As US-China AI governance fragments, Singapore\'s "broker" position is hard to sustain — if either side demands picking a side, the room narrows fast. Governance-research investment (AISI at S$10M/year) is mismatched with influence scale — structurally underfunded.',
    metrics: [
      {
        name: 'Singapore Consensus on AI Safety',
        nameEn: 'Singapore Consensus on AI Safety',
        value: '11 国签署（含中美）',
        valueJa: '11 国署名（中米を含む）',
        valueEn: 'Signed by 11 countries (incl. US and China)',
        source: 'IMDA / AISI, 2024',
        sourceEn: 'IMDA / AISI, 2024',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'ASEAN Guide on AI Governance',
        nameEn: 'ASEAN Guide on AI Governance',
        value: '10 国采纳（新加坡主导起草）',
        valueJa: '10 国採用（シンガポール主導起草）',
        valueEn: "Adopted by all 10 ASEAN states (drafted under Singapore's lead)",
        source: 'ASEAN Digital Ministers, 2024',
        sourceEn: 'ASEAN Digital Ministers, 2024',
        sourceUrl: 'https://asean.org/',
      },
      {
        name: 'REAIM Seoul Summit 2024',
        nameEn: 'REAIM Seoul Summit 2024',
        value: '新加坡作为联合主办方（5 国）',
        valueJa: 'シンガポールが共同主催国（5 国）',
        valueEn: 'Singapore as a co-host (one of 5 countries)',
        source: 'MFA / MINDEF, 2024',
        sourceEn: 'MFA / MINDEF, 2024',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'AI Safety Summits 出席',
        nameJa: 'AI Safety Summits 参加',
        nameEn: 'AI Safety Summits attended',
        value: 'Bletchley 2023 + Seoul 2024 + Paris 2025 全部参与',
        valueJa: 'Bletchley 2023 + Seoul 2024 + Paris 2025 全部参加',
        valueEn: 'Bletchley 2023, Seoul 2024 and Paris 2025 — full participation',
        source: 'MFA',
        sourceEn: 'MFA',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'International Scientific Exchange (ISESEA)',
        nameEn: 'International Scientific Exchange (ISESEA)',
        value: '已办两届（2024 + 2026）',
        valueJa: '既に 2 回開催（2024 + 2026）',
        valueEn: 'Two editions held (2024 and 2026)',
        source: 'IMDA / AISI',
        sourceEn: 'IMDA / AISI',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'UN Global Dialogue on AI Governance',
        nameEn: 'UN Global Dialogue on AI Governance',
        value: '新加坡参与 Independent International Scientific Panel',
        valueJa: 'シンガポール参加 Independent International Scientific Panel',
        valueEn: 'Singapore on the Independent International Scientific Panel',
        source: 'UN / MFA',
        sourceEn: 'UN / MFA',
        sourceUrl: 'https://www.un.org/techenvoy/ai-advisory-body',
      },
      {
        name: 'MAS Project MindForge',
        nameEn: 'MAS Project MindForge',
        value: '24 家机构 + Microsoft / AWS / Google / NVIDIA',
        valueJa: '24 機構 + Microsoft / AWS / Google / NVIDIA',
        valueEn: '24 institutions + Microsoft / AWS / Google / NVIDIA',
        source: 'MAS',
        sourceEn: 'MAS',
        sourceUrl: 'https://www.mas.gov.sg/',
      },
    ],
    relatedLeverNumbers: [2, 6],
  },
];

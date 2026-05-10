// AI 创业生态数据
// 基础统计口径截至 2026-02-17；实体档案整理于 2026-05-04

export const ecosystemStats = {
  totalStartups: '650+',
  globalRank: 3,
  seaFundingShare: '68%',
  totalVCRaised: '$8.4B+',
  unicorns: 9,
  govCommitment: 'S$1.6B+',
  dataDate: '2026-02-17',
  profileUpdated: '2026-05-04',
};

export interface Unicorn {
  id?: string;
  name: string;
  sector: string;
  sectorEn?: string;
  sectorJa?: string;
  raised: string;
  valuation: string;
  status: string;
  statusEn?: string;
  statusJa?: string;
  url: string;
}

export const unicorns: Unicorn[] = [
  {
    name: 'Grab',
    sector: '超级应用 / 物流与平台算法',
    sectorJa: 'スーパーアプリ / ロジスティクスとプラットフォームアルゴリズム',
    sectorEn: 'Super app / Logistics and platform algorithms',
    raised: '$12B+',
    valuation: '$20.2B',
    status: '已上市 (NASDAQ)',
    statusJa: '上場済み (NASDAQ)',
    statusEn: 'Listed (NASDAQ)',
    url: 'https://www.grab.com',
  },
  {
    name: 'Trax',
    sector: '零售计算机视觉',
    sectorJa: 'リテール コンピュータビジョン',
    sectorEn: 'Retail Computer Vision',
    raised: '$1.14B',
    valuation: '$2.4B',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://traxretail.com',
  },
  {
    id: 'advance-ai',
    name: 'Advance Intelligence',
    sector: '金融科技 AI / BNPL',
    sectorJa: 'フィンテック AI / BNPL',
    sectorEn: 'FinTech AI / BNPL',
    raised: '$620M',
    valuation: '$2B',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.advance.ai',
  },
  {
    name: 'Biofourmis',
    sector: '数字健康 AI',
    sectorJa: 'デジタルヘルス AI',
    sectorEn: 'Digital Health AI',
    raised: '$463.6M',
    valuation: '$1.3B',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.biofourmis.com',
  },
  {
    name: 'Nium',
    sector: '跨境支付基础设施',
    sectorJa: 'クロスボーダー決済インフラ',
    sectorEn: 'Cross-border payments infrastructure',
    raised: '$312M',
    valuation: '$1.4B',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.nium.com',
  },
  {
    name: 'PatSnap',
    sector: '专利/知识产权 AI',
    sectorJa: '特許/知的財産権 AI',
    sectorEn: 'Patent / IP AI',
    raised: '$300M+',
    valuation: '$1B',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.patsnap.com',
  },
  {
    name: 'Carro',
    sector: '二手车交易与汽车金融平台（AI-enabled）',
    sectorJa: '中古車取引と自動車金融プラットフォーム（AI対応）',
    sectorEn: 'Used-car marketplace and auto-finance platform (AI-enabled)',
    raised: '$1.01B',
    valuation: '$1B+',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.carro.co',
  },
  {
    name: 'Sygnum',
    sector: '数字资产银行',
    sectorJa: 'デジタルアセット銀行',
    sectorEn: 'Digital asset banking',
    raised: '$58M+',
    valuation: '$1B+',
    status: '活跃 (2025.1)',
    statusJa: 'アクティブ (2025.1)',
    statusEn: 'Active (Jan 2025)',
    url: 'https://www.sygnum.com',
  },
  {
    name: 'Near',
    sector: '位置智能 AI',
    sectorJa: 'ロケーションインテリジェンス AI',
    sectorEn: 'Location Intelligence AI',
    raised: '$234M',
    valuation: '—',
    status: '活跃',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://near.com',
  },
];

export interface Startup {
  id?: string;
  name: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  raised?: string;
  investors?: string;
  founded?: string;
  url?: string | null;
  highlight?: string;
  highlightEn?: string;
  highlightJa?: string;
  profile?: string;
  profileEn?: string;
  profileJa?: string;
  aiUseCase?: string;
  aiUseCaseEn?: string;
  aiUseCaseJa?: string;
  singaporeContext?: string;
  singaporeContextEn?: string;
  singaporeContextJa?: string;
  /** YYYY-MM-DD; the date this startup was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates" entry.
   *  Set automatically by emit pipelines; manual additions must set it too.
   *  Old records may be undefined → not surfaced. */
  addedAt?: string;
}

export interface Vertical {
  name: string;
  nameEn?: string;
  nameJa?: string;
  icon: string;
  startups: Startup[];
}

export const verticals: Vertical[] = [
  {
    name: '金融科技',
    nameJa: 'フィンテック',
    nameEn: 'FinTech',
    icon: '🏦',
    startups: [
      {
        name: 'ADVANCE.AI',
        description: 'AI 驱动的数字身份验证和风控',
        descriptionJa: 'AI駆動型デジタル本人確認・リスク管理',
        descriptionEn: 'AI-driven digital identity verification and risk management',
        raised: '$200M',
        url: 'https://www.advance.ai',
      },
      {
        name: 'Aspire',
        description: '中小企业金融平台（AI-enabled）',
        descriptionJa: '中小企業金融プラットフォーム（AI対応）',
        descriptionEn: 'SME finance platform (AI-enabled)',
        raised: '$300M+',
        url: 'https://aspireapp.com',
      },
      {
        name: 'Endowus',
        description: 'AI 智能投顾',
        descriptionJa: 'AI ロボアドバイザー',
        descriptionEn: 'AI robo-advisory',
        raised: '$90M+',
        highlight: 'AUM $7B+',
        highlightEn: 'AUM $7B+',
        url: 'https://endowus.com',
      },
      {
        name: 'Tookitaki',
        description: 'AI 反洗钱合规',
        descriptionJa: 'AI マネーロンダリング対策コンプライアンス',
        descriptionEn: 'AI anti-money laundering compliance',
        raised: '$35M+',
        url: 'https://www.tookitaki.com',
      },
      {
        name: 'CredoLab',
        description: '替代数据 AI 信用评分',
        descriptionJa: 'オルタナティブデータ AI クレジットスコアリング',
        descriptionEn: 'AI credit scoring using alternative data',
        raised: '$12M+',
        url: 'https://www.credolab.com',
      },
      {
        name: 'Transparently.AI',
        description: 'AI 财务欺诈检测',
        descriptionJa: 'AI 財務詐欺検出',
        descriptionEn: 'AI financial fraud detection',
        investors: 'Franklin Templeton',
        url: 'https://www.transparently.ai',
      },
    ],
  },
  {
    name: '医疗健康',
    nameJa: '医療・ヘルスケア',
    nameEn: 'Healthcare',
    icon: '🏥',
    startups: [
      {
        name: 'Biofourmis',
        description: '远程患者监护 AI 平台',
        descriptionJa: '遠隔患者モニタリング AI プラットフォーム',
        descriptionEn: 'AI platform for remote patient monitoring',
        raised: '$463.6M',
        highlight: '独角兽',
        highlightJa: 'ユニコーン',
        highlightEn: 'Unicorn',
        url: 'https://www.biofourmis.com',
      },
      {
        name: 'Qritive',
        description: 'AI 数字病理诊断',
        descriptionJa: 'AI デジタル病理診断',
        descriptionEn: 'AI digital pathology diagnostics',
        raised: '$7.5M+',
        url: 'https://www.qritive.com',
      },
      {
        name: 'Engine Bio',
        description: 'CRISPR + ML 诊断平台',
        descriptionJa: 'CRISPR + ML 診断プラットフォーム',
        descriptionEn: 'CRISPR + ML diagnostics platform',
        raised: '$10M+',
        url: 'https://www.enginebio.com',
      },
      {
        name: 'Bot MD',
        description: '医疗 AI 助手',
        descriptionJa: '医療 AI アシスタント',
        descriptionEn: 'AI assistant for clinicians',
        investors: 'SGInnovate',
        url: 'https://www.botmd.io',
      },
      {
        name: 'Nanyang Biologics',
        description: 'AI 药物发现',
        descriptionJa: 'AI 医薬品発見',
        descriptionEn: 'AI drug discovery',
        highlight: '计划 $1.5B SPAC 上市',
        highlightJa: '$1.5B SPAC上場を計画',
        highlightEn: 'Planned $1.5B SPAC listing',
        url: null,
      },
    ],
  },
  {
    name: '企业 SaaS',
    nameJa: 'エンタープライズ SaaS',
    nameEn: 'Enterprise SaaS',
    icon: '💼',
    startups: [
      {
        name: 'Trax',
        description: '零售 AI 计算机视觉',
        descriptionJa: 'リテール AI コンピュータビジョン',
        descriptionEn: 'Retail AI computer vision',
        raised: '$1.07B',
        highlight: '新加坡融资最多的 AI 公司',
        highlightJa: 'シンガポール資金調達額最大の AI 企業',
        highlightEn: "Singapore's most funded AI company",
        url: 'https://traxretail.com',
      },
      {
        name: 'Near',
        description: '位置智能 AI 平台',
        descriptionJa: 'ロケーションインテリジェンス AI プラットフォーム',
        descriptionEn: 'Location intelligence AI platform',
        raised: '$234M',
        url: 'https://near.com',
      },
      {
        name: 'ViSenze',
        description: 'AI 视觉搜索',
        descriptionJa: 'AI ビジュアルサーチ',
        descriptionEn: 'AI visual search',
        raised: '$34M',
        url: 'https://www.visenze.com',
      },
      {
        name: 'WIZ.AI',
        description: 'Singlish 方言 AI 客服',
        descriptionJa: 'シングリッシュ方言 AI カスタマーサービス',
        descriptionEn: 'AI customer service tuned for Singlish dialects',
        raised: '$10M+',
        url: 'https://www.wiz.ai',
      },
      {
        name: 'Level3AI',
        description: '企业 AI Agent',
        descriptionJa: 'エンタープライズ AI エージェント',
        descriptionEn: 'Enterprise AI agents',
        raised: '$13M (Seed, 2026.1)',
        investors: 'Lightspeed',
        url: null,
      },
    ],
  },
  {
    name: 'AI 基础设施',
    nameJa: 'AI インフラストラクチャ',
    nameEn: 'AI Infrastructure',
    icon: '⚙️',
    startups: [
      {
        name: 'Aicadium',
        description: 'MLOps 平台',
        descriptionJa: 'MLOps プラットフォーム',
        descriptionEn: 'MLOps platform',
        highlight: '被 Temasek 收购',
        highlightJa: 'Temasek に買収される',
        highlightEn: 'Acquired by Temasek',
        url: null,
      },
      {
        name: 'Datature',
        description: '无代码计算机视觉平台',
        descriptionJa: 'ノーコード コンピュータビジョン プラットフォーム',
        descriptionEn: 'No-code computer vision platform',
        investors: 'SGInnovate',
        url: 'https://www.datature.io',
      },
      {
        name: 'Sentient.io',
        description: '东盟 AI API 微服务',
        descriptionJa: 'ASEAN AI API マイクロサービス',
        descriptionEn: 'ASEAN-focused AI API microservices',
        raised: '$7M',
        url: 'https://www.sentient.io',
      },
      {
        name: 'Mindverse AI',
        description: '主权 AI 基础设施',
        descriptionJa: 'ソブリン AI インフラストラクチャ',
        descriptionEn: 'Sovereign AI infrastructure',
        raised: '$5M',
        url: null,
      },
      {
        name: 'Jan',
        description: '离线本地 AI 助手（开源）',
        descriptionJa: 'オフライン・ローカル AI アシスタント（オープンソース）',
        descriptionEn: 'Offline local AI assistant (open source)',
        highlight: 'GitHub 25,000 Stars',
        highlightEn: '25,000 GitHub stars',
        url: 'https://jan.ai',
      },
      {
        name: 'Galatek',
        description: '生命科学/半导体 AI 自动化',
        descriptionJa: 'ライフサイエンス/半導体 AI 自動化',
        descriptionEn: 'AI automation for life sciences and semiconductors',
        raised: '$30M Series A (2025.12)',
        url: null,
      },
    ],
  },
  {
    name: '机器人与自动驾驶',
    nameJa: 'ロボティクスと自動運転',
    nameEn: 'Robotics & Autonomous Vehicles',
    icon: '🤖',
    startups: [
      {
        name: 'Eureka Robotics',
        description: 'AI 精密视觉机器人',
        descriptionJa: 'AI 精密ビジョン ロボット',
        descriptionEn: 'AI-driven precision vision robotics',
        raised: '$10.5M Series A',
        investors: 'B Capital',
        url: 'https://eurekarobotics.com',
      },
      {
        name: 'Augmentus',
        description: '无代码机器人编程',
        descriptionJa: 'ノーコード ロボット プログラミング',
        descriptionEn: 'No-code robotics programming',
        investors: 'Applied Ventures',
        url: 'https://www.augmentus.tech',
      },
      {
        name: 'Botsync',
        description: '自主移动机器人',
        descriptionJa: '自律移動ロボット',
        descriptionEn: 'Autonomous mobile robots',
        investors: 'SGInnovate',
        url: 'https://www.botsync.co',
      },
      {
        name: 'Moovita',
        description: '自动驾驶出行',
        descriptionJa: '自動運転モビリティ',
        descriptionEn: 'Autonomous-vehicle mobility',
        raised: '$5M+',
        url: 'https://www.moovita.com',
      },
    ],
  },
];

export interface Exit {
  id?: string;
  name: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  acquirer: string;
  acquirerEn?: string;
  acquirerJa?: string;
  amount: string;
  year: number | null;
  note: string;
  noteEn?: string;
  noteJa?: string;
}

export const exits: Exit[] = [
  {
    name: 'Manus',
    description: 'AI Agent 平台（Butterfly Effect 旗下）',
    descriptionJa: 'AI エージェント プラットフォーム（Butterfly Effect 傘下）',
    descriptionEn: 'AI agent platform (operated by Butterfly Effect)',
    acquirer: 'Meta（已被中国 NDRC 否决）',
    acquirerJa: 'Meta（既に中国 NDRC により却下）',
    acquirerEn: 'Meta (blocked by China NDRC)',
    amount: '$2B (blocked)',
    year: 2025,
    note: '2025-12 宣布拟收购，2026-04-27 中国国家发改委以国家安全为由叫停（AI 领域首例外资并购否决，三条红线：技术主权 / 数据主权 / 国家安全）。新加坡作为「AI 离岸中转枢纽」战略首次被来源国监管显式划红线。',
    noteJa:
      '2025-12 に買収を発表、2026-04-27 中国国家発展改革委員会が国家安全保障を理由として中止（AI 領域における初の外資M&A却下、3本の赤線：技術主権 / データ主権 / 国家安全保障）。シンガポールの 「AI オフショア・トランジットハブ」 戦略が、発信国の規制当局により初めて明示的に赤線を引かれた。',
    noteEn:
      'Acquisition announced December 2025; blocked by China\'s NDRC on 27 April 2026 on national-security grounds — the first foreign acquisition vetoed in the AI sector, citing three red lines: technology sovereignty, data sovereignty, and national security. Singapore\'s "AI offshore transit hub" strategy was, for the first time, explicitly red-lined by a source-country regulator.',
  },
  {
    name: 'AIDA Technologies',
    description: 'AI 决策引擎',
    descriptionJa: 'AI 意思決定エンジン',
    descriptionEn: 'AI decision engine',
    acquirer: '被收购',
    acquirerJa: '買収される',
    acquirerEn: 'Acquired',
    amount: '—',
    year: null,
    note: 'SGInnovate 投资组合',
    noteJa: 'SGInnovate ポートフォリオ',
    noteEn: 'SGInnovate portfolio company',
  },
  {
    name: 'Musiio',
    description: 'AI 音乐标签',
    descriptionJa: 'AI ミュージックレーベル',
    descriptionEn: 'AI music tagging',
    acquirer: 'SoundCloud',
    acquirerEn: 'SoundCloud',
    amount: '—',
    year: 2022,
    note: '',
    noteEn: '',
  },
  {
    name: 'Pencil',
    description: 'AI 广告创意生成',
    descriptionJa: 'AI 広告クリエイティブ生成',
    descriptionEn: 'AI ad-creative generation',
    acquirer: 'Brandtech Group',
    acquirerEn: 'Brandtech Group',
    amount: '—',
    year: 2022,
    note: '',
    noteEn: '',
  },
  {
    name: 'TabSquare',
    description: 'AI 餐厅管理',
    descriptionJa: 'AI レストラン管理',
    descriptionEn: 'AI restaurant management',
    acquirer: 'Olo',
    acquirerEn: 'Olo',
    amount: '—',
    year: null,
    note: '',
    noteEn: '',
  },
];

export interface Investor {
  id?: string;
  name: string;
  type: string;
  typeEn?: string;
  typeJa?: string;
  stats: string;
  statsEn?: string;
  statsJa?: string;
  focus: string;
  focusEn?: string;
  focusJa?: string;
  url: string;
}

export const investors: Investor[] = [
  {
    name: 'SGInnovate',
    type: '政府深科技投资',
    typeJa: '政府によるディープテック投資',
    typeEn: 'Government deep-tech investor',
    stats: '167 笔投资，25 个退出',
    statsJa: '167件の投資、25件のエグジット',
    statsEn: '167 investments, 25 exits',
    focus: 'AI、量子、区块链',
    focusJa: 'AI・量子・ブロックチェーン',
    focusEn: 'AI, quantum, blockchain',
    url: 'https://www.sginnovate.com/',
  },
  {
    name: 'Temasek',
    type: '主权财富基金',
    typeJa: 'ソブリンウエルスファンド',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 60 笔交易',
    statsJa: '2025年 60件の取引',
    statsEn: '60 deals in 2025',
    focus: 'AI 基础设施、数据中心',
    focusJa: 'AI インフラストラクチャ、データセンター',
    focusEn: 'AI infrastructure, data centres',
    url: 'https://www.temasek.com.sg/en/index',
  },
  {
    name: 'GIC',
    type: '主权财富基金',
    typeJa: 'ソブリンウエルスファンド',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 42 笔交易',
    statsJa: '2025年 42件の取引',
    statsEn: '42 deals in 2025',
    focus: 'AI 基础设施',
    focusJa: 'AI インフラストラクチャ',
    focusEn: 'AI infrastructure',
    url: 'https://www.gic.com.sg/',
  },
  {
    name: 'Antler',
    type: '早期 VC',
    typeJa: 'アーリーステージ VC',
    typeEn: 'Early-stage VC',
    stats: '最活跃早期投资者，2025 年 14 家 AI',
    statsJa: '最もアクティブなアーリーステージ投資家、2025年 14社の AI 企業に投資',
    statsEn: 'Most active early-stage investor; 14 AI deals in 2025',
    focus: 'AI 创业',
    focusJa: 'AI スタートアップ',
    focusEn: 'AI startups',
    url: 'https://www.antler.co/',
  },
  {
    name: 'Vertex Ventures',
    type: 'VC (Temasek)',
    typeEn: 'VC (Temasek)',
    stats: '—',
    statsEn: '—',
    focus: '东南亚科技',
    focusJa: '東南アジア テクノロジー',
    focusEn: 'Southeast Asian tech',
    url: 'https://www.vertexventures.sg/',
  },
  {
    name: "Monk's Hill Ventures",
    type: 'VC',
    typeEn: 'VC',
    stats: '—',
    statsEn: '—',
    focus: '东南亚科技',
    focusJa: '東南アジア テクノロジー',
    focusEn: 'Southeast Asian tech',
    url: 'https://www.monkshill.com/',
  },
];

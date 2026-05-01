// AI 创业生态数据
// 数据截至 2026-02-17

export const ecosystemStats = {
  totalStartups: '650+',
  globalRank: 3,
  seaFundingShare: '68%',
  totalVCRaised: '$8.4B+',
  unicorns: 9,
  govCommitment: 'S$1.6B+',
  dataDate: '2026-02-17',
};

export interface Unicorn {
  name: string;
  sector: string;
  sectorEn?: string;
  raised: string;
  valuation: string;
  status: string;
  statusEn?: string;
  url: string;
}

export const unicorns: Unicorn[] = [
  {
    name: 'Grab',
    sector: '超级应用 / 物流 AI',
    sectorEn: 'Super App / Logistics AI',
    raised: '$12B+',
    valuation: '$20.2B',
    status: '已上市 (NASDAQ)',
    statusEn: 'Listed (NASDAQ)',
    url: 'https://www.grab.com',
  },
  {
    name: 'Trax',
    sector: '零售计算机视觉',
    sectorEn: 'Retail Computer Vision',
    raised: '$1.14B',
    valuation: '$2.4B',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://traxretail.com',
  },
  {
    name: 'Advance Intelligence',
    sector: '金融科技 AI / BNPL',
    sectorEn: 'FinTech AI / BNPL',
    raised: '$620M',
    valuation: '$2B',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://www.advance.ai',
  },
  {
    name: 'Biofourmis',
    sector: '数字健康 AI',
    sectorEn: 'Digital Health AI',
    raised: '$463.6M',
    valuation: '$1.3B',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://www.biofourmis.com',
  },
  {
    name: 'Nium',
    sector: '支付 AI',
    sectorEn: 'Payments AI',
    raised: '$312M',
    valuation: '$1.4B',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://www.nium.com',
  },
  {
    name: 'PatSnap',
    sector: '专利/知识产权 AI',
    sectorEn: 'Patent / IP AI',
    raised: '$300M+',
    valuation: '$1B',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://www.patsnap.com',
  },
  {
    name: 'Carro',
    sector: '汽车 AI',
    sectorEn: 'Automotive AI',
    raised: '$1.01B',
    valuation: '$1B+',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://www.carro.co',
  },
  {
    name: 'Sygnum',
    sector: '数字资产/AI 银行',
    sectorEn: 'Digital Assets / AI Banking',
    raised: '$58M+',
    valuation: '$1B+',
    status: '活跃 (2025.1)',
    statusEn: 'Active (Jan 2025)',
    url: 'https://www.sygnum.com',
  },
  {
    name: 'Near',
    sector: '位置智能 AI',
    sectorEn: 'Location Intelligence AI',
    raised: '$234M',
    valuation: '—',
    status: '活跃',
    statusEn: 'Active',
    url: 'https://near.com',
  },
];

export interface Startup {
  name: string;
  description: string;
  descriptionEn?: string;
  raised?: string;
  investors?: string;
  founded?: string;
  url?: string | null;
  highlight?: string;
  highlightEn?: string;
}

export interface Vertical {
  name: string;
  nameEn?: string;
  icon: string;
  startups: Startup[];
}

export const verticals: Vertical[] = [
  {
    name: '金融科技',
    nameEn: 'FinTech',
    icon: '🏦',
    startups: [
      {
        name: 'ADVANCE.AI',
        description: 'AI 驱动的数字身份验证和风控',
        descriptionEn: 'AI-driven digital identity verification and risk management',
        raised: '$200M',
        url: 'https://www.advance.ai',
      },
      {
        name: 'Aspire',
        description: 'AI 驱动的中小企业金融平台',
        descriptionEn: 'AI-driven financial platform for SMEs',
        raised: '$300M+',
        url: 'https://aspireapp.com',
      },
      {
        name: 'Endowus',
        description: 'AI 智能投顾',
        descriptionEn: 'AI robo-advisory',
        raised: '$90M+',
        highlight: 'AUM $7B+',
        highlightEn: 'AUM $7B+',
        url: 'https://endowus.com',
      },
      {
        name: 'Tookitaki',
        description: 'AI 反洗钱合规',
        descriptionEn: 'AI anti-money laundering compliance',
        raised: '$35M+',
        url: 'https://www.tookitaki.com',
      },
      {
        name: 'CredoLab',
        description: '替代数据 AI 信用评分',
        descriptionEn: 'AI credit scoring using alternative data',
        raised: '$12M+',
        url: 'https://www.credolab.com',
      },
      {
        name: 'Transparently.AI',
        description: 'AI 财务欺诈检测',
        descriptionEn: 'AI financial fraud detection',
        investors: 'Franklin Templeton',
        url: 'https://www.transparently.ai',
      },
    ],
  },
  {
    name: '医疗健康',
    nameEn: 'Healthcare',
    icon: '🏥',
    startups: [
      {
        name: 'Biofourmis',
        description: '远程患者监护 AI 平台',
        descriptionEn: 'AI platform for remote patient monitoring',
        raised: '$463.6M',
        highlight: '独角兽',
        highlightEn: 'Unicorn',
        url: 'https://www.biofourmis.com',
      },
      {
        name: 'Qritive',
        description: 'AI 数字病理诊断',
        descriptionEn: 'AI digital pathology diagnostics',
        raised: '$7.5M+',
        url: 'https://www.qritive.com',
      },
      {
        name: 'Engine Bio',
        description: 'CRISPR + ML 诊断平台',
        descriptionEn: 'CRISPR + ML diagnostics platform',
        raised: '$10M+',
        url: 'https://www.enginebio.com',
      },
      {
        name: 'Bot MD',
        description: '医疗 AI 助手',
        descriptionEn: 'AI assistant for clinicians',
        investors: 'SGInnovate',
        url: 'https://www.botmd.io',
      },
      {
        name: 'Nanyang Biologics',
        description: 'AI 药物发现',
        descriptionEn: 'AI drug discovery',
        highlight: '计划 $1.5B SPAC 上市',
        highlightEn: 'Planned $1.5B SPAC listing',
        url: null,
      },
    ],
  },
  {
    name: '企业 SaaS',
    nameEn: 'Enterprise SaaS',
    icon: '💼',
    startups: [
      {
        name: 'Trax',
        description: '零售 AI 计算机视觉',
        descriptionEn: 'Retail AI computer vision',
        raised: '$1.07B',
        highlight: '新加坡融资最多的 AI 公司',
        highlightEn: "Singapore's most funded AI company",
        url: 'https://traxretail.com',
      },
      {
        name: 'Near',
        description: '位置智能 AI 平台',
        descriptionEn: 'Location intelligence AI platform',
        raised: '$234M',
        url: 'https://near.com',
      },
      {
        name: 'ViSenze',
        description: 'AI 视觉搜索',
        descriptionEn: 'AI visual search',
        raised: '$34M',
        url: 'https://www.visenze.com',
      },
      {
        name: 'WIZ.AI',
        description: 'Singlish 方言 AI 客服',
        descriptionEn: 'AI customer service tuned for Singlish dialects',
        raised: '$10M+',
        url: 'https://www.wiz.ai',
      },
      {
        name: 'Level3AI',
        description: '企业 AI Agent',
        descriptionEn: 'Enterprise AI agents',
        raised: '$13M (Seed, 2026.1)',
        investors: 'Lightspeed',
        url: null,
      },
    ],
  },
  {
    name: 'AI 基础设施',
    nameEn: 'AI Infrastructure',
    icon: '⚙️',
    startups: [
      {
        name: 'Aicadium',
        description: 'MLOps 平台',
        descriptionEn: 'MLOps platform',
        highlight: '被 Temasek 收购',
        highlightEn: 'Acquired by Temasek',
        url: null,
      },
      {
        name: 'Datature',
        description: '无代码计算机视觉平台',
        descriptionEn: 'No-code computer vision platform',
        investors: 'SGInnovate',
        url: 'https://www.datature.io',
      },
      {
        name: 'Sentient.io',
        description: '东盟 AI API 微服务',
        descriptionEn: 'ASEAN-focused AI API microservices',
        raised: '$7M',
        url: 'https://www.sentient.io',
      },
      {
        name: 'Mindverse AI',
        description: '主权 AI 基础设施',
        descriptionEn: 'Sovereign AI infrastructure',
        raised: '$5M',
        url: null,
      },
      {
        name: 'Jan',
        description: '离线本地 AI 助手（开源）',
        descriptionEn: 'Offline local AI assistant (open source)',
        highlight: 'GitHub 25,000 Stars',
        highlightEn: '25,000 GitHub stars',
        url: 'https://jan.ai',
      },
      {
        name: 'Galatek',
        description: '生命科学/半导体 AI 自动化',
        descriptionEn: 'AI automation for life sciences and semiconductors',
        raised: '$30M Series A (2025.12)',
        url: null,
      },
    ],
  },
  {
    name: '机器人与自动驾驶',
    nameEn: 'Robotics & Autonomous Vehicles',
    icon: '🤖',
    startups: [
      {
        name: 'Eureka Robotics',
        description: 'AI 精密视觉机器人',
        descriptionEn: 'AI-driven precision vision robotics',
        raised: '$10.5M Series A',
        investors: 'B Capital',
        url: 'https://eurekarobotics.com',
      },
      {
        name: 'Augmentus',
        description: '无代码机器人编程',
        descriptionEn: 'No-code robotics programming',
        investors: 'Applied Ventures',
        url: 'https://www.augmentus.tech',
      },
      {
        name: 'Botsync',
        description: '自主移动机器人',
        descriptionEn: 'Autonomous mobile robots',
        investors: 'SGInnovate',
        url: 'https://www.botsync.co',
      },
      {
        name: 'Moovita',
        description: '自动驾驶出行',
        descriptionEn: 'Autonomous-vehicle mobility',
        raised: '$5M+',
        url: 'https://www.moovita.com',
      },
    ],
  },
];

export interface Exit {
  name: string;
  description: string;
  descriptionEn?: string;
  acquirer: string;
  acquirerEn?: string;
  amount: string;
  year: number | null;
  note: string;
  noteEn?: string;
}

export const exits: Exit[] = [
  {
    name: 'Manus',
    description: 'AI Agent 平台',
    descriptionEn: 'AI agent platform',
    acquirer: 'Meta',
    acquirerEn: 'Meta',
    amount: '$2B+',
    year: 2025,
    note: '新加坡最大 AI 收购案',
    noteEn: "Singapore's largest AI acquisition",
  },
  {
    name: 'AIDA Technologies',
    description: 'AI 决策引擎',
    descriptionEn: 'AI decision engine',
    acquirer: '被收购',
    acquirerEn: 'Acquired',
    amount: '—',
    year: null,
    note: 'SGInnovate 投资组合',
    noteEn: 'SGInnovate portfolio company',
  },
  {
    name: 'Musiio',
    description: 'AI 音乐标签',
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
  name: string;
  type: string;
  typeEn?: string;
  stats: string;
  statsEn?: string;
  focus: string;
  focusEn?: string;
}

export const investors: Investor[] = [
  {
    name: 'SGInnovate',
    type: '政府深科技投资',
    typeEn: 'Government deep-tech investor',
    stats: '167 笔投资，25 个退出',
    statsEn: '167 investments, 25 exits',
    focus: 'AI、量子、区块链',
    focusEn: 'AI, quantum, blockchain',
  },
  {
    name: 'Temasek',
    type: '主权财富基金',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 60 笔交易',
    statsEn: '60 deals in 2025',
    focus: 'AI 基础设施、数据中心',
    focusEn: 'AI infrastructure, data centres',
  },
  {
    name: 'GIC',
    type: '主权财富基金',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 42 笔交易',
    statsEn: '42 deals in 2025',
    focus: 'AI 基础设施',
    focusEn: 'AI infrastructure',
  },
  {
    name: 'Antler',
    type: '早期 VC',
    typeEn: 'Early-stage VC',
    stats: '最活跃早期投资者，2025 年 14 家 AI',
    statsEn: 'Most active early-stage investor; 14 AI deals in 2025',
    focus: 'AI 创业',
    focusEn: 'AI startups',
  },
  {
    name: 'Vertex Ventures',
    type: 'VC (Temasek)',
    typeEn: 'VC (Temasek)',
    stats: '—',
    statsEn: '—',
    focus: '东南亚科技',
    focusEn: 'Southeast Asian tech',
  },
  {
    name: "Monk's Hill Ventures",
    type: 'VC',
    typeEn: 'VC',
    stats: '—',
    statsEn: '—',
    focus: '东南亚科技',
    focusEn: 'Southeast Asian tech',
  },
];

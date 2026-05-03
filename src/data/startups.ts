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
    title: '苹果因AI热潮导致供应枯竭，将Mac mini起价提高至799美元',
    titleEn: 'Apple raises Mac mini\'s starting price to US$799 after AI frenzy drains supply',
    description: '苹果停止销售原价599美元的Mac mini入门款，并将起价提升至799美元，该入门款配置包含M4芯片和256GB存储空间。供应短缺主要由两个因素驱动：先进制程芯片产能有限，以及消费者对用于运行AI和智能工具的Mac mini和Mac Studio的需求超过预期。苹果首席执行官蒂姆·库克表示，恢复供需平衡可能需要数个月。',
    descriptionEn: 'Apple has discontinued its entry-level Mac mini model priced at US$599 and raised the starting price to US$799 with 512GB storage, up from the previous 256GB configuration. The supply shortages stem from two factors: constrained availability of advanced semiconductor nodes and higher-than-expected consumer demand for Mac mini and Mac Studio as platforms for running AI and agentic tools. CEO Tim Cook stated it may take several months to reach supply-demand balance.',
    category: '新公司',
    confidence: 'low',
    sourceUrl: 'https://www.businesstimes.com.sg/companies-markets/apple-raises-mac-minis-starting-price-us799-after-ai-frenzy-drains-supply',
    discoveredAt: '2026-05-03',
    reasonForLowConfidence: 'This article is about Apple\'s pricing and supply chain adjustments, not about Singapore AI startup ecosystem events (company launches, funding rounds, exits, or investors). It does not fit any of the five required categories: 独角兽 (unicorn), 融资轮 (funding round), 退出 (exit), 投资机构 (investor/fund), or 新公司 (new company). Apple is a large multinational corporation, not a Singapore AI startup.',
  },
  {
    title: '霍尔木兹海峡封闭暴露台湾和韩国的AI能源陷阱',
    titleEn: 'Hormuz closure exposes Taiwan and Korea\'s AI energy trap',
    description: '台湾和韩国作为全球AI芯片制造的核心力量，近年来加大了对进口天然气的依赖以满足电力需求。受中东霍尔木兹海峡危机影响，两国面临能源供应风险，特别是当地政府和企业反而计划进一步扩大液化天然气发电能力，而这与国际大客户对碳中立供应链的要求相悖。',
    descriptionEn: 'Taiwan and South Korea, as critical manufacturers of advanced AI semiconductors, have deepened their dependence on imported natural gas for power generation in recent years. The ongoing Strait of Hormuz crisis has exposed this structural vulnerability, as both countries rely on Middle East energy imports for over 90% of their energy needs. Despite pressure from major customers like Apple, Google, and Microsoft demanding carbon-neutral supply chains, both governments are expanding LNG-based generation capacity, creating a conflict between growth ambitions and environmental commitments.',
    category: '独角兽',
    confidence: 'low',
    sourceUrl: 'https://www.businesstimes.com.sg/international/hormuz-closure-exposes-taiwan-and-koreas-ai-energy-trap',
    discoveredAt: '2026-05-03',
    reasonForLowConfidence: 'This article is primarily a geopolitical and energy policy analysis of Taiwan and South Korea\'s semiconductor industries. It does not describe a specific company launch, funding round, exit, or investor activity. While it mentions major companies (TSMC, Samsung, SK Hynix, Ørsted), the content focuses on industry-wide energy vulnerabilities and policy risks rather than discrete investment or corporate events. The article does not match any of the required Singapore AI startup ecosystem categories.',
  },
  {
    title: 'Meta-Manus交易反转重塑全球AI初创企业格局',
    titleEn: 'Meta-Manus deal reversal redraws lines for global AI startups',
    description: '中国下令Meta撤销对新加坡AI公司Manus的20亿美元收购，引发全球有中国背景的AI创业者恐慌。该决定源于中国对知识产权转移的安全审查。多位创业者现已开始采取保守策略，包括延迟融资公开、强调新加坡注册身份，以及建立分离的全球和中国业务实体，以规避类似Manus的国家安全审查风险。',
    descriptionEn: 'China\'s order to unwind Meta\'s US$2 billion acquisition of Singapore-based AI startup Manus has triggered caution among AI founders with Chinese roots operating globally. The reversal stems from Beijing\'s concerns about Chinese AI intellectual property being transferred to a US company. Founders are now adopting defensive strategies, including postponing funding announcements, emphasizing Singapore incorporation, and establishing separate entities for global versus China-only operations to mitigate sovereign risk and regulatory scrutiny.',
    category: '退出',
    confidence: 'high',
    sourceUrl: 'https://www.businesstimes.com.sg/international/meta-manus-deal-reversal-redraws-lines-global-ai-startups',
    discoveredAt: '2026-05-03',
  },
  {
    title: '马斯克诉OpenAI案首周出现多个困难',
    titleEn: 'Musk\'s trial against OpenAI hits some rough spots in first week',
    description: '埃隆·马斯克在加州联邦法院对OpenAI、Sam Altman和Greg Brockman提起诉讼，指控他们背离2015年共同创立的非营利AI组织的使命，通过接受微软数十亿美元投资并将其转变为估值接近1万亿美元的营利公司。在三天的证人席上，马斯克面临了严格的交叉审问，被迫承认没有关于向OpenAI捐款条款的文件，以及他未能兑现最高10亿美元的融资承诺（实际仅捐献3800万美元）。OpenAI、Altman、Brockman和微软否认马斯克的指控，声称他试图破坏其自有公司xAI的主要竞争对手。',
    descriptionEn: 'Elon Musk has sued OpenAI, Sam Altman, and Greg Brockman in federal court in California, alleging they betrayed the mission of the nonprofit AI organization they co-founded in 2015 by accepting billions in Microsoft investments and transforming it into a for-profit company now valued near US$1 trillion. During three days of witness testimony, Musk faced tough cross-examination, forced to concede he had no written contract for his donations to OpenAI and failed to deliver on a pledge of up to US$1 billion in funding (contributing only US$38 million total). OpenAI, Altman, Brockman, and Microsoft deny his allegations, claiming he is attempting to undermine his own company xAI\'s top competitor.',
    category: '独角兽',
    confidence: 'low',
    sourceUrl: 'https://www.businesstimes.com.sg/startups-tech/technology/musks-trial-against-openai-hits-some-rough-spots-first-week',
    discoveredAt: '2026-05-03',
    reasonForLowConfidence: 'Model returned unknown category; defaulted to "独角兽".',
  },
  {
    title: '分析师：中国芯片企业难以追赶韩国、台湾在AI芯片领域的领先地位',
    titleEn: 'Chinese firms struggle to catch up with South Korea, Taiwan leaders in AI chips, say analysts',
    description: '文章分析了中国芯片企业在AI芯片领域与韩国、台湾的竞争差距。SK海力士和台积电在存储芯片生产领域处于领先地位，而中国企业如长鑫存储虽在扩产，但在功耗和形态因子上仍落后于三星和SK海力士。美国技术限制和内部供应链薄弱是制约中国芯片企业进展的主要因素。文章还讨论了中国AI芯片企业的机遇，包括某些中游工业领域如机器人和先进制造的发展前景。',
    descriptionEn: 'The article analyzes competitive gaps between Chinese chip enterprises and South Korea, Taiwan leaders in the AI chip sector. SK Hynix and TSMC lead in memory chip production, while Chinese firms like ChangXin Memory Technologies, despite scaling production, still lag in power consumption and form factors compared to Samsung and SK Hynix. US technology restrictions and weaker internal supply chains hinder Chinese chipmakers\' progress. The article also discusses opportunities for Chinese AI chip companies in midstream industrial sectors such as robotics and advanced manufacturing.',
    category: '投资机构',
    confidence: 'low',
    sourceUrl: 'https://www.businesstimes.com.sg/international/global/chinese-firms-struggle-catch-south-korea-taiwan-leaders-ai-chips-say-analysts',
    discoveredAt: '2026-05-03',
    reasonForLowConfidence: 'Although the article is on-topic for semiconductor/AI chip industry analysis, it does not fit the core categories being tracked (独角兽/融资轮/退出/投资机构/新公司). The content is primarily competitive analysis and market commentary rather than news about a specific company launch, funding event, acquisition, investment firm establishment, or unicorn status. It discusses industry trends, analyst opinions, and stock performance rather than a discrete event suitable for the structured data file.',
  },
];

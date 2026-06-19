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
  sectorKo?: string;
  raised: string;
  valuation: string;
  status: string;
  statusEn?: string;
  statusJa?: string;
  statusKo?: string;
  url: string;
}

export const unicorns: Unicorn[] = [
  {
    name: 'Grab',
    sector: '超级应用 / 物流与平台算法',
    sectorKo: '슈퍼앱 / 물류 및 플랫폼 알고리즘',
    sectorJa: 'スーパーアプリ / ロジスティクスとプラットフォームアルゴリズム',
    sectorEn: 'Super app / Logistics and platform algorithms',
    raised: '$12B+',
    valuation: '$20.2B',
    status: '已上市 (NASDAQ)',
    statusKo: 'NASDAQ 상장',
    statusJa: '上場済み (NASDAQ)',
    statusEn: 'Listed (NASDAQ)',
    url: 'https://www.grab.com',
  },
  {
    name: 'Trax',
    sector: '零售计算机视觉',
    sectorKo: '소매 컴퓨터 비전',
    sectorJa: 'リテール コンピュータビジョン',
    sectorEn: 'Retail Computer Vision',
    raised: '$1.14B',
    valuation: '$2.4B',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://traxretail.com',
  },
  {
    id: 'advance-ai',
    name: 'Advance Intelligence',
    sector: '金融科技 AI / BNPL',
    sectorKo: '핀테크 AI / BNPL',
    sectorJa: 'フィンテック AI / BNPL',
    sectorEn: 'FinTech AI / BNPL',
    raised: '$620M',
    valuation: '$2B',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.advance.ai',
  },
  {
    name: 'Biofourmis',
    sector: '数字健康 AI',
    sectorKo: '디지털 헬스케어 AI',
    sectorJa: 'デジタルヘルス AI',
    sectorEn: 'Digital Health AI',
    raised: '$463.6M',
    valuation: '$1.3B',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.biofourmis.com',
  },
  {
    name: 'Nium',
    sector: '跨境支付基础设施',
    sectorKo: '국경 간 결제 인프라',
    sectorJa: 'クロスボーダー決済インフラ',
    sectorEn: 'Cross-border payments infrastructure',
    raised: '$312M',
    valuation: '$1.4B',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.nium.com',
  },
  {
    name: 'PatSnap',
    sector: '专利/知识产权 AI',
    sectorKo: '특허/지식 재산권 AI',
    sectorJa: '特許/知的財産権 AI',
    sectorEn: 'Patent / IP AI',
    raised: '$300M+',
    valuation: '$1B',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.patsnap.com',
  },
  {
    name: 'Carro',
    sector: '二手车交易与汽车金融平台（AI-enabled）',
    sectorKo: '중고차 거래 및 자동차 금융 플랫폼(AI 기반)',
    sectorJa: '中古車取引と自動車金融プラットフォーム（AI対応）',
    sectorEn: 'Used-car marketplace and auto-finance platform (AI-enabled)',
    raised: '$1.01B',
    valuation: '$1B+',
    status: '活跃',
    statusKo: '활성',
    statusJa: 'アクティブ',
    statusEn: 'Active',
    url: 'https://www.carro.co',
  },
  {
    name: 'Sygnum',
    sector: '数字资产银行',
    sectorKo: '디지털 자산 은행',
    sectorJa: 'デジタルアセット銀行',
    sectorEn: 'Digital asset banking',
    raised: '$58M+',
    valuation: '$1B+',
    status: '活跃 (2025.1)',
    statusKo: '활성 (2025.1)',
    statusJa: 'アクティブ (2025.1)',
    statusEn: 'Active (Jan 2025)',
    url: 'https://www.sygnum.com',
  },
  {
    name: 'Near',
    sector: '位置智能 AI',
    sectorKo: '위치 지능 AI',
    sectorJa: 'ロケーションインテリジェンス AI',
    sectorEn: 'Location Intelligence AI',
    raised: '$234M',
    valuation: '—',
    status: '活跃',
    statusKo: '활성',
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
  descriptionKo?: string;
  raised?: string;
  investors?: string;
  founded?: string;
  url?: string | null;
  highlight?: string;
  highlightEn?: string;
  highlightJa?: string;
  highlightKo?: string;
  profile?: string;
  profileEn?: string;
  profileJa?: string;
  profileKo?: string;
  aiUseCase?: string;
  aiUseCaseEn?: string;
  aiUseCaseJa?: string;
  aiUseCaseKo?: string;
  singaporeContext?: string;
  singaporeContextEn?: string;
  singaporeContextJa?: string;
  singaporeContextKo?: string;
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
  nameKo?: string;
  icon: string;
  startups: Startup[];
}

export const verticals: Vertical[] = [
  {
    name: '金融科技',
    nameKo: '핀테크',
    nameJa: 'フィンテック',
    nameEn: 'FinTech',
    icon: '🏦',
    startups: [
      {
        name: 'ADVANCE.AI',
        description: 'AI 驱动的数字身份验证和风控',
        descriptionKo: 'AI 기반 디지털 신원 검증 및 위험 관리',
        descriptionJa: 'AI駆動型デジタル本人確認・リスク管理',
        descriptionEn: 'AI-driven digital identity verification and risk management',
        raised: '$200M',
        url: 'https://www.advance.ai',
      },
      {
        name: 'Aspire',
        description: '中小企业金融平台（AI-enabled）',
        descriptionKo: '중소기업 금융 플랫폼(AI 기반)',
        descriptionJa: '中小企業金融プラットフォーム（AI対応）',
        descriptionEn: 'SME finance platform (AI-enabled)',
        raised: '$300M+',
        url: 'https://aspireapp.com',
      },
      {
        name: 'Endowus',
        description: 'AI 智能投顾',
        descriptionKo: 'AI 스마트 자문',
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
        descriptionKo: 'AI 자금 세탁 방지 규정 준수',
        descriptionJa: 'AI マネーロンダリング対策コンプライアンス',
        descriptionEn: 'AI anti-money laundering compliance',
        raised: '$35M+',
        url: 'https://www.tookitaki.com',
      },
      {
        name: 'CredoLab',
        description: '替代数据 AI 信用评分',
        descriptionKo: '대체 데이터 AI 신용 평가',
        descriptionJa: 'オルタナティブデータ AI クレジットスコアリング',
        descriptionEn: 'AI credit scoring using alternative data',
        raised: '$12M+',
        url: 'https://www.credolab.com',
      },
      {
        name: 'Transparently.AI',
        description: 'AI 财务欺诈检测',
        descriptionKo: 'AI 금융 사기 탐지',
        descriptionJa: 'AI 財務詐欺検出',
        descriptionEn: 'AI financial fraud detection',
        investors: 'Franklin Templeton',
        url: 'https://www.transparently.ai',
      },
    ],
  },
  {
    name: '医疗健康',
    nameKo: '헬스케어',
    nameJa: '医療・ヘルスケア',
    nameEn: 'Healthcare',
    icon: '🏥',
    startups: [
      {
        name: 'Biofourmis',
        description: '远程患者监护 AI 平台',
        descriptionKo: '원격 환자 모니터링 AI 플랫폼',
        descriptionJa: '遠隔患者モニタリング AI プラットフォーム',
        descriptionEn: 'AI platform for remote patient monitoring',
        raised: '$463.6M',
        highlight: '独角兽',
        highlightKo: '유니콘',
        highlightJa: 'ユニコーン',
        highlightEn: 'Unicorn',
        url: 'https://www.biofourmis.com',
      },
      {
        name: 'Qritive',
        description: 'AI 数字病理诊断',
        descriptionKo: 'AI 디지털 병리 진단',
        descriptionJa: 'AI デジタル病理診断',
        descriptionEn: 'AI digital pathology diagnostics',
        raised: '$7.5M+',
        url: 'https://www.qritive.com',
      },
      {
        name: 'Engine Bio',
        description: 'CRISPR + ML 诊断平台',
        descriptionKo: 'CRISPR + ML 진단 플랫폼',
        descriptionJa: 'CRISPR + ML 診断プラットフォーム',
        descriptionEn: 'CRISPR + ML diagnostics platform',
        raised: '$10M+',
        url: 'https://www.enginebio.com',
      },
      {
        name: 'Bot MD',
        description: '医疗 AI 助手',
        descriptionKo: '의료 AI 어시스턴트',
        descriptionJa: '医療 AI アシスタント',
        descriptionEn: 'AI assistant for clinicians',
        investors: 'SGInnovate',
        url: 'https://www.botmd.io',
      },
      {
        name: 'Nanyang Biologics',
        description: 'AI 药物发现',
        descriptionKo: 'AI 약물 발견',
        descriptionJa: 'AI 医薬品発見',
        descriptionEn: 'AI drug discovery',
        highlight: '计划 $1.5B SPAC 上市',
        highlightKo: '$1.5B SPAC 상장 계획',
        highlightJa: '$1.5B SPAC上場を計画',
        highlightEn: 'Planned $1.5B SPAC listing',
        url: null,
      },
    ],
  },
  {
    name: '企业 SaaS',
    nameKo: '엔터프라이즈 SaaS',
    nameJa: 'エンタープライズ SaaS',
    nameEn: 'Enterprise SaaS',
    icon: '💼',
    startups: [
      {
        name: 'Trax',
        description: '零售 AI 计算机视觉',
        descriptionKo: '소매 AI 컴퓨터 비전',
        descriptionJa: 'リテール AI コンピュータビジョン',
        descriptionEn: 'Retail AI computer vision',
        raised: '$1.07B',
        highlight: '新加坡融资最多的 AI 公司',
        highlightKo: '싱가포르 최고 자금조달 AI 회사',
        highlightJa: 'シンガポール資金調達額最大の AI 企業',
        highlightEn: "Singapore's most funded AI company",
        url: 'https://traxretail.com',
      },
      {
        name: 'Near',
        description: '位置智能 AI 平台',
        descriptionKo: '위치 인텔리전스 AI 플랫폼',
        descriptionJa: 'ロケーションインテリジェンス AI プラットフォーム',
        descriptionEn: 'Location intelligence AI platform',
        raised: '$234M',
        url: 'https://near.com',
      },
      {
        name: 'ViSenze',
        description: 'AI 视觉搜索',
        descriptionKo: 'AI 시각 검색',
        descriptionJa: 'AI ビジュアルサーチ',
        descriptionEn: 'AI visual search',
        raised: '$34M',
        url: 'https://www.visenze.com',
      },
      {
        name: 'WIZ.AI',
        description: 'Singlish 方言 AI 客服',
        descriptionKo: 'Singlish 방언 AI 고객서비스',
        descriptionJa: 'シングリッシュ方言 AI カスタマーサービス',
        descriptionEn: 'AI customer service tuned for Singlish dialects',
        raised: '$10M+',
        url: 'https://www.wiz.ai',
      },
      {
        name: 'Level3AI',
        description: '企业 AI Agent',
        descriptionKo: '엔터프라이즈 AI 에이전트',
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
    nameKo: 'AI 인프라',
    nameJa: 'AI インフラストラクチャ',
    nameEn: 'AI Infrastructure',
    icon: '⚙️',
    startups: [
      {
        name: 'Aicadium',
        description: 'MLOps 平台',
        descriptionKo: 'MLOps 플랫폼',
        descriptionJa: 'MLOps プラットフォーム',
        descriptionEn: 'MLOps platform',
        highlight: '被 Temasek 收购',
        highlightKo: 'Temasek에 인수됨',
        highlightJa: 'Temasek に買収される',
        highlightEn: 'Acquired by Temasek',
        url: null,
      },
      {
        name: 'Datature',
        description: '无代码计算机视觉平台',
        descriptionKo: '노코드 컴퓨터 비전 플랫폼',
        descriptionJa: 'ノーコード コンピュータビジョン プラットフォーム',
        descriptionEn: 'No-code computer vision platform',
        investors: 'SGInnovate',
        url: 'https://www.datature.io',
      },
      {
        name: 'Sentient.io',
        description: '东盟 AI API 微服务',
        descriptionKo: 'ASEAN AI API 마이크로서비스',
        descriptionJa: 'ASEAN AI API マイクロサービス',
        descriptionEn: 'ASEAN-focused AI API microservices',
        raised: '$7M',
        url: 'https://www.sentient.io',
      },
      {
        name: 'Mindverse AI',
        description: '主权 AI 基础设施',
        descriptionKo: '주권 AI 인프라',
        descriptionJa: 'ソブリン AI インフラストラクチャ',
        descriptionEn: 'Sovereign AI infrastructure',
        raised: '$5M',
        url: null,
      },
      {
        name: 'Jan',
        description: '离线本地 AI 助手（开源）',
        descriptionKo: '오프라인 로컬 AI 어시스턴트(오픈소스)',
        descriptionJa: 'オフライン・ローカル AI アシスタント（オープンソース）',
        descriptionEn: 'Offline local AI assistant (open source)',
        highlight: 'GitHub 25,000 Stars',
        highlightEn: '25,000 GitHub stars',
        url: 'https://jan.ai',
      },
      {
        name: 'Galatek',
        description: '生命科学/半导体 AI 自动化',
        descriptionKo: '생명과학/반도체 AI 자동화',
        descriptionJa: 'ライフサイエンス/半導体 AI 自動化',
        descriptionEn: 'AI automation for life sciences and semiconductors',
        raised: '$30M Series A (2025.12)',
        url: null,
      },
    ],
  },
  {
    name: '机器人与自动驾驶',
    nameKo: '로봇공학 및 자율주행',
    nameJa: 'ロボティクスと自動運転',
    nameEn: 'Robotics & Autonomous Vehicles',
    icon: '🤖',
    startups: [
      {
        name: 'Eureka Robotics',
        description: 'AI 精密视觉机器人',
        descriptionKo: 'AI 정밀 시각 로봇',
        descriptionJa: 'AI 精密ビジョン ロボット',
        descriptionEn: 'AI-driven precision vision robotics',
        raised: '$10.5M Series A',
        investors: 'B Capital',
        url: 'https://eurekarobotics.com',
      },
      {
        name: 'Augmentus',
        description: '无代码机器人编程',
        descriptionKo: '노코드 로봇 프로그래밍',
        descriptionJa: 'ノーコード ロボット プログラミング',
        descriptionEn: 'No-code robotics programming',
        investors: 'Applied Ventures',
        url: 'https://www.augmentus.tech',
      },
      {
        name: 'Botsync',
        description: '自主移动机器人',
        descriptionKo: '자율 이동 로봇',
        descriptionJa: '自律移動ロボット',
        descriptionEn: 'Autonomous mobile robots',
        investors: 'SGInnovate',
        url: 'https://www.botsync.co',
      },
      {
        name: 'Moovita',
        description: '自动驾驶出行',
        descriptionKo: '자율주행 모빌리티',
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
  descriptionKo?: string;
  acquirer: string;
  acquirerEn?: string;
  acquirerJa?: string;
  acquirerKo?: string;
  amount: string;
  year: number | null;
  note: string;
  noteEn?: string;
  noteJa?: string;
  noteKo?: string;
}

export const exits: Exit[] = [
  {
    name: 'Manus',
    description: 'AI Agent 平台（Butterfly Effect 旗下）',
    descriptionKo: 'AI 에이전트 플랫폼(Butterfly Effect 산하)',
    descriptionJa: 'AI エージェント プラットフォーム（Butterfly Effect 傘下）',
    descriptionEn: 'AI agent platform (operated by Butterfly Effect)',
    acquirer: 'Meta（已被中国 NDRC 否决）',
    acquirerKo: 'Meta(이미 중국 NDRC에 의해 거부됨)',
    acquirerJa: 'Meta（既に中国 NDRC により却下）',
    acquirerEn: 'Meta (blocked by China NDRC)',
    amount: '$2B (blocked)',
    year: 2025,
    note: '2025-12 宣布拟收购，2026-04-27 中国国家发改委以国家安全为由叫停（AI 领域首例外资并购否决，三条红线：技术主权 / 数据主权 / 国家安全）。新加坡作为「AI 离岸中转枢纽」战略首次被来源国监管显式划红线。',
    noteKo:
      '2025-12월에 인수 계획을 발표하고, 2026-04-27에 중국 국가발개위(NDRC)가 국가안보를 사유로 중단했습니다(AI 분야 첫 외자 합병 거부, 세 가지 금지선: 기술주권 / 데이터주권 / 국가안보). 싱가포르는 「AI 오프쇼어 중계 허브」 전략으로서 처음으로 출처국 규제에 의해 명시적으로 금지선이 그어졌습니다.',
    noteJa:
      '2025-12 に買収を発表、2026-04-27 中国国家発展改革委員会が国家安全保障を理由として中止（AI 領域における初の外資M&A却下、3本の赤線：技術主権 / データ主権 / 国家安全保障）。シンガポールの 「AI オフショア・トランジットハブ」 戦略が、発信国の規制当局により初めて明示的に赤線を引かれた。',
    noteEn:
      'Acquisition announced December 2025; blocked by China\'s NDRC on 27 April 2026 on national-security grounds — the first foreign acquisition vetoed in the AI sector, citing three red lines: technology sovereignty, data sovereignty, and national security. Singapore\'s "AI offshore transit hub" strategy was, for the first time, explicitly red-lined by a source-country regulator.',
  },
  {
    name: 'AIDA Technologies',
    description: 'AI 决策引擎',
    descriptionKo: 'AI 의사결정 엔진',
    descriptionJa: 'AI 意思決定エンジン',
    descriptionEn: 'AI decision engine',
    acquirer: '被收购',
    acquirerKo: '인수됨',
    acquirerJa: '買収される',
    acquirerEn: 'Acquired',
    amount: '—',
    year: null,
    note: 'SGInnovate 投资组合',
    noteKo: 'SGInnovate 포트폴리오',
    noteJa: 'SGInnovate ポートフォリオ',
    noteEn: 'SGInnovate portfolio company',
  },
  {
    name: 'Musiio',
    description: 'AI 音乐标签',
    descriptionKo: 'AI 음악 레이블',
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
    descriptionKo: 'AI 광고 크리에이티브 생성',
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
    descriptionKo: 'AI 레스토랑 관리',
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
  typeKo?: string;
  stats: string;
  statsEn?: string;
  statsJa?: string;
  statsKo?: string;
  focus: string;
  focusEn?: string;
  focusJa?: string;
  focusKo?: string;
  notableDeals?: string;
  notableDealsEn?: string;
  notableDealsJa?: string;
  notableDealsKo?: string;
  url: string;
}

export const investors: Investor[] = [
  {
    name: 'SGInnovate',
    type: '政府深科技投资',
    typeKo: '정부 딥테크 투자',
    typeJa: '政府によるディープテック投資',
    typeEn: 'Government deep-tech investor',
    stats: '167 笔投资，25 个退出',
    statsKo: '167건 투자, 25건 엑시트',
    statsJa: '167件の投資、25件のエグジット',
    statsEn: '167 investments, 25 exits',
    focus: 'AI、量子、区块链',
    focusKo: 'AI, 양자, 블록체인',
    focusJa: 'AI・量子・ブロックチェーン',
    focusEn: 'AI, quantum, blockchain',
    url: 'https://www.sginnovate.com/',
  },
  {
    name: 'Temasek',
    type: '主权财富基金',
    typeKo: '국부펀드',
    typeJa: 'ソブリンウエルスファンド',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 60 笔交易',
    statsKo: '2025년 60건 거래',
    statsJa: '2025年 60件の取引',
    statsEn: '60 deals in 2025',
    focus: 'AI 基础设施、数据中心',
    focusKo: 'AI 인프라, 데이터센터',
    focusJa: 'AI インフラストラクチャ、データセンター',
    focusEn: 'AI infrastructure, data centres',
    notableDeals:
      '2026 年入股 OpenAI（1220 亿美元轮）与 Anthropic（Series H）；2025 年加入 BlackRock/MGX/微软/Nvidia 发起的 AI Infrastructure Partnership',
    notableDealsEn:
      'Took stakes in OpenAI ($122B round) and Anthropic (Series H) in 2026; joined the BlackRock/MGX/Microsoft/Nvidia-launched AI Infrastructure Partnership in 2025',
    notableDealsJa:
      '2026 年に OpenAI（1220 億ドルラウンド）と Anthropic（Series H）に出資；2025 年に BlackRock/MGX/マイクロソフト/Nvidia が立ち上げた AI Infrastructure Partnership に参加',
    notableDealsKo:
      '2026년 OpenAI(1220억 달러 라운드)와 Anthropic(Series H)에 투자; 2025년 BlackRock/MGX/마이크로소프트/Nvidia가 출범시킨 AI Infrastructure Partnership에 합류',
    url: 'https://www.temasek.com.sg/en/index',
  },
  {
    name: 'GIC',
    type: '主权财富基金',
    typeKo: '국부펀드',
    typeJa: 'ソブリンウエルスファンド',
    typeEn: 'Sovereign wealth fund',
    stats: '2025 年 42 笔交易',
    statsKo: '2025년 42건 거래',
    statsJa: '2025年 42件の取引',
    statsEn: '42 deals in 2025',
    focus: 'AI 基础设施',
    focusKo: 'AI 인프라',
    focusJa: 'AI インフラストラクチャ',
    focusEn: 'AI infrastructure',
    notableDeals:
      '连续三轮投资 Anthropic（Series F/G/H，其中 Series G 与 Coatue 共同领投）；与 Equinix、CPP 设超 150 亿美元数据中心合资',
    notableDealsEn:
      'Invested in Anthropic across three consecutive rounds (Series F/G/H, co-leading Series G with Coatue); formed a >$15B data centre JV with Equinix and CPP',
    notableDealsJa:
      'Anthropic に 3 ラウンド連続で投資（Series F/G/H、Series G は Coatue と共同リード）；Equinix、CPP と 150 億ドル超のデータセンター合弁を設立',
    notableDealsKo:
      'Anthropic에 3개 라운드 연속 투자(Series F/G/H, Series G는 Coatue와 공동 리드); Equinix, CPP와 150억 달러 초과 데이터센터 합작 설립',
    url: 'https://www.gic.com.sg/',
  },
  {
    name: 'Antler',
    type: '早期 VC',
    typeKo: '초기 VC',
    typeJa: 'アーリーステージ VC',
    typeEn: 'Early-stage VC',
    stats: '最活跃早期投资者，2025 年 14 家 AI',
    statsKo: '가장 활발한 초기 투자자, 2025년 14개 AI',
    statsJa: '最もアクティブなアーリーステージ投資家、2025年 14社の AI 企業に投資',
    statsEn: 'Most active early-stage investor; 14 AI deals in 2025',
    focus: 'AI 创业',
    focusKo: 'AI 스타트업',
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
    focusKo: '동남아시아 기술',
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
    focusKo: '동남아시아 기술',
    focusJa: '東南アジア テクノロジー',
    focusEn: 'Southeast Asian tech',
    url: 'https://www.monkshill.com/',
  },
];

export interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  description: string;
  descriptionEn: string;
  descriptionJa?: string;
  descriptionKo?: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}

export const autoDiscovered: AutoDiscoveredEntry[] = [
  {
    title: '新电信与KKR旗下STT GDC在韩国开设首个数据中心，捕捉AI浪潮',
    titleEn: 'Singtel, KKR-owned STT GDC opens its first South Korean data centre to tap AI boom',
    titleJa: 'SingtelとKKR傘下のSTT GDCが韓国で初のデータセンターを開設、AI波をキャッチ',
    titleKo: 'Singtel과 KKR 산하 STT GDC가 한국에서 첫 데이터 센터 개설, AI 열풍 포착',
    description:
      '新电信和KKR支持的ST Telemedia Global Data Centres (STT GDC)在2026年6月16日在首尔开设首个数据中心设施STT Seoul 1，30MW容量，位于首尔鹿川区，与韩国现代重工业合作（60/40股权分配）。该设施覆盖约4万平方米，专为超大规模和企业客户的高密度AI工作负载而设计，功率使用效率低于1.3，备配电源和24小时备用发电机。',
    descriptionEn:
      "Singtel and KKR-backed ST Telemedia Global Data Centres (STT GDC) opened its first South Korean data centre facility, STT Seoul 1, on June 16, 2026, featuring a 30-megawatt capacity in Seoul's Geumcheon district in joint venture with Hyosung Heavy Industries (60/40 ownership split). The facility spans approximately 40,000 square metres and targets hyperscale and enterprise clients running high-density AI workloads, with power usage effectiveness below 1.3 and backup generators capable of 24-hour autonomous operation.",
    descriptionJa:
      'SingtelとKKR傘下のST Telemedia Global Data Centres（STT GDC）は2026年6月16日にソウルで初のデータセンター施設STT Seoul 1を開設しました。容量は30MWで、ソウル鹿川区に位置し、韓国現代重工業とのパートナーシップで運営されています（株式配分60/40）。施設は約4万平方メートルをカバーし、超大規模企業顧客向けの高密度AIワークロード用に設計されています。電力使用効率は1.3未満で、バックアップ電源と24時間バックアップ発電機を備えています。',
    descriptionKo:
      'Singtel과 KKR이 지원하는 ST Telemedia Global Data Centres (STT GDC)는 2026년 6월 16일 서울 록천구에 첫 데이터 센터 시설 STT Seoul 1을 개설했습니다. 30MW 용량을 갖춘 본 시설은 Hyundai Heavy Industries와의 협력으로 개발되었으며 60/40의 지분 배분으로 운영됩니다. 약 4만 제곱미터의 규모를 자랑하는 본 시설은 하이퍼스케일 및 엔터프라이즈 고객의 고밀도 AI 워크로드 처리를 위해 설계되었으며, 전력 사용 효율(PUE)이 1.3 미만이고, 백업 전원 및 24시간 백업 발전기가 구비되어 있습니다.',
    category: '新公司',
    confidence: 'low',
    sourceUrl:
      'https://www.businesstimes.com.sg/startups-tech/technology/singtel-kkr-owned-stt-gdc-opens-its-first-south-korean-data-centre-tap-ai-boom',
    discoveredAt: '2026-06-19',
    reasonForLowConfidence:
      'While the source is credible and content is well-structured, the article describes a facility/infrastructure expansion by an existing established company (STT GDC), not a startup launch, funding round, exit, investment institution, or unicorn achievement. The news type (operational expansion announcement) does not align with the five specified categories for this Singapore AI startup ecosystem dataset.',
  },
  {
    title: '新加坡初创公司加倍使用AI，同时运行多个平台：Aspire报告',
    titleEn: 'Singapore startups double down on AI usage, running multiple platforms: Aspire report',
    titleJa: 'シンガポール・スタートアップのAI利用が倍増、複数プラットフォームを同時運用：Aspireレポート',
    titleKo: '싱가포르 스타트업들이 AI 사용을 2배로 확대하면서 동시에 여러 플랫폼을 운영하고 있습니다: Aspire 보고서',
    description:
      '根据金融科技公司Aspire的报告，新加坡初创公司在2026年的AI平台订阅量同比增长42%。同时运行三个或以上AI平台的初创公司数量从339家翻倍增至704家，平均每家初创公司使用1.87个AI平台。ChatGPT仍是最受欢迎的平台（2,377名付费客户），而Claude增速更快（258%增长），并在AI支出中占比37%。报告还显示初创公司正在构建分布式团队，优先从东南亚地区招聘。',
    descriptionEn:
      'According to a report by fintech firm Aspire, Singapore startups increased their AI platform subscriptions by 42% year-over-year in 2026. The number of startups running three or more AI platforms simultaneously more than doubled to 704, with each startup using an average of 1.87 AI platforms. ChatGPT remains the most popular platform with 2,377 paying clients, while Claude is growing faster (258% increase) and now accounts for 37% of startup AI spending. The report also highlights that startups are building distributed workforces with increased hiring from Southeast Asia.',
    descriptionJa:
      '金融テック企業Aspireのレポートによると、シンガポール・スタートアップの2026年のAIプラットフォーム購読数は前年比42%増加しています。同時に3つ以上のAIプラットフォームを運用するスタートアップの数は339社から704社へと倍増し、1社あたり平均1.87個のAIプラットフォームを利用しています。ChatGPTは依然として最も人気のあるプラットフォーム（2,377名の有料顧客）ですが、Claudeはより高速に成長し（258%増加）、AI支出の37%を占めています。レポートはまた、スタートアップが分散型チームを構築しており、東南アジア地域からの採用を優先していることを示しています。',
    descriptionKo:
      '핀테크 회사 Aspire의 보고서에 따르면, 싱가포르 스타트업의 2026년 AI 플랫폼 구독량은 전년 대비 42% 증가했습니다. 동시에 3개 이상의 AI 플랫폼을 운영하는 스타트업 수는 339개에서 704개로 두 배 증가했으며, 평균 각 스타트업은 1.87개의 AI 플랫폼을 사용하고 있습니다. ChatGPT는 여전히 가장 인기 있는 플랫폼(유료 고객 2,377명)이며, Claude는 더 빠른 성장률을 보이고 있고(258% 증가) AI 지출의 37%를 차지하고 있습니다. 보고서는 또한 스타트업이 분산 팀을 구축하고 있으며, 동남아시아 지역에서 채용을 우선하고 있음을 보여줍니다.',
    category: '新公司',
    confidence: 'low',
    sourceUrl:
      'https://www.businesstimes.com.sg/startups-tech/technology/singapore-startups-double-down-ai-usage-running-multiple-platforms-aspire-report',
    discoveredAt: '2026-06-19',
    reasonForLowConfidence:
      'Article is a market trend report analyzing AI platform adoption patterns and spending across multiple Singapore startups, not a discrete event (specific company launch, funding round announcement, exit, or investor institution profile) that fits the required categories.',
  },
  {
    title: '最大的AI技能可能不是技术性的',
    titleEn: 'The biggest AI skill may not be technical',
    titleJa: '最も重要なAIスキルは技術的ではないかもしれません',
    titleKo: '가장 큰 AI 역량은 기술적이지 않을 수 있습니다',
    description:
      '文章讨论AI对就业的影响，重点强调转型而非替代。通过对UOB人力资源部门主管和NUS-ISS副首席执行官的采访，探讨"AI双语者"（既具备领域专业知识又能应用AI的通才）的概念。文章指出雇主在招聘时优先考虑问题解决能力、好奇心、适应性和人文素质，而非纯技术技能。',
    descriptionEn:
      "The article examines AI's impact on employment, emphasizing transition over replacement. Through interviews with UOB's head of group human resources and NUS-ISS's deputy CEO, it explores the concept of 'AI bilinguals'—generalists with domain expertise who can apply AI. The piece highlights that employers prioritize problem-solving skills, curiosity, adaptability, and humanistic abilities over purely technical skills in hiring.",
    descriptionJa:
      'この記事はAIが雇用に与える影響について論じ、置き換えではなく変革を強調しています。UOBの人事部門長とNUS-ISS副最高経営責任者へのインタビューを通じて、「AIバイリンガル」（領域の専門知識を持ちながらAIを応用できる汎用人材）という概念を探討しています。記事では、採用時に雇用主が問題解決能力、好奇心、適応力、人文的資質を優先し、純粋な技術スキルではないことを指摘しています。',
    descriptionKo:
      '본 기사는 AI가 고용에 미치는 영향을 논의하며, 대체가 아닌 변환을 강조합니다. UOB 인사자원 부서 책임자 및 NUS-ISS 부최고경영자와의 인터뷰를 통해 「AI 이중언어자」(도메인 전문 지식을 갖추고 동시에 AI를 적용할 수 있는 다재다능한 인재)라는 개념을 탐구합니다. 기사는 고용주가 채용 시 순수 기술적 능력이 아닌 문제 해결 능력, 호기심, 적응성, 인문학적 자질을 우선시한다고 지적합니다.',
    category: '新公司',
    confidence: 'low',
    sourceUrl: 'https://www.businesstimes.com.sg/startups-tech/technology/biggest-ai-skill-may-not-be-technical',
    discoveredAt: '2026-06-19',
    reasonForLowConfidence:
      "Article is an opinion/analysis piece about AI's impact on employment and skills development. It contains no information about Singapore AI startup ecosystem activities (company launches, funding rounds, exits, or investors). Does not match any required classification category.",
  },
];

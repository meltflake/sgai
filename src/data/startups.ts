// AI 创业生态数据
// 基础统计重定基线于 2026-07-05：混合口径，每个数字锚定单一命名来源（见各字段注释）。
// 实体档案整理于 2026-05-04。

export const ecosystemStats = {
  // Tracxn "Artificial Intelligence in Singapore" (page updated 2026-05-01): 548 AI companies tracked.
  // https://tracxn.com/d/artificial-intelligence/ai-startups-in-singapore/__YBFhVmcmOHEexm4oJQjCpjL_x5V8m4mhfvfBLMMT4pI
  totalStartups: '548',
  // Tortoise Global AI Index 2025 — verified 2026-07-04, no change needed.
  globalRank: 3,
  // e-Conomy SEA 2025 (Google / Temasek / Bain): Singapore AI startups drew US$1.31B of the
  // region's US$2.3B+ in the 12 months to Jun 2025 → ~57%.
  // https://www.scmp.com/week-asia/economics/article/3332375/singapore-based-ai-start-ups-draw-most-funding-southeast-asia-report
  seaFundingShare: '~57%',
  // Tracxn (same page as totalStartups): 143 funded companies collectively raised $1.9B (VC + PE, cumulative).
  totalVCRaised: '$1.9B',
  // Count of unicorn profiles curated on this site (the `unicorns` array below).
  unicorns: 9,
  // Sum of government AI commitments announced since 2024 (> S$2.15B):
  //  - Budget 2024: over S$1B over five years for AI compute, talent and industry development
  //    https://www.mddi.gov.sg/newsroom/ai-initiatives-launched-to-uplift-sg-economic-potential/
  //  - Budget 2025: up to S$150M Enterprise Compute Initiative
  //    https://www.disg.gov.sg/enterprise-compute-initiative/
  //  - 2026-01: over S$1B additional for the National AI R&D Plan, 2025-2030
  //    https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/
  govCommitment: 'S$2.1B+',
  dataDate: '2026-07-05',
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
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
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
    topicIds: ['finance'],
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
    topicIds: ['healthcare'],
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
    topicIds: ['finance'],
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
    topicIds: ['finance'],
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
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
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
        addedAt: '2026-02-17',
        description: 'AI 驱动的数字身份验证和风控',
        descriptionKo: 'AI 기반 디지털 신원 검증 및 위험 관리',
        descriptionJa: 'AI駆動型デジタル本人確認・リスク管理',
        descriptionEn: 'AI-driven digital identity verification and risk management',
        raised: '$200M',
        url: 'https://www.advance.ai',
      },
      {
        name: 'Aspire',
        addedAt: '2026-02-17',
        description: '中小企业金融平台（AI-enabled）',
        descriptionKo: '중소기업 금융 플랫폼(AI 기반)',
        descriptionJa: '中小企業金融プラットフォーム（AI対応）',
        descriptionEn: 'SME finance platform (AI-enabled)',
        raised: '$300M+',
        url: 'https://aspireapp.com',
      },
      {
        name: 'Endowus',
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
        description: 'AI 反洗钱合规',
        descriptionKo: 'AI 자금 세탁 방지 규정 준수',
        descriptionJa: 'AI マネーロンダリング対策コンプライアンス',
        descriptionEn: 'AI anti-money laundering compliance',
        raised: '$35M+',
        url: 'https://www.tookitaki.com',
      },
      {
        name: 'CredoLab',
        addedAt: '2026-02-17',
        description: '替代数据 AI 信用评分',
        descriptionKo: '대체 데이터 AI 신용 평가',
        descriptionJa: 'オルタナティブデータ AI クレジットスコアリング',
        descriptionEn: 'AI credit scoring using alternative data',
        raised: '$12M+',
        url: 'https://www.credolab.com',
      },
      {
        name: 'Transparently.AI',
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
        description: 'AI 数字病理诊断',
        descriptionKo: 'AI 디지털 병리 진단',
        descriptionJa: 'AI デジタル病理診断',
        descriptionEn: 'AI digital pathology diagnostics',
        raised: '$7.5M+',
        url: 'https://www.qritive.com',
      },
      {
        name: 'Engine Bio',
        addedAt: '2026-02-17',
        description: 'CRISPR + ML 诊断平台',
        descriptionKo: 'CRISPR + ML 진단 플랫폼',
        descriptionJa: 'CRISPR + ML 診断プラットフォーム',
        descriptionEn: 'CRISPR + ML diagnostics platform',
        raised: '$10M+',
        url: 'https://www.enginebio.com',
      },
      {
        name: 'Bot MD',
        addedAt: '2026-02-17',
        description: '医疗 AI 助手',
        descriptionKo: '의료 AI 어시스턴트',
        descriptionJa: '医療 AI アシスタント',
        descriptionEn: 'AI assistant for clinicians',
        investors: 'SGInnovate',
        url: 'https://www.botmd.io',
      },
      {
        name: 'Nanyang Biologics',
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
        description: 'AI 视觉搜索',
        descriptionKo: 'AI 시각 검색',
        descriptionJa: 'AI ビジュアルサーチ',
        descriptionEn: 'AI visual search',
        raised: '$34M',
        url: 'https://www.visenze.com',
      },
      {
        name: 'WIZ.AI',
        addedAt: '2026-02-17',
        description: 'Singlish 方言 AI 客服',
        descriptionKo: 'Singlish 방언 AI 고객서비스',
        descriptionJa: 'シングリッシュ方言 AI カスタマーサービス',
        descriptionEn: 'AI customer service tuned for Singlish dialects',
        raised: '$10M+',
        url: 'https://www.wiz.ai',
      },
      {
        name: 'Level3AI',
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
        description: '无代码计算机视觉平台',
        descriptionKo: '노코드 컴퓨터 비전 플랫폼',
        descriptionJa: 'ノーコード コンピュータビジョン プラットフォーム',
        descriptionEn: 'No-code computer vision platform',
        investors: 'SGInnovate',
        url: 'https://www.datature.io',
      },
      {
        name: 'Sentient.io',
        addedAt: '2026-02-17',
        description: '东盟 AI API 微服务',
        descriptionKo: 'ASEAN AI API 마이크로서비스',
        descriptionJa: 'ASEAN AI API マイクロサービス',
        descriptionEn: 'ASEAN-focused AI API microservices',
        raised: '$7M',
        url: 'https://www.sentient.io',
      },
      {
        name: 'Mindverse AI',
        addedAt: '2026-02-17',
        description: '主权 AI 基础设施',
        descriptionKo: '주권 AI 인프라',
        descriptionJa: 'ソブリン AI インフラストラクチャ',
        descriptionEn: 'Sovereign AI infrastructure',
        raised: '$5M',
        url: null,
      },
      {
        name: 'Jan',
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
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
        addedAt: '2026-02-17',
        description: '无代码机器人编程',
        descriptionKo: '노코드 로봇 프로그래밍',
        descriptionJa: 'ノーコード ロボット プログラミング',
        descriptionEn: 'No-code robotics programming',
        investors: 'Applied Ventures',
        url: 'https://www.augmentus.tech',
      },
      {
        name: 'Botsync',
        addedAt: '2026-02-17',
        description: '自主移动机器人',
        descriptionKo: '자율 이동 로봇',
        descriptionJa: '自律移動ロボット',
        descriptionEn: 'Autonomous mobile robots',
        investors: 'SGInnovate',
        url: 'https://www.botsync.co',
      },
      {
        name: 'Moovita',
        addedAt: '2026-02-17',
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
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
}

export const exits: Exit[] = [
  {
    name: 'Manus',
    description: 'AI Agent 平台（Butterfly Effect 旗下）',
    descriptionKo: 'AI 에이전트 플랫폼(Butterfly Effect 산하)',
    descriptionJa: 'AI エージェント プラットフォーム（Butterfly Effect 傘下）',
    descriptionEn: 'AI agent platform (operated by Butterfly Effect)',
    acquirer: 'Meta（NDRC 否决，2026-08 收购拆解）',
    acquirerKo: 'Meta(NDRC 부결, 2026-08 인수 해제)',
    acquirerJa: 'Meta（NDRC 否決、2026-08 買収解消）',
    acquirerEn: 'Meta (blocked by China NDRC; unwound Aug 2026)',
    amount: '$2B (unwound)',
    year: 2025,
    note: '2025-12 宣布收购并交割，2026-04-27 中国国家发改委以国家安全为由叫停（AI 领域首例外资并购否决，三条红线：技术主权 / 数据主权 / 国家安全）。新加坡作为「AI 离岸中转枢纽」战略首次被来源国监管显式划红线。2026-08-11 Manus 宣布恢复独立运营，收购正式拆解——Meta 所有权期间（2025-12-29 起）的用户数据于 8 月下旬删除，原投资方（含腾讯）洽谈按原估值收回股份。',
    noteKo:
      '2025-12월에 인수를 발표하고 마무리했으며, 2026-04-27에 중국 국가발개위(NDRC)가 국가안보를 사유로 중단했습니다(AI 분야 첫 외자 합병 거부, 세 가지 금지선: 기술주권 / 데이터주권 / 국가안보). 싱가포르는 「AI 오프쇼어 중계 허브」 전략으로서 처음으로 출처국 규제에 의해 명시적으로 금지선이 그어졌습니다. 2026-08-11 Manus는 독립 운영 재개를 발표했고 인수는 공식 해제되었습니다——Meta 소유 기간(2025-12-29 이후)의 사용자 데이터는 8월 하순에 삭제되며, 기존 투자자(Tencent 포함)는 당초 평가액으로 지분 회복을 협상 중입니다.',
    noteJa:
      '2025-12 に買収を発表・クローズ、2026-04-27 中国国家発展改革委員会が国家安全保障を理由として中止（AI 領域における初の外資M&A却下、3本の赤線：技術主権 / データ主権 / 国家安全保障）。シンガポールの 「AI オフショア・トランジットハブ」 戦略が、発信国の規制当局により初めて明示的に赤線を引かれた。2026-08-11、Manus は独立運営の再開を発表し、買収は正式に解消——Meta 所有期間（2025-12-29 以降）のユーザーデータは 8 月下旬に削除され、旧投資家（Tencent を含む）は当初の評価額での持分回復を交渉中。',
    noteEn:
      "Acquisition announced and closed December 2025; blocked by China's NDRC on 27 April 2026 on national-security grounds — the first foreign acquisition vetoed in the AI sector, citing three red lines: technology sovereignty, data sovereignty, and national security. Singapore's \"AI offshore transit hub\" strategy was, for the first time, explicitly red-lined by a source-country regulator. On 11 August 2026 Manus announced a return to independent operations, formally unwinding the deal — user data generated under Meta's ownership (from 29 December 2025) is being deleted in late August, and former investors including Tencent are negotiating to recover stakes at the original valuation.",
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
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
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
    focus: 'AI 基础设施、数据中心、基础模型、半导体',
    focusKo: 'AI 인프라, 데이터센터, 파운데이션 모델, 반도체',
    focusJa: 'AI インフラストラクチャ、データセンター、基盤モデル、半導体',
    focusEn: 'AI infrastructure, data centres, foundation models, semiconductors',
    notableDeals:
      '2026 年入股 OpenAI（1220 亿美元轮）与 Anthropic（Series H）；FY2026 另投 xAI、SpaceX、CuspAI、PhysicsX，增持 ASML/Broadcom/Nvidia、新买 Lam Research；2025 年加入 BlackRock/MGX/微软/Nvidia 发起的 AI Infrastructure Partnership。年报 2026 定下目标：AI 相关投资占比从 6% 提到 10–15%（2031 年 3 月前）',
    notableDealsEn:
      'Took stakes in OpenAI ($122B round) and Anthropic (Series H) in 2026; also invested in xAI, SpaceX, CuspAI, and PhysicsX in FY2026, added to ASML/Broadcom/Nvidia and newly bought Lam Research; joined the BlackRock/MGX/Microsoft/Nvidia-launched AI Infrastructure Partnership in 2025. Temasek Review 2026 sets a target of growing AI-related exposure from 6% to 10–15% by March 2031',
    notableDealsJa:
      '2026 年に OpenAI（1220 億ドルラウンド）と Anthropic（Series H）に出資；FY2026 には xAI、SpaceX、CuspAI、PhysicsX にも投資し、ASML/Broadcom/Nvidia を買い増し、Lam Research を新規購入；2025 年に BlackRock/MGX/マイクロソフト/Nvidia が立ち上げた AI Infrastructure Partnership に参加。年次報告書 2026 は AI 関連投資比率を 6%から 10–15%へ（2031 年 3 月まで）という目標を設定',
    notableDealsKo:
      '2026년 OpenAI(1220억 달러 라운드)와 Anthropic(Series H)에 투자; FY2026에는 xAI, SpaceX, CuspAI, PhysicsX에도 투자하고 ASML/Broadcom/Nvidia를 추가 매수, Lam Research를 신규 매입; 2025년 BlackRock/MGX/마이크로소프트/Nvidia가 출범시킨 AI Infrastructure Partnership에 합류. 연차보고서 2026은 AI 관련 투자 비중을 6%에서 10–15%로(2031년 3월까지) 확대한다는 목표를 설정',
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
      '连续三轮投资 Anthropic（Series F/G/H，其中 Series G 与 Coatue 共同领投）；与 Equinix、CPP 设超 150 亿美元数据中心合资；2026 年与 Macquarie、Anthropic 成立 Theseus Infrastructure，为初期聚焦美国的 AI 数据中心项目提供主要股权资本',
    notableDealsEn:
      'Invested in Anthropic across three consecutive rounds (Series F/G/H, co-leading Series G with Coatue); formed a >$15B data centre JV with Equinix and CPP; formed Theseus Infrastructure with Macquarie and Anthropic in 2026, providing most of the equity for initially US-focused AI data-centre projects',
    notableDealsJa:
      'Anthropic に 3 ラウンド連続で投資（Series F/G/H、Series G は Coatue と共同リード）；Equinix、CPP と 150 億ドル超のデータセンター合弁を設立；2026 年に Macquarie、Anthropic と Theseus Infrastructure を設立し、当初米国に注力する AI データセンタープロジェクトの主要エクイティを提供',
    notableDealsKo:
      'Anthropic에 3개 라운드 연속 투자(Series F/G/H, Series G는 Coatue와 공동 리드); Equinix, CPP와 150억 달러 초과 데이터센터 합작 설립; 2026년 Macquarie, Anthropic과 Theseus Infrastructure를 설립해 초기 미국 중심 AI 데이터센터 프로젝트의 주요 자기자본을 제공',
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
    title: 'Pints AI荣获新加坡AI财务全球挑战创业补助金',
    titleEn: 'Pints AI Wins AI in Finance Global Challenge Startup Grant',
    titleJa: 'Pints AIが「AI in Finance Global Challenge」起業助成金を獲得しました。',
    titleKo: 'Pints AI 싱가포르 AI 금융 글로벌 챌린지 창업 보조금 획득',
    description:
      'Pints AI是一家隐私优先的企业生成式AI平台，致力于为金融机构提供私有化部署的AI解决方案。该公司在2023年MAS和AI新加坡联合举办的"AI in Finance Global Challenge"比赛中获胜，并获得AI新加坡创业补助金。Pints AI通过开发紧凑型语言模型，使金融机构能够在不暴露敏感数据的情况下构建安全的AI工具，解决了数据隐私和高计算成本的核心问题。',
    descriptionEn:
      'Pints AI, a privacy-first enterprise Gen AI platform, won the "AI in Finance Global Challenge" organized by Singapore\'s Monetary Authority (MAS) and AI Singapore (AISG), and was awarded the AIGC Startup Grant. The company specializes in deploying compact language models within clients\' private infrastructure, enabling financial institutions to build secure AI solutions without exposing sensitive data. Pints AI addresses key barriers to Gen AI adoption in finance, including data privacy concerns and computational costs.',
    descriptionJa:
      'Pints AIは、プライバシー優先のエンタープライズ向け生成型AIプラットフォームであり、金融機関がプライベート環境でAIソリューションを展開できるようにすることに取り組んでいます。同社は、2023年にMASとAISGが共同で開催した「AI in Finance Global Challenge」コンテストで優勝し、AISGスタートアップ助成金を獲得しました。Pints AIは、コンパクト言語モデルの開発を通じて、金融機関が機密データを暴露することなく安全なAIツールを構築できるようにし、データプライバシーと高い計算コストの課題を解決しました。',
    descriptionKo:
      'Pints AI는 프라이버시 우선의 기업용 생성형 AI 플랫폼으로, 금융기관에 프라이빗 배포 AI 솔루션을 제공하는 데 주력하고 있습니다. 이 회사는 2023년 MAS와 AISG가 공동 주최한 「AI in Finance Global Challenge」 대회에서 우승했으며, AISG 창업 보조금을 획득했습니다. Pints AI는 경량 언어 모델 개발을 통해 금융기관이 민감한 데이터를 노출하지 않고도 안전한 AI 도구를 구축할 수 있도록 했으며, 데이터 프라이버시와 높은 계산 비용이라는 핵심 문제를 해결했습니다.',
    category: '融资轮',
    confidence: 'high',
    sourceUrl: 'https://aisingapore.org/ai-in-finance-global-challenge-startup-grant-awardee/',
    discoveredAt: '2026-07-28',
  },
];

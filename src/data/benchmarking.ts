// 国际对标数据 — International Benchmarking Data

export interface RegionSummary {
  flag: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  strategy: string;
  strategyEn?: string;
  strategyJa?: string;
  strategyKo?: string;
  strategyYear: string;
  investment: string;
  investmentEn?: string;
  investmentJa?: string;
  investmentKo?: string;
  governance: string;
  governanceEn?: string;
  governanceJa?: string;
  governanceKo?: string;
  strength: string;
  strengthEn?: string;
  strengthJa?: string;
  strengthKo?: string;
  aiRanking?: string;
}

export const regions: RegionSummary[] = [
  {
    flag: '🇸🇬',
    name: '新加坡',
    nameKo: '싱가포르',
    nameJa: 'シンガポール',
    nameEn: 'Singapore',
    strategy: 'NAIS 2.0',
    strategyEn: 'NAIS 2.0',
    strategyYear: '2023',
    investment: 'S$2B+ 政府 / US$26B+ 科技巨头',
    investmentKo: 'S$2B+ 정부 / US$26B+ 기술 대기업',
    investmentJa: 'S$2B+ 政府 / US$26B+ テック大手',
    investmentEn: 'S$2B+ government / US$26B+ tech giants',
    governance: '框架+测试（AI Verify）',
    governanceKo: '프레임워크+테스트 (AI Verify)',
    governanceJa: 'フレームワーク+テスト（AI Verify）',
    governanceEn: 'Framework + testing (AI Verify)',
    strength: '治理先行，国际枢纽',
    strengthKo: '거버넌스 선행, 국제 허브',
    strengthJa: 'ガバナンス先行、国際ハブ',
    strengthEn: 'Governance-led, international hub',
    aiRanking: 'Tortoise #3, Oxford #2',
  },
  {
    flag: '🇭🇰',
    name: '香港',
    nameKo: '홍콩',
    nameJa: '香港',
    nameEn: 'Hong Kong',
    strategy: '创新科技蓝图',
    strategyKo: '혁신 기술 청사진',
    strategyJa: 'イノベーション技術ブループリント',
    strategyEn: 'Innovation & Technology Blueprint',
    strategyYear: '2022',
    investment: 'HK$20B+',
    investmentEn: 'HK$20B+',
    governance: '自愿性指引，无专门法',
    governanceKo: '자발적 지침, 전문 입법 없음',
    governanceJa: '自発的ガイドライン、専門法なし',
    governanceEn: 'Voluntary guidelines, no dedicated law',
    strength: '大湾区桥梁，3000 PFLOPS 超算',
    strengthKo: '광역만 가교, 3000 PFLOPS 슈퍼컴퓨터',
    strengthJa: '大湾区ブリッジ、3000 PFLOPS スーパーコンピュータ',
    strengthEn: 'Greater Bay Area bridge, 3000 PFLOPS supercomputing',
    aiRanking: '—',
  },
  {
    flag: '🇹🇼',
    name: '台湾',
    nameKo: '타이완',
    nameJa: '台湾',
    nameEn: 'Taiwan',
    strategy: 'AI 岛计划 / AI 基本法',
    strategyKo: 'AI 아일랜드 계획 / AI 기본법',
    strategyJa: 'AI アイランド計画 / AI 基本法',
    strategyEn: 'AI Island Plan / AI Basic Act',
    strategyYear: '2025',
    investment: '~NT$100B (~US$3.1B)',
    investmentEn: '~NT$100B (~US$3.1B)',
    governance: '原则性框架法（2025.12 通过）',
    governanceKo: '원칙 기반 프레임워크 법 (2025.12 통과)',
    governanceJa: '原則的フレームワーク法（2025.12 可決）',
    governanceEn: 'Principles-based framework law (passed Dec 2025)',
    strength: '半导体霸主（TSMC）',
    strengthKo: '반도체 패권 (TSMC)',
    strengthJa: '半導体覇者（TSMC）',
    strengthEn: 'Semiconductor hegemon (TSMC)',
    aiRanking: '—',
  },
  {
    flag: '🇦🇪',
    name: 'UAE',
    nameEn: 'UAE',
    strategy: 'AI 战略 2031',
    strategyKo: 'AI 전략 2031',
    strategyJa: 'AI 戦略 2031',
    strategyEn: 'AI Strategy 2031',
    strategyYear: '2017/2021',
    investment: '$100B MGX 基金 / $15.2B 微软',
    investmentKo: '$100B MGX 펀드 / $15.2B 마이크로소프트',
    investmentJa: 'S$100B MGX ファンド / $15.2B マイクロソフト',
    investmentEn: '$100B MGX fund / $15.2B Microsoft',
    governance: '自愿伦理准则，沙盒友好',
    governanceKo: '자발적 윤리 기준, 샌드박스 친화적',
    governanceJa: '自発的倫理準則、サンドボックス対応',
    governanceEn: 'Voluntary ethics code, sandbox-friendly',
    strength: '资本最雄厚，全球首任 AI 部长',
    strengthKo: '자본 최강, 세계 최초 AI 장관',
    strengthJa: '資本最豊富、世界初 AI 大臣',
    strengthEn: "Largest capital pool, world's first AI Minister",
    aiRanking: 'Tortoise #18, Oxford #3',
  },
  {
    flag: '🇮🇱',
    name: '以色列',
    nameKo: '이스라엘',
    nameJa: 'イスラエル',
    nameEn: 'Israel',
    strategy: '国家 AI 计划',
    strategyKo: '국가 AI 계획',
    strategyJa: '国家 AI 計画',
    strategyEn: 'National AI Program',
    strategyYear: '2021',
    investment: 'NIS 5.26B (~$1.48B) 但仅花 20%',
    investmentKo: 'NIS 5.26B (~$1.48B) 하지만 20% 만 사용',
    investmentJa: 'NIS 5.26B（~$1.48B）だが支出は 20% のみ',
    investmentEn: 'NIS 5.26B (~$1.48B) but only 20% spent',
    governance: '软法+行业自治，无水平立法',
    governanceKo: '소프트 로우+산업 자치, 수평적 입법 없음',
    governanceJa: 'ソフトロー+業界自治、水平立法なし',
    governanceEn: 'Soft law + sector self-regulation, no horizontal legislation',
    strength: '创业密度全球最高，8200 人才管线',
    strengthKo: '창업 밀도 세계 최고, 8,200명 인재 파이프라인',
    strengthJa: 'スタートアップ密度世界最高、8200 人才パイプライン',
    strengthEn: 'Highest startup density globally, Unit 8200 talent pipeline',
    aiRanking: '—',
  },
  {
    flag: '🇰🇷',
    name: '韩国',
    nameKo: '한국',
    nameJa: '韓国',
    nameEn: 'South Korea',
    strategy: 'K-AI 战略 / AI 基本法',
    strategyKo: 'K-AI 전략 / AI 기본법',
    strategyJa: 'K-AI 戦略 / AI 基本法',
    strategyEn: 'K-AI Strategy / AI Basic Act',
    strategyYear: '2019/2025',
    investment: '₩100 万亿 (~$71.5B) 公私基金',
    investmentKo: '₩100조 (~$71.5B) 공민 기금',
    investmentJa: '₩100 万億（~$71.5B）官民ファンド',
    investmentEn: '₩100 trillion (~$71.5B) public-private fund',
    governance: 'AI 基本法（2024 通过）',
    governanceKo: 'AI 기본법 (2024 통과)',
    governanceJa: 'AI 基本法（2024 可決）',
    governanceEn: 'AI Basic Act (passed 2024)',
    strength: '财阀+半导体，投资规模碾压',
    strengthKo: '재벌+반도체, 투자 규모 압도',
    strengthJa: '財閥+半導体、投資規模圧倒的',
    strengthEn: 'Chaebols + semiconductors, dominant investment scale',
    aiRanking: 'Tortoise #7',
  },
  {
    flag: '🇪🇪',
    name: '爱沙尼亚',
    nameKo: '에스토니아',
    nameJa: 'エストニア',
    nameEn: 'Estonia',
    strategy: 'Kratt AI 战略',
    strategyKo: 'Kratt AI 전략',
    strategyJa: 'Kratt AI 戦略',
    strategyEn: 'Kratt AI Strategy',
    strategyYear: '2019',
    investment: '€10M（极致效率）',
    investmentKo: '€10M (극한 효율)',
    investmentJa: '€10M（最高効率）',
    investmentEn: '€10M (extreme efficiency)',
    governance: 'AI Agent 法律定义先驱',
    governanceKo: 'AI Agent 법적 정의 선구자',
    governanceJa: 'AI Agent 法的定義パイオニア',
    governanceEn: 'Pioneer in legal definition of AI Agents',
    strength: '数字政府全球第一，50+ 政府 AI 用例',
    strengthKo: '디지털 정부 세계 1위, 50+ 정부 AI 사용 사례',
    strengthJa: 'デジタル政府世界第一、50+ 政府 AI ユースケース',
    strengthEn: "World's #1 digital government, 50+ government AI use cases",
    aiRanking: '—',
  },
  {
    flag: '🇨🇭',
    name: '瑞士',
    nameKo: '스위스',
    nameJa: 'スイス',
    nameEn: 'Switzerland',
    strategy: '联邦 AI 战略',
    strategyKo: '연방 AI 전략',
    strategyJa: '連邦 AI 戦略',
    strategyEn: 'Federal AI Strategy',
    strategyYear: '2020/2025',
    investment: 'CHF 1B+ 研究（ETH/EPFL）',
    investmentKo: 'CHF 1B+ 연구（ETH/EPFL）',
    investmentJa: 'CHF 1B+ 研究（ETH/EPFL）',
    investmentEn: 'CHF 1B+ research (ETH/EPFL)',
    governance: '创新优先，轻监管',
    governanceKo: '혁신 우선, 가벼운 규제',
    governanceJa: 'イノベーション優先、軽規制',
    governanceEn: 'Innovation-first, light-touch regulation',
    strength: 'ETH/EPFL 全球 Top 5，Google Zurich',
    strengthKo: 'ETH/EPFL 글로벌 Top 5, Google Zurich',
    strengthJa: 'ETH/EPFL グローバル Top 5、Google Zurich',
    strengthEn: 'ETH/EPFL global Top 5, Google Zurich',
    aiRanking: 'Tortoise #9',
  },
  {
    flag: '🇫🇮',
    name: '芬兰',
    nameKo: '핀란드',
    nameJa: 'フィンランド',
    nameEn: 'Finland',
    strategy: 'AI Finland / AuroraAI',
    strategyEn: 'AI Finland / AuroraAI',
    strategyYear: '2017',
    investment: '€100M+ AI 商业计划',
    investmentKo: '€100M+ AI 비즈니스 계획',
    investmentJa: '€100M+ AI ビジネス計画',
    investmentEn: '€100M+ AI business programme',
    governance: '人本伦理，欧盟 AI 法对齐',
    governanceKo: '인간중심 윤리, EU AI 법 정렬',
    governanceJa: '人本主義倫理、EU AI 法調整',
    governanceEn: 'Human-centric ethics, aligned with EU AI Act',
    strength: 'Elements of AI 全民课程，AuroraAI 公民服务',
    strengthKo: 'Elements of AI 전 국민 교육과정, AuroraAI 시민 서비스',
    strengthJa: 'Elements of AI 国民向け課程、AuroraAI 公民サービス',
    strengthEn: 'Elements of AI national course, AuroraAI citizen services',
    aiRanking: '—',
  },
  {
    flag: '🇨🇦',
    name: '加拿大',
    nameKo: '캐나다',
    nameJa: 'カナダ',
    nameEn: 'Canada',
    strategy: '泛加拿大 AI 战略',
    strategyKo: '범캐나다 AI 전략',
    strategyJa: 'パン・カナダ AI 戦略',
    strategyEn: 'Pan-Canadian AI Strategy',
    strategyYear: '2017/2024',
    investment: 'CAD $2.4B（2024 预算）',
    investmentKo: 'CAD $2.4B（2024년 예산）',
    investmentJa: 'CAD $2.4B（2024 予算）',
    investmentEn: 'CAD $2.4B (2024 budget)',
    governance: '自愿行为准则，AIDA 法案搁置',
    governanceKo: '자발적 행동 준칙, AIDA 법안 보류',
    governanceJa: '自発的行動準則、AIDA 法案保留',
    governanceEn: 'Voluntary code of conduct, AIDA bill shelved',
    strength: '深度学习发源地，Mila/Vector/Amii',
    strengthKo: '딥러닝 발원지, Mila/Vector/Amii',
    strengthJa: 'ディープラーニング発祥地、Mila/Vector/Amii',
    strengthEn: 'Birthplace of deep learning; Mila/Vector/Amii',
    aiRanking: 'Tortoise #5',
  },
];

export interface RegionDetail {
  flag: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  fullName: string;
  fullNameEn?: string;
  fullNameJa?: string;
  fullNameKo?: string;
  overview: string;
  overviewEn?: string;
  overviewJa?: string;
  overviewKo?: string;
  strategies: {
    name: string;
    nameEn?: string;
    nameJa?: string;
    nameKo?: string;
    year: string;
    description: string;
    descriptionEn?: string;
    descriptionJa?: string;
    descriptionKo?: string;
  }[];
  investment: {
    item: string;
    itemEn?: string;
    itemJa?: string;
    itemKo?: string;
    amount: string;
    amountEn?: string;
    amountJa?: string;
    amountKo?: string;
    note: string;
    noteEn?: string;
    noteJa?: string;
    noteKo?: string;
  }[];
  governance: string;
  governanceEn?: string;
  governanceJa?: string;
  governanceKo?: string;
  keyInitiatives: string[];
  keyInitiativesEn?: string[];
  keyInitiativesJa?: string[];
  keyInitiativesKo?: string[];
  strengths: string[];
  strengthsEn?: string[];
  strengthsJa?: string[];
  strengthsKo?: string[];
  weaknesses: string[];
  weaknessesEn?: string[];
  weaknessesJa?: string[];
  weaknessesKo?: string[];
  keyBodies: {
    name: string;
    nameEn?: string;
    nameJa?: string;
    nameKo?: string;
    role: string;
    roleEn?: string;
    roleJa?: string;
    roleKo?: string;
  }[];
  sources: string[];
  sourcesEn?: string[];
  sourcesJa?: string[];
  sourcesKo?: string[];
  /**
   * Per-drilldown deep-content overrides keyed by `localId` (the same value
   * used to derive the drilldown slug — e.g. `core-strategy`,
   * `comparative-strength`, `strategy-1`, `investment-3`, `initiative-2`,
   * `body-4`). When a key is present, its `analysis` becomes the drilldown
   * page body and `sources` becomes a structured (label + url) reference
   * list. When absent, the drilldown falls back to the auto-generated
   * template body and the page is marked `_analysisPending`, which drives
   * SEO noindex (so thin doorway pages don't get indexed before they are
   * filled in).
   */
  drilldownEnrichments?: Record<string, BenchmarkDrilldownAnalysis>;
}

export interface BenchmarkDrilldownAnalysis {
  analysis: string;
  analysisEn?: string;
  analysisJa?: string;
  analysisKo?: string;
  sources?: BenchmarkAnalysisSource[];
}

export interface BenchmarkAnalysisSource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  url: string;
  date?: string;
}

export const regionDetails: RegionDetail[] = [
  {
    flag: '🇸🇬',
    name: '新加坡',
    nameKo: '싱가포르',
    nameJa: 'シンガポール',
    nameEn: 'Singapore',
    fullName: '新加坡共和国',
    fullNameKo: '싱가포르 공화국',
    fullNameJa: 'シンガポール共和国',
    fullNameEn: 'Republic of Singapore',
    overview:
      '新加坡 2023 年 12 月发布 NAIS 2.0，提出"AI for the Public Good"愿景，3 年累计政府承诺 S$20 亿+，加上科技巨头 US$260 亿+ 投入。AI 治理上靠 AI Verify 工具化框架（2022 IMDA + 2023 升级为基金会）+ Model AI Governance Framework（2019/2020）输出全球；产业上靠 AI Singapore（AISG，研发 + 创业）+ GovTech（政府部署）+ MAS（金融业 AI）三轨并进。',
    overviewKo:
      '싱가포르는 2023년 12월 NAIS 2.0을 발표하고, 「AI for the Public Good」 비전을 제시했으며, 3년 누적 정부 약속 S$20억+에 기술 거물 US$260억+ 투입을 더했습니다. AI 거버넌스는 AI Verify 도구화 프레임워크(2022 IMDA + 2023 재단으로 업그레이드) + Model AI Governance Framework(2019/2020)로 글로벌 배포를 추진하며; 산업은 AI Singapore(AISG, 연구 + 창업) + GovTech(정부 배포) + MAS(금융 AI) 세 궤도 병행으로 진행합니다.',
    overviewJa:
      'シンガポールは 2023 年 12 月に NAIS 2.0 を発布し、「AI for the Public Good」ビジョンを提唱しました。3 年間の累計政府承諾は S$20 億+、テック大手からの US$260 億+ 投資を含みます。AI ガバナンスは AI Verify ツール化フレームワーク（2022 年 IMDA + 2023 年基金会へのアップグレード）+ Model AI Governance Framework（2019/2020）による世界的な展開に依存しています。産業面では AI Singapore（AISG、研究開発+起業）+ GovTech（政府デプロイメント）+ MAS（金融 AI）の 3 つのトラックを並行して推進しています。',
    overviewEn:
      'Singapore released NAIS 2.0 in December 2023 with an "AI for the Public Good" vision, committing S$2bn+ in government spend over three years plus US$26bn+ from tech-giant infrastructure. Governance leans on the toolised AI Verify framework (IMDA 2022, upgraded into the AI Verify Foundation 2023) plus the Model AI Governance Framework (2019/2020) exported globally. Industry layers AI Singapore (AISG: R&D + startups) + GovTech (government deployment) + MAS (financial-sector AI) on three parallel tracks.',
    strategies: [
      {
        name: 'NAIS 2.0',
        nameEn: 'NAIS 2.0',
        year: '2023',
        description: '"AI for the Public Good" 愿景、3 系统 / 10 使能器 / 15 行动',
        descriptionKo: '「AI for the Public Good」 비전, 3개 시스템 / 10개 인에이블러 / 15개 액션',
        descriptionJa: '「AI for the Public Good」ビジョン、3 つのシステム / 10 個のエナブラー / 15 のアクション',
        descriptionEn: '"AI for the Public Good" vision; 3 systems / 10 enablers / 15 actions',
      },
      {
        name: 'AI Verify Framework',
        nameEn: 'AI Verify Framework',
        year: '2022',
        description: '全球首个开源可测试 AI 治理工具集；2023 年升级为 AI Verify Foundation',
        descriptionKo:
          '전 세계 최초의 오픈소스 테스트 가능한 AI 거버넌스 도구 세트; 2023년 AI Verify Foundation으로 업그레이드',
        descriptionJa:
          '世界初のオープンソース、テスト可能な AI ガバナンスツールセット。2023 年 AI Verify Foundation にアップグレード',
        descriptionEn:
          "World's first open-source testable AI governance toolkit; upgraded to AI Verify Foundation in 2023",
      },
      {
        name: 'Model AI Governance Framework',
        nameEn: 'Model AI Governance Framework',
        year: '2019',
        description: 'IMDA 发布的自愿性企业 AI 伦理框架，2020 升级版被 OECD 引用',
        descriptionKo: 'IMDA 발표 자발적 기업 AI 윤리 프레임워크, 2020년 업그레이드 버전이 OECD에 인용됨',
        descriptionJa:
          'IMDA が発布した自発的企業 AI 倫理フレームワーク、2020 年アップグレード版は OECD に引用されました',
        descriptionEn: 'IMDA voluntary enterprise AI ethics framework; the 2020 update was cited by OECD',
      },
      {
        name: 'NAIS 1.0',
        nameEn: 'NAIS 1.0',
        year: '2019',
        description: '首份国家 AI 战略，5 个国家 AI 项目（医疗、教育、安全、物流、智慧城市）',
        descriptionKo: '첫 번째 국가 AI 전략, 5개 국가 AI 프로젝트(의료, 교육, 안전, 물류, 스마트 시티)',
        descriptionJa: '最初の国家 AI 戦略、5 つの国家 AI プロジェクト（医療、教育、安全、物流、スマートシティ）',
        descriptionEn:
          'First national AI strategy; five National AI Projects (health, education, safety, logistics, smart city)',
      },
    ],
    investment: [
      {
        item: 'NAIS 2.0 政府承诺',
        itemKo: 'NAIS 2.0 정부 약속',
        itemJa: 'NAIS 2.0 政府承諾',
        itemEn: 'NAIS 2.0 government commitment',
        amount: 'S$20 亿+',
        amountKo: 'S$20억+',
        amountJa: 'S$20 億+',
        amountEn: 'S$2 billion+',
        note: '2023-2026 三年期，含 AI 基础设施 + 人才 + 产业',
        noteKo: '2023-2026 3년 기간, AI 인프라 + 인재 + 산업 포함',
        noteJa: '2023-2026 年間の 3 年間、AI インフラ + 人材 + 産業を含む',
        noteEn: 'Three-year envelope 2023-2026, covering AI infrastructure + talent + industry',
      },
      {
        item: '科技巨头基础设施投入',
        itemKo: '기술 거물 인프라 투자',
        itemJa: 'テック大手インフラ投資',
        itemEn: 'Tech-giant infrastructure investment',
        amount: 'US$260 亿+',
        amountKo: 'US$260억+',
        amountJa: 'US$260 億+',
        amountEn: 'US$26 billion+',
        note: 'Microsoft / Google / AWS / Equinix / NVIDIA APAC 在新加坡的数据中心 + 区域 HQ 累计承诺',
        noteKo: 'Microsoft / Google / AWS / Equinix / NVIDIA APAC의 싱가포르 데이터 센터 + 지역 본부 누적 약속',
        noteJa:
          'Microsoft / Google / AWS / Equinix / NVIDIA APAC のシンガポール内のデータセンター + 地域 HQ 累計コミットメント',
        noteEn:
          'Cumulative commitments by Microsoft / Google / AWS / Equinix / NVIDIA APAC for Singapore data centres + regional HQs',
      },
      {
        item: 'AI Singapore（AISG）',
        itemEn: 'AI Singapore (AISG)',
        amount: 'S$5 亿+',
        amountKo: 'S$5억+',
        amountJa: 'S$5 億+',
        amountEn: 'S$500 million+',
        note: '2017 年起 NRF 资助累计；含研究 + AIAP 学徒计划 + 国家级项目',
        noteKo: '2017년부터 NRF 자금 누적; 연구 + AIAP 견습 계획 + 국가급 프로젝트 포함',
        noteJa: '2017 年からの NRF 資金調達累計。研究 + AIAP インターンシップ計画 + 国家級プロジェクトを含む',
        noteEn: 'Cumulative NRF funding since 2017; covers research + AIAP apprenticeship + National AI Projects',
      },
    ],
    governance:
      '新加坡治理是"工具化框架 + 自愿守则 + 国际输出"模式：AI Verify（2022）是全球首个开源可测试 AI 治理工具集；Model AI Governance Framework（2019/2020）是企业自愿性伦理框架，被 OECD AI Principles 工作组引用；MAS Veritas（2019 起）覆盖金融业 AI 风险评估。无水平性 AI 立法，靠 PDPA（数据隐私）+ 行业监管补位。',
    governanceKo:
      '싱가포르 거버넌스는 「도구화 프레임워크 + 자발적 지침 + 국제 배포」 모드입니다. AI Verify(2022)는 전 세계 최초의 오픈소스 테스트 가능한 AI 거버넌스 도구 세트입니다. Model AI Governance Framework(2019/2020)는 기업 자발적 윤리 프레임워크이며 OECD AI Principles 워킹그룹에서 인용되었습니다. MAS Veritas(2019년부터)는 금융 산업 AI 위험 평가를 다룹니다. 수평적 AI 입법이 없으며 PDPA(데이터 개인정보보호) + 산업 규제로 보충합니다.',
    governanceJa:
      'シンガポールのガバナンスは「ツール化フレームワーク + 自発的ガイドライン + 国際的な展開」モデルです。AI Verify（2022）は世界初のオープンソース、テスト可能な AI ガバナンスツールセット。Model AI Governance Framework（2019/2020）は企業の自発的倫理フレームワークで、OECD AI Principles ワーキンググループにより引用されています。MAS Veritas（2019 年から）は金融業界の AI リスク評価をカバーしています。水平的 AI 立法はなく、PDPA（データプライバシー）+ 業界規制によって補完されています。',
    governanceEn:
      'Singapore governance is a "toolised framework + voluntary code + international export" model: AI Verify (2022) is the world\'s first open-source testable AI governance toolkit; the Model AI Governance Framework (2019/2020) is a voluntary enterprise ethics framework cited by the OECD AI Principles working group; MAS Veritas (since 2019) covers financial-sector AI risk assessment. There is no horizontal AI legislation; PDPA (data privacy) plus sectoral regulators fill the gap.',
    keyInitiatives: [
      'AI Verify Foundation（开源治理工具集）',
      'AI Singapore（AISG）研发 + AIAP 学徒计划',
      'SEA-LION 东南亚多语言大模型',
      'NSCC（国家超算中心）AI 算力',
      'GovTech AI 政府用例（含 LifeSG / Pair / 政府 AI 工具）',
    ],
    keyInitiativesEn: [
      'AI Verify Foundation (open-source governance toolkit)',
      'AI Singapore (AISG) — R&D + AIAP apprenticeship',
      'SEA-LION Southeast Asian multilingual large model',
      'NSCC (National Supercomputing Centre) AI compute',
      'GovTech AI government use cases (LifeSG / Pair / government AI tools)',
    ],
    strengths: [
      '全球首个开源 AI 治理工具集（AI Verify）出口；新加坡是国际 AI 治理对话核心节点',
      '英语 + 双语 + 中立外交立场让新加坡成为美中 AI 之间的"trusted neutral"',
      '科技巨头 US$260 亿+ 区域 HQ + 数据中心承诺，规模远超新加坡政府直投',
      'GovTech 政府 AI 部署成熟度高，LifeSG / Pair 等产品有出口潜力',
    ],
    strengthsEn: [
      "World's first open-source AI governance toolkit (AI Verify) export; Singapore is a core node in the international AI governance dialogue",
      'English-bilingual and neutral diplomatic stance makes Singapore the "trusted neutral" between US and China AI',
      'Tech-giant US$26bn+ commitments for regional HQs + data centres dwarf direct government AI spend',
      'GovTech is mature in government AI deployment; LifeSG / Pair-style products have export potential',
    ],
    weaknesses: [
      '本土 AI frontier model 能力远落后美中（vs 韩国 HyperCLOVA、UAE Falcon、加拿大 Cohere）',
      '本土 AI 创业生态规模小（vs 以色列、加拿大），主要依赖区域型公司（Sea Group、Grab）',
      '土地 + 电力约束限制大规模算力扩张（vs UAE 1GW Stargate、香港 3000 PFLOPS AISC）',
      '语言 / 文化多样性低于亚洲大国，限制本土训练大模型市场',
    ],
    weaknessesEn: [
      'Sovereign frontier-model capability trails the US/China by a wide margin (vs Korea HyperCLOVA, UAE Falcon, Canada Cohere)',
      'Local AI startup ecosystem is small relative to Israel or Canada; relies on regional players (Sea Group, Grab)',
      'Land and power constraints limit large-scale compute expansion (vs UAE 1 GW Stargate, HK 3 000 PFLOPS AISC)',
      'Lower linguistic / cultural diversity than larger Asian states limits the addressable market for local large-model training',
    ],
    keyBodies: [
      {
        name: 'SNDGO（智慧国数字政府办公室）',
        nameKo: 'SNDGO(스마트 국가 디지털정부청)',
        nameJa: 'SNDGO（Smart Nation Digital Government Office）',
        nameEn: 'SNDGO (Smart Nation and Digital Government Office)',
        role: '全政府 AI / 数字战略协调',
        roleKo: '전 정부 AI/디지털 전략 조정',
        roleJa: '全政府 AI / デジタル戦略調整',
        roleEn: 'Whole-of-government AI / digital strategy coordinator',
      },
      {
        name: 'IMDA（信息通信媒体发展局）',
        nameKo: 'IMDA(정보통신미디어개발청)',
        nameJa: 'IMDA（Information Media Development Authority）',
        nameEn: 'IMDA (Infocomm Media Development Authority)',
        role: 'AI Verify、Model AI Governance Framework 主管',
        roleKo: 'AI Verify, Model AI Governance Framework 주관',
        roleJa: 'AI Verify、Model AI Governance Framework 主管',
        roleEn: 'Lead authority for AI Verify and the Model AI Governance Framework',
      },
      {
        name: 'AI Singapore（AISG）',
        nameEn: 'AI Singapore (AISG)',
        role: '国家级 AI 研发 + AIAP 学徒 + SEA-LION 主导',
        roleKo: '국가급 AI 연구개발 + AIAP 학도 + SEA-LION 주도',
        roleJa: '国家級 AI 研究開発 + AIAP インターンシップ + SEA-LION 主導',
        roleEn: 'National AI R&D + AIAP apprenticeship + SEA-LION programme owner',
      },
      {
        name: 'GovTech',
        nameEn: 'GovTech (Government Technology Agency)',
        role: '政府 AI 部署与产品（LifeSG、Pair、政府 AI 工具）',
        roleKo: '정부 AI 배포 및 제품(LifeSG, Pair, 정부 AI 도구)',
        roleJa: '政府 AI デプロイメントと製品（LifeSG、Pair、政府 AI ツール）',
        roleEn: 'Government AI deployment and products (LifeSG, Pair, government AI toolkit)',
      },
      {
        name: 'MAS（新加坡金融管理局）',
        nameKo: 'MAS(싱가포르금융청)',
        nameJa: 'MAS（Singapore Monetary Authority）',
        nameEn: 'MAS (Monetary Authority of Singapore)',
        role: '金融业 AI 监管 + Veritas 框架',
        roleKo: '금융업 AI 규제 + Veritas 프레임워크',
        roleJa: '金融業 AI 規制 + Veritas フレームワーク',
        roleEn: 'Financial-sector AI regulation and the Veritas framework',
      },
    ],
    sources: [
      'NAIS 2.0 全文（go.gov.sg/sgnationalaistrategy）',
      'AI Verify Foundation 官网',
      'AI Singapore 官网与年报',
    ],
    sourcesEn: [
      'NAIS 2.0 full text (go.gov.sg/sgnationalaistrategy)',
      'AI Verify Foundation official site',
      'AI Singapore official site and annual reports',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysisEn:
          'Singapore\'s core AI strategy is uniquely "toolised governance + tech-giant amplification": (1) NAIS 2.0 (December 2023) lays out a "3 systems / 10 enablers / 15 actions" framework with S$2bn+ government commitment over three years; (2) AI Verify (IMDA 2022, upgraded to AI Verify Foundation 2023) is the world\'s first open-source testable AI governance toolkit, adopted as a reference by OECD and used by 100+ companies globally; (3) Model AI Governance Framework (2019/2020) is the voluntary enterprise ethics framework that OECD AI Principles directly cited; (4) industrial track runs through AI Singapore (AISG, S$500m+ cumulative since 2017), GovTech (government deployment), MAS (financial AI). Assessment: Singapore optimises for "trust export" rather than frontier-model production. The strategy is realistic about size — Singapore cannot compete with US/China on compute or model scale, so it competes on governance, deployment maturity, and trusted-neutral positioning. This is the most replicable small-state AI strategy template, but it requires high government execution + sustained political continuity that few countries have.',
        analysis:
          '新加坡核心 AI 战略独特之处是"工具化治理 + 科技巨头放大"：(1) NAIS 2.0（2023 年 12 月）提出"3 系统 / 10 使能器 / 15 行动"框架，3 年期 S$20 亿+ 政府承诺；(2) AI Verify（IMDA 2022、2023 升格为基金会）是全球首个开源可测试 AI 治理工具集，被 OECD 引为参考、100+ 公司全球采用；(3) Model AI Governance Framework（2019/2020）是企业自愿性伦理框架，OECD AI Principles 直接引用；(4) 产业轨道通过 AI Singapore（AISG，2017 至今累计 S$5 亿+）、GovTech（政府部署）、MAS（金融 AI）三线推进。判断：新加坡为"信任出口"优化，而非前沿模型生产。战略对规模现实——新加坡在算力 / 模型规模上无法与美中竞争，所以在治理、部署成熟度、可信中立定位上竞争。这是最可复制的小国 AI 战略范式，但需要高政府执行力 + 持续政治连续性，很少有国家具备。',
        analysisKo:
          '싱가포르의 핵심 AI 전략의 특이점은 「도구화된 거버넌스 + 테크 자이언트 확대」이다: (1) NAIS 2.0(2023년 12월)은 「3개 시스템 / 10개 이네이블러 / 15개 액션」 프레임워크를 제시했으며, 3년 기간 S$20억+ 정부 약속을 포함함; (2) AI Verify(IMDA 2022, 2023 재단으로 격상)는 글로벌 최초의 오픈소스, 테스트 가능한 AI 거버넌스 도구 세트로, OECD에 의해 참고로 인용되었으며, 전 세계 100+ 회사가 채택함; (3) Model AI Governance Framework(2019/2020)는 기업의 자발적 윤리 프레임워크로, OECD AI Principles에 직접 인용됨; (4) 산업 궤도는 AI Singapore(AISG, 2017년 이래 누적 S$5억+), GovTech(정부 배포), MAS(금융 AI) 세 가지 라인으로 추진됨. 평가: 싱가포르는 「신뢰의 수출」 최적화를 목표로 하며, 최첨단 모델 생산이 아님. 전략은 규모 현실에 대응한다——싱가포르는 컴퓨팅 파워/모델 규모에서 미중과 경쟁할 수 없으므로, 거버넌스, 배포 성숙도, 신뢰할 수 있는 중립 포지셔닝에서 경쟁함. 이것은 가장 복제 가능한 소국 AI 전략 패러다임이지만, 높은 정부 실행력 + 지속적인 정치 연속성이 필요하며, 이를 구비한 국가는 극히 드뭄.',
        analysisJa:
          'シンガポールの中核 AI 戦略の独自性は「ツール化ガバナンス + テック大手の拡大」です：(1) NAIS 2.0（2023 年 12 月）は「3 つのシステム / 10 個のエナブラー / 15 のアクション」フレームワークを提唱、3 年間の S$20 億+ 政府承諾。(2) AI Verify（IMDA 2022、2023 年基金会に格上げ）は世界初のオープンソース、テスト可能な AI ガバナンスツールセット、OECD に参考として引用され、100+ 企業が世界的に採用。(3) Model AI Governance Framework（2019/2020）は企業の自発的倫理フレームワーク、OECD AI Principles により直接引用。(4) 産業トラックは AI Singapore（AISG、2017 年から累計 S$5 億+）、GovTech（政府デプロイメント）、MAS（金融 AI）の 3 線で推進。判断：シンガポールは「信頼輸出」の最適化、最先端モデル生産ではありません。戦略は規模の現実に対応——シンガポールはコンピューティングパワー / モデル規模で米国と中国と競争できないため、ガバナンス、デプロイメント成熟度、信頼できる中立的な立場で競争しています。これは最も複製可能な小国 AI 戦略パラダイムですが、高い政府執行力 + 継続的な政治的連続性が必要で、これを持つ国は少数です。',
        sources: [
          {
            label: 'NAIS 2.0 官方页面（Smart Nation）',
            labelKo: 'NAIS 2.0 공식 페이지(Smart Nation)',
            labelJa: 'NAIS 2.0 公式ページ（Smart Nation）',
            labelEn: 'NAIS 2.0 official page (Smart Nation)',
            url: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
          },
          {
            label: 'NAIS 2.0 全文 PDF（go.gov.sg）',
            labelKo: 'NAIS 2.0 전체 텍스트 PDF(go.gov.sg)',
            labelJa: 'NAIS 2.0 完全版 PDF（go.gov.sg）',
            labelEn: 'NAIS 2.0 full text PDF (go.gov.sg)',
            url: 'https://file.go.gov.sg/nais2023.pdf',
            date: '2023-12-04',
          },
          {
            label: 'NAIS 2.0 发布公告（MDDI）',
            labelKo: 'NAIS 2.0 발표 공고(MDDI)',
            labelJa: 'NAIS 2.0 リリース発表（MDDI）',
            labelEn: 'NAIS 2.0 launch announcement (MDDI)',
            url: 'https://www.mddi.gov.sg/newsroom/04122023/',
            date: '2023-12-04',
          },
        ],
      },
      'investment-overview': {
        analysisEn:
          'Singapore\'s AI investment narrative is "S$2bn government + US$26bn tech-giant amplification": (1) NAIS 2.0 commits S$2bn+ over 2023-2026 across AI infrastructure (NSCC compute upgrade), talent (AISG AIAP), industry (Industry Transformation Maps); (2) US$26bn+ in tech-giant commitments — Microsoft Azure regions, Google Cloud APAC, AWS Singapore region, Equinix data centres, NVIDIA APAC HQ — none of which counts as "government AI spend" but all of which depends on Singapore\'s policy framework; (3) AI Singapore (AISG) cumulative NRF funding since 2017 is S$500m+, covering research, AIAP apprenticeship (1 000+ AI engineers placed), National AI Projects, SEA-LION large model. Assessment: Singapore\'s strategy is "government-as-platform-builder" — government spend is small in absolute terms, but it creates a platform that attracts much larger private investment. Korea / UAE / Canada all spend more in headline government commitment, but Singapore arguably wins the "private-sector amplification ratio" — every S$1 of government spend pulls roughly S$13 of tech-giant infrastructure investment.',
        analysis:
          '新加坡 AI 投资叙事是"S$20 亿政府 + US$260 亿科技巨头放大"：(1) NAIS 2.0 承诺 2023-2026 年 S$20 亿+ 跨越 AI 基础设施（NSCC 算力升级）、人才（AISG AIAP）、产业（行业转型图）；(2) US$260 亿+ 科技巨头承诺——Microsoft Azure 区域、Google Cloud APAC、AWS 新加坡区域、Equinix 数据中心、NVIDIA APAC HQ——这些都不算"政府 AI 支出"但都依赖新加坡政策框架；(3) AI Singapore（AISG）2017 年至今累计 NRF 资助 S$5 亿+，覆盖研究、AIAP 学徒（1000+ AI 工程师就位）、国家 AI 项目、SEA-LION 大模型。判断：新加坡战略是"政府作为平台建设者"——政府支出绝对值小，但创造的平台吸引远更大的私部门投资。韩国 / UAE / 加拿大头条政府承诺都更大，但新加坡可论"私部门放大比"赢——每 S$1 政府支出拉动约 S$13 科技巨头基础设施投资。',
        analysisKo:
          '싱가포르의 AI 투자 내러티브는 「S$20억 정부 + US$260억 테크 자이언트 확대」이다: (1) NAIS 2.0은 2023-2026년 S$20억+ 약속을 통해 AI 기초 인프라(NSCC 컴퓨팅 파워 업그레이드), 인재(AISG AIAP), 산업(산업 전환 지도)을 포괄함; (2) US$260억+ 테크 자이언트 약속——Microsoft Azure 리전, Google Cloud APAC, AWS 싱가포르 리전, Equinix 데이터센터, NVIDIA APAC HQ——이들은 「정부 AI 지출」로 계산되지 않지만 모두 싱가포르 정책 프레임워크에 의존함; (3) AI Singapore(AISG)는 2017년부터 현재까지 누적 NRF 자금 지원 S$5억+로, 연구, AIAP 학도(1,000+ AI 엔지니어 배치), 국가 AI 프로젝트, SEA-LION 대규모 모델을 포괄함. 평가: 싱가포르의 전략은 「정부가 플랫폼 건설자」——정부 지출의 절댓값은 작지만, 창출되는 플랫폼이 훨씬 더 큰 민간 부문 투자를 끌어당김. 한국/UAE/캐나다의 헤드라인 정부 약속은 더 크지만, 싱가포르는 「민간 부문 배수」로 우위를 점할 수 있다——매 S$1 정부 지출이 약 S$13 테크 자이언트 기초 인프라 투자를 견인함.',
        analysisJa:
          'シンガポール AI 投資の物語は「S$20 億政府 + US$260 億テック大手拡大」です：(1) NAIS 2.0 は 2023-2026 年に S$20 億+ を約束、AI インフラ（NSCC コンピューティングパワーのアップグレード）、人材（AISG AIAP）、産業（業界デジタル変革図）にまたがります。(2) US$260 億+ テック大手コミットメント——Microsoft Azure リージョン、Google Cloud APAC、AWS シンガポール リージョン、Equinix データセンター、NVIDIA APAC HQ——これらはすべて「政府 AI 支出」とはカウントされません、ただしシンガポールの政策フレームワークに依存しています。(3) AI Singapore（AISG）は 2017 年から NRF 資金調達 S$5 億+ を累計、研究、AIAP インターンシップ（1000+ AI エンジニア配置）、国家 AI プロジェクト、SEA-LION 大規模モデルをカバーしています。判断：シンガポール戦略は「政府がプラットフォームビルダーとして」機能——政府支出の絶対値は小さいですが、創造されたプラットフォームははるかに大きい民間部門投資を引き付けます。韓国 / UAE / カナダの見出しの政府承諾ははるかに大きいですが、シンガポールは「民間部門倍率」で勝つことができます——政府支出の S$1 ごとに約 S$13 のテック大手インフラ投資をもたらします。',
        sources: [
          {
            label: 'NAIS 2.0 全文 PDF',
            labelKo: 'NAIS 2.0 전체 텍스트 PDF',
            labelJa: 'NAIS 2.0 完全版 PDF',
            labelEn: 'NAIS 2.0 full text PDF',
            url: 'https://file.go.gov.sg/nais2023.pdf',
            date: '2023-12-04',
          },
          {
            label: 'NAIS 2.0 发布公告（SCAI）',
            labelKo: 'NAIS 2.0 발표 공고(SCAI)',
            labelJa: 'NAIS 2.0 リリース発表（SCAI）',
            labelEn: 'NAIS 2.0 launch announcement (SCAI)',
            url: 'https://www.scai.gov.sg/newsroom/press-release-launch-of-singapore-s-second-national-ai-strategy/',
            date: '2023-12-04',
          },
          {
            label: 'AI Singapore 官网',
            labelKo: 'AI Singapore 공식 웹사이트',
            labelJa: 'AI Singapore 公式ウェブサイト',
            labelEn: 'AI Singapore official site',
            url: 'https://www.aisingapore.org/',
          },
        ],
      },
      'governance-model': {
        analysisEn:
          "Singapore's AI governance is the \"toolised + voluntary + international export\" model: (1) no horizontal AI legislation — PDPA (Personal Data Protection Act) covers data, sectoral regulators cover specific risks; (2) AI Verify (IMDA 2022, AI Verify Foundation 2023) is the world's first open-source testable AI governance toolkit — companies run their AI through Verify's 11 governance test categories and publish reports; 100+ firms globally have used it; (3) Model AI Governance Framework (2019/2020) is the enterprise voluntary ethics framework — directly cited by OECD AI Principles; (4) MAS Veritas (2019-) is the financial-sector AI risk assessment framework, used by Singapore banks for AI-credit-scoring and AML use-case validation. Assessment: Singapore's governance is the opposite of EU AI Act / Korea AI Basic Act — instead of writing law, Singapore writes tools and exports them. The advantage: international firms find it easier to comply with a tool-based framework than a law-based one. The risk: without legal binding, voluntary frameworks rely on reputational pressure that erodes if a major AI incident hits Singapore.",
        analysis:
          '新加坡 AI 治理是"工具化 + 自愿 + 国际输出"模式：(1) 无水平性 AI 立法——PDPA（个人数据保护法）覆盖数据、行业监管覆盖具体风险；(2) AI Verify（IMDA 2022、AI Verify Foundation 2023）是全球首个开源可测试 AI 治理工具集——企业把 AI 跑过 Verify 的 11 个治理测试类别并发布报告；100+ 公司全球使用；(3) Model AI Governance Framework（2019/2020）是企业自愿性伦理框架——被 OECD AI Principles 直接引用；(4) MAS Veritas（2019 起）是金融业 AI 风险评估框架，新加坡银行用于 AI 信贷评分和反洗钱用例验证。判断：新加坡治理是 EU AI Act / 韩国 AI 基本法的对立面——不写法律，写工具并出口。优势：国际企业觉得合规工具框架比法律框架更容易。风险：缺乏法律约束，自愿框架依赖声誉压力，新加坡遇重大 AI 事故时声誉压力会衰减。',
        analysisKo:
          '싱가포르의 AI 거버넌스는 「도구화 + 자발적 + 국제 수출」 방식이다: (1) 수평적 AI 입법 부재——PDPA(개인데이터보호법)는 데이터를 포괄하고, 산업 규제는 구체적 위험을 포괄함; (2) AI Verify(IMDA 2022, AI Verify Foundation 2023)는 글로벌 최초의 오픈소스, 테스트 가능한 AI 거버넌스 도구 세트——기업은 AI를 Verify의 11개 거버넌스 테스트 카테고리를 통과시키고 리포트를 발표함; 전 세계 100+ 회사가 사용함; (3) Model AI Governance Framework(2019/2020)는 기업의 자발적 윤리 프레임워크——OECD AI Principles에 직접 인용됨; (4) MAS Veritas(2019년 이래)는 금융 산업 AI 위험 평가 프레임워크로, 싱가포르 은행이 AI 신용 점수 평가 및 자금세탁방지(AML) 사용 사례 검증에 사용함. 평가: 싱가포르의 거버넌스는 EU AI Act/한국 AI 기본법의 반대편——법을 쓰지 않고 도구를 쓰고 수출함. 장점: 국제 기업은 컴플라이언스 도구 프레임워크가 법적 프레임워크보다 더 쉽다고 생각함. 위험: 법적 구속이 부족하고, 자발적 프레임워크는 평판 압력에 의존하며, 싱가포르가 중대한 AI 사건을 경험할 때 평판 압력이 감소할 것.',
        analysisJa:
          'シンガポール AI ガバナンスは「ツール化 + 自発的 + 国際的な展開」モデルです：(1) 水平的 AI 立法なし——PDPA（個人データ保護法）がデータをカバー、業界規制が具体的なリスクをカバーします。(2) AI Verify（IMDA 2022、AI Verify Foundation 2023）は世界初のオープンソース、テスト可能な AI ガバナンスツールセット——企業は AI を Verify の 11 個のガバナンステストカテゴリを通して実行し、レポートを公開します。100+ 企業が世界的に使用。(3) Model AI Governance Framework（2019/2020）は企業の自発的倫理フレームワーク——OECD AI Principles により直接引用。(4) MAS Veritas（2019 年から）は金融業 AI リスク評価フレームワーク、シンガポール銀行が AI クレジット採点と反マネーロンダリングユースケース検証に使用。判断：シンガポールのガバナンスは EU AI Act / 韓国 AI 基本法の対立面です——法律を書きません、ツールを書いて輸出します。長所：国際企業は法的フレームワークよりもコンプライアンスツールフレームワークがより簡単だと感じます。リスク：法的制約の欠如、自発的フレームワークは評判圧力に依存、シンガポールが大きな AI 事故に遭遇したときに評判圧力は減少します。',
        sources: [
          {
            label: 'AI Verify Foundation 官网',
            labelKo: 'AI Verify Foundation 공식 웹사이트',
            labelJa: 'AI Verify Foundation 公式ウェブサイト',
            labelEn: 'AI Verify Foundation official site',
            url: 'https://aiverifyfoundation.sg/',
          },
          {
            label: 'AI Verify 介绍',
            labelKo: 'AI Verify 소개',
            labelJa: 'AI Verify の紹介',
            labelEn: 'What is AI Verify',
            url: 'https://aiverifyfoundation.sg/what-is-ai-verify/',
          },
          {
            label: 'IMDA AI 监管页面',
            labelKo: 'IMDA AI 규제 페이지',
            labelJa: 'IMDA AI 規制ページ',
            labelEn: 'IMDA AI regulatory page',
            url: 'https://www.imda.gov.sg/about-imda/emerging-technology-innovation/artificial-intelligence',
          },
        ],
      },
      'comparative-strength': {
        analysisEn:
          "Singapore's comparative strength is \"trusted neutral + governance export + tech-giant amplification\": (1) bilingual English-Chinese stance + diplomatic neutrality positions Singapore as the trusted hub between US and China AI — neither US-aligned nor China-aligned; (2) AI Verify is the world's first open-source AI governance toolkit, exported to 100+ firms; Singapore's voice in OECD AI Principles, G7 GPAI, UN AI Advisory Body is disproportionate to its size; (3) US$26bn+ tech-giant infrastructure commitment turns Singapore into Asia-Pacific's de facto AI compute hub — Microsoft Azure / Google Cloud / AWS all operate flagship APAC AI infrastructure here; (4) GovTech AI deployment is mature — LifeSG, Pair, government chatbots have demonstrated production-scale AI in public services. Weaknesses: no sovereign frontier-model capability, small startup ecosystem, land/power constraints. Assessment: Singapore's edge is structural (geography, language, neutrality) rather than capital — these are hard to replicate, but also hard to extend. Looking ahead, Singapore's challenge is whether \"trusted-neutral hub\" can hold as US-China AI rivalry intensifies; if forced to choose sides, the entire strategic foundation cracks.",
        analysis:
          '新加坡相对优势是"可信中立 + 治理出口 + 科技巨头放大"：(1) 中英双语立场 + 外交中立把新加坡定位为美中 AI 之间的可信枢纽——不是美方对齐也不是中方对齐；(2) AI Verify 是全球首个开源 AI 治理工具集，输出到 100+ 公司；新加坡在 OECD AI Principles、G7 GPAI、UN AI Advisory Body 的声音不成比例地大于规模；(3) US$260 亿+ 科技巨头基础设施承诺让新加坡成为亚太事实上的 AI 算力枢纽——Microsoft Azure / Google Cloud / AWS 都在这里运营旗舰 APAC AI 基础设施；(4) GovTech AI 部署成熟度高——LifeSG、Pair、政府聊天机器人都展示了生产规模 AI 公共服务。短板：无主权前沿模型能力、创业生态小、土地 / 电力约束。判断：新加坡优势是结构性（地理、语言、中立）而非资本——难复制也难扩展。展望：新加坡的挑战是"可信中立枢纽"在美中 AI 对抗加剧时能否守住；如果被迫选边，整个战略基础就破裂。',
        analysisKo:
          '싱가포르의 상대적 우위는 「신뢰할 수 있는 중립성 + 거버넌스 수출 + 기술 거대 기업 확대」로 구성된다: (1) 중영 이중언어 입장 + 외교적 중립성이 싱가포르를 미중 AI 사이의 신뢰할 수 있는 허브로 정위한다—미국 진영 정렬도 아니고 중국 진영 정렬도 아니다; (2) AI Verify는 전 세계 최초의 오픈소스 AI 거버넌스 도구 모음이며 100개 이상의 기업에 공급된다; 싱가포르는 OECD AI Principles, G7 GPAI, UN AI Advisory Body에서 규모에 비해 불균형적으로 큰 목소리를 갖는다; (3) US$260억 이상의 기술 대기업 인프라 약속이 싱가포르를 아시아태평양 사실상의 AI 컴퓨팅 허브로 만든다—Microsoft Azure, Google Cloud, AWS가 모두 여기서 플래그십 APAC AI 인프라를 운영한다; (4) GovTech AI 배포 성숙도가 높다—LifeSG, Pair, 정부 챗봇이 모두 프로덕션 규모 AI 공공 서비스를 보여준다. 약점: 주권 최첨단 모형 역량 부재, 스타트업 생태계 규모 부족, 토지/전력 제약. 판단: 싱가포르의 우위는 구조적(지리, 언어, 중립성)이지 자본이 아니다—복제하기 어렵고 확장도 어렵다. 전망: 싱가포르의 과제는 「신뢰할 수 있는 중립 허브」가 미중 AI 대립 심화 시에 견딜 수 있느냐이다; 만약 진영을 강제로 선택하도록 된다면 전체 전략 기초가 붕괴된다.',
        analysisJa:
          'シンガポールの相対的な優位性は「信頼できる中立性 + ガバナンス輸出 + テック大手拡大」です。(1) 中英二言語の立場 + 外交的中立がシンガポールを米中 AI 間の信頼できるハブとして位置付けています。米側対齢でもなく、中側対齢でもありません。(2) AI Verify は世界初のオープンソース AI ガバナンスツールセットであり、100+ 社に出力されています。シンガポールは OECD AI Principles、G7 GPAI、UN AI Advisory Body における発言力が規模に不釣り合いなほど大きいです。(3) US$260 億以上のテック大手インフラストラクチャー約束がシンガポールをアジア太平洋の事実上の AI 計算力ハブにしました。Microsoft Azure / Google Cloud / AWS がすべてここで旗艦的な APAC AI インフラを運営しています。(4) GovTech AI 導入の成熟度が高く、LifeSG、Pair、政府チャットボットがすべて本番規模の AI 公共サービスを示しています。短所としては、主権的な最先端モデル能力の欠如、スタートアップエコシステムの小ささ、土地/電力制約があります。判断：シンガポールの優位性は構造的（地理、言語、中立性）であり、資本的ではなく、複製も拡張も困難です。展望：シンガポールの課題は「信頼できる中立ハブ」が米中 AI 対立の激化時に保持できるかどうかです。もし側を選ぶことを強制されれば、戦略的基盤全体が崩壊します。',
        sources: [
          {
            label: 'NAIS 2.0 全文',
            labelKo: 'NAIS 2.0 전문',
            labelJa: 'NAIS 2.0 全文',
            labelEn: 'NAIS 2.0 full text',
            url: 'https://file.go.gov.sg/nais2023.pdf',
            date: '2023-12-04',
          },
          {
            label: 'AI Verify Foundation 官网',
            labelKo: 'AI Verify Foundation 공식 웹사이트',
            labelJa: 'AI Verify Foundation 公式ウェブサイト',
            labelEn: 'AI Verify Foundation official site',
            url: 'https://aiverifyfoundation.sg/',
          },
          {
            label: 'NAIS 2.0 发布公告（SCAI）',
            labelKo: 'NAIS 2.0 발표 공고(SCAI)',
            labelJa: 'NAIS 2.0 リリース発表（SCAI）',
            labelEn: 'NAIS 2.0 launch (SCAI)',
            url: 'https://www.scai.gov.sg/newsroom/press-release-launch-of-singapore-s-second-national-ai-strategy/',
            date: '2023-12-04',
          },
        ],
      },
    },
  },
  {
    flag: '🇭🇰',
    name: '香港',
    nameKo: '홍콩',
    nameJa: '香港',
    nameEn: 'Hong Kong',
    fullName: '中国香港特别行政区',
    fullNameKo: '홍콩 특별행정구',
    fullNameJa: '中華人民共和国香港特別行政区',
    fullNameEn: 'Hong Kong Special Administrative Region of China',
    overview:
      '香港近年投入超过 HK$200 亿发展 AI 与创新科技，包括在数码港建设 3000 PFLOPS 超算中心。但缺乏统一 AI 战略，多数重大举措集中在 2024-25 年才推出，属于"后发追赶"模式。',
    overviewKo:
      '홍콩은 최근 몇 년 AI 및 혁신기술 발전에 200억 홍콩달러 이상을 투자하였으며, 사이버포트에 3000 PFLOPS 슈퍼컴퓨팅 센터 구축을 포함한다. 하지만 통일된 AI 전략이 부족하고, 대부분의 중대한 조치가 2024-25년에야 출시되어 「후발 추격」 모형에 속한다.',
    overviewJa:
      '香港は近年 HK$200 億以上を投資して AI と革新技術を開発してきており、これはデジタルポート内に 3000 PFLOPS のスーパーコンピュータセンターの建設を含んでいます。しかし、統一的な AI 戦略に欠けており、主要なイニシアティブの大多数は 2024-25 年に初めて展開され、「後発追上」モデルに属しています。',
    overviewEn:
      'Hong Kong has committed over HK$20 billion to AI and innovation in recent years, including a 3000 PFLOPS supercomputing centre at Cyberport. But it lacks a unified AI strategy, with most major initiatives only launched in 2024-25 — a late-mover catch-up posture.',
    strategies: [
      {
        name: '创新科技发展蓝图',
        nameKo: '혁신기술 발전 청사진',
        nameJa: '革新技術発展ブループリント',
        nameEn: 'Innovation & Technology Development Blueprint',
        year: '2022',
        description: '首份全面科技发展规划，涵盖 AI、生物科技、金融科技等领域',
        descriptionKo: '첫 번째 종합 과학기술 개발 계획, AI·생명공학·금융기술 등 분야 포함',
        descriptionJa: 'AI、バイオテクノロジー、フィンテックなどの分野を網羅する初の包括的な技術発展計画',
        descriptionEn: 'First full-spectrum tech development plan, covering AI, biotech, fintech and other areas',
      },
      {
        name: '智慧城市蓝图 2.0',
        nameKo: '스마트시티 청사진 2.0',
        nameJa: 'スマートシティ ブループリント 2.0',
        nameEn: 'Smart City Blueprint 2.0',
        year: '2020',
        description: '推动城市数字化转型，含 AI 应用场景',
        descriptionKo: '도시 디지털화 전환 추진, AI 응용 사례 포함',
        descriptionJa: '都市のデジタル変革を推進し、AI アプリケーション情景を含む',
        descriptionEn: 'Drives urban digital transformation, including AI use cases',
      },
      {
        name: '人工智能道德框架',
        nameKo: '인공지능 윤리 프레임워크',
        nameJa: '人工知能倫理フレームワーク',
        nameEn: 'Artificial Intelligence Ethical Framework',
        year: '2024',
        description: '由数码政策办公室发布的自愿性 AI 伦理指引',
        descriptionKo: '디지털정책청이 발표한 자발적 AI 윤리 지침',
        descriptionJa: 'デジタルポリシーオフィスによって発表された、任意の AI 倫理ガイドライン',
        descriptionEn: 'Voluntary AI ethics guidelines issued by the Digital Policy Office',
      },
      {
        name: '生成式 AI 指引',
        nameKo: '생성형 AI 지침',
        nameJa: '生成型 AI ガイドライン',
        nameEn: 'Generative AI Guidelines',
        year: '2025',
        description: '针对政府部门使用生成式 AI 的操作指南',
        descriptionKo: '정부 부서의 생성형 AI 사용을 위한 운영 가이드',
        descriptionJa: '政府部門による生成型 AI の使用のための操作マニュアル',
        descriptionEn: 'Operational guide for government use of generative AI',
      },
      {
        name: '"AI Plus" 计划',
        nameKo: '「AI Plus」 계획',
        nameJa: '「AI Plus」計画',
        nameEn: '"AI Plus" Initiative',
        year: '2025',
        description: '推动 AI 在各行业落地的最新政策倡议',
        descriptionKo: '다양한 산업에 AI 적용을 추진하는 최신 정책 이니셔티브',
        descriptionJa: '様々な産業での AI の展開を促進する最新のポリシー提案',
        descriptionEn: 'Latest policy initiative driving AI adoption across industries',
      },
    ],
    investment: [
      {
        item: 'AIRDI 人工智能研发院',
        itemKo: 'AIRDI 인공지능 연구개발원',
        itemJa: 'AIRDI 人工知能研究開発院',
        itemEn: 'AIRDI (AI R&D Institute)',
        amount: 'HK$10 亿',
        amountKo: 'HK$10억',
        amountJa: 'HK$10 億',
        amountEn: 'HK$1 billion',
        note: '专注应用研发',
        noteKo: '응용 연구개발에 전념',
        noteJa: '応用研究開発に焦点を当てている',
        noteEn: 'Focused on applied R&D',
      },
      {
        item: '前沿科技基金',
        itemKo: '첨단 기술 기금',
        itemJa: 'フロンティア技術基金',
        itemEn: 'Frontier Technology Fund',
        amount: 'HK$30 亿',
        amountKo: 'HK$30억',
        amountJa: 'HK$30 億',
        amountEn: 'HK$3 billion',
        note: '支持前沿技术包括 AI',
        noteKo: 'AI를 포함한 첨단 기술 지원',
        noteJa: 'AI を含む先端技術をサポート',
        noteEn: 'Supports frontier tech including AI',
      },
      {
        item: 'AI 资助计划',
        itemKo: 'AI 보조금 계획',
        itemJa: 'AI 助成計画',
        itemEn: 'AI Subsidy Scheme',
        amount: 'HK$30 亿',
        amountKo: 'HK$30억',
        amountJa: 'HK$30 億',
        amountEn: 'HK$3 billion',
        note: '企业 AI 应用补贴',
        noteKo: '기업 AI 응용 보조금',
        noteJa: '企業 AI アプリケーション補助金',
        noteEn: 'Subsidies for enterprise AI adoption',
      },
      {
        item: '创新及科技基金',
        itemKo: '혁신 및 기술 기금',
        itemJa: '革新・技術基金',
        itemEn: 'Innovation and Technology Fund',
        amount: 'HK$100 亿',
        amountKo: 'HK$100억',
        amountJa: 'HK$100 億',
        amountEn: 'HK$10 billion',
        note: '综合科技基金',
        noteKo: '통합 기술 기금',
        noteJa: '包括的な技術基金',
        noteEn: 'General-purpose tech fund',
      },
    ],
    governance:
      '香港采取自愿性指引模式，没有专门的 AI 立法。监管权分散在数码政策办公室（DPO）、个人资料私隐专员公署（PCPD）、金管局（HKMA）等多个机构之间，缺乏统一协调。普通法传统提供了一定的灵活性，但也意味着规则不够明确。',
    governanceKo:
      '홍콩은 자발적 지침 방식을 취하고 있으며 전담 AI 입법이 없다. 규제권이 디지털정책청(DPO), 개인정보보호위원회(PCPD), 금융감독청(HKMA) 등 여러 기관에 분산되어 있어 통일된 조율이 부족하다. 관습법 전통은 일정한 유연성을 제공하지만 이는 동시에 규칙이 충분히 명확하지 않음을 의미한다.',
    governanceJa:
      '香港は任意のガイドラインモデルを採用しており、専門的な AI 法制度がありません。規制当局は、デジタルポリシーオフィス(DPO)、個人情報保護専員公署(PCPD)、香港金融管理局(HKMA)、その他複数の機関に分散しており、統一された調整に欠けています。一般法の伝統は一定の柔軟性を提供していますが、ルールが十分に明確でないことも意味しています。',
    governanceEn:
      'Hong Kong takes a voluntary-guidelines approach with no dedicated AI legislation. Regulatory authority is fragmented across the Digital Policy Office (DPO), the Privacy Commissioner for Personal Data (PCPD), the HKMA and other bodies, with no unified coordination. The common-law tradition provides some flexibility but also means rules are less explicit.',
    keyInitiatives: [
      '数码港 3000 PFLOPS 超算中心',
      'AI 超算资助计划（AICP）',
      '香港人工智能研发院（AIRDI）',
      '智慧政府创新实验室',
      '金融科技 AI 沙盒（HKMA）',
    ],
    keyInitiativesEn: [
      'Cyberport 3000 PFLOPS supercomputing centre',
      'AI Supercomputing Subsidy Scheme (AICP)',
      'Hong Kong AI R&D Institute (AIRDI)',
      'Smart Government Innovation Lab',
      'Fintech AI Sandbox (HKMA)',
    ],
    strengths: [
      '大湾区桥梁——连接内地庞大市场与国际资本',
      '商汤科技等本土 AI 企业总部所在地',
      '普通法体系，国际企业熟悉的法律环境',
      '3000 PFLOPS 超算规划超过新加坡现有算力',
    ],
    strengthsEn: [
      "Greater Bay Area bridge — connecting the mainland's massive market with international capital",
      'HQ of homegrown AI firms such as SenseTime',
      'Common-law system; legal environment familiar to international firms',
      "3000 PFLOPS supercomputing plan exceeds Singapore's current compute",
    ],
    weaknesses: [
      '缺乏统一的国家级 AI 战略',
      '监管碎片化，多部门各自为政',
      '起步较晚，大多数关键举措 2024-25 年才推出',
      '地缘政治因素可能影响国际合作与人才流动',
    ],
    weaknessesEn: [
      'No unified national-level AI strategy',
      'Fragmented regulation; agencies operate in silos',
      'Late start; most key initiatives only launched in 2024-25',
      'Geopolitical factors may affect international cooperation and talent flow',
    ],
    keyBodies: [
      {
        name: 'ITIB（创新科技及工业局）',
        nameKo: 'ITIB（혁신 과학기술 및 산업국）',
        nameJa: 'ITIB（革新・技術・工業局）',
        nameEn: 'ITIB (Innovation, Technology and Industry Bureau)',
        role: '统筹科技政策',
        roleKo: '과학기술 정책 조율',
        roleJa: '技術政策を統合',
        roleEn: 'Coordinates tech policy',
      },
      {
        name: 'DPO（数码政策办公室）',
        nameKo: 'DPO（디지털 정책 사무소）',
        nameJa: 'DPO（デジタルポリシーオフィス）',
        nameEn: 'DPO (Digital Policy Office)',
        role: 'AI 伦理与政策',
        roleKo: 'AI 윤리 및 정책',
        roleJa: 'AI 倫理とポリシー',
        roleEn: 'AI ethics and policy',
      },
      {
        name: 'HKSTP（香港科技园）',
        nameKo: 'HKSTP（홍콩 과학기술 공원）',
        nameJa: 'HKSTP（香港科学技術園）',
        nameEn: 'HKSTP (Hong Kong Science and Technology Parks)',
        role: '科技企业孵化',
        roleKo: '과학기술 기업 인큐베이션',
        roleJa: '技術企業インキュベーション',
        roleEn: 'Tech company incubation',
      },
      {
        name: 'Cyberport（数码港）',
        nameKo: 'Cyberport（디지털항）',
        nameJa: 'Cyberport（デジタルポート）',
        nameEn: 'Cyberport',
        role: '数字科技枢纽与超算',
        roleKo: '디지털 기술 허브 및 고성능 컴퓨팅',
        roleJa: 'デジタル技術ハブとスーパーコンピュータ',
        roleEn: 'Digital tech hub and supercomputing',
      },
      {
        name: 'HKIC（香港创新科技署）',
        nameKo: 'HKIC（홍콩 혁신 과학기술청）',
        nameJa: 'HKIC（香港革新技術庁）',
        nameEn: 'HKIC (Hong Kong Innovation and Technology Commission)',
        role: '创新科技资助',
        roleKo: '혁신 과학기술 보조금',
        roleJa: '革新技術助成',
        roleEn: 'Innovation and technology funding',
      },
    ],
    sources: ['香港创新科技发展蓝图（2022）', '2024-25 年施政报告 AI 相关政策', 'PCPD 人工智能道德框架（2024）'],
    sourcesEn: [
      'Hong Kong Innovation and Technology Development Blueprint (2022)',
      'AI-related policies in the 2024-25 Policy Address',
      'PCPD Artificial Intelligence Ethical Framework (2024)',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '香港的 AI 战略不像新加坡的 NAIS 2.0 那样有顶层文件统领，而是分散在三层：(1)《创新科技发展蓝图》(2022) 把 AI 与数据科学列为四大重点产业之一；(2)《智慧城市蓝图 2.0》(2020) 推动 AI 在政府服务的应用；(3) 2024-25 施政报告把 AI 升级为"国际 I&T 中心"的核心抓手，并由 2025 年 2 月预算案配套 HK$10 亿专项预算成立 AIRDI（香港人工智能研发院）。这种"后发追赶 + 多文件散布"的格局意味着政策一致性弱，但也给了赛跑式投入空间。判断：相对新加坡，香港在战略统筹上仍有 2-3 年差距，但赶超资金到位且专门程度上升。',
        analysisKo:
          '홍콩의 AI 전략은 싱가포르의 NAIS 2.0과는 다르게 최상위 정책 문서의 통일된 주도를 받지 않으며, 세 층으로 분산되어 있습니다: (1) 「혁신 과학기술 발전 청사진」(2022)은 AI와 데이터 과학을 네 가지 주요 우선 산업 중 하나로 지정했으며; (2) 「지능형 도시 청사진 2.0」(2020)은 정부 서비스에서 AI 응용을 추진했으며; (3) 2024-25 시정 보고서는 AI를 「국제 I&T 중심」의 핵심 레버로 격상했고, 2025년 2월 예산안을 통해 HK$10억의 특정 예산으로 AIRDI（홍콩 인공지능 연구개발원）를 설립했습니다. 이러한 「후발 추격 + 다중 문서 분산」 구조는 정책 일관성이 약하지만 경쟁식 투자의 여지를 제공합니다. 판단: 싱가포르에 비해 홍콩은 전략적 조율에서 여전히 2-3년의 격차가 있지만, 추격 자금이 확보되고 전문성 수준이 상향되었습니다.',
        analysisJa:
          '香港の AI 戦略はシンガポールの NAIS 2.0 のようなトップレベルの文書によって統括されておらず、むしろ 3 つのレベルに分散しています：(1) 『革新技術発展ブループリント』(2022) は「人工知能とデータサイエンス」を 4 つの優先産業の 1 つとしてリストアップしています。(2) 『スマートシティ ブループリント 2.0』(2020) は政府サービスにおける AI の適用を推進しています。(3) 2024-25 年の政策演説は AI を「国際 I&T センター」の中核レバーに昇格させ、2025 年 2 月の予算案で HK$10 億の特別予算が配置され、AIRDI（香港人工知能研究開発院）が設立されました。この「後発追上 + 複数文書分散」の構造は政策一貫性が弱いことを意味しており、しかし競争的投資のための余地も生み出しています。判断：シンガポールと比べると、香港は戦略的な統合において依然として 2-3 年の遅れがあります。しかし、追越資金は到着しており、専門的水準は上昇しています。',
        analysisEn:
          'Hong Kong\'s AI strategy does not follow a single anchor document like Singapore\'s NAIS 2.0; it is layered across three: (1) the Innovation and Technology Development Blueprint (2022) names AI and data science one of four priority industries; (2) the Smart City Blueprint 2.0 (2020) drives AI use in government services; (3) the 2024-25 Policy Address elevates AI to a core lever of the "International I&T Centre" agenda, backed by a HK$1 billion AI R&D Institute (AIRDI) earmark in the February 2025 Budget. This "late-mover catch-up plus multi-document dispersion" posture means weaker policy coherence, but it leaves room for sprint-style spending. Assessment: Hong Kong still trails Singapore on strategic coordination by 2-3 years, but the catch-up funding is now in place and the specialisation level is rising.',
        sources: [
          {
            label: '香港创新科技发展蓝图（2022）',
            labelKo: '홍콩 혁신 과학기술 발전 청사진（2022）',
            labelJa: '香港革新技術発展ブループリント(2022)',
            labelEn: 'Innovation and Technology Development Blueprint (2022)',
            url: 'https://www.itib.gov.hk/en/publications/I&T%20Blueprint%20Book_EN_single_Digital.pdf',
            date: '2022-12-22',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（2025-09-25）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력（2025-09-25）',
            labelJa: 'LCQ2：国家 AI 開発との協調(2025-09-25)',
            labelEn: "LCQ2: Alignment with the country's AI development push (2025-09-25)",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
          {
            label: 'AIRDI HK$10 亿专项公告',
            labelKo: 'AIRDI HK$10억 전용 공지',
            labelJa: 'AIRDI HK$10 億特別公告',
            labelEn: 'AIRDI HK$1 billion earmark announcement',
            url: 'https://www.news.gov.hk/eng/2025/02/20250226/20250226_093511_297.html',
            date: '2025-02-26',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '香港 AI 相关公开投资是"碎片化大盘"：HK$10 亿 AIRDI 专项（2025 年 LegCo 通过）+ HK$30 亿 AICP（AI 算力补贴，3 年期）+ HK$30 亿 前沿科技基金（含 AI）+ HK$100 亿 创新及科技基金（综合 R&D 伞形）。这些数字加总约 HK$170 亿，但其中只有 AIRDI 和 AICP 是 AI 专项；其余是 tech 大类的伞形资金，AI 实际占比未公开。AICP 的设计很 surgical：直接补贴本地学界 / 企业用 Cyberport AI Supercomputing Centre 的算力，最高 list price 70% 折扣，截至 2025 年中已批约 20 个项目、AISC 平均使用率近 80%。判断：相对新加坡公开的政府 S$2B+ AI 直投，香港绝对值略大但项目专门度更低，统计口径需谨慎。',
        analysisKo:
          '홍콩의 AI 관련 공개 투자는 「파편화된 대규모 포트폴리오」입니다. HK$10억 AIRDI 전담(2025년 LegCo 통과) + HK$30억 AICP(AI 컴퓨팅 파워 보조금, 3년 기간) + HK$30억 첨단 기술 기금(AI 포함) + HK$100억 혁신 및 기술 기금(통합 R&D 우산)으로 구성됩니다. 이들 수치를 합산하면 약 HK$170억이지만, 이 중 AIRDI와 AICP만 AI 전담 사업이고, 나머지는 기술 부문의 우산식 기금이며, AI의 실제 점유율은 미공개입니다. AICP의 설계는 매우 정교합니다. 즉, 현지 학계/기업이 Cyberport AI Supercomputing Centre의 컴퓨팅 파워를 사용하도록 직접 보조금을 제공하며, 최고 정가 대비 70% 할인을 제공합니다. 2025년 중반 현재 약 20개 프로젝트가 승인되었으며, AISC의 평균 사용률은 약 80%입니다. 평가: 싱가포르가 공개한 정부 S$2B+ AI 직접 투자와 비교하면, 홍콩의 절대값은 다소 크지만 프로젝트의 전문성은 더 낮으며, 통계 범위의 신중한 해석이 필요합니다.',
        analysisJa:
          '香港の AI 関連公開投資は「断片化されたパイ」です：HK$10 億 AIRDI 特別(2025 年 LegCo で可決) + HK$30 億 AICP(AI 計算力補助金、3 年期間) + HK$30 億 フロンティア技術基金(AI を含む) + HK$100 億 革新・技術基金(総合 R&D 傘) です。これらの数字を合計すると約 HK$170 億ですが、そのうち AI 専門のものは AIRDI と AICP のみです。その他は tech カテゴリーの傘形資金であり、AI の実際の割合は公開されていません。AICP の設計は非常に的確です：現地の学界/企業がサイバーポート AI スーパーコンピュータセンターの計算力を使用することに直接補助金を支給し、リストプライスの最大 70% 割引を提供しており、2025 年半ばまでに約 20 のプロジェクトが承認され、AISC の平均利用率はほぼ 80% です。判断：シンガポール政府の公開した S$2B 以上の AI 直接投資と比べると、香港の絶対値はやや大きいですが、プロジェクト専門度がより低く、統計方法に注意が必要です。',
        analysisEn:
          "Hong Kong's public AI investment reads as a \"fragmented top-line\": HK$1 billion AIRDI earmark (LegCo-approved 2025) + HK$3 billion AICP (AI compute subsidy, 3-year programme) + HK$3 billion Frontier Technology Fund (covers AI) + HK$10 billion Innovation and Technology Fund (general R&D umbrella). The aggregate is roughly HK$17 billion, but only AIRDI and AICP are AI-specific; the rest are tech-bucket umbrellas with no published AI share. AICP is surgical: it subsidises local universities / institutes / enterprises up to 70% of the list price for using Cyberport's AI Supercomputing Centre. By mid-2025, ~20 projects had been approved and AISC average utilisation was around 80%. Assessment: against Singapore's publicly disclosed S$2B+ direct government AI spend, Hong Kong's headline number is comparable or slightly larger, but specificity is lower and the comparison should be read with care.",
        sources: [
          {
            label: 'AI 资助计划（AICP）公告',
            labelKo: 'AI 자금 지원 계획(AICP) 공고',
            labelJa: 'AI 助成計画(AICP)公告',
            labelEn: 'AI Computing Programme (AICP) announcement',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
          {
            label: 'AIRDI 专项预算公告',
            labelKo: 'AIRDI 전담 예산 공고',
            labelJa: 'AIRDI 特別予算公告',
            labelEn: 'AIRDI earmark announcement',
            url: 'https://www.news.gov.hk/eng/2025/02/20250226/20250226_093511_297.html',
            date: '2025-02-26',
          },
          {
            label: 'LegCo ITB 委员会 AIRDI 文件',
            labelKo: 'LegCo ITB 위원회 AIRDI 문서',
            labelJa: 'LegCo ITB 委員会 AIRDI ドキュメント',
            labelEn: 'LegCo ITB panel paper on AIRDI',
            url: 'https://web.archive.org/web/20260204014248/https://www.legco.gov.hk/yr2025/english/panels/itb/papers/itb20250714cb2-1376-4-e.pdf',
            date: '2025-07-14',
          },
        ],
      },
      'governance-model': {
        analysis:
          '香港 AI 治理是"自愿性指引 + 多机构平行"模式：(1) 数码政策办公室（DPO）2024 年发布《人工智能道德框架》，原本面向政府部门，后修订为对所有组织开放，含指导原则、最佳实践、AI 评估模板三部分；(2) 2025 年 4 月 DPO 又发布《生成式 AI 技术与应用指引》补充 GenAI 专门风险（数据泄漏、模型偏见、错误输出）；(3) 隐私专员公署（PCPD）2024 年 6 月独立发布《AI 模型个人资料保护框架》，从 PDPO 隐私合规角度切入。三个框架并行存在但各管一段：DPO 管伦理与最佳实践，PCPD 管隐私合规，缺少新加坡 AI Verify 那样的统一可测试工具。判断：香港治理"软"且"散"，对企业的明确性弱于新加坡，但响应速度（GenAI 指引 2025 年 4 月就发出）并不慢。',
        analysisKo:
          '홍콩의 AI 거버넌스는 「자발적 지침 + 다기관 병렬」모식입니다. (1) 디지털정책청(DPO)이 2024년 「인공지능 윤리 프레임워크」를 발표했으며, 원래는 정부 부서를 대상으로 했으나 이후 모든 조직에 개방되도록 수정되었으며, 지도 원칙, 최적 사례, AI 평가 템플릿 세 부분을 포함합니다. (2) 2025년 4월 DPO는 「생성형 AI 기술 및 응용 지침」을 발표하여 데이터 유출, 모델 편향, 오류 출력 등 생성형 AI 특유의 위험을 추가로 다룹니다. (3) 개인정보보호 전문가 공서(PCPD)는 2024년 6월 「AI 모델 개인정보 보호 프레임워크」를 독립적으로 발표하여 PDPO 개인정보 보호 규정 준수 관점에서 접근합니다. 세 프레임워크는 병렬로 존재하지만 각각 다른 영역을 담당합니다. DPO는 윤리 및 최적 사례를 관리하고, PCPD는 개인정보 보호 규정 준수를 관리하며, 싱가포르의 AI Verify와 같은 통합된 검증 가능한 도구가 부족합니다. 평가: 홍콩의 거버넌스는 「연하고 분산된」것이며, 기업에 대한 명확성이 싱가포르보다 약하지만, 대응 속도(생성형 AI 지침이 2025년 4월에 발표됨)는 느리지 않습니다.',
        analysisJa:
          '香港の AI ガバナンスは「任意のガイドライン + 複数機関並行」モデルです：(1) デジタルポリシーオフィス(DPO)は 2024 年に『人工知能倫理フレームワーク』を発表し、元々は政府部門を対象としていましたが、その後すべての組織に開放されるよう修正されました。ガイドライン原則、ベストプラクティス、AI 評価テンプレート 3 部で構成されています。(2) 2025 年 4 月、DPO は『生成型 AI 技術とアプリケーション ガイドライン』を発表して 2024 年の倫理フレームワークを補足し、データ漏洩、モデルバイアス、誤った出力、プロンプト注入などの生成型 AI 固有のリスクを特別に扱っています。(3) プライバシー専員公署(PCPD)は 2024 年 6 月に『AI モデル個人情報保護フレームワーク』を独立して発表し、個人情報保護条例(PDPO)プライバシーコンプライアンスの観点から取り組んでいます。3 つのフレームワークは並行して存在しますが、それぞれが一部を管理しています。DPO は倫理とベストプラクティスを管理し、PCPD はプライバシーコンプライアンスを管理し、シンガポール AI Verify のような統一的な測定可能なツールに欠けています。判断：香港のガバナンスは「柔軟」で「分散」しており、企業の明確性はシンガポールより低いですが、応答速度(生成型 AI ガイドライン 2025 年 4 月に発表)は遅くありません。',
        analysisEn:
          'Hong Kong\'s AI governance is "voluntary guidelines plus parallel agencies": (1) the Digital Policy Office (DPO) issued the Artificial Intelligence Ethical Framework in 2024 — originally for government bureaux, later revised for general organisational use — covering guiding principles, leading practices, and an AI assessment template; (2) DPO released a Generative AI Technical and Application Guideline in April 2025 to address GenAI-specific risks (data leakage, model bias, hallucination); (3) the Privacy Commissioner for Personal Data (PCPD) separately published an AI Model Personal Data Protection Framework in June 2024, anchored in PDPO compliance. Three frameworks coexist but cover separate slices — DPO handles ethics and best practice, PCPD handles privacy compliance — and Hong Kong lacks a unified testable toolkit comparable to Singapore\'s AI Verify. Assessment: governance is "soft and dispersed", with weaker prescriptive clarity than Singapore, but the response speed (GenAI guideline shipped April 2025) is not slow.',
        sources: [
          {
            label: 'DPO 人工智能道德框架',
            labelKo: 'DPO 인공지능 윤리 프레임워크',
            labelJa: 'DPO 人工知能倫理フレームワーク',
            labelEn: 'DPO AI Ethical Framework',
            url: 'https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/ethical_ai_framework/',
          },
          {
            label: 'DPO 生成式 AI 指引发布公告',
            labelKo: 'DPO 생성형 AI 지침 발표 공고',
            labelJa: 'DPO 生成型 AI ガイドライン公表公告',
            labelEn: 'DPO Generative AI Guideline release',
            url: 'https://www.info.gov.hk/gia/general/202504/15/P2025041500227.htm',
            date: '2025-04-15',
          },
          {
            label: 'PCPD AI 模型个人资料保护框架',
            labelKo: 'PCPD AI 모델 개인정보 보호 프레임워크',
            labelJa: 'PCPD AI モデル個人情報保護フレームワーク',
            labelEn: 'PCPD AI Model Personal Data Protection Framework',
            url: 'https://www.pcpd.org.hk/english/news_events/media_statements/press_20240611.html',
            date: '2024-06-11',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          '香港相对新加坡的真正杠杆是"大湾区桥梁"——不是单点技术领先，而是地缘组合。具体：(1) Cyberport AI Supercomputing Centre 部署后算力将逐步达到 3000 PFLOPS，2024 年 12 月开始运行，平均使用率 80%；(2) 商汤科技、第四范式等本土头部 AI 公司总部在港，与内地市场和国际资本同时连接；(3) 普通法体系给国际企业熟悉的法律环境。但短板也明显——监管碎片化（DPO + PCPD + HKMA + ITIB 各管一段）、AI 国家级统筹文件起步晚（2024-25 年才成型）、地缘政治影响国际人才与合作。判断：香港的"3000 PFLOPS 算力"是单一硬件优势，不等同于综合 AI 实力领先；新加坡的 governance-led 路线对"可信 AI 出海"更友好。两者优势不重叠，未来在 AI 应用 / 治理 / 算力分别错位竞争更可能。',
        analysisKo:
          '홍콩이 싱가포르에 상대적으로 가진 진정한 레버는 「대만만 지역 연결」입니다. 즉, 단일 기술 우위가 아니라 지정학적 조합입니다. 구체적으로: (1) Cyberport AI Supercomputing Centre 배치 후 컴퓨팅 파워는 점진적으로 3000 PFLOPS에 도달할 것이며, 2024년 12월부터 운영을 시작했고, 평균 사용률은 80%입니다. (2) 상탕(SenseTime), 제4 범식(Fourth Paradigm) 등 현지 최고급 AI 기업의 총본사가 홍콩에 있으며, 중국 내 시장 및 국제 자본과 동시에 연결되어 있습니다. (3) 보통법 체계는 국제 기업에 익숙한 법적 환경을 제공합니다. 그러나 단점도 명백합니다. 규제 파편화(DPO + PCPD + HKMA + ITIB가 각각 한 부분씩 관리), AI 국가 수준의 종합 문서 시작 지연(2024-25년에 형성됨), 지정학적 영향이 국제 인재 및 협력에 미치는 영향입니다. 평가: 홍콩의 「3000 PFLOPS 컴퓨팅 파워」는 단일 하드웨어 우위이며, 종합적인 AI 실력 선도와는 동일하지 않습니다. 싱가포르의 거버넌스 주도 경로는 「신뢰할 수 있는 AI 해외 진출」에 더 유리합니다. 두 지역의 장점은 중복되지 않으며, 향후 AI 응용/거버넌스/컴퓨팅 파워에서 각각 엇갈린 경쟁이 더 가능성이 높습니다.',
        analysisJa:
          '香港がシンガポールに対して持つ真の力は「大湾区ブリッジ」であり、単一の技術リーダーシップではなく、地政学的な組み合わせです。具体的には：(1) サイバーポート AI スーパーコンピュータセンターが展開された後、計算力は段階的に 3000 PFLOPS に達し、2024 年 12 月から運用開始で、平均利用率は 80% です。(2) 商湯科技、第四パラダイムなどのローカルトップ AI 企業の本部は香港に位置し、国内市場と国際資本の両方と接続しています。(3) コモンロー体系は国際企業にとって馴染みのある法的環境を提供しています。しかし、短所も明らかです。規制の断片化(DPO + PCPD + HKMA + ITIB がそれぞれ一部を管理)、AI 国家レベルの統合ドキュメントの遅れた立ち上げ(2024-25 年にようやく成形)、地政学的影響が国際人材と協力に影響。判断：香港の「3000 PFLOPS 計算力」は単一のハードウェア上の利点であり、総合的な AI 実力リーダーシップと同等ではありません。シンガポールの統治主導路線は「信頼できる AI の海外展開」により適しています。両者の利点は重複しておらず、今後 AI アプリケーション/ガバナンス/計算力で各々のポジショニングで競争する可能性が高いです。',
        analysisEn:
          "Hong Kong's real edge versus Singapore is the Greater Bay Area bridge — not a single technology lead, but a geopolitical combination. Concretely: (1) Cyberport AI Supercomputing Centre rolled out December 2024 and will progressively scale to around 3 000 PFLOPS, with mid-2025 average utilisation around 80%; (2) homegrown AI champions such as SenseTime and 4Paradigm are headquartered in Hong Kong, connecting the mainland market and international capital simultaneously; (3) the common-law system gives international firms a familiar legal environment. But the weaknesses are equally visible — fragmented regulation (DPO, PCPD, HKMA, ITIB each cover a slice), late-arriving national-level AI coordination (only solidified in 2024-25), and geopolitics constraining international talent and collaboration. Assessment: Hong Kong's 3 000 PFLOPS plan is a single hardware advantage, not a comprehensive AI lead; Singapore's governance-led posture is friendlier to \"trusted AI exports\". The two strengths do not overlap; future competition is more likely to be staggered across AI applications, governance, and compute.",
        sources: [
          {
            label: 'AICP / AISC 公告（含 3000 PFLOPS 与利用率数字）',
            labelKo: 'AICP / AISC 공고(3000 PFLOPS 및 사용률 수치 포함)',
            labelJa: 'AICP / AISC 公告(3000 PFLOPS と利用率数字を含む)',
            labelEn: 'AICP / AISC announcement (3 000 PFLOPS and utilisation figures)',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（2025-09-25）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력(2025-09-25)',
            labelJa: 'LCQ2：国家 AI 開発との協調(2025-09-25)',
            labelEn: "LCQ2: Alignment with the country's AI development push",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
        ],
      },
      'strategy-1': {
        analysis:
          '《创新科技发展蓝图》2022 年 12 月由 ITIB 颁布，是香港首份完整 I&T 路线图。把"人工智能与数据科学"列为四大重点产业之一（其他三个：生命健康科技、先进制造与新能源、金融科技）。蓝图的核心机制是"政府投入 + 大湾区协同 + 大学研究商业化"，长期指标包括 2032 年 R&D 投入占 GDP 2%。判断：蓝图是宏观指导文件，没有具体的 AI 行业里程碑或预算分配——AI 的实质推动要等到 2024-25 年的 AICP 和 AIRDI 才落地。蓝图本身的执行力很大程度上靠后续年度预算案"补血"，独立度有限。',
        analysisKo:
          '「혁신 과학기술 발전 청사진」은 2022년 12월 ITIB가 발표한 것으로, 홍콩의 첫 번째 완전한 I&T 로드맵입니다. 「인공지능 및 데이터 과학」을 네 가지 우선 산업 중 하나로 지정했습니다(나머지 셋: 생명 건강 과학기술, 첨단 제조 및 신에너지, 금융 과학기술). 청사진의 핵심 메커니즘은 「정부 투입 + 대만만 지역 협력 + 대학 연구 상용화」입니다. 장기 지표에는 2032년 R&D 투입이 GDP의 2%를 차지하는 것이 포함됩니다. 평가: 청사진은 거시적 지도 문서이며, AI 산업에서 구체적인 이정표 또는 예산 분배를 포함하지 않습니다. AI의 실질적인 추진은 2024-25년의 AICP 및 AIRDI가 착수될 때까지 기다려야 합니다. 청사진 자체의 실행력은 그 이후 연도 예산안 「수혈」에 크게 좌우되며, 독립성이 제한적입니다.',
        analysisJa:
          '『革新技術発展ブループリント』は 2022 年 12 月に ITIB によって発表され、香港初の完全な I&T ロードマップです。「人工知能とデータサイエンス」を 4 つの優先産業の 1 つとしてリストアップしています(その他 3 つ：ライフサイエンステクノロジー、先進製造と新エネルギー、フィンテック)。ブループリントの中核メカニズムは「政府投資 + 大湾区協調 + 大学研究の商業化」であり、2032 年の R&D 投資が GDP の 2% に達するという長期的指標を含んでいます。判断：ブループリントは宏観的ガイドランスドキュメントであり、AI 産業内の具体的なマイルストーンや予算配分がありません。AI の実質的な推進は 2024-25 年の AICP と AIRDI が着地するまで待つ必要があります。ブループリント自体の実行力は大いに後続の年度予算案の「血液補給」に頼っており、独立性は限定的です。',
        analysisEn:
          'Promulgated by ITIB on 22 December 2022, the Innovation and Technology Development Blueprint is Hong Kong\'s first complete I&T roadmap. It names AI and data science one of four priority industries (the others: life and health tech, advanced manufacturing and new energy, fintech). The Blueprint\'s mechanism is "government spend + Greater Bay Area collaboration + university research commercialisation", with long-term targets such as R&D spend reaching 2% of GDP by 2032. Assessment: the Blueprint is a macro-guidance document, not a sector-specific milestone or budget plan — substantive AI movement only materialised with AICP and AIRDI in 2024-25. Its execution leverage depends heavily on subsequent annual budgets to top up resources, so as a standalone strategy its force is limited.',
        sources: [
          {
            label: '创新科技发展蓝图（PDF）',
            labelKo: '혁신 과학기술 발전 청사진(PDF)',
            labelJa: '革新技術発展ブループリント(PDF)',
            labelEn: 'Innovation and Technology Development Blueprint (PDF)',
            url: 'https://www.itib.gov.hk/en/publications/I&T%20Blueprint%20Book_EN_single_Digital.pdf',
            date: '2022-12-22',
          },
          {
            label: 'ITIB 立法会答询（2025-03-19）',
            labelKo: 'ITIB 입법회 답변(2025-03-19)',
            labelJa: 'ITIB 立法会質問(2025-03-19)',
            labelEn: 'ITIB Legislative Council reply (2025-03-19)',
            url: 'https://www.itib.gov.hk/en/legislative_council_business/questions/2025/pr_20250319.html',
            date: '2025-03-19',
          },
        ],
      },
      'strategy-2': {
        analysis:
          '《智慧城市蓝图 2.0》2020 年 12 月由 ITIB 发布，含 130+ 项具体举措，AI 是横切主题之一（不是单独议题）。重点应用领域：智慧出行、智慧政府、智慧生活、智慧经济、智慧市民、智慧环境。Smart Government Innovation Lab（smartlab.gov.hk）作为政府内部 AI 应用孵化平台同期落地。判断：智慧城市蓝图把 AI 当工具不是目标，2.0 版本到 2026 年已 5+ 年未更新，对生成式 AI 时代的回应显得滞后——这也是 2025 年 GenAI Guideline 出现的原因。蓝图 3.0 是否到来、是否单列 AI 议题，是观察点。',
        analysisKo:
          '「스마트 시티 청사진 2.0」은 2020년 12월 ITIB가 발표한 것으로, 130개 이상의 구체적인 조치를 포함하며, AI는 횡단 주제 중 하나입니다(별도의 의제가 아닙니다). 우선 응용 분야: 스마트 교통, 스마트 정부, 스마트 생활, 스마트 경제, 스마트 시민, 스마트 환경입니다. Smart Government Innovation Lab(smartlab.gov.hk)은 정부 내 AI 응용 인큐베이션 플랫폼으로 같은 시기에 착수되었습니다. 평가: 스마트 시티 청사진은 AI를 목표가 아닌 도구로 취급하며, 2.0 버전은 2026년 현재 5년 이상 업데이트되지 않았으며, 생성형 AI 시대에 대한 대응이 뒤떨어진 것으로 보입니다. 이것이 2025년 생성형 AI 지침이 나타난 이유입니다. 청사진 3.0의 등장 여부, AI를 독립적으로 나열할 여부는 관찰 포인트입니다.',
        analysisJa:
          '『スマートシティ ブループリント 2.0』は 2020 年 12 月に ITIB によって発表され、130+ 項目の具体的な措置を含み、AI は横断的なテーマの 1 つです(独立した問題ではありません)。重点応用領域：スマート交通、スマート政府、スマートライフ、スマート経済、スマート市民、スマート環境。Smart Government Innovation Lab(smartlab.gov.hk)は同期間に政府内部 AI アプリケーション孵化プラットフォームとして立ち上げられました。判断：スマートシティ ブループリントは AI をツールとして扱い、目標ではなく、2.0 版本は 2026 年までにすでに 5 年以上更新されていないため、生成型 AI 時代への対応が遅れているように見えます。これは 2025 年 GenAI ガイドラインが登場した理由でもあります。ブループリント 3.0 の到来があるかどうか、AI の問題を個別にリストアップするかどうかは、観察ポイントです。',
        analysisEn:
          'Released by ITIB in December 2020, the Smart City Blueprint 2.0 covers 130+ initiatives with AI as a cross-cutting theme rather than a standalone pillar. Six application domains: smart mobility, smart government, smart living, smart economy, smart people, smart environment. The Smart Government Innovation Lab (smartlab.gov.hk) launched as an in-government AI use-case incubator alongside the Blueprint. Assessment: the Blueprint treats AI as a tool, not an objective; by 2026 the 2.0 version has gone 5+ years without an update, and its response to the generative AI era looks dated — this is part of why the GenAI Guideline appeared separately in 2025. Whether a 3.0 edition arrives and whether it carves out a dedicated AI track is a key signal to watch.',
        sources: [
          {
            label: '智慧城市蓝图 2.0（PDF）',
            labelKo: '스마트 시티 청사진 2.0(PDF)',
            labelJa: 'スマートシティ ブループリント 2.0(PDF)',
            labelEn: 'Smart City Blueprint 2.0 (PDF)',
            url: 'https://www.smartcity.gov.hk/modules/custom/custom_global_js_css/assets/files/HKSmartCityBlueprint(ENG)v2.pdf',
            date: '2020-12-10',
          },
          {
            label: '智慧城市蓝图 2.0 发布公告',
            labelKo: '스마트 시티 청사진 2.0 발표 공고',
            labelJa: 'スマートシティ ブループリント 2.0 発表公告',
            labelEn: 'Smart City Blueprint 2.0 release',
            url: 'https://www.info.gov.hk/gia/general/202012/10/P2020121000626.htm',
            date: '2020-12-10',
          },
          {
            label: 'Smart Government Innovation Lab',
            labelEn: 'Smart Government Innovation Lab',
            url: 'https://www.smartlab.gov.hk/en',
          },
        ],
      },
      'strategy-3': {
        analysis:
          '《人工智能道德框架》2024 年由数码政策办公室（DPO）发布，原本面向政府部门，后修订为对所有组织开放。框架含三部分：(1) 指导原则；(2) 最佳实践；(3) AI 评估模板。性质是"自愿性指引"，没有法律约束力，也没有强制审计。覆盖透明度、问责、公平、隐私、可靠性等通用伦理维度。判断：与新加坡 AI Verify 的工具化、可测试方向不同，香港选了"原则 + 模板"的轻量化路径——好处是不增加合规负担，坏处是企业是否真按框架执行难以验证。属于"低门槛 + 低 enforcement"组合，更接近欧盟自愿守则而非新加坡的可量化范式。',
        analysisKo:
          '「인공지능 윤리 프레임워크」는 2024년 디지털정책청(DPO)이 발표했으며, 원래는 정부 부서를 대상으로 했으나 이후 모든 조직에 개방되도록 수정되었습니다. 프레임워크는 세 부분으로 구성됩니다. (1) 지도 원칙; (2) 최적 사례; (3) AI 평가 템플릿입니다. 성질은 「자발적 지침」이며, 법적 구속력이 없으며 강제 감시도 없습니다. 투명성, 책임성, 공정성, 개인정보 보호, 신뢰성 등 보편적 윤리 차원을 다룹니다. 평가: 싱가포르의 AI Verify의 도구화, 검증 가능한 방향과 다르게, 홍콩은 「원칙 + 템플릿」의 경량 경로를 선택했습니다. 장점은 규정 준수 부담을 증가시키지 않는다는 것이고, 단점은 기업이 프레임워크를 실제로 따르는지 확인하기 어렵다는 것입니다. 「낮은 진입 장벽 + 낮은 집행」조합에 속하며, EU 자발적 규약에 더 가깝고 싱가포르의 정량화 가능한 범주보다는 아닙니다.',
        analysisJa:
          '『人工知能倫理フレームワーク』は 2024 年にデジタルポリシーオフィス(DPO)によって発表され、元々は政府部門を対象としていましたが、その後すべての組織に開放されるように修正されました。フレームワークは 3 つの部分を含みます：(1) ガイドライン原則；(2) ベストプラクティス；(3) AI 評価テンプレート。性質は「任意のガイドライン」であり、法的拘束力はなく、強制監査もありません。透明性、説明責任、公正性、プライバシー、信頼性などの一般的な倫理的側面をカバーしています。判断：シンガポール AI Verify のツール化、測定可能な方向とは異なり、香港は「原則 + テンプレート」の軽量化パスを選択しました。利点は合規負担を増加させないことですが、欠点は企業が本当にフレームワークに従っているかどうかを検証するのが難しいことです。「低い敷居 + 低い施行」の組み合わせに属し、欧州の任意守則により近く、シンガポールの量化可能なパラダイムではありません。',
        analysisEn:
          'Issued by the Digital Policy Office (DPO) in 2024, the AI Ethical Framework was originally for government bureaux and later revised for use by any organisation. Three components: (1) guiding principles; (2) leading practices; (3) an AI assessment template. It is a "voluntary guideline" with no legal force and no mandatory audit, covering generic ethics dimensions: transparency, accountability, fairness, privacy, reliability. Assessment: unlike Singapore\'s AI Verify, which is tool-centric and testable, Hong Kong chose a lightweight "principles plus template" path — the upside is low compliance burden, the downside is that whether organisations actually follow the framework is hard to verify. It sits in the "low entry, low enforcement" quadrant, closer to the EU voluntary code than Singapore\'s measurable-by-design approach.',
        sources: [
          {
            label: 'DPO 人工智能道德框架',
            labelKo: 'DPO 인공지능 윤리 프레임워크',
            labelJa: 'DPO 人工知能倫理フレームワーク',
            labelEn: 'DPO AI Ethical Framework',
            url: 'https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/ethical_ai_framework/',
          },
        ],
      },
      'strategy-4': {
        analysis:
          '《生成式 AI 技术与应用指引》2025 年 4 月 15 日由 DPO 发布，是对 2024 年伦理框架的"GenAI 补丁"，专门处理数据泄漏、模型偏见、错误输出、提示注入等 GenAI 特有风险。给政府部门使用 GenAI 的具体操作指南，覆盖采购、部署、使用、监控全周期。判断：响应速度比新加坡的对应文件不慢，但仍然是"指引"性质——没有强制审计、没有罚则——对加速 GenAI 在政府的实际部署作用有限。指引有公开 PDF 可下载，企业可参考但无义务采用。这种"政府先示范、企业自取"的扩散路径效率取决于政府自身采用率。',
        analysisKo:
          '「생성형 AI 기술 및 응용 지침」은 2025년 4월 15일 DPO가 발표했으며, 2024년 윤리 프레임워크에 대한 「생성형 AI 패치」이며, 데이터 유출, 모델 편향, 오류 출력, 프롬프트 주입 등 생성형 AI 특유의 위험을 특별히 다룹니다. 정부 부서가 생성형 AI를 사용하기 위한 구체적인 운영 지침을 제공하며, 조달, 배치, 사용, 모니터링 전체 주기를 다룹니다. 평가: 대응 속도는 싱가포르의 대응 문서보다 느리지 않지만, 여전히 「지침」성질입니다. 강제 감시가 없고 벌칙이 없으므로 정부에서 생성형 AI의 실제 배치를 가속화하는 데 제한적 효과를 갖습니다. 지침은 공개 PDF로 다운로드 가능하며, 기업이 참고할 수 있지만 채택할 의무는 없습니다. 「정부가 먼저 시범하고 기업이 자발적으로 채택」하는 확산 경로의 효율성은 정부 자신의 채택률에 달려 있습니다.',
        analysisJa:
          '『生成型 AI 技術とアプリケーション ガイドライン』は 2025 年 4 月 15 日にデジタルポリシーオフィス(DPO)によって発表され、2024 年の倫理フレームワークの「生成型 AI パッチ」です。データ漏洩、モデルバイアス、誤った出力、プロンプト注入などの生成型 AI 固有のリスクを特別に処理しています。政府部門が生成型 AI を使用するための具体的な操作ガイドを提供し、調達、展開、使用、監視の全周期をカバーしています。判断：応答速度はシンガポールの対応ドキュメントより遅くありませんが、依然として「ガイドライン」性質です。強制監査がなく、罰則がなく、政府内での生成型 AI 導入を加速させる作用は限定的です。ガイドラインは公開 PDF でダウンロード可能で、企業は参考にできますが、採用の義務はありません。この「政府が先に示範、企業が自主的に取得」の拡散パスの効率は、政府自体の採用率に依存します。',
        analysisEn:
          'Issued by DPO on 15 April 2025, the Generative AI Technical and Application Guideline is a "GenAI patch" on the 2024 Ethical Framework, addressing GenAI-specific risks (data leakage, model bias, hallucination, prompt injection). It is an operational guide for government use of GenAI across procurement, deployment, usage, and monitoring. Assessment: response speed is competitive with Singapore\'s equivalent, but it remains a "guideline" — no mandatory audit, no penalties — limiting its force in accelerating GenAI rollout inside government. The PDF is publicly downloadable and enterprises can reference it but are not obliged to adopt. This "government demonstrates first, enterprises pick up voluntarily" diffusion model rises or falls on government adoption rate.',
        sources: [
          {
            label: 'DPO 生成式 AI 指引公告',
            labelKo: 'DPO 생성형 AI 지침 발표 공고',
            labelJa: 'DPO 生成型 AI ガイドライン公表公告',
            labelEn: 'DPO Generative AI Guideline release',
            url: 'https://www.info.gov.hk/gia/general/202504/15/P2025041500227.htm',
            date: '2025-04-15',
          },
          {
            label: '生成式 AI 技术与应用指引（PDF）',
            labelKo: '생성형 AI 기술 및 응용 지침(PDF)',
            labelJa: '生成型 AI 技術とアプリケーション ガイドライン(PDF)',
            labelEn: 'Generative AI Technical and Application Guideline (PDF)',
            url: 'https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/ethical_ai_framework/doc/HK_Generative_AI_Technical_and_Application_Guideline_en.pdf',
            date: '2025-04-15',
          },
        ],
      },
      'strategy-5': {
        analysis:
          '"AI Plus" 计划 2025 年提出，是香港层面对中央"AI+"行动（国务院 2025 年政府工作报告）的落地方案。目标是把 AI 应用扩散到金融、医疗、教育、智慧城市等 8+ 重点行业。具体执行机制依赖 AIRDI（HK$10 亿）作为研发底座 + AICP（HK$30 亿）作为算力补贴 + 行业沙盒（如 HKMA GenAI Sandbox）作为试点通道。判断：AI Plus 是政策口号 + 资金分配框架，不是独立战略——其成败取决于 AIRDI 能否在 2026 年如期开张并孵化出可商业化项目，以及 AICP 在 3 年期满后能否续期。它是"中央对接 + 本地执行"的样本。',
        analysisKo:
          '「AI Plus」계획은 2025년 제출되었으며, 중앙의 「AI+」행동(국무원 2025년 정부 업무 보고서)에 대한 홍콩 수준의 착수 방안입니다. 목표는 금융, 의료, 교육, 스마트 시티 등 8개 이상의 우선 산업에 AI 응용을 확산시키는 것입니다. 구체적인 실행 메커니즘은 AIRDI(HK$10억)를 연구 개발 기반으로, AICP(HK$30억)를 컴퓨팅 파워 보조금으로, 산업 샌드박스(예: HKMA 생성형 AI 샌드박스)를 시범 채널로 활용합니다. 평가: AI Plus는 정책 구호 + 자금 배분 프레임워크이며, 독립적인 전략이 아닙니다. 성패는 AIRDI가 2026년에 예정대로 개장할 수 있고 상업화 가능한 프로젝트를 기획할 수 있는지 여부, 그리고 AICP가 3년 기간 만료 후 연장될 수 있는지 여부에 달려 있습니다. 「중앙 연결 + 현지 실행」샘플입니다.',
        analysisJa:
          '「AI Plus」計画は 2025 年に提案されており、中央「AI+」行動(国務院 2025 年政府業務報告)の香港レベルでの着地方案です。目標は AI アプリケーションを金融、医療、教育、スマートシティなど 8+ の重点産業に拡散させることです。具体的な実行メカニズムは AIRDI(HK$10 億)を R&D ベースとし + AICP(HK$30 億)を計算力補助金として + 産業サンドボックス(例えば HKMA 生成型 AI サンドボックス)を試験通路として依存しています。判断：AI Plus は政策スローガン + 資金配分枠組みであり、独立した戦略ではありません。その成否は AIRDI が 2026 年に予定通り開張でき、商業化可能なプロジェクトを孵化できるか、および AICP が 3 年期満了後に継続できるかに依存しています。これは「中央対接 + 本地実行」のサンプルです。',
        analysisEn:
          'Proposed in 2025, the "AI Plus" initiative is Hong Kong\'s local implementation of Beijing\'s "AI+" action (announced in the State Council\'s 2025 Government Work Report). The goal: diffuse AI applications into 8+ priority industries — finance, healthcare, education, smart city, and others. Execution leans on AIRDI (HK$1bn R&D anchor) + AICP (HK$3bn compute subsidy) + sectoral sandboxes (e.g. HKMA GenAI Sandbox) as pilot lanes. Assessment: AI Plus is a policy slogan plus funding-allocation framework, not a standalone strategy — its success depends on whether AIRDI opens on schedule in 2026 and incubates commercialisable projects, and whether AICP gets renewed after the initial three-year term. It is the textbook "Beijing alignment + local implementation" template.',
        sources: [
          {
            label: 'LCQ13：促进 AI 发展（2025-10-15）',
            labelKo: 'LCQ13: AI 발전 촉진(2025-10-15)',
            labelJa: 'LCQ13：AI 開発促進(2025-10-15)',
            labelEn: 'LCQ13: Promoting AI development (2025-10-15)',
            url: 'https://www.info.gov.hk/gia/general/202510/15/P2025101500264.htm',
            date: '2025-10-15',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（2025-09-25）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력(2025-09-25)',
            labelJa: 'LCQ2：国家 AI 開発との協調(2025-09-25)',
            labelEn: "LCQ2: Alignment with country's AI development push",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
          {
            label: 'AIRDI HK$10 亿专项公告',
            labelKo: 'AIRDI HK$10억 전담 공고',
            labelJa: 'AIRDI HK$10 億特別公告',
            labelEn: 'AIRDI HK$1 billion earmark announcement',
            url: 'https://www.news.gov.hk/eng/2025/02/20250226/20250226_093511_297.html',
            date: '2025-02-26',
          },
        ],
      },
      'investment-1': {
        analysis:
          '香港人工智能研发院（AIRDI），2025 年 2 月由财政司司长陈茂波在 2025-26 预算案中宣布，总额 HK$10 亿（约 US$128M）。2025 年 7 月 LegCo ITB 委员会通过拨款，预计 2026 年开张。定位是"上游 AI 研发 + 中下游成果转化 + 应用场景拓展"三段式。判断：HK$10 亿对一个全新研究院来说不是大数（对比新加坡 AISG 自 2017 年累计 S$5 亿+），但作为 0→1 的 anchor 投入足够。AIRDI 能否吸引到顶尖人才、是否与本地大学竞争还是合作，将决定它是国际 AI 研究中心还是另一个本地研究机构。',
        analysisKo:
          '홍콩 인공지능 연구개발원(AIRDI)은 2025년 2월 재정관 Chen Maobao가 2025-26 예산안에서 발표했으며, 총액 HK$10억(약 US$128M)입니다. 2025년 7월 LegCo ITB 위원회가 예산을 통과시켰으며, 2026년 개장 예정입니다. 위치 지정은 「상류 AI 연구 개발 + 중하류 성과 변환 + 응용 시나리오 확장」3단계식입니다. 평가: HK$10억은 새로운 연구원으로는 큰 금액이 아닙니다(싱가포르 AISG가 2017년 이래 누적 S$5억 이상과 비교하면). 그러나 0→1 앵커 투입으로는 충분합니다. AIRDI가 최고 인재를 유치할 수 있는지 여부, 현지 대학과 경쟁하는지 협력하는지 여부가 국제 AI 연구 센터인지 또는 다른 지역 연구 기관인지를 결정할 것입니다.',
        analysisJa:
          '香港人工知能研究開発院(AIRDI)は 2025 年 2 月に財務長陳茂波によって 2025-26 予算案で発表され、総額 HK$10 億(約 US$128M)です。2025 年 7 月に LegCo ITB 委員会によって撥款が可決され、2026 年の開張が予定されています。位置付けは「上流 AI 研究開発 + 中下流成果転化 + アプリケーション情景拡張」の 3 段階式です。判断：HK$10 億は新しい研究院にとっては大きな数字ではありません(シンガポール AISG は 2017 年から累計 S$5 億 +)が、0→1 のアンカー投入として十分です。AIRDI が一流の人材を惹きつけられるか、本地の大学と競争するか協力するかは、それが国際 AI 研究センターであるか、別の本地研究機構であるかを決定します。',
        analysisEn:
          'The Hong Kong AI Research and Development Institute (AIRDI) was announced by Financial Secretary Paul Chan Mo-po in the 2025-26 Budget on 26 February 2025, with a HK$1 billion (~US$128M) earmark. The Legislative Council ITB Panel approved the funding in July 2025, with launch expected in 2026. Positioning: a three-stage "upstream R&D + midstream and downstream commercialisation + use-case expansion". Assessment: HK$1bn is not a large number for a new institute (Singapore\'s AISG has accumulated S$500M+ since 2017), but it is enough as a 0→1 anchor. Whether AIRDI attracts top-tier talent and whether it competes or collaborates with local universities will decide whether it becomes an international AI research hub or just another local institute.',
        sources: [
          {
            label: 'AIRDI 专项预算公告（news.gov.hk）',
            labelKo: 'AIRDI 전담 예산 공고(news.gov.hk)',
            labelJa: 'AIRDI 特別予算公告(news.gov.hk)',
            labelEn: 'AIRDI earmark announcement (news.gov.hk)',
            url: 'https://www.news.gov.hk/eng/2025/02/20250226/20250226_093511_297.html',
            date: '2025-02-26',
          },
          {
            label: 'LegCo ITB 委员会 AIRDI 文件',
            labelKo: 'LegCo ITB 위원회 AIRDI 문서',
            labelJa: 'LegCo ITB 委員会 AIRDI ドキュメント',
            labelEn: 'LegCo ITB panel AIRDI paper',
            url: 'https://web.archive.org/web/20260204014248/https://www.legco.gov.hk/yr2025/english/panels/itb/papers/itb20250714cb2-1376-4-e.pdf',
            date: '2025-07-14',
          },
        ],
      },
      'investment-2': {
        analysis:
          '前沿科技基金（Frontier Technology Fund），由 ITIB 主导，覆盖 AI、生物科技、量子计算、新材料等前沿领域。基金不是 AI 专项，AI 在其中占比未在公开文件中披露。判断：HK$30 亿伞形基金的"AI 实际投入"难以拆分出来——把整笔金额计入 AI 投入会严重夸大数字。在追踪香港 AI 财政投入时，应该单独看 AICP（HK$30 亿）和 AIRDI（HK$10 亿）这两个 AI 专项数字，而不是把所有伞形基金都加进去。这种数据透明度不足是香港治理体系的常见弱点。',
        analysisKo:
          '첨단 기술 기금(Frontier Technology Fund)은 ITIB가 주도하며, AI, 생명공학, 양자 컴퓨팅, 신소재 등 첨단 분야를 포함합니다. 기금은 AI 전담이 아니며, AI가 그 안에서 차지하는 비율은 공개 문서에 공개되지 않습니다. 평가: HK$30억 우산식 기금의 「AI 실제 투입」을 분해하기 어렵습니다. 전체 금액을 AI 투입에 포함시키면 금액을 심각하게 과장하게 됩니다. 홍콩의 AI 재정 투입을 추적할 때, AICP(HK$30억) 및 AIRDI(HK$10억)라는 두 가지 AI 전담 수치를 별도로 살펴봐야 하며, 모든 우산식 기금을 포함시키면 안 됩니다. 이러한 데이터 투명성 부족은 홍콩 거버넌스 체계의 흔한 약점입니다.',
        analysisJa:
          'フロンティア技術基金は ITIB 主導で、AI、バイオテクノロジー、量子計算、新素材などの先端分野をカバーしています。基金は AI 専門ではなく、その中での AI の割合は公開ドキュメントに開示されていません。判断：HK$30 億の傘形基金の「AI 実際投入」を分割出すのは困難です。全額を AI 投入に計上すると、数字を大幅に誇大化することになります。香港の AI 財政投入を追跡する際には、AICP(HK$30 億)と AIRDI(HK$10 億)という 2 つの AI 専門数字を個別に見るべきで、すべての傘形基金を加算すべきではありません。このようなデータ透明度の不足は、香港のガバナンス体系の一般的な弱点です。',
        analysisEn:
          "The Frontier Technology Fund is led by ITIB and covers frontier domains — AI, biotech, quantum, advanced materials. It is not AI-specific, and the AI share has not been publicly disclosed. Assessment: the actual AI portion of this HK$3 billion umbrella fund cannot be cleanly extracted — counting the full amount as AI spend would significantly inflate the headline. When tracking Hong Kong's AI fiscal commitment, AICP (HK$3bn) and AIRDI (HK$1bn) should be the dedicated lines, not the umbrella funds. This kind of disclosure gap is a recurring weakness in Hong Kong's governance transparency.",
        sources: [
          {
            label: 'LCQ8：促进 AI 发展（2024-03-27）',
            labelKo: 'LCQ8: AI 발전 촉진 (2024-03-27)',
            labelJa: 'LCQ8：AI 開発促進(2024-03-27)',
            labelEn: 'LCQ8: Promoting AI development (2024-03-27)',
            url: 'https://www.info.gov.hk/gia/general/202403/27/P2024032700239.htm',
            date: '2024-03-27',
          },
          {
            label: '创新科技发展蓝图（PDF）',
            labelKo: '혁신 과학기술 발전 청사진 (PDF)',
            labelJa: '革新技術発展ブループリント(PDF)',
            labelEn: 'Innovation and Technology Development Blueprint (PDF)',
            url: 'https://www.itib.gov.hk/en/publications/I&T%20Blueprint%20Book_EN_single_Digital.pdf',
            date: '2022-12-22',
          },
        ],
      },
      'investment-3': {
        analysis:
          'AI 资助计划（AICP，AI Computing Programme），2024-25 财年预算案宣布，3 年期共 HK$30 亿。机制是为本地大学、研究机构、企业提供 Cyberport AI Supercomputing Centre 算力服务的补贴，最高补贴到 list price 的 70%。AISC 2024 年 12 月开始部署，截至 2025 年中约 20 个项目已获批，AISC 平均使用率近 80%。判断：这是香港 AI 投入中最 surgical 的一笔——直接补贴算力消费，绕过中间机构，对追赶时间窗口很有效。3 年内若不能让足够多研究项目商业化，第二期能否续期是悬念；但当下利用率 80% 是好信号。',
        analysisKo:
          'AI 자금 지원 계획(AICP, AI Computing Programme)은 2024-25 회계연도 예산안에서 발표되었으며 3년 기간 총 HK$30억입니다. 메커니즘은 현지 대학, 연구기관, 기업에 Cyberport AI Supercomputing Centre 컴퓨팅 파워 서비스 보조금을 제공하는 것으로, 최대 목록 가격의 70%까지 보조합니다. AISC는 2024년 12월부터 배포를 시작했으며, 2025년 중반 기준 약 20개 프로젝트가 승인되었고, AISC 평균 사용률은 약 80%입니다. 판단: 이는 홍콩의 AI 투자 중 가장 정밀한 조치입니다 — 컴퓨팅 파워 소비에 대한 직접 보조금으로 중간 기관을 우회하며, 시간 윈도우를 따라잡는 데 매우 효과적입니다. 3년 내 충분한 연구 프로젝트가 상용화되지 않으면 2단계 연장 가능성은 불확실하지만, 현재 80% 사용률은 좋은 신호입니다.',
        analysisJa:
          'AI Computing Programme（AICP）は2024年度予算案で発表され、3年間にわたる合計HK$30億の予算がつきました。メカニズムとしては、地元の大学、研究機関、企業向けにCyberport AI Supercomputing Centre（AISC）の計算能力サービスに対する補助金を提供するもので、定価の最大70%を補助します。AISCは2024年12月から展開を開始し、2025年中盤現在で約20のプロジェクトが承認されており、AISC の平均利用率は約80%に達しています。評価：これは香港のAI投資の中で最もターゲットを絞った施策です——計算能力消費を直接補助し、中間機関をバイパスし、市場競争での時間的な対応に非常に有効です。3年以内に十分な数の研究プロジェクトが商用化されなければ、第2段階の継続が可能かどうかは不明ですが、現在の利用率80%は良好なシグナルです。',
        analysisEn:
          "The AI Computing Programme (AICP) was announced in the 2024-25 Budget as a three-year, HK$3 billion programme. Mechanism: subsidise local universities, research institutes, and enterprises for using Cyberport's AI Supercomputing Centre (AISC), up to 70% of the list price. AISC began deployment in December 2024; by mid-2025, around 20 projects had been approved and AISC average utilisation was around 80%. Assessment: this is the most surgical line in Hong Kong's AI spend — it subsidises compute consumption directly, bypasses intermediary agencies, and is well-suited to a catch-up time window. Whether the second tranche gets renewed after the initial three years depends on commercialisation outcomes, but the current 80% utilisation is a positive early signal.",
        sources: [
          {
            label: 'AICP 公告（info.gov.hk）',
            labelKo: 'AICP 공시 (info.gov.hk)',
            labelJa: 'AICP 公告（info.gov.hk）',
            labelEn: 'AICP announcement (info.gov.hk)',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
          {
            label: 'AI 资助计划开放申请（news.gov.hk）',
            labelKo: 'AI 자금 지원 계획 신청 개시 (news.gov.hk)',
            labelJa: 'AI 資金助成計画の申請受付開始（news.gov.hk）',
            labelEn: 'AI Subsidy Scheme opens for application (news.gov.hk)',
            url: 'https://www.news.gov.hk/eng/2024/10/20241007/20241007_194128_145.html',
            date: '2024-10-07',
          },
        ],
      },
      'investment-4': {
        analysis:
          '创新及科技基金（Innovation and Technology Fund，ITF），1999 年成立，由 ITC（创新科技署）管理，目标是"鼓励本地公司提升技术水平和创新能力"。覆盖技术领域很广（不限 AI），AI 占比未单独披露。每年通过多个专题计划（如 ESS、PSTS、TVP）流向各类项目。判断：ITF 是综合性 R&D 基金，不是 AI 投入指标——把 HK$100 亿都计入 AI 投入会严重夸大数字。看 ITF 在 AI 项目上的实际拨款分布需要单独研究每年的项目清单；这种"汇总数字 vs 真实 AI 投入"的差距，是评估香港 AI 财政承诺时最容易踩的陷阱。',
        analysisKo:
          '혁신 및 과학기술 기금(Innovation and Technology Fund, ITF)은 1999년 설립되었으며 ITC(창의혁신기술국)가 관리하고, 목표는 「현지 기업의 기술 수준 및 혁신 능력 향상을 장려하는 것」입니다. 기술 분야의 범위가 매우 광범위합니다(AI에 국한되지 않음), AI 비중은 별도로 공개되지 않았습니다. 매년 여러 전문 프로그램(예: ESS, PSTS, TVP)을 통해 다양한 프로젝트로 흐릅니다. 판단: ITF는 종합 R&D 기금으로 AI 투자 지표가 아닙니다 — HK$100억을 모두 AI 투자에 포함시키면 숫자를 심각하게 과장하게 됩니다. ITF의 AI 프로젝트에 대한 실제 배분 분포를 보려면 매년 프로젝트 목록을 별도로 연구해야 합니다; 이러한 「합계 수치 대 실제 AI 투자」의 격차는 홍콩의 AI 재정 약속을 평가할 때 가장 쉽게 빠지는 함정입니다.',
        analysisJa:
          'イノベーション・テクノロジー基金（Innovation and Technology Fund、ITF）は1999年に設立され、ITC（イノベーション・テクノロジー庁）により管理されています。目標は「地場企業の技術水準とイノベーション能力の向上を奨励する」ことです。対象技術分野は非常に広く（AIに限定されない）、AIの割合は個別には開示されていません。毎年複数の重点計画（ESS、PSTS、TVP など）を通じてさまざまなプロジェクトに流向しています。判断：ITFは総合的なR&D基金であり、AI投資指標ではありません。HK$100億全体をAI投資として計上すると、数字を著しく誇大することになります。ITFがAIプロジェクトに対して行う実際の予算配分を理解するには、毎年のプロジェクトリストを個別に研究する必要があります。この「集計数字対真のAI投資」のギャップが、香港のAI財政コミットメント評価の際に最も陥りやすい罠です。',
        analysisEn:
          'The Innovation and Technology Fund (ITF), established in 1999 and administered by the Innovation and Technology Commission (ITC), aims to "support local companies in raising technology and innovation capability". Coverage is broad and not AI-specific; the AI share has not been disclosed. Funds flow each year through several thematic schemes (ESS, PSTS, TVP, etc.). Assessment: ITF is a general R&D pot, not an AI-spend indicator — counting the full HK$10 billion as AI investment would severely inflate the headline. The actual ITF spend on AI projects needs to be reconstructed from year-by-year project lists. This "headline number vs actual AI spend" gap is the most common pitfall when assessing Hong Kong\'s AI fiscal commitment.',
        sources: [
          {
            label: '创新科技署（ITC）',
            labelKo: '창의혁신기술국 (ITC)',
            labelJa: 'イノベーション・テクノロジー庁（ITC）',
            labelEn: 'Innovation and Technology Commission (ITC)',
            url: 'https://www.itc.gov.hk/',
          },
          {
            label: 'LCQ8：促进 AI 发展（2024-03-27）',
            labelKo: 'LCQ8: AI 발전 촉진 (2024-03-27)',
            labelJa: 'LCQ8：AI 開発促進(2024-03-27)',
            labelEn: 'LCQ8: Promoting AI development (2024-03-27)',
            url: 'https://www.info.gov.hk/gia/general/202403/27/P2024032700239.htm',
            date: '2024-03-27',
          },
        ],
      },
      'initiative-1': {
        analysis:
          'Cyberport AI Supercomputing Centre（AISC），2024 年 12 月开始部署，算力将分阶段达到 3000 PFLOPS。运营模式是"政府基础设施 + 用户付费 + AICP 补贴"——本地大学 / 研究机构 / 企业按市场价付费使用，最多通过 AICP 补回 70% list price。截至 2025 年中，已批 ~20 个项目（来自约 20 所大学、机构、公司），AISC 平均使用率近 80%。判断：3000 PFLOPS 是政策传播口号，但分阶段达到——目前是否真达 3000 PFLOPS 公开信息不全（数字属"承诺"非"实测"），但 80% 利用率显示需求确实存在。这是香港 AI 战略中执行节奏最快的一项。',
        analysisKo:
          'Cyberport AI Supercomputing Centre (AISC)는 2024년 12월부터 배포를 시작하며, 컴퓨팅 파워는 3000 PFLOPS까지 단계적으로 도달할 것입니다. 운영 모델은 「정부 기반 시설 + 사용자 비용 + AICP 보조금」입니다 — 현지 대학/연구기관/기업이 시장 가격으로 사용 비용을 지불하며, AICP를 통해 최대 목록 가격의 70%를 환급받을 수 있습니다. 2025년 중반 기준 약 20개 프로젝트가 승인되었으며(약 20개 대학, 기관, 회사에서), AISC 평균 사용률은 약 80%입니다. 판단: 3000 PFLOPS는 정책 전파 슬로건이지만 단계적으로 달성됩니다 — 현재 3000 PFLOPS을 실제로 달성했는지에 대한 공개 정보는 불완전합니다(수치는 「약속」이지 「실측」이 아닙니다), 하지만 80% 사용률은 수요가 확실히 존재함을 보여줍니다. 이는 홍콩의 AI 전략 중 가장 빠른 실행 속도를 가진 항목입니다.',
        analysisJa:
          'Cyberport AI Supercomputing Centre（AISC）は2024年12月から配備を開始し、計算能力は段階的に3000 PFLOPSに達する予定です。運営モデルは「政府インフラ+ユーザー負担+AICP補助」です。地場の大学・研究機関・企業は市場価格で利用料を支払い、AICP補助により最大70%のリストプライスまで補助されます。2025年中時点で、約20のプロジェクトが承認されており（約20の大学・機関・企業から）、AISCの平均利用率は近80%です。判断：3000 PFLOPSはポリシー伝播のスローガンですが、段階的に達成されます。現時点で真に3000 PFLOPSに達しているかは公開情報では完全ではありません（この数字は「約束」であり「実測値」ではない）。しかし80%の利用率は需要が確実に存在することを示しています。これは香港のAI戦略の中で実行スピードが最も速い項目です。',
        analysisEn:
          'Cyberport\'s AI Supercomputing Centre (AISC) began deployment in December 2024, with compute capacity scaling progressively to around 3 000 PFLOPS. Operating model: "government-built infrastructure + user-pays + AICP subsidy" — local universities, research institutes, and enterprises pay market rates, with up to 70% rebatable via AICP. By mid-2025, around 20 projects had been approved (across roughly 20 universities, institutes, and companies), and AISC average utilisation was around 80%. Assessment: 3 000 PFLOPS is a policy headline, reached in phases — whether the full figure is currently in production is not fully disclosed (it is a "commitment", not a "measured" number) — but 80% utilisation confirms genuine demand. This is the fastest-executing line in Hong Kong\'s AI strategy.',
        sources: [
          {
            label: 'AICP 公告（含 3000 PFLOPS 与利用率数字）',
            labelKo: 'AICP 공시 (3000 PFLOPS 및 사용률 수치 포함)',
            labelJa: 'AICP公告（3000 PFLOPS及び利用率データを含む）',
            labelEn: 'AICP announcement (3 000 PFLOPS and utilisation figures)',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（2025-09-25）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력 (2025-09-25)',
            labelJa: 'LCQ2：国家 AI 開発との協調(2025-09-25)',
            labelEn: "LCQ2: Alignment with country's AI development push",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
        ],
      },
      'initiative-2': {
        analysis:
          'AICP（AI 算力资助计划）作为项目执行视角：完整执行由 ITIB 牵头、Cyberport 运营、用户分批申请。审批委员会 2024 年 8 月公布，10 月开放首轮申请。截至 2025 年中已批约 20 个项目（来自约 20 所大学 / 机构 / 公司）。重点支持：基础研究（AI4Science 类）、行业应用（金融、医疗、物流）、跨境合作（大湾区联合项目）。判断：申请门槛和审批速度是关键——AICP 若像传统 ITF 项目一样平均需 6 个月审批，对 AI 这种高周转领域吸引力会大打折扣。当下批件速度公开信息有限，需要持续观察项目周转率作为执行健康度信号。',
        analysisKo:
          'AICP(AI 컴퓨팅 파워 자금 지원 계획)를 프로젝트 실행 관점에서 보면: 완전한 실행은 ITIB가 주도하고, Cyberport가 운영하며, 사용자가 배치별로 신청합니다. 심사 위원회는 2024년 8월에 공개되었으며, 10월에 첫 번째 신청 모집을 개시했습니다. 2025년 중반 기준 약 20개 프로젝트(약 20개 대학/기관/회사에서)가 승인되었습니다. 주요 지원 분야: 기초 연구(AI4Science 유형), 산업 응용(금융, 의료, 물류), 국경 간 협력(대만 지역 연합 프로젝트). 판단: 신청 기준과 심사 속도가 핵심입니다 — AICP가 기존 ITF 프로젝트처럼 평균 6개월 심사에 걸리면, AI와 같이 회전율이 높은 분야에서 매력도가 크게 떨어질 것입니다. 현재 프로젝트 심사 속도에 대한 공개 정보는 제한적이며, 프로젝트 회전율을 계속 모니터링하여 실행 건강도 신호로 삼아야 합니다.',
        analysisJa:
          'AICP（AI計算力助成計画）をプロジェクト実行の視点からみると：完全な実行はITIBが主導、Cybertownが運営し、ユーザーが段階的に申請します。審査委員会は2024年8月に公表され、10月に初回申請受付を開始しました。2025年中時点で約20のプロジェクトが承認されており（約20の大学・機関・企業から）。重点支援対象：基礎研究（AI4Science型）、産業応用（金融、医療、物流）、越境協力（粤港澳大湾区の共同プロジェクト）。判断：申請要件と審査速度が重要です。ACIPが従来のITFプロジェクトと同様に平均で6ヶ月の審査期間を要する場合、AI分野のような高周期性の領域での魅力度が大きく低下します。現在の案件処理速度については公開情報が限定されており、プロジェクト周期率を継続的に観察する必要があります。それが実行の健全性を示す信号となります。',
        analysisEn:
          'AICP from a project-execution lens: led by ITIB, operated by Cyberport, with users applying in rolling batches. The approval committee was named in August 2024; the first round of applications opened in October 2024. By mid-2025, around 20 projects had been approved (across some 20 universities, institutes, and companies). Funded areas: basic research (AI4Science-type), sectoral applications (finance, healthcare, logistics), and cross-boundary collaborations (Greater Bay Area joint projects). Assessment: application bar and approval cadence are the critical levers — if AICP behaves like a traditional ITF project (~6 months average to approval), it loses its appeal for fast-moving AI work. Approval-cadence data is sparse so far; project turnover rate is the metric to watch as a health signal.',
        sources: [
          {
            label: 'AI 资助计划审批委员会公布（2024-08-12）',
            labelKo: 'AI 자금 지원 계획 심사 위원회 공개 (2024-08-12)',
            labelJa: 'AI資金助成計画審査委員会公表（2024-08-12）',
            labelEn: 'AI Subsidy Scheme approval committee announced (2024-08-12)',
            url: 'https://www.news.gov.hk/eng/2024/08/20240812/20240812_144309_314.html',
            date: '2024-08-12',
          },
          {
            label: 'AICP 公告',
            labelKo: 'AICP 공시',
            labelJa: 'AICP公告',
            labelEn: 'AICP announcement',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
        ],
      },
      'initiative-3': {
        analysis:
          'AIRDI 作为研究项目载体的视角：定位"上游 R&D + 中下游成果转化 + 应用场景拓展"，预计 2026 年开张。研究方向尚未公开披露，但从 LegCo ITB 委员会文件看会聚焦在大模型、AI for science、跨境数据应用。组织模式预期参考新加坡 AISG / 加拿大 Mila / 英国 Turing Institute。判断：AIRDI 的成功取决于三个变量：(1) 有学术 prestige 的院长能否到位；(2) HK$10 亿 5 年内能否吸引 200+ 研究员；(3) 与本地大学（HKU、CUHK、HKUST）的关系是合作还是竞争。这三个变量决定它是国际 AI 研究中心还是另一个本地研究机构。',
        analysisKo:
          'AIRDI를 연구 프로젝트 운영체 관점에서 보면: 정위는 「상류 R&D + 중하류 성과 전환 + 응용 시나리오 확대」이며, 2026년 개시 예정입니다. 연구 방향은 아직 공개 공시되지 않았지만, LegCo ITB 위원회 문서에서 대규모 모델, AI for science, 국경 간 데이터 응용에 집중할 것으로 보입니다. 조직 모델은 싱가포르 AISG/캐나다 Mila/영국 Turing Institute를 참고할 것으로 예상됩니다. 판단: AIRDI의 성공은 세 가지 변수에 달려 있습니다: (1) 학문적 명성을 갖춘 원장이 올 수 있는가; (2) HK$10억이 5년 내에 200명 이상의 연구원을 유치할 수 있는가; (3) 현지 대학(HKU, CUHK, HKUST)과의 관계가 협력인가 경쟁인가. 이 세 가지 변수가 이것이 국제 AI 연구 센터인지 또 다른 현지 연구 기관인지를 결정합니다.',
        analysisJa:
          'AIRDIを研究プロジェクト基盤の視点からみると：位置づけは「上流R&D+中下流成果転化+応用シナリオ拡張」で、2026年の開設が予定されています。研究方向はまだ公開開示されていませんが、LegCo ITB委員会の文書からは大規模言語モデル、AI for science、越境データ応用に焦点を当てると思われます。組織モデルはシンガポールのAISG、カナダのMila、英国のTuring Instituteを参考にすることが予想されます。判断：AIRDIの成功は3つの変数に左右されます：(1)学術的プレスティッジのある学長が到任できるか；(2)HK$10億が5年の期間内に200人以上の研究者を誘致できるか；(3)地場の大学（HKU、CUHK、HKUST）との関係が協力か競争かという点。これら3つの変数がそれを国際的なAI研究拠点にするのか、もう一つの地場研究機関にするのかを決定します。',
        analysisEn:
          'AIRDI as a research project: positioned as "upstream R&D + midstream and downstream commercialisation + use-case expansion", with launch expected in 2026. Research priorities have not been publicly named, but the LegCo ITB Panel paper indicates focus on large models, AI for science, and cross-boundary data applications. The organisational model is expected to draw from Singapore AISG / Canada Mila / UK Turing Institute. Assessment: AIRDI\'s success will hinge on three variables — (1) whether an academically prestigious director can be hired; (2) whether HK$1bn over five years can attract 200+ researchers; (3) whether its relationship with local universities (HKU, CUHK, HKUST) is collaborative or competitive. These three variables decide whether AIRDI becomes an international AI research hub or just another local institute.',
        sources: [
          {
            label: 'AIRDI 专项预算公告',
            labelKo: 'AIRDI 전문 예산 공시',
            labelJa: 'AIRDI 特別予算公告',
            labelEn: 'AIRDI earmark announcement',
            url: 'https://www.news.gov.hk/eng/2025/02/20250226/20250226_093511_297.html',
            date: '2025-02-26',
          },
          {
            label: 'LegCo ITB 委员会 AIRDI 文件',
            labelKo: 'LegCo ITB 위원회 AIRDI 문서',
            labelJa: 'LegCo ITB 委員会 AIRDI ドキュメント',
            labelEn: 'LegCo ITB panel AIRDI paper',
            url: 'https://web.archive.org/web/20260204014248/https://www.legco.gov.hk/yr2025/english/panels/itb/papers/itb20250714cb2-1376-4-e.pdf',
            date: '2025-07-14',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（2025-09-25）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력 (2025-09-25)',
            labelJa: 'LCQ2：国家 AI 開発との協調(2025-09-25)',
            labelEn: "LCQ2: Alignment with country's AI development push",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
        ],
      },
      'initiative-4': {
        analysis:
          'Smart Government Innovation Lab（Smart LAB），由 OGCIO 2019 年成立，2024 年随 DPO 升格迁入新办公室。机制是"政府部门提需求 → 业界提解决方案 → Lab 资助 PoC → 部门采购"。截至 2024 年累计 100+ PoC 项目，部分演化为正式政府服务（如 iAM Smart 平台、智能客服）。判断：Smart LAB 是香港"政府用 AI"的主要管道，比新加坡 GovTech 的体量和速度都小一档，但运作机制类似——是少有的"真在跑"的 AI 落地通道。GenAI 时代它的角色会重要——政府部门 GenAI 试点最可能从这里跑通后再外溢到 AICP。',
        analysisKo:
          'Smart Government Innovation Lab(Smart LAB)은 OGCIO가 2019년 설립했으며, 2024년 DPO 승격에 따라 새 사무실로 이전했습니다. 메커니즘은 「정부 부서가 수요를 제시 → 업계가 솔루션을 제시 → Lab이 PoC 자금 지원 → 부서가 구매」입니다. 2024년 말까지 누적 100개 이상의 PoC 프로젝트가 있으며, 일부는 공식 정부 서비스로 발전했습니다(예: iAM Smart 플랫폼, 지능형 고객 서비스). 판단: Smart LAB은 홍콩의 「정부가 AI를 사용하는」주요 채널로, 싱가포르 GovTech의 규모 및 속도보다 한 단계 작지만 운영 메커니즘은 유사합니다 — AI 착지의 실제로 진행되는 소수의 채널입니다. 생성형 AI 시대에는 이것의 역할이 중요할 것입니다 — 정부 부서의 생성형 AI 시범은 여기서 통과한 후 외부로 확산될 가능성이 가장 높습니다.',
        analysisJa:
          'スマートガバメント・イノベーション・ラボ（Smart LAB）は、OGCIO（政府資訊科技総監弁公室）が2019年に設立し、2024年にはDPO昇格に伴い新しい官舎に移転しました。メカニズムは「政府部門がニーズを提示→業界がソリューションを提案→ラボがPoC資金提供→部門が調達」です。2024年までの累計で100以上のPoC プロジェクトがあり、一部は正式な政府サービスに発展しました（例：iAM Smartプラットフォーム、インテリジェント顧客サービス）。判断：Smart LABは香港の「政府によるAI利用」の主要な通路であり、シンガポールのGovTechと比べて規模と速度の両面で一段階小さいです。ただし運営メカニズムは類似していており、AI利用が実際に進行している数少ない通路です。GenAI時代には、その役割はより重要になるでしょう。政府部門によるGenAI実装パイロットは、この場所から成功してから他部門に波及する可能性が最も高いです。',
        analysisEn:
          'The Smart Government Innovation Lab (Smart LAB) was established by OGCIO in 2019 and moved under DPO when DPO upgraded in 2024. Mechanism: "government bureau states a need → industry proposes a solution → the Lab funds a PoC → the bureau procures". By 2024, 100+ PoC projects had run, several of which evolved into full government services (iAM Smart platform, intelligent customer service, and others). Assessment: Smart LAB is Hong Kong\'s primary "government uses AI" channel — smaller and slower than Singapore\'s GovTech, but structurally similar, and one of the few AI delivery lanes that is genuinely operating. In the GenAI era its role will grow: government bureau GenAI pilots are most likely to land here first before spilling over into AICP.',
        sources: [
          {
            label: 'Smart Government Innovation Lab',
            labelEn: 'Smart Government Innovation Lab',
            url: 'https://www.smartlab.gov.hk/en',
          },
          {
            label: 'LCQ8：智慧政府创新实验室（2020-06-17）',
            labelKo: 'LCQ8: 스마트 정부 혁신 실험실 (2020-06-17)',
            labelJa: 'LCQ8：スマートガバメント・イノベーション・ラボ（2020-06-17）',
            labelEn: 'LCQ8: Smart Government Innovation Lab (2020-06-17)',
            url: 'https://www.info.gov.hk/gia/general/202006/17/P2020061700290.htm',
            date: '2020-06-17',
          },
        ],
      },
      'initiative-5': {
        analysis:
          'HKMA Generative AI Sandbox，2024 年 10 月作为"金融业负责任 AI 政策声明"的一部分推出，与 Cyberport 合作运营。机制是为银行试点 GenAI 用例提供受控环境——HKMA 减免部分监管要求、提供监督指导，参与银行可在隔离环境下做 PoC。聚焦应用：风控、客服、合规自动化、文档生成。判断：沙盒模式比新加坡 MAS 慢约一年（MAS 2023 年就推 Veritas 工具集），但路径相同——这是"金融行业 AI 监管 + 创新"的标准化做法，香港的差异化空间不大；优势是与 Cyberport AISC 算力直接打通，可能加快 PoC 周期。',
        analysisKo:
          'HKMA Generative AI Sandbox는 2024년 10월에 「금융업 책임 있는 AI 정책 선언」의 일부로 시작되었으며, Cyberport와 협력하여 운영합니다. 메커니즘은 은행이 생성형 AI 사용사례를 시범하는 데 제어된 환경을 제공하는 것입니다 — HKMA가 일부 규제 요건을 감면하고 감시 지도를 제공하며, 참여 은행은 격리된 환경에서 PoC를 수행할 수 있습니다. 초점 응용: 위험 관리, 고객 서비스, 규정 준수 자동화, 문서 생성. 판단: 샌드박스 모델은 싱가포르 MAS보다 약 1년 늦습니다(MAS는 2023년에 이미 Veritas 도구 집합을 출시했습니다), 하지만 경로는 동일합니다 — 이는 「금융업 AI 규제 + 혁신」의 표준화된 방식이며, 홍콩의 차이점은 크지 않습니다; 장점은 Cyberport AISC 컴퓨팅 파워와 직접 연동되어 PoC 주기를 가속화할 수 있다는 것입니다.',
        analysisJa:
          'HKMAジェネレーティブAIサンドボックスは、2024年10月に「金融業責任あるAI政策声明」の一部として導入され、Cybertownとの協力により運営されています。メカニズムは、銀行によるGenAIユースケースのパイロットに対して規制緩和環境を提供することです。HKMAは一部の規制要件を減免し、監督指導を提供し、参加する銀行は隔離環境でPoCを実施できます。焦点となるアプリケーション：リスク管理、顧客サービス、コンプライアンス自動化、文書生成。判断：サンドボックスモデルはシンガポールのMASより約1年遅れています（MASは2023年にVeritasツールセットを導入）。ただし方向性は同じです。これは「金融業界のAI規制+イノベーション」の標準的な手法であり、香港が差別化できる余地は大きくありません。利点は、Cyberport AISCの計算能力と直接統合される点であり、PoCサイクルを加速させる可能性があります。',
        analysisEn:
          'The HKMA Generative AI Sandbox was launched in October 2024 as part of the "Policy Statement on Responsible Application of AI in Finance", operated jointly with Cyberport. Mechanism: a controlled environment for banks to pilot GenAI use cases — HKMA relaxes some regulatory requirements and provides supervisory guidance, with participating banks running PoCs in an isolated setting. Application focus: risk management, customer service, compliance automation, document generation. Assessment: the sandbox lags Singapore by about a year (MAS launched Veritas in 2023), but the path is the same — it is the standard "finance-sector AI regulation + innovation" template, leaving Hong Kong limited differentiation room. The upside: tight integration with Cyberport AISC compute, which can shorten PoC cycles.',
        sources: [
          {
            label: '金融业负责任 AI 政策声明（PDF）',
            labelKo: '금융업 책임 있는 AI 정책 선언 (PDF)',
            labelJa: '金融業責任あるAI政策声明（PDF）',
            labelEn: 'Policy Statement on Responsible AI in Finance (PDF)',
            url: 'https://gia.info.gov.hk/general/202410/28/P2024102800154_475819_1_1730087238713.pdf',
            date: '2024-10-28',
          },
          {
            label: 'HKMA 金融科技',
            labelKo: 'HKMA 금융 기술',
            labelJa: 'HKMA金融テクノロジー',
            labelEn: 'HKMA Fintech',
            url: 'https://www.hkma.gov.hk/eng/key-functions/international-financial-centre/fintech/',
          },
        ],
      },
      'body-1': {
        analysis:
          '创新科技及工业局（ITIB），2022 年从 ITB 改组扩权，加上"工业"职能。统筹科技政策、I&T 基金、初创支持，是香港 AI 政策的最高政府推动者。局长向行政长官汇报。下设 ITC（Innovation and Technology Commission）、HKSTP、Cyberport 等执行机构。判断：ITIB 是 policy maker，不是 operator——它定方向、批预算，但不直接执行 AI 项目。这种"政策与执行分离"的结构对协调性有挑战，2024 年成立 DPO 部分原因就是把 AI 数字治理从 ITIB 拆出来。这意味着追踪香港 AI 政策走向时，ITIB 公告、DPO 文件、立法会答询是三个并行入口，需要交叉读。',
        analysisKo:
          '창의혁신산업국(ITIB)은 2022년 ITB에서 개편되어 확권되었으며, 「산업」직능이 추가되었습니다. 과학기술 정책, I&T 기금, 스타트업 지원을 통합 조율하며, 홍콩 AI 정책의 최고 정부 추진 기관입니다. 국장은 행정장관에게 보고합니다. ITC(창의혁신기술국), HKSTP, Cyberport 등 실행 기관이 소속되어 있습니다. 판단: ITIB는 정책 입안자이지 운영자가 아닙니다 — 방향을 정하고 예산을 승인하지만 AI 프로젝트를 직접 실행하지 않습니다. 이러한 「정책과 실행의 분리」 구조는 조율에 과제가 있으며, 2024년 DPO 설립의 부분적 이유는 AI 수치 치리를 ITIB에서 분리하기 위함입니다. 이는 홍콩 AI 정책 방향을 추적할 때 ITIB 공시, DPO 문서, 입법회 답변이 세 가지 병렬 입구임을 의미하며, 교차 읽기가 필요합니다.',
        analysisJa:
          'イノベーション・テクノロジー・インダストリアル局（ITIB）は2022年にITBから改組・権限拡大され、「インダストリアル」職能が追加されました。科学技術政策、I&T基金、スタートアップサポートを統括し、香港のAIポリシーの最高の政府推進機関です。局長は行政長官に報告します。傘下にはITC（イノベーション・テクノロジー庁）、HKSTP、Cybertownなど複数の執行機関があります。判断：ITIBはポリシーメーカーであり、オペレーターではありません。方向性を定めて予算を承認しますが、AIプロジェクトを直接実行しません。この「ポリシー実行分離」構造は協調性に課題があります。2024年のDPO設立が部分的にその理由です。AIデジタル治理をITIBから分離したのです。これは、香港のAIポリシー動向を追跡する際には、ITIB公表、DPO文書、立法会質問という3つの並行入口を読む必要があることを意味しています。相互参照が必要です。',
        analysisEn:
          'The Innovation, Technology and Industry Bureau (ITIB) was reorganised from the ITB in 2022 with an expanded "industry" remit. It coordinates tech policy, I&T funding, and startup support, and is the top-level government driver of Hong Kong\'s AI policy. The Secretary reports to the Chief Executive. Subordinate executors include ITC (Innovation and Technology Commission), HKSTP, and Cyberport. Assessment: ITIB is a policy-maker, not an operator — it sets direction and approves budgets but does not run AI projects directly. This "policy / execution split" creates coordination friction; the 2024 spin-out of DPO from ITIB was partly to give AI digital governance its own home. The practical consequence: when tracking Hong Kong AI policy, ITIB announcements, DPO documents, and LegCo replies are three parallel entry points that must be read together.',
        sources: [
          {
            label: 'ITIB 关于我们',
            labelKo: 'ITIB 소개',
            labelJa: 'ITIB概要',
            labelEn: 'ITIB About Us',
            url: 'https://www.itib.gov.hk/en/about_us/index.html',
          },
          {
            label: '创新科技发展蓝图（PDF）',
            labelKo: '혁신 과학기술 발전 청사진 (PDF)',
            labelJa: '革新技術発展ブループリント(PDF)',
            labelEn: 'Innovation and Technology Development Blueprint (PDF)',
            url: 'https://www.itib.gov.hk/en/publications/I&T%20Blueprint%20Book_EN_single_Digital.pdf',
            date: '2022-12-22',
          },
          {
            label: 'ITIB 立法会答询（2025-03-19）',
            labelKo: 'ITIB 입법회 답변 (2025-03-19)',
            labelJa: 'ITIB 立法会質問(2025-03-19)',
            labelEn: 'ITIB Legislative Council reply (2025-03-19)',
            url: 'https://www.itib.gov.hk/en/legislative_council_business/questions/2025/pr_20250319.html',
            date: '2025-03-19',
          },
        ],
      },
      'body-2': {
        analysis:
          '数码政策办公室（DPO），2024 年从 OGCIO（政府资讯科技总监办公室）升格为局级独立机构，由数字政策专员领导。职能：(1) 政府数字化战略；(2) AI 治理与伦理框架；(3) 公共数据政策；(4) 接管 Smart Government Innovation Lab。是香港 AI 治理"软规则"的主要制定者。判断：DPO 升格是香港认识到"数字政策需要专门机构"的信号——从执行机构升格为政策机构，对标新加坡 SNDGO / IMDA Digital Trust 部门。但 DPO 仍然是行政单位，没有立法权，所以它出的指引都是"自愿性"。在追踪香港 AI 治理时，DPO 公告 + 框架 PDF 是最高频信号。',
        analysisKo:
          '수치정책국(DPO)은 2024년 OGCIO(정부 정보 기술 총감 사무실)에서 국급 독립 기관으로 승격하여 수치정책 전문가가 이끕니다. 직능: (1) 정부 수치화 전략; (2) AI 치리 및 윤리 프레임워크; (3) 공공 데이터 정책; (4) Smart Government Innovation Lab 인수. 홍콩 AI 치리 「소프트 규칙」의 주요 제정자입니다. 판단: DPO 승격은 홍콩이 「수치 정책은 전담 기관이 필요하다」는 것을 인식하는 신호입니다 — 실행 기관에서 정책 기관으로 승격하여 싱가포르 SNDGO/IMDA Digital Trust 부서에 대응합니다. 그러나 DPO는 여전히 행정 단위로 입법권이 없으므로 발행하는 지침은 모두 「자발적」입니다. 홍콩 AI 치리를 추적할 때, DPO 공시 + 프레임워크 PDF는 가장 높은 빈도의 신호입니다.',
        analysisJa:
          'デジタルポリシー局（DPO）は2024年にOGCIO（政府資訊科技総監弁公室）から昇格して独立した局級機関になり、デジタルポリシー専門官がこれを主導しています。職務：(1)政府デジタル化戦略；(2)AIガバナンスと倫理枠組み；(3)公開データポリシー；(4)スマートガバメント・イノベーション・ラボの統括。香港のAI治理「ソフトルール」の主要な策定機関です。判断：DPOの昇格は、香港が「デジタルポリシーには専門機関が必要」と認識した信号です。執行機関から政策機関への昇格で、シンガポールのSNDGO・IMDA Digital Trust部門に相当します。ただし、DPOはなお行政機関であり、立法権を持たないため、その出す指引はすべて「自主的」です。香港のAI治理を追跡する際、DPO公表と枠組みPDFは最頻信号です。',
        analysisEn:
          'The Digital Policy Office (DPO) was upgraded in 2024 from OGCIO (the Office of the Government Chief Information Officer) into a bureau-level independent body led by a Digital Policy Commissioner. Functions: (1) government digitalisation strategy; (2) AI governance and ethics framework; (3) public data policy; (4) hosting the Smart Government Innovation Lab. DPO is the main author of Hong Kong\'s "soft" AI governance rules. Assessment: the upgrade signals Hong Kong\'s recognition that "digital policy needs a dedicated agency" — moving from execution to policy, aligning with Singapore\'s SNDGO / IMDA Digital Trust units. But DPO remains an administrative body without legislative power, so its guidelines are voluntary. When tracking Hong Kong AI governance, DPO announcements and framework PDFs are the highest-signal stream.',
        sources: [
          {
            label: 'DPO 人工智能道德框架',
            labelKo: 'DPO 인공지능 윤리 프레임워크',
            labelJa: 'DPO 人工知能倫理フレームワーク',
            labelEn: 'DPO AI Ethical Framework',
            url: 'https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/ethical_ai_framework/',
          },
          {
            label: 'Smart Government Innovation Lab',
            labelEn: 'Smart Government Innovation Lab',
            url: 'https://www.smartlab.gov.hk/en',
          },
          {
            label: 'DPO 生成式 AI 指引发布',
            labelKo: 'DPO 생성형 AI 지침 발행',
            labelJa: 'DPOジェネレーティブAI指引発行',
            labelEn: 'DPO Generative AI Guideline release',
            url: 'https://www.info.gov.hk/gia/general/202504/15/P2025041500227.htm',
            date: '2025-04-15',
          },
        ],
      },
      'body-3': {
        analysis:
          '香港科技园（HKSTP），1977 年成立的法定机构（前身工业村公司），现运营 3 个科技园 + 多个孵化器。AI 相关业务包括：(1) 孵化 AI 创业公司（Incu-Tech 计划）；(2) 提供 AI / 数据中心物理空间；(3) 与 ITIB 合作的 AI 研究合作平台。判断：HKSTP 是房东 + 孵化器，不是 AI 专门机构——AI 在其业务中占比未公开。它的角色和新加坡 JTC + Singapore Land Authority 类似，是基础设施层。HKSTP 的 prestige 来自与中大、科大的物理邻接，这给了它 talent 优势，但行政属性也意味着它不会跑得像 Cyberport 那么快。',
        analysisKo:
          '홍콩과학기술원(HKSTP)은 1977년 설립된 법정 기구(전신: 산업마을회사)이며, 현재 3개의 과학기술원과 다수의 인큐베이터를 운영하고 있습니다. AI 관련 사업에는 (1) AI 창업기업 배양(Incu-Tech 프로그램), (2) AI/데이터센터 물리 공간 제공, (3) ITIB와 협력한 AI 연구 협력 플랫폼이 있습니다. 평가: HKSTP는 건물주 + 인큐베이터이며, AI 전문 기구가 아닙니다——AI의 사업 비중은 미공개입니다. 그 역할은 싱가포르의 JTC + Singapore Land Authority와 유사하며, 기반시설 계층입니다. HKSTP의 prestige는 홍콩 중국대학교, 과학기술대학교와의 물리적 인접에서 비롯되어, 이것이 talent 우위를 제공하지만, 행정적 성격으로 인해 Cyberport처럼 빠르게 움직이지는 못할 것입니다.',
        analysisJa:
          '香港科学技術園（HKSTP）は1977年に設立された法定機構（前身は産業村会社）で、現在3つの科学技術園と複数のインキュベーターを運営しています。AI関連業務には：(1)AI起業会社のインキュベーション（Incu-Tech計画）；(2)AI・データセンター物理空間の提供；(3)ITIBとの協力によるAI研究協力プラットフォーム。判断：HKSTPはランドロード+インキュベーターであり、AI専門機関ではありません。AIが事業に占める割合は公開されていません。その役割はシンガポールのJTC+Singapore Land Authorityに類似しており、インフラ層です。HKSTPのプレスティッジは、中大・科大との物理的隣接から来ており、これがtalentアドバンテージを与えますが、行政属性もまた、Cybertownほど速く動かないことを意味しています。',
        analysisEn:
          "Hong Kong Science and Technology Parks Corporation (HKSTP) is a statutory body established in 1977 (succeeding the Industrial Estates Corporation), currently running three science parks and multiple incubators. AI-related activities include: (1) incubating AI startups (Incu-Tech programme); (2) providing AI / data-centre physical space; (3) AI research collaboration platforms with ITIB. Assessment: HKSTP is a landlord and incubator, not an AI-specific agency — the AI share of its business is undisclosed. Its role mirrors Singapore's JTC + Singapore Land Authority — an infrastructure layer. HKSTP's prestige derives from physical adjacency to CUHK and HKUST, which gives it talent leverage, but its administrative posture means it will not move as fast as Cyberport.",
        sources: [
          {
            label: 'HKSTP 官网',
            labelKo: 'HKSTP 공식 웹사이트',
            labelJa: 'HKSTP公式ウェブサイト',
            labelEn: 'HKSTP website',
            url: 'https://www.hkstp.org/',
          },
          {
            label: '创新科技发展蓝图（PDF）',
            labelKo: '혁신기술발전 청사진(PDF)',
            labelJa: '革新技術発展ブループリント(PDF)',
            labelEn: 'Innovation and Technology Development Blueprint (PDF)',
            url: 'https://www.itib.gov.hk/en/publications/I&T%20Blueprint%20Book_EN_single_Digital.pdf',
            date: '2022-12-22',
          },
        ],
      },
      'body-4': {
        analysis:
          '数码港（Cyberport Management Company），1999 年由政府全资成立，运营数码港园区，定位"数字科技枢纽"。AI 相关业务：(1) 运营 AI Supercomputing Centre（AISC），2024 年部署，将达 3000 PFLOPS；(2) AICP 算力补贴的实际执行方；(3) AI 创业公司孵化（Cyberport 已孵化 2000+ 创业公司，其中 GenAI 创业公司 2024-25 年快速增长）；(4) HKMA GenAI Sandbox 的合作运营方。判断：Cyberport 是香港 AI 战略中最活跃的执行机构——2024-25 的几乎每个 AI 大动作（AISC、AICP、GenAI Sandbox）都有它。规模比 HKSTP 小但 AI 聚焦度高得多，是观察香港 AI 真实进展的关键节点。',
        analysisKo:
          '사이버포트(Cyberport Management Company)는 1999년 정부 전액 출자로 설립되었으며, 사이버포트 지역을 운영하면서 「디지털 기술 허브」로 포지셔닝하고 있습니다. AI 관련 사업: (1) AI Supercomputing Centre(AISC) 운영, 2024년 배포, 3000 PFLOPS 달성 예정; (2) AICP 컴퓨팅 보조금의 실제 집행 기관; (3) AI 창업기업 배양(사이버포트는 2000개 이상의 창업기업을 배양했으며, 그 중 GenAI 창업기업은 2024-25년에 급속 성장); (4) HKMA GenAI Sandbox의 공동 운영 기관. 평가: 사이버포트는 홍콩 AI 전략에서 가장 활동적인 집행 기관입니다——2024-25년의 거의 모든 AI 주요 움직임(AISC, AICP, GenAI Sandbox)에 관여하고 있습니다. 규모는 HKSTP보다 작지만 AI 집중도는 훨씬 높으며, 홍콩 AI의 실제 진전을 관찰하는 핵심 노드입니다.',
        analysisJa:
          'サイバーポート管理会社（Cyberport Management Company）は1999年に政府が100%出資で設立され、サイバーポート園区を運営し、「デジタル・テクノロジー・ハブ」と位置づけられています。AI関連業務：(1)AI Supercomputing Centre（AISC）の運営で、2024年配備開始、3000 PFLOPSに達する予定；(2)AICP計算力補助の実際の実行機関；(3)AI起業会社インキュベーション（Cybertownは2000社以上の起業会社をインキュベートしており、その中でGenAI起業会社は2024-25年に急速に増加）；(4)HKMAジェネレーティブAIサンドボックスの協力運営機関。判断：Cybertownは香港のAI戦略の中で最も積極的な実行機関です。2024-25年のほぼすべてのAI大型動作（AISC、AICP、GenAIサンドボックス）に関与しています。規模ではHKSTPより小さいですが、AIに対するフォーカス度ははるかに高く、香港のAI実際の進展を観察する際の重要な節点です。',
        analysisEn:
          'Cyberport Management Company is a wholly government-owned company set up in 1999 to operate the Cyberport campus, positioned as the "digital tech hub". AI-related activities: (1) operating the AI Supercomputing Centre (AISC), deployed in 2024, scaling to 3 000 PFLOPS; (2) running AICP compute subsidy disbursement; (3) incubating AI startups (Cyberport has incubated 2 000+ startups, with rapid GenAI startup growth in 2024-25); (4) co-operating the HKMA GenAI Sandbox. Assessment: Cyberport is the most active executor in Hong Kong\'s AI strategy — nearly every major AI move in 2024-25 (AISC, AICP, GenAI Sandbox) runs through it. Smaller than HKSTP in footprint but far more AI-concentrated, it is the single most informative node for tracking real progress in Hong Kong AI.',
        sources: [
          {
            label: 'AICP / AISC 公告',
            labelKo: 'AICP / AISC 공고',
            labelJa: 'AICP・AISC公告',
            labelEn: 'AICP / AISC announcement',
            url: 'https://www.info.gov.hk/gia/general/202410/07/P2024100700266.htm',
            date: '2024-10-07',
          },
          {
            label: 'LCQ2：与国家 AI 发展协同（含 Cyberport 角色）',
            labelKo: 'LCQ2: 국가 AI 발전과의 협력(사이버포트 역할 포함)',
            labelJa: 'LCQ2：国家AI発展との協同（Cybertownの役割を含む）',
            labelEn: "LCQ2: Alignment with country's AI development push (Cyberport role)",
            url: 'https://www.info.gov.hk/gia/general/202509/25/P2025092500554.htm',
            date: '2025-09-25',
          },
        ],
      },
      'body-5': {
        analysis:
          '创新科技署（HKIC，Innovation and Technology Commission，简称 ITC），1992 年成立，前身工业署。是 ITIB 下属的执行机构，主管 ITF（创新及科技基金）资金分配、技术人才入境计划、I&T 政策落地。HKIC 不直接管 AI 战略，但 ITF 通过它流向各类项目（含 AI）。判断：HKIC 是中层执行机构，不是 AI 政策制定者；ITF 在 AI 上的分配数据没单独公开，导致追踪香港 AI 实际财政投入数字困难——这是治理透明度的弱点。新规划如 AIRDI 跳过 HKIC 由 ITIB 直接管，意味着新一轮 AI 投入 HKIC 的相对重要性在下降。',
        analysisKo:
          '혁신기술위원회(HKIC, Innovation and Technology Commission, 약자 ITC)는 1992년 설립되었으며, 전신은 산업청입니다. ITIB 산하의 집행 기관으로, ITF(혁신 및 기술 기금) 자금 배분, 기술 인재 입국 계획, I&T 정책 실행을 담당합니다. HKIC는 AI 전략을 직접 관리하지 않지만, ITF를 통해 각종 프로젝트(AI 포함)에 자금을 지원합니다. 평가: HKIC는 중급 집행 기관이며, AI 정책 결정 기관이 아닙니다; ITF의 AI 관련 자금 분배 데이터는 별도로 공개되지 않아, 홍콩 AI의 실제 재정 투입 규모를 추적하기 어렵습니다——이는 거버넌스 투명성의 약점입니다. AIRDI 같은 새로운 계획은 HKIC를 우회하고 ITIB이 직접 관리하므로, 새로운 라운드 AI 투자에서 HKIC의 상대적 중요성이 감소하고 있습니다.',
        analysisJa:
          'イノベーション・テクノロジー庁（HKIC、Innovation and Technology Commission、略称ITC）は1992年に設立され、前身は産業庁です。ITIB傘下の執行機関であり、ITF（イノベーション・テクノロジー基金）資金配分、技術人才入国計画、I&Tポリシー実施の主務です。HKICはAI戦略を直接管理しませんが、ITFはそれを通じてさまざまなプロジェクト（AIを含む）に流向します。判断：HKICは中層実行機関であり、AI政策策定者ではありません。AIに対するITFの配分データは個別に公開されておらず、香港のAI実際の財政投資データの追跡が困難になります。これはガバナンス透明性の弱点です。AIRDI等の新しい計画はHKICをスキップしてITIBが直接管理するため、新一波のAI投資におけるHKICの相対的な重要性は低下しています。',
        analysisEn:
          "The Innovation and Technology Commission (HKIC, ITC), established in 1992 as a successor to the Industry Department, is an executor under ITIB responsible for ITF (Innovation and Technology Fund) allocation, the tech talent admission scheme, and I&T policy delivery. HKIC does not own AI strategy, but ITF flows through it into all kinds of projects including AI. Assessment: HKIC is a mid-tier executor, not an AI policy-maker; the AI share of ITF disbursements is not separately disclosed, which makes tracking Hong Kong's actual AI fiscal commitment difficult — a transparency weakness. New initiatives such as AIRDI bypass HKIC and report directly under ITIB, signalling that HKIC's relative weight in the next wave of AI spending is declining.",
        sources: [
          {
            label: '创新科技署（ITC）',
            labelKo: '혁신기술위원회(ITC)',
            labelJa: 'イノベーション・テクノロジー庁（ITC）',
            labelEn: 'Innovation and Technology Commission (ITC)',
            url: 'https://www.itc.gov.hk/',
          },
          {
            label: 'LCQ8：促进 AI 发展（2024-03-27）',
            labelKo: 'LCQ8: AI 발전 촉진(2024-03-27)',
            labelJa: 'LCQ8：AI 開発促進(2024-03-27)',
            labelEn: 'LCQ8: Promoting AI development (2024-03-27)',
            url: 'https://www.info.gov.hk/gia/general/202403/27/P2024032700239.htm',
            date: '2024-03-27',
          },
        ],
      },
    },
  },
  {
    flag: '🇹🇼',
    name: '台湾',
    nameKo: '대만',
    nameJa: '台湾',
    nameEn: 'Taiwan',
    fullName: '台湾地区',
    fullNameKo: '대만 지역',
    fullNameJa: '台湾地域',
    fullNameEn: 'Taiwan',
    overview:
      '台湾提出"AI 岛"愿景，2025 年底通过 AI 基本法，并规划 NT$1000 亿以上投资。作为全球半导体制造的绝对霸主（TSMC），台湾在 AI 硬件供应链上拥有无可替代的战略地位。',
    overviewKo:
      '대만은 「AI 아일랜드」 비전을 제시했으며, 2025년 말에 AI 기본법을 통과시키고, NT$1000억 이상의 투자를 계획하고 있습니다. 글로벌 반도체 제조의 절대 강자인 TSMC를 보유한 대만은 AI 하드웨어 공급망에서 대체 불가능한 전략적 지위를 가지고 있습니다.',
    overviewJa:
      '台湾は「AIアイランド」ビジョンを提案し、2025年末までにAI基本法を可決し、NT$1000億以上の投資を計画しています。世界の半導体製造の絶対的覇者（TSMC）として、台湾はAI ハードウェア・サプライチェーンで代替不可能な戦略的地位を占めています。',
    overviewEn:
      'Taiwan has put forward an "AI Island" vision, passed an AI Basic Act in late 2025, and committed over NT$100 billion in investment. As the undisputed global hegemon in semiconductor manufacturing (TSMC), Taiwan holds an irreplaceable strategic position in the AI hardware supply chain.',
    strategies: [
      {
        name: 'AI 台湾行动计划 1.0',
        nameKo: 'AI 대만 행동 계획 1.0',
        nameJa: 'AI台湾アクション・プラン1.0',
        nameEn: 'AI Taiwan Action Plan 1.0',
        year: '2018',
        description: '首个 AI 国家行动方案，聚焦人才与研发',
        descriptionKo: '첫 번째 AI 국가 행동 방안, 인재와 연구개발에 집중',
        descriptionJa: '初のAI国家行動方案で、人材とR&Dに焦点を当てています。',
        descriptionEn: 'First national AI action plan, focused on talent and R&D',
      },
      {
        name: 'AI 台湾行动计划 2.0',
        nameKo: 'AI 대만 행동 계획 2.0',
        nameJa: 'AI台湾アクション・プラン2.0',
        nameEn: 'AI Taiwan Action Plan 2.0',
        year: '2023',
        description: '升级版方案，强调产业应用与国际合作',
        descriptionKo: '업그레이드된 방안, 산업 응용 및 국제 협력 강조',
        descriptionJa: 'アップグレード版の方案で、産業応用と国際協力を強調しています。',
        descriptionEn: 'Upgraded plan emphasising industrial applications and international cooperation',
      },
      {
        name: '十大 AI 基础建设',
        nameKo: '10대 AI 기반시설',
        nameJa: '10大AI基礎インフラ',
        nameEn: 'Ten Major AI Infrastructure Projects',
        year: '2025',
        description: '包括算力中心、数据平台、人才培养等',
        descriptionKo: '컴퓨팅 센터, 데이터 플랫폼, 인재 양성 등 포함',
        descriptionJa: '計算力センター、データプラットフォーム、人材育成などを含みます。',
        descriptionEn: 'Includes compute centres, data platforms, talent development and more',
      },
      {
        name: 'AI 基本法',
        nameKo: 'AI 기본법',
        nameJa: 'AI基本法',
        nameEn: 'AI Basic Act',
        year: '2025',
        description: '原则性框架法，2025 年 12 月立法院通过',
        descriptionKo: '원칙적 프레임워크 법, 2025년 12월 입법원 통과',
        descriptionJa: '原則的枠組み法で、2025年12月に立法院で可決されました。',
        descriptionEn: 'Principles-based framework law, passed by the Legislative Yuan in December 2025',
      },
    ],
    investment: [
      {
        item: 'AI 岛总体计划',
        itemKo: 'AI 아일랜드 종합 계획',
        itemJa: 'AIアイランド総体計画',
        itemEn: 'AI Island Master Plan',
        amount: 'NT$1000 亿',
        amountKo: 'NT$1000억',
        amountJa: 'NT$1000億',
        amountEn: 'NT$100 billion',
        note: '约 US$31 亿，多年期投资',
        noteKo: '약 US$31억, 다년도 투자',
        noteJa: '約US$31億で、複数年の投資です。',
        noteEn: 'About US$3.1 billion, multi-year investment',
      },
      {
        item: '2026 年度 AI 预算',
        itemKo: '2026년도 AI 예산',
        itemJa: '2026年度AI予算',
        itemEn: '2026 AI Budget',
        amount: 'NT$300 亿',
        amountKo: 'NT$300억',
        amountJa: 'NT$300億',
        amountEn: 'NT$30 billion',
        note: '年度政府预算',
        noteKo: '연도별 정부 예산',
        noteJa: '年度政府予算です。',
        noteEn: 'Annual government budget',
      },
      {
        item: 'AI 创业计划',
        itemKo: 'AI 창업 계획',
        itemJa: 'AI起業計画',
        itemEn: 'AI Startup Programme',
        amount: 'NT$100 亿',
        amountKo: 'NT$100억',
        amountJa: 'NT$100億',
        amountEn: 'NT$10 billion',
        note: '扶持新创企业',
        noteKo: '신규 창업기업 지원',
        noteJa: '新興企業を支援します。',
        noteEn: 'Support for startups',
      },
    ],
    governance:
      '台湾于 2025 年 12 月通过 AI 基本法，采取原则性框架立法模式，由国家科学及技术委员会（NSTC）作为主管机关。法案强调创新促进、风险分级、透明度和人权保障，但具体细则仍待子法规落实。',
    governanceKo:
      '대만은 2025년 12월에 AI 기본법을 통과시켰으며, 원칙적 프레임워크 입법 방식을 채택했습니다. 국가과학기술위원회(NSTC)가 주무 기관입니다. 법안은 혁신 촉진, 위험 등급화, 투명성, 인권 보장을 강조하지만, 구체적인 세부 규칙은 하위 법규를 통해 실행될 예정입니다.',
    governanceJa:
      '台湾は2025年12月にAI基本法を可決し、原則的枠組み立法モデルを採用しました。国家科学及びテクノロジー委員会（NSTC）が主管機関です。法案はイノベーション促進、リスク分級、透明性と人権保障を強調していますが、具体的細則は依然として下位法規で実施予定です。',
    governanceEn:
      'Taiwan passed the AI Basic Act in December 2025, taking a principles-based framework legislative approach, with the National Science and Technology Council (NSTC) as the competent authority. The Act emphasises innovation promotion, risk tiering, transparency and human rights, but detailed rules await secondary legislation.',
    keyInitiatives: [
      'TSMC 先进制程持续扩产',
      '国家高速网络与计算中心 AI 算力升级',
      'AI 基本法立法（2025.12）',
      '十大 AI 基础建设计划',
      'AI 创业生态系培育',
    ],
    keyInitiativesEn: [
      'Continued TSMC advanced-node capacity expansion',
      'NCHC compute upgrade for AI workloads',
      'AI Basic Act legislation (Dec 2025)',
      'Ten Major AI Infrastructure Plan',
      'AI startup ecosystem cultivation',
    ],
    strengths: [
      'TSMC 在先进 AI 芯片制造上不可替代',
      '完整的半导体与硬件生态系统',
      '强大的工程人才培养体系',
      'AI 基本法提供了比新加坡更明确的法律框架',
    ],
    strengthsEn: [
      'TSMC is irreplaceable in advanced AI chip manufacturing',
      'Complete semiconductor and hardware ecosystem',
      'Strong engineering talent pipeline',
      "AI Basic Act provides a more explicit legal framework than Singapore's",
    ],
    weaknesses: [
      '缺乏全球性 AI 软件企业',
      '能源供应制约算力扩张',
      '台海地缘政治风险影响国际信心',
      '软件与应用层相对薄弱',
    ],
    weaknessesEn: [
      'Lacks globally significant AI software firms',
      'Energy supply constrains compute expansion',
      'Cross-strait geopolitical risk weighs on international confidence',
      'Software and application layers are relatively weak',
    ],
    keyBodies: [
      {
        name: 'NSTC（国家科学及技术委员会）',
        nameKo: 'NSTC（국가과학기술위원회）',
        nameJa: 'NSTC（国家科学及びテクノロジー委員会）',
        nameEn: 'NSTC (National Science and Technology Council)',
        role: 'AI 政策统筹与 AI 基本法主管机关',
        roleKo: 'AI 정책 조율과 AI 기본법 담당 기관',
        roleJa: 'AI政策統括とAI基本法主管機関',
        roleEn: 'Coordinates AI policy and is the competent authority for the AI Basic Act',
      },
      {
        name: 'MODA（数位发展部）',
        nameKo: 'MODA（디지털발전부）',
        nameJa: 'MODA（デジタル発展部）',
        nameEn: 'MODA (Ministry of Digital Affairs)',
        role: '数字治理与数据政策',
        roleKo: '디지털 거버넌스 및 데이터 정책',
        roleJa: 'デジタル治理とデータポリシー',
        roleEn: 'Digital governance and data policy',
      },
      {
        name: 'NDC（国家发展委员会）',
        nameKo: 'NDC（국가발전위원회）',
        nameJa: 'NDC（国家発展委員会）',
        nameEn: 'NDC (National Development Council)',
        role: '产业政策规划',
        roleKo: '산업 정책 계획',
        roleJa: '産業政策計画',
        roleEn: 'Industrial policy planning',
      },
      {
        name: 'FSC（金融监督管理委员会）',
        nameKo: 'FSC（금융감시관리위원회）',
        nameJa: 'FSC（金融監督管理委員会）',
        nameEn: 'FSC (Financial Supervisory Commission)',
        role: '金融 AI 监管',
        roleKo: '금융 AI 규제',
        roleJa: '金融AI規制',
        roleEn: 'Financial AI regulation',
      },
    ],
    sources: ['AI 台湾行动计划 2.0（2023）', 'AI 基本法草案与立法院记录（2025）', '行政院十大 AI 基础建设计划（2025）'],
    sourcesEn: [
      'AI Taiwan Action Plan 2.0 (2023)',
      'AI Basic Act draft and Legislative Yuan records (2025)',
      'Executive Yuan Ten Major AI Infrastructure Plan (2025)',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '台湾 AI 战略是"硬件优势 + 软件追赶"的双轨结构：(1) 2018 年 AI 台湾行动计划 1.0 启动；(2) 2023 年升级到 2.0，由 NSTC 协调，2023-2026 三年累计 ~NT$420 亿（FY23 NT$131 亿 + FY24 NT$121 亿 + FY25 NT$157 亿）；(3) 2025 年 7 月行政院公布"十大 AI 基础建设"计划，目标 2040 年累计创造 NT$15 兆产值，并培训 50 万 AI 应用人才；(4) 2025 年 12 月 23 日立法院通过《AI 基本法》。判断：台湾的核心 AI 战略不再是单一文件，而是"行动计划（执行）+ 基本法（治理）+ 十大基建（产业）"三层叠加。这套架构比新加坡 NAIS 2.0 更分层，但需要 NSTC 持续协调才不至于碎片化。',
        analysisKo:
          '대만 AI 전략은 「하드웨어 우위 + 소프트웨어 추격」의 이중 구조입니다: (1) 2018년 AI Taiwan Action Plan 1.0 시작; (2) 2023년 2.0으로 업그레이드, NSTC 조율, 2023-2026년 3년 누적 ~NT$420억(FY23 NT$131억 + FY24 NT$121억 + FY25 NT$157억); (3) 2025년 7월 행정원이 「10대 AI 기초 인프라」 계획 공개, 2040년 누적 NT$15조 산출액 창출을 목표로 하여 50만 AI 응용 인재 양성; (4) 2025년 12월 23일 입법원이 《AI 기본법》 통과. 판단: 대만의 핵심 AI 전략은 더 이상 단일 문서가 아니라 「실행 계획(집행) + 기본법(거버넌스) + 10대 기초 인프라(산업)」의 3층 중첩입니다. 이 구조는 싱가포르 NAIS 2.0보다 더 계층화되어 있지만, NSTC의 지속적 조율이 필요해야 파편화되지 않습니다.',
        analysisJa:
          '台湾のAI戦略は「ハードウェア優位+ソフトウェア追い上げ」の双軌構造です：(1)2018年AI台湾アクション・プラン1.0がスタート；(2)2023年2.0にアップグレード。NSTCが統括し、2023-2026年の3年間で累計約NT$420億（FY23 NT$131億+FY24 NT$121億+FY25 NT$157億）；(3)2025年7月、行政院が「10大AI基礎インフラ」計画を公表。2040年までに累計NT$15兆の産出額創造と50万人のAI応用人材育成が目標；(4)2025年12月23日、立法院がAI基本法を可決。判断：台湾のコアAIプラン戦略は単一文書ではなく、「アクション・プラン（実行）+基本法（ガバナンス）+10大基盤（産業）」の3層重積です。このアーキテクチャはシンガポールのNAIS 2.0より階層化されていますが、断片化を避けるにはNSTCの継続的な統括が必要です。',
        analysisEn:
          'Taiwan\'s AI strategy is a dual-track of "hardware lead + software catch-up": (1) the AI Taiwan Action Plan 1.0 launched in 2018; (2) Plan 2.0 upgraded in 2023 under NSTC coordination, with FY23-25 budgets of NT$13.1bn + NT$12.1bn + NT$15.7bn (~NT$42bn cumulative); (3) the Executive Yuan unveiled the Ten Major AI Infrastructure Projects in July 2025, targeting NT$15 trillion in cumulative output by 2040 and 500 000 trained AI practitioners; (4) the Legislative Yuan passed the AI Basic Act on 23 December 2025. Assessment: Taiwan\'s core AI strategy is no longer a single document — it is a three-layer stack of "action plan (execution) + Basic Act (governance) + Ten Major projects (industry)". The architecture is more layered than Singapore\'s NAIS 2.0, but it depends on continuous NSTC coordination to avoid fragmentation.',
        sources: [
          {
            label: 'AI Taiwan Action Plan（行政院政策）',
            labelKo: 'AI Taiwan Action Plan（행정원 정책）',
            labelJa: 'AIタイワン・アクション・プラン（行政院ポリシー）',
            labelEn: 'AI Taiwan Action Plan (Executive Yuan policy detail)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
          {
            label: '十大 AI 基础建设公告（RTI）',
            labelKo: '10대 AI 기초 인프라 공고(RTI)',
            labelJa: '十大 AI 基礎建設発表（RTI）',
            labelEn: 'Ten Major AI Infrastructure Projects launch (RTI)',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
          {
            label: 'AI 基本法立法院通过（Focus Taiwan）',
            labelKo: 'AI 기본법 입법원 통과(Focus Taiwan)',
            labelJa: 'AI基本法立法院可決（Focus Taiwan）',
            labelEn: 'AI Basic Act passed by Legislative Yuan (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '台湾 AI 投资特征是"产业大盘大、政府专项小"：(1) AI 台湾行动计划 2.0 三年累计政府预算 ~NT$42 亿（约 US$13 亿，FY23-25 实际拨款）；(2) 十大 AI 基础建设规划 NT$1.5 兆（约 US$510 亿）总投入，跨越 2025-2040 多年期，含算力中心、机器人园区、人才培养；(3) 2026 年度 AI 专项预算 NT$300 亿；(4) AI 创业计划 NT$100 亿 venture capital；(5) 私部门投入（TSMC 资本支出 2025 ~US$420 亿，但其中 AI 部分难拆分）远超政府数字。判断：台湾政府专门 AI 直投（行动计划 + 创业 + 年度）的可比口径与新加坡 S$2B 量级接近，但加上 TSMC 制造端 capex 后总盘是新加坡的 30-50 倍——这是产业结构差异，不是 AI 政策强度差异。',
        analysisKo:
          '대만 AI 투자의 특징은 「산업 대규모, 정부 전문 소규모」입니다: (1) AI Taiwan Action Plan 2.0 3년 누적 정부 예산 ~NT$42억(약 US$13억, FY23-25 실제 배분); (2) 10대 AI 기초 인프라 계획 NT$1.5조(약 US$510억) 총 투입, 2025-2040년 다년도 기간, 연산력 센터, 로봇 산업 단지, 인재 양성 포함; (3) 2026년도 AI 전문 예산 NT$300억; (4) AI 스타트업 계획 NT$100억 벤처 캐피탈; (5) 민간 부문 투입(TSMC 자본 지출 2025년 ~US$420억, 하지만 그 중 AI 부분은 분리하기 어려움)이 정부 수치를 훨씬 초과합니다. 판단: 대만 정부의 전문 AI 직접 투자(실행 계획 + 스타트업 + 연도별)의 비교 가능한 기준은 싱가포르 S$2B 규모에 가깝지만, TSMC 제조 부문 자본 지출을 더하면 총 규모는 싱가포르의 30-50배입니다 - 이는 산업 구조 차이이지 AI 정책 강도 차이가 아닙니다.',
        analysisJa:
          '台湾の AI 投資の特徴は「産業規模は大きく、政府の専項は小さい」です：(1) AI Taiwan Action Plan 2.0 の3年累計政府予算は約 NT$42 億（約 US$13 億、FY23-25 の実配分）；(2) 十大 AI 基礎建設計画 NT$1.5 兆（約 US$510 億）の総投入、2025-2040 年の複数年にわたり、計算力センター、ロボット園区、人材育成を含む；(3) 2026 年度 AI 専項予算 NT$300 億；(4) AI スタートアップ計画 NT$100 億 venture capital；(5) 民間部門の投入（TSMC 資本支出 2025 年約 US$420 億、ただしそのうち AI 部分は分離困難）は政府数字を大きく上回ります。判断：台湾政府の AI 直投（行動計画 + スタートアップ + 年度）の比較可能な計測ではシンガポール S$2B 規模に近いですが、TSMC 製造端 capex を加えた総規模はシンガポールの 30-50 倍です——これは産業構造の差異であり、AI 政策強度の差異ではありません。',
        analysisEn:
          'Taiwan\'s AI spend is characterised by a "large industrial pool and a small dedicated government line": (1) AI Taiwan Action Plan 2.0 cumulative FY23-25 government appropriation is roughly NT$42bn (~US$1.3bn); (2) the Ten Major AI Infrastructure Projects target NT$1.5 trillion (~US$51bn) over 2025-2040, covering compute centres, robotics parks, talent pipelines; (3) the FY26 dedicated AI line is NT$30bn; (4) NT$10bn is earmarked for AI startup venture capital; (5) private spend (TSMC FY25 capex ~US$42bn, of which the AI share is not separately broken out) far exceeds government commitments. Assessment: on a like-for-like dedicated-government basis, Taiwan is comparable to Singapore at the S$2bn order of magnitude; once TSMC manufacturing capex is added the total is 30-50× Singapore — that is an industrial-structure gap, not an AI-policy intensity gap.',
        sources: [
          {
            label: '十大 AI 基础建设：NT$15 兆产值目标',
            labelKo: '10대 AI 기초 인프라: NT$15조 산출액 목표',
            labelJa: '十大 AI 基礎建設：NT$15 兆産値目標',
            labelEn: 'Ten Major AI Infrastructure Projects: NT$15 trillion output target',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
          {
            label: 'AI Taiwan Action Plan 行政院页面',
            labelKo: 'AI Taiwan Action Plan 행정원 페이지',
            labelJa: 'AI Taiwan Action Plan 行政院ページ',
            labelEn: 'AI Taiwan Action Plan (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
        ],
      },
      'governance-model': {
        analysis:
          '台湾 AI 治理是"原则法 + 风险分级 + 多机构协作"：(1) 2025 年 12 月《AI 基本法》通过，由 NSTC 任主管机关，编入 7 项国际通用原则（可持续与福祉、人本自主、隐私与数据治理、网络安全、透明可解释、公平、问责）；(2) 行政院须设立"国家 AI 战略特别委员会"；(3) MODA 需建立国际对齐的风险分级框架；(4) 强制要求高风险 AI 应用标识、劳工权利保障；(5) 实施时间表清晰：3 个月内出未成年人/人权/性别影响评估，6 个月内完成现有政府 AI 用例风险评估，12 个月内建立政府 AI 使用规则，24 个月内修订相关法规。判断：台湾选了"框架法 + 子法律细则"的欧盟式治理路径，比新加坡的"工具+守则"路径更具法律强制性，但具体细则等待 24 个月内的行政命令落地——窗口期是观察重点。',
        analysisKo:
          '대만 AI 거버넌스는 「원칙법 + 위험 분급 + 다기구 협력」입니다: (1) 2025년 12월 『AI 기본법』이 통과되었으며, NSTC가 주무 기구가 되고, 7개의 국제 공용 원칙이 포함됩니다(지속가능성 및 복지, 인간중심 자율성, 개인정보보호 및 데이터 거버넌스, 사이버보안, 투명성 및 해석가능성, 공정성, 책임성); (2) 행정원은 「국가 AI 전략 특별 위원회」를 설립해야 합니다; (3) MODA는 국제 정렬된 위험 분급 프레임워크를 수립해야 합니다; (4) 고위험 AI 애플리케이션의 표시 및 노동자 권리 보장을 강제 요구합니다; (5) 시행 일정이 명확합니다: 3개월 내 미성년자/인권/성별 영향 평가, 6개월 내 현재 정부 AI 사용 사례의 위험 평가 완료, 12개월 내 정부 AI 사용 규칙 수립, 24개월 내 관련 법규 개정. 판단: 대만은 「프레임워크 법 + 하위 법률 상세규칙」의 유럽연합식 거버넌스 경로를 선택했으며, 싱가포르의 「도구+지침」 경로와 비교하여 더욱 법적 강제성을 갖추고 있습니다. 하지만 구체적 상세규칙은 24개월 내 행정 명령 시행을 기다리고 있습니다——윈도우 기간이 관찰의 초점입니다.',
        analysisJa:
          '台湾の AI ガバナンスは「原則法 + リスク段階化 + 複数機構の協働」です：(1) 2025 年 12 月『AI 基本法』が可決、NSTC が主管機関となり、7 項目の国際通用原則を組み込む（持続可能性と福利、人間本位の自主性、プライバシーと個人情報ガバナンス、サイバーセキュリティ、透明性と説明可能性、公平性、説明責任）；(2) 行政院は「国家 AI 戦略特別委員会」を設置する必要がある；(3) MODA は国際調和したリスク段階化フレームワークを構築する；(4) 高リスク AI アプリケーションの強制表示と労働者権利保護を要求；(5) 実施スケジュールは明確：3 カ月以内に未成年者 / 人権 / ジェンダー影響評価、6 カ月以内に既存政府 AI ユースケースのリスク評価実施、12 カ月以内に政府 AI 使用ルール構築、24 カ月以内に関連法規の改訂。判断：台湾は「枠組み法 + サブ法規細則」の EU 式ガバナンス経路を選択、シンガポールの「ツール + ガイドライン」路線より法的強制力がありますが、具体的細則は 24 カ月内の行政命令の発効を待つ——観察対象の重点は移行期です。',
        analysisEn:
          'Taiwan\'s AI governance is a "framework law + risk tiering + multi-agency coordination" model: (1) the AI Basic Act passed in December 2025, designating NSTC as competent authority and codifying seven international principles — sustainability and well-being, human autonomy, privacy and data governance, cybersecurity and safety, transparency and explainability, fairness and non-discrimination, accountability; (2) the Executive Yuan is mandated to set up a National AI Strategy Special Committee; (3) MODA must establish an internationally aligned risk classification framework; (4) high-risk AI applications must be labelled and labour rights safeguarded; (5) the implementation timeline is concrete — within 3 months: minors/human rights/gender impact assessment; within 6 months: risk assessment of existing government AI uses; within 12 months: government AI usage rules; within 24 months: alignment of relevant statutes. Assessment: Taiwan chose an EU-style "framework law + secondary regulations" governance path, more legally prescriptive than Singapore\'s "tools and codes" route, but specifics depend on the 24-month rule-making window.',
        sources: [
          {
            label: 'AI 基本法立法院通过',
            labelKo: 'AI 기본법 입법원 통과',
            labelJa: 'AI 基本法が立法院で可決',
            labelEn: 'AI Basic Act passed (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
          {
            label: 'AI Basic Act 全文报道（Taiwan News）',
            labelKo: 'AI Basic Act 전문 보도(Taiwan News)',
            labelJa: 'AI Basic Act 全文報道（Taiwan News）',
            labelEn: 'Taiwan passes AI Basic Act (Taiwan News)',
            url: 'https://www.taiwannews.com.tw/news/6270744',
            date: '2025-12-23',
          },
          {
            label: 'NSTC 主管机关',
            labelKo: 'NSTC 주무 기구',
            labelJa: 'NSTC が主管機関',
            labelEn: 'NSTC competent authority',
            url: 'https://www.nstc.gov.tw/?l=en',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          '台湾相对新加坡的核心杠杆是"半导体不可替代 + 法律明确"：(1) TSMC 在 3nm/2nm 等先进 AI 芯片制造上是事实独占，全球 AI hardware 供应链不能绕过台湾，新加坡完全没有可比资产；(2) 2025 年 12 月通过的 AI 基本法是亚洲少数有强制力的 AI 框架法之一，比新加坡的"自愿守则 + AI Verify 工具"路径更具法律地位；(3) 完整的工程师培养体系（每年 ~10 万 STEM 毕业生）。但短板：缺乏全球性 AI 软件公司（vs 新加坡的 Sea Group / Grab AI 团队）、能源供应紧张制约算力扩张、台海地缘风险压低国际信心。判断：台湾的优势在"芯片 + 法律"，新加坡的优势在"枢纽 + 治理工具化"，两者赛道重叠度低；台湾在 2025 年 AI 基本法之后，治理面比新加坡更"硬"，但软件应用层短板未解。',
        analysisKo:
          '대만이 싱가포르에 상대적으로 가진 핵심 레버는 「반도체 불가대체 + 법률 명확」입니다: (1) TSMC는 3nm/2nm 등 첨단 AI 칩 제조에서 사실상 독점이며, 글로벌 AI 하드웨어 공급망이 대만을 우회할 수 없고, 싱가포르는 전혀 비교할 만한 자산이 없습니다; (2) 2025년 12월 통과한 AI 기본법은 아시아 소수의 강제력 있는 AI 프레임워크법 중 하나이며, 싱가포르의 「자발적 지침 + AI Verify 도구」 경로보다 더 강한 법적 지위를 가집니다; (3) 완전한 엔지니어 양성 체계(매년 ~10만 STEM 졸업생). 하지만 약점: 글로벌 AI 소프트웨어 회사 부재(vs 싱가포르의 Sea Group / Grab AI 팀), 에너지 공급 부족이 연산력 확장을 제약, 대만 해협 지정학적 리스크가 국제 신뢰를 약화합니다. 판단: 대만의 강점은 「칩 + 법률」, 싱가포르의 강점은 「허브 + 거버넌스 도구화」, 두 트랙의 중복도가 낮습니다; 대만은 2025년 AI 기본법 이후, 거버넌스 측면에서 싱가포르보다 더 「강경」하지만, 소프트웨어 애플리케이션 계층 약점은 미해결입니다.',
        analysisJa:
          '台湾がシンガポールに対して持つ核心レバーは「半導体不可替代 + 法律明確」です：(1) TSMC は 3nm / 2nm などの先進的な AI チップ製造で事実上独占、グローバルな AI ハードウェア供給チェーンは台湾を迂回できない、シンガポールは全く比較可能な資産を持たない；(2) 2025 年 12 月に可決された AI 基本法はアジアの少数派の強制力を持つ AI 枠組み法であり、シンガポールの「自主的ガイドライン + AI Verify ツール」路線より法的地位が高い；(3) 完全なエンジニア育成体系（毎年約 10 万 STEM 卒業生）。ただし短所：グローバル AI ソフトウェア企業の欠如（シンガポールの Sea Group / Grab AI チームとの比較）、エネルギー供給の逼迫が計算力拡張を制限、台湾海峡の地政学的リスクが国際信頼を低下させる。判断：台湾の優位は「チップ + 法律」、シンガポールの優位は「ハブ + ガバナンスのツール化」、両者のレースコース重複度は低い；台湾は 2025 年 AI 基本法の後、ガバナンス面ではシンガポールより「硬い」ですが、ソフトウェアアプリケーション層の短所は未解決です。',
        analysisEn:
          "Taiwan's edge over Singapore is \"irreplaceable semiconductors + legal clarity\": (1) TSMC is a de facto monopoly in advanced AI chips at 3 nm / 2 nm, global AI hardware supply chains cannot bypass Taiwan, and Singapore has no comparable asset; (2) the AI Basic Act passed in December 2025 is one of Asia's rare enforceable AI framework laws, with stronger legal standing than Singapore's \"voluntary code + AI Verify\" path; (3) a complete engineering pipeline producing roughly 100 000 STEM graduates a year. Weaknesses: no globally significant AI software firm (vs Singapore's Sea Group / Grab AI teams), energy constraints limit compute expansion, and cross-strait geopolitical risk weighs on international confidence. Assessment: Taiwan's advantages cluster around chips and law; Singapore's around hub status and toolised governance — the two tracks barely overlap. After the AI Basic Act, Taiwan's governance posture is harder than Singapore's, but its software-application gap is unresolved.",
        sources: [
          {
            label: 'AI 基本法（Focus Taiwan）',
            labelKo: 'AI 기본법(Focus Taiwan)',
            labelJa: 'AI 基本法（Focus Taiwan）',
            labelEn: 'AI Basic Act (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
          {
            label: '十大 AI 基础建设：以芯片 + 软件应用做基底',
            labelKo: '10대 AI 기초 건설: 칩 + 소프트웨어 애플리케이션을 기반으로',
            labelJa: '十大 AI 基礎建設：チップ + ソフトウェアアプリケーションをベースとする',
            labelEn: 'Ten Major AI Infrastructure: chips + software applications base',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
        ],
      },
      'strategy-1': {
        analysis:
          'AI 台湾行动计划 1.0 由科技部（NSTC 前身）于 2018 年启动，是台湾首份国家级 AI 行动方案。聚焦五大支柱：人才优化与扩充、技术培育与产业发展、运营环境完善、提升国际影响力、人文社会议题。1.0 时期重点是 AI 创新研究中心 (AICN) 的建设和台大、清华、交大、成大四校 AI 创新研究中心的设立。判断：1.0 是"奠基期"——把台湾从"AI 政策真空"带到"有规划框架"。它的实际落地速度慢，2.0 才把节奏拉起来。这种"分两期、分十年"的渐进路径比新加坡 NAIS 1.0→2.0 的迭代更慢，但也更深入产业。',
        analysisKo:
          'AI 대만 행동 계획 1.0은 과학기술부(NSTC 전신)에 의해 2018년에 시작되었으며, 대만의 첫 번째 국가급 AI 행동 방안입니다. 5대 기둥에 집중합니다: 인재 최적화 및 확대, 기술 육성 및 산업 발전, 운영 환경 개선, 국제 영향력 강화, 인문 사회 의제. 1.0 시기의 핵심은 AI 혁신 연구 센터(AICN) 구축 및 대만대학교, 칭화대학교, 교통대학교, 성공대학교 4개 대학의 AI 혁신 연구 센터 설립입니다. 판단: 1.0은 「초석 조성 시기」입니다――대만을 「AI 정책 진공」에서 「계획적 프레임워크」로 이끌었습니다. 실제 추진 속도가 느렸으며, 2.0에서야 박자를 높였습니다. 이러한 「두 기로 나누어 10년에 걸친」점진적 경로는 싱가포르의 NAIS 1.0→2.0 반복보다 더 느리지만, 산업에 더 깊이 침투합니다.',
        analysisJa:
          'AI Taiwan Action Plan 1.0 は 2018 年に科技部（NSTC の前身）によって開始され、台湾初の国家レベル AI アクションプランです。5 つの重点柱に焦点を当てます：人材最適化と拡充、技術育成と産業発展、運営環境の改善、国際的影響力の向上、人文社会課題。1.0 期間の重点は AI イノベーションセンター（AICN）の構築と台湾大学、清華大学、交通大学、成功大学の 4 校 AI イノベーションセンターの設立です。判断：1.0 は「基礎構築期」——台湾を「AI 政策の空白」から「計画フレームワーク有り」へ導きました。実際の実施スピードは遅く、2.0 でペースが上がります。この「2 期制、10 年計画」の段階的経路はシンガポール NAIS 1.0→2.0 の反復より遅いですが、産業へのより深い浸透も実現しています。',
        analysisEn:
          'AI Taiwan Action Plan 1.0 was launched by the Ministry of Science and Technology (predecessor of NSTC) in 2018 as Taiwan\'s first national AI action plan. Five pillars: talent optimisation and expansion, technology cultivation and industrial development, comprehensive operational environment, enhanced international influence, addressing humanities and social issues. The 1.0 era focused on AI Innovation Research Centres (AICN) and the four AI hubs at NTU, NTHU, NYCU, and NCKU. Assessment: 1.0 was the foundational era — moving Taiwan from "AI policy vacuum" to "framework in place". Its execution pace was slow; 2.0 raised the cadence. This "two phases, ten years" gradualism is slower than Singapore\'s NAIS 1.0→2.0 cycle but penetrates industry more deeply.',
        sources: [
          {
            label: 'AI Taiwan Action Plan（Executive Yuan）',
            labelEn: 'AI Taiwan Action Plan (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
        ],
      },
      'strategy-2': {
        analysis:
          'AI 台湾行动计划 2.0 由 NSTC 于 2023 年发布，时间窗口 2023-2026 年。FY23-25 累计政府拨款约 NT$420 亿（FY23 NT$131 亿 + FY24 NT$121 亿 + FY25 NT$157 亿）。2.0 在 1.0 五大支柱基础上加重"产业应用"和"国际合作"两条线。判断：2.0 是台湾 AI 政策从"研究驱动"转向"产业驱动"的关键节点——FY25 跳到 NT$157 亿（同比 +30%）显示政府意图加速。但 NT$157 亿 ≈ US$5 亿，对照台湾 GDP（~US$8000 亿）只占 0.06%，绝对量不算大；TSMC 等私部门 capex 仍是 AI 真正大头。',
        analysisKo:
          'AI 대만 행동 계획 2.0은 NSTC가 2023년 발표했으며, 시간 범위는 2023-2026년입니다. FY23-25 누적 정부 지출은 약 NT$420억입니다(FY23 NT$131억 + FY24 NT$121억 + FY25 NT$157억). 2.0은 1.0의 5대 기둥을 기초로 「산업 응용」과 「국제 협력」 두 분야에 가중치를 높였습니다. 판단: 2.0은 대만 AI 정책이 「연구 주도」에서 「산업 주도」로 전환하는 핵심 지점입니다. FY25에 NT$157억으로 급증(전년 대비 +30%)한 것은 정부의 가속화 의도를 보여줍니다. 하지만 NT$157억 ≈ US$5억은 대만 GDP(~US$8000억)의 0.06%에 불과하므로 절대 규모는 크지 않습니다. TSMC 등 민간 부문 자본지출이 여전히 AI의 진정한 핵심입니다.',
        analysisJa:
          'AI Taiwan Action Plan 2.0 は NSTC が 2023 年に発布、時間窓口は 2023-2026 年です。FY23-25 累計政府配分は約 NT$420 億（FY23 NT$131 億 + FY24 NT$121 億 + FY25 NT$157 億）です。2.0 は 1.0 の 5 つの重点柱の基礎の上に「産業応用」と「国際協力」の 2 本を加重しています。判断：2.0 は台湾 AI 政策が「研究駆動」から「産業駆動」への転換の重要なターニングポイント——FY25 の NT$157 億への上昇（前年同期比 +30%）は政府の加速意図を示しています。ただし NT$157 億 ≈ US$5 億で、台湾 GDP（約 US$8000 億）に対して 0.06% を占めるのみ、絶対額は大きくありません；TSMC など民間部門の capex が依然として AI の真の大きな規模です。',
        analysisEn:
          'AI Taiwan Action Plan 2.0 was released by NSTC in 2023, covering 2023-2026. Cumulative FY23-25 government appropriation is roughly NT$42bn (FY23 NT$13.1bn + FY24 NT$12.1bn + FY25 NT$15.7bn). 2.0 layers "industrial applications" and "international cooperation" on top of 1.0\'s five pillars. Assessment: 2.0 marks Taiwan\'s pivot from "research-driven" to "industry-driven" AI — the FY25 jump to NT$15.7bn (+30% YoY) signals an intentional acceleration. But NT$15.7bn ≈ US$500m, just 0.06% of Taiwan\'s ~US$800bn GDP — not large in absolute terms; TSMC and similar private capex remains the real bulk of "AI spend in Taiwan".',
        sources: [
          {
            label: 'AI Taiwan Action Plan 2.0（Executive Yuan）',
            labelEn: 'AI Taiwan Action Plan 2.0 (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
          {
            label: 'AI TAIWAN 2023 / MODA 报道',
            labelKo: 'AI TAIWAN 2023 / MODA 보도',
            labelJa: 'AI TAIWAN 2023 / MODA 報道',
            labelEn: 'AI TAIWAN 2023 / MODA news',
            url: 'https://moda.gov.tw/en/ADI/news/latest-news/5461',
          },
        ],
      },
      'strategy-3': {
        analysis:
          '十大 AI 基础建设由行政院于 2025 年 7 月公布（赖清德政府），覆盖三大领域（智慧应用、核心技术、基础设施），三大核心技术（硅光子、量子科技、AI 机器人）。规划：2025-2040 年累计投入 NT$1.5 兆（约 US$510 亿），目标 2040 年创造 NT$15 兆产值，培训 50 万 AI 应用人才。具体项目包括：南部柳营智慧机器人园区、台南沙仑研究中心、六甲创新应用基地。判断：十大基建是台湾迄今规模最大的 AI 公共投入，野心对标韩国"半导体超级集群"或日本"半导体复兴"——但 NT$1.5 兆分 15 年（约每年 NT$1000 亿）需持续政治承诺。2026 年首批项目落地速度是关键观察点。',
        analysisKo:
          '10대 AI 기초 인프라 건설은 행정원이 2025년 7월 공포했으며(라이칭더 정부), 세 가지 주요 분야(스마트 응용, 핵심 기술, 기초 인프라)와 세 가지 핵심 기술(실리콘 포토닉스, 양자 과학기술, AI 로봇)을 다룹니다. 계획: 2025-2040년 누적 투입 NT$1.5조(약 US$510억), 2040년 NT$15조 생산 창출을 목표로 하며, 50만 AI 응용 인재를 양성합니다. 구체적 사업은 남부 류영 스마트 로봇 파크, 타이난 사룬 연구 센터, 류자 혁신 응용 기지를 포함합니다. 판단: 10대 기초 인프라 건설은 대만이 지금까지 규모 최대의 AI 공공 투입이며, 야심은 한국의 「반도체 슈퍼 클러스터」 또는 일본의 「반도체 부흥」을 벤치마크 대상으로 합니다. 하지만 NT$1.5조를 15년에 나누면(연 약 NT$1000억) 지속적인 정치적 공약이 필요합니다. 2026년 첫 사업 착지 속도가 핵심 관찰 포인트입니다.',
        analysisJa:
          '十大 AI 基礎建設は行政院が 2025 年 7 月に公布（賴清徳政府）、3 つの主要分野（スマート応用、コア技術、基礎施設）、3 つのコア技術（シリコンフォトニクス、量子技術、AI ロボット）をカバーしています。計画：2025-2040 年の累計投入は NT$1.5 兆（約 US$510 億）、2040 年に NT$15 兆の産値創造を目標、50 万人の AI 応用人材を育成します。具体的なプロジェクトには：南部柳営スマートロボット園区、台南沙仑研究センター、六甲イノベーション応用拠点が含まれます。判断：十大基建は台湾がこれまで行った最大規模の AI 公共投入で、野心は韓国「半導体スーパークラスタ」や日本「半導体復興」に照準を合わせています——しかし NT$1.5 兆を 15 年で割ると（約毎年 NT$1000 億）継続した政治的コミットメントが必要です。2026 年の初期プロジェクト立ち上がりスピードが重要な観察ポイントです。',
        analysisEn:
          "The Ten Major AI Infrastructure Projects were unveiled by the Lai Ching-te administration in July 2025, covering three domains (smart applications, core technologies, infrastructure) and three core technologies (silicon photonics, quantum, AI robotics). Plan: NT$1.5 trillion (~US$51bn) over 2025-2040, targeting NT$15 trillion in output by 2040 and training 500 000 AI practitioners. Concrete projects include the Liuying smart robotics park, the Shalun research centre, and the Liujia innovation hub. Assessment: this is Taiwan's largest-ever public AI commitment, with ambitions on the order of South Korea's semiconductor super-cluster or Japan's chip revival — but NT$1.5 trillion stretched over 15 years (~NT$100bn/year) requires sustained political commitment. The 2026 first-wave delivery cadence is the critical signal to watch.",
        sources: [
          {
            label: '十大 AI 基础建设公告（RTI）',
            labelKo: '10대 AI 기초 인프라 건설 공고(RTI)',
            labelJa: '十大 AI 基礎建設発表（RTI）',
            labelEn: 'Ten Major AI Infrastructure Projects launch (RTI)',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
          {
            label: '行政院公布详情（Taipei Times）',
            labelKo: '행정원 공개 상세(Taipei Times)',
            labelJa: '行政院が詳細を公布（Taipei Times）',
            labelEn: 'Plan details (Taipei Times)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
        ],
      },
      'strategy-4': {
        analysis:
          '《AI 基本法》2025 年 12 月 23 日立法院三读通过，2026 年 1 月 14 日由赖清德总统签署生效，是亚洲少数有法律强制力的 AI 框架法之一。NSTC 任主管机关；编入 7 项国际通用原则；要求行政院设立"国家 AI 战略特别委员会"；MODA 建立风险分级框架；高风险 AI 应用须标识；劳工权利受保障。实施时间表：3 个月内未成年人 / 人权 / 性别影响评估，6 个月内政府 AI 用例风险评估，12 个月内政府 AI 使用规则，24 个月内修订相关法规。判断：与新加坡的"自愿守则 + AI Verify 工具"不同，台湾走 EU 式"框架法 + 子法规细则"路径——可法律强制但需要 24 个月才能完全落地，期间监管真空仍存在。',
        analysisKo:
          '《AI 기본법》은 2025년 12월 23일 입법원 3독에서 통과되었으며, 2026년 1월 14일 라이칭더 대통령이 서명하여 효력을 발생했습니다. 이는 아시아에서 법률 강제력을 갖춘 AI 기본법 중 하나입니다. NSTC가 주무 기관입니다. 7개 국제 통용 원칙을 포함하며, 행정원이 「국가 AI 전략 특별 위원회」를 설립하도록 요구합니다. MODA는 위험 등급 프레임워크를 구축합니다. 고위험 AI 응용은 표시가 필요하며, 노동자 권리가 보장됩니다. 실행 일정: 3개월 내 미성년자/인권/성별 영향 평가, 6개월 내 정부 AI 사용 사례 위험 평가, 12개월 내 정부 AI 사용 규칙, 24개월 내 관련 규정 수정. 판단: 싱가포르의 「자발적 가이드라인 + AI Verify 도구」와 달리, 대만은 EU식 「프레임워크법 + 하위 규정 상세」 경로를 따릅니다. 법률 강제력이 있지만 완전히 시행되려면 24개월이 필요하며, 그 기간 동안 규제 공백이 여전히 존재합니다.',
        analysisJa:
          '『AI 基本法』は 2025 年 12 月 23 日に立法院で三読可決、2026 年 1 月 14 日に賴清徳総統の署名発効を得て、アジアの少数派の法的強制力を持つ AI 枠組み法の 1 つです。NSTC が主管機関を任じられ；7 項目の国際通用原則を組み込み；行政院に「国家 AI 戦略特別委員会」の設置を要求；MODA がリスク段階化フレームワークを構築；高リスク AI アプリケーションは表示が必須；労働者権が保護されます。実施スケジュール：3 カ月以内に未成年者 / 人権 / ジェンダー影響評価、6 カ月以内に政府 AI ユースケースのリスク評価、12 カ月以内に政府 AI 使用ルール、24 カ月以内に関連法規の改訂。判断：シンガポールの「自主的ガイドライン + AI Verify ツール」と異なり、台湾は EU 式「枠組み法 + サブ法規細則」路線を選択——法的強制は可能ですが、24 カ月の窓口を要するため、この期間中は企業は実質上「自主的コンプライアンス」で運営される；台湾ガバナンスの「硬度」は 2027 年に見て初めて本当に表れます。',
        analysisEn:
          'The AI Basic Act passed its third reading at the Legislative Yuan on 23 December 2025 and was promulgated by President Lai Ching-te on 14 January 2026 — one of Asia\'s rare enforceable AI framework laws. NSTC is the competent authority; seven international principles are codified; the Executive Yuan must set up a National AI Strategy Special Committee; MODA must build a risk-classification framework; high-risk AI applications must be labelled; labour rights are safeguarded. Implementation timeline: minors/human-rights/gender impact assessment within 3 months; government AI use-case risk assessments within 6 months; government AI usage rules within 12 months; relevant statutes aligned within 24 months. Assessment: Taiwan chose the EU-style "framework law + secondary regulations" path rather than Singapore\'s "voluntary code + AI Verify". It is legally binding but takes 24 months to land, leaving an interim regulatory gap.',
        sources: [
          {
            label: 'AI Basic Act 通过（Focus Taiwan）',
            labelKo: 'AI Basic Act 통과(Focus Taiwan)',
            labelJa: 'AI Basic Act 可決（Focus Taiwan）',
            labelEn: 'AI Basic Act passed (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
          {
            label: 'AI Basic Act 通过（Taiwan News）',
            labelKo: 'AI Basic Act 통과(Taiwan News)',
            labelJa: 'AI Basic Act 可決（Taiwan News）',
            labelEn: 'AI Basic Act passed (Taiwan News)',
            url: 'https://www.taiwannews.com.tw/news/6270744',
            date: '2025-12-23',
          },
        ],
      },
      'investment-1': {
        analysis:
          '"AI 岛"总体计划是台湾 AI 战略的最高层叙事，从 2017 年蔡英文政府提出到 2025 年赖清德政府升级为十大 AI 基础建设。NT$1000 亿是早期累计承诺数（约 US$31 亿，多年期），覆盖 AI 创新研究中心、半导体研发、人才培养、产业辅导多条线。2025 年的十大 AI 基础建设是 AI 岛叙事的具体化版本，规模上扩到 NT$1.5 兆。判断："AI 岛"作为政策框架名是延续性的，但具体投资数字在不同时期口径不一致——追踪台湾 AI 投入需逐年看 AI 行动计划预算（FY23-25 累计 NT$420 亿才是 hard number）和十大基建分年支出，不能用"AI 岛 NT$1000 亿"作为单一统计。',
        analysisKo:
          '「AI 아일랜드」 전체 계획은 대만 AI 전략의 최상위 서사이며, 2017년 차이잉원 정부가 제시한 것에서 2025년 라이칭더 정부가 10대 AI 기초 건설로 업그레이드했습니다. NT$1000억은 초기 누적 약정액(약 US$31억, 다년도)이며, AI 혁신 연구센터, 반도체 R&D, 인재 양성, 산업 지원 등 여러 분야를 포함합니다. 2025년의 10대 AI 기초 건설은 「AI 아일랜드」 서사의 구체화 버전이며, 규모상 NT$1.5조로 확대됩니다. 판단: 「AI 아일랜드」는 정책 프레임워크 이름으로서 지속성이 있지만, 구체적인 투자 수치는 서로 다른 시기에 기준이 일관되지 않습니다. 대만의 AI 투입을 추적하려면 매년 AI 행동 계획 예산(FY23-25 누적 NT$420억이 정확한 수치)과 10대 기초건설 연도별 지출을 살펴봐야 하며, 「AI 아일랜드 NT$1000억」을 단일 통계로 사용할 수 없습니다.',
        analysisJa:
          '「AI アイランド」総合計画は台湾 AI 戦略の最高レベルの叙事で、2017 年の蔡英文政府の提起から 2025 年の賴清徳政府の十大 AI 基礎建設へのアップグレードまで続いています。NT$1000 億は初期段階の累計コミットメント（約 US$31 億、複数年にわたる）で、AI イノベーション研究センター、半導体研究開発、人材育成、産業支援の複数ラインをカバーしています。2025 年の十大 AI 基礎建設は「AI アイランド」叙事の具体化版であり、規模は NT$1.5 兆まで拡大しました。判断：「AI アイランド」をポリシーフレームワーク名として延続性がありますが、具体的な投資数字は異なる時期で計測方法の一貫性がない——台湾の AI 投入を追跡するには毎年の AI 行動計画予算（FY23-25 累計 NT$420 億が硬い数字）と十大基建の分年支出を見る必要があり、「AI アイランド NT$1000 億」を単一統計として使用することはできません。',
        analysisEn:
          'The "AI Island" master plan is the top narrative layer of Taiwan\'s AI strategy, from the Tsai Ing-wen government\'s 2017 proposal to the Lai Ching-te government\'s 2025 upgrade into the Ten Major AI Infrastructure Projects. The NT$100bn figure is an early cumulative commitment (~US$3.1bn, multi-year) covering AI Innovation Research Centres, semiconductor R&D, talent pipelines, and industrial mentorship. The 2025 Ten Major package operationalises the AI Island narrative at NT$1.5 trillion scale. Assessment: "AI Island" is a durable policy frame, but the underlying investment numbers shift between phases — tracking Taiwan\'s AI commitment requires reading the AI Action Plan FY23-25 line (NT$42bn — the hard number) plus annual disbursements under the Ten Major plan. "AI Island NT$100bn" is a slogan, not a single statistic.',
        sources: [
          {
            label: 'AI Taiwan Action Plan（Executive Yuan）',
            labelEn: 'AI Taiwan Action Plan (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
          {
            label: '十大 AI 基础建设（RTI）',
            labelKo: '10대 AI 기초 건설(RTI)',
            labelJa: '十大 AI 基礎建設（RTI）',
            labelEn: 'Ten Major AI Infrastructure (RTI)',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
        ],
      },
      'investment-2': {
        analysis:
          '2026 年度 AI 预算 NT$300 亿（约 US$10 亿），由行政院在 2025 年提出。这是 AI 行动计划 2.0 + 十大基建的合并年度数字（vs FY25 NT$157 亿，+90% YoY）。预计支出包括：AI 算力中心扩容、人才培养、产业 AI 应用辅导、AI 基本法实施初期成本（含 NSTC 主管机关运行、MODA 风险分级框架）。判断：年度预算翻倍是政策意图加速的强信号——但行政预算 ≠ 实际支出，台湾历年政府支出执行率经常不到 90%，需观察 FY26 实际拨款落实节奏。',
        analysisKo:
          '2026년도 AI 예산 NT$300억(약 US$10억)은 행정원이 2025년에 제출했습니다. 이는 AI 행동 계획 2.0 + 10대 기초건설의 합산 연도 수치입니다(FY25 NT$157억 대비 +90% YoY). 예상 지출에는 AI 컴퓨팅 파워 센터 확충, 인재 양성, 산업 AI 응용 지원, AI 기본법 초기 시행 비용(NSTC 주무기관 운영, MODA 위험 분류 프레임워크 포함)이 포함됩니다. 판단: 연도 예산이 두 배가 된 것은 정책 의도 가속화의 강한 신호입니다. 다만 행정 예산 ≠ 실제 지출이므로, 대만의 역년 정부 지출 집행률이 종종 90% 미만이기 때문에 FY26 실제 배정 이행 속도를 관찰할 필요가 있습니다.',
        analysisJa:
          '2026 年度 AI 予算 NT$300 億（約 US$10 億）は行政院が 2025 年に提出、AI 行動計画 2.0 + 十大基建の統合年度数字です（対比 FY25 NT$157 億、+90% 前年同期比）。予定支出には：AI 計算力センターの容量拡張、人材育成、産業 AI アプリケーション支援、AI 基本法実施初期コスト（NSTC 主管機関運営、MODA リスク段階化フレームワークを含む）が含まれます。判断：年度予算の倍増は政策加速意図の強いシグナル——ただし行政予算 ≠ 実支出、台湾の歴史的政府支出執行率はしばしば 90% 以下なので、FY26 の実配分落ち着きペースの観察が必要です。',
        analysisEn:
          "Taiwan's FY26 dedicated AI budget is NT$30bn (~US$1bn), proposed by the Executive Yuan in 2025. It is the merged annual line for AI Action Plan 2.0 + the Ten Major plan (vs FY25 NT$15.7bn, +90% YoY). Expected spending: AI compute centre expansion, talent pipeline, industrial AI mentorship, AI Basic Act early implementation costs (NSTC competent-authority operations, MODA risk-classification framework). Assessment: doubling the annual budget is a strong signal of policy acceleration — but appropriated ≠ disbursed; Taiwan's actual execution rate has historically been below 90%, so FY26 disbursement cadence is the key signal to track.",
        sources: [
          {
            label: '十大 AI 基础建设（Taipei Times，含 NT$300 亿数字）',
            labelKo: '10대 AI 기초 건설(Taipei Times, NT$300억 수치 포함)',
            labelJa: '十大 AI 基礎建設（Taipei Times、NT$300 億数字を含む）',
            labelEn: 'Ten Major AI Infrastructure (Taipei Times, NT$30bn figure)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
        ],
      },
      'investment-3': {
        analysis:
          'AI 创业计划 NT$100 亿（约 US$3.3 亿）作为风险投资支持，扶持新创企业。这部分资金通常通过国发会的"国家级新创基金"或 NSTC 旗下计划流向 AI 创业团队。判断：NT$100 亿对台湾 VC 体量来说是不小的注入（2024 年台湾 VC 总投资约 NT$300 亿），但创业生态本身偏硬件 / IC / 半导体，纯软件 AI 创业仍偏弱。这笔钱能否真正催生几家本土 AI 软件独角兽，是观察台湾"软件追赶"成效的关键变量。',
        analysisKo:
          'AI 창업 계획 NT$100억(약 US$3.3억)은 위험 자본 지원으로 신흥 기업을 지원합니다. 이 자금은 일반적으로 국가발전위원회의 「국가급 신창업 기금」 또는 NSTC 산하 계획을 통해 AI 창업 팀으로 흘러갑니다. 판단: NT$100억은 대만 VC 규모 면에서 적지 않은 투입입니다(2024년 대만 VC 총 투자는 약 NT$300억). 다만 창업 생태계 자체가 하드웨어/IC/반도체에 편중되어 있으며, 순수 소프트웨어 AI 창업은 여전히 약한 상태입니다. 이 자금이 2026-2028년에 정말로 소수의 본토 AI 소프트웨어 유니콘을 배출할 수 있는지는 대만 「소프트웨어 추격」 성과를 관찰하는 핵심 변수입니다.',
        analysisJa:
          'AI スタートアップ計画 NT$100 億（約 US$3.3 億）はリスク投資支援として、新興企業を扶助します。この部分の資金は通常、国発会の「国家レベル新興基金」または NSTC 傘下の計画を通じて AI スタートアップチームへ流入します。判断：NT$100 億は台湾 VC 体量に対して小さくない注入（2024 年台湾 VC 総投資約 NT$300 億）ですが、起業生態そのものはハードウェア / IC / 半導体に偏り、純粋ソフトウェア AI 起業は依然として弱いです。この資金が本当に数社の本土 AI ソフトウェアユニコーン企業を生み出せるかどうかが、台湾「ソフトウェア追い上げ」効果の観察における鍵となる変数です。',
        analysisEn:
          "Taiwan's NT$10bn (~US$330m) AI Startup Programme is a venture-capital support line for new ventures. The funds typically flow via the NDC's National Startup Fund or NSTC programmes to AI startup teams. Assessment: NT$10bn is a significant injection relative to Taiwan VC scale (total Taiwan VC investment ran ~NT$30bn in 2024), but the local startup ecosystem is hardware / IC / semiconductor heavy; pure-software AI startups remain weak. Whether this fund actually produces a couple of homegrown AI software unicorns is the key variable for assessing Taiwan's \"software catch-up\".",
        sources: [
          {
            label: '十大 AI 基础建设：含 NT$100 亿 venture（Taipei Times）',
            labelKo: '10대 AI 기초 건설: NT$100억 venture 포함(Taipei Times)',
            labelJa: '十大 AI 基礎建設：NT$100 億 venture を含む（Taipei Times）',
            labelEn: 'Ten Major AI Infrastructure: NT$100bn VC line (Taipei Times)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
        ],
      },
      'initiative-1': {
        analysis:
          'TSMC 先进制程是台湾 AI 战略的"非政策"基础——TSMC 在 3nm（2024 量产）、2nm（2025 试产）等先进 AI 芯片制造上事实独占。NVIDIA H100 / B200、AMD MI300、Apple M 系列、Tesla AI 芯片都由 TSMC 制造。资本支出：FY24 ~US$320 亿、FY25 ~US$420 亿（计划值），远超政府所有 AI 直投总和。判断：TSMC 不是台湾政府的 AI 项目，但它的存在让台湾在全球 AI 供应链中拥有不可替代地位。这是新加坡完全没有的资产；新加坡只能通过"governance leadership + 枢纽地位"间接补位。台湾 AI 政策本身效率高低不影响 TSMC 在 AI 制造端的事实垄断。',
        analysisKo:
          'TSMC 선단 공정은 대만 AI 전략의 「비정책」 기초입니다. TSMC는 3nm(2024년 양산), 2nm(2025년 시제) 등 선단 AI 칩 제조에서 사실상 독점하고 있습니다. NVIDIA H100/B200, AMD MI300, Apple M 시리즈, Tesla AI 칩 모두 TSMC가 제조합니다. 자본 지출: FY24 ~US$320억, FY25 ~US$420억(계획값)이며, 정부의 모든 AI 직접 투자 합계를 훨씬 초과합니다. 판단: TSMC는 대만 정부의 AI 프로젝트가 아니지만, 그 존재로 인해 대만은 글로벌 AI 공급망에서 대체 불가능한 지위를 갖습니다. 이는 싱가포르가 전혀 가진 자산이 아닙니다. 싱가포르는 「거버넌스 리더십 + 허브 지위」로만 간접 보완할 수 있습니다. 대만 AI 정책 자체의 효율 높낮이는 TSMC의 AI 제조 분야 사실상 독점에 영향을 주지 않습니다.',
        analysisJa:
          'TSMC 先進プロセスは台湾 AI 戦略の「非政策」基礎——TSMC は 3nm（2024 年量産）、2nm（2025 年試験生産）などの先進的な AI チップ製造で事実上独占しています。NVIDIA H100 / B200、AMD MI300、Apple M シリーズ、Tesla AI チップすべてが TSMC で製造されています。資本支出：FY24 約 US$320 億、FY25 約 US$420 億（計画値）で、政府すべての AI 直投の合計をはるかに上回ります。判断：TSMC は台湾政府の AI プロジェクトではありませんが、その存在は台湾にグローバル AI サプライチェーンで不可替代な地位を持たせます。これはシンガポールが全く持たない資産です；シンガポールはただ「ガバナンスリーダーシップ + ハブ地位」を通じてのみ間接的に補位できます。台湾 AI 政策そのものの効率の高低は TSMC の AI 製造端での事実上の独占に影響しません。',
        analysisEn:
          "TSMC's advanced-node manufacturing is the \"non-policy\" foundation of Taiwan's AI strategy — TSMC holds de facto monopoly on advanced AI chips at 3 nm (mass production from 2024) and 2 nm (risk production from 2025). NVIDIA H100 / B200, AMD MI300, Apple's M-series, and Tesla AI chips are all TSMC-fabbed. Capex: ~US$32bn in FY24, ~US$42bn planned for FY25 — exceeding Taiwan's entire government AI commitment combined. Assessment: TSMC is not a government AI programme, but its presence gives Taiwan an irreplaceable position in the global AI supply chain. Singapore has no comparable asset; it can only fill the gap indirectly via governance leadership and hub status. Taiwan's policy efficiency does not change TSMC's manufacturing-side de facto monopoly.",
        sources: [
          {
            label: '十大 AI 基础建设（含 TSMC 角色）',
            labelKo: '10대 AI 기초 건설(TSMC 역할 포함)',
            labelJa: '十大 AI 基礎建設（TSMC の役割を含む）',
            labelEn: 'Ten Major AI Infrastructure (including TSMC role)',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
          {
            label: 'AI Taiwan Action Plan（Executive Yuan）',
            labelEn: 'AI Taiwan Action Plan (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
        ],
      },
      'initiative-2': {
        analysis:
          '国家高速网络与计算中心（NCHC）是台湾政府最高级算力机构，由 NARLabs（国家实验研究院）运营，挂在 NSTC 之下。NCHC 在 AI 时代的核心任务是为学界和产业提供 AI 训练算力。"台湾杉系列"超级计算机是其旗舰，AI 算力升级是 AI 行动计划 2.0 的重点子项。判断：NCHC 的"AI 算力"角色相当于新加坡 NRF 的 NSCC（国家超算中心）+ AISG 的算力补贴混合体——同时承担硬件运营和补贴分配。但 NCHC 公开透露的算力数字远低于香港 Cyberport AISC 的 3000 PFLOPS，台湾在政府级 AI 算力的"硬指标"上需要明显加码。',
        analysisKo:
          '국가 고속 네트워크 및 컴퓨팅 센터(NCHC)는 대만 정부 최고 수준의 컴퓨팅 파워 기관이며, NARLabs(국가실험연구원)가 운영하고 NSTC에 속합니다. NCHC의 AI 시대 핵심 임무는 학계 및 산업에 AI 훈련 컴퓨팅 파워를 제공하는 것입니다. 「대만 삼나무 시리즈」 슈퍼컴퓨터가 그 주력이며, AI 컴퓨팅 파워 업그레이드는 AI 행동 계획 2.0의 중점 세부 항목입니다. 판단: NCHC의 「AI 컴퓨팅 파워」 역할은 싱가포르 NRF의 NSCC(국가 슈퍼컴퓨팅 센터) + AISG 컴퓨팅 파워 보조금의 혼합과 상당합니다. 동시에 하드웨어 운영과 보조금 배분을 담당합니다. 다만 NCHC가 공개적으로 밝힌 컴퓨팅 파워 수치는 홍콩 Cyberport AISC의 3000 PFLOPS보다 훨씬 낮으므로, 대만은 정부 수준 AI 컴퓨팅 파워의 「하드 지표」에서 명백한 증강이 필요합니다.',
        analysisJa:
          '国家高速ネットワーク・計算センター（NCHC）は台湾政府の最高級演算力機関であり、NARLabs（国家実験研究院）が運営、NSTC 傘下に属します。AI 時代の NCHC のコア任務は学界と産業に AI 訓練演算力を提供することです。「Taiwan Supercomputer シリーズ」は旗艦機で、AI 演算力アップグレードは AI 行動計画 2.0 の重点サブアイテムです。判断：NCHC の「AI 演算力」役割はシンガポール NRF の NSCC（国家スーパーコンピュータセンター）+ AISG の演算力補助の混合体に相当——同時にハードウェア運営と補助配分を担当します。しかし NCHC が公表した演算力数字は香港 Cyberport AISC の 3000 PFLOPS より遠かに低く、台湾は政府レベル AI 演算力の「ハード指標」で明らかな増力が必要です。',
        analysisEn:
          "The National Center for High-Performance Computing (NCHC), operated by NARLabs (National Applied Research Laboratories) under NSTC, is Taiwan's top public compute facility. In the AI era, NCHC's core mission is supplying training compute to academia and industry. The \"Taiwania\" supercomputer series is its flagship, and AI compute upgrade is a priority sub-line within AI Action Plan 2.0. Assessment: NCHC plays a role roughly equivalent to Singapore's NSCC + AISG compute subsidies combined — handling both hardware operations and grant disbursement. But publicly disclosed NCHC compute is well below Hong Kong Cyberport AISC's 3 000 PFLOPS target, indicating Taiwan needs a clearer step-up in public AI compute.",
        sources: [
          {
            label: 'AI Taiwan Action Plan 2.0（Executive Yuan）',
            labelEn: 'AI Taiwan Action Plan 2.0 (Executive Yuan)',
            url: 'https://english.ey.gov.tw/News3/9E5540D592A5FECD/1dec0902-e02a-49c6-870d-e77208481667',
          },
          {
            label: '十大 AI 基础建设：含算力中心',
            labelKo: '10대 AI 기초 건설: 컴퓨팅 파워 센터 포함',
            labelJa: '十大 AI 基礎建設：計算力センターを含む',
            labelEn: 'Ten Major AI Infrastructure: includes compute centres',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
        ],
      },
      'initiative-3': {
        analysis:
          'AI 基本法立法是台湾 2025 年 AI 治理最大事件——12 月 23 日立法院三读通过，2026 年 1 月 14 日总统签署生效。立法过程历经 2024 年初版草案、2025 年多轮辩论、跨党派妥协（民进党推促进 + 国民党推规范，最终定稿是"原则框架法 + 24 个月细则窗口"）。判断：立法成功本身比新加坡走得远——新加坡至今没有正式 AI 法律。但执行落地是另一回事：24 个月窗口意味着 2027 年底前都是过渡期，在此期间企业实质上仍按"自愿合规"运行；台湾治理"硬度"是 2027 年看才能真正显现。',
        analysisKo:
          'AI 기본법 입법은 대만 2025년 AI 거버넌스 최대 사건입니다. 12월 23일 입법원 삼독 통과, 2026년 1월 14일 총통 서명으로 발효했습니다. 입법 과정은 2024년 초안, 2025년 다중 토론, 여야 타협(민진당은 촉진을, 국민당은 규범을 추진했으며, 최종 확정본은 「원칙 프레임워크법 + 24개월 세부 규칙 기간」)을 거쳤습니다. 판단: 입법 성공 자체는 싱가포르보다 진전된 것입니다. 싱가포르는 지금까지 정식 AI 법률이 없습니다. 다만 집행 이행은 다른 문제입니다. 24개월 기간은 2027년 말까지 과도기라는 뜻이므로, 이 기간 기업은 실질적으로 「자발적 준수」로 운영됩니다. 대만 거버넌스 「경도」는 2027년을 봐야만 진정으로 나타납니다.',
        analysisJa:
          'AI 基本法立法は台湾 2025 年 AI ガバナンスの最大イベント——12 月 23 日に立法院で三読可決、2026 年 1 月 14 日に総統の署名発効。立法プロセスは 2024 年初版ドラフト、2025 年複数ラウンドの討論、超党派の妥協（民進党が推進、国民党が規範化を推し、最終案は「原則枠組み法 + 24 カ月細則窓口」）を経ています。判断：立法の成功そのものはシンガポールより先に進む——シンガポールは今のところ正式な AI 法律がありません。しかし実行落ち着きは別の問題です：24 カ月の窓口は 2027 年末までは過渡期を意味し、この期間中企業は実質上も「自主的コンプライアンス」で運営；台湾ガバナンスの「硬度」は 2027 年に見て初めて本当に表れます。',
        analysisEn:
          'The AI Basic Act legislation is Taiwan\'s biggest 2025 AI governance event — passed at third reading on 23 December and promulgated by the President on 14 January 2026. The drafting process went through an early-2024 draft, multiple debate rounds in 2025, and cross-party compromise (DPP pushed promotion, KMT pushed regulation; the final text is a "principles framework + 24-month rule-making window"). Assessment: simply passing the law puts Taiwan ahead of Singapore — Singapore still has no formal AI statute. But execution is another story: the 24-month window means the period to end of 2027 is transitional, during which firms effectively operate on "voluntary compliance". Taiwan\'s governance "hardness" only fully materialises by 2027.',
        sources: [
          {
            label: 'AI Basic Act 通过（Focus Taiwan）',
            labelKo: 'AI Basic Act 통과(Focus Taiwan)',
            labelJa: 'AI Basic Act 可決（Focus Taiwan）',
            labelEn: 'AI Basic Act passed (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
          {
            label: 'AI Basic Act 通过（Taiwan News）',
            labelKo: 'AI Basic Act 통과(Taiwan News)',
            labelJa: 'AI Basic Act 可決（Taiwan News）',
            labelEn: 'AI Basic Act passed (Taiwan News)',
            url: 'https://www.taiwannews.com.tw/news/6270744',
            date: '2025-12-23',
          },
        ],
      },
      'initiative-4': {
        analysis:
          '十大 AI 基础建设是 2025 年 7 月行政院公布的台湾迄今规模最大的 AI 公共投入，规划：NT$1.5 兆 / 2025-2040 / NT$15 兆产值目标 / 50 万 AI 应用人才。三大领域：智慧应用、核心技术、基础设施。三大核心技术：硅光子、量子科技、AI 机器人。具体项目：南部柳营智慧机器人园区、台南沙仑研究中心、六甲创新应用基地、AI 算力中心扩容。判断：十大基建是台湾把"AI 政策"从"小预算行动计划"升级到"国家级长期工程"的转折点。但 NT$1.5 兆分 15 年（约 NT$1000 亿/年）需跨届政府持续承诺，赖清德任期到 2028 年，2029 年后能否续是政治变量。',
        analysisKo:
          '10대 AI 기초 건설은 2025년 7월 행정원이 공포한 대만 역대 규모 최대의 AI 공공 투입입니다. 계획: NT$1.5조 / 2025-2040 / NT$15조 산출액 목표 / 50만 AI 응용 인재. 세 대 영역: 스마트 응용, 핵심 기술, 기초 인프라. 세 대 핵심 기술: 실리콘 포토닉, 양자 기술, AI 로봇. 구체적 프로젝트: 남부 류잉 스마트 로봇 산업원, 타이난 사롱 연구센터, 육감 혁신 응용 기지, AI 컴퓨팅 파워 센터 확충. 판단: 10대 기초건설은 대만이 「AI 정책」을 「소규모 예산 행동 계획」에서 「국가 수준 장기 공정」으로 업그레이드하는 전환점입니다. 다만 NT$1.5조를 15년에 분산하면(약 NT$1000억/년) 여러 정부의 지속 약속이 필요하며, 라이칭더 임기는 2028년까지이므로 2029년 이후 지속 여부는 정치적 변수입니다.',
        analysisJa:
          '「10大 AI インフラ整備」は2025年7月に行政院が発表した台湾史上最大規模の AI 公共投資であり、以下を計画しています：NT$1.5兆 / 2025-2040 / NT$15兆の産業額目標 / 50万人の AI アプリケーション人材。3つの主要領域：スマートアプリケーション、コア技術、インフラストラクチャ。3つの主要コア技術：シリコンフォトニクス、量子技術、AI ロボット。具体的なプロジェクト：南部柳営スマートロボット産業園区、台南沙仑研究センター、六甲イノベーション応用基地、AI 算力センター拡張。判断：10大インフラ整備は、台湾が「AI 政策」を「小規模予算行動計画」から「国家級長期プロジェクト」へアップグレードする転換点です。ただし、NT$1.5兆を15年に分割（年約 NT$1000億）することは、複数届の政府による継続的なコミットメントが必要であり、賴清德の任期は2028年までで、2029年以降の継続は政治的変数です。',
        analysisEn:
          'The Ten Major AI Infrastructure Projects, announced by the Executive Yuan in July 2025, are Taiwan\'s largest-ever public AI commitment — NT$1.5 trillion over 2025-2040, targeting NT$15 trillion in output and 500 000 trained AI practitioners. Three domains: smart applications, core technologies, infrastructure. Three core technologies: silicon photonics, quantum, AI robotics. Concrete projects: Liuying smart robotics park, Shalun research centre, Liujia innovation hub, expanded AI compute centres. Assessment: this is the inflection point where "AI policy" upgrades from "small-budget action plans" to "national long-term programme". But NT$1.5 trillion over 15 years (~NT$100bn/year) requires multi-administration continuity — President Lai\'s term ends 2028, and continuity past 2029 is a political variable.',
        sources: [
          {
            label: '十大 AI 基础建设公告（RTI）',
            labelKo: '10대 AI 기초 건설 공고(RTI)',
            labelJa: '十大 AI 基礎建設発表（RTI）',
            labelEn: 'Ten Major AI Infrastructure announcement (RTI)',
            url: 'https://www.rti.org.tw/en/news?uid=3&pid=189786',
            date: '2025-07-22',
          },
          {
            label: '行政院方案细节（Taipei Times）',
            labelKo: '행정원 방안 세부 사항(Taipei Times)',
            labelJa: '行政院方案の詳細（Taipei Times）',
            labelEn: 'Plan details (Taipei Times)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
        ],
      },
      'initiative-5': {
        analysis:
          'AI 创业生态系培育主要由 NDC（国家发展委员会）国家级新创基金 + NSTC AI 创业计划（NT$100 亿）+ MODA 数字产业署辅导计划组成。台湾创业生态偏硬件 / IC，过去 5 年纯 AI 软件创业不算活跃，2024-25 在十大 AI 基建带动下有所回升。代表案例：iKala（行销 AI）、Cubo AI（家庭安全 AI 摄像头）、Appier（市场营销 AI）。判断：相对新加坡的"创业枢纽 + 跨境资本"模式，台湾创业生态封闭度更高，国际资本进入门槛大；但本土制造 + 软件结合（如 AI 机器人）有独特优势。NT$100 亿 venture 注入若能在 2026-2028 年孵化出 3-5 家估值 US$5 亿+ 的 AI 软件公司，就算成功。',
        analysisKo:
          'AI 창업 생태계 육성은 주로 NDC(국가발전위원회) 국가급 신창업 기금 + NSTC AI 창업 계획(NT$100억) + MODA 디지털 산업 지원 계획으로 구성됩니다. 대만 창업 생태계는 하드웨어/IC에 편중되어 있으며, 지난 5년간 순수 AI 소프트웨어 창업이 활발하지 않았으나 2024-25년 10대 AI 기초건설 견인으로 어느 정도 회복했습니다. 대표 사례: iKala(마케팅 AI), Cubo AI(가정용 안전 AI 카메라), Appier(마케팅 AI). 판단: 싱가포르의 「창업 허브 + 국경 초월 자본」 모형과 비교하면, 대만 창업 생태계는 폐쇄도가 높으며 국제 자본 진입 장벽이 큽니다. 그러나 본토 제조 + 소프트웨어 결합(예: AI 로봇)은 독특한 우위가 있습니다. NT$100억 venture 투입이 2026-2028년에 US$5억 이상 추정값의 AI 소프트웨어 기업 3-5개를 배출할 수 있다면, 성공으로 평가할 수 있습니다.',
        analysisJa:
          'AI スタートアップエコシステムの育成は、主に NDC（国家発展委員会）の国家級スタートアップ基金 + NSTC AI スタートアップ計画（NT$100億）+ MODA デジタル産業署の指導計画で構成されています。台湾のスタートアップエコシステムはハードウェア / IC に傾斜しており、過去5年間、純粋な AI ソフトウェアスタートアップはそこまで活発ではありませんでしたが、2024-25年に10大 AI インフラ整備の牽引下で回復しました。代表的なケース：iKala（マーケティング AI）、Cubo AI（ホーム安全 AI カメラ）、Appier（マーケティング AI）。判断：シンガポールの「スタートアップハブ+越境資本」モデルと比べると、台湾のスタートアップエコシステムはより高い閉鎖度を持ち、国際資本進入の障壁が大きい。しかし、ローカル製造+ソフトウェア融合（AI ロボットなど）には独自の利点があります。NT$100億のベンチャー注入が2026-2028年に3～5社の評価額 US$5億以上の AI ソフトウェア企業を孵化させることができれば、成功と見なされます。',
        analysisEn:
          "Taiwan's AI startup ecosystem is supported by the NDC's National Startup Fund + NSTC's AI Startup Programme (NT$10bn) + MODA's Administration for Digital Industries mentorship. The local startup pool skews toward hardware / IC; pure AI software entrepreneurship was modest over the past five years but has picked up in 2024-25 under the Ten Major plan tailwind. Representative names: iKala (marketing AI), Cubo AI (family-safety AI cameras), Appier (marketing AI). Assessment: compared with Singapore's \"hub + cross-border capital\" model, Taiwan's startup ecosystem is more closed and international capital has higher entry barriers; but local manufacturing + software combos (e.g. AI robotics) offer a distinct edge. The NT$10bn venture line will be judged successful if it produces 3-5 AI software companies valued at US$500m+ between 2026 and 2028.",
        sources: [
          {
            label: '十大 AI 基础建设含 venture（Taipei Times）',
            labelKo: '10대 AI 기초 건설 venture 포함(Taipei Times)',
            labelJa: '10大 AI インフラ整備はベンチャー投資を含む（Taipei Times）',
            labelEn: 'Ten Major AI Infrastructure includes venture (Taipei Times)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
          {
            label: 'MODA 数字产业辅导',
            labelKo: 'MODA 디지털 산업 지원',
            labelJa: 'MODA デジタル産業指導',
            labelEn: 'MODA Administration for Digital Industries',
            url: 'https://moda.gov.tw/en/',
          },
        ],
      },
      'body-1': {
        analysis:
          '国家科学及技术委员会（NSTC，前身 MOST 科技部）2022 年改组扩权，是台湾 AI 政策最高协调机构。AI 基本法（2025.12）正式把 NSTC 任命为主管机关，意味着 NSTC 从"研究资助分配者"升级为"AI 治理立法主管"。下辖国家实验研究院（NARLabs）运营 NCHC 等技术机构。判断：NSTC 升格为主管机关相当于新加坡 SNDGO 角色（国家级 AI 协调），但 NSTC 同时管研究 + 立法 + 算力，权力集中度比新加坡更高。这种"all-in-one"结构对协调效率好，但对部门间制衡弱。',
        analysisKo:
          '국가과학기술위원회(NSTC, 전신은 과학기술부)는 2022년 개편으로 권한이 확대되었으며, 대만 AI 정책 최고 조율 기구입니다. AI 기본법(2025.12)은 정식으로 NSTC를 주무기관으로 임명했으며, 이는 NSTC가 「연구 자금 배분자」에서 「AI 거버넌스 입법 주무기관」으로 승격했음을 의미합니다. 국가실험연구원(NARLabs)을 산하에 두고 NCHC 등 기술 기구를 운영합니다. 판단: NSTC의 주무기관 승격은 싱가포르 SNDGO 역할과 동등합니다(국가 수준 AI 조율). 다만 NSTC는 동시에 연구 + 입법 + 컴퓨팅 파워를 관리하므로, 권력 집중도가 싱가포르보다 높습니다. 이런 「all-in-one」 구조는 조율 효율에는 좋지만 부처 간 견제에는 약합니다.',
        analysisJa:
          '国家科学及び技術委員会（NSTC、前身は MOST 科学技術部）は2022年に改組・権限拡大され、台湾の AI 政策最高調整機関です。AI 基本法（2025.12）は正式に NSTC を主管機関に任命し、NSTC が「研究資金配分者」から「AI 統治立法主管機関」へアップグレードされたことを意味します。傘下の国家実験研究院（NARLabs）は NCHC などの技術機関を運営しています。判断：NSTC の格上げは、シンガポール SNDGO の役割に相当します（国家級 AI 調整）。ただし、NSTC は同時に研究 + 立法 + 算力を管理するため、権力集中度はシンガポールより高い。この「オールインワン」構造は調整効率に好ましいですが、部門間抑制は弱い。',
        analysisEn:
          'The National Science and Technology Council (NSTC, restructured from the Ministry of Science and Technology in 2022) is Taiwan\'s highest AI-policy coordinating agency. The AI Basic Act (Dec 2025) formally designates NSTC as the competent authority — an upgrade from "research-grant allocator" to "AI-governance lead". NSTC oversees the National Applied Research Laboratories (NARLabs), which operates NCHC and related technical bodies. Assessment: NSTC\'s elevation is analogous to Singapore SNDGO\'s national AI-coordination role, but NSTC simultaneously owns research, legislation, and compute — power is more concentrated than Singapore\'s. This "all-in-one" structure helps coordination but weakens inter-agency checks.',
        sources: [
          {
            label: 'NSTC 官网',
            labelKo: 'NSTC 공식 웹사이트',
            labelJa: 'NSTC 公式ウェブサイト',
            labelEn: 'NSTC official site',
            url: 'https://www.nstc.gov.tw/?l=en',
          },
          {
            label: 'AI Basic Act 任命 NSTC 为主管机关',
            labelKo: 'AI Basic Act NSTC를 주무기관으로 임명',
            labelJa: 'AI 基本法が NSTC を主管機関に任命',
            labelEn: 'AI Basic Act designates NSTC as competent authority',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
        ],
      },
      'body-2': {
        analysis:
          '数位发展部（MODA，Ministry of Digital Affairs）2022 年成立，是台湾首个数字事务专门部会。AI 相关职能：(1) 数字产业辅导（含 AI 创业）；(2) AI 基本法风险分级框架建设；(3) 数据治理与开放数据政策；(4) 数字 ID（My T MoF / 数位身分证）。判断：MODA 角色对标韩国 MSIT、新加坡 IMDA + SNDGO 合体。AI 基本法把"风险分级框架"分配给 MODA 而非 NSTC，意味着治理执行落到 MODA 头上——这是 NSTC（政策制定）与 MODA（治理执行）的明确分工。但 MODA 成立才 4 年（2022-2026），机构成熟度仍在建设期。',
        analysisKo:
          '디지털발전부(MODA, Ministry of Digital Affairs)는 2022년 설립되었으며, 대만 최초의 디지털 업무 전담 부입니다. AI 관련 직능: (1) 디지털 산업 지원(AI 창업 포함); (2) AI 기본법 위험 분류 프레임워크 구축; (3) 데이터 거버넌스 및 공개 데이터 정책; (4) 디지털 신원증명(My T MoF / 디지털 신원증). 판단: MODA 역할은 한국 MSIT, 싱가포르 IMDA + SNDGO 합체에 대응합니다. AI 기본법이 「위험 분류 프레임워크」를 NSTC가 아닌 MODA에 배정한 것은, 거버넌스 집행이 MODA 책임이라는 뜻입니다. 이는 NSTC(정책 제정) 및 MODA(거버넌스 집행)의 명확한 업무 분담입니다. 다만 MODA는 설립 4년(2022-2026)이므로, 기구 성숙도는 여전히 구축 중입니다.',
        analysisJa:
          'デジタル開発部（MODA、Ministry of Digital Affairs）は2022年に設立され、台湾初のデジタル事務専門部です。AI 関連職能：(1) デジタル産業指導（AI スタートアップを含む）；(2) AI 基本法リスク分級フレームワーク構築；(3) データ統治とオープンデータ政策；(4) デジタル ID（My T MoF / デジタル身分証）。判断：MODA の役割は韓国 MSIT、シンガポール IMDA + SNDGO の統合に対標します。AI 基本法は「リスク分級フレームワーク」を NSTC ではなく MODA に配分し、統治執行が MODA に委ねられることを意味します——これは NSTC（政策制定）と MODA（統治執行）の明確な役割分担です。ただし、MODA は2022年設立からわずか4年（2022-2026）で、機関の成熟度はまだ構築段階です。',
        analysisEn:
          "The Ministry of Digital Affairs (MODA) was established in 2022, Taiwan's first dedicated digital ministry. AI-related functions: (1) digital industry mentorship (including AI startups); (2) building the AI Basic Act's risk-classification framework; (3) data governance and open-data policy; (4) digital ID (My T MoF / Digital ID Card). Assessment: MODA's role maps to Korea's MSIT or a combined Singapore IMDA + SNDGO. The AI Basic Act assigns the risk-classification framework to MODA rather than NSTC, indicating a clear policy / execution split — NSTC sets policy, MODA delivers governance. But MODA is only four years old (2022-2026) and institutional maturity is still building.",
        sources: [
          {
            label: 'MODA 官网',
            labelKo: 'MODA 공식 웹사이트',
            labelJa: 'MODA 公式ウェブサイト',
            labelEn: 'MODA official site',
            url: 'https://moda.gov.tw/en/',
          },
          {
            label: 'AI 基本法分配 MODA 风险分级（Focus Taiwan）',
            labelKo: 'AI 기본법 MODA에 위험 분류 할당(Focus Taiwan)',
            labelJa: 'AI 基本法が MODA にリスク分級を配分（Focus Taiwan）',
            labelEn: 'AI Basic Act assigns risk classification to MODA (Focus Taiwan)',
            url: 'https://focustaiwan.tw/politics/202512230010',
            date: '2025-12-23',
          },
        ],
      },
      'body-3': {
        analysis:
          '国家发展委员会（NDC，National Development Council）是台湾产业政策与跨部门规划机构，主管"国家新创基金"、产业升级方向规划。AI 相关角色：(1) 把 AI 列为国家级战略产业；(2) 与 NSTC、MODA 协调十大 AI 基础建设；(3) 国发基金作为 AI 创业 venture 来源之一。判断：NDC 是"政策协调者"而非"AI 执行者"。在 AI 基本法体系下，NDC 没有被任命为主管机关，但在十大基建跨部会协调中仍有重要角色。这种"非主管但协调"的结构在 AI 时代会逐步弱化——AI 政策正在从产业政策框架（NDC 强项）转向数字治理框架（MODA 主场）。',
        analysisKo:
          '국가발전위원회(NDC, National Development Council)는 대만 산업 정책 및 부처 간 규획 기구이며, 「국가 신창업 기금」과 산업 업그레이드 방향 규획을 주관합니다. AI 관련 역할: (1) AI를 국가급 전략 산업으로 규정; (2) NSTC, MODA와 조율하여 10대 AI 기초건설 추진; (3) 국발 기금을 AI 창업 venture 출처 중 하나로 활용. 판단: NDC는 「정책 조율자」이지 「AI 집행자」가 아닙니다. AI 기본법 체계에서 NDC는 주무기관으로 임명되지 않았지만, 10대 기초건설 부처 간 조율에서는 여전히 중요한 역할을 합니다. 이런 「비주무기관이나 조율」 구조는 AI 시대에 점진적으로 약화될 것입니다. AI 정책이 산업 정책 프레임워크(NDC 강점)에서 디지털 거버넌스 프레임워크(MODA 주장)로 전환되고 있기 때문입니다.',
        analysisJa:
          '国家発展委員会（NDC、National Development Council）は台湾の産業政策と部門間規画機関で、「国家スタートアップ基金」と産業高度化方向の規画を管掌しています。AI 関連役割：(1) AI を国家級戦略産業として位置付け；(2) NSTC、MODA と10大 AI インフラ整備を調整；(3) 国家基金を AI スタートアップベンチャーの資金源の一つとして機能。判断：NDC は「政策調整者」であって「AI 執行機関」ではありません。AI 基本法体系下で、NDC は主管機関に任命されませんでしたが、10大インフラ整備の部門間調整では重要な役割を果たしています。この「非主管だが調整」構造は AI 時代に段階的に弱化します——AI 政策は産業政策フレームワーク（NDC の強み）から数字統治フレームワーク（MODA の本場）へシフトしています。',
        analysisEn:
          "The National Development Council (NDC) is Taiwan's cross-ministry industrial-policy and planning agency, managing the National Startup Fund and industrial-upgrading direction. AI-related roles: (1) designating AI as a national strategic industry; (2) coordinating the Ten Major AI Infrastructure Projects with NSTC and MODA; (3) the NDC fund as a venture source for AI startups. Assessment: NDC is a coordinator, not an AI executor. Under the AI Basic Act, NDC is not the competent authority, but it remains important in cross-ministry coordination on the Ten Major plan. This \"non-lead but coordinating\" role will weaken over time as AI policy migrates from industrial-policy framing (NDC's strength) to digital-governance framing (MODA's home turf).",
        sources: [
          {
            label: '十大 AI 基础建设跨部门协调（Taipei Times）',
            labelKo: '10대 AI 기초 건설 부처 간 조율(Taipei Times)',
            labelJa: '10大 AI インフラ整備の部門間調整（Taipei Times）',
            labelEn: 'Ten Major AI Infrastructure cross-ministry coordination (Taipei Times)',
            url: 'https://www.taipeitimes.com/News/front/archives/2025/07/24/2003840818',
            date: '2025-07-24',
          },
        ],
      },
      'body-4': {
        analysis:
          '金融监督管理委员会（FSC）是台湾金融业最高监管机构。AI 相关职能：(1) 银行 / 保险 / 证券业 AI 应用合规审查；(2) 金融业 GenAI 试点指引（2024 年发布）；(3) 反洗钱、风控、客服 AI 用例的监管沙盒。FSC 与 NSTC（AI 基本法主管）的分工是：FSC 管金融业 AI 监管细则，NSTC 管全国 AI 框架法。判断：FSC 在 AI 治理体系中是"行业子监管"角色，对应新加坡 MAS。台湾金融业 AI 创新（如玉山银行、富邦金）相对积极，但 FSC 的指引仍偏保守——这是台湾"金融保守 + 半导体激进"双轨结构在 AI 时代的延续。',
        analysisKo:
          '금융감독관리위원회(FSC)는 대만 금융업 최고 감독 기구입니다. AI 관련 직능: (1) 은행/보험/증권업 AI 응용 합규 심사; (2) 금융업 GenAI 파일럿 지침(2024년 공포); (3) 반자금세탁, 위험 관리, 고객 서비스 AI 용례의 규제 샌드박스. FSC와 NSTC(AI 기본법 주무기관)의 업무 분담은: FSC가 금융업 AI 감독 세부 규칙을 관리하고 NSTC가 전국 AI 프레임워크법을 관리합니다. 판단: FSC는 AI 거버넌스 체계에서 「산업 부분 감독」 역할이며, 싱가포르 MAS에 대응합니다. 대만 금융업의 AI 혁신(예: 옥산은행, 부방금융)은 상대적으로 적극적이나, FSC의 지침은 여전히 보수적입니다. 이는 대만 「금융 보수 + 반도체 급진」 이원 구조가 AI 시대에도 지속되고 있음을 보여줍니다.',
        analysisJa:
          '金融監督管理委員会（FSC）は台湾金融業の最高監管機関です。AI 関連職能：(1) 銀行 / 保険 / 証券業の AI アプリケーション合規審査；(2) 金融業 GenAI パイロット指引（2024年発布）；(3) マネーロンダリング対策、リスク管理、カスタマーサービス AI ユースケースの監管サンドボックス。FSC と NSTC（AI 基本法主管機関）の役割分担は：FSC は金融業 AI 監管細則を管理、NSTC は全国 AI フレームワーク法を管理します。判断：FSC は AI 統治体系の中で「業界別監管」役割を担い、シンガポール MAS に相当します。台湾金融業の AI イノベーション（玉山銀行、富邦金など）は相対的に積極的ですが、FSC の指引は依然として保守的です——これは台湾の「金融保守+半導体急進」二層構造が AI 時代に続いているあかしです。',
        analysisEn:
          "The Financial Supervisory Commission (FSC) is Taiwan's top financial regulator. AI-related functions: (1) compliance review of AI applications in banking / insurance / securities; (2) GenAI pilot guidelines for the financial industry (issued 2024); (3) regulatory sandbox for AML, risk-management, and customer-service AI use cases. FSC's split with NSTC (AI Basic Act competent authority) is: FSC handles financial-sector AI rules, NSTC handles the national framework. Assessment: FSC plays a sectoral sub-regulator role, mirroring Singapore's MAS. Taiwan's financial AI innovation is active (E.SUN, Fubon), but FSC guidelines remain conservative — a continuation of Taiwan's \"conservative finance + aggressive semiconductors\" dual-track posture into the AI era.",
        sources: [
          {
            label: 'FSC 官网',
            labelKo: 'FSC 공식 웹사이트',
            labelJa: 'FSC 公式ウェブサイト',
            labelEn: 'FSC official site',
            url: 'https://www.fsc.gov.tw/en/',
          },
        ],
      },
    },
  },
  {
    flag: '🇦🇪',
    name: 'UAE',
    nameEn: 'UAE',
    fullName: '阿拉伯联合酋长国',
    fullNameKo: '아랍에미리트연합국',
    fullNameJa: 'アラブ首長国連邦',
    fullNameEn: 'United Arab Emirates',
    overview:
      'UAE 是全球首个设立 AI 部长的国家（2017），通过 $1000 亿 MGX 基金和与微软 $152 亿的合作展现了惊人的资本实力。Falcon LLM 和 MBZUAI 代表了其打造本土 AI 能力的雄心。',
    overviewKo:
      'UAE는 2017년 세계 최초의 AI 장관을 설립한 국가이며, US$1000억 규모 MGX 기금과 Microsoft와의 US$152억 협력을 통해 놀라운 자본력을 보여주었습니다. Falcon LLM과 MBZUAI는 자체 AI 역량을 구축하려는 그들의 야심을 대표합니다.',
    overviewJa:
      'UAE は世界初の AI 大臣を設置した国家（2017）であり、1000億ドルの MGX ファンドとマイクロソフトとの152億ドルの協力を通じて、驚異的な資本力を示しています。Falcon LLM と MBZUAI は、本土 AI 能力構築への野心を表しています。',
    overviewEn:
      'The UAE was the first country in the world to appoint an AI Minister (2017), and has demonstrated formidable capital firepower through the US$100 billion MGX fund and a US$15.2 billion partnership with Microsoft. Falcon LLM and MBZUAI embody its ambition to build sovereign AI capability.',
    strategies: [
      {
        name: 'AI 战略 2031',
        nameKo: 'AI Strategy 2031',
        nameJa: 'AI 戦略 2031',
        nameEn: 'AI Strategy 2031',
        year: '2017',
        description: '全球首批国家 AI 战略之一，目标让 AI 贡献 GDP 的 33.5%',
        descriptionKo: '세계 최초급 국가 AI 전략 중 하나로, AI의 GDP 기여도 목표를 33.5%로 설정했습니다.',
        descriptionJa: '世界初の国家 AI 戦略の一つ、AI が GDP の 33.5% に貢献することを目標とする',
        descriptionEn: "Among the world's earliest national AI strategies; targets AI contributing 33.5% of GDP",
      },
      {
        name: 'AI 伦理准则',
        nameKo: 'AI 윤리 기준',
        nameJa: 'AI 倫理原則',
        nameEn: 'AI Ethics Principles',
        year: '2022',
        description: '自愿性伦理指导方针',
        descriptionKo: '자발적 윤리 지침',
        descriptionJa: '自発的倫理指導方針',
        descriptionEn: 'Voluntary ethical guidelines',
      },
      {
        name: 'AI 宪章',
        nameKo: 'AI 헌장',
        nameJa: 'AI 憲章',
        nameEn: 'AI Charter',
        year: '2024',
        description: '更新版 AI 治理原则',
        descriptionKo: '업데이트된 AI 거버넌스 원칙',
        descriptionJa: '更新版 AI 統治原則',
        descriptionEn: 'Updated AI governance principles',
      },
    ],
    investment: [
      {
        item: 'MGX 基金',
        itemKo: 'MGX 기금',
        itemJa: 'MGX ファンド',
        itemEn: 'MGX Fund',
        amount: '$1000 亿',
        amountKo: 'US$1000억',
        amountJa: '1000億ドル',
        amountEn: 'US$100 billion',
        note: 'AI 专项投资基金',
        noteKo: 'AI 전담 투자 기금',
        noteJa: 'AI 専項投資ファンド',
        noteEn: 'Dedicated AI investment fund',
      },
      {
        item: '微软合作',
        itemKo: 'Microsoft 협력',
        itemJa: 'マイクロソフト協力',
        itemEn: 'Microsoft Partnership',
        amount: '$152 亿',
        amountKo: 'US$152억',
        amountJa: '152億ドル',
        amountEn: 'US$15.2 billion',
        note: '云计算与 AI 基础设施',
        noteKo: '클라우드 컴퓨팅 및 AI 인프라',
        noteJa: 'クラウドコンピューティングと AI インフラストラクチャ',
        noteEn: 'Cloud computing and AI infrastructure',
      },
      {
        item: 'Stargate UAE',
        itemEn: 'Stargate UAE',
        amount: '1GW 数据中心',
        amountKo: '1GW 데이터 센터',
        amountJa: '1GW データセンター',
        amountEn: '1GW data centre',
        note: '与美国合作的超大规模算力项目',
        noteKo: '미국과의 협력 초대형 컴퓨팅 리소스 프로젝트',
        noteJa: '米国との協力による超大規模算力プロジェクト',
        noteEn: 'Hyperscale compute project in partnership with the US',
      },
    ],
    governance:
      'UAE 采取亲创新、轻监管路线，以非约束性的伦理准则和监管沙盒为主要手段。设有全球首位 AI 部长和专门的 AI 办公室，但整体监管框架成熟度不及新加坡的 AI Verify 体系。',
    governanceKo:
      'UAE는 혁신 친화적이고 경량의 규제 노선을 취하고 있으며, 구속력 없는 윤리 기준과 규제 샌드박스를 주요 수단으로 활용합니다. 세계 최초의 AI 장관과 전담 AI 사무실을 갖추고 있지만, 전체 규제 프레임워크의 성숙도는 싱가포르의 AI Verify 체계에 미치지 못합니다.',
    governanceJa:
      'UAE は親イノベーション・軽規制路線を採用し、非拘束的な倫理原則と監管サンドボックスを主な手段としています。世界初の AI 大臣と専門の AI オフィスを設置していますが、全体的な規制フレームワークの成熟度はシンガポール AI Verify 体系に及びません。',
    governanceEn:
      "The UAE pursues a pro-innovation, light-touch regulatory path, relying primarily on non-binding ethical guidelines and regulatory sandboxes. It has the world's first AI Minister and a dedicated AI Office, but its regulatory framework is less mature than Singapore's AI Verify system.",
    keyInitiatives: [
      'Falcon LLM 开源大模型',
      'MBZUAI（穆罕默德·本·扎耶德人工智能大学）',
      'MGX 千亿美元 AI 投资基金',
      'Stargate UAE 超大规模数据中心',
      'AI 部长制度与 AI Office',
    ],
    keyInitiativesEn: [
      'Falcon LLM open-source large model',
      'MBZUAI (Mohamed bin Zayed University of Artificial Intelligence)',
      'MGX US$100 billion AI investment fund',
      'Stargate UAE hyperscale data centre',
      'AI Minister role and the AI Office',
    ],
    strengths: [
      '资本规模远超新加坡——MGX $1000 亿 vs 新加坡政府 S$20 亿+',
      '廉价能源支撑大规模算力',
      'Falcon LLM 展示了本土大模型开发能力',
      'MBZUAI 打造世界级 AI 研究型大学',
    ],
    strengthsEn: [
      'Capital scale far exceeds Singapore — MGX US$100 billion vs Singapore government S$2 billion+',
      'Cheap energy supports large-scale compute',
      'Falcon LLM demonstrates sovereign large-model development capability',
      'MBZUAI builds a world-class AI research university',
    ],
    weaknesses: [
      '严重依赖外籍人才，本土 AI 人才储备不足',
      '地缘政治敏感性（芯片出口管制风险）',
      '监管框架尚不成熟，国际信任度不及新加坡',
      '学术研究底蕴相比新加坡 NUS/NTU 仍有差距',
    ],
    weaknessesEn: [
      'Heavy reliance on foreign talent; weak local AI talent pool',
      'Geopolitical sensitivity (chip export-control risk)',
      'Regulatory framework still immature; lower international trust than Singapore',
      "Academic research depth still trails Singapore's NUS/NTU",
    ],
    keyBodies: [
      {
        name: 'AI 部长',
        nameKo: 'AI 장관',
        nameJa: 'AI 大臣',
        nameEn: 'AI Minister',
        role: '全球首位 AI 内阁部长（Omar Sultan Al Olama）',
        roleKo: '세계 최초의 AI 내각 장관(Omar Sultan Al Olama)',
        roleJa: '世界初の AI 内閣大臣（Omar Sultan Al Olama）',
        roleEn: "World's first AI cabinet minister (Omar Sultan Al Olama)",
      },
      {
        name: 'UAE AI Office',
        nameEn: 'UAE AI Office',
        role: 'AI 政策执行与协调',
        roleKo: 'AI 정책 집행 및 조정',
        roleJa: 'AI 政策執行と調整',
        roleEn: 'AI policy execution and coordination',
      },
      {
        name: 'ATRC（先进技术研究理事会）',
        nameKo: 'ATRC(Advanced Technology Research Council)',
        nameJa: 'ATRC（先進技術研究理事会）',
        nameEn: 'ATRC (Advanced Technology Research Council)',
        role: '前沿技术研发',
        roleKo: '첨단 기술 연구 개발',
        roleJa: '前沿技術研究開発',
        roleEn: 'Frontier technology R&D',
      },
      {
        name: 'Mubadala',
        nameEn: 'Mubadala',
        role: '主权基金，MGX 基金管理者',
        roleKo: '주권 기금, MGX 기금 관리자',
        roleJa: 'ソブリンファンド、MGX ファンド管理者',
        roleEn: 'Sovereign wealth fund; manager of the MGX fund',
      },
    ],
    sources: ['UAE AI Strategy 2031（2017/2021 更新）', 'MGX 基金官方公告（2024）', 'MBZUAI 官网与研究报告'],
    sourcesEn: [
      'UAE AI Strategy 2031 (2017, updated 2021)',
      'MGX Fund official announcements (2024)',
      'MBZUAI website and research reports',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          'UAE 是全球首个把"国家 AI 战略"上升到独立部级建制的国家：(1) 2017 年发布 UAE AI Strategy 2031，目标 AI 贡献 GDP 33.5%（约 US$910 亿）；同年任命全球首位 AI 部长 Omar Al Olama；(2) 2019 年成立全球首所专门 AI 大学 MBZUAI；(3) 2024 年成立 MGX 基金（目标 AUM US$1000 亿，由 G42 + Mubadala 联合控股，Sheikh Tahnoun bin Zayed 任主席）；(4) 同年与微软达成 US$152 亿 AI/云基础设施合作；(5) 与美国合作的 Stargate UAE 1GW 数据中心。判断：UAE 的 AI 战略不是"政策驱动"而是"资本+王室决心驱动"——单 MGX 一个基金就是新加坡所有公开 AI 政府承诺的 50 倍。这种规模优势让 UAE 可以买下 AI 时代的入场券，但买不到 Singapore 那种"trusted hub"的国际信任。',
        analysisKo:
          'UAE는 「국가 AI 전략」을 독립적 부급 조직으로 격상시킨 세계 최초의 국가입니다: (1) 2017년 UAE AI Strategy 2031을 발표했으며, AI의 GDP 기여도를 33.5%(약 US$910억)로 목표 설정했습니다. 같은 해 세계 최초의 AI 장관 Omar Al Olama를 임명했습니다. (2) 2019년 세계 최초의 전담 AI 대학 MBZUAI를 설립했습니다. (3) 2024년 MGX 기금을 설립했습니다(목표 AUM US$1000억, G42와 Mubadala의 공동 지분 구조, Sheikh Tahnoun bin Zayed 회장). (4) 같은 해 Microsoft와 US$152억 규모의 AI/클라우드 인프라 협력에 합의했습니다. (5) 미국과의 협력 Stargate UAE 1GW 데이터 센터. 판단: UAE의 AI 전략은 「정책 주도」가 아니라 「자본 + 왕실 결단 주도」입니다——MGX 기금 하나만 해도 싱가포르의 모든 공개 AI 정부 약속의 50배입니다. 이러한 규모 우위는 UAE가 AI 시대의 진입권은 구입할 수 있게 해주지만, Singapore와 같은 「trusted hub」의 국제적 신뢰는 구입할 수 없습니다.',
        analysisJa:
          'UAE は世界初の「国家 AI 戦略」を独立した部級建制へ引き上げた国家です：(1) 2017年に UAE AI Strategy 2031 を発表し、AI が GDP に33.5%を寄与する目標（約 US$9.1億）を設定；同年、世界初の AI 大臣 Omar Al Olama を任命；(2) 2019年に世界初の専門 AI 大学 MBZUAI を設立；(3) 2024年に MGX ファンド（目標 AUM US$1000億、G42 + Mubadala 合同統括、Sheikh Tahnoun bin Zayed 主席）を設立；(4) 同年マイクロソフトと US$152億の AI/クラウドインフラ協力合意；(5) 米国と協力の Stargate UAE 1GW データセンター。判断：UAE の AI 戦略は「政策駆動」ではなく「資本+王室決心駆動」です——MGX 一つのファンドだけで、シンガポールのすべての公開 AI 政府約束の50倍です。この規模優位により UAE は AI 時代の入場券を買うことができますが、シンガポールのような「信頼できるハブ」の国際信頼は買えません。',
        analysisEn:
          "The UAE is the world's first country to elevate \"national AI strategy\" to a dedicated cabinet-level institution: (1) the AI Strategy 2031 launched in 2017 targets AI contributing 33.5% of GDP (~US$91bn); the same year Omar Al Olama was named the world's first AI Minister; (2) MBZUAI, the world's first dedicated AI university, was founded in 2019; (3) MGX was established in 2024 (targeting AUM of US$100bn, jointly held by G42 + Mubadala and chaired by Sheikh Tahnoun bin Zayed); (4) a US$15.2bn AI/cloud infrastructure partnership with Microsoft was struck the same year; (5) the Stargate UAE 1 GW data centre is being built with US partners. Assessment: the UAE's AI strategy is not policy-driven but capital-plus-royal-resolve-driven — MGX alone is roughly 50x Singapore's publicly disclosed government AI commitments. This scale buys an entry ticket to the AI era, but it cannot buy Singapore's reputation as a \"trusted hub\".",
        sources: [
          {
            label: 'UAE AI Strategy 2031（ai.gov.ae）',
            labelEn: 'UAE AI Strategy 2031 (ai.gov.ae)',
            url: 'https://ai.gov.ae/strategy/',
          },
          {
            label: 'MGX 基金官网',
            labelKo: 'MGX 기금 공식 웹사이트',
            labelJa: 'MGX ファンド公式ウェブサイト',
            labelEn: 'MGX Fund official site',
            url: 'https://www.mgx.ae/en',
          },
          {
            label: 'MGX 基金背景（Wikipedia）',
            labelKo: 'MGX 기금 배경(Wikipedia)',
            labelJa: 'MGX ファンド背景（Wikipedia）',
            labelEn: 'MGX Fund overview (Wikipedia)',
            url: 'https://en.wikipedia.org/wiki/MGX_Fund_Management_Limited',
          },
        ],
      },
      'investment-overview': {
        analysis:
          'UAE 的 AI 投资是全球 AI 资本竞赛中最激进的国家级承诺之一：(1) MGX US$1000 亿目标 AUM（2024 年从 G42 + Mubadala 出资发起，主权基金背书）；(2) 与微软 US$152 亿合作（含 G42 接受微软投资 + Microsoft 在 UAE 建设算力）；(3) BlackRock + GIP + Microsoft + MGX 的全球 AI 基础设施投资伙伴 (Global AI Infrastructure Investment Partnership)，初期承诺 US$300 亿股权，潜在扩至 US$1000 亿；(4) Stargate UAE 1GW 数据中心。判断：MGX 资本量级（目标 US$1000 亿）超过 Microsoft + Google + Meta 三家 2024 全年资本支出之和的 ~30%。但"AUM 目标"≠ 实际部署——目前 MGX 实际投资落地集中在 OpenAI、Anthropic 等单一标的，"千亿规模"叙事需要 3-5 年看实际配置才能验证。',
        analysisKo:
          'UAE의 AI 투자는 세계 AI 자본 경쟁에서 가장 적극적인 국가 수준의 약속 중 하나입니다: (1) MGX US$1000억 목표 AUM(2024년 G42와 Mubadala 출자로 시작, 주권 기금 보증). (2) Microsoft와의 US$152억 협력(G42의 Microsoft 투자 포함 + Microsoft의 UAE 알고리즘 컴퓨팅 인프라 구축). (3) BlackRock + GIP + Microsoft + MGX의 글로벌 AI 인프라 투자 파트너십(Global AI Infrastructure Investment Partnership), 초기 US$300억 주식 약속, 잠재적 확대 시 US$1000억. (4) Stargate UAE 1GW 데이터 센터. 판단: MGX 자본 규모(목표 US$1000억)는 Microsoft + Google + Meta 3사의 2024년 연간 자본 지출 합계의 ~30%를 초과합니다. 그러나 「AUM 목표」≠ 실제 배치——현재 MGX의 실제 투자 실행은 OpenAI, Anthropic 등 단일 대상에 집중되어 있으며, 「1000억 규모」 서사는 3~5년을 더 봐야 실제 배치를 검증할 수 있습니다.',
        analysisJa:
          'UAE の AI 投資は世界の AI 資本競争で最も急進的な国家級約束の一つです：(1) MGX US$1000億目標 AUM（2024年 G42 + Mubadala 出資発起、ソブリンファンド保証）；(2) マイクロソフトとの US$152億協力（G42 がマイクロソフト投資を受け入れる + Microsoft が UAE で算力構築を含む）；(3) BlackRock + GIP + Microsoft + MGX のグローバル AI インフラ投資パートナーシップ、初期約束 US$300億エクイティ、潜在的拡大 US$1000億；(4) Stargate UAE 1GW データセンター。判断：MGX 資本規模（目標 US$1000億）は Microsoft + Google + Meta の2024年全年資本支出合計の ~30%を超えます。しかし「AUM 目標」≠実際の配置——現在 MGX の実際投資配置は OpenAI、Anthropic など単一標的に集中し、「千億規模」ナラティブは3～5年で実際の配置を見て初めて検証できます。',
        analysisEn:
          "The UAE's AI investment is among the world's most aggressive national-level commitments: (1) MGX targets US$100bn AUM (set up in 2024 by G42 + Mubadala with sovereign-fund backing); (2) the US$15.2bn Microsoft partnership (including Microsoft's investment into G42 + Microsoft compute build-out in the UAE); (3) the Global AI Infrastructure Investment Partnership (BlackRock + GIP + Microsoft + MGX), with an initial US$30bn equity commitment scaling to a potential US$100bn; (4) Stargate UAE — a 1 GW data centre. Assessment: MGX's target US$100bn is roughly 30% of Microsoft + Google + Meta combined annual capex in 2024. But \"target AUM\" ≠ actual deployment — MGX's announced deals so far cluster on a few names (OpenAI, Anthropic), and the \"hundred-billion\" narrative needs 3-5 years to verify in actual portfolio allocation.",
        sources: [
          {
            label: 'MGX 基金官网',
            labelKo: 'MGX 기금 공식 웹사이트',
            labelJa: 'MGX ファンド公式ウェブサイト',
            labelEn: 'MGX Fund official site',
            url: 'https://www.mgx.ae/en',
          },
          {
            label: 'BlackRock + GIP + Microsoft + MGX 合作',
            labelKo: 'BlackRock + GIP + Microsoft + MGX 협력',
            labelJa: 'BlackRock + GIP + Microsoft + MGX 協力',
            labelEn: 'BlackRock + GIP + Microsoft + MGX partnership',
            url: 'https://news.microsoft.com/source/2024/09/17/blackrock-global-infrastructure-partners-microsoft-and-mgx-launch-new-ai-partnership-to-invest-in-data-centers-and-supporting-power-infrastructure/',
            date: '2024-09-17',
          },
        ],
      },
      'governance-model': {
        analysis:
          'UAE 治理模式是"亲创新轻监管"：(1) 没有水平性 AI 立法；(2) 主要工具是 2022 年的 AI Ethics Principles 和 2024 年的 AI Charter（更新版治理原则）；(3) 设全球首位 AI 部长（Omar Al Olama）和 UAE AI Office；(4) 行业层面 ATRC（Advanced Technology Research Council）协调研发，监管沙盒为创新留窗口。判断：与新加坡 AI Verify 工具化、可测试方向相比，UAE 的治理是"原则 + 自愿"层级，更接近 SG NAIS 1.0 时代。优势是不增加合规摩擦，劣势是国际企业（特别是欧盟客户）信任度有限——欧盟 AI Act 落地后，UAE 出口型 AI 服务可能需要双轨合规。',
        analysisKo:
          'UAE의 거버넌스 모델은 「혁신 친화적 경량 규제」입니다: (1) 수평적 AI 입법이 없습니다. (2) 주요 도구는 2022년의 AI Ethics Principles와 2024년의 AI Charter(업데이트된 거버넌스 원칙)입니다. (3) 세계 최초의 AI 장관(Omar Al Olama)과 UAE AI Office를 설립했습니다. (4) 산업 수준의 ATRC(Advanced Technology Research Council)가 R&D를 조정하며, 규제 샌드박스가 혁신을 위한 창을 마련합니다. 판단: 싱가포르의 AI Verify 도구화 및 테스트 가능 방향과 비교하면, UAE의 거버넌스는 「원칙 + 자발적」 수준이며, SG NAIS 1.0 시대에 더 가깝습니다. 장점은 합규 마찰을 증가시키지 않는다는 것이고, 단점은 국제 기업(특히 EU 고객)의 신뢰도가 제한적이라는 것입니다——EU AI Act 시행 후, UAE의 수출형 AI 서비스는 이중 합규이 필요할 수 있습니다.',
        analysisJa:
          'UAE 統治モデルは「親イノベーション軽規制」です：(1) 水平的 AI 立法がない；(2) 主な手段は2022年の AI 倫理原則と2024年の AI 憲章（更新版統治原則）；(3) 世界初の AI 大臣（Omar Al Olama）と UAE AI オフィスを設置；(4) 業界レベルで ATRC（先進技術研究理事会）が研究開発を調整し、監管サンドボックスがイノベーション窓口を提供。判断：シンガポール AI Verify のツール化・テスト可能方向と比べると、UAE の統治は「原則+自発的」階級で、SG NAIS 1.0時代に近い。利点は合規摩擦を増加させないこと、欠点は国際企業（特に EU クライアント）の信頼度が限定的なことです——EU AI Act が施行後、UAE のエクスポート型 AI サービスは二重合規が必要になる可能性があります。',
        analysisEn:
          'The UAE\'s governance is "pro-innovation, light-touch": (1) no horizontal AI legislation; (2) primary tools are the 2022 AI Ethics Principles and the 2024 AI Charter (an updated governance-principles document); (3) the world\'s first AI Minister (Omar Al Olama) plus the UAE AI Office; (4) at the sectoral level, ATRC (Advanced Technology Research Council) coordinates R&D and a regulatory sandbox keeps a window open for innovation. Assessment: compared with Singapore\'s tool-centric, testable AI Verify, the UAE governance posture is "principles + voluntary" — closer to SG NAIS 1.0. The upside is low compliance friction; the downside is limited trust from international (especially EU) customers — once the EU AI Act fully lands, UAE exporters of AI services may need a dual-track compliance posture.',
        sources: [
          {
            label: 'UAE AI Strategy 2031',
            labelEn: 'UAE AI Strategy 2031',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          'UAE 相对新加坡的核心杠杆是"资本 + 能源 + 王室决心"的不可比组合：(1) MGX US$1000 亿 vs 新加坡政府 S$20 亿+，资本量级是新加坡的 50 倍；(2) 廉价能源（油气 + 太阳能）支撑大规模算力，新加坡受土地与电力约束；(3) Falcon LLM 由 TII 开发并开源，是少数非美中训练的 frontier-tier 大模型；(4) MBZUAI 4 年内挤进全球 AI 大学 Top 20。但短板：本土人才严重不足（90%+ 居民为外籍）、地缘政治敏感（美国芯片出口管制限制）、学术底蕴 vs NUS/NTU 仍有差距。判断：UAE 走"资本买入场券 + 国际人才补位"路径，新加坡走"治理 + 枢纽"路径，两者赛道几乎不重叠；UAE 的优势在数据中心和算力，新加坡的优势在治理工具和金融业 AI。',
        analysisKo:
          'UAE의 싱가포르 대비 핵심 레버는 「자본 + 에너지 + 왕실 결단」의 비교 불가능한 조합입니다: (1) MGX US$1000억 vs 싱가포르 정부 S$20억+, 자본 규모는 싱가포르의 50배; (2) 저가 에너지(석유가스 + 태양력)가 대규모 컴퓨팅 파워를 지탱하는 반면, 싱가포르는 토지와 전력 제약을 받습니다; (3) Falcon LLM은 TII에 의해 개발되고 오픈소스화되었으며, 미·중 외 훈련된 소수의 frontier-tier 대규모 언어 모델입니다; (4) MBZUAI는 4년 내에 글로벌 AI 대학 상위 20위권에 진입했습니다. 그러나 약점: 현지 인재 심각한 부족(주민 90%+ 외국국적), 지정학적 민감성(미국 칩 수출 규제 제한), 학문적 저력 대 NUS/NTU와 여전히 격차가 있습니다. 판단: UAE는 「자본 입장권 구매 + 국제 인재 보충」 경로를 택하고, 싱가포르는 「거버넌스 + 허브」 경로를 택하며, 두 트랙은 거의 겹치지 않습니다; UAE의 강점은 데이터 센터와 컴퓨팅 파워에 있고, 싱가포르의 강점은 거버넌스 도구와 금융 AI에 있습니다.',
        analysisJa:
          'UAE がシンガポール相対での核心レバーは「資本+エネルギー+王室決心」の比較不可能な組み合わせです：(1) MGX US$1000億 vs シンガポール政府 S$20億+、資本規模はシンガポールの50倍；(2) 廉価エネルギー（石油・ガス+太陽光）が大規模算力を支持し、シンガポールは土地と電力の制約を受ける；(3) Falcon LLM は TII が開発しオープンソース化し、米中以外の訓練による少数の frontier-tier 大型言語モデルの一つ；(4) MBZUAI は4年以内にグローバル AI 大学 Top 20 に入選。しかし欠点：本土人材が極めて不足（90%以上が外国籍居民）、地政学的に敏感（米国チップ輸出管制が制限）、学術実績 vs NUS/NTU はまだ格差がある。判断：UAE は「資本で入場券購入+国際人材補位」パスを歩み、シンガポールは「統治+ハブ」パスを歩み、両者のレーストラックはほぼ重複しません；UAE の優位は データセンターと算力、シンガポールの優位は統治ツールと金融業 AI です。',
        analysisEn:
          'The UAE\'s edge over Singapore is an incomparable mix of capital + energy + royal resolve: (1) MGX US$100bn vs Singapore government S$2bn+, a 50x capital gap; (2) cheap energy (oil + gas + solar) supports large-scale compute, while Singapore is constrained by land and power; (3) Falcon LLM, developed and open-sourced by TII, is one of the few frontier-tier models trained outside the US/China; (4) MBZUAI cracked global AI Top 20 universities within four years. Weaknesses: severely shallow local talent pool (90%+ residents are expatriates), geopolitical sensitivity (US chip export-control exposure), academic depth still trails NUS/NTU. Assessment: the UAE plays "capital buys an entry ticket + import international talent"; Singapore plays "governance + hub". The tracks barely overlap — UAE\'s advantages cluster around data centres and compute, Singapore\'s around governance tooling and financial-sector AI.',
        sources: [
          {
            label: 'MBZUAI 官网',
            labelKo: 'MBZUAI 공식 웹사이트',
            labelJa: 'MBZUAI 公式ウェブサイト',
            labelEn: 'MBZUAI official site',
            url: 'https://mbzuai.ac.ae/',
          },
          {
            label: 'TII Falcon LLM 公告',
            labelKo: 'TII Falcon LLM 공지',
            labelJa: 'TII Falcon LLM 発表',
            labelEn: 'TII Falcon LLM announcement',
            url: 'https://www.tii.ae/news/abu-dhabi-based-technology-innovation-institute-introduces-falcon-llm-foundational-large',
            date: '2023-05-25',
          },
        ],
      },
      'strategy-1': {
        analysis:
          'UAE AI Strategy 2031 由阿联酋政府 2017 年 10 月发布，是阿拉伯地区首份国家 AI 战略，2021 年更新。核心目标：到 2031 年 AI 贡献 GDP 33.5%（约 US$910 亿，按 2017 年 GDP 估算）。八大重点领域：交通、教育、健康、太空、技术、可再生能源、水资源、技术。配套机制：全球首位 AI 部长（Omar Sultan Al Olama，2017 任命）+ UAE AI Office 协调执行。判断：2017 年的提前布局让 UAE 比许多 G7 国家都早进入"AI 国家战略时代"。八年后回看，"33.5% GDP" 目标更像政策口号而非可量化指标——但战略本身的"信号意义"（吸引 G42 / Microsoft / OpenAI 等投资进入）已显现。',
        analysisKo:
          'UAE AI Strategy 2031은 아랍에미리트 정부가 2017년 10월에 발표했으며, 아랍 지역 최초의 국가 AI 전략입니다. 2021년 업데이트됨. 핵심 목표: 2031년까지 AI가 GDP에 기여하는 비중 33.5%(약 US$910억, 2017년 GDP 기준 추정). 8대 중점 분야: 교통, 교육, 보건, 우주, 기술, 재생에너지, 수자원, 기술. 지원 메커니즘: 전 세계 최초의 AI 부장관(Omar Sultan Al Olama, 2017년 임명) + UAE AI Office 조율 실행. 판단: 2017년의 선제적 포석으로 UAE는 많은 G7 국가보다 먼저 「AI 국가 전략 시대」에 진입했습니다. 8년이 지난 지금 돌아보면, 「GDP 33.5%」 목표는 정책 슬로건처럼 보이지 정량화 가능한 지표는 아닙니다. 다만 전략 자체의 「신호 효과」(G42 / Microsoft / OpenAI 등의 투자 유입 유인)는 이미 드러났습니다.',
        analysisJa:
          'UAE AI Strategy 2031 はアラブ首長国連邦政府が2017年10月に発表した、アラビア地域初の国家 AI 戦略で、2021年に更新されました。核心目標：2031年までに AI が GDP に33.5%を寄与（約 US$9.1億、2017年 GDP 推定による）。8つの重点領域：交通、教育、健康、宇宙、技術、再生可能エネルギー、水資源、技術。付属メカニズム：世界初の AI 大臣（Omar Sultan Al Olama、2017年任命）+ UAE AI オフィスが執行を調整。判断：2017年の早期布置により UAE は多くの G7 国家より早く「AI 国家戦略時代」に突入しました。8年後に振り返ると、「GDP 33.5%」目標はより政策スローガンで、定量可能指標ではありません——しかし戦略自体の「シグナル意義」（G42 / Microsoft / OpenAI など投資誘致）はすでに表れています。',
        analysisEn:
          'The UAE AI Strategy 2031 was launched by the UAE government in October 2017 — the first national AI strategy in the Arab world — and updated in 2021. Core target: AI contributing 33.5% of GDP (~US$91bn at 2017 prices) by 2031. Eight priority sectors: transport, education, health, space, technology, renewable energy, water, and technology. Supporting mechanism: the world\'s first AI Minister (Omar Sultan Al Olama, appointed 2017) plus the UAE AI Office. Assessment: the early-2017 positioning put the UAE ahead of many G7 countries in the "national AI strategy era". Eight years on, the 33.5% GDP target reads more as a slogan than a measurable KPI — but the strategy\'s signalling effect (drawing in G42 / Microsoft / OpenAI) has clearly worked.',
        sources: [
          {
            label: 'UAE AI Strategy 2031',
            labelEn: 'UAE AI Strategy 2031',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'strategy-2': {
        analysis:
          'AI Ethics Principles 2022 年发布，是 UAE 首份正式 AI 伦理框架文件。涵盖透明度、公平、隐私、问责、人本五大原则。性质："自愿性指导方针"，不具有法律约束力。判断：2022 年时间点比新加坡 Model AI Governance Framework 1.0（2019）晚 3 年，比 EU AI Act（2024）早 2 年——属于第二波 AI 伦理治理潮的中间档位。后被 2024 年的 AI Charter 替代/扩充，单文件本身的实施案例较少。',
        analysisKo:
          'AI Ethics Principles 2022년에 발표되었으며, UAE 최초의 공식 AI 윤리 프레임워크 문서입니다. 투명성, 공정성, 개인정보 보호, 책임성, 인본주의 5대 원칙을 포함합니다. 성질: 「자발적 지침」이며 법적 구속력이 없습니다. 판단: 2022년 시점은 싱가포르의 Model AI Governance Framework 1.0(2019년)보다 3년 늦고, EU AI Act(2024년)보다 2년 빠릅니다. 두 번째 파도의 AI 윤리 거버넌스 중간 수준에 해당합니다. 이후 2024년의 AI Charter로 대체/확충되었으며, 단일 문서로서 실행 사례는 많지 않습니다.',
        analysisJa:
          'AI 倫理原則は2022年に発表され、UAE 初の正式 AI 倫理フレームワーク文書です。透明性、公平性、プライバシー、責任性、人本的価値の5つの原則を含みます。性質：「自発的指導方針」で、法的拘束力を持ちません。判断：2022年の時間点はシンガポール Model AI Governance Framework 1.0（2019）より3年遅く、EU AI Act（2024）より2年早い——第2波 AI 倫理統治潮の中間レベルに属します。その後、2024年の AI 憲章に置き換え/拡充され、単一文書としての実施事例は比較的少ない。',
        analysisEn:
          "The AI Ethics Principles, released in 2022, is the UAE's first formal AI ethics framework. It covers five principles: transparency, fairness, privacy, accountability, human-centric. Status: voluntary guidelines, no legal force. Assessment: the 2022 timing is 3 years behind Singapore's Model AI Governance Framework 1.0 (2019) and 2 years ahead of the EU AI Act (2024) — squarely in the middle of the second wave of AI-ethics governance. The 2024 AI Charter has since superseded / extended it, and there are few documented implementation cases of the standalone document.",
        sources: [
          {
            label: 'UAE AI Strategy 2031（含 Ethics Principles 上下文）',
            labelKo: 'UAE AI Strategy 2031(AI Ethics Principles 맥락 포함)',
            labelJa: 'UAE AI Strategy 2031（倫理原則の文脈を含む）',
            labelEn: 'UAE AI Strategy 2031 (Ethics Principles context)',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'strategy-3': {
        analysis:
          'AI Charter 2024 年发布，是 2022 年 AI Ethics Principles 的更新版。增加生成式 AI 相关原则、数据治理、算力合规等内容。仍然是"自愿性原则"性质。判断：2024 年的更新主要是回应 GenAI 时代风险；UAE 没有跟随台湾/韩国走"框架法立法"路径，而是停留在自愿原则层级。这种选择对吸引投资有利（合规摩擦低），但对建立国际信任不利——欧盟 AI Act 全面落地后，UAE 出口型 AI 应用可能需要双轨合规。AI Charter 是否会在 2026-2027 年升级为有约束力的法律是关键观察点。',
        analysisKo:
          'AI Charter 2024년에 발표되었으며, 2022년 AI Ethics Principles의 업데이트 버전입니다. 생성형 AI 관련 원칙, 데이터 거버넌스, 컴퓨팅 파워 컴플라이언스 등을 추가했습니다. 여전히 「자발적 원칙」의 성질을 띱니다. 판단: 2024년의 업데이트는 주로 GenAI 시대의 위험에 대응하는 것입니다; UAE는 대만/한국처럼 「프레임워크 법 입법」 경로를 따르지 않고 자발적 원칙 수준에 머물러 있습니다. 이런 선택은 투자 유치에 유리합니다(컴플라이언스 마찰 낮음), 하지만 국제 신뢰 구축에는 불리합니다. 유럽연합 AI Act가 본격 시행되면, UAE의 수출형 AI 애플리케이션은 이중 컴플라이언스가 필요할 수 있습니다. AI Charter가 2026-2027년에 구속력 있는 법률로 상향될지는 주요 관찰 포인트입니다.',
        analysisJa:
          'AI Charter は 2024 年に発布されており、2022 年の AI Ethics Principles の更新版です。生成型 AI 関連の原則、データ治理、算力コンプライアンスなどの内容が追加されています。依然として「自主的原則」の性質を有しています。判断：2024 年の更新は主に GenAI 時代のリスクに対応したもので、UAE は台湾/韓国のような「枠組み法立法」の道をたどらず、自主的原則のレベルにとどまっています。この選択は投資獲得に有利（コンプライアンス摩擦が低い）ですが、国際的信頼の構築には不利です。EU AI Act が本格的に展開した後、UAE の輸出型 AI アプリケーションは二重軌道のコンプライアンスが必要になる可能性があります。AI Charter が 2026-2027 年に拘束力のある法律にアップグレードされるかどうかが重要な観察ポイントです。',
        analysisEn:
          'The AI Charter, released in 2024, is the updated version of the 2022 AI Ethics Principles. It adds generative-AI-specific principles, data governance, and compute-compliance content. It remains a voluntary-principles document. Assessment: the 2024 update mainly responds to GenAI-era risk; the UAE did not follow Taiwan / Korea down the "framework legislation" path and stayed at voluntary principles. The choice favours investment attraction (low compliance friction) but not international trust — once the EU AI Act fully lands, UAE-exported AI services may face dual-track compliance. Whether the AI Charter is upgraded into a binding statute in 2026-2027 is the key signal to watch.',
        sources: [
          {
            label: 'UAE AI Strategy 2031（含 AI Charter 框架）',
            labelKo: 'UAE AI Strategy 2031(AI Charter 프레임워크 포함)',
            labelJa: 'UAE AI Strategy 2031（AI Charter 枠組みを含む）',
            labelEn: 'UAE AI Strategy 2031 (AI Charter context)',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'investment-1': {
        analysis:
          'MGX 基金 2024 年由阿布扎比政府授权设立，目标 AUM US$1000 亿，主席 Sheikh Tahnoun bin Zayed Al Nahyan，CEO Ahmed Yahia Al Idrissi。出资方：G42（科技控股）+ Mubadala（主权基金）。投资范围：AI 基础设施、半导体、高算力技术。已公开投资：OpenAI（2025）、Anthropic（2025）、xAI 部分轮次、与 BlackRock + GIP + Microsoft 合作的全球 AI 基础设施投资伙伴（初始 US$300 亿，潜在 US$1000 亿）。判断：MGX 是全球迄今最大的 AI 主题主权基金，规模超过 SoftBank Vision Fund 1+2 总和（~US$1300 亿）的 70%+。"目标"vs"实际"是关键——MGX 真正关键不在 US$1000 亿数字，而在它是否成为非美中前沿 AI 投资的"第三极"。',
        analysisKo:
          'MGX 기금은 2024년 3월 아부다비 정부의 인가로 설립되었으며, 목표 AUM은 US$1000억입니다. 의장은 Sheikh Tahnoun bin Zayed Al Nahyan이고, CEO는 Ahmed Yahia Al Idrissi입니다. 출자자: G42(기술 지주) + Mubadala(주권펀드). 투자 범위: AI 기초 시설, 반도체, 고성능 컴퓨팅 기술. 공개된 투자 실적: OpenAI(2025년), Anthropic(2025년), xAI의 일부 라운드, BlackRock + GIP + Microsoft와의 글로벌 AI 인프라 투자 파트너십(초기 US$300억, 잠재적 US$1000억). 판단: MGX는 현재까지 세계 최대 규모의 AI 주제 주권펀드이며, 규모가 SoftBank Vision Fund 1+2 총합(약 US$1300억)의 70% 이상입니다. 「목표」 vs 「실적」이 핵심입니다. MGX의 진정한 가치는 US$1000억 수치가 아니라, 미국과 중국을 제외한 선진 AI 투자의 「제3의 극」이 될 수 있는지에 있습니다.',
        analysisJa:
          'MGX 基金は 2024 年 3 月にアブダビ政府の授権で設立され、目標 AUM は US$1000 億です。会長は Sheikh Tahnoun bin Zayed Al Nahyan、CEO は Ahmed Yahia Al Idrissi です。出資方：G42（テクノロジーホールディング）+ Mubadala（ソブリンウェルス基金）。投資範囲：AI インフラストラクチャ、半導体、高算力技術。公開投資：OpenAI（2025）、Anthropic（2025）、xAI の部分ラウンド、BlackRock + GIP + Microsoft との協力による世界 AI インフラストラクチャ投資パートナーシップ（初期 US$300 億、潜在的 US$1000 億）。判断：MGX は現在のところ世界最大の AI テーマのソブリンウェルス基金で、規模は SoftBank Vision Fund 1+2 の合計（約 US$1300 億）の 70% 以上を超えています。「目標」対「実績」が鍵です。MGX の真の重要性は US$1000 億という数字にではなく、非米中の最前線 AI 投資の「第3の極」になれるかどうかにあります。',
        analysisEn:
          'MGX was established in 2024 under authorisation of the Abu Dhabi government, targeting US$100bn AUM, with Sheikh Tahnoun bin Zayed Al Nahyan as chair and Ahmed Yahia Al Idrissi as CEO. Backers: G42 (tech holding) + Mubadala (sovereign fund). Investment scope: AI infrastructure, semiconductors, high-compute technologies. Disclosed investments include OpenAI (2025), Anthropic (2025), parts of the xAI rounds, and the Global AI Infrastructure Investment Partnership with BlackRock + GIP + Microsoft (initial US$30bn, potential US$100bn). Assessment: MGX is the largest AI-themed sovereign fund globally to date, larger than 70%+ of SoftBank Vision Fund 1+2 combined (~US$130bn). "Target" vs "actual" is the key tension — MGX\'s real significance is not the US$100bn headline but whether it becomes the third pole of frontier AI capital outside the US and China.',
        sources: [
          {
            label: 'MGX 基金官网',
            labelKo: 'MGX 기금 공식 웹사이트',
            labelJa: 'MGX 基金公式サイト',
            labelEn: 'MGX Fund official site',
            url: 'https://www.mgx.ae/en',
          },
          {
            label: 'MGX 概览（Wikipedia）',
            labelKo: 'MGX 개요(Wikipedia)',
            labelJa: 'MGX 概要（Wikipedia）',
            labelEn: 'MGX overview (Wikipedia)',
            url: 'https://en.wikipedia.org/wiki/MGX_Fund_Management_Limited',
          },
        ],
      },
      'investment-2': {
        analysis:
          '微软合作 2024 年 4 月正式签署，US$15.2 亿 涵盖：(1) Microsoft 对 G42（UAE 旗舰 AI 公司）的战略股权投资；(2) Microsoft 在 UAE 建设大规模算力基础设施；(3) Azure 云服务在 UAE 的部署；(4) G42 承诺采用 Microsoft 安全合规标准（含限制对中国的技术输出）。判断：这是 UAE AI 战略中最具地缘政治意义的一笔——通过接受 Microsoft 投资，UAE 实质上选边美国阵营，换取 NVIDIA H100 / B200 等先进 AI 芯片的稳定供应。这种"对美对齐"的成本是部分中东市场的反弹，但收益是 UAE 锁定了下一代 AI 算力的入场券。',
        analysisKo:
          'Microsoft 협력은 2024년 4월에 정식 체결되었으며, US$15.2억을 포함합니다. 내용: (1) Microsoft의 G42(UAE 기함 AI 회사)에 대한 전략적 지분 투자; (2) Microsoft의 UAE 대규모 컴퓨팅 파워 기초 시설 건설; (3) Azure 클라우드 서비스의 UAE 배포; (4) G42의 Microsoft 보안 컴플라이언스 표준 채택 약속(중국으로의 기술 수출 제한 포함). 판단: 이는 UAE AI 전략에서 지정학적 의미가 가장 큰 거래입니다. Microsoft 투자를 받음으로써 UAE는 실질적으로 미국진영을 선택하고, NVIDIA H100 / B200 등 첨단 AI 칩 공급의 안정성을 확보합니다. 이러한 「대미 정렬」의 비용은 일부 중동 시장의 반발이지만, 수익은 차세대 AI 컴퓨팅 파워 입장권을 확보하는 것입니다.',
        analysisJa:
          'マイクロソフト協力は 2024 年 4 月に正式に調印され、US$15.2 億をカバーしています。内容：(1) Microsoft による G42（UAE の旗艦 AI 企業）への戦略的株式投資；(2) UAE での Microsoft による大規模算力インフラの構築；(3) UAE での Azure クラウドサービスの配備；(4) G42 が Microsoft のセキュリティコンプライアンス基準を採用することを約束（中国への技術輸出の制限を含む）。判断：これは UAE AI 戦略の中で地政学的意味が最も大きい投資です。Microsoft 投資を受け入れることにより、UAE は実質的に米国陣営を選択し、NVIDIA H100/B200 などの先進 AI チップの安定供給と引き換えに対米方針転換を実現しました。この「対米アライメント」のコストは中東市場の一部の反発ですが、利益は次世代 AI 算力への入場券を確保することです。',
        analysisEn:
          "The Microsoft partnership was formally signed in April 2024 — a US$15.2bn package covering: (1) Microsoft's strategic equity investment in G42 (the UAE's flagship AI firm); (2) Microsoft building large-scale compute infrastructure in the UAE; (3) Azure deployment in the UAE; (4) G42 committing to Microsoft security and compliance standards (including limits on tech transfers to China). Assessment: this is the most geopolitically loaded line in the UAE's AI strategy — by accepting Microsoft investment, the UAE effectively aligned with the US camp in exchange for stable supply of advanced AI chips (NVIDIA H100 / B200). The cost is some pushback in parts of the Middle East market; the benefit is securing the next-gen AI compute entry ticket.",
        sources: [
          {
            label: 'BlackRock + GIP + Microsoft + MGX 合作公告',
            labelKo: 'BlackRock + GIP + Microsoft + MGX 협력 공지',
            labelJa: 'BlackRock + GIP + Microsoft + MGX 協力発表',
            labelEn: 'BlackRock + GIP + Microsoft + MGX partnership announcement',
            url: 'https://news.microsoft.com/source/2024/09/17/blackrock-global-infrastructure-partners-microsoft-and-mgx-launch-new-ai-partnership-to-invest-in-data-centers-and-supporting-power-infrastructure/',
            date: '2024-09-17',
          },
        ],
      },
      'investment-3': {
        analysis:
          'Stargate UAE 是 OpenAI + Oracle + 软银 + UAE 阿布扎比联合宣布的 1GW 数据中心计划，2025 年 5 月特朗普访问 UAE 期间公开。规划：阿布扎比建设 1GW AI 算力园区，第一阶段 200MW，2026 年起部署。这是 OpenAI Stargate 项目（计划全球部署 10GW+）在中东的首站。判断：Stargate UAE 是 UAE 战略的标志性资产——"我们不光出钱（MGX），还出地（数据中心）"。但 1GW 算力部署需要 3-5 年实际建设，2026-2028 年才能验证落地速度。能源消耗（1GW 持续运行约 88 亿度/年）对当地电网是新挑战。',
        analysisKo:
          'Stargate UAE는 OpenAI + Oracle + 소프트뱅크 + UAE 아부다비가 연합으로 공지한 1GW 데이터 센터 계획이며, 2025년 5월 트럼프 UAE 방문 중 공개됨. 계획: 아부다비에 1GW AI 컴퓨팅 파워 단지 건설, 첫 단계 200MW, 2026년부터 배포. 이는 OpenAI Stargate 프로젝트(글로벌 10GW+ 배포 계획)의 중동 첫 거점입니다. 판단: Stargate UAE는 UAE 전략의 상징적 자산입니다. 「우리는 돈만 투자하는 게 아니라(MGX), 땅도 제공합니다(데이터 센터)」. 다만 1GW 컴퓨팅 파워 배포에는 3-5년의 실제 건설이 필요하며, 2026-2028년에야 배포 속도를 검증할 수 있습니다. 에너지 소비(1GW 지속 운영 시 약 88억 kWh/년)는 현지 전력망에 새로운 과제입니다.',
        analysisJa:
          'Stargate UAE は OpenAI + Oracle + SoftBank + UAE アブダビが共同で発表した 1GW データセンター計画で、2025 年 5 月のトランプ大統領の UAE 訪問時に公開されました。計画：アブダビに 1GW AI 算力パーク を建設、第 1 段階 200MW、2026 年から配備開始。これは OpenAI の Stargate プロジェクト（世界全体で 10GW 以上の配備を計画）の中東での初拠点です。判断：Stargate UAE は UAE 戦略のフラッグシップ資産です。「資金を提供するだけでなく、土地も提供する（データセンター）」という立場を示します。しかし 1GW の算力配備には 3～5 年の実際の建設期間が必要で、2026-2028 年に初めて配備速度を検証できます。エネルギー消費（1GW の継続運用は約 88 億度/年）は地域の電力網に新たな課題をもたらします。',
        analysisEn:
          'Stargate UAE is a 1 GW data centre plan jointly announced by OpenAI + Oracle + SoftBank + UAE Abu Dhabi, made public during Trump\'s UAE visit in May 2025. The plan: a 1 GW AI compute park in Abu Dhabi, first phase 200 MW deploying from 2026. It is the Middle Eastern first stop of OpenAI\'s broader Stargate initiative (targeting 10 GW+ globally). Assessment: Stargate UAE is the flagship asset of the UAE strategy — "we are not just writing cheques (MGX) but also providing land (data centres)". But deploying 1 GW of compute takes 3-5 years; 2026-2028 will reveal the actual delivery cadence. Energy consumption (~8.8 TWh/year at sustained 1 GW operation) is a new challenge for local grids.',
        sources: [
          {
            label: 'MGX 基金官网（含 Stargate 合作背景）',
            labelKo: 'MGX 기금 공식 웹사이트(Stargate 협력 배경 포함)',
            labelJa: 'MGX 基金公式サイト（Stargate 協力背景を含む）',
            labelEn: 'MGX Fund site (Stargate partnership context)',
            url: 'https://www.mgx.ae/en',
          },
        ],
      },
      'initiative-1': {
        analysis:
          'Falcon LLM 由阿布扎比 Technology Innovation Institute (TII) 在 2023 年 5 月发布。Falcon-40B 起步，2024-25 年扩展到 180B、Mamba-7B 等系列，全部 Apache 2.0 开源。在 Hugging Face Open LLM Leaderboard 上长期占据 Top 5 非美中模型位置。训练算力来自 AWS + 本地超算混合。判断：Falcon 是少数能与 Llama / Qwen 同台竞争的非美中开源大模型，对 UAE 的 AI 主权叙事至关重要。但 Falcon 落后于美中 frontier model（GPT-4o、Claude 3.5、Qwen 2.5）一代左右；在 GenAI 商业生态（API 调用 / 开发者社群）上覆盖远不如 Llama。UAE 的"主权大模型"价值在外交，不在商业。',
        analysisKo:
          'Falcon LLM은 아부다비 Technology Innovation Institute (TII)에서 2023년 5월에 발표했습니다. Falcon-40B부터 시작하여, 2024-25년에 180B, Mamba-7B 등 시리즈로 확장되었으며, 모두 Apache 2.0으로 오픈소스 공개됨. Hugging Face Open LLM Leaderboard에서 오랫동안 미국·중국 외 모델 상위 5위를 차지했습니다. 훈련 컴퓨팅 파워는 AWS + 로컬 슈퍼컴퓨팅 혼합에서 나옵니다. 판단: Falcon은 Llama / Qwen과 동등하게 경쟁할 수 있는 소수의 미국·중국 외 오픈소스 대규모 언어 모델입니다. UAE의 AI 주권 서사에 매우 중요합니다. 하지만 Falcon은 미국·중국의 frontier 모델(GPT-4o, Claude 3.5, Qwen 2.5)보다 1세대 정도 뒤쳐져 있습니다; 생성형 AI 상업 생태계(API 호출 / 개발자 커뮤니티)에서의 커버리지는 Llama보다 훨씬 떨어집니다. UAE의 「주권 대규모 언어 모델」의 가치는 외교에 있지, 상업성에 있지 않습니다.',
        analysisJa:
          'Falcon LLM はアブダビの Technology Innovation Institute（TII）により 2023 年 5 月に発布されました。Falcon-40B から始まり、2024-25 年に 180B、Mamba-7B などのシリーズに拡張、すべて Apache 2.0 オープンソースです。Hugging Face Open LLM Leaderboard では非米中モデルの中でも長期にわたって Top 5 を占めています。訓練算力は AWS + ローカルスーパーコンピューティングの混合から来ています。判断：Falcon は Llama/Qwen と同じステージで競争できる数少ない非米中のオープンソース大言語モデルで、UAE の AI 主権叙述にとって非常に重要です。しかし Falcon は米中の最前線モデル（GPT-4o、Claude 3.5、Qwen 2.5）から 1 世代遅れており、生成型 AI ビジネスエコシステム（API 呼び出し/開発者コミュニティ）での Llama の比較にはかなり遠く及びません。UAE の「主権大言語モデル」の価値は外交にあり、ビジネスではありません。',
        analysisEn:
          'Falcon LLM was released by Abu Dhabi\'s Technology Innovation Institute (TII) in May 2023, starting from Falcon-40B and expanding through 2024-25 to include 180B, Mamba-7B and other variants — all open-sourced under Apache 2.0. Falcon has consistently held a Top-5 non-US/non-China spot on the Hugging Face Open LLM Leaderboard. Training compute is a hybrid of AWS plus local supercomputing. Assessment: Falcon is one of the few non-US/non-China open large models that can compete with Llama / Qwen, and it is essential to the UAE\'s "AI sovereignty" narrative. But Falcon lags US/China frontier models (GPT-4o, Claude 3.5, Qwen 2.5) by roughly a generation, and its GenAI commercial ecosystem (API consumption, developer community) trails Llama by a wide margin. The "sovereign large model" value is diplomatic, not commercial.',
        sources: [
          {
            label: 'TII Falcon LLM 公告',
            labelKo: 'TII Falcon LLM 공지',
            labelJa: 'TII Falcon LLM 発表',
            labelEn: 'TII Falcon LLM announcement',
            url: 'https://www.tii.ae/news/abu-dhabi-based-technology-innovation-institute-introduces-falcon-llm-foundational-large',
            date: '2023-05-25',
          },
        ],
      },
      'initiative-2': {
        analysis:
          'MBZUAI（Mohamed bin Zayed University of Artificial Intelligence）2019 年由阿布扎比政府成立，是全球首所专门以 AI 为单一学科的研究型大学。提供机器学习、自然语言处理、计算机视觉三个 PhD/Master 项目，学费全免、提供奖学金。教师团队从 CMU、MIT、UCL、清华等挖人。截至 2025 年，全球 AI/ML 学术排名进入 Top 20-30 区间。判断：MBZUAI 是 UAE "AI 主权"叙事最具象的资产——只用 4-5 年从零做到全球 Top 30 是大手笔砸钱 + 国际人才组合的结果。但学术影响力的"硬度"（顶会论文 / 引用 / 校友影响）远不及 Stanford / MIT 几十年积累，UAE 在学术深度上仍是"用钱买进度"。',
        analysisKo:
          'MBZUAI(Mohamed bin Zayed University of Artificial Intelligence)는 2019년 아부다비 정부에 의해 설립되었으며, AI를 단일 학과로 하는 세계 최초의 연구형 대학입니다. 기계 학습, 자연어 처리, 컴퓨터 비전 3개의 PhD/Master 프로그램을 제공하며, 학비는 무료이고 장학금을 제공합니다. 교수진은 CMU, MIT, UCL, 칭화 등에서 영입했습니다. 2025년 기준, 글로벌 AI/ML 학술 순위는 상위 20-30위대에 진입했습니다. 판단: MBZUAI는 UAE 「AI 주권」 서사의 가장 구체적인 자산입니다. 4-5년 만에 제로에서 글로벌 상위 30위로 진출한 것은 막대한 자본 투입 + 국제 인재 조합의 결과입니다. 하지만 학술 영향력의 「견고성」(최고급 학술대회 논문 / 인용도 / 동문 영향력)은 Stanford / MIT의 수십 년 축적과 비교할 수 없습니다. UAE는 학문적 깊이에서 여전히 「돈으로 진도 구매」 상태입니다.',
        analysisJa:
          'MBZUAI（Mohamed bin Zayed University of Artificial Intelligence）は 2019 年にアブダビ政府により設立され、世界初の AI を単一学科とする研究型大学です。機械学習、自然言語処理、コンピュータビジョンの 3 つの PhD/修士課程を提供し、学費は無料で奨学金を提供しています。教員団は CMU、MIT、UCL、清華などから採用されています。2025 年時点で、世界の AI/ML 学術ランキングは Top 20-30 のレンジに入っています。判断：MBZUAI は UAE の「AI 主権」叙述の最も具体的な資産です。ゼロから世界 Top 30 に 4-5 年で到達するのは、大金投入と国際人材の組み合わせの結果です。しかし学術影響力の「硬度」（トップティア会議論文/被引用数/卒業生の影響力）は Stanford/MIT の数十年の蓄積には遠く及びません。UAE は学術的深さの面ではまだ「金で進歩を買う」段階にあります。',
        analysisEn:
          'MBZUAI (Mohamed bin Zayed University of Artificial Intelligence) was founded by the Abu Dhabi government in 2019, the world\'s first research university dedicated exclusively to AI. It offers PhD / Master programmes in machine learning, NLP, and computer vision; tuition is fully waived and stipends are provided. Faculty have been recruited from CMU, MIT, UCL, Tsinghua. By 2025 it ranks in the Top 20-30 globally in AI/ML academic rankings. Assessment: MBZUAI is the most concrete asset in the UAE\'s "AI sovereignty" narrative — going from zero to global Top 30 in 4-5 years is the result of heavy spending plus an international-talent combo. But the "hardness" of academic influence (top-venue publications, citations, alumni reach) trails Stanford / MIT\'s decades of accumulation; on academic depth, the UAE is still "buying progress with money".',
        sources: [
          {
            label: 'MBZUAI 官网',
            labelKo: 'MBZUAI 공식 웹사이트',
            labelJa: 'MBZUAI 公式サイト',
            labelEn: 'MBZUAI official site',
            url: 'https://mbzuai.ac.ae/',
          },
        ],
      },
      'initiative-3': {
        analysis:
          'MGX 千亿美元 AI 投资基金作为执行项目视角：2024 年 3 月成立，2024 年 9 月与 BlackRock + GIP + Microsoft 联合发起 Global AI Infrastructure Investment Partnership，初始承诺 US$300 亿股权 + 潜在扩至 US$1000 亿债务。已公开投资：OpenAI（参与 2024-25 多轮融资）、Anthropic（2025）、xAI、Crusoe Energy（数据中心）。判断：MGX 是 UAE 把"国家资本"转化为"AI 时代股东身份"的核心工具——通过 OpenAI / Anthropic / xAI 这种 frontier lab 的早期股权，UAE 锁定了下一代 AI 经济的部分股权回报。但持股 vs 控股是两件事：UAE 拿到的是少数股权 + 数据中心配套合作，不是技术控制权。',
        analysisKo:
          'MGX 천억 달러 AI 투자 기금을 집행 프로젝트 관점으로 보면: 2024년 3월 설립되었으며, 2024년 9월 BlackRock + GIP + Microsoft와 연합으로 Global AI Infrastructure Investment Partnership을 발족했습니다. 초기 약정 US$300억 지분 + 잠재적으로 US$1000억 채권까지 확장. 공개된 투자 실적: OpenAI(2024-25년 다중 라운드 참여), Anthropic(2025년), xAI, Crusoe Energy(데이터 센터). 판단: MGX는 UAE가 「국가 자본」을 「AI 시대 주주 신분」으로 전환하는 핵심 도구입니다. OpenAI / Anthropic / xAI 같은 선도 연구소의 초기 지분을 통해, UAE는 차세대 AI 경제의 부분적 지분 수익을 확보합니다. 하지만 보유(holding) vs 지배(control)는 다른 문제입니다: UAE가 얻은 것은 소수 지분 + 데이터 센터 협력 수준이지, 기술 통제권은 아닙니다.',
        analysisJa:
          'MGX 1 兆米ドル AI 投資基金を実行プロジェクト視点として：2024 年 3 月に設立、2024 年 9 月に BlackRock + GIP + Microsoft と共同で Global AI Infrastructure Investment Partnership を発起し、初期コミットメントは US$300 億のエクイティ + 潜在的に US$1000 億の債務に拡大する可能性があります。公開投資：OpenAI（2024-25 年の複数ラウンド参加）、Anthropic（2025）、xAI、Crusoe Energy（データセンター）。判断：MGX は UAE が「国家資本」を「AI 時代の株主地位」に変換するための核心的ツールです。OpenAI/Anthropic/xAI などの最前線ラボの初期段階の株式を通じて、UAE は次世代 AI 経済の部分的な株主利益を確保しています。しかし株式保有と支配権は別の問題です。UAE が得たのは少数株主権 + データセンター協力であり、技術支配権ではありません。',
        analysisEn:
          'MGX from a project-execution lens: established in March 2024; in September 2024 it co-launched the Global AI Infrastructure Investment Partnership with BlackRock + GIP + Microsoft, with an initial US$30bn equity commitment plus potential to scale to US$100bn in debt. Disclosed investments include OpenAI (2024-25 rounds), Anthropic (2025), xAI, and Crusoe Energy (data centres). Assessment: MGX is the UAE\'s core tool for translating "national capital" into "AI-era shareholder status" — early stakes in frontier labs like OpenAI / Anthropic / xAI lock in a slice of next-gen AI economic returns. But equity stakes ≠ control: the UAE secures minority equity plus data-centre tie-ins, not technology control.',
        sources: [
          {
            label: 'MGX 基金官网',
            labelKo: 'MGX 기금 공식 웹사이트',
            labelJa: 'MGX 基金公式サイト',
            labelEn: 'MGX Fund official site',
            url: 'https://www.mgx.ae/en',
          },
          {
            label: 'BlackRock + GIP + Microsoft + MGX 合作',
            labelKo: 'BlackRock + GIP + Microsoft + MGX 협력',
            labelJa: 'BlackRock + GIP + Microsoft + MGX 協力',
            labelEn: 'BlackRock + GIP + Microsoft + MGX partnership',
            url: 'https://news.microsoft.com/source/2024/09/17/blackrock-global-infrastructure-partners-microsoft-and-mgx-launch-new-ai-partnership-to-invest-in-data-centers-and-supporting-power-infrastructure/',
            date: '2024-09-17',
          },
        ],
      },
      'initiative-4': {
        analysis:
          'Stargate UAE 1GW 超大规模数据中心是 OpenAI Stargate 计划在中东的首站，2025 年 5 月特朗普访问期间宣布，由 OpenAI + Oracle + 软银 + UAE 联合执行，规划在阿布扎比建设 1GW AI 算力园区。第一阶段 200MW，2026 年起部署，目标 2028-2030 年达到 1GW 满载。判断：Stargate UAE 是 UAE "卖能源换 AI 入场券"的代表项目——UAE 的廉价天然气是 1GW 持续算力运行的基础，新加坡（电力受限）和欧盟（能源价格高）都做不到。但 1GW 数据中心 ≈ 一个中型城市的电力消耗，未来需关注 UAE 是否需要在本地电网升级或新增可再生能源。',
        analysisKo:
          'Stargate UAE 1GW 초대규모 데이터 센터는 OpenAI Stargate 계획의 중동 첫 거점이며, 2025년 5월 트럼프 방문 중 공지되었습니다. OpenAI + Oracle + 소프트뱅크 + UAE가 연합으로 추진하며, 아부다비에 1GW AI 컴퓨팅 파워 단지를 구축할 계획입니다. 첫 단계 200MW, 2026년부터 배포 시작, 목표는 2028-2030년에 1GW 만재 도달. 판단: Stargate UAE는 UAE 「저가 에너지를 AI 입장권으로 교환」 대표 프로젝트입니다. UAE의 저가 천연가스는 1GW 지속 컴퓨팅 파워 운영의 토대입니다. 싱가포르(전력 제약)와 유럽연합(에너지 가격 높음)은 이를 구현할 수 없습니다. 하지만 1GW 데이터 센터 ≈ 중도시급 전력 소비량이므로, 향후 UAE가 로컬 전력망 업그레이드나 신규 재생에너지 추가가 필요한지 주목해야 합니다.',
        analysisJa:
          'Stargate UAE 1GW 超大規模データセンターは OpenAI の Stargate 計画の中東での初拠点で、2025 年 5 月トランプ大統領の訪問時に発表され、OpenAI + Oracle + SoftBank + UAE が共同実行し、アブダビに 1GW AI 算力パークを建設することを計画しています。第 1 段階 200MW、2026 年から配備開始、目標は 2028-2030 年に 1GW フル稼働を達成することです。判断：Stargate UAE は UAE が「エネルギーを売却して AI の入場券と交換する」ことの代表的プロジェクトです。UAE の廉価な天然ガスは 1GW 継続算力運用の基盤で、シンガポール（電力が限定的）と欧州連合（エネルギー価格が高い）ではできません。しかし 1GW データセンターはおよそ中型都市の電力消費に等しく、将来 UAE がローカル電力網アップグレードまたは新規再生可能エネルギーを必要としているかどうかに注視する必要があります。',
        analysisEn:
          "Stargate UAE — a 1 GW hyperscale data centre — is the Middle Eastern first stop of OpenAI's Stargate initiative, announced during Trump's UAE visit in May 2025 and jointly executed by OpenAI + Oracle + SoftBank + UAE. Plan: a 1 GW AI compute park in Abu Dhabi, first phase 200 MW deploying from 2026, target 1 GW full load by 2028-2030. Assessment: Stargate UAE is the showcase project for \"trading energy for an AI entry ticket\" — the UAE's cheap gas underwrites continuous 1 GW operation in a way Singapore (power-constrained) and the EU (high energy prices) cannot match. But 1 GW ≈ a mid-sized city's electricity consumption; UAE will need local grid upgrades or new renewables.",
        sources: [
          {
            label: 'MGX 基金官网（含 Stargate 上下文）',
            labelKo: 'MGX 기금 공식 웹사이트(Stargate 맥락 포함)',
            labelJa: 'MGX 基金公式サイト（Stargate コンテキストを含む）',
            labelEn: 'MGX Fund site (Stargate context)',
            url: 'https://www.mgx.ae/en',
          },
        ],
      },
      'initiative-5': {
        analysis:
          'AI 部长制度与 AI Office：UAE 2017 年任命 Omar Sultan Al Olama 为全球首位 AI 部长（更准确职务：Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications）。AI 部长直接向总统办公室汇报。配套机构 UAE AI Office 协调跨部委 AI 政策执行。Olama 至今（2025）仍在任，是 UAE AI 战略的"持续性化身"。判断：AI 部长制度的真正意义不是行政效率（UAE 内阁规模小，跨部委协调本身不复杂），而是国际信号——把 AI 升格到部级建制，为 UAE 在全球 AI 治理对话（OECD AI Principles、G7 GPAI、UN AI Advisory Body）中赢得了座位。新加坡选择不设 AI 部长但设 SNDGO，效果不同但目标类似。',
        analysisKo:
          'AI 부장관 제도와 AI Office: UAE는 2017년 Omar Sultan Al Olama를 전 세계 최초의 AI 부장관으로 임명했습니다(정확한 직책: Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications). AI 부장관은 대통령 비서실에 직보입니다. 지원 기구인 UAE AI Office는 부처 간 AI 정책 집행을 조율합니다. Olama는 현재(2025년)까지 재직 중이며, UAE AI 전략의 「지속성 화신」입니다. 판단: AI 부장관 제도의 진정한 의의는 행정 효율성(UAE 내각 규모가 작아 부처 간 조율이 원래 복잡하지 않음)이 아니라 국제 신호입니다. AI를 부장관 급으로 격상시킴으로써, UAE는 글로벌 AI 거버넌스 대화(OECD AI Principles, G7 GPAI, UN AI Advisory Body)에서 발언권을 확보했습니다. 싱가포르는 AI 부장관을 설치하지 않고 SNDGO를 두었으나, 효과는 다르지만 목표는 비슷합니다.',
        analysisJa:
          'AI 部長制度と AI Office：UAE は 2017 年に Omar Sultan Al Olama を世界初の AI 部長（より正確な職務名：Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications）に任命しました。AI 部長は大統領办公室に直接報告します。付属機構 UAE AI Office は部門間 AI 政策実施の調整を行います。Olama は現在（2025）も在職しており、UAE AI 戦略の「継続的なシンボル」です。判断：AI 部長制度の真の意味は行政効率（UAE の内閣規模は小さく、部門間調整自体は複雑ではない）ではなく、国際シグナルです。AI を部級の構造に格上げすることで、UAE は世界的な AI ガバナンス対話（OECD AI Principles、G7 GPAI、UN AI Advisory Body）の中で座席を獲得しました。シンガポールは AI 部長を設置しないことを選択しましたが、SNDGO を設立し、効果は異なりますが目標は類似しています。',
        analysisEn:
          "The AI Minister office and AI Office: in 2017 the UAE appointed Omar Sultan Al Olama as the world's first AI Minister (precise title: Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications). The AI Minister reports directly to the President's Office, supported by the UAE AI Office which coordinates AI policy across ministries. Olama remains in post as of 2025, embodying continuity for the UAE AI strategy. Assessment: the real significance of the AI Minister institution is not operational efficiency (the UAE cabinet is small, cross-ministry coordination is not inherently complex) but international signalling — elevating AI to cabinet rank earned the UAE seats in global AI governance dialogues (OECD AI Principles, G7 GPAI, UN AI Advisory Body). Singapore chose to skip the AI Minister but stand up SNDGO; different mechanism, similar end.",
        sources: [
          {
            label: 'UAE AI Strategy 2031（含 AI Minister 上下文）',
            labelKo: 'UAE AI Strategy 2031(AI 부장관 맥락 포함)',
            labelJa: 'UAE AI Strategy 2031（AI Minister コンテキストを含む）',
            labelEn: 'UAE AI Strategy 2031 (AI Minister context)',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'body-1': {
        analysis:
          'AI 部长（Minister of State for AI）2017 年由 UAE 设立，全球首例。首任及至今在任的是 Omar Sultan Al Olama（生于 1990 年，任命时 27 岁）。完整职务名为 Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications，2020 年职责扩大覆盖数字经济与远程办公。直接向总统办公室汇报。判断：AI 部长不是孤立职务——背后还有 ATRC（先进技术研究理事会）、UAE AI Office、G42 / Mubadala 等执行机构。AI 部长的角色更像"国际门面 + 跨部委协调"，而非政策制定。",对比新加坡：UAE AI 部长 = SG SNDGO 部长 + IMDA CEO 角色合并，权力边界更模糊。',
        analysisKo:
          'AI 부장관(Minister of State for AI)은 2017년 UAE에서 설치되었으며, 세계 최초입니다. 초대이자 현재 재직 중인 인물은 Omar Sultan Al Olama(1990년생, 임명 시 27세)입니다. 정확한 직책은 Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications이며, 2020년 직책 범위가 디지털 경제와 원격 업무까지 확대됨. 대통령 비서실에 직보합니다. 판단: AI 부장관은 고립된 직책이 아닙니다. 배경에는 ATRC(선진 기술 연구위원회), UAE AI Office, G42 / Mubadala 등 집행 기구가 있습니다. AI 부장관의 역할은 「국제 창구 + 부처 간 조율」에 가까우며, 정책 수립은 아닙니다. 싱가포르와 비교: UAE AI 부장관 = SG SNDGO 부장관 + IMDA CEO 역할 통합, 권력 경계가 더 모호합니다.',
        analysisJa:
          'AI 部長（Minister of State for AI）は 2017 年に UAE が設立した全世界初の職務です。首任および現在の在職者は Omar Sultan Al Olama（1990 年生、任命時 27 歳）です。完全な職務名は Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications で、2020 年に職務は拡大してデジタル経済とリモートワークをカバーするようになりました。大統領办公室に直接報告します。判断：AI 部長は孤立した職務ではありません。背後には ATRC（先端技術研究会議）、UAE AI Office、G42/Mubadala などの実行機関があります。AI 部長の役割は「国際的顔 + 部門間調整」に近く、政策立案ではありません。シンガポールとの比較：UAE AI 部長＝SG SNDGO 部長 + IMDA CEO の役割の統合で、権力の境界はより曖昧です。',
        analysisEn:
          'The AI Minister (Minister of State for AI) post was created by the UAE in 2017 — the world\'s first. The inaugural and current holder is Omar Sultan Al Olama (born 1990, age 27 at appointment). The full title became Minister of State for Artificial Intelligence, Digital Economy and Remote Work Applications in 2020 as the brief expanded into the digital economy and remote work. He reports directly to the Office of the President. Assessment: the AI Minister is not a standalone post — ATRC (Advanced Technology Research Council), the UAE AI Office, G42 / Mubadala provide the executing layer. The AI Minister\'s role is more "international face + cross-ministry coordinator" than policy-maker. Versus Singapore: UAE AI Minister = SNDGO minister + IMDA CEO merged, with looser authority boundaries.',
        sources: [
          {
            label: 'UAE AI Strategy 2031',
            labelEn: 'UAE AI Strategy 2031',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'body-2': {
        analysis:
          'UAE AI Office 2017 年与 AI 部长同期成立，是 AI 部长的执行办公室。职能：(1) 协调各部委 AI 战略实施；(2) 发布 AI Ethics Principles（2022）和 AI Charter（2024）；(3) 管理 UAE AI Camp 等人才项目。判断：相对新加坡 SNDGO（150+ 人编制），UAE AI Office 公开人员规模较小（~50 人），更多依赖跨机构合作执行。这种"小核心 + 多外部"模式效率取决于王室决心和资本注入；不像新加坡 SNDGO 那样有制度化的部门间制衡。',
        analysisKo:
          'UAE AI Office는 2017년 AI 부장관과 동시 설치되었으며, AI 부장관의 집행 비서실입니다. 직능: (1) 각 부처 AI 전략 실행 조율; (2) AI Ethics Principles(2022) 및 AI Charter(2024) 발표; (3) UAE AI Camp 등 인재 양성 프로젝트 관리. 판단: 싱가포르 SNDGO(150+ 명 정원)와 비교하면, UAE AI Office 공개 인원 규모는 작습니다(약 50명). 부처 간 협력 집행에 더 의존합니다. 이런 「작은 핵심 + 다중 외부」 모형의 효율성은 왕실 결단과 자본 투입에 달려 있습니다; 싱가포르 SNDGO처럼 제도화된 부처 간 견제와 균형이 없습니다.',
        analysisJa:
          'UAE AI Office は 2017 年に AI 部長と同時期に設立され、AI 部長の実行办公室です。職能：(1) 各部委の AI 戦略実施の調整；(2) AI Ethics Principles（2022）と AI Charter（2024）の発布；(3) UAE AI Camp などの人材プロジェクトの管理。判断：シンガポールの SNDGO（150 人以上の編成）と比較して、UAE AI Office の公開される人員規模はより小さい（約 50 人）で、より多く部門間協力実行に依存しています。この「小さなコアチーム + 多くの外部」モデルの効率は王室決定と資本注入に依存し、シンガポール SNDGO のような制度化された部門間チェック・アンド・バランスではありません。',
        analysisEn:
          "The UAE AI Office was established alongside the AI Minister in 2017 as the Minister's executive office. Functions: (1) coordinating AI strategy implementation across ministries; (2) issuing the AI Ethics Principles (2022) and AI Charter (2024); (3) managing talent programmes such as UAE AI Camp. Assessment: compared with Singapore's SNDGO (~150+ staff), the UAE AI Office's public headcount is smaller (~50) and relies more on cross-agency partnerships for execution. This \"small core + many external\" model's effectiveness depends on royal resolve and capital injection; it lacks the institutionalised inter-agency checks of SNDGO.",
        sources: [
          {
            label: 'UAE AI Strategy 2031（含 AI Office 角色）',
            labelKo: 'UAE AI Strategy 2031(AI Office 역할 포함)',
            labelJa: 'UAE AI Strategy 2031（AI Office の役割を含む）',
            labelEn: 'UAE AI Strategy 2031 (AI Office role)',
            url: 'https://ai.gov.ae/strategy/',
          },
        ],
      },
      'body-3': {
        analysis:
          'ATRC（Advanced Technology Research Council）2020 年由阿布扎比政府成立，是阿联酋前沿技术研发的最高层级机构。下辖：(1) Technology Innovation Institute (TII) — Falcon LLM 的开发主体；(2) ASPIRE — 项目管理与商业化；(3) 多个垂直研究中心（量子、机器人、生物科技等）。判断：ATRC 角色相当于"中央研究院 + 投资机构 + 政策转化"三位一体——在 UAE 这种小政府结构下，ATRC 比 UAE AI Office 更有"做事"权力。Falcon LLM 能在 2023-25 年快速迭代，正是 ATRC 集中决策、绕过传统科研管理流程的结果。',
        analysisKo:
          'ATRC(Advanced Technology Research Council)는 2020년 아부다비 정부에 의해 설립되었으며, 아랍에미리트 선진 기술 연구의 최상위 기구입니다. 산하: (1) Technology Innovation Institute (TII) — Falcon LLM 개발 주체; (2) ASPIRE — 프로젝트 관리와 사업화; (3) 다수의 수직 연구센터(양자, 로봇, 생명공학 등). 판단: ATRC의 역할은 「중앙 연구원 + 투자 기구 + 정책 전환」 삼위일체에 해당합니다. UAE 같은 소규모 정부 구조에서, ATRC는 UAE AI Office보다 「일 하는」 권력이 더 큽니다. Falcon LLM이 2023-25년에 빠르게 반복 개선된 것은 ATRC가 중앙 집중식 의사결정을 하고 전통 과학 관리 프로세스를 우회한 덕입니다.',
        analysisJa:
          'ATRC（Advanced Technology Research Council）は 2020 年にアブダビ政府により設立され、UAE の先端技術研究開発の最高レベルの機関です。傘下には：(1) Technology Innovation Institute（TII）— Falcon LLM の開発主体；(2) ASPIRE — プロジェクト管理と商業化；(3) 量子、ロボット、生物技術などの垂直研究センター。判断：ATRC の役割は「中央研究院 + 投資機関 + 政策転化」の三位一体に相当します。UAE のような小政府構造では、ATRC は UAE AI Office より「実行」の権力を有しています。Falcon LLM が 2023-25 年に迅速に反復できたのは、ATRC の集中的意思決定と従来の研究管理プロセスの回避によります。',
        analysisEn:
          'ATRC (Advanced Technology Research Council) was established by the Abu Dhabi government in 2020 as the UAE\'s top body for frontier-tech R&D. It oversees: (1) Technology Innovation Institute (TII) — the developer of Falcon LLM; (2) ASPIRE — project management and commercialisation; (3) multiple vertical research centres (quantum, robotics, biotech). Assessment: ATRC plays a "central academy + investment vehicle + policy translation" trinity — within the UAE\'s small-government structure, ATRC has more "delivery" authority than the UAE AI Office. Falcon\'s rapid iteration through 2023-25 owes a lot to ATRC\'s centralised decision-making and ability to bypass traditional research-management processes.',
        sources: [
          {
            label: 'TII Falcon LLM 公告',
            labelKo: 'TII Falcon LLM 공지',
            labelJa: 'TII Falcon LLM 発表',
            labelEn: 'TII Falcon LLM announcement',
            url: 'https://www.tii.ae/news/abu-dhabi-based-technology-innovation-institute-introduces-falcon-llm-foundational-large',
            date: '2023-05-25',
          },
        ],
      },
      'body-4': {
        analysis:
          'Mubadala（Mubadala Investment Company）是阿布扎比主权财富基金，2017 年由 Mubadala Development + IPIC 合并而来，AUM 约 US$3000 亿（2024）。在 AI 领域的角色：(1) MGX 基金的两大出资方之一（与 G42 并列）；(2) 持有 GlobalFoundries（半导体代工）、AMD（早期）、Mistral 等 AI 相关持仓；(3) 与全球资本市场对接的核心通道。判断：Mubadala 是 UAE AI 战略的"老钱"——比 G42（成立 2018）资历老、与西方金融圈关系深。MGX 由 Mubadala + G42 双轨出资意味着 UAE 把"传统主权资本（Mubadala）+ 新兴 AI 资本（G42）"打包，对外形成统一前线。',
        analysisKo:
          'Mubadala(Mubadala Investment Company)는 아부다비 주권자산펀드로, 2017년 Mubadala Development + IPIC 합병으로 설립되었으며, AUM은 약 US$3,000억(2024)입니다. AI 영역에서의 역할: (1) MGX 펀드의 두 대출처 중 하나(G42와 동등); (2) GlobalFoundries(반도체 파운드리), AMD(초기), Mistral 등 AI 관련 지분 보유; (3) 글로벌 자본시장과의 핵심 연결 채널. 판단: Mubadala는 UAE AI 전략의 「구자본」으로, G42(2018년 설립)보다 자격이 오래되었으며 서방 금융계와의 관계가 깊습니다. MGX의 Mubadala + G42 이중 출자는 UAE가 「전통 주권자본(Mubadala) + 신흥 AI 자본(G42)」을 패키징하여 외부에 통일된 전선을 형성함을 의미합니다.',
        analysisJa:
          'Mubadala（Mubadala Investment Company）はアブダビのソブリンウェルス基金で、2017 年に Mubadala Development + IPIC の統合により設立され、AUM は約 US$3000 億（2024）です。AI 領域での役割：(1) MGX 基金の 2 大出資者の一つ（G42 と並列）；(2) GlobalFoundries（半導体ファウンドリ）、AMD（初期）、Mistral などの AI 関連ポジションの保有；(3) グローバル資本市場との接続の核心チャネル。判断：Mubadala は UAE AI 戦略の「旧式マネー」です。資歴が Mubadala より新しい G42（2018 年設立）より古く、西側の金融圏との関係が深いです。MGX が Mubadala + G42 の二重チャネル出資であることは、UAE が「伝統的ソブリン資本（Mubadala）+ 新興 AI 資本（G42）」をパッケージ化し、対外的に統一した前線を形成することを意味しています。',
        analysisEn:
          'Mubadala (Mubadala Investment Company) is Abu Dhabi\'s sovereign wealth fund, formed in 2017 from the merger of Mubadala Development + IPIC, with AUM of roughly US$300bn (2024). Its AI role: (1) one of MGX\'s two backers (alongside G42); (2) it holds AI-relevant positions including GlobalFoundries (semiconductor foundry), AMD (early-stage), and Mistral; (3) the core channel into global capital markets. Assessment: Mubadala is the UAE AI strategy\'s "old money" — older than G42 (founded 2018) and deeply networked into Western finance. The dual MGX backing by Mubadala + G42 packages "traditional sovereign capital (Mubadala) + emerging AI capital (G42)" into a unified front.',
        sources: [
          {
            label: 'MGX 基金背景（Wikipedia，含 Mubadala 角色）',
            labelKo: 'MGX 펀드 배경(Wikipedia, Mubadala 역할 포함)',
            labelJa: 'MGX 基金背景（Wikipedia、Mubadala の役割を含む）',
            labelEn: 'MGX overview (Wikipedia, Mubadala role)',
            url: 'https://en.wikipedia.org/wiki/MGX_Fund_Management_Limited',
          },
        ],
      },
    },
  },
  {
    flag: '🇮🇱',
    name: '以色列',
    nameKo: '이스라엘',
    nameJa: 'イスラエル',
    nameEn: 'Israel',
    fullName: '以色列国',
    fullNameKo: '이스라엘국',
    fullNameJa: 'イスラエル国',
    fullNameEn: 'State of Israel',
    overview:
      '"创业之国"在 AI 领域拥有全球最高的创业密度和传奇的 8200 部队人才管线，但面临严重的执行缺口——NIS 52.6 亿的国家计划仅花出 20%，没有可用的国家级超算。',
    overviewKo:
      '「스타트업의 나라」는 AI 영역에서 전 세계 최고 수준의 스타트업 밀도와 전설적인 8200 부대 인재 파이프라인을 보유하고 있지만, 심각한 실행 격차에 직면해 있습니다. NIS 52.6억 규모의 국가 계획은 단 20%만 지출했으며, 사용 가능한 국가급 슈퍼컴퓨팅이 없습니다.',
    overviewJa:
      '「スタートアップ国家」は AI 領域で世界最高の起業密度と伝説的な 8200 部隊人材パイプラインを有していますが、深刻な実行ギャップに直面しています。NIS 52.6 億の国家計画はわずか 20% しか支出されておらず、利用可能な国家級スーパーコンピュータはありません。',
    overviewEn:
      'The "Startup Nation" has the world\'s highest startup density in AI and the legendary Unit 8200 talent pipeline, but faces a severe execution gap — only 20% of the NIS 5.26 billion national programme has been spent, and there is no operational national supercomputer.',
    strategies: [
      {
        name: '国家 AI 计划',
        nameKo: '국가 AI 계획',
        nameJa: '国家 AI 計画',
        nameEn: 'National AI Program',
        year: '2021',
        description: 'NIS 52.6 亿五年计划，涵盖算力、人才、研发',
        descriptionKo: 'NIS 52.6억 5년 계획, 컴퓨팅 파워, 인재, R&D 포함',
        descriptionJa: 'NIS 52.6 億 5 年計画、コンピューティング能力、人材、研究開発を包含',
        descriptionEn: 'NIS 5.26 billion five-year plan covering compute, talent and R&D',
      },
      {
        name: 'AI 监管与伦理政策',
        nameKo: 'AI 규제 및 윤리 정책',
        nameJa: 'AI 規制と倫理政策',
        nameEn: 'AI Policy on Regulation & Ethics',
        year: '2023',
        description: '行业自律为主的监管框架',
        descriptionKo: '업계 자율규제 중심 규제 프레임워크',
        descriptionJa: '業界自律を主とした規制枠組み',
        descriptionEn: 'Regulatory framework relying primarily on industry self-regulation',
      },
    ],
    investment: [
      {
        item: '国家 AI 计划预算',
        itemKo: '국가 AI 계획 예산',
        itemJa: '国家 AI 計画予算',
        itemEn: 'National AI Program Budget',
        amount: 'NIS 52.6 亿 (~$14.8 亿)',
        amountKo: 'NIS 52.6억(~$14.8억)',
        amountJa: 'NIS 52.6 億 (~$14.8 億)',
        amountEn: 'NIS 5.26 billion (~US$1.48 billion)',
        note: '五年期，实际仅支出 $2.81 亿（~20%）',
        noteKo: '5년 기간, 실제 지출은 $2.81억(~20%)',
        noteJa: '5 年間、実際の支出は $2.81 億 (~20%) のみ',
        noteEn: 'Five-year programme; only US$281 million actually spent (~20%)',
      },
      {
        item: '超算中心（Nebius）',
        itemKo: '슈퍼컴퓨팅 센터(Nebius)',
        itemJa: 'スーパーコンピューティングセンター（Nebius）',
        itemEn: 'Supercomputing Centre (Nebius)',
        amount: '$1.4 亿',
        amountKo: '$1.4억',
        amountJa: '$1.4 億',
        amountEn: 'US$140 million',
        note: '与 Nebius 合建，仍在建设中',
        noteKo: 'Nebius와 공동 구축, 여전히 건설 중',
        noteJa: 'Nebius と共同建設、現在も建設中',
        noteEn: 'Built jointly with Nebius; still under construction',
      },
    ],
    governance:
      '以色列采取软法模式，倾向行业自治，没有水平性 AI 立法。各行业监管机构（如银行业、医疗）各自发布 AI 指引。政治不稳定性严重影响了政策执行的连续性和效率。',
    governanceKo:
      '이스라엘은 소프트 로 모드를 채택하여 업계 자율성을 선호하며, 수평적 AI 입법이 없습니다. 각 산업 규제기관(예: 은행업, 의료)이 각각 AI 지침을 발표합니다. 정치적 불안정성은 정책 실행의 연속성과 효율성에 심각한 영향을 미쳤습니다.',
    governanceJa:
      'イスラエルはソフトロー・モデルを採用し、業界の自治を志向し、水平的 AI 法制を持っていません。各業界の規制当局（銀行業や医療など）はそれぞれ AI ガイダンスを発表しています。政治的不安定性は、政策実施の継続性と効率に深刻な影響を与えています。',
    governanceEn:
      'Israel takes a soft-law approach favouring industry self-regulation, with no horizontal AI legislation. Sectoral regulators (banking, healthcare, etc.) issue their own AI guidance. Political instability has severely undermined the continuity and efficiency of policy execution.',
    keyInitiatives: [
      '8200 部队 AI 人才孵化管线',
      '国家 AI 计划五大支柱',
      'Nebius 超算中心建设',
      '创新局（IIA）AI 创业扶持',
    ],
    keyInitiativesEn: [
      'Unit 8200 AI talent incubation pipeline',
      'Five pillars of the National AI Program',
      'Nebius supercomputing centre construction',
      'Israel Innovation Authority (IIA) AI startup support',
    ],
    strengths: [
      '创业密度全球最高，AI 创业生态极其活跃',
      '8200 部队等军事情报单位提供顶尖 AI 人才',
      'Wiz（$320 亿被 Google 收购）等独角兽展示了创业实力',
      '在网络安全 AI 领域全球领先',
    ],
    strengthsEn: [
      "World's highest startup density; an extremely active AI startup scene",
      'Military intelligence units such as Unit 8200 supply top-tier AI talent',
      'Unicorns like Wiz (acquired by Google for US$32 billion) showcase entrepreneurial strength',
      'Global leader in cybersecurity AI',
    ],
    weaknesses: [
      '国家计划执行严重滞后，预算执行率仅 20%',
      '无可用的国家级超算（新加坡已有 NSCC）',
      '政治动荡影响政策连续性',
      '小国市场，企业多选择海外（尤其美国）上市发展',
    ],
    weaknessesEn: [
      'National programme execution severely lags; only 20% of budget spent',
      'No operational national supercomputer (Singapore has NSCC)',
      'Political turmoil disrupts policy continuity',
      'Small home market; firms typically list and scale overseas (especially in the US)',
    ],
    keyBodies: [
      {
        name: 'MIST（创新科技部）',
        nameKo: 'MIST(혁신과학기술부)',
        nameJa: 'MIST（イノベーション・テクノロジー部）',
        nameEn: 'MIST (Ministry of Innovation, Science and Technology)',
        role: 'AI 政策主管部门',
        roleKo: 'AI 정책 담당 부서',
        roleJa: 'AI 政策主管部門',
        roleEn: 'Lead ministry for AI policy',
      },
      {
        name: 'IIA（创新局）',
        nameKo: 'IIA(혁신청)',
        nameJa: 'IIA（イノベーションオーソリティ）',
        nameEn: 'IIA (Israel Innovation Authority)',
        role: 'AI 创业与创新资助',
        roleKo: 'AI 스타트업 및 혁신 지원',
        roleJa: 'AI 創業と革新助成',
        roleEn: 'AI startup and innovation funding',
      },
      {
        name: 'Bank of Israel',
        nameEn: 'Bank of Israel',
        role: '金融 AI 监管',
        roleKo: '금융 AI 규제',
        roleJa: '金融AI規制',
        roleEn: 'Financial AI regulation',
      },
    ],
    sources: [
      'Israel National AI Program（2021）',
      'State Comptroller AI Report（2024）',
      'AI Policy on Regulation & Ethics（2023）',
    ],
    sourcesEn: [
      'Israel National AI Program (2021)',
      'State Comptroller AI Report (2024)',
      'AI Policy on Regulation & Ethics (2023)',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '以色列 AI 战略是"世界级供给 + 公共协调薄弱"的组合：(1) 国家 AI 计划（NIS 52.6 亿 / ~US$14.8 亿，五年期，2021-2026）是顶层叙事；(2) 国家审计长 2024 报告披露实际支出仅 ~20%——严重执行缺口；(3) 2024 年第二阶段启动，NIS 5 亿专项 R&D 基础设施（含国家 AI 研究院），覆盖到 2027 年；(4) 8200 部队与 IDF 情报单位输出全球少见的前沿工程师人才管线；(5) 网络安全 AI 全球领先（Wiz 2025 年被 Google 以 US$320 亿收购）。判断：以色列 AI 由"私部门 + 军方供给"主导，不是国家级协调主导。相对新加坡 SNDGO 自上而下模式，以色列 AI 战略实际寄居在创业社群里，国家角色更接近兜底而非主导。',
        analysisKo:
          '이스라엘 AI 전략은 「세계 수준의 공급 + 약한 공공 조정」의 조합입니다: (1) 국가 AI 계획(NIS 52.6억 / ~US$14.8억, 5년 기간, 2021-2026)은 최고 수준의 내러티브입니다; (2) 2024년 국가감시관 보고서는 실제 지출이 ~20%에 불과함을 밝혔으며, 심각한 실행 격차가 존재합니다; (3) 2024년 2단계 출범으로 NIS 5억 전용 R&D 기초시설(국가 AI 연구원 포함), 2027년까지 적용 범위 확대; (4) 8200 부대와 IDF 정보 부대는 전 세계 드물게 볼 수 있는 첨단 엔지니어 인재 파이프라인을 배출합니다; (5) 네트워크 보안 AI 분야에서 전 세계 선도(Wiz는 2025년 Google에 US$320억에 인수됨). 판단: 이스라엘 AI는 「민간부문 + 군방 공급」이 주도하며, 국가급 조정이 주도하지 않습니다. 싱가포르 SNDGO 하향식 모드와 비교하면, 이스라엘 AI 전략은 실제로 스타트업 커뮤니티에 거주하며, 국가의 역할은 안전장치에 더 가깝고 주도적이지 않습니다.',
        analysisJa:
          'イスラエルの AI 戦略は「ワールドクラスの供給＋公的調整の弱さ」の組み合わせです：(1) 国家 AI 計画（NIS 52.6 億 / 約 US$14.8 億、5 年間、2021-2026）はトップレベルの叙述です；(2) 国家監査官 2024 年報告書は実際の支出が約 20% のみであることを開示し――重大な実行ギャップがあります；(3) 2024 年第 2 段階が始まり、NIS 5 億の特別 R&D インフラストラクチャー（国家 AI 研究所を含む）が 2027 年までカバーします；(4) Unit 8200 と IDF インテリジェンス部門は世界的に珍しい最先端エンジニア人材パイプラインを輩出しています；(5) サイバーセキュリティ AI は世界をリードしています（Wiz は 2025 年に Google に US$320 億で買収されました）。判断：イスラエルの AI は「民間部門＋軍事部門の供給」が主導し、国家レベルの調整主導ではありません。シンガポールの SNDGO のトップダウン・モデルと比較して、イスラエルの AI 戦略は実際にはスタートアップコミュニティに寄生し、国家の役割は主導というより底支えに近いです。',
        analysisEn:
          "Israel's AI strategy is \"world-class supply meets weak public coordination\": (1) the National AI Program (NIS 5.26bn / ~US$1.48bn over five years, 2021-2026) sets the headline framing; (2) the State Comptroller's 2024 report flagged actual disbursement at only ~20% — a severe execution gap; (3) Phase 2 launched in 2024 with NIS 500m for R&D infrastructure (a National AI Research Institute) running through 2027; (4) Unit 8200 and adjacent IDF intelligence units feed an unmatched pipeline of frontier engineering talent; (5) cybersecurity AI is a global lead (Wiz acquired by Google for US$32bn in 2025). Assessment: Israel's AI is dominated by private and military supply, not by national coordination. Compared with Singapore's SNDGO-led top-down model, Israel's AI strategy effectively lives in the founder community, with the state acting more like a backstop than a coordinator.",
        sources: [
          {
            label: 'OECD.AI 国家 AI 计划记录',
            labelKo: 'OECD.AI 국가 AI 계획 기록',
            labelJa: 'OECD.AI 国家 AI 計画記録',
            labelEn: 'OECD.AI National AI Program record',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
          {
            label: '以色列创新局：第二阶段 NIS 5 亿',
            labelKo: '이스라엘 혁신청: 2단계 NIS 5억',
            labelJa: 'イスラエル・イノベーション局：第 2 段階 NIS 5 億',
            labelEn: 'Israel Innovation Authority: Phase 2 NIS 500m',
            url: 'https://innovationisrael.org.il/en/press_release/second-phase-ai-program/',
          },
          {
            label: '国家 AI 计划官方说明（PDF）',
            labelKo: '국가 AI 계획 공식 설명(PDF)',
            labelJa: '国家 AI 計画公式説明（PDF）',
            labelEn: 'National AI Program brief (PDF)',
            url: 'https://innovationisrael.org.il/wp-content/uploads/2025/05/AI-National-Program-en-14.5.25.pdf',
            date: '2025-05-14',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '以色列公开 AI 投资可概括为"大计划、弱执行"：(1) 国家 AI 计划承诺 NIS 52.6 亿（~US$14.8 亿）五年期（2021-2026），但国家审计长 2024 数据显示截至 2023 年底实际支出仅 US$2.81 亿（~20%）；(2) 第二阶段新增 NIS 5 亿（~US$1.4 亿）专项国家 AI 研究院 + 超算，覆盖 2024-2027；(3) Nebius 超算中心由政府部分支持，规模约 US$1.4 亿，仍在建设中。判断：以色列公开 AI 总投入约 US$10-15 亿区间——头条规模与新加坡相当。独特问题是执行缺口：3 年只交付 20%，反映创新部 / IIA / IDF 之间的协调失败，而非预算缺口。',
        analysisKo:
          '이스라엘의 공개 AI 투자는 「대계획, 약한 실행」으로 요약할 수 있습니다: (1) 국가 AI 계획은 NIS 52.6억(~US$14.8억) 5년 기간(2021-2026)을 약속했으나, 2024년 국가감시관 데이터에 따르면 2023년 말 현재 실제 지출은 US$2.81억(~20%)에 불과합니다; (2) 2단계에서 NIS 5억(~US$1.4억)이 신규로 추가되어 전용 국가 AI 연구원 + 슈퍼컴퓨팅을 포함하며, 2024-2027년을 적용 범위로 합니다; (3) Nebius 슈퍼컴퓨팅 센터는 정부 부분 지원으로, 규모는 약 US$1.4억이며, 여전히 건설 중입니다. 판단: 이스라엘의 공개 AI 총 투자는 약 US$10-15억 범위입니다. 주요 규모는 싱가포르와 비슷합니다. 독특한 문제는 실행 격차입니다: 3년 동안 20%만 지출했으며, 이는 혁신부 / IIA / IDF 간의 조율 실패를 반영하며, 예산 부족이 아닙니다.',
        analysisJa:
          'イスラエルの公開 AI 投資は「大計画、弱い実行」と要約できます：(1) 国家 AI 計画は NIS 52.6 億（約 US$14.8 億）5 年間（2021-2026）を約束していますが、国家監査官の 2024 年データは 2023 年末時点の実際の支出が US$2.81 億のみ（約 20%）であることを示しています；(2) 第 2 段階では NIS 5 億（約 US$1.4 億）の新規追加を国家 AI 研究所＋スーパーコンピューティングに充当し、2024-2027 年をカバーします；(3) Nebius スーパーコンピューティング・センターは政府部分資金で支援され、規模は約 US$1.4 億で、現在建設中です。判断：イスラエルの公開 AI 総投資は約 US$10～15 億の範囲です――見出し規模はシンガポールと同等です。独特な課題は実行ギャップです：3 年間で 20% しか達成できず、予算不足ではなく、創新部 / IIA / IDF 間の調整失敗を反映しています。',
        analysisEn:
          'Israel\'s public AI investment is best understood as "big plan, weak execution": (1) the National AI Program announced NIS 5.26bn (~US$1.48bn) over five years (2021-2026), but State Comptroller 2024 figures show only US$281m (~20%) actually spent through end-2023; (2) Phase 2 added NIS 500m (~US$140m) targeted at the National AI Research Institute and supercompute, running 2024-2027; (3) the Nebius supercomputing centre is partly state-supported, also at ~US$140m, and still under construction. Assessment: total publicly disclosed Israeli AI spend is in the order of US$1-1.5bn — comparable to Singapore in headline scale. The execution gap is the unique problem: 20% delivery in three years signals coordination breakdown across Innovation Ministry / IIA / IDF, not a budget gap.',
        sources: [
          {
            label: '第二阶段 NIS 5 亿（Innovation Authority）',
            labelKo: '2단계 NIS 5억(Innovation Authority)',
            labelJa: '第 2 段階 NIS 5 億（イノベーション局）',
            labelEn: 'Phase 2 NIS 500m (Innovation Authority)',
            url: 'https://innovationisrael.org.il/en/press_release/second-phase-ai-program/',
          },
          {
            label: 'OECD.AI National AI Program',
            labelEn: 'OECD.AI National AI Program record',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'governance-model': {
        analysis:
          '以色列 AI 治理是本基准集中最自由放任的模式：(1) 没有水平性 AI 立法；(2) 2023 年的"AI 监管与伦理政策"确立"行业自治"原则，由以色列央行、卫生部等各发指引；(3) 政治不稳定（2022 年起多次内阁更迭）阻断了统一立法的推进。判断：以色列治理最接近美国"行业监管 + 行政命令"模式，而非新加坡"框架 + 工具化"路径。优势是 AI 创业零合规摩擦——这是以色列创业密度领先的因素之一。劣势是面向欧盟客户的跨境 AI 服务，以色列企业越来越需要在原有合规之上叠加 EU AI Act 合规，等于付双倍成本。',
        analysisKo:
          '이스라엘 AI 거버넌스는 이 기준 집합 중 가장 자유로운 방임형 모드입니다: (1) 수평적 AI 입법이 없습니다; (2) 2023년의 「AI 규제 및 윤리 정책」은 「업계 자율성」 원칙을 확립했으며, 이스라엘 중앙은행, 보건부 등이 각각 지침을 발표합니다; (3) 정치적 불안정성(2022년부터 여러 내각 교체)은 통일된 입법 추진을 차단했습니다. 판단: 이스라엘 거버넌스는 미국의 「산업 규제 + 행정 명령」 모드와 가장 유사하며, 싱가포르의 「프레임워크 + 도구화」 경로는 아닙니다. 장점은 AI 스타트업에 대한 규정 준수 마찰이 없다는 것입니다. 이는 이스라엘의 스타트업 밀도 선도 요인 중 하나입니다. 단점은 EU 고객을 대상으로 하는 국경 간 AI 서비스에 대해 이스라엘 기업이 기존 규정 준수 위에 EU AI Act 규정 준수를 계속해서 쌓아야 한다는 것입니다. 이는 이중 비용을 지불하는 것과 같습니다.',
        analysisJa:
          'イスラエルの AI ガバナンスは、このベンチマーク集の中でも最も自由放任的なモデルです：(1) 水平的 AI 法制がありません；(2) 2023 年の「AI 規制とエシックス政策」は「業界自治」原則を確立し、イスラエル中央銀行、保健省など各部門がそれぞれガイドラインを発行しています；(3) 政治不安定性（2022 年以降の複数内閣更迭）は統一的な法制化を阻止しています。判断：イスラエル・ガバナンスは最もアメリカの「業界規制＋行政命令」モデルに近く、シンガポールの「枠組み＋ツール化」経路ではありません。利点は AI 起業がゼロ合規摩擦であることです――これはイスラエルの起業密度がリードしている要因の一つです。欠点は EU クライアント向けのクロスボーダー AI サービスに関して、イスラエル企業はますます既存の合規に加えて EU AI Act 合規を重ねて適用する必要があり、実質的に二重コスト負担になります。',
        analysisEn:
          'Israel\'s AI governance is the most laissez-faire model in this benchmark set: (1) no horizontal AI legislation; (2) the 2023 "AI Policy on Regulation and Ethics" doc establishes a sector-by-sector self-regulation principle, leaving Bank of Israel, healthcare ministries, etc. to publish their own guidance; (3) political instability (multiple cabinet turnovers since 2022) has prevented a coherent push toward statutory AI rules. Assessment: Israel\'s governance is closest to the US "sectoral regulators + executive orders" pattern rather than Singapore\'s framework-led toolised approach. The upside is zero compliance friction for AI startups — likely a contributor to Israel\'s startup density advantage. The downside is that for cross-border AI services aimed at EU customers, Israeli firms increasingly need to layer EU AI Act compliance on top, paying twice.',
        sources: [
          {
            label: 'OECD.AI National AI Program record',
            labelEn: 'OECD.AI National AI Program record',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
          {
            label: 'Israel Innovation Authority',
            labelEn: 'Israel Innovation Authority',
            url: 'https://innovationisrael.org.il/en/',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          '以色列相对新加坡的核心杠杆是"私部门 + 军方供给"：(1) 全球 AI 创业密度第一，特拉维夫长期位列全球 AI 风险投资 Top 5；(2) 8200 部队校友创立 1000+ 公司，含 Check Point、Nice Systems、Wiz；Wiz 2025 年被 Google 以 US$320 亿收购，是全球最大的纯 AI 退出；(3) 全球网络安全-AI 龙头——以色列网安 + AI 出口约占全球 cybersecurity 营收的 10%；(4) 希伯来大学、Technion、特拉维夫大学的深度 ML 研究底子。短板：国家计划严重执行缺口（20% 实际支出）、没有可用国家级超算（新加坡有 NSCC）、小国市场迫使成功 AI 企业迁美上市。判断：以色列和新加坡玩的是不同游戏——以色列出口 AI 工程 + 网安产品，新加坡出口 AI 治理 + 信任。两者都是全球级强项，赛道几乎不重叠。',
        analysisKo:
          '이스라엘의 싱가포르에 대한 핵심 레버는 「민간부문 + 군방 공급」입니다: (1) 세계 AI 스타트업 밀도 1위, 텔아비브는 오랫동안 세계 AI 벤처자본 Top 5에 위치; (2) 8200 부대 동문이 1,000+ 개의 회사를 설립했으며, Check Point, Nice Systems, Wiz를 포함합니다; Wiz는 2025년 Google에 US$320억에 인수되었으며, 세계 최대의 순수 AI 종료입니다; (3) 세계 사이버보안-AI 리더입니다. 이스라엘의 사이버보안 + AI 수출은 세계 사이버보안 매출의 약 10%를 차지합니다; (4) Hebrew University, Technion, Tel Aviv University의 깊은 ML 연구 기초. 약점: 국가 계획의 심각한 실행 격차(20% 실제 지출), 사용 가능한 국가급 슈퍼컴퓨팅 없음(싱가포르는 NSCC 보유), 소국 시장으로 인해 성공한 AI 기업이 미국으로 상장을 옮기도록 강제합니다. 판단: 이스라엘과 싱가포르는 다른 게임을 하고 있습니다. 이스라엘은 AI 엔지니어링 + 사이버보안 제품을 수출하고, 싱가포르는 AI 거버넌스 + 신뢰를 수출합니다. 둘 다 세계 수준의 강점이며, 경로는 거의 겹치지 않습니다.',
        analysisJa:
          'シンガポールに対するイスラエルの核心的レバーは「民間部門＋軍事部門の供給」です：(1) グローバル AI 起業密度は第 1 位で、テルアビブは長期的にグローバル AI ベンチャー投資 Top 5 に位置しています；(2) Unit 8200 部隊の卒業生は 1,000 社以上の企業を設立しており、Check Point、Nice Systems、Wiz を含みます；Wiz は 2025 年に Google に US$320 億で買収され、グローバル最大の純粋 AI 出口となりました；(3) グローバル・サイバーセキュリティ-AI 業界のリーダーです――イスラエルのネットワークセキュリティ＋AI 出口はグローバル・サイバーセキュリティ売上の約 10% を占めます；(4) ヘブライ大学、Technion、テルアビブ大学の深い深層 ML 研究の基盤があります。短所：国家計画の重大な実行ギャップ（20% 実績支出）、利用可能な国家級スーパーコンピュータがない（シンガポールには NSCC があります）、小国市場は成功した AI 企業を米国上場に迫ります。判断：イスラエルとシンガポールは異なるゲームをプレイしています――イスラエルは AI エンジニアリング＋ネットワークセキュリティ製品を輸出し、シンガポールは AI ガバナンス＋信頼を輸出しています。両者ともグローバル級の強項であり、レースコースはほぼ重複しません。',
        analysisEn:
          "Israel's edge over Singapore is \"private + military supply\": (1) the world's highest startup density in AI, with Tel Aviv consistently in the global Top 5 for AI venture capital; (2) Unit 8200 alumni have founded 1 000+ companies including Check Point, Nice Systems, Wiz; Wiz's US$32bn Google acquisition in 2025 is the largest pure-AI exit globally; (3) global cybersecurity-AI lead — Israel's combined cyber + AI export is roughly 10% of global cybersecurity revenue; (4) deep ML research bench at Hebrew University, Technion, Tel Aviv University. Weaknesses: severe execution gap on national programmes (20% spend), no operational national supercompute (whereas Singapore has NSCC), small home market drives most successful AI firms to relocate to the US. Assessment: Israel and Singapore play different games — Israel exports AI engineering and cybersecurity products; Singapore exports AI governance and trust. They are non-overlapping strengths, both globally relevant.",
        sources: [
          {
            label: 'Unit 8200 概览（Wikipedia）',
            labelKo: 'Unit 8200 개요(Wikipedia)',
            labelJa: 'Unit 8200 概要（Wikipedia）',
            labelEn: 'Unit 8200 overview (Wikipedia)',
            url: 'https://en.wikipedia.org/wiki/Unit_8200',
          },
          {
            label: 'OECD.AI 国家 AI 计划',
            labelKo: 'OECD.AI 국가 AI 계획',
            labelJa: 'OECD.AI 国家 AI 計画',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'strategy-1': {
        analysis:
          '国家 AI 计划 2021 年由创新局 + 创新部启动，NIS 52.6 亿 / 2021-2026 五年期。五大支柱：研究卓越、AI 超算、人才管线、公部门 AI、AI 伦理与可信 AI。第二阶段 2024 年启动（NIS 5 亿 / 2024-2027）专项国家 AI 研究院。判断：框架完整但执行滞后——截至 2024 年公开数据，原计划 NIS 52.6 亿仅落地 ~20%（国家审计长报告）。诊断是结构性：联合政府多次更迭反复延迟预算通过，且没有新加坡 SNDGO 那种长期政治背书。',
        analysisKo:
          '국가 AI 계획은 2021년 혁신국 및 혁신부에 의해 시작되었으며, NIS 52.6억/2021-2026년 5년 기간으로 진행됩니다. 다섯 가지 주요 기둥은 연구 우수성, AI 슈퍼컴퓨팅, 인재 파이프라인, 공공부문 AI, AI 윤리 및 신뢰 가능 AI입니다. 2단계는 2024년에 시작되었으며(NIS 5억/2024-2027년), 국가 AI 연구원을 특정합니다. 판단: 프레임워크는 완전하나 집행이 지연되고 있습니다. 2024년 공개 데이터 기준 원래 계획한 NIS 52.6억 중 약 20%만 실현되었습니다(국가감사원 보고서). 진단은 구조적입니다: 연립정부가 여러 차례 교체되면서 예산 의결이 반복적으로 지연되었으며, 싱가포르의 SNDGO 같은 장기적 정치적 지원이 없습니다.',
        analysisJa:
          '国家 AI 計画は 2021 年に創新局＋創新部によって開始され、NIS 52.6 億 / 2021-2026 年の 5 年間です。5 つの柱：研究卓越性、AI スーパーコンピューティング、人材パイプライン、公共部門 AI、AI エシックス＆トラスト AI。第 2 段階は 2024 年に開始（NIS 5 億 / 2024-2027）国家 AI 研究所専用 R&D インフラストラクチャーに充当。判断：枠組みは完全ですが、実行は遅れています――2024 年の公開データの時点で、元計画 NIS 52.6 億はわずか約 20% が実行されています（国家監査官報告書）。診断は構造的です：連立政府が複数回の更迭により予算承認を繰り返し延期し、シンガポールの SNDGO のような長期的な政治的後援がありません。',
        analysisEn:
          "Israel's National AI Program was launched in 2021 by the Innovation Authority + Ministry of Innovation, with NIS 5.26bn over 2021-2026. Five pillars: research excellence, AI supercompute, talent pipeline, AI in the public sector, AI ethics and trustworthy AI. Phase 2 launched in 2024 (NIS 500m, 2024-2027) targets the National AI Research Institute. Assessment: the framing is comprehensive but execution lags — by 2024 only ~20% of the headline NIS 5.26bn had been disbursed (per State Comptroller). The diagnosis is structural: rotating coalitions have repeatedly delayed budget approvals, and there is no equivalent of Singapore SNDGO with sustained political backing.",
        sources: [
          {
            label: 'OECD.AI National AI Program',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
          {
            label: '国家 AI 计划简报（PDF）',
            labelKo: '국가 AI 계획 브리핑(PDF)',
            labelJa: '国家 AI 計画ブリーフ（PDF）',
            labelEn: 'National AI Program brief (PDF)',
            url: 'https://innovationisrael.org.il/wp-content/uploads/2025/05/AI-National-Program-en-14.5.25.pdf',
            date: '2025-05-14',
          },
        ],
      },
      'strategy-2': {
        analysis:
          '2023 年"AI 监管与伦理政策"由创新科技部发布。核心立场：行业自治、无水平性立法、鼓励自愿采纳 OECD AI Principles。文件明确提到"避免对 AI 产业增加约束"为设计目标。判断：这是发达国家中最偏产业自由的立场——比美国行政命令路径更宽松。优势是保持以色列创业引擎零摩擦；劣势是 EU AI Act 落地后，以色列出口型 AI 服务面临双轨合规成本。',
        analysisKo:
          '2023년 혁신기술부에서 「AI 규제 및 윤리 정책」을 발표했습니다. 핵심 입장: 산업 자율 규제, 수평적 입법 없음, OECD AI 원칙의 자발적 채택 권장. 문서는 명시적으로 「AI 산업에 제약을 추가하지 않음」을 설계 목표로 언급합니다. 판단: 이는 선진국 중에서 가장 산업 자유주의적 입장입니다. 미국의 행정 명령 경로보다 더 완화적입니다. 장점은 이스라엘 스타트업 엔진의 마찰 없는 운영을 유지하는 것입니다. 단점은 EU AI Act 시행 후, 이스라엘 수출형 AI 서비스가 이중 규정 준수 비용에 직면한다는 것입니다.',
        analysisJa:
          '2023 年の「AI 規制とエシックス政策」は創新科技部によって発行されました。核心的立場：業界自治、水平的 AI 法制がない、OECD AI 原則の自発的採納を奨励。文書は明確に「AI 産業への制約追加を回避する」を設計目標として言及しています。判断：これは先進国の中で最も産業自由寄りの立場です――米国の行政命令経路よりもさらに寛容です。利点はイスラエルのスタートアップエンジンのゼロ摩擦を維持することです；欠点は EU AI Act 発効後、イスラエルの輸出型 AI サービスは双軌合規コストに直面することです。',
        analysisEn:
          'The 2023 "AI Policy on Regulation and Ethics" was published by the Ministry of Innovation, Science and Technology. Core stance: sector-by-sector self-regulation, no horizontal AI law, encouragement of voluntary adoption of OECD AI Principles. The doc explicitly cites "avoiding constraints on the AI industry" as a design goal. Assessment: this is the most pro-industry stance among advanced economies — even more permissive than the US executive-order approach. The upside is keeping Israel\'s startup engine free of friction; the downside, post-EU AI Act, is that exporters face dual-track compliance pain.',
        sources: [
          {
            label: 'OECD.AI 国家 AI 计划记录',
            labelKo: 'OECD.AI 국가 AI 계획 기록',
            labelJa: 'OECD.AI 国家 AI 計画記録',
            labelEn: 'OECD.AI National AI Program record',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'investment-1': {
        analysis:
          'NIS 52.6 亿（~US$14.8 亿）国家 AI 计划预算需对照实际支出来看：国家审计长 2024 审计显示截至 2023 年底实际仅支出 ~US$2.81 亿（~20%）。剩余 80% 滞留在未拨付线或停滞的采购中。判断：差距反映创新部 / IIA / IDF / 央行之间的协调失败，而非反 AI 政治力量。没有 SNDGO 式的 empowered owner，预算大多停在头条上。新加坡 S$20 亿+ AI 直投执行不同，因为 SNDGO 拥有明确的项目权威。',
        analysisKo:
          'NIS 52.6억(약 US$14.8억) 국가 AI 계획 예산을 실제 지출액과 대조하여 살펴봐야 합니다: 국가감사원의 2024년 감사에 따르면 2023년 말 기준 실제 지출액은 약 US$2.81억(약 20%)에 불과합니다. 나머지 80%는 미지급 상태이거나 정체된 구매에 남아있습니다. 판단: 차이는 혁신부/IIA/IDF/중앙은행 간의 조정 실패를 반영하며, AI 반대 정치 세력 때문이 아닙니다. SNDGO 형의 권한 있는 소유자가 없어서 대부분의 예산이 헤드라인에만 남아있습니다. 싱가포르의 S$20억 이상의 AI 직접투자 집행이 다른 이유는 SNDGO가 명확한 프로젝트 권한을 가지고 있기 때문입니다.',
        analysisJa:
          'NIS 52.6 億（約 US$14.8 億）の国家 AI 計画予算は実際の支出と対比する必要があります：国家監査官 2024 年監査は 2023 年末時点の実績が約 US$2.81 億のみ（約 20%）であることを示しています。残りの 80% は未配分の行または停滞した調達に留まっています。判断：このギャップは創新部 / IIA / IDF / 中央銀行間の調整失敗を反映し、反 AI 政治勢力ではありません。SNDGO 式の権限を与えられたオーナーがなく、予算のほとんどは見出しに留まります。シンガポールの S$20 億以上の AI 直接投資の実行は異なっています。SNDGO はプロジェクト権限が明確であるためです。',
        analysisEn:
          "Israel's headline NIS 5.26bn (~US$1.48bn) National AI Program budget needs to be read against actual outturn: State Comptroller's 2024 audit found just ~US$281m (~20%) had been disbursed through end-2023. The remaining 80% sits in unappropriated lines or stalled procurement. Assessment: the gap reflects coordination failure across Innovation Ministry / IIA / IDF / Bank of Israel rather than political opposition to AI. Without an SNDGO-style empowered owner, the budget mostly stays as headlines. Singapore's S$2bn+ direct AI commitments execute differently because SNDGO has unambiguous program authority.",
        sources: [
          {
            label: 'OECD.AI 国家 AI 计划',
            labelKo: 'OECD.AI 국가 AI 계획',
            labelJa: 'OECD.AI 国家 AI 計画',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
          {
            label: '国家 AI 计划简报（PDF）',
            labelKo: '국가 AI 계획 브리핑(PDF)',
            labelJa: '国家 AI 計画ブリーフ（PDF）',
            labelEn: 'National AI Program brief (PDF)',
            url: 'https://innovationisrael.org.il/wp-content/uploads/2025/05/AI-National-Program-en-14.5.25.pdf',
            date: '2025-05-14',
          },
        ],
      },
      'investment-2': {
        analysis:
          'Nebius 超算中心是公私合建项目，Nebius（前身 Yandex N.V.）出资约 US$1.4 亿，目标补足以色列没有可用国家级 AI 训练超算的缺口。2024 年开工，首期可用算力预计 2025-2026 年到位。判断：US$1.4 亿规模相对新加坡 NSCC 或香港 Cyberport AISC 3000 PFLOPS 规划都偏小。补的是最紧急症状——本地研究员被迫租用海外云——但不会把以色列推上全球前沿算力地图。',
        analysisKo:
          'Nebius 슈퍼컴퓨팅 센터는 공공-민간 협력 프로젝트입니다. Nebius(전신 Yandex N.V.)가 약 US$1.4억을 출자했으며, 이스라엘이 사용 가능한 국가급 AI 훈련 슈퍼컴퓨팅의 부족을 보충하기 위한 것입니다. 2024년 착공되었으며, 초기 단계의 사용 가능한 컴퓨팅 능력은 2025-2026년에 준비될 예정입니다. 판단: US$1.4억 규모는 싱가포르의 NSCC 또는 홍콩의 Cyberport AISC 3000 PFLOPS 계획에 비해 상대적으로 작습니다. 가장 긴급한 증상을 보완합니다. 현지 연구원들이 해외 클라우드를 임차할 수밖에 없습니다. 하지만 이스라엘을 글로벌 첨단 컴퓨팅 능력 지도에 올려놓지는 못할 것입니다.',
        analysisJa:
          'Nebius スーパーコンピューティング・センターは公民合設プロジェクトで、Nebius（前身 Yandex N.V.）が約 US$1.4 億を出資し、イスラエルに利用可能な国家級 AI トレーニング・スーパーコンピュータがない欠落を補う目標です。2024 年に工事開始、初期の利用可能な演算能力は 2025-2026 年到達予定です。判断：US$1.4 億の規模はシンガポール NSCC またはホンコン Cyberport AISC 3000 PFLOPS 計画に比べて小さいです。最も緊急の症状を補います――現地の研究者は海外クラウドの利用を余儀なくされます――しかし、イスラエルを全球最先端演算能力マップに上げることはありません。',
        analysisEn:
          "The Nebius supercompute centre is a public-private build with Nebius (formerly Yandex N.V.) at ~US$140m, scaled to fill Israel's gap of having no operational national supercomputer for AI training. Construction began 2024; first usable capacity is expected 2025-2026. Assessment: at ~US$140m the build is small relative to Singapore NSCC or HK Cyberport AISC's 3 000 PFLOPS plan. It addresses the most urgent symptom — local researchers having to rent foreign cloud — but does not put Israel on the global frontier compute map.",
        sources: [
          {
            label: 'OECD.AI National AI Program',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'initiative-1': {
        analysis:
          '8200 部队 AI 人才管线是以色列最独特的资产：SIGINT 军事情报单位每年从兵役中筛选 ~5000 人，实施密集的内部 AI / ML / 网络安全训练，然后让他们带着前沿技术能力进入民间。校友创立 1000+ 公司，含 Check Point、NICE、Mobileye、Argus Cyber Security、Wiz（2025 被 Google 以 US$320 亿收购）。判断：8200 部队是本基准集中其他国家无法复制的结构性优势——它需要兵役制度 + SIGINT 使命集中 + 民间科技生态三者结合。新加坡的国民服役管线产生不出同等 AI 工程师吞吐量，因为 SAF 使命覆盖更广、SIGINT 集中度低。',
        analysisKo:
          'Unit 8200 AI 인재 파이프라인은 이스라엘의 가장 독특한 자산입니다: SIGINT 군사 정보 부대는 매년 병역에서 약 5000명을 선별하고, 집중적인 내부 AI/ML/사이버 보안 훈련을 실시한 후, 그들이 첨단 기술 능력을 갖춘 상태로 민간으로 진입하게 합니다. 동문들은 1000개 이상의 회사를 설립했으며, Check Point, NICE, Mobileye, Argus Cyber Security, Wiz(2025년 Google에 US$320억에 인수됨)를 포함합니다. 판단: Unit 8200은 이 벤치마크에서 다른 국가가 복제할 수 없는 구조적 우위입니다. 이는 병역 제도 + SIGINT 임무 집중 + 민간 기술 생태계의 세 가지 결합을 필요로 합니다. 싱가포르의 국민복무 파이프라인은 동등한 AI 엔지니어 처리 능력을 산출할 수 없습니다. SAF 임무가 더 광범위하고 SIGINT 집중도가 낮기 때문입니다.',
        analysisJa:
          'Unit 8200 AI 人材パイプラインはイスラエルの最も独特な資産です：SIGINT 軍事情報部門は毎年兵役から約 5,000 人を選抜し、集約的な内部 AI / ML / ネットワークセキュリティ訓練を実施し、その後彼らに最先端技術能力を持たせて民間に入らせます。卒業生は 1,000 社以上の企業を設立しており、Check Point、NICE、Mobileye、Argus Cyber Security、Wiz（2025 年に Google に US$320 億で買収）を含みます。判断：Unit 8200 は本ベンチマーク集中で他国が複製不可の構造的優位です――兵役制度＋SIGINT ミッション集約＋民間テック生態という三者結合が必要です。シンガポールの国民兵役パイプラインは同等の AI エンジニア吞吐量を生み出しません。SAF のミッションカバレッジはより広く、SIGINT 集約度が低いためです。',
        analysisEn:
          "Unit 8200's AI talent pipeline is Israel's most distinct asset: a SIGINT military intelligence unit that selects ~5 000 conscripts per year, runs intensive in-house AI / ML / cybersecurity training, and releases them into civilian life with deep frontier-tech skills. Alumni founded 1 000+ companies including Check Point, NICE, Mobileye, Argus Cyber Security, Wiz (US$32bn Google acquisition, 2025). Assessment: Unit 8200 is a structural advantage no other country in this benchmark can copy, because it requires combining mandatory military service + concentrated SIGINT mission + civilian tech ecosystem. Singapore's NS pipeline does not generate equivalent AI engineering throughput because the SAF mission set is broader and less SIGINT-heavy.",
        sources: [
          {
            label: 'Unit 8200 概览（Wikipedia）',
            labelKo: 'Unit 8200 개요(Wikipedia)',
            labelJa: 'Unit 8200 概要（Wikipedia）',
            labelEn: 'Unit 8200 overview (Wikipedia)',
            url: 'https://en.wikipedia.org/wiki/Unit_8200',
          },
        ],
      },
      'initiative-2': {
        analysis:
          '国家 AI 计划五大支柱：研究卓越、AI 超算、人才管线、公部门 AI、AI 伦理与可信 AI。每个支柱有 NIS 子预算，但实际支出严重偏向"研究卓越"（学术拨款顺畅），而"公部门 AI 部署"和"超算"两个难支柱执行滞后。判断：支柱集合纸面上完整，但支出 profile 揭示根本不对称：以色列能资助"已经在跑"的（学术 AI 优秀），但无法运营交付"还不存在"的（国家级 AI 部署、自主算力）。',
        analysisKo:
          '국가 AI 계획의 다섯 가지 주요 기둥: 연구 우수성, AI 슈퍼컴퓨팅, 인재 파이프라인, 공공부문 AI, AI 윤리 및 신뢰 가능 AI. 각 기둥에는 NIS 소예산이 있지만, 실제 지출은 「연구 우수성」(학술 보조금이 순조)에 크게 편향되어 있으며, 「공공부문 AI 배치」와 「슈퍼컴퓨팅」 두 가지 어려운 기둥의 집행이 지연되고 있습니다. 판단: 기둥의 집합은 서면상 완전하나, 지출 프로필은 근본적인 비대칭을 드러냅니다: 이스라엘은 「이미 운영 중인」것(학술 AI 우수성)을 자금 지원할 수 있지만, 「아직 존재하지 않는」것(국가급 AI 배치, 자주적 컴퓨팅 능력)을 운영 및 제공할 수 없습니다.',
        analysisJa:
          '国家 AI 計画の 5 つの柱：研究卓越性、AI スーパーコンピューティング、人材パイプライン、公共部門 AI、AI エシックス＆トラスト AI。各柱には NIS サブ予算がありますが、実績支出は「研究卓越性」（学術配分スムーズ）に大きく偏り、「公共部門 AI 配置」と「スーパーコンピューティング」の 2 つの難柱は実行遅れがあります。判断：柱の集合は紙上では完全ですが、支出プロファイルは根本的な非対称性を露呈させています：イスラエルは「既に実行中」のもの（学術 AI 優秀性）に資金を提供できますが、「まだ存在しない」もの（国家級 AI 配置、自立演算力）の運営配信はできません。',
        analysisEn:
          'The five pillars of Israel\'s National AI Program are: research excellence, AI supercompute, talent pipeline, AI in public sector, AI ethics & trustworthy AI. Each pillar has a NIS sub-allocation, but actual outturn skews heavily toward "research excellence" (academic grants flow easily) while the harder pillars — public-sector AI deployment and supercompute — lag. Assessment: the pillar set is comprehensive on paper but the disbursement profile reveals a fundamental asymmetry: Israel can fund what already works (academic AI is excellent) but cannot operationally deliver what does not exist yet (state AI delivery, sovereign compute).',
        sources: [
          {
            label: '国家 AI 计划简报（PDF）',
            labelKo: '국가 AI 계획 브리핑(PDF)',
            labelJa: '国家 AI 計画ブリーフ（PDF）',
            labelEn: 'National AI Program brief (PDF)',
            url: 'https://innovationisrael.org.il/wp-content/uploads/2025/05/AI-National-Program-en-14.5.25.pdf',
            date: '2025-05-14',
          },
          {
            label: 'OECD.AI National AI Program',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'initiative-3': {
        analysis:
          'Nebius 超算建设（2024 启动 / 约 US$1.4 亿）是以色列补国家级算力缺口的主要尝试。与 Nebius（前身 Yandex N.V.，现荷兰上市的 AI 基础设施公司）联合出资。首期可用训练算力预计 2025-2026 年到位。判断：建设有必要但不变革性——US$1.4 亿规模仍是自主算力的滞后玩家。本地 AI 研究员仍需要大量依赖 AWS / Azure / GCP，Nebius 主要解决数据驻留和政治中立顾虑，而非绝对算力规模。',
        analysisKo:
          'Nebius 슈퍼컴퓨팅 건설(2024년 시작/약 US$1.4억)은 이스라엘이 국가급 컴퓨팅 능력 격차를 보충하기 위한 주요 시도입니다. Nebius(전신 Yandex N.V., 현재 네덜란드 상장 AI 기반시설 회사)와 공동 출자했습니다. 초기 단계의 사용 가능한 훈련 컴퓨팅 능력은 2025-2026년에 준비될 예정입니다. 판단: 건설은 필요하나 혁명적이지는 않습니다. US$1.4억 규모는 여전히 자주적 컴퓨팅 능력의 추종자입니다. 현지 AI 연구원들은 여전히 AWS/Azure/GCP에 크게 의존해야 합니다. Nebius는 주로 데이터 주권과 정치적 중립 우려를 해결하지만, 절대적 컴퓨팅 능력 규모는 아닙니다.',
        analysisJa:
          'Nebius スーパーコンピューティング建設（2024 開始 / 約 US$1.4 億）はイスラエルが国家級演算能力欠落を補う主要な試みです。Nebius（前身 Yandex N.V.、現在オランダ上場 AI インフラストラクチャー企業）と共同出資。初期の利用可能なトレーニング演算能力は 2025-2026 年到達予定です。判断：建設は必要ですが革新的ではありません――US$1.4 億の規模は依然として自立演算能力の遅れた参加者です。地元の AI 研究者は依然として AWS / Azure / GCP に大きく依存する必要があり、Nebius は主にデータレジデンスと政治的中立の懸念を解決し、絶対的演算能力規模ではありません。',
        analysisEn:
          "Nebius supercompute construction (started 2024, ~US$140m) is Israel's main attempt to close the national-compute gap. The build is co-funded with Nebius (formerly Yandex N.V., now a Netherlands-listed AI infrastructure company). First usable training compute is expected 2025-2026. Assessment: the build is necessary but not transformational — at ~US$140m Israel is still a lagged player in sovereign compute. Local AI researchers will continue to depend significantly on AWS / Azure / GCP, with Nebius mainly addressing data-residency and political-neutrality concerns rather than absolute compute scale.",
        sources: [
          {
            label: 'OECD.AI National AI Program',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'initiative-4': {
        analysis:
          '以色列创新局（IIA）AI 创业支持：IIA 运行 AI 创业资助计划和配套基金，每年总拨款 ~NIS 10 亿（AI 占比未单独披露，估 2024-2025 约 20-30%）。IIA 2024 年"国家 AI 计划第二阶段"加配 NIS 5 亿专项 AI R&D 基础设施（含国家 AI 研究院）。判断：IIA 是以色列 AI 政策栈中最可靠的执行机构——拨款基础设施成熟、周期准时。缺口在下游：从拨款到部署的扩展是系统断裂处。',
        analysisKo:
          '이스라엘 혁신청(IIA) AI 창업 지원: IIA는 AI 창업 지원금 계획과 동반 기금을 운영하며, 매년 총 배분액은 약 NIS 10억입니다(AI 비중은 별도로 공개되지 않았으나, 2024-2025년에는 약 20-30%로 추정). IIA는 2024년 「국가 AI 계획 제2단계」를 통해 NIS 5억의 별도 AI R&D 기초 인프라 지원금을 추가 배분했습니다(국가 AI 연구원 포함). 판단: IIA는 이스라엘 AI 정책 스택에서 가장 신뢰할 수 있는 실행 기관으로서, 배분 인프라가 성숙하고 주기가 정확합니다. 부족한 부분은 하류에 있습니다. 배분에서 배포로의 확대가 시스템 단절 지점입니다.',
        analysisJa:
          'イスラエル・イノベーション局（IIA）AI 創業支援：IIA は AI 創業助成計画と連携ファンドを運営し、毎年総配分は約 NIS 10 億です（AI 割合は個別開示されず、推定 2024-2025 約 20-30%）。IIA 2024 年「国家 AI 計画第 2 段階」は NIS 5 億追加配分を AI R&D インフラストラクチャー（国家 AI 研究所を含む）に充当。判断：IIA はイスラエルの AI 政策スタックの中で最も信頼できる実行機構です――配分インフラストラクチャーは成熟、サイクルは定時。欠落は下流にあります：配分から配置への拡大が系統的断裂点です。',
        analysisEn:
          'Israel Innovation Authority (IIA) AI startup support: IIA runs grant programmes and matching-fund schemes for AI startups, with ~NIS 1bn annual disbursement across all sectors (AI share is not separately disclosed but estimated at 20-30% in 2024-2025). IIA\'s 2024 "Phase 2 of National AI Program" line added NIS 500m specifically for AI R&D infrastructure including the National AI Research Institute. Assessment: IIA is the most reliable executor in Israel\'s AI policy stack — its grant infrastructure is mature and grant cycles run on time. The gap is downstream: scaling beyond grants into deployment is where the system breaks down.',
        sources: [
          {
            label: 'IIA 第二阶段 NIS 5 亿',
            labelKo: 'IIA 제2단계 NIS 5억',
            labelJa: 'IIA 第 2 段階 NIS 5 億',
            labelEn: 'IIA Phase 2 NIS 500m',
            url: 'https://innovationisrael.org.il/en/press_release/second-phase-ai-program/',
          },
          {
            label: 'IIA 官网',
            labelKo: 'IIA 공식 웹사이트',
            labelJa: 'IIA 公式ウェブサイト',
            labelEn: 'IIA official site',
            url: 'https://innovationisrael.org.il/en/',
          },
        ],
      },
      'body-1': {
        analysis:
          'MIST（创新科技部）是以色列 AI 政策主管部门，从前身科学技术部继承了 AI 政策权责。MIST 是国家 AI 计划（2021）和 AI 监管与伦理政策（2023）的正式发文方。权力主要是政策制定——实际拨款通过 IIA。判断：MIST 功能上像没有执行臂的新加坡 SNDGO。缺少 Smart Nation 这种执行通道的 ownership，MIST 的政策产出难以快速转化为部署能力——这是 20% 支出问题的结构性根源。',
        analysisKo:
          'MIST(혁신과학기술부)는 이스라엘 AI 정책 담당 부서로서, 전신인 과학기술부로부터 AI 정책 권한과 책임을 이어받았습니다. MIST는 국가 AI 계획(2021)과 AI 규제 및 윤리 정책(2023)의 공식 발문 기관입니다. 권한은 주로 정책 수립입니다. 실제 배분은 IIA를 통해 이루어집니다. 판단: MIST는 기능상 실행 팔이 없는 싱가포르 SNDGO와 유사합니다. Smart Nation 같은 실행 통로에 대한 주도권이 부족하여 MIST의 정책 산출물이 배포 능력으로 신속하게 전환되기 어렵습니다. 이것이 20% 지출 문제의 구조적 원인입니다.',
        analysisJa:
          'MIST（創新科技部）はイスラエルの AI 政策主管部門であり、前身科学技術部から AI 政策責任を継承しました。MIST は国家 AI 計画（2021）と AI 規制・エシックス政策（2023）の公式発文機関です。権力は主に政策立案です――実際の配分は IIA を通じます。判断：MIST は機能的には執行腕を持たないシンガポール SNDGO に似ています。Smart Nation のようなこの実行チャネルの所有権がなく、MIST の政策産出は配置能力への急速な転換が困難です――これは 20% 支出問題の構造的根源です。',
        analysisEn:
          "MIST (Ministry of Innovation, Science and Technology) is the lead ministry for Israel AI policy, which inherited AI policy from the predecessor Ministry of Science and Technology. MIST is the formal author of the National AI Program (2021) and the AI Policy on Regulation and Ethics (2023). Authority is largely policy-only — actual disbursement runs through IIA. Assessment: MIST functions more like Singapore SNDGO if SNDGO had no execution arm. Without owning a flagship execution channel like SNDGO's Smart Nation initiatives, MIST's policy outputs are slow to translate into deployed capability — this is the structural root cause of the 20% disbursement issue.",
        sources: [
          {
            label: 'OECD.AI 国家 AI 计划',
            labelKo: 'OECD.AI 국가 AI 계획',
            labelJa: 'OECD.AI 国家 AI 計画',
            labelEn: 'OECD.AI National AI Program',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'body-2': {
        analysis:
          '以色列创新局（IIA）是以色列创新政策的执行机构，2016 年从首席科学家办公室升格而来。每年管理 ~NIS 20 亿全领域资助，AI / 网安 / 数字健康占比最大。AI 相关职能：分发国家 AI 计划的创业与研究预算；运行第二阶段（NIS 5 亿 / 2024-2027）。判断：IIA 是以色列 AI 政策栈中少有的运营层胜任机构。相比新加坡 EDB / IMDA，IIA 更精简、更聚焦拨款而非生态建设——这限制了部署驱动力但最大化了研究拨款效率。',
        analysisKo:
          '이스라엘 혁신청(IIA)은 이스라엘 혁신 정책의 실행 기관으로서, 2016년 수석 과학자 사무실에서 발전했습니다. 매년 약 NIS 20억의 전 분야 지원금을 관리하며, AI/사이버보안/디지털 보건이 가장 큰 비중을 차지합니다. AI 관련 직능: 국가 AI 계획의 창업 및 연구 예산 배분; 제2단계 운영(NIS 5억 / 2024-2027). 판단: IIA는 이스라엘 AI 정책 스택에서 운영 수준의 역량을 갖춘 드문 기관입니다. 싱가포르 EDB/IMDA와 비교하면, IIA는 더 간결하고 생태계 구축보다는 배분에 더욱 집중합니다. 이는 배포 동력을 제한하지만 연구 배분 효율을 최대화합니다.',
        analysisJa:
          'イスラエル・イノベーション局（IIA）はイスラエルの創新政策の実行機構で、2016 年に首席科学者事務所から昇格しました。毎年全分野の助成約 NIS 20 億を管理し、AI / サイバーセキュリティ / デジタルヘルスが最大比率です。AI 関連職能：国家 AI 計画の創業と研究予算配分；第 2 段階（NIS 5 億 / 2024-2027）運営。判断：IIA はイスラエルの AI 政策スタック中、少数の運営層胜任機構です。シンガポールの EDB / IMDA と比較して、IIA はより精簡で、配分に焦点を当てより生態系構築ではありません――これは配置駆動力を制限しますが、研究配分効率を最大化します。',
        analysisEn:
          "Israel Innovation Authority (IIA) is the operational arm of Israel's innovation policy, established 2016 (succeeding the Office of the Chief Scientist). It manages ~NIS 2bn annual grants across all sectors, with AI / cybersecurity / digital health getting the largest shares. AI-specific functions: dispensing the National AI Program's startup-and-research budget; running the second phase (NIS 500m, 2024-2027). Assessment: IIA is the rare operational competence in Israel's AI policy stack. Compared with EDB / IMDA on the Singapore side, IIA is leaner and grant-focused rather than ecosystem-building, which limits its ability to drive deployment but maximises efficiency in research grant flow.",
        sources: [
          {
            label: 'IIA 官网',
            labelKo: 'IIA 공식 웹사이트',
            labelJa: 'IIA 公式ウェブサイト',
            labelEn: 'IIA official site',
            url: 'https://innovationisrael.org.il/en/',
          },
          {
            label: 'IIA 第二阶段 NIS 5 亿',
            labelKo: 'IIA 제2단계 NIS 5억',
            labelJa: 'IIA 第 2 段階 NIS 5 億',
            labelEn: 'IIA Phase 2 NIS 500m',
            url: 'https://innovationisrael.org.il/en/press_release/second-phase-ai-program/',
          },
        ],
      },
      'body-3': {
        analysis:
          '以色列央行（BoI）是以色列银行业 AI 监管机构。AI 相关产出：2024 年发布银行业 AI 使用框架（关于模型风险、可解释性、客户保护的自愿指引）；金融科技沙盒对 AI 用例开放；反洗钱 / KYC AI 用例持续监督。判断：BoI 的 AI 立场是保守务实——比新加坡 MAS 更接近英国 FCA。在没有水平性 AI 法律的情况下，BoI 指引是以色列金融领域最接近可执行的 AI 规则——这让它在 AI 治理图景中不成比例地重要。',
        analysisKo:
          '이스라엘 중앙은행(BoI)은 이스라엘 은행 부문 AI 규제 기관입니다. AI 관련 산출: 2024년 은행 AI 사용 프레임워크 발표(모델 위험, 해석 가능성, 고객 보호에 대한 자발적 지침); 금융기술 샌드박스의 AI 사용 사례 개방; 자금세탁방지/KYC AI 사용 사례 지속 감시. 판단: BoI의 AI 입장은 보수적이며 실용적입니다. 싱가포르 MAS보다는 영국 FCA에 더 가깝습니다. 수평적 AI 법률이 없는 상황에서 BoI 지침은 이스라엘 금융 부문에서 가장 실행 가능한 AI 규칙입니다. 이것이 AI 거버넌스 그림에서 불균형적으로 중요한 이유입니다.',
        analysisJa:
          'イスラエル中央銀行（BoI）はイスラエルの銀行業 AI 規制機構です。AI 関連産出：2024 年に銀行業 AI 使用枠組みを発行（モデルリスク、解釈可能性、顧客保護に関する自発的ガイドライン）；金融テックサンドボックスは AI ユースケースに開放；マネーロンダリング防止 / KYC AI ユースケースは継続監督。判断：BoI の AI 立場は保守的実務的です――シンガポール MAS より英国 FCA に近いです。水平的 AI 法制がない場合、BoI ガイドラインはイスラエル金融領域で最も実行可能な AI 規則に近いです――これは AI ガバナンス図景で不釣り合いに重要にします。',
        analysisEn:
          "Bank of Israel (BoI) is the financial regulator overseeing AI in Israeli banking. AI-related output: a 2024 \"Use of AI in the Banking System\" framework (voluntary guidelines on model risk, explainability, customer protection); a fintech sandbox open to AI use cases; AML / KYC AI use cases under continuous supervision. Assessment: BoI's AI posture is conservative-pragmatic — closer to UK FCA than to MAS Singapore. Without a national horizontal AI law to pin against, BoI's guidance is the closest thing to enforceable AI rules in Israel's financial sector — making it disproportionately important for the AI governance picture.",
        sources: [
          {
            label: 'OECD.AI National AI Program（含 BoI 提及）',
            labelKo: 'OECD.AI National AI Program(BoI 언급 포함)',
            labelJa: 'OECD.AI 国家 AI 計画（BoI 言及含む）',
            labelEn: 'OECD.AI National AI Program (BoI context)',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
    },
  },
  {
    flag: '🇰🇷',
    name: '韩国',
    nameKo: '한국',
    nameJa: '韓国',
    nameEn: 'South Korea',
    fullName: '大韩民国',
    fullNameKo: '대한민국',
    fullNameJa: '大韓民国',
    fullNameEn: 'Republic of Korea',
    overview:
      '韩国是中等规模经济体中最雄心勃勃的 AI 参与者，₩100 万亿（~$715 亿）公私基金远超同级别国家。三星、Naver、Kakao 等财阀积极开发自有大模型，2024 年通过 AI 基本法展示了治理决心。',
    overviewKo:
      '한국은 중등 규모 경제에서 가장 야심 찬 AI 참여자로서, ₩100조(약 $715억) 공공-민간 기금이 같은 수준의 다른 국가를 훨씬 초과합니다. 삼성, Naver, Kakao 등 재벌이 자체 대형 언어 모델 개발에 적극적이며, 2024년 AI 기본법 통과를 통해 거버넌스 결의를 보여주었습니다.',
    overviewJa:
      '韓国は中規模経済体の中で最も野心的な AI 参加者で、₩100 万兆（約 $715 億）の公民合同基金は同等級国家を遥かに超えています。三星、Naver、Kakao などの大企業は自有大型モデル開発に積極的で、2024 年に AI 基本法を通じてガバナンス決意を表示しました。',
    overviewEn:
      'South Korea is the most ambitious AI player among mid-sized economies — its ₩100 trillion (~US$71.5 billion) public-private fund vastly outstrips peer nations. Chaebols including Samsung, Naver and Kakao are actively developing proprietary large models, and the 2024 passage of the AI Basic Act signalled governance resolve.',
    strategies: [
      {
        name: 'K-AI 战略',
        nameKo: 'K-AI 전략',
        nameJa: 'K-AI 戦略',
        nameEn: 'K-AI Strategy',
        year: '2019',
        description: '国家 AI 发展蓝图',
        descriptionKo: '국가 AI 발전 청사진',
        descriptionJa: '国家 AI 発展青写真',
        descriptionEn: 'National AI development blueprint',
      },
      {
        name: 'AI 基本法',
        nameKo: 'AI 기본법',
        nameJa: 'AI基本法',
        nameEn: 'AI Basic Act',
        year: '2024',
        description: '2024 年国会通过，2025 年生效，亚洲首部综合性 AI 法律',
        descriptionKo: '2024년 국회 통과, 2025년 발효, 아시아 최초 종합적 AI 법률',
        descriptionJa: '2024 年議会通過、2025 年発効、アジア初の包括的 AI 法律',
        descriptionEn: "Passed by the National Assembly in 2024 and effective 2025; Asia's first full-scope AI law",
      },
      {
        name: 'AI 半导体战略',
        nameKo: 'AI 반도체 전략',
        nameJa: 'AI 半導体戦略',
        nameEn: 'AI Semiconductor Strategy',
        year: '2024',
        description: '强化 AI 芯片自主能力',
        descriptionKo: 'AI 칩 자주 능력 강화',
        descriptionJa: 'AI チップ自主能力を強化',
        descriptionEn: 'Strengthen sovereign AI chip capability',
      },
    ],
    investment: [
      {
        item: '公私联合 AI 基金',
        itemKo: '공민 연합 AI 기금',
        itemJa: '公民合同 AI ファンド',
        itemEn: 'Public-Private Joint AI Fund',
        amount: '₩100 万亿 (~$715 亿)',
        amountKo: '₩100조 (~$715억)',
        amountJa: '₩100 万兆（約 $715 億）',
        amountEn: '₩100 trillion (~US$71.5 billion)',
        note: '多年期公私合作基金',
        noteKo: '다년기 공민 협력 기금',
        noteJa: '複数年公民協力ファンド',
        noteEn: 'Multi-year public-private partnership fund',
      },
      {
        item: 'NVIDIA 合作',
        itemKo: 'NVIDIA 협력',
        itemJa: 'NVIDIA 協力',
        itemEn: 'NVIDIA Partnership',
        amount: '$30 亿',
        amountKo: '$30억',
        amountJa: '$30 億',
        amountEn: 'US$3 billion',
        note: 'AI 基础设施与研发合作',
        noteKo: 'AI 기반시설 및 연구개발 협력',
        noteJa: 'AI インフラストラクチャー＆研究開発協力',
        noteEn: 'AI infrastructure and R&D collaboration',
      },
    ],
    governance:
      '韩国 2024 年通过 AI 基本法（2025 年生效），是亚洲首部综合性 AI 立法。法案采取风险分级管理，设立 AI 委员会，要求高风险 AI 进行影响评估，同时兼顾创新促进。比新加坡的自愿框架更具法律约束力。',
    governanceKo:
      '한국은 2024년 AI 기본법을 통과시켰으며(2025년 시행), 아시아 최초의 종합적 AI 입법입니다. 법안은 위험 분급 관리를 채택하고, AI 위원회를 설립하며, 고위험 AI에 대해 영향 평가를 요구하면서 동시에 혁신 촉진을 고려합니다. 싱가포르의 자발적 프레임워크보다 법적 구속력이 더 강합니다.',
    governanceJa:
      '韓国は 2024 年に AI 基本法を通過させ（2025 年発効）、アジア初の包括的 AI 法制です。法案はリスク分級管理を採用し、AI 委員会を設立し、高リスク AI は影響評価を要求し、同時に革新促進に配慮しています。シンガポールの自発的枠組みより法的拘束力があります。',
    governanceEn:
      "South Korea passed the AI Basic Act in 2024 (effective 2025) — Asia's first full-scope AI law. The Act uses a risk-tiered approach, sets up an AI Committee, requires impact assessments for high-risk AI, and tries to balance innovation. It is more legally binding than Singapore's voluntary framework.",
    keyInitiatives: [
      '₩100 万亿公私 AI 基金',
      'AI 基本法实施（2025）',
      '三星/Naver/Kakao 自研大模型',
      '与 NVIDIA $30 亿 AI 合作',
      'AI 半导体自主化战略',
    ],
    keyInitiativesEn: [
      '₩100 trillion public-private AI fund',
      'AI Basic Act implementation (2025)',
      'Proprietary large models from Samsung / Naver / Kakao',
      'US$3 billion AI partnership with NVIDIA',
      'AI semiconductor sovereignty strategy',
    ],
    strengths: [
      '投资规模碾压——₩100 万亿约为新加坡政府 AI 投入的 25 倍',
      '财阀体系可快速大规模部署 AI（三星、LG、现代等）',
      '半导体制造能力（三星、SK 海力士）',
      'AI 基本法提供了比新加坡更强的法律框架',
    ],
    strengthsEn: [
      "Crushing investment scale — ₩100 trillion is roughly 25x Singapore's government AI spend",
      'Chaebol system enables rapid large-scale AI deployment (Samsung, LG, Hyundai, etc.)',
      'Semiconductor manufacturing capability (Samsung, SK hynix)',
      "AI Basic Act provides a stronger legal framework than Singapore's",
    ],
    weaknesses: [
      '财阀主导可能挤压创业生态空间',
      '国际化程度不及新加坡，英语环境较弱',
      '吸引国际人才和企业的能力不如新加坡',
      '人口老龄化带来长期人才挑战',
    ],
    weaknessesEn: [
      'Chaebol dominance may crowd out the startup ecosystem',
      'Less internationalised than Singapore; weaker English-language environment',
      'Less effective at attracting international talent and firms than Singapore',
      'Population ageing poses long-term talent challenges',
    ],
    keyBodies: [
      {
        name: 'MSIT（科学技术信息通信部）',
        nameKo: 'MSIT(과학기술정보통신부)',
        nameJa: 'MSIT（科学技術情報通信部）',
        nameEn: 'MSIT (Ministry of Science and ICT)',
        role: 'AI 政策主管部门',
        roleKo: 'AI 정책 주무 부서',
        roleJa: 'AI 政策主管部門',
        roleEn: 'Lead ministry for AI policy',
      },
      {
        name: 'NIPA（国家信息产业振兴院）',
        nameKo: 'NIPA(국가정보산업진흥원)',
        nameJa: 'NIPA（国家情報産業振興院）',
        nameEn: 'NIPA (National IT Industry Promotion Agency)',
        role: 'AI 产业推进',
        roleKo: 'AI 산업 추진',
        roleJa: 'AI 産業推進',
        roleEn: 'AI industry promotion',
      },
      {
        name: 'AI 委员会',
        nameKo: 'AI 위원회',
        nameJa: 'AI 委員会',
        nameEn: 'AI Committee',
        role: 'AI 基本法设立的跨部门协调机构',
        roleKo: 'AI 기본법이 설립한 부처 간 조정 기구',
        roleJa: 'AI 基本法設立の部門横断調整機構',
        roleEn: 'Cross-ministry coordination body established under the AI Basic Act',
      },
    ],
    sources: ['K-AI Strategy（2019）', 'AI 基本法全文（2024）', '韩国 AI 半导体战略（2024）'],
    sourcesEn: [
      'K-AI Strategy (2019)',
      'Full text of the AI Basic Act (2024)',
      'Korea AI Semiconductor Strategy (2024)',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '韩国 AI 战略是"财阀产业政策 + 法律框架立法"的双轮驱动：(1) 2019 年 K-AI Strategy 首批国家级 AI 蓝图；(2) 2024 年 12 月 26 日国会通过《AI 基本法》（亚洲首部综合性 AI 法律）；(3) 实施时间表：2025 年 1 月 21 日内阁通过执行令（Enforcement Decree），2026 年 1 月正式生效；(4) MSIT 起草子规则于 2025 上半年发布；(5) 公私联合 AI 基金 ₩100 万亿（~US$715 亿）由政府引导 + 三星 / SK / 现代 / Naver / Kakao 等财阀联合出资。判断：韩国是中等规模经济体中最雄心勃勃的 AI 参与者——投资量级是新加坡的 25 倍，立法节奏比新加坡早 2 年。但财阀主导意味着 AI 创新主要在大公司内部循环，本土创业生态被压缩——这是新加坡（开放型枢纽）与韩国（封闭型集团）的根本分野。',
        analysisKo:
          '한국 AI 전략은 「재벌 산업 정책 + 법적 프레임워크 입법」의 이중 구동입니다: (1) 2019년 K-AI Strategy 첫 국가 차원 AI 청사진; (2) 2024년 12월 26일 국회 통과 《AI 기본법》(아시아 최초의 종합 AI 법률); (3) 시행 일정: 2025년 1월 21일 내각 통과 집행령(Enforcement Decree), 2026년 1월 공식 발효; (4) MSIT 기초 세부 규칙 2025년 상반기 발행; (5) 공민 협력 AI 펀드 ₩100조(약 US$715억)는 정부 주도 + 삼성/SK/현대/Naver/Kakao 등 재벌 연합 출자. 판단: 한국은 중형 경제 중 가장 야심찬 AI 참여자입니다—투자 규모는 싱가포르의 25배, 입법 속도는 싱가포르보다 2년 앞섭니다. 하지만 재벌 주도는 AI 혁신이 주로 대기업 내부 순환으로 이루어진다는 뜻이며, 국내 스타트업 생태계가 압축됩니다—이는 싱가포르(개방형 허브)와 한국(폐쇄형 그룹)의 근본적 차이입니다.',
        analysisJa:
          '韓国の AI 戦略は「財閥産業政策 + 法的枠組み立法」の二輪駆動です：(1) 2019 年の K-AI Strategy 初代国家級 AI ブループリント；(2) 2024 年 12 月 26 日の議会による「AI 基本法」承認（アジア初の包括的 AI 法律）；(3) 実施タイムライン：2025 年 1 月 21 日内閣による執行令（Enforcement Decree）承認、2026 年 1 月正式施行；(4) MSIT による子規則案作成は 2025 年上半期にリリース；(5) 官民合同 AI 基金 ₩100 兆（~US$715 十億）は政府主導 + Samsung / SK / Hyundai / Naver / Kakao など財閥による共同出資。評価：韓国は中規模経済体中で最も野心的な AI 参加者であり、投資規模はシンガポールの 25 倍、立法のペースはシンガポールより 2 年早い。ただし財閥主導は AI 革新が主に大企業内部で循環することを意味し、本地のスタートアップエコシステムは圧迫される——これはシンガポール（開放型ハブ）と韓国（閉鎖的グループ）の根本的な相違である。',
        analysisEn:
          "South Korea's AI strategy is a dual-engine of \"chaebol-led industrial policy + framework legislation\": (1) the 2019 K-AI Strategy was the first national AI blueprint; (2) on 26 December 2024 the National Assembly passed the AI Basic Act — Asia's first full-scope AI law; (3) timeline: the Enforcement Decree was enacted by the Cabinet on 21 January 2026, and the law fully takes effect from January 2026; (4) MSIT drafted secondary regulations across H1 2025; (5) the public-private AI fund of ₩100 trillion (~US$71.5bn) is government-coordinated, jointly funded with chaebols Samsung, SK, Hyundai, Naver, Kakao. Assessment: South Korea is the most ambitious AI player among mid-sized economies — investment scale is roughly 25x Singapore and legislation is two years ahead. But chaebol dominance means AI innovation circulates inside large corporates, squeezing the local startup ecosystem — this is the fundamental divergence between Singapore's open-hub model and Korea's closed-conglomerate model.",
        sources: [
          {
            label: 'AI Basic Act 全文（aibasicact.kr）',
            labelKo: 'AI 기본법 전문(aibasicact.kr)',
            labelJa: 'AI Basic Act 全文（aibasicact.kr）',
            labelEn: 'Full text of the AI Basic Act (aibasicact.kr)',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'US Trade.gov 韩国 AI Basic Act 解读',
            labelKo: 'US Trade.gov 한국 AI 기본법 해석',
            labelJa: 'US Trade.gov 韓国 AI Basic Act 解読',
            labelEn: 'US Trade.gov South Korea AI Basic Act briefing',
            url: 'https://www.trade.gov/market-intelligence/south-korea-artificial-intelligence-ai-basic-act',
          },
          {
            label: 'ITIF：韩国 AI Basic Act 评估（2025-09-29）',
            labelKo: 'ITIF: 한국 AI 기본법 평가(2025-09-29)',
            labelJa: 'ITIF：韓国 AI Basic Act 評価（2025-09-29）',
            labelEn: "ITIF: Assessing South Korea's AI Basic Act (2025-09-29)",
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '韩国 AI 投资规模在中等经济体中独占鳌头：(1) 公私联合 AI 基金 ₩100 万亿（~US$715 亿）2024 年宣布，由政府种子 + 三星 / SK / Naver / Kakao 等财阀配套；(2) 2024 年 9 月美韩首脑会谈宣布 NVIDIA 与韩国合作 US$30 亿（含 AI 基础设施 + 联合研发）；(3) 韩国 AI 半导体战略 2024 年发布，含 ₩9 万亿（~US$65 亿）专项支持本土 AI 芯片设计与制造（三星 / SK 海力士 HBM、Rebellions 等创业公司）。总盘约 US$800-900 亿，是新加坡公开 AI 直投的 ~40 倍。判断：韩国 AI 投入的"硬件 / 数据中心 / 大模型训练"占比最高，是少数能与美中前沿模型同台竞争的非美中经济体。但创业生态相对薄弱，AI 服务出口能力（vs 单纯产品出口）远不如新加坡。',
        analysisKo:
          '한국 AI 투자 규모는 중형 경제 중 독보적 선두입니다: (1) 공민 협력 AI 펀드 ₩100조(약 US$715억) 2024년 발표, 정부 종자금 + 삼성/SK/Naver/Kakao 등 재벌 매칭; (2) 2024년 9월 미한 정상회담에서 NVIDIA와 한국 협력 US$30억 발표(AI 기반시설 + 공동 연구개발 포함); (3) 한국 AI 반도체 전략 2024년 발표, ₩9조(약 US$65억) 특별 지원 포함 국내 AI 칩 설계 및 제조(삼성/SK 하이닉스 HBM, Rebellions 등 스타트업). 총 규모 약 US$800-900억, 싱가포르 공개 AI 직접 투자의 약 40배입니다. 판단: 한국 AI 투입의 「하드웨어/데이터센터/대형 모델 학습」 비중이 가장 높으며, 미국과 중국의 최첨단 모델과 경쟁할 수 있는 소수의 비미중 경제 중 하나입니다. 하지만 스타트업 생태계는 상대적으로 약하며, AI 서비스 수출 역량(순수 제품 수출 vs)은 싱가포르에 미칩니다.',
        analysisJa:
          '韓国の AI 投資規模は中規模経済体中で傑出しています：(1) 官民合同 AI 基金 ₩100 兆（~US$715 十億）2024 年発表、政府種子資金 + Samsung / SK / Naver / Kakao など財閥による配套；(2) 2024 年 9 月の米韓首脳会談で NVIDIA と韓国の協力 US$30 十億を発表（AI インフラ + 共同研究を含む）；(3) 韓国 AI 半導体戦略 2024 年リリース、₩9 兆（~US$65 十億）の専項支援を含む本地 AI チップ設計・製造（Samsung / SK Hynix HBM、Rebellions など創業企業）。総規模約 US$800～900 十億、シンガポール公開 AI 直接投資の ~40 倍。評価：韓国 AI 投資の「ハードウェア / データセンター / 大型モデル訓練」の比率が最高であり、米国と中国の先端モデルと同等レベルで競合できる少数の非米中経済体である。ただし創業エコシステムは相対的に脆弱であり、AI サービス輸出能力（単なる製品輸出に対して）ははるかにシンガポールに及ばない。',
        analysisEn:
          "South Korea's AI investment scale is unmatched among mid-sized economies: (1) the ₩100 trillion (~US$71.5bn) public-private AI fund was announced in 2024, with government seed plus chaebol matching from Samsung, SK, Naver, Kakao; (2) at the September 2024 US-Korea summit, NVIDIA announced a US$3bn Korea partnership (AI infrastructure + joint R&D); (3) the AI Semiconductor Strategy released in 2024 dedicates ₩9 trillion (~US$6.5bn) to sovereign AI chip design and manufacturing (Samsung / SK hynix HBM, plus startups like Rebellions). The aggregate is roughly US$80-90bn — about 40x Singapore's publicly disclosed direct AI commitments. Assessment: Korea's AI spending tilts most toward hardware / data centres / large-model training, making it one of the few non-US/China economies that can compete on frontier models. But the startup ecosystem is comparatively weak, and AI service exports (versus pure product exports) trail Singapore by a wide margin.",
        sources: [
          {
            label: 'AI Basic Act 全文（aibasicact.kr）',
            labelKo: 'AI 기본법 전문(aibasicact.kr)',
            labelJa: 'AI Basic Act 全文（aibasicact.kr）',
            labelEn: 'Full text of the AI Basic Act (aibasicact.kr)',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'ITIF：韩国 AI Basic Act 评估',
            labelKo: 'ITIF: 한국 AI 기본법 평가',
            labelJa: 'ITIF：韓国 AI Basic Act 評価',
            labelEn: 'ITIF: Korea AI Basic Act assessment',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'governance-model': {
        analysis:
          '韩国 AI 治理是"框架法 + 风险分级 + AI 委员会"的强约束模式：(1) AI Basic Act 2024 年 12 月通过、2026 年 1 月生效，是亚洲首部综合性 AI 法律；(2) 法案要求"高影响 AI"和生成式 AI 进行风险评估、安全措施、本地代表指定；(3) 设立 AI 委员会（cross-ministry coordination body）作为协调机构；(4) AI Safety Institute 作为安全测试与红队组织；(5) MSIT 主导执行令（Enforcement Decree）发布于 2026 年 1 月。判断：韩国走的是"EU AI Act 简化版"路径——比新加坡的工具化框架更具法律强制力，但比 EU 更聚焦"高影响 AI"而非全谱系风险分级。这种"硬度适中"的设计意图是兼顾创新与监管，但具体执行落地（特别是高影响 AI 的范围界定）仍需 2026-2027 年的实践来验证。',
        analysisKo:
          '한국 AI 거버넌스는 「프레임워크 법 + 위험 등급화 + AI 위원회」의 강한 제약 모드입니다: (1) AI 기본법 2024년 12월 통과, 2026년 1월 발효, 아시아 최초의 종합 AI 법률입니다; (2) 법안은 「고영향 AI」와 생성 AI에 대해 위험 평가, 안전 조치, 현지 대표 지정을 요구합니다; (3) AI 위원회(부처 간 조정 기구)를 조정 기관으로 설립합니다; (4) AI Safety Institute가 안전 테스트 및 레드팀 조직으로 역할합니다; (5) MSIT 주도 집행령(Enforcement Decree) 2026년 1월 발표. 판단: 한국은 「EU AI Act 간소화 버전」경로를 택했습니다—싱가포르의 도구적 프레임워크보다 더 법적 강제력이 있지만, EU보다는 더 「고영향 AI」에 초점을 맞추고 전체 스펙트럼 위험 분류보다는 덜합니다. 이 「적절한 경도」의 설계 의도는 혁신과 규제를 함께 고려하는 것이지만, 구체적 실행(특히 고영향 AI의 범위 정의)은 여전히 2026-2027년의 실제 경험을 통해 검증이 필요합니다.',
        analysisJa:
          '韓国の AI ガバナンスは「法定枠組み + リスク分級 + AI 委員会」の強い制約モードです：(1) AI Basic Act は 2024 年 12 月承認、2026 年 1 月施行、アジア初の包括的 AI 法律；(2) 法案は「高影響 AI」と生成型 AI のリスク評価、安全措置、本地代表指定を要求；(3) AI 委員会（cross-ministry coordination body）を協調機関として設立；(4) AI Safety Institute を安全テスト・レッドチーム組織として設立；(5) MSIT 主導の執行令（Enforcement Decree）は 2026 年 1 月リリース。評価：韓国は「EU AI Act 簡略版」路線を進んでおり、シンガポールの道具化フレームワークより法的拘束力が強いが、EU より「高影響 AI」に焦点を絞り全スペクトラムリスク分級ではない。この「硬度適中」の設計意図は革新と規制の両立ですが、具体的な実施落地（特に高影響 AI の範囲定義）はなお 2026～2027 年の実践により検証が必要です。',
        analysisEn:
          'South Korea\'s AI governance is a strong-binding model of "framework law + risk tiering + AI Committee": (1) the AI Basic Act passed in December 2024 and takes effect from January 2026 — Asia\'s first full-scope AI law; (2) the Act requires "high-impact AI" and generative AI to undergo risk assessment, implement safety measures, and designate a local representative; (3) it establishes an AI Committee as a cross-ministry coordination body; (4) sets up an AI Safety Institute for safety testing and red-teaming; (5) MSIT-led Enforcement Decree was published in January 2026. Assessment: Korea travels the "simplified EU AI Act" path — more legally binding than Singapore\'s tool-centric framework, but more focused on "high-impact AI" than the EU\'s full-spectrum risk tiering. The intent is to balance innovation and regulation; specific delivery (especially how "high-impact" gets scoped) needs 2026-2027 practice to validate.',
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI 기본법 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'White & Case AI Watch 韩国节',
            labelKo: 'White & Case AI Watch 한국 섹션',
            labelJa: 'White & Case AI Watch 韓国セクション',
            labelEn: 'White & Case AI Watch — South Korea section',
            url: 'https://artificialintelligenceact.com/south-korean-ai-basic-law/',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          '韩国相对新加坡的核心杠杆是"财阀 + 半导体 + 法律框架"组合：(1) 投资规模碾压——₩100 万亿 vs 新加坡政府 S$20 亿+，量级是 25 倍；(2) 财阀体系（三星、LG、现代、SK）可快速大规模部署 AI——三星 2025 年自研 Galaxy AI 直接装机数亿台，是单点最大的 AI 渗透；(3) 半导体制造能力（三星 + SK 海力士 HBM）让韩国在全球 AI 算力供应链上不可绕过；(4) AI Basic Act 2024 通过，立法节奏比新加坡早 2 年。短板：财阀主导挤压本土 AI 创业生态、英语国际化弱于新加坡、人口老龄化压低长期人才储备。判断：韩国胜在"做出来 + 卖出去"，新加坡胜在"治理 + 信任 + 国际枢纽"。两者都是 AI 时代的"大国小国"案例——韩国证明大国可以走集团化路径，新加坡证明小国可以走治理化路径。',
        analysisKo:
          '한국의 싱가포르 대비 핵심 레버는 「재벌 + 반도체 + 법적 프레임워크」조합입니다: (1) 투자 규모 압도—₩100조 vs 싱가포르 정부 S$20억 이상, 규모는 25배; (2) 재벌 체계(삼성, LG, 현대, SK)는 AI를 빠르게 대규모로 배치할 수 있습니다—삼성 2025년 자체 개발 Galaxy AI를 직접 수억 대 기기에 탑재하는 것은 최대 단일 지점 AI 침투입니다; (3) 반도체 제조 능력(삼성 + SK 하이닉스 HBM)은 한국을 글로벌 AI 컴퓨팅 파워 공급망에서 피할 수 없게 만듭니다; (4) AI 기본법 2024년 통과, 입법 속도는 싱가포르보다 2년 앞섭니다. 약점: 재벌 주도가 국내 스타트업 생태계를 압박하고, 영어 국제화는 싱가포르보다 약하며, 인구 고령화는 장기 인재 비축을 낮춥니다. 판단: 한국은 「만들어내기 + 팔아내기」에 승리하고, 싱가포르는 「거버넌스 + 신뢰 + 국제 허브」에 승리합니다. 둘 다 AI 시대의 「큰 나라 작은 나라」사례입니다—한국은 큰 나라가 대기업 중심 경로를 갈 수 있음을 증명하고, 싱가포르는 작은 나라가 거버넌스 중심 경로를 갈 수 있음을 증명합니다.',
        analysisJa:
          '韓国がシンガポール相対で持つ中核的なレバーは「財閥 + 半導体 + 法的枠組み」の組み合わせです：(1) 投資規模で圧倒——₩100 兆 vs シンガポール政府 S$20 十億+、規模は 25 倍；(2) 財閥体系（Samsung、LG、Hyundai、SK）は AI を迅速かつ大規模に展開可能——Samsung は 2025 年に自研 Galaxy AI を直接数億台のスマートフォンに搭載、単一最大の AI 浸透；(3) 半導体製造能力（Samsung + SK Hynix HBM）により韓国は全球 AI 演算力サプライチェーン上で迂回不可能；(4) AI Basic Act 2024 承認、立法のペースはシンガポールより 2 年早い。短所：財閥主導により本地 AI 創業エコシステムは圧迫、英語国際化はシンガポールより劣る、高齢化人口が長期人材貯備を低下。評価：韓国は「つくって + 売る」で勝り、シンガポールは「ガバナンス + 信頼 + 国際ハブ」で勝る。両者ともに AI 時代の「大国小国」事例——韓国は大国がグループ化路線を取れることを証明し、シンガポールは小国がガバナンス化路線を取れることを証明する。',
        analysisEn:
          'South Korea\'s edge over Singapore is the "chaebol + semiconductors + framework law" combination: (1) crushing investment scale — ₩100 trillion vs Singapore\'s S$2bn+, roughly 25x; (2) the chaebol system (Samsung, LG, Hyundai, SK) enables rapid mass AI deployment — Samsung\'s Galaxy AI hit hundreds of millions of devices in 2025, the largest single-point AI penetration globally; (3) semiconductor manufacturing (Samsung + SK hynix HBM) makes Korea unavoidable in global AI compute supply; (4) the AI Basic Act of 2024 puts Korea two years ahead of Singapore on legislation. Weaknesses: chaebol dominance squeezes local AI startups, English internationalisation lags Singapore, an ageing population erodes long-term talent supply. Assessment: Korea wins on "build it + sell it"; Singapore wins on "govern it + trust it + hub it". Both are "big country / small country" templates of the AI era — Korea proves a big country can scale via conglomerates, Singapore proves a small country can scale via governance.',
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI 기본법 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'ITIF：韩国 AI Basic Act 评估',
            labelKo: 'ITIF: 한국 AI 기본법 평가',
            labelJa: 'ITIF：韓国 AI Basic Act 評価',
            labelEn: 'ITIF: Korea AI Basic Act assessment',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'strategy-1': {
        analysis:
          'K-AI Strategy 2019 年发布，是韩国首份完整 AI 国家蓝图，由 MSIT 主导编制。规划：到 2030 年韩国成为全球 AI Top 3（与美中并列）；含 AI 半导体、AI 服务、AI 应用三大支柱；目标 ₩455 万亿 GDP 增量。判断：2019 年的目标"全球 Top 3"对韩国国家自豪感很重要，但事后 5 年（2024）韩国实际位置：AI 论文产出全球第 4-5、AI 创业 / 投资全球第 5-7、frontier model 仍落后美中（Naver HyperCLOVA、Samsung Gauss 还属于"亚洲领先"层级）。K-AI Strategy 在政策执行上不算成功，但它催生了 2024 年的 AI Basic Act 立法——可以说蓝图本身的最大成就是教育出"AI 需要法律"的政治共识。',
        analysisKo:
          'K-AI Strategy는 2019년 발표된 한국 최초의 완전한 AI 국가 청사진으로, MSIT가 주도하여 작성했습니다. 계획: 2030년까지 한국이 글로벌 AI Top 3（미국·중국과 함께）이 되는 것을 목표로 하며, AI 반도체·AI 서비스·AI 응용이라는 세 가지 핵심 기둥을 포함하고 ₩455만억 GDP 증대를 목표로 합니다. 평가: 2019년의 「글로벌 Top 3」 목표는 한국 국가 자긍심에 매우 중요했지만, 5년 후인 2024년 한국의 실제 위치는 다음과 같습니다. AI 논문 산출량 글로벌 4~5위, AI 창업/투자 글로벌 5~7위, 프론티어 모델은 여전히 미국·중국에 뒤쳐져 있으며（Naver HyperCLOVA, Samsung Gauss는 여전히 「아시아 선도」 수준）. K-AI Strategy는 정책 집행 측면에서 성공적이라고 보기 어렵지만, 2024년의 AI Basic Act 입법을 촉발했습니다. 즉, 청사진 자체의 가장 큰 성과는 「AI에는 법률이 필요하다」는 정치적 합의를 만들어낸 것입니다.',
        analysisJa:
          'K-AI Strategy は 2019 年リリース、韓国初の完全な AI 国家ブループリント、MSIT 主導編成。計画：2030 年までに韓国は全球 AI Top 3（米国と中国と並列）；AI 半導体、AI サービス、AI アプリケーションの 3 大柱を含む；目標は ₩455 兆の GDP 増分。評価：2019 年の「全球 Top 3」目標は韓国の国家誇りにとって非常に重要ですが、事後 5 年（2024）の韓国実際位置：AI 論文産出全球第 4～5、AI 創業 / 投資全球第 5～7、frontier model はなお米国と中国に遅れ（Naver HyperCLOVA、Samsung Gauss はなお「アジア領先」レベル）。K-AI Strategy は政策実行上成功ではありませんが、2024 年の AI Basic Act 立法を生み出しました——ブループリント本体の最大の成就は「AI は法律を必要とする」という政治的コンセンサスを教育出したことと言えます。',
        analysisEn:
          'The K-AI Strategy was released in 2019 as South Korea\'s first complete national AI blueprint, MSIT-led. Plan: become a global AI Top 3 (alongside the US and China) by 2030; three pillars — AI semiconductors, AI services, AI applications; target ₩455 trillion in GDP uplift. Assessment: the 2019 "global Top 3" target was important for national prestige, but five years on (2024) Korea\'s actual standing reads: AI publications #4-5 globally, AI startups / investment #5-7, frontier models still trailing the US and China (Naver\'s HyperCLOVA and Samsung\'s Gauss sit in the "Asia-leading" tier rather than global frontier). K-AI Strategy was not a major execution success, but it catalysed the 2024 AI Basic Act legislation — its biggest achievement is arguably building the political consensus that "AI needs law".',
        sources: [
          {
            label: 'AI Basic Act 全文（含 K-AI Strategy 上下文）',
            labelKo: 'AI Basic Act 전문(K-AI Strategy 맥락 포함)',
            labelJa: 'AI Basic Act 全文（K-AI Strategy 背景含む）',
            labelEn: 'Full text of the AI Basic Act (K-AI Strategy context)',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'strategy-2': {
        analysis:
          'AI 基本法 2024 年 12 月 26 日由韩国国会通过，是亚洲首部综合性 AI 法律。2025 年内阁完成执行令（Enforcement Decree）拟定，2026 年 1 月正式生效。核心机制：(1) "高影响 AI"风险分级与影响评估；(2) 生成式 AI 透明度要求（标识 AI 生成内容）；(3) 建立 AI Safety Institute；(4) AI 委员会作为跨部门协调机构；(5) 海外 AI 企业需指定本地代表。判断：韩国选了"EU AI Act 简化版"路径——比新加坡的工具化框架更具法律强制力，但比 EU 更聚焦"高影响 AI"。设计意图是平衡"创新促进"与"风险防控"。但执行细则（特别是"高影响 AI"范围）的具体落地仍需 2026-2027 年的实践来验证。',
        analysisKo:
          'AI 기본법은 2024년 12월 26일 한국 국회를 통과한 아시아 최초의 종합 AI 법률입니다. 2025년 내각에서 집행령(Enforcement Decree) 작성을 완료하고 2026년 1월 정식 발효할 예정입니다. 핵심 메커니즘: (1) 「고임팩트 AI」 위험 등급화 및 영향평가; (2) 생성형 AI 투명성 요구사항(AI 생성 내용 표시); (3) AI Safety Institute 설립; (4) AI 위원회를 부서 간 조정 기구로 구성; (5) 해외 AI 기업은 현지 대표자 지정 필수. 평가: 한국은 「EU AI Act 간소화판」 경로를 선택했습니다. 싱가포르의 도구화 프레임워크보다는 법적 강제력이 더 강하지만 EU보다는 「고임팩트 AI」에 더 집중되어 있습니다. 설계 의도는 「혁신 촉진」과 「위험 방제」의 균형입니다. 다만 집행 세부사항（특히 「고임팩트 AI」의 범위）의 구체적 착지는 여전히 2026~2027년의 실제 운영을 통해 검증이 필요합니다.',
        analysisJa:
          'AI 基本法は 2024 年 12 月 26 日に韓国議会で承認、アジア初の包括的 AI 法律。2025 年内閣が執行令（Enforcement Decree）策定を完了、2026 年 1 月正式施行。中核的メカニズム：(1) 「高影響 AI」リスク分級と影響評価；(2) 生成型 AI 透明性要件（AI 生成コンテンツ標識）；(3) AI Safety Institute を設立；(4) AI 委員会を跨部門協調機関として；(5) 海外 AI 企業は本地代表指定が必要。評価：韓国は「EU AI Act 簡略版」路線を選択——シンガポールの道具化フレームワークより法的拘束力が強いが、EU より「高影響 AI」に集中。設計意図は「革新促進」と「リスク防控」のバランス。ただし実施細則（特に「高影響 AI」範囲）の具体的落地はなお 2026～2027 年の実践検証を要します。',
        analysisEn:
          'The AI Basic Act passed the South Korean National Assembly on 26 December 2024 — Asia\'s first full-scope AI law. The Cabinet finalised the Enforcement Decree in 2025; the law fully takes effect in January 2026. Core mechanisms: (1) "high-impact AI" risk classification and impact assessments; (2) generative AI transparency requirements (label AI-generated content); (3) establishment of an AI Safety Institute; (4) the AI Committee as a cross-ministry coordination body; (5) overseas AI firms must appoint local representatives. Assessment: Korea travels the "simplified EU AI Act" path — more legally binding than Singapore\'s tool-centric framework but more focused on "high-impact AI" than the EU. The design balances "innovation promotion" and "risk control"; the specific scoping of "high-impact AI" needs 2026-2027 practice to verify.',
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI Basic Act 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'US Trade.gov AI Basic Act 解读',
            labelKo: 'US Trade.gov AI Basic Act 해석',
            labelJa: 'US Trade.gov AI Basic Act 解読',
            labelEn: 'US Trade.gov AI Basic Act briefing',
            url: 'https://www.trade.gov/market-intelligence/south-korea-artificial-intelligence-ai-basic-act',
          },
          {
            label: 'White & Case AI Watch — South Korea',
            labelEn: 'White & Case AI Watch — South Korea',
            url: 'https://artificialintelligenceact.com/south-korean-ai-basic-law/',
          },
        ],
      },
      'strategy-3': {
        analysis:
          '韩国 AI 半导体战略 2024 年由 MSIT + 产业通商资源部联合发布，含 ₩9 万亿（~US$65 亿）专项支持。重点方向：(1) 三星 + SK 海力士 HBM（高带宽存储）市场份额全球第一；(2) 自主 AI 推理 / 训练芯片研发（三星 Mach、Rebellions Atom、FuriosaAI RNGD）；(3) 与 NVIDIA / AMD 联合研发；(4) 2030 年目标 AI 芯片全球市场份额 20%。判断：HBM 是韩国 AI 战略中最稳的支柱——SK 海力士在 NVIDIA H100 / B200 中的份额近 70%，三星紧随其后。但自主推理芯片（Rebellions、FuriosaAI 等）规模仍远小于 NVIDIA，需要财阀订单才能规模化。这种"HBM 卖给老美 + 自主芯片自己用"的策略在 2026-2030 是关键观察。',
        analysisKo:
          '한국 AI 반도체 전략은 2024년 MSIT과 산업통상자원부가 연합하여 발표했으며, ₩9만억（약 US$65억）의 특별 지원을 포함합니다. 중점 방향: (1) 삼성 + SK 하이닉스의 HBM（고대역폭 메모리）이 글로벌 시장점유율 1위; (2) 자주 AI 추론/훈련 칩 개발（삼성 Mach, Rebellions Atom, FuriosaAI RNGD）; (3) NVIDIA/AMD와의 공동 개발; (4) 2030년 AI 칩 글로벌 시장점유율 20% 목표. 평가: HBM은 한국 AI 전략에서 가장 견고한 기둥입니다. SK 하이닉스가 NVIDIA H100/B200의 약 70% 점유율을 차지하고 있으며 삼성이 그 뒤를 따릅니다. 그러나 자주 추론 칩（Rebellions, FuriosaAI 등）의 규모는 여전히 NVIDIA에 비해 훨씬 작으며, 대기업의 주문을 받아야 규모화할 수 있습니다. 이러한 「HBM을 미국에 판매 + 자주 칩은 자체 사용」 전략이 2026~2030년의 핵심 관찰 대상입니다.',
        analysisJa:
          '韓国 AI 半導体戦略は 2024 年に MSIT + 産業通商資源部が共同リリース、₩9 兆（~US$65 十億）の専項支援を含む。重点方向：(1) Samsung + SK Hynix HBM（高帯域幅メモリ）の全球市場シェア第一；(2) 自主 AI 推論・訓練チップ研究開発（Samsung Mach、Rebellions Atom、FuriosaAI RNGD）；(3) NVIDIA / AMD との共同研究；(4) 2030 年目標は AI チップ全球市場シェア 20%。評価：HBM は韓国 AI 戦略中で最も安定した柱——SK Hynix は NVIDIA H100 / B200 中のシェアが約 70%、Samsung がこれに続く。ただし自主推論チップ（Rebellions、FuriosaAI など）の規模はなお NVIDIA より遠く小さく、財閥の発注があってこそ規模化可能。この「HBM を米国に売却 + 自主チップは自社使用」の戦略は 2026～2030 の重要観察対象。',
        analysisEn:
          'South Korea\'s AI Semiconductor Strategy was jointly released in 2024 by MSIT + Ministry of Trade, Industry and Energy, with ₩9 trillion (~US$6.5bn) earmarked. Priorities: (1) Samsung + SK hynix HBM (high-bandwidth memory) — currently #1 global market share; (2) sovereign AI inference / training chip R&D (Samsung Mach, Rebellions Atom, FuriosaAI RNGD); (3) joint R&D with NVIDIA / AMD; (4) target 20% global AI chip market share by 2030. Assessment: HBM is the most stable pillar — SK hynix supplies near 70% of NVIDIA H100 / B200 HBM, with Samsung close behind. But sovereign inference chips (Rebellions, FuriosaAI) remain far smaller than NVIDIA and depend on chaebol orders to scale. The "sell HBM to America, use sovereign chips at home" strategy will be the key signal to watch through 2026-2030.',
        sources: [
          {
            label: 'AI Basic Act 全文（含 AI 半导体战略上下文）',
            labelKo: 'AI Basic Act 전문(AI 반도체 전략 맥락 포함)',
            labelJa: 'AI Basic Act 全文（AI 半導体戦略背景含む）',
            labelEn: 'Full text of the AI Basic Act (AI Semiconductor Strategy context)',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'ITIF：韩国 AI 政策分析',
            labelKo: 'ITIF: 한국 AI 정책 분석',
            labelJa: 'ITIF：韓国 AI 政策分析',
            labelEn: 'ITIF: Korea AI policy analysis',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'investment-1': {
        analysis:
          '公私联合 AI 基金 ₩100 万亿（~US$715 亿）2024 年宣布，由政府种子（韩国发展银行 KDB + 韩国产业银行 IBK 等）+ 三星 / SK / 现代 / Naver / Kakao 等财阀配套。规模相当于韩国 2024 年 GDP 的 ~3.7%（vs 新加坡政府 AI 直投占新加坡 GDP < 0.4%）。资金用途：(1) AI 算力 / 数据中心；(2) 大模型训练；(3) AI 半导体研发；(4) AI 创业基金。判断：韩国把"AI 国家战略"和"财阀产业整合"绑在一起，财政补贴 + 财阀订单形成正循环。但本质上是大公司间的资本流转——本土 AI 创业拿到的份额估计仅 5-10%，挤压创业生态。新加坡走开放型枢纽路径成本远低，但放大效应也远低。',
        analysisKo:
          '공공과 민간이 함께하는 AI 펀드인 ₩100만억（약 US$715억）은 2024년에 발표되었으며, 정부 초기자금（한국개발은행 KDB + 한국산업은행 IBK 등）과 삼성/SK/현대/Naver/Kakao 등 재벌의 매칭으로 구성됩니다. 규모는 한국의 2024년 GDP의 약 3.7%에 해당합니다（싱가포르 정부 AI 직접 투자는 싱가포르 GDP의 0.4% 미만）. 자금 용도: (1) AI 컴퓨팅 파워/데이터센터; (2) 대규모 모델 훈련; (3) AI 반도체 개발; (4) AI 창업 펀드. 평가: 한국은 「AI 국가 전략」과 「재벌 산업 통합」을 함께 묶어서 진행하며, 재정 보조금 + 재벌 주문이 정순환을 이룹니다. 그러나 본질적으로는 대기업 간의 자본 순환입니다. 국내 AI 창업이 받는 지분은 추정상 5~10% 수준으로, 창업 생태계를 압축합니다. 싱가포르는 개방형 허브 경로를 걷고 있으며 비용은 훨씬 낮지만 파급 효과도 훨씬 작습니다.',
        analysisJa:
          '官民合同 AI 基金 ₩100 兆（~US$715 十億）は 2024 年発表、政府種子資金（韓国開発銀行 KDB + 韓国産業銀行 IBK など）+ Samsung / SK / Hyundai / Naver / Kakao など財閥による配套。規模は韓国 2024 年 GDP の ~3.7%（vs シンガポール政府 AI 直接投資がシンガポール GDP に占める比 < 0.4%）。資金用途：(1) AI 演算力 / データセンター；(2) 大型モデル訓練；(3) AI 半導体研究開発；(4) AI スタートアップ基金。評価：韓国は「AI 国家戦略」と「財閥産業統合」を一体化させ、財政補助金 + 財閥発注が正循環を形成。本質的には大企業間の資本流転——本地 AI スタートアップが得る比率はおそらく 5～10% のみで、創業エコシステムを圧迫。シンガポールは開放型ハブ路線を取り成本ははるかに低いが、拡大効果もはるかに低い。',
        analysisEn:
          'The ₩100 trillion (~US$71.5bn) public-private AI fund was announced in 2024, with government seed (KDB + IBK and other policy banks) plus chaebol matching from Samsung, SK, Hyundai, Naver, Kakao. Scale equals roughly 3.7% of Korea\'s 2024 GDP (vs Singapore\'s direct government AI commitment at less than 0.4% of GDP). Use of funds: (1) AI compute / data centres; (2) large-model training; (3) AI semiconductor R&D; (4) AI startup financing. Assessment: Korea ties "national AI strategy" to "chaebol industrial consolidation" — fiscal subsidies + chaebol orders form a positive feedback loop. But it is essentially capital cycling between large corporates; estimates suggest only 5-10% reaches local AI startups, squeezing the ecosystem. Singapore\'s open-hub path costs far less but also has far less amplification.',
        sources: [
          {
            label: 'AI Basic Act 全文（含 AI 基金上下文）',
            labelKo: 'AI Basic Act 전문(AI 펀드 맥락 포함)',
            labelJa: 'AI Basic Act 全文（AI 基金背景含む）',
            labelEn: 'Full text of the AI Basic Act (AI fund context)',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'ITIF：韩国 AI 政策分析',
            labelKo: 'ITIF: 한국 AI 정책 분석',
            labelJa: 'ITIF：韓国 AI 政策分析',
            labelEn: 'ITIF: Korea AI policy analysis',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'investment-2': {
        analysis:
          'NVIDIA 合作 US$30 亿在 2024 年 9 月美韩首脑会谈期间宣布。包括：(1) NVIDIA 在韩国建设 AI 数据中心 + 联合实验室；(2) 与三星 / SK 海力士在 HBM 联合研发；(3) NVIDIA H200 / B100 部分产能优先供给韩国；(4) NVIDIA AI 教育计划在韩国大学落地。判断：US$30 亿对 NVIDIA 是"小额"（vs 其 2024 全年资本支出 US$120 亿+），但对韩国是"锁定下一代算力供应"的战略性关键。这相当于韩国版 Stargate UAE——通过与美国对齐换取算力优先供应。新加坡虽然有 NVIDIA 区域 HQ 但没有同等规模的国家级合作。',
        analysisKo:
          'NVIDIA 협력은 2024년 9월 미국·한국 정상회담 기간 중 US$30억 규모로 발표되었습니다. 포함 내용: (1) NVIDIA의 한국 AI 데이터센터 건설 + 공동 실험실; (2) 삼성/SK 하이닉스와의 HBM 공동 개발; (3) NVIDIA H200/B100의 일부 생산 능력을 한국에 우선 공급; (4) NVIDIA AI 교육 프로그램이 한국 대학에 착지. 평가: US$30억은 NVIDIA 입장에서는 「소액」입니다（NVIDIA의 2024년 연간 자본지출 US$120억 이상 대비）. 하지만 한국 입장에서는 「차세대 컴퓨팅 파워 공급의 확보」라는 전략적 요충지입니다. 이는 한국판 Stargate UAE라고 할 수 있습니다. 미국과의 정렬을 통해 컴퓨팅 파워의 우선 공급을 받는 것입니다. 싱가포르는 NVIDIA 지역 본부를 보유하고 있지만 이 정도 규모의 국가급 협력은 없습니다.',
        analysisJa:
          'NVIDIA 協力 US$30 十億は 2024 年 9 月の米韓首脳会談期間に発表。内容：(1) NVIDIA が韓国に AI データセンター + 共同実験室を建設；(2) Samsung / SK Hynix との HBM における共同研究；(3) NVIDIA H200 / B100 の一部産能を韓国に優先供給；(4) NVIDIA AI 教育プログラムが韓国大学で展開。評価：US$30 十億は NVIDIA にとって「小額」（2024 年通年資本支出 US$120 十億+ に対して）ですが、韓国にとっては「次世代演算力供給の確保」の戦略的要。これは韓国版 Stargate UAE に相当——米国とのアライメントにより演算力優先供給を換取。シンガポールは NVIDIA 地域 HQ を有していますが、同等規模の国家級協力は無。',
        analysisEn:
          "The NVIDIA partnership was announced at the September 2024 US-Korea summit at US$3bn. It includes: (1) NVIDIA building AI data centres and joint labs in Korea; (2) joint R&D with Samsung / SK hynix on HBM; (3) priority allocation of NVIDIA H200 / B100 capacity to Korea; (4) NVIDIA AI education programmes landing in Korean universities. Assessment: US$3bn is small relative to NVIDIA's FY24 capex (US$12bn+), but for Korea it is strategically central — locking in next-gen compute supply. It is effectively Korea's Stargate UAE — alignment with the US in exchange for priority compute. Singapore hosts NVIDIA's regional HQ but does not have a national-level partnership of comparable scale.",
        sources: [
          {
            label: 'AI Basic Act 全文（含 NVIDIA 合作背景）',
            labelKo: 'AI Basic Act 전문(NVIDIA 협력 배경 포함)',
            labelJa: 'AI Basic Act 全文（NVIDIA 協力背景含む）',
            labelEn: 'Full text of the AI Basic Act (NVIDIA partnership context)',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'initiative-1': {
        analysis:
          '₩100 万亿公私 AI 基金作为执行项目视角：政府种子（KDB / IBK 等政策银行）2024 年起注入第一期，目标到 2030 年总规模达 ₩100 万亿。已落地子项目包括：三星 AI 投资约 ₩30 万亿（2024 启动）、SK Group 数据中心建设约 ₩15 万亿、Naver / Kakao 大模型 + 服务投入约 ₩10 万亿。判断：基金的"₩100 万亿"是 6 年聚合数字，分年看每年约 ₩16-20 万亿（~US$120-150 亿），仍是新加坡公开 AI 直投的 6-8 倍。但资金大头流向已成熟的大企业，不是新创——这种结构对快速做大产业有利，对孵化新模式不利。',
        analysisKo:
          '₩100만억 공공·민간 AI 펀드를 집행 프로젝트 관점에서 보면: 정부 초기자금（KDB/IBK 등 정책 금융기관）은 2024년부터 투입되기 시작했으며, 2030년까지 총 규모 ₩100만억에 도달하는 것을 목표로 합니다. 이미 착지한 세부 프로젝트로는 삼성 AI 투자 약 ₩30만억（2024년 시작）, SK Group 데이터센터 건설 약 ₩15만억, Naver/Kakao 대규모 모델 + 서비스 투입 약 ₩10만억이 있습니다. 평가: 펀드의 「₩100만억」은 6년 통합 수치입니다. 연간으로 보면 약 ₩16~20만억（약 US$120~150억）으로, 싱가포르의 공개 AI 직접 투자의 6~8배입니다. 하지만 자금의 대부분이 이미 성숙한 대기업으로 흘러가며, 신생 기업이 아닙니다. 이러한 구조는 빠르게 산업을 확대하는 데는 유리하지만, 새로운 비즈니스 모델을 배양하는 데는 불리합니다.',
        analysisJa:
          '₩100 兆官民 AI 基金を実行プロジェクト視角から見ると：政府種子資金（KDB / IBK など政策銀行）は 2024 年から第一期投入を開始、2030 年までに総規模 ₩100 兆に到達を目標。既に落地した子プロジェクトには：Samsung AI 投資約 ₩30 兆（2024 起動）、SK Group データセンター建設約 ₩15 兆、Naver / Kakao 大型モデル + サービス投入約 ₩10 兆。評価：基金の「₩100 兆」は 6 年集計数字、年次で見ると毎年約 ₩16～20 兆（~US$120～150 十億）であり、なおシンガポール公開 AI 直接投資の 6～8 倍。ただし資金の大部分は成熟企業に流れ、新規創業ではない——この構造は産業を急速に拡大するに利するが、新モデルをインキュベートするには不利。',
        analysisEn:
          "The ₩100 trillion public-private AI fund from a project-execution lens: government seed (KDB / IBK and other policy banks) began injecting the first tranche in 2024, with the ₩100 trillion total targeted by 2030. Landed sub-projects include Samsung AI investment ~₩30 trillion (started 2024), SK Group data centre build-out ~₩15 trillion, Naver / Kakao large-model + service spend ~₩10 trillion. Assessment: the ₩100 trillion is a six-year aggregate; spread evenly that is ~₩16-20 trillion / year (~US$12-15bn) — still 6-8x Singapore's publicly disclosed direct AI commitments. But the bulk flows to established giants, not new entrants — favourable for scaling existing industries, not for incubating new patterns.",
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI Basic Act 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'initiative-2': {
        analysis:
          'AI Basic Act 实施（2025 起草执行令、2026 生效）作为执行项目：(1) 2025 年 H1 MSIT 完成执行令（Enforcement Decree）草案，含"高影响 AI"清单、风险评估流程、AI 委员会组成；(2) 2025-09 内阁通过执行令；(3) 2026-01 法律正式生效；(4) 2026 起企业必须按法律合规——高影响 AI 上线前必须完成影响评估、生成式 AI 必须标识、海外 AI 服务必须指定本地代表。判断：实施周期看起来有序，但 ITIF 报告指出 AI Basic Act 的"弱链"在于"高影响 AI"定义模糊——MSIT 执行令的具体清单将决定法律的真实硬度。2026-2027 年企业合规成本和争议案例会显示韩国治理模式的实际效力。',
        analysisKo:
          'AI Basic Act의 실행（2025년부터 집행령 작성, 2026년 발효）을 집행 프로젝트로 봅시다: (1) 2025년 상반기 MSIT이 집행령(Enforcement Decree) 초안을 완성하며, 「고임팩트 AI」 목록, 위험평가 절차, AI 위원회 구성을 포함합니다; (2) 2025년 9월 내각이 집행령을 승인; (3) 2026년 1월 법률이 정식 발효; (4) 2026년부터 기업은 법률에 따라 준수해야 하며, 고임팩트 AI 출시 전에는 반드시 영향평가를 완료하고, 생성형 AI는 반드시 표시하고, 해외 AI 서비스는 현지 대표자를 지정해야 합니다. 평가: 실행 주기는 질서 있어 보이지만, ITIF 보고서는 AI Basic Act의 「약점」이 「고임팩트 AI」 정의의 모호함에 있다고 지적합니다. MSIT 집행령의 구체적 목록이 법률의 실제 강도를 결정할 것입니다. 2026~2027년의 기업 준수 비용과 분쟁 사례가 한국의 거버넌스 모델의 실제 효력을 드러낼 것입니다.',
        analysisJa:
          'AI Basic Act 実施（2025 年執行令策定、2026 年施行）を実行プロジェクトとして見ると：(1) 2025 年上半期 MSIT が執行令（Enforcement Decree）草案を完成、「高影響 AI」清単、リスク評価プロセス、AI 委員会構成を含む；(2) 2025 年 9 月内閣が執行令を承認；(3) 2026 年 1 月法律正式施行；(4) 2026 年からは企業は法律に基づき合規必須——高影響 AI オンライン前に影響評価を完了必須、生成型 AI は標識必須、海外 AI サービスは本地代表指定必須。評価：実施周期は順序立っているように見えますが、ITIF 報告は AI Basic Act の「弱点」が「高影響 AI」定義が曖昧な点にあることを指摘——MSIT 執行令の具体的清単が法律の真の硬度を決定。2026～2027 年の企業合規コストと争点案例は韓国ガバナンスモデルの実際の効力を示します。',
        analysisEn:
          'AI Basic Act implementation (Enforcement Decree drafted 2025, law in force 2026) as a project: (1) H1 2025: MSIT drafted the Enforcement Decree, including the "high-impact AI" catalogue, risk-assessment workflow, and AI Committee composition; (2) September 2025: Cabinet approval; (3) January 2026: law fully in force; (4) from 2026, firms must comply — high-impact AI requires impact assessment before launch, generative AI must be labelled, and overseas AI services must appoint local representatives. Assessment: the implementation cadence looks orderly, but ITIF flags the "weak link" — the definition of "high-impact AI" is ambiguous; MSIT\'s catalogue will determine the law\'s actual hardness. Compliance costs and dispute cases through 2026-2027 will reveal how the Korean governance model performs in practice.',
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI Basic Act 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'ITIF：韩国 AI Basic Act 评估',
            labelKo: 'ITIF: 한국 AI Basic Act 평가',
            labelJa: 'ITIF：韓国 AI Basic Act 評価',
            labelEn: 'ITIF: Korea AI Basic Act assessment',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'initiative-3': {
        analysis:
          '三星 / Naver / Kakao 自研大模型是韩国 AI 战略中最有"产品力"的部分：(1) 三星 Galaxy AI（基于 Samsung Gauss + Google Gemini Nano）2024-25 装机数亿台手机；(2) Naver HyperCLOVA X（韩语 frontier model）覆盖 Naver 搜索 + Clova X 助手；(3) Kakao KoGPT / Kakao i 服务于 Kakao Talk 4500 万用户；(4) LG EXAONE 用于 LG 集团内部 + 公开 API；(5) SK Telecom A.X 用于电信 / 客服。判断：韩国财阀的"自研模型 + 自有渠道"组合是少数能与 ChatGPT / Claude 在垂直应用上正面竞争的非美产品。但 frontier 性能（vs GPT-4o / Claude 3.5）仍落后约一代，主要靠"本土化优势 + 渠道锁定"取胜。',
        analysisKo:
          '삼성/Naver/Kakao의 자체 개발 대규모 모델은 한국 AI 전략 중 가장 「제품력」있는 부분입니다: (1) 삼성 Galaxy AI（Samsung Gauss + Google Gemini Nano 기반）는 2024~25년에 수억 대의 스마트폰에 탑재되어 있습니다; (2) Naver HyperCLOVA X（한국어 프론티어 모델）는 Naver 검색 + Clova X 어시스턴트에 배포되었습니다; (3) Kakao KoGPT/Kakao i는 4,500만 명의 Kakao Talk 사용자들을 위해 서비스합니다; (4) LG EXAONE은 LG 그룹 내부 및 공개 API에 사용됩니다; (5) SK Telecom A.X는 통신/고객 서비스에 사용됩니다. 평가: 한국 재벌의 「자체 개발 모델 + 자체 채널」 조합은 ChatGPT/Claude와 수직 애플리케이션에서 정면으로 경쟁할 수 있는 몇 안 되는 미국 외 제품입니다. 다만 프론티어 성능（GPT-4o/Claude 3.5 대비）은 여전히 약 한 세대 뒤쳐져 있으며, 주로 「현지화 우위 + 채널 고착」으로 우위를 점하고 있습니다.',
        analysisJa:
          'Samsung / Naver / Kakao の自研大型モデルは韓国 AI 戦略中で最も「製品力」ある部分です：(1) Samsung Galaxy AI（Samsung Gauss + Google Gemini Nano に基づく）2024～25 年数億台のスマートフォンにプリインストール；(2) Naver HyperCLOVA X（韓語 frontier model）が Naver 検索 + Clova X アシスタントをカバー；(3) Kakao KoGPT / Kakao i は Kakao Talk 4,500 万ユーザーにサービス；(4) LG EXAONE は LG グループ内部 + 公開 API に使用；(5) SK Telecom A.X は通信 / カスタマーサービスに使用。評価：韓国財閥の「自研モデル + 自有チャネル」組み合わせは ChatGPT / Claude と垂直応用で正面競合できる少数の非米製品。ただし frontier 性能（GPT-4o / Claude 3.5 に対して）はなお約一世代遅れ、主に「本地化優位 + チャネルロック」で勝利。',
        analysisEn:
          'Proprietary large models from Samsung / Naver / Kakao are the most "product-shipped" part of Korea\'s AI strategy: (1) Samsung Galaxy AI (based on Samsung Gauss + Google Gemini Nano) shipped on hundreds of millions of phones in 2024-25; (2) Naver HyperCLOVA X (a Korean-language frontier model) powers Naver search and Clova X assistant; (3) Kakao KoGPT / Kakao i serves Kakao Talk\'s 45 million users; (4) LG EXAONE serves LG group plus a public API; (5) SK Telecom A.X serves telecom and customer service. Assessment: the "sovereign model + captive channel" combination from Korean chaebols is one of the few non-US AI products that can compete head-on with ChatGPT / Claude in vertical applications. But frontier performance (vs GPT-4o / Claude 3.5) trails by roughly a generation, with localisation and channel lock-in carrying most of the wins.',
        sources: [
          {
            label: 'ITIF：韩国 AI 政策分析',
            labelKo: 'ITIF: 한국 AI 정책 분석',
            labelJa: 'ITIF：韓国 AI 政策分析',
            labelEn: 'ITIF: Korea AI policy analysis',
            url: 'https://itif.org/publications/2025/09/29/one-law-sets-south-koreas-ai-policy-one-weak-link-could-break-it/',
            date: '2025-09-29',
          },
        ],
      },
      'initiative-4': {
        analysisEn:
          "The US$3bn NVIDIA partnership was announced at the September 2024 US-Korea summit, covering: (1) NVIDIA building AI data centres and joint labs in Korea; (2) joint R&D with Samsung / SK hynix on HBM; (3) priority allocation of next-gen H200 / B100 capacity to Korea; (4) NVIDIA AI education programmes deploying into Korean universities. Assessment: US$3bn is small for NVIDIA but strategically central for Korea — locking in next-gen compute supply. It is the Asian counterpart to UAE's Stargate partnership: Korea trades alignment for compute, while UAE trades capital for compute. Singapore has neither route, relying on private NVIDIA regional HQ rather than national-level partnership.",
        analysis:
          'US$30 亿 NVIDIA 合作 2024 年 9 月美韩首脑会谈期间宣布，包括：(1) NVIDIA 在韩国建设 AI 数据中心 + 联合实验室；(2) 与三星 / SK 海力士 HBM 联合研发；(3) 下一代 H200 / B100 产能优先供给韩国；(4) NVIDIA AI 教育计划在韩国大学落地。判断：US$30 亿对 NVIDIA 是小额但对韩国是战略核心——锁定下一代算力。这是 UAE Stargate 的亚洲对照：韩国用对齐换算力，UAE 用资本换算力。新加坡两条路径都没有，依赖 NVIDIA 区域 HQ 而非国家级合作。',
        analysisKo:
          'US$30억 NVIDIA 협력은 2024년 9월 미국·한국 정상회담 기간 중 발표되었으며, 다음을 포함합니다: (1) NVIDIA가 한국에 AI 데이터센터 + 공동 실험실을 건설; (2) 삼성/SK 하이닉스와의 HBM 공동 개발; (3) 차세대 H200/B100 생산 능력을 한국에 우선 공급; (4) NVIDIA AI 교육 프로그램이 한국 대학에 착지. 평가: US$30억은 NVIDIA 입장에서는 소액이지만 한국 입장에서는 전략의 핵심입니다. 차세대 컴퓨팅 파워를 확보하는 것입니다. 이는 UAE Stargate의 아시아판 대조 사례입니다. 한국은 정렬을 통해 컴퓨팅 파워를 받고, UAE는 자본을 통해 받습니다. 싱가포르는 두 경로 모두 없으며, NVIDIA 지역 본부에 의존할 뿐 국가급 협력은 없습니다.',
        analysisJa:
          'US$30 億の NVIDIA 協力は 2024 年 9 月の米韓首脳会談期間に発表され、以下を含みます：(1) NVIDIA が韓国に AI データセンター + 共同研究所を構築；(2) Samsung/SK Hynix HBM との共同開発；(3) 次世代 H200/B100 の生産能力を韓国に優先供給；(4) NVIDIA AI 教育プログラムが韓国の大学に実装される。評価：US$30 億は NVIDIA にとって小額だが、韓国にとっては戦略的中核—次世代の計算能力を確保します。これは UAE Stargate のアジア版の対照です：韓国は協調で計算能力を確保し、UAE は資本で計算能力を確保します。シンガポールは 2 つのパスを持たず、NVIDIA 地域本部に依存しており、国家レベルの協力ではありません。',
        sources: [
          {
            label: 'AI Basic Act 全文（含 NVIDIA 合作背景）',
            labelKo: 'AI Basic Act 전문(NVIDIA 협력 배경 포함)',
            labelJa: 'AI Basic Act 全文（NVIDIA 協力の背景を含む）',
            labelEn: 'Full text of the AI Basic Act (NVIDIA context)',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'initiative-5': {
        analysis:
          'AI 半导体自主化战略 2024 年发布，₩9 万亿（~US$65 亿）专项。重点：(1) HBM 全球第一（SK 海力士 + 三星合占 NVIDIA AI 加速器 HBM 供应近 90%）；(2) 自主推理芯片研发（三星 Mach、Rebellions Atom、FuriosaAI RNGD）；(3) 2030 年目标 AI 芯片全球市场份额 20%。判断：HBM 是韩国 AI 战略中最稳的杠杆——已经事实垄断，未来 3-5 年无人能撼动。但自主推理 / 训练芯片（vs NVIDIA）仍是补课赛——三星 Mach 1 在 2024 年发布但商用规模 < 1%，Rebellions / FuriosaAI 是 fabless 创业，需要财阀采购才能起量。',
        analysisKo:
          'AI 반도체 자주화 전략은 2024년 발표되었으며 ₩9만억（약 US$65억）의 특별자금을 포함합니다. 중점: (1) HBM 글로벌 1위（SK 하이닉스 + 삼성이 NVIDIA AI 가속기의 HBM 공급의 거의 90%를 차지）; (2) 자주 추론 칩 개발（삼성 Mach, Rebellions Atom, FuriosaAI RNGD）; (3) 2030년 AI 칩 글로벌 시장점유율 20% 목표. 평가: HBM은 한국 AI 전략 중 가장 견고한 레버입니다. 이미 실질적 독점을 이루고 있으며, 향후 3~5년 동안 누구도 흔들지 못할 것입니다. 하지만 자주 추론/훈련 칩（NVIDIA 대비）은 여전히 보충 경쟁입니다. 삼성 Mach 1은 2024년에 출시되었지만 상용 규모는 1% 미만이고, Rebellions/FuriosaAI는 팹리스 창업으로 재벌의 구매가 있어야 규모가 나옵니다.',
        analysisJa:
          'AI 半導体自主化戦略は 2024 年に発表され、₩9 兆（〜US$65 億）の専項です。重点：(1) HBM はグローバル第一位（SK Hynix + Samsung が NVIDIA AI アクセラレータの HBM 供給の約 90% を占める）；(2) 自主推論チップの研究開発（Samsung Mach、Rebellions Atom、FuriosaAI RNGD）；(3) 2030 年のターゲット AI チップのグローバル市場シェア 20%。評価：HBM は韓国の AI 戦略における最も安定したレバー—既に事実上の独占状態で、今後 3～5 年間、誰も揺るがすことができません。しかし、自主推論/トレーニングチップ（vs NVIDIA）は依然としてキャッチアップレース—Samsung Mach 1 は 2024 年に発表されましたが、商用規模は 1% 未満で、Rebellions/FuriosaAI は Fabless スタートアップで、財閥の調達が必要にして初めて量産化できます。',
        analysisEn:
          "The AI Semiconductor Sovereignty Strategy was released in 2024 with ₩9 trillion (~US$6.5bn) earmarked. Priorities: (1) HBM global #1 (SK hynix + Samsung supply roughly 90% of NVIDIA AI accelerator HBM); (2) sovereign inference chip R&D (Samsung Mach, Rebellions Atom, FuriosaAI RNGD); (3) target 20% global AI chip market share by 2030. Assessment: HBM is Korea's most stable leverage — a de facto monopoly that no one can challenge in the next 3-5 years. But sovereign inference / training chips (vs NVIDIA) remain catch-up — Samsung Mach 1 launched in 2024 with commercial share below 1%; Rebellions / FuriosaAI are fabless startups that need chaebol procurement to scale.",
        sources: [
          {
            label: 'AI Basic Act 全文（含 AI 半导体战略）',
            labelKo: 'AI Basic Act 전문(AI 반도체 전략 포함)',
            labelJa: 'AI Basic Act 全文（AI 半導体戦略を含む）',
            labelEn: 'Full text of the AI Basic Act (semiconductor strategy)',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'body-1': {
        analysis:
          'MSIT（科学技术信息通信部，Ministry of Science and ICT）是韩国 AI 政策最高主管部门。AI 相关职能：(1) AI Basic Act 起草与执行令制定；(2) ₩100 万亿公私 AI 基金的政府方协调；(3) AI Safety Institute 监督；(4) 与三星 / SK / Naver / Kakao 财阀的产业政策协调。MSIT 自 2017 年改组（前身科学技术部 + 信息通信部合并）以来一直是数字与 AI 政策的核心。判断：MSIT 是韩国 AI 政策的"all-in-one"主管部门——比新加坡 SNDGO 更强（SNDGO 不直接监管），比 SG IMDA 范围更广（IMDA 不立法）。这种集中度在韩国财阀经济结构下高效，但缺乏部门间制衡。',
        analysisKo:
          'MSIT（과학기술정보통신부, Ministry of Science and ICT）는 한국 AI 정책의 최고 주관 부처입니다. AI 관련 직무: (1) AI Basic Act 입안 및 집행령 제정; (2) ₩100만억 공공·민간 AI 펀드의 정부 측 조정; (3) AI Safety Institute 감시; (4) 삼성/SK/Naver/Kakao 재벌과의 산업 정책 조정. MSIT는 2017년 개편 이후（전 과학기술부 + 정보통신부 합병）로 계속 디지털 및 AI 정책의 중심입니다. 평가: MSIT는 한국 AI 정책의 「all-in-one」주관 부처입니다. 싱가포르의 SNDGO보다 강합니다（SNDGO는 직접 규제하지 않습니다）. SG IMDA보다 범위가 넓습니다（IMDA는 입법하지 않습니다）. 이러한 집중도는 한국 재벌 경제 구조에서는 효율적이지만 부처 간 견제가 부족합니다.',
        analysisJa:
          'MSIT（科学技術情報通信部、Ministry of Science and ICT）は韓国 AI 政策の最高主管部門です。AI 関連職能：(1) AI Basic Act の起草と執行令の制定；(2) ₩100 兆公私 AI 基金の政府方調整；(3) AI Safety Institute の監督；(4) サムスン / SK / Naver / Kakao 財閥との産業政策調整。MSIT は 2017 年の改組（前身は科学技術部 + 情報通信部の合併）以来、デジタルと AI 政策の中核です。判断：MSIT は韓国 AI 政策の「all-in-one」主管部門です——シンガポール SNDGO より強力（SNDGO は直接監管しない）、SG IMDA より広範（IMDA は立法しない）。この集中度は韓国財閥経済構造下で高効率ですが、部門間制衡に欠けています。',
        analysisEn:
          "MSIT (Ministry of Science and ICT) is South Korea's top ministry for AI policy. AI-related functions: (1) drafting the AI Basic Act and its Enforcement Decree; (2) government-side coordination of the ₩100 trillion public-private AI fund; (3) oversight of the AI Safety Institute; (4) industrial-policy coordination with Samsung / SK / Naver / Kakao. MSIT, formed in 2017 from a merger of the former Ministry of Science and Technology and the Ministry of Information and Communication, has been the centre of digital and AI policy ever since. Assessment: MSIT is Korea's all-in-one AI lead — broader than Singapore SNDGO (which does not directly regulate) and broader than IMDA (which does not legislate). This concentration is efficient inside Korea's chaebol economy but offers little inter-agency check.",
        sources: [
          {
            label: 'AI Basic Act 全文',
            labelKo: 'AI Basic Act 전문',
            labelJa: 'AI Basic Act 全文',
            labelEn: 'Full text of the AI Basic Act',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'US Trade.gov AI Basic Act 解读',
            labelKo: 'US Trade.gov AI Basic Act 해석',
            labelJa: 'US Trade.gov AI Basic Act 解読',
            labelEn: 'US Trade.gov AI Basic Act briefing',
            url: 'https://www.trade.gov/market-intelligence/south-korea-artificial-intelligence-ai-basic-act',
          },
        ],
      },
      'body-2': {
        analysis:
          'NIPA（国家信息产业振兴院，National IT Industry Promotion Agency）是 MSIT 下属的 AI 产业推进执行机构。AI 相关职能：(1) AI 创业资助；(2) 中小企业 AI 应用辅导；(3) AI 开发者社群与人才培养；(4) AI 产业数据 / 标准制定。判断：NIPA 是韩国 AI 政策栈中"中小企业入口"——财阀有自己的研发资源，新创和 SMB 主要通过 NIPA 拿政府支持。但 NIPA 预算 / 影响力远小于 MSIT 主流通道，更接近"补丁"角色而非"主路径"。',
        analysisKo:
          'NIPA（국가정보산업진흥원, National IT Industry Promotion Agency）는 MSIT 산하의 AI 산업 추진 집행 기구입니다. AI 관련 직무: (1) AI 창업 보조금; (2) 중소기업 AI 적용 지도; (3) AI 개발자 커뮤니티 및 인재 양성; (4) AI 산업 데이터/표준 제정. 평가: NIPA는 한국 AI 정책 체계에서 「중소기업 입구」입니다. 재벌은 자체 개발 자원을 가지고 있고, 신생 기업과 SMB는 주로 NIPA를 통해 정부 지원을 받습니다. 하지만 NIPA의 예산/영향력은 MSIT 주류 채널보다 훨씬 작으며, 「패치」 역할에 더 가깝고 「주 경로」가 아닙니다.',
        analysisJa:
          'NIPA（国家情報産業振興院、National IT Industry Promotion Agency）は MSIT 配下の AI 産業推進実行機構です。AI 関連職能：(1) AI 起業資助；(2) 中小企業 AI 応用指導；(3) AI 開発者社群と人材育成；(4) AI 産業データ / 標準制定。判断：NIPA は韓国 AI 政策スタックの「中小企業エントランス」です——財閥は自社の研究開発資源を持っており、新創と SMB は主に NIPA を通じて政府支援を得ます。しかし NIPA の予算 / 影響力は MSIT 主流通路はるか以下であり、「パッチ」役に近く、「主路径」ではありません。',
        analysisEn:
          "NIPA (National IT Industry Promotion Agency) sits under MSIT as the executor of AI industry promotion. AI-related functions: (1) AI startup grants; (2) mentoring SMEs on AI application; (3) developer-community programmes and talent pipelines; (4) AI industry data and standards work. Assessment: NIPA is Korea's \"SME entry point\" in the AI policy stack — chaebols have their own R&D, while startups and SMEs depend on NIPA for government support. But NIPA's budget and influence are far smaller than MSIT's mainline channels; it functions more as a patch than as a primary path.",
        sources: [
          {
            label: 'AI Basic Act 全文（含 NIPA 上下文）',
            labelKo: 'AI Basic Act 전문(NIPA 맥락 포함)',
            labelJa: 'AI Basic Act 全文（NIPA 上下文を含む）',
            labelEn: 'Full text of the AI Basic Act (NIPA context)',
            url: 'https://aibasicact.kr/',
          },
        ],
      },
      'body-3': {
        analysisEn:
          "The AI Committee was established by the AI Basic Act (effective January 2026) as a cross-ministry coordination body. Composition: chaired by the Prime Minister, with vice-chairs from the private sector and AI experts; coordinates between MSIT, the Ministry of Trade Industry and Energy, the FSC, and other line ministries. Functions: (1) reviewing the national AI strategy; (2) approving the AI Safety Institute's catalogue of high-impact AI; (3) handling cross-ministry AI policy disputes. Assessment: this is Korea's first formal AI cross-ministry body. Compared with Singapore's existing SNDGO + IMDA + MAS soft-coordination model, the AI Committee is more authoritative and chaebol-influenced (private-sector vice-chair seats often go to chaebol leaders). Whether it actually functions or becomes a paper organ depends on the Prime Minister's commitment and political continuity through 2026-2027.",
        analysis:
          'AI 委员会由 AI 基本法（2026 年 1 月生效）设立，是跨部门协调机构。组成：总理任主席，副主席来自私部门和 AI 专家；协调 MSIT、产业通商资源部、FSC 等各部委。职能：(1) 审议国家 AI 战略；(2) 批准 AI Safety Institute 的高影响 AI 清单；(3) 处理跨部门 AI 政策争议。判断：这是韩国首个正式 AI 跨部门机构。相比新加坡 SNDGO + IMDA + MAS 软协调模式，AI 委员会更具权威性且财阀影响大（私部门副主席席位常给财阀领袖）。能否真正运作还是变成"纸面机构"取决于总理决心和政治连续性 2026-2027 年的表现。',
        analysisKo:
          'AI 위원회는 AI 기본법（2026년 1월 발효）으로 설립되었으며, 부처 간 조정 기구입니다. 구성: 총리가 주석을 맡고, 부주석은 민간 부문 및 AI 전문가에게서 나오며, MSIT, 산업통상자원부, FSC 등 각 부처를 조정합니다. 직무: (1) 국가 AI 전략 심의; (2) AI Safety Institute의 고임팩트 AI 목록 비준; (3) 부처 간 AI 정책 분쟁 처리. 평가: 이는 한국 최초의 공식 AI 부처 간 기구입니다. 싱가포르의 SNDGO + IMDA + MAS 소프트 조정 모델과 비교하면 AI 위원회는 더욱 권위 있으며 재벌의 영향이 큽니다（민간 부처 부주석 자리는 종종 재벌 지도자에게 주어집니다）. 실제로 작동하는지 아니면 「종이 기구」가 되는지는 총리의 결단과 2026~2027년의 정치적 연속성의 실행에 따라 결정됩니다.',
        analysisJa:
          'AI 委員会は AI 基本法（2026 年 1 月施行）によって設立された、部門横断的協調機構です。構成：総理が主席を務め、副主席は民間部門と AI 専門家から選出；MSIT、産業通商資源部、FSC など各部委を調整。職能：(1) 国家 AI 戦略を審議；(2) AI Safety Institute の高影響 AI リストを承認；(3) 部門横断的 AI 政策紛争に対処。判断：これは韓国初の公式な AI 部門横断機構です。シンガポール SNDGO + IMDA + MAS のソフト協調モデルと比較すると、AI 委員会はより権威性を有し、財閥の影響力も大きい（民間副主席席は財閥指導者に与えられることが多い）。真正に機能するか、「紙面機構」に成り下がるかは、総理の決意と 2026-2027 年の政治的連続性にかかっています。',
        sources: [
          {
            label: 'AI Basic Act 全文（含 AI 委员会条款）',
            labelKo: 'AI Basic Act 전문(AI 위원회 조항 포함)',
            labelJa: 'AI Basic Act 全文（AI 委員会条項を含む）',
            labelEn: 'Full text of the AI Basic Act (AI Committee clauses)',
            url: 'https://aibasicact.kr/',
          },
          {
            label: 'White & Case AI Watch — South Korea',
            labelEn: 'White & Case AI Watch — South Korea',
            url: 'https://artificialintelligenceact.com/south-korean-ai-basic-law/',
          },
        ],
      },
    },
  },
  {
    flag: '🇪🇪',
    name: '爱沙尼亚',
    nameKo: '에스토니아',
    nameJa: 'エストニア',
    nameEn: 'Estonia',
    fullName: '爱沙尼亚共和国',
    fullNameKo: '에스토니아 공화국',
    fullNameJa: 'エストニア共和国',
    fullNameEn: 'Republic of Estonia',
    overview:
      '爱沙尼亚以仅 €1000 万的 AI 预算实现了 50+ 政府 AI 用例，是极致效率的典范。作为全球数字政府标杆（99% 政府服务在线），其 Bürokratt 虚拟助手和 AI Agent 法律定义走在全球前列。',
    overviewKo:
      '에스토니아는 €1000만에 불과한 AI 예산으로 50개 이상의 정부 AI 사용 사례를 실현했으며, 극도의 효율성의 모범입니다. 글로벌 디지털 정부 표준(99% 정부 서비스 온라인화)으로서, 그 Bürokratt 가상 어시스턴트와 AI Agent 법적 정의는 전 세계 최첨단입니다.',
    overviewJa:
      'エストニアは、わずか €1000 万の AI 予算で 50 以上の政府 AI ユースケースを実現し、極致の効率の典範です。グローバルなデジタル政府のベンチマーク（99% の政府サービスがオンライン）として、その Bürokratt 仮想アシスタントと AI Agent 法律定義はグローバルに先行しています。',
    overviewEn:
      'With an AI budget of just €10 million, Estonia has delivered 50+ government AI use cases — a paragon of extreme efficiency. As the global benchmark for digital government (99% of public services online), its Bürokratt virtual assistant and legal definition of AI Agents lead the world.',
    strategies: [
      {
        name: 'Kratt AI 战略',
        nameKo: 'Kratt AI 전략',
        nameJa: 'Kratt AI 戦略',
        nameEn: 'Kratt AI Strategy',
        year: '2019',
        description: '"Kratt"（爱沙尼亚民间传说中的仆人精灵）战略，推动政府 AI 应用',
        descriptionKo: '「Kratt」(에스토니아 민간 전설의 종 정령) 전략, 정부 AI 응용 추진',
        descriptionJa: '「Kratt」（エストニアの民間伝説の従者精霊）戦略、政府 AI 応用の推進',
        descriptionEn: '"Kratt" (a servant spirit from Estonian folklore) strategy, driving government AI adoption',
      },
      {
        name: 'EU AI Act 对齐',
        nameKo: 'EU AI Act 정렬',
        nameJa: 'EU AI Act への対齊',
        nameEn: 'EU AI Act Alignment',
        year: '2024',
        description: '作为欧盟成员国，对齐欧盟 AI 法案',
        descriptionKo: 'EU 회원국으로서 EU AI 법안과의 정렬',
        descriptionJa: '欧州連合加盟国として、欧州連合 AI 法案への対齊',
        descriptionEn: 'As an EU member state, aligning with the EU AI Act',
      },
    ],
    investment: [
      {
        item: 'AI 战略预算',
        itemKo: 'AI 전략 예산',
        itemJa: 'AI 戦略予算',
        itemEn: 'AI Strategy Budget',
        amount: '€1000 万',
        amountKo: '€1000만',
        amountJa: '€1000 万',
        amountEn: '€10 million',
        note: '极小预算，极致效率',
        noteKo: '극소 예산, 극도의 효율성',
        noteJa: '極小予算、極致の効率',
        noteEn: 'Minimal budget, maximal efficiency',
      },
    ],
    governance:
      '爱沙尼亚是全球首个为 AI Agent 提供法律定义的国家，允许 AI 系统以"数字助手"身份执行特定政府服务。同时作为欧盟成员国，需对齐 EU AI Act。其治理模式以实用主义和技术先行著称。',
    governanceKo:
      '에스토니아는 AI Agent에 법적 정의를 제공한 세계 최초의 국가로, AI 시스템이 「디지털 어시스턴트」 신분으로 특정 정부 서비스를 수행할 수 있도록 허용합니다. 동시에 EU 회원국으로서 EU AI Act와의 정렬이 필요합니다. 그 거버넌스 모델은 실용주의와 기술 우선 원칙으로 유명합니다.',
    governanceJa:
      'エストニアは、AI Agent に法律定義を提供する世界初の国です。AI システムが「デジタルアシスタント」の身分で特定の政府サービスを実行することを認める法律制度です。同時に欧州連合加盟国として、EU AI Act との対齊が必要です。その治理モデルは実用主義と技術優先の特徴があります。',
    governanceEn:
      'Estonia is the first country in the world to provide a legal definition of AI Agents, permitting AI systems to perform specific government services as "digital assistants". As an EU member, it must align with the EU AI Act. Its governance model is known for pragmatism and technology-first execution.',
    keyInitiatives: [
      'Bürokratt 政府虚拟助手',
      '50+ 政府 AI 用例部署',
      'AI Agent 法律框架先驱',
      'e-Residency 数字身份体系',
      'X-Road 政府数据交换平台',
    ],
    keyInitiativesEn: [
      'Bürokratt government virtual assistant',
      '50+ government AI use cases deployed',
      'Pioneer of the AI Agent legal framework',
      'e-Residency digital identity system',
      'X-Road government data exchange platform',
    ],
    strengths: [
      '数字政府全球第一——99% 政府服务在线',
      '极致效率：€1000 万实现 50+ AI 用例，新加坡可借鉴的效率标杆',
      'AI Agent 法律定义全球领先',
      '小国敏捷性——政策实验周期极短',
    ],
    strengthsEn: [
      "World's #1 digital government — 99% of public services online",
      'Extreme efficiency: €10 million delivers 50+ AI use cases — a benchmark Singapore can learn from',
      'Global leader in legal definition of AI Agents',
      'Small-state agility — extremely short policy experimentation cycles',
    ],
    weaknesses: [
      '规模极小（人口 130 万），经验不一定可直接复制',
      '缺乏本土科技巨头和 AI 企业',
      '研发投入无法与新加坡的 A*STAR、AISG 相比',
      '人才池有限，依赖欧盟人才流动',
    ],
    weaknessesEn: [
      'Tiny scale (1.3 million population); lessons may not transfer directly',
      'No homegrown tech giants or major AI firms',
      "R&D investment cannot match Singapore's A*STAR or AISG",
      'Limited talent pool; reliant on EU talent mobility',
    ],
    keyBodies: [
      {
        name: 'MEIT（经济事务与信息技术部）',
        nameKo: 'MEIT(경제 사무 및 정보 기술부)',
        nameJa: 'MEIT（経済事務・情報技術部）',
        nameEn: 'MEIT (Ministry of Economic Affairs and Information Technology)',
        role: 'AI 政策主管',
        roleKo: 'AI 정책 담당자',
        roleJa: 'AI 政策主管',
        roleEn: 'Lead authority for AI policy',
      },
      {
        name: 'e-Estonia',
        nameEn: 'e-Estonia',
        role: '数字政府品牌与推广',
        roleKo: '디지털 정부 브랜드 및 홍보',
        roleJa: 'デジタル政府ブランド・プロモーション',
        roleEn: 'Digital government brand and outreach',
      },
      {
        name: 'RIA（信息系统管理局）',
        nameKo: 'RIA(정보 시스템 관리청)',
        nameJa: 'RIA（情報システム管理局）',
        nameEn: 'RIA (Information System Authority)',
        role: '政府 IT 基础设施',
        roleKo: '정부 IT 기반 시설',
        roleJa: '政府 IT 基盤',
        roleEn: 'Government IT infrastructure',
      },
    ],
    sources: ['Estonia Kratt AI Strategy（2019）', 'e-Estonia 官方报告', 'Government AI Readiness Index'],
    sourcesEn: ['Estonia Kratt AI Strategy (2019)', 'e-Estonia official reports', 'Government AI Readiness Index'],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '爱沙尼亚 AI 战略是"极小预算 + 极致效率"的反对照样本：(1) 2019 年 Kratt AI Strategy（"Kratt"是爱沙尼亚民间传说中的仆人精灵）启动，由 MEIT 主导；(2) AI 预算总计仅 €1000 万（vs 新加坡 S$20 亿+，规模差 200 倍），但实现了 50+ 政府 AI 用例；(3) 旗舰项目 Bürokratt 虚拟助手由 RIA 自 2020 年开始开发，2022 年正式上线，是面向公民的"单一统一渠道"；(4) AI Agent 法律框架是全球先驱——爱沙尼亚是首个给 AI 系统在法律上定义"数字助手"身份的国家。判断：爱沙尼亚不和新加坡比规模，比的是"杠杆比"——€1000 万换 50 个 AI 用例和全球数字政府 #1 地位。这种小国敏捷性是新加坡也具备但常被规模诱惑而忽视的财富。',
        analysisKo:
          '에스토니아 AI 전략은 「극소 예산 + 극도의 효율성」의 대조 표본입니다: (1) 2019년 Kratt AI Strategy(「Kratt」는 에스토니아 민간 전설의 종 정령)가 시작되었으며, MEIT가 주도했습니다; (2) AI 예산 총계는 €1000만에 불과합니다(vs 싱가포르 S$20억+, 규모 차이 200배), 하지만 50개 이상의 정부 AI 사용 사례를 실현했습니다; (3) 기함 프로젝트 Bürokratt 가상 어시스턴트는 RIA가 2020년부터 개발을 시작했으며, 2022년 정식 론칭되었으며, 시민을 대상으로 하는 「단일 통합 채널」입니다; (4) AI Agent 법적 프레임워크는 전 세계 선구자입니다——에스토니아는 AI 시스템을 법적으로 「디지털 어시스턴트」 신분으로 정의한 최초의 국가입니다. 판단: 에스토니아는 싱가포르와 규모를 비교하지 않으며, 「레버리지 비율」을 비교합니다——€1000만으로 50개의 AI 사용 사례와 글로벌 디지털 정부 #1 지위를 교환합니다. 이러한 소국의 민첩성은 싱가포르도 보유하고 있으나 규모의 유혹으로 인해 흔히 간과되는 자산입니다.',
        analysisJa:
          'エストニアの AI 戦略は「極小予算 + 極致の効率」の対照サンプルです：(1) 2019 年の Kratt AI Strategy（「Kratt」はエストニアの民間伝説の従者精霊）開始、MEIT 主導；(2) AI 予算総計わずか €1000 万（シンガポール S$20 億以上 vs、規模差 200 倍）ですが、50 以上の政府 AI ユースケースを実現；(3) 旗艦プロジェクト Bürokratt 仮想アシスタントは RIA が 2020 年から開発、2022 年正式上線、国民向けの「統一された単一チャネル」です；(4) AI Agent 法律フレームワークは世界的先駆者——エストニアは初めて AI システムに法律上「デジタルアシスタント」の身分を定義した国です。判断：エストニアはシンガポールと規模で比較しないで、「レバー比」で比較します——€1000 万で 50 個の AI ユースケースと世界的なデジタル政府第 1 位の地位を獲得。この小国敏捷性はシンガポールも備えていますが、規模の誘惑で見落とされている財産です。',
        analysisEn:
          'Estonia\'s AI strategy is a counter-example of "minimal budget + extreme efficiency": (1) the Kratt AI Strategy ("Kratt" is a servant spirit from Estonian folklore) launched in 2019 under MEIT\'s lead; (2) the total AI budget is only €10 million (vs Singapore\'s S$2bn+, a 200x scale gap), yet it has delivered 50+ government AI use cases; (3) the flagship Bürokratt virtual assistant has been built by RIA since 2020 and went live in 2022 as a "single unified channel" for citizens; (4) the AI Agent legal framework is a world first — Estonia is the first country to give AI systems a "digital assistant" legal status. Assessment: Estonia does not compete with Singapore on scale; it competes on leverage — €10 million yields 50 AI use cases and #1 global digital-government status. This small-state agility is a treasure Singapore also has but often forgets when seduced by scale.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'Kratid 门户：AI 战略上下文',
            labelKo: 'Kratid 포털: AI 전략 맥락',
            labelJa: 'Kratid ポータル：AI 戦略上下文',
            labelEn: 'Kratid portal: AI strategy context',
            url: 'https://www.kratid.ee/en/burokratt',
          },
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '爱沙尼亚 AI 投资规模 €1000 万——是本基准集中最小的国家级 AI 预算。资金主要投向：(1) Bürokratt 虚拟助手开发（约 30%）；(2) 政府 AI 用例 PoC 资助（约 40%）；(3) AI 法律框架与标准制定（约 15%）；(4) 教育与人才项目（约 15%）。判断：€1000 万对一个 AI 战略是惊人的小数目（vs 韩国 ₩100 万亿，规模差 1 万倍）。爱沙尼亚的真正策略不是"靠预算砸"——而是"利用既有 X-Road / e-Residency 基础设施 + 开源协作 + EU 资金引流"。这是新加坡数据科学家可以学的：规模化国家 AI 战略不一定要 S$20 亿，关键是基础设施复用率。',
        analysisKo:
          '에스토니아의 AI 투자 규모는 €1000만입니다——이는 본 벤치마크 중에서 가장 작은 국가 수준의 AI 예산입니다. 자금은 주로 다음으로 투입됩니다: (1) Bürokratt 가상 어시스턴트 개발(약 30%); (2) 정부 AI 사용 사례 PoC 지원(약 40%); (3) AI 법적 프레임워크 및 표준 제정(약 15%); (4) 교육 및 인재 프로젝트(약 15%). 판단: €1000만은 AI 전략에 있어서 놀랍도록 작은 금액입니다(vs 한국 ₩100조, 규모 차이 1만 배). 에스토니아의 진정한 전략은 「예산으로 밀어붙이기」가 아닙니다——「기존 X-Road / e-Residency 기반 시설 + 오픈 소스 협력 + EU 자금 유입 활용」입니다. 이는 싱가포르 데이터 과학자들이 배울 수 있는 것입니다: 국가 수준 AI 전략의 규모화가 반드시 S$20억을 요구하지는 않으며, 핵심은 기반 시설 재사용 비율입니다.',
        analysisJa:
          'エストニアの AI 投資規模 €1000 万——は本ベンチマークセット中最小の国家級 AI 予算です。資金の主な配分：(1) Bürokratt 仮想アシスタント開発（約 30%）；(2) 政府 AI ユースケース PoC 資助（約 40%）；(3) AI 法律フレームワークと標準制定（約 15%）；(4) 教育と人材プログラム（約 15%）。判断：€1000 万は AI 戦略にとって驚くほど小さい数字です（韓国 ₩100 兆 vs、規模差 1 万倍）。エストニアの真の戦略は「予算で砕く」ことではなく——「既存の X-Road / e-Residency インフラ + オープンソース協力 + EU 資金の流入」を活用することです。これはシンガポールのデータサイエンティストが学べることです：国規模の AI 戦略の拡大は必ずしも S$20 億を必要としない、鍵は基盤施設の再利用率です。',
        analysisEn:
          'Estonia\'s AI investment scale of €10 million is the smallest national AI budget in this benchmark set. Allocation: (1) Bürokratt virtual assistant development (~30%); (2) government AI use-case PoC grants (~40%); (3) AI legal framework and standards (~15%); (4) education and talent (~15%). Assessment: €10 million is astonishingly small for a national AI strategy (vs Korea\'s ₩100 trillion — a 10 000x gap). Estonia\'s real strategy is not "throw money at it" — it is "reuse existing X-Road / e-Residency infrastructure + open-source collaboration + leverage EU funding". This is something Singapore data scientists can learn from: a scaled national AI strategy does not necessarily need S$2bn — what matters is infrastructure reuse rate.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'governance-model': {
        analysis:
          '爱沙尼亚 AI 治理是"实用主义 + 技术先行 + EU 对齐"三层模式：(1) 全球首个为 AI Agent 提供法律定义的国家（2019 年法律修正案，把 AI 系统在政府服务中的角色正式定义为"数字助手"）；(2) Kratt AI Strategy 配套的"AI 任务组"产出 30+ 项具体监管修正建议；(3) 作为 EU 成员国必须对齐 EU AI Act（2024 年通过，2026 年生效），覆盖高风险 AI 评估、生成式 AI 透明度等。判断：爱沙尼亚和新加坡的治理对照——爱沙尼亚是"先做后规"（先在政府部署 AI，再立法定义其法律地位），新加坡是"先框后做"（先发布 AI Verify 工具集，再让产业试用）。两种路径在小国都行得通，但爱沙尼亚的"先做"路径需要极高的政府执行力，而新加坡的"先框"路径需要极强的国际信任输出能力。',
        analysisKo:
          '에스토니아의 AI 거버넌스는 「실용주의 + 기술 우선 + EU 정렬」의 3계층 모드입니다: (1) AI Agent에 법적 정의를 제공한 세계 최초의 국가(2019년 법률 개정안, AI 시스템의 정부 서비스 내 역할을 공식적으로 「디지털 어시스턴트」로 정의); (2) Kratt AI Strategy와 함께 제공되는 「AI 태스크 포스」는 30개 이상의 구체적인 규제 개정 제안을 산출했습니다; (3) EU 회원국으로서 EU AI Act(2024년 통과, 2026년 발효)와의 정렬이 필수적이며, 높은 위험 AI 평가, 생성형 AI 투명성 등을 포함합니다. 판단: 에스토니아와 싱가포르의 거버넌스 대조——에스토니아는 「먼저 시행 후 규제」(먼저 정부에 AI를 배포한 후 법적 지위를 정의하는 입법)이고, 싱가포르는 「먼저 프레임워크 후 시행」(먼저 AI Verify 도구 집합을 발표한 후 산업이 시험하도록 함)입니다. 두 가지 경로 모두 소국에서 가능하지만, 에스토니아의 「먼저 시행」 경로는 극도로 높은 정부 실행력이 필요하고, 싱가포르의 「먼저 프레임워크」 경로는 매우 강력한 국제 신뢰 구축 능력이 필요합니다.',
        analysisJa:
          'エストニアの AI ガバナンスは「実用主義 + 技術優先 + EU 対齊」の三層モデルです：(1) 世界で初めて AI Agent に法律定義を提供した国（2019 年法律修正案、AI システムの政府サービスにおける役割を正式に「デジタルアシスタント」と定義）；(2) Kratt AI Strategy に付随する「AI タスクフォース」が 30 以上の具体的な規制修正提案を産出；(3) EU 加盟国として EU AI Act（2024 年採択、2026 年施行）との対齊が必要、高リスク AI 評価、生成 AI の透明性などをカバー。判断：エストニアとシンガポールのガバナンス対照——エストニアは「先行後規」（先に政府に AI を展開してから立法で法的地位を定義）、シンガポールは「先框後做」（先に AI Verify ツールセットを公開してから産業試用）。両パスは小国では機能しますが、エストニアの「先行」パスは極めて高い政府執行力が必要であり、シンガポールの「先框」パスは極めて強力な国際信頼構築能力が必要です。',
        analysisEn:
          'Estonia\'s AI governance is a three-layer "pragmatism + tech-first + EU alignment" model: (1) the world\'s first country to provide a legal definition of AI Agents (a 2019 statutory amendment formally defines the role of AI systems in government services as "digital assistants"); (2) the AI Task Force accompanying the Kratt Strategy delivered 30+ concrete regulatory amendment recommendations; (3) as an EU member, Estonia must align with the EU AI Act (passed 2024, in force 2026), covering high-risk AI assessment, generative AI transparency and so on. Assessment: contrast Estonia and Singapore — Estonia is "do first, regulate later" (deploy AI in government first, then legislate to define its legal status); Singapore is "frame first, do later" (publish AI Verify, then let industry try). Both work for small states; Estonia\'s "do first" path requires extreme government execution, while Singapore\'s "frame first" path requires extreme international trust-export capability.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'comparative-strength': {
        analysis:
          '爱沙尼亚相对新加坡的核心杠杆是"数字政府基础设施 + 极致敏捷性"：(1) 数字政府全球第一——99% 政府服务在线，新加坡 GovTech 虽然先进但电子政务覆盖率约 80%；(2) 极致效率：€1000 万实现 50+ AI 用例，单用例成本约 €20 万，是新加坡 GovTech AI 项目（单项目通常 S$200-500 万）的 1/100；(3) AI Agent 法律框架全球领先；(4) 小国敏捷性——政策从草案到生效平均 6-12 个月，新加坡平均 12-24 个月。短板：人口仅 130 万，经验不一定可直接复制到大国；缺乏本土科技巨头；研发投入和人才池都远小于新加坡。判断：爱沙尼亚是新加坡最值得对照的"数字政府效率"标杆——同样是小国但走完全不同路径。新加坡可借鉴的不是具体项目，而是"基础设施复用率"和"立法一周期"思维。',
        analysisKo:
          '에스토니아가 싱가포르에 상대적으로 보유한 핵심 레버는 「디지털 정부 기반 시설 + 극도의 민첩성」입니다: (1) 디지털 정부 세계 1위——99% 정부 서비스 온라인화, 싱가포르 GovTech는 선진적이나 전자정부 커버율은 약 80%; (2) 극도의 효율성: €1000만으로 50개 이상의 AI 사용 사례를 실현했으며, 단일 사용 사례당 비용은 약 €20만으로, 싱가포르 GovTech AI 프로젝트(단일 프로젝트 통상 S$200-500만)의 1/100; (3) AI Agent 법적 프레임워크 글로벌 선도; (4) 소국의 민첩성——정책이 초안에서 발효까지 평균 6-12개월, 싱가포르는 평균 12-24개월. 단점: 인구는 단 130만으로 경험이 반드시 대국으로 직접 복제 가능하지 않음; 본국 과학기술 대기업 부재; 연구개발 투자와 인재 풀이 모두 싱가포르보다 훨씬 작음. 판단: 에스토니아는 싱가포르가 가장 벤치마크할 가치가 있는 「디지털 정부 효율성」 표준입니다——동일한 소국이나 완전히 다른 경로를 취하고 있습니다. 싱가포르가 참고할 수 있는 것은 구체적인 프로젝트가 아니라 「기반 시설 재사용 비율」과 「입법 일주기」 사고방식입니다.',
        analysisJa:
          'エストニアのシンガポール相対における核心レバーは「デジタル政府基盤 + 極致敏捷性」です：(1) デジタル政府世界第 1 位——99% の政府サービスがオンライン、シンガポール GovTech は先進的ですが電子政務カバー率は約 80%；(2) 極致効率：€1000 万で 50 以上の AI ユースケース実現、ユースケースごとのコストは約 €20 万、シンガポール GovTech AI プロジェクト（プロジェクトごとに通常 S$200～500 万）の 1/100；(3) AI Agent 法律フレームワーク世界先駆；(4) 小国敏捷性——政策草案から施行まで平均 6～12 ヶ月、シンガポール平均 12～24 ヶ月。短所：人口わずか 130 万、経験が大国に直接複製できない可能性；地元科技大手企業の欠如；研究開発投資と人才プールはシンガポールより遥かに小さい。判断：エストニアはシンガポール最の価値ある「デジタル政府効率」ベンチマークの対照です——同じく小国ですが全く異なるパスを歩んでいます。シンガポールが学べるのは具体的なプロジェクトではなく、「基盤施設再利用率」と「立法周期」思維です。',
        analysisEn:
          'Estonia\'s edge over Singapore is "digital government infrastructure + extreme agility": (1) #1 global digital government — 99% of public services online, while Singapore GovTech is advanced but e-government coverage is around 80%; (2) extreme efficiency — €10 million yields 50+ AI use cases at ~€200 000 per use case, roughly 1/100 the cost of a typical Singapore GovTech AI project (S$2-5 million); (3) AI Agent legal framework leads globally; (4) small-state agility — policy from draft to in-force averages 6-12 months in Estonia vs 12-24 months in Singapore. Weaknesses: only 1.3 million population (lessons may not transfer to large states); no homegrown tech giants; R&D investment and talent pool both far smaller than Singapore. Assessment: Estonia is the most useful "digital government efficiency" benchmark for Singapore — both small states, completely different paths. What Singapore can borrow is not specific projects but the "infrastructure reuse rate" and "one cycle of legislation" mindset.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'strategy-1': {
        analysis:
          'Kratt AI Strategy 2019 年由 MEIT 发布。"Kratt"取自爱沙尼亚民间传说——一种由稻草和废物制成的人形仆人，象征 AI 作为"为人类服务的工具"。战略含三大支柱：(1) 政府 AI 应用（含 Bürokratt 虚拟助手）；(2) 企业 AI 采用辅导；(3) AI 法律框架与人才培养。配套机制：MEIT 任务组发布 30+ 项具体监管修正建议，含全球首个 AI Agent 法律定义。判断：Kratt Strategy 是"小国 AI 战略"的范本——重叙事、重基础设施复用、重立法效率。€1000 万 AI 预算实现 50+ 政府用例的"杠杆比"远超本基准集任何其他国家。',
        analysisKo:
          'Kratt AI Strategy는 2019년 MEIT에 의해 발표되었습니다. 「Kratt」는 에스토니아 민간 전설에서 유래——짚과 폐기물로 만든 인형 하인으로 AI가 「인류를 위해 봉사하는 도구」임을 상징합니다. 전략은 세 가지 주요 기둥을 포함합니다: (1) 정부 AI 응용(Bürokratt 가상 조수 포함); (2) 기업 AI 채택 지도; (3) AI 법적 프레임워크 및 인재 양성. 지원 메커니즘: MEIT 태스크포스는 30+ 개의 구체적인 규제 개정 권장사항을 발표했으며, 전 세계 최초의 AI Agent 법적 정의를 포함합니다. 판단: Kratt Strategy는 「소국 AI 전략」의 모범이며——서사를 중시하고, 기초 설비 재사용을 중시하고, 입법 효율을 중시합니다. €1000만 AI 예산으로 50+ 정부 용례를 구현한 「레버」비율은 본 벤치마크 집합의 다른 모든 국가를 훨씬 능가합니다.',
        analysisJa:
          'Kratt AI Strategy は 2019 年に MEIT が公開。「Kratt」はエストニアの民間伝説から取られたもの——わら屑から作られた人型の従者、「人間に奉仕するツール」としての AI を象徴。戦略は三大支柱から成る：(1) 政府 AI 応用（Bürokratt 仮想アシスタントを含む）；(2) 企業 AI 採用指導；(3) AI 法律フレームワークと人材育成。付随メカニズム：MEIT タスクフォースが 30 以上の具体的な規制修正提案を発表、世界初の AI Agent 法律定義を含む。判断：Kratt Strategy は「小国 AI 戦略」の模範です——ナラティブを重視、基盤施設再利用を重視、立法効率を重視。€1000 万の AI 予算で 50 以上の政府ユースケースを実現する「レバー比」は本ベンチマークセット内のその他の国家を遠く超えています。',
        analysisEn:
          'The Kratt AI Strategy was released by MEIT in 2019. "Kratt" is drawn from Estonian folklore — a humanoid servant fashioned from straw and discarded items, symbolising AI as a "tool that serves humans". Three pillars: (1) government AI adoption (including Bürokratt virtual assistant); (2) enterprise AI mentorship; (3) AI legal framework and talent. Supporting mechanism: an MEIT task force produced 30+ specific regulatory-amendment recommendations, including the world\'s first AI Agent legal definition. Assessment: Kratt Strategy is a template for "small-state AI strategy" — narrative-rich, infrastructure-reuse-driven, legislation-efficient. The leverage ratio (€10m AI budget yielding 50+ government use cases) far exceeds any other country in this benchmark set.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'Kratid 门户',
            labelKo: 'Kratid 포털',
            labelJa: 'Kratid ポータル',
            labelEn: 'Kratid portal',
            url: 'https://www.kratid.ee/en/burokratt',
          },
        ],
      },
      'strategy-2': {
        analysis:
          'EU AI Act 对齐：爱沙尼亚作为欧盟成员国必须遵守 EU AI Act（2024 年通过、2026 年生效）。具体含义：(1) 爱沙尼亚的 Kratt AI Strategy 子项目（如 Bürokratt）需按 EU AI Act 高风险 AI 标准重新评估；(2) 爱沙尼亚自身的 AI Agent 法律框架已基本兼容 EU AI Act，需做的调整较少；(3) 爱沙尼亚作为 EU 数字政策最积极的成员国之一，参与 EU AI Act 二级法规制定。判断：欧盟 AI Act 既是约束也是杠杆——约束是合规成本，杠杆是 EU 单一市场（4.5 亿用户）的 frictionless 准入。爱沙尼亚的"先做后规"路径让它在 EU AI Act 下相对其他成员国合规摩擦最小。',
        analysisKo:
          'EU AI Act 조정: 에스토니아는 EU 회원국으로서 EU AI Act(2024년 통과, 2026년 발효)를 반드시 준수해야 합니다. 구체적 의미: (1) 에스토니아의 Kratt AI Strategy 하위 프로젝트(예: Bürokratt)는 EU AI Act 고위험 AI 표준에 따라 재평가되어야 합니다; (2) 에스토니아 자신의 AI Agent 법적 프레임워크는 이미 기본적으로 EU AI Act와 호환되며, 필요한 조정이 적습니다; (3) 에스토니아는 EU 디지털 정책에서 가장 적극적인 회원국 중 하나로서 EU AI Act 2차 규제 제정에 참여합니다. 판단: EU AI Act는 제약이자 레버입니다——제약은 준수 비용이고, 레버는 EU 단일 시장(4.5억 명 사용자)의 마찰 없는 접근입니다. 에스토니아의 「먼저 하고 나중에 규제하기」 경로는 EU AI Act 하에서 다른 회원국에 비해 준수 마찰이 가장 적습니다.',
        analysisJa:
          'EU AI Act 対齊：エストニアは欧州連合加盟国として EU AI Act（2024 年採択、2026 年施行）を遵守する必要があります。具体的な意味：(1) エストニアの Kratt AI Strategy サブプロジェクト（Bürokratt など）は EU AI Act 高リスク AI 基準に従って再評価が必要；(2) エストニア自体の AI Agent 法律フレームワークはすでに基本的に EU AI Act と両立可能、調整が少なくて済む；(3) エストニアは EU デジタルポリシー最も積極的な加盟国の一つとして、EU AI Act 二次法規制定に参加。判断：欧州連合 AI Act は制約でもあり、レバーでもあります——制約は合規コスト、レバーは EU 単一市場（4.5 億ユーザー）の摩擦のない参入。エストニアの「先行後規」パスは EU AI Act 下で相対的に他の加盟国より合規摩擦が最小です。',
        analysisEn:
          "EU AI Act alignment: as an EU member state, Estonia must comply with the EU AI Act (passed 2024, in force 2026). Specifically: (1) Estonia's Kratt AI Strategy sub-projects (e.g. Bürokratt) need re-assessment against EU AI Act high-risk standards; (2) Estonia's own AI Agent legal framework is already largely compatible with the EU AI Act, requiring relatively few adjustments; (3) as one of the most digitally proactive EU members, Estonia participates in drafting EU AI Act secondary regulations. Assessment: the EU AI Act is both a constraint and a lever — the constraint is compliance cost, the lever is frictionless access to the EU single market (450 million consumers). Estonia's \"do first, regulate later\" path means its compliance friction under the EU AI Act is the lowest among member states.",
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
        ],
      },
      'investment-1': {
        analysis:
          'AI 战略预算 €1000 万 是 Kratt AI Strategy 的官方拨款总数（覆盖 2019-2023 年）。分布：(1) Bürokratt 开发约 €300 万；(2) 政府 AI 用例 PoC 资助约 €400 万；(3) AI 法律框架研究约 €150 万；(4) 教育与培训约 €150 万。配套：欧盟 Horizon Europe 项目额外提供约 €500 万 AI 相关研究资金，主要流向塔林理工大学、塔尔图大学。判断：€1000 万的"小预算"叙事在国际比较中很有传播力，但实际可用资源（含 EU 资金）应该按 €1500 万计算。即便如此，相对新加坡仍是 100x 量级差距——这种规模差让爱沙尼亚的成功更值得研究。',
        analysisKo:
          'AI 전략 예산 €1000만은 Kratt AI Strategy의 공식 할당 총액입니다(2019~2023년 포함). 분배: (1) Bürokratt 개발 약 €300만; (2) 정부 AI 용례 PoC 자금 약 €400만; (3) AI 법적 프레임워크 연구 약 €150만; (4) 교육 및 훈련 약 €150만. 지원: EU Horizon Europe 프로젝트는 추가로 약 €500만의 AI 관련 연구 자금을 제공하며, 주로 탈린 공과대학교, 타르투 대학교로 흘러갑니다. 판단: €1000만의 「소예산」서사는 국제 비교에서 매우 전파력이 있지만, 실제 사용 가능한 자원(EU 자금 포함)은 €1500만으로 계산되어야 합니다. 그렇더라도 싱가포르와 비교하면 여전히 100배 규모 차이입니다——이러한 규모 차이는 에스토니아의 성공을 더욱 연구할 가치가 있게 만듭니다.',
        analysisJa:
          'AI 戦略予算 €1000 万は Kratt AI Strategy の公式拨款総額です（2019～2023 年をカバー）。配分：(1) Bürokratt 開発は約 €300 万；(2) 政府 AI ユースケース PoC 資助は約 €400 万；(3) AI 法律フレームワーク研究は約 €150 万；(4) 教育と訓練は約 €150 万。付随：欧州連合 Horizon Europe プロジェクトは別途約 €500 万の AI 関連研究資金を提供、主にタリン工科大学、タルト大学に流れています。判断：€1000 万の「小予算」叙事は国際比較では高い伝播力があります、実際に利用可能なリソース（EU 資金を含む）は €1500 万として計算すべき。たとえそうであっても、シンガポール相対では依然 100 倍の規模差があります——この規模差がエストニアの成功をさらに研究する価値があります。',
        analysisEn:
          'The €10 million AI Strategy Budget is the official total commitment of Kratt AI Strategy (covering 2019-2023). Allocation: (1) Bürokratt development ~€3 million; (2) government AI use-case PoC grants ~€4 million; (3) AI legal framework research ~€1.5 million; (4) education and training ~€1.5 million. Supplements: EU Horizon Europe projects provide an additional ~€5 million in AI-related research funding, primarily flowing to Tallinn University of Technology and University of Tartu. Assessment: the "€10 million small budget" narrative travels well internationally, but the actually-usable resource pool (including EU funding) should be counted at ~€15 million. Even so, the gap with Singapore is 100x in order of magnitude — making Estonia\'s success disproportionately worth studying.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
        ],
      },
      'initiative-1': {
        analysis:
          'Bürokratt 政府虚拟助手是爱沙尼亚 AI 战略的旗舰项目。由 RIA（信息系统管理局）自 2020 年开始开发，2022 年正式上线。技术栈：基于开源 Rasa NLU + 爱沙尼亚语 LLM 微调 + X-Road 政府数据集成。功能：在 50+ 政府机构网站集成 Bürokratt 入口，公民可通过文字/语音访问 100+ 公共与信息服务。判断：Bürokratt 是少数实现"单一统一公民入口"的国家级 AI 助手——比新加坡 LifeSG（仍以应用 + API 集成为主）更接近"对话式政府"。但爱沙尼亚语 LLM 性能远落后英文 frontier model，限制了 Bürokratt 的复杂任务处理能力。',
        analysisKo:
          'Bürokratt 정부 가상 조수는 에스토니아 AI 전략의 기함 프로젝트입니다. RIA(정보 시스템 관리청)에 의해 2020년부터 개발을 시작했으며, 2022년에 공식 출시되었습니다. 기술 스택: 오픈소스 Rasa NLU + 에스토니아어 LLM 파인튜닝 + X-Road 정부 데이터 통합. 기능: 50+ 정부 기관 웹사이트에 Bürokratt 입구를 통합하여 시민이 텍스트/음성으로 100+ 공공 및 정보 서비스에 접근할 수 있습니다. 판단: Bürokratt는 「단일 통합 시민 입구」를 구현한 소수의 국가급 AI 조수 중 하나입니다——싱가포르의 LifeSG(여전히 주로 애플리케이션 + API 통합)보다 「대화식 정부」에 더 가깝습니다. 그러나 에스토니아어 LLM 성능은 영문 frontier 모델에 비해 훨씬 뒤떨어져 있으며, Bürokratt의 복잡한 작업 처리 능력을 제한합니다.',
        analysisJa:
          'Bürokratt 政府仮想アシスタントはエストニア AI 戦略の旗艦プロジェクトです。RIA（情報システム管理局）が 2020 年から開発開始、2022 年正式上線。テクノロジースタック：オープンソース Rasa NLU ベース + エストニア語 LLM ファインチューニング + X-Road 政府データ統合。機能：50 以上の政府機関ウェブサイトに Bürokratt エントランスを統合、国民はテキスト / 音声を通じて 100 以上の公共・情報サービスにアクセスできます。判断：Bürokratt は「国民のための統一された単一エントランス」を実現した少数の国家級 AI アシスタントの一つです——シンガポール LifeSG（仍以アプリケーション + API 統合が中心）より「対話型政府」に近い。しかしエストニア語 LLM のパフォーマンスは英語フロンティアモデルからはるか遅れており、Bürokratt の複雑なタスク処理能力を制限しています。',
        analysisEn:
          'Bürokratt, Estonia\'s government virtual assistant, is the flagship of the AI strategy. Developed by RIA (Information System Authority) since 2020 and launched in 2022. Tech stack: open-source Rasa NLU + an Estonian-language LLM fine-tune + X-Road government data integration. Functionality: 50+ government agency websites embed a Bürokratt entry point through which citizens can access 100+ public and information services by text or voice. Assessment: Bürokratt is one of the few national AI assistants to deliver a "single unified citizen channel" — closer to "conversational government" than Singapore LifeSG (which still leans on apps + API integration). But the Estonian-language LLM trails English frontier models by a wide margin, limiting Bürokratt\'s ability to handle complex tasks.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'Kratid 门户',
            labelKo: 'Kratid 포털',
            labelJa: 'Kratid ポータル',
            labelEn: 'Kratid portal',
            url: 'https://www.kratid.ee/en/burokratt',
          },
        ],
      },
      'initiative-2': {
        analysis:
          '50+ 政府 AI 用例部署：截至 2024 年，爱沙尼亚已部署 50+ 个不同政府 AI 用例。涵盖：税务申报智能审查（EMTA）、健康记录分类（TEHIK）、就业匹配（Töötukassa）、犯罪情报分析（PPA）、农业补贴申请审核（PRIA）等。判断："50+ 用例"是分子，分母是爱沙尼亚约 80 个政府机构——意味着每个机构平均 0.6 个 AI 用例，覆盖率高度均衡。新加坡 GovTech 的"50+ AI 用例"集中在少数几个先进部门（Mom、IRAS、HDB），覆盖率不均。爱沙尼亚的"广撒网"模式更接近 EU 数字政府目标，新加坡的"突破点"模式更适合大国。',
        analysisKo:
          '50+ 정부 AI 용례 배포: 2024년 현재 에스토니아는 50+ 개의 서로 다른 정부 AI 용례를 배포했습니다. 포함 범위: 세무 신고 지능형 검토(EMTA), 건강 기록 분류(TEHIK), 취업 매칭(Töötukassa), 범죄 정보 분석(PPA), 농업 보조금 신청 검토(PRIA) 등. 판단: 「50+ 용례」는 분자이고, 분모는 에스토니아의 약 80개 정부 기관입니다——각 기관당 평균 0.6개의 AI 용례를 의미하며, 적용 범위가 매우 균형 잡혀 있습니다. 싱가포르 GovTech의 「50+ AI 용례」는 소수의 선진 부처(MOM, IRAS, HDB)에 집중되어 있으며, 적용 범위가 불균형입니다. 에스토니아의 「광범위 배포」 모델은 EU 디지털 정부 목표에 더 가깝고, 싱가포르의 「돌파점」 모델은 대국에 더 적합합니다.',
        analysisJa:
          '50 以上の政府 AI ユースケース展開：2024 年時点で、エストニアはすでに 50 以上の異なる政府 AI ユースケースを展開しています。カバー範囲：税務申告インテリジェント審査（EMTA）、健康記録分類（TEHIK）、就業マッチング（Töötukassa）、犯罪インテリジェンス分析（PPA）、農業補助金申請審査（PRIA）など。判断：「50+ ユースケース」は分子、分母はエストニアの約 80 の政府機関——すなわち、各機関は平均 0.6 個の AI ユースケース、カバー率が高度に均衡しています。シンガポール GovTech の「50+ AI ユースケース」は少数の先進部門（Mom、IRAS、HDB）に集中、カバー率は不均等。エストニアの「広く網を張る」モデルは EU デジタル政府目標に更に接近し、シンガポールの「ブレークスルーポイント」モデルは大国に更に適応します。',
        analysisEn:
          '50+ government AI use-case deployments: by 2024 Estonia had deployed 50+ distinct government AI use cases — covering tax-filing intelligent review (EMTA), health-record triage (TEHIK), employment matching (Töötukassa), criminal intelligence analysis (PPA), agricultural subsidy verification (PRIA) and more. Assessment: "50+ use cases" is a numerator; the denominator is Estonia\'s ~80 government agencies — averaging 0.6 use cases per agency, with very even coverage. Singapore GovTech\'s "50+ AI use cases" cluster in a few advanced ministries (MOM, IRAS, HDB) with uneven coverage. Estonia\'s "broad sweep" model is closer to the EU digital-government target; Singapore\'s "breakthrough" model better suits larger states.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'initiative-3': {
        analysis:
          'AI Agent 法律框架先驱：爱沙尼亚 2019 年通过法律修正案，正式定义"数字助手"（digital assistant）的法律地位——AI 系统在政府服务中可代表公民执行特定操作。这是全球首个为 AI Agent 提供法律定义的国家。覆盖：税务申报、社会福利申请、健康预约等场景。判断：这条"AI Agent 法律先驱"价值在 2025 年 GenAI Agent 时代变得格外重要——爱沙尼亚已经有 6 年的法律实践基础，而其他国家（含新加坡）才刚开始讨论"GenAI Agent 法律责任"。这是爱沙尼亚最被低估的国际影响力来源。',
        analysisKo:
          'AI Agent 법적 프레임워크 선구자: 에스토니아는 2019년 법적 개정안을 통과시켜 「디지털 조수」(digital assistant)의 법적 지위를 공식 정의했습니다——AI 시스템은 정부 서비스에서 시민을 대리하여 특정 작업을 수행할 수 있습니다. 이는 AI Agent에게 법적 정의를 제공한 전 세계 최초의 국가입니다. 범위: 세무 신고, 사회 복지 신청, 건강 예약 등의 시나리오. 판단: 이 「AI Agent 법적 선구자」 가치는 2025년 GenAI Agent 시대에 특히 중요해졌습니다——에스토니아는 이미 6년의 법적 실행 기반을 가지고 있으며, 다른 국가(싱가포르 포함)는 「GenAI Agent 법적 책임」에 대해 방금 논의하기 시작했습니다. 이것은 에스토니아의 가장 저평가된 국제 영향력 원천입니다.',
        analysisJa:
          'AI Agent 法律フレームワーク先駆：エストニアは 2019 年に法律修正案を採択、正式に「デジタルアシスタント」（digital assistant）の法律地位を定義しました——AI システムが政府サービスの中で国民に代わって特定の操作を実行できます。これは世界で初めて AI Agent に法律定義を提供した国です。カバー範囲：税務申告、社会福祉申請、健康予約等のシナリオ。判断：この「AI Agent 法律先駆」の価値は 2025 年の GenAI Agent 時代に特に重要になります——エストニアはすでに 6 年の法律実践基礎を有し、他の国家（シンガポールを含む）は「GenAI Agent 法律責任」を議論し始めたばかり。これはエストニアが最も過小評価されている国際影響力の源です。',
        analysisEn:
          'AI Agent legal framework pioneer: Estonia passed legal amendments in 2019 formally defining the "digital assistant" legal status — AI systems may act on behalf of citizens for specific operations within government services. This is the world\'s first legal definition of an AI Agent. Coverage: tax filing, social benefit applications, health appointments and similar scenarios. Assessment: this "AI Agent legal pioneer" credential becomes disproportionately important in the 2025 GenAI Agent era — Estonia has six years of statutory practice while other countries (including Singapore) are only starting to discuss "GenAI Agent legal responsibility". This is Estonia\'s most underrated source of international influence.',
        sources: [
          {
            label: 'Bürokratt 概览（RIA，含 AI Agent 法律框架）',
            labelKo: 'Bürokratt 개요(RIA, AI Agent 법적 프레임워크 포함)',
            labelJa: 'Bürokratt 概要（RIA、AI Agent 法律フレームワークを含む）',
            labelEn: 'Bürokratt overview (RIA, AI Agent legal framework)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
        ],
      },
      'initiative-4': {
        analysis:
          'e-Residency 数字身份体系是爱沙尼亚 1.0 时代（2014 年起）的明星基础设施——为非爱沙尼亚居民提供数字身份，可远程开公司、开银行账户、签数字合同。截至 2024 年：120+ 国家 / 11 万+ e-Residents / 2.5 万+ 注册公司 / 单年贡献政府税收 €1.7 亿+。AI 接入：e-Residency 的电子签名 + 数字身份是 Bürokratt / 50+ 政府 AI 用例的身份验证基础。判断：e-Residency 不是 AI 项目，但它是爱沙尼亚 AI 战略的"基础设施复用"代表——AI 用例之所以能用 €20 万一个的成本部署，是因为身份验证 / 数据交换 / 数字签名等基础设施是现成的（X-Road + e-Residency）。',
        analysisKo:
          'e-Residency 디지털 신원 체계는 에스토니아 1.0 시대(2014년부터)의 스타 인프라입니다——비에스토니아 거주자에게 디지털 신원을 제공하여 원격으로 회사를 설립하고, 은행 계좌를 개설하고, 디지털 계약에 서명할 수 있습니다. 2024년 현재: 120+ 국가 / 11만+ e-Residents / 2만5천+ 등록 회사 / 연간 정부 세수 기여 €1.7억+. AI 접근: e-Residency의 전자 서명 + 디지털 신원은 Bürokratt / 50+ 정부 AI 용례의 신원 확인 기반입니다. 판단: e-Residency는 AI 프로젝트가 아니지만 에스토니아 AI 전략의 「기초 설비 재사용」의 대표입니다——AI 용례가 한 개에 €20만의 비용으로 배포될 수 있는 이유는 신원 확인 / 데이터 교환 / 디지털 서명 등의 기초 설비가 이미 준비되어 있기 때문입니다(X-Road + e-Residency).',
        analysisJa:
          'e-Residency デジタルアイデンティティシステムはエストニア 1.0 時代（2014 年以降）の象徴的インフラです——非エストニア居民向けにデジタルアイデンティティを提供し、遠隔で企業設立、銀行口座開設、デジタル契約署名が可能です。2024 年時点：120+ 国 / 11 万+ e-Residents / 2.5 万+ 登録企業 / 単年度政府税収 €1.7 億+。AI 連携：e-Residency の電子署名 + デジタルアイデンティティは Bürokratt / 50+ 政府 AI ユースケースの身元認証基盤です。判断：e-Residency は AI プロジェクトではありませんが、エストニア AI 戦略の「インフラ再利用」を代表しています——AI ユースケースが €20 万/件のコストで導入できるのは、身元認証 / データ交換 / デジタル署名などのインフラが既存だからです（X-Road + e-Residency）。',
        analysisEn:
          "e-Residency digital identity system is a flagship infrastructure from Estonia's 1.0 era (since 2014) — providing digital identity to non-residents for remote company formation, banking, digital contracts. By 2024: 120+ countries, 110 000+ e-Residents, 25 000+ registered companies, single-year government tax contribution €170m+. AI tie-in: e-Residency's electronic signature + digital identity provide the authentication backbone for Bürokratt and the 50+ government AI use cases. Assessment: e-Residency is not an AI project, but it is the showcase of Estonia's \"infrastructure reuse\" approach to AI — the reason AI use cases can deploy at ~€200 000 each is that authentication / data exchange / digital signature are already in place via X-Road + e-Residency.",
        sources: [
          {
            label: 'e-Estonia 官网（含 e-Residency 上下文）',
            labelKo: 'e-Estonia 공식 웹사이트(e-Residency 맥락 포함)',
            labelJa: 'e-Estonia 公式ウェブサイト（e-Residency コンテキスト含む）',
            labelEn: 'e-Estonia official site (e-Residency context)',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'initiative-5': {
        analysis:
          'X-Road 政府数据交换平台是爱沙尼亚数字政府的"骨架"，自 2001 年起运行，开源（Apache 2.0），已被芬兰、冰岛、法罗群岛、日本、纳米比亚等国采用。功能：连接政府机构 + 私部门系统的安全数据交换，单条交换的法律地位等同于电子签名文档。AI 应用：Bürokratt / 50+ 政府 AI 用例都通过 X-Road 拉取跨机构数据。2024 年统计：日均 X-Road 数据交换次数 4400 万+ / 累计节省 1300 工时-年（约 1500 全职岗位）。判断：X-Road 是爱沙尼亚最成功的数字基础设施输出——开源 + 跨国采用让它成为"小国数字政府基础设施事实标准"。新加坡的 NDI（National Digital Identity）和 SGFinDex 在功能上类似但开放程度低于 X-Road。',
        analysisKo:
          'X-Road 정부 데이터 교환 플랫폼은 에스토니아 디지털 정부의 「골격」으로, 2001년부터 운영되고 있으며, 오픈소스(Apache 2.0)이고, 핀란드, 아이슬란드, 페로 제도, 일본, 나미비아 등 국가에서 채택했습니다. 기능: 정부 기관 + 민간 부문 시스템 간의 안전한 데이터 교환을 연결하며, 단일 교환의 법적 지위는 전자 서명 문서와 동등합니다. AI 응용: Bürokratt / 50+ 정부 AI 용례는 모두 X-Road를 통해 기관 간 데이터를 추출합니다. 2024년 통계: 일평균 X-Road 데이터 교환 횟수 4400만+ / 누적 절감 1300 인년(약 1500 풀타임 직책). 판단: X-Road는 에스토니아에서 가장 성공적인 디지털 인프라 출력입니다——오픈소스 + 국제 채택으로 인해 「소국 디지털 정부 기초 설비 사실상의 표준」이 되었습니다. 싱가포르의 NDI(National Digital Identity)와 SGFinDex는 기능적으로 유사하지만 X-Road보다 개방도가 낮습니다.',
        analysisJa:
          'X-Road 政府データ交換プラットフォームはエストニアデジタル政府の「骨格」であり、2001 年から運用されており、オープンソース（Apache 2.0）で、フィンランド、アイスランド、フェロー諸島、日本、ナミビアなど複数国に採用されています。機能：政府機関 + 民間部門システム間の安全なデータ交換、単一交換の法的地位は電子署名文書と同等です。AI 応用：Bürokratt / 50+ 政府 AI ユースケースはすべて X-Road 経由でクロスエージェンシーデータを取得しています。2024 年統計：日平均 X-Road データ交換件数 4,400 万+ / 累積時間削減 1,300 人年（約 1,500 フルタイム職）。判断：X-Road はエストニア最成功のデジタルインフラ輸出——オープンソース + 国際採用により「小国デジタル政府インフラ事実標準」となっています。シンガポール NDI（National Digital Identity）と SGFinDex は機能上類似していますが、X-Road より開放度が低いです。',
        analysisEn:
          "X-Road, Estonia's government data-exchange platform, is the spine of its digital government — running since 2001, open-source (Apache 2.0), and adopted by Finland, Iceland, the Faroe Islands, Japan, Namibia and others. Functionality: secure data exchange between government agencies and private-sector systems, with each exchange carrying legal status equivalent to a signed electronic document. AI tie-in: Bürokratt and the 50+ government AI use cases pull cross-agency data via X-Road. 2024 stats: 44 million+ daily exchanges, cumulative savings of 1 300 work-years (~1 500 FTE-equivalent). Assessment: X-Road is Estonia's most successful exported digital infrastructure — open-sourcing plus cross-border adoption makes it the de-facto standard for small-state digital government. Singapore's NDI and SGFinDex are functionally similar but less open than X-Road.",
        sources: [
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'body-1': {
        analysis:
          'MEIT（经济事务与信息技术部，Ministry of Economic Affairs and Information Technology）是爱沙尼亚 AI 政策主管部门。AI 相关职能：(1) Kratt AI Strategy 起草与协调；(2) 与欧盟数字事务对接（EU AI Act 实施）；(3) 监督 RIA、e-Estonia 等执行机构。判断：MEIT 在爱沙尼亚政府结构中相当于"经济部 + 数字部"合体，比新加坡 MTI + SNDGO 更集中。这种集中度在小国规模下高效，但意味着没有制度化的政策制定 / 执行分离——这也是为什么爱沙尼亚能在 6 个月内从草案到生效。',
        analysisKo:
          'MEIT(경제 사무 및 정보 기술부, Ministry of Economic Affairs and Information Technology)는 에스토니아 AI 정책의 담당 부서입니다. AI 관련 직책: (1) Kratt AI Strategy 초안 작성 및 조정; (2) EU 디지털 사무와의 연계(EU AI Act 실행); (3) RIA, e-Estonia 등 실행 기관 감시. 판단: MEIT는 에스토니아 정부 구조에서 「경제부 + 디지털부」의 합체에 해당하며, 싱가포르의 MTI + SNDGO보다 더 집중적입니다. 이러한 집중도는 소국 규모에서 효율적이지만, 제도화된 정책 제정 / 실행 분리가 없다는 의미입니다——이것이 에스토니아가 6개월 내에 초안에서 발효까지 갈 수 있는 이유입니다.',
        analysisJa:
          'MEIT（経済事務・情報技術省、Ministry of Economic Affairs and Information Technology）はエストニア AI 政策主管部門です。AI 関連職能：(1) Kratt AI Strategy の起案と協調；(2) 欧州委員会デジタル事務部への対接（EU AI Act 実装）；(3) RIA、e-Estonia などの実行機関の監督。判断：MEIT はエストニア政府構造の「経済部 + デジタル部」統合相当であり、シンガポール MTI + SNDGO より集中度が高いです。この集中度は小国規模では効率的ですが、制度化された政策立案 / 実行の分離がないことを意味します——これがエストニアが草案から施行まで 6 ヶ月で実現できる理由です。',
        analysisEn:
          "MEIT (Ministry of Economic Affairs and Information Technology) is Estonia's lead ministry for AI policy. AI-related functions: (1) drafting and coordinating the Kratt AI Strategy; (2) interfacing with EU digital affairs (including EU AI Act implementation); (3) overseeing executing agencies like RIA and e-Estonia. Assessment: MEIT effectively combines an Economy Ministry with a Digital Ministry — more concentrated than Singapore's MTI + SNDGO. The concentration is efficient at small-state scale but means there is no institutional separation of policy from execution — which is exactly why Estonia can move from draft to in-force in 6 months.",
        sources: [
          {
            label: 'Bürokratt 概览（RIA，含 MEIT 上下文）',
            labelKo: 'Bürokratt 개요(RIA, MEIT 맥락 포함)',
            labelJa: 'Bürokratt 概要（RIA、MEIT コンテキスト含む）',
            labelEn: 'Bürokratt overview (RIA, MEIT context)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
        ],
      },
      'body-2': {
        analysis:
          'e-Estonia 不是政府机构，而是数字政府品牌与推广组织——隶属于 MEIT，作为爱沙尼亚数字政府的对外门面，运营 e-estonia.com 网站、办全球数字政府考察团、出席 G20 / OECD 等国际会议代表爱沙尼亚发声。AI 相关：作为 Kratt AI Strategy 的国际传播渠道，让"€1000 万 AI 战略"的故事被全球听到。判断：e-Estonia 的角色是"数字政府品牌经济学"——把爱沙尼亚的实际能力（约相当于一个新加坡的 1/4）放大成全球影响力（相当于新加坡 + 韩国数字政府的合并曝光度）。这是小国软实力运营的范例。',
        analysisKo:
          'e-Estonia는 정부 기관이 아니라 디지털 정부 브랜드 및 홍보 조직입니다——MEIT에 소속되어 에스토니아 디지털 정부의 대외 면으로서 e-estonia.com 웹사이트 운영, 글로벌 디지털 정부 견학단 개최, G20 / OECD 등 국제 회의에 참석하여 에스토니아를 대표하는 발언을 합니다. AI 관련: Kratt AI Strategy의 국제 전파 채널로서 「€1000만 AI 전략」의 이야기가 전 세계에 들려지도록 합니다. 판단: e-Estonia의 역할은 「디지털 정부 브랜드 경제학」입니다——에스토니아의 실제 능력(약 싱가포르의 1/4 규모)을 글로벌 영향력(싱가포르 + 한국 디지털 정부의 결합 노출도에 해당)으로 확대합니다. 이는 소국 소프트 파워 운영의 범례입니다.',
        analysisJa:
          'e-Estonia は政府機関ではなく、デジタル政府ブランドと推進組織です——MEIT 傘下であり、エストニアデジタル政府の対外窓口として、e-estonia.com ウェブサイト運営、世界デジタル政府視察団の組織、G20 / OECD などの国際会議でのエストニア代表発言に従事しています。AI 関連：Kratt AI Strategy の国際発信チャネルとして、「€1,000 万 AI 戦略」のストーリーを世界に届けています。判断：e-Estonia の役割は「デジタル政府ブランド経営学」——エストニアの実際能力（シンガポール規模の約 1/4 相当）をグローバル影響力（シンガポール + 韓国デジタル政府の統合露出度相当）に増幅しています。これは小国ソフトパワー経営の事例です。',
        analysisEn:
          'e-Estonia is not a government agency but a digital-government brand and outreach unit under MEIT — operating the e-estonia.com site, hosting global digital-government delegations, and representing Estonia at the G20, OECD and similar venues. AI tie-in: it is the international comms channel for the Kratt AI Strategy, making the "€10 million AI strategy" story heard globally. Assessment: e-Estonia\'s role is "digital-government brand economics" — amplifying Estonia\'s actual capability (roughly a quarter of Singapore\'s) into global influence comparable to Singapore + Korea\'s combined digital-government exposure. It is a model of small-state soft-power operation.',
        sources: [
          {
            label: 'e-Estonia 官网',
            labelKo: 'e-Estonia 공식 웹사이트',
            labelJa: 'e-Estonia 公式ウェブサイト',
            labelEn: 'e-Estonia official site',
            url: 'https://e-estonia.com/',
          },
        ],
      },
      'body-3': {
        analysis:
          'RIA（信息系统管理局，Information System Authority）是爱沙尼亚政府 IT 基础设施的运营机构。AI 相关职能：(1) Bürokratt 虚拟助手开发与运营；(2) X-Road 政府数据交换平台运营；(3) 政府云 / 数据中心 / 网络安全。RIA 自 2011 年成立，是爱沙尼亚数字政府转型的核心执行机构。判断：RIA 是爱沙尼亚 AI 战略中真正的"做事机构"——它把 MEIT 的政策决定转化为可运行的系统。RIA 的角色相当于新加坡 GovTech 的精简版——专注政府 IT 基础设施，不做民间 AI / 数字经济推动（后者归 e-Estonia / MEIT）。这种分工让 RIA 在政府 AI 部署上效率极高。',
        analysisKo:
          'RIA(정보 시스템 관리청, Information System Authority)는 에스토니아 정부 IT 기초 설비의 운영 기관입니다. AI 관련 직책: (1) Bürokratt 가상 조수 개발 및 운영; (2) X-Road 정부 데이터 교환 플랫폼 운영; (3) 정부 클라우드 / 데이터 센터 / 사이버 보안. RIA는 2011년 설립되었으며, 에스토니아 디지털 정부 변환의 핵심 실행 기관입니다. 판단: RIA는 에스토니아 AI 전략에서 진정한 「실행 기관」입니다——MEIT의 정책 결정을 실행 가능한 시스템으로 변환합니다. RIA의 역할은 싱가포르 GovTech의 축소판에 해당합니다——정부 IT 기초 설비에 집중하며, 민간 AI / 디지털 경제 추진은 하지 않습니다(후자는 e-Estonia / MEIT에 귀속). 이러한 분업은 RIA가 정부 AI 배포에서 매우 효율적입니다.',
        analysisJa:
          'RIA（情報システム管理庁、Information System Authority）はエストニア政府 IT インフラストラクチャの運営機関です。AI 関連職能：(1) Bürokratt 仮想アシスタントの開発と運営；(2) X-Road 政府データ交換プラットフォームの運営；(3) 政府クラウド / データセンター / サイバーセキュリティ。RIA は 2011 年設立され、エストニアデジタル政府転換の中核実行機関です。判断：RIA はエストニア AI 戦略の真の「実行機関」——MEIT の政策決定を実行可能なシステムに変換しています。RIA の役割はシンガポール GovTech の簡潔版に相当——政府 IT インフラに焦点を当て、民間 AI / デジタル経済推進は実施しません（後者は e-Estonia / MEIT の担当）。この分業により RIA は政府 AI 導入で極めて高い効率を発揮しています。',
        analysisEn:
          "RIA (Information System Authority) is Estonia's government IT infrastructure operator. AI-related functions: (1) Bürokratt development and operations; (2) X-Road operations; (3) government cloud / data centres / cybersecurity. RIA was founded in 2011 and is the core executing agency of Estonia's digital government transformation. Assessment: RIA is the actual delivery body in Estonia's AI strategy — translating MEIT's policy decisions into runnable systems. Its role is a slimmed-down Singapore GovTech — focused on government IT infrastructure rather than civilian AI / digital-economy promotion (which sits with e-Estonia / MEIT). The clean division of labour gives RIA exceptional throughput on government AI deployment.",
        sources: [
          {
            label: 'Bürokratt 概览（RIA）',
            labelKo: 'Bürokratt 개요(RIA)',
            labelJa: 'Bürokratt 概要（RIA）',
            labelEn: 'Bürokratt overview (RIA)',
            url: 'https://www.ria.ee/en/state-information-system/personal-services/burokratt',
          },
        ],
      },
    },
  },
  {
    flag: '🇨🇭',
    name: '瑞士',
    nameKo: '스위스',
    nameJa: 'スイス',
    nameEn: 'Switzerland',
    fullName: '瑞士联邦',
    fullNameKo: '스위스 연방',
    fullNameJa: 'スイス連邦',
    fullNameEn: 'Swiss Confederation',
    overview:
      'ETH Zurich 和 EPFL 是全球 AI 研究 Top 5 机构，Google Zurich 是其最大的欧洲研发中心。瑞士以"创新优先、轻监管"闻名，尚未制定独立的 AI 法律，但在基础研究质量上全球领先。',
    overviewKo:
      'ETH Zurich와 EPFL은 전 세계 AI 연구 Top 5 기관이며, Google Zurich는 최대의 유럽 연구개발 센터입니다. 스위스는 「혁신 우선, 가벼운 규제」로 유명하며, 아직 독립적인 AI 법을 제정하지 않았지만 기초 연구 품질에서 전 세계 최고 수준입니다.',
    overviewJa:
      'ETH Zurich と EPFL は世界 AI 研究トップ 5 機関であり、Google Zurich はその最大のヨーロッパ R&D センターです。スイスは「イノベーション優先、軽規制」で知られており、独立した AI 法律をまだ制定していませんが、基礎研究の質では世界的にリーディングです。',
    overviewEn:
      'ETH Zurich and EPFL are global Top 5 AI research institutions, and Google Zurich is the company\'s largest European R&D centre. Switzerland is known for an "innovation-first, light-touch" stance and has not yet enacted standalone AI legislation, but leads the world in fundamental research quality.',
    strategies: [
      {
        name: '联邦 AI 战略',
        nameKo: '연방 AI 전략',
        nameJa: '連邦 AI 戦略',
        nameEn: 'Federal AI Strategy',
        year: '2020',
        description: '联邦政府 AI 发展指导方针',
        descriptionKo: '연방 정부 AI 발전 지침',
        descriptionJa: '連邦政府 AI 発展ガイドライン',
        descriptionEn: 'Federal government AI development guidelines',
      },
      {
        name: 'AI 战略更新',
        nameKo: 'AI 전략 업데이트',
        nameJa: 'AI 戦略更新',
        nameEn: 'AI Strategy Update',
        year: '2025',
        description: '更新版联邦 AI 政策',
        descriptionKo: '업데이트된 연방 AI 정책',
        descriptionJa: '更新版連邦 AI 政策',
        descriptionEn: 'Updated federal AI policy',
      },
    ],
    investment: [
      {
        item: 'AI 研究投入（ETH/EPFL）',
        itemKo: 'AI 연구 투자(ETH/EPFL)',
        itemJa: 'AI 研究投資（ETH/EPFL）',
        itemEn: 'AI Research Funding (ETH/EPFL)',
        amount: 'CHF 10 亿+',
        amountKo: 'CHF 10억+',
        amountJa: 'CHF 10 億+',
        amountEn: 'CHF 1 billion+',
        note: '通过联邦理工系统持续投入',
        noteKo: '연방공과대학 시스템을 통한 지속적 투자',
        noteJa: '連邦理工システムを通じた継続的投資',
        noteEn: 'Sustained funding via the federal institutes of technology system',
      },
    ],
    governance:
      '瑞士采取创新优先、轻监管路线，尚未制定独立的 AI 法律。联邦政府倾向于利用现有法律框架管理 AI，同时密切关注欧盟 AI 法案的溢出效应。国际组织总部（WEF、ITU）使其成为全球 AI 治理讨论的重要场所。',
    governanceKo:
      '스위스는 혁신 우선, 가벼운 규제 노선을 취하고 있으며 아직 독립적인 AI 법을 제정하지 않았습니다. 연방 정부는 기존 법적 프레임워크를 활용하여 AI를 관리하는 경향이 있으며, 동시에 EU AI 법안의 파급 효과를 밀접하게 주시하고 있습니다. 국제 조직 본부(WEF, ITU)는 이를 글로벌 AI 거버넌스 논의의 중요한 장소로 만듭니다.',
    governanceJa:
      'スイスはイノベーション優先、軽規制の路線を採用しており、独立した AI 法律をまだ制定していません。連邦政府は既存の法的枠組みを活用して AI を管理する傾向があり、同時に EU AI Act の波及効果を注視しています。国際機関の本部（WEF、ITU）がスイスにあることで、グローバル AI ガバナンス討論の重要な場所となっています。',
    governanceEn:
      'Switzerland takes an innovation-first, light-touch path and has not enacted standalone AI legislation. The federal government prefers to govern AI through existing legal frameworks while closely tracking spillovers from the EU AI Act. Hosting major international bodies (WEF, ITU) makes it a key venue for global AI governance discussions.',
    keyInitiatives: [
      'ETH AI Center',
      'EPFL AI 研究集群',
      'Google Zurich（欧洲最大研发中心）',
      'Swiss AI Initiative',
      'WEF AI Governance Alliance（总部在日内瓦）',
    ],
    keyInitiativesEn: [
      'ETH AI Center',
      'EPFL AI research cluster',
      'Google Zurich (largest European R&D centre)',
      'Swiss AI Initiative',
      'WEF AI Governance Alliance (headquartered in Geneva)',
    ],
    strengths: [
      'ETH/EPFL 全球 Top 5 AI 研究机构',
      'Google Zurich、Disney Research 等顶级企业实验室',
      '国际人才磁铁——高薪资、高生活质量',
      '国际组织总部带来的全球治理话语权',
    ],
    strengthsEn: [
      'ETH/EPFL — global Top 5 AI research institutions',
      'Top-tier corporate labs including Google Zurich and Disney Research',
      'International talent magnet — high salaries and quality of life',
      'Influence over global governance through hosting of international bodies',
    ],
    weaknesses: [
      'AI 创业生态不如新加坡活跃（缺少东南亚市场腹地）',
      '政府直接投入 AI 产业化不如新加坡（AISG 等）积极',
      '联邦制导致政策协调较慢',
      '高成本可能限制大规模 AI 基础设施建设',
    ],
    weaknessesEn: [
      "AI startup scene less active than Singapore's (no Southeast Asian market hinterland)",
      'Government less proactive in AI industrialisation than Singapore (e.g. AISG)',
      'Federalism slows policy coordination',
      'High costs may constrain large-scale AI infrastructure build-out',
    ],
    keyBodies: [
      {
        name: 'SERI（国家教育研究创新秘书处）',
        nameKo: 'SERI(국가교육연구혁신 사무국)',
        nameJa: 'SERI（国家教育研究革新事務局）',
        nameEn: 'SERI (State Secretariat for Education, Research and Innovation)',
        role: '研究政策',
        roleKo: '연구 정책',
        roleJa: '研究政策',
        roleEn: 'Research policy',
      },
      {
        name: 'ETH Board',
        nameEn: 'ETH Board',
        role: '联邦理工系统管理',
        roleKo: '연방공과대학 시스템 관리',
        roleJa: '連邦理工システム管理',
        roleEn: 'Governs the federal institutes of technology system',
      },
      {
        name: 'FDFA（联邦外交事务部）',
        nameKo: 'FDFA(연방외교부)',
        nameJa: 'FDFA（連邦外交事務部）',
        nameEn: 'FDFA (Federal Department of Foreign Affairs)',
        role: '国际 AI 治理',
        roleKo: '국제 AI 거버넌스',
        roleJa: '国際 AI ガバナンス',
        roleEn: 'International AI governance',
      },
    ],
    sources: [
      'Swiss Federal AI Strategy（2020/2025）',
      'ETH Zurich AI Center 年报',
      'OECD AI Policy Observatory — Switzerland',
    ],
    sourcesEn: [
      'Swiss Federal AI Strategy (2020/2025)',
      'ETH Zurich AI Center Annual Report',
      'OECD AI Policy Observatory — Switzerland',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysis:
          '瑞士 AI 战略是"研究先行 + 产业自觉 + 国际治理"三轨：(1) 2020 年联邦 AI 战略发布，由 SERI 主导，2025 年更新；(2) Swiss AI Initiative 由 ETH Zurich + EPFL + 全瑞士 12 所大学 + 75+ 教授于 2023 年 12 月联合启动；(3) 旗舰基础设施：CSCS Alps 超算 2024 年 9 月在 Lugano 投运，10752 颗 NVIDIA Grace Hopper 超芯，2024-06 Top500 排第 6 位；(4) 治理：未制定独立 AI 法律，依赖现有法律框架 + 关注 EU AI Act 溢出。判断：瑞士走的是"非欧盟成员的研究强国"独特路径——不必直接遵守 EU AI Act，但 ETH/EPFL 研究和 Google Zurich 等企业实验室自动对齐欧盟标准。这种"软对齐"让瑞士在 AI 监管上既保留小国敏捷性，又分享 EU 单一市场。',
        analysisKo:
          '스위스 AI 전략은 「연구 우선 + 산업 자각 + 국제 거버넌스」 세 가지 궤도입니다: (1) 2020년 연방 AI 전략 발표, SERI 주도, 2025년 업데이트; (2) Swiss AI Initiative는 ETH Zurich + EPFL + 스위스 전역 12개 대학 + 75명 이상 교수에 의해 2023년 12월 공동으로 시작됨; (3) 플래그십 인프라: CSCS Alps 슈퍼컴퓨터 2024년 9월 Lugano에서 운영 시작, 10,752개 NVIDIA Grace Hopper 슈퍼칩, 2024-06 Top500 순위 6위; (4) 거버넌스: 독립적인 AI 법안 미제정, 기존 법적 프레임워크에 의존 + EU AI Act 유출 주의. 판단: 스위스가 취하는 것은 「비EU 회원국 연구 강국」의 독특한 경로—EU AI Act를 직접 준수할 필요가 없지만, ETH/EPFL 연구와 Google Zurich 등 기업 실험실이 자동으로 EU 표준에 정렬됨. 이러한 「소프트 정렬」은 스위스가 AI 규제에서 소국의 민첩성을 유지하면서도 EU 단일 시장을 공유하도록 함.',
        analysisJa:
          'スイス AI 戦略は「研究先行 + 産業自覚 + 国際ガバナンス」の三本柱です：(1) 2020 年連邦 AI 戦略が SERI 主導で発表され、2025 年更新；(2) Swiss AI Initiative は ETH Zurich + EPFL + スイス全 12 大学 + 75+ 教授が 2023 年 12 月に共同始動；(3) 旗艦インフラ：CSCS Alps スーパーコンピュータが 2024 年 9 月 Lugano で稼働開始、10,752 個の NVIDIA Grace Hopper スーパーチップ、2024-06 Top500 ランキング第 6 位；(4) ガバナンス：独立した AI 法律は未制定、既存法的枠組み + EU AI Act 波及効果の注視に依存。判断：スイスは「非 EU 加盟国の研究強国」独特の路線を歩んでいます——EU AI Act に直接従う必要はありませんが、ETH/EPFL の研究と Google Zurich などの企業研究所の実験は自動的に EU 基準に合致しています。この「ソフト合致」によりスイスは AI 規制で小国敏捷性を維持しながら、EU 単一市場の恩恵を受けています。',
        analysisEn:
          'Switzerland\'s AI strategy is a three-track of "research-first + industry self-discipline + international governance": (1) the Federal AI Strategy was issued in 2020 under SERI lead and updated in 2025; (2) the Swiss AI Initiative launched in December 2023, led by ETH Zurich + EPFL + 12 Swiss universities + 75+ professors; (3) flagship infrastructure: CSCS Alps supercomputer was inaugurated in Lugano on 14 September 2024, with 10 752 NVIDIA Grace Hopper Superchips, ranking 6th globally on Top500 June 2024; (4) governance: no standalone AI legislation; reliance on existing legal frameworks plus monitoring of EU AI Act spillover. Assessment: Switzerland follows a unique "non-EU research-power" path — not directly bound by the EU AI Act, but ETH/EPFL research and corporate labs like Google Zurich automatically align with EU standards. This "soft alignment" preserves small-state agility while sharing EU single-market access.',
        sources: [
          {
            label: 'Alps 超算公告（ETH Zurich）',
            labelKo: 'Alps 슈퍼컴퓨터 공지(ETH Zurich)',
            labelJa: 'Alps スーパーコンピュータ公告（ETH Zurich）',
            labelEn: 'Alps supercomputer inauguration (ETH Zurich)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2024/09/press-release-new-research-infrastructure-alps-supercomputer-inaugurated.html',
            date: '2024-09-14',
          },
          {
            label: 'Swiss AI Initiative（CSCS）',
            labelEn: 'Swiss AI Initiative (CSCS)',
            url: 'https://www.cscs.ch/science/computer-science-hpc/joint-initiative-for-trustworthy-ai',
          },
          {
            label: 'Joint Initiative for Trustworthy AI（ETH 公告）',
            labelKo: 'Joint Initiative for Trustworthy AI(ETH 공지)',
            labelJa: 'Joint Initiative for Trustworthy AI（ETH 公告）',
            labelEn: 'Joint Initiative for Trustworthy AI (ETH announcement)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
      'investment-overview': {
        analysis:
          '瑞士 AI 投资规模 CHF 10 亿+ 主要通过联邦理工系统（ETH Zurich + EPFL + 4 所联邦研究机构）持续投入。具体：(1) ETH AI Center 年度预算 CHF 5000 万+；(2) EPFL AI 研究集群 CHF 4000 万+；(3) CSCS Alps 超算总投资 CHF 1 亿+（HPE Cray EX + 10752 GH200 超芯）；(4) Swiss AI Initiative 启动时投入 CHF 1500 万；(5) 私部门：Google Zurich、Disney Research、Microsoft Research Zurich 共同雇佣 5000+ AI 研究人员（薪资 + 设备 / 年人均 CHF 30 万 = ~CHF 15 亿/年规模）。判断：瑞士 AI 投资的"政府份额"约 CHF 20-30 亿（含 Alps + 大学）远小于韩国 / UAE / Canada，但私部门对齐 + 大学持续高质量产出让瑞士在 AI 论文、人才、基础研究三个维度全球前 5。这是"研究投入杠杆比"最高的国家。',
        analysisKo:
          '스위스 AI 투자 규모 CHF 10억+는 주로 연방공과대학 시스템(ETH Zurich + EPFL + 4개 연방 연구 기관)을 통한 지속적 투자입니다. 세부 사항: (1) ETH AI Center 연간 예산 CHF 5,000만 이상; (2) EPFL AI 연구 클러스터 CHF 4,000만 이상; (3) CSCS Alps 슈퍼컴퓨터 총 투자 CHF 1억 이상(HPE Cray EX + 10,752개 GH200 슈퍼칩); (4) Swiss AI Initiative 시작 시 투자 CHF 1,500만; (5) 민간 부문: Google Zurich, Disney Research, Microsoft Research Zurich 총 5,000명 이상의 AI 연구원 고용(연간 1인당 급여 + 장비/CHF 30만 = ~CHF 15억/년 규모). 판단: 스위스 AI 투자의 「정부 부문」약 CHF 20~30억(Alps + 대학 포함)은 한국/UAE/Canada보다 훨씬 적지만, 민간 부문의 정렬 + 대학의 지속적인 고품질 산출이 스위스가 AI 논문, 인재, 기초 연구 세 가지 측면에서 전 세계 상위 5위를 차지하도록 함. 이것이 「연구 투자 레버리지비」가 가장 높은 국가입니다.',
        analysisJa:
          'スイス AI 投資規模 CHF 10 億+ は主に連邦理工システム（ETH Zurich + EPFL + 4 つの連邦研究機関）を通じた継続的投資です。具体的には：(1) ETH AI Center 年間予算 CHF 5,000 万+；(2) EPFL AI4Science / AI for Good ~CHF 4,000 万；(3) CSCS Alps スーパーコンピュータ総投資 CHF 1 億+（HPE Cray EX + 10,752 GH200 スーパーチップ）；(4) Swiss AI Initiative 始動資金 CHF 1,500 万；(5) 民間部門：Google Zurich、Disney Research、Microsoft Research Zurich が共に 5,000+ AI 研究者を雇用（給与 + 設備/年間人当たり CHF 30 万 = ~CHF 15 億/年規模）。判断：スイス AI 投資の「政府シェア」約 CHF 20-30 億（Alps + 大学を含む）は韓国 / UAE / Canada より遥かに小さいですが、民間部門との連携 + 大学の継続的高質産出がスイスを AI 論文、人材、基礎研究の 3 領域で世界トップ 5 に位置付けています。これは「研究投資レバレッジ比」が最高の国です。',
        analysisEn:
          'Switzerland\'s AI investment of CHF 1bn+ is sustained through the federal institutes of technology system (ETH Zurich + EPFL + 4 federal research institutes). Specifically: (1) ETH AI Center annual budget ~CHF 50m+; (2) EPFL AI research cluster ~CHF 40m+; (3) CSCS Alps supercomputer total investment ~CHF 100m+ (HPE Cray EX + 10 752 GH200 superchips); (4) Swiss AI Initiative launch funding CHF 15m; (5) private-sector: Google Zurich, Disney Research, Microsoft Research Zurich together employ 5 000+ AI researchers (salary + equipment / year per head ~CHF 300k = ~CHF 1.5bn/year scale). Assessment: Switzerland\'s "government share" of AI investment (~CHF 2-3bn including Alps + universities) is far smaller than Korea / UAE / Canada, but private alignment plus sustained high-quality university output puts Switzerland in the global Top 5 on AI papers, talent, and fundamental research. It has the world\'s highest "research-investment leverage ratio".',
        sources: [
          {
            label: 'Alps 超算公告（ETH Zurich）',
            labelKo: 'Alps 슈퍼컴퓨터 공지(ETH Zurich)',
            labelJa: 'Alps スーパーコンピュータ公告（ETH Zurich）',
            labelEn: 'Alps supercomputer inauguration (ETH Zurich)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2024/09/press-release-new-research-infrastructure-alps-supercomputer-inaugurated.html',
            date: '2024-09-14',
          },
          {
            label: 'Joint Initiative for Trustworthy AI（CSCS）',
            labelEn: 'Joint Initiative for Trustworthy AI (CSCS)',
            url: 'https://www.cscs.ch/science/computer-science-hpc/joint-initiative-for-trustworthy-ai',
          },
        ],
      },
      'governance-model': {
        analysisEn:
          'Switzerland\'s AI governance is the most cautious in this benchmark set — "do not legislate AI yet". Rationale: (1) existing horizontal laws (data protection, anti-discrimination, product safety) plus sectoral regulators (FINMA finance, Swissmedic medical devices) cover most foreseeable AI risks; (2) as a non-EU state, Switzerland is not bound by the EU AI Act, but exporters to the EU effectively comply by default; (3) Geneva and Zurich host WEF AI Governance Alliance, ITU, and other multilateral bodies — Switzerland\'s governance influence is exercised primarily on the international stage rather than domestic statute. Assessment: this "do not legislate AI" stance is the opposite of Korea / Taiwan; closer to Singapore\'s voluntary framework. The upside is preserving research / industry agility; the downside is losing first-mover voice in domestic AI rule-making — that voice migrates to Brussels.',
        analysis:
          '瑞士 AI 治理是本基准集中最审慎的——"暂不为 AI 立法"。理由：(1) 现有水平性法律（数据保护、反歧视、产品安全）+ 行业监管（FINMA 金融、Swissmedic 医疗）已覆盖大部分可预见 AI 风险；(2) 作为非 EU 成员国，瑞士不受 EU AI Act 直接约束，但出口型 AI 服务面向欧盟客户实际上自动遵守；(3) 瑞士的 WEF AI Governance Alliance 和 ITU 等国际组织总部在日内瓦 / 苏黎世——瑞士的治理影响力主要通过国际舞台而非国内立法。判断："不立法"立场与韩国 / 台湾相反，更接近新加坡的自愿性框架。优势是保留研究 / 产业敏捷性；劣势是放弃 AI 国内规则制定的"先发声音"——这部分声音被 Brussels 抢走。',
        analysisKo:
          '스위스 AI 거버넌스는 본 벤치마크 집중 중 가장 신중함—「AI에 대한 입법 유보」. 이유: (1) 기존의 수평적 법률(데이터 보호, 반차별, 제품 안전) + 산업 규제(FINMA 금융, Swissmedic 의료)가 대부분의 예측 가능한 AI 위험을 이미 커버함; (2) 비EU 회원국으로서 스위스는 EU AI Act의 직접적 구속을 받지 않지만, EU 고객을 대상으로 하는 수출형 AI 서비스는 실제로 자동으로 준수함; (3) 스위스의 WEF AI Governance Alliance 및 ITU 등 국제 기구 본부가 제네바/취리히에 있음—스위스의 거버넌스 영향력은 주로 국제 무대를 통해 국내 입법이 아닌 형태로 발휘됨. 판단: 「입법 유보」 입장은 한국/대만과 대조적이며, 싱가포르의 자발적 프레임워크에 더 가까움. 장점은 연구/산업 민첩성을 유지하는 것이고; 단점은 AI 국내 규칙 제정의 「선제적 발언권」을 포기하는 것—이 부분의 발언권은 Brussels에 빼앗김.',
        analysisJa:
          'スイス AI ガバナンスはこのベンチマーク集の中で最も慎重です——「当面 AI 立法を行わない」。理由：(1) 既存の水平的法律（データ保護、反差別、製品安全）+ 業界規制（FINMA 金融、Swissmedic 医療）が大部分の予見可能な AI リスクを既にカバーしています；(2) EU 非加盟国として、スイスは EU AI Act の直接的拘束を受けませんが、EU 顧客向けの輸出 AI サービスは実質的に自動遵守しています；(3) スイスの WEF AI Governance Alliance と ITU などの国際機関本部がジュネーブ / チューリッヒにあります——スイスのガバナンス影響力は国内立法よりも国際舞台を通じたものです。判断：「非立法」立場は韓国 / 台湾と対照的で、シンガポールの自発的枠組みに近いです。利点は研究 / 産業敏捷性を維持すること；欠点は国内 AI 規則制定の「先制声」を放棄することです——この声の一部は Brussels に奪われています。',
        sources: [
          {
            label: 'OECD AI Policy Observatory（含瑞士节）',
            labelKo: 'OECD AI Policy Observatory(스위스 섹션 포함)',
            labelJa: 'OECD AI Policy Observatory（スイス部分を含む）',
            labelEn: 'OECD AI Policy Observatory (Switzerland section)',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'comparative-strength': {
        analysisEn:
          'Switzerland\'s edge over Singapore is "research depth + international leverage + private-sector co-investment": (1) ETH and EPFL are global Top 5 in AI research, with Yann LeCun, Geoffrey Hinton-tier alumni networks; (2) Google Zurich is Google\'s largest European R&D centre, employing 5 000+ engineers including AI specialists; (3) hosting WEF, ITU, OECD AI policy units gives Switzerland disproportionate global governance voice; (4) the Alps supercomputer (10 752 GH200, Top500 #6 in 2024) is the largest non-US/non-China sovereign compute outside hyperscaler clouds. Weaknesses: smaller AI startup ecosystem than Singapore, no Southeast Asian market hinterland, federal slow-coordination, high cost limits large-scale infrastructure. Assessment: Switzerland and Singapore optimise for different layers — Switzerland is research + private-sector heavy; Singapore is governance + hub heavy. Both leverage neutrality + small-state agility, both are essential nodes in global AI dialogue, but rarely compete head-on.',
        analysis:
          '瑞士相对新加坡的核心杠杆是"研究深度 + 国际影响 + 私部门共投"：(1) ETH 和 EPFL 是全球 AI 研究 Top 5，Yann LeCun、Geoffrey Hinton 级校友网络；(2) Google Zurich 是 Google 全欧最大 R&D 中心，5000+ 工程师含 AI 专家；(3) WEF、ITU、OECD AI 政策单元总部在瑞士给瑞士不成比例的全球治理话语权；(4) Alps 超算（10752 GH200、Top500 2024 第 6）是非美中、非超大规模云之外最大的主权算力。短板：AI 创业生态不如新加坡活跃、缺东南亚市场腹地、联邦制协调慢、高成本限制大规模基础设施。判断：瑞士和新加坡优化不同层——瑞士是研究 + 私部门重，新加坡是治理 + 枢纽重。两者都靠中立 + 小国敏捷性，都是全球 AI 对话的关键节点，但赛道几乎不正面竞争。',
        analysisKo:
          '스위스의 싱가포르 대비 핵심 레버는 「연구 깊이 + 국제 영향 + 민간 부문 공동 투자」입니다: (1) ETH와 EPFL은 전 세계 AI 연구 상위 5, Yann LeCun, Geoffrey Hinton 급의 교우 네트워크; (2) Google Zurich는 Google 전유럽 최대 R&D 센터, 5,000명 이상의 엔지니어 포함 AI 전문가; (3) WEF, ITU, OECD AI 정책 단위 본부가 스위스에 있어 스위스에 부당하게 큰 글로벌 거버넌스 발언권을 부여함; (4) Alps 슈퍼컴퓨터(10,752개 GH200, Top500 2024 제6위)는 미국/중국도 아니고, 초대규모 클라우드도 아닌 최대 주권 컴퓨팅 파워. 약점: AI 스타트업 생태계가 싱가포르만큼 활발하지 않음, 동남아 시장 배후지 부족, 연방제 조정 느림, 높은 비용이 대규모 기반 시설 제한. 판단: 스위스와 싱가포르는 다른 계층을 최적화—스위스는 연구 + 민간 부문 중심, 싱가포르는 거버넌스 + 허브 중심. 둘 다 중립성 + 소국 민첩성에 의존하며, 둘 다 글로벌 AI 대화의 핵심 노드이지만, 경쟁 트랙은 거의 정면으로 충돌하지 않음.',
        analysisJa:
          'スイスのシンガポール対比での中核レバレッジは「研究深度 + 国際影響 + 民間部門共同投資」です：(1) ETH と EPFL は世界 AI 研究トップ 5、Yann LeCun、Geoffrey Hinton クラスの卒業生ネットワーク；(2) Google Zurich は Google 全ヨーロッパ最大 R&D センターで、5,000+ エンジニア（AI 専門家を含む）；(3) WEF、ITU、OECD AI 政策部門の本部がスイスにあることで、不釣り合いなグローバルガバナンス発言権を付与；(4) Alps スーパーコンピュータ（10,752 GH200、Top500 2024 第 6 位）は非米中、非超大規模クラウド外の最大主権算力。短所：AI スタートアップエコシステムはシンガポール不及、東南アジア市場腹地が不足、連邦制調整が遅い、高コストが大規模インフラ制限。判断：スイスとシンガポールは異なる階層で最適化——スイスは研究 + 民間部門重視、シンガポールはガバナンス + ハブ重視。両者とも中立性 + 小国敏捷性に依存し、両者ともグローバル AI 対話の重要ノードですが、競争領域はほぼ重なりません。',
        sources: [
          {
            label: 'Alps 超算公告（ETH Zurich）',
            labelKo: 'Alps 슈퍼컴퓨터 공지(ETH Zurich)',
            labelJa: 'Alps スーパーコンピュータ公告（ETH Zurich）',
            labelEn: 'Alps supercomputer inauguration (ETH Zurich)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2024/09/press-release-new-research-infrastructure-alps-supercomputer-inaugurated.html',
            date: '2024-09-14',
          },
          {
            label: 'Joint Initiative for Trustworthy AI（CSCS）',
            labelEn: 'Joint Initiative for Trustworthy AI (CSCS)',
            url: 'https://www.cscs.ch/science/computer-science-hpc/joint-initiative-for-trustworthy-ai',
          },
        ],
      },
      'strategy-1': {
        analysisEn:
          'Switzerland\'s Federal AI Strategy was issued in 2020 by SERI on behalf of the Federal Council. Core stance: "AI as cross-cutting infrastructure" — recommend that each federal department independently identify AI applications relevant to its domain rather than concentrating AI policy in a single ministry. Coverage: research support, industrial application, government digitalisation, ethics, international cooperation. Assessment: the 2020 strategy was a typical Swiss "federal soft coordination" — a guidance document, not enforceable policy. Its real impact came from giving SERI the mandate to legitimise CSCS Alps and Swiss AI Initiative rather than from any specific operational measure.',
        analysis:
          '瑞士联邦 AI 战略 2020 年由 SERI 代表联邦委员会发布。核心立场："AI 作为横切基础设施"——建议各联邦部门独立识别 AI 在本领域的应用，而不是把 AI 政策集中在单一部委。覆盖：研究支持、产业应用、政府数字化、伦理、国际合作。判断：2020 年战略是典型的瑞士"联邦式软协调"——指导文件而非强制政策。真正影响来自它给 SERI 提供"AI 政策合法性"，让 CSCS Alps 投入和 Swiss AI Initiative 启动有了顶层依据，而不是它本身的具体措施。',
        analysisKo:
          '스위스 연방 AI 전략은 2020년 SERI이 연방 위원회를 대표하여 발표함. 핵심 입장: 「AI는 횡단적 기초 인프라」—각 연방 부처가 본 영역의 AI 응용을 독립적으로 파악할 것을 권고하며, AI 정책을 단일 부처에 집중하지 말 것. 범위: 연구 지원, 산업 응용, 정부 디지털화, 윤리, 국제 협력. 판단: 2020년 전략은 전형적인 스위스 「연방식 소프트 조정」—강제 정책이 아닌 지침 문서. 실제 영향은 SERI에 「AI 정책 합법성」을 제공하여 CSCS Alps 투자와 Swiss AI Initiative 시작이 최고위 근거를 갖도록 한 것이지, 자체 구체적 조치가 아님.',
        analysisJa:
          'スイス連邦 AI 戦略は 2020 年に SERI がスイス連邦評議会代表で発表されました。中核立場：「AI は横断的基礎インフラ」——各連邦部局に本領域での AI 応用を独立して認識することを推奨し、AI 政策を単一部局に集中させません。カバー領域：研究支援、産業応用、政府デジタル化、倫理、国際協力。判断：2020 年戦略は典型的なスイス「連邦型ソフト調整」——指導文書であり強制政策ではありません。真の影響は SERI に「AI 政策合法性」を付与することで、CSCS Alps 投資と Swiss AI Initiative 始動が最高層の根拠を持つようになりました。本戦略自体の具体的施策からではなく。',
        sources: [
          {
            label: 'OECD AI Policy Observatory',
            labelEn: 'OECD AI Policy Observatory',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'strategy-2': {
        analysisEn:
          'The 2025 Federal AI Strategy update incorporated GenAI-era considerations: (1) recognising large-model training as a sovereign-compute problem (justifying Alps), (2) tracking EU AI Act spillover impacts on Swiss exporters, (3) emphasising "trustworthy AI" as an export brand. Assessment: the 2025 update remains a "strategy document", not enforceable legislation. It is roughly comparable to Singapore\'s NAIS 2.0 in policy framing but carries less actual budget commitment (Singapore S$2bn+, Switzerland mostly relies on the existing federal institute system rather than fresh appropriations).',
        analysis:
          '2025 年联邦 AI 战略更新纳入了 GenAI 时代考量：(1) 承认大模型训练是主权算力问题（为 Alps 提供合法性）；(2) 追踪 EU AI Act 对瑞士出口商的溢出影响；(3) 强调"可信 AI"作为出口品牌。判断：2025 更新仍是"战略文件"性质，不是强制立法。在政策定位上大致对标新加坡 NAIS 2.0，但实际预算承诺低（新加坡 S$20 亿+，瑞士主要靠既有联邦理工系统而不是新增拨款）。',
        analysisKo:
          '2025년 연방 AI 전략 업데이트는 GenAI 시대 고려사항을 포함: (1) 대모델 훈련이 주권 컴퓨팅 문제임을 인정(Alps에 합법성 제공); (2) EU AI Act의 스위스 수출상에 대한 유출 영향을 추적; (3) 「신뢰할 수 있는 AI」를 수출 브랜드로 강조. 판단: 2025년 업데이트는 여전히 「전략 문서」 성격이며, 강제 입법이 아님. 정책 포지셔닝에서 대략 싱가포르 NAIS 2.0에 대응하지만, 실제 예산 약속은 낮음(싱가포르 S$20억+, 스위스는 주로 기존 연방공과대학 시스템에 의존하며 신규 배정이 아님).',
        analysisJa:
          '2025 年連邦 AI 戦略更新は GenAI 時代の考慮を組み込みました：(1) 大規模言語モデル訓練が主権算力問題であることを認識（Alps の合法性提供）；(2) EU AI Act のスイス輸出業者への波及影響を追跡；(3) 「信頼できる AI」を輸出ブランドとして強調。判断：2025 年更新は依然として「戦略文書」性質で、強制立法ではありません。政策位置付けではおおよそシンガポール NAIS 2.0 に対標されていますが、実際予算約束は低い（シンガポール S$20 億+、スイスは主に既存連邦理工システムに依存し、新規拨款ではありません）。',
        sources: [
          {
            label: 'OECD AI Policy Observatory',
            labelEn: 'OECD AI Policy Observatory',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'investment-1': {
        analysisEn:
          'ETH/EPFL AI research funding totals roughly CHF 1bn+, distributed via the federal institutes of technology system. Specifically: ETH AI Center (founded 2020) annual budget ~CHF 50m, EPFL AI4Science / AI for Good ~CHF 40m, plus PSI / Empa / WSL AI-related lines. Joint Swiss AI Initiative launch capital was CHF 15m. Assessment: this is the most reliable AI investment line — federal institutes of technology funding is constitutionally protected and rarely subject to political cuts. Even if Switzerland never legislates AI, ETH and EPFL will produce frontier research. This is a "capital-light, talent-heavy" strategy that small states like Singapore cannot fully replicate (Singapore needs imported research talent at scale).',
        analysis:
          'ETH/EPFL AI 研究投入合计 CHF 10 亿+，通过联邦理工系统分配。具体：ETH AI Center（2020 成立）年度预算 ~CHF 5000 万、EPFL AI4Science / AI for Good ~CHF 4000 万、加上 PSI / Empa / WSL 等 AI 相关条线。联合启动的 Swiss AI Initiative 起动资金 CHF 1500 万。判断：这是最可靠的 AI 投入条线——联邦理工系统资金受宪法保护，很少受政治削减。即便瑞士永远不为 AI 立法，ETH 和 EPFL 仍会产出前沿研究。这是"轻资本 + 重人才"策略，新加坡这种小国无法完全复制（新加坡需要规模化引进研究人才）。',
        analysisKo:
          'ETH/EPFL AI 연구 투자 합계 CHF 10억+는 연방공과대학 시스템을 통해 배분됨. 세부 사항: ETH AI Center(2020년 설립) 연간 예산 ~CHF 5,000만, EPFL AI4Science / AI for Good ~CHF 4,000만, 더하기 PSI / Empa / WSL 등 AI 관련 라인. 공동으로 시작한 Swiss AI Initiative 초기 자금 CHF 1,500만. 판단: 이것이 가장 신뢰할 수 있는 AI 투자 라인—연방공과대학 시스템 자금은 헌법으로 보호되며, 정치적 삭감을 거의 받지 않음. 스위스가 AI에 대해 절대 입법하지 않더라도, ETH와 EPFL은 계속 첨단 연구를 산출할 것. 이것은 「경량 자본 + 고중량 인재」 전략이며, 싱가포르 같은 소국은 완전히 복제할 수 없음(싱가포르는 연구 인재의 규모화된 유입이 필요함).',
        analysisJa:
          'ETH/EPFL AI 研究投資合計 CHF 10 億+ は連邦理工システム経由で配分されます。具体的には：ETH AI Center（2020 年設立）年間予算 ~CHF 5,000 万、EPFL AI4Science / AI for Good ~CHF 4,000 万、加えて PSI / Empa / WSL など AI 関連分野。共同始動の Swiss AI Initiative は始動資金 CHF 1,500 万。判断：これは最も信頼性の高い AI 投資ラインです——連邦理工システム資金は憲法保護を受け、政治的削減をほぼ受けません。スイスがが AI 立法を永遠に行わなかったとしても、ETH と EPFL は引き続き最先端研究を産出します。これは「軽資本 + 重人材」戦略で、シンガポールのような小国は完全に複製できません（シンガポールは研究人材の大規模導入が必要です）。',
        sources: [
          {
            label: 'Alps 超算公告（ETH Zurich）',
            labelKo: 'Alps 슈퍼컴퓨터 공지(ETH Zurich)',
            labelJa: 'Alps スーパーコンピュータ公告（ETH Zurich）',
            labelEn: 'Alps supercomputer inauguration (ETH Zurich)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2024/09/press-release-new-research-infrastructure-alps-supercomputer-inaugurated.html',
            date: '2024-09-14',
          },
          {
            label: 'Joint Initiative for Trustworthy AI（ETH）',
            labelEn: 'Joint Initiative for Trustworthy AI (ETH)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
      'initiative-1': {
        analysisEn:
          "ETH AI Center was established in 2020 as ETH Zurich's institutional umbrella for AI research. Houses 50+ professors and 500+ researchers across machine learning, computer vision, NLP, robotics, AI4Science. Founder-tier achievements: AlphaFold-style protein structure modelling, German weather forecasting transformer GraphCast, large-language-model fine-tuning frameworks. Assessment: ETH AI Center sits in the global Top 5 AI research institutions alongside Stanford / MIT / CMU / DeepMind. Its real unique value is talent retention — Swiss researchers do not have to migrate to the US to access frontier compute (Alps) or competitive salaries.",
        analysis:
          'ETH AI Center 2020 年成立，是 ETH Zurich 的 AI 研究制度伞。覆盖 50+ 教授、500+ 研究员，跨机器学习、计算机视觉、NLP、机器人、AI4Science。代表性成就：AlphaFold 类蛋白结构建模、德国气象预测 transformer GraphCast、大语言模型微调框架。判断：ETH AI Center 在全球 AI 研究机构 Top 5 之内（与 Stanford / MIT / CMU / DeepMind 并列）。真正独特价值是"人才留住"——瑞士研究员不必迁美才能用上前沿算力（Alps）或拿到竞争性薪资。',
        analysisKo:
          'ETH AI Center는 2020년 설립되어 ETH Zurich의 AI 연구 제도 우산임. 50명 이상의 교수, 500명 이상의 연구원을 아우르며, 머신러닝, 컴퓨터 비전, NLP, 로봇공학, AI4Science를 횡단함. 대표 성과: AlphaFold 유사 단백질 구조 모델링, 독일 기상 예측 transformer GraphCast, 대규모 언어 모델 미세조정 프레임워크. 판단: ETH AI Center는 전 세계 AI 연구 기관 상위 5 이내(Stanford / MIT / CMU / DeepMind와 동등). 진정한 독특한 가치는 「인재 유지」—스위스 연구원들이 미국으로 이주하지 않고도 첨단 컴퓨팅 파워(Alps)를 사용하거나 경쟁력 있는 급여를 받을 수 있음.',
        analysisJa:
          'ETH AI Center は 2020 年設立で、ETH Zurich の AI 研究制度傘です。カバー：50+ 教授、500+ 研究員、機械学習、コンピュータビジョン、NLP、ロボティクス、AI4Science に跨る。代表的成果：AlphaFold クラスタンパク質構造モデリング、ドイツ気象予測 Transformer GraphCast、大規模言語モデル微調整フレームワーク。判断：ETH AI Center はグローバル AI 研究機関トップ 5 内（Stanford / MIT / CMU / DeepMind と並列）。真の独特価値は「人材保持」——スイス研究員は最先端算力（Alps）を利用するか競争的給与を獲得するために米国に移住する必要がありません。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（ETH）',
            labelEn: 'Joint Initiative for Trustworthy AI (ETH)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
      'initiative-2': {
        analysisEn:
          'EPFL AI research cluster covers AI4Science, large model fine-tuning, AI for Climate, AI for Health, robotics. EPFL hosts the AI Center, the AI4Science Center, the Center for Intelligent Systems, and the Robotics Center. EPFL faculty include Marcel Salathé (digital epidemiology), Aude Billard (robotics), Caglar Gulcehre (LLM). Assessment: EPFL plays "complementary research strengths" with ETH Zurich — ETH is heavier on theoretical machine learning, EPFL on applications and embodied AI. Together they form a Swiss AI research two-pole structure, with Alps as their shared compute backbone and Swiss AI Initiative as their cross-pollination organiser.',
        analysis:
          'EPFL AI 研究集群覆盖 AI4Science、大模型微调、AI for Climate、AI for Health、机器人。EPFL 内含 AI Center、AI4Science Center、Center for Intelligent Systems、Robotics Center。代表教授：Marcel Salathé（数字流行病学）、Aude Billard（机器人）、Caglar Gulcehre（LLM）。判断：EPFL 与 ETH Zurich 是"互补研究强项"——ETH 重理论机器学习，EPFL 重应用和具身 AI。两者形成瑞士 AI 研究双极结构，Alps 是共同算力底座，Swiss AI Initiative 是跨极协作组织。',
        analysisKo:
          'EPFL AI 연구 클러스터는 AI4Science, 대모델 미세조정, AI for Climate, AI for Health, 로봇공학을 포함함. EPFL 내부에는 AI Center, AI4Science Center, Center for Intelligent Systems, Robotics Center를 포함함. 대표 교수: Marcel Salathé(디지털 역학), Aude Billard(로봇공학), Caglar Gulcehre(LLM). 판단: EPFL은 ETH Zurich와 「상호 보완 연구 강점」—ETH는 이론 머신러닝 중심, EPFL은 응용과 구체화 AI 중심. 둘은 스위스 AI 연구의 이극 구조를 형성하며, Alps는 공동 컴퓨팅 기초, Swiss AI Initiative는 극 간 협력 조직임.',
        analysisJa:
          'EPFL AI 研究クラスターは、AI4Science、大規模言語モデルのファインチューニング、AI for Climate、AI for Health、ロボティクスをカバーしています。EPFL には AI Center、AI4Science Center、Center for Intelligent Systems、Robotics Center が含まれています。主要な教授は Marcel Salathé（デジタル疫学）、Aude Billard（ロボティクス）、Caglar Gulcehre（LLM）です。評価として、EPFL と ETH Zurich は「相補的な研究上の強み」を持っています——ETH は理論的機械学習を重視し、EPFL は応用と具現化 AI を重視しています。両者はスイスの AI 研究の二極構造を形成し、Alps は共通の計算インフラの基盤であり、Swiss AI Initiative は極間協力の組織です。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（EPFL）',
            labelEn: 'Joint Initiative for Trustworthy AI (EPFL)',
            url: 'https://actu.epfl.ch/news/joint-initiative-for-trustworthy-ai/',
            date: '2023-12-08',
          },
        ],
      },
      'initiative-3': {
        analysisEn:
          "Google Zurich is Google's largest European R&D centre, established 2004. Headcount: ~5 000 engineers, including ~1 500-2 000 working on AI / ML. Notable products developed in Zurich: Google Maps backend, Google Pay, Knowledge Graph, parts of Bard / Gemini multilingual capabilities. Assessment: Google Zurich is Switzerland's most concrete \"private-sector AI strength\" — an exporter of AI capability without Swiss tax dollars. The implicit risk: Google's strategic reorganisation could redirect Zurich resources elsewhere, and Switzerland would have limited leverage. Singapore has Google APAC HQ but the Singapore footprint is more sales/marketing than R&D — Switzerland has the inverse pattern.",
        analysis:
          'Google Zurich 是 Google 全欧最大 R&D 中心，2004 年成立。员工 ~5000 名工程师，含 1500-2000 AI / ML 团队。在苏黎世开发的代表产品：Google Maps 后台、Google Pay、Knowledge Graph、Bard / Gemini 多语言能力的部分模块。判断：Google Zurich 是瑞士最具象的"私部门 AI 实力"——不花瑞士纳税人钱的 AI 能力出口者。隐含风险：Google 战略重组可能把苏黎世资源转移别处，瑞士影响有限。新加坡有 Google APAC HQ 但偏销售 / 市场而非 R&D，瑞士是相反模式。',
        analysisKo:
          'Google Zurich는 Google 전유럽 최대 R&D 센터이며, 2004년 설립됨. 직원 약 5,000명의 엔지니어, 1,500~2,000명의 AI/ML 팀 포함. 취리히에서 개발된 대표 제품: Google Maps 백엔드, Google Pay, Knowledge Graph, Bard / Gemini 다국어 능력의 일부 모듈. 판단: Google Zurich는 스위스의 가장 구체적인 「민간 부문 AI 실력」—스위스 납세자의 돈을 쓰지 않는 AI 능력 수출자. 함축된 위험: Google 전략 개편이 취리히 자원을 다른 곳으로 이동할 수 있으며, 스위스의 영향은 제한적. 싱가포르는 Google APAC HQ를 가지고 있지만 판매/마케팅 중심이며 R&D가 아님, 스위스는 반대 모델.',
        analysisJa:
          'Google Zurich は Google 全欧州最大の R&D センターであり、2004 年に設立されました。約 5000 名の工学者を雇用しており、そのうち 1500～2000 名が AI / ML チームに属しています。チューリッヒで開発された主要な製品は Google Maps バックエンド、Google Pay、Knowledge Graph、Bard / Gemini の多言語機能の一部モジュールです。評価として、Google Zurich はスイスの最も具体的な「民間部門の AI 実力」です——スイス納税者の資金を使わない AI 能力輸出企業です。隠れたリスクとして、Google の戦略的再編がチューリッヒのリソースを他の場所へ移転する可能性があり、スイスの影響力は限定的です。シンガポール には Google APAC HQ がありますが、販売・市場主導であり R&D ではなく、スイスはその逆のモデルです。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（含 Google Zurich 上下文）',
            labelKo: 'Joint Initiative for Trustworthy AI(Google Zurich 컨텍스트 포함)',
            labelJa: 'Joint Initiative for Trustworthy AI（Google Zurich の文脈を含む）',
            labelEn: 'Joint Initiative for Trustworthy AI (Google Zurich context)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
      'initiative-4': {
        analysisEn:
          'Swiss AI Initiative launched in December 2023 — a joint effort by ETH Zurich + EPFL + 12 Swiss universities + 75+ professors. Mission: "position Switzerland as a leading global hub for transparent and reliable AI development". Operations: pool computational, data, and talent resources to train sovereign Swiss large language models on the Alps supercomputer. Assessment: the Initiative is the institutional channel that turns Alps into a national resource — without this organisation, Alps would mainly serve ETH/EPFL. The initiative is closer in form to Canada\'s CIFAR Pan-Canadian AI Strategy than to Singapore\'s centralised AISG; it works because of high trust between Swiss universities, but is unlikely to scale to a country where universities are competitors rather than collaborators.',
        analysis:
          'Swiss AI Initiative 2023 年 12 月启动——ETH Zurich + EPFL + 全瑞士 12 所大学 + 75+ 教授联合发起。使命："把瑞士定位为透明可靠 AI 发展的全球领先中心"。运营：把算力 / 数据 / 人才资源集中起来，在 Alps 超算上训练瑞士主权大模型。判断：Initiative 是把 Alps 从"ETH/EPFL 工具"升级到"国家资源"的制度通道——没有这个组织，Alps 主要服务 ETH/EPFL。组织形式更接近 Canada CIFAR Pan-Canadian AI Strategy 而非新加坡集中型 AISG；它能跑因为瑞士各大学间信任度高，在大学互为竞争对手的国家很难复制。',
        analysisKo:
          'Swiss AI Initiative는 2023년 12월 시작—ETH Zurich + EPFL + 스위스 전역 12개 대학 + 75명 이상 교수가 공동으로 발의함. 미션: 「스위스를 투명하고 신뢰할 수 있는 AI 발전의 글로벌 선도 중심으로 포지셔닝」. 운영: 컴퓨팅 파워/데이터/인재 자원을 집중시켜 Alps 슈퍼컴퓨터에서 스위스 주권 대모델을 훈련함. 판단: Initiative는 Alps를 「ETH/EPFL 도구」에서 「국가 자원」으로 업그레이드하는 제도 통로—이 조직이 없다면 Alps는 주로 ETH/EPFL을 지원함. 조직 형태는 Canada CIFAR Pan-Canadian AI Strategy에 더 가깝고 싱가포르의 집중형 AISG가 아님; 대학 간 신뢰도가 높기 때문에 작동할 수 있으며, 대학이 서로 경쟁자인 국가에서는 복제하기 어려움.',
        analysisJa:
          'Swiss AI Initiative は 2023 年 12 月に始動――ETH Zurich + EPFL + スイス全体の 12 大学 + 75 人以上の教授が共同で立ち上げました。ミッション：「スイスを透明で信頼できる AI 開発の世界的リーディングセンターとして位置づけること」。運営：コンピューティングパワー / データ / 人材リソースを集約し、Alps スーパーコンピュータ上でスイス主権型大規模言語モデルを訓練しています。評価：Initiative は Alps を「ETH/EPFL ツール」から「国家資源」へアップグレードする制度的チャネル――この組織がなければ、Alps は主に ETH/EPFL にサービス提供しています。組織形態は Canada の CIFAR Pan-Canadian AI Strategy に近く、シンガポール集約型 AISG ではなく；スイス各大学間の信頼度が高いため運営可能であり、大学が互いに競争相手である国では再現が難しいです。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（ETH 公告）',
            labelKo: 'Joint Initiative for Trustworthy AI(ETH 공지)',
            labelJa: 'Joint Initiative for Trustworthy AI（ETH 公告）',
            labelEn: 'Joint Initiative for Trustworthy AI (ETH announcement)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
          {
            label: 'Joint Initiative for Trustworthy AI（CSCS）',
            labelEn: 'Joint Initiative for Trustworthy AI (CSCS)',
            url: 'https://www.cscs.ch/science/computer-science-hpc/joint-initiative-for-trustworthy-ai',
          },
        ],
      },
      'initiative-5': {
        analysisEn:
          'WEF AI Governance Alliance is headquartered in Geneva, hosted by the World Economic Forum. Convenes 250+ AI leaders globally including governments, civil society, AI labs (Anthropic, OpenAI, DeepMind, Mistral, etc.). Output: governance principles, model standards, deployment guidelines. Assessment: WEF AI Governance Alliance is Switzerland\'s main "international AI governance soft power" channel — it cannot legislate, but it shapes global discourse. Singapore plays a similar role through co-chairing the OECD AI Principles working group; Switzerland and Singapore are in many ways structural collaborators rather than competitors in global AI governance.',
        analysis:
          'WEF AI Governance Alliance 总部在日内瓦，由世界经济论坛主办。汇集 250+ 全球 AI 领导者：政府、公民社会、AI 实验室（Anthropic、OpenAI、DeepMind、Mistral 等）。产出：治理原则、模型标准、部署指南。判断：WEF AI Governance Alliance 是瑞士"国际 AI 治理软实力"的主要通道——它不能立法但塑造全球话语。新加坡通过共同主持 OECD AI 原则工作组扮演类似角色；瑞士与新加坡在全球 AI 治理上很多时候是结构性合作者而非竞争对手。',
        analysisKo:
          'WEF AI Governance Alliance는 제네바에 본부를 두고 있으며 세계경제포럼이 주최합니다. 250명 이상의 글로벌 AI 리더들을 모으고 있습니다: 정부, 시민사회, AI 실험실(Anthropic, OpenAI, DeepMind, Mistral 등). 산출: 거버넌스 원칙, 모델 표준, 배포 가이드. 판단: WEF AI Governance Alliance는 스위스의 「국제 AI 거버넌스 소프트파워」의 주요 채널입니다——입법할 수는 없지만 글로벌 담론을 형성합니다. 싱가포르는 OECD AI 원칙 워킹그룹을 공동 주최함으로써 유사한 역할을 수행합니다; 스위스와 싱가포르는 글로벌 AI 거버넌스에서 많은 경우 구조적 협력자이지 경쟁자가 아닙니다.',
        analysisJa:
          'WEF AI Governance AllianceはWorld Economic Forumが主催し、ジュネーブに本部を置いています。政府、市民社会、AI研究室（Anthropic、OpenAI、DeepMind、Mistralなど）を含む250以上のグローバルAIリーダーを集めています。成果物はガバナンス原則、モデル基準、導入ガイドラインです。判断：WEF AI Governance Allianceはスイスの「国際AI治理ソフトパワー」の主要なチャネルであり、立法化することはできませんが、グローバルなディスコースを形成しています。シンガポールはOECD AI原則ワーキンググループの共同議長を務めることで、類似の役割を果たしています；スイスとシンガポールはグローバルAI治理において多くの場合、構造的なパートナーであり、競争相手ではありません。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（含 WEF AI 治理上下文）',
            labelKo: 'Joint Initiative for Trustworthy AI(WEF AI 거버넌스 맥락 포함)',
            labelJa: 'Joint Initiative for Trustworthy AI（WEF AI ガバナンス文脈を含む）',
            labelEn: 'Joint Initiative for Trustworthy AI (WEF AI governance context)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
      'body-1': {
        analysisEn:
          "SERI (State Secretariat for Education, Research and Innovation) is Switzerland's federal ministry-equivalent for research policy. AI-related functions: (1) issuing the Federal AI Strategy (2020, 2025); (2) coordinating the federal institutes of technology system budget (ETH, EPFL, PSI, Empa, WSL); (3) interfacing with EU Horizon Europe on AI research collaboration. Assessment: SERI is positioned more like Singapore's NRF (research-policy oriented) than SNDGO (whole-of-government coordinator). It does not own AI deployment in government; the federal Council relies on individual departments to develop their own AI plans. This dispersion is consistent with Swiss federalism but limits central coordination.",
        analysis:
          'SERI（国家教育研究创新秘书处）是瑞士联邦研究政策主管机构。AI 相关职能：(1) 发布联邦 AI 战略（2020、2025）；(2) 协调联邦理工系统预算（ETH、EPFL、PSI、Empa、WSL）；(3) 与 EU Horizon Europe 在 AI 研究合作上对接。判断：SERI 在职能定位上更接近新加坡 NRF（研究政策导向）而非 SNDGO（全政府协调）。它不拥有政府 AI 部署，联邦委员会依靠各部门各自制定 AI 计划。这种分散与瑞士联邦制一致，但限制了中央协调。',
        analysisKo:
          'SERI(국가 교육 연구 혁신 비서실)는 스위스 연방 연구 정책 주무 기관입니다. AI 관련 직능: (1) 연방 AI 전략 발표(2020, 2025); (2) 연방 공대 시스템 예산 조율(ETH, EPFL, PSI, Empa, WSL); (3) EU Horizon Europe와 AI 연구 협력 연계. 판단: SERI는 직능 정위상 싱가포르 NRF(연구 정책 지향)에 더 가깝고 SNDGO(정부 전체 조율)가 아닙니다. 이는 정부 AI 배포를 소유하지 않으며, 연방 위원회는 각 부처가 AI 계획을 각자 제정하는 데 의존합니다. 이러한 분산은 스위스 연방제와 일치하지만 중앙 조율을 제한합니다.',
        analysisJa:
          'SERI（国家教育研究イノベーション秘書処）はスイス連邦の研究政策を主管する機関です。AI関連職能：(1) 連邦AI戦略の発表（2020、2025）；(2) 連邦工科大学等システム予算の調整（ETH、EPFL、PSI、Empa、WSL）；(3) EU Horizon Europeとの AI研究協力における連携。評価：SERIは職能上の位置づけの観点でシンガポール NRF（研究政策志向）に近く、SNDGO（全政府協調）ではない。SERIは政府のAI展開を所有していません。連邦委員会は各部門が独自にAI計画を策定することに依存しています。この分散化はスイス連邦制と一致していますが、中央協調を制限しています。',
        sources: [
          {
            label: 'OECD AI Policy Observatory',
            labelEn: 'OECD AI Policy Observatory',
            url: 'https://oecd.ai/en/dashboards/policy-initiatives/national-program-for-artificial-intelligence-4541',
          },
        ],
      },
      'body-2': {
        analysisEn:
          'ETH Board (ETH-Rat) is the strategic governance body for the federal institutes of technology system, including ETH Zurich, EPFL, PSI, Empa, Eawag, WSL. AI-related role: approves the federal institutes\' AI strategy, allocates the system-wide CHF 1bn+ AI research budget, oversees Alps supercomputer governance. ETH Board members include former federal councillors, university leaders, and industry executives. Assessment: ETH Board is the Swiss federal-research "central committee" — it has more institutional authority over AI research than SERI does in policy. This is a structural feature unique to Switzerland; Singapore\'s universities operate under MOE / NUS-NTU separately, with no equivalent system-wide governance.',
        analysis:
          'ETH Board（ETH-Rat）是联邦理工系统的战略治理机构，覆盖 ETH Zurich、EPFL、PSI、Empa、Eawag、WSL。AI 相关角色：审议联邦理工系统的 AI 战略、分配系统层 CHF 10 亿+ AI 研究预算、监督 Alps 超算治理。ETH Board 成员含前联邦委员、大学领导、企业高管。判断：ETH Board 是瑞士联邦研究的"中央委员会"——在 AI 研究上比 SERI 在政策上更有制度权威。这是瑞士独有的结构特征；新加坡的大学在 MOE / NUS-NTU 各自下运营，没有同等系统层治理机构。',
        analysisKo:
          'ETH Board(ETH-Rat)는 연방 공대 시스템의 전략 거버넌스 기구로서 ETH Zurich, EPFL, PSI, Empa, Eawag, WSL을 포함합니다. AI 관련 역할: 연방 공대 시스템의 AI 전략 심의, 시스템 차원 CHF 10억+ AI 연구 예산 배분, Alps 슈퍼컴퓨팅 거버넌스 감독. ETH Board 멤버는 전직 연방 위원, 대학 리더, 기업 임원을 포함합니다. 판단: ETH Board는 스위스 연방 연구의 「중앙 위원회」입니다——AI 연구에 있어 정책상 SERI보다 더 큰 제도 권위를 가집니다. 이는 스위스 고유의 구조 특징입니다; 싱가포르의 대학은 MOE / NUS-NTU 각각 아래에서 운영되며, 동등한 시스템 차원 거버넌스 기구가 없습니다.',
        analysisJa:
          'ETH Board（ETH-Rat）は、連邦工科大学システムの戦略的ガバナンス機構で、ETH Zurich、EPFL、PSI、Empa、Eawag、WSLを対象としています。AI関連の役割としては、連邦工科大学システムのAI戦略の審議、システムレベルのCHF 10億以上のAI研究予算の配分、Alpsスーパーコンピューティング統治の監督が挙げられます。ETH Boardのメンバーには、前連邦委員会委員、大学の指導者、企業エグゼクティブが含まれています。評価として、ETH Boardはスイス連邦研究の「中央委員会」であり、AI研究においてはSERIが政策上持つ以上の制度的権威を有しています。これはスイス独有の構造的特性です。シンガポールの大学はMOE / NUS-NTUの下で各自運営されており、同等のシステムレベルのガバナンス機構が存在しません。',
        sources: [
          {
            label: 'Alps 超算公告（ETH Zurich）',
            labelKo: 'Alps 슈퍼컴퓨팅 공고(ETH Zurich)',
            labelJa: 'Alps スーパーコンピュータ公告（ETH Zurich）',
            labelEn: 'Alps supercomputer inauguration (ETH Zurich)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2024/09/press-release-new-research-infrastructure-alps-supercomputer-inaugurated.html',
            date: '2024-09-14',
          },
        ],
      },
      'body-3': {
        analysisEn:
          "FDFA (Federal Department of Foreign Affairs) is Switzerland's diplomatic arm; AI-related role focuses on international AI governance — representing Switzerland at OECD AI Principles, UN AI Advisory Body, G7 GPAI, WEF AI Governance Alliance, ITU AI for Good. FDFA promotes the \"International Geneva\" brand: Geneva as the global AI governance hub. Assessment: FDFA is Switzerland's external soft-power channel for AI. Compared with Singapore's MFA + IMDA dual-channel approach, FDFA carries more diplomatic weight (Switzerland's neutrality is the credibility anchor) but less industry implementation experience. The Geneva-Singapore AI dialogue is consequential for global governance precisely because both bring complementary strengths.",
        analysis:
          'FDFA（联邦外交事务部）是瑞士外交部门；AI 相关角色聚焦国际 AI 治理——代表瑞士参与 OECD AI Principles、UN AI Advisory Body、G7 GPAI、WEF AI Governance Alliance、ITU AI for Good。FDFA 推广"国际日内瓦"品牌：把日内瓦定位为全球 AI 治理枢纽。判断：FDFA 是瑞士对外 AI 软实力通道。相比新加坡 MFA + IMDA 双通道模式，FDFA 外交分量更重（瑞士中立是信任锚），但产业实操经验更少。Geneva-Singapore AI 对话对全球治理重要，正因为两者带来互补优势。',
        analysisKo:
          'FDFA(연방 외교 사무부)는 스위스 외교 부처입니다; AI 관련 역할은 국제 AI 거버넌스에 집중합니다——OECD AI Principles, UN AI Advisory Body, G7 GPAI, WEF AI Governance Alliance, ITU AI for Good에 스위스를 대표하여 참여합니다. FDFA는 「국제 제네바」 브랜드를 홍보합니다: 제네바를 글로벌 AI 거버넌스 허브로 위치시킵니다. 판단: FDFA는 스위스의 대외 AI 소프트파워 채널입니다. 싱가포르의 MFA + IMDA 이중 채널 모델과 비교하면, FDFA의 외교적 분량이 더 큽니다(스위스 중립은 신뢰 앵커), 하지만 산업 실전 경험은 더 적습니다. Geneva-Singapore AI 대화는 글로벌 거버넌스에 중요합니다, 정확히 두 체계가 상호보완적 우위를 가져오기 때문입니다.',
        analysisJa:
          'FDFA（連邦外交事務部）はスイスの外交部門です。AI関連の役割は国際AI治理に焦点を当てています——OECD AI Principles、UN AI Advisory Body、G7 GPAI、WEF AI Governance Alliance、ITU AI for Goodに参加してスイスを代表しています。FDFAは「国際ジュネーブ」というブランドを推進しています：ジュネーブを世界的なAI治理のハブとして位置付けています。判断：FDFAはスイスの対外的なAIソフトパワーのチャネルです。シンガポールのMFA + IMDA二重チャネルモデルと比較すると、FDFAはより大きな外交的な重みがあります（スイスの中立が信頼のアンカーです）が、産業の実務経験はより少ないです。Geneva-Singapore AIダイアログは世界的統治にとって重要です。両者が補完的な優位をもたらすからこそです。',
        sources: [
          {
            label: 'Joint Initiative for Trustworthy AI（含国际治理上下文）',
            labelKo: 'Joint Initiative for Trustworthy AI(국제 거버넌스 맥락 포함)',
            labelJa: 'Joint Initiative for Trustworthy AI（国際ガバナンスの文脈を含む）',
            labelEn: 'Joint Initiative for Trustworthy AI (international governance context)',
            url: 'https://ethz.ch/en/news-and-events/eth-news/news/2023/12/press-release-joint-initiative-for-trustworthy-ai.html',
            date: '2023-12-08',
          },
        ],
      },
    },
  },
  {
    flag: '🇫🇮',
    name: '芬兰',
    nameKo: '핀란드',
    nameJa: 'フィンランド',
    nameEn: 'Finland',
    fullName: '芬兰共和国',
    fullNameKo: '핀란드 공화국',
    fullNameJa: 'フィンランド共和国',
    fullNameEn: 'Republic of Finland',
    overview:
      '芬兰以"Elements of AI"在线课程培训了全国 1% 人口的 AI 素养，是全球 AI 全民教育的先驱。AuroraAI 公民服务平台代表了"以人为本"的 AI 政府服务愿景。',
    overviewKo:
      '핀란드는 「Elements of AI」온라인 과정으로 전국 인구의 1%의 AI 소양을 훈련했으며, 글로벌 AI 전민 교육의 선구자입니다. AuroraAI 시민 서비스 플랫폼은 「인간 중심」의 AI 정부 서비스 비전을 나타냅니다.',
    overviewJa:
      'フィンランドは「Elements of AI」オンラインコースで全国の1%の人口のAIリテラシーを育成し、世界的なAI国民教育のパイオニアです。AuroraAI市民サービスプラットフォームは「人間中心」のAI政府サービスビジョンを体現しています。',
    overviewEn:
      'Finland used the "Elements of AI" online course to train 1% of its population in AI literacy, pioneering global mass AI education. The AuroraAI citizen services platform embodies a "human-centric" vision for AI-powered government services.',
    strategies: [
      {
        name: 'AI Finland',
        nameEn: 'AI Finland',
        year: '2017',
        description: '国家 AI 战略，聚焦全民 AI 素养和企业应用',
        descriptionKo: '국가 AI 전략, 전민 AI 소양 및 기업 응용에 집중',
        descriptionJa: '国家 AI 戦略は、国民全体の AI 素養と企業応用に焦点を当てています',
        descriptionEn: 'National AI strategy focused on mass AI literacy and enterprise adoption',
      },
      {
        name: 'AuroraAI 计划',
        nameKo: 'AuroraAI 계획',
        nameJa: 'AuroraAI 計画',
        nameEn: 'AuroraAI Programme',
        year: '2020',
        description: '基于 AI 的公民生命周期服务平台',
        descriptionKo: 'AI 기반 시민 생명 주기 서비스 플랫폼',
        descriptionJa: 'AI ベースの市民生命周期サービスプラットフォーム',
        descriptionEn: 'AI-powered citizen life-event services platform',
      },
    ],
    investment: [
      {
        item: 'AI 商业计划',
        itemKo: 'AI 비즈니스 계획',
        itemJa: 'AI 事業計画',
        itemEn: 'AI Business Programme',
        amount: '€1 亿+',
        amountKo: '€1억+',
        amountJa: '€1 億+',
        amountEn: '€100 million+',
        note: '推动企业 AI 应用',
        noteKo: '기업 AI 응용 추진',
        noteJa: '企業 AI 応用推進',
        noteEn: 'Drives enterprise AI adoption',
      },
    ],
    governance:
      '芬兰采取人本伦理、价值导向的治理模式，强调 AI 应服务于人的福祉。作为欧盟成员国，积极对齐 EU AI Act。其特色在于将 AI 伦理教育纳入全民素养计划，而非仅依赖法规约束。',
    governanceKo:
      '핀란드는 인본주의 윤리, 가치 지향적인 거버넌스 모델을 채택하고 있으며, AI가 인간의 복지를 위해 봉사해야 한다고 강조합니다. EU 회원국으로서 EU AI Act와의 정렬에 적극적입니다. 그 특징은 AI 윤리 교육을 전국 소양 계획에 통합하는 것입니다, 규제 제약에만 의존하지 않고.',
    governanceJa:
      'フィンランドは人本倫理および価値志向的なガバナンスモデルを採用しており、AIが人間の福祉に奉仕すべきことを強調しています。EU加盟国として、積極的にEU AI Actとの整合を進めています。その特徴は、AI倫理教育を全国市民リテラシー計画に組み込むことであり、単に法規の制約のみに依存するのではないということです。',
    governanceEn:
      'Finland adopts a human-centric, values-driven governance model, emphasising that AI should serve human welfare. As an EU member, it actively aligns with the EU AI Act. Its distinctive trait is embedding AI ethics into mass-literacy programmes rather than relying solely on regulation.',
    keyInitiatives: [
      'Elements of AI 全民课程（覆盖 1% 人口）',
      'AuroraAI 公民生命周期服务',
      'AI Business Finland 企业转型计划',
      'FCAI（芬兰人工智能中心）',
    ],
    keyInitiativesEn: [
      'Elements of AI mass-literacy course (reaching 1% of the population)',
      'AuroraAI citizen life-event services',
      'AI Business Finland enterprise transformation programme',
      'FCAI (Finnish Center for Artificial Intelligence)',
    ],
    strengths: [
      'AI 全民素养教育全球先驱——Elements of AI 已被翻译为 25+ 种语言',
      'AuroraAI 展示了 AI 公共服务的创新模式',
      '高度数字化的社会基础（与新加坡类似）',
      '人本伦理导向，在国际上建立了"负责任 AI"的声誉',
    ],
    strengthsEn: [
      'Global pioneer in mass AI literacy — Elements of AI translated into 25+ languages',
      'AuroraAI demonstrates an innovative model for AI public services',
      'Highly digitalised social foundation (similar to Singapore)',
      'Human-centric ethics orientation has built an international reputation for "responsible AI"',
    ],
    weaknesses: [
      '市场规模小（550 万人口），AI 产业化规模有限',
      '缺乏本土 AI 龙头企业（Nokia 转型后实力下降）',
      '对 EU AI Act 的合规负担可能限制创新灵活性',
      '冬季气候和地理位置不利于吸引亚洲 AI 人才',
    ],
    weaknessesEn: [
      'Small market (5.5 million population); limited AI industrialisation scale',
      'No homegrown AI champion (Nokia diminished after pivoting)',
      'EU AI Act compliance burden may constrain innovation flexibility',
      'Winter climate and geography make it harder to attract Asian AI talent',
    ],
    keyBodies: [
      {
        name: 'MEE（经济事务与就业部）',
        nameKo: 'MEE(경제 사무 및 고용부)',
        nameJa: 'MEE（経済事務・就業省）',
        nameEn: 'MEE (Ministry of Economic Affairs and Employment)',
        role: 'AI 产业政策',
        roleKo: 'AI 산업 정책',
        roleJa: 'AI 産業政策',
        roleEn: 'AI industrial policy',
      },
      {
        name: 'FCAI（芬兰人工智能中心）',
        nameKo: 'FCAI(핀란드 인공지능 센터)',
        nameJa: 'FCAI（フィンランド人工知能センター）',
        nameEn: 'FCAI (Finnish Center for Artificial Intelligence)',
        role: 'AI 研究旗舰',
        roleKo: 'AI 연구 기함',
        roleJa: 'AI 研究旗艦',
        roleEn: 'Flagship AI research centre',
      },
      {
        name: 'DVV（数字与人口数据局）',
        nameKo: 'DVV(디지털 및 인구 데이터 서비스 기구)',
        nameJa: 'DVV（デジタル及び人口データ局）',
        nameEn: 'DVV (Digital and Population Data Services Agency)',
        role: 'AuroraAI 运营',
        roleKo: 'AuroraAI 운영',
        roleJa: 'AuroraAI 運営',
        roleEn: 'Operates AuroraAI',
      },
    ],
    sources: ['Finland AI Strategy（2017/2019 更新）', 'AuroraAI Programme Report', 'Elements of AI 官方统计'],
    sourcesEn: [
      'Finland AI Strategy (2017, updated 2019)',
      'AuroraAI Programme Report',
      'Elements of AI official statistics',
    ],
    drilldownEnrichments: {
      'core-strategy': {
        analysisEn:
          'Finland\'s AI strategy is structured around "AI literacy first + government services + research excellence": (1) AI Finland (2017) was the world\'s first national AI strategy, predating Singapore NAIS 1.0 by two years; (2) the flagship Elements of AI online course was launched 2018 by University of Helsinki + MinnaLearn, set out to train 1% of Finnish population (~55 000 people) and by May 2023 had reached 1 million+ learners across 110+ countries — translated into 26 languages; (3) AuroraAI Programme (2020) operationalises "AI for life events" — citizens get personalised public-service recommendations across life transitions; (4) FCAI (Finnish Center for Artificial Intelligence) anchors academic research at Aalto and Helsinki. Assessment: Finland defined the "AI literacy export" template that Singapore later partly replicated through SkillsFuture AI courses. Finland\'s strategic differentiator is treating AI not as a corporate productivity tool but as a public-good, civic-literacy investment.',
        analysis:
          '芬兰 AI 战略围绕"全民素养优先 + 政府服务 + 研究卓越"展开：(1) AI Finland（2017）是全球首份国家级 AI 战略，比新加坡 NAIS 1.0 早 2 年；(2) 旗舰项目 Elements of AI 在线课程 2018 年由赫尔辛基大学 + MinnaLearn 联合推出，最初目标培训芬兰 1% 人口（~55000 人），到 2023 年 5 月已覆盖 110+ 国家 100 万+ 学员，被翻译为 26 种语言；(3) AuroraAI 计划（2020）把"AI 服务人生节点"运营化——公民在人生过渡期可获得个性化公共服务推荐；(4) FCAI（芬兰人工智能中心）锚定 Aalto + Helsinki 的学术研究。判断：芬兰定义了"AI 素养出口"范式，新加坡后来在 SkillsFuture AI 课程中部分复制。芬兰的战略独特之处是把 AI 当公共物 / 公民素养投资，而不是企业生产力工具。',
        analysisKo:
          '핀란드 AI 전략은 「전민 소양 우선 + 정부 서비스 + 연구 우수성」을 중심으로 전개됩니다: (1) AI Finland(2017)은 글로벌 최초의 국가 수준 AI 전략이며, 싱가포르 NAIS 1.0보다 2년 앞서갑니다; (2) 기함 프로젝트 Elements of AI 온라인 과정은 2018년 헬싱키 대학교 + MinnaLearn이 공동으로 출시했으며, 초기 목표는 핀란드 인구의 1%를 훈련하는 것(~55,000명)이었지만, 2023년 5월까지 110개 국가 이상, 100만 명 이상의 학습자를 포괄하고 있으며, 26개 언어로 번역되었습니다; (3) AuroraAI 계획(2020)은 「AI 인생 전환점 서비스」를 운영화합니다——시민은 인생 전환기에 개인화된 공공 서비스 추천을 받을 수 있습니다; (4) FCAI(핀란드 인공지능 센터)는 Aalto + Helsinki의 학술 연구를 고정시킵니다. 판단: 핀란드는 「AI 소양 수출」 패러다임을 정의했으며, 싱가포르는 이후 SkillsFuture AI 과정에서 부분적으로 복제했습니다. 핀란드 전략의 독특한 점은 AI를 공공재 / 시민 소양 투자로 간주하는 것이지, 기업 생산성 도구가 아니라는 것입니다.',
        analysisJa:
          'フィンランドのAI戦略は「全民素養優先 + 政府サービス + 研究卓越」を中心に展開しています：(1) AI Finland（2017年）は世界初の国家レベルのAI戦略であり、シンガポールのNAIS 1.0より2年早いです；(2) フラッグシップ・プロジェクトの「Elements of AI」オンライン講座は2018年にヘルシンキ大学とMinnaLearnが共同で立ち上げ、初期目標はフィンランド人口の1%（約55,000人）を訓練することでしたが、2023年5月までに110以上の国で100万人以上の学習者に達し、26言語に翻訳されています；(3) AuroraAI計画（2020年）は「AI人生節点サービス」を運用し、市民は人生の転換期に個性化された公共サービス推奨を受けることができます；(4) FCAI（フィンランド人工知能センター）はAaltoとHelsinkiの学術研究を基盤としています。判断：フィンランドは「AI素養輸出」パラダイムを定義しており、シンガポールはその後SkillsFuture AIコースで部分的に複製しました。フィンランド戦略の独自性は、AIを企業の生産性ツールではなく、公共財および市民の素養投資として捉えることにあります。',
        sources: [
          {
            label: 'Elements of AI 官网',
            labelKo: 'Elements of AI 공식 웹사이트',
            labelJa: 'Elements of AI 公式サイト',
            labelEn: 'Elements of AI official site',
            url: 'https://www.elementsofai.com/',
          },
          {
            label: 'Elements of AI 100 万学员里程碑（赫尔辛基大学）',
            labelKo: 'Elements of AI 100만 학습자 마일스톤(헬싱키 대학교)',
            labelJa: 'Elements of AI 100万学員マイルストーン（ヘルシンキ大学）',
            labelEn: 'Elements of AI 1 million learners milestone (University of Helsinki)',
            url: 'https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence',
            date: '2023-05-30',
          },
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'investment-overview': {
        analysisEn:
          "Finland's public AI investment is modest at ~€100m+, primarily through the AI Business Programme run by Business Finland (2018-2022, ~€100m) plus Academy of Finland's FCAI grant (~€10m/year × 8 years = ~€80m through 2026). Plus EU Horizon Europe AI co-funding (~€50m+). Assessment: total public commitment is ~€200-250m — far smaller than Singapore S$2bn+. But Elements of AI's reach (1m+ learners, 26 languages) is a leverage multiplier no spending number captures. Finland exemplifies \"narrative-and-product capital\" — its AI literacy course is a public asset Singapore-style spending could not have produced.",
        analysis:
          '芬兰公开 AI 投资规模约 €1 亿+，主要通过 Business Finland 运营的 AI 商业计划（2018-2022 年，~€1 亿）+ 芬兰科学院 FCAI 资助（每年 ~€1000 万 × 8 年 = 至 2026 年累计 ~€8000 万）。加上 EU Horizon Europe AI 配套（~€5000 万+）。判断：公开总承诺约 €2-2.5 亿——远小于新加坡 S$20 亿+。但 Elements of AI 的影响力（100 万+ 学员、26 种语言）是任何支出数字都捕捉不到的杠杆乘数。芬兰是"叙事 + 产品资本"的典范——AI 素养课程是新加坡式投入无法生产出来的公共资产。',
        analysisKo:
          '핀란드의 공개 AI 투자 규모는 약 €1억+이며, 주로 Business Finland가 운영하는 AI 비즈니스 계획(2018-2022년, ~€1억) + 핀란드 과학원 FCAI 지원(매년 ~€1,000만 × 8년 = 2026년까지 누적 ~€8,000만)을 통합합니다. 더하기 EU Horizon Europe AI 패키지(~€5,000만+). 판단: 공개 총 약정은 약 €2-2.5억——싱가포르 S$20억+보다 훨씬 작습니다. 하지만 Elements of AI의 영향력(100만+ 학습자, 26개 언어)은 어떤 지출 수치도 포착할 수 없는 레버리지 배수입니다. 핀란드는 「서사 + 상품 자본」의 전형입니다——AI 소양 과정은 싱가포르 식 투입이 생산할 수 없는 공공 자산입니다.',
        analysisJa:
          'フィンランドの公開 AI 投資規模は約€1億+で、主に Business Finland が運営する AI ビジネス計画（2018-2022年、~€1億）+ フィンランド科学アカデミー FCAI の助成（毎年 ~€1000万 × 8年 = 2026年までの累計 ~€8000万）です。また EU Horizon Europe AI の連携資金（~€5000万+）があります。判断：公開総公約は約€2-2.5億——シンガポール S$20億+ よりもはるかに小さいです。ただし、Elements of AI の影響力（100万+学員、26言語）は、いかなる支出数字でも捉えることができないレバー乗数です。フィンランドは「叙事 + 産品資本」の典範で——AI リテラシー教育は、シンガポール式投入では生み出せない公共資産です。',
        sources: [
          {
            label: 'Elements of AI 100 万学员（赫尔辛基大学）',
            labelKo: 'Elements of AI 100만 학습자(헬싱키 대학교)',
            labelJa: 'Elements of AI 100万学員（ヘルシンキ大学）',
            labelEn: 'Elements of AI 1 million learners (University of Helsinki)',
            url: 'https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence',
            date: '2023-05-30',
          },
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'governance-model': {
        analysisEn:
          'Finland\'s AI governance is "human-centric ethics + EU alignment + literacy-driven": (1) no standalone AI legislation; (2) compliance with EU AI Act (passed 2024, in force 2026) for high-risk AI categories; (3) Elements of AI doubles as a public ethics literacy programme — citizens trained in basic AI concepts are better equipped to participate in democratic AI governance debates. Assessment: Finland\'s governance model assumes "informed citizens" as the front-line defence against AI risks, supplementing legal regulation with literacy. This is structurally different from Singapore\'s "AI Verify tools + government framework" — Singapore optimises for industry compliance, Finland for democratic resilience. Both models work for small high-trust societies, but neither scales naively to large lower-trust polities.',
        analysis:
          '芬兰 AI 治理是"人本伦理 + EU 对齐 + 素养驱动"：(1) 没有独立 AI 立法；(2) 作为 EU 成员国对高风险 AI 遵守 EU AI Act（2024 通过、2026 生效）；(3) Elements of AI 同时是公共伦理素养计划——受过基本 AI 概念训练的公民更能参与 AI 治理民主辩论。判断：芬兰治理模式假设"知情公民"是 AI 风险的前线防御，用素养补充法律监管。这与新加坡"AI Verify 工具 + 政府框架"结构不同——新加坡为产业合规优化，芬兰为民主韧性优化。两种模式都适合小型高信任社会，但都难以朴素推广到大型低信任政体。',
        analysisKo:
          '핀란드 AI 거버넌스는 "인간중심 윤리 + EU 부응 + 소양 주도"입니다. (1) 독립적인 AI 입법이 없습니다. (2) EU 회원국으로서 고위험 AI에 대해 EU AI Act(2024년 통과, 2026년 시행)를 준수합니다. (3) Elements of AI는 동시에 공공 윤리 소양 계획입니다. 기본 AI 개념 교육을 받은 시민은 AI 거버넌스 민주 토론에 더 잘 참여할 수 있습니다. 판단: 핀란드 거버넌스 모델은 "정보 교육받은 시민"이 AI 위험의 최전선 방어라고 가정하며, 소양으로 법적 규제를 보완합니다. 이는 싱가포르의 "AI Verify 도구 + 정부 프레임워크" 구조와 다릅니다. 싱가포르는 산업 규정 준수 최적화를 위한 것이고, 핀란드는 민주적 회복력 최적화를 위한 것입니다. 두 모델 모두 소규모 고신뢰 사회에 적합하지만, 대규모 저신뢰 정체로 소박하게 확대하기는 어렵습니다.',
        analysisJa:
          'フィンランドの AI ガバナンスは「ヒューマンセンタード倫理 + EU 整合 + リテラシー駆動」です：(1) 独立した AI 法制がありません；(2) EU 加盟国として、高リスク AI に関して EU AI Act（2024 年通過、2026 年発効）を遵守しています；(3) Elements of AI は同時に公共倫理リテラシープログラムでもあります——基本的な AI 概念の訓練を受けた市民は、AI ガバナンスの民主的議論により参加することができます。判断：フィンランドのガバナンスモデルは「インフォームド市民」が AI リスクの最前線防衛であると想定し、リテラシーで法的規制を補完しています。これはシンガポールの「AI Verify ツール + 政府フレームワーク」構造とは異なります——シンガポールは産業コンプライアンス最適化を目指し、フィンランドは民主的レジリエンス最適化を目指しています。両方のモデルとも小規模で信頼度の高い社会に適していますが、どちらも大規模で信頼度の低い政体に素朴に拡大するのは難しいです。',
        sources: [
          {
            label: 'Elements of AI 官网',
            labelKo: 'Elements of AI 공식 웹사이트',
            labelJa: 'Elements of AI 公式サイト',
            labelEn: 'Elements of AI official site',
            url: 'https://www.elementsofai.com/',
          },
        ],
      },
      'comparative-strength': {
        analysisEn:
          'Finland\'s edge over Singapore is "mass AI literacy + first-mover narrative": (1) Elements of AI reached 1m+ learners across 110+ countries — a public-AI-literacy asset Singapore has never produced at comparable scale; (2) AuroraAI demonstrates a "life-event" AI public service model that Singapore LifeSG partly emulates; (3) AI Finland (2017) was the world\'s first national AI strategy, anchoring Finland\'s "first-mover" reputation; (4) FCAI\'s distributed model (Aalto + Helsinki + 7 partners) creates a "federated AI research" template. Weaknesses: small market (5.5m population), no AI champion firm post-Nokia, EU AI Act compliance burden, geographic / climate disadvantage for talent attraction (especially from Asia). Assessment: Finland and Singapore both win as "small high-trust digital societies", but Finland exports through narratives (Elements of AI) and Singapore exports through institutions (SNDGO + IMDA + AISG). The two are natural collaborators in democratic AI governance dialogue.',
        analysis:
          '芬兰相对新加坡的核心杠杆是"全民 AI 素养 + 先发叙事"：(1) Elements of AI 在 110+ 国家覆盖 100 万+ 学员，是新加坡从未在同等规模生产出的公共 AI 素养资产；(2) AuroraAI 展示了"人生节点"AI 公共服务模式，新加坡 LifeSG 部分借鉴；(3) AI Finland（2017）是全球首份国家 AI 战略，奠定芬兰"先发"声誉；(4) FCAI 的分布式模式（Aalto + Helsinki + 7 个合作伙伴）创立"联邦化 AI 研究"范式。短板：市场小（550 万人口）、Nokia 衰退后无 AI 龙头、EU AI Act 合规负担、地理 / 气候不利吸引（尤其亚洲）AI 人才。判断：芬兰与新加坡都是"小型高信任数字社会"赢家，但芬兰靠叙事（Elements of AI）出口，新加坡靠制度（SNDGO + IMDA + AISG）出口。两者是民主 AI 治理对话的天然合作者。',
        analysisKo:
          '핀란드가 싱가포르에 비해 가지는 핵심 레버는 "국민 AI 소양 + 선발주자 서사"입니다. (1) Elements of AI는 110+ 개국에서 100만+ 학습자를 포괄하고 있으며, 이는 싱가포르가 동일한 규모로 생산한 적 없는 공공 AI 소양 자산입니다. (2) AuroraAI는 "인생 전환점" AI 공공 서비스 모델을 보여주며, 싱가포르 LifeSG가 일부 참고했습니다. (3) AI Finland(2017)는 전 지구적 첫 국가 AI 전략으로, 핀란드의 "선발주자" 평판을 정립했습니다. (4) FCAI의 분산형 모델(Aalto + Helsinki + 7개 협력 기관)은 "연방식 AI 연구" 패러다임을 창설했습니다. 단점: 시장이 작음(인구 550만), Nokia 쇠퇴 후 AI 선도 기업이 없음, EU AI Act 규정 준수 부담, 지리적/기후적 불리함이 아시아 AI 인재 유치에 부정적 영향. 판단: 핀란드와 싱가포르는 모두 "소규모 고신뢰 디지털 사회" 승자이지만, 핀란드는 서사(Elements of AI)로 수출하고 싱가포르는 제도(SNDGO + IMDA + AISG)로 수출합니다. 두 나라는 민주적 AI 거버넌스 대화의 자연스러운 협력자입니다.',
        analysisJa:
          'フィンランドのシンガポール相対的なコアレバーは「全民AI素養+ファーストムーバー叙事」です：(1) Elements of AIは110カ国以上で100万人以上の学習者をカバーしており、これはシンガポール同等規模で生産されていない公共AI素養資産です；(2) AuroraAIは「人生の節目」AI公共サービスモデルを示しており、シンガポール LifeSGは一部これを参考にしています；(3) AI Finland（2017）は世界初の国家AI戦略であり、フィンランドの「ファーストムーバー」評判を確立しました；(4) FCAIの分散型モデル（Aalto + Helsinki + 7つのパートナー）は「フェデレーテッドAI研究」パラダイムを創設しました。短所：市場規模が小さい（550万人口）、Nokia衰退後のAIリーダーがない、EU AI Act準拠負担、地理的・気候的に特にアジアからのAI人材誘致に不利。判断：フィンランドとシンガポールの両国は「小規模高信頼デジタル社会」の勝者ですが、フィンランドはナラティブ（Elements of AI）の輸出に依存し、シンガポールは制度（SNDGO + IMDA + AISG）の輸出に依存します。両国は民主的AI統治対話の自然なパートナーです。',
        sources: [
          {
            label: 'Elements of AI 100 万学员（赫尔辛基大学）',
            labelKo: 'Elements of AI 백만 학습자(헬싱키대학교)',
            labelJa: 'Elements of AI 100万学習者（ヘルシンキ大学）',
            labelEn: 'Elements of AI 1 million learners (University of Helsinki)',
            url: 'https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence',
            date: '2023-05-30',
          },
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'strategy-1': {
        analysisEn:
          "AI Finland was launched in 2017 as the world's first national AI strategy, with a 2019 update. Authored by the Ministry of Economic Affairs and Employment (MEE) under the Sipilä government. Three pillars: (1) AI for the public good (mass literacy, government services); (2) AI for enterprise productivity; (3) AI research excellence. Assessment: AI Finland 2017 is foundational for global AI policy because it was the proof-of-concept that a small state can produce a serious AI strategy. Singapore's NAIS 1.0 (2019), Korea's K-AI Strategy (2019), and the UAE's Strategy 2031 (2017) all post-date or share Finland's first-mover spirit. Finland's specific design choice — \"literacy first\" — has not been universally copied, which is interesting evidence that this priority is culturally specific.",
        analysis:
          'AI Finland 2017 年发布，是全球首份国家 AI 战略，2019 年更新。由 MEE（经济事务与就业部）在 Sipilä 政府期间起草。三大支柱：(1) AI for 公共物（全民素养、政府服务）；(2) AI for 企业生产力；(3) AI 研究卓越。判断：AI Finland 2017 是全球 AI 政策的基础性文件——它是"小国可以做严肃 AI 战略"的概念证明。新加坡 NAIS 1.0（2019）、韩国 K-AI Strategy（2019）、UAE Strategy 2031（2017）都发布于 Finland 之后或与之同期。芬兰的特定设计选择——"素养优先"——并未被普遍复制，这是这种优先排序具有文化特殊性的有趣证据。',
        analysisKo:
          'AI Finland은 2017년 발표되었으며, 전 지구적 첫 국가 AI 전략입니다. 2019년에 업데이트되었습니다. MEE(경제업무 및 고용부)가 Sipilä 정부 기간에 수립했습니다. 세 가지 기둥: (1) AI for 공공재(국민 소양, 정부 서비스); (2) AI for 기업 생산성; (3) AI 연구 우수성. 판단: AI Finland 2017은 글로벌 AI 정책의 기초 문서입니다. "소국도 진지한 AI 전략을 수립할 수 있다"는 개념 증명입니다. 싱가포르 NAIS 1.0(2019), 한국 K-AI Strategy(2019), UAE Strategy 2031(2017)은 모두 Finland 이후 또는 동시 발표되었습니다. 핀란드의 특정 설계 선택인 "소양 우선"은 널리 복제되지 않았는데, 이는 이러한 우선순위가 문화적 특수성을 가진다는 흥미로운 증거입니다.',
        analysisJa:
          'AI Finland は 2017 年に発布され、世界で最初の国家 AI 戦略であり、2019 年に更新されました。MEE（経済事務・雇用省）により Sipilä 政権期間中に起草されました。三つの柱：(1) AI for 公共財（全国民の素養、政府サービス）;(2) AI for 企業生産性;(3) AI 研究卓越性。評価：AI Finland 2017 は世界の AI 政策の基礎的文書です——それは「小国が厳肃な AI 戦略を策定できる」ことの概念実証です。シンガポール NAIS 1.0（2019）、韓国 K-AI Strategy（2019）、UAE Strategy 2031（2017）はいずれも Finland の後か同時期に発布されました。フィンランドの特定の設計選択——「素養優先」——は普遍的に複製されませんでした。これはこの優先順序が文化的特殊性を持つ興味深い証拠です。',
        sources: [
          {
            label: 'Elements of AI 官网',
            labelKo: 'Elements of AI 공식 웹사이트',
            labelJa: 'Elements of AI 公式サイト',
            labelEn: 'Elements of AI official site',
            url: 'https://www.elementsofai.com/',
          },
        ],
      },
      'strategy-2': {
        analysisEn:
          'AuroraAI Programme launched in 2020, operated by DVV (Digital and Population Data Services Agency). Vision: "life-event" AI public services — when citizens experience life transitions (graduation, job loss, having a child, retirement), AuroraAI cross-references multiple government agencies to recommend relevant services. Tech stack: federated AI matching across municipal and national service registries. Assessment: AuroraAI is structurally analogous to Singapore LifeSG (life events) but with stronger AI inference layer. The conceptual influence is significant — "AI life events" has become a template for several Nordic and Asian e-government modernisations. AuroraAI\'s actual user adoption metrics are not as publicly compelling as Elements of AI\'s, but the framing matters more than the figures.',
        analysis:
          'AuroraAI 计划 2020 年启动，由 DVV（数字与人口数据局）运营。愿景："人生节点"AI 公共服务——公民经历人生过渡（毕业、失业、生子、退休）时，AuroraAI 跨多个政府机构匹配相关服务推荐。技术栈：跨市级 + 国家级服务注册表的联邦化 AI 匹配。判断：AuroraAI 在结构上类似新加坡 LifeSG（生活事件），但 AI 推理层更强。概念影响巨大——"AI 人生节点"已成为几个北欧和亚洲电子政务现代化的范式。AuroraAI 实际用户采纳指标不如 Elements of AI 那样公开亮眼，但范式比数字更重要。',
        analysisKo:
          'AuroraAI 계획은 2020년 시작되었으며, DVV(디지털 및 인구 데이터청)가 운영합니다. 비전: "인생 전환점" AI 공공 서비스. 시민이 인생 전환(졸업, 실직, 출산, 은퇴)을 경험할 때, AuroraAI는 여러 정부 기관에 걸쳐 관련 서비스 추천을 일치시킵니다. 기술 스택: 도시 수준 + 국가 수준 서비스 레지스트리를 아우르는 분산형 AI 매칭. 판단: AuroraAI는 구조적으로 싱가포르 LifeSG(생활 사건)와 유사하지만, AI 추론 계층이 더 강합니다. 개념적 영향이 매우 큽니다. "AI 인생 전환점"은 여러 북유럽 및 아시아 전자 정부 현대화 패러다임이 되었습니다. AuroraAI의 실제 사용자 채택 지표는 Elements of AI만큼 공개적으로 눈에 띄지 않지만, 플랫폼 패러다임이 숫자보다 중요합니다.',
        analysisJa:
          'AuroraAI プログラムは 2020 年に起動し、DVV（デジタル・人口データ局）により運営されています。ビジョン：「人生上の転機」AI 公共サービス——市民が人生の転機（卒業、失業、出産、定年退職）を経験するとき、AuroraAI は複数の政府機関にまたがって関連するサービス推奨をマッチングします。技術スタック：市レベルおよび国レベルのサービスレジストリを横断するフェデレーション AI マッチング。評価：AuroraAI は構造的にシンガポール LifeSG（生活事件）に類似していますが、AI推論層がより強力です。このコンセプトの影響は莫大です——「AI 人生上の転機」は、北欧およびアジアの複数の電子政府現代化の範式となっています。AuroraAI の実際のユーザー採用指標は Elements of AI ほど公に目立つものではありませんが、パラダイムは数字よりも重要です。',
        sources: [
          {
            label: 'Elements of AI 官网（含 AuroraAI 上下文）',
            labelKo: 'Elements of AI 공식 웹사이트(AuroraAI 맥락 포함)',
            labelJa: 'Elements of AI 公式サイト（AuroraAI コンテキスト含む）',
            labelEn: 'Elements of AI official site (AuroraAI context)',
            url: 'https://www.elementsofai.com/',
          },
        ],
      },
      'investment-1': {
        analysisEn:
          'AI Business Programme is run by Business Finland with €100m+ over 2018-2022. Mechanism: matching grants to Finnish SMEs and corporates to adopt AI; co-financing with private capital. Reach: ~600 companies received support, ~5 000 jobs created or retained. Assessment: €100m / 4 years is small relative to Korea or UAE but high in per-firm terms (~€170k average). The programme\'s distinctive feature is integrating AI adoption with broader "4th industrial revolution" framing rather than treating AI as a stand-alone technology — this matches the Finnish industrial structure (mid-tier manufacturing + strong forestry / paper / metallurgy sectors that benefit from applied AI more than from frontier model R&D).',
        analysis:
          'AI 商业计划由 Business Finland 运营，2018-2022 年累计 €1 亿+。机制：对芬兰中小企业和大公司提供配套资助以采用 AI；与私部门资本共投。覆盖：~600 家公司获支持、~5000 个岗位被创造或保留。判断：€1 亿 / 4 年相对韩国或 UAE 较小，但人均较高（每家公司平均 ~€17 万）。该计划的独特之处是把 AI 采用整合进更广义的"第四次工业革命"叙事，而不是把 AI 当独立技术——这与芬兰产业结构匹配（中端制造 + 强大林木 / 造纸 / 冶金部门，从应用 AI 受益多于前沿模型 R&D）。',
        analysisKo:
          'AI 상업 계획은 Business Finland이 운영하며, 2018-2022년 누적 €1억+ 규모입니다. 메커니즘: 핀란드 중소기업 및 대기업에 AI 채택을 위한 매칭 지원을 제공하며, 민간 자본과 함께 투자합니다. 커버리지: 약 600개 회사가 지원을 받았으며, 약 5,000개의 일자리가 창출되거나 보존되었습니다. 판단: €1억/4년은 한국이나 UAE에 비해 작지만 1인당 규모가 더 높습니다(회사당 평균 약 €17만). 이 계획의 독특한 점은 AI 채택을 4차 산업혁명이라는 더 광범위한 서사에 통합한다는 것입니다. AI를 독립적인 기술로 취급하는 것이 아닙니다. 이는 핀란드 산업 구조와 일치합니다(중기 제조 + 강대한 임목/제지/야금 부문이 최첨단 모델 R&D보다 AI 적용에서 더 많은 이득을 봅니다).',
        analysisJa:
          'AI ビジネスプログラムは Business Finland が運営し、2018～2022 年に累計 €1 億以上を投入しました。メカニズム：フィンランドの中小企業と大企業に対する AI 導入を支援するマッチング助成金を提供し、民間セクター資本と共同投資します。対象規模：約 600 社がサポートを受け、約 5,000 の職が創出または保持されました。評価：€1 億 / 4 年は韓国または UAE と比較すると相対的に小さいですが、1 社あたりの平均額は高い（1 社平均で約 €17 万）です。本計画の独自な点は、AI 採用をより広い 「第四次産業革命」 というナラティブに統合することであり、AI を独立した技術として扱うのではなく――これはフィンランドの産業構造と合致しています（中堅製造業 + 強力な林業 / 製紙 / 冶金部門が、最先端モデルの R&D よりも応用 AI からより多くのメリットを得る）。',
        sources: [
          {
            label: 'MinnaLearn（含 Business Finland 合作）',
            labelKo: 'MinnaLearn(Business Finland 협력 포함)',
            labelJa: 'MinnaLearn（Business Finland との協力を含む）',
            labelEn: 'MinnaLearn (Business Finland partnership context)',
            url: 'https://www.minnalearn.com/',
          },
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'initiative-1': {
        analysisEn:
          'Elements of AI is the global benchmark for mass AI literacy. Created by University of Helsinki + MinnaLearn in 2018, originally targeting 1% of Finnish population (~55 000 people). By May 2023: 1 million+ learners enrolled across 110+ countries; translated into 26 languages; localised in 30 countries with university partners. Course design: ~30 hours total, basic ML / neural networks / philosophy / problem-solving / societal implications. Free for all, with University of Helsinki ECTS credit. Assessment: Elements of AI is the most replicable AI public-good asset of the 2020s — it required modest investment (~€2-3m initial development) but scaled globally because its approach matched what learners actually needed: low barrier, explanatory, no math gatekeeping. The question for Singapore is whether SkillsFuture or AISG can produce a comparable export — so far, no.',
        analysis:
          'Elements of AI 是全球大众 AI 素养基准。2018 年由赫尔辛基大学 + MinnaLearn 创建，最初目标芬兰 1% 人口（~55000 人）。到 2023 年 5 月：覆盖 110+ 国家 100 万+ 学员、翻译为 26 种语言、在 30 个国家与本地大学合作本地化。课程设计：约 30 小时总时长，覆盖基础 ML / 神经网络 / 哲学 / 问题解决 / 社会影响。全免费，赫尔辛基大学发 ECTS 学分。判断：Elements of AI 是 2020 年代最具可复制性的 AI 公共物——前期投入不大（~€200-300 万初始开发）但全球扩展，因为方法匹配学习者真正需要的：低门槛、解释性、不设数学壁垒。新加坡 SkillsFuture / AISG 能否产出可比的出口型资产？目前还没有。',
        analysisKo:
          'Elements of AI는 전 지구적 대중 AI 소양 기준입니다. 2018년 헬싱키대학교 + MinnaLearn이 창설했으며, 초기 목표는 핀란드 인구의 1%(약 5만 5천명)이었습니다. 2023년 5월 현재: 110+ 개국 100만+ 학습자를 포괄하고, 26개 언어로 번역되었으며, 30개국에서 현지 대학과 협력하여 현지화되었습니다. 코스 설계: 약 30시간의 총 소요 시간으로 기초 ML/신경망/철학/문제 해결/사회적 영향을 다룹니다. 완전히 무료이며, 헬싱키대학교가 ECTS 학점을 발급합니다. 판단: Elements of AI는 2020년대 가장 재현 가능한 AI 공공재입니다. 초기 투자가 크지 않음(약 €200-300만의 초기 개발)이지만 글로벌 확장에 성공했습니다. 방법이 학습자의 실제 필요와 일치하기 때문입니다: 낮은 진입장벽, 해석 가능성, 수학 장벽이 없습니다. 싱가포르 SkillsFuture / AISG가 동등한 수출형 자산을 생산할 수 있을까요? 현재로서는 그렇지 않습니다.',
        analysisJa:
          'Elements of AIは、グローバルな一般向けAIリテラシー基準です。2018年にヘルシンキ大学とMinnaLearnによって創設され、当初のターゲットはフィンランド人口の1%（約55,000人）でした。2023年5月までに、110か国以上、100万人以上の学生に到達し、26言語に翻訳され、30か国で現地大学とのパートナーシップにより現地化されました。コース設計：約30時間の総学習時間で、基礎ML/ニューラルネットワーク/哲学/問題解決/社会的影響をカバーしています。完全に無料で、ヘルシンキ大学がECTS単位を授与します。考察：Elements of AIは、2020年代で最も再現可能性の高いAIパブリックグッドです。初期投資はそこまで大きくない（初期開発に約200〜300万ユーロ）にもかかわらず世界的に拡大しました。それは、そのアプローチが学習者が本当に必要とするものと合致しているからです。つまり、低いハードル、解釈可能性、数学的な壁がないということです。シンガポールSkillsFuture/AISGは、同等の輸出型資産を生み出すことができるのか？現在のところ、まだできていません。',
        sources: [
          {
            label: 'Elements of AI 官网',
            labelKo: 'Elements of AI 공식 웹사이트',
            labelJa: 'Elements of AI 公式サイト',
            labelEn: 'Elements of AI official site',
            url: 'https://www.elementsofai.com/',
          },
          {
            label: 'Elements of AI 100 万学员（赫尔辛基大学）',
            labelKo: 'Elements of AI 백만 학습자(헬싱키대학교)',
            labelJa: 'Elements of AI 100万学習者（ヘルシンキ大学）',
            labelEn: 'Elements of AI 1 million learners (University of Helsinki)',
            url: 'https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence',
            date: '2023-05-30',
          },
          {
            label: 'MinnaLearn 官网（合作运营商）',
            labelKo: 'MinnaLearn 공식 웹사이트(협력 운영자)',
            labelJa: 'MinnaLearn 公式サイト（協力運営者）',
            labelEn: 'MinnaLearn (co-operator)',
            url: 'https://www.minnalearn.com/',
          },
        ],
      },
      'initiative-2': {
        analysisEn:
          "AuroraAI citizen life-event services launched 2020 by DVV. The platform matches citizens with relevant public services at life transitions — graduation, job change, having a child, retirement. Cross-references municipal-level + national-level service registries via federated AI inference. Open-source components are published on GitHub. Assessment: AuroraAI is structurally similar to Singapore LifeSG but with stronger semantic-matching layer. Real adoption is not at Elements of AI's million-scale, but the platform's API design is referenced internationally — Iceland, Estonia, and parts of the Korean local government have explored AuroraAI-style approaches.",
        analysis:
          'AuroraAI 公民生命周期服务 2020 年由 DVV 启动。平台在公民人生过渡时（毕业、换工作、生子、退休）匹配相关公共服务，跨市级 + 国家级服务注册表通过联邦化 AI 推理。开源组件发布到 GitHub。判断：AuroraAI 在结构上与新加坡 LifeSG 类似，但语义匹配层更强。实际采纳未到 Elements of AI 的百万规模，但平台 API 设计在国际上被引用——冰岛、爱沙尼亚、韩国部分地方政府已探索 AuroraAI 风格方法。',
        analysisKo:
          'AuroraAI 시민 생명주기 서비스는 2020년 DVV가 시작했습니다. 플랫폼은 시민의 인생 전환기(졸업, 직업 변경, 출산, 은퇴)에 관련 공공 서비스를 일치시키며, 도시 수준 + 국가 수준 서비스 레지스트리를 아우르는 분산형 AI 추론을 통해 이루어집니다. 오픈소스 구성 요소는 GitHub에 발표됩니다. 판단: AuroraAI는 구조적으로 싱가포르 LifeSG와 유사하지만, 의미 매칭 계층이 더 강합니다. 실제 채택은 Elements of AI의 백만 규모에 도달하지 못했지만, 플랫폼 API 설계는 국제적으로 인용됩니다. 아이슬란드, 에스토니아, 한국의 일부 지방 정부가 이미 AuroraAI 스타일 접근법을 탐색했습니다.',
        analysisJa:
          'AuroraAI の市民ライフサイクルサービスは 2020 年に DVV によって開始されました。プラットフォームは市民の人生の転機（卒業、転職、出産、退職）で関連公共サービスをマッチングし、フェデレーション化された AI 推論を通じて市・国家レベルのサービスレジストリを横断します。オープンソースコンポーネントは GitHub で公開されています。判断：AuroraAI は構造的にシンガポール LifeSG と同様ですが、セマンティック・マッチング層がより強力です。実際の採用は Elements of AI の百万規模には至っていませんが、プラットフォーム API の設計は国際的に引用されており、アイスランド、エストニア、韓国の一部地方政府が既に AuroraAI 風のアプローチを探索しています。',
        sources: [
          {
            label: 'Elements of AI 官网（含 AuroraAI 上下文）',
            labelKo: 'Elements of AI 공식 웹사이트(AuroraAI 맥락 포함)',
            labelJa: 'Elements of AI 公式サイト（AuroraAI コンテキストを含む）',
            labelEn: 'Elements of AI official site (AuroraAI context)',
            url: 'https://www.elementsofai.com/',
          },
        ],
      },
      'initiative-3': {
        analysisEn:
          "AI Business Finland enterprise transformation programme runs ~€100m+ over 2018-2022 with continuation lines into 2024-2025. Mechanism: matching grants to Finnish firms (especially SMEs) for AI integration; covers strategy consulting, PoC funding, scale-up support. Reach: ~600 firms supported, ~5 000 jobs impacted. Assessment: programme is not a unicorn-builder but a productivity-broadener — it raises the bottom of Finnish SMEs' AI capability without creating concentrated winners. Compared with Singapore's AI Apprenticeship Programme + AI startup grants, Business Finland's approach is more conservative (favours adoption over creation).",
        analysis:
          'AI Business Finland 企业转型计划 2018-2022 年累计 €1 亿+，2024-2025 有续期条线。机制：对芬兰公司（尤其 SME）AI 集成提供配套资助；含战略咨询、PoC 资助、规模化支持。覆盖：~600 家公司获支持、~5000 个岗位受影响。判断：不是独角兽制造者而是"普及生产力"——提高芬兰 SME AI 能力的底盘，但不创造集中赢家。相比新加坡 AI Apprenticeship + AI 创业资助，Business Finland 路径更保守（偏采用而非创造）。',
        analysisKo:
          'AI Business Finland 기업 전환 계획은 2018-2022년 누적 €1억+ 규모이며, 2024-2025년 기간 연장 조항이 있습니다. 메커니즘: 핀란드 회사(특히 중소기업)의 AI 통합에 매칭 지원을 제공하며, 전략 컨설팅, PoC 지원, 확장 지원을 포함합니다. 커버리지: 약 600개 회사가 지원을 받았으며, 약 5,000개의 일자리가 영향을 받았습니다. 판단: 유니콘 제조자가 아니라 "생산성 보급"입니다. 핀란드 중소기업의 AI 능력 기반을 향상시키지만, 집중된 승자를 만들지는 않습니다. 싱가포르의 AI Apprenticeship + AI 창업 지원과 비교하면, Business Finland 경로는 더 보수적입니다(창조가 아닌 채택에 치우침).',
        analysisJa:
          'AI Business Finland の企業変革計画は 2018-2022 年に累積 €1 億+ を投入し、2024-2025 年に継続予定があります。メカニズム：フィンランド企業（特に SME）の AI 統合に対して総合的な支援を提供しており、戦略的コンサルティング、PoC 支援、スケーリング支援を含みます。対象：約 600 社の企業が支援を受け、約 5000 職が影響を受けています。評価：これはユニコーン製造者ではなく「生産性の普及」です――フィンランド SME の AI 能力の基盤を高めるものですが、集中した勝者は生み出しません。シンガポール の AI Apprenticeship + AI 起業支援と比較すると、Business Finland のアプローチはより保守的です（採用に偏り、創造ではなく）。',
        sources: [
          {
            label: 'MinnaLearn（含 Business Finland 合作上下文）',
            labelKo: 'MinnaLearn(Business Finland 협력 맥락 포함)',
            labelJa: 'MinnaLearn（Business Finland との協力を含む）',
            labelEn: 'MinnaLearn (Business Finland partnership context)',
            url: 'https://www.minnalearn.com/',
          },
        ],
      },
      'initiative-4': {
        analysisEn:
          "FCAI (Finnish Center for Artificial Intelligence) is the Academy of Finland's AI Flagship, anchored at Aalto + Helsinki universities with 7 partner institutions. Founded 2018, with cumulative budget ~€80m through 2026. Research priorities: probabilistic ML, AI4Science, simulation-based inference, NLP for low-resource languages. FCAI Education programmes train ~500 PhDs and postdocs over the cycle. Assessment: FCAI's model — flagship distributed across multiple universities — proves that AI research excellence does not require concentration. This is structurally important for small states because it avoids \"single-institution capture\". Singapore's AISG model leans toward the opposite: anchor heavily at NUS + NTU.",
        analysis:
          'FCAI（芬兰人工智能中心）是芬兰科学院 AI 旗舰项目，锚定 Aalto + Helsinki 大学并含 7 个合作机构。2018 年成立，至 2026 年累计预算 ~€8000 万。研究重点：概率 ML、AI4Science、基于模拟的推理、低资源语言 NLP。FCAI 教育项目周期内培养约 500 名 PhD + 博士后。判断：FCAI 模式——旗舰分布在多所大学——证明 AI 研究卓越不需要集中。这对小国结构性重要，避免"单一机构俘获"。新加坡 AISG 模式偏向相反：重锚 NUS + NTU。',
        analysisKo:
          'FCAI(핀란드인공지능센터)는 핀란드 과학원의 AI 플래그십 프로젝트이며, Aalto 및 Helsinki 대학에 정박되고 7개의 협력 기관을 포함합니다. 2018년 설립되었으며, 2026년까지 누적 예산은 약 €8,000만입니다. 연구 초점: 확률 ML, AI4Science, 시뮬레이션 기반 추론, 저자원 언어 NLP. FCAI 교육 프로젝트 기간 내 약 500명의 PhD 및 박사후연구원을 배출합니다. 판단: FCAI 모델(플래그십이 여러 대학에 분산됨)은 AI 연구 우수성이 집중을 필요로 하지 않음을 입증합니다. 이는 소국의 구조상 중요하며, "단일 기관 포획"을 방지합니다. 싱가포르 AISG 모델은 반대입니다: NUS + NTU를 중심 앵커로 합니다.',
        analysisJa:
          'FCAI（フィンランド人工知能センター）はフィンランド学術アカデミーのAIフラッグシップ事業で、Aalto大学とHelsinki大学をアンカーとし、7つの協力機関を含んでいます。2018年に設立され、2026年までの累計予算は約8000万ユーロです。研究の重点は、確率的機械学習、AI4Science、シミュレーションベースの推論、低リソース言語NLPです。FCAI教育プログラムはプログラム期間内に約500人のPhD+ポスドクを育成します。判断：FCAIモデル——フラッグシップが複数の大学に分散している——はAI研究の卓越性が集中を必要としないことを証明しています。これは小国にとって構造的に重要で、「単一機関による支配」を回避しています。シンガポールのAISGモデルは反対方向に傾いており、NUS+NTUに重点的にアンカーしています。',
        sources: [
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'body-1': {
        analysisEn:
          "MEE (Ministry of Economic Affairs and Employment) is Finland's lead ministry for AI policy. AI-related functions: (1) authorship of AI Finland (2017, updated 2019); (2) overseeing Business Finland (the AI Business Programme operator); (3) coordinating with EU on AI industrial policy. Assessment: MEE plays an SNDGO-like coordinator role but with smaller staffing and broader responsibilities. Its strength is integration with industrial policy; its weakness is dispersed focus (AI competes with broader productivity, energy transition, manufacturing competitiveness on MEE's agenda).",
        analysis:
          'MEE（经济事务与就业部）是芬兰 AI 政策主管部门。AI 相关职能：(1) AI Finland（2017、2019 更新）的起草；(2) 监督 Business Finland（AI 商业计划运营方）；(3) 与 EU 在 AI 产业政策上协调。判断：MEE 在职能上类似 SNDGO 协调者角色，但人员规模小、责任面更广。优势是与产业政策的整合度；劣势是焦点分散（AI 与更广义的生产力、能源转型、制造竞争力在 MEE 议程上竞争）。',
        analysisKo:
          'MEE(경제업무 및 고용부)는 핀란드의 AI 정책 주무 부서입니다. AI 관련 기능: (1) AI Finland(2017, 2019 업데이트) 수립; (2) Business Finland(AI 상업 계획 운영자) 감독; (3) AI 산업 정책상 EU와 조율. 판단: MEE는 기능상 SNDGO 조율자 역할과 유사하지만, 인원 규모가 작고 책임 범위가 더 넓습니다. 장점은 산업 정책과의 통합도입니다. 단점은 초점이 분산되어 있다는 것입니다(AI와 보다 광의의 생산성, 에너지 전환, 제조 경쟁력이 MEE 의제상에서 경쟁합니다).',
        analysisJa:
          'MEE（経済事務・雇用省）はフィンランドの AI 政策主管部門です。AI 関連職能：(1) AI Finland（2017年、2019年更新）の起案；(2) Business Finland（AI ビジネスプラン運営者）の監督；(3) EU との AI 産業政策上の協調。評価：MEE は職能上 SNDGO の協調者役割に類似していますが、人員規模が小さく、責任範囲はより広いです。優位性は産業政策との統合度にあり、劣位性はフォーカス分散（AI がより広義の生産性、エネルギー転換、製造競争力と MEE のアジェンダ上で競争）にあります。',
        sources: [
          {
            label: 'MinnaLearn（含 MEE / Business Finland 合作）',
            labelKo: 'MinnaLearn(MEE / Business Finland 협력)',
            labelJa: 'MinnaLearn（MEE / Business Finland との協業を含む）',
            labelEn: 'MinnaLearn (MEE / Business Finland context)',
            url: 'https://www.minnalearn.com/',
          },
        ],
      },
      'body-2': {
        analysisEn:
          "FCAI (Finnish Center for Artificial Intelligence) is the flagship AI research centre, hosted by Aalto and Helsinki universities under Academy of Finland funding. Founded 2018, FCAI's distributed model includes 7 partner institutions and ~150 senior researchers. Functions: research execution, PhD training, public outreach (Elements of AI is partly attributed to the FCAI ecosystem), international collaborations (ELLIS network, EuroHPC). Assessment: FCAI is the operational research hub of Finland's AI strategy — its existence converts policy intent into actual papers, talent, and exportable assets. Without FCAI, Finland's AI strategy would be much more about literacy and government services and less about research depth.",
        analysis:
          'FCAI（芬兰人工智能中心）是芬兰旗舰 AI 研究中心，由 Aalto + Helsinki 大学主办、芬兰科学院资助。2018 年成立，FCAI 分布式模式含 7 个合作机构、~150 名高级研究员。职能：研究执行、PhD 培养、公共传播（Elements of AI 部分归因于 FCAI 生态）、国际合作（ELLIS 网络、EuroHPC）。判断：FCAI 是芬兰 AI 战略的运营层研究枢纽——它的存在把政策意图转化为论文、人才、可出口资产。没有 FCAI，芬兰 AI 战略会更偏向素养 + 政府服务而较少研究深度。',
        analysisKo:
          'FCAI(핀란드인공지능센터)는 핀란드 플래그십 AI 연구 센터이며, Aalto 및 Helsinki 대학이 주최하고 핀란드 과학원이 자금을 지원합니다. 2018년 설립되었으며, FCAI의 분산형 모델은 7개의 협력 기관과 약 150명의 선임 연구원을 포함합니다. 기능: 연구 실행, PhD 양성, 공공 커뮤니케이션(Elements of AI는 부분적으로 FCAI 생태계에 귀속됨), 국제 협력(ELLIS 네트워크, EuroHPC). 판단: FCAI는 핀란드 AI 전략의 운영 계층 연구 허브입니다. 정책 의도를 논문, 인재, 수출 가능한 자산으로 변환합니다. FCAI가 없었다면, 핀란드 AI 전략은 소양 + 정부 서비스에 더 치우치고 연구 깊이는 더 낮았을 것입니다.',
        analysisJa:
          'FCAI（フィンランド人工知能センター）はフィンランドのフラッグシップ AI 研究センターで、Aalto 大学および Helsinki 大学が主催し、フィンランド科学アカデミーが資金提供しています。2018 年に設立され、FCAI の分散型モデルは 7 つの協力機関と約 150 人のシニア研究員を含んでいます。機能：研究実行、PhD の育成、公開コミュニケーション（Elements of AI の一部は FCAI エコシステムに由来）、国際協力（ELLIS ネットワーク、EuroHPC）。判断：FCAI はフィンランド AI 戦略の運営層の研究ハブです——その存在は政策的意図を論文、人材、輸出可能な資産に変えています。FCAI がなければ、フィンランド AI 戦略はリテラシーと政府サービスに偏り、研究の深さに欠けるでしょう。',
        sources: [
          {
            label: 'FCAI 官网',
            labelKo: 'FCAI 공식 웹사이트',
            labelJa: 'FCAI 公式サイト',
            labelEn: 'FCAI official site',
            url: 'https://fcai.fi/',
          },
        ],
      },
      'body-3': {
        analysisEn:
          'DVV (Digital and Population Data Services Agency) operates AuroraAI and other AI-powered government services. AI-related functions: (1) AuroraAI platform operations; (2) digital identity authentication for AI-based services; (3) coordinating municipal-level AI service deployments. Assessment: DVV is closer to Singapore GovTech than to MEE — execution-focused, technical agency that runs AI in production. The Finland-Singapore comparison is interesting: Finland\'s DVV runs fewer AI services than Singapore GovTech but has stronger "life-event" semantic matching infrastructure. Each country could borrow what the other does well.',
        analysis:
          'DVV（数字与人口数据局）运营 AuroraAI 等 AI 驱动政府服务。AI 相关职能：(1) AuroraAI 平台运营；(2) 基于 AI 服务的数字身份认证；(3) 协调市级 AI 服务部署。判断：DVV 更接近新加坡 GovTech 而非 MEE——以执行为焦点、运行生产 AI 的技术机构。芬兰-新加坡对比有趣：芬兰 DVV 运行的 AI 服务数量比新加坡 GovTech 少，但"人生节点"语义匹配基础设施更强。两国可互相借鉴对方的强项。',
        analysisKo:
          'DVV(디지털 및 인구 데이터청)는 AuroraAI 등 AI 기반 정부 서비스를 운영합니다. AI 관련 기능: (1) AuroraAI 플랫폼 운영; (2) AI 기반 서비스의 디지털 신원 인증; (3) 도시 수준 AI 서비스 배포 조율. 판단: DVV는 MEE보다는 싱가포르의 GovTech에 더 가깝습니다. 실행을 중심으로 하며, AI를 운영하는 기술 기관입니다. 핀란드-싱가포르 비교는 흥미롭습니다: DVV가 운영하는 AI 서비스 수는 싱가포르 GovTech보다 적지만, "인생 전환점" 의미 매칭 기초 설비는 더 강합니다. 두 국가는 서로의 강점을 배울 수 있습니다.',
        analysisJa:
          'DVV（デジタル・人口データ局）は AuroraAI など AI 駆動政府サービスを運営しています。AI 関連職能：(1) AuroraAI プラットフォーム運営；(2) AI サービスに基づくデジタル身分認証；(3) 市レベルの AI サービス展開の調整。判断：DVV はシンガポール GovTech に近く、MEE ではありません——実行を焦点とした、本番 AI を運行する技術機関です。フィンランド-シンガポール 比較は興味深いです：フィンランド DVV が運行する AI サービスの数はシンガポール GovTech より少ないですが、「人生節点」意味マッチング基盤施設はより強いです。両国は互いに相手方の強みから学ぶことができます。',
        sources: [
          {
            label: 'Elements of AI 官网（含 AuroraAI 上下文）',
            labelKo: 'Elements of AI 공식 웹사이트(AuroraAI 맥락 포함)',
            labelJa: 'Elements of AI 公式サイト（AuroraAI コンテキストを含む）',
            labelEn: 'Elements of AI official site (AuroraAI context)',
            url: 'https://www.elementsofai.com/',
          },
        ],
      },
    },
  },
  {
    flag: '🇨🇦',
    name: '加拿大',
    nameKo: '캐나다',
    nameJa: 'カナダ',
    nameEn: 'Canada',
    fullName: '加拿大',
    fullNameKo: '캐나다',
    fullNameJa: 'カナダ',
    fullNameEn: 'Canada',
    overview:
      '加拿大是深度学习的发源地（Hinton、Bengio），拥有 Mila、Vector Institute、Amii 三大世界级 AI 研究所。2024 年联邦预算追加 CAD $24 亿 AI 投资，但 AIDA 立法法案未能通过，治理框架仍以自愿准则为主。',
    overviewKo:
      '캐나다는 딥러닝의 발상지(Hinton, Bengio)로 Mila, Vector Institute, Amii 세 개의 세계적 수준 AI 연구소를 보유하고 있습니다. 2024년 연방 예산에 CAD 24억 달러의 AI 투자를 추가 배정했으나, AIDA 입법안은 통과하지 못했으며, 거버넌스 프레임워크는 여전히 자발적 원칙을 중심으로 하고 있습니다.',
    overviewJa:
      'カナダは深層学習の発祥地（Hinton、Bengio）であり、Mila、Vector Institute、Amii という 3 つの世界的な AI 研究所を擁しています。2024 年の連邦予算で CAD $24 億の AI 投資が追加されましたが、AIDA 立法法案は可決されず、ガバナンス枠組みは依然として自発的ガイドラインが主体です。',
    overviewEn:
      'Canada is the birthplace of deep learning (Hinton, Bengio) and home to three world-class AI institutes — Mila, Vector Institute and Amii. The 2024 federal budget added CAD $2.4 billion in AI investment, but the AIDA legislation failed to pass, leaving governance reliant on voluntary codes.',
    strategies: [
      {
        name: '泛加拿大 AI 战略',
        nameKo: '팬-캐나다 AI 전략',
        nameJa: 'パン・カナダ AI 戦略',
        nameEn: 'Pan-Canadian AI Strategy',
        year: '2017',
        description: '全球首个国家级 AI 战略，投资三大研究所',
        descriptionKo: '전 세계 최초의 국가 차원 AI 전략, 세 개의 주요 연구소에 투자',
        descriptionJa: '世界初の国家レベル AI 戦略、3つの主要研究機関への投資',
        descriptionEn: "World's first national-level AI strategy; funded the three major institutes",
      },
      {
        name: '泛加拿大 AI 战略 2.0',
        nameKo: '팬-캐나다 AI 전략 2.0',
        nameJa: '汎カナダ AI 戦略 2.0',
        nameEn: 'Pan-Canadian AI Strategy 2.0',
        year: '2024',
        description: 'CAD $24 亿续期，增加算力与商业化',
        descriptionKo: 'CAD 24억 달러 연장, 컴퓨팅 파워 및 상용화 확대',
        descriptionJa: 'CAD $24 億の継続、計算能力の増加と商用化',
        descriptionEn: 'CAD $2.4 billion renewal, adding compute and commercialisation',
      },
    ],
    investment: [
      {
        item: '2024 联邦 AI 预算',
        itemKo: '2024년 연방 AI 예산',
        itemJa: '2024 連邦 AI 予算',
        itemEn: '2024 Federal AI Budget',
        amount: 'CAD $24 亿',
        amountKo: 'CAD 24억 달러',
        amountJa: 'CAD $24億',
        amountEn: 'CAD $2.4 billion',
        note: '含算力、安全、人才、商业化',
        noteKo: '컴퓨팅 파워, 보안, 인재, 상용화 포함',
        noteJa: '算力、安全、人材、商業化',
        noteEn: 'Covers compute, safety, talent and commercialisation',
      },
      {
        item: '主权算力投资',
        itemKo: '주권 컴퓨팅 파워 투자',
        itemJa: '主権算力投資',
        itemEn: 'Sovereign Compute Investment',
        amount: 'CAD $10 亿',
        amountKo: 'CAD 10억 달러',
        amountJa: 'CAD $10 億',
        amountEn: 'CAD $1 billion',
        note: '国家级 AI 计算基础设施',
        noteKo: '국가 차원의 AI 컴퓨팅 인프라',
        noteJa: '国家級 AI 計算基盤',
        noteEn: 'National-level AI compute infrastructure',
      },
    ],
    governance:
      '加拿大 AI 治理以自愿行为准则为主，拟议中的 AIDA（人工智能与数据法案）随国会解散而搁置。加拿大通过 CAISI（加拿大 AI 安全研究所）聚焦前沿 AI 安全研究，在全球 AI 安全治理中发挥重要作用。',
    governanceKo:
      '캐나다 AI 거버넌스는 자발적 행동 규범을 중심으로 합니다. 제안된 AIDA(인공지능 및 데이터법)는 국회 해산과 함께 보류되었습니다. 캐나다는 CAISI(캐나다 AI 안전 연구소)를 통해 최첨단 AI 안전 연구에 집중하며, 글로벌 AI 안전 거버넌스에서 중요한 역할을 수행합니다.',
    governanceJa:
      'カナダの AI ガバナンスは自発的な行動規範を主としており、提案中の AIDA（人工知能およびデータ法案）は議会の解散に伴い棚上げになりました。カナダは CAISI（カナダ AI 安全研究所）を通じて先端 AI 安全研究に注力し、グローバル AI 安全ガバナンスにおいて重要な役割を発揮しています。',
    governanceEn:
      'Canadian AI governance relies primarily on voluntary codes; the proposed AIDA (Artificial Intelligence and Data Act) was shelved when Parliament was dissolved. Canada concentrates on frontier AI safety research through CAISI (Canadian AI Safety Institute) and plays a significant role in global AI safety governance.',
    keyInitiatives: [
      'Mila（蒙特利尔学习算法研究所，Bengio 领导）',
      'Vector Institute（多伦多，Hinton 创立）',
      'Amii（阿尔伯塔机器智能研究所）',
      'CAISI（加拿大 AI 安全研究所）',
      'CAD $10 亿主权算力计划',
    ],
    keyInitiativesEn: [
      'Mila (Montréal Institute for Learning Algorithms, led by Bengio)',
      'Vector Institute (Toronto, founded by Hinton)',
      'Amii (Alberta Machine Intelligence Institute)',
      'CAISI (Canadian AI Safety Institute)',
      'CAD $1 billion sovereign compute programme',
    ],
    strengths: [
      '深度学习发源地——Bengio、Hinton 的学术遗产',
      '三大世界级 AI 研究所形成人才培养网络',
      '在 AI 安全与伦理研究上全球领先（CAISI）',
      '全球首个国家 AI 战略（2017），先发优势明显',
    ],
    strengthsEn: [
      'Birthplace of deep learning — the academic legacy of Bengio and Hinton',
      'Three world-class institutes form a talent development network',
      'Global leader in AI safety and ethics research (CAISI)',
      "World's first national AI strategy (2017); a clear first-mover advantage",
    ],
    weaknesses: [
      'AI 人才大量流向美国（"北向脑流失"倒过来了）',
      'AIDA 法案搁置，治理框架缺乏法律约束力',
      '商业化能力不足——研究强、落地弱',
      '缺少本土 AI 巨头（对标新加坡的 Grab、Sea 等）',
    ],
    weaknessesEn: [
      'Significant AI brain drain to the US (the "northbound brain drain" runs in reverse)',
      'AIDA shelved; governance framework lacks legal force',
      'Weak commercialisation — strong research, weak deployment',
      "No homegrown AI giant (compare to Singapore's Grab or Sea)",
    ],
    keyBodies: [
      {
        name: 'ISED（创新科学与经济发展部）',
        nameKo: 'ISED(혁신, 과학 및 경제 발전부)',
        nameJa: 'ISED（イノベーション・科学・経済発展部）',
        nameEn: 'ISED (Innovation, Science and Economic Development Canada)',
        role: 'AI 政策主管',
        roleKo: 'AI 정책 담당',
        roleJa: 'AI 政策主管',
        roleEn: 'Lead authority for AI policy',
      },
      {
        name: 'Mila',
        nameEn: 'Mila',
        role: '蒙特利尔 AI 研究所（Bengio）',
        roleKo: '몬트리올 AI 연구소(Bengio)',
        roleJa: 'モントリオール AI 研究所（Bengio）',
        roleEn: 'Montréal AI institute (Bengio)',
      },
      {
        name: 'Vector Institute',
        nameEn: 'Vector Institute',
        role: '多伦多 AI 研究所',
        roleKo: 'Toronto AI Research Institute',
        roleJa: 'Toronto AI 研究所',
        roleEn: 'Toronto AI institute',
      },
      {
        name: 'Amii',
        nameEn: 'Amii',
        role: '阿尔伯塔 AI 研究所',
        roleKo: 'Alberta AI Research Institute',
        roleJa: 'アルバータ AI 研究所',
        roleEn: 'Alberta AI institute',
      },
      {
        name: 'CAISI',
        nameEn: 'CAISI',
        role: '加拿大 AI 安全研究所',
        roleKo: 'Canada AI Safety Institute',
        roleJa: 'カナダ AI 安全研究所',
        roleEn: 'Canadian AI Safety Institute',
      },
    ],
    sources: ['Pan-Canadian AI Strategy（2017/2024）', 'Budget 2024 — AI Chapter', 'CIFAR AI Strategy Reports'],
    sourcesEn: ['Pan-Canadian AI Strategy (2017/2024)', 'Budget 2024 — AI Chapter', 'CIFAR AI Strategy Reports'],
    drilldownEnrichments: {
      'core-strategy': {
        analysisEn:
          'Canada\'s AI strategy is layered around "first-mover research + delayed legislation + sovereign compute pivot": (1) the Pan-Canadian AI Strategy (2017) was the world\'s first national AI strategy, predating Singapore NAIS 1.0 by two years, with CAD $125m initial budget; (2) Phase 2 launched in 2022 with CAD $443.8m over ten years, allocating CAD $60m to the three institutes (Mila / Vector / Amii) and CAD $160m to CIFAR for talent and research centres; (3) Budget 2024 added CAD $2.4bn for the AI ecosystem, including CAD $2bn for an AI Compute Access Fund and Canadian AI Sovereign Compute Strategy; (4) the Artificial Intelligence and Data Act (AIDA) was shelved when Parliament was dissolved in 2024 — leaving Canada without horizontal AI legislation. Assessment: Canada is the global "AI talent producer" but a weak "AI value capturer" — Bengio / Hinton-trained PhDs disproportionately migrate to US labs. The 2024 sovereign-compute pivot is the first attempt to retain talent by giving them domestic compute infrastructure.',
        analysis:
          '加拿大 AI 战略层次是"先发研究 + 立法延迟 + 主权算力转向"：(1) Pan-Canadian AI Strategy（2017）是全球首份国家 AI 战略，比新加坡 NAIS 1.0 早 2 年，初始预算 CAD $1.25 亿；(2) 第二阶段 2022 年启动，10 年期 CAD $4.438 亿，其中 CAD $6000 万给三所研究所（Mila / Vector / Amii）、CAD $1.6 亿给 CIFAR 用于人才与研究中心；(3) Budget 2024 新增 CAD $24 亿 AI 生态资金，含 CAD $20 亿 AI Compute Access Fund 和加拿大 AI 主权算力战略；(4) AIDA（人工智能与数据法案）在 2024 年国会解散时搁置——加拿大尚无水平性 AI 立法。判断：加拿大是全球"AI 人才生产者"但"AI 价值捕获者"较弱——Bengio / Hinton 培养的 PhD 不成比例地流向美国实验室。2024 年的主权算力转向是首次尝试通过本土算力基础设施留住人才。',
        analysisKo:
          '캐나다 AI 전략은 「선발 연구 + 입법 지연 + 주권 산력 전환」을 특징으로 합니다: (1) Pan-Canadian AI Strategy(2017)는 전 세계 최초의 국가 AI 전략이며, 싱가포르 NAIS 1.0보다 2년 앞서 출범했고, 초기 예산은 CAD $1.25억입니다; (2) 2단계는 2022년에 시작되었으며, 10년 기간 CAD $4.438억으로, CAD $6000만이 3개 연구소(Mila / Vector / Amii)에, CAD $1.6억이 인재 양성 및 연구 센터용으로 CIFAR에 배정되었습니다; (3) 2024 예산은 CAD $24억의 AI 생태 자금을 신규 추가하였으며, CAD $20억의 AI Compute Access Fund와 캐나다 AI 주권 산력 전략을 포함합니다; (4) AIDA(인공지능 및 데이터법)은 2024년 국회 해산 시 보류되었습니다 — 캐나다는 아직 수평적 AI 입법을 갖추지 못했습니다. 판단: 캐나다는 전 세계의 「AI 인재 생산자」이지만 「AI 가치 포획자」로서는 약합니다 — Bengio / Hinton이 배양한 박사 인력이 불균형하게 미국 실험실로 흘러갑니다. 2024년의 주권 산력 전환은 국내 산력 기반시설을 통해 인재를 유지하려는 첫 시도입니다.',
        analysisJa:
          'カナダの AI 戦略階層は「先発研究 + 立法延遅 + 主権算力転向」です。(1) Pan-Canadian AI Strategy（2017）は世界で初めての国家 AI 戦略で、シンガポール NAIS 1.0 より 2 年早く、初期予算は CAD $1.25 億です。(2) 第二段階は 2022 年に開始し、10 年間で CAD $4.438 億の予算であり、そのうち CAD $6000 万は 3 つの研究所（Mila / Vector / Amii）に、CAD $1.6 億は CIFAR に人材と研究センターのために配分されました。(3) Budget 2024 では、CAD $24 億の新しい AI エコシステム資金が追加され、CAD $20 億の AI Compute Access Fund とカナダの AI 主権算力戦略が含まれています。(4) AIDA（人工知能とデータ法案）は 2024 年の議会解散時に棚上げされました――カナダはまだ水平的な AI 立法を持っていません。判断：カナダは世界的な「AI 人材生産者」ですが、「AI 価値捕獲者」は相対的に弱いです――Bengio / Hinton が育成した PhD は不均衡にアメリカの研究室に流出しています。2024 年の主権算力転向は、国内の算力インフラを通じて人材を保持しようとする初めての試みです。',
        sources: [
          {
            label: 'Pan-Canadian AI Strategy 官方页面',
            labelKo: 'Pan-Canadian AI Strategy 공식 페이지',
            labelJa: 'Pan-Canadian AI Strategy 公式ページ',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
        ],
      },
      'investment-overview': {
        analysisEn:
          "Canada's AI investment trajectory tells the \"first-mover plus catch-up\" story: (1) CAD $125m initial Pan-Canadian AI Strategy (2017); (2) CAD $443.8m Phase 2 over ten years (2022); (3) Budget 2024's CAD $2.4bn ecosystem investment, with CAD $2bn earmarked for sovereign compute. Cumulative public commitment: roughly CAD $3bn through 2030. Assessment: Canada's per-decade public AI commitment is comparable to Singapore's S$2bn+ AI Strategy 2.0 — which is striking given Canada's GDP is roughly 8x Singapore's. The under-spending reflects Canada's bet on \"academic talent leverage\" rather than \"government-as-AI-customer\" — the 2024 sovereign compute pivot is the first major correction.",
        analysis:
          '加拿大 AI 投资轨迹反映"先发 + 补课"故事：(1) CAD $1.25 亿 Pan-Canadian AI Strategy 起步（2017）；(2) CAD $4.438 亿第二阶段 10 年期（2022）；(3) Budget 2024 的 CAD $24 亿生态投资，含 CAD $20 亿主权算力专项。10 年累计公共承诺约 CAD $30 亿。判断：加拿大每 10 年的公共 AI 承诺与新加坡 S$20 亿+ AI Strategy 2.0 相当——考虑到加拿大 GDP 约新加坡 8 倍，这是显著的"投入不足"。低投入反映加拿大押注"学术人才杠杆"而非"政府作为 AI 客户"——2024 年主权算力转向是首次重大纠偏。',
        analysisKo:
          '캐나다 AI 투자 궤적은 「선발 + 보충」의 이야기를 반영합니다: (1) CAD $1.25억 Pan-Canadian AI Strategy 출범(2017); (2) 10년 기간 CAD $4.438억의 2단계(2022); (3) 2024 예산의 CAD $24억 생태 투자로, CAD $20억의 주권 산력 전용자금 포함. 10년 누적 공공 공약은 약 CAD $30억입니다. 판단: 캐나다의 10년 공공 AI 공약은 싱가포르 S$20억+ AI Strategy 2.0과 맞먹습니다 — 캐나다 GDP가 싱가포르의 약 8배임을 감안하면, 이는 현저한 「투자 부족」입니다. 낮은 투자는 캐나다가 「학술 인재 레버」에 베팅했지 「정부가 AI 고객」이 되지는 않았음을 반영합니다 — 2024년 주권 산력 전환은 첫 번째 주요 교정입니다.',
        analysisJa:
          'カナダのAI投資軌跡は「先発+補習」というストーリーを反映しています：(1) CAD $1.25億のPan-Canadian AI Strategy開始（2017）；(2) CAD $4.438億の第二段階10年期（2022）；(3) Budget 2024のCAD $24億エコシステム投資、CAD $20億ソブリン算力専項を含む。10年累計公的コミットメント約CAD $30億。判断：カナダの10年ごとの公的AIコミットメントはシンガポールのS$20億+ AI Strategy 2.0に相当する——カナダのGDPがシンガポール約8倍であることを考慮すると、これは顕著な「投入不足」である。低い投入は、カナダが「政府がAIクライアント」という戦略ではなく「学術人材レバレッジ」に賭けたことを反映している——2024年のソブリン算力転換は最初の重大な軌道修正である。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
        ],
      },
      'governance-model': {
        analysisEn:
          'Canada\'s AI governance is in a "transition vacuum": (1) AIDA (Artificial Intelligence and Data Act) was introduced in 2022 as part of Bill C-27 but shelved when Parliament was dissolved in 2024; (2) Voluntary Code of Conduct on Generative AI (September 2023) signed by major Canadian AI firms (Cohere, BlackBerry AI, Telus, etc.); (3) CAISI (Canadian AI Safety Institute) was established 2024 with CAD $50m for AI safety research, partnering with US AISI and UK AISI; (4) sectoral regulators (OSFI for banks, Health Canada for medical AI) issue domain-specific guidance. Assessment: Canada is paying the cost of "first-mover on research, late-mover on legislation". With AIDA shelved, Canada is now behind Korea / Taiwan / EU on horizontal AI law and likely needs a new bill in 2025-2026 — but the political appetite is uncertain post-2024 election cycle.',
        analysis:
          '加拿大 AI 治理处在"过渡真空"：(1) AIDA（人工智能与数据法案）2022 年作为 Bill C-27 一部分提出，2024 年国会解散时搁置；(2) Voluntary Code of Conduct on Generative AI（2023 年 9 月）由主要加拿大 AI 公司签署（Cohere、BlackBerry AI、Telus 等）；(3) CAISI（加拿大 AI 安全研究所）2024 年成立，CAD $5000 万用于 AI 安全研究，与美国 AISI 和英国 AISI 合作；(4) 行业监管者（OSFI 银行、Health Canada 医疗 AI）发布领域特定指引。判断：加拿大正在支付"研究先发、立法后发"的成本。AIDA 搁置后，加拿大在水平性 AI 立法上落后韩国 / 台湾 / EU，可能 2025-2026 需要新法案——但 2024 选举周期后政治意愿不确定。',
        analysisKo:
          '캐나다 AI 거버넌스는 「과도 공백」에 처해 있습니다: (1) AIDA(인공지능 및 데이터법)은 2022년 Bill C-27의 일부로 제출되었으나, 2024년 국회 해산 시 보류되었습니다; (2) Voluntary Code of Conduct on Generative AI(2023년 9월)이 주요 캐나다 AI 기업들(Cohere, BlackBerry AI, Telus 등)에 의해 서명되었습니다; (3) CAISI(캐나다 AI 안전 연구소)가 2024년 설립되었으며, AI 안전 연구용으로 CAD $5000만이 할당되었고, 미국 AISI 및 영국 AISI와 협력하고 있습니다; (4) 규제 기관(OSFI 금융, Health Canada 의료 AI)이 분야별 지침을 발표했습니다. 판단: 캐나다는 「연구 선발, 입법 후발」의 대가를 지불하고 있습니다. AIDA 보류 이후, 캐나다는 수평적 AI 입법에서 한국 / 대만 / EU보다 뒤쳐져 있으며, 2025-2026년에 새로운 법안이 필요할 수 있습니다 — 하지만 2024년 선거 주기 이후 정치적 의지는 불확실합니다.',
        analysisJa:
          'カナダの AI ガバナンスは「過渡期の空白」の中にあります：(1) AIDA（人工知能とデータ法案）は 2022 年に Bill C-27 の一部として提案され、2024 年に議会が解散した際に棚上げされました；(2) Voluntary Code of Conduct on Generative AI（2023 年 9 月）は主要なカナダ AI 企業（Cohere、BlackBerry AI、Telus など）によって署名されました；(3) CAISI（カナダ AI 安全研究所）は 2024 年に設立され、AI 安全研究のため CAD $5000 万が割り当てられ、米国の AISI および英国の AISI と協力しています；(4) 業界規制当局（銀行セクターの OSFI、医療 AI 関連の Health Canada）は分野別のガイドラインを発表しています。判断：カナダは「研究先行、立法後発」の代価を支払っています。AIDA の棚上げ後、カナダは水平的 AI 立法において韓国 / 台湾 / EU に遅れをとっており、おそらく 2025～2026 年に新法案が必要になるでしょう——しかし 2024 年選挙サイクル後の政治的意志は不確実です。',
        sources: [
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
          {
            label: 'Pan-Canadian AI Strategy（ISED）',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
        ],
      },
      'comparative-strength': {
        analysisEn:
          "Canada's edge over Singapore is \"deep learning birthright + research talent network + safety leadership\": (1) academic legacy of Bengio (Mila), Hinton (Vector), Sutton (Amii) — Canada produced more deep learning Turing Award laureates than any other country; (2) Mila + Vector + Amii cumulatively employ ~3 000 AI researchers, comparable to Singapore's entire AI research workforce; (3) CAISI is a global anchor for AI safety research alongside US AISI and UK AISI — Singapore has no comparable safety institute; (4) Pan-Canadian AI Strategy (2017) gives Canada a six-year head start on AI policy framing. Weaknesses: brain drain to US (Cohere, ServiceNow Canada AI labs are exceptions, not the rule), AIDA shelved leaves a governance gap, weak commercialisation (research-to-startup conversion is below US rate), no homegrown AI giant. Assessment: Canada and Singapore optimise opposite ends — Canada is research-heavy, Singapore is deployment-heavy. Singapore's AI Verify exports faster than Canada's research papers commercialise.",
        analysis:
          '加拿大相对新加坡的核心杠杆是"深度学习发源 + 研究人才网络 + 安全领导力"：(1) Bengio（Mila）、Hinton（Vector）、Sutton（Amii）的学术遗产——加拿大产出的深度学习图灵奖得主比任何其他国家都多；(2) Mila + Vector + Amii 合计雇佣约 3000 名 AI 研究员，与新加坡整个 AI 研究人员规模相当；(3) CAISI 与美国 AISI 和英国 AISI 并列，是全球 AI 安全研究锚——新加坡没有同等安全研究所；(4) Pan-Canadian AI Strategy（2017）给加拿大在 AI 政策定位上 6 年先发。短板：人才流失到美国（Cohere、ServiceNow Canada AI 实验室是例外不是常态）、AIDA 搁置留下治理缺口、商业化弱（研究→创业转化率低于美国）、无本土 AI 巨头。判断：加拿大与新加坡在两端优化——加拿大研究重，新加坡部署重。新加坡 AI Verify 出口速度比加拿大研究论文商业化更快。',
        analysisKo:
          '캐나다의 싱가포르 대비 핵심 레버는 「심층 학습 기원 + 연구 인재 네트워크 + 안전 리더십」입니다: (1) Bengio(Mila), Hinton(Vector), Sutton(Amii)의 학술 유산 — 캐나다가 배출한 심층 학습 튜링상 수상자가 다른 어떤 국가보다 많습니다; (2) Mila + Vector + Amii가 합계로 약 3000명의 AI 연구원을 고용하고 있으며, 이는 싱가포르 전체 AI 연구 인력 규모와 맞먹습니다; (3) CAISI가 미국 AISI 및 영국 AISI와 나란히 위치하며, 전 세계 AI 안전 연구의 앵커입니다 — 싱가포르는 동등한 안전 연구소가 없습니다; (4) Pan-Canadian AI Strategy(2017)가 AI 정책 위상에서 캐나다에 6년의 선발 우위를 부여했습니다. 약점: 미국으로의 인재 유출(Cohere, ServiceNow Canada AI 실험실은 예외이지 상례가 아닙니다), AIDA 보류로 인한 거버넌스 공백, 약한 상업화(연구→창업 전환율이 미국보다 낮습니다), 국내 AI 거대 기업 없음. 판단: 캐나다와 싱가포르는 양끝 최적화 — 캐나다는 연구 중심, 싱가포르는 배포 중심입니다. 싱가포르 AI Verify 수출 속도가 캐나다 연구 논문의 상업화보다 빠릅니다.',
        analysisJa:
          'カナダがシンガポールに対して有する中核的なレバーは「深層学習の発祥地 + 研究人材ネットワーク + 安全リーダーシップ」である：(1) Bengio（Mila）、Hinton（Vector）、Sutton（Amii）の学術遺産──カナダが生み出した深層学習のチューリング賞受賞者は他のいかなる国よりも多い；(2) Mila + Vector + Amii の合計で約3,000人のAI研究者を雇用しており、シンガポール全体のAI研究人員規模に匹敵する；(3) CAISIはアメリカAISIおよびイギリスAISIと並列して、グローバルAI安全研究のアンカーである──シンガポールは同等の安全研究所を持たない；(4) Pan-Canadian AI Strategy（2017）がカナダにAI政策の位置づけで6年の先行アドバンテージを与えた。短所：米国への人材流出（Cohere、ServiceNow Canada AI Lab は例外であり常態ではない）、AIDA の棚上げによるガバナンスギャップ、商用化の弱さ（研究→スタートアップへの転換率が米国より低い）、国内AI巨頭がない。判断：カナダとシンガポールは両端で最適化されている──カナダは研究重視、シンガポールはデプロイメント重視。シンガポールの AI Verify の市場導入速度はカナダの研究論文の商用化より速い。',
        sources: [
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
          {
            label: 'Mila（蒙特利尔学习算法研究所）',
            labelKo: 'Mila(Montreal Learning Algorithms Institute)',
            labelJa: 'Mila（モントリオール学習アルゴリズム研究所）',
            labelEn: 'Mila official site',
            url: 'https://mila.quebec/en/',
          },
          {
            label: 'Vector Institute',
            labelEn: 'Vector Institute',
            url: 'https://vectorinstitute.ai/',
          },
        ],
      },
      'strategy-1': {
        analysisEn:
          'The Pan-Canadian AI Strategy was launched in March 2017 by Innovation, Science and Economic Development Canada (ISED) under the Trudeau government, with CIFAR as program operator. CAD $125m initial five-year budget. Three pillars: (1) global research excellence — anchor world-class AI institutes; (2) talent attraction and retention — Canada CIFAR AI Chairs programme; (3) commercialisation acceleration. Assessment: this was the world\'s first national AI strategy and remains the global benchmark for "academic talent leverage" approaches. Its real impact is having Geoffrey Hinton, Yoshua Bengio, and Richard Sutton stay in Canada rather than migrate to US tech giants — the indirect spillover from those three Turing Award laureates is incalculable.',
        analysis:
          'Pan-Canadian AI Strategy 2017 年 3 月由 ISED（创新科学与经济发展部）在 Trudeau 政府下启动，CIFAR 作为项目运营方。初始五年预算 CAD $1.25 亿。三大支柱：(1) 全球研究卓越——锚定世界级 AI 研究所；(2) 人才吸引与留住——Canada CIFAR AI Chairs 项目；(3) 商业化加速。判断：这是全球首份国家 AI 战略，至今仍是"学术人才杠杆"路径的全球基准。真正影响是把 Geoffrey Hinton、Yoshua Bengio、Richard Sutton 留在加拿大而非迁往美国科技巨头——三位图灵奖得主的间接溢出无法计量。',
        analysisKo:
          'Pan-Canadian AI Strategy는 2017년 3월에 Trudeau 정부 하에서 ISED(혁신과학경제발전부)에 의해 시작되었으며, CIFAR이 프로젝트 운영 기관으로 활동했습니다. 초기 5년 예산 CAD $1.25억. 3대 기둥: (1) 글로벌 연구 우수성 — 세계급 AI 연구소 앵커링; (2) 인재 유치 및 유지 — Canada CIFAR AI Chairs 프로그램; (3) 상업화 가속화. 판단: 이는 전 세계 최초의 국가 AI 전략이며, 현재까지도 「학술 인재 레버」 경로의 전 세계 벤치마크입니다. 진정한 영향은 Geoffrey Hinton, Yoshua Bengio, Richard Sutton을 미국 기술 대기업이 아닌 캐나다에 유지한 것입니다 — 3명의 튜링상 수상자의 간접 파급 효과는 정량화할 수 없습니다.',
        analysisJa:
          'Pan-Canadian AI Strategy は 2017 年 3 月に ISED（イノベーション・科学・経済発展部）により Trudeau 政権下で開始され、CIFAR がプロジェクト運営機関として機能しました。初期 5 年間の予算は CAD $1.25 億でした。三大柱：(1) グローバル研究卓越性——世界一流の AI 研究所に基盤を置く；(2) 人材吸引と人材確保——Canada CIFAR AI Chairs プログラム；(3) 商業化の加速。評価：これは世界初の国家 AI 戦略であり、現在でも「学術人材レバー」アプローチの世界的ベンチマークです。真の影響は Geoffrey Hinton、Yoshua Bengio、Richard Sutton をカナダに留めて米国のテクノロジー大手への流出を防ぐこと——三位のチューリング賞受賞者の間接的な波及効果は計測不可能です。',
        sources: [
          {
            label: 'Pan-Canadian AI Strategy（ISED）',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
        ],
      },
      'strategy-2': {
        analysisEn:
          'Pan-Canadian AI Strategy 2.0 launched in June 2022 with CAD $443.8m over ten years (2021-2031). Key allocations: CAD $60m to the three institutes (Mila + Vector + Amii, each up to CAD $20m over five years); CAD $160m to CIFAR for talent retention and AI Chairs continuation; CAD $125m for Canada\'s Global Innovation Clusters; remaining CAD $98.8m for cross-cutting commercialisation and AI safety. Assessment: 2.0 is roughly 3x the budget of 1.0 in real terms, but the funding model is unchanged — "talent leverage" remains the spine. The 2024 Budget addition of CAD $2.4bn (5x larger than Strategy 2.0) signals a structural shift toward sovereign compute and commercialisation; in retrospect, Strategy 2.0 may be remembered as the last "academic-leverage-only" iteration.',
        analysis:
          'Pan-Canadian AI Strategy 2.0 2022 年 6 月启动，10 年期 CAD $4.438 亿（2021-2031）。关键分配：CAD $6000 万给三所研究所（Mila + Vector + Amii，每所 5 年内最多 CAD $2000 万）；CAD $1.6 亿给 CIFAR 用于人才留住与 AI Chairs 续期；CAD $1.25 亿给加拿大全球创新集群；剩余 CAD $0.988 亿用于跨界商业化与 AI 安全。判断：2.0 实际预算约为 1.0 的 3 倍（按实际购买力），但资金模式不变——"人才杠杆"仍是骨架。2024 年 Budget 新增 CAD $24 亿（5 倍于 Strategy 2.0）信号一次结构性转向主权算力与商业化；事后看，Strategy 2.0 可能是最后一次"纯学术杠杆"迭代。',
        analysisKo:
          'Pan-Canadian AI Strategy 2.0은 2022년 6월에 시작되었으며, 10년 기간 CAD $4.438억(2021-2031)입니다. 핵심 배분: CAD $6000만이 3개 연구소(Mila + Vector + Amii, 각 5년 내 최대 CAD $2000만)에; CAD $1.6억이 인재 유지 및 AI Chairs 연속성을 위해 CIFAR에; CAD $1.25억이 캐나다 글로벌 혁신 클러스터에; 남은 CAD $0.988억이 교차 분야 상업화 및 AI 안전성에. 판단: 2.0의 실제 예산은 1.0의 약 3배입니다(실제 구매력 기준), 자금 모델은 변하지 않았습니다 — 「인재 레버」는 여전히 골격입니다. 2024년 예산의 CAD $24억(Strategy 2.0의 5배) 신규 추가는 주권 산력 및 상업화로의 구조적 전환 신호입니다; 사후 분석으로 보면, Strategy 2.0은 「순수 학술 레버」의 마지막 반복일 수 있습니다.',
        analysisJa:
          'Pan-Canadian AI Strategy 2.0は2022年6月に開始され、10年間（2021-2031年）でCAD $4.438億の予算を配分しています。主要な配分は以下の通りです：CAD $6000万を3つの研究所（Mila、Vector、Amii、各研究所は5年以内に最大CAD $2000万）に配分；CAD $1.6億をCIFARに人材留保とAI Chairs継続期間用に配分；CAD $1.25億をカナダグローバル革新クラスターに配分；残りのCAD $0.988億を分野横断的な商業化とAI安全に配分しています。判断としては、2.0の実際予算は1.0の約3倍ですが（実際の購買力ベース）、資金モデルは変わりません。「人材レバー」は依然として骨格です。2024年のBudgetでCAD $24億が新たに追加（Strategy 2.0の5倍）されたことは、主権的な計算能力と商業化への構造的転換を示唆しています。事後的に見ると、Strategy 2.0は「純粋学術レバー」の最後の反復かもしれません。',
        sources: [
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
          {
            label: 'Pan-Canadian AI Strategy（ISED）',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
        ],
      },
      'investment-1': {
        analysisEn:
          'Canada\'s 2024 Federal AI Budget added CAD $2.4bn for the AI ecosystem — by far the largest single AI commitment in Canadian history. Breakdown: CAD $2bn for the AI Compute Access Fund + Canadian AI Sovereign Compute Strategy; CAD $200m for Strategic Innovation Fund AI startup support; CAD $50m for CAISI; CAD $50m for AI workforce upskilling; CAD $100m for sectoral AI deployment. Assessment: the CAD $2bn sovereign compute line is the most consequential — Canada has long benefited from AWS / Azure / GCP regions in Toronto / Quebec, but no "sovereign" alternative existed. The Sovereign Compute Strategy will fund Canadian-owned AI compute facilities, accessible to academic and industry users. Whether this can reverse the brain-drain to US labs is the strategic test.',
        analysis:
          '加拿大 2024 联邦 AI 预算新增 CAD $24 亿用于 AI 生态——是加拿大历史上最大的单项 AI 承诺。分配：CAD $20 亿用于 AI Compute Access Fund + 加拿大 AI 主权算力战略；CAD $2 亿用于 Strategic Innovation Fund AI 创业支持；CAD $5000 万用于 CAISI；CAD $5000 万用于 AI 劳动力再培训；CAD $1 亿用于行业 AI 部署。判断：CAD $20 亿主权算力条线最具影响——加拿大长期受益于 Toronto / Quebec 的 AWS / Azure / GCP 区域，但没有"主权"替代。主权算力战略将资助加拿大拥有的 AI 算力设施，向学术和产业用户开放。能否扭转向美国实验室的人才流失是战略考验。',
        analysisKo:
          '캐나다의 2024년 연방 AI 예산은 AI 생태에 CAD $24억을 신규 추가합니다 — 캐나다 역사상 가장 큰 단일 AI 공약입니다. 배분: CAD $20억이 AI Compute Access Fund + 캐나다 AI 주권 산력 전략에; CAD $2억이 Strategic Innovation Fund AI 창업 지원에; CAD $5000만이 CAISI에; CAD $5000만이 AI 인력 재교육에; CAD $1억이 산업 AI 배포에. 판단: CAD $20억 주권 산력 라인이 가장 영향력 있습니다 — 캐나다는 오랫동안 Toronto / Quebec의 AWS / Azure / GCP 지역에서 이득을 누려왔지만, 「주권」 대체 수단이 없었습니다. 주권 산력 전략은 캐나다 소유의 AI 산력 시설 자금을 지원하고 학술 및 산업 사용자에게 개방할 것입니다. 미국 실험실로의 인재 유출을 역전시킬 수 있는지 여부가 전략 시험입니다.',
        analysisJa:
          'カナダの 2024 年連邦 AI 予算は、AI エコシステムのために新たに 24 億カナダドルを配分します。これはカナダ史上最大の単一 AI 約束です。配分：AI Compute Access Fund およびカナダ AI ソブリンコンピュート戦略のための 20 億カナダドル、Strategic Innovation Fund AI スタートアップ支援のための 2 億カナダドル、CAISI のための 5000 万カナダドル、AI 労働力の再トレーニングのための 5000 万カナダドル、産業 AI デプロイメント用 1 億カナダドル。判断：20 億カナダドルのソブリンコンピュート分野が最大の影響力を持ちます。カナダは長期的に Toronto / Quebec の AWS / Azure / GCP リージョンから恩恵を受けていますが、「主権」的な代替がありません。ソブリンコンピュート戦略は、カナダが所有する AI コンピュートインフラストラクチャに資金を提供し、学術および産業ユーザーに開放します。米国ラボへの人材流出を逆転できるかどうかが戦略的な試金石です。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
        ],
      },
      'investment-2': {
        analysisEn:
          "Canada's CAD $1bn sovereign compute programme is the operational arm of Budget 2024's CAD $2bn compute commitment. Mechanism: government grants to build Canadian-owned AI compute centres, with priority access for Canadian researchers and startups. Comparable in framing to Hong Kong AICP (HK$3bn / Cyberport AISC) but at smaller scale. Assessment: CAD $1bn sovereign compute is small relative to AWS Toronto region capex but adequate for an academic anchor — Mila / Vector / Amii combined need ~10-30 PFLOPS for frontier research, which CAD $1bn can deliver. The strategic question is whether Canada Sovereign Compute will be open to foreign collaborators (international researchers visiting Mila) or strictly nationals — different choices create different geopolitical postures.",
        analysis:
          '加拿大 CAD $10 亿主权算力计划是 Budget 2024 CAD $20 亿算力承诺的运营臂。机制：政府资助加拿大拥有的 AI 算力中心建设，向加拿大研究员和创业公司优先开放。在定位上类似香港 AICP（HK$30 亿 / Cyberport AISC）但规模较小。判断：CAD $10 亿主权算力相对 AWS Toronto 区域资本支出小，但作为学术锚足够——Mila / Vector / Amii 合计前沿研究需 ~10-30 PFLOPS，CAD $10 亿可以交付。战略问题是加拿大主权算力是否对国际合作者开放（造访 Mila 的国际研究员）还是严格限国籍——不同选择产生不同地缘政治立场。',
        analysisKo:
          '캐나다의 CAD $10억 주권 산력 계획은 2024 예산 CAD $20억 산력 공약의 운영 팔입니다. 메커니즘: 정부가 캐나다 소유의 AI 산력 센터 건설에 자금을 제공하고, 캐나다 연구원 및 창업 회사에 우선 개방합니다. 위치 지정상 홍콩 AICP(HK$30억 / Cyberport AISC)와 유사하지만 규모는 더 작습니다. 판단: CAD $10억 주권 산력은 AWS Toronto 지역 자본 지출에 비해 작지만, 학술 앵커로는 충분합니다 — Mila / Vector / Amii가 합계 전 개발 연구에 필요한 ~10-30 PFLOPS이며, CAD $10억이 이를 제공할 수 있습니다. 전략 문제는 캐나다 주권 산력이 국제 협력자에게 개방되는지(Mila 방문 국제 연구원) 또는 국적 엄격히 제한되는지 여부입니다 — 다른 선택은 다른 지정학적 입장을 생성합니다.',
        analysisJa:
          'カナダの CAD $10 億主権コンピューティング計画は、Budget 2024 の CAD $20 億コンピューティング約束の運営アームです。メカニズム：政府がカナダ所有の AI 計算センターの建設に資金を提供し、カナダの研究者とスタートアップ企業に優先的なアクセスを開放します。位置づけの上では香港の AICP（HK$30 億 / Cyberport AISC）に類似していますが、規模がより小さいです。評価：CAD $10 億主権コンピューティングは AWS Toronto リージョンの資本支出に比べると小さいですが、学術的アンカーとしては十分です——Mila / Vector / Amii の合計した最先端研究には ~10-30 PFLOPS が必要で、CAD $10 億でこれを供給できます。戦略的な課題は、カナダ主権コンピューティングが国際的な協力者に開放されるのか（Mila を訪問する国際研究者など）、それとも厳密に国籍で制限されるのかという点です——異なる選択は異なる地政学的立場をもたらします。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
        ],
      },
      'initiative-1': {
        analysisEn:
          "Mila (Montréal Institute for Learning Algorithms) was founded in 1993 by Yoshua Bengio at Université de Montréal and now stands as one of the largest academic AI research institutes globally — ~1 200 researchers across deep learning, reinforcement learning, AI for science, and AI safety. Funding: CIFAR Pan-Canadian AI Strategy CAD $20m (Phase 2), Quebec provincial CAD $40m+, plus corporate partnerships (Google, Meta, Samsung). Bengio is the Mila scientific director and a Turing Award laureate. Assessment: Mila is the world's largest deep-learning research institute by headcount — but its commercialisation track record is notably weaker than Stanford / MIT. The challenge is converting Mila's research depth into Canadian economic value rather than letting graduates migrate to US tech giants.",
        analysis:
          'Mila（蒙特利尔学习算法研究所）1993 年由 Yoshua Bengio 在蒙特利尔大学创立，现为全球最大学术 AI 研究所之一——约 1200 名研究员，覆盖深度学习、强化学习、AI4Science、AI 安全。资金：CIFAR Pan-Canadian AI Strategy CAD $2000 万（第二阶段）、魁北克省 CAD $4000 万+、加上企业合作（Google、Meta、Samsung）。Bengio 任 Mila 科学总监，图灵奖得主。判断：Mila 按人员规模是全球最大深度学习研究所——但商业化记录明显弱于 Stanford / MIT。挑战是把 Mila 研究深度转化为加拿大经济价值，而非让毕业生迁往美国科技巨头。',
        analysisKo:
          'Mila(Montreal Learning Algorithms Institute)는 1993년 Yoshua Bengio에 의해 몬트리올 대학교에서 설립되었으며, 현재 전 세계 최대 규모 학술 AI 연구소 중 하나입니다 — 약 1200명의 연구원을 가지고 있으며, 심층 학습, 강화 학습, AI4Science, AI 안전을 다룹니다. 자금: CIFAR Pan-Canadian AI Strategy CAD $2000만(2단계), 퀘벡 주 CAD $4000만+, 기업 협력(Google, Meta, Samsung). Bengio는 Mila의 과학 이사이며 튜링상 수상자입니다. 판단: Mila는 인원 규모로는 전 세계 최대 심층 학습 연구소입니다 — 하지만 상업화 기록은 Stanford / MIT보다 명확히 약합니다. 도전은 Mila 연구 깊이를 캐나다 경제 가치로 전환하는 것이며, 졸업생이 미국 기술 대기업으로 이동하지 않도록 하는 것입니다.',
        analysisJa:
          'Mila（モントリオール学習アルゴリズム研究所）は1993年にYoshua Bengioがモントリオール大学で創立され、現在、世界最大級の学術AI研究所の一つです—約1200名の研究員が所属し、深層学習、強化学習、AI4Science、AI安全をカバーしています。資金：CIFAR Pan-Canadian AI Strategy CAD $2000万（第2段階）、ケベック州 CAD $4000万以上、およびGoogle、Meta、Samsungとの企業パートナーシップ。BengioはMilaの最高科学責任者（チューリング賞受賞者）を務めています。判断：人員規模からすると、Milaは世界最大の深層学習研究所ですが—商用化の実績はStanford / MITに比べて明らかに劣ります。課題は、Milaの研究の深さをカナダ経済の価値に転化することであり、卒業生が米国のテック大手に移住するのを避けることです。',
        sources: [
          {
            label: 'Mila 官网',
            labelKo: 'Mila 공식 웹사이트',
            labelJa: 'Mila公式サイト',
            labelEn: 'Mila official site',
            url: 'https://mila.quebec/en/',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy（含 Mila 资助）',
            labelKo: 'CIFAR Pan-Canadian AI Strategy (Mila 자금 포함)',
            labelJa: 'CIFAR Pan-Canadian AI Strategy（Mila グラント含む）',
            labelEn: 'CIFAR Pan-Canadian AI Strategy (Mila funding context)',
            url: 'https://cifar.ca/ai/',
          },
        ],
      },
      'initiative-2': {
        analysisEn:
          'Vector Institute was founded in 2017 in Toronto by Geoffrey Hinton and partners, with CAD $135m initial funding from federal + Ontario governments + corporate sponsors. Headcount ~700 researchers. Research priorities: deep learning, NLP, computer vision, AI safety. Hinton, a 2024 Nobel laureate in Physics for AI work and 2018 Turing Award laureate, was Chief Scientific Advisor until 2023. Assessment: Vector benefits more from corporate partnerships (Google Brain Toronto, OpenAI Toronto presence) than Mila does from comparable proximity in Montréal. Vector also runs more aggressive industry-facing programs — its Industry Accelerator has incubated several Canadian AI companies (e.g. CIFAR-related spin-offs). Vector / Mila are complementary, not competitors, in the Canadian AI talent pipeline.',
        analysis:
          'Vector Institute 2017 年在多伦多由 Geoffrey Hinton 和合作者创立，初始资金 CAD $1.35 亿来自联邦 + 安大略政府 + 企业赞助。员工约 700 名研究员。研究重点：深度学习、NLP、计算机视觉、AI 安全。Hinton 因 AI 工作 2024 年获诺贝尔物理学奖、2018 年图灵奖，至 2023 年任首席科学顾问。判断：Vector 比 Mila 更受益于企业合作（Google Brain Toronto、OpenAI Toronto 存在）。Vector 也运行更激进的产业面向项目——其 Industry Accelerator 孵化了几家加拿大 AI 公司（如 CIFAR 相关分拆）。Vector / Mila 在加拿大 AI 人才管线上是互补而非竞争。',
        analysisKo:
          'Vector Institute는 2017년 토론토에서 Geoffrey Hinton과 협력자들에 의해 설립되었으며, 초기 자금 CAD $1.35억은 연방정부 + 온타리오주 정부 + 기업 후원으로 확보되었습니다. 약 700명의 연구원이 근무하고 있습니다. 연구 중점: 딥러닝, NLP, 컴퓨터 비전, AI 안전. Hinton은 AI 업무로 2024년 노벨 물리학상을 수상했으며 2018년 튜링상을 받았고, 2023년까지 최고 과학 자문관을 역임했습니다. 판단: Vector는 Mila보다 기업 협력으로부터 더 많은 이득을 얻고 있습니다 (Google Brain Toronto, OpenAI Toronto 존재). Vector는 또한 더욱 적극적인 산업 지향 프로젝트를 운영합니다—Industry Accelerator는 여러 캐나다 AI 회사(CIFAR 관련 스핀오프 등)를 육성했습니다. Vector / Mila은 캐나다 AI 인재 파이프라인에서 경쟁 관계가 아니라 상호 보완적입니다.',
        analysisJa:
          'Vector Institute は 2017 年にトロントで Geoffrey Hinton と協力者によって設立されました。初期資金 CAD $1.35 億は、カナダ連邦政府、オンタリオ州政府、および企業スポンサーから提供されています。研究スタッフは約 700 名です。研究の重点は、深層学習、NLP、コンピュータビジョン、AI 安全性です。Hinton は AI 関連の業績により 2024 年にノーベル物理学賞を、2018 年にチューリング賞を受賞し、2023 年まで首席科学顧問を務めました。評価：Vector は Mila よりも企業協力からより多くの恩恵を受けており（Google Brain Toronto および OpenAI Toronto が存在します）。Vector はまた、より激進的な業界指向型プロジェクトも運営しており――その Industry Accelerator はいくつかのカナダ AI 企業（例：CIFAR 関連スピンオフ）を育成しました。Vector / Mila は、カナダの AI 人材パイプラインにおいて補完的であり、競争的ではありません。',
        sources: [
          {
            label: 'Vector Institute 官网',
            labelKo: 'Vector Institute 공식 웹사이트',
            labelJa: 'Vector Institute 公式サイト',
            labelEn: 'Vector Institute official site',
            url: 'https://vectorinstitute.ai/',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
        ],
      },
      'initiative-3': {
        analysisEn:
          "Amii (Alberta Machine Intelligence Institute) is the third pillar of Canada's three-institute AI talent network, founded in 2002 at University of Alberta and led by Richard Sutton (RL pioneer, 2024 Turing Award laureate jointly with Andrew Barto). Specialisations: reinforcement learning, robotics, AI for energy / resources. Funding: CIFAR Pan-Canadian AI Strategy CAD $20m (Phase 2), Alberta provincial support. Headcount ~250 researchers. Assessment: Amii is the smallest of the three but the most specialised — RL is its global brand. With Sutton's 2024 Turing Award, Amii's profile is rising. Strategic value for Canada: distributing AI research across three Canadian provinces (Quebec / Ontario / Alberta) rather than concentrating in one city builds national political coalition for AI investment.",
        analysis:
          'Amii（阿尔伯塔机器智能研究所）是加拿大三所 AI 人才网络的第三支柱，2002 年在阿尔伯塔大学创立，由 Richard Sutton（强化学习先驱，2024 年与 Andrew Barto 共同获图灵奖）领导。专长：强化学习、机器人、能源 / 资源 AI。资金：CIFAR Pan-Canadian AI Strategy CAD $2000 万（第二阶段）、阿尔伯塔省支持。员工约 250 名研究员。判断：Amii 是三所中最小的但最专精——RL 是它的全球品牌。Sutton 2024 年图灵奖让 Amii 知名度上升。对加拿大的战略价值：把 AI 研究分布在三省（魁北克 / 安大略 / 阿尔伯塔）而非集中一城，为 AI 投入建立全国政治联盟。',
        analysisKo:
          'Amii (알버타 머신 인텔리전스 연구소)는 캐나다 세 곳의 AI 인재 네트워크 중 세 번째 기둥으로, 2002년 알버타 대학교에서 설립되었으며 강화학습의 선구자인 Richard Sutton (2024년 Andrew Barto와 함께 튜링상 수상)이 주도하고 있습니다. 전문성: 강화학습, 로봇공학, 에너지/자원 AI. 자금: CIFAR Pan-Canadian AI Strategy CAD $2000만 (2단계), 알버타주 지원. 약 250명의 연구원이 근무하고 있습니다. 판단: Amii는 세 곳 중 가장 작지만 가장 전문화되었습니다—RL은 이곳의 글로벌 브랜드입니다. Sutton의 2024년 튜링상이 Amii의 인지도를 높였습니다. 캐나다에 대한 전략적 가치: AI 연구를 한 도시가 아니라 세 개 주(퀘벡 / 온타리오 / 알버타)에 분산시켜 AI 투자에 대한 전국 정치 연합을 구축합니다.',
        analysisJa:
          'Amii（アルバータ機械知能研究所）はカナダの3つのAI人材ネットワークの第3の柱で、2002年にアルバータ大学で設立され、強化学習のパイオニアであり2024年にAndrew Bartoと共同でチューリング賞を受賞したRichard Suttonが率いています。専門分野：強化学習、ロボティクス、エネルギー/リソースAI。資金：CIFAR Pan-Canadian AI Strategy CAD $2000万（第2段階）、アルバータ州の支援。約250名の研究者から構成されています。評価：Amiiは3つの機関の中で最も小さいながら最も専門化している――RLは彼らのグローバルブランドです。Suttonの2024年チューリング賞はAmiiの認知度を高めました。カナダへの戦略的価値：AI研究を1つの都市に集中させるのではなく3つの州（ケベック州/オンタリオ州/アルバータ州）に分散させ、AI投資のための全国的な政治的連携を構築することです。',
        sources: [
          {
            label: 'Amii 官网',
            labelKo: 'Amii 공식 웹사이트',
            labelJa: 'Amii 公式サイト',
            labelEn: 'Amii official site',
            url: 'https://www.amii.ca/',
          },
          {
            label: 'CIFAR Pan-Canadian AI Strategy',
            labelEn: 'CIFAR Pan-Canadian AI Strategy',
            url: 'https://cifar.ca/ai/',
          },
        ],
      },
      'initiative-4': {
        analysisEn:
          "CAISI (Canadian AI Safety Institute) was established in 2024 with CAD $50m initial funding from Budget 2024. Mission: frontier AI safety research, model evaluations, red-teaming, international cooperation with US AISI / UK AISI / Singapore AI Safety Institute. Located within ISED, CAISI partners with Mila / Vector / Amii for research execution. Assessment: CAISI is Canada's most direct response to the 2023-2024 frontier AI safety wave (post-Bletchley AI Safety Summit). Its strategic value is higher than its CAD $50m budget suggests — being the third country (after US, UK) to set up an AISI gives Canada a permanent seat in the international AI safety governance network. Singapore established its AI Safety Institute in 2024 too; the Canada-Singapore-UK-US safety institute network is the de-facto governance backbone.",
        analysis:
          'CAISI（加拿大 AI 安全研究所）2024 年成立，Budget 2024 提供初始 CAD $5000 万资金。使命：前沿 AI 安全研究、模型评估、红队、与美国 AISI / 英国 AISI / 新加坡 AI 安全研究所国际合作。位于 ISED 内部，CAISI 与 Mila / Vector / Amii 在研究执行上合作。判断：CAISI 是加拿大对 2023-2024 前沿 AI 安全浪潮（Bletchley AI Safety Summit 后）最直接的回应。战略价值高于 CAD $5000 万预算暗示——作为继美国、英国之后第三个建立 AISI 的国家，给加拿大在国际 AI 安全治理网络中永久席位。新加坡 2024 年也建了 AI 安全研究所；加拿大 - 新加坡 - 英国 - 美国安全研究所网络是事实上的治理骨架。',
        analysisKo:
          'CAISI (캐나다 AI 안전 연구소)는 2024년에 설립되었으며, Budget 2024에서 초기 자금 CAD $5000만을 제공했습니다. 사명: 첨단 AI 안전 연구, 모델 평가, 레드팀, 미국 AISI / 영국 AISI / 싱가포르 AI 안전 연구소와의 국제 협력. ISED 내부에 위치하며, CAISI는 연구 실행에서 Mila / Vector / Amii와 협력합니다. 판단: CAISI는 2023-2024년 첨단 AI 안전 물결 (Bletchley AI Safety Summit 이후)에 대한 캐나다의 가장 직접적인 대응입니다. 전략적 가치는 CAD $5000만 예산이 암시하는 것보다 큽니다—미국, 영국에 이어 AISI를 설립한 세 번째 국가로서 캐나다에 국제 AI 안전 거버넌스 네트워크에서의 영구적인 자리를 제공합니다. 싱가포르도 2024년에 AI 안전 연구소를 설립했으며, 캐나다 - 싱가포르 - 영국 - 미국 안전 연구소 네트워크는 사실상의 거버넌스 골격입니다.',
        analysisJa:
          'CAISI（カナダ AI セーフティ研究所）は2024年に設立され、Budget 2024がCAD $5,000万の初期資金を提供しました。その使命は、最先端 AI セーフティ研究、モデル評価、レッドチーム、および米国 AISI / 英国 AISI / シンガポール AI セーフティ研究所との国際協力です。ISED内部に位置し、CAISIはMila / Vector / Amiiと研究実行で協力しています。評価：CAISIはBletchley AI Safety Summit後の2023-2024年の最先端 AI セーフティ波に対するカナダの最も直接的な対応です。戦略的価値はCAD $5,000万予算が示唆するところを超えています——米国、英国に次ぐ3番目のAISI設立国として、カナダに国際 AI セーフティガバナンスネットワークにおける永久席を与えています。シンガポールは2024年にも AI セーフティ研究所を設立しました；カナダ - シンガポール - 英国 - 米国セーフティ研究所ネットワークは事実上のガバナンス骨格です。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
          {
            label: 'Pan-Canadian AI Strategy（ISED，含 CAISI 上下文）',
            labelKo: 'CAISI 공식 웹사이트',
            labelJa: 'Pan-Canadian AI Strategy（ISED、CAISI コンテキスト含む）',
            labelEn: 'Pan-Canadian AI Strategy (ISED, CAISI context)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
        ],
      },
      'initiative-5': {
        analysisEn:
          "Canada's CAD $1bn sovereign compute programme is the headline operational deliverable of Budget 2024. Plan: build Canadian-owned AI compute facilities across multiple provinces (likely Quebec / Ontario at minimum), with priority access for Canadian academic and SME users. Implementation timeline: phase 1 deployment 2025-2026, full capacity 2027-2028. Assessment: this is Canada's first explicit attempt to build sovereign AI infrastructure rather than rely on hyperscalers. CAD $1bn is enough to procure ~5 000-8 000 NVIDIA H100-class GPUs, comparable to Hong Kong AICP / Cyberport AISC's 3 000 PFLOPS at first phase. The political question: will sovereign compute be open to international collaborators (allowing Mila to host visiting researchers) or strictly nationals?",
        analysis:
          '加拿大 CAD $10 亿主权算力计划是 Budget 2024 的旗舰运营交付物。规划：跨多省（至少魁北克 / 安大略）建设加拿大拥有的 AI 算力设施，向加拿大学术和 SME 用户优先开放。实施时间表：第一期 2025-2026 部署、2027-2028 满容量。判断：这是加拿大首次明确尝试建设主权 AI 基础设施而非依赖超大规模云。CAD $10 亿足够采购约 5000-8000 颗 NVIDIA H100 级 GPU，第一期与香港 AICP / Cyberport AISC 的 3000 PFLOPS 相当。政治问题：主权算力是否对国际合作者开放（允许 Mila 接待访问研究员）还是严格限国籍？',
        analysisKo:
          '캐나다의 CAD $10억 주권 컴퓨팅 계획은 Budget 2024의 기함급 운영 성과물입니다. 계획: 여러 주(최소 퀘벡 / 온타리오)에 걸쳐 캐나다가 소유한 AI 컴퓨팅 인프라를 구축하고 캐나다 학계 및 중소기업 사용자들에게 우선 개방합니다. 시행 일정: 1단계 2025-2026년 배포, 2027-2028년 만용량 달성. 판단: 이는 캐나다가 초대형 클라우드에 의존하지 않고 주권 AI 인프라 구축을 명시적으로 시도한 첫 번째 경우입니다. CAD $10억은 약 5000-8000개의 NVIDIA H100급 GPU를 구매하기에 충분하며, 1단계는 홍콩 AICP / Cyberport AISC의 3000 PFLOPS와 동등합니다. 정치적 문제: 주권 컴퓨팅이 국제 협력자들에게 개방될지 (Mila가 방문 연구원을 수용하도록 허용) 아니면 엄격히 국적을 제한할지 여부입니다.',
        analysisJa:
          'カナダの CAD 10 億の主権的計算能力計画は、Budget 2024 のフラッグシップ運用成果物です。計画：複数の州（少なくともケベック州とオンタリオ州）にわたってカナダが所有する AI 計算能力施設を建設し、カナダの学術機関および SME ユーザーに優先的に開放します。実施タイムライン：フェーズ1 は 2025～2026 年に配備、2027～2028 年に満容量に達します。判断：これはカナダが初めて、ハイパースケール・クラウドに依存するのではなく、主権的 AI インフラストラクチャーを明確に構築しようとした試みです。CAD 10 億は約 5,000～8,000 個の NVIDIA H100 クラス GPU の購入に十分であり、フェーズ1 は香港の AICP / Cyberport AISC の 3,000 PFLOPS に相当します。政治的な問題：主権的計算能力が国際的なパートナーに対して開放されるのか（Mila が訪問研究員を受け入れることを許可するのか）、それとも厳格に国籍による制限が適用されるのか。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
        ],
      },
      'body-1': {
        analysisEn:
          "ISED (Innovation, Science and Economic Development Canada) is Canada's federal department for innovation, including AI. AI-related functions: (1) authorship of Pan-Canadian AI Strategy 1.0 (2017) and 2.0 (2022); (2) coordination of CAISI; (3) administration of AI-specific funding lines under Budget 2024; (4) interface with provinces (Quebec / Ontario / Alberta for the three institutes). Assessment: ISED is more like Singapore's MTI + EDB combined — economic development plus innovation. Its AI-specific staffing is small, with most operational work delegated to CIFAR (program operator) and the three institutes. This thin federal layer matches Canada's federalism but limits central coordination compared to Singapore's SNDGO model.",
        analysis:
          'ISED（创新科学与经济发展部）是加拿大联邦创新部门，含 AI。AI 相关职能：(1) Pan-Canadian AI Strategy 1.0（2017）和 2.0（2022）起草；(2) CAISI 协调；(3) Budget 2024 AI 专项资金管理；(4) 与各省（魁北克 / 安大略 / 阿尔伯塔三所研究所）对接。判断：ISED 更接近新加坡 MTI + EDB 合体——经济发展 + 创新。AI 专门人员规模小，大多数运营工作委托给 CIFAR（项目运营方）和三所研究所。这种"薄联邦层"与加拿大联邦制匹配但相对新加坡 SNDGO 模式缺乏中央协调。',
        analysisKo:
          'ISED (혁신과학경제개발부)는 캐나다 연방 혁신 부서이며 AI를 포함합니다. AI 관련 직능: (1) Pan-Canadian AI Strategy 1.0 (2017) 및 2.0 (2022) 초안 작성; (2) CAISI 조율; (3) Budget 2024 AI 특화 자금 관리; (4) 각 주(퀘벡 / 온타리오 / 알버타의 세 연구소)와의 연계. 판단: ISED는 싱가포르의 MTI + EDB 합체에 더 가깝습니다—경제 발전 + 혁신. AI 전문 인력 규모가 작으며, 대부분의 운영 업무는 CIFAR (프로젝트 운영 기관)과 세 연구소에 위탁됩니다. 이러한 「얇은 연방층」은 캐나다 연방제와 부합하지만 싱가포르의 SNDGO 모델에 비해 중앙 조율이 부족합니다.',
        analysisJa:
          'ISED（イノベーション・科学・経済発展省）はカナダの連邦イノベーション部門であり、AI を含みます。AI 関連の職能：(1) Pan-Canadian AI Strategy 1.0（2017）と 2.0（2022）の起草；(2) CAISI の調整；(3) Budget 2024 AI 専用資金の管理；(4) 各州（ケベック / オンタリオ / アルバータ）の三つの研究所との連携。判断：ISED はシンガポール MTI + EDB 統合に より近い——経済発展 + イノベーション。AI 専門人員の規模は小さく、大多数の運営業務は CIFAR（プロジェクト運営方）と三つの研究所に委託されています。このような「薄い連邦層」はカナダの連邦制に適合していますが、シンガポール SNDGO モデルと比べると中央調整が不足しています。',
        sources: [
          {
            label: 'Pan-Canadian AI Strategy（ISED）',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
        ],
      },
      'body-2': {
        analysisEn:
          "Mila (Montréal Institute for Learning Algorithms) is operationally the most influential of Canada's three AI institutes — Yoshua Bengio's home base. Founded 1993, currently ~1 200 researchers. Mila's strategic significance lies less in its operational role than in its existence as a magnetic pole that pulled Bengio + 100+ top researchers to choose Canada over US offers. Assessment: Mila is the success story of the Pan-Canadian AI Strategy — the policy retained and amplified what already existed (Bengio's network at Université de Montréal) rather than building from scratch. This \"amplify what's there\" strategy is the most replicable lesson for other countries.",
        analysis:
          'Mila（蒙特利尔学习算法研究所）是加拿大三所 AI 研究所中运营最具影响力者——Yoshua Bengio 的根据地。1993 年创立，目前约 1200 名研究员。Mila 的战略重要性不在运营角色而在它作为磁极的存在——把 Bengio + 100+ 顶尖研究员从美国 offer 引到加拿大。判断：Mila 是 Pan-Canadian AI Strategy 的成功故事——政策留住并放大了已有的（Bengio 在蒙特利尔大学的网络）而非从零建设。这种"放大现有"策略是其他国家最具可复制性的经验。',
        analysisKo:
          'Mila (몬트리올 학습 알고리즘 연구소)는 캐나다의 세 AI 연구소 중 운영 영향력이 가장 큰 곳입니다—Yoshua Bengio의 근거지입니다. 1993년 설립되었으며, 현재 약 1200명의 연구원이 근무하고 있습니다. Mila의 전략적 중요성은 운영 역할이 아니라 자석극으로서의 존재에 있습니다—Bengio + 100명 이상의 최고급 연구원을 미국의 제안에서 캐나다로 유인합니다. 판단: Mila는 Pan-Canadian AI Strategy의 성공 사례입니다—정책이 이미 존재하는 것(몬트리올 대학교의 Bengio 네트워크)을 유지하고 확대했으며 제로에서 구축하지 않았습니다. 이러한 「기존 것 확대」 전략은 다른 국가들에게 가장 복제 가능한 경험입니다.',
        analysisJa:
          'Mila（モントリオール学習アルゴリズム研究所）はカナダの3つのAI研究所の中で運営上最も影響力のある機関です——Yoshua Bengio の拠点です。1993年に設立され、現在約1200名の研究者がいます。Mila の戦略的重要性は運営上の役割にあるのではなく、それが磁極として機能することにあります——Bengio と100人以上のトップ研究者をアメリカのオファーからカナダに引き寄せることです。判断：Mila は Pan-Canadian AI Strategy の成功事例です——政策は既存のもの（Bengio がモントリオール大学に持つネットワーク）を保持・拡大したのであって、ゼロから構築したのではありません。この「拡大既存」戦略は他国にとって最も複製可能な経験です。',
        sources: [
          {
            label: 'Mila 官网',
            labelKo: 'Mila 공식 웹사이트',
            labelJa: 'Mila公式サイト',
            labelEn: 'Mila official site',
            url: 'https://mila.quebec/en/',
          },
        ],
      },
      'body-3': {
        analysisEn:
          "Vector Institute, founded in 2017 in Toronto by Geoffrey Hinton, has ~700 researchers and is anchored at University of Toronto. Vector's strategic role differs from Mila — Vector emphasises corporate partnerships (Google Brain Toronto adjacency) and industry-facing programmes (Industry Accelerator, Vector Health, etc.). Hinton's 2024 Nobel Prize in Physics for foundational AI work brought Vector global attention. Assessment: Vector is the \"commercialisation pole\" of Canada's AI talent triangle — its corporate program revenue is higher than Mila's, suggesting that Toronto's tech industry is more receptive to academic AI than Montréal's.",
        analysis:
          'Vector Institute 2017 年在多伦多由 Geoffrey Hinton 创立，约 700 名研究员，锚定多伦多大学。Vector 的战略角色与 Mila 不同——Vector 强调企业合作（Google Brain Toronto 邻近）和产业面向项目（Industry Accelerator、Vector Health 等）。Hinton 2024 年因奠基性 AI 工作获诺贝尔物理学奖，给 Vector 全球关注。判断：Vector 是加拿大 AI 人才三角的"商业化极"——企业项目营收高于 Mila，暗示多伦多科技产业比蒙特利尔更接纳学术 AI。',
        analysisKo:
          'Vector Institute는 2017년 토론토에서 Geoffrey Hinton에 의해 창립되었으며, 약 700명의 연구원이 근무하고 있고 토론토 대학교에 정박되어 있습니다. Vector의 전략적 역할은 Mila와 다릅니다—Vector는 기업 협력 (인접한 Google Brain Toronto) 및 산업 지향 프로젝트 (Industry Accelerator, Vector Health 등)를 강조합니다. Hinton은 2024년 기초적 AI 업무로 노벨 물리학상을 수상하여 Vector에 국제적 주목을 가져왔습니다. 판단: Vector는 캐나다 AI 인재 삼각형의 「상업화 극」입니다—기업 프로젝트 수익이 Mila보다 높으며, 이는 토론토 과학기술 산업이 몬트리올보다 학계 AI를 더 잘 수용함을 암시합니다.',
        analysisJa:
          'Vector Instituteは2017年にトロントでGeoffrey Hintonによって創立され、約700名の研究員を擁し、トロント大学に拠点を置いています。Vectorの戦略的役割はMilaとは異なります——Vectorは企業協力（Google Brain Torontoに隣接）と産業向けプロジェクト（Industry Accelerator、Vector Healthなど）を強調しています。Hintonは2024年に基礎的なAI業績でノーベル物理学賞を受賞し、Vectorに世界的な注目をもたらしました。判断：VectorはカナダのAI人材三角形の「商業化の極」です——企業プロジェクトの営収がMilaを上回り、トロントのテクノロジー産業がモントリオールより学術AIをより受け入れていることを示唆しています。',
        sources: [
          {
            label: 'Vector Institute 官网',
            labelKo: 'Vector Institute 공식 웹사이트',
            labelJa: 'Vector Institute 公式サイト',
            labelEn: 'Vector Institute official site',
            url: 'https://vectorinstitute.ai/',
          },
        ],
      },
      'body-4': {
        analysisEn:
          "Amii (Alberta Machine Intelligence Institute) is the third pillar of Canada's AI institute network, anchored at University of Alberta and led by Richard Sutton. Strategic specialisation: reinforcement learning, AI for energy / resources, AI4Science. Headcount ~250 researchers — smallest of the three but most specialised. Sutton's 2024 Turing Award (jointly with Andrew Barto for foundational RL work) is Amii's signature credential. Assessment: Amii's RL specialisation is uniquely valuable in the post-DeepMind / OpenAI era where reinforcement learning from human feedback (RLHF) and AI agents are central. Amii's smaller scale lets it specialise more deeply — the alternative interpretation is that Alberta's tech ecosystem is smaller than Quebec's or Ontario's, limiting Amii's growth ceiling.",
        analysis:
          'Amii（阿尔伯塔机器智能研究所）是加拿大 AI 研究所网络第三支柱，锚定阿尔伯塔大学，Richard Sutton 领导。战略专长：强化学习、能源 / 资源 AI、AI4Science。员工约 250 名研究员——三所中最小但最专精。Sutton 2024 年图灵奖（与 Andrew Barto 因奠基性 RL 工作共同获奖）是 Amii 的标志性信用。判断：Amii 的 RL 专长在 DeepMind / OpenAI 之后的时代格外有价值，RLHF 和 AI Agent 是核心。Amii 较小规模让它专精更深——另一种解读是阿尔伯塔科技生态比魁北克 / 安大略小，限制 Amii 成长上限。',
        analysisKo:
          'Amii (알버타 머신 인텔리전스 연구소)는 캐나다 AI 연구소 네트워크의 세 번째 기둥이며, 알버타 대학교에 정박되어 있고 Richard Sutton이 주도하고 있습니다. 전략적 전문성: 강화학습, 에너지/자원 AI, AI4Science. 약 250명의 연구원이 근무하고 있습니다—세 곳 중 가장 작지만 가장 전문화되었습니다. Sutton의 2024년 튜링상 (Andrew Barto와 함께 기초적 RL 업무로 공동 수상)은 Amii의 상징적 신용입니다. 판단: Amii의 RL 전문성은 DeepMind / OpenAI 시대 이후에 특히 소중합니다. RLHF와 AI Agent가 핵심입니다. Amii의 비교적 작은 규모는 더욱 깊은 전문화를 가능하게 합니다—다른 관점으로는 알버타 과학기술 생태가 퀘벡 / 온타리오보다 작아 Amii의 성장 상한을 제한합니다.',
        analysisJa:
          'Amii（アルバータ・マシン・インテリジェンス研究所）はカナダの AI 研究所ネットワークの第三の柱であり、アルバータ大学に拠点を置き、Richard Sutton が率いています。戦略的専門性：強化学習、エネルギー / リソース AI、AI4Science です。約 250 名の研究員——3 つの中で最も小さいながら、最も専門的です。Sutton の 2024 年チューリング賞（基礎的な RL 研究で Andrew Barto と共に受賞）は Amii の象徴的な信用です。判断：Amii の RL 専門性は DeepMind / OpenAI 以後の時代に特に価値があり、RLHF と AI Agent がコアです。Amii の小規模は、より深い専門化を可能にします——別の見方では、アルバータのテック・エコシステムがケベック / オンタリオより小さく、Amii の成長の上限を制限しています。',
        sources: [
          {
            label: 'Amii 官网',
            labelKo: 'Amii 공식 웹사이트',
            labelJa: 'Amii 公式サイト',
            labelEn: 'Amii official site',
            url: 'https://www.amii.ca/',
          },
        ],
      },
      'body-5': {
        analysisEn:
          "CAISI (Canadian AI Safety Institute) was established 2024 with CAD $50m. Mission: frontier AI safety research, model evaluations, international cooperation with US AISI, UK AISI, Singapore AI Safety Institute. Located within ISED. Specialisations: capability evaluations, alignment research, cybersecurity AI risks. Assessment: CAISI's strategic value goes beyond its operational capacity — being the third country (after US, UK) to create an AISI gives Canada a permanent seat in the international AI safety governance network. Singapore launched its AI Safety Institute in 2024 in parallel; the four-country (US-UK-Canada-Singapore) safety institute coalition is the de-facto governance backbone for frontier AI evaluations through 2025-2027.",
        analysis:
          'CAISI（加拿大 AI 安全研究所）2024 年成立，CAD $5000 万。使命：前沿 AI 安全研究、模型评估、与美国 AISI、英国 AISI、新加坡 AI 安全研究所国际合作。位于 ISED 内部。专长：能力评估、对齐研究、网络安全 AI 风险。判断：CAISI 战略价值超过其运营容量——作为继美国、英国之后第三个建立 AISI 的国家，给加拿大在国际 AI 安全治理网络中永久席位。新加坡 2024 年同时启动 AI 安全研究所；四国（美 - 英 - 加 - 新）安全研究所联盟是 2025-2027 年前沿 AI 评估的事实治理骨架。',
        analysisKo:
          'CAISI (캐나다 AI 안전 연구소)는 2024년에 설립되었으며, CAD $5000만의 예산을 받았습니다. 사명: 첨단 AI 안전 연구, 모델 평가, 미국 AISI, 영국 AISI, 싱가포르 AI 안전 연구소와의 국제 협력. ISED 내부에 위치합니다. 전문성: 역량 평가, 정렬 연구, 사이버보안 AI 위험. 판단: CAISI의 전략적 가치는 운영 용량을 초과합니다—미국, 영국에 이어 AISI를 설립한 세 번째 국가로서 캐나다에 국제 AI 안전 거버넌스 네트워크에서의 영구적인 자리를 제공합니다. 미국 - 영국 - 캐나다 - 싱가포르의 안전 연구소 연합은 2025-2027년 첨단 AI 평가의 사실상의 거버넌스 골격입니다.',
        analysisJa:
          'CAISI（カナダ AI 安全研究所）は2024年に設立され、CAD $5000万の予算を有しています。ミッション：最先端の AI 安全研究、モデル評価、および米国 AISI、英国 AISI、シンガポール AI 安全研究所との国際協力。ISED内部に位置しています。専門分野：能力評価、アライメント研究、サイバーセキュリティの AI リスク。評価：CAISIの戦略的価値はその運営能力を超えています——米国および英国に次いで3番目にAISIを設立した国として、カナダに国際 AI 安全ガバナンスネットワークにおける永久的な地位をもたらしています。シンガポールは同じく2024年に AI 安全研究所を立ち上げました。4つの国（米 - 英 - 加 - 新）の安全研究所同盟は、2025-2027年における最先端の AI 評価の実際のガバナンスフレームワークです。',
        sources: [
          {
            label: 'Canada Budget 2024',
            labelEn: 'Canada Budget 2024',
            url: 'https://www.budget.canada.ca/2024/home-accueil-en.html',
          },
          {
            label: 'Pan-Canadian AI Strategy（ISED）',
            labelEn: 'Pan-Canadian AI Strategy (ISED)',
            url: 'https://ised-isde.canada.ca/site/ised/en/pan-canadian-artificial-intelligence-strategy',
          },
        ],
      },
    },
  },
];

export interface BenchmarkCaseFact {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  valueKo?: string;
  note?: string;
  noteEn?: string;
  noteJa?: string;
  noteKo?: string;
}

export interface BenchmarkCaseSection {
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  body: string;
  bodyEn?: string;
  bodyJa?: string;
  bodyKo?: string;
  bullets?: string[];
  bulletsEn?: string[];
  bulletsJa?: string[];
  bulletsKo?: string[];
}

export interface BenchmarkCaseSource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  url?: string;
}

export interface BenchmarkCase {
  id: string;
  /** Optional rel=canonical target path (locale-unprefixed) when this case
   *  substantially duplicates another page — e.g. a region drilldown about
   *  the same entity. Consolidates split ranking signals (GSC 2026-06:
   *  cyberport case pos 17.2 vs hong-kong drilldown pos 8.2 for the same
   *  supercomputing-centre queries). */
  canonicalPath?: string;
  flag: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  type: string;
  typeEn?: string;
  typeJa?: string;
  typeKo?: string;
  region: string;
  regionEn?: string;
  regionJa?: string;
  regionKo?: string;
  owner: string;
  ownerEn?: string;
  ownerJa?: string;
  ownerKo?: string;
  status: string;
  statusEn?: string;
  statusJa?: string;
  statusKo?: string;
  headline: string;
  headlineEn?: string;
  headlineJa?: string;
  headlineKo?: string;
  summary: string;
  summaryEn?: string;
  summaryJa?: string;
  summaryKo?: string;
  whyItMatters: string;
  whyItMattersEn?: string;
  whyItMattersJa?: string;
  whyItMattersKo?: string;
  singaporeTakeaway: string;
  singaporeTakeawayEn?: string;
  singaporeTakeawayJa?: string;
  singaporeTakeawayKo?: string;
  facts: BenchmarkCaseFact[];
  sections: BenchmarkCaseSection[];
  sources: BenchmarkCaseSource[];
  /** YYYY-MM-DD; the date this record was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates" entry.
   *  Set automatically by emit pipelines; manual additions must set it too.
   *  Old records may be undefined → not surfaced. */
  addedAt?: string;
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
}

export const benchmarkCaseProfileUpdated = '2026-05-04';

export const benchmarkCases: BenchmarkCase[] = [
  {
    id: 'ai-verify',
    addedAt: '2026-05-04',
    topicIds: ['safety-ethics', 'governance-regulation'],
    flag: '🇸🇬',
    name: 'AI Verify',
    nameEn: 'AI Verify',
    type: '治理测试框架',
    typeKo: '거버넌스 테스팅 프레임워크',
    typeJa: 'ガバナンステストフレームワーク',
    typeEn: 'Governance testing framework',
    region: '新加坡',
    regionKo: '싱가포르',
    regionJa: 'シンガポール',
    regionEn: 'Singapore',
    owner: 'AI Verify Foundation / IMDA',
    ownerEn: 'AI Verify Foundation / IMDA',
    status: '开源运营中',
    statusKo: '오픈소스 운영 중',
    statusJa: 'オープンソース運営中',
    statusEn: 'Active open-source programme',
    headline: '把 AI 治理原则转成可运行、可复核的测试流程。',
    headlineKo: 'AI 거버넌스 원칙을 실행 가능하고 감사 가능한 테스트 프로세스로 변환합니다.',
    headlineJa: 'AI ガバナンス原則を実行可能で検証可能なテストプロセスに転換します。',
    headlineEn: 'Turns AI governance principles into runnable, reviewable testing workflows.',
    summary:
      'AI Verify 是新加坡最可对外输出的 AI 治理资产。它不是一部硬法，而是一套把模型性能、风险声明、流程检查和报告生成连起来的测试基础设施。',
    summaryKo:
      'AI Verify는 싱가포르가 가장 외부로 수출할 수 있는 AI 거버넌스 자산입니다. 이는 경성법이 아니라 모델 성능, 위험 선언, 프로세스 검사, 및 보고서 생성을 연결하는 테스트 인프라 세트입니다.',
    summaryJa:
      'AI Verify は、シンガポール最大の対外輸出可能な AI 治理資産です。それはハード・ローではなく、モデルパフォーマンス、リスク宣言、プロセスチェック、およびレポート生成を統合するテスト基盤です。',
    summaryEn:
      'AI Verify is Singapore’s most exportable AI governance asset. It is not hard law; it is testing infrastructure that connects model performance, risk claims, process checks, and report generation.',
    whyItMatters:
      '很多国家都在写 AI 原则，但企业真正需要的是可执行的验证工具。AI Verify 的价值在于把“可信 AI”从宣言变成流程，适合新加坡这种以信任、贸易和跨境合规为核心的小国。',
    whyItMattersKo:
      '많은 국가가 AI 원칙을 작성하고 있지만, 기업이 실제로 필요한 것은 실행 가능한 검증 도구입니다. AI Verify의 가치는 「신뢰할 수 있는 AI」를 선언에서 프로세스로 변환하는 데 있으며, 이는 신뢰, 무역, 국경 간 규제 준수를 핵심으로 하는 싱가포르 같은 작은 국가에 적합합니다.',
    whyItMattersJa:
      '多くの国が AI 原則を策定していますが、企業が真に必要とするのは実行可能な検証ツールです。AI Verify の価値は「信頼できる AI」を宣言からプロセスに変えることにあり、信頼、貿易、越境コンプライアンスを中核とするシンガポールのような小国に適しています。',
    whyItMattersEn:
      'Many countries write AI principles, but companies need executable verification. AI Verify matters because it turns “trusted AI” from a declaration into a process, fitting Singapore’s trust, trade, and cross-border compliance position.',
    singaporeTakeaway:
      '这是新加坡区别于资本型国家和大模型国家的关键路径：不一定拥有最大模型，但可以成为企业、政府和国际组织都愿意使用的 AI 信任层。',
    singaporeTakeawayKo:
      '이것이 싱가포르가 자본주의 국가 및 대규모 모델 국가와 차별화되는 핵심 경로입니다: 반드시 가장 큰 모델을 소유할 필요는 없지만, 기업, 정부, 국제 조직이 기꺼이 사용할 수 있는 AI 신뢰 계층이 될 수 있습니다.',
    singaporeTakeawayJa:
      'これはシンガポールが資本大国および大規模モデル大国と異なる重要な道筋です：最大のモデルを必ずしも所有する必要はありませんが、企業、政府、国際機関が利用したいと考える AI 信頼層となることができます。',
    singaporeTakeawayEn:
      'This is Singapore’s distinct path versus capital-heavy or model-heavy nations: it may not own the largest models, but it can become the AI trust layer that companies, governments, and international bodies can use.',
    facts: [
      {
        label: '对象',
        labelKo: '대상',
        labelJa: '対象',
        labelEn: 'Object',
        value: 'AI 系统测试与治理报告',
        valueKo: 'AI 시스템 테스트 및 거버넌스 보고서',
        valueJa: 'AI システムテスト・ガバナンス報告書',
        valueEn: 'AI system testing and governance reporting',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '治理可执行性',
        valueKo: '거버넌스 실행 가능성',
        valueJa: 'ガバナンス実行可能性',
        valueEn: 'Governance executability',
      },
      {
        label: '新加坡优势',
        labelKo: '싱가포르 우위',
        labelJa: 'シンガポール優位',
        labelEn: 'Singapore advantage',
        value: '可信中立枢纽',
        valueKo: '신뢰 중립 허브',
        valueJa: '信頼できる中立ハブ',
        valueEn: 'Trusted neutral hub',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '대응 지점',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'AI Verify 不是把监管写得更重，而是把企业已经要做的模型测试、文档化、风险声明和治理流程产品化。对跨国企业而言，这比单纯的原则文本更容易纳入内部合规。',
        bodyKo:
          'AI Verify는 감시를 더 무겁게 쓰는 것이 아니라 기업이 이미 해야 하는 모델 테스트, 문서화, 위험 선언, 거버넌스 프로세스를 제품화합니다. 다국적 기업의 입장에서는 이것이 순수한 원칙 텍스트보다 내부 규제 준수에 더 쉽게 통합됩니다.',
        bodyJa:
          'AI Verify は、規制をより厳しく書くのではなく、企業がすでに実施する必要があるモデルテスト、ドキュメンテーション、リスク声明及びガバナンスプロセスを製品化することです。多国籍企業にとって、これは単なる原則テキストよりも、内部コンプライアンスに組み込みやすいものです。',
        bodyEn:
          'AI Verify does not simply make regulation heavier. It productises model testing, documentation, risk claims, and governance workflows that companies already need. For multinationals, that is easier to absorb than principles alone.',
        bullets: ['治理工具化，而非只停留在政策表述', '适合跨境企业自测和第三方验证', '可与欧盟、OECD、美国框架对齐'],
        bulletsEn: [
          'Turns governance into tools, not just policy language',
          'Supports enterprise self-testing and third-party verification',
          'Can align with EU, OECD, and US governance frameworks',
        ],
        bulletsJa: [
          'ガバナンスを政策表現にとどめず、ツール化する',
          '越境企業の自己検証と第三者検証に向く',
          'EU、OECD、米国の枠組みと整合可能',
        ],
        bulletsKo: [
          '거버넌스를 정책 문구에만 두지 않고 도구화',
          '국경 간 기업의 자체 테스트와 제3자 검증에 적합',
          'EU, OECD, 미국 프레임워크와 정렬 가능',
        ],
      },
      {
        title: '后续追踪',
        titleKo: '후속 추적',
        titleJa: 'フォローアップ',
        titleEn: 'What to track next',
        body: '关键不是工具是否存在，而是是否进入采购、审计、认证和行业标准。未来应追踪 AI Verify 报告是否被金融、航空、政府采购、跨境数据场景实际采用。',
        bodyKo:
          '핵심은 도구의 존재 여부가 아니라 조달, 감사, 인증, 업계 표준에 진입하는지 여부입니다. 미래에는 AI Verify 보고서가 금융, 항공, 정부 조달, 국경 간 데이터 시나리오에서 실제로 채택되는지 여부를 추적해야 합니다.',
        bodyJa:
          '重要なのはツールが存在するかどうかではなく、調達、監査、認証、業界標準に組み込まれるかどうかです。今後は、AI Verify レポートが金融、航空、政府調達、クロスボーダーデータシナリオで実際に採用されているかどうかを追跡する必要があります。',
        bodyEn:
          'The key question is not whether the tool exists, but whether it enters procurement, audit, certification, and industry standards. Track whether AI Verify reports get used in finance, aviation, public procurement, and cross-border data contexts.',
      },
    ],
    sources: [
      {
        label: 'AI Verify 官方资料',
        labelKo: 'AI Verify 공식 자료',
        labelJa: 'AI Verify 公式資料',
        labelEn: 'AI Verify official materials',
      },
      { label: 'AI Verify Foundation', labelEn: 'AI Verify Foundation' },
      {
        label: '新加坡 NAIS 2.0',
        labelKo: '싱가포르 NAIS 2.0',
        labelJa: 'シンガポール NAIS 2.0',
        labelEn: 'Singapore NAIS 2.0',
      },
    ],
  },
  {
    id: 'cyberport-ai-supercomputing-centre',
    addedAt: '2026-05-04',
    topicIds: ['infrastructure-research'],
    canonicalPath: '/benchmarking/hong-kong-initiative-1-cyberport-3000-pflops-supercomputing-centre/',
    flag: '🇭🇰',
    name: '数码港 AI 超算中心',
    nameKo: '사이버포트 AI 슈퍼컴퓨팅 센터',
    nameJa: 'サイバーポート AI スーパーコンピューティングセンター',
    nameEn: 'Cyberport AI Supercomputing Centre',
    type: '算力基础设施',
    typeKo: '컴퓨팅 파워 기초 인프라',
    typeJa: '計算インフラストラクチャ',
    typeEn: 'Compute infrastructure',
    region: '香港',
    regionKo: '홍콩',
    regionJa: '香港',
    regionEn: 'Hong Kong',
    owner: 'Cyberport / 香港特区政府',
    ownerKo: 'Cyberport / 홍콩 특별행정구 정부',
    ownerJa: 'Cyberport / 香港特別行政区政府',
    ownerEn: 'Cyberport / HKSAR Government',
    status: '建设与资助推进中',
    statusKo: '건설 및 자금 지원 진행 중',
    statusJa: '建設と資助が推進中',
    statusEn: 'Build-out and subsidy phase',
    headline: '香港用 3000 PFLOPS 超算计划补齐 AI 基础设施短板。',
    headlineKo: '홍콩이 3000 PFLOPS 슈퍼컴퓨팅 계획으로 AI 기초 인프라 단점을 보완합니다.',
    headlineJa: '香港は 3000 PFLOPS のスーパーコンピューティング計画で、AI インフラの短板を補完しています。',
    headlineEn: 'Hong Kong uses a 3000 PFLOPS supercomputing plan to close its AI infrastructure gap.',
    summary:
      '数码港超算中心是香港 AI 战略里最具体、最可量化的抓手。它把“创新科技蓝图”从政策口号拉到算力供给、企业补贴和科研算力使用。',
    summaryKo:
      '사이버포트 슈퍼컴퓨팅 센터는 홍콩 AI 전략에서 가장 구체적이고 정량화 가능한 레버입니다. 「혁신과학기술 청사진」을 정책 슬로건에서 컴퓨팅 파워 공급, 기업 보조금, 과학 연구 컴퓨팅 파워 사용으로 끌어올렸습니다.',
    summaryJa:
      'サイバーポート・スーパーコンピューティングセンターは、香港 AI 戦略における最も具体的で、最も定量化可能なレバーです。それは「革新技術ブループリント」を政策スローガンから計算力供給、企業補助金、および研究用計算力の使用へと転換しています。',
    summaryEn:
      'The Cyberport supercomputing centre is the most concrete and measurable lever in Hong Kong’s AI push. It turns the Innovation and Technology Blueprint into compute supply, enterprise subsidies, and research access.',
    whyItMatters:
      '香港的问题不是没有资本和高校，而是 AI 政策启动较晚、协调分散。超算中心提供了一个可见的公共基础设施锚点，让企业和研究机构有共同入口。',
    whyItMattersKo:
      '홍콩의 문제는 자본과 대학이 부족한 것이 아니라 AI 정책 시작이 늦고 조율이 분산되어 있다는 것입니다. 슈퍼컴퓨팅 센터는 기업과 연구 기관이 공동 입구를 가질 수 있도록 하는 가시적인 공공 기초 인프라 앵커 포인트를 제공했습니다.',
    whyItMattersJa:
      '香港の問題は、資本と高等教育機関がないことではなく、AI政策の立ち上げが遅く、協調が分散していることです。スーパーコンピューティングセンターは、目に見える公共インフラストラクチャーのアンカーポイントを提供し、企業と研究機関が共通の入口を持つことを可能にしています。',
    whyItMattersEn:
      'Hong Kong’s problem is not capital or universities; it is late AI policy mobilisation and fragmented coordination. The supercomputing centre creates a visible public-infrastructure anchor for companies and researchers.',
    singaporeTakeaway:
      '新加坡需要把 NSCC、商用 GPU、数据中心和企业算力补贴讲成一套更清晰的“国家 AI 算力入口”，否则香港这类后发地区会用单一大项目抢走叙事。',
    singaporeTakeawayKo:
      '싱가포르는 NSCC, 상용 GPU, 데이터 센터, 기업 컴퓨팅 파워 보조금을 더욱 명확한 「국가 AI 컴퓨팅 파워 입구」로 설명해야 합니다. 그렇지 않으면 홍콩과 같은 후발 지역이 단일 대규모 프로젝트로 서사를 빼앗아갈 것입니다.',
    singaporeTakeawayJa:
      'シンガポールは NSCC、商用 GPU、データセンター、および企業コンピューティング補助を、より明確な「国家 AI コンピューティングゲートウェイ」として統合的に説明する必要があります。さもなければ、香港のような後発地域が、単一の大型プロジェクトでナレーティブを奪う恐れがあります。',
    singaporeTakeawayEn:
      'Singapore needs to present NSCC, commercial GPUs, data centres, and enterprise compute support as one clearer national AI compute entry point, or later movers can win the narrative with one large project.',
    facts: [
      {
        label: '公开目标',
        labelKo: '공개 목표',
        labelJa: '公開目標',
        labelEn: 'Published target',
        value: '3000 PFLOPS',
        valueEn: '3000 PFLOPS',
      },
      {
        label: '配套资金',
        labelKo: '지원 자금',
        labelJa: 'マッチング資金',
        labelEn: 'Support funding',
        value: 'AI 超算资助计划',
        valueKo: 'AI 슈퍼컴퓨팅 지원 계획',
        valueJa: 'AIスーパーコンピューティング助成計画',
        valueEn: 'AI supercomputing subsidy scheme',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '公共算力入口',
        valueKo: '공공 컴퓨팅 파워 입구',
        valueJa: '公共計算力ポータル',
        valueEn: 'Public compute access',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 수 있는 지점',
        titleJa: 'ベンチマーク可能な箇所',
        titleEn: 'What makes it benchmarkable',
        body: '这个项目把算力、园区和企业补贴合在一起，适合观察香港能否从“金融与国际资本中心”转成“AI 研发和应用试验场”。',
        bodyKo:
          '이 프로젝트는 컴퓨팅 파워, 산업단지, 기업 보조금을 함께 묶었으며, 홍콩이 「금융과 국제 자본 센터」에서 「AI 연구개발 및 응용 시험장」으로 전환할 수 있는지 관찰하기에 적합합니다.',
        bodyJa:
          'このプロジェクトはコンピューティングパワー、産業園区、企業補助金を統合し、香港が「金融および国際資本センター」から「AI研究開発および応用テストベッド」へ転換できるかどうかを観察するのに適しています。',
        bodyEn:
          'The project combines compute, a tech park, and enterprise subsidies. It is a useful test of whether Hong Kong can move from a finance and capital hub into an AI R&D and application testbed.',
        bullets: ['算力指标清晰', '可直接服务科研与企业', '与香港科技园、AIRDI 等机构形成组合'],
        bulletsEn: [
          'Clear compute metric',
          'Directly serves research and enterprise users',
          'Can combine with HKSTP, AIRDI, and other institutions',
        ],
        bulletsJa: [
          '計算力指標が明確',
          '研究機関と企業に直接サービスできる',
          '香港科技園、AIRDI などの機関と組み合わせを形成',
        ],
        bulletsKo: [
          '컴퓨팅 지표가 명확',
          '연구와 기업에 직접 서비스 가능',
          '홍콩과학기술단지, AIRDI 등 기관과 조합 형성',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 포인트',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '算力只是入口，真正的差距在人才、数据、模型和行业落地。如果超算中心不能变成项目流和客户流，它会停留在硬件投资。',
        bodyKo:
          '컴퓨팅 파워는 단지 입구일 뿐이고, 진정한 차이는 인재, 데이터, 모델, 산업 적용에 있습니다. 슈퍼컴퓨팅 센터가 프로젝트 흐름과 고객 흐름으로 변하지 못하면 하드웨어 투자에 머물 것입니다.',
        bodyJa:
          '計算能力はあくまで入口に過ぎず、真の差は人材、データ、モデル、業界実装にあります。スーパーコンピューティングセンターがプロジェクトフローと顧客フローに転換できなければ、ハードウェア投資の段階にとどまることになります。',
        bodyEn:
          'Compute is only the entry point. The deeper gap is talent, data, models, and deployment. If the centre does not create project flow and customer flow, it remains a hardware investment.',
      },
    ],
    sources: [
      {
        label: '香港创新科技发展蓝图（2022）',
        labelKo: '홍콩 혁신과학기술 발전 청사진(2022)',
        labelJa: '香港革新技術発展ブループリント(2022)',
        labelEn: 'Hong Kong Innovation and Technology Development Blueprint (2022)',
      },
      {
        label: '2024-25 年施政报告 AI 相关政策',
        labelKo: '2024-25 시정 보고서 AI 관련 정책',
        labelJa: '2024-25年度 施政方針演説 AI関連政策',
        labelEn: 'AI-related policies in the 2024-25 Policy Address',
      },
    ],
  },
  {
    id: 'tsmc-ai-chip-manufacturing',
    addedAt: '2026-05-04',
    topicIds: ['infrastructure-research', 'economy-industry'],
    flag: '🇹🇼',
    name: 'TSMC AI 芯片制造',
    nameKo: 'TSMC AI 칩 제조',
    nameJa: 'TSMC AI チップ製造',
    nameEn: 'TSMC AI Chip Manufacturing',
    type: '公司 / 供应链节点',
    typeKo: '회사 / 공급망 노드',
    typeJa: '会社 / サプライチェーンノード',
    typeEn: 'Company / supply-chain node',
    region: '台湾',
    regionKo: '대만',
    regionJa: '台湾',
    regionEn: 'Taiwan',
    owner: 'TSMC',
    ownerEn: 'TSMC',
    status: '全球先进制程核心供应商',
    statusKo: '글로벌 고급 공정 핵심 공급업체',
    statusJa: 'グローバルな先進プロセス技術の中核サプライヤー',
    statusEn: 'Core global advanced-node supplier',
    headline: '台湾的 AI 护城河不是应用层，而是全球 AI 芯片供应链。',
    headlineKo: '대만의 AI 경쟁 우위는 응용 계층이 아니라 글로벌 AI 칩 공급망입니다.',
    headlineJa: '台湾の AI 護城河は、アプリケーション層ではなく、グローバル AI チップサプライチェーンです。',
    headlineEn: 'Taiwan’s AI moat is not the application layer; it is the global AI chip supply chain.',
    summary:
      'TSMC 是台湾 AI 战略最强的现实资产。无论台湾本土大模型和软件生态如何发展，先进芯片制造都让它在全球 AI 基础设施里拥有不可替代的位置。',
    summaryKo:
      'TSMC는 대만 AI 전략의 가장 강력한 현실 자산입니다. 대만의 자국 대형 모델과 소프트웨어 생태가 어떻게 발전하든 고급 칩 제조는 글로벌 AI 기초 인프라에서 대체 불가능한 위치를 제공합니다.',
    summaryJa:
      'TSMC は台湾の AI 戦略における最も強力な現実資産です。台湾国内の大型モデルおよびソフトウェアエコシステムがいかに発展しようとも、先進チップ製造により、TSMC はグローバル AI インフラストラクチャにおいて代替不可能な地位を占めています。',
    summaryEn:
      'TSMC is Taiwan’s strongest real AI asset. Regardless of Taiwan’s domestic model and software ecosystem, advanced chip manufacturing gives it an irreplaceable role in global AI infrastructure.',
    whyItMatters:
      'AI 竞争不只发生在模型和应用，也发生在芯片、封装、制造良率和供应链安全。TSMC 把台湾放在所有大模型公司和云厂商的上游。',
    whyItMattersKo:
      'AI 경쟁은 모델과 응용에만 일어나는 것이 아니라 칩, 패키징, 제조 수율, 공급망 안보에서도 일어납니다. TSMC는 대만을 모든 대형 모델 회사와 클라우드 업체의 상류에 배치합니다.',
    whyItMattersJa:
      'AI競争は、モデルとアプリケーションだけでなく、チップ、パッケージング、製造歩留まり、およびサプライチェーンセキュリティでも発生しています。TSMCはすべての大規模モデル企業とクラウドプロバイダーの上流に台湾を位置付けています。',
    whyItMattersEn:
      'AI competition is not only about models and applications; it also sits in chips, packaging, manufacturing yield, and supply-chain security. TSMC places Taiwan upstream of model labs and cloud providers.',
    singaporeTakeaway:
      '新加坡不可能复制 TSMC，但可以学习台湾把一个硬科技垂直优势放大成国家 AI 战略杠杆的方式：围绕强项建生态，而不是平均用力。',
    singaporeTakeawayKo:
      '싱가포르는 TSMC를 복제할 수 없지만 대만이 단일 하드 기술 수직 우위를 국가 AI 전략 지렛대로 확대하는 방식을 배울 수 있습니다: 강점 주변에 생태계를 구축하되 평균적으로 노력하지 않습니다.',
    singaporeTakeawayJa:
      'シンガポール は TSMC を複製することはできませんが、台湾がハード技術の垂直的優位性を国家 AI 戦略レバーに拡大する方法を学ぶことができます：強みを中心にエコシステムを構築し、均等には力を入れない方式。',
    singaporeTakeawayEn:
      'Singapore cannot replicate TSMC, but it can learn from Taiwan’s way of turning one deep-tech vertical strength into a national AI lever: build around the real advantage instead of spreading effort evenly.',
    facts: [
      {
        label: '战略位置',
        labelKo: '전략적 위치',
        labelJa: '戦略的位置',
        labelEn: 'Strategic position',
        value: 'AI 芯片先进制造',
        valueKo: 'AI 칩 첨단 제조',
        valueJa: 'AI チップ先進製造',
        valueEn: 'Advanced manufacturing for AI chips',
      },
      {
        label: '配套政策',
        labelKo: '지원 정책',
        labelJa: '支援政策',
        labelEn: 'Policy context',
        value: 'AI 岛计划 / 十大 AI 基础建设',
        valueKo: 'AI 아일랜드 계획 / AI 10대 기초 인프라',
        valueJa: 'AIアイランド計画 / 十大 AI インフラ',
        valueEn: 'AI Island Plan / Ten Major AI Infrastructure Projects',
      },
      {
        label: '主要约束',
        labelKo: '주요 제약 요인',
        labelJa: '主な制約',
        labelEn: 'Key constraint',
        value: '能源与地缘政治风险',
        valueKo: '에너지와 지정학적 위험',
        valueJa: 'エネルギーと地政学的リスク',
        valueEn: 'Energy and geopolitical risk',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크 가능 지점',
        titleJa: 'ベンチマーク対象',
        titleEn: 'What makes it benchmarkable',
        body: 'TSMC 说明，AI 战略不一定从模型开始。一个国家或地区只要控制 AI 价值链里的关键瓶颈，就能获得全球议价权。',
        bodyKo:
          'TSMC는 AI 전략이 반드시 모델부터 시작할 필요가 없음을 보여줍니다. 국가나 지역이 AI 가치사슬의 핵심 병목을 통제하기만 하면 글로벌 협상력을 확보할 수 있습니다.',
        bodyJa:
          'TSMCが示すところによると、AI戦略は必ずしもモデルから始まるわけではありません。ある国または地域は、AI価値チェーン内の重要なボトルネックをコントロールさえすれば、世界的な交渉力を獲得することができます。',
        bodyEn:
          'TSMC shows that an AI strategy does not have to start with models. A country or region can gain global leverage by controlling a critical bottleneck in the AI value chain.',
        bullets: ['硬件供应链是 AI 主权的一部分', '先进制造比应用叙事更难复制', '产业生态和国家安全高度绑定'],
        bulletsEn: [
          'Hardware supply chains are part of AI sovereignty',
          'Advanced manufacturing is harder to copy than application narratives',
          'Industrial ecosystems and national security are tightly linked',
        ],
        bulletsJa: [
          'ハードウェア供給網は AI 主権の一部',
          '先端製造はアプリケーション叙事より模倣しにくい',
          '産業エコシステムと国家安全保障が強く結びつく',
        ],
        bulletsKo: [
          '하드웨어 공급망은 AI 주권의 일부',
          '첨단 제조는 애플리케이션 서사보다 복제하기 어려움',
          '산업 생태계와 국가안보가 강하게 결합',
        ],
      },
      {
        title: '新加坡可学什么',
        titleKo: '싱가포르가 배울 수 있는 것',
        titleJa: 'シンガポールが学べること',
        titleEn: 'What Singapore can learn',
        body: '新加坡的强项不在芯片制造霸权，而在可信治理、区域总部、金融、物流、医疗和公共服务。关键是找到类似 TSMC 这种“不可替代节点”，而不是泛泛说做 AI hub。',
        bodyKo:
          '싱가포르의 강점은 칩 제조 헤게모니에 있지 않고, 신뢰할 수 있는 거버넌스, 지역 본부, 금융, 물류, 의료, 공공 서비스에 있습니다. 핵심은 TSMC 같은 「대체 불가능한 노드」를 찾는 것이지, AI 허브를 한다는 식의 막연한 이야기가 아닙니다.',
        bodyJa:
          'シンガポールの強項は、チップ製造の覇権にはなく、信頼できるガバナンス、地域本部、金融、物流、医療、および公共サービスにあります。重要なのは、TSMC のような「代替不可能なノード」を見つけることであり、AI ハブを作ると漠然と言うのではありません。',
        bodyEn:
          'Singapore’s strength is not chip-manufacturing hegemony; it is trusted governance, regional headquarters, finance, logistics, healthcare, and public services. The question is which Singapore nodes can become similarly hard to replace.',
      },
    ],
    sources: [
      {
        label: 'AI 台湾行动计划 2.0（2023）',
        labelKo: 'AI 대만 행동 계획 2.0 (2023)',
        labelJa: 'AI 台湾行動計画 2.0（2023）',
        labelEn: 'AI Taiwan Action Plan 2.0 (2023)',
      },
      {
        label: '行政院十大 AI 基础建设计划（2025）',
        labelKo: '행정원 AI 10대 기초 인프라 계획 (2025)',
        labelJa: '行政院十大 AI 基盤整備計画（2025）',
        labelEn: 'Executive Yuan Ten Major AI Infrastructure Plan (2025)',
      },
    ],
  },
  {
    id: 'falcon-llm',
    addedAt: '2026-05-04',
    topicIds: ['open-source'],
    flag: '🇦🇪',
    name: 'Falcon LLM',
    nameEn: 'Falcon LLM',
    type: '本土大模型',
    typeKo: '자국 대규모 언어모델',
    typeJa: '国内大規模言語モデル',
    typeEn: 'Sovereign large model',
    region: 'UAE',
    regionEn: 'UAE',
    owner: 'TII / ATRC',
    ownerEn: 'TII / ATRC',
    status: '开源模型系列',
    statusKo: '오픈소스 모델 시리즈',
    statusJa: 'オープンソースモデルシリーズ',
    statusEn: 'Open model family',
    headline: 'UAE 用 Falcon 证明资本型国家也要补模型主权。',
    headlineKo: 'UAE는 Falcon으로 자본 중심 국가도 모델 주권을 보충해야 함을 증명했습니다.',
    headlineJa: 'UAE は Falcon により、資本型国家も模型主権を補う必要があることを証明している。',
    headlineEn: 'The UAE uses Falcon to show that capital-heavy states still need model sovereignty.',
    summary:
      'Falcon LLM 是 UAE AI 战略里最像“国家能力”的项目之一。它让 UAE 不只是购买云和芯片，也能展示本土模型研发和开源影响力。',
    summaryKo:
      'Falcon LLM은 UAE AI 전략에서 「국가 역량」처럼 보이는 프로젝트 중 하나입니다. 이는 UAE가 클라우드와 칩을 구매하는 것뿐만 아니라 자국 모델 연구 및 오픈소스 영향력을 보여줄 수 있게 합니다.',
    summaryJa:
      'Falcon LLM は UAE の AI 戦略の中で、最も「国家能力」に近いプロジェクトの一つです。これにより UAE は、クラウドとチップを購入するだけでなく、ローカルモデルの研究開発とオープンソース影響力をも示すことができます。',
    summaryEn:
      'Falcon LLM is one of the UAE’s most “national capability” AI projects. It shows that the UAE is not only buying cloud and chips, but also building domestic model R&D and open-model influence.',
    whyItMatters:
      '对小国和中型国家来说，大模型既是技术能力，也是国际形象。Falcon 的意义不在于长期压过美国或中国头部模型，而在于让 UAE 拥有可展示、可合作、可吸引人才的模型旗帜。',
    whyItMattersKo:
      '소국과 중형 국가에 있어 대규모 언어모델은 기술 역량이자 국제 이미지입니다. Falcon의 의의는 장기적으로 미국이나 중국의 선도 모델을 능가하는 데 있지 않고, UAE가 전시할 수 있고, 협력할 수 있고, 인재를 유치할 수 있는 모델 기치를 소유할 수 있게 하는 데 있습니다.',
    whyItMattersJa:
      '小国と中規模国家にとって、大規模言語モデルは技術力であると同時に国際的なイメージでもあります。Falcon の意義は、アメリカや中国の主流モデルを長期的に上回ることにあるのではなく、むしろ UAE が展示でき、協力でき、人材を引き付けることができるモデルの旗印を備えることにあります。',
    whyItMattersEn:
      'For small and mid-sized states, large models are both technical capability and international signalling. Falcon’s value is not necessarily beating top US or Chinese models long term, but giving the UAE a visible model flag for partnership and talent attraction.',
    singaporeTakeaway:
      '新加坡的 SEA-LION 是区域语言和东南亚语境路线，Falcon 是主权大模型路线。两者都说明，小国做模型必须先定义差异化任务，而不是直接复刻通用模型军备竞赛。',
    singaporeTakeawayKo:
      '싱가포르의 SEA-LION은 지역 언어 및 동남아 맥락 경로이고, Falcon은 주권 대규모 언어모델 경로입니다. 둘 다 소국의 모델 개발은 먼저 차별화된 과제를 정의해야 하며, 범용 모델 군비 경쟁을 직접 복제해서는 안 된다는 점을 보여줍니다.',
    singaporeTakeawayJa:
      'シンガポールの SEA-LION は、地域言語と東南アジアの文脈アプローチであり、Falcon は主権的大規模言語モデル・アプローチです。この両者は、小国がモデルを開発する際には、汎用モデルの軍拡競争を直接模倣するのではなく、まず差別化されたタスクを定義しなければならないことを示しています。',
    singaporeTakeawayEn:
      'Singapore’s SEA-LION takes the regional-language and Southeast Asian context path; Falcon takes the sovereign-model path. Both show that smaller states must define differentiated model jobs instead of copying the general model arms race.',
    facts: [
      {
        label: '模型定位',
        labelKo: '모델 포지셔닝',
        labelJa: 'モデルポジショニング',
        labelEn: 'Model position',
        value: '本土开源大模型',
        valueKo: '자국 오픈소스 대규모 언어모델',
        valueJa: '国内オープンソース大規模モデル',
        valueEn: 'Domestic open large model',
      },
      {
        label: '关联机构',
        labelKo: '관련 기관',
        labelJa: '関連機関',
        labelEn: 'Related institution',
        value: 'ATRC / TII',
        valueEn: 'ATRC / TII',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '模型主权与国家品牌',
        valueKo: '모델 주권과 국가 브랜드',
        valueJa: 'モデル主権と国家ブランド',
        valueEn: 'Model sovereignty and national brand',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크 가능 지점',
        titleJa: 'ベンチマークできる点',
        titleEn: 'What makes it benchmarkable',
        body: 'Falcon 把 UAE 的资本、研究机构和国家品牌连到一个可见模型上。它不是单纯论文项目，而是国家 AI 叙事的一部分。',
        bodyKo:
          'Falcon은 UAE의 자본, 연구 기관, 국가 브랜드를 가시적인 모델로 연결합니다. 이는 단순한 논문 프로젝트가 아니라 국가 AI 내러티브의 일부입니다.',
        bodyJa:
          'Falcon は、UAE の資本、研究機関、国家ブランドを一つの可視的なモデルに接続しています。それは単なる論文プロジェクトではなく、国家 AI ナラティブの一部です。',
        bodyEn:
          'Falcon connects the UAE’s capital, research institutions, and national brand to a visible model. It is not merely a research artifact; it is part of the country’s AI narrative.',
        bullets: ['模型项目成为国家名片', '开源降低国际开发者试用门槛', '与 MBZUAI、MGX、算力投资形成组合'],
        bulletsEn: [
          'A model project becomes a national calling card',
          'Open release lowers the barrier for international developers',
          'Combines with MBZUAI, MGX, and compute investment',
        ],
        bulletsJa: [
          'モデルプロジェクトが国家ブランドになる',
          'オープンソースが国際開発者の試用ハードルを下げる',
          'MBZUAI、MGX、計算力投資と組み合わせを形成',
        ],
        bulletsKo: [
          '모델 프로젝트가 국가 명함이 됨',
          '오픈소스가 국제 개발자의 시험 사용 장벽을 낮춤',
          'MBZUAI, MGX, 컴퓨팅 투자와 조합 형성',
        ],
      },
      {
        title: '后续追踪',
        titleKo: '후속 추적',
        titleJa: 'フォローアップ',
        titleEn: 'What to track next',
        body: '要看 Falcon 是否能从“被看见”走向“被使用”：开发者生态、企业部署、阿拉伯语和区域场景表现，比单次榜单排名更重要。',
        bodyKo:
          'Falcon이 「보여지는 것」에서 「사용되는 것」으로 나아갈 수 있는지가 중요합니다. 개발자 생태, 기업 배포, 아랍어 및 지역 시나리오 성능이 단일 순위표 순위보다 더 중요합니다.',
        bodyJa:
          'Falcon が「認識される」から「使用される」へ移行できるかを見る必要があります：開発者エコシステム、エンタープライズデプロイメント、アラビア語、地域シナリオでのパフォーマンスは、単一のランキング結果より重要です。',
        bodyEn:
          'The key is whether Falcon moves from visibility to usage. Developer ecosystem, enterprise deployment, and Arabic or regional performance matter more than one-off leaderboard ranks.',
      },
    ],
    sources: [
      { label: 'UAE AI Strategy 2031', labelEn: 'UAE AI Strategy 2031' },
      {
        label: 'ATRC / TII Falcon 公开资料',
        labelKo: 'ATRC / TII Falcon 공개 자료',
        labelJa: 'ATRC / TII Falcon 公開資料',
        labelEn: 'ATRC / TII Falcon public materials',
      },
    ],
  },
  {
    id: 'mgx-ai-fund',
    addedAt: '2026-05-04',
    topicIds: ['startups-investment'],
    flag: '🇦🇪',
    name: 'MGX AI Fund',
    nameEn: 'MGX AI Fund',
    type: 'AI 投资平台',
    typeKo: 'AI 투자 플랫폼',
    typeJa: 'AI 投資プラットフォーム',
    typeEn: 'AI investment platform',
    region: 'UAE',
    regionEn: 'UAE',
    owner: 'Mubadala / UAE AI capital stack',
    ownerEn: 'Mubadala / UAE AI capital stack',
    status: '千亿美元级资本平台',
    statusKo: '수천억 달러 규모 자본 플랫폼',
    statusJa: '千億ドル規模の資本プラットフォーム',
    statusEn: 'US$100 billion-scale capital platform',
    headline: 'UAE 的最大变量不是政策文本，而是资本和能源。',
    headlineKo: 'UAE의 가장 큰 변수는 정책 문서가 아니라 자본과 에너지입니다.',
    headlineJa: 'UAE の最大の変数は政策文書ではなく、資本とエネルギーです。',
    headlineEn: 'The UAE’s biggest variable is not policy text; it is capital and energy.',
    summary:
      'MGX 代表 UAE 用主权资本参与全球 AI 基础设施、模型和应用投资的方式。它把国家 AI 战略从政府部门扩展到资本配置。',
    summaryKo:
      'MGX는 UAE가 주권 자본으로 글로벌 AI 기초 인프라, 모델, 응용 투자에 참여하는 방식을 대표합니다. 이는 국가 AI 전략을 정부에서 자본 배분으로 확대합니다.',
    summaryJa:
      'MGX は、UAE が主権資本を用いてグローバル AI インフラストラクチャ、モデル、およびアプリケーションへの投資に参画する方法を表しています。これは国家 AI 戦略を政府部門から資本配置へと拡張するものです。',
    summaryEn:
      'MGX represents the UAE’s way of using sovereign capital to participate in global AI infrastructure, models, and applications. It expands national AI strategy from ministries into capital allocation.',
    whyItMatters:
      'AI 基础设施越来越像能源和半导体，需要长期、重资产、跨国资本。MGX 让 UAE 在模型公司、云基础设施和芯片生态中拥有谈判席位。',
    whyItMattersKo:
      'AI 기초 인프라는 점점 에너지와 반도체처럼 되고 있으며, 장기, 자본 집약적, 초국적 자본이 필요합니다. MGX는 UAE가 모델 회사, 클라우드 인프라, 칩 생태계에서 협상 석을 확보하도록 합니다.',
    whyItMattersJa:
      'AI インフラストラクチャはエネルギーや半導体のようにますます長期的で資本集約的になってきており、多国籍資本が必要です。MGX により、UAE はモデル企業、クラウドインフラストラクチャ、チップエコシステムにおいて交渉力を獲得します。',
    whyItMattersEn:
      'AI infrastructure increasingly resembles energy and semiconductors: long-horizon, capital-intensive, and cross-border. MGX gives the UAE a negotiating seat across model companies, cloud infrastructure, and chip ecosystems.',
    singaporeTakeaway:
      '新加坡不具备同等主权资本打法，但可以用 Temasek、GIC、EDB、区域总部和监管信任形成“轻资本但高连接度”的替代路线。',
    singaporeTakeawayKo:
      '싱가포르는 동등한 주권 자본 전략을 갖추지 못했지만, Temasek, GIC, EDB, 지역 본부, 규제 신뢰를 활용해 「경량 자본이지만 높은 연결성」의 대안 경로를 형성할 수 있습니다.',
    singaporeTakeawayJa:
      'シンガポールは同等のソーベリン・キャピタル・アプローチを備えていませんが、Temasek、GIC、EDB、地域本部、および規制信頼を活用することで、「軽資本だが高接続性」という代替ルートを形成することができます。',
    singaporeTakeawayEn:
      'Singapore does not have the same capital-firepower posture, but it can combine Temasek, GIC, EDB, regional headquarters, and regulatory trust into a lighter-capital but highly connected alternative.',
    facts: [
      {
        label: '公开规模',
        labelKo: '공개 규모',
        labelJa: '公開規模',
        labelEn: 'Published scale',
        value: 'US$100B 级别',
        valueKo: 'US$100B 수준',
        valueJa: 'US$100B 規模',
        valueEn: 'US$100B scale',
      },
      {
        label: '核心资源',
        labelKo: '핵심 자원',
        labelJa: 'コア資源',
        labelEn: 'Core resource',
        value: '主权资本 + 能源',
        valueKo: '주권 자본 + 에너지',
        valueJa: 'ソブリン資本 + エネルギー',
        valueEn: 'Sovereign capital + energy',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: 'AI 资本配置能力',
        valueKo: 'AI 자본 배분 능력',
        valueJa: 'AI 資本配置能力',
        valueEn: 'AI capital allocation capacity',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 수 있는 지점',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'MGX 不是单个创业基金，而是国家参与 AI 资本市场的工具。它对标的是“谁能长期买下算力、数据中心和模型公司的未来现金流”。',
        bodyKo:
          'MGX는 단순한 스타트업 펀드가 아니라 국가가 AI 자본 시장에 참여하는 도구입니다. 이것이 벤치마크하는 것은 「누가 장기적으로 컴퓨팅 파워, 데이터 센터, 모델 회사의 미래 현금 흐름을 구매할 수 있는가」입니다.',
        bodyJa:
          'MGXは単独のスタートアップファンドではなく、国家がAI資本市場に参加するための手段です。ベンチマークしているのは「誰が長期的に計算力、データセンター、モデル企業の将来のキャッシュフローを買い取ることができるか」です。',
        bodyEn:
          'MGX is not a normal venture fund; it is a state tool for participating in AI capital markets. It benchmarks who can buy the future cash flows of compute, data centres, and model companies.',
        bullets: [
          '主权资本直接进入 AI 基础设施',
          '与微软合作和 Stargate UAE 等项目形成联动',
          '把国家战略和全球资本市场接通',
        ],
        bulletsEn: [
          'Sovereign capital enters AI infrastructure directly',
          'Connects with Microsoft partnerships and projects such as Stargate UAE',
          'Links national strategy to global capital markets',
        ],
        bulletsJa: [
          'ソブリン資本が AI インフラに直接入る',
          'Microsoft との協業や Stargate UAE などと連動',
          '国家戦略とグローバル資本市場を接続',
        ],
        bulletsKo: [
          '국부 자본이 AI 인프라에 직접 진입',
          'Microsoft 협력 및 Stargate UAE 등 프로젝트와 연동',
          '국가 전략과 글로벌 자본시장을 연결',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 포인트',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '资本可以购买入口，但不能自动生成本土人才、研究文化和可信治理。UAE 后续要证明的是资本能否转化成可持续能力。',
        bodyKo:
          '자본은 진입 포인트를 구매할 수 있지만 토착 인재, 연구 문화, 신뢰할 수 있는 거버넌스를 자동으로 생성할 수 없습니다. UAE가 그 이후 증명해야 하는 것은 자본이 지속 가능한 능력으로 전환될 수 있는지입니다.',
        bodyJa:
          '資本は入口を購入することはできますが、自動的に本土人材、研究文化、信頼できるガバナンスを生成することはできません。UAE が今後証明する必要があるのは、資本が持続可能な能力に転化できるかどうかです。',
        bodyEn:
          'Capital can buy entry points, but it cannot automatically create domestic talent, research culture, or trusted governance. The UAE still has to prove that capital converts into durable capability.',
      },
    ],
    sources: [
      {
        label: 'MGX 基金官方公告（2024）',
        labelKo: 'MGX 펀드 공식 발표(2024)',
        labelJa: 'MGX基金 公式発表（2024）',
        labelEn: 'MGX Fund official announcements (2024)',
      },
      { label: 'UAE AI Strategy 2031', labelEn: 'UAE AI Strategy 2031' },
    ],
  },
  {
    id: 'mbzuai',
    addedAt: '2026-05-04',
    topicIds: ['talent-education'],
    flag: '🇦🇪',
    name: 'MBZUAI',
    nameEn: 'MBZUAI',
    type: 'AI 研究型大学',
    typeKo: 'AI 연구형 대학',
    typeJa: 'AI 研究型大学',
    typeEn: 'AI research university',
    region: 'UAE',
    regionEn: 'UAE',
    owner: 'Mohamed bin Zayed University of Artificial Intelligence',
    ownerEn: 'Mohamed bin Zayed University of Artificial Intelligence',
    status: '持续扩张中',
    statusKo: '지속적 확장 중',
    statusJa: '継続的に拡張中',
    statusEn: 'Expanding',
    headline: 'UAE 用专门 AI 大学补人才和研究短板。',
    headlineKo: 'UAE는 전문 AI 대학으로 인재 및 연구 부족을 보충합니다.',
    headlineJa: 'UAE は専門的な AI 大学で人材と研究の短板を補っています。',
    headlineEn: 'The UAE uses a dedicated AI university to fill talent and research gaps.',
    summary:
      'MBZUAI 是 UAE 把全球人才、研究品牌和国家战略绑在一起的核心机构。它的作用不只是办学，也是在为 Falcon、MGX 和算力项目提供人才叙事。',
    summaryKo:
      'MBZUAI는 UAE가 글로벌 인재, 연구 브랜드 및 국가 전략을 통합하는 핵심 기관입니다. 이 기관의 역할은 단순히 교육 운영만이 아니라 Falcon, MGX 및 컴퓨팅 파워 프로젝트를 위해 인재 내러티브를 제공하는 것입니다.',
    summaryJa:
      'MBZUAI は、UAE がグローバル人材、研究ブランド、および国家戦略を結びつけるための中核機関です。その役割は単なる教育事業にとどまらず、Falcon、MGX、および計算能力プロジェクトに人材ナラティブを提供することでもあります。',
    summaryEn:
      'MBZUAI is a core UAE institution tying global talent, research brand, and national strategy together. Its role is not just education; it supplies the talent narrative for Falcon, MGX, and compute projects.',
    whyItMatters:
      '资本可以短期买资源，但 AI 研究文化和人才网络需要长期机构。MBZUAI 是 UAE 试图把外部人才沉淀为本地能力的制度容器。',
    whyItMattersKo:
      '자본은 단기간에 자원을 확보할 수 있지만, AI 연구 문화와 인재 네트워크는 장기적 기관을 필요로 합니다. MBZUAI는 UAE가 외부 인재를 지역 능력으로 침전시키려 하는 제도적 용기입니다.',
    whyItMattersJa:
      '資本は短期的に資源を購入できますが、AI研究文化と人材ネットワークは長期的な機構が必要です。MBZUAIはUAEが外部の人材を現地の能力として沈澱させようとする制度的な容器です。',
    whyItMattersEn:
      'Capital can buy resources in the short term, but AI research culture and talent networks require institutions. MBZUAI is the UAE’s container for turning external talent into local capability.',
    singaporeTakeaway:
      '新加坡已有 NUS、NTU、A*STAR 和 AISG，不缺机构；更关键的是能否把这些机构对外包装成一个清晰的“Singapore AI research stack”。',
    singaporeTakeawayKo:
      '싱가포르는 이미 NUS, NTU, A*STAR, AISG 등의 기관을 갖추고 있으며 기관이 부족하지 않습니다. 더욱 중요한 것은 이러한 기관들을 대외적으로 명확한 「Singapore AI research stack」으로 포장할 수 있는지 여부입니다.',
    singaporeTakeawayJa:
      'シンガポールは既に NUS、NTU、A*STAR、AISG を有しており、機関に不足はありません。より重要なのは、これらの機関を明確な「Singapore AI research stack」として対外的に整備できるかどうかです。',
    singaporeTakeawayEn:
      'Singapore already has NUS, NTU, A*STAR, and AISG. The challenge is less institution creation and more presenting them externally as a clear Singapore AI research stack.',
    facts: [
      {
        label: '定位',
        labelKo: '정의',
        labelJa: '位置づけ',
        labelEn: 'Position',
        value: '专门 AI 研究型大学',
        valueKo: '전문 AI 연구형 대학',
        valueJa: '専門 AI 研究大学',
        valueEn: 'Dedicated AI research university',
      },
      {
        label: '战略作用',
        labelKo: '전략적 역할',
        labelJa: '戦略的役割',
        labelEn: 'Strategic role',
        value: '人才与研究品牌',
        valueKo: '인재 및 연구 브랜드',
        valueJa: '人材と研究ブランド',
        valueEn: 'Talent and research brand',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '长期人才沉淀',
        valueKo: '장기 인재 침전',
        valueJa: '長期人材の蓄積',
        valueEn: 'Long-term talent anchoring',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크 가능한 지점',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'MBZUAI 把“AI 人才短缺”这个抽象问题变成一所大学、一批教授、一批博士和一个全球招生品牌。它是非常直接的国家能力建设工具。',
        bodyKo:
          'MBZUAI는 「AI 인재 부족」이라는 추상적 문제를 하나의 대학, 여러 교수진, 여러 박사 및 글로벌 입학 브랜드로 변환합니다. 이는 매우 직접적인 국가 능력 구축 도구입니다.',
        bodyJa:
          'MBZUAI は「AI 人材不足」という抽象的な問題を、一つの大学、複数の教授、複数の博士、そして世界的な採用ブランドに変えました。それは非常に直接的な国家能力構築ツールです。',
        bodyEn:
          'MBZUAI turns the abstract problem of AI talent scarcity into a university, faculty, doctoral students, and a global admissions brand. It is a direct national-capability-building tool.',
        bullets: ['以 AI 为唯一核心主题', '服务国家模型、算力和资本战略', '向全球人才市场发出明确定位'],
        bulletsEn: [
          'AI is the sole core theme',
          'Serves national model, compute, and capital strategies',
          'Sends a clear signal to the global talent market',
        ],
        bulletsJa: [
          'AI を唯一の中核テーマにする',
          '国家モデル、計算力、資本戦略にサービスする',
          'グローバル人材市場に明確なポジションを示す',
        ],
        bulletsKo: [
          'AI를 유일한 핵심 주제로 삼음',
          '국가 모델, 컴퓨팅, 자본 전략을 지원',
          '글로벌 인재 시장에 명확한 포지션 제시',
        ],
      },
    ],
    sources: [
      {
        label: 'MBZUAI 官网与研究报告',
        labelKo: 'MBZUAI 공식 웹사이트 및 연구 보고서',
        labelJa: 'MBZUAI 公式ウェブサイトと研究報告書',
        labelEn: 'MBZUAI website and research reports',
      },
      { label: 'UAE AI Strategy 2031', labelEn: 'UAE AI Strategy 2031' },
    ],
  },
  {
    id: 'unit-8200-ai-talent-pipeline',
    addedAt: '2026-05-04',
    topicIds: ['talent-education', 'national-security'],
    flag: '🇮🇱',
    name: 'Unit 8200 AI 人才管线',
    nameKo: 'Unit 8200 AI 인재 파이프라인',
    nameJa: 'Unit 8200 AI 人材パイプライン',
    nameEn: 'Unit 8200 AI Talent Pipeline',
    type: '人才与创业管线',
    typeKo: '인재와 스타트업 파이프라인',
    typeJa: '人材とスタートアップパイプライン',
    typeEn: 'Talent and startup pipeline',
    region: '以色列',
    regionKo: '이스라엘',
    regionJa: 'イスラエル',
    regionEn: 'Israel',
    owner: '以色列军事情报体系',
    ownerKo: '이스라엘 군사 정보 체계',
    ownerJa: 'イスラエル軍事情報体系',
    ownerEn: 'Israeli military intelligence ecosystem',
    status: '长期人才源头',
    statusKo: '장기 인재 출처',
    statusJa: '長期人材源泉',
    statusEn: 'Long-running talent source',
    headline: '以色列把安全任务、工程训练和创业密度连成一条管线。',
    headlineKo: '이스라엘은 보안 임무, 공학 훈련 및 창업 밀도를 하나의 파이프라인으로 연결합니다.',
    headlineJa:
      'イスラエルは、セキュリティ任務、エンジニアリング訓練、およびスタートアップの密度を一本のパイプラインに統合しています。',
    headlineEn: 'Israel links security missions, engineering training, and startup density into one pipeline.',
    summary:
      'Unit 8200 不是普通教育项目，而是以色列 AI、网络安全和深科技创业生态背后的训练场。它解释了为什么小国也能产生高密度 AI 创业公司。',
    summaryKo:
      'Unit 8200은 일반 교육 프로그램이 아니라 이스라엘 AI, 사이버보안 및 Deep Tech 스타트업 생태계 뒤의 훈련장입니다. 이것은 왜 소국도 높은 밀도의 AI 스타트업을 생산할 수 있는지를 설명합니다.',
    summaryJa:
      'Unit 8200は普通の教育プログラムではなく、イスラエルのAI、サイバーセキュリティ、ディープテック・スタートアップエコシステムの背後にある訓練場です。それは、小国もまた高密度のAIスタートアップ企業を生み出すことができる理由を説明しています。',
    summaryEn:
      'Unit 8200 is not a normal education programme. It is the training ground behind Israel’s AI, cybersecurity, and deep-tech startup ecosystem, explaining how a small country generates such high startup density.',
    whyItMatters:
      'AI 人才不是只靠大学培养，也来自高压真实任务、跨学科团队和早期责任。以色列的特殊之处在于把国家安全任务转化为创业人才网络。',
    whyItMattersKo:
      'AI 인재는 대학 교육만으로 양성되지 않으며, 고압 실제 임무, 학제 간 팀 및 초기 책임에서도 비롯됩니다. 이스라엘의 독특한 점은 국가 안보 임무를 스타트업 인재 네트워크로 변환하는 것입니다.',
    whyItMattersJa:
      'AI人材は大学での育成だけではなく、高圧的で実践的なタスク、学際的なチーム、そして初期段階での責任から生まれます。イスラエルの特徴は、国家安全保障の任務をスタートアップ人材ネットワークへと転化させたことです。',
    whyItMattersEn:
      'AI talent is not produced only by universities. It also comes from high-pressure real missions, cross-disciplinary teams, and early responsibility. Israel’s distinctive mechanism is turning national-security tasks into startup talent networks.',
    singaporeTakeaway:
      '新加坡不复制军事情报路径，但可以学习“任务型人才培养”：用公共服务、医疗、金融、物流等真实问题训练 AI 产品和工程人才。',
    singaporeTakeawayKo:
      '싱가포르는 군사 정보 경로를 복제하지 않지만, 「임무 기반 인재 양성」을 배울 수 있습니다: 공공 서비스, 의료, 금융, 물류 등 실제 문제를 통해 AI 제품 및 엔지니어링 인재를 훈련합니다.',
    singaporeTakeawayJa:
      'シンガポールは軍事情報の経路を複製しませんが、「任務型人材育成」から学ぶことができます：公共サービス、医療、金融、物流などの実在する問題を用いてAI製品およびエンジニアリング人材を育成することです。',
    singaporeTakeawayEn:
      'Singapore should not copy the military-intelligence path, but it can learn the mission-based talent model: train AI product and engineering talent through real public-service, healthcare, finance, and logistics problems.',
    facts: [
      {
        label: '生态位置',
        labelKo: '생태계 위치',
        labelJa: 'エコシステムポジション',
        labelEn: 'Ecosystem position',
        value: '创业人才源头',
        valueKo: '스타트업 인재 출처',
        valueJa: 'スタートアップ人材の源泉',
        valueEn: 'Startup talent source',
      },
      {
        label: '优势领域',
        labelKo: '우수 분야',
        labelJa: '優勢領域',
        labelEn: 'Strength area',
        value: '网络安全 AI / 深科技',
        valueKo: '사이버보안 AI / Deep Tech',
        valueJa: 'ネットワークセキュリティ AI / ディープテック',
        valueEn: 'Cybersecurity AI / deep tech',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '任务型人才训练',
        valueKo: '임무 기반 인재 양성',
        valueJa: 'タスク型人材訓練',
        valueEn: 'Mission-based talent training',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크 가능한 부분',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'Unit 8200 的对标价值不在军事本身，而在人才机制：早期暴露真实问题、快速承担责任、跨专业协作、离开体系后带着网络进入创业生态。',
        bodyKo:
          'Unit 8200의 벤치마크 가치는 군사 자체에 있지 않고 인재 메커니즘에 있습니다: 초기의 실제 문제 노출, 빠른 책임 담당, 학제 간 협력, 체계를 떠난 후 네트워크를 가지고 스타트업 생태계에 진입합니다.',
        bodyJa:
          'Unit 8200 のベンチマーク価値は軍事そのものにはなく、人材メカニズムにあります：初期段階での実問題の暴露、責任の迅速な引き受け、分野横断的な協働、体系を離れた後ネットワークを携えてスタートアップエコシステムに参入することです。',
        bodyEn:
          'The benchmark is not the military itself, but the talent mechanism: early exposure to real problems, fast responsibility, cross-disciplinary collaboration, and alumni networks flowing into startups.',
        bullets: ['真实任务比课堂更能训练判断力', '强校友网络降低创业早期摩擦', '安全场景天然需要 AI 和自动化'],
        bulletsEn: [
          'Real missions train judgment better than classrooms alone',
          'Strong alumni networks reduce early startup friction',
          'Security contexts naturally need AI and automation',
        ],
        bulletsJa: [
          '実任務は教室より判断力を鍛える',
          '強い卒業生ネットワークが起業初期の摩擦を下げる',
          '安全保障領域は AI と自動化を自然に必要とする',
        ],
        bulletsKo: [
          '실제 임무가 교실보다 판단력을 더 잘 훈련',
          '강한 동문 네트워크가 초기 창업 마찰을 낮춤',
          '안보 현장은 AI와 자동화를 자연스럽게 필요로 함',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 포인트',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '这种模式高度依赖国家安全结构、服役制度和政治环境，不能机械复制。可复制的是任务密度和人才网络，而不是制度外壳。',
        bodyKo:
          '이 모델은 국가 안보 구조, 복무 제도 및 정치 환경에 크게 의존하며, 기계적으로 복제할 수 없습니다. 복제 가능한 것은 임무 밀도와 인재 네트워크이지, 제도의 껍질이 아닙니다.',
        bodyJa:
          'このモデルは、国家安全保障体制、兵役制度、および政治環境に大きく依存しており、機械的には複製できません。複製可能なのは、任務密度と人材ネットワークであり、制度的な外殻ではありません。',
        bodyEn:
          'This model depends heavily on national-security structures, service systems, and political context. What can be copied is mission density and talent networks, not the institutional shell.',
      },
    ],
    sources: [
      { label: 'Israel National AI Program（2021）', labelEn: 'Israel National AI Program (2021)' },
      { label: 'State Comptroller AI Report（2024）', labelEn: 'State Comptroller AI Report (2024)' },
    ],
  },
  {
    id: 'korea-chaebol-llm-stack',
    addedAt: '2026-05-04',
    topicIds: ['economy-industry'],
    flag: '🇰🇷',
    name: '韩国财阀自研大模型栈',
    nameKo: '한국 재벌 자체 개발 대규모 모델 스택',
    nameJa: '韓国財閥自社開発大規模言語モデルスタック',
    nameEn: 'Korean Chaebol LLM Stack',
    type: '公司群 / 产业部署',
    typeKo: '기업군 / 산업 배포',
    typeJa: '企業群 / 産業展開',
    typeEn: 'Company cluster / industrial deployment',
    region: '韩国',
    regionKo: '한국',
    regionJa: '韓国',
    regionEn: 'South Korea',
    owner: 'Samsung / Naver / Kakao 等',
    ownerKo: 'Samsung / Naver / Kakao 등',
    ownerJa: 'Samsung / Naver / Kakao など',
    ownerEn: 'Samsung / Naver / Kakao and peers',
    status: '产业化推进中',
    statusKo: '산업화 추진 중',
    statusJa: '産業化推進中',
    statusEn: 'Industrial deployment underway',
    headline: '韩国的强项是把模型、硬件、云和消费场景压进同一个产业体系。',
    headlineKo: '한국의 강점은 모델, 하드웨어, 클라우드 및 소비자 시나리오를 동일한 산업 체계에 압축하는 것입니다.',
    headlineJa: '韓国の強みは、モデル、ハードウェア、クラウド、消費シーンを同一の産業体系に統合することです。',
    headlineEn:
      'Korea’s strength is pushing models, hardware, cloud, and consumer scenarios through one industrial system.',
    summary:
      '韩国不是只靠政府计划，而是由三星、Naver、Kakao 等大型企业把 AI 模型、半导体、云服务和应用场景接起来。财阀体系让大规模部署速度很快。',
    summaryKo:
      '한국은 정부 계획만으로 진행되는 것이 아니라 삼성, Naver, Kakao 등 대형 기업이 AI 모델, 반도체, 클라우드 서비스 및 응용 시나리오를 연결하는 방식으로 진행됩니다. 재벌 체계는 대규모 배포 속도를 매우 빠르게 합니다.',
    summaryJa:
      '韓国は政府計画だけに依存するのではなく、Samsung、Naver、Kakao などの大企業が AI モデル、半導体、クラウドサービス、応用シナリオをつなぎ合わせています。財閥体系により、大規模展開が非常に高速です。',
    summaryEn:
      'South Korea does not rely only on government plans. Large firms such as Samsung, Naver, and Kakao connect AI models, semiconductors, cloud services, and application scenarios. The chaebol system enables fast large-scale deployment.',
    whyItMatters:
      'AI 落地需要客户、数据、设备、渠道和资本。韩国财阀把这些要素集中在少数集团里，牺牲了一部分创业生态开放性，但换来规模化执行能力。',
    whyItMattersKo:
      'AI 실제 적용은 고객, 데이터, 장비, 채널 및 자본이 필요합니다. 한국 재벌은 이러한 요소들을 소수의 그룹에 집중시키며, 스타트업 생태계의 일부 개방성을 희생했지만, 규모화된 실행 능력을 얻었습니다.',
    whyItMattersJa:
      'AI の実装には、顧客、データ、設備、チャネル、資本が必要です。韓国の財閥はこれらの要素を少数の集団に集中させることで、スタートアップエコシステムの開放性の一部を犠牲にしましたが、規模化された実行能力を得ることができました。',
    whyItMattersEn:
      'AI deployment needs customers, data, devices, channels, and capital. Korean conglomerates concentrate these inputs in a few groups, trading some startup openness for scaled execution.',
    singaporeTakeaway:
      '新加坡没有三星式工业巨头，但有 DBS、Singtel、NCS、Grab、Sea、ST Engineering、Changi 等平台型企业。关键是把它们变成国家级 AI 应用牵引方。',
    singaporeTakeawayKo:
      '싱가포르는 삼성식 산업 거인을 보유하지 않지만, DBS, Singtel, NCS, Grab, Sea, ST Engineering, Changi 등 플랫폼형 기업을 보유하고 있습니다. 핵심은 이들을 국가급 AI 응용 견인 주체로 변환하는 것입니다.',
    singaporeTakeawayJa:
      'シンガポールはサムスン式の産業巨頭を持たないが、DBS、Singtel、NCS、Grab、Sea、ST Engineering、Changi などのプラットフォーム型企業を有しています。重要なのは、それらを国家級 AI アプリケーション推進レバーに変えることです。',
    singaporeTakeawayEn:
      'Singapore does not have a Samsung-like industrial giant, but it has DBS, Singtel, NCS, Grab, Sea, ST Engineering, Changi, and other platform firms. The key is making them national AI deployment anchors.',
    facts: [
      {
        label: '政策背景',
        labelKo: '정책 배경',
        labelJa: '政策の背景',
        labelEn: 'Policy context',
        value: 'AI 基本法 / K-AI 战略',
        valueKo: 'AI 기본법 / K-AI 전략',
        valueJa: 'AI 基本法 / K-AI 戦略',
        valueEn: 'AI Basic Act / K-AI Strategy',
      },
      {
        label: '资本背景',
        labelKo: '자본 배경',
        labelJa: '資本背景',
        labelEn: 'Capital context',
        value: '₩100 万亿公私 AI 基金',
        valueKo: '₩100조 공민 AI 기금',
        valueJa: '₩100兆官民AIファンド',
        valueEn: '₩100 trillion public-private AI fund',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '产业规模化部署',
        valueKo: '산업 규모화 배포',
        valueJa: '産業規模での展開',
        valueEn: 'Industrial-scale deployment',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 수 있는 점',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: '韩国的案例说明，大企业集团可以成为 AI 采用的加速器。它们同时拥有算力采购能力、数据资产、工程团队、终端用户和国际销售网络。',
        bodyKo:
          '한국의 사례는 대기업 그룹이 AI 도입의 가속기가 될 수 있음을 보여줍니다. 이들은 동시에 계산 능력 조달 역량, 데이터 자산, 엔지니어링 팀, 최종 사용자 및 국제 판매 네트워크를 보유하고 있습니다.',
        bodyJa:
          '韓国の事例は、大企業グループが AI 採用のアクセレーターになり得ることを示しています。それらは同時に、計算能力調達能力、データ資産、エンジニアリングチーム、エンドユーザー、および国際販売ネットワークを有しています。',
        bodyEn:
          'Korea shows how large enterprise groups can accelerate AI adoption. They hold compute-purchasing power, data assets, engineering teams, end users, and international sales networks at once.',
        bullets: ['模型和硬件协同', 'AI 基本法提供更强法律框架', '大企业客户和部署场景集中'],
        bulletsEn: [
          'Coordination between models and hardware',
          'AI Basic Act provides a stronger legal frame',
          'Large enterprise customers and deployment contexts are concentrated',
        ],
        bulletsJa: [
          'モデルとハードウェアが連携',
          'AI 基本法がより強い法的枠組みを提供',
          '大企業顧客と導入シーンが集中',
        ],
        bulletsKo: [
          '모델과 하드웨어의 협력',
          'AI 기본법이 더 강한 법적 프레임 제공',
          '대기업 고객과 배포 시나리오가 집중',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 포인트',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '财阀主导也可能压缩创业空间，形成少数大集团内部创新。对新加坡而言，不能只看规模，也要看生态开放度。',
        bodyKo:
          '재벌 주도 역시 창업 공간을 압축하고 소수 대형 집단 내부의 혁신을 형성할 수 있습니다. 싱가포르의 입장에서는 규모만 봐서는 안 되며, 생태계 개방도도 봐야 합니다.',
        bodyJa:
          '財閥主導は起業空間を圧縮し、少数の大規模グループ内部での革新を形成する可能性があります。シンガポールにとって、規模だけを見ることはできません。エコシステムの開放度も見る必要があります。',
        bodyEn:
          'Chaebol dominance can also compress startup space and keep innovation inside a few groups. For Singapore, scale must be read together with ecosystem openness.',
      },
    ],
    sources: [
      { label: 'K-AI Strategy（2019）', labelEn: 'K-AI Strategy (2019)' },
      {
        label: 'AI 基本法全文（2024）',
        labelKo: 'AI 기본법 전문(2024)',
        labelJa: 'AI 基本法 全文（2024）',
        labelEn: 'Full text of the AI Basic Act (2024)',
      },
    ],
  },
  {
    id: 'burokratt',
    addedAt: '2026-05-04',
    topicIds: ['public-sector'],
    flag: '🇪🇪',
    name: 'Bürokratt',
    nameEn: 'Bürokratt',
    type: '政府 AI 助手',
    typeKo: '정부 AI 조수',
    typeJa: '政府 AI アシスタント',
    typeEn: 'Government AI assistant',
    region: '爱沙尼亚',
    regionKo: '에스토니아',
    regionJa: 'エストニア',
    regionEn: 'Estonia',
    owner: '爱沙尼亚数字政府体系',
    ownerKo: '에스토니아 디지털 정부 체계',
    ownerJa: 'エストニアのデジタル政府体系',
    ownerEn: 'Estonian digital government ecosystem',
    status: '政府服务用例推进中',
    statusKo: '정부 서비스 사용 사례 추진 중',
    statusJa: '政府サービスユースケース推進中',
    statusEn: 'Government-service deployment underway',
    headline: '爱沙尼亚证明，小预算也能做出高密度政府 AI 用例。',
    headlineKo: '에스토니아는 작은 예산으로도 높은 밀도의 정부 AI 사용 사례를 만들 수 있음을 입증합니다.',
    headlineJa: 'エストニアは、小予算でも高密度な政府 AI ユースケースを実現できることを示しています。',
    headlineEn: 'Estonia shows that a small budget can still produce dense government AI use cases.',
    summary:
      'Bürokratt 是爱沙尼亚 Kratt AI 战略的代表项目，用虚拟助手把多个政府服务入口连接起来。它最值得观察的不是模型规模，而是数字政府基础和执行效率。',
    summaryKo:
      'Bürokratt는 에스토니아 Kratt AI 전략의 대표 프로젝트로, 가상 조수를 사용하여 여러 정부 서비스 입구를 연결합니다. 가장 주목할 가치가 있는 것은 모델 규모가 아니라 디지털 정부 기반과 실행 효율입니다.',
    summaryJa:
      'Bürokratt はエストニアの Kratt AI 戦略を代表するプロジェクトで、仮想アシスタントを用いて複数の政府サービスポータルを接続しています。最も観察する価値があるのはモデルの規模ではなく、デジタル政府の基盤と実行効率です。',
    summaryEn:
      'Bürokratt is the representative project of Estonia’s Kratt AI strategy, connecting multiple government-service entry points through a virtual assistant. The key is not model size, but digital-government foundations and execution efficiency.',
    whyItMatters:
      '爱沙尼亚用约 €1000 万 AI 预算实现 50+ 政府 AI 用例，说明 AI 政府服务的瓶颈常常不是钱，而是数据互通、身份系统、流程简化和快速试验。',
    whyItMattersKo:
      '에스토니아는 약 €1000만 AI 예산으로 50+ 정부 AI 사용 사례를 구현했으며, AI 정부 서비스의 병목이 종종 비용이 아니라 데이터 상호 운통, 신원 시스템, 프로세스 단순화 및 빠른 시범임을 보여줍니다.',
    whyItMattersJa:
      'エストニアは約€1000万のAI予算で50以上の政府AI用例を実現しており、これはAI政府サービスのボトルネックが往々にして資金ではなく、むしろデータ相互運用性、身分システム、プロセス簡素化、および迅速な実験であることを示しています。',
    whyItMattersEn:
      'Estonia’s roughly €10 million AI budget and 50+ government AI use cases show that the bottleneck in AI public services is often not money, but data interoperability, identity systems, process simplification, and fast experimentation.',
    singaporeTakeaway:
      '新加坡同样具备强数字政府基础。可学习的是把 AI 用例拆小、快速上线、持续整合，而不是只推出少数大型示范项目。',
    singaporeTakeawayKo:
      '싱가포르도 마찬가지로 강력한 디지털 정부 기반을 갖추고 있습니다. 배울 수 있는 것은 AI 사용 사례를 작게 분해하고, 빠르게 온라인화하고, 지속적으로 통합하는 것이지, 소수의 대형 시범 프로젝트만 출시하는 것이 아닙니다.',
    singaporeTakeawayJa:
      'シンガポールは同様に強力なデジタル政府基盤を備えています。学べることは、AI用例を細分化し、迅速にローンチし、継続的に統合することであり、少数の大型実証プロジェクトのみを展開することではないということです。',
    singaporeTakeawayEn:
      'Singapore also has strong digital-government foundations. The lesson is to break AI use cases into small deployable pieces, ship quickly, and keep integrating, rather than relying only on a few large flagship projects.',
    facts: [
      {
        label: '公开用例',
        labelKo: '공개 사용 사례',
        labelJa: '公開ユースケース',
        labelEn: 'Published use cases',
        value: '50+ 政府 AI 用例',
        valueKo: '50+ 정부 AI 사용 사례',
        valueJa: '50+ 政府 AI ユースケース',
        valueEn: '50+ government AI use cases',
      },
      {
        label: '预算口径',
        labelKo: '예산 기준',
        labelJa: '予算口径',
        labelEn: 'Budget signal',
        value: '€1000 万级',
        valueKo: '€1000만 규모',
        valueJa: '€1000万 規模',
        valueEn: '€10 million scale',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '政府 AI 执行效率',
        valueKo: '정부 AI 실행 효율',
        valueJa: '政府 AI 実行効率',
        valueEn: 'Government AI execution efficiency',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 수 있는 점',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'Bürokratt 建立在 e-Residency、X-Road 和高度在线化政府服务之上。它说明 AI 公共服务的前提是长期数字化基础设施，而不是突然买一个聊天机器人。',
        bodyKo:
          'Bürokratt는 e-Residency, X-Road 및 고도로 온라인화된 정부 서비스를 기반으로 구축됩니다. AI 공공 서비스의 전제 조건이 장기적인 디지털화 기반 시설이지, 갑자기 채팅 봇을 사는 것이 아님을 보여줍니다.',
        bodyJa:
          'Bürokratt は e-Residency、X-Road、および高度にデジタル化された政府サービスの上に構築されています。これは、AI 公共サービスの前提が、急遽チャットボットを購入することではなく、長期的なデジタル基盤インフラストラクチャであることを示しています。',
        bodyEn:
          'Bürokratt builds on e-Residency, X-Road, and highly online public services. It shows that AI public service depends on long-term digital infrastructure, not suddenly buying a chatbot.',
        bullets: ['数字身份和数据交换平台是前提', '政府服务流程已高度在线化', '小预算倒逼用例优先级清晰'],
        bulletsEn: [
          'Digital identity and data exchange are prerequisites',
          'Public services are already highly online',
          'Small budgets force clear prioritisation',
        ],
        bulletsJa: [
          'デジタル ID とデータ交換基盤が前提',
          '行政サービスプロセスが高度にオンライン化済み',
          '小さな予算がユースケース優先度の明確化を迫る',
        ],
        bulletsKo: [
          '디지털 신원과 데이터 교환 플랫폼이 전제',
          '정부 서비스 절차가 고도로 온라인화됨',
          '작은 예산이 사용 사례 우선순위를 명확히 하도록 압박',
        ],
      },
      {
        title: '不可直接复制处',
        titleKo: '직접 복제할 수 없는 부분',
        titleJa: '直接コピー不可箇所',
        titleEn: 'What cannot be copied directly',
        body: '爱沙尼亚人口和行政复杂度远小于新加坡，经验不能等比例外推。它的价值在方法论，而不是规模。',
        bodyKo:
          '에스토니아의 인구와 행정 복잡도는 싱가포르보다 훨씬 작아서 경험을 등비율로 외삽할 수 없습니다. 그 가치는 방법론에 있으며, 규모가 아닙니다.',
        bodyJa:
          'エストニアの人口と行政的複雑性はシンガポールよりもはるかに小さく、その経験は等比例で外挿することはできません。その価値は規模ではなく、方法論にあります。',
        bodyEn:
          'Estonia’s population and administrative complexity are far smaller than Singapore’s. The lesson does not scale linearly; its value is methodological, not scale-based.',
      },
    ],
    sources: [
      { label: 'Estonia Kratt AI Strategy（2019）', labelEn: 'Estonia Kratt AI Strategy (2019)' },
      {
        label: 'e-Estonia 官方报告',
        labelKo: 'e-Estonia 공식 보고서',
        labelJa: 'e-Estonia 公式レポート',
        labelEn: 'e-Estonia official reports',
      },
    ],
  },
  {
    id: 'elements-of-ai',
    addedAt: '2026-05-04',
    topicIds: ['talent-education'],
    flag: '🇫🇮',
    name: 'Elements of AI',
    nameEn: 'Elements of AI',
    type: '全民 AI 教育项目',
    typeKo: '전국민 AI 교육 프로젝트',
    typeJa: '全国民向け AI 教育プログラム',
    typeEn: 'Mass AI education programme',
    region: '芬兰',
    regionKo: '핀란드',
    regionJa: 'フィンランド',
    regionEn: 'Finland',
    owner: 'University of Helsinki / Reaktor',
    ownerEn: 'University of Helsinki / Reaktor',
    status: '持续开放课程',
    statusKo: '지속적 개방 과정',
    statusJa: '継続開放課程',
    statusEn: 'Ongoing open course',
    headline: '芬兰把 AI 战略从专家政策变成全民素养工程。',
    headlineKo: '핀란드는 AI 전략을 전문가 정책에서 전국민 소양 프로젝트로 변환했습니다.',
    headlineJa: 'フィンランドは AI 戦略を専門家政策から国民全体のリテラシープログラムへ転換しました。',
    headlineEn: 'Finland turns AI strategy from expert policy into mass literacy.',
    summary:
      'Elements of AI 是芬兰最有全球传播力的 AI 项目。它用开放课程把 AI 基础知识从专家圈层扩展到普通公民、教师、企业员工和公务员。',
    summaryKo:
      'Elements of AI는 핀란드에서 가장 전 세계적 확산력을 지닌 AI 프로젝트입니다. 개방형 온라인 강좌를 통해 AI 기초 지식을 전문가 영역에서 일반 시민, 교사, 기업 직원, 공무원으로 확대합니다.',
    summaryJa:
      'Elements of AI はフィンランドで最もグローバルな発信力を持つ AI プロジェクトです。オープンな教育課程により、AI の基礎知識を専門家層から一般市民、教師、企業従業員、公務員へと拡大しています。',
    summaryEn:
      'Elements of AI is Finland’s most globally visible AI project. Through an open course, it moves AI literacy from expert circles to citizens, teachers, employees, and civil servants.',
    whyItMatters:
      'AI 采用不是只靠模型和预算。一个社会是否理解 AI、能否提出好问题、能否识别风险，决定了政策和产业落地速度。',
    whyItMattersKo:
      'AI 도입은 모델과 예산만으로 이루어지지 않습니다. 사회가 AI를 이해하는지, 좋은 질문을 제시할 수 있는지, 위험을 식별할 수 있는지가 정책과 산업 실행 속도를 결정합니다.',
    whyItMattersJa:
      'AI採用は、モデルと予算だけでは成り立ちません。社会がAIを理解し、良い質問を提起でき、リスクを識別できるかが、政策と産業の導入スピードを決定します。',
    whyItMattersEn:
      'AI adoption is not driven only by models and budgets. A society’s ability to understand AI, ask good questions, and recognise risks shapes policy and industry adoption speed.',
    singaporeTakeaway:
      '新加坡有 SkillsFuture 和各类 AI 训练计划，但可以更明确地打造一个全民可识别、可传播的 AI 素养品牌。',
    singaporeTakeawayKo:
      '싱가포르는 SkillsFuture와 다양한 AI 훈련 계획을 가지고 있지만, 전국민이 인식할 수 있고 전파할 수 있는 AI 소양 브랜드를 더욱 명확하게 구축할 수 있습니다.',
    singaporeTakeawayJa:
      'シンガポールは SkillsFuture と各種の AI 訓練計画を備えていますが、国民全体が認識でき、伝播可能な AI リテラシー ブランドをより明確に構築することができます。',
    singaporeTakeawayEn:
      'Singapore has SkillsFuture and many AI training programmes, but it can build a more recognisable and shareable national AI literacy brand.',
    facts: [
      {
        label: '覆盖信号',
        labelKo: '적용 범위 신호',
        labelJa: 'カバレッジ信号',
        labelEn: 'Reach signal',
        value: '曾覆盖芬兰 1% 人口',
        valueKo: '핀란드 인구의 1%를 이전에 적용했음',
        valueJa: 'かつてフィンランドの人口1%をカバーしていました。',
        valueEn: 'Reached 1% of Finland’s population',
      },
      {
        label: '传播方式',
        labelKo: '배포 방식',
        labelJa: '発信方法',
        labelEn: 'Distribution',
        value: '开放在线课程',
        valueKo: '개방형 온라인 강좌',
        valueJa: 'オープンオンラインコース',
        valueEn: 'Open online course',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: 'AI 全民素养',
        valueKo: 'AI 전국민 리터러시',
        valueJa: 'AI 国民全体のリテラシー',
        valueEn: 'Mass AI literacy',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 대상',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'Elements of AI 的聪明之处在于降低心理门槛。它不把 AI 包装成少数工程师的黑箱，而是让普通人理解概念、限制和使用场景。',
        bodyKo:
          'Elements of AI의 영리한 점은 심리적 진입장벽을 낮추는 것입니다. AI를 소수 엔지니어의 블랙박스로 포장하지 않고, 일반인이 개념, 제약, 사용 사례를 이해하게 합니다.',
        bodyJa:
          'Elements of AI の優れた点は、心理的ハードルを下げることにあります。AI を少数のエンジニアのブラックボックスとしてパッケージするのではなく、普通の人が概念、限界、使用シナリオを理解できるようにしています。',
        bodyEn:
          'The smart part of Elements of AI is lowering the psychological threshold. It does not frame AI as a black box for engineers only; it helps ordinary people understand concepts, limits, and use cases.',
        bullets: ['低门槛、可规模化', '与人本 AI 伦理叙事一致', '可成为国家品牌资产'],
        bulletsEn: [
          'Low barrier and scalable',
          'Aligned with a human-centric AI ethics narrative',
          'Can become a national brand asset',
        ],
        bulletsJa: ['低い参加ハードルとスケール可能性', '人間中心 AI 倫理の叙事と整合', '国家ブランド資産になり得る'],
        bulletsKo: ['낮은 진입장벽과 확장성', '인간 중심 AI 윤리 서사와 일치', '국가 브랜드 자산이 될 수 있음'],
      },
      {
        title: '后续追踪',
        titleKo: '추후 추적',
        titleJa: 'フォローアップ',
        titleEn: 'What to track next',
        body: '课程影响力要看是否进入企业培训、公务员培训、教师培训和终身学习体系，而不是只看报名人数。',
        bodyKo:
          '강좌의 영향력은 기업 교육, 공무원 교육, 교사 교육 및 평생 학습 체계에 포함되는지 여부를 봐야 하며, 등록자 수만 봐서는 안 됩니다.',
        bodyJa:
          '課程の影響力は、登録人数のみではなく、企業研修、公務員研修、教員研修、および生涯学習体系に採択されているかどうかで評価されるべきです。',
        bodyEn:
          'The course’s impact should be measured by whether it enters corporate training, civil-service training, teacher training, and lifelong-learning systems, not just enrolment counts.',
      },
    ],
    sources: [
      {
        label: 'Finland AI Strategy（2017/2019 更新）',
        labelKo: 'Finland AI Strategy (2017/2019 업데이트)',
        labelJa: 'フィンランド AI 戦略（2017/2019 更新）',
        labelEn: 'Finland AI Strategy (2017, updated 2019)',
      },
      {
        label: 'Elements of AI 官方统计',
        labelKo: 'Elements of AI 공식 통계',
        labelJa: 'Elements of AI 公式統計',
        labelEn: 'Elements of AI official statistics',
      },
    ],
  },
  {
    id: 'eth-ai-center',
    addedAt: '2026-05-04',
    topicIds: ['infrastructure-research', 'talent-education'],
    flag: '🇨🇭',
    name: 'ETH AI Center',
    nameEn: 'ETH AI Center',
    type: '大学研究中心',
    typeKo: '대학 연구 센터',
    typeJa: '大学研究センター',
    typeEn: 'University research centre',
    region: '瑞士',
    regionKo: '스위스',
    regionJa: 'スイス',
    regionEn: 'Switzerland',
    owner: 'ETH Zurich',
    ownerEn: 'ETH Zurich',
    status: '世界级研究节点',
    statusKo: '세계 수준의 연구 허브',
    statusJa: '世界水準の研究ノード',
    statusEn: 'World-class research node',
    headline: '瑞士的 AI 竞争力来自高密度基础研究和国际人才吸引力。',
    headlineKo: '스위스의 AI 경쟁력은 고밀도 기초 연구와 국제 인재 흡인력에서 나옵니다.',
    headlineJa: 'スイスの AI 競争力は、高密度基礎研究と国際人材吸引力に由来しています。',
    headlineEn: 'Switzerland’s AI strength comes from dense fundamental research and global talent pull.',
    summary:
      'ETH AI Center 代表瑞士的研究型路径：不追求强监管或大规模产业补贴，而是依托 ETH/EPFL、企业实验室和国际组织网络建立研究质量优势。',
    summaryKo:
      'ETH AI Center는 스위스의 연구 기반 경로를 대표합니다. 강력한 규제나 대규모 산업 보조금을 추구하지 않고, ETH/EPFL, 기업 실험실, 국제 조직 네트워크에 의존하여 연구 품질 우위를 확립합니다.',
    summaryJa:
      'ETH AI Center はスイスの研究志向型アプローチを代表しており、厳格な規制や大規模な産業補助金を追求するのではなく、むしろ ETH/EPFL、企業ラボ、および国際機関のネットワークに依拠して、研究品質の優位性を構築しています。',
    summaryEn:
      'The ETH AI Center represents Switzerland’s research-led path: not heavy regulation or large industrial subsidies, but research quality built on ETH/EPFL, corporate labs, and international-organisation networks.',
    whyItMatters:
      'AI 长期竞争最终仍回到人才、论文、开源、实验室和产业合作。瑞士说明，高成本小国也可以靠顶级研究机构保持全球相关性。',
    whyItMattersKo:
      'AI의 장기 경쟁은 결국 인재, 논문, 오픈소스, 실험실, 산업 협력으로 귀결됩니다. 스위스는 높은 비용의 소국도 최고 수준의 연구 기관에 의존하여 글로벌 관련성을 유지할 수 있음을 보여줍니다.',
    whyItMattersJa:
      'AI における長期的な競争は、結局のところ人材、論文、オープンソース、研究室、産業協力に帰着します。スイスの例が示すように、高コストの小国であっても、一流の研究機関に頼ることで世界的な関連性を保つことができます。',
    whyItMattersEn:
      'Long-run AI competition still returns to talent, papers, open source, labs, and industry collaboration. Switzerland shows that a high-cost small state can remain globally relevant through top research institutions.',
    singaporeTakeaway:
      '新加坡的 NUS/NTU 已经有强排名，下一步要看是否能像 ETH 一样成为全球公司和顶级研究者自然聚集的 AI 研究地址。',
    singaporeTakeawayKo:
      '싱가포르의 NUS/NTU는 이미 강력한 순위를 갖추고 있으며, 다음 단계는 ETH처럼 전 세계 기업과 최고 수준의 연구자들이 자연스럽게 모이는 AI 연구 기관이 될 수 있는지를 봐야 합니다.',
    singaporeTakeawayJa:
      'シンガポールの NUS/NTU は既に強いランキングを持っています。次のステップは、ETH のようにグローバル企業とトップレベルの研究者が自然に集まる AI 研究拠点となることができるかを見ることです。',
    singaporeTakeawayEn:
      'Singapore’s NUS and NTU already rank strongly. The next question is whether they can become, like ETH, a natural AI research address for global firms and top researchers.',
    facts: [
      {
        label: '生态位置',
        labelKo: '생태계 위치',
        labelJa: 'エコシステムポジション',
        labelEn: 'Ecosystem position',
        value: 'ETH/EPFL 研究体系',
        valueKo: 'ETH/EPFL 연구 시스템',
        valueJa: 'ETH/EPFL 研究システム',
        valueEn: 'ETH/EPFL research system',
      },
      {
        label: '外部连接',
        labelKo: '외부 연결',
        labelJa: '外部リンク',
        labelEn: 'External connection',
        value: 'Google Zurich / 国际组织网络',
        valueKo: 'Google Zurich / 국제 조직 네트워크',
        valueJa: 'Google Zurich / 国際組織ネットワーク',
        valueEn: 'Google Zurich / international-organisation networks',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '基础研究质量',
        valueKo: '기초 연구 품질',
        valueJa: '基礎研究の質',
        valueEn: 'Fundamental research quality',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마크할 대상',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: 'ETH AI Center 的价值在于把跨学科研究、企业合作和全球人才品牌集中到一个高可信机构。它是“研究质量本身就是国家资产”的案例。',
        bodyKo:
          'ETH AI Center의 가치는 학제간 연구, 기업 협력, 글로벌 인재 브랜드를 높은 신뢰도를 가진 기관에 집중시키는 것입니다. 이는 「연구 품질 자체가 국가 자산이다」라는 사례입니다.',
        bodyJa:
          'ETH AI Center の価値は、学際的研究、企業協業、およびグローバル人材ブランドを高い信頼性の機関に集約することにあります。それは「研究の質そのものが国家資産である」という事例です。',
        bodyEn:
          'The ETH AI Center concentrates interdisciplinary research, industry collaboration, and global talent brand inside one high-trust institution. It is a case where research quality itself becomes a national asset.',
        bullets: ['基础研究强，产业连接强', '国际人才愿意长期停留', '与瑞士轻监管、创新优先路径一致'],
        bulletsEn: [
          'Strong fundamental research and industry links',
          'International talent has reason to stay',
          'Fits Switzerland’s light-touch, innovation-first path',
        ],
        bulletsJa: [
          '基礎研究が強く、産業接続も強い',
          '国際人材が長期滞在する理由がある',
          'スイスの軽規制・イノベーション優先路線と整合',
        ],
        bulletsKo: [
          '기초 연구가 강하고 산업 연결도 강함',
          '국제 인재가 장기 체류할 이유가 있음',
          '스위스의 가벼운 규제와 혁신 우선 경로에 부합',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 지점',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '研究中心不能自动变成产业规模。瑞士的短板是 AI 创业和应用腹地，新加坡在区域市场连接上反而更有机会。',
        bodyKo:
          '연구 센터는 자동으로 산업 규모로 전환될 수 없습니다. 스위스의 약점은 AI 창업과 응용 기반이며, 싱가포르는 지역 시장 연결에서 오히려 더 큰 기회가 있습니다.',
        bodyJa:
          '研究センターが自動的に産業規模となることはできません。スイスの弱点は AI スタートアップと応用市場の基盤であるのに対し、シンガポールは地域市場の接続においてむしろより多くの機会を有しています。',
        bodyEn:
          'Research centres do not automatically create industrial scale. Switzerland’s weakness is AI startup and application hinterland; Singapore may have more opportunity through regional market access.',
      },
    ],
    sources: [
      { label: 'Swiss Federal AI Strategy（2020/2025）', labelEn: 'Swiss Federal AI Strategy (2020/2025)' },
      {
        label: 'ETH Zurich AI Center 年报',
        labelKo: 'ETH Zurich AI Center 연간 보고서',
        labelJa: 'ETH Zurich AI Center 年報',
        labelEn: 'ETH Zurich AI Center Annual Report',
      },
    ],
  },
  {
    id: 'pan-canadian-ai-institute-network',
    addedAt: '2026-05-04',
    topicIds: ['infrastructure-research'],
    flag: '🇨🇦',
    name: 'Mila / Vector / Amii 研究网络',
    nameKo: 'Mila / Vector / Amii 연구 네트워크',
    nameJa: 'Mila / Vector / Amii 研究ネットワーク',
    nameEn: 'Mila / Vector / Amii Institute Network',
    type: 'AI 研究机构网络',
    typeKo: 'AI 연구 기관 네트워크',
    typeJa: 'AI研究機構ネットワーク',
    typeEn: 'AI institute network',
    region: '加拿大',
    regionKo: '캐나다',
    regionJa: 'カナダ',
    regionEn: 'Canada',
    owner: 'CIFAR / 加拿大 AI 生态',
    ownerKo: 'CIFAR / 캐나다 AI 생태계',
    ownerJa: 'CIFAR / カナダ AI エコシステム',
    ownerEn: 'CIFAR / Canadian AI ecosystem',
    status: '国家 AI 战略核心资产',
    statusKo: '국가 AI 전략 핵심 자산',
    statusJa: '国家 AI 戦略の核心資産',
    statusEn: 'Core asset of the national AI strategy',
    headline: '加拿大的先发优势来自三大研究所和深度学习学术传统。',
    headlineKo: '캐나다의 선발 우위는 세 개의 주요 연구소와 딥러닝 학술 전통에서 비롯됩니다.',
    headlineJa: 'カナダの先発優位は、3つの主要な研究所とディープラーニングの学術伝統に由来しています。',
    headlineEn:
      'Canada’s first-mover advantage comes from three major institutes and the deep-learning academic tradition.',
    summary:
      'Mila、Vector Institute 和 Amii 是泛加拿大 AI 战略最重要的机构资产。它们把 Bengio、Hinton 等学术遗产转化为人才培养、研究合作和创业生态。',
    summaryKo:
      'Mila, Vector Institute, Amii는 범캐나다 AI 전략의 가장 중요한 기관 자산입니다. 이들은 Bengio, Hinton 등의 학술 유산을 인재 양성, 연구 협력, 스타트업 생태계로 전환합니다.',
    summaryJa:
      'Mila、Vector Institute、Amii はパンカナダ AI 戦略の最も重要な機関資産です。それらは Bengio、Hinton などの学術的遺産を人材育成、研究協力、スタートアップエコシステムに転換します。',
    summaryEn:
      'Mila, Vector Institute, and Amii are the most important institutional assets of the Pan-Canadian AI Strategy. They turn the academic legacy of Bengio, Hinton, and others into talent development, research collaboration, and startup ecosystem activity.',
    whyItMatters:
      '加拿大证明，国家 AI 战略的先发优势可以来自大学和研究所，而不必先有本土科技巨头。问题在于如何把研究优势留在本地商业化。',
    whyItMattersKo:
      '캐나다는 국가 AI 전략의 선발 우위가 대학과 연구소에서 비롯될 수 있으며, 반드시 먼저 국내 과학기술 대기업이 있어야 하는 것은 아님을 입증합니다. 문제는 연구 우위를 지역 상용화에 유지하는 방법입니다.',
    whyItMattersJa:
      'カナダは、国家 AI 戦略の先発優位性が大学と研究機関から生まれることができることを証明しています。問題は、研究の優位性をいかにローカルな商業化に保つかということです。',
    whyItMattersEn:
      'Canada shows that a national AI first-mover advantage can come from universities and institutes, not necessarily homegrown tech giants. The challenge is keeping research advantage local through commercialisation.',
    singaporeTakeaway: '新加坡也有强高校和公共研究体系。需要警惕加拿大式“研究强、商业化弱、人才流向美国”的风险。',
    singaporeTakeawayKo:
      '싱가포르도 강력한 대학과 공공 연구 체계를 갖고 있습니다. 캐나다식 「연구는 강하지만 상용화가 약하고 인재가 미국으로 흘러간다」는 위험에 경계해야 합니다.',
    singaporeTakeawayJa:
      'シンガポールも強い大学と公共研究体系を有しています。カナダ式の「研究が強く、商業化が弱く、人材が米国に流出する」というリスクに警戒する必要があります。',
    singaporeTakeawayEn:
      'Singapore also has strong universities and public research. It should watch the Canadian risk pattern: strong research, weaker commercialisation, and talent flowing to larger markets.',
    facts: [
      {
        label: '核心机构',
        labelKo: '핵심 기관',
        labelJa: 'コア機関',
        labelEn: 'Core institutions',
        value: 'Mila / Vector / Amii',
        valueEn: 'Mila / Vector / Amii',
      },
      {
        label: '战略起点',
        labelKo: '전략적 시작점',
        labelJa: '戦略的起点',
        labelEn: 'Strategy origin',
        value: '泛加拿大 AI 战略（2017）',
        valueKo: '범캐나다 AI 전략(2017)',
        valueJa: 'パンカナダ AI 戦略（2017）',
        valueEn: 'Pan-Canadian AI Strategy (2017)',
      },
      {
        label: '比较维度',
        labelKo: '비교 차원',
        labelJa: '比較次元',
        labelEn: 'Benchmark axis',
        value: '研究到商业化转化',
        valueKo: '연구에서 상용화로의 전환',
        valueJa: '研究から商業化への転換',
        valueEn: 'Research-to-commercialisation conversion',
      },
    ],
    sections: [
      {
        title: '可对标之处',
        titleKo: '벤치마킹 가능한 요소',
        titleJa: 'ベンチマーク可能な点',
        titleEn: 'What makes it benchmarkable',
        body: '三大研究所让加拿大在全球 AI 学术网络中占住关键节点。它们不是单点实验室，而是覆盖人才、企业合作、政府资金和国际声誉的机构网络。',
        bodyKo:
          '세 개의 주요 연구소는 캐나다가 전 지구적 AI 학술 네트워크에서 핵심 노드를 점유하게 합니다. 이들은 단순한 포인트 실험실이 아니라 인재, 기업 협력, 정부 자금, 국제 평판을 포함하는 기관 네트워크입니다.',
        bodyJa:
          '3 つの主要研究所は、カナダを世界的な AI 学術ネットワーク内の重要なノードとしています。それらは単一ポイント実験室ではなく、人材、企業協力、政府資金、国際的声誉をカバーする機関ネットワークです。',
        bodyEn:
          'The three institutes give Canada key nodes in the global AI academic network. They are not isolated labs; they cover talent, industry collaboration, government funding, and international reputation.',
        bullets: ['全球首个国家 AI 战略的机构载体', '深度学习学术传统强', 'AI 安全与伦理研究基础好'],
        bulletsEn: [
          'Institutional backbone of the world’s first national AI strategy',
          'Strong deep-learning academic tradition',
          'Good base in AI safety and ethics research',
        ],
        bulletsJa: [
          '世界初の国家 AI 戦略の機関的担い手',
          'ディープラーニングの学術的伝統が強い',
          'AI 安全と倫理研究の基盤が良い',
        ],
        bulletsKo: [
          '세계 최초 국가 AI 전략의 기관적 기반',
          '딥러닝 학술 전통이 강함',
          'AI 안전과 윤리 연구 기반이 좋음',
        ],
      },
      {
        title: '风险点',
        titleKo: '위험 지점',
        titleJa: 'リスク・ポイント',
        titleEn: 'Risk points',
        body: '加拿大的难题是人才和公司容易被美国市场吸走。新加坡如果只做人才训练而缺乏本地高质量应用场景，也会遇到类似流失。',
        bodyKo:
          '캐나다의 과제는 인재와 기업이 미국 시장에 쉽게 흡수된다는 것입니다. 싱가포르가 인재 훈련만 하고 지역 고품질 응용 시나리오가 부족하면 유사한 손실을 겪게 될 것입니다.',
        bodyJa:
          'カナダの課題は、人材と企業が米国市場に容易に吸い込まれることです。シンガポールが人材訓練だけを行い、ローカルな高品質アプリケーションシナリオに欠けていれば、同様の流失に直面することになります。',
        bodyEn:
          'Canada’s difficulty is that talent and companies can be pulled into the US market. If Singapore trains talent without strong local deployment opportunities, it can face a similar leakage pattern.',
      },
    ],
    sources: [
      { label: 'Pan-Canadian AI Strategy（2017/2024）', labelEn: 'Pan-Canadian AI Strategy (2017/2024)' },
      { label: 'CIFAR AI Strategy Reports', labelEn: 'CIFAR AI Strategy Reports' },
    ],
  },
];

export interface InsightItem {
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  text: string;
  textEn?: string;
  textJa?: string;
  textKo?: string;
}

export const insights: InsightItem[] = [
  {
    title: '治理模式分化',
    titleKo: '거버넌스 모델 분화',
    titleJa: 'ガバナンスモデルの分化',
    titleEn: 'Governance Models Diverge',
    text: '各地区在"立法 vs 自律"间分化明显。韩国和台湾选择了 AI 基本法，EU 走强监管路线，而新加坡、以色列、瑞士偏好灵活框架。',
    textKo:
      '각 지역은 「입법 vs 자율」 사이에서 명확한 분화를 보입니다. 한국과 대만은 AI 기본법을 선택했고, EU는 강한 규제 경로를 취했으며, 싱가포르, 이스라엘, 스위스는 유연한 프레임워크를 선호합니다.',
    textJa:
      '各地域は「立法 vs 自律」の間で明らかな分化を示しています。韓国と台湾は AI 基本法を選択し、EU は強力な規制方針を採用し、シンガポール、イスラエル、スイスは柔軟なフレームワークを好みます。',
    textEn:
      'Regions are visibly splitting between "legislation vs self-regulation". South Korea and Taiwan have opted for AI Basic Acts, the EU has taken a heavy-regulation route, while Singapore, Israel and Switzerland prefer flexible frameworks.',
  },
  {
    title: '投资规模悬殊',
    titleKo: '투자 규모 격차',
    titleJa: '投資規模の格差',
    titleEn: 'Investment Scales Vary Wildly',
    text: '韩国 ₩100 万亿和 UAE $100B MGX 基金远超其他地区。但爱沙尼亚证明了 €10M 也能实现 50+ 政府 AI 用例——关键在效率而非规模。',
    textKo:
      '한국의 ₩100조와 UAE의 $100B MGX 기금은 다른 지역을 훨씬 초과합니다. 하지만 에스토니아는 €10M으로도 50개 이상의 정부 AI 사용 사례를 실현할 수 있음을 입증했습니다——관건은 규모가 아니라 효율성입니다.',
    textJa:
      '韓国の₩100 兆とアラブ首長国連邦の $100B MGX ファンドは他の地域をはるかに上回ります。しかし、エストニアは €10M でも 50+ の政府 AI ユースケースを実現できることを証明しました——重要なのは効率であり規模ではありません。',
    textEn:
      "South Korea's ₩100 trillion and the UAE's US$100 billion MGX fund dwarf others. But Estonia proves €10 million can deliver 50+ government AI use cases — what matters is efficiency, not scale.",
  },
  {
    title: '人才是核心变量',
    titleKo: '인재는 핵심 변수',
    titleJa: '人材はコア変数です',
    titleEn: 'Talent Is the Core Variable',
    text: '以色列的 8200 部队、加拿大的 Bengio/Hinton、芬兰的全民 AI 教育——每个成功的 AI 策略背后都有独特的人才来源。',
    textKo:
      '이스라엘의 8200부대, 캐나다의 Bengio/Hinton, 핀란드의 전 국민 AI 교육——모든 성공한 AI 전략 뒤에는 독특한 인재 출처가 있습니다.',
    textJa:
      'イスラエルの 8200 ユニット、カナダの Bengio/Hinton、フィンランドの国民向け AI 教育——成功するすべての AI 戦略の背後には、独特な人材源があります。',
    textEn:
      "Israel's Unit 8200, Canada's Bengio/Hinton, Finland's mass AI education — every successful AI strategy is backed by a distinctive talent source.",
  },
  {
    title: '新加坡的独特定位',
    titleKo: '싱가포르의 독특한 위상',
    titleJa: 'シンガポールのユニークなポジショニング',
    titleEn: "Singapore's Distinctive Position",
    text: '新加坡在治理框架成熟度（AI Verify）、执行纪律和国际信任度上领先，但在投资规模、本土大模型和基础研究上仍有差距。',
    textKo:
      '싱가포르는 거버넌스 프레임워크 성숙도(AI Verify), 실행 규율, 국제 신뢰도에서 앞서 있지만, 투자 규모, 자국 대규모 모델, 기초 연구에서는 여전히 격차가 있습니다.',
    textJa:
      'シンガポールは、ガバナンスフレームワークの成熟度（AI Verify）、実行規律、国際的信頼度で先行していますが、投資規模、本土大モデル、基礎研究ではまだ格差があります。',
    textEn:
      'Singapore leads on governance maturity (AI Verify), execution discipline and international trust, but trails on investment scale, sovereign large models and fundamental research.',
  },
];

export const dataDate = '2026-02-17';
export const dataDisclaimer =
  '本页数据综合自各国政府官方文件、国际组织报告及公开报道，由 新加坡 AI 观察独立整理。数据截至 2026 年 2 月。';
export const dataDisclaimerEn =
  'Data on this page is compiled from official government documents, international organisation reports and public sources, independently curated by Singapore AI Observatory. Data as of February 2026.';
export const dataDisclaimerJa =
  '本ページのデータは各国政府の公式文書、国際機関の報告書、公開報道を基に、シンガポール AI 観測が独自に整理したものです。データは 2026 年 2 月時点。';
export const dataDisclaimerKo =
  '이 페이지의 데이터는 각국 정부의 공식 문서, 국제기구 보고서 및 공개 보도를 종합하여 Singapore AI Observatory가 독립적으로 정리한 것입니다. 데이터는 2026년 2월 기준입니다.';

/** One annual edition of an external benchmark report series (currently the
 *  Stanford HAI AI Index). Promoted from autoDiscovered[] on 2026-07-28 —
 *  these entries carried complete four-language summaries but sat in an
 *  array no page renders. Rendered as the "Report Archive" section on
 *  /benchmarking. */
export interface BenchmarkReportEdition {
  year: number;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo: string;
  sourceUrl: string;
  /** YYYY-MM-DD; when this edition entered the archive (rule #7). */
  addedAt?: string;
}

// Note: there is NO 2020 edition — the AI Index skipped from the December
// 2019 report to the March 2021 report. hai.stanford.edu/ai-index/
// 2020-ai-index-report returns a soft-404 (HTTP 200, body "404") — do not
// "complete" the sequence with it.
export const reportArchive: BenchmarkReportEdition[] = [
  {
    year: 2026,
    title: '2026年AI指数报告',
    titleEn: 'The 2026 AI Index Report',
    titleJa: '2026年AI指数レポート',
    titleKo: '2026년 AI 지수 보고서',
    description:
      '斯坦福 HAI 第九版年度 AI 指数报告，九章覆盖研发、技术性能、负责任 AI、经济、科学、医学、政策、教育与公众舆论。核心判断：AI 能力没有进入平台期，反而在加速——2025 年产业界产出 90% 以上的前沿模型，多个模型在博士级科学问题、多模态推理与竞赛数学上达到或超过人类基线；SWE-bench Verified 编程基准一年内从 60% 升至接近 100%；组织采用率达 88%，五分之四的大学生已在使用生成式 AI。',
    descriptionEn:
      "Stanford HAI's ninth annual AI Index Report, spanning nine chapters across R&D, technical performance, responsible AI, economy, science, medicine, policy, education and public opinion. Its central finding: AI capability is not plateauing but accelerating — industry produced over 90% of notable frontier models in 2025, several of which meet or exceed human baselines on PhD-level science questions, multimodal reasoning and competition mathematics; performance on the SWE-bench Verified coding benchmark rose from 60% to near 100% in a single year; organisational adoption reached 88%, and four in five university students now use generative AI.",
    descriptionJa:
      'スタンフォード HAI の第 9 版年次 AI 指数レポート。研究開発、技術性能、責任ある AI、経済、科学、医学、政策、教育、世論の 9 章構成。中心的な結論：AI の能力は頭打ちではなく加速している——2025 年には産業界が著名なフロンティアモデルの 90% 以上を産出し、その多くが博士レベルの科学問題、マルチモーダル推論、競技数学で人間のベースラインに到達または超過した。SWE-bench Verified コーディングベンチマークの性能は 1 年で 60% から 100% 近くまで上昇し、組織の採用率は 88% に達し、大学生の 5 人に 4 人が生成 AI を使用している。',
    descriptionKo:
      '스탠퍼드 HAI의 제9판 연례 AI 지수 보고서로, 연구개발, 기술 성능, 책임 있는 AI, 경제, 과학, 의학, 정책, 교육, 여론의 9개 장으로 구성됩니다. 핵심 결론: AI 능력은 정체되지 않고 가속화되고 있습니다——2025년 산업계가 주요 프런티어 모델의 90% 이상을 산출했으며, 여러 모델이 박사급 과학 문제, 멀티모달 추론, 경시 수학에서 인간 기준선에 도달하거나 초과했습니다. SWE-bench Verified 코딩 벤치마크 성능은 1년 만에 60%에서 100% 가까이로 상승했으며, 조직 채택률은 88%에 달하고 대학생 5명 중 4명이 생성형 AI를 사용하고 있습니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2026-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2025,
    title: '2025年AI指数报告',
    titleEn: 'The 2025 AI Index Report',
    titleJa: '2025年AI指数レポート',
    titleKo: '2025년 AI 지수 보고서',
    description:
      '斯坦福 HAI 年度 AI 指数报告，首次同步发布官方中文版。要点：MMMU / GPQA / SWE-bench 等高难基准一年内分别提升 18.8 / 48.9 / 67.3 个百分点；2024 年美国私人 AI 投资 1091 亿美元（约为中国 12 倍），78% 的组织已使用 AI；美国产出 40 个著名模型对中国 15 个，但中美模型在 MMLU 等基准上的差距缩至接近持平；GPT-3.5 级推理成本自 2022 年 11 月以来下降超 280 倍；2024 年美国联邦机构出台 59 项 AI 相关法规，为 2023 年的两倍多。',
    descriptionEn:
      "Stanford HAI's annual AI Index Report, published for the first time with an official Chinese translation. Highlights: scores on the demanding MMMU, GPQA and SWE-bench benchmarks rose 18.8, 48.9 and 67.3 percentage points respectively in one year; US private AI investment reached $109.1 billion in 2024 (about 12 times China's), with 78% of organisations using AI; the US produced 40 notable models to China's 15, yet Chinese models closed the MMLU-class performance gap to near parity; inference cost at GPT-3.5 level fell over 280-fold since November 2022; and US federal agencies introduced 59 AI-related regulations in 2024, more than double 2023.",
    descriptionJa:
      'スタンフォード HAI の年次 AI 指数レポート。初めて公式中国語版が同時公開された。要点：MMMU / GPQA / SWE-bench などの高難度ベンチマークが 1 年でそれぞれ 18.8 / 48.9 / 67.3 ポイント向上。2024 年の米国民間 AI 投資は 1,091 億ドル（中国の約 12 倍）で、78% の組織が AI を使用。米国は 40 の著名モデルを産出（中国は 15）だが、中国モデルは MMLU 級ベンチマークでの差をほぼ互角まで縮めた。GPT-3.5 級の推論コストは 2022 年 11 月以来 280 倍以上低下。2024 年に米国連邦機関は 59 の AI 関連規制を導入し、2023 年の 2 倍超となった。',
    descriptionKo:
      '스탠퍼드 HAI의 연례 AI 지수 보고서로, 처음으로 공식 중국어판이 동시 발표되었습니다. 요점: MMMU / GPQA / SWE-bench 등 고난도 벤치마크가 1년 만에 각각 18.8 / 48.9 / 67.3 퍼센트포인트 상승했습니다. 2024년 미국 민간 AI 투자는 1,091억 달러(중국의 약 12배)이며 조직의 78%가 AI를 사용하고 있습니다. 미국은 40개의 주요 모델을 산출했고(중국은 15개), 중국 모델은 MMLU급 벤치마크 격차를 거의 대등한 수준까지 좁혔습니다. GPT-3.5급 추론 비용은 2022년 11월 이래 280배 이상 하락했으며, 2024년 미국 연방 기관은 59개의 AI 관련 규제를 도입해 2023년의 2배를 넘었습니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2024,
    title: '2024年AI指数报告',
    titleEn: 'The 2024 AI Index Report',
    titleJa: '2024年のAIインデックスレポート',
    titleKo: '2024년 AI 지수 보고서',
    description:
      '斯坦福大学人工智能中心发布的第七版《AI指数报告》，全面追踪全球AI发展趋势。报告涵盖AI研究开发、技术性能、负责任AI、经济、科学医学、教育、政策治理、多样性和公众舆论等九个领域。主要发现包括：美国在顶级AI模型生产中领先中国和欧盟，生成式AI投资从2022年的25.2亿美元大幅增长，AI显著提升劳动力生产效率，美国AI相关监管在五年内从1项增至25项。全球公众对AI的认知和关注度持续提升，但忧虑程度也在上升。',
    descriptionEn:
      "Stanford HAI's seventh edition of the AI Index Report, providing comprehensive tracking of global AI development trends. The report analyzes nine dimensions: AI research and development, technical performance, responsible AI, economic impact, science and medicine applications, education, policy and governance, diversity, and public opinion. Key findings include the U.S. leading in top AI model production, generative AI investment surging to $25.2 billion, significant AI-driven labor productivity gains, and U.S. AI regulations rising from one in 2016 to 25 in 2023. Global public awareness of AI's societal impact has increased substantially, with rising concern levels alongside growing recognition of transformative potential.",
    descriptionJa:
      'スタンフォード大学人工知能研究センターが発表した第7版の『AIインデックスレポート』は、世界的なAI発展トレンドを包括的に追跡しています。このレポートはAI研究開発、技術性能、責任あるAI、経済、科学医学、教育、政策ガバナンス、多様性、および世論の9つの領域をカバーしています。主な発見には以下が含まれます：米国は中国とEUを上回るトップレベルのAIモデル生産でリードしており、生成型AI投資は2022年の25億2000万米ドルから大幅に増加し、AIは労働力生産性を著しく向上させており、米国のAI関連規制は5年以内に1件から25件に増加しました。世界中の一般大衆のAIに対する認識と関心は継続的に上昇しており、懸念のレベルも上昇しています。',
    descriptionKo:
      '스탠포드 대학교 인공지능 센터에서 발표한 제7판 『AI 지수 보고서』는 전 세계 AI 발전 추이를 전면적으로 추적합니다. 보고서는 AI 연구개발, 기술 성능, 책임 있는 AI, 경제, 과학 의료, 교육, 정책 거버넌스, 다양성 및 여론 등 9개 영역을 다룹니다. 주요 발견은 다음과 같습니다: 미국이 최고 수준의 AI 모델 생산에서 중국과 유럽연합을 앞서고 있으며, 생성형 AI 투자가 2022년의 25.2억 미국 달러에서 크게 증가했으며, AI가 노동력 생산성을 현저하게 향상시키고 있으며, 미국의 AI 관련 규제가 5년 내에 1건에서 25건으로 증가했습니다. 전 세계 대중의 AI에 대한 인식 및 관심도가 계속 상승하고 있지만, 우려 정도도 역시 상승하고 있습니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2024-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2023,
    title: '2023年AI指数报告',
    titleEn: 'The 2023 AI Index Report',
    titleJa: '2023年AI指数レポート',
    titleKo: '2023년 AI 지수 보고서',
    description:
      '斯坦福 HAI 年度 AI 指数报告，聚焦生成式 AI 元年前后的拐点：产业界首次全面超越学术界成为重要机器学习模型的主要产出方（2022 年 32 个对学术界 3 个）；十年来 AI 私人投资首次同比下降，但仍是 2013 年的 18 倍；AI 相关立法在 127 个受调查国家中从 2016 年的 1 项增至 2022 年的 37 项；对 AI 滥用事件的追踪显示争议事件数量自 2012 年以来增长 26 倍。',
    descriptionEn:
      "Stanford HAI's annual AI Index Report, capturing the inflection around generative AI's breakout year: industry decisively overtook academia as the main producer of significant machine learning models (32 vs 3 in 2022); private AI investment fell year-on-year for the first time in a decade yet remained 18 times its 2013 level; AI-related laws passed across 127 surveyed countries grew from 1 in 2016 to 37 in 2022; and tracked AI misuse incidents rose 26-fold since 2012.",
    descriptionJa:
      'スタンフォード HAI の年次 AI 指数レポート。生成 AI ブレイクの前後の転換点を捉えている：産業界が初めて学術界を全面的に上回り、重要な機械学習モデルの主要な産出者となった（2022 年は 32 対 3）。AI 民間投資は 10 年で初めて前年比減少したが、それでも 2013 年の 18 倍の水準。調査対象 127 カ国での AI 関連立法は 2016 年の 1 件から 2022 年の 37 件に増加。AI 濫用インシデントの追跡では、争議事件が 2012 年以来 26 倍に増えたことが示された。',
    descriptionKo:
      '스탠퍼드 HAI의 연례 AI 지수 보고서로, 생성형 AI 원년 전후의 변곡점을 포착합니다: 산업계가 처음으로 학계를 전면적으로 추월하여 중요한 머신러닝 모델의 주요 산출자가 되었습니다(2022년 32개 대 3개). AI 민간 투자는 10년 만에 처음으로 전년 대비 감소했지만 여전히 2013년의 18배 수준입니다. 조사 대상 127개국의 AI 관련 입법은 2016년 1건에서 2022년 37건으로 증가했으며, AI 오용 사건 추적 결과 논란 사건이 2012년 이래 26배 증가했습니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2023-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2022,
    title: '2022年AI指数报告',
    titleEn: 'The 2022 AI Index Report',
    titleJa: '2022年AI指数報告',
    titleKo: '2022 AI 지수 보고서',
    description:
      '斯坦福大学人工智能研究所(HAI)发布的独立年度AI指数报告。报告追踪AI领域的关键进展：2021年私人投资达93.5亿美元（相比2020年翻倍），美中国际合作最为密切，大语言模型性能提升但偏见加剧，AI伦理研究自2014年增长5倍，AI训练成本自2018年下降63.6%，2021年全球通过18项AI相关法案，机器人手臂成本五年内下降46.2%。报告涵盖研究开发、技术性能、AI伦理、经济教育和政策治理五大章节。',
    descriptionEn:
      "The 2022 AI Index Report from Stanford's Human-Centered AI Institute provides comprehensive benchmarking of global AI progress. Key findings include: private investment surged to $93.5 billion in 2021 (more than double 2020), US-China collaborations dominated cross-country AI research partnerships, large language models achieved record performance while exhibiting increased toxicity and bias, AI ethics research publications grew 5-fold since 2014, image classification training costs declined 63.6% since 2018, global AI legislation increased to 18 bills passed in 25 countries by 2021, and robotic arm prices fell 46.2% over five years. The report spans five chapters covering research and development, technical performance, AI ethics, economy and education, and policy and governance.",
    descriptionJa:
      'スタンフォード大学人工知能研究所（HAI）が発表した独立した年次のAI指数報告書です。報告書はAI分野における主要な進展を追跡しています：2021年、民間投資は93.5億米ドルに達し（2020年比で倍増）、米中国際協力が最も密接であり、大規模言語モデルのパフォーマンスは向上しましたが偏見が悪化し、AI倫理研究は2014年以来5倍増加し、AI訓練コストは2018年以来63.6%低下し、2021年には世界中で18のAI関連法案が可決され、ロボットアームのコストは5年以内に46.2%低下しました。報告書は、研究開発、技術性能、AI倫理、経済教育、政策ガバナンスの5つの主要な章を網羅しています。',
    descriptionKo:
      '스탠포드 대학교 인공지능 연구소(HAI)에서 발표한 독립적인 연례 AI 지수 보고서입니다. 보고서는 AI 분야의 핵심 발전을 추적합니다: 2021년 민간 투자가 93.5억 미국 달러에 달했으며(2020년 대비 2배), 미중 국제 협력이 가장 긴밀하고, 대형 언어 모델의 성능은 향상되었지만 편견은 악화되었으며, AI 윤리 연구는 2014년 이래로 5배 증가했으며, AI 훈련 비용은 2018년 이래로 63.6% 감소했으며, 2021년 전 세계에서 18개의 AI 관련 법안이 통과되었으며, 로봇 팔의 비용은 5년 내에 46.2% 감소했습니다. 보고서는 연구개발, 기술 성능, AI 윤리, 경제 및 교육, 정책 거버넌스의 5개 주요 장을 다룹니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2022-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2021,
    title: '2021年AI指数报告',
    titleEn: 'The 2021 AI Index Report',
    titleJa: '2021年AI指数レポート',
    titleKo: '2021년 AI 지수 보고서',
    description:
      '斯坦福 HAI 年度 AI 指数报告（该系列自 2019 年 12 月版后跳过 2020、于 2021 年 3 月发布本版）。疫情之年的记录：AI 领域私人投资在 2020 年逆势增长 40% 至 679 亿美元，药物研发成为投资最集中的方向；中国在 AI 期刊引用总量上首次超过美国，而美国在会议论文引用与重要模型产出上保持领先。报告也记录了 AI 人才流向产业界加速、多样性数据缺口等结构问题。',
    descriptionEn:
      "Stanford HAI's annual AI Index Report (the series skipped 2020, moving from the December 2019 edition to this March 2021 one). A record of the pandemic year: private AI investment grew 40% against the downturn to $67.9 billion in 2020, with drug discovery the most-funded area; China overtook the US in total AI journal citations for the first time, while the US kept its lead in conference-paper citations and significant model production. The report also documents the accelerating flow of AI talent into industry and persistent gaps in diversity data.",
    descriptionJa:
      'スタンフォード HAI の年次 AI 指数レポート（本シリーズは 2020 年版を跳ばし、2019 年 12 月版の次は 2021 年 3 月発表の本版）。パンデミックの年の記録：2020 年の AI 民間投資は逆風の中 40% 増の 679 億ドルに達し、創薬が最も資金の集まる分野となった。中国は AI 学術誌の総引用数で初めて米国を上回り、米国は会議論文の引用と重要モデルの産出でリードを維持した。レポートは AI 人材の産業界への流出の加速や、多様性データの欠如といった構造的問題も記録している。',
    descriptionKo:
      '스탠퍼드 HAI의 연례 AI 지수 보고서(이 시리즈는 2020년판을 건너뛰고 2019년 12월판 다음이 2021년 3월 발표된 본판입니다). 팬데믹 해의 기록: 2020년 AI 민간 투자는 역풍 속에서도 40% 증가한 679억 달러에 달했으며, 신약 개발이 가장 많은 투자가 집중된 분야였습니다. 중국은 AI 학술지 총 인용 수에서 처음으로 미국을 추월했으며, 미국은 학회 논문 인용과 중요 모델 산출에서 선두를 유지했습니다. 보고서는 AI 인재의 산업계 유입 가속화와 다양성 데이터 격차 등 구조적 문제도 기록하고 있습니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2021-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2019,
    title: '2019年AI指数报告',
    titleEn: 'The 2019 AI Index Report',
    titleJa: '2019年AI指数レポート',
    titleKo: '2019년 AI 지수 보고서',
    description:
      '由斯坦福大学人工智能研究所发布的《2019年AI指数报告》是一份全面的国际AI发展基准研究，涵盖研发、会议、技术性能、经济、教育、自主系统等九个维度。报告通过全球AI活力工具对28个国家的34项指标进行对标，包括研发、经济和包容性三个核心维度。该项目汇集150余位业界与学术专家，致力于提供无偏见、严谨的数据，帮助政策制定者、研究人员和公众理解全球AI发展态势。',
    descriptionEn:
      'The 2019 AI Index Report from Stanford HAI is a comprehensive international AI benchmarking initiative covering nine dimensions including research and development, conferences, technical performance, economy, education, and autonomous systems. The report introduces the Global AI Vibrancy Tool, which benchmarks 28 countries across 34 indicators spanning research and development, economy, and inclusion. Developed with input from over 150 industry and academic experts, the report provides unbiased, rigorous data to help policymakers, researchers, and the public understand the global AI landscape.',
    descriptionJa:
      'スタンフォード大学人工知能研究所により発表された『2019年AI指数レポート』は、研究開発、会議、技術性能、経済、教育、自律システムなど9つの次元をカバーする包括的な国際AI発展ベンチマーク研究です。報告書は、グローバルAI活力ツールを通じて、28カ国における34の指標を対標し、研究開発、経済、および包括性の3つのコア次元を含んでいます。本プロジェクトは業界および学術の150人以上の専門家を結集させ、偏りのない厳密なデータを提供し、政策立案者、研究者、および一般市民が世界的なAI発展状況を理解するのを支援しています。',
    descriptionKo:
      'Stanford University Artificial Intelligence Research Institute가 발표한 「2019년 AI 지수 보고서」는 연구 개발, 회의, 기술 성능, 경제, 교육, 자율 시스템 등 9가지 차원을 포함하는 포괄적 국제 AI 발전 벤치마크 연구입니다. 보고서는 글로벌 AI 활력 도구를 통해 28개 국가의 34개 지표에 대해 벤치마크를 수행하며, 연구 개발, 경제, 포용성 등 3개의 핵심 차원을 포함합니다. 본 프로젝트는 150명 이상의 업계 및 학계 전문가를 모아 편견 없고 엄밀한 데이터를 제공하여 정책 입안자, 연구자 및 일반 대중이 글로벌 AI 발전 동향을 이해할 수 있도록 노력합니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2019-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2018,
    title: '2018年AI指数报告',
    titleEn: 'The 2018 AI Index Report',
    titleJa: '2018年AI指数レポート',
    titleKo: '2018년 AI 지수 보고서',
    description:
      '斯坦福人工智能中心(HAI)发布的2018年AI指数报告，是一项由跨学术和业界的专家组成的独立倡议。报告通过汇总和整理与人工智能相关的多样化指标数据，为政策制定者、研究人员、记者、企业高管和公众提供关于AI领域的无偏见、严谨和全面的认识。报告主要分为四大部分：活动量度(如会议参与度和风险投资规模)、技术性能、衍生指标分析以及AI系统向人工水平靠近的进展。',
    descriptionEn:
      'The Stanford HAI 2018 AI Index Report is an independent initiative led by the AI Index Steering Committee, comprising experts from academia and industry. The report aggregates diverse metrics and data to provide unbiased, rigorous, and comprehensive insights for policymakers, researchers, journalists, executives, and the public to understand the AI field. The report is structured into four main sections: Volume of Activity (including conference attendance and VC investments), Technical Performance, Derivative Measures, and progress towards Human Performance.',
    descriptionJa:
      'スタンフォード大学の人工知能センター（HAI）が発表した2018年AI指数レポートは、学術界と産業界にまたがる専門家で構成された独立したイニシアティブです。報告書は、人工知能に関連する多様な指標データを集約・整理することにより、政策立案者、研究者、ジャーナリスト、企業経営者、および一般市民にAI分野に関する偏りのない厳密で包括的な理解を提供しています。報告書は主に4つの主要部分から構成されています：活動指標（学会参加度およびベンチャー投資規模など）、技術性能、派生指標分析、およびAIシステムが人間レベルに接近する進展です。',
    descriptionKo:
      'Stanford Artificial Intelligence Center(HAI)가 발표한 2018년 AI 지수 보고서는 학계와 산업계 전문가들로 구성된 독립적 이니셔티브입니다. 보고서는 인공지능과 관련된 다양한 지표 데이터를 종합하고 정리함으로써 정책 입안자, 연구자, 기자, 기업 경영진 및 일반 대중에게 AI 분야에 대한 편견 없고 엄밀하며 포괄적인 인식을 제공합니다. 보고서는 주로 네 가지 주요 부분으로 나뉩니다: 활동 측도(회의 참석도 및 벤처 투자 규모 등), 기술 성능, 파생 지표 분석, 그리고 AI 시스템이 인간 수준에 근접하는 진전입니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2018-ai-index-report',
    addedAt: '2026-07-28',
  },
  {
    year: 2017,
    title: '2017年AI指数报告',
    titleEn: 'The 2017 AI Index Report',
    titleJa: '2017年AI指数レポート',
    titleKo: '2017년 AI 지수 보고서',
    description:
      '斯坦福HAI发布的2017年AI指数报告通过汇总活动量（会议参与度、风险投资）、技术性能基准和行业趋势，提供了人工智能进展的全面分析。报告引入"AI活力指数"衡量学术界和产业界的活跃程度，包含专家评论，并追踪AI系统接近或超越人类性能的领域。',
    descriptionEn:
      'The 2017 AI Index Report from Stanford HAI aggregates data on AI progress across volume of activity (conference attendance, VC investments), technical performance benchmarks, and sector-wide trends. The report introduces the AI Vibrancy Index to measure the liveliness of AI development across academia and industry, includes expert commentary, and tracks areas where AI systems approach or exceed human performance. It serves as a foundational resource for understanding AI development.',
    descriptionJa:
      'スタンフォード大学のHAIが発表した2017年AI指数レポートは、活動量（学会参加度、ベンチャー投資）、技術性能ベンチマーク、および業界トレンドを集約することにより、人工知能の進展に関する包括的な分析を提供しています。報告書では「AI活力指数」を導入して、学術界と産業界の活動度を測定し、専門家の見解を含め、AIシステムが人間レベルのパフォーマンスに接近または超越している領域を追跡しています。',
    descriptionKo:
      'Stanford HAI가 발표한 2017년 AI 지수 보고서는 활동량(회의 참석도, 벤처 투자), 기술 성능 벤치마크, 그리고 산업 동향을 종합하여 인공지능의 진행 상황에 대한 포괄적 분석을 제공합니다. 보고서는 「AI 활력 지수」를 도입하여 학계와 산업계의 활동 수준을 측정하며, 전문가 의견을 포함하고 AI 시스템이 인간 수준의 성능에 근접하거나 초월하는 영역을 추적합니다.',
    sourceUrl: 'https://hai.stanford.edu/ai-index/2017-ai-index-report',
    addedAt: '2026-07-28',
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

export const autoDiscovered: AutoDiscoveredEntry[] = [];

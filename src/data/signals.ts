// src/data/signals.ts
// ────────────────────────────────────────────────────────────────────────
// Signals（信号）: the week's noteworthy Singapore AI news, one line of
// judgment each. Written by the weekly auto-PR pipeline
// scripts/refresh/signals/run.ts; spec in docs/signals/spec.md.
//
// Rules (CLAUDE.md): zh / en / ja / ko in the same commit (#5); sourceUrl
// is HTTP-checked before it is written (#6); every record has addedAt (#7).
// New records go at the TOP of the array. `topicIds` come from
// src/data/topics.ts and `related` ids must resolve — scripts/verify-graph.ts
// checks both.
//
// Links: the /signals/ list page links each title to `sourceUrl`. Every
// other surface (updates feed, topic hubs) links to /signals/#<id>.

export type SignalRelatedKind = 'policy' | 'person' | 'ecosystem' | 'startup' | 'debate' | 'video';

export interface SignalRelated {
  kind: SignalRelatedKind;
  /** Record id (policy / person / debate / video) or page slug (ecosystem / startup). */
  id: string;
}

export interface Signal {
  /** 'sig-YYYYMMDD-<slug>', stable. */
  id: string;
  /** Event / publication date, YYYY-MM-DD. */
  date: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  /** One sentence: why this matters for Singapore's AI strategy. */
  whyItMatters: string;
  whyItMattersEn: string;
  whyItMattersJa: string;
  whyItMattersKo: string;
  sourceUrl: string;
  /** Publisher, original English name (no CJK, no sibling fields). */
  sourceName: string;
  /** 1 to 3 ids from src/data/topics.ts. */
  topicIds: string[];
  related?: SignalRelated[];
  addedAt: string;
}

export const signals: Signal[] = [
  {
    id: 'sig-20261104-mddi-ai-incident-reporting-framework',
    date: '2026-11-04',
    title: 'IMDA 与 CSA 研究自主 AI 事故强制报告机制',
    titleEn: 'IMDA and CSA research mandatory autonomous AI incident reporting mechanism',
    titleJa: 'IMDA・CSA 自律AI事故の強制報告制度研究',
    titleKo: 'IMDA와 CSA, 자율 AI 사고 강제 보고 체계 연구',
    whyItMatters:
      'IMDA 与 CSA 承认现行个人数据、网络安全报告制度未覆盖自主 AI 近失事故，但 11 月 4 日的答复仍停留在研究而非修法承诺',
    whyItMattersEn:
      'IMDA and CSA acknowledge that existing personal data and cybersecurity reporting systems do not cover autonomous AI near-miss incidents, but the 4 November response remains at the research stage rather than a commitment to amend legislation.',
    whyItMattersJa:
      'IMDA と CSA は、現行の個人データ・サイバーセキュリティ報告制度が自律 AI のニアミス事案をカバーしていないことを認めています。しかし、11月4日の回答は、依然として研究段階にとどまっており、法律改正への約束ではありません。',
    whyItMattersKo:
      'IMDA와 CSA는 현행 개인 데이터 및 사이버보안 보고 제도가 자율형 인공지능 근접 사건을 포괄하지 못함을 인정했지만, 11월 4일의 답변은 여전히 연구 단계에 머물러 있으며 법안 개정을 약속하지 않았습니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-s-response-to-pq-on-reporting-of-serious-and-near-miss-incidents-involving-autonomous-ai-systems/',
    sourceName: 'MDDI',
    topicIds: ['governance-regulation', 'safety-ethics', 'national-security'],
    related: [{ kind: 'startup', id: 'near' }],
    addedAt: '2026-11-11',
  },
  {
    id: 'sig-20261103-ipos-gemgpt-openai-trademark-ruling',
    date: '2026-11-03',
    title: 'IPOS 裁定 OpenAI 商标异议败诉 GemGPT 过关',
    titleEn: 'IPOS rules against OpenAI in trademark opposition, GemGPT advances',
    titleJa: 'IPOS OpenAI商標異議敗訴 GemGPT承認',
    titleKo: 'IPOS, OpenAI 상표이의 기각…GemGPT 통과',
    whyItMatters: 'IPOS 认定 GPT 并非 OpenAI 专属用语，为新加坡 AI 初创保留通用技术词的命名空间',
    whyItMattersEn:
      "IPOS ruled that GPT is not OpenAI's exclusive term, preserving the namespace for common technical terminology used by Singapore's AI startups.",
    whyItMattersJa:
      'IPOSはGPTがOpenAIの専属用語ではないと認定し、シンガポールのAIスタートアップのための汎用技術用語の命名空間を保護しています。',
    whyItMattersKo:
      '아이포스가 GPT는 오픈에이아이의 전용 용어가 아니라고 판정하여, 싱가포르 AI 초기업들을 위해 일반 기술 용어의 명명 공간을 보존했습니다.',
    sourceUrl:
      'https://www.businesstimes.com.sg/companies-markets/chatgpt-creator-openai-loses-bid-block-singapore-startups-gemgpt-trademark',
    sourceName: 'The Business Times',
    topicIds: ['governance-regulation', 'startups-investment'],
    related: [{ kind: 'ecosystem', id: 'openai' }],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-google-research-hub-singapore-health-ai',
    date: '2026-10-30',
    title: '谷歌在新加坡设研究中心深化医疗 AI 合作',
    titleEn: 'Google establishes Singapore research center to deepen healthcare AI collaboration',
    titleJa: 'グーグル シンガポール医療AI研究センター設立',
    titleKo: '구글, 싱가포르에 의료AI 연구센터 설립',
    whyItMatters: '这是 5 月那份国家级 AI 伙伴关系首次落地为实体机构，新加坡从政策文本升级为谷歌全球研究版图上的节点',
    whyItMattersEn:
      "This marks the first time the May national-level AI partnership materialized as a concrete institution. Singapore graduated from policy text to become a node on Google's global research map.",
    whyItMattersJa:
      'これは5月の国家級AIパートナーシップが初めて実体機関として確立され、シンガポールが政策文書からGoogleのグローバル研究版図上のノードへと昇格した事例です。',
    whyItMattersKo:
      '이는 5월의 그 국가급 AI 파트너십이 처음으로 실체 기관으로 구현된 것이며, 싱가포르는 정책 텍스트에서 구글의 글로벌 연구 지형도상의 노드로 격상되었습니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/google-and-singapore-deepen-partnership-to-advance-frontier-ai-for-healthcare-and-scientific-discovery',
    sourceName: 'EDB',
    topicIds: ['healthcare', 'infrastructure-research', 'national-strategy'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-astar-marvel-ai-materials-initiative',
    date: '2026-10-30',
    title: 'A*STAR 推出 MARVEL-AI 加速先进材料研发',
    titleEn: 'A*STAR launches MARVEL-AI to accelerate advanced materials research',
    titleJa: 'A*STAR MARVEL-AI先進材料研究開発加速',
    titleKo: 'A*STAR, MARVEL-AI 출시 첨단소재 연구개발 가속',
    whyItMatters:
      'MARVEL-AI 把 A*STAR 的研发与 METI、EDB、EnterpriseSG 的产业化职能整合进同一闭环,意在消除材料从实验室走向产业化的交接断点',
    whyItMattersEn:
      "MARVEL-AI integrates A*STAR's R&D with METI, EDB, and EnterpriseSG's commercialization functions into a single closed loop, aiming to eliminate the handoff gap between laboratory and commercialization stages.",
    whyItMattersJa:
      'MARVEL-AIはA*STARの研究開発とMETI、EDB、EnterpriseSGの産業化機能を同一のクローズドループに統合し、材料が実験室から産業化に向かう際の引き継ぎギャップを排除することを意図しています。',
    whyItMattersKo:
      'MARVEL-AI는 A*STAR의 연구개발 기능과 METI, EDB, EnterpriseSG의 산업화 기능을 동일한 폐쇄 루프로 통합하여, 재료가 실험실에서 산업화로 전환되는 과정의 인계 단절점을 제거하려는 의도입니다.',
    sourceUrl:
      'https://www.a-star.edu.sg/news/press-releases/marvel-ai-accelerating-advanced-materials-innovation-from-discovery-to-deployment',
    sourceName: 'A*STAR',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-megaspeed-nvidia-china-spy-probe',
    date: '2026-10-30',
    title: '黄仁勋回应新加坡芯片商谍案指控',
    titleEn: 'Jensen Huang responds to Singapore chipmaker espionage case accusations',
    titleJa: 'ファン・ジェンシュン シンガポール半導体スパイ事件指控に応答',
    titleKo: '황런훈, 싱가포르 반도체 첩보 혐의 대응',
    whyItMatters: '黄仁勋亲自为 Megaspeed International 背书，暴露新加坡芯片中转角色已卷入美国出口管制审查前线',
    whyItMattersEn:
      "Jensen Huang's personal endorsement of Megaspeed International exposes that Singapore's semiconductor transhipment role has been drawn into the frontline of US export-control scrutiny.",
    whyItMattersJa:
      'ジェンセン・ファンはMegaspeed Internationalを個人的に支持し、シンガポールのチップトランシップ役割が既に米国の輸出管制審査の最前線に巻き込まれていることを暴露しています。',
    whyItMattersKo:
      '젠슨 황이 메가스피드 인터내셔널을 직접 배서함으로써, 싱가포르의 반도체 중전 역할이 이미 미국 수출 관제 심사 최전선에 휘말렸음을 드러냈습니다.',
    sourceUrl: 'https://www.channelnewsasia.com/east-asia/nvidia-jensen-huang-megaspeed-international-6505791',
    sourceName: 'CNA',
    topicIds: ['national-security', 'international', 'economy-industry'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261029-safran-ai-centre-singapore-edb',
    date: '2026-10-29',
    title: '赛峰与新加坡经发局签约设 AI 卓越中心',
    titleEn: 'Safran signs agreement with Singapore EDB to establish AI center of excellence',
    titleJa: 'サフラン シンガポール経済開発庁 AI卓越センター設立契約',
    titleKo: '사프랑, 싱가포르경제개발청과 AI 우수센터 설립 협약',
    whyItMatters:
      '新加坡拿下 Safran.AI 全球首个海外子公司，但 2027 年一季度才启动招聘、首批仅 50 人，EDB 的航空 AI 卡位仍是试探性落子',
    whyItMattersEn:
      "Singapore secured Safran.AI's first global overseas subsidiary, but recruitment will not launch until Q1 2027, with only 50 people in the initial cohort. EDB's aviation-AI positioning remains exploratory.",
    whyItMattersJa:
      'シンガポールはSafran.AIのグローバル初の海外子会社を確保しましたが、2027年第1四半期にようやく採用を開始し、初期段階ではわずか50名のみです。EDBの航空AI戦略は依然として試験的なポジショニングに過ぎません。',
    whyItMattersKo:
      '싱가포르는 사프란.에이아이의 글로벌 최초 해외 자회사를 확보했으나, 2027년 1분기에야 채용을 시작하고 초기 인원은 50명에 불과하여, EDB의 항공 AI 포지셔닝은 여전히 시험적 움직임에 그칩니다.',
    sourceUrl: 'https://www.edb.gov.sg/en/news-and-insights/safran-chooses-singapore-for-new-ai-centre-of-excellence',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'economy-industry', 'startups-investment'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261026-singapore-embodied-ai-manufacturing-chal',
    date: '2026-10-21',
    title: '新加坡启动首届全国具身智能制造挑战赛',
    titleEn: 'Singapore launches first national embodied AI manufacturing challenge',
    titleJa: 'シンガポール初の全国具身化AI製造チャレンジ開始',
    titleKo: '싱가포르 첫 전국 체화 지능 제조 챌린지 개시',
    whyItMatters:
      'Micron 为具身智能挑战赛提供模拟半导体制造任务。参赛队伍在模拟舱内验证方案，测试成果转为工业应用的可行性。',
    whyItMattersEn:
      'Micron provides a simulated semiconductor manufacturing task for the embodied AI challenge. Teams test solutions in a mock-up chamber to assess potential industrial applications.',
    whyItMattersJa:
      'Micronが具身型AIチャレンジに半導体製造の模擬課題を提供します。参加チームは模擬チャンバー内で解決策を検証し、産業応用の可能性を評価します。',
    whyItMattersKo:
      '미크론은 체화 지능 챌린지에 반도체 제조 모의 과제를 제공합니다. 참가팀은 모형 챔버에서 솔루션을 검증하고 산업 적용 가능성을 평가합니다.',
    sourceUrl:
      'https://www.a-star.edu.sg/news/press-releases/singapore-launches-first-national-embodied-ai-challenge-to-accelerate-real-world-robotics-deployment-in-manufacturing',
    sourceName: 'A*STAR',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'talent-education'],
    addedAt: '2026-10-28',
  },
  {
    id: 'sig-20261021-moonshot-ai-singapore-expansion',
    date: '2026-10-21',
    title: '月之暗面据招聘信息拟进军新加坡',
    titleEn: 'Moonshot AI plans Singapore entry, recruitment postings suggest',
    titleJa: 'ムーンショット、採用情報からシンガポール進出計画',
    titleKo: '문샷 AI 싱가포르 진출 계획, 채용공고 기반',
    whyItMatters:
      '月之暗面 2023 年便登记新加坡主体,2026 年 6 月改名 Novascent 后才开始招聘,新加坡正成 Tencent、Meituan、China Mobile 系 AI 出海的跳板',
    whyItMattersEn:
      "Moonshot AI registered a Singapore entity in 2023 but only started recruiting after renaming to Novascent in June 2026, as Singapore becomes a springboard for Tencent, Meituan, and China Mobile-affiliated AI companies' overseas expansion.",
    whyItMattersJa:
      'ゲツノアンメンは2023年にシンガポール法人を登記し、2026年6月にNovascent（ノバセント）に改名した後、初めて採用を開始しました。シンガポールはTencent、Meituan、China Mobile系のAI企業の海外進出の足がかりとなっています。',
    whyItMattersKo:
      '월지암면은 2023년 싱가포르 법인을 등록했으며, 2026년 6월 노바센트로 개명한 이후에야 채용을 시작했습니다. 싱가포르는 텐센트, 미투안, 차이나 모바일 계열 AI 해외 진출의 발판이 되고 있습니다.',
    sourceUrl:
      'https://www.businesstimes.com.sg/companies-markets/chinas-moonshot-ai-operate-singapore-jobs-post-shows',
    sourceName: 'The Business Times',
    topicIds: ['startups-investment', 'economy-industry', 'international'],
    addedAt: '2026-10-28',
  },
  {
    id: 'sig-20261014-anthropic-singapore-office-mou',
    date: '2026-10-14',
    title: 'Anthropic 在新加坡设办公室，与 MDDI 签署合作备忘录',
    titleEn: 'Anthropic opens a Singapore office and signs an MOU with MDDI',
    titleJa: 'Anthropic、シンガポールに拠点開設　MDDI と覚書締結',
    titleKo: 'Anthropic, 싱가포르 사무소 개설하고 MDDI와 MOU 체결',
    whyItMatters:
      '这是 Anthropic 在亚太的第五个办公室；备忘录覆盖模型评测、测试标准和事件响应的技术交流，新加坡由此与前沿模型公司建立直接的评测合作渠道',
    whyItMattersEn:
      "Anthropic's fifth office in Asia-Pacific. The MOU covers technical exchanges on model evaluation, testing standards and incident response, which gives Singapore a direct evaluation channel with a frontier lab.",
    whyItMattersJa:
      'Anthropic にとってアジア太平洋で 5 番目の拠点です。覚書はモデル評価、テスト基準、インシデント対応に関する技術交流を含み、シンガポールはフロンティア AI 企業と直接の評価協力ルートを持つことになります。',
    whyItMattersKo:
      'Anthropic의 아시아태평양 다섯 번째 사무소입니다. MOU는 모델 평가, 테스트 기준, 사고 대응에 관한 기술 교류를 포함하며, 싱가포르는 프런티어 AI 기업과 직접적인 평가 협력 통로를 갖게 됩니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/anthropic-opens-singapore-office-and-signs-mou-with-government-of-singapore',
    sourceName: 'EDB',
    topicIds: ['safety-ethics', 'international', 'public-sector'],
    related: [{ kind: 'person', id: 'josephine-teo' }],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261008-physicsx-astar-partnership-singapore',
    date: '2026-10-08',
    title: 'PhysicsX 在新加坡设亚太中心，与 A*STAR 签五年 4000 万新元合作',
    titleEn: 'PhysicsX opens an Asia-Pacific hub in Singapore with a five-year S$40 million A*STAR partnership',
    titleJa: 'PhysicsX、シンガポールにアジア太平洋拠点　A*STAR と 5 年 4,000 万シンガポールドルの提携',
    titleKo: 'PhysicsX, 싱가포르에 아시아태평양 허브 설립·A*STAR와 5년 4천만 싱가포르달러 협력',
    whyItMatters:
      'Temasek 与 EDB 支持落地；与 A*STAR 的五年 4000 万新元合作覆盖海事、先进制造、半导体和生物技术，把工业 AI 落到本地产业，而不只是设一个区域总部',
    whyItMattersEn:
      'Temasek and EDB backed the move. The five-year S$40 million A*STAR partnership spans maritime, advanced manufacturing, semiconductors and biotech, which ties industrial AI to local industry instead of stopping at a regional office.',
    whyItMattersJa:
      'Temasek と EDB が進出を支援しました。A*STAR との 5 年 4,000 万シンガポールドルの提携は海事、先端製造、半導体、バイオテクノロジーにわたり、地域拠点にとどまらず産業 AI を現地産業に結び付けます。',
    whyItMattersKo:
      'Temasek과 EDB가 진출을 지원했습니다. A*STAR와의 5년 4천만 싱가포르달러 협력은 해양, 첨단 제조, 반도체, 바이오 분야에 걸쳐 있어 지역 거점에 그치지 않고 산업 AI를 현지 산업과 연결합니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/physicsx-launches-asia-pacific-hub-in-singapore-to-scale-ai-powered-industrial-engineering-across-the-region',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    related: [{ kind: 'ecosystem', id: 'a-star' }],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261006-mddi-pq-pre-deployment-frontier-ai-acces',
    date: '2026-10-06',
    title: 'MDDI：前沿模型部署前向政府开放评估，暂不设为强制要求',
    titleEn: 'MDDI: frontier labs will not be required to give the government pre-deployment access for now',
    titleJa: 'MDDI、フロンティアモデルの導入前アクセスは当面義務化せず',
    titleKo: 'MDDI, 프런티어 모델 배포 전 정부 접근 당분간 의무화 안 해',
    whyItMatters:
      '国会答复称强制开放模型可能让企业减少合作；政府改走两条路：与前沿实验室建立信息共享关系，由新加坡 AI 安全研究所（AISI）自建评测能力',
    whyItMattersEn:
      'The parliamentary reply says a rigid access requirement could make companies cooperate less. The government instead builds information-sharing relationships with frontier labs and has the AI Safety Institute (AISI) build its own evaluation capability.',
    whyItMattersJa:
      '国会答弁は、アクセスの義務化は企業の協力を減らしかねないとしました。政府はフロンティア AI 企業との情報共有関係を築き、AI 安全研究所（AISI）が独自の評価能力を整える方針です。',
    whyItMattersKo:
      '국회 답변은 접근 의무화가 기업의 협력을 줄일 수 있다고 밝혔습니다. 정부는 프런티어 AI 기업과 정보 공유 관계를 구축하고, AI 안전연구소(AISI)가 자체 평가 역량을 갖추는 방향을 택했습니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-response-to-pq-on-providing-pre-deployment-government-access-to-frontier-ai-models-for-independent-evaluation-of-national-security-risks-and-vulnerab/',
    sourceName: 'MDDI',
    topicIds: ['governance-regulation', 'national-security', 'safety-ethics'],
    addedAt: '2026-10-17',
  },
];

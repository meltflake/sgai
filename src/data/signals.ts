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

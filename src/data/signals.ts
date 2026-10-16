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
    id: 'sig-20261014-anthropic-singapore-office-mou',
    date: '2026-10-14',
    title: 'Anthropic在新加坡设办公室并签政府AI备忘录',
    titleEn: 'Anthropic opens Singapore office and signs government AI memorandum',
    titleJa: 'アンスロピックがシンガポールにオフィスを設立し、政府のAI覚書に署名しました。',
    titleKo: 'Anthropic이 싱가포르에 사무실을 개설하고 정부 AI 양해각서를 체결합니다.',
    whyItMatters:
      'Anthropic 在亚太设第五个办事处并与新加坡政府签 AI 安全 MOU，标志新加坡从 2023 年沙盒测试者升级为前沿模型安全治理合作方',
    whyItMattersEn:
      "Anthropic establishes its fifth Asia-Pacific office and signs an AI safety MOU with the Singapore government, marking Singapore's upgrade from a sandbox tester in 2023 to a frontier-model safety governance partner",
    whyItMattersJa:
      'Anthropicはアジア太平洋地域に第5の事務所を設置し、シンガポール政府とAI安全覚書（MOU）に署名しました。これはシンガポールが2023年のサンドボックステスターから最先端モデル安全治理の協力方へアップグレードしたことを示しています。',
    whyItMattersKo:
      'Anthropic은 아시아태평양 지역에 다섯 번째 사무소를 설립하고 싱가포르 정부와 AI 안전 MOU를 체결했으며, 이는 싱가포르가 2023년 샌드박스 테스터에서 최첨단 모델 안전 거버넌스 협력 파트너로 격상된 것을 의미합니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/anthropic-opens-singapore-office-and-signs-mou-with-government-of-singapore',
    sourceName: 'EDB',
    topicIds: ['international', 'governance-regulation', 'public-sector'],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261014-imda-ai-safety-resilience-initiatives',
    date: '2026-10-14',
    title: '新加坡推出AI安全韧性新举措',
    titleEn: 'Singapore launches new AI safety and resilience measures',
    titleJa: 'シンガポールはAI安全性およびレジリエンスの新たな施策を打ち出しました。',
    titleKo: '싱가포르가 AI 안전성과 회복력을 위한 새로운 조치를 발표합니다.',
    whyItMatters: 'IMDA 10 月 14 日将安全韧性提至国家级别，显示新加坡 AI 治理从鼓励创新转向主动防风险',
    whyItMattersEn:
      "IMDA raised security resilience to national level on October 14, showing Singapore's AI governance has shifted from encouraging innovation to proactively managing risks",
    whyItMattersJa:
      'IMDAは10月14日、安全レジリエンスを国家レベルに引き上げました。これはシンガポールのAI治理が革新の奨励から主動的リスク防止へシフトしたことを示しています。',
    whyItMattersKo:
      'IMDA가 10월 14일 안전 탄력성을 국가 차원으로 상향 조정했으며, 이는 싱가포르 AI 거버넌스가 혁신 장려에서 능동적 위험 방지로 전환된 것을 보여줍니다.',
    sourceUrl:
      'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/new-initiatives-to-strengthen-ai-safety-and-resilience',
    sourceName: 'IMDA',
    topicIds: ['safety-ethics', 'governance-regulation', 'national-strategy'],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261008-physicsx-astar-partnership-singapore',
    date: '2026-10-08',
    title: 'PhysicsX落户新加坡 携手A*STAR投4000万',
    titleEn: 'PhysicsX settles in Singapore, partners with A*STAR for S$40 million investment',
    titleJa: 'PhysicsXはシンガポールに進出し、A*STARと協力して4,000万を投資しました。',
    titleKo: 'PhysicsX가 싱가포르에 정착하고 A*STAR과 협력하여 4천만 싱가포르 달러를 투자합니다.',
    whyItMatters:
      'Temasek 与 EDB 促成落户只是起点，真正的筹码是 A*STAR 五年 S$40 million 合作，把物理 AI 嵌入新加坡制造与海事产业而非止步总部招商',
    whyItMattersEn:
      "Temasek and EDB facilitating headquarters establishment is only the starting point; the real leverage is A*STAR's five-year S$40 million partnership to embed physical AI in Singapore's manufacturing and maritime industries rather than stop at headquarters recruitment",
    whyItMattersJa:
      'TemasekとEDBによる落地促進は出発点に過ぎず、真の切り札はA*STARによる5年間のS$40百万の協力です。これはシンガポール製造業と海事産業へのフィジカルAI組み込みであり、本部誘致に止まるものではありません。',
    whyItMattersKo:
      'Temasek과 EDB의 유치는 단지 시작점일 뿐이며, 진정한 전략은 A*STAR의 5년 싱가포르 달러 40백만 협력으로 물리 AI를 싱가포르 제조 및 해사 산업에 통합하는 것이지, 본사 유치에 그치는 것이 아닙니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/physicsx-launches-asia-pacific-hub-in-singapore-to-scale-ai-powered-industrial-engineering-across-the-region',
    sourceName: 'EDB',
    topicIds: ['economy-industry', 'advanced-manufacturing', 'infrastructure-research'],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261007-ast-fc-bga-substrate-facility-opening',
    date: '2026-10-07',
    title: 'AST在新加坡建成首个高端FC-BGA基板厂',
    titleEn: "AST builds Singapore's first advanced FC-BGA substrate factory",
    titleJa: 'ASTがシンガポールに最初のハイエンドFC-BGA基板工場を建設しました。',
    titleKo: 'AST가 싱가포르에서 첫 번째 고급 FC-BGA 기판 공장을 완성합니다.',
    whyItMatters: '95000平方米厂房填补FC-BGA封装基板关键缺口，标志新加坡从晶圆代工延伸至AI芯片供应链上游',
    whyItMattersEn:
      "A 95,000-square-meter facility fills a critical gap in FC-BGA packaging substrate, marking Singapore's extension from wafer foundry to upstream in the AI chip supply chain",
    whyItMattersJa:
      '95,000平方メートルの製造施設はFC-BGA実装基板の重大なギャップを埋め、シンガポールがウェーハファウンドリからAIチップ供給チェーンの上流へ拡張したことを示しています。',
    whyItMattersKo:
      '95,000제곱미터 규모의 공장은 FC-BGA 패키징 기판의 핵심 공백을 채우며, 이는 싱가포르가 웨이퍼 파운드리에서 AI 칩 공급망 상류 부문으로 확장된 것을 의미합니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/ast-completes-singapore-first-high-end-fc-bga-substrate-facility-to-meet-growing-ai-chip-demand',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261006-mddi-pq-pre-deployment-frontier-ai-acces',
    date: '2026-10-06',
    title: 'MDDI回应国会:AI安全评估采风险分级而非强制审查',
    titleEn:
      'MDDI responds to Parliament: AI safety assessment uses risk-based classification rather than mandatory review',
    titleJa: 'MDDIが国会に応答：AI安全評価はリスク分級を採用するもので、強制的な審査ではありません。',
    titleKo: 'MDDI가 국회에 답변합니다: AI 안전 평가는 위험도 분류를 채택하며 의무적 검토가 아닙니다.',
    whyItMatters:
      'MDDI 10 月 6 日国会答复明确不效仿美英强制预审前沿模型，转而依赖 IMDA 沙盒等自愿框架，留下国家安全风险评估的约束力缺口',
    whyItMattersEn:
      "MDDI's October 6 Parliament reply clarified that Singapore will not follow the US and UK in mandating pre-release reviews of frontier models, instead relying on voluntary frameworks such as IMDA's sandbox, leaving a binding-force gap in national-security risk assessment",
    whyItMattersJa:
      'MDDIは10月6日の国会答弁で、米国と英国による最先端モデルの強制的事前審査を模倣しないと明確に述べ、代わりにIMDAサンドボックスなどの自発的フレームワークに依存する一方で、国家安全保障リスク評価における拘束力のギャップを残しています。',
    whyItMattersKo:
      'MDDI가 10월 6일 국회 답변에서 미국과 영국의 최첨단 모델 강제 사전 심사를 모방하지 않겠다고 명확히 했으며, 대신 IMDA 샌드박스 등 자발적 체계에 의존하고 있으나, 국가 안전 위험 평가의 법적 구속력 공백을 남겨두고 있습니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-response-to-pq-on-providing-pre-deployment-government-access-to-frontier-ai-models-for-independent-evaluation-of-national-security-risks-and-vulnerab/',
    sourceName: 'MDDI',
    topicIds: ['governance-regulation', 'national-security', 'international'],
    addedAt: '2026-10-17',
  },
];

// src/data/topics.ts
// ────────────────────────────────────────────────────────────────────────
// Controlled topic vocabulary — the cross-domain taxonomy behind the
// /topics/ hub pages and the "same topic" rails on detail pages.
//
// Design rules (do not drift):
// - Topics are POLICY/INDUSTRY domains, not tech buzzwords ("agentic-ai"
//   would date in a year; "healthcare" won't). Keep the list stable.
// - The 11 debates `topics[]` values (see src/utils/debate-labels.ts and
//   src/data/topic-mappings.ts) map 1:1 into this vocabulary — never
//   remove a topic that a mapping still targets; verify-graph checks.
// - This file is a vocabulary, not a content record: entries carry no
//   addedAt and are NOT harvested into the homepage updates feed.
// - No lang-branching getters here — rendering picks name/description via
//   pickLocalized() (zh-tw derives through OpenCC automatically).

export interface Topic {
  id: string; // kebab-case, stable — used in URLs (/topics/<id>/)
  name: string;
  nameEn: string;
  nameJa: string;
  nameKo?: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo?: string;
  /** Optional multi-paragraph editorial intro (paragraphs split on blank
   *  lines). Rendered on the hub under the H1 for keyword depth + context.
   *  When present, all four language siblings are required (i18n-pair). */
  intro?: string;
  introEn?: string;
  introJa?: string;
  introKo?: string;
  icon: string; // tabler:* icon name
}

export const topics: Topic[] = [
  {
    id: 'national-strategy',
    name: 'AI 国家战略',
    nameEn: 'National AI Strategy',
    nameJa: 'AI 国家戦略',
    nameKo: 'AI 국가 전략',
    description: 'NAIS 1.0/2.0、National AI Missions、预算与顶层设计——新加坡把 AI 当国家工程来推进的整体框架。',
    descriptionEn:
      'NAIS 1.0/2.0, the National AI Missions, budgets and top-level design — the overall framework by which Singapore runs AI as a national project.',
    descriptionJa:
      'NAIS 1.0/2.0、National AI Missions、予算とトップレベル設計——シンガポールが AI を国家プロジェクトとして推進する全体枠組み。',
    descriptionKo:
      'NAIS 1.0/2.0, National AI Missions, 예산과 최상위 설계 — 싱가포르가 AI를 국가 프로젝트로 추진하는 전체 프레임워크.',
    icon: 'tabler:flag',
  },
  {
    id: 'governance-regulation',
    name: '治理与监管',
    nameEn: 'Governance & Regulation',
    nameJa: 'ガバナンスと規制',
    nameKo: '거버넌스 및 규제',
    description: 'AI 治理框架、立法、行业监管与数据保护——从 Model AI Governance Framework 到 PDPA 与各行业规则。',
    descriptionEn:
      'AI governance frameworks, legislation, sectoral regulation and data protection — from the Model AI Governance Framework to the PDPA and industry rules.',
    descriptionJa:
      'AI ガバナンス枠組み、立法、業界規制、データ保護——Model AI Governance Framework から PDPA・各業界ルールまで。',
    descriptionKo:
      'AI 거버넌스 프레임워크, 입법, 산업 규제와 데이터 보호 — Model AI Governance Framework부터 PDPA와 산업별 규칙까지.',
    icon: 'tabler:gavel',
  },
  {
    id: 'safety-ethics',
    name: '安全与伦理',
    nameEn: 'AI Safety & Ethics',
    nameJa: 'AI 安全と倫理',
    nameKo: 'AI 안전 및 윤리',
    description: 'AI Verify、模型测试、红队与负责任 AI——把"可信"变成可检验工程问题的努力。',
    descriptionEn:
      'AI Verify, model testing, red-teaming and responsible AI — the effort to turn "trustworthy" into a testable engineering problem.',
    descriptionJa:
      'AI Verify、モデルテスト、レッドチーム、責任ある AI——「信頼できる」を検証可能な工学問題に変える取り組み。',
    descriptionKo:
      'AI Verify, 모델 테스트, 레드팀과 책임 있는 AI — "신뢰할 수 있음"을 검증 가능한 엔지니어링 문제로 만드는 노력.',
    icon: 'tabler:shield-check',
  },
  {
    id: 'national-security',
    name: '国家安全',
    nameEn: 'AI & National Security',
    nameJa: 'AI と国家安全保障',
    nameKo: 'AI 및 국가 안보',
    description: '国防 AI、网络安全与关键基础设施——AI 在安全领域的应用与风险管控。',
    descriptionEn:
      'Defence AI, cybersecurity and critical infrastructure — how AI is used, and contained, in the security domain.',
    descriptionJa: '国防 AI、サイバーセキュリティ、重要インフラ——安全保障領域での AI の活用とリスク管理。',
    descriptionKo: '국방 AI, 사이버 보안과 핵심 인프라 — 안보 영역에서 AI의 활용과 위험 관리.',
    icon: 'tabler:shield-lock',
  },
  {
    id: 'deepfakes-disinformation',
    name: '深度伪造与虚假信息',
    nameEn: 'Deepfakes & Disinformation',
    nameJa: 'ディープフェイクと偽情報',
    nameKo: '딥페이크 및 허위정보',
    description: 'OCHA、选举诚信立法与平台治理——生成式 AI 内容风险的立法与执法实践。',
    descriptionEn:
      'OCHA, election-integrity legislation and platform governance — how Singapore legislates and enforces against generative-AI content risks.',
    descriptionJa:
      'OCHA、選挙の公正性に関する立法、プラットフォームガバナンス——生成 AI コンテンツリスクへの立法と執行。',
    descriptionKo: 'OCHA, 선거 공정성 입법과 플랫폼 거버넌스 — 생성형 AI 콘텐츠 위험에 대한 입법과 집행.',
    intro:
      '新加坡对深度伪造(deepfake)与 AI 生成虚假信息的治理,走的是「先备齐立法工具箱、再筑全民信息韧性」的双轨路线。2024 年《选举(网络广告诚信)法》禁止在竞选期间发布伪造候选人的深伪内容;《网络犯罪危害法》(OCHA)、FICA、POFMA、《维护种族和谐法》构成一套可对不同威胁快速出手的立法杠杆。\n\n本主题汇集国会对深伪与虚假信息的每一次辩论、相关政策文件,以及部长在国会内外的表态——从选举安全到外国干预、从平台限时下架义务到公众媒介素养。你可以顺着时间线看到:议员们如何质询、政府如何回应、这套框架如何一步步演化。',
    introEn:
      'Singapore governs deepfakes and AI-generated disinformation on two tracks: build the legislative toolbox first, then population-wide information resilience. The Elections (Integrity of Online Advertising) Act 2024 bans deepfake content depicting candidates during an election; the Online Criminal Harms Act (OCHA), FICA, POFMA and the Maintenance of Racial Harmony Act form a set of levers the government can pull quickly against different threats.\n\nThis hub gathers every parliamentary debate on deepfakes and disinformation, the related policy documents, and ministers’ statements inside and outside the House — from election security to foreign interference, from platform takedown duties to public media literacy. You can trace how MPs press, how the government responds, and how the framework has evolved step by step.',
    introJa:
      'シンガポールはディープフェイクと AI 生成の偽情報を二つの軸で統治している——まず立法の道具箱を整え、次に国民全体の情報強靭性を築く。2024 年の選挙(オンライン広告の公正性)法は選挙期間中に候補者を描くディープフェイクを禁じ、オンライン犯罪危害法(OCHA)、FICA、POFMA、種族調和維持法が、異なる脅威に素早く対処できる立法上のレバーを構成する。\n\n本テーマはディープフェイクと偽情報に関する国会討論のすべて、関連する政策文書、そして議場内外での大臣の発言を集約する——選挙の安全から外国干渉まで、プラットフォームの期限付き削除義務から国民のメディアリテラシーまで。議員がどう追及し、政府がどう応じ、この枠組みがどのように段階的に進化してきたかを追える。',
    introKo:
      '싱가포르는 딥페이크와 AI 생성 허위정보를 두 축으로 다스린다 — 먼저 입법 도구함을 갖추고, 다음으로 국민 전체의 정보 회복력을 쌓는다. 2024년 선거(온라인 광고 공정성)법은 선거 기간 중 후보자를 묘사하는 딥페이크를 금지하며, 온라인범죄피해법(OCHA), FICA, POFMA, 종족화합유지법이 서로 다른 위협에 신속히 대응할 수 있는 입법 레버를 구성한다.\n\n이 주제는 딥페이크와 허위정보에 관한 모든 국회 토론, 관련 정책 문서, 그리고 의사당 안팎에서의 장관 발언을 집약한다 — 선거 안보부터 외국 간섭까지, 플랫폼의 기한부 삭제 의무부터 국민 미디어 리터러시까지. 의원들이 어떻게 추궁하고 정부가 어떻게 응답하며 이 틀이 어떻게 단계적으로 진화해왔는지 추적할 수 있다.',
    icon: 'tabler:mask',
  },
  {
    id: 'economy-industry',
    name: '经济与产业采用',
    nameEn: 'Economy & Enterprise Adoption',
    nameJa: '経済と産業導入',
    nameKo: '경제 및 산업 도입',
    description: '企业 AI 采用、生产力与产业转型——AI 如何进入新加坡的企业与行业。',
    descriptionEn:
      'Enterprise AI adoption, productivity and industry transformation — how AI actually enters Singapore companies and sectors.',
    descriptionJa: '企業の AI 導入、生産性、産業転換——AI がシンガポールの企業と業界にどう入っていくか。',
    descriptionKo: '기업 AI 도입, 생산성과 산업 전환 — AI가 싱가포르 기업과 산업에 실제로 들어가는 방식.',
    icon: 'tabler:building-factory-2',
  },
  {
    id: 'employment-workforce',
    name: '就业与劳动力',
    nameEn: 'Employment & Workforce',
    nameJa: '雇用と労働力',
    nameKo: '고용 및 노동력',
    description: 'AI 对就业的冲击与劳动力转型——职业保护、技能重塑与劳资政策辩论。',
    descriptionEn:
      "AI's impact on jobs and workforce transition — job protection, reskilling and the labour-policy debates.",
    descriptionJa: 'AI が雇用に与える影響と労働力転換——職業保護、リスキリング、労働政策の議論。',
    descriptionKo: 'AI가 고용에 미치는 영향과 노동력 전환 — 직업 보호, 재교육과 노동 정책 논쟁.',
    icon: 'tabler:briefcase',
  },
  {
    id: 'talent-education',
    name: '人才与教育',
    nameEn: 'Talent & Education',
    nameJa: '人材と教育',
    nameKo: '인재 및 교육',
    description: 'AI 人才培养、高校项目与教育体系——从中小学 AI 素养到博士生管线。',
    descriptionEn:
      'AI talent pipelines, university programmes and the education system — from school-level AI literacy to PhD tracks.',
    descriptionJa: 'AI 人材育成、大学プログラム、教育システム——学校の AI リテラシーから博士課程まで。',
    descriptionKo: 'AI 인재 양성, 대학 프로그램과 교육 시스템 — 학교 AI 리터러시부터 박사 과정까지.',
    icon: 'tabler:school',
  },
  {
    id: 'infrastructure-research',
    name: '算力基建与研究',
    nameEn: 'Compute, Infrastructure & Research',
    nameJa: '計算基盤と研究',
    nameKo: '컴퓨팅 인프라 및 연구',
    description: '数据中心、算力、科研体系与基础研究——A*STAR、大学研究院与国家算力布局。',
    descriptionEn:
      'Data centres, compute, the research system and basic research — A*STAR, university institutes and the national compute build-out.',
    descriptionJa: 'データセンター、計算資源、研究体制、基礎研究——A*STAR、大学研究所、国家計算基盤の整備。',
    descriptionKo: '데이터센터, 컴퓨팅, 연구 체계와 기초 연구 — A*STAR, 대학 연구소와 국가 컴퓨팅 구축.',
    icon: 'tabler:server-2',
  },
  {
    id: 'public-sector',
    name: '公共部门 AI',
    nameEn: 'AI in the Public Sector',
    nameJa: '公共部門の AI',
    nameKo: '공공 부문 AI',
    description: '政府自用 AI——GovTech 产品、公务体系工具与公共服务的 AI 化。',
    descriptionEn:
      "Government's own use of AI — GovTech products, civil-service tooling and the AI-ification of public services.",
    descriptionJa: '政府自身の AI 活用——GovTech 製品、行政ツール、公共サービスの AI 化。',
    descriptionKo: '정부 자체의 AI 활용 — GovTech 제품, 행정 도구와 공공 서비스의 AI화.',
    icon: 'tabler:building-bank',
  },
  {
    id: 'healthcare',
    name: '医疗 AI',
    nameEn: 'AI in Healthcare',
    nameJa: '医療 AI',
    nameKo: '의료 AI',
    description: '医疗健康领域的 AI——从 health mission 到医院系统与医疗科技公司。',
    descriptionEn: 'AI in health — from the national health mission to hospital systems and healthtech companies.',
    descriptionJa: '医療・健康分野の AI——国家ヘルスミッションから病院システム、ヘルステック企業まで。',
    descriptionKo: '의료·건강 분야의 AI — 국가 헬스 미션부터 병원 시스템과 헬스테크 기업까지.',
    icon: 'tabler:heartbeat',
  },
  {
    id: 'finance',
    name: '金融 AI',
    nameEn: 'AI in Finance',
    nameJa: '金融 AI',
    nameKo: '금융 AI',
    description: 'MAS 的 AI 监管与金融业应用——风险管理指引、fintech 与金融机构的 AI 落地。',
    descriptionEn:
      "MAS's AI supervision and financial-sector adoption — risk-management guidelines, fintech and AI inside financial institutions.",
    descriptionJa: 'MAS の AI 監督と金融業界での導入——リスク管理ガイドライン、フィンテック、金融機関の AI 活用。',
    descriptionKo: 'MAS의 AI 감독과 금융권 도입 — 리스크 관리 지침, 핀테크와 금융기관의 AI 활용.',
    icon: 'tabler:coin',
  },
  {
    id: 'startups-investment',
    name: '创业与投资',
    nameEn: 'Startups & Investment',
    nameJa: 'スタートアップと投資',
    nameKo: '스타트업 및 투자',
    description: 'AI 创业公司、风险投资与主权资本——从本地初创到 GIC/淡马锡的前沿 AI 投资。',
    descriptionEn:
      'AI startups, venture capital and sovereign capital — from local startups to GIC/Temasek bets on frontier AI.',
    descriptionJa:
      'AI スタートアップ、ベンチャーキャピタル、ソブリン資本——ローカル新興企業から GIC/テマセクのフロンティア AI 投資まで。',
    descriptionKo: 'AI 스타트업, 벤처캐피털과 국부 자본 — 로컬 스타트업부터 GIC/테마섹의 프런티어 AI 투자까지.',
    icon: 'tabler:rocket',
  },
  {
    id: 'open-source',
    name: '开源生态',
    nameEn: 'Open Source',
    nameJa: 'オープンソース',
    nameKo: '오픈소스',
    description: 'SEA-LION、AI Verify 与产学研开源——新加坡对外输出的开源模型与工具。',
    descriptionEn:
      'SEA-LION, AI Verify and community open source — the models and tools Singapore ships to the world in the open.',
    descriptionJa:
      'SEA-LION、AI Verify、産学官のオープンソース——シンガポールが世界に発信するオープンなモデルとツール。',
    descriptionKo: 'SEA-LION, AI Verify와 산학연 오픈소스 — 싱가포르가 공개로 내놓는 모델과 도구.',
    icon: 'tabler:code',
  },
  {
    id: 'international',
    name: '国际对标与合作',
    nameEn: 'International Benchmarking & Cooperation',
    nameJa: '国際比較と協力',
    nameKo: '국제 비교 및 협력',
    description: '与其他经济体的对标、外交与多边合作——ASEAN、GPAI、双边 AI 治理合作与全球案例。',
    descriptionEn:
      'Benchmarks against other economies, diplomacy and multilateral work — ASEAN, GPAI, bilateral AI-governance ties and global case studies.',
    descriptionJa: '他の経済圏との比較、外交、多国間協力——ASEAN、GPAI、二国間 AI ガバナンス協力、世界の事例。',
    descriptionKo: '다른 경제권과의 비교, 외교와 다자 협력 — ASEAN, GPAI, 양자 AI 거버넌스 협력과 글로벌 사례.',
    icon: 'tabler:world',
  },
];

export const topicIdSet = new Set(topics.map((tp) => tp.id));

export function getTopicById(id: string): Topic | undefined {
  return topics.find((tp) => tp.id === id);
}

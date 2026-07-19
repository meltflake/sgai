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
    intro:
      '新加坡是全球最早把 AI 写进国家战略的国家之一。2019 年发布首份《国家人工智能战略》(NAIS 1.0),2023 年 12 月升级为 NAIS 2.0,提出「卓越」与「赋能」两大目标;2026 年进一步落地为四项 National AI Missions(先进制造、互联互通、金融、医疗),并成立由总理黄循财亲自主持的全国人工智能理事会(NAIC)。从 Smart Nation 到 Budget 2026 的巨额投入,AI 被当作一项国家工程来推进。\n\n本主题汇集国会对 AI 国家战略的每一次辩论、相关政策原文、部长演讲与执行追踪——你可以顺着时间线看到:这套顶层设计如何从愿景走向预算、从预算走向具体任务,以及议员们在每个节点如何质询与推动。',
    introEn:
      'Singapore was among the first countries to write AI into national strategy. It published its first National AI Strategy (NAIS 1.0) in 2019, upgraded it to NAIS 2.0 in December 2023 around the twin goals of “Excellence” and “Empowerment,” and in 2026 translated it into four National AI Missions (advanced manufacturing, connectivity, finance, healthcare) under a National AI Council (NAIC) chaired by Prime Minister Lawrence Wong. From Smart Nation to the Budget 2026 commitment, AI is run as a national project.\n\nThis hub gathers every parliamentary debate on the national AI strategy, the source policy documents, ministerial speeches and the execution tracker — so you can follow how the top-level design moves from vision to budget to concrete missions, and how MPs press and steer it at each step.',
    introJa:
      'シンガポールは AI を国家戦略に組み込んだ最も早い国の一つである。2019 年に初の《国家人工知能戦略》(NAIS 1.0)を公表し、2023 年 12 月に「卓越」と「エンパワーメント」の二大目標を掲げた NAIS 2.0 へ更新、2026 年には四つの National AI Missions(先端製造、コネクティビティ、金融、医療)として具体化し、ローレンス・ウォン首相自ら主宰する全国人工知能評議会(NAIC)を設けた。Smart Nation から Budget 2026 の巨額投入まで、AI は国家プロジェクトとして推進されている。\n\n本テーマは AI 国家戦略に関する国会討論のすべて、関連する政策原文、大臣の演説、そして実行追跡を集約する——トップレベルの設計がビジョンから予算へ、予算から具体的ミッションへとどう進み、議員が各段階でどう追及し推進するかを時系列で追える。',
    introKo:
      '싱가포르는 AI를 국가 전략에 명시한 가장 이른 국가 중 하나다. 2019년 첫 《국가인공지능전략》(NAIS 1.0)을 발표하고, 2023년 12월 “탁월”과 “역량 강화”라는 두 목표를 중심으로 NAIS 2.0으로 격상했으며, 2026년에는 네 개의 National AI Missions(첨단 제조, 연결성, 금융, 의료)로 구체화하고 총리 로런스 웡이 직접 주재하는 전국인공지능위원회(NAIC)를 설립했다. Smart Nation부터 Budget 2026의 대규모 투자까지, AI는 국가 프로젝트로 추진된다.\n\n이 주제는 AI 국가 전략에 관한 모든 국회 토론, 관련 정책 원문, 장관 연설, 그리고 실행 추적을 집약한다 — 최상위 설계가 비전에서 예산으로, 예산에서 구체적 미션으로 어떻게 나아가고 의원들이 각 단계에서 어떻게 추궁하고 이끄는지 시간순으로 따라갈 수 있다.',
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
    intro:
      '新加坡的 AI 治理走「原则先行、软法为主」的路线:不急于立一部综合性 AI 法,而是靠一套可检验的框架、指引与行业规则。核心是 IMDA 与 AI Verify 基金会的《模型 AI 治理框架》(Model AI Governance Framework),2024 年 5 月扩展出面向生成式 AI 的版本,配合《个人数据保护法》(PDPA)与 PDPC 的执法,再叠加金融、医疗等行业各自的监管规则。\n\n本主题汇集国会对 AI 治理与监管的每一次辩论、相关框架与法规原文、以及监管机构的表态——从「要不要立专门的 AI 法」到数据保护、算法问责、行业分工,你可以看到新加坡这套「不立硬法但持续收紧」的治理逻辑如何一步步成形。',
    introEn:
      'Singapore’s approach to AI governance is principles-first and soft-law-led: rather than rush a single comprehensive AI statute, it relies on testable frameworks, guidance and sectoral rules. At the centre is the Model AI Governance Framework from IMDA and the AI Verify Foundation, extended in May 2024 with a version for generative AI, working alongside the Personal Data Protection Act (PDPA) and PDPC enforcement, plus sector-specific rules in finance, healthcare and beyond.\n\nThis hub gathers every parliamentary debate on AI governance and regulation, the source frameworks and legislation, and regulators’ statements — from the recurring “should Singapore pass a dedicated AI law?” to data protection, algorithmic accountability and the division of labour across sectors, so you can trace how this “no hard statute, but a steadily tightening grip” logic takes shape.',
    introJa:
      'シンガポールの AI ガバナンスは「原則先行・ソフトロー主導」である。包括的な AI 法を急いで制定するのではなく、検証可能な枠組み、ガイダンス、業界ルールに依拠する。中核は IMDA と AI Verify 財団による《モデル AI ガバナンス枠組み》(Model AI Governance Framework)で、2024 年 5 月に生成 AI 向け版へ拡張され、《個人データ保護法》(PDPA)と PDPC の執行、さらに金融・医療など各業界の規制と組み合わさる。\n\n本テーマは AI ガバナンスと規制に関する国会討論のすべて、関連する枠組みと法令の原文、規制当局の見解を集約する——「専用の AI 法を制定すべきか」からデータ保護、アルゴリズムの説明責任、業界間の役割分担まで、「硬い法は作らないが着実に締める」統治の論理がどう形づくられてきたかを追える。',
    introKo:
      '싱가포르의 AI 거버넌스는 “원칙 우선·연성법 주도”다. 포괄적 AI 법을 서둘러 제정하기보다 검증 가능한 프레임워크, 지침, 산업 규칙에 의존한다. 핵심은 IMDA와 AI Verify 재단의 《모델 AI 거버넌스 프레임워크》(Model AI Governance Framework)로, 2024년 5월 생성형 AI용 버전으로 확장되었으며, 《개인정보보호법》(PDPA)과 PDPC 집행, 그리고 금융·의료 등 산업별 규제와 결합한다.\n\n이 주제는 AI 거버넌스와 규제에 관한 모든 국회 토론, 관련 프레임워크와 법령 원문, 규제 당국의 입장을 집약한다 — “전용 AI 법을 제정해야 하는가”부터 데이터 보호, 알고리즘 책임성, 산업 간 역할 분담까지, “경성법은 만들지 않되 꾸준히 조이는” 통치 논리가 어떻게 형성되는지 추적할 수 있다.',
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
    intro:
      '新加坡把「可信 AI」当成一个可检验的工程问题,而不是一句口号。旗舰是 IMDA 与 AI Verify 基金会推出的 AI Verify——一套围绕 11 项国际公认治理原则的测试框架与工具箱,并针对生成式 AI 补充了评估与红队(red-teaming)方法。目标是让企业能把「模型是否安全、是否负责任」拿出来实测,而不是自说自话。\n\n本主题汇集国会对 AI 安全与伦理的每一次辩论、相关测试框架与指引、以及监管方的表态——从模型偏见、幻觉与滥用风险,到红队评测、第三方审计与「负责任 AI」的落地,你可以看到新加坡如何把抽象的伦理原则翻译成可操作的检验标准。',
    introEn:
      'Singapore treats “trustworthy AI” as a testable engineering problem, not a slogan. The flagship is AI Verify from IMDA and the AI Verify Foundation — a testing framework and toolkit built around 11 internationally recognised governance principles, with added evaluation and red-teaming methods for generative AI. The aim is to let companies actually test whether a model is safe and responsible, rather than simply assert it.\n\nThis hub gathers every parliamentary debate on AI safety and ethics, the related testing frameworks and guidance, and regulators’ statements — from model bias, hallucination and misuse risks to red-team evaluation, third-party audits and putting “responsible AI” into practice, so you can see how Singapore translates abstract ethical principles into operational tests.',
    introJa:
      'シンガポールは「信頼できる AI」を、スローガンではなく検証可能な工学問題として扱う。旗艦は IMDA と AI Verify 財団による AI Verify——国際的に認められた 11 の統治原則を軸にしたテスト枠組みとツールキットで、生成 AI 向けに評価とレッドチーミング(red-teaming)手法を追加した。狙いは、モデルが安全で責任あるものかを企業が実際に検証できるようにすることであり、単なる主張ではない。\n\n本テーマは AI 安全と倫理に関する国会討論のすべて、関連するテスト枠組みと指針、規制側の見解を集約する——モデルのバイアス、ハルシネーション、悪用リスクから、レッドチーム評価、第三者監査、「責任ある AI」の実装まで、抽象的な倫理原則をどう運用可能な検証基準へ翻訳するかを追える。',
    introKo:
      '싱가포르는 “신뢰할 수 있는 AI”를 구호가 아니라 검증 가능한 엔지니어링 문제로 다룬다. 대표 사례는 IMDA와 AI Verify 재단의 AI Verify — 국제적으로 인정받는 11개 거버넌스 원칙을 축으로 한 테스트 프레임워크와 툴킷으로, 생성형 AI를 위한 평가와 레드티밍(red-teaming) 기법을 더했다. 목표는 모델이 안전하고 책임 있는지를 기업이 실제로 검증할 수 있게 하는 것이지 단순한 주장이 아니다.\n\n이 주제는 AI 안전과 윤리에 관한 모든 국회 토론, 관련 테스트 프레임워크와 지침, 규제 측 입장을 집약한다 — 모델 편향, 환각, 오용 위험부터 레드팀 평가, 제3자 감사, “책임 있는 AI”의 구현까지, 추상적 윤리 원칙을 어떻게 운용 가능한 검증 기준으로 옮기는지 볼 수 있다.',
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
    intro:
      'AI 既是新加坡国家安全的新工具,也是新的威胁面。一端是国防与网络防御——国防部与国防科技局(DSTA)把 AI 用于态势感知与决策,网络安全局(CSA)守护关键基础设施;另一端是外国干预与信息操弄,靠《防止外来干预(对抗措施)法》(FICA)等杠杆应对。对一个小国而言,如何在用好 AI 的同时管住它的风险,是安全治理的核心命题。\n\n本主题汇集国会对 AI 与国家安全的每一次辩论、相关政策与部长表态——从国防 AI、网络安全、关键基础设施,到外国干预、深伪与信息韧性,你可以看到新加坡如何在「善用」与「防范」之间划线,以及议员们如何追问其中的边界与问责。',
    introEn:
      'For Singapore, AI is both a new tool of national security and a new threat surface. On one side sit defence and cyber-defence — MINDEF and DSTA applying AI to situational awareness and decision-making, and the Cyber Security Agency (CSA) guarding critical infrastructure; on the other sit foreign interference and information manipulation, met with levers such as the Foreign Interference (Countermeasures) Act (FICA). For a small state, using AI well while containing its risks is the core security question.\n\nThis hub gathers every parliamentary debate on AI and national security, the related policies and ministerial statements — from defence AI, cybersecurity and critical infrastructure to foreign interference, deepfakes and information resilience — so you can see where Singapore draws the line between “make use of it” and “guard against it,” and how MPs interrogate the boundaries and accountability.',
    introJa:
      'シンガポールにとって AI は国家安全保障の新たな道具であると同時に、新たな脅威の面でもある。一方には防衛とサイバー防御——国防省と国防科学技術庁(DSTA)が状況認識と意思決定に AI を用い、サイバーセキュリティ庁(CSA)が重要インフラを守る。他方には外国干渉と情報操作があり、《外国干渉(対抗措置)法》(FICA)などのレバーで対処する。小国にとって、AI を活かしつつリスクを抑えることは安全保障統治の核心である。\n\n本テーマは AI と国家安全保障に関する国会討論のすべて、関連する政策と大臣の見解を集約する——防衛 AI、サイバーセキュリティ、重要インフラから、外国干渉、ディープフェイク、情報強靭性まで、シンガポールが「活用」と「防御」の間にどう線を引き、議員がその境界と説明責任をどう問うかを追える。',
    introKo:
      '싱가포르에게 AI는 국가 안보의 새로운 도구인 동시에 새로운 위협면이다. 한쪽에는 국방과 사이버 방어 — 국방부와 국방과학기술청(DSTA)이 상황 인식과 의사결정에 AI를 활용하고, 사이버보안청(CSA)이 핵심 인프라를 지킨다. 다른 한쪽에는 외국 간섭과 정보 조작이 있으며 《외국간섭(대응조치)법》(FICA) 같은 수단으로 대응한다. 소국에게 AI를 잘 쓰면서 위험을 억제하는 것은 안보 통치의 핵심 과제다.\n\n이 주제는 AI와 국가 안보에 관한 모든 국회 토론, 관련 정책과 장관 입장을 집약한다 — 국방 AI, 사이버 보안, 핵심 인프라부터 외국 간섭, 딥페이크, 정보 회복력까지, 싱가포르가 “활용”과 “방어” 사이에 어떻게 선을 긋고 의원들이 그 경계와 책임을 어떻게 따지는지 볼 수 있다.',
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
    intro:
      '新加坡的一大押注,是把 AI 落到真实的企业与产业里,而不是停在实验室。政府用「国家 AI 影响计划」(National AI Impact Programme,目标 10,000 家中小企业)、AI Trailblazers、生成式 AI 沙盒(GenAI Sandbox)等项目,加上 EDB 与 IMDA 的补贴与配套,推动企业把 AI 用进真实业务流程;衡量的不是省了多少人,而是带来多少业务增量。\n\n本主题汇集国会对企业 AI 采用与产业转型的每一次辩论、相关计划与政策原文、以及部长表态——从生产力、行业升级到中小企业落地的现实摩擦,你可以看到 AI 如何真正进入新加坡的公司与行业,以及议员们如何追问「补贴是否见效、增量是否真实」。',
    introEn:
      'A central Singapore bet is to land AI inside real companies and industries, not leave it in the lab. The government pushes adoption through the National AI Impact Programme (targeting 10,000 SMEs), AI Trailblazers and the GenAI Sandbox, backed by EDB and IMDA grants and support — measuring success not by headcount saved but by the business upside created.\n\nThis hub gathers every parliamentary debate on enterprise AI adoption and industry transformation, the related programmes and policy documents, and ministerial statements — from productivity and sector upgrading to the real friction of getting SMEs to deploy — so you can see how AI actually enters Singapore companies and sectors, and how MPs press on whether the grants work and the upside is real.',
    introJa:
      'シンガポールの大きな賭けの一つは、AI を研究室に留めず、実際の企業と産業に落とし込むことだ。政府は「国家 AI インパクト計画」(National AI Impact Programme、中小企業 1 万社が目標)、AI Trailblazers、生成 AI サンドボックス(GenAI Sandbox)などの施策に、EDB と IMDA の補助・支援を組み合わせて導入を後押しする——成功の尺度は削減した人員ではなく、生み出した事業の上振れである。\n\n本テーマは企業の AI 導入と産業転換に関する国会討論のすべて、関連する施策と政策原文、大臣の見解を集約する——生産性、業界の高度化から、中小企業に実装させる現実の摩擦まで、AI がシンガポールの企業と業界にどう入っていくか、議員が「補助は効くのか、上振れは本物か」をどう問うかを追える。',
    introKo:
      '싱가포르의 큰 베팅 하나는 AI를 실험실에 두지 않고 실제 기업과 산업에 안착시키는 것이다. 정부는 “국가 AI 임팩트 프로그램”(National AI Impact Programme, 중소기업 1만 곳 목표), AI Trailblazers, 생성형 AI 샌드박스(GenAI Sandbox) 등에 EDB와 IMDA의 보조·지원을 결합해 도입을 밀어붙인다 — 성공의 척도는 줄인 인원이 아니라 만들어낸 사업 상승분이다.\n\n이 주제는 기업 AI 도입과 산업 전환에 관한 모든 국회 토론, 관련 프로그램과 정책 원문, 장관 입장을 집약한다 — 생산성, 산업 고도화부터 중소기업 실전 배치의 현실적 마찰까지, AI가 싱가포르 기업과 산업에 실제로 어떻게 들어가는지, 의원들이 “보조금은 효과가 있는지, 상승분은 진짜인지”를 어떻게 따지는지 볼 수 있다.',
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
    intro:
      'AI 对就业的冲击,是新加坡国会最激烈的辩论之一。政府的公开姿态是「以增量为目标、不以裁员为借口」,靠 SkillsFuture 的技能重塑、劳资政三方机制与就业保护来托底;但反对党与工会反复追问一个尖锐的落差——总量上的经济雄心,能否惠及初级岗位与蓝领工人,还是让 AI 放大了不平等。\n\n本主题汇集国会对 AI 与就业、劳动力转型的每一次辩论、相关政策与部长表态——从职业保护、再培训、平台零工,到「谁受益、谁被替代」的分配之争,你可以看到新加坡如何在拥抱 AI 的同时应对它对饭碗的冲击。',
    introEn:
      'AI’s impact on jobs is one of Singapore’s sharpest parliamentary debates. The government’s public stance is “aim for upside, don’t use AI as an excuse to cut,” backstopped by SkillsFuture reskilling, tripartite labour mechanisms and job protection; but the opposition and unions keep pressing a pointed gap — whether the aggregate economic ambition actually reaches junior and blue-collar workers, or lets AI widen inequality.\n\nThis hub gathers every parliamentary debate on AI, employment and workforce transition, the related policies and ministerial statements — from job protection, reskilling and platform gig work to the distributional fight over who gains and who is displaced — so you can see how Singapore embraces AI while confronting its impact on livelihoods.',
    introJa:
      'AI の雇用への影響は、シンガポール国会で最も激しい論争の一つだ。政府の公的姿勢は「上振れを目標とし、AI を人員削減の口実にしない」であり、SkillsFuture のリスキリング、労使政の三者機構、雇用保護で下支えする。しかし野党と労組は鋭い落差を繰り返し問う——総量としての経済的野心が、初級職やブルーカラー労働者に本当に届くのか、それとも AI が格差を広げるのか。\n\n本テーマは AI と雇用、労働力転換に関する国会討論のすべて、関連する政策と大臣の見解を集約する——職業保護、再訓練、プラットフォームのギグワークから、「誰が得をし、誰が置き換えられるか」という分配の争いまで、シンガポールが AI を受け入れつつ生計への影響にどう向き合うかを追える。',
    introKo:
      'AI의 고용 영향은 싱가포르 국회에서 가장 첨예한 논쟁 중 하나다. 정부의 공개 입장은 “상승분을 목표로 하되 AI를 감원의 구실로 삼지 않는다”이며, SkillsFuture 재교육, 노사정 삼자 기구, 고용 보호로 떠받친다. 그러나 야당과 노조는 날카로운 격차를 거듭 묻는다 — 총량으로서의 경제적 야심이 초급 일자리와 블루칼라 노동자에게 실제로 닿는지, 아니면 AI가 불평등을 키우는지.\n\n이 주제는 AI와 고용, 노동력 전환에 관한 모든 국회 토론, 관련 정책과 장관 입장을 집약한다 — 직업 보호, 재교육, 플랫폼 긱워크부터 “누가 이득을 보고 누가 대체되는가”라는 분배 논쟁까지, 싱가포르가 AI를 껴안으면서 생계에 대한 영향에 어떻게 맞서는지 볼 수 있다.',
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
    intro:
      '没有人才,再多算力也用不起来。新加坡的 AI 人才管线从中小学的 AI 素养一路铺到博士:AI Singapore 的 AI 学徒计划(AIAP)把在职者转训成 AI 工程师,TechSkills Accelerator(TeSA)扩容科技技能,NUS、NTU、SMU 的学位与研究院培养研究梯队,MOE 则把 AI 与计算思维推进课堂。目标是让「用 AI」的能力覆盖整个社会,而不只是少数专家。\n\n本主题汇集国会对 AI 人才与教育的每一次辩论、相关计划与政策原文、以及部长表态——从学徒计划、大学项目、博士生管线,到全民 AI 素养与外籍人才政策,你可以看到新加坡如何为一场长期竞赛储备人。',
    introEn:
      'Without talent, no amount of compute gets used. Singapore’s AI talent pipeline runs from school-level AI literacy all the way to PhDs: AI Singapore’s AI Apprenticeship Programme (AIAP) retrains working adults into AI engineers, the TechSkills Accelerator (TeSA) scales up tech skills, degrees and institutes at NUS, NTU and SMU build the research bench, and MOE pushes AI and computational thinking into classrooms. The goal is to spread the ability to use AI across the whole society, not just a handful of experts.\n\nThis hub gathers every parliamentary debate on AI talent and education, the related programmes and policy documents, and ministerial statements — from apprenticeships, university tracks and PhD pipelines to population-wide AI literacy and foreign-talent policy — so you can see how Singapore stocks up people for a long race.',
    introJa:
      '人材がいなければ、どれだけ計算資源があっても使いこなせない。シンガポールの AI 人材パイプラインは、学校の AI リテラシーから博士まで貫く:AI Singapore の AI アプレンティスシップ・プログラム(AIAP)は社会人を AI エンジニアへ転換し、TechSkills Accelerator(TeSA)が技術スキルを拡充、NUS・NTU・SMU の学位と研究所が研究層を育て、MOE が AI と計算論的思考を教室へ広げる。狙いは「AI を使う」能力を一部の専門家だけでなく社会全体へ行き渡らせることだ。\n\n本テーマは AI 人材と教育に関する国会討論のすべて、関連する施策と政策原文、大臣の見解を集約する——アプレンティスシップ、大学プログラム、博士課程から、全国民の AI リテラシーと外国人材政策まで、シンガポールが長い競争のためにどう人を蓄えるかを追える。',
    introKo:
      '인재가 없으면 아무리 많은 컴퓨팅도 쓸 수 없다. 싱가포르의 AI 인재 파이프라인은 학교의 AI 리터러시부터 박사까지 이어진다: AI Singapore의 AI 견습 프로그램(AIAP)은 직장인을 AI 엔지니어로 전환하고, TechSkills Accelerator(TeSA)가 기술 역량을 확충하며, NUS·NTU·SMU의 학위와 연구소가 연구 인력을 키우고, MOE가 AI와 계산적 사고를 교실로 넓힌다. 목표는 “AI를 쓰는” 역량을 소수 전문가가 아니라 사회 전체로 퍼뜨리는 것이다.\n\n이 주제는 AI 인재와 교육에 관한 모든 국회 토론, 관련 프로그램과 정책 원문, 장관 입장을 집약한다 — 견습, 대학 트랙, 박사 파이프라인부터 전 국민 AI 리터러시와 외국 인재 정책까지, 싱가포르가 긴 경주를 위해 어떻게 사람을 비축하는지 볼 수 있다.',
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
    intro:
      'AI 的野心最终要落到算力、能源与土地上——对一个国土有限的城邦,这是硬约束。新加坡 2019 年对新建数据中心设禁令,2025 年 12 月解禁并以「绿色数据中心」标准重启配额(DC-CFA2 首批 200MW,要求高能效 + 至少 50% 绿电)。另一端是科研体系:A*STAR、国家研究基金会(NRF)与各大学研究院支撑基础研究,SEA-LION 等本土模型探索区域语言能力。\n\n本主题汇集国会对算力基建与研究的每一次辩论、相关政策与部长表态——从数据中心的能源与土地约束、国家算力布局,到基础研究投入与科研体系,你可以看到新加坡如何在物理约束下为 AI 铺底座。',
    introEn:
      'AI ambition ultimately lands on compute, energy and land — a hard constraint for a land-scarce city-state. Singapore imposed a moratorium on new data centres in 2019, lifted it in December 2025, and restarted allocation on a “green data centre” standard (a first DC-CFA2 tranche of 200MW, demanding high efficiency and at least 50% green energy). On the other side is the research system: A*STAR, the National Research Foundation (NRF) and university institutes underpin basic research, while home-grown models like SEA-LION probe regional-language capability.\n\nThis hub gathers every parliamentary debate on compute, infrastructure and research, the related policies and ministerial statements — from the energy and land constraints on data centres and the national compute build-out to research funding and the science system — so you can see how Singapore lays the foundation for AI under physical limits.',
    introJa:
      'AI の野心は最終的に計算資源、エネルギー、土地に行き着く——国土が限られた都市国家にとって、これは硬い制約だ。シンガポールは 2019 年に新設データセンターへ禁止令を課し、2025 年 12 月に解除、「グリーンデータセンター」基準で割当を再開した(第一次 DC-CFA2 は 200MW、高効率と最低 50% のグリーン電力を要求)。他方には研究体制がある:A*STAR、国家研究基金(NRF)、各大学研究所が基礎研究を支え、SEA-LION など地場モデルが地域言語能力を探る。\n\n本テーマは計算基盤と研究に関する国会討論のすべて、関連する政策と大臣の見解を集約する——データセンターのエネルギー・土地制約、国家計算基盤の整備から、基礎研究投資と科学体制まで、シンガポールが物理的制約の下で AI の土台をどう築くかを追える。',
    introKo:
      'AI의 야심은 결국 컴퓨팅, 에너지, 토지로 귀결된다 — 국토가 좁은 도시국가에게 이는 단단한 제약이다. 싱가포르는 2019년 신규 데이터센터에 유예를 두었다가 2025년 12월 해제하고 “그린 데이터센터” 기준으로 배정을 재개했다(1차 DC-CFA2는 200MW, 높은 효율과 최소 50% 녹색 전력 요구). 다른 한편에는 연구 체계가 있다: A*STAR, 국가연구재단(NRF), 대학 연구소가 기초 연구를 떠받치고, SEA-LION 같은 자국 모델이 지역 언어 역량을 탐색한다.\n\n이 주제는 컴퓨팅 인프라와 연구에 관한 모든 국회 토론, 관련 정책과 장관 입장을 집약한다 — 데이터센터의 에너지·토지 제약, 국가 컴퓨팅 구축부터 기초 연구 투자와 과학 체계까지, 싱가포르가 물리적 한계 아래에서 AI의 토대를 어떻게 놓는지 볼 수 있다.',
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
    intro:
      '新加坡政府不只当 AI 的监管者,也是最积极的使用者之一。GovTech 领衔把 AI 做进公共服务:政府自建的 AI 助手 Pair 面向公务员,AI 被用于文书处理、市民咨询、审批与运营,背后是 Smart Nation 的数字政府底座。理念是先让更多政务与 AI 发生关系、把公共服务提效,同时守住问责与数据安全的底线。\n\n本主题汇集国会对公共部门 AI 的每一次辩论、相关 GovTech 产品与政策、以及部长表态——从政府自用工具、公共服务 AI 化,到透明度、算法问责与公众信任,你可以看到新加坡如何把政府自身当成 AI 落地的试验场。',
    introEn:
      'The Singapore government is not just AI’s regulator but one of its most active users. GovTech leads in building AI into public services: the government’s own AI assistant, Pair, serves civil servants, and AI is applied to document work, citizen queries, approvals and operations — all on the Smart Nation digital-government backbone. The idea is to get more of government working with AI and lift public-service productivity, while holding the line on accountability and data security.\n\nThis hub gathers every parliamentary debate on AI in the public sector, the related GovTech products and policies, and ministerial statements — from government’s own tooling and the AI-ification of public services to transparency, algorithmic accountability and public trust — so you can see how Singapore treats its own government as a testbed for AI deployment.',
    introJa:
      'シンガポール政府は AI の規制者であるだけでなく、最も積極的な利用者の一つでもある。GovTech が公共サービスへの AI 組み込みを主導する:政府自製の AI アシスタント Pair は公務員向けで、AI は文書処理、市民からの問い合わせ、審査、運営に使われ、その基盤には Smart Nation のデジタル政府がある。狙いは、より多くの行政を AI と結び付けて公共サービスを効率化しつつ、説明責任とデータ安全の一線を守ることだ。\n\n本テーマは公共部門の AI に関する国会討論のすべて、関連する GovTech 製品と政策、大臣の見解を集約する——政府自用ツール、公共サービスの AI 化から、透明性、アルゴリズムの説明責任、公衆の信頼まで、シンガポールが政府自身を AI 実装の試験場としてどう扱うかを追える。',
    introKo:
      '싱가포르 정부는 AI의 규제자일 뿐 아니라 가장 적극적인 사용자 중 하나다. GovTech가 공공 서비스에 AI를 심는 일을 주도한다: 정부 자체 AI 비서 Pair는 공무원을 위한 것이고, AI는 문서 업무, 시민 문의, 심사, 운영에 쓰이며 그 바탕에는 Smart Nation 디지털 정부가 있다. 취지는 더 많은 행정을 AI와 연결해 공공 서비스를 효율화하면서 책임성과 데이터 보안의 선을 지키는 것이다.\n\n이 주제는 공공 부문 AI에 관한 모든 국회 토론, 관련 GovTech 제품과 정책, 장관 입장을 집약한다 — 정부 자체 도구, 공공 서비스의 AI화부터 투명성, 알고리즘 책임성, 공공 신뢰까지, 싱가포르가 정부 자신을 AI 배치의 시험장으로 어떻게 다루는지 볼 수 있다.',
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
    intro:
      '医疗是新加坡四项 National AI Mission 之一,也是 AI 落地最讲分寸的领域。卫生部推动的 ACE-AI 等工具用于糖尿病、高血脂等风险的早筛,并定下「AI 辅助、而非 AI 决定」(AI-enhanced, not AI-decided)的原则,计划从 2027 年起在 Healthier SG 诊所铺开;背后是 Synapxe 的医疗数字底座与医院系统的对接。既要用 AI 提升诊疗与公共卫生,又要守住临床安全与责任归属。\n\n本主题汇集国会对医疗 AI 的每一次辩论、相关政策与部长表态——从筛查工具、医院系统、医疗数据治理,到临床问责与医患信任,你可以看到新加坡如何在最敏感的领域里,谨慎地把 AI 用进真实的诊疗流程。',
    introEn:
      'Healthcare is one of Singapore’s four National AI Missions, and the domain where AI is deployed most carefully. Health Ministry tools such as ACE-AI screen for risks like diabetes and high cholesterol, on an explicit “AI-enhanced, not AI-decided” principle, with rollout to Healthier SG clinics planned from 2027 — underpinned by Synapxe’s health-data backbone and hospital-system integration. The aim is to use AI to lift diagnosis and public health while holding firm on clinical safety and accountability.\n\nThis hub gathers every parliamentary debate on AI in healthcare, the related policies and ministerial statements — from screening tools, hospital systems and health-data governance to clinical accountability and doctor-patient trust — so you can see how Singapore, in its most sensitive domain, brings AI into real clinical workflows with care.',
    introJa:
      '医療はシンガポールの四つの National AI Mission の一つであり、AI の実装が最も慎重を要する領域だ。保健省の ACE-AI などのツールは糖尿病や高脂血症などのリスク早期スクリーニングに使われ、「AI が補助し、AI が決めない」(AI-enhanced, not AI-decided)という原則を掲げ、2027 年から Healthier SG 診療所への展開を計画する——その基盤には Synapxe の医療データ基盤と病院システムとの連携がある。AI で診療と公衆衛生を高めつつ、臨床の安全と責任の所在を守る。\n\n本テーマは医療 AI に関する国会討論のすべて、関連する政策と大臣の見解を集約する——スクリーニングツール、病院システム、医療データ統治から、臨床の説明責任と医患の信頼まで、シンガポールが最も繊細な領域で AI を実際の診療フローへどう慎重に取り込むかを追える。',
    introKo:
      '의료는 싱가포르의 네 개 National AI Mission 중 하나이며, AI 배치가 가장 신중을 요하는 영역이다. 보건부의 ACE-AI 같은 도구는 당뇨병·고지혈증 등의 위험 조기 선별에 쓰이며, “AI가 보조하되 AI가 결정하지 않는다”(AI-enhanced, not AI-decided)는 원칙을 내걸고 2027년부터 Healthier SG 진료소로 확대를 계획한다 — 그 바탕에는 Synapxe의 의료 데이터 기반과 병원 시스템 연계가 있다. AI로 진료와 공중보건을 높이면서 임상 안전과 책임 소재를 지킨다.\n\n이 주제는 의료 AI에 관한 모든 국회 토론, 관련 정책과 장관 입장을 집약한다 — 선별 도구, 병원 시스템, 의료 데이터 거버넌스부터 임상 책임성과 의사-환자 신뢰까지, 싱가포르가 가장 민감한 영역에서 AI를 실제 진료 흐름에 어떻게 신중히 들이는지 볼 수 있다.',
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
    intro:
      '作为区域金融中心,新加坡把金融业当作 AI 治理最先「上强度」的行业。新加坡金融管理局(MAS)2025 年发布《人工智能风险管理指引》,更早的 FEAT 原则(公平、伦理、问责、透明)、Veritas 计划与面向生成式 AI 的 MindForge 框架,合力要求金融机构在用 AI 做信贷、风控、反洗钱时守住可解释与可问责的底线。这里的监管往往比通用框架更硬、更细。\n\n本主题汇集国会与监管层对金融 AI 的每一次辩论、相关指引与政策原文——从 MAS 的风险管理要求、金融机构落地,到 fintech 创新与消费者保护,你可以看到 AI 在最受监管的行业里如何被约束着用起来。',
    introEn:
      'As a regional financial hub, Singapore makes finance the sector where AI governance goes “high-intensity” first. The Monetary Authority of Singapore (MAS) issued Guidelines on AI Risk Management in 2025; the earlier FEAT principles (Fairness, Ethics, Accountability, Transparency), the Veritas initiative and the MindForge framework for generative AI together require financial institutions to keep explainability and accountability intact when they use AI for credit, risk and anti-money-laundering. Regulation here is often harder and more granular than the general frameworks.\n\nThis hub gathers every parliamentary and regulatory debate on AI in finance, the related guidelines and policy documents — from MAS’s risk-management requirements and institutional deployment to fintech innovation and consumer protection — so you can see how AI is put to work, under constraint, in the most regulated sector.',
    introJa:
      '地域の金融ハブとして、シンガポールは金融業を AI 統治が最も早く「本格化」する分野に位置づける。シンガポール金融管理局(MAS)は 2025 年に《人工知能リスク管理指針》を公表し、より早い FEAT 原則(公平・倫理・説明責任・透明性)、Veritas 計画、生成 AI 向けの MindForge 枠組みが相まって、金融機関が与信・リスク・マネーロンダリング対策に AI を用いる際、説明可能性と説明責任の一線を守るよう求める。ここでの規制は汎用枠組みより硬く、細かいことが多い。\n\n本テーマは金融 AI に関する国会・規制側の討論のすべて、関連する指針と政策原文を集約する——MAS のリスク管理要件、金融機関の実装から、fintech の革新と消費者保護まで、最も規制の厳しい分野で AI がどう制約の下で使われるかを追える。',
    introKo:
      '역내 금융 허브로서 싱가포르는 금융업을 AI 거버넌스가 가장 먼저 “강도를 높이는” 분야로 삼는다. 싱가포르 통화청(MAS)은 2025년 《인공지능 위험관리 지침》을 발표했고, 앞선 FEAT 원칙(공정·윤리·책임·투명), Veritas 이니셔티브, 생성형 AI용 MindForge 프레임워크가 어우러져 금융기관이 여신·리스크·자금세탁방지에 AI를 쓸 때 설명 가능성과 책임성의 선을 지키도록 요구한다. 이곳의 규제는 범용 프레임워크보다 더 단단하고 세밀한 경우가 많다.\n\n이 주제는 금융 AI에 관한 모든 국회·규제 측 토론, 관련 지침과 정책 원문을 집약한다 — MAS의 위험관리 요건, 금융기관 배치부터 핀테크 혁신과 소비자 보호까지, 가장 규제가 심한 분야에서 AI가 제약 아래 어떻게 활용되는지 볼 수 있다.',
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
    intro:
      '新加坡是东南亚 AI 创业与资本的枢纽:人均创新密度极高,聚集了 Trax、ADVANCE.AI、Tookitaki、ViSenze、Biofourmis 等一批 AI 公司,以及独角兽与已上市企业,吸走了区域相当大比重的科技融资。政府一端用 EDB、Startup SG 与各类基金托举,另一端靠开放市场与人才把全球玩家引进来——创业生态是新加坡把 AI 战略变成经济增量的最直接一环。\n\n本主题汇集国会与政策层对 AI 创业与投资的每一次辩论、相关计划,以及生态数据入口——从融资、退出、独角兽,到垂直赛道与投资网络,你可以顺着这里进入 sgai 追踪的完整创业生态图谱。',
    introEn:
      'Singapore is Southeast Asia’s hub for AI startups and capital: innovation density per capita is exceptionally high, home to AI companies such as Trax, ADVANCE.AI, Tookitaki, ViSenze and Biofourmis alongside unicorns and listed firms, and it draws a sizeable share of the region’s tech funding. The government props this up through EDB, Startup SG and various funds, while an open market and talent pool pull global players in — the startup ecosystem is the most direct way Singapore turns AI strategy into economic upside.\n\nThis hub gathers every parliamentary and policy debate on AI startups and investment, the related programmes, and the ecosystem data — from funding, exits and unicorns to vertical sectors and the investor network — so you can move from here into the full startup-ecosystem map that sgai tracks.',
    introJa:
      'シンガポールは東南アジアにおける AI スタートアップと資本のハブだ。人口当たりのイノベーション密度が極めて高く、Trax、ADVANCE.AI、Tookitaki、ViSenze、Biofourmis といった AI 企業やユニコーン・上場企業が集積し、域内の技術資金のかなりの割合を引き寄せる。政府は EDB、Startup SG、各種ファンドで下支えし、開放的な市場と人材が世界のプレイヤーを呼び込む——スタートアップ・エコシステムは、シンガポールが AI 戦略を経済的上振れへ変える最も直接的な要である。\n\n本テーマは AI スタートアップと投資に関する国会・政策の討論のすべて、関連する施策、そしてエコシステムのデータ入口を集約する——資金調達、イグジット、ユニコーンから、垂直領域と投資ネットワークまで、ここから sgai が追跡する完全なスタートアップ・エコシステム地図へ進める。',
    introKo:
      '싱가포르는 동남아시아 AI 스타트업과 자본의 허브다. 1인당 혁신 밀도가 매우 높고 Trax, ADVANCE.AI, Tookitaki, ViSenze, Biofourmis 같은 AI 기업과 유니콘·상장 기업이 밀집해 있으며, 역내 기술 자금의 상당 부분을 끌어들인다. 정부는 EDB, Startup SG, 각종 펀드로 떠받치고, 개방된 시장과 인재가 글로벌 플레이어를 불러들인다 — 스타트업 생태계는 싱가포르가 AI 전략을 경제적 상승분으로 바꾸는 가장 직접적인 고리다.\n\n이 주제는 AI 스타트업과 투자에 관한 모든 국회·정책 토론, 관련 프로그램, 그리고 생태계 데이터 입구를 집약한다 — 투자 유치, 엑시트, 유니콘부터 수직 분야와 투자자 네트워크까지, 여기서 sgai가 추적하는 완전한 스타트업 생태계 지도로 이동할 수 있다.',
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
    intro:
      '开源是新加坡 AI 战略里一个安静但关键的选择。旗舰是 AI Singapore 主导的 SEA-LION——一套面向东南亚语言的开源大模型,试图解决主流模型对本区域语言与语境覆盖不足的问题;政府机构与研究团队也把工具、数据集与研究代码以开放方式发布。对一个小国来说,开源既是降低对单一厂商依赖的策略,也是把区域影响力放大出去的杠杆。\n\n本主题汇集国会与政策层对开源 AI 的相关辩论、官方与产学研的开源项目,以及生态追踪——从 SEA-LION 等本土模型、开放数据集,到开源在人才培养与区域合作中的角色,你可以看到新加坡如何用开放来换取自主与影响力。',
    introEn:
      'Open source is a quiet but pivotal choice in Singapore’s AI strategy. The flagship is SEA-LION, led by AI Singapore — a family of open large language models for Southeast Asian languages, built to fix mainstream models’ thin coverage of the region’s languages and contexts; government bodies and research teams also release tools, datasets and research code openly. For a small state, open source is both a way to reduce dependence on any single vendor and a lever to amplify regional influence.\n\nThis hub gathers the parliamentary and policy debates touching open-source AI, the official and industry-academia open projects, and the ecosystem tracking — from home-grown models like SEA-LION and open datasets to the role of open source in talent-building and regional cooperation — so you can see how Singapore trades openness for autonomy and reach.',
    introJa:
      'オープンソースは、シンガポールの AI 戦略における静かだが重要な選択だ。旗艦は AI Singapore が主導する SEA-LION——東南アジア言語向けのオープンな大規模言語モデル群で、主流モデルによる域内言語・文脈のカバー不足を補うことを狙う。政府機関や研究チームもツール、データセット、研究コードをオープンに公開する。小国にとってオープンソースは、単一ベンダーへの依存を下げる戦略であると同時に、地域への影響力を増幅するレバーでもある。\n\n本テーマはオープンソース AI に関わる国会・政策の討論、官民・産学のオープンプロジェクト、そしてエコシステム追跡を集約する——SEA-LION などの地場モデル、オープンデータセットから、人材育成と地域協力におけるオープンソースの役割まで、シンガポールが開放性を自律と影響力に換える様子を追える。',
    introKo:
      '오픈소스는 싱가포르 AI 전략에서 조용하지만 결정적인 선택이다. 대표 사례는 AI Singapore가 주도하는 SEA-LION — 동남아시아 언어를 위한 오픈 대규모 언어모델군으로, 주류 모델의 역내 언어·맥락 커버리지 부족을 메우려 한다. 정부 기관과 연구팀도 도구, 데이터셋, 연구 코드를 공개한다. 소국에게 오픈소스는 단일 벤더 의존을 낮추는 전략이자 지역 영향력을 증폭하는 지렛대다.\n\n이 주제는 오픈소스 AI와 관련된 국회·정책 토론, 공공·산학의 오픈 프로젝트, 그리고 생태계 추적을 집약한다 — SEA-LION 같은 자국 모델, 오픈 데이터셋부터 인재 양성과 지역 협력에서 오픈소스의 역할까지, 싱가포르가 개방성을 자율과 영향력으로 바꾸는 모습을 볼 수 있다.',
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
    intro:
      '在全球 AI 竞赛里,新加坡是一个「以小博大」的样本。Tortoise 全球 AI 指数把它排在美国、中国之后,常年位居第三,人均强度(intensity)甚至全球第一——用有限的体量换取超额的位置。它更把「AI 治理」做成一种软实力:率先输出可检验的治理框架,活跃于 GPAI、联合国及各类多边场合,试图当规则的召集者而非旁观者。\n\n本主题汇集国会与政策层对国际对标与合作的相关辩论、跨国框架与官方表态,以及 sgai 的国际对标数据——从各大指数排名、与主要经济体的横向对比,到区域与多边合作,你可以看到新加坡如何在大国之间为自己找位置。',
    introEn:
      'In the global AI race, Singapore is a case study in punching above its weight. Tortoise’s Global AI Index places it third behind the US and China year after year — and first in the world on intensity per capita, trading limited scale for an outsized position. It also turns “AI governance” into soft power: exporting testable governance frameworks early and staying active in GPAI, the UN and other multilateral venues, seeking to be a convener of the rules rather than a bystander.\n\nThis hub gathers the parliamentary and policy debates on international benchmarking and cooperation, the cross-border frameworks and official statements, and sgai’s benchmarking data — from index rankings and side-by-side comparison with major economies to regional and multilateral cooperation — so you can see how Singapore finds a place for itself among the great powers.',
    introJa:
      '世界の AI 競争において、シンガポールは「小よく大を制す」の事例だ。Tortoise の世界 AI 指数は同国を米国・中国に次ぐ第三位に据え続け、人口当たりの強度(intensity)では世界一——限られた規模で分不相応の地位を得ている。さらに「AI ガバナンス」をソフトパワーに変える:検証可能な統治枠組みをいち早く発信し、GPAI や国連など多国間の場で活発に動き、傍観者ではなくルールの招集者たろうとする。\n\n本テーマは国際対標と協力に関する国会・政策の討論、越境の枠組みと公式見解、そして sgai の国際比較データを集約する——各指数の順位、主要経済体との横並び比較から、地域・多国間協力まで、シンガポールが大国の間で自らの位置をどう見いだすかを追える。',
    introKo:
      '글로벌 AI 경쟁에서 싱가포르는 “작지만 크게 겨루는” 사례다. Tortoise의 글로벌 AI 지수는 이 나라를 미국·중국에 이어 해마다 3위에 놓으며, 1인당 강도(intensity)에서는 세계 1위다 — 제한된 규모로 분에 넘치는 위치를 얻는다. 나아가 “AI 거버넌스”를 소프트파워로 바꾼다: 검증 가능한 거버넌스 프레임워크를 일찍 내보내고 GPAI, 유엔 등 다자 무대에서 활발히 움직이며 방관자가 아니라 규칙의 소집자가 되려 한다.\n\n이 주제는 국제 벤치마킹과 협력에 관한 국회·정책 토론, 국경을 넘는 프레임워크와 공식 입장, 그리고 sgai의 벤치마킹 데이터를 집약한다 — 각종 지수 순위, 주요 경제국과의 나란한 비교부터 지역·다자 협력까지, 싱가포르가 강대국 사이에서 자기 자리를 어떻게 찾는지 볼 수 있다.',
    icon: 'tabler:world',
  },
];

export const topicIdSet = new Set(topics.map((tp) => tp.id));

export function getTopicById(id: string): Topic | undefined {
  return topics.find((tp) => tp.id === id);
}

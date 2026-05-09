export interface Policy {
  // Stable kebab-case id, derived from titleEn at codemod time.
  // Optional during the migration window; codemod-policies.ts populates it
  // for every record. Phase 1.14 verify-graph.ts asserts non-null.
  id?: string;
  title: string;
  titleEn: string;
  titleJa?: string;
  date: string;
  source: string;
  sourceOrgUrl?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  translatedPdfUrl?: string;
  summary: string;
  content: string;
  // i18n (v0.3.0). EN renderer prefers these; falls back to zh fields if
  // missing. Translation pass populates them in batches.
  summaryEn?: string;
  summaryJa?: string;
  contentEn?: string;
  contentJa?: string;
  sourceEn?: string;
  sourceJa?: string;
  // Optional profile fields for richer landing pages. Existing records can
  // render from summary/content alone; these fields let future passes add
  // structured facts, sections, milestones, and curated links incrementally.
  keyFacts?: PolicyFact[];
  sections?: PolicySection[];
  milestones?: PolicyMilestone[];
  resources?: PolicyResource[];
  lastVerified?: string;
  // Phase 1 knowledge-graph fields (all optional during migration; hand-
  // curated over time. Empty arrays mean "no known links yet").
  ministry?: string; // matches Affiliation values in src/data/people.ts
  authorPersonIds?: string[]; // → src/data/people.ts ids
  relatedDebateIds?: string[]; // → src/data/debates.ts ids
  relatedLeverNumbers?: number[]; // 1–6
  relatedTimelineYears?: number[];
  relatedPostSlugs?: string[];
}

export interface PolicyFact {
  label: string;
  labelEn?: string;
  labelJa?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
}

export interface PolicySection {
  title: string;
  titleEn?: string;
  titleJa?: string;
  body: string;
  bodyEn?: string;
  bodyJa?: string;
}

export interface PolicyMilestone {
  date: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
}

export interface PolicyResource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  url: string;
  kind?: 'source' | 'pdf' | 'translation' | 'website' | 'dataset' | 'tool' | 'report';
}

export interface PolicyCategory {
  name: string;
  nameEn?: string;
  nameJa?: string;
  icon: string;
  policies: Policy[];
}

export const categories: PolicyCategory[] = [
  {
    name: '国家战略',
    nameJa: '国家戦略',
    nameEn: 'National Strategy',
    icon: '🏛️',
    policies: [
      {
        id: 'public-ai-research-investment-2026-2030',
        title: '公共 AI 研究投资计划 (2026-2030)',
        titleJa: '公開 AI 研究投資計画 (2026-2030)',
        titleEn: 'Public AI Research Investment 2026-2030',
        date: '2026-01',
        source: '数字发展与信息部 (MDDI)',
        sourceJa: 'デジタル発展・情報部 (MDDI)',
        sourceOrgUrl: 'https://www.mddi.gov.sg/',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
        summary: '10 亿新元（7.79 亿美元）公共 AI 研究投资，聚焦负责任和资源高效的 AI。',
        summaryJa:
          '10 億シンガポール・ドル（7.79 億米ドル）の公開 AI 研究投資。責任ある、リソース効率の高い AI に焦点を当てています。',
        content: `2026 年 1 月 24 日，数字发展与信息部宣布 2026-2030 年间投资超 10 亿新元（约 7.79 亿美元）用于公共 AI 研究。三大方向：一是"负责任和资源高效的 AI"研究，延续 AI Verify 等可信赖 AI 路线；二是全链条 AI 人才培养，从高中预科到大学教师培训；三是支持产业应用，缩短研究到商业化路径。这是继 2024 年 5 亿新元高性能计算资源投资后的又一重大投入，标志着新加坡从"试点探索"进入"规模化建设"阶段。人均 AI 投资达 139 美元，远高于美国（33 美元）和中国（7 美元）。`,
        contentJa: `2026年1月24日、デジタル開発・情報省は2026～2030年間に10億シンガポール・ドル以上（約7.79億米ドル）を公共AI研究に投資することを発表しました。3つの主要な方向があります：1つ目は「責任ある・リソース効率的なAI」研究で、AI Verifyなどの信頼できるAI路線を継続するものです。2つ目は全チェーンのAI人材育成で、高校予科から大学教員研修までをカバーします。3つ目は産業応用を支援し、研究から商業化へのパスを短縮するものです。これは2024年の5億シンガポール・ドルの高性能計算リソース投資に続く重大な投入であり、シンガポールが「パイロット探索」から「規模化構築」段階への移行を示しています。一人当たりのAI投資は139米ドルに達し、米国（33米ドル）と中国（7米ドル）をはるかに上回っています。`,
        summaryEn:
          'S$1 billion (US$779 million) in public AI research investment, focused on responsible and resource-efficient AI.',
        contentEn: `On 24 January 2026, the Ministry of Digital Development and Information announced over S$1 billion (about US$779 million) in public AI research funding for 2026-2030. Three priorities: research on "responsible and resource-efficient AI," extending the trusted-AI track that includes AI Verify; full-pipeline AI talent development, from junior college pre-tertiary programmes to university faculty training; and industry applications, shortening the path from research to commercialisation. Coming after 2024's S$500 million in high-performance computing, this marks Singapore's shift from pilot exploration to scaled build-out. Per-capita AI investment reaches US$139 — far above the US (US$33) and China (US$7).`,
        sourceEn: 'Ministry of Digital Development and Information (MDDI)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'national-ai-strategy-20-nais-20',
        title: '国家人工智能战略 2.0',
        titleJa: '国家 AI 戦略 2.0',
        titleEn: 'National AI Strategy 2.0 (NAIS 2.0)',
        date: '2023-12',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        pdfUrl: 'https://file.go.gov.sg/nais2023.pdf',
        translatedPdfUrl: '/pdfs/nais-2.0-zh.pdf',
        summary: '升级版国家 AI 战略，提出 AI for Public Good、AI for Growth 双轨目标，确定九大优先领域。',
        summaryJa:
          '国家 AI 戦略の改定版。「AI for Public Good」「AI for Growth」の二本柱を掲げ、九つの重点領域を特定しています。',
        content: `NAIS 2.0 将 AI 战略从"重点应用"升级为"系统性赋能"。双轨目标：AI for Public Good 和 AI for Growth。涵盖十五大行动，追加拨款至 10 亿新元以上，建设国家 AI 计算基础设施。确定九大优先领域：交通物流、制造业、金融、安全、网络安全、智慧城市、医疗、教育和政府服务，其中医疗和金融科技获最高投资比重。`,
        contentJa: `NAIS 2.0は、AI戦略を「重点的応用」から「システム的エンパワーメント」へアップグレードしています。二軌並行の目標：AI for Public GoodおよびAI for Growth。15の大きな行動を含み、10億シンガポール・ドル以上の追加予算配分が行われ、国家AI計算基盤が構築されます。9つの優先領域が特定されています：交通物流、製造業、金融、安全、サイバーセキュリティ、スマートシティ、医療、教育、および政府サービス。このうち医療と金融技術が最も高い投資比率を受けています。`,
        summaryEn:
          'Upgraded national AI strategy with twin tracks — AI for Public Good and AI for Growth — and nine priority sectors.',
        contentEn: `NAIS 2.0 shifts Singapore's AI strategy from targeted applications to systemic enablement. Twin objectives: AI for Public Good and AI for Growth. The strategy spans fifteen action lines, lifts the funding envelope above S$1 billion, and builds out national AI compute infrastructure. Nine priority sectors are designated: transport and logistics, manufacturing, finance, safety and security, cybersecurity, smart cities, healthcare, education, and government services — with healthcare and fintech receiving the largest investment weighting.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: 'MDDI',
        authorPersonIds: ['josephine-teo', 'lawrence-wong'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 2, 3, 4, 5, 6],
        relatedTimelineYears: [2024, 2026],
        relatedPostSlugs: ['singapore-ai-strategy-the-real-moat', 'singapore-ai-native-companies-vs-nations'],
      },
      {
        id: 'smart-nation-20',
        title: '智慧国家 2.0',
        titleJa: 'スマート・ネーション 2.0',
        titleEn: 'Smart Nation 2.0',
        date: '2023-10',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        translatedPdfUrl: '/pdfs/smart-nation-2.0-zh.pdf',
        summary: '数字基础设施升级蓝图，涵盖数字政府、数字经济、数字社会三大支柱。',
        summaryJa: 'デジタル基盤施設のアップグレード計画。デジタル政府、デジタル経済、デジタル社会の三本柱を含みます。',
        content: `Smart Nation 2.0 是 2014 年智慧国家倡议的全面升级，于 2023 年 10 月发布。三大支柱：数字政府——推动政府服务全面数字化和 AI 化；数字经济——支持企业数字化转型和 AI 采纳；数字社会——确保全民具备数字素养，缩小数字鸿沟。2024 年 10 月启动具体落地计划，包括 1.2 亿新元 AI 应用基金，支持五大国家 AI 项目：智能货运规划、市政服务、慢性病预测与管理、个性化教育和边境清关。在基础设施层面，规划了国家级 AI 计算平台、数据共享基础设施和安全的数字身份体系。`,
        contentJa: `Smart Nation 2.0は、2014年のSmart Nation Initiativeの全面的なアップグレードであり、2023年10月に発表されました。3つの支柱があります：デジタル政府――政府サービスの完全なデジタル化とAI化を推進すること。デジタル経済――企業のデジタル変革とAI採用を支援すること。デジタル社会――全国民にデジタルリテラシーを備えさせ、デジタル格差を縮小すること。2024年10月に具体的な実装計画が開始され、1.2億シンガポール・ドルのAI応用基金が含まれ、5つの国家AIプロジェクトを支援しています：インテリジェント貨物運送計画、市政サービス、慢性疾患予測・管理、個別化教育、および国境通関。インフラストラクチャレベルでは、国家レベルのAI計算プラットフォーム、データ共有インフラストラクチャ、および安全なデジタルアイデンティティシステムが計画されています。`,
        summaryEn:
          'Digital infrastructure upgrade blueprint built on three pillars: Digital Government, Digital Economy, Digital Society.',
        contentEn: `Smart Nation 2.0, released in October 2023, is a full upgrade of the 2014 Smart Nation Initiative. Three pillars: Digital Government — driving end-to-end digitalisation and AI adoption across public services; Digital Economy — supporting enterprise digital transformation and AI adoption; Digital Society — ensuring universal digital literacy and closing the digital divide. In October 2024, an implementation plan was launched, including a S$120 million AI application fund supporting five national AI projects: intelligent freight planning, municipal services, chronic disease prediction and management, personalised education, and border clearance. At the infrastructure layer, the plan covers a national AI compute platform, data-sharing infrastructure, and a secure digital identity system.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'national-ai-strategy-nais-10',
        title: '国家人工智能战略 1.0',
        titleJa: '国家 AI 戦略 1.0',
        titleEn: 'National AI Strategy (NAIS 1.0)',
        date: '2019-11',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        pdfUrl: 'https://file.go.gov.sg/nais2019.pdf',
        translatedPdfUrl: '/pdfs/nais-1.0-zh.pdf',
        summary: '新加坡首份国家级 AI 战略，确立五大重点领域和三大推动力。',
        summaryJa: 'シンガポール初の国家レベルの AI 戦略。五つの重点領域と三つの推進力を確立しています。',
        content: `NAIS 1.0 标志着 AI 从技术议题上升为国家战略。五大重点领域：智能交通与物流、智慧城市、医疗健康、教育、安全与保障。三大推动力：三重螺旋合作、AI 人才管道、数据架构与可信 AI。催生了 AI Singapore 项目和 100 Experiments 计划。`,
        contentJa: `NAIS 1.0は、AIが技術問題から国家戦略へと上昇したことを示しています。5つの重点領域：インテリジェント交通・物流、スマートシティ、医療・健康、教育、セキュリティ・保障。3つの推進力：トリプルヘリックス協力、AI人材パイプライン、データアーキテクチャおよび信頼できるAI。これはAI Singaporeプロジェクトと100 Experiments計画を生み出しました。`,
        summaryEn: "Singapore's first national AI strategy, identifying five focus sectors and three enablers.",
        contentEn: `NAIS 1.0 marked the elevation of AI from a technology topic to a national strategy. Five focus sectors: intelligent transport and logistics, smart cities, healthcare, education, and safety and security. Three enablers: triple-helix collaboration, an AI talent pipeline, and data architecture plus trusted AI. The strategy spawned AI Singapore and the 100 Experiments programme.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'smart-nation-initiative',
        title: '智慧国家倡议',
        titleJa: 'スマート・ネーション・イニシアティブ',
        titleEn: 'Smart Nation Initiative',
        date: '2014',
        source: '总理办公室 (PMO)',
        sourceJa: '首相府 (PMO)',
        sourceOrgUrl: 'https://www.pmo.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/about/our-vision/smart-nation-vision/',
        pdfUrl:
          'https://www.pmo.gov.sg/Newsroom/transcript-prime-minister-lee-hsien-loongs-speech-smart-nation-launch-24-november',
        translatedPdfUrl: '/pdfs/smart-nation-initiative-zh.pdf',
        summary: '新加坡数字化转型总体框架，为后续 AI 战略奠定基础。',
        summaryJa: 'シンガポールのデジタル変革全体フレームワーク。その後の AI 戦略の基礎を築いています。',
        content: `2014 年，新加坡总理李显龙宣布 Smart Nation Initiative，这是全面数字化转型的总体战略框架。核心目标包括利用数字技术改善市民生活、创造更多经济机会、建设更紧密联系的社区。虽非专门的 AI 政策，但为后续 AI 战略提供了制度基础和政策框架。`,
        contentJa: `2014年、シンガポール首相Lee Hsien Loongは Smart Nation Initiativeを発表しました。これは全面的なデジタル変革の総体的な戦略フレームワークです。中核的な目標は、デジタル技術を利用して市民生活を改善すること、より多くの経済的機会を創造すること、より緊密に結びついたコミュニティを構築することを含みます。AI専門の政策ではありませんが、その後のAI戦略に制度的基盤と政策的枠組みを提供しました。`,
        summaryEn:
          "Singapore's overarching digital transformation framework, laying the institutional foundation for subsequent AI strategies.",
        contentEn: `In 2014, Prime Minister Lee Hsien Loong announced the Smart Nation Initiative as a whole-of-nation strategic framework for digital transformation. Core goals: use digital technology to improve citizens' lives, create more economic opportunities, and build more tightly connected communities. Although not an AI-specific policy, it provided the institutional and policy foundation for subsequent AI strategies.`,
        sourceEn: "Prime Minister's Office (PMO)",
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'saf-digital-and-intelligence-service-fourth-service',
        title: 'SAF Digital and Intelligence Service (DIS)',
        titleEn: 'SAF Digital and Intelligence Service — Fourth Service',
        date: '2022-10',
        source: '国防部 (MINDEF)',
        sourceJa: '国防部 (MINDEF)',
        sourceOrgUrl: 'https://www.mindef.gov.sg/',
        sourceUrl: 'https://www.mindef.gov.sg/news-and-events/latest-releases/28oct22_speech',
        summary: 'SAF 第四军种成立——把 AI 与数字情报写进军种结构本身。',
        summaryJa: 'SAF 第四軍種の創設。AI とデジタル情報を軍種構造そのものに組み込みます。',
        content: `2022 年 10 月，新加坡国防部正式成立 SAF Digital and Intelligence Service (DIS)，作为陆军、海军、空军之外的第四军种，专责数字与情报作战、网络防御、AI 决策支持。2025 年 DIS 进一步重组为 DCCOM（数字网络指挥部）和 SAFC4DC（C4 与防务计算指挥部）两个司令部。这是新加坡国家级 AI-native 战略最深的结构性动作——把 AI 写进军种本身，而非作为某个部门的项目。配套：DIS × AI Singapore MoU、DIS Sentinel Programme + AI 课程、SAF Digital Range / CyTEC 升级。`,
        contentJa: `2022年10月、シンガポール国防省は正式にSAF Digital and Intelligence Service (DIS)を設立しました。これは陸軍、海軍、空軍に次ぐ第4の軍種として機能し、デジタル・インテリジェンス作戦、サイバー防御、AI意思決定支援を専門とします。2025年、DISはDCCOM（デジタルネットワーク司令部）とSAFC4DC（C4および防御計算司令部）の2つの司令部へさらに再編成されます。これはシンガポール国家レベルのAI-ネイティブ戦略における最も深い構造的な動きです――AIを軍種そのものに組み込むことで、ある部門のプロジェクトとしてではなく実現します。対応措置：DIS × AI Singapore MoU、DIS Sentinel Programme + AIコース、SAF Digital Range / CyTEC アップグレード。`,
        summaryEn:
          "Establishment of the SAF's fourth Service — embedding AI and digital intelligence into the force structure itself.",
        contentEn: `In October 2022, Singapore's Ministry of Defence formally established the SAF Digital and Intelligence Service (DIS) as the fourth Service alongside the Army, Navy, and Air Force, with sole responsibility for digital and intelligence operations, cyber defence, and AI decision support. In 2025, DIS was further reorganised into two commands: DCCOM (Digital Cyber Command) and SAFC4DC (C4 and Defence Computing Command). This is the deepest structural move in Singapore's national AI-native strategy — writing AI into the Service structure itself rather than running it as a departmental project. Supporting elements include the DIS × AI Singapore MoU, the DIS Sentinel Programme with AI curriculum, and upgrades to the SAF Digital Range / CyTEC.`,
        sourceEn: 'Ministry of Defence (MINDEF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'singapore-ai-safety-institute',
        title: 'Singapore AI Safety Institute (AISI)',
        titleEn: 'Singapore AI Safety Institute',
        date: '2024-05',
        source: 'IMDA / Digital Trust Centre',
        sourceOrgUrl: 'https://aiverifyfoundation.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        summary: '前沿 AI 安全研究的国家级研究所，承担 Singapore Consensus 协调职能。',
        summaryJa: '最先端の AI 安全研究に関する国家レベルの研究所。Singapore Consensus の調整機能を担当しています。',
        content: `Singapore AI Safety Institute (AISI) 于 2024 年成立，年度预算 S$10M，由 IMDA 与 Digital Trust Centre 联合运营，挂靠 NTU。承担前沿 AI 模型的红队评估、对齐研究、可追溯性测试三类核心研究。AISI 还作为 Singapore Consensus on Global AI Safety Research Priorities（11 国签署，含中美）的协调中心，并主办 International Scientific Exchange on AI Safety（ISESEA）I + II。AISI 是新加坡"用 0.07% 全球人口撬动 G7 级 AI 治理话语权"战略最关键的机构。`,
        contentJa: `Singapore AI Safety Institute (AISI)は2024年に設立され、年間予算はS$10Mで、IMDAとDigital Trust Centreが共同で運営し、NTUに属しています。最先端のAIモデルの赤チーム評価、アライメント研究、トレーサビリティテストの3つの主要研究を担当しています。ASIはまた、Singapore Consensus on Global AI Safety Research Priorities（11カ国が署名、米国と中国を含む）の調整中心として機能し、International Scientific Exchange on AI Safety（ISESEA）IおよびIIを開催しています。ASIは、シンガポールが「世界人口の0.07%を用いてG7級のAI治理における発言権を活用する」戦略において、最も重要な機関です。`,
        summaryEn:
          'National research institute for frontier AI safety, hosting the Singapore Consensus coordination function.',
        contentEn: `The Singapore AI Safety Institute (AISI) was established in 2024 with an annual budget of S$10M, jointly operated by IMDA and the Digital Trust Centre and hosted at NTU. It covers three core research areas on frontier AI models: red-team evaluation, alignment research, and traceability testing. AISI also serves as the coordination centre for the Singapore Consensus on Global AI Safety Research Priorities (signed by 11 countries, including the US and China) and hosts the International Scientific Exchange on AI Safety (ISESEA) I + II. AISI is the most critical institution in Singapore's strategy of "leveraging 0.07% of the world's population into G7-level AI governance influence."`,
        sourceEn: 'IMDA / Digital Trust Centre',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'goals-of-smart-nation-20',
        title: '智慧国家2.0的目标',
        titleJa: 'スマート・ネーション 2.0 の目標',
        titleEn: 'Goals of Smart Nation 2.0',
        date: '2025-07',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/about/our-goals/goals-of-smart-nation/',
        summary:
          '新加坡智慧国家2.0战略旨在实现三个核心目标：信任、增长和社区。这些目标源于公民多年来通过调查、研究和反馈渠道提出的关键关切，反映了政府如何利用技术改善公民生活并为所有人创造繁荣数字未来的承诺。智慧国家2.0战略将随着数字发展的演进而不断迭代和调整。',
        summaryJa:
          'シンガポールのスマート・ネーション 2.0 戦略は、三つの核心的な目標を達成することを目指しています：信頼、成長、コミュニティ。これらの目標は、長年にわたり調査、研究、フィードバックチャネルを通じて市民から提出された重要な懸念に基づいています。これはテクノロジーを活用して市民の生活を改善し、すべての人のための繁栄したデジタル未来を創造するという政府の約束を反映しています。スマート・ネーション 2.0 戦略は、デジタル発展の進化に伴い継続的に反復され、調整されます。',
        content: `新加坡智慧国家2.0战略旨在实现三个核心目标：信任、增长和社区。这些目标源于公民多年来通过调查、研究和反馈渠道提出的关键关切，反映了政府如何利用技术改善公民生活并为所有人创造繁荣数字未来的承诺。智慧国家2.0战略将随着数字发展的演进而不断迭代和调整。`,
        contentJa: `シンガポールのスマート・ネーション 2.0 戦略は、三つの核心的な目標を達成することを目指しています：信頼、成長、コミュニティ。これらの目標は、長年にわたり調査、研究、フィードバックチャネルを通じて市民から提出された重要な懸念に基づいています。これはテクノロジーを活用して市民の生活を改善し、すべての人のための繁栄したデジタル未来を創造するという政府の約束を反映しています。スマート・ネーション 2.0 戦略は、デジタル発展の進化に伴い継続的に反復され、調整されます。`,
        summaryEn:
          "Singapore's Smart Nation 2.0 strategy aims to achieve three core goals: Trust, Growth, and Community. These goals, derived from citizen feedback gathered through surveys, research, and other channels over the years, reflect how technology will be used to improve citizens' lives and create a thriving digital future for all. The Smart Nation 2.0 strategies will be continually iterated and adjusted as digital developments evolve, with ongoing consultation with citizens and businesses.",
        contentEn: `Singapore's Smart Nation 2.0 strategy aims to achieve three core goals: Trust, Growth, and Community. These goals, derived from citizen feedback gathered through surveys, research, and other channels over the years, reflect how technology will be used to improve citizens' lives and create a thriving digital future for all. The Smart Nation 2.0 strategies will be continually iterated and adjusted as digital developments evolve, with ongoing consultation with citizens and businesses.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '治理框架',
    nameJa: 'ガバナンスフレームワーク',
    nameEn: 'AI Governance Frameworks',
    icon: '⚖️',
    policies: [
      {
        id: 'iso-iec-42119-8-generative-ai-testing-standard',
        title: 'ISO/IEC 42119-8 生成式 AI 测试标准（提案）',
        titleJa: 'ISO/IEC 42119-8 生成 AI テスト標準（提案）',
        titleEn: 'ISO/IEC 42119-8 Generative AI Testing Standard (Proposal)',
        date: '2026-04',
        source: '资讯通信媒体发展局 (IMDA) / Enterprise Singapore',
        sourceJa: '情報通信メディア発展庁 (IMDA) / Enterprise Singapore',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/singapore-champions-new-global-ai-testing-standardisation-efforts',
        summary: '新加坡在第 17 届 ISO/IEC JTC 1/SC 42 全会提交的全球首个生成式 AI 测试国际标准草案。',
        summaryJa:
          'シンガポールが第 17 回 ISO/IEC JTC 1/SC 42 全体会議で提出した、生成 AI テストに関する世界初の国際標準案。',
        content: `2026 年 4 月 20 日，第 17 届 ISO/IEC JTC 1/SC 42 全体会议在新加坡开幕（首次在东盟举办，由 IMDA 与 Enterprise Singapore 联合主办，35+ 国家、250+ 专家参与）。新加坡正式提交 **ISO/IEC 42119-8** 标准草案——如果通过，这将是全球首个针对生成式 AI 系统的国际测试标准。

**两个核心方向**：
- **基准测试（Benchmarking）**：用统一数据集衡量 AI 性能，解决"考什么、怎么评分"的可比性问题
- **红队测试（Red Teaming）**：模拟攻击找出系统漏洞，标准化"隐藏风险怎么找出来"

提案建立在 IMDA 已有的国内测试基础设施之上：AI Verify Toolkit、Starter Kit for Testing of LLM-Based Applications、Global AI Assurance Sandbox。樟宜机场 2025 年 2 月获得的全球首张 ISO/IEC 42001 AI 管理体系认证，则提供了"AI 治理可被外部审计"的可执行案例。

IMDA 现任 CEO **Ng Cher Pong**（2025-11 上任）在开幕致辞中说："标准的制定不能以龟速推进——否则将被 AI 高速变革所淘汰。"他同时强调标准应在行业、文化和语言层面具有代表性，东南亚作为全球文化最多元的地区之一必须接入标准制定。

国际 ISO 标准从提案到正式发布通常需要数年。但提案一旦提出，等于把全球后续讨论的框架定下来了——这正是新加坡"用 0.07% 全球人口撬动 G7 级 AI 治理话语权"的典型操作。`,
        contentJa: `2026年4月20日、第17回ISO/IEC JTC 1/SC 42会議がシンガポールで開幕しました（ASEAN地域での初開催、IMDAおよびEnterprise Singaporeが共同主催、35カ国以上、250人以上の専門家が参与）。シンガポールは正式にISO/IEC 42119-8標準草案を提出しました――承認された場合、これは生成型AIシステムを対象とした世界初の国際テスト標準となるでしょう。

2つの中核的方向：
- ベンチマーク測定（Benchmarking）：統一データセットを使用してAI性能を測定し、「何をテストするのか、どのようにスコアをつけるのか」という比較可能性の問題を解決する
- レッドチーム測定（Red Teaming）：攻撃をシミュレートしてシステムの脆弱性を特定し、「隠れたリスクをどのように見つけるのか」を標準化する

提案はIMDAがすでに備えている国内テスト基盤の上に構築されています：AI Verify Toolkit、Starter Kit for Testing of LLM-Based Applications、Global AI Assurance Sandbox。Changi Airport（チャンギ空港）が2025年2月に獲得したISO/IEC 42001 AI管理体系認証としての世界初の認証は、「AI治理は外部監査が可能である」という実行可能なケーススタディを提供しています。

IMDA現任CEO Ng Cher Pong（2025年11月就任）は開幕式での演説で述べました：「標準の制定は亀の歩みで進められてはいけません――そうしなければ、AIの高速な変革に淘汰されてしまいます。」彼は同時に、標準は業界、文化、言語レベルで代表性を持つべきであり、世界で最も文化的多様性に富んだ地域の一つである東南アジアが標準制定プロセスに組み込まれなければならないと強調しました。

国際的なISO標準は提案から正式発表まで通常数年を要します。しかし、提案が一度提出されると、その後の全球的な議論の枠組みを定めることと等しくなります――これこそがシンガポールが「世界人口の0.07%を用いてG7級のAI治理における発言権を活用する」という典型的な操作です。`,
        summaryEn:
          "Singapore's draft of the world's first international standard for testing generative AI systems, tabled at the 17th ISO/IEC JTC 1/SC 42 plenary.",
        contentEn: `On 20 April 2026, the 17th ISO/IEC JTC 1/SC 42 plenary opened in Singapore — the first time in ASEAN, co-organised by IMDA and Enterprise Singapore, with 35+ national bodies and 250+ AI experts participating. Singapore formally tabled **ISO/IEC 42119-8**, which, if adopted, will be the world's first international standard for testing generative AI systems.

**Two core pillars:**
- **Benchmarking** — using shared datasets to measure AI performance, solving the comparability problem of "what to test and how to score"
- **Red Teaming** — simulating attacks to surface hidden risks, standardising "how to find what's hidden"

The proposal builds on IMDA's domestic testing infrastructure: the AI Verify Toolkit, the Starter Kit for Testing of LLM-Based Applications, and the Global AI Assurance Sandbox. Changi Airport's February 2025 ISO/IEC 42001 AI Management System certification — the world's first for an airport — supplied a working precedent that AI governance can be externally audited.

IMDA CEO **Ng Cher Pong** (in post since November 2025), in his opening address, said: "Standards setting cannot move at a glacial pace" — or it risks being outpaced by AI itself. He also stressed that standards must be representative across sectors, cultures and languages, and that Southeast Asia — one of the world's most diverse regions — must be plugged into standards-making.

ISO standards typically take years from proposal to publication. But once a proposal is on the table, the framing for global discussion is set — which is precisely how Singapore translates 0.07% of the world's population into G7-tier AI governance influence.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA) / Enterprise Singapore',
        ministry: 'MDDI',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [5, 6],
        relatedTimelineYears: [2025, 2026],
        relatedPostSlugs: [],
      },
      {
        id: 'model-ai-governance-framework-for-agentic-ai',
        title: 'Agentic AI 治理框架',
        titleJa: 'Agentic AI ガバナンスフレームワーク',
        titleEn: 'Model AI Governance Framework for Agentic AI',
        date: '2026-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/new-model-ai-governance-framework-for-agentic-ai',
        translatedPdfUrl: '/pdfs/agentic-ai-governance-zh.pdf',
        summary: '针对自主 AI Agent 的治理框架，应对 AI 自主决策带来的新挑战。',
        summaryJa: '自律的 AI Agent に対するガバナンスフレームワーク。AI 自律決定による新たな課題に対応します。',
        content: `随着 Agentic AI（自主 AI 代理）快速发展，IMDA 于 2026 年 1 月发布专门的治理框架。聚焦 AI Agent 的自主决策边界、人类监督机制、责任归属、安全防护等核心议题。`,
        contentJa: `Agentic AI（自主型 AI エージェント）の急速な発展に伴い、IMDA は 2026 年 1 月に専門的なガバナンスフレームワークを発表しました。AI Agent の自律的な意思決定の境界、人的監督メカニズム、責任帰属、セキュリティ対策などの核心的な課題に焦点を当てています。`,
        summaryEn:
          'Dedicated governance framework for autonomous AI agents, addressing the new challenges posed by AI making independent decisions.',
        contentEn: `As Agentic AI (autonomous AI agents) takes off, IMDA released a dedicated governance framework in January 2026. It focuses on the core issues for AI agents: how far they can decide on their own, human oversight, accountability, and safety safeguards.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'proposed-model-ai-governance-framework-for-generative-ai',
        title: '生成式 AI 治理框架',
        titleJa: '生成 AI ガバナンスフレームワーク',
        titleEn: 'Proposed Model AI Governance Framework for Generative AI',
        date: '2024-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/gen-ai-and-digital-foss-ai-governance-playbook',
        translatedPdfUrl: '/pdfs/genai-governance-zh.pdf',
        summary: '专门针对生成式 AI 的治理框架提案，应对大模型带来的新挑战。',
        summaryJa:
          '生成 AI に特化したガバナンスフレームワークの提案。大規模言語モデルがもたらす新たな課題に対応します。',
        content: `全球较早的专门针对生成式 AI 的治理框架提案。九大维度：问责制、数据治理、可信开发与部署、事件报告、测试与保证、安全、内容来源、使用者素养、辅助措施。采用多利益相关方方法，强调"沙盒式"治理。`,
        contentJa: `生成型 AI を対象とした治理フレームワーク提案としては世界的に初期段階のものです。9 つの側面：説明責任、データガバナンス、信頼性の高い開発と展開、インシデント報告、テストと保証、セキュリティ、コンテンツソース、利用者リテラシー、支援措置。マルチステークホルダーアプローチを採用し、「サンドボックス型」ガバナンスを強調しています。`,
        summaryEn:
          'Dedicated governance framework proposal for generative AI, addressing the new challenges posed by large models.',
        contentEn: `One of the world's earliest dedicated governance frameworks proposed for generative AI. Nine dimensions: accountability, data governance, trusted development and deployment, incident reporting, testing and assurance, security, content provenance, user literacy, and supporting measures. The framework takes a multi-stakeholder approach and leans on sandbox-style governance.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'ai-verify',
        title: 'AI Verify 测试框架',
        titleJa: 'AI Verify テストフレームワーク',
        titleEn: 'AI Verify',
        date: '2022-05',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        translatedPdfUrl: '/pdfs/ai-verify-zh.pdf',
        summary: '全球首个 AI 治理测试框架和工具包，支持企业自测 AI 系统合规性。',
        summaryJa:
          'AI ガバナンステストフレームワークとツールキットの世界初。企業が AI システムのコンプライアンスを自己テストすることをサポートします。',
        content: `全球首个 AI 治理测试框架与工具包。11 项可测试指标，开源工具包，与国际标准对齐。2023 年成立 AI Verify Foundation 推动全球协作。将 AI 治理从"原则"推向"可操作"。`,
        contentJa: `世界初の AI ガバナンステストフレームワークとツールキットです。11 項目のテスト可能な指標、オープンソースツールキット、国際基準とのアライメント。2023 年に AI Verify Foundation を設立し、グローバルな協力を推進しています。AI ガバナンスを「原則」から「実行可能」へと進めています。`,
        summaryEn:
          "The world's first AI governance testing framework and toolkit, enabling enterprises to self-assess AI system compliance.",
        contentEn: `The world's first AI governance testing framework and toolkit. Eleven testable indicators, an open-source toolkit, and alignment with international standards. The AI Verify Foundation was established in 2023 to drive global collaboration. The framework moves AI governance from "principles" to "operational practice."`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'model-ai-governance-framework',
        title: 'AI 治理模型框架',
        titleJa: 'AI ガバナンスモデルフレームワーク',
        titleEn: 'Model AI Governance Framework',
        date: '2019-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl: 'https://www.pdpc.gov.sg/help-and-resources/2020/01/model-ai-governance-framework',
        pdfUrl:
          'https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/resource-for-organisation/ai/sgmodelaigovframework2.pdf',
        translatedPdfUrl: '/pdfs/ai-governance-model-zh.pdf',
        summary: '亚洲首个 AI 治理框架，提出可解释、透明、以人为本的 AI 治理原则。',
        summaryJa:
          'アジア初の AI ガバナンスフレームワーク。解釈可能性、透明性、人間中心の AI ガバナンス原則を提唱しています。',
        content: `2019 年在达沃斯发布，亚洲首个 AI 治理框架。四大核心原则：内部治理结构与措施、决策中的人类参与、运营管理、利益相关方互动与沟通。被 OECD 引用为最佳实践。`,
        contentJa: `2019 年にダボスで発表された、アジア初の AI ガバナンスフレームワークです。4 つの核心原則：内部ガバナンス構造と措置、意思決定における人的参加、運営管理、ステークホルダーの相互作用とコミュニケーション。OECD によってベストプラクティスとして引用されています。`,
        summaryEn:
          "Asia's first AI governance framework, articulating principles of explainability, transparency, and human-centric AI governance.",
        contentEn: `Released at Davos in 2019, this is Asia's first AI governance framework. Four core principles: internal governance structures, human involvement in AI-augmented decisions, operations management, and stakeholder communication. The OECD has cited it as a best practice.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'personal-data-protection-act-pdpa',
        title: '个人数据保护法',
        titleJa: '個人データ保護法',
        titleEn: 'Personal Data Protection Act (PDPA)',
        date: '2012',
        source: '个人数据保护委员会 (PDPC)',
        sourceJa: '個人データ保護委員会 (PDPC)',
        sourceOrgUrl: 'https://www.pdpc.gov.sg/',
        sourceUrl: 'https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act',
        translatedPdfUrl: '/pdfs/pdpa-zh.pdf',
        summary: '新加坡核心数据保护法律，2020 年修订加入 AI 相关条款。',
        summaryJa: 'シンガポールの中心的なデータ保護法。2020 年の改正では AI 関連条項が追加されました。',
        content: `核心数据保护法律，2012 年通过，2020 年重大修订。引入合法利益例外（Business Improvement Exception）、数据可携带权、加强执法力度。为 AI 数据使用划定法律边界。`,
        contentJa: `核心的なデータ保護法で、2012 年に可決、2020 年に重大改正されました。合法的利益例外（Business Improvement Exception）、データポータビリティ権、執行力の強化を導入しました。AI データ使用に対して法的な境界を設定しています。`,
        summaryEn: "Singapore's core data protection law, with AI-relevant provisions added in the 2020 amendments.",
        contentEn: `Singapore's core data protection law, enacted in 2012 and significantly amended in 2020. The amendments added a Business Improvement Exception, data portability rights, and stronger enforcement powers — setting the legal perimeter for AI data use.`,
        sourceEn: 'Personal Data Protection Commission (PDPC)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'project-mindforge-genai-risk-framework-for-financial-sector',
        title: 'MAS Project MindForge',
        titleEn: 'Project MindForge — GenAI Risk Framework for Financial Sector',
        date: '2024-06',
        source: '新加坡金融管理局 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/news/media-releases/2024/project-mindforge',
        summary: 'GenAI 在金融业的风险框架，24 家机构 + 四大云厂商（Microsoft / AWS / Google / NVIDIA）共建。',
        summaryJa:
          'GenAI の金融業界向けリスクフレームワーク。24 の機関とメジャー 4 クラウドプロバイダー（Microsoft / AWS / Google / NVIDIA）が共同構築。',
        content: `Project MindForge 是 MAS 主导的金融业 GenAI 风险框架，于 2024 年启动。Consortium 成员包括 24 家金融机构（DBS、UOB、OCBC、HSBC、JPMorgan 等）+ 四大云与 AI 厂商（Microsoft、AWS、Google、NVIDIA）+ 监管机构。框架围绕七大风险维度：模型幻觉、数据泄露、偏差与公平、供应链依赖、可解释性、对抗性攻击、责任分配。MindForge 的特殊之处在于让监管机构、被监管金融机构、技术供应商三方在同一桌上协调——这是新加坡 AI 治理"训练宽松 + 输出严管"哲学在金融业的具体落地，也是 FEAT → Veritas → MindForge → BuildFin.ai 五层堆栈中第三层。`,
        contentJa: `Project MindForge は MAS が主導する金融業界向けの GenAI リスク管理フレームワークで、2024 年に開始されました。コンソーシアムのメンバーには 24 の金融機関（DBS、UOB、OCBC、HSBC、JPMorgan など）+ 4 大クラウド・AI ベンダー（Microsoft、AWS、Google、NVIDIA）+ 規制当局が含まれています。フレームワークは 7 つのリスク側面を中心としています：モデルの幻覚、データ漏洩、バイアスと公平性、サプライチェーンへの依存、説明可能性、敵対的攻撃、責任分配。MindForge の特徴は、規制当局、規制対象の金融機関、技術ベンダーの 3 者が同じテーブルで調整を図ることです——これは、シンガポール AI ガバナンスの「トレーニング緩和 + 出力厳格管理」哲学が金融業界に具体的に落ちた形であり、また FEAT → Veritas → MindForge → BuildFin.ai 5 層スタックの第 3 層でもあります。`,
        summaryEn:
          'GenAI risk framework for the financial sector, co-developed by 24 institutions and four major cloud/AI providers (Microsoft / AWS / Google / NVIDIA).',
        contentEn: `Project MindForge is a MAS-led GenAI risk framework for the financial sector, launched in 2024. Consortium members include 24 financial institutions (DBS, UOB, OCBC, HSBC, JPMorgan, and others), the four major cloud and AI providers (Microsoft, AWS, Google, NVIDIA), and the regulator. The framework covers seven risk areas: model hallucination, data leakage, bias and fairness, supply-chain dependency, explainability, adversarial attacks, and accountability. What's unusual is putting regulators, regulated banks, and tech providers around one table — the financial-sector version of Singapore's "permissive training, strict output" stance, and the third layer in the FEAT → Veritas → MindForge → BuildFin.ai stack.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'ai-risk-management-guidelines-for-banks',
        title: 'MAS AI Risk Management Guidelines',
        titleEn: 'AI Risk Management Guidelines for Banks',
        date: '2024-12',
        source: '新加坡金融管理局 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/regulation/notices/notice-fsm-n29',
        summary: '金融业 AI 模型风险管理的监管期望书，正式约束银行使用 AI。',
        summaryJa: '金融業の AI モデルリスク管理に関する監督期待書。銀行の AI 使用を正式に拘束します。',
        content: `MAS 于 2024 年 12 月发布 AI Risk Management Guidelines，把 FEAT / Veritas / MindForge 多年累积的实践经验固化为正式监管期望书。覆盖：模型治理（数据、训练、验证、上线）、第三方 AI 风险（云厂商、模型供应商、API）、模型监控（漂移、偏差、性能）、人在回路、事件应对与责任。配套 BuildFin.ai 平台让被监管机构能持续测试和报告。这是全球首批专门针对银行业 AI 的监管文件，比欧盟 AI Act 金融条款落地更快。`,
        contentJa: `MAS は 2024 年 12 月に AI Risk Management Guidelines を発表し、FEAT / Veritas / MindForge が長年にわたって蓄積した実践経験を正式な規制期待書に固定化しました。対象は：モデルガバナンス（データ、トレーニング、検証、本番化）、第三者 AI リスク（クラウドベンダー、モデルサプライヤー、API）、モデル監視（ドリフト、バイアス、パフォーマンス）、ヒューマン・イン・ザ・ループ、インシデント対応と責任。附属の BuildFin.ai プラットフォームにより、規制対象機関は継続的にテストとレポートが可能になります。これは銀行業向け AI に関する世界初の専門的な規制文書で、EU AI Act の金融条項よりも実装が迅速です。`,
        summaryEn:
          'Supervisory expectations document for AI model risk management in the financial sector, formally constraining how banks use AI.',
        contentEn: `MAS released the AI Risk Management Guidelines in December 2024, codifying years of practical experience from FEAT, Veritas, and MindForge into formal supervisory expectations. Coverage includes: model governance (data, training, validation, deployment), third-party AI risk (cloud providers, model vendors, APIs), model monitoring (drift, bias, performance), human-in-the-loop, and incident response and accountability. The accompanying BuildFin.ai platform enables regulated institutions to test and report on a continuous basis. These are among the world's first dedicated supervisory documents for AI in banking, landing ahead of the EU AI Act's financial provisions.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '行业监管',
    nameJa: '産業規制',
    nameEn: 'Sector Regulation',
    icon: '🏢',
    policies: [
      {
        id: 'ai-in-healthcare-guidelines-aihgle',
        title: '医疗 AI 联合指南 (AIHGle)',
        titleJa: '医療 AI 共同ガイドライン (AIHGle)',
        titleEn: 'Artificial Intelligence in Healthcare Guidelines (AIHGle)',
        date: '2021-10',
        source: '卫生部 (MOH) / 卫生科学局 (HSA) / 国家医疗科技局 (Synapxe)',
        sourceJa: '保健省 (MOH) / 衛生科学庁 (HSA) / 国家医療技術局 (Synapxe)',
        sourceOrgUrl: 'https://www.moh.gov.sg/',
        sourceUrl:
          'https://www.moh.gov.sg/news-highlights/details/release-of-the-artificial-intelligence-in-healthcare-guidelines-(aihgle)',
        summary: '面向医院、医生与 AI 开发者的医疗 AI 安全使用与良好实践指南。',
        summaryJa: '病院、医師、AI 開発者向けの医療 AI の安全な使用とベストプラクティスガイドライン。',
        content: `Artificial Intelligence in Healthcare Guidelines (AIHGle) 于 2021 年 10 月由卫生部 (MOH)、卫生科学局 (HSA) 与当时的 Integrated Health Information Systems (IHiS，2023 年改组为 Synapxe) 联合发布，是新加坡医疗 AI 的核心非约束性指南。两个目标：一是支持安全有效的医疗 AI 部署，二是补充 HSA 对 AI-Medical Devices (AI-MD) 的硬性监管要求。覆盖 AI 开发者与医疗机构两侧的全生命周期：开发阶段的临床有效性证据要求、部署阶段的临床工作流融入与人在回路、上线后的持续监控与不良事件报告、患者沟通与知情同意。AIHGle 与 HSA 基于 Health Products Act 的医疗器械注册要求形成"软指南 + 硬法"双层结构，是 ACE-AI、Synapxe AI 平台等国家级医疗 AI 项目的合规底座。`,
        contentJa: `Artificial Intelligence in Healthcare Guidelines (AIHGle) は 2021 年 10 月に保健省 (MOH)、保健科学庁 (HSA)、および当時の Integrated Health Information Systems (IHiS、2023 年に Synapxe に改組) により共同発表された、シンガポール医療 AI の中核的な非拘束的ガイドラインです。2 つの目標があります。1 つは、安全で効果的な医療 AI の展開をサポートすることであり、もう 1 つは AI-Medical Devices (AI-MD) に関する HSA の強制的な規制要件を補完することです。AI 開発者と医療機構の両側にわたるライフサイクル全体をカバーしています。開発段階での臨床有効性エビデンス要件、展開段階での臨床ワークフロー統合と人間のループ、上線後の継続的な監視と有害事象報告、患者とのコミュニケーションとインフォームドコンセントです。AIHGle と HSA は Health Products Act の医療機器登録要件に基づいて「ソフトガイドライン + ハードロー」二層構造を形成しており、ACE-AI、Synapxe AI プラットフォームなどの国家的医療 AI プロジェクトのコンプライアンス基礎となっています。`,
        summaryEn:
          'Joint guidelines on the safe use and good practice of AI in healthcare for hospitals, clinicians, and AI developers.',
        contentEn: `The Artificial Intelligence in Healthcare Guidelines (AIHGle) were jointly released in October 2021 by the Ministry of Health (MOH), the Health Sciences Authority (HSA), and the then Integrated Health Information Systems (IHiS, reorganised as Synapxe in 2023). They are Singapore's core non-binding guidance on healthcare AI. Two objectives: support the safe and effective deployment of AI in healthcare, and complement HSA's binding regulation of AI-Medical Devices (AI-MD). The guidelines cover the full lifecycle on both the developer and healthcare-institution sides: evidence of clinical validity at the development stage, integration into clinical workflows and human-in-the-loop at deployment, post-market monitoring and adverse event reporting, and patient communication and informed consent. Together with HSA's medical-device registration requirements under the Health Products Act, AIHGle creates a "soft guidance + hard law" two-layer structure — the compliance baseline beneath national healthcare-AI initiatives like ACE-AI and Synapxe's AI platforms.`,
        sourceEn: 'Ministry of Health (MOH) / Health Sciences Authority (HSA) / Synapxe',
        ministry: 'MOH',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'health-products-act-ai-medical-devices',
        title: 'Health Products Act — AI 医疗器械注册',
        titleJa: 'Health Products Act — AI 医療機器登録',
        titleEn: 'Health Products Act — AI-Medical Device (AI-MD) Regulation',
        date: '2007',
        source: '卫生科学局 (HSA)',
        sourceJa: '衛生科学庁 (HSA)',
        sourceOrgUrl: 'https://www.hsa.gov.sg/',
        sourceUrl: 'https://www.hsa.gov.sg/medical-devices/regulatory-overview',
        summary: '含 AI 的医疗器械须在 HSA 注册——硬法层面的医疗 AI 准入门槛。',
        summaryJa: 'AI を含む医療機器は HSA に登録する必要があります。法律レベルでの医療 AI 参入障壁。',
        content: `Health Products Act 2007 是新加坡医疗器械的核心法律，由卫生科学局 (HSA) 执行。含 AI 组件的医疗设备（AI-Medical Device, AI-MD）——无论是独立软件 (Software as a Medical Device, SaMD) 还是嵌入设备的算法——必须按风险等级在 HSA 注册后方可在新加坡上市或临床使用。配套监管文件：Regulatory Guidelines for Software Medical Devices（2022 修订）专章覆盖 AI-MD 的训练数据质量、模型变更管理 (Change Control Plan)、持续学习系统 (Continuous Learning) 的特殊要求、临床证据等级、网络安全和数据保护。AI-MD 还须遵循 Good Machine Learning Practice (GMLP) 原则，与 FDA 和 Health Canada 的多边协调框架一致。这一条是 W&C tracker 单列的两条 AI 相关存量立法之一——它说明新加坡"没有专门 AI 法"的真实含义：用既有行业法的现代化修订把 AI 纳入硬法监管，而不是另立一部横切法。`,
        contentJa: `Health Products Act 2007 はシンガポール医療機器の中核法律であり、保健科学庁 (HSA) により執行されています。AI コンポーネントを含む医療機器 (AI-Medical Device, AI-MD)——独立したソフトウェア (Software as a Medical Device, SaMD) であろうと、デバイスに組み込まれたアルゴリズムであろうと——は、リスクレベルに応じて HSA に登録した後でなければシンガポールで上市または臨床使用はできません。付属する規制文書：Regulatory Guidelines for Software Medical Devices (2022 改正版) は AI-MD の訓練データ品質、モデル変更管理 (Change Control Plan)、継続的学習システム (Continuous Learning) の特別要件、臨床エビデンスレベル、サイバーセキュリティおよびデータ保護をカバーしています。AI-MD はまた Good Machine Learning Practice (GMLP) 原則に従う必要があり、FDA および Health Canada の多国間協調枠組みと一致しています。この条項は W&C tracker により単独でリストアップされた 2 つの AI 関連既存法のうち 1 つです——それはシンガポール「専門 AI 法がない」の真実の意味を説明しています。既存の産業法の現代化改正により AI を硬法規制に含める方法であり、別個の横断法を制定することではありません。`,
        summaryEn:
          'AI-containing medical devices must be registered with HSA — the hard-law gate for healthcare AI market access.',
        contentEn: `The Health Products Act 2007 is Singapore's core law for medical devices, administered by the Health Sciences Authority (HSA). Medical devices containing AI components (AI-Medical Devices, AI-MD) — whether standalone Software as a Medical Device (SaMD) or algorithms embedded in hardware — must be registered with HSA according to risk class before they can be marketed or used clinically in Singapore. Supporting regulation includes the Regulatory Guidelines for Software Medical Devices (revised 2022), which contains a dedicated section on AI-MD covering training data quality, change-control plans for model updates, the special requirements for continuous-learning systems, levels of clinical evidence, cybersecurity, and data protection. AI-MDs are also expected to follow Good Machine Learning Practice (GMLP) principles, aligned with the multilateral framework agreed with the US FDA and Health Canada. This is one of the two pieces of pre-existing legislation that the W&C tracker singles out as AI-relevant — a concrete illustration of what "Singapore has no dedicated AI law" actually means: AI is brought into hard-law regulation through modernised sector statutes, not through a horizontal AI act.`,
        sourceEn: 'Health Sciences Authority (HSA)',
        ministry: 'MOH',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'road-traffic-act-autonomous-vehicles',
        title: 'Road Traffic Act — 自动驾驶授权',
        titleJa: 'Road Traffic Act — 自動運転の許可',
        titleEn: 'Road Traffic Act — Autonomous Vehicle Trials and Use',
        date: '2017-03',
        source: '陆路交通管理局 (LTA) / 交通部 (MOT)',
        sourceJa: '陸路交通管理庁 (LTA) / 交通部 (MOT)',
        sourceOrgUrl: 'https://www.lta.gov.sg/',
        sourceUrl: 'https://sso.agc.gov.sg/Act/RTA1961?ProvIds=P1A6C-#pr6C-',
        summary: '2017 修订引入第 6C 节，授权 LTA 监管自动驾驶车辆测试与使用。',
        summaryJa: '2017 年の改正で第 6C 条を導入。自動運転車の試験と使用を監視する LTA の権限を付与します。',
        content: `Road Traffic Act 1961 通过 2017 年的 Road Traffic (Amendment) Act 增设第 6C 节（Trials and use of autonomous motor vehicles），把自动驾驶 (AV) 写入硬法。核心条款：陆路交通管理局 (LTA) 获授权制定细则、签发 AV 测试与运营许可、设定保险与安全要求、在划定区域 (designated area) 进行豁免。配套是 2017 年颁布的 Road Traffic (Autonomous Motor Vehicles) Rules，覆盖：测试申请与审批、安全员要求、数据记录与事件报告（黑匣子）、与 LTA 的持续报告义务、最低保险额度。新加坡同步建立了 CETRAN (Centre of Excellence for Testing and Research of AVs) 测试中心和 one-north 自动驾驶试验区，把法律授权落到物理基础设施。这条与 Health Products Act 共同构成 W&C tracker 单列的"用既有行业法管 AI"的两个核心样本——也是 NAIS 1.0 五大重点领域之一"智能交通与物流"的法律基座。`,
        contentJa: `Road Traffic Act 1961 は 2017 年の Road Traffic (Amendment) Act を通じて第 6C 条（Trials and use of autonomous motor vehicles）を追加することで、自動運転 (AV) を硬法に組み込みました。中核条款：陸路交通管理局 (LTA) は、細則の策定、AV テストと運営許可の発行、保険と安全要件の設定、指定地域 (designated area) での豁免を行う権限を付与されています。付属する 2017 年に公布された Road Traffic (Autonomous Motor Vehicles) Rules は以下をカバーしています。テスト申請と承認、安全員要件、データ記録と事件報告 (ブラックボックス)、LTA との継続的な報告義務、最低保険額。シンガポールは同時に CETRAN (Centre of Excellence for Testing and Research of AVs) テストセンターと one-north 自動運転試験区を設立し、法的認可を物理的インフラに落とし込みました。この条項は Health Products Act と共に、W&C tracker が単独でリストアップした「既存産業法で AI を管理する」という 2 つのコアサンプルを構成しており、NAIS 1.0 の 5 大重点領域の 1 つ「インテリジェント交通とロジスティクス」の法的基礎でもあります。`,
        summaryEn:
          'A 2017 amendment introduced Section 6C, empowering LTA to regulate autonomous vehicle trials and use.',
        contentEn: `The Road Traffic Act 1961 was amended in 2017 (Road Traffic (Amendment) Act 2017) to insert Section 6C — "Trials and use of autonomous motor vehicles" — bringing AVs into hard law. Core provisions: the Land Transport Authority (LTA) is empowered to make subsidiary regulations, issue trial and operational permits for AVs, set insurance and safety requirements, and grant exemptions within designated areas. The accompanying Road Traffic (Autonomous Motor Vehicles) Rules 2017 cover trial applications and approvals, safety driver requirements, data logging and incident reporting (black-box), ongoing reporting obligations to LTA, and minimum insurance thresholds. In parallel, Singapore established CETRAN (Centre of Excellence for Testing and Research of Autonomous Vehicles) and the one-north AV trial zone, anchoring the legal authorisation in physical infrastructure. Together with the Health Products Act, this is one of the two core examples that the W&C tracker singles out for "regulating AI through existing sector statutes" — and the legal foundation for "intelligent transport and logistics," one of the five priority sectors of NAIS 1.0.`,
        sourceEn: 'Land Transport Authority (LTA) / Ministry of Transport (MOT)',
        ministry: 'MOT',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'guidelines-on-securing-ai-systems',
        title: 'CSA AI 系统安全指南',
        titleJa: 'CSA AI システムセキュリティガイドライン',
        titleEn: 'Guidelines on Securing AI Systems',
        date: '2024-10',
        source: '网络安全局 (CSA)',
        sourceJa: 'サイバーセキュリティ庁 (CSA)',
        sourceOrgUrl: 'https://www.csa.gov.sg/',
        sourceUrl:
          'https://www.csa.gov.sg/resources/publications/guidelines-and-companion-guide-on-securing-ai-systems/',
        translatedPdfUrl: '/pdfs/csa-ai-security-zh.pdf',
        summary: 'AI 系统全生命周期安全最佳实践指南。',
        summaryJa: 'AI システムの全ライフサイクル・セキュリティに関するベストプラクティスガイドライン。',
        content: `CSA 于 2024 年 10 月发布 AI 系统安全指南及配套实践手册，填补了 AI 安全领域的治理空白。指南覆盖 AI 系统全生命周期：规划与设计阶段的威胁建模、开发阶段的数据与模型安全、部署阶段的安全测试、运维阶段的监控与事件响应。重点关注对抗性攻击防御、数据投毒防范、模型窃取防护、供应链安全等 AI 特有风险。`,
        contentJa: `CSA は 2024 年 10 月に AI システムセキュリティガイドラインおよび実装ハンドブックを発表し、AI セキュリティ領域のガバナンスギャップを埋めました。ガイドラインは AI システムの完全なライフサイクルをカバーしています。計画と設計段階での脅威モデリング、開発段階でのデータとモデルのセキュリティ、展開段階でのセキュリティテスト、運用段階での監視とインシデント対応です。主要な焦点は、敵対的攻撃防御、データポイズニング防止、モデル盗難保護、サプライチェーンセキュリティなど AI 固有のリスクです。`,
        summaryEn: 'Best-practice guidelines for end-to-end security across the AI system lifecycle.',
        contentEn: `In October 2024, CSA released the Guidelines on Securing AI Systems together with a companion practice handbook, filling a governance gap in the AI security space. The guidelines cover the full AI system lifecycle: threat modelling at the planning and design stage, data and model security during development, security testing at deployment, and monitoring and incident response in operations. They focus on AI-specific risks including adversarial attack defence, data poisoning prevention, model theft protection, and supply chain security.`,
        sourceEn: 'Cyber Security Agency (CSA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'guide-on-use-of-generative-ai-tools-by-court-users',
        title: '法院生成式 AI 使用指南',
        titleJa: '裁判所での生成 AI 使用ガイドライン',
        titleEn: 'Guide on Use of Generative AI Tools by Court Users',
        date: '2024-10',
        source: '新加坡最高法院 (Supreme Court)',
        sourceJa: 'シンガポール最高裁判所 (Supreme Court)',
        sourceOrgUrl: 'https://www.judiciary.gov.sg/',
        sourceUrl: 'https://www.judiciary.gov.sg/news-and-resources/news',
        pdfUrl:
          'https://www.judiciary.gov.sg/docs/default-source/news-and-resources-docs/guide-on-the-use-of-generative-ai-tools-by-court-users.pdf',
        translatedPdfUrl: '/pdfs/court-genai-guide-zh.pdf',
        summary: '法律诉讼中使用生成式 AI 工具的原则和指引。',
        summaryJa: '法的訴訟における生成 AI ツール使用の原則と指導。',
        content: `新加坡最高法院于 2024 年发布生成式 AI 使用指南（Registrar's Circular No. 1 of 2024），适用于所有法院体系。核心原则：律师和当事人对提交法院的所有内容负最终责任，无论是否使用 AI 生成；使用 GenAI 辅助准备的法律文件须披露 AI 使用情况；引用的案例和法律条文须经人工核实。体现了司法系统对 AI 工具的务实态度——不禁止使用，但强调人类责任不可转移。`,
        contentJa: `シンガポール最高裁判所は 2024 年に生成型 AI 使用ガイドライン（Registrar's Circular No. 1 of 2024）を発表し、すべての司法制度に適用されます。中核原則：弁護士と当事者は、AI が生成したかどうかに関係なく、法院に提出されたすべての内容について最終責任を負います。GenAI の支援を受けて準備された法律文書は AI の使用状況を開示する必要があります。引用されたケースと法的条文は人間による検証が必要です。司法制度が AI ツールに対して実用的なアプローチをとっていることを反映しています——使用を禁止するのではなく、人間の責任は譲渡できないことを強調しています。`,
        summaryEn: 'Principles and guidance on the use of generative AI tools in legal proceedings.',
        contentEn: `In 2024, the Supreme Court of Singapore issued the Guide on the Use of Generative AI Tools by Court Users (Registrar's Circular No. 1 of 2024), applicable across the entire court system. Core principles: lawyers and parties bear ultimate responsibility for all materials submitted to court, regardless of whether AI was used to generate them; legal documents prepared with GenAI assistance must disclose the AI use; cited cases and statutory provisions must be verified by a human. The guide reflects the judiciary's pragmatic stance on AI tools — not banning their use, but making clear that human responsibility cannot be transferred.`,
        sourceEn: 'Supreme Court of Singapore',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'veritas-initiative',
        title: 'MAS Veritas 倡议',
        titleJa: 'MAS Veritas イニシアティブ',
        titleEn: 'Veritas Initiative',
        date: '2021',
        source: '新加坡金融管理局 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/schemes-and-initiatives/veritas',
        translatedPdfUrl: '/pdfs/mas-veritas-zh.pdf',
        summary: '将 FEAT 原则转化为可操作的评估工具包，提供开源方法论。',
        summaryJa: 'FEAT 原則を実装可能な評価ツールキットに転換。オープンソース方法論を提供します。',
        content: `Veritas 倡议是 FEAT 原则的实践延伸，由 MAS 联合金融机构共同开发。项目目标是创建一套开源、可操作的评估方法论和工具包，帮助金融机构将 FEAT 原则落地到具体 AI 应用中。涵盖客户营销公平性评估、信用风险评分透明度评估等场景。Veritas 持续更新迭代，体现新加坡"原则→工具→实践"的渐进式 AI 治理路径。`,
        contentJa: `Veritas イニシアティブは FEAT 原則の実践的拡張であり、MAS と金融機関の共同開発です。プロジェクトの目標は、金融機関が FEAT 原則を具体的な AI アプリケーションに落とし込むのを支援するオープンソースで実行可能な評価方法論とツールキットを作成することです。顧客マーケティングの公平性評価、信用リスクスコアリングの透明性評価などのシナリオをカバーしています。Veritas は継続的に更新と反復を行っており、シンガポールの「原則→ツール→実践」段階的 AI ガバナンスパスを体現しています。`,
        summaryEn:
          'Translates the FEAT principles into an operational assessment toolkit, with an open-source methodology.',
        contentEn: `The Veritas initiative is the practical extension of the FEAT principles, jointly developed by MAS and partner financial institutions. The project's goal is to build an open-source, operational assessment methodology and toolkit that helps financial institutions translate FEAT principles into concrete AI applications. Use cases covered include fairness assessments for customer marketing and transparency assessments for credit risk scoring. Veritas is iterated continuously, embodying Singapore's incremental "principles → tools → practice" AI governance path.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'pdpc-advisory-guidelines-on-use-of-personal-data-in-ai',
        title: 'PDPC 个人数据 AI 使用咨询指南',
        titleJa: 'PDPC 個人データ AI 使用に関する諮問ガイドライン',
        titleEn: 'Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems',
        date: '2024-03',
        source: '个人数据保护委员会 (PDPC)',
        sourceJa: '個人データ保護委員会 (PDPC)',
        sourceOrgUrl: 'https://www.pdpc.gov.sg/',
        sourceUrl:
          'https://www.pdpc.gov.sg/guidelines-and-consultation/2024/02/advisory-guidelines-on-use-of-personal-data-in-ai-recommendation-and-decision-systems',
        summary: 'PDPC 明确 PDPA 在 AI 推荐与决策系统中的合规边界——为企业用个人数据训练和运行 AI 提供确定性。',
        summaryJa:
          'PDPC は AI レコメンデーション・システムと意思決定システムにおける PDPA コンプライアンスの境界を明確にしています。企業が個人データを使用して AI をトレーニングおよび運用する際の確実性を提供します。',
        content: `PDPC 于 2024 年 3 月发布《Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems》，把 PDPA 在 AI 场景下的具体适用方式讲清楚。覆盖三类常见情形：(1) 用个人数据训练、测试、监控 AI 模型——可援引 Business Improvement Exception 或 Research Exception，但需通过合理性测试、数据最小化、去标识化等门槛；(2) 用 AI 进行推荐或决策——须履行通知和同意义务，决策类应用须告知数据主体；(3) 数据保护影响评估（DPIA）的最佳实践模板。这是 PDPC 把 PDPA 2020 修订（合法利益例外、Business Improvement Exception）转化为 AI 落地操作手册的关键文件，与 Copyright Act §244 共同构成新加坡 AI 训练侧"双重法律基础"。`,
        contentJa: `PDPC は 2024 年 3 月に「Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems」を発表し、AI シナリオにおける PDPA の具体的な適用方法を明確にしました。3 つの一般的なシナリオをカバーしています。(1) 個人データを使用して AI モデルを訓練、テスト、監視する——Business Improvement Exception または Research Exception を引用することができますが、合理性テスト、データ最小化、匿名化などのしきい値を通じる必要があります。(2) AI を使用して推奨または決定を行う——通知と同意の義務を履行する必要があり、決定タイプのアプリケーションはデータサブジェクトに通知する必要があります。(3) データ保護影響評価 (DPIA) のベストプラクティステンプレート。これは PDPC が PDPA 2020 改正（正当な利益の例外、Business Improvement Exception）を AI の実装運用ハンドブックに変換することの重要な文書であり、Copyright Act §244 と共に、シンガポール AI トレーニング側の「二重法的基礎」を構成しています。`,
        summaryEn:
          'PDPC clarifies how PDPA applies to AI recommendation and decision systems — giving organisations certainty when using personal data to train and run AI.',
        contentEn: `In March 2024, PDPC issued the Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems, spelling out how the PDPA applies in concrete AI scenarios. The guidelines cover three common situations: (1) using personal data to train, test, and monitor AI models — which can rely on the Business Improvement Exception or Research Exception, subject to reasonableness, data minimisation, and de-identification thresholds; (2) using AI for recommendations or decision-making — which triggers notification and consent obligations, and where decision-making applications must inform data subjects; (3) best-practice templates for Data Protection Impact Assessments (DPIA). This is the key document by which PDPC translates the 2020 PDPA amendments (legitimate interests, Business Improvement Exception) into an operational handbook for AI deployment, forming — together with Section 244 of the Copyright Act — Singapore's dual legal foundation on the training side.`,
        sourceEn: 'Personal Data Protection Commission (PDPC)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'fairness-ethics-accountability-transparency-feat-principles',
        title: 'MAS FEAT 原则',
        titleJa: 'MAS FEAT 原則',
        titleEn: 'Fairness, Ethics, Accountability, Transparency (FEAT) Principles',
        date: '2018',
        source: '新加坡金融管理局 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/publications/monographs-or-information-paper/2018/FEAT',
        translatedPdfUrl: '/pdfs/mas-feat-zh.pdf',
        summary: '金融业 AI 使用的公平性、伦理、问责和透明度原则。',
        summaryJa: '金融業における AI 使用の公平性、倫理、アカウンタビリティ、透明性原則。',
        content: `MAS 于 2018 年发布 FEAT 原则，为金融机构使用 AI 和数据分析提供治理指引。四大原则：公平性（Fairness）——确保 AI 决策不产生歧视；伦理（Ethics）——AI 使用符合道德标准；问责（Accountability）——明确 AI 决策的责任归属；透明度（Transparency）——AI 决策过程可理解、可解释。2022 年更新版纳入更多实践指导。`,
        contentJa: `MAS は 2018 年に FEAT 原則を発表し、金融機関による AI とデータ分析の使用についてのガバナンスガイダンスを提供しました。4 つの主要原則：公平性（Fairness）——AI 決定が差別を生じないことを確保します。倫理（Ethics）——AI の使用は道徳的基準に準拠しています。説明責任（Accountability）——AI 決定の責任を明確にします。透明性（Transparency）——AI 決定プロセスは理解でき、説明可能です。2022 年の更新版は、より多くの実装ガイダンスを組み込んでいます。`,
        summaryEn: 'Fairness, Ethics, Accountability, and Transparency principles for AI use in the financial sector.',
        contentEn: `MAS issued the FEAT principles in 2018 to provide governance guidance for financial institutions using AI and data analytics. Four principles: Fairness — ensuring AI decisions do not produce discrimination; Ethics — AI use aligns with ethical standards; Accountability — clear assignment of responsibility for AI decisions; Transparency — AI decision processes are understandable and explainable. The 2022 update incorporated additional practical guidance.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'copyright-act-2021-section-244-computational-data-analysis-exception',
        title: 'Copyright Act §244 — AI 训练例外',
        titleJa: 'Copyright Act §244 — AI トレーニング例外',
        titleEn: 'Copyright Act 2021 — Section 244 (Computational Data Analysis Exception)',
        date: '2021-11',
        source: '律政部 (MINLAW) / IPOS',
        sourceJa: '法務・知的財産権省 (MINLAW) / IPOS',
        sourceOrgUrl: 'https://www.mlaw.gov.sg/',
        sourceUrl: 'https://sso.agc.gov.sg/Act/CA2021?ProvIds=P14-#pr244-',
        summary: 'AI 训练免责条款——与日本并列全球最宽松的 AI 训练版权立场。',
        summaryJa: 'AI トレーニングの免責条項。日本と並んで世界で最も寛容な AI トレーニング著作権スタンス。',
        content: `Copyright Act 2021 第 244 条 "Computational Data Analysis" 给 AI 训练数据使用提供明确的免责条款：合法获取的内容（不论是否有版权）可用于 AI 模型训练、文本与数据挖掘等"计算分析"用途，不构成版权侵权。这与日本《著作权法》第 30-4 条并列为全球最宽松的 AI 训练版权立场——美国仍在 fair use 案例法争议中、欧盟需依赖 Text and Data Mining Exception 的 opt-out 机制。配合 IPOS 的 "When Code Creates" 报告（2024）和"训练宽松 + 输出严管"哲学（OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套），新加坡为 AI 公司提供了**全球最清晰的法律边界之一**——这是 EDB 能引进 OpenAI / Anthropic / DeepMind 等机构的关键背景之一。`,
        contentJa: `Copyright Act 2021 の第 244 条「Computational Data Analysis」は AI トレーニングデータの使用に明確な免責条項を提供します。合法的に取得されたコンテンツ（著作権の有無を問わず）を AI モデル訓練、テキストおよびデータマイニングなどの「計算分析」の目的で使用することができ、著作権侵害を構成しません。これは日本の『著作権法』第 30-4 条と並んで、世界で最も寛容な AI トレーニング著作権スタンスの 1 つです——米国は依然として fair use 判例法をめぐる論争の中にあり、欧盟は Text and Data Mining Exception の opt-out メカニズムに依存する必要があります。IPOS の「When Code Creates」レポート (2024) および「トレーニング寛容 + 出力厳管」哲学 (OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill の 4 点セット) を組み合わせて、シンガポールは AI 企業に**世界でも最も明確な法的境界の 1 つ**を提供しています——これは EDB が OpenAI / Anthropic / DeepMind などの機関を引き込むことができた主要な背景の 1 つです。`,
        summaryEn:
          'AI-training safe harbour — alongside Japan, the most permissive copyright stance on AI training in the world.',
        contentEn: `Section 244 of the Copyright Act 2021, "Computational Data Analysis," provides an explicit safe harbour for AI training data use: lawfully accessed content (whether or not copyrighted) may be used for AI model training, text and data mining, and other "computational analysis" purposes without constituting copyright infringement. Together with Article 30-4 of Japan's Copyright Act, this is the world's most permissive copyright stance on AI training — the US is still navigating fair use case law, while the EU relies on the opt-out mechanism in its Text and Data Mining Exception. Combined with IPOS's "When Code Creates" report (2024) and the "permissive training + strict output" philosophy (the OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill quartet), Singapore offers AI companies **one of the clearest legal perimeters in the world** — a key part of the backdrop that lets EDB attract institutions like OpenAI, Anthropic, and DeepMind.`,
        sourceEn: 'Ministry of Law (MINLAW) / IPOS',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '预算与资金',
    nameJa: '予算と資金',
    nameEn: 'Budget & Funding',
    icon: '💰',
    policies: [
      {
        id: 'budget-2026-national-ai-acceleration',
        title: '2026 财政预算案 — 国家 AI 全面推进',
        titleJa: '2026 年度財政予算案 — 国家 AI 全面推進',
        titleEn: 'Budget 2026 — National AI Acceleration',
        date: '2026-02',
        source: '财政部 (MOF)',
        sourceJa: '財務省 (MOF)',
        sourceOrgUrl: 'https://www.mof.gov.sg/',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
        translatedPdfUrl: '/pdfs/budget-2026-zh.pdf',
        summary: '成立国家 AI 委员会、AI 税收减免、one-north AI 园区、AI Mission 计划。',
        summaryJa: '国家 AI 委員会の設立、AI 租税控除、one-north AI パーク、AI Mission 計画。',
        content: `2026 年预算案将 AI 推进提升到前所未有的高度。核心举措：成立由总理亲自主持的 National AI Council；Enterprise Innovation Scheme 的 400% 税务扣除扩展至 AI 相关支出；启动 one-north AI 园区建设；推出 AI Mission 计划聚焦关键领域应用；设立 National AI Literacy Programme 提升全民 AI 素养。这是新加坡 AI 政策从战略到全面执行的标志性预算。`,
        contentJa: `2026 年度予算案は AI 推進を前例のない高さへ引き上げます。中核的措置：総理が直接議長を務める National AI Council の設立；Enterprise Innovation Scheme の 400% 税務控除を AI 関連支出に拡大；one-north AI パーク建設の開始；重要領域のアプリケーションに焦点を当てた AI Mission プログラムの開始；全国的な AI リテラシーを向上させるための National AI Literacy Programme の設立。これはシンガポール AI 政策が戦略から完全な実行へのマイルストーン予算です。`,
        summaryEn:
          'Establishment of the National AI Council, AI tax incentives, the one-north AI district, and the AI Mission programme.',
        contentEn: `Budget 2026 elevates AI to an unprecedented level of priority. Core measures: a National AI Council chaired by the Prime Minister; the Enterprise Innovation Scheme's 400% tax deduction extended to AI spending; construction of the one-north AI district; the AI Mission programme focused on critical-sector applications; and a National AI Literacy Programme. This is the budget that takes Singapore's AI policy from strategy to full-scale execution.`,
        sourceEn: 'Ministry of Finance (MOF)',
        ministry: 'MOF',
        authorPersonIds: ['lawrence-wong'],
        relatedDebateIds: ['cos-mddi-2026', 'cos-mti-2026'],
        relatedLeverNumbers: [1, 3, 4],
        relatedTimelineYears: [2026],
        relatedPostSlugs: ['singapore-ai-native-companies-vs-nations'],
      },
      {
        id: 'moh-committee-of-supply-2026-healthcare-ai-medisave-reform',
        title: '2026 卫生部供给委员会 — 医疗AI与健保改革',
        titleJa: '2026 年度保健省提供委員会 — 医療 AI と健康保険改革',
        titleEn: 'MOH Committee of Supply 2026 — Healthcare AI & MediSave Reform',
        date: '2026-03',
        source: '卫生部 (MOH)',
        sourceJa: '保健省 (MOH)',
        sourceOrgUrl: 'https://www.moh.gov.sg/',
        sourceUrl:
          'https://www.straitstimes.com/singapore/politics/ai-genetic-screening-and-flexible-financing-to-bolster-preventive-medicine-for-super-aged-spore-ong',
        summary: 'ACE-AI 预测工具部署、BRCA1/2 基因检测补贴、MediShield Life 覆盖预防性手术、MediSave 限额提升。',
        summaryJa:
          'ACE-AI 予測ツール導入、BRCA1/2 遺伝子検査補助、MediShield Life の予防手術カバレッジ、MediSave 上限引き上げ。',
        content: `2026 年 3 月卫生部供给委员会辩论，卫生部长王乙康宣布新加坡正式成为超老龄社会（65 岁以上人口超 21%）。核心措施：一、ACE-AI 预测工具（由国家医疗科技局 Synapxe 开发），预测 3 年内糖尿病及高脂血症风险，>75% 风险者由 3 年一检提升至每年检查，2027 年初推广至所有约 1,100 家 Healthier SG 诊所，坚持"AI 增强而非 AI 决定"原则，临床医生保持在决策回路中；二、BRCA1/2 基因检测从 2026 年 12 月起获最高 70% 补贴，每年 2,000+ 人符合条件；三、MediShield Life 扩展覆盖预防性乳房切除术（Q3 2026）及风险降低型输卵管卵巢切除术（Q4 2026）；四、MediSave 慢性病与预防护理限额从 500/700 提至 700/1000（2027 年 1 月起），惠及 91 万+ 患者。`,
        contentJa: `2026 年 3 月の保健省予算委員会辩論で、保健大臣王乙康はシンガポールが正式に超高齢化社会（65 歳以上の人口が 21% を超える）になったことを宣言しました。中核的措置：1 つ、ACE-AI 予測ツール（国家医療技術局 Synapxe により開発）は 3 年以内の糖尿病および高脂血症リスクを予測し、75% 以上のリスク者は 3 年ごと検査から毎年検査へアップグレードされ、2027 年初期にすべての約 1,100 の Healthier SG クリニックに推進される予定で、「AI 強化ではなく AI 決定」原則を堅持し、臨床医師は意思決定ループに留まります。2つ、BRCA1/2 遺伝子検査は 2026 年 12 月から最高 70% の補助金を受け、毎年 2,000 人以上が対象になります。3つ、MediShield Life は予防的乳房切除手術 (Q3 2026) およびリスク低減型卵管卵巣切除術 (Q4 2026) のカバレッジを拡大します。4つ、MediSave の慢性疾患と予防ケア限度額は 500/700 から 700/1000 へ引き上げられます (2027 年 1 月から)、91 万人以上の患者に利益をもたらします。`,
        summaryEn:
          'Deployment of the ACE-AI prediction tool, BRCA1/2 genetic testing subsidies, MediShield Life coverage for preventive surgery, and increased MediSave limits.',
        contentEn: `In the March 2026 Committee of Supply debate, Minister for Health Ong Ye Kung announced that Singapore has formally become a super-aged society (population aged 65+ exceeds 21%). Core measures: (1) ACE-AI, a prediction tool developed by national health tech agency Synapxe, forecasts 3-year risk of diabetes and hyperlipidaemia. Patients with >75% risk move from triennial to annual screening, with rollout in early 2027 to all roughly 1,100 Healthier SG clinics, following the principle of "AI augmentation, not AI decision-making" with clinicians remaining in the loop. (2) BRCA1/2 genetic testing receives subsidies of up to 70% from December 2026, with 2,000+ eligible people each year. (3) MediShield Life coverage expands to include preventive mastectomy (Q3 2026) and risk-reducing salpingo-oophorectomy (Q4 2026). (4) MediSave chronic and preventive care limits rise from 500/700 to 700/1000 (effective January 2027), benefiting 910,000+ patients.`,
        sourceEn: 'Ministry of Health (MOH)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'budget-2025-ai-related-measures',
        title: '2025 财政预算案 — AI 相关措施',
        titleJa: '2025 年度財政予算案 — AI 関連措置',
        titleEn: 'Budget 2025 — AI-related Measures',
        date: '2025-02',
        source: '财政部 (MOF)',
        sourceJa: '財務省 (MOF)',
        sourceOrgUrl: 'https://www.mof.gov.sg/',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
        translatedPdfUrl: '/pdfs/budget-2025-zh.pdf',
        summary: '黄循财首份预算案，释放大规模 AI 投入信号。',
        summaryJa: 'Lawrence Wong 首相による初代予算案。大規模 AI 投資の信号を発表。',
        content: `2025 年预算案是黄循财出任总理后的首份预算案，首次将 AI 列为财政优先事项。重点措施包括：加速企业数字化转型拨款、扩大 AI 技能培训计划覆盖面、增加 AI 研发投入。预算案为后续 NAIS 2.0 的落地执行提供了财政保障，标志着 AI 从战略规划正式进入财政拨款阶段。`,
        contentJa: `2025 年度予算案は黄循財が総理に就任した後の初めての予算案であり、初めて AI を財政優先事項として列挙しました。重点措置には、企業デジタル化転換の加速化拨款、AI スキル訓練計画カバレッジの拡大、AI 研究開発投資の増加が含まれます。予算案は後続の NAIS 2.0 の実装実行に財政保障を提供し、AI が戦略計画から財政拨款段階へ正式に進入したことを示しています。`,
        summaryEn: "Lawrence Wong's first budget as Prime Minister, signalling large-scale AI investment.",
        contentEn: `Budget 2025 is Lawrence Wong's first budget as Prime Minister and the first to designate AI as a fiscal priority. Key measures include: increased grants to accelerate enterprise digital transformation, expanded coverage of AI skills training programmes, and additional AI R&D funding. The budget provides the fiscal foundation for executing NAIS 2.0 and marks the formal transition of AI from strategic planning into the appropriations phase.`,
        sourceEn: 'Ministry of Finance (MOF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'research-innovation-and-enterprise-2025-plan',
        title: 'RIE2025 研究创新计划',
        titleJa: 'RIE2025 研究革新計画',
        titleEn: 'Research, Innovation and Enterprise 2025 Plan',
        date: '2020',
        source: '国家研究基金会 (NRF)',
        sourceJa: '国家研究基金会 (NRF)',
        sourceOrgUrl: 'https://www.nrf.gov.sg/',
        sourceUrl: 'https://www.nrf.gov.sg/',
        translatedPdfUrl: '/pdfs/rie2025-zh.pdf',
        summary: '250 亿新元五年研发计划，AI 列为重点投资领域。',
        summaryJa: '250 億シンガポール・ドルの五年間の研究開発計画。AI を主要投資領域として指定。',
        content: `RIE2025 计划覆盖 2021-2025 年，总投入 250 亿新元，是新加坡历史上最大规模的研发投资。四大战略领域：制造贸易与连接、人类健康与潜能、城市可持续发展与智慧国家、数字经济。AI 贯穿各领域，是核心使能技术。计划支持 AI Singapore 等国家级 AI 研究项目，资助 AI 人才培养、基础研究和产业应用。`,
        contentJa: `RIE2025計画は2021～2025年を対象とし、総投資額250億シンガポールドルで、シンガポール史上最大規模の研究開発投資です。4つの戦略領域は製造・貿易・連携、人間の健康と可能性、都市の持続可能な発展とスマート国家、デジタル経済です。AIはすべての領域を貫くコア的実現技術です。計画はAI Singaporeなどの国家レベルのAI研究プロジェクトを支援し、AI人材育成、基礎研究、産業応用に資金を提供します。`,
        summaryEn: 'S$25 billion five-year R&D plan, with AI designated as a priority investment area.',
        contentEn: `The RIE2025 plan covers 2021-2025 with a total commitment of S$25 billion — the largest R&D investment in Singapore's history. Four strategic domains: Manufacturing, Trade and Connectivity; Human Health and Potential; Urban Solutions and Sustainability and Smart Nation; and Digital Economy. AI runs across all domains as a core enabling technology. The plan supports national AI research programmes such as AI Singapore and funds AI talent development, fundamental research, and industrial applications.`,
        sourceEn: 'National Research Foundation (NRF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '国际合作',
    nameJa: '国際協力',
    nameEn: 'International Collaboration',
    icon: '🌏',
    policies: [
      {
        id: 'seoul-ai-safety-commitment',
        title: '首尔 AI 安全峰会承诺',
        titleJa: 'ソウル AI 安全サミット公約',
        titleEn: 'Seoul AI Safety Commitment',
        date: '2024-05',
        source: '外交部 (MFA)',
        sourceJa: '外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl:
          'https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos/2024/05/Artificial-Intelligence-Seoul-Summit',
        translatedPdfUrl: '/pdfs/seoul-ai-summit-zh.pdf',
        summary: '参与 Seoul AI Safety Summit，进一步推进 AI 安全治理承诺。',
        summaryJa: 'Seoul AI Safety Summit に参加し、AI 安全ガバナンスの約束をさらに推し進めています。',
        content: `2024 年 5 月，新加坡参加在韩国首尔举行的第二届 AI 安全峰会，签署 Seoul AI Safety Commitment。在 Bletchley Declaration 基础上进一步深化承诺：推动前沿 AI 安全评估标准的制定、支持 AI 安全研究所之间的国际协作、促进 AI 安全测试方法论的共享。新加坡连续参与两届峰会，持续巩固其在全球 AI 治理中的积极参与者角色。`,
        contentJa: `2024年5月、シンガポールは韓国ソウルで開催された第2回AI安全サミットに参加し、Seoul AI Safety Commitmentに署名しました。Bletchley Declarationを基盤として、最先端AI安全評価基準の制定推進、AI安全研究機関間の国際協力支援、AI安全テスト方法論の共有促進により、コミットメントをさらに深化させています。シンガポールは連続して2回のサミットに参加し、世界的なAI治理における積極的な参加者としての役割を継続して強化しています。`,
        summaryEn: 'Participation in the Seoul AI Safety Summit, advancing further AI safety governance commitments.',
        contentEn: `In May 2024, Singapore joined the second AI Safety Summit in Seoul and signed the Seoul AI Safety Commitment. Building on the Bletchley Declaration, the commitment goes further: safety evaluation standards for frontier AI, cooperation among AI Safety Institutes, and shared AI safety testing methodologies. Two summits in a row — Singapore continues to lock in its role as an active player in global AI governance.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'bletchley-declaration-on-ai-safety',
        title: 'Bletchley Park AI 安全峰会承诺',
        titleJa: 'Bletchley Park AI 安全サミット公約',
        titleEn: 'Bletchley Declaration on AI Safety',
        date: '2023-11',
        source: '外交部 (MFA)',
        sourceJa: '外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl:
          'https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos/2023/11/20231102---PM-AI-Summit',
        pdfUrl: 'https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration',
        translatedPdfUrl: '/pdfs/bletchley-park-zh.pdf',
        summary: '签署 Bletchley Declaration，承诺 AI 安全国际合作。',
        summaryJa: 'Bletchley Declaration に署名。AI 安全に関する国際協力を約束。',
        content: `2023 年 11 月，新加坡作为 28 个签署国之一参与了在英国 Bletchley Park 举行的首届全球 AI 安全峰会。签署 Bletchley Declaration，核心承诺包括：识别前沿 AI 带来的共同风险、各国承担 AI 安全的相应责任、加强 AI 安全研究的国际合作。宣言特别关注前沿 AI 模型的潜在风险，包括网络安全威胁、生物技术风险和虚假信息。`,
        contentJa: `2023年11月、シンガポールは英国のBletchley Parkで開催された第1回グローバルAI安全サミットに28の署名国の1つとして参加しました。Bletchley Declarationに署名し、主要なコミットメントは以下を含みます。最先端AIがもたらす共通のリスクを識別すること、各国がAI安全に対する相応の責任を負うこと、AI安全研究の国際協力を強化することです。宣言は特に最先端AIモデルの潜在的リスク（サイバーセキュリティの脅威、バイオテクノロジーのリスク、虚偽情報を含む）に焦点を当てています。`,
        summaryEn: 'Signed the Bletchley Declaration, committing to international cooperation on AI safety.',
        contentEn: `In November 2023, Singapore joined 28 signatories at the first global AI Safety Summit at Bletchley Park, UK. By signing the Bletchley Declaration, signatories committed to: identifying shared risks posed by frontier AI, taking on national responsibilities for AI safety, and strengthening international collaboration on AI safety research. The declaration places particular emphasis on potential risks from frontier AI models, including cybersecurity threats, biotechnology risks, and disinformation.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'global-partnership-on-ai-gpai',
        title: '加入全球 AI 合作伙伴关系 (GPAI)',
        titleJa: 'グローバル AI パートナーシップ (GPAI) に加入',
        titleEn: 'Global Partnership on AI (GPAI)',
        date: '2020',
        source: 'SNDGO / 外交部 (MFA)',
        sourceJa: 'SNDGO / 外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://gpai.ai/community/member-countries-and-regions/singapore/',
        translatedPdfUrl: '/pdfs/gpai-zh.pdf',
        summary: '新加坡成为 GPAI 创始成员，参与负责任 AI 国际治理。',
        summaryJa: 'シンガポールが GPAI 創設メンバーとなり、責任ある AI の国際ガバナンスに参加。',
        content: `新加坡于 2020 年成为 GPAI 创始成员国之一。GPAI 是由多国政府发起的国际倡议，旨在通过多利益相关方合作推动负责任 AI 的发展和使用。新加坡积极参与 GPAI 的工作组，包括负责任 AI、数据治理、未来工作、创新与商业化等方向。加入 GPAI 体现了新加坡在 AI 治理领域的国际参与意愿，也为本国政策制定引入国际视角和最佳实践。`,
        contentJa: `シンガポールは2020年にGPAIの創設メンバー国の1つになりました。GPAIは複数の国の政府が発起した国際的なイニシアティブで、複数のステークホルダー間の協力を通じて、責任あるAIの開発と使用を促進することを目的としています。シンガポールはGPAIのワーキンググループに積極的に参加しており、責任あるAI、データガバナンス、将来の仕事、イノベーションと商業化などの領域をカバーしています。GPAIへの参加は、AI治理分野におけるシンガポールの国際参加意思を示し、また国家の政策立案に国際的な視点とベストプラクティスをもたらしています。`,
        summaryEn:
          'Singapore became a founding member of GPAI, participating in international governance for responsible AI.',
        contentEn: `Singapore became a founding member of GPAI in 2020. GPAI is a multi-government initiative that promotes the responsible development and use of AI through multi-stakeholder collaboration. Singapore takes part in working groups on Responsible AI, Data Governance, Future of Work, and Innovation and Commercialisation. Membership reflects Singapore's commitment to international AI governance and pulls outside perspectives into domestic policymaking.`,
        sourceEn: 'SNDGO / Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'singapore-consensus-on-global-ai-safety-research-priorities',
        title: 'Singapore Consensus on Global AI Safety Research Priorities',
        titleEn: 'Singapore Consensus on Global AI Safety Research Priorities',
        date: '2024-04',
        source: 'IMDA / Singapore AI Safety Institute',
        sourceOrgUrl: 'https://aiverifyfoundation.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/news/singapore-consensus/',
        summary: '新加坡发起、11 国签署（含中美）的全球 AI 安全研究优先级共识。',
        summaryJa: 'シンガポール発起、11 カ国署名（米中を含む）の AI 安全研究優先度に関するグローバル・コンセンサス。',
        content: `Singapore Consensus 是新加坡 2024 年 4 月在 ICLR 期间召开的国际科学交流会议（ISESEA I）成果，最终由 11 个国家或地区共同签署，**罕见地把中美都纳入同一份 AI 安全文件**。共识围绕三大研究优先级：(1) 风险评估方法论标准化；(2) 跨国前沿模型红队协作；(3) 关键基础设施 AI 部署的安全门槛。这是新加坡国家 AI-native 战略最具杠杆的产出之一——用 0.07% 的全球人口建立起 AI 治理领域的"中立坐标"。配套机制包括 ISESEA II（2026）持续更新共识、AISI 作为协调中心、Bletchley/Seoul/Paris AI Summits 持续输出。`,
        contentJa: `Singapore Consensusはシンガポールが2024年4月ICLR期間中に開催した国際科学交流会議（ISESEA I）の成果であり、最終的に11の国・地域により共同署名されました。**稀有なことに、米国と中国の両方を同じAI安全文書に盛り込みました**。共識は3つの研究優先事項を軸としています。(1)リスク評価方法論の標準化、(2)国境を越えた最先端モデルのレッドチーム協力、(3)重要インフラAI展開の安全性閾値です。これはシンガポール国家AI-native戦略における最大のレバーの産出の1つです。世界人口の0.07%という規模で、AI治理領域における「中立座標」を確立しました。補完的な仕組みとしては、ISESEA II（2026）による共識の継続的更新、AISIの調整センターとしての機能、Bletchley/Seoul/Paris AI Summitsからの継続的な産出が含まれます。`,
        summaryEn:
          'Singapore-initiated consensus on global AI safety research priorities, signed by 11 countries — including the US and China.',
        contentEn: `The Singapore Consensus emerged from the International Scientific Exchange on AI Safety (ISESEA I), convened by Singapore alongside ICLR in April 2024, and was ultimately signed by 11 countries or jurisdictions — **rare in bringing both the US and China into the same AI safety document**. The consensus is organised around three research priorities: (1) standardisation of risk assessment methodologies; (2) cross-border red-teaming collaboration on frontier models; (3) safety thresholds for AI deployment in critical infrastructure. This is one of the highest-leverage outputs of Singapore's national AI-native strategy — using 0.07% of the world's population to establish a "neutral coordinate" in AI governance. Supporting mechanisms include ISESEA II (2026) for ongoing consensus updates, AISI as the coordination centre, and continuing output through the Bletchley / Seoul / Paris AI Summits.`,
        sourceEn: 'IMDA / Singapore AI Safety Institute',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'asean-guide-on-ai-governance-and-ethics',
        title: 'ASEAN Guide on AI Governance and Ethics',
        titleEn: 'ASEAN Guide on AI Governance and Ethics',
        date: '2024-02',
        source: 'ASEAN Digital Ministers / IMDA',
        sourceOrgUrl: 'https://asean.org/',
        sourceUrl:
          'https://asean.org/wp-content/uploads/2024/02/ASEAN-Guide-on-AI-Governance-and-Ethics_beautified_201223_v2.pdf',
        summary: 'ASEAN 10 国采纳的 AI 治理指南，新加坡主导起草，IMDA 承担秘书处职能。',
        summaryJa:
          'ASEAN 10 カ国が採択した AI ガバナンス・ガイドライン。シンガポール主導起草、IMDA が事務局機能を担当。',
        content: `ASEAN Guide on AI Governance and Ethics 由新加坡主导起草，2024 年 2 月由 ASEAN 数字部长会议正式通过，10 个成员国采纳。指南直接基于新加坡 Model AI Governance Framework，是新加坡治理模板的"区域化版本"。覆盖：组织治理、数据治理、AI 系统全生命周期管理、人在回路、风险分级。新加坡通过 ASEAN Working Group on AI Governance（WG-AI）持续承担秘书处职能。这是新加坡战略的关键杠杆——把本国治理标准变成区域默认标准，让外资在东南亚部署 AI 时**自然地遵循新加坡定义的边界**。延伸：2026 年 ASEAN Hanoi Declaration 进一步深化数字部长合作。`,
        contentJa: `ASEAN Guide on AI Governance and Ethicsはシンガポール主導で起草され、2024年2月にASEAN数字大臣会議で正式に採択され、10の加盟国が採択しました。本ガイドラインはシンガポールのModel AI Governance Frameworkに直接基づく、シンガポール治理テンプレートの「地域化版」です。組織ガバナンス、データガバナンス、AIシステムの全ライフサイクル管理、人間のループへの組み込み、リスク分類をカバーしています。シンガポールはASEAN Working Group on AI Governance（WG-AI）を通じて、事務局機能を継続的に担当しています。これはシンガポール戦略の重要なレバーです。自国の治理基準を地域デフォルト基準へ転換し、外資が東南アジアでAIを展開する際に**自然とシンガポール定義の枠組みに従う**ようにするものです。拡張：2026年のASEAN Hanoi Declarationは、デジタル大臣協力をさらに深化させています。`,
        summaryEn:
          "AI governance guide adopted by all 10 ASEAN member states, drafted under Singapore's leadership, with IMDA serving as secretariat.",
        contentEn: `The ASEAN Guide on AI Governance and Ethics was drafted under Singapore's leadership and formally adopted by the ASEAN Digital Ministers Meeting in February 2024 across all 10 member states. The guide is built directly on Singapore's Model AI Governance Framework — effectively the "regionalised version" of Singapore's governance template. Coverage includes: organisational governance, data governance, AI system lifecycle management, human-in-the-loop, and risk tiering. Singapore continues to hold the secretariat function through the ASEAN Working Group on AI Governance (WG-AI). This is a key lever in Singapore's strategy — turning its domestic governance standard into the regional default, so that **foreign capital deploying AI in Southeast Asia naturally operates within boundaries defined by Singapore**. Extension: the 2026 ASEAN Hanoi Declaration further deepens digital ministerial cooperation.`,
        sourceEn: 'ASEAN Digital Ministers / IMDA',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'responsible-ai-in-the-military-domain-reaim-seoul-summit',
        title: 'REAIM Seoul Summit 2024 — 联合主办',
        titleJa: 'REAIM Seoul Summit 2024 — 共同主催',
        titleEn: 'Responsible AI in the Military Domain (REAIM) Seoul Summit',
        date: '2024-09',
        source: '外交部 (MFA) / 国防部 (MINDEF)',
        sourceJa: '外交・通商省 (MFA) / 国防部 (MINDEF)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl: 'https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos/2024/09/20240910-REAIM',
        summary: 'REAIM Seoul Summit 五个联合主办国之一，把"军事 AI 责任使用"推向国际议程。',
        summaryJa:
          'REAIM Seoul Summit の五つの共同主催国の一つ。「軍事 AI の責任ある使用」を国際議題に押し上げています。',
        content: `Responsible AI in the Military Domain (REAIM) Seoul Summit 2024 是 REAIM 系列的第二届，新加坡作为五个联合主办国之一（与韩国、荷兰、英国、肯尼亚），把军事 AI 的责任使用推到国际议程。Summit 通过《Blueprint for Action》——首个把军事 AI 治理写成可操作步骤的多边文件，覆盖：人在指挥链中的位置、自主武器边界、AI 决策的国际人道法适用、跨国信任建立机制。新加坡同时主持 REAIM Asia Regional Consultations，把对话扩到东南亚。这是新加坡用"治理中立区"定位介入最敏感议题（军事 AI）的标志性动作——不靠武力，靠规则起草权。`,
        contentJa: `Responsible AI in the Military Domain（REAIM）Seoul Summit 2024はREAIMシリーズの第2回で、シンガポールは5つの共同主催国の1つ（韓国、オランダ、英国、ケニア）として、軍事AIの責任ある使用を国際議題に押し上げました。サミットは『行動のためのブループリント』を採択しました。これは軍事AI治理を実行可能なステップに落とし込んだ初の多国間文書です。指揮チェーン内での人間の役割、自律武器の境界線、AI意思決定への国際人道法の適用、国家間信頼構築メカニズムをカバーしています。シンガポールは同時にREAIM Asia Regional Consultationsを主催し、対話を東南アジアに拡大しています。これはシンガポールが「治理中立区」というポジショニングを活用して、最も敏感な議題である軍事AIに介入する象徴的な動作です。武力ではなく、ルール起草権に頼るものです。`,
        summaryEn:
          'One of five co-hosts of the REAIM Seoul Summit, putting responsible military AI on the international agenda.',
        contentEn: `The Responsible AI in the Military Domain (REAIM) Seoul Summit 2024 is the second edition in the REAIM series. As one of five co-hosts (alongside South Korea, the Netherlands, the UK, and Kenya), Singapore helped place the responsible use of military AI on the international agenda. The Summit adopted the Blueprint for Action — the first multilateral document to translate military AI governance into operational steps, covering: the position of humans in the command chain, the boundaries of autonomous weapons, the application of international humanitarian law to AI decision-making, and cross-border trust-building mechanisms. Singapore also chairs the REAIM Asia Regional Consultations, extending the dialogue across Southeast Asia. This is a flagship move in Singapore's "governance neutral zone" positioning, intervening on the most sensitive AI topic (military AI) — not through hard power, but through rule-drafting authority.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA) / Ministry of Defence (MINDEF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'international-scientific-exchange-on-ai-safety',
        title: 'International Scientific Exchange on AI Safety (ISESEA)',
        titleEn: 'International Scientific Exchange on AI Safety',
        date: '2024-04',
        source: 'IMDA / AISI',
        sourceOrgUrl: 'https://aiverifyfoundation.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        summary: 'ICLR 期间召开的全球 AI 安全科学交流会，已办两届，是 Singapore Consensus 的孵化平台。',
        summaryJa:
          'ICLR 期間中に開催されたグローバル AI 安全科学交流会。二度開催されており、Singapore Consensus の育成プラットフォームです。',
        content: `International Scientific Exchange on AI Safety（ISESEA）由 IMDA 和 Singapore AI Safety Institute 联合主办，借势 ICLR（国际学习表征会议）每年在新加坡或合作地举办。2024 年 ISESEA I 孵化出 Singapore Consensus；2026 年 ISESEA II 继续更新共识、扩展研究优先级。会议定位刻意"科学家+政府+产业"三层混合，避免单纯外交场合的政治化。这是新加坡 AI 国际治理战略的"温和入口"——用学术活动建立非政治化共识，再让政府层面采纳。`,
        contentJa: `International Scientific Exchange on AI Safety（ISESEA）はIMDAとSingapore AI Safety Instituteが共同で主催し、ICLR（国際学習表現会議）を活かして、毎年シンガポールまたはパートナー地で開催されています。2024年のISESEA Iはシンガポール・コンセンサスを生み出しました。2026年のISESEA IIは引き続き共識を更新し、研究優先事項を拡張します。会議の位置付けは意図的に「科学者+政府+産業」の3層ハイブリッドであり、純粋な外交的場での政治化を回避しています。これはシンガポールのAI国際治理戦略における「穏健な入り口」です。学術活動を通じて非政治化した共識を構築し、その後に政府レベルでの採用につなげるものです。`,
        summaryEn:
          'Global AI safety scientific exchange convened alongside ICLR — now in its second edition — and the incubation platform for the Singapore Consensus.',
        contentEn: `The International Scientific Exchange on AI Safety (ISESEA) is co-hosted by IMDA and the Singapore AI Safety Institute, leveraging ICLR (the International Conference on Learning Representations) and convened annually in Singapore or in partner venues. ISESEA I in 2024 incubated the Singapore Consensus; ISESEA II in 2026 continues to refresh the consensus and extend research priorities. The conference is deliberately positioned as a three-way mix of "scientists + government + industry," avoiding the politicisation of purely diplomatic settings. This is the "soft entry point" of Singapore's international AI governance strategy — building depoliticised consensus through academic activity, then letting governments adopt it.`,
        sourceEn: 'IMDA / AISI',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
];

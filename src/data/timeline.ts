export interface TimelineEvent {
  // Phase 1: id is `evt-${year}` for single-event years; multi-event years
  // get `evt-${year}-${slug}` disambiguation. Hand-curated for stability.
  id?: string;
  year: number;
  date?: string; // optional precise YYYY-MM-DD
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  tags?: string[];
  // Phase 1 cross-refs (hand-curated over time).
  personIds?: string[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt-2027',
    year: 2027,
    title: '新加坡主办国际 AI 奥林匹克竞赛',
    titleEn: 'Singapore Hosts International AI Olympiad',
    description:
      '新加坡将首次举办 International Olympiad in AI (IOAI)，将全球 AI 青年人才汇聚狮城，展现新加坡在 AI 教育和人才培养领域的国际领导力。',
    descriptionEn:
      "Singapore will host the International Olympiad in AI (IOAI) for the first time, drawing the world's top young AI talent to the Lion City and underlining Singapore's lead in AI education and talent development.",
    tags: ['人才', '国际'],
  },
  {
    id: 'evt-2026-manus-blocked',
    year: 2026,
    date: '2026-04-27',
    title: 'Meta–Manus 收购被中国 NDRC 否决：「Singapore washing」红线划定',
    titleEn: 'China Blocks Meta–Manus Acquisition: A Red Line Against "Singapore Washing"',
    description:
      '4 月 27 日，中国国家发展和改革委员会（NDRC）正式叫停 Meta 对 Manus 的 20 亿美元收购，援引"国家安全"理由——这是中国首例以国安为由否决 AI 领域外资并购。NDRC 划定三条红线：技术主权、数据主权、国家安全。Manus 母公司 Butterfly Effect 由肖弘、季逸超 2022 年在中国创立，2025 年中将总部迁至新加坡（约 40 名核心技术员从北京搬迁，120 人团队多数被裁），由新加坡 Butterfly Effect 实体接管海外业务。Meta 于 2025 年 12 月宣布收购。2026 年 1 月中国监管启动审查，3 月末肖弘与季逸超被约谈并限制出境。事件直接挑战新加坡作为「AI 离岸中转枢纽」的战略叙事——多家国际媒体（Asia Times、Foreign Policy）将此案定义为「Singapore washing 的极限」，意指仅靠迁注册地无法绕开来源国监管。',
    descriptionEn:
      'On 27 April, China\'s National Development and Reform Commission (NDRC) formally blocked Meta\'s US$2B acquisition of Manus on national-security grounds — the first time China has vetoed a foreign AI acquisition under that rationale. NDRC drew three red lines: technology sovereignty, data sovereignty, and national security. Manus\'s parent Butterfly Effect was founded in China in 2022 by Xiao Hong and Ji Yichao, then relocated its HQ to Singapore in mid-2025 (~40 core technical staff moved from Beijing while most of the 120-person team was laid off), with the Singapore Butterfly Effect entity taking over operations outside China. Meta announced the acquisition in December 2025. Chinese regulators opened a review in January 2026; by late March, Xiao and Ji had been summoned to NDRC and barred from leaving China. The case directly challenges Singapore\'s strategic narrative as an "AI offshore transit hub" — international press (Asia Times, Foreign Policy) framed it as "the limits of Singapore washing," meaning that re-domiciling alone cannot escape source-country oversight.',
    tags: ['治理', '产业', '国际', '数据主权'],
    relatedPostSlugs: [],
  },
  {
    id: 'evt-2026-sc42-plenary',
    year: 2026,
    date: '2026-04-20',
    title: 'ISO/IEC 42119-8 提案：全球首个生成式 AI 测试国际标准',
    titleEn: 'ISO/IEC 42119-8: First International Standard for Testing Generative AI',
    description:
      '4 月 20-24 日，第 17 届 ISO/IEC JTC 1/SC 42 全体会议在新加坡举行——这是 SC 42（全球 AI 标准制定核心机构）首次在东盟召开，由 IMDA 与 Enterprise Singapore 联合主办，汇集 35 个以上国家、250 多位 AI 专家（含美、英、中、日、德、法、韩）。开幕日新加坡正式提交 ISO/IEC 42119-8 标准草案，聚焦生成式 AI 测试方法标准化，两个核心方向：基准测试（benchmarking）统一"考什么、怎么评分"，红队测试（red teaming）标准化"隐藏风险怎么找出来"。如获通过将是全球首个针对生成式 AI 系统的国际测试标准。提案建立在 IMDA 已有的 AI Verify Toolkit、LLM 应用测试 Starter Kit 和 Global AI Assurance Sandbox 基础上。IMDA 现任 CEO Ng Cher Pong 在开幕致辞中表示："标准制定不能以龟速推进——否则将被 AI 高速变革所淘汰。"会议同期，IMDA 与 EnterpriseSG 还为东盟成员国举办了能力建设培训。',
    descriptionEn:
      "From 20–24 April, the 17th ISO/IEC JTC 1/SC 42 plenary convened in Singapore — the first time SC 42 (the core international body for AI standards) has met in ASEAN, co-organised by IMDA and Enterprise Singapore. Over 35 national bodies and 250+ AI experts attended, including delegates from the US, UK, China, Japan, Germany, France and South Korea. On the opening day Singapore formally tabled the ISO/IEC 42119-8 draft, the first international standard targeting testing methodology for generative AI systems, with two pillars: benchmarking (standardising 'what to test and how to score') and red teaming (standardising 'how to surface hidden risks'). The proposal builds on IMDA's prior work — the AI Verify Toolkit, the Starter Kit for Testing of LLM-Based Applications, and the Global AI Assurance Sandbox. IMDA CEO Ng Cher Pong, in his opening address, said: \"Standards setting cannot move at a glacial pace\" — or it risks being outpaced by AI itself. Capacity-building workshops for ASEAN member states ran on the sidelines.",
    tags: ['治理', '国际', '标准'],
    relatedPolicyIds: ['iso-iec-42119-8-generative-ai-testing-standard'],
  },
  {
    id: 'evt-2026-naird-budget',
    year: 2026,
    title: 'NAIRD 发布 + 财政预算：AI 全面加速',
    titleEn: 'NAIRD Launch + Budget 2026: Full-Spectrum AI Acceleration',
    description:
      '1 月：MDDI 宣布 2026-2030 公共 AI 研究投资计划，投资超 10 亿新元（7.79 亿美元）用于公共 AI 研究，聚焦负责任和资源高效的 AI、全链条人才培养、产业应用。同月举办 AI Research Week 2026，与 AAAI 第 40 届会议同期。Microsoft AI Economy Institute 报告显示新加坡 AI 采用率 60.9%，全球第二（仅次于 UAE 64.0%），美国仅 28.3%。2 月：预算案将 AI 提升至空前高度，成立由总理亲自主持的 National AI Council；推出 4 项 AI Mission；Enterprise Innovation Scheme 400% AI 税务扣除；启动 one-north AI 园区建设；National AI Literacy Programme。3 月：新加坡正式成为超老龄社会（65 岁以上 > 21%）；卫生部长宣布 ACE-AI 预测工具（Synapxe 开发），2027 年初推广至 1,100+ Healthier SG 诊所；BRCA1/2 基因检测最高 70% 补贴（2026.12 起）；MediShield Life 覆盖预防性乳房切除术（Q3）及输卵管卵巢切除术（Q4）；MediSave 限额提升惠及 91 万+ 患者。',
    descriptionEn:
      "January: MDDI announced the 2026–2030 public AI research plan, committing over S$1B (US$779M), focused on responsible and resource-efficient AI, full-pipeline talent development, and industry applications. AI Research Week 2026 was held the same month, co-located with the 40th AAAI conference. The Microsoft AI Economy Institute report ranked Singapore's AI adoption rate at 60.9%, second globally (behind UAE at 64.0%; US at 28.3%). February: Budget 2026 elevated AI to an unprecedented priority — establishing a National AI Council chaired by the Prime Minister himself; launching 4 AI Missions; introducing a 400% AI tax deduction under the Enterprise Innovation Scheme; breaking ground on the one-north AI district; rolling out the National AI Literacy Programme. March: Singapore officially became a super-aged society (>21% aged 65+); the Health Minister announced the ACE-AI predictive tool (developed by Synapxe), to be deployed across 1,100+ Healthier SG clinics from early 2027; BRCA1/2 genetic testing subsidies of up to 70% (from Dec 2026); MediShield Life coverage extended to prophylactic mastectomy (Q3) and salpingo-oophorectomy (Q4); MediSave limits raised, benefiting 910,000+ patients.",
    tags: ['预算', '战略', '国际', '医疗'],
    personIds: ['lawrence-wong', 'josephine-teo'],
    relatedPolicyIds: [
      'public-ai-research-investment-2026-2030',
      'budget-2026-national-ai-acceleration',
      'moh-committee-of-supply-2026-healthcare-ai-medisave-reform',
    ],
    relatedPostSlugs: ['singapore-ai-native-companies-vs-nations', 'singapore-ai-vs-smart-nation-two-transformations'],
  },
  {
    id: 'evt-2025-changi-iso42001',
    year: 2025,
    date: '2025-02',
    title: '樟宜机场获全球首张 ISO/IEC 42001 AI 管理体系认证',
    titleEn: "Changi Airport Earns World's First ISO/IEC 42001 AI Management System Certification",
    description:
      '2 月，樟宜机场集团（CAG）由 SGS 颁发 ISO/IEC 42001:2023 AI 管理体系（AIMS）认证，经新加坡认证理事会（SAC）认可——这是全球首张针对机场客户服务的 ISO/IEC 42001 证书，覆盖 5 套面向旅客和商业的 AI 应用（含客户终身价值 CLV、产品推荐、倾向预测等）。该认证为新加坡此后在 SC 42 国际舞台主张 AI 测试与治理标准积累了实证案例。',
    descriptionEn:
      'In February, Changi Airport Group (CAG) became the first airport globally to be certified to ISO/IEC 42001:2023 (AI Management System), audited by SGS and accredited by the Singapore Accreditation Council (SAC). The scope covered five passenger- and commercial-facing AI applications, including Customer Lifetime Value (CLV), product recommender and propensity prediction. The certification became a working proof point that Singapore would later draw on at SC 42 when arguing for international AI testing and governance standards.',
    tags: ['治理', '产业', '标准'],
  },
  {
    id: 'evt-2025-agentic-bigtech',
    year: 2025,
    title: 'Agentic AI 治理与科技巨头落地',
    titleEn: 'Agentic AI Governance and Big Tech Land in Singapore',
    description:
      '发布 Agentic AI 治理框架；推出 SEA-Guard 安全评估工具；Enterprise Compute 拨款 1.5 亿新元；AIAP for Industry 扩展至产业界。7 月 Microsoft Research Asia 在新加坡设立首个东南亚实验室，与 NUS 合作产业博士项目（IPP）。11 月 Google DeepMind 在新加坡建立东南亚首个 AI 研究实验室。',
    descriptionEn:
      'Released the Agentic AI governance framework; launched the SEA-Guard safety evaluation toolkit; allocated S$150M for Enterprise Compute; extended AIAP for Industry into the private sector. In July, Microsoft Research Asia opened its first Southeast Asia lab in Singapore, partnering with NUS on the Industrial PhD Programme (IPP). In November, Google DeepMind established its first Southeast Asia AI research lab in Singapore.',
    tags: ['治理', '技术', '预算', '产业'],
  },
  {
    id: 'evt-2024',
    year: 2024,
    title: '智慧国家 2.0 落地与 AI 预算井喷',
    titleEn: 'Smart Nation 2.0 Rolls Out; AI Budget Surges',
    description:
      'Smart Nation 2.0 落地，发布 1.2 亿新元 AI 应用基金和五大国家 AI 项目（智能货运、市政服务、慢性病管理、个性化教育、边境清关）。AI 预算突破 10 亿新元。3 月 NUS AI Institute 成立，整合校内 AI 研究资源。SEA-LION 大语言模型正式发布；AMP 启动；参加首尔 AI 安全峰会；CSA 发布 AI 安全指南。',
    descriptionEn:
      'Smart Nation 2.0 launched, with a S$120M AI application fund and five National AI Projects (intelligent freight, municipal services, chronic disease management, personalised education, border clearance). The AI budget passed S$1B. The NUS AI Institute was established in March, consolidating university-wide AI research. The SEA-LION large language model was officially released; the AI Trailblazers Maturity Programme (AMP) launched; Singapore attended the Seoul AI Safety Summit; CSA released AI security guidelines.',
    tags: ['战略', '技术', '国际'],
  },
  {
    id: 'evt-2023',
    year: 2023,
    title: 'NAIS 2.0 发布与 AI Verify 开源',
    titleEn: 'NAIS 2.0 Released; AI Verify Open-Sourced',
    description:
      '国家 AI 战略 2.0 发布，从"重点应用"升级为"系统性赋能"。AI Verify 测试框架开源并成立 AI Verify Foundation。生成式 AI 治理框架提案。参加 Bletchley Park 首届 AI 安全峰会。',
    descriptionEn:
      'National AI Strategy 2.0 was released, shifting the framework from "focused applications" to "system-wide enablement". The AI Verify testing framework was open-sourced and the AI Verify Foundation was established. A proposed governance framework for generative AI was published. Singapore attended the inaugural Bletchley Park AI Safety Summit.',
    tags: ['战略', '治理', '国际'],
  },
  {
    id: 'evt-2022',
    year: 2022,
    title: 'AI Verify 发布与 NAISC 启动',
    titleEn: 'AI Verify Released; NAISC Launched',
    description:
      'AI Verify MVP 发布，全球首个 AI 治理测试框架与工具包。National AI Student Challenge (NAISC) 启动，面向学生的全国性 AI 挑战赛。',
    descriptionEn:
      "The AI Verify MVP was released — the world's first AI governance testing framework and toolkit. The National AI Student Challenge (NAISC) was launched as a nationwide AI competition for students.",
    tags: ['治理', '人才'],
  },
  {
    id: 'evt-2020',
    year: 2020,
    title: 'PDPA 修订与 GPAI 创始',
    titleEn: 'PDPA Amendment and GPAI Founding',
    description:
      '个人数据保护法 (PDPA) 重大修订，引入合法利益例外和数据可携带权。AI 治理模型框架更新至 v2。新加坡成为 GPAI 创始成员国，RIE2025 计划启动（250 亿新元）。',
    descriptionEn:
      'Major amendments to the Personal Data Protection Act (PDPA) introduced the legitimate interests exception and data portability rights. The Model AI Governance Framework was updated to v2. Singapore became a founding member of the Global Partnership on AI (GPAI), and the RIE2025 plan was launched (S$25B).',
    tags: ['治理', '国际', '预算'],
  },
  {
    id: 'evt-2019',
    year: 2019,
    title: 'NAIS 1.0 发布',
    titleEn: 'NAIS 1.0 Released',
    description:
      '新加坡首份国家级 AI 战略发布，确立五大重点领域（交通物流、智慧城市、医疗、教育、安全）和三大推动力。同年发布亚洲首个 AI 治理模型框架，MAS 推出 FEAT 原则。',
    descriptionEn:
      "Singapore released its first national AI strategy, identifying five priority sectors (transport and logistics, smart cities, healthcare, education, security) and three enablers. The same year, Asia's first Model AI Governance Framework was published, and MAS introduced the FEAT principles for the financial sector.",
    tags: ['战略', '治理'],
  },
  {
    id: 'evt-2018',
    year: 2018,
    title: 'AIAP 与 100E 计划启动',
    titleEn: 'AIAP and 100E Programmes Launched',
    description:
      'AI Apprenticeship Programme (AIAP) 首批启动，提供 9 个月沉浸式 AI 工程训练。100 Experiments (100E) 计划启动，资助企业进行 AI 概念验证。MAS 发布金融业 FEAT 原则。',
    descriptionEn:
      'The first cohort of the AI Apprenticeship Programme (AIAP) launched, offering 9 months of immersive AI engineering training. The 100 Experiments (100E) programme launched to fund AI proof-of-concept projects with companies. MAS released the FEAT principles for the financial sector.',
    tags: ['人才', '创新'],
  },
  {
    id: 'evt-2017',
    year: 2017,
    title: 'AI Singapore 成立',
    titleEn: 'AI Singapore Established',
    description:
      '国家研究基金会 (NRF) 拨款 1.5 亿新元成立 AI Singapore，整合学术界、产业界和政府资源，统筹推进国家级 AI 研究、创新和人才培养。',
    descriptionEn:
      'The National Research Foundation (NRF) committed S$150M to establish AI Singapore, bringing together academia, industry and government to coordinate national AI research, innovation and talent development.',
    tags: ['战略', '预算'],
  },
  {
    id: 'evt-2014',
    year: 2014,
    title: '智慧国家倡议启动',
    titleEn: 'Smart Nation Initiative Launched',
    description:
      '李显龙总理宣布 Smart Nation Initiative，新加坡成为全球首个以"智慧国家"为目标的国家级数字化转型战略。该倡议为后续所有 AI 政策奠定了制度基础。',
    descriptionEn:
      'Prime Minister Lee Hsien Loong announced the Smart Nation Initiative, making Singapore the first country in the world to declare a national digital transformation strategy under the "Smart Nation" banner. The initiative laid the institutional foundation for all subsequent AI policies.',
    tags: ['战略'],
    relatedPolicyIds: ['smart-nation-initiative'],
    relatedPostSlugs: ['singapore-ai-vs-smart-nation-two-transformations'],
  },
];

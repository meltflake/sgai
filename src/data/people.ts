// Single source of truth for persons across the site.
// Consumed by debates.ts (personIds), policies.ts (authorPersonIds),
// levers.ts (championPersonIds), timeline.ts (personIds), voices.ts
// (re-exports), blog frontmatter (relatedPersonIds), and /people/[id].

import mpStubsJson from './mp-stubs.json';

export type PersonRole =
  | 'minister'
  | 'mp'
  | 'civil-servant'
  | 'academic'
  | 'researcher'
  | 'founder'
  | 'executive'
  | 'investor';

export type Affiliation =
  | 'PMO'
  | 'MDDI'
  | 'MTI'
  | 'MOH'
  | 'MOE'
  | 'MOF'
  | 'MAS'
  | 'MND'
  | 'MOM'
  | 'MHA'
  | 'MFA'
  | 'MCCY'
  | 'MSF'
  | 'MEWR'
  | 'MTI-Workforce'
  | 'IMDA'
  | 'EDB'
  | 'A*STAR'
  | 'AISG'
  | 'NUS'
  | 'NTU'
  | 'SMU'
  | 'SUTD'
  | 'NRF'
  | 'GovTech'
  | 'CSA'
  | 'SkillsFuture'
  | 'PA' // People's Association
  | 'WP' // Workers' Party as institutional affiliation for opposition MPs
  | 'PSP' // Progress Singapore Party
  | 'NMP' // Nominated MP
  | 'Industry'
  | 'Other';

export interface SocialChannel {
  platform: string; // 'twitter' | 'linkedin' | 'facebook' | 'website' | 'newsletter' | 'github'
  url: string;
  /** Display label in zh. May be Latin (e.g. "@handle") if the label is
   *  language-neutral. When `label` contains CJK characters, callers MUST
   *  also set `labelEn` so EN pages can display the English equivalent. */
  label?: string;
  /** English sibling of `label`. Required if `label` contains CJK. */
  labelEn?: string;
  primary?: boolean;
}

/** A program / policy / initiative this person owns or co-leads.
 *  Curated by hand (3–5 max). The bar: AISG/IMDA/etc. publicly attributes
 *  this person as lead or co-lead. Don't list things they merely worked on. */
export interface SignatureWork {
  title: string; // zh display
  titleEn: string;
  /** One sentence: what is it, why it matters. */
  description: string;
  descriptionEn: string;
  /** ISO date or year (e.g. '2023-06' or '2025'). */
  since?: string;
  /** Authoritative source attributing leadership. */
  sourceUrl?: string;
}

/** A pull-quote from public record. Source URL is required so EN/zh readers
 *  can verify. Quote may stay in original language; translate via *Zh sibling. */
export interface NotableQuote {
  /** Quote in original language (usually English). */
  quote: string;
  /** Optional zh translation. */
  quoteZh?: string;
  /** Where + when (e.g. 'SCAI 2025 keynote', 'NTU statement, 2026-01'). */
  context: string;
  contextEn: string;
  date?: string; // ISO
  sourceUrl: string;
}

/** A notable speaking engagement (keynote, panel, official remarks).
 *  Cap at ~5 most recent / most significant. */
export interface SpeakingEntry {
  event: string;
  eventEn: string;
  role?: string; // 'keynote', 'panel', 'opening remarks'
  roleEn?: string;
  date: string; // ISO
  sourceUrl?: string;
}

/** External role beyond primary affiliation — board seat, working-group chair,
 *  international council membership. */
export interface ExternalRole {
  role: string;
  roleEn: string;
  organization: string;
  organizationEn: string;
  since?: string;
  sourceUrl?: string;
}

export interface Person {
  id: string; // kebab-case stable, e.g. 'josephine-teo'
  name: string; // Latin canonical
  zhName: string;
  aliases?: string[]; // tolerates "Mrs Josephine Teo", "Dr Janil Puthucheary", etc.
  title: string;
  zhTitle: string;
  category: 'government' | 'academic' | 'industry';
  // Stored as plain string[] / string — typed widely on purpose because
  // 200+ literal records cause tsserver OOM when the field is a strict union.
  // Callers that need narrow types can import PersonRole/Affiliation aliases
  // and cast at the use site.
  roles: string[];
  affiliations: string[];
  party?: string | null;
  summary: string;
  summaryEn?: string;
  channels: SocialChannel[];
  // Curated extensions — populated for high-signal voices via
  // scripts/voices-prospect.mjs (proposes) + manual review (commits).
  signatureWork?: SignatureWork[];
  notableQuotes?: NotableQuote[];
  speakingRecord?: SpeakingEntry[];
  externalRoles?: ExternalRole[];
  // Build-time computed (set by getRelated() / verify-graph script).
  debateCount?: number;
  videoCount?: number;
  policyAuthorCount?: number;
  blogMentionCount?: number;
}

export const people: Person[] = [
  {
    id: 'josephine-teo',
    name: 'Josephine Teo',
    zhName: '杨莉明',
    aliases: ['Mrs Josephine Teo', 'Mrs Teo'],
    title: 'Minister for Digital Development and Information',
    zhTitle: '数码发展及新闻部长',
    category: 'government',
    roles: ['minister', 'mp'],
    affiliations: ['MDDI', 'PMO'],
    party: 'PAP',
    summary: '新加坡 AI 政策的核心推动者，主导国家 AI 战略、Agentic AI 治理框架、AI 双语人才计划。',
    summaryEn:
      "The lead force behind Singapore's AI policy; runs the National AI Strategy, the Agentic AI governance framework, and the bilingual AI talent programme.",
    channels: [
      { platform: 'twitter', url: 'https://x.com/joteo_ylm', label: '@joteo_ylm' },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/josephine-teo-ylm/',
        primary: true,
      },
      { platform: 'facebook', url: 'https://www.facebook.com/JosephineTeoYLM/' },
      { platform: 'website', url: 'https://www.mddi.gov.sg/', label: 'MDDI 官网', labelEn: 'MDDI website' },
    ],
  },
  {
    id: 'lawrence-wong',
    name: 'Lawrence Wong',
    zhName: '黄循财',
    aliases: ['Mr Lawrence Wong', 'PM Wong'],
    title: 'Prime Minister of Singapore',
    zhTitle: '新加坡总理',
    category: 'government',
    roles: ['minister', 'mp'],
    affiliations: ['PMO', 'MOF'],
    party: 'PAP',
    summary: '亲自担任国家 AI 委员会主席，2026 预算案将 AI 列为国家优先事项。',
    summaryEn:
      'Chairs the National AI Council himself; under his lead, Budget 2026 elevated AI to a national priority.',
    channels: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/lawrencewongst/',
        primary: true,
      },
      { platform: 'website', url: 'https://www.pmo.gov.sg/', label: 'PMO 官网', labelEn: 'PMO website' },
    ],
  },
  {
    id: 'vivian-balakrishnan',
    name: 'Vivian Balakrishnan',
    zhName: '维文',
    aliases: ['Dr Vivian Balakrishnan', 'Dr Balakrishnan'],
    title: 'Minister for Foreign Affairs',
    zhTitle: '外交部长',
    category: 'government',
    roles: ['minister', 'mp'],
    affiliations: ['MFA'],
    party: 'PAP',
    summary: 'Smart Nation 倡议发起人，推动新加坡 AI 国际合作，包括新韩 AI 连接峰会。',
    summaryEn:
      "Architect of the Smart Nation initiative; leads Singapore's international AI cooperation, including the Singapore–Korea AI Connectivity Summit.",
    channels: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/VivianBalakrishnan/',
        primary: true,
      },
      { platform: 'website', url: 'https://www.mfa.gov.sg/', label: 'MFA 官网', labelEn: 'MFA website' },
    ],
  },
  {
    id: 'tharman',
    name: 'Tharman Shanmugaratnam',
    zhName: '尚达曼',
    aliases: ['Mr Tharman Shanmugaratnam', 'President Tharman'],
    title: 'President of Singapore',
    zhTitle: '新加坡总统',
    category: 'government',
    roles: ['minister'],
    affiliations: ['PMO'],
    party: null,
    summary: '在国际论坛频繁发声谈 AI 治理与社会影响，推动全球 AI 安全对话。',
    summaryEn:
      'A regular voice at international forums on AI governance and its social impact; pushes the global AI safety conversation forward.',
    channels: [
      {
        platform: 'website',
        url: 'https://www.istana.gov.sg/',
        label: 'Istana 官网',
        labelEn: 'Istana website',
        primary: true,
      },
    ],
  },
  {
    id: 'tan-kiat-how',
    name: 'Tan Kiat How',
    zhName: '陈杰豪',
    aliases: ['Mr Tan Kiat How'],
    title: 'Senior Minister of State for Digital Development and Information',
    zhTitle: 'MDDI 高级政务部长',
    category: 'government',
    roles: ['minister', 'mp', 'civil-servant'],
    affiliations: ['MDDI', 'IMDA'],
    party: 'PAP',
    summary: '前 IMDA CEO，主管数字经济、AI 治理、数据中心政策的具体落地。',
    summaryEn:
      'Former CEO of IMDA; oversees the operational rollout of digital economy, AI governance and data centre policy.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/kiat-how-tan-59933736/',
        primary: true,
      },
      { platform: 'facebook', url: 'https://www.facebook.com/TanKiatHow/' },
    ],
  },
  {
    id: 'ho-teck-hua',
    name: 'Ho Teck Hua',
    zhName: '何德华',
    aliases: ['Prof Ho Teck Hua', 'Professor Ho Teck Hua'],
    title: 'President of NTU, Founding Executive Chairman of AI Singapore',
    zhTitle: 'NTU 校长 / AI Singapore 创始主席',
    category: 'academic',
    roles: ['academic', 'researcher'],
    affiliations: ['NTU', 'AISG'],
    party: null,
    summary: 'AI Singapore 创始人，推动 SEA-LION、AIAP 等核心项目，新加坡 AI 研究生态的奠基者。',
    summaryEn:
      "Founder of AI Singapore; leads flagship programmes including SEA-LION and AIAP, and is the founding figure of Singapore's AI research scene.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/teck-hua-ho-20b408296',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.ntu.edu.sg/about-us/university-leadership/profiles/professor-ho-teck-hua',
        label: 'NTU 官方档案',
        labelEn: 'NTU official profile',
      },
    ],
  },
  {
    id: 'laurence-liew',
    name: 'Laurence Liew',
    zhName: '刘劲松',
    aliases: [],
    title: 'Director of AI Innovation, AI Singapore',
    zhTitle: 'AI Singapore AI 创新总监',
    category: 'academic',
    roles: ['academic', 'executive'],
    affiliations: ['AISG'],
    party: null,
    summary: '100E、AIAP、LearnAI 计划的推动者，20 万+新加坡人接受 AI 教育，GPAI 创新商业化联合主席。',
    summaryEn:
      "Drives the 100E, AIAP and LearnAI programmes — 200,000+ Singaporeans have received AI education through these initiatives; co-chairs GPAI's Innovation and Commercialisation working group.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/laurenceliew',
        primary: true,
      },
      { platform: 'twitter', url: 'https://twitter.com/laurenceliew', label: '@laurenceliew' },
      {
        platform: 'website',
        url: 'https://aifirstnation.org/',
        label: 'AI-First Nation 博客',
        labelEn: 'AI-First Nation blog',
      },
    ],
    signatureWork: [
      {
        title: '100 Experiments（100E）',
        titleEn: '100 Experiments (100E)',
        description: 'AISG 的旗舰产学合作项目，撮合企业和 AI 研究者共同落地真实世界 AI 应用，Laurence 是项目架构师。',
        descriptionEn:
          "AISG's flagship industry–research matchmaking programme, pairing enterprises with AI researchers to ship real-world deployments. Laurence is the architect.",
        since: '2018',
        sourceUrl:
          'https://aifirstnation.org/singapores-journey-from-local-innovation-to-global-impact-with-the-ai-apprenticeship-programme-aiap/',
      },
      {
        title: 'AI Apprenticeship Programme（AIAP）',
        titleEn: 'AI Apprenticeship Programme (AIAP)',
        description: '新加坡培养 AI 工程师的标杆项目，已建立 200+ 人的 AI Engineering 团队，并通过 AIAPX 输出到多国。',
        descriptionEn:
          "Singapore's signature pipeline for AI engineers — has built a 200-strong in-house AI engineering team and been exported to multiple countries via AIAPX.",
        since: '2018',
        sourceUrl:
          'https://govinsider.asia/intl-en/article/how-did-ai-singapore-build-a-200-strong-ai-engineering-team-with-the-blue-ocean-strategy-laurence-liew',
      },
      {
        title: 'LearnAI（AI4E / AI4I）',
        titleEn: 'LearnAI (AI4E / AI4I)',
        description: 'AI for Everyone 与 AI for Industry 的全国 AI 普及计划；超过 20 万新加坡人通过这条线接触 AI。',
        descriptionEn:
          'National AI literacy programmes (AI for Everyone, AI for Industry) — 200,000+ Singaporeans have been trained through this track.',
        since: '2019',
      },
    ],
    notableQuotes: [
      {
        quote:
          'Ethics, governance and standards go hand in hand. More companies will use standards to ensure the quality of AI products.',
        quoteZh: '伦理、治理、标准三者一体——会有越来越多公司用标准来保证 AI 产品的质量。',
        context: 'SFF 2025 sidelines, IMDA + Enterprise Singapore AI 标准委员会主席身份发言',
        contextEn: 'SFF 2025 sidelines, speaking as chair of the IMDA + Enterprise Singapore AI standards committee',
        date: '2025-11',
        sourceUrl:
          'https://www.theasianbanker.com/updates-and-articles/ai-singapore-strengthens-the-talent-and-governance-foundations-for-ai-adoption',
      },
    ],
    speakingRecord: [
      {
        event: 'TechWeek Singapore',
        eventEn: 'TechWeek Singapore',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2026',
        sourceUrl: 'https://www.singaporetechnologyweek.com/speakers/laurence-liew',
      },
      {
        event: 'Legal Innovation Festival SE Asia',
        eventEn: 'Legal Innovation Festival SE Asia',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2026',
        sourceUrl: 'https://www.legalinnovationsea.com/speakers/laurence-liew',
      },
      {
        event: 'Singapore FinTech Festival 2025',
        eventEn: 'Singapore FinTech Festival 2025',
        role: 'Sidelines briefing',
        roleEn: 'Sidelines briefing',
        date: '2025-11',
        sourceUrl:
          'https://www.theasianbanker.com/updates-and-articles/ai-singapore-strengthens-the-talent-and-governance-foundations-for-ai-adoption',
      },
      {
        event: 'SEMICON Southeast Asia',
        eventEn: 'SEMICON Southeast Asia',
        role: 'Panelist',
        roleEn: 'Panelist',
        date: '2025',
        sourceUrl: 'https://www.semiconsea.org/speakers/Laurence-LIEW-AI-SG',
      },
    ],
    externalRoles: [
      {
        role: '联合主席（创新与商业化工作组）',
        roleEn: 'Co-chair, Innovation & Commercialisation Working Group',
        organization: 'GPAI（全球 AI 伙伴关系）',
        organizationEn: 'Global Partnership on AI (GPAI)',
        sourceUrl:
          'https://aifirstnation.org/singapores-journey-from-local-innovation-to-global-impact-with-the-ai-apprenticeship-programme-aiap/',
      },
      {
        role: '首任主席',
        roleEn: 'Founding Chair',
        organization: '新加坡 AI 标准委员会（IMDA + Enterprise Singapore）',
        organizationEn: 'Singapore AI Standards Committee (IMDA + Enterprise Singapore)',
        sourceUrl:
          'https://www.theasianbanker.com/updates-and-articles/ai-singapore-strengthens-the-talent-and-governance-foundations-for-ai-adoption',
      },
    ],
  },
  {
    id: 'leslie-teo',
    name: 'Leslie Teo',
    zhName: '张志强',
    aliases: ['Dr Leslie Teo'],
    title: 'Senior Director, AI Products, AI Singapore (SEA-LION lead)',
    zhTitle: 'AI Singapore AI 产品高级总监 / SEA-LION 项目牵头人',
    category: 'academic',
    roles: ['academic', 'executive', 'researcher'],
    affiliations: ['AISG'],
    party: null,
    summary:
      'SEA-LION 实际操盘人，把东南亚多语言大模型从 v1 迭代到 v3（70B），推动 SEA-LION 成为政府 AI 服务的底层模型。',
    summaryEn:
      'The operational lead behind SEA-LION, taking the Southeast Asian multilingual LLM from v1 through v3 (70B), and the engine behind SEA-LION powering government AI services.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/leslieteo01/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'SEA-LION 东南亚多语言大模型',
        titleEn: 'SEA-LION Southeast Asian LLM',
        description:
          'AISG 的旗舰开源东南亚多语言大模型项目。Leslie 操盘从 v1 迭代到 v3（70B），并推动 SEA-LION 成为政府 AI 服务的底层模型。',
        descriptionEn:
          "AISG's flagship open-source Southeast Asian multilingual LLM. Leslie has driven the model from v1 through v3 (70B) and pushed SEA-LION to become the foundation for government AI services.",
        since: '2023',
        sourceUrl: 'https://sea-lion.ai/blog/sea-lion-summit-2025-powering-southeast-asias-ai-future/',
      },
      {
        title: 'Qwen-SEA-LION-v4（与阿里云合作）',
        titleEn: 'Qwen-SEA-LION-v4 (Alibaba Cloud collaboration)',
        description:
          '2025 年 11 月发布的合作版本，以阿里云 Qwen 为底座、强化东南亚语种覆盖；Leslie 是公开发声的代言人。',
        descriptionEn:
          "November 2025 collaboration that uses Alibaba Cloud's Qwen as the base and strengthens Southeast Asian language coverage; Leslie was the public spokesperson.",
        since: '2025-11',
        sourceUrl:
          'https://www.computerweekly.com/news/366635316/Sea-Lion-powering-AI-tools-for-migrant-workers-local-businesses',
      },
    ],
    notableQuotes: [
      {
        quote:
          'Scaling LLMs for Southeast Asian languages is the challenge — and the opportunity. The community is what makes SEA-LION work.',
        quoteZh: '把大模型规模化到东南亚语种，既是挑战也是机会——SEA-LION 真正跑起来靠的是社区。',
        context: 'SEA-LION Summit 2025 闭幕致辞',
        contextEn: 'Closing remarks, SEA-LION Summit 2025',
        date: '2025-12',
        sourceUrl: 'https://sea-lion.ai/blog/sea-lion-summit-2025-powering-southeast-asias-ai-future/',
      },
      {
        quote:
          'The collaboration with Alibaba will help advance AI inclusivity and make SEA-LION more representative of Southeast Asia.',
        quoteZh: '与阿里云合作能推动 AI 包容性，让 SEA-LION 更能代表东南亚。',
        context: 'Computer Weekly 报道 Qwen-SEA-LION-v4 发布',
        contextEn: 'Computer Weekly report on Qwen-SEA-LION-v4 release',
        date: '2025-11',
        sourceUrl:
          'https://www.computerweekly.com/news/366635316/Sea-Lion-powering-AI-tools-for-migrant-workers-local-businesses',
      },
    ],
    speakingRecord: [
      {
        event: 'SEA-LION Summit 2025（首届）',
        eventEn: 'SEA-LION Summit 2025 (inaugural)',
        role: '闭幕致辞 + Panel',
        roleEn: 'Closing remarks + Panel',
        date: '2025-12',
        sourceUrl: 'https://sea-lion.ai/blog/sea-lion-summit-2025-powering-southeast-asias-ai-future/',
      },
      {
        event: 'ITU AI for Good Global Summit',
        eventEn: 'ITU AI for Good Global Summit',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2024',
        sourceUrl: 'https://aiforgood.itu.int/speaker/leslie-teo/',
      },
      {
        event: 'Echelon X（e27）',
        eventEn: 'Echelon X (e27)',
        role: 'Speaker（SEA-LION 专题）',
        roleEn: 'Speaker (SEA-LION feature)',
        date: '2024-08',
        sourceUrl:
          'https://e27.co/echelon-x-dr-leslie-teo-on-tailoring-ai-for-southeast-asias-diverse-needs-with-sea-lion-20240807/',
      },
    ],
  },
  {
    id: 'mohan-kankanhalli',
    name: 'Mohan Kankanhalli',
    zhName: '莫汉·坎卡纳哈利',
    aliases: ['Prof Mohan Kankanhalli', 'Professor Mohan Kankanhalli'],
    title: 'Deputy Executive Chairman (Talent), AI Singapore; Director, NUS AI Institute',
    zhTitle: 'AI Singapore 副执行主席（人才）/ NUS AI 研究院院长',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['AISG', 'NUS'],
    party: null,
    summary:
      '前 NUS Computing 学院院长（2016–2022），现任 NUS AI 研究院院长，主管 AISG 人才管线。研究方向为多模态计算与可信 AI。',
    summaryEn:
      "Former Dean of NUS School of Computing (2016–2022); now Director of NUS AI Institute and oversees AISG's talent pipeline. Research focus: multimodal computing and trustworthy AI.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/mohan-kankanhalli-583417221',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.comp.nus.edu.sg/cs/people/mohan/',
        label: 'NUS 官方档案',
        labelEn: 'NUS faculty profile',
      },
    ],
    signatureWork: [
      {
        title: 'NUS AI Institute (NAII) 创院院长',
        titleEn: 'NUS AI Institute (NAII) — founding Director',
        description: '2024-03 NAII 成立时任创院院长，定位为加速前沿 AI 研究并推动公共领域影响落地。',
        descriptionEn:
          'Founding Director of the NUS AI Institute (launched March 2024); chartered to accelerate frontier AI research and drive real-world public-good impact.',
        since: '2024-03',
        sourceUrl: 'https://news.nus.edu.sg/nus-sets-up-ai-institute/',
      },
      {
        title: 'AISG Talent & Ecosystem 副执行主席',
        titleEn: 'AISG Deputy Executive Chairman (Talent & Ecosystem)',
        description:
          '在 AISG 任副执行主席（人才与生态），与首席科学家 Luke Ong、研究主席 Phoon 共同构成 AISG 三驾马车。',
        descriptionEn:
          "AISG Deputy Executive Chairman for Talent & Ecosystem — completes AISG's leadership trio alongside Chief Scientist Luke Ong and Research Chair Phoon Kok Kwang.",
        sourceUrl: 'https://aisingapore.org/home/the-team/',
      },
    ],
    speakingRecord: [
      {
        event: 'Singapore Conference on AI (SCAI) 2025',
        eventEn: 'Singapore Conference on AI (SCAI) 2025',
        role: 'Participant',
        roleEn: 'Participant',
        date: '2025',
        sourceUrl: 'https://www.scai.gov.sg/2025/participants-of-scai-2025/mohan-kankanhalli/',
      },
      {
        event: 'Singapore FinTech Festival',
        eventEn: 'Singapore FinTech Festival',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2025',
        sourceUrl: 'https://www.fintechfestival.sg/speakers/spkr4563-prof-mohan-kankanhalli',
      },
    ],
    externalRoles: [
      {
        role: 'Fellow',
        roleEn: 'Fellow',
        organization: '新加坡国家科学院（SNAS）',
        organizationEn: 'Singapore National Academy of Science (SNAS)',
        sourceUrl: 'https://www.weforum.org/people/mohan-kankanhalli/',
      },
      {
        role: 'IEEE Fellow',
        roleEn: 'IEEE Fellow',
        organization: 'IEEE',
        organizationEn: 'IEEE',
        sourceUrl: 'https://www.weforum.org/people/mohan-kankanhalli/',
      },
    ],
  },
  {
    id: 'luke-ong',
    name: 'Luke Ong',
    zhName: '翁之昊',
    aliases: ['Prof Luke Ong', 'Professor Luke Ong'],
    title:
      'Deputy Executive Chairman (Applied & Translational) and Chief Scientist, AI Singapore; VP (AI & Digital Economy), NTU',
    zhTitle: 'AI Singapore 副执行主席（应用与产业）兼首席科学家 / NTU AI 与数字经济副校长',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['AISG', 'NTU'],
    party: null,
    summary:
      'AISG 首席科学家，负责基础研究方向；同时是 NTU 计算与数据科学学院创院院长。剑桥/帝国理工出身，前牛津 28 年。',
    summaryEn:
      "AISG's Chief Scientist for foundational research; founding Dean of NTU's College of Computing and Data Science. Cambridge/Imperial-trained; spent 28 years at Oxford prior to joining NTU.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/luke-ong-5a95a124/',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.ntu.edu.sg/research/faculty-directory/detail/rp02044',
        label: 'NTU 官方档案',
        labelEn: 'NTU faculty profile',
      },
    ],
    signatureWork: [
      {
        title: 'AISG 基础研究方向',
        titleEn: 'AISG Foundational Research Pillar',
        description:
          '作为 AISG 首席科学家，统筹基础研究方向；与副执行主席（研究）Phoon Kok Kwang 共同主导 NAIS 2.0 与 RIE2030 框架下的国家 AI 研究议程。',
        descriptionEn:
          "As AISG's Chief Scientist, leads foundational research; co-steers the national AI research agenda under NAIS 2.0 and RIE2030 alongside Deputy Executive Chairman (Research) Phoon Kok Kwang.",
        since: '2024',
        sourceUrl: 'https://aisingapore.org/home/the-team/',
      },
      {
        title: 'NTU 计算与数据科学学院（CCDS）',
        titleEn: 'NTU College of Computing and Data Science (CCDS)',
        description:
          '2024 年 5 月任 NTU AI 与数字经济副校长 + CCDS 创院院长，把 NTU 的 AI 教学、科研与产业接口整合到一所新学院。',
        descriptionEn:
          "Appointed Vice President (AI & Digital Economy) and founding Dean of NTU CCDS in May 2024 — consolidates NTU's AI teaching, research and industry interfaces under one college.",
        since: '2024-05',
        sourceUrl:
          'https://www.ntu.edu.sg/computing/news-events/news/detail/learning-with-ai--strengthening-computing-education-in-an-ai-shaped-world',
      },
    ],
    notableQuotes: [
      {
        quote: 'Artificial intelligence is a multiplier. But if the multiplicand is zero, the outcome is zero.',
        quoteZh: 'AI 是一个乘数。但如果被乘数是零，结果还是零。',
        context: 'NTU CCDS 关于强化计算教育的声明',
        contextEn: 'NTU CCDS statement on strengthening computing education',
        date: '2026',
        sourceUrl:
          'https://www.ntu.edu.sg/computing/news-events/news/detail/learning-with-ai--strengthening-computing-education-in-an-ai-shaped-world',
      },
    ],
    speakingRecord: [
      {
        event: 'Singapore Conference on AI (SCAI) 2025',
        eventEn: 'Singapore Conference on AI (SCAI) 2025',
        role: 'Participant',
        roleEn: 'Participant',
        date: '2025',
        sourceUrl: 'https://www.scai.gov.sg/2025/participants-of-scai-2025/luke-ong/',
      },
      {
        event: 'NTU–Europe Dialogue on Digital Trust and Safe AI',
        eventEn: 'NTU–Europe Dialogue on Digital Trust and Safe AI',
        role: 'Welcome remarks',
        roleEn: 'Welcome remarks',
        date: '2025',
        sourceUrl: 'https://www.ntu.edu.sg/dtc/ntu-singapore-europe-dialogue-on-digital-trust-and-safe-ai/agenda',
      },
      {
        event: 'HUN-REN AI Symposium 2025',
        eventEn: 'HUN-REN AI Symposium 2025',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2025',
        sourceUrl: 'https://hun-ren.hu/ai-symposium-2025/luke-ong.html',
      },
      {
        event: 'Singapore International Cyber Week (SICW)',
        eventEn: 'Singapore International Cyber Week (SICW)',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2025',
        sourceUrl: 'https://www.sicw.gov.sg/speakers/prof-luke-ong/',
      },
    ],
  },
  {
    id: 'phoon-kok-kwang',
    name: 'Phoon Kok Kwang',
    zhName: '潘国强',
    aliases: ['Prof Phoon Kok Kwang', 'Professor Phoon Kok Kwang'],
    title: 'Deputy Executive Chairman (Research), AI Singapore; President, SUTD',
    zhTitle: 'AI Singapore 副执行主席（研究）/ SUTD 校长',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['AISG', 'SUTD', 'NUS'],
    party: null,
    summary:
      '2025-08 接任 AISG 研究方向副执行主席，同时担任 SUTD 校长。前 NUS 高级副教务长，岩土工程数据驱动方法的全球权威。',
    summaryEn:
      'Took on the AISG Deputy Executive Chairman (Research) role from August 2025 while serving as President of SUTD. Former NUS Senior Vice-Provost; global authority on data-driven methods in geotechnical engineering.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/kok-kwang-phoon-21a312106/',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.sutd.edu.sg/',
        label: 'SUTD 校长办公室',
        labelEn: 'SUTD President office',
      },
    ],
    signatureWork: [
      {
        title: 'AISG 研究方向（NAIS 2.0 / RIE2030 对齐）',
        titleEn: 'AISG Research Pillar (aligned with NAIS 2.0 / RIE2030)',
        description:
          '2025-08-01 起任 AISG 副执行主席（研究），任期两年，对齐国家 AI 战略 2.0、National AI R&D 计划与 RIE2030。',
        descriptionEn:
          'Took up the AISG Deputy Executive Chairman (Research) role on 1 August 2025 for a two-year term, aligned with NAIS 2.0, the National AI R&D Plan and RIE2030.',
        since: '2025-08',
        sourceUrl:
          'https://www.sutd.edu.sg/achievements-listing/prof-phoon-kok-kwang-appointed-deputy-executive-chairman-research-aisg/',
      },
      {
        title: 'SUTD 转型为 Design·AI 大学',
        titleEn: "SUTD's pivot to a Design·AI university",
        description:
          '作为 SUTD 校长，把学校重新定位为「全球首个 Design·AI 大学」，并扩展旗舰 Design AI 学位、首次把社会科学整合进技术学位。',
        descriptionEn:
          "As SUTD President, repositioned the school as the world's first Design·AI university and expanded the flagship Design AI degree — the first to fold social sciences into a technology degree.",
        since: '2024',
        sourceUrl:
          'https://www.sutd.edu.sg/media-releases-listing/sutd-broadens-scope-of-flagship-design-and-ai-degree-first-university-to-integrate-social-sciences-into-technology-degree/',
      },
    ],
    speakingRecord: [
      {
        event: 'BT-SUTD Design AI and Tech Awards',
        eventEn: 'BT-SUTD Design AI and Tech Awards',
        role: 'Opening address',
        roleEn: 'Opening address',
        date: '2025',
        sourceUrl:
          'https://www.sutd.edu.sg/speeches-listing/bt-sutd-design-ai-and-tech-awards-opening-address-prof-phoon-kok-kwang',
      },
    ],
    externalRoles: [
      {
        role: '副执行主席（研究）',
        roleEn: 'Deputy Executive Chairman (Research)',
        organization: 'AI Singapore（AISG）',
        organizationEn: 'AI Singapore (AISG)',
        since: '2025-08',
        sourceUrl:
          'https://www.sutd.edu.sg/achievements-listing/prof-phoon-kok-kwang-appointed-deputy-executive-chairman-research-aisg/',
      },
      {
        role: '新加坡首位入选成员',
        roleEn: "Singapore's first appointee",
        organization: '国际工程理事会（Global Engineering Council）',
        organizationEn: 'Global Engineering Council',
        sourceUrl:
          'https://www.sutd.edu.sg/media-releases-listing/sutd-president-appointed-to-prestigious-global-engineering-council-the-first-for-singapore/',
      },
    ],
  },
  {
    id: 'simon-chesterman',
    name: 'Simon Chesterman',
    zhName: '陈西文',
    aliases: ['Prof Simon Chesterman', 'Professor Simon Chesterman'],
    title: 'Senior Director, AI Governance, AI Singapore; AI Governance and Policy Lead, NUS AI Institute',
    zhTitle: 'AI Singapore AI 治理高级总监 / NUS AI 研究院 AI 治理与政策负责人',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['AISG', 'NUS'],
    party: null,
    summary:
      '前 NUS 法学院院长（2012–2022），把 NUS Law 推上 QS 全球第 10、亚洲第一。新加坡 AI 治理领域的核心学者，长期写作 AI 与公共法学话题。',
    summaryEn:
      'Former Dean of NUS Law (2012–2022) — under whom NUS Law rose to QS world #10 and Asia #1. A central scholarly voice on Singapore AI governance with a long publishing record on AI and public law.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/simonchesterman/',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://law.nus.edu.sg/people/simon-chesterman/',
        label: 'NUS Law 官方档案',
        labelEn: 'NUS Law faculty profile',
      },
    ],
    signatureWork: [
      {
        title: 'AISG AI 治理方向',
        titleEn: 'AISG AI Governance direction',
        description:
          '作为 AISG AI 治理高级总监，统领新加坡 AI 治理研究、AI Verify 学术对接，主持 AISG AI Research Symposium 治理 AI Agents 议题。',
        descriptionEn:
          "As Senior Director of AI Governance at AISG, leads Singapore's AI governance research and academic interface with AI Verify; moderated the AISG AI Research Symposium 2025 on Governing AI Agents.",
        sourceUrl: 'https://aisingapore.org/ai-governance/aisg-ai-research-symposium-2025-governing-ai-agents/',
      },
      {
        title: 'NUS College 创院院长 + Vice Provost',
        titleEn: 'NUS College founding Dean + Vice Provost',
        description: '同时担任 NUS College 创院院长与 NUS 副教务长（教育创新），把 AI 治理议题嵌入 NUS 全校教育。',
        descriptionEn:
          'Concurrently founding Dean of NUS College and Vice Provost (Educational Innovation) at NUS — embeds AI governance into university-wide education.',
        sourceUrl: 'https://law.nus.edu.sg/people/simon-chesterman/',
      },
      {
        title: '"Silicon Sovereigns" 国际法学论文（2026）',
        titleEn: '"Silicon Sovereigns" international law paper (2026)',
        description:
          '"Silicon Sovereigns: AI, International Law, and the Tech-Industrial Complex" 发表于 American Journal of International Law 2026 第 120 卷。',
        descriptionEn:
          "'Silicon Sovereigns: Artificial Intelligence, International Law, and the Tech-Industrial Complex' in the American Journal of International Law 2026 (vol 120, issue 1, p44).",
        since: '2026',
        sourceUrl: 'https://simonchesterman.com/',
      },
    ],
    speakingRecord: [
      {
        event: 'AISG AI Research Symposium 2025 — Governing AI Agents',
        eventEn: 'AISG AI Research Symposium 2025 — Governing AI Agents',
        role: 'Moderator',
        roleEn: 'Moderator',
        date: '2025',
        sourceUrl: 'https://aisingapore.org/ai-governance/aisg-ai-research-symposium-2025-governing-ai-agents/',
      },
      {
        event: 'ITU AI for Good',
        eventEn: 'ITU AI for Good',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2024',
        sourceUrl: 'https://aiforgood.itu.int/speaker/simon-chesterman/',
      },
    ],
    externalRoles: [
      {
        role: 'Editor',
        roleEn: 'Editor',
        organization: 'Asian Journal of International Law',
        organizationEn: 'Asian Journal of International Law',
        sourceUrl: 'https://law.nus.edu.sg/people/simon-chesterman/',
      },
      {
        role: 'Leadership Council',
        roleEn: 'Leadership Council',
        organization: 'World Justice Project',
        organizationEn: 'World Justice Project',
        sourceUrl: 'https://worldjusticeproject.org/about-us/who-we-are/leadership-council/simon_chesterman',
      },
    ],
  },
  {
    id: 'bryan-low',
    name: 'Bryan Kian Hsiang Low',
    zhName: '刘建祥',
    aliases: ['Bryan Low', 'A/Prof Bryan Low', 'Bryan Kian Hsiang Low'],
    title: 'Director, AI Research, AI Singapore; Associate VP (AI), NUS',
    zhTitle: 'AI Singapore AI 研究总监 / NUS AI 副校长',
    category: 'academic',
    roles: ['academic', 'researcher'],
    affiliations: ['AISG', 'NUS'],
    party: null,
    summary: 'AISG 基础研究负责人，研究方向为数据中心 AI、贝叶斯优化、联邦学习与 LLM。CMU 电子与计算机工程博士。',
    summaryEn:
      "Heads AISG's foundational research, focused on data-centric AI, Bayesian optimization, federated learning, and LLMs. PhD in Electrical and Computer Engineering from Carnegie Mellon.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/bryanklow',
        primary: true,
      },
      { platform: 'twitter', url: 'https://x.com/bryanklow', label: '@bryanklow' },
      {
        platform: 'website',
        url: 'https://www.comp.nus.edu.sg/cs/people/lowkh/',
        label: 'NUS 官方档案',
        labelEn: 'NUS faculty profile',
      },
    ],
    signatureWork: [
      {
        title: 'AISG 基础研究方向',
        titleEn: 'AISG Foundational Research direction',
        description: '作为 AISG AI 研究总监，负责基础研究板块；同时是 NUS AI 副校长，统筹大学层面的 AI 研究战略。',
        descriptionEn:
          'As Director of AI Research at AISG, leads the foundational research pillar; concurrently NUS Associate Vice President (AI), steering university-level AI research strategy.',
        sourceUrl: 'https://aisingapore.org/home/the-team/',
      },
      {
        title: 'GLOW.AI 研究小组',
        titleEn: 'GLOW.AI research group',
        description:
          'NUS 研究小组，方向为数据中心 AI、协作 AI、自动化 AI 与 AI for Science，应用于大语言模型与多模态模型。',
        descriptionEn:
          'NUS research group focused on data-centric AI, collaborative AI, automated AI, and AI for Science — applied to LLMs and multimodal models.',
        sourceUrl: 'https://www.comp.nus.edu.sg/cs/people/lowkh/',
      },
      {
        title: 'NUS AI 加速硕士项目',
        titleEn: "NUS Accelerated Master's in AI",
        description: '为新加坡本科生提供早期 AI 研究接触的加速硕士项目，由 Bryan 主导设计与运行。',
        descriptionEn:
          "Accelerated Master's programme in AI giving Singaporean undergraduates early research exposure; designed and run by Bryan.",
        sourceUrl: 'https://www.comp.nus.edu.sg/cs/people/lowkh/',
      },
    ],
  },
  {
    id: 'ng-see-kiong',
    name: 'Ng See Kiong',
    zhName: '黄思琼',
    aliases: ['Prof Ng See Kiong', 'See-Kiong Ng', 'Professor Ng See Kiong'],
    title: 'Director, AI Technology, AI Singapore; Director of Translational Research, NUS Institute of Data Science',
    zhTitle: 'AI Singapore AI 技术总监 / NUS 数据科学研究院转化研究总监',
    category: 'academic',
    roles: ['academic', 'researcher'],
    affiliations: ['AISG', 'NUS', 'A*STAR'],
    party: null,
    summary:
      'AISG 技术方向负责人，前 A*STAR I2R 数据分析部创始负责人。CMU 计算机博士，研究方向为城市 AI 与大规模社会系统建模。',
    summaryEn:
      "Heads AISG's technology direction; founding head of the Data Analytics Department at A*STAR's I2R prior to NUS. CMU CS PhD; research focus on urban AI and large-scale societal modelling.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/seekiong/',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.comp.nus.edu.sg/cs/people/ngsk/',
        label: 'NUS 官方档案',
        labelEn: 'NUS faculty profile',
      },
    ],
    signatureWork: [
      {
        title: 'AISG AI 技术方向',
        titleEn: 'AISG AI Technology direction',
        description:
          '作为 AISG AI 技术总监，统筹应用 AI 与产业接口；前 A*STAR I2R 数据分析部创始负责人，前 A*STAR Urban Systems Initiative 项目总监。',
        descriptionEn:
          "As AISG's Director of AI Technology, oversees applied AI and industry interfaces; previously founding head of the Data Analytics Department at A*STAR I2R and Programme Director of A*STAR's Urban Systems Initiative.",
        sourceUrl: 'https://aisingapore.org/home/the-team/',
      },
      {
        title: 'NUS 数据科学研究院 转化研究',
        titleEn: 'NUS Institute of Data Science — Translational Research',
        description: '担任 NUS 数据科学研究院转化研究总监，把学术成果导向产业落地。',
        descriptionEn:
          'Director of Translational Research at the NUS Institute of Data Science — channels academic output into industry deployment.',
        sourceUrl: 'https://www.comp.nus.edu.sg/cs/people/ngsk/',
      },
    ],
    externalRoles: [
      {
        role: '联合导师',
        roleEn: 'Co-Supervisor',
        organization: 'AISG PhD Fellowship Programme',
        organizationEn: 'AISG PhD Fellowship Programme',
        sourceUrl: 'https://aisingapore.org/research/phd-fellowship-programme/',
      },
    ],
  },
  // ── A*STAR leadership ──────────────────────────────────────────────
  {
    id: 'beh-kian-teik',
    name: 'Beh Kian Teik',
    zhName: '马建德',
    aliases: ['Mr Beh Kian Teik', 'Kian Teik Beh'],
    title: 'CEO, A*STAR',
    zhTitle: 'A*STAR 首席执行官',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['A*STAR'],
    party: null,
    summary:
      '2024 年 11 月接替 Frederick Chew 出任 A*STAR CEO。前 NRF（国家研究基金会）CEO（2022-08 至 2024-10），主导新加坡公共研发资源调度。',
    summaryEn:
      'Took over as A*STAR CEO from Frederick Chew in November 2024. Previously CEO of the National Research Foundation (NRF) Singapore (Aug 2022 – Oct 2024), where he steered the allocation of national R&D resources.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/kian-teik-beh-96459556/',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.a-star.edu.sg/about/corporate-profile/people/beh-kian-teik',
        label: 'A*STAR 官方档案',
        labelEn: 'A*STAR official profile',
      },
    ],
    signatureWork: [
      {
        title: 'A*STAR 战略与 RIE2030',
        titleEn: 'A*STAR strategy & RIE2030 alignment',
        description: '统领 A*STAR 4,100+ 研究人员，把研究方向对齐 RIE2030 国家研究规划，强调"从发现到部署"的实战导向。',
        descriptionEn:
          "Leads 4,100+ A*STAR researchers; aligns the research portfolio with the RIE2030 national plan, with a 'discovery-to-deployment' applied bias.",
        since: '2024-11',
        sourceUrl: 'https://research.a-star.edu.sg/articles/features/a-culture-that-dares/',
      },
      {
        title: 'NRF（国家研究基金会）2022–2024',
        titleEn: 'National Research Foundation (NRF) 2022–2024',
        description: '在出任 A*STAR CEO 前担任 NRF CEO，主导 RIE 2025 计划目标与优先级的成形。',
        descriptionEn: 'Before A*STAR, served as NRF CEO and shaped the goals and priorities of the RIE 2025 plan.',
        since: '2022-08',
        sourceUrl:
          'https://pharmaboardroom.com/interviews/beh-kian-teik-deputy-ceo-national-research-foundation-nrf-singapore/',
      },
    ],
    notableQuotes: [
      {
        quote:
          'A*STAR is shaping a culture that DARES — Defining bold ambitions; being Agile; Reaching outward to solve Real-world challenges; and Experimenting with curiosity.',
        quoteZh: 'A*STAR 在培养 DARES 文化——大胆定义野心、保持敏捷、向外触及真实世界问题、用好奇心做实验。',
        context: 'A*STAR @ SG60 专题',
        contextEn: 'A*STAR @ SG60 feature',
        date: '2025',
        sourceUrl: 'https://research.a-star.edu.sg/articles/features/a-culture-that-dares/',
      },
    ],
  },
  {
    id: 'andy-hor',
    name: 'Andy Hor',
    zhName: '何天伦',
    aliases: ['Prof Andy Hor', 'Professor Andy Hor', 'Andy T S Hor'],
    title: 'Deputy CEO (Research), A*STAR',
    zhTitle: 'A*STAR 副执行长（研究）',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['A*STAR', 'NUS'],
    party: null,
    summary:
      '2020 年从香港大学副校长任上回新加坡接任 A*STAR 副执行长（研究）。化学家出身，主管 A*STAR 全院科研战略与质量框架。',
    summaryEn:
      "Returned to Singapore in 2020 from his role as Vice President (Research) at the University of Hong Kong to become A*STAR's Deputy CEO (Research). Chemist by training; oversees A*STAR-wide research strategy and quality.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/andyhor',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.a-star.edu.sg/about/corporate-profile/people/andy-hor',
        label: 'A*STAR 官方档案',
        labelEn: 'A*STAR official profile',
      },
    ],
    signatureWork: [
      {
        title: 'A*STAR 全院科研战略',
        titleEn: 'A*STAR institution-wide research strategy',
        description:
          '作为 A*STAR 副执行长（研究），主管科研战略、investigator-led 研究支持、质量与影响评估框架及科研政策。',
        descriptionEn:
          'As Deputy CEO (Research), oversees research strategy, investigator-led research support, the quality/impact framework, and research policy across A*STAR.',
        sourceUrl: 'https://www.a-star.edu.sg/about/corporate-profile/people/andy-hor',
      },
    ],
  },
  {
    id: 'lim-keng-hui',
    name: 'Lim Keng Hui',
    zhName: '林敬辉',
    aliases: ['Prof Lim Keng Hui', 'Professor Lim Keng Hui'],
    title: 'Assistant CEO, Science & Engineering Research Council, A*STAR',
    zhTitle: 'A*STAR 科学与工程研究理事会助理执行长',
    category: 'academic',
    roles: ['academic', 'researcher', 'executive'],
    affiliations: ['A*STAR'],
    party: null,
    summary:
      '主管 A*STAR 工程与信息科学方向研究的助理 CEO，监管 2500+ 名研究员；主导 I2R、IHPC 等 AI 相关研究院所的方向。',
    summaryEn:
      "ACE for A*STAR's Science & Engineering Research Council, overseeing 2,500+ scientists and engineers. Sets direction for AI-relevant institutes including I2R and IHPC.",
    channels: [
      {
        platform: 'website',
        url: 'https://www.a-star.edu.sg/about/corporate-profile/people/prof-lim-keng-hui',
        label: 'A*STAR 官方档案',
        labelEn: 'A*STAR official profile',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: '制造业 AI 卓越中心（AIMfg）',
        titleEn: 'Sectoral AI Centre of Excellence for Manufacturing (AIMfg)',
        description:
          '2024 年新加坡启动的制造业 AI 卓越中心，由 Lim 主管的 SERC 推动，已扩展到精密工程、电子和生物医药制造的 SME 协同创新项目。',
        descriptionEn:
          "Sectoral AI Centre of Excellence for Manufacturing launched by Singapore in 2024 under Lim's SERC; has scaled co-innovation projects with SMEs in precision engineering, electronics and biomedical manufacturing.",
        since: '2024',
        sourceUrl:
          'https://www.edb.gov.sg/en/about-edb/media-releases-publications/new-ai-centre-of-excellence-to-drive-innovation-in-manufacturing.html',
      },
      {
        title: 'A*STAR × SIA / SIAEC 智能维护合作',
        titleEn: 'A*STAR × SIA / SIAEC AI maintenance partnership',
        description:
          '与新加坡航空与 SIAEC 合作的第二阶段联合实验室，开发 AI 驱动的航司价值链运维方案；由 SERC 一线推动。',
        descriptionEn:
          "Phase 2 joint labs with Singapore Airlines and SIAEC developing AI-driven solutions for airline value-chain operations; driven by Lim's SERC.",
        since: '2025',
        sourceUrl: 'https://asianaviation.com/astar-sia-siaec-sign-deals-for-cabins-ai/',
      },
      {
        title: 'A*STAR IHPC（前任执行长）',
        titleEn: 'A*STAR IHPC (former Executive Director)',
        description: '前 A*STAR 高性能计算研究院（IHPC）执行长，主导 AI、计算建模与仿真方向的研究院级落地。',
        descriptionEn:
          "Former Executive Director of A*STAR's Institute of High Performance Computing (IHPC) — drove the institute's AI, computational modelling and simulation impact.",
        sourceUrl: 'https://www.a-star.edu.sg/about/corporate-profile/people/prof-lim-keng-hui',
      },
    ],
  },
  {
    id: 'ivor-tsang',
    name: 'Ivor Tsang',
    zhName: '曾以友',
    aliases: ['Prof Ivor Tsang', 'Ivor W. Tsang', 'Professor Ivor Tsang'],
    title: 'Director, Centre for Frontier AI Research (CFAR), A*STAR',
    zhTitle: 'A*STAR 前沿 AI 研究中心（CFAR）主任',
    category: 'academic',
    roles: ['academic', 'researcher'],
    affiliations: ['A*STAR'],
    party: null,
    summary: 'CFAR 主任，领导新加坡国家级前沿 AI 研究中心。研究方向覆盖大模型、可信 AI、迁移学习；IEEE Fellow。',
    summaryEn:
      "Director of A*STAR's CFAR, the national centre for frontier AI research. Research spans large models, trustworthy AI, and transfer learning; IEEE Fellow.",
    channels: [
      {
        platform: 'website',
        url: 'https://scholar.google.com/citations?user=rJMOlVsAAAAJ',
        label: 'Google Scholar',
        labelEn: 'Google Scholar',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'A*STAR CFAR 前沿 AI 研究中心',
        titleEn: 'A*STAR Centre for Frontier AI Research (CFAR)',
        description:
          '自 2022-01 起任 CFAR 主任，覆盖 Sustainable AI、Resilient & Safe AI、AGI 三个方向；2025 年 CFAR 论文连中 IJCAI、ICCV、AAMAS、AI 4 X、KDD。',
        descriptionEn:
          'Director of CFAR since January 2022, spanning Sustainable AI, Resilient & Safe AI, and AGI; CFAR papers in 2025 hit IJCAI, ICCV, AAMAS, AI 4 X, and KDD.',
        since: '2022-01',
        sourceUrl: 'https://www.a-star.edu.sg/cfar/about-cfar/management/prof-ivor-tsang',
      },
    ],
    externalRoles: [
      {
        role: 'IEEE Fellow',
        roleEn: 'IEEE Fellow',
        organization: 'IEEE',
        organizationEn: 'IEEE',
        sourceUrl: 'https://www.a-star.edu.sg/cfar/news/news/features/ieee-fellow',
      },
      {
        role: '首届 A*STAR AI Fellow',
        roleEn: 'Inaugural A*STAR AI Fellow',
        organization: 'A*STAR',
        organizationEn: 'A*STAR',
        sourceUrl: 'https://www.a-star.edu.sg/cfar/about-cfar/management/prof-ivor-tsang',
      },
    ],
  },
  {
    id: 'ong-yew-soon',
    name: 'Ong Yew Soon',
    zhName: '王悦舜',
    aliases: ['Prof Ong Yew Soon', 'Yew-Soon Ong', 'Professor Ong Yew Soon'],
    title: "Chief AI Scientist, A*STAR CFAR; President's Chair Professor, NTU",
    zhTitle: 'A*STAR CFAR 首席 AI 科学家 / NTU 校长讲席教授',
    category: 'academic',
    roles: ['academic', 'researcher'],
    affiliations: ['A*STAR', 'NTU'],
    party: null,
    summary:
      'CFAR 首席 AI 科学家与顾问，同时是 NTU CCDS 校长讲席教授。前 NTU 数据科学与 AI 研究中心（DSAIR）主任，新加坡进化计算与元学习领域代表学者。',
    summaryEn:
      "Chief AI Scientist and Advisor at A*STAR CFAR; concurrently President's Chair Professor at NTU's College of Computing and Data Science. Former Director of NTU's DSAIR; a leading Singapore researcher in evolutionary computation and meta-learning.",
    channels: [
      {
        platform: 'website',
        url: 'https://personal.ntu.edu.sg/asysong/home.html',
        label: 'NTU 个人主页',
        labelEn: 'NTU personal page',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.a-star.edu.sg/cfar/about-cfar/management/prof-ong-yew-soon',
        label: 'CFAR 官方档案',
        labelEn: 'CFAR official profile',
      },
    ],
    signatureWork: [
      {
        title: 'A*STAR 首席 AI 科学家',
        titleEn: "A*STAR's Chief AI Scientist",
        description:
          '在 A*STAR 首席 AI 科学家职责上塑造国家 AI 研究方向，是 CFAR 创立的关键推手；2025 入选 Clarivate 高被引研究员（跨领域）。',
        descriptionEn:
          "As A*STAR's Chief AI Scientist, shapes national AI research direction; key force behind establishing CFAR. Named to Clarivate's 2025 Highly Cited Researchers (Cross-Field).",
        sourceUrl:
          'https://www.a-star.edu.sg/cfar/news/news/features/clarivate%27s-list-of-highly-cited-researchers-2025',
      },
    ],
    externalRoles: [
      {
        role: 'Clarivate 高被引研究员（跨领域）',
        roleEn: 'Clarivate Highly Cited Researcher (Cross-Field)',
        organization: 'Clarivate',
        organizationEn: 'Clarivate',
        since: '2025',
        sourceUrl:
          'https://www.a-star.edu.sg/cfar/news/news/features/clarivate%27s-list-of-highly-cited-researchers-2025',
      },
    ],
  },
  // ── NUS leadership ────────────────────────────────────────────────
  {
    id: 'tan-eng-chye',
    name: 'Tan Eng Chye',
    zhName: '陈永财',
    aliases: ['Prof Tan Eng Chye', 'Professor Tan Eng Chye'],
    title: 'President, NUS',
    zhTitle: 'NUS 校长',
    category: 'academic',
    roles: ['academic', 'executive'],
    affiliations: ['NUS'],
    party: null,
    summary:
      'NUS 第五任校长（2018 至今），数学家出身，曾任 NUS 教务长（Provost）。在他任期内 NUS 把 AI 嵌入全校战略并设立 NUS AI Institute。',
    summaryEn:
      'Fifth President of NUS (2018–present); a mathematician who previously served as Provost. Under his tenure NUS embedded AI into the university-wide strategy and launched the NUS AI Institute.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/eng-chye-tan-248895289',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://nus.edu.sg/president/biography',
        label: 'NUS 校长档案',
        labelEn: 'NUS President biography',
      },
    ],
    signatureWork: [
      {
        title: 'NUS × Microsoft Research Asia 合作',
        titleEn: 'NUS × Microsoft Research Asia partnership',
        description: '2025 与微软亚洲研究院签署的 AI 与计算深度合作，覆盖医疗 AI、社会 AI、空间智能与数据密集型计算。',
        descriptionEn:
          'Deep AI/computing partnership with Microsoft Research Asia signed in 2025, covering healthcare AI, societal AI, spatial intelligence, and data-intensive computing.',
        since: '2025',
        sourceUrl: 'https://www.miragenews.com/nus-microsoft-asia-unite-to-boost-ai-research-1437144/',
      },
      {
        title: 'NUS × Google 联合研发中心',
        titleEn: 'NUS × Google joint R&D centre',
        description: '2025-08 在 NUS 计算学院 50 周年时签署的战略合作协议，建立联合研发与创新中心。',
        descriptionEn:
          "Strategic agreement signed in August 2025 at NUS School of Computing's 50th anniversary, establishing a joint R&D and innovation centre.",
        since: '2025-08',
        sourceUrl:
          'https://www.biospectrumasia.com/news/54/26449/new-google-nus-partnership-to-advance-applied-ai-research-and-talent-development-in-singapore.html',
      },
      {
        title: 'IBM-NUS 研究与创新中心 + 量子网络',
        titleEn: 'IBM-NUS Research & Innovation Centre + Quantum Network',
        description: '联合 IBM 与清迈大学等国际伙伴，推动 AI 与量子科学开放协作，覆盖气候、灾害管理等议题。',
        descriptionEn:
          'Open-collaboration AI and quantum science effort with IBM, Chiang Mai University and other international partners, spanning climate and disaster management.',
        since: '2025',
        sourceUrl:
          'https://www.findworldedu.com/2025/chiang-mai-university-plans-to-join-ibm-nus-research-and-innovation-centre-and-ibm-quantum-network.html',
      },
    ],
  },
  {
    id: 'aaron-thean',
    name: 'Aaron Thean',
    zhName: '陈奋耀',
    aliases: ['Prof Aaron Thean', 'Aaron Voon-Yew Thean', 'Professor Aaron Thean'],
    title: 'Deputy President (Academic Affairs) and Provost, NUS',
    zhTitle: 'NUS 副校长（学术）兼教务长',
    category: 'academic',
    roles: ['academic', 'executive', 'researcher'],
    affiliations: ['NUS'],
    party: null,
    summary:
      'NUS 教务长（2023 起），半导体器件领域 IEEE Fellow，前 IMEC 副总裁。前 NUS 设计与工程学院创院院长，主管 NUS 学术战略。',
    summaryEn:
      'Provost of NUS since 2023; IEEE Fellow in semiconductor device technologies and former Vice President at IMEC. Founding Dean of NUS College of Design and Engineering; oversees NUS-wide academic strategy.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/aaron-voon-yew-thean-41256519',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.nus.edu.sg/about/management/aaron-thean',
        label: 'NUS 官方档案',
        labelEn: 'NUS official profile',
      },
    ],
    signatureWork: [
      {
        title: 'NUS SHINE 微电子研究中心',
        titleEn: 'NUS SHINE microelectronics centre',
        description:
          '同时担任国家研究基金会下一代微电子研究设施 SHINE 主任，以及 A*STAR SIMTech-NUS 大面积柔性混合电子联合实验室主任。',
        descriptionEn:
          'Concurrently Director of the NRF SHINE next-generation microelectronics facility and the A*STAR SIMTech-NUS Joint Lab for Large-Area Flexible Hybrid Electronics.',
        sourceUrl: 'https://www.nus.edu.sg/about/management/aaron-thean',
      },
      {
        title: '半导体 × Edge AI 研究方向',
        titleEn: 'Semiconductor × Edge-AI research',
        description:
          '研究方向围绕材料创新（铁电氧化物、二维材料）与器件结构（新型存储布局、单片 3D IC）协同设计，加速 edge-AI 内存计算。',
        descriptionEn:
          'Research focus on co-design of materials innovations (ferroelectric oxides, 2D materials) and device-architecture innovations (new memory layouts, monolithic 3D IC) to accelerate in-memory computation for edge-AI.',
        sourceUrl:
          'https://ee.stanford.edu/event/06-10-2024/towards-chips-rewire-themselves-how-novel-material-system-co-design-can-enable',
      },
    ],
  },
  // ── SMU leadership ────────────────────────────────────────────────
  {
    id: 'lily-kong',
    name: 'Lily Kong',
    zhName: '江莉莉',
    aliases: ['Prof Lily Kong', 'Professor Lily Kong'],
    title: 'President, SMU',
    zhTitle: 'SMU 校长',
    category: 'academic',
    roles: ['academic', 'executive', 'researcher'],
    affiliations: ['SMU'],
    party: null,
    summary:
      'SMU 第五任校长（2019 起），新加坡首位本土女性大学校长。带领 SMU 完成数字化转型战略，把 AI 与可持续发展嵌入课程体系。',
    summaryEn:
      "Fifth President of SMU (since 2019) and the first Singapore-born woman to lead a Singapore university. Drives SMU's digital transformation strategy and embeds AI and sustainability into the curriculum.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/lily-kong-3a422b164',
        primary: true,
      },
      {
        platform: 'website',
        url: 'https://www.smu.edu.sg/about/smu-leadership/president-profile',
        label: 'SMU 校长档案',
        labelEn: 'SMU President profile',
      },
    ],
    signatureWork: [
      {
        title: 'SMU "Universities Reinvented" 转型',
        titleEn: 'SMU "Universities Reinvented" transformation',
        description: '2025-08 由 Lily Kong 启动的 SMU 全面再设计议程；同年 SMU 入选 QS 学科排名"全球进步最快大学"。',
        descriptionEn:
          "Launched by Lily Kong in August 2025; SMU was named the World's Most Improved University in QS World University Rankings by Subject 2026 in the same period.",
        since: '2025-08',
        sourceUrl:
          'https://news.smu.edu.sg/news/2025/08/12/smu-president-prof-lily-kong-launches-universities-reinvented',
      },
      {
        title: 'SMU 国际顾问理事会 AI 议题',
        titleEn: 'SMU International Advisory Council AI agenda',
        description: '主持 SMU 国际顾问理事会圆桌，讨论大学如何回应 AI 对工作与学习的颠覆。',
        descriptionEn:
          "Chairs the SMU International Advisory Council roundtable on how universities must respond to AI's disruption of work and learning.",
        sourceUrl:
          'https://www.nordangliaeducation.com/insights/2025/articles/in-conversation-with-professor-lily-kong-rethinking-learning-in-an-ai-driven-world',
      },
    ],
    speakingRecord: [
      {
        event: '"Rethinking Learning in an AI-Driven World" 对话',
        eventEn: 'In Conversation: Rethinking Learning in an AI-Driven World',
        role: '受访人',
        roleEn: 'Featured guest',
        date: '2025-05',
        sourceUrl:
          'https://www.nordangliaeducation.com/insights/2025/articles/in-conversation-with-professor-lily-kong-rethinking-learning-in-an-ai-driven-world',
      },
    ],
  },
  // ── IMDA leadership ───────────────────────────────────────────────
  {
    id: 'ng-cher-pong',
    name: 'Ng Cher Pong',
    zhName: '黄志彭',
    aliases: ['Mr Ng Cher Pong', 'Cher Pong Ng'],
    title: 'CEO, IMDA; Commissioner, PDPC',
    zhTitle: 'IMDA 首席执行官 / PDPC 数据保护委员',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['IMDA', 'MDDI'],
    party: null,
    summary:
      '2025 年 11 月起接任 IMDA CEO，同时兼任 PDPC（个人数据保护委员会）委员。30+ 年公务员资历，前 NLB CEO、SkillsFuture Singapore 创始 CEO。',
    summaryEn:
      'Took over as IMDA CEO from November 2025; concurrently Commissioner of the PDPC. 30+ years of public service; former CEO of National Library Board and founding CEO of SkillsFuture Singapore.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/cher-pong-ng-b945aba2/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'IMDA CEO（2025-11 起）',
        titleEn: 'IMDA CEO (from November 2025)',
        description: '2025-10 任 CEO（指定）、11 月正式接任，统领 IMDA 数字经济、AI 治理、5G/6G、信任技术战略。',
        descriptionEn:
          'CEO (Designate) from October 2025; took over fully in November, steering IMDA across digital economy, AI governance, 5G/6G and trust technologies.',
        since: '2025-11',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/new-chief-executive-appointments-in-the-infocomm-media-development--authority-and-the-national-library-and-archives-board/',
      },
      {
        title: 'SkillsFuture Singapore 创始 CEO',
        titleEn: 'SkillsFuture Singapore founding CEO',
        description:
          '2016–2019 担任 SSG 首任 CEO，推动 SkillsFuture Credit、MySkillsFuture、SkillsFuture Series 等核心终身学习项目落地。',
        descriptionEn:
          "Founding CEO of SkillsFuture Singapore (2016–2019); shipped SkillsFuture Credit, MySkillsFuture and the SkillsFuture Series — Singapore's core lifelong-learning programmes.",
        since: '2016',
        sourceUrl: 'https://govinsider.asia/intl-en/article/lifelong-learning-skillsfuture-singapore-ceo-ng-cher-pong',
      },
    ],
    externalRoles: [
      {
        role: 'PDPC 数据保护委员',
        roleEn: 'Commissioner, PDPC',
        organization: 'Personal Data Protection Commission',
        organizationEn: 'Personal Data Protection Commission',
        since: '2025-11',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/new-chief-executive-appointments-in-the-infocomm-media-development--authority-and-the-national-library-and-archives-board/',
      },
    ],
  },
  {
    id: 'aileen-chia',
    name: 'Aileen Chia',
    zhName: '谢美琳',
    aliases: ['Ms Aileen Chia'],
    title: 'Deputy Chief Executive (Connectivity Development & Regulation), IMDA',
    zhTitle: 'IMDA 副执行长（连接发展与监管）',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['IMDA'],
    party: null,
    summary: 'IMDA 副执行长，主管电信、邮政、连接基础设施与监管，同时是 POFMA 办公室副执行总监。',
    summaryEn:
      'Deputy Chief Executive overseeing telecoms, postal, connectivity infrastructure and regulation at IMDA; concurrently Deputy Executive Director of the POFMA Office.',
    channels: [],
  },
  {
    id: 'kiren-kumar',
    name: 'Kiren Kumar',
    zhName: '基伦·库马尔',
    aliases: ['Mr Kiren Kumar'],
    title: 'Deputy Chief Executive (Development), IMDA',
    zhTitle: 'IMDA 副执行长（发展）',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['IMDA'],
    party: null,
    summary: 'IMDA 副执行长（发展），主管数字经济和媒体产业发展，包括 AI、5G、数据中心等领域的产业政策。',
    summaryEn:
      'Deputy Chief Executive (Development) at IMDA, overseeing digital economy and media industry development including industry policy for AI, 5G, and data centres.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/kiren-kumar-2478494/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'IMDA Digital Industry & Talent Group',
        titleEn: 'IMDA Digital Industry & Talent Group',
        description:
          '主管 IMDA 数字经济与媒体产业发展，包括 AI、5G、数据中心方向的产业政策，以及与产业的合作伙伴关系。',
        descriptionEn:
          "Heads IMDA's Digital Industry & Talent group — industry policy and partnerships across AI, 5G, data centres, and digital economy growth.",
        since: '2021-01',
        sourceUrl:
          'https://www.imda.gov.sg/about-imda/who-we-are/our-team/our-senior-management/digital-industry-and-talent',
      },
      {
        title: 'TeSA AI 双语人才计划',
        titleEn: 'TeSA AI-bilingual talent programme',
        description:
          '通过 TeSA（Tech Skills Accelerator）培养 AI 双语、未来就绪的工程师队伍，是 IMDA 主推的 AI 人才管线。',
        descriptionEn:
          "TeSA (Tech Skills Accelerator) builds an AI-bilingual, future-ready workforce — IMDA's headline AI talent pipeline.",
        sourceUrl:
          'https://www.imda.gov.sg/resources/blog/blog-articles/2026/01/how-upskilling-talent-powers-ai-transformation',
      },
    ],
    notableQuotes: [
      {
        quote:
          'These partnerships are critical in developing tech talent and accelerating the deployment of trusted AI solutions that businesses and consumers can use with confidence.',
        quoteZh: '这些合作对培养技术人才、加速可信 AI 方案落地至关重要——让企业和消费者用得放心。',
        context: 'Temus 战略合作公告，IMDA 一侧表态',
        contextEn: "Temus strategic partnership announcement, IMDA's stated position",
        date: '2024',
        sourceUrl: 'https://temus.com/press-releases/strategic-partnerships-public-sector-day/',
      },
    ],
  },
  {
    id: 'denise-wong',
    name: 'Denise Wong',
    zhName: '王玉玲',
    aliases: ['Ms Denise Wong'],
    title: 'Assistant Chief Executive (Data Innovation & Protection), IMDA; Deputy Commissioner, PDPC',
    zhTitle: 'IMDA 助理执行长（数据创新与保护）/ PDPC 副委员',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['IMDA'],
    party: null,
    summary: '主管新加坡个人数据保护与数据创新的核心官员；2025 年起担任 PDPC 代理委员，处理欧盟–新加坡数据保护对话。',
    summaryEn:
      "The official in charge of Singapore's data protection and data innovation portfolio; Acting Commissioner of PDPC since 2025, handling EU–Singapore data protection dialogues.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/denise-wong-659640228/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: '新加坡 Model AI Governance Framework',
        titleEn: 'Singapore Model AI Governance Framework',
        description:
          '主管新加坡国家 AI 治理框架与 AI Verify 测试工具集；2025-06-02 起把 Global Cross-Border Privacy Rules（CBPR）认证正式落地。',
        descriptionEn:
          "Owns Singapore's Model AI Governance Framework and AI Verify testing toolkit; operationalised the Global Cross-Border Privacy Rules (CBPR) Certification from 2 June 2025.",
        sourceUrl: 'https://oecd.ai/en/community/denise-wong',
      },
      {
        title: 'PDPC（个人数据保护委员会）副委员',
        titleEn: 'Deputy Commissioner, PDPC',
        description: '兼任 PDPC 副委员，负责 PDPA（《个人数据保护法》）的执行与对外口径。',
        descriptionEn:
          'Concurrent Deputy Commissioner of the PDPC, overseeing enforcement of the Personal Data Protection Act (2012) and external positioning.',
        sourceUrl:
          'https://govinsider.asia/intl-en/article/denise-wong-assistant-chief-executive-and-deputy-commissioner-of-pdpc-strategic-policy-and-operations-imda',
      },
    ],
    notableQuotes: [
      {
        quote:
          'The future of AI is about ensuring that as we advance technologically, everyone benefits — Singapore wants to build a future where AI innovation and trust can flourish together.',
        quoteZh: 'AI 的未来在于：技术向前的同时，所有人都能受益——新加坡要的是 AI 创新与信任并存。',
        context: 'PECC 2025 会议开幕致辞',
        contextEn: 'Opening Remarks, PECC 2025 Conference',
        date: '2025-07-11',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/speeches/2025/denise-wong-opening-data-innovation-protection-group',
      },
    ],
    speakingRecord: [
      {
        event: 'PECC 2025 — Asia-Pacific AI Governance Accelerator',
        eventEn: 'PECC 2025 — Asia-Pacific AI Governance Accelerator',
        role: 'Opening remarks',
        roleEn: 'Opening remarks',
        date: '2025-07-11',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/speeches/2025/denise-wong-opening-data-innovation-protection-group',
      },
      {
        event: 'Stanford US-Asia Tech Management — Singapore AI Governance',
        eventEn: 'Stanford US-Asia Tech Management — Singapore AI Governance',
        role: 'Speaker',
        roleEn: 'Speaker',
        date: '2024',
        sourceUrl:
          'https://asia.stanford.edu/course/topics-in-international-technology-management/the-emerging-digital-economy-in-context-us-asia-cooperation-and-competition/denise-wong-assistant-chief-executive-data-innovation-protection-group-singapore-infocomm-media-development-authority/',
      },
    ],
    externalRoles: [
      {
        role: 'AI 专家社区成员',
        roleEn: 'AI Expert Community member',
        organization: 'OECD.AI',
        organizationEn: 'OECD.AI',
        sourceUrl: 'https://oecd.ai/en/community/denise-wong',
      },
    ],
  },
  {
    id: 'ong-chen-hui',
    name: 'Ong Chen Hui',
    zhName: '王振辉',
    aliases: ['Dr Ong Chen Hui', 'Chen Hui Ong'],
    title: 'Assistant Chief Executive (BizTech), IMDA',
    zhTitle: 'IMDA 助理执行长（企业科技）',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['IMDA'],
    party: null,
    summary: 'IMDA 主管「BizTech」业务的 ACE，主导 AI 企业落地、AI Verify 框架孵化、企业数字化加速器等项目。',
    summaryEn:
      'ACE in charge of BizTech at IMDA; drives AI enterprise adoption, AI Verify framework incubation, and enterprise digital accelerators.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/ong-chenhui',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'AI Verify Foundation',
        titleEn: 'AI Verify Foundation',
        description:
          '新加坡牵头的开源 AI 治理测试框架与全球开源社区，2023-06 由 IMDA 在 Ong Chen Hui 主导下发起，旨在塑造国际 AI 标准。',
        descriptionEn:
          "Singapore-led open-source AI governance testing framework and global community. Launched by IMDA under Ong Chen Hui's lead in June 2023 to shape international AI standards.",
        since: '2023-06',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        title: 'IMDA BizTech 业务群',
        titleEn: 'IMDA BizTech Group',
        description: '统筹 IMDA 在新兴技术（AI、AI 治理、5G、6G 研究、信任技术）方向的产业与研究生态建设。',
        descriptionEn:
          "Oversees IMDA's industry and research ecosystem development across emerging tech — AI, AI governance, 5G, 6G research, and trust technologies.",
        sourceUrl: 'https://www.imda.gov.sg/about-imda/who-we-are/our-team/our-senior-management/biztech',
      },
      {
        title: 'IMDA × SAL LawNet AI 搜索引擎',
        titleEn: 'IMDA × SAL LawNet AI search engine',
        description: '2025-09 与新加坡法律学会合作发布的 AI 法律检索工具，Ong Chen Hui 是 IMDA 一侧的官方代言人。',
        descriptionEn:
          "AI-powered legal search engine launched September 2025 with the Singapore Academy of Law; Ong was IMDA's named spokesperson.",
        since: '2025-09',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2025/imda-and-sal-launched-ai-powered-search-engine-in-lawnet',
      },
    ],
    notableQuotes: [
      {
        quote:
          'Critical to the success of [AI Verify] will be the collective wisdom of the global open-source community.',
        quoteZh: 'AI Verify 能不能成功，关键在全球开源社区的集体智慧。',
        context: 'AI Verify Foundation 启动声明',
        contextEn: 'AI Verify Foundation launch announcement',
        date: '2023-06',
        sourceUrl: 'https://govinsider.asia/intl-en/article/why-singapores-approach-to-ethical-ai-embraces-open-source',
      },
      {
        quote:
          'The demonstrator is a tangible example of how AI can address real-world challenges and elevate the way corporate governance is delivered.',
        quoteZh: '这次演示是一个具体例子——AI 能解决真实世界的问题，并提升企业治理的交付方式。',
        context: 'IMDA × SAL LawNet AI 搜索引擎发布',
        contextEn: 'IMDA × SAL LawNet AI search engine launch',
        date: '2025-09',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2025/imda-and-sal-launched-ai-powered-search-engine-in-lawnet',
      },
    ],
    externalRoles: [
      {
        role: 'AI 专家社区成员',
        roleEn: 'AI Expert Community member',
        organization: 'OECD.AI',
        organizationEn: 'OECD.AI',
        sourceUrl: 'https://oecd.ai/en/community/ong-chen-hui',
      },
    ],
  },
  // ── AI Verify Foundation ──────────────────────────────────────────
  {
    id: 'shameek-kundu',
    name: 'Shameek Kundu',
    zhName: '沙米克·昆杜',
    aliases: ['Mr Shameek Kundu'],
    title: 'Executive Director, AI Verify Foundation',
    zhTitle: 'AI Verify 基金会执行总监',
    category: 'industry',
    roles: ['executive'],
    affiliations: ['IMDA', 'Industry'],
    party: null,
    summary:
      'AI Verify 基金会执行总监，前渣打银行集团首席数据官、TruEra 高管。25 年金融与 AI 经验，参与 GPAI、英国央行 AI 公私合作。',
    summaryEn:
      "Executive Director of AI Verify Foundation; formerly Group CDO at Standard Chartered and an exec at TruEra. 25 years across finance and AI; member of GPAI and the Bank of England's AI Public Private Partnership.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/shameekkundu/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'AI Verify 开源测试生态',
        titleEn: 'AI Verify open-source testing ecosystem',
        description:
          '作为 AI Verify Foundation 执行总监，主导开源 AI 测试工具与 AI assurance provider 生态建设，把 IMDA 的治理框架推向产业落地。',
        descriptionEn:
          "As Executive Director of AI Verify Foundation, builds the open-source AI testing toolset and AI-assurance provider ecosystem — turning IMDA's governance framework into industry deployment.",
        sourceUrl:
          'https://www.tatlerasia.com/power-purpose/innovation/ai-verify-foundation-shameek-kundu-on-building-trust-in-ai-and-why-human-oversight-still-matters',
      },
      {
        title: 'MAS FEAT 责任 AI 准则（联合作者）',
        titleEn: 'MAS FEAT principles on Responsible AI (co-author)',
        description: 'MAS FEAT（Fairness, Ethics, Accountability, Transparency）金融业责任 AI 准则的联合作者之一。',
        descriptionEn:
          "One of the authors of MAS's FEAT (Fairness, Ethics, Accountability, Transparency) principles on Responsible AI for the financial sector.",
        sourceUrl: 'https://oecd.ai/en/community/shameek',
      },
    ],
    externalRoles: [
      {
        role: '联席主席（数据治理工作组）',
        roleEn: 'Co-chair, Data Governance Working Group',
        organization: 'GPAI（全球 AI 伙伴关系）',
        organizationEn: 'Global Partnership on AI (GPAI)',
        sourceUrl: 'https://oecd.ai/en/community/shameek',
      },
      {
        role: '咨询委员',
        roleEn: 'Advisory Council Member',
        organization: '新加坡政府 AI 与数据伦理咨询委员会',
        organizationEn: "Singapore Government's AI and Data Ethics Advisory Council",
        sourceUrl: 'https://oecd.ai/en/community/shameek',
      },
      {
        role: '首席 AI 官（2025-10 起，新职务）',
        roleEn: 'Chief AI Officer (from October 2025, new role)',
        organization: 'Abu Dhabi Commercial Bank',
        organizationEn: 'Abu Dhabi Commercial Bank',
        since: '2025-10',
        sourceUrl:
          'https://www.cdomagazine.tech/leadership-moves/abu-dhabi-commercial-bank-appoints-shameek-kundu-as-chief-ai-officer',
      },
    ],
  },
  // ── MAS leadership ────────────────────────────────────────────────
  {
    id: 'chia-der-jiun',
    name: 'Chia Der Jiun',
    zhName: '谢德俊',
    aliases: ['Mr Chia Der Jiun', 'Der Jiun Chia'],
    title: 'Managing Director, MAS (until 2026-05)',
    zhTitle: 'MAS 总裁（任期至 2026-05）',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['MAS'],
    party: null,
    summary:
      '2024 年 1 月接任 MAS 总裁，任期至 2026-05-31。前 MAS 18 年任职、IMF 东南亚执行董事，主导 MAS 在 AI 和金融科技方向的对外定调。',
    summaryEn:
      "Managing Director of MAS since 1 January 2024 (term ends 31 May 2026). 18 years at MAS prior; former IMF Executive Director for Southeast Asia. Sets MAS's external posture on AI and FinTech.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/der-jiun-chia-41a541139',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'Project MindForge / AI 风险管理工具包',
        titleEn: 'Project MindForge / AI Risk Management Toolkit',
        description:
          'MAS 联合 24 家银行/险企/资本市场机构，2025-11 完成 MindForge 第二阶段，发布金融业 AI 风险管理工具包，覆盖传统 AI、生成式 AI、agentic AI。',
        descriptionEn:
          'MAS-led consortium of 24 banks/insurers/capital-markets firms; phase 2 of Project MindForge wrapped in November 2025 with the AI Risk Management Toolkit for finance — covering traditional AI, generative AI, and agentic AI.',
        since: '2025-11',
        sourceUrl:
          'https://www.mas.gov.sg/news/media-releases/2026/mas-partners-industry-to-develop-ai-risk-management-toolkit-for-the-financial-sector',
      },
      {
        title: 'BuildFin.ai 平台',
        titleEn: 'BuildFin.ai platform',
        description: 'SFF 2025 上由 Chia 宣布的新平台，撮合科技供应商、研究机构和金融机构联合攻关复杂金融问题。',
        descriptionEn:
          'Announced by Chia at SFF 2025: a new platform connecting tech providers, research institutes and financial institutions to tackle complex financial problems together.',
        since: '2025-11',
        sourceUrl:
          'https://mondovisione.com/media-and-resources/news/creating-the-future-of-finance-a-journey-of-innovation-and-collaboration-re-20251113/',
      },
      {
        title: '10 年 AI + 代币化金融路线图',
        titleEn: '10-year AI + tokenised-finance roadmap',
        description: 'SFF 2025 主旨发言中提出的两条 10 年路线：(1) 推动负责任 AI 采用、(2) 建设代币化金融未来。',
        descriptionEn:
          'Two 10-year themes laid out in his SFF 2025 keynote: (1) responsible AI adoption and (2) building a tokenised-finance future.',
        since: '2025-11',
        sourceUrl:
          'https://www.asiabiztoday.com/2025/11/13/mas-outlines-10-year-roadmap-for-ai-and-tokenised-finance-at-sff-2025/',
      },
    ],
    notableQuotes: [
      {
        quote: 'Agentic autonomy must come with sufficient guardrails.',
        quoteZh: 'Agent 的自主性必须配套足够的护栏。',
        context: 'SFF 2025 主旨发言',
        contextEn: 'SFF 2025 keynote',
        date: '2025-11-13',
        sourceUrl:
          'https://mondovisione.com/media-and-resources/news/creating-the-future-of-finance-a-journey-of-innovation-and-collaboration-re-20251113/',
      },
      {
        quote:
          'This tokenised future cannot be built by a single party. It will require collaboration between private and public sectors, within and across jurisdictions.',
        quoteZh: '代币化的未来不可能靠一方建成——需要公私部门、跨辖区的协作。',
        context: 'SFF 2025 主旨发言',
        contextEn: 'SFF 2025 keynote',
        date: '2025-11-13',
        sourceUrl:
          'https://mondovisione.com/media-and-resources/news/creating-the-future-of-finance-a-journey-of-innovation-and-collaboration-re-20251113/',
      },
    ],
    speakingRecord: [
      {
        event: 'Singapore FinTech Festival 2025',
        eventEn: 'Singapore FinTech Festival 2025',
        role: '主旨发言',
        roleEn: 'Keynote',
        date: '2025-11-13',
        sourceUrl:
          'https://mondovisione.com/media-and-resources/news/creating-the-future-of-finance-a-journey-of-innovation-and-collaboration-re-20251113/',
      },
      {
        event: '21st Singapore International Reinsurance Conference 2025',
        eventEn: '21st Singapore International Reinsurance Conference 2025',
        role: 'Official keynote',
        roleEn: 'Official keynote',
        date: '2025-11-03',
        sourceUrl: 'https://www.mas.gov.sg/news/speeches/2025/unlocking-opportunities-in-a-changing-risk-landscape',
      },
    ],
  },
  {
    id: 'leong-sing-chiong',
    name: 'Leong Sing Chiong',
    zhName: '梁星仲',
    aliases: ['Mr Leong Sing Chiong', 'Sing Chiong Leong'],
    title: 'Deputy Managing Director, MAS',
    zhTitle: 'MAS 副总裁',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['MAS'],
    party: null,
    summary: 'MAS 副总裁，主管金融监管与市场发展，覆盖金融科技、AI 在金融业的应用、行业政策。',
    summaryEn:
      'Deputy Managing Director at MAS overseeing financial supervision and markets development, covering FinTech, AI applications in finance, and sectoral policy.',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://sg.linkedin.com/in/sing-chiong-leong-69b62827b',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'MAS Markets & Development Group',
        titleEn: 'MAS Markets & Development Group',
        description:
          '统领 MAS Markets & Investment、Development & International、FinTech & Innovation 三个业务群——AI、tokenisation、跨境金融的核心推动方。',
        descriptionEn:
          "Heads MAS's Markets & Investment, Development & International, and FinTech & Innovation groups — central driver of AI, tokenisation and cross-border finance.",
        since: '2021',
        sourceUrl: 'https://www.mas.gov.sg/who-we-are/management-team',
      },
    ],
    notableQuotes: [
      {
        quote:
          'Through this open dialogue, MAS hopes to work with both central banks and regulatory counterparts, as well as global industry players to reap positive benefits from technology — while keeping financial services safe, trusted and inclusive.',
        quoteZh:
          '通过开放对话，MAS 希望与各国央行、监管同行和全球产业一起，把技术红利做大，同时让金融服务保持安全、可信、普惠。',
        context: 'Layer One Summit 欢迎致辞，SFF 2025',
        contextEn: 'Welcome remarks, Layer One Summit at SFF 2025',
        date: '2025-11-12',
        sourceUrl:
          'https://www.mas.gov.sg/news/speeches/2025/towards-achieving-trusted-open-and-interoperable-networks',
      },
    ],
    speakingRecord: [
      {
        event: 'Layer One Summit @ Singapore FinTech Festival 2025',
        eventEn: 'Layer One Summit @ Singapore FinTech Festival 2025',
        role: 'Welcome remarks',
        roleEn: 'Welcome remarks',
        date: '2025-11-12',
        sourceUrl:
          'https://www.mas.gov.sg/news/speeches/2025/towards-achieving-trusted-open-and-interoperable-networks',
      },
    ],
  },
  // ── Synapxe leadership ────────────────────────────────────────────
  {
    id: 'foo-hee-jug',
    name: 'Foo Hee Jug',
    zhName: '符喜祝',
    aliases: ['Mr Foo Hee Jug', 'Hee-Jug Foo'],
    title: 'CEO, Synapxe',
    zhTitle: 'Synapxe 首席执行官',
    category: 'government',
    roles: ['civil-servant', 'executive'],
    affiliations: ['MOH', 'Other'],
    party: null,
    summary:
      'Synapxe（前身 IHiS）CEO，主导新加坡公共医疗健康技术战略；前国大医院（NUHS）副 CEO，5 家医院 33 年医疗管理经验。',
    summaryEn:
      "CEO of Synapxe (formerly IHiS), Singapore's national HealthTech agency. Former Deputy CEO of National University Health System (NUHS); 33 years across 5 hospitals in healthcare leadership.",
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/heejug/',
        primary: true,
      },
    ],
    signatureWork: [
      {
        title: 'Synapxe AI Accelerate / 公共医疗 AI 工具集',
        titleEn: 'Synapxe AI Accelerate / public healthcare AI toolkit',
        description:
          '主导 Synapxe AI Accelerate 计划：医学术语分解 chatbot、舌象健康评估 app、HealthHub AI 助手；2025 年起在公共医疗系统推开记录自动化与 GenAI 文档总结。',
        descriptionEn:
          "Drives Synapxe's AI Accelerate programme — a chatbot that breaks down medical jargon, a tongue-photo health assessment app, and an AI assistant on HealthHub; rolled out automated record-updating and GenAI documentation summarisation across public healthcare from 2025.",
        sourceUrl: 'https://www.synapxe.sg/news/artificial-intelligence/synapxe-ai-tools',
      },
      {
        title: 'HEALIX 全国健康数据平台',
        titleEn: 'HEALIX national health data platform',
        description:
          '与 MOH 合作的云上数据基础设施，跨健康集群安全共享临床、社经、生活方式与基因数据，是新加坡医疗 AI 的"技术工厂"。',
        descriptionEn:
          "Cloud-based data infrastructure built with MOH that securely shares clinical, socio-economic, lifestyle and genomic data across healthcare clusters — the AI 'technology factory' for Singapore's health system.",
        sourceUrl: 'https://www.synapxe.sg/about-synapxe/leadership',
      },
    ],
  },
];

// ── Auto-seeded MP / minister stubs (Phase 1) ────────────────────────────
// 213 records from `npx tsx scripts/audit-speakers.ts` + `generate-people-stubs.ts`.
// Hand-curate zhName / zhTitle / summary / party / channels over time.
//
// JSON-imported so the 213 records aren't a TypeScript literal in src/.
// Shape enforced by scripts/verify-graph.ts in CI.
export const mpStubs: Person[] = mpStubsJson as Person[];

// Master list — every Person known to the graph. Used by findPersonId,
// /people/[id] static paths, and the verify-graph script. Do not iterate
// this in render templates with 220+ output nodes — voices.ts only
// re-exports the curated `people` array for the /voices page.
export const allPeople: Person[] = [...people, ...mpStubs];

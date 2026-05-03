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

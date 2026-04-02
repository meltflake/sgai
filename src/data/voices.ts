// 新加坡 AI 影响力图谱数据
// 人物、机构及其官方信息渠道

export interface SocialChannel {
  platform: string; // 'twitter' | 'linkedin' | 'facebook' | 'website' | 'newsletter' | 'github'
  url: string;
  label?: string; // 显示文字，如 '@joteo_ylm'
  primary?: boolean; // 是否为主力渠道
}

export interface Person {
  id: string;
  name: string;
  zhName: string;
  title: string;
  zhTitle: string;
  category: 'government' | 'academic' | 'industry';
  summary: string; // 一句话定位
  channels: SocialChannel[];
  debateCount?: number; // 国会发言次数（关联 debates 数据）
  videoCount?: number; // 视频数量（关联 videos 数据）
}

export interface Institution {
  id: string;
  name: string;
  zhName: string;
  role: string; // 一句话职能定位
  channels: SocialChannel[];
}

export interface MddiSpeech {
  title: string;
  speaker: string;
  speakerTitle: string;
  date: string;
  url: string;
  event: string;
}

// ── 关键人物 ─────────────────────────────────────────────────────────────────

export const people: Person[] = [
  {
    id: 'josephine-teo',
    name: 'Josephine Teo',
    zhName: '杨莉明',
    title: 'Minister for Digital Development and Information',
    zhTitle: '数码发展及新闻部长',
    category: 'government',
    summary: '新加坡 AI 政策的核心推动者，主导国家 AI 战略、Agentic AI 治理框架、AI 双语人才计划。',
    channels: [
      { platform: 'twitter', url: 'https://x.com/joteo_ylm', label: '@joteo_ylm' },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/josephine-teo-ylm/',
        primary: true,
      },
      { platform: 'facebook', url: 'https://www.facebook.com/JosephineTeoYLM/' },
      { platform: 'website', url: 'https://www.mddi.gov.sg/', label: 'MDDI 官网' },
    ],
  },
  {
    id: 'lawrence-wong',
    name: 'Lawrence Wong',
    zhName: '黄循财',
    title: 'Prime Minister of Singapore',
    zhTitle: '新加坡总理',
    category: 'government',
    summary: '亲自担任国家 AI 委员会主席，2026 预算案将 AI 列为国家优先事项。',
    channels: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/lawrencewongst/',
        primary: true,
      },
      { platform: 'website', url: 'https://www.pmo.gov.sg/', label: 'PMO 官网' },
    ],
  },
  {
    id: 'vivian-balakrishnan',
    name: 'Vivian Balakrishnan',
    zhName: '维文',
    title: 'Minister for Foreign Affairs',
    zhTitle: '外交部长',
    category: 'government',
    summary: 'Smart Nation 倡议发起人，推动新加坡 AI 国际合作，包括新韩 AI 连接峰会。',
    channels: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/VivianBalakrishnan/',
        primary: true,
      },
      { platform: 'website', url: 'https://www.mfa.gov.sg/', label: 'MFA 官网' },
    ],
  },
  {
    id: 'tharman',
    name: 'Tharman Shanmugaratnam',
    zhName: '尚达曼',
    title: 'President of Singapore',
    zhTitle: '新加坡总统',
    category: 'government',
    summary: '在国际论坛频繁发声谈 AI 治理与社会影响，推动全球 AI 安全对话。',
    channels: [{ platform: 'website', url: 'https://www.istana.gov.sg/', label: 'Istana 官网', primary: true }],
  },
  {
    id: 'tan-kiat-how',
    name: 'Tan Kiat How',
    zhName: '陈杰豪',
    title: 'Senior Minister of State for Digital Development and Information',
    zhTitle: 'MDDI 高级政务部长',
    category: 'government',
    summary: '前 IMDA CEO，主管数字经济、AI 治理、数据中心政策的具体落地。',
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
    title: 'President of NTU, Founding Executive Chairman of AI Singapore',
    zhTitle: 'NTU 校长 / AI Singapore 创始主席',
    category: 'academic',
    summary: 'AI Singapore 创始人，推动 SEA-LION、AIAP 等核心项目，新加坡 AI 研究生态的奠基者。',
    channels: [
      {
        platform: 'website',
        url: 'https://www.ntu.edu.sg/about-us/university-leadership/profiles/professor-ho-teck-hua',
        label: 'NTU 官方档案',
        primary: true,
      },
    ],
  },
  {
    id: 'laurence-liew',
    name: 'Laurence Liew',
    zhName: '刘劲松',
    title: 'Director of AI Innovation, AI Singapore',
    zhTitle: 'AI Singapore AI 创新总监',
    category: 'academic',
    summary: '100E、AIAP、LearnAI 计划的推动者，20 万+新加坡人接受 AI 教育，GPAI 创新商业化联合主席。',
    channels: [
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/laurenceliew/',
        primary: true,
      },
      { platform: 'website', url: 'https://aifirstnation.org/', label: 'AI-First Nation 博客' },
    ],
  },
];

// ── 关键机构 ─────────────────────────────────────────────────────────────────

export const institutions: Institution[] = [
  {
    id: 'mddi',
    name: 'MDDI',
    zhName: '数码发展及新闻部',
    role: '新加坡 AI 政策的顶层设计和统筹协调部门，发布演讲稿、政策文件和官方回应。',
    channels: [
      { platform: 'website', url: 'https://www.mddi.gov.sg/', label: '官网 (含演讲稿全文)', primary: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/mddisg/' },
      { platform: 'facebook', url: 'https://www.facebook.com/mdaboremdisg/' },
    ],
  },
  {
    id: 'imda',
    name: 'IMDA',
    zhName: '资讯通信媒体发展局',
    role: 'AI 治理框架制定和行业推广的执行机构，发布 AI Verify、Model AI Governance Framework。',
    channels: [
      { platform: 'website', url: 'https://www.imda.gov.sg/', label: '官网', primary: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/imda-sg/' },
      { platform: 'facebook', url: 'https://www.facebook.com/IMDAsg/' },
      { platform: 'newsletter', url: 'https://www.imda.gov.sg/', label: '月度 Newsletter' },
    ],
  },
  {
    id: 'aisg',
    name: 'AI Singapore',
    zhName: '新加坡人工智能计划',
    role: '国家 AI 研究与人才培养平台，运营 SEA-LION、AIAP、100E、LADP 等核心项目。',
    channels: [
      { platform: 'website', url: 'https://aisingapore.org/', label: '官网', primary: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/aisingapore/' },
      { platform: 'facebook', url: 'https://www.facebook.com/aisingaporepage/' },
      { platform: 'youtube', url: 'https://www.youtube.com/@AISingapore' },
      { platform: 'github', url: 'https://github.com/aisingapore' },
      { platform: 'newsletter', url: 'https://aisingapore.org/', label: 'Newsletter' },
    ],
  },
  {
    id: 'smart-nation',
    name: 'Smart Nation Singapore',
    zhName: '智慧国家计划',
    role: '新加坡数字化转型的总体框架，涵盖 AI、数字基础设施和数字包容。',
    channels: [
      { platform: 'website', url: 'https://www.smartnation.gov.sg/', label: '官网', primary: true },
      { platform: 'youtube', url: 'https://www.youtube.com/@smartnationsingapore' },
      { platform: 'facebook', url: 'https://www.facebook.com/SmartNationSG/' },
    ],
  },
  {
    id: 'ai-verify',
    name: 'AI Verify Foundation',
    zhName: 'AI Verify 基金会',
    role: '开源 AI 治理测试工具，推动 AI 可信赖性的国际标准。',
    channels: [
      { platform: 'website', url: 'https://aiverifyfoundation.sg/', label: '官网', primary: true },
      { platform: 'github', url: 'https://github.com/aiverify-foundation' },
    ],
  },
  {
    id: 'pdpc',
    name: 'PDPC',
    zhName: '个人数据保护委员会',
    role: '数据保护与 AI 伦理治理的监管机构，发布 Model AI Governance Framework。',
    channels: [{ platform: 'website', url: 'https://www.pdpc.gov.sg/', label: '官网', primary: true }],
  },
];

// ── MDDI 演讲稿（AI 相关）────────────────────────────────────────────────────

export const mddiSpeeches: MddiSpeech[] = [
  {
    title: 'Speech by Minister Josephine Teo at the Digital Leaders Accelerator Bootcamp Launch Reception',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-03-20',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-the-digital-leaders-accelerator-bootcamp-launch-reception/',
    event: 'Digital Leaders Accelerator Bootcamp Launch Reception',
  },
  {
    title: "Transcript of Minister Josephine Teo's Keynote Speech at AirTrunk Regional Headquarters Opening Ceremony",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-03-13',
    url: 'https://www.mddi.gov.sg/newsroom/transcript-of-minister-josephine-teo-s-keynote-speech-at-airtrunk-regional-headquarters-opening-ceremony/',
    event: 'AirTrunk Regional Headquarters Opening Ceremony',
  },
  {
    title: 'Opening Remarks by Minister Josephine Teo at the Launch of Quantinuum Singapore R&D Centre',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-03-11',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-josephine-teo-at-the-launch-of-quantinuum-singapore-r-d-centre/',
    event: 'Launch of Quantinuum Singapore R&D Centre',
  },
  {
    title:
      'Speech by SMS Tan Kiat How at Launch of Singtel Digital InfraCo - NVIDIA Centre of Excellence for Applied AI',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2026-02-24',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-kiat-how-at-launch-of-singtel-digital-infraco---nvidia-centre-of-excellence-for-applied-ai/',
    event: 'Launch of Singtel Digital InfraCo - NVIDIA Centre of Excellence for Applied AI',
  },
  {
    title:
      'Closing Remarks by Minister Josephine Teo at the United Nations Office for Digital and Emerging Technologies (ODET): The Role of Science in International AI Governance Panel Session',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-20',
    url: 'https://www.mddi.gov.sg/newsroom/closing-remarks-by-minister-josephine-teo-at-the-united-nations-office-for-digital-and-emerging-technologies--odet---the-role-of-science-in-international-ai-governance-panel-session/',
    event:
      'United Nations Office for Digital and Emerging Technologies (ODET): The Role of Science in International AI Governance Panel Session',
  },
  {
    title:
      'Opening Keynote by Minister Josephine Teo at Preparing to Monitor the Impacts of Agents: Closing the Global Assurance Divide for Safe and Trusted AI',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-20',
    url: 'https://www.mddi.gov.sg/newsroom/opening-keynote-by-minister-josephine-teo-at-preparing-to-monitor-the-impacts-of-agents--closing-the-global-assurance-divide-for-safe-and-trusted-ai/',
    event: 'Preparing to Monitor the Impacts of Agents: Closing the Global Assurance Divide for Safe and Trusted AI',
  },
  {
    title:
      'Remarks by Minister Josephine Teo at AI Safety at the Global Level: Insights from Digital Ministers & Officials Panel',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-20',
    url: 'https://www.mddi.gov.sg/newsroom/remarks-by-minister-josephine-teo-at-ai-safety-at-the-global-level--insights-from-digital-ministers---officials-panel/',
    event: 'AI Safety at the Global Level: Insights from Digital Ministers & Officials Panel',
  },
  {
    title: 'Remarks by Minister Josephine Teo at the Fireside Chat on AI: The Global Context',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-20',
    url: 'https://www.mddi.gov.sg/newsroom/remarks-by-minister-josephine-teo-at-the-fireside-chat-on-ai--the-global-context/',
    event: 'Fireside Chat on AI: The Global Context',
  },
  {
    title:
      'Transcript of Fireside Chat with Minister Josephine Teo at Launch of "AI in Southeast Asia: An Era of Opportunity" Report',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-11',
    url: 'https://www.mddi.gov.sg/newsroom/transcript-of-fireside-chat-with-minister-josephine-teo-at-launch-of--ai-in-southeast-asia--an-era-of-opportunity--report/',
    event: 'Launch of "AI in Southeast Asia: An Era of Opportunity" Report',
  },
  {
    title: "Opening Remarks by Minister Josephine Teo at the Launch of Microsoft's AI QuickStart Programme",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-02-06',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-josephine-teo-at-the---launch-of-microsoft-s-ai-quickstart-programme/',
    event: "Launch of Microsoft's AI QuickStart Programme",
  },
  {
    title: 'Opening Remarks by Minister Josephine Teo at Singapore AI Research Week Gala Dinner',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2026-01-24',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-josephine-teo-at-singapore-ai-research-week-gala-dinner/',
    event: 'Singapore AI Research Week Gala Dinner',
  },
  {
    title:
      "Opening Address by MOS Jasmin Lau at the Association of Small and Medium Enterprises (ASME)'s AI Festival Asia 2026",
    speaker: 'Jasmin Lau',
    speakerTitle: 'MDDI 政务次长',
    date: '2026-01-22',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-mos-jasmin-lau-at-the-association-of-small-and-medium-enterprises--asme--s-ai-festival-asia-2026/',
    event: "Association of Small and Medium Enterprises (ASME)'s AI Festival Asia",
  },
  {
    title:
      'Opening Address by MOS Jasmin Lau at Launch of NUS Executive Master in AI and Digital Transformation on 14 Jan',
    speaker: 'Jasmin Lau',
    speakerTitle: 'MDDI 政务次长',
    date: '2026-01-14',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-mos-jasmin-lau-at-launch-of-nus-executive-master-in-ai-and-digital-transformation-on-14-jan/',
    event: 'Launch of NUS Executive Master in AI and Digital Transformation',
  },
  {
    title:
      'Opening Remarks by SPS Goh Hanyan at the launch of AI Centre of Excellence (CoE) at Manulife Singapore on 5 December 2025',
    speaker: 'Goh Hanyan',
    speakerTitle: 'MDDI 政务次长',
    date: '2025-12-05',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-sps-goh-hanyan-at-the-launch-of-ai-centre-of-excellence--coe--at-manulife-singapore-on-5-december-2025/',
    event: 'Launch of AI Centre of Excellence (CoE) at Manulife Singapore',
  },
  {
    title: 'Opening Address by SMS Tan Kiat How At EuroCham AI Summit 2025',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-11-26',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-tan-kiat-how-at-eurocham-ai-summit-2025/',
    event: 'EuroCham AI Summit 2025',
  },
  {
    title: 'Keynote Address by SMS Tan Kiat How at Compact AI Symposium 2025',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-11-10',
    url: 'https://www.mddi.gov.sg/newsroom/keynote-address-by-sms-tan-kiat-how-at-compact-ai-symposium-2025/',
    event: 'Compact AI Symposium 2025',
  },
  {
    title: "Opening Remarks by Minister Josephine Teo at Workato's launch of AI Lab",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-11-07',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-josephine-teo-at-workato-s-launch-of-ai-lab/',
    event: "Workato's launch of AI Lab",
  },
  {
    title: 'Speech by SMS Tan Kiat How at Singapore Computer Society Splash Forum 2025',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-10-24',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-kiat-how-at-singapore-computer-society-splash-forum-2025/',
    event: 'Singapore Computer Society Splash Forum 2025',
  },
  {
    title: 'Opening Address by Minister Josephine Teo at HLP (AI) on 22 Oct 2025',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-10-22',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-minister-josephine-teo-at-hlp--ai--on-22-oct-2025/',
    event: 'HLP (AI)',
  },
  {
    title: 'Opening remarks by SMS Tan Kiat How at the Singapore AI Capture-The-Flag event',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-10-21',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-sms-tan-kiat-how-at-the-singapore-ai-capture-the-flag-event/',
    event: 'Singapore AI Capture-The-Flag event',
  },
  {
    title: 'Speech by Minister Josephine Teo at the Opening of SITxNVIDIA AI Centre',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-10-02',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-the-opening-of-sitxnvidia-ai-centre/',
    event: 'Opening of SITxNVIDIA AI Centre',
  },
  {
    title:
      'Remarks by Minister Josephine Teo at the panel discussion "Harnessing AI To Advance Development" at Semafor\'s The Next 3 Billion Summit',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-09-25',
    url: 'https://www.mddi.gov.sg/newsroom/remarks-by-minister-josephine-teo-at-the-panel-discussion--harnessing-ai-to-advance-development--at-semafor-s-the-next-3-billion-summit/',
    event: "Semafor's The Next 3 Billion Summit",
  },
  {
    title:
      'Address by Minister Josephine Teo at Singapore Computer Society (SCS)\'s Tech3 "Tug of War for Tech Supremacy"',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-08-29',
    url: 'https://www.mddi.gov.sg/newsroom/transcript-of-minister-josephine-teo-s-guest-of-honour-address-at-singapore-computer-society--scs--s-tech3--tug-of-war-for-tech-supremacy-/',
    event: "Singapore Computer Society (SCS)'s Tech3 Forum",
  },
  {
    title: "Opening Remarks by Minister Josephine Teo at Google Cloud's AI Asia Event",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-08-28',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-josephine-teo-at-google-cloud-s-ai-asia-event/',
    event: "Google Cloud's AI Asia Event",
  },
  {
    title: 'Opening Address by SMS Tan Kiat How at Sustainable AI Data Centre Career Day',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-07-25',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-tan-kiat-how-at-sustainable-ai-data-centre-career-day/',
    event: 'Sustainable AI Data Centre Career Day',
  },
  {
    title: 'Speech by MOS Rahayu Mahzam at the Reimagining F&B in a Growing AI Environment Forum',
    speaker: 'Rahayu Mahzam',
    speakerTitle: 'MDDI 政务次长',
    date: '2025-07-17',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-mos-rahayu-mahzam-at-the-reimagining-f-b-in-a-growing-ai-environment-forum/',
    event: 'Reimagining F&B in a Growing AI Environment Forum',
  },
  {
    title: 'Closing Speech by MOS Rahayu Mahzam at AI Student Developer Conference',
    speaker: 'Rahayu Mahzam',
    speakerTitle: 'MDDI 政务次长',
    date: '2025-05-29',
    url: 'https://www.mddi.gov.sg/newsroom/closing-speech-by-mos-rahayu-mahzam-at-ai-student-developer-conference/',
    event: 'AI Student Developer Conference',
  },
  {
    title: 'Closing Address by MOS Rahayu Mahzam at AI in Health Symposium 2025',
    speaker: 'Rahayu Mahzam',
    speakerTitle: 'MDDI 政务次长',
    date: '2025-05-27',
    url: 'https://www.mddi.gov.sg/newsroom/closing-address-by-mos-rahayu-mahzam-at-ai-in-health-symposium-2025/',
    event: 'AI in Health Symposium 2025',
  },
  {
    title: "Speech by Minister Josephine Teo at HTX's AI TechXplore",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2025-05-26',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-htx-ai-techxplore/',
    event: "HTX's AI TechXplore",
  },
  {
    title: 'Speech by SMS Tan Kiat How at Design AI and Tech Awards 2025',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-05-19',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-kiat-how-at-design-ai-and-tech-awards-2025/',
    event: 'Design AI and Tech Awards 2025',
  },
  {
    title: "Opening Address by SMS Janil Puthucheary at the Launch of ASME and ITE's AI Centre of Excellence",
    speaker: 'Janil Puthucheary',
    speakerTitle: 'MDDI 前高级政务部长',
    date: '2025-04-14',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-janil-puthucheary-at-the-launch-of-asme-and-ites-ai-centre-of-excellence/',
    event: "Launch of ASME and ITE's AI Centre of Excellence",
  },
  {
    title: 'Opening Address by SMS Tan Kiat How at AI Health World Summit 2025',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-03-19',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-tan-kiat-how-at-ai-health-world-summit-2025/',
    event: 'AI Health World Summit 2025',
  },
  {
    title: 'Opening Address by SMS Tan Kiat How at the Artificial Intelligence Festival Asia',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2025-01-17',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-tan-at-the-artificial-intelligence-festival-asia/',
    event: 'Artificial Intelligence Festival Asia',
  },
  {
    title: "Speech by Minister Josephine Teo at Launch of Prudential's Global AI Lab in Singapore",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2024-11-19',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-launch-of-prudential-global-ai-lab/',
    event: "Launch of Prudential's Global AI Lab in Singapore",
  },
  {
    title: "Speech by SMS Tan Kiat How at HCLTech's AI Lab Media Launch event",
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2024-11-04',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-kiat-how-at-hcltech-ai-lab-media-launch-event/',
    event: "HCLTech's AI Lab Media Launch event",
  },
  {
    title: 'Speech by SMS Janil Puthucheary at Eurocham AI: Beyond the Buzz Report Launch',
    speaker: 'Janil Puthucheary',
    speakerTitle: 'MDDI 前高级政务部长',
    date: '2024-10-21',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-janil-puthucheary-at-eurocham-ai-beyond-the-buzz-report-launch/',
    event: 'Eurocham AI: Beyond the Buzz Report Launch',
  },
  {
    title: 'Keynote Address by SMS Janil Puthucheary at the SICW High Level Panel on AI',
    speaker: 'Janil Puthucheary',
    speakerTitle: 'MDDI 前高级政务部长',
    date: '2024-10-16',
    url: 'https://www.mddi.gov.sg/newsroom/keynote-address-by-sms-janil-puthucheary-at-the-sicw-high-level-panel-on-ai/',
    event: 'SICW High Level Panel on AI',
  },
  {
    title: 'Speech by SMS Mr Tan Kiat How at Singapore Computer Society Splash Forum',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2024-10-04',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-mr-tan-kiat-how-at-singapore-computer-society-splash-forum/',
    event: 'Singapore Computer Society Splash Forum',
  },
  {
    title: 'Opening Address by SMS Tan Kiat How at Launch of Centre of AI in Medicine',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2024-09-30',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-tan-kiat-how-at-launch-of-centre-of-ai-in-medicine/',
    event: 'Launch of Centre of AI in Medicine',
  },
  {
    title: 'Speech by MOS Rahayu Mahzam at G20 Digital Economy Ministerial Meeting in Brazil',
    speaker: 'Rahayu Mahzam',
    speakerTitle: 'MDDI 政务次长',
    date: '2024-09-13',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-mos-rahayu-mahzam-at-g20-digital-economy-ministerial-meeting/',
    event: 'G20 Digital Economy Ministerial Meeting in Brazil',
  },
  {
    title: 'Speech by SMS Tan Kiat How at the Data and AI World Tour Singapore',
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2024-08-30',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-kiat-how-at-the-data-and-ai-world-tour-singapore/',
    event: 'Data and AI World Tour Singapore',
  },
  {
    title: 'Opening Remarks by MOS Rahayu Mahzam At IBM Future Workforce in AI Era',
    speaker: 'Rahayu Mahzam',
    speakerTitle: 'MDDI 政务次长',
    date: '2024-08-23',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-mos-rahayu-mahzam-at-ibm-future-workforce-in-ai-era/',
    event: 'IBM Future Workforce in AI Era',
  },
  {
    title: 'Opening Address by SMS Janil Puthucheary at the AiSP AI Security Summit',
    speaker: 'Janil Puthucheary',
    speakerTitle: 'MDDI 前高级政务部长',
    date: '2024-07-03',
    url: 'https://www.mddi.gov.sg/newsroom/opening-address-by-sms-janil-puthucheary-at-the-aisp-ai-security-summit/',
    event: 'AiSP AI Security Summit',
  },
  {
    title: '"Sustainable Data Centres with Google" speech by SMS Janil Puthucheary',
    speaker: 'Janil Puthucheary',
    speakerTitle: 'MDDI 前高级政务部长',
    date: '2024-06-03',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-janil-puthucheary-at-sustainable-data-centres-with-google/',
    event: 'Sustainable Data Centres with Google',
  },
  {
    title: 'Speech by Minister Josephine Teo at Explore AI',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2024-01-29',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-explore-ai/',
    event: 'Explore AI',
  },
  {
    title: "Transcript of Minister Josephine Teo's virtual interview at the 4th European AI Alliance Assembly",
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2023-11-16',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-4th-european-ai-alliance-assembly/',
    event: '4th European AI Alliance Assembly',
  },
  {
    title: 'Speech by Minister Josephine Teo at the Launch of the "AI Trailblazers" Initiative',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2023-07-24',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-at-the-launch-of-the-ai-trailblazers-initiative/',
    event: 'Launch of the "AI Trailblazers" Initiative',
  },
  {
    title: 'Speech by Minister Josephine Teo at the 2023 Global Digital Economy Conference',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2023-07-04',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-at-the-2023-global-digital-economy-conference/',
    event: '2023 Global Digital Economy Conference',
  },
  {
    title: 'Speech by Minister Josephine Teo at the Asia Tech x Artificial Intelligence Conference',
    speaker: 'Josephine Teo',
    speakerTitle: '数码发展及新闻部长',
    date: '2023-06-07',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-the-asia-tech-x-ai-conference/',
    event: 'Asia Tech x Artificial Intelligence Conference',
  },
  {
    title: "Speech by SMS Tan Kiat How at the Business China's Singapore Digital Economy Roundtable",
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2023-06-06',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-sms-tan-at-business-china-singapore-digital-economy-roundtable/',
    event: "Business China's Singapore Digital Economy Roundtable",
  },
  {
    title: 'Speech by PS Yong Ying-I at 4th Singapore Healthcare AI Datathon & Expo',
    speaker: 'Yong Ying-I',
    speakerTitle: 'MDDI 常任秘书',
    date: '2021-12-03',
    url: 'https://www.mddi.gov.sg/newsroom/speech-ps-yong-yingi-4th-sg-healthcare-ai-datathon-expo/',
    event: '4th Singapore Healthcare AI Datathon & Expo',
  },
  {
    title: "Speech by MOS Tan Kiat How at Singapore Computer Society's Splash Awards 2021",
    speaker: 'Tan Kiat How',
    speakerTitle: 'MDDI 高级政务部长',
    date: '2021-09-24',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-mos-tan-kiat-how-at-singapore-computer-society-splash-awards-2021/',
    event: "Singapore Computer Society's Splash Awards 2021",
  },
  {
    title: 'Opening Speech by Minister S Iswaran at the Singapore Computer Society Tech3 Forum',
    speaker: 'S Iswaran',
    speakerTitle: 'MDDI 前部长',
    date: '2020-10-16',
    url: 'https://www.mddi.gov.sg/newsroom/opening-speech-by-minister-iswaran-at-the-singapore-computer-society-forum/',
    event: 'Singapore Computer Society Tech3 Forum',
  },
  {
    title: 'Opening Remarks by Minister S Iswaran at the Smart Nation Scholarship Award Ceremony',
    speaker: 'S Iswaran',
    speakerTitle: 'MDDI 前部长',
    date: '2019-08-31',
    url: 'https://www.mddi.gov.sg/newsroom/opening-remarks-by-minister-at-the-smart-nation-scholarship-award-ceremony/',
    event: 'Smart Nation Scholarship Award Ceremony',
  },
  {
    title: 'Speech by Minister S Iswaran at the opening of the Smart Nation Summit',
    speaker: 'S Iswaran',
    speakerTitle: 'MDDI 前部长',
    date: '2019-06-26',
    url: 'https://www.mddi.gov.sg/newsroom/speech-by-mr-s-iswaran-at-the-opening-of-the-smart-nation-summit/',
    event: 'Opening of the Smart Nation Summit',
  },
  {
    title:
      "Transcript of Minister Vivian Balakrishnan's Offline, On-The-Record Interview with Bloomberg on Smart Nation On 22 August 2017",
    speaker: 'Vivian Balakrishnan',
    speakerTitle: 'MDDI 前部长',
    date: '2017-08-22',
    url: 'https://www.mddi.gov.sg/newsroom/transcript-of-minister-vivian-balakrishnan-offline-on-the-record-interview-with-bloomberg-on-smart-nation-2017/',
    event: 'Bloomberg Interview on Smart Nation',
  },
];

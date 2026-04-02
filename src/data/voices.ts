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
// 初始数据将通过采集脚本填入

export const mddiSpeeches: MddiSpeech[] = [];

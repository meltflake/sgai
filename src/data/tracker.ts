export interface TrackerRow {
  name: string;
  value: string;
  source: string;
  sourceUrl: string;
}

export interface TrackerSection {
  icon: string;
  title: string;
  rows: TrackerRow[];
}

export const dataDate = '2026-04-26';

export const sections: TrackerSection[] = [
  {
    icon: '💰',
    title: '投资与资金',
    rows: [
      {
        name: '政府 AI 专项投入',
        value: '> S$2B（NAIS 2.0 S$1B+ / 公共 AI 研究 2026-2030 S$1B+ / 企业计算 S$150M）',
        source: 'Budget 2024 / MDDI / Reuters, 2024-2026',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: '公共 AI 研究投资 (2026-2030)',
        value: '> S$1B（7.79 亿美元）',
        source: 'MDDI, 2026.1.24',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: '人均 AI 投资（政府）',
        value: 'S$139/人（vs 美国 $33、中国 $7）',
        source: 'Stanford AI Index 2025 + 人口数据估算',
        sourceUrl: 'https://hai.stanford.edu/ai-index/2025-ai-index-report/economy',
      },
      {
        name: 'AI 计算专项',
        value: 'S$500M（高性能计算）',
        source: 'Budget 2024',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: '下一代超算投资',
        value: 'S$270M（经典+量子混合，2025 年底投运）',
        source: 'Smart Nation 2.0, 2024.10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'AI 科学计划',
        value: 'S$120M',
        source: 'Smart Nation 2.0, 2024.10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'RIE2030 研发总投入',
        value: 'S$37B（含 AI 相关，2026-2030）',
        source: 'NRF, 2025.12',
        sourceUrl: 'https://www.nrf.gov.sg/',
      },
      { name: 'AI Singapore 初始拨款', value: 'S$150M', source: 'NRF, 2017', sourceUrl: 'https://aisingapore.org/' },
      {
        name: '科技巨头基础设施承诺',
        value: '~US$26B+（AWS $9B / Google $5B / Microsoft 等）',
        source: 'Introl 综合, 2025.8',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'AI 创业融资总额',
        value: 'US$8.4B+（累计）',
        source: 'AiNewsHub, 2025',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: 'Budget 2026 AI 税收激励',
        value: '400% 税前扣除（上限 S$50K/年，YA2027-2028）',
        source: 'Budget 2026, 2026.2',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
      },
      {
        name: 'Microsoft 数据中心投资',
        value: 'S$5.5B（2024-2028）',
        source: 'EDB / Microsoft, 2024',
        sourceUrl:
          'https://news.microsoft.com/source/asia/2024/05/07/microsoft-announces-singapore-investment-and-skilling-initiatives/',
      },
      {
        name: 'AWS 数据中心投资',
        value: 'S$12B（2024-2028）',
        source: 'EDB / AWS, 2024',
        sourceUrl: 'https://www.aboutamazon.com/news/aws/aws-singapore-12-billion-investment',
      },
      {
        name: 'Google 数据中心 + AI 投资',
        value: 'US$9B / ~S$11.6B + DeepMind 实验室',
        source: 'Google / EDB, 2026',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'Enterprise Compute Initiative (ECI)',
        value: 'S$150M（企业算力补贴）',
        source: 'IMDA, 2026.2',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'Anchor Fund @ 65 第二批',
        value: 'S$1.5B（IPO 锚定基金，2026）',
        source: 'Budget 2026, 2026.2',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'Future Sectors Development Fund (FSDF)',
        value: 'S$1.5B（2026 启动）',
        source: 'Budget 2026',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'EQDP 私募股权基金扩张',
        value: 'S$6.5B（2026）',
        source: 'Budget 2026',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
      },
      {
        name: 'BCA BETC Grant',
        value: 'S$100M（建造业数字基建，2025 起）',
        source: 'BCA, 2025',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'Built Environment AI CoE',
        value: 'S$30M（2024 起）',
        source: 'BCA / NUS / NTU, 2024',
        sourceUrl: 'https://www.bca.gov.sg/',
      },
      {
        name: 'NEA Weather Science Programme',
        value: 'S$25M（2024 起）',
        source: 'NEA, 2024',
        sourceUrl: 'https://www.nea.gov.sg/',
      },
      {
        name: 'HTX 人形机器人中心 (H2RC)',
        value: 'S$100M（2026 Q2 启动）',
        source: 'HTX, 2026',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'National Multimodal LLM Programme',
        value: 'S$70M（A*STAR 主导）',
        source: 'A*STAR / AISG',
        sourceUrl: 'https://www.a-star.edu.sg/',
      },
      {
        name: 'Singapore AI Safety Institute (AISI)',
        value: 'S$10M/年（治理研究）',
        source: 'IMDA / AISI, 2024',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
    ],
  },
  {
    icon: '👩\u200d💻',
    title: '人才培养',
    rows: [
      {
        name: 'AI 专业人才目标',
        value: '2019 年 2,000 → 2023 年 5,000 → 2029 年目标 15,000（外籍占 35%）',
        source: 'MDDI, 2026.1',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
      },
      {
        name: 'SkillsFuture AI 培训',
        value: '105,000+ 人参加 1,600+ AI 课程（2025）',
        source: 'SSG / Straits Times, 2026.2',
        sourceUrl: 'https://www.straitstimes.com/tags/artificial-intelligence',
      },
      {
        name: 'TeSA 科技人才安置',
        value: '21,000+ 本地人就业（自 2016）',
        source: 'IMDA, 2025.8',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'TeSA 技能提升',
        value: '340,000+ 人（自 2016）',
        source: 'IMDA, 2025.8',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AIAP 学徒计划',
        value: '22 批完成，~500-600 毕业生，>90% 就业率，当前~60 人/批',
        source: 'AISG AIAP, 2026.2',
        sourceUrl: 'https://aiap.sg/apprenticeship/',
      },
      {
        name: 'Google AI 技能倡议',
        value: '28,000 人（Skills Ignition SG）；目标 2027 年覆盖 50,000 学生',
        source: 'Google for SG, 2026.2',
        sourceUrl: 'https://www.google.com/',
      },
      {
        name: '职场 AI 使用率',
        value: '3/4 工人定期使用 AI 工具，85% 认为提升效率',
        source: 'IMDA SGDE Report, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Springboard 企业计划',
        value: '300 家企业，每家最高 S$600K 补贴',
        source: 'EDB, 2025 Q3',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: 'NAIIP 国家 AI 影响计划',
        value: '10K 企业 + 100K 工人（2026-2029）',
        source: 'IMDA + ESG, 2026.2',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI Bilingual 100K 计划',
        value: '首批落地：会计 (ISCA) + 法律 (SAL/SCCA)，1H 2026 上线',
        source: 'MDDI COS 2026',
        sourceUrl: 'https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=budget-2895',
      },
      {
        name: 'SkillsFuture AI 课程补贴',
        value: '50% / 70% 分层补贴 + Mid-Career S$4,000 Credit',
        source: 'SSG, 2026',
        sourceUrl: 'https://www.skillsfuture.gov.sg/',
      },
      {
        name: '100E Programme（AI Singapore）',
        value: '每项目 S$150K 共投，累计 100+ 完成',
        source: 'AISG',
        sourceUrl: 'https://aisingapore.org/innovation/100e/',
      },
    ],
  },
  {
    icon: '🔬',
    title: '研究产出',
    rows: [
      {
        name: 'AI 论文人均发表量',
        value: '全球第 1（每百万人 250 篇，2022）',
        source: 'Wiley, 2024.9',
        sourceUrl: 'https://aiindex.stanford.edu/',
      },
      {
        name: 'NTU AI 研究排名',
        value: '全球第 3（仅次于 MIT、CMU）',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        name: 'NUS AI 学术声誉',
        value: '全球第 9',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        name: 'SEA-LION 大模型',
        value: 'v4，11+ 语言，4B-33B 参数',
        source: 'AISG, 2025',
        sourceUrl: 'https://sea-lion.ai/',
      },
      {
        name: '100 Experiments',
        value: '100+ AI 项目完成（2018-2025，已归档）',
        source: 'AISG',
        sourceUrl: 'https://aisingapore.org/',
      },
      { name: 'ICLR 2025', value: '在新加坡举办', source: 'ICLR, 2025', sourceUrl: 'https://iclr.cc/' },
      {
        name: 'DBS AI 模型',
        value: '800+ 模型，350+ 用例，2024 年创造 S$750M 经济价值',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.mas.gov.sg/',
      },
    ],
  },
  {
    icon: '🏢',
    title: '产业采用',
    rows: [
      {
        name: '数字经济占 GDP',
        value: '18.6%（2024，2019 年为 14.9%）',
        source: 'IMDA SGDE Report, 2025.10',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '大企业 AI 采用率',
        value: '62.5%（2024）',
        source: 'IMDA SGDE Report, 2025.10',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '中小企业 AI 采用率',
        value: '14.5%（2024，较 2023 年 4.2% 增长 3 倍）',
        source: 'IMDA SGDE Report, 2025.10',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'AI 创业公司',
        value: '650+（占东南亚深科技融资 91.1%）',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: '独角兽',
        value: '32 家（截至 2025.7）',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: '东盟 AI 交易份额',
        value: '58% 交易量，68% 交易金额（2024 前 9 个月）',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
      {
        name: '企业 AI 培训意愿',
        value: '超过 2/3 使用 AI 的企业计划优先投资员工培训',
        source: 'IMDA, 2025.8',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '医疗 AI 案例',
        value:
          'ACE-AI 预测糖尿病/高脂血症风险（Synapxe 开发，2027 年初推广至 1,100+ Healthier SG 诊所）；RUSSELL-GPT 减少医生文档时间 50%；Ng Teng Fong 医院流感暴发床位预测算法',
        source: 'MOH COS 2026 / WEF / NUHS, 2025-2026',
        sourceUrl:
          'https://www.straitstimes.com/singapore/politics/ai-genetic-screening-and-flexible-financing-to-bolster-preventive-medicine-for-super-aged-spore-ong',
      },
      {
        name: '五大国家 AI 项目',
        value: '智能货运规划、市政服务、慢性病管理、个性化教育、边境清关（S$120M）',
        source: 'Smart Nation 2.0, 2024.10',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: 'Note Buddy 临床 AI 助手',
        value: '5,000+ 医护使用，67K 病历记录（截至 2025-12）',
        source: 'Synapxe / SingHealth, 2025',
        sourceUrl: 'https://www.synapxe.sg/',
      },
      {
        name: 'GovTech Pair 公务员 AI',
        value: '150K 公务员目标',
        source: 'GovTech',
        sourceUrl: 'https://www.tech.gov.sg/products-and-services/pair/',
      },
      {
        name: 'Punggol 自动驾驶巴士',
        value: '首批商业化 AV，3 条线路（2025-12 上线）',
        source: 'LTA',
        sourceUrl: 'https://www.lta.gov.sg/',
      },
      {
        name: 'PSA Tuas Mega Port',
        value: '2040s 全球最大全自动港',
        source: 'PSA Singapore',
        sourceUrl: 'https://www.singaporepsa.com/our-commitment/innovation/tuas-port',
      },
      {
        name: 'Changi 机场 AI 治理认证',
        value: '全球首张 ISO/IEC 42001 AI 治理认证',
        source: 'Changi Airport Group, 2025',
        sourceUrl: 'https://www.changiairport.com/',
      },
      {
        name: 'HDB Tengah 智能能源镇',
        value: '首座智能能源镇，4.2 万户',
        source: 'HDB',
        sourceUrl: 'https://www.hdb.gov.sg/about-us/news-and-publications/news/details/tengah',
      },
      {
        name: 'JTC Punggol Digital District',
        value: '首个全区智能区，能耗预计降 30%',
        source: 'JTC',
        sourceUrl: 'https://www.jtc.gov.sg/our-work/spaces/punggol-digital-district',
      },
      {
        name: 'AI Verify Sandbox',
        value: '10+ 跨国大企业参与（IMDA Global AI Assurance Pilot）',
        source: 'IMDA, 2025',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
    ],
  },
  {
    icon: '🖥️',
    title: '基础设施',
    rows: [
      {
        name: 'NSCC ASPIRE 2A+',
        value: 'NVIDIA H100 集群，20 PetaFLOPS',
        source: 'TechTIQ, 2025.12',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '国家 AI 计算网格',
        value: '已宣布，链接全国计算资源',
        source: 'SuperAI / DataCenters.com, 2025',
        sourceUrl: 'https://www.smartnation.gov.sg/',
      },
      {
        name: '商用 GPU 集群',
        value: 'SMC 最高 2,048 张 H100/集群；Singtel GPU-as-a-Service',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'NVIDIA 新加坡营收',
        value: '占全球 15%（约 $2.7B/季度），人均 $600',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.edb.gov.sg/en/our-industries/artificial-intelligence-in-singapore.html',
      },
      {
        name: '数据中心市场',
        value: '$4.16B（2024），1.4GW 容量，70+ 设施',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '新增数据中心容量',
        value: '额外 300MW 已分配；80MW 试点（2026-2028）',
        source: 'Reed Smith / Linklaters, 2025',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: '5G 覆盖',
        value: '95%+ 独立组网全国覆盖（2022.7 达成，提前 3 年）',
        source: 'Singtel / CNA, 2022',
        sourceUrl: 'https://www.imda.gov.sg/',
      },
      {
        name: 'HTX NGINE — 家国安全算力',
        value: 'NVIDIA B200 DGX SuperPOD（自有）',
        source: 'HTX',
        sourceUrl: 'https://www.htx.gov.sg/',
      },
      {
        name: 'Synapxe HEALIX',
        value: '国家医疗数据 + AI 基础设施',
        source: 'Synapxe',
        sourceUrl: 'https://www.synapxe.sg/',
      },
      {
        name: 'URA Virtual Singapore',
        value: '国家级数字孪生 + ePlanner 3D + Smart Planning Assistant',
        source: 'URA',
        sourceUrl: 'https://www.ura.gov.sg/',
      },
      {
        name: 'GovTech Agentspace',
        value: '亚洲首例 air-gapped agentic AI（公共部门）',
        source: 'GovTech',
        sourceUrl: 'https://www.tech.gov.sg/',
      },
    ],
  },
  {
    icon: '🌐',
    title: '国际治理影响力',
    rows: [
      {
        name: 'Singapore Consensus on AI Safety',
        value: '11 国签署（含中美）',
        source: 'IMDA / AISI, 2024',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'ASEAN Guide on AI Governance',
        value: '10 国采纳（新加坡主导起草）',
        source: 'ASEAN Digital Ministers, 2024',
        sourceUrl: 'https://asean.org/',
      },
      {
        name: 'REAIM Seoul Summit 2024',
        value: '新加坡作为联合主办方（5 国）',
        source: 'MFA / MINDEF, 2024',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'AI Safety Summits 出席',
        value: 'Bletchley 2023 + Seoul 2024 + Paris 2025 全部参与',
        source: 'MFA',
        sourceUrl: 'https://www.mfa.gov.sg/',
      },
      {
        name: 'International Scientific Exchange (ISESEA)',
        value: '已办两届（2024 + 2026）',
        source: 'IMDA / AISI',
        sourceUrl: 'https://aiverifyfoundation.sg/',
      },
      {
        name: 'UN Global Dialogue on AI Governance',
        value: '新加坡参与 Independent International Scientific Panel',
        source: 'UN / MFA',
        sourceUrl: 'https://www.un.org/techenvoy/ai-advisory-body',
      },
      {
        name: 'MAS Project MindForge',
        value: '24 家机构 + Microsoft / AWS / Google / NVIDIA',
        source: 'MAS',
        sourceUrl: 'https://www.mas.gov.sg/',
      },
    ],
  },
  {
    icon: '🌍',
    title: '国际排名',
    rows: [
      {
        name: 'Microsoft AI 采用率',
        value: '全球第 2（60.9%，仅次于 UAE 64.0%）',
        source: 'Microsoft AI Economy Institute, 2026.1',
        sourceUrl:
          'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
      },
      {
        name: 'Tortoise 全球 AI 指数',
        value: '第 3 名（仅次于美国、中国）',
        source: 'Tortoise Media, 2024.9',
        sourceUrl: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        name: 'Oxford 政府 AI 就绪度',
        value: '第 2 名（仅次于美国）',
        source: 'Oxford Insights, 2024.12',
        sourceUrl: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      { name: 'WIPO 全球创新指数', value: '第 5 名', source: 'WIPO, 2025', sourceUrl: 'https://www.wipo.int/' },
      {
        name: 'AI 基础设施子项',
        value: '第 2 名（仅次于美国）',
        source: 'Tortoise, 2024',
        sourceUrl: 'https://www.tortoisemedia.com/intelligence/global-ai/',
      },
      {
        name: '东南亚深科技融资份额',
        value: '91.1%',
        source: 'Introl, 2025.8',
        sourceUrl: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
    ],
  },
];

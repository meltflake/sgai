export const talentDataDate = '2026-05-04';

export type TalentStatusTone = 'active' | 'scheduled' | 'closed' | 'evergreen';

export interface TalentStat {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface TalentDetailSection {
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  bullets?: string[];
  bulletsEn?: string[];
}

export interface TalentProfile {
  facts: TalentStat[];
  sections: TalentDetailSection[];
  sourceLabel: string;
  sourceLabelEn: string;
  sourceUrl: string;
  sourceNote: string;
  sourceNoteEn: string;
  lastChecked: string;
}

export interface TalentProgramme {
  id: string;
  name: string;
  nameEn: string;
  shortName?: string;
  icon: string;
  category: string;
  categoryEn: string;
  owner: string;
  ownerEn: string;
  description: string;
  descriptionEn: string;
  stats: TalentStat[];
  highlights: string[];
  highlightsEn: string[];
  status: string;
  statusEn: string;
  statusTone: TalentStatusTone;
  url: string;
  profile: TalentProfile;
}

export const programmes: TalentProgramme[] = [
  {
    id: 'ai-apprenticeship-programme',
    name: 'AI 学徒计划',
    nameEn: 'AI Apprenticeship Programme (AIAP)',
    shortName: 'AIAP',
    icon: 'tabler:target-arrow',
    category: '职业转型',
    categoryEn: 'Career conversion',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description:
      '新加坡旗舰 AI 工程人才培养项目：6 或 9 个月全职训练，学员在真实产业项目中补齐工程、MLOps 与部署能力。',
    descriptionEn:
      'Singapore flagship AI engineering apprenticeship: 6 or 9 months of full-time training, with apprentices building engineering, MLOps and deployment capability on real industry projects.',
    stats: [
      { label: '时长', labelEn: 'Duration', value: '6 / 9 个月', valueEn: '6 / 9 months' },
      { label: '津贴', labelEn: 'Stipend', value: 'SGD 4,000/月', valueEn: 'SGD 4,000/month' },
      { label: '就业率', labelEn: 'Placement rate', value: '90%+', valueEn: '90%+' },
      { label: '地点', labelEn: 'Venue', value: 'NTU 校园', valueEn: 'NTU campus' },
    ],
    highlights: ['3 个月深度训练', '3 或 6 个月真实项目', '两阶段技术选拔', 'Batch 24/25 申请期开放'],
    highlightsEn: [
      '3-month deep-skilling phase',
      '3 or 6 months on real-world projects',
      'Two-stage technical selection',
      'Batch 24/25 application window open',
    ],
    status: 'Batch 24/25 招募中',
    statusEn: 'Batch 24/25 recruiting',
    statusTone: 'active',
    url: 'https://aiap.sg/apprenticeship/',
    profile: {
      facts: [
        { label: '承办方', labelEn: 'Owner', value: 'AI Singapore', valueEn: 'AI Singapore' },
        {
          label: '对象',
          labelEn: 'Audience',
          value: '新加坡公民；持 NITEC、Diploma 或 Degree；符合 TeSA CLT 资助条件',
          valueEn: 'Singapore citizens with NITEC, Diploma or Degree, and eligible for TeSA CLT funding',
        },
        {
          label: '入门要求',
          labelEn: 'Entry bar',
          value: 'Python、机器学习、MLOps / 部署、数据技术与文档能力',
          valueEn: 'Python, machine learning, MLOps / deployment, data technologies and documentation',
        },
        {
          label: '当前窗口',
          labelEn: 'Current window',
          value: '2026-04-29 至 2026-06-01',
          valueEn: '29 Apr 2026 to 1 Jun 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'AIAP 是新加坡“自己长出 AI 工程师”的主通道。它不只是上课，而是把有基础的人放进真实 AI 项目里，让他们经历数据、模型、部署、治理和客户问题的完整闭环。',
          bodyEn:
            'AIAP is Singapore main channel for growing local AI engineers. It is not just coursework: technically ready candidates are placed into real AI projects, covering data, models, deployment, governance and stakeholder problems end to end.',
        },
        {
          title: '项目怎样运行',
          titleEn: 'How It Works',
          body: '路径分两段：先做 3 个月深度训练，覆盖经典机器学习、LLM、MLOps、计算机视觉和 AI 治理；再进入 3 或 6 个月项目期，和 AI Singapore 工程师、MLOps 工程师、项目经理及 PI 一起交付产业项目。',
          bodyEn:
            'The path has two phases: 3 months of deep-skilling across classical ML, LLMs, MLOps, computer vision and AI governance, followed by a 3- or 6-month project phase with AI Singapore engineers, MLOps engineers, project managers and principal investigators.',
          bullets: [
            '全职项目，需线下投入',
            '技术评估包含 6 天 take-home 与面试',
            '毕业后常见方向包括 AI Engineer、MLOps Engineer、Data Scientist',
          ],
          bulletsEn: [
            'Full-time commitment with in-person work',
            'Selection includes a 6-day take-home technical assessment and interview',
            'Common graduate roles include AI Engineer, MLOps Engineer and Data Scientist',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '这是新加坡人才体系里最像“产线”的项目：规模不算巨大，但信号很强。它把 AI Singapore 的企业项目、政府资助和本地人才培养绑在一起，形成雇主可理解的能力证明。',
          bodyEn:
            'This is the closest thing to a production line in Singapore AI talent system. The absolute scale is limited, but the signal is strong: enterprise projects, public funding and local talent development are bundled into a credential employers can understand.',
        },
      ],
      sourceLabel: 'AIAP 官方页面',
      sourceLabelEn: 'Official AIAP page',
      sourceUrl: 'https://aiap.sg/apprenticeship/',
      sourceNote: '申请状态、批次日期和资格条件以官方页面为准。',
      sourceNoteEn: 'Application status, cohort dates and eligibility should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'llm-application-developer-programme',
    name: 'LLM 应用开发者计划',
    nameEn: 'LLM Application Developer Programme (LADP)',
    shortName: 'LADP',
    icon: 'tabler:device-laptop',
    category: '企业 GenAI 落地',
    categoryEn: 'Enterprise GenAI adoption',
    owner: 'AI Singapore + SGTech',
    ownerEn: 'AI Singapore + SGTech',
    description: '面向企业团队的 16 周生成式 AI 项目制训练，目标是把公司内部问题做成可部署的 LLM 应用。',
    descriptionEn:
      'A 16-week project-based GenAI programme for company teams, designed to turn workplace problem statements into deployable LLM applications.',
    stats: [
      { label: '时长', labelEn: 'Duration', value: '16 周', valueEn: '16 weeks' },
      { label: '团队规模', labelEn: 'Team size', value: '2-4 人', valueEn: '2-4 people' },
      { label: '导师咨询', labelEn: 'Mentor consults', value: '最多 24 小时/队', valueEn: 'Up to 24 hours/team' },
      { label: '公民费用', labelEn: 'Citizen fee', value: 'SGD 3,600', valueEn: 'SGD 3,600' },
    ],
    highlights: [
      '4 周自学 + 12 周项目',
      '企业自带问题陈述',
      'Prompt Engineering / RAG / Agent',
      'Intake 10 预计 Q2 2026 开放',
    ],
    highlightsEn: [
      '4 weeks self-learning + 12 weeks project',
      'Company-owned problem statement',
      'Prompt engineering, RAG and agents',
      'Intake 10 expected to open in Q2 2026',
    ],
    status: 'Intake 10：2026 Q2',
    statusEn: 'Intake 10: Q2 2026',
    statusTone: 'scheduled',
    url: 'https://aiap.sg/ladp/',
    profile: {
      facts: [
        {
          label: '参与方',
          labelEn: 'Participants',
          value: '新加坡注册公司或公共机构；每个项目 2-4 名员工',
          valueEn: 'Singapore-registered companies or public agencies; 2-4 staff per project',
        },
        {
          label: '前置条件',
          labelEn: 'Prerequisite',
          value: '公司已有待部署的 LLM 应用问题陈述，并获直属主管背书',
          valueEn: 'A workplace LLM application problem statement with reporting-officer endorsement',
        },
        {
          label: '交付物',
          labelEn: 'Deliverable',
          value: '可部署的 LLM 应用',
          valueEn: 'Deployable LLM-powered application',
        },
        {
          label: '补贴说明',
          labelEn: 'Funding note',
          value: 'SkillsFuture 不适用；雇主可另看 CCP 支持',
          valueEn: 'SkillsFuture does not apply; employers may separately explore CCP support',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'LADP 针对的不是个人转行，而是企业内部的生成式 AI 采用。它要求公司带着真实业务问题进来，训练员工把 LLM、RAG、Agent 和治理原则合成一个能在工作场景部署的应用。',
          bodyEn:
            'LADP is not an individual career-switching course. It targets enterprise GenAI adoption: companies bring real workplace problems, and staff learn to combine LLMs, RAG, agents and governance into deployable applications.',
        },
        {
          title: '项目怎样运行',
          titleEn: 'How It Works',
          body: '前 4 周是异步学习，建立 LLM、Prompt Engineering、ReAct、RAG、Agent 和负责任开发的基础；后 12 周是项目期，团队用自己的问题陈述做应用，并通过 AISG 导师咨询推进。',
          bodyEn:
            'The first 4 weeks are asynchronous learning across LLMs, prompt engineering, ReAct, RAG, agents and responsible development. The next 12 weeks are the project phase, where teams build against their own problem statement with AISG mentor consultations.',
          bullets: [
            '每班最多 20 名学员',
            '项目咨询至少 6 次，每次最多 2 小时',
            '应用通常需要企业自己的云平台或内部批准平台',
          ],
          bulletsEn: [
            'Maximum 20 participants per class',
            'At least 6 project consultations, up to 2 hours each',
            'Projects usually require a company-approved cloud or internal platform',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '这是 AIAP 模型向企业内部迁移的版本。它的价值不在“教会 LLM 概念”，而在迫使公司把模糊的 AI 兴趣变成具体业务问题、团队配置和部署责任。',
          bodyEn:
            'This is the AIAP model moved inside companies. Its value is not merely teaching LLM concepts; it forces fuzzy AI interest into a concrete problem statement, team structure and deployment responsibility.',
        },
      ],
      sourceLabel: 'LADP 官方页面',
      sourceLabelEn: 'Official LADP page',
      sourceUrl: 'https://aiap.sg/ladp/',
      sourceNote: 'Intake、费用和资助信息变化较快，以官方页面为准。',
      sourceNoteEn: 'Intake, fee and funding details change quickly; confirm on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'aisg-phd-fellowship',
    name: 'AI 博士奖学金',
    nameEn: 'AISG PhD Fellowship Programme',
    shortName: 'PhD Fellowship',
    icon: 'tabler:microscope',
    category: '基础研究人才',
    categoryEn: 'Research talent',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '资助在新加坡自治大学攻读 AI 基础研究博士的人才，重点支持可信、隐私、资源高效、协作与持续学习等方向。',
    descriptionEn:
      'Funding for PhD candidates pursuing fundamental AI research at Singapore autonomous universities, with focus areas including trustworthy, privacy-aware, resource-efficient, collaborative and continuous-learning AI.',
    stats: [
      { label: '最长资助', labelEn: 'Maximum support', value: '4 年', valueEn: '4 years' },
      { label: '月度津贴', labelEn: 'Monthly stipend', value: '最高 SGD 6,700', valueEn: 'Up to SGD 6,700' },
      { label: '会议津贴', labelEn: 'Conference allowance', value: '最高 SGD 8,000', valueEn: 'Up to SGD 8,000' },
      { label: '国籍限制', labelEn: 'Nationality restriction', value: '无', valueEn: 'None' },
    ],
    highlights: ['NUS / NTU / SMU / SUTD', '大学提名制', '全额学费支持', '要求顶会/顶刊级研究产出'],
    highlightsEn: [
      'NUS, NTU, SMU or SUTD',
      'University nomination model',
      'Full tuition fee support',
      'Expected top-tier AI research output',
    ],
    status: '2026 提名已截止',
    statusEn: '2026 nomination closed',
    statusTone: 'closed',
    url: 'https://aisingapore.org/research/phd-fellowship-programme/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '大学范围',
          labelEn: 'Universities',
          value: 'NUS、NTU、SMU、SUTD',
          valueEn: 'NUS, NTU, SMU and SUTD',
        },
        {
          label: '申请方式',
          labelEn: 'Application model',
          value: '由大学推荐给 AI Singapore',
          valueEn: 'Universities nominate suitable candidates to AI Singapore',
        },
        {
          label: '2026 截止',
          labelEn: '2026 deadline',
          value: '2026-04-15 17:00 SGT',
          valueEn: '15 Apr 2026, 5:00 PM SGT',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: '新加坡的 AI 战略不能只靠应用工程，也需要能在国际顶会和核心算法上留下名字的研究人才。博士奖学金把资助、大学提名和 AISG 研究主题连接起来，形成基础研究人才储备。',
          bodyEn:
            'Singapore AI strategy cannot rely only on applied engineering. It also needs researchers who can publish at top venues and contribute to core algorithms. The fellowship connects funding, university nominations and AISG research themes into a fundamental research pipeline.',
        },
        {
          title: '研究方向',
          titleEn: 'Research Themes',
          body: '官方重点包括可信与可解释 AI、隐私感知 AI、资源高效 AI、协作 AI、持续学习 AI。这些方向都贴合新加坡的小国约束：数据敏感、算力有限、治理品牌强、需要跨语言跨机构协作。',
          bodyEn:
            'Official themes include trustworthy and explainable AI, privacy-aware AI, resource-efficient AI, collaborative AI and continuous-learning AI. These fit Singapore constraints: sensitive data, limited compute, a strong trust brand and the need for cross-lingual, cross-institution collaboration.',
          bullets: ['鼓励所有国籍申请', '新加坡公民、永久居民和东盟申请者尤其受鼓励', '研究期间可参与 AISG 其他项目'],
          bulletsEn: [
            'Open to all nationalities',
            'Singapore citizens, permanent residents and ASEAN applicants are especially encouraged',
            'Fellows may participate in other AISG initiatives',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '这张卡片不应只被看成奖学金。它是新加坡把大学研究、国家 AI 主题和人才留存绑在一起的制度工具。',
          bodyEn:
            'This should not be read as just a scholarship. It is an institutional tool for tying university research, national AI themes and talent retention together.',
        },
      ],
      sourceLabel: 'AISG PhD Fellowship 官方页面',
      sourceLabelEn: 'Official AISG PhD Fellowship page',
      sourceUrl: 'https://aisingapore.org/research/phd-fellowship-programme/',
      sourceNote: '下一轮 intake、提名窗口和大学要求以官方页面和各大学研究生院为准。',
      sourceNoteEn:
        'Next intake, nomination windows and university-specific requirements should be confirmed on the official page and university graduate offices.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-accelerated-masters-programme',
    name: 'AI 硕士加速计划',
    nameEn: 'AI Accelerated Masters Programme (AMP)',
    shortName: 'AMP',
    icon: 'tabler:bolt',
    category: '本硕研究通道',
    categoryEn: 'Undergrad-to-master research path',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '面向新加坡公民的 AI 研究型硕士快车道，在本科最后阶段提前资助，并支持毕业后一年内完成研究型硕士。',
    descriptionEn:
      'A fast-track AI research route for Singapore citizens, supporting students near the end of undergraduate study and through a one-year Masters by Research.',
    stats: [
      { label: '支持期', labelEn: 'Support period', value: '最长 2 年', valueEn: 'Up to 2 years' },
      { label: '本科津贴', labelEn: 'Undergrad allowance', value: 'SGD 2,000/月', valueEn: 'SGD 2,000/month' },
      { label: '硕士津贴', labelEn: 'Masters stipend', value: '最高 SGD 3,500/月', valueEn: 'Up to SGD 3,500/month' },
      { label: '对象', labelEn: 'Audience', value: '新加坡公民', valueEn: 'Singapore citizens' },
    ],
    highlights: ['本科倒数第二年申请', '研究型硕士', '大学提名制', '全额硕士学费支持'],
    highlightsEn: [
      'Apply in penultimate undergraduate year',
      'Masters by Research',
      'University nomination model',
      'Full Masters tuition fee support',
    ],
    status: '下一轮待公布',
    statusEn: 'Next round TBA',
    statusTone: 'scheduled',
    url: 'https://aisingapore.org/research/ai-amp/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '对象',
          labelEn: 'Audience',
          value: '新加坡自治大学 AI 相关本科倒数第二年学生',
          valueEn: 'Penultimate-year AI-related undergraduates at Singapore autonomous universities',
        },
        {
          label: '学历路径',
          labelEn: 'Degree path',
          value: '本科毕业后一年内完成研究型硕士',
          valueEn: 'Complete a Masters by Research within a year after undergraduate graduation',
        },
        {
          label: '最近更新',
          labelEn: 'Latest official update',
          value: '2025-07-04',
          valueEn: '4 Jul 2025',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'AMP 补的是“本科优秀研究苗子到博士之前”的断层。它把本科后期、研究型硕士和 AI Singapore 研究主题连成一条更短的学术路径，降低优秀学生被工业界或海外项目提前吸走的概率。',
          bodyEn:
            'AMP addresses the gap between strong undergraduate research talent and later PhD-level research. It links late undergraduate study, a Masters by Research and AISG research themes into a shorter academic route, reducing the chance that strong students are pulled away too early by industry or overseas programmes.',
        },
        {
          title: '项目怎样运行',
          titleEn: 'How It Works',
          body: '项目最多支持两年：本科阶段最多一年生活津贴，硕士阶段最多一年津贴与全额本地学费。申请由大学推荐，需要学生已有 AI 研究经历，如 UROP、研究实习或 AI 顶会主轨论文。',
          bodyEn:
            'Support can last up to two years: up to one year of undergraduate allowance, then up to one year of Masters stipend and full local tuition. Universities nominate candidates, who need prior AI research experience such as UROP, research attachment or a main-track AI publication.',
          bullets: ['仅限新加坡公民', '要求有明确研究兴趣', '研究主题与 AISG PhD Fellowship 相近'],
          bulletsEn: [
            'Singapore citizens only',
            'Requires clear research interest',
            'Research themes are close to the AISG PhD Fellowship themes',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: 'AMP 是小国人才政策里很典型的一招：不是等博士阶段再抢人，而是在本科末期就把研究轨道铺好。',
          bodyEn:
            'AMP is a classic small-country talent move: do not wait until the PhD stage to compete for talent; build the research track before undergraduate graduation.',
        },
      ],
      sourceLabel: 'AI AMP 官方页面',
      sourceLabelEn: 'Official AI AMP page',
      sourceUrl: 'https://aisingapore.org/research/ai-amp/',
      sourceNote: '下一轮开放时间以官方页面为准。',
      sourceNoteEn: 'Next-round timing should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'learnai-ai4i',
    name: 'LearnAI / AI4I',
    nameEn: 'LearnAI / AI for Industry',
    shortName: 'LearnAI',
    icon: 'tabler:book-2',
    category: '全民与职场学习',
    categoryEn: 'Public and workforce learning',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description: 'AI Singapore 的在线学习入口，覆盖 AI 素养、AI4I、AI4K、教育者课程、行业项目和第三方学习资源。',
    descriptionEn:
      'AI Singapore online learning gateway, covering AI literacy, AI4I, AI4K, educator courses, industry projects and partner learning resources.',
    stats: [
      { label: '形式', labelEn: 'Format', value: '在线自学', valueEn: 'Self-paced online' },
      { label: '层级', labelEn: 'Levels', value: 'Exposure 至 Advanced', valueEn: 'Exposure to Advanced' },
      { label: '课程数', labelEn: 'Course count', value: '90+ 资源', valueEn: '90+ resources' },
      {
        label: '对象',
        labelEn: 'Audience',
        value: '学生 / 教师 / 职场人士',
        valueEn: 'Students, educators and workers',
      },
    ],
    highlights: ['AI4I / AI4K 系列', 'OpenAI Academy 等伙伴资源', '教师与学生专区', '部分课程可走 SkillsFuture'],
    highlightsEn: [
      'AI4I and AI4K series',
      'Partner resources including OpenAI Academy',
      'Student and educator tracks',
      'Some courses may be SkillsFuture-claimable',
    ],
    status: '持续开放',
    statusEn: 'Evergreen',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '课程类型',
          labelEn: 'Course types',
          value: '理论、实操、行业项目、教师资源、儿童 AI',
          valueEn: 'Theory, practical labs, industry projects, educator resources and AI for kids',
        },
        {
          label: '典型时长',
          labelEn: 'Typical duration',
          value: '0.5 小时至 140 小时不等',
          valueEn: 'Ranges from 0.5 hour to 140 hours',
        },
        {
          label: '定位',
          labelEn: 'Role',
          value: '人才漏斗最宽的一层',
          valueEn: 'The widest layer of the talent funnel',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'LearnAI 解决的是“全民和职场基础 AI 能力”的入口问题。它把学生、教师、专业人士和企业学习资源集中到一个平台上，让 AI 学习不是只发生在大学或少数工程训练营里。',
          bodyEn:
            'LearnAI solves the entry-point problem for broad AI literacy and workforce capability. It concentrates student, educator, professional and enterprise learning resources into one platform, so AI learning is not limited to universities or a few engineering bootcamps.',
        },
        {
          title: '内容怎样组织',
          titleEn: 'How The Content Is Organised',
          body: '课程覆盖从 Exposure、Basic 到 Advanced 的不同层级，也区分 Theory、Practical、Theory + Practical。它既有 AI4I 这样的职场课程，也有 AI4K、教师 AI 素养、行业项目案例和第三方平台课程。',
          bodyEn:
            'Courses span Exposure, Basic and Advanced levels, and are marked as Theory, Practical or Theory + Practical. The catalogue includes workforce AI4I courses, AI4K, educator AI literacy, industry project cases and partner-platform courses.',
          bullets: ['适合作为 AIAP / LADP 前置学习池', '覆盖非工程人群', '也是学校和教师资源入口'],
          bulletsEn: [
            'Useful as a preparation pool for AIAP and LADP',
            'Covers non-engineering audiences',
            'Also serves as a school and educator resource gateway',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: 'LearnAI 的重要性在于广度。它不保证培养高级工程师，但能提高整个社会讨论和采用 AI 的基线。',
          bodyEn:
            'LearnAI matters because of breadth. It does not guarantee advanced AI engineers, but it raises the baseline for how society discusses and adopts AI.',
        },
      ],
      sourceLabel: 'LearnAI 官方课程目录',
      sourceLabelEn: 'Official LearnAI catalogue',
      sourceUrl: 'https://learn.aisingapore.org/',
      sourceNote: '课程数量、费用和补贴资格会随目录更新而变化。',
      sourceNoteEn: 'Course count, fees and subsidy eligibility change as the catalogue evolves.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'national-ai-student-challenge',
    name: '全国 AI 学生挑战赛',
    nameEn: 'National AI Student Challenge (NAISC)',
    shortName: 'NAISC',
    icon: 'tabler:trophy',
    category: '学生实践竞赛',
    categoryEn: 'Student applied challenge',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description: '面向学生的全国性 AI 实战挑战赛，2026 年设置 8 个赛道，让学生围绕真实企业和社会问题做 AI 原型。',
    descriptionEn:
      'A national applied AI challenge for students. The 2026 edition has 8 tracks where students build AI prototypes around real enterprise and societal problem statements.',
    stats: [
      { label: '2026 赛道', labelEn: '2026 tracks', value: '8 个', valueEn: '8' },
      { label: '报名期', labelEn: 'Registration', value: '1 月 5 日-2 月 16 日', valueEn: '5 Jan-16 Feb' },
      { label: '总决赛', labelEn: 'Grand Final', value: '5 月 22-23 日', valueEn: '22-23 May' },
      { label: '团队', labelEn: 'Team size', value: '按赛道不同', valueEn: 'Varies by track' },
    ],
    highlights: ['真实问题陈述', '企业与机构赛道主', '导师和工作坊', '优胜队伍可获奖项或实习机会'],
    highlightsEn: [
      'Real problem statements',
      'Enterprise and institutional track owners',
      'Mentorship and workshops',
      'Winners may receive prizes or internship opportunities',
    ],
    status: '2026 决赛阶段',
    statusEn: '2026 finalist phase',
    statusTone: 'scheduled',
    url: 'https://naisc.aisingapore.org/',
    profile: {
      facts: [
        { label: '承办方', labelEn: 'Owner', value: 'AI Singapore', valueEn: 'AI Singapore' },
        {
          label: '赛道类型',
          labelEn: 'Track types',
          value: '7 个本地赛道 + 1 个区域 AI Ready ASEAN 赛道',
          valueEn: '7 local tracks + 1 regional AI Ready ASEAN track',
        },
        {
          label: '对象',
          labelEn: 'Audience',
          value: '中学、JC、ITE、理工学院、大学和 NS 全职服役人员等，按赛道不同',
          valueEn: 'Secondary, JC, ITE, polytechnic, university and full-time NSF students, depending on track',
        },
        {
          label: '2026 总决赛',
          labelEn: '2026 Grand Final',
          value: 'AI Student Developer Conference，2026-05-22 至 2026-05-23',
          valueEn: 'AI Student Developer Conference, 22-23 May 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'NAISC 让学生更早接触真实 AI 问题，而不是停留在课堂练习。2026 年赛道覆盖安全、预测维护、学生支持、失智照护、日志解析、数据漂移、业务自动化和区域 AI Ready ASEAN。',
          bodyEn:
            'NAISC gives students early exposure to real AI problems beyond classroom exercises. The 2026 tracks cover security, predictive maintenance, student support, dementia care, log parsing, data drift, business automation and regional AI Ready ASEAN.',
        },
        {
          title: '项目怎样运行',
          titleEn: 'How It Works',
          body: '学生先报名具体赛道，入选后参加 partner briefing 和 problem statement 讲解，再在 4-5 月提交作品并进入决赛。交付物通常包括方案说明、视频 demo、GitHub 仓库或现场演示，具体由赛道定义。',
          bodyEn:
            'Students register for specific tracks, attend partner briefings and problem-statement walkthroughs, then submit in April-May and proceed to finals. Deliverables often include solution slides, video demos, GitHub repositories or live demos, depending on the track.',
          bullets: ['赛道名额有限，先到先得', '报名条件按赛道不同', '部分赛道提供实习机会或现金奖项'],
          bulletsEn: [
            'Track capacity is limited and first-come-first-served',
            'Eligibility varies by track',
            'Some tracks offer internship opportunities or cash prizes',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '这是新加坡学生人才漏斗的“项目感”入口。它让企业和社会问题进入学生训练，也让学生作品更像未来申请、实习和创业的证据。',
          bodyEn:
            'This is the project-based entry point of Singapore student talent funnel. It brings enterprise and social problems into student training, and makes student work more useful as evidence for future applications, internships and startups.',
        },
      ],
      sourceLabel: 'NAISC 官方页面',
      sourceLabelEn: 'Official NAISC page',
      sourceUrl: 'https://naisc.aisingapore.org/',
      sourceNote: '各赛道资格、交付物和日期以官方页面为准。',
      sourceNoteEn: 'Track eligibility, deliverables and dates should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'international-olympiad-in-ai-2027',
    name: 'IOAI 2027 新加坡',
    nameEn: 'International Olympiad in AI 2027 Singapore',
    shortName: 'IOAI 2027',
    icon: 'tabler:world',
    category: '国际青年赛事',
    categoryEn: 'International youth competition',
    owner: 'AI Singapore + NTU',
    ownerEn: 'AI Singapore + NTU',
    description: '2027 年第四届 International Olympiad in AI 将在新加坡举行，由 AI Singapore 和南洋理工大学共同主办。',
    descriptionEn:
      'The 4th International Olympiad in AI will be held in Singapore in 2027, co-hosted by AI Singapore and Nanyang Technological University.',
    stats: [
      { label: '届数', labelEn: 'Edition', value: '第 4 届', valueEn: '4th edition' },
      { label: '年份', labelEn: 'Year', value: '2027', valueEn: '2027' },
      { label: '主办地', labelEn: 'Host city', value: '新加坡', valueEn: 'Singapore' },
      { label: '共同主办', labelEn: 'Co-hosts', value: 'AISG + NTU', valueEn: 'AISG + NTU' },
    ],
    highlights: ['全球高中生 AI 竞赛', '新加坡首次主办', 'NOAI 作为本地选拔通道', '展示新加坡 AI 教育品牌'],
    highlightsEn: [
      'Global AI competition for high-school students',
      'Singapore first time hosting',
      'NOAI serves as local selection path',
      'Showcases Singapore AI education brand',
    ],
    status: '2027 主办',
    statusEn: 'Hosting in 2027',
    statusTone: 'scheduled',
    url: 'https://ioai-official.org/singapore-2027/',
    profile: {
      facts: [
        {
          label: '共同主办',
          labelEn: 'Co-hosts',
          value: 'AI Singapore、Nanyang Technological University',
          valueEn: 'AI Singapore and Nanyang Technological University',
        },
        {
          label: '赛事定位',
          labelEn: 'Competition role',
          value: '面向高中生的国际科学奥林匹克赛事',
          valueEn: 'International Science Olympiad-style competition for high-school students',
        },
        {
          label: '本地通道',
          labelEn: 'Local pathway',
          value: 'National Olympiad in AI (NOAI)',
          valueEn: 'National Olympiad in AI (NOAI)',
        },
        {
          label: '新加坡队路径',
          labelEn: 'Singapore team path',
          value: 'NOAI Final 后约 50-60 人进入 NTU 训练，最终选 8 人代表新加坡',
          valueEn: 'After the NOAI Final, around 50-60 students enter NTU training; the final 8 represent Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'IOAI 2027 是新加坡 AI 教育的一次国际展示。它不仅是赛事承办，也把 NOAI、NTU 训练和全球 AI 青少年网络串起来，形成从校内兴趣到国际舞台的路径。',
          bodyEn:
            'IOAI 2027 is an international showcase for Singapore AI education. It is not only event hosting; it links NOAI, NTU training and the global youth AI network into a path from school interest to international competition.',
        },
        {
          title: '本地选拔链路',
          titleEn: 'Local Selection Chain',
          body: '新加坡通过 NOAI 做本地选拔。NOAI 2026 包含学校意向窗口、预赛、决赛、NTU 训练、boot camp 和最终代表队遴选。',
          bodyEn:
            'Singapore uses NOAI as the local selection path. NOAI 2026 includes school interest registration, preliminaries, finals, NTU training, boot camp and final team selection.',
          bullets: [
            '预赛用于筛选进入决赛的前 150 名',
            '决赛后约 50-60 名学生进入进一步训练',
            '最终 8 名学生代表新加坡参加 IOAI',
          ],
          bulletsEn: [
            'The preliminary round filters toward the top 150 finalists',
            'Around 50-60 students continue into further training after the final',
            'The final 8 students represent Singapore at IOAI',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '主办 IOAI 的意义不只是“办一场比赛”。它给新加坡一个公开叙事：这里不只是部署 AI 的地方，也是训练下一代 AI 人才的地方。',
          bodyEn:
            'Hosting IOAI is not just about running a contest. It gives Singapore a public narrative: this is not only a place that deploys AI, but a place that trains the next generation of AI talent.',
        },
      ],
      sourceLabel: 'IOAI 2027 官方页面',
      sourceLabelEn: 'Official IOAI 2027 page',
      sourceUrl: 'https://ioai-official.org/singapore-2027/',
      sourceNote: '赛事日期、代表队选拔和报名安排以 IOAI / AISG 官方页面为准。',
      sourceNoteEn:
        'Competition dates, team selection and registration details should be confirmed on IOAI / AISG official pages.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-singapore-goes-to-school',
    name: 'AI 进校园',
    nameEn: 'AI Singapore Goes to School / TWA+',
    shortName: 'AI Goes to School',
    icon: 'tabler:school',
    category: '中小学与教师',
    categoryEn: 'Schools and educators',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description:
      '面向中小学和教师的 AI 启蒙与教学能力建设组合，包括 2 小时学生入门课、AI4K、AI for Students 和 TWA+ 教师培训。',
    descriptionEn:
      'A school and educator enablement bundle, including a 2-hour student introduction, AI4K, AI for Students and the TWA+ teacher work-attachment programme.',
    stats: [
      { label: '学生入门', labelEn: 'Student intro', value: '2 小时', valueEn: '2 hours' },
      { label: '儿童 AI', labelEn: 'AI for kids', value: 'P3-P6', valueEn: 'P3-P6' },
      { label: '教师培训', labelEn: 'Teacher training', value: 'TWA+', valueEn: 'TWA+' },
      { label: '渠道', labelEn: 'Channel', value: '学校 / 教师', valueEn: 'Schools / educators' },
    ],
    highlights: ['AI Singapore Goes To School', 'AI4K 儿童课程', '教师 AI 素养提升', '公校 AI 教学资源'],
    highlightsEn: [
      'AI Singapore Goes To School',
      'AI4K courses for kids',
      'Teacher AI literacy',
      'AI classroom resources for public schools',
    ],
    status: '持续推进',
    statusEn: 'Ongoing',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/home-2-2/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '学生课',
          labelEn: 'Student session',
          value: 'AI Singapore Goes To School：2 小时 AI 基础和 ChatGPT 应用介绍',
          valueEn: 'AI Singapore Goes To School: 2-hour introduction to AI basics and ChatGPT applications',
        },
        {
          label: '儿童课程',
          labelEn: 'Kids track',
          value: 'AI For Kids 面向 Primary 3-6',
          valueEn: 'AI For Kids for Primary 3-6 students',
        },
        {
          label: '教师项目',
          labelEn: 'Educator track',
          value: 'TWA+ Programme @ AI Singapore',
          valueEn: 'TWA+ Programme @ AI Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleEn: 'What It Solves',
          body: 'AI 人才培养如果只从大学开始就太晚了。AI 进校园把 AI 基础认知、教师培训和校内资源放到更早阶段，让学生和教师先形成共同语言。',
          bodyEn:
            'If AI talent development starts only at university, it is too late. AI Singapore Goes to School moves baseline AI literacy, teacher training and classroom resources earlier, giving students and educators a shared language.',
        },
        {
          title: '内容怎样组合',
          titleEn: 'How The Bundle Fits Together',
          body: '学生侧有 2 小时入门课、AI4K、AI for Students 和学生自学资源；教师侧有 TWA+ 和教育者 AI 素养课程。它不是单一课程，而是一个低龄化 AI 学习入口。',
          bodyEn:
            'On the student side, the bundle includes a 2-hour introduction, AI4K, AI for Students and self-learning resources. On the educator side, it includes TWA+ and educator AI-literacy courses. It is not a single course, but an early-stage AI learning entry point.',
          bullets: ['适合学校批量触达', '教师培训决定课堂扩散能力', '与 NAISC / NOAI 形成学生漏斗'],
          bulletsEn: [
            'Suitable for school-level reach',
            'Teacher training determines classroom diffusion',
            'Forms a student funnel with NAISC and NOAI',
          ],
        },
        {
          title: '观察',
          titleEn: 'Editorial Read',
          body: '这是最容易被低估的一层。高端人才来自少数人，但社会 AI 采用来自大量普通学生和教师的早期熟悉。',
          bodyEn:
            'This layer is easy to underestimate. Elite talent comes from a small group, but societal AI adoption comes from early familiarity among many ordinary students and teachers.',
        },
      ],
      sourceLabel: 'AI Singapore / LearnAI 官方页面',
      sourceLabelEn: 'Official AI Singapore / LearnAI pages',
      sourceUrl: 'https://learn.aisingapore.org/home-2-2/',
      sourceNote: '学校项目、教师项目和课程目录会持续更新。',
      sourceNoteEn: 'School programmes, educator programmes and course catalogues continue to evolve.',
      lastChecked: talentDataDate,
    },
  },
];

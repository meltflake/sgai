export interface TalentStat {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface TalentProgramme {
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  stats: TalentStat[];
  highlights: string[];
  highlightsEn?: string[];
  status?: string;
  statusEn?: string;
  url?: string;
}

export const programmes: TalentProgramme[] = [
  {
    name: 'AI 学徒计划',
    nameEn: 'AI Apprenticeship Programme (AIAP)',
    icon: '🎯',
    description: '新加坡旗舰 AI 工程人才培养项目，提供沉浸式实战训练，学员在真实 AI 项目中与导师并肩工作。',
    descriptionEn:
      "Singapore's flagship AI engineering programme — full-time immersive training, with apprentices working alongside mentors on real AI projects.",
    stats: [
      { label: '时长', labelEn: 'Duration', value: '9 个月 / 6 个月', valueEn: '9 months / 6 months' },
      { label: '津贴', labelEn: 'Stipend', value: 'SGD 4,000/月', valueEn: 'SGD 4,000/month' },
      { label: '已培养批次', labelEn: 'Cohorts to date', value: '22+ 批', valueEn: '22+ cohorts' },
      { label: '就业率', labelEn: 'Placement rate', value: '90%+', valueEn: '90%+' },
    ],
    highlights: ['全职沉浸式 AI 工程训练', '参与 AI Singapore 真实项目', '提供生活津贴', 'Batch 23 正在招募'],
    highlightsEn: [
      'Full-time immersive AI engineering training',
      'Work on real AI Singapore projects',
      'Living stipend provided',
      'Batch 23 currently recruiting',
    ],
    status: '🟢 招募中',
    statusEn: '🟢 Recruiting',
    url: 'https://aisingapore.org/innovation/aiap/',
  },
  {
    name: '学习者 AI 开发计划',
    nameEn: 'Learners AI Development Programme (LADP)',
    icon: '💻',
    description: '16 周实战项目，2-4 人组队开发 AI 解决方案，适合有一定技术基础的学习者。',
    descriptionEn:
      '16-week hands-on programme — teams of 2-4 build AI projects; designed for learners with some technical background.',
    stats: [
      { label: '时长', labelEn: 'Duration', value: '16 周', valueEn: '16 weeks' },
      { label: '团队规模', labelEn: 'Team size', value: '2-4 人', valueEn: '2-4 people' },
      {
        label: '费用（公民补贴后）',
        labelEn: 'Fee (post-citizen subsidy)',
        value: 'SGD 3,600',
        valueEn: 'SGD 3,600',
      },
    ],
    highlights: ['团队协作开发 AI 项目', '导师指导', 'SkillsFuture 可报销', 'Intake 9 开放中'],
    highlightsEn: [
      'Build AI projects in collaborative teams',
      'Mentor guidance',
      'SkillsFuture Credit eligible',
      'Intake 9 currently open',
    ],
    status: '🟢 报名中',
    statusEn: '🟢 Open for applications',
    url: 'https://aisingapore.org/innovation/ladp/',
  },
  {
    name: 'AI 博士奖学金',
    nameEn: 'PhD Fellowship Programme',
    icon: '🎓',
    description: '资助优秀博士生从事 AI 前沿研究，无国籍限制，在新加坡顶尖大学完成博士学位。',
    descriptionEn:
      'Funds outstanding PhD candidates pursuing frontier AI research at top Singapore universities. Open to all nationalities.',
    stats: [
      { label: '最长资助', labelEn: 'Maximum funding period', value: '4 年', valueEn: '4 years' },
      { label: '月度津贴', labelEn: 'Monthly stipend', value: 'SGD 6,700/月', valueEn: 'SGD 6,700/month' },
      { label: '国籍限制', labelEn: 'Nationality requirement', value: '无', valueEn: 'None' },
    ],
    highlights: ['在 NUS/NTU/SMU/SUTD 攻读博士', '与 AI Singapore 研究团队合作', '丰厚生活津贴', '无国籍限制'],
    highlightsEn: [
      'PhD studies at NUS, NTU, SMU or SUTD',
      'Collaborate with AI Singapore research teams',
      'Generous living stipend',
      'Open to all nationalities',
    ],
    url: 'https://aisingapore.org/talent/phd-fellowship/',
  },
  {
    name: '硕士加速计划',
    nameEn: 'Accelerated Masters Programme (AMP)',
    icon: '⚡',
    description: '本科到硕士的快车道，专为新加坡公民设计，2024 年启动。',
    descriptionEn: 'Fast track from undergraduate to master’s, designed for Singapore citizens. Launched in 2024.',
    stats: [
      { label: '启动年份', labelEn: 'Launch year', value: '2024', valueEn: '2024' },
      { label: '目标群体', labelEn: 'Target audience', value: '本科生', valueEn: 'Undergraduates' },
      {
        label: '国籍要求',
        labelEn: 'Nationality requirement',
        value: '新加坡公民',
        valueEn: 'Singapore citizens',
      },
    ],
    highlights: ['本硕连读快车道', '仅限新加坡公民', '与顶尖大学合作', '2024 年首批启动'],
    highlightsEn: [
      'Fast track from bachelor’s to master’s',
      'Singapore citizens only',
      'Partnership with top universities',
      'First cohort launched in 2024',
    ],
  },
  {
    name: 'LearnAI / AI4I',
    nameEn: 'LearnAI / AI for Industry',
    icon: '📚',
    description: '面向各层次学习者的在线 AI 课程，从入门到进阶，支持 SkillsFuture 补贴。',
    descriptionEn:
      'Online AI courses for learners at every level — from beginner to advanced, eligible for SkillsFuture subsidies.',
    stats: [
      { label: '课程类型', labelEn: 'Course format', value: '在线自学', valueEn: 'Self-paced online' },
      {
        label: '补贴',
        labelEn: 'Subsidy',
        value: 'SkillsFuture 可报销',
        valueEn: 'SkillsFuture Credit eligible',
      },
    ],
    highlights: [
      '从入门到进阶全覆盖',
      'AI for Everyone / AI for Industry 系列',
      'SkillsFuture Credit 可报销',
      '灵活在线学习',
    ],
    highlightsEn: [
      'Covers beginner to advanced',
      'AI for Everyone / AI for Industry series',
      'SkillsFuture Credit eligible',
      'Flexible online learning',
    ],
    url: 'https://learn.aisingapore.org/',
  },
  {
    name: '全国 AI 学生挑战赛',
    nameEn: 'National AI Student Challenge (NAISC)',
    icon: '🏆',
    description: '面向学生的全国性 AI 挑战赛，激发年轻一代的 AI 创新热情。',
    descriptionEn: 'National AI challenge for students, designed to spark AI innovation among the next generation.',
    stats: [
      { label: '参与人数', labelEn: 'Participants', value: '2,000+', valueEn: '2,000+' },
      { label: '赛道', labelEn: 'Tracks', value: '7 个', valueEn: '7' },
    ],
    highlights: ['面向大中小学生', '7 个不同赛道', '2000+ 参与者', '培养 AI 实践能力'],
    highlightsEn: [
      'Open to primary, secondary and tertiary students',
      '7 distinct tracks',
      '2,000+ participants',
      'Builds hands-on AI capability',
    ],
    url: 'https://aisingapore.org/talent/national-ai-student-challenge/',
  },
  {
    name: '国际 AI 奥林匹克竞赛',
    nameEn: 'International Olympiad in AI (IOAI)',
    icon: '🥇',
    description: '2027 年新加坡将主办国际 AI 奥林匹克竞赛，汇聚全球 AI 青年人才。',
    descriptionEn:
      'Singapore will host the International Olympiad in AI in 2027, bringing together top young AI talent from around the world.',
    stats: [
      { label: '主办年份', labelEn: 'Host year', value: '2027', valueEn: '2027' },
      { label: '地点', labelEn: 'Location', value: '新加坡', valueEn: 'Singapore' },
    ],
    highlights: ['全球顶级 AI 青年赛事', '新加坡首次主办', '2026 年先办国内选拔赛'],
    highlightsEn: [
      'World’s premier youth AI competition',
      'Singapore’s first time hosting',
      'Domestic qualifier in 2026',
    ],
  },
  {
    name: 'AI 进校园',
    nameEn: 'AI Singapore Goes to School / TWA+',
    icon: '🏫',
    description: 'AI 教育深入中小学，TWA+ 为教师提供 AI 教学培训。',
    descriptionEn:
      'Brings AI education into primary and secondary schools; TWA+ trains teachers to deliver AI lessons.',
    stats: [
      { label: '覆盖范围', labelEn: 'Coverage', value: '中小学', valueEn: 'Primary and secondary schools' },
      { label: '教师培训', labelEn: 'Teacher training', value: 'TWA+', valueEn: 'TWA+' },
    ],
    highlights: ['AI 教育低龄化', '教师 AI 素养提升 (TWA+)', '培养下一代 AI 原住民'],
    highlightsEn: [
      'Brings AI education to younger students',
      'Boosts teacher AI literacy (TWA+)',
      'Cultivates the next generation of AI natives',
    ],
  },
];

export interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}

export const autoDiscovered: AutoDiscoveredEntry[] = [
  {
    title: '新加坡政府科技局招聘',
    titleEn: 'Careers at GovTech Singapore',
    description: '新加坡政府科技局（GovTech）的招聘页面，介绍了工作专业人士和学生毕业生的职业机会。提供的项目包括实习、Smart Nation奖学金和技术助理项目。该页面强调通过创新、协作文化和有影响力的工作来塑造新加坡数字未来的机会。',
    descriptionEn: 'The careers page of Singapore\'s Government Technology Agency (GovTech), presenting employment opportunities for working professionals and students/graduates. Programmes include internships, Smart Nation Scholarship, and Technology Associate Programme. The page emphasizes opportunities to shape Singapore\'s digital future through innovation, collaborative culture, and impactful work.',
    category: '企业上手',
    confidence: 'medium',
    sourceUrl: 'https://www.tech.gov.sg/careers/',
    discoveredAt: '2026-05-03',
  },
  {
    title: '为什么加入 GovTech',
    titleEn: 'Why join GovTech',
    description: '介绍政府技术局（GovTech）作为新加坡科技人才雇主的优势，强调通过创新、协作文化和有影响力的工作来塑造新加坡数字未来的机会。页面概述了 GovTech 的职业发展前景、招聘流程和工作文化。',
    descriptionEn: 'A career overview page for the Government Technology Agency of Singapore (GovTech) highlighting why it is an employer of choice for tech talents. The page outlines opportunities to shape Singapore\'s digital future through innovation, describes the hiring process, and emphasizes a collaborative work culture.',
    category: '企业上手',
    confidence: 'medium',
    sourceUrl: 'https://www.tech.gov.sg/careers/why-join-govtech/',
    discoveredAt: '2026-05-03',
  },
  {
    title: 'GovTech职业生涯概览',
    titleEn: 'Overview of GovTech Careers',
    description: '新加坡政府科技局(GovTech)的职业招聘页面，介绍了该机构作为雇主的优势。GovTech员工的工作与新加坡智慧国建设密切相关，通过数字化转型项目直接改善市民和居民的生活。机构提供丰富的学习发展机会、内部流动和晋升途径，致力于将员工培养为未来领袖，同时重视工作-生活平衡、混合办公模式和多元包容的工作环境。',
    descriptionEn: 'A career overview page from Singapore\'s Government Technology Agency (GovTech) highlighting why the organization is an employer of choice. GovTech employees contribute to Singapore\'s Smart Nation initiative through digital transformation projects that directly impact citizens\' lives. The organization offers continuous learning and development opportunities, internal mobility, leadership development pathways, flexible work arrangements, and a diverse and inclusive workplace culture.',
    category: '专业人才培养',
    confidence: 'high',
    sourceUrl: 'https://www.tech.gov.sg/careers/why-join-govtech/overview/',
    discoveredAt: '2026-05-03',
  },
  {
    title: '我们如何招聘',
    titleEn: 'How we hire',
    description: '新加坡政府技术局（GovTech）介绍其招聘流程和用人标准。招聘分为申请、面试和决策三个阶段，重点考察候选人的技术能力、问题解决能力以及与GovTech价值观（敏捷、大胆、协作）的契合度。为帮助候选人脱颖而出，GovTech建议优化简历、充分准备面试、以及管理个人数字足迹。',
    descriptionEn: 'GovTech Singapore outlines its hiring process and candidate evaluation criteria. The three-stage process includes application submission, interviews with hiring managers and potential teammates, and final decision by the hiring team based on established frameworks. To succeed, candidates are advised to craft well-formatted CVs highlighting quantifiable accomplishments, prepare thoroughly for interviews by understanding job scope and demonstrating critical thinking, and maintain a professional digital presence through LinkedIn and clean social media profiles.',
    category: '企业上手',
    confidence: 'high',
    sourceUrl: 'https://www.tech.gov.sg/careers/why-join-govtech/how-we-hire/',
    discoveredAt: '2026-05-03',
  },
  {
    title: '我们的工作方式',
    titleEn: 'How we work',
    description: '新加坡政府技术局（GovTech）介绍其工作文化和价值观。GovTech 倡导以公共利益为目标的创新文化，强调敏捷、大胆和协作的价值观。组织鼓励员工在安全的创意空间中提出想法、承担风险、学习成长，同时提供混合工作安排、员工资源小组和志愿服务机会，培养高绩效的职场环境。',
    descriptionEn: 'The Government Technology Agency of Singapore (GovTech) describes its work culture and values. GovTech fosters an innovation-driven environment centered on public good, emphasizing Agile, Bold, and Collaborative values. The organization encourages employees to propose ideas, take calculated risks, and learn in a safe creative space while offering hybrid work arrangements, employee resource groups, and volunteer opportunities to build a high-performing workplace.',
    category: '企业上手',
    confidence: 'medium',
    sourceUrl: 'https://www.tech.gov.sg/careers/why-join-govtech/how-we-work/',
    discoveredAt: '2026-05-03',
  },
];

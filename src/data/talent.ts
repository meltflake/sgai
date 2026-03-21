export interface TalentProgramme {
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  status?: string;
  url?: string;
}

export const programmes: TalentProgramme[] = [
  {
    name: 'AI 学徒计划',
    nameEn: 'AI Apprenticeship Programme (AIAP)',
    icon: '🎯',
    description: '新加坡旗舰 AI 工程人才培养项目，提供沉浸式实战训练，学员在真实 AI 项目中与导师并肩工作。',
    stats: [
      { label: '时长', value: '9 个月 / 6 个月' },
      { label: '津贴', value: 'SGD 4,000/月' },
      { label: '已培养批次', value: '22+ 批' },
      { label: '就业率', value: '90%+' },
    ],
    highlights: ['全职沉浸式 AI 工程训练', '参与 AI Singapore 真实项目', '提供生活津贴', 'Batch 23 正在招募'],
    status: '🟢 招募中',
    url: 'https://aisingapore.org/innovation/aiap/',
  },
  {
    name: '学习者 AI 开发计划',
    nameEn: 'Learners AI Development Programme (LADP)',
    icon: '💻',
    description: '16 周实战项目，2-4 人组队开发 AI 解决方案，适合有一定技术基础的学习者。',
    stats: [
      { label: '时长', value: '16 周' },
      { label: '团队规模', value: '2-4 人' },
      { label: '费用（公民补贴后）', value: 'SGD 3,600' },
    ],
    highlights: ['团队协作开发 AI 项目', '导师指导', 'SkillsFuture 可报销', 'Intake 9 开放中'],
    status: '🟢 报名中',
    url: 'https://aisingapore.org/innovation/ladp/',
  },
  {
    name: 'AI 博士奖学金',
    nameEn: 'PhD Fellowship Programme',
    icon: '🎓',
    description: '资助优秀博士生从事 AI 前沿研究，无国籍限制，在新加坡顶尖大学完成博士学位。',
    stats: [
      { label: '最长资助', value: '4 年' },
      { label: '月度津贴', value: 'SGD 6,700/月' },
      { label: '国籍限制', value: '无' },
    ],
    highlights: ['在 NUS/NTU/SMU/SUTD 攻读博士', '与 AI Singapore 研究团队合作', '丰厚生活津贴', '无国籍限制'],
    url: 'https://aisingapore.org/talent/phd-fellowship/',
  },
  {
    name: '硕士加速计划',
    nameEn: 'Accelerated Masters Programme (AMP)',
    icon: '⚡',
    description: '本科到硕士的快车道，专为新加坡公民设计，2024 年启动。',
    stats: [
      { label: '启动年份', value: '2024' },
      { label: '目标群体', value: '本科生' },
      { label: '国籍要求', value: '新加坡公民' },
    ],
    highlights: ['本硕连读快车道', '仅限新加坡公民', '与顶尖大学合作', '2024 年首批启动'],
  },
  {
    name: 'LearnAI / AI4I',
    nameEn: 'LearnAI / AI for Industry',
    icon: '📚',
    description: '面向各层次学习者的在线 AI 课程，从入门到进阶，支持 SkillsFuture 补贴。',
    stats: [
      { label: '课程类型', value: '在线自学' },
      { label: '补贴', value: 'SkillsFuture 可报销' },
    ],
    highlights: [
      '从入门到进阶全覆盖',
      'AI for Everyone / AI for Industry 系列',
      'SkillsFuture Credit 可报销',
      '灵活在线学习',
    ],
    url: 'https://learn.aisingapore.org/',
  },
  {
    name: '全国 AI 学生挑战赛',
    nameEn: 'National AI Student Challenge (NAISC)',
    icon: '🏆',
    description: '面向学生的全国性 AI 挑战赛，激发年轻一代的 AI 创新热情。',
    stats: [
      { label: '参与人数', value: '2,000+' },
      { label: '赛道', value: '7 个' },
    ],
    highlights: ['面向大中小学生', '7 个不同赛道', '2000+ 参与者', '培养 AI 实践能力'],
    url: 'https://aisingapore.org/talent/national-ai-student-challenge/',
  },
  {
    name: '国际 AI 奥林匹克竞赛',
    nameEn: 'International Olympiad in AI (IOAI)',
    icon: '🥇',
    description: '2027 年新加坡将主办国际 AI 奥林匹克竞赛，汇聚全球 AI 青年人才。',
    stats: [
      { label: '主办年份', value: '2027' },
      { label: '地点', value: '新加坡' },
    ],
    highlights: ['全球顶级 AI 青年赛事', '新加坡首次主办', '2026 年先办国内选拔赛'],
  },
  {
    name: 'AI 进校园',
    nameEn: 'AI Singapore Goes to School / TWA+',
    icon: '🏫',
    description: 'AI 教育深入中小学，TWA+ 为教师提供 AI 教学培训。',
    stats: [
      { label: '覆盖范围', value: '中小学' },
      { label: '教师培训', value: 'TWA+' },
    ],
    highlights: ['AI 教育低龄化', '教师 AI 素养提升 (TWA+)', '培养下一代 AI 原住民'],
  },
];

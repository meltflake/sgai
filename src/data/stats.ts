import { getPermalink } from '~/utils/permalinks';

export const stats = [
  { title: '核心政策', amount: '28' },
  { title: '追踪指标', amount: '70+' },
  { title: '专题页面', amount: '19' },
  { title: '国家 AI 抓手', amount: '6' },
  { title: 'AI 视频', amount: '46' },
];

export const features = [
  {
    title: '📋 AI 政策库',
    description:
      '28 份核心政策文档，含中英标题、来源机构、摘要与原文链接。从 Smart Nation 到 Agentic AI 治理框架与 Singapore Consensus。',
    icon: 'tabler:file-text',
    callToAction: { text: '查看政策库', href: getPermalink('/policies') },
  },
  {
    title: '🎯 国家 AI 抓手图谱',
    description:
      'Budget 2026 + 各部委 AI 政策按"基建/治理/人才/应用/政府自用/外交"6 抓手分类，每个抓手跨多部委——这比按部门看更能看出国家级 AI-native 整体形状。',
    icon: 'tabler:target',
    callToAction: { text: '查看抓手图谱', href: getPermalink('/levers') },
  },
  {
    title: '⚖️ AI 法律框架',
    description:
      '"训练宽松 + 输出严管"双轨——Copyright §244 全球最宽松的 AI 训练例外，配合 OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套输出严管。',
    icon: 'tabler:scale',
    callToAction: { text: '查看法律框架', href: getPermalink('/legal-ai') },
  },
  {
    title: '📈 发展时间线',
    description: '从 2014 年智慧国家倡议到 2026 年 NAIRD，完整里程碑时间线与政策演进脉络。',
    icon: 'tabler:trending-up',
    callToAction: { text: '查看时间线', href: getPermalink('/timeline') },
  },
  {
    title: '📊 落地执行追踪',
    description: '42 项关键指标追踪：投资（S$2B+ 政府 / US$26B+ 私营）、人才、研究、采用率、基础设施。',
    icon: 'tabler:chart-bar',
    callToAction: { text: '查看指标', href: getPermalink('/tracker') },
  },
  {
    title: '🔬 开源与研究',
    description: '官方开源项目（SEA-LION、AI Verify）与产学研生态（Colossal-AI、BLIP），含 4 篇论文中文翻译。',
    icon: 'tabler:code',
    callToAction: { text: '查看研究', href: getPermalink('/opensource') },
  },
  {
    title: '🚀 创业生态',
    description: '650+ AI 创业公司、9 家独角兽、US$8.4B+ 融资，五大垂直领域全景。',
    icon: 'tabler:rocket',
    callToAction: { text: '查看生态', href: getPermalink('/startups') },
  },
  {
    title: '🌍 国际对标',
    description: '10 个经济体 AI 政策横向对比：港台、中东、欧洲、北美，投资规模与治理模式分析。',
    icon: 'tabler:world',
    callToAction: { text: '查看对标', href: getPermalink('/benchmarking') },
  },
  {
    title: '📝 深度分析',
    description: '不只是信息整理——我们提出自己的观点。从能源枢纽类比到制度护城河，探究新加坡 AI 战略的底层逻辑。',
    icon: 'tabler:pencil',
    callToAction: { text: '阅读分析', href: getPermalink('/blog') },
  },
  {
    title: 'AI 视频观点',
    description: '新加坡政府官员、学者和行业领袖关于 AI 的 YouTube 演讲与访谈，按主题分类，支持筛选。',
    icon: 'tabler:player-play',
    callToAction: { text: '查看视频', href: getPermalink('/videos') },
  },
  {
    title: 'AI 影响力图谱',
    description: '新加坡 AI 关键人物与核心机构的官方信息渠道，及 58 篇 MDDI AI 相关演讲稿全文链接。',
    icon: 'tabler:users',
    callToAction: { text: '查看图谱', href: getPermalink('/voices') },
  },
];

import { getPermalink } from '~/utils/permalinks';

export const stats = [
  { title: '核心政策', titleJa: 'コア政策', amount: '28' },
  { title: '追踪指标', titleJa: '追跡指標', amount: '70+' },
  { title: '专题页面', titleJa: '特集ページ', amount: '19' },
  { title: '国家 AI 抓手', titleJa: '国家 AI レバー', amount: '6' },
  { title: 'AI 视频', titleJa: 'AI 動画', amount: '46' },
];

export const features = [
  {
    title: '📋 AI 政策库',
    titleJa: '📋 AI 政策ライブラリー',
    description:
      '28 份核心政策文档，含中英标题、来源机构、摘要与原文链接。从 Smart Nation 到 Agentic AI 治理框架与 Singapore Consensus。',
    descriptionJa:
      '28 件の核心政策文書、中英のタイトル、出典機構、要約と原文リンクを含みます。Smart Nation から Agentic AI ガバナンス枠組みと Singapore Consensus まで。',
    icon: 'tabler:file-text',
    callToAction: { text: '查看政策库', textJa: '政策ライブラリーを確認します', href: getPermalink('/policies') },
  },
  {
    title: '🎯 国家 AI 抓手图谱',
    titleJa: '🎯 国家 AI レバーマップ',
    description:
      'Budget 2026 + 各部委 AI 政策按"基建/治理/人才/应用/政府自用/外交"6 抓手分类，每个抓手跨多部委——这比按部门看更能看出国家级 AI-native 整体形状。',
    descriptionJa:
      'Budget 2026 + 各省庁の AI 政策を「インフラ/ガバナンス/人材/応用/政府自用/外交」6 つのレバーで分類します。各レバーが複数の省庁にまたがるため、部門ごとに見るより国家規模の AI ネイティブな全体像がより明確に見えます。',
    icon: 'tabler:target',
    callToAction: { text: '查看抓手图谱', textJa: 'レバーマップを確認する', href: getPermalink('/levers') },
  },
  {
    title: '⚖️ AI 法律框架',
    titleJa: '⚖️ AI 法的枠組み',
    description:
      '"训练宽松 + 输出严管"双轨——Copyright §244 全球最宽松的 AI 训练例外，配合 OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套输出严管。',
    descriptionJa:
      '「学習緩和 + 出力厳格」デュアルトラック――Copyright §244 の世界で最も寛容な AI 学習例外と、OCHA・Elections Bill・Criminal Law Bill・Online Safety Bill の 4 点セットによる出力厳格管理。',
    icon: 'tabler:scale',
    callToAction: { text: '查看法律框架', textJa: '法的枠組みを確認する', href: getPermalink('/legal-ai') },
  },
  {
    title: '📈 发展时间线',
    titleJa: '📈 発展タイムライン',
    description: '从 2014 年智慧国家倡议到 2026 年 NAIRD，完整里程碑时间线与政策演进脉络。',
    descriptionJa:
      '2014 年のスマート国家構想から 2026 年の NAIRD までの完全なマイルストーン・タイムラインと政策進化の脈絡。',
    icon: 'tabler:trending-up',
    callToAction: { text: '查看时间线', textJa: 'タイムラインを表示', href: getPermalink('/timeline') },
  },
  {
    title: '📊 落地执行追踪',
    titleJa: '📊 実装・実行追跡',
    description: '42 项关键指标追踪：投资（S$2B+ 政府 / US$26B+ 私营）、人才、研究、采用率、基础设施。',
    descriptionJa: '42 項目の主要指標追跡：投資（S$2B+ 政府 / US$26B+ 民間）、人材、研究、採用率、インフラ。',
    icon: 'tabler:chart-bar',
    callToAction: { text: '查看指标', textJa: '指標を表示', href: getPermalink('/tracker') },
  },
  {
    title: '🔬 开源与研究',
    titleJa: '🔬 オープンソースと研究',
    description: '官方开源项目（SEA-LION、AI Verify）与产学研生态（Colossal-AI、BLIP），含 4 篇论文中文翻译。',
    descriptionJa:
      '公式オープンソースプロジェクト（SEA-LION、AI Verify）と産業学研エコシステム（Colossal-AI、BLIP）、4 本の論文の中国語翻訳を含む。',
    icon: 'tabler:code',
    callToAction: { text: '查看研究', textJa: '研究を表示', href: getPermalink('/opensource') },
  },
  {
    title: '🚀 创业生态',
    titleJa: '🚀 スタートアップエコシステム',
    description: '650+ AI 创业公司、9 家独角兽、US$8.4B+ 融资，五大垂直领域全景。',
    descriptionJa: '650+ AI スタートアップ企業、9 社のユニコーン企業、US$8.4B+ の資金調達、5 つの主要垂直分野の全景。',
    icon: 'tabler:rocket',
    callToAction: { text: '查看生态', textJa: 'エコシステムを表示', href: getPermalink('/startups') },
  },
  {
    title: '🌍 国际对标',
    titleJa: '🌍 国際ベンチマーク',
    description: '10 个经济体 AI 政策横向对比：港台、中东、欧洲、北美，投资规模与治理模式分析。',
    descriptionJa:
      '10 個の経済体の AI 政策横断比較：香港・台湾、中東、ヨーロッパ、北米、投資規模とガバナンスモデル分析。',
    icon: 'tabler:world',
    callToAction: { text: '查看对标', textJa: 'ベンチマークを表示', href: getPermalink('/benchmarking') },
  },
  {
    title: '📝 观点',
    titleJa: '📝 観点',
    description: '不只是信息整理——我们提出自己的看法。从能源枢纽类比到制度护城河，探究新加坡 AI 战略的底层逻辑。',
    descriptionJa:
      '単なる情報整理ではなく——私たちは独自の見方を提示します。エネルギーハブのアナロジーから制度的護城河まで、シンガポール AI 戦略の基本ロジックを探求します。',
    icon: 'tabler:pencil',
    callToAction: { text: '阅读观点', textJa: '観点を読む', href: getPermalink('/blog') },
  },
  {
    title: 'AI 视频观点',
    titleJa: 'AI ビデオ観点',
    description: '新加坡政府官员、学者和行业领袖关于 AI 的 YouTube 演讲与访谈，按主题分类，支持筛选。',
    descriptionJa:
      'シンガポール政府関係者、学者および業界リーダーによる AI に関する YouTube 講演およびインタビュー。テーマ別に分類でき、フィルタリングに対応しています。',
    icon: 'tabler:player-play',
    callToAction: { text: '查看视频', textJa: '動画を表示', href: getPermalink('/videos') },
  },
  {
    title: 'AI 影响力图谱',
    titleJa: 'AI インフルエンスマップ',
    description: '新加坡 AI 关键人物与核心机构的官方信息渠道，及 58 篇 MDDI AI 相关演讲稿全文链接。',
    descriptionJa:
      'シンガポール AI の主要人物および中核機関の公式情報チャネル、ならびに 58 件の MDDI AI 関連講演稿の全文リンク。',
    icon: 'tabler:users',
    callToAction: { text: '查看图谱', textJa: 'マップを表示', href: getPermalink('/voices') },
  },
];

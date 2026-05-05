// Updates feed — single source of truth for "what changed" on the site.
//
// Surfaced on:
//   - Homepage (RecentUpdates widget, latest 8)
//   - /updates/ and /updates/ (full list, grouped by month)
//   - /updates.rss.xml and /updates.rss.xml (RSS feeds)
//   - llms.txt (high-value pages section)
//
// Each entry is bilingual. New entries are added by refresh pipelines via
// scripts/lib/append-update.ts (auto-PR'd alongside data changes), or by
// hand for editorial events (longform, fixes, structural changes).
//
// Keep summaries one short sentence — the editorial judgment, not the
// changelog blurb. The links carry the user to the actual entity page.

export type UpdateType =
  | 'policy'
  | 'debate'
  | 'video'
  | 'startup'
  | 'people'
  | 'tracker'
  | 'benchmark'
  | 'ecosystem'
  | 'lever'
  | 'longform'
  | 'site'
  | 'fix';

export interface UpdateLink {
  href: string;
  label: string;
  labelEn: string;
}

export interface Update {
  date: string; // YYYY-MM-DD
  type: UpdateType;
  title: string; // 中文
  titleEn: string;
  summary: string; // 一句话站方判断（中文）
  summaryEn: string;
  links?: UpdateLink[];
}

// Newest first. Pipelines append at the top via scripts/lib/append-update.ts.
export const UPDATES: Update[] = [
  {
    date: '2026-05-05',
    type: 'site',
    title: '首页加上「最近更新」模块',
    titleEn: 'Homepage now surfaces a recent-updates feed',
    summary: '把分散在各栏目的更新统一到一个流，老用户回站立刻看到本周新增了什么。',
    summaryEn:
      'Updates that used to be buried inside each column are now collected in one feed — returning readers see what is new at a glance.',
    links: [
      { href: '/updates/', label: '完整更新流', labelEn: 'Full updates feed' },
      { href: '/updates.rss.xml', label: 'RSS 订阅', labelEn: 'RSS feed' },
    ],
  },
  {
    date: '2026-05-05',
    type: 'site',
    title: '辩论索引信息架构改版',
    titleEn: 'Debates index information architecture refresh',
    summary: '辩论入口按主题、年份和发言人重新分组，长尾辩论也能被找到。',
    summaryEn: 'Debate entries are regrouped by topic, year, and speaker so long-tail debates are no longer buried.',
    links: [{ href: '/debates/', label: '国会辩论', labelEn: 'Parliamentary debates' }],
  },
  {
    date: '2026-05-04',
    type: 'policy',
    title: '政策卡片升级为档案页',
    titleEn: 'Policy cards upgraded to profile pages',
    summary: '每份核心政策有了独立详情页，把文件、签发部委、关联辩论和抓手串起来。',
    summaryEn:
      'Each core policy now has its own profile page tying the document, issuing ministry, related debates, and levers together.',
    links: [{ href: '/policies/', label: '政策库', labelEn: 'Policy library' }],
  },
  {
    date: '2026-05-04',
    type: 'benchmark',
    title: '新增对标案例和社区开源档案',
    titleEn: 'New benchmark cases and community open-source profiles',
    summary: '国际对标和产学研开源各加一批详情页，方便横向比较新加坡和其他生态。',
    summaryEn:
      'Fresh benchmark cases and community open-source project profiles, making it easier to compare Singapore against peer ecosystems.',
    links: [
      { href: '/benchmarking/', label: '国际对标', labelEn: 'International benchmarks' },
      { href: '/community-opensource/', label: '产学研开源', labelEn: 'Community open source' },
    ],
  },
  {
    date: '2026-05-04',
    type: 'startup',
    title: '创业生态新增实体详情页',
    titleEn: 'Startup ecosystem entity profile pages',
    summary: '每家新加坡 AI 创业公司有了独立档案，拉通融资、产品、人才和外部背书。',
    summaryEn:
      'Each Singapore AI startup now has a dedicated profile pulling together funding, product, talent, and external endorsements.',
    links: [{ href: '/startups/', label: 'AI 创业生态', labelEn: 'AI startup ecosystem' }],
  },
  {
    date: '2026-05-04',
    type: 'ecosystem',
    title: '官方开源、人才计划详情页上线',
    titleEn: 'Official open-source and talent programme profile pages',
    summary: '官方研究项目和人才计划告别列表页，每条记录都能单页定位、外链和引用。',
    summaryEn:
      'Official research projects and talent programmes graduate from list rows to standalone pages — easier to deep-link and cite.',
    links: [
      { href: '/opensource/', label: '官方开源与研究', labelEn: 'Official open source' },
      { href: '/talent/', label: '人才培养', labelEn: 'Talent pipeline' },
    ],
  },
  {
    date: '2026-05-03',
    type: 'debate',
    title: '国会辩论新增 3 场（4-7 / 8 月会期）',
    titleEn: '3 new parliamentary debates (Apr-Jul / Aug sittings)',
    summary: '继续把 Hansard AI 相关辩论增量同步到站内，自动管线一周一跑。',
    summaryEn: 'AI-related Hansard debates continue to flow in via the weekly auto-update pipeline.',
    links: [{ href: '/debates/', label: '国会辩论', labelEn: 'Parliamentary debates' }],
  },
  {
    date: '2026-05-03',
    type: 'video',
    title: 'AI 视频新增 4 条 + 全部转录双语化',
    titleEn: '4 new AI videos + bilingual transcripts for v055-v058',
    summary: '视频区从单语字幕扩展为中英双语转录，便于 LLM 引用和搜索召回。',
    summaryEn: 'Video transcripts go bilingual, improving LLM citation and on-site search recall.',
    links: [{ href: '/videos/', label: 'AI 视频观点', labelEn: 'Video library' }],
  },
  {
    date: '2026-05-03',
    type: 'tracker',
    title: 'Tracker 数据再刷新一轮',
    titleEn: 'Tracker dashboard refreshed',
    summary: '6 维度读数按月更新，含投资、人才、算力、政府采用、模型能力、安全治理。',
    summaryEn:
      'Six-dimension monthly readings refreshed — investment, talent, compute, government adoption, model capability, and AI safety.',
    links: [{ href: '/tracker/', label: 'AI 仪表盘', labelEn: 'AI dashboard' }],
  },
  {
    date: '2026-05-03',
    type: 'fix',
    title: 'Voices 数据反幻觉 URL 校验',
    titleEn: 'Voices pipeline gains URL hallucination defense',
    summary: 'voices 补全管线加 HEAD 校验，杜绝 LLM 编造的人物 / 演讲链接进库。',
    summaryEn:
      'The voices backfill pipeline now HEAD-checks every sourceUrl, blocking LLM-fabricated speaker / talk links from entering data.',
    links: [{ href: '/voices/', label: 'AI 影响力图谱', labelEn: 'Influence map' }],
  },
];

export function sortedUpdates(): Update[] {
  return [...UPDATES].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function recentUpdates(limit = 8): Update[] {
  return sortedUpdates().slice(0, limit);
}

export interface UpdatesByMonth {
  month: string; // YYYY-MM
  items: Update[];
}

export function updatesByMonth(): UpdatesByMonth[] {
  const groups = new Map<string, Update[]>();
  for (const u of sortedUpdates()) {
    const m = u.date.slice(0, 7);
    if (!groups.has(m)) groups.set(m, []);
    groups.get(m)!.push(u);
  }
  return [...groups.entries()].map(([month, items]) => ({ month, items }));
}

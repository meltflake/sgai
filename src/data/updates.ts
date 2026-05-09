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
  labelJa?: string;
}

export interface Update {
  date: string; // YYYY-MM-DD
  type: UpdateType;
  title: string; // 中文
  titleEn: string;
  titleJa?: string;
  summary: string; // 一句话站方判断（中文）
  summaryEn: string;
  summaryJa?: string;
  links?: UpdateLink[];
}

// Newest first. Pipelines append at the top via scripts/lib/append-update.ts.
export const UPDATES: Update[] = [
  {
    date: '2026-05-09',
    type: 'video',
    title: 'AI 视频新增 2 条（教育部长 + 社会及家庭发展部长）',
    titleJa: 'AI ビデオを2件追加（教育大臣 + 社会・家族発展大臣）',
    titleEn: '2 new AI videos (Education Minister + Minister for Social and Family Development)',
    summary: '李智陞谈在教育中谨慎、有目的地引入 AI；马斯戈在圣加仑论坛上强调 AI 推进不应遗漏弱势群体。',
    summaryJa:
      'デズモンド・リーは教育におけるAIの慎重で目的を持った導入を語り、マサゴスはサンガレン・シンポジウムでAI推進が脆弱層を取り残してはならないと強調しました。',
    summaryEn:
      'Desmond Lee on a calibrated, purposeful approach to AI in classrooms; Masagos at the St Gallen Symposium on inclusion as a non-negotiable in AI rollout.',
    links: [{ href: '/videos/', label: 'AI 视频观点', labelJa: 'AI ビデオ観点', labelEn: 'Video library' }],
  },
  {
    date: '2026-05-05',
    type: 'site',
    title: '首页加上「最近更新」模块',
    titleJa: 'ホームページに「最近の更新」モジュールを追加',
    titleEn: 'Homepage now surfaces a recent-updates feed',
    summary: '把分散在各栏目的更新统一到一个流，老用户回站立刻看到本周新增了什么。',
    summaryJa:
      '各セクションに分散された更新を1つのフィードに統合し、既存ユーザーが訪問したときに今週の新規追加内容をすぐに確認できるようにします。',
    summaryEn:
      'Updates that used to be buried inside each column are now collected in one feed — returning readers see what is new at a glance.',
    links: [
      { href: '/updates/', label: '完整更新流', labelJa: '完全な更新フィード', labelEn: 'Full updates feed' },
      { href: '/updates.rss.xml', label: 'RSS 订阅', labelJa: 'RSS サブスクリプション', labelEn: 'RSS feed' },
    ],
  },
  {
    date: '2026-05-05',
    type: 'site',
    title: '辩论索引信息架构改版',
    titleJa: '議論索引情報アーキテクチャの改版',
    titleEn: 'Debates index information architecture refresh',
    summary: '辩论入口按主题、年份和发言人重新分组，长尾辩论也能被找到。',
    summaryJa: '議論エントリーをテーマ、年度、スピーカーにより再グループ化し、ロングテール議論も見つけやすくなります。',
    summaryEn: 'Debate entries are regrouped by topic, year, and speaker so long-tail debates are no longer buried.',
    links: [{ href: '/debates/', label: '国会辩论', labelJa: '議会討論', labelEn: 'Parliamentary debates' }],
  },
  {
    date: '2026-05-04',
    type: 'policy',
    title: '政策卡片升级为档案页',
    titleJa: 'ポリシーカードのアーカイブページ化',
    titleEn: 'Policy cards upgraded to profile pages',
    summary: '每份核心政策有了独立详情页，把文件、签发部委、关联辩论和抓手串起来。',
    summaryJa: '核心政策ごとに独立した詳細ページが設けられ、文書、発行省庁、関連議論およびレバーが統合されます。',
    summaryEn:
      'Each core policy now has its own profile page tying the document, issuing ministry, related debates, and levers together.',
    links: [{ href: '/policies/', label: '政策库', labelJa: 'ポリシーライブラリー', labelEn: 'Policy library' }],
  },
  {
    date: '2026-05-04',
    type: 'benchmark',
    title: '新增对标案例和社区开源档案',
    titleJa: '新規ベンチマークケースおよびコミュニティオープンソースアーカイブ',
    titleEn: 'New benchmark cases and community open-source profiles',
    summary: '国际对标和产学研开源各加一批详情页，方便横向比较新加坡和其他生态。',
    summaryJa:
      '国際ベンチマークと産学研オープンソースに複数の詳細ページを追加し、シンガポールと他のエコシステム間の横向き比較を容易にします。',
    summaryEn:
      'Fresh benchmark cases and community open-source project profiles, making it easier to compare Singapore against peer ecosystems.',
    links: [
      { href: '/benchmarking/', label: '国际对标', labelJa: '国際ベンチマーク', labelEn: 'International benchmarks' },
      {
        href: '/community-opensource/',
        label: '产学研开源',
        labelJa: '産学研オープンソース',
        labelEn: 'Community open source',
      },
    ],
  },
  {
    date: '2026-05-04',
    type: 'startup',
    title: '创业生态新增实体详情页',
    titleJa: 'スタートアップエコシステムの新規エンティティ詳細ページ',
    titleEn: 'Startup ecosystem entity profile pages',
    summary: '每家新加坡 AI 创业公司有了独立档案，拉通融资、产品、人才和外部背书。',
    summaryJa:
      'シンガポールの各AIスタートアップが独立アーカイブを備え、資金調達、製品、人材および外部推薦が連携されます。',
    summaryEn:
      'Each Singapore AI startup now has a dedicated profile pulling together funding, product, talent, and external endorsements.',
    links: [
      {
        href: '/startups/',
        label: 'AI 创业生态',
        labelJa: 'AI スタートアップエコシステム',
        labelEn: 'AI startup ecosystem',
      },
    ],
  },
  {
    date: '2026-05-04',
    type: 'ecosystem',
    title: '官方开源、人才计划详情页上线',
    titleJa: '公式オープンソース、人材計画詳細ページがオンライン化',
    titleEn: 'Official open-source and talent programme profile pages',
    summary: '官方研究项目和人才计划告别列表页，每条记录都能单页定位、外链和引用。',
    summaryJa:
      '公式研究プロジェクトおよび人材計画はリストページを廃止し、各レコードが単一ページでの位置特定、外部リンク、および引用が可能になります。',
    summaryEn:
      'Official research projects and talent programmes graduate from list rows to standalone pages — easier to deep-link and cite.',
    links: [
      {
        href: '/opensource/',
        label: '官方开源与研究',
        labelJa: '公式オープンソースと研究',
        labelEn: 'Official open source',
      },
      { href: '/talent/', label: '人才培养', labelJa: '人材育成', labelEn: 'Talent pipeline' },
    ],
  },
  {
    date: '2026-05-03',
    type: 'debate',
    title: '国会辩论新增 3 场（4-7 / 8 月会期）',
    titleJa: '議会討論が新たに3件追加されました（4～7月/8月会期）',
    titleEn: '3 new parliamentary debates (Apr-Jul / Aug sittings)',
    summary: '继续把 Hansard AI 相关辩论增量同步到站内，自动管线一周一跑。',
    summaryJa: '引き続き Hansard AI 関連議論の増分をサイト内に同期し、自動パイプラインを週一回実行します。',
    summaryEn: 'AI-related Hansard debates continue to flow in via the weekly auto-update pipeline.',
    links: [{ href: '/debates/', label: '国会辩论', labelJa: '議会討論', labelEn: 'Parliamentary debates' }],
  },
  {
    date: '2026-05-03',
    type: 'video',
    title: 'AI 视频新增 4 条 + 全部转录双语化',
    titleJa: 'AI ビデオ4件新規追加＋全トランスクリプション二言語化',
    titleEn: '4 new AI videos + bilingual transcripts for v055-v058',
    summary: '视频区从单语字幕扩展为中英双语转录，便于 LLM 引用和搜索召回。',
    summaryJa:
      'ビデオセクションは単言語字幕から中英二言語トランスクリプションに拡張され、LLM参照と検索リコールを容易にしました。',
    summaryEn: 'Video transcripts go bilingual, improving LLM citation and on-site search recall.',
    links: [{ href: '/videos/', label: 'AI 视频观点', labelJa: 'AI ビデオ観点', labelEn: 'Video library' }],
  },
  {
    date: '2026-05-03',
    type: 'tracker',
    title: 'Tracker 数据再刷新一轮',
    titleJa: 'Tracker データの再リフレッシュ',
    titleEn: 'Tracker dashboard refreshed',
    summary: '6 维度读数按月更新，含投资、人才、算力、政府采用、模型能力、安全治理。',
    summaryJa: '6次元メトリクスは月次で更新され、投資、人材、算力、政府導入、モデル能力、安全ガバナンスを含みます。',
    summaryEn:
      'Six-dimension monthly readings refreshed — investment, talent, compute, government adoption, model capability, and AI safety.',
    links: [{ href: '/tracker/', label: 'AI 仪表盘', labelJa: 'AI ダッシュボード', labelEn: 'AI dashboard' }],
  },
  {
    date: '2026-05-03',
    type: 'fix',
    title: 'Voices 数据反幻觉 URL 校验',
    titleJa: 'Voices データの反幻覚 URL 検証',
    titleEn: 'Voices pipeline gains URL hallucination defense',
    summary: 'voices 补全管线加 HEAD 校验，杜绝 LLM 编造的人物 / 演讲链接进库。',
    summaryJa: 'voices 補完パイプラインに HEAD 検証を追加し、LLM による人物/スピーチリンク捏造を排除します。',
    summaryEn:
      'The voices backfill pipeline now HEAD-checks every sourceUrl, blocking LLM-fabricated speaker / talk links from entering data.',
    links: [{ href: '/voices/', label: 'AI 影响力图谱', labelJa: 'AI インフルエンスマップ', labelEn: 'Influence map' }],
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

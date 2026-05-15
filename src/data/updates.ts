// Updates feed — surfaced on:
//   - Homepage (RecentUpdates widget, latest 8)
//   - /updates/ and /updates/ (full list, grouped by month)
//   - /updates.rss.xml and /updates.rss.xml (RSS feeds)
//   - llms.txt (high-value pages section)
//
// ┌──────────────────────────────────────────────────────────────────┐
// │ Two sources merge into the public feed:                          │
// │                                                                  │
// │  1. DERIVED  — synthesised from each data record's `addedAt`     │
// │                timestamp by src/utils/derived-updates.ts. Covers │
// │                video / policy / debate / people / tracker /      │
// │                benchmark / ecosystem / lever / startup types.    │
// │                Always fresh, always 3-lang, never drifts. Adding │
// │                a record with an `addedAt` is the ONLY thing      │
// │                needed to surface it on the homepage.             │
// │                                                                  │
// │  2. MANUAL   — site refactors, fix announcements, longform       │
// │                publications. These are editorial events that do  │
// │                not correspond to a data record, so they live in  │
// │                the MANUAL_UPDATES array below. Allowed types:    │
// │                'site' / 'fix' / 'longform'.                      │
// │                                                                  │
// │ Both sources merge in recentUpdates() / sortedUpdates() — date    │
// │ desc, ties broken by source order (manual before derived).       │
// └──────────────────────────────────────────────────────────────────┘
//
// History: this file used to be a hand-maintained ledger of EVERY update
// (including data refreshes). That was a double-source-of-truth design —
// any commit that edited a data file by hand had to remember to also write
// here, and frequently didn't (incident: 2026-05-09 / commit a608bc0).
// The derive layer eliminated that class of drift.

import { deriveUpdates } from '~/utils/derived-updates';

export type UpdateType =
  | 'policy'
  | 'debate'
  | 'video'
  | 'startup'
  | 'people'
  | 'speech'
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

// Editorial-only types. Data-record types (video / policy / debate / etc.)
// MUST come from the derive layer — adding them here would re-introduce
// the drift bug. The set is enforced by appendManualUpdate() below.
const MANUAL_TYPES = new Set<UpdateType>(['site', 'fix', 'longform']);

// Manual editorial events. Newest first by convention; sortedUpdates() will
// sort regardless. Add new entries at the top.
export const MANUAL_UPDATES: Update[] = [
  {
    date: '2026-05-10',
    type: 'site',
    title: '「最近更新」改为从数据文件派生',
    titleJa: '「最近の更新」をデータファイル派生に変更',
    titleEn: 'Recent updates feed now derived from data files',
    summary:
      '每条数据 record 加 addedAt 字段；派生函数自动产出"最近更新"条目，删除手动 ledger 双源真相，根除 2026-05-09 那次漏更新的 bug 类。',
    summaryJa:
      '各データレコードに addedAt を付与し、派生関数で「最近の更新」を自動生成。手動レジャーの二重ソースを排除し、2026-05-09 に発生した漏れを構造的に修正しました。',
    summaryEn:
      'Every data record now carries addedAt; a derive function auto-produces the recent-updates feed. The double-source-of-truth manual ledger is gone, killing the bug class that caused the 2026-05-09 miss.',
    links: [
      { href: '/updates/', label: '完整更新流', labelJa: '完全な更新フィード', labelEn: 'Full updates feed' },
      { href: '/updates.rss.xml', label: 'RSS 订阅', labelJa: 'RSS サブスクリプション', labelEn: 'RSS feed' },
    ],
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
    type: 'site',
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
    type: 'site',
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

// Validate at import time: any non-MANUAL type slipping in would silently
// re-create the drift bug. Throwing here turns it into a build error.
for (const u of MANUAL_UPDATES) {
  if (!MANUAL_TYPES.has(u.type)) {
    throw new Error(
      `[updates.ts] MANUAL_UPDATES entry with type='${u.type}' (date=${u.date}, title="${u.title}") is not allowed. ` +
        `Manual entries must be 'site' / 'fix' / 'longform' only. Data-driven types (video / policy / debate / ...) ` +
        `come from the derive layer (src/utils/derived-updates.ts) — set addedAt on the data record instead.`
    );
  }
}

// ── Public API (unchanged contract — callers don't need to know about
//   the derive split) ──────────────────────────────────────────────────

export function sortedUpdates(): Update[] {
  // Sort newest first. When dates tie, manual entries come first (lower
  // index) — keeps editorial announcements above mechanical batch entries.
  const derived = deriveUpdates();
  const all = [...MANUAL_UPDATES, ...derived];
  return all
    .map((u, i) => ({ u, i }))
    .sort((a, b) => {
      if (a.u.date !== b.u.date) return a.u.date < b.u.date ? 1 : -1;
      return a.i - b.i;
    })
    .map((x) => x.u);
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

// Backward-compat re-export. The old callsites imported `UPDATES`; keep
// the symbol so any consumer that was reaching into the array directly
// (e.g. older eval scripts) still works.
export const UPDATES: Update[] = MANUAL_UPDATES;

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
  labelKo?: string;
}

export interface Update {
  date: string; // YYYY-MM-DD
  type: UpdateType;
  title: string; // 中文
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  summary: string; // 一句话站方判断（中文）
  summaryEn: string;
  summaryJa?: string;
  summaryKo?: string;
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
    date: '2026-05-27',
    type: 'fix',
    title: 'SEO：批量重写页面 title / description 提高 CTR',
    titleEn: 'SEO: bulk-rewrite page titles & descriptions to lift CTR',
    titleJa: 'SEO：タイトル・description の一括書き換えで CTR を改善',
    titleKo: 'SEO: 페이지 제목·설명 일괄 재작성으로 CTR 개선',
    summary:
      '基于 5/2–5/24 的 Google Search Console 数据（95k 曝光 / 0.27% CTR），重写 voices / policies / debates / levers / startups / talent / ecosystem 详情页与列表页的 metadata，加入数字证据（如 153 条辩论 · 2015–2026）、关键词前置、品牌后缀，覆盖全部 5 语种。debates 列表页 153 条 + 年份区间动态注入；voice 页 description 嵌入国会发言/政策/视频计数。zh-tw 分支统一走 toTraditional() 保证繁体纯净。',
    summaryEn:
      'Based on 5/2–5/24 Google Search Console data (95k impressions / 0.27% CTR), bulk-rewrote metadata across voices / policies / debates / levers / startups / talent / ecosystem detail and listing pages — adding number signals (e.g. "153 debates · 2015–2026"), keyword front-loading, and a brand suffix in all 5 locales. The debates listing now bakes its actual record count + year range into title/desc; voice pages inject debate/policy/video counts into the description. zh-tw branches all route through toTraditional() to keep traditional output clean.',
    summaryJa:
      '5/2–5/24 の Google Search Console データ（95k インプレッション / 0.27% CTR）を踏まえ、voices / policies / debates / levers / startups / talent / ecosystem の詳細・一覧ページ metadata を一括書き換え。数字シグナル（「153 件の議会討論 · 2015–2026」など）、キーワード前置、ブランド接尾辞を 5 言語すべてに追加。debates 一覧は実レコード数と年範囲を動的に注入、voice ページは議会発言・政策・動画件数を description に組み込み。zh-tw 分岐はすべて toTraditional() を経由し繁体出力を清浄に保ちます。',
    summaryKo:
      '5/2–5/24 Google Search Console 데이터(노출 95k / CTR 0.27%)를 바탕으로 voices / policies / debates / levers / startups / talent / ecosystem 상세·목록 페이지 메타데이터를 일괄 재작성. 숫자 시그널(예: "153건 토론 · 2015–2026"), 키워드 전치, 브랜드 접미사를 5개 언어 모두에 추가. debates 목록은 실제 레코드 수·연도 범위를 동적 주입, voice 페이지는 국회 발언·정책·영상 수를 설명에 삽입. zh-tw 분기는 모두 toTraditional()을 거쳐 번체 출력을 깨끗하게 유지.',
  },
  {
    date: '2026-05-26',
    type: 'longform',
    title: '新发布：新加坡公布四项 National AI Missions',
    titleEn: 'New: Singapore unveils four National AI Missions',
    titleJa: '新規公開：シンガポール、4 つの National AI Missions を発表',
    titleKo: '신규 공개: 싱가포르, 4개 National AI Missions 발표',
    summary:
      '5/20 ATxSummit 上 Josephine Teo 公布 NAIS Update 与四项 Missions（先进制造、互联互通、金融、医疗），同日还公布 NVIDIA Singapore AI Research Lab 和 Punggol Digital District 多运营商机器人 testbed。新闻体长文，中英日韩繁体中文五语同步。',
    summaryEn:
      'At ATxSummit on 20 May, Josephine Teo unveiled the NAIS Update and four National AI Missions (Advanced Manufacturing, Connectivity, Finance, Healthcare); the same day brought announcements of the NVIDIA Singapore AI Research Lab and the Punggol Digital District multi-operator robot testbed. News-style long-form, published in all five languages.',
    summaryJa:
      '5/20 の ATxSummit で Josephine Teo が NAIS アップデートと 4 つの National AI Missions（先端製造、コネクティビティ、金融、医療）を発表。同日 NVIDIA Singapore AI Research Lab と Punggol Digital District 多事業者ロボット testbed も公表されました。報道体の長文記事を 5 言語で同時公開。',
    summaryKo:
      '5/20 ATxSummit에서 Josephine Teo가 NAIS 업데이트와 4개 National AI Missions(첨단 제조, 연결성, 금융, 의료)를 발표했습니다. 같은 날 NVIDIA Singapore AI Research Lab과 Punggol Digital District 다중 운영자 로봇 테스트베드도 공개되었습니다. 보도체 장문 기사를 5개 언어로 동시 공개합니다.',
    links: [
      {
        href: '/national-ai-missions-2026/',
        label: '阅读全文',
        labelEn: 'Read the article',
        labelJa: '記事を読む',
        labelKo: '글 읽기',
      },
    ],
  },
  {
    date: '2026-05-26',
    type: 'fix',
    title: '繁体中文：部委官方名 OpenCC 误转修复',
    titleEn: 'zh-tw: protected-terms pipeline for Singapore ministry names',
    titleJa: 'zh-tw：シンガポール省庁名の OpenCC 誤変換修正',
    titleKo: 'zh-tw: 싱가포르 부처명 OpenCC 오변환 수정',
    summary:
      'OpenCC s2twp 把新加坡部委的官方中文名（MDDI、IMDA、MCCY 等）的关键词组误转为 Taiwan 惯用词组，在繁体中文渲染下破坏机构名。新建 src/i18n/protected-terms.ts 在转换前后做占位符拦截，保护约 10 个官方机构名，修复 2000+ 处误转。配套 npm run check:zh-tw-misconversion eval 防退化。',
    summaryEn:
      'OpenCC s2twp was wrongly converting Singapore ministry names (MDDI, IMDA, MCCY) into Taiwan-style variants in zh-tw rendering. The new src/i18n/protected-terms.ts adds a pre/post placeholder pass that protects ~10 official institutional names, fixing 2000+ occurrences across the site. A new npm run check:zh-tw-misconversion eval prevents regressions.',
    summaryJa:
      'OpenCC s2twp がシンガポール省庁の公式中国語名（MDDI、IMDA、MCCY など）の語をタイワン慣用語に誤変換し、繁体中国語レンダリング下で機関名を破壊していました。新規追加した src/i18n/protected-terms.ts が変換前後のプレースホルダ置換で約 10 件の機関名を保護し、サイト全体で 2000 件超の誤変換を修正。新規 eval npm run check:zh-tw-misconversion で後退を防ぎます。',
    summaryKo:
      'OpenCC s2twp가 싱가포르 부처의 공식 중국어명(MDDI, IMDA, MCCY 등) 단어를 Taiwan 관용 용어로 잘못 변환하여 번체 중국어 렌더링에서 기관명을 손상시켰습니다. 새로 추가된 src/i18n/protected-terms.ts가 변환 전후 플레이스홀더 치환으로 약 10개의 기관명을 보호하여 사이트 전체에서 2,000건 이상의 오변환을 수정합니다. 새 eval npm run check:zh-tw-misconversion이 회귀를 방지합니다.',
  },
  {
    date: '2026-05-25',
    type: 'longform',
    title: '《从 AI 看新加坡的转向能力》整篇更新',
    titleEn: "Full rewrite: Singapore's capacity to pivot, seen through AI",
    titleJa: '「AIから見るシンガポールの転換力」を全面更新',
    titleKo: '「AI로 본 싱가포르의 전환 능력」 전체 업데이트',
    summary:
      '用 2026-05-25 最新稿替换旧版 AI 马六甲海峡文章，补入研究方法、五次转型、NAIS Update、Manus 风险与结论，并同步中英日韩版本。',
    summaryEn:
      'The old AI Strait of Malacca essay is replaced with the 2026-05-25 revision, adding method notes, the five transformations, NAIS Update, the Manus risk discussion, and zh/en/ja/ko versions.',
    summaryJa:
      '旧版のAIマラッカ海峡記事を2026-05-25版に差し替え、研究方法、5回の転換、NAIS Update、Manusリスク、結論を追加し、中英日韓で同期しました。',
    summaryKo:
      '기존 AI 말라카 해협 글을 2026-05-25 최신본으로 교체하고 연구 방법, 다섯 차례 전환, NAIS Update, Manus 리스크, 결론을 보강해 중영일한 버전을 동기화했습니다.',
    links: [
      {
        href: '/singapore-ai-strategy-the-real-moat/',
        label: '阅读全文',
        labelEn: 'Read the essay',
        labelJa: '記事を読む',
        labelKo: '글 읽기',
      },
    ],
  },
  {
    date: '2026-05-10',
    type: 'site',
    title: '「最近更新」改为从数据文件派生',
    titleKo: '「최근 업데이트」를 데이터 파일에서 파생되도록 변경합니다.',
    titleJa: '「最近の更新」をデータファイル派生に変更',
    titleEn: 'Recent updates feed now derived from data files',
    summary:
      '每条数据 record 加 addedAt 字段；派生函数自动产出"最近更新"条目，删除手动 ledger 双源真相，根除 2026-05-09 那次漏更新的 bug 类。',
    summaryKo:
      '각 데이터 레코드에 addedAt 필드를 추가하고, 파생 함수가 자동으로 「최근 업데이트」 항목을 생성하여 수동 원장의 이중 소스 문제를 제거하고 2026-05-09의 누락된 업데이트 버그를 근본적으로 제거합니다.',
    summaryJa:
      '各データレコードに addedAt を付与し、派生関数で「最近の更新」を自動生成。手動レジャーの二重ソースを排除し、2026-05-09 に発生した漏れを構造的に修正しました。',
    summaryEn:
      'Every data record now carries addedAt; a derive function auto-produces the recent-updates feed. The double-source-of-truth manual ledger is gone, killing the bug class that caused the 2026-05-09 miss.',
    links: [
      {
        href: '/updates/',
        label: '完整更新流',
        labelKo: '완전한 업데이트 흐름',
        labelJa: '完全な更新フィード',
        labelEn: 'Full updates feed',
      },
      {
        href: '/updates.rss.xml',
        label: 'RSS 订阅',
        labelKo: 'RSS 구독',
        labelJa: 'RSS サブスクリプション',
        labelEn: 'RSS feed',
      },
    ],
  },
  {
    date: '2026-05-05',
    type: 'site',
    title: '首页加上「最近更新」模块',
    titleKo: '홈페이지에 「최근 업데이트」 모듈을 추가합니다.',
    titleJa: 'ホームページに「最近の更新」モジュールを追加',
    titleEn: 'Homepage now surfaces a recent-updates feed',
    summary: '把分散在各栏目的更新统一到一个流，老用户回站立刻看到本周新增了什么。',
    summaryKo:
      '다양한 섹션에 흩어져 있는 업데이트를 하나의 흐름으로 통합하여 기존 사용자들이 사이트에 돌아왔을 때 이번 주의 신규 콘텐츠를 즉시 확인할 수 있게 합니다.',
    summaryJa:
      '各セクションに分散された更新を1つのフィードに統合し、既存ユーザーが訪問したときに今週の新規追加内容をすぐに確認できるようにします。',
    summaryEn:
      'Updates that used to be buried inside each column are now collected in one feed — returning readers see what is new at a glance.',
    links: [
      {
        href: '/updates/',
        label: '完整更新流',
        labelKo: '완전한 업데이트 흐름',
        labelJa: '完全な更新フィード',
        labelEn: 'Full updates feed',
      },
      {
        href: '/updates.rss.xml',
        label: 'RSS 订阅',
        labelKo: 'RSS 구독',
        labelJa: 'RSS サブスクリプション',
        labelEn: 'RSS feed',
      },
    ],
  },
  {
    date: '2026-05-05',
    type: 'site',
    title: '辩论索引信息架构改版',
    titleKo: '토론 색인 정보 아키텍처 개편',
    titleJa: '議論索引情報アーキテクチャの改版',
    titleEn: 'Debates index information architecture refresh',
    summary: '辩论入口按主题、年份和发言人重新分组，长尾辩论也能被找到。',
    summaryKo: '토론 입구를 주제, 연도 및 발언자별로 재분류하여 롱테일 토론도 찾을 수 있게 합니다.',
    summaryJa: '議論エントリーをテーマ、年度、スピーカーにより再グループ化し、ロングテール議論も見つけやすくなります。',
    summaryEn: 'Debate entries are regrouped by topic, year, and speaker so long-tail debates are no longer buried.',
    links: [
      {
        href: '/debates/',
        label: '国会辩论',
        labelKo: '국회 토론',
        labelJa: '議会討論',
        labelEn: 'Parliamentary debates',
      },
    ],
  },
  {
    date: '2026-05-04',
    type: 'site',
    title: '政策卡片升级为档案页',
    titleKo: '정책 카드를 아카이브 페이지로 업그레이드합니다.',
    titleJa: 'ポリシーカードのアーカイブページ化',
    titleEn: 'Policy cards upgraded to profile pages',
    summary: '每份核心政策有了独立详情页，把文件、签发部委、关联辩论和抓手串起来。',
    summaryKo:
      '각 핵심 정책이 독립적인 상세 페이지를 가지게 되어 정책 파일, 발급 부처, 관련 토론 및 레버를 연결합니다.',
    summaryJa: '核心政策ごとに独立した詳細ページが設けられ、文書、発行省庁、関連議論およびレバーが統合されます。',
    summaryEn:
      'Each core policy now has its own profile page tying the document, issuing ministry, related debates, and levers together.',
    links: [
      {
        href: '/policies/',
        label: '政策库',
        labelKo: '정책 저장소',
        labelJa: 'ポリシーライブラリー',
        labelEn: 'Policy library',
      },
    ],
  },
  {
    date: '2026-05-04',
    type: 'site',
    title: '官方开源、人才计划详情页上线',
    titleKo: '공식 오픈소스 및 인재 프로그램 상세 페이지 출시',
    titleJa: '公式オープンソース、人材計画詳細ページがオンライン化',
    titleEn: 'Official open-source and talent programme profile pages',
    summary: '官方研究项目和人才计划告别列表页，每条记录都能单页定位、外链和引用。',
    summaryKo:
      '공식 연구 프로젝트와 인재 프로그램이 목록 페이지를 떠나 각 레코드가 단일 페이지에서 위치를 특정하고, 외부로 링크되고, 인용될 수 있습니다.',
    summaryJa:
      '公式研究プロジェクトおよび人材計画はリストページを廃止し、各レコードが単一ページでの位置特定、外部リンク、および引用が可能になります。',
    summaryEn:
      'Official research projects and talent programmes graduate from list rows to standalone pages — easier to deep-link and cite.',
    links: [
      {
        href: '/opensource/',
        label: '官方开源与研究',
        labelKo: '공식 오픈소스 및 연구',
        labelJa: '公式オープンソースと研究',
        labelEn: 'Official open source',
      },
      { href: '/talent/', label: '人才培养', labelKo: '인재 양성', labelJa: '人材育成', labelEn: 'Talent pipeline' },
    ],
  },
  {
    date: '2026-05-03',
    type: 'fix',
    title: 'Voices 数据反幻觉 URL 校验',
    titleKo: 'Voices 데이터 환각 방지 URL 검증',
    titleJa: 'Voices データの反幻覚 URL 検証',
    titleEn: 'Voices pipeline gains URL hallucination defense',
    summary: 'voices 补全管线加 HEAD 校验，杜绝 LLM 编造的人物 / 演讲链接进库。',
    summaryKo:
      'Voices 데이터 보충 파이프라인에 HEAD 검증을 추가하여 LLM이 조작한 인물 / 강연 링크가 저장소에 들어가는 것을 방지합니다.',
    summaryJa: 'voices 補完パイプラインに HEAD 検証を追加し、LLM による人物/スピーチリンク捏造を排除します。',
    summaryEn:
      'The voices backfill pipeline now HEAD-checks every sourceUrl, blocking LLM-fabricated speaker / talk links from entering data.',
    links: [
      {
        href: '/voices/',
        label: 'AI 影响力图谱',
        labelKo: 'AI 영향력 지도',
        labelJa: 'AI インフルエンスマップ',
        labelEn: 'Influence map',
      },
    ],
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

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
    date: '2026-08-14',
    type: 'site',
    title: '上线 AI 问答：就新加坡 AI 随便提问，基于全站数据回答',
    titleEn: 'Ask AI is live: ask anything about Singapore AI, answered from the site’s data',
    titleJa: 'AI 質問機能を公開：シンガポール AI について何でも質問、サイト全体のデータに基づいて回答',
    titleKo: 'AI 질문 기능 공개: 싱가포르 AI에 대해 무엇이든 질문하면 사이트 데이터 기반으로 답변',
    summary:
      '新增 /ask/ 页面：多轮对话，回答基于全站辩论、政策、追踪器等数据并附来源链接，五种语言可用。首页侧栏和导航都有入口。',
    summaryEn:
      'New /ask/ page: multi-turn chat grounded in the site’s debates, policies, tracker and other datasets, with source links, available in all five languages. Entry points in the homepage sidebar and the navigation.',
    summaryJa:
      '新しい /ask/ ページ：サイト内の議会討論・政策・トラッカーなどのデータに基づき、出典リンク付きで回答するマルチターン対話。5 言語で利用可能。ホームのサイドバーとナビゲーションから入れます。',
    summaryKo:
      '새 /ask/ 페이지: 사이트의 국회 토론·정책·트래커 등 데이터에 기반해 출처 링크와 함께 답변하는 멀티턴 대화. 5개 언어로 이용 가능합니다. 홈 사이드바와 내비게이션에서 접근할 수 있습니다.',
    links: [
      {
        href: '/ask/',
        label: '去提问',
        labelEn: 'Ask a question',
        labelJa: '質問してみる',
        labelKo: '질문하러 가기',
      },
    ],
  },
  {
    date: '2026-08-07',
    type: 'longform',
    title: '长文：淡马锡年报 2026 里的 AI——从 6% 到 15%',
    titleEn: 'Longform: The AI Chapter in Temasek Review 2026 — from 6% to 15%',
    titleJa: '長文：テマセク年次報告書 2026 の AI——6%から 15%へ',
    titleKo: '장문: 테마섹 연차보고서 2026의 AI——6%에서 15%로',
    summary:
      '淡马锡 2026-07-08 发布的年报给 AI 单开一章（§3.3 Our AI Strategy），带日期的数字承诺只有一条：AI 相关投资现占组合 6%，2031 年 3 月 31 日前提到 10–15%——按 5,180 亿新元的组合总值，涨到 15% 意味着 AI 持仓翻一倍多。本文梳理四根支柱、年内买入清单（Anthropic / OpenAI / xAI / CuspAI / PhysicsX / Lam Research 等），和落在新加坡本地的机构：Temus AI Foundry、Aicadium × gategroup、Resaro、与斯坦福商学院合办的 AI Leadership Programme。',
    summaryEn:
      "Temasek's annual review, published 2026-07-08, gives AI its own chapter (§3.3 Our AI Strategy). It carries exactly one dated numeric commitment: AI-related investments now make up 6% of the portfolio, to be raised to 10–15% by 31 March 2031 — against a S$518 billion portfolio, reaching 15% means more than doubling AI holdings. The piece walks through the four pillars, the year's purchases (Anthropic / OpenAI / xAI / CuspAI / PhysicsX / Lam Research and others), and what lands in Singapore: Temus's AI Foundry, Aicadium × gategroup, Resaro, and the AI Leadership Programme run with Stanford Graduate School of Business.",
    summaryJa:
      'テマセクが 2026-07-08 に発表した年次報告書は AI に独立した章（§3.3 Our AI Strategy）を設けました。日付付きの数値コミットメントは 1 つだけ：AI 関連投資は現在ポートフォリオの 6%で、2031 年 3 月 31 日までに 10–15%へ引き上げる——5,180 億シンガポールドルのポートフォリオ総額では、15%への拡大は AI 保有額が倍以上になることを意味します。本稿は 4 つの柱、年内の購入リスト（Anthropic / OpenAI / xAI / CuspAI / PhysicsX / Lam Research など）、そしてシンガポール現地に根づく機関——Temus の AI Foundry、Aicadium × gategroup、Resaro、スタンフォード大学経営大学院と共催の AI Leadership Programme——を整理します。',
    summaryKo:
      '테마섹이 2026-07-08 발표한 연차보고서는 AI에 별도의 장(§3.3 Our AI Strategy)을 신설했습니다. 날짜가 명시된 수치 약속은 하나뿐입니다: AI 관련 투자가 현재 포트폴리오의 6%이며, 2031년 3월 31일까지 10–15%로 확대합니다——5,180억 싱가포르달러의 포트폴리오 총액 기준으로 15%까지 늘리면 AI 보유 자산이 두 배 이상이 됩니다. 이 글은 네 개의 기둥, 연중 매입 목록(Anthropic / OpenAI / xAI / CuspAI / PhysicsX / Lam Research 등), 그리고 싱가포르 현지에 자리 잡는 기관들——Temus의 AI Foundry, Aicadium × gategroup, Resaro, 스탠퍼드 경영대학원과 공동 개최한 AI Leadership Programme——을 정리합니다.',
    links: [
      {
        href: '/temasek-review-2026-ai/',
        label: '阅读全文',
        labelEn: 'Read the full piece',
        labelJa: '全文を読む',
        labelKo: '전문 읽기',
      },
    ],
  },
  {
    date: '2026-08-07',
    type: 'longform',
    title: '译介：OpenAI 首份国家级 ChatGPT 使用数据，新加坡人均第一',
    titleEn: "Translated: OpenAI's first country-level ChatGPT data puts Singapore #1 per capita",
    titleJa: '翻訳：OpenAI 初の国別 ChatGPT 利用データ、シンガポールが一人当たり世界一',
    titleKo: '번역: OpenAI 첫 국가별 ChatGPT 이용 데이터, 싱가포르 1인당 세계 1위',
    summary:
      'OpenAI 于 2026-08-06 首次公布按国家拆分的 ChatGPT 使用数据。配套 Signals 数据集显示，2026 年第二季度新加坡人均消息量在 147 个国家中排第一（阿联酋第 6、美国第 51、日本第 57、印尼第 101）。这是继 Anthropic（AUI 5.53，116 地区第一）和微软（采用率 60.9%，全球第二）之后，第三家独立厂商数据把新加坡排进最前列。原文里新加坡唯一一次出场是反例——35 岁以上用户消息占比只涨 1.2 个百分点，各国中位数 5.1；站方补注解释了这个数字为何量的是消息构成而非采用水平。',
    summaryEn:
      "On 2026-08-06 OpenAI published country-by-country ChatGPT usage data for the first time. The accompanying Signals dataset ranks Singapore #1 of 147 countries on messages per capita for Q2 2026 (UAE #6, United States #51, Japan #57, Indonesia #101). This is the third independent vendor dataset to place Singapore at or near the top, after Anthropic (AUI 5.53, 1st of 116 regions) and Microsoft (60.9% adoption, 2nd globally). Singapore appears in the article body only as a counter-example — the share of messages from users aged 35+ rose just 1.2 percentage points against a 5.1-point country median; our editor's note explains why that figure measures message composition rather than adoption.",
    summaryJa:
      'OpenAI は 2026-08-06、国別に分解した ChatGPT 利用データを初めて公開しました。付随する Signals データセットでは、2026 年第 2 四半期の一人当たりメッセージ数でシンガポールが 147 か国中 1 位（UAE 6 位、米国 51 位、日本 57 位、インドネシア 101 位）。Anthropic（AUI 5.53、116 地域中 1 位）、マイクロソフト（採用率 60.9%、世界 2 位）に続き、独立した 3 社目のデータがシンガポールを最上位に置いたことになります。本文でのシンガポールへの唯一の言及は反例として——35 歳以上ユーザーのメッセージ比率の伸びが 1.2 ポイントにとどまり、各国中央値 5.1 を大きく下回った点です。編集部注でこの数値が採用水準ではなくメッセージ構成を測るものである理由を解説しています。',
    summaryKo:
      'OpenAI는 2026-08-06 국가별로 나눈 ChatGPT 이용 데이터를 처음 공개했습니다. 함께 공개된 Signals 데이터셋에서 2026년 2분기 1인당 메시지 수 기준 싱가포르가 147개국 중 1위(UAE 6위, 미국 51위, 일본 57위, 인도네시아 101위)를 기록했습니다. Anthropic(AUI 5.53, 116개 지역 중 1위)과 마이크로소프트(채택률 60.9%, 세계 2위)에 이어 세 번째 독립 업체 데이터가 싱가포르를 최상위에 올린 것입니다. 본문에서 싱가포르는 반례로 한 번 등장하는데, 35세 이상 사용자의 메시지 비중이 1.2%p 상승에 그쳐 국가 중앙값 5.1%p에 크게 못 미쳤습니다. 편집자 주에서 이 수치가 채택 수준이 아니라 메시지 구성을 측정한다는 점을 설명합니다.',
    links: [
      {
        href: '/openai-signals-chatgpt-at-work-2026/',
        label: '阅读全文翻译',
        labelEn: 'Read the full translation',
        labelJa: '全文翻訳を読む',
        labelKo: '전문 번역 읽기',
      },
    ],
  },
  {
    date: '2026-08-03',
    type: 'site',
    title: '上线 AI 职位指数：月度追踪新加坡 AI 招聘需求与薪资',
    titleEn: 'New: AI Jobs Index — monthly tracking of Singapore AI hiring demand and salaries',
    titleJa: '新機能：AI 求人指数 — シンガポールの AI 採用需要と給与を月次で追跡',
    titleKo: '신규: AI 채용 지수 — 싱가포르 AI 채용 수요와 급여를 월간 추적',
    summary:
      '基于 MyCareersFuture 官方 API 的月度快照：首期（2026-08）捕获 1,475 个在招 AI 职位，披露薪资中位数 S$8,000/月（P25–P75：S$6,000–10,500），TikTok、字节跳动、南洋理工大学、Google、新加坡国立大学居雇主前列。方法论冻结、快照不可变——历史不可回溯采集，序列本身就是资产；积满两个季度后开放环比视图。',
    summaryEn:
      'Monthly snapshots from the official MyCareersFuture API: the first capture (2026-08) counts 1,475 open AI positions, with a disclosed-salary median of S$8,000/month (P25–P75: S$6,000–10,500); TikTok, ByteDance, NTU, Google and NUS lead the employer table. Methodology is frozen and snapshots are immutable — history cannot be collected retroactively, so the series itself is the asset; quarter-over-quarter views unlock once two quarters accumulate.',
    summaryJa:
      'MyCareersFuture 公式 API による月次スナップショット：初回（2026-08）は 1,475 件の AI 求人を捕捉し、開示給与の中央値は月額 S$8,000（P25–P75：S$6,000–10,500）。雇用主上位は TikTok、ByteDance、南洋理工大学、Google、シンガポール国立大学。手法は凍結、スナップショットは不変——過去に遡って収集できないため、時系列そのものが資産。2 四半期分たまると前期比ビューが解放されます。',
    summaryKo:
      'MyCareersFuture 공식 API 기반 월간 스냅샷: 첫 회(2026-08)는 1,475개의 AI 채용 공고를 포착했으며, 공개 급여 중앙값은 월 S$8,000(P25–P75: S$6,000–10,500), 상위 고용주는 TikTok, ByteDance, 난양이공대학, Google, 싱가포르국립대학. 방법론은 동결되고 스냅샷은 불변 — 과거는 소급 수집할 수 없어 시계열 자체가 자산이며, 두 분기가 쌓이면 전분기 대비 뷰가 열립니다.',
    links: [
      {
        href: '/talent/#jobs-index',
        label: '查看职位指数',
        labelEn: 'View the jobs index',
        labelJa: '求人指数を見る',
        labelKo: '채용 지수 보기',
      },
    ],
  },
  {
    date: '2026-08-03',
    type: 'longform',
    title: '新栏目：新加坡 AI 研究月报（2026 年 7 月）',
    titleEn: 'New section: Singapore AI Research Monthly (July 2026)',
    titleJa: '新コーナー：Singapore AI 研究月報（2026 年 7 月）',
    titleKo: '신규 코너: 싱가포르 AI 연구 월간 (2026년 7월)',
    summary:
      '每月从 OpenAlex 数百篇新加坡署名 AI 论文中筛出最值得读的 5–10 篇：确定性预筛（新加坡一作或作者占比 ≥30%）+ venue 强度与引用排序 + 模型精选。首期收录 6 篇、3 个主题——AI 安全与评估、LLM 与智能体、AI for Science，覆盖 NUS、NTU、SUSS 等机构，四语同步。',
    summaryEn:
      'A monthly digest that distils the most notable 5–10 papers from the hundreds of Singapore-affiliated AI publications on OpenAlex: deterministic prefiltering (Singapore first author or ≥30% authorship share), venue-strength and citation ranking, then model-assisted curation. The first issue features 6 papers across 3 themes — AI safety & evaluation, LLMs & agents, and AI for Science — from NUS, NTU and SUSS, published in four languages.',
    summaryJa:
      'OpenAlex 上の数百件のシンガポール署名 AI 論文から、毎月最も注目すべき 5–10 本を厳選するダイジェスト：決定論的な事前フィルタ（シンガポール第一著者または著者比率 30% 以上）+ 会場強度・引用数ランキング + モデルによる選定。初回は 3 テーマ（AI 安全と評価、LLM とエージェント、AI for Science）にわたる 6 本を収録。NUS、NTU、SUSS などをカバーし、4 言語で同時公開。',
    summaryKo:
      'OpenAlex의 수백 편에 달하는 싱가포르 소속 AI 논문 중 매달 가장 주목할 만한 5–10편을 선별하는 다이제스트: 결정론적 사전 필터(싱가포르 제1저자 또는 저자 비율 30% 이상) + 학회/저널 강도·인용 순위 + 모델 큐레이션. 첫 호는 AI 안전성·평가, LLM과 에이전트, AI for Science 3개 주제에 걸쳐 6편을 수록 — NUS, NTU, SUSS 등을 다루며 4개 언어로 동시 공개.',
    links: [
      {
        href: '/fieldnotes/',
        label: '阅读首期月报',
        labelEn: 'Read the first issue',
        labelJa: '創刊号を読む',
        labelKo: '첫 호 읽기',
      },
    ],
  },
  {
    date: '2026-07-17',
    type: 'longform',
    title: '新发布：几个关于 AI 的问答',
    titleEn: 'New essay: A few Q&As about AI',
    titleJa: '新規公開：AI をめぐるいくつかの問答',
    titleKo: '신규 공개: AI에 관한 몇 가지 문답',
    summary:
      'sgai 编辑在 NUS 新全球企业家新加坡论坛的圆桌发言整理：企业如何选模型（一个原则、两个例外）、模型趋同后为何押注 Data、CEO 为何要亲自把最聪明模型的额度用光，以及什么才是围绕数据组织的 AI Native Company。中英日韩繁体五语同步。',
    summaryEn:
      'Notes from an sgai editor on a panel at the NUS Global Entrepreneurship Singapore forum: how enterprises should choose models (one principle, two exceptions), why Data becomes the real moat once model capabilities converge, why a CEO must personally burn through the quota of the smartest model, and what actually makes a company AI-native — being organized around its data. Published in all five languages.',
    summaryJa:
      'sgai 編集者が NUS 新グローバル起業家シンガポール・フォーラムのパネルで語った内容の整理：企業はどうモデルを選ぶか（一つの原則と二つの例外）、モデルが収束した後の本当の堀はなぜ Data なのか、CEO はなぜ最も賢いモデルの枠を自ら使い切るべきか、そしてデータを軸に組織された真の AI ネイティブ企業とは何か。5 言語で同時公開。',
    summaryKo:
      'sgai 편집자가 NUS 글로벌 기업가 싱가포르 포럼 패널에서 밝힌 내용 정리: 기업이 모델을 어떻게 고를지(하나의 원칙과 두 가지 예외), 모델이 수렴한 뒤 진짜 해자가 왜 Data인지, CEO가 왜 가장 똑똑한 모델의 할당량을 직접 다 써야 하는지, 그리고 데이터를 중심으로 조직된 진정한 AI 네이티브 기업이란 무엇인가. 5개 언어로 동시 공개.',
    links: [
      {
        href: '/enterprise-ai-four-questions/',
        label: '阅读全文',
        labelEn: 'Read the article',
        labelJa: '記事を読む',
        labelKo: '글 읽기',
      },
    ],
  },
  {
    date: '2026-07-05',
    type: 'site',
    title: '生态实体互链上线：21 个核心机构关联政策与国会辩论',
    titleEn: 'Ecosystem cross-links live: 21 core entities now link to policies and debates',
    titleJa: 'エコシステム相互リンク公開：中核 21 機関が政策・国会討論と連携',
    titleKo: '생태계 상호 링크 공개: 핵심 기관 21곳이 정책·의회 토론과 연결',
    summary:
      '为 AISG、IMDA、PDPC、AI Verify Foundation、MAS、A*STAR、四所大学等 21 个核心生态实体回填 133 条关联：51 条政策 + 82 条国会辩论，辩论关联全部经 Hansard 全文核验。生态详情页自此展示"相关政策 / 相关国会辩论"互链区块；知识图谱校验器同步覆盖 ecosystem 外键，杜绝悬空引用。',
    summaryEn:
      'Backfilled 133 cross-references for 21 core ecosystem entities — AISG, IMDA, PDPC, AI Verify Foundation, MAS, A*STAR, the four universities and more: 51 policy links and 82 parliamentary debate links, every debate link verified against the Hansard full text. Ecosystem profile pages now render "Related policies / Related debates" blocks, and the knowledge-graph verifier now covers ecosystem foreign keys to rule out dangling references.',
    summaryJa:
      'AISG、IMDA、PDPC、AI Verify Foundation、MAS、A*STAR、4 大学など中核エコシステム 21 実体に 133 件の相互参照を追加：政策リンク 51 件と国会討論リンク 82 件で、討論リンクはすべて Hansard 全文で検証済み。エコシステム詳細ページに「関連政策 / 関連議会記録」ブロックが表示されるようになり、ナレッジグラフ検証器も ecosystem の外部キーをカバーし、参照切れを排除しました。',
    summaryKo:
      'AISG, IMDA, PDPC, AI Verify Foundation, MAS, A*STAR, 4개 대학 등 핵심 생태계 21개 실체에 133건의 상호 참조를 추가: 정책 링크 51건과 의회 토론 링크 82건이며, 토론 링크는 모두 Hansard 전문으로 검증했습니다. 생태계 상세 페이지에 "관련 정책 / 관련 의회 토론" 블록이 표시되며, 지식 그래프 검증기도 ecosystem 외래 키를 커버해 끊어진 참조를 차단합니다.',
    links: [
      {
        href: '/ecosystem/imda/',
        label: '查看 IMDA 档案示例',
        labelEn: 'See the IMDA profile as an example',
        labelJa: '例として IMDA プロフィールを見る',
        labelKo: '예시로 IMDA 프로필 보기',
      },
    ],
  },
  {
    date: '2026-07-05',
    type: 'fix',
    title: '创业生态基础统计重定基线：逐项锚定可溯源公开口径',
    titleEn: 'Startup ecosystem stats re-baselined, each figure pinned to a named public source',
    titleJa: 'スタートアップ生態系の基礎統計を再基準化：数値ごとに出典を明示',
    titleKo: '스타트업 생태계 기초 통계 재기준화: 수치별 공개 출처 명시',
    summary:
      '旧基线（650+ 公司 / US$8.4B 融资 / 68% SEA 占比 / S$1.6B 政府投入，2026-02-17 口径）为多源混合、已无法溯源。本次逐项重定：AI 公司数 548 与累计融资 US$1.9B 锚定 Tracxn 2026-05 口径；东南亚 AI 融资占比约 57% 按 e-Conomy SEA 2025（Google/Temasek/Bain）估算；政府 AI 承诺投入 S$2.1B+ 为 Budget 2024（逾 S$10 亿）、Budget 2025 企业算力计划（至多 S$1.5 亿）与 2026 年 1 月国家 AI 研发计划（追加逾 S$10 亿）三笔公告合计。创业生态页口径说明同步写明全部来源。',
    summaryEn:
      'The previous baseline (650+ companies / US$8.4B raised / 68% SEA share / S$1.6B government commitment, dated 2026-02-17) mixed sources that could no longer be traced. Each figure is now pinned to a named source: 548 AI companies and US$1.9B cumulative funding follow Tracxn as of May 2026; the ~57% SEA AI funding share is estimated from the e-Conomy SEA 2025 report by Google, Temasek and Bain; and the S$2.1B+ government commitment sums Budget 2024 (over S$1B), the Budget 2025 Enterprise Compute Initiative (up to S$150M) and the National AI R&D Plan announced in January 2026 (over S$1B). The methodology note on the startups page now names every source.',
    summaryJa:
      '旧ベースライン（650+ 社 / 累計 US$8.4B / SEA シェア 68% / 政府投入 S$1.6B、2026-02-17 時点）は複数ソースの混合で出典を遡れなくなっていた。今回、各数値を単一の出典に固定：AI 企業数 548 社と累計調達 US$1.9B は Tracxn 2026 年 5 月時点、東南アジア AI 資金調達シェア約 57% は e-Conomy SEA 2025（Google/Temasek/Bain）から推計、政府 AI コミットメント S$2.1B+ は Budget 2024（10 億 S$ 超）+ Budget 2025 Enterprise Compute Initiative（最大 1.5 億 S$）+ 2026 年 1 月発表の国家 AI 研究開発計画（追加 10 億 S$ 超）の合計。スタートアップページの注記にも全出典を明記。',
    summaryKo:
      '기존 기준선(650+ 기업 / 누적 US$8.4B / SEA 점유율 68% / 정부 투입 S$1.6B, 2026-02-17 기준)은 여러 출처가 뒤섞여 더 이상 추적할 수 없었다. 이번에 각 수치를 단일 출처에 고정: AI 기업 수 548개와 누적 조달 US$1.9B는 Tracxn 2026년 5월 기준, 동남아 AI 펀딩 점유율 약 57%는 e-Conomy SEA 2025(Google/Temasek/Bain) 보고서에서 추산, 정부 AI 커밋 S$2.1B+는 Budget 2024(S$10억 초과) + Budget 2025 Enterprise Compute Initiative(최대 S$1.5억) + 2026년 1월 발표 국가 AI R&D 계획(추가 S$10억 초과)의 합계다. 스타트업 페이지 설명에도 모든 출처를 명시했다.',
    links: [
      {
        href: '/startups/',
        label: '查看创业生态',
        labelEn: 'View the startup ecosystem',
        labelJa: 'スタートアップ生態系を見る',
        labelKo: '스타트업 생태계 보기',
      },
    ],
  },
  {
    date: '2026-06-10',
    type: 'fix',
    title: 'AISG 档案补硬数据：拨款脉络、IOAI 2027、Kampong AI 归属澄清',
    titleEn: 'AISG profile hardened: funding history, IOAI 2027, Kampong AI ownership clarified',
    titleJa: 'AISG プロフィールを増強：資金の経緯、IOAI 2027、Kampong AI の帰属を明確化',
    titleKo: 'AISG 프로필 보강: 자금 내역, IOAI 2027, Kampong AI 소속 명확화',
    summary:
      '生态页 AI Singapore 档案补入经官方信源核验的硬事实：2017 年 NRF 六方共建与 1.5 亿新元启动拨款、2025–2030 年 10 亿新元国家 AI 研发投入、AISG × NTU 联合主办 IOAI 2027、NOAI 选拔通道；并澄清 AI Trailblazers（MCI × Google Cloud）与 Kampong AI（JTC 园区）均非 AISG 项目。同时修复一条失效的 NRF 来源链接。',
    summaryEn:
      'The AI Singapore ecosystem profile now carries officially sourced hard facts: the 2017 six-agency launch with up to S$150M from NRF, the S$1B national AI R&D pool for 2025–2030, AISG and NTU co-hosting IOAI 2027, and the NOAI selection pathway. It also clarifies that AI Trailblazers (MCI × Google Cloud) and Kampong AI (a JTC campus) are not AISG programmes. A dead NRF source link was fixed along the way.',
    summaryJa:
      'エコシステムの AI Singapore プロフィールに公式情報源で検証済みのハードファクトを追加：2017 年の 6 機関共同発足と NRF の最大 1.5 億シンガポールドル、2025–2030 年の 10 億シンガポールドル国家 AI 研究開発投資、AISG × NTU による IOAI 2027 共同開催、NOAI 選抜ルート。また AI Trailblazers（MCI × Google Cloud）と Kampong AI（JTC のキャンパス）が AISG のプロジェクトではないことを明確化し、リンク切れの NRF 出典も修復。',
    summaryKo:
      '생태계 AI Singapore 프로필에 공식 출처로 검증된 하드 팩트를 추가: 2017년 6개 기관 공동 출범과 NRF의 최대 1억 5천만 싱가포르 달러, 2025–2030년 10억 싱가포르 달러 국가 AI R&D 투자, AISG × NTU의 IOAI 2027 공동 개최, NOAI 선발 통로. 아울러 AI Trailblazers(MCI × Google Cloud)와 Kampong AI(JTC 캠퍼스)가 AISG 프로젝트가 아님을 명확히 했고, 깨진 NRF 출처 링크도 수정.',
    links: [
      {
        href: '/ecosystem/ai-singapore/',
        label: '查看 AISG 档案',
        labelEn: 'View the AISG profile',
        labelJa: 'AISG プロフィールを見る',
        labelKo: 'AISG 프로필 보기',
      },
    ],
  },
  {
    date: '2026-06-10',
    type: 'fix',
    title: '搜索体验修复：议员档案去重 + 重复页面合并',
    titleEn: 'Search fixes: MP profile dedupe + duplicate-page consolidation',
    titleJa: '検索体験の修正：議員プロフィールの重複排除 + 重複ページ統合',
    titleKo: '검색 경험 수정: 의원 프로필 중복 제거 + 중복 페이지 통합',
    summary:
      '基于 Google Search Console 数据的一轮 SEO 加固：清理 Hansard 抓取产生的 20 个议员重名档案（括号残留、敬称前缀、-2 后缀），辩论页发言人引用全部归并到正主；Cyberport 超算中心、法律框架与政策库的三对重复页面用 canonical 合并排名信号；补全 Ong Teng Koon 议员档案；AI 产业渗透页标题对齐搜索词。',
    summaryEn:
      'An SEO hardening pass driven by Google Search Console data: removed 20 duplicate MP profile stubs created by Hansard extraction artifacts (stray brackets, honorific prefixes, -2 suffixes) and remapped all debate speaker references to canonical ids; consolidated split ranking signals with rel=canonical across the Cyberport supercomputing pages and three legal-framework/policy-archive twins; enriched the Ong Teng Koon MP profile; aligned the AI-adoption tracker title with what people actually search.',
    summaryJa:
      'Google Search Console データに基づく SEO 強化：Hansard 抽出時の残留物（括弧、敬称接頭辞、-2 接尾辞)による議員プロフィールの重複 20 件を整理し、討論ページの発言者参照を正規 ID に統合。Cyberport スーパーコンピューティングセンターと法的枠組み/政策ライブラリの重複ページを canonical で統合。Ong Teng Koon 議員のプロフィールを補完し、AI 導入トラッカーのタイトルを検索語に合わせました。',
    summaryKo:
      'Google Search Console 데이터 기반 SEO 강화: Hansard 추출 잔재(괄호, 경칭 접두사, -2 접미사)로 생긴 의원 프로필 중복 20건을 정리하고 토론 페이지 발언자 참조를 정규 ID로 통합. Cyberport 슈퍼컴퓨팅 센터와 법률 프레임워크/정책 라이브러리의 중복 페이지를 canonical로 통합. Ong Teng Koon 의원 프로필을 보완하고 AI 도입 트래커 제목을 실제 검색어에 맞췄습니다.',
    links: [
      {
        href: '/voices/ong-teng-koon/',
        label: '查看议员档案',
        labelEn: 'View the MP profile',
        labelJa: '議員プロフィールを見る',
        labelKo: '의원 프로필 보기',
      },
    ],
  },
  {
    date: '2026-06-09',
    type: 'longform',
    title: '新发布：GIC 与淡马锡在 AI 上投了什么',
    titleEn: 'New: What GIC and Temasek have invested in AI',
    titleJa: '新規公開：GIC とテマセクは AI に何を投資したか',
    titleKo: '신규 공개: GIC와 테마섹은 AI에 무엇을 투자했나',
    summary:
      '系统梳理新加坡两家主权基金在 AI 上的已公开投资：GIC 连续三轮加注 Anthropic（两轮领投级），淡马锡同时入股 OpenAI 和 Anthropic，外加数据中心与 Databricks 仓位。每笔注明时间、规模和信源等级，全部链接经可达性验证。中英日韩繁体五语同步。',
    summaryEn:
      "A systematic survey of the public record of Singapore's two sovereign funds in AI: GIC backing Anthropic across three consecutive rounds (two at lead level), Temasek holding both OpenAI and Anthropic, plus data centre and Databricks positions. Every deal carries its date, scale, and source tier, with all links verified. Published in all five languages.",
    summaryJa:
      'シンガポールの 2 つのソブリンファンドの AI 投資の公開記録を体系的に整理：GIC は Anthropic に 3 ラウンド連続で投資（うち 2 回はリード級）、テマセクは OpenAI と Anthropic の両方を保有し、データセンターと Databricks のポジションも持つ。各件に時期・規模・情報源の等級を付記し、全リンクの到達性を検証済み。5 言語で同時公開。',
    summaryKo:
      '싱가포르 두 국부펀드의 AI 투자 공개 기록을 체계적으로 정리: GIC는 Anthropic에 3개 라운드 연속 투자(그중 2회는 리드급), 테마섹은 OpenAI와 Anthropic을 동시 보유하며 데이터센터와 Databricks 포지션도 보유. 각 건에 시기·규모·정보원 등급을 표기했고 모든 링크의 도달성을 검증했습니다. 5개 언어 동시 공개.',
    links: [
      {
        href: '/sovereign-capital-frontier-ai/',
        label: '阅读全文',
        labelEn: 'Read the article',
        labelJa: '記事を読む',
        labelKo: '글 읽기',
      },
    ],
  },
  {
    date: '2026-06-10',
    type: 'site',
    title: '议员档案页新增「国会 AI 发言记录」派生区块',
    titleEn: 'MP profiles gain a derived "Parliamentary AI record" section',
    titleJa: '議員プロフィールに「議会 AI 発言記録」派生セクションを追加',
    titleKo: '의원 프로필에 "국회 AI 발언 기록" 파생 섹션 추가',
    summary:
      '人物档案页的国会发言区块升级为派生式「国会 AI 发言记录」：按年份、按议题的统计与每场辩论的议题标签全部从库内 Hansard 记录自动派生。有 3 场以上辩论记录的待补充议员档案，自动生成一句事实摘要（如「国会议员。2021–2026 年间在 31 场 AI 相关国会辩论中发言」），顶替原来的占位文案出现在页面与搜索摘要中。',
    summaryEn:
      'The parliamentary section on voice profiles is now a derived "Parliamentary AI record": per-year and per-topic counts plus topic tags per debate, all generated from in-repo Hansard records. Stub MP profiles with 3+ debates get an auto-generated factual summary line (e.g. "Member of Parliament. Spoke in 31 AI-related parliamentary debates (2021–2026)"), replacing the placeholder text on the page and in search snippets.',
    summaryJa:
      '人物プロフィールの議会セクションを派生型「議会 AI 発言記録」に刷新：年別・テーマ別の集計と各討論のテーマタグをリポジトリ内の Hansard 記録から自動生成。3 件以上の討論記録を持つ未補完の議員プロフィールには事実ベースの一行サマリー（例「国会議員。2021–2026年に 31 件の AI 関連議会討論で発言」）を自動生成し、プレースホルダー文言を置き換えます。',
    summaryKo:
      '인물 프로필의 국회 섹션을 파생형 "국회 AI 발언 기록"으로 개편: 연도별·주제별 집계와 각 토론의 주제 태그를 저장소 내 Hansard 기록에서 자동 생성합니다. 3건 이상의 토론 기록이 있는 미완성 의원 프로필에는 사실 기반 한 줄 요약(예: "국회의원. 2021–2026년 31건의 AI 관련 국회 토론에서 발언")을 자동 생성해 자리표시 문구를 대체합니다.',
    links: [
      {
        href: '/voices/gerald-giam-yean-song/',
        label: '查看示例档案',
        labelEn: 'See an example profile',
        labelJa: 'プロフィール例を見る',
        labelKo: '예시 프로필 보기',
      },
    ],
  },
  {
    date: '2026-05-29',
    type: 'longform',
    title: '新发布：新加坡的 Claude 使用强度全球第一',
    titleEn: 'New: Singapore tops the world in Claude usage intensity',
    titleJa: '新規公開：シンガポール、Claude 利用強度で世界一',
    titleKo: '신규 공개: 싱가포르, Claude 사용 강도 세계 1위',
    summary:
      'Anthropic 2026 年 3 月 Economic Index 报告的 country usage 排名里，新加坡以 AI Usage Index 5.53 居首。文章拆解这个指标量的是人均普及强度——不是绝对用量，也不是使用复杂度——并说明算法为何偏向小而富、说英语、知识工作者密集的城市国家，以及新加坡政策如何持续把它推高。中英日韩繁体五语同步。',
    summaryEn:
      "In the country-usage ranking of Anthropic's March 2026 Economic Index, Singapore leads with an AI Usage Index of 5.53. The piece unpacks what the index measures — per-capita adoption intensity, not absolute volume or sophistication — why the formula favors small, rich, English-speaking, knowledge-worker-dense city-states, and how Singapore's policies keep pushing it up. Published in all five languages.",
    summaryJa:
      'Anthropic の 2026 年 3 月 Economic Index の country usage ランキングで、シンガポールが AI Usage Index 5.53 で首位に立ちました。本記事はこの指標が測るのは一人当たりの普及強度であって絶対量でも使用の高度さでもないことを解きほぐし、アルゴリズムが小規模で豊か・英語圏・知識労働者が密集する都市国家を有利にする理由、そしてシンガポールの政策がそれを押し上げ続ける仕組みを説明します。5 言語で同時公開。',
    summaryKo:
      'Anthropic의 2026년 3월 Economic Index country usage 순위에서 싱가포르가 AI Usage Index 5.53으로 1위를 차지했습니다. 이 글은 이 지표가 측정하는 것이 절대 사용량이나 사용 복잡도가 아니라 1인당 보급 강도임을 풀어내고, 알고리즘이 작고 부유하며 영어를 쓰고 지식 노동자가 밀집한 도시국가에 유리한 이유, 그리고 싱가포르의 정책이 이를 계속 끌어올리는 방식을 설명합니다. 5개 언어로 동시 공개.',
    links: [
      {
        href: '/anthropic-economic-index-singapore/',
        label: '阅读全文',
        labelEn: 'Read the article',
        labelJa: '記事を読む',
        labelKo: '글 읽기',
      },
    ],
  },
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

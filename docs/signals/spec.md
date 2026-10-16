# Signals（信号）—— 规格

状态：草稿，待 Luca 审阅（2026-10-16）。

## 1. 名称与路由

- 中文「信号」，英文 Signals，日文 シグナル，韩文 시그널。
- 列表页：`/signals/`（en，裸路径）、`/zh/signals/`、`/zh-tw/signals/`、`/ja/signals/`、`/ko/signals/`。
- 不做单条详情页。列表页上每条信号的标题链到来源原文（规则：链原文，不链快照）。
- 站内其他位置（首页「最近更新」、`/updates/`、主题页）的链接指向 `/signals/#<id>`：这些位置都经过 `localizedHref()`，只接受站内路径。列表页每条带 `id` 锚点。

## 2. 数据

新文件 `src/data/signals.ts`，导出 `signals: Signal[]`，新条目插在数组开头。

```ts
export interface Signal {
  id: string;            // 'sig-YYYYMMDD-<slug>'，稳定，不改
  date: string;          // 事件 / 发布日期 YYYY-MM-DD
  title: string;         // zh
  titleEn: string;
  titleJa: string;
  titleKo: string;
  whyItMatters: string;  // zh，一句判断：为什么值得看。带具体数字 / 日期 / 机构，不复述标题
  whyItMattersEn: string;
  whyItMattersJa: string;
  whyItMattersKo: string;
  sourceUrl: string;     // 原文地址，入库前 HTTP 校验（规则 #6）
  sourceName: string;    // 发布方，英文原名，如 'The Business Times'、'MDDI'
  topicIds: string[];    // 1 到 3 个，取自 src/data/topics.ts，verify-graph 校验
  related?: Array<{ kind: 'policy' | 'person' | 'ecosystem' | 'startup' | 'debate' | 'video'; id: string }>;
                         // 站内实体链接，可选；verify-graph 校验 id 存在
  addedAt: string;       // 入库当天，规则 #7
}
```

约束：

- zh / en / ja / ko 四语字段同一次 commit 写齐（规则 #5）。zh-tw 运行时 OpenCC。
- `sourceName` 是英文原名，不含 CJK，不需要兄弟字段。
- 不设 `autoDiscovered` / `_pendingReview` 中间态。PR 审核就是人工关口，和 videos 一样。
- 一条信号 = 一件事。同一事件多家报道只收一条，`sourceUrl` 取一手来源（官方新闻稿优先于转述）。

## 3. 页面

### 3.1 `/signals/` 列表页

- 共享组件 `src/components/signals/SignalsPage.astro`，`src/pages/signals/index.astro` 与 `src/pages/[lang]/signals/index.astro` 只做路由。
- 按周分组（ISO 周，标题形如「2026 年第 42 周 · 10 月 13 日至 19 日」），组内按 `date` 倒序。
- 每条：日期、标题（链到 `sourceUrl`，新窗口）、来源名、一句判断、主题标签、站内关联链接（有则显示）。
- 顶部主题筛选条：全部主题的 chip，点击只显示含该主题的条目。纯前端：条目带 `data-topics="a b"`，一段内联原生 JS 切换 `hidden`。URL hash `#topic=<id>` 记住选择。无 JS 时显示全部。
- 每个标签同时链到 `/topics/<id>/`。
- 页面 title / description 走 `synthesizeMetaDescription`，不手写截断。
- 文案全部走 `t(lang, key)`，不写 `lang !== 'zh'`（规则 #13）。

### 3.2 首页块

- 新组件 `src/components/home/SignalsBlock.astro`，放在 `HomePage.astro` 的 `FocusHeadline` 之后、`LatestUpdatesFeed` 之前。
- 标题「本周值得关注」+「查看全部」链到 `/signals/`。
- 内容：最近 14 天内的信号，最多 6 条；不足 3 条时改取最新 6 条，保证块不空。零条时整块不渲染。
- 每条显示：标题（链原文）、来源名、一句判断、标签。

### 3.3 主题页

- `src/utils/topic-graph.ts` 的 `TopicEntryKind` 增加 `'signal'`，信号按 `topicIds` 进入主题页的「最近动态」和分组列表。`KIND_ORDER` / `KIND_LABEL_KEY` / `RECENT_LABEL_KEY` 补 signal 项，i18n 补四语 label。

### 3.4 「最近更新」feed

- `src/data/updates.ts` 的 `UpdateType` 增加 `'signal'`；`src/utils/derived-updates.ts` 增加 `harvestSignals()`，`DataSource` 加 `'signal'`。i18n 补 `updateTypeSignal` 四语。
- `scripts/evals/addedAt-coverage/check.ts` 的 `DATA_FILES` 加 `src/data/signals.ts`（`data-files-sync.test.ts` 会要求两边一致）。

## 4. 管线 `scripts/refresh/signals/`

一周一跑（registry `schedule: weekly`，`mode: auto-pr`，`targets: ['src/data/signals.ts']`）。流程：

1. **scan**（`scan.ts`）：读 `sources.ts`，抓最近 `--days=7` 的条目。来源与类型：
   - RSS：`businesstimes.com.sg/rss/technology`、`aisingapore.org/feed/`（排除 'AI Research' 分类）。
   - RSS：CNA 最新新闻（`channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511`）、Tech in Asia（`techinasia.com/feed`，区域性，靠 judge 的新加坡条件过滤）。
   - sitemap：`mddi.gov.sg/newsroom/`（排除演讲，演讲归 voices）、`imda.gov.sg/resources/press-releases-factsheets-and-speeches/`（同样排除演讲）。
   - 2026-10-16 实测不收：Straits Times（RSS 400、sitemap-news 404）、e27（403）、MAS sitemap（无 lastmod，且演讲已由 voices 覆盖）。
   - gov sitemap 的 `lastmod` 不可信（IMDA 把 2023 年的 AI Verify 发布稿标成 2026-10-15 修改）。sitemap 来源先按 URL slug 含 AI 关键词粗筛，再在 judge 前用 `govFetch` 取正文发布日期，早于窗口的丢弃；取不到日期的也丢弃（新闻窗口只有一周，没有日期就无法判断）。
   - 每个来源一个 `urlFilter`；复用 `scripts/lib/gov-fetch.ts` 的 `listSitemapEntries` 与 ecosystem 的 RSS 解析。单个来源失败只记 WARN，不中断。
   - 候选去重：排除 `signals.ts` 已有 `sourceUrl`、`voices.ts` / `videos.ts` / `policies.ts` 已收录的 URL、两级拒绝台账（`scripts/refresh/_shared/data/rejected-urls.json` 与 `scripts/refresh/signals/data/rejected-urls.json`）。
2. **judge**（`judge.ts`）：对每个候选抓正文，Claude（haiku）判两件事：是否同时满足「新加坡」与「AI」；重要性 1 到 5 分并给一句理由。闭集输出，JSON。sha256 缓存到 `data/judgments/`。不满足两个条件或分数 < 4 的，写入域级拒绝台账（`reason: 'non-ai' | 'non-sg' | 'low-signal'`），下周不再出现。
3. **select**：按分数倒序取前 `--limit`（默认 8）。同一事件多条时按 `sourceUrl` 域名优先级保留一手来源（gov.sg > 机构官网 > 媒体）。
4. **draft**（`draft.ts`）：zh 标题（≤ 30 字）+ `whyItMatters`（复用 `scripts/lib/why-it-matters.ts` 的起草器）；en / ja / ko 走 `scripts/lib/translate.ts`；`topicIds` 由 Claude 在 `topics.ts` 的 id 闭集里选 1 到 3 个，代码校验不在集合内的丢弃；`related` 用确定性名称匹配（people `nameEn` / aliases、ecosystem 实体名、startups 名），匹配不到就不写。任一语言起草失败则整条跳过并 WARN，绝不写出单语条目。
5. **emit**（`emit.ts`）：所有 `sourceUrl` 过 `validateUrls()`，失败的整条删掉；生成记录插入 `signals.ts` 开头，`addedAt: today`；跑 `findUnpairedFields` baseline-vs-after，有新 unpaired 就回滚；`autoCommit()` 到 `data-refresh/signals/<date>`，`pushAndOpenPR()`，PR 描述列出每条的分数、理由、来源。
6. 最后一行 stdout 输出 JSON 报告 `{domain:'signals', added, failures, pr_url, elapsed_seconds}`，供 `auto_update.py` 解析。

CLI：`--dry-run / --limit=N / --no-commit / --no-push / --days=N`。`--dry-run` 跑到 select 为止并打印候选与分数，不调起草、不写文件。

开跑前 `ensureClaudeAuthed()`。

## 5. 检查与门

- `npm run check` 全链（含 `check:i18n-completeness` 自动纳入新文件、`check:graph` 校验 `topicIds` 与 `related`、`eval:source-i18n`）。
- `npm run eval:addedAt`、`eval:coverage-audit`（registry 归属）。
- `npm run build && npm run check:dist`（五语页面无异种残留、meta 合规）。
- 新增单元测试：`scan` 的 URL 过滤与去重；`judge` 的 JSON 解析与阈值；`select` 的同事件去重与来源优先级；`emit` 的记录模板与四语缺一回滚；`harvestSignals` 产出；`SignalsBlock` 的 14 天 / 最少 3 条回退逻辑（抽成纯函数测）。
- 手工验收：`npx tsx scripts/refresh/signals/run.ts --dry-run --days=14` 能列出候选与分数；去掉 `--dry-run` 跑一次开出 PR；合并后首页块、`/signals/` 五语、任一主题页都能看到信号；`/updates/` 出现 signal 类型条目。

## 6. 文档与登记

- `scripts/refresh/registry.json` 加 `signals` 条目。
- `docs/refresh-playbook.md` 加一节；`CLAUDE.md` 管线表加一行。
- `src/navigation.ts`：「最新」旁加「信号」。
- `skill/url-map.json` 与 `public/openapi.json` 本期不动（无详情页、无 JSON 导出）。
- CHANGELOG 记录；`src/version.ts` 升版。

## 7. 不在本期

邮件 newsletter；单条详情页与 Markdown 孪生；`/data/signals.json` 导出；每日频率；读者投票或排序。

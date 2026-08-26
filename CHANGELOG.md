# Changelog

记录 SG AI 观察 / SG AI Observatory 的版本变化。日期使用本地时间（新加坡）。

---

## Unreleased

### 详情页 Markdown 孪生 + 「报告错误」入口

- 每个辩论 / 政策 / 视频详情页新增 Markdown 孪生：`<页面路径去掉尾斜杠>.md`（如 `/zh/debates/oral-answer-4088.md`）。整条记录一次抓取——标题、日期、相关方、来源、永久链接、许可、为什么重要、摘要、要点、全文（辩论另附 Hansard 英文原文）。此前 agent 想读全文只能啃 200 KB 的 HTML，`llms-full.txt` 又只是链接索引。
- 新增 `src/utils/markdown-export.ts`（`debateToMarkdown` / `policyToMarkdown` / `videoToMarkdown`）：所有本地化字段走 `pickLocalized`，段落标题用 per-heading 的四语字典 + zh-tw 走 `toTraditional`，五语各自成文，不回落中文。
- 新增 6 条路由（`src/pages/{,[lang]/}{debates,policies,videos}/[id].md.ts`），`getStaticPaths` 与同名 `.astro` 页一一对齐；`public/_headers` 给 `/*.md` 加 `Content-Type: text/markdown` 与 CORS。
- `CiteBlock.astro` 加「报告错误」与「Markdown 版」两个链接。前者直达 GitHub issue 表单并预填页面 URL——本站的错多是事实层面的（官方译名、日期、机构），读者比我们先看见。
- 新增 `.github/ISSUE_TEMPLATE/correction.yml`（issue form，字段 `page` / `what` / `should_be` / `source`）与 `config.yml`（保留空白 issue；仓库未开 Discussions，故不加 contact link）。
- 逐字原文一律带版权行：辩论的 Hansard、政策原文（`© <发布机构>`）、视频字幕（`© <频道>`）在 `## 全文` 下各自加一句「仅供引用」（五语，zh-tw 走 OpenCC）。同时修掉 EN 辩论孪生把 Hansard 全文印两遍的 bug——`getDebateTranscriptParagraphs` 在无本地化轨时返回的就是 `paragraphsEn`，按值判等去重，不加语言分支。
- 新增门 `npm run check:markdown-export`（挂进 `check:dist`）：全量扫 `dist/**/*.md`，断言首行是 H1、含 `- sgai: https://sgai.md/` 永久链接行、含 CC BY 4.0 许可标记、元数据块内无 `undefined` / `[object Object]` 残留（正文是逐字原文，豁免）。带单测。

### 数据导出信封 + 三个新端点 + OpenAPI（⚠️ 破坏性变更）

- **破坏性**：`/data/debates.json`、`/data/policies.json`、`/data/tracker.json` 不再是裸数组。行现在放在 `.items` 里，外面套一层信封：`schemaVersion`（=1）、`dataset`、`siteVersion`、`dataUpdated`、`license`、`attribution`、`count`、`items`。**下游从 `resp[0]` 改成 `resp.items[0]`。** 原有字段一个没删。
- 每行新增 `links`：`links.sgai` 是这条记录在五种语言下各自的绝对页面地址（en 裸路径，其余走 `/<lang>/` 前缀），`links.source` 是上游原始链接。以前拿到一行数据没法回链具体页面，等于没法引用本站——这是加信封的主因。
- 新端点：`/data/videos.json`（全部视频，四语标题 / 摘要 / whyItMatters，不含字幕全文）、`/data/records.json`（`harvestAll()` 的每条 record 一行，按 `addedAt` 倒序，跨域合并——更新流的机器版）、`/data/index.json`（数据集目录：地址 + 当前条数 + 一句话说明）。
- 新增 [public/openapi.json](public/openapi.json)（OpenAPI 3.0，手写，线上 `https://sgai.md/openapi.json`）：六个 GET 路径 + `Envelope` / `Links` / 各数据集 item schema。`npx @redocly/cli lint` 通过。
- `public/_headers` 显式加 `/data/*` 规则（`Access-Control-Allow-Origin: *` + `max-age=300, s-maxage=3600`）。线上的 CORS 头此前来自 Cloudflare 侧的全站规则，仓库里没有任何声明——现在这条保证进了 git。
- 新增 [src/utils/data-export.ts](src/utils/data-export.ts)（`envelope()` / `recordLinks()`）。`dataUpdated` 取 `SITE_UPDATED`（从数据的 `addedAt` 派生），**不用构建时间戳**——否则每次部署所有数据集字节都变，ETag 全废、也没法从文件本身判断数据到底动没动。
- 新门 `npm run check:data-export`（[scripts/evals/data-export/check.ts](scripts/evals/data-export/check.ts)），挂进 `check:dist`：扫 `dist/data/*.json` 断言信封契约与 `links.sgai` 的五语完整性 + 前缀匹配。13 个单测挂进 `test:lib`。
- `/agent/` 页面（四语）与 `llms.txt` / `llms-full.txt` 同步：数据表补三个新端点、curl 样例改 `curl -s https://sgai.md/data/records.json | jq '.items[0]'`、加一句信封说明和 `openapi.json` 链接。
- `/data/debates.csv` 未改动：加 `#` 注释头会打断 pandas / Excel 的表头解析，而这个文件对外宣传的用途正是「丢进表格或 notebook」。许可信息由同目录的 JSON 与 `openapi.json` 承担。

### Agent 接入：`/agent/` 页面 + 从本站发布 skill

- 新增五语 `/agent/` 页面（`src/components/agent/AgentPage.astro` + `src/pages/agent/index.astro` + `src/pages/[lang]/agent/index.astro`）：一页讲清 skill 安装、RSS、JSON/CSV 数据集、Markdown 孪生页、`llms.txt`，以及署名与核对原始 `sourceUrl` 的规矩。zh / en / ja / ko 四语手写，zh-tw 走 OpenCC 派生。
- skill 改为从本站发布：`scripts/publish-skill.mjs` 在 `prebuild` / `predev` 把 `skill/` 的三个文件拷进 `public/skill/`（已 gitignore），安装命令从 raw.githubusercontent.com 改为 `https://sgai.md/skill/SKILL.md`。**`skill/` 是唯一真相源，不要改 `public/skill/`。**
- 修 `skill/url-map.json` 的 zh / en 路径倒挂：本站 EN 在裸路径、ZH 在 `/zh/`，此前整份 map（以及 SKILL.md 的 URL 表、人物示例、footer 模板）写反了；`skill/eval/test-questions.jsonl` 的断言同步翻正。SKILL.md 与 url-map.json 一起升到 `0.2.0`（URL 契约变了），"bilingual (zh/en)" 全部改为五语表述。
- 新增 `scripts/skill/build-url-map.ts`（`npm run skill:build-url-map`）：从 `policies.ts` / `debates.ts` 回填 `validIds`（49 + 187），让 `check:skill-urls` 能真正展开并逐条 HEAD 检查详情页 URL。补上此前 404 的 `public/schemas/skill-url-map.v1.json`（draft-07）。
- `llms.txt` / `llms-full.txt` 加 `## Agent interfaces` 段；`robots.txt` 加注释说明 AI 检索爬虫是有意全站放行的。
- `scripts/evals/run-all.ts` 加 weekly `skill-urls` stage；新 marker reason `agent-api-sample`（仅 zh / zh-tw / ja / ko，非全 locale）并同步 `i18n-allow-reasons.test.ts`。

### 月报落地为站内长文 + 主题页「最近动态」

- `scripts/refresh/newsletter/generate-monthly.ts` 加 `--emit-post`：把当月更新写成 zh 博文 `src/data/post/monthly-YYYY-MM.md`（`--out` / `--publish-date` / `--topics` 可覆盖），月报从此有永久 URL、SEO 和 llms.txt 条目，不再只活在 Buttondown 邮件里。长文取 `sortedUpdates()`——`MANUAL_UPDATES` 里的 site / fix / longform 编辑性条目只在这里合并，用 `deriveUpdates()` 会漏掉当月所有长文；这类条目没有 `href`，按 `links[0].href` 出链。邮件正文仍走 `deriveUpdates()`，stdout 逐字节不变。
- 正文组装抽成纯函数 `scripts/refresh/newsletter/build-monthly-post.ts` 的 `buildMonthlyPost()`（不依赖 `src/data`，可用假 `Update[]` 单测）：统计行（`本月站内更新 N 条：… · 阅读约 M 分钟`）、`## 本月主线` 手写占位、按 政策 / 辩论 / 视频 / 演讲 / 人物 / 长文 / 其他 分节（`longform` 单独成节——当月的长文最值得读者补看；`site` / `fix` 这类站务事件留在 其他）、每条带 record 自己的事件日期与一句 `whyItMatters` 判断。`topicIds` 取当月 policy / debate / video 的 topic 并集，为空回落 `national-strategy`（`check:graph` 的 post coverage 门）。
- 主题页（`TopicHub.astro`）在分类分组之上加「最近动态」：跨所有类型 + 博文合并、按日期倒序取 20 条，日期 + 类型徽标 + 标题。不足 3 条有日期的条目就整段不显示。新 i18n key `topicRecentHeading`（中 / 英 / 日 / 韩，繁体自动派生）。
- 页脚品牌栏加订阅表单 `NewsletterSignup`（`BUTTONDOWN_FORM_ID` 为空时整个组件不渲染，建号后填一行即上线）。
- 文档：`docs/refresh-playbook.md` 新增「`/updates` + 月报（Newsletter）」一节，写清生成 → 手写主线 → 四语翻译 → `check:post-i18n` → PR 的完整月度流程。
- 修复主题页长文分组在非中文语言下永远为空：`TopicHub.astro` 用 `p.id.endsWith('/<slug>.md')` 找译文镜像，但 glob loader 的 `id` 不带扩展名（且 locale 前缀可能是 `en/foo` 或 `en-foo`），条件永不成立——`/en/`、`/ja/`、`/ko/` 的主题页从来看不到任何博文。改按规范化 slug 比对。
- `NewsletterSignup.astro` 加可选 `idSuffix` prop（页脚传 `-footer`），避免同一页面（`/updates/`）出现两个 `id="bd-email"`；组件在 `BUTTONDOWN_FORM_ID` 为空时仍然完全不渲染。
- 新单测 `scripts/refresh/newsletter/__tests__/build-monthly-post.test.ts`（9 例），已挂进 `test:lib`。

### 「为什么重要」字段（whyItMatters）四语回填

- `Policy` / `VideoItem` / `Debate` 各加 `whyItMatters` + `En / Ja / Ko`：一句话说清这条对新加坡 AI 战略的意义（含具体数字 / 日期 / 机构），与 `summary`（发生了什么）分开。49 政策 + 84 视频 + 187 辩论整批回填。
- 新 `scripts/lib/why-it-matters.ts`（`draftWhyItMatters`，sonnet 草稿 + 形状校验 + sha256 缓存）与 `scripts/backfill-why-it-matters.ts`（按 `id` 定位、`summaryKo` 值后插 4 行、写前 TS 解析校验、prettier 回流；`--only / --limit / --dry-run / --force / --concurrency`）。
- 展示：政策 / 辩论 / 视频详情页摘要下加「为什么重要」块；首页「最近更新」与 RSS 的一句话优先用它；`qa-corpus.txt` 每条追加 `Why it matters:`（Ask AI 语料）。
- 门：`i18n-pair.ts` 的 `DEFAULT_FIELDS` 加 `whyItMatters`（有 zh 就必须四语），`i18n-config.ts` policy schema 登记（可选字段）。
- videos / policies 两条 refresh 管线**入库即产出**四语 `whyItMatters`：新增 `scripts/lib/why-it-matters-batch.ts`（起草 + en/ja/ko 批量翻译，起草器与翻译器都可注入，缓存目录与回填脚本共用），`scripts/refresh/videos/emit.ts` 与 `scripts/refresh/policies/emit.ts` 对每条**新**记录调用它，四行紧跟 `summaryKo` 写入。dry-run 不起草，不烧 LLM。
- 失败策略：起草被校验拒绝、LLM 报错、或 en/ja/ko 任一翻译为空，都只打一行 WARN 并**四条全不写**（绝不只写 zh，`check:i18n-completeness` 会当场拒），emit 继续跑完——一条判断缺失不该拖垮整个数据刷新 PR。
- `scripts/refresh/videos/emit.ts` 改为可被 import：`--ids` 参数校验挪进 `main()`，`main()` 挂入口守卫，导出 `buildEntrySnippet` / `attachWhyItMatters` 供单测使用。`scripts/refresh/policies/emit.ts` 的 `emit()` 改为 async。
- 新单测（离线，不碰网络与 `claude` CLI）：`scripts/refresh/videos/__tests__/emit-why-it-matters.test.ts` 与 `scripts/refresh/policies/__tests__/emit-why-it-matters.test.ts`，覆盖成功写四行、起草抛错写零行、翻译残缺写零行三种路径。
- debates 仍走 Python hansard 管线，不自动产出——新辩论落地后跑 `npx tsx scripts/backfill-why-it-matters.ts --only=debates` 补（已写进 CLAUDE.md rule #5 与 refresh-playbook）。

### 「最近更新」改为每条一行，变化可见

- `src/utils/derived-updates.ts`：派生条目从「同日同类合并一行（A、B、C 等 N 条）」改为**每条 record 一行**——标题直链、record 自带的一句 summary、record 自己的事件日期（国会 / 发布 / 宣布）与收录日期并列。新增 `harvestAiCapital`：`ai-capital.ts` 自 2026-08-14 起有 `addedAt` 却没有 harvester，9 条资本事件从未上过首页。
- 首页 Masthead：总量（187 辩论 …）退居次级，新增「过去 7 天新增 +N（2 辩论 · 3 视频）· 截至 <日期>」，锚在数据里最新的 `addedAt` 而非构建时间；RSS 图标改指 `updates.rss.xml`（原来指向博客 RSS）。
- 首页 feed 窗口：最近 14 天全部、至少 8 行、最多 20 行；日期头「8月14日 · 星期五 · N 条」。
- `/updates/`：最近 8 周按 ISO 周分组，更早按月；RSS 链接改 `localizedHref`。
- 「上次访问后新增 N 条」徽标 + 行首圆点（`SinceLastVisit.astro`，浏览器本地，首页与 `/updates/` 都挂）。
- `updates.rss.xml`（根 + 各语言）：每条 item 直链到 record 页；非 en 语言的标题 / 摘要改按语言取值（此前全部用中文字段）；去掉没人渲染的 `#date-type` 锚点。
- 抽 `src/utils/update-type-ui.ts`（chip / 标签 / 严格按语言取文案，不回落中文）和 `src/utils/date-format.ts`；删除死代码 `RecentUpdates.astro`。
- 新单测 `data-files-sync.test.ts` 锁死 `addedAt-coverage` 的 `DATA_FILES` 与派生器 import 的数据文件清单一致。
- CLAUDE.md：删掉不存在的 `eval:updates-ledger`，rule #7 文件清单补 voices / reg-lookahead / ai-capital。

- 修复 levers 自动发现管线的 i18n 漏检：待审核分组改用中文底稿并补齐中英日韩标题；生成器提交前改跑与 CI 一致的字段对齐和 schema 完整性校验，避免再次生成必挂 CI 的 PR。

## 0.25.6 — 2026-08-26

### 数据许可声明改为字段级

- 新增 `DATA-LICENSE.md`（中英）：sgai 自产内容（摘要、译文、分析、whyItMatters）CC BY 4.0；逐字原文（Hansard、部长演讲、视频字幕、政策原文）© 原权利人，仅供引用、不再授权。此前 About 页笼统写「内容 CC BY 4.0」，把不属于本站的原文一并授权了。
- `LICENSE.md` 版权行补 sgai.md contributors，头部指向 DATA-LICENSE。
- 新增 `src/utils/license.ts`：`licenseLine(lang)`（五语，zh-tw 走 OpenCC）+ `licenseObject()`，供 About / llms.txt / llms-full.txt 及后续 `.md` 导出、JSON 接口共用。
- About 页（zh / en / ja）「反馈与更正」前加「数据许可」段；版本行文案同步。
- `llms.txt` / `llms-full.txt` 元数据加 License 行。

## 0.25.5 — 2026-08-20

### 新增长文：新加坡管 AI 的部门有哪些

- `singapore-ai-agencies-map` 五语同步（zh / en / ja / ko / zh-tw）。按「拍板、定规矩、出钱、供人、自己先用、行业落地、国防内政、对外」八段梳理 40+ 部委与法定机构，每个数字带来源。
- **翻译术语表扩容**（[glossary.json](scripts/evals/translation/glossary.json)）：原 `institutions` 只有 7 条，本文涉及的机构几乎全部未收录，`translate-post` 因此把 MinLaw 译成 Attorney-General's Chambers、DSO 译成 Defence Science and Technology Research Institute、JTC 译成 Jurong Group、HTX 全称也错。新增 40 条机构词条（en/ja/ko 三语），并给原有 7 条补上此前完全缺失的 `ko`（loader 支持 ko，但表里一条都没有，韩文翻译等于无术语约束）。
- ja / ko 译文改为直接撰写：`translate-post` 对本文反复触发 `callLlm: timeout after 120000ms` 并逐层对半拆批，单语种跑逾 30 分钟未完；且其产出的机构名仍需逐条人工校正。en 译文保留脚本产出并做了 19 处专有名词修正。

## 0.25.4 — 2026-08-20

### 数据订正：AISI 与 CSA Agentic AI 增补稿

- **AISI 记录去掉无源数字**（[policies.ts](src/data/policies.ts) `singapore-ai-safety-institute`）：原文写「2024 年成立，年度预算 S$10M」「红队评估、对齐研究、可追溯性测试三类核心研究」，均无官方来源。按 [IMDA 2024-05-22 factsheet](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/digital-trust-centre) 订正为：2024-05-22 IMDA 将 DTC 指定为 AISI；DTC 2022 年 6 月由 IMDA 委托 NTU 设立、Lam Kwok Yen 教授领衔、**初始拨款 S$5,000 万**；官方四个初始研究方向为测试与评估、安全的模型设计与开发部署、内容保障、治理与政策。`sourceUrl` 从 `sgaisi.sg` 改指 IMDA factsheet（原 `sgaisi.sg` 保留在 `sourceOrgUrl`）。DTC/NTU 承载 + IMDA 主管这一分工原记录已正确，未改。
- **CSA Securing Agentic AI 增补稿补齐两段时间线**（[policies.ts](src/data/policies.ts)、[legal-ai.ts](src/data/legal-ai.ts)）：原文只写「增补稿（2025）」，漏了定稿。实为草案 2025-10-22 公开征求意见（截止 2025-12-31）、定稿 **2026-06-17** 发布。
- **新增独立政策记录** `securing-agentic-ai-addendum`（2026-06，四语齐全）：此前政策库只在 CSA 2024 指南正文里带一句，没有独立条目。
- **HTX 归属显式化**（[levers.ts](src/data/levers.ts)）：原数据只写 `ministry: 'HTX'` 这个裸缩写，没有任何字段标出它的上级部门，站内 AI 问答因此把 HTX 说成国防部（MINDEF）下属。HTX 是内政科技局，归**内政部 MHA**。4 条 HTX lever 的 `ministry*` 补上 MHA，两个板块标题（「家国安全」「家国安全侧算力」）也点明 MHA。数据本身没有把 HTX 挂到 MINDEF 的地方——这是缺上级字段导致的生成侧误判，补字段是为了堵住这个口子。
- **README 政策数 48 → 49**：新增政策记录后 `eval:facade-stats`（CI 门，不在本地 `npm run check` 里）报 drift。
- **修掉 CHANGELOG 里的残留 merge marker**（`||||||| 027ec01`，0.24.1 与 0.24.0 之间）。

## 0.25.3 — 2026-08-14

- **/videos 分类板块按时间排序**：分类板块按各自最新视频日期倒序排列（最近有新视频的分类排前面），顶部分类筛选按钮同步同一顺序；组内原有按日期倒序不变（[VideosIndex.astro](src/components/videos/VideosIndex.astro)）。

## 0.24.1 — 2026-08-14

### P1/P2 迭代批（docs/20260814-stakeholder-iteration-plan.md）

- **P1-1 资本与基础设施视图**：新数据文件 [`src/data/ai-capital.ts`](src/data/ai-capital.ts)（9 条带日期/金额/来源的资本记录，实体名复用 ecosystem id、数据值零 CJK）；`/ecosystem` 页新增资本节（[`CapitalSection.astro`](src/components/data/CapitalSection.astro)）；tracker 投资维新增渲染期派生的「资本放大倍数」行（S$1→S$13，公式与口径 caveat 显式呈现）；registry editorial 登记。
- **P1-2 Missions 垂直 hub**：新增 `advanced-manufacturing`、`connectivity` 两个 topic（四语）；四条 mission 垂直线跨域策展（2 场辩论 + NAIS 政策 + 预算演讲视频 v006 + 两篇长文）；首页新增 MissionsRail。
- **P1-3 AISG 支柱长文**：`/aisg-explained/` 五语同步，按 writing.md 写作规范（无加粗/无对比抬杠/短段），MANUAL_UPDATES longform 条目。不配专属封面图——封面只增困惑、无增量信息，按反馈移除，回落站点默认 OG。
- **P1-4 newsletter**：月报生成脚本 [`scripts/refresh/newsletter/generate-monthly.ts`](scripts/refresh/newsletter/generate-monthly.ts)（deriveUpdates 驱动，站方判断段手写）+ 零 JS Buttondown 订阅表单（填 form id 激活）+ /updates 页接入。
- **P2-1 jobs-index 行业切片**：METHODOLOGY_VERSION → 2，新增 SectorId 分类（公司名优先规则 + LLM 兜底）；sector 序列自 2026-09 快照起（v1 8 月快照冻结不回溯）。
- **P2-3 旗舰项目完备性校验**：verify-graph 新增 FLAGSHIP_PROGRAMS 断言（AIAP/SEA-LION/AI Verify/TagUI/100E/NOAI 必有生态实体）；补建 NOAI 实体（含四语深字段）。
- **P2-4 数据导出**：`/data/debates.json|csv`、`/data/policies.json`、`/data/tracker.json` 静态导出端点（与页面渲染同源）。
- **P2-5 sitemap lastmod**：build 链新增 [`scripts/build-lastmod.ts`](scripts/build-lastmod.ts) 预构建步骤，serialize 钩子按 addedAt 输出 `<lastmod>`（195 条路径映射）。
- **P2-6 OG 动态图**：新脚本 [`scripts/generate-og-images.ts`](scripts/generate-og-images.ts) 生成首页/六维共 7 张 OG 图（`src/assets/images/og/`），首页与六维详情页已接线。两篇长文（年度盘点 / AISG）不配专属图——封面只增困惑、无增量信息，回落站点默认 OG。
- **P2-7 议员 stub 转正**：核实为已实现功能（isLowSignalPerson 两档阈值 + parliamentary-record 派生），无需新工单。
- **P2-2**：待三份厂商报告原文的行业表，另开 PR。

## 0.24.0 — 2026-08-14

### 新增：年度全景盘点长文（State of Singapore AI 2026）

- 第一份年度合成层内容：把执行追踪六个维度（投资 / 人才 / 算力 / 采用 / 研究 / 治理）合成一页，五语同步发布（zh / en / ja / ko / zh-tw）。
- 全文不新增任何数字，每个数字带自己的数据截至日期与来源；文末附数据与方法声明。
- 导航「数据」组新增「年度报告 2026」入口；首页最近更新自动露出（MANUAL_UPDATES longform 条目）。
- 写作纪律：按 writing.md 去 AI 味——无对比抬杠句式（不是…而是）、无结构报幕、无读者指令，金句密度约每千字一句。

### 新增：引用此条（CiteBlock）

- 新组件 [`src/components/common/CiteBlock.astro`](src/components/common/CiteBlock.astro)：五类详情页（辩论 / 政策 / 视频 / 生态实体 / 追踪维度）渲染建议引文 + 检索日期 + canonical URL + 复制按钮。
- 引文品牌串走 `t(lang, 'siteName')` 本地化，避免在 ja/ko/zh/zh-tw 页面注入英文句（dist 层 EN-sentence ratchet 验证通过）。
- 修复 OECD 生态实体的 ja/ko 名称 EN 占位（`OECD AI 政策観測所` / `OECD AI 정책 관측소`）。

### 新增：渲染层 as-of 时间戳（tracker）

- `MetricRow.asOfDate` / `QuantifiedDimension.headlineAsOf` / 定性维 `asOfDate` 三个可选字段，六个维度全部带「数据截至」日期（依据各自头条数字的最新可溯源证据，注释写明出处）。
- 仪表盘卡片与详情页头条卡、指标表均渲染截至 chip；AI 职位指数行自动带快照日。
- [`scripts/evals/stale-stats/check.ts`](scripts/evals/stale-stats/check.ts) 新增 as-of 告警通道：超过 365 天的 `headlineAsOf`/`asOfDate` 在周巡检中输出 WARN（不 fail，防止诚实的老数字被硬门误杀）；新增 3 个单元测试。
- tracker 文件 `dataDate` 随本次编辑刷新为 2026-08-14。

### 文档

- 新增 [`docs/20260814-stakeholder-iteration-plan.md`](docs/20260814-stakeholder-iteration-plan.md)：以新加坡总理 / EDB / AI 管理者三方视角收敛的迭代规划（P0–P2 路线图 + 执行状态盘点 + 维护协议）。
- 20260707 项目审计顶部加后继规划指针，遗留行动项移交表闭环。

## 0.23.5 — 2026-08-13

### 新增：近期 AI 生态与资本动态

- 新增 Theseus Infrastructure 生态实体：记录 Anthropic、Macquarie Asset Management 与 GIC 设立 AI 数据中心投资平台，以及 GIC 通过主权资本持有海外 AI 算力资产的战略意义。
- 新增 Razer 产业伙伴实体：补录新加坡 AI Centre of Excellence、Razer–NUS AI Research Lab 与 Gaming Artificial Narrow Intelligence（GANI）研究方向。

### 更新：NUS、OpenAI 与 GIC

- 更新 NUS 与 OpenAI 生态实体：加入 2026-08-11 全校 ChatGPT Edu 合作、THE1008 本科新生必修课、AI Sense Maker，以及 NUS × Razer 联合实验室里程碑和来源。
- 将人才杠杆中的高校 AI 课改改为可验证的 NUS 全校覆盖与新生必修范围。
- 更新 GIC 投资者记录，加入 Theseus Infrastructure 的职责分工；中英日韩四语同步。
- 修正国会辩论数据文件头的过期统计：总数由 179 条更新为 187 条，数据更新时间更新为 2026-07-20；移除列表组件中会继续漂移的硬编码数量注释。
- 图谱验证新增生态实体 ID 唯一性检查，避免重复 ID 静默生成冲突的详情页路由。
- 将 Theseus 的实体类型修正为平台；依据 NUS 来源，将 Razer 新加坡 AI Centre of Excellence 的规模改为现有 100+ 人，而非未来计划。

## 0.18.1 — 2026-05-26

### 加固：繁体中文渲染的系统性防御

事后梳理：0.18.0 一次性踩到 5 类相关 bug。原因是没有自动机制阻止"zh-tw 渲染绕过 `toTraditional()`"和"OpenCC 误转部委名"。补三层防御：

- **源码层（即时）**：新增 [`scripts/check-zh-tw-renderers.mjs`](scripts/check-zh-tw-renderers.mjs)，静态扫 `src/data/` 和 `src/utils/` 找出有 `if (lang === 'zh-tw')` 分支但没 `toTraditional` / `pickLocalized` 的文件。挂进 `npm run check`，PR 时 0.5 秒返回。直接命中 0.18.0 修复的 video-transcripts bug 类。
- **构建层（覆盖所有 locale）**：`check:i18n` 改为带 `--all` flag，从只扫 EN 改为扫所有 5 个 locale（en/zh/zh-tw/ja/ko），任何 locale 出现异种文字残留就 FAIL。CI 的 `npm run check:dist` 自动跑。0.18.0 之前 zh-tw / ja / ko 残留只有手动 `--lang zh-tw` 才能 catch，video-transcripts bug 因此潜伏。
- **文档层（认知）**：CLAUDE.md 新增规则 #10「繁体中文渲染纪律」，标记最高优先级。详细说明：(a) zh-tw 渲染分支强制走 `toTraditional` / `pickLocalized`；(b) sg 部委 / 机构名走 [`src/i18n/protected-terms.ts`](src/i18n/protected-terms.ts) PROTECTED_TERMS；(c) 加新部委名的流程；(d) eval pattern 必须 unambiguous 的原则；(e) 历史事故回顾。

---

## 0.18.0 — 2026-05-26

### 新发布：National AI Missions 长文（五语同步）

- 新增 [`/national-ai-missions-2026/`](src/data/post/national-ai-missions-2026.md) 长文（新闻报道体），覆盖 5/20 ATxSummit 公布的 NAIS Update 与四项 Missions（先进制造、互联互通、金融、医疗），加上同日 NVIDIA Singapore AI Research Lab 和 PDD 多运营商机器人 testbed 联动事项。
- 中、英、日、韩、繁体中文五语同时发布。
- 在 [`src/data/updates.ts`](src/data/updates.ts) `MANUAL_UPDATES` 添加 longform entry，首页 RecentUpdates 自动露出。

### 修复：繁体中文视频转录页面简体残留

- `getVideoTranscriptParagraphs` 对 `zh-tw` locale 直接返回 zh `paragraphs` 数组，跳过了 `toTraditional()` 转换——59 个 `/zh-tw/videos/<id>/` 页面渲染出 5766 处简体字残留（v005/v006/v036/v061/v062 等）。
- 修 [src/data/video-transcripts.ts:10895](src/data/video-transcripts.ts:10895)：`zh-tw` 分支改为 `paragraphs.map((p) => toTraditional(p))`，与同文件 `convertDigestToTraditional` 一致。
- 顺手修 `getVideoTranscriptLanguage`：`zh-tw` 应该返回 `zh-Hant`（之前和 zh 共享 `zh-CN`）。
- 修复后 `node scripts/i18n-check.mjs --lang zh-tw` 从 5766 hits 降到 0。

### 修复：繁体中文部委名 OpenCC 误转

- OpenCC s2twp 把新加坡部委的官方中文名（MDDI、IMDA、MCCY 等）的关键词组误转为 Taiwan 惯用词组，破坏机构名，全站 2000+ 处呈现错误。
- 新建 [`src/i18n/protected-terms.ts`](src/i18n/protected-terms.ts)，列出 ~10 个需要保护的官方机构名。
- 修改 [`src/i18n/opencc.ts`](src/i18n/opencc.ts) 加入 pre/post placeholder 流程：转换前把保护词替换为 `\x00PROT<i>\x00` 占位符 → 跑 OpenCC s2twp + POST_DICT → 把占位符替换回正确的繁体形式。
- POST_DICT 新增 `家制造` → `家製造` 修补 mmseg 分词漏洞（"30 家制造企业" 中 "制" 不转换）。
- 单元测试：[`scripts/lib/__tests__/opencc-protected-terms.test.ts`](scripts/lib/__tests__/opencc-protected-terms.test.ts) 13 个测试覆盖整个流程。
- Eval 防御：[`scripts/evals/zh-tw-misconversion/check.ts`](scripts/evals/zh-tw-misconversion/check.ts) 扫 `dist/zh-tw/**/*.html` 找已知误转词，挂到 `npm run check:dist` + `npm run eval` weekly cron。

### 新增工具

- [`scripts/refresh/post-translations/translate-post.ts`](scripts/refresh/post-translations/translate-post.ts)：博客 markdown 一键翻译到 en/ja/ko，复用 `scripts/lib/translate.ts` 的 batch + cache，加强了 markdown 保留 prompt。

---

## 0.17.10 — 2026-05-25

### 博客分类显示修复

- 修复文章详情页和列表页把分类链接三元表达式源码渲染到页面的问题，分类现在只显示为正常的“观察”等分类名。

---

## 0.17.9 — 2026-05-25

### 博客繁中路由补齐

- 为《从 AI 看新加坡的转向能力》新增繁中 Markdown 镜像，并让博客内容层识别 `zh-tw` 文章语言，补齐 `/zh-tw/singapore-ai-strategy-the-real-moat/` 静态页。

---

## 0.17.8 — 2026-05-25

### 《从 AI 看新加坡的转向能力》整篇版本更新

- 用 Luca 2026-05-25 最新修订稿完整替换旧版《新加坡的AI马六甲海峡在哪里？》，保留原 slug，去掉公开文章中不应出现的课程、作者与提交信息。
- 按新版结构重新同步英文、日文翻译，并新增韩文博客实体文件；繁中继续由简中源文 OpenCC 派生。
- 博客内容层新增 `ko` 文章识别与类型支持，使韩文长文可以生成真实 `/ko/` 路由。

---

## 0.17.7 — 2026-05-25

### AI 马六甲海峡观点补强

- 补强《新加坡的AI马六甲海峡在哪里？》中英日三语版本，在“快速转向”段落加入 6 类政策工具 / 115 个落地项目的小表，说明 Budget 2026 + NAIS Update 如何被组织成国家级 AI 执行管线。

---

## 0.17.6 — 2026-05-24

### National AI Missions 入口文章

- 新增中文观察文章《新加坡 2026 版 National AI Missions 到底是什么？》，把 Budget 2026、NAIS Update 2026、MTI 先进制造说明与 AI in Health x ATxSummit 材料整理成一个可分享入口。
- 文章明确区分官方已公开事实与尚未公开的 KPI / 预算 / 牵头机构 / problem statements，避免把“国家 AI 任务 2030”当作独立战略。

---

## 0.17.5 — 2026-05-24

### 翻译缺口强否决

- `check:i18n-completeness` 从单独检查 `ecosystem.ts` 扩展为扫描 `src/data/*.ts`，并对 `scripts/i18n-config.ts` 中配置的 policies / ecosystem / levers / voices 用户可见字段强制要求所有 authored locale sibling；locale 列表从 `src/i18n/index.ts` 自动读取，未来新增语言会默认进入强否决。
- 政策档案页的 `sourceUrl` 资源标签从泛泛的“来源 / Source”改为“官方原文 / Official source text”，避免读者误以为没有原文入口。
- NAIS Update 2026 档案新增官方演讲原文与中 / 日 / 韩译文区块，并把 `policy-source-texts.ts` 纳入 i18n 完整性检查。
- NAIS Update 2026 官方原文与译文从逐句换行整理为按讲话逻辑分段，页面改用真实段落渲染，提升长文阅读体验。
- `entity-pages.ts` 与 `speech-transcripts.ts` 改用相对路径导入被 dist 检查直接执行的数据依赖，修复 GitHub Actions Node 18 下 `check:localized-rendering` 无法解析 `~` 别名导致部署阻断的问题。
- `zh` 作为源语言纳入完整性语义，`zh-tw` 作为 OpenCC 派生语言纳入 `check:i18n:all` 的构建产物检查；`check:i18n:all` 不再手写语言列表，会扫描 `LOCALES` 中每个语言。
- `i18n-pair` alignment 检查扩展到更多实际渲染字段，并支持 `string[]`；`highlights`、`bullets`、`tags`、`points` 等数组文案缺任一语言 sibling 也会 hard-fail。
- `i18n-pair` 新增 English purity gate：`*En` 加工字段不得含中文汉字、日文假名或韩文 Hangul；EN 构建产物检查也同步从"查中文"扩展为"查任何非英文脚本"。
- `npm run check` 现在同步执行 `eval:source-i18n`，新增 `isZh ? ... : ...`、`lang === 'zh' ? ... : ...` 这类二元模板分支会在本地 check 阶段失败。
- 补齐当前严格 schema 下的缺口：语言中立的专名、缩写、金额显式写入对应 sibling；少量政策标题、来源、演讲事件补上日 / 韩字段。
- 补齐数组字段的历史缺口，并让 talent、benchmarking、fieldnotes、timeline、opensource 等页面按 `pickLocalized` 渲染数组字段，避免日 / 韩页继续回退英文。
- 新增版本化 git hooks：`scripts/git-hooks/pre-commit` 与 `scripts/git-hooks/pre-push` 都执行 `npm run check:i18n-completeness`；缺翻译时本地 commit / push 会直接失败。

---

## 0.17.4 — 2026-05-24

### 多语言渲染回归防线

- 修复 speeches 详情页在 `/ja/`、`/ko/` 下把英文 transcript 当作本地化正文渲染的问题；日 / 韩暂无译文时显示明确的待翻译状态，只保留官方来源链接。
- 修复 policies、ecosystem、levers、timeline 等高曝光页面的二元 `zh/en` 渲染分支，改为 `pickLocalized(record, field, lang)` 与五语 label 字典。
- 新增 `scripts/evals/localized-rendering/check.ts`，从构建产物层检查 ja / ko 关键页面是否实际渲染了已有的 `*Ja` / `*Ko` 字段，并 hard-fail speech 页面英文正文泄漏。
- 升级 `check:dist`：现在会扫描 en / zh-tw / ja / ko 的构建产物，并执行 JSON-LD schema 与 localized-rendering gate；GitHub Actions build matrix 在 `npm run build` 后同步运行 `npm run check:dist`。

---

## 0.17.3 — 2026-05-24

### ATxSummit 2026 新加坡 AI 政策更新

- 更新 2026-05-20 ATxSummit 官方口径：NAIS 是“double-click”更新，不是新“国家 AI 任务 2030”；4 个国家 AI 任务为 Connectivity、Advanced Manufacturing、Healthcare、Finance。
- 新增 / 更新中英日韩数据：OpenAI for Singapore、Google AI Agents Sandbox、AI TAP、Agentic AI Governance Framework 2026-05 更新、PDD 多运营商机器人 testbed、NVIDIA Singapore AI Research Lab。
- 修正 Singapore Consensus：从“11 国签署”改为 2025 SCAI: ISE 产出的 living document，100+ 参与者来自 11 个国家，并在 ISE 2026 继续更新。
- 同步 policies、levers、tracker、timeline、ecosystem 与三语文章中的相关表述，并将非官方来源替换为 MDDI / IMDA / OpenAI / AI Verify / SCAI 官方链接。

---

## 0.13.0 — 2026-05-08

### Phase 3: trilingual — Singapore AI Observatory now in 日本語

日语作为第三语言全站上线。5 个阶段串行完成：i18n core 泛化 → ja 字典 → 数据回填 → 页面镜像 → 管线集成。

#### i18n core 泛化（Phase 0）

- [src/i18n/index.ts](./src/i18n/index.ts)：`Lang` 加 `'ja'`，`LOCALES` 加 `'ja'`，`FALLBACK_CHAINS` 加 `ja: ['ja', 'en', 'zh']`，`t()` 从 `if/else` 改成 `Record<Lang, Dict>` map 查表，`channelLabel()` 泛化为 N-locale。
- 30+ 个 `.astro` / `.ts` 共享组件清理 `lang === 'en'` 三元为 `t(lang, key)` 字典调用。
- [astro.config.ts](./astro.config.ts)：sitemap i18n dict 加 `ja: 'ja'`。
- [CommonMeta.astro](./src/components/common/CommonMeta.astro)：hreflang 改 `LOCALES.map` 循环。

#### ja 字典 + SEO（Phase 1）

- ~190 个 UI key 的日语翻译（导航、首页、tracker、voices、updates 等）。
- [Metadata.astro](./src/components/common/Metadata.astro)：`og:locale` 加 `ja_JP`。
- [src/pages/ja/rss.xml.ts](./src/pages/ja/rss.xml.ts)：日语 RSS feed。

#### 数据回填（Phase 2）

- 12 个 `src/data/*.ts` 文件共 ~5,756 条 `*Ja` 字段回填（`translateBatch` zh→ja，Claude haiku，sha256 缓存）。
- 161 个 `*Ja` 可选类型字段添加到 TypeScript interfaces。
- 8 篇日语博客 `src/data/post/ja/*.md`。

#### /ja/ 页面（Phase 3）

- 42 个 `src/pages/ja/` 文件镜像自 `src/pages/zh/`。
- 构建输出 ~1,048 个 ja HTML 页面（总页面 3,118）。
- i18n-check 0 中文残留，check-schema 0 JSON-LD 问题。

#### 页面路由统一（Phase 3b）

- 84 个重复页面文件（42 zh + 42 ja）合并为 42 个 `[lang]` 动态路由。
- 新增 locale 不再需要改任何页面文件。

#### 管线集成（Phase 4）

- [run-template.ts](./scripts/refresh/_shared/run-template.ts)：enrichment 后自动 `translateBatch` zh→ja，覆盖 talent / startups / benchmarking / tracker 四条管线。
- [auto-discovered-emit.ts](./scripts/lib/auto-discovered-emit.ts)：`AutoDiscoveredEntry` 加 `titleJa` / `descriptionJa`。
- [ai-summarize.ts](./scripts/lib/ai-summarize.ts)：`BilingualSummary` 加 `titleJa` / `descriptionJa`。
- policies / ecosystem / levers / legal-ai / videos 五条自定义管线各自添加 ja 翻译步骤 + `*Ja` emit。
- 总计 11 条 refresh 管线全部自动产出 ja 翻译。

#### 验证

- `npm run check`：65 lib tests pass，0 lint / type / prettier errors。
- `npm run build`：3,118 pages。
- `npm run check:dist`：i18n 0 残留 + schema 0 issues。

---

## 0.12.0 — 2026-05-07

### GSC 索引修复 + 双语锁升级 + duplicate-canonical 防御

PR [#26](https://github.com/meltflake/sgai/pull/26) 合并到 main。触发问题：GSC 报告 sgai.md 索引率仅 33% (679/2063)，其中 1408 "Discovered – not indexed" + 192 "Crawled – not indexed" + 174 "Duplicate, Google chose different canonical"。

---

## 0.11.0 — 2026-05-05

### Phase 2：i18n root 翻转 — EN 进根，ZH 进 `/zh/`

迁移规划见 [docs/20260505-global-i18n-routing-plan.md](./docs/20260505-global-i18n-routing-plan.md)。提交 [12d4618](https://github.com/meltflake/sgai/commit/12d4618)（114 files / +2975 / −2877）。

#### 路由架构

- [src/i18n/index.ts](./src/i18n/index.ts) 拆双常量：`ROUTE_DEFAULT_LOCALE = 'en'`（决定哪条 locale 不带前缀）+ `DEFAULT_LOCALE = 'zh'`（决定哪条 locale 在裸字段里）。前者驱动 `getLangFromPath` / `localizedHref` / `unprefixed` / `localePrefix`，后者驱动 `siblingSuffix` / `pickLocalized`。
- 解耦后无需把所有中文裸字段改名为 `*Zh`——历史数据 convention 不动，只翻路由。

#### 数据契约统一

之前 debates / people / voices 的字段是反向 convention（裸字段=英文，`zh*`=中文）。Phase 2 全部改成跟 policies 一致（裸字段=中文，`*En`=英文）：

- [src/data/debates.ts](./src/data/debates.ts) Debate + MP_PROFILES：`title`(en)→`titleEn`、`zhTitle`(zh)→`title`、`summary`(en raw Hansard)→`transcriptEn`（语义重命名）、`zhSummary`→`summary`、`summaryShortEn`→`summaryEn`。
- [src/data/people.ts](./src/data/people.ts)：`name`/`zhName`/`title`/`zhTitle` → `nameEn`/`name`/`titleEn`/`title`。
- [src/data/voices.ts](./src/data/voices.ts) Institution：`name`(MDDI 等缩写)→`abbreviation`、`zhName`→`name`；MddiSpeech：`title`/`zhTitle`/`event`/`zhEvent` → `titleEn`/`title`/`eventEn`/`event`。
- [src/data/mp-stubs.json](./src/data/mp-stubs.json)：213 条同模式重命名。
- 17 个 consumer 文件自动 + 手工修复（DebatesIndex、各 EN 页 person/debate 字段读取等）。

Codemod 留仓 [scripts/i18n-migrate-data.mjs](./scripts/i18n-migrate-data.mjs) + [scripts/i18n-migrate-consumers.mjs](./scripts/i18n-migrate-consumers.mjs)，scope-aware（slice 到具体 export）+ value-guard（避开 backtick string 误匹配）。

#### Pages 重排

- `src/pages/en/**` → `src/pages/`（EN 占根）。
- 21 个 entity 目录（about / benchmarking / debates / ecosystem / levers / policies / voices 等）→ `src/pages/zh/`。
- 根 `[...blog]/index.astro` 保留（按 permalink 分发 EN 与 ZH）；ZH blog 列表 / category / tag → `src/pages/zh/blog/`。
- Blog permalink 翻转（[utils/blog.ts](./src/utils/blog.ts)）：EN 裸 slug，ZH 加 `zh/` 前缀。
- 404 拆双页：EN [src/pages/404.astro](./src/pages/404.astro)、ZH [src/pages/zh/404.astro](./src/pages/zh/404.astro)。

#### 组件改写

- [CommonMeta.astro](./src/components/common/CommonMeta.astro)：删 hardcoded `mirroredRoots` Set；always emit `en` + `zh-CN` + `x-default` 三个 hreflang（迁移后所有内容页均双语镜像）。
- [LanguageToggle.astro](./src/components/common/LanguageToggle.astro)：路径切换逻辑反向，`/policies/` ↔ `/zh/policies/`。
- [LangBanner.astro](./src/components/common/LangBanner.astro)：**取消首屏 auto-redirect**——浏览器语言只做轻提示，URL 是 source of truth，深链 / 搜索引擎拿到什么 URL 就停在什么 URL。
- [Layout.astro](./src/layouts/Layout.astro)：默认 lang fallback 由 `'zh'` 改 `'en'`；inline rewrite script 只 honor stored `sgai_lang`，不再读 navigator.language。

#### Hardcoded URL 清理

- [scripts/i18n-cleanup-en-prefix.mjs](./scripts/i18n-cleanup-en-prefix.mjs)：50 个文件清理。内部 `/en/foo/` → `/foo/`、`https://sgai.md/en/` → `https://sgai.md/`；外部 host（edb.gov.sg/en/、oecd.ai/en/、EU `/en/`）通过 hostname-aware regex 守卫保留。

#### 输出层

- [astro.config.ts](./astro.config.ts) 给 `@astrojs/sitemap` 加 `i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } }`，sitemap 生成 4084 条 `xhtml:link` alternates / 2063 URLs。
- [llms.txt](./src/pages/llms.txt.ts) + [llms-full.txt](./src/pages/llms-full.txt.ts) 重写：每节 EN canonical 在前，ZH mirror 在后。
- Updates RSS 双语：`/updates.rss.xml`（EN）+ `/zh/updates.rss.xml`（ZH），type chip 本地化（[Site] / [站点] 等）。
- [\_redirects](./public/_redirects) 链：`/en/people/:id → /voices/:id`（特例先行）→ `/en/* → /:splat`（catch-all）→ `/people/:id → /voices/:id`。
- [scripts/i18n-check.mjs](./scripts/i18n-check.mjs) 适配新布局：EN 默认扫 `dist/`（排除 `/zh/` 子目录），ZH 扫 `dist/zh/`。

#### 验证

完整测试见 commit message。摘要：

- `npm run check`：65 lib tests pass，0 lint / type / prettier errors。
- `npm run build`：2065 pages，99s。
- `node scripts/i18n-check.mjs`：1023 个 EN 页面 0 中文残留。
- HTTP audit：26/26 dev routes 200。
- 10 个双语 sample pages：html lang + h1 + status 全对。
- 6 个 sample 页面 canonical + hreflang 全对。
- LanguageToggle EN ↔ ZH 双向切换 + localStorage 持久化通过。
- 4 个 RSS feed 双语本地化通过。

---

## 0.10.0 — 2026-05-05

### Phase 1：Updates feed + 首页任务卡 + IA 减负

提交 [557dd7c](https://github.com/meltflake/sgai/commit/557dd7c)（32 files / +1826 / −407）。

#### Updates feed（解决"首页缺动态感"）

- [src/data/updates.ts](./src/data/updates.ts) 12 类型双语 schema + 10 条种子 + `sortedUpdates` / `recentUpdates` / `updatesByMonth` helper。
- [scripts/lib/append-update.ts](./scripts/lib/append-update.ts) pipeline emit 后调用一行追加更新；带 i18n-pair 回归保护和自动 rollback。
- [RecentUpdates.astro](./src/components/home/RecentUpdates.astro) 首页模块（限 6 条，挪到"最近国会辩论"之后），只为出现的类型上色。
- `/updates/` + `/zh/updates/` 完整列表（按月分组）+ `/updates.rss.xml` + `/zh/updates.rss.xml`。
- 接入 9 个 refresh pipeline（startups / talent / tracker / benchmarking 走 run-template；policies / ecosystem / levers / legal-ai / videos 单独接入），每次 emit 自动追加一条更新，与数据同 PR。

#### 首页任务卡 + IA 减负

- [TaskEntries.astro](./src/components/home/TaskEntries.astro)：4 张任务卡（理解战略 / 找政策 / 看企业 / 跟踪变化），插入 Hero 之下。
- 16 个新 i18n 字典 key。
- Header Data 组从 9 项缩到 5（Updates / Tracker / Startups / Talent / Benchmarking）；Footer 保留全部 9 项作为档案入口。

#### 清理

- 删除 `src/pages/people/[id].astro`（zh + en）—— 31 条人物页都 canonical 到 `/voices/{id}/`，加 4 条 Cloudflare 301。
- AuthorBio 链接从 `/people/` 改 `/voices/`。
- 修订两份规划文档错误前提：244 → 31 真实人物、删除职位 stub 前提、量化 129 处 `/en/` 残留。

---

## 0.9.7 — 2026-05-05

### Codex 改造 follow-up：路由解耦、SEO 收敛、drilldown 补深

事后审阅 + 改进规划见 [docs/20260505-codex-improvements-followup.md](./docs/20260505-codex-improvements-followup.md)，drilldown 内容补深 playbook 见 [docs/20260505-drilldown-enrichment-playbook.md](./docs/20260505-drilldown-enrichment-playbook.md)。

#### 路由解耦（P1）

- `src/pages/benchmarking/[region].astro` 从 640 行降到 19 行 dispatcher，按 `page.kind` 分发到三个新组件：[`RegionProfile.astro`](./src/components/benchmarking/RegionProfile.astro)、[`CaseProfile.astro`](./src/components/benchmarking/CaseProfile.astro)、[`DrilldownProfile.astro`](./src/components/benchmarking/DrilldownProfile.astro)。
- 三个 profile 组件都接 `{page, lang}` props，内部按 `lang` 切换文案，zh + en 不再有重复模板。
- URL 与改造前 100% 一致（`find dist/benchmarking -type d` diff 为空）。

#### SEO 临时降级与索引收敛（P3a + P4）

- `RegionDetail.drilldownEnrichments?: Record<localId, BenchmarkDrilldownAnalysis>` 字段新增；`BenchmarkDrilldownAnalysis = { analysis, analysisEn?, sources? }`；`BenchmarkAnalysisSource` 含 `label / labelEn? / url / date?`。
- `BenchmarkDrilldownPage` 新增 `analysisPending`、`analysisSources?`；`entity-pages.ts addPage()` 命中 enrichment 时用 `analysis` 覆盖 `body`，否则保留模板。
- `DrilldownProfile` 在 `analysisPending=true` 时输出 `<meta name="robots" content="noindex,follow">`，未补深的 stub 自动从搜索索引收敛。
- `llms.txt` / `llms-full.txt` 只列 `analysisPending !== true` 的 drilldown，避免 LLM 把 sgai 误判为 doorway 站。
- 新增 [`scripts/check-benchmarking-urls.ts`](./scripts/check-benchmarking-urls.ts)：复用 `scripts/lib/url-check.ts`，HEAD-check 所有 `analysisSources[].url`，沿用 CLAUDE.md sourceUrl 真实性约束。

#### Drilldown 内容补深首批（P3b：10 个 region 全覆盖）

- Singapore（新增 RegionDetail）、Hong Kong、Taiwan、UAE、Israel、South Korea、Estonia、Switzerland、Finland、Canada 共 10 个 region 的 drilldown 全部完成首批 enrichment。
- 单条 enrichment 标准：200-400 字 zh + 同等深度 en + 1 个数字 + 1 个原文链接 + 1 个判断；全部 277 个 `analysisSources[].url` HTTP HEAD 可达。
- 索引收敛：noindex 页 137 → 17（-87%），indexable 页 45 → 182（+304%），llms-full.txt benchmarking 链接 91 → 365（+301%）。

#### Debates 文档重写（P5）

- [docs/20260504-debates-ia-redesign.md](./docs/20260504-debates-ia-redesign.md) 改为"已完成 / 设计选择 / 后续演进 trigger"三段式，把 6 个 section 平铺、vanilla DOM 过滤、单组件内聚等设计选择 explicit 化，给未来贡献者清晰的取舍线。

#### Codex worklog 归档（P6）

- 仓库根的 `task_plan.md` / `progress.md` / `findings.md` 归档到 [`docs/codex-worklogs/`](./docs/codex-worklogs/)，每份头部加溯源注释指向本 followup 文档。

## 0.9.6 — 2026-05-04

### 内容栏目：观点改为观察

- `/blog/` 中文栏目名从“观点”改为“观察”，同步更新导航、首页入口、面包屑、返回按钮，以及现有中文文章的分类 / 标签。

### 政策库：卡片升级为政策 / 项目档案入口

- `/policies/` 与 `/en/policies/` 的每张政策卡片改为整卡点击，统一进入站内档案页，外部来源入口收敛到详情页。
- `/policies/[id]/` 与 `/en/policies/[id]/` 从单段正文升级为档案页结构：事实卡、战略位置、展开信息、资源入口、关联抓手、同类档案和关联阅读。
- `src/data/policies.ts` 预留 `keyFacts / sections / milestones / resources / lastVerified` 扩展字段，后续可以继续把每个政策、项目或机构页补成更完整的落地档案。

### 站点定位：主描述改为多语言

- 主站 `siteDescription` 不再写成“中文分析平台”，改为“独立、多语言的研究型观察站”，覆盖战略、执行、国会、产业、人才、开源和国际对标。
- README 开头同步使用新的站点定位，避免对外说明和首页 metadata 不一致。

### 产学研开源生态：卡片升级为项目档案页

- `/community-opensource/` 与 `/en/community-opensource/` 的每张卡片改为整卡点击入口，统一指向站内项目档案页。
- 新增 `/community-opensource/[id]/` 与 `/en/community-opensource/[id]/`，首批生成 15 个可索引项目页，覆盖高校、国际企业实验室和创业公司三类开源贡献。
- `src/data/community-opensource.ts` 扩展为可持续补充的项目档案 schema：每条记录有稳定 `id`、类别、状态、指标、摘要、展开说明、里程碑和资源入口。
- 补充 Show-o / ShowUI 拆分、TSLANet 公开仓库、GitHub stars 与项目信息校验日期；`llms.txt` / `llms-full.txt` 纳入产学研开源项目详情页。

### 国际对标：从国家页下钻到项目 / 公司案例页

- `/benchmarking/` 和 `/en/benchmarking/` 改成卡片优先的对标案例索引；案例卡、洞察卡、地区背景卡全部可点击。
- 新增 12 个具体公司 / 项目 / 机构档案页，复用 `/benchmarking/[slug]/` 与 `/en/benchmarking/[slug]/`：AI Verify、数码港 AI 超算中心、TSMC、Falcon LLM、MGX、MBZUAI、Unit 8200、韩国财阀自研大模型栈、Bürokratt、Elements of AI、ETH AI Center、Mila / Vector / Amii。
- `src/data/benchmarking.ts` 新增可扩展 `BenchmarkCase` schema，支持事实卡、详细段落、来源、对新加坡启发和后续补充。
- `/benchmarking/[region]/` 路由升级为国家 / 地区页 + 案例页共用入口，保留原有地区对标页。
- `llms.txt` / `llms-full.txt` 纳入 benchmark case 页面，方便搜索引擎和 LLM crawler 抓取具体案例。
- 地区详情页继续下钻：`/benchmarking/hong-kong/` 这类页面的顶部概览卡、战略卡、投资项、关键举措、关键机构全部变成可点击入口，自动生成中英文子档案页；新增页面同步进入 `llms-full.txt`。

## 0.9.5 — 2026-05-04

### 人才培养：卡片入口升级为项目档案页

- `/talent/` 与 `/en/talent/` 的每张人才卡片改为完整可点击入口，指向独立详情页。
- 新增 `/talent/[id]/` 与 `/en/talent/[id]/`，8 个项目全部生成可索引档案页：AIAP、LADP、PhD Fellowship、AMP、LearnAI、NAISC、IOAI 2027、AI 进校园。
- `src/data/talent.ts` 升级为可扩展项目档案 schema，补承办方、对象、状态、关键事实、展开说明、官方来源和校验日期。
- 同步校正几处过期信息：AIAP 更新为 Batch 24/25 招募窗口；LADP 改为当前官方的 LLM Application Developer Programme；PhD Fellowship 与 AMP 使用新的 research 路径。

### 官方开源页：项目卡片升级为可扩展档案页

- `/opensource/` 和 `/en/opensource/` 的官方项目卡片改为整卡点击，统一指向站内项目档案，不再只跳外部 GitHub / Hugging Face。
- 新增 `/opensource/[id]/` 与 `/en/opensource/[id]/` 动态详情页，首批覆盖 AI Verify、SEA-LION、SEA-Guard、TagUI、PeekingDuck、SGNLP、Speech Lab、Synergos。
- `src/data/opensource.ts` 扩展为可持续补充的数据模型：每个项目有稳定 `id`、归属方、类别、状态、指标、摘要、详细说明、AI 关系、新加坡关系、里程碑和资源入口。
- 数据说明拆分为统计采集日与项目档案更新日，避免 GitHub / Hugging Face 数字和编辑内容混在同一个"最后更新"里。

## 0.9.4 — 2026-05-04

### 创业生态：公司 / 项目实体详情页

- `/startups/` 从表格和外链列表升级为实体卡片索引；独角兽、垂直领域公司、退出样本、投资机构全部点击进入站内档案。
- 新增 `/startups/[id]/` 与 `/en/startups/[id]/`，为 42 个创业生态实体生成可索引详情页，包含定位、资本与市场信号、生态意义、后续追踪问题、相关实体与 JSON-LD。
- 收紧 AI 口径：新增 `核心 AI / AI-enabled / 生态相邻 / 弱关联待核` 四级标注；Carro、Grab 等改为 AI-enabled，Nium、Sygnum 等不再包装成“支付 AI / AI 银行”。
- 数据说明拆分为“基础统计口径日期”和“实体档案整理日期”，避免把 650+ 聚合统计的旧口径误读成每个公司档案的更新日期。
- 投资机构实体补齐官网字段，详情页现在会展示 SGInnovate、Temasek、GIC、Antler、Vertex Ventures、Monk's Hill Ventures 的官方链接。
- `startups.ts` 增加稳定 `id` 与可扩展 profile 字段；`utils/entity-pages.ts` 新增 startup entity flatten/merge，支持同一家公司同时承载垂直领域、独角兽等多重信息。
- `llms.txt` / `llms-full.txt` 纳入创业生态详情页，方便搜索引擎和 LLM crawler 引用具体公司、项目、退出与投资机构。

## 0.9.1 — 2026-05-03

### 生态地图：关键人物全部接入人物图

- 把 `ecosystem.ts` 里的 `leaders[]` 从死字符串变成可点击的图节点：11 个机构合计 36 条领导记录，全部通过 `personId` 链到 `/voices/{id}/`。
- 新增 21 条 Person 记录，覆盖核心枢纽（AISG）、基础研究（A\*STAR / NUS / NTU / SMU / SUTD）、治理（IMDA / PDPC / AI Verify Foundation / MAS）、应用（Synapxe）。每条尽量补齐 LinkedIn 或机构官方档案链接。
- 顺手修正两条过期信息：A\*STAR CEO 现任 **Beh Kian Teik**（2024-11 接替 Frederick Chew）、Synapxe CEO 现任 **Foo Hee Jug**（2025 替换 Ngiam Siew Ying）。两处都从机构官网二次核验。
- 跨机构枢纽显形：Mohan Kankanhalli / Bryan Low / Simon Chesterman / Ng See Kiong 同时挂 NUS + AISG；Ho Teck Hua / Luke Ong 同时挂 NTU + AISG；Ong Yew Soon 同时挂 NTU + A\*STAR。这种"双肩挑"是新加坡 AI 治理结构的核心特征，现在能在数据层显式表达。

## 0.9.0 — 2026-05-03

### Tracker 仪表盘：从指标列表升级为六维仪表盘

把 `/tracker/` 从早期的纯指标列表整体重写为六维仪表盘 + 动态详情页 + 方法论页的多页结构。

- **六维框架**：投资 / 算力 / 人才 / 应用 / 研究 / 治理；每维度独立 `*.ts` 数据文件，量化维度配 metrics + ranking anchors，定性维度走 7 项观察清单。
- **页面**：仪表盘首页（hero + 6 张维度卡 + Top Rankings）、维度详情页（动态路由 `/tracker/[dimension]/`）、方法论页（zh + en 完整双语）；同步落 `/en/tracker/` 全套页面与字典 keys。
- **组件**：新增 `DimensionCard` 组件，量化与定性两种渲染变体；卡片尾部显式标 Headline / Benchmark / Badge / Trend 四个标签，支持本地化。
- **数据**：投资（24 条）、算力（14 条，3 条与投资交叉）、人才（12 条）、应用（18 条，企业 / 政府分组）、研究（7 条）、治理（7 项定性）。
- **首页联动**：在中英文首页加入 tracker 摘要区块；移除旧的 grading 系统、清理空 related 数组。

### 2026-05-03 当日的其他变动

- **政策**：新增 4 条 W&C-tracker AI 监管类条目（`feat(policies)`）；ISO/IEC 42119-8 全会议 + Changi 42001 事件入 timeline / levers / references（`feat(timeline+levers+refs)`）；中英 policies 页面重构为 N-locale 可扩展形态（`i18n(policies)`）。
- **演讲**：归档并翻译 58 篇 MDDI AI 演讲（`feat(speeches)`）。
- **首页**：编辑式版式收口 — 收尾论点段、传导杠杆线、tracker 区块（`feat(home): polish editorial layout`）。
- **i18n**：tracker 卡片标签（Headline / Benchmark / Badge / Trend）全部本地化。

## 0.7.0 — 2026-05-02

### 生态地图：38 个实体维基风格详情页

- `/ecosystem/[id]/` 新增 38 个实体的独立详情页（机构 / 平台 / 产品 / 项目 / 合作伙伴），覆盖 AISG、A\*STAR、四所大学、IMDA、PDPC、MAS、Synapxe、AI Verify、SEA-LION 系列、AIAP / 100E / TagUI / PeekingDuck 等开源工具，以及 6 家境外合作伙伴。
- 数据 schema 新增 `EcosystemLeader.personId` 字段，预留与 `people.ts` 的图链接（v0.9.1 全部接入）。
- 同步上线 `/ecosystem/` 列表索引页与英文站 `/en/ecosystem/`。

## 0.6.8 — 2026-05-02

### 国会辩论：完整原文与中文译文

- 辩论详情页不再折叠 Hansard 原文；英文原文直接展开，方便读者、搜索引擎和 LLM crawler 读取。
- 中文详情页新增“完整译文（中文）”区域，同时保留“英文原文”；英文详情页只展示英文原文。
- 新增 `src/data/debate-transcripts.ts`，用完整 Hansard transcript 替代此前被截断的 `debate.summary` 片段。
- 新增 `npm run fetch:debate-transcripts`、`npm run translate:debate-transcripts`、`npm run check:debate-transcripts`，并把检查并入 `npm run check`。
- 本轮已为 150 条国会辩论生成完整英文原文和中文译文。

## 0.6.7 — 2026-05-02

### Logo：暗色模式颜色微调

- 仅调整 logo 中间 `ai` 的颜色为 Solarized `base0`，不改变原 logo 的形状、字形、尺寸和位置。
- 目的：让 logo 在 dark mode 下可读，同时避免与外圈红色混在一起。

## 0.6.6 — 2026-05-02

### 分享卡片：替换模板默认图

- 替换 AstroWind 模板默认 Open Graph 图，避免 X / Twitter 卡片继续显示模板截图。
- 新增 `npm run generate:og-image`，可重生成本站默认分享图。
- 有 Open Graph 图时，Twitter Card 默认使用 `summary_large_image`，让 X 使用大图卡片。

## 0.6.5 — 2026-05-02

### Footer：移除重复的关于本站入口

- Footer 的“深度分析 / Analysis”分组只保留文章入口，不再放“关于本站 / About”。
- “关于本站 / About”保留在 footer 底部工具区，避免信息架构重复。

## 0.6.4 — 2026-05-02

### 移动端：Header 品牌名避让菜单按钮

- 移动端 header 使用短站名，中文为“新加坡 AI”，英文为“SG AI”；`sm` 以上屏幕继续显示完整站名。
- Header 左侧品牌区增加 `min-w-0`，右侧菜单按钮固定不收缩，避免长英文站名遮挡汉堡菜单。

## 0.6.3 — 2026-05-02

### 首页：国会辩论链接修复

- 中文首页“最近国会辩论”每一条改为链接到对应辩论详情页 `/debates/[id]/`。
- 顶部与移动端“全部 150 场”入口继续指向总列表页 `/debates/`。

## 0.6.2 — 2026-05-02

### 首页：最新分析区视觉平衡微调

- 中文与英文首页的“最新分析 / Latest Analyses”从单列文章列表改为桌面双栏：左侧主稿，右侧“继续阅读 / Continue Reading”两篇次稿。
- 移动端保持单列阅读流，不改变首页整体节奏。
- 目的：减少桌面端右侧大面积空白，让文章区左右视觉重量更均衡。

## 0.6.1 — 2026-05-02

### i18n：视频字幕双语化

修复 v0.6.0 的 transcript 漏洞：YouTube 抓到的字幕多数是英文，但中文视频详情页也直接渲染同一份英文 `paragraphs`。

- `src/data/video-transcripts.ts` 改为默认中文 `paragraphs` + 英文 `paragraphsEn`，保留 `captionLanguage`、`translatedAt`、`translationSource`、`translationModel` 方便追溯。
- 新增 `npm run translate:video-transcripts`：读取 `yt-dlp` 抓到的英文字幕，用 OpenAI 翻译成简体中文，缓存到 `scripts/videos/data/translations/`，再重建页面数据。
- 新增 `npm run check:video-transcripts` 并并入 `npm run check`，只要英文 transcript 存在但中文默认 transcript 缺失，CI 会失败。
- 中文 `/videos/[id]/` 只渲染中文 transcript；英文 `/en/videos/[id]/` 只渲染英文 transcript。
- 本轮 51 条可用视频字幕全部补齐中文翻译；3 条 YouTube 本身无可抓字幕，继续按“无字幕”处理。

验证：`npm run check:video-transcripts` 通过，确认 51 条 transcript 均有 zh / en 段落且段落数一致。

## 0.6.0 — 2026-05-02

### SEO / GEO：程序化详情页 + LLM 抓取入口

本轮把“列表页里的卡片内容”拆成可索引、可引用、可互链的独立页面，目标是让搜索引擎和 LLM 都能抓到完整事实页，而不是只看到总览列表。

- **新增程序化详情页**：
  - `/voices/[id]/` + `/en/voices/[id]/`：人物档案，关联国会发言、主导政策、视频观点；旧 `/people/[id]/` 保留并 canonical 到 `/voices/[id]/`。
  - `/videos/[id]/` + `/en/videos/[id]/`：每条视频独立页，含摘要、YouTube embed、`VideoObject` JSON-LD、关联视频、可读字幕。
  - `/benchmarking/[region]/` + `/en/benchmarking/[region]/`：每个国家 / 地区一个对标页，含战略、投资、治理、优势 / 劣势、来源。
  - `/levers/[id]/` + `/en/levers/[id]/`：6 个国家 AI 抓手 + 112 个具体项目独立页。
  - `/legal-ai/[id]/` + `/en/legal-ai/[id]/`：10 个法律框架卡片独立页，含主管机构、状态、正文、来源、同组关联。
- **内链升级**：`RelatedRail`、debates / policies / voices / videos / levers / legal-ai / benchmarking 列表页都改为指向详情页，不再只回到列表页。
- **Transcript Pipeline**：新增 `npm run fetch:video-transcripts`，基于本机 `yt-dlp` 抓 YouTube 字幕，生成 `src/data/video-transcripts.ts`。本轮 54 条视频中 51 条抓到英文字幕。
- **GEO 入口**：新增 `/llms.txt` 和 `/llms-full.txt`，列出高价值页面与全量详情页索引；`robots.txt` 显式允许 GPTBot、ClaudeBot、PerplexityBot、Google-Extended、Bytespider、CCBot，并声明 sitemap。
- **技术 SEO**：`CommonMeta` 生成 zh-CN / en / x-default hreflang（仅对有镜像的核心路径启用），详情页补 Article / Person / VideoObject / GovernmentService / Legislation 等 JSON-LD。
- **复用工具**：新增 `src/utils/entity-pages.ts` 统一生成国家、抓手项目、法律卡片的稳定 slug，后续加数据会自动生成页面。
- **维护文档**：新增 `docs/20260502-programmatic-seo-geo.md`，记录详情页生成、i18n 完整性、transcript 刷新和 GEO 验收规则。

验证：`npm run check` 通过；`npm run build` 生成 1697 页；`npm run check:i18n` 扫描 864 个 EN 页面，中文残留 0。

## 0.5.0 — 2026-05-02

### i18n 多语言化收尾 + 第二轮残留清理

抽查 `/en/voices/` 和 `/en/policies/` 时发现仍有大量中文残留。原因：上一轮 i18n-check 脚本宽容了"短姓名作 zhName 注音"的副显示。撤销这个例外，再扫 → 87 处真实残留全部修复。

- **EN 页面副显示一律隐藏**：人物卡片下的 zhName、政策标题下的 zh title、辩论 zhTitle、MP profile zhName 全部去掉。EN 页面现在是纯英文。
- **数据补齐 `*En` 字段**：`LegalItem.dateEn`、`LeverItem.ministryEn`、`SocialChannel.labelEn` 等。`policies` 数据本来就有 `titleEn`，问题在页面层错把 zh title 当副标题渲染。
- **`pickLocalized` 升级到 N 语言通用形态**：新签名 `pickLocalized(record, baseKey, lang)` 自动按 lang 算 sibling 字段名（`title` → `titleJa` → ...）。旧 4-参形态保留兼容，新代码用新形态。
- **`localizedHref` / `unprefixed` / `localePrefix` / `getLangFromPath` 全 N-locale 化**：加新语言只需扩 `LOCALES` 数组与 `FALLBACK_CHAINS`，不需要改路由逻辑。
- **`scripts/i18n-check.mjs` 接受 `--lang` 参数**：未来加 ja/ko 时复用同一脚本，每个 lang 在 `LANG_CONFIG` 注册自己的 foreign-script 正则与白名单。
- [`docs/i18n.md`](docs/i18n.md) 加"如何新增一门语言"步骤清单。

## 0.4.0 — 2026-05-02

### Brand: 全名 + 新 Logo + 红色主色调

- **品牌全名**：`SG AI 观察` → `新加坡 AI 观察`；`SG AI Observatory` → `Singapore AI Observatory`。不再用 SG 缩写，关键词"新加坡 / Singapore"前置利于搜索抓取。同步刷新所有页面 title、og 标签、blog 文章 author 字段、CHANGELOG / README / docs。
- **新 Logo**：换成红色环抱 `ai` 字标，替换原 🚀 emoji。新增 favicon（多尺寸 ico + svg + 32px PNG）、apple-touch-icon (180px)、PWA manifest icons (192/512px)。`favicon.svg` 用 `<image>` 包装 PNG 保兼容。
- **主色调**：`theme-color` 与 manifest `theme_color` 从紫色 `#8D46E7` 改为红色 `#dc2626`，匹配新 logo。
- **Header 视觉收紧**：右上角搜索按钮去掉外框（`border border-subtle hover:border-primary` 这套），改纯图标按钮，视觉显著变小，与"中/EN"切换按钮的视觉重量对齐。

### i18n 大整顿：清零所有 EN 页面的中文残留

#### 问题

随手抽查 `/en/debates/`、`/en/voices/`、`/en/videos/` 页面，发现大量中文残留：

- 调研下来 366 个 EN 页面有 1970 处 CJK 字符意外显示给英文读者
- 共享组件（Header / Footer / RelatedRail / AuthorBio / TableOfContents / NextPrevPost / blog ListItem & SinglePost）和 Metadata 都是 zh 硬编码
- 数据文件已经有 `*En` 兄弟字段，但页面没用 `pickLocalized()`
- `og:site_name` 在 EN 页面输出 "SG AI 观察"；`og:locale` 一律 `zh-CN`；title 模板硬编码中文站名

#### 解决方案

1. **i18n 规范文档**：[`docs/i18n.md`](docs/i18n.md) — 数据双字段约定、页面渲染规则、共享组件 lang 推断、SEO metadata、新增内容/页面/组件清单。CLAUDE.md 加章节链接到规范。
2. **自动验证**：`scripts/i18n-check.mjs` 扫 `dist/en/**/*.html` 寻找 CJK 残留。`npm run check:i18n` 调用。0 残留通过。
3. **共享 chrome 修复**：
   - `Footer.astro` 用 `t(lang, 'siteName')` 输出本地化品牌名
   - `Metadata.astro` 接受 `lang` prop，按 lang 输出 `og:site_name`、`og:locale`、title 模板和 description 兜底
   - `Layout.astro` 把 `currentLang` 传给 Metadata
4. **共享组件 lang-aware**：
   - `AuthorBio` / `TableOfContents` / `NextPrevPost` / `RelatedRail` / `blog/ListItem` / `blog/SinglePost` 全部从 URL 推断 lang，按 lang 取字段、生成链接、渲染文案
   - `getRelatedPosts` 限定同语言邻居，EN 文章不再显示 zh 相关阅读
   - `utils/utils.ts` 的 `getFormattedDate(date, lang)` 加 lang 参数，分别用 zh-CN 和 en-US locale
5. **EN 页面修复（17 个）**：debates index/[id]、videos、voices、people/[id]、benchmarking、legal-ai、tracker、fieldnotes、ecosystem、talent、community-opensource、opensource、startups、timeline、references。一律走 `pickLocalized` 或 `*En` 兜底；drop EN 页面下的 zh 副标题。
6. **数据文件补 EN 兄弟字段**：`SocialChannel` 接口新增 `labelEn?: string`，CJK label 全部配对（voices.ts / people.ts 6 处）
7. **新增共享 helper**：`channelLabel(ch, lang)` 在 `src/i18n/index.ts`

#### 产出

- 1970 → 0 处 CJK 残留（`npm run check:i18n` 通过）
- 366 → 0 个污染页面
- `docs/i18n.md` 长期规范文档
- 新增内容 / 页面 / 组件按规范执行，自动验证防回归

---

## 0.3.1 — 2026-05-02

### Fix: 多语言切换 + Header 重排

- **修复语言切换按钮无效**：Astro `<ClientRouter>` 视图转场会 swap DOM，把绑定到 `#lang-toggle` 的 click 监听器丢掉。改用 document-level 事件委托（`[data-lang-toggle]`，挂在 `document` 上），监听器跨 view transition 存活。同方案应用到 LangBanner 切换链接。
- **Header 顶部重叠修复**：1440px 视口下 "About" 和 Search 框相互覆盖。Header 改用 flex 布局（不再用 3-col grid），Search 按钮改为图标-only（去掉 "Search" 文字，kbd 提示从 xl 起显示），LanguageToggle 加 min-width 防抖。
- **导航大瘦身**：去掉主题切换 / RSS / GitHub 按钮 / "关于"菜单——这些下放到 Footer 的社交行。Header 现只保留 Logo + 4 组 Nav + Search + 语言切换。
- **浏览器自动语言检测**：首次访问 `/`，读 `navigator.languages[0]`，是 EN 偏好就跳 `/en/`，写 `sgai_lang` 到 localStorage。返回访客尊重已存选择。Bots 无 JS 仍看到 canonical 页。
- **Footer 增强**：新增 ToggleTheme + GitHub + RSS + 关于链接。
- **署名修正**：`由 wulujia 维护` / `Maintained by wulujia`，去掉链接。About 页 lead 也改为 wulujia。

## 0.3.0 — 2026-05-02

### Feature: 完整双语站（中文 + 英文）

中文站留在 `/`（保 SEO，不破坏既有外链），英文站镜像在 `/en/`。两套都是完整内容，不留半截。

#### 架构

- `astro.config.ts` 启用 i18n：`{ defaultLocale: 'zh', locales: ['zh', 'en'], prefixDefaultLocale: false, fallback: { en: 'zh' } }`
- 新建 `src/i18n/index.ts`：双语字典 + `pickLocalized()`（自动 fallback）+ `getLangFromPath()` / `localizedHref()` 工具
- `src/navigation.ts` 改为 `getHeaderData(lang)` / `getFooterData(lang)` 函数，nav 标签全部走字典
- `PageLayout` / `Layout` / `Header` / `Logo` / `SearchModal` / `ToBlogLink` / `Breadcrumb` 全部从 URL 检测 lang
- 新增 `LanguageToggle` 组件（header 切换芯片）+ `LangBanner`（顶部非阻塞条幅）

#### 数据 schema 双语化（EN sibling 字段）

- `Policy.{summaryEn, contentEn, sourceEn}` + `PolicyCategory.nameEn`
- `Debate.{summaryShortEn, keyPointsEn, governmentStanceEn, oppositionStanceEn, policySignalEn, notableQuoteEn}`
- `Lever.{nameEn, subtitleEn, whatStateDoesEn, bottleneckSolvedEn, insightEn}` + `LeverGroup.titleEn` + `LeverItem.{nameEn, scaleEn, descriptionEn}` + `transmissionExplainer.{titleEn, bodyEn}`
- `TimelineEvent.{titleEn, descriptionEn}`
- `Person.summaryEn`（核心 7 人 + 213 议员 stub 标 "Profile pending."）
- `Institution.roleEn` / `MddiSpeech.speakerTitleEn`（voices.ts）
- 博客 frontmatter `lang: 'zh' | 'en'`；EN 文件存放在 `src/data/post/en/<slug>.md` 子目录

#### 翻译（4 个并行 agents）

- 30/30 政策、150/150 国会辩论、112 抓手项 + 30 group + 6 lever + transmissionExplainer、11/11 时间线、4/4 博客全文、字典 ~70 chrome 字符串
- DEBATE_STATS 6 个 metadata exports（POLICY_EVOLUTION / RECURRING_CONTROVERSIES / MP_PROFILES / KEY_INSIGHTS / POLICY_SIGNALS / TENSION_MAP）

#### 镜像 EN 路由（23 个页面）

- `/en/index.astro`（editorial homepage，独立 voice）+ `/en/about/`（去除中文 framing）
- `/en/blog/[...page].astro` + `/en/rss.xml.ts`
- `/en/policies/` + `[id].astro`、`/en/debates/` + `[id].astro`、`/en/people/[id].astro`
- `/en/levers/`、`/en/timeline/`、`/en/voices/`、`/en/videos/`、`/en/tracker/`、`/en/benchmarking/`、`/en/talent/`、`/en/opensource/`、`/en/community-opensource/`、`/en/startups/`、`/en/ecosystem/`、`/en/legal-ai/`、`/en/references/`、`/en/fieldnotes/`、`/en/evolution/`、`/en/challenges/`

#### 关键陷阱

Astro glob loader 把 `.` 当 slug 分隔符（`foo.en.md` → id `fooen`），所以 EN 博客文件改用 `post/en/<slug>.md` 子目录方案。

#### 验证

`npm run check` 0 errors / 901 HTML / 4.77 MB compressed / 54 核心页面 200 / 760 内部链接全 200。

## 0.2.0 — 2026-05-01

### Feature: Pagefind 全文搜索 + 实体详情页

- **搜索**：Pagefind `/` 键唤起，懒加载 UI bundle，主题色 vermillion
- **`/policies/[id]` × 30** 政策详情：完整内容、作者解析、RelatedRail
- **`/debates/[id]` × 150** 辩论详情：keyPoints / 立场 / 政策信号 / 完整 speaker 列表 + Hansard 原文折叠

### Feature: 长文打磨

- `Footnotes.astro` + `Cite.astro`：frontmatter `citations` 驱动，空数组时零渲染
- 接入 `[...blog]/index.astro` SinglePost 之后

### Polish: 移动 + a11y

- `/debates` 筛选行 < md 折叠为 `<details>` drawer，桌面保持展开
- `:focus-visible` ring 改为 vermillion 主题色

### Fix: 链接审计

- 27 采样页 × 397 unique hrefs，修复 6 处断链（旧 `/blog/<slug>` 前缀 + 缺尾斜杠）

### Refactor: About 页清洗

- 去掉真名、公司列表、wlj.me、Person schema
- 仅保留 "Luca"，反馈渠道收窄到 GitHub Issues（v0.3.1 进一步改成 wulujia）

## 0.1.0 — 2026-05-01

### Feature: 视觉识别 + 导航重构 + Editorial 首页

- **字体**：Source Serif 4（拉丁）+ Noto Serif SC（chinese-simplified 子集 400/600/700），浏览器按字符 fallback，CJK fallback 不闪烁
- **主色**：Vermillion `#C8102E` + 暖纸 `#FAF7F2` + Ink 中性栈，dark mode 单独 token
- **导航**：17 项 / 4 dropdown → 5 组扁平化，"深度分析"提到顶级，全站 chrome 去 emoji
- **首页重写**：杀掉 11 张 feature card，改 editorial 模板（Hero + freshness strip + 最新分析 + 抓手图谱 + 最近辩论 + 引言收尾）
- **新建 `/about` 页**：定位、方法论、利益声明、CC BY 4.0 授权

## 0.0.30 — 2026-05-01

### Feature: 长文阅读体验（Phase 2）

- TOC（自动生成自 h2/h3，安全降级）
- AuthorBio（解析 people.ts，含频道）
- NextPrevPost（基于 publishDate 排序，前后篇导航）
- ReadingProgress（顶部 2px 进度条，IntersectionObserver 驱动）
- TOC 视觉 bug 修复：1500-1700px 视口下侧栏覆盖正文，改为内联 `<details>` 折叠

## 0.0.20 — 2026-04-30

### Feature: 知识图谱 schema（Phase 1）

- 新建 `src/data/people.ts`（核心 7 人 + JSON 导入 213 议员 stub）+ `src/utils/people.ts`（模糊匹配 / honorific stripping）
- 所有数据接口加外键：`debates → personIds / topicIds / relatedPolicyIds / relatedLeverNumbers / relatedTimelineYears / relatedPostSlugs`，policies / levers / timeline 同
- 博客 frontmatter 加 cross-ref schema
- `src/utils/graph.ts`：`getRelated(EntityRef)` 跨实体查询，反向索引
- `RelatedRail` 组件（compact + full 两种 variant，empty 时零渲染）
- `scripts/audit-speakers.ts` + `codemod-debates.ts` + `codemod-policies.ts` + `codemod-levers.ts` + `verify-graph.ts`
- `/people/[id]` 个人页（核心 7 人 + 213 stub）

### Feature: 性能 + a11y 基线（Phase 0）

- 删除 `/debates` 内联 ~302 KB JSON，改为 SSG 渲染卡片 + URL 参数筛选
- 字体：删除 Inter（无 CJK 字形），先加载 fontsource 包等待 Phase 3 接入
- 全站 `:focus-visible` ring + `.overflow-x-auto` 滚动阴影

## 部署 / 仓库变化

- 2026-05 仓库重命名 `aisg → sgai`（避免与 AI Singapore 缩写撞名）
- 从 meltflake-site 子站毕业为独立站点，部署到 Cloudflare Pages，绑定 `https://sgai.md`
- CI：`npm run check`（astro check + eslint + prettier + verify-graph）

---

## 0.0.17 — 2026-04-02

### Feature: AI 影响力图谱页面

- **新页面：AI 影响力图谱** (`/voices/`) — 新加坡 AI 领域关键人物与核心机构信息渠道
  - 7 位关键人物：杨莉明、黄循财、维文、尚达曼、陈杰豪、何德华、刘劲松
  - 6 个核心机构：MDDI、IMDA、AI Singapore、Smart Nation、AI Verify Foundation、PDPC
  - 每个人物/机构展示所有官方信息渠道（Twitter、LinkedIn、Facebook、官网等），标注主力渠道
  - 56 篇 MDDI AI 相关演讲稿全文链接（2017–2026），支持按年份和演讲者筛选
- 新数据文件：`src/data/voices.ts`
- 导航栏「AI 追踪」分组新增「AI 影响力图谱」入口

### Chore: MDDI 演讲稿采集脚本

- 新增 `scripts/voices/01_scan_mddi.py`，基于 MDDI sitemap.xml 的演讲稿采集脚本
  - 从 sitemap 获取全部新闻室 URL，用关键词过滤 AI 相关演讲稿
  - 自动提取标题、日期、演讲者信息
  - 支持按年份过滤和排除已有
- Bumped version to 0.0.17

## 0.0.16 — 2026-04-01

### Feature: AI 视频观点页面

- **新页面：AI 视频观点** (`/videos/`) — 收录新加坡政府官员、学者和行业领袖关于 AI 的 YouTube 演讲与访谈
  - 46 条视频，覆盖 2019–2026 年
  - 按 5 大主题分类：AI 战略与愿景、AI 治理与监管、AI 人才与教育、AI 产业与应用、国际合作与对标
  - 三维筛选：主题 / 年份 / 演讲者类型（政府官员 / 学者 / 行业领袖）
  - 统计行：视频总数、演讲者人数、覆盖年份
  - 卡片式展示：中文标题、演讲者、身份、日期、时长、摘要、来源频道
  - 点击跳转 YouTube 观看
- 新数据文件：`src/data/videos.ts`，含 `VideoItem` / `VideoCategory` 接口
- 导航栏「AI 追踪」分组新增「AI 视频观点」入口（头部 + 底部）
- 首页统计新增 AI 视频数量，features 新增视频观点板块

### Chore: YouTube 视频采集脚本

- 新增 `scripts/videos/` 目录，基于 YouTube RSS feed 的频道扫描脚本
  - `01_scan_channels.py` — 扫描 7 个 YouTube 频道，用关键词过滤 AI 相关视频，支持按天数和频道筛选
  - `02_review_and_merge.py` — 交互式审核候选视频，生成 TypeScript 代码片段
  - 监控频道：CNA、The Straits Times、govsg、Smart Nation、AI Singapore、WEF、Bloomberg
  - 无需 API key，依赖 `requests` + `feedparser`
- Bumped version to 0.0.16

## 0.0.11 — 2026-03-01

### Feature: 国会 AI 焦点页面全面升级

- **AI 驱动的中文摘要与观点提炼**
  - 用 LLM (GPT-4.1-mini) 对 132 条辩论批量生成中文摘要（100-150字）
  - 提炼每条辩论的政府立场 vs 质询立场
  - 标注争议度（1-5级）、政策信号、值得引用的原文
- **新增 6 大分析模块**
  - **核心洞察**：从 132 条辩论中提炼出 6 条高价值规律
  - **政策演变脉络**：将 2015-2026 年分为 4 个历史时期
  - **反复争议焦点**：7 大持续议题，含双方立场对比
  - **核心政策张力**：5 个维度的张力分析
  - **议员档案**：8 位关键议员，含中文名、党派、发言次数、关注领域和最值得关注的观点
  - **政策信号追踪**：8 条政策信号，标注首次出现年份和落实状态
- **页面交互升级**
  - 支持按争议度筛选
  - 双语展示：中文摘要 + 英文原文节选

### Chore: 新增数据采集脚本与文档

- 新增 `scripts/hansard/` 目录，包含完整的数据采集、处理、分析脚本链
- 新增 `scripts/hansard/README.md`，详细说明数据来源、流水线、API 协议和如何重新运行
- 将分析过程中产生的中间数据文件（如 report_id 列表、分析结果）存入 `scripts/hansard/data/`
- 更新项目根目录的 `README.md`
- Bumped version to 0.0.11

## 0.0.10 — 2026-02-22

### Feature: 实战经验 (Field Notes) 板块

- **新页面：实战经验** (`/fieldnotes/`) — 来自社区的结构化落地经验
  - 按主题聚合，匿名化处理，标注公司画像和适用条件
  - 卡片式呈现：标题、标签、公司画像、分段要点、highlight 标注、总结
  - 首条内容：AI 创业公司与 EDB 会议纪要（涵盖公司属性判定、EP 申请、团队多元化、税务合规、补贴政策、公司注册）
- 新数据文件：`src/data/fieldnotes.ts`，TypeScript 接口定义
- 导航栏新增"实战经验"入口（顶部导航 + 页脚）
- Bumped version to 0.0.10

## 0.0.9 — 2026-02-19

### Feature: 公共 AI 研究投资计划 + 多项数据更新

- 新增政策：公共 AI 研究投资计划 (2026-2030)，S$1B / US$779M，来源 MDDI 2026.1.24 公告
- 更新 NAIS 2.0：补充九大优先领域（交通物流、制造业、金融、安全、网络安全、智慧城市、医疗、教育、政府服务）
- 更新 Smart Nation 2.0：补充 S$120M AI 应用基金和五大国家 AI 项目（智能货运、市政服务、慢性病管理、个性化教育、边境清关）
- 时间线更新：2026 AI Research Week + AAAI；2025 Google DeepMind/MSRA 实验室；2024 NUS AI Institute + Smart Nation 2.0 落地
- Tracker 新增：公共 AI 研究投资额、人均 AI 投资对比（SG $139 vs US $33 vs CN $7）、AI 人才目标 15K by 2029、RUSSELL-GPT 医疗案例、五大国家 AI 项目
- 生态系统：Google DeepMind 东南亚首个实验室 (2025.11)、MSRA 东南亚首个实验室 (2025.7)、NUS AI Institute (2024.3)、NVIDIA 合作
- 核心政策数从 19 → 20
- Bumped version to 0.0.9

## 0.0.8 — 2026-02-17

### Feature: 国际对标 (International Benchmarking) page

- **New page: 国际对标** (`/benchmarking/`) — Compare Singapore's AI strategy with 9 global economies
  - Overview comparison table with 10 regions (Singapore highlighted)
  - 4 key insight cards (governance divergence, investment gap, talent, SG positioning)
  - 9 detailed region profiles with expandable cards:
    - Hong Kong, Taiwan, UAE, Israel, South Korea, Estonia, Switzerland, Finland, Canada
    - Each includes: strategies, investment table, governance, initiatives, strengths/weaknesses vs SG, key bodies, sources
  - Data disclaimer and update date footer
- New data file: `src/data/benchmarking.ts` with full TypeScript interfaces
- Added "国际对标" as top-level nav link between "AI 追踪" and "参考资源"
- Added to footer under "更多"
- Bumped version to 0.0.8

## 0.0.7 — 2026-02-17

### Update: Tracker 数据大更新

- 投资与资金：政府 AI 专项从 S$1B 更新为 S$2B+（含 NAIRD S$1B、企业计算 S$150M）；新增科技巨头基础设施 US$26B+、AI 创业融资 US$8.4B+、Budget 2026 税收激励
- 人才培养：新增 SkillsFuture 105K 人、TeSA 21K/340K、AIAP 详细数据、Google AI 技能计划、职场 AI 使用率、AI Springboard
- 研究产出：新增 NTU/NUS 排名、SEA-LION v4、100 Experiments、ICLR 2025、DBS AI 模型
- 产业采用：新增数字经济 GDP 占比、大企业/中小企业 AI 采用率、独角兽 32 家、东盟 AI 交易份额
- 基础设施：新增 NSCC ASPIRE 2A+、国家 AI 计算网格、商用 GPU 集群、NVIDIA 营收、数据中心市场、5G 覆盖
- 国际排名：新增 Tortoise 第 3、Oxford 第 2、WIPO 第 5 等排名数据
- Tracker 从 16 项扩展至 42 项指标，6 大分类
- Bumped version to 0.0.7

## 0.0.6 — 2026-02-17

### Feature: AI 创业生态 (AI Startup Ecosystem) page

- **New page: AI 创业生态** (`/startups/`) — Singapore AI startup ecosystem overview
  - Overview stats: 650+ startups, global rank #3, $8.4B+ VC raised, 9 unicorns
  - Unicorn table with valuations (Grab, Trax, Advance Intelligence, Biofourmis, etc.)
  - 5 vertical sections: 金融科技, 医疗健康, 企业 SaaS, AI 基础设施, 机器人与自动驾驶
  - Notable exits & acquisitions table (Manus/Meta $2B+, etc.)
  - Investor ecosystem cards (SGInnovate, Temasek, GIC, Antler, etc.)
- New data file: `src/data/startups.ts`
- Added "AI 创业生态" to AI 追踪 dropdown nav and footer
- Bumped version to 0.0.6

## 0.0.5 — 2026-02-17

### Feature: Split 开源与研究 into two pages

- Renamed existing page nav text from "开源与研究" to "官方开源与研究"
- Added intro text clarifying scope (AISG & government-funded projects)
- **New page: 产学研开源生态** (`/community-opensource/`) — community open source ecosystem
  - University projects: Colossal-AI, OpenMMLab, NExT-GPT, Show-o/ShowUI, VideoSys, TSLANet
  - Corporate lab projects: LAVIS/BLIP, CodeGen, BAGEL, VideoLLaMA3, Sailor LLM, OAT, Zero-Bubble
  - Startup projects: Jan
  - Summary info box and data disclaimer
- New data file: `src/data/community-opensource.ts`
- Updated header and footer navigation with both pages
- Bumped version to 0.0.5

## 0.0.4 — 2026-02-17

### Feature: 开源与研究 (Open Source & Research) page

- **New page: 开源与研究** (`/opensource/`) — AI Singapore open source projects, model ecosystem, and research papers
  - SEA-LION model ecosystem stats (56 models, version breakdown v1–v4)
  - SEA-Guard safety models section (4 models, early stage)
  - AI Verify governance framework with features and partners
  - Open source project cards (TagUI, SEA-LION, PeekingDuck, SGNLP, Speech Lab, Synergos)
  - Research papers listing (4 papers with arXiv links)
  - Honest context comparison with global models
- New data file: `src/data/opensource.ts`
- Added "开源与研究" to AI 追踪 dropdown nav and footer
- Bumped version to 0.0.4

## 0.0.3 — 2026-02-17

### Feature: Grouped dropdown navigation & 3 new pages

- **Navigation refactor**: Flat nav → grouped dropdown menus
  - 政策观察 ▾ (政策文件, 发展时间线, 生态地图)
  - AI 追踪 ▾ (关键指标, 人才培养)
  - 参考资源 (flat link)
- **New page: 发展时间线** (`/timeline/`) — Vertical timeline of Singapore AI milestones from 2014–2027
- **New page: 生态地图** (`/ecosystem/`) — AI ecosystem map with 8 categories covering research, governance, tech, talent, products, innovation, international, and industry partners
- **New page: 人才培养** (`/talent/`) — 8 talent development programmes with key stats cards (AIAP, LADP, PhD Fellowship, AMP, LearnAI, NAISC, IOAI, AI Goes to School)
- New data files: `src/data/timeline.ts`, `src/data/ecosystem.ts`, `src/data/talent.ts`
- Updated footer to match new navigation structure
- Bumped version to 0.0.3

## 0.0.2 — 2026-02-17

### Refactor: Separate data from templates

- Extracted all hardcoded page data into `src/data/` TypeScript modules:
  - `src/data/policies.ts` — 19 policy documents across 5 categories with full metadata
  - `src/data/tracker.ts` — 16 tracker metrics across 5 sections
  - `src/data/references.ts` — 26 reference links across 6 categories
  - `src/data/stats.ts` — homepage statistics and feature items
- Updated all 4 pages to import from data files instead of hardcoding:
  - `src/pages/index.astro` — imports stats and features
  - `src/pages/policies/index.astro` — imports policy categories
  - `src/pages/tracker/index.astro` — imports tracker sections
  - `src/pages/references/index.astro` — imports reference sections
- Added TypeScript interfaces for all data types
- Tracker rows now use named fields (`name`, `value`, `source`, `sourceUrl`) instead of array indices
- No visual changes — same HTML output
- Bumped version to 0.0.2

## 0.0.1 — Initial release

- AstroWind-based site with hardcoded data in .astro pages
- Pages: homepage, policies, tracker, references, evolution, challenges

# CLAUDE.md — sgai 项目指南

## 项目概述

新加坡 AI 观察 (https://github.com/meltflake/sgai) — 深度观察新加坡 AI 生态与战略的中文网站。
仓库于 2026-05 从 `aisg` 重命名为 `sgai`（避开 AI Singapore 缩写撞名）。同时从 meltflake-site 子站"毕业"，作为独立站点部署，线上地址 `https://sgai.md/`（DNS/Cloudflare 配置另行处理）。
基于 Astro 5.0 + Tailwind CSS 的静态站点，部署于 Cloudflare Pages。

## 技术栈

- **框架**: Astro 5.0 (静态站点生成)
- **样式**: Tailwind CSS
- **语言**: TypeScript + Astro
- **内容**: Markdown 博客文章 (`src/data/post/*.md`)，TypeScript 数据文件 (`src/data/*.ts`)
- **部署**: Cloudflare Pages（`.github/workflows/deploy.yaml` 构建 + wrangler 直传，见「部署」一节）

## CI 管线

```bash
npm run check  # = check:astro && check:eslint && check:prettier && check:graph
```

四项检查全部通过才能合并。修复命令：

```bash
npm run fix           # 一键修复 eslint + prettier
npm run fix:eslint    # 仅修复 eslint
npm run fix:prettier  # 仅修复 prettier (prettier -w .)
```

**提交前必须运行 `npm run check` 确认通过。**

### 构建产物层检查（dist gate）

`npm run check` 跑的是源码级静态检查，看不见 JSON-LD 字符串语义、meta tag 完整性、地区化字段是否漏翻。下面三个命令针对 `dist/` 跑，PR 前手动跑（`check:i18n` + `check:schema` 由 `.github/workflows/actions.yaml` 的 build job 在 PR 时跑，见「部署」一节；本地手动跑做提交前预检）：

```bash
npm run build && npm run check:dist
# = check:i18n + check:schema + check:meta + check:zh-tw-misconversion + check:markdown-export + check:data-export
```

| 命令                    | 工具                                     | 抓什么                                                                                                                                                                                                                                                                                                                                                                               | 必跑场景                                                                          |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `check:i18n`            | `scripts/i18n-check.mjs`                 | `dist/**/*.html`（除 `/zh/`）里的中文残留                                                                                                                                                                                                                                                                                                                                            | 动了 EN 页面 / 共享组件 / 双字段数据                                              |
| `check:schema`          | `scripts/check-schema.mjs`               | `dist/**/*.html` 里的 `<script type="application/ld+json">` 块。按 `@type` 校验关键字段：BreadcrumbList itemListElement 的 `name` 非空、VideoObject 的 `uploadDate` ISO 8601、Article/NewsArticle/BlogPosting 的 `headline` + `datePublished`、Organization/Person 的 `name`、WebSite 的 `name` + `url`。GSC 报错（"Either name or item.name should be specified" 之类）的本地兜底。 | 动了任何会 emit JSON-LD 的页面 / 组件                                             |
| `check:meta`            | `scripts/check-meta.mjs`                 | `dist/**/*.html` 的 SEO meta 层：title 显示宽度 ≤ 72 加权单位（CJK 字符=2）+ 禁止 `· <板块品牌> · sgai` 双品牌尾巴；description ≤ 165 单位（Metadata.astro 收口层用 `truncateAtBoundary` 钳到 160，词边界截断，裸 `.slice(0,200)` 会当场爆门）；canonical 唯一且指向本站；hreflang 簇 ↔ canonical 自指一致（跨页 canonical 的页面必须无 hreflang，反之必须有全簇 + x-default）。     | 动了 `metadata.title/description`、canonical 覆盖、CommonMeta/Metadata            |
| `check:markdown-export` | `scripts/evals/markdown-export/check.ts` | `dist/**/*.md` 的详情页 Markdown 孪生（排除 `dist/skill/`）全量扫：断言首行是 `# ` H1、含 `- sgai: https://sgai.md/` 永久链接行、含 `CC BY 4.0` 许可标记、元数据块（首个 `## ` 前）无 `undefined` / `[object Object]` 残留（正文是逐字原文，不做模式匹配）。`check:i18n` 只扫 `*.html`，孪生文件在它的盲区里。                                                                       | 动了 `src/utils/markdown-export.ts`、`[id].md.ts` 路由、`src/utils/license.ts`    |
| `check:data-export`     | `scripts/evals/data-export/check.ts`     | `dist/data/*.json` 的信封契约：能 parse；`schemaVersion === 1`；`dataset` 等于文件名；`count === items.length`；`license.terms` 指向 DATA-LICENSE.md；凡带 `links.sgai` 的行必须五语齐全、每条都是绝对 `https://sgai.md/` 地址且前缀与 key 一致（en 无前缀）；`records.json` 每行 `title.en` 非空且按 `addedAt` 倒序；六个数据集文件缺一即 fail。                                    | 动了 `src/pages/data/*.ts` / [src/utils/data-export.ts](src/utils/data-export.ts) |
| `check:dist`            | 上面几个串跑                             | —                                                                                                                                                                                                                                                                                                                                                                                    | 推荐 PR 前默认跑这个                                                              |

凡是动了 EN 页面、共享组件、数据双字段的 PR，必须本地跑通 `check:i18n`。
凡是动了 schema-emitting 页面 / 组件（`<JsonLd schema={...} />` / `Breadcrumb.astro` / `*Profile.astro` / `[id].astro`）的 PR，必须本地跑通 `check:schema`。
凡是动了页面 `metadata`（title / description / canonical）或 `Metadata.astro` / `CommonMeta.astro` 的 PR，必须本地跑通 `check:meta`。详情页 title 不要再加页面级板块后缀（`· sgai` 由全局模板追加）；合成 description 一律走 [src/utils/seo-meta.ts](src/utils/seo-meta.ts) 的 `synthesizeMetaDescription`（禁止裸 `.slice(0, N)`）；跨页 canonical（legal-ai ↔ policies 孪生、benchmarking `canonicalPath`）由 Layout → CommonMeta 自动抑制 hreflang，不要手动加 hreflang。

### Evals（周巡检）

不同于 `check`（每 PR 跑、源码层、零成本）和 `check:dist`（PR 前手动、构建产物层），**evals 跑模型/数据层回归**——周一 cron 扫一次，发现新增 broken URL / 漏翻字段 / 三语缺漏自动开 issue。计划见 [`docs/20260509-evals-plan.md`](docs/20260509-evals-plan.md)，使用见 [`scripts/evals/README.md`](scripts/evals/README.md)。

```bash
npm run eval                       # 全部（URL 健康 + i18n Layer A + updates ledger）
npm run eval:url                   # 全量扫 sourceUrl 可达性（CLAUDE.md rule #6 的存量巡检兜底）
npm run eval:url -- --changed-only # 只扫 PR 改过的 src/data/*.ts
npm run eval:i18n -- --layer=a     # 数据层：每条 record 的 CJK 字段 *En + *Ja 配对（zero-cost）
npm run eval:i18n -- --layer=all   # +B sitemap parity / +C hreflang parity / +D 语言纯度（需 build）
npm run eval:facade-stats          # README/About 门面数字 vs src/data 真值（辩论/政策/创业/独角兽/经济体/指标），漂移即 fail（PR + 周都跑）
```

cron 入口：`scripts/refresh/registry.json` → `id=evals`，weekly schedule。

### 已知盲区与后续加固

- **GSC monitor 自动化**：当前依赖 GSC 邮件人肉转译。可拉 GSC API 每日扫描，新 issue 自动开 GitHub issue。
- **Rich Results Test 抽样**：`check:schema` 是字段级断言，不验完整 Google Rich Results 规则。计划在 evals Eval 5 加 [structured-data-testing-tool](https://github.com/maxprilutskiy/structured-data-testing-tool) 抽样跑。
- **AI Summary / Translation 金标回归**：`ai-summarize.ts` / `translate.ts` 没有金标对比，模型升级 / prompt 改动后无法证明输出没退化。计划在 evals Eval 3/4 补。

## 编码规范与常见陷阱

### 1. Astro 文件中的注释语法

在 `.astro` 文件的 JSX 表达式（如 `.map()` 回调、三元表达式）内部，**禁止使用 HTML 注释**：

❌ 错误 — HTML 注释在 JSX 表达式内会导致解析错误：

    {items.map((item) => (
      <!-- 这是注释 -->
      <div>{item.name}</div>
    ))}

✅ 正确 — 使用 JSX 注释语法：

    {items.map((item) => (
      {/* 这是注释 */}
      <div>{item.name}</div>
    ))}

> Astro 模板顶层可以用 HTML 注释 `<!-- -->`，但 JSX 表达式内部必须用 `{/* */}`。
> Prettier 解析 Astro 文件时会因此报 SyntaxError。

### 2. 不规则空白字符

数据文件（尤其是从外部来源复制的内容，如国会辩论记录）可能包含不规则空白字符：

- `\u00A0` (NBSP)、`\u3000` (全角空格)、`\u2003` (Em Space)、`\u200B` (零宽空格) 等

ESLint `no-irregular-whitespace` 规则会报错。**粘贴外部文本后，注意检查并替换为普通空格。**

### 3. 类型标注

禁止使用 `as any`（ESLint `@typescript-eslint/no-explicit-any`）。使用具体类型：

```typescript
// ❌ (c as any).relatedTopics as string[]
// ✅ (c as { relatedTopics: string[] }).relatedTopics
```

### 4. Prettier 格式化

项目使用 Prettier 统一格式。如果修改了多个文件，提交前运行：

```bash
npx prettier --write src/
```

### 5. i18n 双字段约定（关键 — 最高优先级）

> **🔴 顶层硬规则：sgai 是 zh + en + ja + zh-tw + ko 五语站点。en / ja / ko 三个书写语言全部强制，zh-tw 从 zh 派生。**
>
> 2026-07 起「ko 可选」已废除——`en`、`ja`、`ko` 三语数据字段全部强制（`check:i18n-completeness --locales=en,ja,ko` 是 CI 硬门）。四类内容的强制形态：
>
> - **标量 CJK 字段**（`title` / `summary` / `description` / `label` / `ministry` ...）：`*En` + `*Ja` + `*Ko` 三个兄弟字段全部必填，同一次 commit。gate = `check:i18n-completeness`。
> - **Transcript 正文数组**（debate / speech / video 的 `paragraphs*`）：`paragraphs`(zh) + `paragraphsEn` + `paragraphsJa` + `paragraphsKo` 四条全部非空且**段数配平**。gate = `check:debate-transcripts` / `check:speech-transcripts` / `eval:video-transcript`（全是 CI 硬门，见 rule #8/#11）。
> - **长文 post**（`src/data/post/*.md`）：每篇 zh 原文必须有 `en/ja/ko/zh-tw` 四个同名实体文件。gate = `check:post-i18n`（CI 硬门）。**注意 post 是唯一 zh-tw 也要实体文件的内容类型**（blog.ts 按物理文件加载，无运行时派生）——zh-tw 用 [scripts/hansard/derive-zh-tw-posts.ts](scripts/hansard/derive-zh-tw-posts.ts) 确定性 OpenCC 转换生成，ja/ko 用 [scripts/refresh/post-translations/translate-post.ts](scripts/refresh/post-translations/translate-post.ts) 真翻译。
> - **`zh-tw`（繁體中文，`/zh-tw/...`）**：除 post 外**不写数据字段**。运行时跑 OpenCC s2twp 从 zh 自动转换（[src/i18n/opencc.ts](src/i18n/opencc.ts)）。手动 override 用 `zhTwDict` 字典或可选 `*ZhTw` 字段。
>
> 任何 `src/data/*.ts` 的数据更新——agent 自动 PR、手动编辑、批量 codemod、回填、粘贴翻译——必须 zh / en / ja / ko 四语同步写入。zh-tw 自动派生不用管（post 除外）。
>
> - ✅ 加新条目：`title` / `titleEn` / `titleJa` / `titleKo` 必须同时给值，同一次 commit。
> - ✅ 改老条目：改了 `title` 必须连带改 `titleEn` / `titleJa` / `titleKo`，反之亦然。同一次 commit。
> - ❌ 禁止「先 commit 中文版，下一个 PR 补英文/日文/韩文」这种分步操作。EN/JA/KO 页面会立刻渲染断裂或被 CI 挡下。
> - 不会写英文/日文/韩文？用 [scripts/lib/translate.ts](scripts/lib/translate.ts) 的 `translateRecords(records, ['title','description'], { direction: 'zh→en' })` / `'zh→ja'` / `'zh→ko'` 一行调出来。Claude haiku，零 API key，已带 sha256 缓存。
> - 真要「这个字段我现在没法翻译」时，**必须**在该字段所在行上面注释 `// i18n-allow-unpaired` 显式豁免，否则 [scripts/lib/i18n-pair.ts](scripts/lib/i18n-pair.ts) 会 fail。

完整规范见 [`docs/i18n.md`](docs/i18n.md)。其他常踩点：

- 数据接口：用户可见的中文字段都要加 `*En` 和 `*Ja` 兄弟字段（`title` / `titleEn` / `titleJa`、`description` / `descriptionEn` / `descriptionJa` ...）。`*Ko` 可选但鼓励。`*ZhTw` 一般不写（OpenCC 自动）。含 CJK 的 `label` / `ministry` / `scale` 等同样规则。
- 渲染：**永远不要**直接 `{record.title}`。用 `pickLocalized(record, 'title', lang)` 自动按 lang 选 sibling（含 zh-tw 的 OpenCC 转换）。
- 内部链接：用 `localizedHref(path, lang)`，不要硬编码 `/en/` 或 `/ja/` 前缀也不要直接给裸路径。Lang code 本身就是 URL 段（`zh-tw` → `/zh-tw/`）。
- 共享组件（所有 lang 都用的）：组件顶部 `getLangFromPath(new URL(Astro.url).pathname)` 推断 lang，所有展示文案、链接、字段都按 lang 走。
- SocialChannel：含 CJK 的 `label` 必须配对 `labelEn`。
- 提交前必跑：`npx tsx scripts/lib/i18n-pair.ts --locales=en,ja <动过的文件>`（emit 时已自动跑，但手工编辑也要跑）+ `npm run build && npm run check:dist`。前者扫源码，后者扫 `dist/` 中文残留 + JSON-LD 合规。
- 单独验证某 locale 渲染：`node scripts/i18n-check.mjs --lang zh-tw` 或 `--lang ko` 扫 `dist/<lang>/**.html` 的残留。
- `whyItMatters`（首页"最近更新"那一行判断）：videos / policies 两条 emit 管线**自动产出四语**（`whyItMatters` + `En` / `Ja` / `Ko`），起草器是 [scripts/lib/why-it-matters.ts](scripts/lib/why-it-matters.ts)，批量封装在 [scripts/lib/why-it-matters-batch.ts](scripts/lib/why-it-matters-batch.ts)——起草或翻译失败就四条全不写（绝不只写 zh，`check:i18n-completeness` 会拒），只打一行 WARN，不中断 PR。**debates 走的是 Python hansard 管线，不自动产出**：新辩论落地后手动跑一次 `npx tsx scripts/backfill-why-it-matters.ts --only=debates`。
- 自动管线已强制：`scripts/lib/auto-discovered-emit.ts` 和各 `emit.ts` 在 emit 后跑 `findUnpairedFields` baseline-vs-after diff，新引入 unpaired 自动 rollback；不会"偷偷"放出单语种数据。11 条 refresh 管线当前自动产出 `*En` + `*Ja`；让它们也产出 `*Ko`，每个 `emit.ts` 找到 `zh→ja` 那行旁边加一行 `zh→ko, targetSuffix: 'Ko'` 即可。

### 6. sourceUrl 真实性约定（关键 — 最高优先级）

> **🔴 顶层硬规则：任何写入 `src/data/*.ts` 的 `sourceUrl` / `url` 字段必须 HTTP 可达（2xx/3xx，或 401/403/429 这类反爬但页面真实存在）。404/410/5xx/DNS 失败一律禁止入库。**
>
> 触发场景：所有"靠 LLM 补脑"的内容流程——voices prospect、人工编辑、粘贴翻译、agent 批量回填等。和 hansard / videos 这类先有 API ground-truth 再 emit 的管线不同，这类流程对 URL 幻觉零防御。
>
> - ❌ 禁止凭训练记忆/格式推断构造 URL。LLM 会在 URL 模式正确（如 `fintechfestival.sg/speakers/spkr<NUMBER>-<slug>`）时填一个看似合理但**从未存在**的 ID。这种幻觉肉眼几乎无法识别，必须靠 HTTP 校验兜底。
> - ✅ 加 / 改 sourceUrl：必须先 `curl -I` 或 fetch 验证 200/3xx，再写入。
> - ✅ 不确定？用 [scripts/lib/gov-fetch.ts](scripts/lib/gov-fetch.ts) 的 fetch helper 真去抓一遍。
> - ✅ schema 允许 sourceUrl 可选时（如 `SignatureWork` / `SpeakingEntry` / `ExternalRole`），找不到可信源就**留空**比写假的好；`NotableQuote.sourceUrl` 是 required，找不到就整条删。
> - ✅ 真的"页面被反爬挡了但内容确实存在"：在 prospect JSON 的 `notes` 字段写明白验证依据（如"archive.org 快照确认"），并通过 `--skip-url-check` 显式豁免。
>
> 强制点：`scripts/voices/prospect-stubs.mjs apply` 在 print TS 片段前会 HEAD-check 所有 sourceUrl，4xx/5xx（除 401/403/429）blocks apply 退码 2。新加的"靠 LLM 补脑"型管线**必须**复用同样的 `validateUrls()` 检查。

历史踩点：[c574e54](https://github.com/meltflake/sgai/commit/c574e54)（2026-05-03 voices backfill）写入 2 条编造 URL（`spkr4563-prof-mohan-kankanhalli`、`asianaviation.com/astar-sia-siaec-...`），加 2 条 weforum 反爬伪 404。当时无 URL 校验，靠用户事后报错才发现。本规则即此次事故的事后加固。

### 7. addedAt 约定（关键 — 最高优先级）

> **🔴 顶层硬规则：任何加到 `src/data/{videos,policies,debates,people,voices,tracker,benchmarking,ecosystem,levers,startups,legal-ai,talent,reg-lookahead,ai-capital}.ts` 的新 record 必须设 `addedAt: 'YYYY-MM-DD'`（写入当天的日期，永不修改）。**
>
> sgai 首页"最近更新"模块（[`src/components/home/LatestUpdatesFeed.astro`](src/components/home/LatestUpdatesFeed.astro)）与 `/updates/`、`updates.rss.xml` 的内容**从数据文件派生**——`src/utils/derived-updates.ts` 扫每条 record 的 `addedAt`，**每条 record 产出一个 update entry**（标题、一句 summary、record 自己的事件日期、直链），四语齐全。派生器覆盖的数据文件清单与 `scripts/evals/addedAt-coverage/check.ts` 的 `DATA_FILES` 由单测 `data-files-sync.test.ts` 锁死——新加 harvester 两边都要改。`src/data/updates.ts` 只剩 `site` / `fix` / `longform` 三种**编辑性事件**的 manual override（`MANUAL_TYPES` 在 import 时强制校验，加错 type 会 build error）。
>
> 这意味着：**忘了给新 record 加 `addedAt`，首页就看不到它。** 不需要再去碰 `updates.ts`，也不允许往 `updates.ts` 加 video/policy/debate 这类 type 的 entry。
>
> - ✅ 走标准 emit 管线：`scripts/refresh/<domain>/emit.ts` 已经自动写 `addedAt: today`。
> - ✅ 手动加 record（fix PR / 补漏 / 回填 / agent 直接编辑）：record 字面量里写 `addedAt: '今天的日期',`。
> - ❌ 禁止"先合数据 PR，下一个 PR 补 addedAt"——eval 在 PR 时 fail，CI 会 block merge。
> - ✅ Pending review 条目（如 ecosystem `_pendingReview: true`、levers/legal-ai 的 auto-discovered section、startups/tracker/benchmarking/talent 的 `autoDiscovered[]` 数组）**不**设 addedAt。当人工把它们 promote 到正式数据时再加 addedAt。
> - ✅ 老 record 不强制回填 addedAt——派生函数对 undefined 直接跳过。回填工作可由 `scripts/backfill-addedAt.ts`（用 git log 推断首次出现日期）单独 PR 完成。
>
> 强制点：
>
> 1. `src/data/updates.ts` 在 import 时校验 `MANUAL_UPDATES` 数组只能是 `site/fix/longform` 类型——加错 type 直接 build error。
> 2. `npm run eval:addedAt` 扫 `git diff main -- src/data/*.ts` 的 added 行：count `+ id: 'xxx'` vs count `+ addedAt: 'xxx'`，缺则 fail。
> 3. `.github/workflows/actions.yaml` 的 `check` job 跑 `npm run eval:addedAt -- --base=origin/main`——CI 强制门，PR 不能 merge。
> 4. weekly cron 也跑（`scripts/refresh/registry.json` 的 evals entry），失败自动开 issue。

历史踩点：[a608bc0](https://github.com/meltflake/sgai/commit/a608bc0)（2026-05-09 videos 手动 fix）补 v059/v060 但漏掉 `updates.ts`，首页"最近更新"看不到当天新增视频。当时 ledger 是手工双源真相，靠纪律维护——失败一次就漏了。本规则把"最近更新"改成**派生模式**，从根上消除 drift bug 类。手动 ledger 那条规则（CLAUDE.md 之前的版本写的）已废弃。

### 8. video-transcripts 四语对齐（关键 — 最高优先级）

> **🔴 顶层硬规则：`src/data/video-transcripts.ts` 里任何一条 record 只要有 `paragraphsEn`，就必须同时有 `paragraphs`（zh）、`paragraphsJa`、`paragraphsKo`，四条段数配平。`digest` / `digestEn` / `digestJa` / `digestKo` 同样四语共存共缺。同时 `src/data/videos.ts` 里的每个 video 必须在 `videoTranscripts` 里有 record（带内容，或显式 `source: 'unavailable'` 占位），否则 `/ja/videos/<id>/` 会渲染开发者文案 "Run npm run fetch:video-transcripts to refresh"。**
>
> （2026-07 起 ko 并入硬门——`eval:video-transcript` 从三语升四语。zh-tw 不入库，OpenCC 运行时派生。）
>
> - ✅ 标准链：`npm run fetch:video-transcripts -- --ids=vNNN` 已经自动 chain en→zh→ja translate，单条命令到三语对齐
> - ✅ YouTube 视频根本没字幕轨：fetch 会自动写 `source: 'unavailable'` 占位，前端渲染"字幕不可用"友好文案（不是开发者 fallback）
> - ✅ 手动改 `video-transcripts.ts`：要么三语都填，要么删除整个 record（让 fetch 重跑）
> - ❌ 禁止 emit-only 路径绕过自动 chain；用 `--no-translate` flag 只在 schema 改造、translation 还未移植的临时场景才允许
>
> 强制点：
>
> 1. `scripts/evals/video-transcript-coverage/check.ts` 在 PR diff 模式扫所有新增 `id: 'vNNN'`，缺 record / 不三语对齐 → exit 1
> 2. `.github/workflows/actions.yaml` 的 check job 跑 `npm run eval:video-transcript -- --base=origin/main`，CI 硬门
> 3. `scripts/refresh/registry.json` 的 weekly evals 也跑 `--include-historical` 全量扫，自动开 issue

历史踩点：2026-05-21 用户发现 `/ja/videos/v062/` 显示 "No readable content for this video yet. Run npm run fetch:video-transcripts to refresh."。根因调查发现 5 条视频（v022/v040/v044/v061/v062）在 `video-transcripts.ts` 完全缺失：v022/v040/v044 是 YouTube 没字幕轨但 fetch emit 过滤了 unavailable 记录（[fetch-transcripts.ts:206](scripts/videos/fetch-transcripts.ts) 之前 `.filter((r) => r.paragraphs.length > 0)`），v061/v062 是新加的视频还没轮到 cron。本规则修复方式：(1) emit 改为 always 写 unavailable 占位 + 防 downgrade；(2) fetch 自动 chain translate；(3) 加 eval + CI 硬门 + weekly cron 防御。

二次踩点：2026-06-10 跑 `fetch:video-transcripts --ids=v063,v064,v065` 时，emit 模板把 `video-transcripts.ts` 尾部的 helper 函数整体重写为**旧版**——抹掉了 rule #10 的 zh-tw `toTraditional()` 加固、`convertDigestToTraditional` 和 ko fallback 分支；`check:zh-tw-renderers` 因文件别处仍有 `toTraditional` 字样而漏报（file 级检查盲区），靠 astro check 的类型错误才暴露。已修复：emit 模板 helper 块与 data 文件加固版同步。**教训：emit 模板里嵌的 helper 代码是第二份真相源，改 `src/data/video-transcripts.ts` 尾部 helper 时必须同步改 [fetch-transcripts.ts](scripts/videos/fetch-transcripts.ts) 模板。**

### 9. Transcript 翻译工具选择（关键）

> **🔴 翻译 transcript 文件（debate-transcripts / video-transcripts / speech-transcripts）时，必须用专用的逐 record 翻译脚本，禁止用 `backfill-ko-arrays.ts`。**
>
> 专用脚本：
>
> - `scripts/videos/translate-transcripts-ko.ts` — 视频字幕 Ko
> - `scripts/hansard/translate-debate-transcripts-ko.ts` — 辩论全文 Ko
>
> 这些脚本的设计：每翻完一条 record 立即 `writeFileSync` 写入磁盘 + sha256 缓存。进程挂了不丢工作，重启自动跳过已完成 record。
>
> `backfill-ko-arrays.ts` **不能用于 transcript**——它把所有 record 的段落堆成一个 batch，120 秒超时反复 fallback，没有中间写入，进程一死全部白费。
>
> 运行时必须加超时：`SGAI_LLM_TIMEOUT_MS=300000`（300 秒），默认 120 秒对长段落不够。
>
> **⚠️ String.replace() 陷阱**：注入韩文翻译到 TS 源码时，`recordBody.replace(regex, '$1\n...')` 会把韩文里的 `$1,500` 当成 regex backreference。必须用 arrow function：`replace(regex, (m) => ...)`。

历史踩点：2026-05-23~25 Ko 翻译 session。用错工具（backfill-ko-arrays.ts）导致 5 小时浪费，`$1` backreference bug 导致文件反复损坏，`alreadyDone` regex 跨 record 匹配导致 22 条辩论被静默跳过。详见 [`docs/20260525-ko-translation-postmortem.md`](docs/20260525-ko-translation-postmortem.md)。

### 10. 繁体中文渲染纪律（关键 — 最高优先级）

> **🔴 在 `src/data/` 或 `src/utils/` 写任何 `if (lang === 'zh-tw')` 分支返回 zh 内容时，**必须**经过 [`toTraditional()`](src/i18n/opencc.ts) 或 [`pickLocalized()`](src/i18n/index.ts)。直接 `return rawZhData` 会让 zh-tw 页面渲染简体中文。**
>
> **🔴 新加坡部委 / 机构的官方中文名（MDDI、IMDA、MCCY、MICA、IDA 等）受 [`src/i18n/protected-terms.ts`](src/i18n/protected-terms.ts) `PROTECTED_TERMS` 列表保护。**OpenCC s2twp 默认会把 "信息" → "資訊"、"社区" → "社群"，破坏官方机构名。`PROTECTED_TERMS` 在 OpenCC 转换前后做占位符拦截，保留正确形式。**新增的官方机构名必须加进 `PROTECTED_TERMS`。**
>
> 双层防御：
>
> 1. **源码层**（即时反馈）：`npm run check:zh-tw-renderers` 静态扫 `src/data/` 和 `src/utils/`，找出有 `lang === 'zh-tw'` 但没 `toTraditional` / `pickLocalized` 的文件。挂在 `npm run check` 里，PR 时跑。
> 2. **构建层**（构建后真值校验）：`npm run check:i18n`（带 `--all` 跑所有 5 个 locale）扫 `dist/<lang>/**/*.html` 找异种文字残留。挂在 `npm run check:dist` 里，CI 跑。
> 3. **架构层**（部委名保护）：`npm run check:zh-tw-misconversion` 扫 `dist/zh-tw/**/*.html` 找已知部委名误转 pattern（如 `數字發展與資訊部` → 应为 `數字發展與信息部`）。挂在 `check:dist` 和 weekly evals。
> 4. **单元测试**：[`scripts/lib/__tests__/opencc-protected-terms.test.ts`](scripts/lib/__tests__/opencc-protected-terms.test.ts) 13 测试覆盖 PROTECTED_TERMS pipeline，确保未来重构不破坏保护。
>
> **加新部委名 / sg-specific 词的流程**：
>
> 1. 跑实测验证 OpenCC 默认行为：
>    ```
>    npx tsx -e "import { toTraditional } from './src/i18n/opencc'; console.log(toTraditional('xxx'))"
>    ```
> 2. 如果默认转换破坏了官方名，加进 [`src/i18n/protected-terms.ts`](src/i18n/protected-terms.ts) 的 `PROTECTED_TERMS` 数组，写明 `zh` 简体源 + `zhTw` 保护后的繁体形式。
> 3. 单元测试的 round-trip 测试会自动覆盖新条目。
>
> **加新 zh-tw misconversion eval pattern 的原则**：必须 unambiguous——如果某个错误形式（如 "資訊部"）也可能来自合法的 zh 源（如某些 sg 文档历史上用 "资讯部"），就不要加进 eval `MISCONVERSIONS` 数组。详见 [`scripts/evals/zh-tw-misconversion/check.ts`](scripts/evals/zh-tw-misconversion/check.ts) 顶部 CRITICAL 注释。

历史踩点：2026-05-26 一次性踩到 5 类相关 bug。(1) `getVideoTranscriptParagraphs` 在 zh-tw 分支直接 `return transcript.paragraphs` 漏掉 `toTraditional()`，59 个 `/zh-tw/videos/` 页面 5766 处简体残留。(2) OpenCC s2twp 把 MDDI/IMDA/MCCY 等部委名词组转换破坏（2000+ 处）。(3) mmseg 分词把 "家制造" 分错段，制 不转换。(4) eval 初版用 "資訊部" 当 pattern 引起 false positive（合法 zh 源 "资讯部" 也产生这个输出）。(5) 自己 commit message 的 `summaryEn` 嵌中文，触发 EN 页面 CJK 残留。本规则即此次事故事后加固。

### 11. debate-transcripts 同步（关键 — 最高优先级）

> **🔴 顶层硬规则：`src/data/debates.ts` 里每一条 debate 必须在 `src/data/debate-transcripts.ts` 的 `debateTranscripts` map 里有对应 record，且该 record 的 `paragraphs`（zh，含 CJK）、`paragraphsEn`（原始 Hansard）、`paragraphsJa`、`paragraphsKo` **四条全部非空且段数配平**（Ja/Ko 段数 == zh 段数）。缺 record 或任一为空/段数不齐，`npm run check` 里的 `check:debate-transcripts`（CI 硬门）当场 exit 1；同时详情页 `/<lang>/debates/<id>/` 会丢掉全文区或回落英文。**
>
> 2026-07 起 debate transcript 与 rule #8（video）看齐，四语全强制（Ja/Ko 不再可选）。zh-tw 不入库——`[id].astro` + 数据文件尾部 helper 的 `toTraditional()` 运行时派生（见 rule #10）。
>
> - `paragraphsEn` 放原始 Hansard 英文分段。详情页（`src/pages/[lang]/debates/[id].astro`）的 "Hansard 原文" 区带 `data-i18n-allow-cjk="hansard-original"` + `data-i18n-allow-en` 豁免。
> - `paragraphs`（zh）摘要式分段必须含中文；`paragraphsJa`/`paragraphsKo` 是 zh 的逐段翻译，段数必须等于 zh（gate 校验配平，抓「ko 1 段 vs zh 3 段」这类残缺）。
> - 详情页的「完整译文」区按 lang 取轨（`getDebateTranscriptParagraphs(id, lang)`）：ja/ko 读各自译文，缺失才回落英文原文——**绝不在译文标题下渲染英文**。
>
> **🔴 `fetch:debate-transcripts` 的 emit 已改为 merge 模式（2026-07），但仍需谨慎。** 旧版是全量重写会静默毁掉回填；现在 emit（[fetch-debate-transcripts.ts](scripts/hansard/fetch-debate-transcripts.ts)）**与数据文件 merge**：保留已有 `paragraphsJa`/`paragraphsKo`、拒绝 zh 降级、缺 record 只警告不静默丢。**但两条铁律不变**：
>
> - emit 模板的 `DebateTranscript` interface + 尾部 helper 是**第二真相源**，必须与 `src/data/debate-transcripts.ts` 字节同步（改一处改两处，rule #8 二次踩点）。
> - 补单条仍首选手工插入或逐 record 翻译脚本，别依赖 fetch 全量跑。
>
> 正确补法：
>
> - ✅ 新 record 插入 map 开头，`paragraphs` + `paragraphsEn` 填齐、`paragraphs` 含中文，**绝不动现有条目**。
> - ✅ 补 Ja：[translate-debate-transcripts-ja.ts](scripts/hansard/translate-debate-transcripts-ja.ts)；补 Ko：[translate-debate-transcripts-ko.ts](scripts/hansard/translate-debate-transcripts-ko.ts)（都逐 record 写盘 + sha256 缓存，rule #9 纪律，禁用 `backfill-ko-arrays.ts`）。`SGAI_LLM_TIMEOUT_MS=300000`，串行/低并发。
> - ❌ 禁止「先合 `debates.ts`，下一个 PR 补 transcript」—— `npm run check` 当场 fail，CI block merge。
>
> 强制点：
>
> 1. `npm run check:debate-transcripts`（[check-debate-transcript-i18n.ts](scripts/hansard/check-debate-transcript-i18n.ts)）挂在 `npm run check` 链里。**全量扫**每条 debate：缺 record / 四字段任一空 / `paragraphs` 不含 CJK / Ja·Ko 段数不配平 → exit 1。
> 2. speech transcript 有同款四语全量门 `check:speech-transcripts`（[check-speech-transcript-i18n.ts](scripts/hansard/check-speech-transcript-i18n.ts)），同挂 `npm run check`。
> 3. `.github/workflows/actions.yaml` 的 check job 跑 `npm run check`，CI 硬门。

历史踩点：2026-06-02 给 `debates.ts` 新增 8 条辩论时发现 debate 门缺失。2026-07 项目审计（[docs/20260707-project-audit.md](docs/20260707-project-audit.md)）进一步发现：debate `paragraphsJa` 覆盖为 0、speech ja/ko 各缺 55、长文 ko/zh-tw 各缺 3——根因是「五语言」从来只在标量字段强制，transcript 正文与 post 的门只到 {zh,en} 甚至 {zh}。本轮把四语补齐到零并把 debate/speech/video/post 全部升为四语硬门。

### 12. 数据文件刷新归属（关键 — 最高优先级）

> **🔴 顶层硬规则：任何新增的 `src/data/*.ts` 必须在 [`scripts/refresh/registry.json`](scripts/refresh/registry.json) 有归属——要么是某条 pipeline 的 `targets[]` 成员，要么登记进顶层 `editorial[]`（带 `reason`）。否则 `coverage-audit` eval（weekly evals + CI 硬门）当场 exit 1。**
>
> `scripts/auto_update.py` 只是 dispatcher——它能刷新的范围 = registry 里列的管线。过去"哪个数据文件归哪条管线"只活在人脑和 [`docs/refresh-playbook.md`](docs/refresh-playbook.md) 里，导致两个 bug 类：(1) 新加数据文件/页面 → 零刷新覆盖、没人报警；(2) playbook drift（把 startups/talent/tracker/benchmarking 标成"❌ 无 pipeline"，其实早建好）。现在 registry 的 `targets[]` + `editorial[]` 是**机器校验的单一真相**。
>
> - ✅ 加新管线产物：在该 pipeline entry 的 `targets[]` 里列出它 emit 的 `src/data/*.ts`。
> - ✅ 加纯编辑/派生数据文件（无管线）：在 `editorial[]` 加一条 `{file, reason, owner}`。
> - ✅ 改了某管线的 emit 目标（重命名/拆分数据文件）：同步改 registry `targets`，否则 stale-manifest 断言 fail。
> - ❌ 禁止"先合数据文件，下个 PR 补 registry 归属"——`npm run eval:coverage-audit` 当场 fail，CI block merge。
>
> 强制点：
>
> 1. `npm run eval:coverage-audit`（[scripts/evals/coverage-audit/check.ts](scripts/evals/coverage-audit/check.ts)）**全量扫** `src/data/*.ts`：有 orphan（无归属）或 stale（target/editorial 路径不存在）→ exit 1。
> 2. `.github/workflows/actions.yaml` 的 `check` job 跑此 eval，CI 硬门，PR 不能 merge。
> 3. 挂在 `scripts/evals/run-all.ts` 的 weekly STAGES，cron 也跑，失败自动开 issue。

历史踩点：2026-06-30 审计 `auto_update.py` 覆盖面时发现——它定时能跑，但"全站所有该更新的地方是否都被某条管线覆盖"无任何机器校验，纯靠 registry + playbook 的手工纪律，且 playbook 已 drift。本规则把覆盖从纪律变成 CI 强制门，根除 orphan-data-file 与 manifest-drift 两个 bug 类。

### 13. 多语言渲染禁止二元 lang 逻辑（关键 — 最高优先级）

> **🔴 顶层硬规则：任何 `src/components/` / `src/pages/` / `src/layouts/` 里的组件/页面，禁止把"非 zh 就当英文"的二元逻辑当作多语言渲染路径。sgai 是五语站（zh / en / ja / zh-tw / ko），任何 `lang !== 'zh'` 形态的判断都会把 en / ja / zh-tw / ko 四种语言塌缩成一个"另一种"分支，导致 zh-tw / ko 静默落英文。** Layer E（`npm run eval:source-i18n`，CI 硬门）+ dist 层 `check:i18n --all`（zh-tw marker=error 硬门）双层拦截。
>
> 二元逻辑长这样，全部禁止：
>
> - ❌ `const isEn = lang !== 'zh'` / `const isNonZh = lang !== 'zh'`（**别名名不限** `isEn`/`isZh`，任意标识符赋 `lang !== 'zh'` 都被 Layer E 抓）
> - ❌ `lang === 'zh' ? zh : en` / `lang !== 'zh' ? en : zh` 内联三元渲染文案
> - ❌ `isZh ? ... : ...` / `isEn ? ... : ...` / `isJa ? ... : ...` / `isNonZh ? ... : ...` 三元渲染文案
> - ❌ `COPY[lang] ?? COPY.en` 这类 fallback map——COPY 对象字面量缺 `ja:` 或 `ko:` 键，或文件对 zh-tw 无显式处理（`'zh-tw'` 分支 / `toTraditional` / `deepToTraditional`）
>
> 布尔判断只允许**等值形式**（`lang === 'en'` / `lang === 'zh'`），且只用于单语种路由（`if (lang === 'ja') formatJaDate()`），不得当"其余都是英文"用。
>
> UI 文案三选一：
>
> 1. `t(lang, key)` —— 全语言字典（[src/i18n/index.ts](src/i18n/index.ts)）
> 2. `pickLocalized(record, 'field', lang)` —— 数据字段自动按 lang 选 sibling（含 zh-tw OpenCC）
> 3. 页面本地 `Record<Lang, …>` COPY —— **必须**声明全部 authored locale（`zh` / `en` / `ja` / `ko`），zh-tw 用 `toTraditional(zh)` / `deepToTraditional(zh)` 派生，绝不落 en
>
> 🔴 **zh-tw 页面出现英文正文（非注册的原文引用 / 品牌名）一律是 bug**——zh 源永远存在，正确路径是 OpenCC 运行时转换。`ko → en` / `ja → en` fallback 是设计内的，但**条件必须精确到** `lang === 'ko'` / `lang === 'ja'`，绝不能用 `!== 'zh'` 连带把 zh-tw 也扔进 en 分支。
>
> `data-i18n-allow-en` / `data-i18n-allow-cjk` marker 只允许 [scripts/lib/i18n-allow-reasons.mjs](scripts/lib/i18n-allow-reasons.mjs) 注册过的 reason。EN-fallback 类 reason（`*-en-fallback`）注册为**仅 ko**；一旦出现在 zh-tw 页面即 marker-violation，**zh-tw 上 marker=error 硬门**（无 baseline 豁免）。
>
> 🔴 **`langs: 'all'` 的 6 个 verbatim reason 是受信任边界（信任逃生舱）**——hansard-original / hansard-transcript-verbatim / speech-verbatim-source / video-transcript-verbatim / citation-original / debate-title-original。它们包住的内容在**所有 locale**都被 scanner 直接剥离且**不记 marker-violation**，等价于 `dangerouslySetInnerHTML`：scanner 无法分辨里面是真·Hansard 原文还是有人为了消音塞进去的编造英文。**只允许包真·逐字原文**（Hansard 英文、MDDI 演讲 / 视频原文、参考文献引文）；**严禁**拿它洗白组件/字段的 fallback 泄漏（那是 `*-en-fallback` ko-only reason + zh-tw marker=error 的职责，别绕过 ratchet）。**新增 all-locale reason，或把现有 reason 放宽成 `'all'`，必须：(a) 在 PR 说明为何内容确属逐字原文；(b) 更新注册表单测 [scripts/lib/\_\_tests\_\_/i18n-allow-reasons.test.ts](scripts/lib/__tests__/i18n-allow-reasons.test.ts)**（该测试 pin 死每个 reason 的 attr + langs，任何静默改动即 fail，逼你走 review）。
>
> 数据层：base 字段（`title` / `summary` / `description` / `headline` / `tagline`）禁止 EN-only（并入 rule #5），gate = `i18n-pair --en-only-base`（**已覆盖全部 `src/data/*.ts`**——`check:i18n-completeness` 改用 `--data-dir=src/data` 目录扫描，新数据文件自动纳入，不再靠手维护文件列表）。
>
> 双层防御：
>
> | 层      | 命令 / 时机                                          | 抓什么                                                                                                                            | severity                                           |
> | ------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
> | 源码层  | `npm run eval:source-i18n`（Layer E，PR check job）  | `isZh`/`isEn`/`isJa`/`isNonZh` 三元 + **任意别名** `binary-lang-alias` + `copy-missing-locale`（COPY 缺 ja/ko 键或无 zh-tw 处理） | baseline=0，新增即 fail                            |
> | dist 层 | `npm run check:i18n --all`（PR build job，需 build） | zh-tw / ko / ja / zh 页面的 enSentence 残留 + marker-violation                                                                    | zh-tw marker=**error 硬门**；enSentence 全 ratchet |
> | Layer D | `npm run eval:i18n --layer=all`（weekly cron）       | 4-locale sitemap / hreflang parity + 语言纯度                                                                                     | weekly issue                                       |
>
> 为什么 enSentence 是 ratchet 而非 error：zh 基准 locale **合法含英文引文**（辩论 MP 原话、政策官员 quote、博客脚注参考文献 ↩、单语博客长文），OpenCC 原样带到 zh-tw。强行归零要给每条引文包 marker（大量内容工程）。ratchet 拦任何新增泄漏——这正是 242-bug 会被拦下的机制；存量由 weekly issue 烧。而 marker-violation 不同：`*-en-fallback` marker 注册为 ko-only，出现在 zh-tw 上永远是 bug，且已归 0，所以翻 error 不误伤。

历史踩点：2026-07 一次系统治理——zh-tw 页面大量英文 fallback。根因三类：(1) `const isEn = lang !== 'zh'` 二元逻辑（150+ 处）把 zh-tw / ko 塌缩进 en 分支；(2) `data-i18n-allow-en` marker 遮蔽 dist 检查（242 处 ko-only marker 泄漏到 zh-tw）；(3) methodology / evolution 两页用 `const isNonZh = lang !== 'zh'` / `COPY[lang] ?? COPY.en`（缺 ja/ko 键）逃过当时只认 `isEn`/`isZh` 别名和只查缺 `ja` 键的 Layer E。修复 = 全面 `pickLocalized` / `t` 化 + Layer E 升 5 语并 widen（`binary-lang-alias` 认任意别名、`copy-missing-locale` 要求 ja+ko 键+zh-tw 处理）+ zh-tw marker-violation 翻 error 硬门。本规则即此次治理的事后加固。

## 项目结构

```
src/
├── components/widgets/   # Astro 组件
├── content/config.ts     # 内容集合配置 (博客文章 schema)
├── data/
│   ├── post/             # Markdown 博客文章
│   ├── frontpage.ts      # 首页头条编辑指针（FEATURED）
│   ├── debates.ts        # 国会辩论数据
│   ├── policies.ts       # 政策文件数据
│   ├── timeline.ts       # 时间线数据
│   └── ...               # 其他数据文件
├── navigation.ts         # 导航菜单配置
├── version.ts            # 版本号和更新日期
├── pages/                # 页面路由
└── layouts/              # 布局组件
```

## 发布流程

1. 修改内容 / 代码
2. 运行 `npm run check` 确认通过
3. 更新 `src/version.ts` 中的版本号和日期
4. 提交并推送到 main 分支，`.github/workflows/deploy.yaml` 自动构建部署（连发多个合并时后来的 push 自动取消排队中的旧构建，只部署最新 commit；不想触发构建的提交在 commit message 加 `[CI Skip]`）

## 内容管理

### 添加博客文章

在 `src/data/post/` 下创建 `.md` 文件，frontmatter 格式：

```yaml
---
publishDate: 2026-03-20
title: '文章标题'
excerpt: '摘要文字'
category: '观点'
tags:
  - 标签1
  - 标签2
author: '新加坡 AI 观察'
---
```

### 更新导航

- 头部/底部导航：`src/navigation.ts`
- 首页头条：`src/data/frontpage.ts`（FEATURED 指针；null = 回落最新博文）；域名目录卡片与"最近更新"均从各数据文件 addedAt 派生，无需手动维护

## 国会辩论数据更新（Hansard Pipeline）

### SPRS API 使用要点

**API 端点**：`POST https://sprs.parl.gov.sg/search/getHansardTopic/`，JSON body `{"id": "{report_id}"}`（2026-08 起 id 必须放 body；只放 query string 每个 id 都返回 400，扫描会静默得到 0 条）

**响应格式是字典，不是列表**：

```typescript
// ✅ 正确解析
const data = resp.json(); // { resultHTML: {...}, resultData: null }
const rh = data.resultHTML; // { title, sittingDate, content, reportType, ... }
const title = rh.title;
const date = rh.sittingDate; // 格式 "12-2-2026" (DD-M-YYYY)

// ❌ 错误 — 不要把响应当列表处理
// data[0].title  ← 会返回 undefined，误判为"empty"
```

**调用外部 API 前，先用一个已知有效的 ID 验证响应结构**，不要假设格式。

### Report ID 范围与规律

- `oral-answer-XXXX`：4000+ 区间（2026 年数据约 4023–4088）
- `written-answer-XXXXX`：21000+ 区间（注意是五位数！不要去扫 5000 区间）
- `written-answer-na-XXXXX`：「口头质询时间内未及答复、改书面答复」的独立 id 家族（reportType "Written Answers to Questions for Oral Answer Not Answered by End of Question Time"），与 written-answer 共用号段但互不重叠。2026-08-04/05 会期 14 条 AI 相关条目全在这一族，只扫 written-answer 永远看不到
- `budget-XXXX`：2800+ 区间
- `cos-{ministry}-{year}`：如 `cos-moh-2026`（HTTP 400 表示不存在）
- Hansard 发布有延迟，一般 sitting 后数周才上线；written answers 通常比 oral 更晚发布

### 更新流程

1. 从已知最高 ID 开始向上扫描（检查 `debates.ts` 中现有 `sourceUrl` 获取最高 ID）
2. 先用 1 个已知 ID 验证 API 响应结构
3. 批量扫描新 ID，提取 AI 相关条目（关键词：artificial intelligence, AI, deepfake, data centre, machine learning 等）
4. 对 AI 相关条目生成中英文摘要、分析数据，写入 `debates.ts`
5. 同步更新 `DEBATE_STATS`（total、byYear、byType、byTopic、topSpeakers）
6. 同步更新 debates 页面的"数据更新"日期、首页辩论数量、README 中的数字

### 现有脚本与工具

**Python Pipeline**（`scripts/hansard/`）— 完整的 5 步数据管线：

| 脚本                     | 功能                         | 依赖           | 备注                                  |
| ------------------------ | ---------------------------- | -------------- | ------------------------------------- |
| `01_discover_debates.py` | 通过 PAIR Search 发现报告 ID | Playwright     | 使用 `search.pair.gov.sg` 语义搜索    |
| `02_fetch_debates.py`    | 从 SPRS API 获取辩论全文     | requests       | 可直接用 API 替代（见上文 API 要点）  |
| `03_enrich_debates.py`   | AI 生成中文摘要              | OpenAI API key | **需 API key**，Claude 可直接完成此步 |
| `04_analyze_patterns.py` | AI 分析政策模式              | OpenAI API key | **需 API key**，Claude 可直接完成此步 |
| `05_generate_ts.py`      | 生成 `debates.ts`            | 无             | 从 JSON 生成 TypeScript 数据文件      |

**Python 虚拟环境**：`/tmp/hansard-venv`（如不存在需重建）

```bash
python3 -m venv /tmp/hansard-venv
source /tmp/hansard-venv/bin/activate
pip install requests playwright beautifulsoup4
```

**实际操作方式**：步骤 1-2 可通过直接调用 SPRS API 替代脚本，步骤 3-4 由 Claude 直接完成（无需 OpenAI API），步骤 5 可手动编辑 `debates.ts`。即：可以完全跳过 Python 脚本，直接用 API + Claude 完成全流程。

### 快速 API 扫描脚本模板

下面是经过验证的 Python 扫描脚本，可直接复用：

```python
import requests

def scan_ids(prefix, start, end):
    """扫描 SPRS 报告 ID 并返回有数据的条目"""
    results = []
    for i in range(start, end):
        rid = f'{prefix}-{i}'
        resp = requests.post(
            'https://sprs.parl.gov.sg/search/getHansardTopic/',
            headers={'Content-Type': 'application/json'},
            json={'id': rid}, timeout=10)
        if resp.status_code == 200:
            rh = resp.json().get('resultHTML')
            if rh and rh.get('title'):
                results.append({
                    'id': rid,
                    'date': rh['sittingDate'],
                    'title': rh['title'],
                    'content': rh.get('content', ''),
                })
    return results

# 用法：scan_ids('oral-answer', 4088, 4120)
```

## Voices 三无人物补全 Pipeline

`src/data/people.ts` 里有大量"三无"人物（无国会发言、无政策、无视频）。靠继续加指标解决不了——根因是缺内容。我们对 `Person` 增加了 4 个可选字段：

- `signatureWork` — 主导/owned 项目（3–5 条上限）
- `notableQuotes` — 公开 pull-quote（带 sourceUrl + date）
- `speakingRecord` — 近期演讲记录
- `externalRoles` — 跨机构身份（board / WG chair / 国际理事会）

字段任一非空时，voice profile 页（zh + EN）自动展示对应分区，靠 [`src/components/widgets/PersonContributions.astro`](src/components/widgets/PersonContributions.astro) 渲染。每条都要 `*En` 兄弟字段，否则 EN 页面回退到 zh 内容。

### 工具：`scripts/voices/prospect-stubs.mjs`

半自动 review-queue 工具（不直接爬，只做脚手架）。

```bash
# 1. 列出当前所有"三无但有真实角色"的人物
npx tsx scripts/voices/prospect-stubs.mjs list [--limit 25]

# 2. 为指定人物或 top N 生成 prospect JSON 文件
npx tsx scripts/voices/prospect-stubs.mjs queue luke-ong leslie-teo
npx tsx scripts/voices/prospect-stubs.mjs queue --top 10

# 3. 查看 review queue 状态
npx tsx scripts/voices/prospect-stubs.mjs status

# 4. apply（把已 ready 的 prospect 转成 TS 片段，stdout 输出，手动粘贴到 people.ts）
npx tsx scripts/voices/prospect-stubs.mjs apply luke-ong

# 5. sync-from-people（反向同步：从 people.ts 把 live 字段倒灌回 prospect JSON，
# 当你直接在 people.ts 编辑而绕过 JSON 时用）
npx tsx scripts/voices/prospect-stubs.mjs sync-from-people [<id>...] [--dry-run]
```

文件生成在 `scripts/voices/data/prospects/<id>.json`，状态 `pending → ready → applied`。每个 prospect 文件包含：

- 人物基础信息 + currentSummary
- 预生成的 `searchQueries`（含 `site:` 限定的白名单源）
- `whitelistedSources` 列表（aisingapore.org / imda.gov.sg / govinsider.asia / e27.co / channelnewsasia / scai.gov.sg / sicw.gov.sg / 各大学等）
- 待填充的 `signatureWork[]` / `notableQuotes[]` / `speakingRecord[]` / `externalRoles[]`
- `notes` 字段记录 reviewer 备注

### 标准操作流程

1. `prospect-stubs.mjs list` 看 backlog
2. `prospect-stubs.mjs queue --top N` 批量生成 review 文件
3. 把 prospect 文件交给 Claude（或自己），跑文件里的 `searchQueries`，把结果按 schema 填进去（每人 5–10 分钟）
4. 设 `status: "ready"`
5. `prospect-stubs.mjs apply <id>` 取 TS 片段 → 粘到 `src/data/people.ts` 对应 record
6. 设 `status: "applied"`、记录 `appliedAt`
7. 每季度跑一次，让活跃人物档案保持新鲜

**入选门槛**：`signatureWork` 只收公开 attribution 明确的 owned 项目（AISG/IMDA 等官方把人列为 lead/co-lead）。学术 CV 大部分跟"新加坡 AI 战略/生态"无关，不要无脑搬。

### 已知 friction（待改进）

- `apply` CLI 一次只处理一个人，5 人小批可以，19 人批量时 19 次 `apply` + 19 次粘贴会很乏味——下次可以加一个 `apply --all` 模式直接改 people.ts（找每个 person record 的 channels 数组结尾作为 anchor 插入）。**对策**：批量场景下可以反过来用 `sync-from-people` —— 先在 people.ts 直接写，再倒灌回 JSON，省掉 paste 环节。
- 每个 prospect JSON 都重复存 ~20 行 `whitelistedSources`，纯粹冗余。可以让脚本只在文件顶部留一个引用，或者干脆删掉这字段（白名单已经体现在 `searchQueries` 的 `site:` 限定里）。
- 没有 `validate` 命令检查 `*En` 兄弟字段是否齐全——目前漏写英文版本会导致 EN 页面回退到中文。

## 数据刷新基建（Refresh Pipelines）

**新加 / 更新某个页面数据前，先读 [`docs/refresh-playbook.md`](docs/refresh-playbook.md)**——里面是每个页面（25+）的数据来源、当前 pipeline 状态、更新命令的完整索引。

设计原则统一：每条管线都是 **抓取 → 翻译 → 生成 TS** 三段式，state 持久化在 `scripts/data/last_scan_state.json`，由 `scripts/auto_update.py`（cron 入口）调度。i18n 双字段（`*En` 兄弟字段）强制，`npm run build && node scripts/i18n-check.mjs` 是 PR 准入门槛。

### 已建管线（registry-driven）

调度入口：`python3 scripts/auto_update.py --schedule=<weekly|monthly|quarterly|half-yearly>`，由 `scripts/refresh/registry.json` 决定每个 schedule 跑哪些管线。所有新管线（type=tsx）流程统一：scan → AI 摘要 → emit → auto-commit → push → `gh pr create` → 邮件附 PR 链接。

| 域                              | 命令入口                                                                                                                 | 频率       | 模式                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------- |
| Hansard 国会辩论                | `python3 scripts/auto_update.py --only=hansard`                                                                          | 周         | scan-email                                                       |
| YouTube 视频                    | scan: `python3 scripts/auto_update.py --only=videos`<br/>emit: `npx tsx scripts/refresh/videos/emit.ts --ids=<videoIds>` | 周         | scan-email + 手动 emit auto-PR                                   |
| 部委演讲 (MDDI/MAS/PMO/MOH/MOE) | `python3 scripts/auto_update.py --only=voices`                                                                           | 周         | **auto-PR**（三源统一只收 ≥2026-01-01 新内容，拒绝缓存防 stall） |
| Voices 三无人物                 | `npx tsx scripts/voices/prospect-stubs.mjs {list,queue,apply,sync-from-people}`                                          | 季（手动） | 半自动 review queue                                              |
| **GitHub stars**                | `npx tsx scripts/refresh/github-stars.ts [--bump-version]`                                                               | 月         | **auto-PR**                                                      |
| **Policies**                    | `npx tsx scripts/refresh/policies/run.ts --limit=5`                                                                      | 月         | **auto-PR**                                                      |
| **Ecosystem**                   | `npx tsx scripts/refresh/ecosystem/run.ts --limit=5`                                                                     | 月         | **auto-PR**（条目带 `_pendingReview: true`，listing 隐藏）       |
| **Levers**                      | `npx tsx scripts/refresh/levers/run.ts --limit=3`                                                                        | 季         | **auto-PR**（入 lever 1 "Auto-discovered" 子组待移位）           |
| **Startups**                    | `npx tsx scripts/refresh/startups/run.ts --limit=3`                                                                      | 季         | **auto-PR**（入 `autoDiscovered[]`）                             |
| **Legal-AI**                    | `npx tsx scripts/refresh/legal-ai/run.ts --limit=3`                                                                      | 半年       | **auto-PR**（入 "Auto-discovered" section 待移位）               |
| **Talent**                      | `npx tsx scripts/refresh/talent/run.ts --limit=3`                                                                        | 半年       | **auto-PR**（入 `autoDiscovered[]`）                             |
| **Tracker**                     | `npx tsx scripts/refresh/tracker/run.ts --limit=3`                                                                       | 半年       | **auto-PR**（入 `autoDiscovered[]`）                             |
| **Benchmarking**                | `npx tsx scripts/refresh/benchmarking/run.ts --limit=3`                                                                  | 半年       | **auto-PR**（仅追踪新报告，数字仍需手工提取）                    |

详见 [docs/refresh-playbook.md](docs/refresh-playbook.md) per-page 命令清单。

### 共享原语 `scripts/lib/`（全部已建，57 单元测试覆盖）

`npm run test:lib` 跑测试。新管线**强制**用这些原语，不要自己重新写 OpenAI/git/fetch 调用。

- `lib/translate.ts` — OpenAI zh↔en 翻译，sha256 缓存
- `lib/state.ts` — last_scan_state.json R/W（兼容 legacy schema）
- `lib/i18n-pair.ts` — `*En` 配对校验，CLI: `npm run i18n-pair <files>`
- `lib/auto-commit.ts` — `autoCommit() / pushAndOpenPR() / buildPRBody()`，安全 git + `gh pr create`
- `lib/github-stars.ts` — GitHub repo 元数据
- `lib/sprs-api.ts` — Hansard SPRS connector
- `lib/gov-fetch.ts` — 通用 .gov.sg HTML + sitemap 抓取
- `lib/ai-summarize.ts` — 双语 AI 摘要 + 闭集分类 + confidence
- `lib/auto-discovered-emit.ts` — 通用 `autoDiscovered[]` 数组追加器（schema 复杂的数据文件用，比如 talent / startups / benchmarking / tracker）
- `_shared/run-template.ts` — scan + AI 摘要 + auto-discovered 追加 + auto-PR 的复用 orchestrator，新加同模式管线只需 ~30 行配置

### auto-PR 流程（Luca 视角）

1. cron 跑到 → 管线 scan + AI 摘要 → emit 写 .ts → 自动 commit 到 `data-refresh/<domain>/<date>` 分支
2. 自动 push + `gh pr create`，PR 描述含 diff stat / 新条目清单 / confidence 分布 / 失败源
3. 收到邮件：`[sgai] data-refresh: <domain> +N entries — review PR #123`，正文带 PR 链接
4. 在 GitHub UI 上 Approve & Merge → Cloudflare 自动重新构建上线
5. \_pendingReview 条目：合并前在 PR 改 `_pendingReview: true → false`（或删字段），listing 立刻显示

### gh CLI / claude CLI 准备（无需 OpenAI / SMTP）

详细一步步看 [scripts/SETUP.md](scripts/SETUP.md)，跑 `bash scripts/doctor.sh` 体检。

```bash
gh auth login                                    # PR 创建 + Issue 通知（@assignee）
which claude && claude --version                 # AI 摘要 + 翻译走本地 claude CLI
echo 'export GITHUB_TOKEN=ghp_xxx' >> ~/.zshrc   # 可选，github-stars 5000 req/h
```

**通知零配置**：所有 PR 自动 `--assignee @me`；scan-only 旧管线（hansard/videos/voices）有新内容时调 `gh issue create --assignee @me`。GitHub 原生送邮件 + web 通知。

### Agent 接入（skill 的发布链路）

`skill/`（`SKILL.md` + `url-map.json` + `README.md`）是**唯一真相源**，进 git、走 review。`public/skill/` 是 `prebuild` / `predev` 时由 [scripts/publish-skill.mjs](scripts/publish-skill.mjs) 拷出来的产物，已 gitignore——**永远不要改 `public/skill/`**，改了下次构建就被覆盖。线上安装地址是 `https://sgai.md/skill/SKILL.md`。

- 改了 `policies.ts` / `debates.ts` 的条目集合：跑 `npm run skill:build-url-map` 回填 `url-map.json` 的 `validIds`，提交生成结果。
- 改了 `url-map.json` 的任何 URL：跑 `npm run check:skill-urls`（联网，逐条 HEAD）。weekly evals 也跑（`run-all.ts` 的 `skill-urls` stage）。
- URL 形状铁律：**EN 在裸路径，其余四语在 `/<lang>/` 前缀**（`/policies` vs `/zh/policies`）。2026-08 之前整份 url-map 和 SKILL.md 的 URL 表把 zh / en 写反了。
- 面向人的入口是 `/agent/`（[src/components/agent/AgentPage.astro](src/components/agent/AgentPage.astro)）；页内的 curl / URL / JSON 样例必须包在 `<div data-i18n-allow-en="agent-api-sample">` 里（marker tag 只认 section/div/article/details/aside/p/span，`pre`/`code` 不算），且样例本身必须纯 ASCII。
- 面向机器的契约是 [public/openapi.json](public/openapi.json)（线上 `https://sgai.md/openapi.json`，手写、OpenAPI 3.0）。七个 GET 路径（六个 JSON + `debates.csv`）全在里面。改了 `src/pages/data/*.ts` 的行结构就要同步改它，并跑 `npx @redocly/cli@latest lint public/openapi.json`。所有 `/data/*.json` 共用 [src/utils/data-export.ts](src/utils/data-export.ts) 的信封（`schemaVersion` / `license` / `count` / `items`），每行带 `links.sgai` 五语页面地址；构建产物层由 `check:data-export` 把门。

### 添加新管线的 6 步流程

1. `mkdir -p scripts/refresh/<domain>/data/{raw,summaries}`
2. 复制 `scripts/refresh/policies/` 全套（sources.ts + scan/enrich/emit/run.ts）改字段
3. 在 `scripts/refresh/registry.json` 加一行（type/schedule/script/args/mode）
4. dry-run：`npx tsx scripts/refresh/<domain>/run.ts --dry-run --limit=2`
5. e2e：去掉 `--dry-run` 跑一次，验证 PR 自动开
6. PR 前必跑：`npm run check && npm run build && node scripts/i18n-check.mjs`

CLI 必须支持：`--dry-run / --limit=N / --no-commit / --no-push`

## 部署

独立部署在 Cloudflare Pages，绑定 `sgai.md`。

**部署链路（2026-07-05 起）**：push main → `.github/workflows/deploy.yaml` 在 GitHub Actions 构建（`npm run build` → `check:dist` 门 → `wrangler pages deploy dist`）。要点：

- **`concurrency: cancel-in-progress`**：连发多个 commit 时自动取消被淘汰的构建，只部署最新——根治「9 个合并排 9 个全量构建」的队列放大（2026-07-04 v0.20 发版实测近 2 小时）。
- **Astro 资产缓存**（`node_modules/.astro`）跨构建复用，YouTube 缩略图等远程资源不用每次重拉。
- **HTML 不做构建期 minify**（astro.config `compress.HTML: false`）：Cloudflare 边缘本来就对 HTML 做 brotli 压缩，构建期 minify 曾占单次构建约 3 分钟，纯重复劳动。CSS/JS 压缩保留。
- **cutover 状态**：secrets（`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`）未配置时 deploy workflow 只构建验证、跳过部署，旧的 Cloudflare git-integration 构建继续生效。切换步骤见 deploy.yaml 文件头注释（需新建 direct-upload 项目 + 迁移自定义域名，git-connected 项目不接受 wrangler 直传）。

CI gating 由 `.github/workflows/actions.yaml` 承担：`build` job（Node 22 单版本，仅 PR 时跑——main 上 deploy.yaml 会再构建，避免重复）+ `check` job（源码级检查 + 各 eval 门，PR 和 main 都跑）。

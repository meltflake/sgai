# sgai.md 完整测试用例（v0.11.0）

> 日期：2026-05-05
> 站点版本：`0.11.0`（src/version.ts）
> 站点 URL：https://sgai.md/
> 测试视角：内部维护者（Internal）+ 完全外部用户（External）+ 搜索/LLM crawler
> 优先级：**P0** 上线阻断；**P1** 必修；**P2** 应修；**P3** 加分项
>
> 本计划基于实地审计的 **22 个 data 文件 / 85 个组件 / 79 个路由 / 22 个 scripts** 编写，校正了 docs 里若干已过时数据。

---

## 0. 项目实地基线（测试人员速查）

### 0.1 路由总览（含双语镜像）

- **EN root 39 routes**（`src/pages/`，排除 `/zh/` 子树）
- **ZH 40 routes**（`src/pages/zh/`，多 1 个 blog `[category]` / `[tag]` 路由）
- **12 个详情页 collection**（debates / policies / levers / ecosystem / legal-ai / startups / talent / videos / voices / speeches / community-opensource / opensource）— 每个都有完整 ZH 镜像
- **Blog 不对称**（设计意图）：EN 用 `[...blog]/index.astro` catch-all；ZH 用三套 `[...page]` + `[category]/[...page]` + `[tag]/[...page]`
- **特殊端点**：`/rss.xml.ts` `/zh/rss.xml.ts` `/updates.rss.xml.ts` `/zh/updates.rss.xml.ts` `/llms.txt.ts` `/llms-full.txt.ts` + Astro 自动生成的 `/sitemap-index.xml`
- **错误页**：`src/pages/404.astro`（EN）+ `src/pages/zh/404.astro`（ZH，独立文件）

### 0.2 数据文件实际记录数（从代码读出）

| 文件 | 主接口 | 数量 |
|---|---|---|
| `debates.ts` | `Debate` | **153** |
| `videos.ts` | `VideoItem` | **63** |
| `voices.ts` | `Institution` / `MddiSpeech` | 80+ 人物 |
| `policies.ts` | `Policy` | ~20 |
| `levers.ts` | `Lever` | 6 抓手 / 111 LeverItems |
| `ecosystem.ts` | `EcosystemCategory` | 9 类 / ~40 实体 |
| `legal-ai.ts` | `LegalSection` | ~30 |
| `startups.ts` | `Startup` / `Unicorn` | ~40 |
| `talent.ts` | `TalentProgramme` | ~20 |
| `benchmarking.ts` | `RegionSummary` / `BenchmarkCase` | 23 regions / 12 cases / ~160 drilldowns |
| `community-opensource.ts` | `OpenSourceProject` | ~150（高校/企业/创业三类） |
| `tracker.ts` | `Dimension` | 6 维度 |
| `opensource.ts` | `OfficialOpenSourceProject` | ~20 |
| `people.ts` | `Person` | 31 真人 + 213 MP stub |
| `timeline.ts` | `TimelineEvent` | 13 顶级条目 |
| `updates.ts` | `Update` | 12 类型 schema + 数十条 |
| `references.ts` / `fieldnotes.ts` | — | 自研 |
| `debate-transcripts.ts` | `DebateTranscript` | 14 MB（150+ 场） |
| `video-transcripts.ts` | — | 1.4 MB |
| `speech-transcripts.ts` | — | 1.2 MB |
| `mp-stubs.json` | — | 213 条 |

### 0.3 i18n 路由架构（v0.11.0 翻转后）

```ts
// src/i18n/index.ts
ROUTE_DEFAULT_LOCALE = 'en'   // 路由默认：EN URL 不带前缀
DEFAULT_LOCALE       = 'zh'   // 数据默认：裸字段是 zh，*En 兄弟字段是英文
LOCALES              = ['zh', 'en']
FALLBACK_CHAINS      = { zh: ['zh'], en: ['en', 'zh'] }
```

> **关键陷阱**：Astro 原生 `i18n` 配置在 `astro.config.ts` 是**关闭**的。每个页面、每个共享组件都必须自己 `getLangFromPath()` 推断 lang。

### 0.4 实际的 npm scripts（来自 package.json）

```bash
# 校验（CI 必跑）
npm run check                      # = check:astro + check:eslint + check:prettier
                                   #   + check:graph + check:video-transcripts
                                   #   + check:debate-transcripts + test:lib
npm run check:i18n                 # node scripts/i18n-check.mjs（不在 check 里！手动跑）
npm run check:skill-urls           # tsx scripts/skill-url-check.ts

# 测试
npm run test:lib                   # 9 个 lib 单元测试，Node 原生 --test runner

# 数据
npm run fetch:video-transcripts
npm run translate:video-transcripts
npm run fetch:debate-transcripts
npm run translate:debate-transcripts
npm run refresh:github-stars       # 8 条 auto-PR pipeline 之一

# 构建
npm run dev      # astro dev
npm run build    # astro build（含 Pagefind 索引；Pagefind 仅 build 后可用）
npm run preview  # astro preview
```

### 0.5 已有测试覆盖（9 个 lib 测试文件 / 65 个 test cases，无 E2E）

```
scripts/lib/__tests__/
├── ai-summarize.test.ts
├── auto-commit.test.ts
├── github-stars.test.ts
├── gov-fetch.test.ts
├── i18n-pair.test.ts
├── llm.test.ts
├── sprs-api.test.ts
├── state.test.ts
└── translate.test.ts
```

`npm run test:lib` 跑出 **65 tests pass**（每个文件多个 `test()` 调用）。

> **缺口**：无页面渲染 E2E、无可视回归、无数据→页面集成测试、无 Cloudflare 重定向测试（_redirects 在 astro preview 不模拟）。这正是本计划要补的"手测+脚本组合"。

### 0.6 实际重定向规则（public/_redirects 全文 13 行）

```
/sitemap.xml      /sitemap-index.xml  301
/people/:id       /voices/:id          301
/people           /voices              301
/en/people/:id    /voices/:id          301      # 必须在 /en/* catch-all 之前
/en/people        /voices              301
/en/*             /:splat              301
/en               /                    301
```

### 0.7 Astro 集成（astro.config.ts）

`@astrojs/tailwind`、`@astrojs/sitemap`（含 hreflang alternates）、`@astrojs/mdx`、`astro-icon`、`@astrojs/partytown`（按需）、`astro-compress`、`astro-pagefind`、`astrowind` 自定义 vendor。`trailingSlash: 'always'` + `build.format: 'directory'`。

### 0.8 i18n-check.mjs 实际机制（来自源码）

- 扫 `dist/<lang>/**/*.html`（EN 默认 `dist/`，跳过 `zh/` 子目录；ZH 扫 `dist/zh/`）
- 剥离 `<script>` `<style>` `<template>` `<head>` `<!-- -->` 和所有 HTML 标签 + 属性
- **任何带 `data-i18n-allow-cjk="reason"` 的 `<section>` `<div>` `<article>` 整块跳过**（用于 hansard-original 引用、ecosystem 待批量翻译块）
- EN allowPatterns：`['中文版可用', '阅读中文版', '中']`（仅 LangBanner / Toggle 三个 UI 字符串）
- 命中即 exit 1

---

## 1. 测试分组与命名

- **A** 构建 / CI / 工具链
- **B** i18n 路由与字段
- **C** 数据契约与一致性
- **D** 页面渲染（D.1 ~ D.20，按栏目）
- **E** SEO / 结构化数据 / 元信息
- **F** UX / 交互 / 搜索
- **G** 跨实体关联（Graph + RelatedRail）
- **H** 性能 / 可访问性 / 移动端
- **I** Refresh Pipelines（自动数据更新）
- **J** Transcript（视频 + 国会辩论）
- **K** Fresh-Eye 端到端用户旅程
- **L** 发布前 Smoke
- **M** 缺陷分级
- **N** 已知历史限制
- **O** 覆盖率自检

---

## A. 构建 / CI / 工具链（内部 — P0）

| ID | 用例 | 执行 | 预期 | 优先级 |
|---|---|---|---|---|
| A-01 | `npm run check` 全量 | `npm run check` | 7 子任务 0 错（astro / eslint / prettier / graph / video-transcripts / debate-transcripts / test:lib） | P0 |
| A-02 | `npm run check:i18n` 不在 check 内 | 单独跑 `node scripts/i18n-check.mjs` | EN 0 中文残留；exit 0 | P0 |
| A-03 | ZH 残留扫描 | `node scripts/i18n-check.mjs --lang zh --root dist/zh` | 接受英文人名缩写；不强制阻断（无 LANG_CONFIG.zh，会 exit 2 报"No config"——这是已知行为，本用例验证此前提） | P1 |
| A-04 | TypeScript 严格 | `astro check` | 0 错；新代码禁 `as any` | P0 |
| A-05 | Prettier 全量 | `npm run check:prettier` | 0 文件需要格式化 | P0 |
| A-06 | ESLint `no-irregular-whitespace` | `npm run check:eslint` | 数据文件 0 个 NBSP / 全角 / 零宽空格 | P0 |
| A-07 | Astro JSX 注释规范 | grep `<!--` in `.astro` JSX 表达式 | 0 命中（必须用 `{/* */}`） | P0 |
| A-08 | `tsconfig.json` 排除 `scripts/out/` | `cat tsconfig.json` | 含 `"exclude": [..., "scripts/out/**"]`；防止 tsserver OOM | P0 |
| A-09 | `npm run check:graph` 外键 | `tsx scripts/verify-graph.ts` | `relatedPolicyIds / personIds / leverNumber / relatedDebateIds` 全部 lookup 命中 | P0 |
| A-10 | `npm run test:lib` 9 个测试 | 跑 `scripts/lib/__tests__/*` | 9 个 test 文件全 pass | P0 |
| A-11 | `npm run check:video-transcripts` | `tsx scripts/videos/check-transcript-i18n.ts` | 每个 video 的 `paragraphs` / `paragraphsEn` 配对 | P0 |
| A-12 | `npm run check:debate-transcripts` | `tsx scripts/hansard/check-debate-transcript-i18n.ts` | 每场辩论同时有英文原文 + 中文译文 | P0 |
| A-13 | i18n-pair CLI 配对校验 | `npx tsx scripts/lib/i18n-pair.ts src/data/*.ts` | 每个 user-visible zh 字段都有 `*En` 兄弟；缺失必须有 `// i18n-allow-unpaired` 注释 | P0 |
| A-14 | sourceUrl 真实性 | `npx tsx scripts/check-benchmarking-urls.ts` | 所有 `analysisSources[].url` HEAD 200/3xx；4xx/5xx（除 401/403/429）退码 ≠0 | P0 |
| A-15 | 构建可重复 | 连续两次 `NODE_OPTIONS=--max-old-space-size=4096 npm run build` | 第二次 < 150s；输出页面数一致 | P1 |
| A-16 | 构建产物体积 | `du -sh dist/`、`du -sh dist/pagefind/` | dist ≈ 175 MB，pagefind ≈ 32 MB；超过 +20% 触发 review | P2 |
| A-17 | OOM 守护 | `NODE_OPTIONS=--max-old-space-size=4096 npm run build` | 4 GB 节点足以；不应再需更高 | P1 |
| A-18 | `npm run check:skill-urls` | `tsx scripts/skill-url-check.ts` | 0 broken | P2 |
| A-19 | `npm run fix` 一键修 | 制造 ESLint+Prettier 混合错 → `npm run fix` | 全部自动修复 | P1 |
| A-20 | dev server 可启动 | `npm run dev` | 默认 4321 端口（部分 launch.json 配 4329）；首页可达 | P0 |
| A-21 | `npm run preview` 可启动 | `npm run preview`（需先 build） | 静态服务 dist/ 可访问 | P1 |

---

## B. i18n 路由与字段（内部 + 外部 — P0）

> 0.11.0 翻转后：EN 进根，ZH 进 `/zh/`。本组用例必跑双语。

| ID | 用例 | 步骤 | 预期 | 优先级 |
|---|---|---|---|---|
| B-01 | EN 首页 root | `curl -I /` | 200；`<html lang="en">`；canonical=`https://sgai.md/` | P0 |
| B-02 | ZH 首页 `/zh/` | `curl -I /zh/` | 200；`<html lang="zh-CN">`；canonical=`https://sgai.md/zh/` | P0 |
| B-03 | `/en/*` 整体 301 | `curl -I /en/policies/` | 301 → `/policies/` | P0 |
| B-04 | `/en/people/:id` 特例先于 catch-all | `curl -I /en/people/desmond-lee/` | 301 → `/voices/desmond-lee/`（不掉成 `/people/desmond-lee/` 再二跳） | P0 |
| B-05 | `/people/:id` 历史 301 | `curl -I /people/desmond-lee/` | 301 → `/voices/desmond-lee/` | P0 |
| B-06 | `/sitemap.xml` 301 | `curl -I /sitemap.xml` | 301 → `/sitemap-index.xml` | P0 |
| B-07 | hreflang 三向 | view-source `/policies/` | 含 `hreflang="en"`、`hreflang="zh-CN"`、`hreflang="x-default"` 三条 | P0 |
| B-08 | hreflang URL 配对 | EN `/policies/` 的 `hreflang="zh-CN"` 应指向 `/zh/policies/` | 反之亦然 | P0 |
| B-09 | sitemap 含 xhtml:link alternates | 解析 `dist/sitemap-*.xml` | 每条 URL 有 `<xhtml:link rel="alternate" hreflang="...">`；`grep -c "xhtml:link" dist/sitemap-*.xml` ≥ 4000 | P0 |
| B-10 | sitemap 不出现 `/en/` | `grep "/en/" dist/sitemap-*.xml \| wc -l` | 0 命中 | P0 |
| B-11 | LanguageToggle EN→ZH | `/policies/` 点切换 | URL → `/zh/policies/`；localStorage `sgai_lang=zh` | P0 |
| B-12 | LanguageToggle ZH→EN | `/zh/voices/desmond-lee/` 点切换 | URL → `/voices/desmond-lee/`；不丢深链 | P0 |
| B-13 | LanguageToggle 12 个详情页全可用 | 抽 debates / policies / levers / ecosystem / legal-ai / startups / talent / videos / voices / speeches / community-opensource / opensource 各 1 条 | 双向 URL 正确 | P0 |
| B-14 | LangBanner 不自动跳（关键） | 浏览器语言 zh-CN，访问 `/` | 顶部"中文版可用"提示，URL 保持 `/`；**不发生 location.replace** | P0 |
| B-15 | LangBanner EN 提示（zh→en） | 浏览器语言 en-US，访问 `/zh/` | 提示"English version available"；URL 保持 | P1 |
| B-16 | LangBanner 关闭后不打扰 | 关闭横幅 → 刷新 | 不再出现 | P1 |
| B-17 | `pickLocalized` 多语言 | 在 EN 页面渲染 `pickLocalized(record, 'title', 'en')` | 优先 `titleEn`，缺失回落 `title`（即 zh） | P0 |
| B-18 | `localizedHref` 不硬编码 | `rg "/en/" src \| grep -v "edb.gov.sg\|oecd.ai"` | 0 命中 | P0 |
| B-19 | 数据契约一致 | 抽 policies.ts / debates.ts / people.ts / voices.ts / videos.ts | 用户可见字段全部裸=zh，`*En`=en；无 zhTitle/zhName 反向 convention | P0 |
| B-20 | 状态枚举翻译 | EN `/debates/` 显示 status | 不出现"已落实/进行中/仍在讨论"中文枚举值 | P0 |
| B-21 | SocialChannel labelEn | 含 CJK 的 `label` | 必有 `labelEn`；纯拉丁 `@joteo_ylm` `Newsletter` 允许无 | P1 |
| B-22 | EN 404 双语 | `/no-such/` | HTTP 404；英文文案 + 返回首页链接 | P0 |
| B-23 | ZH 404 双语 | `/zh/no-such/` | HTTP 404；中文文案；URL 保持 | P0 |
| B-24 | RSS 双语 | `/rss.xml` + `/zh/rss.xml` | 各含对应语言文章 | P0 |
| B-25 | Updates RSS 双语 | `/updates.rss.xml` + `/zh/updates.rss.xml` | 各含 12 类型本地化标签 | P1 |
| B-26 | Astro `i18n` 仅供 sitemap 用 | `astro.config.ts` 含 `i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } }` —— 此配置只驱动 `@astrojs/sitemap` 生成 hreflang alternates，**不接管路由**；页面 lang 推断仍走自定义 `getLangFromPath` | P0 |
| B-27 | trailingSlash always | `curl -I /policies` 无尾斜杠 | 308 → `/policies/`（Cloudflare） | P0 |
| B-28 | 内部链接全带尾斜杠 | grep `href="\/[^"]*[^/"]"` in dist/ | 0 命中（除外部链接、片段 anchor、文件后缀） | P1 |

---

## C. 数据契约与一致性（内部 — P0）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| C-01 | i18n 双字段强制 | 加 policies 记录只填 `title` 不填 `titleEn` → `i18n-pair.ts` 校验失败 | P0 |
| C-02 | sourceUrl HTTP 可达 | 写 `sourceUrl: 'https://example.com/404-fake/'` → `validateUrls()` 报 4xx；`prospect-stubs.mjs apply` 退码 2 | P0 |
| C-03 | sourceUrl 反爬豁免 | `notes: "archive.org 快照确认"` + `--skip-url-check` 显式豁免才放行 | P1 |
| C-04 | 跨实体软引用 | 删一条 `relatedPolicyIds` 指向的政策 → `verify-graph.ts` 报错 | P0 |
| C-05 | 状态枚举受控 | 加 `status: '待办'` → TS 编译失败 | P0 |
| C-06 | DEBATE_STATS 一致性 | `total / byYear / byType / byTopic` 加总 == 153 | P0 |
| C-07 | 议题归一化 | `Oral Answer` / `AI & Workforce` / `AI Ethics & Safety` / `AI Startups & Ecosystem` 已合并到受控词表（`Oral Answers to Questions` / `AI & Employment` / `AI Safety & Ethics` / `AI Economy & Industry`） | P1 |
| C-08 | `mp-stubs.json` 213 条 | 全部 schema 一致；codemod-debates.ts 注入 personIds 解析率 ≥ 85% | P1 |
| C-09 | benchmarking drilldownEnrichments key | `BenchmarkDrilldown.localId` 作 key（`core-strategy` / `strategy-N` / `investment-N` / `initiative-N` / `body-N` / `comparative-strength`） | P1 |
| C-10 | `_pendingReview` 默认 true | ecosystem / talent / startups / tracker / benchmarking auto-discovered → listing 隐藏 | P1 |
| C-11 | startups 历史 i18n 覆盖率最低 | `Unicorn.name` 接受无 zh/en 区分（已知限制）；新加字段必双 | P2 |
| C-12 | 不规则空白扫描 | 新粘贴 Hansard 原文后 → 0 个 NBSP / 全角 / 零宽空格 | P0 |
| C-13 | transcript 不含 i18n 字段 | `debate-transcripts.ts` `video-transcripts.ts` `speech-transcripts.ts` 是原始数据，不强制双字段 | P1 |
| C-14 | `data-i18n-allow-cjk` 显式标记 | EN 页面有意保留中文（如 hansard-original 引用、ecosystem-pending-translation）必须包到 `<section data-i18n-allow-cjk="reason">` | P0 |
| C-15 | timeline 13 顶级 | 从 Smart Nation 2014 到 NAIRD 2026 完整 | P1 |

---

## D. 各栏目页（外部 + 内部，P0/P1）

> 每条都需在 zh + en 各跑一遍。共同抽查：HTTP 200、`<html lang>`、canonical、hreflang ×3、JSON-LD、Breadcrumb、内部链接走 `localizedHref`、移动 390px 不溢出。

### D.1 首页 `/` + `/zh/`

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-01-01 | thin wrapper 单组件 | `src/components/home/HomePage.astro` 单 source；page wrapper ≈ 40 行 | P0 |
| D-01-02 | Hero 主论点 | 6 抓手主论点保留；`t(lang, 'siteName')` | P0 |
| D-01-03 | TaskEntries 4 张任务卡 | 「理解战略 / 找政策 / 看企业 / 跟踪变化」全部展示 + 链接正确 | P0 |
| D-01-04 | RecentUpdates 模块 | 显示 6 条最近更新；按月分组；每条带 type chip + 链接；只为出现的类型上色 | P0 |
| D-01-05 | 最近国会辩论 | N 条最新卡链 `/debates/[id]/` | P1 |
| D-01-06 | 任务卡 → 一级页 | 4 卡 1 次点击直达 | P0 |
| D-01-07 | 移动 390px 不溢出 | `document.documentElement.scrollWidth === window.innerWidth` | P0 |
| D-01-08 | Hero CTA 走 `localizedHref` | 0 个 `/en/` 硬编码 | P0 |

### D.2 `/policies` + `/policies/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-02-01 | 列表统计 | 5 categories / ~20+ 条；显示 ministry、年份 | P0 |
| D-02-02 | 卡片 RelatedRail compact | 关联辩论/抓手/时间线；空时不渲染 DOM | P1 |
| D-02-03 | 详情页 schema | JSON-LD `Article` 或 `GovernmentService` | P0 |
| D-02-04 | 详情页 sourceUrl 200 | `target="_blank" rel="noopener"` | P0 |
| D-02-05 | _pendingReview 隐藏 | 在 listing 不显 | P1 |
| D-02-06 | EN 状态翻译 | 不出现"已落实/进行中"中文 | P0 |
| D-02-07 | PolicyProfile.astro 渲染 | 404 行的最大 data 组件，每个 section 都有内容 | P1 |

### D.3 `/debates` + `/debates/[id]` + transcript ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-03-01 | 检索区前置 | 标题下方有搜索框 + 5 select（类型/议题/年份/议员/争议度） | P0 |
| D-03-02 | 8 快捷 chip | 最新场次 / 最新年份 / 数据主权 / 就业 / 治理 / 国家安全 / 医疗 / 高争议 | P0 |
| D-03-03 | 议题计数为 0 隐藏 | "按议题浏览"区不显示 0 计数议题 | P1 |
| D-03-04 | 统计卡 | 总数 153 / 年份范围 / 更新时间 / 类型分布 + 可点击柱状图 | P1 |
| D-03-05 | 记录卡折叠 | 默认压缩；展开区有长摘要 / 立场 / 引用 / 原文节选 | P0 |
| D-03-06 | 客户端 vanilla 筛选 | `<script define:vars>` 内联；`setAttribute('hidden')`；153 条全量 SSR | P0 |
| D-03-07 | 多筛选组合 | 类型 + 议题 + 关键词 → 命中数与展示一致 | P0 |
| D-03-08 | 清除筛选 | 一键清空所有 select + 搜索 | P0 |
| D-03-09 | ZH 详情页 transcript | 同时展示 `paragraphs` 中文译文 + `paragraphsEn` 英文原文（不再折叠） | P0 |
| D-03-10 | EN 详情页 transcript | 只展示 paragraphsEn；不夹中文译文 | P0 |
| D-03-11 | speaker 链接 | 点议员名 → `/voices/[id]/` | P0 |
| D-03-12 | Hansard sourceUrl 200 | 跳 SPRS 可达 | P0 |
| D-03-13 | 议题归一化筛选 | 选 `AI & Employment` 命中所有原 `AI & Workforce` | P1 |
| D-03-14 | 移动 chip 不截断 | 390px 视口下 8 chip 排版可读，无溢出 | P1 |
| D-03-15 | DebatesIndex 共用 | `src/components/debates/DebatesIndex.astro` 单文件 ~1218 行；zh + en page 都直接 import | P0 |
| D-03-16 | hansard-original 块 | 含 `data-i18n-allow-cjk` 让中文原文在 EN 页可见而不触发 i18n-check | P0 |

### D.4 `/voices` + `/voices/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-04-01 | 列表只 31 真人 | 213 MP stubs 不入 voices listing；只入 voices/[id] backlinks 数据 | P0 |
| D-04-02 | 详情页 4 个新分区 | `signatureWork` / `notableQuotes` / `speakingRecord` / `externalRoles` 任一非空时展示 | P1 |
| D-04-03 | 关联辩论列表 | 反向索引该 person 所有相关辩论 | P0 |
| D-04-04 | 关联政策 | `authorPersonIds` 反查命中 | P1 |
| D-04-05 | 社交渠道 | label/labelEn 双语正确 | P1 |
| D-04-06 | JSON-LD `Person` | name / jobTitle / affiliation / sameAs | P0 |
| D-04-07 | stub callout | 资料未补全显示"档案待补充" | P2 |
| D-04-08 | quote sourceUrl required | `NotableQuote.sourceUrl` 必填；找不到删除整条 | P0 |
| D-04-09 | `/people/:id` 全部 301 → `/voices/:id` | 4 条特例 + 1 条 catch-all 都生效 | P0 |

### D.5 `/videos` + `/videos/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-05-01 | 63 条视频 | 5 分类（战略/治理/人才/产业/国际） + 3 类讲者（govt/academic/industry） | P1 |
| D-05-02 | 筛选 | 类型/讲者/频道筛选互不冲突 | P1 |
| D-05-03 | 缩略图 | 远程 YouTube thumbnail；构建期断网应有兜底（已知限制） | P2 |
| D-05-04 | transcript 双向 | `paragraphs` zh + `paragraphsEn` en；按 lang 渲染 | P0 |
| D-05-05 | 无 transcript 视频 | 显示"transcript 不可用"；不报错 | P1 |
| D-05-06 | JSON-LD `VideoObject` | embedUrl / thumbnailUrl / duration / uploadDate | P0 |
| D-05-07 | YouTube 外链 | `youtubeUrl` 跳原视频 | P0 |

### D.6 `/ecosystem` + `/ecosystem/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-06-01 | 9 大类 / ~40 实体 | 卡片整体可点击进详情（仅当有 `id`） | P0 |
| D-06-02 | 卡片右上角外链 ↗ | 不嵌套 `<a>`；绝对定位层；不触发卡片跳转 | P0 |
| D-06-03 | 没有 `id` 的卡 | 保持只外链行为，不报错 | P1 |
| D-06-04 | SEA-LION 样板完整 | 详情页 whatItIs / aiRelevance / singaporeRelevance / milestones 全有内容 | P0 |
| D-06-05 | parentEntityId 链接 | SEA-LION → AI Singapore 父实体可跳 | P1 |
| D-06-06 | 七大支柱徽章 | 详情页头部 + 同支柱其他实体小链 | P1 |
| D-06-07 | _pendingReview 隐藏 | listing 不显示；详情页可访问，noindex | P1 |
| D-06-08 | EN fallback 待批量翻译块 | 整块包 `data-i18n-allow-cjk="ecosystem-pending-translation"`；i18n-check 跳过 | P0 |

### D.7 `/levers` + `/levers/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-07-01 | 6 抓手 / 111 LeverItems | 全部展开；每抓手底部 RelatedRail compact | P0 |
| D-07-02 | championPersonIds 链接 | 跳 `/voices/[id]/` | P1 |
| D-07-03 | Auto-discovered 子组 | 自动发现条目入此子组，PR 中由 Luca 移到正确抓手 | P1 |
| D-07-04 | 详情页 schema | `GovernmentService` 或 `Article` | P1 |

### D.8 `/timeline` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-08-01 | 13 顶级条目 | 2014 → 2026 全 | P0 |
| D-08-02 | 每事件 RelatedRail | 关联政策/辩论/博文 | P1 |
| D-08-03 | personIds → /voices/ | 跳人物 | P1 |

### D.9 `/tracker` + `/tracker/[dim]` + `/tracker/methodology` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-09-01 | 6 维度仪表盘 | investment / talent / compute / adoption / research / governance；每张卡有核心数字 + 参照系 + 目标进度 + 排名锚 + 趋势 | P0 |
| D-09-02 | 不打分 | 全站 grep 无 A/B/C 评级 / 总评分 | P0 |
| D-09-03 | 维度详情页可下钻 | "编辑解读" + "关键短板" | P0 |
| D-09-04 | methodology 页 | 方法论 + changelog + 季度复评 | P1 |
| D-09-05 | 编辑解读署名 | 卡片底部"sgai 编辑解读 · YYYY-MM-DD" | P1 |

### D.10 `/benchmarking` + `/benchmarking/[region]` ✅ 双语

> 23 regions / 12 cases / ~160 drilldowns。`[region].astro` 是 19 行 dispatcher。

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-10-01 | dispatcher 拆分 | RegionProfile / CaseProfile / DrilldownProfile 三组件按 page.kind 分 | P1 |
| D-10-02 | URL 模式不变 | `find dist/benchmarking -type d \| wc -l` == 199 + 1 root（实测 2026-05；docs 老数字 183，扩张是预期，bump 阈值 +20% 触发审查） | P0 |
| D-10-03 | drilldown noindex 自动 | `analysisPending: true` 输出 `<meta name="robots" content="noindex,follow">`；实测 2026-05：199 页中 17 noindex / 182 indexable（drilldown 补深进度高，docs 旧数字 160/22 已不适用） | P0 |
| D-10-04 | 补深后自动可索引 | 加 enrichment → `analysisPending: false` → robots meta 消失 | P0 |
| D-10-05 | llms.txt 收敛 | thin drilldown 不入；`grep -c "/benchmarking/" dist/llms-full.txt` ≤ 50 | P0 |
| D-10-06 | sourceUrl HEAD-check | `npx tsx scripts/check-benchmarking-urls.ts` exit 0 | P0 |
| D-10-07 | case 双栏 / region 多 section / drilldown 简洁 | 三组件各自布局保留 | P1 |

### D.11 `/startups` + `/startups/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-11-01 | 9 unicorns / exits / investors | 完整渲染 | P0 |
| D-11-02 | autoDiscovered[] section | 自动发现条目分区 | P1 |
| D-11-03 | i18n 覆盖率 | `Unicorn.name` 历史无 zh/en 区分（接受） | P2 |

### D.12 `/talent` + `/talent/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-12-01 | 8 programmes | AISG / SkillsFuture / IMDA 全展示 | P0 |
| D-12-02 | autoDiscovered profiles | 半年级新增分区 | P1 |
| D-12-03 | 数字 vs 官方 | "15K AI 专才 by 2029" 与原文一致 | P1 |

### D.13 `/opensource` + `/opensource/[id]` & `/community-opensource` + `/community-opensource/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-13-01 | opensource 列表卡片化 + 详情页 | OpenSourceProjectDetail.astro（193 行）渲染完整 | P1 |
| D-13-02 | community-opensource 三类 | 高校/企业/创业 array | P1 |
| D-13-03 | stars 字段月级刷新 | GitHub API；数字与 repo 一致 | P1 |
| D-13-04 | 列表卡无嵌套 a | grep 验证 ai-verify 块与 openSourceProjects 网格平行（已确认无嵌套） | P0 |

### D.14 `/legal-ai` + `/legal-ai/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-14-01 | ~30 条法律 AI 项目 | 半年级 auto-PR；新条目入 "Auto-discovered" section | P1 |
| D-14-02 | JSON-LD `Legislation` 或 `DefinedTerm` | 字段完整 | P1 |
| D-14-03 | 来源链接可达 | sso.agc.gov.sg / MAS / PDPC | P1 |

### D.15 `/updates` + `/updates.rss.xml` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-15-01 | 12 类型 schema | type chip 本地化（`[Site]` / `[站点]` 等） | P0 |
| D-15-02 | 按月分组 | helper `updatesByMonth` 排序正确 | P0 |
| D-15-03 | RSS feed 可订阅 | `/updates.rss.xml` valid RSS 2.0；`/zh/updates.rss.xml` 同 | P0 |
| D-15-04 | 9 个 pipeline 自动 emit | refresh 跑完调 `append-update.ts` | P0 |
| D-15-05 | i18n-pair 失败回滚 | 故意拉断 `*En` → emit 自动 rollback | P0 |
| D-15-06 | 首页 RecentUpdates 限 6 | 只为出现类型上色 | P1 |

### D.16 `/blog` + EN catch-all `[...blog]` + ZH `[...page]/[category]/[tag]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-16-01 | EN blog 列表 `/blog/` | ZH 列表 `/zh/blog/`；分页 `[...page]` | P0 |
| D-16-02 | EN 文章 `/<slug>/`（catch-all） | 中文文章 `/zh/<slug>/` | P0 |
| D-16-03 | ZH `[category]/[...page]` | `/zh/blog/观点/` 等分类页可达 | P1 |
| D-16-04 | ZH `[tag]/[...page]` | `/zh/blog/政策/` 等标签页可达 | P1 |
| D-16-05 | TableOfContents inline 折叠 | h2/h3 锚点；不上固定侧边栏 | P1 |
| D-16-06 | AuthorBio | `relatedPersonIds[0]` 解析；avatar + 名字 + 链 `/voices/[id]/`（不再 `/people/[id]/`） | P1 |
| D-16-07 | NextPrevPost | 限定同语言邻居 | P0 |
| D-16-08 | ReadingProgress | 顶部 2px 进度条 rAF 驱动 | P2 |
| D-16-09 | RelatedRail full | 文末展示关联政策/辩论/抓手/人物 | P1 |
| D-16-10 | JSON-LD `Article` | author / publisher / datePublished / inLanguage | P0 |
| D-16-11 | 中英文章手工双写（已知限制） | 改 zh 文章不会自动同步 EN | P2 |

### D.17 静态页 / `/about` `/challenges` `/evolution` `/fieldnotes` `/references` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-17-01 | about 页 | Luca 人格 + 为什么做 + 研究方法 + 利益声明（双语） | P1 |
| D-17-02 | references 页 | 报告 / 论文 / 数据集列表 | P2 |
| D-17-03 | fieldnotes 页 | 一线观察文章 | P2 |
| D-17-04 | challenges / evolution | 双语镜像 | P2 |

### D.18 `/speeches/[id]` ✅ 双语

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-18-01 | MDDI 演讲详情 | speech-transcripts 渲染；`paragraphs` + `paragraphsEn` 按 lang 取 | P0 |
| D-18-02 | speaker 链 voices | `/voices/[id]/` | P1 |

### D.19 LLM/SEO 入口

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-19-01 | `/llms.txt` 英文为主 | 高价值入口 + 主题页面索引 | P0 |
| D-19-02 | `/llms-full.txt` 完整详情页 URL | EN canonical 在前，ZH mirror 在后 | P0 |
| D-19-03 | thin drilldown 不入 llms-full.txt | `analysisPending !== true` filter 生效 | P0 |
| D-19-04 | `/robots.txt` 允许 LLM crawler | sitemap 地址正确 | P0 |
| D-19-05 | `/sitemap-index.xml` 200 | 子 sitemap 全可达 | P0 |
| D-19-06 | sitemap 不出现 noindex 页面 | drilldown stub / tag 薄页 应排除（待实施） | P2 |

### D.20 错误处理 & 边缘 URL

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| D-20-01 | EN 404 | `/no-such/` HTTP 404 + 英文文案 | P0 |
| D-20-02 | ZH 404 | `/zh/no-such/` HTTP 404 + 中文文案 | P0 |
| D-20-03 | 404 不自动跳 | URL 保持 | P1 |
| D-20-04 | 大小写敏感 | `/POLICIES/` 行为符合预期（404 或 301） | P2 |
| D-20-05 | 末尾路径片段 | `/policies/?foo=bar#section` 可达 | P2 |

---

## E. SEO / 结构化数据 / 元信息（外部 — P0/P1）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| E-01 | `<title>` 模板 | EN `%s — Singapore AI Observatory`、ZH `%s — 新加坡 AI 观察` | P0 |
| E-02 | `og:site_name` | EN `Singapore AI Observatory`、ZH `新加坡 AI 观察` | P0 |
| E-03 | `og:locale` | EN `en_US`、ZH `zh_CN` | P0 |
| E-04 | `og:image` 默认 1200x628 | 缺失页面回落全局 | P1 |
| E-05 | Twitter Card summary_large_image | 有 OG 图时自动 | P1 |
| E-06 | canonical 一致 | trailingSlash always | P0 |
| E-07 | canonical 语言对应 | EN → `https://sgai.md/...`、ZH → `https://sgai.md/zh/...` | P0 |
| E-08 | hreflang `x-default` 指向 EN root | 全站统一 | P0 |
| E-09 | JSON-LD Organization 首页 | name/url/logo/description/sameAs github | P0 |
| E-10 | JSON-LD Article blog | headline/datePublished/author/publisher/inLanguage | P0 |
| E-11 | JSON-LD BreadcrumbList | 详情页 schema | P1 |
| E-12 | JSON-LD Person/VideoObject/Legislation/GovernmentService | 各类详情页字段完整；Rich Results Test 通过 | P1 |
| E-13 | meta description 每页独立 | 不大规模回落 site-wide default | P1 |
| E-14 | favicon ico+svg+apple-touch-icon | 全套 | P2 |
| E-15 | benchmarking drilldown noindex | `analysisPending` 自动驱动 | P0 |
| E-16 | tag/category 薄页 noindex | 待实施（产品规划 Phase 1） | P2 |
| E-17 | OG image 生成脚本 | `npm run generate:og-image` | P2 |

---

## F. UX / 交互 / 搜索（外部 — P0/P1）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| F-01 | Header 4 组下拉 | 观点 / 政策与战略 / 辩论与声音 / 数据追踪 | P0 |
| F-02 | Header Data 组缩到 5 项 | Updates / Tracker / Startups / Talent / Benchmarking | P0 |
| F-03 | Footer 4 组完整 | 含 Opensource / Community-opensource / Fieldnotes / References / about（共 9 项 archive） | P0 |
| F-04 | Footer footnote 版本号 | `${siteName} v${SITE_VERSION} · Last updated ${SITE_UPDATED} · Maintained by wulujia` | P1 |
| F-05 | Pagefind 仅 build 后可用 | `npm run dev` 不会有索引；`npm run preview` 才能测 | P0 |
| F-06 | Pagefind `/` 唤起 | SearchModal lazy-load；首次唤起后加载 UI script | P0 |
| F-07 | Pagefind 多语言 | EN 页搜 EN 索引；ZH 页搜 ZH 索引；不串语言 | P0 |
| F-08 | 搜 NAIS 命中 | 命中数 ≥ 5；含相关政策 + 辩论 | P1 |
| F-09 | 搜 Josephine Teo 命中 | 命中议员 + 相关辩论 | P1 |
| F-10 | RelatedRail compact | 关系空时不渲染 DOM（hideWhenEmpty） | P0 |
| F-11 | RelatedRail full（345 行组件） | blog 文末显示完整关联组 | P1 |
| F-12 | TaskEntries 4 张任务卡 | Hero 之下 | P0 |
| F-13 | Breadcrumb 双语 | 各详情页路径正确 + JSON-LD | P1 |
| F-14 | `:focus-visible` ring | Tab 键导航有可见 focus | P1 |
| F-15 | 滚动阴影 | `.overflow-x-auto` 容器有边缘阴影 | P2 |
| F-16 | Theme toggle | dark/light 切换 + apply-color-mode 持久化 | P2 |
| F-17 | Social share | 详情页 share 按钮（如有） | P3 |

---

## G. 跨实体关联（Graph + RelatedRail — P0/P1）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| G-01 | `getRelated(EntityRef)` | 反向索引 debatesByPersonId / policiesByPersonId 命中 | P0 |
| G-02 | `verify-graph.ts` 守卫 | 任何外键失效报错；`npm run check:graph` 必跑 | P0 |
| G-03 | `getPersonCounts(id)` | 议员页显示正确发言数 | P1 |
| G-04 | RelatedRail 接入面 | policies / levers / timeline / blog / debates(P2 待加) 全部对齐 | P1 |
| G-05 | 跨详情页双向打通 | 政策 → 辩论 → 议员 → 该议员所有发言，路径连续 | P0 |
| G-06 | 同语言邻居 | `getRelatedPosts` 限定 lang；不串语言 | P1 |

---

## H. 性能 / 可访问性 / 移动端（外部 — P1）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| H-01 | LCP 移动 < 2.5s | `/debates/`（最重）Lighthouse | P1 |
| H-02 | CLS < 0.1 | 全站 | P1 |
| H-03 | TBT 合理 | < 300ms | P2 |
| H-04 | 移动 390px 不溢出 | 全栏目验证 `scrollWidth === innerWidth` | P0 |
| H-05 | `<img>` alt | 0 缺失（截至 plan-status，7 处待审） | P1 |
| H-06 | lazy + async decoding | Image 组件统一处理 + rehype lazyImagesRehypePlugin | P1 |
| H-07 | 字体加载 | Source Serif 4 + Noto Serif SC；无严重 FOUT/FOIT | P2 |
| H-08 | 内部链接 trailing slash | 不走 308 redirect | P0 |
| H-09 | YouTube 缩略图远程加载 | 构建期断网应能优雅降级 | P2 |
| H-10 | Pagefind 索引体积 | < 35 MB；薄页排除后下降 | P2 |
| H-11 | 键盘导航 | Tab 全栏目可达；Esc 关闭 modal | P1 |
| H-12 | aria-label | 社交链接 / search / language toggle 全配 | P1 |
| H-13 | 响应式 table | rehype responsiveTablesRehypePlugin 命中 | P2 |
| H-14 | Hover 仅在指针设备 | 移动 long-press 不触发 hover bug | P3 |

---

## I. Refresh Pipelines / 自动化数据更新（内部 — P0/P1）

> 8 条 auto-PR pipeline（registry.json）+ 3 条 scan-only-email（auto_update.py 内置 hansard/videos/voices）。

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| I-01 | 4 个标准 flag | `--dry-run` / `--limit=N` / `--no-commit` / `--no-push` 全支持 | P0 |
| I-02 | dry-run 不入盘 | `npx tsx scripts/refresh/policies/run.ts --dry-run --limit=2` 不修改任何文件 | P0 |
| I-03 | sha256 翻译缓存 | 重跑相同输入零成本 | P1 |
| I-04 | last_scan_state.json | 增量扫描 | P0 |
| I-05 | i18n-pair baseline-vs-after diff | emit 引入 unpaired 自动 rollback | P0 |
| I-06 | sourceUrl HEAD-check | 4xx/5xx blocks apply 退码 2 | P0 |
| I-07 | auto-commit 分支命名 | `data-refresh/<domain>/<date>` | P0 |
| I-08 | `gh pr create` | PR 描述含 diff stat / 新条目 / confidence 分布 / 失败源 | P0 |
| I-09 | PR `--assignee @me` | wulujia@gmail 收到通知 | P0 |
| I-10 | scan-only Issue 通知 | hansard/videos/voices 有新内容时 `gh issue create --assignee @me` | P1 |
| I-11 | _pendingReview 默认 true | ecosystem/talent/startups/tracker/benchmarking 自动条目；listing 隐藏 | P1 |
| I-12 | append-update 双向 | 9 个 pipeline 自动追加 update + i18n-pair 回归保护 | P0 |
| I-13 | github-stars `--bump-version` | 同时 bump src/version.ts | P1 |
| I-14 | registry.json 调度 | weekly/monthly/quarterly/half-yearly 4 schedules | P1 |
| I-15 | prospect-stubs.mjs 5 子命令 | list/queue/status/apply/sync-from-people 全可用 | P1 |
| I-16 | OpenAI/SMTP 0 依赖 | 走本地 `claude` CLI；GitHub 通知零配置 | P0 |
| I-17 | scripts/doctor.sh | 体检通过 | P1 |
| I-18 | 8 条 auto-PR pipeline 各跑一次 e2e | benchmarking / ecosystem / legal-ai / levers / policies / startups / talent / tracker 各 `--limit=1` 真实跑通 | P1 |

---

## J. Transcript（视频 + 国会辩论 — P0）

| ID | 用例 | 预期 | 优先级 |
|---|---|---|---|
| J-01 | `npm run fetch:debate-transcripts` | 从 SPRS API 抓 Hansard 完整原文，写 debate-transcripts.ts | P0 |
| J-02 | `--ids=` 单条 | 只抓指定 ID（如 `written-answer-21161`） | P1 |
| J-03 | `--force` 重抓 | 忽略缓存 | P1 |
| J-04 | `--emit-only` | 不抓只重建 | P1 |
| J-05 | `npm run translate:debate-transcripts` | 英→中；缓存/并发/5xx/429 重试 | P0 |
| J-06 | 站内自定义 id（如 `cos-moh-2026`） | 从 sourceUrl?reportid= 解析真实 ID | P0 |
| J-07 | ZH 详情页同时展示 paragraphs + paragraphsEn | 展开非折叠 | P0 |
| J-08 | EN 详情页只展示 paragraphsEn | 不夹中文 | P0 |
| J-09 | `npm run check:debate-transcripts` | 0 缺失 | P0 |
| J-10 | `npm run fetch:video-transcripts --limit=N` | YouTube 自动字幕；不可用跳过 | P0 |
| J-11 | `npm run translate:video-transcripts` | 抓到英文字幕后必须翻译给 zh 页 | P0 |
| J-12 | `npm run check:video-transcripts` | 0 缺失 | P0 |
| J-13 | merge-video-digests.mjs | 合并视频 transcript 为 summary | P2 |

---

## K. Fresh-Eye 端到端用户旅程（外部 — P0/P1）

> 每条建议 ≥2 名陌生用户线下试做，或线上邀请 5 人异步测。

| ID | 场景 | 验收 | 优先级 |
|---|---|---|---|
| K-01 | 30 秒看懂 | 进 `/` 不滚动一屏内能说"这是新加坡 AI 战略观察站，有政策/辩论/创业/对标四类资源" | P0 |
| K-02 | 找具体政策 NAIS 2.0 | 首页 2 次点击内到达政策详情页 | P0 |
| K-03 | 找议员 X 全部发言 | 点议员名 → `/voices/[id]/` → 列出所有相关辩论 | P0 |
| K-04 | 中英切换不丢上下文 | 任一详情页切换 URL 切到对等镜像，不回首页 | P0 |
| K-05 | 移动 390px 主要栏目 | 4 张任务卡 / 政策列表 / 辩论检索区 / 视频网格 全可用 | P0 |
| K-06 | RSS 订阅 | Feedly 添加 4 个 feed 全可读 | P1 |
| K-07 | LLM crawler 爬 llms-full.txt | 列出页能直接抓到正文（SSR HTML） | P0 |
| K-08 | 搜索引擎收录 | site:sgai.md 主要栏目 + 详情页全收录 | P1 |
| K-09 | 社交分享深链 | 直接打开 `/zh/debates/budget-2914/` 可读、有 OG 卡 | P0 |
| K-10 | 中文用户访问 EN root | 顶部"中文版可用"提示，不自动跳；点击切到 `/zh/` | P0 |
| K-11 | 英文用户访问 `/zh/` | "English version available" 提示；URL 保持 | P1 |
| K-12 | 老 `/en/...` 链接 | 301 到无前缀英文路径；anchor / query 不丢 | P0 |
| K-13 | 老 `/people/...` 链接 | 301 到 `/voices/...` | P0 |
| K-14 | Updates 复访理由 | 用户每周回访能看到 ≥1 条新更新 | P1 |
| K-15 | 引用体验 | 文章可复制 + "数据来源 · YYYY-MM-DD" | P1 |
| K-16 | Pagefind 全站搜 | 输入 NAIS / Josephine Teo / data centre，命中 ≥5 高相关 | P1 |
| K-17 | 首屏内容 SSR | view-source 可见正文（非 loading 骨架） | P0 |
| K-18 | 离线 / 弱网 | 字体 fallback；图片 alt 可读 | P2 |
| K-19 | tracker 6 维度可下钻 | 用户能从仪表盘卡进入维度详情页 | P0 |
| K-20 | benchmarking 找 Singapore vs UK 对比 | 2 次点击进 case 页；有数据 + 解读 | P1 |

---

## L. 发布前 Smoke（< 10 分钟必跑）

```bash
# 1) 代码质量
npm run check                    # 7 子任务

# 2) 构建
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# 3) i18n 残留扫描（不在 check 里！）
node scripts/i18n-check.mjs --lang en --root dist

# 4) 外键 + sourceUrl 真实性
npx tsx scripts/verify-graph.ts
npx tsx scripts/check-benchmarking-urls.ts

# 5) preview 起服务（Pagefind 只在 build 后可用）
npm run preview &
PREVIEW_PID=$!
sleep 3

# 6) 12 个端点 HEAD 200
for u in / /zh/ /policies/ /zh/policies/ /debates/ /zh/debates/ \
         /rss.xml /zh/rss.xml /updates.rss.xml /sitemap-index.xml \
         /llms.txt /llms-full.txt; do
  echo "$u: $(curl -sI http://localhost:4321$u | head -1)"
done

# 7) 4 个 301 配对
for u in /en/ /en/policies/ /people/desmond-lee/ /sitemap.xml; do
  echo "$u: $(curl -sI http://localhost:4321$u | head -1)"
done

kill $PREVIEW_PID

# 8) 浏览器手测：3 分钟
#    - LanguageToggle 任一详情页双向
#    - Pagefind `/` 唤起 + 搜 "NAIS"
#    - 移动 390px 视口 /debates/ 检索区不溢出
#    - LangBanner 在 EN root 显示"中文版可用"且不自动跳
```

---

## M. 缺陷分级建议

- **Blocker（阻断上线）**：A-01 / A-02 / A-09..A-14 / B-01..B-13 / C-01..C-06 / D-*-01 / E-01..E-08 / J-01 / J-07..J-09 / K-01..K-04 / K-10
- **Critical（24h 内修）**：i18n 字段缺漏 / sourceUrl 404 / 移动溢出 / Pagefind 串语言 / hansard transcript 缺
- **Major**：UX 细节 / RelatedRail 不命中 / Updates 模块缺更新
- **Minor**：文案打磨 / favicon / 可选 PWA / fieldnotes 内容

---

## N. 已知历史限制（接受 — 不当 bug）

1. `src/data/post/en/*.md` 与 `src/data/post/<slug>.md` 手工双写。
2. LangBanner 在 EN 页面显示中文邀请文案是有意为之，i18n-check 已加白名单。
3. Hansard `speakers` 字段保留英文姓名（与 Hansard 原文一致）。
4. `Unicorn.name` 历史无 zh/en 区分，是 i18n 双字段覆盖率最低的字段之一。
5. tag/category 薄页 noindex 策略尚未实施（产品规划 Phase 1 待办）。
6. drilldown 内容补深按周节奏推进。
7. `npm run check:i18n` 不在 `npm run check` 里——必须 `npm run build` 之后单独跑（已知设计：避免 check 阶段强依赖 dist/）。
8. Pagefind 在 `npm run dev` 不可用，必须 build → preview 才能测搜索。
9. ZH 残留扫描没 LANG_CONFIG 配置，跑 `--lang zh` 会 exit 2 报"No config"。设计上 zh 允许大量英文（人名/缩写），手工 review 即可。
10. Astro 原生 i18n 在 `astro.config.ts` 配置了 `{ defaultLocale: 'en', locales: { en, zh: 'zh-CN' } }`，但**仅供 `@astrojs/sitemap` 生成 hreflang alternates** —— 路由不由 Astro i18n 接管，所有 lang 推断仍走自定义 `getLangFromPath`。

---

## O. 测试用例覆盖率自检

| 模块 | 用例数 | 必测 P0 | 备注 |
|---|---|---|---|
| A. 构建 / CI | 21 | 17 | 含 9 个 lib unit test |
| B. i18n 路由 | 28 | 23 | 0.11.0 翻转后核心 |
| C. 数据契约 | 15 | 11 | i18n-pair / verify-graph 配合 |
| D.1–D.20 栏目页 | ~115 | ~78 | 12 详情 + 8 列表 + 错误页 + LLM 入口 |
| E. SEO | 17 | 11 | Rich Results Test 抽查 |
| F. UX 交互 | 17 | 9 | Pagefind 必须 build 后测 |
| G. 跨实体 Graph | 6 | 3 | verify-graph CI 守卫 |
| H. 性能 / a11y | 14 | 4 | Lighthouse + 移动 |
| I. Refresh Pipelines | 18 | 11 | 8 + 3 条管线 |
| J. Transcript | 13 | 9 | 视频 + 辩论 |
| K. Fresh-Eye Journeys | 20 | 10 | 端到端 |
| **总计** | **~284** | **~186** | |

---

## P. 测试自动化建议（可选下一步）

> 当前仓库**无任何 E2E 测试**，仅 9 个 lib unit test。下面是按 ROI 排序的自动化机会：

1. **HTTP smoke matrix**（30 分钟可建）：bash 脚本跑 50 个 URL × 200/301/404 期望矩阵；CI 接入 Cloudflare Pages preview URL。
2. **i18n-pair pre-commit hook**：`npx tsx scripts/lib/i18n-pair.ts` git hook，编辑 src/data/*.ts 时强制跑。
3. **Pagefind 搜索断言**：build 后用 `pagefind` Node API 跑 N 条预设查询，断言命中数 ≥ 阈值。
4. **JSON-LD validator**：跑 `dist/**/*.html` 提取 `<script type="application/ld+json">`，用 schema-dts 或 Google 的结构化数据测试 API。
5. **Playwright 5 条核心旅程**：K-01..K-04 + K-10 自动化；headless Chrome；MOQA 1 小时内可跑完。
6. **Lighthouse CI**：3 个代表页（首页 / 辩论列表 / 详情）跑性能预算；LCP/CLS 阈值断言。
7. **Visual regression**：移动 390px + 桌面 1280px 各 10 个 sample 页 → BackstopJS / Percy。
8. **AI 翻译质量回归**：抽样新加 `*En` 字段，用 Claude 评分 1-5；< 3 标黄。

---

> 本计划随项目演进同步更新。重大改造（i18n root 翻转、IA 重排、新增管线、Pagefind 替换）后 1 周内审一次本表，新增/修订对应用例。
> 维护者：本计划首次形成 2026-05-05；下次审计建议 2026-08-01。

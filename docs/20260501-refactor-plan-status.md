# sgai 网站深度重构 — Plan + 进度快照（2026-05-01）

完整 plan 原始版本存在 `~/.claude/plans/fluttering-meandering-lovelace.md`。本文档是项目内的 mirror + 实施进度快照，用于跨 session 续作。

## 战略锚定（用户已确认）

- **主受众**：创业者 / 技术决策者
- **视觉路线**：FT / Stratechery / 半导体行业观察 — 单签名色 + CJK 衬线 + 密集结构化数据
- **/blog 定位**：与数据页**并列重要**，必须双向打通
- **投入预算**：8+ 周深度重构，接受 ~60% 现有 surface 代码重写

## 期望成果

读者打开任何一篇 blog 文章，能在文末看到相关政策/辩论/抓手；打开任何一条辩论，能看到议员的所有相关发言、相关政策、对应时间节点。整站呈现"研究网络"而非"页面集合"。

## 总体策略

Schema 先行（不可见但解锁一切），外加 Phase 0 快速可见进展打信心。

---

## 已完成阶段

### ✅ Phase 0 · 快速止血（已上线 v0.0.24）
Commit `7759c08` 部分。

- 删除 /debates 内联 ~302 KB JSON：SSG 渲染 150 卡 + DOM toggle 筛选
- 卸载 `@fontsource-variable/inter`，装 `@fontsource/source-serif-4` + `@fontsource/noto-serif-sc`（Phase 3 主题化）
- `tailwind.css` 加全局 `:focus-visible` ring + `.overflow-x-auto` 滚动阴影
- bump version

### ✅ Phase 1 · 知识图谱 Schema（已上线 v0.0.26）
Commits `7759c08`（1.1-1.6）+ `711e189`（1.7-1.15）。

#### 数据层
- `src/data/people.ts` 新建 — 单一人物真相源
  - 扩展 `Person` interface：加 `aliases / roles / affiliations / party`
  - 7 curated（导出 `people`，给 /voices 用）+ 213 stub from `mp-stubs.json`（导出 `mpStubs`）+ `allPeople = [...people, ...mpStubs]`
  - 拆分原因：220 卡片打爆 Astro 渲染器 + tsserver OOM
- `src/utils/people.ts` 新建 — `findPersonId / getPerson / personDisplayName / normalizeName`，模糊匹配 + 剥离 honorific
- `src/data/debates.ts` — `Debate` 接口加 `personIds / topicIds / relatedPolicyIds / relatedLeverNumbers / relatedTimelineYears / relatedPostSlugs`，全部 150 records 通过 `scripts/codemod-debates.ts` 自动注入。218/255 (85%) speakers 解析到 personId
- `src/data/policies.ts` — `Policy` 接口加 `id / ministry / authorPersonIds / relatedDebateIds / relatedLeverNumbers / relatedTimelineYears / relatedPostSlugs`，30 records 通过 `scripts/codemod-policies.ts` 注入
- `src/data/levers.ts` — `LeverItem` 加 `id / relatedPolicyIds / relatedDebateIds`；`Lever` 加 `championPersonIds / relatedPolicyIds / relatedPostSlugs`。111 LeverItems 通过 `scripts/codemod-levers.ts` 注入
- `src/data/timeline.ts` — `TimelineEvent` 加 `id (evt-${year}) / date / personIds / relatedPolicyIds / relatedDebateIds / relatedPostSlugs`。11 events 全部加 id
- `src/content/config.ts` — blog frontmatter 加 `relatedPolicyIds / relatedDebateIds / relatedLeverNumbers / relatedTimelineYears / relatedPersonIds / citations / tocDepth`

#### 工具与路由
- `src/utils/graph.ts` 新建 — `getRelated(EntityRef): RelatedBundle`，反向索引 `debatesByPersonId / policiesByPersonId`，`getPersonCounts(id)`
- `src/pages/people/[id].astro` 新建 — getStaticPaths 生成 220 个个人页（counts + summary + channels + 国会发言列表 + 主导政策列表）
- `src/pages/debates/index.astro` — speaker 卡片显示 `Person.zhName`，链接到 `/people/[id]/`
- `scripts/verify-graph.ts` 新建 — CI 守卫所有外键解析；hook 进 `npm run check:graph`

#### 工具修复
- `tsconfig.json` 排除 `scripts/out/`（auto-generated，会让 astro check OOM）
- `eslint.config.js` 同步排除
- `.gitignore` 加 `scripts/out/`
- `tsx` 装为 devDependency

### ✅ Phase 4 · RelatedRail 跨页互联（已上线 v0.0.27）
Commit `cb67c09`。

- `src/components/data/RelatedRail.astro` 新建
  - `variant: 'compact' | 'full'`
  - `hideWhenEmpty=true` 默认 — 关系空时**不渲染任何 DOM**
  - 支持 `entity`（自动 getRelated）或 `bundle`（caller 预构建）
- 集成位置：
  - `/policies/` 每张卡片底部（compact）
  - `/levers/` 每个抓手底部（compact）
  - `/timeline/` 每个事件底部（compact）
  - blog post detail 在 SinglePost 后（full，从 frontmatter 构建 bundle）
  - `/people/[id]` 不动（已有自定义 related 渲染）
  - `/debates` 不动（性能敏感，留 Phase 2）
- 手填 8 处示范关联：2 blog post + 2 lever + 2 policy + 2 timeline event
- `Post` interface（types.d.ts）加 5 个 cross-ref 字段；`getNormalizedPost`（utils/blog.ts）透传

### ✅ Trailing-Slash 修复（已上线 v0.0.28）
Commit `8bb97b9`。生产审计发现 18/20 内部链接走 308 redirect。

- `src/config.yaml`: `SITE.trailingSlash: true`
- `astro.config.ts`: `trailingSlash: 'always'` + `build.format: 'directory'`
- 修复硬编码非 trailing-slash 链接：index.astro Hero CTA、RelatedRail（静态 + 动态 `/people/${id}/` `/${slug}/`）、`/people/[id]` 面包屑/数据页链接、/debates speaker chips、/legal-ai

### ✅ Phase 2 · 长文阅读体验（第一波，已上线 v0.0.30）
Commits `08c1ef8`（4 长文组件）+ `6a3b30a`（修 TOC 视觉重叠）。

- `src/components/longform/TableOfContents.astro` — 从 post.headings 自动生成 h2/h3 锚点。**目前只用 inline 折叠版**（`<details>`），固定侧边栏因 prose 导致的 max-w-3xl→60rem 升级 + Tailwind 类宽度异常导致 1280-1700px 全部重叠正文，已撤；3-column grid 留待 Phase 3 NarrativeLayout
- `src/components/longform/AuthorBio.astro` — 通过 `relatedPersonIds[0]` 或 `findPersonId(author)` 解析人物，渲染 avatar + 名字（链 `/people/[id]/`）+ 简介 + channels
- `src/components/longform/NextPrevPost.astro` — fetchPosts 已排序，按 index 找前后篇
- `src/components/longform/ReadingProgress.astro` — 顶部 2px 进度条，rAF 驱动
- `src/utils/blog.ts` getNormalizedPost 透传 `headings`
- `src/types.d.ts` Post 加 `headings` 字段
- `src/pages/[...blog]/index.astro` 集成：ReadingProgress + TOC（顶部）+ AuthorBio + RelatedRail + NextPrevPost（SinglePost 后）

---

## 剩余工作（按 plan 顺序）

### Phase 2 · 余项（视情况）
- [ ] `Footnotes.astro` + `Cite id="..."` — 引用 + 脚注（依赖 frontmatter `citations`，Phase 1.11 schema 已加）
- [ ] **三套统一 layout**：`ListLayout` / `DataPageLayout` / `NarrativeLayout`（高侵入性，重写 7 个数据页面）
- [ ] `EntityFilters.astro` — URL-param 共享筛选（替换 /debates 的 inline filter）

### Phase 3 · 视觉识别 + 导航 + 首页（推荐下一步做）

- [ ] **签名色** `--color-primary: #C8102E`（Vermillion）+ `--color-ink #1a1a1a` + `--color-paper #FAF7F2` + `--color-accent-growth #0B6E4F`
- [ ] **字体主题化**：Source Serif 4（已装）+ Noto Serif SC（已装）→ wire CSS vars in `src/components/CustomStyles.astro`
- [ ] **去 emoji**：导航、Stats、Headers 全部去；保留 narrative 文章内每篇 ≤1 个
- [ ] **导航重构** `src/navigation.ts`：17 项 4 组 → 5 组扁平化（**观点** 顶级提出 / 政策与战略 / 辩论与声音 / 数据追踪 / 关于）
- [ ] **首页 editorial 重写** `src/pages/index.astro`：删 11 张 feature card，改 Hero 单段引言 + 1 CTA + Freshness 条 + Latest 3 posts + Most-active 3 levers + Latest 5 debates
- [ ] **about 页** `src/pages/about/index.astro`：Luca 人格 + 为什么做 + 研究方法 + 利益声明

### Phase 4 余项 · 全文搜索

- [ ] Pagefind 集成 + `<SearchModal />`（`/` 键唤起）
- [ ] 实体页 backlink rail（`/policies/[id]` `/debates/[id]` 等独立页面，目前都是 index）

### Phase 5 · 国际化（可选，可降到 v1.1）

- [ ] EN toggle / Per-page lang
- [ ] 全站 alt= 审计（当前 7 处）
- [ ] /debates 移动端筛选抽屉
- [ ] `:focus-visible` 全站审

### Phase 6 · 验证发布

- [ ] Lighthouse CI（移动 LCP /debates < 2.5s）
- [ ] 视觉回归
- [ ] PDF 压缩（11 MB → < 3 MB）

---

## 关键路径与术语速查

| 路径 | 用途 |
|---|---|
| `src/data/people.ts` | 220 人物 master，Phase 1 SSOT |
| `src/data/mp-stubs.json` | 213 auto-seeded MP stubs（人手补 `[需补充]`）|
| `src/utils/people.ts` | findPersonId / getPerson / personDisplayName / normalizeName |
| `src/utils/graph.ts` | getRelated(EntityRef) / getPersonCounts(id) |
| `src/components/data/RelatedRail.astro` | compact/full 跨页互联组件，hideWhenEmpty 默认 |
| `src/components/longform/*` | TOC / AuthorBio / NextPrevPost / ReadingProgress |
| `scripts/audit-speakers.ts` | 扫描 debates speaker 字符串 → matched/unseen 桶 |
| `scripts/codemod-debates.ts` `codemod-policies.ts` `codemod-levers.ts` | 数据 schema 注入（一次性，幂等）|
| `scripts/verify-graph.ts` | CI 守卫外键完整性（hook 进 `npm run check`）|

## 数据规模

- 220 人物（7 curated + 213 stub）
- 150 国会辩论
- 30 政策
- 6 抓手 / 111 LeverItems
- 11 时间线节点
- 4 blog posts
- 总构建：258 pages（38 static + 220 person）

## 开发指令

```bash
npm run dev                 # localhost:4329（per launch.json）
NODE_OPTIONS=--max-old-space-size=4096 npm run check
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# 数据迁移（一次性）
npx tsx scripts/audit-speakers.ts
npx tsx scripts/codemod-debates.ts
npx tsx scripts/codemod-policies.ts
npx tsx scripts/codemod-levers.ts

# CI guard（每次 check 自动跑）
npx tsx scripts/verify-graph.ts
```

## 已知陷阱

1. **astro check OOM**：`scripts/out/*.ts` 含未关闭的 trailing comma syntax 会让 tsserver 进入指数级 recovery；`tsconfig.json` 必须 exclude
2. **220 Person literal 数组**：直接放 .ts 会让 tsserver/Volar 在 .astro 文件 diagnostic 时 OOM，必须 JSON 化
3. **/voices 渲染**：220 人物卡片打爆 Astro 模板渲染器，必须分 `people` (curated) + `mpStubs` (auto)
4. **Cloudflare 308**：内部链接必须用 trailing slash，否则每次点击重定向
5. **Prose max-width 升级**：Tailwind `prose-md lg:prose-xl` 把 article 宽度升到 60rem（不是 max-w-3xl 的 48rem），影响侧边栏定位
6. **Astro 内联 script 在条件块内**：prettier 解析失败，必须放 top-level + 内部 early-return

## 决策记录

- **/debates JSON 内联**：迁到 inline cards，gzip 后 80→206 KB（d.summary 全文进 HTML）；LCP 显著好转，总传输略增；Phase 4 后续可改为 `<template>` lazy expand
- **mpStubs 加载方式**：尝试过 `import * as`、`.d.ts` shim、fs.readFileSync runtime，最终 `import x from './mp-stubs.json'` 配合 `as Person[]` cast 工作（OOM 真因是 scripts/out 中间文件）
- **TOC 固定侧边栏**：撤回，改 inline only；3-column grid 留 Phase 3
- **/blog 定位调整**：用户选 "并列重要 + 双向打通"（不是把 /blog 作为主产品也不是副产品）

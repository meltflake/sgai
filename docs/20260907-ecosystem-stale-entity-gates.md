# 2026-09-07 ecosystem 管线加旧闻过滤和实体名抽取

## 起因

今早的 ecosystem 自动 PR（#294）提了两条：一条是政府科技局 2020 年 6 月的 ICT 支出新闻稿，一条把商业时报的文章标题 “The AI Push Is Becoming an Energy Race: Sembcorp” 当成了实体名，`founded` 填的是文章发表月份。管线里没有任何一步看日期，实体名直接照抄摘要器整理过的标题。

## 改了什么

旧闻过滤（`scripts/lib/stale-gate.ts`）

- 默认窗口 180 天，`--max-age-days=N` 可改，`0` 关掉。
- 扫描阶段用便宜的线索：RSS 的 pubDate、sitemap 的 lastmod、URL 路径里的年份。sitemap 读取器现在连 lastmod 一起返回。
- 抓取后用页面的日期，没有的话用摘要器从正文读到的日期。日期完全不明的页面放行，交给人审。
- 丢掉的 URL 记进本机扫描状态文件的 `staleUrls`，下次扫描直接跳过，不再抓。政府科技局的 sitemap 有几百个老页面，不记的话每个月都会把候选池填满。

实体名抽取（`scripts/lib/extract-entity.ts`）

- 摘要之后加一次模型调用，读正文回答三件事：页面主要讲的是哪一个机构 / 项目 / 产品，它的正式名称是什么，原文有没有写成立年份。
- 记录的 `name` / `nameEn` / `id` 用实体名；标题保留在 `discoveryNote` 里做溯源。
- `founded` 只在原文写明时才填，发表日期不再当成立日期。
- 页面不是讲单一实体（趋势、预算、活动、观点）且判断为高置信的，直接丢。
- 实体已经在 `ecosystem.ts` 里（按 id 或英文名）的，报 already-covered，不重复加。
- 模型出错时保守处理：保留条目、低置信、用标题当名字，人在 PR 里改。

流程调整

- 原来在 `run.ts` 里的 AI 相关性判断挪进 `enrich.ts`，每个候选按 抓取 → 旧闻 → 摘要 → 空壳 → AI 相关性 → 实体抽取 → 去重 的顺序过门，便宜的先跑。
- `--limit` 现在数采纳的条目，扫描池放大 4 倍，所以丢了几个也能凑够数。
- PR 正文多一节 “Dropped before emit”，列出每条被丢的 URL 和原因，方便否决。

## 验证

- 新增单元测试：`stale-gate`、`extract-entity`、ecosystem `emit`，连同原有 `test:lib` 全部通过。
- 真跑一次 `--no-commit --limit=2`：候选池 8 条，3 条商业时报文章被 AI 相关性判断丢掉（中国、台湾、数字服务设计），5 条政府科技局页面按正文日期判为旧闻（2015 到 2022 年），没有一条进 emit。5 条旧闻 URL 已记进状态文件，再扫直接跳过。
- 扫描阶段单独看政府科技局 sitemap：663 个 URL 里 102 个在抓取前就按 lastmod 或 URL 年份丢掉。
- 抽取器直接跑 #294 那两页：Sembcorp 那篇给出 “Sembcorp Industries”、高置信、`founded` 为空；2020 年新闻稿判为 “预算公告，不是单一实体”、高置信。
- 一个中途发现的坑：sitemap 的 lastmod 是 “最后修改”，站点迁移后所有老页面都是 2026 年。第一版把它当发表日期，两个 URL 里明写 2021、2022 的页面就漏过了扫描。改成 lastmod 和 URL 年份只能证明 “旧”，不能证明 “新”，发表日期才有决定权。

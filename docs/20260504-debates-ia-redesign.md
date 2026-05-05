# `/debates/` 信息架构重排记录

日期：2026-05-04（初版）；2026-05-05（增补设计选择与演进 trigger）

## 已完成

把 `/debates/` 从"长报告优先"改成"检索入口优先"。

**页面结构**

- 标题下方新增检索区：搜索框 + 类型 / 议题 / 年份 / 议员 / 争议度 5 个 select。
- 8 个快捷筛选 chip：最新场次、最新年份、数据主权、就业、治理、国家安全、医疗、高争议。
- "按议题浏览"移到检索区之后，并隐藏计数为 0 的议题。
- 统计卡压缩成档案概览：总数、年份范围、更新时间、类型分布；年份趋势缩小为可点击柱状图。
- 辩论记录移到分析内容之前，默认压缩展示。
- 记录卡保留详情页和 Hansard 链接；长摘要、立场、引用和原文节选放入展开区。
- 核心洞察、政策演变、反复争议、政策张力、议员档案、政策信号合并到后置的"分析视角"区。
- 中文页和英文页共用同一组件 [`src/components/debates/DebatesIndex.astro`](../src/components/debates/DebatesIndex.astro)，避免信息架构分叉。

**数据归一**

- `Oral Answer` 归并为 `Oral Answers to Questions`。
- 漂移议题归并回受控词表：
  - `AI & Workforce` → `AI & Employment`
  - `AI Employment & Jobs` → `AI & Employment`
  - `AI Ethics & Safety` → `AI Safety & Ethics`
  - `AI & Economy` → `AI Economy & Industry`
  - `AI Startups & Ecosystem` → `AI Economy & Industry`
- 重新计算 `DEBATE_STATS.byType` / `DEBATE_STATS.byTopic` / `topSpeakers`。
- 统计校验：总数 153；类型统计合计 153；页面展示计数与实际记录一致。

**验证**

- `npm run check` 通过。
- `npm run build && npm run check:i18n` 通过（0 中文残留）。
- 390px 移动视口检查：`document.documentElement.scrollWidth === window.innerWidth`，无横向溢出。
- 手动验证筛选入口：类型、议题、年份、议员、争议度、快捷 chip、搜索、清除筛选。

## 设计选择（不是疏漏）

**分析视角区 6 个 section 线性平铺**

`/debates/` 是档案页，主用户是研究/政策从业者深读，不是新闻刷屏读者。为深读优化的 IA 是**目录全展开 + 顺序阅读**，而不是 tab/accordion——后者会增加点击成本、隐藏内容。

不上 tab 也不上 accordion；首屏轻量化由"检索区前置 + 分析视角后置"提供，分析视角本身按重要性顺序排：核心洞察 → 政策演变 → 反复争议 → 政策张力 → 议员档案 → 政策信号。

**客户端筛选用 vanilla DOM 全量过滤**

153 条记录全量 SSR 渲染，客户端用 `<script define:vars>` 内联 JS 直接 `setAttribute('hidden')` 控制显隐。规模够用，无依赖。不上虚拟滚动 / 不上索引化搜索 / 不上服务端筛选——它们都是为大数据集设计的，153 条用上就是过度工程。

**全部检索区在单文件 `DebatesIndex.astro` 内聚**

不抽 SearchBar / FilterChip / DebateCard 等子组件。原因：所有状态都耦合在 `<script define:vars>` 注入的 closure 里，抽出去要么用 props 把 closure 拆掉（CSR 状态更复杂），要么走全局 store（违反 Astro 最小客户端原则）。当前文件 1218 行可读、可改、可 grep。

**zh / en 共用同一组件**

`src/pages/debates/index.astro` 和 `src/pages/en/debates/index.astro` 都直接 `import DebatesIndex` + 传 `lang` prop。文案 / 标签 / select 选项都在组件内部按 `lang` 切换。避免信息架构分叉。

## 后续演进 trigger

| 触发条件 | 演进动作 |
|---------|---------|
| debates.length > 500 | DOM 全量过滤改为索引化（minisearch / lunr.js），或服务端筛选 + URL query state |
| 移动 chip 文字截断 / 误触频繁 | chip 升级为 icon + tooltip 设计；考虑给 8 个 chip 分两行 |
| 出现非 AI debates（如同站扩展到其他议题） | 拆 collection（`/ai-debates/` `/sustainability-debates/`），不是单页内分页 |
| 用户反馈"分析视角太长不想滚" | 加一个跳锚按钮区"跳到：核心洞察 / 政策演变 / 反复争议 ..."，但仍不上 tab |
| 检索结果常为空 | 加"撤回最近一个筛选"按钮；当前是手动点"清除全部" |
| 页面 LCP > 3s | 拆 SSR 数据；考虑分页或 lazy 加载分析视角区 |

## 文件位置

- 共享组件：[`src/components/debates/DebatesIndex.astro`](../src/components/debates/DebatesIndex.astro)
- zh 入口：[`src/pages/debates/index.astro`](../src/pages/debates/index.astro)
- en 入口：[`src/pages/en/debates/index.astro`](../src/pages/en/debates/index.astro)
- 数据：[`src/data/debates.ts`](../src/data/debates.ts)（含 `DEBATE_STATS`）

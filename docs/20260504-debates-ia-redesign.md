# `/debates/` 信息架构重排记录

日期：2026-05-04

## 目标

把 `/debates/` 从“长报告优先”改成“检索入口优先”。第一屏先提供搜索、筛选、快捷入口和议题浏览；分析内容后移，作为二级阅读层。

## 页面结构调整

- 标题下方新增检索区：搜索、类型、议题、年份、议员、争议度。
- 新增 8 个快捷筛选：最新、最新年份、数据主权、就业、治理、国家安全、医疗、高争议。
- “按议题浏览”移到检索区之后，并隐藏计数为 0 的议题。
- 统计卡压缩成档案概览：总数、年份范围、更新时间、类型分布；年份趋势缩小为可点击柱状图。
- 辩论记录移到分析内容之前，默认压缩展示。
- 记录卡保留详情页和 Hansard 链接；长摘要、立场、引用和原文节选放入展开区。
- 核心洞察、政策演变、反复争议、政策张力、议员档案、政策信号合并到后置的“分析视角”区。
- 中文页和英文页共用同一组件，避免信息架构分叉。

## 数据归一

- `Oral Answer` 归并为 `Oral Answers to Questions`。
- 漂移议题归并回受控词表：
  - `AI & Workforce` → `AI & Employment`
  - `AI Employment & Jobs` → `AI & Employment`
  - `AI Ethics & Safety` → `AI Safety & Ethics`
  - `AI & Economy` → `AI Economy & Industry`
  - `AI Startups & Ecosystem` → `AI Economy & Industry`
- 重新计算 `DEBATE_STATS.byType`、`DEBATE_STATS.byTopic`、`topSpeakers`。
- 统计校验：总数 153；类型统计合计 153；页面展示计数与实际记录一致。

## 验证

- `npm run check` 通过。
- `npm run build && npm run check:i18n` 通过。
- 390px 移动视口检查：`document.documentElement.scrollWidth === window.innerWidth`，无横向溢出。
- 手动验证筛选入口：类型、议题、年份、议员、争议度、快捷 chip、搜索、清除筛选。

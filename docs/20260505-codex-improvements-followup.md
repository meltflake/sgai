# Codex 改造 follow-up（2026-05-05）

## Context

2026-05-04 codex 完成三块改造：

1. `/debates/` 信息架构重排——从"长报告优先"改为"检索入口优先"
2. `/benchmarking/` 加 case 详情页 + region 内每张卡都能下钻
3. `/opensource/` 卡片化 + 详情页

落地后两份记录文档都是事后回填的执行日志（[`docs/codex-worklogs/20260504-task_plan.md`](codex-worklogs/20260504-task_plan.md) 三块全 `[complete]`、[`docs/20260504-debates-ia-redesign.md`](20260504-debates-ia-redesign.md) 全过去时），不留改进空间。本文是 2026-05-05 的事后审阅 + 改进规划，已实施部分均带验证证据。

## 已完成审计（带证据）

| # | 问题 | 证据 | 严重度 | 处理 |
|---|------|------|--------|------|
| 1 | `/benchmarking/` 一次生成 183 个子目录，~150 个 drilldown 正文 1-2 句 + 模板套话 | [`src/utils/entity-pages.ts:130-141`](../src/utils/entity-pages.ts) 的 body 字段；抽样 [dist/benchmarking/estonia-comparative-strength/](../dist/benchmarking/estonia-comparative-strength/index.html) | 🔴 thin content / SEO doorway | P3a + P3b 处理 |
| 2 | OpenSource 列表卡疑似 `<a>` 嵌套 `<a>` | grep 全文件 + 读 [`src/pages/opensource/index.astro`](../src/pages/opensource/index.astro) | 🟢 **实际不存在**——审阅时发现 ai-verify 块（独立 div）和 openSourceProjects 网格（卡是 a，内部纯文本）是平行的，不嵌套 | 跳过 |
| 3 | `/benchmarking/[region].astro` 一文件挑 region/case/drilldown 三种 page.kind，640 行 | `page.kind === 'case'` / `'region'` / `'drilldown'` 三个分支共存 | 🟡 路由耦合 | P1 处理 |
| 4 | 详情页 layout 不统一 | benchmark 内联 vs OpenSourceProjectDetail 抽组件 | 🟡 维护成本 | P2 评估后**不抽**——PageLayout 已处理 breadcrumb，三个 profile 已用相同 Tailwind tokens |
| 5 | llms.txt SEO 入口偏倾 | "182 international benchmark profiles" 一行带过；hong-kong drilldown 收录 46 行但 12 个 case 不显式列出 | 🟡 LLM 易把 sgai 误判成 doorway | P4 处理 |
| 6 | Debates 分析视角 6 个 section 平铺 | [`src/components/debates/DebatesIndex.astro:763-1012`](../src/components/debates/DebatesIndex.astro) | 🟢 用户拍板"档案页定位，维持线性" | P5 文档化为 explicit 设计选择 |

## 已实施改造

### P0 — OpenSource 嵌套 a 修复（跳过）

事实核查后发现**没有嵌套**，规划前提不成立。详情见审计 #2。

### P1 — benchmarking 路由 dispatcher 拆分 ✅

把 [`src/pages/benchmarking/[region].astro`](../src/pages/benchmarking/%5Bregion%5D.astro) 从 640 行降到 19 行 dispatcher：

```
[region].astro → 按 page.kind 选组件（zh + en 共 2 个 dispatcher）
src/components/benchmarking/RegionProfile.astro    (新)  ← 11 个 region 页
src/components/benchmarking/CaseProfile.astro       (新)  ← 12 个 case 页
src/components/benchmarking/DrilldownProfile.astro  (新)  ← 160 个 drilldown 页
```

每个 profile 接 `page` + `lang` props，内部按 `lang` 切换文案 + URL 前缀，避免 zh/en 模板分叉。

**验证**：

```bash
find dist/benchmarking -type d | sort > /tmp/before.txt
# (refactor + build)
find dist/benchmarking -type d | sort > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt   # 应该一致
```

实测 183 个目录 100% 一致，URL pattern 没动。

### P2 — DetailPageLayout（评估后跳过）

P1 完成后重新评估 P2。结论：

- [`src/layouts/PageLayout.astro`](../src/layouts/PageLayout.astro) 已处理 breadcrumb / metadata / robots
- 三个 profile 都用相同 Tailwind tokens（`t-h1` `text-muted` `bg-surface` `callout-note`）
- 详情页结构差异（drilldown 简洁 / case 双栏 / region 多 section）使统一容器反而增加 prop 复杂度

抽象化等到第 4 个详情页类型出现再做，遵循"3 similar lines is better than a premature abstraction"原则。

### P3a — drilldown schema 升级 + 渲染回退 + noindex ✅

**Schema**

[`src/data/benchmarking.ts`](../src/data/benchmarking.ts) `RegionDetail` 加可选字段：

```typescript
drilldownEnrichments?: Record<string, BenchmarkDrilldownAnalysis>;

interface BenchmarkDrilldownAnalysis {
  analysis: string;
  analysisEn?: string;
  sources?: BenchmarkAnalysisSource[];
}

interface BenchmarkAnalysisSource {
  label: string;
  labelEn?: string;
  url: string;       // 必须 HTTP 可达，沿用 CLAUDE.md sourceUrl 规则
  date?: string;
}
```

key 用 `localId`（`core-strategy` / `strategy-1` / `investment-3` / `initiative-2` / `body-4` / `comparative-strength` / 等），单一字段统一覆盖 6 种子项类型。

**渲染**

[`src/utils/entity-pages.ts`](../src/utils/entity-pages.ts) `addPage`：

- 有 `drilldownEnrichments[localId]` → `body` 用 `analysis`，`analysisSources` 透传，`analysisPending: false`
- 没有 → 沿用现有自动生成的模板 body，`analysisPending: true`

**noindex 自动开关**

[`src/components/benchmarking/DrilldownProfile.astro`](../src/components/benchmarking/DrilldownProfile.astro) 根据 `analysisPending` 输出 `<meta name="robots" content="noindex,follow">`。补深完成自动转为可索引。

**验证**：构建后 grep `dist/benchmarking/*/index.html` 中 `content="noindex` 出现 160 次（thin drilldown），22 次未出现（11 region × 2 + 12 case 中可索引部分），符合预期。

### P3b — 内容补深 ✅（脚手架就绪 / 内容 Luca 接手）

详细工作流见 [`docs/20260505-drilldown-enrichment-playbook.md`](20260505-drilldown-enrichment-playbook.md)。本 agent **不**自动写入 enrichment——深度分析每条需 verified sourceUrl，LLM 自动化容易编造（CLAUDE.md sourceUrl 真实性约束的根因）。

预期节奏：

| 周 | 范围 | 估计页数 |
|----|------|----------|
| W1 | Singapore + Hong Kong | ~46 |
| W2 | Canada / Estonia | ~45 |
| W3 | UK / Korea / Israel | ~30 |
| W4 | UAE / Switzerland / Finland 余下 | ~30 |

每周做一区，每条 200-400 字 + 1 个数字 + 1 个原文链接 + 1 个判断句。

### P4 — llms.txt 显式分组 + URL 校验 ✅

[`src/pages/llms.txt.ts`](../src/pages/llms.txt.ts)：把 `benchmarking` 从一行 "182 international benchmark profiles" 改为：

```
- /benchmarking/ — 10 region profiles, 12 concrete benchmark cases,
  and {N} enriched region drilldowns. Stub drilldowns are excluded
  from indexing until deep analysis is added.
```

[`src/pages/llms-full.txt.ts`](../src/pages/llms-full.txt.ts)：drilldown 段加 `.filter((page) => !page.analysisPending)`，stub 不入索引。补深一条自动多收录一条。

**验证**：构建后 `grep -c "/benchmarking/" dist/llms-full.txt` 从 365 降到 45（10 region zh + 10 region en + 12 case zh + 12 case en + 1 root），thin drilldown 完全从 SEO 入口排除。

**URL 校验脚本**

[`scripts/check-benchmarking-urls.ts`](../scripts/check-benchmarking-urls.ts)：复用 [`scripts/lib/url-check.ts`](../scripts/lib/url-check.ts) 的 `validateUrls`。命令：

```bash
npx tsx scripts/check-benchmarking-urls.ts
# exit 0 = 全可达；exit 2 = 有 broken URL，diagnostic 输出
```

PR 流程在 P3b playbook 里强制此校验。

### P5 — Debates 文档重写 ✅

[`docs/20260504-debates-ia-redesign.md`](20260504-debates-ia-redesign.md) 从过去时记录改成三段式：

1. **已完成**：原页面结构、数据归一、验证（保留）
2. **设计选择（不是疏漏）**：分析视角线性平铺、vanilla DOM 过滤、单组件内聚、zh/en 共用——每条带 explicit reasoning
3. **后续演进 trigger**：6 条触发条件 → 演进动作映射，包含 debates.length > 500、出现非 AI debates 等

Debates 实际代码不动（用户决定维持现状）。

### P6 — Codex worklog 归档 + 主规划文档落仓库 ✅

```
task_plan.md   → docs/codex-worklogs/20260504-task_plan.md
progress.md    → docs/codex-worklogs/20260504-progress.md
findings.md    → docs/codex-worklogs/20260504-findings.md
```

每份头部加 HTML 注释指向本文。

仓库根不再有 `task_plan.md` / `progress.md` / `findings.md` 散文件。

## 验证总览

每个 P 完成后均跑：

```bash
npm run check                            # eslint + prettier + astro check + graph
npm run build                            # 2517 page(s) built
node scripts/i18n-check.mjs              # 0 中文残留
```

P3a / P4 还跑了：

```bash
# 路径一致性
find dist/benchmarking -type d | sort > /tmp/after.txt   # 183 行，与改造前 diff 为空
# noindex 覆盖
grep -l 'content="noindex' dist/benchmarking/*/index.html | wc -l   # 160 (thin) + 22 (indexable)
# llms 收录收敛
grep -c "/benchmarking/" dist/llms-full.txt   # 45
```

## 后续节奏

- **每周一区** 跑 P3b drilldown 内容补深（参 [`docs/20260505-drilldown-enrichment-playbook.md`](20260505-drilldown-enrichment-playbook.md)）
- **每条 enrichment 落地后** llms.txt 自动多收录一行——不需手动维护索引
- **文档/规划要求**：以后写 plan/worklog 沿用本文格式（Context → 已完成审计 → 改造分 P → 验证 → 后续节奏），避免再出现"事后回填执行日志"

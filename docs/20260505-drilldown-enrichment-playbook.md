# Benchmark drilldown 内容补深 playbook（2026-05-05）

## 背景

`/benchmarking/[region]-{strategy/investment/initiative/body/comparative-strength}/` 这类下钻页是从 [`src/utils/entity-pages.ts`](../src/utils/entity-pages.ts) 自动生成的。在 2026-05-04 codex 改造之后，其中约 160 页正文只有 1-2 句 + "本页面用于沉淀，后续可补充"模板套话——典型的浅 IA / thin content。

2026-05-05 改造把每个 drilldown 升级为可被人工补深的档案，但**默认 noindex**——只有真正补深之后才进搜索/llms 索引。规则一句话：**没有真实分析就不进索引**。

## 数据 schema

`RegionDetail` 上加了一个可选字段：

```typescript
drilldownEnrichments?: Record<string, BenchmarkDrilldownAnalysis>;
```

key 用 `localId`（[`entity-pages.ts`](../src/utils/entity-pages.ts) 给每个 drilldown 起的本地 id），值是：

```typescript
interface BenchmarkDrilldownAnalysis {
  analysis: string;       // 200-400 字深度中文分析
  analysisEn?: string;    // 同等深度英文（缺则 EN 页回退到 zh）
  sources?: BenchmarkAnalysisSource[];  // 结构化原文引用
}

interface BenchmarkAnalysisSource {
  label: string;          // 中文 source 标题
  labelEn?: string;       // 英文 source 标题
  url: string;            // **必须 HTTP 可达**（HEAD 200/301/302/303/307/308，或 401/403/429 反爬+档案站快照证明）
  date?: string;          // 'YYYY-MM-DD'，原文发布日
}
```

key 取值（按 region 内的 drilldown 类型）：

| 类型 | key 形式 | 数量 |
|------|---------|------|
| 4 个 summary 类 | `core-strategy` / `investment-overview` / `governance-model` / `comparative-strength` | 每 region 4 |
| strategy 子项 | `strategy-1` / `strategy-2` / ... | 看 `detail.strategies.length` |
| investment 子项 | `investment-1` / `investment-2` / ... | 看 `detail.investment.length` |
| initiative 子项 | `initiative-1` / `initiative-2` / ... | 看 `detail.keyInitiatives.length` |
| body 子项 | `body-1` / `body-2` / ... | 看 `detail.keyBodies.length` |

### 举个完整例子

```typescript
{
  flag: '🇭🇰',
  name: '香港',
  // ... existing RegionDetail fields ...
  drilldownEnrichments: {
    'comparative-strength': {
      analysis: '香港相对新加坡的真正杠杆是大湾区桥梁——把内地市场和国际资本接到一起。具体表现：（1）3000 PFLOPS 超算规划在 2024 年公布，超过新加坡现有...（300 字以内）',
      analysisEn: 'Hong Kong\'s real edge versus Singapore is the Greater Bay Area bridge — connecting the mainland market with international capital. Specifically: (1) the 3000 PFLOPS supercomputing plan ...',
      sources: [
        {
          label: '数码港 AI 超级算力中心新闻稿',
          labelEn: 'Cyberport AI Supercomputing Centre announcement',
          url: 'https://www.cyberport.hk/...',  // 真实可达 URL
          date: '2024-10-23',
        },
      ],
    },
  },
}
```

Drilldown 渲染逻辑 ([`src/utils/entity-pages.ts`](../src/utils/entity-pages.ts) `addPage`)：

- 有 `drilldownEnrichments[localId]` → `body` 用 `analysis`，`bodyEn` 用 `analysisEn`，`analysisSources` 透传到页面，`analysisPending: false`
- 没有 → 沿用现有自动生成的模板 body，`analysisPending: true`，页面输出 `<meta name="robots" content="noindex,follow">`

## 工作流程

### 1. 选目标

每周做一区。优先级：先补 region 数最多/曝光最高的（singapore / hong-kong / canada / estonia），再向小区域扩展。

```bash
# 看每个 region 有多少个待补 drilldown
npm run build && find dist/benchmarking -name "index.html" | xargs grep -l 'content="noindex' | sed 's|/index.html||' | sed 's|.*/||' | sort | head -20
```

### 2. 起草

每条 enrichment 必须含：

- **1 个数字**（金额、PFLOPS、用例数、年份等可校验事实）
- **1 个原文链接**（必须 HEAD 可达，或反爬+archive.org 快照证明）
- **1 个判断句**（这条对新加坡的启示是什么）

200-400 字。中英文同时提供（缺英文 → EN 页面会回退到中文，违反 i18n 规则）。

**禁止**：
- 凭训练记忆构造 URL（LLM 在 URL 模式正确时会幻觉填假 ID，参见 CLAUDE.md sourceUrl 章节的 c574e54 事故）
- 写"本页待补充"这类模板套话
- 全自动 LLM 生成（深度分析 LLM 容易编造数字和细节，必须人工审）

### 3. URL 验证

写入 `analysisSources[].url` 之前，每条都要 HEAD 验证：

```bash
# 单条
curl -I -L --max-time 10 "https://example.com/page"

# 批量（基础版）
node -e '
const urls = ["https://...", "https://..."];
for (const u of urls) {
  fetch(u, { method: "HEAD", redirect: "follow" })
    .then(r => console.log(r.status, u))
    .catch(e => console.log("FAIL", u, e.message));
}'
```

可达性矩阵：

| HTTP 状态 | 可入库？ |
|-----------|----------|
| 200 / 301 / 302 / 303 / 307 / 308 | ✅ |
| 401 / 403 / 429 | ⚠️ 仅当 archive.org 有快照证明页面真实存在；analysis 文末注明"archive.org 快照确认" |
| 404 / 410 / 5xx | ❌ |
| 000（DNS 失败 / 超时） | ❌ |

存疑的 URL 不要赌——找替代，或留空。

### 4. 提交

每个 region 一个 PR。PR 描述含：

- 补深的 drilldown localId 列表（如 `singapore: core-strategy, strategy-1, investment-1`）
- 每条引用的 sourceUrl 列表
- 跑过的命令：`npm run check && npm run build && node scripts/i18n-check.mjs`

合并前自动验证：

```bash
npm run check                            # eslint / prettier / astro
npx tsx scripts/lib/i18n-pair.ts src/data/benchmarking.ts   # *En 配对
npm run build && node scripts/i18n-check.mjs                # 0 中文残留
```

### 5. 上线后

- region 内所有 drilldown 补深完成 → llms.txt / llms-full.txt 自动收录（P4 实现）
- thin 页 noindex，补深页正常索引
- 不需要等"全 region 都补完"才上 PR；每条 enrichment 都立即生效

## 节奏建议

| 周次 | 范围 | 估计页数 |
|------|------|----------|
| W1 | Singapore + Hong Kong | 23 + 23 ≈ 46 |
| W2 | Canada / Estonia | 30+15 ≈ 45 |
| W3 | UK / Korea / Israel | ~30 |
| W4 | UAE / Switzerland / Finland 余下 | ~30 |

每周 30-40 页，约 6-10 小时人工。视真实节奏调整。

## 配套脚手架

- ✅ schema 升级：`drilldownEnrichments` + `BenchmarkDrilldownAnalysis` + `BenchmarkAnalysisSource`（[src/data/benchmarking.ts](../src/data/benchmarking.ts)）
- ✅ 渲染回退：[src/utils/entity-pages.ts](../src/utils/entity-pages.ts) `addPage` 自动处理
- ✅ noindex 自动开关：[src/components/benchmarking/DrilldownProfile.astro](../src/components/benchmarking/DrilldownProfile.astro) 根据 `analysisPending` 输出 robots meta
- ✅ 结构化 sources 渲染：DrilldownProfile 优先用 `analysisSources`（带 url + date + 外链 icon）
- 🟡 llms.txt 分组（P4 待做）：只列已补深的 drilldown
- 🟡 URL 批量校验脚本（P4 待做）：复用 [scripts/voices/prospect-stubs.mjs](../scripts/voices/prospect-stubs.mjs) 的 validateUrls 模式

## 不做什么

- **不**给 region 加新的 strategy/investment/initiative 条目（数据补深 ≠ 数据扩张）
- **不**改 RegionSummary（顶层简表已稳定）
- **不**自动化（每条 analysis 必须人工 review，深度内容 LLM 容易编造）
- **不**为了赶进度妥协 sourceUrl 真实性（宁可少补几条，不要污染数据池）

## 历史决策记录

- 2026-05-05 初版：用户在三个选项（撤回 / 补深 / 维持）中选"保留 + 补深内容"。
- schema 用 `Record<localId, Analysis>` 而非平行字段：避免 6 种子项每个加 4 个字段的 schema 爆炸；缺点是 IDE 自动补全不强，但 localId 能在 entity-pages.ts 里集中维护。
- noindex 默认开：宁可慢慢扩展索引面，也不让 thin content 污染 SEO 信号。补深完成的 region 立刻进入索引。

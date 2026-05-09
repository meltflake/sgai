# sgai Evals 计划

**日期**：2026-05-09
**作者**：Nix（Luca 指示）
**目标**：把"AI 输出质量 + 数据完整性"从靠人肉发现踩坑，升级为持续自动巡检。

---

## 1. 为什么要做 evals

sgai 大量依赖 AI 生成内容（zh/en/ja 翻译、双语摘要、政策分类、人物补全）。当前防线：

- **源码层**：`scripts/lib/i18n-pair.ts` 扫数据文件 `*En` / `*Ja` 配对 + `i18n-config.ts` 字段完整性
- **构建层**：`check:i18n`（中文残留）+ `check:schema`（JSON-LD 字段断言）
- **管线层**：emit 时 baseline-vs-after diff，新引入 unpaired 自动 rollback；prospect apply 时 HEAD-check sourceUrl

漏洞（已知 / 已踩坑 / 待补）：

1. **URL 幻觉**：[c574e54](https://github.com/meltflake/sgai/commit/c574e54) 写入 2 条编造 URL。`apply` 时 HEAD-check 只跑一次，存量数据零巡检。
2. **AI 摘要 / 翻译退化**：`ai-summarize.ts` / `translate.ts` 没有金标对比，模型升级 / prompt 改动后无法回归。
3. **三语完整性**：现有 `i18n-pair.ts` 是字段级 + 部分 file 才配 schema。**页面级**完整性（每个新内容是否真的三语都渲染了 + sitemap / hreflang 是否齐全）目前没人查。这是 Luca 在 2026-05-09 明确加进来的需求。
4. **Schema rich results**：`check:schema` 是字段级断言，不验完整 Google Rich Results 规则。
5. **Voices 字段质量**：`signatureWork` / `notableQuotes` 入选门槛只有写在 CLAUDE.md，没自动校验。

evals 不是 unit test 的替代，是补**模型/数据层**的回归网。

---

## 2. 五个 evals 总览

| #   | Eval                | 目标                                        | 频率           | 成本   | 优先级    |
| --- | ------------------- | ------------------------------------------- | -------------- | ------ | --------- |
| 1   | **URL Health**      | 全量扫描 `src/data/*.ts` 中 sourceUrl 可达  | 周             | 零     | P0（先做） |
| 2   | **i18n Coverage**   | 每个页面 / 每条 record 三语齐全，sitemap 同 | 每 PR + 每构建 | 零     | P0        |
| 3   | **AI Summary**      | 金标样本回归                                | 月             | OpenAI | P1        |
| 4   | **Translation**     | 术语命中 + 长度 + 残留                      | 月             | OpenAI | P1        |
| 5   | **Schema RichRes**  | 抽样跑 Google Rich Results API              | 月             | 零（API 限流） | P2        |

P0 先建（零成本、防真实漏洞）；P1 等金标样本积累后建；P2 锦上添花。

---

## 3. 每个 eval 详细设计

### Eval 1：URL Health（sourceUrl 全量巡检）

**问题**：CLAUDE.md 已知盲区第 4 条——`sourceUrl` HTTP 健康度只有 `voices/prospect-stubs.mjs apply` 时拦一次，存量数据未周期性巡检。

**输入**：`src/data/*.ts` 中所有 `sourceUrl` / `url` 字段（含嵌套数组里的，如 `signatureWork[].sourceUrl` / `notableQuotes[].sourceUrl`）。

**执行**：复用 [`scripts/lib/url-check.ts`](../scripts/lib/url-check.ts) 的 `validateUrls()`，并发 6，超时 10s。

**断言**：
- 4xx（401/403/429 除外）→ FAIL
- 5xx / DNS / 超时 → FAIL
- 401/403/429 → WARN，输出"反爬墙，需手动验证"

**输出**：
- `scripts/evals/url-health/report-YYYYMMDD.json`：所有 URL + 状态 + 路径
- `scripts/evals/url-health/report-YYYYMMDD.md`：人读，按文件分组失败项

**命令**：
```bash
npm run eval:url            # 全量扫描
npm run eval:url -- --file=src/data/people.ts  # 单文件
```

**频率**：周（cron 周一 09:00 SGT，跟其他 refresh 管线对齐）。失败时通过 `gh issue create --assignee @me` 通知。

**实施估时**：半天。

---

### Eval 2：i18n Coverage（页面 + 数据完整性，Luca 新加）

**问题**：现有检查抓的都是"字段级"（兄弟字段是否存在）和"残留级"（HTML 里有没有中文）。但**页面级**没人查：

- 新加一条 ecosystem entity，build 后 `/zh/ecosystem/<slug>` 有了，`/ecosystem/<slug>`（en） / `/ja/ecosystem/<slug>`（ja）有没有？
- sitemap.xml 里这条 URL 三语都列了吗？
- `<link rel="alternate" hreflang>` 有没有指对方？
- 每条 record 的所有用户可见字段（不只是 i18n-config 里 require 的几个）是否真有非空 zh/en/ja？

**这是 Luca 2026-05-09 明确加进来的需求**："有多语言了，每增加一个内容，都需要多语言同步翻译，这种情况下，一个页面都不应该遗漏。"

**输入 + 断言**（四层叠加）：

#### Layer A：数据层 record 完整性（增强版 i18n-pair）

- 扫 `src/data/*.ts`，对每条 record 的**所有用户可见字段**（不只是 config 里 required 的）枚举 zh/en/ja 三语版本
- 字段识别策略：
  - 已在 `scripts/i18n-config.ts` 列出的 → 沿用（required = true 的不能空）
  - 未列出但值是 string + 含 CJK → 必须配 `*En` + `*Ja`，否则 FAIL
  - 嵌套数组（`signatureWork[]` / `notableQuotes[]` / `entities[]`）递归扫
- 输出 coverage 报告：每个文件总 record 数、三语齐全数、各字段缺失统计

#### Layer B：页面层 URL 三语 parity

- build 后扫 `dist/sitemap-*.xml`
- 对每个 zh URL（`/zh/<path>`），断言：
  - en 对应 `/<path>` 必须存在于 sitemap
  - ja 对应 `/ja/<path>` 必须存在
- 反之亦然：每个 en URL 必须有 zh + ja sibling
- 例外白名单：`/blog/*`（博客本身可能只有单语，需手动 frontmatter 声明 `i18n: ['zh']`）

#### Layer C：页面层 hreflang parity

- 对每个 build 出的 HTML，解析 `<link rel="alternate" hreflang="...">`
- 断言：必须含 `zh-CN` / `en` / `ja` / `x-default` 四条；href 必须真实可达（用相对路径或站内 URL 比对 sitemap）

#### Layer D：内容层语言纯度（增强 check:i18n）

- 现有 `scripts/i18n-check.mjs` 只查中文残留。扩展：
  - en 页面：禁止 CJK runs（已有）
  - ja 页面：必须**含**日文字符（hiragana/katakana），如果整页只有汉字 + 拉丁字母 → 怀疑漏翻
  - zh 页面：保留现状（不强制纯度）

**输出**：
- `scripts/evals/i18n-coverage/report-YYYYMMDD.md`
- 顶层 dashboard：每个页面族（debates / policies / videos / voices / ...）三语 coverage % + 趋势

**命令**：
```bash
npm run eval:i18n           # 全部四层
npm run eval:i18n -- --layer=a  # 仅数据层（快，几秒）
npm run eval:i18n -- --layer=b  # 仅 sitemap parity（需要先 build）
```

**频率**：
- Layer A：每 PR（加进 `npm run check`，零成本）
- Layer B/C/D：每构建（加进 `npm run check:dist`）

**实施估时**：1.5 天。Layer A 复用 i18n-pair AST 逻辑；Layer B 解析 sitemap.xml；Layer C 抽取 HTML head；Layer D 在现有 i18n-check.mjs 加 ja 路径。

---

### Eval 3：AI Summary 回归

**问题**：`scripts/lib/ai-summarize.ts` 输出依赖 Claude 模型 + prompt。模型升级（4.6 → 4.7）、prompt 改动后无法证明输出没退化。

**输入**：
- 10–20 条金标样本，存 `scripts/evals/ai-summary/golden/*.json`
- 每条含：原始内容（如 debate 全文）+ 已人工 review 通过的目标输出（zh/en/ja 摘要 + category + tags + confidence）

**执行**：跑 `aiSummarize()` 输出，与金标对比。

**断言**：
- JSON schema 合规（字段齐全、类型对）
- 分类落在闭集（有限集合内）
- zh 摘要长度在金标 ±30%
- en 摘要长度在金标 ±30%
- ja 摘要长度在金标 ±30%
- confidence ≥ 0.6
- 关键术语命中率 ≥ 80%（金标提取的人名 / 机构名 / 政策名必须出现）

**输出**：`scripts/evals/ai-summary/report-YYYYMMDD.md`，每条样本 PASS/FAIL + diff。

**命令**：
```bash
npm run eval:ai-summary
npm run eval:ai-summary -- --sample=debate-oral-4088
```

**频率**：月（cron 每月 1 号）+ 每次改 `ai-summarize.ts` 或换模型时手动触发。

**实施估时**：2 天。1 天攒金标（10 条），1 天写比对逻辑。

---

### Eval 4：Translation 回归

**问题**：`scripts/lib/translate.ts` 没有质量回归。术语翻译错（如把"人工智能"翻成"AI Singapore"）、整段漏翻、目标语言混入源语言，目前都靠 PR review 抓。

**输入**：
- 20 条金标 zh→en 样本 + 20 条金标 zh→ja 样本，存 `scripts/evals/translation/golden/`
- 每条含：源中文 + 已 review 通过的英文 / 日文翻译

**执行**：跑 `translateRecords()`，与金标对比。

**断言**：
- **术语命中**：金标里的术语（人名 / 机构名 / 政策名）必须按 `scripts/evals/translation/glossary.json` 里的对应翻译出现。例：
  - "陈振声" → "Chan Chun Sing"（en）/ "チャン・チュンシン"（ja）
  - "国家人工智能战略" → "National AI Strategy"（en）/ "国家AI戦略"（ja）
- **长度合理**：en 译文长度在金标 ±30%；ja 类似
- **语言纯度**：en 译文里不能有 CJK；ja 译文必须含 hiragana/katakana
- **格式保留**：源里的 markdown 链接 / inline code / 数字 / 日期格式不变

**输出**：`scripts/evals/translation/report-YYYYMMDD.md`

**命令**：
```bash
npm run eval:translation
npm run eval:translation -- --direction=zh-en
```

**频率**：月 + 改 `translate.ts` / 升级模型时手动。

**实施估时**：2 天。1 天攒金标 + glossary，1 天写比对。

---

### Eval 5：Schema Rich Results 抽样

**问题**：CLAUDE.md 已知盲区第 2 条——`check:schema` 是字段级断言，不验完整 Google Rich Results 规则。

**输入**：5 个关键页面 URL：
- `/`（首页 Organization + WebSite）
- `/debates/<最新>`（NewsArticle / Article）
- `/voices/<热门人物>`（Person）
- `/videos/<最新>`（VideoObject）
- `/policies/<最新>`（Article）

**执行**：跑 [structured-data-testing-tool](https://github.com/maxprilutskiy/structured-data-testing-tool)（npm 安装）或调 Google Rich Results API（限流 100/day）。

**断言**：每个页面 0 errors，warnings 数量不增加（与 baseline 对比）。

**输出**：`scripts/evals/schema-richresults/report-YYYYMMDD.md`

**命令**：
```bash
npm run eval:schema
```

**频率**：月。

**实施估时**：1 天。

---

## 4. 目录结构

```
scripts/evals/
├── README.md                 # 总入口 + 命令清单
├── run-all.ts                # 跑所有 eval（cron 用）
├── url-health/
│   ├── check.ts              # 主逻辑
│   ├── report-template.md
│   └── reports/              # 历史报告归档（gitignore）
├── i18n-coverage/
│   ├── check.ts              # 四层叠加
│   ├── layer-a-data.ts
│   ├── layer-b-sitemap.ts
│   ├── layer-c-hreflang.ts
│   ├── layer-d-purity.ts
│   ├── allow-list.json       # 单语博客等例外
│   └── reports/
├── ai-summary/
│   ├── check.ts
│   ├── golden/
│   │   ├── debate-oral-4088.json
│   │   └── ...
│   └── reports/
├── translation/
│   ├── check.ts
│   ├── glossary.json         # 术语表
│   ├── golden/
│   └── reports/
└── schema-richresults/
    ├── check.ts
    ├── pages.json            # 抽样 URL 配置
    └── reports/
```

---

## 5. package.json scripts

```json
{
  "eval": "tsx scripts/evals/run-all.ts",
  "eval:url": "tsx scripts/evals/url-health/check.ts",
  "eval:i18n": "tsx scripts/evals/i18n-coverage/check.ts",
  "eval:ai-summary": "tsx scripts/evals/ai-summary/check.ts",
  "eval:translation": "tsx scripts/evals/translation/check.ts",
  "eval:schema": "tsx scripts/evals/schema-richresults/check.ts"
}
```

PR gate（加进 `check`）：
- `eval:i18n -- --layer=a`（数据层，零成本，几秒跑完）
- `eval:url -- --changed-only`（只扫这次 PR 改过的文件）

`check:dist` 加：
- `eval:i18n -- --layer=b,c,d`（页面层，需要 dist）

---

## 6. cron 调度（接 `scripts/auto_update.py`）

在 `scripts/refresh/registry.json` 加：

```json
{
  "name": "evals-weekly",
  "schedule": "weekly",
  "type": "shell",
  "script": "npm run eval:url && npm run eval:i18n",
  "mode": "issue-on-fail"
},
{
  "name": "evals-monthly",
  "schedule": "monthly",
  "type": "shell",
  "script": "npm run eval:ai-summary && npm run eval:translation && npm run eval:schema",
  "mode": "issue-on-fail"
}
```

失败时 `gh issue create --assignee @me`，title `[sgai] eval failure: <name>`，body 附最新 report。

---

## 7. 实施顺序

按依赖 + 价值排序：

| 步骤 | 内容                                      | 估时   | 依赖     |
| ---- | ----------------------------------------- | ------ | -------- |
| 1    | Eval 1 URL Health（最简单 + 防真实漏洞） | 半天   | 无       |
| 2    | Eval 2 Layer A（数据层）                 | 半天   | 无       |
| 3    | Eval 2 Layer D（语言纯度，扩 check:i18n）| 0.5 天 | 无       |
| 4    | Eval 2 Layer B（sitemap parity）         | 半天   | dist     |
| 5    | Eval 2 Layer C（hreflang parity）        | 半天   | dist     |
| 6    | 接 cron + issue 通知                     | 0.5 天 | 1–5 完   |
| 7    | Eval 3 AI Summary（攒金标 + 跑）         | 2 天   | 无       |
| 8    | Eval 4 Translation（攒金标 + 跑）        | 2 天   | 无       |
| 9    | Eval 5 Schema Rich Results               | 1 天   | 无       |

**步骤 1–6 是本次 PR 的范围**（约 3 天工作量，先封掉 P0 漏洞）。步骤 7–9 后续单独 PR。

---

## 8. 失败处理 + 阈值策略

- **URL Health**：4xx/5xx 直接 FAIL → 自动开 issue 列出失败 URL。404/410 入手动 fix 队列。401/403/429 进 warn 区，每月人工 review 一次。
- **i18n Coverage Layer A**：任何字段缺三语 → FAIL，CI 拒绝 merge。
- **i18n Coverage Layer B/C/D**：任何 page 三语 parity 失败 → FAIL。例外只能通过白名单显式声明（如博客单语）。
- **AI Summary / Translation**：分级——结构性失败（schema 错、字段空）即 FAIL；质量性失败（长度偏差、术语漏）超阈值 30% 才 FAIL，否则 warn。
- **Schema Rich Results**：errors > 0 → FAIL；warnings 增加 → warn。

---

## 9. 后续扩展（不在本次范围）

- **Frontend visual regression**：用 playwright 抓 N 个关键页面截图，与 baseline 对比像素差
- **Lighthouse 性能 eval**：每月跑 5 个页面，Performance / SEO / A11y 分数不能降
- **GSC API 集成**：自动拉 Google Search Console 报错，开 issue（CLAUDE.md 已知盲区第 1 条）

---

## 10. 验收标准

本计划实施完后（步骤 1–6），Luca 应该能：

1. 本地跑 `npm run eval`，5 分钟内拿到全站健康报告
2. 每周一早上收到 GitHub issue 列出 URL 失败 / i18n 缺漏（如有）
3. 任何 PR 加新数据，CI 自动拒绝单语种 / 三语缺漏 / URL 假货
4. 改 `ai-summarize.ts` / `translate.ts` 之前先跑金标，知道改动有没有退化质量

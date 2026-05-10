# sgai Evals

每周自动跑一次的"AI 输出 + 数据完整性"回归网。计划见 [`docs/20260509-evals-plan.md`](../../docs/20260509-evals-plan.md)。

## 当前已建

| Eval                          | 命令                                              | 频率       | 需要 dist? | 需要 LLM? |
| ----------------------------- | ------------------------------------------------- | ---------- | ---------- | --------- |
| URL Health                    | `npm run eval:url`                                | 周         | 否         | 否        |
| i18n Coverage Layer A         | `npm run eval:i18n -- --layer=a`                  | 周         | 否         | 否        |
| addedAt Coverage              | `npm run eval:addedAt`                            | PR + 周    | 否         | 否        |
| Layer E source-i18n           | `npm run eval:source-i18n`                        | PR + 周    | 否         | 否        |
| i18n Coverage Layer B         | `npm run eval:i18n -- --layer=b`                  | 周         | 是         | 否        |
| i18n Coverage Layer C         | `npm run eval:i18n -- --layer=c`                  | 周         | 是         | 否        |
| i18n Coverage Layer D         | `npm run eval:i18n -- --layer=d`                  | 周         | 是         | 否        |
| **Schema Rich Results**       | `npm run eval:schema`                             | 周         | 是         | 否        |
| **AI Summary 金标**           | `npm run eval:ai-summary`                         | 月         | 否         | 是        |
| **Translation 金标**          | `npm run eval:translation`                        | 月         | 否         | 是        |
| GSC Monitor 📦 PARKED         | `npm run eval:gsc`                                | —          | 否         | 否        |
| 周度全跑                      | `npm run eval`（默认 weekly tier）                | 周（cron） | 视层而定   | 否        |
| 月度全跑                      | `npm run eval -- --frequency=monthly`             | 月（cron） | 视层而定   | 是        |
| 全部                          | `npm run eval -- --frequency=all`                 | —          | 视层而定   | 是        |

### Layer E — 源码层 i18n 硬编码扫描（2026-05-10 加，根因修复）

**为什么有这一层**：Layer A–D 看的是数据 + 构建产物，看不见源代码模板里的 `lang === 'zh' ? '中文' : 'English'` 反模式。这种二元三元会让 ja 静默落到 en 分支，但 Layer D 的 CJK 残留扫描天然看不见 EN-on-JA 渲染。2026-05-10 用户审计发现：35 个 .astro 文件、518 处此类硬编码（且 `pickLocalized` 的 4 参数 shape B 实现里 ja 永远拿 enKey，不查 *Ja —— 50 处调用全部受影响，单点 root cause）。Layer E 在源码层把这类反模式 baseline 化，CI hard-fail 任何"新增"。

逻辑：

- 扫 `src/{components,pages,layouts}/**/*.{astro,ts,tsx}`
- 抓四种反模式：`lang === 'zh' ?` 三元、`lang === 'en' ?` 三元、`isZh ?` 三元、`isEn ?` 三元
- 同行已有 ja 分支（`isJa ?` / `lang === 'ja' ?`）的不算（三语链合法）
- 同文件 `COPY[lang] ?? COPY.en` 但 `COPY` 字典缺 `ja:` key → 单独一类 `copy-no-ja`
- baseline.json 存当前 518 条 grandfather backlog；PR 引入新增即 fail
- backlog 消化后用 `--baseline` 重新 snapshot

CLI：

```bash
npm run eval:source-i18n                                              # CI 用，新增即 fail
npx tsx scripts/evals/source-i18n-hardcode/check.ts --baseline        # 重新 snapshot baseline
npx tsx scripts/evals/source-i18n-hardcode/check.ts --report-only     # 输出但不 fail
# 局部豁免：在被 flag 的行紧上方写 `// i18n-allow-hardcode <理由>`
```

逐步消化原则：未来 PR 修了任何 backlog 行后，跑一次 `--baseline` 把 baseline 缩小，commit 进 PR。baseline 只许变小、不许变大。

### addedAt Coverage（2026-05-10 加，根因修复）

防御 2026-05-09 那次 bug 的**根本修复**：commit a608bc0 直接给 videos.ts 加了 v059/v060，却没动 `src/data/updates.ts`，首页"最近更新"看不到当天的视频。

我们把"最近更新"从手动 ledger 改造成了**从数据派生**——每条数据 record 加一个 `addedAt` 字段，[`src/utils/derived-updates.ts`](../../src/utils/derived-updates.ts) 自动产出 update entry。漂移 bug 类彻底消失：忘了加 record 是不可能的（首页不显示就是没加），忘了加 addedAt 也不可能（这个 eval 会 fail）。

逻辑：

- 对 11 个数据文件 `src/data/{videos,policies,debates,people,tracker,benchmarking,ecosystem,levers,startups,legal-ai,talent}.ts`
- 扫 `git diff <base> -- <file>` 的 added 行（base 默认 `main`，含未 commit 的 worktree 变更）
- 数 `+ id: 'xxx'` 行（每行 = 一条新 record）
- 数 `+ addedAt: 'xxx'` 行
- 若 newRecords > newAddedAt → FAIL，列出缺 addedAt 的 record id

CLI：

```bash
npm run eval:addedAt                                          # PR diff vs main
npx tsx scripts/evals/addedAt-coverage/check.ts --base=HEAD~5 # 自定义 base
npx tsx scripts/evals/addedAt-coverage/check.ts --include-historical  # 全量审计模式
npx tsx scripts/evals/addedAt-coverage/check.ts --dry-run     # 跑但不写报告
```

文件清单在 [`scripts/evals/addedAt-coverage/check.ts`](addedAt-coverage/check.ts) 顶部的 `DATA_FILES`，与 [`src/utils/derived-updates.ts`](../../src/utils/derived-updates.ts) 一一对应——加新数据文件时同步改两处。

## 退出码

- `0` — 全部通过（或仅 401/403/429 软警告）
- `1` — 至少一项 FAIL
- `2` — 调用错误

## 报告文件

每次跑落在 `scripts/evals/<eval>/reports/report-YYYYMMDD*.{json,md}`，已 `.gitignore`，不入库。

## CI 集成

- **PR 时**：`.github/workflows/actions.yaml` 跑 `npm run eval:addedAt`，fail 阻止 merge。零成本。
- **Weekly cron**：`scripts/refresh/registry.json` 里 `id=evals`、`schedule=weekly`、`mode=issue-on-fail`。失败时 `auto_update.py` 自动开 GitHub issue（assignee = `@me`）。

## Eval 3 — AI Summary 金标回归（2026-05-10 加）

跑 `scripts/lib/ai-summarize.ts` 对 [`ai-summary/golden/`](ai-summary/golden/) 里的样本，按阈值断言：

- JSON schema 完整（title / titleEn / description / descriptionEn / category / confidence 必有）
- category 落在 closed-set 内，且匹配金标分类
- title / description 字符串长度落在金标允许区间
- 必含术语（人名 / 机构名 / 政策名）命中率 ≥ 80%
- confidence ≥ 金标设定的最低档
- 对抗样本（content 太薄）必须自报 low confidence + `_pendingReview: true`

每个 case 一次 Claude haiku 调用，命中本地缓存的话 0 成本。当前 5 case + 1 对抗样本，月 cron 跑一次。

**金标怎么扩**：复制 [`ai-summary/golden/policies-public-ai-research-2026.json`](ai-summary/golden/policies-public-ai-research-2026.json) 改字段。`requiredTermsZh` 和 `requiredTermsEn` 是关键——金标价值 80% 在这里。

**模型升级 / prompt 改动前**：先 `npm run eval:ai-summary -- --force` 清缓存重跑，确认旧分基线，再改。改完再跑一次对比。

## Eval 4 — Translation 金标 + glossary（2026-05-10 加）

跑 `scripts/lib/translate.ts`（`translateOne`）对 [`translation/golden/zh-en/`](translation/golden/zh-en/) 和 [`translation/golden/zh-ja/`](translation/golden/zh-ja/) 里的样本，断言：

- **glossary 命中**：源文里出现 [`translation/glossary.json`](translation/glossary.json) 的 zh 关键词时，目标译文必须含其中一种允许翻译。例：源含「陈振声」→ en 输出必须含 "Chan Chun Sing"
- **长度比**：output / source 字符比落在 [`minLengthRatio`, `maxLengthRatio`]（默认 [0.6, 2.5]）
- **语言纯度**：en 输出禁含 CJK，ja 输出必须含 hiragana/katakana
- **token 保留**：金标声明的 `preserveTokens`（数字、日期、缩写）必须 verbatim 出现
- **必含术语**：`expectedTermsEn` / `expectedTermsJa` 命中率 ≥ 80%

当前 5 zh→en + 5 zh→ja。`glossary.json` 是第一手术语权威——发现新错译就加进去。

## Eval 5 — Schema Rich Results 抽样（2026-05-10 加）

`scripts/check-schema.mjs` 是字段层最小校验（PR gate，零成本）；本 eval 是 **更严的 Rich Results 期望** 抽样。在 [`schema-richresults/pages.json`](schema-richresults/pages.json) 里指定代表性页面（首页 / policy / voices / videos / debates），断言每个 `expectedTypes`：

- ERROR：required 字段缺失（如 `Article.headline`、`VideoObject.uploadDate` 不是 ISO 8601）→ exit 1
- WARN：recommended 字段缺失（如 `Article.image` / `dateModified` / `author`，`Organization.logo`，`VideoObject.contentUrl/embedUrl`）→ 默认不 fail，加 `--fail-on-warn` 才失败

`pathGlob` 支持 `{first}` 占位符（`policies/{first}/index.html` 会自动选第一个匹配子目录），所以 id 变化不会让 eval 失效。需要 `dist/` 存在，先 `npm run build`。

## Eval 6 — GSC Monitor（📦 PARKED 2026-05-10）

拉 Google Search Console 最近 7 天的 indexing / rich-results 报错，比对快照，新增即开 issue。

**当前 PARKED**——配置成本（GCP project + service account + IAM）vs 每周省 5 分钟，性价比差。stub 代码 + 设置文档 [`gsc-monitor/SETUP.md`](gsc-monitor/SETUP.md) 留着，cron 已撤下。

哪天人肉看 GSC 真的烦了，照 SETUP.md 走 6 步花 15 分钟接上即可。

## 频率分层

`run-all.ts` 默认跑 weekly tier。`--frequency=monthly` 加上 LLM-backed evals。`--frequency=all` 全跑。cron 在 `scripts/refresh/registry.json` 有两条 entry：

- `evals` weekly — URL / i18n / addedAt / source-i18n / schema-richresults
- `evals-monthly` monthly — AI summary + translation 金标

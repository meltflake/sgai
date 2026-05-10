# sgai Evals

每周自动跑一次的"AI 输出 + 数据完整性"回归网。计划见 [`docs/20260509-evals-plan.md`](../../docs/20260509-evals-plan.md)。

## 当前已建

| Eval                   | 命令                                              | 频率       | 需要 dist? |
| ---------------------- | ------------------------------------------------- | ---------- | ---------- |
| URL Health             | `npm run eval:url`                                | 周         | 否         |
| i18n Coverage Layer A  | `npm run eval:i18n -- --layer=a`                  | 周         | 否         |
| **addedAt Coverage**   | `npm run eval:addedAt`                            | PR + 周    | 否         |
| i18n Coverage Layer B  | `npm run eval:i18n -- --layer=b`                  | 周         | 是         |
| i18n Coverage Layer C  | `npm run eval:i18n -- --layer=c`                  | 周         | 是         |
| i18n Coverage Layer D  | `npm run eval:i18n -- --layer=d`                  | 周         | 是         |
| 全部                   | `npm run eval` 或 `npm run build && npm run eval` | 周（cron） | 视层而定   |

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

## 计划中（未建）

- Eval 3：AI Summary 金标回归（月）
- Eval 4：Translation 金标 + glossary 回归（月）
- Eval 5：Schema Rich Results 抽样（月）

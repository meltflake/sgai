# sgai Evals

每周自动跑一次的"AI 输出 + 数据完整性"回归网。计划见 [`docs/20260509-evals-plan.md`](../../docs/20260509-evals-plan.md)。

## 当前已建

| Eval                       | 命令                                              | 频率       | 需要 dist? |
| -------------------------- | ------------------------------------------------- | ---------- | ---------- |
| URL Health                 | `npm run eval:url`                                | 周         | 否         |
| i18n Coverage Layer A      | `npm run eval:i18n -- --layer=a`                  | 周         | 否         |
| **Updates Ledger Coverage**| `npm run eval:updates-ledger`                     | 周         | 否         |
| i18n Coverage Layer B      | `npm run eval:i18n -- --layer=b`                  | 周         | 是         |
| i18n Coverage Layer C      | `npm run eval:i18n -- --layer=c`                  | 周         | 是         |
| i18n Coverage Layer D      | `npm run eval:i18n -- --layer=d`                  | 周         | 是         |
| 全部                       | `npm run eval` 或 `npm run build && npm run eval` | 周（cron） | 视层而定   |

### Updates Ledger Coverage（2026-05-09 加）

防御 2026-05-09 那次 bug：commit a608bc0 直接给 videos.ts 加了 v059/v060，却没动 src/data/updates.ts，结果首页"最近更新"模块看不到当天更新。

逻辑：

- 扫最近 N 天（默认 14）git log 里改过 `src/data/{videos,policies,debates,...}.ts` 的 commit
- 净增行数 < `--min-added`（默认 5）的视为非数据变更（重构 / typo / 翻译回填），跳过
- 同 commit 也改了 `src/data/updates.ts` → PASS（atomic）
- 否则查 UPDATES 数组里有没有 type 匹配 + date 在 ±`--tolerance-days`（默认 3）窗内的条目 → PASS（window）
- 都没有 → FAIL，列出 commit sha + 期望 type

CLI：

```bash
npm run eval:updates-ledger                              # 默认 14 天窗口
npx tsx scripts/evals/updates-ledger/check.ts --window-days=7 --tolerance-days=2
npx tsx scripts/evals/updates-ledger/check.ts --dry-run  # 只跑 git，不写报告
```

文件 → 期望 type 的映射在 [`scripts/evals/updates-ledger/check.ts`](updates-ledger/check.ts) 顶部的 `DATA_FILE_TYPES`，新加 type 的话同步改这里。

## 退出码

- `0` — 全部通过（或仅 401/403/429 软警告）
- `1` — 至少一项 FAIL
- `2` — 调用错误

## 报告文件

每次跑落在 `scripts/evals/<eval>/reports/report-YYYYMMDD*.{json,md}`，已 `.gitignore`，不入库。

## CI 集成

`scripts/refresh/registry.json` 里 `id=evals`、`schedule=weekly`、`mode=issue-on-fail`。失败时 `auto_update.py` 自动开 GitHub issue 列出报告内容（assignee = `@me`）。

PR 准入门槛建议：把 Layer A 加进 `npm run check`（零成本，几秒跑完）。

## 计划中（未建）

- Eval 3：AI Summary 金标回归（月）
- Eval 4：Translation 金标 + glossary 回归（月）
- Eval 5：Schema Rich Results 抽样（月）

# sgai Evals

每周自动跑一次的"AI 输出 + 数据完整性"回归网。计划见 [`docs/20260509-evals-plan.md`](../../docs/20260509-evals-plan.md)。

## 当前已建

| Eval                  | 命令                                        | 频率   | 需要 dist? |
| --------------------- | ------------------------------------------- | ------ | ---------- |
| URL Health            | `npm run eval:url`                          | 周     | 否         |
| i18n Coverage Layer A | `npm run eval:i18n -- --layer=a`            | 周     | 否         |
| i18n Coverage Layer B | `npm run eval:i18n -- --layer=b`            | 周     | 是         |
| i18n Coverage Layer C | `npm run eval:i18n -- --layer=c`            | 周     | 是         |
| i18n Coverage Layer D | `npm run eval:i18n -- --layer=d`            | 周     | 是         |
| 全部                  | `npm run eval` 或 `npm run build && npm run eval` | 周（cron） | 视层而定 |

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

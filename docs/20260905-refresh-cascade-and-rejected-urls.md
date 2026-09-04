# 2026-09-05 全量刷新的两个连锁坑：脏树级联拒绝、被拒候选反复回流

## 现象

2026-09-04 晚跑一次全量 `auto_update.py`（17 条管线）。voices 扫了 15 条演讲全部判为不相关，把决定写进 `scripts/refresh/voices/data/rejected-ids.json` 却因为「0 条新增」没提交。后面 github-stars、ecosystem、startups、tracker、benchmarking、ai-jobs-index、research-digest 六条管线都产出了内容，但 `autoCommit()` 一看工作树有它不认识的脏文件就拒绝提交，六个域的输出全堆在 main 的工作区里，周报 #266 只写「no new data」。

同一次还看到 tracker 提出「2025 AI Index Report」、benchmarking 提出「Global AI Vibrancy Tool」和「People of AI Index」——三条都在 8 月 21 日的 #204 / #205 里被审掉了。原因是 run-template 只拿目标数据文件里已有的 URL 去重；PR 关掉不合并，候选既不在数据文件也不在任何提交过的缓存里，下次照样再来。

## 改动

- `scripts/lib/auto-commit.ts`：`getUnexpectedDirty()` 默认放过管线状态路径（`scripts/refresh/<域>/data/`、`scripts/i18n/data/`、`scripts/data/`），并改用 `git status --untracked-files=all`，避免未跟踪目录被折叠成 `scripts/` 一整个路径。单测两条。
- `scripts/lib/rejected-urls.ts`（新）：每个域一份 `scripts/refresh/<域>/data/rejected-urls.json`，扫描前并进 existingUrls。run-template 与 ecosystem 自定义 run 都接上。种子：tracker 1 条、benchmarking 2 条、ecosystem 1 条。
- 流程约定写进 CLAUDE.md：关掉一个 auto-PR 不合并时，把它的 URL 连同理由记进该域的 `rejected-urls.json`，否则下个周期还会见到它。

## 验证

- `tsx --test` auto-commit / rejected-urls 单测通过，`npm run test:lib` 全过。
- `tracker/run.ts --dry-run`：「rejected tracker URLs (skipped): 1」，候选里不再出现 2025 报告。

## 本次产出的处理

六个域的输出人工审过后并成一个数据 PR（#267）；tracker / benchmarking 两组被拒候选与 ecosystem 的网页型 stub 弃掉。

# 2026-09-05 拒绝台账补两个洞：跨域回流、voices 决定永不落盘

延续 [20260905-refresh-cascade-and-rejected-urls.md](20260905-refresh-cascade-and-rejected-urls.md)。当天早上 08:00 的日常 cron 是第一次带着级联修复跑：voices 照旧留下未提交的 `rejected-ids.json`，但 github-stars / ecosystem / tracker 三条管线都正常提交开了 PR（#271 / #272 / #273）——级联那个洞确实堵上了。同一批 PR 暴露出另外两个。

## 洞一：拒绝台账按域存，换个域就绕过

#273 tracker 提的是 Global AI Vibrancy Tool。这条 URL 8 月 21 日在 #205 里以 benchmarking 域被审掉，我前一天也把它写进了 `scripts/refresh/benchmarking/data/rejected-urls.json`。但台账是按域读的，同一条 URL 换成 tracker 域照样冒出来。

「站内已经覆盖过」是全站结论，不是某个域的结论。改法：加一份 `scripts/refresh/_shared/data/rejected-urls.json`，所有域都读；四条 Stanford HAI 条目（2025 / 2026 AI Index 报告、Vibrancy Tool、People of AI Index）从各域文件挪进来。「这条不适合本域」这类判断仍留在域文件里——比如 ecosystem 新增的三条（AISG 博文、两条 Business Times 国际新闻），它们是 entity 语义不符，不必拦住别的域。

## 洞二：voices 的拒绝决定只在有新增时才提交

`voices/run.ts` 判完 AI 相关性就把决定写进 `rejected-ids.json`，但唯一的 `autoCommit()` 挂在 emit 成功之后。三个提前 return（无 AI 相关 / 无可 emit / emit 0 条）都在提交之前。于是「全部候选都被拒」这种最常见的情况下，决定永远停在工作区：09-04 和 09-05 两次 cron 都是这样。后果是每次重跑都拿同样的演讲再判一遍（白烧 LLM 调用），全新 checkout 更是完全没有记忆。

改法：三个 return 之前调 `commitRejectLedgerOnly()`——台账有改动就单独提交并开一个小 PR。代码注释本来就写着「误判由 PR review 里删掉那行来否决」，之前这条路在全拒场景下根本不存在。顺手把 autoCommit 里的「目标文件有没有变化」抽成导出的 `hasUncommittedChanges()`。

## 验证

- `npm run test:lib` 429 全过（rejected-urls 新增 2 条：共享台账对所有域生效、域内条目不外泄）。
- `npm run check` 通过，`astro check` 0 errors。
- `tracker/run.ts --dry-run`：skipped 4 条，候选里 Stanford HAI 全部消失，只剩 IMDA / EDB 五条政府源。
- `voices/run.ts --dry-run` 正常列候选。

## 本批 PR 的处置

#271（stars 刷新）合并；#272 三条全是新闻/博文非实体，按 #202 / 4bdad60 先例关掉；#273 关掉。四条 URL 分别进共享台账和 ecosystem 域台账。

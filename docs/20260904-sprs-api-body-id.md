# 2026-09-04 SPRS Hansard API 改为 body 传 id：周扫描静默归零三周

## 现象

`data-refresh` 周报从 2026-08-24 起连续三次报「Hansard 扫描完成: 0 条新记录」。看起来像议会休会，实际是 SPRS 的 `getHansardTopic` 接口在 8 月中旬改了参数位置：id 必须放在 JSON body（`{"id": "oral-answer-4156"}`），只放 query string 的老写法每个 id 都返回 400 `Unable to process request please try again`。`scan_hansard_range` 把非 200 当「此 id 不存在」跳过，于是整段扫描安静地得到 0。

同一次排查还发现第二个盲区：4–5 Aug 会期有 14 条 AI 相关条目属于 `written-answer-na-*`（口头质询时间内未及答复、改书面答复），是独立 id 家族，历来的 oral / written / budget 三段扫描永远看不到。

## 改动

- `scripts/auto_update.py`：请求统一走 `_sprs_post()`，query string 和 body 同时带 id；扫描前先探针一个已知存在的 id（`HANSARD_SENTINEL_ID`），拿不到标题就直接抛错，让周报显示失败而不是「0 条」。新增 `written-answer-na` 号段扫描（state 键 `max_written_na_id`，种子 24297 = 2026-08-05 会期最后一条）。
- `scripts/lib/sprs-api.ts`、`scripts/hansard/fetch-debate-transcripts.ts`、`scripts/hansard/02_fetch_debates.py`：body 改为 `{ id }`。
- `CLAUDE.md`、`scripts/hansard/README.md`：接口说明和示例脚本同步；补 `written-answer-na` 说明。

## 验证

- venv python 直接调 `probe_sprs()` 与 `scan_hansard_range('written-answer-na', 24211, 24213)`，拿到 `written-answer-na-24212 Applying Model AI Governance Framework and AI Verify to Agentic AI Systems`。
- `npx tsx` 调 `fetchHansardTopic('oral-answer-4166')` 返回标题。

## 遗留

- 4–5 Aug 会期漏掉的 21 条 AI 相关辩论另开数据 PR 补录。
- 关键词匹配仍有误报（宿舍分配、留学生名额之类的标题因正文含 "AI" 被计入），本次没动。

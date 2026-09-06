# 2026-09-06 拒绝台账补齐 levers 与 policies

## 起因

今早 cron 的 levers PR（[#286](https://github.com/meltflake/sgai/pull/286)）提的是政府科技局 2020 财年 ICT 采购预算新闻稿——这条 URL 在 2026-08-15 那轮就出现过，当时被判为空壳页跳过。审掉之后按规矩把 URL 记进台账，却发现 `levers/run.ts` 根本没读台账，记了也没用。

## 覆盖盘点

`scripts/refresh/*/run.ts` 分两类：走 `_shared/run-template.ts` 的（benchmarking / legal-ai / startups / talent / tracker）在 [#268](https://github.com/meltflake/sgai/pull/268) 已经接上；自建扫描的有 ecosystem、levers、policies 三家，当时只补了 ecosystem。

本次补上 levers 与 policies，两处都是在自建的 `existingUrls` 之后并进台账。

其余管线不适用：voices / videos 有各自的 rejected-ids 机制，jobs-index / reg-lookahead / research-digest 不是 URL 候选式扫描。

## 本次记入的条目

| 域 | URL | 理由 |
| --- | --- | --- |
| levers | tech.gov.sg FY2020 ICT spend | 2020 年政府 ICT 采购预算，主题是数字化与疫后企业支持，AI 只占五个重点领域之一 |
| ecosystem | businesstimes.com.sg 全球数据中心支出预测（PwC） | 市场预测报道，非实体，无新加坡主体 |
| ecosystem | businesstimes.com.sg Apple 指控 OpenAI 销毁证据 | 美国诉讼新闻，与新加坡 AI 生态无关 |

## 验证

`levers --dry-run` 现在打印「rejected levers URLs (skipped): 5」，候选里不再出现该 URL；`policies --dry-run` 打印 4。`test:lib` 440 项、`npm run check` 全过。

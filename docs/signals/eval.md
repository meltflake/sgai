# Signals（信号）—— 上线评估

日期：2026-10-17。版本 0.29.1。PR #356（功能）、#357（第一批数据）、#358（首跑修复）。

## 对照意图

| 意图 | 结果 | 证据 |
| --- | --- | --- |
| 每周一有 5 到 8 条新信号上线 | 部分 | 首跑 14 天窗口挑出 5 条，人工核对后留 3 条。按现有来源，一周大概 2 到 4 条够格（4 分以上）。数量靠来源，不靠门槛。 |
| 每条带一句判断、来源链接、1 到 3 个标签，五语齐全 | 达成 | `check:i18n-completeness`、`check:graph` 通过；线上 `/signals/` 五语各 3 条。 |
| 首页块、`/signals/` 主题筛选、主题页可见 | 达成 | 线上 `/zh/` 有「本周值得关注」；`/topics/governance-regulation/` 有 2 条 `/signals/#sig-` 链接；`/updates/` 有 1 条。 |
| 管线自动采集、评分、起草、开 PR | 达成 | 首跑开出 #357，耗时 962 秒。registry `signals` 周跑。 |
| 与其他管线同一套 cron、doctor、CI 门 | 达成 | registry 归属、`eval:addedAt` 的 `DATA_FILES`、`check:graph` 都已纳入。 |

## 对照规格

| 规格项 | 结果 | 说明 |
| --- | --- | --- |
| 数据结构、四语、addedAt、URL 校验 | 达成 | 见 `src/data/signals.ts`；emit 前跑 `validateUrls`，后跑 i18n-pair 回滚门。 |
| 来源 | 改动 | 去掉 Straits Times、e27、Tech in Asia（不可达或付费），加 MAS、EDB、A*STAR。原因写在 `sources.ts` 文件头。 |
| judge 用 haiku | 改动 | 改用 sonnet：评分是这个功能的编辑核心。每周约 40 次调用。 |
| 列表页 description 走 `synthesizeMetaDescription` | 未做 | 直接用 `t(lang, 'signalsIntro')`，长度在 `check:meta` 限内。 |
| 首页块按 14 天 / 最少 3 条回退 | 达成 | `homeSignals` 单测覆盖。 |

## 意外

- **gov.sg 页面日期普遍是错的。** 每页都带当天的「LAST UPDATED」戳，共享抓取函数把它当发布日期，2023 年的稿件看起来像今天发的。这个 bug 也在 ecosystem、policies 的旧闻过滤里，修在 `scripts/lib/gov-fetch.ts`。
- **EDB 是转载站。** 它的元数据日期是转载日，公司原稿可能早一周以上。
- **IMDA 新闻稿正文由浏览器加载**，服务器 HTML 里没有正文。这类页面现在因正文不足 800 字被跳过，IMDA 的稿件实际上收不到。
- **评分不稳定。** 同一条 BT 新闻（DayOne 柔佛数据中心融资）三次跑分别得 5、5、2 分，「是否关于新加坡」也翻转。缓存按正文哈希，正文一变就重判。
- **起草模型会引入材料外的事实。** MDDI 那条写了「不效仿美英强制预审」，原文没有。已加规则，但仍需人工核对。首批 5 条里 3 条需要改写。

## 下次做法

- 每周 PR 必须逐条对照原文再合并，不能只看格式。重点查数字、日期、国家对比。
- IMDA 正文要么换数据源（MDDI 新闻稿常同步发布），要么用浏览器渲染抓取。
- 评分缓存改按 URL + 标题 + 日期做键，避免同一条新闻每周重判、结果翻转。
- 观察三周：如果每周不足 3 条，先加来源（NRF、GovTech 新闻、SGInnovate），不要降门槛。

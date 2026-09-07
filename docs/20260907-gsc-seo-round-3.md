# GSC 首轮数据驱动 SEO 改进（2026-09-07）

数据来源：Google Search Console，`sc-domain:sgai.md`，2026-08-08 至 2026-09-04（28 天）对比前 28 天。拉取和分桶由 `~/Github/gc-analyze` 完成，完整审阅页在 `~/Dropbox/misc/seo/20260907-seo-plan.html`。

## 数据说明了什么

| 指标 | 前 28 天 | 近 28 天 |
| --- | --- | --- |
| 点击 | 465 | 504 |
| 曝光 | 40,589 | 63,583 |
| CTR | 1.15% | 0.79% |
| 平均位次 | 17.4 | 15.4 |

曝光涨了 57%，点击只涨 8%。多出来的曝光大头是香港对标页：AI 资助计划页 4,005 次、数码港超算两个页面合计 5,060 次，全部零点击。搜这些词的人要的是官方申请入口，不是分析文章，CTR 天花板低，不再往这个方向扩内容。

真正带来点击的是新闻驱动页：Theseus（794 曝光 / 22 点击）、RIE2025 页（2,123 曝光 / 13 点击）。几个高曝光页的问题是 title 没带用户搜的词，或者被截断。

## 改了什么

| # | 页面 | 证据 | 改法 |
| --- | --- | --- | --- |
| 1 | /policies/research-innovation-and-enterprise-2025-plan/ | 「rie2025 strategic domains」5 个变体 334 曝光排 5 到 6 位，零点击；title 里没有 RIE2025 | seoTitleEn / seoDescriptionEn；新增「四大战略领域」章节；修正 contentEn 领域断句 |
| 2 | /talent/international-olympiad-in-ai-2027/ | 437 曝光排第 8 位 2 点击；「ioai 2027 date」84 次、「location」30 次零点击；title 被截断 | title 直接给日期和主办方；事实框补日期 2027-07-04 至 07-10（来源 ioai-official.org）和场地状态 |
| 3 | /ecosystem/ai-trailblazers/ 与 /levers/ai-trailblazers-1-0-2-0/ | 「ai trailblazers singapore」232 曝光排 9.5 位零点击；两页在同一个词上互相分流 | 生态页 title 品牌词优先；抓手项目页 title 改成分析角度，加「完整档案」卡片链回生态页 |
| 4 | /benchmarking/hong-kong-initiative-1-…/ 与 /benchmarking/hong-kong-investment-3-…/ | 三个香港页合计 9,065 曝光零点击 | 各给独立英文 title / description。没有做合并：数码港实体页已经 canonical 指向 initiative-1 页，方向保持不变 |
| 5 | /policies/model-ai-governance-framework-for-agentic-ai/ | 1,076 曝光 11 点击，位次 27.2 升到 16.5 | description 改写；正文四语加白话摘要；主框架页加一句和站内资源链接 |
| 6 | /ecosystem/ai-singapore/ | 288 曝光排 6 到 8 位 1 点击；「is ai singapore a government agency」29 次零点击 | description 改写；whatItIs 开头直接回答「是不是政府机构」 |
| 7 | / | 首页无 h1；「sg ai overview」142 曝光排 62 位 | 补 h1 + 一句说明 + 指向 2026 全景的链接 |
| 8 | /zh/voices/tan-kiat-how/ | 「陈杰豪」205 曝光排 10.6 位零点击；title 没写职务 | zh title 补职务全称；seoTitle；修正 titleJa 重复词 |

## 机制

数据层新增可选字段 `seoTitle` / `seoTitleEn` / `seoTitleJa` / `seoTitleKo` 和 `seoDescription*`。页面用 `pickLocalizedOwn` 读：只命中精确语言，zh-tw 由 zh 派生，英文覆盖不会漏到 ja / ko 页面。没有覆盖时走原来的模板。`check:meta` 的 72 单位 title 宽度限制仍然生效。

## 回看

两到四周后在 gc-analyze 里重跑 `python3 seo.py run`，对比上表 8 个页面的曝光、位次和 CTR。判断标准：位次进入前 5 的页面 CTR 是否从 0 到 2% 以上。

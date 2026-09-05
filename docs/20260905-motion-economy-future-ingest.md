# 2026-09-05 补录 5 Aug 2026 工人党动议「An Economy of the Future that Works for All」

## 为什么收

这是一份泛经济动议，不是 AI 动议。实测 1755 段正文里 93 段（5.3%）提到 AI 相关词，词频 141 次。判断依据不是密度而是内容：AI 那条线上有站内此前没有的硬数字——截至 2026 年仅 4% 企业把 AI 嵌入核心业务流程（中小企业 15%、大企业 63%）、国家 AI 研究五年 10 亿新元对照单年约 200 亿卖地收入与 1.5 亿「数字土地」投入、数据中心的能耗水耗与电价争议、AI 压缩入门级岗位（32,800 个入门级 PMET 空缺）、企业转型补助中 AI 相关项目占比从 17% 升到 31%。

先例上站内已收 motion-2294「Building an Inclusive and Safe Digital Society」（714 段），泛数字议题的动议本来就在收录范围内。

## 两条记录

| id | 场次 | 英文原文段数 | 发言人 |
| --- | --- | --- | --- |
| motion-3008 | 主辩论（含动议提出） | 1088 | 20 |
| motion-3010 | 续辩与总结（至表决） | 406 | 11 |

motion-3009 是 Exempted Business，与本动议无关，不收。

主辩论的轴是蔡庆威把算力类比土地：「In the AI economy, compute is to value creation what land was to the industrial economy」。总结的轴是陈家明批经济战略检讨「这份报告里唯一新的东西是 AI……给既有剧本加新章节和脚注，不等于新剧本」。工人党拿下第 2、3、4 号修正案，第 1 号（把 notwithstanding 改成 in line with）力争未果，12 名议员两度记录反对，修正后动议通过。

## 翻译

- zh：`translate-debate-transcripts.ts`，OpenAI gpt-4.1-mini，与既有 207 条同一条路径。
- ja / ko：`translate-debate-transcripts-{ja,ko}.ts`，本次显式设 `SGAI_TRANSLATION_MODEL=sonnet`（默认是 haiku），因为这是四语 1493 段的旗舰记录。ko 有一个批次撞 300 秒超时，脚本按内置降级把 30 条拆成 2×15 重跑，结果完整。

耗时：zh 14 分钟，ja 约 3 小时，ko 约 2 小时 50 分。

## 全文文件的拼装方式

跟 [20260904-hansard-aug-sitting-ingest.md](20260904-hansard-aug-sitting-ingest.md) 一样：`debate-transcripts.ts` 以 main 的版本为底，只拼入两条新记录。直接用 emit 的产物会让翻译缓存覆盖数据文件，把历史上手工修过的译名回退掉。拼装后逐条比对 207 条旧记录的四条段落数组，diff 为 0。

## 验证

`npm run check`、`check:debate-transcripts`（209 条四语配平）、`i18n-pair`、`eval:coverage-audit` / `source-i18n` / `facade-stats` / `addedAt` / `i18n --layer=a` 全过；构建与 `check:dist` 见 PR。

# 2026-09-04 补录 4–5 Aug 2026 会期 20 条 AI 相关辩论

## 背景

SPRS 接口 8 月中旬改为 body 传 id（见 [20260904-sprs-api-body-id.md](20260904-sprs-api-body-id.md)），周扫描连续三周报 0。8 月 17 日那次扫描其实已经标出 10 条，但其中 4 条是关键词误报（宿舍分配、留学生名额之类），而会期里真正 AI 相关的条目远不止这些——多数落在扫描从不覆盖的 `written-answer-na-*` 家族。

本次直接拉 `getHansardReport` 两天的全量报告，按标题 + 正文 AI 命中数人工筛出 20 条：

| 类型 | 条数 | 说明 |
| --- | --- | --- |
| 口头答复 | 2 | GovTech 重组裁员（oral-answer-4164）、SIMFONI 医疗 AI 模型（oral-answer-4166） |
| 书面答复 | 5 | 公共服务 AI 转型人力原则、AI 处理病患数据的云安全、高校 AI 作弊、陆交局 AI 交通管理、AI 生成内容强制标注 |
| 口头未及答复改书面 | 13 | 代理式 AI 治理框架、金融业自主 AI 代理风险、实时深伪冒充、AI 诱导青少年自残、AI 增强证据出庭、AI 临床记录工具、生成式 AI 对艺术界影响、公务员生成式 AI 使用率、AI 导盲设备、裁员统计计入 AI 因素、企业 AI 采用率、应届生入门岗位、AI 交通执法摄像 |

弃掉 2 条：`written-answer-23926`（只是指向同日另一条答复）、`written-answer-24138`（整条是「请参阅 5 月 5 日口头答复」，站内已有那条）。5 Aug 的工人党动议「An Economy of the Future that Works for All」（motion-3008 / 3010，约 46 万字符）另开 #264 跟进。

## 做法

- 记录：四路并行起草，每条 zh / en / ja / ko 全套字段（标题、摘要、要点、立场、政策信号、原话、whyItMatters）；`notableQuoteEn` 一律取 Hansard 原句；不确定的议员中文名保留英文。
- 全文：`fetch-debate-transcripts --ids` 拉英文原文 → `translate-debate-transcripts` 出中文 → ja / ko 逐条脚本。
- 全文文件最终以 main 的版本为底、只拼入 20 条新记录。原因：emit 的优先级是「翻译缓存 > 数据文件」，会把历史上直接改在数据文件里的译名修正（政务部长 / 朱倍庆之类）回退成缓存里的旧版，113 条老记录会被静默改回。这个坑值得后面在 emit 里修。
- 统计：`DEBATE_STATS` 从数据重算（total 207），README 两处数字、`skill/url-map.json` validIds、版本号 0.26.3 同步。

## 顺手修的译名

对照 parliament.gov.sg 议员页：Jasmin Lau 官方中文名是刘洁敏（仓库里 66 处写成刘燕玲），Alex Yeo 是杨陞才（此前借用了 Melvin Yong 的杨益财；韩文读音一并改为 양승재）。四个数据文件全局改正。

## 验证

`npm run check`、`check:debate-transcripts`（207 条四语配平）、`i18n-pair`、`eval:addedAt`、`eval:coverage-audit`、`eval:source-i18n`、`eval:facade-stats`、`eval:i18n --layer=a` 全过；构建 + `check:dist` 见 PR。

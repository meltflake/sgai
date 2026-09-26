# 2026-09-26 补录 8–10 Sep 2026 会期 25 条 AI 相关辩论

## 背景

9 月 21 日周扫描报「15 条 AI 相关」，只列了前 10 条，也没人入库。重扫后发现问题更大：这次会期的书面答复编号从 24171 排到 24897，约 730 个，扫描器每次只看 300 个号（写死的窗口），停在 24470，后半段一条没看到。

同一时期 videos / voices / reg-lookahead 自 9 月 21 日起每天失败，报错是 Anthropic 返回 403「Your organization has disabled Claude subscription access for Claude Code」。这是账号设置，仓库里修不了，需要在 claude.ai 重新打开订阅访问，或给 cron 配 API key。之后五天的「no new data」issue（#319–#323）都是这个原因。

## 入库

从 8、9、10 三天的全部编号里按正文关键词筛出约 45 条候选，人工留下 25 条：

| 类型 | 条数 | 内容 |
| --- | --- | --- |
| 口头答复 | 8 | Pax Silica 与 WAICO 定位、300 兆瓦数据中心基准、深伪冒充诈骗银行防护、共担责任框架与授权转账诈骗、生成式 AI 与宗教解答、AI 冲击下的就业出路、应届生长期实习、平台安全设计（含 AI 陪伴应用） |
| 书面答复 | 12 | 敏感 AI 应用透明度披露、ASPIRE 2A / Exanet 网络安全事件、AI 生成卫星图像假信息、假鳄鱼照片、数据中心用电、AI 陪伴与心理健康聊天机器人年龄验证、AI 投资生产力测量、AI 能力建设补助、广告中的 AI 肖像、LiteLLM 供应链攻击、中学电脑科、AI 生成国庆电影 |
| 口头未及答复改书面 | 5 | AI 增长可持续性与估值回调风险、全球 AI 资本开支影响、GenAI 微短剧、语音与多模态 AI 工具、高校 AI 写作检测工具 |

弃掉的：关键词误报（海底电缆、GDP 增长、博士奖学金算收入、汽车主动安全、饮料瓶回收、裕廊岛空地、人才准证框架、零售关店等），以及只有一句「见另一条答复」的交叉引用（24491、24594、24767）。

- `debates.ts`：25 条，zh / en / ja / ko 全套字段，`addedAt` 2026-09-26；`DEBATE_STATS` 的 total / byYear / byType / byTopic 按数据重算（209 → 234），topSpeakers 在原基数上累加本批发言人。
- `debate-transcripts.ts`：25 条，en 为 Hansard 原文分段，zh / ja / ko 逐段对齐。人名一律按 `scripts/evals/translation/glossary.json` 的官方中文名，词表里没有的保留英文。
- README 两处数字、`skill/url-map.json`、版本号 0.28.10 同步。

## 扫描器修复

- `scan_hansard_window`：窗口末四分之一还有编号就续扫下一个窗口，最多 5 个。单测 `scripts/test_hansard_scan_window.py`。
- issue 里列出全部 AI 相关条目，不再截断到 10 条。

## 顺手修的链接

周巡检 url-health 报 3 条坏链：加拿大 2024 预算页去掉 `www.`，联合国 AI 高级别咨询机构页换成新地址（levers、tracker 两处）；赫尔辛基大学那条 curl 返回 200，是误报，未改。

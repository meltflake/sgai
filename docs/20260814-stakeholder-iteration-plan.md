# sgai 利益相关方视角迭代规划（2026-08）

2026-08-14 起草。本文档回答「接下来该推进什么工作」——把 20260707 审计之后的站况重新盘点一遍，站在**新加坡总理（PMO）、EDB、新加坡 AI 管理者（AISG/IMDA/SNDGO/企业 CDO）**三方视角收敛出一份优先级明确的路线图，并成为后续迭代的单一前瞻性真相源（旧规划的未落地项全部移交到本文档，见 §3）。

上游：20260707 项目审计（工程 A+、经营 C 的判断本文件继承并更新）、20260505 增长计划、20260717 关键词策略。8 月源扩展六连发已交付：jobs-index、research-digest、reg-lookahead、videos auto-PR、legal-ai 修复、benchmarking 档案——审计 P0 运维问题至此基本闭环。

---

## §0 执行状态盘点 + 维护协议

> **维护协议**：每完成一项，回本文档把状态改为 ✅ 并记 PR 号 / 日期；季度复盘时更新进度与证据。本文档不是一次性备忘录，是活的 backlog（20260505 增长计划曾因无维护协议而漂移，此处显式补上）。

| # | 条目 | 状态 | 完成 PR / 日期 |
| --- | --- | --- | --- |
| P0-1 | 年度合成页 State of Singapore AI 2026（pillar 长文 v1） | ✅ 已落地 | 2026-08-14 本地完成，待提交 |
| P0-2 | 渲染层 as-of 时间戳（tracker 六维 + MetricRow） | ✅ 已落地 | 2026-08-14 本地完成，待提交 |
| P0-3 | 引用此条 CiteBlock（五类详情页） | ✅ 已落地 | 2026-08-14 本地完成，待提交 |
| P1-1 | 资本与基础设施结构化视图（ai-capital.ts + /ecosystem section） | ⏳ 未开始 | |
| P1-2 | National AI Missions 垂直 hub（+2 topics + 策展） | ⏳ 未开始 | |
| P1-3 | AISG 支柱长文 | ⏳ 未开始 | |
| P1-4 | 月报 newsletter（半自动 + Buttondown） | ⏳ 未开始 | |
| P2-1 | jobs-index 行业切片（METHODOLOGY_VERSION → 2） | ⏳ 未开始 | |
| P2-2 | 企业采用行业切片（adoption 维 sector 级行） | ⏳ 未开始 | |
| P2-3 | 旗舰项目完备性校验（verify-graph 扩展） | ⏳ 未开始 | |
| P2-4 | 数据导出（debates/policies/tracker JSON+CSV） | ⏳ 未开始 | |
| P2-5 | sitemap lastmod（serialize 钩子扩展） | ⏳ 未开始 | |
| P2-6 | OG 动态图接线（首页 + 六维 + 年度报告） | ⏳ 未开始 | |
| P2-7 | 议员 stub 转正（议会记录派生页） | ⏳ 未开始 | |

> P0 执行备忘（2026-08-14）：P0-1 v1 走 pillar 长文（`state-of-singapore-ai-2026`，五语实体文件 + MANUAL_UPDATES longform 条目 + 导航「年度报告 2026」入口）；P0-2 新增 `MetricRow.asOfDate` / `QuantifiedDimension.headlineAsOf` / 定性维 `asOfDate`，六维全部带数据截至 chip，stale-stats 增加 as-of warning 通道（>365 天告警、不 fail）；P0-3 新组件 `CiteBlock.astro` 接入 debate/policy/video/ecosystem/tracker 五类详情页（10 个页面文件），品牌串走 `t(lang,'siteName')` 防 EN 泄漏；顺带修复 OECD 实体 ja/ko 名称 EN 占位问题；EN-sentence baseline 按扫描器指引重快照（仅新增一处合法引用：法案官方英文名）。

---

## §1 总判断 + 战略决策复述

**一句话结论**：工程 A+ 已兑现为运维闭环（审计的 P0 运维问题已清零）；当前真正缺的是「**可被机构使用**」的最后一公里——散文变数据、数据库变可引用研究产品。总理、EDB、AI 管理者三方要的恰好是同一样东西：**一个他们敢引、别人信得过的新加坡 AI 全景记录**。

**战略三问的已定答案**（20260707 审计遗留的待确认问题，本文档收口）：

1. **第一目标用户**：英文政策 / 产业研究者（GSC 已分类需求 97.9% 英文的证据不变）。zh 保持作者语言 + 品牌受众。
2. **成功指标**：引用证据（媒体 / LLM / 外链）+ GSC 周 clicks + 订阅数——三者均有现成工具可量（gsc-monitor、backlink 检查、newsletter 后台），见 §7。
3. **语言战略**：zh / en 质量投入不设限；ja / ko / zh-tw 冻结现状（数据字段级自动配对继续走管线，不做任何人工回填）。

**为何从三方视角规划**：这三个利益相关方不是现有主力读者，但站的内容覆盖他们最重（187 场辩论、84 项指标、12 经济体对标、115 个抓手、旗舰项目档案）。以他们的诉求为验收尺度，能保证迭代方向是「机构可信度」而非「个人兴趣」。注意边界：**独立性是三方视角下唯一资产**——他们想要的是独立可信的第三方记录，不是官方合作产物（§6）。

---

## §2 三方视角摘要

| 视角 | 关心什么 | 核心诉求 | 对应路线图 |
| --- | --- | --- | --- |
| **总理 / PMO** | 国际心智份额；公共记录的准确性；海外如何转述新加坡 AI 叙事 | 独立可信的年度合成叙事 + 每个数字可见 as-of 日期 + 议员原话与站方摘要边界清晰 | P0-1、P0-2、P0-3 |
| **EDB** | 生态动能、人才市场流动性、资本与基础设施承诺——招商引资弹药 | 资本承诺从散文变结构化数据；垂直行业视角（对齐 4 个 National AI Missions） | P1-1、P1-2、P2-1、P2-2 |
| **AI 管理者**（AISG / IMDA / SNDGO / 企业 CDO） | 自己管的项目是否被准确完整呈现；运营情报（人才、采用、监管） | 旗舰项目完备性机器校验；「引用此条」即纠错回路；被查询最多的实体有最深覆盖 | P0-3、P1-3、P2-3 |

三方交集（收敛后的判断）：**可溯源（traceability）**是共同底线——总理要防误读、EDB 要防引用被戳穿、管理者要防项目被错记。所有迭代必须守住 rule #6（sourceUrl 可达）与 rule #7（addedAt）纪律。

---

## §3 审计遗留项移交表（20260707 → 本文档）

> 现状经 2026-08-14 代码级核实（非凭记忆）。每条给出「并入本路线图 / 放弃」的去向。

| 审计条目 | 2026-08-14 核实现状 | 去向 |
| --- | --- | --- |
| 年度合成页 "State of Singapore AI 2026"（判断 3） | 无对应页面 / 文章；`src/data/post/en/` 无此 slug | **并入 P0-1** |
| 数据导出 CSV/JSON + 「引用此条」cite 块（判断 3） | 无 CiteBlock 组件（`src/components/common/` 无）；无 `*.json.ts`/`*.csv.ts` endpoint（find 无命中） | **并入 P0-3 + P2-4** |
| newsletter 月报（判断 6） | 站内无 buttondown/newsletter 引用（grep 无命中）；仅 RSS | **并入 P1-4** |
| tracker 头条数字 as-of（判断 4 精神） | `src/components/data/DimensionCard.astro` 无任何日期渲染（grep addedAt/dataDate/asOf/截至/updated 均无命中） | **并入 P0-2** |
| sitemap lastmod（4.2 #6） | `astro.config.ts:76` serialize 钩子存在但只过滤 noindex/query，不写 lastmod | **并入 P2-5** |
| OG 动态图接线（4.2 #9） | `scripts/generate-og-image.mjs` 仅存于 package.json 脚本入口，src/ 零引用 | **并入 P2-6** |
| 议员 stub 转正（4.2 #7） | `src/utils/parliamentary-record.ts` 派生逻辑已就绪；`entity-pages.ts:113` stub 仍 noindex | **并入 P2-7** |
| AISG 解读（判断 4 内容优先级 #2） | 生态实体页硬事实已补齐（S$150M 初始资金、500+ AIAP、SEA-LION v3 70B、NOAI 金牌、Kampong AI 易混澄清均在 `ecosystem.ts`）；**支柱长文未发** | **并入 P1-3** |
| 运维侧 P0（通知链 401、videos 自动 emit、legal-ai 必挂、GSC 凭据） | 已闭环（8 月 PR #164–#183 区间逐一修复） | ✅ 已闭环，不列新工单 |
| .md 域名 6 个月复盘、中文分发决策 | 时间未到 / 独立决策项，不进本路线图 | 挂起至 2027-01 季度复盘 |
| transcripts 迁 JSON、deploy cutover | 工程债，不进本路线图（维持审计 P2 记账） | 挂起 |

---

## §4 路线图（P0 → P2）

> 每条含六要素：服务谁 / 现状证据 / 改法 / 成本 / 验收标准 / 合规注意。成本单位为单人（Luca + Claude Code）工作日。全部实施遵守 i18n 五语纪律（rule #5/#13）、sourceUrl 可达（rule #6）、addedAt（rule #7）、registry 归属（rule #12）。

### P0-1 年度合成页 "State of Singapore AI 2026"（成本 2–3 天）

- **服务谁**：总理 > EDB > 管理者。海外媒体、演讲稿写手、投资机构最需要引用的就是一页叙事。
- **现状证据**：六维 judgment 素材全部现成（`src/data/tracker.ts` 每维 judgment 四语齐），缺合成层。
- **改法**：**v1 走 pillar 长文形态**（slug `state-of-singapore-ai-2026`，`src/data/post/`），复用 post 四语实体文件管线（`scripts/refresh/post-translations/translate-post.ts`）+ RSS 分发，免新页面 i18n 负担。内容 = tracker 六维各一段 judgment + 关键数字 + 挑战一段（引用 `challenges` 页六挑战）+ 数据截至声明。首页 / 导航加「年度报告」入口。独立页面形态留待 v2（有引用数据后再评估）。
- **验收**：zh/en/ja/ko 四文件齐 + `check:post-i18n` 绿 + 首页 updates 露出。
- **合规**：post frontmatter 四语字段；所有数字指向 tracker 现有 MetricRow 及其 sourceUrl，不新造数字。

### P0-2 渲染层 as-of 时间戳（成本 0.5–1 天）

- **服务谁**：三方共享。防止 2026 年的数字在 2028 年被当成「最新」引用——国家级误读风险。
- **现状证据**：`DimensionCard.astro` 无日期渲染；tracker 头条 `S$139/人` 无可见截止日；`addedAt` 在数据层存在但不上屏。
- **改法**：`MetricRow` 加可选 `asOfDate?: string`（YYYY-MM-DD，纯 ASCII 无翻译负担）；Dimension 级加 `headlineAsOf?: string`；渲染「数据截至」chip（文案走 `t()` 字典，五语）。`scripts/evals/stale-stats/check.ts` 扩展「>12 个月的 metric 报 warning」。
- **验收**：六维每头条可见日期；`npm run eval:stale-stats` 仍绿。
- **合规**：新字段为日期字符串，不进 i18n-pair 扫描；不加硬编码文案。

### P0-3 引用此条 CiteBlock（成本 1 天）

- **服务谁**：三方共享；引用即纠错回路——IMDA 的人发现错误时，最现实的入口是「引用此条」旁边的核对路径。
- **现状证据**：无 CiteBlock 组件；详情页无任何 cite 能力。
- **改法**：新 `src/components/common/CiteBlock.astro`，渲染于 debate / policy / tracker 维 / ecosystem 实体 / video 五类详情页：locale 感知稳定 URL（`getPermalink` + `localizedHref`）+ 检索日期（`SITE_UPDATED`）+ APA 风格建议引文 + 复制按钮（零 JS 依赖）。零新数据字段。
- **验收**：五类详情页可见；`check:meta` / `check:schema` 不破。
- **合规**：文案走 `t()`；URL 全部 locale 感知，禁止硬编码 `/en/`。

### P1-1 资本与基础设施结构化视图（成本 2–3 天）

- **服务谁**：EDB > 总理。US$26B 超大规模厂商承诺、主权资本直持前沿模型股权、「政府每 S$1 拉动约 S$13 私人投资」——目前全是 benchmarking 散文里的 assessment 字符串，无法直接引用。
- **现状证据**：`src/data/benchmarking.ts` 投资维 assessment 长文本（如 `'Singapore's AI investment narrative is "S$2bn government + US$26bn tech-giant amplification"...'`）；Theseus Infrastructure 等已作为 ecosystem 实体在维护（2026-08-13 当天入库）。
- **改法**：新数据文件 `src/data/ai-capital.ts`，record = `{ id, kind: 'hyperscaler-commitment' | 'sovereign-investment' | 'fund', announcedAt, amountSgd?, amountUsd?, sourceUrl, addedAt, ecosystemEntityId? }`——**实体名复用 ecosystem 实体 id**，避免重复翻译负担。v1 数据从 benchmarking 散文 + ecosystem 现有实体迁移（Theseus、GIC-Anthropic、Temasek-OpenAI、Microsoft/Google/AWS 承诺等）。**页面位置已定死：并入 `/ecosystem` 页内新 section + tracker investment 维派生行，不开新顶级路由**（尊重审计「导航瘦身、不新增页面类型」）。「S$1→S$13」比值做 render-time 派生计算，显式写公式（政府承诺总额为分母、超大规模厂商承诺为分子）与口径 caveat；**无口径不发数字**。
- **验收**：section 渲染、每 record 可溯源（sourceUrl 全 HTTP 校验）、比值有口径文档。
- **合规**：sourceUrl 全走 rule #6 校验；`scripts/refresh/registry.json` 登记（rule #12，v1 editorial + reason，后续接管线）；四语标签走 `t()` 字典，数据值零 CJK。

### P1-2 National AI Missions 垂直 hub（成本 1 天）

- **服务谁**：EDB > 管理者。EDB 按行业卖（先进制造、金融、医疗、互联互通），现状是 missions 是一篇博客、startups 有 5 垂直分类、levers/tracker 是横向——没有打通的视图。
- **现状证据**：`src/data/topics.ts` 15 个 topic，其中 `finance`、`healthcare` **已存在**；`advanced-manufacturing`、`connectivity` 缺失；`src/utils/topic-graph.ts` 的 entriesByTopic 跨域聚合机制现成。
- **改法**：新增 `advanced-manufacturing` + `connectivity` 两个 topic 记录；为 4 个 mission 垂直做跨域策展（topicIds 关联 debate/policy/lever/post/video，每 topic ≥5 条）+ 首页 featured rail。**不做新页面类型**。
- **验收**：4 个垂直 topic 页跨域聚合 ≥5 条；`npm run check:graph` 绿。
- **合规**：topic 的 title/description 四语字段同 commit 写入（rule #5）。

### P1-3 AISG 支柱长文（成本 2 天）

- **服务谁**：管理者 > EDB。补齐「被查询最多实体覆盖最薄」的错配（审计判断 4 内容优先级 #2，~680 展示的 query 簇）。
- **现状证据**：AISG 生态实体页已含全部硬事实（`ecosystem.ts`：S$150M 初始资金、500+ AIAP、SEA-LION v3 70B、NOAI 金牌、AI Trailblazers/Kampong AI 两个易混名澄清）；长文未发。
- **改法**：slug `aisg-explained`，硬事实全部取自现有实体页，绑定 ≥5 站内实体链接；四语经 translate-post 管线。
- **验收**：四语发布 + AISG 实体页互链 + 首页 updates 露出。
- **合规**：不引入实体页之外的新事实；新事实必须 sourceUrl 校验。

### P1-4 月报 newsletter（成本 1 天 + 外部账号）

- **服务谁**：研究者 / 记者 / 创始人留存（审计判断 6：零留存形态）。
- **现状证据**：无订阅入口；`deriveUpdates()` 月度数据结构现成。
- **改法**：月报内容 = `deriveUpdates()` 当月精选 + 一段站方判断，脚本半自动生成 markdown；Buttondown 免费档 + 站内订阅表单（零 JS）。
- **验收**：订阅表单上线；月报模板可从 updates feed 一键生成。
- **合规**：唯一有外部账号依赖的条目，需 Luca 手动开 Buttondown 账号；可延后不阻塞 P0。

### P2-1 jobs-index 行业切片（成本 1–2 天）

- **服务谁**：EDB > 管理者。人才流动性证据的行业颗粒度。
- **现状证据**：`src/data/ai-jobs-index.ts` METHODOLOGY_VERSION = 1 冻结纪律；roleTypes 已有（工程/研究/数据/产品/GTM/运营），无行业维。
- **改法**：`scripts/refresh/jobs-index/compute.ts` 加 sector 分类（LLM 批处理，同 roleTypes 模式）；**bump METHODOLOGY_VERSION 到 2 并文档化**（v1 冻结，禁止跨版本同图比较）。
- **验收**：新快照含 sector 计数；/talent 渲染行业分布。
- **合规**：历史快照不动；版本注释更新。

### P2-2 企业采用行业切片（成本 1 天）

- **服务谁**：企业 CDO > EDB。企业 CDO 最想知道「我落后了还是领先了」。
- **现状证据**：Microsoft（60.9% 采用）、Anthropic（AUI 5.53 #1）、OpenAI（人均消息 #1）三份独立数据集已入 tracker/posts，但全是国家层面。
- **改法**：从三份源数据提取行业维度，adoption 维新增 ≥1 条 sector 级 MetricRow（asOfDate 走 P0-2 新字段）。
- **验收**：adoption 维出现行业级行且带 sourceUrl。
- **合规**：数字必须来自三份已入库报告的原文，禁止推断。

### P2-3 旗舰项目完备性校验（成本 0.5 天）

- **服务谁**：管理者。保证「新加坡 AI 名片」被一等公民呈现。
- **现状证据**：`scripts/verify-graph.ts` 已有 ID 唯一性等断言；`ecosystem.ts` 已澄清 AI Trailblazers/Kampong AI 的易混归属——说明错配真实存在。
- **改法**：verify-graph 加 FLAGSHIP_PROGRAMS 清单断言：每个旗舰项目（AIAP、100E、SEA-LION、AI Verify、TagUI、NOAI、AI Trailblazers、Kampong AI 等）必有 ecosystem 实体 + ≥1 lever 关联 + 四语字段。
- **验收**：`check:graph` 绿；新增旗舰项目自动受检。
- **合规**：断言级扩展，不新建门。

### P2-4 数据导出（成本 1 天，依赖 P0-3）

- **服务谁**：三方共享。研究者引用的最后一公里；审计判断 3「可被使用、可被引用」。
- **现状证据**：无任何 JSON/CSV endpoint。
- **改法**：Astro endpoint 静态生成 `debates.json` / `policies.json` / `tracker.json` + CSV；CiteBlock 内放导出链接。
- **验收**：URL 直出合法 JSON/CSV，零 JS。
- **合规**：导出内容与页面渲染同源（同 pickLocalized 语义），避免双真相。

### P2-5 sitemap lastmod（成本 0.5 天）

- **服务谁**：SEO（审计 4.2 #6）；站点卖点是「持续更新」，却从不告诉 Google 哪页更新了。
- **现状证据**：`astro.config.ts:76` serialize 钩子存在但只过滤 noindex/query。
- **改法**：serialize 内用 `addedAt` → `<lastmod>`（派生逻辑同 `SITE_UPDATED`）。
- **验收**：sitemap 含 lastmod；无 noindex 泄漏。
- **合规**：不改变现有过滤逻辑。

### P2-6 OG 动态图接线（成本 1 天）

- **服务谁**：分享转化（审计 4.2 #9）。
- **现状证据**：`scripts/generate-og-image.mjs` 仅存于 package.json 脚本，src/ 零引用。
- **改法**：先覆盖首页 + 六维 tracker 页 + 年度报告（P0-1）。
- **验收**：上述页面有独立 OG 图。
- **合规**：保持静态生成，不进运行时。

### P2-7 议员 stub 转正（成本 2 天）

- **服务谁**：people 板块解冻 + 人名 query 流量（审计 4.2 #7，ong teng koon 522 展示已验证）。
- **现状证据**：`entity-pages.ts:113` stub noindex；`parliamentary-record.ts` 派生逻辑已就绪。
- **改法**：从 debates 派生「该议员的 AI 议会记录」区块，批量去 noindex。
- **验收**：N 个 stub 页转可索引；check:schema 绿（新页带 Person schema）。
- **合规**：无议会记录的低信号人物维持 noindex（复用 `quality.ts` 的 isLowSignalPerson 判断）。

---

## §5 执行顺序与节奏

总成本约 18–20 人天，跨 2–3 个月。原则：**先做纯渲染的小改动建立节奏，再做内容杠杆**（审计教训：工程挤占内容两个月，本次反过来）。

| 时段 | 条目 | 理由 |
| --- | --- | --- |
| Week 1 | P0-2 + P0-3 + P2-5 | 最小纯渲染改动，零新数据；合计约 2 天 |
| Week 2–3 | P0-1 | 最大内容杠杆，写作 + 四语翻译为主 |
| 月 2 | P1-1、P1-2 | 数据迁移 + topic 策展 |
| 月 3 | P1-3、P1-4 | 长文 + 留存闸门 |
| 季度余量 | P2-1…P2-7 按依赖推进 | P2-4 依赖 P0-3 |

依赖关系：P2-4 ← P0-3；P2-6 建议 ← P0-1；P2-2 建议 ← P0-2（复用 asOfDate 字段）。

---

## §6 明确不做

1. **不新增数据域 / 页面类型**——`ai-capital` 是唯一例外且已列入 P1-1（作为 /ecosystem section，非新路由）。
2. **不再加固 eval / 门**——防御体系已强于它所保护的内容体量；仅允许 P2-3 这类断言级扩展。
3. **不做 ja / ko / zh-tw 回填**——等需求证据（§1 语言战略）。
4. **不追求官方合作 / 背书**——三方视角下本项目的唯一资产是独立（About 页「没有任何机构或政府背景」），任何官方化都会摧毁可引用性。三方需要的是独立可信的第三方记录。
5. **本年度不迁移域名**——刚经历一次迁移，二次迁移是自残（审计判断 12）。

---

## §7 成功指标（可量测，工具现成）

| 指标 | 目标 | 工具 |
| --- | --- | --- |
| 外部引用证据 | 年度报告页 / 核心数据被外部引用 ≥1 次/季 | gsc-monitor + 手动 backlink 检查 |
| GSC 周 clicks | 持续环比上升 | `scripts/evals/gsc-monitor/`（已实现，配好凭据） |
| newsletter 订阅 | 3 个月 ≥100 | Buttondown 后台 |
| P0 落地 | 三项 2 周内上线且 `npm run check` 全绿 | CI |

---

## §8 关联

- [20260707-project-audit.md](20260707-project-audit.md) —— 本文档的前置审计，遗留项移交见 §3。
- [20260505-site-product-growth-plan.md](20260505-site-product-growth-plan.md) —— 增长计划与「执行状态盘点」模式来源。
- [20260717-keyword-strategy.md](20260717-keyword-strategy.md) —— 关键词策略。
- [20260811-jako-title-unification-plan.md](20260811-jako-title-unification-plan.md) —— 数据治理类规划的体裁参照。
- CHANGELOG 0.23.5（2026-08-13）—— 本文档起草时的站况基线。

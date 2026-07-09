# sgai 项目全面审计（2026-07-07）

> 范围：产品方向 / 内容选择 / SEO / 数据源与质量 / 更新方式 / 多语言 / 工程债。
> 方法：5 路并行侦察（数据层、SEO 实现、内容、管线自动化、线上站点+竞争）+ 战略文档与 git 历史复盘 + GSC 基线数据。所有判断附证据出处。
> 基线日期 2026-07-07；站点上线 2026-02-17（442 commits，4.5 个月）；GSC 首个完整周期数据 2026-05-02 ~ 06-07。

---

## 总判断

**这个项目的工程是 A+，经营是 C。最大的风险不是质量，是投入错配。**

1. **工程质量远超同类站**：数据治理（0 积压、stale-stats 全绿、反漂移派生设计）、SEO 工程（零 JS island、schema 双层护栏、noindex 自剔除 sitemap、GSC API 巡检）、i18n 防御体系，都是独立站里罕见的水平。这一面不需要再加固。
2. **但站点的立站理由正在停更**：About 页说独立观点是"否则没必要做这个站"的理由，实际观点层只有 7 篇长文，对 900+ 条数据记录约 1:130；最近一篇 06-09，7 月断更；5 月增长计划里"仅剩的主体工作"（10 篇支柱长文）两个月没动。编辑精力全部流向修管线和防御性工程。
3. **三个战略问题悬了两个月没回答**（20260505 增长计划 §12 原样列着）：第一目标用户是谁？成功指标是什么？语言战略是什么？GSC 已经替你回答了第三个——已分类搜索需求 97.9% 是英文，中文仅 262 次展示——但内容生产仍是中文优先、站名中文、五语承诺半兑现。
4. **自动化是"半自动"且单点已断**：调度挂在一台 Mac 上且查无触发源（crontab/launchd/GH Actions 都没有）；通知链路 401 已死——07-07 当天扫到的 3 条新视频就这么静默丢了；11 条 auto-PR 管线有 4 条从未产出过一个有效合并。
5. **SEO 技术层只剩收尾**，真正的增长杠杆在内容和权威：英文长尾已经在赢（"Singapore parliament AI debates" 排 #1），头部词和中文市场缺的是内容深度、外链、分发渠道——不是代码。
6. **一个 30 分钟就能修、正在持续放血的洞**：旧域名 meltflake.com/aisg/* 全部 404、零重定向，旧 URL 还在 Google 索引里。

一句话行动纲领：**停止加固已经过剩的工程面，把每月的可支配精力搬回长文和分发；本周先修掉 301、通知链、GSC 凭据三个即时止血点。**

---

## 一、现状基线（事实）

| 维度 | 数据 |
| --- | --- |
| 页面规模 | 5,338 页构建 / 线上 sitemap 5,465 URL（~1,090 × 5 语言） |
| 数据资产 | debates 179（与 transcripts 100% 配平）、policies 44、ecosystem 44、videos 68、people 32 + 议员 stub 196、startups 46 档案、benchmarking 12 经济体、levers ~115、topics 15 |
| 观点资产 | 长文 7 篇（6 原创 + 1 透明标注译文）；en/ja 全译 7/7，ko/zh-tw 仅 4/7 |
| 搜索表现 | 460 clicks / 129,403 impressions / CTR 0.36% / 平均排名 11.5（首个完整周期）；已分类 query 中英文占 97.9%，中文 262 imp |
| 单点验证 | "Singapore parliament AI debates" #1；"Singapore AI policy tracker" ~#6；中文头部词（"新加坡 AI 战略/政策"）前 10 全无 |
| 更新体系 | 14 条 registry 管线；核心 6 条正常出 PR 并快速合并；4 条（legal-ai/levers/talent/tracker）从未合并过 |
| 代码结构 | src/data 41MB TS（30MB 是 transcripts）；34 个 check/eval 脚本，约一半是 i18n 防御；核心 i18n 检查代码 4,639 行 |
| 开发模式 | Luca + Claude Code 高强度 burst（5 月 279 commits，6 月 29，7 月前 6 天 40）；bus-factor = 1 |

---

## 二、产品方向

### 判断 1：战略问题不回答，工程就在替空白的战略打工

20260505 增长计划 §12 列了 7 个待确认问题，第一条就是"第一目标用户是谁：全球政策/产业读者，还是中文创业者/研究者？"——两个月过去没有答案，但期间做了五语言全量、en-root 翻转、news-front-page 首页、topics hub。这些都是好工程，但它们服务的目标彼此并不一致：

- en-root 翻转（05-05）押注全球英文读者；
- 站名「新加坡 AI 观察」、中文优先创作、选题视角（"向中文读者解释新加坡"）押注中文观察者；
- 五语承诺（ja/ko/zh-tw）押注一个没有任何需求证据的第三受众。

**建议**：按数据定方向——**主战场是英文政策/产业研究者**（97.9% 的需求 + 长尾已验证），中文降级为"作者语言 + 品牌受众"（品牌词已霸屏，够了），ja/ko/zh-tw 冻结在现状（见第七章）。这不需要改任何代码，需要的是写进 CLAUDE.md 的一句话，让之后每个 PR 的优先级判断有依据。

### 判断 2：成功指标缺失，导致无法辨别"忙"和"有效"

站点没有定义成功指标。5-6 月的实际产出模式是：工程投入巨大（i18n 治理、eval 加固、listing 重构），流量核心杠杆（支柱长文、AISG 内容缺口、议员页升级——GSC hardening 文档里自己列的 ROI 排序）反而排队两个月。

**建议**：定 3 个月指标，就用现成工具量：
1. GSC 周 clicks（gsc-monitor 已实现，配好凭据即可自动周报）；
2. 支柱长文发布数（目标：每月 2 篇，清单 5 月就写好了）；
3. 被引用证据（媒体/LLM 引用、外链数——这是"研究产品"定位的唯一硬验证）。

### 判断 3：差异化真实存在，但"研究产品"缺使用面

竞争侦察结论：中英文都**没有**"持续更新的新加坡 AI 结构化数据库"这个物种——英文是官方站+律所 tracker+垂直媒体，中文全是一次性长文。差异化是真的。

但"可被使用、可被引用"（增长计划的原话）目前只有 llms.txt/llms-full.txt 和 RSS。研究者引用需要的东西一个都没有：数据导出（CSV/JSON）、每条记录的"引用此条"（cite this）、数据快照版本化。这些是把"数据库"变成"研究产品"的最后一公里，也是外链的天然来源（引用即外链）。

**建议**（P2）：给 debates/policies/tracker 加导出端点和 cite 块；做一页 "State of Singapore AI 2026" 年度合成报告（数据都在，缺的是合成层），这类页面是媒体外链磁铁。

---

## 三、内容选择

### 判断 4：观点层 1:130，且被自己的导航埋没

- navigation.ts 把「观察」折进「辩论」下拉，代码注释直言 "a single-link section reads too thin"——**因为内容太少所以藏起来，藏起来所以更没有增长压力**，这是个自锁死循环。
- 首页新闻门户范式把数据规模条和更新流放最前，编辑论点是 "second act"。对一个以判断力立站的独立站，这个顺序反了。
- topics 15 个 hub 是纯聚合壳（唯一原创是每个 topic 1-2 句 description），进一步放大了"聚合多、判断少"的失衡。

**建议**：内容优先级唯一化——**支柱长文 > 一切新工程**。清单现成（增长计划 §6.2 的 10 篇），前三篇直接对准 GSC 已验证需求：
1. "新加坡 AI 战略到底强在哪"（头部词长线）；
2. AISG 完整解读（"aisg budget/employees/kampong ai/tagui" query 簇 ~680 imp，已知缺 hard facts）；
3. "国会十年在担心什么 AI 问题"（debates 数据的合成层，反哺 #1 排名的辩论板块）。

每篇按增长计划的写作原则绑定 5+ 个站内实体页——这同时是内链工程。

### 判断 5：门面数字打架，正在侵蚀"可溯源"这个核心卖点

创业公司数出现 4 个口径（README 650+ / About 500+ / startups.ts 548 / 实际档案 46）；辩论数 3 个（139/150/179，README 同一文件里就自相矛盾）；政策数 20 vs 实际 44。一个把"每条可溯源"写进 About 的站，自己的门面数字对不上，这比任何单个 SEO bug 都伤。

讽刺点：stale-stats eval 治理数据文件内的统计块非常成熟，但 README/About 恰好在守卫范围外。

**建议**（P0，1-2 小时）：统一口径（以数据文件为真值），并把 README/About 纳入 stale-stats 扫描（或做成从数据派生的构建产物）。

### 判断 6：零留存形态——流量是"查完就走"的

无 newsletter、无邮件捕获、无对比工具、无年度报告、无 FAQ/术语表（站内 NAIS/NAIRD/AUI 缩写密度很高）。唯一订阅入口是 RSS。5 月计划明确"暂不把 newsletter 作为第一优先级"——当时对（索引质量优先），现在该翻案了：目标受众（研究者/记者/创始人）是邮件列表最典型的人群，updates feed 数据结构现成，月报可以从 derived updates 半自动生成。

**建议**（P1）：月度 digest newsletter（Buttondown/Listmonk 之类零成本起步），内容 = 当月 updates 精选 + 一段站方判断。这是把 SEO 流量变成资产的唯一闸门。

### 判断 7：弃坑的板块比没有板块更伤

fieldnotes 只有 1-2 条、44 天未动，还占着 footer 导航位。数据两极分化：policies/ecosystem 日更新鲜，people 48 天冻结、references 45 天。

**建议**：fieldnotes 要么并入博客 category 关停路由，要么排进季度计划；people 的解法见 SEO 章（议员 stub 升级一石二鸟）。

---

## 四、SEO

技术面结论先行：**工程化程度远超同类站，剩下的是收尾级修复；增长杠杆全在内容+权威侧。** 以下按 ROI 排序。

### 4.1 即时止血（P0）

| # | 问题 | 证据 | 修法 | 成本 |
| --- | --- | --- | --- | --- |
| 1 | **旧域名 301 断裂**：meltflake.com/aisg/* 全 404，旧 URL 仍在 Google 索引，权重与用户双流失 | curl 实测 404 / num_redirects=0；搜 "meltflake.com/aisg" 第一条即死链 | 在 meltflake.com 的 Cloudflare 配 redirect rule：`/aisg/*` → `https://sgai.md/zh/$1`（旧站是中文站，映射 /zh/ 语义正确） | 30 分钟，本仓库外 |
| 2 | **GSC monitor 缺凭据**：striking-distance/ctr-anomaly/zh-recovery 三检测器已写好、周 cron 已接，只差 service account | scripts/evals/gsc-monitor/SETUP.md 状态注释 | 按 SETUP.md 走一遍 | 15 分钟 |
| 3 | **canonical↔hreflang 信号冲突**：legal-ai/CaseProfile 把 canonical 改指孪生页，CommonMeta 仍无条件输出自指 hreflang，Google 要求簇内自我 canonical | legal-ai/[id].astro:90、CaseProfile.astro:72 vs CommonMeta.astro:15-29 | canonical 改指时同步让 hreflang 指向目标（或对合并页抑制 hreflang）；顺手加一致性 eval | 2-3 小时 |
| 4 | **description 词中硬切 + 双品牌尾巴**：`.slice(0,200)` 无词边界（线上实测 "…NS needs identifica"）；详情页自加 "· Singapore AI Policy" 再叠 "· sgai" 模板 | policies/[id].astro:47-54；线上 /debates/budget-437/ title 101 字符 | 按词边界截断 ≤160；详情页去掉自带品牌后缀或 ignoreTitleTemplate；加 title 长度 eval | 半天，180+ 页 × 5 语受益 |
| 5 | **www.sgai.md 无 DNS** | dig 返回空 | 加 CNAME + 301 到 apex | 5 分钟 |

### 4.2 本月（P1）

6. **sitemap 加 lastmod**：5,465 URL 全裸 `<loc>`。站点卖点是"持续更新"，但没告诉 Google 哪页更新了。addedAt/SITE_UPDATED 数据现成，接进 astro.config sitemap serialize 即可。
7. **议员 stub 升级为可索引 programmatic 页**（GSC hardening backlog #2）：人名 query 是已验证流量类型（ong teng koon 522 imp），193 个 stub 大多 noindex。从 debates.ts 派生"该议员的 AI 议会记录"区块即可低成本转正——同时解决 people 板块 48 天冻结问题。
8. **ecosystem/opensource 详情页补 Organization/Article schema**：现在只有 BreadcrumbList，而 AISG 页正是 GSC 流量缺口所在。
9. **OG 动态图接线**：generate-og-image.mjs 已写好但 0 引用，数千页共用一张默认图。
10. **弱 AI 相关辩论排查**：budget-437 类页面挂着 "AI Debate" title 但内容是 SAF50/国民服役，批量存在会稀释 /debates/ 主题聚焦（该板块是全站排名最强资产，值得保护）。给非 AI 主体的辩论降权（改 title 模板或 noindex）。

### 4.3 战略层

11. **中文市场：接受现实或做分发，不要空等**。/zh/ 有 1,095 页供给，头部词前 10 全是律所/机构一次性长文；zh 区平均排名基线 ~28（5-05 翻转后从零重建）。靠站内 SEO 等不来中文流量——要么明确放弃（品牌词已够），要么做站外分发（公众号/知乎转载长文带回链）。另：Baidu 收录与墙内可达性从未验证过，中文若重要这是前置事实。
12. **.md 域名是长期逆风，但现在不动**：.md 不在 Google gccTLD 名单（默认地域定向摩尔多瓦，GSC 手动定向工具已废弃）。实测长尾靠内容相关性能赢（debates #1），风险集中在与 .sg/.com 竞品的同分对决。刚经历一次域名迁移（meltflake→sgai.md 的 301 还断着），一年内第二次迁移是自残。**建议：注册一个 .com 备用域防身，6 个月后拿 GSC 地域数据复盘**。

---

## 五、数据源与数据质量

### 判断 8：治理成熟度是本项目最被低估的资产

- 积压近零（0 条 _pendingReview、仅 benchmarking 4 条 autoDiscovered 待审）；
- 数据源分布健康（debates 100% 官方 Hansard 属恰当集中；ecosystem AISG 占 25% 可解释）；
- 抽查内容质量为真编辑价值而非 AI slop：辩论摘要点名议员与技术文件、带批判视角，policySignal 是真解读；
- URL 反幻觉纪律（rule #6 + validateUrls）在 c574e54 事故后建立且有效。

这些值得保持，不需要新投入。

### 需要修的三个点

13. **DEBATE_STATS 是静态快照**（Python 管线生成），手改 debates 数组会静默失真且无 eval 断言同步。加一个 10 行的一致性断言进 check 链。
14. **README/About 数字漂移**（见判断 5）。
15. **transcript 覆盖与承诺不符**：debate-transcripts 的 ja 覆盖 0%（179 条全缺）、speech-transcripts ja/ko 各 61%。这不是"补翻译"的工单，是"承诺该不该收缩"的决策——见第七章。

---

## 六、更新方式与自动化

### 判断 9：这套体系的问题不是"不跑"，是"跑了没人知道、坏了没人知道"

07-06/07 的日志证明心跳都在触发，核心 6 管线（policies/ecosystem/startups/benchmarking/github-stars/voices）正常出 PR 且 1 小时内被合并。但：

| # | 问题 | 证据 | 修法 |
| --- | --- | --- | --- |
| 16 | **通知链 401 已死（最急）**：gh 走 macOS keychain，cron/锁屏时段拿不到凭据。scan-only 管线的新内容通知和 evals 失败告警全部静默丢弃。**07-07 当天扫到 3 条新视频（CNA/ST/AISG）因此丢失** | cron.log 反复 `gh issue create 失败: 401`；08:13:11 issue 挂 vs 08:13:47 PR 成功=恰好人在解锁 | 给 cron 环境注入 `GH_TOKEN`（PAT，repo+issue 权限），不走 keychain；顺手把丢的 3 条视频 emit 回来 |
| 17 | **调度是黑箱**：GH Actions 无 schedule、crontab -l 无 sgai、launchd 无 plist、`--status` 报 "managed crontab NOT installed"——在跑但查无触发源；三份文档写法互相打架且都没装 | agent 实测 + auto_update.py docstring vs SETUP.md vs playbook | 用 `auto_update.py --install-cron` 把 managed block 真装进 crontab，删掉文档里另外两种写法；把实际触发源写进 SETUP.md |
| 18 | **legal-ai 管线必挂 CI，从未合并过**：#11/#110 双红（verify-graph + dist i18n）；根因含 section 包装头漏 philosophyKo 且 rollback 不校验 philosophy | gh run view 28762446509 | 修 emit（补 Ko + rollback 覆盖 philosophy）或降级为 scan-only。别让它每半年烧一次算力再挂一次 |
| 19 | **levers/talent/tracker 三条空转**：候选全被壳页/相关性过滤，"no enriched items"，从未产出有效 PR | 07-06 日志 | 换源（gov sitemap 的 client-render 壳页是根因）或直接从 registry 降为手动。空转的管线是负资产：它制造"已覆盖"的错觉 |
| 20 | **schedule 成功戳造假**：record_schedule_runs 无条件打戳，legal-ai 挂了、三条空转，--status 照样全绿 | auto_update.py:838-840，作者注释自认 | 戳与 per-pipeline 结果挂钩，失败进 issue（等 #16 修好后才有意义） |
| 21 | 杂项：github-stars 无 token 19/38 拉取失败；venv 在 /tmp 重启即清；#67 hansard backfill PR（CLEAN）晾了 17 天 | 日志/SETUP.md | export GITHUB_TOKEN；venv 挪 ~/.venvs/sgai；合掉 #67 |

### 判断 10：videos 的"扫描→人工 emit"断点应该自动化

videos 是唯一 daily 管线，但 emit 靠人工跑命令。通知一断（现状）内容就丢。AISG/CNA/ST 三个白名单频道的高置信候选完全可以自动 emit + 开 PR（transcript 链已自动化），人只做 merge 决策。这是把"每周人工记得做"变成"每周 review 一下"的典型改造。

### 判断 11：bus-factor = 1 是接受的现状，但要把"接受"变成显式设计

调度在本机、判断靠本人、通知靠本人翻 GitHub。对单人项目这可以接受，但前提是：告警链可靠（#16）+ 触发源可审计（#17）+ 文档与现实一致。三者都修完之后，"Luca 一周不开机"的最大损失应该是数据晚更新一周，而不是像现在这样静默丢内容且无人知晓。

---

## 七、多语言战略：五语是税，不是资产（目前）

**成本证据**：34 个 check/eval 脚本约一半是 i18n 防御；核心检查代码 4,639 行；CLAUDE.md 13 条最高优先级规则 6 条是 i18n 纪律；已记录事故包括 ko 翻译 5 小时报废（postmortem 文档）、zh-tw 5,766 处简体残留、ja purity 多轮返工、2026-07 全站二元 lang 治理。src/data 41MB 里 30MB 是 transcript（大头为翻译产物），构建全量 parse。

**收益证据**：零。GSC 已分类需求 97.9% 英文、中文 262 imp，ja/ko 需求在任何文档里都没有出现过。ko/zh-tw 长文只译了 4/7，About 页 ko 回退英文——**五语承诺实质是"中英双语 + 一个全量 ja + 两个半成品"**，对外宣传反而是个可被戳破的点。

**建议（收缩，不拆除）**：
- **保留 zh（创作语言）+ en（主战场）**，这两个的质量投入不设限。
- **ja/ko/zh-tw 冻结在现状**：数据字段级配对继续走自动管线（边际成本已低、rollback 自保成熟，拆除反而伤筋动骨）；但**停止一切人工/算力密集的回填**——debate-transcripts 的 ja（179 条全缺）不补、speech 的 ja/ko 缺口不补、ko/zh-tw 长文缺的 3 篇不补。
- **把承诺改小**：About/README 把"五语言"表述改为"中英双语，日韩繁提供自动translated版本"之类的诚实说法；transcript 缺失语言的页面明示"以 en/zh 呈现"。
- **6 个月后用数据复盘**：gsc-monitor 周报加 per-locale impressions 维度，ja/ko/zh-tw 若持续无信号，考虑从 sitemap 降权甚至下线 ko/zh-tw 路由树（-2,180 页，构建时间和防御面同步减半）。

---

## 八、工程与技术债（P2，不急但记账）

22. **transcripts 出 TS**：23MB 的 debate-transcripts.ts 单文件 + 7.4MB video-transcripts.ts 让每次构建全量 parse TypeScript。迁 JSON（import assertion 或 fs 读取）可显著降构建内存/时间，emit 模板同步改（注意 rule #8 的二次踩点教训：emit 模板里嵌的 helper 是第二真相源）。
23. **repo 在 Dropbox 里 + dist 残留冲突副本**：本地 dist/ 是陈旧的 Dropbox 冲突产物（sitemap 只剩 1 条 URL 的假构建）。至少把 dist/node_modules/.astro 加进 Dropbox 忽略列表，避免同步风暴和误读。
24. **deploy cutover 未完成**：CLOUDFLARE_API_TOKEN/ACCOUNT_ID secrets 未配，deploy.yaml 只构建不部署，靠 legacy git 集成兜底——属 latent 割接风险，找个发版日切掉。

---

## 九、行动清单

### P0 · 本周（合计约 1 天）
| 动作 | 出处 | 成本 |
| --- | --- | --- |
| meltflake.com/aisg/* → sgai.md/zh/* 301（旧域名侧 Cloudflare） | #1 | 30 min |
| cron 注入 GH_TOKEN 修通知链；补 emit 丢失的 3 条视频 | #16 | 1-2 h |
| GSC monitor service account 凭据 | #2 | 15 min |
| README/About 数字统一 + 纳入 stale-stats | 判断 5 | 1-2 h |
| description 词边界截断 + 双品牌尾巴 + canonical↔hreflang 冲突 | #3 #4 | 半天 |
| www DNS + 301 | #5 | 5 min |

### P1 · 本月
| 动作 | 出处 |
| --- | --- |
| **支柱长文恢复月更 2 篇**（AISG 解读 / 战略强在哪 / 国会十年）——高于一切新工程 | 判断 4 |
| 议员 stub → 可索引 programmatic 页（193 个，debates 派生区块） | #7 |
| sitemap lastmod（addedAt 派生） | #6 |
| 调度显式化（--install-cron + 文档归一） | #17 |
| legal-ai 修或停；levers/talent/tracker 换源或降手动 | #18 #19 |
| videos 高置信频道自动 emit | 判断 10 |
| ecosystem/opensource schema + OG 图接线 + 弱 AI 辩论降权 | #8 #9 #10 |
| newsletter 月报（updates feed 派生） | 判断 6 |

### P2 · 本季度（战略决策）
| 动作 | 出处 |
| --- | --- |
| 回答三个战略问题并写进 CLAUDE.md（目标用户=EN 研究者 / 成功指标 3 项 / 语言战略收缩） | 判断 1-2、第七章 |
| 中文分发决策：公众号/知乎转载 or 明确放弃中文 SEO | #11 |
| 数据导出 + cite 块 + State of Singapore AI 年度页（外链磁铁） | 判断 3 |
| .md 域名 6 个月数据复盘（先注册 .com 备用） | #12 |
| transcripts 迁 JSON；deploy cutover 完成 | #22 #24 |

### 明确不做（跟 5 月计划一致，仍然成立）
- 不新增数据栏目/页面类型——12 个域已经多到要做"孤儿页救援"；
- 不再加固 eval/gate——防御体系已强于它所保护的内容体量；
- 不做 ja/ko/zh-tw 的任何回填——等需求证据；
- 不迁移域名（本年度）。

---

## 附：证据来源

- GSC 基线与修复史：docs/20260610-gsc-seo-hardening.md
- 增长计划与执行盘点：docs/20260505-site-product-growth-plan.md（§12 战略问题未答）
- i18n 翻转决策：docs/20260505-global-i18n-routing-plan.md
- ko 事故复盘：docs/20260525-ko-translation-postmortem.md
- 管线现场证据：scripts/logs/cron.log、scripts/logs/auto_update_2026-07-0{6,7}.log、scripts/data/last_scan_state.json、gh pr list/checks（#106-111、#110 双红、#67）
- 线上实测（2026-07-07）：robots/sitemap/首页 head/budget-437/topics 页抓取、meltflake.com/aisg 404、www DNS、gccTLD 名单核对
- 本审计由 5 路并行侦察 + 战略文档复盘产出（Claude Code session，2026-07-07）

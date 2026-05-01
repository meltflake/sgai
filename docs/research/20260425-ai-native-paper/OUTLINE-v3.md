# 论文结构 v3 — 两节平行展开 + 国家级用六抓手分类

修订理由：
- 用户判断"两种形态各自一节"更干净——v2 的"五要素对照表"把公司和国家强行平行排列，反而稀释两边各自的肌理
- 国家级研究探到的内容很多（200+ 项目），需要更好的分类方式才能展开

新结构：第二节专写 AI-native 公司、第三节专写 AI-native 国家、第四节做对比和原创论点。
日期：2026-04-25

---

## 工作标题（三个备选）

1. **从 50 人到 5,700,000 人——同一种 AI-native 架构，两个尺度**（推荐）
2. **国家不可能"自己"AI-native——新加坡 Budget 2026 的真正赌注**
3. **当一座城邦想跟 Cursor 一样跑步**

---

## 整体结构（五节，目标 ~7,500 字）

| 节 | 主题 | 字数 |
|---|---|---|
| I | 同一种架构，两个尺度（开篇 + 操作性定义） | ~800 |
| II | **AI-native 公司是什么样**（YC 五要素 + Jack Dorsey 结构） | ~1500 |
| III | **AI-native 国家是什么样**（新加坡完整图谱，6 抓手 + 3 层风险） | ~4000 |
| IV | **核心论点：国家是企业的包装层 + 7 条传导杠杆** | ~800 |
| V | 收尾 + 开放问题 + 值得跟踪的 KPI | ~400 |

---

## 第 I 节｜同一种架构，两个尺度（~800 字）

### 开篇钩子

> 2026 年同时有两类 AI-native 试验在跑。
>
> 一类是 50–500 人的公司——Anthropic、Cursor、Lovable——从第一天起把 AI 放在工作流核心。YC 合伙人 Diana 把方法论说得最准：**"AI 不是公司用的工具，是公司运行的操作系统。"**
>
> 另一类是 **5.7 million 人的城邦**。新加坡 Budget 2026 把 AI 列为整份预算案的战略核心，PM Wong 亲挂帅 National AI Council，跨 11 部委的 Committee of Supply 全部围绕 AI——这是迄今为止**唯一一个把"AI-native 国家"作为明确战略目标**的主权国家。
>
> 把这两个并排放，会看到一个被忽视的事实：**AI-native 不是规模，是架构。**

### 操作性定义（用 YC Diana 起头，再锐化）

什么叫一个组织"AI-native"？三条判定标准：

1. **AI 在决策关键路径上**：核心判断默认 AI 先出，人类做例外审批
2. **工作流以 AI 为默认假设**：流程、数据、artifact 按"AI 是主要消费者"设计
3. **激励对齐 AI 增强**：晋升、招聘、培训不奖励"绕开 AI 的人肉英雄"

### 论点预告

公司用一种方式做这三条；国家必须用完全不同的方式做同样三条。新加坡的赌注不是算力 / 数据 / 模型——这三个生产要素它都不占优。它在赌**执行架构**：用国家级杠杆放大本土企业的 AI-native 转型速度。

---

## 第 II 节｜AI-native 公司是什么样（~1500 字）

按 YC Diana 的方法论展开五个支柱，再补 Jack Dorsey 在 Block 的"取消中层"组织设计。

### II.1 Closed Loop（闭环系统 / 控制论框架）

- Open loop：做决定 → 执行 → 不系统测量 → 不调整。本质有损
- Closed loop：自调节系统，持续监测输出、调整流程
- 用 self-improving agents 把公司变成持续学习的闭环

### II.2 Queryable Organization（组织对 AI 可读）

- 所有重要动作必须产生 artifact 让中央智能层学习
- 所有会议用 AI notetaker 录下来，减少 DM 邮件
- 自建 dashboard：营收、销售、工程、招聘、运营——everything
- 给 agent 接入 Linear、Slack、Pylon、GitHub、Notion、销售电话录音、daily standup
- **核心原则：要让模型发挥全部能力，必须给它和员工同等量级的上下文**

### II.3 AI Software Factories

- 人类写 spec 和定义"成功"的测试集
- Agent 生成实现代码，迭代直到测试通过
- 极端形态：仓库里没有手写代码，只有 spec 和测试
- 例：Strong Compute 让 agents 反复迭代直到达到概率性满意阈值

### II.4 取消中层管理 / 三种员工原型（Jack Dorsey @ Block）

intelligence layer 替代了中层信息中转——"几乎不应该有人类中间件"。
未来公司只剩三种角色：

| 角色 | 定义 | 关键特征 |
|---|---|---|
| **IC（Builder/Operator）** | 直接动手做和运营 | 不限于工程师——开会带原型，不带 PPT |
| **DRI** | 负责战略和客户结果 | 一人一结果，无处可藏 |
| **AI Founder** | 仍然亲自 build、亲自示范 | 创始人必须站在最前面演示能力跃迁，**不能把 AI 战略外包** |

### II.5 Token-maxing 替代 Headcount

- 一个用 AI 工具的人 = 旧时代一整个工程团队
- 工程、设计、HR、Admin 都该大幅瘦身
- **应该愿意承受"高得不舒服"的 API 账单**——它替代的是远更贵、远更臃肿的人头成本

### II.6 段尾过渡（一句话）

> 这五条放在 50 人的公司里，每条都能在数月内重新设计完成。**那么放到 5.7 million 人的国家身上呢？**

---

## 第 III 节｜AI-native 国家是什么样（~4000 字，最长、最数据密）

### III.1 顶层叙事：从部门议题到战略主线（~500 字）

#### 信号 1：政治叙事的级别提升
- 黄循财在 Budget 2026 闭幕致辞中**第一次**将 AI 升级为整份预算案的战略主线 〔Hansard budget-2937〕
- 黄循财把整份预算案定位为新加坡应对世界 "more contested, more fragmented and ultimately, more dangerous" 的国家行动计划——**AI 是关键战略筹码**

#### 信号 2：组织级别提升
- PM Wong 亲任 National AI Council（NAC）主席——不放给 MDDI 单独推动
- 跨 11 部委协同 COS 辩论 AI（MDDI / MTI / MOH×3 / MOE / MOM / MOT / MND / MSE×3 / MSF×2 / MCCY）

#### 信号 3：财政级别提升
- RIE2030 拨款 **S$37B**（2025-12 公布、2026-04 生效）
- 公共 AI 研究投资 **S$1B+**（2026–2030）
- EIS 400% 税务扣除扩展至 AI（YA 2027–28，S$50K/企业/年上限）

> 这三个信号叠加 = 国家级 AI Founder 模型成立。Josephine Teo 一人统筹 MDDI、IMDA、国际 AI 治理三条线（57 篇官方致辞她占 23 篇）。

---

### III.2 六个抓手（~2500 字，国家级 AI-native 的完整图谱）

按"AI 引入路径"分类——这比按部门分类更能让读者一眼看出**国家级 AI-native 的整体形状**。每个抓手都跨多个部委，每条都有金额 + URL。

#### 抓手 1｜基建（数据 + 算力 + 物理基础设施）

国家直接做的事：把企业自己买不起的算力 + 数据底座建好。

**算力侧（外资引进）**：
- EDB 引进 Microsoft **S$5.5B**（数据中心）
- AWS **S$12B**
- Google **US$9B / S$11.6B + DeepMind Lab**
- NVIDIA SIT Centre for AI + Singtel + AI Accelerator
- OpenAI 新加坡 APAC 区域总部
- Anthropic 招聘 Singapore Country Lead（2026）

**算力侧（本土补贴）**：
- Enterprise Compute Initiative（ECI）**S$150M**——给企业买算力的直接补贴
- one-north AI Park / Kampong AI 物理基建（MOF）

**资金平台**：
- Anchor Fund @ 65 第二批 S$1.5B（IPO 锚定基金）
- FSDF（Future Sectors Development Fund）S$1.5B
- EQDP（扩张）S$6.5B

**数据底座**：
- MOH/Synapxe **HEALIX** = 国家医疗数据 + AI 基础设施
- URA **Virtual Singapore** = 国家级数字孪生 + ePlanner 3D + Smart Planning Assistant
- BCA **BETC Grant S$100M** = 建造业数字基建
- JTC **Punggol Digital District + Open Digital Platform (ODP)** = 全区智能区

**安全侧算力**：
- HTX **NGINE — NVIDIA B200 DGX SuperPOD**（家国安全自有算力）

#### 抓手 2｜治理（规则 + 沙盒 + 法律）

国家直接做的事：让企业**敢部署**——不部署 AI 的最大原因是合规风险。

**通用治理框架（IMDA）**：
- **Model AI Governance Framework**（2019）
- **AI Verify**（2022）+ **AI Verify Sandbox**（10+ 跨国大企业参与）
- **GenAI Eval Sandbox + GenAI Sandbox 2.0**
- **Generative AI 治理框架**（2024）
- **Agentic AI Governance Framework**（2026-01-22 达沃斯，**全球首发**）
- **Trusted Data Sharing Framework + DPTM 升级 SS 714:2025**

**金融业治理 5 层堆栈（MAS）**：
- FEAT Principles（公平 / 伦理 / 问责 / 透明）
- Veritas Initiative v1 / v2 / v3
- Project MindForge（24 家机构 + Microsoft / AWS / Google / Nvidia 全列其中）
- AI Risk Management Guidelines
- BuildFin.ai（继任平台）

**网络安全治理（CSA）**：
- Securing AI Systems Guidelines + Companion Guide
- Securing Agentic AI 增补稿
- Frontier AI Risk Advisory
- Cyber Trust Mark — AI 安全维度

**法律治理（MINLAW + IPOS）**：
- **Copyright Act §244** = AI 训练免责（与日本并列**全球最宽松**）
- IPOS "When Code Creates" 报告 = AI Authorship 立场
- 输出端严管：OCHA + Elections (Integrity of Online Advertising) (Amendment) Bill（深伪禁令）+ Criminal Law (Misc Amendments) Bill 2025（AI 私密图像入刑）+ Online Safety (Relief and Accountability) Bill 2025

> **治理哲学**：训练宽松 + 输出严管。这给企业一个明确的可预测边界——日本 + 新加坡是世界上目前唯二做到这一点的国家。

#### 抓手 3｜人才（教育 + 培训 + 转型）

国家直接做的事：让企业**找得到能用 AI 的人**。

**全民层（MDDI）**：
- AI Bilingual **100K 工人计划**（首批 accountancy + legal，1H 2026 上线，合作 ISCA / SAL / SCCA）
- National AI Literacy Programme

**专业层（IMDA + AISG）**：
- TechSkills Accelerator (TeSA) AI 扩展版
- AISG **AI Apprenticeship Programme (AIAP)** 16 批 410+ 学徒、900+ 申请、800 新名额
- AISG **100E Programme**（每项 S$150K 共投）

**教育系统层（MOE + NIE）**：
- SLS（Student Learning Space）AI 工具栈 8 类
- GenAI 使用指引 + AI Ethics Framework
- EdTech Masterplan 2030
- NIE AI@NIE + Certificate in AI for Education
- Microsoft Elevate × Singapore（高教 AI 普及）
- NUS / NTU / SMU / SUTD AI 课改

**财政补贴层（SSG + WSG）**：
- SkillsFuture AI 课程**50%/70% 分层补贴**
- Mid-Career S$4,000 Credit
- SkillsFuture Level-Up Programme
- WSG × SSG 合并 = 一站式技能与就业平台

**中年再训练层（MOM）**：
- Job Redesign+ + Career Conversion Programme (CCP) 中年再训练
- Enterprise Workforce Transformation Package (EWTP)
- NTUC × AI 工人保护

#### 抓手 4｜应用（产业 + 公共服务落地）

国家直接做的事：在 11 个部委里**同时**铺开旗舰应用。

**产业旗舰（MTI）**：
- National AI Missions（4 大先锋行业）
- AI Centres of Excellence
- Embodied AI（具身智能 R&D）
- Industry Transformation Maps (ITM) 中的 AI 升级

**研究旗舰（A*STAR）**：
- A*STAR CFAR（5 大研究支柱）
- AI Manufacturing 2030（Mencast 螺旋桨案例）
- AI 材料筛选 50–100x 加速
- GIS + SingHealth 健康 AI 合作
- National Multimodal LLM Programme S$70M

**区域 LLM 旗舰（AISG）**：
- SEA-LION v3 / v4 / Guard
- SEALD（数据集）

**企业普及（IMDA + ESG）**：
- **NAIIP — National AI Impact Programme**：10K 企业 + 100K 工人 / 2026–2029
- Champions of AI（旗舰企业计划）
- ESG PSG AI 补贴比例 30% → 50%
- ESG SMEs Go Digital AI 模块

**医疗（MOH + Synapxe）**：
- **Note Buddy** — GenAI 临床记录助手（5,000+ 医护、67K 病历，截至 2025-12）
- HealthHub AI（公众端，4.5/5 评分）
- AimSG（国家医疗影像 AI 平台）
- SELENA+（糖尿病视网膜病变筛查）
- ACE-AI（慢病风险预测，2027 年初推广全部 1,100 家 Healthier SG 诊所）
- APOLLO（国家级 CT 冠脉 AI）
- Healthier SG × 数字孪生（慢性肾病管理）

**交通（MOT + LTA + PSA + CAG）**：
- **Punggol AV** 公共穿梭车（首批商业化 AV，3 条线路 2025-12 上线）
- CETRAN AV 国家测试中心
- **PSA Tuas Mega Port** = 2040s 全球最大全自动港
- **Changi 全球首张 ISO/IEC 42001 AI 治理认证**

**建造与城市（MND + HDB + BCA + URA + JTC）**：
- Built Environment AI Centre of Excellence（**BE AI CoE S$30M**）
- BCA Integrated Digital Delivery (IDD)
- SPRINT 程序（建造业 AI 政府采购绿色通道）
- **HDB Tengah** = 首座智能能源镇 4.2 万户
- HDB AskJudy + MSO OneService

**环境与水务（MSE + NEA + PUB）**：
- NEA Weather Science Research Programme **S$25M**
- 登革热 AI 预测 + 蚊媒控制
- PUB Smart Water Meter Programme + Joint Operations Centre + Bentley 漏水检测

#### 抓手 5｜政府自用（Procurement / 自身率先）

国家直接做的事：让公务员率先用 AI——给企业看先例。

**民事政府（GovTech）**：
- **Pair**（公务员 AI 助手，**150K 公务员目标**）
- **Pair Search**（Hansard + 法院 + 立法可查）
- LaunchPad（3K MAU / 400 ideas）
- AI Trailblazers 1.0 + 2.0
- Litmus + Sentinel（AI 安全双件套）
- **Agentspace = 亚洲首例 air-gapped agentic AI**

**国防（MINDEF + DSTA + DSO + DIS）**：
- **DIS — SAF Digital and Intelligence Service**（2022 第四军种成立、2025 重组 DCCOM + SAFC4DC）= 把 AI **写进军种结构本身**
- DIS × AI Singapore MoU + DIS Sentinel Programme
- DSTA × Shield AI（自主无人机）+ Thales AI Co-Lab + Anduril Lattice + RSN 计算机视觉舰船分类
- DSTA 自研 GenAI 工具 + DSTA × MIT CSAIL
- DSO × Mistral AI 国防 GenAI
- DSO × Alan Turing Institute MoU

**家国安全（HTX + SPF + ICA）**：
- HTX **Phoenix LLM**（自训）
- HTX **H2RC 人形机器人中心 S$100M**（2026 Q2 启动）
- HTX × Google Cloud / Microsoft / Mistral AI / Firmus / Singtel / ST Engineering
- SPF Anti-Scam Centre / Anti-Scam Command — RPA + AI
- SPF PolCam + GIBSON 机场机器人 + Smart Glasses 实时视频分析
- ICA Multi-Modal Biometrics System (MMBS)（虹膜 + 人脸）

#### 抓手 6｜外交（国际治理 + 外资 + 标准制定）

国家直接做的事：让外资把 AI 治理总部放新加坡——**这是 5.7 million 人口能撬动 G7 级话语权的唯一方式**。

**新加坡发起的全球性框架**：
- **Singapore AI Safety Institute (AISI)** — **S$10M/yr**
- **Singapore Conference on AI (SCAI) / International Scientific Exchange (ISE) on AI Safety I + II**
- **Singapore Consensus on Global AI Safety Research Priorities**（**11 国签署，含中美**）
- IMDA × Humane Intelligence 多元红队挑战

**ASEAN 区域**：
- ASEAN Working Group on AI Governance (WG-AI)
- **ASEAN Guide on AI Governance and Ethics**（**10 国采纳**）
- ASEAN Hanoi Declaration 2026（数字部长会议）

**双边合作**：
- US-Singapore Smart Cities Programme + Digital Economic Cooperation Roadmap
- ROK 双边 AI 合作
- EU-ASEAN AI 治理对话

**军事 / 安全**：
- **REAIM Asia Regional Consultations**（新加坡共同主持）
- **REAIM Seoul Summit 2024**（**新加坡作为联合主办**）
- Bletchley Park / Seoul / Paris AI Safety Summits 全部参与

**联合国 + 全球**：
- UN Global Dialogue on AI Governance + Independent International Scientific Panel
- AI Singapore × UNDP 全球 AI 素养

> 用 0.07% 的全球人口拿到 G7 级 AI 治理话语权。这是新加坡战略最不可复制的部分。

---

### III.3 风险管理三层（~500 字）

国家级 AI-native 必须**同时**做风险管理——这是公司尺度上简单很多的事，国家级别变得复杂。

#### 经济风险层 — PMET 中产政治压力（最大变量）

- > "AI is a gamechanger. It can augment workers or displace them, depending on how work and jobs are redesigned." — Tan See Leng, MOM COS 2026-03-03
- 第一次让 PMET 中产产生不安全感——Smart Nation 时代不存在的政治变量
- MOM 反复强调 "mid-career PMEs face highest risk" + "job redesign for human-with-AI" = 直接安抚核心选民
- 风险：**可能催生限制 AI 替代人力的法规——会反噬整个战略**

#### 社会风险层 — 弱势群体保护（MSF + MCCY）

- AI 深伪性剥削威胁儿童和弱势群体（Rachel Ong, MSF COS 2026-03-05）
- AI 自动化取代残障人士传统岗位（Neo Kok Beng）
- Online Safety Commission（OSC）第一阶段覆盖儿童图像滥用
- ECDA Inclusive Support Programme (InSP)
- 马来 / 穆斯林社群 AI 经济准备度（MCCY COS 2026-03-05）

#### 安全风险层 — 关键基建 + 国家安全

- CSA Securing AI Systems Guidelines + Frontier AI Risk Advisory
- DIS / DSO / SPF / HTX 内部 AI 部署完全不公开——**这是国家级 AI-native 必须接受的"治理盲区"**
- AI Chatbots 用于青少年心理咨询的不监管立场（oral-answer-4051）

---

### III.4 透明度悖论（~500 字，研究中发现的隐风险，独立成段）

研究中浮现的现象——值得在论文里点出，因为它是新加坡战略的潜在裂缝：

- 新加坡战略**以"执行优势"立身**——但执行细节又**不可审计**
- 我们的研究发现：很多 Budget 2026 AI 项目**没有官方单一总盘数字**（拼装数据来自多份新闻稿）：
  - Champions of AI 具体金额未公开
  - Anthropic 与 EDB MOU 详情未公开
  - Kampong AI 投资额未单列
  - NAIIP 单笔企业拨款金额（官方"1H 2026 公布"）
  - RIE2030 内部 AI 子项分配未单列
- DIS 实际编制、DSO AI 武器化研究、SPF PolCam 视频分析技术栈完全不公开
- AISI 资金来源细节、HTX H2RC S$100M 是否含运营都模糊

> **当一个国家把"作为全球 AI 治理中心"作为战略时，它必须承担比公司更高的可审计性标准**。新加坡目前是反方向走的——这是这个战略最大的**长期信誉风险**。

---

## 第 IV 节｜核心论点：国家是企业的"包装层" + 7 条传导杠杆（~800 字）

### IV.1 一句话论点

> 把第 III 节的六个抓手重新排列——按"它们解决企业的什么瓶颈"分类——你会看到一个被忽视的事实：**新加坡战略的本质是把整个国家当成企业 AI-native 转型的包装层。**
>
> 国家不可能"自己"AI-native——政府部门只占 GDP 一小部分。一个国家被称为 AI-native，意味着它的企业群体是 AI-native 的。

### IV.2 七条传导杠杆（核心数据表，把六抓手重新切片）

| # | 杠杆 | 解决企业的什么瓶颈 | 对应抓手 |
|---|---|---|---|
| 1 | **Pull（资本回报）** | 企业 AI 转型 ROI 拉不正 | 抓手 1（ECI、PSG）+ 抓手 2（Sandbox 让风险可测量） |
| 2 | **Push（前进压力）** | 企业不愿动 | 抓手 4（NAIIP 10K + Champions of AI） |
| 3 | **Talent（人才池）** | 企业找不到能用 AI 的人 | 抓手 3（AI Bilingual 100K + AIAP + 大学课改） |
| 4 | **Infra（算力底座）** | 企业自己买不起算力 | 抓手 1（EDB 大厂引进 + ECI + one-north） |
| 5 | **Trust（敢落地的边界）** | 企业不敢部署因为合规风险 | 抓手 2（IMDA + MAS + CSA + MINLAW） |
| 6 | **Procurement（自身率先）** | 企业看不到先例 | 抓手 5（GovTech + DIS + HTX） |
| 7 | **International（外资 + 治理总部）** | 企业不知道总部该放哪 | 抓手 6（AISI + Singapore Consensus + ASEAN） |

### IV.3 关键观察（文章最锋利的一句）

> **这 7 条里只有第 6（政府自用）和第 7（国际外交）是国家直接做的。其他 5 条都是国家穿透到企业。**

### IV.4 这条论点为什么独特

- 多数 AI 国家战略文章把"国家"和"企业"并列分析——错过了**嵌套关系**
- 新加坡战略的精妙：**整个国家是企业的包装层**，国家自己不必成为 AI-native，只要把企业转型速度放大就够了
- 这解释了为什么新加坡能在没算力 / 没数据 / 没模型的情况下仍可能领先——它在赌**执行架构**而非**生产要素**

### IV.5 双方原话的同构（最强证据）

- > "Not all of us can be AI engineers. But we can be 'bilingual' in AI in our own areas of expertise." — Josephine Teo, MDDI COS 2026-03-02
- > "If healthcare is truly a national AI mission, the goal cannot be incremental adoption." — Mariam Jaafar, MOH COS 2026-03-04
- > "It should not be a tool your company just uses. It should be the operating system your company runs on." — YC Diana

**国家版的话和公司版的话是同构的**——这是文章最强的"两极同构"证据。

---

## 第 V 节｜收尾 + 开放问题 + KPI（~400 字）

### 三个开放问题

1. **Cursor 等工具让一个工程师抵 1000 人时，国家级的"穿透到企业"杠杆还来得及吗？还是企业自己就跑过国家了？**
2. **新加坡"包装层"赌注是否成立——一个不能自身 AI-native、但能成为"全球 AI-native 企业最佳孵化地"的定位，是否足够？**
3. **速度不对称如何收敛？AI 减速、国家加速、还是社会接受持续错位——新加坡押的是哪一条？**

### 三个值得跟踪的具体 KPI

- **NAIIP 兑现率**：到 2029 年，10K 企业 + 100K 工人完成度
- **Note Buddy 类项目扩散速度**：从 5,000 医护扩到全国所有医生需要多久（国家级 AI-native"穿透到一线"的最佳测量点）
- **Singapore Consensus 影响力扩张**：能否从 11 国扩到 G20？AISI 能否成为 AI 领域的 IAEA？

### 一句话收尾

> AI-native 不是规模，是架构。同一种架构，两个尺度同时实验。新加坡不是在赌算力、不是在赌模型——它是在赌**国家作为企业包装层**这个组织架构创新。如果赌赢，它拿到的是未来 20 年最稀缺的资产：**全球 AI 治理与孵化的实际坐标**。

---

## v3 vs v2 关键差异

| 维度 | v2 | v3 |
|---|---|---|
| 主结构 | "五要素 × 两尺度"对照表（强行平行排列） | 公司一节 + 国家一节，各自独立展开 |
| 国家级数据组织方式 | 散在五要素 II.1–II.5 中 | **III.2 六抓手分类**（基建 / 治理 / 人才 / 应用 / 政府自用 / 外交） |
| 风险章节 | 独立成节，混合公司 + 国家 | 移入 III.3，专讲国家级三层风险（经济 / 社会 / 安全） |
| 透明度悖论 | 散在风险节 | **III.4 独立成段**（论文中最有原创性的"研究发现"） |
| 公司部分 | 在每个对照子节里被反复打断 | **第 II 节专写**，YC 五要素 + Jack Dorsey 中层取消组织设计 |

---

## 留白请你做决定的 3 个判断

1. **标题选哪个**：1 / 2 / 3？
2. **III.4 透明度悖论独立成段**（专门点出新加坡战略的潜在裂缝，更刀锋）还是合并到 III.3 风险章节里（更温和）？
3. **目标平台**：aisg（保持冷静观察的姿态，III.4 较温和）还是 wlj.me（更个人化，III.4 可以更尖锐）？

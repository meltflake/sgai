---
publishDate: 2026-04-25
updateDate: 2026-05-03
title: '从 50 人到 5,700,000 人——同一种 AI-native 架构，两个尺度'
excerpt: '2026 年同时在跑两类 AI-native 试验——50 人的公司和 570 万人的城邦。把它们并排放，会看到一个被忽视的事实：50 人的公司和 570 万人的国家，可以用同一种 AI-native 架构，规模只决定杠杆，不决定本质。新加坡 Budget 2026 的真正赌注，是把整个国家当成本土企业 AI-native 转型的包装层。'
category: '观点'
tags:
  - AI-native
  - 战略
  - 观点
  - 新加坡
  - Budget 2026
  - YC
author: '新加坡 AI 观察'
relatedPolicyIds:
  - budget-2026-national-ai-acceleration
  - public-ai-research-investment-2026-2030
  - national-ai-strategy-20-nais-20
relatedLeverNumbers:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
relatedTimelineYears:
  - 2026
relatedPersonIds:
  - lawrence-wong
  - josephine-teo
---

> 本文把生而 AI-native 的公司和新加坡作为 AI-native 国家这两类试验放在一起对照。前者是 YC 在 2026 年那期 _How To Build A Company With AI From The Ground Up_ 里描述的 50–500 人样本；后者是 Budget 2026 描述的 570 万人样本。两者用同一种架构、完全不同的杠杆。

---

## 一、同一种架构，两个尺度

2026 年同时有两类 AI-native 试验在跑。

一类是 50–500 人的公司——Anthropic、Cursor、Lovable——从第一天起把 AI 放在工作流核心。YC 合伙人 Diana Hu 这样定义这套方法论：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> AI 不应该只是公司在用的工具，它应该是公司运行的操作系统。

另一类是 **570 万人的城邦**。新加坡 Budget 2026 把 AI 列为整份预算案的战略核心，黄循财亲挂帅 National AI Council，跨 11 个部委的 Committee of Supply 全部围绕 AI——这是迄今为止**唯一一个明确把 AI-native 国家作为战略目标**的主权国家。

把这两个并排放，会看到一个被忽视的事实：**50 人的公司和 570 万人的国家，可以用同一种 AI-native 架构。规模只决定杠杆，不决定本质。**

### 三个数据信号——为什么 Budget 2026 是真实的

- 黄循财在 Budget 2026 闭幕致辞中**第一次**将 AI 升级为整份预算案的战略主线
- RIE2030 拨款 **S$37B**（2025-12 公布、2026-04 生效）
- EDB 已落地外资数据中心 **>S$30B**（Microsoft S$5.5B、AWS S$12B、Google US$9B）
- 跨 11 个部委 COS 协同辩论 AI（MDDI / MTI / MOH×3 / MOE / MOM / MOT / MND / MSE×3 / MSF×2 / MCCY）

### 操作性定义

什么叫一个组织 AI-native？三条判定标准：

1. **AI 在决策关键路径上**：核心判断默认 AI 先出，人类做例外审批
2. **工作流以 AI 为默认假设**：流程、数据、产物按 AI 是主要消费者来设计
3. **激励对齐 AI 增强**：晋升、招聘、培训不奖励绕开 AI 的人肉英雄

这三条标准在 50 人的公司里数月内能重做完，但在 570 万人的国家身上要穿透公务员系统、私营部门、全民教育——**5–10 年是乐观估计**。

公司用一种方式做这三条；国家必须用完全不同的方式做同样三条。新加坡的赌注不是算力 / 数据 / 模型——这三个生产要素它都不占优。它赌的是执行架构：**政府自己做 AI-native 改造，同时用国家级杠杆把本土企业的 AI-native 转型一起带起来——两件事都得做**。这是这篇文章要论证的核心。

---

## 二、AI-native 公司是什么样

YC 在 2026 年那期 _How To Build A Company With AI From The Ground Up_ 里把方法论梳理得很清楚。这一节借用 Diana Hu 的五个支柱，再补 Jack Dorsey 在 Block 的取消中层组织设计——构成一个完整、可操作的 50 人公司怎么变 AI-native 清单。

### 1. 闭环系统（Closed Loop）

这是最承重的一条。Diana 用的是控制论的概念：

- **开环（open loop）**：做决定 → 执行 → 不系统测量 → 不调整。本质是有损的
- **闭环（closed loop）**：自调节系统，持续监测输出、调整流程，越跑越准

旧世界的公司基本都是开环：拍板、执行、不一定系统测量结果、流程不会自我调整。AI-native 公司的第一性原则是把每个重要流程都变成闭环——产物进 AI、AI 看完整上下文、自动调整下一步。

### 2. 组织对 AI 可读（Queryable Organization）

要让闭环跑起来，组织必须**对 AI 可查询**。具体做法：

- 所有会议用 AI notetaker 录下来
- 减少私信和邮件，让 agents 嵌入所有沟通渠道
- 自建仪表盘把所有数据接入：营收、销售、工程、招聘、运营——全部
- 给 agent 接入 Linear、Slack、Pylon、GitHub、Notion、销售电话录音、每日站会

核心原则：**要让模型发挥全部能力，必须给它和员工同等量级的上下文**。

### 3. AI 软件工厂（AI Software Factories）

软件开发模式重写：

- **人类**：写 spec、写定义成功的测试集
- **Agent**：生成实现代码，反复迭代直到测试通过
- **人类**：判断输出是否合格

极端形态：仓库里**没有手写代码，只有 spec 和测试**。Strong Compute 是这种做法——让 agents 反复迭代直到达到概率性满意阈值，目标是消除人类写代码或审代码这一步。

### 4. 取消中层管理 / 三种员工原型

旧世界需要中层管理者在组织里上下传递信息。AI-native 公司里，智能层（intelligence layer）替代了这个功能——几乎不应该有人类中间件。

Jack Dorsey 在 Block 的话：

> "If you keep the same org chart and management structure, you've missed the shift entirely. The company itself has to be rebuilt as an intelligence layer with humans at the edge guiding it rather than routing information through it."
>
> 如果你保留旧组织架构和管理结构，你完全错过了这次变革。公司本身必须被重建成一个智能层，人类站在边缘引导它，而不是当中转节点。

未来公司只剩三种角色：

| 角色                       | 定义                     | 关键特征                                             |
| -------------------------- | ------------------------ | ---------------------------------------------------- |
| **IC（Builder/Operator）** | 直接动手做和运营         | 不限于工程师——开会带原型，不带 PPT                   |
| **DRI**                    | 负责战略和客户结果       | 一人一结果，无处可藏                                 |
| **AI Founder**             | 仍然亲自 build、亲自示范 | 创始人必须站在最前面演示能力跃迁，不能把 AI 战略外包 |

### 5. 用 token 替代人头

资源观重写：

- 一个用 AI 工具的人 = 旧时代一整个工程团队
- 工程、设计、HR、行政都该大幅瘦身
- **应该愿意承受高得不舒服的 API 账单**——它替代的是远更贵、远更臃肿的人头成本
- 最好的公司会把 token 用满

---

这五条放在 50 人的公司里，每条都能在数月内重新设计完成。

**那么放到 570 万人的国家身上呢？**

---

## 三、AI-native 国家是什么样

新加坡 Budget 2026 给出了目前唯一一个完整答案。这一节先看顶层叙事，再用六个抓手把所有部委的具体落地分类展开，最后看三层风险管理 + 一个透明度悖论。

### 3.1 顶层叙事：从部门议题到战略主线

#### 信号 1 — 政治叙事的级别提升

黄循财在 2026 年 3 月 6 日的 Budget 闭幕致辞中**第一次**把 AI 升级为整份预算案的战略主线，并把整份预算案定位为新加坡应对世界 _"more contested, more fragmented and ultimately, more dangerous"_ 的国家行动计划——AI 是关键战略筹码。

#### 信号 2 — 组织级别提升

黄循财亲任 National AI Council 主席，不放给 MDDI 单独推动。这是新加坡识别国家级议题的标志性动作：**关键议题不交给某个部委，直接放到总理办公室**。

跨 11 部委同时围绕 AI 议题展开 Committee of Supply 辩论，是新加坡 COS 历史上 AI 议题最集中的一次。

#### 信号 3 — 财政级别提升

- RIE2030 拨款 **S$37B**（2025-12 公布、2026-04 生效）
- 公共 AI 研究投资 **S$1B+**（2026–2030）
- EIS 400% 税务扣除扩展至 AI（YA 2027–28，S$50K/企业/年上限）

这三个信号叠加 = **国家级 AI Founder 模型成立**。Josephine Teo 一人统筹 MDDI、IMDA、国际 AI 治理三条线——可以找到的 57 篇官方部长致辞里她占 23 篇。

### 3.2 六个抓手——国家级 AI-native 的完整图谱

把 Budget 2026 + 各部委 + 各法定机构的所有 AI 相关政策和落地项目，按 AI 引入路径分成六个抓手：**基建、治理、人才、应用、政府自用、外交**。

这比按部门分类（MDDI / IMDA / MAS / MOH / ...）更能让读者一眼看出整体形状。每个抓手都跨多个部委，串起来才是完整的执行管线。

#### 抓手 1 — 基建（数据 + 算力 + 物理基础设施）

**国家直接做的事**：把企业自己买不起的算力 + 数据底座建好。

外资引进的算力（EDB）：

- Microsoft 数据中心 **S$5.5B**
- AWS **S$12B**
- Google **US$9B / S$11.6B + DeepMind Lab**
- NVIDIA × SIT Centre for AI、× Singtel、× AI Accelerator
- OpenAI 新加坡 APAC 区域总部
- Anthropic 招聘新加坡 Country Lead（2026）

本土补贴的算力：

- Enterprise Compute Initiative (ECI) **S$150M**——给企业买算力的直接补贴
- one-north AI Park / Kampong AI（MOF）

资金平台：

- Anchor Fund @ 65 第二批 **S$1.5B**
- Future Sectors Development Fund **S$1.5B**
- EQDP 扩张至 **S$6.5B**

国家级数据底座：

- MOH/Synapxe **HEALIX** = 国家医疗数据 + AI 基础设施
- URA **Virtual Singapore** = 国家级数字孪生
- BCA **BETC Grant S$100M** = 建造业数字基建
- JTC **Punggol Digital District + Open Digital Platform (ODP)** = 全区智能区

家国安全侧算力：

- HTX **NGINE** — NVIDIA B200 DGX SuperPOD（家国安全自有算力）

#### 抓手 2 — 治理（规则 + 沙盒 + 法律）

**国家直接做的事**：让企业敢部署。企业不部署 AI 的最大障碍是合规风险——技术早就够用。

通用治理框架（IMDA）：

- Model AI Governance Framework（2019）
- AI Verify（2022）+ **AI Verify Sandbox**（10+ 跨国大企业参与）
- GenAI Eval Sandbox + GenAI Sandbox 2.0
- Generative AI 治理框架（2024）
- **Agentic AI Governance Framework**（2026-01-22 达沃斯，**全球首发**）
- Trusted Data Sharing Framework + DPTM 升级 SS 714:2025

金融业治理 5 层堆栈（MAS）：

- FEAT Principles（公平 / 伦理 / 问责 / 透明）
- Veritas Initiative v1 / v2 / v3
- Project MindForge（24 家机构 + Microsoft / AWS / Google / Nvidia 全列其中）
- AI Risk Management Guidelines
- BuildFin.ai

网络安全治理（CSA）：

- Securing AI Systems Guidelines + Companion Guide
- Securing Agentic AI 增补稿
- Frontier AI Risk Advisory
- Cyber Trust Mark — AI 安全维度

法律治理（MINLAW + IPOS）：

- **Copyright Act §244** = AI 训练免责（**与日本并列全球最宽松**）
- IPOS "When Code Creates" 报告 — AI Authorship 立场
- **输出端严管**：OCHA + Elections Bill 2024（深伪禁令）+ Criminal Law Bill 2025（AI 私密图像入刑）+ Online Safety (Relief and Accountability) Bill 2025

> **治理哲学**：训练宽松 + 输出严管。日本和新加坡是世界上目前唯二做到这一点的国家——这给企业一个明确的可预测边界。

#### 抓手 3 — 人才（教育 + 培训 + 转型）

**国家直接做的事**：让企业找得到能用 AI 的人。

全民层（MDDI）：

- AI Bilingual **100K 工人计划**（首批 accountancy + legal，1H 2026 上线，合作 ISCA / SAL / SCCA）
- National AI Literacy Programme

专业层（IMDA + AISG）：

- TechSkills Accelerator (TeSA) AI 扩展版
- AISG **AI Apprenticeship Programme (AIAP)**：16 批 410+ 学徒，900+ 申请，新一批 800 名额
- AISG **100E Programme**（每项 S$150K 共投）

教育系统层（MOE + NIE）：

- SLS（Student Learning Space）AI 工具栈 8 类
- GenAI 使用指引 + AI Ethics Framework
- EdTech Masterplan 2030
- NIE AI@NIE + Certificate in AI for Education
- Microsoft Elevate × Singapore（高教 AI 普及）
- NUS / NTU / SMU / SUTD 全面 AI 课改

财政补贴层（SSG + WSG）：

- SkillsFuture AI 课程 **50% / 70% 分层补贴**
- Mid-Career S$4,000 Credit
- SkillsFuture Level-Up Programme
- WSG × SSG 合并 = 一站式技能与就业平台

中年再训练层（MOM）：

- Job Redesign+
- Career Conversion Programme (CCP)
- Enterprise Workforce Transformation Package (EWTP)
- NTUC × AI 工人保护

> "Not all of us can be AI engineers. But we can be 'bilingual' in AI in our own areas of expertise."
>
> 不是所有人都能当 AI 工程师。但我们可以在自己擅长的领域成为 AI 双语者。
>
> — Josephine Teo, MDDI Committee of Supply, 2026-03-02

#### 抓手 4 — 应用（产业 + 公共服务落地）

**国家直接做的事**：在 11 个部委里同时铺开旗舰应用。

产业旗舰（MTI）：

- National AI Missions（4 大先锋行业）
- AI Centres of Excellence
- Embodied AI 具身智能 R&D
- Industry Transformation Maps (ITM) 中的 AI 升级

研究旗舰（A\*STAR）：

- A\*STAR CFAR 5 大研究支柱
- AI Manufacturing 2030（Mencast 螺旋桨）
- AI 材料筛选 50–100x 加速
- GIS + SingHealth 健康 AI 合作
- National Multimodal LLM Programme **S$70M**

区域 LLM 旗舰（AISG）：

- SEA-LION v3 / v4 / Guard
- SEALD（数据集）

企业普及（IMDA + ESG）：

- **NAIIP — National AI Impact Programme**：10K 企业 + 100K 工人 / 2026–2029
- Champions of AI（旗舰企业计划）
- ESG PSG AI 补贴比例 **30% → 50%**
- ESG SMEs Go Digital AI 模块

医疗（MOH + Synapxe）：

- **Note Buddy** — GenAI 临床记录助手（**5,000+ 医护、67K 病历，截至 2025-12**）
- HealthHub AI（公众端，4.5/5 评分）
- AimSG（国家医疗影像 AI）
- SELENA+（糖尿病视网膜病变筛查）
- **ACE-AI**（慢病风险预测，2027 年初推广至全部约 1,100 家 Healthier SG 诊所）
- APOLLO（国家级 CT 冠脉 AI）
- Healthier SG × 数字孪生（慢性肾病管理）

> "AI-enhanced, not AI-decided — clinicians remain in the loop."
>
> AI 增强、不是 AI 决定——临床医生永远在决策回路中。
>
> — Ong Ye Kung, MOH Committee of Supply, 2026-03-05

交通（MOT + LTA + PSA + CAG）：

- **Punggol AV** 公共穿梭车（首批商业化 AV，3 条线路 2025-12 上线）
- CETRAN AV 国家测试中心
- **PSA Tuas Mega Port** = 2040s 全球最大全自动港
- **Changi 全球首张 ISO/IEC 42001 AI 治理认证**

建造与城市（MND + HDB + BCA + URA + JTC）：

- Built Environment AI Centre of Excellence（**BE AI CoE S$30M**）
- BCA Integrated Digital Delivery (IDD)
- SPRINT 程序——建造业 AI 政府采购绿色通道
- **HDB Tengah** = 首座智能能源镇 4.2 万户
- HDB AskJudy + MSO OneService

环境与水务（MSE + NEA + PUB）：

- NEA Weather Science Research Programme **S$25M**
- 登革热 AI 预测 + 蚊媒控制
- PUB Smart Water Meter Programme + Joint Operations Centre + Bentley 漏水检测

#### 抓手 5 — 政府自用（Procurement / 自身率先）

**国家直接做的事**：让公务员率先用 AI，给企业看先例。

民事政府（GovTech）：

- **Pair**（公务员 AI 助手，**150K 公务员目标**）
- **Pair Search**（Hansard + 法院 + 立法可查）
- LaunchPad（3K MAU / 400 ideas）
- AI Trailblazers 1.0 + 2.0
- Litmus + Sentinel（AI 安全双件套）
- **Agentspace** = 亚洲首例 air-gapped agentic AI

国防（MINDEF + DSTA + DSO + DIS）：

- **DIS — SAF Digital and Intelligence Service**（**2022 第四军种成立**、2025 重组为 DCCOM + SAFC4DC）= 把 AI **写进军种结构本身**
- DIS × AI Singapore MoU + DIS Sentinel Programme
- DSTA × Shield AI（自主无人机）+ Thales AI Co-Lab + Anduril Lattice
- DSTA × RSN 计算机视觉舰船分类
- DSTA 自研 GenAI 工具 + DSTA × MIT CSAIL
- DSO × Mistral AI 国防 GenAI
- DSO × Alan Turing Institute MoU

家国安全（HTX + SPF + ICA）：

- HTX **Phoenix LLM**（自训）
- HTX **H2RC 人形机器人中心 S$100M**（2026 Q2 启动）
- HTX × Google Cloud / Microsoft / Mistral AI / Firmus / Singtel / ST Engineering
- SPF Anti-Scam Centre / Anti-Scam Command — RPA + AI
- SPF PolCam + GIBSON 机场机器人 + Smart Glasses 实时视频分析
- ICA Multi-Modal Biometrics System (MMBS) — 虹膜 + 人脸

#### 抓手 6 — 外交（国际治理 + 外资 + 标准制定）

**国家直接做的事**：让外资把 AI 治理总部放新加坡。

这是 570 万人口能撬动 G7 级话语权的唯一方式。

新加坡发起的全球性框架：

- **Singapore AI Safety Institute (AISI)** — **S$10M/yr**
- **Singapore Conference on AI / International Scientific Exchange on AI Safety I + II**
- **Singapore Consensus on Global AI Safety Research Priorities**（**11 国签署，含中美**）
- IMDA × Humane Intelligence 多元红队挑战

ASEAN 区域：

- ASEAN Working Group on AI Governance (WG-AI)
- **ASEAN Guide on AI Governance and Ethics**（**10 国采纳**）
- ASEAN Hanoi Declaration 2026（数字部长会议）

双边合作：

- US-Singapore Smart Cities Programme + Digital Economic Cooperation Roadmap
- ROK 双边 AI 合作
- EU-ASEAN AI 治理对话

军事 / 安全：

- REAIM Asia Regional Consultations（新加坡共同主持）
- **REAIM Seoul Summit 2024**（**新加坡作为联合主办**）
- Bletchley Park / Seoul / Paris AI Safety Summits 全部参与

联合国 + 全球：

- UN Global Dialogue on AI Governance + Independent International Scientific Panel
- AI Singapore × UNDP 全球 AI 素养

> 用 0.07% 的全球人口拿到 G7 级 AI 治理话语权——这是新加坡战略最不可复制的部分。

### 3.3 风险管理三层

国家级 AI-native 必须**同时**做风险管理——这是公司尺度上简单很多的事，到国家级别变得复杂。

#### 经济风险层 — PMET 中产政治压力（最大变量）

> "AI is a gamechanger. It can augment workers or displace them, depending on how work and jobs are redesigned."
>
> AI 是游戏规则改变者。它可以增强工人，也可以替代他们——取决于工作和岗位如何重新设计。
>
> — Tan See Leng, MOM Committee of Supply, 2026-03-03

陈诗龙这句话不是泛泛而谈，是对核心选民的直接安抚。MOM 反复强调 _mid-career PMEs face highest risk_ 和 _job redesign for human-with-AI_。

这是 Smart Nation 时代不存在的政治变量。Smart Nation 时代失业风险落在蓝领和基层文员；AI 时代第一刀砍向 PMET 中产——初级律师、初级会计师、初级分析师、初级工程师。**新加坡的政治稳定度，在很大程度上建立在 PMET 中产的安全感上**。

风险：可能催生限制 AI 替代人力的法规——会反噬整个战略。

#### 社会风险层 — 弱势群体保护

跨 MSF + MCCY 多场 COS 辩论提出的关切：

- AI 深伪性剥削威胁儿童和弱势群体（Rachel Ong, MSF COS 2026-03-05）
- AI 自动化取代残障人士传统岗位——包装、分拣、基础行政、编程（Neo Kok Beng）
- Online Safety Commission 第一阶段覆盖儿童图像滥用
- ECDA Inclusive Support Programme (InSP)
- 马来 / 穆斯林社群 AI 经济准备度（Saktiandi Supaat, MCCY COS）

#### 安全风险层 — 关键基建 + 国家安全

- CSA Securing AI Systems Guidelines + Frontier AI Risk Advisory
- DIS / DSO / SPF / HTX 内部 AI 部署完全不公开
- AI Chatbots 用于青少年心理咨询的不监管立场（许宝琨在 oral-answer-4051）：政府认为追踪不可行，转而推广合法替代（mindline 1771、mindline.sg、CHAT）+ 应用商店年龄验证

---

## 四、国家是企业的"包装层"——七条传导杠杆

把第三节的六个抓手重新排列——按它们解决企业的什么瓶颈分类——你会看到一个常被忽视的事实：

> **新加坡战略有两层：政府自己做 AI-native 改造，同时把整个国家组织成企业 AI-native 转型的"包装层"。**

只看政府自己的 AI-native 改造（ACE-AI、Pair、DIS、PSA Tuas）不够——政府部门只占 GDP 一小部分。一个国家要被称为 AI-native，它的企业群体也必须是 AI-native 的。Budget 2026 真正的赌注，是政府改造和企业放大**两件事同时做**：政府自己 AI-native 是底座，国家级杠杆放大企业转型速度是延伸。

### 七条传导杠杆——把六抓手重新切片

| #   | 杠杆                                 | 解决企业的什么瓶颈       | 对应抓手                                           |
| --- | ------------------------------------ | ------------------------ | -------------------------------------------------- |
| 1   | **Pull（资本回报）**                 | 企业 AI 转型 ROI 拉不正  | 抓手 1（ECI、PSG）+ 抓手 2（Sandbox 让风险可测量） |
| 2   | **Push（前进压力）**                 | 企业不愿动               | 抓手 4（NAIIP 10K + Champions of AI）              |
| 3   | **Talent（人才池）**                 | 企业找不到能用 AI 的人   | 抓手 3（AI Bilingual 100K + AIAP + 大学课改）      |
| 4   | **Infra（算力底座）**                | 企业自己买不起算力       | 抓手 1（EDB 大厂引进 + ECI + one-north）           |
| 5   | **Trust（部署边界）**                | 企业不敢部署因为合规风险 | 抓手 2（IMDA + MAS + CSA + MINLAW）                |
| 6   | **Procurement（自身率先）**          | 企业看不到先例           | 抓手 5（GovTech + DIS + HTX）                      |
| 7   | **International（外资 + 治理总部）** | 企业不知道总部该放哪     | 抓手 6（AISI + Singapore Consensus + ASEAN）       |

### 关键观察

**这 7 条里只有第 6（政府自用）和第 7（国际外交）是国家直接做的。其他 5 条都是国家穿透到企业**。

这条论点为什么独特：

- 多数 AI 国家战略文章把国家和企业并列分析，错过了**嵌套关系**
- 新加坡是**两条轨道同时跑**：政府自己做 AI-native 改造（ACE-AI、Pair、DIS、PSA Tuas），同时把整个国家组织成企业 AI-native 转型的包装层。两件事都得做，缺一不可——政府自己的 AI-native 是包装层能跑起来的执行底座，包装层是政府改造的对外延伸
- 这解释了为什么新加坡能在没算力 / 没数据 / 没模型的情况下仍可能领先——它赌的是**执行架构**：靠政府执行能力放大企业转型速度。生产要素它都不占优，所以只能赌执行

### 双方原话的同构

把 Diana Hu 和 Mariam Jaafar 的话放在一起，会看到一个意外的同构：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> — Diana Hu, YC, 2026

> "If healthcare is truly a national AI mission, the goal cannot be incremental adoption."
>
> 如果医疗真的是国家 AI 使命，目标就不能只是渐进式采用。
>
> — Mariam Jaafar, MOH COS 2026-03-04

公司版的话和国家版的话**说的是同一件事**——这是这篇文章最有力的两极同构证据。

---

## 五、观察执行状态

前面整理的是新加坡的执行架构——双轨同时跑：政府自己做 AI-native 改造，同时把国家组织成企业 AI-native 转型的放大器。剩下的问题就一个：**这套架构能不能执行下去？**

执行状态比宏大叙事更值得看。下面是几组长期跟踪的数字和事件——它们怎么走，决定了这个论点是被验证还是被推翻。

### 政府轨道：自己 AI-native 是否真的跑起来

- **Pair 渗透**：150K 公务员目标里，月活占比走到多少？现状是已上线，关键是渗透深度
- **ACE-AI 诊所覆盖**：2027 年初目标推广至全部约 1,100 家 Healthier SG 诊所——按时落地还是延期？
- **Note Buddy 扩散**：从 2025-12 的 5,000+ 医护、67K 病历，多久扩到全国医生？这是 GenAI 临床落地最早的样本，扩散速度反映医疗系统对 AI 的接纳节奏
- **DIS / HTX / DSO 安全侧 AI**：不公开本身是观察项——透明度是否有改善

### 企业轨道：杠杆是否真的拉得动企业

- **中小企业 AI 采用率**：从 4.2% 到 14.5% 是一年的拉升。下一两年是继续翻倍走到 30%+，还是停在 15% 附近？翻倍则杠杆有效，停滞说明早期红利吃完了
- **NAIIP 中段进度**：到 2027 中期，10K 企业 + 100K 工人推进到几成？
- **Champions of AI 扩张**：名单是否覆盖到中型企业，不只是大公司旗舰

### 双轨耦合：政府用法能不能传导到企业

- **公立 → 私立**：Note Buddy / SELENA+ / ACE-AI 这套打法被私立医院 / 私人诊所采用的时间差
- **Pair → 企业 AI 助手**：本土企业自建的 AI 助手是否参考 Pair 的框架（Litmus + Sentinel 安全双件套是否成行业默认）
- **国家数据底座对企业开放**：HEALIX 是否对私营医疗 AI 开放接口；Virtual Singapore 是否成为城市 AI 创业的基础平台

### 国际：抓手 6 撑不撑得住

- **Singapore Consensus 签署国**：从 11 国（含中美）扩到几国？能否进 G20？
- **Agentic AI Governance Framework**：2026-01 全球首发后被多少国家 / 跨国企业引用？
- **AI 公司 APAC 总部动向**：OpenAI、Anthropic、其他大厂是否扩编新加坡职位 vs 撤回。这是市场对新加坡 AI 治理信誉最直接的投票

### 就业冲击：最大的执行变量

第三节风险管理那里说过——AI 时代第一刀砍向 PMET 中产，这是 Smart Nation 时代不存在的政治变量。整套战略能不能执行下去，取决于这一刀砍下来的时候，再训练和岗位重塑跟不跟得上。

- **PMET 起薪与招聘量**：初级律师 / 会计师 / 工程师的起薪和招聘量是否下降——这是 AI 替代效应最早的信号
- **再训练项目转岗率**：CCP、SkillsFuture Mid-Career Credit、AI Bilingual 100K 完成者是否真的转岗成功，还是绕一圈回到原岗位甚至离开劳动力市场
- **NTUC 政策诉求**：从"保护工人"升级到"限制 AI 部署"的临界点——一旦越过，整套战略要被重写
- **PAP 选举数据**：PMET 高比例选区的得票率变化，是观察社会接受度的最硬信号

### 反向信号：哪些事情会推翻论点

- 就业冲击越过临界点，催生限制 AI 替代人力的法规
- 大企业（DBS、Singtel、PSA）跑得很快，中小企业完全掉队——双轨变两极化

如果上面的数字普遍向好，"双轨同时跑"这个论点就是真的；如果某一轨明显掉队，要么论点要修正，要么执行能力被高估了。

---

## 延伸阅读

- [从数字化到 AI：新加坡的第二次国家级转型](/singapore-ai-vs-smart-nation-two-transformations/) — 把 Budget 2026 和 2014 Smart Nation 并排对照
- [新加坡的 AI 马六甲海峡在哪里？](/singapore-ai-strategy-the-real-moat/) — AI 精炼枢纽策略的兴起与侵蚀
- [新加坡 AI 政策演进全景](/evolution/) — 从 2014 智慧国家到 2026 全面 AI 战略的五阶段时间轴
- [国会 AI 焦点](/debates/) — Budget 2026 期间各部委 Committee of Supply 的完整辩论记录
- [政策文件](/policies/) — Budget 2026 官方文件与中文翻译

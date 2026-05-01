# Cluster C — 公共服务、健康、教育、交通、建造、环境

> 整理日期：2026-04-25
> 范围：MOH/Synapxe + SingHealth/NHG/NUHS、MOE/NIE + 自治大学、MOT/LTA + PSA + Changi、MND/HDB/BCA/URA/JTC、MSE/NEA/PUB
> 已有数据不重复：MOH COS 2026 三场（preventive、generative、national mission）、MOE COS 2026、MOT/MND/MSE COS 2026、Synapxe ACE-AI 摘要

---

## 1. MOH + Synapxe（卫生部 + 国家医疗科技局）

Synapxe 是 MOH 的国家医疗科技机构（前身为 IHiS，2023 年改名），运营全岛医疗 IT 与 AI 平台，定位为"国家医疗 AI 工厂"。Synapxe 战略核心是把 HEALIX（基础设施）+ AimSG（医疗影像 AI 平台）+ HealthHub AI（公众端）+ Tandem（GenAI 平台）做成一个国家级的 AI/数据底座，让所有 AI 项目跑在同一套基础设施上，不再是单点试点。

### 关键 AI 项目 / 政策

#### HealthHub AI（公众端 AI 健康助手）
- **启动日期**：2025-04（beta 开放公测）；2025 年下半年正式上线
- **金额 / 规模**：未公开（属 MOH "$150M public health genAI" 投入的一部分）
- **核心内容**：在国家级健康 App HealthHub 中嵌入多语种文/语对话 AI；与 OpenAI 合作用 Agents SDK 做 agentic AI（自动预约、个性化健康建议、按生命阶段定制内容）
- **来源**：
  - https://www.synapxe.sg/media-releases/artificial-intelligence/ai-accelerate-2025
  - https://www.healthcareitnews.com/news/asia/singapore-looks-applying-agentic-ai-healthcare
- **关键数据**：beta 期 1,800+ unique sessions，平均评分 4.5/5

#### HEALIX（国家医疗数据 + AI 基础设施）
- **启动日期**：2024（持续扩展中，2025 年与 Databricks/Google Cloud 联合扩容）
- **金额 / 规模**：未公开单独金额；属 MOH "$150M genAI for public health" 范畴
- **核心内容**：云端数据基础设施，把临床、社经、生活方式、基因数据跨三大医疗集群打通，同时作为 AI 训练与部署的统一平台。配套 HealthX Innovation Sandbox（合成/匿名数据沙盒，对外部初创开放）。
- **来源**：
  - https://www.moh.gov.sg/newsroom/speech-by-mr-ong-ye-kung--minister-for-health-at-the-synapxe-ai-accelerate-conference-on-16-june-2025/
  - https://www.databricks.com/company/newsroom/press-releases/databricks-and-synapxe-join-forces-accelerate-data-and-ai-enabled
- **关键数据**：与 Databricks + Google Cloud 联合培训 600+ 医疗科技/医疗专业人员（每家 300+）；数据覆盖 SingHealth/NHG/NUHS 三集群

#### AimSG（国家医疗影像 AI 平台）
- **启动日期**：早期版本 2022；2025-06 新增两个临床用例
- **金额 / 规模**：未公开；MOH 描述为"国家级 vendor-neutral 平台"
- **核心内容**：让公立医院把已验证的 AI 模型嵌入 PACS 工作流。2025 年 6 月上线两条新管线：(1) NHG 国家结核筛查中心的胸片 TB 筛查 AI；(2) Woodlands Health 急诊骨折检测 AI
- **来源**：
  - https://www.synapxe.sg/media-releases/artificial-intelligence/ai-accelerate-2025
  - https://www.healthcareitnews.com/news/asia/behind-singapores-widespread-ai-adoption-public-health
- **关键数据**：两家 SingHealth 医院已部署胸片 AI；扩展到结核筛查 + 骨折读片

#### SELENA+（糖尿病视网膜病变筛查 AI）
- **启动日期**：研发自 2010；2018-11 起 SiDRP 大规模实地试用；2024 年起在 4 家 DRESS 站点常规筛查
- **金额 / 规模**：年覆盖 100,000+ 患者，预计 2050 年翻倍至 ~200,000
- **核心内容**：深度学习系统，一次扫描同时检测糖尿病视网膜病变、青光眼、AMD；NUS + SNEC 共同研发；现已纳入 Synapxe 平台对外授权
- **来源**：
  - https://www.synapxe.sg/healthtech/health-ai/selena
  - https://www.singhealth.com.sg/news/tomorrows-medicine/an-ai-for-the-eye-new-tech-cuts-time-for-spotting-signs-of-diabetic-eye-disease
  - https://www.moh.gov.sg/newsroom/efficacy-of-the-selena-system/
- **关键数据**：工作量减少最多 50%；准确率与人类阅片员相当；结果秒级返回（原本数小时至数日）

#### Note Buddy（GenAI 临床记录助手 / Ambient AI Scribe）
- **启动日期**：2025-09-04 起在 SingHealth 各机构渐进部署
- **金额 / 规模**：截至 2025-12，5,000+ 医护使用，生成 67,000+ 份病历笔记
- **核心内容**：SingHealth Digital Strategy 部门自研，基于 Microsoft GenAI；自动转录并总结医患对话，支持英语 + 普通话 + 马来语 + 泰米尔语 + 粤语 5 种语言
- **来源**：
  - https://www.singhealth.com.sg/news/innovation/singhealth-implements-note-buddy-a-microsoft-ai-documentation-system-to-transform-clinical-documentation-and-enhance-quality-of-doctor-patient-interactions
  - https://www.synapxe.sg/news/artificial-intelligence/genai-powered-documentation-tool-note-buddy
  - https://medinform.jmir.org/2026/1/e85580
- **关键数据**：每次问诊节省 2-7 分钟病历时间；认知/行政负担降低最多 40%

#### ACE-AI（慢病风险预测 AI）
- **启动日期**：计划 2027 年初在 Healthier SG GP 诊所 + 综合诊疗所推广
- **金额 / 规模**：未公开
- **核心内容**：Synapxe 开发的 Assisted Chronic Disease Explanation AI；基于年龄 + 病史预测 3 年内糖尿病/血脂异常风险；高风险者（>75% 概率）从 3 年/次升级为每年免费心血管筛查
- **来源**：
  - https://www.moh.gov.sg/newsroom/becoming-a-healthier-population/
  - https://english.news.cn/asiapacific/20260305/962b4158f83e47b196dcace1510b6892/c.html
- **关键数据**：识别高风险人群准确度 >75%；被 MOH 列为 Healthier SG 关键 AI 工具

#### APOLLO（国家级 CT 冠脉 AI）
- **启动日期**：2022 启动，2025 年三集群联试
- **金额 / 规模**：已招募 5,000 患者
- **核心内容**：SingHealth 主导，建立国家级 CT Coronary Angiography AI 平台供临床、研究、产业三方共用；AI 读片 v1.0 比临床医师快 20 倍，准确率持平
- **来源**：https://www.healthcareitnews.com/news/asia/singapores-imagine-ai-largest-global-gathering-to-shape-the-future-of-healthcare-with-ai-innovations
- **关键数据**：将在 SingHealth + NUHS + NHG 三集群联合试用

#### Healthier SG × 数字孪生（慢性肾病管理）
- **启动日期**：2025 年初试点
- **金额 / 规模**：未公开
- **核心内容**：SGH + TTSH + 部分综合诊疗所联合试点。代谢数字孪生用 AI 预测糖尿病患者未来 3 年得 CKD 的概率，输入项含空腹血糖/胆固醇/BMI/血压
- **来源**：
  - https://www.ttsh.com.sg/About-TTSH/TTSH-News/Pages/Digital-twin-tech-for-managing-chronic-kidney-disease-to-be-trialed-in-Singapore-in-early-2025.aspx
  - https://www.singhealthdukenus.com.sg/news/patient-care/digital-twin-tech-for-managing-chronic-kidney-disease-to-be-trialled-in-singapore-in-early-2025
- **关键数据**：新加坡 ESRD 因糖尿病的发病率全球第三，是该项目目标问题

#### 其他 Synapxe 2025 部署
- **Synseh**：传统中医舌诊 CV+AI POC
- **ASPIRE**：与 NHG/TTSH 合作的肌少症（sarcopenia）AI 筛查
- **GenAIus Challenge**：2024-04 启动，160+ 医护参与，70+ 用例，8 个 MVP
- **AWS LLM League 2025**：5 周 gamified 培训
- **来源**：https://www.synapxe.sg/media-releases/artificial-intelligence/ai-accelerate-2025

### Budget 2026 该机构承诺

- $150M 用于 public health genAI 推广（已在 2025 COS 公布）
- 与 OpenAI / Microsoft / Databricks / Google Cloud / AIDX 等多签合作
- 2027 年起 ACE-AI 全国推广，纳入 Healthier SG 流程

### 备注

- Synapxe 战略明显从"单点 AI 试点"转向"国家 AI 平台 + 一次性铺开三集群"——HEALIX/AimSG/HealthHub AI 都是平台型而非应用型
- HealthHub AI 是**典型的国家级 AI-native 转型样本**：传统政府 App 一次性升级成对话式 + agentic + 多语种
- 缺口：MOH/Synapxe 多个项目金额未单独公开，整体打包在 "$150M genAI public health" 内

---

## 2. MOE + NIE（教育部 + 国立教育学院）

### 关键 AI 项目 / 政策

#### SLS AI 工具栈（Student Learning Space）
- **启动日期**：SLS 平台 2018 上线；AI 工具 2023-2025 渐进上线
- **金额 / 规模**：覆盖全国所有公立中小学
- **核心内容**：MOE + GovTech 联合开发的国家在线学习平台，已嵌入 8 类 AI 工具：
  1. **Adaptive Learning System (ALS)**：数学（高小 + 中初）、地理（高中）个性化学习路径
  2. **Authoring Copilot (ACP)**：教师课件生成 AI
  3. **Annotated Feedback Assistant (AFA)**：学生作答嵌入式批注 AI
  4. **Data Assistant (DAT)**：教师用自然语言查询学生数据
  5. **Learning Assistant (LEA)**：学生侧对话式学习智能体
  6. **Feedback Assistant - Mathematics (FA-Math)**：数学步骤化提示规则引擎
  7. **Short Answer Feedback Assistant (SAFA)**：自由作答批改 + 评分
  8. **Speech Evaluation Tool (SET)**：英语 + 母语口语评测
- **来源**：
  - https://www.learning.moe.edu.sg/teachers/teaching-and-learning-on-sls/aied-features/
  - https://www.learning.moe.edu.sg/ai-in-education/ai-in-sls/short-answer-feedback-assistant/
  - https://www.tech.gov.sg/technews/ai-in-education-transforming-singapore-education-system-with-student-learning-space/
- **关键数据**：MOE 强调"自研或预审"原则，不让通用大模型直连教学

#### GenAI 使用指引 + AI Ethics Framework
- **启动日期**：2023 年起逐步发布；持续更新
- **金额 / 规模**：覆盖全国所有公立学校教师
- **核心内容**：教师/家长两条线指引；附 *A Parent's Guide to Using Generative AI tools for Learning*；详细政策放在 MOE Intranet
- **来源**：
  - https://www.learning.moe.edu.sg/ai-in-sls/responsible-ai/guidance-on-generative-ai/
  - https://www.learning.moe.edu.sg/ai-in-sls/responsible-ai/ai-in-education-ethics-framework/
- **关键数据**：未公开

#### EdTech Masterplan 2030 + AI in Education
- **启动日期**：2023 公布，2030 完整落地
- **金额 / 规模**：MOE 全国预算
- **核心内容**：把 AI 嵌入课程 + 课外 + 自学；"Code for Fun" 2027 年覆盖全部学校并升级 AI 内容；2026 年 CCE Cyber Wellness 课程加入"鉴别 GenAI 信息"+"识别 deepfake"模块；AI 从 P4 起渐进引入
- **来源**：
  - https://www.moe.gov.sg/education-in-sg/educational-technology-journey/edtech-masterplan/artificial-intelligence-in-education
  - https://theonlinecitizen.com/2026/02/26/moe-studying-impact-of-artificial-intelligence-on-student-cognitive-skills-says-desmond-lee
- **关键数据**：未公开具体金额

#### NIE AI@NIE + Certificate in AI for Education
- **启动日期**：AI@NIE 倡议 2024 启动；Certificate 课程 2025-07 开班
- **金额 / 规模**：目标 2026 年覆盖所有职前 + 在职教师
- **核心内容**：把 AI 能力嵌入所有职前教师培训；新增 Certificate in AI for Education 高阶认证；自研 TeacherGAIA 工具；缩短 PGDE 给在岗培训留时间
- **来源**：
  - https://www.ntu.edu.sg/nie/aied
  - https://www.ntu.edu.sg/nie/admissions/professional-programmes/professional-development-programmes-courses/certificate-programmes/certificate-in-artificial-intelligence-for-education
  - https://www.ntu.edu.sg/nie/news-events/news/detail/ai-education--the-essence-is-people
- **关键数据**：6 小时教师工作坊（GenAI 评估专题）；NIE 承诺 2026 年所有学历层级教师都修过 AI 课

#### Microsoft Elevate × Singapore（高教 AI 普及）
- **启动日期**：2026-04 公布
- **金额 / 规模**：Microsoft 在新加坡总投资 $5.5B（多年）
- **核心内容**：覆盖所有大专院校学生 + 教师 + 非营利组织的 AI 工具 + 培训
- **来源**：https://news.microsoft.com/source/asia/2026/04/01/microsoft-announces-5-5-billion-spend-and-new-microsoft-elevate-programs-to-support-every-tertiary-student-educator-and-nonprofit-to-power-singapores-ai-future/
- **关键数据**：未公开教育细分金额

#### NUS / NTU / SMU / SUTD AI 课改
- **启动日期**：渐进，自 2024 起
- **金额 / 规模**：四校 AI master 项目 + AI 必修科
- **核心内容**：NTU College of Computing and Data Science 推 BCS in AI & Society 本科；NUS-ISS 推 Master of Tech in AI Systems；NTU MSAI；NUS SCALE MSc AI & Innovation；执行项目（NUS Full Stack Development with AI）
- **来源**：
  - https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-computing-hons-in-artificial-intelligence-and-society
  - https://www.iss.nus.edu.sg/graduate-programmes/programme/detail/master-of-technology-in-artificial-intelligence-systems
  - https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-artificial-intelligence
  - https://scale.nus.edu.sg/programmes/graduate/msc-(artificial-intelligence-innovation)
- **关键数据**：四校未发布"全校强制 AI 必修"统一政策；分院系/项目实施

### Budget 2026 该机构承诺

- 2026 年 Cyber Wellness 课程升级（含 GenAI + deepfake 识别）
- 2027 年 Code for Fun 全国扩容 + AI 内容升级
- NIE 2026 完成所有教师 AI 培训覆盖

### 备注

- MOE 路径明显偏"国家自研 + 强政策约束"——SLS 8 类 AI 工具全部 MOE 内部研发或预审，不允许学校直接接 ChatGPT
- 高教层面留给四所大学自主决策，没有强制必修 AI（这是与中小学的最大区别）
- 缺口：四校"AI 必修"信息缺乏统一披露；NIE Certificate 项目实际选修人数未公开

---

## 3. MOT + LTA + PSA + CAG（交通部 + 陆路交通局 + 港务局 + 樟宜机场集团）

### 关键 AI 项目 / 政策

#### Punggol AV 公共穿梭车（首批商业化 AV）
- **启动日期**：2025-09-20 公布；2025-10 起 WeRide/Grab 在 Punggol 测试；2026-Q1 邀约社区试乘；2026-Q2 首条线路启动
- **金额 / 规模**：3 条固定路线、5-8 座车辆、紫色车身配 amber beacon
- **核心内容**：LTA 主导的全球首批 AV 公共固定线路：
  - **Grab + WeRide 路线 1**：Matilda Court ↔ Oasis Terraces 综合诊疗所 ↔ Punggol Plaza 市场（10km，35 分钟）
  - **ComfortDelGro + Pony.AI**：Punggol Northshore + Waterway Sunrise → Oasis Terrace + Punggol Plaza + Punggol Coast Mall（12km，55 分钟）
  - **Grab + WeRide 路线 2**：Matilda Court ↔ Punggol Coast MRT + One Punggol（12km，40 分钟）
- **来源**：
  - https://www.lta.gov.sg/content/ltagov/en/newsroom/2025/9/news-releases/new-autonomous-shuttle-services-to-be-progressively-deployed-in-.html
  - https://www.lta.gov.sg/content/ltagov/en/newsroom/2025/10/news-releases/lta_awards_contract_pilot_deployment_autonomous_buses.html
  - https://ir.weride.ai/news-releases/news-release-details/weride-and-grab-achieve-first-autonomous-vehicle-testing
- **关键数据**：可缩短公共交通通行时间最多 15 分钟

#### CETRAN（AV 国家测试中心）
- **启动日期**：2016-08 政府-NTU 合作设立；2017-11-22 测试场开放
- **金额 / 规模**：2 公顷测试场地
- **核心内容**：所有在新加坡上路 AV 必须先通过 CETRAN 安全评估，由 LTA + CETRAN + 交警共同制定评估标准
- **来源**：https://www.lta.gov.sg/content/ltagov/en/industry_innovations/technologies/autonomous_vehicles.html
- **关键数据**：当前 4 个商业部署点（Joo Koon、RWS、Ngee Ann Polytechnic、Esplanade/Marina Coastal Drive 扫地车）

#### LTA AV 法规与评估框架
- **启动日期**：2017 Road Traffic (AMV) Rules
- **金额 / 规模**：法律层面不公布金额
- **核心内容**：双轨制——Deployable AV Solutions（成熟商用 1 年记录）+ Developmental AV Solutions（研发型）；含 M1/M2 测试 + 远程操控评估 + Deployment Readiness Assessment
- **来源**：
  - https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/Technologies/PDF/av_application_20250114.pdf
  - https://www.lta.gov.sg/content/ltagov/en/industry_innovations/technologies/autonomous_vehicles.html
- **关键数据**：评估框架已为 ComfortDelGro/Pony.AI/WeRide 开通公共道路试运营

#### PSA Tuas Mega Port（AI 全自动港）
- **启动日期**：2022 起渐进开放，2040s 全面建成
- **金额 / 规模**：年吞吐 65M TEUs（建成后全球最大全自动港）
- **核心内容**：
  - AI 需求预测 + 情景模拟（应对地缘 + 货量波动）
  - AI 起重机异常检测 + 主动维护
  - 终端安全 + 流量编排 AI
  - 与 Singtel + Ericsson 合作 5G 网络切片支撑无人 AGV（2025 起独立运输集装箱）
- **来源**：
  - https://www.maritimegateway.com/psas-vision-for-a-smarter-and-more-resilient-port-ecosystem/
  - https://www.ericsson.com/en/press-releases/2/2024/11/singtel-and-ericsson-partner-to-develop-fully-automated-5g-port
  - https://www.globalpsa.com/enhancing-port-operations-and-supply-chain-efficiency-psa-at-singapore-us-ai-roundtable/
- **关键数据**：65M TEUs 年吞吐目标；Tuas 供应链中心 2027 开放

#### Changi Airport AI 转型
- **启动日期**：2022 起渐进；2025-02 取得首张 ISO/IEC 42001 AI 管理认证；2026-01 部署自动牵引车
- **金额 / 规模**：覆盖 5 个 AI 商业 + 旅客应用
- **核心内容**：
  - GenAI 个性化推荐：免税品销售 +22%、CSI +25%（2022）
  - GenAI 搜索引擎升级
  - ChangiVerse 元宇宙（与 Accenture 合作）
  - 实时拥堵预测 + 自动调度员工/通道
  - 探索 agentic AI 用例
  - 自动牵引车（airside automation）
- **来源**：
  - https://www.sgs.com/en-sg/news/2025/02/sgs-confirms-changi-airports-dedication-to-safe-and-secure-ai-with-first-ever-accredited-iso-iec-42001-certification
  - https://blog.adobe.com/en/publish/2025/05/15/smarter-and-more-personalised-travel-experiences-changi-airport-groups-ai-powered-vision-for-the-future
  - https://www.futuretravelexperience.com/2026/01/changi-airport-deploys-autonomous-tractors-in-major-step-towards-airside-automation/
- **关键数据**：CAG 是新加坡首家拿 ISO/IEC 42001 AI 认证的企业

### Budget 2026 该机构承诺

- LTA AV 商业化扩展（Punggol 第二批 + 公共巴士试运营）
- MOT 持续投入 CETRAN 测试与 AV 法规框架
- MPA + PSA 持续投入 Tuas Port 数字化（"Port of the Future"）

### 备注

- MOT 走"基础设施 + 法规先行"路径——CETRAN（2016）和 AV 法规（2017）比商用早 8 年
- PSA Tuas 是**国家级 AI 转型最纯粹的样本**：完全新建 + 全自动 + AI/5G 原生设计
- 缺口：CAG 具体 AI 投资金额未公开；PSA Tuas 总投资金额公开但分项未细化

---

## 4. MND + HDB + BCA + URA + JTC（国家发展部及下属）

### 关键 AI 项目 / 政策

#### Built Environment AI Centre of Excellence (BE AI CoE)
- **启动日期**：2026 COS 公布
- **金额 / 规模**：$30M
- **核心内容**：MND + SUTD 合作，专门做建造业 AI 转型；目标提升生产力 + 可持续性 + 宜居性
- **来源**：https://www.tradelinkmedia.biz/publications/7/news/6208
- **关键数据**：未公开 KPI

#### BCA BETC Grant（Built Environment Technology and Capability）
- **启动日期**：2025-04-01 起，至 2030-03-31
- **金额 / 规模**：S$100M
- **核心内容**：BCA 牵头，资助建造业采用 AI/数字工具/机器人/自动化；Phase 1（2025-04 ~ 2027-03）SMEs 最高 70% / non-SMEs 50%；Phase 2 降至 50% / 30%
- **来源**：
  - https://www1.bca.gov.sg/buildsg/buildsg-transformation-fund/built-environment-technology-and-capability-(betc)-grant
  - https://www.mnd.gov.sg/api/media/94d2eb6e-1426-4178-8bb2-789935f76f92
- **关键数据**：覆盖开发商 + 主承包商 + 分包商 + 顾问 + 预制商 + 供应商

#### BCA Integrated Digital Delivery (IDD)
- **启动日期**：长期项目
- **金额 / 规模**：BCA 全产业推广
- **核心内容**：AI + 数字工程贯穿项目生命周期；自动化报告 + 实时进度追踪 + 安全风险识别
- **来源**：https://www.frontier-enterprise.com/how-bca-plans-to-digitise-singapores-built-environment/

#### SPRINT 程序（建造业 AI 政府采购绿色通道）
- **启动日期**：2026 COS 公布
- **金额 / 规模**：未公开
- **核心内容**：MND 主导，HDB + BCA 共管；MND Family 机构试点；目标采购周期减半，加速创新研发产品政府采纳
- **来源**：https://www.tradelinkmedia.biz/publications/7/news/6208

#### URA ePlanner（地理空间规划 AI 平台）
- **启动日期**：渐进部署，已升级到 3D
- **金额 / 规模**：跨 40+ 政府机构、1,600+ 规划员/建筑师使用
- **核心内容**：从 2D GIS 工作流升级到支持 BIM + 点云 + 地下模型的 3D 集成；NLP 处理公众反馈；RPA 自动化常规任务；规划方案优化 AI 模型
- **来源**：
  - https://www.ura.gov.sg/Corporate/Resources/Ideas-and-Trends/AI-in-Urban-Planning
  - https://isomer-user-content.by.gov.sg/50/3250788b-76f9-45c9-a266-1b34e2993713/11_case-study_singapore_the-eplanner---integrating-data-for-inter-agency-collaboration.pdf
  - https://www.ura.gov.sg/Corporate/Planning/Our-Planning-Process/Smart-Planning
- **关键数据**：1,600+ 用户跨 40+ 机构

#### URA OneTool + Smart Planning Assistant
- **启动日期**：2021+ 渐进部署
- **金额 / 规模**：跨规划员
- **核心内容**：内部研发 OneTool 做小区/区域设施需求 AI 预测 + 情景规划；Smart Urban Planning Assistant 评估先例 + 备选方案
- **来源**：https://govinsider.asia/intl-en/article/huang-zhongwen-ura-inside-singapores-vision-for-data-driven-urban-planning

#### Virtual Singapore（国家级数字孪生）
- **启动日期**：2014 启动；持续更新
- **金额 / 规模**：覆盖全岛
- **核心内容**：高分辨率全岛 3D 模型，整合实时建筑/基建/人流/环境数据；用于建筑遮风/光伏/防灾仿真
- **来源**：
  - https://oecd-opsi.org/innovations/virtual-twin-singapore/
  - https://infra.global/singapores-digital-twin-from-science-fiction-to-hi-tech-reality/
- **关键数据**：跨多机构使用，已成为 ePlanner 3D 数据底座

#### JTC Punggol Digital District + Open Digital Platform (ODP)
- **启动日期**：2024 起渐进开放，第一批租户入驻 2024
- **金额 / 规模**：50 公顷综合园区；新加坡首个全区智能 + 可持续区
- **核心内容**：JTC + GovTech 共建 ODP——首个区级智慧操作系统；AI/ML 自动调温 + 电梯调度 + 预测维护；面部识别门禁；自主机器人末端配送；district cooling + smart grid
- **来源**：
  - https://www.jtc.gov.sg/punggoldigitaldistrict/odp
  - https://www.jtc.gov.sg/punggoldigitaldistrict/sustainability
  - https://estates.jtc.gov.sg/pdd/stories/open-digital-platform-the-digital-backbone-of-pdd
  - https://www.jtc.gov.sg/about-jtc/news-and-stories/press-releases/jtc-appoints-univers-and-pacificlight-to-develop-singapores-first-district-level-smart-grid-in-pdd
- **关键数据**：能耗下降最多 30%（vs 标准商用楼），AI 优化追加 20% 节能空间；CO2 年减 3,700 吨

#### HDB Smart HDB Town + Tengah（首座智能能源镇）
- **启动日期**：Tengah 2018 公布；首批 BTO 2025 末交付
- **金额 / 规模**：4.2 万户、5 个区
- **核心内容**：从设计起就嵌入 AI + 传感器 + 算法做能源管理；中央化能源软件作为"镇大脑"，覆盖镇级/邻里级/单元级；HDB + SP Group 合作研发；含 SP 智能水/电表
- **来源**：
  - https://www.hdb.gov.sg/cs/infoweb/about-us/our-role/smart-and-sustainable-living/smart-hdb-town-page
  - https://www.hdb.gov.sg/about-us/history/hdb-towns-your-home/tengah
  - https://www.spgroup-asia.com/insights/media-releases/sp-group-partners-hdb-study-development-singapore-smart-energy-town-tengah
- **关键数据**：Tengah 已交付 ~3,200 户（2025 末），另 7,800 户 2026 在建

#### HDB AskJudy（虚拟助手）+ MSO OneService
- **启动日期**：长期运营
- **金额 / 规模**：HDB 200+ e-Service
- **核心内容**：HDB AskJudy 做住房贷款 + 转售价格等查询；Municipal Services Office 的 OneService 通过 WhatsApp/Telegram 路由市政诉求 + AI 自动分类
- **来源**：
  - https://www.hdb.gov.sg/about-us/news-and-publications/publications/dwellings/a-journey-in-service-transformation
  - https://www.oneservice.gov.sg/oneservice/oneservice-app-and-chatbot

#### HDB 工地生产力（40% 提升目标）
- **启动日期**：2030 目标年
- **金额 / 规模**：HDB BTO 全量
- **核心内容**：BTO 工地试点先进建造（DfMA + 预制 + 机器人 + 边缘 AI 实时质检）；目标 2030 提升工地生产力 40%
- **来源**：https://www.tradelinkmedia.biz/publications/7/news/4153

### Budget 2026 该机构承诺

- $30M BE AI CoE（MND + SUTD）
- $100M BETC Grant（已运行）
- SPRINT 政府采购绿色通道（2026 启动）
- 2026-05-01 起 GFA ≥5,000m² 项目强制 SGBuildex 自动 CPD 提交

### 备注

- MND 体系是**最完整的"国家级 AI-native 转型"样本**：基础设施（Virtual Singapore + ODP）+ 资金（BETC + BE AI CoE）+ 流程（SPRINT 绿色通道）+ 强制（CPD 自动化）四位一体
- Tengah + PDD 是**"国家级 AI-native 新建项目"**——从规划日起就 AI 原生，不是事后改造
- 缺口：BCA 工地 AI 落地企业数 + 实际应用率未公开；HDB Tengah 实际能耗节省的运行数据尚未发布

---

## 5. MSE + NEA + PUB（可持续与环境部 + 国家环境局 + 公用事业局）

### 关键 AI 项目 / 政策

#### NEA $25M Weather Science Research Programme
- **启动日期**：2025-03-04 启动；项目立项预计 2025 下半年
- **金额 / 规模**：$25M（来自 RIE 2025 计划）
- **核心内容**：MSS（气象局）+ Centre for Climate Research Singapore (CCRS) + 高校 + 研究机构联合；用 AI 整合多源数据预测强降雨/强风；用 AI + 历史气象数据改进本地预报；首套东南亚区域历史气象再分析数据集；含海洋 + 陆地条件耦合
- **来源**：https://www.nea.gov.sg/media/news/news/index/25-million-weather-science-research-programme-launched-to-enhance-singapore-s-weather-prediction-capabilities
- **关键数据**：聚焦 Sumatra squalls 等极端天气

#### NEA 登革热 AI 预测 + 蚊媒控制
- **启动日期**：渐进部署
- **金额 / 规模**：50,000 个全国蚊子诱捕点
- **核心内容**：NEA 自研 LASSO 模型预测登革热病例（提前 2 个月）；与气象 + 建成环境 + 人口数据结合训练；2025 年 Nature Communications 发表：含血清型 + 气候的多变量预测可达邻里级
- **来源**：
  - https://govinsider.asia/intl-en/article/dr-ng-lee-ching-nea-singapore-dengue-machine-learning
  - https://www.nature.com/articles/s41467-025-66411-6
  - https://www.mdpi.com/2414-6366/9/4/72
- **关键数据**：可提前 2 个月预测；50,000 诱捕点，按预测精准布置

#### PUB Smart Water Meter Programme
- **启动日期**：2022 早期启动安装；2024 末完成 Phase 1
- **金额 / 规模**：300,000 个智能水表（首期）
- **核心内容**：PUB + SP Services + Itron 合作；覆盖 Bukit Batok / Hougang / Jurong West / Tampines / Tuas + 新建的 Tampines North + Tengah；每日自动上传读数，APP 提供小时级用水 + 漏水/异常告警；运营周期 15 年
- **来源**：
  - https://www.pub.gov.sg/Public/KeyInitiatives/Smart-Water-Meter
  - https://www.pub.gov.sg/smartwatermeterprogramme/about
  - https://smartwatermagazine.com/news/itron/singapores-pub-connect-300000-itron-smart-water-meters
- **关键数据**：300,000 表（Phase 1）；Phase 2 全岛覆盖待评估

#### PUB SMART PUB Roadmap
- **启动日期**：长期路线图（持续）
- **金额 / 规模**：未公开总额
- **核心内容**：5 大方向：智能水质（自主水质检测船 + AI 检测器）+ 抢先漏水管理 + 客户互动一体化 + 智能水表 + 实验室/方案审查 RPA
- **来源**：
  - https://www.pub.gov.sg/Resources/News%20Room/Featured%20Stories/2025/Singapore%20Industrial%20Water%20Revolution
  - https://www.iaasiaonline.com/transforming-pub-smart-utility-future/
- **关键数据**：覆盖全水务环节

#### PUB Joint Operations Centre（实时洪水 + 排水监控）
- **启动日期**：渐进运营
- **金额 / 规模**：覆盖全岛水库 + 排水系统
- **核心内容**：整合降雨图 + CCTV + 水位传感器；预测重雨地点提前部署应急队；正在开发综合海岸-内陆洪水模型，做长期海岸防护规划
- **来源**：https://www.pub.gov.sg/Resources/News%20Room/Featured%20Stories/2025/Singapore%20Industrial%20Water%20Revolution
- **关键数据**：未公开实际响应时间提速

#### PUB Bentley 数字异常 + 漏水检测
- **启动日期**：渐进部署
- **核心内容**：与 Bentley 合作做管道数字模型 + 漏水预警
- **来源**：https://www.bentley.com/wp-content/uploads/cs-pub-digital-anomaly-ltr-en-lr.pdf

### Budget 2026 该机构承诺

- 持续 $25M Weather Science 研究
- PUB Phase 2 智能水表全岛扩展（评估中）
- 海岸-内陆综合洪水模型（持续研发）

### 备注

- NEA 走"研究先行 + 公共健康融合"路径——把 AI 同时用在天气 + 流行病（登革热）两个高风险问题上
- PUB 的智能水表是**国家级 AI-native 基础设施铺设**的典型样本：300K 表 + 15 年运营周期 + 数字孪生底座
- 缺口：PUB 总数字化投资 + 漏水率改善实际数字未单独披露

---

## 总览：跨机构 AI-native 转型模式观察

### 机构 vs 模式映射

| 机构 | 主要模式 | 代表项目 | 投入级别 |
| ---- | -------- | -------- | -------- |
| MOH/Synapxe | 国家平台 + 三集群打通 | HEALIX + AimSG + HealthHub AI | $150M GenAI |
| MOE | 自研工具 + 强政策 | SLS 8 类 AI 工具 + EdTech 2030 | 公开金额未单列 |
| LTA | 法规先行 + 测试基础设施 | CETRAN + Punggol AV | 公开金额未单列 |
| PSA/MPA | 全新基建 AI-native 设计 | Tuas Mega Port | 多年总投资未公开 |
| BCA/MND | 资金 + 流程 + 强制四位一体 | BETC + SPRINT + BE AI CoE | $130M（已公开） |
| URA | 数据平台 + 智能助手 | ePlanner 3D + Virtual Singapore | 未公开 |
| JTC/HDB | 全新区域 AI-native 设计 | PDD ODP + Tengah | 未公开 |
| NEA/PUB | 研究项目 + 基础设施铺设 | $25M Weather + 300K 智能水表 | $25M + 未公开 |

### 共同信号

1. **2025 是 GenAI 大规模商用化拐点**：Note Buddy（67K 病历）、HealthHub AI（公测 4.5/5）、Punggol AV（首批商用）、Changi ISO 42001 认证全在 2025 年
2. **平台化 vs 应用化**：每个机构都在投平台（HEALIX、AimSG、ePlanner、ODP），减少零散试点
3. **国家级 AI-native 新建**：Tuas Port + Tengah + PDD 三处都是"从零造 AI 原生体"的样本
4. **强政策约束**：MOE 不许学校直连 ChatGPT、Changi 拿 ISO/IEC 42001、CAG 引入 AI 治理框架——治理走在落地之前

### 主要数据缺口

- 各机构具体年度 AI 预算（多数打包在 COS 大类）
- ROI / KPI 落地层面（多数公开的是输入而非输出）
- AI 工具实际跨员工/学生/公民使用率（除 Note Buddy + HealthHub beta + SELENA+ 外多数缺）
- 各机构 AI 相关人员编制

# 现有数据盘点 — Singapore AI 政策按部门分类

本文件用于研究阶段，列出项目中已有的政策数据出处，避免代理重复研究。
日期：2026-04-25
项目数据来源：`src/data/policies.ts`、`src/data/debates.ts`

---

## 一、新加坡 16 个部委 + 关键法定机构 总览

### 部委（Ministries）

| 缩写 | 全称 | 现有数据 | 关键 AI 议题 |
|---|---|---|---|
| PMO | Prime Minister's Office | Smart Nation 倡议（2014）+ 2026 NAC | 总体战略 |
| MOF | Ministry of Finance | Budget 2026 AI 章节、Budget 2025 | EIS 扩展、AI 拨款 |
| MTI | Ministry of Trade and Industry | COS 2026 全文 | EDB / ESG 落地 |
| MDDI | Ministry of Digital Development and Information | COS 2026 全文 + IMDA 治理框架 | AI 治理、AI 双语 |
| MOE | Ministry of Education | COS 2026 全文 | NIE、AI 教育 |
| MOH | Ministry of Health | COS 2026 三场 | Synapxe、ACE-AI |
| MOM | Ministry of Manpower | COS 2026 全文 | WSG、AI 工作影响 |
| MND | Ministry of National Development | COS 2026 — AI & Robotics | HDB、BCA 建造 AI |
| MOT | Ministry of Transport | COS 2026 — Smart Factories | LTA 自动驾驶 |
| MSE | Ministry of Sustainability and Environment | COS 2026 三场 | NEA、PUB、气候 AI |
| MSF | Ministry of Social and Family Development | COS 2026 两场 | 深伪保护、儿童 AI |
| MCCY | Ministry of Culture, Community and Youth | COS 2026 — Malay/Muslim | 社群包容 |
| MHA | Ministry of Home Affairs | **空白** | SPF、ICA、CSA |
| MINDEF | Ministry of Defence | **空白** | DSTA、DSO |
| MINLAW | Ministry of Law | **几乎空白** | IP、版权 |
| MFA | Ministry of Foreign Affairs | Bletchley + Seoul + GPAI | Singapore Consensus、AI Safety |

### 关键法定机构 / 委员会

| 缩写 | 全称 | 隶属 | 现有数据 |
|---|---|---|---|
| IMDA | Infocomm Media Development Authority | MDDI | 治理框架 4 份 |
| MAS | Monetary Authority of Singapore | 独立 | FEAT + Veritas |
| NRF | National Research Foundation | PMO | RIE2025 |
| CSA | Cyber Security Agency | PMO | AI 系统安全指南 |
| A*STAR | Agency for Science, Technology and Research | MTI | **空白** |
| AISG | AI Singapore | NRF | **空白** |
| GovTech | Government Technology Agency | PMO/SNDGO | **空白** |
| SNDGO | Smart Nation and Digital Govt Office | PMO | Smart Nation 2.0 |
| EDB | Economic Development Board | MTI | **空白** |
| ESG | Enterprise Singapore | MTI | **空白** |
| WSG | Workforce Singapore | MOM | **空白** |
| SSG | SkillsFuture Singapore | MOE | **空白** |
| Synapxe | National Healthtech Agency | MOH | 提及 ACE-AI |
| LTA | Land Transport Authority | MOT | **空白** |
| HDB | Housing Development Board | MND | **空白** |
| BCA | Building and Construction Authority | MND | **空白** |
| NEA | National Environment Agency | MSE | **空白** |
| PUB | Public Utilities Board | MSE | **空白** |
| NIE | National Institute of Education | MOE | **空白** |
| DSTA | Defence Science and Technology Agency | MINDEF | **空白** |
| DSO | DSO National Laboratories | MINDEF | **空白** |
| SPF | Singapore Police Force | MHA | **空白** |
| ICA | Immigration & Checkpoints Authority | MHA | **空白** |

---

## 二、已有 Budget 2026 COS 辩论清单

来源：`src/data/debates.ts`，全部 sourceUrl 指向 https://sprs.parl.gov.sg

| 部门 | 辩论主题 | sourceUrl 报告 ID | 日期 |
|---|---|---|---|
| MOH | Preventive Healthcare & AI | budget-2928 | 2026-03-05 |
| MDDI | AI as Strategic Advantage | budget-2895 | 2026-03-02 |
| MTI | AI Adoption & Economic Transformation | budget-2894 | 2026-03-02 |
| MOE | AI & Education Transformation | budget-2896 | 2026-03-02 |
| MOM | AI, Workforce & Career Resilience | budget-2903 | 2026-03-03 |
| MSF | Children's Safe AI Use & Screen Time | budget-2930 | 2026-03-05 |
| MSF | AI Deepfake Protection & Disability Employment | budget-2929 | 2026-03-05 |
| MCCY | Preparing Malay/Muslim Community for AI Economy | budget-2918 | 2026-03-04 |
| MOH | Generative AI for Clinical Documentation | budget-2916 | 2026-03-04 |
| MOH | AI as National Healthcare Mission | budget-2915 | 2026-03-04 |
| MOT | AI-Enabled Infrastructure & Cross-Border Smart Factories | budget-2914 | 2026-03-04 |
| MND | AI & Robotics in Construction | budget-2913 | 2026-03-04 |
| MSE | AI for Recycling & Waste Management | budget-2907 | 2026-03-03 |
| MSE | AI for Climate & Weather Prediction | budget-2905 | 2026-03-03 |
| MSE | AI for Climate Resilience | budget-2934 | 2026-03-06 |
| Budget Speech | Annual Budget Statement | budget-2844 | 2026-02-12 |
| PM Wong | Acknowledgement to Chair — AI as Strategic Centrepiece | budget-2937 | 2026-03-06 |

**缺位**：MHA、MINDEF、MINLAW、MFA、MOF（独立 COS）的 2026 COS 辩论尚未导入。

---

## 三、已有的政策框架（policies.ts 五大类）

### 国家战略（5 项）
- 公共 AI 研究投资计划 2026-2030 — MDDI — 10 亿新元
- 国家人工智能战略 2.0 (NAIS 2.0) — SNDGO — 2023
- 智慧国家 2.0 — SNDGO — 2023
- 国家人工智能战略 1.0 (NAIS 1.0) — SNDGO — 2019
- 智慧国家倡议 — PMO — 2014

### 治理框架（5 项 — 都是 IMDA + PDPC）
- Agentic AI 治理框架 — IMDA
- 生成式 AI 治理框架 — IMDA
- AI Verify 测试框架 — IMDA
- AI 治理模型框架 — IMDA
- 个人数据保护法 — PDPC

### 行业监管（4 项）
- CSA AI 系统安全指南 — CSA
- 法院生成式 AI 使用指南 — Supreme Court
- MAS Veritas 倡议 — MAS
- MAS FEAT 原则 — MAS

### 预算与资金（4 项）
- 2026 财政预算案 — 国家 AI 全面推进 — MOF
- 2026 卫生部供给委员会 — MOH
- 2025 财政预算案 — MOF
- RIE2025 研究创新计划 — NRF

### 国际合作（3 项）
- 首尔 AI 安全峰会承诺 — MFA — 2024-05
- Bletchley Park AI 安全峰会承诺 — MFA — 2023-11
- 加入全球 AI 合作伙伴关系 (GPAI) — SNDGO/MFA — 2020

---

## 四、本次研究需补的缺口

按代理任务分配：

### 代理 A — 数字、技术、研究、人才
- MDDI 部委内细分（AI bilingual 100K 计划落地、TeSA 扩展）
- IMDA 具体项目（AI Verify Sandbox、GenAI Eval Sandbox、Trusted Data Sharing）
- A*STAR（AI4SG、AI for materials/manufacturing）
- AI Singapore（100E、AI Apprenticeship、SEA-LION）
- NRF（RIE2025 → RIE2030 切换）
- GovTech（Pair、Pair Search、Hummingbird、AI Trail）
- SkillsFuture Singapore + WSG（AI 培训补贴）

### 代理 B — 经济、产业、金融
- MOF Budget 2026 完整 AI 章节（每条带金额）
- MTI 部委内（AI Mission、AI Centres of Excellence）
- EDB（AI 投资引进、Microsoft/AWS/NVIDIA 数据中心）
- Enterprise Singapore（SME AI 拨款、PSG）
- MAS 2026 新动作（AI Sandbox、Veritas v3）

### 代理 C — 公共服务、健康、教育、交通、建造
- MOH/Synapxe 完整 AI 路线图
- MOE/NIE（教师 AI 培训、AI in Classrooms）
- MOT/LTA（自动驾驶、智能交通、Cross-Border Smart Factories）
- MND/HDB/BCA/URA（建造业 AI、智慧屋邨、规划 AI）
- MSE/NEA/PUB（气候预测、水务 AI、垃圾分类）

### 代理 D — 国防、安全、法律、社会、国际
- MINDEF/DSTA/DSO（国防 AI、Project DALI/Sword 等）
- MHA/SPF/ICA（警察 AI、深伪起诉、边境 AI）
- MINLAW（版权、AI 法律责任、IP 立场）
- MFA（Singapore Consensus、AI Safety Institute、ISESEA II）
- MCCY、MSF（弱势群体 AI 包容）

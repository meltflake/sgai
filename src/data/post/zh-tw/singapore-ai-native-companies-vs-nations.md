---
lang: 'zh-tw'
publishDate: 2026-04-25
updateDate: 2026-05-03
title: 'AI-native 的公司與國家'
excerpt: '2026 年同時在跑兩類 AI-native 試驗——50 人的公司和 570 萬人的城邦。把它們並排放，會看到一個被忽視的事實：50 人的公司和 570 萬人的國家，可以用同一種 AI-native 架構，規模只決定槓桿，不決定本質。新加坡 Budget 2026 的真正賭注，是把整個國家當成本土企業 AI-native 轉型的包裝層。'
category: '觀察'
topicIds: ['national-strategy', 'economy-industry']
tags:
  - AI-native
  - 戰略
  - 觀察
  - 新加坡
  - Budget 2026
  - YC
author: '新加坡 AI 觀察'
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

> 本文把生而 AI-native 的公司和新加坡作為 AI-native 國家這兩類試驗放在一起對照。前者是 YC 在 2026 年那期 _How To Build A Company With AI From The Ground Up_ 裡描述的 50–500 人樣本；後者是 Budget 2026 描述的 570 萬人樣本。兩者用同一種架構、完全不同的槓桿。

---

## 一、同一種架構，兩個尺度

2026 年同時有兩類 AI-native 試驗在跑。

一類是 50–500 人的公司——Anthropic、Cursor、Lovable——從第一天起把 AI 放在工作流核心。YC 合夥人 Diana Hu 這樣定義這套方法論：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> AI 不應該只是公司在用的工具，它應該是公司執行的作業系統。

另一類是 **570 萬人的城邦**。新加坡先有 NAIS 2.0（National AI Strategy 2.0，2023 年釋出）把 AI 立為國家戰略，又在 2026 年 Budget 把 AI 升級為整份預算案的戰略主線，黃循財親掛帥 National AI Council，跨 11 個部委的 Committee of Supply 全部圍繞 AI。**從戰略層級、組織安排、財政投入三件事一起看，新加坡是迄今為止唯一一個把"做一個 AI-native 的國家"當成顯性國家戰略的主權國家。**

把這兩個並排放，會看到一個被忽視的事實：**50 人的公司和 570 萬人的國家，可以用同一種 AI-native 架構。規模只決定槓桿，不決定本質。**

### 三個資料訊號——為什麼 Budget 2026 是真實的

- 黃循財在 Budget 2026 閉幕致辭中**第一次**將 AI 升級為整份預算案的戰略主線
- RIE2030 撥款 **S$37B**（2025-12 公佈、2026-04 生效）
- EDB 已落地外資資料中心 **>S$30B**（Microsoft S$5.5B、AWS S$12B、Google US$9B）
- 跨 11 個部委 COS 協同辯論 AI（MDDI / MTI / MOH×3 / MOE / MOM / MOT / MND / MSE×3 / MSF×2 / MCCY）

### 操作性定義

什麼叫一個組織 AI-native？三條判定標準：

1. **AI 在決策關鍵路徑上**：核心判斷預設 AI 先出，人類做例外審批
2. **工作流以 AI 為預設假設**：流程、資料、產物按 AI 是主要消費者來設計
3. **激勵對齊 AI 增強**：晉升、招聘、培訓不獎勵繞開 AI 的人肉英雄

這三條標準在 50 人的公司裡數月內能重做完，但在 570 萬人的國家身上要穿透公務員系統、私營部門、全民教育——**5–10 年是樂觀估計**。

公司用一種方式做這三條；國家必須用完全不同的方式做同樣三條。新加坡的賭注不是算力 / 資料 / 模型——這三個生產要素它都不佔優。它賭的是執行架構：**政府自己做 AI-native 改造，同時用國家級槓桿把本土企業的 AI-native 轉型一起帶起來——兩件事都得做**。這是這篇文章要論證的核心。

---

## 二、AI-native 公司是什麼樣

YC 在 2026 年那期 _How To Build A Company With AI From The Ground Up_ 裡把方法論梳理得很清楚。這一節借用 Diana Hu 的五個支柱，再補 Jack Dorsey 在 Block 的取消中層組織設計——構成一個完整、可操作的 50 人公司怎麼變 AI-native 清單。

### 1. 閉環系統（Closed Loop）

這是最承重的一條。Diana 用的是控制論的概念：

- **開環（open loop）**：做決定 → 執行 → 不繫統測量 → 不調整。本質是有損的
- **閉環（closed loop）**：自調節系統，持續監測輸出、調整流程，越跑越準

舊世界的公司基本都是開環：拍板、執行、不一定系統測量結果、流程不會自我調整。AI-native 公司的第一性原則是把每個重要流程都變成閉環——產物進 AI、AI 看完整上下文、自動調整下一步。

### 2. 組織對 AI 可讀（Queryable Organization）

要讓閉環跑起來，組織必須**對 AI 可查詢**。具體做法：

- 所有會議用 AI notetaker 錄下來
- 減少私信和郵件，讓 agents 嵌入所有溝通渠道
- 自建儀表盤把所有資料接入：營收、銷售、工程、招聘、運營——全部
- 給 agent 接入 Linear、Slack、Pylon、GitHub、Notion、銷售電話錄音、每日站會

核心原則：**要讓模型發揮全部能力，必須給它和員工同等量級的上下文**。

### 3. AI 軟體工廠（AI Software Factories）

軟體開發模式重寫：

- **人類**：寫 spec、寫定義成功的測試集
- **Agent**：生成實現程式碼，反覆迭代直到測試通過
- **人類**：判斷輸出是否合格

極端形態：倉庫裡**沒有手寫程式碼，只有 spec 和測試**。Strong Compute 是這種做法——讓 agents 反覆迭代直到達到機率性滿意閾值，目標是消除人類寫程式碼或審程式碼這一步。

### 4. 取消中層管理 / 三種員工原型

舊世界需要中層管理者在組織里上下傳遞資訊。AI-native 公司裡，智慧層（intelligence layer）替代了這個功能——幾乎不應該有人類中介軟體。

Jack Dorsey 在 Block 的話：

> "If you keep the same org chart and management structure, you've missed the shift entirely. The company itself has to be rebuilt as an intelligence layer with humans at the edge guiding it rather than routing information through it."
>
> 如果你保留舊組織架構和管理結構，你完全錯過了這次變革。公司本身必須被重建成一個智慧層，人類站在邊緣引導它，而不是當中轉節點。

未來公司只剩三種角色：

| 角色                       | 定義                     | 關鍵特徵                                             |
| -------------------------- | ------------------------ | ---------------------------------------------------- |
| **IC（Builder/Operator）** | 直接動手做和運營         | 不限於工程師——開會帶原型，不帶 PPT                   |
| **DRI**                    | 負責戰略和客戶結果       | 一人一結果，無處可藏                                 |
| **AI Founder**             | 仍然親自 build、親自示範 | 創始人必須站在最前面演示能力躍遷，不能把 AI 戰略外包 |

### 5. 用 token 替代人頭

資源觀重寫：

- 一個用 AI 工具的人 = 舊時代一整個工程團隊
- 工程、設計、HR、行政都該大幅瘦身
- **應該願意承受高得不舒服的 API 賬單**——它替代的是遠更貴、遠更臃腫的人頭成本
- 最好的公司會把 token 用滿

---

這五條放在 50 人的公司裡，每條都能在數月內重新設計完成。

**那麼放到 570 萬人的國家身上呢？**

---

## 三、AI-native 國家是什麼樣

新加坡 Budget 2026 給出了目前唯一一個完整答案。這一節先看頂層敘事，再用六個抓手把所有部委的具體落地分類展開，最後看三層風險管理。

### 3.1 頂層敘事：從部門議題到戰略主線

#### 訊號 1 — 政治敘事的級別提升

黃循財在 2026 年 3 月 6 日的 Budget 閉幕致辭中**第一次**把 AI 升級為整份預算案的戰略主線，並把整份預算案定位為新加坡應對世界 _"more contested, more fragmented and ultimately, more dangerous"_ 的國家行動計劃——AI 是關鍵戰略籌碼。

#### 訊號 2 — 組織級別提升

黃循財親任 National AI Council 主席，不放給 MDDI 單獨推動。這是新加坡識別國家級議題的標誌性動作：**關鍵議題不交給某個部委，直接放到總理辦公室**。

跨 11 部委同時圍繞 AI 議題展開 Committee of Supply 辯論，是新加坡 COS 歷史上 AI 議題最集中的一次。

#### 訊號 3 — 財政級別提升

- RIE2030 撥款 **S$37B**（2025-12 公佈、2026-04 生效）
- 公共 AI 研究投資 **S$1B+**（2026–2030）
- EIS 400% 稅務扣除擴充套件至 AI（YA 2027–28，S$50K/企業/年上限）

這三個訊號疊加 = **國家級 AI Founder 模型成立**。Josephine Teo 一人統籌 MDDI、IMDA、國際 AI 治理三條線——可以找到的 57 篇官方部長致辭裡她佔 23 篇。

### 3.2 六個抓手——國家級 AI-native 的完整圖譜

把 Budget 2026 + 各部委 + 各法定機構的所有 AI 相關政策和落地專案，按 AI 引入路徑分成六個抓手：**基建、治理、人才、應用、政府自用、外交**。

這比按部門分類（MDDI / IMDA / MAS / MOH / ...）更能讓讀者一眼看出整體形狀。每個抓手都跨多個部委，串起來才是完整的執行管線。

#### 抓手 1 — 基建（資料 + 算力 + 物理基礎設施）

**國家直接做的事**：把企業自己買不起的算力 + 資料底座建好。

外資引進的算力（EDB）：

- Microsoft 資料中心 **S$5.5B**
- AWS **S$12B**
- Google **US$9B / S$11.6B + DeepMind Lab**
- NVIDIA × SIT Centre for AI、× Singtel、× AI Accelerator
- OpenAI 新加坡 APAC 區域總部
- Anthropic 招聘新加坡 Country Lead（2026）

本土補貼的算力：

- Enterprise Compute Initiative (ECI) **S$150M**——給企業買算力的直接補貼
- one-north AI Park / Kampong AI（MOF）

資金平臺：

- Anchor Fund @ 65 第二批 **S$1.5B**
- Future Sectors Development Fund **S$1.5B**
- EQDP 擴張至 **S$6.5B**

國家級資料底座：

- MOH/Synapxe **HEALIX** = 國家醫療資料 + AI 基礎設施
- URA **Virtual Singapore** = 國家級數字孿生
- BCA **BETC Grant S$100M** = 建造業數字基建
- JTC **Punggol Digital District + Open Digital Platform (ODP)** = 全區智慧區

家國安全側算力：

- HTX **NGINE** — NVIDIA B200 DGX SuperPOD（家國安全自有算力）

#### 抓手 2 — 治理（規則 + 沙盒 + 法律）

**國家直接做的事**：讓企業敢部署。企業不部署 AI 的最大障礙是合規風險——技術早就夠用。

通用治理框架（IMDA）：

- Model AI Governance Framework（2019）
- AI Verify（2022）+ **AI Verify Sandbox**（10+ 跨國大企業參與）
- GenAI Eval Sandbox + GenAI Sandbox 2.0
- Generative AI 治理框架（2024）
- **Agentic AI Governance Framework**（2026-01-22 達沃斯，**全球首發**）
- Trusted Data Sharing Framework + DPTM 升級 SS 714:2025

金融業治理 5 層堆疊（MAS）：

- FEAT Principles（公平 / 倫理 / 問責 / 透明）
- Veritas Initiative v1 / v2 / v3
- Project MindForge（24 家機構 + Microsoft / AWS / Google / Nvidia 全列其中）
- AI Risk Management Guidelines
- BuildFin.ai

網路安全治理（CSA）：

- Securing AI Systems Guidelines + Companion Guide
- Securing Agentic AI 增補稿
- Frontier AI Risk Advisory
- Cyber Trust Mark — AI 安全維度

法律治理（MINLAW + IPOS）：

- **Copyright Act §244** = AI 訓練免責（**與日本並列全球最寬鬆**）
- IPOS "When Code Creates" 報告 — AI Authorship 立場
- **輸出端嚴管**：OCHA + Elections Bill 2024（深偽禁令）+ Criminal Law Bill 2025（AI 私密影像入刑）+ Online Safety (Relief and Accountability) Bill 2025

> **治理哲學**：訓練寬鬆 + 輸出嚴管。日本和新加坡是世界上目前唯二做到這一點的國家——這給企業一個明確的可預測邊界。

#### 抓手 3 — 人才（教育 + 培訓 + 轉型）

**國家直接做的事**：讓企業找得到能用 AI 的人。

全民層（MDDI）：

- AI Bilingual **100K 工人計劃**（首批 accountancy + legal，1H 2026 上線，合作 ISCA / SAL / SCCA）
- National AI Literacy Programme

專業層（IMDA + AISG）：

- TechSkills Accelerator (TeSA) AI 擴充套件版
- AISG **AI Apprenticeship Programme (AIAP)**：16 批 410+ 學徒，900+ 申請，新一批 800 名額
- AISG **100E Programme**（每項 S$150K 共投）

教育系統層（MOE + NIE）：

- SLS（Student Learning Space）AI 工具棧 8 類
- GenAI 使用指引 + AI Ethics Framework
- EdTech Masterplan 2030
- NIE AI@NIE + Certificate in AI for Education
- Microsoft Elevate × Singapore（高教 AI 普及）
- NUS / NTU / SMU / SUTD 全面 AI 課改

財政補貼層（SSG + WSG）：

- SkillsFuture AI 課程 **50% / 70% 分層補貼**
- Mid-Career S$4,000 Credit
- SkillsFuture Level-Up Programme
- WSG × SSG 合併 = 一站式技能與就業平臺

中年再訓練層（MOM）：

- Job Redesign+
- Career Conversion Programme (CCP)
- Enterprise Workforce Transformation Package (EWTP)
- NTUC × AI 工人保護

> "Not all of us can be AI engineers. But we can be 'bilingual' in AI in our own areas of expertise."
>
> 不是所有人都能當 AI 工程師。但我們可以在自己擅長的領域成為 AI 雙語者。
>
> — Josephine Teo, MDDI Committee of Supply, 2026-03-02

#### 抓手 4 — 應用（產業 + 公共服務落地）

**國家直接做的事**：在 11 個部委裡同時鋪開旗艦應用。

產業旗艦（MTI）：

- National AI Missions（4 大先鋒行業）
- AI Centres of Excellence
- Embodied AI 具身智慧 R&D
- Industry Transformation Maps (ITM) 中的 AI 升級

研究旗艦（A\*STAR）：

- A\*STAR CFAR 5 大研究支柱
- AI Manufacturing 2030（Mencast 螺旋槳）
- AI 材料篩選 50–100x 加速
- GIS + SingHealth 健康 AI 合作
- National Multimodal LLM Programme **S$70M**

區域 LLM 旗艦（AISG）：

- SEA-LION v3 / v4 / Guard
- SEALD（資料集）

企業普及（IMDA + ESG）：

- **NAIIP — National AI Impact Programme**：10K 企業 + 100K 工人 / 2026–2029
- Champions of AI（旗艦企業計劃）
- ESG PSG AI 補貼比例 **30% → 50%**
- ESG SMEs Go Digital AI 模組

醫療（MOH + Synapxe）：

- **Note Buddy** — GenAI 臨床記錄助手（**5,000+ 醫護、67K 病歷，截至 2025-12**）
- HealthHub AI（公眾端，4.5/5 評分）
- AimSG（國家醫療影像 AI）
- SELENA+（糖尿病視網膜病變篩查）
- **ACE-AI**（慢病風險預測，2027 年初推廣至全部約 1,100 家 Healthier SG 診所）
- APOLLO（國家級 CT 冠脈 AI）
- Healthier SG × 數字孿生（慢性腎病管理）

> "AI-enhanced, not AI-decided — clinicians remain in the loop."
>
> AI 增強、不是 AI 決定——臨床醫生永遠在決策迴路中。
>
> — Ong Ye Kung, MOH Committee of Supply, 2026-03-05

交通（MOT + LTA + PSA + CAG）：

- **Punggol AV** 公共穿梭車（首批商業化 AV，3 條線路 2025-12 上線）
- CETRAN AV 國家測試中心
- **PSA Tuas Mega Port** = 2040s 全球最大全自動港
- **Changi 全球首張 ISO/IEC 42001 AI 治理認證**

建造與城市（MND + HDB + BCA + URA + JTC）：

- Built Environment AI Centre of Excellence（**BE AI CoE S$30M**）
- BCA Integrated Digital Delivery (IDD)
- SPRINT 程式——建造業 AI 政府採購綠色通道
- **HDB Tengah** = 首座智慧能源鎮 4.2 萬戶
- HDB AskJudy + MSO OneService

環境與水務（MSE + NEA + PUB）：

- NEA Weather Science Research Programme **S$25M**
- 登革熱 AI 預測 + 蚊媒控制
- PUB Smart Water Meter Programme + Joint Operations Centre + Bentley 漏水檢測

#### 抓手 5 — 政府自用（Procurement / 自身率先）

**國家直接做的事**：讓公務員率先用 AI，給企業看先例。

民事政府（GovTech）：

- **Pair**（公務員 AI 助手，**150K 公務員目標**）
- **Pair Search**（Hansard + 法院 + 立法可查）
- LaunchPad（3K MAU / 400 ideas）
- AI Trailblazers 1.0 + 2.0
- Litmus + Sentinel（AI 安全雙件套）
- **Agentspace** = 亞洲首例 air-gapped agentic AI

國防（MINDEF + DSTA + DSO + DIS）：

- **DIS — SAF Digital and Intelligence Service**（**2022 第四軍種成立**、2025 重組為 DCCOM + SAFC4DC）= 把 AI **寫進軍種結構本身**
- DIS × AI Singapore MoU + DIS Sentinel Programme
- DSTA × Shield AI（自主無人機）+ Thales AI Co-Lab + Anduril Lattice
- DSTA × RSN 計算機視覺艦船分類
- DSTA 自研 GenAI 工具 + DSTA × MIT CSAIL
- DSO × Mistral AI 國防 GenAI
- DSO × Alan Turing Institute MoU

家國安全（HTX + SPF + ICA）：

- HTX **Phoenix LLM**（自訓）
- HTX **H2RC 人形機器人中心 S$100M**（2026 Q2 啟動）
- HTX × Google Cloud / Microsoft / Mistral AI / Firmus / Singtel / ST Engineering
- SPF Anti-Scam Centre / Anti-Scam Command — RPA + AI
- SPF PolCam + GIBSON 機場機器人 + Smart Glasses 即時影片分析
- ICA Multi-Modal Biometrics System (MMBS) — 虹膜 + 人臉

#### 抓手 6 — 外交（國際治理 + 外資 + 標準制定）

**國家直接做的事**：讓外資把 AI 治理總部放新加坡。

這是 570 萬人口能撬動 G7 級話語權的唯一方式。

新加坡發起的全球性框架：

- **Singapore AI Safety Institute (AISI)** — **S$10M/yr**
- **Singapore Conference on AI / International Scientific Exchange on AI Safety I + II**
- **Singapore Consensus on Global AI Safety Research Priorities**（**100+ 參與者 / 11 個國家的 living document**）
- IMDA × Humane Intelligence 多元紅隊挑戰

ASEAN 區域：

- ASEAN Working Group on AI Governance (WG-AI)
- **ASEAN Guide on AI Governance and Ethics**（**10 國採納**）
- ASEAN Hanoi Declaration 2026（數字部長會議）

雙邊合作：

- US-Singapore Smart Cities Programme + Digital Economic Cooperation Roadmap
- ROK 雙邊 AI 合作
- EU-ASEAN AI 治理對話

軍事 / 安全：

- REAIM Asia Regional Consultations（新加坡共同主持）
- **REAIM Seoul Summit 2024**（**新加坡作為聯合主辦**）
- Bletchley Park / Seoul / Paris AI Safety Summits 全部參與

聯合國 + 全球：

- UN Global Dialogue on AI Governance + Independent International Scientific Panel
- AI Singapore × UNDP 全球 AI 素養

> 用 0.07% 的全球人口拿到 G7 級 AI 治理話語權——這是新加坡戰略最不可複製的部分。

### 3.3 風險管理三層

國家級 AI-native 必須**同時**做風險管理——這是公司尺度上簡單很多的事，到國家級別變得複雜。

#### 經濟風險層 — PMET 中產政治壓力（最大變數）

> "AI is a gamechanger. It can augment workers or displace them, depending on how work and jobs are redesigned."
>
> AI 是遊戲規則改變者。它可以增強工人，也可以替代他們——取決於工作和崗位如何重新設計。
>
> — Tan See Leng, MOM Committee of Supply, 2026-03-03

陳詩龍這句話不是泛泛而談，是對核心選民的直接安撫。MOM 反覆強調 _mid-career PMEs face highest risk_ 和 _job redesign for human-with-AI_。

這是 Smart Nation 時代不存在的政治變數。Smart Nation 時代失業風險落在藍領和基層文員；AI 時代第一刀砍向 PMET 中產——初級律師、初級會計師、初級分析師、初級工程師。**新加坡的政治穩定度，在很大程度上建立在 PMET 中產的安全感上**。

風險：可能催生限制 AI 替代人力的法規——會反噬整個戰略。

#### 社會風險層 — 弱勢群體保護

跨 MSF + MCCY 多場 COS 辯論提出的關切：

- AI 深偽性剝削威脅兒童和弱勢群體（Rachel Ong, MSF COS 2026-03-05）
- AI 自動化取代殘障人士傳統崗位——包裝、分揀、基礎行政、程式設計（Neo Kok Beng）
- Online Safety Commission 第一階段覆蓋兒童影像濫用
- ECDA Inclusive Support Programme (InSP)
- 馬來 / 穆斯林社群 AI 經濟準備度（Saktiandi Supaat, MCCY COS）

#### 安全風險層 — 關鍵基建 + 國家安全

- CSA Securing AI Systems Guidelines + Frontier AI Risk Advisory
- DIS / DSO / SPF / HTX 內部 AI 部署完全不公開
- AI Chatbots 用於青少年心理諮詢的不監管立場（許寶琨在 oral-answer-4051）：政府認為追蹤不可行，轉而推廣合法替代（mindline 1771、mindline.sg、CHAT）+ 應用商店年齡驗證

---

## 四、國家是企業的"包裝層"——七條傳導槓桿

把第三節的六個抓手重新排列——按它們解決企業的什麼瓶頸分類——你會看到一個常被忽視的事實：

> **新加坡戰略有兩層：政府自己做 AI-native 改造，同時把整個國家組織成企業 AI-native 轉型的"包裝層"。**

只看政府自己的 AI-native 改造（ACE-AI、Pair、DIS、PSA Tuas）不夠——政府部門只佔 GDP 一小部分。一個國家要被稱為 AI-native，它的企業群體也必須是 AI-native 的。Budget 2026 真正的賭注，是政府改造和企業放大**兩件事同時做**：政府自己 AI-native 是底座，國家級槓桿放大企業轉型速度是延伸。

### 七條傳導槓桿——把六抓手重新切片

| #   | 槓桿                                 | 解決企業的什麼瓶頸       | 對應抓手                                           |
| --- | ------------------------------------ | ------------------------ | -------------------------------------------------- |
| 1   | **Pull（資本回報）**                 | 企業 AI 轉型 ROI 拉不正  | 抓手 1（ECI、PSG）+ 抓手 2（Sandbox 讓風險可測量） |
| 2   | **Push（前進壓力）**                 | 企業不願動               | 抓手 4（NAIIP 10K + Champions of AI）              |
| 3   | **Talent（人才池）**                 | 企業找不到能用 AI 的人   | 抓手 3（AI Bilingual 100K + AIAP + 大學課改）      |
| 4   | **Infra（算力底座）**                | 企業自己買不起算力       | 抓手 1（EDB 大廠引進 + ECI + one-north）           |
| 5   | **Trust（部署邊界）**                | 企業不敢部署因為合規風險 | 抓手 2（IMDA + MAS + CSA + MINLAW）                |
| 6   | **Procurement（自身率先）**          | 企業看不到先例           | 抓手 5（GovTech + DIS + HTX）                      |
| 7   | **International（外資 + 治理總部）** | 企業不知道總部該放哪     | 抓手 6（AISI + Singapore Consensus + ASEAN）       |

### 關鍵觀察

**這 7 條裡只有第 6（政府自用）和第 7（國際外交）是國家直接做的。其他 5 條都是國家穿透到企業**。

這條論點為什麼獨特：

- 多數 AI 國家戰略文章把國家和企業並列分析，錯過了**巢狀關係**
- 新加坡是**兩條軌道同時跑**：政府自己做 AI-native 改造（ACE-AI、Pair、DIS、PSA Tuas），同時把整個國家組織成企業 AI-native 轉型的包裝層。兩件事都得做，缺一不可——政府自己的 AI-native 是包裝層能跑起來的執行底座，包裝層是政府改造的對外延伸
- 這解釋了為什麼新加坡能在沒算力 / 沒資料 / 沒模型的情況下仍可能領先——它賭的是**執行架構**：靠政府執行能力放大企業轉型速度。生產要素它都不佔優，所以只能賭執行

### 雙方原話的同構

把 Diana Hu 和 Mariam Jaafar 的話放在一起，會看到一個意外的同構：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> — Diana Hu, YC, 2026

> "If healthcare is truly a national AI mission, the goal cannot be incremental adoption."
>
> 如果醫療真的是國家 AI 使命，目標就不能只是漸進式採用。
>
> — Mariam Jaafar, MOH COS 2026-03-04

公司版的話和國家版的話**說的是同一件事**——這是這篇文章最有力的兩極同構證據。

---

## 五、觀察執行狀態

前面整理的是新加坡的執行架構——雙軌同時跑：政府自己做 AI-native 改造，同時把國家組織成企業 AI-native 轉型的放大器。剩下的問題就一個：**這套架構能不能執行下去？**

執行狀態比宏大敘事更值得看。下面是幾組長期跟蹤的數字和事件——它們怎麼走，決定了這個論點是被驗證還是被推翻。

### 政府軌道：自己 AI-native 是否真的跑起來

- **Pair 滲透**：150K 公務員目標裡，月活佔比走到多少？現狀是已上線，關鍵是滲透深度
- **ACE-AI 診所覆蓋**：2027 年初目標推廣至全部約 1,100 家 Healthier SG 診所——按時落地還是延期？
- **Note Buddy 擴散**：從 2025-12 的 5,000+ 醫護、67K 病歷，多久擴到全國醫生？這是 GenAI 臨床落地最早的樣本，擴散速度反映醫療系統對 AI 的接納節奏
- **DIS / HTX / DSO 安全側 AI**：不公開本身是觀察項——透明度是否有改善

### 企業軌道：槓桿是否真的拉得動企業

- **中小企業 AI 採用率**：從 4.2% 到 14.5% 是一年的拉昇。下一兩年是繼續翻倍走到 30%+，還是停在 15% 附近？翻倍則槓桿有效，停滯說明早期紅利吃完了
- **NAIIP 中段進度**：到 2027 中期，10K 企業 + 100K 工人推進到幾成？
- **Champions of AI 擴張**：名單是否覆蓋到中型企業，不只是大公司旗艦

### 雙軌耦合：政府用法能不能傳導到企業

- **公立 → 私立**：Note Buddy / SELENA+ / ACE-AI 這套打法被私立醫院 / 私人診所採用的時間差
- **Pair → 企業 AI 助手**：本土企業自建的 AI 助手是否參考 Pair 的框架（Litmus + Sentinel 安全雙件套是否成行業預設）
- **國家資料底座對企業開放**：HEALIX 是否對私營醫療 AI 開放介面；Virtual Singapore 是否成為城市 AI 創業的基礎平臺

### 國際：抓手 6 撐不撐得住

- **Singapore Consensus 影響力**：2026 更新後能否從 100+ 參與者 / 11 個國家擴到更多研究機構與政策網路？能否進入 G20 議程？
- **Agentic AI Governance Framework**：2026-01 全球首發後被多少國家 / 跨國企業引用？
- **AI 公司 APAC 總部動向**：OpenAI、Anthropic、其他大廠是否擴編新加坡職位 vs 撤回。這是市場對新加坡 AI 治理信譽最直接的投票

### 就業衝擊：最大的執行變數

第三節風險管理那裡說過——AI 時代第一刀砍向 PMET 中產，這是 Smart Nation 時代不存在的政治變數。整套戰略能不能執行下去，取決於這一刀砍下來的時候，再訓練和崗位重塑跟不跟得上。

- **PMET 起薪與招聘量**：初級律師 / 會計師 / 工程師的起薪和招聘量是否下降——這是 AI 替代效應最早的訊號
- **再訓練專案轉崗率**：CCP、SkillsFuture Mid-Career Credit、AI Bilingual 100K 完成者是否真的轉崗成功，還是繞一圈回到原崗位甚至離開勞動力市場
- **NTUC 政策訴求**：從"保護工人"升級到"限制 AI 部署"的臨界點——一旦越過，整套戰略要被重寫
- **PAP 選舉資料**：PMET 高比例選區的得票率變化，是觀察社會接受度的最硬訊號

### 反向訊號：哪些事情會推翻論點

- 就業衝擊越過臨界點，催生限制 AI 替代人力的法規
- 大企業（DBS、Singtel、PSA）跑得很快，中小企業完全掉隊——雙軌變兩極化

如果上面的數字普遍向好，"雙軌同時跑"這個論點就是真的；如果某一軌明顯掉隊，要麼論點要修正，要麼執行能力被高估了。

---

## 延伸閱讀

- [從數字化到 AI：新加坡的第二次國家級轉型](/singapore-ai-vs-smart-nation-two-transformations/) — 把 Budget 2026 和 2014 Smart Nation 並排對照
- [新加坡的 AI 馬六甲海峽在哪裡？](/singapore-ai-strategy-the-real-moat/) — AI 精煉樞紐策略的興起與侵蝕
- [新加坡 AI 政策演進全景](/evolution/) — 從 2014 智慧國家到 2026 全面 AI 戰略的五階段時間軸
- [國會 AI 焦點](/debates/) — Budget 2026 期間各部委 Committee of Supply 的完整辯論記錄
- [政策檔案](/policies/) — Budget 2026 官方檔案與中文翻譯

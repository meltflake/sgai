---
publishDate: 2026-04-25
updateDate: 2026-05-03
title: 'AIネイティブな企業と国家'
excerpt: '2026年、2種類のAIネイティブ実験が同時に進行しています——50人の企業と570万人の都市国家。両者を並べると見過ごされている事実が浮かびます：50人の企業と570万人の国家は同じAIネイティブ・アーキテクチャを使える。規模はレバレッジを決めるだけで、本質を決めない。シンガポールBudget 2026の真の賭けは、国家全体を国内企業のAIネイティブ転換のラッピングレイヤーにすることです。'
category: '観察'
lang: 'ja'
tags:
  - AIネイティブ
  - 戦略
  - 観察
  - シンガポール
  - Budget 2026
  - YC
author: 'シンガポール AI 観測'
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

> 本稿では、生まれながらにAIネイティブな企業と、AIネイティブ国家としてのシンガポールという2種類の実験を対比します。前者はYCが2026年の*How To Build A Company With AI From The Ground Up*で描いた50〜500人規模のサンプル、後者はBudget 2026が描く570万人規模のサンプルです。両者は同じアーキテクチャを使い、まったく異なるレバレッジを持ちます。

---

## 一、同じアーキテクチャ、2つのスケール

2026年、2種類のAIネイティブ実験が同時進行しています。

一つは50〜500人規模の企業——Anthropic、Cursor、Lovable——初日からAIをワークフローの中核に据えています。YCパートナーのDiana Huはこの方法論をこう定義します：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> AIは会社が使うツールであってはならない。会社が走るオペレーティングシステムであるべきだ。

もう一つは**570万人の都市国家**です。シンガポールはまずNAIS 2.0（National AI Strategy 2.0、2023年発表）でAIを国家戦略に据え、さらにBudget 2026でAIを予算案全体の戦略主軸に格上げしました。ウォン首相自らNational AI Councilを率い、11省庁のCommittee of SupplyがすべてAIを軸に展開しています。**戦略レベル、組織体制、財政投入の3つを合わせて見ると、シンガポールは「AIネイティブ国家になる」ことを明示的な国家戦略として掲げた唯一の主権国家です。**

この2つを並べると、見過ごされている事実が浮かびます：**50人の企業と570万人の国家は、同じAIネイティブ・アーキテクチャを使える。規模はレバレッジを決めるだけで、本質を決めない。**

### 3つのデータシグナル——なぜBudget 2026は本物なのか

- ウォン首相がBudget 2026閉会演説で**初めて**AIを予算案全体の戦略主軸に格上げ
- RIE2030予算**S$37B**（2025年12月公表、2026年4月発効）
- EDB誘致済み外資データセンター**S$30B超**（Microsoft S$5.5B、AWS S$12B、Google US$9B）
- 11省庁のCOSが協調してAIを議論（MDDI / MTI / MOH×3 / MOE / MOM / MOT / MND / MSE×3 / MSF×2 / MCCY）

### 操作的定義

組織がAIネイティブとはどういうことか？3つの判定基準：

1. **AIが意思決定のクリティカルパス上にある**：重要な判断はデフォルトでAIが先に出し、人間が例外審査をする
2. **ワークフローがAIをデフォルト前提として設計されている**：プロセス、データ、成果物はAIが主要な消費者として設計される
3. **インセンティブがAI活用に整合している**：昇進、採用、研修はAIを迂回する人力ヒーローを報いない

この3条件は50人の企業なら数ヶ月で再設計できますが、570万人の国家では公務員システム、民間セクター、全国民教育に浸透させなければなりません——**5〜10年は楽観的な見積もりです**。

企業はある方法でこの3条件を実装し、国家はまったく異なる方法で同じ3条件を実装しなければなりません。シンガポールの賭けは計算能力/データ/モデルではありません——これら3つの生産要素では優位に立てません。賭けているのは実行アーキテクチャです：**政府自身がAIネイティブ改革を行い、同時に国家レベルのレバレッジで国内企業のAIネイティブ転換を加速する——両方やらなければならない**。これが本稿の論証の核心です。

---

## 二、AIネイティブ企業とは何か

YCの2026年版*How To Build A Company With AI From The Ground Up*が方法論を明確に整理しています。本節ではDiana Huの5つの柱を借用し、Jack DorseyのBlock社における中間管理職廃止の組織設計を加えて、50人規模の企業がAIネイティブになるための完全で実行可能なチェックリストを構成します。

### 1. クローズドループシステム

これが最も重要な柱です。Dianaはサイバネティクスの概念を使います：

- **オープンループ**：決定→実行→体系的に測定しない→調整しない。本質的にロスが生じる
- **クローズドループ**：自己調節システム。継続的に出力を監視し、プロセスを調整。走れば走るほど精度が上がる

旧世界の企業はほぼすべてオープンループでした：決定、実行、結果を体系的に測定するとは限らず、プロセスは自己調整しない。AIネイティブ企業の第一原理は、すべての重要なプロセスをクローズドループにすることです——成果物をAIに入れ、AIが完全なコンテキストを見て、次のステップを自動調整する。

### 2. 組織がAIに対してクエリ可能

クローズドループを機能させるには、組織が**AIにとってクエリ可能**でなければなりません。具体的には：

- すべての会議をAI notetakerで記録
- DMやメールを減らし、エージェントをすべてのコミュニケーションチャネルに埋め込む
- 自社ダッシュボードにすべてのデータを接続：収益、営業、エンジニアリング、採用、オペレーション——すべて
- エージェントにLinear、Slack、Pylon、GitHub、Notion、営業通話録音、デイリースタンドアップへのアクセスを与える

核心原則：**モデルに全能力を発揮させるには、従業員と同等レベルのコンテキストを与えなければならない**。

### 3. AIソフトウェアファクトリー

ソフトウェア開発モデルの書き換え：

- **人間**：スペックを書き、成功を定義するテストセットを書く
- **エージェント**：実装コードを生成し、テストがパスするまで反復
- **人間**：出力が合格かどうかを判断

極端な形態：リポジトリに**手書きコードはなく、スペックとテストだけ**。Strong Computeがこのアプローチの実践例です——エージェントに確率的満足閾値に達するまで反復させ、人間がコードを書いたりレビューしたりするステップの排除を目指しています。

### 4. 中間管理職の廃止 / 3つの従業員アーキタイプ

旧世界では中間管理者が組織内で情報を上下に伝達する必要がありました。AIネイティブ企業では、インテリジェンスレイヤーがこの機能を代替します——人間のミドルウェアはほぼ不要になります。

Jack DorseyのBlock社での発言：

> "If you keep the same org chart and management structure, you've missed the shift entirely. The company itself has to be rebuilt as an intelligence layer with humans at the edge guiding it rather than routing information through it."
>
> 旧い組織図と管理構造を維持するなら、この変革を完全に見逃している。企業自体をインテリジェンスレイヤーとして再構築し、人間は情報を中継するのではなく、エッジに立って導く存在にならなければならない。

将来の企業には3つの役割だけが残ります：

| 役割                       | 定義                       | 主な特徴                                                           |
| -------------------------- | -------------------------- | ------------------------------------------------------------------ |
| **IC（Builder/Operator）** | 直接手を動かし、運営する   | エンジニアに限らない——会議にはプロトタイプを持参、PPTは持参しない  |
| **DRI**                    | 戦略と顧客成果に責任を持つ | 一人一成果、逃げ場なし                                             |
| **AI Founder**             | 自らビルドし、自ら示す     | 創業者が最前線に立って能力の跳躍を実演。AI戦略を外注してはならない |

### 5. ヘッドカウントをトークンで代替

リソース観の書き換え：

- AIツールを使う1人 ＝ 旧時代のエンジニアリングチーム丸ごと
- エンジニアリング、デザイン、HR、管理部門はすべて大幅にスリム化すべき
- **不快なほど高いAPIコストを受け入れるべき**——それが代替するのは、はるかに高価で肥大化したヘッドカウントコスト
- 最高の企業はトークンを使い切る

---

この5条件は50人の企業なら、それぞれ数ヶ月で再設計可能です。

**では570万人の国家ではどうなるでしょうか？**

---

## 三、AIネイティブ国家とは何か

シンガポールBudget 2026が、現時点で唯一の包括的な回答を提示しています。本節ではまずトップレベルの物語を見て、次に6つのレバーですべての省庁の具体的な実装を分類展開し、最後に3層のリスク管理を見ます。

### 3.1 トップレベルの物語：省庁テーマから戦略主軸へ

#### シグナル1 — 政治的物語のレベル引き上げ

ウォン首相は2026年3月6日のBudget閉会演説で**初めて**AIを予算案全体の戦略主軸に格上げし、予算案全体を世界の*"more contested, more fragmented and ultimately, more dangerous"*な状況に対するシンガポールの国家行動計画として位置づけました——AIはその中核的な戦略的切り札です。

#### シグナル2 — 組織レベルの引き上げ

ウォン首相自らNational AI Councilの議長を務め、MDDIに単独では任せていません。これはシンガポールが国家級課題を認定する際のシグネチャー的な動作です：**重要課題を特定の省庁に委ねず、首相府に直接配置する**。

11省庁が同時にAIテーマを軸にCommittee of Supply討論を展開したのは、シンガポールCOS史上AI議題が最も集中した回です。

#### シグナル3 — 財政レベルの引き上げ

- RIE2030予算**S$37B**（2025年12月公表、2026年4月発効）
- 公共AI研究投資**S$1B超**（2026〜2030年）
- EIS 400%税控除のAI拡張（YA 2027-28、企業当たり年間S$5万上限）

この3つのシグナルを重ねると＝**国家レベルのAI Founderモデルが成立**。Josephine Teoが一人でMDDI、IMDA、国際AIガバナンスの3ラインを統括——確認できた57件の公式大臣スピーチのうち23件が彼女のものです。

### 3.2 6つのレバー——国家レベルAIネイティブの全体図

Budget 2026＋各省庁＋各法定機関のすべてのAI関連政策と実装プロジェクトを、AI導入経路に沿って6つのレバーに分類します：**インフラ、ガバナンス、人材、応用、政府自身の利用、外交**。

省庁別の分類（MDDI / IMDA / MAS / MOH / ...）よりも、読者が全体像を一目で把握できます。各レバーは複数の省庁にまたがっており、つなげて初めて完全な実行パイプラインになります。

#### レバー1 — インフラ（データ＋計算能力＋物理インフラ）

**国家が直接行うこと**：企業単独では購入できない計算能力＋データ基盤を構築する。

外資誘致の計算能力（EDB）：

- Microsoft データセンター**S$5.5B**
- AWS **S$12B**
- Google **US$9B / S$11.6B + DeepMind Lab**
- NVIDIA × SIT Centre for AI、× Singtel、× AI Accelerator
- OpenAI シンガポールAPAC地域本部
- Anthropic シンガポールCountry Lead採用（2026年）

国内補助の計算能力：

- Enterprise Compute Initiative (ECI) **S$150M**——企業の計算能力購入への直接補助金
- one-north AI Park / Kampong AI（MOF）

資金プラットフォーム：

- Anchor Fund @ 65 第2弾**S$1.5B**
- Future Sectors Development Fund **S$1.5B**
- EQDP拡張（**S$6.5B**規模へ）

国家レベルのデータ基盤：

- MOH/Synapxe **HEALIX** ＝ 国家医療データ＋AIインフラ
- URA **Virtual Singapore** ＝ 国家レベルのデジタルツイン
- BCA **BETC Grant S$100M** ＝ 建設業デジタルインフラ
- JTC **Punggol Digital District + Open Digital Platform (ODP)** ＝ スマート地区全域

国土安全保障側の計算能力：

- HTX **NGINE** — NVIDIA B200 DGX SuperPOD（国土安全保障自前の計算能力）

#### レバー2 — ガバナンス（ルール＋サンドボックス＋法律）

**国家が直接行うこと**：企業が安心してデプロイできるようにする。企業がAIをデプロイしない最大の障壁はコンプライアンスリスクです——技術はとうに十分です。

汎用ガバナンス枠組み（IMDA）：

- Model AI Governance Framework（2019年）
- AI Verify（2022年）+ **AI Verify Sandbox**（10社以上の多国籍大企業が参加）
- GenAI Eval Sandbox + GenAI Sandbox 2.0
- 生成AIガバナンス枠組み（2024年）
- **Agentic AI Governance Framework**（2026年1月22日ダボス、**世界初**）
- Trusted Data Sharing Framework + DPTM SS 714:2025アップグレード

金融業ガバナンス5層スタック（MAS）：

- FEAT Principles（公平性/倫理/説明責任/透明性）
- Veritas Initiative v1 / v2 / v3
- Project MindForge（24機関＋Microsoft / AWS / Google / Nvidia全参加）
- AI Risk Management Guidelines
- BuildFin.ai

サイバーセキュリティガバナンス（CSA）：

- Securing AI Systems Guidelines + Companion Guide
- Securing Agentic AI補遺
- Frontier AI Risk Advisory
- Cyber Trust Mark — AIセキュリティ次元

法的ガバナンス（MINLAW + IPOS）：

- **Copyright Act §244** ＝ AI訓練免責（**日本と並び世界で最も寛容**）
- IPOS「When Code Creates」レポート — AI Authorshipの立場
- **出力側は厳格管理**：OCHA + Elections Bill 2024（ディープフェイク禁止）+ Criminal Law Bill 2025（AIによる親密画像を刑事罰化）+ Online Safety (Relief and Accountability) Bill 2025

> **ガバナンスの哲学**：訓練は寛容＋出力は厳格管理。日本とシンガポールはこれを実現している世界で唯二の国です——企業に明確で予測可能な境界線を提供しています。

#### レバー3 — 人材（教育＋研修＋転換）

**国家が直接行うこと**：AIを使える人材を企業が見つけられるようにする。

全国民レベル（MDDI）：

- AI Bilingual **10万人労働者計画**（第1弾は会計と法務、2026年上半期開始、ISCA / SAL / SCCA連携）
- National AI Literacy Programme

専門家レベル（IMDA + AISG）：

- TechSkills Accelerator (TeSA) AI拡張版
- AISG **AI Apprenticeship Programme (AIAP)**：16期410名以上の研修生、900件以上の応募、新規800名枠
- AISG **100E Programme**（各S$15万の共同投資）

教育システムレベル（MOE + NIE）：

- SLS（Student Learning Space）AIツール群8カテゴリ
- GenAI使用ガイドライン + AI Ethics Framework
- EdTech Masterplan 2030
- NIE AI@NIE + Certificate in AI for Education
- Microsoft Elevate × Singapore（高等教育AI普及）
- NUS / NTU / SMU / SUTD 全面的AI課程改革

財政補助レベル（SSG + WSG）：

- SkillsFuture AIコース**50% / 70%段階的補助**
- Mid-Career S$4,000 Credit
- SkillsFuture Level-Up Programme
- WSG × SSG統合 ＝ ワンストップのスキル・就業プラットフォーム

中年再訓練レベル（MOM）：

- Job Redesign+
- Career Conversion Programme (CCP)
- Enterprise Workforce Transformation Package (EWTP)
- NTUC × AI労働者保護

> "Not all of us can be AI engineers. But we can be 'bilingual' in AI in our own areas of expertise."
>
> 全員がAIエンジニアになれるわけではありません。しかし、自分の専門分野でAI「バイリンガル」になることはできます。
>
> — Josephine Teo, MDDI Committee of Supply, 2026-03-02

#### レバー4 — 応用（産業＋公共サービスの実装）

**国家が直接行うこと**：11省庁で同時にフラッグシップアプリケーションを展開する。

産業フラッグシップ（MTI）：

- National AI Missions（4大先行産業）
- AI Centres of Excellence
- Embodied AI R&D
- Industry Transformation Maps (ITM) におけるAIアップグレード

研究フラッグシップ（A\*STAR）：

- A\*STAR CFAR 5大研究柱
- AI Manufacturing 2030（Mencastプロペラ）
- AI材料スクリーニング50〜100倍加速
- GIS + SingHealth ヘルスAI連携
- National Multimodal LLM Programme **S$70M**

地域LLMフラッグシップ（AISG）：

- SEA-LION v3 / v4 / Guard
- SEALD（データセット）

企業普及（IMDA + ESG）：

- **NAIIP — National AI Impact Programme**：1万企業＋10万労働者 / 2026〜2029年
- Champions of AI（フラッグシップ企業プログラム）
- ESG PSG AI補助率**30% → 50%**
- ESG SMEs Go Digital AIモジュール

医療（MOH + Synapxe）：

- **Note Buddy** — GenAI臨床記録アシスタント（**5,000名以上の医療従事者、6.7万件のカルテ、2025年12月時点**）
- HealthHub AI（一般向け、4.5/5評価）
- AimSG（国家医療画像AI）
- SELENA+（糖尿病性網膜症スクリーニング）
- **ACE-AI**（慢性疾患リスク予測、2027年初頭にHealthier SG全約1,100診療所へ展開予定）
- APOLLO（国家レベルCT冠動脈AI）
- Healthier SG × デジタルツイン（慢性腎臓病管理）

> "AI-enhanced, not AI-decided — clinicians remain in the loop."
>
> AI強化であって、AI決定ではない——臨床医は常に意思決定ループの中にいます。
>
> — Ong Ye Kung, MOH Committee of Supply, 2026-03-05

交通（MOT + LTA + PSA + CAG）：

- **Punggol AV** 公共シャトル（初の商業化AV、3路線2025年12月開始）
- CETRAN AV国家テストセンター
- **PSA Tuas Mega Port** ＝ 2040年代世界最大の完全自動港
- **チャンギ空港が世界初のISO/IEC 42001 AIガバナンス認証取得**

建設・都市（MND + HDB + BCA + URA + JTC）：

- Built Environment AI Centre of Excellence（**BE AI CoE S$30M**）
- BCA Integrated Digital Delivery (IDD)
- SPRINTプログラム——建設業AI政府調達グリーンチャネル
- **HDB Tengah** ＝ 初のスマートエネルギータウン4.2万戸
- HDB AskJudy + MSO OneService

環境・水務（MSE + NEA + PUB）：

- NEA Weather Science Research Programme **S$25M**
- デング熱AI予測＋蚊媒介制御
- PUB Smart Water Meter Programme + Joint Operations Centre + Bentley漏水検知

#### レバー5 — 政府自身の利用（調達/自ら率先）

**国家が直接行うこと**：公務員が率先してAIを使い、企業に先例を示す。

民政府（GovTech）：

- **Pair**（公務員AIアシスタント、**15万人の公務員を目標**）
- **Pair Search**（議事録＋裁判所＋法令を検索可能に）
- LaunchPad（MAU 3K / アイデア400件）
- AI Trailblazers 1.0 + 2.0
- Litmus + Sentinel（AIセキュリティのペアツール）
- **Agentspace** ＝ アジア初のエアギャップ型エージェントAI

国防（MINDEF + DSTA + DSO + DIS）：

- **DIS — SAF Digital and Intelligence Service**（**2022年に第4の軍種として設立**、2025年にDCCOM + SAFC4DCに再編）＝ AIを**軍種構造そのものに組み込む**
- DIS × AI Singapore MoU + DIS Sentinel Programme
- DSTA × Shield AI（自律型ドローン）+ Thales AI Co-Lab + Anduril Lattice
- DSTA × RSN コンピュータビジョン艦船分類
- DSTA自社開発GenAIツール + DSTA × MIT CSAIL
- DSO × Mistral AI 国防GenAI
- DSO × Alan Turing Institute MoU

国土安全保障（HTX + SPF + ICA）：

- HTX **Phoenix LLM**（自社訓練）
- HTX **H2RC ヒューマノイドロボットセンター S$100M**（2026年Q2開始）
- HTX × Google Cloud / Microsoft / Mistral AI / Firmus / Singtel / ST Engineering
- SPF Anti-Scam Centre / Anti-Scam Command — RPA + AI
- SPF PolCam + GIBSON空港ロボット + Smart Glassesリアルタイム映像分析
- ICA Multi-Modal Biometrics System (MMBS) — 虹彩＋顔認証

#### レバー6 — 外交（国際ガバナンス＋外資＋基準策定）

**国家が直接行うこと**：外資にAIガバナンス本部をシンガポールに置かせる。

これは人口570万人がG7級の発言力を得るための唯一の方法です。

シンガポール発のグローバル枠組み：

- **Singapore AI Safety Institute (AISI)** — **年間S$10M**
- **Singapore Conference on AI / International Scientific Exchange on AI Safety I + II**
- **Singapore Consensus on Global AI Safety Research Priorities**（**11カ国署名、米中含む**）
- IMDA × Humane Intelligence 多様性レッドチームチャレンジ

ASEAN地域：

- ASEAN Working Group on AI Governance (WG-AI)
- **ASEAN Guide on AI Governance and Ethics**（**10カ国採択**）
- ASEAN Hanoi Declaration 2026（デジタル大臣会議）

二国間協力：

- US-Singapore Smart Cities Programme + Digital Economic Cooperation Roadmap
- 韓国二国間AI協力
- EU-ASEAN AIガバナンス対話

軍事/安全保障：

- REAIM Asia Regional Consultations（シンガポール共同主催）
- **REAIM Seoul Summit 2024**（**シンガポールが共同ホスト**）
- Bletchley Park / Seoul / Paris AI Safety Summits全参加

国連＋グローバル：

- UN Global Dialogue on AI Governance + Independent International Scientific Panel
- AI Singapore × UNDP グローバルAIリテラシー

> グローバル人口の0.07%でG7級のAIガバナンス発言力を獲得——これはシンガポール戦略の中で最も再現困難な部分です。

### 3.3 リスク管理の3層

国家レベルのAIネイティブは、リスク管理を**同時に**行わなければなりません。企業スケールではシンプルなことが、国家レベルでは複雑になります。

#### 経済リスク層 — PMET中間層の政治的圧力（最大の変数）

> "AI is a gamechanger. It can augment workers or displace them, depending on how work and jobs are redesigned."
>
> AIはゲームチェンジャーです。労働者を強化することも、代替することもできる。それは仕事と職をどう再設計するかにかかっている。
>
> — Tan See Leng, MOM Committee of Supply, 2026-03-03

タン・シーレン大臣のこの発言は一般論ではなく、中核的支持層への直接的な安心材料の提供です。MOMは*mid-career PMEs face highest risk*と*job redesign for human-with-AI*を繰り返し強調しています。

これはSmart Nation時代には存在しなかった政治的変数です。Smart Nation時代の失業リスクはブルーカラーと一般事務職に降りかかりました。AI時代の最初の一刀はPMET中間層に向かいます——ジュニア弁護士、ジュニア会計士、ジュニアアナリスト、ジュニアエンジニア。**シンガポールの政治的安定は、PMET中間層の安心感の上に大きく成り立っています。**

リスク：AIによる人員代替を制限する規制が生まれる可能性——戦略全体を蝕むことになります。

#### 社会リスク層 — 脆弱な層の保護

MSF + MCCYの複数のCOS討論で提起された懸念：

- AIディープフェイクによる性的搾取が子どもと脆弱な層を脅かす（Rachel Ong, MSF COS 2026-03-05）
- AI自動化が障害者の伝統的な職——梱包、仕分け、基礎事務、プログラミング——を代替（Neo Kok Beng）
- Online Safety Commission第1フェーズは子どもの画像悪用をカバー
- ECDA Inclusive Support Programme (InSP)
- マレー/ムスリムコミュニティのAI経済への準備度（Saktiandi Supaat, MCCY COS）

#### セキュリティリスク層 — 重要インフラ＋国家安全保障

- CSA Securing AI Systems Guidelines + Frontier AI Risk Advisory
- DIS / DSO / SPF / HTX内部AI展開は完全非公開
- 青少年のメンタルヘルス向けAIチャットボットの非規制スタンス（Ong Ye Kung, oral-answer-4051）：政府は追跡は実行不可能と判断し、合法的代替手段の推進に転換（mindline 1771、mindline.sg、CHAT）＋アプリストアの年齢確認

---

## 四、国家は企業の「ラッピングレイヤー」——7つの伝達レバー

第3節の6つのレバーを並べ替え——企業のどのボトルネックを解決するかで分類——すると、よく見過ごされる事実が浮かびます：

> **シンガポール戦略には2つの層があります：政府自身のAIネイティブ改革と、国家全体を企業のAIネイティブ転換のラッピングレイヤーとして組織すること。**

政府自身のAIネイティブ改革（ACE-AI、Pair、DIS、PSA Tuas）だけを見ていては不十分です——政府部門はGDPの一部にすぎません。国家がAIネイティブと呼ばれるには、企業群もAIネイティブでなければなりません。Budget 2026の真の賭けは、政府改革と企業増幅を**同時に行うこと**です：政府自身のAIネイティブは基盤であり、国家レベルのレバレッジによる企業転換速度の増幅はその延長です。

### 7つの伝達レバー——6レバーの再スライス

| #   | レバー                                   | 企業のどのボトルネックを解決するか       | 対応するレバー                                            |
| --- | ---------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| 1   | **Pull（資本リターン）**                 | AI転換のROIが合わない                    | レバー1（ECI、PSG）+ レバー2（Sandboxでリスク測定可能に） |
| 2   | **Push（前進圧力）**                     | 企業が動かない                           | レバー4（NAIIP 1万 + Champions of AI）                    |
| 3   | **Talent（人材プール）**                 | AIを使える人が見つからない               | レバー3（AI Bilingual 10万 + AIAP + 大学課程改革）        |
| 4   | **Infra（計算基盤）**                    | 自力で計算能力を購入できない             | レバー1（EDB大手誘致 + ECI + one-north）                  |
| 5   | **Trust（デプロイ境界）**                | コンプライアンスリスクでデプロイできない | レバー2（IMDA + MAS + CSA + MINLAW）                      |
| 6   | **Procurement（自ら率先）**              | 先例が見えない                           | レバー5（GovTech + DIS + HTX）                            |
| 7   | **International（外資+ガバナンス本部）** | 本部をどこに置くべきかわからない         | レバー6（AISI + Singapore Consensus + ASEAN）             |

### 重要な観察

**この7つのうち、第6（政府自身の利用）と第7（国際外交）だけが国家が直接行うものです。他の5つは国家が企業に浸透するものです。**

この論点がユニークな理由：

- 多くのAI国家戦略の記事は国家と企業を並列分析しますが、**入れ子関係**を見落としています
- シンガポールは**2つのトラックを同時に走らせています**：政府自身のAIネイティブ改革（ACE-AI、Pair、DIS、PSA Tuas）を行い、同時に国家全体を企業のAIネイティブ転換のラッピングレイヤーとして組織する。両方やらなければならず、どちらが欠けても成り立ちません——政府自身のAIネイティブはラッピングレイヤーが機能するための実行基盤であり、ラッピングレイヤーは政府改革の対外延長です
- これが、計算能力/データ/モデルのいずれも持たないシンガポールが依然としてリードし得る理由を説明します——賭けているのは**実行アーキテクチャ**です。政府の実行力で企業転換速度を増幅する。生産要素では優位に立てないからこそ、実行に賭けるしかないのです

### 双方の発言の同型性

Diana HuとMariam Jaafar（MOH COS）の発言を並べると、意外な同型性が見えます：

> "It should not be a tool your company just uses. It should be the operating system your company runs on."
>
> — Diana Hu, YC, 2026

> "If healthcare is truly a national AI mission, the goal cannot be incremental adoption."
>
> 医療が真に国家AIミッションであるなら、目標は漸進的な採用であってはならない。
>
> — Mariam Jaafar, MOH COS 2026-03-04

企業版の発言と国家版の発言は**同じことを言っています**——これが本稿で最も強力な二極同型の証拠です。

---

## 五、実行状況の観察

前節までに整理したのはシンガポールの実行アーキテクチャです——デュアルトラック同時走行：政府自身のAIネイティブ改革と、国家を企業のAIネイティブ転換の増幅器として組織すること。残る問いは一つだけです：**このアーキテクチャは実行し続けられるのか？**

実行状況はグランドナラティブよりも見る価値があります。以下は長期追跡すべきいくつかの数字と事象です——これらの推移が、この論点を検証するか覆すかを決めます。

### 政府トラック：自身のAIネイティブは本当に動いているか

- **Pair浸透度**：15万公務員という目標に対し、月間アクティブ率はどこまで到達したか？すでにローンチ済み、鍵は浸透の深さ
- **ACE-AI診療所カバレッジ**：2027年初頭にHealthier SG全約1,100診療所への展開目標——予定通りか遅延か？
- **Note Buddy拡散**：2025年12月時点の5,000名以上の医療従事者、6.7万件のカルテから、全国の医師への展開にどれだけかかるか？これはGenAI臨床実装の最も早期のサンプルであり、拡散速度は医療システムのAI受容ペースを反映
- **DIS / HTX / DSO安全保障側AI**：非公開であること自体が観察項目——透明性は改善されるか

### 企業トラック：レバレッジは本当に企業を動かしているか

- **中小企業AI導入率**：4.2%から14.5%は1年での引き上げ。次の1〜2年で30%超に倍増するか、15%付近で停滞するか？倍増すればレバレッジは有効、停滞すれば初期ボーナスが尽きた証拠
- **NAIIP中間進捗**：2027年中期までに、1万企業＋10万労働者の目標はどこまで進んだか？
- **Champions of AI拡張**：リストは中堅企業まで広がっているか、大企業フラッグシップのみに留まっていないか

### デュアルトラックの結合：政府の使い方は企業に伝播しているか

- **公立→私立**：Note Buddy / SELENA+ / ACE-AIのアプローチが私立病院/プライベートクリニックに採用されるまでのタイムラグ
- **Pair→企業AIアシスタント**：国内企業の自社AIアシスタントはPairの枠組みを参照しているか（Litmus + Sentinelのセキュリティペアツールが業界デフォルトになるか）
- **国家データ基盤の企業開放**：HEALIXは民間医療AIにインターフェースを開放するか、Virtual Singaporeは都市AI起業の基盤プラットフォームになるか

### 国際：レバー6は持ちこたえるか

- **Singapore Consensus署名国**：11カ国（米中含む）から何カ国に拡大するか？G20入りできるか？
- **Agentic AI Governance Framework**：2026年1月の世界初発表後、何カ国/何社の多国籍企業が引用しているか？
- **AI企業APAC本部の動向**：OpenAI、Anthropic、その他大手はシンガポールのポジションを拡大しているか、撤退しているか。これはシンガポールのAIガバナンスの信頼性に対する市場からの最も直接的な投票

### 雇用への衝撃：最大の実行変数

第3節のリスク管理で述べた通り、AI時代の最初の一刀はPMET中間層に向かいます。これはSmart Nation時代には存在しなかった政治的変数です。この戦略全体が実行を続けられるかどうかは、この一刀が振り下ろされたとき、再訓練と職の再設計が追いつくかどうかにかかっています。

- **PMET初任給と採用量**：ジュニア弁護士/会計士/エンジニアの初任給と採用量は低下しているか——AI代替効果の最も早期のシグナル
- **再訓練プログラムの転職率**：CCP、SkillsFuture Mid-Career Credit、AI Bilingual 10万人の修了者は本当に転職に成功しているか、それとも元の職に戻るか労働市場から離脱するか
- **NTUCの政策要求**：「労働者保護」から「AIデプロイ制限」への臨界点——一度越えると、戦略全体の書き直しが必要
- **PAP選挙データ**：PMET高比率選挙区の得票率変化は、社会的受容度を観察する最もハードなシグナル

### 反転シグナル：何がこの論点を覆すか

- 雇用への衝撃が臨界点を越え、AIによる人員代替を制限する規制が生まれる
- 大企業（DBS、Singtel、PSA）は急速に進む一方、中小企業は完全に脱落——デュアルトラックが二極化に

上記の数字が全体的に好調であれば、「デュアルトラック同時走行」という論点は正しいことになります。いずれかのトラックが明らかに脱落すれば、論点を修正する必要があるか、実行力が過大評価されていたことになります。

---

## 参考

- [デジタル化からAIへ：シンガポールの第二の国家級変革](/singapore-ai-vs-smart-nation-two-transformations/) — Budget 2026と2014年Smart Nationの並列比較
- [シンガポールの「AIマラッカ海峡」はどこにあるのか？](/singapore-ai-strategy-the-real-moat/) — AI精製ハブ戦略の台頭と侵食
- [シンガポールAI政策進化の全景](/evolution/) — 2014年Smart Nationから2026年全面AI戦略までの5段階タイムライン
- [議会AIフォーカス](/debates/) — Budget 2026期間中の各省庁Committee of Supplyの完全討論記録
- [政策文書](/policies/) — Budget 2026公式文書と翻訳

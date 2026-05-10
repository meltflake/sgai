export interface EcosystemMilestone {
  date: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  sourceUrl?: string;
}

export interface EcosystemLeader {
  name: string;
  title?: string;
  titleEn?: string;
  titleJa?: string;
  personId?: string;
}

export interface EcosystemSubItem {
  name: string;
  nameEn?: string;
  nameJa?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  url?: string;
  entityId?: string;
}

export interface EcosystemSource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  url: string;
  date?: string;
}

export interface EcosystemFurtherReading {
  label: string;
  labelEn?: string;
  labelJa?: string;
  url: string;
}

export type EcosystemEntityType =
  | 'agency'
  | 'institute'
  | 'university'
  | 'platform'
  | 'product'
  | 'program'
  | 'partner'
  | 'initiative';

export type EcosystemStatus = 'active' | 'archived' | 'planned';

export interface EcosystemEntity {
  name: string;
  nameEn?: string;
  nameJa?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  url?: string;

  id?: string;
  entityType?: EcosystemEntityType;
  status?: EcosystemStatus;

  founded?: string;
  headquarters?: string;
  headquartersEn?: string;
  headquartersJa?: string;
  parentOrg?: string;
  parentOrgEn?: string;
  parentOrgJa?: string;
  parentEntityId?: string;
  ministry?: string;
  ministryEn?: string;
  ministryJa?: string;
  scale?: string;
  scaleEn?: string;
  scaleJa?: string;
  leaders?: EcosystemLeader[];

  summary?: string;
  summaryEn?: string;
  summaryJa?: string;
  whatItIs?: string;
  whatItIsEn?: string;
  whatItIsJa?: string;
  aiRelevance?: string;
  aiRelevanceEn?: string;
  aiRelevanceJa?: string;
  singaporeRelevance?: string;
  singaporeRelevanceEn?: string;
  singaporeRelevanceJa?: string;

  milestones?: EcosystemMilestone[];
  products?: EcosystemSubItem[];
  partners?: EcosystemSubItem[];

  relatedLeverNumbers?: number[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedEntityIds?: string[];
  championPersonIds?: string[];

  sources?: EcosystemSource[];
  furtherReading?: EcosystemFurtherReading[];
  updated?: string;

  /** Auto-discovery: marks entries added by the refresh pipeline that need
   * human review before going live. Listing pages should hide entries with
   * `_pendingReview: true`; detail pages render with a "Pending review" badge. */
  _pendingReview?: boolean;
  /** Free-form note from the refresh pipeline about why this entry was added
   * (e.g. confidence reason, source URL trail). Surfaced in the PR body. */
  discoveryNote?: string;
  /** YYYY-MM-DD; the date this entity was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates" entry.
   *  Set automatically by emit pipelines; manual additions must set it too.
   *  Old records may be undefined → not surfaced. */
  addedAt?: string;
}

export interface EcosystemCategory {
  name: string;
  nameEn?: string;
  nameJa?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  entities: EcosystemEntity[];
}

export const ecosystemCategories: EcosystemCategory[] = [
  {
    name: '核心枢纽',
    nameJa: 'コアハブ',
    nameEn: 'Core Hub',
    icon: '🇸🇬',
    description: '统筹新加坡国家级 AI 战略落地的核心机构',
    descriptionJa: 'シンガポール国家AI戦略の実装を統括する中核機構',
    descriptionEn: 'The core institution coordinating execution of Singapore’s national AI strategy',
    entities: [
      {
        id: 'ai-singapore',
        name: 'AI Singapore (AISG)',
        nameEn: 'AI Singapore (AISG)',
        description: '新加坡国家级 AI 计划，统筹 SEA-LION、AIAP、TagUI、AI Verify 等关键产物',
        descriptionJa: 'シンガポール国家AI計画で、SEA-LION、AIAP、TagUI、AI Verify などの主要な成果物を統括',
        descriptionEn:
          "Singapore's national AI programme; the umbrella behind SEA-LION, AIAP, TagUI, AI Verify and other flagship outputs",
        url: 'https://aisingapore.org/',
        entityType: 'institute',
        status: 'active',
        founded: '2017-05',
        headquarters: '新加坡国立大学校园（COM3）',
        headquartersJa: 'シンガポール国立大学キャンパス（COM3）',
        headquartersEn: 'NUS School of Computing (COM3), Singapore',
        parentOrg: '新加坡国立研究基金会（NRF）托管',
        parentOrgJa: 'シンガポール国立研究基金会（NRF）が管理',
        parentOrgEn: 'Hosted by the National Research Foundation (NRF)',
        ministry: '总理公署 / SNDGO',
        ministryJa: '首相官房 / SNDGO',
        ministryEn: 'Prime Minister’s Office / SNDGO',
        scale: '5 年 1.5 亿新元启动资金；累计培养 AIAP 学徒 500+；SEA-LION 下载量百万级',
        scaleJa:
          '5年間で1.5億シンガポール・ドルの始動資金、累計AIAP見習い500人以上を育成、SEA-LIONダウンロード数は百万レベル',
        scaleEn:
          'S$150 million seed funding over 5 years; 500+ AIAP apprentices to date; SEA-LION downloads in the millions',
        leaders: [
          {
            name: 'Ho Teck Hua',
            title: '创始执行主席',
            titleJa: '創設執行会長',
            titleEn: 'Founding Executive Chairman',
            personId: 'ho-teck-hua',
          },
          {
            name: 'Mohan Kankanhalli',
            title: '副执行主席（人才）',
            titleJa: '副執行会長（人材）',
            titleEn: 'Deputy Executive Chairman (Talent)',
            personId: 'mohan-kankanhalli',
          },
          {
            name: 'Luke Ong',
            title: '副执行主席（应用与产业）兼首席科学家',
            titleJa: '副執行会長（応用・産業）兼最高科学責任者',
            titleEn: 'Deputy Executive Chairman (Applied & Translational) and Chief Scientist',
            personId: 'luke-ong',
          },
          {
            name: 'Phoon Kok Kwang',
            title: '副执行主席（研究）',
            titleJa: '副執行会長（研究）',
            titleEn: 'Deputy Executive Chairman (Research)',
            personId: 'phoon-kok-kwang',
          },
          {
            name: 'Bryan Low',
            title: 'AI 研究总监',
            titleJa: 'AI研究ディレクター',
            titleEn: 'Director, AI Research',
            personId: 'bryan-low',
          },
          {
            name: 'Ng See Kiong',
            title: 'AI 技术总监',
            titleJa: 'AI技術ディレクター',
            titleEn: 'Director, AI Technology',
            personId: 'ng-see-kiong',
          },
          {
            name: 'Laurence Liew',
            title: 'AI 创新总监',
            titleJa: 'AI革新ディレクター',
            titleEn: 'Director, AI Innovation',
            personId: 'laurence-liew',
          },
          {
            name: 'Leslie Teo',
            title: 'AI 产品高级总监（SEA-LION 牵头人）',
            titleJa: 'AI製品シニアディレクター（SEA-LIONリード）',
            titleEn: 'Senior Director, AI Products (SEA-LION lead)',
            personId: 'leslie-teo',
          },
          {
            name: 'Simon Chesterman',
            title: 'AI 治理高级总监',
            titleJa: 'AI治理シニアディレクター',
            titleEn: 'Senior Director, AI Governance',
            personId: 'simon-chesterman',
          },
        ],
        summary:
          'AI Singapore（AISG）是 2017 年由新加坡政府设立的国家级 AI 计划，承担「把新加坡变成 AI 国家」的执行任务。它不是一个传统研究院，而是一个**集合研究、人才、产品、治理的混合体**——SEA-LION（东南亚多语言大模型）、AIAP（AI 学徒计划）、TagUI（开源 RPA）、AI Verify（治理框架）这些被反复引用的「新加坡 AI 名片」，几乎全部出自 AISG。',
        summaryJa:
          'AI Singapore（AISG）は、2017年にシンガポール政府によって設立された国家AI計画で、「シンガポールをAI国家に変える」という実行ミッションを担っています。従来の研究機関ではなく、研究、人材、製品、ガバナンスを統合したハイブリッド体です。SEA-LION（東南アジア多言語大規模言語モデル）、AIAP（AI見習い制度）、TagUI（オープンソースRPA）、AI Verify（ガバナンスフレームワーク）といった、繰り返し引用される「シンガポール AI の名刺」はほぼすべてAISGから生み出されています。',
        summaryEn:
          'AI Singapore (AISG) is a national AI programme set up by the Singapore government in 2017 with a single mandate: turn Singapore into an AI nation. It is not a traditional research institute but a **hybrid of research, talent, products, and governance** — SEA-LION (the Southeast Asian multilingual LLM), AIAP (AI Apprenticeship Programme), TagUI (open-source RPA), and AI Verify (governance framework), the most-cited Singapore AI calling cards, almost all originated from AISG.',
        whatItIs: `AI Singapore 由新加坡国立研究基金会（NRF）拨款 1.5 亿新元启动，初始期限 5 年，2022 年续期至 2027 年（NAIS 2.0 时期再次扩容）。它**寄生于 NUS 校园**（COM3 大楼），管理上独立，但能直接调用 NUS、NTU、SMU、SUTD、A*STAR 的研究力量。

组织上，AISG 由几个并列的支柱组成：

- **基础研究**：联合本地高校做 AI 算法/系统研究
- **AI 创新**（100 Experiments、LearnAI）：把研究转成企业应用
- **AI 人才**（AIAP、AMP、PhD Fellowship）：本地 AI 工程师培养主渠道
- **AI 产品**（SEA-LION、TagUI、PeekingDuck、SGNLP、Synergos）：自研开源工具
- **AI 治理**（AI Verify Foundation 的孵化器）：把治理工具变成全球可用的开源基础设施

AISG 的模式被海外多次研究和模仿——它是少数几个由政府直接资助、又能产出全球开源项目的国家级 AI 机构。`,
        whatItIsJa: `AI Singapore はシンガポール国立研究基金会（NRF）から 1.5 億シンガポールドルの予算配分で立ち上げられ、初期期間は 5 年で、2022 年に 2027 年まで延長されました（NAIS 2.0 時期に再度拡大）。それは**NUS キャンパスに所在し**（COM3 ビルディング）、管理上は独立していますが、NUS、NTU、SMU、SUTD、A*STAR の研究力を直接活用できます。

組織的には、AISG は複数の並列の柱で構成されています：

- **基礎研究**：現地高等教育機関と連携して AI アルゴリズム/システム研究を実施
- **AI イノベーション**（100 Experiments、LearnAI）：研究を企業応用に変換
- **AI 人材**（AIAP、AMP、PhD Fellowship）：現地 AI エンジニア育成の主要経路
- **AI 製品**（SEA-LION、TagUI、PeekingDuck、SGNLP、Synergos）：社内開発オープンソース・ツール
- **AI ガバナンス**（AI Verify Foundation インキュベーター）：ガバナンス・ツールをグローバルに利用可能なオープンソース・インフラストラクチャに変換

AISG のモデルは海外で何度も研究・模倣されています——それは政府から直接資金提供を受け、かつグローバルなオープンソース・プロジェクトを産出できる数少ない国家級 AI 機構です。`,
        whatItIsEn: `AISG was launched with S$150 million in seed funding from the National Research Foundation (NRF), originally for five years, then extended through 2027 (with further expansion under NAIS 2.0). It is **embedded inside the NUS campus** (COM3 building), operationally independent but with direct access to research talent at NUS, NTU, SMU, SUTD, and A*STAR.

Structurally, AISG is built on several parallel pillars:

- **Foundational research**: joint AI algorithm and systems research with local universities
- **AI innovation** (100 Experiments, LearnAI): turning research into enterprise applications
- **AI talent** (AIAP, AMP, PhD Fellowship): the main pipeline for local AI engineering talent
- **AI products** (SEA-LION, TagUI, PeekingDuck, SGNLP, Synergos): in-house open-source tools
- **AI governance** (incubator for AI Verify Foundation): turning governance tooling into globally usable open-source infrastructure

The AISG model has been studied and imitated abroad — one of the few national AI institutions that combines direct government funding with global open-source project output.`,
        aiRelevance: `AISG 的 AI 定位非常具体：**不做前沿基础研究的"全球第一"，但要把「东南亚的 AI 主权」做成现实**。

技术路线上，它的代表作 SEA-LION 不和 GPT/Claude 比通用能力，而是专攻「东南亚 11 种语言（含马来语、泰米尔语、缅甸语等小语种）」的语义保真度——这是西方大厂没有动力做、东南亚本地又没有算力做的空白。

工具路线上，TagUI（5000+ Stars）、PeekingDuck、Synergos（联邦学习）等都是「把 AI 落到企业 IT 栈」的开源套件，思路是**降低本地企业用 AI 的门槛**，而不是追求 SOTA。

治理路线上，AI Verify 把「负责任 AI」从原则变成了可运行的测试套件，这是全球第一个开源的 AI 治理测试框架。这套思路后来直接被纳入 IMDA 的 Model AI Governance Framework v2。

**一句话**：AISG 是「应用导向的国家级 AI 中台」，输出的是工具、人才、治理框架，而不是论文。`,
        aiRelevanceJa: `AISG の AI ポジショニングは非常に具体的です：**先端基礎研究の「グローバルファースト」を追求せず、「東南アジアの AI 主権」を現実のものにする**ものです。

技術路線では、その代表作 SEA-LION は GPT/Claude との汎用能力の比較ではなく、「東南アジア 11 言語（マレー語、タミル語、ミャンマー語などの少数言語を含む）」のセマンティック忠実度に特化しています。これは西方の大手企業には動機がなく、東南アジア現地には計算能力がない領域です。

ツール路線では、TagUI（5000+ Stars）、PeekingDuck、Synergos（フェデレーション学習）などはすべて「AI を企業 IT スタックに組み込む」オープンソース・ツールセットであり、思想は**現地企業の AI 利用の敷居を低くすること**であり、SOTA を追求することではありません。

ガバナンス路線では、AI Verify は「責任ある AI」を原則から実行可能なテストスイートに変え、これは世界初のオープンソース AI ガバナンステストフレームワークです。この思想は後に IMDA の Model AI Governance Framework v2 に直接組み込まれました。

**一言で言えば**：AISG は「アプリケーション指向の国家級 AI プラットフォーム」であり、出力するのはツール、人材、ガバナンスフレームワークであって、論文ではありません。`,
        aiRelevanceEn: `AISG’s AI positioning is highly specific: **it is not chasing "world #1" in frontier basic research, but turning "Southeast Asian AI sovereignty" into reality**.

On the technology track, its flagship SEA-LION does not compete with GPT/Claude/Gemini on general capability — it focuses on **semantic fidelity in 11 Southeast Asian languages** (including Malay, Tamil, Burmese, and other smaller languages) — a gap Western big tech has no incentive to fill and that Southeast Asian players lack the compute to address.

On the tooling track, TagUI (5,000+ stars), PeekingDuck, and Synergos (federated learning) are open-source kits aimed at **embedding AI into enterprise IT stacks**, focused on lowering the threshold for local enterprises rather than chasing SOTA.

On the governance track, AI Verify turned "responsible AI" from principles into a runnable test suite — the world's first open-source AI governance testing framework. This approach was later folded directly into IMDA's Model AI Governance Framework v2.

**In one sentence**: AISG is the "application-oriented national AI middle layer" — its output is tools, talent, and governance frameworks, not papers.`,
        singaporeRelevance: `理解新加坡 AI 战略，绕不开 AISG——它几乎是**国家 AI 政策唯一的大规模执行抓手**。

在「七条传导杠杆」里，AISG 同时落在多条上：

- **杠杆 2（人才）**：AIAP 是新加坡本地 AI 工程师产出的主要渠道，比任何高校都直接
- **杠杆 3（应用）**：100E 推动企业 AI PoC，LearnAI 培训在职员工
- **杠杆 5（政府自用）**：政府部门用 SEA-LION 做本地化 AI 服务的底层模型
- **杠杆 6（外交）**：SEA-LION 和 AI Verify 是新加坡在国际 AI 治理桌上的「硬通货」

观点：**AISG 的真正价值不在它做出的任何单个产品，而在于它证明了"小国家也能做 AI"的非美中路径**——靠政府清晰下注、聚焦细分（东南亚语言、可落地工具、治理标准），而不是和大厂比通用大模型。这条路被欧盟、东南亚邻国反复研究。

但 AISG 的瓶颈也很真实：**它的人才稳定性差**（学徒制 9 个月毕业后大量流向私企）、**资金周期化**（每 5 年要重新申请预算）、**研究产出薄**（论文影响力远不如其投入规模），这些都是接下来 NAIS 2.0 时期需要回答的问题。`,
        singaporeRelevanceJa: `シンガポール AI 戦略を理解する上で、AISG は避けて通れません——それはほぼ**国家 AI 政策唯一の大規模実行レバー**です。

「7 つの伝導レバー」の中で、AISG は同時に複数のレバーに作用しています：

- **レバー 2（人材）**：AIAP はシンガポール現地の AI エンジニア育成の主要経路であり、どの高等教育機関よりも直接的です
- **レバー 3（応用）**：100E は企業 AI PoC を推進し、LearnAI は在職従業員を訓練します
- **レバー 5（政府自用）**：政府部門は SEA-LION をローカライズされた AI サービスの基盤モデルとして使用します
- **レバー 6（外交）**：SEA-LION と AI Verify はシンガポールが国際 AI ガバナンスの場での「ハードカレンシー」です

観点：**AISG の真の価値は、それが産み出すいかなる単一の製品にあるのではなく、「小国家も AI を実現できる」という非米中路線を証明していることにあります**——政府が明確に投資し、細分化に焦点を当てる（東南アジアの言語、導入可能なツール、ガバナンス基準）ことによってであり、大企業との汎用大規模言語モデルの競争ではなく。この路線は EU と東南アジアの隣国によって繰り返し研究されています。

しかし AISG のボトルネックも非常に現実的です：**人材の安定性が低い**（見習い制度で 9 か月卒業後、大量が民間企業に流出）、**資金の周期化**（5 年ごとに予算の再申請が必要）、**研究成果の薄さ**（論文の影響力は投入規模よりはるかに劣る）で、これらはすべて次の NAIS 2.0 時期で回答する必要がある問題です。`,
        singaporeRelevanceEn: `You cannot understand Singapore's AI strategy without AISG — it is essentially **the only large-scale execution arm of the country's AI policy**.

In the "seven transmission levers" framework, AISG sits across multiple levers simultaneously:

- **Lever 2 (talent)**: AIAP is the dominant pipeline for local AI engineers, more direct than any university
- **Lever 3 (applications)**: 100E pushed enterprise AI proofs of concept; LearnAI trains in-service workers
- **Lever 5 (government adoption)**: government agencies use SEA-LION as the base model for localised AI services
- **Lever 6 (international)**: SEA-LION and AI Verify are Singapore's "hard currency" at the international AI governance table

A take: **AISG's real value lies not in any single product, but in proving that "small countries can do AI" via a non-US, non-China path** — through clear government bets, focus on specialisation (Southeast Asian languages, deployable tools, governance standards), rather than competing with big tech on general LLMs. This route has been studied repeatedly by the EU and Southeast Asian neighbours.

But AISG's bottlenecks are real: **talent retention is weak** (apprentices leave for private sector after 9 months), **cyclic funding** (budget must be re-applied every 5 years), and **thin research output** (publication impact lags far behind its investment scale). These are the questions to be answered in the NAIS 2.0 era.`,
        milestones: [
          {
            date: '2017-05',
            title: 'AISG 成立',
            titleJa: 'AISG設立',
            titleEn: 'AISG founded',
            description: '由 NRF 拨款 1.5 亿新元启动，初始 5 年期，挂靠 NUS。',
            descriptionJa: 'NRFから1.5億シンガポール・ドルの資金を得て始動、初期5年間、NUSに帰属。',
            descriptionEn: 'Launched with S$150M from NRF; initial 5-year term; hosted at NUS.',
          },
          {
            date: '2018',
            title: 'AIAP 学徒计划启动',
            titleJa: 'AIAP見習い制度の開始',
            titleEn: 'AIAP apprenticeship programme launched',
            description: '9 个月沉浸式 AI 工程师培养，至今 22 批次 500+ 校友。',
            descriptionJa: '9ヶ月集中 AI エンジニア人材育成、これまで 22 期、500名以上の卒業生。',
            descriptionEn: '9-month immersive AI engineer training; 22 cohorts and 500+ alumni to date.',
          },
          {
            date: '2018',
            title: 'TagUI 开源',
            titleJa: 'TagUI オープンソース化',
            titleEn: 'TagUI open-sourced',
            description: '开源 RPA 工具，至今 GitHub 5000+ Stars。',
            descriptionJa: 'オープンソース RPA ツール、これまで GitHub 5000以上のスター。',
            descriptionEn: 'Open-source RPA tool; 5,000+ GitHub stars to date.',
          },
          {
            date: '2022-05',
            title: 'AI Verify 框架发布',
            titleJa: 'AI Verify フレームワーク発表',
            titleEn: 'AI Verify framework released',
            description: '全球首个开源 AI 治理测试框架，2023 年独立成立 AI Verify Foundation。',
            descriptionJa:
              '世界初のオープンソース AI ガバナンステストフレームワーク、2023年に独立して AI Verify Foundation を設立。',
            descriptionEn:
              "World's first open-source AI governance testing framework; AI Verify Foundation spun off in 2023.",
          },
          {
            date: '2022',
            title: 'AISG 续期至 2027',
            titleJa: 'AISG を2027年まで延長',
            titleEn: 'AISG extended to 2027',
            description: 'NAIS 2.0 战略下获追加预算与扩展授权。',
            descriptionJa: 'NAIS 2.0 戦略の下で追加予算と拡張授権を獲得。',
            descriptionEn: 'Additional budget and expanded mandate under NAIS 2.0.',
          },
          {
            date: '2023-12',
            title: 'SEA-LION v1 发布',
            titleJa: 'SEA-LION v1 発表',
            titleEn: 'SEA-LION v1 released',
            description: '首个专注东南亚多语言的开源大模型，覆盖 11 种语言。',
            descriptionJa: '東南アジアの多言語に特化した初のオープンソース大規模言語モデル、11言語をカバー。',
            descriptionEn: 'First open-source LLM dedicated to Southeast Asian multilingual coverage; 11 languages.',
          },
          {
            date: '2024-12',
            title: 'SEA-LION v3 发布',
            titleJa: 'SEA-LION v3 発表',
            titleEn: 'SEA-LION v3 released',
            description: '基于 Llama 3 的 70B 与 8B 双版本，性能跻身东南亚语言 SOTA。',
            descriptionJa: 'Llama 3 ベースの 70B と 8B デュアルバージョン、性能は東南アジア言語 SOTA の上位に位置。',
            descriptionEn: '70B and 8B variants based on Llama 3; SOTA on Southeast Asian languages.',
          },
          {
            date: '2025',
            title: 'SEA-LION 进入政府 AI 服务底层',
            titleJa: 'SEA-LION が政府 AI サービスの基盤層に進出',
            titleEn: 'SEA-LION powers government AI services',
            description: '多个部门基于 SEA-LION 部署内部 AI 助手与公共服务原型。',
            descriptionJa: '複数の部門が SEA-LION に基づいて内部 AI アシスタントと公共サービスプロトタイプを展開。',
            descriptionEn:
              'Multiple agencies deploy SEA-LION-based internal AI assistants and public service prototypes.',
          },
        ],
        products: [
          {
            name: 'SEA-LION',
            nameEn: 'SEA-LION',
            description: '东南亚多语言大模型',
            descriptionJa: '東南アジア多言語大規模言語モデル',
            descriptionEn: 'Southeast Asian multilingual LLM',
            entityId: 'sea-lion',
          },
          {
            name: 'TagUI',
            nameEn: 'TagUI',
            description: '开源 RPA 工具',
            descriptionJa: 'オープンソース RPA ツール',
            descriptionEn: 'Open-source RPA tool',
            url: 'https://github.com/aisingapore/TagUI',
          },
          {
            name: 'PeekingDuck',
            nameEn: 'PeekingDuck',
            description: '计算机视觉推理框架',
            descriptionJa: 'コンピュータビジョン推論フレームワーク',
            descriptionEn: 'Computer vision inference framework',
            url: 'https://github.com/aisingapore/PeekingDuck',
          },
          {
            name: 'SGNLP',
            nameEn: 'SGNLP',
            description: '新加坡 NLP 模型与工具包',
            descriptionJa: 'シンガポール NLP モデルとツールキット',
            descriptionEn: 'Singapore-focused NLP toolkit',
            url: 'https://github.com/aisingapore/sgnlp',
          },
          {
            name: 'Synergos',
            nameEn: 'Synergos',
            description: '联邦学习框架',
            descriptionJa: 'フェデレーテッドラーニングフレームワーク',
            descriptionEn: 'Federated learning framework',
            url: 'https://github.com/aisingapore/synergos',
          },
          {
            name: 'AIAP',
            nameEn: 'AIAP',
            description: 'AI 学徒计划',
            descriptionJa: 'AI 学徒計画',
            descriptionEn: 'AI Apprenticeship Programme',
            url: 'https://aisingapore.org/innovation/aiap/',
          },
        ],
        relatedLeverNumbers: [2, 3, 5, 6],
        relatedEntityIds: ['sea-lion', 'ai-verify-foundation', 'imda', 'a-star', 'nus'],
        sources: [
          {
            label: 'AI Singapore 官网',
            labelJa: 'AI Singapore 公式ウェブサイト',
            labelEn: 'AI Singapore official site',
            url: 'https://aisingapore.org/',
            date: '2026-05-02',
          },
          {
            label: 'NRF 关于 AISG 的资助公告',
            labelJa: 'AISG に関する NRF 資金提供公告',
            labelEn: 'NRF announcement on AISG funding',
            url: 'https://www.nrf.gov.sg/programmes/artificial-intelligence-r-d-programme',
          },
        ],
        furtherReading: [
          {
            label: 'SEA-LION 技术博客',
            labelJa: 'SEA-LION テクニカルブログ',
            labelEn: 'SEA-LION tech blog',
            url: 'https://sea-lion.ai/blog/',
          },
          {
            label: 'AIAP 校友故事',
            labelJa: 'AIAP 卒業生のストーリー',
            labelEn: 'AIAP alumni stories',
            url: 'https://aisingapore.org/innovation/aiap/',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '基础研究',
    nameJa: '基礎研究',
    nameEn: 'Foundational Research',
    icon: '🔬',
    description: '世界级研究机构支撑 AI 基础科学突破',
    descriptionJa: '世界クラスの研究機関が AI 基礎科学の突破を支える',
    descriptionEn: 'World-class research institutions powering foundational AI breakthroughs',
    entities: [
      {
        id: 'a-star',
        name: 'A*STAR',
        nameEn: 'A*STAR',
        description: '新加坡科技研究局，AI 基础研究与应用研究主力',
        descriptionJa: 'シンガポール科学技術研究局、AI 基礎研究と応用研究の主力',
        descriptionEn:
          'Singapore Agency for Science, Technology and Research; primary engine for foundational and applied AI research',
        url: 'https://www.a-star.edu.sg/',
        entityType: 'agency',
        status: 'active',
        founded: '1991',
        ministry: '贸工部（MTI）',
        ministryJa: '貿易・工業省（MTI）',
        ministryEn: 'Ministry of Trade and Industry (MTI)',
        scale: '20+ 研究院所，员工 5000+，年研发支出 SGD 4.6 亿+',
        scaleJa: '20以上の研究機関、5000名以上の従業員、年間研究開発費 SGD 4.6億以上',
        scaleEn: '20+ research institutes, 5,000+ staff, annual R&D budget over S$460M',
        leaders: [
          {
            name: 'Beh Kian Teik',
            title: '首席执行官',
            titleJa: '最高経営責任者（CEO）',
            titleEn: 'CEO',
            personId: 'beh-kian-teik',
          },
          {
            name: 'Andy Hor',
            title: '副执行长（研究）',
            titleJa: '副執行官（研究）',
            titleEn: 'Deputy CEO (Research)',
            personId: 'andy-hor',
          },
          {
            name: 'Lim Keng Hui',
            title: '助理执行长（科学与工程研究理事会）',
            titleJa: '補助執行官（科学・工学研究評議会）',
            titleEn: 'Assistant CEO (SERC)',
            personId: 'lim-keng-hui',
          },
          {
            name: 'Ivor Tsang',
            title: 'CFAR 主任',
            titleJa: 'CFAR 所長',
            titleEn: 'Director, CFAR',
            personId: 'ivor-tsang',
          },
          {
            name: 'Ong Yew Soon',
            title: 'CFAR 首席 AI 科学家',
            titleJa: 'CFAR 主任 AI 科学者',
            titleEn: 'Chief AI Scientist, CFAR',
            personId: 'ong-yew-soon',
          },
        ],
        summary:
          'A*STAR（Agency for Science, Technology and Research）是新加坡的国家科研机构，1991 年成立，挂在贸工部（MTI）下面。它不像高校那样既要教学又要科研，而是**纯粹做应用导向的研究**，是新加坡 AI 基础研究和工业落地的"国家级 R&D 部门"。在 AI 领域，A*STAR 的 I2R（资讯通信研究院）和 CFAR（前沿 AI 研究中心）是两个核心节点。',
        summaryJa:
          'A*STAR（Agency for Science, Technology and Research）はシンガポール国家研究機関であり、1991年に設立され、貿易・工業省（MTI）の傘下にあります。大学のように教育と研究の両方を行うのではなく、**純粋にアプリケーション指向の研究**を行っており、シンガポール AI 基礎研究と産業応用の「国家レベルの R&D 部門」です。AI 領域では、A*STAR の I2R（情報通信研究院）と CFAR（最先端 AI 研究センター）が2つのコアノードです。',
        summaryEn:
          "A*STAR (Agency for Science, Technology and Research) is Singapore's national research agency, founded in 1991, sitting under the Ministry of Trade and Industry (MTI). Unlike universities that combine teaching and research, A*STAR does **purely application-oriented research** — it is the \"national R&D department\" for Singapore's AI foundational research and industrial deployment. In AI specifically, A*STAR's I2R (Institute for Infocomm Research) and CFAR (Centre for Frontier AI Research) are the two core nodes.",
        whatItIs: `A*STAR 是新加坡最大的公共研究机构，由 20+ 研究院所组成（如 I2R、IHPC、SIMTech、IMRE、IBN、CFAR 等），覆盖信息通信、生物医学、化学材料、制造、可持续能源等领域。

与 AI 直接相关的核心单位有：

- **I2R（Institute for Infocomm Research）**：新加坡最大的 ICT 研究院，AI / 计算机视觉 / NLP / 机器学习的传统重镇
- **CFAR（Centre for Frontier AI Research）**：2022 年成立的"前沿 AI 中心"，专攻 LLM、生成式 AI、AI for Science
- **IHPC（Institute of High Performance Computing）**：超算 + AI for Science 的交叉研究

A*STAR 的角色定位非常清楚：**做企业不愿意做、高校做不深的中间层研究**。它的研究成果通过 ETPL（Exploit Technologies Pte Ltd）做技术转化，授权给本地企业商用。`,
        whatItIsJa: `A*STAR はシンガポール最大の公的研究機関で、20 以上の研究機関から構成されています（I2R、IHPC、SIMTech、IMRE、IBN、CFAR など）。情報通信、生物医学、化学材料、製造、持続可能エネルギーなどの分野をカバーしています。

AI と直接関連する中核的な部門には以下があります：

- **I2R（Institute for Infocomm Research）**：シンガポール最大の ICT 研究機関で、AI、コンピュータビジョン、NLP、機械学習の伝統的な中心地です
- **CFAR（Centre for Frontier AI Research）**：2022 年に設立された 「フロンティア AI センター」で、LLM、生成 AI、AI for Science に専門化しています
- **IHPC（Institute of High Performance Computing）**：スーパーコンピューティングと AI for Science の横断研究

A*STAR の役割ポジショニングは非常に明確です：**企業が行いたくない、高等教育機関では深く進められない中間層研究を実施する**ことです。その研究成果は ETPL（Exploit Technologies Pte Ltd）を通じて技術移転され、現地企業による商用化に向けてライセンスされます。`,
        whatItIsEn: `A*STAR is Singapore's largest public research institution, with 20+ research institutes (I2R, IHPC, SIMTech, IMRE, IBN, CFAR, etc.) covering ICT, biomedicine, chemical materials, manufacturing, sustainable energy and more.

The core units directly relevant to AI:

- **I2R (Institute for Infocomm Research)**: Singapore's largest ICT research institute; the traditional powerhouse for AI / computer vision / NLP / machine learning
- **CFAR (Centre for Frontier AI Research)**: a "frontier AI centre" set up in 2022, focused on LLMs, generative AI, and AI for Science
- **IHPC (Institute of High Performance Computing)**: intersection of supercomputing and AI for Science

A*STAR's positioning is very clear: **do the middle-layer research that enterprises won't do and universities can't go deep on**. Research outputs are commercialised through ETPL (Exploit Technologies Pte Ltd) and licensed to local enterprises.`,
        aiRelevance: `A*STAR 在新加坡 AI 生态里是"基础设施层"——很多东西**它做了但你不知道是它**。

具体贡献：

- **CFAR 与 AISG 共同孵化 SEA-LION**：CFAR 提供 LLM 训练经验和算力资源，AISG 负责工程化和产品化
- **I2R 是新加坡 NLP / CV 研究的祖师爷**：早年的 SGNLP（后转给 AISG 维护）、新加坡英语方言识别等都源自 I2R
- **AI for Science**：A*STAR 在材料、生物、化学领域用 AI 做发现，是新加坡少数有完整 AI4S 闭环的地方
- **国家算力中心（NSCC）的运营方**：SEA-LION、本地科研项目的算力都依赖 A*STAR 协调

技术路线上，A*STAR 不追求"全球第一论文"，而是追求"产业可落地"——这是它和 NUS / NTU 这种纯学术机构的根本差异。`,
        aiRelevanceJa: `A*STAR はシンガポール AI エコシステムにおいて「インフラストラクチャ層」です——**多くのことが実は A*STAR がやっているのに、あなたはそれだと気づかない**のです。

具体的な貢献：

- **CFAR と AISG が共同で SEA-LION をインキュベート**：CFAR は LLM 訓練経験と計算リソースを提供し、AISG はエンジニアリングと製品化を担当
- **I2R はシンガポール NLP/CV 研究の開祖です**：初期の SGNLP（後に AISG にメンテナンスが移る）、シンガポール英語方言識別など、すべて I2R に由来
- **AI for Science**：A*STAR は素材、生物学、化学分野で AI を使用して発見を行い、シンガポールで完全な AI4S クローズドループを持つ数少ない機関です
- **国家計算能力中心（NSCC）の運営者**：SEA-LION、現地研究プロジェクトの計算リソースはすべて A*STAR の調整に依存

技術路線では、A*STAR は「グローバルファースト論文」を追求せず、「産業導入可能な成果」を追求します——これが、A*STAR が NUS/NTU などの純粋な学術機関と根本的に異なる点です。`,
        aiRelevanceEn: `A*STAR sits in Singapore's AI ecosystem as the "infrastructure layer" — **a lot of what it does goes unattributed**.

Specific contributions:

- **CFAR co-incubates SEA-LION with AISG**: CFAR provides LLM training experience and compute, AISG handles engineering and productisation
- **I2R is the "ancestor" of Singapore's NLP / CV research**: early SGNLP (later transferred to AISG), Singapore English dialect recognition, and more all originated in I2R
- **AI for Science**: A*STAR uses AI for discovery in materials, biology and chemistry — one of few places in Singapore with a complete AI4S loop
- **Operator of the National Supercomputing Centre (NSCC)**: SEA-LION and local research compute all depend on A*STAR coordination

On the technical track, A*STAR does not chase "world-best papers" but "industrial deployability" — the fundamental difference from purely academic institutions like NUS / NTU.`,
        singaporeRelevance: `A*STAR 是新加坡 AI 战略中**最容易被低估、但最不可或缺的角色**。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：A*STAR 是国家研究投入的主要承接方，CFAR 直接对标全球前沿
- **杠杆 3（产业应用）**：通过 I2R / SIMTech 把 AI 技术转给本地制造业、医疗、金融
- **杠杆 5（政府自用）**：政府部门很多 AI 项目（医疗影像、智慧国家平台）都用 A*STAR 的技术栈

观点：**A*STAR 的真正价值不在它的论文产出，而在它扮演了"国家技术转化器"的角色**——把高校的纯研究、企业的具体需求、国家的战略目标，三者粘合起来。这是新加坡少数能做"从基础研究到产品落地"全链条的机构。

但 A*STAR 也有明显的瓶颈：**人才与高校 / 大厂相比缺乏吸引力**（薪资中等、晋升路径窄）、**研究产出效率受层级管理拖累**、**部分研究院所方向陈旧**（这是一个 1991 年的老牌机构）。NAIS 2.0 时期，A*STAR 在 AI 领域的角色定位需要重新审视——是继续做"应用研究中台"，还是聚焦少数前沿（如 CFAR）？`,
        singaporeRelevanceJa: `A*STAR はシンガポール AI 戦略における**最も過小評価されやすく、しかし最も不可欠な役割**です。

「7 つの伝導レバー」の中で：

- **レバー 1（基礎研究）**：A*STAR は国家研究投入の主要な受け手であり、CFAR はグローバル前沿と直接ベンチマークしています
- **レバー 3（産業応用）**：I2R/SIMTech を通じて AI 技術を現地製造業、医療、金融に転移
- **レバー 5（政府自用）**：政府部門の多くの AI プロジェクト（医療画像、スマートネーション・プラットフォーム）は A*STAR の技術スタックを使用

観点：**A*STAR の真の価値は、その論文出力にあるのではなく、「国家技術コンバーター」の役割を果たしていることにあります**——高等教育機関の純粋研究、企業の具体的ニーズ、国家の戦略目標の 3 者を接着させます。これはシンガポールで「基礎研究から製品落地」の全チェーンを実行できる数少ない機構です。

しかし A*STAR にも明らかなボトルネックがあります：**人材と高等教育機関/大企業と比較して吸引力が欠ける**（給与は中程度、昇進経路が狭い）、**研究成果の効率が階級管理に阻害される**、**一部の研究機関の方向が陳旧化している**（これは 1991 年の老舗機構です）。NAIS 2.0 時期に、A*STAR の AI 分野における役割の位置づけは再検討が必要です——「応用研究プラットフォーム」を続けるのか、少数の最先端（例：CFAR）に焦点を当てるのか？`,
        singaporeRelevanceEn: `A*STAR plays the **most easily underestimated yet most indispensable role** in Singapore's AI strategy.

In the seven-lever framework:

- **Lever 1 (foundational research)**: A*STAR is the main recipient of national research funding; CFAR benchmarks directly against the global frontier
- **Lever 3 (industry adoption)**: through I2R / SIMTech, transfers AI tech to local manufacturing, healthcare, finance
- **Lever 5 (government adoption)**: many government AI projects (medical imaging, Smart Nation platforms) sit on A*STAR tech stack

A take: **A*STAR's real value lies not in publication output but in its role as a "national tech translator"** — gluing university research, enterprise needs, and national strategy together. It is one of few institutions in Singapore that can do "from foundational research to product deployment" end-to-end.

But A*STAR has obvious bottlenecks: **less attractive than universities or big tech** (mid-tier salary, narrow promotion path), **research efficiency dragged by hierarchical management**, and **some institutes' research directions are dated** (this is a 1991-vintage agency). In the NAIS 2.0 era, A*STAR's role in AI needs to be reassessed — continue as the "applied research middle platform", or focus on a few frontiers (like CFAR)?`,
        milestones: [
          {
            date: '1991',
            title: 'A*STAR 前身 NSTB 成立',
            titleJa: 'A*STAR 前身 NSTB 設立',
            titleEn: 'A*STAR predecessor NSTB founded',
            description: '当时叫国家科技局（National Science and Technology Board）。',
            descriptionJa: '当時は国家科学技術局（National Science and Technology Board）と呼ばれていました。',
            descriptionEn: 'Originally named the National Science and Technology Board (NSTB).',
          },
          {
            date: '2002',
            title: '更名为 A*STAR',
            titleJa: 'A*STAR に改名',
            titleEn: 'Renamed to A*STAR',
          },
          {
            date: '2002',
            title: 'I2R 成立',
            titleJa: 'I2R 設立',
            titleEn: 'I2R established',
            description: '成为新加坡最大的 ICT 研究院。',
            descriptionJa: 'シンガポール最大の ICT 研究機関となりました。',
            descriptionEn: "Became Singapore's largest ICT research institute.",
          },
          {
            date: '2022-09',
            title: 'CFAR 前沿 AI 研究中心成立',
            titleJa: 'CFAR 最先端 AI 研究センター設立',
            titleEn: 'CFAR (Centre for Frontier AI Research) established',
            description: '专攻 LLM、生成式 AI、AI for Science。',
            descriptionJa: 'LLM、生成 AI、AI for Science に特化しています。',
            descriptionEn: 'Focused on LLMs, generative AI, and AI for Science.',
          },
          {
            date: '2023',
            title: 'CFAR 参与 SEA-LION 训练',
            titleJa: 'CFAR が SEA-LION トレーニングに参加',
            titleEn: 'CFAR contributes to SEA-LION training',
          },
        ],
        relatedLeverNumbers: [1, 3, 5],
        relatedEntityIds: ['ai-singapore', 'sea-lion', 'nus', 'ntu'],
        sources: [
          {
            label: 'A*STAR 官网',
            labelJa: 'A*STAR 公式ウェブサイト',
            labelEn: 'A*STAR official site',
            url: 'https://www.a-star.edu.sg/',
            date: '2026-05-02',
          },
          {
            label: 'CFAR 介绍',
            labelJa: 'CFAR の紹介',
            labelEn: 'CFAR overview',
            url: 'https://www.a-star.edu.sg/cfar',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'nus',
        name: 'NUS',
        nameEn: 'NUS',
        description:
          '新加坡国立大学，AI 研究排名亚洲前列。2024.3 成立 NUS AI Institute，整合基础 AI、应用 AI 及社会影响研究',
        descriptionJa:
          'シンガポール国立大学、AI 研究ランキングはアジア上位。2024年3月に NUS AI Institute を設立し、基礎 AI、応用 AI および社会的影響研究を統合。',
        descriptionEn:
          "National University of Singapore; among Asia's top AI research universities. Launched the NUS AI Institute in March 2024, bringing together foundational AI, applied AI and societal impact research",
        url: 'https://www.nus.edu.sg/',
        entityType: 'university',
        status: 'active',
        founded: '1905',
        ministry: '教育部（MOE）',
        ministryJa: '教育省（MOE）',
        ministryEn: 'Ministry of Education (MOE)',
        scale: '在校生 4 万+；2024 QS 世界大学排名第 8；AI 论文产出亚洲前 3',
        scaleJa: '在学生 4万名以上；2024年 QS 世界大学ランキング第8位；AI 論文産出がアジアトップ3。',
        scaleEn: '40,000+ students; ranked #8 worldwide in 2024 QS rankings; top 3 in Asia for AI publication output',
        leaders: [
          {
            name: 'Tan Eng Chye',
            title: '校长',
            titleJa: '学長',
            titleEn: 'President',
            personId: 'tan-eng-chye',
          },
          {
            name: 'Aaron Thean',
            title: '副校长（学术）兼教务长',
            titleJa: '副学長（学術）兼教務長',
            titleEn: 'Deputy President (Academic Affairs) and Provost',
            personId: 'aaron-thean',
          },
          {
            name: 'Mohan Kankanhalli',
            title: 'NUS AI 研究院院长',
            titleJa: 'NUS AI 研究院院長',
            titleEn: 'Director, NUS AI Institute',
            personId: 'mohan-kankanhalli',
          },
          {
            name: 'Bryan Low',
            title: 'AI 副校长',
            titleJa: 'AI 副学長',
            titleEn: 'Associate VP (AI)',
            personId: 'bryan-low',
          },
          {
            name: 'Simon Chesterman',
            title: 'NUS AI 研究院 AI 治理与政策负责人',
            titleJa: 'NUS AI 研究院 AI ガバナンス・政策責任者',
            titleEn: 'AI Governance and Policy Lead, NUS AI Institute',
            personId: 'simon-chesterman',
          },
          {
            name: 'Ng See Kiong',
            title: 'NUS 数据科学研究院转化研究总监',
            titleJa: 'NUS データ科学研究院 転換研究総監',
            titleEn: 'Director of Translational Research, NUS Institute of Data Science',
            personId: 'ng-see-kiong',
          },
        ],
        summary:
          'NUS（新加坡国立大学）是新加坡最顶尖的研究型大学，也是 AI Singapore 的"宿主"——AISG 总部就在 NUS 计算机学院（COM3）。在 AI 领域，NUS 是新加坡基础研究的主力军，并在 2024 年 3 月成立了 **NUS AI Institute**，把分散在各院系的 AI 研究整合到一个旗舰平台下。',
        summaryJa:
          'NUS（シンガポール国立大学）はシンガポール最高水準の研究型大学であり、また AI Singapore の「本拠地」でもあります。——AISG 本部は NUS 計算機科学部（COM3）にあります。AI 領域では、NUS はシンガポール基礎研究の主力であり、2024年3月に **NUS AI Institute** を設立し、各学部に分散した AI 研究を1つの旗艦プラットフォームの下に統合しました。',
        summaryEn:
          'NUS (National University of Singapore) is Singapore\'s top research university and the "host" of AI Singapore — AISG headquarters sits in the NUS School of Computing (COM3). In AI, NUS is the workhorse of Singapore\'s foundational research and launched the **NUS AI Institute** in March 2024 to consolidate AI research scattered across departments under one flagship platform.',
        whatItIs: `NUS 的 AI 研究由几个核心单位承担：

- **NUS AI Institute（NAII）**：2024 年 3 月成立的旗舰研究院，集中基础 AI / 应用 AI / 社会影响三条线
- **School of Computing（SoC）**：传统 CS 强项，AI / NLP / CV / RL 都有顶尖团队
- **NUS Business School**：AI 在商业应用、AI for Finance
- **NUS Medicine**：AI for Healthcare（与 Synapxe、各医院合作）
- **NUS Law TRAIL**：AI 法律治理研究

NUS 还托管了 **AI Singapore**——AISG 的办公室、算力、教师全部嵌入 NUS 校园。这种"国家计划寄生于高校"的模式让 NUS 同时享有学术自主和国家资源。

国际合作上，NUS 与 Microsoft Research Asia 共建 IPP（Industrial PhD Programme），与 Google DeepMind 在新加坡的实验室也有研究合作。`,
        whatItIsJa: `NUS の AI 研究は、複数のコア部門によって担われています。

- **NUS AI Institute（NAII）**：2024 年 3 月に設立されたフラッグシップ研究機関で、基礎 AI／応用 AI／社会的インパクトの 3 つの軸に集中
- **School of Computing（SoC）**：従来の CS の強項。AI／NLP／CV／RL のすべてにおいてトップレベルのチーム
- **NUS Business School**：ビジネスアプリケーション、AI for Finance における AI
- **NUS Medicine**：AI for Healthcare（Synapxe および各医療機関とのパートナーシップ）
- **NUS Law TRAIL**：AI 法律ガバナンス研究

NUS はまた **AI Singapore** ——AISG のオフィス、計算リソース、教員全てが NUS キャンパスに統合されている——をホストしています。この「国家プログラムが高等教育機関に寄生する」モデルにより、NUS は学術的自主性と国家リソースの両方を享受できます。

国際協力の面では、NUS は Microsoft Research Asia と共に IPP（Industrial PhD Programme）を構築しており、シンガポールの Google DeepMind ラボとも研究協力があります。`,
        whatItIsEn: `NUS's AI research is carried by several core units:

- **NUS AI Institute (NAII)**: the flagship institute launched in March 2024, organising foundational AI / applied AI / societal impact into three tracks
- **School of Computing (SoC)**: traditional CS strength, with top teams across AI / NLP / CV / RL
- **NUS Business School**: AI in business applications, AI for Finance
- **NUS Medicine**: AI for Healthcare (in partnership with Synapxe and the public hospitals)
- **NUS Law TRAIL**: AI legal governance research

NUS also hosts **AI Singapore** — AISG's offices, compute, and faculty are all embedded in the NUS campus. This "national programme parasitically hosted in a university" model lets NUS enjoy both academic autonomy and national-level resources.

Internationally, NUS co-runs the IPP (Industrial PhD Programme) with Microsoft Research Asia, and also has research collaborations with Google DeepMind's Singapore lab.`,
        aiRelevance: `NUS 的 AI 研究在三个层面都有强存在：

- **基础研究**：在 NeurIPS / ICML / ICLR / CVPR / ACL 的论文产出位居亚洲前 3，部分细分方向（如 Trustworthy ML、Multi-modal Learning）全球前 10
- **应用研究**：与本地企业、医院、政府部门有大量横向项目，是新加坡 AI 应用研究的"承接方"
- **国家计划支撑**：通过 AISG 直接参与国家级项目（SEA-LION 训练、AI Verify 评估方法学等）

代表性研究方向：

- **Trustworthy AI**：Bryan Hooi、Reza Shokri 等团队在 AI 隐私、对抗鲁棒性方向是全球领先
- **Multi-modal Foundation Models**：LV-NUS 实验室在多模态 LLM 上有持续产出
- **AI for Science**：与生物、化学、材料学院的合作

但 NUS 的 AI 研究有一个长期问题：**人才流失到大厂和海外**——每年都有顶尖 PI 被 Google、OpenAI、Meta 挖走，这是新加坡作为"小国 + 高薪环境"的结构性挑战。`,
        aiRelevanceJa: `NUS の AI 研究は 3 つのレベルで強い存在があります：

- **基礎研究**：NeurIPS、ICML、ICLR、CVPR、ACL での論文産出はアジア上位 3 であり、Trustworthy ML や Multi-modal Learning などの特定の細分化された方向では世界上位 10 です
- **応用研究**：現地企業、病院、政府機関と多くの横断的なプロジェクトを持ち、シンガポールの AI 応用研究の 「受け入れ側」です
- **国家計画への支援**：AISG を通じて国家レベルのプロジェクト（SEA-LION トレーニング、AI Verify 評価方法論など）に直接参加しています

代表的な研究方向：

- **Trustworthy AI**：Bryan Hooi、Reza Shokri などのチームは AI プライバシーと対抗的ロバストネスの分野で世界的にリーディングです
- **Multi-modal Foundation Models**：LV-NUS ラボラトリはマルチモーダル LLM での継続的な産出があります
- **AI for Science**：生物学、化学、材料科学学部との協力

しかし NUS の AI 研究には長期的な課題があります：**人材の流出（大手企業や海外へ）**——毎年一流 PI が Google、OpenAI、Meta に引き抜かれており、これはシンガポールが 「小国 + 高給環境」であることの構造的な課題です。`,
        aiRelevanceEn: `NUS's AI research has a strong presence at all three levels:

- **Foundational research**: paper output at NeurIPS / ICML / ICLR / CVPR / ACL ranks in the top 3 in Asia, with several sub-areas (such as Trustworthy ML, Multi-modal Learning) in the global top 10
- **Applied research**: a large pipeline of horizontal projects with local enterprises, hospitals, and government agencies — NUS is the main "delivery vehicle" for applied AI research in Singapore
- **National programme support**: through AISG, NUS participates directly in national-level projects (SEA-LION training, AI Verify evaluation methodology, and so on)

Representative research directions:

- **Trustworthy AI**: teams led by Bryan Hooi, Reza Shokri and others are world-leading in AI privacy and adversarial robustness
- **Multi-modal Foundation Models**: the LV-NUS lab has consistent output on multi-modal LLMs
- **AI for Science**: collaborations with the biology, chemistry, and materials departments

But NUS's AI research has a long-running problem: **talent drain to big tech and abroad** — every year top PIs get poached by Google, OpenAI, and Meta. This is the structural challenge of a "small country with a high-cost environment" like Singapore.`,
        singaporeRelevance: `NUS 在新加坡 AI 战略里是"基础研究的承重墙"。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：NUS 是新加坡 AI 论文产出的最大单一机构
- **杠杆 2（人才）**：NUS Computing 是本地 AI 工程师的主要培养基地，AISG 的 AIAP 学徒约 1/3 来自 NUS
- **杠杆 3（产业应用）**：通过 NUS Enterprise、横向项目把研究转化

观点：**NUS 是少数"既能做世界级研究、又愿意承接国家任务"的高校**——这种平衡在很多研究型大学里很难达到。AISG 嵌入 NUS 是新加坡 AI 战略最关键的体制设计：让国家计划获得高校的研究力量，同时让高校的研究能被国家战略放大。

但 NUS AI Institute（2024 成立）目前还在整合期，**它能否真正成为"亚洲 AI 研究中心"还需要 2-3 年观察**。关键变量：能否吸引/留住顶级 PI、能否产出 SEA-LION 级别的旗舰项目、能否和 NTU 形成差异化（NTU 偏工程应用，NUS 偏基础研究）。`,
        singaporeRelevanceJa: `NUS はシンガポール AI 戦略の中で 「基礎研究の耐力壁」です。

「7 つの伝導レバー」の中で：

- **レバー 1（基礎研究）**：NUS はシンガポール AI 論文産出の最大の単一機関です
- **レバー 2（人材）**：NUS Computing は現地 AI エンジニアの主要な育成基地であり、AISG の AIAP 見習いの約 3 分の 1 は NUS から来ています
- **レバー 3（産業応用）**：NUS Enterprise と横断的プロジェクトを通じて研究を活用しています

観点：**NUS は少数の 「世界レベルの研究ができ、かつ国家的課題を喜んで引き受ける」大学**です——このようなバランスは多くの研究型大学では達成が難しいです。AISG が NUS に埋め込まれることは、シンガポール AI 戦略の最も重要な制度設計です：国家計画が高等教育機関の研究力を獲得でき、同時に高等教育機関の研究が国家戦略によって拡大されるようになります。

しかし NUS AI Institute（2024 年設立）は現在統合期にあり、**それが本当に 「アジア AI 研究センター」になれるかどうかは 2～3 年の観察が必要です**。重要な変数：一流 PI を引き付け/保持できるか、SEA-LION レベルのフラッグシップ項目を産出できるか、NTU との差異化を形成できるか（NTU はエンジニアリング応用に傾き、NUS は基礎研究に傾いている）。`,
        singaporeRelevanceEn: `NUS is the "load-bearing wall of foundational research" in Singapore's AI strategy.

Across the seven transmission levers:

- **Lever 1 (Foundational Research)**: NUS is the single largest institution producing AI papers in Singapore
- **Lever 2 (Talent)**: NUS Computing is the main pipeline for local AI engineers; about a third of AISG AIAP apprentices come from NUS
- **Lever 3 (Industry Application)**: research is converted through NUS Enterprise and horizontal projects

Take: **NUS is one of the few universities that can simultaneously produce world-class research and willingly take on national assignments** — a balance that's rare in research universities. Embedding AISG inside NUS is the most critical institutional design in Singapore's AI strategy: it gives the national programme the research capacity of a university, and amplifies the university's research through national strategy.

But NUS AI Institute (founded 2024) is still in its integration phase. **Whether it can truly become "Asia's AI research centre" needs another 2–3 years to judge**. Key variables: ability to attract and retain top PIs, ability to produce SEA-LION-class flagship projects, and the ability to differentiate from NTU (NTU leans towards engineering applications, NUS towards foundational research).`,
        milestones: [
          {
            date: '1905',
            title: 'NUS 前身海峡医学院成立',
            titleJa: 'NUS の前身である海峡医学院設立',
            titleEn: 'NUS predecessor Straits Medical School founded',
          },
          {
            date: '1980',
            title: '现 NUS 由两所大学合并而成',
            titleJa: '現在の NUS は2つの大学の合併により形成されました',
            titleEn: 'Modern NUS formed from merger of two universities',
          },
          {
            date: '1998',
            title: 'School of Computing 成立',
            titleJa: 'School of Computing 設立',
            titleEn: 'School of Computing established',
          },
          {
            date: '2017',
            title: 'AI Singapore 总部入驻 NUS COM3',
            titleJa: 'AI Singapore 本部が NUS COM3 に入居',
            titleEn: 'AI Singapore HQ established at NUS COM3',
          },
          {
            date: '2024-03',
            title: 'NUS AI Institute 成立',
            titleJa: 'NUS AI Institute 設立',
            titleEn: 'NUS AI Institute established',
            description: '整合全校 AI 研究的旗舰平台。',
            descriptionJa: '全校 AI 研究を統合する旗艦プラットフォーム。',
            descriptionEn: 'Flagship platform consolidating university-wide AI research.',
          },
          {
            date: '2025-07',
            title: 'NUS 与 Microsoft Research Asia 合作 IPP',
            titleJa: 'NUS と Microsoft Research Asia が IPP で協力',
            titleEn: 'NUS partners with Microsoft Research Asia on IPP',
            description: '产业博士项目（Industrial PhD Programme）。',
            descriptionJa: 'インダストリアル博士課程（Industrial PhD Programme）です。',
            descriptionEn: 'Industrial PhD Programme (IPP).',
          },
        ],
        relatedLeverNumbers: [1, 2, 3],
        relatedEntityIds: ['ai-singapore', 'a-star', 'ntu', 'sea-lion'],
        sources: [
          {
            label: 'NUS 官网',
            labelJa: 'NUS 公式ウェブサイト',
            labelEn: 'NUS official site',
            url: 'https://www.nus.edu.sg/',
            date: '2026-05-02',
          },
          { label: 'NUS AI Institute', labelEn: 'NUS AI Institute', url: 'https://ai.nus.edu.sg/' },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'ntu',
        name: 'NTU',
        nameEn: 'NTU',
        description: '南洋理工大学，AI 与数据科学研究重镇',
        descriptionJa: '南洋工科大学、AI とデータサイエンス研究の主要拠点',
        descriptionEn: 'Nanyang Technological University; major hub for AI and data science research',
        url: 'https://www.ntu.edu.sg/',
        entityType: 'university',
        status: 'active',
        founded: '1981',
        ministry: '教育部（MOE）',
        ministryJa: '教育省（MOE）',
        ministryEn: 'Ministry of Education (MOE)',
        scale: '在校生 3.3 万+；2024 QS 世界排名第 26；工科强项突出',
        scaleJa: '在籍学生数3万3000人以上；2024年 QS世界ランキング第26位；工学系の強みが顕著です',
        scaleEn:
          '33,000+ students; ranked #26 worldwide in 2024 QS rankings; strong in engineering and applied sciences',
        leaders: [
          {
            name: 'Ho Teck Hua',
            title: '校长',
            titleJa: '学長',
            titleEn: 'President',
            personId: 'ho-teck-hua',
          },
          {
            name: 'Luke Ong',
            title: '副校长（AI 与数字经济）兼计算与数据科学学院创院院长',
            titleJa: '副学長（AI とデジタル経済）兼計算・データサイエンス学院創設院長',
            titleEn: 'VP (AI & Digital Economy), Founding Dean of CCDS',
            personId: 'luke-ong',
          },
          {
            name: 'Ong Yew Soon',
            title: '校长讲席教授（CCDS）',
            titleJa: '校長チェアプロフェッサー（CCDS）',
            titleEn: "President's Chair Professor, CCDS",
            personId: 'ong-yew-soon',
          },
        ],
        summary:
          'NTU（南洋理工大学）是新加坡的工科强校，与 NUS 并列为本地两大研究型大学。在 AI 领域，NTU 的特色是**强工程实战 + 强产业合作**——College of Computing and Data Science（CCDS）、S-Lab、Continual Learning Lab 等单位在 CV、机器人、连续学习方向有持续输出。',
        summaryJa:
          'NTU（南洋工科大学）はシンガポールの工学系強豪校であり、NUS と並んで国内の2大研究型大学です。AI 分野では、NTU の特徴は**強力なエンジニアリング実践 + 強力な産業連携**です。College of Computing and Data Science（CCDS）、S-Lab、Continual Learning Lab などの部門は、コンピュータビジョン、ロボティクス、継続学習分野で継続的な成果を出しています。',
        summaryEn:
          "NTU (Nanyang Technological University) is Singapore's engineering powerhouse, on par with NUS as one of the two major local research universities. In AI, NTU's signature is **strong engineering execution + deep industry partnerships** — units like the College of Computing and Data Science (CCDS), S-Lab, and the Continual Learning Lab consistently produce work in CV, robotics, and continual learning.",
        whatItIs: `NTU 在 AI 领域的核心单位：

- **College of Computing and Data Science（CCDS）**：2024 年由 SCSE 升级而来，整合计算机科学与数据科学
- **S-Lab**：与商汤科技联合实验室，专攻视觉、生成模型
- **Centre for Frontier AI Research（与 A*STAR）**：联合研究中心
- **NTU Institute for AI Research**：跨学科 AI 研究平台
- **NTU Garage @ DBS / SIA**：与企业的联合 AI 应用实验室

特色研究方向：

- **Continual Learning（持续学习）**：NTU 是这个方向的全球重镇
- **Computer Vision**：S-Lab 与商汤合作产出大量顶会论文
- **Robotics + AI**：NTU 工科背景让它在机器人 AI 方向有优势
- **AI for Engineering**：在材料、芯片设计、智能制造方向

国际合作上，NTU 与商汤、阿里达摩院、微软亚洲研究院都有深度合作，是中国 AI 圈在新加坡的主要对接窗口。`,
        whatItIsJa: `NTU の AI 領域におけるコア部門：

- **College of Computing and Data Science（CCDS）**：2024 年に SCSE からアップグレードされた、コンピュータサイエンスとデータサイエンスを統合
- **S-Lab**：商汤科技との共同実験室で、ビジョン、生成モデルを専門
- **Centre for Frontier AI Research（A*STAR と協力）**：共同研究センター
- **NTU Institute for AI Research**：学際的な AI 研究プラットフォーム
- **NTU Garage @ DBS / SIA**：企業との共同 AI アプリケーション実験室

特色研究方向：

- **Continual Learning（継続学習）**：NTU はこの方向の世界的拠点
- **Computer Vision**：S-Lab と商汤科技のコラボレーションから大量のトップカンファレンス論文を産出
- **Robotics + AI**：NTU の工学的背景がロボティクス AI 方向での優位性をもたらす
- **AI for Engineering**：材料、チップ設計、スマート製造方向

国際協力について、NTU は商汤科技、アリババ DAMO Academy、マイクロソフトアジア研究院と深い協力があり、シンガポールでの中国 AI 圏の主要な対接窓口です。`,
        whatItIsEn: `NTU's core AI units:

- **College of Computing and Data Science (CCDS)**: upgraded from SCSE in 2024, integrating computer science and data science
- **S-Lab**: joint laboratory with SenseTime, focused on vision and generative models
- **Centre for Frontier AI Research (with A*STAR)**: joint research centre
- **NTU Institute for AI Research**: cross-disciplinary AI research platform
- **NTU Garage @ DBS / SIA**: joint AI application labs with enterprises

Signature research directions:

- **Continual Learning**: NTU is a global hub for this area
- **Computer Vision**: the S-Lab–SenseTime collaboration produces a steady stream of top-tier conference papers
- **Robotics + AI**: NTU's engineering background gives it an edge in robotic AI
- **AI for Engineering**: in materials, chip design, and intelligent manufacturing

Internationally, NTU has deep collaborations with SenseTime, Alibaba DAMO Academy, and Microsoft Research Asia — making it the primary interface for China's AI scene in Singapore.`,
        aiRelevance: `NTU 在 AI 上和 NUS 形成清晰的差异化：

- **NUS**：偏基础研究、社会影响、政策研究
- **NTU**：偏工程应用、与产业合作、视觉/机器人方向

NTU 的论文产出在某些细分方向（CV、Continual Learning、Robotics）甚至超过 NUS。S-Lab 与商汤的合作让 NTU 在 CVPR / ICCV / ECCV 等顶会上有持续出场。

但 NTU 也面临一个问题：**与中国 AI 圈的深度绑定带来地缘风险**。S-Lab 的合作伙伴商汤被美国制裁后，NTU 需要重新平衡国际合作组合。这也是 NTU 近年加强与 Google DeepMind、AWS 合作的原因。

技术上，NTU 在 GenAI 方向的存在感弱于 NUS——它没有 SEA-LION 级别的旗舰项目，主要还是单点突破式的论文产出。这也是 CCDS 升级（2024）想要解决的问题：**整合分散的 AI 研究力量，形成更系统的输出**。`,
        aiRelevanceJa: `NTU は AI においてシンガポール NUS と明確な差別化を形成しています。

- **NUS**：基礎研究、社会的インパクト、政策研究に傾斜
- **NTU**：エンジニアリングアプリケーション、産業協力、ビジョン／ロボティクス方向に傾斜

NTU の論文産出は特定の細分野（CV、継続学習、ロボティクス）において NUS をも上回っています。S-Lab と商汤科技のコラボレーションにより、NTU は CVPR／ICCV／ECCV などのトップカンファレンスでの継続的な出場が可能です。

しかし NTU はまた問題に直面しています。**中国の AI サークルとの深い結びつきは地政学的リスクをもたらします**。S-Lab のパートナーである商汤科技が米国による制裁を受けた後、NTU は国際協力のポートフォリオを再調整する必要があります。これは近年、NTU が Google DeepMind と AWS との協力を強化している理由でもあります。

技術的には、NTU の GenAI 方向でのプレゼンスは NUS より弱いです——SEA-LION レベルのフラッグシッププロジェクトを持たず、主に点突破型の論文産出に依存しています。これは CCDS アップグレード（2024）が解決しようとしている問題でもあります。**分散された AI 研究力を統合し、より体系的な産出を形成する**ことです。`,
        aiRelevanceEn: `NTU has a clean differentiation from NUS in AI:

- **NUS**: leans towards foundational research, societal impact, and policy research
- **NTU**: leans towards engineering applications, industry partnerships, and vision/robotics

NTU's paper output even surpasses NUS in some sub-areas (CV, Continual Learning, Robotics). The S-Lab–SenseTime collaboration gives NTU consistent presence at top venues like CVPR / ICCV / ECCV.

But NTU also faces a problem: **deep entanglement with China's AI scene brings geopolitical risk**. After S-Lab's partner SenseTime was sanctioned by the US, NTU has had to rebalance its international collaboration portfolio. This is also why NTU has been strengthening ties with Google DeepMind and AWS in recent years.

Technically, NTU's presence in GenAI is weaker than NUS — it has no SEA-LION-class flagship project, and outputs are mostly single-point breakthrough papers. This is exactly what the 2024 CCDS upgrade is trying to address: **consolidating fragmented AI research forces into more systematic output**.`,
        singaporeRelevance: `NTU 在新加坡 AI 战略里是"工程化 + 国际合作"的支点。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：与 NUS 互补，NTU 偏视觉、机器人、工程 AI
- **杠杆 2（人才）**：NTU CCDS 是新加坡 AI 工程师的另一主要培养基地
- **杠杆 3（产业应用）**：NTU Garage 与 DBS、SIA 等大企业联合实验室是产业 AI 落地的样板

观点：**NTU 的"产业合作"模式是新加坡 AI 应用研究的"商业化样板"**——比 NUS 更接地气，比 A*STAR 更灵活。这种"高校 + 大企业联合实验室"的模式是新加坡产业 AI 落地最有效的机制之一。

但 NTU 在国家级 AI 旗舰项目里参与度不如 NUS——AISG 不在 NTU 校园，SEA-LION 主要由 NUS 团队主导。NAIS 2.0 时期 NTU 如何在国家叙事里找到差异化定位（比如成为"机器人 AI"或"视觉 AI"的国家级中心）是关键问题。

可观察的变量：CCDS 整合后能否产出旗舰项目、与商汤合作的未来安排、能否在 GenAI 方向迎头赶上。`,
        singaporeRelevanceJa: `NTU はシンガポール AI 戦略において「エンジニアリング + 国際協力」のレバーです。

「7 つの伝導レバー」において：

- **レバー 1（基礎研究）**：NUS と補完関係にあり、NTU はビジョン、ロボティクス、エンジニアリング AI に傾斜
- **レバー 2（人材）**：NTU CCDS はシンガポール AI エンジニアのもう 1 つの主要育成基地
- **レバー 3（産業応用）**：NTU Garage（DBS、SIA との）は産業 AI 展開のモデル

観点：**NTU の「産業協力」モデルはシンガポール AI アプリケーション研究の「商業化モデル」です**——NUS より実践的で、A*STAR より柔軟です。この「大学 + 大企業共同実験室」モデルは、シンガポール産業 AI 展開の最も効果的なメカニズムの 1 つです。

しかし NTU は国家級 AI フラッグシッププロジェクトでの参加度は NUS に劣ります——AISG は NTU キャンパスにはなく、SEA-LION は主に NUS チームが主導しています。NAIS 2.0 時代に NTU がナショナルナラティブにおいて差別化ポジションを見つけること（例えば、「ロボティクス AI」や「ビジョン AI」の国家級センターとなること）が重要な問題です。

観測可能な変数：CCDS 統合後、フラッグシッププロジェクトを産出できるか、商汤科技とのコラボレーションの今後の取り決め、GenAI 方向でキャッチアップできるか。`,
        singaporeRelevanceEn: `In Singapore's AI strategy, NTU plays the role of "engineering execution + international collaboration" pivot.

Across the seven transmission levers:

- **Lever 1 (Foundational Research)**: complementary to NUS, NTU leans towards vision, robotics, and engineering AI
- **Lever 2 (Talent)**: NTU CCDS is the other major pipeline for Singapore's AI engineers
- **Lever 3 (Industry Application)**: NTU Garage's joint labs with DBS, SIA, and other large enterprises are a model for industrial AI deployment

Take: **NTU's "industry partnership" model is the commercialisation template for Singapore's applied AI research** — more grounded than NUS, more flexible than A*STAR. The "university + large enterprise joint lab" pattern is one of the most effective mechanisms for industrial AI deployment in Singapore.

But NTU's involvement in national-level AI flagship projects lags NUS — AISG is not on the NTU campus, and SEA-LION is led primarily by NUS teams. A key question for the NAIS 2.0 era: how does NTU find a differentiated position in the national narrative (for example, becoming the national centre for "robotic AI" or "vision AI")?

Variables to watch: whether the post-integration CCDS produces flagship projects, the future of the SenseTime collaboration, and whether NTU can catch up in GenAI.`,
        milestones: [
          {
            date: '1981',
            title: 'NTU 前身南洋理工学院成立',
            titleJa: 'NTU の前身である南洋工科学院が成立した',
            titleEn: 'NTU predecessor Nanyang Technological Institute founded',
          },
          {
            date: '1991',
            title: '升格为 Nanyang Technological University',
            titleJa: 'Nanyang Technological University へ昇格した',
            titleEn: 'Upgraded to Nanyang Technological University',
          },
          {
            date: '2018',
            title: 'S-Lab 与商汤联合实验室成立',
            titleJa: 'S-Lab と SenseTime の合同実験室が成立した',
            titleEn: 'S-Lab joint laboratory with SenseTime established',
          },
          {
            date: '2024',
            title: 'College of Computing and Data Science 成立',
            titleJa: 'College of Computing and Data Science が成立した',
            titleEn: 'College of Computing and Data Science established',
            description: 'SCSE 升级整合数据科学研究力量。',
            descriptionJa: 'SCSE がデータサイエンス研究力の統合強化を実行した。',
            descriptionEn: 'SCSE upgraded to consolidate computing and data science research.',
          },
        ],
        relatedLeverNumbers: [1, 2, 3],
        relatedEntityIds: ['nus', 'a-star', 'ai-singapore'],
        sources: [
          {
            label: 'NTU 官网',
            labelJa: 'NTU 公式ウェブサイト',
            labelEn: 'NTU official site',
            url: 'https://www.ntu.edu.sg/',
            date: '2026-05-02',
          },
          { label: 'NTU CCDS', labelEn: 'NTU CCDS', url: 'https://www.ntu.edu.sg/computing' },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'smu',
        name: 'SMU',
        nameEn: 'SMU',
        description: '新加坡管理大学，AI 在商业与社会应用',
        descriptionJa: 'シンガポール経営大学、AI のビジネス・社会応用',
        descriptionEn: 'Singapore Management University; AI applications in business and society',
        url: 'https://www.smu.edu.sg/',
        entityType: 'university',
        status: 'active',
        founded: '2000',
        ministry: '教育部（MOE）',
        ministryJa: '教育省（MOE）',
        ministryEn: 'Ministry of Education (MOE)',
        scale: '在校生 1.1 万+；商科与社科为主，AI 偏应用方向',
        scaleJa: '在籍学生数1万1000人以上；商学と社会科学が中心；AI は応用指向です',
        scaleEn: '11,000+ students; focused on business and social sciences with applied AI emphasis',
        leaders: [
          {
            name: 'Lily Kong',
            title: '校长',
            titleJa: '学長',
            titleEn: 'President',
            personId: 'lily-kong',
          },
        ],
        summary:
          'SMU（Singapore Management University）是新加坡的"商科 + 社科"导向大学，2000 年成立。在 AI 领域，它的定位是**应用 AI + 政策 AI + 商业 AI**——School of Computing and Information Systems（SCIS）做应用研究，社会科学学院做 AI 政策分析。',
        summaryJa:
          'SMU（Singapore Management University）はシンガポールの「商学 + 社会科学」志向の大学であり、2000年に成立した。AI 分野では、その位置付けは**応用 AI + 政策 AI + ビジネス AI**です。School of Computing and Information Systems（SCIS）は応用研究を行い、社会科学学院は AI 政策分析を行っています。',
        summaryEn:
          'SMU (Singapore Management University) is a "business + social sciences" oriented university founded in 2000. In AI, it positions itself as **applied AI + policy AI + business AI** — the School of Computing and Information Systems (SCIS) handles applied research, while the social sciences faculties take on AI policy analysis.',
        whatItIs: `SMU 与 NUS / NTU 的差异化：

- **SMU 不做硬核基础研究**（不去刷 NeurIPS / ICML）
- **SMU 做应用 AI + 商业 AI**：SCIS 与本地金融、零售、政府部门有大量横向项目
- **SMU 有 AI 政策研究**：法学院、社科学院做 AI 治理、AI 与劳动力市场等议题

代表方向：

- **AI for Business**：决策支持、客户分析、运营优化
- **AI Ethics & Governance**：社科视角的 AI 政策研究
- **Behavioural AI**：人机交互、AI 在社会服务中的应用
- **FinTech AI**：与 MAS、新加坡金融机构合作`,
        whatItIsJa: `SMU と NUS／NTU との差別化：

- **SMU は基礎研究（NeurIPS／ICML でスコア稼ぐ）はしない**
- **SMU はアプリケーション AI + ビジネス AI をする**：SCIS はローカルの金融、小売、政府部門と大量の横断的プロジェクトがある
- **SMU は AI 政策研究を持つ**：法学院、社会科学学院が AI ガバナンス、AI と労働市場などのテーマに取り組む

代表方向：

- **AI for Business**：意思決定支援、顧客分析、運用最適化
- **AI Ethics & Governance**：社会科学的視点の AI 政策研究
- **Behavioural AI**：人機相互作用、社会サービスにおける AI アプリケーション
- **FinTech AI**：MAS、シンガポール金融機関との協力`,
        whatItIsEn: `SMU's differentiation from NUS / NTU:

- **SMU does not pursue hardcore foundational research** (no chasing NeurIPS / ICML)
- **SMU does applied AI + business AI**: SCIS runs many horizontal projects with local financial, retail, and government bodies
- **SMU does AI policy research**: the law and social sciences schools cover AI governance, AI's impact on the labour market, and similar issues

Representative directions:

- **AI for Business**: decision support, customer analytics, operations optimisation
- **AI Ethics & Governance**: AI policy research from a social science perspective
- **Behavioural AI**: human-computer interaction, AI in social services
- **FinTech AI**: collaborations with MAS and Singapore financial institutions`,
        aiRelevance: `SMU 在 AI 上的角色是"**应用研究的承接器**"——它不出顶尖技术，但能帮助本地企业和政府部门把 AI 真正用起来。

代表性贡献：

- 与 DBS、UOB 等银行的 AI 应用合作
- 与 IMDA、PDPC 的 AI 政策研究合作
- AI 在公共服务（教育、社会工作、就业辅导）中的部署研究

技术上不是 SMU 的强项，但 **SMU 的特色是"懂商业语言 + 懂技术"的混合人才培养**——这种"翻译层"人才在新加坡 AI 落地里非常稀缺。`,
        aiRelevanceJa: `SMU の AI における役割は「応用研究の受け皿」です——トップクラスの技術を生み出すのではなく、地元企業と政府部門が AI を本当に使い始めるのをサポートできます。

代表的な貢献：

- DBS、UOB などの銀行との AI アプリケーション協力
- IMDA、PDPC との AI 政策研究協力
- 公共サービス（教育、社会福祉、就職支援）における AI 配備研究

技術は SMU の強項ではありませんが、**SMU の特徴は「ビジネス言語を理解 + 技術を理解する」複合型人材の育成**です——このような「翻訳層」人材はシンガポール AI 展開において非常に稀少です。`,
        aiRelevanceEn: `SMU's role in AI is the "**delivery vehicle for applied research**" — it does not produce frontier technology, but helps local enterprises and government bodies actually put AI to work.

Representative contributions:

- AI application partnerships with banks like DBS and UOB
- AI policy research collaborations with IMDA and PDPC
- Deployment research for AI in public services (education, social work, employment counselling)

Technology is not SMU's strength, but **SMU's signature is producing hybrid talent who "speak business language and understand technology"** — this kind of "translation layer" talent is in very short supply for Singapore's AI deployment.`,
        singaporeRelevance: `SMU 在新加坡 AI 战略里是"**商业 AI + 政策 AI 的桥梁**"。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：商业 AI 应用研究主力
- **杠杆 4（治理）**：AI 政策与社会影响研究

观点：SMU 不是 AI 创新源头，但它是"**技术翻译为商业价值**"的关键节点。新加坡 AI 落地缺的不是技术（NUS / NTU / AISG / A*STAR 已经有），而是能把技术对接到商业场景的人才——SMU 培养的就是这类人。`,
        singaporeRelevanceJa: `SMU はシンガポール AI 戦略において「ビジネス AI + 政策 AI のブリッジ」です。

「7 つの伝導レバー」において：

- **レバー 3（産業応用）**：ビジネス AI アプリケーション研究の主力
- **レバー 4（ガバナンス）**：AI 政策と社会的インパクト研究

観点：SMU は AI イノベーションの源泉ではありませんが、それは「技術をビジネス価値に翻訳する」の重要なノードです。シンガポール AI 展開で不足しているのは技術ではなく（NUS／NTU／AISG／A*STAR がすでに持っている）、技術をビジネスシナリオに対接できる人材です——SMU が育成するのはこのような人です。`,
        singaporeRelevanceEn: `In Singapore's AI strategy, SMU is the "**bridge between business AI and policy AI**".

Across the seven transmission levers:

- **Lever 3 (Industry Application)**: the main force in business AI applied research
- **Lever 4 (Governance)**: AI policy and societal impact research

Take: SMU is not the source of AI innovation, but it is the key node that **"translates technology into business value"**. What Singapore's AI deployment lacks is not technology (NUS / NTU / AISG / A*STAR already provide that), but talent who can connect technology to business scenarios — and that is exactly what SMU produces.`,
        milestones: [
          {
            date: '2000',
            title: 'SMU 成立',
            titleJa: 'SMU が成立した',
            titleEn: 'SMU established',
          },
          {
            date: '2003',
            title: 'School of Information Systems 成立',
            titleJa: 'School of Information Systems が成立した',
            titleEn: 'School of Information Systems established',
          },
        ],
        relatedLeverNumbers: [3, 4],
        relatedEntityIds: ['nus', 'ntu', 'mas'],
        sources: [
          {
            label: 'SMU 官网',
            labelJa: 'SMU 公式ウェブサイト',
            labelEn: 'SMU official site',
            url: 'https://www.smu.edu.sg/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'sutd',
        name: 'SUTD',
        nameEn: 'SUTD',
        description: '新加坡科技设计大学，AI 与设计交叉创新',
        descriptionJa: 'シンガポール科技設計大学、AI とデザインの交差創新',
        descriptionEn: 'Singapore University of Technology and Design; innovation at the intersection of AI and design',
        url: 'https://www.sutd.edu.sg/',
        entityType: 'university',
        status: 'active',
        founded: '2009',
        ministry: '教育部（MOE）',
        ministryJa: '教育省（MOE）',
        ministryEn: 'Ministry of Education (MOE)',
        scale: '在校生 ~2000；与 MIT 合作建校；强项在 AI + 设计 + 工程交叉',
        scaleJa: '在籍学生数約2000人；MIT との共同で建学；AI、デザイン、エンジニアリングの統合が強項です',
        scaleEn:
          '~2,000 students; founded in partnership with MIT; strengths in AI + design + engineering intersection',
        leaders: [
          {
            name: 'Phoon Kok Kwang',
            title: '校长',
            titleJa: '学長',
            titleEn: 'President',
            personId: 'phoon-kok-kwang',
          },
        ],
        summary:
          'SUTD（Singapore University of Technology and Design）是新加坡 4 所国立大学中最年轻、最特殊的一所——2009 年与 MIT 合作创立，定位是"科技 + 设计 + 创业"的交叉型大学。在 AI 领域，它的特色是 **AI + 工程 + 设计** 的跨界路线。',
        summaryJa:
          'SUTD（Singapore University of Technology and Design）はシンガポールの4つの国立大学の中で最も若く、最も特殊な大学です。2009年に MIT との共同で設立され、「テクノロジー + デザイン + アントレプレナーシップ」の交差型大学として位置付けられています。AI 分野では、その特徴は**AI + エンジニアリング + デザイン**のクロスボーダー路線です。',
        summaryEn:
          'SUTD (Singapore University of Technology and Design) is the youngest and most unusual of Singapore\'s four national universities — founded in 2009 in partnership with MIT, positioned as a cross-disciplinary university of "technology + design + entrepreneurship". In AI, its signature is the **AI + engineering + design** crossover path.',
        whatItIs: `SUTD 的与众不同之处：

- **跨学科本质**：所有学生都要学设计、工程、人文
- **MIT 基因**：课程体系部分参考 MIT，强调动手做
- **小而精**：只有 2000 学生，但人均资源充足

AI 相关单位：

- **Information Systems Technology and Design（ISTD）**：CS / AI 主力
- **Design AI Lab**：AI 在设计领域的应用
- **iTrust**：网络安全与 AI 安全研究

特色研究方向：

- **AI for Design**：生成式 AI 在建筑、产品设计的应用
- **AI Safety**：与 iTrust 结合的对抗性 AI 研究
- **Embedded AI**：AI 与硬件、机器人的结合`,
        whatItIsJa: `SUTD の独特なところ：

- **学際的本質**：すべての学生がデザイン、エンジニアリング、人文を学ぶ必要がある
- **MIT の遺伝子**：カリキュラム体系は部分的に MIT を参考にし、実践を重視
- **小さくて精緻**：学生数は 2000 人のみですが、学生 1 人当たりのリソースは十分

AI 関連部門：

- **Information Systems Technology and Design（ISTD）**：CS／AI の主力
- **Design AI Lab**：デザイン領域における AI アプリケーション
- **iTrust**：サイバーセキュリティと AI セキュリティ研究

特色研究方向：

- **AI for Design**：生成 AI の建築、プロダクトデザインへのアプリケーション
- **AI Safety**：iTrust と組み合わせた敵対的 AI 研究
- **Embedded AI**：AI とハードウェア、ロボティクスの結合`,
        whatItIsEn: `What sets SUTD apart:

- **Cross-disciplinary by nature**: every student studies design, engineering, and humanities
- **MIT DNA**: the curriculum partially follows MIT, with strong emphasis on hands-on building
- **Small but well-resourced**: only 2,000 students, but with abundant per-capita resources

AI-related units:

- **Information Systems Technology and Design (ISTD)**: the main CS / AI unit
- **Design AI Lab**: AI applied to design
- **iTrust**: cybersecurity and AI safety research

Signature research directions:

- **AI for Design**: generative AI applied to architecture and product design
- **AI Safety**: adversarial AI research in collaboration with iTrust
- **Embedded AI**: AI combined with hardware and robotics`,
        aiRelevance: `SUTD 在 AI 上的差异化非常清楚：**不和 NUS / NTU 比规模和论文数量，而在"AI + X"交叉领域找空间**。

AI for Design 是最有特色的方向——SUTD 的设计学院让它能做"AI 辅助创意工作"的前沿研究，这是其他工科大学做不了的。Generative AI 时代这个方向的价值进一步放大。

技术上 SUTD 的产出规模有限（学校体量小），但单点突破能力强。`,
        aiRelevanceJa: `SUTD における AI の差別化は非常に明確です。**NUS／NTU の規模と論文数では競わず、「AI + X」の交差領域でスペースを見つけます**。

AI for Design は最も特徴的な方向です——SUTD のデザイン学院があることで、「生成 AI がデザイン業務を支援する」前沿研究ができます。これは他の工学系大学ではできません。生成 AI 時代、この方向の価値はさらに拡大しています。

技術的には、SUTD の産出規模は限定的です（学校規模が小さい）が、単点突破能力は強いです。`,
        aiRelevanceEn: `SUTD's differentiation in AI is very clear: **don't compete with NUS / NTU on scale or paper count — find space in "AI + X" crossover areas**.

AI for Design is its most distinctive direction — SUTD's design school enables it to do frontier research on "AI-assisted creative work", which other engineering universities cannot match. This direction's value is further amplified in the Generative AI era.

Technically, SUTD's output is limited in scale (the school is small), but it has strong single-point breakthrough capacity.`,
        singaporeRelevance: `SUTD 在新加坡 AI 战略里是"**实验性的小而精节点**"。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：在小众交叉领域的探索
- **杠杆 2（人才）**：培养"懂设计、懂技术"的复合型 AI 人才

观点：SUTD 的存在让新加坡高校体系**避免了"NUS 和 NTU 同质化竞争"的风险**——它走交叉创新路线，与两所综合性大学形成互补。`,
        singaporeRelevanceJa: `SUTD はシンガポール AI 戦略において「実験的で小さくて精緻なノード」です。

「7 つの伝導レバー」において：

- **レバー 1（基礎研究）**：小さなニッチな交差領域での探索
- **レバー 2（人材）**：「デザインを理解し、技術を理解する」複合型 AI 人材の育成

観点：SUTD の存在により、シンガポール高等教育体系は「NUS と NTU の同質化競争」のリスクを回避しました——交差イノベーション戦略を取り、2 つの総合型大学と補完関係を形成しています。`,
        singaporeRelevanceEn: `In Singapore's AI strategy, SUTD is the "**experimental small-but-sharp node**".

Across the seven transmission levers:

- **Lever 1 (Foundational Research)**: exploration in niche crossover areas
- **Lever 2 (Talent)**: cultivating "design + technology" hybrid AI talent

Take: SUTD's existence saves the Singapore university system from **"the risk of NUS-and-NTU homogeneous competition"** — it takes the crossover-innovation route and complements the two comprehensive universities.`,
        milestones: [
          {
            date: '2009',
            title: 'SUTD 与 MIT 合作创立',
            titleJa: 'SUTD が MIT との共同で創立された',
            titleEn: 'SUTD founded in partnership with MIT',
          },
          {
            date: '2012',
            title: '首届学生入学',
            titleJa: '初期の学生が入学した',
            titleEn: 'First cohort enrolled',
          },
        ],
        relatedLeverNumbers: [1, 2],
        relatedEntityIds: ['nus', 'ntu'],
        sources: [
          {
            label: 'SUTD 官网',
            labelJa: 'SUTD 公式ウェブサイト',
            labelEn: 'SUTD official site',
            url: 'https://www.sutd.edu.sg/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '治理体系',
    nameJa: 'ガバナンスシステム',
    nameEn: 'Governance Framework',
    icon: '⚖️',
    description: '多层次 AI 治理框架与监管机构',
    descriptionJa: '多層的 AI ガバナンスフレームワークと規制機構',
    descriptionEn: 'Layered AI governance frameworks and regulators',
    entities: [
      {
        id: 'pdpc',
        name: 'PDPC',
        nameEn: 'PDPC',
        description: '个人数据保护委员会，数据治理与隐私保护',
        descriptionJa: '個人データ保護委員会、データガバナンスとプライバシー保護',
        descriptionEn: 'Personal Data Protection Commission; data governance and privacy protection',
        url: 'https://www.pdpc.gov.sg/',
        entityType: 'agency',
        status: 'active',
        founded: '2013-01',
        parentOrg: 'IMDA 下属机构',
        parentOrgJa: 'IMDA 傘下の機構',
        parentOrgEn: 'A division of IMDA',
        parentEntityId: 'imda',
        ministry: '通讯及新闻部（MCI）',
        ministryJa: '通信・ニュース部（MCI）',
        ministryEn: 'Ministry of Communications and Information (MCI)',
        scale: '执法 PDPA（个人数据保护法），处理隐私违规投诉与处罚',
        scaleJa: 'PDPA（個人データ保護法）の執行、プライバシー違反苦情と処罰の処理',
        scaleEn: 'Enforces the PDPA (Personal Data Protection Act); handles privacy complaints and sanctions',
        leaders: [
          {
            name: 'Ng Cher Pong',
            title: '数据保护委员',
            titleJa: 'データ保護委員',
            titleEn: 'Commissioner',
            personId: 'ng-cher-pong',
          },
          {
            name: 'Denise Wong',
            title: '副委员',
            titleJa: '副委員',
            titleEn: 'Deputy Commissioner',
            personId: 'denise-wong',
          },
        ],
        summary:
          'PDPC（Personal Data Protection Commission）是新加坡的个人数据保护监管机构，2013 年成立，挂靠 IMDA。它执行《个人数据保护法》（PDPA），是新加坡 AI 治理的"数据合规底座"——所有 AI 系统涉及个人数据的部分都要受 PDPA 约束。',
        summaryJa:
          'PDPC（Personal Data Protection Commission）はシンガポールの個人データ保護規制機構であり、2013年に成立し、IMDA に附属しています。《個人データ保護法》（PDPA）を執行しており、シンガポール AI ガバナンスの「データコンプライアンスの基盤」です。すべての AI システムが個人データに関係する部分は PDPA の制約を受けます。',
        summaryEn:
          "PDPC (Personal Data Protection Commission) is Singapore's data protection regulator, established in 2013 and housed within IMDA. It enforces the Personal Data Protection Act (PDPA) and serves as the **data-compliance bedrock** of Singapore's AI governance — every part of an AI system that touches personal data falls under the PDPA.",
        whatItIs: `PDPC 的核心职能：

- **PDPA 执法**：处理数据泄露通报、消费者投诉、罚款决定（最高 SGD 100 万或营收 10%）
- **指引发布**：发布行业适用的数据保护指引（金融、医疗、教育、科技等）
- **DPO（数据保护官）认证**：要求企业指定数据保护官，PDPC 提供培训
- **AI 数据治理指引**：与 IMDA 合作发布 AI 系统使用个人数据的具体规则

与 AI 直接相关的 PDPC 动作：

- **2024 GenAI Personal Data 指引**：明确 LLM 训练能否使用个人数据、生成内容侵权责任
- **跨境数据流动规则**：影响海外 AI 服务在新加坡的合规成本
- **同意机制创新**：支持"目的限定 + 替代同意"等灵活机制，给 AI 训练数据合规留口子

PDPC 的执法风格相对温和，更多走"指引 + 整改"路线，重大处罚案例不算多。但 PDPA 的存在本身就让所有 AI 玩家必须把"数据合规"作为第一性约束。`,
        whatItIsJa: `PDPC の中核的機能：

- **PDPA 執行**：データ侵害通知の処理、消費者苦情、罰金決定（最大 SGD 100万またはターンオーバー 10%）
- **ガイダンス発行**：業界に適用可能なデータ保護ガイダンス発行（金融、医療、教育、技術など）
- **DPO（データ保護責任者）認証**：企業がデータ保護責任者の指定を要求、PDPC が訓練を提供
- **AI データガバナンスガイダンス**：IMDA と協力し、AI システムが個人データを使用するための具体的ルールを発行

AI に直接関連する PDPC の措置：

- **2024 GenAI Personal Data ガイダンス**：LLM 学習が個人データを使用できるか否か、生成コンテンツの著作権責任を明確にする
- **越境データフロー規則**：海外 AI サービスのシンガポール内コンプライアンスコストに影響
- **同意メカニズム革新**：「目的制限 + 代替同意」など柔軟なメカニズムをサポート、AI 学習データコンプライアンスに抜け道を与える

PDPC の執行スタイルは比較的緩和的であり、より多く「ガイダンス + 是正」路線を進み、重大な処罰事例は多くありません。しかし PDPA の存在自体が、すべての AI プレイヤーが「データコンプライアンス」を最初の制約として設定することを必須にしています。`,
        whatItIsEn: `PDPC's core functions:

- **PDPA enforcement**: handles breach notifications, consumer complaints, and penalty decisions (up to S$1 million or 10% of revenue)
- **Guidance publication**: issues sector-specific data protection guidance (finance, healthcare, education, tech, etc.)
- **DPO (Data Protection Officer) certification**: requires companies to appoint a DPO; PDPC provides training
- **AI data governance guidance**: works with IMDA to publish concrete rules on how AI systems may use personal data

PDPC actions directly relevant to AI:

- **2024 GenAI Personal Data guidance**: clarifies whether LLM training can use personal data and addresses liability for generated content infringement
- **Cross-border data flow rules**: shape the compliance cost of overseas AI services operating in Singapore
- **Consent mechanism innovation**: supports flexible mechanisms such as "purpose-bounded + alternative consent", leaving room for AI training data compliance

PDPC's enforcement style is relatively mild, leaning toward "guidance + remediation" rather than headline-grabbing fines. But the existence of PDPA itself forces every AI player to treat "data compliance" as a first-principle constraint.`,
        aiRelevance: `PDPC 在 AI 治理体系里是"**数据使用许可的看门人**"。

任何 AI 系统在新加坡运营都要回答 PDPC 的两个问题：

- **训练数据合规**：你的训练语料里有没有个人数据？如果有，是否取得了合法同意？
- **推理时合规**：你的 AI 服务推理时使用用户数据是否合规？数据是否跨境传输？

这两个问题对 LLM 玩家尤其麻烦：

- 通用 LLM 训练几乎不可能完全避开个人数据（互联网爬取语料中必然包含）
- LLM 服务推理时的对话内容也是个人数据
- 跨境调用海外 LLM API（如 OpenAI）涉及数据出境

PDPC 在 2024 年的 GenAI 指引里给了一些松绑：明确"商业利益例外"、"公开数据训练"等场景的合规路径。但**核心约束没变——你必须能解释数据从哪来、用到哪去、如何最小化**。

技术层面，PDPC 的指引推动了几个本地实践：

- 联邦学习（Synergos 等）的研发
- 差分隐私在金融业的应用
- 本地化 LLM（如 SEA-LION 在金融场景）的合规优势`,
        aiRelevanceJa: `PDPC は AI ガバナンス体系において「データ使用許可のゲートキーパー」です。

シンガポールで営業する任意の AI システムは、PDPC の 2 つの質問に答える必要があります。

- **訓練データコンプライアンス**：訓練コーパスに個人データが含まれていますか？含まれている場合、合法的な同意を得ていますか？
- **推論時コンプライアンス**：AI サービスの推論時にユーザーデータを使用することはコンプライアンスですか？データはクロスボーダー送信されていますか？

これら 2 つの質問は、LLM プレイヤーにとって特に厄介です。

- 汎用 LLM の訓練はほぼ個人データを完全に回避不可（インターネットクローリングコーパスには必然的に含まれる）
- LLM サービス推論時の会話コンテンツもまた個人データ
- 海外 LLM API（OpenAI など）のクロスボーダー呼び出しはデータ出境に関わる

PDPC は 2024 年の GenAI 指針で若干の緩和を与えました。「商業利益の例外」、「公開データ訓練」などのシナリオでの適法性パスを明確にしました。しかし**コア制約は変わっていません——データがどこから来て、どこへ行き、どのように最小化されるかを説明する必要があります**。

技術レベルでは、PDPC の指針が複数の現地実践を促進しました。

- フェデレーテッドラーニング（Synergos など）の開発
- 金融業でのディファレンシャルプライバシー適用
- ローカライズ LLM（金融シナリオの SEA-LION など）のコンプライアンス上の利点`,
        aiRelevanceEn: `Within Singapore's AI governance stack, PDPC plays the role of **gatekeeper for permission to use data**.

Any AI system operating in Singapore has to answer two PDPC questions:

- **Training data compliance**: does your training corpus contain personal data? If so, was lawful consent obtained?
- **Inference-time compliance**: does your AI service handle user data lawfully at inference time? Is there cross-border transfer?

These two questions are particularly painful for LLM players:

- General LLM training is virtually impossible without touching personal data (web-crawled corpora always include it)
- The conversation content during LLM service inference is itself personal data
- Cross-border calls to overseas LLM APIs (e.g., OpenAI) involve data export

PDPC's 2024 GenAI guidance offered some relief: it clarified compliance pathways for "legitimate business interest exceptions" and "training on publicly available data". But **the core constraint is unchanged — you must be able to explain where data came from, where it goes, and how it is minimised**.

On the technical side, PDPC's guidance has pushed several local practices:

- R&D in federated learning (Synergos and others)
- Adoption of differential privacy in finance
- Compliance advantages for localised LLMs (e.g., SEA-LION in financial scenarios)`,
        singaporeRelevance: `PDPC 是新加坡 AI 治理的"**数据维度**"——和 IMDA 的"伦理维度"、MAS 的"行业维度"形成三角。

在「七条传导杠杆」里：

- **杠杆 4（治理）**：数据合规的执法主体
- **杠杆 6（外交）**：PDPA 与 GDPR 的部分等价让新加坡在数据跨境合作上有优势

观点：**PDPC 的存在让"主权 AI" / "本地化 AI"在新加坡有真实的商业理由**——SEA-LION、本地金融业 LLM 等本地化路线不只是"民族叙事"，而是 PDPA 合规约束的直接结果。如果新加坡没有 PDPA，企业可以无脑用 OpenAI / Anthropic，本地 AI 价值会被稀释。

这也解释了为什么 PDPC 在 GenAI 时代相对克制：**它知道如果监管太严会让本地 AI 落地停滞，监管太松会让数据隐私崩塌**——它在走"务实合规"的中间路线。

可观察的张力：**PDPC vs MAS 的协调**（金融业 AI 同时受两家监管）、**PDPC 与 AI Verify 的关系**（数据合规 vs 模型治理）、**跨境数据流动规则**（影响 SEA-LION 训练数据来源、海外 API 使用）。`,
        singaporeRelevanceJa: `PDPC はシンガポール AI 治理の「**データ次元**」です。IMDA の「倫理次元」および MAS の「産業次元」と三角形を形成しています。

「7つの伝導レバー」では：

- **レバー 4（ガバナンス）**：データコンプライアンス執行の主体
- **レバー 6（外交）**：PDPA と GDPR の部分的等価性により、シンガポールはデータの越境協力における利点を有します

見方：**PDPC の存在は、シンガポールで「ソブリン AI」/「ローカライズ AI」に真実の商業的根拠をもたらしています**。SEA-LION や地元金融機関の LLM など、ローカライズ戦略は単なる「民族的叙事」ではなく、PDPA コンプライアンス制約の直接的結果です。シンガポールに PDPA がなければ、企業は無思考に OpenAI / Anthropic を使用でき、ローカル AI の価値は希釈されます。

これはまた、GenAI 時代に PDPC が比較的節度を持つ理由を説明しています：**監督が厳しすぎるとローカル AI の展開が停滞し、監督が緩すぎるとデータプライバシーが崩壊することを知っているため**です。「実用的コンプライアンス」の中道を歩んでいます。

観察可能な緊張関係：**PDPC vs MAS の調整**（金融業の AI は両機関の監督を同時に受けています）、**PDPC と AI Verify の関係**（データコンプライアンス vs モデルガバナンス）、**越境データフロー規則**（SEA-LION の学習データソース、海外 API 使用に影響）。`,
        singaporeRelevanceEn: `PDPC is the **data dimension** of Singapore's AI governance — forming a triangle with IMDA's "ethics dimension" and MAS's "sector dimension".

In the "seven transmission levers" framework:

- **Lever 4 (governance)**: the enforcement body for data compliance
- **Lever 6 (international)**: partial equivalence between PDPA and GDPR gives Singapore an edge on cross-border data cooperation

A take: **PDPC's existence gives "sovereign AI" / "localised AI" a real commercial rationale in Singapore** — SEA-LION and local financial-sector LLMs are not just a "national narrative" but a direct consequence of PDPA compliance constraints. Without PDPA, enterprises could mindlessly adopt OpenAI / Anthropic and the value of local AI would be diluted.

This also explains why PDPC has stayed relatively restrained in the GenAI era: **it knows that over-regulation would stall local AI deployment, while under-regulation would shatter data privacy** — it is walking a "pragmatic compliance" middle path.

Tensions worth watching: **PDPC vs MAS coordination** (financial-sector AI sits under both regulators), **PDPC's relationship with AI Verify** (data compliance vs model governance), and **cross-border data flow rules** (which affect SEA-LION's training data sources and overseas API usage).`,
        milestones: [
          {
            date: '2013-01',
            title: 'PDPC 成立，PDPA 通过',
            titleJa: 'PDPC が成立し、PDPA が成立した',
            titleEn: 'PDPC established and PDPA enacted',
          },
          {
            date: '2014-07',
            title: 'PDPA 数据保护条款全面生效',
            titleJa: 'PDPA データ保護条項が全面的に有効になった',
            titleEn: 'PDPA data protection provisions take full effect',
          },
          {
            date: '2020-11',
            title: 'PDPA 大幅修订',
            titleJa: 'PDPA が大幅に改正された',
            titleEn: 'PDPA major amendment',
            description: '加入数据可携带权、强制泄露通报、提高处罚上限。',
            descriptionJa: 'データポータビリティ権、強制的な漏洩通知、処罰上限の引き上げが追加された。',
            descriptionEn: 'Added data portability rights, mandatory breach notification, raised penalty caps.',
          },
          {
            date: '2024',
            title: '发布 GenAI Personal Data 指引',
            titleJa: 'GenAI Personal Data ガイドラインが発行された',
            titleEn: 'Released GenAI Personal Data guidance',
          },
        ],
        relatedLeverNumbers: [4],
        relatedEntityIds: ['imda', 'mas', 'ai-verify-foundation'],
        sources: [
          {
            label: 'PDPC 官网',
            labelJa: 'PDPC 公式サイト',
            labelEn: 'PDPC official site',
            url: 'https://www.pdpc.gov.sg/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'imda',
        name: 'IMDA',
        nameEn: 'IMDA',
        description: '资讯通信媒体发展局，AI 治理框架制定主体',
        descriptionJa: '情報通信メディア発展局、AI ガバナンスフレームワーク制定主体',
        descriptionEn: 'Infocomm Media Development Authority; lead agency for AI governance frameworks',
        url: 'https://www.imda.gov.sg/',
        entityType: 'agency',
        status: 'active',
        founded: '2016-10',
        ministry: '通讯及新闻部（MCI）',
        ministryJa: '通信・ニュース部（MCI）',
        ministryEn: 'Ministry of Communications and Information (MCI)',
        scale: '员工 1500+；管辖电信、广播、媒体、AI 治理等领域',
        scaleJa: '従業員1500人以上；通信、放送、メディア、AI ガバナンスなどの分野を管轄しています',
        scaleEn: '1,500+ staff; oversees telecoms, broadcasting, media, and AI governance',
        leaders: [
          {
            name: 'Ng Cher Pong',
            title: '首席执行官',
            titleJa: '最高経営責任者（CEO）',
            titleEn: 'CEO',
            personId: 'ng-cher-pong',
          },
          {
            name: 'Aileen Chia',
            title: '副执行长（连接发展与监管）',
            titleJa: '副執行長（接続発展と規制）',
            titleEn: 'Deputy Chief Executive (Connectivity Development & Regulation)',
            personId: 'aileen-chia',
          },
          {
            name: 'Kiren Kumar',
            title: '副执行长（发展）',
            titleJa: '副執行長（発展）',
            titleEn: 'Deputy Chief Executive (Development)',
            personId: 'kiren-kumar',
          },
          {
            name: 'Denise Wong',
            title: '助理执行长（数据创新与保护）',
            titleJa: 'アシスタント執行長（データイノベーション・保護）',
            titleEn: 'Assistant Chief Executive (Data Innovation & Protection)',
            personId: 'denise-wong',
          },
          {
            name: 'Ong Chen Hui',
            title: '助理执行长（企业科技）',
            titleJa: 'アシスタント執行長（エンタープライズテクノロジー）',
            titleEn: 'Assistant Chief Executive (BizTech)',
            personId: 'ong-chen-hui',
          },
        ],
        summary:
          'IMDA（Infocomm Media Development Authority）是新加坡的"信息通信 + 媒体 + AI 治理"综合监管机构，2016 年由 IDA 和 MDA 合并而成。在 AI 领域，它是**新加坡 AI 治理体系的"中央设计师"**——Model AI Governance Framework（MGF）、AI Verify、Generative AI 治理框架等几乎所有重要的治理文件，都出自 IMDA。',
        summaryJa:
          'IMDA（Infocomm Media Development Authority）はシンガポールの「情報通信 + メディア + AI ガバナンス」総合規制機構であり、2016年に IDA と MDA の合併によって成立した。AI 分野では、それはシンガポール AI ガバナンスシステムの「中央デザイナー」です。Model AI Governance Framework（MGF）、AI Verify、Generative AI ガバナンスフレームワークなど、ほぼすべての重要なガバナンス文書は IMDA から出ています。',
        summaryEn:
          'IMDA (Infocomm Media Development Authority) is Singapore\'s integrated regulator covering "infocomm + media + AI governance", formed in 2016 from the merger of IDA and MDA. On the AI front, it is **the central designer of Singapore\'s AI governance system** — virtually every major governance document, from the Model AI Governance Framework (MGF) to AI Verify and the Generative AI governance framework, originates from IMDA.',
        whatItIs: `IMDA 是新加坡数字经济的核心监管机构，职能横跨：

- **电信与互联网监管**：频谱、宽带、网络中立性等基础设施监管
- **媒体监管**：广播、电影分级、内容审查
- **数字化转型**：推动企业、政府数字化（SGTech、SMEs Go Digital 等计划）
- **AI 治理**：制定全国性 AI 治理框架，是新加坡对外输出"AI 治理标准"的主体

在 AI 治理上，IMDA 不像欧盟 AI Act 那样走"强制性立法"路线，而是走"原则 + 自愿采纳 + 国际化"的路线。这套打法的代表作是：

- **Model AI Governance Framework（MGF）**：2019 首版，2020 v2，2024 又出 Generative AI Framework
- **AI Verify**：2022 发布，是全球首个开源的 AI 治理测试框架（后独立成 AI Verify Foundation）
- **AI 治理国际合作**：与 OECD、GPAI、ISO 共同制定 AI 标准`,
        whatItIsJa: `IMDA はシンガポール デジタル経済の中核監督機関であり、職能は以下をまたぎます：

- **電信とインターネット監督**：周波数、ブロードバンド、ネット中立性など基礎設備監督
- **メディア監督**：放送、映画分級、コンテンツ審査
- **デジタル化転換**：企業、政府デジタル化推進（SGTech、SMEs Go Digital など計画）
- **AI ガバナンス**：全国的 AI ガバナンスフレームワーク制定、シンガポールが「AI ガバナンス標準」を国際的に出力する主体

AI ガバナンスでは、IMDA は EU AI Act のような「強制的立法」路線を進まずに、「原則 + 自主的採用 + 国際化」の路線を進みます。このやり方の代表作は：

- **Model AI Governance Framework（MGF）**：2019 初版、2020 v2、2024 また Generative AI Framework を出ます
- **AI Verify**：2022 発行、世界初のオープンソース AI ガバナンステストフレームワーク（その後 AI Verify Foundation に独立）
- **AI ガバナンス国際協力**：OECD、GPAI、ISO と共に AI 標準を制定`,
        whatItIsEn: `IMDA is Singapore's core regulator for the digital economy, with responsibilities spanning:

- **Telecoms and internet regulation**: spectrum, broadband, net neutrality, and other infrastructure oversight
- **Media regulation**: broadcasting, film classification, content review
- **Digital transformation**: pushing enterprise and government digitalisation (SGTech, SMEs Go Digital, etc.)
- **AI governance**: setting national AI governance frameworks; the lead agency for exporting Singapore's "AI governance standards"

On AI governance, IMDA does not follow the EU AI Act's "mandatory legislation" path. Instead, it walks a "principles + voluntary adoption + internationalisation" route. The flagship outputs of this approach:

- **Model AI Governance Framework (MGF)**: first edition in 2019, v2 in 2020, then a Generative AI Framework in 2024
- **AI Verify**: released in 2022, the world's first open-source AI governance testing framework (later spun off into the AI Verify Foundation)
- **AI governance international cooperation**: jointly developing AI standards with OECD, GPAI, and ISO`,
        aiRelevance: `IMDA 在 AI 领域的角色不是"做 AI"，而是"定义 AI 怎么做"。

它的战略选择非常清楚：

- **不走立法路径**：避免欧盟 AI Act 那样的"重监管、慢落地"
- **走"工具化治理"路径**：把治理原则变成可运行的测试套件（AI Verify），让企业自评估
- **绑定国际标准**：MGF 主动对标 NIST AI RMF、ISO/IEC 42001、OECD AI Principles，让 IMDA 制定的标准能被国际认可

这条路的优势是：**新加坡可以在不养庞大监管队伍、不立法的前提下，对外输出 AI 治理的"工具标准"**。AI Verify 已经被全球 50+ 企业采用（包括 IBM、Singtel、Standard Chartered），这是新加坡软实力的真实体现。

劣势也很明显：**自愿采纳 = 没有牙齿**。如果某个 AI 系统造成实际危害，IMDA 缺乏直接的执法工具，要靠 PDPC、MAS、MOH 等行业监管机构去配合。`,
        aiRelevanceJa: `AI 領域における IMDA の役割は「AI を行う」ことではなく、「AI をいかに行うか」を定義することです。

その戦略的選択は非常に明確です：

- **立法路線を進まない**：EU AI Act のような「強い規制、遅い展開」を回避
- **「ツール化ガバナンス」路線を進む**：ガバナンス原則を実行可能なテストスイート（AI Verify）に変え、企業の自己評価を実現
- **国際標準に結合**：MGF は NIST AI RMF、ISO/IEC 42001、OECD AI Principles に主動的に対標し、IMDA が制定する標準が国際的に認識される

この路線の利点は：**シンガポールは、大規模な監督チームを維持せず、立法することなく、AI ガバナンスの「ツール標準」を国際的に出力できる**ことです。AI Verify は既に世界 50+ 企業（IBM、Singtel、Standard Chartered を含む）により採用されており、これはシンガポールのソフトパワーの真の体現です。

欠点も明らかです：**自主的採用 = 歯がない**。特定の AI システムが実際の損害をもたらした場合、IMDA は直接的な執行ツールに欠け、PDPC、MAS、MOH など業界監督機関の協力に頼る必要があります。`,
        aiRelevanceEn: `IMDA's role in AI is not "doing AI" but "defining how AI is done."

Its strategic choices are very clear:

- **Avoid the legislative route**: side-step the EU AI Act's "heavy regulation, slow deployment" trap
- **Take the "tooled governance" route**: turn governance principles into runnable test suites (AI Verify) so enterprises can self-assess
- **Anchor to international standards**: MGF deliberately aligns with NIST AI RMF, ISO/IEC 42001, and OECD AI Principles, so IMDA's standards gain international recognition

The advantage of this path: **Singapore can export AI governance "tool standards" without sustaining a large regulatory bureaucracy or passing legislation**. AI Verify has been adopted by 50+ enterprises globally (including IBM, Singtel, Standard Chartered) — a real expression of Singapore's soft power.

The downside is just as obvious: **voluntary adoption = no teeth**. When an AI system causes real harm, IMDA lacks direct enforcement tools and has to lean on sector regulators like PDPC, MAS, and MOH to follow up.`,
        singaporeRelevance: `IMDA 是新加坡 AI 战略中**对外输出能力的关键枢纽**。

在「七条传导杠杆」里：

- **杠杆 4（治理）**：IMDA 是新加坡 AI 治理的总设计师
- **杠杆 6（外交）**：MGF 和 AI Verify 是新加坡在 GPAI、Bletchley/Seoul 峰会、OECD 的"治理名片"
- **杠杆 3（产业应用）**：通过 SMEs Go Digital 等计划推动企业 AI 落地

观点：**IMDA 的 AI 治理路线是新加坡"小国大策略"的典型样板**——不和欧盟比立法、不和美国比技术、不和中国比规模，而是抢占"治理工具与标准"这个细分赛道。AI Verify 这一步走得非常聪明：开源 + 国际可用 + 工具化，让新加坡成为"AI 治理的瑞士"。

但 IMDA 也有结构性挑战：**通讯、媒体、AI 三个职能在同一个机构，注意力被严重稀释**。AI 治理只是它的"第三个孩子"，预算、注意力、人才都在和电信监管竞争。NAIS 2.0 时期是否要把 AI 治理职能独立出去（比如让 AI Verify Foundation 接管），是值得观察的问题。`,
        singaporeRelevanceJa: `IMDA はシンガポール AI 戦略における**対外的出力能力の重要なハブ**です。

「7つの伝導レバー」では：

- **レバー 4（ガバナンス）**：IMDA はシンガポール AI ガバナンスの総合設計者です
- **レバー 6（外交）**：MGF と AI Verify は、GPAI、Bletchley/Seoul サミット、OECD における、シンガポールの「ガバナンスビジネスカード」です
- **レバー 3（産業応用）**：SMEs Go Digital などの計画を通じて、企業 AI 展開を推進します

見方：**IMDA の AI ガバナンス路線は、シンガポールの「小国大戦略」の典型的な見本です**。EU と立法を競い、米国と技術を競い、中国と規模を競わずに、「ガバナンスツールと標準」というニッチな賽道を占領します。AI Verify はこの一手を非常に賢く進めました：オープンソース + 国際的に使用可能 + ツール化により、シンガポールは「AI ガバナンスのスイス」になります。

しかし IMDA には構造的な課題があります：**通信、メディア、AI という3つの職能が同一機関内にあり、注意が著しく分散**しています。AI ガバナンスはそれの「3番目の子」に過ぎず、予算、注意、人材は通信監督との競争にあります。NAIS 2.0 の時期に AI ガバナンス職能を独立させるべきか（例えば AI Verify Foundation に管理を任せる）、観察する価値のある問題です。`,
        singaporeRelevanceEn: `IMDA is the **key hub for Singapore's externally projected AI capability**.

In the "seven transmission levers" framework:

- **Lever 4 (governance)**: IMDA is the chief designer of Singapore's AI governance
- **Lever 6 (international)**: MGF and AI Verify are Singapore's "governance calling cards" at GPAI, the Bletchley/Seoul summits, and the OECD
- **Lever 3 (industry adoption)**: programmes like SMEs Go Digital push enterprise AI deployment

A take: **IMDA's AI governance route is a textbook example of Singapore's "small country, big strategy"** — instead of competing with the EU on legislation, the US on technology, or China on scale, it stakes out the "governance tools and standards" niche. AI Verify was a particularly clever move: open-source, internationally usable, and tooled — making Singapore the "Switzerland of AI governance".

But IMDA also has structural challenges: **with telecoms, media, and AI all under one roof, attention is badly diluted**. AI governance is its "third child" — competing with telecoms regulation for budget, attention, and talent. Whether AI governance functions should be spun off in the NAIS 2.0 era (e.g., handed over to the AI Verify Foundation) is a question worth watching.`,
        milestones: [
          {
            date: '2016-10',
            title: 'IDA + MDA 合并成 IMDA',
            titleJa: 'IDA + MDA が IMDA に合併された',
            titleEn: 'IDA + MDA merge to form IMDA',
          },
          {
            date: '2019-01',
            title: '发布 Model AI Governance Framework v1',
            titleJa: 'Model AI Governance Framework v1 が発行された',
            titleEn: 'Released Model AI Governance Framework v1',
            description: '全球首批国家级 AI 治理框架之一。',
            descriptionJa: '世界で最初の国家レベル AI ガバナンスフレームワークの一つです。',
            descriptionEn: 'Among the first national-level AI governance frameworks worldwide.',
          },
          {
            date: '2020-01',
            title: 'MGF v2 发布',
            titleJa: 'MGF v2 が発行された',
            titleEn: 'MGF v2 released',
            description: '加入实施案例、自评估清单。',
            descriptionJa: '実装事例と自己評価チェックリストが追加されました。',
            descriptionEn: 'Added implementation case studies and self-assessment checklists.',
          },
          {
            date: '2022-05',
            title: 'AI Verify 测试框架发布',
            titleJa: 'AI Verify テストフレームワークが発行された',
            titleEn: 'AI Verify testing framework released',
            description: '全球首个开源 AI 治理测试套件。',
            descriptionJa: '世界初のオープンソース AI ガバナンステストスイートです。',
            descriptionEn: "World's first open-source AI governance testing suite.",
          },
          {
            date: '2023-06',
            title: 'AI Verify Foundation 独立成立',
            titleJa: 'AI Verify Foundation が独立で成立した',
            titleEn: 'AI Verify Foundation spun off',
          },
          {
            date: '2024-05',
            title: 'Model AI Governance Framework for GenAI 发布',
            titleJa: 'Model AI Governance Framework for GenAI が発行された',
            titleEn: 'Model AI Governance Framework for GenAI released',
          },
        ],
        relatedLeverNumbers: [3, 4, 6],
        relatedEntityIds: ['ai-verify-foundation', 'pdpc', 'ai-singapore', 'mas'],
        sources: [
          {
            label: 'IMDA 官网',
            labelJa: 'IMDA 公式サイト',
            labelEn: 'IMDA official site',
            url: 'https://www.imda.gov.sg/',
            date: '2026-05-02',
          },
          {
            label: 'Model AI Governance Framework',
            labelEn: 'Model AI Governance Framework',
            url: 'https://www.imda.gov.sg/-/media/imda/files/sgdigital/sgdgo/ai-governance-framework.pdf',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'ai-verify-foundation',
        name: 'AI Verify Foundation',
        nameEn: 'AI Verify Foundation',
        description: '全球首个 AI 治理测试框架，已开源',
        descriptionJa: '世界初の AI ガバナンステストフレームワーク、すでにオープンソース化されています',
        descriptionEn: "The world's first AI governance testing framework, now open source",
        url: 'https://aiverifyfoundation.sg/',
        entityType: 'platform',
        status: 'active',
        founded: '2023-06',
        parentOrg: '由 IMDA 孵化，独立运营',
        parentOrgJa: 'IMDA によってインキュベートされ、独立で運営されています',
        parentOrgEn: 'Incubated by IMDA, operated independently',
        scale: '全球 100+ 成员（含 IBM、Microsoft、Google、Meta、Salesforce 等）；50+ 企业实际部署使用',
        scaleJa:
          'グローバル100以上のメンバー（IBM、Microsoft、Google、Meta、Salesforce などを含む）；50以上の企業が実際にデプロイしています',
        scaleEn:
          '100+ global members (including IBM, Microsoft, Google, Meta, Salesforce); 50+ enterprises in active deployment',
        leaders: [
          {
            name: 'Shameek Kundu',
            title: '执行总监',
            titleJa: '執行総ディレクター',
            titleEn: 'Executive Director',
            personId: 'shameek-kundu',
          },
        ],
        summary:
          'AI Verify Foundation 是 2023 年 6 月由 IMDA 独立分拆出来的非营利基金会，运营开源的 AI 治理测试框架 **AI Verify**。它是新加坡 AI 治理战略的"国际化平台"——把 IMDA 制定的 Model AI Governance Framework 转化成可被全球企业实际使用的开源工具集。',
        summaryJa:
          'AI Verify Foundation は2023年6月に IMDA から独立で分割された非営利基金会であり、オープンソースの AI ガバナンステストフレームワーク**AI Verify**を運営しています。それはシンガポール AI ガバナンス戦略の「国際化プラットフォーム」です。IMDA が制定した Model AI Governance Framework を、グローバル企業が実際に使用できるオープンソースツールセットに変換します。',
        summaryEn:
          'AI Verify Foundation is a non-profit foundation spun off from IMDA in June 2023, operating the open-source AI governance testing framework **AI Verify**. It is the "internationalisation platform" of Singapore\'s AI governance strategy — converting the Model AI Governance Framework set by IMDA into an open-source toolkit that enterprises around the world can actually use.',
        whatItIs: `AI Verify 由两部分组成：

- **AI Verify 测试框架**：开源工具包（GitHub），让企业自评估 AI 系统在 11 个维度上的表现（透明度、可解释性、可重复性、安全性、隐私、稳健性、公平性、问责制、人类自主权、福祉、社会效益）
- **AI Verify Foundation**：负责治理工具的演进、生态扩展、标准制定的非营利组织

技术上，AI Verify 框架包含：

- **测试库**：自动化测试套件（性能、公平性、稳健性等）
- **流程检查清单**：人工评估的标准化问卷
- **报告生成器**：输出标准化的合规报告

Foundation 有 100+ 全球成员，包括 IBM、Microsoft、Google、Meta、Salesforce 等大厂，以及本地的 Singtel、DBS、UOB、Standard Chartered 等。`,
        whatItIsJa: `AI Verify は 2 つの部分から構成されています：

- **AI Verify テストフレームワーク**：オープンソースツールキット（GitHub）、企業が AI システムを 11 の次元で自己評価できさせる（透明性、説明可能性、再現性、安全性、プライバシー、堅牢性、公正性、問責制、人間の自律性、福祉、社会効益）
- **AI Verify Foundation**：ガバナンスツール発展、生態拡張、標準制定責任の非営利組織

技術的には、AI Verify フレームワークは以下を含みます：

- **テストライブラリ**：自動テストスイート（パフォーマンス、公正性、堅牢性など）
- **プロセスチェックリスト**：人工評価の標準化アンケート
- **レポート生成器**：標準化コンプライアンスレポートを出力

Foundation は 100+ グローバルメンバーを有し、IBM、Microsoft、Google、Meta、Salesforce などの大手企業、および地元の Singtel、DBS、UOB、Standard Chartered などを含みます。`,
        whatItIsEn: `AI Verify has two parts:

- **AI Verify testing framework**: an open-source toolkit (on GitHub) that lets enterprises self-assess their AI systems across 11 dimensions (transparency, explainability, repeatability, safety, privacy, robustness, fairness, accountability, human autonomy, well-being, and social benefit)
- **AI Verify Foundation**: the non-profit organisation responsible for the evolution of governance tooling, ecosystem expansion, and standards-setting

Technically, the AI Verify framework includes:

- **Test library**: automated test suites (performance, fairness, robustness, etc.)
- **Process checklists**: standardised questionnaires for human evaluation
- **Report generator**: outputs standardised compliance reports

The Foundation has 100+ global members, including IBM, Microsoft, Google, Meta, and Salesforce, alongside local players such as Singtel, DBS, UOB, and Standard Chartered.`,
        aiRelevance: `AI Verify 的核心创新是**把 AI 治理从"原则"变成"可执行的测试"**。

行业之前的问题：所有人都说要"负责任 AI"、"公平、透明、可解释"，但**没有人能告诉你这些抽象原则在你的系统里到底要怎么测**。AI Verify 第一次把这些原则变成了具体的：

- 11 个评估维度
- 每个维度对应若干自动测试 + 人工检查项
- 测试结果生成标准化报告

这套思路被 NIST AI Risk Management Framework、ISO/IEC 42001、欧盟 AI Act 的合规工具反复借鉴。**它不是 SOTA 的技术研究，而是治理工具的"事实标准"**——这种"标准之争"的胜利往往比技术胜利更持久。

2024 年扩展到生成式 AI（Generative AI Verify），增加了对 LLM 特有风险（幻觉、越狱、版权）的测试模块。`,
        aiRelevanceJa: `AI Verify の中核的革新は**AI ガバナンスを「原則」から「実行可能なテスト」に変える**ことです。

業界それまでの問題：皆が「責任ある AI」、「公正、透明、説明可能」を言い張っていますが、**誰もこれらの抽象的原則が実際のあなたのシステムでいかにテストすべきかを教えてくれません**。AI Verify は初めてこれらの原則を具体的なものに変えました：

- 11 の評価次元
- 各次元が複数の自動テスト + 人工チェック項目に対応
- テスト結果は標準化レポートを生成

このアプローチは NIST AI Risk Management Framework、ISO/IEC 42001、EU AI Act のコンプライアンスツールにより繰り返し参考にされています。**これは SOTA の技術研究ではなく、ガバナンスツールの「事実上の標準」です**。このような「標準争い」の勝利はしばしば技術的勝利より長く続きます。

2024 年は生成式 AI に拡張します（Generative AI Verify）、LLM 特有リスク（幻覚、越獄、著作権）のテストモジュールを追加します。`,
        aiRelevanceEn: `AI Verify's core innovation is **turning AI governance from "principles" into "executable tests"**.

The pre-existing problem in the field: everyone agreed on "responsible AI", "fairness, transparency, explainability", but **no one could tell you how those abstract principles should actually be tested in your system**. AI Verify was the first to translate them into concrete pieces:

- 11 evaluation dimensions
- Each dimension mapped to a set of automated tests + manual check items
- Test results generate standardised reports

This approach has been repeatedly borrowed by NIST AI Risk Management Framework, ISO/IEC 42001, and EU AI Act compliance tooling. **It's not SOTA technical research, but a "de facto standard" for governance tooling** — and victories in standards battles tend to outlast technical victories.

In 2024, the framework was extended to generative AI (Generative AI Verify), adding test modules for LLM-specific risks (hallucination, jailbreak, copyright).`,
        singaporeRelevance: `AI Verify Foundation 是新加坡 AI 战略**最聪明的一步棋**。

在「七条传导杠杆」里：

- **杠杆 4（治理）**：把治理框架转化成可商用的工具
- **杠杆 6（外交）**：通过 Foundation 形式，把"新加坡治理标准"国际化、去政治化

观点：**新加坡用 AI Verify 做了一件其他国家没做的事——把"国家治理标准"变成"全球开源工具"**。欧盟 AI Act 是法律，离开欧盟管辖就没用；NIST AI RMF 是美国官方标准，国际接受度受地缘政治影响；而 AI Verify 是 Apache 协议的开源项目，谁都可以用，谁都不会觉得"被新加坡监管"。

这种"标准外交"的玩法只有小国家能玩——大国出标准会被防备，小国出标准反而中立。AI Verify 让新加坡在 AI 治理这个赛道占住了"中立平台"的位置。

可观察的瓶颈：**Foundation 的资金可持续性**（目前主要靠 IMDA 和企业会员费）、**生态拉动力**（成员名单很亮但深度参与的不多）、**技术演进速度**（开源治理工具如何跟上 GenAI 的快速发展）。`,
        singaporeRelevanceJa: `AI Verify Foundation はシンガポール AI 戦略における**最も賢い一手です**。

「7つの伝導レバー」では：

- **レバー 4（ガバナンス）**：ガバナンスフレームワークを商用化可能なツールに転換
- **レバー 6（外交）**：Foundation 形式により、「シンガポール ガバナンス標準」を国際化、非政治化

見方：**シンガポールは AI Verify で他国がやっていないことをやりました。「国家ガバナンス標準」を「グローバルオープンソースツール」に変える**ことです。EU AI Act は法律であり、EU 管轄権を離れると無用です；NIST AI RMF は米国の公式標準であり、国際的受け入れは地政学的影響を受けます；一方、AI Verify は Apache 協定のオープンソースプロジェクトであり、誰でも使用でき、誰も「シンガポール監督を受けている」と感じません。

このような「標準外交」のやり方は小国だけができます。大国が標準を出すと用心されますが、小国が標準を出すと中立的です。AI Verify はシンガポールが AI ガバナンスこの賽道で「中立的プラットフォーム」のポジションを占領させています。

観察可能なボトルネック：**Foundation の資金持続性**（現在主に IMDA と企業会費に頼ります）、**生態的引き力**（メンバーリストは明るいが深く参加する者は多くありません）、**技術発展速度**（オープンソースガバナンスツールいかに GenAI の高速発展に追いつく）。`,
        singaporeRelevanceEn: `AI Verify Foundation is **the smartest move in Singapore's AI strategy**.

In the "seven transmission levers" framework:

- **Lever 4 (governance)**: turning the governance framework into a commercially usable tool
- **Lever 6 (international)**: through the Foundation form, internationalising and de-politicising "Singapore governance standards"

A take: **Singapore did something with AI Verify that no other country has done — converting a "national governance standard" into a "global open-source tool"**. The EU AI Act is law: outside EU jurisdiction it has no power. NIST AI RMF is a US official standard: international acceptance is shaped by geopolitics. AI Verify, by contrast, is an Apache-licensed open-source project — anyone can use it without feeling "regulated by Singapore".

This kind of "standards diplomacy" is something only small countries can play — when great powers issue standards, others get defensive; when a small country issues them, they look neutral. AI Verify has secured Singapore the "neutral platform" position in AI governance.

Bottlenecks to watch: **the Foundation's funding sustainability** (currently relying mainly on IMDA and corporate member fees), **ecosystem traction** (the member list is glittering but few are deeply engaged), and **the pace of technical evolution** (how an open-source governance tool keeps up with the rapid evolution of GenAI).`,
        milestones: [
          {
            date: '2022-05',
            title: 'AI Verify 测试框架由 IMDA 发布',
            titleJa: 'AI Verify テストフレームワークは IMDA によって発行された',
            titleEn: 'AI Verify testing framework released by IMDA',
          },
          {
            date: '2023-06',
            title: 'AI Verify Foundation 独立成立',
            titleJa: 'AI Verify Foundation が独立で成立した',
            titleEn: 'AI Verify Foundation officially established',
            description: 'Linux Foundation 提供托管支持。',
            descriptionJa: 'Linux Foundation がホスティングサポートを提供しています。',
            descriptionEn: 'Hosted with support from the Linux Foundation.',
          },
          {
            date: '2024-05',
            title: 'Generative AI Verify 发布',
            titleJa: 'Generative AI Verify が発行された',
            titleEn: 'Generative AI Verify released',
            description: '扩展到 LLM 风险测试（幻觉、越狱、版权）。',
            descriptionJa: 'LLM リスク評価（ハルシネーション、プロンプトインジェクション、著作権）に拡張されました。',
            descriptionEn: 'Extended to LLM risk testing (hallucination, jailbreaks, copyright).',
          },
          {
            date: '2024',
            title: 'Foundation 成员数突破 100',
            titleJa: 'Foundation メンバー数が100を突破した',
            titleEn: 'Foundation membership exceeds 100',
          },
        ],
        relatedLeverNumbers: [4, 6],
        relatedEntityIds: ['imda', 'ai-singapore', 'pdpc'],
        sources: [
          {
            label: 'AI Verify Foundation 官网',
            labelJa: 'AI Verify Foundation 公式ウェブサイト',
            labelEn: 'AI Verify Foundation official site',
            url: 'https://aiverifyfoundation.sg/',
            date: '2026-05-02',
          },
          {
            label: 'AI Verify GitHub',
            labelEn: 'AI Verify on GitHub',
            url: 'https://github.com/aiverify-foundation',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'mas',
        name: 'MAS',
        nameEn: 'MAS',
        description: '金融管理局，金融 AI 治理（FEAT 原则、Veritas）',
        descriptionJa: '金融管理局、金融 AI ガバナンス（FEAT 原則、Veritas）',
        descriptionEn: 'Monetary Authority of Singapore; AI governance in finance (FEAT principles, Veritas)',
        url: 'https://www.mas.gov.sg/',
        entityType: 'agency',
        status: 'active',
        founded: '1971',
        ministry: '总理公署直属',
        ministryJa: '首相府の直属',
        ministryEn: 'Reports directly to the Prime Minister’s Office',
        scale: '员工 2200+；管辖银行、保险、证券、支付，并兼任新加坡央行',
        scaleJa: '従業員2200人以上；銀行、保険、証券、支払いを管轄し、シンガポール中央銀行を兼任しています',
        scaleEn: '2,200+ staff; regulates banking, insurance, securities, payments and serves as central bank',
        leaders: [
          {
            name: 'Chia Der Jiun',
            title: '总裁（任期至 2026-05）',
            titleJa: '総裁（任期2026-05年まで）',
            titleEn: 'Managing Director (until 2026-05)',
            personId: 'chia-der-jiun',
          },
          {
            name: 'Leong Sing Chiong',
            title: '副总裁',
            titleJa: '副総裁',
            titleEn: 'Deputy Managing Director',
            personId: 'leong-sing-chiong',
          },
        ],
        summary:
          'MAS（Monetary Authority of Singapore）是新加坡的中央银行 + 金融监管机构。在 AI 领域，它的特殊地位在于：**它管的金融行业是新加坡 AI 落地最深、最早的行业**——所以它必须做行业级 AI 治理。FEAT 原则、Veritas 框架就是 MAS 给金融业 AI 的"行业宪法"。',
        summaryJa:
          'MAS（Monetary Authority of Singapore）はシンガポールの中央銀行 + 金融規制機構です。AI 分野では、その特殊な位置付けは以下の通りです：それが管理する金融産業はシンガポール AI の最も深く、最も早期の導入産業です。だから、それは業界レベルの AI ガバナンスを実施しなければなりません。FEAT 原則と Veritas フレームワークは MAS が金融業 AI に与えた「業界憲法」です。',
        summaryEn:
          'MAS (Monetary Authority of Singapore) is Singapore\'s central bank and financial regulator. Its unique position in AI: **the financial industry it oversees is the deepest and earliest adopter of AI in Singapore** — so it has had to do sector-level AI governance. FEAT principles and the Veritas framework are MAS\'s "industry constitution" for financial-sector AI.',
        whatItIs: `MAS 在 AI 治理上有几个核心动作：

- **FEAT 原则（2018）**：Fairness、Ethics、Accountability、Transparency 四大原则，给金融机构用 AI 的最低门槛
- **Veritas 框架（2020+）**：把 FEAT 转化成可执行的评估方法学。**Veritas** 是 MAS 牵头、和银行业（DBS、UOB、OCBC、汇丰、渣打等）共同开发的开源 AI 治理工具
- **生成式 AI 监管（2024+）**：MAS 发布对金融机构使用 GenAI 的具体指引，包括禁止用 GenAI 做客户决策、要求人工监督等

行业层面，MAS 不只做监管，也直接推动 AI 落地：

- **AI Talent Push**：通过 Talent Programmes 推动金融业 AI 人才储备
- **Sandbox / TechFin**：允许金融机构在监管沙盒里测试 AI 产品
- **GAIIN（Global AI Innovation Network）**：和瑞士、英国、澳洲等金融监管机构合作，建立 AI 跨境治理对话`,
        whatItIsJa: `MAS は AI ガバナンスにおいて幾つかの中核的な動作があります：

- **FEAT 原則（2018）**：Fairness、Ethics、Accountability、Transparency の四大原則で、金融機関が AI を使用する際の最低水準を提供します
- **Veritas フレームワーク（2020+）**：FEAT を実行可能な評価方法論に変換します。**Veritas** は MAS が主導し、銀行業界（DBS、UOB、OCBC、HSBC、Standard Chartered など）と共同開発のオープンソース AI ガバナンスツールです
- **生成 AI 監管（2024+）**：MAS は金融機関による GenAI 使用に関する具体的な指引を発表し、GenAI による顧客決定の禁止、人間による監督の要求などを含みます

業界レベルでは、MAS は監管のみならず、AI 実装を直接推進しています：

- **AI 人材プッシュ**：Talent Programmes を通じた金融業の AI 人材備蓄推進
- **Sandbox / TechFin**：金融機関が監管サンドボックスで AI 製品をテストすることを許可
- **GAIIN（Global AI Innovation Network）**：スイス、英国、オーストラリアなど金融監管機構との協力で、AI 跨境ガバナンス対話を構築`,
        whatItIsEn: `MAS has several core moves on AI governance:

- **FEAT principles (2018)**: Fairness, Ethics, Accountability, Transparency — the four principles setting the minimum bar for AI use by financial institutions
- **Veritas framework (2020+)**: turns FEAT into an executable assessment methodology. **Veritas** is an open-source AI governance toolkit led by MAS and co-developed with the banking industry (DBS, UOB, OCBC, HSBC, Standard Chartered, etc.)
- **Generative AI regulation (2024+)**: MAS issued specific guidance on financial institutions' use of GenAI — banning the use of GenAI for customer decisions, requiring human oversight, etc.

At the industry level, MAS is not just a regulator but also actively pushes AI deployment:

- **AI Talent Push**: Talent Programmes that build up AI talent reserves in finance
- **Sandbox / TechFin**: lets financial institutions test AI products inside the regulatory sandbox
- **GAIIN (Global AI Innovation Network)**: collaborates with financial regulators in Switzerland, the UK, Australia, etc. to build cross-border dialogue on AI governance`,
        aiRelevance: `MAS 的 AI 治理是"**行业级 + 工具级 + 国际级**"三位一体：

- **行业级**：FEAT + Veritas 是给金融业的，比 IMDA 的 MGF 更具体（金融业有信用评估、反欺诈、KYC 等高风险 AI 场景）
- **工具级**：Veritas 提供具体的代码和评估方法，不止是文档
- **国际级**：MAS 主动通过 GAIIN 把 Veritas 推向其他国家的金融监管，形成事实标准

技术上 Veritas 评估框架包含：

- **公平性评估**：多种公平性指标的自动测试
- **可解释性方法**：SHAP、LIME 等 XAI 工具的金融业适配
- **稳健性测试**：对抗样本、数据漂移、概念漂移检测
- **数据治理**：训练数据来源、偏差、隐私的检查清单

这套工具被 DBS、UOB、汇丰等银行实际部署，**是少数有真实生产环境验证的 AI 治理工具**。`,
        aiRelevanceJa: `MAS の AI ガバナンスは「**業界レベル + ツールレベル + 国際レベル**」の三位一体です：

- **業界レベル**：FEAT + Veritas は金融業向けで、IMDA の MGF よりも具体的です（金融業はクレジット評価、不正検出、KYC などの高リスク AI シーンがあります）
- **ツールレベル**：Veritas は具体的なコードと評価方法を提供し、ドキュメントだけではありません
- **国際レベル**：MAS は能動的に GAIIN を通じて Veritas を他国の金融監管に推し進め、デファクト標準を形成します

技術的には Veritas 評価フレームワークは以下を含みます：

- **フェアネス評価**：複数のフェアネスメトリクスの自動テスト
- **解釈可能性方法**：SHAP、LIME などの XAI ツールの金融業適用
- **堅牢性テスト**：敵対的サンプル、データドリフト、概念ドリフト検出
- **データガバナンス**：訓練データのソース、バイアス、プライバシーのチェックリスト

このツールは DBS、UOB、HSBC などの銀行に実際に配置されており、**本番環境で検証された少数の AI ガバナンスツールの 1 つです**。`,
        aiRelevanceEn: `MAS's AI governance is a "**sector-level + tool-level + international-level**" trinity:

- **Sector-level**: FEAT + Veritas are aimed at financial services and are more concrete than IMDA's MGF (finance has high-stakes AI use cases like credit scoring, anti-fraud, and KYC)
- **Tool-level**: Veritas provides actual code and assessment methods, not just documents
- **International-level**: MAS actively pushes Veritas to other countries' financial regulators via GAIIN, building a de facto standard

Technically, the Veritas assessment framework includes:

- **Fairness assessment**: automated tests for multiple fairness metrics
- **Explainability methods**: financial-sector adaptations of XAI tools like SHAP and LIME
- **Robustness testing**: adversarial samples, data drift, and concept drift detection
- **Data governance**: checklists for training data sources, bias, and privacy

This toolkit is actually deployed at DBS, UOB, HSBC, and others — making it **one of the few AI governance tools with real production validation**.`,
        singaporeRelevance: `MAS 的 AI 治理动作直接定义了新加坡金融业的 AI 落地节奏。

在「七条传导杠杆」里：

- **杠杆 4（治理）**：金融业 AI 治理的执行主体
- **杠杆 3（产业应用）**：通过 Sandbox + TechFin 推动金融 AI 落地
- **杠杆 6（外交）**：通过 GAIIN 把治理标准国际化

观点：**MAS 是新加坡 AI 治理体系里"最有牙齿"的机构**——和 IMDA 走"自愿采纳 + 软标准"路线不同，MAS 对金融机构有真实的处罚权，FEAT/Veritas 不是建议而是行规。

这也意味着 MAS 在 AI 上的判断对新加坡金融业生死攸关：放得太松，金融稳定有风险；管得太严，新加坡作为亚太金融中心的吸引力会下降。**MAS 在 GenAI 上的态度（要求人工监督、限制客户决策场景）已经偏保守**，这和它"金融稳定优先于创新"的传统一致。

未来值得关注：**MAS 何时允许 GenAI 直接面客**（比如客服、投顾）、**Veritas 何时升级到对 LLM 的完整评估**、**与 SEA-LION 的潜在结合**（金融业的本地化 LLM 需求）。`,
        singaporeRelevanceJa: `MAS の AI ガバナンス動作は直接的にシンガポール金融業の AI 実装ペースを定義しています。

「7 つの伝導レバー」の中で：

- **レバー 4（ガバナンス）**：金融業 AI ガバナンスの実行主体
- **レバー 3（産業応用）**：Sandbox + TechFin を通じた金融 AI 実装推進
- **レバー 6（外交）**：GAIIN を通じたガバナンス標準の国際化

見方：**MAS はシンガポール AI ガバナンス体系における「最も歯を持つ機関」です**——IMDA の「自発的採用 + ソフト標準」ルートとは異なり、MAS は金融機関に対して実際の処罰権を持っており、FEAT/Veritas は提案ではなく業界規則です。

これはまた MAS の AI に関する判断がシンガポール金融業の生死に関わることを意味します：放ちすぎると金融安定性にリスクがあり、管理しすぎるとシンガポールのアジア太平洋金融センターとしての吸引力が低下します。**MAS の GenAI に対する態度（人間による監督の要求、顧客決定シーンでの制限）はすでに保守的です**、これはそれの「金融安定性を創新より優先する」という伝統的な姿勢と一致しています。

今後注視する価値があります：**MAS は何時 GenAI を直接顧客に面させるのか**（例えば顧客サービス、投資顧問）、**Veritas は何時 LLM への完全な評価にアップグレードするのか**、**SEA-LION との潜在的な結合**（金融業の現地化 LLM の必要性）。`,
        singaporeRelevanceEn: `MAS's AI governance moves directly define the cadence of AI deployment in Singapore's financial sector.

In the "seven transmission levers" framework:

- **Lever 4 (governance)**: the enforcement body for financial-sector AI governance
- **Lever 3 (industry adoption)**: pushes financial AI deployment via Sandbox + TechFin
- **Lever 6 (international)**: internationalises governance standards via GAIIN

A take: **MAS is the institution with the most teeth in Singapore's AI governance system** — unlike IMDA's "voluntary adoption + soft standards" route, MAS has real penalty power over financial institutions; FEAT/Veritas is not advice but industry rule.

This also means MAS's AI judgement is existentially important for Singapore's financial sector: too loose, and financial stability is at risk; too tight, and Singapore's appeal as an Asia-Pacific financial hub erodes. **MAS's stance on GenAI (requiring human oversight, restricting customer-decision use cases) has skewed conservative** — consistent with its tradition of "financial stability over innovation".

Worth watching going forward: **when MAS will allow GenAI in direct customer-facing roles** (e.g., customer service, robo-advisory), **when Veritas will be upgraded for full LLM evaluation**, and **potential integration with SEA-LION** (the financial sector's demand for localised LLMs).`,
        milestones: [
          {
            date: '2018-11',
            title: 'FEAT 原则发布',
            titleJa: 'FEAT 原則発布',
            titleEn: 'FEAT principles released',
            description: 'AI / 数据分析在金融业的伦理原则。',
            descriptionJa: 'AI/データ分析における金融業界の倫理原則です。',
            descriptionEn: 'Ethics principles for AI / data analytics in financial services.',
          },
          {
            date: '2020-01',
            title: 'Veritas 项目启动',
            titleJa: 'Veritas プロジェクト起動',
            titleEn: 'Veritas project launched',
            description: '与 12 家金融机构联合开发治理工具。',
            descriptionJa: '12の金融機関と共同で統治ツールを開発しています。',
            descriptionEn: 'Co-developed governance tooling with 12 financial institutions.',
          },
          {
            date: '2022',
            title: 'Veritas Toolkit v1 开源',
            titleJa: 'Veritas Toolkit v1 オープンソース化',
            titleEn: 'Veritas Toolkit v1 open-sourced',
          },
          {
            date: '2024',
            title: '发布金融业 GenAI 监管指引',
            titleJa: '金融業向けGenAI規制ガイダンスを発布',
            titleEn: 'GenAI regulatory guidance for financial sector released',
          },
          {
            date: '2024',
            title: 'GAIIN 成立',
            titleJa: 'GAIIN 設立',
            titleEn: 'GAIIN established',
            description: 'Global AI Innovation Network，跨境监管协作。',
            descriptionJa: 'Global AI Innovation Network、国境を越えた規制協力です。',
            descriptionEn: 'Global AI Innovation Network — cross-border regulatory collaboration.',
          },
        ],
        relatedLeverNumbers: [3, 4, 6],
        relatedEntityIds: ['imda', 'ai-verify-foundation'],
        sources: [
          {
            label: 'MAS 官网',
            labelJa: 'MAS 公式ウェブサイト',
            labelEn: 'MAS official site',
            url: 'https://www.mas.gov.sg/',
            date: '2026-05-02',
          },
          {
            label: 'Veritas Toolkit',
            labelEn: 'Veritas Toolkit',
            url: 'https://www.mas.gov.sg/schemes-and-initiatives/veritas',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '核心技术',
    nameJa: 'コア技術',
    nameEn: 'Core Technology',
    icon: '🧠',
    description: 'AI Singapore 自研技术平台与工具',
    descriptionJa: 'AI Singapore 自社開発技術プラットフォームとツール',
    descriptionEn: "AI Singapore's in-house technology platforms and tools",
    entities: [
      {
        id: 'sea-lion',
        name: 'SEA-LION',
        nameEn: 'SEA-LION',
        description: '东南亚多语言大语言模型，支持 11 种语言',
        descriptionJa: '東南アジア多言語大言語モデル、11言語をサポート',
        descriptionEn: 'Southeast Asian multilingual large language model, supporting 11 languages',
        url: 'https://aisingapore.org/aiproducts/sea-lion/',
        entityType: 'platform',
        status: 'active',
        founded: '2023-12',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        ministry: '总理公署 / SNDGO（通过 AISG）',
        ministryJa: '首相官邸 / SNDGO（AISG経由）',
        ministryEn: 'Prime Minister’s Office / SNDGO (via AISG)',
        scale: '11 种东南亚语言；最大版本 70B 参数；HuggingFace 下载量百万级',
        scaleJa: '11の東南アジア言語、最大版本70Bパラメータ、HuggingFaceダウンロード数百万レベル',
        scaleEn:
          '11 Southeast Asian languages; flagship model at 70B parameters; downloads in the millions on HuggingFace',
        leaders: [
          {
            name: 'Leslie Teo',
            title: 'AISG AI 产品高级总监 / SEA-LION 项目牵头人',
            titleJa: 'AISG AI製品シニアディレクター / SEA-LION プロジェクトリード者',
            titleEn: 'Senior Director of AI Products at AISG; SEA-LION programme lead',
            personId: 'leslie-teo',
          },
        ],
        summary:
          'SEA-LION（Southeast Asian Languages In One Network）是 AI Singapore 自 2023 年起开发的开源大语言模型家族，**专门为东南亚 11 种语言（含马来语、泰米尔语、缅甸语、高棉语等小语种）做语义保真**。它不和 GPT/Claude/Gemini 比通用能力，而是占住「西方大厂没动力做、东南亚本地又没算力做」的空白带。截至 2026，SEA-LION 已迭代到 v3，最大版本 70B 参数，是全球**第一个真正面向东南亚的开源大模型基座**。',
        summaryJa:
          'SEA-LION（Southeast Asian Languages In One Network）は、AI Singapore が2023年以降開発してきたオープンソース大言語モデル群です。**東南アジア11言語（マレー語、タミル語、ミャンマー語、クメール語などの少数言語を含む）に対して、セマンティック忠実性を専門とします**。GPT/Claude/Gemini と汎用能力を比較するのではなく、「西欧の大手企業が動く動機がなく、東南アジア本地もまた計算力がない」というニッチを埋めています。2026年現在、SEA-LION はv3に進化しており、最大版本は70Bパラメータで、世界初の**東南アジア向け真のオープンソース大言語モデルの基盤**です。',
        summaryEn:
          'SEA-LION (Southeast Asian Languages In One Network) is the open-source LLM family AI Singapore has been developing since 2023, **purpose-built for semantic fidelity in 11 Southeast Asian languages** (including Malay, Tamil, Burmese, Khmer and other smaller languages). It does not compete with GPT/Claude/Gemini on general capability — it occupies the gap that "Western big tech has no incentive to fill and Southeast Asian players lack the compute to address". By 2026, SEA-LION has reached v3 with a flagship 70B model — the **first genuinely Southeast-Asia-oriented open LLM foundation in the world**.',
        whatItIs: `SEA-LION 是一个**开源大语言模型家族**，不是单一模型。它包含多个尺寸（3B、7B/8B、70B）、多个底座（早期自研，v3 起基于 Llama 3 和 Gemma 做继续训练）、多种用途（基础模型、Instruct 微调、RAG 适配版）。

技术栈层面：

- **训练数据**：以东南亚 11 种官方语言为核心（英语、中文、马来语、印尼语、泰语、越南语、菲律宾语、泰米尔语、缅甸语、高棉语、老挝语），训练语料约 1 万亿 token，其中东南亚语言占比远高于通用大模型
- **基座选择**：v1 自研架构 → v2 基于 Llama 2 → v3 基于 Llama 3 / Gemma 做继续预训练 + 指令微调
- **算力**：依赖新加坡国家超算中心（NSCC）与 Google Cloud / AWS 的赞助算力
- **开源协议**：MIT / Apache 商业友好协议，允许企业直接商用
- **配套工具**：SEA-HELM（评估基准）、SEA-Guard（安全防护）共同构成完整工具链

**模型可以在 HuggingFace 上直接下载，也可以通过 sea-lion.ai 的官方 API 调用**。它是少数几个由国家级机构出品、却完全开源、且明确鼓励商业使用的大模型。`,
        whatItIsJa: `SEA-LION は**オープンソース大規模言語モデルファミリー**で、単一モデルではありません。それは複数のサイズ（3B、7B/8B、70B）、複数の基盤（初期段階の自研、v3 以降は Llama 3 と Gemma に基づく継続訓練）、複数用途（基礎モデル、Instruct ファインチューニング、RAG 適応版）を含みます。

技術スタック層面では：

- **訓練データ**：東南アジアの 11 の公用語をコアとして（英語、中国語、マレー語、インドネシア語、タイ語、ベトナム語、フィリピン語、タミル語、ビルマ語、クメール語、ラオス語）、訓練コーパスは約 1 兆トークンで、東南アジア言語の占める比率は汎用大規模言語モデルより大幅に高い
- **基盤の選択**：v1 自研アーキテクチャ → v2 は Llama 2 に基づく → v3 は Llama 3 / Gemma に基づく継続事前訓練 + 指令ファインチューニング
- **計算能力**：シンガポール国家スーパーコンピュータセンター（NSCC）および Google Cloud / AWS の寄贈計算能力に依存
- **オープンソースライセンス**：MIT / Apache 商業友好的なライセンスで、企業の直接的な商業利用を許可
- **付属ツール**：SEA-HELM（評価ベンチマーク）、SEA-Guard（セキュリティ保護）が一体となった完全なツールチェーンを構成

**モデルは HuggingFace で直接ダウンロードすることも、sea-lion.ai の公式 API を通じて呼び出すこともできます**。それは国家レベルの機構から出品されながら、完全にオープンソースで、商業利用を明確に奨励する少数の大規模モデルの 1 つです。`,
        whatItIsEn: `SEA-LION is an **open-source LLM family**, not a single model. It includes multiple sizes (3B, 7B/8B, 70B), multiple base architectures (originally in-house, then based on Llama 3 and Gemma from v3 onwards via continued training), and multiple variants (base, instruct fine-tuned, RAG-adapted).

On the technical stack:

- **Training data**: centred on the 11 official Southeast Asian languages (English, Chinese, Malay, Indonesian, Thai, Vietnamese, Filipino, Tamil, Burmese, Khmer, Lao); training corpus around 1 trillion tokens, with SEA languages far over-represented compared to general LLMs
- **Base model choice**: v1 self-built architecture → v2 based on Llama 2 → v3 based on Llama 3 / Gemma with continued pre-training and instruction tuning
- **Compute**: relies on the Singapore National Supercomputing Centre (NSCC) and sponsored compute from Google Cloud / AWS
- **Open-source licence**: MIT / Apache, commercially friendly, allowing direct enterprise use
- **Companion tools**: SEA-HELM (evaluation benchmark) and SEA-Guard (safety) form the complete tooling chain

**Models can be downloaded directly from HuggingFace, or accessed via the official sea-lion.ai API**. It is one of the few LLMs that is produced by a national-level institution yet fully open and explicitly designed to encourage commercial use.`,
        aiRelevance: `SEA-LION 在 LLM 生态里有一个非常清晰的位置：**「东南亚语言 SOTA 基座」**。

它解决的核心技术问题是——通用大模型在东南亚小语种上的表现塌陷。比如 GPT-4 在英语/中文上能打 95 分，但在缅甸语、高棉语、老挝语上经常掉到 30-40 分（在 SEA-HELM 这套基准上能复现）。这背后的根因是训练数据：通用大模型的训练语料里东南亚语言占比通常不到 1%。

SEA-LION 的解法是**继续预训练（continued pre-training）**：

- 拿 Llama 3 / Gemma 这种已经具备通用能力的强基座
- 用大量东南亚语言语料做继续训练，恢复对小语种的语义保真
- 同时不损伤太多英语能力（这是技术难点）

这条路走通后，**SEA-LION 在 SEA-HELM 上的东南亚语言任务超过了同尺寸的 Llama 3、Gemma、Qwen**——这是它最有说服力的硬数据。

更宏观看，SEA-LION 也是「开源大模型的区域化适配」这条路径的一个重要案例。它证明了：**不是每个国家都需要自己训 GPT-4，但每个语言区都可能需要自己的继续训练版本**——这套思路后来被印尼、马来西亚、越南等都开始模仿。`,
        aiRelevanceJa: `SEA-LION は LLM エコシステムにおいて非常に明確なポジションを持っています：**「東南アジア言語の最先端技術的基盤」**。

これが解決するコア技術課題は——汎用大規模言語モデルが東南アジア少数言語上での性能の崩壊です。例えば GPT-4 は英語・中国語で 95 点を取れますが、ビルマ語、クメール語、ラオス語では しばしば 30～40 点に落ちます（SEA-HELM というベンチマークで再現可能）。背景にある根本原因は訓練データです：汎用大規模言語モデルの訓練コーパスでは東南アジア言語が通常 1% 未満の割合です。

SEA-LION のソリューションは**継続事前訓練（continued pre-training）**です：

- Llama 3 / Gemma などの汎用能力を既に備えている強力な基盤を取得
- 大量の東南アジア言語コーパスで継続訓練を行い、少数言語への意味的忠実性を回復
- 同時に英語能力を過度に損なわない（これは技術的課題）

この道が切り抜ける後、**SEA-LION は SEA-HELM 上の東南アジア言語タスクにおいて同一サイズの Llama 3、Gemma、Qwen を超えます**——これはそれの最も説得力のあるハードデータです。

より大規模に見ると、SEA-LION は「オープンソース大規模言語モデルの地域化適応」というパスの一つの重要なケースでもあります。これは以下を証明しています：**すべての国が自らの GPT-4 を訓練する必要はありませんが、すべての言語圏が自らの継続訓練版本を必要とする可能性があります**——このアプローチは後にインドネシア、マレーシア、ベトナムなどが模倣を始めるようになりました。`,
        aiRelevanceEn: `SEA-LION holds a very clear position in the LLM ecosystem: **"the SOTA foundation for Southeast Asian languages"**.

The core technical problem it solves: general LLMs collapse on smaller Southeast Asian languages. GPT-4 might score 95 on English/Chinese tasks but drops to 30–40 on Burmese, Khmer, or Lao (reproducible on SEA-HELM). The root cause is training data — SEA languages typically make up under 1% of general LLM training corpora.

SEA-LION's approach is **continued pre-training**:

- Take a strong base model with general capabilities (Llama 3 / Gemma)
- Continue pre-training with large amounts of SEA language corpora to restore semantic fidelity in smaller languages
- Without sacrificing too much English capability (the technical challenge)

Once this works, **SEA-LION beats same-sized Llama 3, Gemma, and Qwen on Southeast Asian language tasks in SEA-HELM** — its most compelling hard evidence.

At a broader level, SEA-LION is also an important case study for "regional adaptation of open LLMs". It proves: **not every country needs to train its own GPT-4, but every language region may need its own continued pre-training variant** — a pattern Indonesia, Malaysia, and Vietnam are now imitating.`,
        singaporeRelevance: `SEA-LION 是新加坡 AI 战略**最具象征意义的输出**——比任何政策文件都更能说明「新加坡要做什么样的 AI」。

在「七条传导杠杆」里，SEA-LION 同时落在 3 条上：

- **杠杆 5（政府自用）**：政府部门基于 SEA-LION 部署本地化 AI 服务，避免把数据交给海外大厂
- **杠杆 6（外交）**：SEA-LION 是新加坡在 ASEAN AI 合作、GPAI、Bletchley/Seoul 峰会上的「技术名片」，证明小国家也能产出全球开源模型
- **杠杆 3（产业应用）**：开源后，本地企业（特别是金融、政府、医疗这种敏感数据场景）可以直接微调使用，不必受制于海外 API

观点：**SEA-LION 的真正价值不在它的技术指标，而在它是一个「主权 AI」的样板项目**。它告诉东南亚：「你们也可以有自己的 LLM 基座，不必只用 OpenAI」。这种叙事价值远大于它对任何单个 benchmark 的提升。

但 SEA-LION 也有真实瓶颈：

- **不是从零训练**——它依赖 Llama 3 / Gemma 这些 Meta/Google 的开源底座，这意味着如果未来这些底座转闭源，整个项目要重做
- **资源远小于大厂**——AISG 的算力预算是大厂的 1/100，迭代速度天然慢
- **商业闭环未跑通**——目前主要是政府和开源社区在用，企业端付费场景未规模化

这些瓶颈也正好是 NAIS 2.0 时期需要回答的问题——**SEA-LION v4/v5 是不是要走自研基座？算力是不是要绑定一个区域级 GPU 集群？**`,
        singaporeRelevanceJa: `SEA-LION はシンガポール AI 戦略**最も象徴的な成果物**です——政策文書より何よりも、「シンガポールはどのような AI をしたいのか」をより良く説明できます。

「7 つの伝導レバー」の中で、SEA-LION は同時に 3 つの上に落ちます：

- **レバー 5（政府自用）**：政府部門が SEA-LION に基づいて現地化 AI サービスを配置し、データを海外大企業に渡すことを避けます
- **レバー 6（外交）**：SEA-LION はシンガポールが ASEAN AI 協力、GPAI、Bletchley/Seoul サミットにおける「技術名刺」で、小国でもグローバルオープンソースモデルを産出できることを証明します
- **レバー 3（産業応用）**：オープンソース後、ローカル企業（特に金融、政府、医療といった機密データシーン）は直接ファインチューニングして使用でき、海外 API に拘束される必要がありません

見方：**SEA-LION の真の価値は技術的指標にはなく、それが「主権 AI」のモデルプロジェクトであるという点にあります**。それは東南アジアに以下を告げます：「あなたたちも自らの LLM 基盤を持つことができ、OpenAI だけを使用する必要がありません」。このナラティブの価値は、任意の単一ベンチマークへの向上をはるかに上回ります。

しかし SEA-LION は真実の課題も持っています：

- **ゼロからの訓練ではありません**——Llama 3 / Gemma といった Meta/Google のオープンソース基盤に依存しており、これは将来これらの基盤が閉鎖ソース化した場合、プロジェクト全体をやり直す必要があることを意味します
- **リソースは大企業より遠く小さいです**——AISG の計算能力予算は大企業の 1/100 で、反復速度は自然に遅いです
- **商業的なフィードバック・ループが実行していません**——現在、主に政府とオープンソースコミュニティが使用しており、企業側の有料シーンは規模化していません

これらの課題は正に NAIS 2.0 期間に答える必要がある質問です——**SEA-LION v4/v5 は自研基盤へ行くべきですか？計算能力は地域レベルの GPU クラスタに結合されるべきですか？**`,
        singaporeRelevanceEn: `SEA-LION is the **most symbolically important output** of Singapore's AI strategy — clearer than any policy document on "what kind of AI Singapore wants to do".

In the seven-lever framework, SEA-LION sits across three levers:

- **Lever 5 (government adoption)**: government agencies deploy localised AI services on SEA-LION, avoiding sending data to overseas big tech
- **Lever 6 (international)**: SEA-LION is Singapore's "tech calling card" at ASEAN AI cooperation, GPAI, Bletchley/Seoul summits — proof that small countries can produce globally usable open-source models
- **Lever 3 (industry adoption)**: once open-sourced, local enterprises (especially in finance, government, healthcare with sensitive data) can fine-tune directly without depending on overseas APIs

A take: **SEA-LION's real value is not in its benchmark numbers but in being a "sovereign AI" reference project** — it tells Southeast Asia: "you can also have your own LLM foundation, you don't have to use only OpenAI". This narrative value far exceeds its lift on any single benchmark.

But SEA-LION has real bottlenecks too:

- **Not trained from scratch** — it depends on Meta/Google open-source bases (Llama 3 / Gemma); if those move closed-source, the whole project must restart
- **Resources far smaller than big tech** — AISG's compute budget is roughly 1/100 of big tech, iteration speed is naturally slower
- **Commercial loop unproven** — currently mostly used by government and open-source community; enterprise paid scenarios have not scaled

These bottlenecks are exactly the questions to be answered in the NAIS 2.0 era — **should SEA-LION v4/v5 move to a self-built base? Should compute be bound to a regional GPU cluster?**`,
        milestones: [
          {
            date: '2023-04',
            title: 'AISG 启动 SEA-LION 项目',
            titleJa: 'AISG が SEA-LION プロジェクトを起動',
            titleEn: 'AISG launches the SEA-LION project',
            description: '宣布要做「东南亚自己的开源大模型」，初期目标 11 种语言。',
            descriptionJa:
              '「東南アジア独自のオープンソース大言語モデル」を構築することを宣言し、初期目標は11言語です。',
            descriptionEn: 'Announced "Southeast Asia\'s own open-source LLM"; initial target of 11 languages.',
          },
          {
            date: '2023-12',
            title: 'SEA-LION v1 发布',
            titleJa: 'SEA-LION v1 発表',
            titleEn: 'SEA-LION v1 released',
            description: '3B 与 7B 两个尺寸，基于自研架构，开源 MIT 协议。',
            descriptionJa: '3B と7B の2つのサイズ、自社開発アーキテクチャに基づく、MIT協議の下でオープンソース化。',
            descriptionEn: '3B and 7B sizes; in-house architecture; MIT-licensed open source.',
          },
          {
            date: '2024-04',
            title: 'SEA-HELM 评估基准发布',
            titleJa: 'SEA-HELM 評価ベンチマーク発布',
            titleEn: 'SEA-HELM benchmark released',
            description: '为东南亚语言模型建立标准化评估，配合 SEA-LION 推动行业基准。',
            descriptionJa: '東南アジア言語モデルの標準化評価を確立し、SEA-LION と連携して業界基準を推進します。',
            descriptionEn:
              'Established standardized evaluation for Southeast Asian language models; complements SEA-LION as industry benchmark.',
          },
          {
            date: '2024-12',
            title: 'SEA-LION v3 发布（Llama 3 基座）',
            titleJa: 'SEA-LION v3 発布（Llama 3ベース）',
            titleEn: 'SEA-LION v3 released (Llama 3-based)',
            description: '70B 与 8B 双版本，性能跻身东南亚语言 SOTA，HuggingFace 下载量进入百万级。',
            descriptionJa:
              '70Bと8Bの2バージョン、パフォーマンスが東南アジア言語 SOTA に達する、HuggingFace ダウンロード数が百万レベルに入ります。',
            descriptionEn:
              '70B and 8B variants; SOTA on Southeast Asian languages; downloads on HuggingFace pass the million mark.',
          },
          {
            date: '2025',
            title: 'SEA-Guard 安全防护工具发布',
            titleJa: 'SEA-Guard セキュリティ防護ツール発布',
            titleEn: 'SEA-Guard safety toolkit released',
            description: '配套 SEA-LION 的安全评估与防护层，解决东南亚语境下的内容安全问题。',
            descriptionJa: 'SEA-LION に付属する安全評価と防護層、東南アジアの文脈における内容安全の問題を解決します。',
            descriptionEn:
              'Companion safety evaluation and guardrail layer for SEA-LION; addresses Southeast Asian context content safety.',
          },
          {
            date: '2025',
            title: '政府部门部署 SEA-LION 落地',
            titleJa: '政府部門が SEA-LION を展開',
            titleEn: 'Government agencies deploy SEA-LION',
            description: '多个新加坡政府部门基于 SEA-LION 部署内部 AI 助手与公共服务原型。',
            descriptionJa:
              '複数のシンガポール政府部門が SEA-LION に基づいて内部AI助手と公共サービスプロトタイプを展開します。',
            descriptionEn:
              'Multiple Singapore government agencies deploy SEA-LION-based internal AI assistants and public service prototypes.',
          },
        ],
        relatedLeverNumbers: [3, 5, 6],
        relatedEntityIds: ['ai-singapore', 'sea-helm', 'sea-guard', 'imda'],
        sources: [
          {
            label: 'SEA-LION 官网',
            labelJa: 'SEA-LION 公式ウェブサイト',
            labelEn: 'SEA-LION official site',
            url: 'https://sea-lion.ai/',
            date: '2026-05-02',
          },
          {
            label: 'AISG 关于 SEA-LION 的产品页',
            labelJa: 'AISG による SEA-LION の製品ページ',
            labelEn: 'AISG SEA-LION product page',
            url: 'https://aisingapore.org/aiproducts/sea-lion/',
          },
          {
            label: 'SEA-HELM 排行榜',
            labelJa: 'SEA-HELM ランキング',
            labelEn: 'SEA-HELM leaderboard',
            url: 'https://leaderboard.sea-lion.ai/',
          },
        ],
        furtherReading: [
          {
            label: 'SEA-LION 技术博客',
            labelJa: 'SEA-LION テクニカルブログ',
            labelEn: 'SEA-LION technical blog',
            url: 'https://sea-lion.ai/blog/',
          },
          {
            label: 'SEA-LION HuggingFace 主页',
            labelJa: 'SEA-LION HuggingFace ホームページ',
            labelEn: 'SEA-LION on HuggingFace',
            url: 'https://huggingface.co/aisingapore',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'sea-helm',
        name: 'SEA-HELM',
        nameEn: 'SEA-HELM',
        description: '东南亚语言模型评估基准',
        descriptionJa: '東南アジア言語モデル評価ベンチマーク',
        descriptionEn: 'Benchmark for evaluating Southeast Asian language models',
        url: 'https://leaderboard.sea-lion.ai/',
        entityType: 'platform',
        status: 'active',
        founded: '2024-04',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '覆盖 11 种东南亚语言；评估指标 50+；持续更新排行榜',
        scaleJa: '11の東南アジア言語をカバー、50以上の評価指標、継続的にランキングを更新',
        scaleEn: 'Covers 11 Southeast Asian languages; 50+ evaluation metrics; continuously updated leaderboard',
        summary:
          'SEA-HELM（Southeast Asian Holistic Evaluation of Language Models）是 AISG 在 2024 年发布的东南亚语言模型评估基准，是全球第一个**专门针对东南亚 11 种语言的标准化 LLM 评估套件**。它配合 SEA-LION 一起构成"东南亚 LLM 训练 + 评估"的完整工具链。',
        summaryJa:
          'SEA-HELM（Southeast Asian Holistic Evaluation of Language Models）は、AISG が2024年に発布した東南アジア言語モデル評価ベンチマークで、世界初の**東南アジア11言語に特化した標準化LLM評価スイート**です。SEA-LION と連携して「東南アジアLLM訓練+評価」の完全なツールチェーンを構成します。',
        summaryEn:
          'SEA-HELM (Southeast Asian Holistic Evaluation of Language Models) is the Southeast Asian language model benchmark AISG released in 2024 — the world\'s first **standardised LLM evaluation suite purpose-built for the 11 Southeast Asian languages**. Together with SEA-LION it forms the complete "Southeast Asian LLM training + evaluation" toolchain.',
        whatItIs: `SEA-HELM 是基于 Stanford HELM（Holistic Evaluation of Language Models）框架，针对东南亚语言重新构建的评估基准。

评估维度包括：

- **NLU 任务**：文本分类、问答、阅读理解、自然语言推理
- **NLG 任务**：摘要、翻译、对话生成
- **语言能力**：语法、语义、词汇知识
- **世界知识**：东南亚文化、历史、地理常识
- **安全性**：偏见、有害内容、误导性输出
- **多语言能力**：跨语言迁移、代码切换

支持的 11 种语言：英语、中文、马来语、印尼语、泰语、越南语、菲律宾语、泰米尔语、缅甸语、高棉语、老挝语。

排行榜在 leaderboard.sea-lion.ai 公开，对全球 LLM（GPT-4、Claude、Gemini、Llama、Qwen、SEA-LION 等）做对比测试。`,
        whatItIsJa: `SEA-HELM は Stanford HELM（Holistic Evaluation of Language Models）フレームワークに基づき、東南アジア言語向けに再構築された評価ベンチマークです。

評価の次元は以下を含みます：

- **NLU タスク**：テキスト分類、質問応答、読解理解、自然言語推論
- **NLG タスク**：要約、翻訳、対話生成
- **言語能力**：文法、意味論、語彙知識
- **世界知識**：東南アジアの文化、歴史、地理的常識
- **安全性**：バイアス、有害なコンテンツ、誤解を招く出力
- **多言語能力**：言語間転移、コード切り替え

サポートされている 11 言語：英語、中国語、マレー語、インドネシア語、タイ語、ベトナム語、フィリピノ語、タミル語、ミャンマー語、クメール語、ラオ語。

リーダーボードは leaderboard.sea-lion.ai で公開され、グローバル LLM（GPT-4、Claude、Gemini、Llama、Qwen、SEA-LION など）と比較テストを行っています。`,
        whatItIsEn: `SEA-HELM is a benchmark rebuilt on the Stanford HELM (Holistic Evaluation of Language Models) framework, retargeted at Southeast Asian languages.

Evaluation dimensions include:

- **NLU tasks**: text classification, question answering, reading comprehension, natural language inference
- **NLG tasks**: summarisation, translation, dialogue generation
- **Linguistic competence**: grammar, semantics, lexical knowledge
- **World knowledge**: Southeast Asian culture, history, geography
- **Safety**: bias, harmful content, misleading outputs
- **Multilingual capability**: cross-lingual transfer, code-switching

The 11 supported languages: English, Chinese, Malay, Indonesian, Thai, Vietnamese, Filipino, Tamil, Burmese, Khmer, Lao.

The leaderboard is open at leaderboard.sea-lion.ai and runs comparative testing across global LLMs (GPT-4, Claude, Gemini, Llama, Qwen, SEA-LION, etc.).`,
        aiRelevance: `SEA-HELM 解决了一个被严重低估的问题：**东南亚语言 LLM 没有公允评估**。

之前的全球 benchmark（MMLU、HellaSwag、HumanEval 等）几乎全部是英语，少量加入中文/法文/德文。东南亚语言（特别是泰米尔语、缅甸语、高棉语等）在主流 benchmark 里几乎没有覆盖。这导致：

- 通用 LLM 厂商无法证明自己在这些语言上的能力
- 东南亚本地 LLM 厂商无法被客观评估
- 学术研究在这些语言上的进展无法量化

SEA-HELM 第一次提供了**统一、公开、可复现的评估**，让所有 LLM 都能在东南亚语言上被对比测试。结果出乎意料：

- GPT-4 / Claude 在泰语、越南语上的表现尚可，但在缅甸语、高棉语、老挝语上塌陷
- SEA-LION v3 在小语种上反超 GPT-4，证明继续预训练路线有效
- Llama / Gemma 等开源模型在东南亚语言上表现不一致

这套数据成为 SEA-LION 商业化最重要的"硬证据"。`,
        aiRelevanceJa: `SEA-HELM は極めて過小評価されている問題を解決しました：**東南アジア言語 LLM は公平な評価がありませんでした**。

以前のグローバルベンチマーク（MMLU、HellaSwag、HumanEval など）は、ほぼすべて英語で、少量の中国語/フランス語/ドイツ語を加えたもので。東南アジア言語（特にタミル語、ビルマ語、クメール語など）は主流ベンチマークでほぼカバーされていません。これは以下をもたらしました：

- 汎用 LLM メーカーは自分たちのこれらの言語でのスキルを証明できない
- 東南アジアローカル LLM メーカーは客観的に評価されない
- 学術研究のこれらの言語での進展は定量化できない

SEA-HELM は初めて**統一的、公開的、再現可能な評価**を提供し、すべての LLM が東南アジア言語で比較テストされることを可能にしました。結果は予想外でした：

- GPT-4 / Claude はタイ語、ベトナム語でのパフォーマンスはまあまあですが、ビルマ語、クメール語、ラオス語では崩壊します
- SEA-LION v3 は小言語で GPT-4 を逆転し、継続事前訓練ルートが有効であることを証明
- Llama / Gemma などのオープンソースモデルは東南アジア言語でのパフォーマンスが一貫しません

このデータセットは SEA-LION の商業化にとって最も重要な「ハード証拠」となりました。`,
        aiRelevanceEn: `SEA-HELM tackles a badly underestimated problem: **Southeast Asian language LLMs had no fair evaluation**.

Earlier global benchmarks (MMLU, HellaSwag, HumanEval, etc.) are almost entirely English, with a sprinkle of Chinese/French/German. Southeast Asian languages — especially Tamil, Burmese, Khmer and others — were barely covered in mainstream benchmarks. The consequences:

- General-purpose LLM vendors had no way to demonstrate capability in these languages
- Local Southeast Asian LLM vendors could not be assessed objectively
- Academic progress on these languages could not be quantified

SEA-HELM offers, for the first time, a **unified, public, reproducible evaluation**, so every LLM can be benchmarked against the others on Southeast Asian languages. The results were surprising:

- GPT-4 / Claude perform decently on Thai and Vietnamese but collapse on Burmese, Khmer, and Lao
- SEA-LION v3 overtakes GPT-4 on smaller languages, proving the continued pre-training strategy works
- Open-source models like Llama and Gemma are inconsistent across Southeast Asian languages

This data has become the most important "hard evidence" for SEA-LION's commercialisation.`,
        singaporeRelevance: `SEA-HELM 与 SEA-LION 是一对——**没有评估，就没有 SEA-LION 商业化的可信度**。

在「七条传导杠杆」里：

- **杠杆 6（外交）**：SEA-HELM 让新加坡在 ASEAN AI 合作中有"区域语言能力测评"的话语权
- **杠杆 3（产业应用）**：本地企业可以用 SEA-HELM 选择适合自己的 LLM
- **杠杆 4（治理）**：评估结果是政府部门 LLM 选型的客观依据

观点：**SEA-HELM 是新加坡 AI 战略中"标准之争"的关键一步**。它不是产品，但它定义了"什么算好的东南亚 LLM"——这种定义权比任何单个模型都更持久。如果未来 SEA-LION 被其他模型超越，SEA-HELM 仍然存在；只要东南亚 LLM 还要被评估，新加坡就在标准位置上。

可观察：**SEA-HELM 的更新速度**（GenAI 进展太快，benchmark 容易过时）、**与全球 benchmark 的对接**（HELM、Big-Bench、HuggingFace OpenLLM 是否承认 SEA-HELM）、**评估方法的争议**（小语种数据集质量、评估的统计可靠性）。`,
        singaporeRelevanceJa: `SEA-HELM と SEA-LION は一組です——**評価がなければ、SEA-LION の商用化への信頼性はありません**。

「7つの伝導レバー」の中で：

- **レバー 6（外交）**：SEA-HELM により、シンガポールは ASEAN AI 協力において「地域言語能力評価」の発言権を得ます
- **レバー 3（産業応用）**：地元企業は SEA-HELM を用いて自分たちに適した LLM を選択できます
- **レバー 4（ガバナンス）**：評価結果は政府部門の LLM 選定の客観的根拠となります

見方：**SEA-HELM は、シンガポール AI 戦略における「標準を巡る競い」の重要なステップです**。それは製品ではなく、「何が良い東南アジア LLM か」を定義しています——この定義権は、どの単一のモデルよりも永続的です。将来、SEA-LION が他のモデルに超えられても、SEA-HELM は存在し続けます；東南アジアの LLM が評価される限り、シンガポールは標準的なポジションにあります。

観察可能な点：**SEA-HELM の更新速度**（GenAI の進展が速いため、ベンチマークは陳腐化しやすい）、**グローバルベンチマークとの接続**（HELM、Big-Bench、HuggingFace OpenLLM が SEA-HELM を認めるか）、**評価方法の論争**（少数言語データセットの品質、評価の統計的信頼性）。`,
        singaporeRelevanceEn: `SEA-HELM and SEA-LION are a pair — **without evaluation, there is no credibility for SEA-LION's commercialisation**.

In the seven-lever framework:

- **Lever 6 (international)**: SEA-HELM gives Singapore a voice on "regional language capability assessment" in ASEAN AI cooperation
- **Lever 3 (industry adoption)**: local enterprises can use SEA-HELM to pick the right LLM for their needs
- **Lever 4 (governance)**: evaluation results provide an objective basis for government LLM procurement

A take: **SEA-HELM is a critical step in the "standards battle" within Singapore's AI strategy**. It is not a product, but it defines "what counts as a good Southeast Asian LLM" — and that definitional power is more durable than any single model. Even if SEA-LION is eventually surpassed by other models, SEA-HELM remains; as long as Southeast Asian LLMs need to be evaluated, Singapore sits on the standard.

Worth watching: **how quickly SEA-HELM updates** (GenAI moves fast and benchmarks go stale easily), **integration with global benchmarks** (whether HELM, Big-Bench, and the HuggingFace OpenLLM leaderboard recognise SEA-HELM), and **methodological controversies** (dataset quality for smaller languages, statistical reliability of the evaluations).`,
        milestones: [
          {
            date: '2024-04',
            title: 'SEA-HELM 首版发布',
            titleJa: 'SEA-HELM 初版発布',
            titleEn: 'SEA-HELM first version released',
          },
          {
            date: '2024-12',
            title: '随 SEA-LION v3 升级评估套件',
            titleJa: 'SEA-LION v3 と同時に評価スイートをアップグレード',
            titleEn: 'Evaluation suite upgraded alongside SEA-LION v3',
          },
        ],
        relatedLeverNumbers: [3, 4, 6],
        relatedEntityIds: ['sea-lion', 'ai-singapore', 'sea-guard'],
        sources: [
          {
            label: 'SEA-HELM 排行榜',
            labelJa: 'SEA-HELM ランキング',
            labelEn: 'SEA-HELM leaderboard',
            url: 'https://leaderboard.sea-lion.ai/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'sea-guard',
        name: 'SEA-Guard',
        nameEn: 'SEA-Guard',
        description: 'AI 安全评估与防护工具',
        descriptionJa: 'AI セキュリティ評価と防護ツール',
        descriptionEn: 'AI safety evaluation and guardrail toolkit',
        url: 'https://sea-lion.ai/blog/sea-guard-safety-model/',
        entityType: 'platform',
        status: 'active',
        founded: '2025',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'SEA-Guard 是 AISG 在 2025 年发布的 LLM 安全防护工具，配合 SEA-LION 使用，专攻东南亚语境下的内容安全（仇恨言论、宗教冲突、政治敏感、文化禁忌等）。它是 SEA-LION 在企业和政府部署时的"安全过滤层"。',
        summaryJa:
          'SEA-Guard は、AISG が2025年に発布したLLMセキュリティ防護ツールで、SEA-LION と共に使用され、東南アジアの文脈における内容安全（ヘイトスピーチ、宗教紛争、政治的敏感性、文化的タブー等）に特化しています。SEA-LION の企業と政府への展開における「セキュリティフィルター層」です。',
        summaryEn:
          'SEA-Guard is the LLM safety guardrail toolkit AISG released in 2025, designed to be used with SEA-LION and focused on content safety in Southeast Asian contexts (hate speech, religious conflict, political sensitivities, cultural taboos, etc.). It serves as the "safety filter layer" for SEA-LION in enterprise and government deployments.',
        whatItIs: `SEA-Guard 包括两个层面：

- **评估模型**：检测 LLM 输出在东南亚语境下的安全风险
- **防护策略**：在 LLM 推理时实时拦截/重写不安全内容

技术上，它训练了一系列分类器，识别东南亚语境特有的敏感内容：

- 多种族、多宗教语境下的仇恨言论
- 涉及种族骚乱（1969 KL、新加坡政治敏感事件）的历史话题
- 不同国家的政治禁忌（如缅甸军政府话题、泰国王室话题）
- 文化禁忌（饮食、性别、家庭观念等）

这些都是通用 LLM 安全系统（OpenAI Moderation、Llama Guard 等）覆盖不到的——它们的训练数据以英语为主，对东南亚语境理解有限。`,
        whatItIsJa: `SEA-Guard には 2 つのレイヤーがあります：

- **評価モデル**：LLM 出力が東南アジアの文脈における安全リスクを検出します
- **防護戦略**：LLM 推論時にリアルタイムで不安全なコンテンツをブロック/書き直します

技術的には、東南アジアの文脈特有の機密性の高いコンテンツを識別する一連の分類器を訓練しました：

- 多民族、多宗教の文脈での差別的表現
- 民族暴動（1969 年クアラルンプール、シンガポール政治的に敏感な出来事）に関連した歴史的トピック
- 異なる国々の政治的タブー（ミャンマーの軍事政権話題、タイ王室話題など）
- 文化的タブー（食事、ジェンダー、家族観など）

これらすべてが、汎用 LLM 安全システム（OpenAI Moderation、Llama Guard など）ではカバーできません——それらの訓練データは英語が中心であり、東南アジアの文脈への理解に限界があります。`,
        whatItIsEn: `SEA-Guard works at two levels:

- **Evaluation model**: detects safety risks in LLM outputs within Southeast Asian contexts
- **Guardrail policy**: intercepts or rewrites unsafe content in real time during LLM inference

Technically, it trains a series of classifiers to recognise content that is specifically sensitive in Southeast Asian contexts:

- Hate speech in multi-ethnic, multi-religious settings
- Historical topics tied to ethnic riots (1969 KL, politically sensitive Singapore events)
- National political taboos (e.g. Myanmar military regime topics, Thai monarchy topics)
- Cultural taboos (food, gender, family norms, etc.)

None of these are well covered by general-purpose LLM safety systems (OpenAI Moderation, Llama Guard, etc.) — their training data is predominantly English and they have limited understanding of Southeast Asian contexts.`,
        aiRelevance: `SEA-Guard 的存在意义：**通用 LLM 安全工具在东南亚语境失效**。

这不是 SOTA 模型问题，而是数据和文化问题。OpenAI 的 Moderation 训练数据主要是英语和北美/欧洲语境，对"在马来西亚什么话题敏感"、"在缅甸什么内容会被审查"这种细节没有概念。Llama Guard、ShieldGemma 等开源安全模型也有类似问题。

SEA-Guard 通过本地数据 + 本地标注，把这些"东南亚知识"编码进安全模型。虽然它的能力还远不如成熟商业产品，但它在东南亚语境的相对优势已经能帮助本地企业在合规部署 LLM 时减少风险。

技术挑战：

- **平衡**：拦截过严会损伤用户体验，过松会出事故
- **多语言**：东南亚 11 种语言每种都需要单独训练数据
- **政治敏感**：什么算"敏感"涉及政治判断，AISG 需要在不同国家间寻找平衡`,
        aiRelevanceJa: `SEA-Guard の存在意義：**汎用 LLM 安全ツールは東南アジアの文脈で機能しません**。

これは SOTA モデルの問題ではなく、データと文化の問題です。OpenAI の Moderation の訓練データは主に英語と北米/ヨーロッパの文脈であり、「マレーシアで何の話題が敏感か」、「ミャンマーで何の内容が検閲されるか」といった細部についての認識がありません。Llama Guard、ShieldGemma などのオープンソース安全モデルも同様の問題を持っています。

SEA-Guard は、ローカルデータ + ローカルアノテーションを通じて、これらの「東南アジア知識」を安全モデルに符号化します。その能力は成熟した商用製品ほどではありませんが、東南アジアの文脈での相対的な優位性により、ローカル企業が LLM をコンプライアンスに沿って展開する際のリスクを軽減するのに役立っています。

技術的課題：

- **バランス**：過度にブロックするとユーザーエクスペリエンスを損なわせ、甘すぎるとインシデントが発生します
- **多言語**：東南アジアの 11 言語はそれぞれ個別の訓練データが必要です
- **政治的敏感性**：「敏感」と判断されるものは政治的判断を伴い、AISG は異なる国々の間でバランスを見つける必要があります`,
        aiRelevanceEn: `Why SEA-Guard exists: **general-purpose LLM safety tools fail in Southeast Asian contexts**.

This is not a model SOTA problem — it is a data and culture problem. OpenAI's Moderation training data is mostly English and centred on North American / European contexts; it has no concept of "what topics are sensitive in Malaysia" or "what content gets censored in Myanmar". Llama Guard, ShieldGemma, and other open-source safety models have similar gaps.

SEA-Guard encodes "Southeast Asian knowledge" into a safety model through local data + local annotation. While it is still far less capable than mature commercial products, its relative advantage in Southeast Asian contexts already helps local enterprises reduce risk when deploying LLMs under compliance constraints.

Technical challenges:

- **Balance**: too strict and user experience suffers; too lax and incidents happen
- **Multilingualism**: each of the 11 Southeast Asian languages needs its own training data
- **Political sensitivity**: defining what counts as "sensitive" is a political judgement; AISG must find a balance across different countries`,
        singaporeRelevance: `SEA-Guard 是 SEA-LION 商业化必要的拼图——**没有安全工具，企业不敢用**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：让本地企业敢于在生产环境部署 SEA-LION
- **杠杆 5（政府自用）**：政府部门 AI 服务必须有安全过滤

观点：**SEA-Guard 是 AISG"全栈思维"的体现**——不只做模型，还做评估（SEA-HELM）和安全（SEA-Guard），形成"模型 + 评估 + 安全"完整工具链。这是国家级机构相对于初创公司的天然优势：可以做"商业上不性感但生态上必需"的工具。

但 SEA-Guard 的成熟度还不够：**目前更像 demo 而非产线工具**，准确率、覆盖度、运行效率都需要持续优化。能否在 1-2 年内达到 OpenAI Moderation 级别，是它的关键里程碑。`,
        singaporeRelevanceJa: `SEA-Guard は SEA-LION の商用化に不可欠なピースです——**安全ツールなしには、企業は使用を躊躇します**。

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：本地企業が生産環境に SEA-LION を展開することを可能にします
- **レバー 5（政府自己利用）**：政府部門の AI サービスは安全フィルタリングが必須です

見方：**SEA-Guard は AISG の「フルスタック思考」を体現しています**——モデルだけでなく、評価（SEA-HELM）と安全（SEA-Guard）も行い、「モデル + 評価 + 安全」の完全なツールチェーンを形成しています。これは国家級機関がスタートアップ企業に対して持つ自然なアドバンテージです：「商用的には魅力的ではないが、エコシステムとして必要」なツールを作ることができるのです。

しかし SEA-Guard の成熟度はまだ十分ではありません：**現在のところはデモに近く、生産環境向けのツールではありません**。精度、カバレッジ、実行効率すべてが継続的な最適化を必要とします。1～2 年以内に OpenAI Moderation レベルに達することができるかどうかが、その重要なマイルストーンです。`,
        singaporeRelevanceEn: `SEA-Guard is a necessary piece of the SEA-LION commercialisation puzzle — **without safety tooling, enterprises will not dare to use it**.

In the seven-lever framework:

- **Lever 3 (industry adoption)**: gives local enterprises confidence to deploy SEA-LION in production
- **Lever 5 (government adoption)**: government AI services must have safety filtering

A take: **SEA-Guard reflects AISG's "full-stack thinking"** — not just the model, but evaluation (SEA-HELM) and safety (SEA-Guard) too, forming a complete "model + evaluation + safety" toolchain. This is a natural advantage that national-level institutions hold over startups: they can build tools that are "commercially unsexy but ecosystem-essential".

But SEA-Guard's maturity is still not enough: **today it is more demo than production tool** — accuracy, coverage, and runtime efficiency all need continued optimisation. Whether it can reach OpenAI Moderation-level quality within 1-2 years is its key milestone.`,
        milestones: [
          {
            date: '2025',
            title: 'SEA-Guard 首版发布',
            titleJa: 'SEA-Guard 初版発布',
            titleEn: 'SEA-Guard first version released',
          },
        ],
        relatedLeverNumbers: [3, 5],
        relatedEntityIds: ['sea-lion', 'ai-singapore', 'sea-helm'],
        sources: [
          {
            label: 'AISG SEA-Guard 博客',
            labelJa: 'AISG SEA-Guard ブログ',
            labelEn: 'AISG SEA-Guard blog',
            url: 'https://sea-lion.ai/blog/sea-guard-safety-model/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'aquarium',
        name: 'Aquarium',
        nameEn: 'Aquarium',
        description: '数据驱动的 AI 模型管理平台',
        descriptionJa: 'データ駆動型AI モデル管理プラットフォーム',
        descriptionEn: 'Data-driven AI model management platform',
        entityType: 'platform',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'Aquarium 是 AISG 内部使用的 AI 模型管理平台，覆盖数据集管理、训练实验追踪、模型版本控制、部署监控等 ML lifecycle 环节。它不是独立产品，更像 AISG 的"内部 MLOps 系统"。',
        summaryJa:
          'Aquarium は、AISG 内部で使用されるAIモデル管理プラットフォームで、データセット管理、訓練実験追跡、モデルバージョン管理、展開監視などのML ライフサイクルの段階をカバーしています。独立した製品ではなく、AISG の「内部MLOpsシステム」のようなものです。',
        summaryEn:
          'Aquarium is the AI model management platform used internally at AISG, covering dataset management, training experiment tracking, model version control, deployment monitoring and other ML lifecycle stages. It is not a standalone product but rather AISG\'s "internal MLOps system".',
        whatItIs: `Aquarium 的功能模块：

- **数据集管理**：版本化、标注、分布分析
- **实验追踪**：训练 metrics、超参、checkpoint
- **模型注册**：model registry，支持版本回滚
- **部署监控**：在线模型的性能、漂移监控

设计上类似 MLflow + Weights & Biases + DVC 的组合，但针对 AISG 自己的工作流定制。`,
        whatItIsJa: `Aquarium の機能モジュール：

- **データセット管理**：バージョン化、アノテーション、分布分析
- **実験追跡**：訓練メトリクス、ハイパーパラメータ、チェックポイント
- **モデルレジストリ**：model registry、バージョンロールバック対応
- **デプロイメント監視**：オンラインモデルのパフォーマンス、ドリフト監視

設計上は MLflow + Weights & Biases + DVC の組み合わせに類似していますが、AISG 独自のワークフロー向けにカスタマイズされています。`,
        whatItIsEn: `Aquarium's functional modules:

- **Dataset management**: versioning, annotation, distribution analysis
- **Experiment tracking**: training metrics, hyperparameters, checkpoints
- **Model registry**: with version rollback support
- **Deployment monitoring**: performance and drift monitoring for in-production models

The design resembles a combination of MLflow + Weights & Biases + DVC, but customised for AISG's own workflow.`,
        aiRelevance: `Aquarium 在 AISG 的角色：**让 AIAP 学徒、SEA-LION 团队、各 AI 项目共享统一的 ML 工程基础设施**。

价值在于：

- 学徒不用每次项目都搭建实验追踪
- SEA-LION 等大项目的 checkpoint / 数据集管理有统一规范
- 跨项目可以重用数据集和组件`,
        aiRelevanceJa: `Aquarium における AISG の役割：**AIAP 学徒、SEA-LION チーム、各 AI プロジェクトが統一された ML エンジニアリング基盤インフラを共有できます**。

価値は以下の点にあります：

- 学徒はプロジェクトのたびに実験追跡を構築する必要がありません
- SEA-LION などの大規模プロジェクトのチェックポイント / データセット管理に統一された規範があります
- 複数プロジェクト間でデータセットとコンポーネントを再利用できます`,
        aiRelevanceEn: `Aquarium's role inside AISG: **giving AIAP apprentices, the SEA-LION team, and every AI project a shared ML engineering foundation**.

The value lies in:

- Apprentices don't have to set up experiment tracking from scratch each project
- Checkpoint and dataset management for major projects like SEA-LION follow a unified standard
- Datasets and components can be reused across projects`,
        singaporeRelevance: `Aquarium 是 AISG"工程化"的内部体现——**国家级 AI 机构需要工程基础设施，否则人力成本会被基础设施搭建吃掉**。

在「七条传导杠杆」里：

- **杠杆 1（基础设施）**：AISG 内部 ML 工程能力的基础

观点：Aquarium 不是 AISG 对外的旗舰产品，但它是 AISG 能持续高效输出（SEA-LION、TagUI、PeekingDuck 等）的工程基础。`,
        singaporeRelevanceJa: `Aquarium は AISG の「エンジニアリング化」の内部的な表現です——**国家級 AI 機構は工学的基盤インフラが必要です。そうでなければ人的コストが基盤インフラの構築に費やされます**。

「7つの伝導レバー」の中で：

- **レバー 1（基盤インフラ）**：AISG 内部 ML エンジニアリング能力の基礎

見方：Aquarium は AISG の外向きのフラッグシップ製品ではありませんが、AISG が継続的に高い効率で出力（SEA-LION、TagUI、PeekingDuck など）を生成するための工学的基礎です。`,
        singaporeRelevanceEn: `Aquarium reflects AISG's internal "engineering rigour" — **a national-level AI institution needs engineering infrastructure, or labour costs get eaten up by infrastructure-building**.

In the seven-lever framework:

- **Lever 1 (infrastructure)**: the foundation of AISG's internal ML engineering capability

A take: Aquarium is not AISG's flagship external product, but it is the engineering foundation that lets AISG keep delivering at high tempo (SEA-LION, TagUI, PeekingDuck, and more).`,
        milestones: [],
        relatedLeverNumbers: [1],
        relatedEntityIds: ['ai-singapore', 'sea-lion'],
        sources: [
          {
            label: 'AISG 官网',
            labelJa: 'AISG 公式ウェブサイト',
            labelEn: 'AISG official site',
            url: 'https://aisingapore.org/',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '创新孵化',
    nameJa: 'イノベーション孵化',
    nameEn: 'Innovation & Incubation',
    icon: '🚀',
    description: '从实验到产品的 AI 创新加速',
    descriptionJa: '実験から製品への AI イノベーション加速',
    descriptionEn: 'From experiment to product — accelerating AI innovation',
    entities: [
      {
        id: '100e',
        name: '100E（已归档）',
        nameJa: '100E（アーカイブ済み）',
        nameEn: '100E (Archived)',
        description: '100 Experiments 计划，资助企业 AI 概念验证',
        descriptionJa: '100 Experiments 計画、企業AI概念実証に資金提供',
        descriptionEn: '100 Experiments programme; funded enterprise AI proofs of concept',
        entityType: 'program',
        status: 'archived',
        founded: '2017',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '7 年累计完成 100+ 企业 AI 项目；累计补贴超过 SGD 2000 万',
        scaleJa: '7年間で100以上の企業AIプロジェクトを完了、累計補助金SGD 2000万を超える',
        scaleEn: '100+ enterprise AI projects over 7 years; total subsidies exceeding SGD 20 million',
        summary:
          '100E（100 Experiments）是 AISG 2017 年启动的旗舰企业 AI 落地资助计划——**政府+企业共同出资，AISG 学徒（AIAP）做执行**，把企业的 AI 想法快速跑成 PoC。2024 年正式归档，由新机制接续，但它建立的"学徒 + 企业合作"模式被后续项目继承。',
        summaryJa:
          '100E（100 Experiments）は、AISG が2017年に起動した旗艦企業AI展開資金支援計画で、**政府と企業の共同出資、AISG学徒（AIAP）による実行**により、企業のAI構想を迅速にPoC化します。2024年に正式にアーカイブされ、新しいメカニズムが引き継ぎますが、確立された「学徒+企業協力」モデルは後続プロジェクトに継承されます。',
        summaryEn:
          '100E (100 Experiments) is AISG\'s flagship enterprise AI deployment funding programme, launched in 2017 — **co-funded by government and enterprise, executed by AISG apprentices (AIAP)** to quickly turn enterprise AI ideas into PoCs. It was formally archived in 2024 and replaced by newer mechanisms, but the "apprentice + enterprise partnership" model it established has been inherited by successor programmes.',
        whatItIs: `100E 的运作模式：

- **企业提需求**：本地企业（中小企业为主）提交 AI 项目想法
- **AISG 评估**：技术可行性、商业价值、学徒锻炼价值
- **共同出资**：政府 + 企业按比例分担成本
- **AIAP 学徒执行**：项目由 AIAP 学徒在 AISG 工程师指导下完成
- **9 个月交付**：与 AIAP 学制对齐

效果：

- 7 年完成 100+ 项目（实际数字超过名字）
- 项目覆盖零售、医疗、金融、制造、物流、政府等
- 部分项目转化为长期产品，部分仅作为 PoC

为什么归档：100E 完成了"教育市场 + 培养学徒"的初始任务，AISG 在 2024 年用更灵活的合作机制替代它（保留学徒 + 企业合作内核，但形式更多样）。`,
        whatItIsJa: `100E の運営モデル：

- **企業がニーズを提示**：地元企業（主に中小企業）が AI プロジェクトのアイデアを提出します
- **AISG が評価**：技術的実現可能性、商業的価値、学徒養成の価値
- **共同出資**：政府と企業が比率に応じてコストを分担します
- **AIAP 学徒が実行**：プロジェクトは AISG エンジニアの指導の下、AIAP 学徒により完了されます
- **9 ヶ月で納品**：AIAP の学期に合わせます

成果：

- 7 年間で 100 以上のプロジェクトを完了（実際の数字は名前を上回ります）
- プロジェクトは小売、医療、金融、製造、ロジスティクス、政府など複数の分野をカバーしています
- 一部のプロジェクトは長期的な製品に転化し、一部は PoC にとどまります

アーカイブ理由：100E は「市場教育 + 学徒養成」の初期段階の任務を完了し、AISG は 2024 年により柔軟な協力メカニズムでこれに置き換わりました（学徒 + 企業協力のコアを保持しながらも、より多様な形式で）。`,
        whatItIsEn: `How 100E worked:

- **Enterprise pitches the need**: local enterprises (mostly SMEs) submit AI project ideas
- **AISG evaluates**: technical feasibility, commercial value, apprentice training value
- **Co-funded**: government + enterprise share costs proportionally
- **Executed by AIAP apprentices**: projects are delivered by AIAP apprentices under AISG engineer mentorship
- **9-month delivery**: aligned with the AIAP programme schedule

Outcomes:

- 100+ projects delivered over 7 years (the actual number exceeds the name)
- Projects span retail, healthcare, finance, manufacturing, logistics, government and more
- Some converted into long-term products; others remained as PoCs

Why archived: 100E completed its initial mission of "educating the market + training apprentices". In 2024 AISG replaced it with more flexible partnership mechanisms (preserving the "apprentice + enterprise partnership" core but in more varied forms).`,
        aiRelevance: `100E 在新加坡 AI 产业落地史上的意义：**第一次让中小企业知道"AI 是什么、能做什么、怎么用"**。

新加坡 AI 落地长期面临"大企业自己做 / 中小企业不会做"的两极。100E 用"政府补贴 + 学徒执行"打破了这个格局，让一些 SGD 5-50 万规模的中小企业也能尝试 AI 项目。

技术上，100E 项目的产出参差不齐——少数变成真正产品，多数只作为 PoC。但它的"启蒙价值"远超技术本身。`,
        aiRelevanceJa: `100E がシンガポール AI 産業の実装史における意義：**中小企業が初めて「AI とは何か、何ができるか、どう使うか」を理解するようになった**。

シンガポール AI の実装は長期的に「大企業が自力で行う / 中小企業はできない」という二極化に直面していました。100E は「政府補助 + 学徒実行」を用いてこの構図を打破し、SGD 5～50 万規模の中小企業の一部が AI プロジェクトを試すことを可能にしました。

技術的には、100E プロジェクトの成果はばらつきがあります——少数は真の製品に成長しましたが、多くは PoC にとどまります。しかし、その「啓発的価値」は技術そのものをはるかに超えています。`,
        aiRelevanceEn: `100E's significance in the history of AI deployment in Singapore: **it was the first time SMEs learned "what AI is, what it can do, and how to use it"**.

AI deployment in Singapore long faced a binary: "big enterprises build it themselves / SMEs don't know how". 100E broke that with "government subsidy + apprentice execution", letting SMEs in the SGD 50K-500K project range try AI for the first time.

Technically, 100E project outputs varied widely — a few became real products, most stayed as PoCs. But its "educational value" far exceeded the technology itself.`,
        singaporeRelevance: `100E 是新加坡"国家 + 企业 + 学徒三方共建"模式的源头。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：第一次让中小企业接触 AI
- **杠杆 2（人才）**：给 AIAP 学徒提供真实项目

观点：**100E 的归档不是失败，是模式成熟的标志**。它建立的"政府出钱 + 学徒出工 + 企业出场景"模式被后续项目继承，本身完成了它"启动新加坡企业 AI 落地"的历史使命。`,
        singaporeRelevanceJa: `100E はシンガポールの「国家 + 企業 + 学徒の三者共同構築」モデルの源です。

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：中小企業が初めて AI に接する機会
- **レバー 2（人材）**：AIAP 学徒に実践的なプロジェクトを提供します

見方：**100E のアーカイブは失敗ではなく、モデルが成熟した証です**。それが確立した「政府が資金提供 + 学徒が労働 + 企業がシナリオを提供」というモデルは後続プロジェクトに継承され、自らはシンガポール企業の AI 実装を「始める」という歴史的使命を完了しました。`,
        singaporeRelevanceEn: `100E is the origin of Singapore's "government + enterprise + apprentice" tripartite model.

In the seven-lever framework:

- **Lever 3 (industry adoption)**: the first programme to expose SMEs to AI
- **Lever 2 (talent)**: gave AIAP apprentices real projects to work on

A take: **100E being archived is not failure, but a sign that the model has matured**. The "government funds + apprentices work + enterprise provides the scenario" pattern has been inherited by successor programmes — 100E itself completed its historical mission of "kicking off enterprise AI deployment in Singapore".`,
        milestones: [
          {
            date: '2017',
            title: '100E 启动',
            titleJa: '100E 起動',
            titleEn: '100E launched',
          },
          {
            date: '2024',
            title: '100E 正式归档',
            titleJa: '100E 正式アーカイブ',
            titleEn: '100E formally archived',
          },
        ],
        relatedLeverNumbers: [2, 3],
        relatedEntityIds: ['ai-singapore', 'aiap'],
        sources: [
          {
            label: '100E 历史信息',
            labelJa: '100E 履歴情報',
            labelEn: '100E historical info',
            url: 'https://aisingapore.org/',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'aiap',
        name: 'AIAP',
        nameEn: 'AIAP',
        description: 'AI 学徒计划，沉浸式 AI 工程人才培养',
        descriptionJa: 'AI 学徒計画、没入型AIエンジニア人材育成',
        descriptionEn: 'AI Apprenticeship Programme; immersive training for AI engineering talent',
        url: 'https://aisingapore.org/innovation/aiap/',
        entityType: 'program',
        status: 'active',
        founded: '2018',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '22 批次 500+ 校友；每批约 30 人；月津贴 SGD 3500；9 个月学制',
        scaleJa: '22回のコース、500以上の卒業生、1回あたり約30人、月額手当SGD 3500、9ヶ月コース',
        scaleEn: '22 cohorts and 500+ alumni; ~30 apprentices per cohort; SGD 3,500/month stipend; 9-month programme',
        summary:
          'AIAP（AI Apprenticeship Programme）是 AISG 的旗舰人才项目，2018 年启动，**专门把"会写代码但没做过 AI"的工程师 9 个月内训练成"AI 工程师"**。它是新加坡本地 AI 工程师产出的主要管道，也是 AISG 自身 AI 产品（SEA-LION 等）的人才储备池。',
        summaryJa:
          'AIAP（AI Apprenticeship Programme）は、AISG の旗艦人材プロジェクトで、2018年に起動されました。**「コード作成はできるがAI経験がない」エンジニアを9ヶ月以内に「AIエンジニア」に訓練することに特化しています**。シンガポール国内のAIエンジニア養成の主要チャネルであり、AISG自体のAI製品（SEA-LION等）の人材プールでもあります。',
        summaryEn:
          'AIAP (AI Apprenticeship Programme) is AISG\'s flagship talent programme, launched in 2018, **purpose-built to turn engineers who "can code but have never done AI" into "AI engineers" in 9 months**. It is the main pipeline for producing local AI engineers in Singapore, and also the talent reservoir for AISG\'s own AI products (SEA-LION and others).',
        whatItIs: `AIAP 的设计非常独特：

- **学徒制**：不是上课，而是带薪做真实项目
- **9 个月**：第 1 个月 deepskilling（恶补 ML 基础），第 2-9 个月做 100E 实际项目
- **导师制**：每组学徒配资深 AI 工程师 / 研究员做 mentor
- **筛选严格**：每年申请 1000+，录取约 60-80 人

学徒来源：

- **跨界转型**：传统软件工程师转 AI（最大群体）
- **应届毕业生**：CS / 数学 / 物理背景
- **海归**：海外 AI 硕博毕业回新加坡
- **行业转型**：金融、医疗等行业 IT 人转 AI

毕业后约 70% 留在新加坡 AI 行业，30% 流向海外大厂。`,
        whatItIsJa: `AIAP の設計は非常にユニークです：

- **見習い制度**：講義ではなく、給与を得ながら実際のプロジェクトに従事
- **9 ヶ月間**：第 1 ヶ月は深層学習基礎の集中補習、第 2-9 ヶ月は 100E の実際のプロジェクトを担当
- **メンター制度**：各グループの見習いに経験豊かな AI エンジニア／研究者がメンターとして付く
- **厳格な選抜**：毎年 1000 件以上の申請があり、約 60～80 人が合格

見習い生の出身背景：

- **異業種からの転職**：従来のソフトウェアエンジニアから AI へ（最大のグループ）
- **新卒者**：CS／数学／物理の背景を持つ者
- **海外帰国者**：海外で AI の修士号・博士号を取得した後、シンガポールに帰国
- **業界転換**：金融、医療などの業界から IT 人材が AI へ転換

卒業後、約 70% がシンガポール AI 業界に留まり、30% が海外の大手企業へ流出します。`,
        whatItIsEn: `AIAP's design is highly distinctive:

- **Apprenticeship**: not classes, but paid work on real projects
- **9 months**: month 1 is deepskilling (intensive ML fundamentals), months 2-9 are real 100E projects
- **Mentorship**: each apprentice cohort is paired with senior AI engineers / researchers as mentors
- **Strict selection**: 1,000+ applicants per year, ~60-80 accepted

Apprentice backgrounds:

- **Cross-discipline transition**: traditional software engineers moving into AI (largest group)
- **Fresh graduates**: CS / mathematics / physics backgrounds
- **Returnees**: AI master's / PhD graduates from overseas returning to Singapore
- **Industry transition**: IT staff from finance, healthcare, etc. moving into AI

After graduation, around 70% stay in Singapore's AI industry; 30% leave for overseas big tech.`,
        aiRelevance: `AIAP 解决的核心问题：**新加坡本地 AI 工程师供给严重不足**。

新加坡的高校 CS 毕业生质量高但数量少（NUS / NTU 一年合计也就千把人），其中真正做 AI 的更少。商业 AI 团队（DBS、Singtel、Grab）和创业公司常年在抢人。AIAP 的存在让"非 CS 背景但有学习能力"的工程师能快速进入 AI 工程领域，相当于给本地 AI 人才市场加了一条"侧门通道"。

技术上 AIAP 的训练强度很高——9 个月从零到能写 production 级 AI 项目，要求学徒每天工作 10+ 小时。这种强度筛掉了不适合的人，留下来的都是真正能干活的。`,
        aiRelevanceJa: `AIAP が解決する中核課題：**シンガポール地元の AI エンジニア供給が深刻に不足しています**。

シンガポール高等教育の CS 卒業生の質は高いものの数は少ない（NUS / NTU の合計でも毎年 1000 人強）。このうち実際に AI に従事する者はさらに少ないです。商業的 AI チーム（DBS、Singtel、Grab）とスタートアップは常に人材を争奪しています。AIAP の存在により「CS 以外のバックグラウンドを持つものの学習能力のあるエンジニア」が AI エンジニアリング分野に素早く進入できることを可能にしています。これはシンガポール地元の AI 人材市場に「側面通路」を追加することと同じです。

技術的には、AIAP の訓練強度は非常に高いです——ゼロから 9 ヶ月でプロダクションレベルの AI プロジェクトを書けるようになる必要があり、学徒は 1 日 10 時間以上の労働を要求されます。この強度は適性のない者をふるい落とし、残った者はすべて真に実行能力を持つものです。`,
        aiRelevanceEn: `The core problem AIAP solves: **a severe shortage of locally trained AI engineers in Singapore**.

Singapore's universities produce high-quality but small numbers of CS graduates (NUS / NTU together produce roughly a thousand per year), and only a fraction actually go into AI. Commercial AI teams (DBS, Singtel, Grab) and startups are constantly competing for talent. AIAP gives engineers from "non-CS backgrounds with strong learning ability" a fast track into AI engineering — effectively a "side door" into the local AI talent market.

Technically, AIAP's training intensity is very high — going from zero to writing production-grade AI projects in 9 months requires apprentices to work 10+ hours a day. That intensity filters out those who aren't suited; what remains are people who can genuinely deliver.`,
        singaporeRelevance: `AIAP 是新加坡 AI 战略**"杠杆 2（人才）"**的核心抓手。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：本地 AI 工程师培养主管道
- **杠杆 3（应用）**：通过 100E 项目让学徒在企业实战

观点：**AIAP 的"学徒 + 项目"模式是新加坡 AI 人才战略的最大创新**。它不是高校能做的（高校太学术），不是企业能做的（企业不愿意花 9 个月慢慢带新人），只能由 AISG 这种"国家计划 + 商业项目桥梁"型机构来做。

但 AIAP 也有结构性挑战：**人才流失率高**——9 个月后学徒进入私企，AISG 留不住自己培养的人；**项目质量依赖企业方**——100E 合作企业的项目水平参差不齐；**规模天花板**——每年 60-80 人的产出对新加坡 AI 行业仍然是杯水车薪。

NAIS 2.0 时期 AIAP 的关键问题：**能否扩大到每年 200+？能否提高留存率？能否产出更高质量的 AI 工程师？**`,
        singaporeRelevanceJa: `AIAP はシンガポール AI 戦略の**「レバー 2（人材）」**の中核的なレバーです。

「7つの伝導レバー」の中で：

- **レバー 2（人材）**：地元 AI エンジニア育成の主要なパイプライン
- **レバー 3（応用）**：100E プロジェクトを通じて学徒に企業実践経験を提供します

見方：**AIAP の「学徒 + プロジェクト」モデルはシンガポール AI 人材戦略の最大の革新です**。高等教育には不可能（大学は学術的すぎる）、民間企業にも不可能（企業は新人に 9 ヶ月をかけたくない）。AISG のような「国家計画 + 商業プロジェクト橋渡し」型機構にのみできます。

しかし AIAP にも構造的な課題があります：**人材流出率が高い**——9 ヶ月後、学徒は民間企業に進み、AISG は自らが育成した人材を保持できません；**プロジェクト品質が企業側に依存**——100E 協力企業のプロジェクトレベルはばらつきがあります；**規模の天井**——毎年 60～80 人の輩出はシンガポール AI 産業にとってまだ焼け石に水です。

NAIS 2.0 期の AIAP の主要課題：**毎年 200 人以上に拡大できるか？保持率を上げられるか？より高品質な AI エンジニアを輩出できるか？**`,
        singaporeRelevanceEn: `AIAP is the core lever for **"Lever 2 (talent)"** in Singapore's AI strategy.

In the seven-lever framework:

- **Lever 2 (talent)**: the main pipeline for training local AI engineers
- **Lever 3 (application)**: through 100E projects, apprentices get real enterprise experience

A take: **AIAP's "apprentice + project" model is the biggest innovation in Singapore's AI talent strategy**. Universities cannot do this (too academic), enterprises cannot do this (unwilling to spend 9 months slowly mentoring newcomers) — only an institution like AISG, sitting on the "national programme + commercial project bridge", can pull it off.

But AIAP also has structural challenges: **high attrition** — after 9 months, apprentices move into private sector roles and AISG cannot retain its own graduates; **project quality depends on the enterprise side** — the calibre of 100E partner projects varies significantly; **scale ceiling** — 60-80 graduates per year is still a drop in the bucket for Singapore's AI industry.

The key questions for AIAP in the NAIS 2.0 era: **Can it scale to 200+ per year? Can retention be improved? Can it produce higher-calibre AI engineers?**`,
        milestones: [
          {
            date: '2018',
            title: 'AIAP 第 1 批启动',
            titleJa: 'AIAP 第1期起動',
            titleEn: 'AIAP cohort 1 launched',
          },
          {
            date: '2022',
            title: '校友突破 300 人',
            titleJa: '卒業生が300人を突破',
            titleEn: 'Alumni exceed 300',
          },
          {
            date: '2024',
            title: '校友突破 500 人，第 22 批入学',
            titleJa: '卒業生が500人を突破、第22期入学',
            titleEn: 'Alumni exceed 500; cohort 22 begins',
          },
        ],
        relatedLeverNumbers: [2, 3],
        relatedEntityIds: ['ai-singapore', 'nus', 'ntu'],
        sources: [
          {
            label: 'AIAP 官网',
            labelJa: 'AIAP 公式ウェブサイト',
            labelEn: 'AIAP official site',
            url: 'https://aisingapore.org/innovation/aiap/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'ladp',
        name: 'LADP',
        nameEn: 'LADP',
        description: '学习者 AI 开发计划，16 周实战项目',
        descriptionJa: '学習者AI開発計画、16週間の実践プロジェクト',
        descriptionEn: "Learners' AI Development Programme; 16-week hands-on project track",
        url: 'https://aisingapore.org/innovation/ladp/',
        entityType: 'program',
        status: 'active',
        founded: '2022',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '16 周；每年 2-3 批；每批 30-50 人',
        scaleJa: '16週間、毎年2～3回のコース、1回あたり30～50人',
        scaleEn: '16 weeks; 2-3 cohorts per year; 30-50 learners per cohort',
        summary:
          'LADP（Learners\' AI Development Programme）是 AIAP 的"前置版"——16 周、更短、门槛更低。它是 AISG 培养"AI 入门级人才"的项目，毕业生中表现优秀的可以进 AIAP 继续深造。',
        summaryJa:
          "LADP（Learners' AI Development Programme）は、AIAP の「前置版」で、16週間、より短く、閾値が低くなっています。AISG が「AI初級人材」を育成するプロジェクトで、卒業生の中で優秀な成績を収めた者は、AIAPで継続して深造できます。",
        summaryEn:
          'LADP (Learners\' AI Development Programme) is the "pre-stage version" of AIAP — 16 weeks, shorter, with a lower bar. It is AISG\'s programme for training "entry-level AI talent"; top performers can move on to AIAP for deeper training.',
        whatItIs: `LADP 与 AIAP 的差异：

- **时长**：16 周 vs 9 个月
- **门槛**：更低，欢迎转行新人
- **强度**：相对温和，更接近"训练营"
- **产出**：完成几个小项目，理解 AI 工程基础

定位：让"想转 AI 但不确定能不能行"的人有个 16 周的试水期。完成后，能力强的可以申请 AIAP，其他人也能凭项目作品进入入门级 AI 岗位。`,
        whatItIsJa: `LADP と AIAP の相違点：

- **期間**：16 週間対 9 ヶ月間
- **要件**：より低く、転職者を歓迎
- **強度**：相対的に緩やか、「トレーニングキャンプ」に近い
- **成果物**：小規模なプロジェクトを数件完了し、AI エンジニアリングの基礎を理解

位置付け：「AI へ転職したいが、本当に対応できるか不安」という人向けの 16 週間のトライアル期間。完了後、能力が高い者は AIAP に応募でき、その他の人材もプロジェクト成果物を持ってエントリーレベルの AI 職に就職できます。`,
        whatItIsEn: `Differences between LADP and AIAP:

- **Duration**: 16 weeks vs 9 months
- **Bar**: lower, welcomes career-changers
- **Intensity**: relatively gentle, closer to a "boot camp"
- **Output**: complete a few small projects, understand AI engineering fundamentals

Positioning: a 16-week trial run for people who "want to switch to AI but aren't sure they can do it". After finishing, the strongest can apply to AIAP; others can also use the project portfolio to land entry-level AI roles.`,
        aiRelevance: `LADP 的存在让 AISG 的人才漏斗有了完整层级：**LADP（16 周入门）→ AIAP（9 个月深度）→ 加入企业 / AISG 项目**。

这个分层让"非 CS 出身想转 AI"的人有清晰路径：先 LADP 试水，再决定要不要全力投入 AIAP。`,
        aiRelevanceJa: `LADP の存在により、AISG の人材パイプラインは完全な階層構造を実現します：**LADP（16 週間入門）→ AIAP（9 ヶ月間の深い学習）→ 企業への就職／AISG プロジェクト参加**。

この階層化により、「非 CS 出身者が AI へ転職したい」という人々に明確な道筋が示されます：まず LADP で試し、その後全力投入する価値があるかどうかを判断できます。`,
        aiRelevanceEn: `LADP gives AISG's talent funnel a complete tiered structure: **LADP (16-week entry) → AIAP (9-month depth) → joining enterprises / AISG projects**.

This tiering gives "non-CS background, wanting to switch to AI" people a clear path: try LADP first, then decide whether to commit fully to AIAP.`,
        singaporeRelevance: `LADP 是 AIAP 的"扩容前哨"——AISG 通过 LADP 接触更广泛的潜在人才池，再筛选最优秀的进 AIAP。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：拓宽 AI 人才入口

观点：LADP 的存在解决了 AIAP 长期"申请池不够大"的问题——通过 LADP 把潜在人才池扩大 5-10 倍。`,
        singaporeRelevanceJa: `LADP は AIAP の「人材拡充の前線基地」です。AISG は LADP を通じてより広範な潜在人材プールと接触し、最優秀者を AIAP に選抜します。

「7つの伝導レバー」の中で：

- **レバー 2（人材）**：AI 人材の入口を広げる

観点：LADP の存在により、AIAP が長期的に直面していた「申請者が足りない」という問題が解決されます。LADP を通じて、潜在人材プールを 5～10 倍に拡大できます。`,
        singaporeRelevanceEn: `LADP is AIAP's "scale-up forward outpost" — AISG uses LADP to reach a wider potential talent pool, then screens the strongest into AIAP.

In the seven-lever framework:

- **Lever 2 (talent)**: broadens the entry point for AI talent

A take: LADP solves AIAP's long-standing "applicant pool too small" problem — by using LADP to expand the potential talent pool 5-10x.`,
        milestones: [
          {
            date: '2022',
            title: 'LADP 启动',
            titleJa: 'LADP 起動',
            titleEn: 'LADP launched',
          },
        ],
        relatedLeverNumbers: [2],
        relatedEntityIds: ['ai-singapore', 'aiap'],
        sources: [
          {
            label: 'LADP 官网',
            labelJa: 'LADP 公式ウェブサイト',
            labelEn: 'LADP official site',
            url: 'https://aisingapore.org/innovation/ladp/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: 'AI 产品',
    nameJa: 'AI 製品',
    nameEn: 'AI Products',
    icon: '📦',
    description: 'AI Singapore 开源产品与工具',
    descriptionJa: 'AI Singapore オープンソース製品とツール',
    descriptionEn: "AI Singapore's open-source products and tools",
    entities: [
      {
        id: 'tagui',
        name: 'TagUI',
        nameEn: 'TagUI',
        description: 'RPA 自动化工具，全球 5000+ Stars',
        descriptionJa: 'RPA自動化ツール、グローバル5000以上のスター',
        descriptionEn: 'RPA automation tool with 5,000+ GitHub stars worldwide',
        url: 'https://github.com/aisingapore/TagUI',
        entityType: 'product',
        status: 'active',
        founded: '2017',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: 'GitHub 5000+ Stars；全球用户数十万；20+ 语言流程脚本支持',
        scaleJa: 'GitHub 5000以上のスター、グローバルユーザー数十万、20以上の言語プロセススクリプトサポート',
        scaleEn:
          '5,000+ GitHub stars; hundreds of thousands of users worldwide; supports flow scripts in 20+ languages',
        summary:
          'TagUI 是 AISG 维护的开源 RPA（机器人流程自动化）工具，2017 年发布，是新加坡最早的"全球级开源项目"之一。它的核心价值在于**让非程序员用接近自然语言的脚本自动化网页和桌面操作**，被全球数十万用户使用。',
        summaryJa:
          'TagUI は、AISG が保守するオープンソースRPA（ロボティックプロセスオートメーション）ツールで、2017年に発布され、シンガポール最初の「グローバル級オープンソースプロジェクト」の一つです。その核心的な価値は、**非プログラマーが自然言語に近いスクリプトでWebページとデスクトップ操作を自動化すること**にあり、世界中数十万のユーザーに利用されています。',
        summaryEn:
          'TagUI is an open-source RPA (Robotic Process Automation) tool maintained by AISG. Released in 2017, it is one of Singapore\'s earliest "globally adopted open-source projects." Its core value: **letting non-programmers automate web and desktop operations with near-natural-language scripts** — and it has hundreds of thousands of users worldwide.',
        whatItIs: `TagUI 用一种叫"流程脚本（flow）"的简化语法，让用户描述要自动化的步骤：

\`\`\`
https://google.com
type q as TagUI
click btnK
read result_stats to total
\`\`\`

底层基于 Sikuli + ChromeDriver + OCR，支持：

- **网页自动化**：表单填写、爬虫、报表抓取
- **桌面自动化**：模拟鼠标键盘、读取屏幕文本（OCR）
- **跨平台**：Windows / macOS / Linux 都支持
- **多语言流程脚本**：除了英文，还支持中文、日文、印尼文等的"自然语言式"流程脚本

它的定位是"反 UiPath / Automation Anywhere"——不要复杂的可视化设计器，不要昂贵的企业版授权，只要简单的脚本和命令行。这种极简哲学让它在小企业、学生、自由职业者中广受欢迎。`,
        whatItIsJa: `TagUI は「プロセススクリプト（フロー）」と呼ばれるシンプル化された構文を使用し、ユーザーが自動化する手順を記述できます：

\`\`\`
https://google.com
type q as TagUI
click btnK
read result_stats to total
\`\`\`

基層は Sikuli + ChromeDriver + OCR に基づき、以下をサポート：

- **ウェブ自動化**：フォーム入力、ウェブスクレイピング、レポート抽出
- **デスクトップ自動化**：マウス・キーボードシミュレーション、画面テキスト読み込み（OCR）
- **クロスプラットフォーム**：Windows／macOS／Linux に対応
- **多言語プロセススクリプト**：英語以外に、中国語、日本語、インドネシア語など「自然言語式」のプロセススクリプトにも対応

その位置付けは「UiPath／Automation Anywhere に対抗」という姿勢です。複雑なビジュアルデザイナーは不要、高額なエンタープライズライセンスも不要、シンプルなスクリプトとコマンドラインのみで十分という、このミニマリスト哲学が小企業、学生、フリーランサーの間で広く好まれています。`,
        whatItIsEn: `TagUI uses a simplified syntax called "flow scripts" that lets users describe the steps they want to automate:

\`\`\`
https://google.com
type q as TagUI
click btnK
read result_stats to total
\`\`\`

Built on Sikuli + ChromeDriver + OCR, it supports:

- **Web automation**: form filling, scraping, report extraction
- **Desktop automation**: simulating mouse and keyboard, reading on-screen text (OCR)
- **Cross-platform**: runs on Windows / macOS / Linux
- **Multilingual flow scripts**: beyond English, supports natural-language-style flow scripts in Chinese, Japanese, Indonesian, and more

Its positioning is anti-UiPath / Automation Anywhere — no complex visual designers, no expensive enterprise licenses, just simple scripts and the command line. This minimalist philosophy has won it a strong following among small businesses, students, and freelancers.`,
        aiRelevance: `TagUI 严格说是 RPA 工具不是 AI——但它是"AI 落地基础设施"的重要一环。

很多 AI 项目卡在"如何把 AI 能力嵌入现有业务流程"——RPA 是这个集成层最常见的工具。TagUI 让小企业不用买昂贵 RPA 授权就能做：

- 用 Python 调用 LLM API → TagUI 把结果自动填入企业系统
- TagUI 抓取网页数据 → 喂给 ML 模型
- AI 模型生成报告 → TagUI 自动发邮件、上传

新版 TagUI 也在加入更多 AI 能力：

- OCR 升级到深度学习模型
- 加入 LLM 辅助的"自然语言生成 RPA 脚本"功能
- 视觉模型识别 UI 元素（替代脆弱的 XPath / CSS 选择器）`,
        aiRelevanceJa: `厳密に言うと、TagUI は RPA ツールであり AI ではありません。ただし、「AI 実装インフラ」の重要な一部です。

多くの AI プロジェクトが「AI 機能を既存業務プロセスに組み込むにはどうするか」という問題で停滞しています。RPA はこの統合レイヤーで最も一般的なツールです。TagUI により、小企業は高額な RPA ライセンスを購入することなく、以下を実現できます：

- Python で LLM API を呼び出す → TagUI が結果を企業システムに自動入力
- TagUI がウェブページデータを取得 → ML モデルに供給
- AI モデルがレポート生成 → TagUI が自動的にメール送信・アップロード

新しいバージョンの TagUI はさらに多くの AI 機能を追加しています：

- OCR を深層学習モデルにアップグレード
- LLM を活用した「自然言語での RPA スクリプト生成」機能を追加
- UI 要素を視覚モデルで認識（脆弱な XPath／CSS セレクタに代替）`,
        aiRelevanceEn: `Strictly speaking, TagUI is an RPA tool, not AI — but it is an important piece of "AI deployment infrastructure."

Many AI projects get stuck on "how to embed AI capabilities into existing business processes," and RPA is the most common tool at this integration layer. TagUI lets small businesses do this without paying for expensive RPA licenses:

- Call an LLM API in Python → TagUI auto-fills results into enterprise systems
- TagUI scrapes web data → feeds it to an ML model
- An AI model generates a report → TagUI emails and uploads it automatically

Newer versions of TagUI are also adding more AI capabilities:

- OCR upgraded to deep-learning models
- LLM-assisted "natural-language to RPA script" generation
- Vision models for identifying UI elements (replacing brittle XPath / CSS selectors)`,
        singaporeRelevance: `TagUI 在新加坡 AI 战略里是**"开源软实力"的代表**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：降低中小企业 RPA / AI 落地门槛
- **杠杆 6（外交）**：作为新加坡少数有全球影响力的开源项目，展示新加坡软件实力

观点：**TagUI 证明了"国家机构维护开源工具"是有效的战略**——它不直接赚钱，但建立了 AISG 的全球技术声誉，培养了一批 AISG 出品的开源使用者，对 SEA-LION 等后续项目的接受度有正面影响。

可观察：TagUI 与新一代 RPA + AI 工具（如 Browser Use、Agent.ai）的竞合、社区活跃度、能否升级为"AI Agent 时代"的工具。`,
        singaporeRelevanceJa: `TagUI はシンガポール AI 戦略において、**「オープンソース・ソフトパワー」の代表**です。

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：中小企業の RPA／AI 実装の敷居を下げる
- **レバー 6（外交）**：シンガポールが有する数少ない世界的影響力を持つオープンソースプロジェクトとして、シンガポールのソフトウェア実力を示す

観点：**TagUI は「国家機関がオープンソースツールをメンテナンスすることは戦略として有効」であることを証明しています。**直接的な収益にはなりませんが、AISG の世界的な技術的評判を確立し、AISG 産出のオープンソース利用者を育成し、SEA-LION などその後のプロジェクトの受け入れ度を高めるプラスの影響があります。

観察可能：TagUI と新世代 RPA + AI ツール（Browser Use、Agent.ai など）の共存・競争関係、コミュニティの活動度、「AI Agent 時代」のツールへのアップグレードが可能かどうか。`,
        singaporeRelevanceEn: `Within Singapore's AI strategy, TagUI is **a poster child for "open-source soft power."**

Across the seven transmission levers:

- **Lever 3 (Industry Adoption)**: lowers the barrier for SMEs to adopt RPA / AI
- **Lever 6 (Diplomacy)**: as one of Singapore's few open-source projects with genuine global reach, it showcases Singapore's software capability

Take: **TagUI proves that "a national institution maintaining open-source tools" can be an effective strategy.** It doesn't generate direct revenue, but it has built AISG's global technical reputation and cultivated a base of users familiar with AISG-produced open source — which positively shaped reception of follow-on projects like SEA-LION.

Worth watching: how TagUI competes and coexists with the next generation of RPA + AI tools (Browser Use, Agent.ai), community activity, and whether it can evolve into a tool fit for the "AI Agent era."`,
        milestones: [
          {
            date: '2017',
            title: 'TagUI 开源发布',
            titleJa: 'TagUI オープンソース発布',
            titleEn: 'TagUI open-sourced',
          },
          {
            date: '2018',
            title: 'AISG 接管维护',
            titleJa: 'AISG が引き継ぎ・維持管理',
            titleEn: 'AISG takes over maintenance',
          },
          {
            date: '2023',
            title: 'GitHub Stars 突破 5000',
            titleJa: 'GitHub Stars が 5000 を突破',
            titleEn: 'GitHub stars exceed 5,000',
          },
        ],
        relatedLeverNumbers: [3, 6],
        relatedEntityIds: ['ai-singapore'],
        sources: [
          {
            label: 'TagUI GitHub',
            labelEn: 'TagUI on GitHub',
            url: 'https://github.com/aisingapore/TagUI',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'peekingduck',
        name: 'PeekingDuck',
        nameEn: 'PeekingDuck',
        description: '计算机视觉推理框架',
        descriptionJa: 'コンピュータビジョン推論フレームワーク',
        descriptionEn: 'Computer vision inference framework',
        url: 'https://github.com/aisingapore/PeekingDuck',
        entityType: 'product',
        status: 'active',
        founded: '2021',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'PeekingDuck 是 AISG 开源的计算机视觉推理框架，定位是"易用、模块化、生产级"的 CV 工具包。它把目标检测、姿态估计、跟踪、人脸识别等常见 CV 任务封装成可拼接的"节点"，让开发者用配置文件（YAML）就能搭建完整的 CV pipeline。',
        summaryJa:
          'PeekingDuck は AISG がオープンソース化したコンピュータビジョン推論フレームワークで、位置づけは「使いやすく、モジュール化、プロダクションレベル」の CV ツールキットです。目標検出、姿勢推定、トラッキング、顔認識などの一般的な CV タスクを組み合わせ可能な「ノード」にカプセル化し、開発者が設定ファイル（YAML）だけで完全な CV パイプラインを構築できるようにしています。',
        summaryEn:
          'PeekingDuck is AISG\'s open-source computer-vision inference framework, positioned as an "easy-to-use, modular, production-grade" CV toolkit. It packages common CV tasks — object detection, pose estimation, tracking, face recognition — into composable "nodes," letting developers stand up a full CV pipeline through a YAML config file.',
        whatItIs: `PeekingDuck 的核心理念是 pipeline-as-config：

\`\`\`yaml
nodes:
  - input.visual:
      source: webcam
  - model.yolo
  - draw.bbox
  - output.screen
\`\`\`

这个配置启动后就是一个完整的"摄像头 → YOLO 检测 → 画框 → 显示"的实时 pipeline。框架内置 50+ 节点，覆盖输入（视频、摄像头、图片）、模型（YOLO、HRNet、PoseNet 等）、后处理（跟踪、计数、ROI 过滤）、输出（屏幕、文件、消息队列）。

应用场景：智能监控、人流分析、零售客户行为、运动姿态分析、安全合规检查（戴口罩、戴头盔）。`,
        whatItIsJa: `PeekingDuck の中核となる考え方は「pipeline-as-config」です：

\`\`\`yaml
nodes:
  - input.visual:
      source: webcam
  - model.yolo
  - draw.bbox
  - output.screen
\`\`\`

この設定をスタートさせると、「カメラ入力 → YOLO 検出 → 枠線描画 → 画面表示」という完全なリアルタイム pipeline が起動します。フレームワークには 50 以上のノードが組み込まれており、入力（ビデオ、カメラ、画像）、モデル（YOLO、HRNet、PoseNet など）、後処理（追跡、計数、ROI フィルタリング）、出力（画面、ファイル、メッセージキュー）をカバー。

応用シーン：インテリジェント監視、人流分析、小売顧客行動、運動姿勢分析、セキュリティコンプライアンス確認（マスク着用、ヘルメット着用）。`,
        whatItIsEn: `PeekingDuck's core idea is pipeline-as-config:

\`\`\`yaml
nodes:
  - input.visual:
      source: webcam
  - model.yolo
  - draw.bbox
  - output.screen
\`\`\`

Once launched, that config becomes a complete real-time pipeline: webcam → YOLO detection → bounding boxes → display. The framework ships with 50+ built-in nodes spanning input (video, webcam, images), models (YOLO, HRNet, PoseNet, etc.), post-processing (tracking, counting, ROI filtering), and output (screen, file, message queue).

Use cases: intelligent surveillance, footfall analysis, retail customer behavior, sports pose analysis, safety-compliance checks (masks, hard hats).`,
        aiRelevance: `PeekingDuck 在 CV 工具生态里走了一条独特路径：**不追求 SOTA 模型，追求"生产可用的最简框架"**。

业界已有 OpenCV、Detectron2、MMDetection 等强大的 CV 工具，但它们对小企业、学生、非 ML 专业开发者门槛太高。PeekingDuck 的目标是让"懂 Python 但不懂深度学习"的开发者也能 30 分钟搭出一个生产级 CV 应用。

技术上，它在底层封装 PyTorch、TensorFlow 等框架，对外只暴露简单接口。性能不是顶尖，但部署、调试、维护成本远低于自建 pipeline。`,
        aiRelevanceJa: `PeekingDuck は CV ツールエコシステムの中で独特の道を進んでいます：**最新のモデル（SOTA）を追求するのではなく、「本番運用可能な最もシンプルなフレームワーク」を追求**。

業界には OpenCV、Detectron2、MMDetection など強力な CV ツールが既に存在しますが、小企業、学生、非 ML 専門の開発者にとっては敷居が高すぎます。PeekingDuck の目標は「Python は理解しているが、深層学習は理解していない」開発者でも 30 分で本番レベルの CV アプリケーションを構築できることです。

技術面では、PyTorch、TensorFlow など複数のフレームワークを底層でカプセル化し、シンプルなインターフェースのみを公開しています。パフォーマンスは最先端ではありませんが、デプロイ、デバッグ、メンテナンスコストは自社パイプラインを構築する場合に比べてはるかに低くなります。`,
        aiRelevanceEn: `PeekingDuck takes an unusual path in the CV-tooling ecosystem: **not chasing SOTA models, but building "the simplest framework you can actually run in production."**

The industry already has powerful CV tools like OpenCV, Detectron2, and MMDetection, but they are too high-friction for small businesses, students, and non-ML developers. PeekingDuck aims to let a developer who "knows Python but not deep learning" stand up a production-grade CV application in 30 minutes.

Under the hood it wraps PyTorch, TensorFlow, and other frameworks behind a simple interface. Performance is not best-in-class, but the deployment, debugging, and maintenance overhead is far lower than rolling your own pipeline.`,
        singaporeRelevance: `PeekingDuck 是 AISG"开源工具策略"的另一个产物——**和 TagUI 一样，定位是降低 AI 落地门槛**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：让本地中小企业能用上 CV 技术
- **杠杆 6（外交）**：开源项目作为新加坡 AI 输出的载体

观点：PeekingDuck 不是 AISG 最有名的项目，但它体现了 AISG 的工程哲学：**做"够用"的工具而不是 SOTA 工具**。这种务实路线在新加坡这种小市场里是合理的——不和 OpenCV、Meta 比规模，但在易用性上有差异化。`,
        singaporeRelevanceJa: `PeekingDuck は AISG の「オープンソースツール戦略」の別の産物です。**TagUI と同じく、AI 実装の敷居を下げることが位置付けです。**

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：ローカルの中小企業が CV 技術を活用できるようにする
- **レバー 6（外交）**：シンガポール AI 输出の担い手としてのオープンソースプロジェクト

観点：PeekingDuck は AISG で最も有名なプロジェクトではありませんが、AISG のエンジニアリング哲学を体現しています：**最新最高のツールではなく、「十分に優れた」ツールを作る**。このプラグマティックなアプローチは、シンガポールのような小さな市場では合理的です。OpenCV や Meta と規模を競わず、使いやすさで差別化します。`,
        singaporeRelevanceEn: `PeekingDuck is another product of AISG's "open-source tooling strategy" — **like TagUI, it's positioned to lower the barrier to AI deployment.**

Across the seven transmission levers:

- **Lever 3 (Industry Adoption)**: brings CV technology within reach of local SMEs
- **Lever 6 (Diplomacy)**: an open-source project serving as a vehicle for Singaporean AI exports

Take: PeekingDuck isn't AISG's most famous project, but it embodies AISG's engineering philosophy: **build "good enough" tools rather than SOTA tools.** That pragmatic line is reasonable for a small market like Singapore — don't try to out-scale OpenCV or Meta, but differentiate on ease of use.`,
        milestones: [
          {
            date: '2021',
            title: 'PeekingDuck 开源发布',
            titleJa: 'PeekingDuck のオープンソース公開',
            titleEn: 'PeekingDuck open-sourced',
          },
        ],
        relatedLeverNumbers: [3, 6],
        relatedEntityIds: ['ai-singapore'],
        sources: [
          {
            label: 'PeekingDuck GitHub',
            labelEn: 'PeekingDuck on GitHub',
            url: 'https://github.com/aisingapore/PeekingDuck',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'sgnlp',
        name: 'SGNLP',
        nameEn: 'SGNLP',
        description: '新加坡 NLP 模型与工具包',
        descriptionJa: 'シンガポール NLP モデルとツールキット',
        descriptionEn: 'Singapore-focused NLP models and toolkit',
        url: 'https://github.com/aisingapore/sgnlp',
        entityType: 'product',
        status: 'active',
        founded: '2021',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'SGNLP 是 AISG 维护的"新加坡本地 NLP 工具包"，包含针对新加坡英语（Singlish）、本地命名实体、多语言代码切换等场景的预训练模型和工具。它在 SEA-LION 出现前是 AISG 在 NLP 领域的旗舰产品。',
        summaryJa:
          'SGNLP は AISG が維持管理する「シンガポール現地 NLP ツールキット」で、シンガポール英語（Singlish）、現地命名実体、多言語コード切り替えなどのシナリオに対応した事前学習モデルとツールを含みます。SEA-LION が登場する前は、AISG の NLP 分野でのフラッグシップ製品でした。',
        summaryEn:
          'SGNLP is AISG\'s "Singapore-localized NLP toolkit," bundling pretrained models and utilities for Singapore English (Singlish), local named entities, multilingual code-switching, and similar scenarios. Before SEA-LION arrived, it was AISG\'s flagship product in the NLP space.',
        whatItIs: `SGNLP 包含一系列模型和工具：

- **新加坡英语理解**：Singlish 文本规范化、情感分析
- **多语言代码切换**：识别一段文本中混用了哪些语言（英文 / 中文 / 马来语 / 泰米尔语 mix）
- **本地命名实体**：识别新加坡地名、人名、机构名
- **复述与摘要**：针对新加坡本地新闻/政府文本

随着 SEA-LION 出现，SGNLP 的角色逐渐从"主力产品"变成"专项工具"——通用 NLP 能力让位给 LLM，但 Singlish 等专项场景仍然有独立价值。`,
        whatItIsJa: `SGNLP は一連のモデルとツールを含みます：

- **シンガポール英語理解**：シングリッシュテキストの正規化、感情分析
- **多言語コードスイッチング**：テキスト内で混用されている言語を識別（英語／中国語／マレー語／タミル語ミックス）
- **ローカル固有表現**：シンガポール地名、人名、機関名を識別
- **言い換えと要約**：シンガポール国内のニュース／政府文書向け

SEA-LION の登場に伴い、SGNLP の役割は「主流製品」から「専門ツール」へ徐々に変わってきました。汎用 NLP 機能は LLM に譲り、ただしシングリッシュなどの専門シーンでは引き続き独立した価値を持ちます。`,
        whatItIsEn: `SGNLP packages a family of models and tools:

- **Singapore English understanding**: Singlish text normalization, sentiment analysis
- **Multilingual code-switching**: detecting which languages a passage mixes (English / Chinese / Malay / Tamil mix)
- **Local named entities**: recognizing Singaporean place names, person names, and organization names
- **Paraphrase and summarization**: tuned for local Singaporean news and government text

As SEA-LION emerged, SGNLP's role gradually shifted from "flagship product" to "specialty toolkit" — general NLP capabilities ceded ground to LLMs, but specialty scenarios like Singlish still hold standalone value.`,
        aiRelevance: `SGNLP 解决的核心问题：**通用 NLP 工具在新加坡英语上效果差**。

新加坡英语（Singlish）混用英语、马来语、华语、泰米尔语，加上独特语法（lah、leh、lor 这种语气词），让 spaCy / NLTK / HuggingFace 的开箱模型在 Singlish 文本上表现糟糕。SGNLP 的预训练模型在 Singlish 数据上专门微调过，准确率显著高于通用模型。

与 SEA-LION 的关系：SEA-LION 作为 LLM 部分覆盖了 SGNLP 的能力，但 SGNLP 的轻量化模型（部分 < 100MB）在边缘部署、实时处理场景仍有优势。`,
        aiRelevanceJa: `SGNLP が解決する核心的な問題：**汎用 NLP ツールはシンガポール英語の処理では効果が低い**。

シンガポール英語（シングリッシュ）は英語、マレー語、中国語、タミル語を混用し、独特の文法（lah、leh、lor などの言葉遣い）を持つため、spaCy／NLTK／HuggingFace のデフォルトモデルがシングリッシュテキストに対して著しく低い性能を示します。SGNLP の事前学習モデルはシングリッシュデータで専門的に微調整されており、汎用モデルに比べて著しく高い精度を実現します。

SEA-LION との関係：SEA-LION は LLM 部分の役割の一部をカバーしていますが、SGNLP の軽量化モデル（一部は 100MB 未満）はエッジデバイスでの展開やリアルタイム処理シーンでは依然として優位性を持ちます。`,
        aiRelevanceEn: `The core problem SGNLP solves: **off-the-shelf NLP tools perform poorly on Singapore English.**

Singlish blends English, Malay, Mandarin, and Tamil and adds distinctive grammar (particles like *lah*, *leh*, *lor*), which leaves out-of-the-box models from spaCy / NLTK / HuggingFace performing badly on Singlish text. SGNLP's pretrained models are fine-tuned on Singlish data and significantly more accurate than generic models.

Relationship with SEA-LION: as an LLM, SEA-LION covers part of SGNLP's surface area, but SGNLP's lightweight models (some under 100 MB) retain an edge in edge deployment and real-time processing scenarios.`,
        singaporeRelevance: `SGNLP 是新加坡"语言主权"叙事的早期实践——**在 LLM 时代之前，AISG 已经在做"为新加坡量身定制的语言 AI"**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：本地客服、社交媒体分析、政府文本处理
- **杠杆 1（基础研究）**：Singlish 是少数有学术研究价值的"克里奥尔英语"

观点：SGNLP 的存在让 SEA-LION 有了"思想先驱"——同样的"为本地语言做专项 AI"哲学，从 NLP 工具升级到 LLM。`,
        singaporeRelevanceJa: `SGNLP はシンガポール「言語主権」ナラティブの初期の実践です。**LLM 時代の前から、AISG は「シンガポール向けにカスタマイズされた言語 AI」を開発していました**。

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：ローカルカスタマーサービス、ソーシャルメディア分析、政府文書処理
- **レバー 1（基礎研究）**：シングリッシュは学術的研究価値を持つ数少ない「クレオール英語」の一つ

観点：SGNLP の存在により、SEA-LION に「思想的先駆者」が生まれました。同じく「ローカル言語に専門 AI を提供する」という哲学が、NLP ツールから LLM へアップグレードされています。`,
        singaporeRelevanceEn: `SGNLP is an early practical expression of Singapore's "language sovereignty" narrative — **even before the LLM era, AISG was already building "language AI tailored for Singapore."**

Across the seven transmission levers:

- **Lever 3 (Industry Adoption)**: local customer service, social media analysis, government text processing
- **Lever 1 (Foundational Research)**: Singlish is one of the few "creole Englishes" with genuine academic research value

Take: SGNLP gave SEA-LION a "philosophical predecessor" — the same "build specialty AI for local languages" ethos, simply upgraded from NLP tooling to an LLM.`,
        milestones: [
          {
            date: '2021',
            title: 'SGNLP 开源发布',
            titleJa: 'SGNLP のオープンソース公開',
            titleEn: 'SGNLP open-sourced',
          },
        ],
        relatedLeverNumbers: [1, 3],
        relatedEntityIds: ['ai-singapore', 'sea-lion'],
        sources: [
          {
            label: 'SGNLP GitHub',
            labelEn: 'SGNLP on GitHub',
            url: 'https://github.com/aisingapore/sgnlp',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'speech-lab',
        name: 'Speech Lab',
        nameEn: 'Speech Lab',
        description: '语音识别与合成技术',
        descriptionJa: '音声認識と合成技術',
        descriptionEn: 'Speech recognition and synthesis technologies',
        entityType: 'platform',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'AISG Speech Lab 专注于新加坡及东南亚语境的语音 AI——重点解决 Singlish 识别、多语言混用语音（英文+华语+马来语切换）、本地口音等通用语音 AI 模型表现差的场景。',
        summaryJa:
          'AISG Speech Lab はシンガポール及び東南アジアの文脈における音声 AI に注力しています――Singlish 認識、多言語混用音声（英語+標準中国語+マレー語切り替え）、現地アクセントなど、汎用音声 AI モデルのパフォーマンスが低い場面を重点的に解決しています。',
        summaryEn:
          'AISG Speech Lab focuses on speech AI for Singapore and Southeast Asia — concentrating on the scenarios where general-purpose speech models fall short: Singlish recognition, multilingual mixed speech (English + Mandarin + Malay code-switching), and local accents.',
        whatItIs: `Speech Lab 的研究方向：

- **Singlish ASR**：新加坡英语自动识别
- **Code-switching ASR**：识别一段话中混用多种语言
- **本地口音 TTS**：合成本地化的语音
- **方言保护**：客家、潮州等方言的语音 AI

代表项目：与本地客服中心、政府服务热线合作，部署本地化语音 AI。`,
        whatItIsJa: `Speech Lab の研究方向：

- **Singlish ASR**：シンガポール英語自動音声認識
- **Code-switching ASR**：一文中での複数言語混用の認識
- **本地アクセント TTS**：ローカル化された音声合成
- **方言保護**：客家、潮州などの方言の音声 AI

代表的なプロジェクト：現地カスタマーサービスセンター、政府ホットラインとの協力で、ローカル化された音声 AI をデプロイ。`,
        whatItIsEn: `Speech Lab's research directions:

- **Singlish ASR**: automatic speech recognition for Singapore English
- **Code-switching ASR**: recognizing speech that mixes multiple languages
- **Local-accent TTS**: synthesizing localized voices
- **Dialect preservation**: speech AI for dialects such as Hakka and Teochew

Representative work: partnering with local contact centres and government service hotlines to deploy localized speech AI.`,
        aiRelevance: `Speech Lab 解决的问题与 SGNLP 类似：**通用语音 AI 在新加坡语境失效**。

商业 ASR（OpenAI Whisper、Google Speech-to-Text 等）对 Singlish 和 code-switching 的识别率显著下降。Speech Lab 的本地化模型能填补这个缺口。`,
        aiRelevanceJa: `Speech Lab が解決する問題は SGNLP と類似しています：**汎用音声 AI はシンガポール の文脈で機能しない**。

市販の ASR（OpenAI Whisper、Google Speech-to-Text など）はシングリッシュとコードスイッチングの認識率が著しく低下します。Speech Lab のローカライズモデルはこのギャップを埋めることができます。`,
        aiRelevanceEn: `Speech Lab tackles the same kind of problem SGNLP does: **general-purpose speech AI breaks down in the Singapore context.**

Commercial ASR (OpenAI Whisper, Google Speech-to-Text, etc.) sees noticeable drops in recognition accuracy on Singlish and code-switching. Speech Lab's localized models fill this gap.`,
        singaporeRelevance: `Speech Lab 是新加坡"语言主权"叙事的语音版本。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：本地客服、政府服务的语音 AI 落地
- **杠杆 5（政府自用）**：政府部门多语言服务的语音化

观点：语音 AI 是新加坡 AI 落地最直接的场景——客服、政务、医疗都需要。Speech Lab 的存在让这些场景能用上"懂新加坡话"的 AI。`,
        singaporeRelevanceJa: `Speech Lab はシンガポール「言語主権」ナラティブの音声版です。

「7つの伝導レバー」の中で：

- **レバー 3（産業応用）**：ローカルカスタマーサービス、政府サービスの音声 AI 実装
- **レバー 5（政府自用）**：政府部門の多言語サービスの音声化

観点：音声 AI はシンガポール AI 実装で最も直接的なシーンです。カスタマーサービス、政務、医療すべてに必要とされます。Speech Lab の存在により、これらシーンで「シンガポール言語を理解する」AI を活用できます。`,
        singaporeRelevanceEn: `Speech Lab is the speech-AI counterpart to Singapore's "language sovereignty" narrative.

Across the seven transmission levers:

- **Lever 3 (Industry Adoption)**: rolling out speech AI in local customer service and government services
- **Lever 5 (Government Self-Use)**: voice-enabling multilingual government service delivery

Take: speech AI is one of the most direct landing points for Singapore AI — customer service, public services, and healthcare all need it. Speech Lab's existence means these scenarios get AI that "understands how Singaporeans actually speak."`,
        milestones: [],
        relatedLeverNumbers: [3, 5],
        relatedEntityIds: ['ai-singapore', 'sgnlp', 'sea-lion'],
        sources: [
          { label: 'AISG Speech', labelEn: 'AISG Speech', url: 'https://aisingapore.org/aiproducts/speech-lab/' },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'synergos',
        name: 'Synergos',
        nameEn: 'Synergos',
        description: '联邦学习框架',
        descriptionJa: 'フェデレーテッドラーニングフレームワーク',
        descriptionEn: 'Federated learning framework',
        url: 'https://github.com/aisingapore/synergos',
        entityType: 'product',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'Synergos 是 AISG 开源的联邦学习（Federated Learning）框架，让多个组织在不共享原始数据的前提下联合训练 ML 模型。它是 AISG"隐私保护 AI"工具链的关键组件，配合 PDPA 合规需求。',
        summaryJa:
          'Synergos は AISG がオープンソース化した連合学習（Federated Learning）フレームワークで、複数の組織が元データを共有しない前提で ML モデルを共同で学習できるようにしています。これは AISG の「プライバシー保護 AI」ツールチェーンの重要な構成要素で、PDPA コンプライアンス要件に対応しています。',
        summaryEn:
          'Synergos is AISG\'s open-source Federated Learning framework, enabling multiple organizations to jointly train ML models without sharing raw data. It is a core component of AISG\'s "privacy-preserving AI" toolchain, designed to align with PDPA compliance needs.',
        whatItIs: `Synergos 提供：

- **横向联邦学习**：多个组织有相同特征但不同样本（如多家银行用相同模型字段）
- **纵向联邦学习**：多个组织有相同样本但不同特征（如银行 + 电信合作）
- **加密通信**：训练过程中的梯度等中间结果加密传输
- **可视化界面**：支持非技术用户配置联邦学习实验

应用场景：金融业反欺诈联合建模、医疗多医院联合科研、跨企业数据合作。`,
        whatItIsJa: `Synergos が提供するもの：

- **横向フェデレーテッドラーニング**：複数のオーガナイゼーションが同じ特性を持つが異なるサンプルを持っている（例えば複数の銀行が同じモデルフィールドを使用）
- **縦向フェデレーテッドラーニング**：複数のオーガナイゼーションが同じサンプルを持つが異なる特性を持っている（例えば銀行 + 電信事業者の協力）
- **暗号化通信**：トレーニングプロセス中の勾配などの中間結果の暗号化伝送
- **ビジュアライゼーションインターフェース**：非技術ユーザーがフェデレーテッドラーニング実験を構成することをサポート

応用シナリオ：金融業界の不正検出共同モデリング、医療の複数病院共同研究、クロスエンタープライズデータ協力。`,
        whatItIsEn: `Synergos provides:

- **Horizontal federated learning**: multiple organizations with the same features but different samples (e.g., several banks sharing the same model schema)
- **Vertical federated learning**: multiple organizations with the same samples but different features (e.g., a bank partnering with a telco)
- **Encrypted communication**: gradients and other intermediate results are transmitted under encryption during training
- **Visual interface**: lets non-technical users configure federated-learning experiments

Use cases: joint anti-fraud modeling in finance, multi-hospital medical research collaboration, cross-enterprise data partnerships.`,
        aiRelevance: `Synergos 在隐私保护 AI 领域是新加坡的旗舰开源工具。**联邦学习不是新概念，但成熟可用的开源框架不多**——Google 的 TFF、FATE 等各有局限。Synergos 在易用性和隐私保护强度上做了平衡。

但联邦学习商业化在全球都困难——理论上很美，实际部署遇到大量工程和组织协调问题。Synergos 的实际产业落地数据有限。`,
        aiRelevanceJa: `Synergos はプライバシー保護 AI 領域でシンガポールのフラッグシップオープンソースツールです。**フェデレーテッドラーニングは新しい概念ではありませんが、成熟して利用可能なオープンソースフレームワークは多くありません**——Google の TFF、FATE などは各々制限があります。Synergos は使いやすさとプライバシー保護の強度でバランスを取りました。

しかし、フェデレーテッドラーニングの商業化は世界的に困難です——理論的には美しいですが、実際の展開では大量のエンジニアリングと組織協調の問題に直面します。Synergos の実際の産業落地データは限定的です。`,
        aiRelevanceEn: `In privacy-preserving AI, Synergos is Singapore's flagship open-source tool. **Federated learning isn't a new concept, but mature, usable open-source frameworks are scarce** — Google's TFF, FATE, and others all have their limitations. Synergos strikes a balance between ease of use and privacy guarantees.

That said, commercializing federated learning is hard everywhere in the world — beautiful in theory, but real deployments hit a wall of engineering and organizational coordination problems. Synergos has limited verified industrial-deployment data to date.`,
        singaporeRelevance: `Synergos 是 PDPA 时代 AI 数据合规的重要工具——**让数据不出本地的前提下还能联合做 AI**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：跨组织数据合作的隐私基础设施
- **杠杆 4（治理）**：和 PDPC 数据保护要求兼容

观点：Synergos 是 AISG 的"前沿尝试"——技术上扎实，商业落地慢热，但代表了"隐私保护 + AI"这个全球大方向。`,
        singaporeRelevanceJa: `Synergos は PDPA 時代の AI データコンプライアンスの重要なツールです——**データがローカルから出ない前提の下で、依然として共同で AI を実施することができます**。

「７つの伝導レバー」の中で：

- **レバー 3（産業応用）**：クロスオーガナイゼーションデータ協力のプライバシー基盤施設
- **レバー 4（ガバナンス）**：PDPC データ保護要件と互換性がある

観点：Synergos は AISG の 「前沿的な試み」——技術的には堅実で、商業化は緩やかな進展ですが、「プライバシー保護 + AI」というこのグローバルな大方向を代表しています。`,
        singaporeRelevanceEn: `Synergos is an important tool for AI data compliance in the PDPA era — **enabling joint AI work while keeping data within local jurisdictions.**

Across the seven transmission levers:

- **Lever 3 (Industry Adoption)**: privacy infrastructure for cross-organization data collaboration
- **Lever 4 (Governance)**: aligned with PDPC data protection requirements

Take: Synergos is one of AISG's "frontier bets" — solid technically, slow to land commercially, but representing the global "privacy-preserving + AI" direction.`,
        milestones: [],
        relatedLeverNumbers: [3, 4],
        relatedEntityIds: ['ai-singapore', 'pdpc'],
        sources: [
          { label: 'Synergos GitHub', labelEn: 'Synergos on GitHub', url: 'https://github.com/aisingapore/synergos' },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '人才培养',
    nameJa: '人材育成',
    nameEn: 'Talent Development',
    icon: '🎓',
    description: '全方位 AI 人才发展生态',
    descriptionJa: '包括的な AI 人材開発エコシステム',
    descriptionEn: 'A full pipeline for AI talent development',
    entities: [
      {
        id: 'learnai',
        name: 'LearnAI',
        nameEn: 'LearnAI',
        description: '在线 AI 学习平台，SkillsFuture 可报销',
        descriptionJa: 'オンライン AI 学習プラットフォーム、SkillsFuture で払い戻し可能',
        descriptionEn: 'Online AI learning platform, eligible for SkillsFuture reimbursement',
        url: 'https://learn.aisingapore.org/',
        entityType: 'platform',
        status: 'active',
        founded: '2018',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '注册学员 5 万+；30+ 课程；SkillsFuture Credit 可全额抵扣',
        scaleJa: '登録学習者 5 万+；30+ コース；SkillsFuture Credit で全額補助可能',
        scaleEn: '50,000+ registered learners; 30+ courses; eligible for full SkillsFuture Credit redemption',
        summary:
          'LearnAI 是 AISG 的在线 AI 学习平台，提供从入门到进阶的 AI / ML 课程。它的特殊价值：**所有课程都可以用 SkillsFuture Credit 报销**——这是新加坡公民每人 SGD 500+ 的国家培训补贴。这个机制让 LearnAI 成为新加坡在职人员"AI 再培训"的首选平台。',
        summaryJa:
          'LearnAI は AISG のオンライン AI 学習プラットフォームで、初心者から上級者向けの AI / ML コースを提供しています。その特別な価値：**すべてのコースは SkillsFuture Credit で払い戻し可能です**――これはシンガポール市民 1 人あたり SGD 500+ の国家研修補助金です。このメカニズムにより、LearnAI はシンガポールの在職人員の「AI 再研修」の最優先プラットフォームになります。',
        summaryEn:
          'LearnAI is AISG\'s online AI learning platform, offering AI / ML courses from beginner to advanced. Its distinctive value: **every course can be paid for with SkillsFuture Credit** — Singapore\'s national training subsidy of SGD 500+ per citizen. This mechanism has made LearnAI the go-to platform for "AI reskilling" among working Singaporeans.',
        whatItIs: `LearnAI 的课程体系：

- **AI for Industry（AI4I）**：面向非技术背景的 AI 通识课
- **Data Science 入门**：Python、统计、ML 基础
- **应用 AI**：CV、NLP、时间序列等专题
- **Generative AI**：LLM、Prompt Engineering、RAG 实战

授课形式：

- 视频 + 在线作业 + 项目
- 完成度证书（SkillsFuture 认可）
- 部分课程有线下 workshop

合作伙伴包括 AWS、Microsoft、IBM、本地高校等。`,
        whatItIsJa: `LearnAI のカリキュラムシステム：

- **AI for Industry（AI4I）**：非技術的背景を持つ人向けの AI 通識課程
- **Data Science 入門**：Python、統計、ML 基礎
- **応用 AI**：CV、NLP、時系列などの特別テーマ
- **Generative AI**：LLM、Prompt Engineering、RAG 実践

授業形式：

- ビデオ + オンライン課題 + プロジェクト
- 修了証明書（SkillsFuture 認可）
- 一部の課程はオフライン workshop を実施

パートナーには AWS、Microsoft、IBM、現地大学などが含まれます。`,
        whatItIsEn: `LearnAI's course catalog:

- **AI for Industry (AI4I)**: AI literacy courses for non-technical backgrounds
- **Intro to Data Science**: Python, statistics, ML fundamentals
- **Applied AI**: focused tracks in CV, NLP, time series, etc.
- **Generative AI**: LLMs, prompt engineering, hands-on RAG

Delivery format:

- Video + online assignments + projects
- Completion certificates (recognized by SkillsFuture)
- Some courses include in-person workshops

Partners include AWS, Microsoft, IBM, and local universities.`,
        aiRelevance: `LearnAI 的关键创新是**SkillsFuture 集成**——把"国家补贴 + AI 培训"打通。

新加坡的 SkillsFuture 制度让每个公民有终身培训补贴，但实际使用率一直是问题——大多数人不知道用什么。LearnAI 解决了"用什么"的问题，把 AISG 的内容变成 SkillsFuture 可消费的产品。

技术上 LearnAI 不算前沿，但它的运营效率高：内容更新快，SkillsFuture 集成顺畅，作业和项目质量过得去。`,
        aiRelevanceJa: `LearnAI のキーイノベーションは **SkillsFuture 統合** です——「国家補助 + AI トレーニング」を通す。

シンガポールの SkillsFuture 制度により、すべての市民が生涯学習補助金を持っていますが、実際の利用率は常に問題でした——ほとんどの人は何を使うべきかを知りません。LearnAI は 「何を使うか」という問題を解決し、AISG のコンテンツを SkillsFuture で消費可能な製品に変えました。

技術的には LearnAI は先端ではありませんが、その運営効率は高いです：コンテンツ更新が速い、SkillsFuture 統合がスムーズ、課題とプロジェクトの品質は受け入れ可能です。`,
        aiRelevanceEn: `LearnAI's key innovation is its **SkillsFuture integration** — wiring together "national subsidy + AI training."

Singapore's SkillsFuture scheme gives every citizen a lifelong training credit, but actual utilization has long been a problem — most people don't know what to spend it on. LearnAI solves the "what to spend it on" problem by turning AISG's content into a SkillsFuture-consumable product.

Technically LearnAI isn't frontier, but it operates well: content updates are quick, SkillsFuture integration is smooth, and assignments and projects are of decent quality.`,
        singaporeRelevance: `LearnAI 是新加坡 AI 战略**"杠杆 2（人才）"的全民版本**——AIAP 培养 AI 工程师（精英路线），LearnAI 培养"AI literate"的普通在职人员（普及路线）。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：扩大 AI 知识普及面

观点：LearnAI 不培养顶尖人才，但它做了一件更难的事：**让普通新加坡上班族有"AI 基础认知"**。这种基础认知是新加坡 AI 落地的"民意基础"——员工不抗拒 AI，企业 AI 转型阻力小。

这种"人才战略普及版"通常被低估，但它的国家级影响是真实的。`,
        singaporeRelevanceJa: `LearnAI はシンガポール AI 戦略の 「レバー 2（人材）」の全民版です——AIAP は AI エンジニア（エリート経路）を育成し、LearnAI は 「AI リテラシー」を持つ普通の就業者（普及経路）を育成します。

「７つの伝導レバー」の中で：

- **レバー 2（人材）**：AI 知識普及面を拡大する

観点：LearnAI はトップレベルの人材を育成しませんが、それはより難しいことをしました：**普通のシンガポールのオフィスワーカーに 「AI 基礎的認知」を持たせる**。この基礎的認知はシンガポール AI 実装の 「民意基盤」です——従業員は AI に抵抗しない、企業の AI 変革の阻力は小さい。

この 「人材戦略普及版」は通常、過小評価されていますが、その国家レベルの影響は本当です。`,
        singaporeRelevanceEn: `LearnAI is the **mass-market version of Singapore's AI strategy "Lever 2 (Talent)"** — AIAP trains AI engineers (the elite track), LearnAI trains "AI literate" working professionals (the broad track).

Across the seven transmission levers:

- **Lever 2 (Talent)**: expands AI literacy across the workforce

Take: LearnAI doesn't produce top-tier talent, but it does something harder: **giving ordinary working Singaporeans a baseline understanding of AI.** That baseline is the "social license" for AI deployment in Singapore — employees don't push back, and corporate AI transformations face less resistance.

This kind of "talent strategy in popularized form" is typically underrated, but its national-level impact is real.`,
        milestones: [
          {
            date: '2018',
            title: 'LearnAI 平台上线',
            titleJa: 'LearnAI プラットフォームのローンチ',
            titleEn: 'LearnAI platform launched',
          },
          {
            date: '2020',
            title: '与 SkillsFuture 集成',
            titleJa: 'SkillsFuture との統合',
            titleEn: 'Integrated with SkillsFuture',
          },
          {
            date: '2024',
            title: '注册学员突破 5 万',
            titleJa: '登録学習者が 5 万を突破',
            titleEn: 'Registered learners exceed 50,000',
          },
        ],
        relatedLeverNumbers: [2],
        relatedEntityIds: ['ai-singapore', 'aiap'],
        sources: [
          {
            label: 'LearnAI 官网',
            labelJa: 'LearnAI 公式サイト',
            labelEn: 'LearnAI official site',
            url: 'https://learn.aisingapore.org/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'ai4i',
        name: 'AI4I',
        nameEn: 'AI4I',
        description: 'AI for Industry 课程系列',
        descriptionJa: 'AI for Industry コースシリーズ',
        descriptionEn: 'AI for Industry course series',
        entityType: 'program',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'AI4I（AI for Industry）是 LearnAI 平台上的旗舰课程系列，目标是让"非 AI 专业的在职人员"获得"够用"的 AI 工程能力。它配合 SkillsFuture，是 AISG 在职人员培训的主力产品线。',
        summaryJa:
          'AI4I（AI for Industry）は LearnAI プラットフォーム上のフラッグシップコースシリーズで、目標は「AI 非専門の在職人員」が「十分な」AI エンジニアリング能力を習得することです。これは SkillsFuture と連携し、AISG 在職人員研修の主力製品ラインです。',
        summaryEn:
          'AI4I (AI for Industry) is the flagship course series on the LearnAI platform, designed to give "working professionals from non-AI backgrounds" enough AI engineering ability to get the job done. Paired with SkillsFuture, it is the workhorse of AISG\'s working-adult training product line.',
        whatItIs: `AI4I 课程层级：

- **AI for Industry Foundations**：通识入门，2-4 周
- **AI for Industry Practitioner**：动手项目，3-6 个月
- **AI for Industry Specialist**：进阶专项（如 NLP、CV），6-12 个月

特点：

- 和 LearnAI 平台深度集成
- 100% SkillsFuture Credit 报销
- 完成后有 AISG 颁发的证书
- 部分进阶课程是 AIAP 的预备课`,
        whatItIsJa: `AI4I カリキュラムレベル：

- **AI for Industry Foundations**：通識入門、2～4 週
- **AI for Industry Practitioner**：実践プロジェクト、3～6 ヶ月
- **AI for Industry Specialist**：進階特別プロジェクト（NLP、CV など）、6～12 ヶ月

特徴：

- LearnAI プラットフォームとの深度統合
- 100% SkillsFuture Credit 払い戻し
- 完了後に AISG が発行する証明書
- 一部の進階課程は AIAP の準備課程`,
        whatItIsEn: `AI4I course tiers:

- **AI for Industry Foundations**: literacy intro, 2-4 weeks
- **AI for Industry Practitioner**: hands-on projects, 3-6 months
- **AI for Industry Specialist**: advanced specializations (e.g., NLP, CV), 6-12 months

Features:

- Deeply integrated with the LearnAI platform
- 100% reimbursable via SkillsFuture Credit
- AISG-issued certificate upon completion
- Some advanced courses serve as preparation for AIAP`,
        aiRelevance: `AI4I 是 LearnAI 的"内容旗舰"——LearnAI 是平台，AI4I 是平台上最重要的课程线。它把"AI literacy"做成可消费的标准化产品。`,
        aiRelevanceJa: `AI4I は LearnAI の 「コンテンツフラッグシップ」です——LearnAI はプラットフォーム、AI4I はプラットフォーム上で最も重要なカリキュラムラインです。それは 「AI リテラシー」を消費可能な標準化製品に変えました。`,
        aiRelevanceEn: `AI4I is LearnAI's "content flagship" — LearnAI is the platform, AI4I is its most important course line. It turns "AI literacy" into a standardized, consumable product.`,
        singaporeRelevance: `AI4I 是新加坡 AI 普及战略的"标准化课程"。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：批量培养 AI literate 在职人员

观点：AI4I 不培养 AI 工程师（那是 AIAP 做的），而是让"非 AI 工程师"也能"懂 AI"。这种通识普及对企业 AI 转型的意义巨大——AI 项目失败往往不是技术问题，而是业务方不懂 AI 能做什么。`,
        singaporeRelevanceJa: `AI4I はシンガポール AI 普及戦略の 「標準化カリキュラム」です。

「７つの伝導レバー」の中で：

- **レバー 2（人材）**：AI リテラシーを持つ就業者を大量に育成する

観点：AI4I は AI エンジニア（それは AIAP がする）を育成しませんが、「非 AI エンジニア」も 「AI を理解する」ことができます。この種の通識普及は企業の AI 変革に対して膨大な意義があります——AI プロジェクトの失敗はしばしば技術問題ではなく、ビジネス側が AI ができることを理解していないのです。`,
        singaporeRelevanceEn: `AI4I is the "standardized curriculum" of Singapore's AI literacy strategy.

Across the seven transmission levers:

- **Lever 2 (Talent)**: training AI-literate professionals at scale

Take: AI4I doesn't produce AI engineers (that's AIAP's job) — it lets "non-AI engineers" still "understand AI." That kind of literacy is enormously consequential for corporate AI transformation: AI projects often fail not because of technical issues, but because the business side doesn't understand what AI can actually do.`,
        milestones: [],
        relatedLeverNumbers: [2],
        relatedEntityIds: ['ai-singapore', 'learnai', 'aiap'],
        sources: [
          {
            label: 'AI4I 课程',
            labelJa: 'AI4I カリキュラム',
            labelEn: 'AI4I courses',
            url: 'https://learn.aisingapore.org/',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'naisc',
        name: 'NAISC',
        nameEn: 'NAISC',
        description: '全国 AI 学生挑战赛，2000+ 参与者',
        descriptionJa: '全国 AI 学生チャレンジレース、2000+ 参加者',
        descriptionEn: 'National AI Student Challenge; 2,000+ participants',
        url: 'https://aisingapore.org/talent/national-ai-student-challenge/',
        entityType: 'program',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '每年 2000+ 学生参与；覆盖中学、初院、理工学院、大学四个学段',
        scaleJa: '毎年 2000+ 学生が参加；中学、初級カレッジ、理工系大学、大学の 4 つのレベルをカバー',
        scaleEn: '2,000+ students per year; covers secondary schools, JCs, polytechnics, and universities',
        summary:
          'NAISC（National AI Student Challenge）是 AISG 的全国学生 AI 竞赛，覆盖从中学到大学四个学段。它是新加坡 AI 早期人才发现的"漏斗顶端"——通过竞赛把对 AI 感兴趣的学生识别、培养、引导进 AI 路径。',
        summaryJa:
          'NAISC（National AI Student Challenge）は AISG の全国学生 AI 競技で、中学から大学の 4 つのレベルをカバーしています。これはシンガポール AI 初期段階の人材発見の「ファネルの上部」です――競技を通じて AI に関心のある学生を識別、育成、AI パスへと導きます。',
        summaryEn:
          'NAISC (National AI Student Challenge) is AISG\'s nationwide student AI competition, spanning four educational levels from secondary school through university. It serves as the "top of the funnel" for early AI talent discovery in Singapore — using competition to identify, develop, and channel AI-interested students into the AI pipeline.',
        whatItIs: `NAISC 的设计：

- **分学段**：中学、初院（JC）、理工学院（Poly）、大学
- **多赛道**：算法竞赛、应用项目、创意挑战
- **持续培育**：优胜者获得 AISG 进一步培训机会
- **AISG 教师指导**：参赛过程中有专业指导

参赛人数年度突破 2000，是新加坡规模最大的学生 AI 活动。`,
        whatItIsJa: `NAISC のデザイン：

- **学年別分類**：中学、初院（JC）、理工学院（Poly）、大学
- **マルチトラック**：アルゴリズム競争、応用プロジェクト、クリエイティブチャレンジ
- **継続的な育成**：受賞者は AISG のさらなる訓練機会を取得
- **AISG 教師指導**：競争プロセス中にプロフェッショナルな指導があります

年間参加者数は 2000 人を突破し、シンガポール最大規模の学生 AI 活動です。`,
        whatItIsEn: `NAISC's design:

- **Tiered by level**: secondary schools, junior colleges (JC), polytechnics (Poly), and universities
- **Multiple tracks**: algorithm competitions, applied projects, creative challenges
- **Continuous nurturing**: winners get further AISG training opportunities
- **AISG educator mentorship**: professional guidance throughout the competition

With 2,000+ annual participants, it is Singapore's largest student-facing AI event.`,
        aiRelevance: `NAISC 解决"AI 人才早期发现"——**让中学生就开始接触 AI**。

新加坡 AI 人才战略的长期问题是"人才漏斗顶端太窄"：等到大学计算机系才接触 AI 太晚。NAISC 把 AI 启蒙下沉到中学/初院，让兴趣种子早发芽。`,
        aiRelevanceJa: `NAISC は 「AI 人材の早期発見」を解決します——**中学生が AI に触れ始めることができます**。

シンガポール AI 人材戦略の長期的な問題は 「人材ファネルの上部が狭い」ことです：大学のコンピュータサイエンス学科で AI に接するまで待つのは遅すぎます。NAISC は AI 啓発を中学/初院に沈下させ、興味の種が早期に発芽するようにしました。`,
        aiRelevanceEn: `NAISC tackles "early AI talent discovery" — **getting secondary-school students into AI early.**

A long-running issue with Singapore's AI talent strategy is that "the top of the funnel is too narrow": waiting until university CS departments to introduce AI is too late. NAISC pushes AI literacy down to secondary schools and JCs so the seeds of interest sprout early.`,
        singaporeRelevance: `NAISC 是新加坡 AI 战略**最长线**的人才布局——今天的中学生是 2030 年代的 AI 工程师。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：早期人才识别和培育

观点：NAISC 的回报周期长达 5-10 年，但它是新加坡能否在 2030 年代仍有充沛 AI 人才的关键变量。`,
        singaporeRelevanceJa: `NAISC はシンガポール AI 戦略の **最長線** の人材配置です——今日の中学生は 2030 年代の AI エンジニアです。

「７つの伝導レバー」の中で：

- **レバー 2（人材）**：早期人材識別と育成

観点：NAISC の回報周期は 5～10 年に達していますが、それはシンガポールが 2030 年代に依然として十分な AI 人材を持つことができるかどうかの重要な変数です。`,
        singaporeRelevanceEn: `NAISC is the **longest-horizon** talent bet in Singapore's AI strategy — today's secondary-school students are the AI engineers of the 2030s.

Across the seven transmission levers:

- **Lever 2 (Talent)**: early talent identification and cultivation

Take: NAISC's payback cycle stretches 5-10 years, but it is the key variable for whether Singapore still has abundant AI talent in the 2030s.`,
        milestones: [],
        relatedLeverNumbers: [2],
        relatedEntityIds: ['ai-singapore', 'aiap', 'phd-fellowship'],
        sources: [
          {
            label: 'NAISC 官网',
            labelJa: 'NAISC 公式サイト',
            labelEn: 'NAISC official site',
            url: 'https://aisingapore.org/talent/national-ai-student-challenge/',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'phd-fellowship',
        name: 'PhD Fellowship',
        nameEn: 'PhD Fellowship',
        description: '最长 4 年博士奖学金，SGD 6,700/月',
        descriptionJa: '最長 4 年間の博士号奨学金、SGD 6,700/月',
        descriptionEn: 'Up to 4-year doctoral fellowship at SGD 6,700/month',
        entityType: 'program',
        status: 'active',
        founded: '2018',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        scale: '4 年最长资助；月津贴 SGD 6,700；累计资助 100+ 博士生',
        scaleJa: '4 年間の最長資金援助；月間給付 SGD 6,700；累積 100+ 博士課程学生への資金援助',
        scaleEn: 'Up to 4 years; SGD 6,700/month stipend; 100+ doctoral students funded to date',
        summary:
          'AISG PhD Fellowship 是新加坡 AI 博士生的旗舰资助项目——**月津贴 SGD 6,700 在亚太博士奖学金里属于顶级水平**，最长资助 4 年。它的目标是吸引顶尖 AI 博士生留在新加坡（而不是去美国 Stanford / MIT）。',
        summaryJa:
          'AISG PhD Fellowship はシンガポール AI 博士課程学生のフラッグシップ資金援助プログラムです――**月間給付 SGD 6,700 はアジア太平洋博士号奨学金の中でもトップレベルです**、最長 4 年間の資金援助。その目標は、トップレベル AI 博士課程学生をシンガポールに留め、米国 Stanford / MIT へ流出するのを防ぐことです。',
        summaryEn:
          "The AISG PhD Fellowship is Singapore's flagship funding programme for AI doctoral students — **its SGD 6,700 monthly stipend ranks among the top tier of PhD fellowships in the Asia-Pacific**, funded for up to 4 years. Its goal is to attract top AI doctoral candidates to stay in Singapore (rather than head to Stanford / MIT in the US).",
        whatItIs: `资助详情：

- **月津贴**：SGD 6,700（4 年总额约 SGD 32 万）
- **学费**：全免
- **研究经费**：可申请额外的会议、计算资源补助
- **挂靠**：博士生导师必须是 NUS / NTU / SMU / SUTD 的 AISG 关联教师

申请要求：

- 在 NUS / NTU / SMU / SUTD 申请到博士项目
- 研究方向与 AISG 战略对齐（LLM、CV、NLP、AI 治理等）
- 学术背景优秀（顶尖本科 + 强推荐信）

竞争激烈，每年录取约 20-30 人。`,
        whatItIsJa: `資金詳細：

- **月額手当**：SGD 6,700（4 年間の総額約 SGD 32 万）
- **授業料**：全免除
- **研究費**：会議、計算リソース補助の追加申請が可能
- **指導教員**：NUS / NTU / SMU / SUTD の AISG 関連教員である必要があります

申請要件：

- NUS / NTU / SMU / SUTD の博士課程に入学
- 研究分野が AISG 戦略と一致（LLM、CV、NLP、AI ガバナンスなど）
- 優秀な学業背景（トップクラスの学部教育 + 強い推薦状）

競争が激しく、毎年約 20～30 名が採択されます。`,
        whatItIsEn: `Funding details:

- **Monthly stipend**: SGD 6,700 (about SGD 320K over 4 years)
- **Tuition**: fully waived
- **Research budget**: additional grants available for conferences and compute resources
- **Affiliation**: PhD supervisors must be AISG-affiliated faculty at NUS / NTU / SMU / SUTD

Application requirements:

- Admitted to a PhD programme at NUS / NTU / SMU / SUTD
- Research direction aligned with AISG strategy (LLMs, CV, NLP, AI governance, etc.)
- Strong academic background (top-tier undergraduate degree + strong references)

Highly competitive, admitting roughly 20-30 students per year.`,
        aiRelevance: `AISG PhD Fellowship 解决的核心问题：**新加坡留不住顶尖 AI 博士生**。

之前情况：新加坡顶尖大学的 AI 博士项目对国际学生有吸引力，但本地顶尖学生（NUS / NTU 计算机本科前 5%）几乎全部去美国（Stanford / MIT / CMU / Berkeley）读博。原因不是新加坡环境差，而是**津贴差距太大**——美国顶尖 PhD 项目津贴 USD 4-5 万/年，加上更高声誉的导师/校友网络，对学生吸引力远超本地。

AISG PhD Fellowship 通过把津贴提到 SGD 6,700/月（约 USD 5 万/年），首次让本地博士项目在"经济回报"上能与美国竞争。配合 NUS AI Institute、CFAR、与 Google DeepMind 的合作，**新加坡博士项目的相对竞争力在 2024-2026 期间显著提升**。`,
        aiRelevanceJa: `AISG PhD Fellowship が解決する中核問題：**シンガポールは一流の AI 博士生を保つことができません**。

以前の状況：シンガポール一流大学の AI 博士課程は国際学生に魅力的でしたが、現地の一流学生（NUS / NTU コンピュータサイエンス学部前 5%）はほぼすべてアメリカ（Stanford / MIT / CMU / Berkeley）で博士号を取得しました。原因はシンガポール環境が悪いのではなく、**奨学金の差が大きすぎる**ことです——アメリカ一流 PhD プログラムの奨学金は USD 4～5 万/年で、より高い評判を持つアドバイザー/校友ネットワークに加え、学生に対する魅力は現地をはるかに上回ります。

AISG PhD Fellowship は奨学金を SGD 6,700/月（約 USD 5 万/年）に引き上げることで、初めて現地の博士課程が 「経済的リターン」でアメリカと競争できるようにしました。NUS AI Institute、CFAR、および Google DeepMind との協力と組み合わせて、**シンガポール博士課程の相対的な競争力は 2024～2026 年の間に大幅に向上しました**。`,
        aiRelevanceEn: `The core problem the AISG PhD Fellowship solves: **Singapore couldn't keep its top AI doctoral candidates.**

Before the fellowship: AI PhD programmes at Singapore's top universities were attractive to international students, but local top-tier students (the top 5% of NUS / NTU CS undergrads) almost all went to the US (Stanford / MIT / CMU / Berkeley) for their doctorates. The reason wasn't a worse environment in Singapore — it was **the stipend gap**: top US PhD programmes pay USD 40-50K/year, plus higher-prestige supervisors and alumni networks, which dramatically out-pulled local options.

By raising the stipend to SGD 6,700/month (about USD 50K/year), the AISG PhD Fellowship made local doctoral programmes competitive with the US on "economic return" for the first time. Combined with the NUS AI Institute, CFAR, and partnerships with Google DeepMind, **Singapore PhD programmes' relative competitiveness improved significantly between 2024-2026**.`,
        singaporeRelevance: `PhD Fellowship 是新加坡 AI 战略**长线人才储备**的关键工具。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：博士生是高校研究产出的真正主力
- **杠杆 2（人才）**：留住顶尖博士生才能形成本地 AI 研究"代际传承"

观点：**PhD Fellowship 的真正价值要 5-10 年后才能显现**——今天资助的博士生未来可能成为 AI Singapore v3、SEA-LION v6 的核心研究员。这是"看得见花钱、看不见回报"的长期投资，但对一个国家的 AI 生态根基至关重要。

可观察：录取生的留存率（毕业后留新加坡 vs 去海外）、产出的论文影响力、是否有从 Fellowship 出来的博士生成为本地顶尖 PI。`,
        singaporeRelevanceJa: `PhD Fellowship はシンガポール AI 戦略の**長期的人材育成**の重要なツールです。

「7つの伝導レバー」の中で：

- **レバー 1（基礎研究）**：博士課程学生は大学研究成果の本当の主力です
- **レバー 2（人材）**：トップクラスの博士課程学生を確保することで初めて、現地 AI 研究の「世代間継承」が形成されます

見解：**PhD Fellowship の真の価値は 5～10 年後に初めて見えてきます**——今日支援を受けた博士課程学生が、将来 AI Singapore v3、SEA-LION v6 の中核研究者となる可能性があるということです。これは「目に見える支出、見えない見返り」という長期投資ですが、一国の AI エコシステムの基盤として非常に重要です。

観察可能な指標：採択者の留保率（卒業後シンガポール残留 vs 海外流出）、産出論文の影響力、Fellowship 出身の博士課程学生が現地のトップ PI になったかどうか。`,
        singaporeRelevanceEn: `The PhD Fellowship is a key instrument for the **long-horizon talent reserve** of Singapore's AI strategy.

Across the seven transmission levers:

- **Lever 1 (Foundational Research)**: PhD students are the real engine of university research output
- **Lever 2 (Talent)**: retaining top doctoral candidates is what enables intergenerational continuity in local AI research

Take: **The PhD Fellowship's true value won't be visible for 5-10 years** — students funded today may become core researchers on AI Singapore v3 or SEA-LION v6. It is a "spending you can see, returns you can't" long-term investment, but vital to the bedrock of a country's AI ecosystem.

Worth watching: retention rates of recipients (staying in Singapore vs. leaving abroad after graduation), the citation impact of their papers, and whether any Fellowship alumni become top-tier PIs locally.`,
        milestones: [
          {
            date: '2018',
            title: 'AISG PhD Fellowship 启动',
            titleJa: 'AISG PhD Fellowship の立ち上げ',
            titleEn: 'AISG PhD Fellowship launched',
          },
          {
            date: '2024',
            title: '累计资助博士生超过 100 人',
            titleJa: '累積 100 人以上の博士課程学生への資金援助',
            titleEn: 'Over 100 doctoral students funded cumulatively',
          },
        ],
        relatedLeverNumbers: [1, 2],
        relatedEntityIds: ['ai-singapore', 'nus', 'ntu'],
        sources: [
          {
            label: 'AISG PhD Fellowship',
            labelEn: 'AISG PhD Fellowship',
            url: 'https://aisingapore.org/research/phd-fellowship/',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'amp',
        name: 'AMP',
        nameEn: 'AMP',
        description: 'Accelerated Masters Programme，本硕连读快车道',
        descriptionJa: 'Accelerated Masters Programme、学部と修士の連携高速トラック',
        descriptionEn: 'Accelerated Masters Programme; fast track from undergraduate to masters',
        entityType: 'program',
        status: 'active',
        parentOrg: 'AI Singapore',
        parentOrgEn: 'AI Singapore',
        parentEntityId: 'ai-singapore',
        summary:
          'AMP（Accelerated Masters Programme）让 AI 方向优秀本科生用 1 年时间拿到 AI 硕士学位（普通硕士需 2 年）。它是 AISG 留住顶尖本科生、避免他们流失到海外的工具之一。',
        summaryJa:
          'AMP（Accelerated Masters Programme）は AI 方向の優秀な学部生が 1 年間で AI 修士号を取得できるようにしています（通常の修士課程は 2 年）。これは AISG がトップレベルの学部生を引き留め、彼らが海外に流出するのを避けるためのツールの 1 つです。',
        summaryEn:
          "AMP (Accelerated Masters Programme) lets top undergraduates on the AI track earn an AI masters degree in 1 year (versus the standard 2). It is one of AISG's tools for keeping top undergraduates from leaking overseas.",
        whatItIs: `AMP 的关键设计：

- **本硕一体**：本科最后一年提前修部分硕士课
- **缩短到 1 年**：硕士阶段只需 1 年（普通是 2 年）
- **AISG 资助**：学费补贴 + 月津贴
- **挂靠合作高校**：NUS / NTU 等

定位：让"准备读 AI 硕士"的本科生不需要去海外，在新加坡用更短时间完成。`,
        whatItIsJa: `AMP の重要な設計特性：

- **学部・修士統合**：学部最終学年で修士課程科目の一部を先取り履修
- **1 年に短縮**：修士課程段階は 1 年で修了（通常は 2 年）
- **AISG 資金**：授業料補助 + 月額手当
- **提携大学への配置**：NUS / NTU など

位置づけ：「AI 修士課程を読もうとしている」学部生が海外に行く必要がなく、シンガポールでより短い時間で修了できます。`,
        whatItIsEn: `AMP's key design choices:

- **Integrated bachelor's-master's track**: students take selected master's courses early in their final undergraduate year
- **Compressed to 1 year**: the masters phase only takes 1 year (versus the usual 2)
- **AISG funding**: tuition subsidy + monthly stipend
- **Hosted at partner universities**: NUS / NTU, etc.

Positioning: lets undergrads who are "planning to do an AI masters" do it in Singapore in less time, rather than going abroad.`,
        aiRelevance: `AMP 解决的是"本硕之间的人才流失"。新加坡顶尖本科生想读 AI 硕士，常去美国 / 英国 / 澳洲——AMP 通过"快、便宜、AISG 资源加持"把这部分人留下。`,
        aiRelevanceJa: `AMP が解決するのは「学部と修士課程の間の人材流出」です。シンガポールのトップクラス学部生が AI 修士課程を読みたいとき、よく米国 / 英国 / オーストラリアに行きます——AMP は「迅速、低コスト、AISG リソース付き」を通じて、この層の人材をとどめています。`,
        aiRelevanceEn: `AMP addresses "talent leakage between bachelor's and master's." Singapore's top undergraduates who want an AI masters often head to the US / UK / Australia — AMP keeps that cohort by being "faster, cheaper, and AISG-resourced."`,
        singaporeRelevance: `AMP 是 AISG 人才漏斗的另一层：**本科 → AMP（硕士）→ AIAP / 工作 / PhD Fellowship**。

在「七条传导杠杆」里：

- **杠杆 2（人才）**：本科到硕士的留存通道

观点：AMP 规模不大，但它和 PhD Fellowship 形成互补——PhD 留住做研究的，AMP 留住去工业的。`,
        singaporeRelevanceJa: `AMP は AISG 人材漏斗の別の層です：**学部 → AMP（修士） → AIAP / 就職 / PhD Fellowship**。

「7つの伝導レバー」の中で：

- **レバー 2（人材）**：学部から修士への人材確保経路

見解：AMP の規模は大きくありませんが、それは PhD Fellowship と補完的です——PhD は研究職を留保し、AMP は産業職を留保します。`,
        singaporeRelevanceEn: `AMP is another layer of the AISG talent funnel: **undergrad → AMP (masters) → AIAP / industry / PhD Fellowship**.

Across the seven transmission levers:

- **Lever 2 (Talent)**: a retention channel from undergraduate to masters

Take: AMP isn't large in scale, but it complements the PhD Fellowship — the PhD programme retains those headed for research, AMP retains those headed for industry.`,
        milestones: [],
        relatedLeverNumbers: [2],
        relatedEntityIds: ['ai-singapore', 'phd-fellowship', 'aiap'],
        sources: [{ label: 'AISG Talent', labelEn: 'AISG Talent', url: 'https://aisingapore.org/talent/' }],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '国际合作',
    nameJa: '国際協力',
    nameEn: 'International Cooperation',
    icon: '🌏',
    description: '积极参与全球 AI 治理与合作',
    descriptionJa: 'グローバル AI ガバナンスと協力への積極的な参加',
    descriptionEn: 'An active hand in global AI governance and cooperation',
    entities: [
      {
        id: 'gpai',
        name: 'GPAI',
        nameEn: 'GPAI',
        description: '全球 AI 合作伙伴关系创始成员',
        descriptionJa: 'グローバル AI パートナーシップの創設メンバー',
        descriptionEn: 'Founding member of the Global Partnership on AI',
        url: 'https://gpai.ai/',
        entityType: 'initiative',
        status: 'active',
        founded: '2020-06',
        scale: '全球 29 国成员；新加坡为创始成员国之一',
        scaleJa: 'グローバル 29 か国のメンバー；シンガポールは創設メンバー国の 1 つ',
        scaleEn: '29 member countries globally; Singapore is a founding member',
        summary:
          'GPAI（Global Partnership on AI）是 2020 年由七国集团（G7）发起的多边 AI 合作组织，新加坡是创始成员国之一。它是新加坡参与全球 AI 治理的重要平台，通过它把 AI Verify、Model AI Governance Framework 等本国实践推向国际。',
        summaryJa:
          'GPAI（Global Partnership on AI）は 2020 年に 7 か国グループ（G7）が発起した多国間 AI 協力組織で、シンガポールは創設メンバー国の 1 つです。これはシンガポールがグローバル AI ガバナンスに参加するための重要なプラットフォームで、AI Verify や Model AI Governance Framework などの自国の実践を国際的に推し進めています。',
        summaryEn:
          'GPAI (Global Partnership on AI) is a multilateral AI cooperation body launched by the G7 in 2020, with Singapore as a founding member. It is a key platform for Singapore to participate in global AI governance and to push domestic practices such as AI Verify and the Model AI Governance Framework onto the international stage.',
        whatItIs: `GPAI 的工作机制：

- **多边对话**：成员国 AI 政策、研究、伦理交流
- **联合研究**：跨国 AI 项目（医疗 AI、AI 治理工具等）
- **专家网络**：各国学者、政策制定者的联络平台
- **OECD 协同**：2024 年与 OECD AI 工作合并

新加坡的参与：

- 主动贡献 AI Verify 作为治理工具样板
- 在多边讨论中代表"东南亚视角"
- 通过 GPAI 与欧盟、加拿大、日本等深化 AI 合作`,
        whatItIsJa: `GPAI の動作メカニズム：

- **多国間対話**：加盟国の AI 政策、研究、倫理交流
- **共同研究**：国際的 AI プロジェクト（医療 AI、AI ガバナンスツールなど）
- **専門家ネットワーク**：各国の学者、政策立案者の連絡プラットフォーム
- **OECD との協調**：2024 年に OECD AI ワーキンググループと統合

シンガポールの参加：

- AI Verify をガバナンスツール見本として主動的に貢献
- 多国間討論の中で「東南アジアの視点」を代表
- GPAI を通じて EU、カナダ、日本などとの AI 協力を深化させます`,
        whatItIsEn: `How GPAI works:

- **Multilateral dialogue**: exchanges on AI policy, research, and ethics among member states
- **Joint research**: cross-border AI projects (medical AI, governance tooling, etc.)
- **Expert network**: a connector for academics and policymakers across countries
- **OECD coordination**: merged with OECD AI workstreams in 2024

Singapore's participation:

- Actively contributes AI Verify as a governance-tooling template
- Represents the "Southeast Asian perspective" in multilateral discussions
- Uses GPAI to deepen AI cooperation with the EU, Canada, Japan, and others`,
        aiRelevance: `GPAI 不直接做 AI 研究或部署，它是**AI 治理的多边外交平台**。新加坡通过 GPAI 把 AI Verify 等工具推向国际，是 IMDA 国际化战略的关键渠道。`,
        aiRelevanceJa: `GPAI は AI 研究や導入を直接行いません。それは**AI ガバナンスの多国間外交プラットフォーム**です。シンガポールは GPAI を通じて AI Verify などのツールを国際的に推進し、IMDA の国際化戦略の重要な経路です。`,
        aiRelevanceEn: `GPAI does not do AI research or deployment directly — it is a **multilateral diplomatic platform for AI governance**. Singapore uses GPAI to push tools like AI Verify internationally, making it a key channel for IMDA's globalisation strategy.`,
        singaporeRelevance: `GPAI 是新加坡 AI 战略**"杠杆 6（外交）"的核心平台**之一。

在「七条传导杠杆」里：

- **杠杆 6（外交）**：多边 AI 治理参与的主要渠道

观点：GPAI 让新加坡这种小国家在全球 AI 治理桌上有"创始成员"身份，远超新加坡的实际经济/技术体量。这是新加坡"小国大策略"的典型案例。`,
        singaporeRelevanceJa: `GPAI はシンガポール AI 戦略の**「レバー 6（外交）」の中核プラットフォーム**の 1 つです。

「7つの伝導レバー」の中で：

- **レバー 6（外交）**：多国間 AI ガバナンス参加の主要な経路

見解：GPAI はシンガポールのような小国家に全球 AI ガバナンスのテーブルで「創設メンバー」という地位を与え、シンガポールの実際の経済・技術規模をはるかに上回っています。これはシンガポールの「小国の大戦略」の典型的な事例です。`,
        singaporeRelevanceEn: `GPAI is one of the core platforms for **Lever 6 (international affairs)** in Singapore's AI strategy.

In the "seven transmission levers" framework:

- **Lever 6 (international)**: the main channel for participation in multilateral AI governance

A take: GPAI gives a small country like Singapore "founding member" status at the global AI governance table — well beyond what its actual economic or technological weight would suggest. It is a textbook case of Singapore's "small country, big strategy" playbook.`,
        milestones: [
          {
            date: '2020-06',
            title: 'GPAI 成立，新加坡成为创始成员',
            titleJa: 'GPAI の設立、シンガポールが創設メンバーになる',
            titleEn: 'GPAI founded; Singapore as founding member',
          },
          {
            date: '2024',
            title: 'GPAI 与 OECD AI 工作整合',
            titleJa: 'GPAI と OECD AI の取り組みを統合',
            titleEn: 'GPAI integrated with OECD AI workstream',
          },
        ],
        relatedLeverNumbers: [6],
        relatedEntityIds: ['imda', 'ai-verify-foundation'],
        sources: [
          {
            label: 'GPAI 官网',
            labelJa: 'GPAI 公式ウェブサイト',
            labelEn: 'GPAI official site',
            url: 'https://gpai.ai/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'oecd-ai-observatory',
        name: 'OECD AI Policy Observatory',
        nameEn: 'OECD AI Policy Observatory',
        description: '参与 OECD AI 政策制定',
        descriptionJa: 'OECD AI 政策策定への参加',
        descriptionEn: 'Participating in OECD AI policy development',
        url: 'https://oecd.ai/',
        entityType: 'initiative',
        status: 'active',
        founded: '2020-02',
        summary:
          'OECD AI Policy Observatory 是 OECD 的 AI 政策研究和数据平台。新加坡虽然不是 OECD 成员国，但作为"OECD 关键合作伙伴"深度参与 AI 政策讨论，特别在 AI Principles 制定和 AI 系统分类标准上有贡献。',
        summaryJa:
          'OECD AI Policy Observatory は OECD の AI 政策研究とデータプラットフォームです。シンガポールは OECD 加盟国ではありませんが、「OECD 主要協力パートナー」として AI ポリシー議論に深く参加しており、特に AI Principles の策定と AI システム分類基準に貢献しています。',
        summaryEn:
          "The OECD AI Policy Observatory is the OECD's AI policy research and data platform. Although Singapore is not an OECD member, it engages deeply in AI policy discussions as an OECD Key Partner, contributing in particular to the development of the AI Principles and to standards for classifying AI systems.",
        whatItIs: `OECD AI Observatory 提供：

- **政策数据库**：各国 AI 政策追踪
- **AI Principles**：2019 年发布的 OECD AI 原则（被 G20 采纳）
- **研究报告**：AI 经济、就业、教育影响等
- **分类工具**：AI 系统的标准化分类框架

新加坡参与：

- IMDA 与 OECD 在 AI Principles 后续工作上合作
- 提供 AI Verify 作为"原则到工具"的转化样板`,
        whatItIsJa: `OECD AI Observatory が提供するもの：

- **政策データベース**：各国 AI 政策の追跡
- **AI 原則**：2019 年公表の OECD AI 原則（G20 による採択）
- **研究報告**：AI 経済、雇用、教育への影響など
- **分類ツール**：AI システムの標準化分類フレームワーク

シンガポールの参加：

- IMDA と OECD が AI 原則以後の仕事で協力
- AI Verify を「原則からツール」への変換見本として提供`,
        whatItIsEn: `The OECD AI Observatory provides:

- **Policy database**: tracking of AI policies across countries
- **AI Principles**: the OECD AI Principles released in 2019 (later adopted by the G20)
- **Research reports**: on the economic, employment, and educational impact of AI
- **Classification tools**: a standardised framework for classifying AI systems

Singapore's involvement:

- IMDA collaborates with the OECD on follow-up work to the AI Principles
- Contributes AI Verify as a model for translating "principles into tools"`,
        aiRelevance: `OECD AI Principles 是全球第一份被广泛采纳的政府间 AI 原则文件，被 G20 后续采纳。它的"五原则"（包容、人类中心、透明、稳健、问责）成为各国 AI 治理的共同语言。新加坡的 Model AI Governance Framework 主动对标这套原则，确保兼容性。`,
        aiRelevanceJa: `OECD AI 原則は、全球で最初に広く採択された政府間 AI 原則文書で、G20 によってその後採択されました。その「5 つの原則」（包括性、人間中心性、透明性、堅牢性、説明責任）は各国 AI ガバナンスの共通言語になりました。シンガポールの Model AI Governance Framework は、主動的にこの原則セットに対標して、互換性を確保します。`,
        aiRelevanceEn: `The OECD AI Principles were the first widely adopted intergovernmental AI principles document and were subsequently endorsed by the G20. Their "five principles" (inclusive growth, human-centred values, transparency, robustness, and accountability) have become a common language for AI governance worldwide. Singapore's Model AI Governance Framework actively aligns with this set of principles to ensure compatibility.`,
        singaporeRelevance: `OECD AI Observatory 让新加坡的 AI 治理工作能"被国际承认 + 影响国际标准"。

在「七条传导杠杆」里：

- **杠杆 6（外交）**：通过 OECD 让本国治理实践国际化

观点：新加坡不是 OECD 成员国但能深度参与 OECD AI 工作，是其"开放、可信、合作"国际形象的回报。`,
        singaporeRelevanceJa: `OECD AI Observatory により、シンガポールの AI ガバナンスの仕事は「国際的に認められる + 国際標準に影響を与える」ことができます。

「7つの伝導レバー」の中で：

- **レバー 6（外交）**：OECD を通じて本国のガバナンス実践を国際化する

見解：シンガポールは OECD 加盟国ではありませんが、OECD AI の仕事に深く参加でき、その「開放的、信頼できる、協力的」という国際的イメージの報酬です。`,
        singaporeRelevanceEn: `The OECD AI Observatory lets Singapore's AI governance work be both "internationally recognised and influential on international standards".

In the "seven transmission levers" framework:

- **Lever 6 (international)**: internationalising domestic governance practice via the OECD

A take: Singapore is not an OECD member yet still participates deeply in OECD AI work — a return on its international image as "open, trusted, and cooperative".`,
        milestones: [
          {
            date: '2019-05',
            title: 'OECD AI Principles 发布',
            titleJa: 'OECD AI Principles の公開',
            titleEn: 'OECD AI Principles released',
          },
          {
            date: '2020-02',
            title: 'OECD AI Policy Observatory 上线',
            titleJa: 'OECD AI Policy Observatory のオンライン展開',
            titleEn: 'OECD AI Policy Observatory launched',
          },
        ],
        relatedLeverNumbers: [6],
        relatedEntityIds: ['imda', 'gpai', 'ai-verify-foundation'],
        sources: [{ label: 'OECD.AI', labelEn: 'OECD.AI', url: 'https://oecd.ai/', date: '2026-05-02' }],
        updated: '2026-05-02',
      },
      {
        id: 'ai-safety-summits',
        name: 'Bletchley / Seoul 峰会',
        nameJa: 'Bletchley / Seoul サミット',
        nameEn: 'Bletchley / Seoul Summits',
        description: '连续参加两届全球 AI 安全峰会并签署承诺',
        descriptionJa: '2 回連続で全球 AI セキュリティサミットに参加し、コミットメントに署名',
        descriptionEn: 'Attended both global AI Safety Summits and signed the resulting commitments',
        entityType: 'initiative',
        status: 'active',
        founded: '2023-11',
        summary:
          'AI Safety Summit 系列是英国 2023 年发起的全球 AI 安全多边峰会——首届在 Bletchley Park（英国），第二届 2024 年在首尔，新加坡连续两届都参加并签署相关承诺。这是新加坡进入"全球 AI 治理顶级俱乐部"的标志性动作。',
        summaryJa:
          'AI Safety Summit シリーズは、英国が 2023 年に発起したグローバル AI セキュリティ多国間サミットです――初回は Bletchley Park（英国）で、2 回目は 2024 年にソウルで開催され、シンガポールは 2 回連続で参加し、関連するコミットメントに署名しました。これはシンガポールが「グローバル AI ガバナンスのトップレベルクラブ」に進むための象徴的な行動です。',
        summaryEn:
          'The AI Safety Summit series is a multilateral AI safety summit launched by the UK in 2023 — the first edition was held at Bletchley Park (UK) and the second in Seoul in 2024. Singapore attended both editions and signed the resulting commitments. This is a landmark move signalling Singapore\'s entry into the "top-tier club of global AI governance".',
        whatItIs: `两次峰会要点：

- **Bletchley Declaration（2023.11）**：28 国签署，承诺合作管理前沿 AI 风险
- **Seoul Declaration（2024.5）**：进一步承诺测试评估、信息共享、国际合作

新加坡的角色：

- 两届都派出由 IMDA 领头的代表团
- 签署了 Bletchley 和 Seoul 两份联合声明
- 在峰会上推介 AI Verify 作为治理工具

意义：这些峰会通常只有 G7、欧盟、中国、印度等大国参加；新加坡作为"小国家"被邀请且签署声明，反映了它在全球 AI 治理中的地位。`,
        whatItIsJa: `2 回のサミットの要点：

- **Bletchley Declaration（2023.11）**：28 カ国が署名し、先端 AI リスクの協力管理にコミット
- **Seoul Declaration（2024.5）**：テスト評価、情報共有、国際協力のさらなるコミット

シンガポールの役割：

- 両回とも IMDA が率いる代表団を派遣
- Bletchley と Seoul の 2 つの共同宣言に署名
- サミットで AI Verify をガバナンスツールとして紹介

意義：これらのサミットは通常、G7、EU、中国、インドなどの大国のみが参加します；シンガポールが「小国家」として招待され宣言に署名したことは、グローバル AI ガバナンスにおけるそのポジションを反映しています。`,
        whatItIsEn: `Key takeaways from the two summits:

- **Bletchley Declaration (Nov 2023)**: signed by 28 countries, committing to cooperate on managing frontier AI risks
- **Seoul Declaration (May 2024)**: further commitments on testing and evaluation, information sharing, and international cooperation

Singapore's role:

- Sent IMDA-led delegations to both editions
- Signed both the Bletchley and Seoul joint statements
- Showcased AI Verify as a governance tool at the summits

Significance: these summits typically only feature major powers — the G7, the EU, China, India — so Singapore being invited as a "small country" and signing the declarations reflects its standing in global AI governance.`,
        aiRelevance: `AI Safety Summits 是全球 AI 治理"高级别政治承诺"的舞台。和 GPAI / OECD（技术专家层面）不同，Summit 是国家元首/部长级别的承诺。新加坡能在这里露脸说明它的 AI 治理被认可为"国际级玩家"。`,
        aiRelevanceJa: `AI Safety Summit は全球 AI ガバナンスの「ハイレベル政治的コミットメント」のステージです。GPAI / OECD（技術専門家レベル）と異なり、Summit は国家元首 / 閣僚レベルのコミットメントです。シンガポールがここで顔を出して話すということは、その AI ガバナンスが「国際級プレイヤー」と認識されていることを意味します。`,
        aiRelevanceEn: `The AI Safety Summits are the stage for "high-level political commitments" in global AI governance. Unlike GPAI / OECD (which operate at the technical-expert level), the Summit involves head-of-state / ministerial-level commitments. Singapore's presence at the table signals that its AI governance is recognised as that of an "international-grade player".`,
        singaporeRelevance: `AI Safety Summit 参与是新加坡 AI 战略**"杠杆 6（外交）"的最高规格场景**。

在「七条传导杠杆」里：

- **杠杆 6（外交）**：最高级别国际承诺

观点：**新加坡能在 AI Safety Summit 桌上是其"国家品牌资产"的体现**——治理框架成熟、法治稳定、AI 中立——让它被英美和中国都接受为对话方。这种"中立可信"的位置在 AI 地缘政治化的时代价值越来越高。`,
        singaporeRelevanceJa: `AI Safety Summit 参加は、シンガポール AI 戦略の**「レバー 6（外交）」の最高格付けシーン**です。

「7つの伝導レバー」の中で：

- **レバー 6（外交）**：最高レベルの国際的コミットメント

見解：**シンガポールが AI Safety Summit のテーブルに座れるのは、その「国家ブランド資産」の体現です**——ガバナンスフレームワークが成熟し、法の支配が安定し、AI 中立——英米と中国の両方に対話方として受け入れられることができます。この「中立的信頼できる」ポジションは、AI 地政学化の時代においてますます価値が高まっています。`,
        singaporeRelevanceEn: `Participation in the AI Safety Summits is the **highest-tier scenario for Lever 6 (international affairs)** in Singapore's AI strategy.

In the "seven transmission levers" framework:

- **Lever 6 (international)**: top-tier international commitments

A take: **Singapore being able to sit at the AI Safety Summit table is a manifestation of its "national brand equity"** — a mature governance framework, rule-of-law stability, and AI neutrality — letting both the US/UK and China accept it as a counterpart. In an era of AI geopoliticisation, this kind of "neutral, trusted" position is becoming more and more valuable.`,
        milestones: [
          {
            date: '2023-11',
            title: 'Bletchley AI Safety Summit',
            titleEn: 'Bletchley AI Safety Summit',
          },
          {
            date: '2024-05',
            title: 'Seoul AI Safety Summit',
            titleEn: 'Seoul AI Safety Summit',
          },
        ],
        relatedLeverNumbers: [6],
        relatedEntityIds: ['imda', 'gpai', 'ai-verify-foundation'],
        sources: [
          {
            label: 'AI Safety Institute UK',
            labelEn: 'UK AI Safety Institute',
            url: 'https://www.aisi.gov.uk/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '医疗科技',
    nameJa: '医療技術',
    nameEn: 'Health Technology',
    icon: '🏥',
    description: '国家级医疗 AI 与健康科技平台',
    descriptionJa: '国家レベルの医療 AI と健康技術プラットフォーム',
    descriptionEn: 'National-level platforms for medical AI and health technology',
    entities: [
      {
        id: 'synapxe',
        name: 'Synapxe',
        nameEn: 'Synapxe',
        description: '新加坡国家医疗科技局，负责公共医疗IT基础设施与AI产品开发',
        descriptionJa: 'シンガポール国家医療技術局、公共医療 IT 基盤と AI 製品開発を担当',
        descriptionEn:
          "Singapore's national HealthTech agency, responsible for public-sector healthcare IT infrastructure and AI product development",
        url: 'https://www.synapxe.sg/',
        entityType: 'agency',
        status: 'active',
        founded: '2024',
        ministry: '卫生部（MOH）',
        ministryJa: '保健省（MOH）',
        ministryEn: 'Ministry of Health (MOH)',
        scale: '员工 2500+；服务全国 46 家公立医院与 1400+ 诊所',
        scaleJa: '従業員 2500+；全国 46 の公立病院と 1400+ のクリニックにサービス提供',
        scaleEn: '2,500+ staff; serves all 46 public hospitals and 1,400+ clinics nationally',
        leaders: [
          {
            name: 'Foo Hee Jug',
            title: '首席执行官',
            titleJa: '最高経営責任者（CEO）',
            titleEn: 'CEO',
            personId: 'foo-hee-jug',
          },
        ],
        summary:
          'Synapxe（前身 IHiS，2024 年更名）是新加坡的国家医疗科技局，负责所有公立医疗机构的 IT 基础设施与数字化转型。在 AI 领域，它是**新加坡医疗 AI 唯一的国家级落地主体**——所有公立医院的 AI 系统、数据治理、模型部署都由 Synapxe 统筹。',
        summaryJa:
          'Synapxe（前身 IHiS、2024 年改名）はシンガポールの国家医療技術局で、すべての公立医療機構の IT 基盤とデジタル変革を担当しています。AI 分野では、これは**シンガポール医療 AI の唯一の国家レベルの導入主体**です――すべての公立病院の AI システム、データガバナンス、モデル展開は Synapxe が統括しています。',
        summaryEn:
          "Synapxe (formerly IHiS, renamed in 2024) is Singapore's national HealthTech agency, responsible for IT infrastructure and digital transformation across all public healthcare institutions. In AI, it is **the only national-scale execution body for Singapore's medical AI** — every AI system, data governance regime, and model deployment in public hospitals runs through Synapxe.",
        whatItIs: `Synapxe 的角色非常独特：它不是医院、不是研究机构，而是**所有公立医疗机构的"共享 IT 部门"**。这意味着：

- **统一数据平台**：所有公立医院的电子病历都进入同一个国家系统（NEHR），AI 模型可以基于全国数据训练
- **AI 产品自研**：Synapxe 不只买商业 AI，还自研覆盖筛查、影像、行政流程的 AI 工具
- **统一部署**：AI 模型一旦验证通过，可以同时部署到所有公立医院

代表性 AI 产品：

- **ACE-AI**：AI 健康筛查工具，预测糖尿病和高脂血症风险，2027 年起推广到所有 Healthier SG 诊所
- **Clinical Note Summarizer**：基于 LLM 的电子病历摘要工具
- **影像 AI**：放射科 AI 辅助诊断（与 NUH、SGH 联合开发）
- **行政自动化**：处方处理、保险结算的 AI 自动化

Synapxe 与 AI Singapore、NUS Medicine、各公立医院（NUH、SGH、TTSH 等）有大量合作，是国家医疗 AI 的中心节点。`,
        whatItIsJa: `Synapxe の役割は非常にユニークです：病院ではなく研究機構でもなく、**すべての公立医療機構の「共有 IT 部門」**です。これは以下を意味します：

- **統一データ プラットフォーム**：すべての公立病院の電子カルテは同一の国家システム（NEHR）に入り、AI モデルは全国データに基づいて訓練できます
- **AI 製品の自主研究**：Synapxe は商業 AI のみを購買するのではなく、スクリーニング、医療画像、管理プロセスをカバーする AI ツールを自主研究します
- **統一デプロイメント**：AI モデルが検証をパスすると、すべての公立病院に同時にデプロイできます

代表的な AI 製品：

- **ACE-AI**：AI 健康スクリーニング ツール、糖尿病および高脂血症のリスクを予測し、2027 年からすべての Healthier SG 診療所に推進されます
- **Clinical Note Summarizer**：LLM ベースの電子カルテ要約ツール
- **医療画像 AI**：放射線科 AI 補助診断（NUH、SGH との共同開発）
- **管理自動化**：処方処理、保険決済の AI 自動化

Synapxe は AI Singapore、NUS Medicine、各公立病院（NUH、SGH、TTSH など）と大量の協力をしており、国家医療 AI の中心ノードです。`,
        whatItIsEn: `Synapxe's role is highly unusual: it is not a hospital, not a research institute, but the **"shared IT department" for all public healthcare institutions**. This means:

- **Unified data platform**: every public hospital's electronic health records flow into one national system (NEHR), so AI models can be trained on nationwide data
- **In-house AI products**: Synapxe doesn't only buy commercial AI — it builds its own AI tools spanning screening, imaging, and administrative workflows
- **Unified deployment**: once an AI model is validated, it can be rolled out to every public hospital simultaneously

Representative AI products:

- **ACE-AI**: an AI health-screening tool predicting diabetes and hyperlipidaemia risk, scheduled to roll out to all Healthier SG clinics from 2027
- **Clinical Note Summarizer**: an LLM-based EMR summary tool
- **Imaging AI**: AI-assisted radiology diagnosis (jointly developed with NUH and SGH)
- **Administrative automation**: AI automation for prescription handling and insurance claims

Synapxe collaborates extensively with AI Singapore, NUS Medicine, and the public hospitals (NUH, SGH, TTSH, and others), making it the central node of national medical AI.`,
        aiRelevance: `Synapxe 在医疗 AI 领域的核心创新是**"国家级数据 + 国家级部署"**。

全球大多数医疗 AI 创业公司面对的两个最大难题：

- **数据**：医疗数据分散在不同医院、不同 EMR 系统，难以做大规模训练
- **部署**：每家医院的 IT 系统、合规流程都不一样，单家产品落地都要数月

Synapxe 的体制把这两个难题都消解了：它直接拥有全国统一的医疗数据（NEHR），它的 AI 工具一旦做好可以同时部署到 46 家医院和 1400+ 诊所。**这种"国家级数据 + 国家级部署"的优势在全球都罕见**——只有英国 NHS、丹麦的医疗系统能与之相比。

技术上，Synapxe 的 AI 路线偏务实：

- 不追前沿模型架构
- 重视部署可靠性、合规性、可解释性
- 大量采用"AI + 人工审核"的混合工作流
- LLM 应用上谨慎（目前主要用在病历摘要、表单处理等低风险场景）`,
        aiRelevanceJa: `Synapxe の医療 AI 分野における核心的なイノベーションは**「国家級データ + 国家級デプロイメント」**です。

世界のほとんどの医療 AI スタートアップが直面する 2 つの最大の課題：

- **データ**：医療データは異なる病院、異なる EMR システムに分散しており、大規模な学習が困難です
- **デプロイメント**：各病院の IT システムと合規プロセスが異なり、個別の製品導入には数か月を要します

Synapxe の体制はこれら 2 つの課題を両方解消しました：全国統一の医療データ（NEHR）を直接保有しており、その AI ツールは完成すると同時に 46 の病院と 1400+ の診療所にデプロイできます。**「国家級データ + 国家級デプロイメント」のアドバンテージは世界的に稀です**——英国の NHS とデンマークの医療システムのみが比較できます。

技術的には、Synapxe の AI 戦略は実務的です：

- 最先端のモデル アーキテクチャを追求しない
- デプロイメントの信頼性、合規性、説明可能性を重視する
- 「AI + 人工審査」のハイブリッド ワークフローを広く採用している
- LLM アプリケーションに慎重です（現在、主に医療記録の要約やフォーム処理などの低リスク シナリオに使用されています）`,
        aiRelevanceEn: `Synapxe's core innovation in medical AI is **"national-grade data + national-grade deployment"**.

The two biggest pain points facing most medical AI startups globally are:

- **Data**: medical data is scattered across different hospitals and EMR systems, making large-scale training hard
- **Deployment**: every hospital's IT systems and compliance processes are different, so a single product takes months to land at one site

Synapxe's institutional setup dissolves both problems: it directly owns nationally unified medical data (NEHR), and once an AI tool is built it can deploy simultaneously to 46 hospitals and 1,400+ clinics. **This "national-grade data + national-grade deployment" advantage is rare globally** — only the UK's NHS and Denmark's healthcare system come close.

Technically, Synapxe's AI line is pragmatic:

- Doesn't chase frontier model architectures
- Prioritises deployment reliability, compliance, and explainability
- Uses a lot of "AI + human-in-the-loop" hybrid workflows
- Cautious on LLM applications (currently mostly in low-risk scenarios like clinical-note summarisation and form handling)`,
        singaporeRelevance: `Synapxe 在新加坡 AI 战略里是"行业 AI 落地的样板"——医疗是**唯一一个"国家级 AI 基础设施 + 国家级数据 + 国家级部署"全打通的行业**。

在「七条传导杠杆」里：

- **杠杆 3（产业应用）**：医疗 AI 落地的执行主体
- **杠杆 5（政府自用）**：公立医疗系统的 AI 化是政府自用的最大场景

观点：**Synapxe 的体制是新加坡作为"小国家"的天然优势变现**——人口只有 580 万，全国医疗系统集中度高，IT 体制统一。这让它能做美国、日本这种大国做不了的事：**用国家级数据训国家级模型，用国家级部署服务全国民众**。

ACE-AI 是最典型的案例：用全国糖尿病/胆固醇筛查数据训练模型，2027 年部署到所有 Healthier SG 诊所，理论上可以让全国 580 万人都受益。这种规模的医疗 AI 落地，只有"小国 + 集中体制"才能跑通。

但 Synapxe 也面临挑战：**医疗 AI 的安全审慎要求让它的迭代速度慢于商业 AI**、**与商业 AI 公司的边界需要厘清**（Synapxe 自研 vs 采购商业产品）、**数据治理的国际合作受 PDPA 约束**。`,
        singaporeRelevanceJa: `Synapxe はシンガポール AI 戦略の中で「業界 AI 着地のモデル」です——医療は**唯一「国家級 AI インフラ + 国家級データ + 国家級デプロイメント」が完全に貫通している業界**です。

「七条伝導レバー」の中で：

- **レバー 3（産業応用）**：医療 AI 着地の実行主体
- **レバー 5（政府自用）**：公立医療システムの AI 化は政府自用の最大シナリオです

観点：**Synapxe の体制は、シンガポールが「小国」としての天然のアドバンテージを具現化したもの**です——人口は 580 万のみで、全国医療システムの集中度が高く、IT 体制が統一されています。これにより、米国や日本のような大国ができないことができます：**国家級データで国家級モデルを訓練し、国家級デプロイメントで全国民にサービスを提供します**。

ACE-AI は最も代表的なケースです：全国の糖尿病/コレステロール スクリーニング データを使ってモデルを訓練し、2027 年に全ての Healthier SG 診療所にデプロイし、理論上は全国 580 万人が受益可能です。このスケールの医療 AI 着地は「小国 + 集中体制」のみが実現できます。

しかし Synapxe も課題に直面しています：**医療 AI のセーフティ慎重要件によって反復速度が商業 AI より遅い**、**商業 AI 企業との境界を明確にする必要がある**（Synapxe 自研 vs 商業製品の購買）、**データ治理の国際協力は PDPA に制約される**。`,
        singaporeRelevanceEn: `In Singapore's AI strategy, Synapxe is "the model for sectoral AI deployment" — healthcare is the **only sector where "national-grade AI infrastructure + national-grade data + national-grade deployment" are fully connected**.

In the "seven transmission levers" framework:

- **Lever 3 (industry adoption)**: the execution body for medical AI deployment
- **Lever 5 (government adoption)**: AI-enabling the public healthcare system is the largest single government-adoption scenario

A take: **Synapxe's institutional setup is Singapore's natural "small country" advantage cashed in** — a population of just 5.8 million, high concentration of the national healthcare system, and a unified IT architecture. This lets it do what large countries like the US and Japan cannot: **train national-grade models on national-grade data and deploy them to serve the entire population**.

ACE-AI is the most representative case: train a model on nationwide diabetes / cholesterol screening data and deploy it to all Healthier SG clinics by 2027 — in theory benefiting all 5.8 million residents. Medical AI deployment at this scale only works under "small country + centralised system".

But Synapxe also faces challenges: **medical AI's safety-cautious requirements make it iterate slower than commercial AI**, **its boundary with commercial AI companies needs clarification** (in-house vs procured), and **its international data-governance cooperation is constrained by PDPA**.`,
        milestones: [
          {
            date: '2008',
            title: 'IHiS（Synapxe 前身）成立',
            titleJa: 'IHiS（Synapxe の前身）の設立',
            titleEn: 'IHiS (predecessor of Synapxe) founded',
          },
          {
            date: '2017',
            title: 'NEHR 全国电子病历系统全覆盖',
            titleJa: 'NEHR 全国電子医療記録システムの完全カバレッジ',
            titleEn: 'NEHR national electronic health record system achieves full coverage',
          },
          {
            date: '2024',
            title: '更名为 Synapxe',
            titleJa: 'Synapxe に改名',
            titleEn: 'Renamed to Synapxe',
            description: '体现从 IT 服务到 HealthTech 主体的定位升级。',
            descriptionJa: 'IT サービスから HealthTech エンティティへの定位のアップグレードを体現しています。',
            descriptionEn: 'Reflecting the upgrade from IT services to a HealthTech-first identity.',
          },
          {
            date: '2025',
            title: 'ACE-AI 在 Healthier SG 试点诊所部署',
            titleJa: 'ACE-AI が Healthier SG パイロットクリニックに展開',
            titleEn: 'ACE-AI deployed to pilot Healthier SG clinics',
          },
          {
            date: '2027',
            title: 'ACE-AI 计划全国推广',
            titleJa: 'ACE-AI が全国展開予定',
            titleEn: 'ACE-AI scheduled for nationwide rollout',
          },
        ],
        relatedLeverNumbers: [3, 5],
        relatedEntityIds: ['ai-singapore', 'a-star', 'nus'],
        sources: [
          {
            label: 'Synapxe 官网',
            labelJa: 'Synapxe 公式サイト',
            labelEn: 'Synapxe official site',
            url: 'https://www.synapxe.sg/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'ace-ai',
        name: 'ACE-AI',
        nameEn: 'ACE-AI',
        description:
          '由 Synapxe 开发的 AI 健康筛查工具，预测糖尿病及高脂血症风险，2027 年起推广至所有 Healthier SG 诊所',
        descriptionJa:
          'Synapxe で開発された AI 健康スクリーニングツール、糖尿病および高脂血症リスクを予測、2027 年からすべての Healthier SG クリニックに拡大予定',
        descriptionEn:
          'AI health-screening tool developed by Synapxe that predicts diabetes and hyperlipidaemia risk; rollout to all Healthier SG clinics from 2027',
        entityType: 'product',
        status: 'active',
        founded: '2024',
        parentOrg: 'Synapxe',
        parentOrgEn: 'Synapxe',
        parentEntityId: 'synapxe',
        ministry: '卫生部（MOH）',
        ministryJa: '保健省（MOH）',
        ministryEn: 'Ministry of Health (MOH)',
        scale: '2027 年计划部署到全国 1400+ 诊所；可服务全国 580 万人',
        scaleJa: '2027 年に全国 1400+ のクリニックへの展開を予定；全国 580 万人にサービス可能',
        scaleEn: 'Planned deployment to 1,400+ clinics nationally by 2027; can serve all 5.8M residents',
        summary:
          'ACE-AI 是 Synapxe 开发的 AI 健康筛查工具，预测糖尿病和高脂血症风险。它是新加坡医疗 AI **第一个真正国家级部署**的产品——2027 年覆盖所有 Healthier SG 诊所，理论上 580 万人都能受益。',
        summaryJa:
          'ACE-AI は Synapxe で開発された AI 健康スクリーニングツールで、糖尿病および高脂血症リスクを予測します。これはシンガポール医療 AI の**最初の真の国家レベル展開**製品です――2027 年にすべての Healthier SG クリニックをカバーし、理論的には 580 万人がすべて利益を得ることができます。',
        summaryEn:
          "ACE-AI is an AI health-screening tool built by Synapxe that predicts diabetes and hyperlipidaemia risk. It is **Singapore's first medical-AI product to receive a true nationwide deployment** — by 2027 it will cover all Healthier SG clinics, in theory benefiting all 5.8 million residents.",
        whatItIs: `ACE-AI 的运作：

- **输入**：诊所获取的常规健康数据（年龄、性别、BMI、血压、生活方式问卷等）
- **预测**：5-10 年内发展为糖尿病 / 高脂血症的风险概率
- **输出**：医生看到风险评分 + 干预建议
- **闭环**：高风险者被纳入 Healthier SG 主动健康管理流程

技术上不算复杂——本质是基于全国医疗数据训练的风险预测模型。但它的部署规模和实际医疗影响远超大多数学术医疗 AI。`,
        whatItIsJa: `ACE-AI の運用：

- **入力**：診療所が獲得する通常の健康データ（年齢、性別、BMI、血圧、生活スタイル アンケートなど）
- **予測**：5-10 年以内に糖尿病/高脂血症に発展するリスク確率
- **出力**：医者はリスク スコア + 介入提案を見ます
- **ループ**：高リスク者は Healthier SG 主動健康管理プロセスに組み込まれます

技術的には複雑ではありません——本質的には全国医療データに基づいて訓練されたリスク予測モデルです。しかし、そのデプロイメント スケールと実際の医療影響は、ほとんどの学術医療 AI を大きく上回ります。`,
        whatItIsEn: `How ACE-AI works:

- **Inputs**: routine health data captured at the clinic (age, sex, BMI, blood pressure, lifestyle questionnaire, etc.)
- **Prediction**: probability of developing diabetes / hyperlipidaemia in the next 5–10 years
- **Output**: clinicians see a risk score plus intervention recommendations
- **Closed loop**: high-risk individuals are pulled into the Healthier SG proactive health-management workflow

Technically it is not complex — at its core it is a risk-prediction model trained on national health data. But its deployment scale and real-world medical impact far exceed most academic medical AI.`,
        aiRelevance: `ACE-AI 是医疗 AI 落地的"务实路线"代表——**不追前沿模型，追真实医疗影响**。

它的价值不在算法新颖，而在：

- **数据规模**：训练用的是全国 NEHR 数据，样本量比任何商业医疗 AI 都大
- **部署规模**：全国 1400+ 诊所同步使用
- **闭环价值**：预测结果直接接入 Healthier SG 干预流程，不只是"诊断辅助"

这种"国家级数据 + 国家级部署"的医疗 AI 项目在全球都罕见。`,
        aiRelevanceJa: `ACE-AI は医療 AI 着地の「実務的路線」代表です——「最先端モデルを追求せず、実際の医療影響を追求する」。

その価値はアルゴリズムの新規性にあるのではなく、以下にあります：

- **データ スケール**：訓練に使用されるのは全国 NEHR データで、サンプル量は商業医療 AI のどれよりも大きいです
- **デプロイメント スケール**：全国 1400+ の診療所が同期的に使用します
- **ループ価値**：予測結果は Healthier SG 介入プロセスに直接接続され、「診断補助」だけではありません

このような「国家級データ + 国家級デプロイメント」の医療 AI プロジェクトは世界的に稀です。`,
        aiRelevanceEn: `ACE-AI is a representative of the "pragmatic line" in medical AI deployment — **not chasing frontier models, but chasing real medical impact**.

Its value lies not in algorithmic novelty, but in:

- **Data scale**: training uses national NEHR data — a sample size larger than any commercial medical AI
- **Deployment scale**: simultaneous use across 1,400+ clinics nationwide
- **Closed-loop value**: prediction outputs feed directly into Healthier SG intervention flows, not just "diagnostic assistance"

This kind of "national-grade data + national-grade deployment" medical AI project is rare globally.`,
        singaporeRelevance: `ACE-AI 是新加坡医疗 AI 战略**"国家级落地"的标志性项目**。

在「七条传导杠杆」里：

- **杠杆 5（政府自用）**：医疗系统的国家级 AI 部署
- **杠杆 3（产业应用）**：医疗 AI 落地的样板

观点：**ACE-AI 证明新加坡的"小国 + 集中医疗体系"在医疗 AI 上是真正的优势**——美国、印尼这种大国就算想做也做不了"全国一套系统"。ACE-AI 的成功（如果成功）会被全球医疗 AI 行业反复研究。

可观察：**实际预测准确率**、**医生采纳度**（医生是否真的按 AI 建议干预）、**患者结局改善**（高风险患者发病率是否下降）——这些 5-10 年后才能看清。`,
        singaporeRelevanceJa: `ACE-AI はシンガポール医療 AI 戦略の**「国家級着地」の象徴的プロジェクト**です。

「七条伝導レバー」の中で：

- **レバー 5（政府自用）**：医療システムの国家級 AI デプロイメント
- **レバー 3（産業応用）**：医療 AI 着地のモデル

観点：**ACE-AI はシンガポールの「小国 + 集中医療体系」が医療 AI で真実のアドバンテージであることを証明しています**——米国やインドネシアのような大国は「全国統一システム」をしたくてもできません。ACE-AI の成功（もし成功すれば）は世界医療 AI 業界によって繰り返し研究されます。

観察可能：**実際の予測精度**、**医者採用度**（医者が実際に AI 提案に従って介入するかどうか）、**患者結果改善**（高リスク患者の発病率が低下するかどうか）——これらは 5-10 年後に初めて明確になります。`,
        singaporeRelevanceEn: `ACE-AI is the **flagship "national deployment" project** of Singapore's medical AI strategy.

In the "seven transmission levers" framework:

- **Lever 5 (government adoption)**: a national-scale AI deployment in the healthcare system
- **Lever 3 (industry adoption)**: a model for medical AI deployment

A take: **ACE-AI proves that Singapore's "small country + centralised healthcare system" is a real advantage in medical AI** — large countries like the US or Indonesia could not pull off "one nationwide system" even if they wanted to. ACE-AI's success (if it succeeds) will be studied by the global medical AI industry for years.

Worth watching: **actual prediction accuracy**, **clinician adoption** (do doctors actually intervene per the AI's recommendation), and **improvement in patient outcomes** (does incidence among high-risk patients drop) — answers will only become clear in 5–10 years.`,
        milestones: [
          {
            date: '2024',
            title: 'ACE-AI 试点诊所部署',
            titleJa: 'ACE-AI パイロットクリニック展開',
            titleEn: 'ACE-AI deployed in pilot clinics',
          },
          {
            date: '2027',
            title: '计划全国推广',
            titleJa: '全国展開予定',
            titleEn: 'Planned nationwide rollout',
          },
        ],
        relatedLeverNumbers: [3, 5],
        relatedEntityIds: ['synapxe', 'ai-singapore'],
        sources: [{ label: 'Synapxe', labelEn: 'Synapxe', url: 'https://www.synapxe.sg/', date: '2026-05-02' }],
        updated: '2026-05-02',
      },
    ],
  },
  {
    name: '产业伙伴',
    nameJa: '産業パートナー',
    nameEn: 'Industry Partners',
    icon: '🤝',
    description: '与全球科技巨头深度合作',
    descriptionJa: 'グローバル技術大手との深い協力',
    descriptionEn: 'Deep partnerships with global technology leaders',
    entities: [
      {
        id: 'google-deepmind',
        name: 'Google DeepMind',
        nameEn: 'Google DeepMind',
        description: '2025.11 设立东南亚首个 AI 研究实验室，团队含顶尖研究科学家和 AI 影响专家',
        descriptionJa:
          '2025年11月、東南アジア初の AI 研究実験室を設立、チームには一流の研究科学者と AI インパクト専門家を含む',
        descriptionEn:
          'Established its first Southeast Asian AI research lab in November 2025, staffed with leading research scientists and AI impact specialists',
        url: 'https://deepmind.google/blog/were-expanding-our-presence-in-singapore-to-advance-ai-in-the-asia-pacific-region/',
        entityType: 'partner',
        status: 'active',
        founded: '2025-11',
        headquarters: '新加坡（亚太总部），全球总部在伦敦',
        headquartersJa: 'シンガポール（アジア太平洋地域本部）、グローバル本部はロンドン',
        headquartersEn: 'Singapore (APAC HQ); global HQ in London',
        scale: '东南亚首个研究实验室；初始团队规模未公开',
        scaleJa: '東南アジア初の研究実験室；初期チーム規模は非公開',
        scaleEn: 'First Southeast Asian research lab; initial team size undisclosed',
        summary:
          'Google DeepMind 在 2025 年 11 月宣布在新加坡设立东南亚首个 AI 研究实验室，是新加坡作为"亚太 AI 中心"叙事的最大背书之一。团队定位包含基础研究科学家和"AI 影响"专家——后者负责把 AI 研究与本地、区域社会经济议题对齐。',
        summaryJa:
          'Google DeepMind は 2025 年 11 月、シンガポールに東南アジア初の AI 研究実験室の設立を発表しました。これはシンガポール が 「アジア太平洋 AI ハブ」 というナラティブの最大級のサポートの一つです。チームは基礎研究科学者と 「AI インパクト」 専門家で構成されます。後者は AI 研究をローカルおよび地域の社会経済問題と整合させる責任があります。',
        summaryEn:
          'In November 2025 Google DeepMind announced its first Southeast Asian AI research lab in Singapore — one of the biggest endorsements of Singapore\'s "APAC AI hub" narrative. The team is positioned to include both foundational research scientists and "AI impact" specialists, the latter tasked with aligning AI research with local and regional socio-economic agendas.',
        whatItIs: `Google DeepMind 在新加坡的实验室是其全球研究网络的一部分（其他在伦敦、纽约、苏黎世、加州、巴黎、蒙特利尔、东京等地）。新加坡实验室的特殊定位：

- **东南亚首个**：填补 DeepMind 在东南亚的研究存在
- **APAC 战略中心**：与东京实验室协同，覆盖整个亚太
- **"AI for Impact"双轨**：除了基础研究，专门有团队做 AI 在本地/区域议题（医疗、气候、教育）的应用
- **与本地生态深度对接**：与 NUS、A*STAR、AISG 都有合作意向

关于 DeepMind 全球：是 Google 的核心 AI 研究部门，2014 年被 Google 收购，2023 年与 Google Brain 合并。代表作 AlphaGo、AlphaFold、Gemini 等。

新加坡实验室目前还在早期，**具体研究方向、招聘规模、与本地的合作模式都在成形中**。它是 DeepMind 在东南亚的"种子据点"，未来 3-5 年的扩张速度将定义新加坡 AI 的国际地位。`,
        whatItIsJa: `Google DeepMind のシンガポール ラボは、そのグローバル研究ネットワークの一部です（他はロンドン、ニューヨーク、チューリッヒ、カリフォルニア、パリ、モントリオール、東京などにあります）。シンガポール ラボの特殊なポジショニング：

- **東南アジア初**：DeepMind の東南アジアの研究存在を埋めます
- **APAC 戦略の中心**：東京ラボとの協力により、アジア太平洋全体をカバーします
- **「AI for Impact」ダブル線路**：基礎研究に加え、本地/地域の問題（医療、気候、教育）での AI 応用に特別なチームがあります
- **本地エコシステムへの深度接続**：NUS、A*STAR、AISG はすべて協力意向があります

DeepMind グローバルについて：Google のコア AI 研究部門で、2014 年に Google に買収され、2023 年に Google Brain と統合されました。代表作は AlphaGo、AlphaFold、Gemini などです。

シンガポール ラボは現在まだ初期段階にあり、**具体的な研究方向、採用スケール、本地とのコラボレーション方式はまだ成形中**です。DeepMind の東南アジアの「種子拠点」であり、次の 3-5 年の拡大速度がシンガポール AI の国際ステータスを定義します。`,
        whatItIsEn: `The Google DeepMind lab in Singapore is part of its global research network (other sites are in London, New York, Zurich, California, Paris, Montreal, Tokyo, and elsewhere). The special positioning of the Singapore lab:

- **First in Southeast Asia**: fills DeepMind's research presence gap in the region
- **APAC strategic centre**: works in concert with the Tokyo lab to cover all of APAC
- **"AI for Impact" dual track**: alongside foundational research, a dedicated team works on AI applications for local / regional issues (health, climate, education)
- **Deep integration with the local ecosystem**: collaboration interest with NUS, A*STAR, and AISG

About DeepMind globally: it is Google's core AI research division, acquired by Google in 2014 and merged with Google Brain in 2023. Flagship work includes AlphaGo, AlphaFold, and Gemini.

The Singapore lab is still in its early days — **the concrete research directions, hiring scale, and local collaboration model are all still taking shape**. It is DeepMind's "seed outpost" in Southeast Asia, and the pace of expansion over the next 3–5 years will define Singapore's international AI standing.`,
        aiRelevance: `Google DeepMind 入驻新加坡的 AI 意义在于"**全球顶级 AI 研究力量首次在新加坡有实质存在**"。

之前新加坡的 AI 研究虽然有 NUS、NTU、A*STAR、AISG，但都是本地机构。Google DeepMind 的入驻让新加坡第一次有一个"全球顶级实验室的本地节点"——研究科学家可以在新加坡做 NeurIPS / ICML 级别的工作，本地研究生和工程师可以在不出国的情况下接触最前沿。

技术层面，DeepMind 新加坡实验室的可能方向：

- **基础模型研究**：与 Gemini / AlphaFold 等核心项目对接
- **AI for Science**：与 NUS、A*STAR 在生物医学 AI 的合作
- **Multilingual AI**：东南亚语言模型方向（与 SEA-LION 形成微妙的合作/竞争关系）
- **AI for Impact**：医疗、气候、教育等社会议题应用

战略层面，DeepMind 入驻是 Google 全球 AI 布局的一部分，与 Google Cloud、Google Research 在新加坡的存在形成 stacking。`,
        aiRelevanceJa: `Google DeepMind がシンガポールに入駐する AI 意義は「**全球トップティア AI 研究力が初めてシンガポールで実質的な存在を持つ**」です。

以前、シンガポールの AI 研究は NUS、NTU、A*STAR、AISG を持ちましたが、すべては本地機構です。Google DeepMind の入駐により、シンガポール初の「グローバル トップティア ラボの本地ノード」ができました——研究科学者は NeurIPS / ICML レベルの仕事をシンガポールでできており、本地研究生と工学者は出国なしに最先端にアクセスできます。

技術レベルでは、DeepMind シンガポール ラボの可能な方向：

- **基礎モデル研究**：Gemini / AlphaFold などコア プロジェクトへの接続
- **AI for Science**：NUS、A*STAR との生物医学 AI での協力
- **多言語 AI**：東南アジア言語モデル方向（SEA-LION との微妙な協力/競争関係）
- **AI for Impact**：医療、気候、教育などの社会課題応用

戦略レベルでは、DeepMind 入駐は Google グローバル AI 布局の一部であり、Google Cloud、Google Research のシンガポール存在と スタッキングを形成します。`,
        aiRelevanceEn: `What Google DeepMind's entry into Singapore means for AI: **for the first time, world-class AI research has a substantive presence in Singapore**.

Previously, Singapore's AI research — NUS, NTU, A*STAR, AISG — was carried by local institutions. Google DeepMind's arrival gives Singapore its first "local node of a global top-tier lab" — research scientists can do NeurIPS / ICML-level work in Singapore, and local graduate students and engineers can engage with the frontier without leaving the country.

Technically, possible directions for the DeepMind Singapore lab:

- **Foundation model research**: connected to core projects like Gemini and AlphaFold
- **AI for Science**: collaborations with NUS and A*STAR in biomedical AI
- **Multilingual AI**: Southeast Asian language model directions (a delicate cooperation/competition dynamic with SEA-LION)
- **AI for Impact**: applications to social issues like health, climate, and education

Strategically, DeepMind's arrival is part of Google's global AI footprint and stacks with Google Cloud's and Google Research's existing presence in Singapore.`,
        singaporeRelevance: `Google DeepMind 的入驻是新加坡 AI 战略**最重要的国际背书之一**。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：首次在新加坡有"全球顶级实验室"，研究水平直接接入 Google 全球网络
- **杠杆 2（人才）**：让新加坡顶尖 AI 人才有"在本地做世界级工作"的选择，减少人才流失
- **杠杆 6（外交）**：是新加坡作为"开放、中立、可靠 AI 节点"叙事的最大具象证据

观点：**DeepMind 选新加坡（而不是东京、首尔、悉尼）是新加坡 AI 国际化定位的重大胜利**——它意味着 Google 把新加坡视为东南亚甚至亚太的 AI 战略中心。这背后有几个原因：

- 新加坡的英语环境 + 法治 + 政策稳定让全球公司愿意把 IP 密集的研究放在这里
- 与 NUS、A*STAR 的深度合作可能性
- 新加坡 AI 治理框架（IMDA / AI Verify）让 Google 这种敏感于监管的大厂感到放心
- 作为东南亚枢纽，可以同时辐射印尼、越南、泰国等大市场

可观察的关键变量：**实验室能成长到多大**（100 人？500 人？）、**能否产出顶会论文级别的研究**、**与本地大学的合作深度**、**与 Microsoft Research Asia 新加坡实验室的竞合关系**。`,
        singaporeRelevanceJa: `Google DeepMind の入駐はシンガポール AI 戦略の**最重要な国際的支持の 1 つ**です。

「七条伝導レバー」の中で：

- **レバー 1（基礎研究）**：初めてシンガポールに「グローバル トップティア ラボ」があり、研究レベルは Google グローバル ネットワークに直接接続されています
- **レバー 2（人材）**：シンガポール トップティア AI 人材に「本地で世界級の仕事をする」選択肢があり、人材流出が減少します
- **レバー 6（外交）**：シンガポールが「開放的、中立的、信頼できる AI ノード」としての叙事の最大の具象証拠です

観点：**DeepMind がシンガポールを選択した（東京、ソウル、シドニーではなく）ことはシンガポール AI 国際化ポジショニングの大きな勝利**です——Google がシンガポールを東南アジアさらにはアジア太平洋の AI 戦略の中心と見なしていることを意味しています。これの背後には数個の理由があります：

- シンガポールの英語環境 + 法治 + ポリシー安定性により、グローバル企業は IP 密集型の研究をここに置く意欲があります
- NUS、A*STAR との深度協力の可能性
- シンガポール AI 治理フレームワーク（IMDA / AI Verify）により、Google のような規制に敏感な大手企業は安心感を感じます
- 東南アジアのハブとして、インドネシア、ベトナム、タイなどの大市場に同時に放射できます

観察可能な重要変数：**ラボがどの程度成長できるか**（100 人？500 人？）、**トップ会議論文レベルの研究を産出できるか**、**本地大学とのコラボレーション深度**、**Microsoft Research Asia シンガポール ラボとの協力関係**。`,
        singaporeRelevanceEn: `Google DeepMind's entry is **one of the most important international endorsements** for Singapore's AI strategy.

In the "seven transmission levers" framework:

- **Lever 1 (foundational research)**: a "global top-tier lab" in Singapore for the first time, with research quality plugged directly into Google's global network
- **Lever 2 (talent)**: gives Singapore's top AI talent the option to "do world-class work locally", reducing brain drain
- **Lever 6 (international)**: the most concrete piece of evidence for Singapore's narrative as an "open, neutral, reliable AI node"

A take: **DeepMind picking Singapore (over Tokyo, Seoul, Sydney) is a major win for Singapore's international AI positioning** — it means Google sees Singapore as the AI strategic centre for Southeast Asia or even the wider APAC. Several reasons sit behind this:

- Singapore's English-language environment, rule of law, and policy stability make global firms willing to place IP-intensive research here
- Deep collaboration potential with NUS and A*STAR
- Singapore's AI governance framework (IMDA / AI Verify) reassures regulation-sensitive big tech like Google
- As a Southeast Asian hub, it can radiate to large markets like Indonesia, Vietnam, and Thailand at the same time

Key variables to watch: **how big the lab can grow** (100 people? 500?), **whether it can produce top-conference-grade research**, **how deep its collaboration with local universities goes**, and **how it competes / cooperates with Microsoft Research Asia's Singapore lab**.`,
        milestones: [
          {
            date: '2010',
            title: 'DeepMind 在伦敦成立',
            titleJa: 'DeepMind はロンドンで設立',
            titleEn: 'DeepMind founded in London',
          },
          {
            date: '2014',
            title: 'Google 收购 DeepMind',
            titleJa: 'Google が DeepMind を買収',
            titleEn: 'Acquired by Google',
          },
          {
            date: '2023-04',
            title: 'DeepMind 与 Google Brain 合并',
            titleJa: 'DeepMind と Google Brain が統合',
            titleEn: 'DeepMind merges with Google Brain',
          },
          {
            date: '2025-11',
            title: '新加坡实验室宣布成立',
            titleJa: 'シンガポール実験室の設立を発表',
            titleEn: 'Singapore lab announced',
            description: 'DeepMind 在东南亚的首个实验室。',
            descriptionJa: 'DeepMind の東南アジア初の実験室。',
            descriptionEn: "DeepMind's first lab in Southeast Asia.",
          },
        ],
        relatedLeverNumbers: [1, 2, 6],
        relatedEntityIds: ['nus', 'a-star', 'ai-singapore'],
        sources: [
          {
            label: 'DeepMind 关于新加坡实验室的公告',
            labelJa: 'DeepMind シンガポール実験室に関する発表',
            labelEn: 'DeepMind announcement on Singapore lab',
            url: 'https://deepmind.google/blog/were-expanding-our-presence-in-singapore-to-advance-ai-in-the-asia-pacific-region/',
            date: '2026-05-02',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'microsoft-research-asia',
        name: 'Microsoft Research Asia',
        nameEn: 'Microsoft Research Asia',
        description: '2025.7 设立首个东南亚实验室，与 NUS 合作产业博士项目（IPP）',
        descriptionJa: '2025年7月、初の東南アジア実験室を設立、NUS との Industrial PhD Programme（IPP）で協力',
        descriptionEn:
          'Opened its first Southeast Asian lab in July 2025, partnering with NUS on the Industrial PhD Programme (IPP)',
        entityType: 'partner',
        status: 'active',
        founded: '2025-07',
        headquarters: '新加坡（东南亚总部），全球总部在北京',
        headquartersJa: 'シンガポール（東南アジア本部）、グローバル本部は北京',
        headquartersEn: 'Singapore (SEA HQ); global HQ in Beijing',
        summary:
          'Microsoft Research Asia（MSR Asia）是微软在亚洲的旗舰研究院，以北京总部闻名。2025 年 7 月在新加坡设立**东南亚首个实验室**，与 NUS 合作 Industrial PhD Programme（IPP），是微软在新加坡的 AI 研究升级动作。',
        summaryJa:
          'Microsoft Research Asia（MSR Asia）はマイクロソフトのアジア地域の主力研究院で、北京本部で知られています。2025 年 7 月、シンガポールに**東南アジア初の実験室**を設立し、NUS と Industrial PhD Programme（IPP）で協力しています。これはシンガポールにおけるマイクロソフトの AI 研究強化を示しています。',
        summaryEn:
          "Microsoft Research Asia (MSR Asia) is Microsoft's flagship research institute in Asia, best known for its Beijing headquarters. In July 2025 it opened its **first Southeast Asian lab** in Singapore, partnering with NUS on the Industrial PhD Programme (IPP) — an upgrade to Microsoft's AI research footprint in Singapore.",
        whatItIs: `MSR Asia 全球：

- 1998 年在北京成立，是微软第二大研究院
- 培养了大量华人 AI 研究骨干（沈向洋、洪小文等）
- 在 CV、NLP、系统、HCI 等方向有多年积累

新加坡实验室：

- 2025 年 7 月宣布，定位为"MSR Asia 在东南亚的拓展"
- 主要合作伙伴 NUS、与 IPP（产业博士）模式深度绑定
- 研究方向预计涵盖 LLM、多模态、AI for Science

意义：这是 MSR Asia 历史上第一次在中国大陆以外设大规模研究节点，反映了微软全球 AI 研究战略的地理多元化。`,
        whatItIsJa: `MSR Asia グローバル：

- 1998 年に北京で設立、マイクロソフトの 2 番目に大きい研究機関
- 多数の中国人 AI 研究のリーダー（沈向洋、洪小文など）を養成
- CV、NLP、システム、HCI などの分野で長年の積み重ね

シンガポール ラボラトリー：

- 2025 年 7 月に発表、「MSR Asia の東南アジア展開」と位置づけ
- 主要なパートナーは NUS、IPP（産業博士）モデルと深く連携
- 研究方向は LLM、マルチモーダル、AI for Science などをカバーする見込み

意義：これは MSR Asia の歴史において初めて中国大陸以外に大規模な研究ノードを設置したもので、マイクロソフトのグローバル AI 研究戦略の地理的多様化を示しています。`,
        whatItIsEn: `MSR Asia globally:

- Founded in Beijing in 1998; Microsoft's second-largest research institute
- Trained a large cohort of senior Chinese AI researchers (Harry Shum, Hsiao-Wuen Hon, and others)
- Multi-year track record in CV, NLP, systems, and HCI

The Singapore lab:

- Announced in July 2025, positioned as "MSR Asia's expansion into Southeast Asia"
- NUS as the main partner, deeply tied to the IPP (Industrial PhD) model
- Research directions are expected to span LLMs, multimodal AI, and AI for Science

Significance: this is the first time in MSR Asia's history that it has set up a sizeable research node outside mainland China, reflecting the geographic diversification of Microsoft's global AI research strategy.`,
        aiRelevance: `MSR Asia 在新加坡设立实验室的 AI 意义：**让微软的研究力量在新加坡有持续存在**。

之前微软在新加坡主要是商业、销售、Azure 的存在；MSR Asia 的入驻让微软的"研究 + 工程 + 商业"三层在新加坡都齐了。这与 Google DeepMind 入驻形成有趣的对照——两大美国 AI 巨头几乎同时把研究力量放到新加坡。

技术上，MSR Asia 与 NUS 的 IPP 合作让博士生可以"半研究半工程"：在 NUS 注册学籍，在 MSR 做研究，毕业后进微软或保留学术路径。这种模式对吸引顶尖博士生有显著优势。`,
        aiRelevanceJa: `MSR Asia がシンガポールで設立したラボの AI 意義：**マイクロソフトの研究力がシンガポールで継続的な存在を持つ**です。

以前、マイクロソフトはシンガポールで主に商業、販売、Azure の存在でしたが、MSR Asia の入駐により、マイクロソフトの「研究 + 工学 + 商業」三層がシンガポールで揃っています。これは Google DeepMind 入駐と興味深い対照を形成します——米国の二つの大 AI 巨人が同時にシンガポールに研究力を置きました。

技術的には、MSR Asia と NUS の IPP コラボレーションにより、博士生は「半研究半工学」できます：NUS で学籍に登録しながら、MSR で研究をし、卒業後 Microsoft に進むか学術パスを保持します。このモデルは トップティア博士生の引き付けに明らかなアドバンテージがあります。`,
        aiRelevanceEn: `What MSR Asia opening a lab in Singapore means for AI: **Microsoft's research arm now has a sustained presence in Singapore.**

Microsoft's previous footprint in Singapore was mostly commercial, sales, and Azure; MSR Asia's arrival completes the "research + engineering + commercial" trio in Singapore. This forms an interesting parallel with Google DeepMind's entry — the two American AI giants planted research arms in Singapore at almost the same time.

Technically, the MSR Asia–NUS IPP collaboration lets PhD students do "half research, half engineering": registered at NUS, doing research at MSR, then either joining Microsoft or staying on an academic track after graduation. This model is a meaningful advantage in attracting top PhD students.`,
        singaporeRelevance: `MSR Asia 的入驻是**新加坡作为"中美 AI 中立地"叙事的重要支撑**——既能吸引 Google DeepMind，也能吸引 MSR Asia。

在「七条传导杠杆」里：

- **杠杆 1（基础研究）**：再增一个全球顶级研究节点
- **杠杆 2（人才）**：通过 IPP 模式留住顶尖博士生
- **杠杆 6（外交）**：双向吸引中美 AI 研究力量

观点：**MSR Asia 在新加坡的存在让 Google DeepMind 不再"独大"**——这种 healthy competition 对新加坡有利：两家都想抢人才、出 paper、影响政策。新加坡可以坐收"两边都要讨好我"的红利。`,
        singaporeRelevanceJa: `MSR Asia の進出は、**シンガポール が「米中 AI 中立地」というナラティブの重要なサポートである**――Google DeepMind も MSR Asia も両方を引き付けることができます。

「7つの伝導レバー」の中で：

- **レバー1（基礎研究）**：グローバル最高峰の研究ノードをさらに1つ追加
- **レバー2（人材）**：IPP モデルを通じてトップクラスの博士課程学生を留める
- **レバー6（外交）**：米中 AI 研究力を双方向で引き付ける

見方：**MSR Asia のシンガポール での存在により、Google DeepMind はもはや「独占」ではなくなった**――このような健全な競争はシンガポール にとって有利です。両社とも人材を引き寄せたい、論文を発表したい、政策に影響を与えたいと考えています。シンガポール は「両者に気に入られる」という利益を享受できます。`,
        singaporeRelevanceEn: `MSR Asia's entry is **an important pillar of Singapore's "neutral ground in US–China AI" narrative** — it can attract both Google DeepMind and MSR Asia.

In the "seven transmission levers" framework:

- **Lever 1 (foundational research)**: another global top-tier research node
- **Lever 2 (talent)**: retains top PhD students via the IPP model
- **Lever 6 (international)**: pulls in both US and Chinese AI research strength

A take: **MSR Asia's presence in Singapore means Google DeepMind no longer "stands alone"** — this kind of healthy competition benefits Singapore: both want to grab talent, publish papers, and influence policy. Singapore gets to collect the "both sides courting me" dividend.`,
        milestones: [
          {
            date: '1998',
            title: 'Microsoft Research Asia 在北京成立',
            titleJa: 'Microsoft Research Asia は北京で設立',
            titleEn: 'MSR Asia founded in Beijing',
          },
          {
            date: '2025-07',
            title: '新加坡实验室宣布成立',
            titleJa: 'シンガポール実験室の設立を発表',
            titleEn: 'Singapore lab announced',
          },
        ],
        relatedLeverNumbers: [1, 2, 6],
        relatedEntityIds: ['nus', 'google-deepmind'],
        sources: [
          {
            label: 'MSR Asia',
            labelEn: 'MSR Asia',
            url: 'https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/',
          },
        ],
        updated: '2026-05-02',
      },
      {
        id: 'aws',
        name: 'AWS',
        nameEn: 'AWS',
        description: '云计算基础设施与 AI 服务合作，承诺 $9B 基础设施投资',
        descriptionJa:
          'クラウドコンピューティングインフラストラクチャと AI サービスの協力、$9B インフラストラクチャ投資を約束',
        descriptionEn:
          'Cloud infrastructure and AI services partnership, with $9B in committed infrastructure investment',
        entityType: 'partner',
        status: 'active',
        founded: '2010',
        headquarters: '新加坡（亚太总部之一）',
        headquartersJa: 'シンガポール（アジア太平洋地域本部の一つ）',
        headquartersEn: 'Singapore (one of the APAC HQs)',
        scale: '承诺 USD 90 亿基础设施投资；新加坡是 AWS 在东南亚的核心区',
        scaleJa: 'USD 90 億のインフラストラクチャ投資を約束；シンガポールは AWS の東南アジアの中核地域',
        scaleEn: "USD 9 billion committed infrastructure investment; Singapore is AWS's core hub in Southeast Asia",
        summary:
          'AWS（Amazon Web Services）在新加坡运营东南亚最大的云数据中心区域之一，并承诺 USD 90 亿基础设施投资。在 AI 领域，AWS 是新加坡最大的云算力供应方，同时通过 SageMaker、Bedrock 等服务为本地企业 AI 落地提供基础设施。',
        summaryJa:
          'AWS（Amazon Web Services）はシンガポールで東南アジア最大級のクラウドデータセンター地域の一つを運営し、USD 90 億のインフラストラクチャ投資を約束しています。AI 分野では、AWS はシンガポール最大のクラウドコンピューティング供給業者であり、同時に SageMaker、Bedrock などのサービスを通じてローカル企業の AI 実装を支援するインフラストラクチャを提供しています。',
        summaryEn:
          "AWS (Amazon Web Services) operates one of the largest cloud data centre regions in Southeast Asia from Singapore and has committed USD 9 billion in infrastructure investment. On the AI front, AWS is Singapore's largest cloud compute supplier, and through services such as SageMaker and Bedrock it provides the infrastructure for local enterprise AI deployment.",
        whatItIs: `AWS 在新加坡：

- **数据中心**：东南亚最大的云区域之一，多个 Availability Zones
- **AI 服务**：Bedrock、SageMaker、Rekognition、Transcribe 等
- **本地合作**：与 SEA-LION 项目提供训练算力赞助；与 AISG、政府部门、本地银行有云服务合作
- **人才培训**：AWS Academy、re/Start 等本地人才培养项目

USD 90 亿投资公告（2024）让新加坡成为 AWS 在东南亚的核心扩张点。`,
        whatItIsJa: `シンガポール における AWS：

- **データセンター**：東南アジア最大のクラウドリージョンの1つで、複数の Availability Zone を備える
- **AI サービス**：Bedrock、SageMaker、Rekognition、Transcribe など
- **現地パートナーシップ**：SEA-LION プロジェクトに訓練算力の提供を支援；AISG、政府部門、現地銀行とのクラウドサービス協力
- **人材育成**：AWS Academy、re/Start などの現地人材育成プログラム

2024 年の 90 億 USD 投資公表により、シンガポール は AWS の東南アジア中核拡張地点となりました。`,
        whatItIsEn: `AWS in Singapore:

- **Data centres**: one of Southeast Asia's largest cloud regions, with multiple Availability Zones
- **AI services**: Bedrock, SageMaker, Rekognition, Transcribe, and others
- **Local partnerships**: provides sponsored training compute to the SEA-LION project; cloud-services collaborations with AISG, government agencies, and local banks
- **Talent training**: local talent programmes such as AWS Academy and re/Start

The USD 9 billion investment announcement (2024) made Singapore the core expansion point for AWS in Southeast Asia.`,
        aiRelevance: `AWS 在新加坡 AI 生态里是"**算力与基础设施层**"。

具体角色：

- **算力供应**：本地企业训练 / 推理 AI 模型的主要云提供商
- **AI 服务**：通过 Bedrock 让企业可以一键调用 Claude、Llama、Cohere 等模型
- **SEA-LION 算力**：部分 SEA-LION 训练计算资源由 AWS 赞助
- **政府云**：新加坡政府部门部分云负载在 AWS 上，间接影响 AI 部署

技术上 AWS 不主导研究，但它的服务边界（Bedrock 提供哪些模型、SageMaker 支持哪些框架）直接影响本地企业的 AI 选择。`,
        aiRelevanceJa: `AWS はシンガポール の AI エコシステムにおいて「**算力とインフラストラクチャレイヤー**」です。

具体的な役割：

- **算力提供**：現地企業が AI モデルの訓練・推論を行う際の主要なクラウドプロバイダー
- **AI サービス**：Bedrock を通じて企業が Claude、Llama、Cohere などのモデルをワンクリックで呼び出せるようにする
- **SEA-LION 算力**：SEA-LION 訓練計算リソースの一部は AWS により提供
- **政府クラウド**：シンガポール 政府部門の一部クラウド負荷は AWS 上にあり、AI デプロイに間接的に影響

技術的には AWS は研究をリードしていませんが、その服務の境界（Bedrock がどのモデルを提供するか、SageMaker がどのフレームワークをサポートするか）は現地企業の AI の選択に直接影響を与えます。`,
        aiRelevanceEn: `In Singapore's AI ecosystem, AWS is the "**compute and infrastructure layer**".

Concrete roles:

- **Compute supply**: the main cloud provider for local enterprises training and running AI models
- **AI services**: Bedrock lets enterprises one-click access models from Claude, Llama, Cohere, etc.
- **SEA-LION compute**: part of the SEA-LION training compute is sponsored by AWS
- **Government cloud**: parts of Singapore government workloads run on AWS, indirectly shaping AI deployment

AWS does not lead research technically, but the boundaries of its services (which models Bedrock offers, which frameworks SageMaker supports) directly shape local enterprises' AI choices.`,
        singaporeRelevance: `AWS USD 90 亿投资是新加坡 AI 战略**"基础设施杠杆"的最大资金注入**。

在「七条传导杠杆」里：

- **杠杆 1（基础设施）**：算力底座
- **杠杆 3（产业应用）**：通过 Bedrock 等让企业 AI 落地门槛降低

观点：**AWS 投资规模对新加坡是双刃剑**——它带来巨额资金、就业、税收、AI 算力，但也让新加坡 AI 生态对 AWS 高度依赖。如果 Bedrock 调价、AWS 退出某个 AI 服务，本地企业受冲击大。这是新加坡推 SEA-LION（一个不依赖 AWS API 的本地化模型）的部分动机。`,
        singaporeRelevanceJa: `AWS の 90 億 USD 投資は、シンガポール の AI 戦略における**「インフラストラクチャレバー」の最大の資金注入**です。

「7つの伝導レバー」の中で：

- **レバー1（インフラストラクチャ）**：算力のベース
- **レバー3（産業応用）**：Bedrock などを通じて企業が AI を導入する際のハードルを下げる

見方：**AWS 投資規模はシンガポール にとって両刃の剣である**――それは多額の資金、雇用、税収、AI 算力をもたらしますが、シンガポール の AI エコシステムを AWS に高度に依存させてもいます。Bedrock の価格改定や AWS が AI サービスから撤退する場合、現地企業への影響は大きいです。これはシンガポール が SEA-LION（AWS API に依存しない現地化モデル）を推し進める理由の一部です。`,
        singaporeRelevanceEn: `The AWS USD 9 billion investment is **the single largest funding injection into the "infrastructure lever"** of Singapore's AI strategy.

In the "seven transmission levers" framework:

- **Lever 1 (infrastructure)**: the compute base
- **Lever 3 (industry adoption)**: services like Bedrock lower the barrier to enterprise AI deployment

A take: **the scale of the AWS investment is a double-edged sword for Singapore** — it brings massive capital, jobs, tax revenue, and AI compute, but it also makes Singapore's AI ecosystem heavily dependent on AWS. If Bedrock raises prices or AWS exits an AI service, local enterprises take a serious hit. This is part of the motivation for Singapore pushing SEA-LION (a localised model that does not depend on AWS APIs).`,
        milestones: [
          {
            date: '2010',
            title: 'AWS 新加坡区域上线',
            titleJa: 'AWS シンガポール地域のサービス開始',
            titleEn: 'AWS Singapore region launched',
          },
          {
            date: '2024',
            title: '宣布 USD 90 亿基础设施投资',
            titleJa: 'USD 90 億のインフラストラクチャ投資を発表',
            titleEn: 'Announced USD 9 billion infrastructure investment',
          },
        ],
        relatedLeverNumbers: [1, 3],
        relatedEntityIds: ['ai-singapore', 'sea-lion', 'nvidia'],
        sources: [{ label: 'AWS Singapore', labelEn: 'AWS Singapore', url: 'https://aws.amazon.com/local/singapore/' }],
        updated: '2026-05-02',
      },
      {
        id: 'nvidia',
        name: 'NVIDIA',
        nameEn: 'NVIDIA',
        description: '深度合作提供算力支持，新加坡贡献 NVIDIA 约 15% 全球营收（~$2.7B/季度）',
        descriptionJa:
          '深い協力により算力支援を提供、シンガポール は NVIDIA の約 15% グローバル営収に貢献（~$2.7B/四半期）',
        descriptionEn:
          "Deep compute partnership; Singapore contributes roughly 15% of NVIDIA's global revenue (~$2.7B per quarter)",
        entityType: 'partner',
        status: 'active',
        scale: '新加坡贡献约 15% NVIDIA 全球营收（~USD 27 亿/季度）；东南亚 AI 算力重镇',
        scaleJa: 'シンガポール は NVIDIA グローバル営収の約 15% に貢献（~USD 27 億/四半期）；東南アジア AI 算力の中核',
        scaleEn: 'Singapore contributes ~15% of NVIDIA global revenue (~USD 2.7B per quarter); SEA AI compute hub',
        summary:
          'NVIDIA 是全球 AI 算力的"水电煤"——GPU 是 LLM、CV 等所有 AI 训练和推理的硬件底座。新加坡作为东南亚枢纽和金融转账中心，**贡献了 NVIDIA 约 15% 全球营收（季度约 USD 27 亿）**——这个数字让新加坡在 NVIDIA 的全球策略中具有特殊地位。',
        summaryJa:
          'NVIDIA はグローバル AI 算力の「基盤」です。GPU は LLM、CV など、すべての AI トレーニングと推論のハードウェア基盤です。東南アジアのハブおよび金融決済センターとしてのシンガポールは、**NVIDIA のグローバル営収の約 15%（四半期約 USD 27 億）に貢献しています**。この数字により、シンガポールは NVIDIA のグローバル戦略において特別な地位を占めています。',
        summaryEn:
          'NVIDIA is the "utility" of global AI compute — GPUs are the hardware foundation for all AI training and inference, from LLMs to CV. As a Southeast Asian hub and financial-routing centre, Singapore **contributes about 15% of NVIDIA\'s global revenue (~USD 2.7 billion per quarter)** — a number that gives Singapore a special place in NVIDIA\'s global strategy.',
        whatItIs: `NVIDIA 在新加坡：

- **算力供应**：通过 OEM 渠道、云提供商（AWS、Google Cloud、Azure）、直接销售提供 H100 / B200 等 AI GPU
- **NSCC 合作**：新加坡国家超算中心部分 GPU 集群是 NVIDIA 硬件
- **企业市场**：金融、电信、政府的 AI 部署大量使用 NVIDIA GPU
- **DGX SuperPOD**：本地多个企业部署了 DGX 集群

为什么新加坡占 NVIDIA 营收 15%：部分是真实新加坡需求，部分是新加坡作为东南亚转运/计费中心，名义上买单但 GPU 实际去向其他东南亚国家。NVIDIA 财报口径让新加坡数字看起来巨大。`,
        whatItIsJa: `シンガポール における NVIDIA：

- **算力供給**：OEM チャネル、クラウドプロバイダー（AWS、Google Cloud、Azure）、直販を通じて H100・B200 などの AI GPU を提供
- **NSCC 協力**：シンガポール 国家スーパーコンピュータセンターの一部 GPU クラスターは NVIDIA ハードウェア
- **企業市場**：金融、通信、政府の AI デプロイは大量に NVIDIA GPU を使用
- **DGX SuperPOD**：現地複数の企業が DGX クラスターをデプロイ

なぜシンガポール が NVIDIA 営収の 15% を占めるのか：部分的にはシンガポール の真の需要ですが、部分的にはシンガポール が東南アジアの転送・決済センターであり、名目上はシンガポール が購入していても GPU の実際の行き先は他の東南アジア国です。NVIDIA の財報では、この記録方式によってシンガポール の数字が非常に大きく見えます。`,
        whatItIsEn: `NVIDIA in Singapore:

- **Compute supply**: ships AI GPUs such as H100 / B200 via OEM channels, cloud providers (AWS, Google Cloud, Azure), and direct sales
- **NSCC collaboration**: parts of Singapore's National Supercomputing Centre's GPU clusters are NVIDIA hardware
- **Enterprise market**: AI deployments in finance, telecoms, and government rely heavily on NVIDIA GPUs
- **DGX SuperPOD**: several local enterprises have deployed DGX clusters

Why Singapore accounts for 15% of NVIDIA revenue: partly real Singaporean demand, and partly Singapore's role as a Southeast Asian routing / billing centre — invoiced here on paper, but the GPUs end up in other Southeast Asian countries. NVIDIA's reporting convention makes the Singapore figure look enormous.`,
        aiRelevance: `NVIDIA 不直接做 AI 模型研究，但它是 AI 时代的**绝对算力垄断者**——任何严肃的 AI 训练和推理都离不开 NVIDIA GPU。

新加坡 AI 生态对 NVIDIA 的依赖：

- **SEA-LION 训练**：H100 集群
- **企业 AI 推理**：本地金融业、电信业的 LLM 部署
- **国家算力**：NSCC 升级离不开 NVIDIA

这种依赖在中美 AI 竞争背景下变得敏感——美国对中国出口管制（A100 / H100 禁运）让"如何获取 NVIDIA 算力"成为地缘政治问题。新加坡作为美国盟友 + 东南亚枢纽，**目前可以自由购买 NVIDIA 高端 GPU，但同时被怀疑是"中国转运渠道"**。这是 2024-2026 NVIDIA 在新加坡叙事的最敏感部分。`,
        aiRelevanceJa: `NVIDIA は AI モデル研究を直接行いませんが、AI 時代の**絶対的な算力独占者**です――真摯な AI 訓練と推論はすべて NVIDIA GPU から逃げられません。

シンガポール の AI エコシステムの NVIDIA への依存：

- **SEA-LION 訓練**：H100 クラスター
- **企業 AI 推論**：現地金融業、通信業の LLM デプロイ
- **国家算力**：NSCC のアップグレードは NVIDIA から切り離せない

この依存は米中 AI 競争の背景で敏感になっています――米国の中国への輸出規制（A100・H100 禁止）によって「NVIDIA 算力をどう取得するか」は地政学的問題になりました。シンガポール は米国の同盟国 + 東南アジアのハブとして、**現在 NVIDIA ハイエンド GPU を自由に購入できますが、同時に「中国への転送経路」と疑われています**。これは 2024-2026 年の NVIDIA のシンガポール ナラティブにおける最も敏感な部分です。`,
        aiRelevanceEn: `NVIDIA does not do AI model research directly, but in the AI era it is the **absolute monopolist of compute** — no serious AI training or inference happens without NVIDIA GPUs.

Singapore's AI ecosystem depends on NVIDIA across:

- **SEA-LION training**: H100 clusters
- **Enterprise AI inference**: LLM deployments in local finance and telecoms
- **National compute**: NSCC upgrades cannot avoid NVIDIA

This dependence has become sensitive in the US–China AI competition — US export controls on China (the A100 / H100 bans) have turned "how to obtain NVIDIA compute" into a geopolitical question. As both a US ally and a Southeast Asian hub, Singapore **can currently buy top-end NVIDIA GPUs freely, while simultaneously being suspected as a "China rerouting channel"**. This is the most sensitive part of the 2024–2026 NVIDIA-in-Singapore narrative.`,
        singaporeRelevance: `NVIDIA 在新加坡 AI 战略里是**"算力咽喉"**——既是支撑也是地缘风险。

在「七条传导杠杆」里：

- **杠杆 1（基础设施）**：算力的物理基础
- **杠杆 6（外交）**：在中美算力管制中如何定位

观点：**新加坡的"NVIDIA 营收 15%"数字是把双刃剑**——一方面证明新加坡是亚太 AI 中心，另一方面让美国对新加坡的"GPU 转运"嫌疑加强。2024 年开始美国调查新加坡是否将受管制 GPU 转售给中国实体，这是新加坡 AI 战略的真实地缘风险。

未来值得关注：美国对新加坡 GPU 出口管制是否收紧、SEA-LION 等本地项目能否获得稳定 GPU 供给、国家算力中心的硬件采购策略。`,
        singaporeRelevanceJa: `NVIDIA はシンガポール の AI 戦略における**「算力のボトルネック」**――支援でもあり地政学的リスクでもあります。

「7つの伝導レバー」の中で：

- **レバー1（インフラストラクチャ）**：算力の物理的ベース
- **レバー6（外交）**：米中算力規制の中でどう立ち位置を定めるか

見方：**シンガポール の「NVIDIA 営収の 15%」という数字は両刃の剣です**――一方ではシンガポール がアジア太平洋 AI センターであることを証明していますが、他方ではシンガポール の「GPU 転送」疑惑を強めています。2024 年から米国はシンガポール が受規制 GPU を中国企業に転売していないか調査しており、これはシンガポール の AI 戦略における真の地政学的リスクです。

今後注視する価値：米国のシンガポール への GPU 輸出規制がさらに厳しくなるかどうか、SEA-LION などの現地プロジェクトが安定した GPU 供給を得られるかどうか、国家算力センターのハードウェア調達戦略。`,
        singaporeRelevanceEn: `In Singapore's AI strategy, NVIDIA is the **"compute chokepoint"** — both an enabler and a geopolitical risk.

In the "seven transmission levers" framework:

- **Lever 1 (infrastructure)**: the physical foundation of compute
- **Lever 6 (international)**: how to position itself amid US–China compute controls

A take: **Singapore's "15% of NVIDIA revenue" figure is a double-edged sword** — on one hand it proves Singapore is an APAC AI hub; on the other it sharpens US suspicions of "GPU rerouting" via Singapore. Starting in 2024 the US has investigated whether Singapore is reselling controlled GPUs to Chinese entities — a real geopolitical risk for Singapore's AI strategy.

Worth watching: whether US GPU export controls on Singapore will tighten, whether local projects like SEA-LION can secure stable GPU supply, and the hardware procurement strategy of the national compute centre.`,
        milestones: [
          {
            date: '2023',
            title: 'NVIDIA 新加坡相关营收占全球 15%',
            titleJa: 'NVIDIA シンガポール関連営収はグローバル営収の 15%',
            titleEn: 'Singapore-billed revenue reaches ~15% of NVIDIA global revenue',
          },
          {
            date: '2024',
            title: '美国调查新加坡 GPU 转运嫌疑',
            titleJa: 'アメリカはシンガポールの GPU 積替輸送に関する疑いを調査',
            titleEn: 'US investigates suspected GPU rerouting via Singapore',
          },
        ],
        relatedLeverNumbers: [1, 6],
        relatedEntityIds: ['ai-singapore', 'sea-lion', 'aws', 'a-star'],
        sources: [{ label: 'NVIDIA', labelEn: 'NVIDIA', url: 'https://www.nvidia.com/' }],
        updated: '2026-05-02',
      },
      {
        id: 'sony-research',
        name: 'Sony Research',
        nameEn: 'Sony Research',
        description: 'AI 技术联合研发',
        descriptionJa: 'AI テクノロジーの共同開発',
        descriptionEn: 'Joint AI technology R&D',
        entityType: 'partner',
        status: 'active',
        summary:
          'Sony Research 在新加坡设有研究存在，主要覆盖游戏 AI、内容生成、传感器 AI、机器人 AI 等 Sony 集团相关方向。规模小于 Google DeepMind / MSR Asia，但是日本 AI 在新加坡的代表存在。',
        summaryJa:
          'Sony Research はシンガポールに研究拠点を持ち、主にゲーム AI、コンテンツ生成、センサー AI、ロボット AI など Sony グループ関連の分野をカバーしています。Google DeepMind / MSR Asia より規模は小さいですが、シンガポール における日本 AI の代表的な存在です。',
        summaryEn:
          'Sony Research has a research presence in Singapore, mainly covering game AI, content generation, sensor AI, and robotics AI — directions tied to the Sony group. Smaller in scale than Google DeepMind / MSR Asia, but a representative presence of Japanese AI in Singapore.',
        whatItIs: `Sony Research 在新加坡的合作方向：

- **游戏 AI**：与 SUTD、本地游戏开发者合作
- **内容生成**：图像 / 音乐 / 视频生成
- **传感器 + AI**：自动驾驶、机器人感知

合作模式偏轻——以联合项目和小规模团队为主，不像 Google DeepMind 是独立大型实验室。`,
        whatItIsJa: `Sony Research のシンガポール での協力方向：

- **ゲーム AI**：SUTD、現地ゲーム開発者との協力
- **コンテンツ生成**：画像・音楽・ビデオ生成
- **センサー + AI**：自動運転、ロボット知覚

協力モデルはライト――共同プロジェクトと小規模チームが主で、Google DeepMind のような独立した大型ラボではありません。`,
        whatItIsEn: `Sony Research's collaboration directions in Singapore:

- **Game AI**: working with SUTD and local game developers
- **Content generation**: image / music / video generation
- **Sensors + AI**: autonomous driving and robotic perception

The collaboration model is light-touch — mostly joint projects and small teams, not a standalone large lab like Google DeepMind.`,
        aiRelevance: `Sony Research 在新加坡的存在象征意义大于实际研究产出——它代表"日本 AI 也在新加坡有点位"，让新加坡的国际 AI 合作组合更平衡（不只美中）。`,
        aiRelevanceJa: `Sony Research のシンガポール での存在は象徴的意義が実際の研究産出よりも大きいです――これは「日本の AI もシンガポール に存在している」を代表しており、シンガポール の国際 AI 協力の組み合わせをより均衡に見せます（米国と中国だけではありません）。`,
        aiRelevanceEn: `Sony Research's presence in Singapore is more symbolic than substantive in research output — it signals that "Japanese AI also has a foothold in Singapore", giving Singapore's international AI partnership mix more balance (not just US–China).`,
        singaporeRelevance: `Sony 入驻让新加坡 AI 合作矩阵增加日本元素——美国（Google、Microsoft）、中国（商汤经 NTU、阿里）、英国（DeepMind 全球）、日本（Sony）都有存在。

在「七条传导杠杆」里：

- **杠杆 6（外交）**：增加合作伙伴多样性

观点：Sony 规模虽小，但它对"新加坡国际化叙事"是必要的拼图。`,
        singaporeRelevanceJa: `Sony の進出により、シンガポール の AI 協力マトリックスに日本要素が追加されました――米国（Google、Microsoft）、中国（商汤が NTU 経由、アリババ）、英国（DeepMind グローバル）、日本（Sony）がすべて存在しています。

「7つの伝導レバー」の中で：

- **レバー6（外交）**：パートナーの多様性を増加

見方：Sony のスケールは小さいですが、「シンガポール の国際化ナラティブ」にとって必要なパズルのピースです。`,
        singaporeRelevanceEn: `Sony's entry adds a Japanese element to Singapore's AI partnership matrix — the US (Google, Microsoft), China (SenseTime via NTU, Alibaba), the UK (DeepMind globally), and Japan (Sony) are all present.

In the "seven transmission levers" framework:

- **Lever 6 (international)**: adds partner diversity

A take: Sony is small in scale, but it is a necessary piece of the puzzle for Singapore's "internationalisation narrative".`,
        milestones: [],
        relatedLeverNumbers: [6],
        relatedEntityIds: ['google-deepmind', 'microsoft-research-asia'],
        sources: [{ label: 'Sony AI', labelEn: 'Sony AI', url: 'https://ai.sony/' }],
        updated: '2026-05-02',
      },
      {
        id: 'alibaba-cloud',
        name: 'Alibaba Cloud',
        nameEn: 'Alibaba Cloud',
        description: '云计算与 AI 平台合作',
        descriptionJa: 'クラウドコンピューティングと AI プラットフォームの協力',
        descriptionEn: 'Cloud computing and AI platform partnership',
        entityType: 'partner',
        status: 'active',
        scale: '新加坡是阿里云东南亚总部所在地',
        scaleJa: 'シンガポールはアリババクラウドの東南アジア本部所在地',
        scaleEn: "Singapore is Alibaba Cloud's Southeast Asian HQ",
        summary:
          '阿里云（Alibaba Cloud）的东南亚总部在新加坡，提供云计算和 AI 服务。它是中国 AI 在新加坡的主要代表力量之一，与 AWS / Azure / Google Cloud 形成"四大云"竞争格局。',
        summaryJa:
          'Alibaba Cloud（アリババクラウド）の東南アジア本部はシンガポールに位置し、クラウドコンピューティングと AI サービスを提供しています。これは中国の AI がシンガポール で代表的な力を有する企業の一つであり、AWS / Azure / Google Cloud と 「四大クラウド」 の競争構図を形成しています。',
        summaryEn:
          'Alibaba Cloud has its Southeast Asian headquarters in Singapore, providing cloud computing and AI services. It is one of the principal representatives of Chinese AI in Singapore, competing with AWS / Azure / Google Cloud in a "Big Four cloud" dynamic.',
        whatItIs: `阿里云在新加坡：

- **数据中心**：东南亚多个 region
- **AI 服务**：通义千问 LLM、机器学习平台 PAI 等
- **本地客户**：本地华人企业、东南亚跨境电商
- **合规挑战**：在 PDPA + 美国对中国云服务管控双重压力下运营

阿里达摩院与 NTU 等高校也有研究合作，但规模和深度不如 Google DeepMind / MSR Asia。`,
        whatItIsJa: `アリババクラウドはシンガポール で：

- **データセンター**：東南アジア複数の region
- **AI サービス**：通義千問 LLM、機械学習プラットフォーム PAI など
- **現地顧客**：現地中華系企業、東南アジアのクロスボーダーイーコマース
- **規制課題**：PDPA + 米国による中国クラウドサービスへのコントロール双方の圧力下で運営

アリババダモ院と NTU などの大学との研究協力もありますが、規模と深さは Google DeepMind・MSR Asia に及びません。`,
        whatItIsEn: `Alibaba Cloud in Singapore:

- **Data centres**: multiple Southeast Asian regions
- **AI services**: Qwen LLM, the PAI machine-learning platform, and others
- **Local customers**: ethnic-Chinese local enterprises and Southeast Asian cross-border e-commerce
- **Compliance challenges**: operating under the dual pressure of PDPA and US controls on Chinese cloud services

Alibaba's DAMO Academy also has research collaborations with NTU and other universities, though smaller in scale and depth than Google DeepMind / MSR Asia.`,
        aiRelevance: `阿里云让新加坡 AI 生态有"中国 AI 模型选项"——通义千问可以是 Bedrock 之外的选择。但中美 AI 地缘紧张让本地企业用阿里云做 AI 时需要考虑政策风险。

LLM 层面，通义千问的中文能力强于 SEA-LION，但东南亚小语种能力不如 SEA-LION——形成微妙的差异化。`,
        aiRelevanceJa: `アリババクラウドはシンガポール の AI エコシステムに「中国 AI モデルオプション」をもたらします――通義千問は Bedrock の外部選択肢になることができます。しかし米中 AI 地政学的緊張により、現地企業がアリババクラウドを使って AI をする際にはポリシーリスクを検討する必要があります。

LLM レベルでは、通義千問の中国語能力は SEA-LION より優れていますが、東南アジアの小言語能力は SEA-LION より劣ります――微妙な差別化を形成しています。`,
        aiRelevanceEn: `Alibaba Cloud gives Singapore's AI ecosystem a "Chinese AI model option" — Qwen can be an alternative to Bedrock. But US–China AI geopolitical tensions mean local enterprises using Alibaba Cloud for AI must weigh policy risk.

At the LLM level, Qwen's Chinese-language capability outperforms SEA-LION, while its smaller-language capabilities for Southeast Asia trail SEA-LION — yielding a subtle differentiation.`,
        singaporeRelevance: `阿里云在新加坡是**"中美平衡"叙事的真实考验**。

在「七条传导杠杆」里：

- **杠杆 1（基础设施）**：云算力的"非美国选项"
- **杠杆 6（外交）**：体现新加坡对中国 AI 力量的开放

观点：**新加坡能否长期容纳"美国 + 中国 AI 公司同时在场"是它"中立"叙事的真实考验**。如果美国施压收紧（如对 NVIDIA GPU 转运的调查），新加坡如何应对将定义其 AI 战略的根本走向。

可观察：阿里云在新加坡的实际市场份额、本地企业用阿里 vs 用 AWS 的比例变化、通义千问 vs SEA-LION 的协作 / 竞争。`,
        singaporeRelevanceJa: `アリババクラウドはシンガポール では「米中バランス」ナラティブの真の試験です。

「7つの伝導レバー」の中で：

- **レバー1（インフラストラクチャ）**：クラウド算力の「非米国オプション」
- **レバー6（外交）**：中国 AI 力へのシンガポール のオープンさを具現化

見方：**シンガポール が長期的に「米国 + 中国 AI 企業が同時に存在」を容認できるかが、その「中立」ナラティブの真の試験です**。米国が圧力をかけて制限する場合（NVIDIA GPU 転送調査など）、シンガポール がどう対応するかはその AI 戦略の根本的な方向性を決定します。

観察可能：アリババクラウドのシンガポール での実際の市場シェア、現地企業がアリババ vs AWS を使う比率の変化、通義千問 vs SEA-LION の協力・競争。`,
        singaporeRelevanceEn: `Alibaba Cloud in Singapore is **a real test of the "US–China balance" narrative**.

In the "seven transmission levers" framework:

- **Lever 1 (infrastructure)**: a "non-US option" for cloud compute
- **Lever 6 (international)**: signals Singapore's openness to Chinese AI players

A take: **whether Singapore can sustainably host "US and Chinese AI companies on stage at the same time" is the real test of its "neutrality" narrative**. If US pressure tightens (e.g. the investigation into NVIDIA GPU rerouting), how Singapore responds will define the fundamental direction of its AI strategy.

Worth watching: Alibaba Cloud's actual market share in Singapore, shifts in the ratio of local enterprises using Alibaba vs AWS, and the cooperation / competition between Qwen and SEA-LION.`,
        milestones: [],
        relatedLeverNumbers: [1, 6],
        relatedEntityIds: ['aws', 'sea-lion'],
        sources: [{ label: 'Alibaba Cloud', labelEn: 'Alibaba Cloud', url: 'https://www.alibabacloud.com/' }],
        updated: '2026-05-02',
      },
    ],
  },
];

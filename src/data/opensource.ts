export const seaLionStats = {
  totalModels: 56,
  totalDownloads: 27988,
  totalLikes: 278,
  topModel: 'Gemma-SEA-LION-v4-27B-IT',
  topModelDownloads: 5034,
  dataSource: 'HuggingFace API',
  dataDate: '2026-08-15',
  huggingfaceUrl: 'https://huggingface.co/aisingapore',
};

export interface SeaLionVersion {
  version: string;
  models: number;
  downloads: number;
  likes: number;
  period: string;
}

export const seaLionVersions: SeaLionVersion[] = [
  { version: 'v4', models: 13, downloads: 15267, likes: 50, period: '2025-2026' },
  { version: 'v3.5', models: 6, downloads: 2853, likes: 15, period: '2025' },
  { version: 'v3', models: 11, downloads: 5797, likes: 43, period: '2024-2025' },
  { version: 'v2', models: 4, downloads: 1428, likes: 26, period: '2024' },
  { version: 'v1', models: 6, downloads: 2157, likes: 104, period: '2023-2024' },
];

export const modelComparison =
  '作为对比：Meta Llama 3 单模型下载量达千万级，Mistral 和 Qwen 系列在百万级。SEA-LION 的定位是东南亚多语言市场，用户群体较小但增长趋势明显（v4 占总下载量 55%）。';

export const modelComparisonEn =
  "For context: Meta's Llama 3 sees tens of millions of downloads per model, while Mistral and Qwen sit in the millions. SEA-LION targets the Southeast Asian multilingual market, with a smaller user base but clear growth (v4 already accounts for 55% of total downloads).";

export const modelComparisonJa =
  '比較すると、Meta Llama 3 は単一モデルで数千万級のダウンロードがあり、Mistral と Qwen 系列は百万級です。SEA-LION は東南アジアの多言語市場に焦点を置いており、ユーザー規模は小さいものの成長は明確です（v4 が総ダウンロードの 55% を占めています）。';

export const modelComparisonKo =
  '비교하자면 Meta Llama 3는 단일 모델 다운로드가 수천만 회 수준이고, Mistral과 Qwen 계열은 백만 회 수준입니다. SEA-LION은 동남아 다국어 시장을 겨냥하므로 사용자 규모는 작지만 성장세는 분명합니다(v4가 전체 다운로드의 55%를 차지).';

export interface SeaGuardModel {
  name: string;
  downloads: number;
  likes: number;
  type: string;
  typeEn?: string;
}

export const seaGuardModels: SeaGuardModel[] = [
  {
    name: 'Gemma-SEA-Guard-12B-2602',
    downloads: 191,
    likes: 191,
    type: 'Image-Text-to-Text',
    typeEn: 'Image-Text-to-Text',
  },
  {
    name: 'Qwen-SEA-Guard-8B-2602',
    downloads: 108,
    likes: 108,
    type: 'Image-Text-to-Text',
    typeEn: 'Image-Text-to-Text',
  },
  {
    name: 'Qwen-SEA-Guard-4B-2602',
    downloads: 24,
    likes: 24,
    type: 'Image-Text-to-Text',
    typeEn: 'Image-Text-to-Text',
  },
  {
    name: 'Llama-SEA-Guard-8B-2602',
    downloads: 48,
    likes: 48,
    type: 'Text Generation',
    typeEn: 'Text Generation',
  },
];

export const seaGuardStats = {
  totalModels: 4,
  totalDownloads: 371,
  note: '2026 年 2 月发布，尚处于早期阶段',
  noteKo: '2026년 2월 발표, 초기 단계',
  noteJa: '2026年2月にリリース、まだ早期段階にあります',
  noteEn: 'Released in February 2026; still at an early stage',
};

export const aiVerify = {
  name: 'AI Verify',
  description: '全球首个 AI 治理测试框架',
  descriptionKo: '글로벌 첫 번째 AI 거버넌스 테스팅 프레임워크',
  descriptionJa: '世界初のAI治理テストフレームワーク',
  descriptionEn: "The world's first AI governance testing framework",
  openSourceDate: '2023-06',
  githubUrl: 'https://github.com/aiverify-foundation/aiverify',
  features: [
    '测试 AI 系统是否符合 11 项国际公认治理原则',
    '覆盖传统 AI + 生成式 AI（2025 年 5 月新增）',
    '对齐 EU、OECD、US 治理框架',
  ],
  featuresEn: [
    'Tests AI systems against 11 internationally recognised governance principles',
    'Covers both classical AI and generative AI (added May 2025)',
    'Aligned with EU, OECD and US governance frameworks',
  ],
  featuresJa: [
    'AI システムが国際的に認められた 11 のガバナンス原則に沿っているかをテスト',
    '従来型 AI と生成 AI の両方をカバー（2025 年 5 月追加）',
    'EU、OECD、米国のガバナンス枠組みに整合',
  ],
  featuresKo: [
    'AI 시스템이 국제적으로 인정된 11개 거버넌스 원칙에 부합하는지 테스트',
    '전통적 AI와 생성형 AI를 모두 포함(2025년 5월 추가)',
    'EU, OECD, 미국 거버넌스 프레임워크와 정렬',
  ],
  partners: [
    'AWS',
    'DBS Bank',
    'Google',
    'Meta',
    'Microsoft',
    'Singapore Airlines',
    'NCS/Singtel',
    'Standard Chartered',
  ],
};

export interface OfficialOpenSourceProject {
  id: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  owner: string;
  ownerEn?: string;
  ownerJa?: string;
  ownerKo?: string;
  category: string;
  categoryEn?: string;
  categoryJa?: string;
  categoryKo?: string;
  status: string;
  statusEn?: string;
  statusJa?: string;
  statusKo?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
  stars: number | null;
  language: string;
  url: string | null;
  websiteUrl?: string;
  docsUrl?: string;
  license?: string;
  licenseEn?: string;
  licenseJa?: string;
  licenseKo?: string;
  founded?: string;
  updated?: string;
  ecosystemId?: string;
  metrics?: OpenSourceMetric[];
  summary: string;
  summaryEn: string;
  summaryJa?: string;
  summaryKo?: string;
  whatItIs: string;
  whatItIsEn: string;
  whatItIsJa?: string;
  whatItIsKo?: string;
  aiRelevance: string;
  aiRelevanceEn: string;
  aiRelevanceJa?: string;
  aiRelevanceKo?: string;
  singaporeRelevance: string;
  singaporeRelevanceEn: string;
  singaporeRelevanceJa?: string;
  singaporeRelevanceKo?: string;
  milestones?: OpenSourceMilestone[];
  resources: OpenSourceResource[];
}

export interface OpenSourceMetric {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  valueKo?: string;
  note?: string;
  noteEn?: string;
  noteJa?: string;
  noteKo?: string;
}

export interface OpenSourceMilestone {
  date: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
}

export interface OpenSourceResource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  url: string;
  kind: 'github' | 'website' | 'docs' | 'model' | 'paper' | 'demo' | 'ecosystem';
}

export const openSourceProjects: OfficialOpenSourceProject[] = [
  {
    id: 'ai-verify',
    name: 'AI Verify',
    nameEn: 'AI Verify',
    owner: 'AI Verify Foundation / IMDA',
    ownerEn: 'AI Verify Foundation / IMDA',
    category: '治理测试框架',
    categoryKo: '거버넌스 테스팅 프레임워크',
    categoryJa: 'ガバナンステストフレームワーク',
    categoryEn: 'Governance testing framework',
    status: '开源运营中',
    statusKo: '오픈소스 운영 중',
    statusJa: 'オープンソース運営中',
    statusEn: 'Active open source',
    description: '把 AI 治理原则转成可运行测试的开源框架',
    descriptionKo: 'AI 거버넌스 원칙을 실행 가능한 테스트의 오픈소스 프레임워크로 변환',
    descriptionJa: 'AI治理原則を実行可能なテストのオープンソースフレームワークに変換する',
    descriptionEn: 'An open-source framework that turns AI governance principles into executable tests',
    stars: 88,
    language: 'TypeScript',
    url: 'https://github.com/aiverify-foundation/aiverify',
    websiteUrl: 'https://aiverifyfoundation.sg/',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2022-05',
    updated: '2026-05-04',
    ecosystemId: 'ai-verify-foundation',
    metrics: [
      {
        label: '开源时间',
        labelKo: '오픈소스 타임라인',
        labelJa: 'オープンソース化の時期',
        labelEn: 'Open-sourced',
        value: '2023-06',
      },
      {
        label: '评估维度',
        labelKo: '평가 차원',
        labelJa: '評価ディメンション',
        labelEn: 'Assessment dimensions',
        value: '11',
      },
      {
        label: '生态成员',
        labelKo: '생태 멤버',
        labelJa: 'エコシステムメンバー',
        labelEn: 'Ecosystem members',
        value: '100+',
      },
    ],
    summary:
      'AI Verify 是新加坡 AI 治理路线的核心产品：它不只写原则，而是把透明度、公平性、稳健性、隐私、问责等治理要求做成可运行的测试框架和报告工具。',
    summaryKo:
      'AI Verify는 싱가포르 AI 거버넌스 로드맵의 핵심 제품입니다. 이것은 단순히 원칙을 기록하는 것이 아니라, 투명성, 공정성, 견고성, 개인정보 보호, 책임성 등의 거버넌스 요구 사항을 실행 가능한 테스팅 프레임워크와 보고 도구로 변환합니다.',
    summaryJa:
      'AI Verify はシンガポールのAI治理ロードマップの中核製品です：原則を書くだけではなく、透明性、公平性、ロバスト性、プライバシー、説明責任などの治理要件を実行可能なテストフレームワークおよびレポートツールにしました。',
    summaryEn:
      'AI Verify is the core product of Singapore’s AI governance strategy: instead of only publishing principles, it turns requirements such as transparency, fairness, robustness, privacy, and accountability into runnable tests and reporting tools.',
    whatItIs: `AI Verify 由两层组成：一层是开源软件工具包，企业可以用它测试传统 AI 和生成式 AI 系统；另一层是 AI Verify Foundation，负责把工具、插件和成员生态持续推进。

它的页面价值在于把抽象治理变成工程对象。一个企业不是只回答"我们是否负责任地使用 AI"，而是可以用测试、问卷和报告说明自己的系统在哪些维度达标、哪些维度需要补强。`,
    whatItIsKo: `AI Verify는 두 개의 계층으로 구성됩니다. 하나는 오픈소스 소프트웨어 도구 모음으로, 기업이 이를 사용하여 전통 AI 및 생성형 AI 시스템을 테스트할 수 있습니다. 다른 하나는 AI Verify Foundation으로, 도구, 플러그인, 멤버 생태계의 지속적인 발전을 담당합니다.

이것의 가치는 추상적인 거버넌스를 엔지니어링 객체로 변환하는 데 있습니다. 기업은 단지 「우리가 책임감 있게 AI를 사용하는가」에만 답하는 것이 아니라, 테스트, 설문지, 보고서를 사용하여 자신의 시스템이 어떤 차원에서 기준을 충족하는지, 어떤 차원에서 보강이 필요한지를 설명할 수 있습니다.`,
    whatItIsJa: `AI Verify は2層で構成されています：第1層はオープンソースソフトウェアツールキットで、企業はそれを使用して従来のAIおよび生成AI システムをテストできます。第2層は AI Verify Foundation で、ツール、プラグイン、メンバーエコシステムの継続的な推進を担当しています。

そのページの価値は、抽象的な治理をエンジニアリングオブジェクトに変えることにあります。企業は単に「私たちはAIを責任を持って使用していますか」と答えるだけではなく、テスト、アンケート、レポートを使用して、自社システムがどの側面で基準を満たしており、どの側面で補強が必要かを説明できます。`,
    whatItIsEn: `AI Verify has two layers: an open-source software toolkit that enterprises can use to test classical and generative AI systems, and the AI Verify Foundation, which keeps the tooling, plugin ecosystem, and member network moving.

Its value is that it turns abstract governance into an engineering object. A company does not merely claim that it uses AI responsibly; it can use tests, questionnaires, and reports to show which dimensions are covered and where gaps remain.`,
    aiRelevance: `AI Verify 的关键创新是把"治理"从文档推向工具链。对企业来说，AI 风险不再只是法务或合规部门的抽象话题，而是可以纳入开发、评估和上线流程的检查项。

这也是新加坡在 AI 治理上的差异化：不直接走强制立法先行，而是先做可验证、可复用、可国际化的工具。`,
    aiRelevanceKo: `AI Verify의 핵심 혁신은 「거버넌스」를 문서에서 도구 체인으로 옮기는 것입니다. 기업 입장에서는 AI 위험이 더 이상 법무 또는 컴플라이언스 부서의 추상적인 주제가 아니라, 개발, 평가, 런칭 프로세스의 검사 항목으로 통합될 수 있습니다.

이는 또한 AI 거버넌스에서 싱가포르의 차별화 전략입니다. 강제 입법을 먼저 추진하지 않고, 대신 먼저 검증 가능하고 재사용 가능하며 국제화 가능한 도구를 만듭니다.`,
    aiRelevanceJa: `AI Verify の重要なイノベーションは、「治理」をドキュメントからツールチェーンへと推し進めることです。企業にとって、AIリスクはもはや法務またはコンプライアンス部門の抽象的なトピックではなく、開発、評価、本番展開フロー内にチェック項目として組み込まれるようになりました。

これもシンガポールがAI治理において差別化を図る方法です：強制的に法律制定を先行させるのではなく、まず検証可能で、再利用可能で、国際化可能なツールを作ることなのです。`,
    aiRelevanceEn: `AI Verify’s key innovation is moving "governance" from documents into the toolchain. For enterprises, AI risk becomes less of an abstract legal or compliance topic and more of a set of checks that can fit into development, evaluation, and launch workflows.

That is Singapore’s governance differentiation: rather than leading with hard law, it builds verifiable, reusable, internationally usable tooling first.`,
    singaporeRelevance: `AI Verify 是新加坡"标准外交"最具体的载体。它把 IMDA 的治理框架做成全球企业都能下载、部署、扩展的开源工具，降低了其他国家和企业采纳新加坡框架的政治阻力。

对 sgai.md 来说，它应被当作一个长期追踪对象：工具演进、Foundation 成员参与深度、生成式 AI 测试模块、与 ISO / NIST / EU 合规体系的对齐，都会影响新加坡在 AI 治理中的话语权。`,
    singaporeRelevanceKo: `AI Verify는 싱가포르의 「표준 외교」의 가장 구체적인 매개체입니다. IMDA의 거버넌스 프레임워크를 전 세계 기업이 다운로드하고 배포하고 확장할 수 있는 오픈소스 도구로 만들어, 다른 국가와 기업이 싱가포르 프레임워크를 채택하는 데 있어 정치적 장벽을 낮췄습니다.

sgai.md 관점에서 이것은 장기적인 추적 대상으로 고려되어야 합니다. 도구 진화, Foundation 멤버 참여 깊이, 생성형 AI 테스팅 모듈, ISO / NIST / EU 컴플라이언스 체계와의 정렬이 모두 싱가포르의 AI 거버넌스 담론권에 영향을 미칠 것입니다.`,
    singaporeRelevanceJa: `AI Verify はシンガポール「標準外交」の最も具体的な担体です。IMDA の治理フレームワークを、世界中の企業がダウンロード、デプロイ、拡張できるオープンソースツールにしました。これにより、他国および企業がシンガポールフレームワークを採用する際の政治的障壁を低減しました。

sgai.md にとって、これは長期的な追跡対象となるべきです：ツール進化、Foundation メンバーの参加深度、生成AI テストモジュール、ISO / NIST / EU コンプライアンス体系との整合など、すべてがシンガポールのAI治理における発言力に影響を与えます。`,
    singaporeRelevanceEn: `AI Verify is the most concrete vehicle for Singapore’s "standards diplomacy." It converts IMDA’s governance framework into open-source tooling that global enterprises can download, deploy, and extend, lowering the political friction of adopting a Singapore-originated framework.

For sgai.md, it should be tracked as a long-running entity: tooling evolution, depth of Foundation participation, generative-AI testing modules, and alignment with ISO / NIST / EU compliance systems all shape Singapore’s influence in AI governance.`,
    milestones: [
      {
        date: '2022-05',
        title: 'AI Verify 测试框架发布',
        titleKo: 'AI Verify 테스팅 프레임워크 발표',
        titleJa: 'AI Verify テストフレームワークが発行された',
        titleEn: 'AI Verify testing framework released',
      },
      {
        date: '2023-06',
        title: 'AI Verify 开源并成立基金会',
        titleKo: 'AI Verify 오픈소스 및 재단 설립',
        titleJa: 'AI Verify オープンソース化およびファンデーション設立',
        titleEn: 'AI Verify open-sourced and Foundation launched',
      },
      {
        date: '2024-05',
        title: '扩展到生成式 AI 测试',
        titleKo: '생성형 AI 테스팅으로 확대',
        titleJa: '生成AI テストへの拡張',
        titleEn: 'Expanded into generative-AI testing',
      },
    ],
    resources: [
      {
        label: 'AI Verify GitHub',
        labelEn: 'AI Verify on GitHub',
        url: 'https://github.com/aiverify-foundation/aiverify',
        kind: 'github',
      },
      {
        label: 'AI Verify Foundation 官网',
        labelKo: 'AI Verify Foundation 공식 웹사이트',
        labelJa: 'AI Verify Foundation 公式ウェブサイト',
        labelEn: 'AI Verify Foundation official site',
        url: 'https://aiverifyfoundation.sg/',
        kind: 'website',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 아카이브',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/ai-verify-foundation/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'sea-lion',
    name: 'SEA-LION',
    nameEn: 'SEA-LION',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '区域多语言大模型',
    categoryKo: '지역 다국어 대규모 언어모델',
    categoryJa: '地域多言語大規模言語モデル',
    categoryEn: 'Regional multilingual LLM',
    status: '持续迭代',
    statusKo: '지속적인 반복',
    statusJa: '継続的反復',
    statusEn: 'Actively iterated',
    description: '面向东南亚语言和文化语境的大模型家族',
    descriptionKo: '동남아 언어 및 문화 맥락을 대상으로 하는 대규모 언어모델 가족',
    descriptionJa: '東南アジアの言語および文化的文脈に向けた大規模言語モデルファミリー',
    descriptionEn: 'A large-model family for Southeast Asian languages and cultural contexts',
    stars: 421,
    language: 'Python / Models',
    url: 'https://github.com/aisingapore/sealion',
    websiteUrl: 'https://sea-lion.ai/',
    docsUrl: 'https://huggingface.co/aisingapore',
    license: '按模型底座协议不同',
    licenseKo: '모델 기반 협약에 따라',
    licenseJa: 'モデル基盤プロトコルの違いに基づいて',
    licenseEn: 'Varies by base model',
    founded: '2023-12',
    updated: '2026-05-04',
    ecosystemId: 'sea-lion',
    metrics: [
      {
        label: '模型数',
        labelKo: '모델 개수',
        labelJa: 'モデル数',
        labelEn: 'Models tracked',
        value: `${seaLionStats.totalModels}`,
      },
      { label: '主要语言', labelKo: '주요 언어', labelJa: '主要言語', labelEn: 'Core languages', value: '11' },
      {
        label: '最新主线',
        labelKo: '최신 주요 버전',
        labelJa: '最新メインライン',
        labelEn: 'Latest mainline',
        value: 'v4',
      },
    ],
    summary:
      'SEA-LION 是 AI Singapore 的旗舰开源大模型家族，目标不是做另一个通用 GPT，而是补上东南亚语言、口音、文化语境在全球大模型中的空白。',
    summaryKo:
      'SEA-LION은 AI Singapore의 플래그십 오픈소스 대규모 언어모델 가족으로, 또 다른 범용 GPT를 만드는 것이 아니라 동남아 언어, 억양, 문화 맥락이 전 세계 대규모 언어모델에서 차지하는 공백을 메우는 것을 목표로 합니다.',
    summaryJa:
      'SEA-LION は AI Singapore の旗艦オープンソース大規模言語モデルファミリーであり、別の汎用 GPT を構築することが目標ではなく、東南アジア言語、アクセント、文化的文脈がグローバル大モデルに欠けている空白を埋めることが目標です。',
    summaryEn:
      'SEA-LION is AI Singapore’s flagship open-source LLM family. Its goal is not to build another general GPT, but to fill the gap for Southeast Asian languages, accents, and cultural contexts in global large models.',
    whatItIs: `SEA-LION 是一个模型家族，不是单个模型。它包含基础模型、指令模型、多模态模型、embedding 模型和面向安全的衍生模型，并通过 GitHub、Hugging Face 与 sea-lion.ai API 对外提供。

它的技术路线是区域化继续训练：在强底座上补充东南亚语言数据，让模型更懂马来语、印尼语、泰语、越南语、泰米尔语、缅甸语、高棉语等低资源语言。`,
    whatItIsKo: `SEA-LION은 단일 모델이 아닌 모델 가족입니다. 기초 모델, 지시 모델, 다중 모달 모델, Embedding 모델, 안전 지향 파생 모델을 포함하며, GitHub, Hugging Face, sea-lion.ai API를 통해 외부에 제공됩니다.

기술 경로는 지역화 지속 훈련입니다. 강력한 기반 위에 동남아 언어 데이터를 보충하여 모델이 말레이어, 인도네시아어, 태국어, 베트남어, 타밀어, 버마어, 크메르어 등 저자원 언어를 더 잘 이해하도록 합니다.`,
    whatItIsJa: `SEA-LION はモデルファミリーであり、単一のモデルではありません。基盤モデル、命令モデル、マルチモーダルモデル、埋め込みモデル、およびセキュリティ指向の派生モデルを含み、GitHub、Hugging Face、および sea-lion.ai API を通じて外部に提供されています。

その技術ロードマップは地域化継続訓練です：強固な基盤の上に東南アジア言語データを補充し、モデルがマレー語、インドネシア語、タイ語、ベトナム語、タミル語、ミャンマー語、クメール語などの低リソース言語をより理解するようにします。`,
    whatItIsEn: `SEA-LION is a model family, not a single model. It includes base models, instruction-tuned models, multimodal models, embedding models, and safety-oriented derivatives, exposed through GitHub, Hugging Face, and the sea-lion.ai API.

Its technical path is regional continued training: starting from strong base models, then adding Southeast Asian language data so the models better handle Malay, Indonesian, Thai, Vietnamese, Tamil, Burmese, Khmer, and other lower-resource languages.`,
    aiRelevance: `SEA-LION 代表"区域开源大模型"路线。它承认小国不可能和美国大厂比通用算力，但可以在语言区、文化区、政府和企业本地部署场景里做差异化。

这种路线对东南亚尤其重要：许多语言在通用模型训练语料里占比很低，模型看似会翻译，实际容易丢掉语气、实体、地名和本地常识。`,
    aiRelevanceKo: `SEA-LION은 「지역 오픈소스 대규모 언어모델」 경로를 대표합니다. 소국이 미국 대형사와 범용 컴퓨팅 파워를 비교할 수 없다는 점을 인정하면서도, 언어권, 문화권, 정부 및 기업의 로컬 배포 시나리오에서 차별화할 수 있습니다.

이 경로는 특히 동남아에 중요합니다. 많은 언어가 범용 모델 훈련 말뭉치에서 매우 낮은 비중을 차지하기 때문에, 모델이 번역할 수 있어 보이지만 실제로는 어조, 개체명, 지명, 로컬 상식을 잃기 쉽습니다.`,
    aiRelevanceJa: `SEA-LION は「地域オープンソース大規模言語モデル」戦略を代表しています。小国はアメリカの大企業と汎用計算能力で競争することは不可能であることを認めていますが、言語領域、文化領域、政府および企業のローカルデプロイメントシナリオで差別化できます。

この戦略は東南アジアにとって特に重要です：多くの言語は汎用モデルの訓練コーパスではごく低い割合を占めており、モデルは翻訳できているように見えても、実は語調、エンティティ、地名、ローカル知識を簡単に失ってしまいます。`,
    aiRelevanceEn: `SEA-LION represents the "regional open LLM" path. It accepts that a small country cannot out-compute US big tech on general capability, but can differentiate in language regions, cultural contexts, and local deployment needs for government and enterprise.

This matters in Southeast Asia because many languages are underrepresented in general-model corpora. Models may appear to translate them, yet still lose tone, entities, place names, and local commonsense.`,
    singaporeRelevance: `SEA-LION 是新加坡主权 AI 叙事最直观的技术产品。它让新加坡在 ASEAN 语境里不只是治理倡议者，也是基础模型供给者。

未来最值得看的是三件事：v4 / v5 是否能持续领先区域基准，政府和企业是否真的形成生产部署，SEA-LION 是否能吸引东南亚开发者一起贡献数据、评测和微调版本。`,
    singaporeRelevanceKo: `SEA-LION은 싱가포르의 주권 AI 서사 중 가장 직관적인 기술 제품입니다. 이것은 싱가포르를 ASEAN 맥락에서 단순한 거버넌스 주도자일 뿐만 아니라 기초 모델 공급자로도 위치시킵니다.

향후 가장 주목할 세 가지는 다음과 같습니다. v4 / v5가 지역 벤치마크를 지속적으로 선도할 수 있는지, 정부와 기업이 실제로 프로덕션 배포를 형성하는지, SEA-LION이 동남아 개발자들을 끌어들여 함께 데이터, 평가, 미세 조정 버전에 기여하도록 할 수 있는지입니다.`,
    singaporeRelevanceJa: `SEA-LION はシンガポール主権 AI ナラティブの最も直感的な技術製品です。これはシンガポールを ASEAN 文脈において、単なるガバナンス提唱者ではなく、基礎モデル供給者でもあるようにします。

今後最も注視する価値のある 3 つのことは次の通りです：v4 / v5 が地域ベンチマークにおいて継続的にリードできるかどうか、政府と企業が本当に生産展開を形成するかどうか、SEA-LION が東南アジア開発者を引き付けてデータ、評価、微調整版への貢献を一緒に行うかどうかです。`,
    singaporeRelevanceEn: `SEA-LION is the clearest technical product in Singapore’s sovereign-AI narrative. It lets Singapore appear in ASEAN not only as a governance convenor, but also as a provider of foundation-model infrastructure.

The questions to watch are whether v4 / v5 can keep leading regional benchmarks, whether government and enterprise production deployments materialise, and whether SEA-LION can attract Southeast Asian developers to contribute data, evaluations, and fine-tuned variants.`,
    milestones: [
      {
        date: '2023-12',
        title: 'SEA-LION v1 发布',
        titleKo: 'SEA-LION v1 출시',
        titleJa: 'SEA-LION v1 発表',
        titleEn: 'SEA-LION v1 released',
      },
      {
        date: '2024-12',
        title: 'SEA-LION v3 进入 Llama / Gemma 继续训练路线',
        titleKo: 'SEA-LION v3 Llama / Gemma 지속 훈련 경로로 진입',
        titleJa: 'SEA-LION v3 が Llama / Gemma 継続訓練ロードマップに進入',
        titleEn: 'SEA-LION v3 moves into the Llama / Gemma continued-training path',
      },
      {
        date: '2025-2026',
        title: 'v4、embedding、SEA-Guard 等衍生线展开',
        titleKo: 'v4, embedding, SEA-Guard 등 파생 선로 전개',
        titleJa: 'v4、embedding、SEA-Guard など派生ラインが展開',
        titleEn: 'v4, embeddings, SEA-Guard and derivative lines expand',
      },
    ],
    resources: [
      {
        label: 'SEA-LION GitHub',
        labelEn: 'SEA-LION on GitHub',
        url: 'https://github.com/aisingapore/sealion',
        kind: 'github',
      },
      {
        label: 'SEA-LION API / 官网',
        labelKo: 'SEA-LION API / 공식 웹사이트',
        labelJa: 'SEA-LION API / 公式サイト',
        labelEn: 'SEA-LION API / website',
        url: 'https://sea-lion.ai/',
        kind: 'website',
      },
      {
        label: 'AI Singapore Hugging Face',
        labelEn: 'AI Singapore on Hugging Face',
        url: seaLionStats.huggingfaceUrl,
        kind: 'model',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 아카이브',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/sea-lion/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'sea-guard',
    name: 'SEA-Guard',
    nameEn: 'SEA-Guard',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '区域安全护栏模型',
    categoryKo: '지역 안전 가이드레일 모델',
    categoryJa: '地域安全ガードレールモデル',
    categoryEn: 'Regional safety guardrail model',
    status: '早期发布',
    statusKo: '조기 출시',
    statusJa: '初期リリース',
    statusEn: 'Early release',
    description: '面向东南亚文化语境的安全分类与护栏模型',
    descriptionKo: '동남아시아 문화 맥락을 지향하는 안전 분류 및 가이드레일 모델',
    descriptionJa: '東南アジアの文化的文脈に対応したセキュリティ分類とガードレールモデル',
    descriptionEn: 'Safety classification and guardrail models grounded in Southeast Asian contexts',
    stars: null,
    language: 'Models',
    url: 'https://huggingface.co/collections/aisingapore/sea-guard',
    docsUrl: 'https://arxiv.org/abs/2602.01618',
    license: '按模型底座协议不同',
    licenseKo: '모델 기초 프로토콜에 따라 다름',
    licenseJa: 'モデル基盤プロトコルの違いに基づいて',
    licenseEn: 'Varies by base model',
    founded: '2026-02',
    updated: '2026-05-04',
    metrics: [
      {
        label: '模型数',
        labelKo: '모델 수',
        labelJa: 'モデル数',
        labelEn: 'Models',
        value: `${seaGuardStats.totalModels}`,
      },
      { label: '核心语言', labelKo: '핵심 언어', labelJa: 'コア言語', labelEn: 'Core languages', value: '8' },
      { label: '输出形态', labelKo: '출력 형태', labelJa: '出力形式', labelEn: 'Output', value: 'safe / unsafe' },
    ],
    summary:
      'SEA-Guard 是 SEA-LION 生态里的安全护栏线，重点解决通用安全模型对东南亚语言、宗教、族群和文化语境不敏感的问题。',
    summaryKo:
      'SEA-Guard는 SEA-LION 생태계 내 안전 가이드레일 선으로, 범용 안전 모델이 동남아시아 언어, 종교, 민족, 문화 맥락에 둔감한 문제를 해결하는 데 중점을 둡니다.',
    summaryJa:
      'SEA-Guard は、SEA-LION エコシステム内のセキュリティ・ガードレール線です。汎用セキュリティモデルが東南アジアの言語、宗教、民族、文化的文脈に対して十分に敏感でない問題の解決に焦点を当てています。',
    summaryEn:
      'SEA-Guard is the safety-guardrail line within the SEA-LION ecosystem, focused on the gap where generic safety models miss Southeast Asian languages, religions, ethnic contexts, and cultural norms.',
    whatItIs: `SEA-Guard 目前是一组安全分类模型。它把用户请求或模型回复判定为 safe / unsafe，并支持文本和部分图文场景。

它不是替代人类审核的万能安全系统，而是给东南亚应用开发者一个更本地化的第一层护栏：在接入通用 LLM 或 SEA-LION 时，可以先用 SEA-Guard 做区域语境下的风险过滤。`,
    whatItIsKo: `SEA-Guard는 현재 안전 분류 모델 세트입니다. 사용자 요청이나 모델 응답을 안전/위험으로 판정하며 텍스트와 일부 텍스트-이미지 시나리오를 지원합니다.

이것은 인간 심사를 대체하는 만능 안전 시스템이 아니라 동남아시아 애플리케이션 개발자에게 더 현지화된 첫 번째 계층 가이드레일을 제공합니다: 범용 LLM 또는 SEA-LION에 통합할 때 먼저 SEA-Guard를 사용하여 지역 맥락 내 위험 필터링을 수행할 수 있습니다.`,
    whatItIsJa: `SEA-Guard は現在、一連のセキュリティ分類モデルです。ユーザーリクエストまたはモデル応答を safe / unsafe として判定し、テキストと部分的なマルチメディアシナリオに対応しています。

これは人間によるレビューを置き換える万能なセキュリティシステムではなく、東南アジアのアプリケーション開発者に、より局所化された第一層のガードレールを提供するものです。汎用 LLM または SEA-LION を統合する際に、SEA-Guard を使用して地域的な文脈下でリスク・フィルタリングを行うことができます。`,
    whatItIsEn: `SEA-Guard is currently a collection of safety-classification models. It classifies user requests or model responses as safe / unsafe and supports text plus some vision-text scenarios.

It is not a universal replacement for human review. Its role is to give Southeast Asian application developers a more localized first guardrail: when they connect a general LLM or SEA-LION, SEA-Guard can screen risks through a regional-cultural lens.`,
    aiRelevance: `AI 安全模型往往在英文和美国文化语境上训练得最好。东南亚的现实问题更复杂：多宗教、多族群、多语言混用，本地冒犯和真实风险不一定出现在英文安全数据集里。

SEA-Guard 的意义在于把安全对齐也区域化。它让"本地语言模型"不只是会说本地话，也更懂本地边界。`,
    aiRelevanceKo: `AI 안전 모델은 보통 영어와 미국 문화 맥락에서 가장 잘 훈련됩니다. 동남아시아의 현실 문제는 더 복잡합니다: 다종교, 다민족, 다언어 혼용으로 인해 지역적 모욕과 실질적 위험이 반드시 영어 안전 데이터셋에 나타나지는 않습니다.

SEA-Guard의 의미는 안전 정렬을 지역화하는 것입니다. 이것은 「지역 언어 모델」이 단지 지역 언어를 말하는 것뿐 아니라 지역 경계를 더 잘 이해하도록 합니다.`,
    aiRelevanceJa: `AI セキュリティモデルは英語と米国の文化的文脈において最もよく訓練される傾向があります。東南アジアの現実的な問題はより複雑です：多宗教、多民族、多言語混用であり、ローカルな冒涜と実際のリスクは必ずしも英語セキュリティデータセットには現れません。

SEA-Guard の意義は、安全アライメントもまた地域化することにあります。これは「ローカル言語モデル」が単にローカル言語を話すだけではなく、ローカルな境界をより理解することを可能にします。`,
    aiRelevanceEn: `AI safety models are often strongest in English and US cultural contexts. Southeast Asia is more complex: multi-religious, multi-ethnic, and multilingual, with local harms and offence patterns that may not appear in English safety datasets.

SEA-Guard matters because it regionalizes safety alignment too. It asks a local language model not only to speak local languages, but also to understand local boundaries.`,
    singaporeRelevance: `SEA-Guard 把新加坡的两条 AI 路线接起来：SEA-LION 的区域模型路线，以及 AI Verify 的可信 AI 治理路线。

如果 SEA-LION 要进入政府、教育、医疗和金融等高敏场景，安全护栏不是附属品，而是落地前提。SEA-Guard 就是这个前提的模型层。`,
    singaporeRelevanceKo: `SEA-Guard는 싱가포르의 두 AI 경로를 연결합니다: SEA-LION의 지역 모델 경로와 AI Verify의 신뢰할 수 있는 AI 거버넌스 경로.

SEA-LION이 정부, 교육, 의료 및 금융 같은 고민감 시나리오에 진입하려면 안전 가이드레일은 부속 기능이 아니라 배포 전제입니다. SEA-Guard는 이 전제의 모델 계층입니다.`,
    singaporeRelevanceJa: `SEA-Guard は、シンガポールの 2つの AI ラインをつなぎます：SEA-LION の地域モデルラインと、AI Verify のトラスト AI ガバナンスラインです。

SEA-LION が政府、教育、医療、金融などの機密性の高いシナリオに進出する場合、セキュリティ・ガードレールは付属品ではなく、実装の前提条件です。SEA-Guard はこの前提条件のモデル層です。`,
    singaporeRelevanceEn: `SEA-Guard connects two Singapore AI lines: SEA-LION’s regional-model path and AI Verify’s trustworthy-AI governance path.

If SEA-LION is to enter sensitive sectors such as government, education, healthcare, and finance, safety guardrails are not a side feature; they are a deployment precondition. SEA-Guard is that precondition at the model layer.`,
    milestones: [
      {
        date: '2026-02',
        title: 'SEA-Guard 模型和论文发布',
        titleKo: 'SEA-Guard 모델 및 논문 공개',
        titleJa: 'SEA-Guard モデルと論文の公開',
        titleEn: 'SEA-Guard models and paper released',
      },
      {
        date: '2026-03',
        title: 'Hugging Face SEA-Guard collection 更新',
        titleKo: 'Hugging Face SEA-Guard 컬렉션 업데이트',
        titleJa: 'Hugging Face SEA-Guard コレクション更新',
        titleEn: 'Hugging Face SEA-Guard collection updated',
      },
    ],
    resources: [
      {
        label: 'SEA-Guard Hugging Face Collection',
        labelEn: 'SEA-Guard Hugging Face Collection',
        url: 'https://huggingface.co/collections/aisingapore/sea-guard',
        kind: 'model',
      },
      {
        label: 'SEA-Guard 论文',
        labelKo: 'SEA-Guard 논문',
        labelJa: 'SEA-Guard 論文',
        labelEn: 'SEA-Guard paper',
        url: 'https://arxiv.org/abs/2602.01618',
        kind: 'paper',
      },
      {
        label: 'Gemma-SEA-Guard 模型卡',
        labelKo: 'Gemma-SEA-Guard 모델 카드',
        labelJa: 'Gemma-SEA-Guard モデルカード',
        labelEn: 'Gemma-SEA-Guard model card',
        url: 'https://huggingface.co/aisingapore/Gemma-SEA-Guard-12B-2602',
        kind: 'model',
      },
    ],
  },
  {
    id: 'tagui',
    name: 'TagUI',
    nameEn: 'TagUI',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: 'RPA 自动化工具',
    categoryKo: 'RPA 자동화 도구',
    categoryJa: 'RPA 自動化ツール',
    categoryEn: 'RPA automation tool',
    status: '社区维护',
    statusKo: '커뮤니티 유지보수',
    statusJa: 'コミュニティメンテナンス',
    statusEn: 'Community maintained',
    description: '免费 RPA 网页/桌面自动化工具',
    descriptionKo: '무료 RPA 웹/데스크톱 자동화 도구',
    descriptionJa: '無料の RPA ウェブ/デスクトップ自動化ツール',
    descriptionEn: 'Free RPA tool for web and desktop automation',
    stars: 6323,
    language: 'JavaScript',
    url: 'https://github.com/aisingapore/TagUI',
    websiteUrl: 'https://tagui.readthedocs.io/',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2017',
    updated: '2026-05-04',
    ecosystemId: 'tagui',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '6.2k+' },
      {
        label: '脚本语言',
        labelKo: '스크립트 언어',
        labelJa: 'スクリプト言語',
        labelEn: 'Flow languages',
        value: '20+',
      },
      { label: '最新发布', labelKo: '최신 출시', labelJa: '最新リリース', labelEn: 'Latest release', value: '2022' },
    ],
    summary:
      'TagUI 是 AI Singapore 体系里最早走向全球的开源项目之一，用接近自然语言的 flow 脚本自动化网页、桌面和命令行任务。',
    summaryKo:
      'TagUI는 AI Singapore 시스템에서 가장 먼저 글로벌로 나아간 오픈소스 프로젝트 중 하나로, 자연어에 가까운 flow 스크립트를 사용하여 웹페이지, 데스크톱 및 명령행 작업을 자동화합니다.',
    summaryJa:
      'TagUI は AI Singapore の体系の中で最も早くグローバルに展開したオープンソースプロジェクトの一つで、自然言語に近いフロースクリプトを使用してウェブページ、デスクトップ、コマンドラインタスクを自動化します。',
    summaryEn:
      'TagUI is one of the earliest AI Singapore open-source projects to reach a global audience, using near-natural-language flow scripts to automate web, desktop, and command-line tasks.',
    whatItIs: `TagUI 的用户用简短脚本描述要执行的动作，例如打开网页、输入内容、点击按钮、抓取表格、读写 Excel。它支持网页自动化、桌面自动化、OCR 和命令行调用。

它的设计哲学很朴素：不要昂贵的企业 RPA 套件，不要复杂的可视化流程设计器，只用文本脚本把重复劳动自动化。`,
    whatItIsKo: `TagUI 사용자는 간단한 스크립트로 실행할 동작을 설명합니다. 예를 들어 웹페이지 열기, 내용 입력, 버튼 클릭, 표 스크래핑, Excel 읽고 쓰기 등이 있습니다. 웹페이지 자동화, 데스크톱 자동화, OCR 및 명령행 호출을 지원합니다.

설계 철학은 매우 소박합니다: 비싼 엔터프라이즈 RPA 스위트를 사용하지 않고, 복잡한 시각화 프로세스 설계자를 사용하지 않으며, 텍스트 스크립트로만 반복 작업을 자동화합니다.`,
    whatItIsJa: `TagUI のユーザーは短いスクリプトを使用して実行するアクションを記述します。例えば、Web ページを開く、コンテンツを入力する、ボタンをクリック、テーブルをスクレイプ、Excel を読み書きするなどです。Web ページ自動化、デスクトップ自動化、OCR、およびコマンドライン呼び出しをサポートしています。

その設計哲学は非常にシンプルです。高価なエンタープライズ RPA スイートを使用しないこと、複雑なビジュアルフロー設計ツールを使用しないこと。テキストスクリプトだけを使用して繰り返し作業を自動化します。`,
    whatItIsEn: `TagUI users describe actions with short scripts: open a webpage, type text, click a button, scrape a table, or read and write Excel. It supports web automation, desktop automation, OCR, and command-line invocation.

Its design philosophy is plain: no expensive enterprise RPA suite, no heavy visual process designer, just text scripts that automate repetitive work.`,
    aiRelevance: `TagUI 本身不是大模型项目，但它是 AI 落地的连接层。许多企业 AI 应用最后都要回到旧系统、网页后台、Excel 和邮件流程里，RPA 正是把模型能力接进旧流程的轻量方式。

在 Agent 时代，TagUI 还提供了一个历史参照：真正有用的自动化工具，必须能处理现实世界里不优雅、非 API 化的界面。`,
    aiRelevanceKo: `TagUI 자체는 대규모 언어 모델 프로젝트가 아니지만 AI 배포의 연결 계층입니다. 많은 엔터프라이즈 AI 애플리케이션은 결국 레거시 시스템, 웹 백엔드, Excel 및 이메일 워크플로로 돌아가야 하며, RPA는 모델 기능을 레거시 워크플로에 연결하는 경량 방식입니다.

Agent 시대에 TagUI는 역사적 참조를 제공합니다: 진정으로 유용한 자동화 도구는 현실 세계의 우아하지 않고 API 화되지 않은 인터페이스를 처리할 수 있어야 합니다.`,
    aiRelevanceJa: `TagUI 自体は大規模言語モデルプロジェクトではありませんが、AI 実装のコネクション層です。多くのエンタープライズ AI アプリケーションは、最終的に既存システム、ウェブ管理画面、Excel、メール処理フローに戻る必要があります。RPA は、モデルの能力を既存のプロセスに統合する軽量な方法です。

エージェント時代において、TagUI はもう一つの歴史的参照を提供します。本当に有用な自動化ツールは、現実世界における優雅でない、API化されていないインターフェースを処理できなければなりません。`,
    aiRelevanceEn: `TagUI is not itself a large-model project, but it is a deployment connector. Many enterprise AI applications eventually need to write back into legacy systems, admin webpages, Excel files, and email workflows; RPA is a lightweight way to wire model outputs into those old processes.

In the agent era, TagUI is also a useful historical reference: useful automation tools must handle the messy, non-API interfaces that exist in the real world.`,
    singaporeRelevance: `TagUI 证明新加坡的国家级 AI 机构可以产出全球开发者会真实使用的工具。它不靠政策叙事取胜，而靠足够简单、足够免费、足够跨平台。

它也为后来的 SEA-LION、PeekingDuck、SGNLP 提供了一个样板：小国开源不一定要拼最大规模，可以拼明确场景和低门槛。`,
    singaporeRelevanceKo: `TagUI는 싱가포르의 국가급 AI 기관이 전 세계 개발자가 실제로 사용할 도구를 생산할 수 있음을 증명합니다. 정책 내러티브로 승리하는 것이 아니라 충분히 간단하고, 충분히 무료이며, 충분히 크로스 플랫폼이기 때문입니다.

또한 이후 SEA-LION, PeekingDuck, SGNLP에 모델을 제공합니다: 소국 오픈소스는 반드시 최대 규모로 경쟁할 필요가 없으며, 명확한 사용 시나리오와 낮은 진입 장벽으로 경쟁할 수 있습니다.`,
    singaporeRelevanceJa: `TagUI はシンガポールの国家級 AI 機関がグローバルな開発者に実際に使用されるツールを生み出せることを証明しました。政策ナラティブで勝つのではなく、十分にシンプルで、十分に無料で、十分にクロスプラットフォーム対応であることで勝つものです。

また、後続の SEA-LION、PeekingDuck、SGNLP に対して一つのテンプレートを提供しました。小国のオープンソースは必ずしも最大規模で競う必要はなく、明確なユースケースと低いハードルで競うことができるのです。`,
    singaporeRelevanceEn: `TagUI proves that a national AI institution in Singapore can produce tooling that global developers genuinely use. It succeeds not through policy narrative, but by being simple, free, and cross-platform enough.

It also set a pattern for later projects such as SEA-LION, PeekingDuck, and SGNLP: small-country open source does not have to win by scale; it can win through a clear use case and low adoption friction.`,
    milestones: [
      {
        date: '2017',
        title: 'TagUI 发布',
        titleKo: 'TagUI 출시',
        titleJa: 'TagUI リリース',
        titleEn: 'TagUI released',
      },
      {
        date: '2018',
        title: 'AI Singapore 支持项目发展',
        titleKo: 'AI Singapore 프로젝트 개발 지원',
        titleJa: 'AI Singapore がプロジェクト開発をサポート',
        titleEn: 'AI Singapore supports the project',
      },
      {
        date: '2022',
        title: 'AI Singapore 停止官方维护，社区继续支持',
        titleKo: 'AI Singapore는 공식 유지보수를 중단했으며 커뮤니티가 계속 지원합니다.',
        titleJa: 'AI Singapore が公式メンテナンスを停止、コミュニティが継続サポート',
        titleEn: 'AI Singapore discontinues official maintenance; community support continues',
      },
    ],
    resources: [
      {
        label: 'TagUI GitHub',
        labelEn: 'TagUI on GitHub',
        url: 'https://github.com/aisingapore/TagUI',
        kind: 'github',
      },
      {
        label: 'TagUI 文档',
        labelKo: 'TagUI 문서',
        labelJa: 'TagUI ドキュメント',
        labelEn: 'TagUI documentation',
        url: 'https://tagui.readthedocs.io/',
        kind: 'docs',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 아카이브',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/tagui/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'peekingduck',
    name: 'PeekingDuck',
    nameEn: 'PeekingDuck',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '计算机视觉框架',
    categoryKo: '컴퓨터 비전 프레임워크',
    categoryJa: 'コンピュータビジョンフレームワーク',
    categoryEn: 'Computer vision framework',
    status: '维护放缓',
    statusKo: '유지보수 둔화',
    statusJa: 'メンテナンス放缓',
    statusEn: 'Maintenance slowed',
    description: '模块化计算机视觉推理框架',
    descriptionKo: '모듈식 컴퓨터 비전 추론 프레임워크',
    descriptionJa: 'モジュール化コンピュータビジョン推論フレームワーク',
    descriptionEn: 'Modular computer vision inference framework',
    stars: 179,
    language: 'Python',
    url: 'https://github.com/aisingapore/PeekingDuck',
    websiteUrl: 'https://peekingduck.readthedocs.io/',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2021',
    updated: '2026-05-04',
    ecosystemId: 'peekingduck',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '177' },
      { label: '内置节点', labelKo: '내장 노드', labelJa: '組み込みノード', labelEn: 'Built-in nodes', value: '50+' },
      {
        label: '典型场景',
        labelKo: '전형적 시나리오',
        labelJa: '典型的なシナリオ',
        labelEn: 'Typical use',
        value: 'CV pipeline',
      },
    ],
    summary:
      'PeekingDuck 是 AI Singapore 做的模块化计算机视觉推理框架，目标是让开发者用配置文件拼出可运行的 CV pipeline。',
    summaryKo:
      'PeekingDuck는 AI Singapore가 개발한 모듈식 컴퓨터 비전 추론 프레임워크이며, 개발자가 구성 파일로 실행 가능한 CV 파이프라인을 작성하는 것을 목표로 합니다.',
    summaryJa:
      'PeekingDuck は AI Singapore が開発したモジュール化コンピュータビジョン推論フレームワークで、開発者が設定ファイルを使って CV pipeline を実行可能な状態に組み立てることを目標としています。',
    summaryEn:
      'PeekingDuck is AI Singapore’s modular computer-vision inference framework, designed to let developers assemble runnable CV pipelines through configuration files.',
    whatItIs: `PeekingDuck 把输入、模型、后处理和输出都封装成节点。开发者可以用 YAML 写出"摄像头输入 -> YOLO 检测 -> 画框 -> 屏幕输出"这样的流程，不必从 PyTorch / TensorFlow 底层开始搭。

它适合教学、快速原型和中小企业 CV 应用，例如人流统计、目标检测、姿态分析和安全合规检查。`,
    whatItIsKo: `PeekingDuck는 입력, 모델, 후처리 및 출력을 모두 노드로 캡슐화합니다. 개발자는 YAML을 사용하여 「카메라 입력 → YOLO 감지 → 박스 그리기 → 화면 출력」과 같은 프로세스를 작성할 수 있으며, PyTorch / TensorFlow 하위 수준부터 시작할 필요가 없습니다.

교육, 빠른 프로토타입 및 중소 기업 CV 응용에 적합하며, 예를 들어 사람 흐름 통계, 목표 감지, 자세 분석 및 보안 준수 점검 등이 있습니다.`,
    whatItIsJa: `PeekingDuck は入力、モデル、後処理、出力をすべてノードとしてカプセル化します。開発者は YAML を使用して「カメラ入力 -> YOLO 検出 -> 枠描画 -> 画面出力」といったフローを記述でき、PyTorch／TensorFlow の底層から構築する必要はありません。

教育、高速プロトタイピング、中小企業の CV 応用に適しており、人流統計、目標検出、ポーズ分析、セキュリティコンプライアンスチェックなどの事例があります。`,
    whatItIsEn: `PeekingDuck packages input, model, post-processing, and output into nodes. Developers can write a YAML flow such as "camera input -> YOLO detection -> draw boxes -> screen output" without building from raw PyTorch / TensorFlow primitives.

It fits teaching, rapid prototyping, and SME CV applications such as footfall counting, object detection, pose analysis, and safety-compliance checks.`,
    aiRelevance: `PeekingDuck 的意义不是追求最新模型，而是降低计算机视觉落地门槛。很多组织需要的是"能跑、能改、能交付"的 pipeline，而不是从论文复现开始。

这种产品思路和 AISG 的应用导向一致：把 AI 能力包装成工程可用工具。`,
    aiRelevanceKo: `PeekingDuck의 의의는 최신 모델을 추구하는 것이 아니라 컴퓨터 비전 도입 장벽을 낮추는 것입니다. 많은 조직이 필요로 하는 것은 「실행 가능하고, 수정 가능하며, 배포 가능한」 파이프라인이며, 논문 재현부터 시작하는 것이 아닙니다.

이러한 제품 관점은 AISG의 응용 지향과 일치합니다. AI 능력을 엔지니어링으로 사용 가능한 도구로 패키징하는 것입니다.`,
    aiRelevanceJa: `PeekingDuck の意義は最新モデルを追求することではなく、コンピュータビジョンの実装ハードルを低くすることです。多くの組織が必要としているのは「動く、変更できる、納品できる」パイプラインで、論文の再現から始めることではありません。

この製品思考は AISG のアプリケーション指向と一致しています。AI 能力をエンジニアリング可能なツールにパッケージ化することなのです。`,
    aiRelevanceEn: `PeekingDuck’s point is not chasing the newest model, but lowering the deployment threshold for computer vision. Many organizations need a pipeline that can run, be adjusted, and ship, rather than starting from paper reproduction.

That product logic matches AISG’s applied orientation: package AI capability into tools engineers can actually use.`,
    singaporeRelevance: `PeekingDuck 是新加坡 AI 开源工具线的一部分，和 TagUI 一样服务于"让本地企业更容易用上 AI"。

它的长期观察点是社区活跃度和定位更新：在大模型视觉能力快速发展的背景下，传统 CV pipeline 框架要么转向边缘部署和工业场景，要么会被更通用的多模态工具吃掉。`,
    singaporeRelevanceKo: `PeekingDuck는 싱가포르 AI 오픈소스 도구 라인의 일부이며, TagUI와 마찬가지로 「현지 기업이 AI를 더 쉽게 사용할 수 있도록 하는」 것을 목표로 합니다.

장기적인 관찰 포인트는 커뮤니티 활성도와 포지셔닝 업데이트입니다. 대규모 모델의 시각 능력이 빠르게 발전하는 배경에서, 전통적인 CV 파이프라인 프레임워크는 엣지 배포 및 산업 시나리오로 전환하거나, 보다 범용적인 멀티모달 도구에 의해 대체될 수 있습니다.`,
    singaporeRelevanceJa: `PeekingDuck はシンガポール AI オープンソースツールラインの一部であり、TagUI と同様に「地元企業がより簡単にAIを利用できるようにする」ことを目指しています。

長期的な観察ポイントはコミュニティの活動度とポジショニング更新です。大規模モデルのビジョン能力が急速に発展する背景の下で、従来の CV pipeline フレームワークは、エッジデプロイメントと産業シナリオへの転向、またはより汎用的なマルチモーダルツールによる置き換えのいずれかを選択することになります。`,
    singaporeRelevanceEn: `PeekingDuck is part of Singapore’s open-source AI tooling line. Like TagUI, it serves the goal of making AI easier for local enterprises to adopt.

Its long-term tracking point is community activity and positioning: as multimodal models advance quickly, classical CV pipeline frameworks must either move toward edge and industrial deployment, or risk being absorbed by more general multimodal tools.`,
    milestones: [
      {
        date: '2021',
        title: 'PeekingDuck 开源发布',
        titleKo: 'PeekingDuck 오픈소스 공개',
        titleJa: 'PeekingDuck のオープンソース公開',
        titleEn: 'PeekingDuck open-sourced',
      },
    ],
    resources: [
      {
        label: 'PeekingDuck GitHub',
        labelEn: 'PeekingDuck on GitHub',
        url: 'https://github.com/aisingapore/PeekingDuck',
        kind: 'github',
      },
      {
        label: 'PeekingDuck 文档',
        labelKo: 'PeekingDuck 문서',
        labelJa: 'PeekingDuck ドキュメント',
        labelEn: 'PeekingDuck documentation',
        url: 'https://peekingduck.readthedocs.io/',
        kind: 'docs',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 아카이브',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/peekingduck/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'sgnlp',
    name: 'SGNLP',
    nameEn: 'SGNLP',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '本地 NLP 工具包',
    categoryKo: '현지 NLP 도구 키트',
    categoryJa: 'ローカル NLP ツールキット',
    categoryEn: 'Localized NLP toolkit',
    status: '维护放缓',
    statusKo: '유지보수 둔화',
    statusJa: 'メンテナンス放缓',
    statusEn: 'Maintenance slowed',
    description: '新加坡 NLP 研究社区模型',
    descriptionKo: '싱가포르 NLP 연구 커뮤니티 모델',
    descriptionJa: 'シンガポール NLP 研究コミュニティモデル',
    descriptionEn: 'Models from the Singapore NLP research community',
    stars: 38,
    language: 'Python',
    url: 'https://github.com/aisingapore/sgnlp',
    websiteUrl: 'https://sgnlp.aisingapore.net/',
    license: 'MIT',
    licenseEn: 'MIT',
    founded: '2021',
    updated: '2026-05-04',
    ecosystemId: 'sgnlp',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '37' },
      { label: '安装方式', labelKo: '설치 방법', labelJa: 'インストール方法', labelEn: 'Install', value: 'pip' },
      {
        label: '核心场景',
        labelKo: '핵심 시나리오',
        labelJa: 'コアシナリオ',
        labelEn: 'Core context',
        value: 'Singlish / code-switching',
      },
    ],
    summary:
      'SGNLP 是 AI Singapore 在 SEA-LION 之前的本地语言 AI 工具包，聚焦 Singlish、多语言代码切换和新加坡本地 NLP 任务。',
    summaryKo:
      'SGNLP는 AI Singapore가 SEA-LION 이전에 개발한 현지 언어 AI 도구 키트이며, Singlish, 다중 언어 코드 전환 및 싱가포르 현지 NLP 작업에 중점을 두고 있습니다.',
    summaryJa:
      'SGNLP は AI Singapore が SEA-LION より前に開発したローカル言語 AI ツールキットで、Singlish、多言語コード切り替え、シンガポールローカル NLP タスクに注力しています。',
    summaryEn:
      'SGNLP is AI Singapore’s localized language-AI toolkit before SEA-LION, focused on Singlish, multilingual code-switching, and Singapore-specific NLP tasks.',
    whatItIs: `SGNLP 是一个 Python 包，封装了若干来自新加坡 NLP 研究社区的模型。它关注的不是通用英文 NLP，而是新加坡语境：Singlish、英文/中文/马来语混用、地方实体和本地文本理解。

在 LLM 普及前，这类轻量模型更适合客服、社交媒体分析和政府文本处理。`,
    whatItIsKo: `SGNLP는 싱가포르 NLP 연구 커뮤니티에서 나온 여러 모델을 캡슐화한 Python 패키지입니다. 범용 영어 NLP에 초점을 맞추지 않으며, 싱가포르 문맥에 초점을 맞춥니다. Singlish, 영어/중국어/말레이어 혼용, 지역 개체 및 현지 텍스트 이해입니다.

LLM이 널리 보급되기 전, 이러한 경량 모델은 고객 서비스, 소셜 미디어 분석 및 정부 텍스트 처리에 더 적합했습니다.`,
    whatItIsJa: `SGNLP は Python パッケージで、シンガポール NLP 研究コミュニティからのいくつかのモデルをカプセル化しています。注力しているのは汎用英語 NLP ではなく、シンガポール文脈です。すなわち、Singlish、英語／中文／マレー語の混用、ローカルエンティティ、ローカルテキスト理解に注力しています。

LLM 普及前は、このようなライトウェイトモデルがカスタマーサービス、ソーシャルメディア分析、政府テキスト処理に、より適していました。`,
    whatItIsEn: `SGNLP is a Python package that wraps models from Singapore’s NLP research community. Its focus is not generic English NLP, but the Singapore context: Singlish, English / Mandarin / Malay code-switching, local entities, and local text understanding.

Before LLMs became widely available, this kind of lightweight model was better suited to customer service, social-media analysis, and government-text processing.`,
    aiRelevance: `SGNLP 说明一个重要事实：语言 AI 的本地化不是从 SEA-LION 才开始的。新加坡英语和多语言混用让通用 NLP 工具经常失灵，轻量模型仍有边缘部署和实时处理价值。

它和 SEA-LION 的关系更像前后两代产品：SGNLP 是专项工具，SEA-LION 是通用区域大模型。`,
    aiRelevanceKo: `SGNLP는 중요한 사실을 나타냅니다. 언어 AI의 현지화는 SEA-LION부터 시작되지 않았습니다. 싱가포르 영어와 다중 언어 혼용은 범용 NLP 도구를 종종 제대로 작동하지 못하게 하지만, 경량 모델은 여전히 엣지 배포 및 실시간 처리 가치가 있습니다.

SEA-LION과의 관계는 전후 세대 제품과 더 유사합니다. SGNLP는 전문 도구이고, SEA-LION은 범용 지역 대규모 언어 모델입니다.`,
    aiRelevanceJa: `SGNLP は重要な事実を示しています。言語AI のローカライゼーションは SEA-LION から始まったのではなく、その前からです。シンガポール英語と多言語ミックス使用により、汎用 NLP ツールは頻繁に機能しません。ライトウェイトモデルは依然としてエッジデプロイメントとリアルタイム処理に価値があります。

SGNLP と SEA-LION は前後2世代の製品のような関係にあります。SGNLP は専門ツール、SEA-LION は汎用の地域大規模モデルです。`,
    aiRelevanceEn: `SGNLP shows an important fact: language-AI localization did not begin with SEA-LION. Singapore English and multilingual code-switching often break generic NLP tools, and lightweight models still retain value for edge deployment and real-time processing.

Its relationship with SEA-LION is closer to two product generations: SGNLP as the specialty toolkit, SEA-LION as the general regional LLM.`,
    singaporeRelevance: `SGNLP 是新加坡"语言主权"路线的早期工程化实践。它把本地语言现象当成产品问题处理，而不是等待全球模型自然覆盖。

这个页面未来适合继续补充：具体模型清单、demo 状态、是否仍被政府或企业系统使用，以及它与 SEA-LION embedding / ModernBERT 线的关系。`,
    singaporeRelevanceKo: `SGNLP는 싱가포르의 「언어 주권」 노선의 초기 공학화 실천입니다. 이는 현지 언어 현상을 제품 문제로 처리하며, 글로벌 모델이 자연스럽게 커버되기를 기다리지 않습니다.

이 페이지는 향후 계속 보충할 가치가 있습니다. 구체적인 모델 목록, 데모 상태, 정부 또는 기업 시스템에서 여전히 사용 중인지 여부, 그리고 SEA-LION embedding / ModernBERT 라인과의 관계가 포함되어야 합니다.`,
    singaporeRelevanceJa: `SGNLP はシンガポール「言語主権」戦略の初期的なエンジニアリング実践です。ローカル言語現象をプロダクト問題として扱い、グローバルモデルが自然にカバーするのを待つのではなく対応します。

このページは将来、具体的なモデルリスト、デモステータス、政府またはエンタープライズシステムでなお使用されているかどうか、および SEA-LION embedding／ModernBERT ラインとの関係について補充していくのに適しています。`,
    singaporeRelevanceEn: `SGNLP is an early engineering expression of Singapore’s "language sovereignty" path. It treats local language phenomena as a product problem rather than waiting for global models to cover them naturally.

This page is a good future home for more detail: model list, demo status, whether government or enterprise systems still use it, and how it relates to SEA-LION embeddings / ModernBERT.`,
    milestones: [
      {
        date: '2021',
        title: 'SGNLP 开源发布',
        titleKo: 'SGNLP 오픈소스 공개',
        titleJa: 'SGNLP のオープンソース公開',
        titleEn: 'SGNLP open-sourced',
      },
    ],
    resources: [
      {
        label: 'SGNLP GitHub',
        labelEn: 'SGNLP on GitHub',
        url: 'https://github.com/aisingapore/sgnlp',
        kind: 'github',
      },
      {
        // The original docs/demo host sgnlp.aisingapore.net went NXDOMAIN
        // (caught by the url-health eval on 2026-07-28). The PyPI page is
        // the surviving canonical home for the package and its README.
        label: 'SGNLP PyPI 包',
        labelKo: 'SGNLP PyPI 패키지',
        labelJa: 'SGNLP PyPI パッケージ',
        labelEn: 'SGNLP on PyPI',
        url: 'https://pypi.org/project/sgnlp/',
        kind: 'docs',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 아카이브',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/sgnlp/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'speech-lab',
    name: 'Speech Lab',
    nameEn: 'Speech Lab',
    owner: 'AI Singapore / NUS / NTU',
    ownerEn: 'AI Singapore / NUS / NTU',
    category: '本地语音 AI',
    categoryKo: '현지 음성 AI',
    categoryJa: 'ローカル音声 AI',
    categoryEn: 'Localized speech AI',
    status: '产品化服务',
    statusKo: '제품화 서비스',
    statusJa: 'プロダクト化サービス',
    statusEn: 'Productized service',
    description: 'Singlish 语音转文字',
    descriptionKo: 'Singlish 음성-텍스트 변환',
    descriptionJa: 'Singlish 音声テキスト変換',
    descriptionEn: 'Singlish speech-to-text',
    stars: null,
    language: 'Speech AI',
    url: 'https://aisingapore.org/aiproducts/speech-lab/',
    websiteUrl: 'https://aisingapore.org/aiproducts/speech-lab/',
    founded: '2020s',
    updated: '2026-05-04',
    ecosystemId: 'speech-lab',
    metrics: [
      {
        label: '识别语言',
        labelKo: '언어 인식',
        labelJa: '言語認識',
        labelEn: 'Recognized languages',
        value: 'English / Mandarin / Singlish',
      },
      {
        label: '部署形态',
        labelKo: '배포 형태',
        labelJa: 'デプロイメント形態',
        labelEn: 'Deployment',
        value: 'on-premise option',
      },
      {
        label: '主要场景',
        labelKo: '주요 시나리오',
        labelJa: '主要シナリオ',
        labelEn: 'Use cases',
        value: 'call centres',
      },
    ],
    summary: 'Speech Lab 是 AI Singapore 面向新加坡语音场景的产品线，重点处理 Singlish、英语/华语混用和本地口音。',
    summaryKo:
      'Speech Lab은 AI Singapore의 싱가포르 음성 시나리오 제품선으로, Singlish, 영어/중국어 혼용, 현지 억양 처리를 중점으로 합니다.',
    summaryJa:
      'Speech Lab は、シンガポール音声シナリオを対象とした AI Singapore の製品ラインであり、Singlish、英語/標準中国語の混用、およびローカルアクセントの処理に重点を置いています。',
    summaryEn:
      'Speech Lab is AI Singapore’s product line for Singapore speech scenarios, focused on Singlish, English / Mandarin code-switching, and local accents.',
    whatItIs: `Speech Lab 的核心能力是把音频转成文字，覆盖英语、华语和 Singlish，并支持代码切换语音识别。AI Singapore 官方页面也强调它可以按行业场景重新训练，并提供本地部署选项。

典型用途包括客服中心转写、访谈转写、医疗咨询记录，以及聊天机器人和语音助手里的语音命令转写。`,
    whatItIsKo: `Speech Lab의 핵심 능력은 음성을 텍스트로 변환하는 것으로, 영어, 중국어, Singlish을 지원하며 코드 스위칭 음성 인식을 지원합니다. AI Singapore 공식 페이지도 업계 시나리오에 따라 재훈련할 수 있으며 현지 배포 옵션을 제공한다고 강조합니다.

일반적인 사용 사례는 고객 서비스 센터 전사, 인터뷰 전사, 의료 상담 기록, 그리고 챗봇 및 음성 어시스턴트의 음성 명령 전사를 포함합니다.`,
    whatItIsJa: `Speech Lab のコア機能は、音声をテキストに変換し、英語、標準中国語、Singlish をカバーし、コード切り替え音声認識をサポートすることです。AI Singapore の公式ページは、業界シナリオに応じて再トレーニング可能であり、ローカルデプロイメントオプションを提供することも強調しています。

典型的な用途には、カスタマーサービスセンターの転写、インタビュー転写、医療相談記録、およびチャットボットと音声アシスタント内の音声コマンド転写が含まれます。`,
    whatItIsEn: `Speech Lab’s core capability is audio-to-text, covering English, Mandarin, and Singlish, with support for code-switching speech recognition. AI Singapore’s official page also stresses domain customization and an on-premise deployment option.

Typical uses include call-centre transcription, interview transcription, medical-consultation notes, and voice-command transcription for chatbots and digital assistants.`,
    aiRelevance: `语音 AI 是本地化最难也最容易被低估的部分。通用 ASR 模型在标准英语上很好，但在新加坡口音、Singlish 语气词和中英混用上会明显掉点。

Speech Lab 的价值在于把"新加坡人真的怎么说话"变成模型能力。`,
    aiRelevanceKo: `음성 AI는 현지화하기가 가장 어렵고 과소평가되기 가장 쉬운 부분입니다. 범용 ASR 모델은 표준 영어로는 잘 작동하지만, 싱가포르 억양, Singlish 어기사 및 영중 혼용에서는 현저히 성능이 저하됩니다.

Speech Lab의 가치는 「싱가포르 사람들이 실제로 어떻게 말하는지」를 모델 능력으로 전환하는 것입니다.`,
    aiRelevanceJa: `音声 AI はローカライゼーションの中でも最も困難で、かつ最も過小評価されやすい部分です。汎用 ASR モデルは標準英語では良好ですが、シンガポール口音、Singlish 語気詞、および中英混用では明らかにパフォーマンスが低下します。

Speech Lab の価値は、「シンガポール人が実際にどのように話すのか」をモデル能力に変える点にあります。`,
    aiRelevanceEn: `Speech AI is one of the hardest and most underestimated localization problems. Generic ASR models can be strong on standard English, yet degrade on Singapore accents, Singlish particles, and English-Mandarin mixing.

Speech Lab’s value is turning "how Singaporeans actually speak" into model capability.`,
    singaporeRelevance: `Speech Lab 很直接地服务新加坡公共服务和企业服务场景。政府热线、客服、医疗咨询都需要多语言语音转写，而这些场景又常常有敏感数据，适合本地化和本地部署。

它应该和 SGNLP、SEA-LION 一起看：三者构成新加坡语言 AI 的文本、语音、大模型三条线。`,
    singaporeRelevanceKo: `Speech Lab는 싱가포르 공공 서비스 및 기업 서비스 시나리오에 직접적으로 서비스합니다. 정부 핫라인, 고객 서비스, 의료 상담 모두 다중 언어 음성 전사가 필요하며, 이러한 시나리오는 종종 민감한 데이터를 포함하므로 현지화 및 현지 배포에 적합합니다.

이는 SGNLP, SEA-LION과 함께 봐야 합니다. 이 세 가지가 함께 싱가포르 언어 AI의 텍스트, 음성, 대규모 언어 모델 세 가지 라인을 구성합니다.`,
    singaporeRelevanceJa: `Speech Lab は、シンガポール公共サービスおよび企業サービスシナリオに直接的にサービスを提供しています。政府ホットライン、カスタマーサービス、医療相談はすべて多言語音声転写を必要とし、これらのシナリオはしばしば機密データを含むため、ローカライゼーションとローカルデプロイメントに適しています。

これは SGNLP、SEA-LION と一緒に見るべきです。三者はシンガポール言語 AI のテキスト、音声、大規模モデルという 3 つのラインを構成しています。`,
    singaporeRelevanceEn: `Speech Lab directly serves Singapore public-service and enterprise-service scenarios. Government hotlines, customer service, and medical consultations all need multilingual speech transcription, often with sensitive data, making localization and on-premise deployment important.

It should be read together with SGNLP and SEA-LION: together they form Singapore’s text, speech, and large-model language-AI lines.`,
    milestones: [
      {
        date: '2020s',
        title: 'Speech Lab 作为 AISG AI Bricks 产品推出',
        titleKo: 'Speech Lab을 AISG AI Bricks 제품으로 출시',
        titleJa: 'Speech Lab は AISG AI Bricks 製品として推出されました',
        titleEn: 'Speech Lab launched as an AISG AI Bricks product',
      },
    ],
    resources: [
      {
        label: 'Speech Lab 官网',
        labelKo: 'Speech Lab 공식 웹사이트',
        labelJa: 'Speech Lab 公式サイト',
        labelEn: 'Speech Lab official page',
        url: 'https://aisingapore.org/aiproducts/speech-lab/',
        kind: 'website',
      },
      {
        label: 'Speech Lab',
        labelEn: 'Speech Lab',
        url: 'https://aisingapore.org/aiproducts/speech-lab/',
        kind: 'demo',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 기록',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/speech-lab/',
        kind: 'ecosystem',
      },
    ],
  },
  {
    id: 'synergos',
    name: 'Synergos',
    nameEn: 'Synergos',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '联邦学习框架',
    categoryKo: '연방 학습 프레임워크',
    categoryJa: 'フェデレーテッドラーニングフレームワーク',
    categoryEn: 'Federated learning framework',
    status: '早期开源',
    statusKo: '초기 오픈소스',
    statusJa: '初期段階のオープンソース',
    statusEn: 'Early open source',
    description: '隐私保护联邦学习框架',
    descriptionKo: '프라이버시 보호 연방 학습 프레임워크',
    descriptionJa: 'プライバシー保護フェデレーション・ラーニング枠組み',
    descriptionEn: 'Privacy-preserving federated learning framework',
    stars: 2,
    language: 'Python',
    url: 'https://github.com/aisingapore/synergos',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2021',
    updated: '2026-05-04',
    ecosystemId: 'synergos',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '2' },
      { label: '最新发布', labelKo: '최신 발표', labelJa: '最新リリース', labelEn: 'Latest release', value: '2021' },
      {
        label: '核心方向',
        labelKo: '핵심 방향',
        labelJa: 'コア方向',
        labelEn: 'Core direction',
        value: 'federated learning',
      },
    ],
    summary:
      'Synergos 是 AI Singapore 的联邦学习工具，目标是在不共享原始数据的情况下，让多个组织协同训练机器学习模型。',
    summaryKo:
      'Synergos는 AI Singapore의 연방 학습 도구로, 원본 데이터를 공유하지 않고 여러 조직이 협력하여 기계 학습 모델을 훈련하는 것을 목표로 합니다.',
    summaryJa:
      'Synergos は AI Singapore のフェデレーション・ラーニング・ツールで、元のデータを共有することなく複数の組織が協力して機械学習モデルを訓練できるようにすることを目標としています。',
    summaryEn:
      'Synergos is AI Singapore’s federated-learning tooling, designed to let multiple organizations jointly train machine-learning models without sharing raw data.',
    whatItIs: `Synergos 面向联邦学习网络里的协作、项目、实验、运行和参与方管理。它把复杂的联邦训练编排封装成驱动接口，降低多方训练的工程门槛。

从公开仓库看，它更像一个早期工程组件，而不是已经大规模商业化的产品。`,
    whatItIsKo: `Synergos는 연방 학습 네트워크의 협력, 프로젝트, 실험, 실행 및 참여자 관리를 위해 설계되었습니다. 복잡한 연방 훈련 오케스트레이션을 드라이버 인터페이스로 캡슐화하여 다중 당사자 훈련의 공학적 장벽을 낮춥니다.

공개 저장소에서 보면, 그것은 이미 대규모로 상용화된 제품이 아니라 초기 공학 구성 요소에 더 가깝습니다.`,
    whatItIsJa: `Synergos はフェデレーション・ラーニング・ネットワーク内の協力、プロジェクト、実験、実行、および参加者の管理に対応しています。複雑なフェデレーション・トレーニング・オーケストレーションをドライバー・インターフェースにカプセル化し、マルチパーティ・トレーニングのエンジニアリング・ハードルを下げます。

公開リポジトリから見ると、これはすでに大規模に商業化された製品ではなく、初期段階のエンジニアリング・コンポーネントのようです。`,
    whatItIsEn: `Synergos handles collaboration, project, experiment, run, and participant management inside a federated-learning network. It wraps complex federated orchestration behind a driver interface, lowering the engineering threshold for multi-party training.

From the public repository, it looks more like an early engineering component than a broadly commercialized product.`,
    aiRelevance: `联邦学习解决的是 AI 里的硬约束：数据不能离开组织边界，但模型又需要跨组织学习。金融、医疗和公共部门都可能有这种需求。

Synergos 的价值不在流量，而在它代表的方向：隐私保护 AI、跨机构协作训练、合规前提下的数据价值释放。`,
    aiRelevanceKo: `연방 학습은 AI의 하드 제약 조건을 해결합니다: 데이터는 조직 경계를 벗어날 수 없지만, 모델은 조직 간 학습이 필요합니다. 금융, 의료, 공공 부문 모두 이러한 요구가 있을 수 있습니다.

Synergos의 가치는 트래픽에 있지 않고 그것이 대표하는 방향에 있습니다: 프라이버시 보호 AI, 기관 간 협력 훈련, 규정 준수 조건 아래의 데이터 가치 활용.`,
    aiRelevanceJa: `フェデレーション・ラーニングが解決するのは、AI における厳しい制約です。データは組織の境界を超えることはできませんが、モデルは組織を超えて学習する必要があります。金融、医療、公共部門はすべてこのようなニーズを持つ可能性があります。

Synergos の価値はトラフィックにはなく、それが代表する方向性にあります。プライバシー保護 AI、機関間協働トレーニング、コンプライアンス前提でのデータ価値の開放です。`,
    aiRelevanceEn: `Federated learning addresses a hard AI constraint: data cannot leave organizational boundaries, yet models may need to learn across organizations. Finance, healthcare, and public-sector settings all have this need.

Synergos’ value is less about traffic and more about the direction it represents: privacy-preserving AI, cross-institution collaborative training, and releasing data value under compliance constraints.`,
    singaporeRelevance: `Synergos 对新加坡尤其有意义，因为新加坡 AI 落地常常发生在强监管、高信任要求的行业。它连接的是 PDPA 数据保护、MAS 金融治理和 AI Singapore 应用工程能力。

未来需要补充的关键信息是：是否仍在内部项目中使用、是否与 PDPC / MAS 沙盒形成实际连接、是否有新的隐私计算路线替代它。`,
    singaporeRelevanceKo: `Synergos는 싱가포르에 특히 중요한데, 싱가포르 AI 구현은 강한 규제, 높은 신뢰 요구 산업에서 자주 발생하기 때문입니다. 이것은 PDPA 데이터 보호, MAS 금융 치리 및 AI Singapore 응용 공학 역량을 연결합니다.

향후 보충이 필요한 핵심 정보는: 내부 프로젝트에서 계속 사용 중인지, PDPC / MAS 샌드박스와 실제 연결이 형성되었는지, 이를 대체할 새로운 프라이버시 계산 경로가 있는지입니다.`,
    singaporeRelevanceJa: `Synergos はシンガポールにとって特に意義があります。なぜなら、シンガポール AI の実装は、強い規制と高い信頼要件を持つ業界でよく起こるからです。それが接続するのは、PDPA データ保護、MAS 金融統治、AI Singapore アプリケーション・エンジニアリング能力です。

今後補完する必要がある重要な情報は、内部プロジェクトで使用され続けているかどうか、PDPC / MAS サンドボックスと実際の接続を形成しているかどうか、新しいプライバシー・コンピューティング・パスでそれが置き換わるかどうかです。`,
    singaporeRelevanceEn: `Synergos matters for Singapore because AI deployment often happens in highly regulated, high-trust sectors. It connects PDPA data protection, MAS financial governance, and AI Singapore’s applied engineering capability.

The key information to add later: whether it is still used internally, whether it connects to PDPC / MAS sandbox work, and whether newer privacy-computing approaches have replaced it.`,
    milestones: [
      {
        date: '2021-09',
        title: 'Synergos v0.1.0 发布',
        titleKo: 'Synergos v0.1.0 발표',
        titleJa: 'Synergos v0.1.0 リリース',
        titleEn: 'Synergos v0.1.0 released',
      },
    ],
    resources: [
      {
        label: 'Synergos GitHub',
        labelEn: 'Synergos on GitHub',
        url: 'https://github.com/aisingapore/synergos',
        kind: 'github',
      },
      {
        label: '生态地图档案',
        labelKo: '생태계 지도 기록',
        labelJa: 'エコシステムマップアーカイブ',
        labelEn: 'Ecosystem profile',
        url: '/ecosystem/synergos/',
        kind: 'ecosystem',
      },
    ],
  },
];

export interface Paper {
  title: string;
  titleZh: string;
  arxivId: string;
  url: string;
  translationUrl: string;
  year: number;
}

export const papers: Paper[] = [
  {
    // i18n-allow-unpaired — canonical English arXiv paper title; zh render uses `titleZh` (Paper schema is title=EN + titleZh)
    title: 'SEA-Guard: Culturally Grounded Multilingual Safeguard for Southeast Asia',
    titleZh: 'SEA-Guard：面向东南亚的文化本地化多语言安全护栏',
    arxivId: '2602.01618',
    url: 'https://arxiv.org/abs/2602.01618',
    translationUrl: '/papers/sea-guard-zh.pdf',
    year: 2026,
  },
  {
    // i18n-allow-unpaired — canonical English arXiv paper title; zh render uses `titleZh`
    title: 'SEA-SafeguardBench: Evaluating AI Safety in SEA Languages and Cultures',
    titleZh: 'SEA-SafeguardBench：东南亚语言与文化 AI 安全评测基准',
    arxivId: '2512.05501',
    url: 'https://arxiv.org/abs/2512.05501',
    translationUrl: '/papers/sea-safeguardbench-zh.pdf',
    year: 2025,
  },
  {
    // i18n-allow-unpaired — canonical English arXiv paper title; zh render uses `titleZh`
    title: 'SEA-LION: Southeast Asian Languages in One Network',
    titleZh: 'SEA-LION：东南亚语言统一网络',
    arxivId: '2504.05747',
    url: 'https://arxiv.org/abs/2504.05747',
    translationUrl: '/papers/sea-lion-zh.pdf',
    year: 2025,
  },
  {
    // i18n-allow-unpaired — canonical English arXiv paper title; zh render uses `titleZh`
    title: 'SEA-HELM: Southeast Asian Holistic Evaluation of Language Models',
    titleZh: 'SEA-HELM：东南亚语言模型综合评测',
    arxivId: '2502.14301',
    url: 'https://arxiv.org/abs/2502.14301',
    translationUrl: '/papers/sea-helm-zh.pdf',
    year: 2025,
  },
];

export const dataDisclaimer =
  '本页统计数据来源：HuggingFace API、GitHub API，由 新加坡 AI 观察独立采集，非官方数据。统计采集：2026-05-03；项目档案更新：2026-05-04。';

export const dataDisclaimerEn =
  'Statistics on this page are sourced from the HuggingFace API and GitHub API, independently collected by Singapore AI Observatory and not official. Stats collected: 2026-05-03; project profiles updated: 2026-05-04.';

export const dataDisclaimerJa =
  '本ページの統計は HuggingFace API と GitHub API に基づき、シンガポール AI 観測が独自に収集したもので、公式データではありません。統計取得日：2026-05-03；プロジェクト档案更新：2026-05-04。';

export const dataDisclaimerKo =
  '이 페이지의 통계는 HuggingFace API와 GitHub API에서 가져왔으며, Singapore AI Observatory가 독립적으로 수집한 비공식 데이터입니다. 통계 수집일: 2026-05-03; 프로젝트 프로필 업데이트: 2026-05-04.';

export const seaLionStats = {
  totalModels: 56,
  totalDownloads: 27988,
  totalLikes: 278,
  topModel: 'Gemma-SEA-LION-v4-27B-IT',
  topModelDownloads: 5034,
  dataSource: 'HuggingFace API',
  dataDate: '2026-05-03',
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
  noteEn: 'Released in February 2026; still at an early stage',
};

export const aiVerify = {
  name: 'AI Verify',
  description: '全球首个 AI 治理测试框架',
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
  owner: string;
  ownerEn?: string;
  category: string;
  categoryEn?: string;
  status: string;
  statusEn?: string;
  description: string;
  descriptionEn?: string;
  stars: number | null;
  language: string;
  url: string | null;
  websiteUrl?: string;
  docsUrl?: string;
  license?: string;
  licenseEn?: string;
  founded?: string;
  updated?: string;
  ecosystemId?: string;
  metrics?: OpenSourceMetric[];
  summary: string;
  summaryEn: string;
  whatItIs: string;
  whatItIsEn: string;
  aiRelevance: string;
  aiRelevanceEn: string;
  singaporeRelevance: string;
  singaporeRelevanceEn: string;
  milestones?: OpenSourceMilestone[];
  resources: OpenSourceResource[];
}

export interface OpenSourceMetric {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
  note?: string;
  noteEn?: string;
}

export interface OpenSourceMilestone {
  date: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
}

export interface OpenSourceResource {
  label: string;
  labelEn?: string;
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
    categoryEn: 'Governance testing framework',
    status: '开源运营中',
    statusEn: 'Active open source',
    description: '把 AI 治理原则转成可运行测试的开源框架',
    descriptionEn: 'An open-source framework that turns AI governance principles into executable tests',
    stars: 37,
    language: 'TypeScript',
    url: 'https://github.com/aiverify-foundation/aiverify',
    websiteUrl: 'https://aiverifyfoundation.sg/',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2022-05',
    updated: '2026-05-04',
    ecosystemId: 'ai-verify-foundation',
    metrics: [
      { label: '开源时间', labelEn: 'Open-sourced', value: '2023-06' },
      { label: '评估维度', labelEn: 'Assessment dimensions', value: '11' },
      { label: '生态成员', labelEn: 'Ecosystem members', value: '100+' },
    ],
    summary:
      'AI Verify 是新加坡 AI 治理路线的核心产品：它不只写原则，而是把透明度、公平性、稳健性、隐私、问责等治理要求做成可运行的测试框架和报告工具。',
    summaryEn:
      'AI Verify is the core product of Singapore’s AI governance strategy: instead of only publishing principles, it turns requirements such as transparency, fairness, robustness, privacy, and accountability into runnable tests and reporting tools.',
    whatItIs: `AI Verify 由两层组成：一层是开源软件工具包，企业可以用它测试传统 AI 和生成式 AI 系统；另一层是 AI Verify Foundation，负责把工具、插件和成员生态持续推进。

它的页面价值在于把抽象治理变成工程对象。一个企业不是只回答"我们是否负责任地使用 AI"，而是可以用测试、问卷和报告说明自己的系统在哪些维度达标、哪些维度需要补强。`,
    whatItIsEn: `AI Verify has two layers: an open-source software toolkit that enterprises can use to test classical and generative AI systems, and the AI Verify Foundation, which keeps the tooling, plugin ecosystem, and member network moving.

Its value is that it turns abstract governance into an engineering object. A company does not merely claim that it uses AI responsibly; it can use tests, questionnaires, and reports to show which dimensions are covered and where gaps remain.`,
    aiRelevance: `AI Verify 的关键创新是把"治理"从文档推向工具链。对企业来说，AI 风险不再只是法务或合规部门的抽象话题，而是可以纳入开发、评估和上线流程的检查项。

这也是新加坡在 AI 治理上的差异化：不直接走强制立法先行，而是先做可验证、可复用、可国际化的工具。`,
    aiRelevanceEn: `AI Verify’s key innovation is moving "governance" from documents into the toolchain. For enterprises, AI risk becomes less of an abstract legal or compliance topic and more of a set of checks that can fit into development, evaluation, and launch workflows.

That is Singapore’s governance differentiation: rather than leading with hard law, it builds verifiable, reusable, internationally usable tooling first.`,
    singaporeRelevance: `AI Verify 是新加坡"标准外交"最具体的载体。它把 IMDA 的治理框架做成全球企业都能下载、部署、扩展的开源工具，降低了其他国家和企业采纳新加坡框架的政治阻力。

对 sgai.md 来说，它应被当作一个长期追踪对象：工具演进、Foundation 成员参与深度、生成式 AI 测试模块、与 ISO / NIST / EU 合规体系的对齐，都会影响新加坡在 AI 治理中的话语权。`,
    singaporeRelevanceEn: `AI Verify is the most concrete vehicle for Singapore’s "standards diplomacy." It converts IMDA’s governance framework into open-source tooling that global enterprises can download, deploy, and extend, lowering the political friction of adopting a Singapore-originated framework.

For sgai.md, it should be tracked as a long-running entity: tooling evolution, depth of Foundation participation, generative-AI testing modules, and alignment with ISO / NIST / EU compliance systems all shape Singapore’s influence in AI governance.`,
    milestones: [
      { date: '2022-05', title: 'AI Verify 测试框架发布', titleEn: 'AI Verify testing framework released' },
      {
        date: '2023-06',
        title: 'AI Verify 开源并成立基金会',
        titleEn: 'AI Verify open-sourced and Foundation launched',
      },
      { date: '2024-05', title: '扩展到生成式 AI 测试', titleEn: 'Expanded into generative-AI testing' },
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
        labelEn: 'AI Verify Foundation official site',
        url: 'https://aiverifyfoundation.sg/',
        kind: 'website',
      },
      {
        label: '生态地图档案',
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
    categoryEn: 'Regional multilingual LLM',
    status: '持续迭代',
    statusEn: 'Actively iterated',
    description: '面向东南亚语言和文化语境的大模型家族',
    descriptionEn: 'A large-model family for Southeast Asian languages and cultural contexts',
    stars: 400,
    language: 'Python / Models',
    url: 'https://github.com/aisingapore/sealion',
    websiteUrl: 'https://sea-lion.ai/',
    docsUrl: 'https://huggingface.co/aisingapore',
    license: '按模型底座协议不同',
    licenseEn: 'Varies by base model',
    founded: '2023-12',
    updated: '2026-05-04',
    ecosystemId: 'sea-lion',
    metrics: [
      { label: '模型数', labelEn: 'Models tracked', value: `${seaLionStats.totalModels}` },
      { label: '主要语言', labelEn: 'Core languages', value: '11' },
      { label: '最新主线', labelEn: 'Latest mainline', value: 'v4' },
    ],
    summary:
      'SEA-LION 是 AI Singapore 的旗舰开源大模型家族，目标不是做另一个通用 GPT，而是补上东南亚语言、口音、文化语境在全球大模型中的空白。',
    summaryEn:
      'SEA-LION is AI Singapore’s flagship open-source LLM family. Its goal is not to build another general GPT, but to fill the gap for Southeast Asian languages, accents, and cultural contexts in global large models.',
    whatItIs: `SEA-LION 是一个模型家族，不是单个模型。它包含基础模型、指令模型、多模态模型、embedding 模型和面向安全的衍生模型，并通过 GitHub、Hugging Face 与 sea-lion.ai API 对外提供。

它的技术路线是区域化继续训练：在强底座上补充东南亚语言数据，让模型更懂马来语、印尼语、泰语、越南语、泰米尔语、缅甸语、高棉语等低资源语言。`,
    whatItIsEn: `SEA-LION is a model family, not a single model. It includes base models, instruction-tuned models, multimodal models, embedding models, and safety-oriented derivatives, exposed through GitHub, Hugging Face, and the sea-lion.ai API.

Its technical path is regional continued training: starting from strong base models, then adding Southeast Asian language data so the models better handle Malay, Indonesian, Thai, Vietnamese, Tamil, Burmese, Khmer, and other lower-resource languages.`,
    aiRelevance: `SEA-LION 代表"区域开源大模型"路线。它承认小国不可能和美国大厂比通用算力，但可以在语言区、文化区、政府和企业本地部署场景里做差异化。

这种路线对东南亚尤其重要：许多语言在通用模型训练语料里占比很低，模型看似会翻译，实际容易丢掉语气、实体、地名和本地常识。`,
    aiRelevanceEn: `SEA-LION represents the "regional open LLM" path. It accepts that a small country cannot out-compute US big tech on general capability, but can differentiate in language regions, cultural contexts, and local deployment needs for government and enterprise.

This matters in Southeast Asia because many languages are underrepresented in general-model corpora. Models may appear to translate them, yet still lose tone, entities, place names, and local commonsense.`,
    singaporeRelevance: `SEA-LION 是新加坡主权 AI 叙事最直观的技术产品。它让新加坡在 ASEAN 语境里不只是治理倡议者，也是基础模型供给者。

未来最值得看的是三件事：v4 / v5 是否能持续领先区域基准，政府和企业是否真的形成生产部署，SEA-LION 是否能吸引东南亚开发者一起贡献数据、评测和微调版本。`,
    singaporeRelevanceEn: `SEA-LION is the clearest technical product in Singapore’s sovereign-AI narrative. It lets Singapore appear in ASEAN not only as a governance convenor, but also as a provider of foundation-model infrastructure.

The questions to watch are whether v4 / v5 can keep leading regional benchmarks, whether government and enterprise production deployments materialise, and whether SEA-LION can attract Southeast Asian developers to contribute data, evaluations, and fine-tuned variants.`,
    milestones: [
      { date: '2023-12', title: 'SEA-LION v1 发布', titleEn: 'SEA-LION v1 released' },
      {
        date: '2024-12',
        title: 'SEA-LION v3 进入 Llama / Gemma 继续训练路线',
        titleEn: 'SEA-LION v3 moves into the Llama / Gemma continued-training path',
      },
      {
        date: '2025-2026',
        title: 'v4、embedding、SEA-Guard 等衍生线展开',
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
      { label: 'SEA-LION API / 官网', labelEn: 'SEA-LION API / website', url: 'https://sea-lion.ai/', kind: 'website' },
      {
        label: 'AI Singapore Hugging Face',
        labelEn: 'AI Singapore on Hugging Face',
        url: seaLionStats.huggingfaceUrl,
        kind: 'model',
      },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/sea-lion/', kind: 'ecosystem' },
    ],
  },
  {
    id: 'sea-guard',
    name: 'SEA-Guard',
    nameEn: 'SEA-Guard',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '区域安全护栏模型',
    categoryEn: 'Regional safety guardrail model',
    status: '早期发布',
    statusEn: 'Early release',
    description: '面向东南亚文化语境的安全分类与护栏模型',
    descriptionEn: 'Safety classification and guardrail models grounded in Southeast Asian contexts',
    stars: null,
    language: 'Models',
    url: 'https://huggingface.co/collections/aisingapore/sea-guard',
    docsUrl: 'https://arxiv.org/abs/2602.01618',
    license: '按模型底座协议不同',
    licenseEn: 'Varies by base model',
    founded: '2026-02',
    updated: '2026-05-04',
    metrics: [
      { label: '模型数', labelEn: 'Models', value: `${seaGuardStats.totalModels}` },
      { label: '核心语言', labelEn: 'Core languages', value: '8' },
      { label: '输出形态', labelEn: 'Output', value: 'safe / unsafe' },
    ],
    summary:
      'SEA-Guard 是 SEA-LION 生态里的安全护栏线，重点解决通用安全模型对东南亚语言、宗教、族群和文化语境不敏感的问题。',
    summaryEn:
      'SEA-Guard is the safety-guardrail line within the SEA-LION ecosystem, focused on the gap where generic safety models miss Southeast Asian languages, religions, ethnic contexts, and cultural norms.',
    whatItIs: `SEA-Guard 目前是一组安全分类模型。它把用户请求或模型回复判定为 safe / unsafe，并支持文本和部分图文场景。

它不是替代人类审核的万能安全系统，而是给东南亚应用开发者一个更本地化的第一层护栏：在接入通用 LLM 或 SEA-LION 时，可以先用 SEA-Guard 做区域语境下的风险过滤。`,
    whatItIsEn: `SEA-Guard is currently a collection of safety-classification models. It classifies user requests or model responses as safe / unsafe and supports text plus some vision-text scenarios.

It is not a universal replacement for human review. Its role is to give Southeast Asian application developers a more localized first guardrail: when they connect a general LLM or SEA-LION, SEA-Guard can screen risks through a regional-cultural lens.`,
    aiRelevance: `AI 安全模型往往在英文和美国文化语境上训练得最好。东南亚的现实问题更复杂：多宗教、多族群、多语言混用，本地冒犯和真实风险不一定出现在英文安全数据集里。

SEA-Guard 的意义在于把安全对齐也区域化。它让"本地语言模型"不只是会说本地话，也更懂本地边界。`,
    aiRelevanceEn: `AI safety models are often strongest in English and US cultural contexts. Southeast Asia is more complex: multi-religious, multi-ethnic, and multilingual, with local harms and offence patterns that may not appear in English safety datasets.

SEA-Guard matters because it regionalizes safety alignment too. It asks a local language model not only to speak local languages, but also to understand local boundaries.`,
    singaporeRelevance: `SEA-Guard 把新加坡的两条 AI 路线接起来：SEA-LION 的区域模型路线，以及 AI Verify 的可信 AI 治理路线。

如果 SEA-LION 要进入政府、教育、医疗和金融等高敏场景，安全护栏不是附属品，而是落地前提。SEA-Guard 就是这个前提的模型层。`,
    singaporeRelevanceEn: `SEA-Guard connects two Singapore AI lines: SEA-LION’s regional-model path and AI Verify’s trustworthy-AI governance path.

If SEA-LION is to enter sensitive sectors such as government, education, healthcare, and finance, safety guardrails are not a side feature; they are a deployment precondition. SEA-Guard is that precondition at the model layer.`,
    milestones: [
      { date: '2026-02', title: 'SEA-Guard 模型和论文发布', titleEn: 'SEA-Guard models and paper released' },
      {
        date: '2026-03',
        title: 'Hugging Face SEA-Guard collection 更新',
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
        labelEn: 'SEA-Guard paper',
        url: 'https://arxiv.org/abs/2602.01618',
        kind: 'paper',
      },
      {
        label: 'Gemma-SEA-Guard 模型卡',
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
    categoryEn: 'RPA automation tool',
    status: '社区维护',
    statusEn: 'Community maintained',
    description: '免费 RPA 网页/桌面自动化工具',
    descriptionEn: 'Free RPA tool for web and desktop automation',
    stars: 6282,
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
      { label: '脚本语言', labelEn: 'Flow languages', value: '20+' },
      { label: '最新发布', labelEn: 'Latest release', value: '2022' },
    ],
    summary:
      'TagUI 是 AI Singapore 体系里最早走向全球的开源项目之一，用接近自然语言的 flow 脚本自动化网页、桌面和命令行任务。',
    summaryEn:
      'TagUI is one of the earliest AI Singapore open-source projects to reach a global audience, using near-natural-language flow scripts to automate web, desktop, and command-line tasks.',
    whatItIs: `TagUI 的用户用简短脚本描述要执行的动作，例如打开网页、输入内容、点击按钮、抓取表格、读写 Excel。它支持网页自动化、桌面自动化、OCR 和命令行调用。

它的设计哲学很朴素：不要昂贵的企业 RPA 套件，不要复杂的可视化流程设计器，只用文本脚本把重复劳动自动化。`,
    whatItIsEn: `TagUI users describe actions with short scripts: open a webpage, type text, click a button, scrape a table, or read and write Excel. It supports web automation, desktop automation, OCR, and command-line invocation.

Its design philosophy is plain: no expensive enterprise RPA suite, no heavy visual process designer, just text scripts that automate repetitive work.`,
    aiRelevance: `TagUI 本身不是大模型项目，但它是 AI 落地的连接层。许多企业 AI 应用最后都要回到旧系统、网页后台、Excel 和邮件流程里，RPA 正是把模型能力接进旧流程的轻量方式。

在 Agent 时代，TagUI 还提供了一个历史参照：真正有用的自动化工具，必须能处理现实世界里不优雅、非 API 化的界面。`,
    aiRelevanceEn: `TagUI is not itself a large-model project, but it is a deployment connector. Many enterprise AI applications eventually need to write back into legacy systems, admin webpages, Excel files, and email workflows; RPA is a lightweight way to wire model outputs into those old processes.

In the agent era, TagUI is also a useful historical reference: useful automation tools must handle the messy, non-API interfaces that exist in the real world.`,
    singaporeRelevance: `TagUI 证明新加坡的国家级 AI 机构可以产出全球开发者会真实使用的工具。它不靠政策叙事取胜，而靠足够简单、足够免费、足够跨平台。

它也为后来的 SEA-LION、PeekingDuck、SGNLP 提供了一个样板：小国开源不一定要拼最大规模，可以拼明确场景和低门槛。`,
    singaporeRelevanceEn: `TagUI proves that a national AI institution in Singapore can produce tooling that global developers genuinely use. It succeeds not through policy narrative, but by being simple, free, and cross-platform enough.

It also set a pattern for later projects such as SEA-LION, PeekingDuck, and SGNLP: small-country open source does not have to win by scale; it can win through a clear use case and low adoption friction.`,
    milestones: [
      { date: '2017', title: 'TagUI 发布', titleEn: 'TagUI released' },
      { date: '2018', title: 'AI Singapore 支持项目发展', titleEn: 'AI Singapore supports the project' },
      {
        date: '2022',
        title: 'AI Singapore 停止官方维护，社区继续支持',
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
      { label: 'TagUI 文档', labelEn: 'TagUI documentation', url: 'https://tagui.readthedocs.io/', kind: 'docs' },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/tagui/', kind: 'ecosystem' },
    ],
  },
  {
    id: 'peekingduck',
    name: 'PeekingDuck',
    nameEn: 'PeekingDuck',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '计算机视觉框架',
    categoryEn: 'Computer vision framework',
    status: '维护放缓',
    statusEn: 'Maintenance slowed',
    description: '模块化计算机视觉推理框架',
    descriptionEn: 'Modular computer vision inference framework',
    stars: 177,
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
      { label: '内置节点', labelEn: 'Built-in nodes', value: '50+' },
      { label: '典型场景', labelEn: 'Typical use', value: 'CV pipeline' },
    ],
    summary:
      'PeekingDuck 是 AI Singapore 做的模块化计算机视觉推理框架，目标是让开发者用配置文件拼出可运行的 CV pipeline。',
    summaryEn:
      'PeekingDuck is AI Singapore’s modular computer-vision inference framework, designed to let developers assemble runnable CV pipelines through configuration files.',
    whatItIs: `PeekingDuck 把输入、模型、后处理和输出都封装成节点。开发者可以用 YAML 写出"摄像头输入 -> YOLO 检测 -> 画框 -> 屏幕输出"这样的流程，不必从 PyTorch / TensorFlow 底层开始搭。

它适合教学、快速原型和中小企业 CV 应用，例如人流统计、目标检测、姿态分析和安全合规检查。`,
    whatItIsEn: `PeekingDuck packages input, model, post-processing, and output into nodes. Developers can write a YAML flow such as "camera input -> YOLO detection -> draw boxes -> screen output" without building from raw PyTorch / TensorFlow primitives.

It fits teaching, rapid prototyping, and SME CV applications such as footfall counting, object detection, pose analysis, and safety-compliance checks.`,
    aiRelevance: `PeekingDuck 的意义不是追求最新模型，而是降低计算机视觉落地门槛。很多组织需要的是"能跑、能改、能交付"的 pipeline，而不是从论文复现开始。

这种产品思路和 AISG 的应用导向一致：把 AI 能力包装成工程可用工具。`,
    aiRelevanceEn: `PeekingDuck’s point is not chasing the newest model, but lowering the deployment threshold for computer vision. Many organizations need a pipeline that can run, be adjusted, and ship, rather than starting from paper reproduction.

That product logic matches AISG’s applied orientation: package AI capability into tools engineers can actually use.`,
    singaporeRelevance: `PeekingDuck 是新加坡 AI 开源工具线的一部分，和 TagUI 一样服务于"让本地企业更容易用上 AI"。

它的长期观察点是社区活跃度和定位更新：在大模型视觉能力快速发展的背景下，传统 CV pipeline 框架要么转向边缘部署和工业场景，要么会被更通用的多模态工具吃掉。`,
    singaporeRelevanceEn: `PeekingDuck is part of Singapore’s open-source AI tooling line. Like TagUI, it serves the goal of making AI easier for local enterprises to adopt.

Its long-term tracking point is community activity and positioning: as multimodal models advance quickly, classical CV pipeline frameworks must either move toward edge and industrial deployment, or risk being absorbed by more general multimodal tools.`,
    milestones: [{ date: '2021', title: 'PeekingDuck 开源发布', titleEn: 'PeekingDuck open-sourced' }],
    resources: [
      {
        label: 'PeekingDuck GitHub',
        labelEn: 'PeekingDuck on GitHub',
        url: 'https://github.com/aisingapore/PeekingDuck',
        kind: 'github',
      },
      {
        label: 'PeekingDuck 文档',
        labelEn: 'PeekingDuck documentation',
        url: 'https://peekingduck.readthedocs.io/',
        kind: 'docs',
      },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/peekingduck/', kind: 'ecosystem' },
    ],
  },
  {
    id: 'sgnlp',
    name: 'SGNLP',
    nameEn: 'SGNLP',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '本地 NLP 工具包',
    categoryEn: 'Localized NLP toolkit',
    status: '维护放缓',
    statusEn: 'Maintenance slowed',
    description: '新加坡 NLP 研究社区模型',
    descriptionEn: 'Models from the Singapore NLP research community',
    stars: 37,
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
      { label: '安装方式', labelEn: 'Install', value: 'pip' },
      { label: '核心场景', labelEn: 'Core context', value: 'Singlish / code-switching' },
    ],
    summary:
      'SGNLP 是 AI Singapore 在 SEA-LION 之前的本地语言 AI 工具包，聚焦 Singlish、多语言代码切换和新加坡本地 NLP 任务。',
    summaryEn:
      'SGNLP is AI Singapore’s localized language-AI toolkit before SEA-LION, focused on Singlish, multilingual code-switching, and Singapore-specific NLP tasks.',
    whatItIs: `SGNLP 是一个 Python 包，封装了若干来自新加坡 NLP 研究社区的模型。它关注的不是通用英文 NLP，而是新加坡语境：Singlish、英文/中文/马来语混用、地方实体和本地文本理解。

在 LLM 普及前，这类轻量模型更适合客服、社交媒体分析和政府文本处理。`,
    whatItIsEn: `SGNLP is a Python package that wraps models from Singapore’s NLP research community. Its focus is not generic English NLP, but the Singapore context: Singlish, English / Mandarin / Malay code-switching, local entities, and local text understanding.

Before LLMs became widely available, this kind of lightweight model was better suited to customer service, social-media analysis, and government-text processing.`,
    aiRelevance: `SGNLP 说明一个重要事实：语言 AI 的本地化不是从 SEA-LION 才开始的。新加坡英语和多语言混用让通用 NLP 工具经常失灵，轻量模型仍有边缘部署和实时处理价值。

它和 SEA-LION 的关系更像前后两代产品：SGNLP 是专项工具，SEA-LION 是通用区域大模型。`,
    aiRelevanceEn: `SGNLP shows an important fact: language-AI localization did not begin with SEA-LION. Singapore English and multilingual code-switching often break generic NLP tools, and lightweight models still retain value for edge deployment and real-time processing.

Its relationship with SEA-LION is closer to two product generations: SGNLP as the specialty toolkit, SEA-LION as the general regional LLM.`,
    singaporeRelevance: `SGNLP 是新加坡"语言主权"路线的早期工程化实践。它把本地语言现象当成产品问题处理，而不是等待全球模型自然覆盖。

这个页面未来适合继续补充：具体模型清单、demo 状态、是否仍被政府或企业系统使用，以及它与 SEA-LION embedding / ModernBERT 线的关系。`,
    singaporeRelevanceEn: `SGNLP is an early engineering expression of Singapore’s "language sovereignty" path. It treats local language phenomena as a product problem rather than waiting for global models to cover them naturally.

This page is a good future home for more detail: model list, demo status, whether government or enterprise systems still use it, and how it relates to SEA-LION embeddings / ModernBERT.`,
    milestones: [{ date: '2021', title: 'SGNLP 开源发布', titleEn: 'SGNLP open-sourced' }],
    resources: [
      {
        label: 'SGNLP GitHub',
        labelEn: 'SGNLP on GitHub',
        url: 'https://github.com/aisingapore/sgnlp',
        kind: 'github',
      },
      { label: 'SGNLP 文档 / Demo', labelEn: 'SGNLP docs / demo', url: 'https://sgnlp.aisingapore.net/', kind: 'docs' },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/sgnlp/', kind: 'ecosystem' },
    ],
  },
  {
    id: 'speech-lab',
    name: 'Speech Lab',
    nameEn: 'Speech Lab',
    owner: 'AI Singapore / NUS / NTU',
    ownerEn: 'AI Singapore / NUS / NTU',
    category: '本地语音 AI',
    categoryEn: 'Localized speech AI',
    status: '产品化服务',
    statusEn: 'Productized service',
    description: 'Singlish 语音转文字',
    descriptionEn: 'Singlish speech-to-text',
    stars: null,
    language: 'Speech AI',
    url: 'https://aisingapore.org/aiproducts/speech-lab/',
    websiteUrl: 'https://aisingapore.org/aiproducts/speech-lab/',
    founded: '2020s',
    updated: '2026-05-04',
    ecosystemId: 'speech-lab',
    metrics: [
      { label: '识别语言', labelEn: 'Recognized languages', value: 'English / Mandarin / Singlish' },
      { label: '部署形态', labelEn: 'Deployment', value: 'on-premise option' },
      { label: '主要场景', labelEn: 'Use cases', value: 'call centres' },
    ],
    summary: 'Speech Lab 是 AI Singapore 面向新加坡语音场景的产品线，重点处理 Singlish、英语/华语混用和本地口音。',
    summaryEn:
      'Speech Lab is AI Singapore’s product line for Singapore speech scenarios, focused on Singlish, English / Mandarin code-switching, and local accents.',
    whatItIs: `Speech Lab 的核心能力是把音频转成文字，覆盖英语、华语和 Singlish，并支持代码切换语音识别。AI Singapore 官方页面也强调它可以按行业场景重新训练，并提供本地部署选项。

典型用途包括客服中心转写、访谈转写、医疗咨询记录，以及聊天机器人和语音助手里的语音命令转写。`,
    whatItIsEn: `Speech Lab’s core capability is audio-to-text, covering English, Mandarin, and Singlish, with support for code-switching speech recognition. AI Singapore’s official page also stresses domain customization and an on-premise deployment option.

Typical uses include call-centre transcription, interview transcription, medical-consultation notes, and voice-command transcription for chatbots and digital assistants.`,
    aiRelevance: `语音 AI 是本地化最难也最容易被低估的部分。通用 ASR 模型在标准英语上很好，但在新加坡口音、Singlish 语气词和中英混用上会明显掉点。

Speech Lab 的价值在于把"新加坡人真的怎么说话"变成模型能力。`,
    aiRelevanceEn: `Speech AI is one of the hardest and most underestimated localization problems. Generic ASR models can be strong on standard English, yet degrade on Singapore accents, Singlish particles, and English-Mandarin mixing.

Speech Lab’s value is turning "how Singaporeans actually speak" into model capability.`,
    singaporeRelevance: `Speech Lab 很直接地服务新加坡公共服务和企业服务场景。政府热线、客服、医疗咨询都需要多语言语音转写，而这些场景又常常有敏感数据，适合本地化和本地部署。

它应该和 SGNLP、SEA-LION 一起看：三者构成新加坡语言 AI 的文本、语音、大模型三条线。`,
    singaporeRelevanceEn: `Speech Lab directly serves Singapore public-service and enterprise-service scenarios. Government hotlines, customer service, and medical consultations all need multilingual speech transcription, often with sensitive data, making localization and on-premise deployment important.

It should be read together with SGNLP and SEA-LION: together they form Singapore’s text, speech, and large-model language-AI lines.`,
    milestones: [
      {
        date: '2020s',
        title: 'Speech Lab 作为 AISG AI Bricks 产品推出',
        titleEn: 'Speech Lab launched as an AISG AI Bricks product',
      },
    ],
    resources: [
      {
        label: 'Speech Lab 官网',
        labelEn: 'Speech Lab official page',
        url: 'https://aisingapore.org/aiproducts/speech-lab/',
        kind: 'website',
      },
      {
        label: 'Speech Lab Demo',
        labelEn: 'Speech Lab demo',
        url: 'https://speechlab-demo.aisingapore.net/',
        kind: 'demo',
      },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/speech-lab/', kind: 'ecosystem' },
    ],
  },
  {
    id: 'synergos',
    name: 'Synergos',
    nameEn: 'Synergos',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    category: '联邦学习框架',
    categoryEn: 'Federated learning framework',
    status: '早期开源',
    statusEn: 'Early open source',
    description: '隐私保护联邦学习框架',
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
      { label: '最新发布', labelEn: 'Latest release', value: '2021' },
      { label: '核心方向', labelEn: 'Core direction', value: 'federated learning' },
    ],
    summary:
      'Synergos 是 AI Singapore 的联邦学习工具，目标是在不共享原始数据的情况下，让多个组织协同训练机器学习模型。',
    summaryEn:
      'Synergos is AI Singapore’s federated-learning tooling, designed to let multiple organizations jointly train machine-learning models without sharing raw data.',
    whatItIs: `Synergos 面向联邦学习网络里的协作、项目、实验、运行和参与方管理。它把复杂的联邦训练编排封装成驱动接口，降低多方训练的工程门槛。

从公开仓库看，它更像一个早期工程组件，而不是已经大规模商业化的产品。`,
    whatItIsEn: `Synergos handles collaboration, project, experiment, run, and participant management inside a federated-learning network. It wraps complex federated orchestration behind a driver interface, lowering the engineering threshold for multi-party training.

From the public repository, it looks more like an early engineering component than a broadly commercialized product.`,
    aiRelevance: `联邦学习解决的是 AI 里的硬约束：数据不能离开组织边界，但模型又需要跨组织学习。金融、医疗和公共部门都可能有这种需求。

Synergos 的价值不在流量，而在它代表的方向：隐私保护 AI、跨机构协作训练、合规前提下的数据价值释放。`,
    aiRelevanceEn: `Federated learning addresses a hard AI constraint: data cannot leave organizational boundaries, yet models may need to learn across organizations. Finance, healthcare, and public-sector settings all have this need.

Synergos’ value is less about traffic and more about the direction it represents: privacy-preserving AI, cross-institution collaborative training, and releasing data value under compliance constraints.`,
    singaporeRelevance: `Synergos 对新加坡尤其有意义，因为新加坡 AI 落地常常发生在强监管、高信任要求的行业。它连接的是 PDPA 数据保护、MAS 金融治理和 AI Singapore 应用工程能力。

未来需要补充的关键信息是：是否仍在内部项目中使用、是否与 PDPC / MAS 沙盒形成实际连接、是否有新的隐私计算路线替代它。`,
    singaporeRelevanceEn: `Synergos matters for Singapore because AI deployment often happens in highly regulated, high-trust sectors. It connects PDPA data protection, MAS financial governance, and AI Singapore’s applied engineering capability.

The key information to add later: whether it is still used internally, whether it connects to PDPC / MAS sandbox work, and whether newer privacy-computing approaches have replaced it.`,
    milestones: [{ date: '2021-09', title: 'Synergos v0.1.0 发布', titleEn: 'Synergos v0.1.0 released' }],
    resources: [
      {
        label: 'Synergos GitHub',
        labelEn: 'Synergos on GitHub',
        url: 'https://github.com/aisingapore/synergos',
        kind: 'github',
      },
      { label: '生态地图档案', labelEn: 'Ecosystem profile', url: '/ecosystem/synergos/', kind: 'ecosystem' },
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
    title: 'SEA-Guard: Culturally Grounded Multilingual Safeguard for Southeast Asia',
    titleZh: 'SEA-Guard：面向东南亚的文化本地化多语言安全护栏',
    arxivId: '2602.01618',
    url: 'https://arxiv.org/abs/2602.01618',
    translationUrl: '/papers/sea-guard-zh.pdf',
    year: 2026,
  },
  {
    title: 'SEA-SafeguardBench: Evaluating AI Safety in SEA Languages and Cultures',
    titleZh: 'SEA-SafeguardBench：东南亚语言与文化 AI 安全评测基准',
    arxivId: '2512.05501',
    url: 'https://arxiv.org/abs/2512.05501',
    translationUrl: '/papers/sea-safeguardbench-zh.pdf',
    year: 2025,
  },
  {
    title: 'SEA-LION: Southeast Asian Languages in One Network',
    titleZh: 'SEA-LION：东南亚语言统一网络',
    arxivId: '2504.05747',
    url: 'https://arxiv.org/abs/2504.05747',
    translationUrl: '/papers/sea-lion-zh.pdf',
    year: 2025,
  },
  {
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

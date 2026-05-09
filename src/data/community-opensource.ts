export type CommunityOpenSourceOrgType = 'university' | 'corporate-lab' | 'startup';

export interface CommunityOpenSourceMetric {
  label: string;
  labelEn?: string;
  labelJa?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  note?: string;
  noteEn?: string;
  noteJa?: string;
}

export interface CommunityOpenSourceMilestone {
  date: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
}

export interface CommunityOpenSourceResource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  url: string;
  kind: 'github' | 'website' | 'paper' | 'model' | 'docs' | 'demo' | 'organization';
}

export interface OpenSourceProject {
  id: string;
  name: string;
  nameEn?: string;
  nameJa?: string;
  org: string;
  orgEn?: string;
  orgJa?: string;
  orgType: CommunityOpenSourceOrgType;
  category: string;
  categoryEn?: string;
  categoryJa?: string;
  status: string;
  statusEn?: string;
  statusJa?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  stars?: number;
  url: string;
  websiteUrl?: string;
  language: string;
  license?: string;
  licenseEn?: string;
  licenseJa?: string;
  founded?: string;
  updated: string;
  papers?: string[];
  metrics?: CommunityOpenSourceMetric[];
  summary: string;
  summaryEn: string;
  summaryJa?: string;
  whatItIs: string;
  whatItIsEn: string;
  whatItIsJa?: string;
  aiRelevance: string;
  aiRelevanceEn: string;
  aiRelevanceJa?: string;
  singaporeRelevance: string;
  singaporeRelevanceEn: string;
  singaporeRelevanceJa?: string;
  milestones?: CommunityOpenSourceMilestone[];
  resources: CommunityOpenSourceResource[];
}

export const universityProjects: OpenSourceProject[] = [
  {
    id: 'colossal-ai',
    name: 'Colossal-AI',
    nameEn: 'Colossal-AI',
    org: 'NUS HPC-AI Lab',
    orgEn: 'NUS HPC-AI Lab',
    orgType: 'university',
    category: '分布式训练框架',
    categoryJa: '分散型訓練フレームワーク',
    categoryEn: 'Distributed training framework',
    status: '活跃维护',
    statusJa: '積極的なメンテナンス',
    statusEn: 'Actively maintained',
    description: '分布式深度学习训练框架，支持大模型高效训练',
    descriptionJa: '分散型深層学習訓練フレームワーク、大規模モデルの効率的な訓練に対応しています。',
    descriptionEn: 'Distributed deep-learning training framework optimised for efficient large-model training',
    stars: 41376,
    url: 'https://github.com/hpcaitech/ColossalAI',
    websiteUrl: 'https://www.colossalai.org',
    language: 'Python',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2021-10',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '41.3k+' },
      {
        label: '核心场景',
        labelJa: 'コアシナリオ',
        labelEn: 'Core use case',
        value: '大模型训练',
        valueJa: '大規模モデル訓練',
        valueEn: 'large-model training',
      },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '训练系统',
        valueJa: '訓練システム',
        valueEn: 'training system',
      },
    ],
    summary:
      'Colossal-AI 是新加坡高校开源里最有全球开发者能见度的项目之一：它解决的是大模型训练里的显存、并行和成本问题。',
    summaryJa:
      'Colossal-AI は、シンガポールの大学が開発するオープンソースプロジェクトの中で、グローバルな開発者にとって最も認知度の高いプロジェクトの一つです：大規模モデル訓練における GPU メモリ、並列処理、およびコストの問題を解決しています。',
    summaryEn:
      'Colossal-AI is one of the most globally visible open-source projects from Singapore’s university ecosystem: it tackles memory, parallelism, and cost problems in large-model training.',
    whatItIs: `Colossal-AI 是一个分布式 AI 训练系统。开发者可以用它做张量并行、流水线并行、ZeRO、异构内存管理和大模型推理优化，把单机难以承受的模型训练拆到多卡、多节点环境里。

它最早由 NUS HPC-AI Lab 孵化，后来形成面向全球开发者的开源项目和工程化组织。`,
    whatItIsJa: `Colossal-AI は分散型 AI 訓練システムです。開発者はテンソル並列化、パイプライン並列化、ZeRO、異種メモリ管理、および大規模モデル推論の最適化を実行できます。単一マシンでは処理できないモデル訓練を複数 GPU、複数ノード環境に分割します。

最初は NUS HPC-AI Lab によってインキュベートされ、その後グローバルな開発者向けのオープンソースプロジェクトと工学化組織へと発展しました。`,
    whatItIsEn: `Colossal-AI is a distributed AI training system. Developers use it for tensor parallelism, pipeline parallelism, ZeRO, heterogeneous memory management, and large-model inference optimization, splitting workloads that would overwhelm a single machine across multi-GPU and multi-node environments.

It was incubated by the NUS HPC-AI Lab and later grew into a global open-source engineering project.`,
    aiRelevance: `大模型竞争不只发生在模型权重上，也发生在训练系统上。Colossal-AI 的价值是把"能不能训练得起"这个问题工程化：降低显存压力、提高吞吐、让研究团队和中小公司更接近大模型训练能力。

这类基础设施项目不会直接面对终端用户，但会影响模型研发成本曲线。`,
    aiRelevanceJa: `大規模モデルの競争は、モデルの重みだけではなく、訓練システムでも発生しています。Colossal-AI の価値は、「訓練できるかどうか」という問題をエンジニアリング化することです：GPU メモリの圧力を低減し、スループットを向上させ、研究チームと中小企業が大規模モデルの訓練能力により近づけるようにします。

このような基盤インフラストラクチャプロジェクトは、エンドユーザーと直接対面することはありませんが、モデル研究開発のコスト曲線に影響を与えます。`,
    aiRelevanceEn: `Large-model competition is not only about model weights; it is also about training systems. Colossal-AI turns "can we afford to train this" into an engineering problem: reduce memory pressure, improve throughput, and bring large-model training closer to research teams and smaller companies.

This kind of infrastructure may not face end users directly, but it affects the cost curve of model development.`,
    singaporeRelevance: `Colossal-AI 显示新加坡高校不是只能做应用研究，也可以在全球 AI 基础设施层有存在感。它和 SEA-LION 这类模型项目互补：一个解决训练系统，一个解决区域模型供给。

对 sgai.md 来说，它是"新加坡是否能输出通用 AI 工程基础设施"的长期样本。`,
    singaporeRelevanceJa: `Colossal-AI は、シンガポールの大学がアプリケーション研究だけではなく、グローバルな AI インフラストラクチャレイヤーでも存在感を持つことができることを示しています。これは SEA-LION のようなモデルプロジェクトと相補的です：一つは訓練システムを解決し、もう一つは地域モデルの供給を解決します。

sgai.md の観点からは、これは「シンガポールが汎用 AI エンジニアリング基盤インフラストラクチャを輸出できるかどうか」という長期的なサンプルです。`,
    singaporeRelevanceEn: `Colossal-AI shows that Singapore’s universities are not limited to applied AI; they can also have a presence in global AI infrastructure. It complements model projects such as SEA-LION: one addresses training systems, the other regional model supply.

For sgai.md, it is a long-running sample of whether Singapore can export general AI engineering infrastructure.`,
    milestones: [
      {
        date: '2021-10',
        title: 'Colossal-AI 仓库创建',
        titleJa: 'Colossal-AI リポジトリ作成',
        titleEn: 'Colossal-AI repository created',
      },
      {
        date: '2023-2024',
        title: '进入大模型训练工具主流视野',
        titleJa: '大規模モデル訓練ツールの主流視野に進出',
        titleEn: 'Moves into the mainstream LLM training-tool conversation',
      },
    ],
    resources: [
      {
        label: 'Colossal-AI GitHub',
        labelEn: 'Colossal-AI on GitHub',
        url: 'https://github.com/hpcaitech/ColossalAI',
        kind: 'github',
      },
      {
        label: 'Colossal-AI 官网',
        labelJa: 'Colossal-AI 公式ウェブサイト',
        labelEn: 'Colossal-AI website',
        url: 'https://www.colossalai.org',
        kind: 'website',
      },
      { label: 'NUS HPC-AI Lab', labelEn: 'NUS HPC-AI Lab', url: 'https://ai.comp.nus.edu.sg', kind: 'organization' },
    ],
  },
  {
    id: 'openmmlab',
    name: 'OpenMMLab',
    nameEn: 'OpenMMLab',
    org: 'NTU MMLab',
    orgEn: 'NTU MMLab',
    orgType: 'university',
    category: '计算机视觉工具箱生态',
    categoryJa: 'コンピュータビジョンツールボックスエコシステム',
    categoryEn: 'Computer vision toolbox ecosystem',
    status: '活跃生态',
    statusJa: 'アクティブなエコシステム',
    statusEn: 'Active ecosystem',
    description: '全球最广泛使用的计算机视觉工具箱生态系统（MMDetection 等）',
    descriptionJa: '世界中で最も広く使われているコンピュータビジョンツールボックスエコシステム（MMDetection など）',
    descriptionEn: 'A widely used computer vision toolbox ecosystem, including MMDetection and related libraries',
    stars: 30000,
    url: 'https://github.com/open-mmlab',
    websiteUrl: 'https://openmmlab.com',
    language: 'Python',
    license: '按子项目不同',
    licenseJa: 'サブプロジェクト別に分類',
    licenseEn: 'Varies by sub-project',
    founded: '2018+',
    updated: '2026-05-04',
    metrics: [
      { label: '生态 Stars', labelJa: 'エコシステム Stars', labelEn: 'Ecosystem stars', value: '30k+' },
      { label: '代表项目', labelJa: '代表的なプロジェクト', labelEn: 'Flagship project', value: 'MMDetection' },
      {
        label: '核心领域',
        labelJa: 'コア領域',
        labelEn: 'Core domain',
        value: '视觉 AI',
        valueJa: 'ビジョン AI',
        valueEn: 'vision AI',
      },
    ],
    summary:
      'OpenMMLab 是计算机视觉工程社区的底层工具箱之一。它不是单个模型，而是一组让目标检测、分割、识别、3D 感知等任务可复用的开源框架。',
    summaryJa:
      'OpenMMLab はコンピュータビジョンエンジニアリングコミュニティの基盤ツールボックスの一つです。単一のモデルではなく、物体検出、セグメンテーション、認識、3D パーセプションなどのタスクを再利用可能にするオープンソースフレームワークのセットです。',
    summaryEn:
      'OpenMMLab is one of the base toolboxes of the computer-vision engineering community. It is not a single model, but a family of reusable frameworks for detection, segmentation, recognition, 3D perception, and related tasks.',
    whatItIs: `OpenMMLab 由一系列开源库组成，包括 MMDetection、MMSegmentation、MMClassification、MMOCR、MMDeploy 等。研究者可以用它复现实验，工程团队可以用它搭建视觉模型训练和推理 pipeline。

它的强项不是某一个 demo，而是工程标准化：统一配置、模型 zoo、训练脚本、评测方法和部署工具。`,
    whatItIsJa: `OpenMMLab は一連のオープンソースライブラリで構成され、MMDetection、MMSegmentation、MMClassification、MMOCR、MMDeploy などを含みます。研究者がそれを使って実験を再現でき、エンジニアリングチームがビジョンモデルの訓練と推論パイプラインを構築するのに使えます。

その強みは、単一の demo ではなく、エンジニアリングの標準化にあります：統一された設定、モデル zoo、訓練スクリプト、評価方法、デプロイメントツールです。`,
    whatItIsEn: `OpenMMLab is a family of open-source libraries including MMDetection, MMSegmentation, MMClassification, MMOCR, MMDeploy, and more. Researchers use it to reproduce experiments, while engineering teams use it to build computer-vision training and inference pipelines.

Its strength is not a single demo, but engineering standardization: consistent configuration, model zoos, training scripts, evaluation methods, and deployment tooling.`,
    aiRelevance: `视觉 AI 的落地很依赖工具链。OpenMMLab 降低了从论文模型到可训练、可评测、可部署系统的门槛，也让许多下游项目不必从零写检测和分割框架。

在多模态模型兴起后，传统 CV 工具箱仍有价值：工业检测、城市感知、医疗影像和边缘部署并不会全部被聊天式模型取代。`,
    aiRelevanceJa: `視覚 AI の実装はツールチェーンに大きく依存しています。OpenMMLab は、論文モデルから訓練可能、評価可能、デプロイ可能なシステムへの敷居を低くしました。また、多くの下流プロジェクトが検出と分割フレームワークをゼロから書く必要がなくなっています。

マルチモーダルモデルが台頭した後も、従来の CV ツールボックスは依然として価値があります：産業用検出、都市センシング、医療画像、およびエッジデプロイメントは、全てが会話型モデルに置き換わるわけではありません。`,
    aiRelevanceEn: `Vision AI deployment depends heavily on tooling. OpenMMLab lowers the path from research models to trainable, evaluable, deployable systems, so downstream projects do not have to rebuild detection and segmentation frameworks from scratch.

Even after multimodal models rise, classical CV toolboxes remain useful: industrial inspection, urban sensing, medical imaging, and edge deployment will not all be replaced by chat-style models.`,
    singaporeRelevance: `OpenMMLab 把 NTU MMLab 的研究影响力转成了全球工程社区资产。它是新加坡高校"通过开源基础库影响世界"的代表案例。

未来值得追踪的是 OpenMMLab 如何与多模态、机器人和边缘 AI 工具链连接，而不是只停留在传统视觉任务。`,
    singaporeRelevanceJa: `OpenMMLab は NTU MMLab の研究インパクトを、グローバルなエンジニアリングコミュニティの資産に変えました。これはシンガポール高等教育機関が「オープンソースの基盤ライブラリを通じて世界に影響を与える」という代表的なケースです。

将来注視する価値があるのは、OpenMMLab がマルチモーダル、ロボティクス、エッジ AI ツールチェーンとどのように接続するか、つまり従来のビジョンタスクに留まるだけではない、という点です。`,
    singaporeRelevanceEn: `OpenMMLab turns NTU MMLab’s research influence into a global engineering-community asset. It is a representative case of a Singapore university influencing the world through open-source base libraries.

The point to watch is how OpenMMLab connects with multimodal, robotics, and edge-AI toolchains rather than remaining only in classical vision tasks.`,
    milestones: [
      {
        date: '2018+',
        title: 'MMDetection 等核心项目陆续开源',
        titleJa: 'MMDetection などのコアプロジェクトが段階的にオープンソース化',
        titleEn: 'Core projects such as MMDetection open-sourced',
      },
      {
        date: '2020s',
        title: '形成 OpenMMLab 工具箱生态',
        titleJa: 'OpenMMLab ツールボックスエコシステムを形成',
        titleEn: 'OpenMMLab grows into a toolbox ecosystem',
      },
    ],
    resources: [
      {
        label: 'OpenMMLab GitHub',
        labelEn: 'OpenMMLab on GitHub',
        url: 'https://github.com/open-mmlab',
        kind: 'github',
      },
      {
        label: 'OpenMMLab 官网',
        labelJa: 'OpenMMLab 公式ウェブサイト',
        labelEn: 'OpenMMLab website',
        url: 'https://openmmlab.com',
        kind: 'website',
      },
    ],
  },
  {
    id: 'next-gpt',
    name: 'NExT-GPT',
    nameEn: 'NExT-GPT',
    org: 'NUS NExT++ Research Center',
    orgEn: 'NUS NExT++ Research Center',
    orgType: 'university',
    category: '任意模态互转模型',
    categoryJa: '任意モダリティ相互変換モデル',
    categoryEn: 'Any-to-any multimodal model',
    status: '研究开源',
    statusJa: 'オープンソース研究',
    statusEn: 'Research open source',
    description: '首个任意模态互转大语言模型（文本、图像、视频、音频）',
    descriptionJa: '最初の任意モダリティ相互変換大言語モデル（テキスト、画像、動画、音声）',
    descriptionEn: 'An any-to-any multimodal LLM across text, image, video, and audio',
    stars: 3621,
    url: 'https://github.com/NExT-GPT/NExT-GPT',
    websiteUrl: 'https://next-gpt.github.io',
    language: 'Python',
    license: 'BSD-3-Clause',
    licenseEn: 'BSD-3-Clause',
    founded: '2023-08',
    updated: '2026-05-04',
    papers: ['ICML 2024'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '3.6k+' },
      { label: '论文', labelJa: '論文', labelEn: 'Paper', value: 'ICML 2024' },
      {
        label: '模态',
        labelJa: 'モダリティ',
        labelEn: 'Modalities',
        value: '文本 / 图像 / 视频 / 音频',
        valueJa: 'テキスト / 画像 / 動画 / 音声',
        valueEn: 'text / image / video / audio',
      },
    ],
    summary: 'NExT-GPT 是 NUS 在多模态大模型上的代表性项目，目标是让一个系统在文本、图像、视频、音频之间理解和生成。',
    summaryJa:
      'NExT-GPT は、マルチモーダル大規模モデルにおける NUS の代表的なプロジェクトであり、テキスト、画像、動画、音声の間で理解と生成を行うシステムを実現することを目標としています。',
    summaryEn:
      'NExT-GPT is a representative NUS multimodal LLM project, aiming to let one system understand and generate across text, image, video, and audio.',
    whatItIs: `NExT-GPT 把大语言模型作为中枢，连接不同模态的编码器和生成器。用户可以输入文本、图片、视频或音频，系统再输出另一种或多种模态。

它的意义在于把多模态从"图文问答"推向更完整的任意模态互转。`,
    whatItIsJa: `NExT-GPT は大言語モデルを中枢として、異なるモダリティのエンコーダーとジェネレーターを接続しています。ユーザーはテキスト、画像、動画、または音声を入力できる一方、システムは別の、または複数のモダリティを出力します。

その意義は、マルチモーダルを「画像・テキスト質問応答」からより完全な任意モダリティ相互変換へ推し進めることです。`,
    whatItIsEn: `NExT-GPT uses a large language model as the hub, connecting encoders and generators for different modalities. A user can input text, images, videos, or audio, and the system can output another modality or multiple modalities.

Its point is pushing multimodality beyond image-text question answering toward fuller any-to-any conversion.`,
    aiRelevance: `多模态是大模型下一阶段的核心方向之一。NExT-GPT 提前探索的是模型编排问题：如何让不同专业模型围绕 LLM 协同，而不是每一种输入输出都重训一个巨型模型。

这种路线对研究很重要，也给应用层提供了可组合的架构参考。`,
    aiRelevanceJa: `マルチモーダルは大規模言語モデルの次段階の中核的な方向の一つです。NExT-GPT が早期に探索していたのはモデルオーケストレーションの問題です：異なる専門モデルが LLM を中心に協調するにはどうするか、ということで、すべての入出力タイプに対して巨大なモデルを再訓練するのではなく。

このアプローチは研究にとって重要であり、また応用層に対して構成可能なアーキテクチャの参考も提供します。`,
    aiRelevanceEn: `Multimodality is one of the core directions for the next stage of large models. NExT-GPT explores the orchestration problem early: how specialized models can coordinate around an LLM instead of retraining one giant model for every input-output pairing.

That path matters for research and gives application builders a composable architecture reference.`,
    singaporeRelevance: `NExT-GPT 说明 NUS 在多模态基础研究上有全球可见成果。它不是新加坡本地应用项目，而是新加坡学术机构参与全球模型范式竞争的样本。

这类项目未来适合继续补充引用、后续模型、产业转化和与 NUS 其他多模态团队的关系。`,
    singaporeRelevanceJa: `NExT-GPT は、NUS がマルチモーダル基礎研究で世界的に可視化できる成果を有することを示しています。これはシンガポール現地のアプリケーションプロジェクトではなく、シンガポール学術機関がグローバルモデルパラダイム競争に参加するサンプルです。

このようなプロジェクトは、今後、引用文献の継続的な補充、後続モデル、産業化、および NUS の他のマルチモーダルチームとの関係を継続することが適切です。`,
    singaporeRelevanceEn: `NExT-GPT shows that NUS has globally visible work in multimodal foundation-model research. It is not a local Singapore application project, but a sample of Singapore academia participating in global model-paradigm competition.

This page is a place to keep adding citations, follow-on models, industrial translation, and links to other NUS multimodal teams.`,
    milestones: [
      {
        date: '2023-08',
        title: 'NExT-GPT 仓库发布',
        titleJa: 'NExT-GPT リポジトリリリース',
        titleEn: 'NExT-GPT repository released',
      },
      {
        date: '2024',
        title: '论文发表于 ICML 2024',
        titleJa: '論文は ICML 2024 で発表されました',
        titleEn: 'Paper published at ICML 2024',
      },
    ],
    resources: [
      {
        label: 'NExT-GPT GitHub',
        labelEn: 'NExT-GPT on GitHub',
        url: 'https://github.com/NExT-GPT/NExT-GPT',
        kind: 'github',
      },
      {
        label: 'NExT-GPT 项目页',
        labelJa: 'NExT-GPT プロジェクトページ',
        labelEn: 'NExT-GPT project page',
        url: 'https://next-gpt.github.io',
        kind: 'website',
      },
    ],
  },
  {
    id: 'show-o',
    name: 'Show-o',
    nameEn: 'Show-o',
    org: 'NUS Show Lab',
    orgEn: 'NUS Show Lab',
    orgType: 'university',
    category: '多模态理解与生成模型',
    categoryJa: 'マルチモーダル理解・生成モデル',
    categoryEn: 'Multimodal understanding and generation model',
    status: '活跃研究线',
    statusJa: '活発な研究ライン',
    statusEn: 'Active research line',
    description: '统一多模态理解与生成的单 Transformer 模型',
    descriptionJa: 'マルチモーダル理解・生成を統一した単一 Transformer モデル',
    descriptionEn: 'A single-Transformer model for unified multimodal understanding and generation',
    stars: 1923,
    url: 'https://github.com/showlab/Show-o',
    websiteUrl: 'https://showlab.github.io/Show-o/',
    language: 'Python / Models',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2024-08',
    updated: '2026-05-04',
    papers: ['ICLR 2025', 'NeurIPS 2025'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '1.9k+' },
      { label: '论文', labelJa: '論文', labelEn: 'Papers', value: 'ICLR / NeurIPS' },
      {
        label: '核心能力',
        labelJa: 'コア能力',
        labelEn: 'Core capability',
        value: '理解 + 生成',
        valueJa: '理解 + 生成',
        valueEn: 'understanding + generation',
      },
    ],
    summary:
      'Show-o 是 NUS Show Lab 的多模态基础模型路线：用一个 Transformer 同时处理图像理解和图像生成，而不是把两类能力拆成不同系统。',
    summaryJa:
      'Show-o は NUS Show Lab のマルチモーダル基盤モデルラインです。1 つの Transformer で画像理解と画像生成を同時に処理するもので、この 2 つの能力を異なるシステムに分割するのではありません。',
    summaryEn:
      'Show-o is a multimodal foundation-model line from NUS Show Lab: one Transformer handles both image understanding and image generation instead of splitting the two capabilities into separate systems.',
    whatItIs: `Show-o 的目标是统一多模态理解和生成。它把视觉理解、文本条件生成、图像生成等能力放进一个模型框架里，试图减少"理解模型"和"生成模型"之间的割裂。

Show Lab 后续还推进了 Show-o2，把这条路线继续扩展到更强的生成和理解能力。`,
    whatItIsJa: `Show-o の目標はマルチモーダルな理解と生成を統一することです。視覚理解、テキスト条件付き生成、画像生成などの能力を 1 つのモデルフレームワークに統合し、「理解モデル」と「生成モデル」の間の分断を減らそうとしています。

Show Lab はその後、Show-o2 を推し進め、このラインをより強力な生成と理解能力へと拡張し続けています。`,
    whatItIsEn: `Show-o aims to unify multimodal understanding and generation. It places visual understanding, text-conditioned generation, image generation, and related capabilities inside one model framework, reducing the split between "understanding models" and "generation models."

Show Lab later continued this line with Show-o2, extending the approach toward stronger generation and understanding.`,
    aiRelevance: `多模态模型正在从拼接式系统走向统一架构。Show-o 的问题意识很直接：如果一个模型既能看懂图像，也能生成图像，很多交互式设计、编辑、视觉问答和内容生产流程会更自然。

这也是开源多模态研究里的关键方向。`,
    aiRelevanceJa: `マルチモーダルモデルは、結合型システムから統一的なアーキテクチャへ移行しています。Show-o の問題意識は非常に直接的です。もしあるモデルが画像を理解でき、かつ画像も生成できるなら、多くのインタラクティブデザイン、編集、ビジュアル質問応答、およびコンテンツ生産プロセスはより自然になるでしょう。

これはオープンソースマルチモーダル研究における重要な方向です。`,
    aiRelevanceEn: `Multimodal models are moving from stitched systems toward unified architectures. Show-o’s question is direct: if one model can both understand and generate images, many interactive design, editing, visual QA, and content-production workflows become more natural.

That makes it an important direction in open multimodal research.`,
    singaporeRelevance: `Show-o 把 NUS Show Lab 放在全球多模态开源研究图谱上。对新加坡来说，它是"高校实验室输出前沿模型"的样本，而不是政府项目或企业应用。

未来可以继续追踪 Show Lab 的模型系列、论文接受情况、Hugging Face 模型使用量和是否形成产业工具。`,
    singaporeRelevanceJa: `Show-o は NUS Show Lab をグローバルなマルチモーダルオープンソース研究ランドスケープに位置づけています。シンガポールにとって、それは「大学実験室が最先端モデルを出力する」という事例であり、政府プロジェクトや企業アプリケーションではありません。

今後は、Show Lab のモデルシリーズ、論文採択状況、Hugging Face モデルの使用量、および産業ツール化の有無を引き続き追跡することができます。`,
    singaporeRelevanceEn: `Show-o places NUS Show Lab on the global map of open multimodal research. For Singapore, it is a sample of a university lab exporting frontier models, not a government programme or enterprise application.

Future tracking should cover Show Lab’s model series, paper acceptances, Hugging Face usage, and whether the work turns into production tools.`,
    milestones: [
      {
        date: '2024-08',
        title: 'Show-o 仓库创建',
        titleJa: 'Show-o リポジトリ作成',
        titleEn: 'Show-o repository created',
      },
      {
        date: '2025-01',
        title: 'Show-o 接收为 ICLR 2025 论文',
        titleJa: 'Show-o が ICLR 2025 論文として採択される',
        titleEn: 'Show-o accepted to ICLR 2025',
      },
      {
        date: '2025-09',
        title: 'Show-o2 接收为 NeurIPS 2025 论文',
        titleJa: 'Show-o2 が NeurIPS 2025 論文として採択される',
        titleEn: 'Show-o2 accepted to NeurIPS 2025',
      },
    ],
    resources: [
      { label: 'Show-o GitHub', labelEn: 'Show-o on GitHub', url: 'https://github.com/showlab/Show-o', kind: 'github' },
      {
        label: 'Show-o 项目页',
        labelJa: 'Show-o プロジェクトページ',
        labelEn: 'Show-o project page',
        url: 'https://showlab.github.io/Show-o/',
        kind: 'website',
      },
      {
        label: 'Show Lab Hugging Face',
        labelEn: 'Show Lab on Hugging Face',
        url: 'https://huggingface.co/showlab',
        kind: 'model',
      },
    ],
  },
  {
    id: 'showui',
    name: 'ShowUI',
    nameEn: 'ShowUI',
    org: 'NUS Show Lab',
    orgEn: 'NUS Show Lab',
    orgType: 'university',
    category: 'GUI Agent 模型',
    categoryJa: 'GUI Agent モデル',
    categoryEn: 'GUI agent model',
    status: '活跃研究线',
    statusJa: '活発な研究ライン',
    statusEn: 'Active research line',
    description: '面向 GUI Agent 与 Computer Use 的视觉-语言-动作模型',
    descriptionJa: 'GUI Agent および Computer Use に向けた視覚-言語-動作モデル',
    descriptionEn: 'A vision-language-action model for GUI agents and computer use',
    stars: 1822,
    url: 'https://github.com/showlab/ShowUI',
    websiteUrl: 'https://showlab.github.io/ShowUI/',
    language: 'Python / Models',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2024-10',
    updated: '2026-05-04',
    papers: ['CVPR 2025'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '1.8k+' },
      { label: '论文', labelJa: '論文', labelEn: 'Paper', value: 'CVPR 2025' },
      { label: '方向', labelJa: '方向', labelEn: 'Direction', value: 'Computer Use' },
    ],
    summary: 'ShowUI 是面向 GUI Agent 的开源模型，让模型通过截图理解界面，并输出可点击坐标或动作。',
    summaryJa:
      'ShowUI は GUI Agent に向けたオープンソースモデルであり、モデルがスクリーンショットを通じてインターフェイスを理解し、クリック可能な座標またはアクションを出力できるようにしています。',
    summaryEn:
      'ShowUI is an open model for GUI agents, letting a model understand interfaces from screenshots and output clickable coordinates or actions.',
    whatItIs: `ShowUI 关注的是人类每天实际使用的软件界面：网页、应用窗口、按钮、输入框、菜单。它让模型从视觉界面中定位操作目标，服务于 Computer Use 和 GUI 自动化。

这和纯文本 agent 不同：很多真实软件没有干净 API，也没有完整 DOM 或 accessibility tree。ShowUI 试图直接从画面理解操作。`,
    whatItIsJa: `ShowUI は、人間が毎日実際に使用するソフトウェアインターフェイスに焦点を当てています：ウェブページ、アプリケーションウィンドウ、ボタン、入力フィールド、メニューです。モデルが視覚インターフェイスから操作対象を特定し、Computer Use および GUI 自動化に対応しています。

これはテキストのみの agent とは異なります：多くの実在するソフトウェアはクリーンな API も完全な DOM もアクセシビリティツリーも備えていません。ShowUI は画面から直接操作を理解しようとしています。`,
    whatItIsEn: `ShowUI focuses on the software interfaces people actually use every day: webpages, app windows, buttons, input boxes, and menus. It lets a model locate action targets from visual interfaces, serving computer use and GUI automation.

This differs from pure text agents: many real applications lack clean APIs, complete DOMs, or accessibility trees. ShowUI tries to understand actions directly from the screen.`,
    aiRelevance: `Agent 落地的瓶颈之一是界面操作。模型会说计划不难，真正难的是在复杂软件里点击对地方、理解状态变化、从失败中恢复。

ShowUI 把 GUI 视觉理解变成模型任务，是 agent 从对话走向真实电脑操作的一条关键路线。`,
    aiRelevanceJa: `Agent の実装における 1 つのボトルネックはインターフェース操作です。モデルが計画を述べることは難しくありませんが、本当に難しいのは複雑なソフトウェア内で正確な位置をクリックすること、状態の変化を理解すること、失敗から回復することです。

ShowUI は GUI の視覚理解をモデルタスクに変え、agent が会話から実際のコンピュータ操作へ移行するための重要なルートです。`,
    aiRelevanceEn: `One bottleneck for agent deployment is interface operation. Having a model write a plan is not the hard part; clicking the right place, understanding state changes, and recovering from failure inside complex software is harder.

ShowUI turns GUI visual understanding into a model task, making it a key path from chat agents toward real computer operation.`,
    singaporeRelevance: `ShowUI 对新加坡的意义在于它切中了企业自动化和 agent 工具链。新加坡大量 AI 落地发生在金融、政务、医疗、物流等复杂系统里，很多流程依然要穿过旧界面。

如果 GUI Agent 变成通用能力，ShowUI 这类研究会成为连接模型和真实软件工作流的基础模块。`,
    singaporeRelevanceJa: `ShowUI がシンガポールにとって重要な意義を持つのは、企業オートメーションと agent ツールチェーンに的確に対応しているからです。シンガポールでは多くの AI 実装が金融、行政、医療、ロジスティクスなどの複雑なシステムで実施されており、多くのプロセスが依然として古いインターフェースを通過する必要があります。

GUI Agent が汎用能力になれば、ShowUI などの研究はモデルと実際のソフトウェアワークフローを接続する基礎モジュールになるでしょう。`,
    singaporeRelevanceEn: `ShowUI matters for Singapore because it cuts into enterprise automation and agent tooling. Much AI deployment in Singapore happens inside finance, government, healthcare, and logistics systems, where many workflows still pass through legacy interfaces.

If GUI agents become a general capability, work such as ShowUI becomes a base module connecting models to real software workflows.`,
    milestones: [
      {
        date: '2024-10',
        title: 'ShowUI 仓库创建',
        titleJa: 'ShowUI リポジトリ作成',
        titleEn: 'ShowUI repository created',
      },
      {
        date: '2025-02',
        title: 'ShowUI 接收为 CVPR 2025 论文',
        titleJa: 'ShowUI が CVPR 2025 論文として採択される',
        titleEn: 'ShowUI accepted to CVPR 2025',
      },
    ],
    resources: [
      { label: 'ShowUI GitHub', labelEn: 'ShowUI on GitHub', url: 'https://github.com/showlab/ShowUI', kind: 'github' },
      {
        label: 'ShowUI 论文',
        labelJa: 'ShowUI 論文',
        labelEn: 'ShowUI paper',
        url: 'https://arxiv.org/abs/2411.17465',
        kind: 'paper',
      },
      {
        label: 'Show Lab Hugging Face',
        labelEn: 'Show Lab on Hugging Face',
        url: 'https://huggingface.co/showlab',
        kind: 'model',
      },
    ],
  },
  {
    id: 'videosys',
    name: 'VideoSys',
    nameEn: 'VideoSys',
    org: 'NUS HPC-AI Lab',
    orgEn: 'NUS HPC-AI Lab',
    orgType: 'university',
    category: '视频生成系统',
    categoryJa: '動画生成システム',
    categoryEn: 'Video generation system',
    status: '研究开源',
    statusJa: 'オープンソース研究',
    statusEn: 'Research open source',
    description: '面向视频生成模型的高效系统框架',
    descriptionJa: '動画生成モデル向けの効率的なシステムフレームワーク',
    descriptionEn: 'An efficient system framework for video generation models',
    stars: 2021,
    url: 'https://github.com/NUS-HPC-AI-Lab/VideoSys',
    language: 'Python',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2024-02',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '2.0k+' },
      {
        label: '核心场景',
        labelJa: 'コアシナリオ',
        labelEn: 'Core use case',
        value: '视频生成',
        valueJa: 'ビデオ生成',
        valueEn: 'video generation',
      },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '系统框架',
        valueJa: 'システムフレームワーク',
        valueEn: 'system framework',
      },
    ],
    summary:
      'VideoSys 处理的是视频生成背后的系统问题：视频模型计算量大、显存压力高，必须靠系统优化才能变得可训练、可服务。',
    summaryJa:
      'VideoSys が扱うのは、動画生成の背後にあるシステムの問題です：動画モデルは計算量が大きく、GPU メモリの負荷が高く、システム最適化を通じてのみ訓練可能で提供可能になります。',
    summaryEn:
      'VideoSys addresses the systems problem behind video generation: video models are compute-heavy and memory-hungry, so they need system optimization to become trainable and serviceable.',
    whatItIs: `VideoSys 是一个视频生成系统框架，目标是让开发者更容易训练、优化和运行视频生成模型。它延续了 NUS HPC-AI Lab 的系统路线：不是只做模型效果，而是让模型更便宜、更快、更可用。

在视频生成领域，系统层的效率几乎决定了产品能不能大规模提供服务。`,
    whatItIsJa: `VideoSys は、開発者が動画生成モデルをより簡単に訓練、最適化、実行できることを目的とした動画生成システムフレームワークです。NUS HPC-AI Lab のシステム路線を継続しています：モデルの効果だけを追求するのではなく、モデルをより安価で、より高速で、より利用可能にすることです。

動画生成の領域では、システム層の効率が、大規模なサービス提供の可否をほぼ決定しています。`,
    whatItIsEn: `VideoSys is a system framework for video generation, designed to make it easier to train, optimize, and run video generation models. It follows the NUS HPC-AI Lab’s systems line: not only model quality, but making models cheaper, faster, and usable.

In video generation, systems efficiency can determine whether a product can serve users at scale.`,
    aiRelevance: `视频生成是生成式 AI 成本最高的方向之一。文本模型已经很贵，视频还要处理时序、空间分辨率和长上下文。

VideoSys 的意义在于把视频生成从 demo 推向工程系统，让研究和应用团队能更实际地部署视频模型。`,
    aiRelevanceJa: `動画生成は生成型 AI の中でも最もコスト高い方向の一つです。テキストモデルはすでに高コストですが、動画はさらに時間軸、空間解像度、および長いコンテキストを処理する必要があります。

VideoSys の意義は、動画生成をデモから工学システムへと推し進め、研究チームとアプリケーションチームがより実用的に動画モデルをデプロイできるようにすることです。`,
    aiRelevanceEn: `Video generation is one of the costliest areas of generative AI. Text models are already expensive; video must handle time, spatial resolution, and longer contexts.

VideoSys matters because it pushes video generation from demos toward engineering systems, making deployment more realistic for research and application teams.`,
    singaporeRelevance: `VideoSys 和 Colossal-AI 一起构成 NUS HPC-AI Lab 的 AI 系统资产。它说明新加坡在模型竞争中的一个可行位置：不一定只拼最大模型，也可以拼模型背后的训练和服务效率。

这对算力约束明显的新加坡尤其现实。`,
    singaporeRelevanceJa: `VideoSys と Colossal-AI は、NUS HPC-AI Lab の AI システム資産を構成しています。これはモデル競争におけるシンガポールの実行可能な立場を示しています：必ずしも最大のモデルに限定する必要はなく、モデルの背後にある訓練と提供効率で競争することもできます。

これは計算能力の制約が明らかなシンガポールにとって特に現実的です。`,
    singaporeRelevanceEn: `VideoSys and Colossal-AI together form the AI-systems asset base of the NUS HPC-AI Lab. It shows a feasible position for Singapore in model competition: not only building the largest models, but improving the training and serving efficiency behind them.

That is especially realistic for Singapore, where compute is a visible constraint.`,
    milestones: [
      {
        date: '2024-02',
        title: 'VideoSys 仓库创建',
        titleJa: 'VideoSys リポジトリ作成',
        titleEn: 'VideoSys repository created',
      },
    ],
    resources: [
      {
        label: 'VideoSys GitHub',
        labelEn: 'VideoSys on GitHub',
        url: 'https://github.com/NUS-HPC-AI-Lab/VideoSys',
        kind: 'github',
      },
      { label: 'NUS HPC-AI Lab', labelEn: 'NUS HPC-AI Lab', url: 'https://ai.comp.nus.edu.sg', kind: 'organization' },
    ],
  },
  {
    id: 'tslanet',
    name: 'TSLANet',
    nameEn: 'TSLANet',
    org: 'SUTD',
    orgEn: 'SUTD',
    orgType: 'university',
    category: '时序基础模型',
    categoryJa: '時系列基礎モデル',
    categoryEn: 'Time-series foundation model',
    status: '研究开源',
    statusJa: 'オープンソース研究',
    statusEn: 'Research open source',
    description: '自适应频谱时序分析网络',
    descriptionJa: '適応スペクトル時系列分析ネットワーク',
    descriptionEn: 'Adaptive spectral network for time-series analysis',
    stars: 258,
    url: 'https://github.com/emadeldeen24/TSLANet',
    websiteUrl: 'https://arxiv.org/abs/2404.08472',
    language: 'Python',
    license: 'MIT',
    licenseEn: 'MIT',
    founded: '2024-04',
    updated: '2026-05-04',
    papers: ['ICML 2024'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '258' },
      { label: '论文', labelJa: '論文', labelEn: 'Paper', value: 'ICML 2024' },
      {
        label: '任务',
        labelJa: 'タスク',
        labelEn: 'Tasks',
        value: '时序分析',
        valueJa: '時系列分析',
        valueEn: 'time-series analysis',
      },
    ],
    summary: 'TSLANet 是 SUTD 参与的时序 AI 研究项目，用轻量自适应频谱网络处理预测、分类和表示学习等时间序列任务。',
    summaryJa:
      'TSLANet は、SUTD が参加する時系列 AI 研究プロジェクトであり、軽量で適応的なスペクトルネットワークを使用して、予測、分類、表現学習などの時系列タスクを処理します。',
    summaryEn:
      'TSLANet is a time-series AI research project involving SUTD, using a lightweight adaptive spectral network for forecasting, classification, and representation learning tasks.',
    whatItIs: `TSLANet 的全称是 Time Series Lightweight Adaptive Network。它结合卷积操作和频谱分析，用 Adaptive Spectral Block 捕捉长期和短期时序关系，并通过自适应阈值降低噪声。

它不是通用聊天模型，而是面向传感器、金融、工业、医疗等连续时间数据的模型路线。`,
    whatItIsJa: `TSLANet の正式名称は Time Series Lightweight Adaptive Network です。畳み込み操作とスペクトル分析を組み合わせ、Adaptive Spectral Block を使用して長期と短期の時系列関係をキャプチャし、適応的なしきい値によってノイズを低減します。

これは汎用チャットモデルではなく、センサー、金融、産業、医療などの連続時間データに向けたモデルの方向性です。`,
    whatItIsEn: `TSLANet stands for Time Series Lightweight Adaptive Network. It combines convolutional operations and spectral analysis, using an Adaptive Spectral Block to capture long- and short-term temporal relationships while reducing noise through adaptive thresholding.

It is not a general chat model; it is a model line for continuous time data in sensors, finance, industry, healthcare, and related domains.`,
    aiRelevance: `时序数据是 AI 应用里很重要但不够显眼的一类数据。企业和公共系统大量信号都不是文本或图片，而是连续指标：负载、价格、用电量、病人生命体征、设备状态。

TSLANet 代表的是"基础模型"概念向非文本数据扩展。`,
    aiRelevanceJa: `時系列データは AI アプリケーションにおいて非常に重要ですが、見落とされやすいデータの一種です。企業と公共システムの多くのシグナルはテキストや画像ではなく、継続的な指標です：負荷、価格、電力消費、患者の生命徴候、デバイス状態。

TSLANet が代表するのは、「基礎モデル」の概念をテキスト以外のデータへ拡張することです。`,
    aiRelevanceEn: `Time-series data is important but less visible in AI applications. Many enterprise and public-sector signals are not text or images, but continuous measurements: load, prices, electricity usage, patient vitals, and equipment state.

TSLANet represents the extension of the "foundation model" idea into non-text data.`,
    singaporeRelevance: `SUTD 的强项长期在工程、设计和系统交叉。TSLANet 这类项目适合新加坡的真实产业场景：城市基础设施、工业系统、医疗监测、金融风控。

未来页面可以继续补充具体 benchmark、数据集和是否有本地行业应用。`,
    singaporeRelevanceJa: `SUTD の強みは長期にわたり、エンジニアリング、デザイン、システムの交差点にあります。TSLANet のようなプロジェクトはシンガポールの実際の産業シーン、すなわち都市インフラ、工業システム、医療モニタリング、金融リスク管理に適しています。

今後のページは、具体的なベンチマーク、データセット、および地域産業応用の有無を継続して補充することができます。`,
    singaporeRelevanceEn: `SUTD’s strength sits at the intersection of engineering, design, and systems. Projects such as TSLANet fit Singapore’s real industrial scenarios: urban infrastructure, industrial systems, health monitoring, and financial risk.

This page can later add concrete benchmarks, datasets, and whether local industry applications emerge.`,
    milestones: [
      {
        date: '2024-04',
        title: 'TSLANet 论文和代码公开',
        titleJa: 'TSLANet 論文とコード公開',
        titleEn: 'TSLANet paper and code released',
      },
      {
        date: '2024',
        title: '论文发表于 ICML 2024',
        titleJa: '論文は ICML 2024 で発表されました',
        titleEn: 'Paper published at ICML 2024',
      },
    ],
    resources: [
      {
        label: 'TSLANet GitHub',
        labelEn: 'TSLANet on GitHub',
        url: 'https://github.com/emadeldeen24/TSLANet',
        kind: 'github',
      },
      {
        label: 'TSLANet 论文',
        labelJa: 'TSLANet 論文',
        labelEn: 'TSLANet paper',
        url: 'https://arxiv.org/abs/2404.08472',
        kind: 'paper',
      },
    ],
  },
];

export const corporateLabProjects: OpenSourceProject[] = [
  {
    id: 'lavis-blip',
    name: 'LAVIS / BLIP',
    nameEn: 'LAVIS / BLIP',
    org: 'Salesforce AI Research Singapore',
    orgEn: 'Salesforce AI Research Singapore',
    orgType: 'corporate-lab',
    category: '视觉语言基础模型',
    categoryJa: 'ビジョン言語基礎モデル',
    categoryEn: 'Vision-language foundation models',
    status: '经典开源资产',
    statusJa: 'クラシックなオープンソース資産',
    statusEn: 'Classic open-source asset',
    description: '视觉语言基础模型和一站式库，全球图文 AI 的基石之一',
    descriptionJa: 'ビジョン言語基礎モデルおよび統合ライブラリ、グローバル画像テキスト AI の基石の一つ',
    descriptionEn: 'Vision-language foundation models and a one-stop library; a cornerstone of global image-text AI',
    stars: 11214,
    url: 'https://github.com/salesforce/LAVIS',
    language: 'Python / Jupyter Notebook',
    license: 'BSD-3-Clause',
    licenseEn: 'BSD-3-Clause',
    founded: '2022-08',
    updated: '2026-05-04',
    papers: ['ICML 2022', 'ICML 2023'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '11.2k+' },
      { label: '代表模型', labelJa: '代表的なモデル', labelEn: 'Flagship models', value: 'BLIP / BLIP-2' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '图文理解',
        valueJa: '画像テキスト理解',
        valueEn: 'image-text AI',
      },
    ],
    summary:
      'LAVIS / BLIP 是 Salesforce 新加坡研究团队对全球视觉语言 AI 的重要贡献。它们让图文理解、图像描述、视觉问答和多模态预训练进入更可复用的开源形态。',
    summaryJa:
      'LAVIS / BLIP は、Salesforce シンガポール研究チームがグローバルなビジョン言語 AI にもたらした重要な貢献です。それらは、画像テキスト理解、画像説明、ビジョン質問応答、およびマルチモーダル事前学習をより再利用可能なオープンソース形式にしています。',
    summaryEn:
      'LAVIS / BLIP is a major contribution from Salesforce’s Singapore research team to global vision-language AI, making image-text understanding, captioning, VQA, and multimodal pretraining more reusable through open source.',
    whatItIs: `LAVIS 是 Library for Language-Vision Intelligence 的缩写，是一个统一的视觉语言研究和应用库。BLIP 和 BLIP-2 则是其中最有影响力的模型系列。

开发者可以用它加载预训练模型，做图像描述、视觉问答、图文检索、多模态对齐等任务。`,
    whatItIsJa: `LAVIS は Library for Language-Vision Intelligence の略称で、統合されたビジョン言語研究および応用ライブラリです。BLIP と BLIP-2 はその中で最も影響力のあるモデルシリーズです。

開発者はそれを使用して事前学習済みモデルをロードし、画像説明、ビジョン質問応答、画像テキスト検索、マルチモーダル整列などのタスクを実行できます。`,
    whatItIsEn: `LAVIS stands for Library for Language-Vision Intelligence, a unified library for vision-language research and applications. BLIP and BLIP-2 are the most influential model lines within that family.

Developers can use it to load pretrained models for captioning, visual question answering, image-text retrieval, multimodal alignment, and related tasks.`,
    aiRelevance: `BLIP 系列是多模态 AI 的基础构件之一。今天很多视觉语言模型、数据生成流程和图文对齐研究，都直接或间接受它影响。

它的价值不只是论文引用高，而是形成了可复用代码和模型，降低了后续研究进入门槛。`,
    aiRelevanceJa: `BLIP シリーズは、マルチモーダル AI の基礎的なビルディングブロックの一つです。今日、多くのビジョン言語モデル、データ生成プロセス、および画像テキスト整列研究が、直接的または間接的にその影響を受けています。

その価値は論文引用数が高いだけではなく、再利用可能なコードとモデルを形成し、その後の研究の参入障壁を低下させるという点にあります。`,
    aiRelevanceEn: `The BLIP family is one of the base components of multimodal AI. Many later vision-language models, data-generation pipelines, and image-text alignment studies are directly or indirectly influenced by it.

Its value is not only high citation count, but reusable code and models that lower the entry barrier for later research.`,
    singaporeRelevance: `Salesforce 新加坡实验室证明，国际企业在新加坡设研究团队不只是销售或区域办公室，也能产出全球级基础研究。

这类项目是新加坡 AI 生态很重要但容易被低估的一层：跨国公司实验室把本地人才、全球研究网络和开源影响力连接起来。`,
    singaporeRelevanceJa: `Salesforce シンガポール研究室は、国際企業がシンガポールに研究チームを設立することは販売や地域事務所だけではなく、グローバル級の基礎研究も生産できることを証明しています。

このようなプロジェクトはシンガポール AI エコシステムの非常に重要でありながら過小評価されやすい層です。多国籍企業の研究室はローカル人材、グローバル研究ネットワーク、およびオープンソース影響力をつなぎます。`,
    singaporeRelevanceEn: `Salesforce’s Singapore lab proves that international corporate research teams in Singapore are not merely sales or regional offices; they can produce global foundation research.

This is an important but often underestimated layer of Singapore’s AI ecosystem: multinational labs connect local talent, global research networks, and open-source influence.`,
    milestones: [
      {
        date: '2022',
        title: 'BLIP 论文发表于 ICML 2022',
        titleJa: 'BLIP 論文は ICML 2022 で発表されました',
        titleEn: 'BLIP paper published at ICML 2022',
      },
      {
        date: '2023',
        title: 'BLIP-2 论文发表于 ICML 2023',
        titleJa: 'BLIP-2 論文は ICML 2023 で発表されました',
        titleEn: 'BLIP-2 paper published at ICML 2023',
      },
    ],
    resources: [
      { label: 'LAVIS GitHub', labelEn: 'LAVIS on GitHub', url: 'https://github.com/salesforce/LAVIS', kind: 'github' },
      {
        label: 'Salesforce AI Research',
        labelEn: 'Salesforce AI Research',
        url: 'https://www.salesforce.com/research/',
        kind: 'organization',
      },
    ],
  },
  {
    id: 'codegen',
    name: 'CodeGen',
    nameEn: 'CodeGen',
    org: 'Salesforce AI Research',
    orgEn: 'Salesforce AI Research',
    orgType: 'corporate-lab',
    category: '代码生成模型',
    categoryJa: 'コード生成モデル',
    categoryEn: 'Code generation model',
    status: '经典开源模型',
    statusJa: 'クラシック・オープンソース・モデル',
    statusEn: 'Classic open model',
    description: '程序合成模型，与早期 OpenAI Codex 同期竞争',
    descriptionJa: 'プログラム合成モデル、初期のOpenAI Codexとの同時期の競争',
    descriptionEn: 'Program synthesis model from the early open code-generation wave',
    stars: 5176,
    url: 'https://github.com/salesforce/CodeGen',
    language: 'Python',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2022-03',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '5.1k+' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '代码生成',
        valueJa: 'コード生成',
        valueEn: 'code generation',
      },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '模型家族',
        valueJa: 'モデルファミリー',
        valueEn: 'model family',
      },
    ],
    summary: 'CodeGen 是早期开放代码生成模型的重要样本，出现在 OpenAI Codex 带起程序合成热潮的同一时期。',
    summaryJa:
      'CodeGenは初期のオープンソース・コード生成モデルの重要なサンプルであり、OpenAI Codexがプログラム合成ブームを引き起こした同じ時期に登場しました。',
    summaryEn:
      'CodeGen is an important sample from the early open code-generation model wave, emerging around the same period as OpenAI Codex popularized program synthesis.',
    whatItIs: `CodeGen 是 Salesforce 发布的一组开源程序合成模型。它面向自然语言到代码、代码补全和程序生成任务，训练和评测都围绕代码语料展开。

虽然今天代码模型已经进入更强的 agent 和 IDE 形态，CodeGen 仍是开放代码生成路线的早期代表。`,
    whatItIsJa: `CodeGenはSalesforceが発布したオープンソース・プログラム合成モデルの一群です。自然言語からコードへの変換、コード補完、プログラム生成タスクを対象としており、トレーニングと評価の両方がコード・コーパスを中心に展開されています。

今日のコード・モデルがより強力なエージェントとIDE形態へと進化している一方で、CodeGenはオープンソース・コード生成アプローチの初期段階の代表例です。`,
    whatItIsEn: `CodeGen is a family of open program-synthesis models released by Salesforce. It targets natural-language-to-code, code completion, and program generation tasks, with training and evaluation centered on code corpora.

Although today’s coding models have moved into stronger agent and IDE forms, CodeGen remains an early representative of the open code-generation path.`,
    aiRelevance: `代码生成是大模型最快产品化的方向之一。CodeGen 的历史价值在于它把代码模型从闭源能力拉向可下载、可评测、可改造的研究对象。

它也是理解 AI 编程助手演化的一块早期拼图。`,
    aiRelevanceJa: `コード生成は大規模モデルの中で最も迅速に製品化される方向の一つです。CodeGenの歴史的価値は、コード・モデルをクローズドソース機能からダウンロード可能で、評価可能で、改造可能な研究対象へと引き上げたことにあります。

これはまた、AIプログラミング・アシスタントの進化を理解するための初期段階のパズルピースでもあります。`,
    aiRelevanceEn: `Code generation is one of the fastest-productized areas of large models. CodeGen’s historical value is that it pulled code models from closed capability into downloadable, evaluable, modifiable research objects.

It is also an early piece in understanding the evolution of AI coding assistants.`,
    singaporeRelevance: `CodeGen 本身不完全是新加坡本地项目，但它属于 Salesforce AI Research 的全球开源资产，与新加坡实验室的人才和研究网络相关。

放在本站里，它提醒我们：新加坡 AI 生态的影响力不只来自政府和高校，也来自跨国研究团队在此形成的全球项目连接。`,
    singaporeRelevanceJa: `CodeGen本身は完全にシンガポール発のプロジェクトではありませんが、Salesforce AI Researchのグローバル・オープンソース・アセットに属しており、シンガポール・ラボの人材と研究ネットワークに関連しています。

本サイトに掲載する上で、それは私たちに思い出させてくれます。シンガポールのAIエコシステムの影響力は政府と大学だけからではなく、多国籍研究チームがここで形成するグローバル・プロジェクト・コネクションからもたらされるのです。`,
    singaporeRelevanceEn: `CodeGen is not solely a Singapore-local project, but it belongs to Salesforce AI Research’s global open-source assets and connects to the talent and research network around its Singapore lab.

On this site, it is a reminder that Singapore’s AI influence does not only come from government and universities, but also from global projects connected to multinational research teams here.`,
    milestones: [
      {
        date: '2022-03',
        title: 'CodeGen 仓库创建',
        titleJa: 'CodeGen リポジトリ作成',
        titleEn: 'CodeGen repository created',
      },
    ],
    resources: [
      {
        label: 'CodeGen GitHub',
        labelEn: 'CodeGen on GitHub',
        url: 'https://github.com/salesforce/CodeGen',
        kind: 'github',
      },
      {
        label: 'Salesforce AI Research',
        labelEn: 'Salesforce AI Research',
        url: 'https://www.salesforce.com/research/',
        kind: 'organization',
      },
    ],
  },
  {
    id: 'bagel',
    name: 'BAGEL',
    nameEn: 'BAGEL',
    org: 'ByteDance Seed (Singapore)',
    orgEn: 'ByteDance Seed (Singapore)',
    orgType: 'corporate-lab',
    category: '统一多模态模型',
    categoryJa: '統一マルチモーダルモデル',
    categoryEn: 'Unified multimodal model',
    status: '活跃开源',
    statusJa: '活発なオープンソース',
    statusEn: 'Active open source',
    description: '开源多模态统一模型，覆盖理解与生成',
    descriptionJa: 'オープンソースマルチモーダル統一モデル、理解と生成をカバー',
    descriptionEn: 'Open-source unified multimodal model for understanding and generation',
    stars: 5886,
    url: 'https://github.com/ByteDance-Seed/BAGEL',
    language: 'Python',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2025-04',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '5.8k+' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '多模态统一',
        valueJa: 'マルチモーダル統一',
        valueEn: 'unified multimodal',
      },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '模型仓库',
        valueJa: 'モデルリポジトリ',
        valueEn: 'model repo',
      },
    ],
    summary: 'BAGEL 是 ByteDance Seed 的统一多模态模型项目，体现了国际大厂在新加坡团队和全球开源模型竞争之间的连接。',
    summaryJa:
      'BAGELはByteDance Seedの統一マルチモーダルモデルプロジェクトで、シンガポール拠点と世界的なオープンソースモデル競争の間における国際大手企業のつながりを体現しています。',
    summaryEn:
      'BAGEL is a unified multimodal model project from ByteDance Seed, showing the link between Singapore-based teams and global open multimodal competition.',
    whatItIs: `BAGEL 是一个开源统一多模态模型，目标是把理解和生成能力放进同一模型框架里。它处在多模态模型从"单点能力"向"通用视觉语言系统"演进的方向上。

公开仓库提供代码和模型使用入口，面向研究者和开发者。`,
    whatItIsJa: `BAGELはオープンソースの統一マルチモーダルモデルで、理解能力と生成能力を同じモデルフレームワークに統合することを目標としています。マルチモーダルモデルが「単点能力」から「汎用視覚言語システム」へと進化する方向にあります。

公開リポジトリはコードとモデルの使用方法を提供し、研究者と開発者を対象としています。`,
    whatItIsEn: `BAGEL is an open unified multimodal model that aims to place understanding and generation inside one model framework. It sits in the shift from point capabilities toward general vision-language systems.

The public repository provides code and model entry points for researchers and developers.`,
    aiRelevance: `统一多模态模型是 2025-2026 年模型竞争的主线之一。BAGEL 关注的是模型如何同时理解图像、文本和生成任务，而不是把不同任务拆成多个独立模型。

这与 Show-o、NExT-GPT 等高校路线形成了有趣对照：企业实验室更强调模型产品化和快速迭代。`,
    aiRelevanceJa: `統一マルチモーダルモデルは2025-2026年のモデル競争の主線の一つです。BAGELが焦点を当てているのは、モデルがいかに画像、テキスト、および生成タスクを同時に理解するかであり、異なるタスクを複数の独立したモデルに分割することではありません。

これはShow-o、NExT-GPTなどの大学ルートとの興味深い対比を形成しており、企業研究室はモデルの製品化と迅速なイテレーションをより強調しています。`,
    aiRelevanceEn: `Unified multimodal models are one of the main competitive lines in 2025-2026. BAGEL focuses on how one model can handle visual understanding, text, and generation rather than splitting tasks across separate models.

It forms an interesting contrast with university lines such as Show-o and NExT-GPT: corporate labs tend to emphasize productization and rapid iteration.`,
    singaporeRelevance: `ByteDance Seed 在新加坡的存在让本地生态接入中国和全球模型研发网络。BAGEL 这类项目说明新加坡不仅是区域总部，也可以成为大厂前沿模型团队的一部分。

未来值得追踪的是：新加坡团队在模型训练、数据、评测或产品中的实际责任，以及这些开源项目是否吸引本地开发者。`,
    singaporeRelevanceJa: `ByteDance Seedのシンガポール拠点は、現地のエコシステムが中国およびグローバルなモデル研究開発ネットワークに接続することを実現しています。BAGELのようなプロジェクトは、シンガポールが単なる地域本部だけでなく、大手企業の最先端モデルチームの一部になり得ることを示しています。

今後追跡する価値があるのは：シンガポールチームがモデル訓練、データ、評価、または製品開発において実際の責任を担うこと、およびこれらのオープンソースプロジェクトが現地の開発者を引き付けるかどうかです。`,
    singaporeRelevanceEn: `ByteDance Seed’s presence in Singapore connects the local ecosystem to Chinese and global model-research networks. Projects such as BAGEL show that Singapore is not only a regional HQ location, but can be part of frontier-model teams.

The points to track: Singapore teams’ actual role in training, data, evaluation, or product; and whether these open projects attract local developers.`,
    milestones: [
      {
        date: '2025-04',
        title: 'BAGEL 仓库创建',
        titleJa: 'BAGELリポジトリの作成',
        titleEn: 'BAGEL repository created',
      },
    ],
    resources: [
      {
        label: 'BAGEL GitHub',
        labelEn: 'BAGEL on GitHub',
        url: 'https://github.com/ByteDance-Seed/BAGEL',
        kind: 'github',
      },
      {
        label: 'ByteDance Seed GitHub',
        labelEn: 'ByteDance Seed on GitHub',
        url: 'https://github.com/ByteDance-Seed',
        kind: 'organization',
      },
    ],
  },
  {
    id: 'videollama3',
    name: 'VideoLLaMA3',
    nameEn: 'VideoLLaMA3',
    org: 'Alibaba DAMO-NLP-SG',
    orgEn: 'Alibaba DAMO-NLP-SG',
    orgType: 'corporate-lab',
    category: '视频理解多模态模型',
    categoryJa: 'ビデオ理解マルチモーダルモデル',
    categoryEn: 'Video-understanding multimodal model',
    status: '模型发布中',
    statusJa: 'モデル公開中',
    statusEn: 'Models published',
    description: '前沿视频理解多模态模型',
    descriptionJa: '最先端ビデオ理解マルチモーダルモデル',
    descriptionEn: 'A leading multimodal model family for video understanding',
    url: 'https://huggingface.co/DAMO-NLP-SG',
    websiteUrl: 'https://huggingface.co/collections/DAMO-NLP-SG/videollama3-678cdda9281a0e32fe79af15',
    language: 'Models',
    founded: '2025',
    updated: '2026-05-04',
    metrics: [
      { label: '代表模型', labelJa: '代表的なモデル', labelEn: 'Representative models', value: '2B / 7B' },
      { label: '平台', labelJa: 'プラットフォーム', labelEn: 'Platform', value: 'Hugging Face' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '视频理解',
        valueJa: 'ビデオ理解',
        valueEn: 'video understanding',
      },
    ],
    summary: 'VideoLLaMA3 是 Alibaba DAMO-NLP-SG 的视频理解模型线，重点处理长视频、图像和视觉问答等多模态任务。',
    summaryJa:
      'VideoLLaMA3はAlibaba DAMO-NLP-SGのビデオ理解モデルラインで、長いビデオ、画像、視覚的質問応答などのマルチモーダルタスクの処理に焦点を当てています。',
    summaryEn:
      'VideoLLaMA3 is a video-understanding model line from Alibaba DAMO-NLP-SG, focused on multimodal tasks such as long video, image, and visual question answering.',
    whatItIs: `VideoLLaMA3 是发布在 Hugging Face 上的一组多模态模型，常见版本包括 2B 和 7B。它服务的是视频和图像理解：让模型基于视觉内容回答问题、提取信息、理解时序事件。

与视频生成不同，它的重点是"看懂视频"。`,
    whatItIsJa: `VideoLLaMA3 は Hugging Face 上で公開されている一組のマルチモーダルモデルで、一般的なバージョンには 2B と 7B が含まれています。これはビデオと画像の理解に対応しており、モデルが視覚コンテンツに基づいて質問に答えたり、情報を抽出したり、時系列イベントを理解したりできます。

ビデオ生成とは異なり、その重点は「ビデオを理解する」ことです。`,
    whatItIsEn: `VideoLLaMA3 is a set of multimodal models published on Hugging Face, with common 2B and 7B versions. It serves video and image understanding: answering questions, extracting information, and understanding temporal events from visual content.

Unlike video generation, its emphasis is on understanding video.`,
    aiRelevance: `视频理解是 AI 应用的关键基础能力。安全巡检、教育内容分析、会议和媒体检索、机器人感知都需要模型处理长时序视觉信息。

VideoLLaMA3 代表的是企业实验室在开源视频理解模型上的快速推进。`,
    aiRelevanceJa: `ビデオ理解はAI応用における重要な基本能力です。安全点検、教育コンテンツ分析、会議およびメディア検索、ロボット知覚のいずれもが、モデルが長時系列の視覚情報を処理する必要があります。

VideoLLaMA3は、企業ラボのオープンソース・ビデオ理解モデルに関する迅速な進歩を代表しています。`,
    aiRelevanceEn: `Video understanding is a base capability for AI applications. Safety inspection, education-content analysis, meeting and media search, and robotics perception all require models to handle long temporal visual information.

VideoLLaMA3 represents fast corporate-lab progress in open video-understanding models.`,
    singaporeRelevance: `DAMO-NLP-SG 是阿里达摩院在新加坡的语言技术实验室。VideoLLaMA3 让这个实验室不只出现在 NLP 语境里，也进入多模态视频模型生态。

这类项目有助于观察新加坡如何承接中资科技公司的全球 AI 研发网络。`,
    singaporeRelevanceJa: `DAMO-NLP-SGはAlibaba DAMOのシンガポール言語技術ラボです。VideoLLaMA3により、このラボはNLP文脈内だけでなく、マルチモーダルビデオモデルエコシステムにも進出しています。

このようなプロジェクトは、シンガポールが中国資本のテクノロジー企業の世界的なAI研究開発ネットワークをどのように受け入れるかを観察するのに役立ちます。`,
    singaporeRelevanceEn: `DAMO-NLP-SG is Alibaba DAMO Academy’s language-technology lab in Singapore. VideoLLaMA3 places it not only in NLP, but also in the multimodal video-model ecosystem.

Projects like this help track how Singapore hosts global AI research networks from Chinese technology companies.`,
    milestones: [
      {
        date: '2025',
        title: 'VideoLLaMA3 模型线发布',
        titleJa: 'VideoLLaMA3 モデルラインリリース',
        titleEn: 'VideoLLaMA3 model line released',
      },
    ],
    resources: [
      {
        label: 'DAMO-NLP-SG Hugging Face',
        labelEn: 'DAMO-NLP-SG on Hugging Face',
        url: 'https://huggingface.co/DAMO-NLP-SG',
        kind: 'model',
      },
      {
        label: 'VideoLLaMA3 Collection',
        labelEn: 'VideoLLaMA3 collection',
        url: 'https://huggingface.co/collections/DAMO-NLP-SG/videollama3-678cdda9281a0e32fe79af15',
        kind: 'model',
      },
    ],
  },
  {
    id: 'sailor-llm',
    name: 'Sailor LLM',
    nameEn: 'Sailor LLM',
    org: 'Sea AI Lab (SAIL)',
    orgEn: 'Sea AI Lab (SAIL)',
    orgType: 'corporate-lab',
    category: '东南亚语言模型',
    categoryJa: '東南アジア言語モデル',
    categoryEn: 'Southeast Asian language model',
    status: '研究开源',
    statusJa: 'オープンソース研究',
    statusEn: 'Research open source',
    description: '面向东南亚的开源语言模型',
    descriptionJa: '東南アジア向けのオープンソース言語モデル',
    descriptionEn: 'Open language models for Southeast Asia',
    stars: 138,
    url: 'https://github.com/sail-sg/sailor-llm',
    websiteUrl: 'https://sea-sailor.github.io/blog/sailor1/',
    language: 'Python / Models',
    license: 'MIT',
    licenseEn: 'MIT',
    founded: '2024-02',
    updated: '2026-05-04',
    papers: ['EMNLP 2024'],
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '138' },
      { label: '论文', labelJa: '論文', labelEn: 'Paper', value: 'EMNLP 2024' },
      {
        label: '区域',
        labelJa: '地域',
        labelEn: 'Region',
        value: '东南亚',
        valueJa: '東南アジア',
        valueEn: 'Southeast Asia',
      },
    ],
    summary: 'Sailor LLM 是 Sea AI Lab 的东南亚语言模型项目，和 SEA-LION 一样指向区域语言能力，但来自企业研究实验室。',
    summaryJa:
      'Sailor LLM は Sea AI Lab の東南アジア言語モデルプロジェクトであり、SEA-LION と同様に地域言語能力を指向していますが、企業研究所からのものです。',
    summaryEn:
      'Sailor LLM is Sea AI Lab’s Southeast Asian language-model project. Like SEA-LION, it targets regional language capability, but comes from a corporate research lab.',
    whatItIs: `Sailor 是一组面向东南亚语言的开源语言模型。它关注低资源语言、区域语料和多语言能力，试图让模型更适合东南亚真实文本环境。

这条路线和通用英文模型不同：它把区域语言覆盖当成核心指标。`,
    whatItIsJa: `Sailor は東南アジア言語に対応するオープンソース言語モデルのセットです。これは低リソース言語、地域コーパス、多言語能力に焦点を当て、東南アジアの実際のテキスト環境により適したモデルにしようとしています。

このアプローチは汎用英語モデルとは異なります。地域言語カバレッジを主要指標として位置づけています。`,
    whatItIsEn: `Sailor is a set of open language models for Southeast Asian languages. It focuses on lower-resource languages, regional corpora, and multilingual capability so models fit Southeast Asia’s real text environments better.

This path differs from generic English-first models: it treats regional language coverage as a core metric.`,
    aiRelevance: `区域语言模型是全球大模型生态里的重要补位。通用模型在东南亚语言上看似可用，但细节、语气、地名、混语文本和本地知识经常不稳定。

Sailor LLM 让企业研究力量参与了区域模型建设。`,
    aiRelevanceJa: `地域言語モデルはグローバルな大規模モデルエコシステムにおける重要な補完です。汎用モデルは東南アジア言語では利用可能に見えますが、細部、トーン、地名、コードスイッチングテキスト、およびローカルナレッジはしばしば不安定です。

Sailor LLM により、企業研究力が地域モデル構築に参加するようになりました。`,
    aiRelevanceEn: `Regional language models fill an important gap in the global LLM ecosystem. Generic models can appear usable in Southeast Asian languages, yet often become unstable on nuance, tone, place names, code-switching, and local knowledge.

Sailor LLM brings corporate research capacity into regional model building.`,
    singaporeRelevance: `Sea 是新加坡最重要的本土互联网公司之一。SAIL 做 Sailor LLM，说明新加坡本土企业也在尝试基础模型和区域语言模型，而不是只消费美国或中国模型。

它应和 SEA-LION 放在一起追踪：一个是国家平台路线，一个是本土科技公司实验室路线。`,
    singaporeRelevanceJa: `Sea はシンガポールで最も重要な国内インターネット企業の一つです。SAIL が Sailor LLM を開発していることは、シンガポール国内企業も基礎モデルや地域言語モデルの構築を試みており、米国または中国のモデルを消費するだけではないことを示しています。

これは SEA-LION と一緒に追跡する必要があります。一つは国家プラットフォーム路線、もう一つは国内テクノロジー企業研究所路線です。`,
    singaporeRelevanceEn: `Sea is one of Singapore’s most important homegrown internet companies. SAIL’s Sailor LLM shows that local companies are also experimenting with foundation and regional language models, not only consuming US or Chinese models.

It should be tracked alongside SEA-LION: one is the national-platform route, the other a homegrown tech-company lab route.`,
    milestones: [
      {
        date: '2024-02',
        title: 'Sailor LLM 仓库创建',
        titleJa: 'Sailor LLM リポジトリ作成',
        titleEn: 'Sailor LLM repository created',
      },
      {
        date: '2024',
        title: '论文发表于 EMNLP 2024',
        titleJa: '論文が EMNLP 2024 に発表されました',
        titleEn: 'Paper published at EMNLP 2024',
      },
    ],
    resources: [
      {
        label: 'Sailor LLM GitHub',
        labelEn: 'Sailor LLM on GitHub',
        url: 'https://github.com/sail-sg/sailor-llm',
        kind: 'github',
      },
      {
        label: 'Sailor 项目页',
        labelJa: 'Sailor プロジェクトページ',
        labelEn: 'Sailor project page',
        url: 'https://sea-sailor.github.io/blog/sailor1/',
        kind: 'website',
      },
    ],
  },
  {
    id: 'oat',
    name: 'OAT',
    nameEn: 'OAT',
    org: 'Sea AI Lab (SAIL)',
    orgEn: 'Sea AI Lab (SAIL)',
    orgType: 'corporate-lab',
    category: 'LLM 在线对齐框架',
    categoryJa: 'LLM オンラインアラインメントフレームワーク',
    categoryEn: 'LLM online alignment framework',
    status: '活跃维护',
    statusJa: '積極的なメンテナンス',
    statusEn: 'Actively maintained',
    description: 'LLM 在线对齐训练框架',
    descriptionJa: 'LLM オンラインアラインメント訓練フレームワーク',
    descriptionEn: 'Research-friendly framework for LLM online alignment',
    stars: 652,
    url: 'https://github.com/sail-sg/oat',
    language: 'Python',
    license: 'Apache-2.0',
    licenseEn: 'Apache-2.0',
    founded: '2024-10',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '652' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '模型对齐',
        valueJa: 'モデルアラインメント',
        valueEn: 'model alignment',
      },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '训练框架',
        valueJa: '訓練フレームワーク',
        valueEn: 'training framework',
      },
    ],
    summary: 'OAT 是 Sea AI Lab 的 LLM 对齐训练框架，面向强化学习、偏好学习等后训练环节。',
    summaryJa:
      'OAT は Sea AI Lab の LLM アラインメント訓練フレームワークで、強化学習、選好学習などのポストトレーニング段階を対象としています。',
    summaryEn:
      'OAT is Sea AI Lab’s LLM alignment-training framework, aimed at post-training workflows such as reinforcement learning and preference learning.',
    whatItIs: `OAT 是 Online Alignment Training 的缩写。它把 LLM 后训练里常见的强化学习、偏好优化、在线采样和评测流程封装成研究友好的框架。

它不是面向普通用户的产品，而是给模型研究和训练团队使用的工具。`,
    whatItIsJa: `OAT は Online Alignment Training の略です。LLM のポストトレーニングで一般的な強化学習、選好最適化、オンラインサンプリング、評価プロセスを研究向けのフレームワークにカプセル化しています。

これは一般ユーザー向けの製品ではなく、モデル研究・訓練チームが使用するツールです。`,
    whatItIsEn: `OAT stands for Online Alignment Training. It packages common LLM post-training workflows such as reinforcement learning, preference optimization, online sampling, and evaluation into a research-friendly framework.

It is not an end-user product, but a tool for model research and training teams.`,
    aiRelevance: `模型能力越来越取决于后训练。预训练决定基础知识，SFT、RLHF、DPO、在线强化学习等流程决定模型是否听话、稳定、有用。

OAT 的意义在于把这些复杂对齐实验做成可复用工程框架。`,
    aiRelevanceJa: `モデルの能力はますますポストトレーニングに依存するようになっています。事前トレーニングは基礎知識を決定し、SFT、RLHF、DPO、オンライン強化学習などのプロセスは、モデルが指示に従うか、安定しているか、有用かを決定します。

OAT の意義は、これらの複雑なアラインメント実験を再利用可能なエンジニアリングフレームワークに変えることにあります。`,
    aiRelevanceEn: `Model capability increasingly depends on post-training. Pretraining provides base knowledge; SFT, RLHF, DPO, online reinforcement learning, and related workflows determine whether a model is useful, stable, and aligned.

OAT matters because it turns complex alignment experiments into reusable engineering infrastructure.`,
    singaporeRelevance: `OAT 说明 Sea AI Lab 不只做区域语言模型，也在做模型训练底层工具。这对新加坡本土科技公司参与基础模型竞争很重要。

未来可以追踪它是否被 Sailor 或其他 SAIL 模型训练管线采用。`,
    singaporeRelevanceJa: `OAT は、Sea AI Lab が地域言語モデルだけでなく、モデル訓練の基盤となるツールも開発していることを示しています。これはシンガポール本土のテック企業が基礎モデルの競争に参加する上で非常に重要です。

今後、それが Sailor または他の SAIL モデル訓練パイプラインに採用されるかどうかを追跡することができます。`,
    singaporeRelevanceEn: `OAT shows that Sea AI Lab is not only building regional language models, but also model-training tooling. That matters for a Singapore homegrown tech company participating in foundation-model competition.

Future tracking should watch whether it is used in Sailor or other SAIL model-training pipelines.`,
    milestones: [
      { date: '2024-10', title: 'OAT 仓库创建', titleJa: 'OAT リポジトリ作成', titleEn: 'OAT repository created' },
    ],
    resources: [
      { label: 'OAT GitHub', labelEn: 'OAT on GitHub', url: 'https://github.com/sail-sg/oat', kind: 'github' },
    ],
  },
  {
    id: 'zero-bubble-pipeline-parallelism',
    name: 'Zero-Bubble Pipeline Parallelism',
    nameEn: 'Zero-Bubble Pipeline Parallelism',
    org: 'Sea AI Lab (SAIL)',
    orgEn: 'Sea AI Lab (SAIL)',
    orgType: 'corporate-lab',
    category: '训练效率优化',
    categoryJa: '訓練効率の最適化',
    categoryEn: 'Training-efficiency optimization',
    status: '研究开源',
    statusJa: 'オープンソース研究',
    statusEn: 'Research open source',
    description: '新型流水线并行训练效率优化',
    descriptionJa: '新型パイプライン並列化による訓練効率の最適化',
    descriptionEn: 'Pipeline-parallelism technique for improving training efficiency',
    stars: 452,
    url: 'https://github.com/sail-sg/zero-bubble-pipeline-parallelism',
    language: 'Python',
    license: '未明确',
    licenseJa: '未明確',
    licenseEn: 'Not specified',
    founded: '2023-11',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '452' },
      {
        label: '方向',
        labelJa: '方向',
        labelEn: 'Direction',
        value: '流水线并行',
        valueJa: 'パイプライン並列化',
        valueEn: 'pipeline parallelism',
      },
      {
        label: '目标',
        labelJa: '目標',
        labelEn: 'Goal',
        value: '减少空泡',
        valueJa: 'バブルを削減',
        valueEn: 'reduce pipeline bubbles',
      },
    ],
    summary:
      'Zero-Bubble Pipeline Parallelism 是 Sea AI Lab 在大模型训练效率上的系统研究，目标是减少流水线并行中的空闲时间。',
    summaryJa:
      'Zero-Bubble Pipeline Parallelism は、大規模モデル訓練効率に関する Sea AI Lab のシステム研究であり、目標はパイプライン並列化における空き時間を削減することです。',
    summaryEn:
      'Zero-Bubble Pipeline Parallelism is Sea AI Lab’s systems work on large-model training efficiency, aiming to reduce idle time in pipeline parallelism.',
    whatItIs: `流水线并行会把模型切成多个阶段，在不同设备上顺序处理 micro-batches。问题是设备之间容易出现等待，也就是"bubble"。

Zero-Bubble 的思路是改进调度和反向传播安排，让设备更少空转，提高大模型训练吞吐。`,
    whatItIsJa: `パイプライン並列化はモデルを複数のステージに分割し、異なるデバイス上で順次 micro-batches を処理します。問題はデバイス間でウェイトが発生しやすいこと、つまり「バブル」です。

Zero-Bubble のアイデアは、スケジューリングと逆伝播の配置を改善し、デバイスの空転をより少なくし、大規模モデル訓練のスループットを向上させることです。`,
    whatItIsEn: `Pipeline parallelism splits a model into stages and processes micro-batches across devices. The problem is that devices often wait for each other, creating "bubbles."

Zero-Bubble improves scheduling and backward-pass arrangement so devices spend less time idle and large-model training throughput rises.`,
    aiRelevance: `训练效率是基础模型竞争的隐藏战场。少一点空转，就意味着同样算力可以训练更多 token、更大模型或更快迭代。

这种系统论文和开源实现对大模型实验室很有实际价值。`,
    aiRelevanceJa: `訓練効率は基盤モデルの競争における隠れた戦場です。少しの空回りが減れば、同じ計算能力でより多くのtoken、より大きなモデル、またはより速いイテレーションを訓練できることを意味します。

このようなシステム論文とオープンソース実装は、大規模モデルラボにとって実用的な価値があります。`,
    aiRelevanceEn: `Training efficiency is a hidden battleground in foundation-model competition. Less idle time means the same compute can train more tokens, larger models, or more iterations.

This kind of systems paper and open implementation has practical value for large-model labs.`,
    singaporeRelevance: `Sea AI Lab 做这类训练系统研究，说明新加坡本土企业实验室正在进入更底层的模型基础设施层，而不仅是应用层。

它和 Colossal-AI 一起构成新加坡开源生态中"训练系统"这一条线。`,
    singaporeRelevanceJa: `Sea AI Lab がこのような訓練システム研究を行っていることは、シンガポールの地元企業ラボがより底層のモデル基礎設施レイヤーに進入していることを示しており、単にアプリケーションレイヤーだけではありません。

それは Colossal-AI とともに、シンガポールのオープンソースエコシステムにおける「訓練システム」というラインを構成しています。`,
    singaporeRelevanceEn: `Sea AI Lab’s work on training systems shows that a Singapore homegrown corporate lab is entering lower-level model infrastructure, not only applications.

Together with Colossal-AI, it forms the "training systems" line in Singapore’s open-source ecosystem.`,
    milestones: [
      {
        date: '2023-11',
        title: 'Zero-Bubble 仓库创建',
        titleJa: 'Zero-Bubble リポジトリ作成',
        titleEn: 'Zero-Bubble repository created',
      },
    ],
    resources: [
      {
        label: 'Zero-Bubble GitHub',
        labelEn: 'Zero-Bubble on GitHub',
        url: 'https://github.com/sail-sg/zero-bubble-pipeline-parallelism',
        kind: 'github',
      },
    ],
  },
];

export const startupProjects: OpenSourceProject[] = [
  {
    id: 'jan',
    name: 'Jan',
    nameEn: 'Jan',
    org: 'Jan (Homebrew Computer Company)',
    orgEn: 'Jan (Homebrew Computer Company)',
    orgType: 'startup',
    category: '本地 AI 助手',
    categoryJa: 'ローカル AI アシスタント',
    categoryEn: 'Local AI assistant',
    status: '活跃产品',
    statusJa: 'アクティブな製品',
    statusEn: 'Active product',
    description: '离线 ChatGPT 替代品，本地运行 AI 助手',
    descriptionJa: 'オフライン ChatGPT 代替品、ローカル実行 AI アシスタント',
    descriptionEn: 'Offline ChatGPT alternative; an AI assistant that runs locally',
    stars: 42363,
    url: 'https://github.com/janhq/jan',
    websiteUrl: 'https://jan.ai',
    language: 'TypeScript',
    license: '未明确',
    licenseJa: '未明確',
    licenseEn: 'Not specified',
    founded: '2023-08',
    updated: '2026-05-04',
    metrics: [
      { label: 'GitHub Stars', labelEn: 'GitHub stars', value: '42.3k+' },
      {
        label: '形态',
        labelJa: '形態',
        labelEn: 'Form',
        value: '桌面应用',
        valueJa: 'デスクトップ アプリケーション',
        valueEn: 'desktop app',
      },
      {
        label: '核心卖点',
        labelJa: 'コアセリングポイント',
        labelEn: 'Core promise',
        value: '本地运行',
        valueJa: 'ローカル実行',
        valueEn: 'runs locally',
      },
    ],
    summary:
      'Jan 是新加坡创业公司开源产品里最有全球开发者关注度的代表：它把本地模型、桌面应用和隐私友好 AI 助手组合在一起。',
    summaryJa:
      'Jan は、シンガポール スタートアップのオープンソース製品の中でグローバルな開発者の関心が最も高い代表です。ローカルモデル、デスクトップ アプリケーション、プライバシー フレンドリーな AI アシスタントを組み合わせています。',
    summaryEn:
      'Jan is the most globally visible open-source product from Singapore’s startup layer: it combines local models, a desktop app, and a privacy-friendly AI assistant.',
    whatItIs: `Jan 是一个开源桌面 AI 助手。用户可以在自己的电脑上运行模型，接入本地或远程推理后端，获得类似 ChatGPT 的对话体验，但数据和运行环境更可控。

它面向的是越来越明确的一类需求：不要所有 AI 交互都经过云端闭源服务。`,
    whatItIsJa: `Jan はオープンソースのデスクトップ AI アシスタントです。ユーザーは自分のコンピューター上でモデルを実行し、ローカルまたはリモートの推論バックエンドに接続して、ChatGPT のような対話体験を得ることができますが、データと実行環境をより制御できます。

それは、ますます明確になってきたニーズに対応しています。すべての AI インタラクションがクラウドベースのクローズドソース サービスを通過しないようにしたいというニーズです。`,
    whatItIsEn: `Jan is an open-source desktop AI assistant. Users can run models on their own computers, connect to local or remote inference backends, and get a ChatGPT-like experience with more control over data and runtime.

It addresses a demand that is becoming clearer: not every AI interaction should pass through a closed cloud service.`,
    aiRelevance: `本地 AI 是大模型产品化的重要分支。随着开源模型变小、端侧硬件变强，个人和企业都希望在隐私、成本和可控性上有云服务之外的选择。

Jan 把这个方向做成普通用户能安装的产品，而不是只停留在命令行工具。`,
    aiRelevanceJa: `ローカル AI は大規模モデル製品化の重要なブランチです。オープンソースモデルが小さくなり、エッジハードウェアが強化されるにつれて、個人と企業の両方がプライバシー、コスト、および制御性においてクラウドサービス以外の選択肢を望んでいます。

Jan はこの方向を通常のユーザーがインストールできる製品にしており、単にコマンドラインツールにとどまっていません。`,
    aiRelevanceEn: `Local AI is an important branch of large-model productization. As open models become smaller and edge hardware improves, individuals and enterprises want options beyond cloud services for privacy, cost, and control.

Jan turns that direction into a product regular users can install, not just a command-line tool.`,
    singaporeRelevance: `Jan 证明新加坡创业公司也能通过开源产品获得全球开发者分发，而不是只做本地市场或 SaaS 销售。

它对新加坡 AI 创业生态的意义很直接：开源可以成为增长渠道、信任机制和开发者社区入口。`,
    singaporeRelevanceJa: `Jan は、シンガポール スタートアップもオープンソース製品を通じてグローバルな開発者配布を実現できることを証明しています。単なるローカル市場や SaaS 販売に限定されるのではなく。

シンガポール AI スタートアップエコシステムにとっての意義は非常に直接的です。オープンソースは成長チャネル、信頼メカニズム、開発者コミュニティへのエントリーポイントになることができます。`,
    singaporeRelevanceEn: `Jan shows that a Singapore startup can reach global developer distribution through open source, not only through local markets or SaaS sales.

Its significance for Singapore’s AI startup ecosystem is direct: open source can be a growth channel, a trust mechanism, and an entry point into developer community.`,
    milestones: [
      { date: '2023-08', title: 'Jan 仓库创建', titleJa: 'Jan リポジトリ作成', titleEn: 'Jan repository created' },
      {
        date: '2024-2026',
        title: '本地 AI 助手方向快速升温',
        titleJa: 'ローカル AI アシスタント方向が急速に加熱',
        titleEn: 'Local AI assistant category grows quickly',
      },
    ],
    resources: [
      { label: 'Jan GitHub', labelEn: 'Jan on GitHub', url: 'https://github.com/janhq/jan', kind: 'github' },
      { label: 'Jan 官网', labelJa: 'Jan 公式サイト', labelEn: 'Jan website', url: 'https://jan.ai', kind: 'website' },
    ],
  },
];

export const allCommunityOpenSourceProjects = [
  ...universityProjects,
  ...corporateLabProjects,
  ...startupProjects,
] satisfies OpenSourceProject[];

export const summary = {
  note: '新加坡的 AI 开源贡献远超政府项目本身。Salesforce 新加坡实验室的 BLIP 系列是全球视觉语言 AI 的基石，NUS 孵化的 Colossal-AI 是最流行的分布式训练框架之一，NTU 的 OpenMMLab 是计算机视觉领域的事实标准之一。',
  noteJa:
    'シンガポールの AI オープンソース貢献は、政府プロジェクト自体をはるかに上回ります。Salesforce Singapore Lab の BLIP シリーズはグローバルなビジュアル言語 AI の基礎となり、NUS が孵化した Colossal-AI は最も人気のある分散トレーニング フレームワークの 1 つであり、NTU の OpenMMLab はコンピューター ビジョン分野の事実上の標準の 1 つです。',
  noteEn:
    "Singapore's open-source AI work goes well beyond the government's own projects. Salesforce's Singapore lab produced the BLIP family, a cornerstone of global vision-language AI; NUS-incubated Colossal-AI is one of the most popular distributed-training frameworks; and NTU's OpenMMLab is a widely used computer-vision toolbox ecosystem.",
  dataDate: '2026-05-04',
};

export const dataDisclaimer =
  '数据截至 2026 年 5 月，GitHub stars 为近似值。统计采集：2026-05-04；项目档案更新：2026-05-04。如有遗漏或错误，欢迎提交 Issue。';
export const dataDisclaimerEn =
  'Data is current as of May 2026; GitHub star counts are approximate. Stats collected: 2026-05-04; project profiles updated: 2026-05-04. Please open an Issue if you spot omissions or errors.';

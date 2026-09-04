export interface FieldNote {
  id: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  date: string;
  source: string;
  sourceEn?: string;
  sourceJa?: string;
  sourceKo?: string;
  tags: string[];
  tagsEn?: string[];
  tagsJa?: string[];
  tagsKo?: string[];
  /** Optional since 2026-08 — the monthly research digest entries
   *  (scripts/refresh/research-digest/) have no company to profile. */
  companyProfile?: string;
  companyProfileEn?: string;
  companyProfileJa?: string;
  companyProfileKo?: string;
  sections: {
    heading: string;
    headingEn?: string;
    headingJa?: string;
    headingKo?: string;
    points: string[];
    pointsEn?: string[];
    pointsJa?: string[];
    pointsKo?: string[];
    highlight?: string;
    highlightEn?: string;
    highlightJa?: string;
    highlightKo?: string;
  }[];
  takeaway: string;
  takeawayEn?: string;
  takeawayJa?: string;
  takeawayKo?: string;
}

export const fieldNotes: FieldNote[] = [
  {
    id: 'sg-ai-research-2026-08',
    title: '新加坡 AI 研究月报（2026 年 8 月）',
    titleEn: 'Singapore AI Research Monthly (2026-08)',
    titleJa: 'Singapore AI Research 月報（2026-08）',
    titleKo: '싱가포르 AI 연구 월간 (2026-08)',
    date: '2026-08',
    source: 'OpenAlex + 站方筛选',
    sourceEn: 'OpenAlex + our curation',
    sourceJa: 'OpenAlex + 当サイトの選定',
    sourceKo: 'OpenAlex + 사이트 큐레이션',
    tags: ['研究月报', 'National University of Singapore', 'Agency for Science, Technology and Research'],
    tagsEn: ['Research monthly', 'National University of Singapore', 'Agency for Science, Technology and Research'],
    tagsJa: ['研究マンスリー', 'National University of Singapore', 'Agency for Science, Technology and Research'],
    tagsKo: ['연구 월간', 'National University of Singapore', 'Agency for Science, Technology and Research'],
    sections: [
      {
        heading: 'AI安全与评估',
        headingEn: 'AI safety & evaluation',
        headingJa: 'AI安全・評価',
        headingKo: 'AI 안전성 및 평가',
        points: [
          '【National University of Singapore】Mapping LLM Capability Frontiers via Formalized and Calibrated Probes — 由NUS主导的X-RAY通过形式化验证、结构化受控的测试来探测LLM推理，而非原始任务准确度，从而隔离约束相互作用和推理深度等属性。这解决了LLM评估和可解释性中的核心前沿问题，对能力基准测试和安全评估都至关重要。（https://doi.org/10.1145/3770855.3818029）',
          '【Singapore University of Technology and Design】Auditable Release Control for Pedagogical Leakage in LLM Tutors — SUTD 将 LLM 辅导系统中的过早答案泄露正式定义为"教学泄漏"，并构建了具有授权感知的发布控制机制，包含可重放的失败追踪，针对 Gemini 3 进行了测试。这是一个具有可审查的检查的具体安全机制，而不仅仅是一个基准分数。（https://openalex.org/W7172559148）',
        ],
        pointsEn: [
          '[National University of Singapore] Mapping LLM Capability Frontiers via Formalized and Calibrated Probes — NUS-led X-RAY probes LLM reasoning through formally verified, structurally controlled tests rather than raw task accuracy, isolating properties like constraint interaction and reasoning depth. This tackles a core frontier problem in LLM evaluation and interpretability that matters for both capability benchmarking and safety assessment. (https://doi.org/10.1145/3770855.3818029)',
          '[Singapore University of Technology and Design] Auditable Release Control for Pedagogical Leakage in LLM Tutors — SUTD formalizes premature answer disclosure in LLM tutors as "pedagogical leakage" and builds an authorization-aware release control with replayable failure traces, tested against Gemini 3. It\'s a concrete safety mechanism with inspectable checks, not just a benchmark score. (https://openalex.org/W7172559148)',
        ],
        pointsJa: [
          '【National University of Singapore】Mapping LLM Capability Frontiers via Formalized and Calibrated Probes — NUS主導のX-RAYは、生のタスク精度ではなく、形式的に検証された構造的に制御されたテストを通じてLLMの推論を調査し、制約相互作用や推論の深さなどの特性を分離しています。これはLLM評価と解釈可能性における中核的なフロンティア課題に取り組むもので、性能ベンチマーキングと安全性評価の両方にとって重要です。（https://doi.org/10.1145/3770855.3818029）',
          '【Singapore University of Technology and Design】Auditable Release Control for Pedagogical Leakage in LLM Tutors — SUTD は、LLM チューターにおける早期回答開示を「教育的情報漏洩」として正式化し、再現可能な失敗トレースを備えた認可認識型リリース制御を構築し、Gemini 3 に対してテスト済みです。これはベンチマークスコアだけではなく、検査可能なチェックを備えた具体的な安全メカニズムです。（https://openalex.org/W7172559148）',
        ],
        pointsKo: [
          '[National University of Singapore] Mapping LLM Capability Frontiers via Formalized and Calibrated Probes — NUS-led X-RAY는 원시 작업 정확도가 아닌 형식적으로 검증되고 구조적으로 제어된 테스트를 통해 LLM 추론을 탐사하며, 제약 상호작용 및 추론 깊이와 같은 특성들을 격리합니다. 이는 능력 벤치마킹과 안전 평가 모두에 중요한 LLM 평가 및 해석 가능성의 핵심 최전선 문제를 다룹니다. (https://doi.org/10.1145/3770855.3818029)',
          '[Singapore University of Technology and Design] Auditable Release Control for Pedagogical Leakage in LLM Tutors — SUTD는 거대 언어 모델 튜터에서의 조기 답 공개를 「교육적 유출」로 공식화하고, 재생 가능한 오류 흔적을 갖춘 인가 인식 공개 제어를 구축합니다. 이는 Gemini 3에 대해 테스트되었으며, 단순한 벤치마크 점수가 아니라 검사 가능한 점검을 갖춘 구체적인 안전 메커니즘입니다. (https://openalex.org/W7172559148)',
        ],
      },
      {
        heading: '科学与健康的人工智能',
        headingEn: 'AI for science & health',
        headingJa: '科学・保健のためのAI',
        headingKo: '과학 및 보건을 위한 AI',
        points: [
          '【Agency for Science, Technology and Research】A clinical multimodal vision language foundation model with fine-grain explainability — 科技研究局构建了一个具有细粒度可解释性的临床多模态视觉语言基础模型，将前沿多模态架构与临床医生信任人工智能输出所需的可解释性相结合。这标志着新加坡致力于自主开发生物医学基础模型，而不是改造通用系统。（https://doi.org/10.5281/zenodo.21772694）',
          '【Nanyang Technological University】The Words of Proteins: Motif-Level Language Modeling for Interpretable Protein Generation — 南洋理工大学提出了蛋白质生成的基序级语言建模方法，使用结构基序而非原始残基作为建模单元，使生成型蛋白质设计更具可解释性。这将LLM风格的架构选择引入蛋白质基础模型，这是新加坡正在建立存在感的一个领域。（https://doi.org/10.1145/3770855.3819054）',
        ],
        pointsEn: [
          "[Agency for Science, Technology and Research] A clinical multimodal vision language foundation model with fine-grain explainability — A*STAR built a clinical multimodal vision-language foundation model with fine-grained explainability, pairing frontier multimodal architecture with the interpretability clinicians need to trust AI output. It signals Singapore's push toward home-grown biomedical foundation models rather than adapting generic systems. (https://doi.org/10.5281/zenodo.21772694)",
          '[Nanyang Technological University] The Words of Proteins: Motif-Level Language Modeling for Interpretable Protein Generation — NTU proposes motif-level language modeling for protein generation, using structural motifs instead of raw residues as the modeling unit to make generative protein design more interpretable. It brings LLM-style architecture choices into protein foundation models, an area Singapore is building presence in. (https://doi.org/10.1145/3770855.3819054)',
        ],
        pointsJa: [
          '【Agency for Science, Technology and Research】A clinical multimodal vision language foundation model with fine-grain explainability — A*STARは、最先端のマルチモーダルアーキテクチャと、臨床医がAI出力を信頼するために必要な解釈可能性を融合させることで、粒度の細かい説明可能性を備えた臨床用マルチモーダル画像言語基盤モデルを開発しました。これはシンガポールが汎用システムの採用ではなく、国内開発のバイオメディカル基盤モデルへ推進していることを示唆するものです。（https://doi.org/10.5281/zenodo.21772694）',
          '【Nanyang Technological University】The Words of Proteins: Motif-Level Language Modeling for Interpretable Protein Generation — NTUはモチーフレベル言語モデリングによるタンパク質生成を提案しています。生のアミノ酸残基ではなく構造モチーフをモデリング単位として使用し、生成タンパク質設計をより解釈可能にしています。このアプローチは、LLMスタイルのアーキテクチャ選択をタンパク質ファウンデーションモデルに導入するもので、Singaporeが存在感を構築している領域です。（https://doi.org/10.1145/3770855.3819054）',
        ],
        pointsKo: [
          '[Agency for Science, Technology and Research] A clinical multimodal vision language foundation model with fine-grain explainability — A*STAR는 세분화된 설명가능성을 갖춘 임상용 다중모달 비전-언어 파운데이션 모델을 개발했으며, 첨단 다중모달 아키텍처를 임상의들이 AI 출력을 신뢰하는 데 필요한 해석가능성과 결합했습니다. 이는 일반 시스템을 적응시키기보다는 싱가포르가 자체 개발한 생의학 파운데이션 모델로 나아가는 추진을 나타냅니다. (https://doi.org/10.5281/zenodo.21772694)',
          '[Nanyang Technological University] The Words of Proteins: Motif-Level Language Modeling for Interpretable Protein Generation — NTU는 단백질 생성을 위한 모티프 수준의 언어 모델링을 제안합니다. 원시 잔기 대신 구조적 모티프를 모델링 단위로 사용하여 생성적 단백질 설계를 더 해석 가능하도록 만듭니다. 이는 LLM 스타일 아키텍처 선택을 단백질 파운데이션 모델에 가져오는 것으로, 싱가포르가 입지를 구축하고 있는 분야입니다. (https://doi.org/10.1145/3770855.3819054)',
        ],
      },
      {
        heading: '多模态与视觉',
        headingEn: 'Multimodal & vision',
        headingJa: 'マルチモーダル・ビジョン',
        headingKo: '멀티모달 & 비전',
        points: [
          '【Agency for Science, Technology and Research】Improving Temporal Action Segmentation via Constraint-Aware Decoding — 一个科技研究局-NTU-IHPC 联合团队推出了约束感知解码方法，用于改进时序动作分割，这是支撑机器人和监视管道的核心视频理解任务。这是一项扎实的、新加坡多机构计算机视觉贡献，而非单个实验室的微调。（https://doi.org/10.1007/978-3-032-31452-9_5）',
          '【Agency for Science, Technology and Research】Causal Scaffolding for Physical Reasoning: A Benchmark for Causally-Informed Physical World Understanding in VLMs — 科技研究局与NTU共同开发了CausalPhys，这是一个包含3,000多个问题的基准测试，配有由专家标注的因果图，用于检验视觉-语言模型是否能够推理物理因果关系或仅仅进行模式匹配。该基准针对当前VLMs的已知弱点，采用可解释的、基于因果图的评估指标。（https://doi.org/10.1145/3770855.3817582）',
        ],
        pointsEn: [
          "[Agency for Science, Technology and Research] Improving Temporal Action Segmentation via Constraint-Aware Decoding — A joint A*STAR-NTU-IHPC team introduces constraint-aware decoding to improve temporal action segmentation, a core video-understanding task underlying robotics and surveillance pipelines. It's a solid, multi-institution SG computer-vision contribution rather than a single-lab incremental tweak. (https://doi.org/10.1007/978-3-032-31452-9_5)",
          '[Agency for Science, Technology and Research] Causal Scaffolding for Physical Reasoning: A Benchmark for Causally-Informed Physical World Understanding in VLMs — A*STAR and NTU built CausalPhys, a 3,000-plus question benchmark with expert-annotated causal graphs testing whether vision-language models reason about physical causality or just pattern-match. It targets a known weakness in current VLMs with an interpretable, causal-graph-grounded evaluation metric. (https://doi.org/10.1145/3770855.3817582)',
        ],
        pointsJa: [
          '【Agency for Science, Technology and Research】Improving Temporal Action Segmentation via Constraint-Aware Decoding — A*STAR-NTU-IHPCの共同チームが、ロボティクスと監視パイプラインの基礎となるコア動画理解タスクである時間的行動セグメンテーションを改善するため、制約対応デコーディングを導入しています。これはシンガポール複数機関によるコンピュータビジョン分野への堅実な貢献であり、単一研究室による段階的な調整ではありません。（https://doi.org/10.1007/978-3-032-31452-9_5）',
          '【Agency for Science, Technology and Research】Causal Scaffolding for Physical Reasoning: A Benchmark for Causally-Informed Physical World Understanding in VLMs — A*STARとNTUはCausalPhysを構築しました。これは3000以上の質問からなるベンチマークで、専門家が注釈を付けた因果グラフを備えており、ビジョン・言語モデルが物理的因果関係について実際に推論しているのか、それとも単にパターンマッチングしているのかをテストします。現在のVLMsの既知の弱点に対応し、解釈可能で因果グラフに基づいた評価指標を提供しています。（https://doi.org/10.1145/3770855.3817582）',
        ],
        pointsKo: [
          '[Agency for Science, Technology and Research] Improving Temporal Action Segmentation via Constraint-Aware Decoding — A*STAR-NTU-IHPC 공동 팀이 제약-인식 디코딩을 도입하여 시간적 행동 분할을 개선합니다. 이는 로봇공학 및 감시 파이프라인의 기반이 되는 핵심 비디오 이해 작업입니다. 단일 실험실의 점진적 개선이 아닌, SG의 견고한 다기관 컴퓨터 비전 기여입니다. (https://doi.org/10.1007/978-3-032-31452-9_5)',
          '[Agency for Science, Technology and Research] Causal Scaffolding for Physical Reasoning: A Benchmark for Causally-Informed Physical World Understanding in VLMs — A*STAR과 NTU는 CausalPhys를 구축했습니다. 이는 3,000개 이상의 질문과 전문가가 주석을 단 인과 그래프를 포함하는 벤치마크로, 시각-언어 모델이 물리적 인과관계에 대해 추론하는지 아니면 단순히 패턴 매칭만 하는지를 검증합니다. 현재 VLM의 알려진 약점을 해석 가능하고 인과 그래프 기반의 평가 지표로 다룹니다. (https://doi.org/10.1145/3770855.3817582)',
        ],
      },
      {
        heading: '系统与效率',
        headingEn: 'Systems & efficiency',
        headingJa: 'システムと効率',
        headingKo: '시스템 & 효율성',
        points: [
          '【Agency for Science, Technology and Research】Standing Peg-in-Hole Insertion: Demonstrations, Trained Policies, Evaluation Episodes, and Simulation Environment — 这个科技研究局机器人包在亚毫米间隙插销入孔组装中隔离了感知或策略导致的故障，并发布了演示、已训练的策略和仿真环境供重用。这是对具身人工智能和机器人学习的具体开源基础设施贡献，与新加坡的先进制造业人工智能重点相一致。（https://doi.org/10.5281/zenodo.21287317）',
        ],
        pointsEn: [
          "[Agency for Science, Technology and Research] Standing Peg-in-Hole Insertion: Demonstrations, Trained Policies, Evaluation Episodes, and Simulation Environment — This A*STAR robotics bundle isolates whether perception or policy causes failures in sub-millimeter-clearance peg-in-hole assembly, releasing demonstrations, trained policies, and a simulation environment for reuse. It's a concrete open infrastructure contribution to embodied-AI and robot learning, aligned with Singapore's advanced-manufacturing AI focus. (https://doi.org/10.5281/zenodo.21287317)",
        ],
        pointsJa: [
          '【Agency for Science, Technology and Research】Standing Peg-in-Hole Insertion: Demonstrations, Trained Policies, Evaluation Episodes, and Simulation Environment — このA*STARロボティクスバンドルは、サブミリメートルクリアランスペグインホール組立において、知覚またはポリシーのいずれが失敗の原因かを特定し、デモンストレーション、訓練されたポリシー、およびシミュレーション環境を再利用のために公開しています。これはエンボディドAIとロボット学習に対する具体的なオープンインフラストラクチャ貢献であり、シンガポール先端製造分野のAI焦点と一致しています。（https://doi.org/10.5281/zenodo.21287317）',
        ],
        pointsKo: [
          '[Agency for Science, Technology and Research] Standing Peg-in-Hole Insertion: Demonstrations, Trained Policies, Evaluation Episodes, and Simulation Environment — 이 A*STAR 로보틱스 번들은 서브밀리미터 공차의 페그-인-홀 조립에서 지각이나 정책이 실패를 초래하는지를 판별하고, 시연, 훈련된 정책, 그리고 재사용을 위한 시뮬레이션 환경을 공개합니다. 이는 체화 AI 및 로봇 학습을 위한 구체적인 개방 인프라 기여이며, 싱가포르의 첨단 제조 AI 초점과 부합합니다. (https://doi.org/10.5281/zenodo.21287317)',
        ],
      },
      {
        heading: 'LLMs 与 智能体',
        headingEn: 'LLMs & agents',
        headingJa: 'LLMsとエージェント',
        headingKo: 'LLMs와 에이전트',
        points: [
          '【Nanyang Technological University】Toward Plasticity-Preserving KL Regularization for Capability Retention in LLM Reinforcement Learning — NTU研究人员针对一个核心的大语言模型后训练问题：强化学习微调会侵蚀基础模型已有的能力。他们的正确性条件化KL约束是前沿模型训练方法的一个贡献，而不是下游应用。（https://openalex.org/W7172557801）',
        ],
        pointsEn: [
          '[Nanyang Technological University] Toward Plasticity-Preserving KL Regularization for Capability Retention in LLM Reinforcement Learning — NTU researchers target a core LLM post-training problem: RL fine-tuning that erodes capabilities the base model already has. Their correctness-conditioned KL constraint is a methods contribution to how frontier models get trained, not a downstream application. (https://openalex.org/W7172557801)',
        ],
        pointsJa: [
          '【Nanyang Technological University】Toward Plasticity-Preserving KL Regularization for Capability Retention in LLM Reinforcement Learning — NTU 研究者は LLM のポストトレーニングにおける中核的な問題に取り組んでいます。それは、RL ファインチューニングがベースモデルが既に有する能力を侵食することです。彼らの正確性条件付き KL 制約は、最先端モデルがどのように学習されるかに関する手法的貢献であり、ダウンストリーム応用ではありません。（https://openalex.org/W7172557801）',
        ],
        pointsKo: [
          '[Nanyang Technological University] Toward Plasticity-Preserving KL Regularization for Capability Retention in LLM Reinforcement Learning — NTU 연구자들은 핵심 LLM 사후 학습 문제를 다루고 있습니다: 기반 모델이 이미 갖고 있는 능력을 약화시키는 RL 미세 조정입니다. 그들의 정확성 조건부 KL 제약은 최첨단 모델이 학습되는 방식에 대한 방법론 기여이며, 다운스트림 응용이 아닙니다. (https://openalex.org/W7172557801)',
        ],
      },
      {
        heading: '其他',
        headingEn: 'Other',
        headingJa: 'その他',
        headingKo: '기타',
        points: [
          '【National University of Singapore】Copyright Law and Generative AI — 一部由NUS撰写的比较法著作,阐述美国、中国、欧盟、日本、英国和新加坡的版权例外对生成式AI训练和输出的适用。它直接涉及监管机构和AI开发者正在处理的法律不确定性,这对于以政策为重点的观察机构具有重要意义。（https://doi.org/10.4324/9781003655602）',
        ],
        pointsEn: [
          '[National University of Singapore] Copyright Law and Generative AI — An NUS-authored comparative law book on how copyright exceptions in the US, China, EU, Japan, UK, and Singapore apply to generative AI training and outputs. It speaks directly to the legal uncertainty regulators and AI developers are working through, which matters for a policy-focused observatory. (https://doi.org/10.4324/9781003655602)',
        ],
        pointsJa: [
          '【National University of Singapore】Copyright Law and Generative AI — NUS著による比較法書籍で、US、China、EU、Japan、UK、Singaporeの著作権例外が生成AI訓練および出力にどのように適用されるかについて述べています。規制当局とAI開発者が取り組んでいる法的不確実性に直接的に対応するもので、ポリシー指向のオブザーバトリーにとって重要です。（https://doi.org/10.4324/9781003655602）',
        ],
        pointsKo: [
          '[National University of Singapore] Copyright Law and Generative AI — NUS 저자의 비교법 서적으로, US, 중국, EU, 일본, UK, 싱가포르의 저작권 예외가 생성형 AI 학습 및 출력물에 어떻게 적용되는지를 다룹니다. 규제 당국과 AI 개발자가 해결해 나가고 있는 법적 불확실성을 직접적으로 다루고 있으며, 정책 중심의 관측소에 중요한 의미를 갖습니다. (https://doi.org/10.4324/9781003655602)',
        ],
      },
    ],
    takeaway:
      '新加坡八月的研究轨迹显示了从通用模型扩展向领域就绪、可解释的人工智能系统的成熟演进：该月涵盖形式化的大语言模型评估和安全方法（X-RAY探针、保持可塑性的强化学习、教学泄漏检测）、具有细粒度可解释性的临床视觉语言模型、蛋白质基础模型和开源机器人基础设施。这反映了一个战略转变，即构建能够被临床医生、监管机构和制造商进行检查和信任的人工智能系统——由多机构合作（科技研究局、NUS、NTU、SUTD、IHPC）和政策分析（版权框架）所支撑——而不是追求前沿能力指标。',
    takeawayEn:
      "Singapore's August research trajectory shows a maturation from general-purpose model scaling toward domain-ready, interpretable AI systems: the month spans formal LLM evaluation and safety methods (X-RAY probes, plasticity-preserving RL, pedagogical leakage detection), clinical vision-language models with fine-grained explainability, protein foundation models, and open-source robotics infrastructure. This reflects a strategic shift toward building AI systems that clinicians, regulators, and manufacturers can inspect and trust—anchored by multi-institutional collaboration (A*STAR, NUS, NTU, SUTD, IHPC) and policy analysis (copyright frameworks)—rather than chasing frontier capability metrics.",
    takeawayJa:
      'シンガポールの8月の研究軌跡は、汎用モデルのスケーリングからドメイン対応可能で解釈可能なAIシステムへの成熟を示しています。この月は、正式なLLM評価と安全性方法（X-RAY probes、可塑性保持RL、教育的漏洩検出）、細粒度の説明可能性を備えた臨床ビジョン言語モデル、タンパク質基礎モデル、およびオープンソースロボティクスインフラストラクチャにわたっています。これは、臨床医、規制当局、およびメーカーが検査して信頼できるAIシステムを構築する戦略的転換—多機関協業（A*STAR、NUS、NTU、SUTD、IHPC）および政策分析（著作権枠組み）によって支えられている—を反映しており、フロンティア能力指標を追求するのではなく。',
    takeawayKo:
      '싱가포르의 8월 연구 궤적은 일반 목적 모델 스케일링에서 도메인 특화, 해석 가능한 AI 시스템으로의 성숙을 보여줍니다. 이 달은 공식적인 LLM 평가 및 안전 방법(X-RAY 프로브, 가소성 보존 RL, 교육학적 누수 탐지), 세밀한 설명 가능성을 갖춘 임상용 비전-언어 모델, 단백질 기반 모델, 오픈소스 로봇공학 인프라를 포괄합니다. 이는 임상의, 규제자, 제조업체가 검사하고 신뢰할 수 있는 AI 시스템을 구축하려는 전략적 전환을 반영하며, 다기관 협력(A*STAR, NUS, NTU, SUTD, IHPC)과 정책 분석(저작권 체계)을 바탕으로 최첨단 능력 지표를 추구하기보다는 이러한 방향을 지향하고 있습니다.',
  },
  {
    id: 'sg-ai-research-2026-07',
    title: '新加坡 AI 研究月报（2026 年 7 月）',
    titleEn: 'Singapore AI Research Monthly (2026-07)',
    titleJa: 'Singapore AI 研究月報（2026-07）',
    titleKo: '싱가포르 AI 연구 월간 (2026-07)',
    date: '2026-07',
    source: 'OpenAlex + 站方筛选',
    sourceEn: 'OpenAlex + our curation',
    sourceJa: 'OpenAlex + 当サイトの選定',
    sourceKo: 'OpenAlex + 사이트 큐레이션',
    tags: ['研究月报', 'National University of Singapore', 'Nanyang Technological University'],
    tagsEn: ['Research monthly', 'National University of Singapore', 'Nanyang Technological University'],
    tagsJa: ['研究マンスリー', 'National University of Singapore', 'Nanyang Technological University'],
    tagsKo: ['연구 월간', 'National University of Singapore', 'Nanyang Technological University'],
    sections: [
      {
        heading: 'AI 安全与评估',
        headingEn: 'AI safety & evaluation',
        headingJa: 'AI安全と評価',
        headingKo: 'AI 안전성 및 평가',
        points: [
          '【National University of Singapore】A Practical Guide to Interpretability Metrics for Chain of Thought Reasoning — 一份由 NUS 撰写的调查系统地组织了思维链可解释性指标这一零散的领域，直接解决 LLM 推理轨迹是否忠实而非仅仅看起来可信的问题。这是人工智能安全/评估领域的核心工作，涉及相信前沿推理模型的一个中心问题。（https://doi.org/10.5281/zenodo.21127002）',
          '【Nanyang Technological University】Are heterogeneous graph neural networks truly effective for node classification? A causal perspective — 这篇由南洋理工大学（NTU）牵头的论文使用因果推断来测试异构图神经网络在节点分类上报告的性能提升是否真实，或是被数据集工件混淆，这是一项注重严谨性的贡献，发表在备受尊敬的期刊《Knowledge-Based Systems》上。它代表了实质性的新加坡主导的AI方法论工作，而不是下游领域应用。（https://doi.org/10.1016/j.knosys.2026.116595）',
          '【Singapore University of Social Sciences】Governance-Aware Agentic AI for Enterprise Engineering Systems: A Design-Science Reference Architecture and Quantitative Risk-Control Model — 该论文来自新加坡社会科学大学，提出了设计科学参考架构和定量风险控制模型，用于在企业环境中治理代理型AI，涵盖可审计性、工具调用控制和人工升级。随着企业代理型AI采纳加速，该治理框架与新加坡的AI政策生态系统直接相关，虽然该论文仍为概念性预印本（Zenodo），未经实证验证。（https://doi.org/10.5281/zenodo.21264296）',
        ],
        pointsEn: [
          '[National University of Singapore] A Practical Guide to Interpretability Metrics for Chain of Thought Reasoning — A NUS-authored survey systematically organizes the fragmented landscape of chain-of-thought interpretability metrics, directly addressing whether LLM reasoning traces are faithful rather than just plausible-looking. This is core AI safety/evaluation work on a problem central to trusting frontier reasoning models. (https://doi.org/10.5281/zenodo.21127002)',
          "[Nanyang Technological University] Are heterogeneous graph neural networks truly effective for node classification? A causal perspective — This NTU-led paper uses causal inference to test whether heterogeneous graph neural networks' reported gains on node classification are genuine or confounded by dataset artifacts, a rigor-focused contribution published in the respected journal Knowledge-Based Systems. It represents substantive Singapore-led AI methodology work rather than a downstream domain application. (https://doi.org/10.1016/j.knosys.2026.116595)",
          "[Singapore University of Social Sciences] Governance-Aware Agentic AI for Enterprise Engineering Systems: A Design-Science Reference Architecture and Quantitative Risk-Control Model — Authored at the Singapore University of Social Sciences, this paper proposes a design-science reference architecture and quantitative risk-control model for governing agentic AI in enterprise settings, covering auditability, tool-invocation control, and human escalation. As enterprise agentic AI adoption accelerates, the governance framing is directly relevant to Singapore's AI policy ecosystem, though it remains a conceptual preprint (Zenodo) without empirical validation. (https://doi.org/10.5281/zenodo.21264296)",
        ],
        pointsJa: [
          '【National University of Singapore】A Practical Guide to Interpretability Metrics for Chain of Thought Reasoning — NUS著の調査は、思考の連鎖解釈可能性指標の断片化された状況を体系的に整理し、LLM推論トレースが忠実であるか、単なるもっともらしく見えるだけかという問題に直接対処しています。これはフロンティア推論モデルへの信頼に中心的な問題に関する中核的なAI安全性・評価作業です。（https://doi.org/10.5281/zenodo.21127002）',
          '【Nanyang Technological University】Are heterogeneous graph neural networks truly effective for node classification? A causal perspective — 本論文はNTUが主導し、因果推論を用いて、ヘテロジニアスグラフニューラルネットワークのノード分類における報告された改善が本物であるか、あるいはデータセット・アーティファクトによる交絡であるかをテストするもので、厳密性に焦点を当てた貢献として尊敬される学術誌『Knowledge-Based Systems』に掲載されています。本研究はダウンストリーム領域応用というより、実質的なシンガポール主導のAI方法論研究を表しています。（https://doi.org/10.1016/j.knosys.2026.116595）',
          '【Singapore University of Social Sciences】Governance-Aware Agentic AI for Enterprise Engineering Systems: A Design-Science Reference Architecture and Quantitative Risk-Control Model — シンガポール社会科学大学で執筆された本論文は、エンタープライズ環境におけるエージェント型AIを統治するための、デザイン・サイエンス参照アーキテクチャおよび定量的リスク管理モデルを提案しており、監査可能性、ツール呼び出し制御、および人間へのエスカレーションをカバーしています。エンタープライズ・エージェント型AIの採用が加速する中、このガバナンス・フレームワークはシンガポールのAIポリシー・エコシステムに直接的に関連していますが、これは概念段階のプレプリント（Zenodo）のままであり、経験的検証がされていません。（https://doi.org/10.5281/zenodo.21264296）',
        ],
        pointsKo: [
          '[National University of Singapore] A Practical Guide to Interpretability Metrics for Chain of Thought Reasoning — NUS가 저술한 조사 논문은 체인-오브-소트 해석 가능성 지표의 단편화된 지형을 체계적으로 정리하면서, LLM 추론 흔적이 그저 그럴듯해 보이기만 한 것이 아니라 충실한지를 직접 다룬다. 이는 최첨단 추론 모델을 신뢰하는 데에 중추적인 문제에 관한 핵심 AI 안전성/평가 연구이다. (https://doi.org/10.5281/zenodo.21127002)',
          '[Nanyang Technological University] Are heterogeneous graph neural networks truly effective for node classification? A causal perspective — 이 NTU-주도 논문은 인과 추론을 활용하여 이질형 그래프 신경망의 노드 분류 성능 향상이 진정한지 아니면 데이터셋 인공물에 의해 교란된 것인지를 검증하는 엄밀성 중심의 기여로서, 존경받는 저널 Knowledge-Based Systems에 발표되었습니다. 이는 하위 도메인 응용이 아닌 실질적인 싱가포르-주도 AI 방법론 연구를 대표합니다. (https://doi.org/10.1016/j.knosys.2026.116595)',
          '[Singapore University of Social Sciences] Governance-Aware Agentic AI for Enterprise Engineering Systems: A Design-Science Reference Architecture and Quantitative Risk-Control Model — Singapore University of Social Sciences에서 저술된 본 논문은 기업 환경에서 에이전트 AI를 관리하기 위한 설계 과학 참조 아키텍처와 정량적 위험 제어 모델을 제안하며, 감사 용이성, 도구 호출 제어, 인간 상향 에스컬레이션을 다룬다. 기업 에이전트 AI 도입이 가속화되는 가운데 거버넌스 프레이밍은 싱가포르의 AI 정책 생태계와 직접 관련성이 있으나, 현재는 경험적 검증이 없는 개념적 프리프린트(Zenodo)로 남아 있다. (https://doi.org/10.5281/zenodo.21264296)',
        ],
      },
      {
        heading: 'LLMs 与智能体',
        headingEn: 'LLMs & agents',
        headingJa: 'LLMとエージェント',
        headingKo: 'LLMs와 에이전트',
        points: [
          '【Nanyang Technological University】Beyond Textual Repository Exploration: Dual-Modal Structural Reasoning for Agentic Issue Resolution — 南洋理工大学研究人员提出 DUALVIEW，这是一种双模态（文本+代码结构）推理方法，用于智能体自动解决 issue，可以解决编码智能体在导航大型代码仓库时的已知失效模式。它正处于当前 LLM 智能体研究快速发展的 agentic coding 领域核心。（https://openalex.org/W7167379738）',
          '【Singapore Management University】Knowledge-State Generative Agents for Pre Assessment Question Evaluation — 新加坡管理大学(SMU)研究人员构建并实证验证了基于大语言模型的生成型代理，这些代理模拟具有不同掌握水平的学生以评估评估问题的质量，并基于来自424名学生的真实数据进行了测试。该研究发表在顶级信息系统期刊上，展示了可信的应用型大语言模型-代理研究，具有明确的教育生态系统相关性。（https://openalex.org/W7164709949）',
          '【National University of Singapore】ChakapBot: A Generative AI-Powered Chatbot for the Revitalisation of Baba Malay — ChakapBot 由新加坡国立大学（NUS）开发，是一款生成式 AI 聊天机器人，基于社区策划的语料库进行训练，旨在支持濒危新加坡遗产语言巴巴马来语（Baba Malay）的复兴和文献记录，已在 26 名参与者的试点项目中进行验证。这是一个独特的、社会性基础的 LLM 应用，具有明确的生态系统和文化保护意义，超越了典型的商业用途。（https://doi.org/10.3390/languages11070145）',
        ],
        pointsEn: [
          "[Nanyang Technological University] Beyond Textual Repository Exploration: Dual-Modal Structural Reasoning for Agentic Issue Resolution — NTU researchers propose DUALVIEW, a dual-modal (text + code-structure) reasoning approach for agentic issue resolution that tackles a known failure mode of coding agents navigating large repositories. It's squarely in the fast-moving agentic-coding space that dominates current LLM agent research. (https://openalex.org/W7167379738)",
          '[Singapore Management University] Knowledge-State Generative Agents for Pre Assessment Question Evaluation — SMU researchers built and empirically validated LLM-based generative agents that simulate students with varying mastery levels to evaluate assessment question quality, tested on real data from 424 students. Published in a top Information Systems journal, it shows credible applied LLM-agent research with clear educational-ecosystem relevance. (https://openalex.org/W7164709949)',
          "[National University of Singapore] ChakapBot: A Generative AI-Powered Chatbot for the Revitalisation of Baba Malay — ChakapBot, built at NUS, is a generative AI chatbot trained on a community-curated corpus to support revitalization and documentation of Baba Malay, an endangered Singapore heritage language, validated in a 26-participant pilot. It's a distinctive, socially-grounded LLM application with clear ecosystem and cultural-preservation significance beyond typical commercial use. (https://doi.org/10.3390/languages11070145)",
        ],
        pointsJa: [
          '【Nanyang Technological University】Beyond Textual Repository Exploration: Dual-Modal Structural Reasoning for Agentic Issue Resolution — NTU の研究者は、大規模リポジトリをナビゲートするコーディングエージェントの既知の失敗モードに対処するエージェント型課題解決のための二重モーダル（テキスト＋コード構造）推論アプローチ DUALVIEW を提案しています。このアプローチは、現在の LLM エージェント研究を支配する急速に進化するエージェント型コーディング領域に正に位置しています。（https://openalex.org/W7167379738）',
          '【Singapore Management University】Knowledge-State Generative Agents for Pre Assessment Question Evaluation — SMUの研究者は、さまざまな習熟度レベルを有する学生をシミュレートするLLMベースの生成エージェントを構築し、実証的に検証しました。これは評価問題の質を評価するために設計されており、424人の学生からの実データでテストされました。この研究は一流の情報システム誌に掲載されており、教育エコシステムとの明確な関連性を有する、信頼できる応用的なLLMエージェント研究を示しています。（https://openalex.org/W7164709949）',
          '【National University of Singapore】ChakapBot: A Generative AI-Powered Chatbot for the Revitalisation of Baba Malay — NUS で構築された ChakapBot は、絶滅危機にある Singapore の伝統言語である Baba Malay の復興と記録を支援するため、コミュニティによってキュレーションされたコーパスで訓練された生成 AI チャットボットであり、26 人の参加者による試験で検証されました。これは特徴的で社会的に根ざした LLM アプリケーションであり、明確なエコシステムおよび文化保全の意義を有し、典型的な商用利用を超えた価値を持つものです。（https://doi.org/10.3390/languages11070145）',
        ],
        pointsKo: [
          '[Nanyang Technological University] Beyond Textual Repository Exploration: Dual-Modal Structural Reasoning for Agentic Issue Resolution — NTU 연구진이 DUALVIEW를 제안합니다. 이는 대규모 저장소를 탐색하는 코딩 에이전트의 알려진 실패 모드를 해결하기 위한 이중 모달(텍스트 + 코드 구조) 추론 접근법입니다. 현재 LLM 에이전트 연구를 주도하고 있는 빠르게 발전하는 에이전트 코딩 분야에 정확히 위치합니다. (https://openalex.org/W7167379738)',
          '[Singapore Management University] Knowledge-State Generative Agents for Pre Assessment Question Evaluation — SMU 연구진이 다양한 숙달 수준을 지닌 학생들을 모의하는 LLM 기반 생성형 에이전트를 개발하고 실증적으로 검증했으며, 424명 학생의 실제 데이터를 통해 평가 문항 품질을 평가했습니다. 상위 정보 시스템 저널에 게시된 이 연구는 명확한 교육 생태계 관련성을 갖춘 신뢰할 수 있는 응용 LLM-에이전트 연구를 보여줍니다. (https://openalex.org/W7164709949)',
          '[National University of Singapore] ChakapBot: A Generative AI-Powered Chatbot for the Revitalisation of Baba Malay — NUS에서 구축되고 커뮤니티 큐레이션 말뭉치로 학습되며 26명이 참여한 파일럿에서 검증된 ChakapBot은 싱가포르의 멸종 위기 유산 언어인 바바 말레이어의 부흥과 문서화를 지원하는 생성 AI 챗봇입니다. 이는 일반적인 상용 사용을 넘어 명확한 생태계 및 문화 보존 의의를 지닌 독특하고 사회 기반의 LLM 애플리케이션입니다. (https://doi.org/10.3390/languages11070145)',
        ],
      },
      {
        heading: '多模态与视觉',
        headingEn: 'Multimodal & vision',
        headingJa: 'マルチモーダル・ビジョン',
        headingKo: '멀티모달 & 시각',
        points: [
          '【Nanyang Technological University】LongVQUBench: Benchmarking Long-Term Video Quality Understanding of Vision-Language Models — LongVQUBench 是 NTU 推出的一项重要新基准（1,200+ 个视频，1,500 个问答对），用于评估大型视觉语言模型的长期视频质量理解能力，填补了真实存在的空白，因为先前的基准只覆盖短视频片段。它直接测试前沿多模态模型在时序推理上的能力。（https://openalex.org/W7167289797）',
          '【National University of Singapore】NoPA: Non-Parametric Online 3D Scene Graph Generation — 由NUS主导的NoPA通过替换粗糙的单高斯对象近似，推进了实时3D场景图生成，既改进了速度，也提高了具身/机器人感知的几何保真度。这是对核心多模态感知问题的扎实技术贡献，具有实际的机器人相关性。（https://openalex.org/W7167290256）',
        ],
        pointsEn: [
          '[Nanyang Technological University] LongVQUBench: Benchmarking Long-Term Video Quality Understanding of Vision-Language Models — LongVQUBench is a substantial new benchmark (1,200+ videos, 1,500 QA pairs) from NTU for evaluating long-term video quality understanding in large vision-language models, filling a real gap since prior benchmarks only cover short clips. It directly tests frontier multimodal model capabilities on temporal reasoning. (https://openalex.org/W7167289797)',
          "[National University of Singapore] NoPA: Non-Parametric Online 3D Scene Graph Generation — NUS-led NoPA advances real-time 3D scene graph generation by replacing coarse single-Gaussian object approximations, improving both speed and geometric fidelity for embodied/robotic perception. It's a solid technical contribution to a core multimodal perception problem with practical robotics relevance. (https://openalex.org/W7167290256)",
        ],
        pointsJa: [
          '【Nanyang Technological University】LongVQUBench: Benchmarking Long-Term Video Quality Understanding of Vision-Language Models — LongVQUBenchは、NTUが開発した実質的な新ベンチマーク（1,200本以上の動画、1,500のQAペア）です。大規模なビジョン言語モデルにおける長期的な動画品質理解を評価するためのもので、従来のベンチマークが短いクリップのみをカバーしているという現実のギャップを埋めています。最先端のマルチモーダルモデルの時間的推論能力を直接テストするものです。（https://openalex.org/W7167289797）',
          '【National University of Singapore】NoPA: Non-Parametric Online 3D Scene Graph Generation — NUS主導のNoPA は、粗い単一ガウス分布オブジェクト近似を置き換えることで、リアルタイム3Dシーングラフ生成を進展させ、身体的/ロボット知覚に対する速度と幾何学的忠実性の両方を改善しています。これは、実用的なロボット工学への関連性を持つ中核的なマルチモーダル知覚問題への堅実な技術的貢献です。（https://openalex.org/W7167290256）',
        ],
        pointsKo: [
          '[Nanyang Technological University] LongVQUBench: Benchmarking Long-Term Video Quality Understanding of Vision-Language Models — LongVQUBench는 NTU에서 개발한 상당한 규모의 새로운 벤치마크(1,200개 이상의 동영상, 1,500개의 QA 쌍)입니다. 대규모 시각-언어 모델의 장기 동영상 품질 이해를 평가하기 위해 설계되었으며, 이전 벤치마크가 짧은 클립만을 다루었던 점에서 실질적인 공백을 채웁니다. 최첨단 다중 모달 모델의 시간적 추론 능력을 직접 검증합니다. (https://openalex.org/W7167289797)',
          '[National University of Singapore] NoPA: Non-Parametric Online 3D Scene Graph Generation — NUS 주도의 NoPA는 거친 단일-Gaussian 객체 근사를 대체함으로써 실시간 3D 장면 그래프 생성을 발전시키고, embodied/robotic perception을 위한 속도와 기하학적 충실도를 모두 개선합니다. 이는 실질적인 로봇공학 연관성이 있는 핵심 multimodal perception 문제에 대한 견고한 기술적 기여입니다. (https://openalex.org/W7167290256)',
        ],
      },
      {
        heading: '科学与健康的人工智能',
        headingEn: 'AI for science & health',
        headingJa: '科学とヘルスケアのAI',
        headingKo: '과학과 보건을 위한 AI',
        points: [
          '【Nanyang Technological University】Reaction-aware molecular representation learning: Toward generalizable artificial intelligence for enzymatic catalysis — NTU研究人员推出了一个反应感知分子表征学习框架，旨在实现用于酶催化的可泛化AI，发表于《Acta Pharmaceutica Sinica B》。它针对的是AI-for-science领域的核心瓶颈——"化学反应的可转移表征"——而不是一个狭窄的、增量式的应用场景。（https://doi.org/10.1016/j.apsb.2026.06.033）',
          '【Agency for Science, Technology and Research】CycPeptMPDB-4D: Multi-Solvent Conformational Ensembles for Predicting Cyclic Peptide Permeability — CycPeptMPDB-4D是一个大规模多机构（A*STAR、NUS、NTU）资源，包含5,160个环肽的分子动力学衍生构象集合，明确为训练用于膜通透性预测的3D/4D深度学习模型而构建。这是一项基础数据集贡献，桥接了基于物理的模拟与AI驱动的药物发现，反映了新加坡在AI科学基础设施中日益增长的角色。（https://doi.org/10.5281/zenodo.21237441）',
        ],
        pointsEn: [
          '[Nanyang Technological University] Reaction-aware molecular representation learning: Toward generalizable artificial intelligence for enzymatic catalysis — NTU researchers introduce a reaction-aware molecular representation learning framework aimed at generalizable AI for enzymatic catalysis, published in Acta Pharmaceutica Sinica B. It targets a core AI-for-science bottleneck—transferable representations of chemical reactions—rather than a narrow, incremental use case. (https://doi.org/10.1016/j.apsb.2026.06.033)',
          "[Agency for Science, Technology and Research] CycPeptMPDB-4D: Multi-Solvent Conformational Ensembles for Predicting Cyclic Peptide Permeability — CycPeptMPDB-4D is a large multi-institution (A*STAR, NUS, NTU) resource of molecular-dynamics-derived conformational ensembles for 5,160 cyclic peptides, built explicitly to train 3D/4D deep learning models for membrane permeability prediction. It's a foundational dataset contribution bridging physics-based simulation and AI-driven drug discovery, reflecting Singapore's growing AI-for-science infrastructure role. (https://doi.org/10.5281/zenodo.21237441)",
        ],
        pointsJa: [
          '【Nanyang Technological University】Reaction-aware molecular representation learning: Toward generalizable artificial intelligence for enzymatic catalysis — NTU研究者が、酵素触媒作用のための汎用化可能なAIを目指す反応認識型分子表現学習フレームワークを提案し、Acta Pharmaceutica Sinica Bに発表しました。これは狭い段階的なユースケースではなく、AI-for-scienceの中核的なボトルネック—化学反応の転移可能な表現—を対象としています。（https://doi.org/10.1016/j.apsb.2026.06.033）',
          '【Agency for Science, Technology and Research】CycPeptMPDB-4D: Multi-Solvent Conformational Ensembles for Predicting Cyclic Peptide Permeability — CycPeptMPDB-4Dは、A*STAR、NUS、NTUを含む複数機関による大規模なリソースです。5,160個の環状ペプチドに対する分子動力学から導出された立体配置アンサンブルを備えており、膜透過性予測のための3D/4D深層学習モデルの訓練を明示的な目的として構築されています。これは物理ベースシミュレーションとAI駆動型創薬を橋渡しする基礎的なデータセット貢献であり、シンガポールの科学向けAI基盤分野における成長する役割を反映しています。（https://doi.org/10.5281/zenodo.21237441）',
        ],
        pointsKo: [
          '[Nanyang Technological University] Reaction-aware molecular representation learning: Toward generalizable artificial intelligence for enzymatic catalysis — NTU 연구팀이 효소 촉매작용을 위한 일반화 가능한 AI를 목표로 하는 반응 인식 분자 표현 학습 프레임워크를 소개했으며, Acta Pharmaceutica Sinica B에 게재되었습니다. 이는 좁고 점진적인 사용 사례가 아닌, 과학 AI의 핵심 병목인 화학 반응의 전이 가능한 표현을 겨냥합니다. (https://doi.org/10.1016/j.apsb.2026.06.033)',
          '[Agency for Science, Technology and Research] CycPeptMPDB-4D: Multi-Solvent Conformational Ensembles for Predicting Cyclic Peptide Permeability — CycPeptMPDB-4D는 다기관(A*STAR, NUS, NTU)의 대규모 자원으로, 5,160개 고리형 펩타이드에 대한 분자동역학 유래 구조 앙상블을 제공하며, 막 투과성 예측을 위한 3D/4D 딥러닝 모델 훈련을 위해 명시적으로 구축되었습니다. 이는 물리 기반 시뮬레이션과 AI 기반 신약 개발을 연결하는 기초 데이터셋 기여이며, 싱가포르의 성장하는 AI-과학 인프라 역할을 반영합니다. (https://doi.org/10.5281/zenodo.21237441)',
        ],
      },
    ],
    takeaway:
      '新加坡七月论文揭示了一个战略转向——从前沿模型开发转向智能体AI系统和AI-科学基础设施，同时越来越强调治理、可解释性和严格的评估方法。该投资组合涵盖实时3D感知智能体、应用教育智能体、分子发现数据集和企业治理框架，将新加坡明确定位为既是可信度评估者，也是高风险领域AI部署基础设施的架构者。',
    takeawayEn:
      "Singapore's July papers reveal a strategic pivot from frontier model development toward agentic AI systems and AI-for-science infrastructure, paired with growing emphasis on governance, interpretability, and rigorous evaluation methods. The portfolio—spanning real-time 3D perception agents, applied educational agents, molecular discovery datasets, and enterprise governance frameworks—positions Singapore distinctly as both a trustworthiness evaluator and an architect of AI deployment infrastructure for high-stakes domains.",
    takeawayJa:
      'シンガポールの7月の論文は、フロンティアモデル開発からエージェント型AIシステムおよびAI for Science基盤へのシフト、ならびにガバナンス、解釈可能性、および厳密な評価手法への重点の高まりを明らかにしています。リアルタイム3D知覚エージェント、応用教育エージェント、分子発見データセット、およびエンタープライズガバナンスフレームワークを網羅するポートフォリオは、シンガポールを信頼性評価者およびハイステークス領域向けAI配備基盤の設計者として明確に位置付けています。',
    takeawayKo:
      '싱가포르의 7월 논문들은 프론티어 모델 개발에서 에이전틱 AI 시스템 및 과학용 AI 인프라로의 전략적 전환을 드러내고 있으며, 거버넌스, 해석가능성, 엄격한 평가 방법론에 대한 강조가 점차 커지고 있습니다. 실시간 3D 인식 에이전트, 적용형 교육 에이전트, 분자 발견 데이터셋, 기업 거버넌스 프레임워크를 아우르는 포트폴리오는 싱가포르를 신뢰성 평가자이자 고위험 영역을 위한 AI 배포 인프라의 설계자로서 뚜렷하게 위치시킵니다.',
  },
  {
    id: 'edb-meeting-ai-infra-2026-02',
    title: 'AI 创业公司与 EDB 会议纪要',
    titleKo: 'AI 스타트업과 EDB 회의 기록',
    titleJa: 'AI スタートアップ企業と EDB の会議紀要',
    titleEn: 'Meeting Notes: AI Startup Meets EDB',
    date: '2026-02',
    source: '社区分享',
    sourceKo: '커뮤니티 공유',
    sourceJa: 'コミュニティシェア',
    sourceEn: 'Community contribution',
    tags: ['EDB', 'EP 申请', '税务合规', '补贴政策', '公司注册'],
    tagsEn: ['EDB', 'EP application', 'Tax compliance', 'Grant programmes', 'Company incorporation'],
    tagsJa: ['EDB', 'EP 申請', '税務コンプライアンス', '補助金政策', '会社設立'],
    tagsKo: ['EDB', 'EP 신청', '세무 컴플라이언스', '보조금 정책', '회사 설립'],
    companyProfile: 'AI 平台公司，ARR 接近 $100M，注册在新加坡，团队主要 remote，约 10 人',
    companyProfileKo: 'AI 플랫폼 기업, ARR이 $100M에 근접, 싱가포르 등록, 팀은 주로 원격, 약 10명',
    companyProfileJa:
      'AI プラットフォーム企業、ARR が $100M に接近、シンガポールに登録、チームは主にリモート、約 10 人',
    companyProfileEn:
      'AI platform company, ARR approaching $100M, incorporated in Singapore, team mostly remote, around 10 people.',
    sections: [
      {
        heading: '公司属性判定：看股权结构，不看创始人国籍',
        headingKo: '기업 속성 판정: 지분 구조를 보되, 창업자 국적은 보지 않음',
        headingJa: '企業属性の判定：株式構造を確認し、創業者の国籍は確認しない',
        headingEn: 'Company classification: shareholding structure, not founder nationality',
        points: [
          'EDB 判断"新加坡公司"还是"中资企业"，标准清楚：公司主体注册在哪、股权结构有没有中国公司、客户和营收是否全球化',
          '只要公司注册在新加坡、股东里没有中国主体、业务以北美/欧洲/全球为主，就是新加坡公司',
          '这决定了走总部型路径还是需要特殊管理',
        ],
        pointsEn: [
          'EDB applies a clear test for "Singapore company" vs "Chinese-funded enterprise": where the entity is incorporated, whether the cap table contains Chinese entities, and whether customers and revenue are globally distributed.',
          'If the company is incorporated in Singapore, has no Chinese entity on the cap table, and runs a business primarily oriented to North America, Europe or globally, it counts as a Singapore company.',
          'This classification determines whether you go down the headquarters-track route or require a special-handling pathway.',
        ],
        pointsJa: [
          'EDB は「シンガポール企業」か「中国資本企業」かを明確な基準で見ます。法人がどこで登録されているか、株主構成に中国企業があるか、顧客と売上がグローバルかどうかです。',
          '会社がシンガポールで登録され、株主に中国主体がなく、事業が北米・欧州・グローバル中心なら、シンガポール企業として扱われます。',
          'この判定で、本部型ルートに進むのか、特別な取り扱いが必要なのかが決まります。',
        ],
        pointsKo: [
          'EDB는 “싱가포르 회사”와 “중국계 기업”을 명확한 기준으로 구분합니다. 법인이 어디에 등록되어 있는지, 지분 구조에 중국 법인이 있는지, 고객과 매출이 글로벌하게 분산되어 있는지를 봅니다.',
          '회사가 싱가포르에 등록되어 있고 주주에 중국 주체가 없으며, 사업이 북미·유럽·글로벌 중심이면 싱가포르 회사로 봅니다.',
          '이 분류가 본부형 경로로 갈지, 특별 관리가 필요한지를 결정합니다.',
        ],
        highlight: '看结构，不看护照',
        highlightKo: '구조를 보되, 여권은 보지 않음',
        highlightJa: '構造を見て、パスポートを見ない',
        highlightEn: 'Structure, not passport',
      },
      {
        heading: 'EP 申请：正常走比找关系更顺',
        headingKo: 'EP 신청: 정상 경로가 인맥 활용보다 더 순조로움',
        headingJa: 'EP 申請：通常のプロセスで申請する方が、人脈を頼るより円滑です',
        headingEn: 'EP applications: going through the front door beats relying on connections',
        points: [
          'CEO/CTO 等核心高管的 EP 门槛不高，不要求先雇本地员工',
          '薪资必须由新加坡公司发放',
          '90% 的拒签是因为材料填错，不是政策问题',
          '早期（10-20 人）最宽松，规模扩大后需要符合多元化要求',
          '建议：先直接自己在线申请，被拒了再找中介',
        ],
        pointsEn: [
          'EP thresholds for core executives such as CEO/CTO are not high, and do not require prior hiring of local staff.',
          'Salary must be paid out of the Singapore entity.',
          'About 90% of rejections are due to errors in the application, not policy issues.',
          'Headcount of 10–20 is the most permissive band; once you scale, diversity requirements apply.',
          'Recommendation: apply yourself online first; only engage an agent if you get rejected.',
        ],
        pointsJa: [
          'CEO / CTO など主要幹部の EP 要件は高くなく、先にローカル社員を雇う必要もありません。',
          '給与はシンガポール法人から支払う必要があります。',
          '却下の約 90% は政策上の問題ではなく、申請書類のミスによるものです。',
          '初期段階（10〜20 人）が最も柔軟で、規模が大きくなると多様性要件がかかります。',
          '提案：まず自分でオンライン申請し、却下された場合にだけ代理人を使う。',
        ],
        pointsKo: [
          'CEO / CTO 같은 핵심 임원의 EP 문턱은 높지 않으며, 먼저 현지 직원을 고용할 필요도 없습니다.',
          '급여는 반드시 싱가포르 법인에서 지급되어야 합니다.',
          '거절의 약 90%는 정책 문제가 아니라 서류 작성 오류 때문입니다.',
          '초기 단계(10~20명)가 가장 유연하며, 규모가 커지면 다양성 요건을 충족해야 합니다.',
          '권장 순서: 먼저 직접 온라인으로 신청하고, 거절된 뒤에만 에이전트를 찾으세요.',
        ],
      },
      {
        heading: '真正的红线：团队单一性',
        headingKo: '진정한 레드라인: 팀의 동질성',
        headingJa: '真の赤線：チームの単一性',
        headingEn: 'The actual red line: monocultural teams',
        points: [
          '新加坡不强求本地员工比例，但很在意团队多元化',
          '不行的结构：全中国团队、全印度团队、全美国团队',
          '可以的结构：中国 + 北美 + 欧洲 + 澳洲',
          '单一文化的公司很难真正国际化——这是长期观察的结论，不是政治正确',
        ],
        pointsEn: [
          'Singapore does not require a fixed local-headcount ratio, but it cares a lot about team diversity.',
          'Unacceptable: an all-China team, an all-India team, an all-US team.',
          'Acceptable: China + North America + Europe + Australia.',
          'Monocultural companies rarely become truly international — this is a long-running observation from experience, not political correctness.',
        ],
        pointsJa: [
          'シンガポールは固定のローカル社員比率を強制しませんが、チームの多様性を非常に重視します。',
          '望ましくない構成：全員が中国チーム、全員がインドチーム、全員が米国チーム。',
          '許容されやすい構成：中国 + 北米 + 欧州 + オーストラリア。',
          '単一文化の会社は本当の意味で国際化しにくい。これは長期観察からの結論であり、政治的正しさではありません。',
        ],
        pointsKo: [
          '싱가포르는 고정된 현지 직원 비율을 강제하지 않지만, 팀 다양성을 매우 중요하게 봅니다.',
          '어려운 구조: 전원 중국 팀, 전원 인도 팀, 전원 미국 팀.',
          '가능한 구조: 중국 + 북미 + 유럽 + 호주.',
          '단일 문화 팀은 진정으로 국제화되기 어렵습니다. 이는 장기 관찰의 결론이지 정치적 올바름이 아닙니다.',
        ],
        highlight: '多元化不是门面，是实质要求',
        highlightKo: '다양성은 겉치레가 아니라 실질적 요구사항입니다',
        highlightJa: '多元化は見せかけではなく、実質的な要件です',
        highlightEn: 'Diversity is not window-dressing; it is a substantive requirement',
      },
      {
        heading: '对照案例：Manus 是特例',
        headingKo: '참고 사례: Manus는 특례입니다',
        headingJa: '対照事例：Manus は特例です',
        headingEn: 'Counterexample: Manus is a special case',
        points: [
          'EDB 方面主动提到 Manus，但明确表示那是特殊情况',
          'Manus 面临外部监管的时间窗口压力，必须极短时间内迁出核心团队',
          'EDB 深度介入：提前与人力部沟通、拆分人员批次',
          '预期是要放弃一部分原有团队',
          '结论：正常公司走正常流程，成功率更高。特殊协助只出现在"已经没有第二种选择"的情况下',
          '后续验证（2026-04-27）：中国国家发改委以国安为由叫停 Meta 对 Manus 的 20 亿美元收购，划三条红线（技术主权/数据主权/国家安全）。EDB 当时所说的「时间窗口压力」与「迁出核心团队」事后被证实是源自来源国监管走向——单凭迁注册地不足以脱离来源国管辖，这是「Singapore washing」策略的第一次被显式驳回。',
          '后续验证（2026-08-11）：Manus 致信用户宣布恢复独立运营，Meta 收购正式拆解，Meta 所有权期间（2025-12-29 起）的用户数据被删除。从否决到拆解的闭环走完，Manus 总部仍在新加坡。',
        ],
        pointsEn: [
          'EDB raised Manus on its own initiative, but made clear that it was a special case.',
          'Manus faced an external-regulatory time window and had to relocate its core team in a very compressed timeframe.',
          'EDB engaged deeply: coordinating in advance with the Ministry of Manpower and breaking the relocation into batches.',
          'The expectation was that part of the original team would have to be left behind.',
          'Bottom line: ordinary companies should follow the ordinary process, where success rates are higher. Special assistance is reserved for situations where there is no alternative.',
          'Follow-up (27 April 2026): China\'s NDRC blocked Meta\'s US$2B acquisition of Manus on national-security grounds, drawing three red lines (technology sovereignty, data sovereignty, national security). The "time-window pressure" and the "core-team relocation" EDB referenced were, in hindsight, downstream of source-country regulatory direction — re-domiciling alone is not enough to exit source-country jurisdiction, and the "Singapore washing" play was, for the first time, explicitly rejected.',
          "Follow-up (11 August 2026): Manus wrote to users announcing a return to independent operations, formally unwinding the Meta acquisition; user data generated under Meta's ownership (from 29 December 2025) is being deleted. The case has now run its full course from veto to unwind, with Manus still headquartered in Singapore.",
        ],
        pointsJa: [
          'EDB 側から Manus の話題が出ましたが、同時にそれは特殊ケースだと明確に説明されました。',
          'Manus は外部規制による時間制約に直面し、極めて短期間で中核チームを移す必要がありました。',
          'EDB は深く関与し、事前に人材省と調整し、移転対象者を複数バッチに分けました。',
          '元のチームの一部を残さざるを得ない、という前提でした。',
          '結論：通常の会社は通常プロセスを進めた方が成功率が高い。特別支援は「他に選択肢がない」状況でだけ現れます。',
          '後続検証（2026-04-27）：中国国家発展改革委員会は国家安全保障を理由に、Meta による Manus の 20 億米ドル買収を停止し、技術主権・データ主権・国家安全保障の 3 つのレッドラインを示しました。EDB が当時語った「時間制約」と「中核チーム移転」は、後から見ると出所国の規制動向に由来していました。登記地を移すだけでは出所国の管轄から離れられず、「Singapore washing」戦略は初めて明示的に退けられました。',
          '後続検証（2026-08-11）：Manus はユーザーへの書簡で独立運営への復帰を発表し、Meta による買収は正式に解消されました。Meta 所有期間（2025-12-29 以降）のユーザーデータは削除されます。否決から解消までの一連の流れが完結し、Manus の本社は引き続きシンガポールにあります。',
        ],
        pointsKo: [
          'EDB가 먼저 Manus를 언급했지만, 동시에 그것이 특수 사례임을 분명히 했습니다.',
          'Manus는 외부 규제의 시간 압박을 받았고, 매우 짧은 기간 안에 핵심 팀을 이전해야 했습니다.',
          'EDB는 깊이 관여했습니다. 인력부와 사전에 조율하고, 이전 인원을 여러 배치로 나눴습니다.',
          '원래 팀의 일부는 포기해야 한다는 전제가 있었습니다.',
          '결론: 일반 회사는 일반 절차를 밟는 편이 성공률이 높습니다. 특별 지원은 “두 번째 선택지가 없는” 상황에서만 나옵니다.',
          '후속 확인(2026-04-27): 중국 국가발전개혁위원회는 국가안보를 이유로 Meta의 Manus 20억 달러 인수를 중단시키고, 기술 주권·데이터 주권·국가안보라는 세 가지 레드라인을 그었습니다. EDB가 당시 말한 “시간 압박”과 “핵심 팀 이전”은 사후적으로 보면 출처 국가의 규제 방향에서 비롯된 것이었습니다. 등록지를 옮기는 것만으로는 출처 국가 관할을 벗어날 수 없으며, “Singapore washing” 전략은 처음으로 명시적으로 거부되었습니다.',
          '후속 확인(2026-08-11): Manus는 사용자에게 보낸 서한에서 독립 운영 복귀를 발표했고, Meta의 인수는 공식적으로 해제되었습니다. Meta 소유 기간(2025-12-29 이후)의 사용자 데이터는 삭제됩니다. 부결에서 해제까지의 흐름이 마무리되었으며, Manus 본사는 여전히 싱가포르에 있습니다.',
        ],
      },
      {
        heading: '实际操作顺序：合规先于税收优惠',
        headingKo: '실제 운영 순서: 합규가 세금 우대조치보다 먼저',
        headingJa: '実際の操作順序：コンプライアンスは税制優遇より先です',
        headingEn: 'Real-world sequencing: compliance before tax incentives',
        points: [
          '当公司接近 $100M ARR，EDB 给的建议顺序：',
          '第一步：税务合规——国际税务 + Transfer Pricing，解释清楚钱为什么在这里、利润为什么这样分，建议直接用四大',
          '第二步：确定总部定位',
          '第三步：才考虑税率优惠',
          '税率优惠：17% → 15%（约 15 人），17% → 10%（25 人，第 5 年达标）',
          '政策是奖励已经跑顺的结构，不是用来救结构的',
        ],
        pointsEn: [
          'For a company approaching $100M ARR, EDB recommends the following sequence:',
          'Step 1: tax compliance — international tax plus transfer pricing, with a clear story for why revenue sits here and why profits are allocated this way; engage one of the Big Four directly.',
          'Step 2: define the headquarters positioning.',
          'Step 3: only then consider tax-rate incentives.',
          'Tax-rate incentives: 17% → 15% (around 15 staff), 17% → 10% (25 staff, achieved by year 5).',
          'Incentive policy rewards structures that already work; it is not designed to rescue broken structures.',
        ],
        pointsJa: [
          '$100M ARR に近い会社に対して、EDB は次の順序を勧めます。',
          '第 1 歩：税務コンプライアンス。国際税務 + Transfer Pricing を整え、なぜ売上がここにあり、利益がこのように配分されるのかを説明できるようにする。四大会計事務所を直接使うのがよい。',
          '第 2 歩：本部機能の位置づけを決める。',
          '第 3 歩：その後に税率優遇を検討する。',
          '税率優遇：17% → 15%（約 15 人）、17% → 10%（25 人、5 年目に達成）。',
          '優遇政策は、すでに機能している構造を報いるもので、壊れた構造を救うためのものではありません。',
        ],
        pointsKo: [
          '$100M ARR에 가까운 회사에 대해 EDB가 권하는 순서는 다음과 같습니다.',
          '1단계: 세무 컴플라이언스. 국제 세무와 Transfer Pricing을 정리하고, 왜 매출이 이곳에 있고 이익이 왜 이렇게 배분되는지 설명할 수 있어야 합니다. 빅4를 직접 쓰는 것이 좋습니다.',
          '2단계: 본부 기능의 포지셔닝을 확정합니다.',
          '3단계: 그 다음에야 세율 인센티브를 검토합니다.',
          '세율 인센티브: 17% → 15%(약 15명), 17% → 10%(25명, 5년 차 달성).',
          '인센티브 정책은 이미 잘 작동하는 구조를 보상하는 것이지, 망가진 구조를 구하기 위한 것이 아닙니다.',
        ],
        highlight: '先合规，再拿优惠',
        highlightKo: '먼저 합규, 그 다음 우대조치',
        highlightJa: '先にコンプライアンスを、その後優遇措置を受ける',
        highlightEn: 'Compliance first, incentives second',
      },
      {
        heading: '性价比高的两个政策',
        headingKo: '가성비 높은 두 가지 정책',
        headingJa: 'コストパフォーマンスが高い 2 つの政策',
        headingEn: 'Two high-leverage programmes',
        points: [
          'R&D 补贴：适合 10 人以内技术团队，只要是真实研发、和核心技术相关就可以申请',
          '本地应届生培训补贴：招 5 个本地应届毕业生（全职），由 CTO 或核心技术人员带训，政府补贴部分薪资',
          'Enterprise Compute Initiative：政府补贴本地企业使用 AI Infrastructure provider，必须在新加坡有团队才能参与，可以和 AWS、微软、谷歌等一起做',
        ],
        pointsEn: [
          'R&D grants: a good fit for technical teams of up to 10 people, available for genuine R&D work tied to core technology.',
          'Local fresh-graduate training subsidy: hire five local fresh graduates full-time, mentored by the CTO or core engineering staff, with the government subsidising part of the salary.',
          "Enterprise Compute Initiative: the government subsidises local companies' use of AI infrastructure providers; you need a Singapore-based team to participate, and it can be combined with AWS, Microsoft or Google.",
        ],
        pointsJa: [
          'R&D 補助：10 人以内の技術チームに向いており、コア技術に関係する実質的な研究開発であれば申請できます。',
          'ローカル新卒研修補助：ローカル新卒を 5 人フルタイムで採用し、CTO または中核技術者が育成する場合、政府が給与の一部を補助します。',
          'Enterprise Compute Initiative：政府がローカル企業の AI インフラプロバイダー利用を補助します。参加にはシンガポール拠点のチームが必要で、AWS、Microsoft、Google などと組み合わせられます。',
        ],
        pointsKo: [
          'R&D 보조금: 10명 이하 기술팀에 잘 맞으며, 핵심 기술과 관련된 실제 R&D라면 신청할 수 있습니다.',
          '현지 신입 졸업생 훈련 보조금: 현지 신입 졸업생 5명을 정규직으로 채용하고 CTO 또는 핵심 기술자가 교육하면 정부가 급여 일부를 보조합니다.',
          'Enterprise Compute Initiative: 정부가 현지 기업의 AI 인프라 제공업체 사용을 보조합니다. 참여하려면 싱가포르 기반 팀이 필요하며 AWS, Microsoft, Google 등과 함께 진행할 수 있습니다.',
        ],
      },
      {
        heading: '公司注册与董事',
        headingKo: '기업 등록 및 이사',
        headingJa: '企業登録と取締役',
        headingEn: 'Company incorporation and directors',
        points: [
          '公司注册在新加坡但董事是 agency 找的、自己没有 EP 的情况很常见',
          '操作路径：用新加坡公司给自己申请 EP → 拿到 EP 后可以自己担任董事',
          '董事需要承担法律责任（liable）',
          '可以选择自己操作或委托第三方 agent',
        ],
        pointsEn: [
          'It is common for the Singapore entity to be incorporated with an agency-supplied nominee director while the founder still has no EP.',
          'Workflow: use the Singapore entity to apply for your own EP, then assume the directorship after the EP is granted.',
          'Directors carry legal liability.',
          'You can run the process yourself or delegate it to a third-party agent.',
        ],
        pointsJa: [
          'シンガポール法人を設立した時点で、取締役は agency が用意し、本人はまだ EP を持っていないというケースはよくあります。',
          '操作手順：シンガポール法人を使って自分の EP を申請し、EP 取得後に自分が取締役になります。',
          '取締役は法的責任を負います。',
          '自分で手続きすることも、第三者 agent に委託することもできます。',
        ],
        pointsKo: [
          '싱가포르 법인을 설립했지만 이사는 agency가 제공하고, 창업자 본인은 아직 EP가 없는 경우는 흔합니다.',
          '운영 경로: 싱가포르 법인으로 본인의 EP를 신청한 뒤, EP를 받은 후 직접 이사가 됩니다.',
          '이사는 법적 책임을 집니다.',
          '직접 진행할 수도 있고, 제3자 agent에게 맡길 수도 있습니다.',
        ],
      },
    ],
    takeaway:
      '新加坡的政策，是为"已经跑起来、但不想在结构上翻车"的公司准备的。如果还在验证 PMF，政府不重要。但当风险从"能不能做成"变成"结构、合规、长期可持续性"时，这种对话就有价值了。',
    takeawayKo:
      '싱가포르의 정책은 이미 시작했지만 구조적 리스크를 피하고 싶은 기업을 위해 준비된 것입니다. 아직 PMF를 검증 중이라면 정부는 중요하지 않습니다. 하지만 위험이 「할 수 있을까」에서 「구조, 합규, 장기 지속 가능성」으로 변할 때, 이러한 대화는 가치가 있습니다.',
    takeawayJa:
      'シンガポールの政策は、「既に動き始めているが、構造的な失敗を避けたい」という企業のために用意されています。まだ PMF を検証している段階なら、政府は重要ではありません。しかし、リスクが「実現可能性」から「構造、コンプライアンス、長期的な持続可能性」へと変わるとき、このような対話には価値があります。',
    takeawayEn:
      'Singapore\'s policy stack is built for companies that already work — and don\'t want to crash on structural issues. If you\'re still validating PMF, the government doesn\'t matter much. But once your risk shifts from "can we make this work" to "structure, compliance, long-term sustainability", this kind of conversation starts to pay off.',
  },
];

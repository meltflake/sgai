export const talentDataDate = '2026-05-04';

export type TalentStatusTone = 'active' | 'scheduled' | 'closed' | 'evergreen';

export interface TalentStat {
  label: string;
  labelEn?: string;
  labelJa?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
}

export interface TalentDetailSection {
  title: string;
  titleEn: string;
  titleJa?: string;
  body: string;
  bodyEn: string;
  bodyJa?: string;
  bullets?: string[];
  bulletsEn?: string[];
  bulletsJa?: string[];
}

export interface TalentProfile {
  facts: TalentStat[];
  sections: TalentDetailSection[];
  sourceLabel: string;
  sourceLabelEn: string;
  sourceLabelJa?: string;
  sourceUrl: string;
  sourceNote: string;
  sourceNoteEn: string;
  sourceNoteJa?: string;
  lastChecked: string;
}

export interface TalentProgramme {
  id: string;
  name: string;
  nameEn: string;
  nameJa?: string;
  shortName?: string;
  icon: string;
  category: string;
  categoryEn: string;
  categoryJa?: string;
  owner: string;
  ownerEn: string;
  ownerJa?: string;
  description: string;
  descriptionEn: string;
  descriptionJa?: string;
  stats: TalentStat[];
  highlights: string[];
  highlightsEn: string[];
  highlightsJa?: string[];
  status: string;
  statusEn: string;
  statusJa?: string;
  statusTone: TalentStatusTone;
  url: string;
  profile: TalentProfile;
}

export const programmes: TalentProgramme[] = [
  {
    id: 'ai-apprenticeship-programme',
    name: 'AI 学徒计划',
    nameJa: 'AI 学徒計画',
    nameEn: 'AI Apprenticeship Programme (AIAP)',
    shortName: 'AIAP',
    icon: 'tabler:target-arrow',
    category: '职业转型',
    categoryJa: '職業転換',
    categoryEn: 'Career conversion',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description:
      '新加坡旗舰 AI 工程人才培养项目：6 或 9 个月全职训练，学员在真实产业项目中补齐工程、MLOps 与部署能力。',
    descriptionJa:
      'シンガポール AI エンジニア人材育成フラッグシップ項目：6 ヶ月または 9 ヶ月の全職研修。受講生は実際の産業プロジェクトの中でエンジニアリング、MLOps および導入能力を補強します。',
    descriptionEn:
      'Singapore flagship AI engineering apprenticeship: 6 or 9 months of full-time training, with apprentices building engineering, MLOps and deployment capability on real industry projects.',
    stats: [
      {
        label: '时长',
        labelJa: '期間',
        labelEn: 'Duration',
        value: '6 / 9 个月',
        valueJa: '6～9 ヶ月',
        valueEn: '6 / 9 months',
      },
      {
        label: '津贴',
        labelJa: '手当',
        labelEn: 'Stipend',
        value: 'SGD 4,000/月',
        valueJa: 'SGD 4,000/月',
        valueEn: 'SGD 4,000/month',
      },
      { label: '就业率', labelJa: '就職率', labelEn: 'Placement rate', value: '90%+', valueEn: '90%+' },
      {
        label: '地点',
        labelJa: '所在地',
        labelEn: 'Venue',
        value: 'NTU 校园',
        valueJa: 'NTU キャンパス',
        valueEn: 'NTU campus',
      },
    ],
    highlights: ['3 个月深度训练', '3 或 6 个月真实项目', '两阶段技术选拔', 'Batch 24/25 申请期开放'],
    highlightsEn: [
      '3-month deep-skilling phase',
      '3 or 6 months on real-world projects',
      'Two-stage technical selection',
      'Batch 24/25 application window open',
    ],
    status: 'Batch 24/25 招募中',
    statusJa: 'Batch 24/25 募集中',
    statusEn: 'Batch 24/25 recruiting',
    statusTone: 'active',
    url: 'https://aiap.sg/apprenticeship/',
    profile: {
      facts: [
        { label: '承办方', labelJa: '実施機関', labelEn: 'Owner', value: 'AI Singapore', valueEn: 'AI Singapore' },
        {
          label: '对象',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '新加坡公民；持 NITEC、Diploma 或 Degree；符合 TeSA CLT 资助条件',
          valueJa: 'シンガポール市民；NITEC、Diploma または Degree 取得者；TeSA CLT 資助条件を満たす者',
          valueEn: 'Singapore citizens with NITEC, Diploma or Degree, and eligible for TeSA CLT funding',
        },
        {
          label: '入门要求',
          labelJa: '入門要件',
          labelEn: 'Entry bar',
          value: 'Python、机器学习、MLOps / 部署、数据技术与文档能力',
          valueJa: 'Python、機械学習、MLOps / 導入、データ技術およびドキュメンテーション能力',
          valueEn: 'Python, machine learning, MLOps / deployment, data technologies and documentation',
        },
        {
          label: '当前窗口',
          labelJa: '現在の受付期間',
          labelEn: 'Current window',
          value: '2026-04-29 至 2026-06-01',
          valueJa: '2026-04-29 から 2026-06-01 まで',
          valueEn: '29 Apr 2026 to 1 Jun 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AIAP 是新加坡“自己长出 AI 工程师”的主通道。它不只是上课，而是把有基础的人放进真实 AI 项目里，让他们经历数据、模型、部署、治理和客户问题的完整闭环。',
          bodyJa:
            'AIAP はシンガポール「独自に AI エンジニアを育成する」の主要ルートです。それは単なる講義ではなく、基礎のある人を実際の AI プロジェクトに入れ、データ、モデル、導入、ガバナンスおよび顧客課題の完全なサイクルを経験させます。',
          bodyEn:
            'AIAP is Singapore main channel for growing local AI engineers. It is not just coursework: technically ready candidates are placed into real AI projects, covering data, models, deployment, governance and stakeholder problems end to end.',
        },
        {
          title: '项目怎样运行',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '路径分两段：先做 3 个月深度训练，覆盖经典机器学习、LLM、MLOps、计算机视觉和 AI 治理；再进入 3 或 6 个月项目期，和 AI Singapore 工程师、MLOps 工程师、项目经理及 PI 一起交付产业项目。',
          bodyJa:
            'パスは 2 段階に分かれます：まず 3 ヶ月の深い研修を行い、古典的機械学習、LLM、MLOps、コンピュータビジョンおよび AI ガバナンスをカバーします。その後、3 または 6 ヶ月のプロジェクト期に進み、AI Singapore エンジニア、MLOps エンジニア、プロジェクト マネージャーおよび PI と一緒に産業プロジェクトを納品します。',
          bodyEn:
            'The path has two phases: 3 months of deep-skilling across classical ML, LLMs, MLOps, computer vision and AI governance, followed by a 3- or 6-month project phase with AI Singapore engineers, MLOps engineers, project managers and principal investigators.',
          bullets: [
            '全职项目，需线下投入',
            '技术评估包含 6 天 take-home 与面试',
            '毕业后常见方向包括 AI Engineer、MLOps Engineer、Data Scientist',
          ],
          bulletsEn: [
            'Full-time commitment with in-person work',
            'Selection includes a 6-day take-home technical assessment and interview',
            'Common graduate roles include AI Engineer, MLOps Engineer and Data Scientist',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是新加坡人才体系里最像“产线”的项目：规模不算巨大，但信号很强。它把 AI Singapore 的企业项目、政府资助和本地人才培养绑在一起，形成雇主可理解的能力证明。',
          bodyJa:
            'これはシンガポール人材体系の中で最も「生産ラインのような」プロジェクトです：規模は非常に大きくはありませんが、シグナルは強いです。AI Singapore の企業プロジェクト、政府資助および現地人材育成を一緒に結びつけ、雇用者が理解できる能力証明を形成します。',
          bodyEn:
            'This is the closest thing to a production line in Singapore AI talent system. The absolute scale is limited, but the signal is strong: enterprise projects, public funding and local talent development are bundled into a credential employers can understand.',
        },
      ],
      sourceLabel: 'AIAP 官方页面',
      sourceLabelJa: 'AIAP 公式ページ',
      sourceLabelEn: 'Official AIAP page',
      sourceUrl: 'https://aiap.sg/apprenticeship/',
      sourceNote: '申请状态、批次日期和资格条件以官方页面为准。',
      sourceNoteJa: '申請状態、バッチ日付および適格条件については公式ページに従ってください。',
      sourceNoteEn: 'Application status, cohort dates and eligibility should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'llm-application-developer-programme',
    name: 'LLM 应用开发者计划',
    nameJa: 'LLM アプリケーション開発者計画',
    nameEn: 'LLM Application Developer Programme (LADP)',
    shortName: 'LADP',
    icon: 'tabler:device-laptop',
    category: '企业 GenAI 落地',
    categoryJa: '企業 GenAI デプロイメント',
    categoryEn: 'Enterprise GenAI adoption',
    owner: 'AI Singapore + SGTech',
    ownerEn: 'AI Singapore + SGTech',
    description: '面向企业团队的 16 周生成式 AI 项目制训练，目标是把公司内部问题做成可部署的 LLM 应用。',
    descriptionJa:
      '企業チーム向けの 16 週間の生成 AI プロジェクト型研修。目標は企業内部の課題を導入可能な LLM アプリケーションに変えることです。',
    descriptionEn:
      'A 16-week project-based GenAI programme for company teams, designed to turn workplace problem statements into deployable LLM applications.',
    stats: [
      { label: '时长', labelJa: '期間', labelEn: 'Duration', value: '16 周', valueJa: '16 週', valueEn: '16 weeks' },
      {
        label: '团队规模',
        labelJa: 'チーム規模',
        labelEn: 'Team size',
        value: '2-4 人',
        valueJa: '2～4 人',
        valueEn: '2-4 people',
      },
      {
        label: '导师咨询',
        labelJa: 'メンター相談',
        labelEn: 'Mentor consults',
        value: '最多 24 小时/队',
        valueJa: '最大 24 時間/チーム',
        valueEn: 'Up to 24 hours/team',
      },
      { label: '公民费用', labelJa: '公民費用', labelEn: 'Citizen fee', value: 'SGD 3,600', valueEn: 'SGD 3,600' },
    ],
    highlights: [
      '4 周自学 + 12 周项目',
      '企业自带问题陈述',
      'Prompt Engineering / RAG / Agent',
      'Intake 10 预计 Q2 2026 开放',
    ],
    highlightsEn: [
      '4 weeks self-learning + 12 weeks project',
      'Company-owned problem statement',
      'Prompt engineering, RAG and agents',
      'Intake 10 expected to open in Q2 2026',
    ],
    status: 'Intake 10：2026 Q2',
    statusEn: 'Intake 10: Q2 2026',
    statusTone: 'scheduled',
    url: 'https://aiap.sg/ladp/',
    profile: {
      facts: [
        {
          label: '参与方',
          labelJa: '参画者',
          labelEn: 'Participants',
          value: '新加坡注册公司或公共机构；每个项目 2-4 名员工',
          valueJa: 'シンガポール登録企業または公共機関；プロジェクトあたり 2～4 名の従業員',
          valueEn: 'Singapore-registered companies or public agencies; 2-4 staff per project',
        },
        {
          label: '前置条件',
          labelJa: '前提条件',
          labelEn: 'Prerequisite',
          value: '公司已有待部署的 LLM 应用问题陈述，并获直属主管背书',
          valueJa: '企業が導入対象となる LLM アプリケーションの問題陳述を既に有し、直属の上司の承認を得ていること',
          valueEn: 'A workplace LLM application problem statement with reporting-officer endorsement',
        },
        {
          label: '交付物',
          labelJa: '納品物',
          labelEn: 'Deliverable',
          value: '可部署的 LLM 应用',
          valueJa: '導入可能な LLM アプリケーション',
          valueEn: 'Deployable LLM-powered application',
        },
        {
          label: '补贴说明',
          labelJa: '補助説明',
          labelEn: 'Funding note',
          value: 'SkillsFuture 不适用；雇主可另看 CCP 支持',
          valueJa: 'SkillsFuture は適用されません；雇用者は別途 CCP サポートを検討できます',
          valueEn: 'SkillsFuture does not apply; employers may separately explore CCP support',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'LADP 针对的不是个人转行，而是企业内部的生成式 AI 采用。它要求公司带着真实业务问题进来，训练员工把 LLM、RAG、Agent 和治理原则合成一个能在工作场景部署的应用。',
          bodyJa:
            'LADP は個人の転職ではなく、企業内部の生成 AI 導入に対応しています。企業が実際のビジネス課題を持ち込むことを要求し、LLM、RAG、Agent および責任ある開発原則を仕事の場面で導入可能なアプリケーションに統合する従業員を訓練します。',
          bodyEn:
            'LADP is not an individual career-switching course. It targets enterprise GenAI adoption: companies bring real workplace problems, and staff learn to combine LLMs, RAG, agents and governance into deployable applications.',
        },
        {
          title: '项目怎样运行',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '前 4 周是异步学习，建立 LLM、Prompt Engineering、ReAct、RAG、Agent 和负责任开发的基础；后 12 周是项目期，团队用自己的问题陈述做应用，并通过 AISG 导师咨询推进。',
          bodyJa:
            '最初の 4 週間は非同期学習で、LLM、プロンプト エンジニアリング、ReAct、RAG、Agent および責任ある開発の基礎を確立します。後半の 12 週間はプロジェクト期で、チームは自分たちの問題陳述を使用してアプリケーションを開発し、AISG メンターのコンサルティングを通じて進めます。',
          bodyEn:
            'The first 4 weeks are asynchronous learning across LLMs, prompt engineering, ReAct, RAG, agents and responsible development. The next 12 weeks are the project phase, where teams build against their own problem statement with AISG mentor consultations.',
          bullets: [
            '每班最多 20 名学员',
            '项目咨询至少 6 次，每次最多 2 小时',
            '应用通常需要企业自己的云平台或内部批准平台',
          ],
          bulletsEn: [
            'Maximum 20 participants per class',
            'At least 6 project consultations, up to 2 hours each',
            'Projects usually require a company-approved cloud or internal platform',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是 AIAP 模型向企业内部迁移的版本。它的价值不在“教会 LLM 概念”，而在迫使公司把模糊的 AI 兴趣变成具体业务问题、团队配置和部署责任。',
          bodyJa:
            'これは AIAP モデルを企業内部に転用したバージョンです。その価値は「LLM の概念を教える」ことではなく、曖昧な AI への関心を具体的なビジネス課題、チーム構成および導入責任に変えることを企業に強制することにあります。',
          bodyEn:
            'This is the AIAP model moved inside companies. Its value is not merely teaching LLM concepts; it forces fuzzy AI interest into a concrete problem statement, team structure and deployment responsibility.',
        },
      ],
      sourceLabel: 'LADP 官方页面',
      sourceLabelJa: 'LADP 公式ページ',
      sourceLabelEn: 'Official LADP page',
      sourceUrl: 'https://aiap.sg/ladp/',
      sourceNote: 'Intake、费用和资助信息变化较快，以官方页面为准。',
      sourceNoteJa: 'Intake、料金および資助情報は変わりやすいため、公式ページに従ってください。',
      sourceNoteEn: 'Intake, fee and funding details change quickly; confirm on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'aisg-phd-fellowship',
    name: 'AI 博士奖学金',
    nameJa: 'AI 博士号奨学金',
    nameEn: 'AISG PhD Fellowship Programme',
    shortName: 'PhD Fellowship',
    icon: 'tabler:microscope',
    category: '基础研究人才',
    categoryJa: '基礎研究人材',
    categoryEn: 'Research talent',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '资助在新加坡自治大学攻读 AI 基础研究博士的人才，重点支持可信、隐私、资源高效、协作与持续学习等方向。',
    descriptionJa:
      'シンガポール自治大学の AI 基礎研究博士号取得を支援する人材の資助。信頼性、プライバシー、資源効率性、協調および継続学習などの方向を重点支援します。',
    descriptionEn:
      'Funding for PhD candidates pursuing fundamental AI research at Singapore autonomous universities, with focus areas including trustworthy, privacy-aware, resource-efficient, collaborative and continuous-learning AI.',
    stats: [
      {
        label: '最长资助',
        labelJa: '最大資助',
        labelEn: 'Maximum support',
        value: '4 年',
        valueJa: '4 年間',
        valueEn: '4 years',
      },
      {
        label: '月度津贴',
        labelJa: '月額給付',
        labelEn: 'Monthly stipend',
        value: '最高 SGD 6,700',
        valueJa: '最高 SGD 6,700',
        valueEn: 'Up to SGD 6,700',
      },
      {
        label: '会议津贴',
        labelJa: '会議手当',
        labelEn: 'Conference allowance',
        value: '最高 SGD 8,000',
        valueJa: '最高 SGD 8,000',
        valueEn: 'Up to SGD 8,000',
      },
      {
        label: '国籍限制',
        labelJa: '国籍制限',
        labelEn: 'Nationality restriction',
        value: '无',
        valueJa: 'なし',
        valueEn: 'None',
      },
    ],
    highlights: ['NUS / NTU / SMU / SUTD', '大学提名制', '全额学费支持', '要求顶会/顶刊级研究产出'],
    highlightsEn: [
      'NUS, NTU, SMU or SUTD',
      'University nomination model',
      'Full tuition fee support',
      'Expected top-tier AI research output',
    ],
    status: '2026 提名已截止',
    statusJa: '2026 推薦受付終了',
    statusEn: '2026 nomination closed',
    statusTone: 'closed',
    url: 'https://aisingapore.org/research/phd-fellowship-programme/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '大学范围',
          labelJa: '大学範囲',
          labelEn: 'Universities',
          value: 'NUS、NTU、SMU、SUTD',
          valueEn: 'NUS, NTU, SMU and SUTD',
        },
        {
          label: '申请方式',
          labelJa: '申請方法',
          labelEn: 'Application model',
          value: '由大学推荐给 AI Singapore',
          valueJa: '大学から AI Singapore への推薦',
          valueEn: 'Universities nominate suitable candidates to AI Singapore',
        },
        {
          label: '2026 截止',
          labelJa: '2026 締切',
          labelEn: '2026 deadline',
          value: '2026-04-15 17:00 SGT',
          valueEn: '15 Apr 2026, 5:00 PM SGT',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: '新加坡的 AI 战略不能只靠应用工程，也需要能在国际顶会和核心算法上留下名字的研究人才。博士奖学金把资助、大学提名和 AISG 研究主题连接起来，形成基础研究人才储备。',
          bodyJa:
            'シンガポールの AI 戦略は応用エンジニアリングだけに依存することはできず、国際的なトップカンファレンスおよびコアアルゴリズムで名前を刻む研究人材も必要です。博士号奨学金は資助、大学推薦および AISG 研究テーマを結びつけ、基礎研究人材の蓄積を形成します。',
          bodyEn:
            'Singapore AI strategy cannot rely only on applied engineering. It also needs researchers who can publish at top venues and contribute to core algorithms. The fellowship connects funding, university nominations and AISG research themes into a fundamental research pipeline.',
        },
        {
          title: '研究方向',
          titleJa: '研究方向',
          titleEn: 'Research Themes',
          body: '官方重点包括可信与可解释 AI、隐私感知 AI、资源高效 AI、协作 AI、持续学习 AI。这些方向都贴合新加坡的小国约束：数据敏感、算力有限、治理品牌强、需要跨语言跨机构协作。',
          bodyJa:
            '公式な重点には信頼性と解釈可能性のある AI、プライバシー対応 AI、資源効率的 AI、協調 AI、継続学習 AI が含まれます。これらの方向はすべてシンガポール小国の制約に適合しています：データは機密性が高く、計算力は限定され、ガバナンスのブランド力は強く、言語間および機構間の協調が必要です。',
          bodyEn:
            'Official themes include trustworthy and explainable AI, privacy-aware AI, resource-efficient AI, collaborative AI and continuous-learning AI. These fit Singapore constraints: sensitive data, limited compute, a strong trust brand and the need for cross-lingual, cross-institution collaboration.',
          bullets: ['鼓励所有国籍申请', '新加坡公民、永久居民和东盟申请者尤其受鼓励', '研究期间可参与 AISG 其他项目'],
          bulletsEn: [
            'Open to all nationalities',
            'Singapore citizens, permanent residents and ASEAN applicants are especially encouraged',
            'Fellows may participate in other AISG initiatives',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这张卡片不应只被看成奖学金。它是新加坡把大学研究、国家 AI 主题和人才留存绑在一起的制度工具。',
          bodyJa:
            'このカードは奨学金としてのみ見るべきではありません。これはシンガポール大学研究、国家 AI テーマおよび人材維持を一緒に結びつける制度的ツールです。',
          bodyEn:
            'This should not be read as just a scholarship. It is an institutional tool for tying university research, national AI themes and talent retention together.',
        },
      ],
      sourceLabel: 'AISG PhD Fellowship 官方页面',
      sourceLabelJa: 'AISG PhD Fellowship 公式ページ',
      sourceLabelEn: 'Official AISG PhD Fellowship page',
      sourceUrl: 'https://aisingapore.org/research/phd-fellowship-programme/',
      sourceNote: '下一轮 intake、提名窗口和大学要求以官方页面和各大学研究生院为准。',
      sourceNoteJa: '次回 Intake、推薦期間および大学要件については公式ページおよび各大学大学院事務室に従ってください。',
      sourceNoteEn:
        'Next intake, nomination windows and university-specific requirements should be confirmed on the official page and university graduate offices.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-accelerated-masters-programme',
    name: 'AI 硕士加速计划',
    nameJa: 'AI 修士課程加速計画',
    nameEn: 'AI Accelerated Masters Programme (AMP)',
    shortName: 'AMP',
    icon: 'tabler:bolt',
    category: '本硕研究通道',
    categoryJa: '学部・修士研究ルート',
    categoryEn: 'Undergrad-to-master research path',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '面向新加坡公民的 AI 研究型硕士快车道，在本科最后阶段提前资助，并支持毕业后一年内完成研究型硕士。',
    descriptionJa:
      'シンガポール市民向けの AI 研究型修士課程高速道路。学部最後の段階で事前資助を行い、卒業後 1 年以内に研究型修士課程の修了を支援します。',
    descriptionEn:
      'A fast-track AI research route for Singapore citizens, supporting students near the end of undergraduate study and through a one-year Masters by Research.',
    stats: [
      {
        label: '支持期',
        labelJa: '支援期間',
        labelEn: 'Support period',
        value: '最长 2 年',
        valueJa: '最長 2 年',
        valueEn: 'Up to 2 years',
      },
      {
        label: '本科津贴',
        labelJa: '学部給付金',
        labelEn: 'Undergrad allowance',
        value: 'SGD 2,000/月',
        valueJa: 'SGD 2,000/月',
        valueEn: 'SGD 2,000/month',
      },
      {
        label: '硕士津贴',
        labelJa: '修士給付金',
        labelEn: 'Masters stipend',
        value: '最高 SGD 3,500/月',
        valueJa: '最高 SGD 3,500/月',
        valueEn: 'Up to SGD 3,500/month',
      },
      {
        label: '对象',
        labelJa: '対象',
        labelEn: 'Audience',
        value: '新加坡公民',
        valueJa: 'シンガポール市民',
        valueEn: 'Singapore citizens',
      },
    ],
    highlights: ['本科倒数第二年申请', '研究型硕士', '大学提名制', '全额硕士学费支持'],
    highlightsEn: [
      'Apply in penultimate undergraduate year',
      'Masters by Research',
      'University nomination model',
      'Full Masters tuition fee support',
    ],
    status: '下一轮待公布',
    statusJa: '次回待機公表',
    statusEn: 'Next round TBA',
    statusTone: 'scheduled',
    url: 'https://aisingapore.org/research/ai-amp/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '对象',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '新加坡自治大学 AI 相关本科倒数第二年学生',
          valueJa: 'シンガポール自治大学 AI 関連学部後期学年 2 年目の学生',
          valueEn: 'Penultimate-year AI-related undergraduates at Singapore autonomous universities',
        },
        {
          label: '学历路径',
          labelJa: '学歴パス',
          labelEn: 'Degree path',
          value: '本科毕业后一年内完成研究型硕士',
          valueJa: '学部卒業後 1 年以内に研究型修士課程を修了',
          valueEn: 'Complete a Masters by Research within a year after undergraduate graduation',
        },
        {
          label: '最近更新',
          labelJa: '最新更新',
          labelEn: 'Latest official update',
          value: '2025-07-04',
          valueEn: '4 Jul 2025',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AMP 补的是“本科优秀研究苗子到博士之前”的断层。它把本科后期、研究型硕士和 AI Singapore 研究主题连成一条更短的学术路径，降低优秀学生被工业界或海外项目提前吸走的概率。',
          bodyJa:
            'AMP は「学部優秀研究苗木から博士号前」までの断絶を補完しています。学部後期、研究型修士課程および AI Singapore 研究テーマを一つのより短い学術パスに結びつけ、優秀な学生が産業界または海外プロジェクトに早期に吸収される確率を低減します。',
          bodyEn:
            'AMP addresses the gap between strong undergraduate research talent and later PhD-level research. It links late undergraduate study, a Masters by Research and AISG research themes into a shorter academic route, reducing the chance that strong students are pulled away too early by industry or overseas programmes.',
        },
        {
          title: '项目怎样运行',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '项目最多支持两年：本科阶段最多一年生活津贴，硕士阶段最多一年津贴与全额本地学费。申请由大学推荐，需要学生已有 AI 研究经历，如 UROP、研究实习或 AI 顶会主轨论文。',
          bodyJa:
            'プロジェクトは最大 2 年間サポートします：学部段階では最大 1 年の生活費補助、修士段階では最大 1 年の補助および全額の現地授業料。申請は大学推薦で、学生は既に AI 研究経歴を有する必要があります。UROP、研究インターンシップまたは AI トップカンファレンス主流論文などです。',
          bodyEn:
            'Support can last up to two years: up to one year of undergraduate allowance, then up to one year of Masters stipend and full local tuition. Universities nominate candidates, who need prior AI research experience such as UROP, research attachment or a main-track AI publication.',
          bullets: ['仅限新加坡公民', '要求有明确研究兴趣', '研究主题与 AISG PhD Fellowship 相近'],
          bulletsEn: [
            'Singapore citizens only',
            'Requires clear research interest',
            'Research themes are close to the AISG PhD Fellowship themes',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: 'AMP 是小国人才政策里很典型的一招：不是等博士阶段再抢人，而是在本科末期就把研究轨道铺好。',
          bodyJa:
            'AMP は小国人材政策として非常に典型的なアプローチです：博士号段階で人材を争奪するのを待つのではなく、学部末期に研究ルートを既に敷設します。',
          bodyEn:
            'AMP is a classic small-country talent move: do not wait until the PhD stage to compete for talent; build the research track before undergraduate graduation.',
        },
      ],
      sourceLabel: 'AI AMP 官方页面',
      sourceLabelJa: 'AI AMP 公式ページ',
      sourceLabelEn: 'Official AI AMP page',
      sourceUrl: 'https://aisingapore.org/research/ai-amp/',
      sourceNote: '下一轮开放时间以官方页面为准。',
      sourceNoteJa: '次回開放時間については公式ページに従ってください。',
      sourceNoteEn: 'Next-round timing should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'learnai-ai4i',
    name: 'LearnAI / AI4I',
    nameEn: 'LearnAI / AI for Industry',
    shortName: 'LearnAI',
    icon: 'tabler:book-2',
    category: '全民与职场学习',
    categoryJa: '全民および職場学習',
    categoryEn: 'Public and workforce learning',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description: 'AI Singapore 的在线学习入口，覆盖 AI 素养、AI4I、AI4K、教育者课程、行业项目和第三方学习资源。',
    descriptionJa:
      'AI Singapore のオンライン学習入口。AI リテラシー、AI4I、AI4K、教育者課程、産業プロジェクトおよび第三者学習リソースをカバーします。',
    descriptionEn:
      'AI Singapore online learning gateway, covering AI literacy, AI4I, AI4K, educator courses, industry projects and partner learning resources.',
    stats: [
      {
        label: '形式',
        labelJa: '形式',
        labelEn: 'Format',
        value: '在线自学',
        valueJa: 'オンライン自習',
        valueEn: 'Self-paced online',
      },
      {
        label: '层级',
        labelJa: 'レベル',
        labelEn: 'Levels',
        value: 'Exposure 至 Advanced',
        valueJa: 'Exposure から Advanced',
        valueEn: 'Exposure to Advanced',
      },
      {
        label: '课程数',
        labelJa: 'コース数',
        labelEn: 'Course count',
        value: '90+ 资源',
        valueJa: '90+ リソース',
        valueEn: '90+ resources',
      },
      {
        label: '对象',
        labelJa: '対象',
        labelEn: 'Audience',
        value: '学生 / 教师 / 职场人士',
        valueJa: '学生 / 教師 / 職場人材',
        valueEn: 'Students, educators and workers',
      },
    ],
    highlights: ['AI4I / AI4K 系列', 'OpenAI Academy 等伙伴资源', '教师与学生专区', '部分课程可走 SkillsFuture'],
    highlightsEn: [
      'AI4I and AI4K series',
      'Partner resources including OpenAI Academy',
      'Student and educator tracks',
      'Some courses may be SkillsFuture-claimable',
    ],
    status: '持续开放',
    statusJa: '継続開放',
    statusEn: 'Evergreen',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '课程类型',
          labelJa: '課程類型',
          labelEn: 'Course types',
          value: '理论、实操、行业项目、教师资源、儿童 AI',
          valueJa: '理論、実践、産業プロジェクト、教師リソース、児童 AI',
          valueEn: 'Theory, practical labs, industry projects, educator resources and AI for kids',
        },
        {
          label: '典型时长',
          labelJa: '典型的期間',
          labelEn: 'Typical duration',
          value: '0.5 小时至 140 小时不等',
          valueJa: '0.5 時間から 140 時間まで様々',
          valueEn: 'Ranges from 0.5 hour to 140 hours',
        },
        {
          label: '定位',
          labelJa: '位置づけ',
          labelEn: 'Role',
          value: '人才漏斗最宽的一层',
          valueJa: '人材漏斗の最も広い層',
          valueEn: 'The widest layer of the talent funnel',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'LearnAI 解决的是“全民和职场基础 AI 能力”的入口问题。它把学生、教师、专业人士和企业学习资源集中到一个平台上，让 AI 学习不是只发生在大学或少数工程训练营里。',
          bodyJa:
            'LearnAI が対応する問題は「全民および職場基礎 AI 能力」の入口問題です。学生、教師、専門家および企業学習リソースをプラットフォームに集約し、AI 学習が大学または少数のエンジニアリング研修キャンプでのみ発生するのではなくします。',
          bodyEn:
            'LearnAI solves the entry-point problem for broad AI literacy and workforce capability. It concentrates student, educator, professional and enterprise learning resources into one platform, so AI learning is not limited to universities or a few engineering bootcamps.',
        },
        {
          title: '内容怎样组织',
          titleJa: 'コンテンツはどのように整理されているか',
          titleEn: 'How The Content Is Organised',
          body: '课程覆盖从 Exposure、Basic 到 Advanced 的不同层级，也区分 Theory、Practical、Theory + Practical。它既有 AI4I 这样的职场课程，也有 AI4K、教师 AI 素养、行业项目案例和第三方平台课程。',
          bodyJa:
            '課程は Exposure、Basic から Advanced などの異なるレベルをカバーしており、Theory、Practical、Theory + Practical も区分します。AI4I のような職場課程もあり、AI4K、教師 AI リテラシー、産業プロジェクトケーススタディおよび第三者プラットフォーム課程もあります。',
          bodyEn:
            'Courses span Exposure, Basic and Advanced levels, and are marked as Theory, Practical or Theory + Practical. The catalogue includes workforce AI4I courses, AI4K, educator AI literacy, industry project cases and partner-platform courses.',
          bullets: ['适合作为 AIAP / LADP 前置学习池', '覆盖非工程人群', '也是学校和教师资源入口'],
          bulletsEn: [
            'Useful as a preparation pool for AIAP and LADP',
            'Covers non-engineering audiences',
            'Also serves as a school and educator resource gateway',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: 'LearnAI 的重要性在于广度。它不保证培养高级工程师，但能提高整个社会讨论和采用 AI 的基线。',
          bodyJa:
            'LearnAI の重要性は広さにあります。高級エンジニアの育成を保証しませんが、社会全体の AI 討論および導入のベースラインを向上させることができます。',
          bodyEn:
            'LearnAI matters because of breadth. It does not guarantee advanced AI engineers, but it raises the baseline for how society discusses and adopts AI.',
        },
      ],
      sourceLabel: 'LearnAI 官方课程目录',
      sourceLabelJa: 'LearnAI 公式課程ディレクトリ',
      sourceLabelEn: 'Official LearnAI catalogue',
      sourceUrl: 'https://learn.aisingapore.org/',
      sourceNote: '课程数量、费用和补贴资格会随目录更新而变化。',
      sourceNoteJa: '課程数、料金および補助資格はディレクトリ更新に伴い変わります。',
      sourceNoteEn: 'Course count, fees and subsidy eligibility change as the catalogue evolves.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'national-ai-student-challenge',
    name: '全国 AI 学生挑战赛',
    nameJa: '全国 AI 学生チャレンジ大会',
    nameEn: 'National AI Student Challenge (NAISC)',
    shortName: 'NAISC',
    icon: 'tabler:trophy',
    category: '学生实践竞赛',
    categoryJa: '学生実践競技',
    categoryEn: 'Student applied challenge',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description: '面向学生的全国性 AI 实战挑战赛，2026 年设置 8 个赛道，让学生围绕真实企业和社会问题做 AI 原型。',
    descriptionJa:
      '学生向けの全国 AI 実践チャレンジ大会。2026 年は 8 つのトラックを設定し、学生が実際の企業および社会的課題を中心に AI プロトタイプを行います。',
    descriptionEn:
      'A national applied AI challenge for students. The 2026 edition has 8 tracks where students build AI prototypes around real enterprise and societal problem statements.',
    stats: [
      {
        label: '2026 赛道',
        labelJa: '2026 トラック',
        labelEn: '2026 tracks',
        value: '8 个',
        valueJa: '8 個',
        valueEn: '8',
      },
      {
        label: '报名期',
        labelJa: '登録期間',
        labelEn: 'Registration',
        value: '1 月 5 日-2 月 16 日',
        valueJa: '1 月 5 日～2 月 16 日',
        valueEn: '5 Jan-16 Feb',
      },
      {
        label: '总决赛',
        labelJa: 'ファイナル',
        labelEn: 'Grand Final',
        value: '5 月 22-23 日',
        valueJa: '5 月 22～23 日',
        valueEn: '22-23 May',
      },
      {
        label: '团队',
        labelJa: 'チーム',
        labelEn: 'Team size',
        value: '按赛道不同',
        valueJa: 'トラック別に異なります',
        valueEn: 'Varies by track',
      },
    ],
    highlights: ['真实问题陈述', '企业与机构赛道主', '导师和工作坊', '优胜队伍可获奖项或实习机会'],
    highlightsEn: [
      'Real problem statements',
      'Enterprise and institutional track owners',
      'Mentorship and workshops',
      'Winners may receive prizes or internship opportunities',
    ],
    status: '2026 决赛阶段',
    statusJa: '2026 決勝段階',
    statusEn: '2026 finalist phase',
    statusTone: 'scheduled',
    url: 'https://naisc.aisingapore.org/',
    profile: {
      facts: [
        { label: '承办方', labelJa: '実施機関', labelEn: 'Owner', value: 'AI Singapore', valueEn: 'AI Singapore' },
        {
          label: '赛道类型',
          labelJa: 'トラック類型',
          labelEn: 'Track types',
          value: '7 个本地赛道 + 1 个区域 AI Ready ASEAN 赛道',
          valueJa: '7 つの現地トラック + 1 つの地域 AI Ready ASEAN トラック',
          valueEn: '7 local tracks + 1 regional AI Ready ASEAN track',
        },
        {
          label: '对象',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '中学、JC、ITE、理工学院、大学和 NS 全职服役人员等，按赛道不同',
          valueJa: '中学、JC、ITE、理工学院、大学および NS フルタイム勤務者など、トラックにより異なります',
          valueEn: 'Secondary, JC, ITE, polytechnic, university and full-time NSF students, depending on track',
        },
        {
          label: '2026 总决赛',
          labelJa: '2026 全国決勝',
          labelEn: '2026 Grand Final',
          value: 'AI Student Developer Conference，2026-05-22 至 2026-05-23',
          valueJa: 'AI Student Developer Conference、2026-05-22 から 2026-05-23',
          valueEn: 'AI Student Developer Conference, 22-23 May 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'NAISC 让学生更早接触真实 AI 问题，而不是停留在课堂练习。2026 年赛道覆盖安全、预测维护、学生支持、失智照护、日志解析、数据漂移、业务自动化和区域 AI Ready ASEAN。',
          bodyJa:
            'NAISC は学生が実際の AI 問題により早期にアクセスできるようにし、課題練習に留まりません。2026 年のトラックはセキュリティ、予測保全、学生支援、認知症ケア、ログ解析、データドリフト、ビジネスオートメーションおよび地域 AI Ready ASEAN をカバーします。',
          bodyEn:
            'NAISC gives students early exposure to real AI problems beyond classroom exercises. The 2026 tracks cover security, predictive maintenance, student support, dementia care, log parsing, data drift, business automation and regional AI Ready ASEAN.',
        },
        {
          title: '项目怎样运行',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '学生先报名具体赛道，入选后参加 partner briefing 和 problem statement 讲解，再在 4-5 月提交作品并进入决赛。交付物通常包括方案说明、视频 demo、GitHub 仓库或现场演示，具体由赛道定义。',
          bodyJa:
            '学生は最初に具体的なトラックに登録し、選抜後にパートナー ブリーフィングおよび問題陳述説明に参加し、4～5 月に作品を提出して決勝に進みます。納品物は通常、ソリューション説明、ビデオ デモ、GitHub リポジトリまたはライブプレゼンテーションを含みますが、具体的にはトラックで定義されます。',
          bodyEn:
            'Students register for specific tracks, attend partner briefings and problem-statement walkthroughs, then submit in April-May and proceed to finals. Deliverables often include solution slides, video demos, GitHub repositories or live demos, depending on the track.',
          bullets: ['赛道名额有限，先到先得', '报名条件按赛道不同', '部分赛道提供实习机会或现金奖项'],
          bulletsEn: [
            'Track capacity is limited and first-come-first-served',
            'Eligibility varies by track',
            'Some tracks offer internship opportunities or cash prizes',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是新加坡学生人才漏斗的“项目感”入口。它让企业和社会问题进入学生训练，也让学生作品更像未来申请、实习和创业的证据。',
          bodyJa:
            'これはシンガポール学生人材漏斗の「プロジェクト感覚」入口です。企業および社会的課題を学生訓練に進め、学生作品を将来の申請、インターンシップおよび起業の証拠にします。',
          bodyEn:
            'This is the project-based entry point of Singapore student talent funnel. It brings enterprise and social problems into student training, and makes student work more useful as evidence for future applications, internships and startups.',
        },
      ],
      sourceLabel: 'NAISC 官方页面',
      sourceLabelJa: 'NAISC 公式ページ',
      sourceLabelEn: 'Official NAISC page',
      sourceUrl: 'https://naisc.aisingapore.org/',
      sourceNote: '各赛道资格、交付物和日期以官方页面为准。',
      sourceNoteJa: '各トラック適格性、納品物および日付については公式ページに従ってください。',
      sourceNoteEn: 'Track eligibility, deliverables and dates should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'international-olympiad-in-ai-2027',
    name: 'IOAI 2027 新加坡',
    nameJa: 'IOAI 2027 シンガポール',
    nameEn: 'International Olympiad in AI 2027 Singapore',
    shortName: 'IOAI 2027',
    icon: 'tabler:world',
    category: '国际青年赛事',
    categoryJa: '国際青年大会',
    categoryEn: 'International youth competition',
    owner: 'AI Singapore + NTU',
    ownerEn: 'AI Singapore + NTU',
    description: '2027 年第四届 International Olympiad in AI 将在新加坡举行，由 AI Singapore 和南洋理工大学共同主办。',
    descriptionJa:
      '2027 年第 4 回 International Olympiad in AI はシンガポールで開催され、AI Singapore および南洋理工大学が共同主催します。',
    descriptionEn:
      'The 4th International Olympiad in AI will be held in Singapore in 2027, co-hosted by AI Singapore and Nanyang Technological University.',
    stats: [
      {
        label: '届数',
        labelJa: '回数',
        labelEn: 'Edition',
        value: '第 4 届',
        valueJa: '第 4 回',
        valueEn: '4th edition',
      },
      { label: '年份', labelJa: '年', labelEn: 'Year', value: '2027', valueEn: '2027' },
      {
        label: '主办地',
        labelJa: '開催地',
        labelEn: 'Host city',
        value: '新加坡',
        valueJa: 'シンガポール',
        valueEn: 'Singapore',
      },
      { label: '共同主办', labelJa: '共同主催', labelEn: 'Co-hosts', value: 'AISG + NTU', valueEn: 'AISG + NTU' },
    ],
    highlights: ['全球高中生 AI 竞赛', '新加坡首次主办', 'NOAI 作为本地选拔通道', '展示新加坡 AI 教育品牌'],
    highlightsEn: [
      'Global AI competition for high-school students',
      'Singapore first time hosting',
      'NOAI serves as local selection path',
      'Showcases Singapore AI education brand',
    ],
    status: '2027 主办',
    statusJa: '2027 主催',
    statusEn: 'Hosting in 2027',
    statusTone: 'scheduled',
    url: 'https://ioai-official.org/singapore-2027/',
    profile: {
      facts: [
        {
          label: '共同主办',
          labelJa: '共同主催',
          labelEn: 'Co-hosts',
          value: 'AI Singapore、Nanyang Technological University',
          valueEn: 'AI Singapore and Nanyang Technological University',
        },
        {
          label: '赛事定位',
          labelJa: '大会位置づけ',
          labelEn: 'Competition role',
          value: '面向高中生的国际科学奥林匹克赛事',
          valueJa: '高校生向けの国際科学オリンピック大会',
          valueEn: 'International Science Olympiad-style competition for high-school students',
        },
        {
          label: '本地通道',
          labelJa: '現地ルート',
          labelEn: 'Local pathway',
          value: 'National Olympiad in AI (NOAI)',
          valueEn: 'National Olympiad in AI (NOAI)',
        },
        {
          label: '新加坡队路径',
          labelJa: 'シンガポール代表チームパス',
          labelEn: 'Singapore team path',
          value: 'NOAI Final 后约 50-60 人进入 NTU 训练，最终选 8 人代表新加坡',
          valueJa: 'NOAI Final の後、約 50～60 人が NTU 研修に進み、最終的に 8 人がシンガポール代表として選ばれます',
          valueEn: 'After the NOAI Final, around 50-60 students enter NTU training; the final 8 represent Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'IOAI 2027 是新加坡 AI 教育的一次国际展示。它不仅是赛事承办，也把 NOAI、NTU 训练和全球 AI 青少年网络串起来，形成从校内兴趣到国际舞台的路径。',
          bodyJa:
            'IOAI 2027 はシンガポール AI 教育の国際展示です。大会開催だけではなく、NOAI、NTU 研修および全球 AI 青少年ネットワークを結びつけ、校内興味から国際舞台までのルートを形成します。',
          bodyEn:
            'IOAI 2027 is an international showcase for Singapore AI education. It is not only event hosting; it links NOAI, NTU training and the global youth AI network into a path from school interest to international competition.',
        },
        {
          title: '本地选拔链路',
          titleJa: '現地選抜チェーン',
          titleEn: 'Local Selection Chain',
          body: '新加坡通过 NOAI 做本地选拔。NOAI 2026 包含学校意向窗口、预赛、决赛、NTU 训练、boot camp 和最终代表队遴选。',
          bodyJa:
            'シンガポールは NOAI を通じて現地選抜を行います。NOAI 2026 は学校意向期間、予選、決勝、NTU 研修、ブートキャンプおよび最終代表チーム選抜を含みます。',
          bodyEn:
            'Singapore uses NOAI as the local selection path. NOAI 2026 includes school interest registration, preliminaries, finals, NTU training, boot camp and final team selection.',
          bullets: [
            '预赛用于筛选进入决赛的前 150 名',
            '决赛后约 50-60 名学生进入进一步训练',
            '最终 8 名学生代表新加坡参加 IOAI',
          ],
          bulletsEn: [
            'The preliminary round filters toward the top 150 finalists',
            'Around 50-60 students continue into further training after the final',
            'The final 8 students represent Singapore at IOAI',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '主办 IOAI 的意义不只是“办一场比赛”。它给新加坡一个公开叙事：这里不只是部署 AI 的地方，也是训练下一代 AI 人才的地方。',
          bodyJa:
            'IOAI 主催の意義は「競技を開く」だけではありません。シンガポールに公開の言説を与えます：ここは AI を導入するだけの場所ではなく、次世代 AI 人材を訓練する場所でもあります。',
          bodyEn:
            'Hosting IOAI is not just about running a contest. It gives Singapore a public narrative: this is not only a place that deploys AI, but a place that trains the next generation of AI talent.',
        },
      ],
      sourceLabel: 'IOAI 2027 官方页面',
      sourceLabelJa: 'IOAI 2027 公式ページ',
      sourceLabelEn: 'Official IOAI 2027 page',
      sourceUrl: 'https://ioai-official.org/singapore-2027/',
      sourceNote: '赛事日期、代表队选拔和报名安排以 IOAI / AISG 官方页面为准。',
      sourceNoteJa:
        '大会日付、代表チーム選抜および登録アレンジメントについては IOAI / AISG 公式ページに従ってください。',
      sourceNoteEn:
        'Competition dates, team selection and registration details should be confirmed on IOAI / AISG official pages.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-singapore-goes-to-school',
    name: 'AI 进校园',
    nameJa: 'AI 校園進出',
    nameEn: 'AI Singapore Goes to School / TWA+',
    shortName: 'AI Goes to School',
    icon: 'tabler:school',
    category: '中小学与教师',
    categoryJa: '中小学および教師',
    categoryEn: 'Schools and educators',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description:
      '面向中小学和教师的 AI 启蒙与教学能力建设组合，包括 2 小时学生入门课、AI4K、AI for Students 和 TWA+ 教师培训。',
    descriptionJa:
      '中小学および教師向けの AI 啓蒙および教学能力構築組み合わせ。2 時間の学生入門課、AI4K、AI for Students および TWA+ 教師研修を含みます。',
    descriptionEn:
      'A school and educator enablement bundle, including a 2-hour student introduction, AI4K, AI for Students and the TWA+ teacher work-attachment programme.',
    stats: [
      {
        label: '学生入门',
        labelJa: '学生入門',
        labelEn: 'Student intro',
        value: '2 小时',
        valueJa: '2 時間',
        valueEn: '2 hours',
      },
      { label: '儿童 AI', labelJa: '児童 AI', labelEn: 'AI for kids', value: 'P3-P6', valueEn: 'P3-P6' },
      { label: '教师培训', labelJa: '教師研修', labelEn: 'Teacher training', value: 'TWA+', valueEn: 'TWA+' },
      {
        label: '渠道',
        labelJa: 'チャネル',
        labelEn: 'Channel',
        value: '学校 / 教师',
        valueJa: '学校 / 教師',
        valueEn: 'Schools / educators',
      },
    ],
    highlights: ['AI Singapore Goes To School', 'AI4K 儿童课程', '教师 AI 素养提升', '公校 AI 教学资源'],
    highlightsEn: [
      'AI Singapore Goes To School',
      'AI4K courses for kids',
      'Teacher AI literacy',
      'AI classroom resources for public schools',
    ],
    status: '持续推进',
    statusJa: '継続推進',
    statusEn: 'Ongoing',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/home-2-2/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '学生课',
          labelJa: '学生課',
          labelEn: 'Student session',
          value: 'AI Singapore Goes To School：2 小时 AI 基础和 ChatGPT 应用介绍',
          valueJa: 'AI Singapore Goes To School：2 時間の AI 基礎および ChatGPT アプリケーション導入紹介',
          valueEn: 'AI Singapore Goes To School: 2-hour introduction to AI basics and ChatGPT applications',
        },
        {
          label: '儿童课程',
          labelJa: '児童課程',
          labelEn: 'Kids track',
          value: 'AI For Kids 面向 Primary 3-6',
          valueJa: 'AI For Kids は Primary 3～6 を対象としています',
          valueEn: 'AI For Kids for Primary 3-6 students',
        },
        {
          label: '教师项目',
          labelJa: '教師プロジェクト',
          labelEn: 'Educator track',
          value: 'TWA+ Programme @ AI Singapore',
          valueEn: 'TWA+ Programme @ AI Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AI 人才培养如果只从大学开始就太晚了。AI 进校园把 AI 基础认知、教师培训和校内资源放到更早阶段，让学生和教师先形成共同语言。',
          bodyJa:
            'AI 人材育成が大学からのみ始まっていてはすでに遅すぎます。AI 校園進出は AI 基礎認知、教師研修および校内リソースをより早い段階に配置し、学生および教師が先に共通言語を形成するようにします。',
          bodyEn:
            'If AI talent development starts only at university, it is too late. AI Singapore Goes to School moves baseline AI literacy, teacher training and classroom resources earlier, giving students and educators a shared language.',
        },
        {
          title: '内容怎样组合',
          titleJa: 'コンテンツはどのように組み合わせられているか',
          titleEn: 'How The Bundle Fits Together',
          body: '学生侧有 2 小时入门课、AI4K、AI for Students 和学生自学资源；教师侧有 TWA+ 和教育者 AI 素养课程。它不是单一课程，而是一个低龄化 AI 学习入口。',
          bodyJa:
            '学生側は 2 時間入門課、AI4K、AI for Students および学生自学リソースを有しています。教師側は TWA+ および教育者 AI リテラシー課程を有しています。それは単一課程ではなく、低年齢 AI 学習入口です。',
          bodyEn:
            'On the student side, the bundle includes a 2-hour introduction, AI4K, AI for Students and self-learning resources. On the educator side, it includes TWA+ and educator AI-literacy courses. It is not a single course, but an early-stage AI learning entry point.',
          bullets: ['适合学校批量触达', '教师培训决定课堂扩散能力', '与 NAISC / NOAI 形成学生漏斗'],
          bulletsEn: [
            'Suitable for school-level reach',
            'Teacher training determines classroom diffusion',
            'Forms a student funnel with NAISC and NOAI',
          ],
        },
        {
          title: '观察',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是最容易被低估的一层。高端人才来自少数人，但社会 AI 采用来自大量普通学生和教师的早期熟悉。',
          bodyJa:
            'これは最も過小評価されやすい層です。高級人材は少数人から来ていますが、社会 AI 導入は大多数の普通学生および教師の早期熟悉から来ています。',
          bodyEn:
            'This layer is easy to underestimate. Elite talent comes from a small group, but societal AI adoption comes from early familiarity among many ordinary students and teachers.',
        },
      ],
      sourceLabel: 'AI Singapore / LearnAI 官方页面',
      sourceLabelJa: 'AI Singapore / LearnAI 公式ページ',
      sourceLabelEn: 'Official AI Singapore / LearnAI pages',
      sourceUrl: 'https://learn.aisingapore.org/home-2-2/',
      sourceNote: '学校项目、教师项目和课程目录会持续更新。',
      sourceNoteJa: '学校プロジェクト、教師プロジェクトおよび課程ディレクトリは継続更新されます。',
      sourceNoteEn: 'School programmes, educator programmes and course catalogues continue to evolve.',
      lastChecked: talentDataDate,
    },
  },
];

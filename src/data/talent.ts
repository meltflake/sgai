export const talentDataDate = '2026-05-04';

export type TalentStatusTone = 'active' | 'scheduled' | 'closed' | 'evergreen';

export interface TalentStat {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  valueKo?: string;
}

export interface TalentDetailSection {
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  body: string;
  bodyEn: string;
  bodyJa?: string;
  bodyKo?: string;
  bullets?: string[];
  bulletsEn?: string[];
  bulletsJa?: string[];
  bulletsKo?: string[];
}

export interface TalentProfile {
  facts: TalentStat[];
  sections: TalentDetailSection[];
  sourceLabel: string;
  sourceLabelEn: string;
  sourceLabelJa?: string;
  sourceLabelKo?: string;
  sourceUrl: string;
  sourceNote: string;
  sourceNoteEn: string;
  sourceNoteJa?: string;
  sourceNoteKo?: string;
  lastChecked: string;
}

export interface TalentProgramme {
  id: string;
  name: string;
  nameEn: string;
  nameJa?: string;
  nameKo?: string;
  shortName?: string;
  icon: string;
  category: string;
  categoryEn: string;
  categoryJa?: string;
  categoryKo?: string;
  owner: string;
  ownerEn: string;
  ownerJa?: string;
  ownerKo?: string;
  description: string;
  descriptionEn: string;
  descriptionJa?: string;
  descriptionKo?: string;
  stats: TalentStat[];
  highlights: string[];
  highlightsEn: string[];
  highlightsJa?: string[];
  highlightsKo?: string[];
  status: string;
  statusEn: string;
  statusJa?: string;
  statusKo?: string;
  statusTone: TalentStatusTone;
  url: string;
  profile: TalentProfile;
  /** YYYY-MM-DD; the date this programme was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates" entry.
   *  Set automatically by emit pipelines; manual additions must set it too.
   *  Old records may be undefined → not surfaced. */
  addedAt?: string;
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
}

export const programmes: TalentProgramme[] = [
  {
    id: 'ai-apprenticeship-programme',
    addedAt: '2026-05-04',
    name: 'AI 学徒计划',
    nameKo: 'AI 견습 프로그램',
    nameJa: 'AI 学徒計画',
    nameEn: 'AI Apprenticeship Programme (AIAP)',
    shortName: 'AIAP',
    icon: 'tabler:target-arrow',
    category: '职业转型',
    categoryKo: '직업 전환',
    categoryJa: '職業転換',
    categoryEn: 'Career conversion',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description:
      '新加坡旗舰 AI 工程人才培养项目：6 或 9 个月全职训练，学员在真实产业项目中补齐工程、MLOps 与部署能力。',
    descriptionKo:
      '싱가포르 플래그쉽 AI 공학 인재 양성 프로젝트: 6 또는 9개월 풀타임 훈련으로 참여자들이 실제 산업 프로젝트에서 공학, MLOps 및 배포 역량을 보완합니다.',
    descriptionJa:
      'シンガポール AI エンジニア人材育成フラッグシップ項目：6 ヶ月または 9 ヶ月の全職研修。受講生は実際の産業プロジェクトの中でエンジニアリング、MLOps および導入能力を補強します。',
    descriptionEn:
      'Singapore flagship AI engineering apprenticeship: 6 or 9 months of full-time training, with apprentices building engineering, MLOps and deployment capability on real industry projects.',
    stats: [
      {
        label: '时长',
        labelKo: '기간',
        labelJa: '期間',
        labelEn: 'Duration',
        value: '6 / 9 个月',
        valueKo: '6 / 9개월',
        valueJa: '6～9 ヶ月',
        valueEn: '6 / 9 months',
      },
      {
        label: '津贴',
        labelKo: '수당',
        labelJa: '手当',
        labelEn: 'Stipend',
        value: 'SGD 4,000/月',
        valueKo: 'SGD 4,000/월',
        valueJa: 'SGD 4,000/月',
        valueEn: 'SGD 4,000/month',
      },
      {
        label: '就业率',
        labelKo: '취업률',
        labelJa: '就職率',
        labelEn: 'Placement rate',
        value: '90%+',
        valueEn: '90%+',
      },
      {
        label: '地点',
        labelKo: '위치',
        labelJa: '所在地',
        labelEn: 'Venue',
        value: 'NTU 校园',
        valueKo: 'NTU 캠퍼스',
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
    highlightsJa: [
      '3 ヶ月の深度トレーニング',
      '3 または 6 ヶ月の実プロジェクト',
      '2 段階の技術選考',
      'Batch 24/25 申請受付中',
    ],
    highlightsKo: [
      '3개월 심화 훈련',
      '3개월 또는 6개월 실제 프로젝트',
      '2단계 기술 선발',
      'Batch 24/25 신청 기간 오픈',
    ],
    status: 'Batch 24/25 招募中',
    statusKo: 'Batch 24/25 모집 중',
    statusJa: 'Batch 24/25 募集中',
    statusEn: 'Batch 24/25 recruiting',
    statusTone: 'active',
    url: 'https://aiap.sg/apprenticeship/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '주관 기관',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore',
          valueEn: 'AI Singapore',
        },
        {
          label: '对象',
          labelKo: '대상',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '新加坡公民；持 NITEC、Diploma 或 Degree；符合 TeSA CLT 资助条件',
          valueKo: '싱가포르 시민; NITEC, Diploma 또는 Degree 소유; TeSA CLT 자금 지원 자격 충족',
          valueJa: 'シンガポール市民；NITEC、Diploma または Degree 取得者；TeSA CLT 資助条件を満たす者',
          valueEn: 'Singapore citizens with NITEC, Diploma or Degree, and eligible for TeSA CLT funding',
        },
        {
          label: '入门要求',
          labelKo: '진입 요건',
          labelJa: '入門要件',
          labelEn: 'Entry bar',
          value: 'Python、机器学习、MLOps / 部署、数据技术与文档能力',
          valueKo: 'Python, 머신러닝, MLOps / 배포, 데이터 기술 및 문서화 역량',
          valueJa: 'Python、機械学習、MLOps / 導入、データ技術およびドキュメンテーション能力',
          valueEn: 'Python, machine learning, MLOps / deployment, data technologies and documentation',
        },
        {
          label: '当前窗口',
          labelKo: '현재 신청 기간',
          labelJa: '現在の受付期間',
          labelEn: 'Current window',
          value: '2026-04-29 至 2026-06-01',
          valueKo: '2026-04-29 ~ 2026-06-01',
          valueJa: '2026-04-29 から 2026-06-01 まで',
          valueEn: '29 Apr 2026 to 1 Jun 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '무엇을 해결하는가',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AIAP 是新加坡“自己长出 AI 工程师”的主通道。它不只是上课，而是把有基础的人放进真实 AI 项目里，让他们经历数据、模型、部署、治理和客户问题的完整闭环。',
          bodyKo:
            'AIAP는 싱가포르가 「자신의 AI 엔지니어를 키워내는」주요 경로입니다. 이는 단순한 수업이 아니라 기초가 있는 사람들을 실제 AI 프로젝트에 투입하여 데이터, 모델, 배포, 거버넌스 및 고객 문제의 완전한 사이클을 경험하게 합니다.',
          bodyJa:
            'AIAP はシンガポール「独自に AI エンジニアを育成する」の主要ルートです。それは単なる講義ではなく、基礎のある人を実際の AI プロジェクトに入れ、データ、モデル、導入、ガバナンスおよび顧客課題の完全なサイクルを経験させます。',
          bodyEn:
            'AIAP is Singapore main channel for growing local AI engineers. It is not just coursework: technically ready candidates are placed into real AI projects, covering data, models, deployment, governance and stakeholder problems end to end.',
        },
        {
          title: '项目怎样运行',
          titleKo: '프로젝트는 어떻게 운영되는가',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '路径分两段：先做 3 个月深度训练，覆盖经典机器学习、LLM、MLOps、计算机视觉和 AI 治理；再进入 3 或 6 个月项目期，和 AI Singapore 工程师、MLOps 工程师、项目经理及 PI 一起交付产业项目。',
          bodyKo:
            '경로는 두 단계로 나뉩니다: 먼저 3개월 심화 훈련으로 클래식 머신러닝, LLM, MLOps, 컴퓨터 비전 및 AI 거버넌스를 다루며; 그 다음 3 또는 6개월 프로젝트 기간에 진입하여 AI Singapore 엔지니어, MLOps 엔지니어, 프로젝트 매니저 및 PI와 함께 산업 프로젝트를 완수합니다.',
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
          bulletsJa: [
            '全職プログラムで、対面での参加が必要',
            '技術評価には 6 日間の take-home と面接が含まれる',
            '卒業後の一般的な職種は AI Engineer、MLOps Engineer、Data Scientist',
          ],
          bulletsKo: [
            '풀타임 프로그램으로 오프라인 참여가 필요',
            '기술 평가는 6일 take-home 과제와 면접을 포함',
            '수료 후 일반적인 진로는 AI Engineer, MLOps Engineer, Data Scientist',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是新加坡人才体系里最像“产线”的项目：规模不算巨大，但信号很强。它把 AI Singapore 的企业项目、政府资助和本地人才培养绑在一起，形成雇主可理解的能力证明。',
          bodyKo:
            '이것은 싱가포르 인재 체계에서 가장 「생산 라인」을 닮은 프로젝트입니다: 규모는 크지 않지만 신호는 매우 강합니다. 이것은 AI Singapore의 기업 프로젝트, 정부 자금 및 현지 인재 양성을 함께 묶어 고용주가 이해할 수 있는 역량 증명을 형성합니다.',
          bodyJa:
            'これはシンガポール人材体系の中で最も「生産ラインのような」プロジェクトです：規模は非常に大きくはありませんが、シグナルは強いです。AI Singapore の企業プロジェクト、政府資助および現地人材育成を一緒に結びつけ、雇用者が理解できる能力証明を形成します。',
          bodyEn:
            'This is the closest thing to a production line in Singapore AI talent system. The absolute scale is limited, but the signal is strong: enterprise projects, public funding and local talent development are bundled into a credential employers can understand.',
        },
      ],
      sourceLabel: 'AIAP 官方页面',
      sourceLabelKo: 'AIAP 공식 페이지',
      sourceLabelJa: 'AIAP 公式ページ',
      sourceLabelEn: 'Official AIAP page',
      sourceUrl: 'https://aiap.sg/apprenticeship/',
      sourceNote: '申请状态、批次日期和资格条件以官方页面为准。',
      sourceNoteKo: '지원 상태, 배치 날짜 및 자격 조건은 공식 페이지를 기준으로 합니다.',
      sourceNoteJa: '申請状態、バッチ日付および適格条件については公式ページに従ってください。',
      sourceNoteEn: 'Application status, cohort dates and eligibility should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'llm-application-developer-programme',
    addedAt: '2026-05-04',
    name: 'LLM 应用开发者计划',
    nameKo: 'LLM 애플리케이션 개발자 프로그램',
    nameJa: 'LLM アプリケーション開発者計画',
    nameEn: 'LLM Application Developer Programme (LADP)',
    shortName: 'LADP',
    icon: 'tabler:device-laptop',
    category: '企业 GenAI 落地',
    categoryKo: '기업 GenAI 구현',
    categoryJa: '企業 GenAI デプロイメント',
    categoryEn: 'Enterprise GenAI adoption',
    owner: 'AI Singapore + SGTech',
    ownerEn: 'AI Singapore + SGTech',
    description: '面向企业团队的 16 周生成式 AI 项目制训练，目标是把公司内部问题做成可部署的 LLM 应用。',
    descriptionKo:
      '기업 팀을 대상으로 한 16주 생성 AI 프로젝트 기반 훈련으로, 회사 내부 문제를 배포 가능한 LLM 애플리케이션으로 전환하는 것이 목표입니다.',
    descriptionJa:
      '企業チーム向けの 16 週間の生成 AI プロジェクト型研修。目標は企業内部の課題を導入可能な LLM アプリケーションに変えることです。',
    descriptionEn:
      'A 16-week project-based GenAI programme for company teams, designed to turn workplace problem statements into deployable LLM applications.',
    stats: [
      {
        label: '时长',
        labelKo: '기간',
        labelJa: '期間',
        labelEn: 'Duration',
        value: '16 周',
        valueKo: '16주',
        valueJa: '16 週',
        valueEn: '16 weeks',
      },
      {
        label: '团队规模',
        labelKo: '팀 규모',
        labelJa: 'チーム規模',
        labelEn: 'Team size',
        value: '2-4 人',
        valueKo: '2-4명',
        valueJa: '2～4 人',
        valueEn: '2-4 people',
      },
      {
        label: '导师咨询',
        labelKo: '멘토 자문',
        labelJa: 'メンター相談',
        labelEn: 'Mentor consults',
        value: '最多 24 小时/队',
        valueKo: '팀당 최대 24시간',
        valueJa: '最大 24 時間/チーム',
        valueEn: 'Up to 24 hours/team',
      },
      {
        label: '公民费用',
        labelKo: '공개 비용',
        labelJa: '公民費用',
        labelEn: 'Citizen fee',
        value: 'SGD 3,600',
        valueEn: 'SGD 3,600',
      },
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
    highlightsJa: [
      '4 週間の自習 + 12 週間のプロジェクト',
      '企業が自社の problem statement を持ち込む',
      'Prompt Engineering / RAG / Agent',
      'Intake 10 は 2026 年 Q2 開始予定',
    ],
    highlightsKo: [
      '4주 자율 학습 + 12주 프로젝트',
      '기업이 자체 문제 진술을 가져옴',
      'Prompt Engineering / RAG / Agent',
      'Intake 10은 2026년 Q2 오픈 예정',
    ],
    status: 'Intake 10：2026 Q2',
    statusEn: 'Intake 10: Q2 2026',
    statusTone: 'scheduled',
    url: 'https://aiap.sg/ladp/',
    profile: {
      facts: [
        {
          label: '参与方',
          labelKo: '참여 대상',
          labelJa: '参画者',
          labelEn: 'Participants',
          value: '新加坡注册公司或公共机构；每个项目 2-4 名员工',
          valueKo: '싱가포르 등록 회사 또는 공공 기관; 각 프로젝트마다 2-4명의 직원',
          valueJa: 'シンガポール登録企業または公共機関；プロジェクトあたり 2～4 名の従業員',
          valueEn: 'Singapore-registered companies or public agencies; 2-4 staff per project',
        },
        {
          label: '前置条件',
          labelKo: '전제 조건',
          labelJa: '前提条件',
          labelEn: 'Prerequisite',
          value: '公司已有待部署的 LLM 应用问题陈述，并获直属主管背书',
          valueKo:
            '배포 예정인 LLM 응용 프로그램의 문제 진술을 이미 보유하고 있으며, 직속 상관으로부터 지지를 받은 상태',
          valueJa: '企業が導入対象となる LLM アプリケーションの問題陳述を既に有し、直属の上司の承認を得ていること',
          valueEn: 'A workplace LLM application problem statement with reporting-officer endorsement',
        },
        {
          label: '交付物',
          labelKo: '결과물',
          labelJa: '納品物',
          labelEn: 'Deliverable',
          value: '可部署的 LLM 应用',
          valueKo: '배포 가능한 LLM 응용 프로그램',
          valueJa: '導入可能な LLM アプリケーション',
          valueEn: 'Deployable LLM-powered application',
        },
        {
          label: '补贴说明',
          labelKo: '보조금 설명',
          labelJa: '補助説明',
          labelEn: 'Funding note',
          value: 'SkillsFuture 不适用；雇主可另看 CCP 支持',
          valueKo: 'SkillsFuture는 적용되지 않습니다; 고용주는 CCP 지원을 추가로 고려할 수 있습니다',
          valueJa: 'SkillsFuture は適用されません；雇用者は別途 CCP サポートを検討できます',
          valueEn: 'SkillsFuture does not apply; employers may separately explore CCP support',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '해결하는 문제',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'LADP 针对的不是个人转行，而是企业内部的生成式 AI 采用。它要求公司带着真实业务问题进来，训练员工把 LLM、RAG、Agent 和治理原则合成一个能在工作场景部署的应用。',
          bodyKo:
            'LADP는 개인의 경력 전환을 목표로 하지 않으며, 기업 내부의 생성형 AI 도입을 목표로 합니다. 이는 기업이 실제 업무 문제를 가지고 참여하도록 요구하며, 직원들을 훈련하여 LLM, RAG, Agent 및 거버넌스 원칙을 통합하여 업무 현장에서 배포할 수 있는 응용 프로그램을 만들도록 합니다.',
          bodyJa:
            'LADP は個人の転職ではなく、企業内部の生成 AI 導入に対応しています。企業が実際のビジネス課題を持ち込むことを要求し、LLM、RAG、Agent および責任ある開発原則を仕事の場面で導入可能なアプリケーションに統合する従業員を訓練します。',
          bodyEn:
            'LADP is not an individual career-switching course. It targets enterprise GenAI adoption: companies bring real workplace problems, and staff learn to combine LLMs, RAG, agents and governance into deployable applications.',
        },
        {
          title: '项目怎样运行',
          titleKo: '프로젝트 운영 방식',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '前 4 周是异步学习，建立 LLM、Prompt Engineering、ReAct、RAG、Agent 和负责任开发的基础；后 12 周是项目期，团队用自己的问题陈述做应用，并通过 AISG 导师咨询推进。',
          bodyKo:
            '처음 4주는 비동기 학습으로, LLM, Prompt Engineering, ReAct, RAG, Agent 및 책임감 있는 개발의 기초를 구축합니다. 이후 12주는 프로젝트 기간으로, 팀이 자신의 문제 진술을 활용하여 응용 프로그램을 개발하고, AISG 멘토 자문을 통해 진행합니다.',
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
          bulletsJa: [
            '1 クラス最大 20 名',
            'プロジェクト相談は最低 6 回、各回最大 2 時間',
            'アプリは通常、企業が承認したクラウドまたは内部プラットフォームを必要とします',
          ],
          bulletsKo: [
            '반별 최대 20명',
            '프로젝트 상담은 최소 6회, 회당 최대 2시간',
            '애플리케이션은 보통 기업 승인 클라우드 또는 내부 플랫폼이 필요',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是 AIAP 模型向企业内部迁移的版本。它的价值不在“教会 LLM 概念”，而在迫使公司把模糊的 AI 兴趣变成具体业务问题、团队配置和部署责任。',
          bodyKo:
            '이것은 AIAP 모델이 기업 내부로 이전된 버전입니다. 이 프로그램의 가치는 「LLM 개념을 가르치는 것」에 있지 않으며, 기업이 모호한 AI 관심을 구체적인 업무 문제, 팀 구성 및 배포 책임으로 변환하도록 강제하는 데 있습니다.',
          bodyJa:
            'これは AIAP モデルを企業内部に転用したバージョンです。その価値は「LLM の概念を教える」ことではなく、曖昧な AI への関心を具体的なビジネス課題、チーム構成および導入責任に変えることを企業に強制することにあります。',
          bodyEn:
            'This is the AIAP model moved inside companies. Its value is not merely teaching LLM concepts; it forces fuzzy AI interest into a concrete problem statement, team structure and deployment responsibility.',
        },
      ],
      sourceLabel: 'LADP 官方页面',
      sourceLabelKo: 'LADP 공식 페이지',
      sourceLabelJa: 'LADP 公式ページ',
      sourceLabelEn: 'Official LADP page',
      sourceUrl: 'https://aiap.sg/ladp/',
      sourceNote: 'Intake、费用和资助信息变化较快，以官方页面为准。',
      sourceNoteKo: '모집 단계, 비용 및 지원금 정보가 자주 변경되므로 공식 페이지를 참고하시기 바랍니다.',
      sourceNoteJa: 'Intake、料金および資助情報は変わりやすいため、公式ページに従ってください。',
      sourceNoteEn: 'Intake, fee and funding details change quickly; confirm on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'aisg-phd-fellowship',
    addedAt: '2026-05-04',
    name: 'AI 博士奖学金',
    nameKo: 'AI 박사 장학금',
    nameJa: 'AI 博士号奨学金',
    nameEn: 'AISG PhD Fellowship Programme',
    shortName: 'PhD Fellowship',
    icon: 'tabler:microscope',
    category: '基础研究人才',
    categoryKo: '기초 연구 인재',
    categoryJa: '基礎研究人材',
    categoryEn: 'Research talent',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '资助在新加坡自治大学攻读 AI 基础研究博士的人才，重点支持可信、隐私、资源高效、协作与持续学习等方向。',
    descriptionKo:
      '싱가포르 자율 대학에서 AI 기초 연구 박사 학위를 취득하는 인재를 지원하며, 신뢰성, 개인정보 보호, 자원 효율성, 협업 및 지속적 학습 등의 분야를 중점적으로 지원합니다.',
    descriptionJa:
      'シンガポール自治大学の AI 基礎研究博士号取得を支援する人材の資助。信頼性、プライバシー、資源効率性、協調および継続学習などの方向を重点支援します。',
    descriptionEn:
      'Funding for PhD candidates pursuing fundamental AI research at Singapore autonomous universities, with focus areas including trustworthy, privacy-aware, resource-efficient, collaborative and continuous-learning AI.',
    stats: [
      {
        label: '最长资助',
        labelKo: '최장 지원 기간',
        labelJa: '最大資助',
        labelEn: 'Maximum support',
        value: '4 年',
        valueKo: '4년',
        valueJa: '4 年間',
        valueEn: '4 years',
      },
      {
        label: '月度津贴',
        labelKo: '월 수당',
        labelJa: '月額給付',
        labelEn: 'Monthly stipend',
        value: '最高 SGD 6,700',
        valueKo: '최대 SGD 6,700',
        valueJa: '最高 SGD 6,700',
        valueEn: 'Up to SGD 6,700',
      },
      {
        label: '会议津贴',
        labelKo: '학술 활동 수당',
        labelJa: '会議手当',
        labelEn: 'Conference allowance',
        value: '最高 SGD 8,000',
        valueKo: '최대 SGD 8,000',
        valueJa: '最高 SGD 8,000',
        valueEn: 'Up to SGD 8,000',
      },
      {
        label: '国籍限制',
        labelKo: '국적 제한',
        labelJa: '国籍制限',
        labelEn: 'Nationality restriction',
        value: '无',
        valueKo: '무',
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
    highlightsJa: [
      'NUS / NTU / SMU / SUTD',
      '大学推薦制',
      '学費全額サポート',
      'トップ会議・トップジャーナル級の研究成果を期待',
    ],
    highlightsKo: ['NUS / NTU / SMU / SUTD', '대학 추천제', '학비 전액 지원', '최상위 학회/저널급 연구 성과 요구'],
    status: '2026 提名已截止',
    statusKo: '2026년 추천 마감',
    statusJa: '2026 推薦受付終了',
    statusEn: '2026 nomination closed',
    statusTone: 'closed',
    url: 'https://aisingapore.org/research/phd-fellowship-programme/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '주관',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '大学范围',
          labelKo: '대학 범위',
          labelJa: '大学範囲',
          labelEn: 'Universities',
          value: 'NUS、NTU、SMU、SUTD',
          valueEn: 'NUS, NTU, SMU and SUTD',
        },
        {
          label: '申请方式',
          labelKo: '신청 방식',
          labelJa: '申請方法',
          labelEn: 'Application model',
          value: '由大学推荐给 AI Singapore',
          valueKo: '대학에서 AI Singapore로 추천',
          valueJa: '大学から AI Singapore への推薦',
          valueEn: 'Universities nominate suitable candidates to AI Singapore',
        },
        {
          label: '2026 截止',
          labelKo: '2026 마감',
          labelJa: '2026 締切',
          labelEn: '2026 deadline',
          value: '2026-04-15 17:00 SGT',
          valueEn: '15 Apr 2026, 5:00 PM SGT',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '해결하는 문제',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: '新加坡的 AI 战略不能只靠应用工程，也需要能在国际顶会和核心算法上留下名字的研究人才。博士奖学金把资助、大学提名和 AISG 研究主题连接起来，形成基础研究人才储备。',
          bodyKo:
            '싱가포르의 AI 전략은 응용 공학만으로는 부족하며, 국제 주요 컨퍼런스와 핵심 알고리즘 분야에서 이름을 남길 수 있는 연구 인재가 필요합니다. 박사 장학금은 자금 지원, 대학 추천, AISG 연구 주제를 연결하여 기초 연구 인재 풀을 형성합니다.',
          bodyJa:
            'シンガポールの AI 戦略は応用エンジニアリングだけに依存することはできず、国際的なトップカンファレンスおよびコアアルゴリズムで名前を刻む研究人材も必要です。博士号奨学金は資助、大学推薦および AISG 研究テーマを結びつけ、基礎研究人材の蓄積を形成します。',
          bodyEn:
            'Singapore AI strategy cannot rely only on applied engineering. It also needs researchers who can publish at top venues and contribute to core algorithms. The fellowship connects funding, university nominations and AISG research themes into a fundamental research pipeline.',
        },
        {
          title: '研究方向',
          titleKo: '연구 분야',
          titleJa: '研究方向',
          titleEn: 'Research Themes',
          body: '官方重点包括可信与可解释 AI、隐私感知 AI、资源高效 AI、协作 AI、持续学习 AI。这些方向都贴合新加坡的小国约束：数据敏感、算力有限、治理品牌强、需要跨语言跨机构协作。',
          bodyKo:
            '공식 중점 분야는 신뢰할 수 있고 해석 가능한 AI, 프라이버시 인식 AI, 리소스 효율적 AI, 협업 AI, 지속적 학습 AI를 포함합니다. 이러한 분야들은 모두 싱가포르의 소국 제약에 부합합니다: 데이터 민감성, 제한된 연산 능력, 강한 거버넌스 브랜드, 다중 언어 및 다중 기관 협업 필요성.',
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
          bulletsJa: [
            '全ての国籍の応募を歓迎',
            'シンガポール市民、永住者、ASEAN 応募者は特に歓迎',
            '研究期間中に AISG の他プロジェクトへ参加可能',
          ],
          bulletsKo: [
            '모든 국적의 지원을 장려',
            '싱가포르 시민, 영주권자, ASEAN 지원자는 특히 장려',
            '연구 기간 중 AISG의 다른 프로젝트에 참여 가능',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这张卡片不应只被看成奖学金。它是新加坡把大学研究、国家 AI 主题和人才留存绑在一起的制度工具。',
          bodyKo:
            '이것은 장학금으로만 봐서는 안 됩니다. 싱가포르가 대학 연구, 국가 AI 주제, 인재 유지를 함께 묶는 제도적 도구입니다.',
          bodyJa:
            'このカードは奨学金としてのみ見るべきではありません。これはシンガポール大学研究、国家 AI テーマおよび人材維持を一緒に結びつける制度的ツールです。',
          bodyEn:
            'This should not be read as just a scholarship. It is an institutional tool for tying university research, national AI themes and talent retention together.',
        },
      ],
      sourceLabel: 'AISG PhD Fellowship 官方页面',
      sourceLabelKo: 'AISG PhD Fellowship 공식 페이지',
      sourceLabelJa: 'AISG PhD Fellowship 公式ページ',
      sourceLabelEn: 'Official AISG PhD Fellowship page',
      sourceUrl: 'https://aisingapore.org/research/phd-fellowship-programme/',
      sourceNote: '下一轮 intake、提名窗口和大学要求以官方页面和各大学研究生院为准。',
      sourceNoteKo: '다음 인테이크, 추천 기간 및 대학 요건은 공식 페이지 및 각 대학 대학원을 참고하시기 바랍니다.',
      sourceNoteJa: '次回 Intake、推薦期間および大学要件については公式ページおよび各大学大学院事務室に従ってください。',
      sourceNoteEn:
        'Next intake, nomination windows and university-specific requirements should be confirmed on the official page and university graduate offices.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-accelerated-masters-programme',
    addedAt: '2026-05-04',
    name: 'AI 硕士加速计划',
    nameKo: 'AI 석사 가속 프로그램',
    nameJa: 'AI 修士課程加速計画',
    nameEn: 'AI Accelerated Masters Programme (AMP)',
    shortName: 'AMP',
    icon: 'tabler:bolt',
    category: '本硕研究通道',
    categoryKo: '학부-석사 연구 통로',
    categoryJa: '学部・修士研究ルート',
    categoryEn: 'Undergrad-to-master research path',
    owner: 'AI Singapore Research',
    ownerEn: 'AI Singapore Research',
    description: '面向新加坡公民的 AI 研究型硕士快车道，在本科最后阶段提前资助，并支持毕业后一年内完成研究型硕士。',
    descriptionKo:
      '싱가포르 시민을 대상으로 하는 AI 연구형 석사 특급 통로로, 학부 최종 단계에서 미리 자금을 지원하며 졸업 후 1년 이내에 연구형 석사 완료를 지원합니다.',
    descriptionJa:
      'シンガポール市民向けの AI 研究型修士課程高速道路。学部最後の段階で事前資助を行い、卒業後 1 年以内に研究型修士課程の修了を支援します。',
    descriptionEn:
      'A fast-track AI research route for Singapore citizens, supporting students near the end of undergraduate study and through a one-year Masters by Research.',
    stats: [
      {
        label: '支持期',
        labelKo: '지원 기간',
        labelJa: '支援期間',
        labelEn: 'Support period',
        value: '最长 2 年',
        valueKo: '최대 2년',
        valueJa: '最長 2 年',
        valueEn: 'Up to 2 years',
      },
      {
        label: '本科津贴',
        labelKo: '학부 장학금',
        labelJa: '学部給付金',
        labelEn: 'Undergrad allowance',
        value: 'SGD 2,000/月',
        valueKo: 'SGD 2,000/월',
        valueJa: 'SGD 2,000/月',
        valueEn: 'SGD 2,000/month',
      },
      {
        label: '硕士津贴',
        labelKo: '석사 장학금',
        labelJa: '修士給付金',
        labelEn: 'Masters stipend',
        value: '最高 SGD 3,500/月',
        valueKo: '최대 SGD 3,500/월',
        valueJa: '最高 SGD 3,500/月',
        valueEn: 'Up to SGD 3,500/month',
      },
      {
        label: '对象',
        labelKo: '대상',
        labelJa: '対象',
        labelEn: 'Audience',
        value: '新加坡公民',
        valueKo: '싱가포르 시민',
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
    highlightsJa: ['学部最終学年前年に申請', '研究型修士', '大学推薦制', '修士学費全額サポート'],
    highlightsKo: ['학부 졸업 전전년도 신청', '연구형 석사', '대학 추천제', '석사 학비 전액 지원'],
    status: '下一轮待公布',
    statusKo: '다음 라운드 공개 예정',
    statusJa: '次回待機公表',
    statusEn: 'Next round TBA',
    statusTone: 'scheduled',
    url: 'https://aisingapore.org/research/ai-amp/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '주관',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Research Programme',
          valueEn: 'AI Singapore Research Programme',
        },
        {
          label: '对象',
          labelKo: '대상',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '新加坡自治大学 AI 相关本科倒数第二年学生',
          valueKo: '싱가포르 자치대학 AI 관련 학부 후반부 학생',
          valueJa: 'シンガポール自治大学 AI 関連学部後期学年 2 年目の学生',
          valueEn: 'Penultimate-year AI-related undergraduates at Singapore autonomous universities',
        },
        {
          label: '学历路径',
          labelKo: '학위 경로',
          labelJa: '学歴パス',
          labelEn: 'Degree path',
          value: '本科毕业后一年内完成研究型硕士',
          valueKo: '학부 졸업 후 1년 내 연구형 석사 학위 취득',
          valueJa: '学部卒業後 1 年以内に研究型修士課程を修了',
          valueEn: 'Complete a Masters by Research within a year after undergraduate graduation',
        },
        {
          label: '最近更新',
          labelKo: '최근 업데이트',
          labelJa: '最新更新',
          labelEn: 'Latest official update',
          value: '2025-07-04',
          valueEn: '4 Jul 2025',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '문제 해결',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AMP 补的是“本科优秀研究苗子到博士之前”的断层。它把本科后期、研究型硕士和 AI Singapore 研究主题连成一条更短的学术路径，降低优秀学生被工业界或海外项目提前吸走的概率。',
          bodyKo:
            'AMP는 「학부 우수 연구 인재에서 박사 전 단계」의 격차를 보충합니다. 이는 학부 후기, 연구형 석사, AI Singapore 연구 주제를 더 짧은 학문 경로로 연결하여 우수 학생이 산업 또는 해외 프로젝트에 조기에 흡수될 확률을 낮춥니다.',
          bodyJa:
            'AMP は「学部優秀研究苗木から博士号前」までの断絶を補完しています。学部後期、研究型修士課程および AI Singapore 研究テーマを一つのより短い学術パスに結びつけ、優秀な学生が産業界または海外プロジェクトに早期に吸収される確率を低減します。',
          bodyEn:
            'AMP addresses the gap between strong undergraduate research talent and later PhD-level research. It links late undergraduate study, a Masters by Research and AISG research themes into a shorter academic route, reducing the chance that strong students are pulled away too early by industry or overseas programmes.',
        },
        {
          title: '项目怎样运行',
          titleKo: '운영 방식',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '项目最多支持两年：本科阶段最多一年生活津贴，硕士阶段最多一年津贴与全额本地学费。申请由大学推荐，需要学生已有 AI 研究经历，如 UROP、研究实习或 AI 顶会主轨论文。',
          bodyKo:
            '프로젝트는 최대 2년을 지원합니다: 학부 단계에서는 최대 1년의 생활비 지원금, 석사 단계에서는 최대 1년의 지원금과 전액 현지 학비. 신청은 대학 추천을 통해 이루어지며, 학생이 이미 AI 연구 경험을 보유해야 합니다(예: UROP, 연구 인턴십 또는 AI 주요 학술대회 메인 트랙 논문).',
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
          bulletsJa: ['シンガポール市民のみ対象', '明確な研究関心が必要', '研究テーマは AISG PhD Fellowship に近い'],
          bulletsKo: ['싱가포르 시민만 대상', '명확한 연구 관심 필요', '연구 주제는 AISG PhD Fellowship과 유사'],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: 'AMP 是小国人才政策里很典型的一招：不是等博士阶段再抢人，而是在本科末期就把研究轨道铺好。',
          bodyKo:
            'AMP는 소국 인재 정책의 전형적인 전략입니다. 박사 단계에서 인재를 확보하는 것이 아니라, 학부 후기에 이미 연구 경로를 마련합니다.',
          bodyJa:
            'AMP は小国人材政策として非常に典型的なアプローチです：博士号段階で人材を争奪するのを待つのではなく、学部末期に研究ルートを既に敷設します。',
          bodyEn:
            'AMP is a classic small-country talent move: do not wait until the PhD stage to compete for talent; build the research track before undergraduate graduation.',
        },
      ],
      sourceLabel: 'AI AMP 官方页面',
      sourceLabelKo: 'AI AMP 공식 페이지',
      sourceLabelJa: 'AI AMP 公式ページ',
      sourceLabelEn: 'Official AI AMP page',
      sourceUrl: 'https://aisingapore.org/research/ai-amp/',
      sourceNote: '下一轮开放时间以官方页面为准。',
      sourceNoteKo: '다음 라운드 개방 시간은 공식 페이지를 참고해주시기 바랍니다.',
      sourceNoteJa: '次回開放時間については公式ページに従ってください。',
      sourceNoteEn: 'Next-round timing should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'learnai-ai4i',
    addedAt: '2026-05-04',
    name: 'LearnAI / AI4I',
    nameEn: 'LearnAI / AI for Industry',
    shortName: 'LearnAI',
    icon: 'tabler:book-2',
    category: '全民与职场学习',
    categoryKo: '전국민 및 직장 교육',
    categoryJa: '全民および職場学習',
    categoryEn: 'Public and workforce learning',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description: 'AI Singapore 的在线学习入口，覆盖 AI 素养、AI4I、AI4K、教育者课程、行业项目和第三方学习资源。',
    descriptionKo:
      'AI Singapore의 온라인 학습 진입점으로, AI 소양, AI4I, AI4K, 교육자 과정, 산업 프로젝트 및 제3자 학습 자원을 다룹니다.',
    descriptionJa:
      'AI Singapore のオンライン学習入口。AI リテラシー、AI4I、AI4K、教育者課程、産業プロジェクトおよび第三者学習リソースをカバーします。',
    descriptionEn:
      'AI Singapore online learning gateway, covering AI literacy, AI4I, AI4K, educator courses, industry projects and partner learning resources.',
    stats: [
      {
        label: '形式',
        labelKo: '형식',
        labelJa: '形式',
        labelEn: 'Format',
        value: '在线自学',
        valueKo: '온라인 자습',
        valueJa: 'オンライン自習',
        valueEn: 'Self-paced online',
      },
      {
        label: '层级',
        labelKo: '계층',
        labelJa: 'レベル',
        labelEn: 'Levels',
        value: 'Exposure 至 Advanced',
        valueKo: 'Exposure부터 Advanced까지',
        valueJa: 'Exposure から Advanced',
        valueEn: 'Exposure to Advanced',
      },
      {
        label: '课程数',
        labelKo: '과정 수',
        labelJa: 'コース数',
        labelEn: 'Course count',
        value: '90+ 资源',
        valueKo: '90개 이상 리소스',
        valueJa: '90+ リソース',
        valueEn: '90+ resources',
      },
      {
        label: '对象',
        labelKo: '대상',
        labelJa: '対象',
        labelEn: 'Audience',
        value: '学生 / 教师 / 职场人士',
        valueKo: '학생 / 교사 / 직장인',
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
    highlightsJa: [
      'AI4I / AI4K シリーズ',
      'OpenAI Academy などのパートナーリソース',
      '教師・学生向けエリア',
      '一部コースは SkillsFuture 利用可',
    ],
    highlightsKo: [
      'AI4I / AI4K 시리즈',
      'OpenAI Academy 등 파트너 리소스',
      '교사 및 학생 전용 영역',
      '일부 과정은 SkillsFuture 활용 가능',
    ],
    status: '持续开放',
    statusKo: '지속적 개방',
    statusJa: '継続開放',
    statusEn: 'Evergreen',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '운영 주체',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '课程类型',
          labelKo: '과정 유형',
          labelJa: '課程類型',
          labelEn: 'Course types',
          value: '理论、实操、行业项目、教师资源、儿童 AI',
          valueKo: '이론, 실습, 산업 프로젝트, 교사 자료, 아동 AI',
          valueJa: '理論、実践、産業プロジェクト、教師リソース、児童 AI',
          valueEn: 'Theory, practical labs, industry projects, educator resources and AI for kids',
        },
        {
          label: '典型时长',
          labelKo: '표준 소요 시간',
          labelJa: '典型的期間',
          labelEn: 'Typical duration',
          value: '0.5 小时至 140 小时不等',
          valueKo: '0.5시간부터 140시간까지',
          valueJa: '0.5 時間から 140 時間まで様々',
          valueEn: 'Ranges from 0.5 hour to 140 hours',
        },
        {
          label: '定位',
          labelKo: '정의',
          labelJa: '位置づけ',
          labelEn: 'Role',
          value: '人才漏斗最宽的一层',
          valueKo: '인재 펀넬에서 가장 넓은 계층',
          valueJa: '人材漏斗の最も広い層',
          valueEn: 'The widest layer of the talent funnel',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '문제 해결',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'LearnAI 解决的是“全民和职场基础 AI 能力”的入口问题。它把学生、教师、专业人士和企业学习资源集中到一个平台上，让 AI 学习不是只发生在大学或少数工程训练营里。',
          bodyKo:
            'LearnAI가 해결하는 것은 「전국민 및 직장 기초 AI 능력」의 진입점 문제입니다. 학생, 교사, 전문가 및 기업 학습 자원을 하나의 플랫폼에 집중하여 AI 학습이 대학이나 소수의 엔지니어링 교육 캠프에서만 발생하지 않도록 합니다.',
          bodyJa:
            'LearnAI が対応する問題は「全民および職場基礎 AI 能力」の入口問題です。学生、教師、専門家および企業学習リソースをプラットフォームに集約し、AI 学習が大学または少数のエンジニアリング研修キャンプでのみ発生するのではなくします。',
          bodyEn:
            'LearnAI solves the entry-point problem for broad AI literacy and workforce capability. It concentrates student, educator, professional and enterprise learning resources into one platform, so AI learning is not limited to universities or a few engineering bootcamps.',
        },
        {
          title: '内容怎样组织',
          titleKo: '콘텐츠는 어떻게 조직되는가',
          titleJa: 'コンテンツはどのように整理されているか',
          titleEn: 'How The Content Is Organised',
          body: '课程覆盖从 Exposure、Basic 到 Advanced 的不同层级，也区分 Theory、Practical、Theory + Practical。它既有 AI4I 这样的职场课程，也有 AI4K、教师 AI 素养、行业项目案例和第三方平台课程。',
          bodyKo:
            '과정은 Exposure, Basic에서 Advanced까지의 다양한 계층을 다루며, Theory, Practical, Theory + Practical를 구분합니다. AI4I 같은 직장 과정도 있고, AI4K, 교사 AI 소양, 산업 프로젝트 사례 및 제3자 플랫폼 과정도 포함됩니다.',
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
          bulletsJa: [
            'AIAP / LADP の事前学習プールとして有用',
            '非エンジニア層もカバー',
            '学校と教師向けリソースの入口にもなる',
          ],
          bulletsKo: [
            'AIAP / LADP 사전 학습 풀로 적합',
            '비엔지니어 대상도 포괄',
            '학교와 교사 리소스의 입구이기도 함',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: 'LearnAI 的重要性在于广度。它不保证培养高级工程师，但能提高整个社会讨论和采用 AI 的基线。',
          bodyKo:
            'LearnAI의 중요성은 폭넓음에 있습니다. 고급 엔지니어 양성을 보장하지는 않지만, 전체 사회의 AI 논의 및 도입 기준을 높일 수 있습니다.',
          bodyJa:
            'LearnAI の重要性は広さにあります。高級エンジニアの育成を保証しませんが、社会全体の AI 討論および導入のベースラインを向上させることができます。',
          bodyEn:
            'LearnAI matters because of breadth. It does not guarantee advanced AI engineers, but it raises the baseline for how society discusses and adopts AI.',
        },
      ],
      sourceLabel: 'LearnAI 官方课程目录',
      sourceLabelKo: 'LearnAI 공식 과정 목록',
      sourceLabelJa: 'LearnAI 公式課程ディレクトリ',
      sourceLabelEn: 'Official LearnAI catalogue',
      sourceUrl: 'https://learn.aisingapore.org/',
      sourceNote: '课程数量、费用和补贴资格会随目录更新而变化。',
      sourceNoteKo: '과정 수, 비용 및 지원금 자격은 목록 업데이트에 따라 변합니다.',
      sourceNoteJa: '課程数、料金および補助資格はディレクトリ更新に伴い変わります。',
      sourceNoteEn: 'Course count, fees and subsidy eligibility change as the catalogue evolves.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'national-ai-student-challenge',
    addedAt: '2026-05-04',
    name: '全国 AI 学生挑战赛',
    nameKo: '전국 AI 학생 챌린지',
    nameJa: '全国 AI 学生チャレンジ大会',
    nameEn: 'National AI Student Challenge (NAISC)',
    shortName: 'NAISC',
    icon: 'tabler:trophy',
    category: '学生实践竞赛',
    categoryKo: '학생 실전 대회',
    categoryJa: '学生実践競技',
    categoryEn: 'Student applied challenge',
    owner: 'AI Singapore',
    ownerEn: 'AI Singapore',
    description: '面向学生的全国性 AI 实战挑战赛，2026 年设置 8 个赛道，让学生围绕真实企业和社会问题做 AI 原型。',
    descriptionKo:
      '학생을 대상으로 하는 전국 AI 실전 챌린지로, 2026년에 8개 트랙을 설정하여 학생들이 실제 기업과 사회 문제를 중심으로 AI 프로토타입을 개발하도록 합니다.',
    descriptionJa:
      '学生向けの全国 AI 実践チャレンジ大会。2026 年は 8 つのトラックを設定し、学生が実際の企業および社会的課題を中心に AI プロトタイプを行います。',
    descriptionEn:
      'A national applied AI challenge for students. The 2026 edition has 8 tracks where students build AI prototypes around real enterprise and societal problem statements.',
    stats: [
      {
        label: '2026 赛道',
        labelKo: '2026년 트랙',
        labelJa: '2026 トラック',
        labelEn: '2026 tracks',
        value: '8 个',
        valueKo: '8개',
        valueJa: '8 個',
        valueEn: '8',
      },
      {
        label: '报名期',
        labelKo: '등록 기간',
        labelJa: '登録期間',
        labelEn: 'Registration',
        value: '1 月 5 日-2 月 16 日',
        valueKo: '1월 5일 - 2월 16일',
        valueJa: '1 月 5 日～2 月 16 日',
        valueEn: '5 Jan-16 Feb',
      },
      {
        label: '总决赛',
        labelKo: '총 결승전',
        labelJa: 'ファイナル',
        labelEn: 'Grand Final',
        value: '5 月 22-23 日',
        valueKo: '5월 22-23일',
        valueJa: '5 月 22～23 日',
        valueEn: '22-23 May',
      },
      {
        label: '团队',
        labelKo: '팀',
        labelJa: 'チーム',
        labelEn: 'Team size',
        value: '按赛道不同',
        valueKo: '트랙에 따라 다름',
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
    highlightsJa: [
      '実際の problem statement',
      '企業・機関のトラックオーナー',
      'メンターとワークショップ',
      '優勝チームは賞やインターン機会を得られる場合がある',
    ],
    highlightsKo: [
      '실제 문제 진술',
      '기업 및 기관 트랙 오너',
      '멘토링과 워크숍',
      '우승팀은 상금 또는 인턴십 기회를 받을 수 있음',
    ],
    status: '2026 决赛阶段',
    statusKo: '2026년 결승전 단계',
    statusJa: '2026 決勝段階',
    statusEn: '2026 finalist phase',
    statusTone: 'scheduled',
    url: 'https://naisc.aisingapore.org/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '주관 기관',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore',
          valueEn: 'AI Singapore',
        },
        {
          label: '赛道类型',
          labelKo: '트랙 유형',
          labelJa: 'トラック類型',
          labelEn: 'Track types',
          value: '7 个本地赛道 + 1 个区域 AI Ready ASEAN 赛道',
          valueKo: '7개 로컬 트랙 + 1개 지역 AI Ready ASEAN 트랙',
          valueJa: '7 つの現地トラック + 1 つの地域 AI Ready ASEAN トラック',
          valueEn: '7 local tracks + 1 regional AI Ready ASEAN track',
        },
        {
          label: '对象',
          labelKo: '대상',
          labelJa: '対象',
          labelEn: 'Audience',
          value: '中学、JC、ITE、理工学院、大学和 NS 全职服役人员等，按赛道不同',
          valueKo: '중학교, JC, ITE, 폴리테크닉, 대학교 및 NS 전임 복무자 등, 트랙에 따라 다름',
          valueJa: '中学、JC、ITE、理工学院、大学および NS フルタイム勤務者など、トラックにより異なります',
          valueEn: 'Secondary, JC, ITE, polytechnic, university and full-time NSF students, depending on track',
        },
        {
          label: '2026 总决赛',
          labelKo: '2026년 총 결승전',
          labelJa: '2026 全国決勝',
          labelEn: '2026 Grand Final',
          value: 'AI Student Developer Conference，2026-05-22 至 2026-05-23',
          valueKo: 'AI Student Developer Conference, 2026-05-22 ~ 2026-05-23',
          valueJa: 'AI Student Developer Conference、2026-05-22 から 2026-05-23',
          valueEn: 'AI Student Developer Conference, 22-23 May 2026',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '이것은 어떤 문제를 해결하는가',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'NAISC 让学生更早接触真实 AI 问题，而不是停留在课堂练习。2026 年赛道覆盖安全、预测维护、学生支持、失智照护、日志解析、数据漂移、业务自动化和区域 AI Ready ASEAN。',
          bodyKo:
            'NAISC는 학생들이 강의실 연습에만 머물지 않고 실제 AI 문제를 더 일찍 접할 수 있도록 합니다. 2026년 트랙은 안전, 예측 유지보수, 학생 지원, 치매 돌봄, 로그 분석, 데이터 드리프트, 업무 자동화 및 지역 AI Ready ASEAN을 다룹니다.',
          bodyJa:
            'NAISC は学生が実際の AI 問題により早期にアクセスできるようにし、課題練習に留まりません。2026 年のトラックはセキュリティ、予測保全、学生支援、認知症ケア、ログ解析、データドリフト、ビジネスオートメーションおよび地域 AI Ready ASEAN をカバーします。',
          bodyEn:
            'NAISC gives students early exposure to real AI problems beyond classroom exercises. The 2026 tracks cover security, predictive maintenance, student support, dementia care, log parsing, data drift, business automation and regional AI Ready ASEAN.',
        },
        {
          title: '项目怎样运行',
          titleKo:
            '이것은 싱가포르 학생 인재 파이프라인의 「프로젝트 감각」입구입니다. 이는 기업과 사회 문제를 학생 훈련에 포함시키고, 학생 작품을 미래 지원, 인턴십 및 창업의 증거로 만듭니다.',
          titleJa: 'プロジェクト運営方法',
          titleEn: 'How It Works',
          body: '学生先报名具体赛道，入选后参加 partner briefing 和 problem statement 讲解，再在 4-5 月提交作品并进入决赛。交付物通常包括方案说明、视频 demo、GitHub 仓库或现场演示，具体由赛道定义。',
          bodyKo:
            '학생들은 먼저 특정 트랙에 등록하고, 선정 후 partner briefing과 problem statement 설명에 참여한 다음, 4-5월에 작품을 제출하여 결승전에 진출합니다. 납품물은 일반적으로 솔루션 설명, 비디오 demo, GitHub 저장소 또는 현장 시연을 포함하며, 구체적인 사항은 각 트랙에 의해 정의됩니다.',
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
          bulletsJa: [
            'トラック枠は限定で先着順',
            '応募条件はトラックにより異なる',
            '一部トラックはインターン機会または賞金を提供',
          ],
          bulletsKo: [
            '트랙 정원은 제한적이며 선착순',
            '지원 조건은 트랙별로 다름',
            '일부 트랙은 인턴십 기회 또는 현금 상금 제공',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是新加坡学生人才漏斗的“项目感”入口。它让企业和社会问题进入学生训练，也让学生作品更像未来申请、实习和创业的证据。',
          bodyKo: '프로젝트는 어떻게 운영되는가',
          bodyJa:
            'これはシンガポール学生人材漏斗の「プロジェクト感覚」入口です。企業および社会的課題を学生訓練に進め、学生作品を将来の申請、インターンシップおよび起業の証拠にします。',
          bodyEn:
            'This is the project-based entry point of Singapore student talent funnel. It brings enterprise and social problems into student training, and makes student work more useful as evidence for future applications, internships and startups.',
        },
      ],
      sourceLabel: 'NAISC 官方页面',
      sourceLabelKo: 'NAISC 공식 페이지',
      sourceLabelJa: 'NAISC 公式ページ',
      sourceLabelEn: 'Official NAISC page',
      sourceUrl: 'https://naisc.aisingapore.org/',
      sourceNote: '各赛道资格、交付物和日期以官方页面为准。',
      sourceNoteKo: '각 트랙의 자격 조건, 납품물 및 일정은 공식 페이지를 참고하시기 바랍니다.',
      sourceNoteJa: '各トラック適格性、納品物および日付については公式ページに従ってください。',
      sourceNoteEn: 'Track eligibility, deliverables and dates should be confirmed on the official page.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'international-olympiad-in-ai-2027',
    addedAt: '2026-05-04',
    name: 'IOAI 2027 新加坡',
    nameKo: 'IOAI 2027 싱가포르',
    nameJa: 'IOAI 2027 シンガポール',
    nameEn: 'International Olympiad in AI 2027 Singapore',
    shortName: 'IOAI 2027',
    icon: 'tabler:world',
    category: '国际青年赛事',
    categoryKo: '국제 청년 경기',
    categoryJa: '国際青年大会',
    categoryEn: 'International youth competition',
    owner: 'AI Singapore + NTU',
    ownerEn: 'AI Singapore + NTU',
    description: '2027 年第四届 International Olympiad in AI 将在新加坡举行，由 AI Singapore 和南洋理工大学共同主办。',
    descriptionKo:
      '2027년 제4회 International Olympiad in AI가 싱가포르에서 개최되며, AI Singapore와 Nanyang Technological University가 공동으로 주최합니다.',
    descriptionJa:
      '2027 年第 4 回 International Olympiad in AI はシンガポールで開催され、AI Singapore および南洋理工大学が共同主催します。',
    descriptionEn:
      'The 4th International Olympiad in AI will be held in Singapore in 2027, co-hosted by AI Singapore and Nanyang Technological University.',
    stats: [
      {
        label: '届数',
        labelKo: '회차',
        labelJa: '回数',
        labelEn: 'Edition',
        value: '第 4 届',
        valueKo: '제 4회',
        valueJa: '第 4 回',
        valueEn: '4th edition',
      },
      { label: '年份', labelKo: '연도', labelJa: '年', labelEn: 'Year', value: '2027', valueEn: '2027' },
      {
        label: '主办地',
        labelKo: '주최 지역',
        labelJa: '開催地',
        labelEn: 'Host city',
        value: '新加坡',
        valueKo: '싱가포르',
        valueJa: 'シンガポール',
        valueEn: 'Singapore',
      },
      {
        label: '共同主办',
        labelKo: '공동 주최',
        labelJa: '共同主催',
        labelEn: 'Co-hosts',
        value: 'AISG + NTU',
        valueEn: 'AISG + NTU',
      },
    ],
    highlights: ['全球高中生 AI 竞赛', '新加坡首次主办', 'NOAI 作为本地选拔通道', '展示新加坡 AI 教育品牌'],
    highlightsEn: [
      'Global AI competition for high-school students',
      'Singapore first time hosting',
      'NOAI serves as local selection path',
      'Showcases Singapore AI education brand',
    ],
    highlightsJa: [
      '世界の高校生向け AI コンテスト',
      'シンガポール初開催',
      'NOAI がローカル選抜ルート',
      'シンガポールの AI 教育ブランドを示す',
    ],
    highlightsKo: [
      '전 세계 고등학생 대상 AI 대회',
      '싱가포르 최초 개최',
      'NOAI가 현지 선발 경로 역할',
      '싱가포르 AI 교육 브랜드를 보여줌',
    ],
    status: '2027 主办',
    statusKo: '2027 주최',
    statusJa: '2027 主催',
    statusEn: 'Hosting in 2027',
    statusTone: 'scheduled',
    url: 'https://ioai-official.org/singapore-2027/',
    profile: {
      facts: [
        {
          label: '共同主办',
          labelKo: '공동 주최',
          labelJa: '共同主催',
          labelEn: 'Co-hosts',
          value: 'AI Singapore、Nanyang Technological University',
          valueEn: 'AI Singapore and Nanyang Technological University',
        },
        {
          label: '赛事定位',
          labelKo: '대회 성격',
          labelJa: '大会位置づけ',
          labelEn: 'Competition role',
          value: '面向高中生的国际科学奥林匹克赛事',
          valueKo: '고등학생 대상 국제 과학 올림피아드 대회',
          valueJa: '高校生向けの国際科学オリンピック大会',
          valueEn: 'International Science Olympiad-style competition for high-school students',
        },
        {
          label: '本地通道',
          labelKo: '지역 경로',
          labelJa: '現地ルート',
          labelEn: 'Local pathway',
          value: 'National Olympiad in AI (NOAI)',
          valueEn: 'National Olympiad in AI (NOAI)',
        },
        {
          label: '新加坡队路径',
          labelKo: '싱가포르 팀 경로',
          labelJa: 'シンガポール代表チームパス',
          labelEn: 'Singapore team path',
          value: 'NOAI Final 后约 50-60 人进入 NTU 训练，最终选 8 人代表新加坡',
          valueKo: 'NOAI Final 후 약 50-60명이 NTU 훈련에 진입하고, 최종 8명이 싱가포르를 대표하도록 선발됩니다.',
          valueJa: 'NOAI Final の後、約 50～60 人が NTU 研修に進み、最終的に 8 人がシンガポール代表として選ばれます',
          valueEn: 'After the NOAI Final, around 50-60 students enter NTU training; the final 8 represent Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '이것이 해결하는 문제',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'IOAI 2027 是新加坡 AI 教育的一次国际展示。它不仅是赛事承办，也把 NOAI、NTU 训练和全球 AI 青少年网络串起来，形成从校内兴趣到国际舞台的路径。',
          bodyKo:
            'IOAI 2027은 싱가포르 AI 교육의 국제적 전시입니다. 단지 대회 개최만이 아니라 NOAI, NTU 훈련, 그리고 글로벌 AI 청소년 네트워크를 연결하여 학교 내 관심에서 국제 무대까지의 경로를 형성합니다.',
          bodyJa:
            'IOAI 2027 はシンガポール AI 教育の国際展示です。大会開催だけではなく、NOAI、NTU 研修および全球 AI 青少年ネットワークを結びつけ、校内興味から国際舞台までのルートを形成します。',
          bodyEn:
            'IOAI 2027 is an international showcase for Singapore AI education. It is not only event hosting; it links NOAI, NTU training and the global youth AI network into a path from school interest to international competition.',
        },
        {
          title: '本地选拔链路',
          titleKo: '현지 선발 경로',
          titleJa: '現地選抜チェーン',
          titleEn: 'Local Selection Chain',
          body: '新加坡通过 NOAI 做本地选拔。NOAI 2026 包含学校意向窗口、预赛、决赛、NTU 训练、boot camp 和最终代表队遴选。',
          bodyKo:
            '싱가포르는 NOAI를 통해 현지 선발을 진행합니다. NOAI 2026은 학교 의향 창, 예선, 결선, NTU 훈련, boot camp 및 최종 대표팀 선발을 포함합니다.',
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
          bulletsJa: [
            '予選で決勝進出の上位 150 名を選抜',
            '決勝後、約 50〜60 名の学生が追加訓練へ進む',
            '最終 8 名がシンガポール代表として IOAI に参加',
          ],
          bulletsKo: [
            '예선으로 결선 진출 상위 150명을 선발',
            '결선 후 약 50~60명의 학생이 추가 훈련으로 진입',
            '최종 8명이 싱가포르 대표로 IOAI에 참가',
          ],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '主办 IOAI 的意义不只是“办一场比赛”。它给新加坡一个公开叙事：这里不只是部署 AI 的地方，也是训练下一代 AI 人才的地方。',
          bodyKo:
            'IOAI를 개최하는 의의는 단지 「경기를 개최하는 것」이 아닙니다. 이것은 싱가포르에 공개적 서사를 제공합니다: 이 곳은 AI를 배포하는 장소일 뿐만 아니라, 차세대 AI 인재를 훈련하는 장소입니다.',
          bodyJa:
            'IOAI 主催の意義は「競技を開く」だけではありません。シンガポールに公開の言説を与えます：ここは AI を導入するだけの場所ではなく、次世代 AI 人材を訓練する場所でもあります。',
          bodyEn:
            'Hosting IOAI is not just about running a contest. It gives Singapore a public narrative: this is not only a place that deploys AI, but a place that trains the next generation of AI talent.',
        },
      ],
      sourceLabel: 'IOAI 2027 官方页面',
      sourceLabelKo: 'IOAI 2027 공식 페이지',
      sourceLabelJa: 'IOAI 2027 公式ページ',
      sourceLabelEn: 'Official IOAI 2027 page',
      sourceUrl: 'https://ioai-official.org/singapore-2027/',
      sourceNote: '赛事日期、代表队选拔和报名安排以 IOAI / AISG 官方页面为准。',
      sourceNoteKo: '대회 일정, 대표팀 선발 및 등록 안내는 IOAI / AISG 공식 페이지를 기준으로 합니다.',
      sourceNoteJa:
        '大会日付、代表チーム選抜および登録アレンジメントについては IOAI / AISG 公式ページに従ってください。',
      sourceNoteEn:
        'Competition dates, team selection and registration details should be confirmed on IOAI / AISG official pages.',
      lastChecked: talentDataDate,
    },
  },
  {
    id: 'ai-singapore-goes-to-school',
    addedAt: '2026-05-04',
    name: 'AI 进校园',
    nameKo: 'AI 학교 진입',
    nameJa: 'AI 校園進出',
    nameEn: 'AI Singapore Goes to School / TWA+',
    shortName: 'AI Goes to School',
    icon: 'tabler:school',
    category: '中小学与教师',
    categoryKo: '초중학교와 교사',
    categoryJa: '中小学および教師',
    categoryEn: 'Schools and educators',
    owner: 'AI Singapore Talent Development',
    ownerEn: 'AI Singapore Talent Development',
    description:
      '面向中小学和教师的 AI 启蒙与教学能力建设组合，包括 2 小时学生入门课、AI4K、AI for Students 和 TWA+ 教师培训。',
    descriptionKo:
      '초중학교와 교사를 대상으로 한 AI 입문 및 교수 능력 개발 조합으로, 2시간 학생 입문 과정, AI4K, AI for Students, 그리고 TWA+ 교사 훈련을 포함합니다.',
    descriptionJa:
      '中小学および教師向けの AI 啓蒙および教学能力構築組み合わせ。2 時間の学生入門課、AI4K、AI for Students および TWA+ 教師研修を含みます。',
    descriptionEn:
      'A school and educator enablement bundle, including a 2-hour student introduction, AI4K, AI for Students and the TWA+ teacher work-attachment programme.',
    stats: [
      {
        label: '学生入门',
        labelKo: '학생 입문',
        labelJa: '学生入門',
        labelEn: 'Student intro',
        value: '2 小时',
        valueKo: '2시간',
        valueJa: '2 時間',
        valueEn: '2 hours',
      },
      {
        label: '儿童 AI',
        labelKo: '어린이 AI',
        labelJa: '児童 AI',
        labelEn: 'AI for kids',
        value: 'P3-P6',
        valueEn: 'P3-P6',
      },
      {
        label: '教师培训',
        labelKo: '교사 훈련',
        labelJa: '教師研修',
        labelEn: 'Teacher training',
        value: 'TWA+',
        valueEn: 'TWA+',
      },
      {
        label: '渠道',
        labelKo: '채널',
        labelJa: 'チャネル',
        labelEn: 'Channel',
        value: '学校 / 教师',
        valueKo: '학교 / 교사',
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
    highlightsJa: [
      'AI Singapore Goes To School',
      'AI4K 子ども向けコース',
      '教師の AI リテラシー向上',
      '公立学校向け AI 教学リソース',
    ],
    highlightsKo: [
      'AI Singapore Goes To School',
      'AI4K 어린이 과정',
      '교사 AI 리터러시 향상',
      '공립학교 AI 수업 리소스',
    ],
    status: '持续推进',
    statusKo: '지속적 추진',
    statusJa: '継続推進',
    statusEn: 'Ongoing',
    statusTone: 'evergreen',
    url: 'https://learn.aisingapore.org/home-2-2/',
    profile: {
      facts: [
        {
          label: '承办方',
          labelKo: '주최 기관',
          labelJa: '実施機関',
          labelEn: 'Owner',
          value: 'AI Singapore Talent Development',
          valueEn: 'AI Singapore Talent Development',
        },
        {
          label: '学生课',
          labelKo: '학생 강좌',
          labelJa: '学生課',
          labelEn: 'Student session',
          value: 'AI Singapore Goes To School：2 小时 AI 基础和 ChatGPT 应用介绍',
          valueKo: 'AI Singapore Goes To School: 2시간 AI 기초 및 ChatGPT 활용 소개',
          valueJa: 'AI Singapore Goes To School：2 時間の AI 基礎および ChatGPT アプリケーション導入紹介',
          valueEn: 'AI Singapore Goes To School: 2-hour introduction to AI basics and ChatGPT applications',
        },
        {
          label: '儿童课程',
          labelKo: '어린이 프로그램',
          labelJa: '児童課程',
          labelEn: 'Kids track',
          value: 'AI For Kids 面向 Primary 3-6',
          valueKo: 'AI For Kids (초등학교 3~6학년 대상)',
          valueJa: 'AI For Kids は Primary 3～6 を対象としています',
          valueEn: 'AI For Kids for Primary 3-6 students',
        },
        {
          label: '教师项目',
          labelKo: '교사 프로젝트',
          labelJa: '教師プロジェクト',
          labelEn: 'Educator track',
          value: 'TWA+ Programme @ AI Singapore',
          valueEn: 'TWA+ Programme @ AI Singapore',
        },
      ],
      sections: [
        {
          title: '它解决什么问题',
          titleKo: '이것이 해결하는 문제',
          titleJa: 'どのような問題に対応するか',
          titleEn: 'What It Solves',
          body: 'AI 人才培养如果只从大学开始就太晚了。AI 进校园把 AI 基础认知、教师培训和校内资源放到更早阶段，让学生和教师先形成共同语言。',
          bodyKo:
            'AI 인재 양성을 대학부터 시작하면 이미 너무 늦습니다. AI가 교실에 들어가면서 AI 기초 인식, 교사 교육, 교내 자원을 더 이른 단계에 배치하여 학생과 교사가 공통언어를 먼저 형성할 수 있도록 합니다.',
          bodyJa:
            'AI 人材育成が大学からのみ始まっていてはすでに遅すぎます。AI 校園進出は AI 基礎認知、教師研修および校内リソースをより早い段階に配置し、学生および教師が先に共通言語を形成するようにします。',
          bodyEn:
            'If AI talent development starts only at university, it is too late. AI Singapore Goes to School moves baseline AI literacy, teacher training and classroom resources earlier, giving students and educators a shared language.',
        },
        {
          title: '内容怎样组合',
          titleKo: '내용을 어떻게 조합하나요',
          titleJa: 'コンテンツはどのように組み合わせられているか',
          titleEn: 'How The Bundle Fits Together',
          body: '学生侧有 2 小时入门课、AI4K、AI for Students 和学生自学资源；教师侧有 TWA+ 和教育者 AI 素养课程。它不是单一课程，而是一个低龄化 AI 学习入口。',
          bodyKo:
            '학생 측면에는 2시간 입문 강좌, AI4K, AI for Students, 학생 자습 자료가 있고, 교사 측면에는 TWA+와 교육자 AI 소양 과정이 있습니다. 이는 단일 과정이 아니라 저연령층을 위한 AI 학습 진입점입니다.',
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
          bulletsJa: [
            '学校単位でまとめて届けやすい',
            '教師研修が教室での普及力を決める',
            'NAISC / NOAI と学生ファネルを形成',
          ],
          bulletsKo: ['학교 단위 대량 접근에 적합', '교사 훈련이 교실 확산력을 결정', 'NAISC / NOAI와 학생 퍼널 형성'],
        },
        {
          title: '观察',
          titleKo: '컬럼',
          titleJa: '考察',
          titleEn: 'Editorial Read',
          body: '这是最容易被低估的一层。高端人才来自少数人，但社会 AI 采用来自大量普通学生和教师的早期熟悉。',
          bodyKo:
            '이것이 가장 과소평가되기 쉬운 층입니다. 고급 인재는 소수에서 나오지만, 사회적 AI 채택은 많은 일반 학생과 교사의 초기 친숙도에서 나옵니다.',
          bodyJa:
            'これは最も過小評価されやすい層です。高級人材は少数人から来ていますが、社会 AI 導入は大多数の普通学生および教師の早期熟悉から来ています。',
          bodyEn:
            'This layer is easy to underestimate. Elite talent comes from a small group, but societal AI adoption comes from early familiarity among many ordinary students and teachers.',
        },
      ],
      sourceLabel: 'AI Singapore / LearnAI 官方页面',
      sourceLabelKo: 'AI Singapore / LearnAI 공식 페이지',
      sourceLabelJa: 'AI Singapore / LearnAI 公式ページ',
      sourceLabelEn: 'Official AI Singapore / LearnAI pages',
      sourceUrl: 'https://learn.aisingapore.org/home-2-2/',
      sourceNote: '学校项目、教师项目和课程目录会持续更新。',
      sourceNoteKo: '학교 프로젝트, 교사 프로젝트 및 커리큘럼 디렉토리는 지속적으로 업데이트됩니다.',
      sourceNoteJa: '学校プロジェクト、教師プロジェクトおよび課程ディレクトリは継続更新されます。',
      sourceNoteEn: 'School programmes, educator programmes and course catalogues continue to evolve.',
      lastChecked: talentDataDate,
    },
  },
];

// 新加坡 AI 视频观点数据

import { toTraditional } from '~/i18n/opencc';

export interface VideoItem {
  id: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  speaker: string;
  speakerTitle: string;
  speakerTitleEn?: string;
  speakerTitleJa?: string;
  speakerTitleKo?: string;
  speakerType: 'government' | 'academic' | 'industry';
  date: string;
  duration: string;
  summary: string;
  summaryEn?: string;
  summaryJa?: string;
  summaryKo?: string;
  /** 一句话：这条对新加坡 AI 战略为什么重要（含一个具体数字 / 日期 / 机构）。
   *  与 summary（发生了什么）分开。四语同 commit；drafted by
   *  scripts/lib/why-it-matters.ts, gated by check:i18n-completeness. */
  whyItMatters?: string;
  whyItMattersEn?: string;
  whyItMattersJa?: string;
  whyItMattersKo?: string;
  topic: string;
  topicEn?: string;
  topicJa?: string;
  topicKo?: string;
  youtubeUrl: string;
  channel: string;
  /** YYYY-MM-DD; the date this record was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates"
   *  entry. Set automatically by emit pipelines; manual additions must set
   *  it too. Old records may be undefined → not surfaced. */
  addedAt?: string;
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
}

export interface VideoCategory {
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    name: 'AI 战略与愿景',
    nameKo: 'AI 전략과 비전',
    nameJa: 'AI 戦略とビジョン',
    nameEn: 'AI Strategy & Vision',
    icon: 'tabler:target',
    description: '国家 AI 战略规划、Smart Nation 愿景',
    descriptionKo: '국가 AI 전략 수립, Smart Nation 비전',
    descriptionJa: '国家 AI 戦略計画、Smart Nation ビジョン',
    descriptionEn: 'National AI strategy, Smart Nation vision',
  },
  {
    name: 'AI 治理与监管',
    nameKo: 'AI 거버넌스와 규제',
    nameJa: 'AI ガバナンスと規制',
    nameEn: 'AI Governance & Regulation',
    icon: 'tabler:scale',
    description: 'AI 伦理、法规、安全框架',
    descriptionKo: 'AI 윤리, 법규, 안전 프레임워크',
    descriptionJa: 'AI 倫理、法規、セーフティフレームワーク',
    descriptionEn: 'AI ethics, regulation, safety frameworks',
  },
  {
    name: 'AI 人才与教育',
    nameKo: 'AI 인재와 교육',
    nameJa: 'AI 人材と教育',
    nameEn: 'AI Talent & Education',
    icon: 'tabler:school',
    description: 'AI 人才培养、教育计划',
    descriptionKo: 'AI 인재 양성, 교육 계획',
    descriptionJa: 'AI 人材育成、教育計画',
    descriptionEn: 'AI talent development, education programmes',
  },
  {
    name: 'AI 产业与应用',
    nameKo: 'AI 산업과 응용',
    nameJa: 'AI 産業と応用',
    nameEn: 'AI Industry & Applications',
    icon: 'tabler:building',
    description: '行业应用、企业实践、创业',
    descriptionKo: '산업 응용, 기업 실무, 스타트업',
    descriptionJa: '業界応用、企業実践、起業',
    descriptionEn: 'Industry applications, enterprise practice, entrepreneurship',
  },
  {
    name: '国际合作与对标',
    nameKo: '국제 협력과 벤치마크',
    nameJa: '国際協力とベンチマーク',
    nameEn: 'International Cooperation & Benchmarking',
    icon: 'tabler:world',
    description: '跨国合作、国际会议、区域比较',
    descriptionKo: '국제 협력, 국제 회의, 지역 비교',
    descriptionJa: 'クロスボーダー協力、国際会議、地域比較',
    descriptionEn: 'Cross-border cooperation, international forums, regional comparison',
  },
];

export const SPEAKER_TYPE_LABELS: Record<string, string> = {
  government: '政府官员',
  academic: '学者',
  industry: '行业领袖',
};

export const SPEAKER_TYPE_LABELS_EN: Record<string, string> = {
  government: 'Government Official',
  academic: 'Academic',
  industry: 'Industry Leader',
};

export const SPEAKER_TYPE_LABELS_JA: Record<string, string> = {
  government: '政府関係者',
  academic: '研究者',
  industry: '産業界リーダー',
};

/** Accept any Lang code from src/i18n. zh-tw runs the zh labels through
 *  OpenCC for Traditional Chinese rendering; ko reuses the en labels
 *  (Korean readers' English literacy is generally higher than their
 *  Chinese). When you author a dedicated `SPEAKER_TYPE_LABELS_KO`
 *  hand-translation, swap the en branch out. */
export function pickSpeakerTypeLabels(lang: string): Record<string, string> {
  if (lang === 'ja') return SPEAKER_TYPE_LABELS_JA;
  if (lang === 'en' || lang === 'ko') return SPEAKER_TYPE_LABELS_EN;
  if (lang === 'zh-tw') {
    return Object.fromEntries(Object.entries(SPEAKER_TYPE_LABELS).map(([k, v]) => [k, toTraditional(v)]));
  }
  return SPEAKER_TYPE_LABELS;
}

export const videos: VideoItem[] = [
  {
    id: 'v088',
    title: '新加坡加强知识产权框架应对AI',
    titleEn: 'Singapore strengthens IP framework amid AI rise',
    titleJa: 'シンガポール、AI対応のため知識財産枠組みを強化しています。',
    titleKo: '싱가포르, 인공지능 대응 지적재산권 체계 강화',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerType: 'industry',
    date: '2026-08-26',
    duration: '10:50',
    summary:
      '新加坡审视知识产权框架，AI带来版权、专利和所有权问题。政府征求公众意见，探讨版权作品用于AI训练和AI创作的认可问题。',
    summaryEn:
      'Singapore examines its IP framework as AI raises copyright and patent questions. The government seeks public feedback on using copyrighted works to train AI and recognizing AI-assisted creators.',
    summaryJa:
      'シンガポール、知識財産枠組みを審視しています。AIは著作権、特許、所有権に関する問題をもたらしています。政府は公衆の意見を求め、著作権作品のAI訓練およびAI創作への利用に関する認可問題を検討しています。',
    summaryKo:
      '싱가포르는 지적재산권 체계를 검토하고 있습니다. AI는 저작권, 특허, 소유권 문제를 야기합니다. 정부는 대중의 의견을 구하고 있으며, 저작권 작품의 AI 훈련 사용과 AI 생성물의 인정 문제에 대해 논의하고 있습니다.',
    whyItMatters: 'IPOS 以提示充分程度界定 AI 作品版权归属，抢在诉讼空白期立规，有望成为区域先例',
    whyItMattersEn:
      'IPOS defines copyright ownership of AI works based on the sufficiency of prompts, establishing regulations ahead of the litigation gap, with potential to become a regional precedent.',
    whyItMattersJa:
      'IPOSはプロンプトの充分度によってAI作品の著作権帰属を界定し、訴訟の空白期間に先制的に規則を立てることで、地域の先例となることが見込まれています。',
    whyItMattersKo:
      'IPOS는 프롬프트 충분도에 따라 AI 작품의 저작권 귀속을 정의하고, 소송 공백기를 선점하여 규정을 수립함으로써 지역 선례가 될 것으로 전망된다',
    topic: 'AI 治理与监管',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    topicKo: 'AI 거버넌스와 규제',
    youtubeUrl: 'https://www.youtube.com/watch?v=nh2H8fmT5ss',
    channel: 'CNA',
    addedAt: '2026-08-31',
  },
  {
    id: 'v085',
    title: '新型医疗AI平台自动化流程',
    titleEn: 'New AI platform automates healthcare workflows for patient care',
    titleJa: '新型医療AIプラットフォームのプロセス自動化',
    titleKo: '신형 의료 AI 플랫폼의 프로세스 자동화',
    speaker: 'Nadine Yeam',
    speakerTitle: '记者',
    speakerTitleEn: 'Reporter',
    speakerTitleJa: '記者',
    speakerTitleKo: '기자',
    speakerType: 'industry',
    date: '2026-08-24',
    duration: '00:00',
    summary: '新加坡推出医疗AI平台自动化医护日常任务，使医护人员能专注于患者护理。',
    summaryEn:
      'Singapore is rolling out an agentic AI platform for healthcare to automate routine clinical workflows, enabling healthcare professionals to focus more on patient care.',
    summaryJa:
      'シンガポールは医療AIプラットフォームを導入して医療従事者の日常業務を自動化することで、患者ケアに専念できるようにしています。',
    summaryKo:
      '싱가포르는 의료진의 일상 업무를 자동화하는 의료 AI 플랫폼을 출시하였으며, 이를 통해 의료 인력이 환자 간호에 집중할 수 있도록 하고 있습니다.',
    whyItMatters:
      '医疗一线用 AI 自动化任务，成为新加坡以人力短缺撬动公共服务 AI 落地的样板，但 CNA 报道未见监管问责主体',
    whyItMattersEn:
      "Healthcare frontlines use AI to automate tasks, becoming Singapore's model for leveraging labor shortages to drive public-service AI deployment, yet CNA reporting reveals no identifiable regulatory accountability entity",
    whyItMattersJa:
      '医療第一線がAIを用いた自動化タスクを実行し、シンガポール国が人手不足を活用して公共サービスへのAI導入を推し進める模範ケースとなっていますが、CNA報道では規制監督の責任主体が見当たりません',
    whyItMattersKo:
      '의료 최일선의 AI 자동화 업무가 인력 부족을 활용한 공공 서비스 AI 도입의 싱가포르 모범 사례가 되었지만, CNA 보도에는 규제 책임 주체가 드러나지 않았습니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=GInVZhYbMWA',
    channel: 'CNA',
    addedAt: '2026-08-25',
  },
  {
    id: 'v086',
    title: '新加坡拒为非法贸易渠道，总理黄循财说',
    titleEn: 'Singapore will not be illegal trade conduit: PM Wong',
    titleJa: 'シンガポールは違法な貿易ルートとなることを拒否する、とローレンス・ウォン総理は述べました。',
    titleKo: '싱가포르는 불법 무역 경로가 되기를 거부하고 있으며, 총리 황순재가 이를 밝혔습니다.',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerTitleJa: 'シンガポール首相',
    speakerTitleKo: '싱가포르 총리',
    speakerType: 'government',
    date: '2026-08-23',
    duration: '00:00',
    summary: '黄总理表示新加坡拒绝充当非法贸易渠道，同时讨论AI对劳动力的影响与全球贸易壁垒。',
    summaryEn:
      "PM Wong said Singapore will not be used as a conduit for illegal trade, while addressing AI's impact on the workforce and rising global trade barriers.",
    summaryJa:
      'ローレンス・ウォン総理は、シンガポールが違法な貿易チャネルとして機能することを拒否し、同時にAIが労働力に与える影響とグローバルな貿易障壁について議論することを表明しました。',
    summaryKo:
      '황 총리는 싱가포르가 불법 무역 경로로 기능하기를 거부한다고 표명했으며, 동시에 AI가 노동력에 미치는 영향과 글로벌 무역 장벽에 대해 논의했습니다.',
    whyItMatters:
      '黄循财 8 月 23 日的表态将拒绝违规转运与 AI 冲击就业、全球贸易壁垒并置，凸显新加坡以中立信誉换取 AI 投资的策略正经受考验',
    whyItMattersEn:
      "Lawrence Wong's August 23 statement equates rejecting illegal transshipment with AI's employment impact and global trade barriers, highlighting that Singapore's strategy of trading neutral credibility for AI investment faces a test",
    whyItMattersJa:
      'ローレンス・ウォンの8月23日の発言で、違法な転運拒否とAIが雇用に与える影響、世界的貿易障壁を並列に扱い、シンガポールがニュートラルな信頼を活用してAI投資を獲得する戦略が試験されていることが明らかになっています',
    whyItMattersKo:
      'Lawrence Wong이 8월 23일 성명에서 불법 운송 거절과 AI 고용 충격, 글로벌 무역 장벽을 함께 다루면서, 중립성 신뢰로 AI 투자를 확보하려는 싱가포르 전략이 시험대에 올랐음을 드러냈습니다.',
    topic: 'AI 战略与愿景',
    topicEn: 'AI Strategy & Vision',
    topicJa: 'AI 戦略とビジョン',
    topicKo: 'AI 전략 및 비전',
    youtubeUrl: 'https://www.youtube.com/watch?v=83k0fwdruQw',
    channel: 'CNA',
    addedAt: '2026-08-25',
  },
  {
    id: 'v087',
    title: '新加坡将自主应对人工智能等技术变化',
    titleEn: 'Singapore to handle gains and risks of tech change on its own terms',
    titleJa: 'シンガポールはAIなどの技術変化に自主的に対応します。',
    titleKo: '싱가포르는 인공지능 등 기술 변화에 주체적으로 대응할 것입니다.',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerTitleJa: 'シンガポール首相',
    speakerTitleKo: '싱가포르 총리',
    speakerType: 'government',
    date: '2026-08-23',
    duration: '00:00',
    summary: '总理在国庆集会演讲中表示，新加坡将积极把握人工智能等技术的机遇，同时有效管控其带来的风险。',
    summaryEn:
      "At the National Day Rally, PM Wong outlines Singapore's approach to seizing AI opportunities while managing technological disruption.",
    summaryJa:
      '総理は建国記念日の集会での演説で、シンガポールがAIなどの技術がもたらす機会を積極的に活用し、同時にそれがもたらすリスクを効果的に管理・制御することを表明しました。',
    summaryKo:
      '총리는 국경절 행사 연설에서 싱가포르가 인공지능 등 기술이 제공하는 기회를 적극 포착하는 동시에 이러한 기술이 초래하는 위험을 효과적으로 관리할 것이라고 밝혔습니다.',
    whyItMatters: '总理在国庆集会谈 AI，把技术议题纳入国家最高规格议程，却未给出具体政策或预算细节',
    whyItMattersEn:
      "The Prime Minister discusses AI at the National Day rally, elevating the technology issue to the nation's highest-level agenda, yet provides no specific policy or budget details",
    whyItMattersJa:
      '総理が建国記念日集会でAIについて語り、技術課題を国家最高レベルのアジェンダに組み込みましたが、具体的な政策や予算の詳細は示していません',
    whyItMattersKo:
      '총리가 국경일 행사에서 AI에 대해 언급하면서 기술 의제를 국가 최고 수준의 의제에 포함시켰지만, 구체적인 정책이나 예산 세부사항은 제시하지 않았습니다.',
    topic: 'AI 战略与愿景',
    topicEn: 'AI Strategy & Vision',
    topicJa: 'AI 戦略とビジョン',
    topicKo: 'AI 전략 및 비전',
    youtubeUrl: 'https://www.youtube.com/watch?v=8FMQHTpquaE',
    channel: 'CNA',
    addedAt: '2026-08-25',
  },
  {
    id: 'v084',
    title: 'IMDA 扩大 AI 专业培训，创造科技机遇',
    titleEn: 'AI training for professionals: IMDA expands AI programmes',
    titleJa: 'IMDA、AI専門研修を拡大し、テクノロジー機会を創造',
    titleKo: 'IMDA가 AI 전문 교육을 확대하여 기술 기회를 창조합니다',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerType: 'industry',
    date: '2026-08-20',
    duration: '00:00',
    summary:
      'IMDA 推出新的 AI 培训计划，为律师和专业人士提供升级机会，同时为应届毕业生和中层职业者创造科技职业发展道路。',
    summaryEn:
      'IMDA has expanded AI training programmes for professionals, including new fluency schemes for lawyers and placement initiatives for fresh graduates and mid-career professionals.',
    summaryJa:
      'IMDAは新たなAI研修プログラムを発表し、弁護士および専門職のためのスキルアップ機会を提供しつつ、新卒およびミッドキャリア職業者のためのテクノロジー職業発展の道を創造しています。',
    summaryKo:
      'IMDA가 새로운 AI 교육 프로그램을 출범하여 변호사와 전문가에게 역량 강화 기회를 제공하고, 동시에 신입 졸업생과 중간 경력 전문가에게 기술 경력 발전 경로를 창조합니다.',
    whyItMatters: 'IMDA 培训对象从科技岗位延伸到律师等专业服务业，说明新加坡把 AI 转型压力从技术部门扩散至传统监管行业',
    whyItMattersEn:
      'IMDA training expands from technology roles to professional services like law, showing Singapore is spreading AI transformation pressure from tech departments to traditionally regulated industries',
    whyItMattersJa:
      'IMDAの研修対象が技術職から弁護士などの専門サービス業に拡大し、シンガポールがAI変革の圧力を技術部門から従来の規制業界に拡散させていることを示しています',
    whyItMattersKo:
      'IMDA의 교육 대상이 기술 직무에서 변호사 등 전문 서비스업으로 확대되었으며, 이는 싱가포르가 AI 전환 부담을 기술 부서에서 전통 규제 산업으로 확산시키고 있음을 보여줍니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=SsVgzblqWYQ',
    channel: 'CNA',
    addedAt: '2026-08-21',
  },
  {
    id: 'v083',
    title: '走进 AIAP 面试日',
    titleEn: 'Step Inside AIAP Interview Day',
    titleJa: 'AIAPの面接日へ',
    titleKo: 'AIAP 면접일 속으로',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-08-19',
    duration: '00:00',
    summary: '展示新加坡 AI 学徒计划的面试日流程，包括代码答辩和小组案例分析，重点考察思维方式和解决问题能力。',
    summaryEn:
      'A behind-the-scenes look at the AIAP selection process on interview day, featuring code defense and group case studies that assess how candidates think and tackle real-world AI problems.',
    summaryJa:
      'シンガポールのAIアプレンティスシップ・プログラム（AIAP）の面接日の流れを紹介します。コード面接とグループケース分析を含み、思考方法と問題解決能力を重点的に評価しています。',
    summaryKo:
      '싱가포르 AI 견습생 프로그램의 면접 절차를 보여주며, 코드 디펜스와 팀 사례 분석을 포함하고, 사고방식과 문제해결 능력을 중점적으로 평가하는 방식을 다룹니다.',
    whyItMatters: 'AIAP 面试环节首次公开评审标准 显示新加坡 AI 人才选拔正从学历门槛转向实战思维能力',
    whyItMattersEn:
      "AIAP's interview stage publicly discloses evaluation criteria for the first time, showing Singapore's AI talent selection is shifting from educational qualifications to practical thinking ability",
    whyItMattersJa:
      'AIAPの面接段階が初めて評審基準を公開し、シンガポールのAI人材選抜が学歴要件から実務的思考能力へと転換していることを示しています',
    whyItMattersKo:
      'AIAP 면접 단계에서 처음으로 공개 평가 기준이 제시되었으며, 이는 싱가포르 AI 인재 선발이 학력 기준에서 실전 사고 능력으로 전환되고 있음을 보여줍니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=wZxBx6o6AdU',
    channel: 'AI Singapore',
    addedAt: '2026-08-20',
  },
  {
    id: 'v082',
    title: '沈穆根谈政府AI防范战略',
    titleEn: 'Shanmugam on Harnessing AI for Security',
    titleJa: 'シンボクコン氏が政府のAI防範戦略について語る',
    titleKo: '셴무근, 정부 AI 방어 전략 논의',
    speaker: 'Shanmugam',
    speakerTitle: '新加坡内政部长兼国家安全统筹部长',
    speakerTitleEn: 'Coordinating Minister for National Security and Minister for Home Affairs, Singapore',
    speakerTitleJa: 'シンガポール内務大臣兼国家安全保障統括大臣',
    speakerTitleKo: '싱가포르 내무부 장관 겸 국가안보조정부장관',
    speakerType: 'government',
    date: '2026-08-18',
    duration: '19:01',
    summary: '新加坡需借强治理和精通AI的能力应对不断演变的威胁。',
    summaryEn:
      'Singapore must leverage strong governance and proficient use of AI to stay ahead of evolving AI-enhanced threats.',
    summaryJa:
      'シンガポールは、強力なガバナンスと AI に精通した能力を活用して、絶え間なく進化する脅威に対応する必要があります。',
    summaryKo: '싱가포르는 강력한 거버넌스와 AI 전문성을 바탕으로 지속적으로 진화하는 위협에 대응해야 합니다.',
    whyItMatters: '沈穆根身兼内政部长与国家安全统筹部长表态，显示 AI 治理正从产业政策议题上升为国家安全议题',
    whyItMattersEn:
      'Masagos Zulkifli, concurrently serving as Ministry of Home Affairs(MHA) Minister and National Security Coordination Minister, indicates AI governance is rising from an industrial policy issue to a national security issue',
    whyItMattersJa:
      'シェン・ムーゲンが内務省（MHA）長と国家安全調整長を兼任する発言から、AI治理が産業政策の課題から国家安全保障の課題へと上昇していることが示されています',
    whyItMattersKo:
      '신목근이 내무부（MHA）장관과 국가안보통조부장관을 겸직하면서 AI 거버넌스가 산업 정책 의제에서 국가 안보 의제로 상승하고 있음을 드러냈습니다.',
    topic: 'AI 战略与愿景',
    topicEn: 'AI Strategy & Vision',
    topicJa: 'AI 戦略とビジョン',
    topicKo: 'AI 전략 및 비전',
    youtubeUrl: 'https://www.youtube.com/watch?v=VzaQgamGli8',
    channel: 'The Straits Times',
    addedAt: '2026-08-19',
  },
  {
    id: 'v081',
    title: '脑细胞数据中心：生物芯片新方案',
    titleEn: 'Brain Cells Power Prototype Data Centre',
    titleJa: '脳細胞データセンター：生物チップの新手法',
    titleKo: '뇌세포 데이터 센터: 바이오칩의 새로운 방안',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerType: 'industry',
    date: '2026-08-15',
    duration: '00:00',
    summary: '新加坡国立大学研究人员开发生物数据中心原型，用脑细胞代替电脑芯片，有望提升能效。',
    summaryEn:
      'Researchers at the National University of Singapore developed a prototype biological data centre powered by brain cells instead of computer chips, with potential for improved energy efficiency.',
    summaryJa:
      'シンガポール国立大学の研究者は、脳細胞によってコンピュータチップを代替する生物データセンター原型を開発しており、エネルギー効率の向上が見込まれています。',
    summaryKo:
      '싱가포르국립대학교 연구원들이 뇌세포로 컴퓨터 칩을 대체하는 생물학적 데이터 센터 프로토타입을 개발했으며, 에너지 효율을 높일 것으로 기대됩니다.',
    whyItMatters:
      '新加坡国立大学生物芯片原型若可规模化，为电网与土地双重受限的新加坡数据中心提供低能耗备选，但离商用尚远',
    whyItMattersEn:
      "Should National University of Singapore's biochip prototype be scalable, it would provide a low-power alternative for Singapore's data centres, constrained by both power grids and land, but commercialization remains distant",
    whyItMattersJa:
      'シンガポール国立大学のバイオチッププロトタイプが規模化可能であれば、電力網と土地の両面で制約を受けるシンガポールのデータセンターに低エネルギー消費の代替案を提供できる可能性がありますが、商用化にはまだ遠いです',
    whyItMattersKo:
      '싱가포르 국립대학교의 생물칩 프로토타입이 규모화할 수 있다면, 전력망과 토지의 이중 제약이 있는 싱가포르 데이터센터에 저에너지 대안을 제공할 수 있지만, 상용화까지는 아직 거리가 있습니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=mwISkfdRN4o',
    channel: 'CNA',
    addedAt: '2026-08-18',
  },
  {
    id: 'v080',
    title: '海尼根为何聘用AIAP学员',
    titleEn: 'Why We Hire AIAP Graduates — Heineken',
    titleJa: 'ハイネケンがAIAP学員を採用する理由',
    titleKo: '하이네켄이 AIAP 훈련생을 채용하는 이유',
    speaker: 'Dr. Ralph Ostertag',
    speakerTitle: '首席信息官（亚太）兼全球GenAI实验室主任',
    speakerTitleEn: 'Regional CIO (APAC) and Director, Global GenAI Lab',
    speakerTitleJa: '最高情報責任者（アジア太平洋）兼グローバルGenAI実験室長',
    speakerTitleKo: '최고 정보 책임자(아시아태평양) 겸 글로벌 GenAI 실험실 책임자',
    speakerType: 'industry',
    date: '2026-08-06',
    duration: '01:00',
    summary: '海尼根全球GenAI实验室负责人讲述如何利用AI推动EverGreen 2030战略，及AIAP学员的重要作用。',
    summaryEn:
      "Heineken's Regional CIO discusses how the company is leveraging AI and GenAI Lab to drive its EverGreen 2030 strategy, and the role of AI Apprenticeship Programme graduates in this transformation.",
    summaryJa:
      'ハイネケンのグローバルGenAI実験室の責任者が、AIを活用してEverGreen 2030戦略を推進する方法、およびAIAP学員の重要な役割について説明しています。',
    summaryKo:
      '하이네켄 글로벌 GenAI 실험실 책임자가 AI를 활용하여 EverGreen 2030 전략을 추진하는 방법과 AIAP 훈련생의 중요한 역할에 대해 설명합니다.',
    whyItMatters: 'AIAP 学员打入海尼根全球 GenAI 实验室核心团队，证明新加坡人才管道已切入跨国企业总部级 AI 战略决策',
    whyItMattersEn:
      "AIAP students joining Heineken's global GenAI laboratory core team proves Singapore's talent pipeline has penetrated multinational enterprises' headquarters-level AI strategic decision-making",
    whyItMattersJa:
      'AIAPの学生がハイネケン・グローバルGenAI実験室のコアチームに入り、シンガポールの人材パイプラインが多国籍企業の本社レベルのAI戦略決定に組み込まれていることが証明されています',
    whyItMattersKo:
      'AIAP 학생이 Heineken 글로벌 GenAI 실험실의 핵심 팀에 진입했으며, 이는 싱가포르 인재 파이프라인이 이미 다국적 기업 본부급 AI 전략 의사결정에 포함되고 있음을 증명합니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=4hN78mxFW7M',
    channel: 'AI Singapore',
    addedAt: '2026-08-14',
  },
  {
    id: 'v079',
    title: '为什么我们聘用 AIAP 毕业生——SAM 第二部分',
    titleEn: 'Why We Hire AIAP Graduates — SAM Part 2',
    titleJa: 'なぜ私たちはAIAP卒業生を採用するのか——SAM第二部',
    titleKo: 'AIAP 졸업생을 채용하는 이유——SAM 제2부',
    speaker: 'Victor & Ming Wah',
    speakerTitle: 'AI 工程师及资深 AI 经理',
    speakerTitleEn: 'AI Engineer & Senior AI Manager',
    speakerTitleJa: 'AIエンジニアおよびシニアAIマネージャー',
    speakerTitleKo: 'AI 엔지니어 및 수석 AI 매니저',
    speakerType: 'industry',
    date: '2026-07-31',
    duration: '01:00',
    summary:
      'SAM 的 AI 工程师 Victor 和资深 AI 经理 Ming Wah 分享他们在 AI 学徒项目中的经历，以及该项目如何为他们当前的工作做准备。',
    summaryEn:
      'SAM AI engineers Victor and Ming Wah discuss their experience in the AI Apprenticeship Programme and how it prepared them for their current roles in AI engineering.',
    summaryJa:
      'SAMのAIエンジニアであるビクターとシニアAIマネージャーであるミン・ワーが、AI学徒プログラムでの経験と、そのプログラムが現在の職務にどのように役立つかについて共有しています。',
    summaryKo:
      'SAM의 AI 엔지니어 Victor와 수석 AI 매니저 Ming Wah는 AI 견습 프로그램에서의 경험과 이 프로그램이 현재 업무를 위해 어떻게 그들을 준비했는지를 공유합니다.',
    whyItMatters: 'AI Singapore 用雇主证言而非公开就业数据为 AIAP 背书，暴露人才管道成效仍缺乏第三方量化验证',
    whyItMattersEn:
      "AI Singapore endorses AIAP through employer testimonials rather than public employment data, revealing that the talent pipeline's effectiveness still lacks third-party quantitative verification",
    whyItMattersJa:
      'AI Singaporeがオープンな雇用データではなく雇用者の証言を用いてAIAPを推奨し、人材パイプラインの有効性がまだ第三者による定量的検証を欠いていることが明らかになっています',
    whyItMattersKo:
      'AI Singapore이 공개 고용 데이터가 아닌 고용주 증언으로 AIAP을 뒷받침하면서, 인재 파이프라인의 효과가 여전히 제3자 정량 검증을 결여하고 있음이 노출되었습니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=R_EfquZrnHg',
    channel: 'AI Singapore',
    addedAt: '2026-08-03',
  },
  {
    id: 'v075',
    title: '新加坡发布生成式 AI 数据使用新指南',
    titleEn: 'Singapore introduces generative AI guidelines on use of personal data, chatbots',
    titleJa: 'シンガポール、生成 AI の個人データ利用に関する新ガイドラインを発表',
    titleKo: '싱가포르, 생성형 AI 데이터 사용 새로운 지침 공개',
    speaker: 'Aldrina Thirunagaran',
    speakerTitle: 'CNA 记者',
    speakerTitleEn: 'CNA Reporter',
    speakerTitleJa: 'CNA記者',
    speakerTitleKo: 'CNA 기자',
    speakerType: 'industry',
    date: '2026-07-20',
    duration: '10:40',
    summary: '新加坡推出生成式 AI 个人数据使用新指南，旨在帮助企业负责任地采纳 AI 同时建立公众信任。',
    summaryEn:
      'Singapore introduces new guidelines for generative AI use of personal data, aiming to help businesses adopt AI responsibly while building public trust.',
    summaryJa:
      'シンガポールは生成 AI による個人データ利用の新ガイドラインを発表した。企業が AI を責任ある形で導入しつつ、社会からの信頼を築けるよう支援することを狙いとしている。',
    summaryKo:
      '싱가포르는 생성형 AI 개인 데이터 사용 새로운 지침을 도입했으며, 이는 기업이 책임감 있게 AI를 채택하면서 동시에 대중 신뢰를 구축하도록 돕기 위한 것입니다.',
    whyItMatters: 'PDPC 选择发布指南而非修订 PDPA，坐实新加坡以自律代替强制的生成式 AI 治理路线',
    whyItMattersEn:
      "PDPC's choice to issue guidelines rather than amend PDPA confirms Singapore's generative AI governance approach of self-regulation over mandatory enforcement",
    whyItMattersJa:
      'PDPCがPDPAを改正するのではなく指針を発表することを選択し、シンガポールが自主規制を強制に代わらせる生成型AI治理路線を確定しています',
    whyItMattersKo:
      'PDPC가 PDPA 수정이 아닌 지침 발표를 선택하면서, 생성형 AI 규제에서 자율성을 강제보다 우선하는 싱가포르의 기조가 확정되었습니다.',
    topic: 'AI 治理与监管',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    topicKo: 'AI 거버넌스와 규제',
    youtubeUrl: 'https://www.youtube.com/watch?v=fcAW-UsI-6o',
    channel: 'CNA',
    addedAt: '2026-07-28',
  },
  {
    id: 'v076',
    title: '新加坡零售商借鉴中国直播电商与AI工具',
    titleEn: "Singapore retailers take inspiration from China's live commerce, AI tools",
    titleJa: 'シンガポールの小売業者、中国のライブコマースと AI ツールに学ぶ',
    titleKo: '싱가포르 소매상인, 중국 라이브 커머스와 AI 도구 참고',
    speaker: 'Ivy Chok',
    speakerTitle: '记者',
    speakerTitleEn: 'Reporter',
    speakerTitleJa: '記者',
    speakerTitleKo: '기자',
    speakerType: 'industry',
    date: '2026-07-19',
    duration: '03:12',
    summary: '新加坡零售商赴杭州考察直播电商和AI驱动的个性化等快速增长的趋势，随后在业务中实施了相关改变。',
    summaryEn:
      'Singapore retailers visited Hangzhou to study fast-moving trends like live commerce and AI-driven personalisation, and have since implemented changes in their business strategies.',
    summaryJa:
      'シンガポールの小売業者が杭州を訪問し、ライブコマースや AI によるパーソナライゼーションなど急速に広がるトレンドを視察。その後、自社の事業戦略に変更を取り入れています。',
    summaryKo:
      '싱가포르 소매상인들이 항저우로 가 라이브 커머스와 AI 중심의 개인화 등 빠르게 성장하는 추세를 조사한 후, 사업 내에서 관련된 변화를 시행했습니다.',
    whyItMatters:
      '新加坡零售商 2026 年赴杭州取经直播电商与 AI 个性化，暴露本土应用落后于中国实践，倒逼企业先于政策自我进化',
    whyItMattersEn:
      'Singapore retailers visit Hangzhou in 2026 to learn live-commerce and AI personalization best practices, exposing local applications lagging behind Chinese practice and forcing enterprises to evolve ahead of policy',
    whyItMattersJa:
      'シンガポール小売業者が2026年に杭州を訪れてライブコマース配信とAIパーソナライゼーションを学び、国内アプリケーションが中国の実践に遅れていることが明らかになり、企業が政策に先立ってみずからを進化させることを強いられています',
    whyItMattersKo:
      '싱가포르 소매상이 2026년 항저우에서 라이브 커머스와 AI 개인화를 배우면서, 본지 응용이 중국 실전에 뒤떨어져 있음이 노출되었고, 기업들이 정책보다 먼저 자체 진화를 강요받고 있습니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=d6ZjSaU0snQ',
    channel: 'CNA',
    addedAt: '2026-07-28',
  },
  {
    id: 'v077',
    title: '新加坡简化建筑机器人监管',
    titleEn: 'Singapore Streamlines Construction Robotics Regulations',
    titleJa: 'シンガポール、建設ロボット規制を簡素化',
    titleKo: '싱가포르, 건설 로봇 규제 간소화',
    speaker: 'Nikhil Khattar',
    speakerTitle: 'CNA记者',
    speakerTitleEn: 'CNA Reporter',
    speakerTitleJa: 'CNA記者',
    speakerTitleKo: 'CNA 기자',
    speakerType: 'industry',
    date: '2026-07-17',
    duration: '03:02',
    summary: '新加坡简化建筑业监管规定，加速机器人技术应用，支持企业扩大试点。',
    summaryEn:
      'Singapore streamlines construction regulations to hasten robotics adoption, supporting firms to scale successful trials and identify trusted technologies.',
    summaryJa:
      'シンガポールは建設業の規制を簡素化し、ロボット技術の応用を加速し、企業が試験的プログラムを拡大するのを支援しています。',
    summaryKo:
      '싱가포르는 건설업 규제 규정을 간소화하여 로봇 기술 적용을 가속화하고, 기업이 파일럿을 확대하도록 지원합니다.',
    whyItMatters:
      '新加坡7月17日将监管简化列为机器人落地的关键杠杆而非资金投入，建筑业试点成败将决定这套打法能否复制到其他缺工行业',
    whyItMattersEn:
      "Singapore on July 17 identifies regulatory simplification as the key lever for robotics deployment rather than funding, with the construction sector pilot's success or failure determining whether this approach can replicate across other labour-short industries",
    whyItMattersJa:
      'シンガポールは7月17日、規制簡素化をロボット導入の重要なレバレッジとして列挙し（資金投入ではなく）、建設業の試験的導入の成否が、このアプローチを他の労働力不足業種に複製できるかを決定することになります',
    whyItMattersKo:
      '싱가포르는 7월 17일 로봇 도입의 핵심 레버리지로 자금 투입이 아닌 규제 간소화를 제시했습니다. 건설업 시범의 성패가 이 전략을 다른 인력 부족 산업으로 복제할 수 있는지를 결정할 것입니다.',
    topic: 'AI 治理与监管',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    topicKo: 'AI 거버넌스와 규제',
    youtubeUrl: 'https://www.youtube.com/watch?v=_Ow8DVCUsC4',
    channel: 'CNA',
    addedAt: '2026-07-28',
  },
  {
    id: 'v078',
    title: 'SAM为何聘用AIAP毕业生',
    titleEn: 'Why SAM Hires AIAP Graduates',
    titleJa: 'SAM がなぜAIAP卒業生を採用するのか',
    titleKo: 'SAM, AIAP 졸업생을 고용하는 이유',
    speaker: 'Peter Lim',
    speakerTitle: 'SAM总裁兼首席执行官',
    speakerTitleEn: 'President and CEO of SAM',
    speakerTitleJa: 'SAM社長兼最高経営責任者',
    speakerTitleKo: 'SAM 회장 겸 최고 경영자',
    speakerType: 'industry',
    date: '2026-07-24',
    duration: '01:00',
    summary: '航空航天和半导体制造商SAM的总裁分享公司如何整合AI及招聘AI人才的标准。',
    summaryEn:
      "Aerospace and semiconductor manufacturer SAM's CEO discusses how the company integrates AI into its business and what he looks for when hiring AI talent.",
    summaryJa:
      '航空宇宙・半導体製造メーカーのSAM社長は、企業がAIを統合し、AI人材を採用するための基準を共有しています。',
    summaryKo:
      '항공우주 및 반도체 제조업체 SAM의 회장이 회사가 AI를 어떻게 통합하고 AI 인재를 채용하는 기준을 공유합니다.',
    whyItMatters:
      'SAM是半导体与航空航天制造商，其对AIAP毕业生的背书证明AI Singapore人才管线已打入硬科技产业而非止步软件业',
    whyItMattersEn:
      "SAM, a semiconductor and aerospace manufacturer, endorses AIAP graduates, proving AI Singapore's talent pipeline has penetrated hard-tech industries rather than remaining confined to software",
    whyItMattersJa:
      'SAMは半導体および航空宇宙製造企業であり、AIAP卒業生に対する推奨がAI Singaporeの人材パイプラインがハードテクノロジー産業に進出し、ソフトウェア業に止まっていないことを証明しています',
    whyItMattersKo:
      'SAM은 반도체 및 항공우주 제조사로, AIAP 졸업생에 대한 지지를 통해 AI Singapore의 인재 파이프라인이 소프트웨어 업종을 넘어 하드테크 산업에 진입했음을 증명합니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=ub3InTQBZBY',
    channel: 'AI Singapore',
    addedAt: '2026-07-28',
  },
  {
    id: 'v074',
    title: 'AI虚假主播在TikTok散布关于新加坡的误导信息',
    titleEn: "The AI 'news anchors' spreading misleading claims about Singapore on TikTok",
    titleJa: 'AI生成の虚偽配信者がTikTok上でシンガポールに関する誤導情報を拡散しています。',
    titleKo: 'AI 생성 가짜 호스트가 TikTok에서 싱가포르에 관한 오도 정보를 유포하고 있습니다.',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerType: 'industry',
    date: '2026-07-17',
    duration: '02:17',
    summary: 'CNA调查发现550多个TikTok视频使用AI生成虚假女性形象传播关于新加坡和马来西亚的虚假或误导信息。',
    summaryEn:
      "CNA's investigation uncovered over 550 TikTok videos using AI-generated female personas, with nearly 9 in 10 spreading false or misleading claims about Singapore and Malaysia.",
    summaryJa:
      'CNAの調査により、550以上のTikTok動画がAIで生成された虚偽の女性像を使用してシンガポールおよびマレーシアに関する虚偽または誤導情報を拡散していることが判明しました。',
    summaryKo:
      'CNA 조사에 따르면 550개 이상의 TikTok 동영상이 AI 생성 가짜 여성 이미지를 사용하여 싱가포르와 말레이시아에 관한 거짓 또는 오도 정보를 퍼뜨리고 있습니다.',
    whyItMatters: '跨境 AI 虚拟主播批量造谣，测试 FICA 与 POFMA 对境外平台、境外行为者的实际管辖力',
    whyItMattersEn:
      "Cross-border AI virtual hosts spreading disinformation in bulk test FICA and POFMA's actual jurisdiction over foreign platforms and foreign actors",
    whyItMattersJa:
      '国境を越えたAIバーチャル主人公が大規模にデマを流し、FICAとPOFMAが国外プラットフォームおよび国外主体に対する実際の管轄権をテストしています',
    whyItMattersKo:
      '국경을 넘는 AI 가상 진행자들의 대량 허위정보 유포가 FICA와 POFMA의 해외 플랫폼 및 해외 행위자에 대한 실질적 관할권을 시험하고 있습니다.',
    topic: 'AI 治理与监管',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    topicKo: 'AI 거버넌스와 규제',
    youtubeUrl: 'https://www.youtube.com/watch?v=x3zh_TenNa4',
    channel: 'CNA',
    addedAt: '2026-07-17',
  },
  {
    id: 'v073',
    title: '新加坡用本地数据训练 AI 医疗模型',
    titleEn: 'Singapore to train AI models using local clinical data, medical guidelines',
    titleJa: 'シンガポール、現地データでAI医療モデルを訓練',
    titleKo: '싱가포르가 현지 데이터로 AI 의료 모형을 훈련합니다.',
    speaker: 'Ong Ye Kung',
    speakerTitle: '新加坡卫生部长',
    speakerTitleEn: 'Minister for Health, Singapore',
    speakerTitleJa: 'シンガポール衛生大臣',
    speakerTitleKo: '싱가포르 보건부 장관',
    speakerType: 'government',
    date: '2026-07-09',
    duration: '03:25',
    summary: '新加坡利用本地临床数据训练 AI 模型用于诊疗，首先关注糖尿病和眼病。',
    summaryEn:
      'Singapore will train AI models on local clinical data for patient diagnosis and treatment, initially focusing on diabetes and eye diseases before healthcare system rollout.',
    summaryJa: 'シンガポールが現地臨床データを活用して診療用のAI医療モデルを訓練し、まず糖尿病と眼病に注目しています。',
    summaryKo:
      '싱가포르는 현지 임상 데이터를 활용하여 진단 및 치료용 AI 모형을 훈련하고 있으며, 먼저 당뇨병과 안질환에 중점을 두고 있습니다.',
    whyItMatters: '新加坡卫生部选糖尿病、眼病做本地数据训练试点，释放医疗 AI 优先本土化而非直接套用跨国模型的信号',
    whyItMattersEn:
      "Singapore's Ministry of Health(MOH) selects diabetes and eye disease for local-data training pilots, signaling that healthcare AI prioritises localisation over directly adopting multinational models",
    whyItMattersJa:
      'シンガポール保健省（MOH）が糖尿病と眼疾患を地元データ訓練の試験的導入として選択し、医療AIが国際的なモデルを直接採用するのではなく、本土化を優先することの信号を発しています',
    whyItMattersKo:
      '싱가포르 보건부（MOH）가 당뇨병과 안질환을 본지 데이터 교육 시범으로 선택했으며, 이는 의료 AI가 다국적 모델을 직접 적용하기보다 본지 기반화를 우선한다는 신호입니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=HiUeGjVJQok',
    channel: 'CNA',
    addedAt: '2026-07-12',
  },
  {
    id: 'v072',
    title: '旅游导游应对AI和社交媒体冲击',
    titleEn: 'Tourist guides adapt as AI and social media reshape travel habits',
    titleJa: '旅行ガイドはAIおよびソーシャルメディアの衝撃に対応しています。',
    titleKo: '여행 가이드의 AI 및 소셜 미디어 충격 대응',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleKo: '아시아 뉴스 방송 보도',
    speakerType: 'industry',
    date: '2026-07-11',
    duration: '03:35',
    summary: '旅客越来越多使用AI生成行程和社交媒体推荐，旅游导游的机会减少，行业被迫创新适应。',
    summaryEn:
      'As travelers increasingly rely on AI-generated itineraries and social media recommendations, tourist guides face fewer opportunities and must innovate to adapt.',
    summaryJa:
      '旅行者がますますAI生成の旅程やソーシャルメディアの推奨を利用するようになり、旅行ガイドの機会が減少し、業界は革新と適応を強いられています。',
    summaryKo:
      '관광객들이 점점 더 많이 AI 생성 여행 일정과 소셜 미디어 추천을 사용하면서 여행 가이드의 기회가 줄어들고 있으며, 업계는 혁신과 적응을 강요받고 있습니다.',
    whyItMatters: 'CNA 报道显示 AI 冲击已从白领岗位蔓延至导游等一线服务业 暴露新加坡技能再培训体系的盲区',
    whyItMattersEn:
      "CNA reporting shows AI impact has spread from white-collar positions to front-line service sectors like tour guiding, exposing blind spots in Singapore's skills retraining system",
    whyItMattersJa:
      'CNA報道はAIの影響がホワイトカラー職からツアーガイドなどの最前線サービス業に拡がっていることを示し、シンガポールのスキル再トレーニングシステムの盲点を露出しています',
    whyItMattersKo:
      'CNA 보도는 AI 충격이 화이트칼라 직무에서 투어 가이드 등 일선 서비스 산업으로 확산되고 있음을 보여주면서, 싱가포르 기술 재교육 체계의 맹점을 노출했습니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=REmizQfzHPw',
    channel: 'CNA',
    addedAt: '2026-07-12',
  },
  {
    id: 'v069',
    title: '新加坡与中国应深化AI与能源合作',
    titleEn: 'Singapore and China should deepen AI and energy ties',
    titleJa: 'シンガポールと中国がAIおよびエネルギー協力を深化させるべきです。',
    titleKo: '싱가포르와 중국이 AI 및 에너지 협력을 심화해야 합니다',
    speaker: 'Chee Hong Tat',
    speakerTitle: '新加坡国家发展部长',
    speakerTitleEn: 'Minister for National Development, Singapore',
    speakerTitleJa: 'シンガポール国家開発大臣',
    speakerTitleKo: '싱가포르 국가개발부 장관',
    speakerType: 'government',
    date: '2026-07-06',
    duration: '02:53',
    summary: '国家发展部长徐芳达在新中论坛呼吁两国深化AI应用与能源韧性合作。',
    summaryEn:
      'National Development Minister Chee Hong Tat, speaking at the Singapore-China Forum, calls for deeper bilateral cooperation on AI adoption and energy resilience.',
    summaryJa:
      '国家開発大臣のChee Hong Tatは、シンガポール・中国フォーラムで、AI活用とエネルギー強靭性における両国協力の深化を呼びかけました。',
    summaryKo:
      '국가개발부 장관 Chee Hong Tat은 싱가포르-중국 포럼에서 AI 활용과 에너지 회복력 분야의 양국 협력 심화를 촉구했습니다.',
    whyItMatters: '国家发展部长在新中论坛谈 AI 与能源韧性，暴露电力供给才是新加坡 AI 扩张的真实瓶颈',
    whyItMattersEn:
      "The Ministry of National Development(MND) Minister discusses AI and energy resilience at the Singapore-China Forum, revealing that electricity supply is Singapore's true bottleneck for AI expansion",
    whyItMattersJa:
      '国家開発省（MND）長がシンガポール・中国フォーラムでAIとエネルギー回復力について語り、電力供給がシンガポールのAI拡張の真の瓶頸であることが明らかになっています',
    whyItMattersKo:
      '국가개발부（MND）장관이 싱-중 포럼에서 AI와 에너지 복원력을 언급하면서, 전력 공급이 싱가포르 AI 확장의 실질적 병목임을 드러냈습니다.',
    topic: '国际合作与对标',
    topicEn: 'International Cooperation & Benchmarking',
    topicJa: '国際協力とベンチマーク',
    topicKo: '국제 협력 및 벤치마킹',
    youtubeUrl: 'https://www.youtube.com/watch?v=lKpENb7KPA8',
    channel: 'CNA',
    addedAt: '2026-07-07',
  },
  {
    id: 'v070',
    title: '陈振声谈AI与国防（ST论坛完整版）',
    titleEn: 'Chan Chun Sing on AI in Defence (full ST Forum session)',
    titleJa: 'Chan Chun SingがAIと防衛を語る（STフォーラム完全版）',
    titleKo: 'Chan Chun Sing이 말하는 AI와 국방 (ST 포럼 풀 세션)',
    speaker: 'Chan Chun Sing',
    speakerTitle: '新加坡国防部长',
    speakerTitleEn: 'Minister for Defence, Singapore',
    speakerTitleJa: 'シンガポール国防大臣',
    speakerTitleKo: '싱가포르 국방부장관',
    speakerType: 'government',
    date: '2026-06-26',
    duration: '1:16:34',
    summary: '新加坡国防部长陈振声在ST论坛完整对话中回答AI军事应用、国防开支与包容性等提问。',
    summaryEn:
      "In this full ST Forum dialogue, Singapore's Defence Minister Chan Chun Sing fields questions on AI in the military, defence spending and inclusivity.",
    summaryJa:
      'このSTフォーラム完全版対話で、シンガポール国防大臣のChan Chun Singは、軍事におけるAI、防衛支出、包摂性に関する質問に答えています。',
    summaryKo:
      '이 ST 포럼 전체 대담에서 싱가포르 국방부장관 Chan Chun Sing은 군사 AI 응용, 국방비, 포용성에 관한 질문에 답합니다.',
    whyItMatters: '国防部长陈振声罕见公开谈 AI 军事应用，显示国防安全正式被纳入新加坡 AI 战略话语体系',
    whyItMattersEn:
      "Defence Minister Chan Chun Sing rarely discusses AI military applications publicly, showing that defence security has formally been incorporated into Singapore's AI strategy discourse",
    whyItMattersJa:
      '国防省（MINDEF）長チャン・チュンシンが珍しくAIの軍事応用について公開で語り、防衛安全保障が正式にシンガポールのAI戦略言説体系に組み込まれていることを示しています',
    whyItMattersKo:
      '국방부（MINDEF）장관 진진성이 AI 군사 응용에 대해 드물게 공개적으로 언급하면서, 국방 안보가 싱가포르 AI 전략 담론에 공식적으로 포함되었음을 보였습니다.',
    topic: 'AI 战略与愿景',
    topicEn: 'AI Strategy & Vision',
    topicJa: 'AI 戦略とビジョン',
    topicKo: 'AI 전략 및 비전',
    youtubeUrl: 'https://www.youtube.com/watch?v=m1AXL46Lw94',
    channel: 'The Straits Times',
    addedAt: '2026-07-07',
  },
  {
    id: 'v071',
    title: 'AIAP 简介',
    titleEn: 'A Sneak Peek into AIAP',
    titleJa: 'AIAP紹介',
    titleKo: 'AIAP 소개',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-06-26',
    duration: '01:00',
    summary: 'AIAP 是 6-9 个月的 AI 工程深度培养计划，包含导师指导、实战项目和月度 S$4000 补助。',
    summaryEn:
      'AIAP is a 6-9 month intensive AI engineering deep-skilling programme featuring mentorship from experienced engineers, real-world industry projects, and a S$4,000 monthly stipend.',
    summaryJa:
      'AIAPは6～9か月のAIエンジニアリング深化育成プログラムで、メンター指導、実践的なプロジェクト、および月額S$4000の補助を含んでいます。',
    summaryKo:
      'AIAP는 6-9개월의 AI 공학 심화 양성 프로그램으로, 멘토 지도, 실전 프로젝트 및 월별 S$4000 지원금을 포함합니다.',
    whyItMatters:
      'AI Singapore 拿出 S$4000 月薪、6-9 个月脱产培养 AI 工程师，把人才供给做成国家买单的长期基建，而非留给市场自我造血',
    whyItMattersEn:
      'AI Singapore offers S$4,000 monthly salary and 6–9 months of full-time training for AI engineers, turning talent supply into state-funded long-term infrastructure rather than leaving it to market self-sufficiency',
    whyItMattersJa:
      'AI Singaporeが月給S$4000、6～9ヶ月の専従養成でAIエンジニアを育成し、人材供給を国家が負担する長期的な基盤整備とし、市場の自己調達に委ねていません',
    whyItMattersKo:
      'AI Singapore이 월급 싱가포르 달러 4,000과 6-9개월 탈직 교육으로 AI 엔지니어를 양성하면서, 인재 공급을 국가가 부담하는 장기 기반시설로 만들었으며, 시장 자조로 남겨두지 않았습니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재 및 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=86q_VISXpzM',
    channel: 'AI Singapore',
    addedAt: '2026-07-07',
  },
  {
    id: 'v067',
    title: "国防AI中'人在回路'必不可少",
    titleEn: 'Man in the loop a must when using AI in defence',
    titleJa: '防衛AIにおける「ヒューマン・イン・ザ・ループ」は必不可欠です。',
    titleKo: '국방 AI에서의 「루프 내 인간」은 필수불가결합니다',
    speaker: 'Chan Chun Sing',
    speakerTitle: '新加坡国防部长',
    speakerTitleEn: 'Minister for Defence, Singapore',
    speakerTitleJa: 'シンガポール国防大臣',
    speakerTitleKo: '싱가포르 국방부장관',
    speakerType: 'government',
    date: '2026-06-26',
    duration: '01:12',
    summary: '新加坡国防部长陈振声强调，在军事AI应用中人类必须保持决策控制权。',
    summaryEn:
      "Singapore's Defence Minister Chan Chun Sing argues that humans must remain in control of decision-making when AI is used in military operations.",
    summaryJa:
      'シンガポール国防大臣のChan Chun Singは、軍事AI応用において、人間が意思決定のコントロール権を保持しなければならないと強調しました。',
    summaryKo:
      '싱가포르 국방부장관 Chan Chun Sing은 군사 AI 응용에서 인류가 의사결정 통제권을 유지해야 한다고 강조했습니다.',
    whyItMatters:
      '陈振声 2026 年 6 月明确表态，新加坡军事 AI 应用将坚持人类否决权而非全自主路线，为国防 AI 治理立下基调',
    whyItMattersEn:
      "Chan Chun Sing clearly states in June 2026 that Singapore's military AI applications will maintain human veto authority rather than full autonomy, setting the tone for defence AI governance",
    whyItMattersJa:
      'チャン・チュンシンが2026年6月に明確に表明し、シンガポールの軍事AI応用は人間の拒否権を維持し、完全自主路線ではないことを示し、防衛AI治理の基調を設定しています',
    whyItMattersKo:
      '진진성 국방부（MINDEF）장관이 2026년 6월 싱가포르의 군사 AI 응용이 완전 자율이 아닌 인간 거부권을 유지할 것이라고 명확히 표명하면서, 국방 AI 거버넌스의 기조를 설정했습니다.',
    topic: 'AI 治理与监管',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    topicKo: 'AI 거버넌스와 규제',
    youtubeUrl: 'https://www.youtube.com/watch?v=Y9Dnbumn1Bg',
    channel: 'The Straits Times',
    addedAt: '2026-06-28',
  },
  {
    id: 'v068',
    title: 'AI编码助手时代的行业论坛',
    titleEn: 'AIxTech Industry Forum: How to Lead in the Era of AI Coding Assistants',
    titleJa: 'AIコーディングアシスタント時代の業界フォーラム',
    titleKo: 'AI 코딩 어시스턴트 시대의 업계 포럼',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-06-25',
    duration: '03:22',
    summary: '一场讨论 AI 编码助手采用的行业论坛。核心观点：AI 不会替代工程师，但掌握这些工具的工程师将获得竞争优势。',
    summaryEn:
      "An industry forum on effectively adopting AI coding assistants. The key insight: AI won't replace engineers, but those who master these tools gain competitive advantages.",
    summaryJa:
      'AIコーディングアシスタント採用について論じる業界フォーラムです。核心的な観点：AIはエンジニアを置き換えることはないが、これらのツールを習得したエンジニアは競争上の優位性を獲得します。',
    summaryKo:
      'AI 코딩 어시스턴트 도입을 논의하는 업계 포럼입니다. 핵심 관점: AI는 엔지니어를 대체하지 않을 것이지만, 이 도구들을 숙달한 엔지니어는 경쟁 우위를 얻을 것입니다.',
    whyItMatters: 'AI Singapore 作为官方人才机构率先定调增强而非替代，为工程师技能焦虑定下政策叙事基调',
    whyItMattersEn:
      'AI Singapore, as the official talent institution, first establishes the narrative of augmentation rather than replacement, setting the policy discourse tone for engineer skill anxiety',
    whyItMattersJa:
      'AI Singaporeが公式な人材機関として、増強ではなく代替を先制的に定め、エンジニアのスキル不安に対する政策的叙述の基調を設定しています',
    whyItMattersKo:
      'AI Singapore이 관료 인재 기구로서 처음 「증강이지 대체가 아닌」 기조를 정하면서, 엔지니어의 기술 불안감에 정책 서사의 기조를 수립했습니다.',
    topic: 'AI 产业与应用',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    topicKo: 'AI 산업 및 응용',
    youtubeUrl: 'https://www.youtube.com/watch?v=rxisjSudqLw',
    channel: 'AI Singapore',
    addedAt: '2026-06-28',
  },
  {
    id: 'v066',
    title: 'NAISC 2026 圆满落幕',
    titleEn: 'NAISC 2026 Highlights',
    titleJa: 'NAISC 2026 は円満に落幕しました。',
    titleKo: 'NAISC 2026이 성공적으로 마무리되었습니다',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-06-12',
    duration: '02:50',
    summary: '全国 AI 学生挑战赛 2026 圆满结束，来自新加坡及地区的学生在八个赛道上开发创新 AI 解决方案。',
    summaryEn:
      'The National AI Student Challenge (NAISC) 2026 has concluded with students from Singapore and the region developing innovative AI solutions across eight industry-partnered tracks.',
    summaryJa:
      '全国 AI 学生チャレンジ 2026 は円満に終了し、シンガポール及びその地域の学生が 8 つのトラックで革新的な AI ソリューションを開発しました。',
    summaryKo:
      '전국 AI 학생 챌린지 대회 2026이 성공적으로 종료되었으며, 싱가포르 및 지역의 학생들이 8개 트랙에서 혁신적인 AI 솔루션을 개발했습니다.',
    whyItMatters: 'AI Singapore 借 NAISC 八个赛道把人才培养前移到学生阶段，为区域 AI 人才枢纽野心埋下伏笔',
    whyItMattersEn:
      "AI Singapore leverages NAISC's eight tracks to shift talent development to the student stage, laying groundwork for its regional AI talent hub ambitions",
    whyItMattersJa:
      'AI Singaporeが NAISC の8つのトラックを通じ、人材育成を学生段階に前倒しし、地域AIの人材ハブという野心の伏線を敷いています',
    whyItMattersKo:
      'AI Singapore이 NAISC의 여덟 개 트랙을 통해 인재 양성을 학생 단계로 앞당기면서, 지역 AI 인재 허브의 야심을 심어놓았습니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=Vj1mI6PXihU',
    channel: 'AI Singapore',
    addedAt: '2026-06-19',
  },
  {
    id: 'v063',
    title: '黄循财论新加坡AI应用枢纽',
    titleEn: 'PM Wong: Singapore can be an AI application hub',
    titleJa: '黄循財によるシンガポールのAI応用ハブについて',
    titleKo: '로런스 웡 총리: 싱가포르는 AI 응용 허브가 될 수 있다',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerTitleJa: 'シンガポール首相',
    speakerTitleKo: '싱가포르 총리',
    speakerType: 'government',
    date: '2026-06-08',
    duration: '01:34',
    summary: '总理黄循财讨论新加坡帮助工作者掌握AI、维持城市国家竞争力的策略。',
    summaryEn:
      "Prime Minister Lawrence Wong discusses Singapore's approach to helping workers master AI and its strategic importance for city-states.",
    summaryJa:
      '総理黄循財は、シンガポールが労働者のAI習得を支援し、都市国家としての競争力を維持するための戦略について論じています。',
    summaryKo:
      '로런스 웡 총리가 근로자의 AI 숙련을 지원하고 도시국가 싱가포르의 경쟁력을 유지하기 위한 정부의 전략을 논한다.',
    whyItMatters: '2026年6月总理黄循财亲自定调应用枢纽路线,标志新加坡放弃模型军备赛,转押全民技能改造保住竞争力',
    whyItMattersEn:
      "In June 2026, Prime Minister Lawrence Wong personally sets the application-hub direction, marking Singapore's abandonment of the model arms race and pivot to nationwide skills transformation to maintain competitiveness",
    whyItMattersJa:
      '2026年6月、総理ローレンス・ウォンが親自で応用ハブ路線を定め、シンガポールがモデル開発競争を放棄し、全国民的スキル改造に賭けて競争力を維持することを象徴しています',
    whyItMattersKo:
      '2026년 6월 총리 Lawrence Wong이 응용 허브 노선을 친히 정조하면서, 싱가포르가 모델 군비 경쟁을 포기하고 국민 기술 개편으로 경쟁력을 유지하는 노선으로 전환했음을 나타냈습니다.',
    topic: 'AI 战略与愿景',
    topicEn: 'AI Strategy & Vision',
    topicJa: 'AI 戦略とビジョン',
    topicKo: 'AI 전략과 비전',
    youtubeUrl: 'https://www.youtube.com/watch?v=w1WShHjfN7M',
    channel: 'The Straits Times',
    addedAt: '2026-06-09',
  },
  {
    id: 'v064',
    title: 'ATxSummit AI 学生开发者大会 2026',
    titleEn: 'ATxSummit: AI Student Developer Conference 2026',
    titleJa: 'ATxSummit AI学生開発者カンファレンス2026',
    titleKo: 'ATxSummit AI 학생 개발자 콘퍼런스 2026',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-06-05',
    duration: '01:35',
    summary: '大会汇聚行业领袖与AI学生，通过论坛、工坊和实战项目展示最新AI进展与应用。',
    summaryEn:
      'AISDC 2026 brought together industry leaders and aspiring AI talents for panels, workshops, and hands-on learning showcasing the latest AI developments.',
    summaryJa:
      '本カンファレンスは業界リーダーとAI学生を一堂に集め、フォーラム、ワークショップ、実践的なプロジェクトを通じて、最新のAI進展と応用を展示しています。',
    summaryKo: '업계 리더와 AI 학생들이 모여 포럼, 워크숍, 실전 프로젝트를 통해 최신 AI 발전과 응용을 선보인 콘퍼런스.',
    whyItMatters: 'AI Singapore 借 ATxSummit 把学生纳入国家 AI 人才管线,释放新加坡从企业侧转向教育端布局的信号',
    whyItMattersEn:
      "AI Singapore incorporates students into the national AI talent pipeline through ATxSummit, signalling Singapore's shift from enterprise-focused to education-focused deployment",
    whyItMattersJa:
      'AI Singaporeが ATxSummit を利用して学生を国家AI人材パイプラインに組み込み、シンガポールが企業側から教育側への展開転換の信号を発しています',
    whyItMattersKo:
      'AI Singapore이 ATxSummit을 통해 학생을 국가 AI 인재 파이프라인에 포함시키면서, 싱가포르가 기업에서 교육으로 배치를 전환하고 있다는 신호를 내보냈습니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=YZcP8YdkUdk',
    channel: 'AI Singapore',
    addedAt: '2026-06-09',
  },
  {
    id: 'v065',
    title: 'AI Ready ASEAN青年挑战赛2026亮点',
    titleEn: 'AI Ready ASEAN Youth Challenge 2026 Highlights',
    titleJa: 'AI Ready ASEAN Youth Challenge 2026の見どころ',
    titleKo: 'AI Ready ASEAN 청년 챌린지 2026 하이라이트',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerType: 'academic',
    date: '2026-05-21',
    duration: '03:00',
    summary: '首届AI Ready ASEAN青年挑战赛在新加坡举办，汇聚东盟各国年轻创新者，用AI驱动社区影响力。',
    summaryEn:
      'Inaugural AI Ready ASEAN Youth Challenge brought together young innovators from across ASEAN to harness AI for meaningful community impact.',
    summaryJa:
      '初開催されるAI Ready ASEAN Youth Challenge はシンガポールで開催され、ASEAN各国の若き革新者が集い、AIを活用してコミュニティ・インパクトを生み出しています。',
    summaryKo:
      '싱가포르에서 열린 첫 AI Ready ASEAN 청년 챌린지에 아세안 각국의 젊은 혁신가들이 모여 AI로 커뮤니티 임팩트를 만들어냈다.',
    whyItMatters:
      'AI Singapore 把国内人才培育计划升级为东盟青年赛事，首届即测试新加坡能否从人才培育者变身区域 AI 枢纽召集者',
    whyItMattersEn:
      'AI Singapore upgrades its domestic talent cultivation programme to an ASEAN youth competition, testing in its inaugural edition whether Singapore can transform from talent cultivator to regional AI hub convener',
    whyItMattersJa:
      'AI Singaporeが国内人材育成計画をASEAN青年競技会にアップグレードし、第1回はシンガポールが人材育成者から地域AIハブのコーディネーターへと変身できるかをテストしています',
    whyItMattersKo:
      'AI Singapore이 국내 인재 양성 계획을 동남아 청년 대회로 업그레이드하면서, 첫 회부터 싱가포르가 인재 양성자에서 지역 AI 허브 소집자로 변신할 수 있는지를 시험했습니다.',
    topic: 'AI 人才与教育',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    topicKo: 'AI 인재와 교육',
    youtubeUrl: 'https://www.youtube.com/watch?v=5V-l6Av07cc',
    channel: 'AI Singapore',
    addedAt: '2026-06-09',
  },
  {
    id: 'v061',
    title: 'AI Engineer Singapore Day 1：部长开幕 + OpenAI / Google / Vercel / Cursor 主题',
    titleKo: 'AI Engineer Singapore Day 1: 장관 개막 + OpenAI / Google / Vercel / Cursor 주제',
    titleEn: 'AIE Singapore Day 1 ft. Minister, NanoClaw, OpenAI, Google, Vercel, Cursor & more',
    titleJa: 'AIE シンガポール Day 1：閣僚基調講演 + OpenAI / Google / Vercel / Cursor 主要セッション',
    speaker: 'AI Engineer Singapore',
    speakerTitle: 'AI Engineer 首届亚洲峰会（65Labs 主办）',
    speakerTitleKo: 'AI Engineer 첫 아시아 정상회의(65Labs 주최)',
    speakerTitleEn: 'AI Engineer first Asia edition (organised by 65Labs)',
    speakerTitleJa: 'AI Engineer 初のアジア版（主催：65Labs）',
    speakerType: 'industry',
    date: '2026-05-16',
    duration: '08:00:00',
    summary:
      'AI Engineer Singapore Day 1 全程：部长开幕、NanoClaw 演示，以及 OpenAI、Google、Vercel、Cursor 等头部团队的工程实战分享。新加坡首届 AI Engineer 峰会，定位「工程师 × AI」实操层。',
    summaryKo:
      'AI Engineer Singapore Day 1 전체 진행: 장관 개막, NanoClaw 데모, 그리고 OpenAI, Google, Vercel, Cursor 등 선도 팀의 엔지니어링 실전 경험 공유. 싱가포르 첫 AI Engineer 정상회의, 「엔지니어 × AI」실무 레벨로 정위.',
    whyItMatters: '政府为 65Labs 主办的首届亚洲工程师峰会站台，标志新加坡 AI 战略从监管框架转向抢占全球开发者心智',
    whyItMattersEn:
      "The government endorses the inaugural Asian Engineers Summit hosted by 65Labs, marking Singapore's AI strategy shift from regulatory frameworks to capturing global developers' mindshare",
    whyItMattersJa:
      '政府が65Labsが主催する第1回アジアエンジニア峰会を支援し、シンガポールのAI戦略が規制枠組みから世界的開発者の心理を掌握することへと転換することを象徴しています',
    whyItMattersKo:
      '정부가 65Labs가 주최한 첫 아시아 엔지니어 정상회담에 지지를 보내면서, 싱가포르 AI 전략이 규제 프레임워크에서 글로벌 개발자 심지 확보로 전환했음을 나타냈습니다.',
    summaryEn:
      "Day 1 of AI Engineer Singapore — the Minister's opening keynote, NanoClaw demos, and engineering-focused sessions from OpenAI, Google, Vercel, Cursor and other leading teams. Singapore's first AI Engineer summit, positioned at the engineer × AI practitioner layer.",
    summaryJa:
      'AI Engineer シンガポール Day 1 全編。閣僚の開幕基調、NanoClaw のデモ、そして OpenAI、Google、Vercel、Cursor などトップチームによるエンジニアリング実戦セッション。シンガポール初の AI Engineer サミット、「エンジニア × AI」実装層に焦点を当てています。',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    youtubeUrl: 'https://www.youtube.com/watch?v=_xQnSNlBP_w',
    channel: 'AI Engineer',
    addedAt: '2026-05-20',
  },
  {
    id: 'v062',
    title: 'AI Engineer Singapore Day 2：Google DeepMind / Cloudflare / Arize 机器人与运行时主题',
    titleKo: 'AI Engineer Singapore Day 2: Google DeepMind / Cloudflare / Arize 로봇 및 런타임 주제',
    titleEn: 'AIE Singapore Day 2 ft. Google DeepMind, OpenClaw, Adaption, Arize, Cloudflare, Robot Company & more',
    titleJa: 'AIE シンガポール Day 2：Google DeepMind / Cloudflare / Arize 等ロボット・ランタイム主題',
    speaker: 'AI Engineer Singapore',
    speakerTitle: 'AI Engineer 首届亚洲峰会（65Labs 主办）',
    speakerTitleKo: 'AI Engineer 첫 아시아 정상회의(65Labs 주최)',
    speakerTitleEn: 'AI Engineer first Asia edition (organised by 65Labs)',
    speakerTitleJa: 'AI Engineer 初のアジア版（主催：65Labs）',
    speakerType: 'industry',
    date: '2026-05-17',
    duration: '08:00:00',
    summary:
      'AI Engineer Singapore Day 2 全程：Google DeepMind、OpenClaw、Adaption、Arize、Cloudflare、Robot Company 等团队主题分享。Day 2 偏机器人、模型可观测性与运行时栈。',
    summaryKo:
      'AI Engineer Singapore Day 2 전체 진행: Google DeepMind, OpenClaw, Adaption, Arize, Cloudflare, Robot Company 등 팀의 주제 발표. Day 2는 로봇, 모델 관측성, 런타임 스택에 치중.',
    whyItMatters:
      '65Labs 促成 AI Engineer 首届亚洲峰会落地新加坡，机器人与运行时议题成焦点，凸显新加坡靠民间技术社区而非单一政策巩固区域 AI 工程枢纽地位',
    whyItMattersEn:
      "65Labs brings the inaugural Asian AI Engineer Summit to Singapore, with robotics and runtime becoming focal topics, highlighting Singapore's reliance on grassroots tech communities rather than singular policies to solidify its regional AI engineering hub status",
    whyItMattersJa:
      '65Labsが「AI Engineer」初回アジア峰会をシンガポールに実現させ、ロボットと実行時課題が焦点となり、シンガポールが単一政策ではなく民間技術コミュニティに頼って地域AIエンジニアリングハブの地位を強化していることを浮き彫りにしています',
    whyItMattersKo:
      '65Labs가 AI Engineer 첫 아시아 정상회담을 싱가포르에 유치했으며, 로봇과 런타임 의제가 초점이 되면서, 싱가포르가 단일 정책이 아닌 민간 기술 커뮤니티를 통해 지역 AI 엔지니어링 허브 지위를 공고히 했습니다.',
    summaryEn:
      'Day 2 of AI Engineer Singapore — sessions from Google DeepMind, OpenClaw, Adaption, Arize, Cloudflare, Robot Company and others. Day 2 leans toward robotics, model observability, and the runtime stack.',
    summaryJa:
      'AI Engineer シンガポール Day 2 全編。Google DeepMind、OpenClaw、Adaption、Arize、Cloudflare、Robot Company などのセッション。Day 2 はロボティクス、モデル可観測性、ランタイムスタックに重点。',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicEn: 'AI Industry & Applications',
    topicJa: 'AI 産業と応用',
    youtubeUrl: 'https://www.youtube.com/watch?v=m12vGjfbNlo',
    channel: 'AI Engineer',
    addedAt: '2026-05-20',
  },
  {
    id: 'v059',
    title: '李智陞：在教育中谨慎、有目的地引入 AI',
    titleKo: 'Lee Chee Seng: 교육에서 신중하고 목적 있게 AI를 도입',
    titleEn: 'Education Minister Desmond Lee: A Calibrated, Purposeful Approach to AI in Education',
    titleJa: 'デズモンド・リー教育大臣：教育におけるAI導入は慎重かつ目的を持って',
    speaker: 'Desmond Lee',
    speakerTitle: '新加坡教育部长',
    speakerTitleKo: '싱가포르 교육부장관',
    speakerTitleEn: 'Minister for Education, Singapore',
    speakerTitleJa: 'シンガポール教育大臣',
    speakerType: 'government',
    date: '2026-05-06',
    duration: '34:25',
    summary: '新加坡教育部以学习科学研究为依据，采取「校准式」推进——AI 仅在服务于教学目标和学生发展时才被引入课堂。',
    summaryKo:
      '싱가포르 교육부는 학습 과학 연구에 기초해 「조정식」으로 추진—AI는 교수 목표와 학생 발전에 봉사할 때만 교실에 도입됨.',
    whyItMatters:
      '教育部以学习科学为据划定校准路线，与新加坡全力冲刺 AI 采用的国家叙事形成反差，为其他部门树立审慎先例',
    whyItMattersEn:
      "The Ministry of Education(MOE) charts a calibration course grounded in learning science, contrasting with Singapore's all-out AI adoption national narrative and setting a cautious precedent for other ministries",
    whyItMattersJa:
      '教育省（MOE）が学習科学を根拠に較正路線を設定し、シンガポールがAI採用に全力を尽くす国家的叙述と対照をなし、他部門に慎重な先例を示しています',
    whyItMattersKo:
      '교육부（MOE）가 학습 과학을 근거로 교정 방향을 제시하면서, 싱가포르의 AI 전국 도입 추진 서사와 대조를 이루었으며, 다른 부서를 위한 신중함의 모범을 보였습니다.',
    summaryEn:
      "Singapore's Ministry of Education takes a calibrated, evidence-led approach to AI in schools: tools are introduced only when they serve clear educational objectives and student development.",
    summaryJa:
      'シンガポール教育省は、学習科学の研究を踏まえた「校正型」のアプローチを採用しており、教育目標と生徒の発達に資する場合にのみAIを教室に導入します。',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicEn: 'AI Talent & Education',
    topicJa: 'AI 人材と教育',
    youtubeUrl: 'https://www.youtube.com/watch?v=ERhfED1fIfY',
    channel: 'CNA',
    addedAt: '2026-05-09',
  },
  {
    id: 'v060',
    title: '马善高：AI 推进不应遗漏弱势群体',
    titleKo: 'Masagos Zulkifli: AI 추진이 취약계층을 빠뜨려서는 안 됨',
    titleEn: 'Masagos: No Vulnerable Group Should Be Left Behind in AI Push',
    titleJa: 'マサゴス：AI推進で脆弱な層を取り残してはならない（サンガレン・シンポジウム）',
    speaker: 'Masagos Zulkifli',
    speakerTitle: '社会及家庭发展部长',
    speakerTitleKo: '사회 및 가족 발전부 장관',
    speakerTitleEn: 'Minister for Social and Family Development, Singapore',
    speakerTitleJa: 'シンガポール社会・家族発展大臣',
    speakerType: 'government',
    date: '2026-05-08',
    duration: '02:33',
    summary: '社会及家庭发展部长马善高在圣加仑论坛上强调，AI 推进必须兼顾弱势群体，避免技术红利只惠及少数人。',
    summaryKo:
      '사회 및 가족 발전부 장관 Masagos Zulkifli는 St. Gallen Forum에서 AI 추진이 취약계층을 고려해야 하며, 기술 혜택이 소수에게만 가지 않아야 한다고 강조했다.',
    whyItMatters: '马善高在圣加仑论坛把社会公平纳入 AI 议程，为新加坡偏重效率与增长的 AI 叙事补上包容缺口',
    whyItMattersEn:
      "Masagos Zulkifli incorporates social equity into the AI agenda at the St. Gallen Forum, addressing the inclusion gap in Singapore's efficiency and growth-focused AI narrative",
    whyItMattersJa:
      'マサゴス・ズルキフリがセント・ガレン・フォーラムで社会的公正をAIアジェンダに盛り込み、効率と成長を重視するシンガポールのAI叙述に包括性の欠落を補っています',
    whyItMattersKo:
      '마상고가 성갈렌 포럼에서 사회 공평을 AI 의제에 포함시키면서, 효율성과 성장을 중시하는 싱가포르의 편향된 AI 서사에 포용성의 공백을 채웠습니다.',
    summaryEn:
      'Minister for Social and Family Development Masagos Zulkifli, speaking at the St Gallen Symposium, stressed that AI rollouts must include vulnerable groups so that the technology gains do not bypass them.',
    summaryJa:
      '社会・家族発展大臣マサゴス・ズルキフリは、サンガレン・シンポジウムで、AI推進は脆弱な層を含めるべきで、技術の恩恵が一部だけに偏ってはならないと強調しました。',
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicEn: 'AI Governance & Regulation',
    topicJa: 'AI ガバナンスと規制',
    youtubeUrl: 'https://www.youtube.com/watch?v=D8yhiLHzaTA',
    channel: 'CNA',
    addedAt: '2026-05-09',
  },
  {
    id: 'v055',
    title: 'AI培训课程招生翻倍增长',
    titleKo: 'AI 교육 과정 모집 두 배 증가',
    titleJa: 'AI 研修コース募集が倍増',
    titleEn: 'Some training providers see enrolments in AI courses double',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleKo: '아시아 뉴스 방송 보도',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleEn: 'CNA report',
    speakerType: 'industry',
    date: '2026-05-02',
    duration: '02:55',
    summary: '培训机构报告AI课程招生大幅增长，部分机构招生翻倍。需要加强雇主支持以将这些技能转化为工作能力。',
    summaryKo:
      '교육 기관들이 AI 과정 모집이 크게 증가했다고 보도하고 있으며, 일부 기관의 모집은 두 배 증가함. 이러한 기술을 직무 능력으로 전환하기 위해서는 고용주 지원을 강화할 필요가 있음.',
    whyItMatters: 'CNA 报道的招生翻倍是需求侧信号，但雇主端吸纳缺口未补，暴露新加坡 AI 技能转化的结构性短板',
    whyItMattersEn:
      "The doubled enrolment reported by CNA signals demand-side growth, but the employers' absorption gap remains unfilled, exposing structural shortcomings in Singapore's AI skill conversion",
    whyItMattersJa:
      'CNA報道による入学者の倍増は需要側からの信号ですが、雇用側の吸収ギャップが埋まらず、シンガポールのAIスキル変換の構造的な弱点が露出しています',
    whyItMattersKo:
      'CNA 보도에 따른 입학 두 배 증가는 수요측 신호이지만, 고용주측 수용 격차가 메워지지 않으면서 싱가포르 AI 기술 전환의 구조적 단점이 노출되었습니다.',
    summaryJa:
      '研修機関が AI コース募集の大幅な増加を報告し、一部の機関では募集が倍増している。これらのスキルを実務能力に転換するために、雇用者による支援の強化が必要である。',
    summaryEn:
      'Training providers report sharp rises in AI course enrolments, with some seeing numbers double. Stronger employer support is needed to translate AI skills into workplace capabilities.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=Th-YdvkvvpI',
    channel: 'CNA',
  },
  {
    id: 'v056',
    title: '劳动节集会：黄循财总理承诺 AI 时代的「新更好」工作',
    titleKo: '노동절 집회: 로런스 웡 총리가 약속한 AI 시대의 「새롭고 더 나은」일자리',
    titleJa: '労働節集会：黄循財首相が AI 時代の「新たにして一層良い」仕事を約束',
    titleEn: "May Day Rally: PM Wong pledges 'new and better' jobs as AI transforms Singapore's economy",
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2026-05-01',
    duration: '04:15',
    summary:
      '新加坡总理黄循财在劳动节集会上承诺在 AI 驱动的经济转型中创造更好的就业机会，同时呼吁国民学习和应用这项技术。',
    summaryKo:
      '싱가포르 총리 로런스 웡은 노동절 집회에서 AI 주도 경제 변환 속에서 더 나은 고용 기회를 창출할 것을 약속했으며, 국민들이 이 기술을 학습하고 활용할 것을 촉구했습니다.',
    whyItMatters: '黄循财以总理身份在 5 月 1 日劳动节定调 AI 转型是国家议题,但未列转岗人数或预算,承诺仍待细化',
    whyItMattersEn:
      'Lawrence Wong, in his capacity as Prime Minister, set the tone on Labour Day on May 1st that AI transformation is a national issue, but did not specify the number of job transitions or budget, leaving his commitment to be further clarified.',
    whyItMattersJa:
      'ローレンス・ウォン総理は5月1日の労働節に際して、AI転換が国家的課題であることを定調しましたが、転換人数または予算は明記されず、約束の詳細化はなお待たれます。',
    whyItMattersKo:
      '황순푸 총리가 5월 1일 노동절에 AI 전환이 국가 의제임을 기조로 제시했으나, 직무 전환 인원이나 예산을 명시하지 않아 약속이 여전히 구체화를 기다리고 있다',
    summaryJa:
      'シンガポール総理黄循財は労働節集会で、AI 駆動経済への転型の中で、より良い雇用機会を創出することを約束し、国民に対してこの技術の学習と応用を呼びかけた。',
    summaryEn:
      'Prime Minister Lawrence Wong pledges better job opportunities amid AI-driven economic transformation, while calling on Singaporeans to learn and adopt the technology.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=cRSlrDbcygw',
    channel: 'CNA',
  },
  {
    id: 'v057',
    title: '黄循财总理五一演讲：没有新加坡人会被落下',
    titleKo: '로런스 웡 총리 5월 1일 연설: 싱가포르인 누구도 뒤처지지 않을 것',
    titleJa: '黄循財首相五一演説：シンガポール人が取り残されることはない',
    titleEn: "PM Wong's May Day Rally speech: 'No Singaporean will be left behind'",
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2026-05-01',
    duration: '48:14',
    summary:
      '新加坡总理黄循财在五一劳动节大会上表示，政府虽然无法保护每个工作岗位，但会保护每个工人；计划扩大公司培训委员会应对AI转型。',
    summaryKo:
      '싱가포르 총리 로런스 웡은 5월 1일 노동절 대회에서 정부가 모든 일자리를 보호할 수는 없지만 모든 노동자를 보호할 것이라고 밝혔으며, 회사 훈련 위원회를 확대하여 AI 변환에 대응할 계획이라고 했습니다.',
    whyItMatters: '黄循财五一定调新加坡 AI 政策方向：舍保工作、保工人，公司培训委员会成为转型期唯一制度化安全网',
    whyItMattersEn:
      "Lawrence Wong set the direction of Singapore's AI policy on Labour Day: prioritizing the protection of workers over the protection of jobs, with company training committees becoming the sole institutionalized safety net during the transition period.",
    whyItMattersJa:
      'ローレンス・ウォンが五・一で新加坡のAI政策方向を定調しました：仕事は守らずに労働者を保護し、企業研修委員会が転換期の唯一の制度化されたセーフティネットになります。',
    whyItMattersKo:
      '황순푸가 5·1 정조로 싱가포르 AI 정책 방향 제시: 직업 보호 포기, 근로자 보호 선택, 기업 교육위원회가 전환기 유일한 제도화 안전망으로 기능',
    summaryJa:
      'シンガポール総理黄循財は五一労働節大会で、政府はすべての仕事を保護することはできないが、すべての労働者を保護することを表明した。また、AI 転型に対応するために公式訓練評議会の拡大を計画している。',
    summaryEn:
      'PM Lawrence Wong stated at the May Day Rally that while the Government cannot protect every job amid AI disruption, it will protect every worker by scaling up company training committees across sectors.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=dn1syFajWw0',
    channel: 'The Straits Times',
  },
  {
    id: 'v058',
    title: '跟随 AI 学徒 Jianzuo 深度技能阶段的一天',
    titleKo: 'AI 견습생 Jianzuo의 심화 기술 단계 하루를 따라가다',
    titleJa: 'AI 学徒 Jianzuo と共に深度スキル段階の一日を体験',
    titleEn: 'Follow AI Apprentice Jianzuo Through a Day in the Deep-Skilling Phase of AIAP',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2026-04-29',
    duration: '01:16',
    summary:
      '展示 AI Singapore 的 AI 学徒计划（AIAP）深度技能阶段，通过结构化培训和指导导师制，让学员掌握应用 AI 知识和 AI 工程能力。',
    summaryKo:
      'AI Singapore의 AI 견습 프로그램(AIAP) 심화 기술 단계를 선보이며, 구조화된 훈련과 지도 멘토링을 통해 학생들이 AI 지식 응용 및 AI 엔지니어링 능력을 습득할 수 있도록 합니다.',
    whyItMatters: 'AIAP 以学徒制而非学位路径培养应用型 AI 工程师，是新加坡押注实操型人才供给的关键样本',
    whyItMattersEn:
      "AIAP, through an apprenticeship model rather than degree-based pathways, trains practical AI engineers, serving as a key example of Singapore's bet on hands-on talent supply.",
    whyItMattersJa:
      'AIAPは学位コースではなく実習制度を通じて応用型のAIエンジニアを育成しており、シンガポールが実操型の人材供給に賭ける重要なサンプルです。',
    whyItMattersKo:
      'AIAP는 학위 경로가 아닌 도제 제도로 응용형 AI 엔지니어를 육성하며, 이는 싱가포르가 실무형 인재 공급에 베팅하는 핵심 사례다',
    summaryJa:
      'AI Singapore の AI 学徒計画（AIAP）の深度スキル段階を展示し、体系的な研修と指導メンターシップを通じて、学習者が AI 知識の応用と AI エンジニアリング能力を習得する方法を示す。',
    summaryEn:
      "Showcases AI Singapore's AI Apprenticeship Programme (AIAP) Deep-Skilling Phase, where apprentices gain applied AI knowledge and core AI Engineering capabilities through structured training and guided mentorship.",
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=JKsot8dxSeo',
    channel: 'AI Singapore',
  },
  {
    id: 'v053',
    title: '逾 250 名 AI 专家齐聚新加坡 共商全球测试标准',
    titleKo: '250명 이상의 AI 전문가가 싱가포르에 모여 전 세계 테스트 표준을 협의합니다.',
    titleJa: '250 名を超える AI 専門家がシンガポールに集まり、グローバルテスト標準について協議',
    titleEn: 'Over 250 AI experts gather in Singapore to set global testing standards',
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleEn: 'CNA report',
    speakerType: 'industry',
    date: '2026-04-20',
    duration: '03:46',
    summary:
      '新加坡提出的 AI 安全测试标准成为 ISO 国际会议焦点，逾 250 名来自美、中、日、韩等国的专家与会，这是该标准工作组首次在东盟举行。目前已发布或在研的 AI 标准近百项，是一年前的三倍。',
    summaryKo:
      '싱가포르가 제안한 AI 안전 테스트 표준이 ISO 국제 회의의 초점이 되었으며, 미국, 중국, 일본, 한국 등 250명 이상의 전문가가 참석했습니다. 이는 해당 표준 워킹 그룹이 ASEAN에서 처음 개최한 것입니다. 현재 발행되었거나 연구 중인 AI 표준은 거의 100개로, 1년 전의 3배입니다.',
    whyItMatters:
      'ISO AI 标准工作组首次落地东盟，新加坡主导两项标准且明年落地，标志其从规则接受者转向全球 AI 治理规则制定者',
    whyItMattersEn:
      'The ISO AI standards working group established its first presence in ASEAN, with Singapore leading two standards that will be implemented next year, marking its shift from a rule-taker to a global AI governance rule-maker.',
    whyItMattersJa:
      'ISO AIの標準作業グループが初めて東南アジア諸国連合に着地し、シンガポールが2つの標準を主導して明年導入され、ルール受容者からグローバルAIガバナンスルール制定者への転換を示しています。',
    whyItMattersKo:
      'ISO AI 표준 워킹그룹이 동남아시아에 처음 착지했고, 싱가포르가 두 가지 표준을 주도하며 내년에 시행할 예정으로, 규칙 수용자에서 글로벌 AI 거버넌스 규칙 제정자로의 전환을 표시한다',
    summaryJa:
      'シンガポールが提唱した AI セーフティテスト標準は ISO 国際会議の焦点となり、米国、中国、日本、韓国など各国から 250 名を超える専門家が参加した。これは同標準ワーキンググループが東南アジアで初めて開催された。現在発表されているか開発中の AI 標準はほぼ 100 項目であり、1 年前の 3 倍である。',
    summaryEn:
      "Singapore-proposed AI safety testing standards take centre stage at an ISO international meeting, drawing over 250 experts from the US, China, Japan, South Korea and beyond — the working group's first session in ASEAN. Nearly 100 AI standards are now published or in development, triple the count of a year ago.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스 및 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=4u0eyvFHSuI',
    channel: 'CNA',
  },
  {
    id: 'v054',
    title: '新加坡 ONE Pass 新增 AI 与科技赛道 吸引全球顶尖人才',
    titleKo: '싱가포르 ONE Pass가 AI 및 기술 트랙을 신규 추가하여 전 세계 최고 수준의 인재를 유치합니다',
    titleJa: 'シンガポール ONE Pass に AI とテクノロジートラックを新設、グローバルトップ人材を吸引',
    titleEn: "Singapore's ONE Pass adds AI and tech tracks to attract top global talent",
    speaker: 'CNA',
    speakerTitle: '亚洲新闻台报道',
    speakerTitleKo: '아시아 뉴스 채널 보도',
    speakerTitleJa: 'アジアニュース放送による報道',
    speakerTitleEn: 'CNA report',
    speakerType: 'industry',
    date: '2026-04-19',
    duration: '02:54',
    summary:
      'ONE Pass 新增 AI 与科技赛道，自 2023 年推出以来已吸引 8,000 余名专业人才。新版放宽条件、认可股权激励，初创与高成长公司更易引才。',
    summaryKo:
      'ONE Pass에 AI와 기술 트랙이 추가되었습니다. 2023년 출시 이후 8,000명 이상의 전문가 인재를 유치했습니다. 새 버전은 조건을 완화하고 주식 인센티브를 인정하여 초기 기업과 고성장 기업이 더 쉽게 인재를 영입할 수 있습니다.',
    whyItMatters: 'ONE Pass 认可股权抵扣月薪 30000 新元门槛，引才政策从大厂现金优势转向初创公司，加码全球 AI 人才争夺',
    whyItMattersEn:
      'ONE Pass recognizes equity compensation against a S$30,000 monthly salary threshold, shifting talent recruitment policy from the cash advantage of big tech companies toward startups, intensifying the competition for global AI talent.',
    whyItMattersJa:
      'ONE Passは株式で月給30,000シンガポール・ドルの閾値をオフセットすることを認可し、人材獲得政策が大手企業の現金優位からスタートアップ企業へ転換し、グローバルなAI人材争奪に加力しています。',
    whyItMattersKo:
      'ONE Pass가 월급 30,000 싱가포르 달러 기준으로 주식 보상을 월급으로 인정하면서, 인재 유치 정책이 대기업의 현금 우위에서 스타트업으로 전환하고, 글로벌 AI 인재 경쟁을 심화했다',
    summaryJa:
      'ONE Pass は AI とテクノロジートラックを新設し、2023 年の立ち上げ以来 8,000 名を超える専門人材を吸引している。新版は条件を緩和し、株式インセンティブを認知し、スタートアップと高成長企業がより容易に人材を引き付けることができるようにした。',
    summaryEn:
      'ONE Pass adds AI and tech tracks; since launching in 2023 it has drawn over 8,000 professionals. The new version relaxes criteria and recognises equity compensation, making it easier for startups and high-growth firms to attract talent.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재 및 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=PmA-WbsHVnE',
    channel: 'CNA',
  },
  {
    id: 'v001',
    title: '王乙康谈 AI、基因筛查与超老龄化新加坡的准备',
    titleKo: 'Ong Ye Kung이 AI, 유전자 검사, 초고령화 싱가포르의 준비에 대해 논의합니다',
    titleJa: '王乙康氏が AI、遺伝子スクリーニング、超高齢化シンガポールの準備について語る',
    titleEn: 'Ong Ye Kung on AI, genetic screening and preparing for a super-aged Singapore',
    speaker: 'Ong Ye Kung',
    speakerTitle: '新加坡卫生部长',
    speakerTitleKo: '싱가포르 보건부 장관',
    speakerTitleJa: 'シンガポール衛生大臣',
    speakerTitleEn: 'Minister for Health, Singapore',
    speakerType: 'government',
    date: '2026-03-04',
    duration: '30:36',
    summary: '卫生部长王乙康深入探讨 AI 在医疗保健中的应用以及新加坡应对超老龄社会的策略。',
    summaryKo:
      '보건부 장관 Ong Ye Kung이 의료 보건 분야의 AI 응용 및 초고령 사회에 대한 싱가포르의 대응 전략을 심층적으로 논의합니다.',
    whyItMatters:
      '医疗预算 2030 年将增至 300 亿元、占 GDP 3.5% 的压力下，AI 风险预测工具 2027 年起接入 Healthier SG 全体医生，预防医疗筛查从人力经验转向算法分级',
    whyItMattersEn:
      'Under pressure to increase healthcare spending to S$30 billion by 2030, accounting for 3.5% of GDP, AI risk prediction tools will be integrated with Healthier SG to reach all doctors starting in 2027, shifting preventive healthcare screening from human expertise to algorithmic triage.',
    whyItMattersJa:
      '医療予算が2030年に300億シンガポール・ドルに増加し、GDPの3.5%を占める圧力の下で、AIリスク予測ツールが2027年からHealthier SGの全医師に統合され、予防医療スクリーニングが人的経験からアルゴリズム分類へと転換します。',
    whyItMattersKo:
      '의료 예산이 2030년 300억 싱가포르 달러로 증액되고 GDP의 3.5%를 차지할 압력 속에서, AI 위험 예측 도구가 2027년부터 Healthier SG의 전체 의사에 통합되어 예방 의료 선별이 인력 경험에서 알고리즘 등급 분류로 전환한다',
    summaryJa:
      '衛生大臣王乙康は、医療におけるAIの応用および超高齢社会に対応するためのシンガポールの戦略について深く掘り下げて論じた。',
    summaryEn:
      "Health Minister Ong Ye Kung talks through AI applications in healthcare and Singapore's strategy for a super-aged society.",
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=ExrOgIkoE_A',
    channel: 'The Straits Times',
  },
  {
    id: 'v002',
    title: '新加坡国家 AI 影响计划: 支持万家企业、十万劳动者',
    titleKo: '싱가포르 국가 AI 임팩트 계획: 만 개 기업과 십만 명 근로자 지원',
    titleJa: 'シンガポール国家 AI インパクト計画：1 万社、10 万労働者を支援',
    titleEn: "Singapore's National AI Impact Plan: supporting 10,000 firms and 100,000 workers",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 뉴스 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-03-02',
    duration: '02:45',
    summary: '杨莉明部长宣布国家 AI 影响计划,目标在 2029 年前培训 10 万名 AI 人才并支持 1 万家企业。',
    summaryKo:
      'Josephine Teo 장관이 국가 AI 임팩트 계획을 발표했습니다. 목표는 2029년 전까지 100,000명의 AI 인재를 교육하고 10,000개 기업을 지원하는 것입니다.',
    whyItMatters:
      '新加坡把 AI 战略重心从培养工程师转向全民双语，2029 年前以 10000 家企业、100000 人为目标，考验政策能否规模化',
    whyItMattersEn:
      'Singapore is shifting the focus of its AI strategy from training engineers to digital literacy for the entire population, with targets of 10,000 enterprises and 100,000 people by 2029, testing whether the policy can scale.',
    whyItMattersJa:
      'シンガポールはAI戦略の重心をエンジニア育成から国民全体のバイリンガリズムへ転向させ、2029年までに10,000社および100,000人を目標とし、政策のスケーリング可能性をテストしています。',
    whyItMattersKo:
      '싱가포르가 AI 전략의 무게중심을 엔지니어 양성에서 전국민 이중 언어로 이동하면서, 2029년 전에 10,000개 기업, 100,000명을 목표로 정책의 규모화 가능 여부를 시험한다',
    summaryJa:
      '楊莉明大臣は国家 AI インパクト計画を発表し、2029 年までに 10 万名の AI 人材を育成し、1 万社の企業を支援することを目標とした。',
    summaryEn:
      'Minister Josephine Teo announces the National AI Impact Plan, targeting training of 100,000 AI professionals and support for 10,000 firms by 2029.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재 및 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=HcA5d8MaCHI',
    channel: 'CNA',
  },
  {
    id: 'v003',
    title: '人工智能成为新韩合作共同增长引擎',
    titleKo: '인공지능이 싱가포르-한국 협력의 공동 성장 엔진이 되다',
    titleJa: '人工知能がシンガポール・韓国協力の共同成長エンジンに',
    titleEn: 'AI becomes a shared growth engine for Singapore-South Korea cooperation',
    speaker: 'Vivian Balakrishnan',
    speakerTitle: '新加坡外交部长',
    speakerTitleKo: '싱가포르 외교 장관',
    speakerTitleJa: 'シンガポール外交大臣',
    speakerTitleEn: 'Minister for Foreign Affairs, Singapore',
    speakerType: 'government',
    date: '2026-03-02',
    duration: '15:35',
    summary: '新韩 AI 连接峰会上,两国宣布 3 亿美元 AI 合作伙伴关系,共同推进 AI 研发与产业落地。',
    summaryKo:
      '싱가포르-한국 AI 연결 정상회담에서 양국은 3억 달러 규모의 AI 파트너십을 발표했으며, AI 연구 개발과 산업 상용화를 공동 추진하기로 합니다.',
    whyItMatters:
      '新加坡不追前沿大模型军备赛，靠国家 AI 委员会牵头、引入韩国 3 亿美元基金撬动 10 亿新元投入，押注部署与标准话语权',
    whyItMattersEn:
      'Singapore is not chasing the frontier large language model arms race; instead, led by the National AI Committee and leveraging a US$300 million fund from Korea to unlock S$1 billion in investment, it is betting on deployment capabilities and influence over standards.',
    whyItMattersJa:
      'シンガポールは先端的大規模モデルの軍備競争を追求せず、国家AI委員会のリードにより、韓国の3億米ドルの基金を導入して10億シンガポール・ドルの投入を動かし、展開と標準に関する発言権に賭けています。',
    whyItMattersKo:
      '싱가포르가 최첨단 대규모 모델 무장 경쟁을 추구하지 않으며, 국가 AI 위원회가 주도하고 한국의 3억 달러 기금을 도입하여 10억 싱가포르 달러 투자를 레버리지하면서, 배포와 표준 주도권에 베팅한다',
    summaryJa:
      'シンガポール・韓国 AI コネクションサミットで、両国は 3 億ドルの AI パートナーシップを発表し、AI 研究開発と産業応用を共同推進する。',
    summaryEn:
      'At the Singapore-South Korea AI Connectivity Summit, the two countries announce a US$300 million AI partnership to jointly advance AI R&D and industrial deployment.',
    topic: '国际合作与对标',
    topicKo: '국제 협력과 벤치마크',
    topicJa: '国際協力とベンチマーク',
    topicEn: 'International Cooperation & Benchmarking',
    youtubeUrl: 'https://www.youtube.com/watch?v=5ls9OtznVBc',
    channel: 'CNA',
  },
  {
    id: 'v004',
    title: '杨莉明呼吁各国主动应对代理型 AI 治理风险',
    titleKo: '양리밍이 각국에 에이전트형 AI 거버넌스 위험에 적극 대응할 것을 호소하다',
    titleJa: '楊莉明大臣、各国に対して代理型 AI ガバナンスリスクへの主動的な対応を呼びかけ',
    titleEn: 'Josephine Teo urges nations to proactively address agentic AI governance risks',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 언론 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-02-20',
    duration: '05:12',
    summary: '杨莉明在世界经济论坛发布全球首个代理型 AI 治理框架,呼吁各国积极制定 AI 治理规则。',
    summaryKo:
      '양리밍이 세계경제포럼에서 글로벌 최초 에이전트형 AI 거버넌스 프레임워크를 발표하며 각국이 적극적으로 AI 거버넌스 규칙을 제정할 것을 호소했습니다.',
    whyItMatters:
      '在德里 AI 峰会上，杨莉明罕见承认监管解决不了 AI 冲击下的社会不平等，暗示新加坡下一步要在职业转换、住房、医疗等领域加码投入',
    whyItMattersEn:
      "At the AI summit in Delhi, Josephine Teo rarely admitted that regulation alone cannot solve social inequality under AI's impact, hinting that Singapore's next step will be to increase investment in vocational transition, housing, healthcare, and other sectors.",
    whyItMattersJa:
      'デリーのAIサミットで、ジョセフィン・テオが規制がAIの影響下での社会不平等を解決できないことを稀に認め、シンガポールが職業転換、住宅、医療などの領域での投資増加を次のステップとすることを暗示しました。',
    whyItMattersKo:
      '델리 AI 정상회담에서 양릿밍이 규제가 AI 충격 하의 사회 불평등을 해결할 수 없음을 드물게 인정하면서, 싱가포르가 다음 단계에서 직업 전환, 주택, 의료 등 분야에서 투자를 심화할 것임을 암시한다',
    summaryJa:
      '楊莉明は世界経済フォーラムで世界初の代理型 AI ガバナンスフレームワークを発表し、各国に対して積極的に AI ガバナンス規則を制定するよう呼びかけた。',
    summaryEn:
      "At the World Economic Forum, Josephine Teo unveils the world's first agentic AI governance framework and calls on nations to proactively shape AI governance rules.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=iblHEQPjFB0',
    channel: 'CNA',
  },
  {
    id: 'v005',
    title: '2026 财政预算案: AI 与就业的大力推进',
    titleKo: '2026 재정 예산안: AI와 고용의 강력한 추진',
    titleJa: '2026 年財政予算案：AI と雇用の大きな推進',
    titleEn: 'Budget 2026: a strong push on AI and jobs',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2026-02-12',
    duration: '27:01',
    summary: 'CNA 深度解读预算案中 AI 相关举措,包括国家 AI 委员会、AI 税收优惠和劳动力转型。',
    summaryKo:
      'CNA가 예산안 중 AI 관련 조치를 심층 분석하며, 국가 AI 위원회, AI 세금 인센티브 및 노동력 전환을 다룹니다.',
    whyItMatters:
      '黄循财总理亲自出任国家 AI 委员会主席，并将 AI 补贴与岗位质量挂钩，标志着 AI 治理从产业补贴转向就业保障',
    whyItMattersEn:
      'Prime Minister Lawrence Wong personally assumes the chair of the National AI Committee and ties AI subsidies to job quality, marking a shift in AI governance from industry subsidies to employment protection.',
    whyItMattersJa:
      'ローレンス・ウォン総理が国家AI委員会の議長に自ら就任し、AI補助金を職位の品質と連動させ、AIガバナンスが産業補助金から雇用保障への転換を示しています。',
    whyItMattersKo:
      '황순푸 총리가 직접 국가 AI 위원회 의장을 맡고, AI 보조금을 일자리 품질과 연계하면서, AI 거버넌스가 산업 보조금에서 고용 보장으로 전환됨을 표시한다',
    summaryJa: 'CNA は予算案における AI 関連措置を詳細に解説し、国家 AI 委員会、AI 税額控除、労働力転型などを含む。',
    summaryEn:
      "CNA's in-depth read of AI-related Budget measures, including the National AI Council, AI tax incentives and workforce transformation.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=7y6F40CQ5UY',
    channel: 'CNA',
  },
  {
    id: 'v006',
    title: '黄循财总理 2026 财政预算案全文演讲',
    titleKo: '로런스 웡 총리 2026 재정 예산안 전문 연설',
    titleJa: '黄循財首相 2026 年財政予算案全文演説',
    titleEn: "PM Lawrence Wong's full Budget 2026 speech",
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2026-02-12',
    duration: '90:19',
    summary: '黄循财总理发表预算案演讲,AI 成为核心主题,宣布设立国家 AI 委员会并亲自担任主席。',
    summaryKo:
      '로런스 웡 총리가 예산안 연설에서 AI가 핵심 주제가 되었으며, 국가 AI 위원회 설립을 선언하고 직접 의장을 맡기로 했습니다.',
    whyItMatters: '总理亲自挂帅国家 AI 委员会，标志 AI 治理升至元首级，也与 EP 门槛升至 6000 新元的外劳收紧形成对照',
    whyItMattersEn:
      'The Prime Minister personally leads the National AI Committee, marking AI governance elevated to the presidential level, contrasting with the tightening of foreign worker policies as the EP (Employment Pass) threshold rises to S$6,000.',
    whyItMattersJa:
      '総理が国家AI委員会を自ら指導し、AIガバナンスが首脳級に昇格することを示しており、EP閾値が6,000シンガポール・ドルに上昇して外国人労働者受け入れが厳格化していることと対照をなしています。',
    whyItMattersKo:
      '총리가 직접 국가 AI 위원회를 주도하면서, AI 거버넌스가 원수급으로 상향되고, EP 기준이 6,000 싱가포르 달러로 상향된 외국 근로자 수용 강화와 대조를 이룬다',
    summaryJa:
      '黄循財首相が予算案演説を発表し、AI が核心テーマとなり、国家 AI 委員会の設立と自らが委員長を務めることを宣言した。',
    summaryEn:
      'PM Lawrence Wong delivers the Budget speech with AI as a core theme, announcing the establishment of the National AI Council, which he will personally chair.',
    topicIds: ['national-strategy', 'advanced-manufacturing', 'connectivity', 'finance', 'healthcare'],
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=0tJKxkh9iFU',
    channel: 'govsg',
  },
  {
    id: 'v007',
    title: '新加坡对 AI 的看法已经转变: 杨莉明专访',
    titleKo: '싱가포르의 AI에 대한 입장이 변했습니다: 양리밍 전문 인터뷰',
    titleJa: 'シンガポールの AI に対する見方は変わった：楊莉明大臣インタビュー',
    titleEn: "Singapore's view of AI has shifted: Josephine Teo interview",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 언론 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-02-11',
    duration: '22:15',
    summary: '杨莉明详述新加坡 AI 战略转型,从谨慎观望到全力拥抱,阐述政府如何系统性推动 AI 应用。',
    summaryKo:
      '양리밍이 싱가포르 AI 전략 전환을 상세히 설명하며, 신중한 관망에서 전폭적 수용으로의 변화, 그리고 정부가 어떻게 체계적으로 AI 응용을 추진하는지를 해설합니다.',
    whyItMatters:
      '公务员自建机器人已逾 3 万个，但企业 IKEA 时刻未至，暴露新加坡 AI 战略正从推广工具转向认证聚合者这一新支点',
    whyItMattersEn:
      'The civil service has already built over 30,000 robots, but the corporate "IKEA moment" has not yet arrived, revealing that Singapore\'s AI strategy is shifting from tool promotion to certified aggregator, a new pivot point.',
    whyItMattersJa:
      '公務員が自分で構築したロボットが既に3万を超えていますが、企業のIKEAモーメントはまだ来ておらず、シンガポールのAI戦略がツール推進から認証アグリゲーターというこの新しい支点へ転向していることを露呈しています。',
    whyItMattersKo:
      '공무원이 자체 구축한 로봇이 이미 30,000개를 넘었으나, 기업 차원의 IKEA 모멘트는 아직 도래하지 않았으며, 싱가포르 AI 전략이 도구 홍보에서 인증 통합자라는 새로운 전략적 지렛대로 전환 중임을 드러낸다',
    summaryJa:
      '楊莉明は、シンガポール AI 戦略の転型を詳述し、慎重な観察から全力の拥抱へと移行し、政府がいかに体系的に AI 応用を推し進めるかを阐述した。',
    summaryEn:
      "Josephine Teo details Singapore's AI strategic shift — from cautious observation to full embrace — and how the government systematically drives AI adoption.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=2q3XOqL_miU',
    channel: 'The Straits Times',
  },
  {
    id: 'v008',
    title: '杨莉明谈新加坡国家 AI 战略',
    titleKo: '양리밍이 말하는 싱가포르 국가 AI 전략',
    titleJa: '楊莉明、シンガポール国家 AI 戦略について語る',
    titleEn: "Josephine Teo on Singapore's national AI strategy",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 언론 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-02-10',
    duration: '14:52',
    summary: '杨莉明全面介绍新加坡国家 AI 战略,涵盖人才培养、产业应用和国际合作三大支柱。',
    summaryKo:
      '양리밍이 싱가포르 국가 AI 전략을 종합적으로 소개하며, 인재 양성, 산업 응용 및 국제 협력의 세 가지 주요 기둥을 다룹니다.',
    whyItMatters:
      '总理预算演讲揭晓 AI 新举措前 48 小时定调，新加坡拟借 2027 年东盟主席国身份向区域输出这套数字发展框架',
    whyItMattersEn:
      'The Prime Minister sets the tone 48 hours before revealing AI initiatives in the budget speech, with Singapore preparing to export this digital development framework to the region leveraging its ASEAN presidency in 2027.',
    whyItMattersJa:
      '総理の予算演説でAI新施策が発表される48時間前にトーン設定され、シンガポールは2027年のASEAN議長国の身分を借りてこのデジタル開発フレームワークを地域に輸出することを計画しています。',
    whyItMattersKo:
      '총리 예산 연설이 AI 신규 조치를 공개하기 48시간 전에 기조를 설정했으며, 싱가포르가 2027년 동남아시아연합 의장국 신분을 활용하여 이 디지털 발전 체계를 지역에 수출할 예정이다',
    summaryJa: '楊莉明はシンガポール国家 AI 戦略を包括的に紹介し、人材育成、産業応用、国際協力の 3 つの柱を網羅した。',
    summaryEn:
      "Josephine Teo walks through Singapore's national AI strategy across three pillars: talent, industry, and international cooperation.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=v69BoHQ0LOE',
    channel: 'Mothership',
  },
  {
    id: 'v009',
    title: '为何新加坡视 AI 为机遇而非威胁',
    titleKo: '싱가포르가 AI를 위협이 아닌 기회로 보는 이유',
    titleJa: 'なぜシンガポールは AI を脅威ではなく機会と見なすのか',
    titleEn: 'Why Singapore sees AI as opportunity rather than threat',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2026-02-03',
    duration: '03:49',
    summary: '尚达曼总统在达沃斯接受 Ian Bremmer 专访,阐述新加坡为何将 AI 视为劳动者的助力而非威胁。',
    summaryKo:
      '상달만 대통령이 다보스에서 Ian Bremmer의 전문 인터뷰에 응하며, 싱가포르가 AI를 노동자를 위한 도움으로 여기고 위협으로 여기지 않는 이유를 설명합니다.',
    whyItMatters: '尚达曼把新加坡 60% 的 AI 普及率变成分配能力的检验场，结果将成为同类小型开放经济体的参照',
    whyItMattersEn:
      "Tharman Shanmugaratnam transforms Singapore's 60% AI adoption rate into a testing ground for distribution capacity, with the results to serve as a reference point for similar small open economies.",
    whyItMattersJa:
      'タルマン・シャンムガラトナムはシンガポールの60%のAI普及率を配分能力のテストベッドに転換させ、その結果が同様の小型開放経済体のリファレンスになるでしょう。',
    whyItMattersKo:
      '상달만이 싱가포르의 60% AI 보급률을 분배 능력 검증장으로 전환하면서, 결과가 유사한 소규모 개방형 경제체의 참조가 될 것이다',
    summaryJa:
      '尚達曼大統領はダボスで Ian Bremmer のインタビューを受け、シンガポールがなぜ AI を労働者の支援ツールではなく脅威と見なさないのかを説明した。',
    summaryEn:
      'President Tharman Shanmugaratnam, in a Davos interview with Ian Bremmer, explains why Singapore views AI as an aid to workers rather than a threat.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=z3zMYQasDCc',
    channel: 'GZERO Media',
  },
  {
    id: 'v010',
    title: '新加坡如何在碎片化世界中航行',
    titleKo: '싱가포르가 파편화된 세계에서 어떻게 항해하는가',
    titleJa: 'シンガポールは分断化された世界をいかに航行するのか',
    titleEn: 'How Singapore navigates a fragmented world',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2026-02-02',
    duration: '23:25',
    summary: '尚达曼总统与 Ian Bremmer 深入对谈 AI、全球秩序重塑及新加坡的应对战略。',
    summaryKo:
      '상달만 대통령과 Ian Bremmer가 AI, 글로벌 질서 재편 및 싱가포르의 대응 전략에 대해 심도 있게 대담합니다.',
    whyItMatters: '尚达曼把新加坡 60% 的 AI 普及率变成外交筹码,主张规则真空期小国应主动结盟,而非坐等大国定调',
    whyItMattersEn:
      "Tharman Shanmugaratnam leverages Singapore's 60% AI adoption rate as diplomatic leverage, arguing that small nations during a regulatory vacuum should actively form alliances rather than await larger powers' decisions.",
    whyItMattersJa:
      'タルマン・シャンムガラトナムはシンガポールの60%のAI普及率を外交カードに転換させ、ルール空白期に小国は主動的に同盟を結ぶべきであり、大国の定調を待つべきではないと主張しています。',
    whyItMattersKo:
      '상달만이 싱가포르의 60% AI 보급률을 외교적 지렛대로 전환하면서, 규칙 공백 기간에 소국이 적극 동맹을 결성해야 하고 대국의 기조 설정을 기다리지 말아야 한다고 주장한다',
    summaryJa:
      '尚達曼大統領は Ian Bremmer と深く対談し、AI、世界秩序の再構築およびシンガポールの対応戦略について議論した。',
    summaryEn:
      "President Tharman Shanmugaratnam in an in-depth conversation with Ian Bremmer on AI, the reshaping of global order, and Singapore's response strategy.",
    topic: '国际合作与对标',
    topicKo: '국제 협력과 벤치마크',
    topicJa: '国際協力とベンチマーク',
    topicEn: 'International Cooperation & Benchmarking',
    youtubeUrl: 'https://www.youtube.com/watch?v=04lklCautxI',
    channel: 'GZERO Media',
  },
  {
    id: 'v011',
    title: '新加坡将比多数国家更快面对 AI 挑战',
    titleKo: '싱가포르는 대다수 국가보다 더 빨리 AI 도전에 직면할 것입니다',
    titleJa: 'シンガポールはほとんどの国よりも早く AI チャレンジに直面するであろう',
    titleEn: 'Singapore will face the AI challenge sooner than most countries',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2026-02-01',
    duration: '01:29',
    summary: '尚达曼总统指出新加坡因开放程度和经济结构,将比其他国家更快感受到 AI 的全面冲击。',
    summaryKo:
      '상달만 대통령은 싱가포르가 개방 정도와 경제 구조로 인해 다른 국가들보다 AI의 전면적 영향을 더 빨리 체감할 것이라고 지적합니다.',
    whyItMatters: '尚达曼 2026 年达沃斯讲话定调:新加坡 AI 战略应优先解决红利分配,而非单纯比拼竞速',
    whyItMattersEn:
      "In his 2026 Davos speech, Tharman Shanmugaratnam set the tone: Singapore's AI strategy should prioritize resolving the distribution of gains, rather than merely competing on speed.",
    whyItMattersJa:
      'タルマン・シャンムガラトナムは2026年のダボス講演でトーン設定しました：シンガポールのAI戦略は利益配分の解決を優先させるべきであり、単なるスピード競争ではないと。',
    whyItMattersKo:
      '상달만의 2026년 다보스 연설 기조: 싱가포르 AI 전략이 수익 분배 해결을 우선시해야 하며, 단순한 속도 경쟁에만 몰두해서는 안 된다',
    summaryJa:
      '尚達曼大統領は、シンガポールは開放度と経済構造のため、他国より早く AI の包括的な影響を感じるであろうと指摘した。',
    summaryEn:
      "President Tharman Shanmugaratnam argues that, given its openness and economic structure, Singapore will feel AI's full impact sooner than other countries.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=hKcA49D2HGA',
    channel: 'CNA',
  },
  {
    id: 'v012',
    title: '尚达曼总统 GZERO World 完整专访',
    titleKo: '상달만 대통령 GZERO World 완전 인터뷰',
    titleJa: '尚達曼大統領 GZERO World 完全インタビュー',
    titleEn: 'President Tharman: full GZERO World interview',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2026-01-31',
    duration: '21:28',
    summary: '尚达曼总统全面阐述新加坡在 AI 时代的全球定位、劳动力转型策略和大国博弈中的角色。',
    summaryKo:
      '상달만 대통령이 AI 시대 싱가포르의 글로벌 위상, 노동력 전환 전략, 강대국 경쟁에서의 역할을 전면적으로 설명합니다.',
    whyItMatters: '美中科研直接对话已罕见，新加坡靠 2024 年 AI 大会聚拢 100 多名中国科学家，树立中立小国的稀缺先例',
    whyItMattersEn:
      'Direct dialogue between US and Chinese researchers has become rare, with Singapore bringing together over 100 Chinese scientists through its 2024 AI conference, establishing a rare precedent for a neutral small nation.',
    whyItMattersJa:
      '米中の科学研究における直接対話は既に稀になっており、シンガポールは2024年のAIカンファレンスで100人以上の中国科学者を集め、中立的小国の稀な先例を樹立しました。',
    whyItMattersKo:
      '미중 과학 연구 직접 대화가 이미 드물어졌으며, 싱가포르가 2024년 AI 대회를 통해 100명 이상의 중국 과학자를 집결시켜 중립 소국의 드문 선례를 수립했다',
    summaryJa:
      '尚達曼大統領は、AI 時代のシンガポールのグローバルな位置付け、労働力転型戦略、大国競争における役割を包括的に説明した。',
    summaryEn:
      "President Tharman Shanmugaratnam lays out Singapore's global positioning in the AI era, its workforce transformation strategy and its role amid great-power rivalry.",
    topic: '国际合作与对标',
    topicKo: '국제 협력과 벤치마크',
    topicJa: '国際協力とベンチマーク',
    topicEn: 'International Cooperation & Benchmarking',
    youtubeUrl: 'https://www.youtube.com/watch?v=wibU2_v9Wro',
    channel: 'GZERO Media',
  },
  {
    id: 'v013',
    title: '新加坡发布全球首个代理型 AI 治理框架',
    titleKo: '싱가포르, 전 세계 최초의 에이전트 AI 거버넌스 프레임워크 공개',
    titleJa: 'シンガポール、グローバル初の代理型 AI ガバナンスフレームワークを発表',
    titleEn: "Singapore releases the world's first agentic AI governance framework",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 개발 및 뉴스 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-01-22',
    duration: '08:19',
    summary: 'IMDA 在世界经济论坛上推出全球首个代理型 AI 治理框架,为自主 AI 系统建立部署规范。',
    summaryKo:
      'IMDA가 세계경제포럼에서 전 세계 최초의 에이전트 AI 거버넌스 프레임워크를 공개하고 자율 AI 시스템을 위한 배포 규범을 수립합니다.',
    whyItMatters: '新加坡趁全球监管空白,以 IMDA 非强制框架率先卡位代理型 AI 治理标准制定权',
    whyItMattersEn:
      "Singapore seizes the global regulatory vacuum, taking the lead with IMDA's non-binding framework to claim a position in setting standards for agentic AI governance.",
    whyItMattersJa:
      'シンガポールはグローバル規制の空白に乗じて、IMDAの非強制フレームワークでエージェント型AIガバナンス標準制定権を率先して確保しています。',
    whyItMattersKo:
      '싱가포르가 전 지구적 규제 공백을 틈타 IMDA 비강제 체계로 에이전트형 AI 거버넌스 표준 제정권을 선점한다',
    summaryJa:
      'IMDA は世界経済フォーラムでグローバル初の代理型 AI ガバナンスフレームワークを発表し、自主 AI システムの展開規範を確立した。',
    summaryEn:
      "IMDA launches the world's first agentic AI governance framework at the World Economic Forum, establishing deployment norms for autonomous AI systems.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스 및 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=V_OEfgtzJFg',
    channel: 'CNA',
  },
  {
    id: 'v014',
    title: '杨莉明在彭博新经济论坛谈 AI',
    titleKo: '양리밍, 블룸버그 신경제포럼에서 AI 논의',
    titleJa: '楊莉明、ブルームバーグ新経済フォーラムで AI について語る',
    titleEn: 'Josephine Teo on AI at the Bloomberg New Economy Forum',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 개발 및 뉴스 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-11-19',
    duration: '27:26',
    summary: '杨莉明在彭博新经济论坛全面讨论新加坡 AI 战略、人才培养和全球治理合作。',
    summaryKo:
      '양리밍이 블룸버그 신경제포럼에서 싱가포르 AI 전략, 인재 양성 및 글로벌 거버넌스 협력을 전면적으로 논의합니다.',
    whyItMatters: '杨莉明摆明新加坡放弃全栈自建,以 99% GDP 由 SME 撑起为由,把能力建设定为国策,而非卷模型军备赛',
    whyItMattersEn:
      'Josephine Teo makes clear that Singapore is abandoning full-stack self-sufficiency, justifying with the fact that 99% of GDP is supported by SMEs, making capability building national policy rather than engaging in the model arms race.',
    whyItMattersJa:
      'ジョセフィン・テオがシンガポールがフルスタック自建を放棄することを明確にし、GDPの99%がSMEに支えられていることを理由に、能力構築を国策として定め、モデル軍備競争には巻き込まれていないと示しています。',
    whyItMattersKo:
      '양릿밍이 싱가포르가 전체 스택 자체 구축을 포기했음을 명확히 하고, GDP의 99%가 중소기업으로 지탱된다는 이유로, 역량 구축을 국책으로 설정했으며, 모델 무장 경쟁에는 뛰어들지 않는다',
    summaryJa:
      '楊莉明はブルームバーグ新経済フォーラムでシンガポール AI 戦略、人材育成およびグローバルガバナンス協力について包括的に論じた。',
    summaryEn:
      "At the Bloomberg New Economy Forum, Josephine Teo discusses Singapore's AI strategy, talent development and global governance cooperation.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=S5NeniPvDjU',
    channel: 'The Straits Times',
  },
  {
    id: 'v015',
    title: '杨莉明谈 AI 在中小企业、教育和社会中的角色',
    titleKo: '양리밍, 중소기업・교육・사회에서 AI의 역할 논의',
    titleJa: '楊莉明、AI の中小企業、教育および社会における役割について語る',
    titleEn: "Josephine Teo on AI's role in SMEs, education and society",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 개발 및 뉴스 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-11-19',
    duration: '06:17',
    summary: '杨莉明探讨 AI 如何赋能中小企业转型、重塑教育体系并惠及社会各阶层。',
    summaryKo:
      '양리밍이 AI가 어떻게 중소기업 전환을 촉진하고 교육 체계를 재구성하며 사회 전 계층에 이익을 제공하는지 탐색합니다.',
    whyItMatters:
      '制造业占新加坡 GDP 约 20%，新设制造业 AI 卓越中心把资源押注这一支柱产业，显示战略从通用赋能话术转向具体行业基建',
    whyItMattersEn:
      "Manufacturing accounts for approximately 20% of Singapore's GDP; the newly established Manufacturing AI Centre of Excellence stakes resources on this pillar industry, showing a shift in strategy from generic empowerment rhetoric to concrete sectoral infrastructure.",
    whyItMattersJa:
      '製造業がシンガポールのGDPの約20%を占める中、新たに設置された製造業AIセンターオブエクセレンスは資源をこの柱産業に賭け、戦略が汎用的エンパワーメント・レトリックから具体的産業インフラへの転換を示しています。',
    whyItMattersKo:
      '제조업이 싱가포르 GDP의 약 20%를 차지하며, 신설 제조업 AI 우수 센터가 이 기둥 산업에 자원을 베팅하면서, 전략이 일반형 역량 강화 수사에서 구체적 산업 인프라로 전환됨을 드러낸다',
    summaryJa:
      '楊莉明は、AI がいかに中小企業の転型を支援し、教育体系を再構築し、社会のあらゆる層に利益をもたらすかについて探究する。',
    summaryEn: 'Josephine Teo on how AI can help SMEs transform, reshape education, and reach every part of society.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=W2lLMv3CfaA',
    channel: 'The Business Times',
  },
  {
    id: 'v016',
    title: '尚达曼总统 ICCS 2025 演讲',
    titleKo: '상달만 대통령 ICCS 2025 연설',
    titleJa: '尚達曼大統領 ICCS 2025 演説',
    titleEn: "President Tharman's ICCS 2025 keynote",
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2025-11-17',
    duration: '29:51',
    summary: '尚达曼在国际网络安全周发表主旨演讲,讨论代理型 AI 和量子计算带来的安全挑战。',
    summaryKo:
      '상달만이 국제 사이버보안 주간에서 기조 연설을 발표하고 에이전트 AI와 양자 컴퓨팅이 초래하는 보안 과제를 논의합니다.',
    whyItMatters: '总统尚达曼在 ICCS 2025 演讲把 AI 算法放大列为社会分裂推手并为新加坡跟进欧盟数字服务法收紧监管定调',
    whyItMattersEn:
      'President Tharman Shanmugaratnam in his ICCS 2025 speech identifies AI algorithm amplification as a driver of social division and sets the tone for Singapore to follow the EU Digital Services Act in tightening regulation.',
    whyItMattersJa:
      '大統領のタルマン・シャンムガラトナムはICCS 2025の講演でAIアルゴリズムの増幅を社会分裂のドライバーとして位置付け、シンガポールがEUのデジタルサービス法に従って規制を強化することを定調しました。',
    whyItMattersKo:
      '대통령 상달만이 ICCS 2025 연설에서 AI 알고리즘 증폭을 사회 분열의 원인으로 나열하고 싱가포르가 유럽연합의 디지털 서비스법을 따라 규제를 강화할 것임을 기조로 설정했다',
    summaryJa:
      '尚達曼は国際サイバーセキュリティウィークで基調演説を行い、代理型 AI と量子コンピューティングがもたらすセキュリティチャレンジについて論じた。',
    summaryEn:
      'President Tharman Shanmugaratnam delivers a keynote at the International Cyber Conference Singapore (ICCS), addressing security challenges posed by agentic AI and quantum computing.',
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스 및 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=-8QS4cdRTus',
    channel: 'Tharman Shanmugaratnam',
  },
  {
    id: 'v017',
    title: 'LKY 公共政策学院: 工作、AI 与公共政策的角色',
    titleKo: 'LKY 공공정책대학원: 일자리, AI 및 공공정책의 역할',
    titleJa: '李光耀公共政策学院：仕事、AI および公共政策の役割',
    titleEn: 'LKY School of Public Policy: work, AI and the role of public policy',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 개발 및 뉴스 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-10-30',
    duration: '29:38',
    summary: '杨莉明在李光耀公共政策学院深度探讨 AI 时代的就业变革与公共政策应对。',
    summaryKo: '양리밍이 이광요우 공공정책대학원에서 AI 시대의 고용 변화와 공공정책 대응을 깊이 있게 탐색합니다.',
    whyItMatters: '当政策智库开始拿 25% 使用率说事，意味着 AI 战略 2.0 的短板已从设计转向执行落地',
    whyItMattersEn:
      'When policy think tanks begin citing a 25% adoption rate, it signals that the shortfall of AI Strategy 2.0 has shifted from design to implementation and deployment.',
    whyItMattersJa:
      '政策シンクタンクが25%の利用率について言及し始めたことは、AI戦略2.0の弱点が設計から実行・着地へシフトしたことを意味しています。',
    whyItMattersKo:
      '정책 싱크탱크가 25% 사용률로 말하기 시작했을 때, 이는 AI 전략 2.0의 약점이 설계에서 실행 구현으로 이동했음을 의미한다',
    summaryJa: '楊莉明は李光耀公共政策学院で、AI 時代の雇用変革と公共政策対応について深く探究した。',
    summaryEn:
      'At the Lee Kuan Yew School of Public Policy, Josephine Teo digs into how AI is shifting employment and what public policy should do about it.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=OEaCDyKvGRw',
    channel: 'Lee Kuan Yew School of Public Policy',
  },
  {
    id: 'v018',
    title: '黄循财总理接受英国金融时报专访',
    titleKo: '로런스 웡 총리, 영국 파이낸셜 타임스 전담 인터뷰',
    titleJa: '黄循財首相、英国フィナンシャル・タイムズ紙のインタビューを受ける',
    titleEn: 'PM Lawrence Wong interviewed by the Financial Times',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2025-10-22',
    duration: '27:44',
    summary: '黄循财在金融时报专访中讨论后美国秩序下的全球格局,包括 AI 对新加坡经济的战略意义。',
    summaryKo:
      '로런스 웡이 파이낸셜타임스 인터뷰에서 미국 이후 질서 속 글로벌 환경과 AI가 싱가포르 경제에 가진 전략적 의의를 논의합니다.',
    whyItMatters:
      '黄循财松口允许美方在新加坡调查涉芯片企业,以保住美企 500 亿美元数字基建投资,为新加坡在 AI 芯片管控中选择配合而非中立划下先例',
    whyItMattersEn:
      "Lawrence Wong yields to allow the US to investigate chip-related enterprises in Singapore, preserving US companies' US$50 billion digital infrastructure investment, setting a precedent for Singapore to choose cooperation over neutrality in AI chip controls.",
    whyItMattersJa:
      'ローレンス・ウォンが米国がシンガポール国内でチップ関連企業の調査を行うことを認める意向を示し、米国企業の500億米ドルのデジタルインフラ投資を確保するため、シンガポールがAIチップ管理における協力を選択し、中立ではなく先例を確立しました。',
    whyItMattersKo:
      '황순푸가 미국이 싱가포르에서 반도체 관련 기업을 조사하도록 허용했으며, 미국 기업의 500억 달러 디지털 기반시설 투자를 보호하기 위해, AI 반도체 통제에서 싱가포르가 협력을 선택하고 중립을 포기함을 처음 선례로 설정했다',
    summaryJa:
      '黄循財はフィナンシャル・タイムズ紙のインタビューで、米国後の世界秩序およびシンガポール経済に対する AI の戦略的意義を含む、グローバル状況について論じた。',
    summaryEn:
      "In an FT interview, Lawrence Wong discusses the global order in a post-American era, including AI's strategic significance for Singapore's economy.",
    topic: '国际合作与对标',
    topicKo: '국제 협력과 벤치마크',
    topicJa: '国際協力とベンチマーク',
    topicEn: 'International Cooperation & Benchmarking',
    youtubeUrl: 'https://www.youtube.com/watch?v=NXSI4cCm3BM',
    channel: 'Financial Times',
  },
  {
    id: 'v019',
    title: '杨莉明在 CNBC 谈新加坡大胆的 AI 推进',
    titleKo: '양리밍, CNBC에서 싱가포르의 대담한 AI 추진에 대해 언급',
    titleJa: '楊莉明、CNBC でシンガポールの大胆な AI 推進について語る',
    titleEn: "Josephine Teo on CNBC: Singapore's bold AI push",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털개발·정보부 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-04-01',
    duration: '30:00',
    summary: '杨莉明在 CNBC Converge Live 活动上讨论新加坡 AI 战略、风险管控和人才培养。',
    summaryKo: '양리밍이 CNBC Converge Live 행사에서 싱가포르 AI 전략, 위험 관리 및 인재 양성에 대해 논의했습니다.',
    whyItMatters: '樟宜机场类比让新加坡官方放弃自研前沿模型竞赛,转而押注 500 亿美元基建撑起的枢纽定位',
    whyItMattersEn:
      "The Changi Airport analogy caused Singapore's authorities to abandon competing in frontier model development, instead betting on a hub position supported by US$50 billion in infrastructure.",
    whyItMattersJa:
      'チャンギ空港の類比がシンガポール官方が先端的モデル開発競争を放棄させ、500億米ドルのインフラに支えられたハブとしてのポジショニングに賭けさせました。',
    whyItMattersKo:
      '창이 공항 유추가 싱가포르 관계자를 자체 최첨단 모델 경쟁 포기로 이끌고, 500억 달러 기반시설이 받치는 허브 정위에 베팅하도록 전환했다',
    summaryJa: '楊莉明は CNBC Converge Live イベントでシンガポール AI 戦略、リスク管理および人材育成について論じた。',
    summaryEn:
      "At CNBC Converge Live, Josephine Teo discusses Singapore's AI strategy, risk management and talent development.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=nd9WEwc0hXA',
    channel: 'CNBC International',
  },
  {
    id: 'v020',
    title: '杨莉明鼓励劳动者提升基本 AI 技能',
    titleKo: '양리밍, 근로자의 기본 AI 기술 향상 권장',
    titleJa: '楊莉明、労働者に基本 AI スキルの向上を奨励',
    titleEn: 'Josephine Teo urges workers to build basic AI skills',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털개발·정보부 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-05-27',
    duration: '09:01',
    summary: '杨莉明在亚洲科技大会上鼓励各行各业劳动者积极学习 AI 基础技能以保持竞争力。',
    summaryKo:
      '양리밍이 아시아 과학기술 대회에서 각 산업의 근로자들이 경쟁력을 유지하기 위해 AI 기초 기술을 적극적으로 학습할 것을 권장했습니다.',
    whyItMatters:
      '杨莉明称暂缓综合 AI 立法,转而用《职场公平法案》堵招聘偏见等风险,揭示新加坡监管靠现有法律打补丁而非新增专法',
    whyItMattersEn:
      "Josephine Teo states that comprehensive AI legislation is being deferred, with the Fair Employment Practices Act instead being used to address risks such as hiring bias, revealing that Singapore's regulation relies on patching existing laws rather than introducing new specialized legislation.",
    whyItMattersJa:
      'ジョセフィン・テオが包括的なAI法案の一時停止を表明し、代わりに『ワークプレイス・フェアネス・アクト』を使用して採用バイアスなどのリスクに対応し、シンガポール規制が既存法にパッチを当てることに依存しており、新規専門法ではないことを揭示しています。',
    whyItMattersKo:
      '양릿밍이 포괄적 AI 입법을 유보한다고 하면서, 대신 「직장 공정성법」으로 채용 편견 등 위험을 차단하고, 싱가포르 규제가 기존 법률에 패치를 적용하고 새로운 전문 법안을 추가하지 않음을 드러낸다',
    summaryJa:
      '楊莉明はアジア科学技術会議で、各業種の労働者に対して、競争力を維持するために AI 基礎スキルを積極的に学習するよう奨励した。',
    summaryEn:
      'At Asia Tech x Singapore, Josephine Teo urges workers across industries to actively learn foundational AI skills to remain competitive.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재 및 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=B8ROGZkRpmE',
    channel: 'CNA',
  },
  {
    id: 'v021',
    title: '尚达曼与比尔盖茨对话: 慈善亚洲峰会 2025',
    titleKo: '상달만과 빌 게이츠의 대화: 자선 아시아 정상회담 2025',
    titleJa: '尚達曼とビル・ゲイツの対談：慈善アジア・サミット 2025',
    titleEn: 'Tharman in conversation with Bill Gates: Philanthropy Asia Summit 2025',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2025-05-05',
    duration: '34:36',
    summary: '尚达曼总统与比尔盖茨深入对话,探讨 AI 在公共卫生、教育和发展中的变革潜力。',
    summaryKo:
      '상달만 대통령과 빌 게이츠가 공중 보건, 교육 및 발전 분야에서 AI의 변혁적 잠재력을 탐색하며 깊이 있는 대화를 나누었습니다.',
    whyItMatters:
      '美国援助预算拟砍 80% 之际，盖茨基金会落子新加坡、深化与淡马锡、GIC 合作，新加坡正补位全球卫生与农业 AI 资金真空',
    whyItMattersEn:
      'As the US aid budget faces an 80% cut, the Bill & Melinda Gates Foundation is establishing a presence in Singapore and deepening cooperation with Temasek and GIC, with Singapore filling a global funding gap in health and agriculture AI.',
    whyItMattersJa:
      '米国の援助予算の80%削減が予定される一方、ゲイツ財団がシンガポールに拠点を置き、テマセクおよびGICとの協力を深化させ、シンガポールが保健・農業AIの資金空白をポジショニングしています。',
    whyItMattersKo:
      '미국 원조 예산이 80% 감축되려는 와중에, 게이츠 재단이 싱가포르에 진출하고 탐마싱, GIC와의 협력을 심화하면서, 싱가포르가 글로벌 보건과 농업 AI 자금 공백을 메우고 있다',
    summaryJa:
      '尚達曼大統領はビル・ゲイツと深く対談し、公衆衛生、教育および発展における AI の革新的可能性について探究した。',
    summaryEn:
      'President Tharman Shanmugaratnam and Bill Gates dig into what AI could change in public health, education and development.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=TchCCgLS7wk',
    channel: 'The Straits Times',
  },
  {
    id: 'v022',
    title: '何德华教授: AI 助力 600 万人变 6000 万',
    titleKo: '허덕화 교수: AI 도움으로 600만 인구가 6000만 규모 실현',
    titleJa: '何德華教授：AI が 600 万人を 6,000 万人に支援',
    titleEn: 'Prof Ho Teck Hua: AI helps 6 million people perform like 60 million',
    speaker: 'Ho Teck Hua',
    speakerTitle: 'AI Singapore 创始执行主席 / 南洋理工大学校长',
    speakerTitleKo: 'AI Singapore 창립 회장 / 난양공과대학교 총장',
    speakerTitleJa: 'AI Singapore 創始執行主席／南洋理工大学学長',
    speakerTitleEn: 'Founding Executive Chairman, AI Singapore / President, Nanyang Technological University',
    speakerType: 'academic',
    date: '2025-02-03',
    duration: '17:44',
    summary: '何德华教授阐述 AI 如何帮助新加坡以 600 万人口实现 6000 万人口的经济产出。',
    summaryKo:
      '허덕화 교수가 AI가 600만 인구의 싱가포르가 6000만 인구의 경제 산출을 달성하도록 어떻게 지원하는지 설명했습니다.',
    whyItMatters:
      '何德华身兼 AI Singapore 创始执行主席与南洋理工大学校长，以 10 倍产出叙事为新加坡人口结构短板的 AI 战略提供正当性',
    whyItMattersEn:
      "Ho Teck Hua serves as both founding chief executive of AI Singapore and president of Nanyang Technological University, using a 10-fold productivity narrative to justify Singapore's AI strategy for its population structure deficit.",
    whyItMattersJa:
      'ホー・テッファーがAI Singaporeの創設者執行会長およびナンヤン工科大学学長を兼務し、10倍産出のナラティブでシンガポールの人口構造の短所のAI戦略に正当性を提供しています。',
    whyItMattersKo:
      '호더화가 AI Singapore 창립 집행 의장과 난양이공대학교 총장을 겸임하면서, 10배 산출 내러티브로 싱가포르 인구 구조 약점의 AI 전략에 정당성을 제공한다',
    summaryJa:
      '何德華教授は、AI がいかにシンガポール 600 万人口で 6,000 万人口相当の経済産出を実現するのを支援するかについて説明した。',
    summaryEn:
      'Prof Ho Teck Hua explains how AI can help Singapore deliver the economic output of 60 million people with a population of 6 million.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=LcsCf7QtAy8',
    channel: 'zaobaosg',
  },
  {
    id: 'v023',
    title: 'NAIS 2.0: 新加坡国家 AI 战略官方介绍',
    titleKo: 'NAIS 2.0: 싱가포르 국가 AI 전략 공식 소개',
    titleJa: 'NAIS 2.0：シンガポール国家 AI 戦略公式紹介',
    titleEn: "NAIS 2.0: official introduction to Singapore's National AI Strategy",
    speaker: 'Smart Nation Singapore',
    speakerTitle: '新加坡智慧国办公室',
    speakerTitleKo: '싱가포르 스마트 국가 사무소',
    speakerTitleJa: 'シンガポール スマートネーション・デジタル政府オフィス',
    speakerTitleEn: 'Smart Nation Office, Singapore',
    speakerType: 'government',
    date: '2024-11-17',
    duration: '03:56',
    summary: '官方视频全面介绍新加坡国家 AI 战略 2.0 的核心内容、15 项行动计划和实施路径。',
    summaryKo:
      '공식 비디오는 싱가포르 국가 AI 전략 2.0의 핵심 내용, 15개 행동 계획 및 실행 경로를 종합적으로 소개합니다.',
    whyItMatters:
      'NAIS 2.0 将 2019 版的场景试点升级为超 10 亿新元投入算力与人才的基建战役，标志新加坡 AI 战略从示范工程转向举国级竞赛',
    whyItMattersEn:
      "NAIS 2.0 upgrades the 2019 edition's scenario pilots to an infrastructure campaign with over S$1 billion invested in computing power and talent, marking Singapore's AI strategy's shift from demonstration projects to a nationwide competition.",
    whyItMattersJa:
      'NAIS 2.0は2019年版のシナリオパイロットを10億シンガポール・ドル以上のコンピューティングと人材投資のインフラキャンペーンにアップグレードし、シンガポールのAI戦略がデモンストレーションプロジェクトから国家規模の競争への転換を示しています。',
    whyItMattersKo:
      'NAIS 2.0이 2019년 버전의 시나리오 시범 사업을 10억 싱가포르 달러 이상의 컴퓨팅 파워와 인재 투입 기반시설 전략으로 격상했으며, 싱가포르 AI 전략이 시범 프로젝트에서 국가 수준의 경쟁으로 전환됨을 표시한다',
    summaryJa: '公式動画はシンガポール国家 AI 戦略 2.0 の核心内容、15 の行動計画および実施経路を包括的に紹介した。',
    summaryEn:
      "Official video walking through Singapore's National AI Strategy 2.0 — core content, 15 action plans, and implementation roadmap.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=6qHBTi3YQIQ',
    channel: 'Smart Nation Singapore',
  },
  {
    id: 'v024',
    title: '新加坡: AI 工程师之国 - 杨莉明部长访谈',
    titleKo: '싱가포르: AI 엔지니어의 나라 - 양리밍 장관 인터뷰',
    titleJa: 'シンガポール：AI エンジニアの国 - 楊莉明大臣インタビュー',
    titleEn: 'Singapore: a nation of AI engineers — interview with Minister Josephine Teo',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털개발·정보부 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2024-10-19',
    duration: '56:40',
    summary: '杨莉明做客 Latent Space 播客,深度讨论新加坡 AI 工业政策、人才战略和治理经验。',
    summaryKo:
      '양리밍이 Latent Space 팟캐스트에 출연하여 싱가포르 AI 산업 정책, 인재 전략 및 거버넌스 경험에 대해 깊이 있게 논의했습니다.',
    whyItMatters:
      '从 5,000 到 15,000 的人才目标叠加 AI Verify 与 Project Moonshot 双轨监管，印证新加坡以分层实用主义取代一刀切立法',
    whyItMattersEn:
      "The talent target escalation from 5,000 to 15,000 combined with dual-track regulation of AI Verify and Project Moonshot demonstrates Singapore's adoption of tiered pragmatism over one-size-fits-all legislation.",
    whyItMattersJa:
      '5,000から15,000への人材目標はAI VerifyおよびProject Moonshotの二軌制規制と重ね合わせられ、シンガポールが一律立法に代わって階層化された実用主義を採用していることを証明しています。',
    whyItMattersKo:
      '5,000명에서 15,000명으로의 인재 목표에 AI Verify와 Project Moonshot 이원 규제가 첨가된 것이 싱가포르가 계층화된 실용주의로 일괄적 입법을 대체함을 입증한다',
    summaryJa:
      '楊莉明は Latent Space ポッドキャストに出演し、シンガポール AI 産業政策、人材戦略およびガバナンス経験について深く論じた。',
    summaryEn:
      "On the Latent Space podcast, Josephine Teo discusses Singapore's AI industrial policy, talent strategy and governance experience in depth.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=diXpLlFd0Gg',
    channel: 'Latent Space',
  },
  {
    id: 'v025',
    title: '杨莉明谈 AI 如何提升新加坡金融服务业',
    titleKo: '양리밍, AI가 싱가포르 금융 서비스업 향상에 미치는 영향 논의',
    titleJa: '楊莉明、AI がシンガポール金融サービス業をいかに向上させるかについて語る',
    titleEn: "Josephine Teo on how AI uplifts Singapore's financial services industry",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털개발·정보부 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2025-10-06',
    duration: '09:49',
    summary: '杨莉明讨论 AI 在新加坡金融服务行业中的应用前景与监管平衡。',
    summaryKo: '양리밍이 싱가포르 금융 서비스 산업에서 AI의 응용 전망 및 규제 균형에 대해 논의했습니다.',
    whyItMatters:
      'AI 卓越中心从 30 多家增至 50 多家，Project Moonshot 补上生成式 AI 风险治理缺口，为其他监管机构提供可复制先例',
    whyItMattersEn:
      'AI Centres of Excellence expanded from over 30 to over 50, with Project Moonshot filling the gap in generative AI risk governance, providing a replicable precedent for other regulators.',
    whyItMattersJa:
      'AIセンターオブエクセレンスが30社以上から50社以上に増加し、Project Moonshotが生成型AIのリスク・ガバナンスのギャップを埋め、他の規制当局のための複製可能な先例を提供しています。',
    whyItMattersKo:
      'AI 우수 센터가 30개 이상에서 50개 이상으로 증가했고, Project Moonshot이 생성형 AI 위험 거버넌스 공백을 메우면서, 다른 규제 기구에 복제 가능한 선례를 제공한다',
    summaryJa: '楊莉明はシンガポール金融サービス産業における AI 応用の展望と規制均衡について論じた。',
    summaryEn:
      "Josephine Teo discusses prospects for AI applications in Singapore's financial services and the regulatory balance required.",
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=uMmtX9Jx_Ds',
    channel: 'The Straits Times',
  },
  {
    id: 'v026',
    title: '新加坡 AI 战略如何成为他国路线图',
    titleKo: '싱가포르 AI 전략이 어떻게 타국의 로드맵이 되었는가',
    titleJa: 'シンガポール AI 戦略がいかに他国の路線図となるか',
    titleEn: "How Singapore's AI strategy became a roadmap for other nations",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 뉴스부 장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2024-09-04',
    duration: '24:46',
    summary: '《财富》杂志分析新加坡 AI 战略为何成为全球小型经济体的参考范本。',
    summaryKo: '포춘지가 분석한 싱가포르 AI 전략이 전 세계 소규모 경제의 참고 사례가 되는 이유',
    whyItMatters: '财富杂志将新加坡列为全球范本，但人均研发支出为美国 18 倍的投入门槛，多数中小经济体难以复制',
    whyItMattersEn:
      'Fortune magazine lists Singapore as a global model, but the per-capita R&D spending threshold of 18 times that of the US makes it difficult for most small and medium-sized economies to replicate',
    whyItMattersJa:
      'フォーチュン誌はシンガポールを世界規範として列挙していますが、一人当たり研究開発支出がアメリカの18倍の投資閾値であり、多くの中小規模経済体は複製が困難です。',
    whyItMattersKo:
      '포춘 매거진이 싱가포르를 글로벌 모범으로 지정했으나, 1인당 연구개발 지출이 미국의 18배에 달하는 높은 진입 장벽으로 인해 대부분의 중소 경제권은 이를 복제하기 어렵습니다.',
    summaryJa: '『フォーチュン』誌はシンガポール AI 戦略がなぜグローバルな小型経済の参考例となるのかを分析した。',
    summaryEn:
      "Fortune analyses why Singapore's AI strategy has become a reference model for small economies worldwide.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=cg3tg-BfLIs',
    channel: 'Fortune Magazine',
  },
  {
    id: 'v027',
    title: 'AI 治理需平衡雄心与谦逊: 尚达曼总统',
    titleKo: 'AI 거버넌스는 야심과 겸손의 균형이 필요: 샹다만 대통령',
    titleJa: 'AI ガバナンスは野心と謙虚さのバランスが必要：尚達曼大統領',
    titleEn: 'AI governance must balance ambition and humility: President Tharman',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2024-05-29',
    duration: '01:42',
    summary: '尚达曼在亚洲科技大会上强调 AI 治理需要在雄心和谦逊之间取得平衡。',
    summaryKo: '샹다만이 아시아 기술 회의에서 AI 거버넌스가 야심과 겸손 사이에서 균형을 이루어야 한다고 강조했습니다.',
    whyItMatters:
      '尚达曼以总统身份在 2024-05-29 亚洲科技大会定调，为新加坡区别于欧盟强监管的创新优先路线背书，但未给出具体监管机制',
    whyItMattersEn:
      "On 2024-05-29, Tharman Shanmugaratnam, in his capacity as President, set the tone at the Asia Tech Summit to endorse Singapore's innovation-first approach distinct from the EU's stringent regulation, but did not provide specific regulatory mechanisms",
    whyItMattersJa:
      'タルマン・シャンムガラトナムは大統領として2024年5月29日のアジア技術会議で基調講演を行い、EUの強規制と区別されるシンガポールのイノベーション優先路線を支持しましたが、具体的な規制メカニズムは示しませんでした。',
    whyItMattersKo:
      '샹따르만이 2024-05-29 아시아 기술 컨퍼런스에서 대통령 신분으로 기조를 정했으며, 유럽연합의 강한 규제와 구별되는 싱가포르의 혁신 우선 노선을 지지했으나 구체적인 규제 메커니즘은 제시하지 않았습니다.',
    summaryJa: '尚達曼はアジア科学技術会議で、AI ガバナンスは野心と謙虚さの間で均衡を取ることが必要であると強調した。',
    summaryEn:
      'At Asia Tech x Singapore, President Tharman Shanmugaratnam stresses that AI governance must strike a balance between ambition and humility.',
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=8pcRC9cXeo0',
    channel: 'CNA',
  },
  {
    id: 'v028',
    title: '杨莉明在新加坡 AI 大会上的演讲',
    titleKo: '양리명이 싱가포르 AI 대회에서 한 연설',
    titleJa: '楊莉明、シンガポール AI 大会での演説',
    titleEn: "Josephine Teo's address at the Singapore Conference on AI",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡通讯及新闻部长',
    speakerTitleKo: '싱가포르 통신 및 뉴스부 장관',
    speakerTitleJa: 'シンガポール 通信及びニュース大臣',
    speakerTitleEn: 'Minister for Communications and Information, Singapore',
    speakerType: 'government',
    date: '2023-12-11',
    duration: '20:24',
    summary: '杨莉明在首届新加坡 AI 大会上发表演讲,配合 NAIS 2.0 发布阐述 AI 治理愿景。',
    summaryKo: '양리명이 제1회 싱가포르 AI 대회에서 발표를 통해 NAIS 2.0 출시와 함께 AI 거버넌스 비전을 제시했습니다.',
    whyItMatters:
      '新加坡首次以 SCAI 对标联合国高级咨询委员会、G7 广岛进程与英国 AI 安全峰会，试图复制新水外交模式抢占 AI 治理话语权',
    whyItMattersEn:
      'For the first time, Singapore benchmarks SCAI against the UN High-Level Advisory Commission, the G7 Hiroshima Process, and the UK AI Safety Summit, attempting to replicate its water diplomacy model to seize discourse power in AI governance',
    whyItMattersJa:
      'シンガポール初となるSCAIは国連上級諮問委員会、G7ヒロシマ・プロセス、英国AI安全サミットをベンチマークし、新しい外交戦略を複製してAI統治における発言権を占有しようとしています。',
    whyItMattersKo:
      '싱가포르가 처음으로 SCAI를 유엔 고위자문위원회, G7 히로시마 프로세스, 영국 AI 안전 정상회담과 벤치마킹하며 새로운 물 외교 모델을 복제하여 AI 거버넌스 담론권을 선점하려고 시도했습니다.',
    summaryJa:
      '楊莉明は首届シンガポール AI 大会で演説を行い、NAIS 2.0 の発表に合わせて AI ガバナンスのビジョンを説明した。',
    summaryEn:
      'At the inaugural Singapore Conference on AI, Josephine Teo delivers an address articulating the AI governance vision alongside the launch of NAIS 2.0.',
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=am869LAYsuo',
    channel: 'MDDI Singapore',
  },
  {
    id: 'v029',
    title: '尚达曼总统在哥伦比亚大学谈 AI 对新加坡的益处',
    titleKo: '샹다만 대통령이 컬럼비아 대학교에서 싱가포르에 대한 AI의 이점에 대해 논했습니다.',
    titleJa: '尚達曼大統領、コロンビア大学でシンガポール向け AI の利益について語る',
    titleEn: "President Tharman at Columbia University on AI's benefits for Singapore",
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2023-12-06',
    duration: '01:27',
    summary: '尚达曼在哥伦比亚大学世界领袖论坛上谈论 AI 对新加坡劳动力和经济的积极作用。',
    summaryKo:
      '샹다만이 컬럼비아 대학교 세계 리더십 포럼에서 AI가 싱가포르의 노동력과 경제에 미치는 긍정적 영향에 대해 논했습니다.',
    whyItMatters: '尚达曼在哥伦比亚大学公开为新加坡 AI 战略站台，将其定位为全球最快采用者而非模型研发者，回应人口缺口',
    whyItMattersEn:
      "Tharman Shanmugaratnam publicly championed Singapore's AI strategy at Columbia University, positioning it as the world's fastest adopter rather than a model developer, addressing the population gap",
    whyItMattersJa:
      'タルマン・シャンムガラトナムはコロンビア大学でシンガポールのAI戦略を公然と支持し、それをグローバル最速採用者として位置付け、モデル研究開発者ではなく人口不足への対応を明らかにしました。',
    whyItMattersKo:
      '샹따르만이 컬럼비아 대학교에서 공개적으로 싱가포르의 AI 전략을 지지하며, 모델 연구개발자가 아닌 전 지구적 최빠른 채택자로 포지셔닝했으며 인구 공백에 대응했습니다.',
    summaryJa:
      '尚達曼はコロンビア大学世界リーダーフォーラムでシンガポール労働力および経済に対する AI の積極的作用について論じた。',
    summaryEn:
      "At Columbia University's World Leaders Forum, President Tharman Shanmugaratnam speaks on AI's positive impact on Singapore's workforce and economy.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=SsCVAN4QG3w',
    channel: 'Columbia SIPA',
  },
  {
    id: 'v030',
    title: '尚达曼总统谈 AI 与就业: 新加坡金融科技节 2023',
    titleKo: '샹다만 대통령의 AI와 고용 논의: 싱가포르 핀테크 페스티벌 2023',
    titleJa: '尚達曼大統領、AI と雇用について語る：シンガポール フィンテック・フェスティバル 2023',
    titleEn: 'President Tharman on AI and jobs: Singapore FinTech Festival 2023',
    speaker: 'Tharman Shanmugaratnam',
    speakerTitle: '新加坡总统',
    speakerTitleKo: '싱가포르 대통령',
    speakerTitleJa: 'シンガポール大統領',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
    date: '2023-11-15',
    duration: '05:44',
    summary: '尚达曼在金融科技节上警告 AI 将比以往技术更快取代人类任务,呼吁加快劳动力转型。',
    summaryKo:
      '샹다만이 핀테크 페스티벌에서 AI가 이전 기술보다 더 빠르게 인간의 업무를 대체할 것이라고 경고하고, 노동력 전환을 가속화할 것을 촉구했습니다.',
    whyItMatters:
      '尚达曼在金融科技节把 AI 冲击列为十到十五年内最大转型挑战,凸显新加坡政策仍在应对体力劳动、还没跟上脑力工作的冲击',
    whyItMattersEn:
      "Tharman Shanmugaratnam listed AI impact as the biggest transformation challenge in the next ten to fifteen years at FinTech Festival, highlighting that Singapore's policy is still addressing the impact on manual labor and has yet to catch up with the impact on knowledge work",
    whyItMattersJa:
      'タルマン・シャンムガラトナムはフィンテック祭でAI衝撃を10～15年以内の最大の変革課題として位置付け、シンガポール政策がまだ身体労働への対応にとどまっており、知的労働への衝撃に追いついていないことを浮き彫りにしました。',
    whyItMattersKo:
      '샹따르만이 금융기술 페스티벌에서 AI의 영향을 향후 10년에서 15년 내 최대의 전환 과제로 명시했으며, 싱가포르의 정책이 육체 노동의 영향에는 대응하고 있지만 지적 노동의 영향에는 아직 따라가지 못하고 있음을 부각했습니다.',
    summaryJa:
      '尚達曼はフィンテック・フェスティバルで、AI がこれまでの技術よりもより速く人間のタスクを置き換えるであろうことに警告し、労働力転型を加速するよう呼びかけた。',
    summaryEn:
      'At the FinTech Festival, President Tharman Shanmugaratnam warns that AI will displace human tasks faster than previous technologies and calls for accelerated workforce transformation.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재 양성과 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=pN5_HwLNHsY',
    channel: 'Asia Biz Today',
  },
  {
    id: 'v031',
    title: '维文谈 AI 新监管范式的必要性',
    titleKo: '비완이 AI 신규제 패러다임의 필요성을 논하다',
    titleJa: '維文大臣、新たな AI 規制パラダイムの必要性について語る',
    titleEn: 'Vivian Balakrishnan on the need for a new regulatory paradigm for AI',
    speaker: 'Vivian Balakrishnan',
    speakerTitle: '新加坡外交部长',
    speakerTitleKo: '싱가포르 외교부 장관',
    speakerTitleJa: 'シンガポール外交大臣',
    speakerTitleEn: 'Minister for Foreign Affairs, Singapore',
    speakerType: 'government',
    date: '2023-09-19',
    duration: '01:23',
    summary: '维文部长指出传统监管方式不足以应对 AI,需要开辟新路径制定 AI 治理规则。',
    summaryKo:
      '비완 장관이 전통적 규제 방식이 AI에 대응하기에 부족하며, AI 거버넌스 규칙을 수립하기 위한 새로운 경로를 개척해야 한다고 지적했습니다.',
    whyItMatters: '新加坡将 2019 年模型 AI 治理框架,从国内软法工具升级为其在联合国场边推销的全球治理模板',
    whyItMattersEn:
      'Singapore has upgraded its 2019 model AI governance framework from a domestic soft law tool to a global governance template it is promoting at UN side events',
    whyItMattersJa:
      'シンガポールは2019年モデルのAI統治フレームワークを国内ソフトロー・ツールから、国連会議で推進するグローバル統治テンプレートへとアップグレードしました。',
    whyItMattersKo:
      '싱가포르가 2019년의 AI 거버넌스 프레임워크를 국내 소프트로우 도구에서 유엔 회의 측면에서 홍보하는 글로벌 거버넌스 템플릿으로 업그레이드했습니다.',
    summaryJa:
      '維文大臣は従来の規制方式は AI に対応するには不十分であり、AI ガバナンス規則の策定にために新しい道を切り開く必要があると指摘した。',
    summaryEn:
      'Minister Vivian Balakrishnan argues that traditional regulatory approaches are inadequate for AI and that new paths must be opened to develop AI governance rules.',
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=SJEgYYYWeDA',
    channel: 'CNA',
  },
  {
    id: 'v032',
    title: '新加坡发布 AI Verify 开源测试框架',
    titleKo: '싱가포르가 AI Verify 오픈소스 테스트 프레임워크를 출시했습니다.',
    titleJa: 'シンガポール、AI Verify オープンソーステストフレームワークを発表',
    titleEn: 'Singapore launches AI Verify open-source testing framework',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡通讯及新闻部长',
    speakerTitleKo: '싱가포르 통신 및 뉴스부 장관',
    speakerTitleJa: 'シンガポール 通信及びニュース大臣',
    speakerTitleEn: 'Minister for Communications and Information, Singapore',
    speakerType: 'government',
    date: '2023-06-07',
    duration: '06:54',
    summary: '新加坡在亚洲科技大会上发布 AI Verify Foundation,建立全球首个 AI 治理测试开源社区。',
    summaryKo:
      '싱가포르가 아시아 기술 회의에서 AI Verify Foundation을 출시하여 전 세계 최초의 AI 거버넌스 테스트 오픈소스 커뮤니티를 구축했습니다.',
    whyItMatters:
      '新加坡把 IBM、微软、谷歌拉进 AI Verify Foundation，押注企业自愿自测而非强制立法，抢占全球 AI 治理标准话语权',
    whyItMattersEn:
      'Singapore has brought IBM, Microsoft, and Google into the AI Verify Foundation, betting on voluntary self-testing by enterprises rather than mandatory legislation, to seize discourse power in global AI governance standards',
    whyItMattersJa:
      'シンガポールはIBM、マイクロソフト、グーグルをAI Verify Foundationに引き込み、強制的法制化ではなく企業による自発的自己評価に賭けながら、グローバルAI統治標準における発言権を占有しています。',
    whyItMattersKo:
      '싱가포르가 IBM, 마이크로소프트, 구글을 AI Verify Foundation에 참여시켜, 강제 입법이 아닌 기업의 자발적 자가 검증에 베팅하며 전 지구적 AI 거버넌스 표준 담론권을 선점했습니다.',
    summaryJa:
      'シンガポールはアジア科学技術会議で AI Verify Foundation を発表し、グローバル初の AI ガバナンステストオープンソースコミュニティを確立した。',
    summaryEn:
      "At Asia Tech x Singapore, Singapore launches the AI Verify Foundation, establishing the world's first open-source community for AI governance testing.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=Cxm9i1Sswes',
    channel: 'CNA',
  },
  {
    id: 'v033',
    title: '维文在 NSCAI 全球新兴技术峰会上的演讲',
    titleKo: '웨이원의 NSCAI 글로벌 신흥기술 정상회담 연설',
    titleJa: '維文、NSCAI グローバル新興技術サミットでの演説',
    titleEn: "Vivian Balakrishnan's address at the NSCAI Global Emerging Technology Summit",
    speaker: 'Vivian Balakrishnan',
    speakerTitle: '新加坡外交部长 / 智慧国负责人',
    speakerTitleKo: '싱가포르 외교부 장관 / 스마트 싱가포르 담당자',
    speakerTitleJa: 'シンガポール外交大臣／スマートネーション責任者',
    speakerTitleEn: 'Minister for Foreign Affairs / Minister-in-charge of Smart Nation, Singapore',
    speakerType: 'government',
    date: '2021-07-14',
    duration: '20:53',
    summary: '维文在美国国家安全委员会 AI 峰会上阐述新加坡智慧国愿景和 AI 治理的国际合作。',
    summaryKo:
      '비완이 미국 국가안전보장회의의 AI 정상회의에서 싱가포르 스마트 싱가포르 비전 및 AI 거버넌스의 국제 협력을 설명했습니다.',
    whyItMatters: '维文借 NSCAI 平台喊话联合国建 AI 公约，意在把新加坡的诚实中间人定位，转化为中美博弈中的规则制定筹码',
    whyItMattersEn:
      "Vivian Balakrishnan used the NSCAI platform to call for an AI convention at the United Nations, intending to convert Singapore's positioning as an honest intermediary into a rule-making bargaining chip in the US-China contest",
    whyItMattersJa:
      'ビビアン・バラクリシュナンはNSCAIプラットフォームを借り国連にAI条約構築を主張し、シンガポールの誠実な仲介者としての位置付けを中米競争におけるルール制定チップに転換させることを意図しています。',
    whyItMattersKo:
      '웨이원이 NSCAI 플랫폼을 통해 유엔에 AI 협약 수립을 촉구했으며, 싱가포르의 정직한 중개자로서의 입지를 미-중 경쟁에서의 규칙 제정 수단으로 전환하려는 의도를 드러냈습니다.',
    summaryJa:
      '維文は米国国家安全保障委員会 AI サミットでシンガポールスマートネーション・ビジョンおよび AI ガバナンスの国際協力について説明した。',
    summaryEn:
      "At the US National Security Commission on AI summit, Vivian Balakrishnan articulates Singapore's Smart Nation vision and international cooperation on AI governance.",
    topic: '国际合作与对标',
    topicKo: '국제 협력과 벤치마크',
    topicJa: '国際協力とベンチマーク',
    topicEn: 'International Cooperation & Benchmarking',
    youtubeUrl: 'https://www.youtube.com/watch?v=UmXtuIzIjjQ',
    channel: 'Vivian Balakrishnan',
  },
  {
    id: 'v034',
    title: '新加坡科技论坛 2019: AI 在新加坡的深度探讨',
    titleKo: '싱가포르 기술 포럼 2019: 싱가포르 AI에 대한 심층 토론',
    titleJa: 'シンガポール科学技術フォーラム 2019：シンガポール における AI の深度探究',
    titleEn: 'Singapore Tech Forum 2019: an in-depth look at AI in Singapore',
    speaker: 'Ho Teck Hua',
    speakerTitle: 'AI Singapore 创始执行主席',
    speakerTitleKo: 'AI Singapore 창립 집행 의장',
    speakerTitleJa: 'AI Singapore 創始執行主席',
    speakerTitleEn: 'Founding Executive Chairman, AI Singapore',
    speakerType: 'academic',
    date: '2019-06-07',
    duration: '46:02',
    summary: 'AI Singapore 创始主席何德华等专家深入讨论新加坡 AI 生态建设和产业应用前景。',
    summaryKo:
      'AI Singapore 창립 의장 호덕화 등 전문가가 싱가포르 AI 생태계 건설과 산업 응용 전망을 심도 있게 논의합니다.',
    whyItMatters:
      '何德华的数据立方思路揭示新加坡 AI 战略的真正底牌：靠 NRIC 打通全民数据，把人口规模劣势换成数据密度优势',
    whyItMattersEn:
      "Ho Teck Hua's data cube approach reveals the true trump card of Singapore's AI strategy: leveraging NRIC to unlock nationwide data, converting the population scale disadvantage into a data density advantage",
    whyItMattersJa:
      'ホー・トーホアのデータキューブ戦略がシンガポールAI戦略の本当の切り札を明かにしています：NRICによって全国民データをつなぎ、人口規模の劣勢をデータ密度の優位性に変えることです。',
    whyItMattersKo:
      '허더화의 데이터 큐브 사고방식은 싱가포르 AI 전략의 진정한 카드를 드러냅니다: NRIC을 통해 전국민 데이터를 연결하여 인구 규모 열세를 데이터 밀도 우위로 전환합니다.',
    summaryJa:
      'AI Singapore 創始主席何德華ら専門家はシンガポール AI エコシステム構築および産業応用展望について深く論じた。',
    summaryEn:
      "AI Singapore founding chairman Ho Teck Hua and other experts talk through how Singapore's AI scene is being built out and where industrial applications are heading.",
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=uSmV2rg0Z3s',
    channel: 'Singapore Global Network',
  },
  {
    id: 'v035',
    title: 'IMDA 官方介绍: AI Verify 治理测试框架',
    titleKo: 'IMDA 공식 소개: AI Verify 거버넌스 테스트 프레임워크',
    titleJa: 'IMDA 公式紹介：AI Verify ガバナンステストフレームワーク',
    titleEn: 'IMDA official introduction: the AI Verify governance testing framework',
    speaker: 'IMDA Singapore',
    speakerTitle: '新加坡资讯通信媒体发展局',
    speakerTitleKo: '싱가포르 정보통신미디어발전청',
    speakerTitleJa: 'シンガポール 資訊通信メディア発展局',
    speakerTitleEn: 'Infocomm Media Development Authority (IMDA), Singapore',
    speakerType: 'government',
    date: '2023-01-15',
    duration: '04:45',
    summary: 'IMDA 官方视频介绍全球首个 AI 治理测试框架和工具包 AI Verify 的功能与应用。',
    summaryKo:
      'IMDA 공식 영상은 글로벌 최초의 AI 거버넌스 테스트 프레임워크 및 도구 AI Verify의 기능과 응용을 소개합니다.',
    whyItMatters: 'IMDA 2023 年推出全球首个 AI Verify 测试工具包，用自愿自评替代硬性立法，抢先卡位国际治理标准制定权',
    whyItMattersEn:
      "IMDA launched the world's first AI Verify testing toolkit in 2023, using voluntary self-assessment to replace mandatory legislation, to pre-empt the rule-making authority in international governance standards",
    whyItMattersJa:
      'IMDAは2023年にグローバル初のAI Verifyテスト・ツールキットを推出し、厳格な法制化の代わりに自発的自己評価を使用することで、国際統治標準制定権を先制的に占有しました。',
    whyItMattersKo:
      'IMDA가 2023년 전 지구적 최초의 AI Verify 테스트 도구 모음을 출시하여, 자발적 자기평가로 강제 입법을 대체하며 국제 거버넌스 표준 제정권을 선점했습니다.',
    summaryJa:
      'IMDA 公式動画はグローバル初の AI ガバナンステストフレームワークおよびツールキット AI Verify の機能と応用を紹介した。',
    summaryEn:
      "Official IMDA video introducing the features and applications of AI Verify — the world's first AI governance testing framework and toolkit.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=8NfNN1heFQY',
    channel: 'IMDA Singapore',
  },
  {
    id: 'v036',
    title: '杨莉明谈新加坡 AI 优先事项与在线安全保护措施',
    titleKo: '양리밍이 싱가포르 AI 우선순위 및 온라인 안전 보호 조치를 논의합니다.',
    titleJa: '楊莉明、シンガポール AI 優先事項およびオンラインセーフティ保護措置について語る',
    titleEn: "Josephine Teo on Singapore's AI priorities and online safety safeguards",
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 뉴스 부장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-03-31',
    duration: '45:00',
    summary: '杨莉明在 Lorong AI 媒体问答会上详述 AI 双语人才、AI 代理治理、国家 AI 影响计划及 AI 对职场的影响。',
    summaryKo:
      '양리밍이 Lorong AI 미디어 질의응답 회의에서 AI 이중언어 인재, AI 에이전트 거버넌스, 국가 AI 영향 계획 및 AI가 직장에 미치는 영향을 상세히 설명합니다.',
    whyItMatters: '总理亲自挂帅、6 位部长参与的国家 AI 委员会成立，标志 AI 治理从部门事务升级为跨部门国家议程',
    whyItMattersEn:
      'The establishment of the national AI committee, personally led by the Prime Minister with participation from six ministers, marks the upgrade of AI governance from a departmental matter to a cross-departmental national agenda',
    whyItMattersJa:
      '総理大臣が自ら指揮し、6人の部長が参与した国家AI委員会が設立され、AI統治が部門事務からクロスセクタル国家アジェンダへアップグレードしたことを示しています。',
    whyItMattersKo:
      '총리가 직접 지휘하고 6명의 부장관이 참여하는 국가 AI 위원회가 설립되었으며, AI 거버넌스가 부서 업무에서 부처 간 국가 의제로 상향되었음을 표시합니다.',
    summaryJa:
      '楊莉明は Lorong AI メディアQ&A セッションで、AI バイリンガル人材、AI エージェント・ガバナンス、国家 AI インパクト計画および AI の職場への影響について詳述した。',
    summaryEn:
      "At a Lorong AI media Q&A, Josephine Teo details bilingual AI talent, agentic AI governance, the National AI Impact Plan, and AI's impact on the workplace.",
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략 및 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=MDNcHufhR74',
    channel: 'The Straits Times',
  },
  {
    id: 'v037',
    title: '杨莉明谈 AI 企业采用与在线安全监管',
    titleKo: '양리밍이 AI 기업 도입과 온라인 안전 규제를 논의합니다.',
    titleJa: '楊莉明、AI 企業採用およびオンラインセーフティ規制について語る',
    titleEn: 'Josephine Teo on enterprise AI adoption and online safety regulation',
    speaker: 'Josephine Teo',
    speakerTitle: '新加坡数码发展及新闻部长',
    speakerTitleKo: '싱가포르 디지털 발전 및 뉴스 부장관',
    speakerTitleJa: 'シンガポール デジタル開発及びニュース大臣',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
    date: '2026-03-31',
    duration: '02:30',
    summary: '杨莉明表示政府准备在 AI 企业采用未达预期效果时进行干预,同时发布 IMDA 第二份在线安全评估报告。',
    summaryKo:
      '양리밍이 정부가 AI 기업 도입이 예상 효과에 못 미칠 때 개입할 준비가 되어 있다고 표현하며, 동시에 IMDA 제2차 온라인 안전 평가 보고서를 발표합니다.',
    whyItMatters:
      'AI 就业冲击堪比疫情,若 10000 家企业、100000 人目标落空,政府将复制 SG United 直接介入,新加坡 AI 政策首度亮出干预底牌',
    whyItMattersEn:
      "The AI employment impact is comparable to the pandemic; if the targets of 10,000 enterprises and 100,000 people fall through, the government will replicate SG United to intervene directly—Singapore's AI policy reveals its intervention card for the first time",
    whyItMattersJa:
      'AI雇用衝撃はパンデミックに相当し、10,000社の企業と100,000人の目標が未達成の場合、政府はSG Unitedを複製して直接介入し、シンガポールAI政策が初めて介入の切り札を明かします。',
    whyItMattersKo:
      'AI 고용 영향은 팬데믹에 필적하며, 만 개의 기업과 10만 명의 목표가 실현되지 않으면 정부는 SG United를 복제하여 직접 개입할 것이며, 싱가포르 AI 정책이 처음으로 개입의 카드를 드러냈습니다.',
    summaryJa:
      '楊莉明は政府が AI 企業採用が期待効果を達成しない場合に干渉する準備ができていると表明し、同時に IMDA 第 2 回オンラインセーフティ評価報告書を発表した。',
    summaryEn:
      "Josephine Teo says the government is prepared to intervene if enterprise AI adoption falls short of expected outcomes, while releasing IMDA's second Online Safety Assessment Report.",
    topic: 'AI 治理与监管',
    topicKo: 'AI 거버넌스와 규제',
    topicJa: 'AI ガバナンスと規制',
    topicEn: 'AI Governance & Regulation',
    youtubeUrl: 'https://www.youtube.com/watch?v=QhoxB9y113M',
    channel: 'CNA',
  },
  {
    id: 'v038',
    title: '经济策略评审: 全球竞争力委员会——AI 重塑经济格局',
    titleKo: '경제 전략 평가: 글로벌 경쟁력 위원회——AI가 경제 형태를 재형성하다',
    titleJa: '経済戦略評価：グローバル競争力委員会——AI が経済格局を再構築',
    titleEn: 'Economic Strategy Review: Global Competitiveness Committee — AI reshapes the economy',
    speaker: 'Lawrence Wong',
    speakerTitle: '新加坡总理',
    speakerTitleKo: '싱가포르 총리',
    speakerTitleJa: 'シンガポール総理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
    date: '2026-03-12',
    duration: '03:30',
    summary: '经济策略评审揭示新加坡如何在 AI 重塑全球格局的背景下保持竞争力,从科技枢纽到本土企业国际化。',
    summaryKo:
      '경제 전략 평가는 AI가 글로벌 형태를 재형성하는 배경 속에서 싱가포르가 경쟁력을 유지하는 방법을 드러냅니다. 기술 허브에서 현지 기업의 국제화까지.',
    whyItMatters:
      'ESR 委员会 1 将经济战略重心从依赖跨国公司转向培育本土冠军企业，是新加坡应对自由贸易秩序瓦解与 AI 重塑经济的关键转向',
    whyItMattersEn:
      "The ESR Committee 1 shift of economic strategy focus from reliance on multinational corporations to cultivating homegrown champion enterprises is Singapore's key pivot to address the collapse of the free-trade order and economic reshaping by AI",
    whyItMattersJa:
      'ESR委員会1が経済戦略の重点を多国籍企業への依存から地元チャンピオン企業の育成へシフトさせることは、自由貿易秩序の崩壊とAIによる経済再構築に対応するシンガポールの重要な転向です。',
    whyItMattersKo:
      'ESR 위원회 1이 경제 전략의 초점을 다국적 기업에 대한 의존에서 토착 우량 기업 육성으로 전환하였으며, 이는 자유 무역 질서의 붕괴와 AI의 경제 재편에 대응하는 싱가포르의 핵심 전환입니다.',
    summaryJa:
      '経済戦略評価は、AI がグローバル格局を再構築する背景の下で、シンガポールがいかに競争力を維持するかを明らかにし、科学技術ハブから地元企業の国際化へ。',
    summaryEn:
      'The Economic Strategy Review lays out how Singapore stays competitive as AI reshapes the global economy — from tech hub status to taking homegrown firms global.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략 및 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=a86yBs7k3hs',
    channel: 'govsg',
  },
  {
    id: 'v039',
    title: 'HSC Pipeline Engineering: 用 RAG AI 构建工程知识库',
    titleKo: 'HSC Pipeline Engineering: RAG AI를 통한 공학 지식 기지 구축',
    titleJa: 'HSC パイプラインエンジニアリング：RAG AI でエンジニアリングナレッジベースを構築',
    titleEn: 'HSC Pipeline Engineering: building an engineering knowledge base with RAG AI',
    speaker: 'HSC Pipeline Engineering',
    speakerTitle: 'AISG LADP 参与企业',
    speakerTitleKo: 'AISG LADP 참여 기업',
    speakerTitleJa: 'AISG LADP 参加企業',
    speakerTitleEn: 'AISG LADP participating company',
    speakerType: 'industry',
    date: '2026-03-20',
    duration: '05:00',
    summary: 'HSC Pipeline 通过 AISG LADP 计划开发本地部署的 RAG AI 知识库,打破工程知识孤岛,提升决策效率。',
    summaryKo:
      'HSC Pipeline은 AISG LADP 계획을 통해 로컬 배포 RAG AI 지식 기지를 개발하여 엔지니어링 지식 고립을 깨뜨리고 의사결정 효율성을 높입니다.',
    whyItMatters: '3 天等待被压缩到即时应答,证明 AISG LADP 能把 RAG 落地到传统土木工程一线,而非停留在科技企业试点',
    whyItMattersEn:
      'A 3-day wait compressed to instant response proves that AISG LADP can land RAG on the front lines of traditional civil engineering, rather than remaining confined to tech company pilots',
    whyItMattersJa:
      '3日間の待機期間がインスタント対応に圧縮されたことで、AISG LADPがRAGを従来の土木工学の最前線に実装できることが証明され、テクノロジー企業のパイロットにとどまらないことが示されました。',
    whyItMattersKo:
      '3일 대기가 즉각적인 응답으로 압축되었으며, AISG LADP가 RAG를 기술 기업 시범 단계에 머물러 있지 않고 전통 토목 공학 최전선에 적용할 수 있음을 증명합니다.',
    summaryJa:
      'HSC Pipeline は AISG LADP プログラムを通じてローカルデプロイ RAG AI ナレッジベースを開発し、エンジニアリングナレッジのサイロを破壊し、意思決定効率を向上させた。',
    summaryEn:
      'Through the AISG LADP programme, HSC Pipeline built a locally deployed RAG AI knowledge base, breaking down engineering-knowledge silos and improving decision-making efficiency.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=tmPl5_pW5Lg',
    channel: 'AI Singapore',
  },
  {
    id: 'v040',
    title: 'YTL PowerSeraya: LLM 赋能电力市场规则分析',
    titleKo: 'YTL PowerSeraya: LLM을 통한 전력 시장 규칙 분석',
    titleJa: 'YTL PowerSeraya：LLM が電力市場ルール分析を赋能',
    titleEn: 'YTL PowerSeraya: LLMs power electricity market rule analysis',
    speaker: 'YTL PowerSeraya',
    speakerTitle: 'AISG LADP 参与企业',
    speakerTitleKo: 'AISG LADP 참여 기업',
    speakerTitleJa: 'AISG LADP 参加企業',
    speakerTitleEn: 'AISG LADP participating company',
    speakerType: 'industry',
    date: '2026-02-20',
    duration: '05:00',
    summary: '新加坡电力公司 YTL PowerSeraya 通过 LADP 构建电力市场规则专用 LLM,实现报告自动分析与规则查询。',
    summaryKo:
      '싱가포르 전력 회사 YTL PowerSeraya는 LADP를 통해 전력 시장 규칙 전용 LLM을 구축하여 보고서 자동 분석 및 규칙 조회를 실현합니다.',
    whyItMatters:
      'YTL PowerSeraya 通过 AISG LADP 把电力市场规则封装成专用 LLM，为能源等关键基础设施行业的合规自动化立了范例',
    whyItMattersEn:
      'YTL PowerSeraya encapsulated electricity market rules into a proprietary LLM through AISG LADP, setting an example for compliance automation in energy and other critical infrastructure sectors',
    whyItMattersJa:
      'YTL PowerSerayaはAISG LADPを通じて電力市場規則を専用LLMにカプセル化し、エネルギーなどのクリティカルインフラストラクチャ産業のコンプライアンス自動化の先例を設立しました。',
    whyItMattersKo:
      'YTL PowerSeraya가 AISG LADP를 통해 전력 시장 규칙을 전용 LLM으로 캡슐화하여, 에너지 등 핵심 기반시설 산업의 규정 준수 자동화를 위한 선례를 제시했습니다.',
    summaryJa:
      'シンガポール電力会社 YTL PowerSeraya は LADP を通じて電力市場ルール専用 LLM を構築し、レポート自動分析とルール照会を実現した。',
    summaryEn:
      'Singapore power company YTL PowerSeraya used LADP to build an LLM specialised in electricity market rules, enabling automated report analysis and rule queries.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=j-8H26FUOz4',
    channel: 'AI Singapore',
  },
  {
    id: 'v041',
    title: 'Skybots: 从 RPA 到 LLM 驱动的智能客服',
    titleKo: 'Skybots: RPA에서 LLM 기반 지능형 고객 서비스로',
    titleJa: 'Skybots：RPA から LLM 駆動のインテリジェントカスタマーサービスへ',
    titleEn: 'Skybots: from RPA to LLM-powered customer service',
    speaker: 'Skybots',
    speakerTitle: 'AISG LADP 参与企业',
    speakerTitleKo: 'AISG LADP 참여 기업',
    speakerTitleJa: 'AISG LADP 参加企業',
    speakerTitleEn: 'AISG LADP participating company',
    speakerType: 'industry',
    date: '2026-01-15',
    duration: '05:00',
    summary: '会计科技公司 Skybots 通过 LADP 将 RPA 升级为 LLM 驱动的智能客服,处理复杂会计工作流查询。',
    summaryKo:
      '회계 기술 회사 Skybots는 LADP를 통해 RPA를 LLM 기반 지능형 고객 서비스로 업그레이드하여 복잡한 회계 워크플로우 쿼리를 처리합니다.',
    whyItMatters: 'LADP 培训成果已输出至香港、非洲、不丹，证明新加坡 AI 赋能方法论具备跨国复制价值',
    whyItMattersEn:
      "LADP training outcomes have been exported to Hong Kong, Africa, and Bhutan, demonstrating that Singapore's AI empowerment methodology has cross-border replication value",
    whyItMattersJa:
      'LADP研修成果は香港、アフリカ、ブータンへ出力されており、シンガポールのAI支援方法論が国境を超えた複製価値を有することが証明されています。',
    whyItMattersKo:
      'LADP 교육 성과가 홍콩, 아프리카, 부탄으로 수출되었으며, 싱가포르의 AI 역량 강화 방법론이 국가 간 복제 가치를 갖추고 있음을 증명합니다.',
    summaryJa:
      '会計科学技術企業 Skybots は LADP を通じて RPA を LLM 駆動のインテリジェントカスタマーサービスにアップグレードし、複雑な会計ワークフロー照会を処理した。',
    summaryEn:
      'Accounting-tech firm Skybots used LADP to upgrade RPA into LLM-powered customer service, handling complex accounting workflow queries.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=AdLReCusi4c',
    channel: 'AI Singapore',
  },
  {
    id: 'v042',
    title: '首届新加坡国家 AI 奥林匹克竞赛',
    titleKo: '첫 번째 싱가포르 국가 AI 올림픽 경기',
    titleJa: '最初のシンガポール国家 AI オリンピック競技大会',
    titleEn: 'Inaugural Singapore National AI Olympiad',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-08-05',
    duration: '03:00',
    summary: '由 AI Singapore 与 NTU 联合举办、MOE 和 MDDI 支持的首届国家 AI 奥赛,120 多名学生参与 AI 技能挑战。',
    summaryKo:
      'AI Singapore와 NTU가 공동 개최하고 MOE 및 MDDI가 지원한 첫 번째 국가 AI 올림피아드에 120명 이상의 학생이 AI 기술 챌린지에 참여했습니다.',
    whyItMatters: 'MOE、MDDI 首次为 AI 单独开辟奥赛通道，标志着新加坡从中学阶段就建立起对接北京国际赛的人才选拔体系',
    whyItMattersEn:
      "MOE and MDDI opened a dedicated Olympiad pathway for AI for the first time, marking Singapore's establishment of a talent selection system interfacing with the Beijing International Competition from the secondary school stage",
    whyItMattersJa:
      'MOEとMDDIがAIのためにオリンピアード通路を初めて独立して開設し、シンガポールが中学段階から北京国際大会に連接する人材選抜システムを構築したことを示しています。',
    whyItMattersKo:
      'MOE와 MDDI가 처음으로 AI를 위해 올림피아드 별도 경로를 개설했으며, 중학 단계부터 베이징 국제 대회와 연결되는 인재 선발 체계를 확립했음을 표시합니다.',
    summaryJa:
      'AI Singapore と NTU が共同で開催し、MOE と MDDI がサポートした最初の国家 AI オリンピック、120 名を超える学生が AI スキルチャレンジに参加した。',
    summaryEn:
      'Co-organised by AI Singapore and NTU and supported by MOE and MDDI, the inaugural National AI Olympiad drew over 120 students to compete in AI skills challenges.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=BHGbHhcnDrs',
    channel: 'AI Singapore',
  },
  {
    id: 'v043',
    title: '从国家赛到国际赛: 新加坡 AI 奥赛之路',
    titleKo: '국가 경기에서 국제 경기까지: 싱가포르 AI 올림피아드의 여정',
    titleJa: '国内大会から国際大会へ：シンガポール AI オリンピックの道',
    titleEn: "From national to international: Singapore's path through the AI Olympiad",
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-03',
    duration: '03:00',
    summary: '记录新加坡从建立国家 AI 奥赛到在国际 AI 奥赛取得历史性成绩的历程,展示 AI 人才培养成果。',
    summaryKo:
      '싱가포르가 국가 AI 올림피아드 설립부터 국제 AI 올림피아드에서 역사적 성과를 달성하는 여정을 기록하며 AI 인재 양성 성과를 보여줍니다.',
    whyItMatters:
      '两枚金牌拿下后 NAI 选拔常态化，AI Singapore 已把奥赛变成从青少年到中年的持续人才管道，而非一次性荣誉',
    whyItMattersEn:
      'After winning two gold medals, NAI selection has become routine; AI Singapore has transformed the Olympiad into a continuous talent pipeline from adolescence to middle age, rather than a one-time honor',
    whyItMattersJa:
      '2枚の金メダルを獲得した後、NAI選抜が常態化し、AI Singaporeはすでにオリンピアードを青年から中年までの継続的な人材パイプラインに変えており、ワンタイムの栄誉ではなくなりました。',
    whyItMattersKo:
      '두 개의 금메달을 획득한 후 NAI 선발이 정상화되었으며, AI Singapore가 올림피아드를 청소년부터 중년까지의 지속적인 인재 파이프라인으로 변환했으며, 일회성 영예가 아님을 보여줍니다.',
    summaryJa:
      'シンガポールが国家 AI オリンピックの確立から国際 AI オリンピックでの歴史的成果達成への道を記録し、AI 人材育成の成果を展示した。',
    summaryEn:
      'Tracks Singapore from setting up the National AI Olympiad to landing historic results at the International AI Olympiad — and what it shows about AI talent development.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=apkbbEdI4Co',
    channel: 'AI Singapore',
  },
  {
    id: 'v044',
    title: 'AIAP 人工智能学徒计划: 传承与未来',
    titleKo: 'AIAP 인공지능 도제 계획: 계승과 미래',
    titleJa: 'AIAP 人工知能学徒計画：継承と将来',
    titleEn: 'AIAP AI Apprenticeship Programme: legacy and future',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-06-17',
    duration: '05:00',
    summary: 'AI Singapore 的 AIAP 自 2018 年以来已培养超过 400 名 AI 工程师,面向各背景开放,推动新加坡 AI 人才发展。',
    summaryKo:
      'AI Singapore의 AIAP은 2018년 이래로 400명 이상의 AI 엔지니어를 양성했으며, 다양한 배경의 사람들을 대상으로 개방되어 싱가포르 AI 인재 발전을 추진하고 있습니다.',
    whyItMatters: 'AIAP 自 2018 年运行至今仅产出 400 余名工程师 反映新加坡人才供给规模仍远小于全球 AI 人才争夺战量级',
    whyItMattersEn:
      "AIAP has produced only over 400 engineers since its launch in 2018, reflecting that Singapore's talent supply scale remains far below the scale of the global AI talent competition",
    whyItMattersJa:
      'AIAPは2018年の運営開始から現在まで400人以上のエンジニアを輩出しているだけで、シンガポール人材供給規模がグローバルAI人材競争戦のスケールからはるかに小さいことを反映しています。',
    whyItMattersKo:
      'AIAP가 2018년부터 운영되어 현재까지 400여 명의 엔지니어만 배출했으며, 싱가포르의 인재 공급 규모가 여전히 전 지구적 AI 인재 경쟁 규모보다 훨씬 작음을 반영합니다.',
    summaryJa:
      'AI Singapore の AIAP は 2018 年以来 400 名を超える AI エンジニアを育成し、様々な背景に対して開放し、シンガポール AI 人材発展を推進している。',
    summaryEn:
      "Since 2018, AI Singapore's AIAP has trained more than 400 AI engineers; open to applicants of all backgrounds and a major channel for Singapore's AI talent pipeline.",
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=wuNXn3aF5Js',
    channel: 'AI Singapore',
  },
  {
    id: 'v045',
    title: '2025 全国 AI 学生挑战赛精彩回顾',
    titleKo: '2025 전국 AI 학생 챌린지 대회 하이라이트 회고',
    titleJa: '2025 全国 AI 学生チャレンジ大会の素晴らしい振り返り',
    titleEn: '2025 National AI Student Challenge highlights',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-06-12',
    duration: '04:00',
    summary: '由 AISG 主办、IMDA 支持的全国 AI 学生挑战赛已吸引超 2000 名参与者,培养下一代 AI 人才。',
    summaryKo:
      'AISG가 주최하고 IMDA가 지원하는 전국 AI 학생 챌린지 대회는 이미 2000명 이상의 참여자를 끌어들였으며 차세대 AI 인재를 양성하고 있습니다.',
    whyItMatters:
      'AISG 主办、IMDA 支持的挑战赛以七家企业真题吸引超 2000 名学生参赛，人才培养前移到校园阶段，AWS 借 Regional LLM 项目把这套模式复制到东盟',
    whyItMattersEn:
      'The challenge competition organized by AISG and supported by IMDA attracted over 2,000 students with real questions from seven enterprises, moving talent development forward to the campus stage, and AWS replicated this model across ASEAN through the Regional LLM project',
    whyItMattersJa:
      'AISG主催、IMDA支援のチャレンジ大会は7社の企業の実問題で2,000人以上の学生を引きつけ、人材育成をキャンパス段階に前倒しし、AWSはRegional LLMプロジェクトを通じてこのモデルをASEANに複製しました。',
    whyItMattersKo:
      'AISG가 주최하고 IMDA가 지원하는 챌린지 대회가 일곱 개 기업의 실제 문제로 2,000명 이상의 학생 참가자를 유치했으며, 인재 육성을 캠퍼스 단계로 전진시켰습니다. AWS가 Regional LLM 프로젝트를 통해 이 모델을 동남아시아에 복제했습니다.',
    summaryJa:
      'AISG が主催し、IMDA がサポートした全国 AI 学生チャレンジ大会は既に 2,000 名を超える参加者を吸引し、次世代 AI 人材を育成している。',
    summaryEn:
      'Hosted by AISG and supported by IMDA, the National AI Student Challenge has drawn over 2,000 participants — building the next generation of AI talent.',
    topic: 'AI 人才与教育',
    topicKo: 'AI 인재와 교육',
    topicJa: 'AI 人材と教育',
    topicEn: 'AI Talent & Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=ObJJZqr-Py0',
    channel: 'AI Singapore',
  },
  {
    id: 'v046',
    title: 'LLM 应用开发者计划 (LADP) 介绍',
    titleKo: 'LLM 응용 개발자 계획 (LADP) 소개',
    titleJa: 'LLM アプリケーション開発者計画（LADP）紹介',
    titleEn: 'Introducing the LLM Application Developer Programme (LADP)',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-06-04',
    duration: '12:00',
    summary: 'AISG 与 SGTech 合作的 LADP 计划帮助企业加速 LLM 应用落地,涵盖 prompt engineering 等核心技能。',
    summaryKo:
      'AISG와 SGTech의 협력 LADP 계획은 기업이 LLM 응용 구현을 가속화하도록 돕으며 prompt engineering 등 핵심 기술을 포함합니다.',
    whyItMatters: '生成式 AI 采用率达 65%，但企业普遍缺内部能力，LADP 以 40+ 家企业验证 AISG 押注自建团队而非外包',
    whyItMattersEn:
      'Generative AI adoption has reached 65%, but enterprises commonly lack internal capability; LADP verified across 40+ enterprises that AISG is betting on building in-house teams rather than outsourcing',
    whyItMattersJa:
      '生成型AI採用率は65%に達していますが、企業は普遍的に内部能力に欠け、LADPが40社以上の企業で検証した結果、AIGSはアウトソーシングではなく自建チームに賭けていることが明らかになりました。',
    whyItMattersKo:
      '생성형 AI 채택률이 65%에 도달했으나, 기업들이 일반적으로 내부 역량이 부족하며, LADP가 40개 이상의 기업으로 검증하여 AISG가 아웃소싱이 아닌 자체 팀 구축에 베팅하고 있음을 보여줍니다.',
    summaryJa:
      'AISG と SGTech の協力の LADP 計画は企業が LLM アプリケーション配置を加速するのを支援し、プロンプトエンジニアリングなどの核心スキルを含む。',
    summaryEn:
      'The AISG-SGTech LADP programme helps enterprises accelerate LLM application deployment, covering core skills including prompt engineering.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업과 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=04MaF_DEqPg',
    channel: 'AI Singapore',
  },
  {
    id: 'v047',
    title: '#SGBudget2026: 扶持本地企业',
    titleKo: '#SGBudget2026: 현지 기업 지원',
    titleJa: '#SGBudget2026：地元企業をサポート',
    titleEn: '#SGBudget2026: supporting local enterprises',
    speaker: 'govsg',
    speakerTitle: '新加坡政府',
    speakerTitleKo: '싱가포르 정부',
    speakerTitleJa: 'シンガポール政府',
    speakerTitleEn: 'Government of Singapore',
    speakerType: 'government',
    date: '2026-03-13',
    duration: '01:00',
    summary:
      '2026 财政预算案三大企业扶持举措: 40% 公司税回扣、增强 MRA 国际化补助、通过 Champions of AI 计划与 EIS、PSG 支持企业采用 AI。',
    summaryKo:
      '2026 재정 예산안 3대 기업 지원 조치: 40% 기업세 환급, MRA 국제화 보조금 강화, Champions of AI 계획 및 EIS, PSG를 통한 기업 AI 채택 지원.',
    whyItMatters:
      '新加坡首次把 AI 采用计划命名为 Champions of AI，直接并入 EIS、PSG 常规补助而非新设专项基金，凸显 AI 政策已转向财政杠杆而非战略宣示',
    whyItMattersEn:
      'Singapore has named its AI adoption plan "Champions of AI" for the first time, directly incorporating it into regular EIS and PSG subsidies rather than establishing a new dedicated fund, highlighting that AI policy has shifted toward fiscal leverage rather than strategic announcements',
    whyItMattersJa:
      'シンガポール初となるAI採用計画は「Champions of AI」と命名され、新規基金ではなくEIS、PSG通常補助金に直接統合され、AI政策が戦略的宣言ではなく財政レバレッジにシフトしたことを浮き彫りにしています。',
    whyItMattersKo:
      '싱가포르가 처음으로 AI 채택 계획을 「Champions of AI」라고 명명하여, 새로운 특별 기금을 설립하지 않고 EIS, PSG 같은 정규 보조금으로 직접 통합했으며, AI 정책이 전략적 선언이 아닌 재정적 수단으로 전환했음을 강조합니다.',
    summaryJa:
      '2026 年財政予算案の 3 つの大きな企業サポート措置：40% 法人税リベート、MRA 国際化補助の強化、Champions of AI 計画、EIS、PSG を通じた企業 AI 採用サポート。',
    summaryEn:
      'Three enterprise support measures in Budget 2026: a 40% corporate tax rebate, an enhanced MRA internationalisation grant, and support for enterprise AI adoption via the Champions of AI programme together with EIS and PSG.',
    topic: 'AI 战略与愿景',
    topicKo: 'AI 전략과 비전',
    topicJa: 'AI 戦略とビジョン',
    topicEn: 'AI Strategy & Vision',
    youtubeUrl: 'https://www.youtube.com/watch?v=5jqp4Cw6sqM',
    channel: 'govsg',
  },
  {
    id: 'v048',
    title: '多光谱 AI 技术革新塑料垃圾回收分拣',
    titleKo: '플라스틱 폐기물 회수 분류의 다중분광 AI 기술 혁신',
    titleJa: 'マルチスペクトラム AI 技術が塑料廃棄物の分別回収を革新',
    titleEn: 'Multispectral AI transforms plastic waste recycling and sorting',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-01',
    duration: '03:00',
    summary: 'AISG 100E 项目应用多光谱 AI 技术,把塑料垃圾分拣从人工流程转为自动化,解决回收行业长期痛点。',
    summaryKo:
      'AISG 100E 프로젝트는 다중 스펙트럼 AI 기술을 적용하여 플라스틱 쓰레기 분류를 수작업 프로세스에서 자동화로 전환하고 재활용 산업의 장기 문제를 해결합니다.',
    whyItMatters: '2023 年回收率仅 5% 暴露循环经济短板，AISG 100E 项目为 AI Singapore 探出工业机器人部署路径',
    whyItMattersEn:
      'A recycling rate of only 5% in 2023 exposed shortfalls in the circular economy; the AISG 100E project explored deployment pathways for industrial robots for AI Singapore',
    whyItMattersJa:
      '2023年リサイクル率はわずか5%にとどまり、サーキュラーエコノミーの弱点を露呈させ、AISG 100EプロジェクトがAI Singaporeのための産業用ロボット配置経路を探り出しました。',
    whyItMattersKo:
      '2023년 회수율이 단 5%에 불과해 순환 경제의 약점을 드러냈으며, AISG 100E 프로젝트가 AI Singapore를 위한 산업용 로봇 배포 경로를 탐색했습니다.',
    summaryJa:
      'AISG 100E プロジェクトはマルチスペクトラム AI 技術を応用し、塑料廃棄物分別をマニュアルプロセスから自動化へと転換し、回収産業の長年の痛点を解決した。',
    summaryEn:
      'An AISG 100E project applies multispectral AI to convert plastic-waste sorting from a manual process to an automated one, addressing a long-standing pain point in the recycling industry.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=CCRKmYRFCKg',
    channel: 'AI Singapore',
  },
  {
    id: 'v049',
    title: 'RAPIER: 放射—病理影像信息交换资源',
    titleKo: 'RAPIER: 방사선-병리학 영상 정보 교환 자원',
    titleJa: 'RAPIER：放射線科・病理学画像情報交換リソース',
    titleEn: 'RAPIER: Radiology-Pathology Imaging Exchange Resource',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-01',
    duration: '03:00',
    summary: 'AISG 与 A*STAR、SGH、NCCS 合作开发 AI 算法,从放射与病理档案中自动检测、描述并诊断肝脏病变。',
    summaryKo:
      'AISG, A*STAR, SGH, NCCS가 협력하여 방사선 및 병리 기록에서 간 병변을 자동 탐지, 설명 및 진단하는 AI 알고리즘을 개발합니다.',
    whyItMatters:
      'STEATstat 从 AISG 项目走到 SGH 病理科实际部署，成为新加坡少有的 AI 研究转化临床工具先例，对 30% 受累的 MAFLD 人群尤为关键',
    whyItMattersEn:
      "STEATstat progressed from an AISG project to actual deployment in SGH's pathology department, becoming one of Singapore's rare examples of AI research converting to a clinical tool, particularly crucial for the 30% affected MAFLD population",
    whyItMattersJa:
      'STEATstatはAISGプロジェクトからSGH病理学科の実運用に到達し、シンガポール稀なAI研究の臨床ツール応用先例となり、30%の影響を受けたMAFLD患者群にとって特に重要です。',
    whyItMattersKo:
      'STEATstat이 AISG 프로젝트에서 SGH 병리학과의 실제 배포로 진행되었으며, 싱가포르의 드문 AI 연구의 임상 도구 전환 사례가 되었으며, 30% 영향을 받는 MAFLD 인구에 특히 중요합니다.',
    summaryJa:
      'AISG と A*STAR、SGH、NCCS の協力は AI アルゴリズムを開発し、放射線科および病理学ファイルから自動的に肝臓病変を検出、説明および診断した。',
    summaryEn:
      'AISG partners with A*STAR, SGH and NCCS to develop AI algorithms that automatically detect, describe and diagnose liver lesions from radiology and pathology archives.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=3gSNJhrRQt0',
    channel: 'AI Singapore',
  },
  {
    id: 'v050',
    title: '面向电商应用的语义感知多模态多语言深度学习系统',
    titleKo: '전자상거래 응용을 위한 의미 인식 다모달 다언어 딥러닝 시스템',
    titleJa: '電子商取引応用向けセマンティック対応マルチモーダルマルチ言語深層学習システム',
    titleEn: 'Semantic-aware multimodal multilingual deep learning systems for e-commerce',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-01',
    duration: '03:00',
    summary: 'AISG 100E 项目针对电商场景的多语言、多模态环境,解决低资源语言标注数据稀缺与复杂语义学习两大挑战。',
    summaryKo:
      'AISG 100E 프로젝트는 전자상거래 시나리오의 다언어, 다모달 환경을 대상으로 저자원 언어 주석 데이터 부족과 복잡한 의미 학습이라는 두 가지 과제를 해결합니다.',
    whyItMatters:
      'AISG 100E 项目将胜率从 18% 拉到 56% 的模型送进 Shopee 产线，证明新加坡应用型 AI 资助能补上全球大厂忽视的东南亚小语种缺口',
    whyItMattersEn:
      "The AISG 100E project deployed a model that improved the win rate from 18% to 56% into Shopee's production line, proving that Singapore's applied AI funding can fill the gap in Southeast Asian minority languages overlooked by global tech giants",
    whyItMattersJa:
      'AISG 100Eプロジェクトが成功率を18%から56%に引き上げたモデルをShopee生産ラインに導入し、シンガポール応用型AI資金がグローバル大手企業が無視する東南アジア少数言語ギャップを埋めることができることが証明されました。',
    whyItMattersKo:
      'AISG 100E 프로젝트가 승률을 18%에서 56%로 끌어올린 모델을 Shopee 생산 라인에 투입했으며, 싱가포르의 응용형 AI 자금이 글로벌 대형 기업이 간과하는 동남아시아 소수 언어 격차를 메울 수 있음을 증명합니다.',
    summaryJa:
      'AISG 100E プロジェクトは電子商取引シーン向けマルチ言語、マルチモーダル環境を対象とし、低資源言語アノテーションデータの稀少性と複雑なセマンティック学習の 2 つの大きなチャレンジを解決している。',
    summaryEn:
      'An AISG 100E project tackles multilingual, multimodal e-commerce settings, addressing two key challenges: scarcity of labelled data for low-resource languages and complex semantic learning.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=9ONmek-BRWE',
    channel: 'AI Singapore',
  },
  {
    id: 'v051',
    title: '面向电商平台的实时深度学习欺诈检测网络',
    titleKo: '전자상거래 플랫폼을 위한 실시간 딥러닝 사기 탐지 네트워크',
    titleJa: '電子商取引プラットフォーム向けリアルタイム深層学習詐欺検出ネットワーク',
    titleEn: 'Real-time deep learning fraud detection networks for e-commerce platforms',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-01',
    duration: '03:00',
    summary: 'AISG 100E 项目研发新型机器学习技术与网络架构,应对企业数字化过程中日益加剧的数字欺诈风险。',
    summaryKo:
      'AISG 100E 프로젝트는 기업 디지털화 과정에서 점점 증가하는 디지털 사기 위험에 대응하기 위해 새로운 기계 학습 기술과 네트워크 아키텍처를 개발합니다.',
    whyItMatters: 'AISG 100E 项目让 NUS 图神经网络研究直接对接 Grab 生产环境，证明新加坡产学研转化能真正走到部署这一步',
    whyItMattersEn:
      "The AISG 100E project connected NUS's graph neural network research directly with Grab's production environment, proving that Singapore's industry-academia-research conversion can truly reach the deployment stage",
    whyItMattersJa:
      'AISG 100EプロジェクトがNUSグラフニューラルネットワーク研究をGrab本番環境に直接接続させ、シンガポール産学研協働転換が本当にデプロイ段階に到達できることが証明されました。',
    whyItMattersKo:
      'AISG 100E 프로젝트가 NUS의 그래프 신경망 연구를 Grab의 생산 환경과 직접 연결했으며, 싱가포르의 산학연 전환이 실제로 배포 단계에 도달할 수 있음을 증명합니다.',
    summaryJa:
      'AISG 100E プロジェクトは新型機械学習技術とネットワークアーキテクチャを研究開発し、企業デジタル化プロセスにおいて加速する数字詐欺リスクに対応した。',
    summaryEn:
      'An AISG 100E project develops new machine-learning techniques and network architectures to address the growing risk of digital fraud as enterprises digitalise.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=vI8xWuxI974',
    channel: 'AI Singapore',
  },
  {
    id: 'v052',
    title: '地下交通基础设施监测的多变量时间序列建模',
    titleKo: '지하 교통 기반시설 모니터링의 다변량 시계열 모델링',
    titleJa: '地下交通基盤施設監視用多変量時間シリーズモデリング',
    titleEn: 'Multivariate time-series modelling for monitoring underground transport infrastructure',
    speaker: 'AI Singapore',
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleKo: 'AI 연구 및 인재 양성 기관',
    speakerTitleJa: 'AI 研究と人材育成機関',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
    date: '2025-07-01',
    duration: '03:00',
    summary:
      'AISG 100E 项目把 AI 技术应用于智能传感系统,实现对高风险地下交通基础设施潜在故障的可扩展检测、诊断与预测。',
    summaryKo:
      'AISG 100E 프로젝트는 AI 기술을 지능형 센싱 시스템에 적용하여 고위험 지하 교통 기반시설의 잠재적 결함에 대한 확장 가능한 탐지, 진단 및 예측을 실현합니다.',
    whyItMatters:
      'AISG 100E 资助把 NTU 与 LTA、SBS Transit 的地铁传感器研究做成实战试点,能否推广全网是新加坡基建 AI 化的真正考验',
    whyItMattersEn:
      "AISG 100E funding turned NTU's metro sensor research with LTA and SBS Transit into a live pilot; whether it can scale across the entire network is the true test of Singapore's infrastructure AI transformation",
    whyItMattersJa:
      'AISG 100E資金がNTUとLTA、SBS Transitの地下鉄センサー研究を実戦パイロットに実現させ、全ネットワークへの展開が可能かどうかがシンガポールインフラAI化の本当のテストです。',
    whyItMattersKo:
      'AISG 100E 자금이 NTU와 LTA, SBS Transit의 지하철 센서 연구를 실전 시범으로 전환했으며, 전 네트워크로의 확대 가능 여부는 싱가포르의 기반시설 AI 화의 진정한 시험입니다.',
    summaryJa:
      'AISG 100E プロジェクトは AI 技術をインテリジェントセンシングシステムに応用し、高リスク地下交通基盤施設の潜在的故障のスケーラブルな検出、診断および予測を実現した。',
    summaryEn:
      'An AISG 100E project applies AI to smart sensing systems, enabling scalable detection, diagnosis and prediction of potential failures in high-risk underground transport infrastructure.',
    topic: 'AI 产业与应用',
    topicKo: 'AI 산업 및 응용',
    topicJa: 'AI 産業と応用',
    topicEn: 'AI Industry & Applications',
    youtubeUrl: 'https://www.youtube.com/watch?v=JCeHoMJLZMs',
    channel: 'AI Singapore',
  },
];

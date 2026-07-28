export interface TimelineEvent {
  // Phase 1: id is `evt-${year}` for single-event years; multi-event years
  // get `evt-${year}-${slug}` disambiguation. Hand-curated for stability.
  id?: string;
  year: number;
  date?: string; // optional precise YYYY-MM-DD
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
  tags?: string[];
  tagsEn?: string[];
  tagsJa?: string[];
  tagsKo?: string[];
  // Phase 1 cross-refs (hand-curated over time).
  personIds?: string[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
  topicIds?: string[]; // controlled topic ids (src/data/topics.ts); explicit values override topic-mappings
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt-2027',
    year: 2027,
    title: '新加坡主办国际 AI 奥林匹克竞赛',
    topicIds: ['talent-education', 'international'],
    titleKo: '싱가포르가 국제 AI 올림피아드를 주최합니다.',
    titleJa: 'シンガポールが国際 AI オリンピック競技大会を主催',
    titleEn: 'Singapore Hosts International AI Olympiad',
    description:
      '新加坡将首次举办 International Olympiad in AI (IOAI)，将全球 AI 青年人才汇聚狮城，展现新加坡在 AI 教育和人才培养领域的国际领导力。',
    descriptionKo:
      '싱가포르가 처음으로 International Olympiad in AI (IOAI)를 개최하여 전 세계 AI 청년 인재를 싱가포르에 모으고, AI 교육 및 인재 양성 분야에서 싱가포르의 국제적 리더십을 보여줄 것입니다.',
    descriptionJa:
      'シンガポールは初めて International Olympiad in AI (IOAI) を開催し、世界中の AI 若年人材をライオンシティに集め、AI 教育および人材育成分野におけるシンガポールの国際指導力を示します。',
    descriptionEn:
      "Singapore will host the International Olympiad in AI (IOAI) for the first time, drawing the world's top young AI talent to the Lion City and underlining Singapore's lead in AI education and talent development.",
    tags: ['人才', '国际'],
    tagsEn: ['Talent', 'International'],
    tagsJa: ['人材', '国際'],
    tagsKo: ['인재', '국제'],
  },
  {
    id: 'evt-2026-regulatory-machinery-goes-live',
    year: 2026,
    date: '2026-07-01',
    title: 'AI 监管机器上线：在线安全委员会运作、数字基础设施法案咨询、AISG 换帅',
    topicIds: ['governance-regulation', 'infrastructure-research'],
    titleKo: 'AI 규제 기계 가동: 온라인안전위원회 운영, 디지털 인프라 법안 협의, AISG 수장 교체',
    titleJa: 'AI 規制マシンが稼働：オンライン安全委員会の運用開始、デジタルインフラ法案の協議、AISG のトップ交代',
    titleEn: 'Regulatory Machinery Goes Live: OSC Operations, Digital Infrastructure Bill, AISG Leadership Change',
    description:
      '2026 年年中，新加坡把过去两年写在纸上的 AI 治理框架逐一变成运转中的机构与法条。6 月 29 日，在线安全委员会（OSC）正式开始运作，受害者可就深伪与非自愿私密影像直接投诉，平台须在限期内处理。7 月 1 日，MDDI 与 IMDA 就《数字基础设施法案》草案启动公众咨询（7 月 22 日截止）——关键 IT 负载 ≥10 兆瓦的数据中心与年收入 ≥1 亿新元的 IaaS/PaaS 云服务须申领「重大 FDI 牌照」，≥3 兆瓦的数据中心须持「数据中心牌照」并满足强制 PUE 能效门槛，AI 算力底座第一次被纳入硬法监管。同日，Christian Wolfrum 接替创始执行主席何德华出任 AI Singapore 执行主席，何德华在任九年间交付 300+ AI 项目、培养近 500 名本地 AI 工程师、推动 SEA-LION 开源模型。7 月 20 日，PDPC 在新加坡数据节发布《生成式 AI 个人数据使用指南》，要求组织明说个人数据被用于开发或改进生成式 AI 模型；IMDA 同日发布《生成式 AI 聊天机器人透明度指南》，提出像药品标签一样的「聊天机器人信息卡」——数据层与应用层的双层问责就此成形。',
    descriptionKo:
      '2026년 중반, 싱가포르는 지난 2년간 문서로만 존재하던 AI 거버넌스 프레임워크를 하나씩 작동하는 기관과 법조문으로 전환했습니다. 6월 29일 온라인안전위원회(OSC)가 공식 가동되어 피해자가 딥페이크와 비동의 사적 이미지에 대해 직접 신고할 수 있게 되었으며, 플랫폼은 기한 내에 처리해야 합니다. 7월 1일 MDDI와 IMDA는 《디지털 인프라 법안》 초안에 대한 공개 협의를 시작했습니다(7월 22일 마감)——핵심 IT 부하 ≥10메가와트 데이터 센터와 연간 수익 ≥1억 싱가포르 달러의 IaaS/PaaS 클라우드 서비스는 「주요 FDI 라이선스」를 신청해야 하고, ≥3메가와트 데이터 센터는 「데이터 센터 라이선스」를 보유하고 강제 PUE 에너지 효율 기준을 충족해야 하며, AI 컴퓨팅 기반이 처음으로 강행법 규제에 편입되었습니다. 같은 날 Christian Wolfrum이 창립 집행회장 Ho Teck Hua의 뒤를 이어 AI Singapore 집행회장으로 취임했습니다. Ho Teck Hua는 재임 9년간 300개 이상의 AI 프로젝트를 수행하고 약 500명의 현지 AI 엔지니어를 양성했으며 SEA-LION 오픈소스 모델을 추진했습니다. 7월 20일 PDPC는 싱가포르 데이터 페스티벌에서 《생성형 AI 개인정보 사용 지침》을 발표하여 조직이 개인정보가 생성형 AI 모델의 개발 또는 개선에 사용된다고 명시하도록 요구했습니다. IMDA는 같은 날 《생성형 AI 챗봇 투명성 지침》을 발표하여 의약품 라벨과 같은 「챗봇 정보 카드」를 제안했습니다——데이터 계층과 애플리케이션 계층의 이중 책임이 이렇게 형성되었습니다.',
    descriptionJa:
      '2026 年半ば、シンガポールは過去 2 年間紙の上にあった AI ガバナンス枠組みを、一つずつ稼働する機関と法条文に変えていった。6 月 29 日、オンライン安全委員会（OSC）が正式に運用を開始し、被害者はディープフェイクや非同意の私的画像について直接申し立てができるようになり、プラットフォームは期限内に対処する義務を負う。7 月 1 日、MDDI と IMDA は《デジタルインフラ法案》草案についてパブリックコンサルテーションを開始した（7 月 22 日締切）——重要 IT 負荷 ≥10 メガワットのデータセンターと年間収益 ≥1 億シンガポールドルの IaaS/PaaS クラウドサービスは「主要 FDI ライセンス」の申請が必要で、≥3 メガワットのデータセンターは「データセンターライセンス」を保有し強制 PUE エネルギー効率基準を満たす必要があり、AI コンピューティング基盤が初めて強行法規制に組み込まれた。同日、Christian Wolfrum が創設執行会長の何德華の後任として AI Singapore 執行会長に就任した。何德華は在任 9 年間で 300 以上の AI プロジェクトを実施し、約 500 名の現地 AI エンジニアを育成、SEA-LION オープンソースモデルを推進した。7 月 20 日、PDPC はシンガポールデータフェスティバルで《生成 AI 個人データ利用ガイドライン》を発表し、個人データが生成 AI モデルの開発または改善に使われることを組織が明言するよう求めた。IMDA は同日《生成 AI チャットボット透明性ガイドライン》を発表し、医薬品ラベルのような「チャットボット情報カード」を提唱した——データ層とアプリケーション層の二層的アカウンタビリティがここに形を得た。',
    descriptionEn:
      "Through mid-2026, Singapore turned two years of paper AI-governance frameworks into working institutions and statutes. On 29 June the Online Safety Commission (OSC) began operations, letting victims file complaints directly over deepfakes and non-consensual intimate images, with platforms required to act within fixed deadlines. On 1 July, MDDI and IMDA opened public consultation on the draft Digital Infrastructure Bill (closing 22 July) — data centres with ≥10MW critical IT load and IaaS/PaaS cloud services earning ≥S$100m a year must obtain a 'major FDI licence', while data centres ≥3MW need a 'DC licence' and must meet mandatory PUE efficiency thresholds, bringing the AI compute layer under hard-law regulation for the first time. The same day, Christian Wolfrum succeeded founding Executive Chairman Ho Teck Hua at AI Singapore; over nine years Ho delivered 300+ AI projects, trained close to 500 local AI engineers, and championed the SEA-LION open-source models. On 20 July, PDPC issued its Advisory Guidelines on the Use of Personal Data in Generative AI at the Singapore Data Festival, requiring organisations to state plainly that personal data is used to develop or improve a generative AI model; IMDA launched Generative AI Chatbot Transparency Guidelines the same day, proposing a medicine-label-style Chatbot Information Card — Singapore's two-layer accountability design, one at the data layer and one at the application layer.",
    tags: ['监管', '基础设施', '治理'],
    tagsEn: ['Regulation', 'Infrastructure', 'Governance'],
    tagsJa: ['規制', 'インフラ', 'ガバナンス'],
    tagsKo: ['규제', '인프라', '거버넌스'],
    personIds: ['christian-wolfrum', 'ho-teck-hua', 'josephine-teo'],
    relatedPolicyIds: [
      'digital-infrastructure-bill-consultation-2026',
      'pdpc-advisory-guidelines-personal-data-in-generative-ai-2026',
      'imda-generative-ai-chatbot-transparency-guidelines-2026',
    ],
  },
  {
    id: 'evt-2026-anthropic-series-h-gic-temasek',
    year: 2026,
    date: '2026-05-28',
    title: 'Anthropic 650 亿美元 Series H：GIC 共同领投、淡马锡首次入股',
    topicIds: ['startups-investment'],
    titleKo: 'Anthropic 650억 달러 Series H: GIC 공동 리드, 테마섹 첫 투자',
    titleJa: 'Anthropic 650 億ドル Series H：GIC 共同リード、テマセク初出資',
    titleEn: "Anthropic's $65B Series H: GIC co-leads, Temasek takes first stake",
    description:
      'Anthropic 完成 650 亿美元 Series H 融资，投后估值 9650 亿美元。GIC 以共同领投身份连续第三轮加注（此前为 2025-09 Series F 参与、2026-02 Series G 共同领投），淡马锡以 significant investor 身份首次入股——新加坡两家主权基金同时出现在同一家前沿 AI 公司的股东名单上。',
    descriptionKo:
      'Anthropic이 650억 달러 Series H 펀딩을 완료했고 포스트머니 밸류에이션은 9650억 달러입니다. GIC는 공동 리드로 3개 라운드 연속 투자했으며(2025-09 Series F 참여, 2026-02 Series G 공동 리드에 이어), 테마섹은 significant investor로 처음 투자했습니다—싱가포르 두 국부펀드가 같은 프런티어 AI 기업의 주주 명단에 동시에 등장했습니다.',
    descriptionJa:
      'Anthropic は 650 億ドルの Series H 資金調達を完了し、ポストマネー評価額は 9650 億ドル。GIC は共同リードとして 3 ラウンド連続で投資（2025-09 Series F 参加、2026-02 Series G 共同リードに続く）、テマセクは significant investor として初出資——シンガポールの 2 つのソブリンファンドが同じフロンティア AI 企業の株主名簿に同時に登場しました。',
    descriptionEn:
      "Anthropic closed a $65 billion Series H at a $965 billion post-money valuation. GIC co-led — its third consecutive round after participating in the September 2025 Series F and co-leading the February 2026 Series G — and Temasek took its first stake as a significant investor, putting Singapore's two sovereign funds on the same frontier AI company's cap table.",
    tags: ['资本', '国际'],
    tagsEn: ['Capital', 'International'],
    tagsJa: ['資本', '国際'],
    tagsKo: ['자본', '국제'],
    relatedPostSlugs: ['sovereign-capital-frontier-ai'],
  },
  {
    id: 'evt-2026-atxsummit-real-world-ai-deployment',
    year: 2026,
    date: '2026-05-20',
    title: 'ATxSummit 2026：NAIS 更新与真实场景 AI 部署包',
    topicIds: ['national-strategy'],
    titleKo: 'ATxSummit 2026: NAIS 업데이트와 실제 현장 AI 배포 패키지',
    titleJa: 'ATxSummit 2026：NAIS 更新と実世界 AI 導入パッケージ',
    titleEn: 'ATxSummit 2026: NAIS Refresh and Real-World AI Deployment Package',
    description:
      'Josephine Teo 在 ATxSummit 2026 将 NAIS 更新定义为“double-click rather than a system reboot”。官方重点不是“国家 AI 任务 2030”这样的新战略，而是把 NAIS 2.0 落到 4 个国家 AI 任务（Connectivity、Advanced Manufacturing、Healthcare、Finance）和一组真实部署项目：National AI Impact Programme 目标 10,000 家 SME、Champions of AI、NVIDIA Singapore AI Research Lab、Punggol Digital District 多运营商机器人 testbed、OpenAI for Singapore（S$300M+、美国以外首个 Applied AI Lab、200+ 技术岗）、Google AI Agents Sandbox、更新版 Agentic AI Governance Framework 与 AI TAP。',
    descriptionKo:
      'Josephine Teo는 ATxSummit 2026에서 NAIS 업데이트를 “system reboot”가 아니라 “double-click”이라고 정의했습니다. 공식 초점은 “National AI Mission 2030” 같은 새 전략이 아니라 NAIS 2.0을 4개 국가 AI 과제(Connectivity, Advanced Manufacturing, Healthcare, Finance)와 실제 배포 프로젝트로 옮기는 것입니다. 주요 내용은 National AI Impact Programme의 10,000개 SME 목표, Champions of AI, NVIDIA Singapore AI Research Lab, Punggol Digital District 다중 운영자 로봇 테스트베드, OpenAI for Singapore(S$300M+, 미국 밖 첫 Applied AI Lab, 200개 이상 기술 직무), Google AI Agents Sandbox, 업데이트된 Agentic AI Governance Framework, AI TAP입니다.',
    descriptionJa:
      'Josephine Teo は ATxSummit 2026 で NAIS 更新を「system reboot」ではなく「double-click」と位置づけました。公式の焦点は「National AI Mission 2030」のような新戦略ではなく、NAIS 2.0 を 4 つの国家 AI ミッション（Connectivity、Advanced Manufacturing、Healthcare、Finance）と実導入プロジェクトに落とすことです。National AI Impact Programme の 10,000 社 SME 目標、Champions of AI、NVIDIA Singapore AI Research Lab、Punggol Digital District 多事業者ロボット testbed、OpenAI for Singapore（S$300M+、米国外初の Applied AI Lab、200 以上の技術職）、Google AI Agents Sandbox、更新版 Agentic AI Governance Framework、AI TAP が含まれます。',
    descriptionEn:
      'At ATxSummit 2026, Josephine Teo framed the NAIS update as a “double-click rather than a system reboot.” The official focus is not a new “National AI Mission 2030” strategy, but translating NAIS 2.0 into four National AI Missions (Connectivity, Advanced Manufacturing, Healthcare, Finance) and a real-world deployment package: the National AI Impact Programme target of 10,000 SMEs, Champions of AI, the NVIDIA Singapore AI Research Lab, the Punggol Digital District multi-operator robotics testbed, OpenAI for Singapore (S$300M+, first Applied AI Lab outside the US, 200+ technical roles), the Google AI Agents Sandbox, the updated Agentic AI Governance Framework, and AI TAP.',
    tags: ['战略', '产业', '治理', '国际'],
    tagsEn: ['Strategy', 'Industry', 'Governance', 'International'],
    tagsJa: ['戦略', '産業', 'ガバナンス', '国際'],
    tagsKo: ['전략', '산업', '거버넌스', '국제'],
    personIds: ['josephine-teo'],
    relatedPolicyIds: [
      'nais-update-2026',
      'nvidia-singapore-ai-research-lab-2026',
      'pdd-multi-operator-robot-testbed-2026',
      'openai-for-singapore-2026',
      'model-ai-governance-framework-for-agentic-ai',
      'google-singapore-ai-agents-sandbox-2026',
      'ai-tester-accreditation-programme-2026',
    ],
  },
  {
    id: 'evt-2026-manus-blocked',
    year: 2026,
    date: '2026-04-27',
    title: 'Meta–Manus 收购被中国 NDRC 否决：「Singapore washing」红线划定',
    topicIds: ['startups-investment', 'international'],
    titleKo: '메타–매누스 인수, 중국 NDRC가 부결: 「Singapore washing」적색선 획정',
    titleJa: 'Meta–Manus 買収が中国 NDRC に否決：「Singapore washing」レッドラインが設定',
    titleEn: 'China Blocks Meta–Manus Acquisition: A Red Line Against "Singapore Washing"',
    description:
      '4 月 27 日，中国国家发展和改革委员会（NDRC）正式叫停 Meta 对 Manus 的 20 亿美元收购，援引"国家安全"理由——这是中国首例以国安为由否决 AI 领域外资并购。NDRC 划定三条红线：技术主权、数据主权、国家安全。Manus 母公司 Butterfly Effect 由肖弘、季逸超 2022 年在中国创立，2025 年中将总部迁至新加坡（约 40 名核心技术员从北京搬迁，120 人团队多数被裁），由新加坡 Butterfly Effect 实体接管海外业务。Meta 于 2025 年 12 月宣布收购。2026 年 1 月中国监管启动审查，3 月末肖弘与季逸超被约谈并限制出境。事件直接挑战新加坡作为「AI 离岸中转枢纽」的战略叙事——多家国际媒体（Asia Times、Foreign Policy）将此案定义为「Singapore washing 的极限」，意指仅靠迁注册地无法绕开来源国监管。',
    descriptionKo:
      '4월 27일 중국 국가발전개혁위원회(NDRC)가 메타의 매누스 인수 건 20억 달러를 공식 중단했으며, 「국가 안보」를 이유로 들었습니다. 이는 중국이 AI 분야 외국인 투자 인수합병을 국가 안보를 이유로 부결한 첫 번째 사례입니다. NDRC는 세 가지 적색선을 그었습니다: 기술 주권, 데이터 주권, 국가 안보입니다. 매누스의 모회사 Butterfly Effect는 샤오 홍, 지 이초가 2022년에 중국에서 설립했으며, 2025년 중반에 본부를 싱가포르로 이전했습니다(약 40명의 핵심 기술 직원이 베이징에서 이전했고, 120명 규모 팀의 대부분이 정리해고됨). 싱가포르 Butterfly Effect 법인이 해외 사업 운영을 인수했습니다. 메타는 2025년 12월 인수를 공표했습니다. 2026년 1월 중국 규제 당국이 심사를 개시했고, 3월 말 샤오 홍과 지 이초는 소환되어 면담을 받았으며 출국이 제한되었습니다. 이 사건은 싱가포르가 「AI 역외 중전 허브」로서의 전략적 내러티브에 직접 도전했습니다. 다수의 국제 매체(Asia Times, Foreign Policy)는 이 사건을 「Singapore washing의 극한」으로 정의했으며, 이는 등록지 이전만으로는 원산지 국가의 규제를 우회할 수 없다는 의미입니다.',
    descriptionJa:
      '4 月 27 日、中国の国家発展改革委員会（NDRC）は、Meta による Manus の 20 億ドル買収を正式に停止し、「国家安全保障」を理由に挙げました——これは中国が初めて国家安全保障を理由に AI 分野での外国資本による買収を否決したケースです。NDRC は 3 つのレッドラインを設定しました：技術主権、データ主権、国家安全保障。Manus の親会社である Butterfly Effect は、肖弘と季逸超が 2022 年に中国で設立し、2025 年中盤に本部をシンガポールに移しました（約 40 名のコア技術スタッフが北京から移動、120 人のチームの大部分がレイオフされた）。シンガポールの Butterfly Effect エンティティが海外業務を引き継ぎました。Meta は 2025 年 12 月に買収を発表しました。2026 年 1 月、中国の監視機関は審査を開始し、3 月末に肖弘と季逸超は尋問されて出国が制限されました。このイベントはシンガポールが「AI オフショア中継ハブ」として機能するという戦略的叙述に直接異議を唱えています——複数の国際メディア（Asia Times、Foreign Policy）はこのケースを「Singapore washing の極限」と定義し、登記地の移転だけではソース国の規制を回避できないことを意味しています。',
    descriptionEn:
      'On 27 April, China\'s National Development and Reform Commission (NDRC) formally blocked Meta\'s US$2B acquisition of Manus on national-security grounds — the first time China has vetoed a foreign AI acquisition under that rationale. NDRC drew three red lines: technology sovereignty, data sovereignty, and national security. Manus\'s parent Butterfly Effect was founded in China in 2022 by Xiao Hong and Ji Yichao, then relocated its HQ to Singapore in mid-2025 (~40 core technical staff moved from Beijing while most of the 120-person team was laid off), with the Singapore Butterfly Effect entity taking over operations outside China. Meta announced the acquisition in December 2025. Chinese regulators opened a review in January 2026; by late March, Xiao and Ji had been summoned to NDRC and barred from leaving China. The case directly challenges Singapore\'s strategic narrative as an "AI offshore transit hub" — international press (Asia Times, Foreign Policy) framed it as "the limits of Singapore washing," meaning that re-domiciling alone cannot escape source-country oversight.',
    tags: ['治理', '产业', '国际', '数据主权'],
    tagsEn: ['Governance', 'Industry', 'International', 'Data sovereignty'],
    tagsJa: ['ガバナンス', '産業', '国際', 'データ主権'],
    tagsKo: ['거버넌스', '산업', '국제', '데이터 주권'],
    relatedPostSlugs: [],
  },
  {
    id: 'evt-2026-sc42-plenary',
    year: 2026,
    date: '2026-04-20',
    title: 'ISO/IEC 42119-8 提案：全球首个生成式 AI 测试国际标准',
    topicIds: ['safety-ethics', 'international'],
    titleKo: 'ISO/IEC 42119-8 제안: 생성형 AI 테스트 국제 표준 세계 최초',
    titleJa: 'ISO/IEC 42119-8 提案：生成型 AI テストの世界初の国際標準',
    titleEn: 'ISO/IEC 42119-8: First International Standard for Testing Generative AI',
    description:
      '4 月 20-24 日，第 17 届 ISO/IEC JTC 1/SC 42 全体会议在新加坡举行——这是 SC 42（全球 AI 标准制定核心机构）首次在东盟召开，由 IMDA 与 Enterprise Singapore 联合主办，汇集 35 个以上国家、250 多位 AI 专家（含美、英、中、日、德、法、韩）。开幕日新加坡正式提交 ISO/IEC 42119-8 标准草案，聚焦生成式 AI 测试方法标准化，两个核心方向：基准测试（benchmarking）统一"考什么、怎么评分"，红队测试（red teaming）标准化"隐藏风险怎么找出来"。如获通过将是全球首个针对生成式 AI 系统的国际测试标准。提案建立在 IMDA 已有的 AI Verify Toolkit、LLM 应用测试 Starter Kit 和 Global AI Assurance Sandbox 基础上。IMDA 现任 CEO Ng Cher Pong 在开幕致辞中表示："标准制定不能以龟速推进——否则将被 AI 高速变革所淘汰。"会议同期，IMDA 与 EnterpriseSG 还为东盟成员国举办了能力建设培训。',
    descriptionKo:
      '4월 20~24일 제17차 ISO/IEC JTC 1/SC 42 전체 회의가 싱가포르에서 개최되었습니다. 이는 SC 42(전 지구적 AI 표준 제정의 핵심 기구)가 동남아시아에서 처음으로 개최한 회의이며, IMDA와 Enterprise Singapore가 공동으로 주최했으며, 35개 이상 국가와 250명 이상의 AI 전문가(미국, 영국, 중국, 일본, 독일, 프랑스, 한국 포함)가 모였습니다. 개막일 싱가포르가 공식적으로 ISO/IEC 42119-8 표준 초안을 제출했으며, 생성형 AI 테스트 방법 표준화에 초점을 맞추었습니다. 두 가지 핵심 방향은 다음과 같습니다: 벤치마크 테스트(benchmarking)는 「무엇을 평가할 것인가, 어떻게 채점할 것인가」를 통일하고, 적팀 테스트(red teaming)는 「숨겨진 위험을 어떻게 찾아낼 것인가」를 표준화합니다. 승인될 경우 생성형 AI 시스템을 대상으로 한 세계 최초의 국제 테스트 표준이 될 것입니다. 제안은 IMDA가 이미 보유한 AI Verify Toolkit, LLM 응용 테스트 Starter Kit 및 Global AI Assurance Sandbox를 기반으로 합니다. IMDA 현 CEO Ng Cher Pong은 개막식 기조 연설에서 「표준 제정은 느린 속도로 진행될 수 없습니다. 그렇지 않으면 AI의 고속 변혁으로 인해 도태될 것입니다」라고 말했습니다. 회의 기간 동안 IMDA와 EnterpriseSG는 동남아시아 회원국을 위한 역량 강화 교육도 개최했습니다.',
    descriptionJa:
      '4 月 20 日～24 日、第 17 回 ISO/IEC JTC 1/SC 42 全体会議がシンガポールで開催されました——これは SC 42（世界 AI 標準設定のコアインスティテューション）が ASEAN で初めて開催された会議で、IMDA および Enterprise Singapore が共同主催し、35 カ国以上、250 名以上の AI 専門家（米国、英国、中国、日本、ドイツ、フランス、韓国を含む）を集めました。開幕日、シンガポールは正式に ISO/IEC 42119-8 標準草案を提出し、生成型 AI テスト方法の標準化に焦点を当て、2 つのコア方向：ベンチマーク（benchmarking）は「何をテストするか、どのようにスコアを付けるか」を統一し、レッドチーム テスト（red teaming）は「隠された危険をどのように見つけるか」を標準化します。承認されれば、生成型 AI システムを対象とした世界初の国際テスト標準になります。提案は、IMDA が既に持っている AI Verify Toolkit、LLM アプリケーション テスト Starter Kit、および Global AI Assurance Sandbox に基づいています。IMDA の現職 CEO である Ng Cher Pong は開幕式での挨拶で、「標準設定は亀速で進めることはできません——そうしないと AI の急速な変化によって廃止されます」と述べました。同期間、IMDA および EnterpriseSG は、ASEAN 加盟国向けにキャパシティ ビルディング トレーニングも開催しました。',
    descriptionEn:
      "From 20–24 April, the 17th ISO/IEC JTC 1/SC 42 plenary convened in Singapore — the first time SC 42 (the core international body for AI standards) has met in ASEAN, co-organised by IMDA and Enterprise Singapore. Over 35 national bodies and 250+ AI experts attended, including delegates from the US, UK, China, Japan, Germany, France and South Korea. On the opening day Singapore formally tabled the ISO/IEC 42119-8 draft, the first international standard targeting testing methodology for generative AI systems, with two pillars: benchmarking (standardising 'what to test and how to score') and red teaming (standardising 'how to surface hidden risks'). The proposal builds on IMDA's prior work — the AI Verify Toolkit, the Starter Kit for Testing of LLM-Based Applications, and the Global AI Assurance Sandbox. IMDA CEO Ng Cher Pong, in his opening address, said: \"Standards setting cannot move at a glacial pace\" — or it risks being outpaced by AI itself. Capacity-building workshops for ASEAN member states ran on the sidelines.",
    tags: ['治理', '国际', '标准'],
    tagsEn: ['Governance', 'International', 'Standards'],
    tagsJa: ['ガバナンス', '国際', '標準'],
    tagsKo: ['거버넌스', '국제', '표준'],
    relatedPolicyIds: ['iso-iec-42119-8-generative-ai-testing-standard'],
  },
  {
    id: 'evt-2026-temasek-openai',
    year: 2026,
    date: '2026-03-31',
    title: '淡马锡参与 OpenAI 1220 亿美元融资',
    topicIds: ['startups-investment'],
    titleKo: '테마섹, OpenAI 1220억 달러 펀딩에 참여',
    titleJa: 'テマセクが OpenAI の 1220 億ドル資金調達に参加',
    titleEn: "Temasek joins OpenAI's $122B raise",
    description:
      'OpenAI 完成 1220 亿美元融资，投后估值 8520 亿美元，Amazon、Nvidia、SoftBank 与 a16z 等共同领投。淡马锡出现在 OpenAI 官方公告的参与机构名单中——距 2024 年 3 月 FT 报道双方洽谈两年后，新加坡主权资本首次直接持有 OpenAI 股权。',
    descriptionKo:
      'OpenAI가 1220억 달러 펀딩을 완료했고 포스트머니 밸류에이션은 8520억 달러이며, Amazon, Nvidia, SoftBank, a16z 등이 공동 리드했습니다. 테마섹은 OpenAI 공식 발표의 참여 기관 명단에 등장했습니다—2024년 3월 FT가 양측의 협의를 보도한 지 2년 만에, 싱가포르 주권 자본이 처음으로 OpenAI 지분을 직접 보유하게 되었습니다.',
    descriptionJa:
      'OpenAI は 1220 億ドルの資金調達を完了し、ポストマネー評価額は 8520 億ドル。Amazon、Nvidia、SoftBank、a16z などが共同リードしました。テマセクは OpenAI 公式発表の参加機関リストに登場——2024 年 3 月に FT が両者の交渉を報じてから 2 年後、シンガポールのソブリン資本が初めて OpenAI の株式を直接保有しました。',
    descriptionEn:
      "OpenAI closed a $122 billion raise at an $852 billion post-money valuation, co-led by Amazon, Nvidia, SoftBank, and a16z among others. Temasek appears on OpenAI's official participant list — two years after the FT first reported talks in March 2024, Singapore sovereign capital directly holds OpenAI equity for the first time.",
    tags: ['资本', '国际'],
    tagsEn: ['Capital', 'International'],
    tagsJa: ['資本', '国際'],
    tagsKo: ['자본', '국제'],
    relatedPostSlugs: ['sovereign-capital-frontier-ai'],
  },
  {
    id: 'evt-2026-gic-anthropic-series-g',
    year: 2026,
    date: '2026-02-12',
    title: 'GIC 与 Coatue 共同领投 Anthropic 300 亿美元 Series G',
    topicIds: ['startups-investment'],
    titleKo: 'GIC, Coatue와 함께 Anthropic 300억 달러 Series G 공동 리드',
    titleJa: 'GIC が Coatue と Anthropic の 300 億ドル Series G を共同リード',
    titleEn: "GIC co-leads Anthropic's $30B Series G with Coatue",
    description:
      'GIC 在自己的新闻稿中宣布与 Coatue 共同领投 Anthropic 300 亿美元 Series G，投后估值 3800 亿美元。GIC 此前已参与 2025 年 9 月的 130 亿美元 Series F，官方称这一连续加注为「lifecycle investment」。',
    descriptionKo:
      'GIC는 자체 보도자료에서 Coatue와 함께 Anthropic의 300억 달러 Series G를 공동 리드한다고 발표했으며, 포스트머니 밸류에이션은 3800억 달러입니다. GIC는 앞서 2025년 9월 130억 달러 Series F에 참여했으며, 공식적으로 이 연속 투자를 「lifecycle investment」라고 부릅니다.',
    descriptionJa:
      'GIC は自社のプレスリリースで、Coatue とともに Anthropic の 300 億ドル Series G を共同リードすると発表しました。ポストマネー評価額は 3800 億ドル。GIC は 2025 年 9 月の 130 億ドル Series F にすでに参加しており、この連続投資を公式に「lifecycle investment」と呼んでいます。',
    descriptionEn:
      'GIC announced in its own press release that it was co-leading Anthropic\'s $30 billion Series G with Coatue, at a $380 billion post-money valuation. GIC had already participated in the September 2025 $13 billion Series F, and officially calls this consecutive backing a "lifecycle investment".',
    tags: ['资本', '国际'],
    tagsEn: ['Capital', 'International'],
    tagsJa: ['資本', '国際'],
    tagsKo: ['자본', '국제'],
    relatedPostSlugs: ['sovereign-capital-frontier-ai'],
  },
  {
    id: 'evt-2026-naird-budget',
    year: 2026,
    title: 'NAIRD 发布 + 财政预算：AI 全面加速',
    topicIds: ['national-strategy'],
    titleKo: 'NAIRD 발표 + 재정 예산: AI 전면 가속화',
    titleJa: 'NAIRD 発布 + 財政予算：AI 全面加速',
    titleEn: 'NAIRD Launch + Budget 2026: Full-Spectrum AI Acceleration',
    description:
      '1 月：MDDI 宣布 2026-2030 公共 AI 研究投资计划，投资超 10 亿新元（7.79 亿美元）用于公共 AI 研究，聚焦负责任和资源高效的 AI、全链条人才培养、产业应用。同月举办 AI Research Week 2026，与 AAAI 第 40 届会议同期。Microsoft AI Economy Institute 报告显示新加坡 AI 采用率 60.9%，全球第二（仅次于 UAE 64.0%），美国仅 28.3%。2 月：预算案将 AI 提升至空前高度，成立由总理亲自主持的 National AI Council；推出 4 项 AI Mission；Enterprise Innovation Scheme 400% AI 税务扣除；启动 one-north AI 园区建设；National AI Literacy Programme。3 月：新加坡正式成为超老龄社会（65 岁以上 > 21%）；卫生部长宣布 ACE-AI 预测工具（Synapxe 开发），2027 年初推广至 1,100+ Healthier SG 诊所；BRCA1/2 基因检测最高 70% 补贴（2026.12 起）；MediShield Life 覆盖预防性乳房切除术（Q3）及输卵管卵巢切除术（Q4）；MediSave 限额提升惠及 91 万+ 患者。',
    descriptionKo:
      '1월: MDDI가 2026-2030 공공 AI 연구 투자 계획을 발표하며, 공공 AI 연구에 10억 싱가포르 달러(7.79억 미국 달러) 이상을 투자합니다. 책임 있고 자원 효율적인 AI, 전 체인 인재 양성, 산업 응용에 초점을 맞춥니다. 같은 달 AAAI 40회 회의와 동시에 AI Research Week 2026을 개최합니다. Microsoft AI Economy Institute 보고서는 싱가포르 AI 채택률이 60.9%로 전 세계 2위(UAE 64.0%에만 뒤짐)이며 미국은 28.3%에 불과함을 보여줍니다. 2월: 예산안이 AI를 전례 없는 높이로 끌어올립니다. 총리가 직접 주재하는 National AI Council을 설립하고, 4개의 AI Mission을 추진하며, Enterprise Innovation Scheme에 400% AI 세금 공제를 도입하고, one-north AI 단지 건설을 착수하며, National AI Literacy Programme을 개시합니다. 3월: 싱가포르가 공식적으로 초고령 사회(65세 이상 > 21%)가 됩니다. 보건부 장관이 Synapxe가 개발한 ACE-AI 예측 도구를 발표했으며, 2027년 초 1,100+ Healthier SG 클리닉으로 확대될 예정입니다. BRCA1/2 유전자 검사 최대 70% 보조금(2026년 12월부터), MediShield Life는 예방적 유방 절제술(Q3) 및 나팔관 난소 절제술(Q4)을 보장하며, MediSave 한도 인상으로 91만+ 환자가 혜택을 봅니다.',
    descriptionJa:
      '1 月：MDDI は 2026 年から 2030 年の公共 AI 研究投資計画を発表し、責任ある資源効率的な AI、全チェーンの人材育成、産業応用に焦点を当てた公共 AI 研究に 10 億新シンガポールドル以上（7 億 7,900 万米ドル）を投資しました。同月、AI Research Week 2026 が開催され、AAAI 第 40 回会議と同期間に開催されました。Microsoft AI Economy Institute のレポートによると、シンガポールの AI 採用率は 60.9% で、世界第 2 位（UAE の 64.0% に次ぐ）、米国はわずか 28.3% です。2 月：予算案は AI を前例のない高さに引き上げ、首相自らが主催する National AI Council を設立し、4 つの AI Mission を導入し、Enterprise Innovation Scheme の 400% AI 税控除を提供し、one-north AI パークの建設を開始し、National AI Literacy Programme を開始しました。3 月：シンガポールは正式に超高齢社会になりました（65 歳以上 > 21%）。保健大臣は ACE-AI 予測ツール（Synapxe 開発）を発表し、2027 年初頭に 1,100 以上の Healthier SG クリニックに展開する予定です。BRCA1/2 遺伝子検査は最大 70% の補助金（2026.12 より）が受けられます。MediShield Life は予防的乳房切除術（Q3）および卵管卵巣摘出術（Q4）をカバーします。MediSave の限度額引き上げにより、91 万人以上の患者が恩恵を受けます。',
    descriptionEn:
      "January: MDDI announced the 2026–2030 public AI research plan, committing over S$1B (US$779M), focused on responsible and resource-efficient AI, full-pipeline talent development, and industry applications. AI Research Week 2026 was held the same month, co-located with the 40th AAAI conference. The Microsoft AI Economy Institute report ranked Singapore's AI adoption rate at 60.9%, second globally (behind UAE at 64.0%; US at 28.3%). February: Budget 2026 elevated AI to an unprecedented priority — establishing a National AI Council chaired by the Prime Minister himself; launching 4 AI Missions; introducing a 400% AI tax deduction under the Enterprise Innovation Scheme; breaking ground on the one-north AI district; rolling out the National AI Literacy Programme. March: Singapore officially became a super-aged society (>21% aged 65+); the Health Minister announced the ACE-AI predictive tool (developed by Synapxe), to be deployed across 1,100+ Healthier SG clinics from early 2027; BRCA1/2 genetic testing subsidies of up to 70% (from Dec 2026); MediShield Life coverage extended to prophylactic mastectomy (Q3) and salpingo-oophorectomy (Q4); MediSave limits raised, benefiting 910,000+ patients.",
    tags: ['预算', '战略', '国际', '医疗'],
    tagsEn: ['Budget', 'Strategy', 'International', 'Healthcare'],
    tagsJa: ['予算', '戦略', '国際', '医療'],
    tagsKo: ['예산', '전략', '국제', '의료'],
    personIds: ['lawrence-wong', 'josephine-teo'],
    relatedPolicyIds: [
      'public-ai-research-investment-2026-2030',
      'budget-2026-national-ai-acceleration',
      'moh-committee-of-supply-2026-healthcare-ai-medisave-reform',
    ],
    relatedPostSlugs: ['singapore-ai-native-companies-vs-nations', 'singapore-ai-vs-smart-nation-two-transformations'],
  },
  {
    id: 'evt-2025-changi-iso42001',
    year: 2025,
    date: '2025-02',
    title: '樟宜机场获全球首张 ISO/IEC 42001 AI 管理体系认证',
    topicIds: ['governance-regulation', 'economy-industry'],
    titleKo: 'Changi Airport 세계 최초 ISO/IEC 42001 AI 경영체계 인증 획득',
    titleJa: 'チャンギ空港が世界初の ISO/IEC 42001 AI マネジメントシステム認証を取得',
    titleEn: "Changi Airport Earns World's First ISO/IEC 42001 AI Management System Certification",
    description:
      '2 月，樟宜机场集团（CAG）由 SGS 颁发 ISO/IEC 42001:2023 AI 管理体系（AIMS）认证，经新加坡认证理事会（SAC）认可——这是全球首张针对机场客户服务的 ISO/IEC 42001 证书，覆盖 5 套面向旅客和商业的 AI 应用（含客户终身价值 CLV、产品推荐、倾向预测等）。该认证为新加坡此后在 SC 42 国际舞台主张 AI 测试与治理标准积累了实证案例。',
    descriptionKo:
      '2월: Changi Airport Group(CAG)이 SGS로부터 ISO/IEC 42001:2023 AI 관리 체계(AIMS) 인증을 획득했으며, 싱가포르 인증 위원회(SAC)의 인정을 받았습니다. 이는 공항 고객 서비스를 위한 세계 최초의 ISO/IEC 42001 인증서이며, 고객 평생 가치(CLV), 상품 추천, 성향 예측 등을 포함한 여행객 및 비즈니스를 위한 5개의 AI 응용을 포괄합니다. 이 인증은 싱가포르가 향후 SC 42 국제 무대에서 AI 테스트 및 거버넌스 표준을 주장하기 위해 구체적인 사례를 축적했습니다.',
    descriptionJa:
      '2 月、チャンギ空港グループ（CAG）は SGS から ISO/IEC 42001:2023 AI マネジメントシステム（AIMS）認証を取得し、シンガポール認証評議会（SAC）によって認可されました——これは空港の顧客サービスを対象とした世界初の ISO/IEC 42001 証明書で、顧客生涯価値（CLV）、製品推奨、傾向予測など、乗客と商業向けの 5 つの AI アプリケーション セットをカバーしています。この認証は、シンガポールが今後 SC 42 の国際舞台で AI テストとガバナンス標準を主張するための実証ケーススタディを蓄積しました。',
    descriptionEn:
      'In February, Changi Airport Group (CAG) became the first airport globally to be certified to ISO/IEC 42001:2023 (AI Management System), audited by SGS and accredited by the Singapore Accreditation Council (SAC). The scope covered five passenger- and commercial-facing AI applications, including Customer Lifetime Value (CLV), product recommender and propensity prediction. The certification became a working proof point that Singapore would later draw on at SC 42 when arguing for international AI testing and governance standards.',
    tags: ['治理', '产业', '标准'],
    tagsEn: ['Governance', 'Industry', 'Standards'],
    tagsJa: ['ガバナンス', '産業', '標準'],
    tagsKo: ['거버넌스', '산업', '표준'],
  },
  {
    id: 'evt-2025-agentic-bigtech',
    year: 2025,
    title: 'Agentic AI 治理与科技巨头落地',
    topicIds: ['governance-regulation', 'economy-industry'],
    titleKo: 'Agentic AI 거버넌스와 테크 거대기업의 진출',
    titleJa: 'エージェンティック AI ガバナンスと大型テック企業の拠点確保',
    titleEn: 'Agentic AI Governance and Big Tech Land in Singapore',
    description:
      '发布 Agentic AI 治理框架；推出 SEA-Guard 安全评估工具；Enterprise Compute 拨款 1.5 亿新元；AIAP for Industry 扩展至产业界。7 月 Microsoft Research Asia 在新加坡设立首个东南亚实验室，与 NUS 合作产业博士项目（IPP）。11 月 Google DeepMind 在新加坡建立东南亚首个 AI 研究实验室。',
    descriptionKo:
      'Agentic AI 거버넌스 프레임워크 발표; SEA-Guard 보안 평가 도구 출시; Enterprise Compute에 1억 5천만 신원 할당; AIAP for Industry 산업 부문으로 확대합니다. 7월 Microsoft Research Asia가 싱가포르에 동남아 최초 실험실을 설립하고 NUS와의 산업 박사 프로그램(IPP) 협력을 시작합니다. 11월 Google DeepMind가 싱가포르에 동남아 최초 AI 연구 실험실을 설립합니다.',
    descriptionJa:
      'エージェンティック AI ガバナンス フレームワークを発表し、SEA-Guard セキュリティ評価ツールを立ち上げ、Enterprise Compute に 1 億 5,000 万新シンガポールドルを配分し、AIAP for Industry を産業界に拡張しました。7 月、Microsoft Research Asia がシンガポールに初の東南アジア研究室を開設し、NUS と業界博士プログラム（IPP）で協力しました。11 月、Google DeepMind はシンガポールに東南アジア初の AI 研究実験室を確立しました。',
    descriptionEn:
      'Released the Agentic AI governance framework; launched the SEA-Guard safety evaluation toolkit; allocated S$150M for Enterprise Compute; extended AIAP for Industry into the private sector. In July, Microsoft Research Asia opened its first Southeast Asia lab in Singapore, partnering with NUS on the Industrial PhD Programme (IPP). In November, Google DeepMind established its first Southeast Asia AI research lab in Singapore.',
    tags: ['治理', '技术', '预算', '产业'],
    tagsEn: ['Governance', 'Tech', 'Budget', 'Industry'],
    tagsJa: ['ガバナンス', '技術', '予算', '産業'],
    tagsKo: ['거버넌스', '기술', '예산', '산업'],
  },
  {
    id: 'evt-2024',
    year: 2024,
    title: '智慧国家 2.0 落地与 AI 预算井喷',
    topicIds: ['national-strategy'],
    titleKo: '스마트 국가 2.0 시행과 AI 예산 급증',
    titleJa: 'スマート国家 2.0 の実装と AI 予算の爆発的成長',
    titleEn: 'Smart Nation 2.0 Rolls Out; AI Budget Surges',
    description:
      'Smart Nation 2.0 落地，发布 1.2 亿新元 AI 应用基金和五大国家 AI 项目（智能货运、市政服务、慢性病管理、个性化教育、边境清关）。AI 预算突破 10 亿新元。3 月 NUS AI Institute 成立，整合校内 AI 研究资源。SEA-LION 大语言模型正式发布；AMP 启动；参加首尔 AI 安全峰会；CSA 发布 AI 安全指南。',
    descriptionKo:
      'Smart Nation 2.0이 시행되어 1.2억 싱가포르 달러 규모의 AI 애플리케이션 펀드와 5대 국가 AI 프로젝트(스마트 물류, 도시 서비스, 만성질환 관리, 개인화 교육, 국경 통관)가 공개되었습니다. AI 예산이 10억 싱가포르 달러를 돌파했습니다. 3월 NUS AI Institute가 설립되어 캠퍼스 내 AI 연구 자원을 통합했습니다. SEA-LION 대규모 언어 모델이 공식 출시되었고, AMP가 출범했고, 서울 AI 안전 정상회담에 참여했고, CSA가 AI 안전 가이드라인을 공개했습니다.',
    descriptionJa:
      'Smart Nation 2.0 を実装し、1 億 2,000 万新シンガポールドルの AI アプリケーション ファンドと 5 つの主要国家 AI プロジェクト（インテリジェント カーゴ、市民サービス、慢性疾患管理、個人教育、国境通関）を発表しました。AI 予算は 10 億新シンガポールドルを超えました。3 月、NUS AI Institute が設立され、キャンパス内の AI 研究リソースを統合しました。SEA-LION 大規模言語モデルが正式にリリースされました。AMP が開始され、ソウル AI 安全サミットに参加し、CSA が AI 安全ガイドラインを発表しました。',
    descriptionEn:
      'Smart Nation 2.0 launched, with a S$120M AI application fund and five National AI Projects (intelligent freight, municipal services, chronic disease management, personalised education, border clearance). The AI budget passed S$1B. The NUS AI Institute was established in March, consolidating university-wide AI research. The SEA-LION large language model was officially released; the AI Trailblazers Maturity Programme (AMP) launched; Singapore attended the Seoul AI Safety Summit; CSA released AI security guidelines.',
    tags: ['战略', '技术', '国际'],
    tagsEn: ['Strategy', 'Tech', 'International'],
    tagsJa: ['戦略', '技術', '国際'],
    tagsKo: ['전략', '기술', '국제'],
  },
  {
    id: 'evt-2023',
    year: 2023,
    title: 'NAIS 2.0 发布与 AI Verify 开源',
    topicIds: ['national-strategy', 'safety-ethics', 'open-source'],
    titleKo: 'NAIS 2.0 발표 및 AI Verify 오픈소스',
    titleJa: 'NAIS 2.0 の発表と AI Verify のオープンソース化',
    titleEn: 'NAIS 2.0 Released; AI Verify Open-Sourced',
    description:
      '国家 AI 战略 2.0 发布，从"重点应用"升级为"系统性赋能"。AI Verify 测试框架开源并成立 AI Verify Foundation。生成式 AI 治理框架提案。参加 Bletchley Park 首届 AI 安全峰会。',
    descriptionKo:
      '국가 AI 전략 2.0이 공개되어 「핵심 응용」에서 「체계적 역량 강화」로 업그레이드되었습니다. AI Verify 테스트 프레임워크가 오픈소스화되었고 AI Verify Foundation이 설립되었습니다. 생성형 AI 거버넌스 프레임워크가 제안되었습니다. Bletchley Park 첫 번째 AI 안전 정상회담에 참여했습니다.',
    descriptionJa:
      '国家 AI 戦略 2.0 が発表され、「重点応用」から「システム的実装」にアップグレードされました。AI Verify テスト フレームワークはオープンソース化され、AI Verify Foundation が設立されました。生成型 AI ガバナンス フレームワーク提案。Bletchley Park 初の AI 安全サミットに参加しました。',
    descriptionEn:
      'National AI Strategy 2.0 was released, shifting the framework from "focused applications" to "system-wide enablement". The AI Verify testing framework was open-sourced and the AI Verify Foundation was established. A proposed governance framework for generative AI was published. Singapore attended the inaugural Bletchley Park AI Safety Summit.',
    tags: ['战略', '治理', '国际'],
    tagsEn: ['Strategy', 'Governance', 'International'],
    tagsJa: ['戦略', 'ガバナンス', '国際'],
    tagsKo: ['전략', '거버넌스', '국제'],
  },
  {
    id: 'evt-2022',
    year: 2022,
    title: 'AI Verify 发布与 NAISC 启动',
    topicIds: ['safety-ethics', 'governance-regulation'],
    titleKo: 'AI Verify 발표 및 NAISC 출범',
    titleJa: 'AI Verify の発表と NAISC の開始',
    titleEn: 'AI Verify Released; NAISC Launched',
    description:
      'AI Verify MVP 发布，全球首个 AI 治理测试框架与工具包。National AI Student Challenge (NAISC) 启动，面向学生的全国性 AI 挑战赛。',
    descriptionKo:
      'AI Verify MVP 발표, 세계 최초의 AI 거버넌스 테스트 프레임워크 및 도구 모음. National AI Student Challenge (NAISC) 출범, 학생을 위한 국가급 AI 챌린지.',
    descriptionJa:
      'AI Verify MVP がリリースされ、世界初の AI ガバナンス テスト フレームワークとツールキットが提供されました。National AI Student Challenge (NAISC) が開始され、学生向けの全国的な AI チャレンジです。',
    descriptionEn:
      "The AI Verify MVP was released — the world's first AI governance testing framework and toolkit. The National AI Student Challenge (NAISC) was launched as a nationwide AI competition for students.",
    tags: ['治理', '人才'],
    tagsEn: ['Governance', 'Talent'],
    tagsJa: ['ガバナンス', '人材'],
    tagsKo: ['거버넌스', '인재'],
  },
  {
    id: 'evt-2020',
    year: 2020,
    title: 'PDPA 修订与 GPAI 创始',
    topicIds: ['governance-regulation', 'international'],
    titleKo: 'PDPA 개정 및 GPAI 설립',
    titleJa: 'PDPA の改正と GPAI の設立',
    titleEn: 'PDPA Amendment and GPAI Founding',
    description:
      '个人数据保护法 (PDPA) 重大修订，引入合法利益例外和数据可携带权。AI 治理模型框架更新至 v2。新加坡成为 GPAI 创始成员国，RIE2025 计划启动（250 亿新元）。',
    descriptionKo:
      '개인정보보호법(PDPA) 주요 개정으로 정당한 이익 예외와 데이터 이동권 도입. AI 거버넌스 모델 프레임워크를 v2로 업데이트. 싱가포르가 GPAI 설립 회원국이 되고 RIE2025 계획 출범(250억 싱가포르달러).',
    descriptionJa:
      '個人データ保護法（PDPA）が大幅に改正され、正当な利益例外とデータポータビリティ権が導入されました。AI ガバナンス モデル フレームワークが v2 に更新されました。シンガポールは GPAI の創設加盟国となり、RIE2025 計画が開始されました（250 億新シンガポールドル）。',
    descriptionEn:
      'Major amendments to the Personal Data Protection Act (PDPA) introduced the legitimate interests exception and data portability rights. The Model AI Governance Framework was updated to v2. Singapore became a founding member of the Global Partnership on AI (GPAI), and the RIE2025 plan was launched (S$25B).',
    tags: ['治理', '国际', '预算'],
    tagsEn: ['Governance', 'International', 'Budget'],
    tagsJa: ['ガバナンス', '国際', '予算'],
    tagsKo: ['거버넌스', '국제', '예산'],
  },
  {
    id: 'evt-2019',
    year: 2019,
    title: 'NAIS 1.0 发布',
    topicIds: ['national-strategy'],
    titleKo: 'NAIS 1.0 발표',
    titleJa: 'NAIS 1.0 の発表',
    titleEn: 'NAIS 1.0 Released',
    description:
      '新加坡首份国家级 AI 战略发布，确立五大重点领域（交通物流、智慧城市、医疗、教育、安全）和三大推动力。同年发布亚洲首个 AI 治理模型框架，MAS 推出 FEAT 原则。',
    descriptionKo:
      '싱가포르 최초의 국가급 AI 전략 발표로 5대 중점 영역(교통 물류, 스마트 도시, 의료, 교육, 안보)과 3대 추진력을 확립. 같은 해 아시아 최초의 AI 거버넌스 모델 프레임워크 발표, MAS가 FEAT 원칙을 발표.',
    descriptionJa:
      'シンガポールの最初の国家レベルの AI 戦略が発表され、5 つの主要分野（交通物流、スマートシティ、医療、教育、セキュリティ）と 3 つの駆動力を確立しました。同年、アジア初の AI ガバナンス モデル フレームワークが発表され、MAS は FEAT 原則を導入しました。',
    descriptionEn:
      "Singapore released its first national AI strategy, identifying five priority sectors (transport and logistics, smart cities, healthcare, education, security) and three enablers. The same year, Asia's first Model AI Governance Framework was published, and MAS introduced the FEAT principles for the financial sector.",
    tags: ['战略', '治理'],
    tagsEn: ['Strategy', 'Governance'],
    tagsJa: ['戦略', 'ガバナンス'],
    tagsKo: ['전략', '거버넌스'],
  },
  {
    id: 'evt-2018',
    year: 2018,
    title: 'AIAP 与 100E 计划启动',
    topicIds: ['talent-education', 'economy-industry'],
    titleKo: 'AIAP 및 100E 프로그램이 시작되었습니다.',
    titleJa: 'AIAP と 100E 計画の開始',
    titleEn: 'AIAP and 100E Programmes Launched',
    description:
      'AI Apprenticeship Programme (AIAP) 首批启动，提供 9 个月沉浸式 AI 工程训练。100 Experiments (100E) 计划启动，资助企业进行 AI 概念验证。MAS 发布金融业 FEAT 原则。',
    descriptionKo:
      'AI Apprenticeship Programme (AIAP)이 처음 시작되어 9개월 몰입형 AI 엔지니어링 교육을 제공했습니다. 100 Experiments (100E) 프로그램이 시작되어 기업의 AI 개념 검증을 지원했습니다. MAS가 금융업 FEAT 원칙을 발표했습니다.',
    descriptionJa:
      'AI Apprenticeship Programme (AIAP) が最初のバッチで開始され、9 ヶ月間の没入型 AI エンジニアリング トレーニングを提供しました。100 Experiments (100E) 計画が開始され、企業が AI の概念実証を行うための資金を提供しました。MAS は金融業向けの FEAT 原則を発表しました。',
    descriptionEn:
      'The first cohort of the AI Apprenticeship Programme (AIAP) launched, offering 9 months of immersive AI engineering training. The 100 Experiments (100E) programme launched to fund AI proof-of-concept projects with companies. MAS released the FEAT principles for the financial sector.',
    tags: ['人才', '创新'],
    tagsEn: ['Talent', 'Innovation'],
    tagsJa: ['人材', 'イノベーション'],
    tagsKo: ['인재', '혁신'],
  },
  {
    id: 'evt-2017',
    year: 2017,
    title: 'AI Singapore 成立',
    topicIds: ['national-strategy', 'infrastructure-research'],
    titleKo: 'AI Singapore가 설립되었습니다.',
    titleJa: 'AI Singapore の設立',
    titleEn: 'AI Singapore Established',
    description:
      '国家研究基金会 (NRF) 拨款 1.5 亿新元成立 AI Singapore，整合学术界、产业界和政府资源，统筹推进国家级 AI 研究、创新和人才培养。',
    descriptionKo:
      '국가연구기금(NRF)이 1.5억 싱가포르 달러를 배정하여 AI Singapore를 설립했습니다. 학계, 산업계, 정부 자원을 통합하여 국가급 AI 연구, 혁신 및 인재 양성을 체계적으로 추진했습니다.',
    descriptionJa:
      'National Research Foundation (NRF) が 1 億 5,000 万新シンガポールドルを配分して AI Singapore を設立し、学界、産業界、政府リソースを統合し、国家レベルの AI 研究、イノベーション、人材育成を包括的に推進しました。',
    descriptionEn:
      'The National Research Foundation (NRF) committed S$150M to establish AI Singapore, bringing together academia, industry and government to coordinate national AI research, innovation and talent development.',
    tags: ['战略', '预算'],
    tagsEn: ['Strategy', 'Budget'],
    tagsJa: ['戦略', '予算'],
    tagsKo: ['전략', '예산'],
  },
  {
    id: 'evt-2014',
    year: 2014,
    title: '智慧国家倡议启动',
    topicIds: ['national-strategy'],
    titleKo: 'Smart Nation Initiative가 시작되었습니다.',
    titleJa: 'スマート国家イニシアティブの開始',
    titleEn: 'Smart Nation Initiative Launched',
    description:
      '李显龙总理宣布 Smart Nation Initiative，新加坡成为全球首个以"智慧国家"为目标的国家级数字化转型战略。该倡议为后续所有 AI 政策奠定了制度基础。',
    descriptionKo:
      'Lee Hsien Loong 총리가 Smart Nation Initiative를 발표했습니다. 싱가포르가 「스마트 국가」를 목표로 하는 국가급 디지털 전환 전략을 추진한 전 세계 최초의 국가가 되었습니다. 이 이니셔티브는 이후 모든 AI 정책의 제도적 기초를 마련했습니다.',
    descriptionJa:
      '李顕龍首相が Smart Nation Initiative を発表し、シンガポールは「スマート国家」を目標とする世界初の国家レベルのデジタル変革戦略になりました。このイニシアティブは、その後のすべての AI ポリシーの制度基盤を確立しました。',
    descriptionEn:
      'Prime Minister Lee Hsien Loong announced the Smart Nation Initiative, making Singapore the first country in the world to declare a national digital transformation strategy under the "Smart Nation" banner. The initiative laid the institutional foundation for all subsequent AI policies.',
    tags: ['战略'],
    tagsEn: ['Strategy'],
    tagsJa: ['戦略'],
    tagsKo: ['전략'],
    relatedPolicyIds: ['smart-nation-initiative'],
    relatedPostSlugs: ['singapore-ai-vs-smart-nation-two-transformations'],
  },
];

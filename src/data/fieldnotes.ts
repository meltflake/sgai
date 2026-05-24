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
  companyProfile: string;
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
        ],
        pointsEn: [
          'EDB raised Manus on its own initiative, but made clear that it was a special case.',
          'Manus faced an external-regulatory time window and had to relocate its core team in a very compressed timeframe.',
          'EDB engaged deeply: coordinating in advance with the Ministry of Manpower and breaking the relocation into batches.',
          'The expectation was that part of the original team would have to be left behind.',
          'Bottom line: ordinary companies should follow the ordinary process, where success rates are higher. Special assistance is reserved for situations where there is no alternative.',
          'Follow-up (27 April 2026): China\'s NDRC blocked Meta\'s US$2B acquisition of Manus on national-security grounds, drawing three red lines (technology sovereignty, data sovereignty, national security). The "time-window pressure" and the "core-team relocation" EDB referenced were, in hindsight, downstream of source-country regulatory direction — re-domiciling alone is not enough to exit source-country jurisdiction, and the "Singapore washing" play was, for the first time, explicitly rejected.',
        ],
        pointsJa: [
          'EDB 側から Manus の話題が出ましたが、同時にそれは特殊ケースだと明確に説明されました。',
          'Manus は外部規制による時間制約に直面し、極めて短期間で中核チームを移す必要がありました。',
          'EDB は深く関与し、事前に人材省と調整し、移転対象者を複数バッチに分けました。',
          '元のチームの一部を残さざるを得ない、という前提でした。',
          '結論：通常の会社は通常プロセスを進めた方が成功率が高い。特別支援は「他に選択肢がない」状況でだけ現れます。',
          '後続検証（2026-04-27）：中国国家発展改革委員会は国家安全保障を理由に、Meta による Manus の 20 億米ドル買収を停止し、技術主権・データ主権・国家安全保障の 3 つのレッドラインを示しました。EDB が当時語った「時間制約」と「中核チーム移転」は、後から見ると出所国の規制動向に由来していました。登記地を移すだけでは出所国の管轄から離れられず、「Singapore washing」戦略は初めて明示的に退けられました。',
        ],
        pointsKo: [
          'EDB가 먼저 Manus를 언급했지만, 동시에 그것이 특수 사례임을 분명히 했습니다.',
          'Manus는 외부 규제의 시간 압박을 받았고, 매우 짧은 기간 안에 핵심 팀을 이전해야 했습니다.',
          'EDB는 깊이 관여했습니다. 인력부와 사전에 조율하고, 이전 인원을 여러 배치로 나눴습니다.',
          '원래 팀의 일부는 포기해야 한다는 전제가 있었습니다.',
          '결론: 일반 회사는 일반 절차를 밟는 편이 성공률이 높습니다. 특별 지원은 “두 번째 선택지가 없는” 상황에서만 나옵니다.',
          '후속 확인(2026-04-27): 중국 국가발전개혁위원회는 국가안보를 이유로 Meta의 Manus 20억 달러 인수를 중단시키고, 기술 주권·데이터 주권·국가안보라는 세 가지 레드라인을 그었습니다. EDB가 당시 말한 “시간 압박”과 “핵심 팀 이전”은 사후적으로 보면 출처 국가의 규제 방향에서 비롯된 것이었습니다. 등록지를 옮기는 것만으로는 출처 국가 관할을 벗어날 수 없으며, “Singapore washing” 전략은 처음으로 명시적으로 거부되었습니다.',
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

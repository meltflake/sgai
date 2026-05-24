export interface Policy {
  // Stable kebab-case id, derived from titleEn at codemod time.
  // Optional during the migration window; codemod-policies.ts populates it
  // for every record. Phase 1.14 verify-graph.ts asserts non-null.
  id?: string;
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  date: string;
  source: string;
  sourceOrgUrl?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  translatedPdfUrl?: string;
  summary: string;
  content: string;
  // i18n (v0.3.0). EN renderer prefers these; falls back to zh fields if
  // missing. Translation pass populates them in batches.
  summaryEn?: string;
  summaryJa?: string;
  summaryKo?: string;
  contentEn?: string;
  contentJa?: string;
  contentKo?: string;
  sourceEn?: string;
  sourceJa?: string;
  sourceKo?: string;
  // Optional profile fields for richer landing pages. Existing records can
  // render from summary/content alone; these fields let future passes add
  // structured facts, sections, milestones, and curated links incrementally.
  keyFacts?: PolicyFact[];
  sections?: PolicySection[];
  milestones?: PolicyMilestone[];
  resources?: PolicyResource[];
  lastVerified?: string;
  // Phase 1 knowledge-graph fields (all optional during migration; hand-
  // curated over time. Empty arrays mean "no known links yet").
  ministry?: string; // matches Affiliation values in src/data/people.ts
  authorPersonIds?: string[]; // → src/data/people.ts ids
  relatedDebateIds?: string[]; // → src/data/debates.ts ids
  relatedLeverNumbers?: number[]; // 1–6
  relatedTimelineYears?: number[];
  relatedPostSlugs?: string[];
  /** YYYY-MM-DD; the date this record was first added to the repo. Used by
   *  src/utils/derived-updates.ts to surface a homepage "Recent updates"
   *  entry. Set automatically by emit pipelines; manual additions must set
   *  it too. Old records may be undefined → not surfaced. */
  addedAt?: string;
}

export interface PolicyFact {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  valueKo?: string;
}

export interface PolicySection {
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  body: string;
  bodyEn?: string;
  bodyJa?: string;
  bodyKo?: string;
}

export interface PolicyMilestone {
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

export interface PolicyResource {
  label: string;
  labelEn?: string;
  labelJa?: string;
  labelKo?: string;
  url: string;
  kind?: 'source' | 'pdf' | 'translation' | 'website' | 'dataset' | 'tool' | 'report';
}

export interface PolicyCategory {
  name: string;
  nameEn?: string;
  nameJa?: string;
  nameKo?: string;
  icon: string;
  policies: Policy[];
}

export const categories: PolicyCategory[] = [
  {
    name: '国家战略',
    nameKo: '국가 전략',
    nameJa: '国家戦略',
    nameEn: 'National Strategy',
    icon: '🏛️',
    policies: [
      {
        id: 'nais-update-2026',
        title: '国家 AI 战略更新 (NAIS Update 2026)',
        titleKo: '국가 AI 전략 업데이트 (NAIS Update 2026)',
        titleJa: '国家 AI 戦略アップデート (NAIS Update 2026)',
        titleEn: 'National AI Strategy Update 2026',
        date: '2026-05',
        source: '数字发展与信息部 (MDDI) / 国家 AI 理事会 (NAIC)',
        sourceKo: '디지털 개발 및 정보부 (MDDI) / 국가 AI 위원회 (NAIC)',
        sourceJa: 'デジタル発展・情報部 (MDDI) / 国家 AI 評議会 (NAIC)',
        sourceEn: 'Ministry of Digital Development and Information (MDDI) / National AI Council (NAIC)',
        sourceOrgUrl: 'https://www.mddi.gov.sg/',
        sourceUrl: 'https://www.mddi.gov.sg/newsroom/opening-address-by-minister-josephine-teo-at-atxsummit-2026/',
        summary:
          'Josephine Teo 在 ATxSummit 2026 公布 NAIS 更新——「双击」而非「重启」。3 个方向、10 项优先方向、4 个国家 AI 任务（先进制造、金融、互联互通、医疗），加 National AI Impact Programme（10000 家 SME 目标）与 Champions of AI 计划。',
        summaryKo:
          'Josephine Teo가 ATxSummit 2026에서 NAIS 업데이트를 공개했습니다. 「더블클릭」이지 「재시작」이 아닙니다. 3가지 방향, 10개의 우선 방향, 4개의 국가 AI 과제(첨단 제조, 금융, 연결성, 의료), National AI Impact Programme(10,000개 SME 목표) 및 Champions of AI 계획을 더합니다.',
        summaryJa:
          'Josephine Teo は ATxSummit 2026 で NAIS アップデートを発表――「ダブルクリック」であって「リセット」ではない。3 つの方向、10 の優先方向、4 つの国家 AI ミッション（先端製造、金融、コネクティビティ、医療）、加えて National AI Impact Programme（中小企業 10000 社の目標）と Champions of AI プログラム。',
        summaryEn:
          'At ATxSummit 2026, Josephine Teo unveiled an update to NAIS — a "double-click" rather than a "system reboot". Three directions, ten refreshed priorities, four National AI Missions (Advanced Manufacturing, Financial Services, Connectivity, Healthcare), plus the National AI Impact Programme (10,000-SME target) and the Champions of AI programme.',
        content: `2026 年 5 月 20 日，数字发展与信息部长 Josephine Teo 在 ATxSummit 2026 开幕主题演讲上公布 NAIS 更新。她把更新形容为「双击」而非「系统重启」——延续 NAIS 2.0 的框架，叠加 2026 年 2 月成立、Lawrence Wong 总理亲任主席的**国家 AI 理事会（NAIC）**的更高目标。

**3 个方向 + 10 项优先方向**：覆盖部门与公共部门转型、人才与基础设施、治理与国际合作。

**4 个国家 AI 任务**（部门转型重点）：
- **先进制造**——巩固制造业 AI 优势，对接同日公布的 NVIDIA Singapore AI Research Lab 的 embodied AI 落地
- **金融服务**——延续 FEAT / Veritas / MindForge / BuildFin.ai 五层堆栈
- **互联互通（Connectivity）**——5G + 数据基础设施
- **医疗**——AI 辅助诊断 / 慢性病预测 / 个性化医疗

**两个企业采纳计划**：
- **National AI Impact Programme**——目标 10000 家 SME「有意义采纳 AI」
- **Champions of AI**——为头部企业提供更深度、定制化的对接支持

Teo 以樟宜机场 T5 扩建为例说明「新航站楼只装硬件不够」——AI 不是炫技，而是要解决具体运营挑战，硬件 + 软件协同创新才能起效。

NAIS 更新与同日公布的 NVIDIA Singapore AI Research Lab、Punggol Digital District 多运营商机器人 testbed 三件事联动，标志着新加坡 AI 战略从「规划期」进入「成果交付期」。`,
        contentKo: `2026년 5월 20일, 디지털 개발 및 정보부 장관 Josephine Teo가 ATxSummit 2026 개막 주제 연설에서 NAIS 업데이트를 공개했습니다. 그녀는 이 업데이트를 「더블클릭」이라고 표현했으며, 「시스템 재시작」이 아닙니다. NAIS 2.0의 틀을 계속하며, 2026년 2월에 설립되었고 Lawrence Wong 총리가 의장을 맡고 있는 **국가 AI 위원회(NAIC)**의 더 높은 목표를 더합니다.

3가지 방향 + 10개의 우선 방향: 부처와 공공 부문 전환, 인재와 기반 시설, 거버넌스와 국제 협력을 다룹니다.

4개의 국가 AI 과제(부처 전환 중점):
- **첨단 제조**——제조업 AI 우위를 강화하고, 같은 날 공개된 NVIDIA Singapore AI Research Lab의 embodied AI 구현과 연결합니다
- **금융 서비스**——FEAT / Veritas / MindForge / BuildFin.ai 5계층 스택을 계속합니다
- **연결성(Connectivity)**——5G + 데이터 기반 시설
- **의료**——AI 보조 진단 / 만성질환 예측 / 개인화 의료

두 개의 기업 도입 계획:
- **National AI Impact Programme**——10,000개의 SME가 「의미 있는 AI 도입」을 목표합니다
- **Champions of AI**——상위 기업에 더 깊이 있고 맞춤형 대접 지원을 제공합니다

Teo는 창이 공항 T5 확장을 예로 들어 「새 터미널은 하드웨어만으로는 충분하지 않습니다」라고 설명했습니다. AI는 과시가 아니라 구체적인 운영 문제를 해결해야 하며, 하드웨어 + 소프트웨어 협력 혁신이 효과를 낼 수 있습니다.

NAIS 업데이트와 같은 날 공개된 NVIDIA Singapore AI Research Lab, Punggol Digital District 다중 운영자 로봇 테스트베드 세 가지 사항이 연동하여, 싱가포르 AI 전략이 「계획 단계」에서 「성과 제공 단계」로 진입했음을 나타냅니다.`,
        contentJa: `2026 年 5 月 20 日、デジタル発展・情報相 Josephine Teo は ATxSummit 2026 の開幕基調講演で NAIS アップデートを発表しました。彼女はこのアップデートを「システム再起動」ではなく「ダブルクリック」と形容しました――NAIS 2.0 のフレームワークを継続しつつ、2026 年 2 月設立で Lawrence Wong 首相が議長を務める**国家 AI 評議会（NAIC）**の高い目標を重ね合わせています。

**3 つの方向 + 10 の優先方向**：部門・公共部門の変革、人材・基盤、ガバナンス・国際協力をカバーします。

**4 つの国家 AI ミッション**（部門変革の重点）：
- **先端製造**――製造業の AI 優位性を強化し、同日発表された NVIDIA Singapore AI Research Lab の embodied AI 実装と接続
- **金融サービス**――FEAT / Veritas / MindForge / BuildFin.ai 5 層スタックを継続
- **コネクティビティ**――5G + データ基盤
- **医療**――AI 補助診断 / 慢性疾患予測 / 個別化医療

**2 つの企業採用計画**：
- **National AI Impact Programme**――中小企業 10000 社の「意味ある AI 採用」を目標
- **Champions of AI**――トップ企業へより深く、ターゲットを絞ったサポート

Teo は Changi 空港 T5 拡張を例に「新ターミナルにハードウェアだけでは不足」と説明――AI は派手な技術ではなく、具体的な業務課題を解決するためのもの、ハードウェアとソフトウェアの協調イノベーションが必要だと示しました。

NAIS アップデートは同日発表の NVIDIA Singapore AI Research Lab、Punggol Digital District 多事業者ロボット testbed と連動し、シンガポール AI 戦略が「計画期」から「成果引渡し期」へ移行したことを示しています。`,
        contentEn: `On 20 May 2026, Minister for Digital Development and Information Josephine Teo unveiled an update to the National AI Strategy in her opening keynote at ATxSummit 2026. She framed the update as a "double-click rather than a system reboot" — building on the NAIS 2.0 framework while layering in the elevated ambitions of the National AI Council (NAIC), established in February 2026 and chaired by Prime Minister Lawrence Wong.

**Three directions, ten refreshed priorities**: covering sectoral and public-sector transformation, talent and infrastructure, governance and international cooperation.

**Four National AI Missions** (sectoral transformation focus):
- **Advanced Manufacturing** — consolidating Singapore's manufacturing-AI edge, connecting with embodied AI from the same-day NVIDIA Singapore AI Research Lab
- **Financial Services** — extending the FEAT / Veritas / MindForge / BuildFin.ai five-layer stack
- **Connectivity** — 5G and data infrastructure
- **Healthcare** — AI-assisted diagnosis, chronic disease prediction, personalised medicine

**Two enterprise-adoption programmes**:
- **National AI Impact Programme** — targets meaningful AI adoption by 10,000 SMEs
- **Champions of AI** — provides deeper, more targeted support for leading enterprises

Teo used the Changi Airport T5 expansion to illustrate the point that "a new terminal alone won't do the job" — hardware and software innovation must move together. AI isn't about showy capabilities, it's about solving concrete operational problems.

Together with same-day announcements of the NVIDIA Singapore AI Research Lab and the Punggol Digital District multi-operator robot testbed, the update marks Singapore's AI strategy shifting from a planning phase to a delivery phase.`,
        ministry: 'MDDI',
        authorPersonIds: ['josephine-teo', 'lawrence-wong'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 2, 3, 4, 5, 6],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-20',
      },
      {
        id: 'nvidia-singapore-ai-research-lab-2026',
        title: 'NVIDIA 新加坡 AI 研究实验室',
        titleKo: 'NVIDIA 싱가포르 AI 연구 실험실',
        titleJa: 'NVIDIA シンガポール AI 研究ラボ',
        titleEn: 'NVIDIA Singapore AI Research Lab',
        date: '2026-05',
        source: 'NVIDIA / 资讯通信媒体发展局 (IMDA)',
        sourceKo: 'NVIDIA / 정보통신미디어발전청 (IMDA)',
        sourceJa: 'NVIDIA / 情報通信メディア発展庁 (IMDA)',
        sourceEn: 'NVIDIA / Infocomm Media Development Authority (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/accelerate-real-world-deployment',
        summary:
          'NVIDIA 在 ATxSummit 2026 公布在新加坡设立第一个研究实验室（亚太第二个），聚焦 embodied AI 与 efficient AI computing。',
        summaryKo:
          'NVIDIA가 ATxSummit 2026에서 싱가포르에 첫 번째 연구 실험실(아시아태평양 두 번째)을 설립한다고 공개했으며, embodied AI와 efficient AI computing에 중점을 두고 있습니다.',
        summaryJa:
          'NVIDIA は ATxSummit 2026 で、シンガポールに最初の研究ラボを設立すると発表しました（アジア太平洋では 2 番目）。embodied AI と efficient AI computing に焦点を当てます。',
        summaryEn:
          'At ATxSummit 2026, NVIDIA announced its first Singapore research lab — its second in Asia Pacific — focused on embodied AI and efficient AI computing.',
        content: `2026 年 5 月 20 日，NVIDIA 在 ATxSummit 2026 公布在新加坡设立**第一个新加坡研究实验室**（也是 NVIDIA 在亚太地区的第二个研究存在）。NVIDIA 首席科学家、研究高级副总裁 Dr. William Dally 出席公告。

**两条研究主线**：

1. **Embodied AI（具身智能）**——机器人与自主系统在物理世界中感知、推理、执行。重点应用包括智能检测、自主装配、预测性维护，对接新加坡先进制造业基础与同日公布的 Punggol Digital District 多运营商机器人 testbed。
2. **Efficient AI computing**——降低算力成本、提升能效，支撑更广泛的 AI 部署。这是 NVIDIA 自身硬件路线（H100→B200→Rubin）之外的算法层、系统层效率研究。

**合作模式**：与本地大学、产业伙伴、政府机构联合开展研究——具体合作机构未公布。Dr. Dally 同日在新加坡理工学院与 300+ 理工学院 / 大学学生分享 IC 设计经验。

**战略意义**：与新加坡贡献 NVIDIA 约 15% 全球营收的现状相比，这是 NVIDIA 首次在新加坡建立**研究存在**而非纯商业存在——把新加坡从「GPU 转运中心」叙事推向「原创 AI 研究节点」。同日公布的 NAIS 更新「先进制造」国家 AI 任务与此 Lab 强烈呼应。Josephine Teo 在演讲中说：「This is why we welcome NVIDIA's new Research Lab in Singapore, focussing on embodied AI and efficient AI.」`,
        contentKo: `2026년 5월 20일, NVIDIA가 ATxSummit 2026에서 싱가포르에 **첫 번째 싱가포르 연구 실험실**을 설립한다고 공개했습니다(또한 NVIDIA의 아시아태평양 지역에서의 두 번째 연구 거점). NVIDIA 최고 과학자이자 연구 수석 부사장인 Dr. William Dally가 공고에 참석했습니다.

**두 가지 연구 주선**:

1. **Embodied AI(구현 지능)**——로봇과 자율 시스템이 물리적 세계에서 감지, 추론, 실행합니다. 주요 응용 프로그램에는 지능형 검사, 자율 조립, 예측 유지보수가 포함되며, 싱가포르의 첨단 제조 기반과 같은 날 공개된 Punggol Digital District 다중 운영자 로봇 테스트베드와 연결됩니다.
2. **Efficient AI computing(효율적인 AI 컴퓨팅)**——계산 비용을 낮추고 에너지 효율을 향상시켜 더 광범위한 AI 배포를 지원합니다. 이는 NVIDIA 자체 하드웨어 로드맵(H100→B200→Rubin) 외에 알고리즘 계층, 시스템 계층 효율성 연구입니다.

**협력 모드**: 현지 대학, 산업 파트너, 정부 기관과 연합하여 연구를 수행합니다——구체적인 협력 기관은 공개되지 않았습니다. Dr. Dally는 같은 날 싱가포르 폴리테크닉에서 300명 이상의 폴리테크닉 / 대학 학생들과 IC 설계 경험을 공유했습니다.

**전략적 의의**: 싱가포르가 NVIDIA의 약 15% 전 지구적 수익에 기여하는 현황과 비교할 때, 이는 NVIDIA가 싱가포르에서 처음으로 순수 상업적 존재가 아닌 **연구 거점**을 설립한 것입니다——싱가포르를 「GPU 환적 중심」에서 「원본 AI 연구 노드」로 변환합니다. 같은 날 공개된 NAIS 업데이트 「첨단 제조」국가 AI 과제가 이 Lab과 강하게 호응합니다. Josephine Teo는 연설에서 「This is why we welcome NVIDIA's new Research Lab in Singapore, focussing on embodied AI and efficient AI.」라고 말했습니다.`,
        contentJa: `2026 年 5 月 20 日、NVIDIA は ATxSummit 2026 でシンガポールに**最初のシンガポール研究ラボ**（NVIDIA のアジア太平洋における 2 番目の研究拠点）を設立すると発表しました。NVIDIA チーフサイエンティスト・研究上級副社長の Dr. William Dally がこの発表に出席しました。

**2 つの研究の主軸**：

1. **Embodied AI（身体的 AI）**――ロボットや自律システムが物理世界で感知、推論、実行します。重点的な応用にはインテリジェント検査、自律的組立、予知保全が含まれ、シンガポールの先端製造業基盤および同日発表の Punggol Digital District 多事業者ロボット testbed と接続します。
2. **Efficient AI computing**――算力コストの低減、エネルギー効率の向上、より広範な AI デプロイのサポート。これは NVIDIA 自身のハードウェアロードマップ（H100→B200→Rubin）以外のアルゴリズム層・システム層の効率研究です。

**協力モデル**：現地の大学、産業パートナー、政府機関と共同で研究を行います――具体的な協力機関は未公表。Dr. Dally は同日、シンガポール工科専門学校で 300 人以上の理工学院・大学の学生に IC 設計の経験を共有しました。

**戦略的意義**：シンガポールが NVIDIA グローバル営収の約 15% に貢献している現状と比較して、NVIDIA が初めてシンガポールに**研究の存在**を確立した（純粋に商業的な存在ではなく）――シンガポールを「GPU 中継センター」の物語から「オリジナル AI 研究拠点」へと推し進めるものです。同日発表された NAIS アップデートの「先端製造」国家 AI ミッションはこの Lab と強く共鳴しています。Josephine Teo は講演で「This is why we welcome NVIDIA's new Research Lab in Singapore, focussing on embodied AI and efficient AI.」と述べました。`,
        contentEn: `On 20 May 2026, at ATxSummit 2026, NVIDIA announced its **first Singapore research lab** — also NVIDIA's second research presence in Asia Pacific. NVIDIA Chief Scientist and Senior Vice President of Research Dr. William Dally was present for the announcement.

**Two research tracks**:

1. **Embodied AI** — robots and autonomous systems that perceive, reason and act in the physical world. Application focus includes intelligent inspection, autonomous assembly, and predictive maintenance — aligning with Singapore's advanced-manufacturing base and the same-day Punggol Digital District multi-operator robot testbed.
2. **Efficient AI computing** — lowering compute costs, improving energy efficiency, and enabling broader AI deployment. This is algorithmic and systems-level efficiency research beyond NVIDIA's own hardware roadmap (H100 → B200 → Rubin).

**Collaboration model**: the lab will work with local universities, industry partners, and government agencies — specific partner institutions not disclosed at announcement. Dr. Dally also addressed 300+ polytechnic and university students at Singapore Polytechnic the same day on IC design.

**Strategic significance**: against the backdrop of Singapore contributing roughly 15% of NVIDIA's global revenue, this is NVIDIA's first **research** presence in Singapore — not just a commercial one. It moves Singapore from the "GPU rerouting hub" narrative toward "original AI research node." The "Advanced Manufacturing" mission under the same-day NAIS update strongly resonates with this lab. Josephine Teo's speech: "This is why we welcome NVIDIA's new Research Lab in Singapore, focussing on embodied AI and efficient AI."`,
        ministry: 'EDB',
        authorPersonIds: ['josephine-teo', 'jermaine-loy'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 3, 6],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-20',
      },
      {
        id: 'pdd-multi-operator-robot-testbed-2026',
        title: 'Punggol Digital District 多运营商机器人 testbed',
        titleKo: 'Punggol Digital District 다중 운영자 로봇 테스트베드',
        titleJa: 'Punggol Digital District 多事業者ロボット testbed',
        titleEn: 'Punggol Digital District Multi-Operator Robot Testbed',
        date: '2026-05',
        source: '资讯通信媒体发展局 (IMDA) / 裕廊集团 (JTC) / 新加坡理工大学 (SIT) / 陆路交通管理局 (LTA)',
        sourceKo: '정보통신미디어발전청 (IMDA) / 유롱 그룹 (JTC) / 싱가포르 폴리테크닉 (SIT) / 육로 교통 관리청 (LTA)',
        sourceJa: '情報通信メディア発展局 (IMDA) / 裕廊集団 (JTC) / シンガポール工科大学 (SIT) / 陸路交通管理局 (LTA)',
        sourceEn:
          'Infocomm Media Development Authority (IMDA) / JTC / Singapore Institute of Technology (SIT) / Land Transport Authority (LTA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/research-test-and-deploy-physical-ai-in-punggol-digital-district',
        summary:
          'IMDA 在 ATxSummit 2026 公布在 Punggol Digital District 建立片区级、多运营商、混合公共环境的 embodied AI testbed，2026 年下半年 launch。首批：Certis、DHL、Grab、QuikBot；配套 Centre for Intelligent Robotics（IMDA + NRP）。',
        summaryKo:
          'IMDA가 ATxSummit 2026에서 Punggol Digital District에 지역 수준, 다중 운영자, 혼합 공공 환경의 embodied AI 테스트베드를 설립한다고 공개했으며, 2026년 하반기에 출시됩니다. 첫 번째: Certis, DHL, Grab, QuikBot; 지원 Centre for Intelligent Robotics(IMDA + NRP).',
        summaryJa:
          'IMDA は ATxSummit 2026 で、Punggol Digital District に区域レベル・多事業者・混合公共環境型の embodied AI testbed を 2026 年後半に立ち上げると発表。最初の参加企業：Certis、DHL、Grab、QuikBot；併設の Centre for Intelligent Robotics（IMDA + NRP）。',
        summaryEn:
          'At ATxSummit 2026, IMDA announced a precinct-scale, multi-operator, mixed-use public-environment embodied-AI testbed at Punggol Digital District — launching later in 2026. First participants: Certis, DHL, Grab, QuikBot; paired with the Centre for Intelligent Robotics (IMDA + NRP).',
        content: `2026 年 5 月 20 日，IMDA 在 ATxSummit 2026 公布在 **Punggol Digital District（PDD）** 建立**多运营商机器人 testbed**——2026 年下半年正式 launch。这是从 2025 年规划期「片区级机器人 testbed」（IMDA-SIT-JTC 合作）走到正式商业 launch 的关键节点。

**首批运营方**（5/20 公布）：
- **Certis**——安全巡逻机器人
- **DHL**——物流 / 包裹配送
- **Grab**——食品配送
- **QuikBot**——参与配送 + 巡检

**testbed 核心创新**：「多运营商共址」——区别于此前单 operator trial。多家机器人公司可以在同一 PDD 物理空间同时部署、测试服务，按 *Active Mobility Act* 片区级豁免运营。

**配套**：
- **Centre for Intelligent Robotics（CIR）**——IMDA + 国家机器人计划（NRP）共建，知识伙伴 FieldAI、Thoughtworks，技术伙伴 Slamtec、Unitree、QuikBot
- **SIT 联合实验室**——与 Unitree、Slamtec、QuikBot 合作，覆盖机器人认知能力、空间感知、仿人机器人包裹分拣

**测试场景**：食品 + 包裹配送、清洁、安全巡逻——覆盖 PDD 真实公共环境。

**战略联动**：与同日公布的 NVIDIA Singapore AI Research Lab（embodied AI 主线）、NAIS 更新「先进制造」国家 AI 任务联动，三件事构成新加坡 embodied AI 战略 5/20 完整公告包。Josephine Teo 在演讲中说：「We are also developing Punggol Digital District as a frontier testbed... provide special testing permits for robot deployment.」`,
        contentKo: `2026년 5월 20일, IMDA가 ATxSummit 2026에서 **Punggol Digital District(PDD)**에 **다중 운영자 로봇 테스트베드**를 설립한다고 공개했습니다——2026년 하반기에 공식 출시됩니다. 이는 2025년 계획 기간의 「지역 수준 로봇 테스트베드」(IMDA-SIT-JTC 협력)에서 공식 상업 출시로 나아가는 핵심 시점입니다.

**첫 번째 운영업체**(5/20 공개):
- **Certis**——보안 순찰 로봇
- **DHL**——물류 / 소포 배송
- **Grab**——음식 배송
- **QuikBot**——배송 참여 + 검사

**테스트베드 핵심 혁신**: 「다중 운영자 공존」——이전의 단일 운영자 시험과 구별됩니다. 여러 로봇 회사가 동일한 PDD 물리적 공간에서 동시에 배포하고, 서비스를 테스트하며, *Active Mobility Act* 지역 수준 면제에 따라 운영할 수 있습니다.

**지원**:
- **Centre for Intelligent Robotics(CIR)**——IMDA + 국가 로봇 계획(NRP) 공동 건설, 지식 파트너 FieldAI, Thoughtworks, 기술 파트너 Slamtec, Unitree, QuikBot
- **SIT 공동 실험실**——Unitree, Slamtec, QuikBot과 협력, 로봇 인지 능력, 공간 인식, 인간형 로봇 소포 분류 포함

**테스트 시나리오**: 식품 + 소포 배송, 청소, 보안 순찰——PDD 실제 공공 환경을 포함합니다.

**전략적 연계**: 같은 날 공개된 NVIDIA Singapore AI Research Lab(embodied AI 주선), NAIS 업데이트 「첨단 제조」국가 AI 과제와 연계되어, 세 가지 사항이 싱가포르 embodied AI 전략 5/20 완전한 공고 패키지를 구성합니다. Josephine Teo는 연설에서 「We are also developing Punggol Digital District as a frontier testbed... provide special testing permits for robot deployment.」라고 말했습니다.`,
        contentJa: `2026 年 5 月 20 日、IMDA は ATxSummit 2026 で **Punggol Digital District（PDD）** に**多事業者ロボット testbed** を構築すると発表しました――2026 年下半期に正式 launch。これは 2025 年計画段階の「区域レベルロボット testbed」（IMDA-SIT-JTC 協力）から正式な商業 launch への重要な節目です。

**最初の参加事業者**（5/20 発表）：
- **Certis**――セキュリティ巡回ロボット
- **DHL**――物流・荷物配送
- **Grab**――食品配送
- **QuikBot**――配送 + 巡視に参加

**testbed のコアイノベーション**：「多事業者共存」――これまでの単一 operator 試験とは異なり、複数のロボット企業が同じ PDD 物理空間で同時にデプロイ、サービステストが可能。*Active Mobility Act* の区域レベル豁免の下で運営。

**併設**：
- **Centre for Intelligent Robotics（CIR）**――IMDA + 国家ロボット計画（NRP）が共同構築、知識パートナーは FieldAI、Thoughtworks、技術パートナーは Slamtec、Unitree、QuikBot
- **SIT 共同研究所**――Unitree、Slamtec、QuikBot と協力し、ロボットの認知能力、空間感知、ヒューマノイドロボットの荷物仕分けをカバー

**テスト場面**：食品・荷物配送、清掃、セキュリティ巡回――PDD のリアルな公共環境をカバー。

**戦略的連動**：同日発表の NVIDIA Singapore AI Research Lab（embodied AI 主軸）、NAIS アップデート「先端製造」国家 AI ミッションと連動し、3 件でシンガポール embodied AI 戦略の 5/20 完全公告パッケージを構成します。Josephine Teo は講演で「We are also developing Punggol Digital District as a frontier testbed... provide special testing permits for robot deployment.」と述べました。`,
        contentEn: `On 20 May 2026, at ATxSummit 2026, IMDA announced a **multi-operator robot testbed** at **Punggol Digital District (PDD)** — launching later in 2026. This is the moment the precinct-scale robotics testbed (IMDA-SIT-JTC collaboration, in planning since 2025) moves from concept to commercial launch.

**First-batch operators** (announced 5/20):
- **Certis** — security patrol robots
- **DHL** — logistics and parcel delivery
- **Grab** — food delivery
- **QuikBot** — delivery + inspection

**Core innovation**: "multi-operator co-located" — unlike prior single-operator trials, multiple robot companies will deploy and test services in the same physical PDD space simultaneously, under a precinct-level exemption granted by the *Active Mobility Act*.

**Companion infrastructure**:
- **Centre for Intelligent Robotics (CIR)** — co-built by IMDA + the National Robotics Programme (NRP), with knowledge partners FieldAI and Thoughtworks, and technology partners Slamtec, Unitree and QuikBot
- **SIT joint labs** — with Unitree, Slamtec and QuikBot, covering robot cognitive capabilities, spatial perception, and humanoid-robot parcel sorting

**Test scenarios**: food and parcel delivery, cleaning, and security patrol — across PDD's real public environment.

**Strategic linkage**: together with the same-day NVIDIA Singapore AI Research Lab (embodied-AI axis) and the "Advanced Manufacturing" mission under the NAIS update, the three announcements form Singapore's complete 5/20 embodied-AI strategy package. Teo's speech: "We are also developing Punggol Digital District as a frontier testbed... provide special testing permits for robot deployment."`,
        ministry: 'IMDA',
        authorPersonIds: ['josephine-teo'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 3, 5],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-20',
      },
      {
        id: 'openai-for-singapore-2026',
        title: 'OpenAI for Singapore 合作计划',
        titleKo: 'OpenAI for Singapore 협력 계획',
        titleJa: 'OpenAI for Singapore 協力計画',
        titleEn: 'OpenAI for Singapore',
        date: '2026-05',
        source: 'OpenAI / 数字发展与信息部 (MDDI)',
        sourceKo: 'OpenAI / 디지털 개발 및 정보부 (MDDI)',
        sourceJa: 'OpenAI / デジタル発展・情報部 (MDDI)',
        sourceEn: 'OpenAI / Ministry of Digital Development and Information (MDDI)',
        sourceOrgUrl: 'https://openai.com/',
        sourceUrl: 'https://openai.com/index/introducing-openai-for-singapore/',
        summary:
          'OpenAI 与 MDDI 在 ATxSummit 2026 公布 OpenAI for Singapore：承诺超过 S$300M，在新加坡建立美国以外首个 Applied AI Lab，并在未来几年创造 200+ 本地技术岗位。',
        summaryKo:
          'OpenAI와 MDDI는 ATxSummit 2026에서 OpenAI for Singapore를 발표했습니다. S$300M 이상을 약속하고, 미국 밖 첫 Applied AI Lab을 싱가포르에 설립하며, 향후 몇 년간 200개 이상의 현지 기술 직무를 창출합니다.',
        summaryJa:
          'OpenAI と MDDI は ATxSummit 2026 で OpenAI for Singapore を発表。S$300M 超をコミットし、米国外初の Applied AI Lab をシンガポールに設立、今後数年で 200 以上の現地技術職を創出します。',
        summaryEn:
          'OpenAI and MDDI announced OpenAI for Singapore at ATxSummit 2026: a commitment of more than S$300M, OpenAI’s first Applied AI Lab outside the United States, and 200+ Singapore-based technical roles over the next few years.',
        content: `2026 年 5 月 19 日，OpenAI 宣布与新加坡数字发展与信息部 (MDDI) 推出 **OpenAI for Singapore**，并在 5 月 20 日 ATxSummit 2026 由 IMDA / MDDI 对外纳入同日 AI 落地包。官方口径包括三条主线：前沿 AI 落地、下一代本地 AI 人才、让公民和企业更广泛受益。

核心事实：
- **超过 S$300M 承诺**：投入新加坡 AI 生态。
- **Applied AI Lab**：设在新加坡，是 OpenAI 美国以外第一个 Applied AI Lab。
- **200+ 本地技术岗位**：未来几年在新加坡建立技术团队，新加坡也会成为 Forward-Deployed Engineers 的全球枢纽之一。
- **对齐国家 AI 任务**：重点支持公共服务、金融、医疗、数字基础设施等场景。
- **人才与采用**：与教育部、GovTech、本地生态伙伴合作，包括 OpenAI Academy 新加坡章节、Codex for Teachers hackathon、Forward-Deployed Engineer training programme，并参与 National AI Impact Programme。

这不是简单的区域总部新闻，而是把 OpenAI 的工程部署能力接到新加坡 NAIS / NAIC 执行管线里。对 sgai.md 来说，它应被记录为 2026-05 战略更新中的“外资前沿能力 + 本地人才 + 产业采用”节点。`,
        contentKo: `2026년 5월 19일, OpenAI는 싱가포르 디지털 개발 및 정보부(MDDI)와 **OpenAI for Singapore**를 추진한다고 발표했고, 5월 20일 ATxSummit 2026에서 IMDA / MDDI의 같은 날 AI 실전 배포 패키지에 포함되었습니다. 공식 구도는 세 가지입니다: 프런티어 AI 배포, 차세대 현지 AI 인재, 시민과 기업의 더 넓은 수혜입니다.

핵심 사실:
- **S$300M 이상 약속**: 싱가포르 AI 생태계에 투자.
- **Applied AI Lab**: 싱가포르에 설립되며, OpenAI가 미국 밖에 세우는 첫 Applied AI Lab입니다.
- **200개 이상의 현지 기술 직무**: 향후 몇 년간 싱가포르 기반 기술팀을 만들고, 싱가포르를 Forward-Deployed Engineers의 글로벌 거점 중 하나로 만듭니다.
- **국가 AI 과제와 정렬**: 공공 서비스, 금융, 의료, 디지털 인프라를 중점 지원합니다.
- **인재와 도입**: 교육부, GovTech, 현지 생태계 파트너와 협력하며 OpenAI Academy 싱가포르 챕터, Codex for Teachers hackathon, Forward-Deployed Engineer training programme, National AI Impact Programme 참여를 포함합니다.

이는 단순한 지역 본부 뉴스가 아니라 OpenAI의 엔지니어링 배포 역량을 싱가포르 NAIS / NAIC 실행 파이프라인에 연결하는 사건입니다. sgai.md에서는 2026-05 전략 업데이트의 “외국 프런티어 역량 + 현지 인재 + 산업 도입” 노드로 기록해야 합니다.`,
        contentJa: `2026 年 5 月 19 日、OpenAI はシンガポールのデジタル発展・情報部 (MDDI) と **OpenAI for Singapore** を発表し、5 月 20 日の ATxSummit 2026 で IMDA / MDDI の同日 AI 実装パッケージに組み込まれました。公式の柱は、フロンティア AI の実装、次世代の現地 AI 人材、国民と企業への広いアクセスです。

主な事実：
- **S$300M 超のコミットメント**：シンガポール AI エコシステムへの投資。
- **Applied AI Lab**：シンガポールに設置。OpenAI にとって米国外初の Applied AI Lab です。
- **200 以上の現地技術職**：今後数年でシンガポールベースの技術チームを作り、Forward-Deployed Engineers のグローバル拠点の一つにします。
- **国家 AI ミッションとの整合**：公共サービス、金融、医療、デジタルインフラを重点支援。
- **人材と採用**：教育省、GovTech、現地エコシステムパートナーと協力し、OpenAI Academy シンガポール章、Codex for Teachers hackathon、Forward-Deployed Engineer training programme、National AI Impact Programme への参加を含みます。

これは単なる地域本部ニュースではなく、OpenAI のエンジニアリング実装能力をシンガポールの NAIS / NAIC 実行パイプラインに接続する動きです。sgai.md では、2026-05 戦略更新の「外資フロンティア能力 + 現地人材 + 産業採用」ノードとして扱うべきです。`,
        contentEn: `On 19 May 2026, OpenAI announced **OpenAI for Singapore** with the Ministry of Digital Development and Information (MDDI). On 20 May, IMDA / MDDI positioned it as part of the same ATxSummit 2026 real-world AI deployment package. The official frame has three pillars: frontier AI deployment, next-generation local AI talent, and broader access for citizens and enterprises.

Key facts:
- **More than S$300M committed** to Singapore’s AI ecosystem.
- **Applied AI Lab** in Singapore, OpenAI’s first outside the United States.
- **200+ Singapore-based technical roles** over the next few years, with Singapore becoming one of OpenAI’s global hubs for Forward-Deployed Engineers.
- **Alignment with National AI Missions**, especially public service, finance, healthcare, and digital infrastructure.
- **Talent and adoption** through work with MOE, GovTech and local ecosystem partners, including an OpenAI Academy Singapore chapter, Codex for Teachers hackathons, a Forward-Deployed Engineer training programme, and participation in the National AI Impact Programme.

This is not just a regional-HQ story. It connects OpenAI’s deployment engineering capacity into Singapore’s NAIS / NAIC execution pipeline. For sgai.md, it belongs in the May 2026 strategy refresh as a node combining foreign frontier capability, local talent, and enterprise adoption.`,
        ministry: 'MDDI',
        authorPersonIds: ['josephine-teo'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 3, 6],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-24',
      },
      {
        id: 'public-ai-research-investment-2026-2030',
        title: '公共 AI 研究投资计划 (2026-2030)',
        titleKo: '공공 AI 연구 투자 계획 (2026-2030)',
        titleJa: '公開 AI 研究投資計画 (2026-2030)',
        titleEn: 'Public AI Research Investment 2026-2030',
        date: '2026-01',
        source: '数字发展与信息部 (MDDI)',
        sourceKo: '디지털 개발 및 정보부 (MDDI)',
        sourceJa: 'デジタル発展・情報部 (MDDI)',
        sourceOrgUrl: 'https://www.mddi.gov.sg/',
        sourceUrl:
          'https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/',
        summary: '10 亿新元（7.79 亿美元）公共 AI 研究投资，聚焦负责任和资源高效的 AI。',
        summaryKo: '10억 신원(7.79억 미국 달러) 공공 AI 연구 투자, 책임 있고 자원 효율적인 AI에 초점',
        summaryJa:
          '10 億シンガポール・ドル（7.79 億米ドル）の公開 AI 研究投資。責任ある、リソース効率の高い AI に焦点を当てています。',
        content: `2026 年 1 月 24 日，数字发展与信息部宣布 2026-2030 年间投资超 10 亿新元（约 7.79 亿美元）用于公共 AI 研究。三大方向：一是"负责任和资源高效的 AI"研究，延续 AI Verify 等可信赖 AI 路线；二是全链条 AI 人才培养，从高中预科到大学教师培训；三是支持产业应用，缩短研究到商业化路径。这是继 2024 年 5 亿新元高性能计算资源投资后的又一重大投入，标志着新加坡从"试点探索"进入"规模化建设"阶段。人均 AI 投资达 139 美元，远高于美国（33 美元）和中国（7 美元）。`,
        contentKo: `2026년 1월 24일, 디지털 개발 및 정보부가 2026-2030년 간 공공 AI 연구에 10억 신원을 초과(약 7억 7,900만 미국 달러)에 투자한다고 선언했습니다. 세 가지 주요 방향: 첫째, 「책임 있는 자원 효율적인 AI」연구, AI Verify 등 신뢰할 수 있는 AI 경로 계속; 둘째, 전체 체인 AI 인재 양성, 고등학교 예과에서 대학 교사 훈련까지; 셋째, 산업 응용 지원, 연구에서 상용화 경로 단축. 이는 2024년 5억 신원 고성능 컴퓨팅 자원 투자에 이은 또 다른 주요 투입이며, 싱가포르가 「시범 탐색」에서 「규모화 건설」 단계로 진입했음을 나타냅니다. 일인당 AI 투자는 139 미국 달러에 도달했으며, 미국(33 미국 달러)과 중국(7 미국 달러)보다 훨씬 높습니다.`,
        contentJa: `2026年1月24日、デジタル開発・情報省は2026～2030年間に10億シンガポール・ドル以上（約7.79億米ドル）を公共AI研究に投資することを発表しました。3つの主要な方向があります：1つ目は「責任ある・リソース効率的なAI」研究で、AI Verifyなどの信頼できるAI路線を継続するものです。2つ目は全チェーンのAI人材育成で、高校予科から大学教員研修までをカバーします。3つ目は産業応用を支援し、研究から商業化へのパスを短縮するものです。これは2024年の5億シンガポール・ドルの高性能計算リソース投資に続く重大な投入であり、シンガポールが「パイロット探索」から「規模化構築」段階への移行を示しています。一人当たりのAI投資は139米ドルに達し、米国（33米ドル）と中国（7米ドル）をはるかに上回っています。`,
        summaryEn:
          'S$1 billion (US$779 million) in public AI research investment, focused on responsible and resource-efficient AI.',
        contentEn: `On 24 January 2026, the Ministry of Digital Development and Information announced over S$1 billion (about US$779 million) in public AI research funding for 2026-2030. Three priorities: research on "responsible and resource-efficient AI," extending the trusted-AI track that includes AI Verify; full-pipeline AI talent development, from junior college pre-tertiary programmes to university faculty training; and industry applications, shortening the path from research to commercialisation. Coming after 2024's S$500 million in high-performance computing, this marks Singapore's shift from pilot exploration to scaled build-out. Per-capita AI investment reaches US$139 — far above the US (US$33) and China (US$7).`,
        sourceEn: 'Ministry of Digital Development and Information (MDDI)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'national-ai-strategy-20-nais-20',
        title: '国家人工智能战略 2.0',
        titleKo: '국가 인공지능 전략 2.0',
        titleJa: '国家 AI 戦略 2.0',
        titleEn: 'National AI Strategy 2.0 (NAIS 2.0)',
        date: '2023-12',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceKo: '스마트 싱가포르 및 디지털 정부 사무실 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        pdfUrl: 'https://file.go.gov.sg/nais2023.pdf',
        translatedPdfUrl: '/pdfs/nais-2.0-zh.pdf',
        summary: '升级版国家 AI 战略，提出 AI for Public Good、AI for Growth 双轨目标，确定九大优先领域。',
        summaryKo:
          '업그레이드된 국가 AI 전략으로, AI for Public Good, AI for Growth 이원 목표를 제시하고 9개 우선 영역을 확정합니다.',
        summaryJa:
          '国家 AI 戦略の改定版。「AI for Public Good」「AI for Growth」の二本柱を掲げ、九つの重点領域を特定しています。',
        content: `NAIS 2.0 将 AI 战略从"重点应用"升级为"系统性赋能"。双轨目标：AI for Public Good 和 AI for Growth。涵盖十五大行动，追加拨款至 10 亿新元以上，建设国家 AI 计算基础设施。确定九大优先领域：交通物流、制造业、金融、安全、网络安全、智慧城市、医疗、教育和政府服务，其中医疗和金融科技获最高投资比重。`,
        contentKo: `NAIS 2.0는 AI 전략을 「주요 응용」에서 「체계적 기능 강화」로 업그레이드합니다. 이원 목표: AI for Public Good과 AI for Growth. 15개 주요 행동을 포함하며, 10억 신원 이상으로 추가 자금을 배정하고, 국가 AI 컴퓨팅 기초 인프라를 구축합니다. 9개 우선 영역을 확정합니다: 교통 물류, 제조업, 금융, 안전, 사이버보안, 스마트 시티, 의료, 교육 및 정부 서비스. 이 중 의료와 핀테크가 가장 높은 투자 비중을 차지합니다.`,
        contentJa: `NAIS 2.0は、AI戦略を「重点的応用」から「システム的エンパワーメント」へアップグレードしています。二軌並行の目標：AI for Public GoodおよびAI for Growth。15の大きな行動を含み、10億シンガポール・ドル以上の追加予算配分が行われ、国家AI計算基盤が構築されます。9つの優先領域が特定されています：交通物流、製造業、金融、安全、サイバーセキュリティ、スマートシティ、医療、教育、および政府サービス。このうち医療と金融技術が最も高い投資比率を受けています。`,
        summaryEn:
          'Upgraded national AI strategy with twin tracks — AI for Public Good and AI for Growth — and nine priority sectors.',
        contentEn: `NAIS 2.0 shifts Singapore's AI strategy from targeted applications to systemic enablement. Twin objectives: AI for Public Good and AI for Growth. The strategy spans fifteen action lines, lifts the funding envelope above S$1 billion, and builds out national AI compute infrastructure. Nine priority sectors are designated: transport and logistics, manufacturing, finance, safety and security, cybersecurity, smart cities, healthcare, education, and government services — with healthcare and fintech receiving the largest investment weighting.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: 'MDDI',
        authorPersonIds: ['josephine-teo', 'lawrence-wong'],
        relatedDebateIds: [],
        relatedLeverNumbers: [1, 2, 3, 4, 5, 6],
        relatedTimelineYears: [2024, 2026],
        relatedPostSlugs: ['singapore-ai-strategy-the-real-moat', 'singapore-ai-native-companies-vs-nations'],
      },
      {
        id: 'smart-nation-20',
        title: '智慧国家 2.0',
        titleKo: '스마트 싱가포르 2.0',
        titleJa: 'スマート・ネーション 2.0',
        titleEn: 'Smart Nation 2.0',
        date: '2023-10',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceKo: '스마트 싱가포르 및 디지털 정부 사무실 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        translatedPdfUrl: '/pdfs/smart-nation-2.0-zh.pdf',
        summary: '数字基础设施升级蓝图，涵盖数字政府、数字经济、数字社会三大支柱。',
        summaryKo:
          '디지털 기초 인프라 업그레이드 청사진으로, 디지털 정부, 디지털 경제, 디지털 사회 3대 기둥을 포함합니다.',
        summaryJa: 'デジタル基盤施設のアップグレード計画。デジタル政府、デジタル経済、デジタル社会の三本柱を含みます。',
        content: `Smart Nation 2.0 是 2014 年智慧国家倡议的全面升级，于 2023 年 10 月发布。三大支柱：数字政府——推动政府服务全面数字化和 AI 化；数字经济——支持企业数字化转型和 AI 采纳；数字社会——确保全民具备数字素养，缩小数字鸿沟。2024 年 10 月启动具体落地计划，包括 1.2 亿新元 AI 应用基金，支持五大国家 AI 项目：智能货运规划、市政服务、慢性病预测与管理、个性化教育和边境清关。在基础设施层面，规划了国家级 AI 计算平台、数据共享基础设施和安全的数字身份体系。`,
        contentKo: `Smart Nation 2.0는 2014년의 스마트 싱가포르 이니셔티브의 전면적 업그레이드이며, 2023년 10월에 발표되었습니다. 3대 기둥: 디지털 정부—정부 서비스의 전면적 디지털화·AI화 추진; 디지털 경제—기업의 디지털 변혁 및 AI 도입 지원; 디지털 사회—국민 전체의 디지털 소양 보장 및 디지털 격차 축소. 2024년 10월에 1.2억 신원의 AI 애플리케이션 펀드를 포함한 구체적 실행 계획을 시작했으며, 5개 국가 AI 프로젝트를 지원합니다: 지능형 화물 운송 계획, 시정 서비스, 만성질환 예측 및 관리, 맞춤형 교육 및 국경 통관. 기초 인프라 차원에서는 국가급 AI 컴퓨팅 플랫폼, 데이터 공유 기초 인프라 및 안전한 디지털 신원 체계를 수립했습니다.`,
        contentJa: `Smart Nation 2.0は、2014年のSmart Nation Initiativeの全面的なアップグレードであり、2023年10月に発表されました。3つの支柱があります：デジタル政府――政府サービスの完全なデジタル化とAI化を推進すること。デジタル経済――企業のデジタル変革とAI採用を支援すること。デジタル社会――全国民にデジタルリテラシーを備えさせ、デジタル格差を縮小すること。2024年10月に具体的な実装計画が開始され、1.2億シンガポール・ドルのAI応用基金が含まれ、5つの国家AIプロジェクトを支援しています：インテリジェント貨物運送計画、市政サービス、慢性疾患予測・管理、個別化教育、および国境通関。インフラストラクチャレベルでは、国家レベルのAI計算プラットフォーム、データ共有インフラストラクチャ、および安全なデジタルアイデンティティシステムが計画されています。`,
        summaryEn:
          'Digital infrastructure upgrade blueprint built on three pillars: Digital Government, Digital Economy, Digital Society.',
        contentEn: `Smart Nation 2.0, released in October 2023, is a full upgrade of the 2014 Smart Nation Initiative. Three pillars: Digital Government — driving end-to-end digitalisation and AI adoption across public services; Digital Economy — supporting enterprise digital transformation and AI adoption; Digital Society — ensuring universal digital literacy and closing the digital divide. In October 2024, an implementation plan was launched, including a S$120 million AI application fund supporting five national AI projects: intelligent freight planning, municipal services, chronic disease prediction and management, personalised education, and border clearance. At the infrastructure layer, the plan covers a national AI compute platform, data-sharing infrastructure, and a secure digital identity system.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'national-ai-strategy-nais-10',
        title: '国家人工智能战略 1.0',
        titleKo: '국가 인공지능 전략 1.0',
        titleJa: '国家 AI 戦略 1.0',
        titleEn: 'National AI Strategy (NAIS 1.0)',
        date: '2019-11',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceKo: '스마트 싱가포르 및 디지털 정부 사무실 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        pdfUrl: 'https://file.go.gov.sg/nais2019.pdf',
        translatedPdfUrl: '/pdfs/nais-1.0-zh.pdf',
        summary: '新加坡首份国家级 AI 战略，确立五大重点领域和三大推动力。',
        summaryKo: '싱가포르의 첫 국가급 AI 전략으로, 5대 중점 영역과 3대 추진력을 수립합니다.',
        summaryJa: 'シンガポール初の国家レベルの AI 戦略。五つの重点領域と三つの推進力を確立しています。',
        content: `NAIS 1.0 标志着 AI 从技术议题上升为国家战略。五大重点领域：智能交通与物流、智慧城市、医疗健康、教育、安全与保障。三大推动力：三重螺旋合作、AI 人才管道、数据架构与可信 AI。催生了 AI Singapore 项目和 100 Experiments 计划。`,
        contentKo: `NAIS 1.0는 AI가 기술 이슈에서 국가 전략으로 격상됨을 의미합니다. 5대 중점 영역: 지능형 교통·물류, 스마트 시티, 의료 건강, 교육, 안전 및 보장. 3대 추진력: 트리플 헬릭스 협력, AI 인재 파이프라인, 데이터 아키텍처 및 신뢰 AI. AI Singapore 프로젝트와 100 Experiments 계획을 낳았습니다.`,
        contentJa: `NAIS 1.0は、AIが技術問題から国家戦略へと上昇したことを示しています。5つの重点領域：インテリジェント交通・物流、スマートシティ、医療・健康、教育、セキュリティ・保障。3つの推進力：トリプルヘリックス協力、AI人材パイプライン、データアーキテクチャおよび信頼できるAI。これはAI Singaporeプロジェクトと100 Experiments計画を生み出しました。`,
        summaryEn: "Singapore's first national AI strategy, identifying five focus sectors and three enablers.",
        contentEn: `NAIS 1.0 marked the elevation of AI from a technology topic to a national strategy. Five focus sectors: intelligent transport and logistics, smart cities, healthcare, education, and safety and security. Three enablers: triple-helix collaboration, an AI talent pipeline, and data architecture plus trusted AI. The strategy spawned AI Singapore and the 100 Experiments programme.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'smart-nation-initiative',
        title: '智慧国家倡议',
        titleKo: '스마트 네이션 이니셔티브',
        titleJa: 'スマート・ネーション・イニシアティブ',
        titleEn: 'Smart Nation Initiative',
        date: '2014',
        source: '总理办公室 (PMO)',
        sourceKo: '총리실 (PMO)',
        sourceJa: '首相府 (PMO)',
        sourceOrgUrl: 'https://www.pmo.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/about/our-vision/smart-nation-vision/',
        pdfUrl:
          'https://www.pmo.gov.sg/Newsroom/transcript-prime-minister-lee-hsien-loongs-speech-smart-nation-launch-24-november',
        translatedPdfUrl: '/pdfs/smart-nation-initiative-zh.pdf',
        summary: '新加坡数字化转型总体框架，为后续 AI 战略奠定基础。',
        summaryKo: '싱가포르 디지털 전환 종합 프레임워크로 이후 AI 전략의 기초를 마련합니다.',
        summaryJa: 'シンガポールのデジタル変革全体フレームワーク。その後の AI 戦略の基礎を築いています。',
        content: `2014 年，新加坡总理李显龙宣布 Smart Nation Initiative，这是全面数字化转型的总体战略框架。核心目标包括利用数字技术改善市民生活、创造更多经济机会、建设更紧密联系的社区。虽非专门的 AI 政策，但为后续 AI 战略提供了制度基础和政策框架。`,
        contentKo: `2014년, 싱가포르 총리 Lee Hsien Loong이 Smart Nation Initiative를 발표했으며, 이는 포괄적 디지털 변혁의 종합 전략 프레임워크입니다. 핵심 목표는 디지털 기술을 활용하여 시민 생활을 개선하고, 더 많은 경제 기회를 창출하고, 더 긴밀하게 연결된 지역사회를 구축하는 것입니다. 비록 전문적인 AI 정책은 아니지만, 이후 AI 전략을 위한 제도적 기초 및 정책 프레임워크를 제공했습니다.`,
        contentJa: `2014年、シンガポール首相Lee Hsien Loongは Smart Nation Initiativeを発表しました。これは全面的なデジタル変革の総体的な戦略フレームワークです。中核的な目標は、デジタル技術を利用して市民生活を改善すること、より多くの経済的機会を創造すること、より緊密に結びついたコミュニティを構築することを含みます。AI専門の政策ではありませんが、その後のAI戦略に制度的基盤と政策的枠組みを提供しました。`,
        summaryEn:
          "Singapore's overarching digital transformation framework, laying the institutional foundation for subsequent AI strategies.",
        contentEn: `In 2014, Prime Minister Lee Hsien Loong announced the Smart Nation Initiative as a whole-of-nation strategic framework for digital transformation. Core goals: use digital technology to improve citizens' lives, create more economic opportunities, and build more tightly connected communities. Although not an AI-specific policy, it provided the institutional and policy foundation for subsequent AI strategies.`,
        sourceEn: "Prime Minister's Office (PMO)",
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'saf-digital-and-intelligence-service-fourth-service',
        title: 'SAF Digital and Intelligence Service (DIS)',
        titleKo: 'SAF 디지털 및 정보 서비스 (DIS)',
        titleJa: 'SAF デジタル・インテリジェンスサービス (DIS)',
        titleEn: 'SAF Digital and Intelligence Service — Fourth Service',
        date: '2022-10',
        source: '国防部 (MINDEF)',
        sourceKo: '국방부 (MINDEF)',
        sourceJa: '国防部 (MINDEF)',
        sourceOrgUrl: 'https://www.mindef.gov.sg/',
        sourceUrl: 'https://www.mindef.gov.sg/news-and-events/latest-releases/28oct22_speech',
        summary: 'SAF 第四军种成立——把 AI 与数字情报写进军种结构本身。',
        summaryKo: 'SAF 제4군종 설립—AI와 디지털 정보를 군종 구조 자체에 내재시킵니다.',
        summaryJa: 'SAF 第四軍種の創設。AI とデジタル情報を軍種構造そのものに組み込みます。',
        content: `2022 年 10 月，新加坡国防部正式成立 SAF Digital and Intelligence Service (DIS)，作为陆军、海军、空军之外的第四军种，专责数字与情报作战、网络防御、AI 决策支持。2025 年 DIS 进一步重组为 DCCOM（数字网络指挥部）和 SAFC4DC（C4 与防务计算指挥部）两个司令部。这是新加坡国家级 AI-native 战略最深的结构性动作——把 AI 写进军种本身，而非作为某个部门的项目。配套：DIS × AI Singapore MoU、DIS Sentinel Programme + AI 课程、SAF Digital Range / CyTEC 升级。`,
        contentKo: `2022년 10월, 싱가포르 국방부는 공식적으로 SAF Digital and Intelligence Service(DIS)를 설립했으며, 육군, 해군, 공군 외의 제4군종으로서 디지털 및 정보 작전, 사이버 방위, AI 의사결정 지원을 담당합니다. 2025년 DIS는 DCCOM(디지털 네트워크 사령부)과 SAFC4DC(C4 및 방위 컴퓨팅 사령부) 두 사령부로 추가 개편되었습니다. 이것은 싱가포르 국가급 AI-네이티브 전략의 가장 깊은 구조적 조치입니다—AI를 특정 부서의 프로젝트가 아닌 군종 자체에 내재시킨 것입니다. 보완 사항: DIS × AI Singapore MoU, DIS Sentinel Programme + AI 교육과정, SAF Digital Range / CyTEC 업그레이드.`,
        contentJa: `2022年10月、シンガポール国防省は正式にSAF Digital and Intelligence Service (DIS)を設立しました。これは陸軍、海軍、空軍に次ぐ第4の軍種として機能し、デジタル・インテリジェンス作戦、サイバー防御、AI意思決定支援を専門とします。2025年、DISはDCCOM（デジタルネットワーク司令部）とSAFC4DC（C4および防御計算司令部）の2つの司令部へさらに再編成されます。これはシンガポール国家レベルのAI-ネイティブ戦略における最も深い構造的な動きです――AIを軍種そのものに組み込むことで、ある部門のプロジェクトとしてではなく実現します。対応措置：DIS × AI Singapore MoU、DIS Sentinel Programme + AIコース、SAF Digital Range / CyTEC アップグレード。`,
        summaryEn:
          "Establishment of the SAF's fourth Service — embedding AI and digital intelligence into the force structure itself.",
        contentEn: `In October 2022, Singapore's Ministry of Defence formally established the SAF Digital and Intelligence Service (DIS) as the fourth Service alongside the Army, Navy, and Air Force, with sole responsibility for digital and intelligence operations, cyber defence, and AI decision support. In 2025, DIS was further reorganised into two commands: DCCOM (Digital Cyber Command) and SAFC4DC (C4 and Defence Computing Command). This is the deepest structural move in Singapore's national AI-native strategy — writing AI into the Service structure itself rather than running it as a departmental project. Supporting elements include the DIS × AI Singapore MoU, the DIS Sentinel Programme with AI curriculum, and upgrades to the SAF Digital Range / CyTEC.`,
        sourceEn: 'Ministry of Defence (MINDEF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'singapore-ai-safety-institute',
        title: 'Singapore AI Safety Institute (AISI)',
        titleKo: '싱가포르 AI 안전 연구소 (AISI)',
        titleJa: 'シンガポール AI 安全研究所 (AISI)',
        titleEn: 'Singapore AI Safety Institute',
        date: '2024-05',
        source: 'IMDA / Digital Trust Centre',
        sourceKo: 'IMDA / 디지털 신뢰 센터',
        sourceJa: 'IMDA / デジタルトラストセンター',
        sourceOrgUrl: 'https://sgaisi.sg/',
        sourceUrl: 'https://sgaisi.sg/',
        summary: '前沿 AI 安全研究的国家级研究所，承担 Singapore Consensus 协调职能。',
        summaryKo: '선도적 AI 안전 연구의 국가급 연구소로 Singapore Consensus 협력 기능을 담당합니다.',
        summaryJa: '最先端の AI 安全研究に関する国家レベルの研究所。Singapore Consensus の調整機能を担当しています。',
        content: `Singapore AI Safety Institute (AISI) 于 2024 年成立，年度预算 S$10M，由 IMDA 与 Digital Trust Centre 联合运营，挂靠 NTU。承担前沿 AI 模型的红队评估、对齐研究、可追溯性测试三类核心研究。AISI 还作为 Singapore Consensus on Global AI Safety Research Priorities 的协调中心，并主办 International Scientific Exchange on AI Safety。官方口径中，Singapore Consensus 来自 2025 年 SCAI: ISE，汇集 11 个国家的 100+ 参与者形成“活文件”，2026 年 ISE 继续更新研究优先级；它不是“11 国签署”的政府间协议。AISI 是新加坡"用 0.07% 全球人口撬动 G7 级 AI 治理话语权"战略最关键的机构。`,
        contentKo: `Singapore AI Safety Institute(AISI)는 2024년 설립되었으며, 연간 예산은 S$10M이고, IMDA와 Digital Trust Centre가 공동으로 운영하며 NTU에 속합니다. 선도적 AI 모델의 레드팀 평가, 정렬 연구, 추적 가능성 테스트의 세 가지 핵심 연구를 수행합니다. AISI는 Singapore Consensus on Global AI Safety Research Priorities의 조율 중심이며 International Scientific Exchange on AI Safety를 주최합니다. 공식 구도에서 Singapore Consensus는 2025년 SCAI: ISE에서 나왔고, 11개국의 100명 이상 참여자가 만든 “살아 있는 문서”이며, 2026년 ISE가 연구 우선순위를 계속 업데이트합니다. 이는 “11개국이 서명한” 정부 간 협정이 아닙니다. AISI는 싱가포르의 「0.07% 글로벌 인구로 G7급 AI 거버넌스 발언권을 활용하는」 전략의 가장 중요한 기관입니다.`,
        contentJa: `Singapore AI Safety Institute (AISI) は 2024 年に設立され、年間予算は S$10M、IMDA と Digital Trust Centre が共同運営し、NTU に置かれています。最先端 AI モデルのレッドチーム評価、アライメント研究、トレーサビリティテストを担います。AISI は Singapore Consensus on Global AI Safety Research Priorities の調整中心でもあり、International Scientific Exchange on AI Safety を主催します。公式口径では、Singapore Consensus は 2025 年 SCAI: ISE から生まれ、11 カ国の 100 名超の参加者による「living document」で、2026 年 ISE が研究優先事項を更新します。これは「11 カ国が署名した」政府間協定ではありません。AISI は、シンガポールが「世界人口の 0.07% を用いて G7 級の AI 治理発言権を得る」戦略において、最も重要な機関です。`,
        summaryEn:
          'National research institute for frontier AI safety, hosting the Singapore Consensus coordination function.',
        contentEn: `The Singapore AI Safety Institute (AISI) was established in 2024 with an annual budget of S$10M, jointly operated by IMDA and the Digital Trust Centre and hosted at NTU. It covers three core research areas on frontier AI models: red-team evaluation, alignment research, and traceability testing. AISI also serves as the coordination centre for the Singapore Consensus on Global AI Safety Research Priorities and hosts the International Scientific Exchange on AI Safety. In the official account, the Singapore Consensus came out of SCAI: ISE 2025, gathering 100+ participants from 11 countries into a living document; ISE 2026 continues to update the research priorities. It is not an intergovernmental agreement "signed by 11 countries." AISI is the most critical institution in Singapore's strategy of "leveraging 0.07% of the world's population into G7-level AI governance influence."`,
        sourceEn: 'IMDA / Digital Trust Centre',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'goals-of-smart-nation-20',
        title: '智慧国家2.0的目标',
        titleKo: '스마트 네이션 2.0의 목표',
        titleJa: 'スマート・ネーション 2.0 の目標',
        titleEn: 'Goals of Smart Nation 2.0',
        date: '2025-07',
        source: '智慧国家与数字政府办公室 (SNDGO)',
        sourceKo: '스마트 네이션 및 디지털 정부 사무소 (SNDGO)',
        sourceJa: 'スマート・ネーション・デジタル政府オフィス (SNDGO)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://www.smartnation.gov.sg/about/our-goals/goals-of-smart-nation/',
        summary:
          '新加坡智慧国家2.0战略旨在实现三个核心目标：信任、增长和社区。这些目标源于公民多年来通过调查、研究和反馈渠道提出的关键关切，反映了政府如何利用技术改善公民生活并为所有人创造繁荣数字未来的承诺。智慧国家2.0战略将随着数字发展的演进而不断迭代和调整。',
        summaryKo:
          '싱가포르 스마트 네이션 2.0 전략은 세 가지 핵심 목표를 달성하는 것을 목표로 합니다: 신뢰, 성장, 커뮤니티. 이러한 목표들은 시민들이 여러 해 동안 조사, 연구, 피드백 채널을 통해 제기한 핵심 관심사에서 비롯되었으며, 정부가 기술을 활용하여 시민의 삶을 개선하고 모든 사람을 위해 번영하는 디지털 미래를 만들겠다는 약속을 반영합니다. 스마트 네이션 2.0 전략은 디지털 발전의 진화에 따라 지속적으로 반복되고 조정될 것입니다.',
        summaryJa:
          'シンガポールのスマート・ネーション 2.0 戦略は、三つの核心的な目標を達成することを目指しています：信頼、成長、コミュニティ。これらの目標は、長年にわたり調査、研究、フィードバックチャネルを通じて市民から提出された重要な懸念に基づいています。これはテクノロジーを活用して市民の生活を改善し、すべての人のための繁栄したデジタル未来を創造するという政府の約束を反映しています。スマート・ネーション 2.0 戦略は、デジタル発展の進化に伴い継続的に反復され、調整されます。',
        content: `新加坡智慧国家2.0战略旨在实现三个核心目标：信任、增长和社区。这些目标源于公民多年来通过调查、研究和反馈渠道提出的关键关切，反映了政府如何利用技术改善公民生活并为所有人创造繁荣数字未来的承诺。智慧国家2.0战略将随着数字发展的演进而不断迭代和调整。`,
        contentKo: `싱가포르 스마트 네이션 2.0 전략은 세 가지 핵심 목표를 달성하는 것을 목표로 합니다: 신뢰, 성장, 커뮤니티. 이러한 목표들은 시민들이 여러 해 동안 조사, 연구, 피드백 채널을 통해 제기한 핵심 관심사에서 비롯되었으며, 정부가 기술을 활용하여 시민의 삶을 개선하고 모든 사람을 위해 번영하는 디지털 미래를 만들겠다는 약속을 반영합니다. 스마트 네이션 2.0 전략은 디지털 발전의 진화에 따라 지속적으로 반복되고 조정될 것입니다.`,
        contentJa: `シンガポールのスマート・ネーション 2.0 戦略は、三つの核心的な目標を達成することを目指しています：信頼、成長、コミュニティ。これらの目標は、長年にわたり調査、研究、フィードバックチャネルを通じて市民から提出された重要な懸念に基づいています。これはテクノロジーを活用して市民の生活を改善し、すべての人のための繁栄したデジタル未来を創造するという政府の約束を反映しています。スマート・ネーション 2.0 戦略は、デジタル発展の進化に伴い継続的に反復され、調整されます。`,
        summaryEn:
          "Singapore's Smart Nation 2.0 strategy aims to achieve three core goals: Trust, Growth, and Community. These goals, derived from citizen feedback gathered through surveys, research, and other channels over the years, reflect how technology will be used to improve citizens' lives and create a thriving digital future for all. The Smart Nation 2.0 strategies will be continually iterated and adjusted as digital developments evolve, with ongoing consultation with citizens and businesses.",
        contentEn: `Singapore's Smart Nation 2.0 strategy aims to achieve three core goals: Trust, Growth, and Community. These goals, derived from citizen feedback gathered through surveys, research, and other channels over the years, reflect how technology will be used to improve citizens' lives and create a thriving digital future for all. The Smart Nation 2.0 strategies will be continually iterated and adjusted as digital developments evolve, with ongoing consultation with citizens and businesses.`,
        sourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '治理框架',
    nameKo: '거버넌스 프레임워크',
    nameJa: 'ガバナンスフレームワーク',
    nameEn: 'AI Governance Frameworks',
    icon: '⚖️',
    policies: [
      {
        id: 'iso-iec-42119-8-generative-ai-testing-standard',
        title: 'ISO/IEC 42119-8 生成式 AI 测试标准（提案）',
        titleKo: 'ISO/IEC 42119-8 생성형 AI 테스팅 표준(제안)',
        titleJa: 'ISO/IEC 42119-8 生成 AI テスト標準（提案）',
        titleEn: 'ISO/IEC 42119-8 Generative AI Testing Standard (Proposal)',
        date: '2026-04',
        source: '资讯通信媒体发展局 (IMDA) / Enterprise Singapore',
        sourceKo: '정보통신매체발전청 (IMDA) / Enterprise Singapore',
        sourceJa: '情報通信メディア発展庁 (IMDA) / Enterprise Singapore',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/singapore-champions-new-global-ai-testing-standardisation-efforts',
        summary: '新加坡在第 17 届 ISO/IEC JTC 1/SC 42 全会提交的全球首个生成式 AI 测试国际标准草案。',
        summaryKo: '싱가포르가 제17회 ISO/IEC JTC 1/SC 42 전회에 제출한 글로벌 최초의 생성형 AI 테스팅 국제 표준 초안.',
        summaryJa:
          'シンガポールが第 17 回 ISO/IEC JTC 1/SC 42 全体会議で提出した、生成 AI テストに関する世界初の国際標準案。',
        content: `2026 年 4 月 20 日，第 17 届 ISO/IEC JTC 1/SC 42 全体会议在新加坡开幕（首次在东盟举办，由 IMDA 与 Enterprise Singapore 联合主办，35+ 国家、250+ 专家参与）。新加坡正式提交 **ISO/IEC 42119-8** 标准草案——如果通过，这将是全球首个针对生成式 AI 系统的国际测试标准。

**两个核心方向**：
- **基准测试（Benchmarking）**：用统一数据集衡量 AI 性能，解决"考什么、怎么评分"的可比性问题
- **红队测试（Red Teaming）**：模拟攻击找出系统漏洞，标准化"隐藏风险怎么找出来"

提案建立在 IMDA 已有的国内测试基础设施之上：AI Verify Toolkit、Starter Kit for Testing of LLM-Based Applications、Global AI Assurance Sandbox。樟宜机场 2025 年 2 月获得的全球首张 ISO/IEC 42001 AI 管理体系认证，则提供了"AI 治理可被外部审计"的可执行案例。

IMDA 现任 CEO **Ng Cher Pong**（2025-11 上任）在开幕致辞中说："标准的制定不能以龟速推进——否则将被 AI 高速变革所淘汰。"他同时强调标准应在行业、文化和语言层面具有代表性，东南亚作为全球文化最多元的地区之一必须接入标准制定。

国际 ISO 标准从提案到正式发布通常需要数年。但提案一旦提出，等于把全球后续讨论的框架定下来了——这正是新加坡"用 0.07% 全球人口撬动 G7 级 AI 治理话语权"的典型操作。`,
        contentKo: `2026년 4월 20일, 제17회 ISO/IEC JTC 1/SC 42 전체 회의가 싱가포르에서 개막했습니다(동남아시아 최초 개최, IMDA와 Enterprise Singapore가 공동 주최, 35개 이상의 국가, 250명 이상의 전문가 참여). 싱가포르는 공식적으로 **ISO/IEC 42119-8** 표준 초안을 제출했습니다—승인될 경우, 이는 생성형 AI 시스템을 위한 글로벌 최초의 국제 테스트 표준이 될 것입니다.

**두 가지 핵심 방향**:
- **벤치마킹**: 통일된 데이터 세트를 사용하여 AI 성능을 측정하고, 「무엇을 평가할 것인가, 어떻게 점수를 매길 것인가」의 비교 가능성 문제를 해결합니다.
- **레드팀 테스팅**: 모의 공격을 통해 시스템 취약점을 찾아내고, 「숨겨진 위험을 어떻게 찾아낼 것인가」를 표준화합니다.

제안은 IMDA가 이미 보유한 국내 테스팅 기반시설을 기반으로 합니다: AI Verify Toolkit, Starter Kit for Testing of LLM-Based Applications, Global AI Assurance Sandbox. 창이 공항이 2025년 2월에 획득한 글로벌 최초의 ISO/IEC 42001 AI 관리 체계 인증은 「AI 거버넌스를 외부 감사를 받을 수 있다」는 실행 가능한 사례를 제공합니다.

IMDA의 현임 CEO **Ng Cher Pong**(2025년 11월 취임)은 개막식 연설에서 「표준 제정은 거북이 속도로 진행될 수 없습니다. 그렇지 않으면 AI의 빠른 변화에 의해 폐기될 것입니다.」라고 말했습니다. 그는 또한 표준이 산업, 문화, 언어 차원에서 대표성을 갖춰야 하며, 전 지구적으로 가장 다양한 문화를 가진 지역 중 하나인 동남아시아가 표준 제정에 참여해야 한다고 강조했습니다.

국제 ISO 표준은 제안에서 공식 발표까지 보통 수 년이 걸립니다. 하지만 제안이 일단 제출되면, 이는 글로벌 후속 논의의 프레임워크를 정하는 것과 같습니다—이것이 바로 싱가포르가 「0.07% 글로벌 인구로 G7급 AI 거버넌스 발언권을 활용하는」 전형적인 동작입니다.`,
        contentJa: `2026年4月20日、第17回ISO/IEC JTC 1/SC 42会議がシンガポールで開幕しました（ASEAN地域での初開催、IMDAおよびEnterprise Singaporeが共同主催、35カ国以上、250人以上の専門家が参与）。シンガポールは正式にISO/IEC 42119-8標準草案を提出しました――承認された場合、これは生成型AIシステムを対象とした世界初の国際テスト標準となるでしょう。

2つの中核的方向：
- ベンチマーク測定（Benchmarking）：統一データセットを使用してAI性能を測定し、「何をテストするのか、どのようにスコアをつけるのか」という比較可能性の問題を解決する
- レッドチーム測定（Red Teaming）：攻撃をシミュレートしてシステムの脆弱性を特定し、「隠れたリスクをどのように見つけるのか」を標準化する

提案はIMDAがすでに備えている国内テスト基盤の上に構築されています：AI Verify Toolkit、Starter Kit for Testing of LLM-Based Applications、Global AI Assurance Sandbox。Changi Airport（チャンギ空港）が2025年2月に獲得したISO/IEC 42001 AI管理体系認証としての世界初の認証は、「AI治理は外部監査が可能である」という実行可能なケーススタディを提供しています。

IMDA現任CEO Ng Cher Pong（2025年11月就任）は開幕式での演説で述べました：「標準の制定は亀の歩みで進められてはいけません――そうしなければ、AIの高速な変革に淘汰されてしまいます。」彼は同時に、標準は業界、文化、言語レベルで代表性を持つべきであり、世界で最も文化的多様性に富んだ地域の一つである東南アジアが標準制定プロセスに組み込まれなければならないと強調しました。

国際的なISO標準は提案から正式発表まで通常数年を要します。しかし、提案が一度提出されると、その後の全球的な議論の枠組みを定めることと等しくなります――これこそがシンガポールが「世界人口の0.07%を用いてG7級のAI治理における発言権を活用する」という典型的な操作です。`,
        summaryEn:
          "Singapore's draft of the world's first international standard for testing generative AI systems, tabled at the 17th ISO/IEC JTC 1/SC 42 plenary.",
        contentEn: `On 20 April 2026, the 17th ISO/IEC JTC 1/SC 42 plenary opened in Singapore — the first time in ASEAN, co-organised by IMDA and Enterprise Singapore, with 35+ national bodies and 250+ AI experts participating. Singapore formally tabled **ISO/IEC 42119-8**, which, if adopted, will be the world's first international standard for testing generative AI systems.

**Two core pillars:**
- **Benchmarking** — using shared datasets to measure AI performance, solving the comparability problem of "what to test and how to score"
- **Red Teaming** — simulating attacks to surface hidden risks, standardising "how to find what's hidden"

The proposal builds on IMDA's domestic testing infrastructure: the AI Verify Toolkit, the Starter Kit for Testing of LLM-Based Applications, and the Global AI Assurance Sandbox. Changi Airport's February 2025 ISO/IEC 42001 AI Management System certification — the world's first for an airport — supplied a working precedent that AI governance can be externally audited.

IMDA CEO **Ng Cher Pong** (in post since November 2025), in his opening address, said: "Standards setting cannot move at a glacial pace" — or it risks being outpaced by AI itself. He also stressed that standards must be representative across sectors, cultures and languages, and that Southeast Asia — one of the world's most diverse regions — must be plugged into standards-making.

ISO standards typically take years from proposal to publication. But once a proposal is on the table, the framing for global discussion is set — which is precisely how Singapore translates 0.07% of the world's population into G7-tier AI governance influence.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA) / Enterprise Singapore',
        ministry: 'MDDI',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [5, 6],
        relatedTimelineYears: [2025, 2026],
        relatedPostSlugs: [],
      },
      {
        id: 'model-ai-governance-framework-for-agentic-ai',
        title: 'Agentic AI 治理框架',
        titleKo: 'Agentic AI 거버넌스 프레임워크',
        titleJa: 'Agentic AI ガバナンスフレームワーク',
        titleEn: 'Model AI Governance Framework for Agentic AI',
        date: '2026-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceKo: '정보통신매체발전청 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/updated-model-ai-governance-framework-for-agentic-ai',
        translatedPdfUrl: '/pdfs/agentic-ai-governance-zh.pdf',
        summary:
          'IMDA 于 2026 年 1 月在达沃斯发布全球首个 Agentic AI 治理框架，并在 2026 年 5 月加入 60+ 机构反馈与 10+ 真实部署案例。',
        summaryKo:
          'IMDA는 2026년 1월 다보스에서 세계 최초의 Agentic AI 거버넌스 프레임워크를 발표했고, 2026년 5월 60개 이상의 기관 피드백과 10개 이상의 실제 배포 사례를 추가했습니다.',
        summaryJa:
          'IMDA は 2026 年 1 月にダボスで世界初の Agentic AI ガバナンスフレームワークを発表し、2026 年 5 月に 60 以上の組織からのフィードバックと 10 以上の実導入事例を追加しました。',
        content: `IMDA 于 2026 年 1 月在世界经济论坛发布 Model AI Governance Framework for Agentic AI，2026 年 5 月 20 日在 ATxSummit 更新版本。

更新重点不是另起炉灶，而是把几个月内收集到的产业反馈和真实部署案例放回框架中。官方披露：更新版吸收了 **60+ 机构**反馈（包括 AWS、DBS、Google、Salesforce），并加入 **10+ 真实 agentic AI 部署案例**（包括 Ant International、CDL、Cyber Sierra、Dayos、GovTech、Google、OCBC、PwC、Tencent、Workday 等）。

框架继续强调：AI Agent 可以提高生产力，但人类仍对系统结果承担最终责任。新增案例让企业能看到如何处理多 agent 系统、第三方 agent、自动化偏差、风险分级、人类审批和审计等实际问题。`,
        contentKo: `IMDA는 2026년 1월 세계경제포럼에서 Model AI Governance Framework for Agentic AI를 발표했고, 2026년 5월 20일 ATxSummit에서 업데이트판을 공개했습니다.

업데이트의 핵심은 새 틀을 만드는 것이 아니라, 몇 달 동안 받은 산업 피드백과 실제 배포 사례를 프레임워크에 다시 반영하는 것입니다. 공식 자료에 따르면 업데이트판은 **60개 이상의 기관** 피드백(AWS, DBS, Google, Salesforce 등)을 반영했고, **10개 이상의 실제 agentic AI 배포 사례**(Ant International, CDL, Cyber Sierra, Dayos, GovTech, Google, OCBC, PwC, Tencent, Workday 등)를 포함합니다.

프레임워크는 AI Agent가 생산성을 높일 수 있지만, 시스템 결과에 대한 최종 책임은 여전히 인간에게 있다는 점을 강조합니다. 새 사례들은 기업이 다중 agent 시스템, 제3자 agent, 자동화 편향, 위험 등급, 인간 승인, 감사 같은 실제 문제를 어떻게 처리할지 보여줍니다.`,
        contentJa: `IMDA は 2026 年 1 月に世界経済フォーラムで Model AI Governance Framework for Agentic AI を発表し、2026 年 5 月 20 日に ATxSummit で更新版を公開しました。

更新の焦点は新しい枠組みを作ることではなく、数カ月間に集めた産業界のフィードバックと実導入事例をフレームワークへ戻すことです。公式発表によれば、更新版は **60 以上の組織**からのフィードバック（AWS、DBS、Google、Salesforce など）を取り入れ、**10 以上の実際の agentic AI 導入事例**（Ant International、CDL、Cyber Sierra、Dayos、GovTech、Google、OCBC、PwC、Tencent、Workday など）を追加しました。

フレームワークは、AI Agent が生産性を高め得る一方で、システム結果への最終責任は人間が負うという点を引き続き強調します。新しい事例により、企業はマルチ agent システム、第三者 agent、自動化バイアス、リスク階層、人間の承認、監査などの実務課題への対応を確認できます。`,
        summaryEn:
          'IMDA launched the world’s first Agentic AI governance framework at Davos in January 2026 and updated it in May 2026 with feedback from 60+ organisations and 10+ real-world deployment case studies.',
        contentEn: `IMDA launched the Model AI Governance Framework for Agentic AI at the World Economic Forum in January 2026, then updated it at ATxSummit on 20 May 2026.

The update is not a new framework from scratch. It folds industry feedback and live deployment experience back into the original framework. Officially, the update incorporates feedback from **60+ organisations** including AWS, DBS, Google, and Salesforce, and adds **10+ real-world agentic AI deployment case studies** from contributors such as Ant International, CDL, Cyber Sierra, Dayos, GovTech, Google, OCBC, PwC, Tencent, and Workday.

The framework continues to stress that AI agents can raise productivity, but humans remain ultimately accountable for system outcomes. The added cases show how organisations handle practical issues such as multi-agent systems, third-party agents, automation bias, risk tiering, human approvals, and auditability.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'google-singapore-ai-agents-sandbox-2026',
        title: '新加坡政府 × Google AI Agents Sandbox',
        titleKo: '싱가포르 정부 × Google AI Agents Sandbox',
        titleJa: 'シンガポール政府 × Google AI Agents Sandbox',
        titleEn: 'Singapore Government × Google AI Agents Sandbox',
        date: '2026-05',
        source: 'Google / CSA / GovTech / IMDA',
        sourceKo: 'Google / CSA / GovTech / IMDA',
        sourceJa: 'Google / CSA / GovTech / IMDA',
        sourceEn: 'Google / CSA / GovTech / IMDA',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/ai-agents-insights-from-the-singapore-government-and-google-sandbox',
        summary:
          'Google 与新加坡政府在 2025 年 8 月启动全球首个 AI Agents Sandbox，2026 年 5 月发布白皮书，验证 computer-use agents 在公共服务场景中的机会和风险。',
        summaryKo:
          'Google과 싱가포르 정부는 2025년 8월 세계 최초의 AI Agents Sandbox를 시작했고, 2026년 5월 백서를 발표해 공공 서비스 현장에서 computer-use agents의 기회와 위험을 검증했습니다.',
        summaryJa:
          'Google とシンガポール政府は 2025 年 8 月に世界初の AI Agents Sandbox を開始し、2026 年 5 月にホワイトペーパーを発表。公共サービスにおける computer-use agents の機会とリスクを検証しました。',
        summaryEn:
          'Google and the Singapore Government launched a global-first AI Agents Sandbox in August 2025 and published a May 2026 whitepaper on opportunities and risks of computer-use agents in public-service settings.',
        content: `Google 与新加坡政府（CSA、GovTech、IMDA）在 2025 年 8 月启动 AI Agents Sandbox，约四个月内测试 computer-use agents 在真实公共服务环境中的表现，并于 2026 年 5 月发布白皮书。

三个测试场景：
- 自动化政府数字服务 QA 测试。
- 自动化 AI 安全测试，降低 chatbot 上线前评估的人力成本。
- 协助公民 / 社工处理社会援助申请流程。

官方总结的风险主题包括：人类监督、定制化与控制、网络安全（尤其是间接提示注入）、数据保护与隐私。这个 sandbox 与同日更新的 Agentic AI Governance Framework 形成配套：一个是治理框架，一个是政府场景中的实测反馈。`,
        contentKo: `Google과 싱가포르 정부(CSA, GovTech, IMDA)는 2025년 8월 AI Agents Sandbox를 시작해 약 4개월 동안 실제 공공 서비스 환경에서 computer-use agents의 행동을 테스트했고, 2026년 5월 백서를 발표했습니다.

세 가지 테스트 사례:
- 정부 디지털 서비스의 자동 QA 테스트.
- chatbot 배포 전 평가 비용을 줄이는 자동 AI 안전 테스트.
- 시민 / 사회복지사가 사회 지원 신청 절차를 처리하도록 돕는 agent.

공식적으로 정리된 위험 주제는 인간 감독, 맞춤화와 통제, 사이버보안(특히 간접 prompt injection), 데이터 보호와 프라이버시입니다. 이 sandbox는 같은 날 업데이트된 Agentic AI Governance Framework와 짝을 이룹니다. 하나는 거버넌스 프레임워크이고, 하나는 정부 현장의 실제 테스트 피드백입니다.`,
        contentJa: `Google とシンガポール政府（CSA、GovTech、IMDA）は 2025 年 8 月に AI Agents Sandbox を開始し、約 4 カ月にわたり実際の公共サービス環境で computer-use agents の挙動をテストし、2026 年 5 月にホワイトペーパーを発表しました。

3 つのテスト場面：
- 政府デジタルサービスの自動 QA テスト。
- chatbot 導入前評価の負荷を下げる自動 AI 安全性テスト。
- 国民 / ソーシャルワーカーの社会支援申請プロセス支援。

公式に整理されたリスクテーマは、人間による監督、カスタマイズと制御、サイバーセキュリティ（特に間接 prompt injection）、データ保護とプライバシーです。この sandbox は同日更新された Agentic AI Governance Framework と対になります。一方が治理フレームワーク、もう一方が政府現場での実測フィードバックです。`,
        contentEn: `Google and the Singapore Government (CSA, GovTech, and IMDA) launched an AI Agents Sandbox in August 2025, testing computer-use agents in real public-service settings for about four months before publishing a whitepaper in May 2026.

Three use cases were tested:
- Automated QA testing for government digital services.
- Automated AI safety testing to reduce the manual effort needed before chatbot deployment.
- Assistance for citizens and social workers navigating social-assistance applications.

The official risk themes include human oversight, customisation and control, cybersecurity (especially indirect prompt injection), data protection, and privacy. The sandbox pairs with the updated Agentic AI Governance Framework announced the same day: one is the governance frame; the other is field feedback from government use cases.`,
        ministry: 'IMDA',
        authorPersonIds: ['josephine-teo'],
        relatedDebateIds: [],
        relatedLeverNumbers: [2, 5],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-24',
      },
      {
        id: 'ai-tester-accreditation-programme-2026',
        title: 'AI Tester Accreditation Programme (AI TAP)',
        titleKo: 'AI Tester Accreditation Programme (AI TAP)',
        titleJa: 'AI Tester Accreditation Programme (AI TAP)',
        titleEn: 'AI Tester Accreditation Programme (AI TAP)',
        date: '2026-05',
        source: 'AI Verify Foundation / IMDA',
        sourceKo: 'AI Verify Foundation / IMDA',
        sourceJa: 'AI Verify Foundation / IMDA',
        sourceEn: 'AI Verify Foundation / IMDA',
        sourceOrgUrl: 'https://aiverifyfoundation.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/tester-accreditation/',
        summary:
          'AI Verify Foundation 推出亚洲首个 AI 测试服务商认可计划，预计 2026 年第三季度开放申请，目标是建立可信 AI assurance 市场。',
        summaryKo:
          'AI Verify Foundation은 아시아 최초의 AI 테스트 서비스 업체 인정 프로그램을 추진하며, 2026년 3분기 신청을 열 예정입니다. 목표는 신뢰 가능한 AI assurance 시장을 구축하는 것입니다.',
        summaryJa:
          'AI Verify Foundation はアジア初の AI テストサービス事業者認定プログラムを開始予定。申請開始は 2026 年第 3 四半期見込みで、信頼できる AI assurance 市場の形成を狙います。',
        summaryEn:
          'AI Verify Foundation is launching Asia’s first accreditation programme for AI testing service firms, expected to open in Q3 2026, to build a trusted AI assurance market.',
        content: `AI Tester Accreditation Programme (AI TAP) 由 AI Verify Foundation 推出，面向提供生成式 AI 技术测试服务的公司。官方称这是亚洲首个同类计划，预计 2026 年第三季度开放申请。

AI TAP 认可的是“测试服务商”的能力，而不是给某个 AI 系统盖章。评估范围包括：具体测试服务的技术能力、公司资质与业务记录、财务可持续性、运营准备度、业务范围与实际能力一致性。

这个计划的战略意义在于把 AI Verify 从工具和框架推进到“市场基础设施”：企业不必只相信供应商自测，也可以采购被认可的第三方 AI assurance 服务。它直接补上新加坡治理路线中“原则 / 工具 / 沙盒”之后的认证与服务市场一环。`,
        contentKo: `AI Tester Accreditation Programme (AI TAP)은 AI Verify Foundation이 추진하며, 생성형 AI 기술 테스트 서비스를 제공하는 회사를 대상으로 합니다. 공식적으로 아시아 최초의 유사 프로그램이며, 2026년 3분기 신청을 열 예정입니다.

AI TAP은 특정 AI 시스템에 인증 마크를 주는 것이 아니라 “테스트 서비스 업체”의 역량을 인정합니다. 평가 범위에는 특정 테스트 서비스의 기술 능력, 회사의 적격성과 업무 이력, 재무 지속 가능성, 운영 준비도, 신고한 사업 범위와 실제 역량의 일치성이 포함됩니다.

전략적 의미는 AI Verify를 도구와 프레임워크에서 “시장 인프라”로 확장하는 데 있습니다. 기업은 공급사의 자체 테스트만 믿지 않고, 인정받은 제3자 AI assurance 서비스를 구매할 수 있습니다. 이는 싱가포르 거버넌스 경로에서 “원칙 / 도구 / sandbox” 이후의 인증과 서비스 시장 단계를 채웁니다.`,
        contentJa: `AI Tester Accreditation Programme (AI TAP) は AI Verify Foundation によるもので、生成 AI の技術テストサービスを提供する企業を対象にします。公式にはアジア初の同種プログラムで、2026 年第 3 四半期に申請開始予定です。

AI TAP が認定するのは特定の AI システムではなく、「テストサービス事業者」の能力です。評価範囲は、具体的なテストサービスの技術能力、会社としての適格性と実績、財務の持続可能性、運営準備度、申告した業務範囲と実能力の一致です。

戦略的意味は、AI Verify をツールとフレームワークから「市場インフラ」へ進めることにあります。企業はベンダーの自己テストだけに頼らず、認定された第三者 AI assurance サービスを調達できます。これはシンガポールの治理路線における「原則 / ツール / sandbox」の次に来る認定・サービス市場の一環です。`,
        contentEn: `The AI Tester Accreditation Programme (AI TAP) is run by AI Verify Foundation for companies offering technical testing services for generative-AI applications. The Foundation describes it as the first programme of its kind in Asia, with applications expected to open in Q3 2026.

AI TAP accredits the capability of testing service firms; it does not certify that a specific AI system is risk-free. Assessment covers technical competence in declared testing services, company standing and track record, financial sustainability, operational readiness, and whether declared business scope matches actual capability.

Strategically, this moves AI Verify from tools and frameworks into market infrastructure. Enterprises will not have to rely only on vendor self-testing; they can procure recognised third-party AI assurance services. It fills the accreditation and service-market layer after Singapore’s principles, tools, and sandboxes.`,
        ministry: 'IMDA',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [2, 6],
        relatedTimelineYears: [2026],
        relatedPostSlugs: [],
        addedAt: '2026-05-24',
      },
      {
        id: 'proposed-model-ai-governance-framework-for-generative-ai',
        title: '生成式 AI 治理框架',
        titleKo: '생성형 AI 거버넌스 프레임워크',
        titleJa: '生成 AI ガバナンスフレームワーク',
        titleEn: 'Proposed Model AI Governance Framework for Generative AI',
        date: '2024-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceKo: '정보통신매체발전청 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl:
          'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/gen-ai-and-digital-foss-ai-governance-playbook',
        translatedPdfUrl: '/pdfs/genai-governance-zh.pdf',
        summary: '专门针对生成式 AI 的治理框架提案，应对大模型带来的新挑战。',
        summaryKo: '생성형 AI에 특화된 거버넌스 프레임워크 제안으로 대규모 모델이 가져오는 새로운 과제에 대응합니다.',
        summaryJa:
          '生成 AI に特化したガバナンスフレームワークの提案。大規模言語モデルがもたらす新たな課題に対応します。',
        content: `全球较早的专门针对生成式 AI 的治理框架提案。九大维度：问责制、数据治理、可信开发与部署、事件报告、测试与保证、安全、内容来源、使用者素养、辅助措施。采用多利益相关方方法，强调"沙盒式"治理。`,
        contentKo: `생성형 AI에 특화된 글로벌 최초의 거버넌스 프레임워크 제안입니다. 9가지 차원: 문책성, 데이터 거버넌스, 신뢰할 수 있는 개발 및 배포, 사건 보고, 테스트 및 보장, 보안, 콘텐츠 출처, 사용자 소양, 보충 조치. 다중 이해관계자 접근 방식을 채택하여 「샌드박스식」 거버넌스를 강조합니다.`,
        contentJa: `生成型 AI を対象とした治理フレームワーク提案としては世界的に初期段階のものです。9 つの側面：説明責任、データガバナンス、信頼性の高い開発と展開、インシデント報告、テストと保証、セキュリティ、コンテンツソース、利用者リテラシー、支援措置。マルチステークホルダーアプローチを採用し、「サンドボックス型」ガバナンスを強調しています。`,
        summaryEn:
          'Dedicated governance framework proposal for generative AI, addressing the new challenges posed by large models.',
        contentEn: `One of the world's earliest dedicated governance frameworks proposed for generative AI. Nine dimensions: accountability, data governance, trusted development and deployment, incident reporting, testing and assurance, security, content provenance, user literacy, and supporting measures. The framework takes a multi-stakeholder approach and leans on sandbox-style governance.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'ai-verify',
        title: 'AI Verify 测试框架',
        titleKo: 'AI Verify 테스팅 프레임워크',
        titleJa: 'AI Verify テストフレームワーク',
        titleEn: 'AI Verify',
        date: '2022-05',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceKo: '정보통신매체발전청 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl: 'https://aiverifyfoundation.sg/',
        translatedPdfUrl: '/pdfs/ai-verify-zh.pdf',
        summary: '全球首个 AI 治理测试框架和工具包，支持企业自测 AI 系统合规性。',
        summaryKo:
          '글로벌 최초의 AI 거버넌스 테스팅 프레임워크 및 툴킷으로 기업이 AI 시스템의 규정 준수 여부를 자체 테스트할 수 있도록 지원합니다.',
        summaryJa:
          'AI ガバナンステストフレームワークとツールキットの世界初。企業が AI システムのコンプライアンスを自己テストすることをサポートします。',
        content: `全球首个 AI 治理测试框架与工具包。11 项可测试指标，开源工具包，与国际标准对齐。2023 年成立 AI Verify Foundation 推动全球协作。将 AI 治理从"原则"推向"可操作"。`,
        contentKo: `글로벌 최초의 AI 거버넌스 테스팅 프레임워크 및 툴킷입니다. 11가지 테스트 가능 지표, 오픈소스 툴킷, 국제 표준과의 정렬. 2023년 AI Verify Foundation 설립으로 글로벌 협력 추진. AI 거버넌스를 「원칙」에서 「실행 가능성」으로 전환합니다.`,
        contentJa: `世界初の AI ガバナンステストフレームワークとツールキットです。11 項目のテスト可能な指標、オープンソースツールキット、国際基準とのアライメント。2023 年に AI Verify Foundation を設立し、グローバルな協力を推進しています。AI ガバナンスを「原則」から「実行可能」へと進めています。`,
        summaryEn:
          "The world's first AI governance testing framework and toolkit, enabling enterprises to self-assess AI system compliance.",
        contentEn: `The world's first AI governance testing framework and toolkit. Eleven testable indicators, an open-source toolkit, and alignment with international standards. The AI Verify Foundation was established in 2023 to drive global collaboration. The framework moves AI governance from "principles" to "operational practice."`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'model-ai-governance-framework',
        title: 'AI 治理模型框架',
        titleKo: 'AI 거버넌스 모델 프레임워크',
        titleJa: 'AI ガバナンスモデルフレームワーク',
        titleEn: 'Model AI Governance Framework',
        date: '2019-01',
        source: '资讯通信媒体发展局 (IMDA)',
        sourceKo: '정보통신미디어발전국 (IMDA)',
        sourceJa: '情報通信メディア発展庁 (IMDA)',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl: 'https://www.pdpc.gov.sg/help-and-resources/2020/01/model-ai-governance-framework',
        pdfUrl:
          'https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/resource-for-organisation/ai/sgmodelaigovframework2.pdf',
        translatedPdfUrl: '/pdfs/ai-governance-model-zh.pdf',
        summary: '亚洲首个 AI 治理框架，提出可解释、透明、以人为本的 AI 治理原则。',
        summaryKo:
          '아시아 최초의 AI 거버넌스 프레임워크로, 해석 가능성, 투명성, 인간 중심의 AI 거버넌스 원칙을 제시합니다.',
        summaryJa:
          'アジア初の AI ガバナンスフレームワーク。解釈可能性、透明性、人間中心の AI ガバナンス原則を提唱しています。',
        content: `2019 年在达沃斯发布，亚洲首个 AI 治理框架。四大核心原则：内部治理结构与措施、决策中的人类参与、运营管理、利益相关方互动与沟通。被 OECD 引用为最佳实践。`,
        contentKo: `2019년 다보스에서 발표, 아시아 최초의 AI 거버넌스 프레임워크입니다. 네 가지 핵심 원칙: 내부 거버넌스 구조 및 조치, 의사결정의 인간 참여, 운영 관리, 이해관계자 상호작용 및 소통. OECD에서 최고의 실천으로 인용되었습니다.`,
        contentJa: `2019 年にダボスで発表された、アジア初の AI ガバナンスフレームワークです。4 つの核心原則：内部ガバナンス構造と措置、意思決定における人的参加、運営管理、ステークホルダーの相互作用とコミュニケーション。OECD によってベストプラクティスとして引用されています。`,
        summaryEn:
          "Asia's first AI governance framework, articulating principles of explainability, transparency, and human-centric AI governance.",
        contentEn: `Released at Davos in 2019, this is Asia's first AI governance framework. Four core principles: internal governance structures, human involvement in AI-augmented decisions, operations management, and stakeholder communication. The OECD has cited it as a best practice.`,
        sourceEn: 'Infocomm Media Development Authority (IMDA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'personal-data-protection-act-pdpa',
        title: '个人数据保护法',
        titleKo: '개인데이터보호법',
        titleJa: '個人データ保護法',
        titleEn: 'Personal Data Protection Act (PDPA)',
        date: '2012',
        source: '个人数据保护委员会 (PDPC)',
        sourceKo: '개인데이터보호위원회 (PDPC)',
        sourceJa: '個人データ保護委員会 (PDPC)',
        sourceOrgUrl: 'https://www.pdpc.gov.sg/',
        sourceUrl: 'https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act',
        translatedPdfUrl: '/pdfs/pdpa-zh.pdf',
        summary: '新加坡核心数据保护法律，2020 年修订加入 AI 相关条款。',
        summaryKo: '싱가포르 핵심 데이터 보호 법률로, 2020년 수정 시 AI 관련 조항이 추가되었습니다.',
        summaryJa: 'シンガポールの中心的なデータ保護法。2020 年の改正では AI 関連条項が追加されました。',
        content: `核心数据保护法律，2012 年通过，2020 年重大修订。引入合法利益例外（Business Improvement Exception）、数据可携带权、加强执法力度。为 AI 数据使用划定法律边界。`,
        contentKo: `핵심 데이터 보호 법률로, 2012년에 통과하고 2020년에 중대 개정되었습니다. 정당한 이익 예외(Business Improvement Exception), 데이터 이동권, 집행력 강화가 도입되었으며, AI 데이터 사용에 대한 법적 경계를 설정합니다.`,
        contentJa: `核心的なデータ保護法で、2012 年に可決、2020 年に重大改正されました。合法的利益例外（Business Improvement Exception）、データポータビリティ権、執行力の強化を導入しました。AI データ使用に対して法的な境界を設定しています。`,
        summaryEn: "Singapore's core data protection law, with AI-relevant provisions added in the 2020 amendments.",
        contentEn: `Singapore's core data protection law, enacted in 2012 and significantly amended in 2020. The amendments added a Business Improvement Exception, data portability rights, and stronger enforcement powers — setting the legal perimeter for AI data use.`,
        sourceEn: 'Personal Data Protection Commission (PDPC)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'project-mindforge-genai-risk-framework-for-financial-sector',
        title: 'MAS Project MindForge',
        titleKo: 'Project MindForge — 금융권 GenAI 위험 프레임워크',
        titleJa: 'Project MindForge — 金融セクター向け GenAI リスクフレームワーク',
        titleEn: 'Project MindForge — GenAI Risk Framework for Financial Sector',
        date: '2024-06',
        source: '新加坡金融管理局 (MAS)',
        sourceKo: '싱가포르금융관리청 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/news/media-releases/2024/project-mindforge',
        summary: 'GenAI 在金融业的风险框架，24 家机构 + 四大云厂商（Microsoft / AWS / Google / NVIDIA）共建。',
        summaryKo:
          '금융업의 GenAI 위험 프레임워크로, 24개 기관 + 4대 클라우드 기업(Microsoft / AWS / Google / NVIDIA)이 함께 구축했습니다.',
        summaryJa:
          'GenAI の金融業界向けリスクフレームワーク。24 の機関とメジャー 4 クラウドプロバイダー（Microsoft / AWS / Google / NVIDIA）が共同構築。',
        content: `Project MindForge 是 MAS 主导的金融业 GenAI 风险框架，于 2024 年启动。Consortium 成员包括 24 家金融机构（DBS、UOB、OCBC、HSBC、JPMorgan 等）+ 四大云与 AI 厂商（Microsoft、AWS、Google、NVIDIA）+ 监管机构。框架围绕七大风险维度：模型幻觉、数据泄露、偏差与公平、供应链依赖、可解释性、对抗性攻击、责任分配。MindForge 的特殊之处在于让监管机构、被监管金融机构、技术供应商三方在同一桌上协调——这是新加坡 AI 治理"训练宽松 + 输出严管"哲学在金融业的具体落地，也是 FEAT → Veritas → MindForge → BuildFin.ai 五层堆栈中第三层。`,
        contentKo: `Project MindForge는 MAS가 주도하는 금융업 GenAI 위험 프레임워크로, 2024년에 출범했습니다. 컨소시엄 회원은 24개 금융기관(DBS, UOB, OCBC, HSBC, JPMorgan 등) + 주요 클라우드 및 AI 기업(Microsoft, AWS, Google, NVIDIA) + 규제 기관으로 구성됩니다. 프레임워크는 7가지 위험 차원을 중심으로 합니다: 모델 환각, 데이터 유출, 편향과 공정성, 공급망 의존성, 해석 가능성, 적대적 공격, 책임 배분. MindForge의 특별한 점은 규제 기관, 규제 대상 금융기관, 기술 공급업체 세 주체가 같은 테이블에서 조율된다는 것입니다——이것은 싱가포르 AI 거버넌스 「훈련 완화 + 산출물 엄격 관리」 철학이 금융업에 구체적으로 구현된 것이며, FEAT → Veritas → MindForge → BuildFin.ai 5층 스택의 세 번째 층입니다.`,
        contentJa: `Project MindForge は MAS が主導する金融業界向けの GenAI リスク管理フレームワークで、2024 年に開始されました。コンソーシアムのメンバーには 24 の金融機関（DBS、UOB、OCBC、HSBC、JPMorgan など）+ 4 大クラウド・AI ベンダー（Microsoft、AWS、Google、NVIDIA）+ 規制当局が含まれています。フレームワークは 7 つのリスク側面を中心としています：モデルの幻覚、データ漏洩、バイアスと公平性、サプライチェーンへの依存、説明可能性、敵対的攻撃、責任分配。MindForge の特徴は、規制当局、規制対象の金融機関、技術ベンダーの 3 者が同じテーブルで調整を図ることです——これは、シンガポール AI ガバナンスの「トレーニング緩和 + 出力厳格管理」哲学が金融業界に具体的に落ちた形であり、また FEAT → Veritas → MindForge → BuildFin.ai 5 層スタックの第 3 層でもあります。`,
        summaryEn:
          'GenAI risk framework for the financial sector, co-developed by 24 institutions and four major cloud/AI providers (Microsoft / AWS / Google / NVIDIA).',
        contentEn: `Project MindForge is a MAS-led GenAI risk framework for the financial sector, launched in 2024. Consortium members include 24 financial institutions (DBS, UOB, OCBC, HSBC, JPMorgan, and others), the four major cloud and AI providers (Microsoft, AWS, Google, NVIDIA), and the regulator. The framework covers seven risk areas: model hallucination, data leakage, bias and fairness, supply-chain dependency, explainability, adversarial attacks, and accountability. What's unusual is putting regulators, regulated banks, and tech providers around one table — the financial-sector version of Singapore's "permissive training, strict output" stance, and the third layer in the FEAT → Veritas → MindForge → BuildFin.ai stack.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'ai-risk-management-guidelines-for-banks',
        title: 'MAS AI Risk Management Guidelines',
        titleKo: 'MAS AI 위험 관리 지침',
        titleJa: 'MAS AI リスク管理ガイドライン',
        titleEn: 'AI Risk Management Guidelines for Banks',
        date: '2024-12',
        source: '新加坡金融管理局 (MAS)',
        sourceKo: '싱가포르금융관리청 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/regulation/notices/notice-fsm-n29',
        summary: '金融业 AI 模型风险管理的监管期望书，正式约束银行使用 AI。',
        summaryKo: '금융업 AI 모델 위험 관리에 대한 규제 기대 문서로, 은행의 AI 사용을 정식으로 제약합니다.',
        summaryJa: '金融業の AI モデルリスク管理に関する監督期待書。銀行の AI 使用を正式に拘束します。',
        content: `MAS 于 2024 年 12 月发布 AI Risk Management Guidelines，把 FEAT / Veritas / MindForge 多年累积的实践经验固化为正式监管期望书。覆盖：模型治理（数据、训练、验证、上线）、第三方 AI 风险（云厂商、模型供应商、API）、模型监控（漂移、偏差、性能）、人在回路、事件应对与责任。配套 BuildFin.ai 平台让被监管机构能持续测试和报告。这是全球首批专门针对银行业 AI 的监管文件，比欧盟 AI Act 金融条款落地更快。`,
        contentKo: `MAS는 2024년 12월 AI Risk Management Guidelines를 발표했으며, FEAT / Veritas / MindForge 다년간 축적된 실무 경험을 정식 규제 기대 문서로 확립했습니다. 모델 거버넌스(데이터, 훈련, 검증, 배포), 제3자 AI 위험(클라우드 기업, 모델 공급업체, API), 모델 모니터링(드리프트, 편향, 성능), 휴먼 인더 루프, 사건 대응 및 책임을 포함합니다. BuildFin.ai 플랫폼과 함께 규제 대상 기관이 지속적으로 테스트하고 보고할 수 있습니다. 이것은 은행업 AI를 위한 첫 번째 전문 규제 문서로, 유럽연합 AI Act 금융 조항보다 더 빠르게 시행되었습니다.`,
        contentJa: `MAS は 2024 年 12 月に AI Risk Management Guidelines を発表し、FEAT / Veritas / MindForge が長年にわたって蓄積した実践経験を正式な規制期待書に固定化しました。対象は：モデルガバナンス（データ、トレーニング、検証、本番化）、第三者 AI リスク（クラウドベンダー、モデルサプライヤー、API）、モデル監視（ドリフト、バイアス、パフォーマンス）、ヒューマン・イン・ザ・ループ、インシデント対応と責任。附属の BuildFin.ai プラットフォームにより、規制対象機関は継続的にテストとレポートが可能になります。これは銀行業向け AI に関する世界初の専門的な規制文書で、EU AI Act の金融条項よりも実装が迅速です。`,
        summaryEn:
          'Supervisory expectations document for AI model risk management in the financial sector, formally constraining how banks use AI.',
        contentEn: `MAS released the AI Risk Management Guidelines in December 2024, codifying years of practical experience from FEAT, Veritas, and MindForge into formal supervisory expectations. Coverage includes: model governance (data, training, validation, deployment), third-party AI risk (cloud providers, model vendors, APIs), model monitoring (drift, bias, performance), human-in-the-loop, and incident response and accountability. The accompanying BuildFin.ai platform enables regulated institutions to test and report on a continuous basis. These are among the world's first dedicated supervisory documents for AI in banking, landing ahead of the EU AI Act's financial provisions.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '行业监管',
    nameKo: '산업 규제',
    nameJa: '産業規制',
    nameEn: 'Sector Regulation',
    icon: '🏢',
    policies: [
      {
        id: 'ai-in-healthcare-guidelines-aihgle',
        title: '医疗 AI 联合指南 (AIHGle)',
        titleKo: '의료 AI 공동 지침(AIHGle)',
        titleJa: '医療 AI 共同ガイドライン (AIHGle)',
        titleEn: 'Artificial Intelligence in Healthcare Guidelines (AIHGle)',
        date: '2021-10',
        source: '卫生部 (MOH) / 卫生科学局 (HSA) / 国家医疗科技局 (Synapxe)',
        sourceKo: '보건부(MOH) / 보건과학청(HSA) / Synapxe',
        sourceJa: '保健省 (MOH) / 衛生科学庁 (HSA) / 国家医療技術局 (Synapxe)',
        sourceOrgUrl: 'https://www.moh.gov.sg/',
        sourceUrl: 'https://www.moh.gov.sg/licensing-and-regulation/artificial-intelligence-in-healthcare',
        summary: '面向医院、医生与 AI 开发者的医疗 AI 安全使用与良好实践指南。',
        summaryKo: '병원, 의사, AI 개발자를 대상으로 하는 의료 AI 안전 사용 및 모범 사례 지침입니다.',
        summaryJa: '病院、医師、AI 開発者向けの医療 AI の安全な使用とベストプラクティスガイドライン。',
        content: `Artificial Intelligence in Healthcare Guidelines (AIHGle) 于 2021 年 10 月由卫生部 (MOH)、卫生科学局 (HSA) 与当时的 Integrated Health Information Systems (IHiS，2023 年改组为 Synapxe) 联合发布，是新加坡医疗 AI 的核心非约束性指南。两个目标：一是支持安全有效的医疗 AI 部署，二是补充 HSA 对 AI-Medical Devices (AI-MD) 的硬性监管要求。覆盖 AI 开发者与医疗机构两侧的全生命周期：开发阶段的临床有效性证据要求、部署阶段的临床工作流融入与人在回路、上线后的持续监控与不良事件报告、患者沟通与知情同意。AIHGle 与 HSA 基于 Health Products Act 的医疗器械注册要求形成"软指南 + 硬法"双层结构，是 ACE-AI、Synapxe AI 平台等国家级医疗 AI 项目的合规底座。`,
        contentKo: `Artificial Intelligence in Healthcare Guidelines (AIHGle)은 2021년 10월 보건부(MOH), 보건과학청(HSA) 및 당시의 Integrated Health Information Systems(IHiS, 2023년 Synapxe로 개편)에 의해 공동 발표되었으며, 싱가포르 의료 AI의 핵심 비구속 지침입니다. 두 가지 목표가 있습니다: 첫째는 안전하고 효과적인 의료 AI 배포를 지원하는 것이고, 둘째는 HSA의 AI-Medical Devices(AI-MD)에 대한 강제적 규제 요구 사항을 보충하는 것입니다. AI 개발자와 의료 기관 양측의 전체 생명 주기를 포함합니다: 개발 단계의 임상 유효성 증거 요구 사항, 배포 단계의 임상 워크플로우 통합 및 휴먼 인더 루프, 출시 후의 지속적인 모니터링 및 유해 사건 보고, 환자 커뮤니케이션 및 정보 동의. AIHGle과 HSA는 Health Products Act에 기반한 의료 기기 등록 요구 사항을 통해 「소프트 지침 + 하드 법」 이중 구조를 형성하며, ACE-AI, Synapxe AI 플랫폼 등 국가 수준의 의료 AI 프로젝트를 위한 컴플라이언스 기반입니다.`,
        contentJa: `Artificial Intelligence in Healthcare Guidelines (AIHGle) は 2021 年 10 月に保健省 (MOH)、保健科学庁 (HSA)、および当時の Integrated Health Information Systems (IHiS、2023 年に Synapxe に改組) により共同発表された、シンガポール医療 AI の中核的な非拘束的ガイドラインです。2 つの目標があります。1 つは、安全で効果的な医療 AI の展開をサポートすることであり、もう 1 つは AI-Medical Devices (AI-MD) に関する HSA の強制的な規制要件を補完することです。AI 開発者と医療機構の両側にわたるライフサイクル全体をカバーしています。開発段階での臨床有効性エビデンス要件、展開段階での臨床ワークフロー統合と人間のループ、上線後の継続的な監視と有害事象報告、患者とのコミュニケーションとインフォームドコンセントです。AIHGle と HSA は Health Products Act の医療機器登録要件に基づいて「ソフトガイドライン + ハードロー」二層構造を形成しており、ACE-AI、Synapxe AI プラットフォームなどの国家的医療 AI プロジェクトのコンプライアンス基礎となっています。`,
        summaryEn:
          'Joint guidelines on the safe use and good practice of AI in healthcare for hospitals, clinicians, and AI developers.',
        contentEn: `The Artificial Intelligence in Healthcare Guidelines (AIHGle) were jointly released in October 2021 by the Ministry of Health (MOH), the Health Sciences Authority (HSA), and the then Integrated Health Information Systems (IHiS, reorganised as Synapxe in 2023). They are Singapore's core non-binding guidance on healthcare AI. Two objectives: support the safe and effective deployment of AI in healthcare, and complement HSA's binding regulation of AI-Medical Devices (AI-MD). The guidelines cover the full lifecycle on both the developer and healthcare-institution sides: evidence of clinical validity at the development stage, integration into clinical workflows and human-in-the-loop at deployment, post-market monitoring and adverse event reporting, and patient communication and informed consent. Together with HSA's medical-device registration requirements under the Health Products Act, AIHGle creates a "soft guidance + hard law" two-layer structure — the compliance baseline beneath national healthcare-AI initiatives like ACE-AI and Synapxe's AI platforms.`,
        sourceEn: 'Ministry of Health (MOH) / Health Sciences Authority (HSA) / Synapxe',
        ministry: 'MOH',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'health-products-act-ai-medical-devices',
        title: 'Health Products Act — AI 医疗器械注册',
        titleKo: 'Health Products Act — AI 의료 기기 등록',
        titleJa: 'Health Products Act — AI 医療機器登録',
        titleEn: 'Health Products Act — AI-Medical Device (AI-MD) Regulation',
        date: '2007',
        source: '卫生科学局 (HSA)',
        sourceKo: '보건과학청(HSA)',
        sourceJa: '衛生科学庁 (HSA)',
        sourceOrgUrl: 'https://www.hsa.gov.sg/',
        sourceUrl: 'https://www.hsa.gov.sg/medical-devices/regulatory-overview',
        summary: '含 AI 的医疗器械须在 HSA 注册——硬法层面的医疗 AI 准入门槛。',
        summaryKo: 'AI가 포함된 의료 기기는 HSA에 등록해야 합니다——강제법 수준의 의료 AI 접근 기준입니다.',
        summaryJa: 'AI を含む医療機器は HSA に登録する必要があります。法律レベルでの医療 AI 参入障壁。',
        content: `Health Products Act 2007 是新加坡医疗器械的核心法律，由卫生科学局 (HSA) 执行。含 AI 组件的医疗设备（AI-Medical Device, AI-MD）——无论是独立软件 (Software as a Medical Device, SaMD) 还是嵌入设备的算法——必须按风险等级在 HSA 注册后方可在新加坡上市或临床使用。配套监管文件：Regulatory Guidelines for Software Medical Devices（2022 修订）专章覆盖 AI-MD 的训练数据质量、模型变更管理 (Change Control Plan)、持续学习系统 (Continuous Learning) 的特殊要求、临床证据等级、网络安全和数据保护。AI-MD 还须遵循 Good Machine Learning Practice (GMLP) 原则，与 FDA 和 Health Canada 的多边协调框架一致。这一条是 W&C tracker 单列的两条 AI 相关存量立法之一——它说明新加坡"没有专门 AI 法"的真实含义：用既有行业法的现代化修订把 AI 纳入硬法监管，而不是另立一部横切法。`,
        contentKo: `Health Products Act 2007은 싱가포르 의료 기기의 핵심 법률로, 보건과학청(HSA)이 집행합니다. AI 구성 요소가 포함된 의료 기기(AI-Medical Device, AI-MD)—독립형 소프트웨어(Software as a Medical Device, SaMD)이든 기기에 내장된 알고리즘이든—은 위험 등급에 따라 HSA에 등록한 후에야 싱가포르에서 시판되거나 임상 사용될 수 있습니다. 관련 규제 문서: Regulatory Guidelines for Software Medical Devices(2022년 개정)는 AI-MD의 훈련 데이터 품질, 모델 변경 관리(Change Control Plan), 지속적 학습 시스템(Continuous Learning)의 특수 요구 사항, 임상 증거 수준, 사이버 보안 및 데이터 보호를 다룹니다. AI-MD는 또한 Good Machine Learning Practice(GMLP) 원칙을 준수해야 하며, FDA 및 Health Canada와의 다자 조율 프레임워크와 일치합니다. 이 항목은 W&C 추적기에서 별도로 나열된 AI 관련 기존 입법 두 조항 중 하나입니다——이는 싱가포르 「전문 AI 법이 없다」는 실제 의미를 설명합니다: 기존 산업법의 현대화 개정을 통해 AI를 강제 규제에 포함시키되, 별도의 횡적 법률을 제정하지 않는다는 의미입니다.`,
        contentJa: `Health Products Act 2007 はシンガポール医療機器の中核法律であり、保健科学庁 (HSA) により執行されています。AI コンポーネントを含む医療機器 (AI-Medical Device, AI-MD)——独立したソフトウェア (Software as a Medical Device, SaMD) であろうと、デバイスに組み込まれたアルゴリズムであろうと——は、リスクレベルに応じて HSA に登録した後でなければシンガポールで上市または臨床使用はできません。付属する規制文書：Regulatory Guidelines for Software Medical Devices (2022 改正版) は AI-MD の訓練データ品質、モデル変更管理 (Change Control Plan)、継続的学習システム (Continuous Learning) の特別要件、臨床エビデンスレベル、サイバーセキュリティおよびデータ保護をカバーしています。AI-MD はまた Good Machine Learning Practice (GMLP) 原則に従う必要があり、FDA および Health Canada の多国間協調枠組みと一致しています。この条項は W&C tracker により単独でリストアップされた 2 つの AI 関連既存法のうち 1 つです——それはシンガポール「専門 AI 法がない」の真実の意味を説明しています。既存の産業法の現代化改正により AI を硬法規制に含める方法であり、別個の横断法を制定することではありません。`,
        summaryEn:
          'AI-containing medical devices must be registered with HSA — the hard-law gate for healthcare AI market access.',
        contentEn: `The Health Products Act 2007 is Singapore's core law for medical devices, administered by the Health Sciences Authority (HSA). Medical devices containing AI components (AI-Medical Devices, AI-MD) — whether standalone Software as a Medical Device (SaMD) or algorithms embedded in hardware — must be registered with HSA according to risk class before they can be marketed or used clinically in Singapore. Supporting regulation includes the Regulatory Guidelines for Software Medical Devices (revised 2022), which contains a dedicated section on AI-MD covering training data quality, change-control plans for model updates, the special requirements for continuous-learning systems, levels of clinical evidence, cybersecurity, and data protection. AI-MDs are also expected to follow Good Machine Learning Practice (GMLP) principles, aligned with the multilateral framework agreed with the US FDA and Health Canada. This is one of the two pieces of pre-existing legislation that the W&C tracker singles out as AI-relevant — a concrete illustration of what "Singapore has no dedicated AI law" actually means: AI is brought into hard-law regulation through modernised sector statutes, not through a horizontal AI act.`,
        sourceEn: 'Health Sciences Authority (HSA)',
        ministry: 'MOH',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'road-traffic-act-autonomous-vehicles',
        title: 'Road Traffic Act — 自动驾驶授权',
        titleKo: 'Road Traffic Act — 자동 운전 권한',
        titleJa: 'Road Traffic Act — 自動運転の許可',
        titleEn: 'Road Traffic Act — Autonomous Vehicle Trials and Use',
        date: '2017-03',
        source: '陆路交通管理局 (LTA) / 交通部 (MOT)',
        sourceKo: '육로교통관리청(LTA) / 교통부(MOT)',
        sourceJa: '陸路交通管理庁 (LTA) / 交通部 (MOT)',
        sourceOrgUrl: 'https://www.lta.gov.sg/',
        sourceUrl: 'https://sso.agc.gov.sg/Act/RTA1961?ProvIds=P1A6C-#pr6C-',
        summary: '2017 修订引入第 6C 节，授权 LTA 监管自动驾驶车辆测试与使用。',
        summaryKo: '2017년 개정은 제6C절을 도입하여 LTA에 자동 운전 차량 테스트 및 사용 감시 권한을 부여합니다.',
        summaryJa: '2017 年の改正で第 6C 条を導入。自動運転車の試験と使用を監視する LTA の権限を付与します。',
        content: `Road Traffic Act 1961 通过 2017 年的 Road Traffic (Amendment) Act 增设第 6C 节（Trials and use of autonomous motor vehicles），把自动驾驶 (AV) 写入硬法。核心条款：陆路交通管理局 (LTA) 获授权制定细则、签发 AV 测试与运营许可、设定保险与安全要求、在划定区域 (designated area) 进行豁免。配套是 2017 年颁布的 Road Traffic (Autonomous Motor Vehicles) Rules，覆盖：测试申请与审批、安全员要求、数据记录与事件报告（黑匣子）、与 LTA 的持续报告义务、最低保险额度。新加坡同步建立了 CETRAN (Centre of Excellence for Testing and Research of AVs) 测试中心和 one-north 自动驾驶试验区，把法律授权落到物理基础设施。这条与 Health Products Act 共同构成 W&C tracker 单列的"用既有行业法管 AI"的两个核心样本——也是 NAIS 1.0 五大重点领域之一"智能交通与物流"的法律基座。`,
        contentKo: `Road Traffic Act 1961은 2017년 Road Traffic (Amendment) Act를 통해 제6C절(자율 모터 차량의 시험 및 사용)을 추가하여 자동 운전(AV)을 강제법에 포함시켰습니다. 핵심 조항: 육로교통관리청(LTA)은 세부 규정을 수립하고, AV 테스트 및 운영 허가를 발급하며, 보험 및 안전 요구 사항을 설정하고, 지정된 지역(designated area)에서 면제를 시행할 권한을 부여받습니다. 동반되는 문서는 2017년에 발표된 Road Traffic (Autonomous Motor Vehicles) Rules로, 다음을 포함합니다: 테스트 신청 및 승인, 안전 운전자 요구 사항, 데이터 기록 및 사건 보고(블랙박스), LTA와의 지속적인 보고 의무, 최소 보험 금액. 싱가포르는 동시에 CETRAN(자동 운전 차량 테스트 및 연구 우수 센터) 테스트 센터와 one-north 자동 운전 시험 지역을 설립하여 법적 권한을 물리적 기반 시설에 구현했습니다. 이 조항은 Health Products Act와 함께 W&C 추적기에서 별도로 나열된 「기존 산업법을 사용하여 AI를 관리하는」 두 가지 핵심 사례를 구성합니다——또한 NAIS 1.0의 5대 중점 분야 중 하나인 「지능형 교통 및 물류」의 법적 기초입니다.`,
        contentJa: `Road Traffic Act 1961 は 2017 年の Road Traffic (Amendment) Act を通じて第 6C 条（Trials and use of autonomous motor vehicles）を追加することで、自動運転 (AV) を硬法に組み込みました。中核条款：陸路交通管理局 (LTA) は、細則の策定、AV テストと運営許可の発行、保険と安全要件の設定、指定地域 (designated area) での豁免を行う権限を付与されています。付属する 2017 年に公布された Road Traffic (Autonomous Motor Vehicles) Rules は以下をカバーしています。テスト申請と承認、安全員要件、データ記録と事件報告 (ブラックボックス)、LTA との継続的な報告義務、最低保険額。シンガポールは同時に CETRAN (Centre of Excellence for Testing and Research of AVs) テストセンターと one-north 自動運転試験区を設立し、法的認可を物理的インフラに落とし込みました。この条項は Health Products Act と共に、W&C tracker が単独でリストアップした「既存産業法で AI を管理する」という 2 つのコアサンプルを構成しており、NAIS 1.0 の 5 大重点領域の 1 つ「インテリジェント交通とロジスティクス」の法的基礎でもあります。`,
        summaryEn:
          'A 2017 amendment introduced Section 6C, empowering LTA to regulate autonomous vehicle trials and use.',
        contentEn: `The Road Traffic Act 1961 was amended in 2017 (Road Traffic (Amendment) Act 2017) to insert Section 6C — "Trials and use of autonomous motor vehicles" — bringing AVs into hard law. Core provisions: the Land Transport Authority (LTA) is empowered to make subsidiary regulations, issue trial and operational permits for AVs, set insurance and safety requirements, and grant exemptions within designated areas. The accompanying Road Traffic (Autonomous Motor Vehicles) Rules 2017 cover trial applications and approvals, safety driver requirements, data logging and incident reporting (black-box), ongoing reporting obligations to LTA, and minimum insurance thresholds. In parallel, Singapore established CETRAN (Centre of Excellence for Testing and Research of Autonomous Vehicles) and the one-north AV trial zone, anchoring the legal authorisation in physical infrastructure. Together with the Health Products Act, this is one of the two core examples that the W&C tracker singles out for "regulating AI through existing sector statutes" — and the legal foundation for "intelligent transport and logistics," one of the five priority sectors of NAIS 1.0.`,
        sourceEn: 'Land Transport Authority (LTA) / Ministry of Transport (MOT)',
        ministry: 'MOT',
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'guidelines-on-securing-ai-systems',
        title: 'CSA AI 系统安全指南',
        titleKo: 'CSA AI 시스템 안전 지침',
        titleJa: 'CSA AI システムセキュリティガイドライン',
        titleEn: 'Guidelines on Securing AI Systems',
        date: '2024-10',
        source: '网络安全局 (CSA)',
        sourceKo: '사이버보안청(CSA)',
        sourceJa: 'サイバーセキュリティ庁 (CSA)',
        sourceOrgUrl: 'https://www.csa.gov.sg/',
        sourceUrl:
          'https://www.csa.gov.sg/resources/publications/guidelines-and-companion-guide-on-securing-ai-systems/',
        translatedPdfUrl: '/pdfs/csa-ai-security-zh.pdf',
        summary: 'AI 系统全生命周期安全最佳实践指南。',
        summaryKo: 'AI 시스템 전체 생명 주기 보안 모범 사례 지침입니다.',
        summaryJa: 'AI システムの全ライフサイクル・セキュリティに関するベストプラクティスガイドライン。',
        content: `CSA 于 2024 年 10 月发布 AI 系统安全指南及配套实践手册，填补了 AI 安全领域的治理空白。指南覆盖 AI 系统全生命周期：规划与设计阶段的威胁建模、开发阶段的数据与模型安全、部署阶段的安全测试、运维阶段的监控与事件响应。重点关注对抗性攻击防御、数据投毒防范、模型窃取防护、供应链安全等 AI 特有风险。`,
        contentKo: `CSA는 2024년 10월 AI 시스템 안전 지침 및 관련 실무 매뉴얼을 발표했으며, AI 보안 분야의 거버넌스 공백을 메웠습니다. 지침은 AI 시스템의 전체 생명 주기를 포함합니다: 계획 및 설계 단계의 위협 모델링, 개발 단계의 데이터 및 모델 보안, 배포 단계의 보안 테스트, 운영 단계의 모니터링 및 사건 대응. 적대적 공격 방어, 데이터 중독 방지, 모델 도용 방지, 공급망 보안 등 AI 특화 위험을 중점적으로 관심 있게 봅니다.`,
        contentJa: `CSA は 2024 年 10 月に AI システムセキュリティガイドラインおよび実装ハンドブックを発表し、AI セキュリティ領域のガバナンスギャップを埋めました。ガイドラインは AI システムの完全なライフサイクルをカバーしています。計画と設計段階での脅威モデリング、開発段階でのデータとモデルのセキュリティ、展開段階でのセキュリティテスト、運用段階での監視とインシデント対応です。主要な焦点は、敵対的攻撃防御、データポイズニング防止、モデル盗難保護、サプライチェーンセキュリティなど AI 固有のリスクです。`,
        summaryEn: 'Best-practice guidelines for end-to-end security across the AI system lifecycle.',
        contentEn: `In October 2024, CSA released the Guidelines on Securing AI Systems together with a companion practice handbook, filling a governance gap in the AI security space. The guidelines cover the full AI system lifecycle: threat modelling at the planning and design stage, data and model security during development, security testing at deployment, and monitoring and incident response in operations. They focus on AI-specific risks including adversarial attack defence, data poisoning prevention, model theft protection, and supply chain security.`,
        sourceEn: 'Cyber Security Agency (CSA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'guide-on-use-of-generative-ai-tools-by-court-users',
        title: '法院生成式 AI 使用指南',
        titleKo: '법원 생성형 AI 사용 지침',
        titleJa: '裁判所での生成 AI 使用ガイドライン',
        titleEn: 'Guide on Use of Generative AI Tools by Court Users',
        date: '2024-10',
        source: '新加坡最高法院 (Supreme Court)',
        sourceKo: '싱가포르 최고법원 (Supreme Court)',
        sourceJa: 'シンガポール最高裁判所 (Supreme Court)',
        sourceOrgUrl: 'https://www.judiciary.gov.sg/',
        sourceUrl: 'https://www.judiciary.gov.sg/news-and-resources/news',
        pdfUrl:
          'https://www.judiciary.gov.sg/docs/default-source/news-and-resources-docs/guide-on-the-use-of-generative-ai-tools-by-court-users.pdf',
        translatedPdfUrl: '/pdfs/court-genai-guide-zh.pdf',
        summary: '法律诉讼中使用生成式 AI 工具的原则和指引。',
        summaryKo: '법률 소송에서 생성형 AI 도구 사용의 원칙과 지침.',
        summaryJa: '法的訴訟における生成 AI ツール使用の原則と指導。',
        content: `新加坡最高法院于 2024 年发布生成式 AI 使用指南（Registrar's Circular No. 1 of 2024），适用于所有法院体系。核心原则：律师和当事人对提交法院的所有内容负最终责任，无论是否使用 AI 生成；使用 GenAI 辅助准备的法律文件须披露 AI 使用情况；引用的案例和法律条文须经人工核实。体现了司法系统对 AI 工具的务实态度——不禁止使用，但强调人类责任不可转移。`,
        contentKo: `싱가포르 최고법원은 2024년에 생성형 AI 사용 지침(Registrar's Circular No. 1 of 2024)을 발표했으며, 모든 법원 체계에 적용됩니다. 핵심 원칙: 변호사와 당사자는 법원에 제출한 모든 내용에 대해 AI로 생성되었는지 여부와 관계없이 최종 책임을 지며; GenAI가 준비를 보조한 법률 문서는 AI 사용 현황을 공개해야 하고; 인용한 판례와 법률 조항은 인적 검증을 거쳐야 합니다. 이는 사법 체계가 AI 도구에 대해 현실적인 태도를 취하고 있음을 보여줍니다. 즉, 사용을 금지하지는 않지만 인간의 책임은 이전할 수 없다는 점을 강조합니다.`,
        contentJa: `シンガポール最高裁判所は 2024 年に生成型 AI 使用ガイドライン（Registrar's Circular No. 1 of 2024）を発表し、すべての司法制度に適用されます。中核原則：弁護士と当事者は、AI が生成したかどうかに関係なく、法院に提出されたすべての内容について最終責任を負います。GenAI の支援を受けて準備された法律文書は AI の使用状況を開示する必要があります。引用されたケースと法的条文は人間による検証が必要です。司法制度が AI ツールに対して実用的なアプローチをとっていることを反映しています——使用を禁止するのではなく、人間の責任は譲渡できないことを強調しています。`,
        summaryEn: 'Principles and guidance on the use of generative AI tools in legal proceedings.',
        contentEn: `In 2024, the Supreme Court of Singapore issued the Guide on the Use of Generative AI Tools by Court Users (Registrar's Circular No. 1 of 2024), applicable across the entire court system. Core principles: lawyers and parties bear ultimate responsibility for all materials submitted to court, regardless of whether AI was used to generate them; legal documents prepared with GenAI assistance must disclose the AI use; cited cases and statutory provisions must be verified by a human. The guide reflects the judiciary's pragmatic stance on AI tools — not banning their use, but making clear that human responsibility cannot be transferred.`,
        sourceEn: 'Supreme Court of Singapore',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'veritas-initiative',
        title: 'MAS Veritas 倡议',
        titleKo: 'MAS Veritas 이니셔티브',
        titleJa: 'MAS Veritas イニシアティブ',
        titleEn: 'Veritas Initiative',
        date: '2021',
        source: '新加坡金融管理局 (MAS)',
        sourceKo: '싱가포르 금융청 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/schemes-and-initiatives/veritas',
        translatedPdfUrl: '/pdfs/mas-veritas-zh.pdf',
        summary: '将 FEAT 原则转化为可操作的评估工具包，提供开源方法论。',
        summaryKo: 'FEAT 원칙을 실행 가능한 평가 툴킷으로 전환하고, 오픈소스 방법론을 제공합니다.',
        summaryJa: 'FEAT 原則を実装可能な評価ツールキットに転換。オープンソース方法論を提供します。',
        content: `Veritas 倡议是 FEAT 原则的实践延伸，由 MAS 联合金融机构共同开发。项目目标是创建一套开源、可操作的评估方法论和工具包，帮助金融机构将 FEAT 原则落地到具体 AI 应用中。涵盖客户营销公平性评估、信用风险评分透明度评估等场景。Veritas 持续更新迭代，体现新加坡"原则→工具→实践"的渐进式 AI 治理路径。`,
        contentKo: `Veritas 이니셔티브는 FEAT 원칙의 실행 확대이며, MAS가 금융 기관과 함께 공동 개발했습니다. 프로젝트 목표는 오픈소스이고 실행 가능한 평가 방법론과 툴킷 세트를 만들어 금융 기관이 구체적인 AI 애플리케이션에 FEAT 원칙을 실행하도록 돕는 것입니다. 고객 마케팅 공정성 평가, 신용 위험 점수 투명성 평가 등의 시나리오를 포함합니다. Veritas는 지속적으로 업데이트되고 반복되며, 싱가포르의 「원칙→도구→실행」의 점진적 AI 거버넌스 경로를 보여줍니다.`,
        contentJa: `Veritas イニシアティブは FEAT 原則の実践的拡張であり、MAS と金融機関の共同開発です。プロジェクトの目標は、金融機関が FEAT 原則を具体的な AI アプリケーションに落とし込むのを支援するオープンソースで実行可能な評価方法論とツールキットを作成することです。顧客マーケティングの公平性評価、信用リスクスコアリングの透明性評価などのシナリオをカバーしています。Veritas は継続的に更新と反復を行っており、シンガポールの「原則→ツール→実践」段階的 AI ガバナンスパスを体現しています。`,
        summaryEn:
          'Translates the FEAT principles into an operational assessment toolkit, with an open-source methodology.',
        contentEn: `The Veritas initiative is the practical extension of the FEAT principles, jointly developed by MAS and partner financial institutions. The project's goal is to build an open-source, operational assessment methodology and toolkit that helps financial institutions translate FEAT principles into concrete AI applications. Use cases covered include fairness assessments for customer marketing and transparency assessments for credit risk scoring. Veritas is iterated continuously, embodying Singapore's incremental "principles → tools → practice" AI governance path.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'pdpc-advisory-guidelines-on-use-of-personal-data-in-ai',
        title: 'PDPC 个人数据 AI 使用咨询指南',
        titleKo: 'PDPC 개인정보 AI 사용 자문 지침',
        titleJa: 'PDPC 個人データ AI 使用に関する諮問ガイドライン',
        titleEn: 'Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems',
        date: '2024-03',
        source: '个人数据保护委员会 (PDPC)',
        sourceKo: '개인정보 보호위원회 (PDPC)',
        sourceJa: '個人データ保護委員会 (PDPC)',
        sourceOrgUrl: 'https://www.pdpc.gov.sg/',
        sourceUrl:
          'https://www.pdpc.gov.sg/guidelines-and-consultation/2024/02/advisory-guidelines-on-use-of-personal-data-in-ai-recommendation-and-decision-systems',
        summary: 'PDPC 明确 PDPA 在 AI 推荐与决策系统中的合规边界——为企业用个人数据训练和运行 AI 提供确定性。',
        summaryKo:
          'PDPC가 AI 추천 및 의사결정 시스템에서 PDPA의 준수 경계를 명확히 함으로써, 기업이 개인정보를 사용하여 AI를 훈련하고 운영하는 데 명확성을 제공합니다.',
        summaryJa:
          'PDPC は AI レコメンデーション・システムと意思決定システムにおける PDPA コンプライアンスの境界を明確にしています。企業が個人データを使用して AI をトレーニングおよび運用する際の確実性を提供します。',
        content: `PDPC 于 2024 年 3 月发布《Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems》，把 PDPA 在 AI 场景下的具体适用方式讲清楚。覆盖三类常见情形：(1) 用个人数据训练、测试、监控 AI 模型——可援引 Business Improvement Exception 或 Research Exception，但需通过合理性测试、数据最小化、去标识化等门槛；(2) 用 AI 进行推荐或决策——须履行通知和同意义务，决策类应用须告知数据主体；(3) 数据保护影响评估（DPIA）的最佳实践模板。这是 PDPC 把 PDPA 2020 修订（合法利益例外、Business Improvement Exception）转化为 AI 落地操作手册的关键文件，与 Copyright Act §244 共同构成新加坡 AI 训练侧"双重法律基础"。`,
        contentKo: `PDPC는 2024년 3월 《개인정보 AI 추천 및 의사결정 시스템 사용 자문 지침(Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems)》을 발표했으며, PDPA가 AI 시나리오에서 구체적으로 어떻게 적용되는지 명확히 했습니다. 세 가지 일반적인 상황을 포함합니다: (1) 개인정보를 사용하여 AI 모델을 훈련, 테스트, 모니터링하는 경우 — 업무 개선 예외(Business Improvement Exception) 또는 연구 예외(Research Exception)를 인용할 수 있지만, 합리성 테스트, 데이터 최소화, 식별 제거 등의 요건을 충족해야 합니다; (2) AI를 사용하여 추천 또는 의사결정을 하는 경우 — 통지 및 동의 의무를 이행해야 하며, 의사결정 애플리케이션은 데이터 주체에게 알려야 합니다; (3) 데이터 보호 영향 평가(DPIA)의 모범 사례 템플릿. 이는 PDPC가 PDPA 2020 개정(정당한 이익 예외, 업무 개선 예외)을 AI 구현 운영 매뉴얼로 전환하는 핵심 문서이며, Copyright Act §244와 함께 싱가포르 AI 훈련 측면의 「이중 법적 기초」를 구성합니다.`,
        contentJa: `PDPC は 2024 年 3 月に「Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems」を発表し、AI シナリオにおける PDPA の具体的な適用方法を明確にしました。3 つの一般的なシナリオをカバーしています。(1) 個人データを使用して AI モデルを訓練、テスト、監視する——Business Improvement Exception または Research Exception を引用することができますが、合理性テスト、データ最小化、匿名化などのしきい値を通じる必要があります。(2) AI を使用して推奨または決定を行う——通知と同意の義務を履行する必要があり、決定タイプのアプリケーションはデータサブジェクトに通知する必要があります。(3) データ保護影響評価 (DPIA) のベストプラクティステンプレート。これは PDPC が PDPA 2020 改正（正当な利益の例外、Business Improvement Exception）を AI の実装運用ハンドブックに変換することの重要な文書であり、Copyright Act §244 と共に、シンガポール AI トレーニング側の「二重法的基礎」を構成しています。`,
        summaryEn:
          'PDPC clarifies how PDPA applies to AI recommendation and decision systems — giving organisations certainty when using personal data to train and run AI.',
        contentEn: `In March 2024, PDPC issued the Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems, spelling out how the PDPA applies in concrete AI scenarios. The guidelines cover three common situations: (1) using personal data to train, test, and monitor AI models — which can rely on the Business Improvement Exception or Research Exception, subject to reasonableness, data minimisation, and de-identification thresholds; (2) using AI for recommendations or decision-making — which triggers notification and consent obligations, and where decision-making applications must inform data subjects; (3) best-practice templates for Data Protection Impact Assessments (DPIA). This is the key document by which PDPC translates the 2020 PDPA amendments (legitimate interests, Business Improvement Exception) into an operational handbook for AI deployment, forming — together with Section 244 of the Copyright Act — Singapore's dual legal foundation on the training side.`,
        sourceEn: 'Personal Data Protection Commission (PDPC)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'fairness-ethics-accountability-transparency-feat-principles',
        title: 'MAS FEAT 原则',
        titleKo: 'MAS FEAT 원칙',
        titleJa: 'MAS FEAT 原則',
        titleEn: 'Fairness, Ethics, Accountability, Transparency (FEAT) Principles',
        date: '2018',
        source: '新加坡金融管理局 (MAS)',
        sourceKo: '싱가포르 금융청 (MAS)',
        sourceJa: 'シンガポール金融管理局 (MAS)',
        sourceOrgUrl: 'https://www.mas.gov.sg/',
        sourceUrl: 'https://www.mas.gov.sg/publications/monographs-or-information-paper/2018/FEAT',
        translatedPdfUrl: '/pdfs/mas-feat-zh.pdf',
        summary: '金融业 AI 使用的公平性、伦理、问责和透明度原则。',
        summaryKo: '금융업 AI 사용의 공정성, 윤리, 책임성 및 투명성 원칙.',
        summaryJa: '金融業における AI 使用の公平性、倫理、アカウンタビリティ、透明性原則。',
        content: `MAS 于 2018 年发布 FEAT 原则，为金融机构使用 AI 和数据分析提供治理指引。四大原则：公平性（Fairness）——确保 AI 决策不产生歧视；伦理（Ethics）——AI 使用符合道德标准；问责（Accountability）——明确 AI 决策的责任归属；透明度（Transparency）——AI 决策过程可理解、可解释。2022 年更新版纳入更多实践指导。`,
        contentKo: `MAS는 2018년 FEAT 원칙을 발표했으며, 금융 기관의 AI 및 데이터 분석 사용에 관한 거버넌스 지침을 제공합니다. 네 가지 핵심 원칙: 공정성(Fairness) — AI 의사결정이 차별을 일으키지 않도록 보장; 윤리(Ethics) — AI 사용이 도덕 표준을 준수; 책임성(Accountability) — AI 의사결정의 책임 귀속을 명확히; 투명성(Transparency) — AI 의사결정 프로세스가 이해 가능하고 설명 가능. 2022년 업데이트된 버전은 더 많은 실행 지침을 포함합니다.`,
        contentJa: `MAS は 2018 年に FEAT 原則を発表し、金融機関による AI とデータ分析の使用についてのガバナンスガイダンスを提供しました。4 つの主要原則：公平性（Fairness）——AI 決定が差別を生じないことを確保します。倫理（Ethics）——AI の使用は道徳的基準に準拠しています。説明責任（Accountability）——AI 決定の責任を明確にします。透明性（Transparency）——AI 決定プロセスは理解でき、説明可能です。2022 年の更新版は、より多くの実装ガイダンスを組み込んでいます。`,
        summaryEn: 'Fairness, Ethics, Accountability, and Transparency principles for AI use in the financial sector.',
        contentEn: `MAS issued the FEAT principles in 2018 to provide governance guidance for financial institutions using AI and data analytics. Four principles: Fairness — ensuring AI decisions do not produce discrimination; Ethics — AI use aligns with ethical standards; Accountability — clear assignment of responsibility for AI decisions; Transparency — AI decision processes are understandable and explainable. The 2022 update incorporated additional practical guidance.`,
        sourceEn: 'Monetary Authority of Singapore (MAS)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'copyright-act-2021-section-244-computational-data-analysis-exception',
        title: 'Copyright Act §244 — AI 训练例外',
        titleKo: '저작권법 §244 — AI 훈련 예외',
        titleJa: 'Copyright Act §244 — AI トレーニング例外',
        titleEn: 'Copyright Act 2021 — Section 244 (Computational Data Analysis Exception)',
        date: '2021-11',
        source: '律政部 (MINLAW) / IPOS',
        sourceKo: '법무부 (MINLAW) / 싱가포르 지식재산청 (IPOS)',
        sourceJa: '法務・知的財産権省 (MINLAW) / IPOS',
        sourceOrgUrl: 'https://www.mlaw.gov.sg/',
        sourceUrl: 'https://sso.agc.gov.sg/Act/CA2021?ProvIds=P14-#pr244-',
        summary: 'AI 训练免责条款——与日本并列全球最宽松的 AI 训练版权立场。',
        summaryKo: 'AI 훈련 면책 조항 — 일본과 함께 세계에서 가장 느슨한 AI 훈련 저작권 입장.',
        summaryJa: 'AI トレーニングの免責条項。日本と並んで世界で最も寛容な AI トレーニング著作権スタンス。',
        content: `Copyright Act 2021 第 244 条 "Computational Data Analysis" 给 AI 训练数据使用提供明确的免责条款：合法获取的内容（不论是否有版权）可用于 AI 模型训练、文本与数据挖掘等"计算分析"用途，不构成版权侵权。这与日本《著作权法》第 30-4 条并列为全球最宽松的 AI 训练版权立场——美国仍在 fair use 案例法争议中、欧盟需依赖 Text and Data Mining Exception 的 opt-out 机制。配合 IPOS 的 "When Code Creates" 报告（2024）和"训练宽松 + 输出严管"哲学（OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套），新加坡为 AI 公司提供了**全球最清晰的法律边界之一**——这是 EDB 能引进 OpenAI / Anthropic / DeepMind 等机构的关键背景之一。`,
        contentKo: `저작권법 2021 제244조의 「컴퓨터 데이터 분석」은 AI 훈련 데이터 사용에 명확한 면책 조항을 제공합니다. 합법적으로 획득한 콘텐츠(저작권 여부와 관계없이)는 AI 모델 훈련, 텍스트 및 데이터 마이닝 등의 「컴퓨터 분석」 목적으로 사용할 수 있으며, 저작권 침해를 구성하지 않습니다. 이는 일본의 《저작권법》 제30-4조와 함께 세계에서 가장 느슨한 AI 훈련 저작권 입장으로 나란히 있습니다 — 미국은 여전히 공정 사용(fair use) 판례법 분쟁 중에 있고, 유럽연합은 텍스트 및 데이터 마이닝 예외(Text and Data Mining Exception)의 옵트아웃(opt-out) 메커니즘에 의존합니다. IPOS의 「코드가 만들 때」(When Code Creates) 보고서(2024)와 「훈련 느슨함 + 출력 엄격함」 철학(OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 네 가지 패키지)과 함께, 싱가포르는 AI 기업에 **세계에서 가장 명확한 법적 경계 중 하나**를 제공합니다 — 이것이 EDB가 OpenAI / Anthropic / DeepMind 등 기관을 유치할 수 있는 핵심 배경 중 하나입니다.`,
        contentJa: `Copyright Act 2021 の第 244 条「Computational Data Analysis」は AI トレーニングデータの使用に明確な免責条項を提供します。合法的に取得されたコンテンツ（著作権の有無を問わず）を AI モデル訓練、テキストおよびデータマイニングなどの「計算分析」の目的で使用することができ、著作権侵害を構成しません。これは日本の『著作権法』第 30-4 条と並んで、世界で最も寛容な AI トレーニング著作権スタンスの 1 つです——米国は依然として fair use 判例法をめぐる論争の中にあり、欧盟は Text and Data Mining Exception の opt-out メカニズムに依存する必要があります。IPOS の「When Code Creates」レポート (2024) および「トレーニング寛容 + 出力厳管」哲学 (OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill の 4 点セット) を組み合わせて、シンガポールは AI 企業に**世界でも最も明確な法的境界の 1 つ**を提供しています——これは EDB が OpenAI / Anthropic / DeepMind などの機関を引き込むことができた主要な背景の 1 つです。`,
        summaryEn:
          'AI-training safe harbour — alongside Japan, the most permissive copyright stance on AI training in the world.',
        contentEn: `Section 244 of the Copyright Act 2021, "Computational Data Analysis," provides an explicit safe harbour for AI training data use: lawfully accessed content (whether or not copyrighted) may be used for AI model training, text and data mining, and other "computational analysis" purposes without constituting copyright infringement. Together with Article 30-4 of Japan's Copyright Act, this is the world's most permissive copyright stance on AI training — the US is still navigating fair use case law, while the EU relies on the opt-out mechanism in its Text and Data Mining Exception. Combined with IPOS's "When Code Creates" report (2024) and the "permissive training + strict output" philosophy (the OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill quartet), Singapore offers AI companies **one of the clearest legal perimeters in the world** — a key part of the backdrop that lets EDB attract institutions like OpenAI, Anthropic, and DeepMind.`,
        sourceEn: 'Ministry of Law (MINLAW) / IPOS',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '预算与资金',
    nameKo: '예산 및 자금',
    nameJa: '予算と資金',
    nameEn: 'Budget & Funding',
    icon: '💰',
    policies: [
      {
        id: 'budget-2026-national-ai-acceleration',
        title: '2026 财政预算案 — 国家 AI 全面推进',
        titleKo: '2026 재정 예산안 — 국가 AI 전면 추진',
        titleJa: '2026 年度財政予算案 — 国家 AI 全面推進',
        titleEn: 'Budget 2026 — National AI Acceleration',
        date: '2026-02',
        source: '财政部 (MOF)',
        sourceKo: '재정부 (MOF)',
        sourceJa: '財務省 (MOF)',
        sourceOrgUrl: 'https://www.mof.gov.sg/',
        sourceUrl:
          'https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage',
        translatedPdfUrl: '/pdfs/budget-2026-zh.pdf',
        summary: '成立国家 AI 委员会、AI 税收减免、one-north AI 园区、AI Mission 计划。',
        summaryKo: '국가 AI 위원회 설립, AI 세제 감면, one-north AI 파크, AI Mission 계획.',
        summaryJa: '国家 AI 委員会の設立、AI 租税控除、one-north AI パーク、AI Mission 計画。',
        content: `2026 年预算案将 AI 推进提升到前所未有的高度。核心举措：成立由总理亲自主持的 National AI Council；Enterprise Innovation Scheme 的 400% 税务扣除扩展至 AI 相关支出；启动 one-north AI 园区建设；推出 AI Mission 计划聚焦关键领域应用；设立 National AI Literacy Programme 提升全民 AI 素养。这是新加坡 AI 政策从战略到全面执行的标志性预算。`,
        contentKo: `2026년 예산안은 AI 추진을 전례 없는 높이로 끌어올립니다. 핵심 조치: 총리가 직접 주재하는 National AI Council 설립; Enterprise Innovation Scheme의 400% 세제 공제를 AI 관련 지출로 확대; one-north AI 파크 건설 시작; AI Mission 계획을 통해 핵심 분야 응용에 집중; National AI Literacy Programme 설립으로 국민 전체의 AI 소양 향상. 이는 싱가포르 AI 정책이 전략에서 전면 실행으로 나아가는 상징적인 예산입니다.`,
        contentJa: `2026 年度予算案は AI 推進を前例のない高さへ引き上げます。中核的措置：総理が直接議長を務める National AI Council の設立；Enterprise Innovation Scheme の 400% 税務控除を AI 関連支出に拡大；one-north AI パーク建設の開始；重要領域のアプリケーションに焦点を当てた AI Mission プログラムの開始；全国的な AI リテラシーを向上させるための National AI Literacy Programme の設立。これはシンガポール AI 政策が戦略から完全な実行へのマイルストーン予算です。`,
        summaryEn:
          'Establishment of the National AI Council, AI tax incentives, the one-north AI district, and the AI Mission programme.',
        contentEn: `Budget 2026 elevates AI to an unprecedented level of priority. Core measures: a National AI Council chaired by the Prime Minister; the Enterprise Innovation Scheme's 400% tax deduction extended to AI spending; construction of the one-north AI district; the AI Mission programme focused on critical-sector applications; and a National AI Literacy Programme. This is the budget that takes Singapore's AI policy from strategy to full-scale execution.`,
        sourceEn: 'Ministry of Finance (MOF)',
        ministry: 'MOF',
        authorPersonIds: ['lawrence-wong'],
        relatedDebateIds: ['cos-mddi-2026', 'cos-mti-2026'],
        relatedLeverNumbers: [1, 3, 4],
        relatedTimelineYears: [2026],
        relatedPostSlugs: ['singapore-ai-native-companies-vs-nations'],
      },
      {
        id: 'moh-committee-of-supply-2026-healthcare-ai-medisave-reform',
        title: '2026 卫生部供给委员会 — 医疗AI与健保改革',
        titleKo: '2026 보건부 공급 위원회 — 의료 AI 및 건강보험 개혁',
        titleJa: '2026 年度保健省提供委員会 — 医療 AI と健康保険改革',
        titleEn: 'MOH Committee of Supply 2026 — Healthcare AI & MediSave Reform',
        date: '2026-03',
        source: '卫生部 (MOH)',
        sourceKo: '보건부 (MOH)',
        sourceJa: '保健省 (MOH)',
        sourceOrgUrl: 'https://www.moh.gov.sg/',
        sourceUrl:
          'https://www.straitstimes.com/singapore/politics/ai-genetic-screening-and-flexible-financing-to-bolster-preventive-medicine-for-super-aged-spore-ong',
        summary: 'ACE-AI 预测工具部署、BRCA1/2 基因检测补贴、MediShield Life 覆盖预防性手术、MediSave 限额提升。',
        summaryKo:
          'ACE-AI 예측 도구 배치, BRCA1/2 유전자 검사 보조금, MediShield Life 예방 수술 보장 범위, MediSave 한도 상향.',
        summaryJa:
          'ACE-AI 予測ツール導入、BRCA1/2 遺伝子検査補助、MediShield Life の予防手術カバレッジ、MediSave 上限引き上げ。',
        content: `2026 年 3 月卫生部供给委员会辩论，卫生部长王乙康宣布新加坡正式成为超老龄社会（65 岁以上人口超 21%）。核心措施：一、ACE-AI 预测工具（由国家医疗科技局 Synapxe 开发），预测 3 年内糖尿病及高脂血症风险，>75% 风险者由 3 年一检提升至每年检查，2027 年初推广至所有约 1,100 家 Healthier SG 诊所，坚持"AI 增强而非 AI 决定"原则，临床医生保持在决策回路中；二、BRCA1/2 基因检测从 2026 年 12 月起获最高 70% 补贴，每年 2,000+ 人符合条件；三、MediShield Life 扩展覆盖预防性乳房切除术（Q3 2026）及风险降低型输卵管卵巢切除术（Q4 2026）；四、MediSave 慢性病与预防护理限额从 500/700 提至 700/1000（2027 年 1 月起），惠及 91 万+ 患者。`,
        contentKo: `2026년 3월 보건부 공급 위원회 토론에서 보건부장관 Ong Ye Kung은 싱가포르가 공식적으로 초고령 사회(65세 이상 인구 21% 초과)가 되었음을 선포했습니다. 핵심 조치: 첫째, ACE-AI 예측 도구(국가의료기술청 Synapxe가 개발)는 3년 내 당뇨병 및 고지혈증 위험을 예측하며, 75% 초과 위험자는 3년에 한 번 검사에서 매년 검사로 상향되고, 2027년 초에 약 1,100개의 모든 Healthier SG 클리닉으로 확대되며, 「AI 증강이지 AI 결정이 아님」 원칙을 고수하고 임상의가 의사결정 루프에 남아있습니다; 둘째, BRCA1/2 유전자 검사는 2026년 12월부터 최대 70% 보조금을 받으며, 매년 2,000명 이상이 적격입니다; 셋째, MediShield Life는 예방적 유방절제술(2026년 3분기) 및 위험 감소형 난관난소절제술(2026년 4분기)을 포함하도록 확대됩니다; 넷째, MediSave 만성병 및 예방 보건 한도는 500/700에서 700/1000으로 상향됩니다(2027년 1월부터), 91만명 이상의 환자가 혜택을 받습니다.`,
        contentJa: `2026 年 3 月の保健省予算委員会辩論で、保健大臣王乙康はシンガポールが正式に超高齢化社会（65 歳以上の人口が 21% を超える）になったことを宣言しました。中核的措置：1 つ、ACE-AI 予測ツール（国家医療技術局 Synapxe により開発）は 3 年以内の糖尿病および高脂血症リスクを予測し、75% 以上のリスク者は 3 年ごと検査から毎年検査へアップグレードされ、2027 年初期にすべての約 1,100 の Healthier SG クリニックに推進される予定で、「AI 強化ではなく AI 決定」原則を堅持し、臨床医師は意思決定ループに留まります。2つ、BRCA1/2 遺伝子検査は 2026 年 12 月から最高 70% の補助金を受け、毎年 2,000 人以上が対象になります。3つ、MediShield Life は予防的乳房切除手術 (Q3 2026) およびリスク低減型卵管卵巣切除術 (Q4 2026) のカバレッジを拡大します。4つ、MediSave の慢性疾患と予防ケア限度額は 500/700 から 700/1000 へ引き上げられます (2027 年 1 月から)、91 万人以上の患者に利益をもたらします。`,
        summaryEn:
          'Deployment of the ACE-AI prediction tool, BRCA1/2 genetic testing subsidies, MediShield Life coverage for preventive surgery, and increased MediSave limits.',
        contentEn: `In the March 2026 Committee of Supply debate, Minister for Health Ong Ye Kung announced that Singapore has formally become a super-aged society (population aged 65+ exceeds 21%). Core measures: (1) ACE-AI, a prediction tool developed by national health tech agency Synapxe, forecasts 3-year risk of diabetes and hyperlipidaemia. Patients with >75% risk move from triennial to annual screening, with rollout in early 2027 to all roughly 1,100 Healthier SG clinics, following the principle of "AI augmentation, not AI decision-making" with clinicians remaining in the loop. (2) BRCA1/2 genetic testing receives subsidies of up to 70% from December 2026, with 2,000+ eligible people each year. (3) MediShield Life coverage expands to include preventive mastectomy (Q3 2026) and risk-reducing salpingo-oophorectomy (Q4 2026). (4) MediSave chronic and preventive care limits rise from 500/700 to 700/1000 (effective January 2027), benefiting 910,000+ patients.`,
        sourceEn: 'Ministry of Health (MOH)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'budget-2025-ai-related-measures',
        title: '2025 财政预算案 — AI 相关措施',
        titleKo: '2025년 재정 예산안 — AI 관련 조치',
        titleJa: '2025 年度財政予算案 — AI 関連措置',
        titleEn: 'Budget 2025 — AI-related Measures',
        date: '2025-02',
        source: '财政部 (MOF)',
        sourceKo: '재정부 (MOF)',
        sourceJa: '財務省 (MOF)',
        sourceOrgUrl: 'https://www.mof.gov.sg/',
        sourceUrl: 'https://www.singaporebudget.gov.sg/',
        translatedPdfUrl: '/pdfs/budget-2025-zh.pdf',
        summary: '黄循财首份预算案，释放大规模 AI 投入信号。',
        summaryKo: 'Huang Xunfai의 첫 예산안, 대규모 AI 투자 신호 발신',
        summaryJa: 'Lawrence Wong 首相による初代予算案。大規模 AI 投資の信号を発表。',
        content: `2025 年预算案是黄循财出任总理后的首份预算案，首次将 AI 列为财政优先事项。重点措施包括：加速企业数字化转型拨款、扩大 AI 技能培训计划覆盖面、增加 AI 研发投入。预算案为后续 NAIS 2.0 的落地执行提供了财政保障，标志着 AI 从战略规划正式进入财政拨款阶段。`,
        contentKo: `2025년 예산안은 Huang Xuanhui 총리 취임 후의 첫 예산안이며, 처음으로 AI를 재정적 우선순위로 지정했습니다. 주요 조치는 기업 디지털 전환 가속화 지원금, AI 기술 훈련 계획 범위 확대, AI 연구개발 투자 증대를 포함합니다. 예산안은 후속 NAIS 2.0 구현을 위한 재정적 보장을 제공하며, AI가 전략 계획에서 공식적으로 재정적 배분 단계로 진입했음을 표시합니다.`,
        contentJa: `2025 年度予算案は黄循財が総理に就任した後の初めての予算案であり、初めて AI を財政優先事項として列挙しました。重点措置には、企業デジタル化転換の加速化拨款、AI スキル訓練計画カバレッジの拡大、AI 研究開発投資の増加が含まれます。予算案は後続の NAIS 2.0 の実装実行に財政保障を提供し、AI が戦略計画から財政拨款段階へ正式に進入したことを示しています。`,
        summaryEn: "Lawrence Wong's first budget as Prime Minister, signalling large-scale AI investment.",
        contentEn: `Budget 2025 is Lawrence Wong's first budget as Prime Minister and the first to designate AI as a fiscal priority. Key measures include: increased grants to accelerate enterprise digital transformation, expanded coverage of AI skills training programmes, and additional AI R&D funding. The budget provides the fiscal foundation for executing NAIS 2.0 and marks the formal transition of AI from strategic planning into the appropriations phase.`,
        sourceEn: 'Ministry of Finance (MOF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'research-innovation-and-enterprise-2025-plan',
        title: 'RIE2025 研究创新计划',
        titleKo: 'RIE2025 연구혁신 계획',
        titleJa: 'RIE2025 研究革新計画',
        titleEn: 'Research, Innovation and Enterprise 2025 Plan',
        date: '2020',
        source: '国家研究基金会 (NRF)',
        sourceKo: '국가연구재단(NRF)',
        sourceJa: '国家研究基金会 (NRF)',
        sourceOrgUrl: 'https://www.nrf.gov.sg/',
        sourceUrl: 'https://www.nrf.gov.sg/',
        translatedPdfUrl: '/pdfs/rie2025-zh.pdf',
        summary: '250 亿新元五年研发计划，AI 列为重点投资领域。',
        summaryKo: '250억 싱가포르달러 5년 연구개발 계획, AI를 주요 투자 분야로 선정',
        summaryJa: '250 億シンガポール・ドルの五年間の研究開発計画。AI を主要投資領域として指定。',
        content: `RIE2025 计划覆盖 2021-2025 年，总投入 250 亿新元，是新加坡历史上最大规模的研发投资。四大战略领域：制造贸易与连接、人类健康与潜能、城市可持续发展与智慧国家、数字经济。AI 贯穿各领域，是核心使能技术。计划支持 AI Singapore 等国家级 AI 研究项目，资助 AI 人才培养、基础研究和产业应用。`,
        contentKo: `RIE2025 프로그램은 2021-2025년을 다루며, 총 250억 싱가포르달러의 투자로 싱가포르 역사상 최대 규모의 연구개발 투자입니다. 네 가지 전략 분야: 제조·무역 및 연결성, 인간의 건강과 잠재력, 도시 지속가능 발전 및 스마트 국가, 디지털 경제. AI는 모든 분야를 관통하며 핵심 실현 기술입니다. 계획은 AI Singapore 등 국가급 AI 연구 프로젝트를 지원하고, AI 인재 양성, 기초 연구 및 산업 응용을 자금 지원합니다.`,
        contentJa: `RIE2025計画は2021～2025年を対象とし、総投資額250億シンガポールドルで、シンガポール史上最大規模の研究開発投資です。4つの戦略領域は製造・貿易・連携、人間の健康と可能性、都市の持続可能な発展とスマート国家、デジタル経済です。AIはすべての領域を貫くコア的実現技術です。計画はAI Singaporeなどの国家レベルのAI研究プロジェクトを支援し、AI人材育成、基礎研究、産業応用に資金を提供します。`,
        summaryEn: 'S$25 billion five-year R&D plan, with AI designated as a priority investment area.',
        contentEn: `The RIE2025 plan covers 2021-2025 with a total commitment of S$25 billion — the largest R&D investment in Singapore's history. Four strategic domains: Manufacturing, Trade and Connectivity; Human Health and Potential; Urban Solutions and Sustainability and Smart Nation; and Digital Economy. AI runs across all domains as a core enabling technology. The plan supports national AI research programmes such as AI Singapore and funds AI talent development, fundamental research, and industrial applications.`,
        sourceEn: 'National Research Foundation (NRF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
  {
    name: '国际合作',
    nameKo: '국제 협력',
    nameJa: '国際協力',
    nameEn: 'International Collaboration',
    icon: '🌏',
    policies: [
      {
        id: 'seoul-ai-safety-commitment',
        title: '首尔 AI 安全峰会承诺',
        titleKo: '서울 AI 안전 정상회담 약속',
        titleJa: 'ソウル AI 安全サミット公約',
        titleEn: 'Seoul AI Safety Commitment',
        date: '2024-05',
        source: '外交部 (MFA)',
        sourceKo: '외교부(MFA)',
        sourceJa: '外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl:
          'https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos/2024/05/Artificial-Intelligence-Seoul-Summit',
        translatedPdfUrl: '/pdfs/seoul-ai-summit-zh.pdf',
        summary: '参与 Seoul AI Safety Summit，进一步推进 AI 安全治理承诺。',
        summaryKo: 'Seoul AI Safety Summit에 참여하여 AI 안전 거버넌스 약속을 더욱 추진',
        summaryJa: 'Seoul AI Safety Summit に参加し、AI 安全ガバナンスの約束をさらに推し進めています。',
        content: `2024 年 5 月，新加坡参加在韩国首尔举行的第二届 AI 安全峰会，签署 Seoul AI Safety Commitment。在 Bletchley Declaration 基础上进一步深化承诺：推动前沿 AI 安全评估标准的制定、支持 AI 安全研究所之间的国际协作、促进 AI 安全测试方法论的共享。新加坡连续参与两届峰会，持续巩固其在全球 AI 治理中的积极参与者角色。`,
        contentKo: `2024년 5월, 싱가포르는 한국 서울에서 개최된 제2회 AI 안전 정상회담에 참가하여 Seoul AI Safety Commitment에 서명했습니다. Bletchley Declaration을 기반으로 약속을 한층 더 심화시켰습니다: 첨단 AI 안전 평가 표준 제정 추진, AI 안전 연구소 간 국제 협력 지원, AI 안전 테스트 방법론의 공유 촉진. 싱가포르는 두 정상회담에 연속으로 참가하여 글로벌 AI 거버넌스에서 적극적 참여자로서의 역할을 지속적으로 강화하고 있습니다.`,
        contentJa: `2024年5月、シンガポールは韓国ソウルで開催された第2回AI安全サミットに参加し、Seoul AI Safety Commitmentに署名しました。Bletchley Declarationを基盤として、最先端AI安全評価基準の制定推進、AI安全研究機関間の国際協力支援、AI安全テスト方法論の共有促進により、コミットメントをさらに深化させています。シンガポールは連続して2回のサミットに参加し、世界的なAI治理における積極的な参加者としての役割を継続して強化しています。`,
        summaryEn: 'Participation in the Seoul AI Safety Summit, advancing further AI safety governance commitments.',
        contentEn: `In May 2024, Singapore joined the second AI Safety Summit in Seoul and signed the Seoul AI Safety Commitment. Building on the Bletchley Declaration, the commitment goes further: safety evaluation standards for frontier AI, cooperation among AI Safety Institutes, and shared AI safety testing methodologies. Two summits in a row — Singapore continues to lock in its role as an active player in global AI governance.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'bletchley-declaration-on-ai-safety',
        title: 'Bletchley Park AI 安全峰会承诺',
        titleKo: 'Bletchley Park AI 안전 정상회담 약속',
        titleJa: 'Bletchley Park AI 安全サミット公約',
        titleEn: 'Bletchley Declaration on AI Safety',
        date: '2023-11',
        source: '外交部 (MFA)',
        sourceKo: '외교부(MFA)',
        sourceJa: '外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl:
          'https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos/2023/11/20231102---PM-AI-Summit',
        pdfUrl: 'https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration',
        translatedPdfUrl: '/pdfs/bletchley-park-zh.pdf',
        summary: '签署 Bletchley Declaration，承诺 AI 安全国际合作。',
        summaryKo: 'Bletchley Declaration에 서명하여 AI 안전 국제 협력을 약속',
        summaryJa: 'Bletchley Declaration に署名。AI 安全に関する国際協力を約束。',
        content: `2023 年 11 月，新加坡作为 28 个签署国之一参与了在英国 Bletchley Park 举行的首届全球 AI 安全峰会。签署 Bletchley Declaration，核心承诺包括：识别前沿 AI 带来的共同风险、各国承担 AI 安全的相应责任、加强 AI 安全研究的国际合作。宣言特别关注前沿 AI 模型的潜在风险，包括网络安全威胁、生物技术风险和虚假信息。`,
        contentKo: `2023년 11월, 싱가포르는 28개 서명국 중 하나로서 영국 Bletchley Park에서 개최된 첫 번째 글로벌 AI 안전 정상회담에 참가했습니다. Bletchley Declaration에 서명했으며, 핵심 약속은 다음을 포함합니다: 첨단 AI가 가져오는 공동 위험 파악, 각 국가의 AI 안전에 대한 상응하는 책임 이행, AI 안전 연구의 국제 협력 강화. 선언은 첨단 AI 모델의 잠재적 위험, 특히 사이버보안 위협, 생명공학 위험 및 허위정보에 특별히 주목합니다.`,
        contentJa: `2023年11月、シンガポールは英国のBletchley Parkで開催された第1回グローバルAI安全サミットに28の署名国の1つとして参加しました。Bletchley Declarationに署名し、主要なコミットメントは以下を含みます。最先端AIがもたらす共通のリスクを識別すること、各国がAI安全に対する相応の責任を負うこと、AI安全研究の国際協力を強化することです。宣言は特に最先端AIモデルの潜在的リスク（サイバーセキュリティの脅威、バイオテクノロジーのリスク、虚偽情報を含む）に焦点を当てています。`,
        summaryEn: 'Signed the Bletchley Declaration, committing to international cooperation on AI safety.',
        contentEn: `In November 2023, Singapore joined 28 signatories at the first global AI Safety Summit at Bletchley Park, UK. By signing the Bletchley Declaration, signatories committed to: identifying shared risks posed by frontier AI, taking on national responsibilities for AI safety, and strengthening international collaboration on AI safety research. The declaration places particular emphasis on potential risks from frontier AI models, including cybersecurity threats, biotechnology risks, and disinformation.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'global-partnership-on-ai-gpai',
        title: '加入全球 AI 合作伙伴关系 (GPAI)',
        titleKo: '글로벌 AI 파트너십(GPAI) 가입',
        titleJa: 'グローバル AI パートナーシップ (GPAI) に加入',
        titleEn: 'Global Partnership on AI (GPAI)',
        date: '2020',
        source: 'SNDGO / 外交部 (MFA)',
        sourceKo: 'SNDGO / 외교부(MFA)',
        sourceJa: 'SNDGO / 外交・通商省 (MFA)',
        sourceOrgUrl: 'https://www.smartnation.gov.sg/',
        sourceUrl: 'https://gpai.ai/community/member-countries-and-regions/singapore/',
        translatedPdfUrl: '/pdfs/gpai-zh.pdf',
        summary: '新加坡成为 GPAI 创始成员，参与负责任 AI 国际治理。',
        summaryKo: '싱가포르는 GPAI 창립 멤버가 되어 책임감 있는 AI 국제 거버넌스에 참여합니다.',
        summaryJa: 'シンガポールが GPAI 創設メンバーとなり、責任ある AI の国際ガバナンスに参加。',
        content: `新加坡于 2020 年成为 GPAI 创始成员国之一。GPAI 是由多国政府发起的国际倡议，旨在通过多利益相关方合作推动负责任 AI 的发展和使用。新加坡积极参与 GPAI 的工作组，包括负责任 AI、数据治理、未来工作、创新与商业化等方向。加入 GPAI 体现了新加坡在 AI 治理领域的国际参与意愿，也为本国政策制定引入国际视角和最佳实践。`,
        contentKo: `싱가포르는 2020년 GPAI 창립 멤버국 중 하나가 되었습니다. GPAI는 다국정부가 발의한 국제 이니셔티브로, 다중이해관계자 협력을 통해 책임감 있는 AI의 발전과 사용을 추동하는 것을 목표로 합니다. 싱가포르는 책임감 있는 AI, 데이터 거버넌스, 미래 업무, 혁신 및 상용화 등의 분야를 포함한 GPAI 워킹 그룹에 적극적으로 참여하고 있습니다. GPAI 가입은 AI 거버넌스 분야에서 싱가포르의 국제 참여 의지를 보여주며, 본국 정책 수립에 국제적 관점과 최고의 실행법을 도입합니다.`,
        contentJa: `シンガポールは2020年にGPAIの創設メンバー国の1つになりました。GPAIは複数の国の政府が発起した国際的なイニシアティブで、複数のステークホルダー間の協力を通じて、責任あるAIの開発と使用を促進することを目的としています。シンガポールはGPAIのワーキンググループに積極的に参加しており、責任あるAI、データガバナンス、将来の仕事、イノベーションと商業化などの領域をカバーしています。GPAIへの参加は、AI治理分野におけるシンガポールの国際参加意思を示し、また国家の政策立案に国際的な視点とベストプラクティスをもたらしています。`,
        summaryEn:
          'Singapore became a founding member of GPAI, participating in international governance for responsible AI.',
        contentEn: `Singapore became a founding member of GPAI in 2020. GPAI is a multi-government initiative that promotes the responsible development and use of AI through multi-stakeholder collaboration. Singapore takes part in working groups on Responsible AI, Data Governance, Future of Work, and Innovation and Commercialisation. Membership reflects Singapore's commitment to international AI governance and pulls outside perspectives into domestic policymaking.`,
        sourceEn: 'SNDGO / Ministry of Foreign Affairs (MFA)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'singapore-consensus-on-global-ai-safety-research-priorities',
        title: 'Singapore Consensus on Global AI Safety Research Priorities',
        titleKo: 'Singapore Consensus on Global AI Safety Research Priorities',
        titleJa: 'Singapore Consensus on Global AI Safety Research Priorities',
        titleEn: 'Singapore Consensus on Global AI Safety Research Priorities',
        date: '2025-05',
        source: 'Singapore Conference on AI (SCAI) / Singapore AI Safety Institute',
        sourceKo: 'Singapore Conference on AI (SCAI) / Singapore AI Safety Institute',
        sourceJa: 'Singapore Conference on AI (SCAI) / Singapore AI Safety Institute',
        sourceEn: 'Singapore Conference on AI (SCAI) / Singapore AI Safety Institute',
        sourceOrgUrl: 'https://sgaisi.sg/',
        sourceUrl: 'https://www.scai.gov.sg/2025/scai2025-report',
        summary:
          '2025 年 SCAI: ISE 产出的全球 AI 安全研究优先级“活文件”：100+ 参与者、11 个国家，并在 2026 年 ISE 继续更新。',
        summaryKo:
          '2025년 SCAI: ISE에서 나온 글로벌 AI 안전 연구 우선순위 “살아 있는 문서”: 100명 이상 참여자, 11개국, 2026년 ISE에서 계속 업데이트.',
        summaryJa:
          '2025 年 SCAI: ISE から生まれた AI 安全研究優先事項の「living document」。100 名超の参加者、11 カ国、2026 年 ISE で継続更新。',
        content: `Singapore Consensus 是 2025 年 Singapore Conference on AI (SCAI): International Scientific Exchange on AI Safety 的成果文件。官方口径是：2025 年 4 月 26 日，100+ 来自学界、产业和政府的参与者，覆盖 11 个国家，共同识别并形成对高优先级技术 AI 安全研究方向的共识。

它不是“11 国签署”的政府间协议。更准确的说法是：来自 11 个国家的 100+ 参与者共同贡献的、持续欢迎全球研究社区反馈的 **living document**。

文件建立在 Yoshua Bengio 主持、33 个政府支持的 International AI Safety Report 基础上，目标是为全球 AI 安全研究提供可协作的技术优先级。2026 年 5 月 17-19 日的 ISE 2026 继续召集全球专家，更新 Singapore Consensus，以反映 agentic deployments、AI misuse、能力提升和安全研究的新发展。

这仍然是新加坡最重要的国际治理杠杆之一：不是靠“签约数量”取胜，而是靠把学界、产业和政府放在同一个技术问题清单上。`,
        contentKo: `Singapore Consensus는 2025년 Singapore Conference on AI (SCAI): International Scientific Exchange on AI Safety의 결과 문서입니다. 공식 구도는 다음과 같습니다. 2025년 4월 26일, 학계·산업계·정부의 100명 이상 참여자, 11개국을 포괄하는 사람들이 고우선순위 기술 AI 안전 연구 방향을 함께 식별하고 공감대를 형성했습니다.

이는 “11개국이 서명한” 정부 간 협정이 아닙니다. 더 정확한 표현은 11개국에서 온 100명 이상 참여자가 함께 기여하고, 글로벌 연구 커뮤니티의 피드백을 계속 받는 **living document**입니다.

문서는 Yoshua Bengio가 주재하고 33개 정부가 지원한 International AI Safety Report를 기반으로 하며, 글로벌 AI 안전 연구에 협력 가능한 기술 우선순위를 제공하는 것을 목표로 합니다. 2026년 5월 17-19일 ISE 2026은 글로벌 전문가를 다시 모아 agentic deployments, AI misuse, 능력 향상, 안전 연구의 새 발전을 반영해 Singapore Consensus를 업데이트했습니다.

이는 여전히 싱가포르의 가장 중요한 국제 거버넌스 레버 중 하나입니다. “서명 수”가 아니라 학계, 산업계, 정부를 같은 기술 문제 목록 위에 올려놓는 능력에서 힘이 나옵니다.`,
        contentJa: `Singapore Consensus は、2025 年 Singapore Conference on AI (SCAI): International Scientific Exchange on AI Safety の成果文書です。公式口径では、2025 年 4 月 26 日に学界・産業界・政府から 100 名超、11 カ国にまたがる参加者が集まり、優先度の高い技術的 AI 安全研究方向を共同で特定し、合意を形成しました。

これは「11 カ国が署名した」政府間協定ではありません。より正確には、11 カ国からの 100 名超の参加者が共同で貢献し、グローバル研究コミュニティからの意見を継続的に受け付ける **living document** です。

文書は Yoshua Bengio が議長を務め、33 の政府が支持した International AI Safety Report を基礎に、グローバルな AI 安全研究のための協力可能な技術優先事項を示すことを目指します。2026 年 5 月 17-19 日の ISE 2026 は再び世界の専門家を集め、agentic deployments、AI misuse、能力向上、安全研究の新展開を反映して Singapore Consensus を更新しました。

これは今でもシンガポールにとって最重要の国際治理レバーの一つです。強みは「署名数」ではなく、学界、産業界、政府を同じ技術課題リストに乗せる力にあります。`,
        summaryEn:
          'A living document on global AI safety research priorities produced by SCAI: ISE 2025: 100+ participants from 11 countries, with continued updates through ISE 2026.',
        contentEn: `The Singapore Consensus is the outcome document of the 2025 Singapore Conference on AI (SCAI): International Scientific Exchange on AI Safety. The official account: on 26 April 2025, 100+ participants from academia, industry, and government, spanning 11 countries, collectively identified and demonstrated consensus around high-priority technical AI safety research areas.

It is not an intergovernmental agreement "signed by 11 countries." The more accurate description is: a **living document** contributed to by 100+ participants from 11 countries, continuing to welcome feedback from the global research community.

The document builds on the International AI Safety Report chaired by Yoshua Bengio and backed by 33 governments. Its goal is to provide collaborative technical priorities for global AI safety research. ISE 2026, held from 17 to 19 May 2026, reconvened global experts to update the Singapore Consensus in light of agentic deployments, AI misuse, capability advances, and new safety research.

This remains one of Singapore’s most important international governance levers. Its leverage is not the number of signatures; it is the ability to put academia, industry, and government onto the same technical problem list.`,
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [6],
        relatedTimelineYears: [2025, 2026],
        relatedPostSlugs: [],
      },
      {
        id: 'asean-guide-on-ai-governance-and-ethics',
        title: 'ASEAN Guide on AI Governance and Ethics',
        titleKo: 'ASEAN AI 거버넌스 및 윤리 가이드',
        titleJa: 'ASEAN AI ガバナンス・倫理ガイド',
        titleEn: 'ASEAN Guide on AI Governance and Ethics',
        date: '2024-02',
        source: 'ASEAN Digital Ministers / IMDA',
        sourceKo: 'ASEAN 디지털 장관 회의 / IMDA',
        sourceJa: 'ASEAN デジタル大臣会議 / IMDA',
        sourceOrgUrl: 'https://asean.org/',
        sourceUrl:
          'https://asean.org/wp-content/uploads/2024/02/ASEAN-Guide-on-AI-Governance-and-Ethics_beautified_201223_v2.pdf',
        summary: 'ASEAN 10 国采纳的 AI 治理指南，新加坡主导起草，IMDA 承担秘书处职能。',
        summaryKo: 'ASEAN 10개국이 채택한 AI 거버넌스 가이드, 싱가포르 주도 기초 작성, IMDA가 비서처 기능 담당.',
        summaryJa:
          'ASEAN 10 カ国が採択した AI ガバナンス・ガイドライン。シンガポール主導起草、IMDA が事務局機能を担当。',
        content: `ASEAN Guide on AI Governance and Ethics 由新加坡主导起草，2024 年 2 月由 ASEAN 数字部长会议正式通过，10 个成员国采纳。指南直接基于新加坡 Model AI Governance Framework，是新加坡治理模板的"区域化版本"。覆盖：组织治理、数据治理、AI 系统全生命周期管理、人在回路、风险分级。新加坡通过 ASEAN Working Group on AI Governance（WG-AI）持续承担秘书处职能。这是新加坡战略的关键杠杆——把本国治理标准变成区域默认标准，让外资在东南亚部署 AI 时**自然地遵循新加坡定义的边界**。延伸：2026 年 ASEAN Hanoi Declaration 进一步深化数字部长合作。`,
        contentKo: `ASEAN Guide on AI Governance and Ethics는 싱가포르가 주도적으로 기초를 마련했으며, 2024년 2월 ASEAN 디지털 장관 회의에서 공식 통과되어 10개 회원국이 채택했습니다. 가이드는 싱가포르 Model AI Governance Framework를 직접 기반으로 하며, 싱가포르 거버넌스 템플릿의 「지역화 버전」입니다. 포함 범위: 조직 거버넌스, 데이터 거버넌스, AI 시스템 전체 생명주기 관리, 루프 내 인간, 위험 분류. 싱가포르는 ASEAN Working Group on AI Governance(WG-AI)를 통해 지속적으로 비서처 기능을 담당합니다. 이는 싱가포르 전략의 핵심 레버입니다——본국 거버넌스 표준을 지역 기본 표준으로 변환하고, 외국 자본이 동남아에서 AI를 배포할 때 **자연스럽게 싱가포르가 정의한 경계를 준수하도록** 합니다. 확장: 2026년 ASEAN Hanoi Declaration은 디지털 장관 협력을 더욱 심화시킵니다.`,
        contentJa: `ASEAN Guide on AI Governance and Ethicsはシンガポール主導で起草され、2024年2月にASEAN数字大臣会議で正式に採択され、10の加盟国が採択しました。本ガイドラインはシンガポールのModel AI Governance Frameworkに直接基づく、シンガポール治理テンプレートの「地域化版」です。組織ガバナンス、データガバナンス、AIシステムの全ライフサイクル管理、人間のループへの組み込み、リスク分類をカバーしています。シンガポールはASEAN Working Group on AI Governance（WG-AI）を通じて、事務局機能を継続的に担当しています。これはシンガポール戦略の重要なレバーです。自国の治理基準を地域デフォルト基準へ転換し、外資が東南アジアでAIを展開する際に**自然とシンガポール定義の枠組みに従う**ようにするものです。拡張：2026年のASEAN Hanoi Declarationは、デジタル大臣協力をさらに深化させています。`,
        summaryEn:
          "AI governance guide adopted by all 10 ASEAN member states, drafted under Singapore's leadership, with IMDA serving as secretariat.",
        contentEn: `The ASEAN Guide on AI Governance and Ethics was drafted under Singapore's leadership and formally adopted by the ASEAN Digital Ministers Meeting in February 2024 across all 10 member states. The guide is built directly on Singapore's Model AI Governance Framework — effectively the "regionalised version" of Singapore's governance template. Coverage includes: organisational governance, data governance, AI system lifecycle management, human-in-the-loop, and risk tiering. Singapore continues to hold the secretariat function through the ASEAN Working Group on AI Governance (WG-AI). This is a key lever in Singapore's strategy — turning its domestic governance standard into the regional default, so that **foreign capital deploying AI in Southeast Asia naturally operates within boundaries defined by Singapore**. Extension: the 2026 ASEAN Hanoi Declaration further deepens digital ministerial cooperation.`,
        sourceEn: 'ASEAN Digital Ministers / IMDA',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'responsible-ai-in-the-military-domain-reaim-seoul-summit',
        title: 'REAIM Seoul Summit 2024 — 联合主办',
        titleKo: 'REAIM Seoul Summit 2024 — 공동 주최',
        titleJa: 'REAIM Seoul Summit 2024 — 共同主催',
        titleEn: 'Responsible AI in the Military Domain (REAIM) Seoul Summit',
        date: '2024-09',
        source: '外交部 (MFA) / 国防部 (MINDEF)',
        sourceKo: '외교부(MFA) / 국방부(MINDEF)',
        sourceJa: '外交・通商省 (MFA) / 国防部 (MINDEF)',
        sourceOrgUrl: 'https://www.mfa.gov.sg/',
        sourceUrl: 'https://www.mindef.gov.sg/news-and-events/latest-releases/10sep24_nr/',
        summary: 'REAIM Seoul Summit 五个联合主办国之一，把"军事 AI 责任使用"推向国际议程。',
        summaryKo: 'REAIM Seoul Summit 5개 공동 주최국 중 하나, 「군사 AI 책임감 있는 사용」을 국제 의제로 추진.',
        summaryJa:
          'REAIM Seoul Summit の五つの共同主催国の一つ。「軍事 AI の責任ある使用」を国際議題に押し上げています。',
        content: `Responsible AI in the Military Domain (REAIM) Seoul Summit 2024 是 REAIM 系列的第二届，新加坡作为五个联合主办国之一（与韩国、荷兰、英国、肯尼亚），把军事 AI 的责任使用推到国际议程。Summit 通过《Blueprint for Action》——首个把军事 AI 治理写成可操作步骤的多边文件，覆盖：人在指挥链中的位置、自主武器边界、AI 决策的国际人道法适用、跨国信任建立机制。新加坡同时主持 REAIM Asia Regional Consultations，把对话扩到东南亚。这是新加坡用"治理中立区"定位介入最敏感议题（军事 AI）的标志性动作——不靠武力，靠规则起草权。`,
        contentKo: `Responsible AI in the Military Domain (REAIM) Seoul Summit 2024는 REAIM 시리즈의 두 번째 회의로, 싱가포르는 5개 공동 주최국 중 하나입니다(한국, 네덜란드, 영국, 케냐와 함께). 군사 AI의 책임감 있는 사용을 국제 의제로 추진합니다. Summit은 《Blueprint for Action》을 통과시켰습니다——군사 AI 거버넌스를 실행 가능한 단계로 작성한 첫 번째 다자간 문서로, 포함 범위: 지휘 체인의 인간 위치, 자율 무기 경계, AI 결정의 국제 인도법 적용, 국제간 신뢰 구축 메커니즘. 싱가포르는 동시에 REAIM Asia Regional Consultations을 주재하여 대화를 동남아로 확대합니다. 이는 싱가포르가 「거버넌스 중립 지역」으로의 위치 결정을 통해 가장 민감한 의제(군사 AI)에 개입하는 상징적 동작입니다——무력에 의존하지 않고, 규칙 기초 작성권에 의존합니다.`,
        contentJa: `Responsible AI in the Military Domain（REAIM）Seoul Summit 2024はREAIMシリーズの第2回で、シンガポールは5つの共同主催国の1つ（韓国、オランダ、英国、ケニア）として、軍事AIの責任ある使用を国際議題に押し上げました。サミットは『行動のためのブループリント』を採択しました。これは軍事AI治理を実行可能なステップに落とし込んだ初の多国間文書です。指揮チェーン内での人間の役割、自律武器の境界線、AI意思決定への国際人道法の適用、国家間信頼構築メカニズムをカバーしています。シンガポールは同時にREAIM Asia Regional Consultationsを主催し、対話を東南アジアに拡大しています。これはシンガポールが「治理中立区」というポジショニングを活用して、最も敏感な議題である軍事AIに介入する象徴的な動作です。武力ではなく、ルール起草権に頼るものです。`,
        summaryEn:
          'One of five co-hosts of the REAIM Seoul Summit, putting responsible military AI on the international agenda.',
        contentEn: `The Responsible AI in the Military Domain (REAIM) Seoul Summit 2024 is the second edition in the REAIM series. As one of five co-hosts (alongside South Korea, the Netherlands, the UK, and Kenya), Singapore helped place the responsible use of military AI on the international agenda. The Summit adopted the Blueprint for Action — the first multilateral document to translate military AI governance into operational steps, covering: the position of humans in the command chain, the boundaries of autonomous weapons, the application of international humanitarian law to AI decision-making, and cross-border trust-building mechanisms. Singapore also chairs the REAIM Asia Regional Consultations, extending the dialogue across Southeast Asia. This is a flagship move in Singapore's "governance neutral zone" positioning, intervening on the most sensitive AI topic (military AI) — not through hard power, but through rule-drafting authority.`,
        sourceEn: 'Ministry of Foreign Affairs (MFA) / Ministry of Defence (MINDEF)',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
      {
        id: 'international-scientific-exchange-on-ai-safety',
        title: 'International Scientific Exchange on AI Safety (ISE)',
        titleKo: 'International Scientific Exchange on AI Safety (ISE)',
        titleJa: 'International Scientific Exchange on AI Safety (ISE)',
        titleEn: 'International Scientific Exchange on AI Safety',
        date: '2025-04',
        source: 'IMDA / Singapore AI Safety Institute',
        sourceKo: 'IMDA / Singapore AI Safety Institute',
        sourceJa: 'IMDA / Singapore AI Safety Institute',
        sourceOrgUrl: 'https://www.imda.gov.sg/',
        sourceUrl: 'https://www.imda.gov.sg/activities/activities-catalogue/international-scientific-exchange',
        summary: '新加坡主办的 AI 安全科学交流机制：2025 年产出 Singapore Consensus，2026 年 5 月继续更新研究优先级。',
        summaryKo:
          '싱가포르가 주최하는 AI 안전 과학 교류 메커니즘: 2025년에 Singapore Consensus를 만들었고, 2026년 5월 연구 우선순위를 계속 업데이트했습니다.',
        summaryJa:
          'シンガポール主催の AI 安全科学交流メカニズム。2025 年に Singapore Consensus を生み、2026 年 5 月に研究優先事項を継続更新。',
        content: `International Scientific Exchange on AI Safety (ISE) 是新加坡用科学会议方式推动 AI 安全国际合作的机制，由 IMDA / Singapore AI Safety Institute 牵头。

2025 年 ISE 在 Singapore Conference on AI (SCAI) 期间召开，关键成果是 **Singapore Consensus on Global AI Safety Research Priorities**。2026 年 5 月 17-19 日，ISE 2026 在新加坡再次召开，目标是根据 2026 International AI Safety Report、agent deployments、AI misuse 与能力提升的新情况，更新 Singapore Consensus、识别新研究优先级、推进全球协作。

ISE 的关键设计是“科学家 + 政府 + 产业”混合，而不是纯外交峰会。新加坡借此把高度政治化的 AI 安全议题转成技术研究议程：先形成可验证、可协作的研究问题，再让治理框架和国际机制接住。`,
        contentKo: `International Scientific Exchange on AI Safety (ISE)는 싱가포르가 과학 회의 형식으로 AI 안전 국제 협력을 추진하는 메커니즘이며, IMDA / Singapore AI Safety Institute가 주도합니다.

2025년 ISE는 Singapore Conference on AI (SCAI) 기간에 열렸고, 핵심 성과는 **Singapore Consensus on Global AI Safety Research Priorities**였습니다. 2026년 5월 17-19일 ISE 2026이 싱가포르에서 다시 열렸으며, 2026 International AI Safety Report, agent deployments, AI misuse, 능력 향상 등 새 상황을 반영해 Singapore Consensus를 업데이트하고 새 연구 우선순위를 식별하며 글로벌 협력을 진전시키는 것을 목표로 했습니다.

ISE의 핵심 설계는 “과학자 + 정부 + 산업”의 혼합이며, 순수 외교 정상회의가 아닙니다. 싱가포르는 이를 통해 고도로 정치화된 AI 안전 의제를 기술 연구 의제로 전환합니다. 먼저 검증 가능하고 협력 가능한 연구 문제를 만든 뒤, 거버넌스 프레임워크와 국제 메커니즘이 이를 이어받게 합니다.`,
        contentJa: `International Scientific Exchange on AI Safety (ISE) は、シンガポールが科学会議の形で AI 安全の国際協力を進める仕組みで、IMDA / Singapore AI Safety Institute が主導します。

2025 年 ISE は Singapore Conference on AI (SCAI) の期間中に開催され、主要成果は **Singapore Consensus on Global AI Safety Research Priorities** でした。2026 年 5 月 17-19 日、ISE 2026 がシンガポールで再び開催され、2026 International AI Safety Report、agent deployments、AI misuse、能力向上などの新状況を踏まえ、Singapore Consensus を更新し、新しい研究優先事項を特定し、グローバル協力を進めることを目的としました。

ISE の設計の要点は「科学者 + 政府 + 産業」の混合であり、純粋な外交サミットではありません。シンガポールはこれにより、政治性の高い AI 安全議題を技術研究アジェンダへ変換します。まず検証可能で協力可能な研究問題を作り、その後に治理フレームワークと国際メカニズムが受け止める形です。`,
        summaryEn:
          'Singapore-hosted scientific exchange mechanism for AI safety: it produced the Singapore Consensus in 2025 and reconvened in May 2026 to update research priorities.',
        contentEn: `The International Scientific Exchange on AI Safety (ISE) is Singapore’s mechanism for advancing international AI safety cooperation through a scientific-convening format, led by IMDA / the Singapore AI Safety Institute.

ISE 2025 was held as part of the Singapore Conference on AI (SCAI), with the **Singapore Consensus on Global AI Safety Research Priorities** as its key outcome. ISE 2026, held in Singapore from 17 to 19 May 2026, reconvened experts to update the Singapore Consensus, identify new research priorities, and advance global collaboration in light of the 2026 International AI Safety Report, agent deployments, AI misuse, and capability advances.

The design is deliberately a mix of scientists, government, and industry rather than a purely diplomatic summit. Singapore uses ISE to turn a highly political AI safety topic into a technical research agenda: first define verifiable, collaborative research problems, then let governance frameworks and international mechanisms carry them forward.`,
        sourceEn: 'IMDA / Singapore AI Safety Institute',
        ministry: undefined,
        authorPersonIds: [],
        relatedDebateIds: [],
        relatedLeverNumbers: [],
        relatedTimelineYears: [],
        relatedPostSlugs: [],
      },
    ],
  },
];

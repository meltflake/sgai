// src/data/signals.ts
// ────────────────────────────────────────────────────────────────────────
// Signals（信号）: the week's noteworthy Singapore AI news, one line of
// judgment each. Written by the weekly auto-PR pipeline
// scripts/refresh/signals/run.ts; spec in docs/signals/spec.md.
//
// Rules (CLAUDE.md): zh / en / ja / ko in the same commit (#5); sourceUrl
// is HTTP-checked before it is written (#6); every record has addedAt (#7).
// New records go at the TOP of the array. `topicIds` come from
// src/data/topics.ts and `related` ids must resolve — scripts/verify-graph.ts
// checks both.
//
// Links: the /signals/ list page links each title to `sourceUrl`. Every
// other surface (updates feed, topic hubs) links to /signals/#<id>.

export type SignalRelatedKind = 'policy' | 'person' | 'ecosystem' | 'startup' | 'debate' | 'video';

export interface SignalRelated {
  kind: SignalRelatedKind;
  /** Record id (policy / person / debate / video) or page slug (ecosystem / startup). */
  id: string;
}

export interface Signal {
  /** 'sig-YYYYMMDD-<slug>', stable. */
  id: string;
  /** Event / publication date, YYYY-MM-DD. */
  date: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  /** One sentence: why this matters for Singapore's AI strategy. */
  whyItMatters: string;
  whyItMattersEn: string;
  whyItMattersJa: string;
  whyItMattersKo: string;
  sourceUrl: string;
  /** Publisher, original English name (no CJK, no sibling fields). */
  sourceName: string;
  /** 1 to 3 ids from src/data/topics.ts. */
  topicIds: string[];
  related?: SignalRelated[];
  addedAt: string;
}

export const signals: Signal[] = [
  {
    id: 'sig-20261120-mistral-singapore-apac-headquarters',
    date: '2026-11-20',
    title: 'Mistral 新加坡设亚太总部及科学枢纽',
    titleEn: 'Mistral Singapore launches Asia-Pacific headquarters and science hub',
    titleJa: 'Mistralシンガポール、アジア太平洋本社と科学ハブを設置',
    titleKo: 'Mistral 싱가포르에 아태 본부 및 과학 허브 설립',
    whyItMatters:
      'DSO、HTX 的合作经验已塑造 Mistral 全球主权 AI 产品设计，2027 年前 200 人的团队规模表明新加坡将成为区域模型研发源头',
    whyItMattersEn:
      "DSO and HTX's collaborative experience has shaped Mistral's global sovereign AI product design. A team size of 200 people before 2027 indicates that Singapore will become the regional source of model research and development.",
    whyItMattersJa:
      'DSO、HTXとの協力経験がMistralのグローバル・ソブリンAI製品設計をすでに形成しており、2027年までに200人規模のチームに達することはシンガポールが地域AIモデル研究開発の発祥地になることを示しています',
    whyItMattersKo:
      'DSO와 HTX의 협력 경험이 Mistral의 글로벌 주권 AI 제품 설계를 형성했으며, 2027년까지 200명 규모의 팀은 싱가포르가 지역 모델 연구개발의 원천이 될 것임을 나타냅니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/mistral-opens-singapore-office-as-an-extended-science-hub-for-sovereign-ai-in-asia-pacific',
    sourceName: 'EDB',
    topicIds: ['national-strategy', 'infrastructure-research', 'public-sector'],
    addedAt: '2026-11-21',
  },
  {
    id: 'sig-20261120-dayone-data-centre-ipo-pause',
    date: '2026-11-20',
    title: '新加坡 DayOne 数据中心暂缓美国 IPO 计划',
    titleEn: 'Singapore DayOne data centre postpones US IPO plans',
    titleJa: 'シンガポールのDayOneデータセンター、米国IPO計画を延期',
    titleKo: '싱가포르 DayOne 데이터센터, 미국 IPO 계획 연기',
    whyItMatters:
      'DayOne 暂缓规模达 50 亿美元的美国 IPO，可能等到 2027 年再重启，说明新加坡数据中心叙事过度绑定 ByteDance 这一家客户，经不起 AI 估值降温',
    whyItMattersEn:
      "DayOne is postponing its US$50 billion US IPO and may not resume until 2027, indicating that Singapore's data centre narrative is overly dependent on ByteDance as a single customer and cannot withstand a decline in AI valuations.",
    whyItMattersJa:
      'DayOneは規模50億米ドルの米国IPOを延期しており、2027年に再開する可能性があります。これはシンガポールのデータセンター・ナラティブがByteDanceという単一顧客への過度な依存を示しており、AI企業評価の低下に耐えられないことを明らかにしています',
    whyItMattersKo:
      'DayOne은 규모 50억 달러의 미국 IPO를 연기했으며, 2027년이 되어서야 다시 시작될 가능성이 있습니다. 이는 싱가포르 데이터센터 내러티브가 ByteDance라는 단 하나의 고객에 과도하게 종속되어 있으며 AI 밸류에이션 냉각을 견디지 못함을 나타냅니다.',
    sourceUrl:
      'https://www.businesstimes.com.sg/companies-markets/singapore-based-dayone-said-pause-us-ipo-plans-data-centre-market-concerns',
    sourceName: 'The Business Times',
    topicIds: ['infrastructure-research', 'startups-investment', 'economy-industry'],
    addedAt: '2026-11-21',
  },
  {
    id: 'sig-20261117-us-ai-chip-export-curbs-asean',
    date: '2026-11-17',
    title: '美国新规限制新加坡获取 AI 芯片出口',
    titleEn: 'US rule restricts Singapore AI chip access',
    titleJa: '米国新規則がシンガポールへのAIチップ輸出を制限',
    titleKo: '미국 신규 규정, 싱가포르의 AI 칩 수출 제한',
    whyItMatters:
      '美芯片出口管制将新加坡列为高风险转运地，需逐案申请美国商务部许可，叠加 Megaspeed 芯片外流疑云，新加坡作为中立 AI 枢纽的信任首次被公开质疑',
    whyItMattersEn:
      "US chip export controls designate Singapore as a high-risk transshipment location, requiring case-by-case applications for US Commerce Department approval. Coupled with allegations of Megaspeed chip outflows, Singapore's credibility as a neutral AI hub is openly questioned for the first time.",
    whyItMattersJa:
      '米国のチップ輸出管制がシンガポールを高リスク転送地に指定し、米国商務省の許可を案件ごとに申請する必要があります。これにMegaspeedのチップ流出疑惑が重なり、中立的なAIハブとしてのシンガポールの信頼が初めて公開で質疑されています。',
    whyItMattersKo:
      '미국 반도체 수출 규제가 싱가포르를 고위험 환적지로 지정하여 사례별 미국 상무부 허가 신청이 필요해지고, 메가스피드 반도체 유출 의혹이 더해지면서 싱가포르의 중립적 AI 허브로서의 신뢰가 처음으로 공개적으로 의문이 제기되었습니다.',
    sourceUrl: 'https://www.businesstimes.com.sg/international/asean/us-curb-chinese-access-ai-chips-trump-heads-asia',
    sourceName: 'The Business Times',
    topicIds: ['national-security', 'governance-regulation', 'infrastructure-research'],
    addedAt: '2026-11-20',
  },
  {
    id: 'sig-20261113-megaspeed-speedmatrix-ai-chip-diversion',
    date: '2026-11-13',
    title: '马来西亚调查 Megaspeed 子公司芯片转运嫌疑',
    titleEn: 'Malaysia investigates Megaspeed subsidiary chip transshipment',
    titleJa: 'マレーシア、Megaspeed子会社のチップ転送疑いを調査',
    titleKo: '말레이시아, Megaspeed 자회사 칩 환적 의혹 조사',
    whyItMatters: '总部在新加坡的 Megaspeed 卷入芯片转运调查，暴露新加坡作为 AI 算力枢纽在出口管制上的监管缺口',
    whyItMattersEn:
      "Megaspeed, headquartered in Singapore, is embroiled in a chip transshipment investigation, exposing Singapore's regulatory gaps in export controls as an AI computing hub.",
    whyItMattersJa:
      'シンガポール本社のMegaspeedがチップ転送調査に巻き込まれ、AIコンピューティングハブとしてのシンガポールの輸出管制における規制上の隙間が暴露されています。',
    whyItMattersKo:
      '싱가포르에 본사를 둔 메가스피드가 반도체 환적 조사에 연루되면서 싱가포르의 AI 컴퓨팅 허브로서의 수출 규제상 감시 공백을 드러냈습니다.',
    sourceUrl:
      'https://www.channelnewsasia.com/asia/malaysia-probe-megaspeed-speedmatrix-ai-alice-huang-nvidia-6548491',
    sourceName: 'CNA',
    topicIds: ['national-security', 'governance-regulation', 'infrastructure-research'],
    addedAt: '2026-11-20',
  },
  {
    id: 'sig-20261118-uob-astar-meralion-mou',
    date: '2026-11-18',
    title: '大华银行部署 A*STAR 多语言 AI 客服方案',
    titleEn: 'UOB deploys A*STAR multilingual AI customer service solution',
    titleJa: 'OCBC銀行、A*STAR多言語AI顧客サービスソリューション展開へ',
    titleKo: 'UOB, A*STAR 다국어 AI 고객 서비스 솔루션 배포',
    whyItMatters:
      '大华银行成为首家试用 MERaLiON 的银行，让 A*STAR 多语言 AI 从实验室走进 ASEAN 五个市场真实客服场景，检验能否商业化',
    whyItMattersEn:
      "UOB becomes the first bank to trial MERaLiON, bringing A*STAR's multilingual AI from the laboratory into real customer-service scenarios across five ASEAN markets to test commercialization viability.",
    whyItMattersJa:
      'UOB が MERaLiON を試用する最初の銀行となり、A*STAR の多言語 AI が実験室から ASEAN 五市場の実際の顧客サービスシーンへ進み、商業化の可能性を検証します。',
    whyItMattersKo:
      '다화은행이 MERaLiON을 시범 운영하는 첫 은행이 되어, A*STAR의 다국어 AI를 실험실에서 ASEAN 5개 시장의 실제 고객 서비스 환경으로 옮기며, 상용화 가능성을 검증합니다',
    sourceUrl:
      'https://www.a-star.edu.sg/iaic/news/press-release/uob-deploy-multilingual-ai-powered-solution-for-customer-engagement',
    sourceName: 'A*STAR',
    topicIds: ['finance', 'economy-industry'],
    related: [{ kind: 'ecosystem', id: 'a-star' }],
    addedAt: '2026-11-19',
  },
  {
    id: 'sig-20261118-astar-iaic-ffi-finance-mou',
    date: '2026-11-18',
    title: '大华渣打试点 A*STAR 多语言 AI 金融模型',
    titleEn: 'UOB, Standard Chartered pilot A*STAR multilingual AI financial model',
    titleJa: 'OCBC・スタンダード・チャータード、A*STAR多言語AI金融モデルをパイロット実施へ',
    titleKo: 'UOB-Standard Chartered, A*STAR 다국어 AI 금융 모델 시범 운영',
    whyItMatters:
      'A*STAR IAIC 与 MAS 旗下 FFI 签 MoU，把自研模型 MERaLiON 交给 UOB、渣打做真实业务检验，新加坡 AI 研究第一次要接受金融监管级压力测试',
    whyItMattersEn:
      "A*STAR's IAIC and FFI under MAS sign an MoU, handing the proprietary MERaLiON model to UOB and Standard Chartered for real business verification—Singapore's AI research facing banking-regulator-level stress testing for the first time.",
    whyItMattersJa:
      'A*STAR IAIC が MAS 傘下の FFI と MoU に署名し、自社開発の MERaLiON モデルを UOB と Standard Chartered に提供して実業務検証を行い、シンガポール AI 研究が初めて金融監督レベルのストレステストを受けます。',
    whyItMattersKo:
      'A*STAR IAIC가 MAS 산하 FFI와 MoU를 체결하여, 자체 개발 모델 MERaLiON을 UOB, Standard Chartered에 넘겨 실제 업무 검증을 추진하며, 싱가포르 AI 연구가 금융 감독급 스트레스 테스트를 처음 받게 됩니다',
    sourceUrl: 'https://www.a-star.edu.sg/iaic/news/press-release/iaic-ffi-bridge-ai-research',
    sourceName: 'A*STAR',
    topicIds: ['finance', 'infrastructure-research', 'economy-industry'],
    related: [{ kind: 'ecosystem', id: 'a-star' }],
    addedAt: '2026-11-19',
  },
  {
    id: 'sig-20261118-singapore-facilitates-us-chip-export-che',
    date: '2026-11-18',
    title: '黄循财：新加坡愿协助美国核查先进芯片流向',
    titleEn: 'Lawrence Wong: Singapore willing to assist US in verifying advanced chip flows',
    titleJa: 'ローレンス・ウォン、シンガポール、米国の先進チップ流向検証を支援へ',
    titleKo: 'Lawrence Wong: 싱가포르, 미국 첨단 칩 흐름 확인 협력 의향',
    whyItMatters:
      '黄循财 11 月 17 日松口配合美方核查芯片流向，相当于承认清关芯片未必留在本地的漏洞，新加坡中立转运枢纽的定位将直面美方问责',
    whyItMattersEn:
      "Lawrence Wong's November 17 acknowledgment of cooperation with US verification of chip flows amounts to admitting the loophole that customs-cleared chips do not necessarily remain locally—Singapore's positioning as a neutral transshipment hub will directly face US accountability.",
    whyItMattersJa:
      'ローレンス・ウォン が 11 月 17 日にチップ流向に関する米国側の調査に協力する意向を表明し、これは通関後のチップが必ずしもシンガポール国内に留まるわけではないという抜け穴を認めたに等しく、シンガポール中立転運ハブとしての位置付けは米国側の問責に直面することになります。',
    whyItMattersKo:
      'Lawrence Wong이 11월 17일 미국의 칩 흐름 확인에 협력하겠다고 밝혔으며, 이는 통관 칩이 국내에 반드시 남지 않는다는 허점을 인정한 것과 다름없으며, 싱가포르 중립 중계 허브로서의 지위는 미국의 문책에 직면할 것입니다',
    sourceUrl: 'https://www.channelnewsasia.com/singapore/ai-chips-us-lawrence-wong-donald-trump-6560086',
    sourceName: 'CNA',
    topicIds: ['national-security', 'international', 'infrastructure-research'],
    addedAt: '2026-11-19',
  },
  {
    id: 'sig-20261116-us-advanced-semiconductor-export-control',
    date: '2026-11-16',
    title: '美国半导体出口管制新规 新加坡日本联合回应',
    titleEn: 'New US semiconductor export control rules; Singapore, Japan respond jointly',
    titleJa: '米国の半導体輸出管制新規則 シンガポール・日本が共同対応',
    titleKo: '미국 반도체 수출 규제 신규 정책, 싱가포르·일본 공동 대응',
    whyItMatters: '美国将新加坡列入许可清单意味着其转口信任地位首次受挑战 MDDI 需在合规与产业吸引力间重新找平衡',
    whyItMattersEn:
      'US places Singapore on restricted list, first-time challenge to trusted transshipment status; MDDI must rebalance between compliance and industry attractiveness',
    whyItMattersJa:
      '米国がシンガポールを許可リストに追加したことは、同国の転積信頼地位が初めて挑戦を受けることを意味しており、MDDI はコンプライアンスと産業吸引力の間でバランスを改めて見出す必要があります。',
    whyItMattersKo:
      '미국이 싱가포르를 규제 대상 목록에 포함시킨 것은 싱가포르의 환적 신뢰 지위가 처음으로 도전을 받는다는 의미입니다. MDDI는 규정 준수와 산업 매력 사이에서 균형을 다시 찾아야 합니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-meti-joint-media-statement-on-us-interim-final-rule-on-addressing-remote-access-to-advanced-semiconductors/',
    sourceName: 'MDDI',
    topicIds: ['national-security', 'governance-regulation', 'international'],
    addedAt: '2026-11-18',
  },
  {
    id: 'sig-20261117-us-ai-chip-export-licensing-rule-sea',
    date: '2026-11-17',
    title: '美国收紧对华 AI 芯片管制，新加坡受影响',
    titleEn: 'US tightens AI chip controls on China; Singapore affected',
    titleJa: '米国、対中 AI チップ管制強化 シンガポール受ける影響',
    titleKo: '미국 중국 대상 AI 칩 규제 강화, 싱가포르 영향',
    whyItMatters:
      '11 月 17 日，美国将新加坡与马来西亚、印尼、泰国一并纳入芯片管制收紧范围，新加坡数据中心枢纽地位恐成对华转运缺口',
    whyItMattersEn:
      "On 17 November, US tightens chip controls to include Singapore, Malaysia, Indonesia, and Thailand; Singapore's data centre hub risks becoming a transshipment loophole for China",
    whyItMattersJa:
      '11月17日、米国がシンガポールをマレーシア、インドネシア、タイとともにチップ管制の厳格化対象に加え、シンガポールのデータセンターハブ地位が対中転運の抜け穴となるリスクが懸念されています。',
    whyItMattersKo:
      '11월 17일, 미국이 싱가포르를 말레이시아, 인도네시아, 태국과 함께 칩 통제 강화 범위에 포함시켰고, 싱가포르의 데이터센터 허브 지위가 대중국 환적의 허점이 될 수 있습니다.',
    sourceUrl: 'https://www.channelnewsasia.com/asia/us-ai-chips-china-southeast-asia-data-centres-6558256',
    sourceName: 'CNA',
    topicIds: ['national-security', 'infrastructure-research', 'international'],
    addedAt: '2026-11-18',
  },
  {
    id: 'sig-20261117-us-ai-chip-export-license-rule-asia',
    date: '2026-11-17',
    title: '美国芯片新规施压东南亚企业选边站',
    titleEn: 'US chip rules pressure Southeast Asian companies to choose sides',
    titleJa: '米国チップ新規則が東南アジア企業に圧力、立場選択を迫る',
    titleKo: '미국 칩 신규제, 동남아 기업 선택 압박',
    whyItMatters: '美国芯片新规令新加坡十余年不选边策略首次承压，APAC Advisors 直指平衡术难以为继',
    whyItMattersEn:
      "US new chip rules pressure Singapore's decade-long non-alignment strategy for first time; APAC Advisors states balancing act cannot be sustained",
    whyItMattersJa:
      '米国の新チップ規制により、シンガポールの10年以上にわたるどちらにも与しない政策が初めて圧力を受け、APAC Advisors はバランス戦略の継続が困難だと指摘しています。',
    whyItMattersKo:
      '미국의 새로운 칩 규제로 싱가포르의 10년 이상 중립 전략이 처음으로 압박을 받고 있으며, APAC Advisors는 균형 전략이 지속 불가능함을 지적합니다.',
    sourceUrl:
      'https://www.channelnewsasia.com/commentary/us-china-chips-singapore-malaysia-licence-nvidia-rules-snap-insight-6558086',
    sourceName: 'CNA',
    topicIds: ['national-security', 'governance-regulation', 'infrastructure-research'],
    addedAt: '2026-11-18',
  },
  {
    id: 'sig-20261111-dassault-systemes-asean-virtual-twin-lab',
    date: '2026-11-11',
    title: '达索系统落户新加坡设东盟工业 AI 孪生实验室',
    titleEn: 'Dassault Systèmes establishes ASEAN industrial AI digital twin lab in Singapore',
    titleJa: 'ダッソー・システムズがシンガポールで ASEAN 産業 AI ツイン実験室開設',
    titleKo: '다쏘시스템, 싱가포르에 ASEAN 산업AI 디지털트윈 실험실 개설',
    whyItMatters:
      '达索借 EDB 协议落户,30 余个岗位换来覆盖新马泰印菲越的区域枢纽地位,印证新加坡引资重心已转向东盟协调节点而非本地用工规模',
    whyItMattersEn:
      "Dassault establishes operations via EDB agreement, gaining 30-plus positions to secure regional hub status across Singapore, Malaysia, Thailand, India, Philippines, Vietnam; this confirms Singapore's investment focus has shifted from local employment scale to ASEAN coordination hub",
    whyItMattersJa:
      'ダッソーは EDB 協議により落地し、30を超える職位と引き換えにシンガポール、マレーシア、タイ、インドネシア、フィリピン、ベトナムを覆う地域ハブ地位を獲得し、シンガポールの資本誘致の重点が ASEAN 協調ノードへと転向し、ローカル雇用規模ではなくなったことを示しています。',
    whyItMattersKo:
      '다쏘(Dassault)가 EDB 협약을 통해 싱가포르에 정착하면서, 30여 개의 일자리로 싱가포르, 말레이시아, 태국, 인도네시아, 필리핀, 베트남을 아우르는 지역 허브 지위를 얻었으며, 이는 싱가포르의 외자 유치 중심이 현지 일자리 창출이 아닌 ASEAN 조율 거점으로 이미 옮겨갔음을 입증합니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/dassault-systemes-to-set-up-asean-industrial-ai-virtual-twin-lab-in-singapore',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    addedAt: '2026-11-18',
  },
  {
    id: 'sig-20261104-mddi-ai-incident-reporting-framework',
    date: '2026-11-04',
    title: 'IMDA 与 CSA 研究加强 AI 事故报告',
    titleEn: 'IMDA and CSA study stronger AI incident reporting',
    titleJa: 'IMDAとCSAがAI事故報告の強化を検討',
    titleKo: 'IMDA와 CSA, AI 사고 보고 강화 검토',
    whyItMatters: '部分 AI 事故可能未达现行报告门槛。两机构正研究额外报告或信息共享安排。',
    whyItMattersEn:
      'Some AI incidents may fall below existing reporting thresholds. The agencies are studying additional reporting or information sharing.',
    whyItMattersJa:
      '一部のAI事故は現行の報告基準に達しない可能性があります。両機関は追加報告や情報共有を検討しています。',
    whyItMattersKo:
      '일부 AI 사고는 현행 보고 기준에 미달할 수 있습니다. 두 기관은 추가 보고나 정보 공유를 검토하고 있습니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-s-response-to-pq-on-reporting-of-serious-and-near-miss-incidents-involving-autonomous-ai-systems/',
    sourceName: 'MDDI',
    topicIds: ['governance-regulation', 'safety-ethics', 'national-security'],
    addedAt: '2026-11-11',
  },
  {
    id: 'sig-20261103-ipos-gemgpt-openai-trademark-ruling',
    date: '2026-11-03',
    title: 'IPOS 裁定 OpenAI 商标异议败诉 GemGPT 过关',
    titleEn: 'IPOS rules against OpenAI in trademark opposition, GemGPT advances',
    titleJa: 'IPOS OpenAI商標異議敗訴 GemGPT承認',
    titleKo: 'IPOS, OpenAI 상표이의 기각…GemGPT 통과',
    whyItMatters: 'IPOS 认定 GPT 并非 OpenAI 专属用语，为新加坡 AI 初创保留通用技术词的命名空间',
    whyItMattersEn:
      "IPOS ruled that GPT is not OpenAI's exclusive term, preserving the namespace for common technical terminology used by Singapore's AI startups.",
    whyItMattersJa:
      'IPOSはGPTがOpenAIの専属用語ではないと認定し、シンガポールのAIスタートアップのための汎用技術用語の命名空間を保護しています。',
    whyItMattersKo:
      '아이포스가 GPT는 오픈에이아이의 전용 용어가 아니라고 판정하여, 싱가포르 AI 초기업들을 위해 일반 기술 용어의 명명 공간을 보존했습니다.',
    sourceUrl:
      'https://www.businesstimes.com.sg/companies-markets/chatgpt-creator-openai-loses-bid-block-singapore-startups-gemgpt-trademark',
    sourceName: 'The Business Times',
    topicIds: ['governance-regulation', 'startups-investment'],
    related: [{ kind: 'ecosystem', id: 'openai' }],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-google-research-hub-singapore-health-ai',
    date: '2026-10-30',
    title: '谷歌在新加坡设研究中心深化医疗 AI 合作',
    titleEn: 'Google establishes Singapore research center to deepen healthcare AI collaboration',
    titleJa: 'グーグル シンガポール医療AI研究センター設立',
    titleKo: '구글, 싱가포르에 의료AI 연구센터 설립',
    whyItMatters: '这是 5 月那份国家级 AI 伙伴关系首次落地为实体机构，新加坡从政策文本升级为谷歌全球研究版图上的节点',
    whyItMattersEn:
      "This marks the first time the May national-level AI partnership materialized as a concrete institution. Singapore graduated from policy text to become a node on Google's global research map.",
    whyItMattersJa:
      'これは5月の国家級AIパートナーシップが初めて実体機関として確立され、シンガポールが政策文書からGoogleのグローバル研究版図上のノードへと昇格した事例です。',
    whyItMattersKo:
      '이는 5월의 그 국가급 AI 파트너십이 처음으로 실체 기관으로 구현된 것이며, 싱가포르는 정책 텍스트에서 구글의 글로벌 연구 지형도상의 노드로 격상되었습니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/google-and-singapore-deepen-partnership-to-advance-frontier-ai-for-healthcare-and-scientific-discovery',
    sourceName: 'EDB',
    topicIds: ['healthcare', 'infrastructure-research', 'national-strategy'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-astar-marvel-ai-materials-initiative',
    date: '2026-10-30',
    title: 'A*STAR 推出 MARVEL-AI 加速先进材料研发',
    titleEn: 'A*STAR launches MARVEL-AI to accelerate advanced materials research',
    titleJa: 'A*STAR MARVEL-AI先進材料研究開発加速',
    titleKo: 'A*STAR, MARVEL-AI 출시 첨단소재 연구개발 가속',
    whyItMatters:
      'MARVEL-AI 把 A*STAR 的研发与 METI、EDB、EnterpriseSG 的产业化职能整合进同一闭环,意在消除材料从实验室走向产业化的交接断点',
    whyItMattersEn:
      "MARVEL-AI integrates A*STAR's R&D with METI, EDB, and EnterpriseSG's commercialization functions into a single closed loop, aiming to eliminate the handoff gap between laboratory and commercialization stages.",
    whyItMattersJa:
      'MARVEL-AIはA*STARの研究開発とMETI、EDB、EnterpriseSGの産業化機能を同一のクローズドループに統合し、材料が実験室から産業化に向かう際の引き継ぎギャップを排除することを意図しています。',
    whyItMattersKo:
      'MARVEL-AI는 A*STAR의 연구개발 기능과 METI, EDB, EnterpriseSG의 산업화 기능을 동일한 폐쇄 루프로 통합하여, 재료가 실험실에서 산업화로 전환되는 과정의 인계 단절점을 제거하려는 의도입니다.',
    sourceUrl:
      'https://www.a-star.edu.sg/news/press-releases/marvel-ai-accelerating-advanced-materials-innovation-from-discovery-to-deployment',
    sourceName: 'A*STAR',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261030-megaspeed-nvidia-china-spy-probe',
    date: '2026-10-30',
    title: '黄仁勋回应新加坡芯片商谍案指控',
    titleEn: 'Jensen Huang responds to Singapore chipmaker espionage case accusations',
    titleJa: 'ファン・ジェンシュン シンガポール半導体スパイ事件指控に応答',
    titleKo: '황런훈, 싱가포르 반도체 첩보 혐의 대응',
    whyItMatters: '黄仁勋亲自为 Megaspeed International 背书，暴露新加坡芯片中转角色已卷入美国出口管制审查前线',
    whyItMattersEn:
      "Jensen Huang's personal endorsement of Megaspeed International exposes that Singapore's semiconductor transhipment role has been drawn into the frontline of US export-control scrutiny.",
    whyItMattersJa:
      'ジェンセン・ファンはMegaspeed Internationalを個人的に支持し、シンガポールのチップトランシップ役割が既に米国の輸出管制審査の最前線に巻き込まれていることを暴露しています。',
    whyItMattersKo:
      '젠슨 황이 메가스피드 인터내셔널을 직접 배서함으로써, 싱가포르의 반도체 중전 역할이 이미 미국 수출 관제 심사 최전선에 휘말렸음을 드러냈습니다.',
    sourceUrl: 'https://www.channelnewsasia.com/east-asia/nvidia-jensen-huang-megaspeed-international-6505791',
    sourceName: 'CNA',
    topicIds: ['national-security', 'international', 'economy-industry'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261029-safran-ai-centre-singapore-edb',
    date: '2026-10-29',
    title: '赛峰与新加坡经发局签约设 AI 卓越中心',
    titleEn: 'Safran signs agreement with Singapore EDB to establish AI center of excellence',
    titleJa: 'サフラン シンガポール経済開発庁 AI卓越センター設立契約',
    titleKo: '사프랑, 싱가포르경제개발청과 AI 우수센터 설립 협약',
    whyItMatters:
      '新加坡拿下 Safran.AI 全球首个海外子公司，但 2027 年一季度才启动招聘、首批仅 50 人，EDB 的航空 AI 卡位仍是试探性落子',
    whyItMattersEn:
      "Singapore secured Safran.AI's first global overseas subsidiary, but recruitment will not launch until Q1 2027, with only 50 people in the initial cohort. EDB's aviation-AI positioning remains exploratory.",
    whyItMattersJa:
      'シンガポールはSafran.AIのグローバル初の海外子会社を確保しましたが、2027年第1四半期にようやく採用を開始し、初期段階ではわずか50名のみです。EDBの航空AI戦略は依然として試験的なポジショニングに過ぎません。',
    whyItMattersKo:
      '싱가포르는 사프란.에이아이의 글로벌 최초 해외 자회사를 확보했으나, 2027년 1분기에야 채용을 시작하고 초기 인원은 50명에 불과하여, EDB의 항공 AI 포지셔닝은 여전히 시험적 움직임에 그칩니다.',
    sourceUrl: 'https://www.edb.gov.sg/en/news-and-insights/safran-chooses-singapore-for-new-ai-centre-of-excellence',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'economy-industry', 'startups-investment'],
    addedAt: '2026-11-04',
  },
  {
    id: 'sig-20261026-singapore-embodied-ai-manufacturing-chal',
    date: '2026-10-21',
    title: '新加坡启动首届全国具身智能制造挑战赛',
    titleEn: 'Singapore launches first national embodied AI manufacturing challenge',
    titleJa: 'シンガポール初の全国具身化AI製造チャレンジ開始',
    titleKo: '싱가포르 첫 전국 체화 지능 제조 챌린지 개시',
    whyItMatters:
      'Micron 为具身智能挑战赛提供模拟半导体制造任务。参赛队伍在模拟舱内验证方案，测试成果转为工业应用的可行性。',
    whyItMattersEn:
      'Micron provides a simulated semiconductor manufacturing task for the embodied AI challenge. Teams test solutions in a mock-up chamber to assess potential industrial applications.',
    whyItMattersJa:
      'Micronが具身型AIチャレンジに半導体製造の模擬課題を提供します。参加チームは模擬チャンバー内で解決策を検証し、産業応用の可能性を評価します。',
    whyItMattersKo:
      '미크론은 체화 지능 챌린지에 반도체 제조 모의 과제를 제공합니다. 참가팀은 모형 챔버에서 솔루션을 검증하고 산업 적용 가능성을 평가합니다.',
    sourceUrl:
      'https://www.a-star.edu.sg/news/press-releases/singapore-launches-first-national-embodied-ai-challenge-to-accelerate-real-world-robotics-deployment-in-manufacturing',
    sourceName: 'A*STAR',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'talent-education'],
    addedAt: '2026-10-28',
  },
  {
    id: 'sig-20261021-moonshot-ai-singapore-expansion',
    date: '2026-10-21',
    title: '月之暗面据招聘信息拟进军新加坡',
    titleEn: 'Moonshot AI plans Singapore entry, recruitment postings suggest',
    titleJa: 'ムーンショット、採用情報からシンガポール進出計画',
    titleKo: '문샷 AI 싱가포르 진출 계획, 채용공고 기반',
    whyItMatters:
      '月之暗面 2023 年便登记新加坡主体,2026 年 6 月改名 Novascent 后才开始招聘,新加坡正成 Tencent、Meituan、China Mobile 系 AI 出海的跳板',
    whyItMattersEn:
      "Moonshot AI registered a Singapore entity in 2023 but only started recruiting after renaming to Novascent in June 2026, as Singapore becomes a springboard for Tencent, Meituan, and China Mobile-affiliated AI companies' overseas expansion.",
    whyItMattersJa:
      'ゲツノアンメンは2023年にシンガポール法人を登記し、2026年6月にNovascent（ノバセント）に改名した後、初めて採用を開始しました。シンガポールはTencent、Meituan、China Mobile系のAI企業の海外進出の足がかりとなっています。',
    whyItMattersKo:
      '월지암면은 2023년 싱가포르 법인을 등록했으며, 2026년 6월 노바센트로 개명한 이후에야 채용을 시작했습니다. 싱가포르는 텐센트, 미투안, 차이나 모바일 계열 AI 해외 진출의 발판이 되고 있습니다.',
    sourceUrl:
      'https://www.businesstimes.com.sg/companies-markets/chinas-moonshot-ai-operate-singapore-jobs-post-shows',
    sourceName: 'The Business Times',
    topicIds: ['startups-investment', 'economy-industry', 'international'],
    addedAt: '2026-10-28',
  },
  {
    id: 'sig-20261014-anthropic-singapore-office-mou',
    date: '2026-10-14',
    title: 'Anthropic 在新加坡设办公室，与 MDDI 签署合作备忘录',
    titleEn: 'Anthropic opens a Singapore office and signs an MOU with MDDI',
    titleJa: 'Anthropic、シンガポールに拠点開設　MDDI と覚書締結',
    titleKo: 'Anthropic, 싱가포르 사무소 개설하고 MDDI와 MOU 체결',
    whyItMatters:
      '这是 Anthropic 在亚太的第五个办公室；备忘录覆盖模型评测、测试标准和事件响应的技术交流，新加坡由此与前沿模型公司建立直接的评测合作渠道',
    whyItMattersEn:
      "Anthropic's fifth office in Asia-Pacific. The MOU covers technical exchanges on model evaluation, testing standards and incident response, which gives Singapore a direct evaluation channel with a frontier lab.",
    whyItMattersJa:
      'Anthropic にとってアジア太平洋で 5 番目の拠点です。覚書はモデル評価、テスト基準、インシデント対応に関する技術交流を含み、シンガポールはフロンティア AI 企業と直接の評価協力ルートを持つことになります。',
    whyItMattersKo:
      'Anthropic의 아시아태평양 다섯 번째 사무소입니다. MOU는 모델 평가, 테스트 기준, 사고 대응에 관한 기술 교류를 포함하며, 싱가포르는 프런티어 AI 기업과 직접적인 평가 협력 통로를 갖게 됩니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/anthropic-opens-singapore-office-and-signs-mou-with-government-of-singapore',
    sourceName: 'EDB',
    topicIds: ['safety-ethics', 'international', 'public-sector'],
    related: [{ kind: 'person', id: 'josephine-teo' }],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261008-physicsx-astar-partnership-singapore',
    date: '2026-10-08',
    title: 'PhysicsX 在新加坡设亚太中心，与 A*STAR 签五年 4000 万新元合作',
    titleEn: 'PhysicsX opens an Asia-Pacific hub in Singapore with a five-year S$40 million A*STAR partnership',
    titleJa: 'PhysicsX、シンガポールにアジア太平洋拠点　A*STAR と 5 年 4,000 万シンガポールドルの提携',
    titleKo: 'PhysicsX, 싱가포르에 아시아태평양 허브 설립·A*STAR와 5년 4천만 싱가포르달러 협력',
    whyItMatters:
      'Temasek 与 EDB 支持落地；与 A*STAR 的五年 4000 万新元合作覆盖海事、先进制造、半导体和生物技术，把工业 AI 落到本地产业，而不只是设一个区域总部',
    whyItMattersEn:
      'Temasek and EDB backed the move. The five-year S$40 million A*STAR partnership spans maritime, advanced manufacturing, semiconductors and biotech, which ties industrial AI to local industry instead of stopping at a regional office.',
    whyItMattersJa:
      'Temasek と EDB が進出を支援しました。A*STAR との 5 年 4,000 万シンガポールドルの提携は海事、先端製造、半導体、バイオテクノロジーにわたり、地域拠点にとどまらず産業 AI を現地産業に結び付けます。',
    whyItMattersKo:
      'Temasek과 EDB가 진출을 지원했습니다. A*STAR와의 5년 4천만 싱가포르달러 협력은 해양, 첨단 제조, 반도체, 바이오 분야에 걸쳐 있어 지역 거점에 그치지 않고 산업 AI를 현지 산업과 연결합니다.',
    sourceUrl:
      'https://www.edb.gov.sg/en/news-and-insights/physicsx-launches-asia-pacific-hub-in-singapore-to-scale-ai-powered-industrial-engineering-across-the-region',
    sourceName: 'EDB',
    topicIds: ['advanced-manufacturing', 'infrastructure-research', 'economy-industry'],
    related: [{ kind: 'ecosystem', id: 'a-star' }],
    addedAt: '2026-10-17',
  },
  {
    id: 'sig-20261006-mddi-pq-pre-deployment-frontier-ai-acces',
    date: '2026-10-06',
    title: 'MDDI：前沿模型部署前向政府开放评估，暂不设为强制要求',
    titleEn: 'MDDI: frontier labs will not be required to give the government pre-deployment access for now',
    titleJa: 'MDDI、フロンティアモデルの導入前アクセスは当面義務化せず',
    titleKo: 'MDDI, 프런티어 모델 배포 전 정부 접근 당분간 의무화 안 해',
    whyItMatters:
      '国会答复称强制开放模型可能让企业减少合作；政府改走两条路：与前沿实验室建立信息共享关系，由新加坡 AI 安全研究所（AISI）自建评测能力',
    whyItMattersEn:
      'The parliamentary reply says a rigid access requirement could make companies cooperate less. The government instead builds information-sharing relationships with frontier labs and has the AI Safety Institute (AISI) build its own evaluation capability.',
    whyItMattersJa:
      '国会答弁は、アクセスの義務化は企業の協力を減らしかねないとしました。政府はフロンティア AI 企業との情報共有関係を築き、AI 安全研究所（AISI）が独自の評価能力を整える方針です。',
    whyItMattersKo:
      '국회 답변은 접근 의무화가 기업의 협력을 줄일 수 있다고 밝혔습니다. 정부는 프런티어 AI 기업과 정보 공유 관계를 구축하고, AI 안전연구소(AISI)가 자체 평가 역량을 갖추는 방향을 택했습니다.',
    sourceUrl:
      'https://www.mddi.gov.sg/newsroom/mddi-response-to-pq-on-providing-pre-deployment-government-access-to-frontier-ai-models-for-independent-evaluation-of-national-security-risks-and-vulnerab/',
    sourceName: 'MDDI',
    topicIds: ['governance-regulation', 'national-security', 'safety-ethics'],
    addedAt: '2026-10-17',
  },
];

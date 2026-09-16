// src/data/reg-lookahead.ts
// ────────────────────────────────────────────────────────────────────────
// Regulatory lookahead — the pipeline BEFORE the law: open public
// consultations (IMDA / PDPC / MDDI) and AI-relevant bills moving through
// Parliament. Rendered as the "监管前瞻" section on /legal-ai.
//
// WHY (2026-08-03 source-expansion plan): the DIB consultation opened
// 1 Jul and the site only caught it ~4 weeks later via manual research.
// This file + its weekly pipeline make DIB-class events day-1-week-1
// captures, and bill stage transitions arrive as small reviewable PRs.
//
// LIFECYCLE MODEL — this data file IS the diff baseline: the weekly
// pipeline re-observes every non-terminal record and edits status/stage
// IN PLACE, appending to the observation history. A git diff therefore
// reads as "stage: 'introduced' → 'passed'", which is exactly what
// phone-based PR review needs. Records are never deleted; terminal
// records (response-published / assented / withdrawn) stop being
// re-fetched.
//
// Division of labour with LegalItem (legal-ai.ts sections): this file
// tracks the PIPELINE (proposals in motion); LegalItem records the LAW.
// When a consultation becomes guidance or a bill is assented, the owner
// authors a proper LegalItem in the right section — see the DIB
// precedent (digital-infrastructure-bill entry, 2026-07-28).
//
// status/stage are English enum codes (labels via 4-lang dict keys —
// rule #13); title/summary are content fields with full 4-lang siblings.

export type ConsultationStatus = 'open' | 'closed' | 'response-published';

export interface ConsultationItem {
  /** URL slug id. */
  id: string;
  agency: 'IMDA' | 'PDPC' | 'MDDI';
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  summary: string;
  summaryEn: string;
  summaryJa?: string;
  summaryKo?: string;
  /** Status as last OBSERVED by the pipeline. Render-time effective
   *  status may differ: an 'open' item past its deadline renders closed
   *  immediately (see effectiveConsultationStatus). */
  status: ConsultationStatus;
  /** YYYY-MM-DD, LLM-extracted from the page and regex-validated; absent
   *  when the page doesn't state one cleanly (UI falls back to 见原文). */
  opensAt?: string;
  deadline?: string;
  statusHistory: Array<{ status: ConsultationStatus; observedAt: string }>;
  sourceUrl: string;
  addedAt: string;
  topicIds?: string[];
}

export type BillStage = 'introduced' | 'second-reading' | 'passed' | 'assented' | 'withdrawn';

export interface BillItem {
  /** Slug id derived from the bill title. */
  id: string;
  /** e.g. 'Bill 9/2026'. */
  billNumber?: string;
  title: string;
  titleEn: string;
  titleJa?: string;
  titleKo?: string;
  summary: string;
  summaryEn: string;
  summaryJa?: string;
  summaryKo?: string;
  stage: BillStage;
  introducedAt?: string;
  secondReadingAt?: string;
  passedAt?: string;
  assentedAt?: string;
  stageHistory: Array<{ stage: BillStage; observedAt: string }>;
  /** core = directly regulates AI/data/digital infrastructure (DIB
   *  class); adjacent = materially affects the AI ecosystem. */
  aiRelevance: 'core' | 'adjacent';
  sourceUrl: string;
  addedAt: string;
  topicIds?: string[];
}

export const consultations: ConsultationItem[] = [
  {
    id: 'public-consultation-on-digital-infrastructure-bill',
    agency: 'MDDI',
    title: '《数字基础设施法案》公众咨询',
    titleEn: 'Public Consultation on Digital Infrastructure Bill',
    titleJa: 'Digital Infrastructure Bill に関する公開協議',
    titleKo: '디지털 기반시설 법안에 대한 공개 협의',
    summary:
      '关于新加坡《数字基础设施法案》的公众咨询（2026 年 7 月 1 日至 22 日），该法案为主要数据中心和云计算服务提供商建立许可制度，旨在增强数字基础设施的安全性、韧性和环保可持续性。MDDI 与 IMDA 于 9 月 8 日发布咨询结果：25 位回应者总体支持法案目标，反馈集中在实施细节、许可门槛和安全要求框架；法案同日提交国会一读（Bill 20/2026）。',
    summaryEn:
      "Public consultation (1–22 July 2026) on Singapore's Digital Infrastructure Bill, which establishes licensing regimes for major data centre and cloud service providers to strengthen the security, resilience and environmental sustainability of digital infrastructure. MDDI and IMDA published the outcome on 8 September: 25 respondents were broadly supportive, with feedback on implementation details, licensing thresholds and the security-requirements framework; the Bill was introduced in Parliament the same day (Bill 20/2026).",
    summaryJa:
      'シンガポールのデジタルインフラ法案に関する公開協議（2026 年 7 月 1 日〜22 日）。本法案は主要なデータセンターとクラウドサービス事業者に対するライセンス制度を設け、デジタルインフラの安全性、レジリエンス、環境持続可能性を高めることを目指す。MDDI と IMDA は 9 月 8 日に協議結果を公表：25 者の回答は法案の目的をおおむね支持し、意見は実施の詳細、ライセンス基準、セキュリティ要件の枠組みに集中した。法案は同日、国会に提出された（Bill 20/2026）。',
    summaryKo:
      '주요 데이터센터 및 클라우드 서비스 제공자에 대한 라이선스 체계를 수립하는 싱가포르 디지털 인프라 법안에 대한 공개 협의(2026년 7월 1일~22일). 본 법안은 디지털 인프라의 보안, 회복력, 환경 지속가능성을 강화하는 것을 목표로 한다. MDDI와 IMDA는 9월 8일 협의 결과를 발표했다. 25개 응답자가 법안 목표를 대체로 지지했고, 피드백은 이행 세부사항, 라이선스 기준, 보안 요건 체계에 집중됐다. 법안은 같은 날 국회에 상정됐다(Bill 20/2026).',
    status: 'response-published',
    opensAt: '2026-07-01',
    deadline: '2026-07-22',
    statusHistory: [
      { status: 'closed', observedAt: '2026-08-03' },
      { status: 'response-published', observedAt: '2026-09-14' },
    ],
    // Consultation outcome page (8 Sep 2026); the original call-for-views
    // page is .../public-consultation-on-digital-infrastructure-bill/.
    sourceUrl: 'https://www.mddi.gov.sg/newsroom/public-consultation-on-the-digital-infrastructure-bill/',
    addedAt: '2026-08-03',
  },
  {
    id: 'public-consultation-on-the-proposed-advisory-guidelines-on-use-of-personal-data-in-generat',
    agency: 'PDPC',
    title: 'PDPC',
    titleEn: 'PDPC',
    titleJa: 'PDPC',
    titleKo: 'PDPC',
    summary:
      '个人数据保护委员会正在就拟议咨询指南进行公众咨询，该指南将规管个人数据在生成式人工智能应用中的使用。摘录中未提供日期或详细摘要。',
    summaryEn:
      'The PDPC is conducting a public consultation on proposed advisory guidelines governing the use of personal data in generative AI applications. No dates or detailed summary are provided in the excerpt.',
    summaryJa:
      'PDPCは、生成型AIアプリケーションにおける個人データの利用を規定する提案型アドバイザリー・ガイドラインに関する公開協議を実施しています。この抜粋では日付や詳細な概要は提供されていません。',
    summaryKo:
      'PDPC는 생성형 AI 애플리케이션에서 개인 데이터의 사용을 규율하는 자문 지침 제안에 관한 공개 협의를 진행하고 있습니다. 발췌문에는 구체적인 날짜나 상세한 요약이 제공되지 않습니다.',
    status: 'response-published',
    statusHistory: [{ status: 'response-published', observedAt: '2026-08-03' }],
    sourceUrl:
      'https://www.pdpc.gov.sg/organisations/regulations-decisions/public-consultations/public-consultation-on-the-proposed-advisory-guidelines-on-use-of-personal-data-in-generative-ai/',
    addedAt: '2026-08-03',
  },
];

export const bills: BillItem[] = [
  {
    id: 'digital-infrastructure-bill',
    billNumber: 'Bill 20/2026',
    title: '数字基础设施法案',
    titleEn: 'Digital Infrastructure Bill',
    titleJa: 'デジタルインフラ法案',
    titleKo: '디지털 인프라 법안',
    summary:
      '《数字基础设施法案》（Bill 20/2026）于 2026 年 9 月 8 日在国会一读。法案设立两套许可制度：一是主要数据中心与云服务商的安全与韧性许可，二是数据中心运营的环保可持续许可，具体要求由后续法规规定。',
    summaryEn:
      'The Digital Infrastructure Bill (Bill 20/2026) had its first reading in Parliament on 8 September 2026. It establishes two licensing regimes: security and resilience for major data centres and cloud service providers, and environmental sustainability for data-centre operations, with detailed requirements to follow in subsidiary instruments.',
    summaryJa:
      'デジタルインフラ法案（Bill 20/2026）は 2026 年 9 月 8 日に国会で第一読会を経た。主要データセンターとクラウドサービス事業者の安全性・レジリエンス、およびデータセンター運営の環境持続可能性という 2 つのライセンス制度を設け、具体的な要件は下位法令で定める。',
    summaryKo:
      '디지털 인프라 법안(Bill 20/2026)은 2026년 9월 8일 국회에서 1독회를 거쳤다. 주요 데이터센터·클라우드 서비스 제공자의 보안·회복력, 그리고 데이터센터 운영의 환경 지속가능성이라는 두 가지 라이선스 제도를 신설하며, 세부 요건은 하위 법령으로 정한다.',
    stage: 'introduced',
    introducedAt: '2026-09-08',
    stageHistory: [{ stage: 'introduced', observedAt: '2026-09-14' }],
    aiRelevance: 'core',
    sourceUrl: 'https://www.parliament.gov.sg/parliamentary-business/bills-introduced',
    addedAt: '2026-09-14',
  },
  {
    id: 'info-communications-media-development-authority-amendment-bill',
    billNumber: 'Bill 9/2026',
    title: '信息通信媒体发展局（修订）法案',
    titleEn: 'Info-communications Media Development Authority (Amendment) Bill',
    titleJa: 'IMDA（修正）法案',
    titleKo: 'Info-communications Media Development Authority (개정) 법안',
    summary:
      '在没有当前议会资料来源的情况下，无法验证《2026年第9号法案》的具体条款。IMDA修正法案通常涉及信息通信部门的监管更新，可能包括数字平台治理、数据保护或内容规制框架。',
    summaryEn:
      'Unable to verify specific provisions of Bill 9/2026 without current parliamentary sources. IMDA Amendment Bills typically address regulatory updates to the info-communications sector, potentially including digital platform governance, data protection, or content regulation frameworks.',
    summaryJa:
      '現在の議会資料がない中では、2026年第9号法案の具体的な条項を検証することはできません。IMDA改正法案は、一般的に情報通信セクターの規制更新に対応し、デジタルプラットフォーム・ガバナンス、データ保護、またはコンテンツ規制枠組みが含まれる可能性があります。',
    summaryKo:
      '현재 의회 자료 없이는 Bill 9/2026의 구체적 조항을 확인할 수 없습니다. IMDA 개정안은 일반적으로 정보통신 부문의 규제 업데이트를 다루며, 디지털 플랫폼 거버넌스, 데이터 보호 또는 콘텐츠 규제 체계를 포함할 수 있습니다.',
    stage: 'passed',
    introducedAt: '2026-04-07',
    secondReadingAt: '2026-05-06',
    passedAt: '2026-05-07',
    stageHistory: [{ stage: 'passed', observedAt: '2026-08-03' }],
    aiRelevance: 'adjacent',
    sourceUrl: 'https://www.parliament.gov.sg/parliamentary-business/bills-introduced',
    addedAt: '2026-08-03',
  },
];

/** Render-time staleness guard: an 'open' consultation whose deadline has
 *  passed must never display as open just because the weekly cron hasn't
 *  observed it yet. */
export function effectiveConsultationStatus(item: ConsultationItem, today: string): ConsultationStatus {
  if (item.status === 'open' && item.deadline && item.deadline < today) return 'closed';
  return item.status;
}

export function openConsultations(today: string): ConsultationItem[] {
  return consultations
    .filter((c) => effectiveConsultationStatus(c, today) === 'open')
    .sort((a, b) => (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999'));
}

export function activeBills(): BillItem[] {
  return bills
    .filter((b) => b.stage !== 'assented' && b.stage !== 'withdrawn')
    .sort((a, b) => (b.introducedAt ?? '').localeCompare(a.introducedAt ?? ''));
}

export function archivedLookahead(today: string): { consultations: ConsultationItem[]; bills: BillItem[] } {
  return {
    consultations: consultations.filter((c) => effectiveConsultationStatus(c, today) !== 'open'),
    bills: bills.filter((b) => b.stage === 'assented' || b.stage === 'withdrawn'),
  };
}

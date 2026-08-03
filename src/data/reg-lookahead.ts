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
      '关于新加坡《数字基础设施法案》的公众咨询，该法案为主要数据中心和云计算服务提供商建立许可制度。该法案旨在通过新的监管要求，增强数字基础设施服务的安全性、韧性和环保可持续性。',
    summaryEn:
      "Public consultation on Singapore's Digital Infrastructure Bill, which establishes licensing regimes for major data centre and cloud computing service providers. The Bill aims to enhance security, resilience, and environmental sustainability of digital infrastructure services through new regulatory requirements.",
    summaryJa:
      'シンガポールの「Digital Infrastructure Bill」に関する公開協議です。本法案は、主要なデータセンターおよびクラウドコンピューティングサービスプロバイダーに対するライセンス制度を確立するものです。この法案は、新たな規制要件を通じて、デジタルインフラストラクチャサービスのセキュリティ、レジリエンス、および環境持続可能性を強化することを目指しています。',
    summaryKo:
      '주요 데이터센터 및 클라우드 컴퓨팅 서비스 제공자에 대한 라이선싱 체계를 수립하는 싱가포르 디지털 인프라 법안에 대한 공공 협의입니다. 본 법안은 새로운 규제 요건을 통해 디지털 인프라 서비스의 보안, 복원력, 환경 지속가능성을 강화하는 것을 목표로 합니다.',
    status: 'closed',
    opensAt: '2026-07-01',
    deadline: '2026-07-22',
    statusHistory: [{ status: 'closed', observedAt: '2026-08-03' }],
    sourceUrl: 'https://www.mddi.gov.sg/newsroom/public-consultation-on-digital-infrastructure-bill/',
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

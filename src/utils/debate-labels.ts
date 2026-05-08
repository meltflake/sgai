// Localized labels for debate `type` and `topics` enum values.
//
// `Debate.type` is stored as the raw Hansard category string (English),
// `Debate.topics[]` is stored as English controlled-vocabulary terms.
// Display surfaces (homepage debates list, debates index, debate detail)
// must localize these strings — otherwise the JA / ZH pages render raw
// English in the metadata strip below each debate title.
//
// Why a shared module: the same maps used to live inline inside
// `DebatesIndex.astro` keyed by `isEn` (binary). HomePage rendered the
// raw values without any lookup, which is the bug that surfaced when
// the JA homepage shipped — see CLAUDE.md.

import type { Lang } from '~/i18n';

const TYPE_MAP: Record<Lang, Record<string, string>> = {
  en: {
    'Oral Answers to Questions': 'Oral Answers',
    'Written Answers to Questions': 'Written Answers',
    Budget: 'Budget Debate',
    Motions: 'Motions',
  },
  zh: {
    'Oral Answers to Questions': '口头答复',
    'Written Answers to Questions': '书面答复',
    Budget: '预算辩论',
    Motions: '动议',
  },
  ja: {
    'Oral Answers to Questions': '口頭答弁',
    'Written Answers to Questions': '書面答弁',
    Budget: '予算討論',
    Motions: '動議',
  },
};

const TOPIC_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    'AI Economy & Industry': 'AI Economy & Industry',
    'AI & Employment': 'AI & Employment',
    'AI Governance & Regulation': 'AI Governance & Regulation',
    'AI & National Security': 'AI & National Security',
    'AI in Public Sector': 'AI in Public Sector',
    'AI Infrastructure & Research': 'AI Infrastructure & Research',
    'AI Safety & Ethics': 'AI Safety & Ethics',
    'AI in Education': 'AI in Education',
    'AI in Healthcare': 'AI in Healthcare',
    'AI Strategy': 'AI Strategy',
    'Deepfakes & Disinformation': 'Deepfakes & Disinformation',
  },
  zh: {
    'AI Economy & Industry': 'AI 经济与产业',
    'AI & Employment': 'AI 与就业',
    'AI Governance & Regulation': 'AI 治理与监管',
    'AI & National Security': 'AI 与国家安全',
    'AI in Public Sector': 'AI 与公共部门',
    'AI Infrastructure & Research': 'AI 基础设施与研究',
    'AI Safety & Ethics': 'AI 安全与伦理',
    'AI in Education': 'AI 与教育',
    'AI in Healthcare': 'AI 与医疗',
    'AI Strategy': 'AI 战略',
    'Deepfakes & Disinformation': '深度伪造与虚假信息',
  },
  ja: {
    'AI Economy & Industry': 'AI 経済と産業',
    'AI & Employment': 'AI と雇用',
    'AI Governance & Regulation': 'AI ガバナンスと規制',
    'AI & National Security': 'AI と国家安全保障',
    'AI in Public Sector': 'AI と公共部門',
    'AI Infrastructure & Research': 'AI インフラと研究',
    'AI Safety & Ethics': 'AI 安全と倫理',
    'AI in Education': 'AI と教育',
    'AI in Healthcare': 'AI と医療',
    'AI Strategy': 'AI 戦略',
    'Deepfakes & Disinformation': 'ディープフェイクと偽情報',
  },
};

/** Look up the localized debate type label, falling back to the raw
 *  English source string when the key isn't in the table. */
export function debateTypeLabel(type: string, lang: Lang): string {
  return TYPE_MAP[lang]?.[type] || TYPE_MAP.en[type] || type;
}

/** Look up the localized debate topic label, falling back to the raw
 *  English source string when the key isn't in the table. */
export function debateTopicLabel(topic: string, lang: Lang): string {
  return TOPIC_LABELS[lang]?.[topic] || TOPIC_LABELS.en[topic] || topic;
}

/** Type / topic maps as records keyed by lang. Surface for callers that
 *  need the full set (e.g. building a filter dropdown). */
export const DEBATE_TYPE_MAP = TYPE_MAP;
export const DEBATE_TOPIC_LABELS = TOPIC_LABELS;

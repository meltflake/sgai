// Derived "Parliamentary AI record" for voice profiles.
//
// Aggregates a person's appearances in debates.ts (via `personIds`) into a
// date-sorted debate list plus per-year and per-topic counts, and builds a
// localized one-line factual summary ("Member of Parliament. Spoke in N
// AI-related parliamentary debates (2019–2026), most often on X and Y.").
//
// Everything here is derived at build time from ground-truth Hansard
// records — no curated content involved — so profiles stay correct as
// debates.ts grows and the summary can safely replace the "Profile
// pending" boilerplate on stub MP pages (the GSC person-name query class:
// see docs/20260610-gsc-seo-hardening.md follow-up #2).

import { debates, type Debate } from '~/data/debates';
import type { Person } from '~/data/people';
import type { Lang } from '~/i18n';
import { toTraditional } from '~/i18n/opencc';
import { debateTopicLabel } from '~/utils/debate-labels';

export interface ParliamentaryRecord {
  /** The person's debates, newest first. */
  debates: Debate[];
  total: number;
  /** Newest year first. */
  byYear: { year: number; count: number }[];
  /** Most frequent first; `topic` is the EN controlled-vocabulary key —
   *  localize for display via debateTopicLabel(). */
  byTopic: { topic: string; count: number }[];
  firstYear: number | null;
  lastYear: number | null;
}

/** Debate count at which a stub profile earns the auto-generated factual
 *  summary line — and with it a guaranteed index (see isLowSignalPerson).
 *  Below this, a derived record still renders but the page keeps the
 *  "profile pending" treatment. */
export const PARLIAMENTARY_SUMMARY_MIN_DEBATES = 3;

const EMPTY: ParliamentaryRecord = {
  debates: [],
  total: 0,
  byYear: [],
  byTopic: [],
  firstYear: null,
  lastYear: null,
};

let _index: Map<string, ParliamentaryRecord> | null = null;

function buildIndex(): Map<string, ParliamentaryRecord> {
  if (_index) return _index;
  const grouped = new Map<string, Debate[]>();
  for (const d of debates) {
    for (const pid of d.personIds || []) {
      const arr = grouped.get(pid);
      if (arr) arr.push(d);
      else grouped.set(pid, [d]);
    }
  }
  const m = new Map<string, ParliamentaryRecord>();
  for (const [pid, list] of grouped) {
    const sorted = list.slice().sort((a, b) => b.date.localeCompare(a.date));
    const yearCounts = new Map<number, number>();
    const topicCounts = new Map<string, number>();
    for (const d of sorted) {
      const year = Number(d.date.slice(0, 4));
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
      for (const topic of d.topics || []) topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    }
    const byYear = [...yearCounts.entries()].map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year);
    const byTopic = [...topicCounts.entries()]
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
    m.set(pid, {
      debates: sorted,
      total: sorted.length,
      byYear,
      byTopic,
      firstYear: byYear.length > 0 ? byYear[byYear.length - 1].year : null,
      lastYear: byYear.length > 0 ? byYear[0].year : null,
    });
  }
  _index = m;
  return m;
}

export function getParliamentaryRecord(personId: string): ParliamentaryRecord {
  return buildIndex().get(personId) || EMPTY;
}

/** Localized factual summary line for a person's parliamentary record.
 *  Returns null below PARLIAMENTARY_SUMMARY_MIN_DEBATES so callers fall
 *  back to the "profile pending" treatment. Pure derivation: role from
 *  Person.roles, counts/years/topics from debates.ts. */
export function buildParliamentarySummary(person: Person, lang: Lang): string | null {
  const rec = getParliamentaryRecord(person.id);
  if (rec.total < PARLIAMENTARY_SUMMARY_MIN_DEBATES || rec.firstYear === null || rec.lastYear === null) return null;
  const isMp = (person.roles || []).includes('mp');
  // zh-tw derives from the zh sentence via OpenCC (CLAUDE.md rule #10).
  // Converting the whole sentence yields the same topic labels as
  // debateTopicLabel(topic, 'zh-tw'), which itself converts the zh label.
  if (lang === 'zh-tw') return toTraditional(buildSummaryText(rec, isMp, 'zh'));
  return buildSummaryText(rec, isMp, lang);
}

function buildSummaryText(rec: ParliamentaryRecord, isMp: boolean, lang: Exclude<Lang, 'zh-tw'>): string {
  const n = rec.total;
  const first = rec.firstYear as number;
  const last = rec.lastYear as number;
  const topics = rec.byTopic.slice(0, 2).map((tc) => debateTopicLabel(tc.topic, lang));

  if (lang === 'zh') {
    const span = first === last ? `${first} 年` : `${first}–${last} 年间`;
    const topicClause = topics.length > 0 ? `，议题集中于 ${topics.join('、')}` : '';
    return `${isMp ? '国会议员。' : ''}${span}在 ${n} 场 AI 相关国会辩论中发言${topicClause}。`;
  }
  if (lang === 'ja') {
    const span = first === last ? `${first}年` : `${first}–${last}年`;
    const topicClause = topics.length > 0 ? `。主なテーマは ${topics.join('、')}` : '';
    return `${isMp ? '国会議員。' : ''}${span}に ${n} 件の AI 関連議会討論で発言${topicClause}。`;
  }
  if (lang === 'ko') {
    const span = first === last ? `${first}년` : `${first}–${last}년`;
    const prefix = isMp ? '국회의원. ' : '';
    if (topics.length > 0)
      return `${prefix}${span} ${n}건의 AI 관련 국회 토론에서 발언했으며, 주요 주제는 ${topics.join(', ')}입니다.`;
    return `${prefix}${span} ${n}건의 AI 관련 국회 토론에서 발언했습니다.`;
  }
  const span = first === last ? `${first}` : `${first}–${last}`;
  const noun = n === 1 ? 'debate' : 'debates';
  const topicClause = topics.length > 0 ? `, most often on ${topics.join(' and ')}` : '';
  return `${isMp ? 'Member of Parliament. ' : ''}Spoke in ${n} AI-related parliamentary ${noun} (${span})${topicClause}.`;
}

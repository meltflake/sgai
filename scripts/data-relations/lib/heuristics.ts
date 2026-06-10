// Candidate-relation heuristics for the data-relations review queue.
// Inputs: a single anchor entity (debate or policy) + the full opposite-side
// collection. Output: ranked candidates with signals + confidence label.
//
// Design lives in docs/20260507-data-relations-review-queue-design.md.
//
// Five signals, three confidence buckets. Each signal has a fixed weight;
// confidence is derived from total weight + presence of a strong signal.
// Heuristics never invoke an LLM — every signal is deterministic and
// inspectable, so a reviewer can verify why a candidate was suggested.

import type { Debate } from '~/data/debates';
import type { Policy } from '~/data/policies';
import type { Person } from '~/data/people';

export type Confidence = 'high' | 'medium' | 'low';

export type SignalType = 'person-overlap' | 'ministry-match' | 'keyword' | 'date-proximity' | 'topic-hit';

export interface Signal {
  type: SignalType;
  detail: string;
  weight: 'strong' | 'medium' | 'weak';
}

export interface Candidate<T> {
  target: T;
  signals: Signal[];
  confidence: Confidence;
}

const SIGNAL_WEIGHT: Record<Signal['weight'], number> = { strong: 3, medium: 2, weak: 1 };

// English stop-words to drop from titles before keyword matching.
// Kept small + obvious; the goal is precision (avoid "the" / "of" matching
// every doc) not recall.
const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'and',
  'or',
  'on',
  'in',
  'to',
  'for',
  'with',
  'by',
  'at',
  'from',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'will',
  'would',
  'could',
  'should',
  'this',
  'that',
  'these',
  'those',
  'into',
  'over',
  'under',
  'about',
  'between',
  'among',
  'singapore',
  'singaporean',
  's',
  'against',
]);

/** Extract content keywords from a title-like string for fuzzy matching. */
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4 && !STOP_WORDS.has(t));
  // De-dupe while preserving order.
  return [...new Set(tokens)];
}

// ── Signal 1: personIds overlap (strong) ────────────────────────────────

export function personOverlap(debate: Debate, policy: Policy): Signal | null {
  const a = new Set(debate.personIds || []);
  const b = new Set(policy.authorPersonIds || []);
  const overlap = [...a].filter((id) => b.has(id));
  if (overlap.length === 0) return null;
  return {
    type: 'person-overlap',
    detail: overlap.slice(0, 3).join(','),
    weight: 'strong',
  };
}

// ── Signal 2: ministry match (medium) ───────────────────────────────────

/** Pull a ministry slug out of a Hansard report id like 'cos-mddi-2026'. */
export function ministryFromDebateId(id: string): string | null {
  const m = id.match(/^cos-([a-z]+)-/i);
  return m ? m[1].toUpperCase() : null;
}

/** Build a personId → Person lookup. Pass in to avoid linear allPeople.find()
 *  on every signal computation. */
export function buildPersonIndex(allPeople: Person[]): Map<string, Person> {
  return new Map(allPeople.map((p) => [p.id, p]));
}

/** Infer ministry from a debate's personIds via people affiliations.
 *  Returns the most frequent affiliation among the debate's referenced
 *  people, or null if no people resolve. */
export function ministryFromPersonIds(
  personIds: string[] | undefined,
  peopleById: Map<string, Person> | Person[]
): string | null {
  if (!personIds || personIds.length === 0) return null;
  const lookup = peopleById instanceof Map ? peopleById : buildPersonIndex(peopleById);
  const counts = new Map<string, number>();
  for (const pid of personIds) {
    const person = lookup.get(pid);
    if (!person) continue;
    for (const aff of person.affiliations) counts.set(aff, (counts.get(aff) || 0) + 1);
  }
  if (counts.size === 0) return null;
  let best: string | null = null;
  let bestCount = 0;
  for (const [aff, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      best = aff;
    }
  }
  return best;
}

export function ministryMatch(debate: Debate, policy: Policy, peopleById: Map<string, Person> | Person[]): Signal | null {
  if (!policy.ministry) return null;
  const fromId = ministryFromDebateId(debate.id);
  if (fromId && fromId === policy.ministry.toUpperCase()) {
    return { type: 'ministry-match', detail: `id-derived:${fromId}`, weight: 'medium' };
  }
  const fromPersons = ministryFromPersonIds(debate.personIds, peopleById);
  if (fromPersons && fromPersons.toUpperCase() === policy.ministry.toUpperCase()) {
    return { type: 'ministry-match', detail: `person-derived:${fromPersons}`, weight: 'medium' };
  }
  return null;
}

// ── Signal 3: keyword hit (medium) ──────────────────────────────────────

function debateHaystack(debate: Debate): string {
  return `${debate.titleEn || ''} ${debate.summaryEn || debate.summary || ''}`.toLowerCase();
}

function keywordHitsForTokens(haystack: string, policyTokens: readonly string[]): Signal[] {
  if (policyTokens.length === 0) return [];
  const hits: Signal[] = [];
  for (const token of policyTokens) {
    if (haystack.includes(token)) {
      hits.push({ type: 'keyword', detail: token, weight: 'medium' });
    }
  }
  return hits.slice(0, 3); // cap to avoid overcounting on long titles
}

export function keywordHits(debate: Debate, policy: Policy): Signal[] {
  return keywordHitsForTokens(debateHaystack(debate), extractKeywords(policy.titleEn || policy.title));
}

// ── Signal 4: date proximity (weak) ─────────────────────────────────────

/** Days between two ISO-prefix dates. Returns Infinity if either is invalid. */
function daysBetween(a: string, b: string): number {
  const ta = Date.parse(a);
  const tb = Date.parse(b);
  if (Number.isNaN(ta) || Number.isNaN(tb)) return Infinity;
  return Math.abs(ta - tb) / (1000 * 60 * 60 * 24);
}

export function dateProximity(debate: Debate, policy: Policy, daysWindow = 90): Signal | null {
  if (!debate.date || !policy.date) return null;
  const d = daysBetween(debate.date, policy.date);
  if (d > daysWindow) return null;
  return { type: 'date-proximity', detail: `${Math.round(d)}d`, weight: 'weak' };
}

// ── Signal 5: topic hit (weak) ──────────────────────────────────────────

function topicHitsForTokens(topicsLower: readonly string[], policyTokens: readonly string[]): Signal[] {
  if (topicsLower.length === 0 || policyTokens.length === 0) return [];
  const hits: Signal[] = [];
  for (const token of policyTokens) {
    for (const topic of topicsLower) {
      if (topic.includes(token)) {
        hits.push({ type: 'topic-hit', detail: `${token}@"${topic}"`, weight: 'weak' });
        break;
      }
    }
  }
  return hits.slice(0, 2);
}

/** Does the debate's topic list mention any keyword from the policy title? */
export function topicHits(debate: Debate, policy: Policy): Signal[] {
  if (!debate.topics || debate.topics.length === 0) return [];
  return topicHitsForTokens(
    debate.topics.map((t) => t.toLowerCase()),
    extractKeywords(policy.titleEn || policy.title)
  );
}

// ── Confidence aggregation ──────────────────────────────────────────────

export function deriveConfidence(signals: Signal[]): Confidence {
  if (signals.length === 0) return 'low';
  const total = signals.reduce((sum, s) => sum + SIGNAL_WEIGHT[s.weight], 0);
  const hasStrong = signals.some((s) => s.weight === 'strong');
  if (total >= 4 && hasStrong) return 'high';
  if (total >= 2) return 'medium';
  return 'low';
}

// ── Ranking helpers ─────────────────────────────────────────────────────

const CONF_RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

function compareCandidates<T>(a: Candidate<T>, b: Candidate<T>): number {
  if (CONF_RANK[a.confidence] !== CONF_RANK[b.confidence]) {
    return CONF_RANK[b.confidence] - CONF_RANK[a.confidence];
  }
  const aw = a.signals.reduce((s, x) => s + SIGNAL_WEIGHT[x.weight], 0);
  const bw = b.signals.reduce((s, x) => s + SIGNAL_WEIGHT[x.weight], 0);
  return bw - aw;
}

// ── Top-level: anchor → candidates ──────────────────────────────────────

/** Compute all signals for one (debate, policy) pair, given pre-built lookups.
 *  Internal helper shared by both candidate-builder entry points. */
function pairSignals(
  debate: Debate,
  policy: Policy,
  peopleById: Map<string, Person>,
  policyTokens: readonly string[],
  haystack: string,
  topicsLower: readonly string[]
): Signal[] {
  const signals: Signal[] = [];
  const s1 = personOverlap(debate, policy);
  if (s1) signals.push(s1);
  const s2 = ministryMatch(debate, policy, peopleById);
  if (s2) signals.push(s2);
  signals.push(...keywordHitsForTokens(haystack, policyTokens));
  const s4 = dateProximity(debate, policy);
  if (s4) signals.push(s4);
  signals.push(...topicHitsForTokens(topicsLower, policyTokens));
  return signals;
}

export function candidatesForDebate(
  debate: Debate,
  policies: Policy[],
  allPeople: Person[],
  topN = 5
): Candidate<Policy>[] {
  const peopleById = buildPersonIndex(allPeople);
  const haystack = debateHaystack(debate);
  const topicsLower = (debate.topics || []).map((t) => t.toLowerCase());
  const alreadyRelated = new Set(debate.relatedPolicyIds || []);

  const out: Candidate<Policy>[] = [];
  for (const policy of policies) {
    if (!policy.id || alreadyRelated.has(policy.id)) continue;
    const tokens = extractKeywords(policy.titleEn || policy.title);
    const signals = pairSignals(debate, policy, peopleById, tokens, haystack, topicsLower);
    if (signals.length === 0) continue;
    out.push({ target: policy, signals, confidence: deriveConfidence(signals) });
  }
  out.sort(compareCandidates);
  return out.slice(0, topN);
}

export function candidatesForPolicy(
  policy: Policy,
  debates: Debate[],
  allPeople: Person[],
  topN = 5
): Candidate<Debate>[] {
  const peopleById = buildPersonIndex(allPeople);
  const policyTokens = extractKeywords(policy.titleEn || policy.title);
  const alreadyRelated = new Set(policy.relatedDebateIds || []);

  const out: Candidate<Debate>[] = [];
  for (const debate of debates) {
    if (!debate.id || alreadyRelated.has(debate.id)) continue;
    const haystack = debateHaystack(debate);
    const topicsLower = (debate.topics || []).map((t) => t.toLowerCase());
    const signals = pairSignals(debate, policy, peopleById, policyTokens, haystack, topicsLower);
    if (signals.length === 0) continue;
    out.push({ target: debate, signals, confidence: deriveConfidence(signals) });
  }
  out.sort(compareCandidates);
  return out.slice(0, topN);
}

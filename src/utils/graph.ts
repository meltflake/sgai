// Phase 1.12 — knowledge-graph query helpers. Read-only views over
// debates / policies / levers / timeline / blog posts / people.
//
// `getRelated(entity)` is the workhorse used by the upcoming RelatedRail
// component (Phase 2.2) and the /people/[id] route (Phase 1.13). It
// resolves all the foreign-key fields that exist on a given entity into
// the actual records they point at, returning grouped collections.
//
// Counts (debateCount, videoCount, policyAuthorCount, blogMentionCount)
// are computed lazily — on first call to getRelatedCounts(personId).
//
// All inputs are static (read at SSG build time). No network, no caching
// concerns beyond a per-build memoization map.

import { debates, type Debate } from '~/data/debates';
import { categories, type Policy } from '~/data/policies';
import { levers, type Lever, type LeverItem } from '~/data/levers';
import { timelineEvents, type TimelineEvent } from '~/data/timeline';
import { allPeople, type Person } from '~/data/people';

export type EntityKind = 'debate' | 'policy' | 'lever' | 'leverItem' | 'timeline' | 'person' | 'post';

export interface EntityRef {
  type: EntityKind;
  id: string | number; // levers identify by `number`; everything else by string id
}

export interface RelatedBundle {
  policies: Policy[];
  debates: Debate[];
  levers: Lever[];
  timeline: TimelineEvent[];
  people: Person[];
  postSlugs: string[]; // raw slugs; caller resolves with getCollection('post')
}

// ── Flat lookup helpers (constant-time after one-time index build) ──────

const _allPoliciesCache: Policy[] = [];
const _allLeverItemsCache: LeverItem[] = [];

function getAllPolicies(): Policy[] {
  if (_allPoliciesCache.length === 0) {
    for (const c of categories) for (const p of c.policies) _allPoliciesCache.push(p);
  }
  return _allPoliciesCache;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getAllLeverItems(): LeverItem[] {
  // Reserved for Phase 2 (LeverItem-level cross-refs render). Currently
  // unused but kept for symmetry with getAllPolicies.
  if (_allLeverItemsCache.length === 0) {
    for (const lv of levers) for (const g of lv.groups) for (const it of g.items) _allLeverItemsCache.push(it);
  }
  return _allLeverItemsCache;
}

export function getDebateById(id: string): Debate | undefined {
  return debates.find((d) => d.id === id);
}

export function getPolicyById(id: string): Policy | undefined {
  return getAllPolicies().find((p) => p.id === id);
}

export function getLeverByNumber(n: number): Lever | undefined {
  return levers.find((lv) => lv.number === n);
}

export function getTimelineEventById(id: string): TimelineEvent | undefined {
  return timelineEvents.find((e) => e.id === id);
}

// ── Reverse-index helpers (built on first access) ───────────────────────

let _debatesByPersonId: Map<string, Debate[]> | null = null;

function debatesByPersonId(): Map<string, Debate[]> {
  if (_debatesByPersonId) return _debatesByPersonId;
  const m = new Map<string, Debate[]>();
  for (const d of debates) {
    for (const pid of d.personIds || []) {
      const arr = m.get(pid) || [];
      arr.push(d);
      m.set(pid, arr);
    }
  }
  _debatesByPersonId = m;
  return m;
}

let _policiesByPersonId: Map<string, Policy[]> | null = null;

function policiesByPersonId(): Map<string, Policy[]> {
  if (_policiesByPersonId) return _policiesByPersonId;
  const m = new Map<string, Policy[]>();
  for (const p of getAllPolicies()) {
    for (const pid of p.authorPersonIds || []) {
      const arr = m.get(pid) || [];
      arr.push(p);
      m.set(pid, arr);
    }
  }
  _policiesByPersonId = m;
  return m;
}

// ── The big one ─────────────────────────────────────────────────────────

const empty = (): RelatedBundle => ({
  policies: [],
  debates: [],
  levers: [],
  timeline: [],
  people: [],
  postSlugs: [],
});

function resolvePolicyIds(ids: string[] | undefined): Policy[] {
  if (!ids) return [];
  const all = getAllPolicies();
  return ids.map((id) => all.find((p) => p.id === id)).filter(Boolean) as Policy[];
}

function resolveDebateIds(ids: string[] | undefined): Debate[] {
  if (!ids) return [];
  return ids.map((id) => debates.find((d) => d.id === id)).filter(Boolean) as Debate[];
}

function resolveLeverNumbers(nums: number[] | undefined): Lever[] {
  if (!nums) return [];
  return nums.map((n) => levers.find((lv) => lv.number === n)).filter(Boolean) as Lever[];
}

function resolveTimelineYears(years: number[] | undefined): TimelineEvent[] {
  if (!years) return [];
  return timelineEvents.filter((e) => years.includes(e.year));
}

function resolvePersonIds(ids: string[] | undefined): Person[] {
  if (!ids) return [];
  return ids.map((id) => allPeople.find((p) => p.id === id)).filter(Boolean) as Person[];
}

/**
 * Return all entities related to the given anchor. Useful for rendering
 * the right-rail "see also" block on entity detail pages.
 *
 * The anchor is identified by EntityKind + id. For levers the id is the
 * number (1–6); for everything else it's the string id field.
 *
 * Person anchors are special: they don't have explicit "relatedX" fields
 * on the Person record, so we use the reverse indexes (debates that
 * reference the person, policies authored, etc.).
 */
export function getRelated(ref: EntityRef): RelatedBundle {
  const out = empty();

  if (ref.type === 'debate') {
    const d = getDebateById(String(ref.id));
    if (!d) return out;
    out.policies = resolvePolicyIds(d.relatedPolicyIds);
    out.levers = resolveLeverNumbers(d.relatedLeverNumbers);
    out.timeline = resolveTimelineYears(d.relatedTimelineYears);
    out.people = resolvePersonIds(d.personIds);
    out.postSlugs = [...(d.relatedPostSlugs || [])];
    return out;
  }

  if (ref.type === 'policy') {
    const p = getPolicyById(String(ref.id));
    if (!p) return out;
    out.debates = resolveDebateIds(p.relatedDebateIds);
    out.levers = resolveLeverNumbers(p.relatedLeverNumbers);
    out.timeline = resolveTimelineYears(p.relatedTimelineYears);
    out.people = resolvePersonIds(p.authorPersonIds);
    out.postSlugs = [...(p.relatedPostSlugs || [])];
    return out;
  }

  if (ref.type === 'lever') {
    const lv = getLeverByNumber(Number(ref.id));
    if (!lv) return out;
    out.policies = resolvePolicyIds(lv.relatedPolicyIds);
    out.people = resolvePersonIds(lv.championPersonIds);
    out.postSlugs = [...(lv.relatedPostSlugs || [])];
    // Reverse: debates that mention this lever number.
    out.debates = debates.filter((d) => (d.relatedLeverNumbers || []).includes(lv.number));
    return out;
  }

  if (ref.type === 'timeline') {
    const e = getTimelineEventById(String(ref.id));
    if (!e) return out;
    out.policies = resolvePolicyIds(e.relatedPolicyIds);
    out.debates = resolveDebateIds(e.relatedDebateIds);
    out.people = resolvePersonIds(e.personIds);
    out.postSlugs = [...(e.relatedPostSlugs || [])];
    // Reverse: debates that match this year.
    const sameYear = debates.filter((d) => (d.relatedTimelineYears || []).includes(e.year));
    out.debates = [...new Set([...out.debates, ...sameYear])];
    return out;
  }

  if (ref.type === 'person') {
    const id = String(ref.id);
    out.debates = debatesByPersonId().get(id) || [];
    out.policies = policiesByPersonId().get(id) || [];
    return out;
  }

  // 'leverItem' and 'post' fall through with empty bundle for now —
  // wired up when consumers materialize.
  return out;
}

/** Build-time counts for a person, used by /people/[id] header. */
export function getPersonCounts(personId: string): {
  debateCount: number;
  policyAuthorCount: number;
} {
  return {
    debateCount: (debatesByPersonId().get(personId) || []).length,
    policyAuthorCount: (policiesByPersonId().get(personId) || []).length,
  };
}

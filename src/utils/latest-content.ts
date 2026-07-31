// src/utils/latest-content.ts
// ────────────────────────────────────────────────────────────────────────
// Per-domain "latest additions" and domain directory stats for the
// news-front-page homepage and the listing-page enhancement strips.
//
// Built on top of derived-updates.ts's harvestAll(): every record that
// carries addedAt, tagged with its fine-grained `source` domain and
// already localized (zh/en/ja/ko titles; zh-tw derives via toTraditional
// at render time through harvestedTitle()).
//
// timeline is the one domain without addedAt (events carry the event date
// instead), so its "latest" entry is synthesized from the newest event.

import { harvestAll, type Harvested, type DataSource } from '~/utils/derived-updates';
import { categories as policyCategories } from '~/data/policies';
import { debates } from '~/data/debates';
import { videos } from '~/data/videos';
import { people } from '~/data/people';
import { institutions, mddiSpeeches } from '~/data/voices';
import { levers, publicLeverGroups } from '~/data/levers';
import { ecosystemCategories } from '~/data/ecosystem';
import { unicorns, verticals, exits, investors } from '~/data/startups';
import { programmes as talentProgrammes } from '~/data/talent';
import { sections as legalSections } from '~/data/legal-ai';
import { benchmarkCases } from '~/data/benchmarking';
import { timelineEvents } from '~/data/timeline';
import { dimensions } from '~/data/tracker';
import { toTraditional } from '~/i18n/opencc';
import type { Lang } from '~/i18n';

// Directory card identity — one per listing page the homepage links to.
// Not the same as DataSource: 'voices' merges people+speech, 'timeline'
// has no DataSource at all (no addedAt on its records).
export type DomainKey =
  | 'policies'
  | 'debates'
  | 'videos'
  | 'voices'
  | 'levers'
  | 'ecosystem'
  | 'startups'
  | 'talent'
  | 'legal-ai'
  | 'benchmarking'
  | 'timeline'
  | 'tracker';

export interface DomainStat {
  key: DomainKey;
  href: string;
  count: number;
  latest?: Harvested;
}

// harvestAll() walks every data file; memoize the sorted result once per
// build process so the homepage + every listing page share one pass.
let _sorted: Harvested[] | null = null;

function sortedHarvest(): Harvested[] {
  if (!_sorted) {
    // localeCompare (not `< ? 1 : -1`): the old comparator never returned 0
    // for equal addedAt, which violates the comparator contract and lets
    // the engine shuffle same-day runs arbitrarily — the benchmarking card
    // surfaced the 2017 report-archive edition instead of the 2026 one.
    // A consistent comparator keeps sort stability, so same-day records
    // preserve harvest (data-file) order: newest-first arrays stay that way.
    _sorted = [...harvestAll()].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }
  return _sorted;
}

/** Latest N records for one domain (or a union of domains), addedAt desc. */
export function latestBySource(source: DataSource | DataSource[], limit = 5): Harvested[] {
  const wanted = new Set(Array.isArray(source) ? source : [source]);
  const out: Harvested[] = [];
  for (const h of sortedHarvest()) {
    if (!wanted.has(h.source)) continue;
    out.push(h);
    if (out.length >= limit) break;
  }
  return out;
}

/** Pick the display title of a harvested record for the current lang. */
export function harvestedTitle(h: Harvested, lang: Lang): string {
  if (lang === 'en') return h.enTitle;
  if (lang === 'ja') return h.jaTitle;
  if (lang === 'ko') return h.koTitle;
  if (lang === 'zh-tw') return toTraditional(h.zhTitle);
  return h.zhTitle;
}

// Synthesized "latest" for the timeline domain: newest event by precise
// date when present, else by year. Rendered through the same Harvested
// shape so the directory card code stays uniform.
function latestTimelineEntry(): Harvested | undefined {
  if (timelineEvents.length === 0) return undefined;
  // Future-dated events (the 2027 IOAI hosting entry) must not occupy the
  // "latest" slot until they happen — a card reading "最新 · 2027" for a
  // year is a freshness signal pointing at the future. Prefer the newest
  // event that has already occurred; fall back to the global newest only
  // if every event is in the future.
  const today = new Date().toISOString().slice(0, 10);
  const synthDate = (e: (typeof timelineEvents)[number]) => e.date ?? `${e.year}-01-01`;
  const sorted = [...timelineEvents].sort((a, b) => (synthDate(a) < synthDate(b) ? 1 : -1));
  const newest = sorted.find((e) => synthDate(e) <= today) ?? sorted[0];
  return {
    type: 'site',
    source: 'policy', // unused for display; timeline has no DataSource
    addedAt: newest.date ?? String(newest.year),
    zhTitle: newest.title,
    enTitle: newest.titleEn ?? newest.title,
    jaTitle: newest.titleJa ?? newest.titleEn ?? newest.title,
    koTitle: newest.titleKo ?? newest.titleEn ?? newest.title,
    href: '/timeline/',
  };
}

/**
 * One stat card per listing page, in the homepage directory's editorial
 * order. Counts are full record counts from the data files (not just the
 * addedAt-carrying subset harvestAll sees).
 */
export function domainStats(): DomainStat[] {
  const totalPolicies = policyCategories.flatMap((c) => c.policies).length;
  const totalLeverItems = levers.reduce((sum, lv) => sum + publicLeverGroups(lv).flatMap((g) => g.items).length, 0);
  const totalEcosystem = ecosystemCategories.flatMap((c) => c.entities).filter((e) => !e._pendingReview).length;
  const totalStartups = unicorns.length + verticals.flatMap((v) => v.startups).length + exits.length + investors.length;
  const totalLegal = legalSections.flatMap((s) => s.items).length;
  const totalVoices = people.length + institutions.length + mddiSpeeches.length;

  const first = (source: DataSource | DataSource[]): Harvested | undefined => latestBySource(source, 1)[0];

  return [
    { key: 'debates', href: '/debates/', count: debates.length, latest: first('debate') },
    { key: 'policies', href: '/policies/', count: totalPolicies, latest: first('policy') },
    { key: 'videos', href: '/videos/', count: videos.length, latest: first('video') },
    { key: 'voices', href: '/voices/', count: totalVoices, latest: first(['people', 'speech']) },
    { key: 'levers', href: '/levers/', count: totalLeverItems, latest: first('lever') },
    { key: 'ecosystem', href: '/ecosystem/', count: totalEcosystem, latest: first('ecosystem') },
    { key: 'startups', href: '/startups/', count: totalStartups, latest: first('startup') },
    { key: 'talent', href: '/talent/', count: talentProgrammes.length, latest: first('talent') },
    { key: 'legal-ai', href: '/legal-ai/', count: totalLegal, latest: first('legal') },
    { key: 'benchmarking', href: '/benchmarking/', count: benchmarkCases.length, latest: first('benchmark') },
    { key: 'timeline', href: '/timeline/', count: timelineEvents.length, latest: latestTimelineEntry() },
    { key: 'tracker', href: '/tracker/', count: dimensions.length, latest: first('tracker') },
  ];
}

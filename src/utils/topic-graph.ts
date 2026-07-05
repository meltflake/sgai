// src/utils/topic-graph.ts
// ────────────────────────────────────────────────────────────────────────
// Topic index over every content domain — the query layer behind the
// /topics/ hub pages and the SameTopicRail on detail pages.
//
// Sibling of graph.ts (explicit foreign-key resolution): this module owns
// the topic axis. Each record is normalized into one TopicEntry (localized
// titles + locale-unprefixed href + sort date + resolved topicIds via
// src/data/topic-mappings.ts), built once per SSG process.
//
// Blog posts are NOT indexed here — their frontmatter lives in the content
// collection, which a util can't read. Pages layer posts in themselves via
// getCollection('post') (same convention as RelatedBundle.postSlugs).

import { debates } from '~/data/debates';
import { categories as policyCategories } from '~/data/policies';
import { videos } from '~/data/videos';
import { levers } from '~/data/levers';
import { timelineEvents } from '~/data/timeline';
import { dimensions } from '~/data/tracker';
import { programmes as talentProgrammes } from '~/data/talent';
import { people } from '~/data/people';
import { unicorns, verticals, exits, investors } from '~/data/startups';
import { benchmarkCases } from '~/data/benchmarking';
import { topics, topicIdSet, type Topic } from '~/data/topics';
import {
  debateTopicIds,
  videoTopicIds,
  policyTopicIds,
  trackerTopicIds,
  leverTopicIds,
  talentTopicIds,
  ecosystemTopicIds,
  startupTopicIds,
  startupEntityTopicIds,
  benchmarkTopicIds,
  explicitTopicIds,
} from '~/data/topic-mappings';
import {
  leverSlug,
  legalItemPages,
  benchmarkCaseSlug,
  startupEntitySlug,
  ecosystemEntityPages,
} from '~/utils/entity-pages';

export type TopicEntryKind =
  | 'debate'
  | 'policy'
  | 'video'
  | 'lever'
  | 'timeline'
  | 'tracker'
  | 'talent'
  | 'legal'
  | 'benchmark'
  | 'startup'
  | 'ecosystem'
  | 'person';

export interface TopicEntry {
  kind: TopicEntryKind;
  /** `${kind}:${id-or-slug}` — stable self-exclusion key for rails. */
  key: string;
  topicIds: string[];
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleKo?: string;
  href: string; // locale-unprefixed; render through localizedHref()
  date?: string; // YYYY-MM-DD or YYYY; sort desc, undefined sinks
}

// ── Index build (once per build process) ────────────────────────────────

let _entries: TopicEntry[] | null = null;

function push(
  out: TopicEntry[],
  kind: TopicEntryKind,
  id: string,
  topicIds: string[],
  titles: { title: string; titleEn?: string; titleJa?: string; titleKo?: string },
  href: string,
  date?: string
) {
  if (topicIds.length === 0) return;
  out.push({ kind, key: `${kind}:${id}`, topicIds, ...titles, href, date });
}

function buildEntries(): TopicEntry[] {
  const out: TopicEntry[] = [];

  for (const d of debates) {
    push(
      out,
      'debate',
      d.id,
      debateTopicIds(d),
      { title: d.title, titleEn: d.titleEn, titleJa: d.titleJa, titleKo: d.titleKo },
      `/debates/${d.id}/`,
      d.date
    );
  }

  for (const c of policyCategories) {
    for (const p of c.policies) {
      if (!p.id) continue;
      push(
        out,
        'policy',
        p.id,
        policyTopicIds(p, c.name),
        { title: p.title, titleEn: p.titleEn, titleJa: p.titleJa, titleKo: p.titleKo },
        `/policies/${p.id}/`,
        p.date
      );
    }
  }

  for (const v of videos) {
    push(
      out,
      'video',
      v.id,
      videoTopicIds(v),
      { title: v.title, titleEn: v.titleEn, titleJa: v.titleJa, titleKo: v.titleKo },
      `/videos/${v.id}/`,
      v.date
    );
  }

  for (const lv of levers) {
    push(
      out,
      'lever',
      String(lv.number),
      leverTopicIds(lv),
      { title: lv.name, titleEn: lv.nameEn, titleJa: lv.nameJa, titleKo: lv.nameKo },
      `/levers/${leverSlug(lv)}/`
    );
  }

  for (const e of timelineEvents) {
    push(
      out,
      'timeline',
      e.id ?? `${e.year}-${e.title.slice(0, 12)}`,
      explicitTopicIds(e),
      { title: e.title, titleEn: e.titleEn, titleJa: e.titleJa, titleKo: e.titleKo },
      '/timeline/',
      e.date ?? String(e.year)
    );
  }

  for (const dim of dimensions) {
    push(
      out,
      'tracker',
      dim.id,
      trackerTopicIds(dim),
      { title: dim.title, titleEn: dim.titleEn, titleJa: dim.titleJa, titleKo: dim.titleKo },
      `/tracker/${dim.id}/`
    );
  }

  for (const prog of talentProgrammes) {
    push(
      out,
      'talent',
      prog.id,
      talentTopicIds(prog),
      { title: prog.name, titleEn: prog.nameEn, titleJa: prog.nameJa, titleKo: prog.nameKo },
      `/talent/${prog.id}/`
    );
  }

  for (const page of legalItemPages) {
    push(
      out,
      'legal',
      page.slug,
      explicitTopicIds(page.item),
      {
        title: page.item.title,
        titleEn: page.item.titleEn,
        titleJa: page.item.titleJa,
        titleKo: page.item.titleKo,
      },
      `/legal-ai/${page.slug}/`
    );
  }

  for (const bc of benchmarkCases) {
    push(
      out,
      'benchmark',
      bc.id,
      benchmarkTopicIds(bc),
      { title: bc.name, titleEn: bc.nameEn, titleJa: bc.nameJa, titleKo: bc.nameKo },
      `/benchmarking/${benchmarkCaseSlug(bc)}/`
    );
  }

  for (const u of unicorns) {
    push(out, 'startup', startupEntitySlug(u), startupEntityTopicIds(u), { title: u.name }, buildStartupHref(u));
  }
  for (const v of verticals) {
    for (const s of v.startups) {
      push(out, 'startup', startupEntitySlug(s), startupTopicIds(s, v.name), { title: s.name }, buildStartupHref(s));
    }
  }
  for (const x of exits) {
    push(out, 'startup', startupEntitySlug(x), startupEntityTopicIds(x), { title: x.name }, buildStartupHref(x));
  }
  for (const inv of investors) {
    push(
      out,
      'startup',
      startupEntitySlug(inv),
      startupEntityTopicIds(inv),
      { title: inv.name },
      buildStartupHref(inv)
    );
  }

  for (const page of ecosystemEntityPages) {
    if (page.entity._pendingReview) continue;
    push(
      out,
      'ecosystem',
      page.slug,
      ecosystemTopicIds(page.entity, page.category.name),
      {
        title: page.entity.name,
        titleEn: page.entity.nameEn,
        titleJa: page.entity.nameJa,
        titleKo: page.entity.nameKo,
      },
      `/ecosystem/${page.slug}/`
    );
  }

  for (const p of people) {
    push(
      out,
      'person',
      p.id,
      p.topicIds ?? [],
      { title: p.name, titleEn: p.nameEn, titleJa: p.nameJa, titleKo: p.nameKo },
      `/voices/${p.id}/`
    );
  }

  return out;
}

function buildStartupHref(entity: { id?: string; name: string; nameEn?: string }): string {
  return `/startups/${startupEntitySlug(entity)}/`;
}

export function topicEntries(): TopicEntry[] {
  return (_entries ??= buildEntries());
}

// ── Queries ─────────────────────────────────────────────────────────────

let _byTopic: Map<string, TopicEntry[]> | null = null;

function byTopic(): Map<string, TopicEntry[]> {
  if (!_byTopic) {
    const m = new Map<string, TopicEntry[]>();
    for (const entry of topicEntries()) {
      for (const id of entry.topicIds) {
        if (!topicIdSet.has(id)) continue;
        const arr = m.get(id);
        if (arr) arr.push(entry);
        else m.set(id, [entry]);
      }
    }
    // Newest first inside each topic; undated entries sink to the end.
    for (const arr of m.values()) {
      arr.sort((a, b) => {
        if (a.date && b.date) return a.date < b.date ? 1 : -1;
        if (a.date) return -1;
        if (b.date) return 1;
        return 0;
      });
    }
    _byTopic = m;
  }
  return _byTopic;
}

/** All entries for one topic, newest first. */
export function entriesByTopic(topicId: string): TopicEntry[] {
  return byTopic().get(topicId) ?? [];
}

/** Per-kind counts for a topic (hub header strip / index cards). */
export function topicKindCounts(topicId: string): Partial<Record<TopicEntryKind, number>> {
  const counts: Partial<Record<TopicEntryKind, number>> = {};
  for (const e of entriesByTopic(topicId)) {
    counts[e.kind] = (counts[e.kind] ?? 0) + 1;
  }
  return counts;
}

/** Topics ranked by co-occurrence with the given topic (shared records). */
export function relatedTopics(topicId: string, limit = 4): Topic[] {
  const score = new Map<string, number>();
  for (const e of entriesByTopic(topicId)) {
    for (const other of e.topicIds) {
      if (other === topicId) continue;
      score.set(other, (score.get(other) ?? 0) + 1);
    }
  }
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => topics.find((tp) => tp.id === id))
    .filter((tp): tp is Topic => Boolean(tp));
}

/**
 * Cross-domain "more on these topics" for a detail page. Scores every
 * entry by |shared topicIds| (desc), breaks ties newest-first, excludes
 * the anchor itself plus any keys the caller already renders elsewhere
 * (e.g. RelatedRail's explicit links).
 */
export function getSameTopic(selfKey: string, topicIds: string[], limit = 6, excludeKeys: string[] = []): TopicEntry[] {
  if (topicIds.length === 0) return [];
  const excluded = new Set([selfKey, ...excludeKeys]);
  const wanted = new Set(topicIds);
  const scored: Array<{ entry: TopicEntry; shared: number }> = [];
  const seen = new Set<string>();
  for (const id of topicIds) {
    for (const entry of entriesByTopic(id)) {
      if (excluded.has(entry.key) || seen.has(entry.key)) continue;
      seen.add(entry.key);
      const shared = entry.topicIds.filter((t) => wanted.has(t)).length;
      scored.push({ entry, shared });
    }
  }
  scored.sort((a, b) => {
    if (a.shared !== b.shared) return b.shared - a.shared;
    const ad = a.entry.date;
    const bd = b.entry.date;
    if (ad && bd) return ad < bd ? 1 : -1;
    if (ad) return -1;
    if (bd) return 1;
    return 0;
  });
  return scored.slice(0, limit).map((s) => s.entry);
}

/** Find one entry by its key — used by SameTopicRail to resolve the anchor. */
export function getTopicEntry(kind: TopicEntryKind, id: string): TopicEntry | undefined {
  return topicEntries().find((e) => e.key === `${kind}:${id}`);
}

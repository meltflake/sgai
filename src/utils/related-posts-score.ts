// Pure scoring for the "related posts" rail under a longform post.
//
// The old ranking (category + shared tags) collapsed into a near-tie:
// almost every post carries the same "观察" tag, so ordering was
// effectively arbitrary. Shared knowledge-graph pointers in frontmatter
// (levers / policies / debates / people / timeline years) are a far
// stronger signal, so they dominate here. Ties fall back to recency.
//
// Kept free of astro:content imports so it can run under node:test.

export interface RelatedScorable {
  slug: string;
  publishDate: Date;
  category?: { slug: string };
  tags?: Array<{ slug: string }>;
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedLeverNumbers?: number[];
  relatedTimelineYears?: number[];
  relatedPersonIds?: string[];
}

const WEIGHTS = {
  category: 5,
  tag: 1,
  lever: 3,
  policy: 3,
  debate: 3,
  person: 3,
  timelineYear: 1,
} as const;

function overlap<T>(a: T[] | undefined, b: T[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const set = new Set(a);
  let n = 0;
  for (const x of b) if (set.has(x)) n++;
  return n;
}

export function scoreRelatedPost(origin: RelatedScorable, candidate: RelatedScorable): number {
  let score = 0;
  if (origin.category && candidate.category && origin.category.slug === candidate.category.slug) {
    score += WEIGHTS.category;
  }
  score +=
    WEIGHTS.tag *
    overlap(
      origin.tags?.map((t) => t.slug),
      candidate.tags?.map((t) => t.slug)
    );
  score += WEIGHTS.lever * overlap(origin.relatedLeverNumbers, candidate.relatedLeverNumbers);
  score += WEIGHTS.policy * overlap(origin.relatedPolicyIds, candidate.relatedPolicyIds);
  score += WEIGHTS.debate * overlap(origin.relatedDebateIds, candidate.relatedDebateIds);
  score += WEIGHTS.person * overlap(origin.relatedPersonIds, candidate.relatedPersonIds);
  score += WEIGHTS.timelineYear * overlap(origin.relatedTimelineYears, candidate.relatedTimelineYears);
  return score;
}

/** Rank candidates by score desc, then newest first. Excludes the origin itself. */
export function rankRelatedPosts<T extends RelatedScorable>(origin: T, candidates: T[], maxResults: number): T[] {
  return candidates
    .filter((c) => c.slug !== origin.slug)
    .map((post) => ({ post, score: scoreRelatedPost(origin, post) }))
    .sort((a, b) => b.score - a.score || b.post.publishDate.getTime() - a.post.publishDate.getTime())
    .slice(0, Math.max(0, maxResults))
    .map((x) => x.post);
}

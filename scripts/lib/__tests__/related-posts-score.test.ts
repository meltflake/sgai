import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankRelatedPosts, scoreRelatedPost, type RelatedScorable } from '../../../src/utils/related-posts-score';

const d = (iso: string) => new Date(iso);
const guan = [{ slug: 'guan-cha' }];

const origin: RelatedScorable = {
  slug: 'origin',
  publishDate: d('2026-09-01'),
  category: { slug: 'opinion' },
  tags: guan,
  relatedLeverNumbers: [1, 3],
  relatedPolicyIds: ['nais-2'],
  relatedPersonIds: ['josephine-teo'],
  relatedTimelineYears: [2024],
};

test('shared graph pointers outrank the shared catch-all tag', () => {
  const tagOnly: RelatedScorable = { slug: 'a', publishDate: d('2026-08-30'), tags: guan };
  const leverMatch: RelatedScorable = { slug: 'b', publishDate: d('2026-01-01'), relatedLeverNumbers: [3] };
  assert.ok(scoreRelatedPost(origin, leverMatch) > scoreRelatedPost(origin, tagOnly));
});

test('rank excludes origin, sorts by score then recency, respects max', () => {
  const posts: RelatedScorable[] = [
    origin,
    { slug: 'old-tie', publishDate: d('2025-01-01'), tags: guan },
    { slug: 'new-tie', publishDate: d('2026-08-01'), tags: guan },
    { slug: 'strong', publishDate: d('2024-01-01'), relatedPolicyIds: ['nais-2'], relatedPersonIds: ['josephine-teo'] },
    { slug: 'none', publishDate: d('2026-08-31') },
  ];
  const ranked = rankRelatedPosts(origin, posts, 3).map((p) => p.slug);
  assert.deepEqual(ranked, ['strong', 'new-tie', 'old-tie']);
});

test('empty candidate list yields empty result', () => {
  assert.deepEqual(rankRelatedPosts(origin, [origin], 4), []);
});

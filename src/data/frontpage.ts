// src/data/frontpage.ts
// ────────────────────────────────────────────────────────────────────────
// Manual front-page editorial pointers. This file is a *pointer*, not a
// content record: it names which existing record leads the homepage focus
// slot. No addedAt, no i18n fields — the referenced record carries those.
//
// FEATURED: which item the homepage FocusHeadline shows.
//   - null → automatic fallback to the latest blog post.
//   - { kind, id } → pin a specific record:
//       kind 'post'   → id is the post slug (src/data/post/<slug>.md)
//       kind 'debate' → id from src/data/debates.ts
//       kind 'policy' → id from src/data/policies.ts
//       kind 'video'  → id from src/data/videos.ts

export type FeaturedKind = 'post' | 'debate' | 'policy' | 'video';

export interface FeaturedPointer {
  kind: FeaturedKind;
  id: string;
}

// 2026-09-05: null — the focus slot follows the latest longform post
// automatically. Editorial rule: every new longform piece takes the slot when
// it is published, so there is nothing to hand-edit here per post. Pin a
// debate / policy / video only when a dated story should outrank the latest
// post (e.g. the Digital Infrastructure Bill being tabled), then set it back
// to null once that story ages out.
// Previous pins: 'singapore-ai-agencies-map' (2026-08-20),
// 'openai-signals-chatgpt-at-work-2026' (2026-08-07).
export const FEATURED: FeaturedPointer | null = null;

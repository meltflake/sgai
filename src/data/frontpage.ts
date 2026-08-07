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

// 2026-08-07: lead with the OpenAI Signals translation — OpenAI's first
// country-by-country ChatGPT release puts Singapore #1 of 147 on messages
// per capita (Q2 2026), the third independent vendor dataset to rank it at
// or near the top after Anthropic (AUI 5.53, #1) and Microsoft (60.9%, #2).
// Swap back to the Digital Infrastructure Bill
// ('digital-infrastructure-bill-consultation-2026') when it is tabled in
// Parliament, or to whatever bigger story lands next.
export const FEATURED: FeaturedPointer | null = {
  kind: 'post',
  id: 'openai-signals-chatgpt-at-work-2026',
};

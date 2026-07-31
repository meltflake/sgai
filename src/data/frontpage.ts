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

// 2026-07-31: lead with the Digital Infrastructure Bill — July's biggest
// structural story (first hard-law licensing of the AI compute layer:
// ≥10MW DCs + ≥S$100m/yr IaaS/PaaS need licences, mandatory PUE floors).
// Consultation closed 22 Jul; swap or null this when the Bill is tabled in
// Parliament or a bigger story lands.
export const FEATURED: FeaturedPointer | null = {
  kind: 'policy',
  id: 'digital-infrastructure-bill-consultation-2026',
};

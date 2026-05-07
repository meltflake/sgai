// src/utils/quality.ts
// ────────────────────────────────────────────────────────────────────────
// Build-time content quality predicates. Used by detail-page templates to
// decide whether to emit `<meta name="robots" content="noindex">` and,
// transitively, whether the page lands in the sitemap (the sitemap config
// in astro.config.ts filters by the same noindex meta).
//
// Two principles:
//
//   (1) Predicates are data-driven. When a record's missing fields get
//       filled in later, the predicate flips automatically — no manual
//       `noindex` removal step needed.
//
//   (2) Predicates favor "preserve the URL, hide the page" over 404.
//       Internal cross-references (debate → person, policy → entity)
//       remain valid; only Google is told to skip indexing. When the
//       record gains substance, the URL re-enters the indexable pool.
//
// Mirrors (but does not import) the schema in scripts/i18n-config.ts.
// They serve different layers — i18n-config is the PR-time gate;
// this file is the build-time index policy. Mostly the same fields,
// but they can diverge: a record can be "complete enough to merge"
// yet still "thin enough to deserve noindex" until it accrues
// graph signal (debates/policies/videos).

import type { Person } from '~/data/people';
import type { EcosystemEntity } from '~/data/ecosystem';
import { videos } from '~/data/videos';
import { getPersonCounts } from '~/utils/graph';

// ── Voices (people) ─────────────────────────────────────────────────────

/**
 * "三无人物" predicate — no curated contributions AND no graph signal
 * (zero parliamentary debates, zero policies championed, zero AI videos).
 *
 * This catches the long tail of MP stub profiles auto-loaded from
 * `mp-stubs.json` that have name + title but otherwise read like
 * Wikipedia-stubs. They're useful as graph nodes (debate → MP backlink)
 * but should not compete for crawl budget against substance pages.
 */
export function isLowSignalPerson(p: Person): boolean {
  const hasContributions =
    (p.signatureWork?.length ?? 0) > 0 ||
    (p.notableQuotes?.length ?? 0) > 0 ||
    (p.speakingRecord?.length ?? 0) > 0 ||
    (p.externalRoles?.length ?? 0) > 0;
  if (hasContributions) return false;

  const counts = getPersonCounts(p.id);
  if (counts.debateCount > 0 || counts.policyAuthorCount > 0) return false;

  if (countVideosForPerson(p) > 0) return false;

  return true;
}

function countVideosForPerson(p: Person): number {
  const primary = p.nameEn || p.name;
  const aliases = p.aliases || [];
  let n = 0;
  for (const v of videos) {
    if (v.speaker === primary || aliases.includes(v.speaker)) n += 1;
  }
  return n;
}

// ── Ecosystem entities ──────────────────────────────────────────────────

/**
 * Required deep fields per locale for an ecosystem entity to be considered
 * indexable. Mirror of the `entity` schema in scripts/i18n-config.ts —
 * intentionally duplicated to keep src/ free of cross-directory imports
 * into scripts/. Drift is caught by Phase 0's gate (which fails the build
 * if a required field is missing in any locale), so this list and the
 * gate's list cannot silently disagree.
 */
const ECOSYSTEM_ENTITY_REQUIRED_FIELDS = [
  'name',
  'description',
  'whatItIs',
  'aiRelevance',
  'singaporeRelevance',
] as const;

/**
 * True when the entity is missing any required field for the given lang.
 * Use for noindex on ecosystem detail pages — prevents English pages
 * from falling back to Chinese content (the upstream of GSC's "Duplicate,
 * Google chose different canonical" bucket).
 */
export function isStubEcosystemEntity(e: EcosystemEntity, lang: 'en' | 'zh'): boolean {
  const suffix = lang === 'en' ? 'En' : '';
  for (const field of ECOSYSTEM_ENTITY_REQUIRED_FIELDS) {
    const key = `${field}${suffix}` as keyof EcosystemEntity;
    const value = e[key];
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
  }
  return false;
}

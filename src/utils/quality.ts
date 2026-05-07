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
 * Low-signal voice profile predicate. Two-tier threshold based on whether
 * the bio summary is real prose or a placeholder stub:
 *
 *   - Curated contributions present (signatureWork / notableQuotes /
 *     speakingRecord / externalRoles) → always indexable.
 *
 *   - Real bio summary + ANY graph signal (debate / policy / video) →
 *     indexable. The bio differentiates the page even with one signal.
 *
 *   - Stub summary ([需补充] prefix or "Profile pending.") + < 2 graph
 *     signals → noindex. Why two: a stubbed-summary page with zero or
 *     one debate link is templated boilerplate; multiple such pages
 *     share content fingerprints, which is what causes GSC's
 *     "Duplicate, Google chose different canonical" bucket.
 *
 *   - Stub summary + 2+ graph signals → indexable. Multiple debate
 *     associations introduce enough linked-content variation to
 *     differentiate the page despite the boilerplate bio.
 *
 * Auto-flips back to indexable on first build after a profile gains
 * substance (a real summary, a curated contribution, or a 2nd debate).
 */
export function isLowSignalPerson(p: Person): boolean {
  const hasContributions =
    (p.signatureWork?.length ?? 0) > 0 ||
    (p.notableQuotes?.length ?? 0) > 0 ||
    (p.speakingRecord?.length ?? 0) > 0 ||
    (p.externalRoles?.length ?? 0) > 0;
  if (hasContributions) return false;

  const counts = getPersonCounts(p.id);
  const totalGraphSignals = counts.debateCount + counts.policyAuthorCount + countVideosForPerson(p);

  // Threshold depends on whether the bio is real or a placeholder.
  // Stub bios collapse into duplicate-canonical clusters at ≤ 1 signal.
  const threshold = isStubSummary(p) ? 2 : 1;
  return totalGraphSignals < threshold;
}

function isStubSummary(p: Person): boolean {
  const s = p.summary || '';
  const se = p.summaryEn || '';
  if (s.length === 0) return true;
  if (s.startsWith('[需补充]')) return true;
  if (s === 'Profile pending.') return true;
  if (se === 'Profile pending.') return true;
  return false;
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

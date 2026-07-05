// src/version.ts
// ────────────────────────────────────────────────────────────────────────
// SITE_VERSION: manually bumped on releases (semver, monthly patch bump by
//               scripts/refresh/github-stars.ts when stars-data changes).
//
// SITE_UPDATED: DERIVED from data files. Computed at build time as the
//               max(date) across the derived updates feed (every record's
//               addedAt) and the MANUAL_UPDATES editorial ledger.
//
// Why derived: SITE_UPDATED used to be hand-edited and routinely drifted —
// e.g. between 2026-05-10 and 2026-05-21, 11 commits touched data files
// (ATxSummit feat / NANA archive / MDDI voices auto-PR / videos fixes …)
// but the constant stayed at 2026-05-10, so the footer / About / homepage
// hero / llms.txt / JSON-LD dateModified all silently lied. This is the
// same bug class that the 2026-05-09 updates.ts ledger drift (commit
// a608bc0 → PR #30) eliminated by deriving from `addedAt`. Apply the
// identical fix here. The addedAt-coverage CI gate already guarantees
// every new record carries an addedAt, so the max() value is trustworthy.

import { deriveUpdates } from '~/utils/derived-updates';
import { MANUAL_UPDATES } from '~/data/updates';

export const SITE_VERSION = '0.22.0';

// Pre-rule fallback: only used when no record carries addedAt yet (which
// cannot happen in the current repo — kept for type-narrowing and to make
// the derive function total).
const SITE_UPDATED_FALLBACK = '2026-05-21';

function computeSiteUpdated(): string {
  const dates = [...deriveUpdates(), ...MANUAL_UPDATES].map((u) => u.date);
  if (dates.length === 0) return SITE_UPDATED_FALLBACK;
  return dates.reduce((a, b) => (a > b ? a : b));
}

export const SITE_UPDATED: string = computeSiteUpdated();

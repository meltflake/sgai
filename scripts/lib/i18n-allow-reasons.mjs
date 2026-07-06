// scripts/lib/i18n-allow-reasons.mjs
// ────────────────────────────────────────────────────────────────────────
// Registry of legitimate `data-i18n-allow-{cjk,en}` reasons.
//
// Every marker block in the built HTML carries a reason string, e.g.
// `data-i18n-allow-en="hansard-transcript-verbatim"`. i18n-check.mjs strips
// those blocks from the visible-text scan so verbatim source (Hansard,
// transcripts, EN fallbacks) doesn't fire the foreign-script / EN-sentence
// scanners. This registry declares WHICH reasons are legitimate and on
// WHICH locales — so the scanner can flag a marker that is either unknown
// or used on a locale where it should never appear.
//
// Why per-locale scoping matters (this is the 2026-07 fallback-leak fix):
//   Components historically used `lang === 'ko' || lang === 'zh-tw'` to mark
//   an EN-fallback block. That marker suppresses the scan on BOTH locales.
//   But zh-tw derives from zh via OpenCC — it should NEVER show EN fallback.
//   So `*-en-fallback` reasons are legitimate ONLY on `ko` (the one locale
//   whose data siblings are optional). Seeing them on a zh-tw page is a
//   real leak that must be surfaced, not silently suppressed.
//
// Shape of each entry:
//   attr  — which marker attribute(s) this reason is valid on:
//             'data-i18n-allow-en'  → EN verbatim / EN fallback
//             'data-i18n-allow-cjk' → CJK verbatim (zh source quoted on
//                                     an EN/JA page)
//             'both'                → valid on either attribute
//   langs — which locales this reason may legitimately appear on:
//             'all'          → any locale (verbatim source, quoted originals)
//             ['ko', ...]    → only these locales; anywhere else = violation
//
// i18n-check.mjs consults this map when it encounters a marker block. Rules:
//   - reason registered AND current lang in langs → strip (legitimate).
//   - reason unknown, OR current lang not in langs → STILL strip (so the
//     wrapped content isn't double-reported by the foreign-script scan),
//     but record a marker-violation that flows through the same per-lang
//     severity (ratchet / error) as EN-sentence hits.
//
// When you add a new marker in a component/page, register its reason here.
//
// ── TRUST BOUNDARY (read before touching a `langs: 'all'` reason) ────────
// The six `langs: 'all'` verbatim reasons below (hansard-original,
// hansard-transcript-verbatim, speech-verbatim-source,
// video-transcript-verbatim, citation-original, debate-title-original) are a
// TRUSTED, UNVALIDATED escape hatch — the i18n equivalent of
// dangerouslySetInnerHTML. Content wrapped in them is stripped from the scan
// on EVERY locale with NO marker-violation recorded. There is no structural
// check that the wrapped text is actually verbatim source, so the scanner
// cannot tell a real Hansard quote from fabricated English someone wrapped to
// silence it.
//
// Therefore these reasons are ONLY for TRUE verbatim originals — Hansard
// English, MDDI speech / video-transcript originals, and bibliographic
// citation quotations. They must NEVER be used to muffle a component/field
// FALLBACK leak (e.g. an EN string rendered on zh-tw because a component
// branched `lang !== 'zh'`). That is what the ko-only `*-en-fallback` reasons
// and the zh-tw marker=error gate exist to surface; laundering such a leak
// through an all-locale verbatim reason defeats the entire ratchet.
//
// Adding a new `langs: 'all'` reason — or widening an existing reason to
// 'all' — requires (a) a PR justification of why the content is genuinely
// verbatim, and (b) updating the registry unit test
// (scripts/lib/__tests__/i18n-allow-reasons.test.ts), which pins the exact
// attr + langs of every reason and fails on any silent change. See CLAUDE.md
// rule #13.

/**
 * @typedef {Object} AllowReason
 * @property {'data-i18n-allow-en'|'data-i18n-allow-cjk'|'both'} attr
 * @property {'all'|string[]} langs
 */

/** @type {Record<string, AllowReason>} */
export const ALLOW_REASONS = {
  // ── Verbatim / original source (legitimate on every locale) ────────────
  // Original Hansard English source quoted inside a debate detail/index page.
  'hansard-original': { attr: 'both', langs: 'all' },
  'hansard-transcript-verbatim': { attr: 'data-i18n-allow-en', langs: 'all' },
  // MDDI speech verbatim source (zh original quoted on EN/JA, EN original on zh).
  'speech-verbatim-source': { attr: 'both', langs: 'all' },
  // YouTube transcript verbatim block on video detail pages.
  'video-transcript-verbatim': { attr: 'data-i18n-allow-en', langs: 'all' },
  // Pre-registered for B2/B4 (not yet emitted in source):
  //   generic citation / source-quote block (verbatim original quotation).
  'citation-original': { attr: 'both', langs: 'all' },
  //   debate EN original title rendered as a subtitle beneath the localized one.
  'debate-title-original': { attr: 'both', langs: 'all' },

  // ── EN-fallback (legitimate ONLY on ko — zh-tw appearing = violation) ──
  // Video AI digest with no ko translation yet falls back to en.
  'video-digest-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  // Benchmarking profile prose with no ko sibling falls back to en.
  'benchmark-case-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  'benchmark-region-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  // About-page prose with no ko sibling falls back to en.
  'about-prose-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  // (removed 2026-07: benchmark-drilldown-en-fallback + startup-en-fallback —
  //  entity-pages.ts now synthesizes full ja/ko siblings, so those pages carry
  //  real Korean and the masking markers were deleted from their components.)
};

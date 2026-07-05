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
  'benchmark-drilldown-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  // About-page prose with no ko sibling falls back to en.
  'about-prose-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
  // Startup profile prose with no ko sibling falls back to en.
  'startup-en-fallback': { attr: 'data-i18n-allow-en', langs: ['ko'] },
};

// CJK-aware SEO text-budget helpers for <title> / <meta name="description">.
//
// Google truncates SERP snippets by rendered pixel width, not by character
// count: a CJK glyph is roughly twice as wide as a Latin one (~80 CJK chars
// fill the same description slot as ~160 Latin chars). We approximate the
// pixel budget with weighted units — CJK char = 2, everything else = 1 —
// so one budget number works across all five site locales.
//
// This module must stay dependency-free (no `astrowind:config`, no `~/`
// aliases): scripts/lib/__tests__/seo-meta.test.ts imports it directly
// under `tsx --test`, outside the Astro build.

// Han + kana + Hangul + CJK punctuation/fullwidth forms, as \u escapes —
// literal range chars would trip ESLint no-irregular-whitespace (U+3000).
// BMP-only ranges; astral chars (emoji, CJK ext B) fall through to weight 1,
// which is fine for a display-width approximation.
const CJK_CHAR =
  /[\u2e80-\u2eff\u3000-\u303f\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef\uac00-\ud7af]/;

// A cut between two of these splits a Latin word / number — never cut there.
const WORD_CHAR = /[A-Za-z0-9\u00c0-\u024f]/;

// Separators / openers that look orphaned right before an ellipsis.
const DANGLING_TAIL =
  /[\s,;:([{'"\u00ab\u00b7\u2013\u2014\u3001\u3008\u300a\u300c\u300e\u3010\uff08\uff0c\uff1a\uff1b-]+$/;

// A kept fragment ending on a sentence terminator is already clean — no
// ellipsis needed after it.
const SENTENCE_END = /[.!?\u3002\uff01\uff1f\u2026]$/;

/** Approximate SERP display width: CJK chars count 2 units, others 1. */
export const weightedLength = (text: string): number => {
  let units = 0;
  for (const ch of text) units += CJK_CHAR.test(ch) ? 2 : 1;
  return units;
};

/** Collapse whitespace and cut `text` to at most `maxUnits` weighted units
 *  without breaking mid-word: Latin runs retreat to the previous word
 *  boundary; CJK cuts are safe at any character (every CJK char is its own
 *  boundary), matching the "句读/字符" rule for zh/ja. Appends `…` unless
 *  the cut already lands on a sentence terminator. */
export const truncateAtBoundary = (text: string, maxUnits = 160): string => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (weightedLength(clean) <= maxUnits) return clean;

  const chars = Array.from(clean);
  // Hard cut: keep chars[0..cut), reserving 1 unit for the ellipsis.
  let units = 0;
  let cut = chars.length;
  for (let i = 0; i < chars.length; i++) {
    units += CJK_CHAR.test(chars[i]) ? 2 : 1;
    if (units > maxUnits - 1) {
      cut = i;
      break;
    }
  }
  // Retreat while the cut would split a Latin word/number. Give up past
  // 60% of the window (pathological single-token text) and cut hard.
  const floor = Math.floor(cut * 0.6);
  let end = cut;
  while (end > floor && WORD_CHAR.test(chars[end - 1]) && WORD_CHAR.test(chars[end])) end--;
  if (end <= floor && WORD_CHAR.test(chars[end - 1]) && WORD_CHAR.test(chars[end])) end = cut;

  const kept = chars.slice(0, end).join('').replace(DANGLING_TAIL, '');
  return SENTENCE_END.test(kept) ? kept : `${kept}…`;
};

/** Build a meta description from prose fragments: strip markdown syntax
 *  (fenced code, links, emphasis, headings, list markers), collapse
 *  whitespace, join with a space, and cut at a word boundary within
 *  `maxUnits` weighted units (default 160 ≈ 160 Latin chars ≈ 80 CJK).
 *  Data fields like whatItIs / judgment are authored as markdown body copy,
 *  so they can't go into <meta name="description"> verbatim. Fenced code
 *  blocks in particular (e.g. an entity's ```yaml config example) must be
 *  dropped WHOLE — stripping only the backtick fences would flatten the
 *  code body into the snippet ("yaml nodes: - input.visual: source: webcam
 *  …"), which also trips the ja/ko enSentence purity ratchet. */
export const synthesizeMetaDescription = (parts: Array<string | null | undefined>, maxUnits = 160): string => {
  const text = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .join('\n')
    .replace(/```[\s\S]*?```/g, ' ') // drop fenced code blocks whole (before other strips)
    .replace(/^[ \t]*[-*+]\s+/gm, '') // drop list-item markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [label](url) → label
    .replace(/[*_`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateAtBoundary(text, maxUnits);
};

// scripts/lib/transcript-noise.ts
// ────────────────────────────────────────────────────────────────────────
// Single source of truth for "page chrome that leaked into a fetched
// transcript body". Used in two places (see docs/refresh-playbook.md):
//
//   1. scripts/refresh/voices/fetch.ts — filter at extraction time so the
//      noise never enters a transcript (treat-the-cause).
//   2. scripts/evals/transcript-quality/check.ts — CI diff gate + weekly
//      audit that FAILS if any committed transcript paragraph matches a
//      noise pattern (catch-the-leak; no human spot-check needed).
//
// Why a shared list: the 2026-06-20 backfill leaked two distinct noise
// kinds (MDDI breadcrumb "Newsroom <Title> Speeches" + the CMS "This
// article has been migrated…" notice). They slipped every existing check
// because those check structure (i18n pairing, paragraph non-emptiness),
// never content. When a NEW noise kind appears, the eval flags it once →
// add the pattern HERE → both the fetch filter and the gate cover it.
//
// Matching is intentionally on the ENGLISH paragraph: zh/ja/ko are machine
// translations of it, so an English body free of chrome guarantees the
// other languages are too. Patterns are anchored / specific to avoid
// matching a speech that merely *mentions* privacy, a newsletter, etc.
//
// Footer/legal phrases need one extra guard beyond the regex. "Privacy
// Policy" and "Terms of Use" are real footer links AND ordinary things a
// digital-policy minister says out loud — the 2026-07-28 Singapore Data
// Festival speech contains "they can update the privacy policy to state
// that call recordings ... will be used to train and improve AI models",
// which is body text, not chrome. Footer chrome is always a short
// standalone line ("Privacy Statement", "© 2026 Government of Singapore");
// a sentence carrying an argument is not. So footer patterns carry
// `standalone: true` and only fire on paragraphs short enough to be
// chrome. Without this, the gate flags legitimate policy speeches and
// becomes unusable — the exact failure mode the header warns about.

/** Longest a paragraph can be and still plausibly be footer chrome rather
 *  than prose. MDDI's longest real footer line ("© 2026 Government of
 *  Singapore, last updated 27 July 2026") is ~56 chars; the shortest
 *  false positive seen in a speech body was ~230. 120 sits clear of both. */
export const CHROME_MAX_LEN = 120;

export const NOISE_PATTERNS: ReadonlyArray<{ re: RegExp; label: string; standalone?: true }> = [
  // Site navigation / breadcrumb leaking as the first body paragraph.
  { re: /^\s*Newsroom\b/i, label: 'breadcrumb:Newsroom' },
  { re: /^\s*(Home|Menu|Search|Skip to (main )?content)\b/i, label: 'nav' },
  // CMS migration notice injected into older MDDI articles.
  { re: /has been migrated from an earlier version of the site/i, label: 'cms:migrated' },
  // Newsletter / scam / JS-required boilerplate. These phrasings do not
  // occur in speech bodies, so they need no length guard.
  { re: /Subscribe to our newsletter/i, label: 'cms:newsletter' },
  { re: /Call the 24\/7 ScamShield/i, label: 'cms:scamshield' },
  { re: /ScamShield Helpline/i, label: 'cms:scamshield' },
  { re: /please enable JavaScript/i, label: 'cms:js-required' },
  // Footer / legal — see CHROME_MAX_LEN note above.
  { re: /\bAll Rights Reserved\b/i, label: 'footer:rights', standalone: true },
  { re: /©\s*\d{4}/, label: 'footer:copyright', standalone: true },
  { re: /\bPrivacy (Policy|Statement)\b/i, label: 'footer:privacy', standalone: true },
  { re: /\bTerms of Use\b/i, label: 'footer:terms', standalone: true },
  // MDDI publication registration stamp, e.g. "MDDI (P) 025/05/2026".
  { re: /\bMDDI \(P\) \d{3}\/\d{2}\/\d{4}/, label: 'footer:mddi-reg', standalone: true },
];

export interface NoiseHit {
  index: number;
  text: string;
  label: string;
}

/** Find page-chrome noise paragraphs in a transcript's paragraph list.
 *  Pass the ENGLISH paragraphs (paragraphsEn) — that's the source the
 *  other languages translate from. Returns one hit per offending
 *  paragraph (first matching pattern wins). */
export function findNoiseParagraphs(paragraphs: readonly string[]): NoiseHit[] {
  const hits: NoiseHit[] = [];
  paragraphs.forEach((p, index) => {
    const label = matchNoiseLabel(p);
    if (label) hits.push({ index, text: p.slice(0, 90), label });
  });
  return hits;
}

/** The label of the first noise pattern this paragraph matches, or null
 *  when it is clean. `standalone` patterns additionally require the
 *  paragraph to be short enough to be page chrome rather than prose. */
function matchNoiseLabel(text: string): string | null {
  const isChromeLength = text.trim().length <= CHROME_MAX_LEN;
  for (const { re, label, standalone } of NOISE_PATTERNS) {
    if (standalone && !isChromeLength) continue;
    if (re.test(text)) return label;
  }
  return null;
}

/** True if a single paragraph is page-chrome noise. Used by the fetch
 *  filter (extractPs) to drop a paragraph at extraction time. */
export function isNoiseParagraph(text: string): boolean {
  return matchNoiseLabel(text) !== null;
}

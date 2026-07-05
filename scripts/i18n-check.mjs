#!/usr/bin/env node
// i18n consistency check — scans a built locale directory for residue
// of any other locale's script.
//
// Run after `npm run build`:
//   node scripts/i18n-check.mjs                   # scan EN at dist/ (excluding /zh/)
//   node scripts/i18n-check.mjs --lang en         # same as above
//   node scripts/i18n-check.mjs --lang zh         # scan ZH at dist/zh/
//   node scripts/i18n-check.mjs --lang en --root dist
//   node scripts/i18n-check.mjs --all             # scan every locale from src/i18n/index.ts
//   node scripts/i18n-check.mjs --all --update-en-baseline
//                                                 # re-snapshot the EN-sentence /
//                                                 # marker-violation ratchet baseline
//                                                 # (scripts/i18n-check.baseline.json)
//
// Layout (post-Phase-2): EN is the route default and lives at the bare
// dist/ root; non-default locales live under dist/<lang>/. The script
// scopes the scan accordingly.
//
// Strategy:
//   1. Walk dist/<lang>/**.html
//   2. Strip <script>, <style>, <head>, HTML comments, attributes
//   3. Match the "foreign script" regex defined per target lang
//   4. Allow-list a small set of intentional cross-lang strings
//      (lang banner copy, switcher labels)
//   5. Report unique residual strings per page; exit non-zero if any
//
// The default config below targets EN pages and flags CJK Unified
// Ideographs. To support a new locale L, add a config entry under
// LANG_CONFIG. The script is locale-agnostic; only the regex and
// allow-list change per target.

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

import { getProjectLocaleConfig } from './lib/i18n-locales.mjs';
import { ALLOW_REASONS } from './lib/i18n-allow-reasons.mjs';

// Parse --lang and --root flags.
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const CHECK_ALL = argv.includes('--all');
// When set, snapshot the current EN-sentence + marker-violation counts into
// the ratchet baseline (scripts/i18n-check.baseline.json) instead of failing.
const UPDATE_EN_BASELINE = argv.includes('--update-en-baseline');
const ROOT_BASE = arg('--root', 'dist');
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const EN_BASELINE_PATH = join(SCRIPT_DIR, 'i18n-check.baseline.json');
const PROJECT_I18N = getProjectLocaleConfig();
// EN is the route-default locale and lives at the bare ROOT_BASE.
// Other locales live under ROOT_BASE/<lang>/. Lang codes double as URL
// segments (kebab-cased where needed, e.g. 'zh-tw' → /zh-tw/).
const ROUTE_DEFAULT = PROJECT_I18N.routeDefaultLocale;
const LOCALES = PROJECT_I18N.locales;
let LANG = arg('--lang', ROUTE_DEFAULT);
let ROOT = LANG === ROUTE_DEFAULT ? ROOT_BASE : `${ROOT_BASE}/${LANG}`;
// Subdirs to skip when scanning the route-default root (those belong to
// other locales). Derived from LOCALES so a new locale cannot bypass the scan.
let SKIP_SUBDIRS = new Set(LANG === ROUTE_DEFAULT ? LOCALES.filter((locale) => locale !== ROUTE_DEFAULT) : []);

// Per-target-lang config. Each entry says "what foreign script should
// NOT appear on a page in this locale", plus intentional exceptions.
//
//   foreignRegex   — capture candidate runs of suspect script.
//   validate       — optional per-match filter (returns true if the
//                    match really IS foreign residue). Defaults to
//                    "always foreign" if absent.
//   allowPatterns  — exact-substring exemptions for known-good copy
//                    (lang banners, toggle labels, branded text).
//   sentenceScan   — optional sentence-level scan for the "wrong-language
//                    sentence" failure mode. Catches the case where the
//                    foreignRegex is fine (no foreign-script chars per se)
//                    but a whole sentence is in the wrong language entirely
//                    — e.g. a JA page rendering "Read more →" or
//                    "The framework was launched in 2024…" because the
//                    .astro template has `lang === 'zh' ? '...' : 'EN'`
//                    and ja silently falls into the EN branch. Without
//                    this, the existing `data-i18n-allow-cjk` markers
//                    suffice for verbatim source (hansard, transcripts),
//                    but inline EN UI text leaks through invisibly.
//                    See Layer D in scripts/evals/i18n-coverage/check.ts.
//
//   enSentence     — sentence-level EN-residue scan config. Fields:
//                      minTokens        — min EN word tokens to flag (ja/ko=4,
//                                         zh/zh-tw=6; zh names/short quotes are
//                                         noisier so the bar is higher).
//                      nativeScriptRegex — a sentence containing this locale's
//                                         native script is NOT EN residue and is
//                                         skipped. ja=kana, ko=hangul, zh/zh-tw=Han.
//                                         (For ja, kanji is NOT "native script"
//                                         here — a kana-free run may still be
//                                         zh residue; only kana proves Japanese.)
//                      allowPatterns    — brand / programme proper nouns that
//                                         are legal EN even on a target-locale
//                                         page. Shared across locales via
//                                         EN_SENTENCE_ALLOW below.
//   enSentenceSeverity — 'error' | 'ratchet'. 'error' → any EN-sentence or
//                    marker-violation fails immediately. 'ratchet' → compared
//                    against scripts/i18n-check.baseline.json per page; only a
//                    count ABOVE baseline fails. All locales are 'ratchet' in
//                    this phase (existing render-layer leaks are tolerated and
//                    burned down by later tasks).

// Brand / programme proper nouns that are legal EN on ANY target-locale page.
// Shared by ja / ko / zh / zh-tw enSentence scans (previously duplicated in
// ja and ko). Each entry is an exact-substring check against a suspect
// sentence; one hit exempts the whole sentence.
const EN_SENTENCE_ALLOW = [
  // Site identity / branding (allowed in all locales).
  'Singapore AI Observatory',
  'sgai',
  // LanguageToggle button label.
  'English',
  // Policy / programme proper nouns that legitimately appear inside
  // target-locale sentences. Re-casing these per locale is wrong.
  'Smart Nation',
  'AI Singapore',
  'AI Verify',
  'SEA-LION',
  'NAIS 2.0',
  'NAIS2.0',
  'Model AI Governance Framework',
  'National AI Strategy',
  'AI Centre of Excellence',
  'AI Trailblazers',
  'SkillsFuture',
  'GenAI Sandbox',
  'TechSkills Accelerator',
  'OpenAI',
  'Anthropic',
  'GovTech',
  'GovAI',
];

const LANG_CONFIG = {
  zh: {
    // Simplified Chinese is the source locale. Source-level completeness
    // ensures required bare fields exist; this dist check catches accidental
    // Japanese/Korean script leakage in rendered zh pages.
    foreignRegex: /[\u3040-\u30ff\uac00-\ud7af]+/g,
    allowPatterns: [
      // LanguageToggle: dropdown language labels.
      '한국어',
      // Legit foreign-language terms quoted inside zh source content.
      'おもてなし',
      'こもり',
    ],
    // Sentence-level EN-residue scan. A zh page rendering a whole English
    // sentence (component hardcoded `lang === 'zh' ? ... : 'EN'` and zh fell
    // into the EN branch, or a source field with no zh value) is a leak.
    // minTokens is 6 (vs ja/ko 4): zh pages carry more incidental English
    // (person names, short quotes) so the bar is raised to cut noise.
    // nativeScriptRegex is Han — any sentence with a Chinese character is
    // native content, not EN residue, and is skipped.
    enSentence: {
      minTokens: 6,
      nativeScriptRegex: /[一-鿿]/,
      allowPatterns: EN_SENTENCE_ALLOW,
    },
    enSentenceSeverity: 'ratchet',
  },
  en: {
    // English pages must not contain CJK, Japanese kana, or Korean
    // hangul. This is stricter than "no Chinese": English output often
    // starts from zh drafts, so source-language fragments must hard-fail.
    foreignRegex: /[一-鿿぀-ゟ゠-ヿ가-힣]+(?:[一-鿿぀-ゟ゠-ヿ가-힣\s·。，、！？：；'-]*[一-鿿぀-ゟ゠-ヿ가-힣]+)*/g,
    // Strings that ARE allowed despite containing non-Latin script.
    allowPatterns: [
      // LangBanner: invite user to switch to zh.
      '中文版可用',
      '阅读中文版',
      // LanguageToggle: dropdown language labels.
      '中文',
      '日本語',
      '한국어',
    ],
    // EN is the route default; we don't sentence-scan it for residue of
    // any other language. (CJK residue is already caught by foreignRegex
    // above, and ja residue on EN pages would be hyper-rare.)
  },
  ja: {
    // Match CJK Unified Ideographs runs (same as en regex). The hard
    // problem: Japanese uses kanji, so the regex captures both legitimate
    // Japanese (e.g. 人工知能政策) and residual zh (e.g. 智能国家 2.0).
    // We discriminate via the `validate` callback below.
    foreignRegex: /[一-鿿]+(?:[一-鿿\s·。，、！？：；'-]*[一-鿿]+)*/g,
    // Two-tier discrimination:
    //
    // Tier 1 — simplified-Chinese-only characters. These are codepoints
    //   used in Simplified Chinese but not in Japanese JIS kanji, where
    //   Japanese has a different codepoint for the equivalent meaning
    //   (e.g. 战 zh / 戦 ja, 经 zh / 経 ja, 转 zh / 転 ja, 这 zh / no
    //   ja kanji, 们 zh / 達 ja). If the run contains ANY of these,
    //   it's almost certainly Chinese residue regardless of context.
    //
    // Tier 2 — kana proximity. For runs without simplified-only tells
    //   (i.e., runs composed entirely of kanji that exist in BOTH
    //   languages), allow on the assumption that they're Japanese
    //   labels (出典, 投入強度, 第二期, 試験環境, 計算能力基盤, etc).
    //   The previous "no kana adjacent ⇒ Chinese" rule produced a flood
    //   of false positives on data-driven JA pages where labels appear
    //   in cards/breadcrumbs without surrounding kana flow.
    //
    // Trade-off: this misses Chinese sentences whose every character
    // happens to overlap with Japanese kanji (rare in policy/AI domain
    // content; common only in proper nouns like 新加坡 ⇒ シンガポール).
    // Net effect on real residue: most Chinese sentences contain at
    // least one simplified-only character (战 / 经 / 这 / 现 / 转 / 国家级
    // → 级, etc.), so coverage stays high while noise collapses.
    validate: (match) => {
      const run = match[0];
      // Tier 1: simplified-Chinese-exclusive codepoints. Curated for
      // policy/AI corpus — high-frequency simplified chars whose JA
      // kanji equivalent uses a different codepoint.
      // Set was hand-curated by checking each char's codepoint against
      // the Japanese JIS X 0208 set. Chars used in BOTH languages (e.g.
      // 那 in 旦那, 点 in 観点, 双 in 双子, 区 in 区別, 条 in 条件)
      // are excluded — they would cause false positives on JA labels.
      const SIMPLIFIED_ONLY =
        /[们这个让给还经历战业长进应时现过对边远难听说话网决织续选责险验总较单风转务习头质闻关开师龙标异该后处见级观产场际线门约电汉东种钟严员问纸读买卖钱实询试讲请运银项报]/;
      if (SIMPLIFIED_ONLY.test(run)) return true;
      // Tier 2: no simplified tell — treat as Japanese.
      return false;
    },
    allowPatterns: [
      // LangBanner: invite user to switch to ja.
      '日本語版あり',
      '日本語で読む',
      // LanguageToggle: target-language button labels.
      '中文',
      '日本語',
    ],
    // Sentence-level EN-residue scan. Catches sentences with ≥4 English
    // tokens AND zero kana — i.e., a whole sentence rendered in English
    // on a JA page. Verbatim source blocks (hansard transcripts, video
    // captions, MDDI speech originals) are pre-stripped via the shared
    // `data-i18n-allow-cjk` / `data-i18n-allow-en` markers in
    // visibleText() before this scan runs.
    //
    // Tokens-per-sentence threshold: 4. Lower (3) misbehaves on
    // brand+verb pairs like "AI Singapore launches" inside otherwise-JA
    // sentences (which still contain kana so wouldn't fire anyway), but
    // 4 reliably catches the "Read more →"-style triplets only when they
    // chain into longer English UI strings; for shorter UI hits the
    // allow-list below covers known cases.
    //
    // The caller MAY add a sentence to allowPatterns to whitelist legit
    // EN strings (brand taglines, acronym chains, single-word labels).
    enSentence: {
      // Tokens-per-sentence threshold for EN flag.
      minTokens: 4,
      // A sentence containing kana is Japanese, not EN residue → skip.
      // (Kanji is deliberately NOT native script here: a kana-free run may
      // still be zh residue, handled by foreignRegex/validate above.)
      nativeScriptRegex: /[぀-ゟ゠-ヿ]/,
      // Brand / programme proper nouns legal on a JA page — shared across
      // all target locales via EN_SENTENCE_ALLOW.
      allowPatterns: EN_SENTENCE_ALLOW,
    },
    enSentenceSeverity: 'ratchet',
  },
  'zh-tw': {
    // Traditional Chinese (Taiwan idiom) pages are produced by passing the
    // zh dict through OpenCC s2twp at render time. If OpenCC fired
    // correctly, NO Simplified-only characters should appear on a /zh-tw/
    // page. Flag any Simplified character that has a distinct Traditional
    // glyph as residue (the converter missed it, or a hand-typed string
    // bypassed pickLocalized).
    //
    // 后 is intentionally NOT in this list — it's a valid Traditional
    // character meaning "queen" (皇后/太后), distinct from 後 ("after").
    // OpenCC keeps 后 when context implies "queen"; we can't disambiguate
    // at the regex level. Common compound mis-conversions (后续/后期/etc.)
    // are caught by the POST_DICT in src/i18n/opencc.ts.
    foreignRegex:
      /[们这个让给还经历战业长进应时现过对边远难听说话网决织续选责险验总较单风转务习头质闻关开师龙标异该处见级观产场际线门约电汉东种钟严员问纸读买卖钱实询试讲请运银项报书图来语转动会国华军车节义难艺济点优]+/g,
    // No special exceptions — the only "allow CJK" cases on a zhTw page
    // would be brand/legal text we want preserved verbatim, which OpenCC
    // already leaves alone since they aren't Simplified codepoints.
    allowPatterns: [],
    // Sentence-level EN-residue scan. zh-tw derives from zh via OpenCC and
    // should never show English fallback; a whole EN sentence here means a
    // component branched `lang !== 'zh'` and threw zh-tw into the EN branch
    // (the core 2026-07 fallback-leak bug). Same tuning as zh: minTokens 6,
    // native script is Han (traditional glyphs are also matched by /一-鿿/).
    enSentence: {
      minTokens: 6,
      nativeScriptRegex: /[一-鿿]/,
      allowPatterns: EN_SENTENCE_ALLOW,
    },
    enSentenceSeverity: 'ratchet',
  },
  ko: {
    // Korean pages should contain hangul, not Han characters. Flag CJK
    // Unified runs as residue — these are either un-translated zh
    // fallbacks or template strings that should have been localized.
    foreignRegex: /[一-鿿]+(?:[一-鿿\s·。，、！？：；'-]*[一-鿿]+)*/g,
    // Allow-list intentional CJK references on KO pages:
    //  - Other-language toggle labels (中文 / 日本語 / 繁體中文) in the switcher
    //  - Branded proper nouns kept in original script
    allowPatterns: ['中文', '日本語', '繁體中文'],
    // Sentence-level EN-residue scan: catches "Read more →"-style English
    // sentences that leaked into KO pages because a template fell
    // through pickLocalized's fallback chain to en. A sentence containing
    // hangul is Korean, not EN residue → skip via nativeScriptRegex.
    enSentence: {
      minTokens: 4,
      nativeScriptRegex: /[가-힣]/,
      allowPatterns: EN_SENTENCE_ALLOW,
    },
    enSentenceSeverity: 'ratchet',
  },
};

let conf;
let ALLOW_PATTERNS = [];

function configureLang(lang) {
  LANG = lang;
  ROOT = LANG === ROUTE_DEFAULT ? ROOT_BASE : `${ROOT_BASE}/${LANG}`;
  SKIP_SUBDIRS = new Set(LANG === ROUTE_DEFAULT ? LOCALES.filter((locale) => locale !== ROUTE_DEFAULT) : []);
  conf = LANG_CONFIG[LANG];
  if (!conf) {
    throw new Error(`[i18n-check] No config for lang "${LANG}". Add an entry to LANG_CONFIG.`);
  }
  ALLOW_PATTERNS = conf.allowPatterns;
}

function listHtml(dir, isRoot = true) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (isRoot && SKIP_SUBDIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listHtml(p, false));
    else if (st.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Tags whose blocks may carry a data-i18n-allow-{cjk,en} marker. `p` and
// `span` were added for the 2026-07 fallback-leak fix: benchmark / about /
// startup EN-fallback prose is wrapped in <p>/<span>, not block containers.
const MARKER_TAGS = ['section', 'div', 'article', 'details', 'aside', 'p', 'span'];

/**
 * Strip non-visible / markered blocks and return the remaining visible text
 * plus any marker-violations found on this page for `lang`.
 *
 * Marker handling (2026-07 reason-registry model):
 *   Each block marked `data-i18n-allow-cjk="<reason>"` (CJK verbatim source)
 *   or `data-i18n-allow-en="<reason>"` (EN verbatim / EN fallback) is ALWAYS
 *   stripped from visible text — so its wrapped content is never double-reported
 *   by the foreign-script / EN-sentence scanners. We additionally consult the
 *   ALLOW_REASONS registry (scripts/lib/i18n-allow-reasons.mjs):
 *     - reason registered AND `lang` in its `langs` → legitimate, no violation.
 *     - reason unknown, OR `lang` not in its `langs` → record a marker-violation.
 *   The canonical bug this catches: an `*-en-fallback` marker (legit only on
 *   ko) appearing on a zh-tw page because a component branched `lang !== 'zh'`.
 *
 * @param {string} htmlSrc
 * @param {string} lang
 * @returns {{ text: string, markerViolations: {reason: string, attr: string, snippet: string}[] }}
 */
function visibleText(htmlSrc, lang) {
  let s = htmlSrc;
  const markerViolations = [];
  // Strip <script> / <style> / <template> blocks
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<template[\s\S]*?<\/template>/gi, ' ');
  // Strip every element block explicitly marked with a data-i18n-allow-{cjk,en}
  // reason. Capture the attr + reason so we can validate it against the
  // registry before stripping. Block is dropped regardless (see above);
  // an unregistered / lang-mismatched reason additionally records a violation.
  for (const tag of MARKER_TAGS) {
    const re = new RegExp(
      `<${tag}\\b[^>]*\\sdata-i18n-allow-(cjk|en)=["']([^"']+)["'][^>]*>([\\s\\S]*?)<\\/${tag}>`,
      'gi'
    );
    s = s.replace(re, (_full, kind, reason, inner) => {
      const attr = `data-i18n-allow-${kind}`;
      const spec = ALLOW_REASONS[reason];
      const langOk = spec && (spec.langs === 'all' || spec.langs.includes(lang));
      const attrOk =
        spec && (spec.attr === 'both' || spec.attr === attr);
      if (!spec || !langOk || !attrOk) {
        markerViolations.push({
          reason,
          attr,
          // Short snippet of the wrapped content for the report.
          snippet: inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120),
        });
      }
      return ' ';
    });
  }
  // Strip <head>...</head> entirely — meta/title is checked separately
  s = s.replace(/<head[\s\S]*?<\/head>/i, ' ');
  // Remove HTML comments
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  // Strip every opening / self-closing / closing tag completely (attrs and all).
  // Data-search blobs, alt text, title attrs, aria-label etc. live inside attrs
  // and are NOT user-visible body text — drop them.
  s = s.replace(/<\/?[a-zA-Z][^>]*>/g, ' ');
  // Drop any leftover stray angle bracket
  s = s.replace(/<[^>]+>/g, ' ');
  const text = s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return { text, markerViolations };
}

function metaText(htmlSrc) {
  // Pull og:site_name, og:locale, og:title, og:description, twitter:title,
  // twitter:description, <title>, <meta name="description">
  const out = [];
  const head = htmlSrc.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? '';
  const titleMatch = head.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) out.push(['<title>', titleMatch[1].trim()]);
  for (const m of head.matchAll(/<meta\s+([^>]+?)\/?>/gi)) {
    const attrs = m[1];
    const name = attrs.match(/(?:property|name)=["']([^"']+)["']/i)?.[1];
    const content = attrs.match(/content=["']([^"']*)["']/i)?.[1] ?? '';
    if (!name) continue;
    if (
      [
        'og:site_name',
        'og:title',
        'og:description',
        'og:locale',
        'twitter:title',
        'twitter:description',
        'description',
      ].includes(name)
    ) {
      out.push([name, content]);
    }
  }
  return out;
}

function findForeign(text) {
  // Reset stateful regex's lastIndex so repeated calls on different texts work.
  conf.foreignRegex.lastIndex = 0;
  const matches = [...text.matchAll(conf.foreignRegex)];
  if (typeof conf.validate === 'function') {
    return matches.filter((m) => conf.validate(m, text)).map((m) => m[0]);
  }
  return matches.map((m) => m[0]);
}

function isAllowed(s) {
  return ALLOW_PATTERNS.some((p) => s.includes(p));
}

// Sentence-level EN-residue scanner. Only used when conf.enSentence is set
// (currently: ja). Returns an array of suspect sentences — each represents
// a wrong-language sentence on a target-locale page. Verbatim source blocks
// (hansard, video transcripts, MDDI originals) are pre-stripped via
// data-i18n-allow-{cjk,en} markers in visibleText() before reaching here.
//
// Algorithm:
//   1. Split visible text on sentence-end punctuation (zh/en/ja).
//   2. For each sentence with ≥ minTokens English word tokens
//      AND zero hiragana/katakana characters → flag.
//   3. Skip sentences whose substring matches any of conf.enSentence.allowPatterns
//      (brand names, programme proper nouns, native UI labels).
//
// "Sentence" is approximated by punctuation split — good enough for the
// "wrong-language sentence" failure mode this is designed to catch. We
// truncate flagged sentences to 150 chars in reports to keep output usable.
const EN_TOKEN_RE = /[A-Za-z][A-Za-z0-9'’-]*/g;
const SENTENCE_SPLIT_RE = /[.。！!？?]+/;

function findEnSentences(text) {
  const cfg = conf.enSentence;
  if (!cfg) return [];
  const minTokens = cfg.minTokens || 4;
  const allow = cfg.allowPatterns || [];
  // A sentence containing this locale's native script is native content, not
  // EN residue. Config-driven (nativeScriptRegex): ja=kana, ko=hangul,
  // zh/zh-tw=Han. Kanji is deliberately not "native" for ja.
  const targetScript = cfg.nativeScriptRegex || null;
  const out = [];
  for (const raw of text.split(SENTENCE_SPLIT_RE)) {
    const sent = raw.replace(/\s+/g, ' ').trim();
    if (sent.length < 10) continue;
    // Sentence contains target locale's native script — not EN residue.
    if (targetScript && targetScript.test(sent)) continue;
    const tokens = sent.match(EN_TOKEN_RE) || [];
    if (tokens.length < minTokens) continue;
    if (allow.some((p) => sent.includes(p))) continue;
    // Don't double-count sentences that are pure punctuation/numbers/EN tokens
    // counted as a single "URL-ish" token. Require at least 2 distinct tokens.
    const distinct = new Set(tokens.map((t) => t.toLowerCase()));
    if (distinct.size < 2) continue;
    out.push(sent.slice(0, 150) + (sent.length > 150 ? '…' : ''));
  }
  return out;
}

function scanFile(file) {
  const html = readFileSync(file, 'utf8');
  // Three-bucket findings:
  //   `findings`     — hard-fail foreign-script residue (CJK on EN pages,
  //                    SIMPLIFIED_ONLY on JA pages). Always exit 1 if any.
  //   `enWarnings`   — sentence-level wrong-language (EN) residue. Governed
  //                    by per-lang enSentenceSeverity (ratchet | error).
  //   `markerViolations` — a data-i18n-allow-{cjk,en} marker whose reason is
  //                    unregistered, or is used on a locale where it's not
  //                    legitimate (e.g. an *-en-fallback marker on zh-tw).
  //                    Governed by the same per-lang severity as enWarnings.
  const findings = [];
  const enWarnings = [];

  // 1) Visible body text — foreign-script residue (CJK on EN pages, etc.)
  //    visibleText also surfaces marker-violations for this lang.
  const { text: body, markerViolations } = visibleText(html, LANG);
  for (const hit of findForeign(body)) {
    if (!isAllowed(hit)) findings.push({ where: 'body', hit });
  }

  // 2) Meta tags & <title> — foreign-script residue
  for (const [name, content] of metaText(html)) {
    for (const hit of findForeign(content)) {
      if (!isAllowed(hit)) findings.push({ where: name, hit });
    }
  }

  // 3) Wrong-language sentence scan. Catches the
  //    "lang === 'zh' ? '中文' : 'English'" anti-pattern in templates,
  //    where a non-zh locale silently falls into the EN branch and the
  //    foreignRegex sees no CJK to flag.
  if (conf.enSentence) {
    for (const hit of findEnSentences(body)) {
      enWarnings.push({ where: 'body-en-sentence', hit });
    }
    for (const [name, content] of metaText(html)) {
      for (const hit of findEnSentences(content)) {
        enWarnings.push({ where: `${name}-en-sentence`, hit });
      }
    }
  }

  // De-dup each bucket independently.
  function dedup(arr) {
    const seen = new Set();
    const uniq = [];
    for (const f of arr) {
      const k = f.where + '||' + f.hit;
      if (seen.has(k)) continue;
      seen.add(k);
      uniq.push(f);
    }
    return uniq;
  }
  return {
    findings: dedup(findings),
    enWarnings: dedup(enWarnings),
    markerViolations,
  };
}

// ── EN-sentence + marker-violation ratchet baseline ───────────────────────
//
// Baseline file: scripts/i18n-check.baseline.json
// Shape:
//   {
//     "<lang>": {
//       "<page path e.g. zh-tw/debates/index.html>": <enSentence hit count>,
//       ...,
//       "__markerViolations__": <total marker-violation count for this lang>
//     },
//     ...
//   }
// The reserved key "__markerViolations__" holds the per-lang aggregate of
// marker-violations (folding them per-page would bloat the baseline and marker
// leaks are lang-scoped by nature). Everything else is a page → hit count map.
// Ratchet semantics (per lang, enSentenceSeverity === 'ratchet'):
//   - a page whose current count > its baseline value (default 0)        → FAIL
//   - marker-violation total > baseline "__markerViolations__" (default 0) → FAIL
//   - current < baseline → baseline can shrink (prints a hint, does not fail)
// severity === 'error' → any hit fails immediately, no baseline exemption.
const MARKER_BASELINE_KEY = '__markerViolations__';

function loadEnBaseline() {
  if (!existsSync(EN_BASELINE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(EN_BASELINE_PATH, 'utf8'));
  } catch (err) {
    console.error(`[i18n-check] Failed to parse ${EN_BASELINE_PATH}: ${err instanceof Error ? err.message : err}`);
    return {};
  }
}

// Deep-sort object keys so baseline diffs stay stable regardless of scan order.
function sortedBaseline(obj) {
  const out = {};
  for (const lang of Object.keys(obj).sort()) {
    const seg = obj[lang];
    const sortedSeg = {};
    for (const key of Object.keys(seg).sort()) sortedSeg[key] = seg[key];
    out[lang] = sortedSeg;
  }
  return out;
}

function writeEnBaseline(baseline) {
  writeFileSync(EN_BASELINE_PATH, JSON.stringify(sortedBaseline(baseline), null, 2) + '\n');
}

function mainForLang(lang, opts = {}) {
  const { baseline = {}, updateMode = false } = opts;
  try {
    configureLang(lang);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }

  let files;
  try {
    files = listHtml(ROOT);
  } catch {
    console.error(`[i18n-check] Cannot read ${ROOT}. Run \`npm run build\` first.`);
    return 2;
  }

  const severity = conf.enSentenceSeverity || 'ratchet';
  const langBaseline = baseline[lang] || {};

  let totalPages = 0;
  let dirtyPages = 0;
  let warnPages = 0;
  let totalHits = 0;
  let totalWarnings = 0;
  let totalMarkerViolations = 0;
  const perPage = [];
  const perPageWarn = [];
  const markerViolations = []; // { path, reason, attr, snippet }
  // Current per-page enSentence counts, used for ratchet comparison + snapshot.
  const currentCounts = {}; // path → enSentence hit count

  for (const f of files) {
    totalPages++;
    const { findings, enWarnings, markerViolations: mv } = scanFile(f);
    const rel = relative('dist', f);
    if (findings.length > 0) {
      dirtyPages++;
      totalHits += findings.length;
      perPage.push({ path: rel, findings });
    }
    if (enWarnings.length > 0) {
      warnPages++;
      totalWarnings += enWarnings.length;
      currentCounts[rel] = enWarnings.length;
      perPageWarn.push({ path: rel, findings: enWarnings });
    }
    for (const v of mv) {
      totalMarkerViolations++;
      markerViolations.push({ path: rel, ...v });
    }
  }

  perPage.sort((a, b) => b.findings.length - a.findings.length);
  perPageWarn.sort((a, b) => b.findings.length - a.findings.length);

  // ── Baseline snapshot mode ──────────────────────────────────────────────
  if (updateMode) {
    const seg = {};
    for (const { path, findings } of perPageWarn) seg[path] = findings.length;
    if (totalMarkerViolations > 0) seg[MARKER_BASELINE_KEY] = totalMarkerViolations;
    baseline[lang] = seg;
    console.log(`[i18n-check] lang=${LANG}: snapshot ${perPageWarn.length} EN-sentence pages` + `, ${totalMarkerViolations} marker-violations into baseline.`);
    // Even in update mode, hard foreign-script residue is a real failure.
    if (dirtyPages > 0) {
      console.log(`[i18n-check] lang=${LANG}: WARNING — ${dirtyPages} pages still have foreign-script residue (not baselined).`);
    }
    return dirtyPages > 0 ? 1 : 0;
  }

  console.log(`[i18n-check] lang=${LANG}, root=${ROOT}`);
  console.log(`[i18n-check] Scanned ${totalPages} pages.`);
  console.log(`[i18n-check] Pages with foreign-script residue (FAIL): ${dirtyPages} — ${totalHits} hits`);
  console.log(
    `[i18n-check] Pages with EN-sentence hits: ${warnPages} — ${totalWarnings} hits; marker-violations: ${totalMarkerViolations} (severity=${severity})`
  );

  const max = parseInt(process.env.I18N_REPORT_LIMIT || '20', 10);
  for (const { path, findings } of perPage.slice(0, max)) {
    console.log(`\n  ${findings.length}  ${path}`);
    const sample = findings.slice(0, 8);
    for (const { where, hit } of sample) {
      console.log(`     [${where}] ${hit}`);
    }
    if (findings.length > sample.length) {
      console.log(`     … and ${findings.length - sample.length} more`);
    }
  }

  // ── EN-sentence + marker-violation severity evaluation ──────────────────
  // Regressions: pages whose hit count exceeds the baseline (ratchet), or any
  // hit at all (error). Same treatment for the marker-violation aggregate.
  const enRegressions = []; // { path, current, baseline, findings }
  const enShrinks = []; // { path, current, baseline }
  for (const { path, findings } of perPageWarn) {
    const base = severity === 'error' ? 0 : langBaseline[path] || 0;
    if (findings.length > base) {
      enRegressions.push({ path, current: findings.length, baseline: base, findings });
    } else if (findings.length < base) {
      enShrinks.push({ path, current: findings.length, baseline: base });
    }
  }
  // Baseline pages that dropped to zero (no longer in perPageWarn) also shrink.
  if (severity !== 'error') {
    for (const [path, base] of Object.entries(langBaseline)) {
      if (path === MARKER_BASELINE_KEY) continue;
      if (!(path in currentCounts) && base > 0) enShrinks.push({ path, current: 0, baseline: base });
    }
  }
  const markerBase = severity === 'error' ? 0 : langBaseline[MARKER_BASELINE_KEY] || 0;
  const markerRegressed = totalMarkerViolations > markerBase;
  const markerShrunk = totalMarkerViolations < markerBase;

  // Report EN-sentence regressions (the actionable failures).
  if (enRegressions.length > 0) {
    console.log(
      `\n[i18n-check] EN-sentence ${severity === 'error' ? 'hits' : 'REGRESSIONS above baseline'} (${enRegressions.length} page(s)):`
    );
    for (const { path, current, baseline: base, findings } of enRegressions.slice(0, Math.min(8, max))) {
      console.log(`  ${current} (baseline ${base})  ${path}`);
      for (const { where, hit } of findings.slice(0, 3)) {
        console.log(`     [${where}] ${hit}`);
      }
      if (findings.length > 3) console.log(`     … and ${findings.length - 3} more`);
    }
    if (enRegressions.length > 8) console.log(`  … and ${enRegressions.length - 8} more pages`);
  }

  // Report marker-violations (unregistered reason or wrong-locale marker).
  if (markerRegressed && markerViolations.length > 0) {
    console.log(
      `\n[i18n-check] Marker-violations ${severity === 'error' ? '' : `above baseline (${totalMarkerViolations} > ${markerBase}) `}(${totalMarkerViolations} total):`
    );
    for (const { path, reason, attr, snippet } of markerViolations.slice(0, Math.min(8, max))) {
      console.log(`  [${attr}="${reason}"] ${path}`);
      if (snippet) console.log(`     ${snippet}`);
    }
    if (markerViolations.length > 8) console.log(`  … and ${markerViolations.length - 8} more`);
  }

  // Shrink hints — baseline can be tightened (informational, never fails).
  if (enShrinks.length > 0 || markerShrunk) {
    console.log(
      `\n[i18n-check] lang=${LANG}: baseline can shrink (${enShrinks.length} page(s)` +
        `${markerShrunk ? `, marker-violations ${totalMarkerViolations} < ${markerBase}` : ''}). ` +
        `Run \`node scripts/i18n-check.mjs --all --update-en-baseline\` to re-snapshot.`
    );
  }

  // ── Exit decision ───────────────────────────────────────────────────────
  const enFail = enRegressions.length > 0 || markerRegressed;
  if (dirtyPages > 0) {
    console.log(`\n[i18n-check] FAIL — fix the foreign-script residue above.`);
    return 1;
  }
  if (enFail) {
    console.log(
      `\n[i18n-check] FAIL — new EN-sentence / marker leaks on ${LANG.toUpperCase()} above baseline.` +
        (severity === 'ratchet'
          ? ` If this is an intentional pre-existing change, run \`node scripts/i18n-check.mjs --all --update-en-baseline\` to re-snapshot.`
          : ` (severity=error: no baseline exemption.)`)
    );
    return 1;
  }
  const what = LANG === 'en' ? 'non-English script residue on EN' : `foreign-script residue on ${LANG.toUpperCase()}`;
  console.log(`\n[i18n-check] OK — no ${what} pages; EN-sentence / marker leaks within baseline.`);
  return 0;
}

function main() {
  const langs = CHECK_ALL ? LOCALES : [LANG];

  // Baseline snapshot mode: rescan and rewrite scripts/i18n-check.baseline.json.
  // Segments are merged: `--lang zh-tw --update-en-baseline` only rewrites the
  // zh-tw segment; `--all --update-en-baseline` rewrites every scanned segment.
  if (UPDATE_EN_BASELINE) {
    const baseline = loadEnBaseline();
    let exitCode = 0;
    for (const lang of langs) {
      const code = mainForLang(lang, { baseline, updateMode: true });
      if (code > exitCode) exitCode = code;
    }
    writeEnBaseline(baseline);
    console.log(`[i18n-check] Wrote baseline: ${relative(process.cwd(), EN_BASELINE_PATH)}`);
    if (exitCode > 0) process.exit(exitCode);
    return;
  }

  const baseline = loadEnBaseline();
  let exitCode = 0;
  for (const lang of langs) {
    const code = mainForLang(lang, { baseline });
    if (code > exitCode) exitCode = code;
  }
  if (exitCode > 0) process.exit(exitCode);
}

main();

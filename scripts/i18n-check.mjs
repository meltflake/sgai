#!/usr/bin/env node
// i18n consistency check — scans a built locale directory for residue
// of any other locale's script.
//
// Run after `npm run build`:
//   node scripts/i18n-check.mjs                   # scan EN at dist/ (excluding /zh/)
//   node scripts/i18n-check.mjs --lang en         # same as above
//   node scripts/i18n-check.mjs --lang zh         # scan ZH at dist/zh/
//   node scripts/i18n-check.mjs --lang en --root dist
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

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

// Parse --lang and --root flags.
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const LANG = arg('--lang', 'en');
const ROOT_BASE = arg('--root', 'dist');
// EN is the route-default locale and lives at the bare ROOT_BASE.
// Other locales live under ROOT_BASE/<lang>/.
const ROUTE_DEFAULT = 'en';
const ROOT = LANG === ROUTE_DEFAULT ? ROOT_BASE : `${ROOT_BASE}/${LANG}`;
// Subdirs to skip when scanning EN root (those belong to other locales).
// Keep this in sync with LOCALES in src/i18n/index.ts (minus the route default).
const SKIP_SUBDIRS = new Set(LANG === ROUTE_DEFAULT ? ['zh', 'ja'] : []);

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
const LANG_CONFIG = {
  en: {
    // Match CJK Unified Ideographs runs.
    foreignRegex: /[一-鿿]+(?:[一-鿿\s·。，、！？：；'-]*[一-鿿]+)*/g,
    // Strings that ARE allowed despite containing CJK.
    allowPatterns: [
      // LangBanner: invite user to switch to zh.
      '中文版可用',
      '阅读中文版',
      // LanguageToggle: dropdown language labels.
      '中文',
      '日本語',
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
      // Words/phrases that are LEGAL on a JA page even when they form a
      // long EN string. Brand names, official programme names, native-
      // language UI affordances. Each entry is an exact substring check
      // against the suspect sentence; one hit exempts the whole sentence.
      allowPatterns: [
        // Site identity / branding (allowed in all locales).
        'Singapore AI Observatory',
        'sgai',
        // LanguageToggle button label
        'English',
        // Common policy / programme proper nouns that legitimately
        // appear inside JA sentences. These would otherwise need to be
        // re-cased per locale, and they're just wrong to translate.
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
      ],
    },
  },
};

const conf = LANG_CONFIG[LANG];
if (!conf) {
  console.error(`[i18n-check] No config for lang "${LANG}". Add an entry to LANG_CONFIG.`);
  process.exit(2);
}

const ALLOW_PATTERNS = conf.allowPatterns;

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

function visibleText(htmlSrc) {
  let s = htmlSrc;
  // Strip <script> / <style> / <template> blocks
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<template[\s\S]*?<\/template>/gi, ' ');
  // Strip any element block explicitly marked with
  // `data-i18n-allow-cjk="<reason>"` (CJK verbatim source — hansard-original,
  // speech-verbatim-source, ecosystem-pending-translation) OR
  // `data-i18n-allow-en="<reason>"` (EN verbatim source — video transcripts,
  // policy English originals, MDDI source links). Both markers behave
  // identically for this scan: the wrapped element block is dropped from
  // visible text entirely, so neither CJK nor EN scans see its contents.
  // The reason value is informational; the marker itself suppresses the scan.
  // Supports common block-level wrappers (section/div/article/details/aside).
  // `details` is included because Hansard transcript blocks in DebatesIndex
  // wrap verbatim EN source in <details> for collapsible UX.
  for (const tag of ['section', 'div', 'article', 'details', 'aside']) {
    const re = new RegExp(
      `<${tag}[^>]*\\sdata-i18n-allow-(?:cjk|en)=["'][^"']+["'][^>]*>[\\s\\S]*?<\\/${tag}>`,
      'gi'
    );
    s = s.replace(re, ' ');
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
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
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
const KANA_RE = /[぀-ゟ゠-ヿ]/;
const EN_TOKEN_RE = /[A-Za-z][A-Za-z0-9'’-]*/g;
const SENTENCE_SPLIT_RE = /[.。！!？?]+/;

function findEnSentences(text) {
  const cfg = conf.enSentence;
  if (!cfg) return [];
  const minTokens = cfg.minTokens || 4;
  const allow = cfg.allowPatterns || [];
  const out = [];
  for (const raw of text.split(SENTENCE_SPLIT_RE)) {
    const sent = raw.replace(/\s+/g, ' ').trim();
    if (sent.length < 10) continue;
    if (KANA_RE.test(sent)) continue;
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
  // Two-bucket findings:
  //   `findings`     — hard-fail residue (foreign-script: CJK on EN pages,
  //                    SIMPLIFIED_ONLY on JA pages). exit 1 if any.
  //   `enWarnings`   — sentence-level EN-on-JA residue. Reported but does
  //                    NOT affect exit code, because:
  //                      • baseline of these is being burned down PR by PR
  //                        via the Layer E source-level scan (which IS
  //                        hard-fail for new additions);
  //                      • the existing 4000+ hits would block every PR
  //                        until backlog is cleared, defeating the gate.
  //                    The Layer E source scan prevents NEW EN-on-JA
  //                    hardcodes from being introduced; this dist-level
  //                    EN warning surfaces residual cases (e.g. data-driven
  //                    pages that pull EN from a source field) for visibility.
  //                    To re-enable hard-fail once backlog reaches zero,
  //                    flip `EN_SENTENCE_HARD_FAIL` below.
  const findings = [];
  const enWarnings = [];

  // 1) Visible body text — foreign-script residue (CJK on EN pages, etc.)
  const body = visibleText(html);
  for (const hit of findForeign(body)) {
    if (!isAllowed(hit)) findings.push({ where: 'body', hit });
  }

  // 2) Meta tags & <title> — foreign-script residue
  for (const [name, content] of metaText(html)) {
    for (const hit of findForeign(content)) {
      if (!isAllowed(hit)) findings.push({ where: name, hit });
    }
  }

  // 3) Wrong-language sentence scan (currently ja only). Catches the
  //    "lang === 'zh' ? '中文' : 'English'" anti-pattern in templates,
  //    where ja silently falls into the EN branch and the foreignRegex
  //    sees no CJK to flag.
  for (const hit of findEnSentences(body)) {
    enWarnings.push({ where: 'body-en-sentence', hit });
  }
  for (const [name, content] of metaText(html)) {
    for (const hit of findEnSentences(content)) {
      enWarnings.push({ where: `${name}-en-sentence`, hit });
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
  return { findings: dedup(findings), enWarnings: dedup(enWarnings) };
}

function main() {
  let files;
  try {
    files = listHtml(ROOT);
  } catch {
    console.error(`[i18n-check] Cannot read ${ROOT}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  let totalPages = 0;
  let dirtyPages = 0;
  let warnPages = 0;
  let totalHits = 0;
  let totalWarnings = 0;
  const perPage = [];
  const perPageWarn = [];

  for (const f of files) {
    totalPages++;
    const { findings, enWarnings } = scanFile(f);
    if (findings.length > 0) {
      dirtyPages++;
      totalHits += findings.length;
      perPage.push({ path: relative('dist', f), findings });
    }
    if (enWarnings.length > 0) {
      warnPages++;
      totalWarnings += enWarnings.length;
      perPageWarn.push({ path: relative('dist', f), findings: enWarnings });
    }
  }

  perPage.sort((a, b) => b.findings.length - a.findings.length);
  perPageWarn.sort((a, b) => b.findings.length - a.findings.length);

  console.log(`[i18n-check] lang=${LANG}, root=${ROOT}`);
  console.log(`[i18n-check] Scanned ${totalPages} pages.`);
  console.log(`[i18n-check] Pages with foreign-script residue (FAIL): ${dirtyPages} — ${totalHits} hits`);
  console.log(`[i18n-check] Pages with EN-sentence warnings (NON-FATAL): ${warnPages} — ${totalWarnings} hits`);

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

  // Warning section is shown but does not affect exit code. Surfaces the
  // EN-on-JA residue backlog (Layer E source scan governs new additions).
  if (warnPages > 0) {
    console.log(`\n[i18n-check] EN-sentence warnings (informational; Layer E gates new additions in source):`);
    for (const { path, findings } of perPageWarn.slice(0, Math.min(5, max))) {
      console.log(`  ${findings.length}  ${path}`);
      for (const { where, hit } of findings.slice(0, 3)) {
        console.log(`     [${where}] ${hit}`);
      }
      if (findings.length > 3) console.log(`     … and ${findings.length - 3} more`);
    }
    if (perPageWarn.length > 5) {
      console.log(`  … and ${perPageWarn.length - 5} more pages with EN warnings`);
    }
  }

  if (dirtyPages > 0) {
    console.log(`\n[i18n-check] FAIL — fix the foreign-script residue above.`);
    process.exit(1);
  } else {
    const what = LANG === 'en' ? 'Chinese residue on EN' : `foreign-script residue on ${LANG.toUpperCase()}`;
    console.log(`\n[i18n-check] OK — no ${what} pages.`);
    if (warnPages > 0) {
      console.log(
        `[i18n-check] (${totalWarnings} EN-sentence warnings still present — informational only; track via Layer E.)`
      );
    }
  }
}

main();

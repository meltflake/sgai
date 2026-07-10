#!/usr/bin/env node
// SEO meta-layer validator for built HTML — <title> / <meta name=description> /
// rel=canonical / hreflang consistency.
//
// Run after `npm run build`:
//   node scripts/check-meta.mjs              # scan dist/**/*.html
//   node scripts/check-meta.mjs --root dist
//
// Why this exists: source-level checks never see the final <head>. Double
// brand suffixes (`… · Singapore AI Policy · sgai`), mid-word description
// cuts, and canonical↔hreflang contradictions only exist in the built
// output (GSC 2026-07: /debates/budget-437/ shipped a 101-char title and a
// description cut mid-word at 207 chars; legal-ai twins sent self-referencing
// hreflang while canonicalising to /policies/).
//
// Rules (noindex pages and 404.html are skipped):
//   T1  <title> display width ≤ TITLE_MAX units (CJK char = 2 units — mirrors
//       src/utils/seo-meta.ts weightedLength; Metadata.astro clamps at 70)
//   T2  the section-brand suffixes removed in 2026-07 must not reappear
//       right before the `· sgai` brand token
//   D1  description display width ≤ DESC_MAX units. Metadata.astro clamps at
//       160 through truncateAtBoundary, so this is also the dist-level proxy
//       for the "no mid-word truncation" rule: any raw `.slice(0, 200)` that
//       bypasses the choke point blows this gate before it can ship a
//       mid-word cut (the boundary behavior itself is pinned by
//       scripts/lib/__tests__/seo-meta.test.ts).
//   C1  exactly one rel=canonical; absolute URL on the site origin
//   C2  pages WITH an hreflang cluster must be self-canonical and list
//       themselves; pages whose canonical points at a different page must
//       emit NO hreflang (Google requires every hreflang member to be
//       self-canonical — mixed signals fight each other in GSC)
//   C3  clusters must include x-default

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const ROOT = arg('--root', 'dist');
const ORIGIN = 'https://sgai.md';

const TITLE_MAX = 72; // Metadata.astro clamps to 70; small headroom for decode edges
const DESC_MAX = 165; // Metadata.astro clamps to 160

// Keep in sync with CJK_CHAR in src/utils/seo-meta.ts.
const CJK_CHAR = /[\u2e80-\u2eff\u3000-\u303f\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef\uac00-\ud7af]/;

// The exact section suffixes removed in the 2026-07 title de-duplication,
// anchored right before the brand token so ordinary titles that merely
// mention these words don't false-positive. EN + zh forms only — the T1
// length gate covers the same regression class for the other locales.
const FORBIDDEN_BEFORE_BRAND = [
  'Singapore AI Policy',
  'Singapore Parliament AI Debate',
  'AI Legal Framework',
  'AI Video Library',
  'MDDI Speech',
  '新加坡 AI 政策',
];

function weightedLength(text) {
  let units = 0;
  for (const ch of text) units += CJK_CHAR.test(ch) ? 2 : 1;
  return units;
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function listHtml(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listHtml(p));
    else if (st.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Astro's compressor may reorder attributes — scan whole tags, not orders.
function metaContent(html, name) {
  for (const m of html.matchAll(/<meta\b([^>]+)>/gi)) {
    const attrs = m[1];
    const n = attrs.match(/\sname=["']([^"']+)["']/i);
    if (!n || n[1].toLowerCase() !== name) continue;
    const c = attrs.match(/\scontent=["']([^"']*)["']/i);
    return c ? c[1] : '';
  }
  return null;
}

function extractLinks(html) {
  const canonicals = [];
  const alternates = [];
  for (const m of html.matchAll(/<link\b([^>]+)>/gi)) {
    const attrs = m[1];
    const rel = attrs.match(/\srel=["']([^"']+)["']/i);
    const href = attrs.match(/\shref=["']([^"']*)["']/i);
    if (!rel || !href) continue;
    if (rel[1] === 'canonical') canonicals.push(href[1]);
    if (rel[1] === 'alternate') {
      const hreflang = attrs.match(/\shreflang=["']([^"']+)["']/i);
      if (hreflang) alternates.push({ hreflang: hreflang[1], href: href[1] });
    }
  }
  return { canonicals, alternates };
}

function isNoindex(html) {
  const robots = metaContent(html, 'robots');
  return Boolean(robots && /\bnoindex\b/i.test(robots));
}

function pagePath(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  return '/' + (rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel);
}

function checkPage(file, html) {
  const issues = [];
  const selfPath = pagePath(file);

  // T1 + T2 — title budget and brand de-duplication
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : '';
  if (!title) {
    issues.push('missing <title>');
  } else {
    const units = weightedLength(title);
    if (units > TITLE_MAX) issues.push(`title too long: ${units} units > ${TITLE_MAX} ("${title}")`);
    for (const suffix of FORBIDDEN_BEFORE_BRAND) {
      if (title.endsWith(` · ${suffix} · sgai`)) {
        issues.push(`double-branded title (section suffix "${suffix}" before "· sgai"): "${title}"`);
      }
    }
  }

  // D1 — description budget (proxy for the no-raw-slice rule, see header)
  const description = metaContent(html, 'description');
  if (description) {
    const units = weightedLength(decodeEntities(description));
    if (units > DESC_MAX) issues.push(`description too long: ${units} units > ${DESC_MAX}`);
  }

  // C1 — exactly one absolute on-site canonical
  const { canonicals, alternates } = extractLinks(html);
  if (canonicals.length !== 1) {
    issues.push(`expected exactly 1 rel=canonical, found ${canonicals.length}`);
    return issues; // C2/C3 need a canonical to compare against
  }
  const canonical = canonicals[0];
  if (!canonical.startsWith(ORIGIN + '/') && canonical !== ORIGIN) {
    issues.push(`canonical not on ${ORIGIN}: ${canonical}`);
    return issues;
  }
  const canonicalPath = new URL(canonical).pathname;

  // C2 + C3 — canonical ↔ hreflang consistency
  if (alternates.length > 0) {
    if (canonicalPath !== selfPath) {
      issues.push(
        `hreflang cluster on a page whose canonical points elsewhere (${canonical}) — ` +
          'Google requires hreflang members to be self-canonical; suppress the cluster (CommonMeta.astro)'
      );
    } else {
      if (!alternates.some((a) => a.href === canonical)) {
        issues.push(`hreflang cluster does not list the page's own canonical (${canonical})`);
      }
      if (!alternates.some((a) => a.hreflang === 'x-default')) {
        issues.push('hreflang cluster missing x-default');
      }
    }
  } else if (canonicalPath === selfPath) {
    issues.push('self-canonical page has no hreflang cluster (CommonMeta.astro should emit one)');
  }

  return issues;
}

function main() {
  let files;
  try {
    files = listHtml(ROOT);
  } catch {
    console.error(`[check-meta] Cannot read ${ROOT}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  let pages = 0;
  let skipped = 0;
  let dirtyPages = 0;
  let totalIssues = 0;
  const perPage = [];

  for (const f of files) {
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    if (rel === '404.html') continue;
    const html = readFileSync(f, 'utf8');
    if (isNoindex(html)) {
      skipped++;
      continue;
    }
    pages++;
    const issues = checkPage(f, html);
    if (issues.length > 0) {
      dirtyPages++;
      totalIssues += issues.length;
      perPage.push({ path: rel, issues });
    }
  }

  perPage.sort((a, b) => b.issues.length - a.issues.length);

  console.log(`[check-meta] root=${ROOT}`);
  console.log(`[check-meta] Scanned ${pages} pages (${skipped} noindex skipped).`);
  console.log(`[check-meta] Pages with issues: ${dirtyPages}`);
  console.log(`[check-meta] Total issues: ${totalIssues}`);

  const max = parseInt(process.env.META_REPORT_LIMIT || '30', 10);
  for (const { path, issues } of perPage.slice(0, max)) {
    console.log(`\n  ${issues.length}  ${path}`);
    for (const msg of issues.slice(0, 10)) console.log(`     ${msg}`);
    if (issues.length > 10) console.log(`     … and ${issues.length - 10} more`);
  }

  if (dirtyPages > 0) {
    console.log('\n[check-meta] FAIL — fix the meta issues above.');
    process.exit(1);
  } else {
    console.log('\n[check-meta] OK — titles, descriptions, canonical/hreflang all pass.');
  }
}

main();

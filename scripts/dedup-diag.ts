// scripts/dedup-diag.ts
// ────────────────────────────────────────────────────────────────────────
// Diagnostic for GSC "Duplicate, Google chose different canonical than user".
//
// Walks dist/ HTML, extracts the "main content" of each page (strip <head>,
// <nav>, <footer>, scripts, styles), normalizes whitespace, and groups pages
// by content fingerprint. Pages sharing a fingerprint are likely the cluster
// Google merged — that's what causes the GSC duplicate-canonical bucket.
//
// Run: `npm run build && npx tsx scripts/dedup-diag.ts`

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';

function* walkHtml(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      yield* walkHtml(p);
    } else if (name.endsWith('.html')) {
      yield p;
    }
  }
}

function extractMainText(html: string): string {
  // Strip <script>, <style>, <noscript> blocks
  let s = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ');
  s = s.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ' ');
  // Strip header / footer / nav (typical chrome)
  s = s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, ' ');
  s = s.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, ' ');
  s = s.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, ' ');
  // Strip all remaining tags
  s = s.replace(/<[^>]+>/g, ' ');
  // Decode common entities
  s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function fingerprint(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function urlPath(file: string): string {
  let p = relative(DIST, file).replace(/\\/g, '/');
  if (p.endsWith('/index.html')) p = '/' + p.slice(0, -'index.html'.length);
  else p = '/' + p;
  return p;
}

const groups = new Map<string, Array<{ url: string; len: number; sample: string }>>();
let total = 0;
for (const file of walkHtml(DIST)) {
  total += 1;
  const html = readFileSync(file, 'utf8');
  // Skip noindex pages (those are intentionally excluded from sitemap)
  if (/<meta\s+(?:[^>]*\s)?content="[^"]*noindex/i.test(html)) continue;
  const text = extractMainText(html);
  if (text.length < 50) continue;
  const fp = fingerprint(text);
  const arr = groups.get(fp) || [];
  arr.push({ url: urlPath(file), len: text.length, sample: text.slice(0, 80) });
  groups.set(fp, arr);
}

const dupes = [...groups.values()].filter((g) => g.length > 1);
dupes.sort((a, b) => b.length - a.length);

console.log(`Scanned ${total} HTML files, ${dupes.length} duplicate fingerprints found.\n`);

let totalDupePages = 0;
for (const g of dupes) {
  totalDupePages += g.length;
  console.log(`── ${g.length} pages share fingerprint (len=${g[0].len}) ──`);
  console.log(`   sample: "${g[0].sample}…"`);
  for (const p of g) console.log(`   ${p.url}`);
  console.log('');
}

console.log(`\nTotal pages in duplicate clusters: ${totalDupePages}`);
console.log(`Estimated GSC "Duplicate" candidates: ~${totalDupePages - dupes.length} (one per cluster picked as canonical, rest go to bucket)`);

// Cross-language near-duplicate heuristic: en + zh siblings whose body
// lengths match exactly. Same-length zh/en pair often signals that the
// EN page is rendering Chinese fallback content (or both are equally
// templated stubs). Pages flagged exact-fingerprint above are excluded.
console.log(`\n── Cross-language near-duplicate (en + zh sibling, identical body length) ──`);
const byPath = new Map<string, Array<{ url: string; len: number }>>();
for (const pages of groups.values()) {
  for (const p of pages) {
    const stripped = p.url.replace(/^\/zh\//, '/');
    const arr = byPath.get(stripped) || [];
    arr.push({ url: p.url, len: p.len });
    byPath.set(stripped, arr);
  }
}
let nearDupCount = 0;
for (const pages of byPath.values()) {
  if (pages.length < 2) continue;
  const hasEn = pages.some((p) => !p.url.startsWith('/zh/'));
  const hasZh = pages.some((p) => p.url.startsWith('/zh/'));
  if (!hasEn || !hasZh) continue;
  const lens = pages.map((p) => p.len).sort((a, b) => a - b);
  if (lens[0] === lens[lens.length - 1]) {
    nearDupCount += pages.length;
  }
}
console.log(`Pages where en/zh siblings have identical body length: ${nearDupCount}`);

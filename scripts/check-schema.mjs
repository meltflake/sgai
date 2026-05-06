#!/usr/bin/env node
// Structured-data validator for built HTML.
//
// Run after `npm run build`:
//   node scripts/check-schema.mjs              # scan dist/**/*.html
//   node scripts/check-schema.mjs --root dist
//
// Why this exists: ESLint / Astro check / Prettier never look inside the
// JSON-LD <script> blocks the site emits. Google Search Console picks up
// missing or empty required fields (e.g. BreadcrumbList itemListElement
// without `name`) only after crawling production. This script asserts the
// minimal required-field set per @type so regressions surface in CI
// instead of in GSC reports.
//
// Currently asserted @types (extend as new schemas are emitted):
//   - BreadcrumbList   itemListElement[*].name non-empty + position contiguous from 1
//   - VideoObject      name, description, uploadDate (ISO 8601), thumbnailUrl
//   - Article|NewsArticle|BlogPosting   headline, datePublished (ISO 8601)
//   - Organization     name
//   - Person           name
//   - WebSite          name, url
// Unknown @types are ignored (not failed) so adding new schemas does not
// break the pipeline before assertions are added.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const ROOT = arg('--root', 'dist');

// ISO 8601 date or datetime (with optional timezone). Accepts YYYY-MM-DD,
// YYYY-MM-DDTHH:MM:SS, plus optional fractional seconds and Z|+HH:MM offset.
const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isUrl(v) {
  if (!isNonEmptyString(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
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

function extractJsonLd(html) {
  const blocks = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else if (parsed && typeof parsed === 'object' && '@graph' in parsed && Array.isArray(parsed['@graph'])) {
        blocks.push(...parsed['@graph']);
      } else {
        blocks.push(parsed);
      }
    } catch (e) {
      blocks.push({ __parseError: e.message, __raw: raw.slice(0, 120) });
    }
  }
  return blocks;
}

function validate(node) {
  const issues = [];
  if (!node || typeof node !== 'object') return issues;
  if (node.__parseError) {
    issues.push(`JSON parse error: ${node.__parseError}`);
    return issues;
  }
  const t = node['@type'];
  const types = Array.isArray(t) ? t : [t];

  for (const ty of types) {
    if (ty === 'BreadcrumbList') {
      const list = node.itemListElement;
      if (!Array.isArray(list) || list.length === 0) {
        issues.push('BreadcrumbList: itemListElement missing or empty');
        continue;
      }
      list.forEach((it, i) => {
        if (!it || typeof it !== 'object') {
          issues.push(`BreadcrumbList[${i}]: not an object`);
          return;
        }
        if (!isNonEmptyString(it.name) && !(it.item && isNonEmptyString(it.item.name))) {
          issues.push(`BreadcrumbList[${i}]: missing/empty name (and item.name)`);
        }
        if (typeof it.position !== 'number' || it.position !== i + 1) {
          issues.push(`BreadcrumbList[${i}]: position should be ${i + 1}, got ${it.position}`);
        }
      });
    } else if (ty === 'VideoObject') {
      if (!isNonEmptyString(node.name)) issues.push('VideoObject: name missing/empty');
      if (!isNonEmptyString(node.description)) issues.push('VideoObject: description missing/empty');
      if (!isNonEmptyString(node.uploadDate) || !ISO_8601.test(node.uploadDate)) {
        issues.push(`VideoObject: uploadDate not ISO 8601 (got ${JSON.stringify(node.uploadDate)})`);
      }
      const thumb = node.thumbnailUrl;
      const thumbOk = Array.isArray(thumb) ? thumb.some(isUrl) : isUrl(thumb);
      if (!thumbOk) issues.push('VideoObject: thumbnailUrl missing/invalid');
    } else if (ty === 'Article' || ty === 'NewsArticle' || ty === 'BlogPosting') {
      if (!isNonEmptyString(node.headline)) issues.push(`${ty}: headline missing/empty`);
      if (!isNonEmptyString(node.datePublished) || !ISO_8601.test(node.datePublished)) {
        issues.push(`${ty}: datePublished not ISO 8601 (got ${JSON.stringify(node.datePublished)})`);
      }
    } else if (ty === 'Organization' || ty === 'Person') {
      if (!isNonEmptyString(node.name)) issues.push(`${ty}: name missing/empty`);
    } else if (ty === 'WebSite') {
      if (!isNonEmptyString(node.name)) issues.push('WebSite: name missing/empty');
      if (!isUrl(node.url)) issues.push('WebSite: url missing/invalid');
    }
  }
  return issues;
}

function main() {
  let files;
  try {
    files = listHtml(ROOT);
  } catch {
    console.error(`[check-schema] Cannot read ${ROOT}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  let pages = 0;
  let dirtyPages = 0;
  let totalIssues = 0;
  const perPage = [];

  for (const f of files) {
    pages++;
    const blocks = extractJsonLd(readFileSync(f, 'utf8'));
    const issues = [];
    blocks.forEach((b, i) => {
      const t = b && b['@type'];
      const tag = Array.isArray(t) ? t.join('+') : t || '<no @type>';
      for (const msg of validate(b)) {
        issues.push(`[block ${i} ${tag}] ${msg}`);
      }
    });
    if (issues.length > 0) {
      dirtyPages++;
      totalIssues += issues.length;
      perPage.push({ path: relative(ROOT, f), issues });
    }
  }

  perPage.sort((a, b) => b.issues.length - a.issues.length);

  console.log(`[check-schema] root=${ROOT}`);
  console.log(`[check-schema] Scanned ${pages} pages.`);
  console.log(`[check-schema] Pages with issues: ${dirtyPages}`);
  console.log(`[check-schema] Total issues: ${totalIssues}`);

  const max = parseInt(process.env.SCHEMA_REPORT_LIMIT || '30', 10);
  for (const { path, issues } of perPage.slice(0, max)) {
    console.log(`\n  ${issues.length}  ${path}`);
    for (const msg of issues.slice(0, 10)) console.log(`     ${msg}`);
    if (issues.length > 10) console.log(`     … and ${issues.length - 10} more`);
  }

  if (dirtyPages > 0) {
    console.log('\n[check-schema] FAIL — fix the JSON-LD issues above.');
    process.exit(1);
  } else {
    console.log('\n[check-schema] OK — all asserted @types pass.');
  }
}

main();

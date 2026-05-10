// scripts/evals/schema-richresults/check.ts
// ────────────────────────────────────────────────────────────────────────
// Schema Rich Results eval. Stricter cousin of scripts/check-schema.mjs.
//
// Why a separate eval: check:schema asserts the MINIMUM required fields
// per @type (so PR blocks for "GSC will reject this"). Rich Results adds a
// second tier — the RECOMMENDED fields Google rewards with rich snippets
// (image, author, publisher, dateModified, etc.). Missing those doesn't
// block PRs, but tracking them in a sample-based eval lets us catch
// regressions before they affect SERP appearance.
//
// What it does:
//   1. Reads dist/ (must run `npm run build` first)
//   2. For each entry in pages.json, locates the dist HTML
//   3. Extracts JSON-LD from the page
//   4. For each `expectedTypes`, asserts:
//        ERROR — required fields (failure blocks merge if --fail-on-warn=false)
//        WARN  — recommended fields (Rich Results enrichment)
//   5. Writes JSON + Markdown report
//
// pathGlob: when an id changes (e.g. policies/<latest-slug>/index.html),
// `pathGlob` with `{first}` resolves to the first matching directory under
// the prefix. Lets the eval stay stable as new entries replace old.
//
// Exit codes:
//   0 — all checks pass (warnings allowed if `warningOk` in pages.json)
//   1 — at least one ERROR or any WARN if --fail-on-warn
//   2 — invocation / config error / dist missing

import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const DIST_DIR = join(REPO_ROOT, 'dist');
const PAGES_PATH = resolve(import.meta.dirname, 'pages.json');
const REPORT_DIR = resolve(import.meta.dirname, 'reports');

const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

type Severity = 'error' | 'warn';
type AnyObj = Record<string, unknown>;

interface PageEntry {
  label: string;
  path?: string;
  pathGlob?: string;
  expectedTypes: string[];
  warningOk?: boolean;
}

interface PagesConfig {
  pages: PageEntry[];
}

interface Issue {
  severity: Severity;
  type: string;
  field: string;
  detail: string;
}

interface PageResult {
  label: string;
  resolvedPath: string | null;
  errors: Issue[];
  warnings: Issue[];
  missingTypes: string[];
}

interface CliOptions {
  failOnWarn: boolean;
  label?: string;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { failOnWarn: false };
  for (const a of argv) {
    if (a === '--fail-on-warn') opts.failOnWarn = true;
    else if (a.startsWith('--label=')) opts.label = a.slice('--label='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write('Usage: eval:schema [--fail-on-warn] [--label=<label>]\n');
      process.exit(0);
    }
  }
  return opts;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isUrl(v: unknown): boolean {
  if (!isNonEmptyString(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function extractJsonLd(html: string): AnyObj[] {
  const blocks: AnyObj[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks.push(...(parsed as AnyObj[]));
      else if (parsed && typeof parsed === 'object' && '@graph' in parsed && Array.isArray(parsed['@graph'])) {
        blocks.push(...(parsed['@graph'] as AnyObj[]));
      } else {
        blocks.push(parsed as AnyObj);
      }
    } catch {
      blocks.push({ __parseError: true } as AnyObj);
    }
  }
  return blocks;
}

function getTypes(node: AnyObj): string[] {
  const t = node['@type'];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string');
  if (typeof t === 'string') return [t];
  return [];
}

function findFirstByType(blocks: AnyObj[], type: string): AnyObj | null {
  for (const b of blocks) {
    if (getTypes(b).includes(type)) return b;
  }
  return null;
}

function validateOrganization(node: AnyObj): Issue[] {
  const out: Issue[] = [];
  if (!isNonEmptyString(node.name)) out.push({ severity: 'error', type: 'Organization', field: 'name', detail: 'missing/empty' });
  if (!isUrl(node.url)) out.push({ severity: 'warn', type: 'Organization', field: 'url', detail: 'missing/invalid (recommended for Rich Results)' });
  if (!node.logo) out.push({ severity: 'warn', type: 'Organization', field: 'logo', detail: 'missing (recommended)' });
  return out;
}

function validateWebSite(node: AnyObj): Issue[] {
  const out: Issue[] = [];
  if (!isNonEmptyString(node.name)) out.push({ severity: 'error', type: 'WebSite', field: 'name', detail: 'missing/empty' });
  if (!isUrl(node.url)) out.push({ severity: 'error', type: 'WebSite', field: 'url', detail: 'missing/invalid' });
  if (!node.potentialAction) out.push({ severity: 'warn', type: 'WebSite', field: 'potentialAction', detail: 'missing SearchAction (recommended for Sitelinks Searchbox)' });
  return out;
}

function validateBreadcrumbList(node: AnyObj): Issue[] {
  const out: Issue[] = [];
  const list = node.itemListElement;
  if (!Array.isArray(list) || list.length === 0) {
    out.push({ severity: 'error', type: 'BreadcrumbList', field: 'itemListElement', detail: 'missing/empty' });
    return out;
  }
  list.forEach((it, i) => {
    if (!it || typeof it !== 'object') {
      out.push({ severity: 'error', type: 'BreadcrumbList', field: `itemListElement[${i}]`, detail: 'not an object' });
      return;
    }
    const item = it as AnyObj;
    const name = isNonEmptyString(item.name) ? item.name : null;
    const itemName = item.item && typeof item.item === 'object' && isNonEmptyString((item.item as AnyObj).name);
    if (!name && !itemName) {
      out.push({ severity: 'error', type: 'BreadcrumbList', field: `itemListElement[${i}].name`, detail: 'missing/empty (and item.name)' });
    }
    if (typeof item.position !== 'number' || item.position !== i + 1) {
      out.push({
        severity: 'error',
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].position`,
        detail: `expected ${i + 1}, got ${item.position}`,
      });
    }
  });
  return out;
}

function validateArticleLike(node: AnyObj, type: string): Issue[] {
  const out: Issue[] = [];
  if (!isNonEmptyString(node.headline)) {
    out.push({ severity: 'error', type, field: 'headline', detail: 'missing/empty' });
  } else if ((node.headline as string).length > 110) {
    out.push({ severity: 'warn', type, field: 'headline', detail: `>110 chars (Rich Results truncates after 110)` });
  }
  if (!isNonEmptyString(node.datePublished) || !ISO_8601.test(node.datePublished as string)) {
    out.push({ severity: 'error', type, field: 'datePublished', detail: `not ISO 8601: ${JSON.stringify(node.datePublished)}` });
  }
  if (!node.dateModified) {
    out.push({ severity: 'warn', type, field: 'dateModified', detail: 'missing (recommended)' });
  } else if (!ISO_8601.test(node.dateModified as string)) {
    out.push({ severity: 'error', type, field: 'dateModified', detail: `not ISO 8601: ${JSON.stringify(node.dateModified)}` });
  }
  if (!node.image) {
    out.push({ severity: 'warn', type, field: 'image', detail: 'missing (Rich Results enrichment requires image)' });
  } else {
    const imgs = Array.isArray(node.image) ? node.image : [node.image];
    const goodImg = imgs.some((i) => isUrl(i) || (typeof i === 'object' && i !== null && isUrl((i as AnyObj).url)));
    if (!goodImg) out.push({ severity: 'warn', type, field: 'image', detail: 'no valid URL or ImageObject' });
  }
  if (!node.author) {
    out.push({ severity: 'warn', type, field: 'author', detail: 'missing (recommended)' });
  } else {
    const authors = Array.isArray(node.author) ? node.author : [node.author];
    const goodAuthor = authors.some((a) => typeof a === 'object' && a !== null && isNonEmptyString((a as AnyObj).name));
    if (!goodAuthor) out.push({ severity: 'warn', type, field: 'author', detail: 'no Person/Organization with name' });
  }
  if (type === 'NewsArticle' && !node.publisher) {
    out.push({ severity: 'error', type, field: 'publisher', detail: 'NewsArticle requires publisher' });
  }
  return out;
}

function validatePerson(node: AnyObj): Issue[] {
  const out: Issue[] = [];
  if (!isNonEmptyString(node.name)) out.push({ severity: 'error', type: 'Person', field: 'name', detail: 'missing/empty' });
  if (!node.url) out.push({ severity: 'warn', type: 'Person', field: 'url', detail: 'missing (recommended)' });
  if (!node.jobTitle && !node.affiliation) {
    out.push({ severity: 'warn', type: 'Person', field: 'jobTitle/affiliation', detail: 'missing (one recommended for Profile schema)' });
  }
  return out;
}

function validateVideo(node: AnyObj): Issue[] {
  const out: Issue[] = [];
  if (!isNonEmptyString(node.name)) out.push({ severity: 'error', type: 'VideoObject', field: 'name', detail: 'missing/empty' });
  if (!isNonEmptyString(node.description)) out.push({ severity: 'error', type: 'VideoObject', field: 'description', detail: 'missing/empty' });
  if (!isNonEmptyString(node.uploadDate) || !ISO_8601.test(node.uploadDate as string)) {
    out.push({ severity: 'error', type: 'VideoObject', field: 'uploadDate', detail: `not ISO 8601: ${JSON.stringify(node.uploadDate)}` });
  }
  const thumb = node.thumbnailUrl;
  const thumbOk = Array.isArray(thumb) ? thumb.some(isUrl) : isUrl(thumb);
  if (!thumbOk) out.push({ severity: 'error', type: 'VideoObject', field: 'thumbnailUrl', detail: 'missing/invalid' });
  if (!isUrl(node.contentUrl) && !isUrl(node.embedUrl)) {
    out.push({ severity: 'warn', type: 'VideoObject', field: 'contentUrl/embedUrl', detail: 'one required for video Rich Results' });
  }
  if (!node.duration) out.push({ severity: 'warn', type: 'VideoObject', field: 'duration', detail: 'missing (recommended ISO 8601 duration)' });
  return out;
}

function validateNode(node: AnyObj): Issue[] {
  const types = getTypes(node);
  const out: Issue[] = [];
  for (const t of types) {
    if (t === 'Organization') out.push(...validateOrganization(node));
    else if (t === 'WebSite') out.push(...validateWebSite(node));
    else if (t === 'BreadcrumbList') out.push(...validateBreadcrumbList(node));
    else if (t === 'Article' || t === 'NewsArticle' || t === 'BlogPosting') out.push(...validateArticleLike(node, t));
    else if (t === 'Person') out.push(...validatePerson(node));
    else if (t === 'VideoObject') out.push(...validateVideo(node));
  }
  return out;
}

function resolvePath(entry: PageEntry): string | null {
  if (entry.path) {
    const full = join(DIST_DIR, entry.path);
    return existsSync(full) ? full : null;
  }
  if (entry.pathGlob) {
    // {first} expansion: pick the first matching subdir of the prefix.
    const parts = entry.pathGlob.split('/');
    const idx = parts.findIndex((p) => p === '{first}');
    if (idx === -1) return null;
    const prefix = parts.slice(0, idx).join('/');
    const suffix = parts.slice(idx + 1).join('/');
    const prefixDir = join(DIST_DIR, prefix);
    if (!existsSync(prefixDir)) return null;
    let candidates: string[] = [];
    try {
      candidates = readdirSync(prefixDir).filter((n) => {
        const full = join(prefixDir, n);
        try {
          return statSync(full).isDirectory();
        } catch {
          return false;
        }
      });
    } catch {
      return null;
    }
    if (candidates.length === 0) return null;
    candidates.sort();
    const full = join(prefixDir, candidates[0], suffix);
    return existsSync(full) ? full : null;
  }
  return null;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function writeReport(results: PageResult[]): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);
  const totals = {
    pages: results.length,
    errors: results.reduce((n, r) => n + r.errors.length, 0),
    warnings: results.reduce((n, r) => n + r.warnings.length, 0),
    missingTypes: results.reduce((n, r) => n + r.missingTypes.length, 0),
  };
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), totals, results }, null, 2));

  const lines: string[] = [`# Schema Rich Results Report — ${stamp}`, ''];
  lines.push(`- Pages sampled: ${totals.pages}`);
  lines.push(`- Errors: ${totals.errors}`);
  lines.push(`- Warnings: ${totals.warnings}`);
  lines.push(`- Missing expected types: ${totals.missingTypes}`);
  lines.push('');
  for (const r of results) {
    lines.push(`## ${r.label}`);
    lines.push(`Path: \`${r.resolvedPath ?? '(not found)'}\``);
    if (r.missingTypes.length > 0) {
      lines.push(`MISSING expected types: ${r.missingTypes.join(', ')}`);
    }
    for (const e of r.errors) {
      lines.push(`- ✗ [ERROR] ${e.type}.${e.field} — ${e.detail}`);
    }
    for (const w of r.warnings) {
      lines.push(`- · [WARN]  ${w.type}.${w.field} — ${w.detail}`);
    }
    if (r.errors.length === 0 && r.warnings.length === 0 && r.missingTypes.length === 0) {
      lines.push('- ✓ clean');
    }
    lines.push('');
  }
  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

function main() {
  const opts = parseCli(process.argv.slice(2));

  if (!existsSync(DIST_DIR)) {
    process.stderr.write(`dist/ missing — run \`npm run build\` first.\n`);
    process.exit(2);
  }

  let cfg: PagesConfig;
  try {
    cfg = JSON.parse(readFileSync(PAGES_PATH, 'utf8')) as PagesConfig;
  } catch (err) {
    process.stderr.write(`Cannot read pages.json: ${(err as Error).message}\n`);
    process.exit(2);
  }
  const entries = opts.label ? cfg.pages.filter((p) => p.label === opts.label) : cfg.pages;
  if (entries.length === 0) {
    process.stderr.write(`No matching page entries.\n`);
    process.exit(2);
  }

  const results: PageResult[] = [];

  for (const entry of entries) {
    const file = resolvePath(entry);
    if (!file) {
      results.push({
        label: entry.label,
        resolvedPath: null,
        errors: [{ severity: 'error', type: '_meta', field: 'path', detail: `cannot resolve ${entry.path ?? entry.pathGlob}` }],
        warnings: [],
        missingTypes: entry.expectedTypes,
      });
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const blocks = extractJsonLd(html);
    const errors: Issue[] = [];
    const warnings: Issue[] = [];
    const missingTypes: string[] = [];

    for (const t of entry.expectedTypes) {
      const node = findFirstByType(blocks, t);
      if (!node) {
        missingTypes.push(t);
        errors.push({ severity: 'error', type: t, field: '_presence', detail: `expected schema not found on page` });
        continue;
      }
      for (const issue of validateNode(node)) {
        if (issue.severity === 'error') errors.push(issue);
        else warnings.push(issue);
      }
    }

    results.push({ label: entry.label, resolvedPath: relative(REPO_ROOT, file), errors, warnings, missingTypes });
  }

  const { mdPath } = writeReport(results);
  process.stdout.write(`Report: ${relative(REPO_ROOT, mdPath)}\n`);

  let totalErrors = 0;
  let totalWarn = 0;
  for (const r of results) {
    totalErrors += r.errors.length;
    totalWarn += r.warnings.length;
    const tag = r.errors.length > 0 ? 'FAIL' : r.warnings.length > 0 ? 'WARN' : 'PASS';
    process.stdout.write(`  [${tag}] ${r.label} — ${r.errors.length} error(s), ${r.warnings.length} warn(s)\n`);
  }

  if (totalErrors > 0 || (opts.failOnWarn && totalWarn > 0)) {
    process.stdout.write(`\n${totalErrors} error(s), ${totalWarn} warn(s).\n`);
    process.exit(1);
  }
  process.stdout.write(`\nAll pages OK (${totalWarn} warning(s) tolerated).\n`);
  process.exit(0);
}

main();

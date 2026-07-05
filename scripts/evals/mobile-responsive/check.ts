// scripts/evals/mobile-responsive/check.ts
// ────────────────────────────────────────────────────────────────────────
// Mobile-responsive eval — catches layouts that break on a narrow phone
// viewport (375px). Born from the 2026-07 revamp (#94/#95/#98/#100), which
// shipped new listing pages that were never made mobile-first: bare
// multi-column grids, fixed-width columns, oversized min-widths.
//
// Two layers (mirrors the i18n-coverage --layer split):
//
//   static  — regex scan of src/**/*.astro. Zero deps, no build needed.
//             The ONLY hard FAIL is the viewport-meta guard (zero false
//             positives). Everything else — bare `grid-cols-N`, oversized
//             min-w/w — is WARN: a fast pre-build smell list, not a verdict.
//             Rationale: a regex cannot tell a card grid (`grid-cols-3`
//             that should collapse on mobile) from a chart grid
//             (`grid-cols-12` of thin bars) or a col-span-compensated grid
//             (`grid-cols-3` whose children are `col-span-3 sm:col-span-1`,
//             i.e. one column on mobile). Both of the latter are correct yet
//             would false-FAIL. The render layer is the real overflow verdict.
//             Limitation: only literal `class="…"` strings — dynamically
//             concatenated classes escape it. The render layer backstops.
//
//   render  — ground truth. Serves dist/ via `astro preview`, loads a set of
//             representative pages in headless chromium at 375px, and asserts
//             the laid-out content fits the device width:
//             `documentElement.scrollWidth <= deviceWidth`. On overflow it
//             names the offending elements. Correctly PASSes intentionally-
//             scrollable inner rails / tables wrapped in `overflow-x-auto`
//             (their scroll does not widen the document).
//             Needs playwright (a NEW devDep) + a prior `npm run build`.
//
//             ⚠ Why deviceWidth and NOT window.innerWidth: with
//             `isMobile: true` chromium emulates real phone behaviour — when
//             content is wider than the device, the browser ZOOMS OUT to fit,
//             and innerWidth inflates to match scrollWidth. A
//             `scrollWidth <= innerWidth` assertion therefore never fires on
//             mobile; the zoomed-out, tiny-text page it waves through is the
//             exact failure users report as "bad on phones". Same trap when a
//             page lacks the viewport meta (980px fallback layout viewport).
//
// Usage:
//   npx tsx scripts/evals/mobile-responsive/check.ts                    # both layers
//   npx tsx scripts/evals/mobile-responsive/check.ts --layer=static     # source scan only (no build)
//   npx tsx scripts/evals/mobile-responsive/check.ts --layer=render     # headless only (needs dist/)
//   npx tsx scripts/evals/mobile-responsive/check.ts --url=/videos/     # render one page (debug)
//   npx tsx scripts/evals/mobile-responsive/check.ts --width=390        # override viewport width
//   npx tsx scripts/evals/mobile-responsive/check.ts --dry-run          # don't write reports
//
// NOTE: this round the eval is a manual/local tool only — NOT wired into CI
// or cron. Running the render layer against the current (unfixed) site is
// EXPECTED to report red; that red is the proof it works. It becomes a
// per-PR hard gate only after a separate full-fix pass makes it green.
//
// Exit codes:
//   0 — no failures (static FAILs = 0 and no page overflows)
//   1 — at least one FAIL (bare multi-col grid, missing viewport, overflow)
//   2 — invocation error (render requested but dist/ or playwright missing)

import type { Browser } from 'playwright';
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';

// ── Config ──────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const SRC_DIR = join(REPO_ROOT, 'src');
const DIST_DIR = join(REPO_ROOT, 'dist');
const REPORT_DIR = join(import.meta.dirname, 'reports');

const DEFAULT_WIDTH = 375; // iPhone SE — the narrow common baseline
const DEFAULT_HEIGHT = 667;
const PREVIEW_PORT = 4351; // uncommon port to avoid clashing with a dev server
const PREVIEW_HOST = '127.0.0.1';

// Astro's default breakpoint variants. A `grid-cols-N` token carrying any of
// these applies only at that breakpoint and up, so it does NOT dictate the
// mobile (base) column count — it is mobile-safe and not flagged.
const BREAKPOINTS = new Set(['sm', 'md', 'lg', 'xl', '2xl']);

// The file that must carry the viewport meta tag for the whole site.
const VIEWPORT_META_FILE = 'src/components/common/CommonMeta.astro';

// ── CLI ─────────────────────────────────────────────────────────────────

type Layer = 'static' | 'render' | 'all';

interface CliOptions {
  layer: Layer;
  url?: string;
  width: number;
  height: number;
  dryRun: boolean;
  json: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = {
    layer: 'all',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    dryRun: false,
    json: false,
  };
  for (const a of argv) {
    if (a.startsWith('--layer=')) {
      const v = a.slice('--layer='.length);
      if (v === 'static' || v === 'render' || v === 'all') opts.layer = v;
      else {
        process.stderr.write(`Unknown --layer=${v} (expected static|render|all)\n`);
        process.exit(2);
      }
    } else if (a.startsWith('--url=')) opts.url = a.slice('--url='.length);
    else if (a.startsWith('--width=')) opts.width = Number(a.slice('--width='.length)) || DEFAULT_WIDTH;
    else if (a.startsWith('--height=')) opts.height = Number(a.slice('--height='.length)) || DEFAULT_HEIGHT;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:mobile [--layer=static|render|all] [--url=<path>] [--width=N] [--dry-run] [--json]\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

// ── Static layer (pure, unit-tested) ──────────────────────────────────────

export type Severity = 'fail' | 'warn';

export interface StaticFinding {
  file: string;
  line: number;
  severity: Severity;
  rule: string;
  snippet: string;
  message: string;
}

/** 1-based line number of a character offset in `source`. */
function lineAt(source: string, index: number): number {
  let line = 1;
  const end = Math.min(index, source.length);
  for (let i = 0; i < end; i += 1) if (source[i] === '\n') line += 1;
  return line;
}

/** The utility segment of a Tailwind token: `md:hover:w-4` → `w-4`. */
function utilityOf(token: string): string {
  const parts = token.split(':');
  return parts[parts.length - 1];
}

/** True if a token carries a responsive breakpoint variant (sm/md/lg/xl/2xl). */
function hasBreakpointVariant(token: string): boolean {
  const parts = token.split(':');
  for (let i = 0; i < parts.length - 1; i += 1) if (BREAKPOINTS.has(parts[i])) return true;
  return false;
}

/**
 * Scan one file's source for mobile-hostile Tailwind class patterns. Pure —
 * no filesystem, no build — so it is directly unit-testable. Only inspects
 * literal `class="…"` / `class='…'` attribute values; dynamic class
 * expressions are out of scope (the render layer catches those).
 */
export function detectClassFindings(
  file: string,
  source: string,
  opts: { width?: number } = {},
): StaticFinding[] {
  const width = opts.width ?? DEFAULT_WIDTH;
  const findings: StaticFinding[] = [];
  const attrRe = /class(?:Name)?\s*=\s*(["'])([^"']*)\1/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(source)) !== null) {
    const value = m[2];
    const line = lineAt(source, m.index);
    for (const token of value.split(/\s+/)) {
      if (!token) continue;
      const util = utilityOf(token);
      const guarded = hasBreakpointVariant(token);

      const grid = util.match(/^grid-cols-(\d+)$/);
      if (grid) {
        const n = Number(grid[1]);
        if (!guarded && n >= 2) {
          // WARN, not FAIL: could be a card grid that should collapse, OR a
          // legitimate chart / col-span-compensated grid. The render layer
          // decides whether it actually overflows.
          findings.push({
            file,
            line,
            severity: 'warn',
            rule: n >= 3 ? 'bare-grid-cols' : 'bare-grid-cols-2',
            snippet: token,
            message: `\`${token}\` has no responsive prefix → ${n} columns at ${width}px. If it is a content-card grid, add a mobile default like \`grid-cols-1 sm:grid-cols-2 md:grid-cols-${n}\`. Verify against the render layer — charts / col-span grids are fine as-is.`,
          });
        }
        continue;
      }

      const minW = util.match(/^min-w-\[(\d+)px\]$/);
      if (minW) {
        const n = Number(minW[1]);
        if (n > width) {
          findings.push({
            file,
            line,
            severity: 'warn',
            rule: 'large-min-w',
            snippet: token,
            message: `\`${token}\` (${n}px) exceeds the ${width}px viewport. Confirm it sits inside an \`overflow-x-auto\` ancestor, or it will burst the page width.`,
          });
        }
        continue;
      }

      const fixedW = util.match(/^w-\[(\d+)px\]$/);
      if (fixedW) {
        const n = Number(fixedW[1]);
        if (n > width) {
          findings.push({
            file,
            line,
            severity: 'warn',
            rule: 'large-fixed-w',
            snippet: token,
            message: `\`${token}\` (${n}px) is wider than the ${width}px viewport and non-fluid; prefer \`max-w-full\` or a responsive width.`,
          });
        }
      }
    }
  }
  return findings;
}

/** True if `source` contains a `<meta name="viewport" … width=device-width …>`. */
export function hasViewportMeta(source: string): boolean {
  const tag = source.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!tag) return false;
  return /width\s*=\s*device-width/i.test(tag[0]);
}

/** Recursively collect every `.astro` file under `dir` (mirrors walkHtml). */
function walkAstro(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkAstro(full));
    else if (name.endsWith('.astro')) out.push(full);
  }
  return out;
}

function runStatic(opts: CliOptions): StaticFinding[] {
  const findings: StaticFinding[] = [];
  for (const abs of walkAstro(SRC_DIR)) {
    const rel = relative(REPO_ROOT, abs);
    findings.push(...detectClassFindings(rel, readFileSync(abs, 'utf8'), { width: opts.width }));
  }
  // Viewport guard: the single most load-bearing mobile prerequisite.
  const vpAbs = join(REPO_ROOT, VIEWPORT_META_FILE);
  if (!existsSync(vpAbs)) {
    findings.push({
      file: VIEWPORT_META_FILE,
      line: 1,
      severity: 'fail',
      rule: 'viewport-meta-file',
      snippet: '',
      message: `${VIEWPORT_META_FILE} not found — cannot confirm the viewport meta tag.`,
    });
  } else if (!hasViewportMeta(readFileSync(vpAbs, 'utf8'))) {
    findings.push({
      file: VIEWPORT_META_FILE,
      line: 1,
      severity: 'fail',
      rule: 'viewport-meta',
      snippet: '',
      message: 'Missing or malformed <meta name="viewport" content="width=device-width …">. Mobile rendering depends on it.',
    });
  }
  return findings;
}

// ── Render layer (headless browser, ground truth) ──────────────────────────

interface Offender {
  tag: string;
  cls: string;
  right: number;
  width: number;
  self: boolean; // scrollWidth > clientWidth — content overflows the element itself (a root cause, not a stretched victim)
}

interface PageResult {
  url: string;
  status: number;
  innerWidth?: number; // diagnostic: > deviceWidth means the browser zoomed out to fit
  scrollWidth?: number;
  overflow?: number; // scrollWidth - deviceWidth; > 1 = fail
  hasViewportMeta?: boolean;
  offenders?: Offender[];
  skipped?: boolean; // non-2xx (stale URL) — not counted as overflow fail
  error?: string;
}

/**
 * Representative pages, discovered from the actual build so URLs are never
 * stale. One listing per section + home + a couple of detail pages, for the
 * route-default locale (EN, bare root) and one secondary locale (zh, /zh/).
 * Add a section here to extend coverage.
 */
const SECTIONS = [
  'videos',
  'benchmarking',
  'startups',
  'talent',
  'voices',
  'ecosystem',
  'policies',
  'timeline',
  'legal-ai',
  'levers',
  'topics',
  'debates',
];
const LOCALE_PREFIXES = ['', 'zh']; // '' = EN at root, 'zh' = /zh/…

/** Name of the first nested subdir under `dir` that has its own index.html. */
function firstNestedPage(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory() && existsSync(join(full, 'index.html'))) return name;
  }
  return undefined;
}

function discoverPages(distDir: string): string[] {
  const urls = new Set<string>();
  for (const loc of LOCALE_PREFIXES) {
    const base = loc ? `/${loc}` : '';
    if (existsSync(join(distDir, loc, 'index.html'))) urls.add(`${base}/`);
    for (const s of SECTIONS) {
      if (existsSync(join(distDir, loc, s, 'index.html'))) urls.add(`${base}/${s}/`);
    }
  }
  // A couple of detail pages (EN root) to exercise article/entry templates.
  for (const s of ['videos', 'debates']) {
    const slug = firstNestedPage(join(distDir, s));
    if (slug) urls.add(`/${s}/${slug}/`);
  }
  return [...urls];
}

async function waitForServer(baseUrl: string, attempts = 40, delayMs = 300): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(baseUrl, { method: 'GET' });
      if (res.status > 0) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

function startPreview(): ChildProcess {
  // Spawn the astro binary directly (not `npm run preview`) so the server IS
  // our child process and a single kill() stops it — no orphaned npm wrapper.
  const bin = join(REPO_ROOT, 'node_modules', '.bin', 'astro');
  return spawn(bin, ['preview', '--port', String(PREVIEW_PORT), '--host', PREVIEW_HOST], {
    cwd: REPO_ROOT,
    stdio: 'ignore',
  });
}

/**
 * Runs inside the page (serialized by playwright — must not close over outer
 * values). All comparisons are against `deviceWidth` (the configured 375),
 * NOT window.innerWidth: under isMobile emulation the browser zooms out when
 * content overflows, inflating innerWidth to match scrollWidth — see the
 * header comment.
 */
function measureOverflow(deviceWidth: number): {
  innerWidth: number;
  scrollWidth: number;
  overflow: number;
  hasViewportMeta: boolean;
  offenders: Offender[];
} {
  const de = document.documentElement;
  const body = document.body;
  const innerWidth = window.innerWidth;
  const scrollWidth = Math.max(de.scrollWidth, body ? body.scrollWidth : 0);
  const overflow = scrollWidth - deviceWidth;
  const offenders: Offender[] = [];
  if (overflow > 1) {
    for (const el of Array.from(document.querySelectorAll('*'))) {
      const r = el.getBoundingClientRect();
      if (r.right > deviceWidth + 1 && r.width > 0 && r.height > 0) {
        const cls = typeof el.className === 'string' ? el.className : '';
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: cls.slice(0, 120),
          right: Math.round(r.right),
          width: Math.round(r.width),
          self: el.scrollWidth > el.clientWidth + 1,
        });
      }
    }
    // Self-overflow elements (content wider than the box — the actual culprits)
    // first; then widest. A page of stretched-victim containers all report the
    // same right edge, so surfacing self-overflow points straight at the cause.
    offenders.sort((a, b) => Number(b.self) - Number(a.self) || b.right - a.right);
  }
  const vp = document.querySelector('meta[name="viewport"]');
  return { innerWidth, scrollWidth, overflow, hasViewportMeta: !!vp, offenders: offenders.slice(0, 12) };
}

async function runRender(opts: CliOptions): Promise<PageResult[]> {
  // Lazy import so the static layer + unit tests never require playwright.
  let chromium: typeof import('playwright').chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    throw new InvocationError(
      "playwright is not installed. Run: npm i -D playwright && npx playwright install chromium",
    );
  }

  const baseUrl = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
  const urls = opts.url ? [opts.url] : discoverPages(DIST_DIR);
  if (urls.length === 0) throw new InvocationError('No pages discovered under dist/ — is the build empty?');

  const server = startPreview();
  const results: PageResult[] = [];
  let browser: Browser | undefined;
  try {
    const ready = await waitForServer(`${baseUrl}/`);
    if (!ready) throw new InvocationError(`astro preview did not come up on ${baseUrl}`);

    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: opts.width, height: opts.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    process.stdout.write(`[mobile-responsive] rendering ${urls.length} page(s) at ${opts.width}px…\n`);
    for (const url of urls) {
      const page = await context.newPage();
      try {
        const resp = await page.goto(`${baseUrl}${url}`, { waitUntil: 'load', timeout: 20000 });
        const status = resp?.status() ?? 0;
        if (status >= 400) {
          results.push({ url, status, skipped: true });
          continue;
        }
        const metrics = await page.evaluate(measureOverflow, opts.width);
        results.push({ url, status, ...metrics });
      } catch (err) {
        results.push({ url, status: 0, error: err instanceof Error ? err.message : String(err) });
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
  return results;
}

/** Thrown for exit-code-2 conditions (missing dist/playwright/server). */
class InvocationError extends Error {}

// ── Reporting ─────────────────────────────────────────────────────────────

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

interface Report {
  generatedAt: string;
  opts: CliOptions;
  static: { ran: boolean; fail: number; warn: number; findings: StaticFinding[] };
  render: { ran: boolean; overflowed: number; skipped: number; pages: PageResult[] };
}

function writeReport(report: Report): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\n');

  const lines: string[] = [];
  lines.push(`# Mobile-Responsive Report — ${stamp}`);
  lines.push('');
  if (report.static.ran) {
    lines.push(`## Static layer — ${report.static.fail} FAIL, ${report.static.warn} WARN`);
    lines.push('');
    const byFile = new Map<string, StaticFinding[]>();
    for (const f of report.static.findings) {
      const arr = byFile.get(f.file) ?? [];
      arr.push(f);
      byFile.set(f.file, arr);
    }
    for (const [file, items] of byFile) {
      lines.push(`### ${file}`);
      for (const it of items) {
        lines.push(`- **${it.severity.toUpperCase()}** L${it.line} (${it.rule}) — ${it.message}`);
      }
      lines.push('');
    }
    if (report.static.findings.length === 0) lines.push('No static findings.\n');
  }
  if (report.render.ran) {
    lines.push(`## Render layer — ${report.render.overflowed} overflowing, ${report.render.skipped} skipped`);
    lines.push('');
    for (const p of report.render.pages) {
      if (p.error) {
        lines.push(`- **ERROR** \`${p.url}\` — ${p.error}`);
      } else if (p.skipped) {
        lines.push(`- _skip_ \`${p.url}\` — HTTP ${p.status}`);
      } else if ((p.overflow ?? 0) > 1) {
        lines.push(
          `- **OVERFLOW** \`${p.url}\` — content ${p.scrollWidth}px > ${report.opts.width}px device (+${p.overflow}px; browser zooms out to fit)`,
        );
        for (const o of p.offenders ?? []) {
          const mark = o.self ? '⤷ self-overflow ' : '';
          lines.push(`    - ${mark}\`<${o.tag}>\` right=${o.right} w=${o.width} class="${o.cls}"`);
        }
      } else {
        lines.push(`- ok \`${p.url}\` — ${p.scrollWidth}px`);
      }
    }
    lines.push('');
  }
  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseCli(process.argv.slice(2));
  const wantStatic = opts.layer === 'static' || opts.layer === 'all';
  const wantRender = opts.layer === 'render' || opts.layer === 'all';

  let staticFindings: StaticFinding[] = [];
  if (wantStatic) {
    staticFindings = runStatic(opts);
    const fail = staticFindings.filter((f) => f.severity === 'fail').length;
    const warn = staticFindings.length - fail;
    process.stdout.write(`[mobile-responsive] static: ${fail} FAIL, ${warn} WARN\n`);
  }

  let renderResults: PageResult[] = [];
  let renderRan = false;
  if (wantRender) {
    if (!existsSync(DIST_DIR)) {
      if (opts.layer === 'render') {
        process.stderr.write('[mobile-responsive] dist/ not found — run `npm run build` first.\n');
        process.exit(2);
      }
      process.stdout.write('[mobile-responsive] render skipped: dist/ not found (run `npm run build`).\n');
    } else {
      try {
        renderResults = await runRender(opts);
        renderRan = true;
      } catch (err) {
        if (err instanceof InvocationError) {
          if (opts.layer === 'render') {
            process.stderr.write(`[mobile-responsive] ${err.message}\n`);
            process.exit(2);
          }
          process.stdout.write(`[mobile-responsive] render skipped: ${err.message}\n`);
        } else {
          throw err;
        }
      }
    }
  }

  const staticFail = staticFindings.filter((f) => f.severity === 'fail').length;
  const staticWarn = staticFindings.length - staticFail;
  const overflowed = renderResults.filter((p) => !p.skipped && !p.error && (p.overflow ?? 0) > 1);
  const skipped = renderResults.filter((p) => p.skipped).length;

  const report: Report = {
    generatedAt: new Date().toISOString(),
    opts,
    static: { ran: wantStatic, fail: staticFail, warn: staticWarn, findings: staticFindings },
    render: { ran: renderRan, overflowed: overflowed.length, skipped, pages: renderResults },
  };

  if (!opts.dryRun) {
    const { jsonPath, mdPath } = writeReport(report);
    process.stdout.write(`[mobile-responsive] reports: ${relative(REPO_ROOT, mdPath)}  ${relative(REPO_ROOT, jsonPath)}\n`);
  }

  if (opts.json) process.stdout.write(JSON.stringify(report, null, 2) + '\n');

  // Human summary of what fails.
  if (staticFail > 0) {
    process.stdout.write(`\n[mobile-responsive] static FAILs:\n`);
    for (const f of staticFindings.filter((x) => x.severity === 'fail').slice(0, 30)) {
      process.stdout.write(`  ${f.file}:${f.line} — ${f.snippet || f.rule}\n`);
    }
  }
  if (overflowed.length > 0) {
    process.stdout.write(`\n[mobile-responsive] pages overflowing at ${opts.width}px:\n`);
    for (const p of overflowed) {
      const top = p.offenders?.find((o) => o.self) ?? p.offenders?.[0];
      const hint = top ? ` — culprit <${top.tag}> class="${top.cls}"` : '';
      process.stdout.write(`  ${p.url} (+${p.overflow}px)${hint}\n`);
    }
  }

  const failed = staticFail > 0 || overflowed.length > 0;
  process.exit(failed ? 1 : 0);
}

// Run as CLI only — importing this module (e.g. from the unit test) must not
// launch a browser, write reports, or call process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('mobile-responsive/check.ts')) {
  main().catch((err) => {
    process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
    process.exit(2);
  });
}

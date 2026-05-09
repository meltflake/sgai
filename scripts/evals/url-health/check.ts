// scripts/evals/url-health/check.ts
// ────────────────────────────────────────────────────────────────────────
// URL Health eval — full sweep of every sourceUrl/url field in src/data/*.ts.
//
// Why: per CLAUDE.md rule #6, sourceUrl HEAD-check only runs once at
// `voices/prospect-stubs.mjs apply` time. Anything written before that
// rule existed, or any URL that decays after merge (404s eventually),
// goes uncaught. This eval runs the same validateUrls() over the entire
// corpus on a weekly cron and opens an issue when anything breaks.
//
// Usage:
//   npx tsx scripts/evals/url-health/check.ts             # full scan
//   npx tsx scripts/evals/url-health/check.ts --file=src/data/people.ts
//   npx tsx scripts/evals/url-health/check.ts --changed-only   # only PR-touched files
//   npx tsx scripts/evals/url-health/check.ts --dry-run        # parse only, no HTTP
//   npx tsx scripts/evals/url-health/check.ts --concurrency=12
//
// Exit codes:
//   0 — all reachable (or only soft-warns)
//   1 — at least one hard failure (404 / 5xx / DNS / timeout)
//   2 — invocation error

import * as ts from 'typescript';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

import { validateUrls, isReachable, type UrlCheckEntry, type UrlCheckResult } from '../../lib/url-check.ts';

// ── Config ──────────────────────────────────────────────────────────────

const URL_FIELD_NAMES = new Set(['sourceUrl', 'url', 'href']);
const HTTP_RE = /^https?:\/\//i;
const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const DATA_DIR = join(REPO_ROOT, 'src', 'data');
const REPORT_DIR = join(import.meta.dirname, 'reports');

// ── CLI ─────────────────────────────────────────────────────────────────

interface CliOptions {
  file?: string;
  changedOnly: boolean;
  dryRun: boolean;
  concurrency: number;
  timeoutMs: number;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { changedOnly: false, dryRun: false, concurrency: 6, timeoutMs: 10000 };
  for (const a of argv) {
    if (a === '--changed-only') opts.changedOnly = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--file=')) opts.file = a.slice('--file='.length);
    else if (a.startsWith('--concurrency=')) opts.concurrency = Number(a.slice('--concurrency='.length));
    else if (a.startsWith('--timeout=')) opts.timeoutMs = Number(a.slice('--timeout='.length));
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:url [--file=<path>] [--changed-only] [--dry-run] [--concurrency=N] [--timeout=MS]\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

// ── File discovery ──────────────────────────────────────────────────────

function listDataFiles(): string[] {
  const out: string[] = [];
  for (const name of readdirSync(DATA_DIR)) {
    if (name.endsWith('.ts')) out.push(join(DATA_DIR, name));
  }
  return out;
}

function listChangedDataFiles(): string[] {
  try {
    const base = process.env.GITHUB_BASE_REF || 'main';
    const out = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`, '--', 'src/data/'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    return out
      .split('\n')
      .filter((l: string) => l.endsWith('.ts'))
      .map((l: string) => join(REPO_ROOT, l));
  } catch {
    return listDataFiles();
  }
}

// ── AST extraction ──────────────────────────────────────────────────────

interface FoundUrl extends UrlCheckEntry {
  file: string;
  line: number;
  recordId?: string;
}

function extractUrls(filePath: string): FoundUrl[] {
  const source = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const out: FoundUrl[] = [];
  const relPath = relative(REPO_ROOT, filePath);

  function readString(init: ts.Expression): string | undefined {
    if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) return init.text;
    return undefined;
  }

  function nearestRecordId(node: ts.Node): string | undefined {
    let cur: ts.Node | undefined = node;
    while (cur) {
      if (ts.isObjectLiteralExpression(cur)) {
        for (const prop of cur.properties) {
          if (!ts.isPropertyAssignment(prop)) continue;
          const name = prop.name;
          const key =
            ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)
              ? (name as ts.Identifier | ts.StringLiteral).text
              : undefined;
          if (key === 'id' || key === 'slug' || key === 'name') {
            const v = readString(prop.initializer);
            if (v) return v;
          }
        }
      }
      cur = cur.parent;
    }
    return undefined;
  }

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node)) {
      const name = node.name;
      const key =
        ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)
          ? (name as ts.Identifier | ts.StringLiteral).text
          : undefined;
      if (key && URL_FIELD_NAMES.has(key)) {
        const v = readString(node.initializer);
        if (v && HTTP_RE.test(v)) {
          const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
          out.push({
            url: v,
            file: relPath,
            line,
            context: `${relPath}:${line}`,
            recordId: nearestRecordId(node.parent),
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return out;
}

// ── Reporting ───────────────────────────────────────────────────────────

interface Report {
  generatedAt: string;
  totals: { scanned: number; broken: number; warn: number; files: number };
  byFile: Record<string, number>;
  broken: Array<UrlCheckResult & { file: string; line: number; recordId?: string; severity: 'fail' | 'warn' | 'ok' }>;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

/** Domains that aggressively bot-block. Public profile / company pages
 *  on these hosts are always real but routinely return 400 / 404 / 999
 *  to non-JS, non-cookied requests. Treat their 4xx as soft-warn — the
 *  human reviewer can spot-check, but a cron run shouldn't fail the
 *  build over LinkedIn returning 404 to a HEAD request. */
const BOT_WALLED_HOSTS = [
  'linkedin.com',
  'facebook.com',
  'instagram.com',
  'x.com',
  'twitter.com',
];

function isBotWalledHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return BOT_WALLED_HOSTS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

function classify(status: number | string, url: string): 'fail' | 'warn' | 'ok' {
  if (isReachable(status)) {
    if (typeof status === 'number' && (status === 401 || status === 403 || status === 429 || status === 999)) {
      return 'warn';
    }
    return 'ok';
  }
  // Bot-wall hosts: 4xx is almost always anti-scraping, not a missing page.
  if (typeof status === 'number' && status >= 400 && status < 500 && isBotWalledHost(url)) {
    return 'warn';
  }
  return 'fail';
}

function writeReport(report: Report): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const lines: string[] = [];
  lines.push(`# URL Health Report — ${stamp}`);
  lines.push('');
  lines.push(`- Scanned: ${report.totals.scanned} URLs across ${report.totals.files} files`);
  lines.push(`- Broken (FAIL): ${report.totals.broken}`);
  lines.push(`- Soft-warn (401/403/429): ${report.totals.warn}`);
  lines.push('');
  if (report.broken.length === 0) {
    lines.push('All URLs reachable.');
  } else {
    const byFile = new Map<string, typeof report.broken>();
    for (const b of report.broken) {
      const arr = byFile.get(b.file) ?? [];
      arr.push(b);
      byFile.set(b.file, arr);
    }
    for (const [file, items] of byFile) {
      lines.push(`## ${file}`);
      lines.push('');
      for (const it of items) {
        const tag = it.severity === 'fail' ? 'FAIL' : 'WARN';
        const id = it.recordId ? ` (\`${it.recordId}\`)` : '';
        lines.push(`- **${tag}** L${it.line}${id} → \`${it.url}\` — status \`${it.status}\``);
      }
      lines.push('');
    }
  }
  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseCli(process.argv.slice(2));

  const files = opts.file
    ? [resolve(opts.file)]
    : opts.changedOnly
      ? listChangedDataFiles()
      : listDataFiles();

  if (files.length === 0) {
    process.stdout.write('No data files to scan.\n');
    process.exit(0);
  }

  const all: FoundUrl[] = [];
  for (const f of files) {
    if (!existsSync(f)) continue;
    all.push(...extractUrls(f));
  }

  const dedup = new Map<string, FoundUrl>();
  for (const u of all) {
    if (!dedup.has(u.url)) dedup.set(u.url, u);
  }
  const unique = [...dedup.values()];

  process.stdout.write(`Scanning ${unique.length} unique URLs from ${files.length} files…\n`);

  if (opts.dryRun) {
    for (const u of unique.slice(0, 20)) process.stdout.write(`  ${u.context} → ${u.url}\n`);
    if (unique.length > 20) process.stdout.write(`  … +${unique.length - 20} more\n`);
    process.exit(0);
  }

  const broken = await validateUrls(
    unique.map((u) => ({ url: u.url, context: u.context })),
    { concurrency: opts.concurrency, timeoutMs: opts.timeoutMs },
  );

  const annotated = broken.map((b) => {
    const meta = dedup.get(b.url);
    return {
      ...b,
      file: meta?.file ?? '?',
      line: meta?.line ?? 0,
      recordId: meta?.recordId,
      severity: classify(b.status, b.url),
    };
  });

  const failCount = annotated.filter((a) => a.severity === 'fail').length;
  const warnCount = annotated.filter((a) => a.severity === 'warn').length;

  const report: Report = {
    generatedAt: new Date().toISOString(),
    totals: {
      scanned: unique.length,
      broken: failCount,
      warn: warnCount,
      files: files.length,
    },
    byFile: annotated.reduce<Record<string, number>>((acc, a) => {
      acc[a.file] = (acc[a.file] ?? 0) + 1;
      return acc;
    }, {}),
    broken: annotated,
  };

  const { jsonPath, mdPath } = writeReport(report);
  process.stdout.write(`\nReport: ${relative(REPO_ROOT, mdPath)}\n`);
  process.stdout.write(`        ${relative(REPO_ROOT, jsonPath)}\n\n`);

  if (failCount === 0) {
    process.stdout.write(`All ${unique.length} URLs reachable.\n`);
    process.exit(0);
  }

  process.stdout.write(`${failCount} broken URL(s):\n`);
  for (const a of annotated.filter((x) => x.severity === 'fail').slice(0, 20)) {
    process.stdout.write(`  ${a.file}:${a.line} — ${a.url} (${a.status})\n`);
  }
  if (failCount > 20) process.stdout.write(`  … +${failCount - 20} more (see report)\n`);
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});

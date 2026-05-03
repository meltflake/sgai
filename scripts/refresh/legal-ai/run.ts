// scripts/refresh/legal-ai/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh Singapore AI legal framework. Monitors:
//   - sso.agc.gov.sg (Statutes Online — versioned legislation)
//   - mas.gov.sg / pdpc.gov.sg / judiciary.gov.sg (regulatory sub-statutes)
//
// Output: appends candidate items to a `_pendingReview` "Auto-discovered"
// section at the BOTTOM of legal-ai.ts, so Luca can review in the PR and
// move them into the correct `legalSections[]` slot during merge.
//
// Half-yearly cadence; expected to surface 0-2 items per run.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { govFetch, listSitemap } from '../../lib/gov-fetch.ts';
import { summarizePage } from '../../lib/ai-summarize.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import { loadState, saveState } from '../../lib/state.ts';

const TARGET_FILE = resolve('src/data/legal-ai.ts');
const CACHE_DIR = resolve('scripts/refresh/legal-ai/data/summaries');

const SOURCES = [
  {
    domain: 'sso.agc.gov.sg',
    sitemapUrl: 'https://sso.agc.gov.sg/sitemap.xml',
    urlFilter: /(act|bill|amendment|copyright|protection|data|safety|elections|criminal-harms)/i,
  },
  {
    domain: 'mas.gov.sg',
    sitemapUrl: 'https://www.mas.gov.sg/sitemap.xml',
    urlFilter: /(notice|guideline|circular|regulation|ai|model-risk)/i,
  },
  {
    domain: 'pdpc.gov.sg',
    sitemapUrl: 'https://www.pdpc.gov.sg/sitemap.xml',
    urlFilter: /(advisory|guideline|decision|consultation|ai|generative)/i,
  },
];

const SCOPE_LABELS = ['training', 'output', 'liability', 'governance'] as const;
const STATUS_LABELS = ['已生效', '已颁布', '咨询中', '提案'] as const;

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 3,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
  };
}

function readExistingUrls(): Set<string> {
  const src = readFileSync(TARGET_FILE, 'utf8');
  const urls = new Set<string>();
  for (const m of src.matchAll(/(?:sourceUrl|authorityUrl):\s*\n?\s*['"]([^'"]+)['"]/g)) {
    urls.add(m[1]);
  }
  return urls;
}

function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

function escapeBacktick(s: string): string {
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function formatLegalItem(item: {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  sourceUrl: string;
  authority: string;
  authorityEn: string;
  scope: string;
  status: string;
  publishedDate: string | null;
}): string {
  const today = new Date().toISOString().slice(0, 10);
  const dateStr = item.publishedDate?.slice(0, 7) || today.slice(0, 7);
  const lines: string[] = [];
  lines.push('      {');
  lines.push(`        title: '${escapeQuote(item.title)}',`);
  lines.push(`        titleEn: '${escapeQuote(item.titleEn)}',`);
  lines.push(`        date: '${dateStr}',`);
  lines.push(`        authority: '${escapeQuote(item.authority)}',`);
  lines.push(`        authorityEn: '${escapeQuote(item.authorityEn)}',`);
  lines.push(`        scope: '${item.scope}',`);
  lines.push(`        status: '${item.status}',`);
  lines.push(`        summary: '${escapeQuote(item.description)}',`);
  lines.push(`        summaryEn: '${escapeQuote(item.descriptionEn)}',`);
  lines.push('        body: `' + escapeBacktick(item.description) + '`,');
  lines.push('        bodyEn: `' + escapeBacktick(item.descriptionEn) + '`,');
  lines.push(`        sourceUrl: '${item.sourceUrl}',`);
  lines.push('      },');
  return lines.join('\n');
}

function findAutoDiscoveredSection(lines: string[]): { sectionStart: number; itemsCloseLine: number } | null {
  for (let i = 0; i < lines.length; i += 1) {
    if (/title:\s*['"]Auto-discovered \(pending review\)['"]/.test(lines[i])) {
      // Find items: [ then matching ]
      let itemsOpen = -1;
      for (let j = i; j < Math.min(lines.length, i + 30); j += 1) {
        if (/^\s*items:\s*\[/.test(lines[j])) {
          itemsOpen = j;
          break;
        }
      }
      if (itemsOpen === -1) return null;
      let depth = 0;
      for (let j = itemsOpen; j < lines.length; j += 1) {
        depth += (lines[j].match(/\[/g) || []).length;
        depth -= (lines[j].match(/\]/g) || []).length;
        if (depth === 0 && j > itemsOpen) return { sectionStart: i, itemsCloseLine: j };
      }
    }
  }
  return null;
}

function appendAutoDiscoveredSection(lines: string[], formattedItems: string): string[] {
  // Find `legalSections: [` array close.
  let arrayOpen = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^export const legalSections:\s*LegalSection\[\]\s*=\s*\[/.test(lines[i])) {
      arrayOpen = i;
      break;
    }
  }
  if (arrayOpen === -1) throw new Error('legalSections array not found in legal-ai.ts');
  let depth = 0;
  let arrayClose = -1;
  for (let i = arrayOpen; i < lines.length; i += 1) {
    depth += (lines[i].match(/\[/g) || []).length;
    depth -= (lines[i].match(/\]/g) || []).length;
    if (depth === 0 && i > arrayOpen) {
      arrayClose = i;
      break;
    }
  }
  if (arrayClose === -1) throw new Error('legalSections close ] not found');

  const newSection = [
    '  {',
    "    title: 'Auto-discovered (pending review)',",
    "    titleEn: 'Auto-discovered (pending review)',",
    "    philosophy: '由 refresh 管线自动发现的法律 / 监管条目，需 Luca 审核后移入正式分组。',",
    "    philosophyEn: 'Items auto-discovered by the refresh pipeline. Luca to review and move into the right section before merge.',",
    '    items: [',
    formattedItems,
    '    ],',
    '  },',
  ].join('\n');

  return [...lines.slice(0, arrayClose), newSection, ...lines.slice(arrayClose)];
}

async function scanAll(existingUrls: Set<string>, limit: number): Promise<string[]> {
  const found = new Set<string>();
  for (const source of SOURCES) {
    try {
      const urls = await listSitemap(source.sitemapUrl);
      for (const url of urls) {
        if (existingUrls.has(url)) continue;
        if (!source.urlFilter.test(url)) continue;
        found.add(url);
        if (found.size >= limit * 4) break; // rough early exit
      }
    } catch {
      /* skip */
    }
    if (found.size >= limit * 4) break;
  }
  return [...found].slice(0, limit);
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[legal-ai-refresh] starting\n');
  if (!existsSync(TARGET_FILE)) throw new Error(`Target not found: ${TARGET_FILE}`);

  const existingUrls = readExistingUrls();
  process.stdout.write(`  existing legal-ai URLs: ${existingUrls.size}\n`);

  const candidates = await scanAll(existingUrls, flags.limit);
  process.stdout.write(`  candidates: ${candidates.length}\n`);
  for (const u of candidates) process.stdout.write(`    ${u}\n`);

  if (candidates.length === 0 || flags.dryRun) {
    if (flags.dryRun) process.stdout.write('\n[legal-ai-refresh] dry-run done.\n');
    saveState(loadState());
    return;
  }

  const enriched: Array<{ url: string; item: ReturnType<typeof formatLegalItem> extends string ? Parameters<typeof formatLegalItem>[0] : never; confidence: 'high' | 'medium' | 'low' }> = [];
  const failures: Array<{ url: string; error: string }> = [];

  for (const url of candidates) {
    try {
      const page = await govFetch(url, { retries: 2, sleepBetweenMs: 1000 });
      const summary = await summarizePage(
        { sourceUrl: page.sourceUrl, title: page.title, contentText: page.contentText },
        {
          categories: SCOPE_LABELS as unknown as string[],
          cacheDir: CACHE_DIR,
          force: flags.force,
          domainContext:
            'Singapore AI legal framework. Classify each piece of legislation/guidance into one of: training (training-side IP/copyright), output (output-side regulation), liability, governance. Pick "training" for IP/copyright/data-use; "output" for safety/harms/election integrity; "liability" for civil/criminal liability; "governance" for general AI governance frameworks.',
        }
      );

      const status = STATUS_LABELS[summary.confidence === 'high' ? 0 : 3]; // simplistic mapping
      enriched.push({
        url,
        item: {
          title: summary.title,
          titleEn: summary.titleEn,
          description: summary.description,
          descriptionEn: summary.descriptionEn,
          sourceUrl: url,
          authority: 'Auto: 待审核',
          authorityEn: 'Auto: pending review',
          scope: summary.category,
          status,
          publishedDate: summary.publishedDate,
        },
        confidence: summary.confidence,
      });
    } catch (error) {
      failures.push({ url, error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (enriched.length === 0) {
    process.stdout.write('\n[legal-ai-refresh] no enriched items.\n');
    return;
  }

  // Emit: insert into Auto-discovered section, creating it if absent.
  const original = readFileSync(TARGET_FILE, 'utf8');
  let lines = original.split('\n');

  const formattedItems = enriched.map((e) => formatLegalItem(e.item)).join('\n');
  const auto = findAutoDiscoveredSection(lines);
  if (auto) {
    lines = [...lines.slice(0, auto.itemsCloseLine), formattedItems, ...lines.slice(auto.itemsCloseLine)];
  } else {
    lines = appendAutoDiscoveredSection(lines, formattedItems);
  }

  writeFileSync(TARGET_FILE, lines.join('\n'));
  const issues = findUnpairedFields(TARGET_FILE, { fields: ['title', 'description', 'summary'] });
  if (issues.length > 0) {
    writeFileSync(TARGET_FILE, original);
    throw new Error(`i18n pairing failed: ${issues.length} unpaired. Rolled back.`);
  }
  process.stdout.write(`  added ${enriched.length} items to Auto-discovered section\n`);

  if (flags.noCommit) return;

  const commit = autoCommit({
    domain: 'legal-ai',
    files: [TARGET_FILE],
    message: `data(legal-ai): refresh +${enriched.length} items (auto-discovered)`,
    allowDirtyPaths: ['scripts/refresh/legal-ai/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}, sha: ${commit.sha}\n`);

  if (!flags.noPush) {
    const body = buildPRBody({
      domain: 'legal-ai',
      diffStat: commit.diffStat,
      newEntries: enriched.map((e) => ({
        title: `${e.item.titleEn} (${e.item.scope})`,
        sourceUrl: e.url,
        confidence: e.confidence,
      })),
      failedSources: failures,
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] legal-ai: +${enriched.length} items (pending review)`,
      body: body + '\n\n> Items live in the "Auto-discovered (pending review)" section at the bottom. Move them to the correct `legalSections[]` slot during review.',
      labels: ['data-refresh', 'legal-ai', 'pending-review'],
    });
    if (prResult.error) process.stdout.write(`  ⚠ PR error: ${prResult.error}\n`);
    if (prResult.pr) process.stdout.write(`  PR: ${prResult.pr.url}\n`);
  }

  saveState(loadState());
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write(JSON.stringify({
    domain: 'legal-ai',
    added: enriched.length,
    failures: failures.length,
    elapsed_seconds: elapsed,
  }) + '\n');
}

await main();

// scripts/refresh/levers/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh national AI levers. Monitors imda / synapxe / tech.gov.sg /
// edb.gov.sg announcements for new programmes / funds / data centre deals
// that fit one of the 6 levers (基建 / 资金 / 人才 / 标准 / 政府自用 / 外交).
//
// Output: appends candidate items to a special "auto-discovered" group
// inside lever 1 (Infrastructure) by default. Luca moves them to the
// correct lever during PR review — same pattern as legal-ai.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { govFetch, listSitemap } from '../../lib/gov-fetch.ts';
import { summarizePage } from '../../lib/ai-summarize.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import { loadState, saveState } from '../../lib/state.ts';

const TARGET_FILE = resolve('src/data/levers.ts');
const CACHE_DIR = resolve('scripts/refresh/levers/data/summaries');

const SOURCES = [
  { domain: 'imda.gov.sg', sitemapUrl: 'https://www.imda.gov.sg/sitemap.xml', urlFilter: /(programme|initiative|grant|fund|news)/i },
  { domain: 'tech.gov.sg', sitemapUrl: 'https://www.tech.gov.sg/sitemap.xml', urlFilter: /(media|product|launch|smart-nation|ai)/i },
  { domain: 'edb.gov.sg', sitemapUrl: 'https://www.edb.gov.sg/sitemap.xml', urlFilter: /(news|investment|programme|ai|data-centre)/i },
];

const LEVER_NAMES = ['基建', '资金', '人才', '标准', '政府自用', '外交'] as const;

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
  for (const m of src.matchAll(/sourceUrl:\s*\n?\s*['"]([^'"]+)['"]/g)) {
    urls.add(m[1]);
  }
  return urls;
}

function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

function formatLeverItem(item: {
  id: string;
  name: string;
  nameEn: string;
  ministry: string;
  ministryEn: string;
  description: string;
  descriptionEn: string;
  sourceUrl: string;
}): string {
  const lines: string[] = [];
  lines.push('          {');
  lines.push(`            id: '${item.id}',`);
  lines.push(`            name: '${escapeQuote(item.name)}',`);
  lines.push(`            nameEn: '${escapeQuote(item.nameEn)}',`);
  lines.push(`            ministry: '${escapeQuote(item.ministry)}',`);
  lines.push(`            ministryEn: '${escapeQuote(item.ministryEn)}',`);
  lines.push(`            description: '${escapeQuote(item.description)}',`);
  lines.push(`            descriptionEn: '${escapeQuote(item.descriptionEn)}',`);
  lines.push(`            sourceUrl: '${item.sourceUrl}',`);
  lines.push('          },');
  return lines.join('\n');
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
}

/**
 * Inject new items into a special "Auto-discovered (pending review)" group
 * inside the FIRST lever (基建). Creates the group if it doesn't yet exist.
 */
function injectIntoAutoDiscoveredGroup(lines: string[], formattedItems: string): string[] {
  // Find first lever's groups: [
  let leverNumberLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*number:\s*1,/.test(lines[i])) {
      leverNumberLine = i;
      break;
    }
  }
  if (leverNumberLine === -1) throw new Error('lever number 1 not found');

  let groupsOpen = -1;
  for (let i = leverNumberLine; i < lines.length; i += 1) {
    if (/^\s*groups:\s*\[/.test(lines[i])) {
      groupsOpen = i;
      break;
    }
  }
  if (groupsOpen === -1) throw new Error('groups: [ for lever 1 not found');

  // Look for existing auto-discovered group within lever 1.
  for (let i = groupsOpen; i < lines.length; i += 1) {
    if (/title:\s*['"]Auto-discovered \(pending review\)['"]/.test(lines[i])) {
      // Find items: [ for this group, then matching ]
      let itemsOpen = -1;
      for (let j = i; j < Math.min(lines.length, i + 30); j += 1) {
        if (/^\s*items:\s*\[/.test(lines[j])) {
          itemsOpen = j;
          break;
        }
      }
      if (itemsOpen === -1) break;
      let depth = 0;
      for (let j = itemsOpen; j < lines.length; j += 1) {
        depth += (lines[j].match(/\[/g) || []).length;
        depth -= (lines[j].match(/\]/g) || []).length;
        if (depth === 0 && j > itemsOpen) {
          return [...lines.slice(0, j), formattedItems, ...lines.slice(j)];
        }
      }
    }
    // Stop search at lever 2 boundary.
    if (/^\s*number:\s*2,/.test(lines[i])) break;
  }

  // Group doesn't exist — append new group at end of lever-1 groups array.
  let depth = 0;
  let groupsClose = -1;
  for (let i = groupsOpen; i < lines.length; i += 1) {
    depth += (lines[i].match(/\[/g) || []).length;
    depth -= (lines[i].match(/\]/g) || []).length;
    if (depth === 0 && i > groupsOpen) {
      groupsClose = i;
      break;
    }
  }
  if (groupsClose === -1) throw new Error('groups close ] not found');

  const newGroup = [
    '      {',
    "        title: 'Auto-discovered (pending review)',",
    "        titleEn: 'Auto-discovered (pending review)',",
    '        items: [',
    formattedItems,
    '        ],',
    '      },',
  ].join('\n');
  return [...lines.slice(0, groupsClose), newGroup, ...lines.slice(groupsClose)];
}

async function scanAll(existing: Set<string>, limit: number): Promise<string[]> {
  const found = new Set<string>();
  for (const source of SOURCES) {
    try {
      const urls = await listSitemap(source.sitemapUrl);
      for (const url of urls) {
        if (existing.has(url)) continue;
        if (!source.urlFilter.test(url)) continue;
        found.add(url);
        if (found.size >= limit * 4) break;
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

  process.stdout.write('\n[levers-refresh] starting\n');
  if (!existsSync(TARGET_FILE)) throw new Error(`Target not found: ${TARGET_FILE}`);

  const existingUrls = readExistingUrls();
  process.stdout.write(`  existing levers URLs: ${existingUrls.size}\n`);

  const candidates = await scanAll(existingUrls, flags.limit);
  process.stdout.write(`  candidates: ${candidates.length}\n`);
  for (const u of candidates) process.stdout.write(`    ${u}\n`);

  if (candidates.length === 0 || flags.dryRun) {
    if (flags.dryRun) process.stdout.write('\n[levers-refresh] dry-run done.\n');
    saveState(loadState());
    return;
  }

  const enriched: Array<{
    url: string;
    item: Parameters<typeof formatLeverItem>[0];
    confidence: 'high' | 'medium' | 'low';
  }> = [];
  const failures: Array<{ url: string; error: string }> = [];

  for (const url of candidates) {
    try {
      const page = await govFetch(url, { retries: 2, sleepBetweenMs: 1000 });
      const summary = await summarizePage(
        { sourceUrl: page.sourceUrl, title: page.title, contentText: page.contentText },
        {
          categories: LEVER_NAMES as unknown as string[],
          cacheDir: CACHE_DIR,
          force: flags.force,
          domainContext: 'Singapore national AI levers. Classify into one of 6 levers: 基建 (infrastructure), 资金 (funding), 人才 (talent), 标准 (standards), 政府自用 (government adoption), 外交 (diplomacy).',
        }
      );

      enriched.push({
        url,
        item: {
          id: slugify(summary.titleEn),
          name: summary.title,
          nameEn: summary.titleEn,
          ministry: 'Auto: 待审核',
          ministryEn: 'Auto: pending review',
          description: summary.description,
          descriptionEn: summary.descriptionEn,
          sourceUrl: url,
        },
        confidence: summary.confidence,
      });
    } catch (error) {
      failures.push({ url, error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (enriched.length === 0) {
    process.stdout.write('\n[levers-refresh] no enriched items.\n');
    return;
  }

  const original = readFileSync(TARGET_FILE, 'utf8');
  // Capture baseline unpaired count BEFORE we write, so we only fail on
  // newly-introduced issues (the file may have pre-existing baseline gaps
  // that aren't this pipeline's responsibility).
  const baselineCount = (() => {
    // findUnpairedFields needs a file path; the file we'll edit is `TARGET_FILE`
    // and its current contents == `original`, so we can just check it directly
    // before writeFileSync changes anything.
    return findUnpairedFields(TARGET_FILE, { fields: ['name', 'description', 'title'] }).length;
  })();
  const formattedItems = enriched.map((e) => formatLeverItem(e.item)).join('\n');
  let lines = original.split('\n');
  lines = injectIntoAutoDiscoveredGroup(lines, formattedItems);

  writeFileSync(TARGET_FILE, lines.join('\n'));
  const issuesAfter = findUnpairedFields(TARGET_FILE, { fields: ['name', 'description', 'title'] });
  if (issuesAfter.length > baselineCount) {
    writeFileSync(TARGET_FILE, original);
    throw new Error(
      `i18n pairing regressed: ${baselineCount} → ${issuesAfter.length} unpaired (introduced ${issuesAfter.length - baselineCount}). Rolled back.`
    );
  }
  process.stdout.write(`  added ${enriched.length} items to Auto-discovered group\n`);

  if (flags.noCommit) return;

  const commit = autoCommit({
    domain: 'levers',
    files: [TARGET_FILE],
    message: `data(levers): refresh +${enriched.length} items (auto-discovered)`,
    allowDirtyPaths: ['scripts/refresh/levers/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}, sha: ${commit.sha}\n`);

  if (!flags.noPush) {
    const body = buildPRBody({
      domain: 'levers',
      diffStat: commit.diffStat,
      newEntries: enriched.map((e) => ({
        title: `${e.item.nameEn}`,
        sourceUrl: e.url,
        confidence: e.confidence,
      })),
      failedSources: failures,
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] levers: +${enriched.length} items (pending review)`,
      body: body + '\n\n> Items added to lever 1\'s "Auto-discovered (pending review)" group. AI proposed a category — review and move to the right lever.',
      labels: ['data-refresh', 'levers', 'pending-review'],
    });
    if (prResult.error) process.stdout.write(`  ⚠ PR error: ${prResult.error}\n`);
    if (prResult.pr) process.stdout.write(`  PR: ${prResult.pr.url}\n`);
  }

  saveState(loadState());
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write(JSON.stringify({
    domain: 'levers',
    added: enriched.length,
    failures: failures.length,
    elapsed_seconds: elapsed,
  }) + '\n');
}

await main();

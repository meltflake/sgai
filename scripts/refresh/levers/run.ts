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
import { isEmptyShellSummary } from '../../lib/empty-shell.ts';
import { judgeAiRelevance } from '../../lib/judge-ai-relevance.ts';
import { isGenericOrLanding, normalizeUrl, selectCandidates } from '../../lib/scan-filters.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { formatWithPrettier } from '../../lib/prettier-format.ts';
import { ensureClaudeAuthed } from '../../lib/llm.ts';
import { loadState, saveState } from '../../lib/state.ts';
import { findLeverI18nIssues, formatLeverItem, injectIntoAutoDiscoveredGroup } from './emit.ts';

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

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
}

async function scanAll(existing: Set<string>, limit: number): Promise<string[]> {
  // Same shape as run-template's scanSources (issue #166 fixes): shared
  // generic-page filter, normalized dedupe keys, per-source cap +
  // round-robin instead of a first-source-wins early break.
  const existingKeys = new Set([...existing].map(normalizeUrl));
  const perSource: string[][] = [];
  for (const source of SOURCES) {
    const kept: string[] = [];
    const seenKeys = new Set<string>();
    try {
      const urls = await listSitemap(source.sitemapUrl);
      for (const url of urls) {
        const key = normalizeUrl(url);
        if (existing.has(url) || existingKeys.has(key)) continue;
        if (seenKeys.has(key)) continue;
        if (!source.urlFilter.test(url)) continue;
        if (isGenericOrLanding(url)) continue;
        seenKeys.add(key);
        kept.push(url);
        if (kept.length >= limit) break;
      }
    } catch {
      /* skip */
    }
    perSource.push(kept);
  }
  return selectCandidates(perSource, limit);
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[levers-refresh] starting\n');
  if (!existsSync(TARGET_FILE)) throw new Error(`Target not found: ${TARGET_FILE}`);

  // Preflight: prove `claude -p` can run inference before per-candidate AI
  // work. `claude --version` still passes with an expired token; fail fast here
  // with one clear message. Skip for --dry-run (scan only, no LLM).
  if (!flags.dryRun) {
    ensureClaudeAuthed();
    process.stdout.write('  preflight: claude auth OK\n');
  }

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
    item: {
      id: string; name: string; nameEn: string; nameJa?: string; nameKo?: string;
      ministry: string; ministryEn: string; ministryJa?: string; ministryKo?: string;
      description: string; descriptionEn: string; descriptionJa?: string; descriptionKo?: string;
      sourceUrl: string;
    };
    confidence: 'high' | 'medium' | 'low';
  }> = [];
  const failures: Array<{ url: string; error: string }> = [];
  // govFetch is a plain HTTP fetch; client-rendered pages (several IMDA
  // programme pages) yield only a nav shell, and the summariser then
  // describes the emptiness. Drop those instead of committing garbage —
  // see lib/empty-shell.ts and the closed PR #64 (2026-06-19).
  const skipped: string[] = [];

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

      if (isEmptyShellSummary(summary)) {
        skipped.push(url);
        continue;
      }

      // Content-layer AI-relevance gate (issue #166: levers predated the
      // shared judge and admitted filmmaking grants / graduate programmes).
      // Same contract as run-template: drop only a high-confidence "no";
      // judge errors fail open into the pending-review section.
      const verdict = await judgeAiRelevance(
        { title: page.title, contentText: page.contentText, sourceUrl: url },
        {
          kind: 'a government programme / initiative / announcement page',
          scope:
            "Singapore's national AI levers — AI infrastructure, AI funding programmes, AI talent schemes, AI standards, government AI adoption, or AI diplomacy",
        }
      );
      if (!verdict.relevant && verdict.confidence === 'high') {
        skipped.push(url);
        continue;
      }

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

  if (skipped.length > 0) {
    process.stdout.write(`  skipped ${skipped.length} empty-shell candidate(s) (govFetch got only a JS/nav shell):\n`);
    for (const u of skipped) process.stdout.write(`    ${u}\n`);
  }

  if (enriched.length === 0) {
    process.stdout.write('\n[levers-refresh] no enriched items.\n');
    return;
  }

  // Translate to ja + ko.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const flat = enriched.flatMap((e) => [e.item.name, e.item.description, e.item.ministry]);
    const [jaValues, koValues] = await Promise.all([
      translateBatch(flat, { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }),
      translateBatch(flat, { direction: 'zh→ko', cacheDir: 'scripts/i18n/data/ko-cache' }),
    ]);
    for (let i = 0; i < enriched.length; i++) {
      enriched[i].item.nameJa = jaValues[i * 3] || undefined;
      enriched[i].item.descriptionJa = jaValues[i * 3 + 1] || undefined;
      enriched[i].item.ministryJa = jaValues[i * 3 + 2] || undefined;
      enriched[i].item.nameKo = koValues[i * 3] || undefined;
      enriched[i].item.descriptionKo = koValues[i * 3 + 1] || undefined;
      enriched[i].item.ministryKo = koValues[i * 3 + 2] || undefined;
    }
    process.stdout.write(`  translated ${enriched.length} entries to ja + ko\n`);
  } catch (e) {
    process.stdout.write(`  [warn] ja/ko translation failed: ${e instanceof Error ? e.message : e}\n`);
  }

  const original = readFileSync(TARGET_FILE, 'utf8');
  const formattedItems = enriched.map((e) => formatLeverItem(e.item)).join('\n');
  let lines = original.split('\n');
  lines = injectIntoAutoDiscoveredGroup(lines, formattedItems);

  writeFileSync(TARGET_FILE, lines.join('\n'));
  const issuesAfter = findLeverI18nIssues(TARGET_FILE);
  if (issuesAfter.alignment.length > 0 || issuesAfter.completeness.length > 0) {
    writeFileSync(TARGET_FILE, original);
    throw new Error(
      `i18n validation failed: ${issuesAfter.alignment.length} alignment, ${issuesAfter.completeness.length} completeness issue(s). Rolled back.`
    );
  }
  formatWithPrettier(TARGET_FILE);
  process.stdout.write(`  added ${enriched.length} items to Auto-discovered group\n`);

  // Auto-discovered lever items go into a sub-group under Lever 1 (not
  // top-level Lever records) and don't get addedAt — they stay invisible
  // to the homepage feed until promoted to a real lever in PR review.

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

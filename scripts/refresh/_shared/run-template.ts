// scripts/refresh/_shared/run-template.ts
// ────────────────────────────────────────────────────────────────────────
// Reusable orchestrator for "scan → AI summary → append-auto-discovered →
// auto-PR" pipelines (talent / startups / benchmarking / tracker).
//
// Each domain provides:
//   - SOURCES: list of {sitemapUrl|feedUrl, urlFilter}
//   - CATEGORIES: closed-set classification labels for the AI summarizer
//   - DOMAIN: state key + branch label + target data file path
//
// The template handles: argv parsing, scan, enrich, emit, commit, push, PR.

import { resolve } from 'node:path';

import { govFetch, listSitemap } from '../../lib/gov-fetch.ts';
import { summarizePage } from '../../lib/ai-summarize.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { appendAutoDiscovered } from '../../lib/auto-discovered-emit.ts';
import { appendUpdate, type UpdateType } from '../../lib/append-update.ts';
import { loadState, saveState } from '../../lib/state.ts';

export interface PipelineSource {
  domain: string;
  feedUrl: string;
  feedType: 'rss' | 'sitemap';
  urlFilter: RegExp;
  urlExcludes?: RegExp[];
}

export interface PipelineConfig {
  domain: string;
  targetFile: string;
  cacheDir: string;
  branchLabel: string;
  domainContext: string;
  categories: readonly string[];
  sources: PipelineSource[];
  /** Default --limit if user didn't pass one. */
  defaultLimit?: number;
  /** Optional regex over already-stored sourceUrl literals; used for dedupe. */
  urlExtractRegex?: RegExp;
  /** UpdateType emitted to src/data/updates.ts after a successful run.
   *  Skipped if absent or if zero entries were appended. */
  updateType?: UpdateType;
  /** Customise the updates feed wording; falls back to a generic
   *  "+N <domain> entries" line. JA fields are required so the JA
   *  homepage feed does not fall back to Chinese. */
  updateLabels?: {
    title: string; // 中文
    titleJa: string;
    titleEn: string;
    summary: string;
    summaryJa: string;
    summaryEn: string;
    /** Listing page link, e.g. /startups/. Required for the link to render. */
    listingHref?: string;
    listingLabel?: string; // 中文
    listingLabelJa?: string;
    listingLabelEn?: string;
  };
}

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
}

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

function parseFlags(defaultLimit: number): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : defaultLimit,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
  };
}

async function readExistingUrls(targetFile: string, regex?: RegExp): Promise<Set<string>> {
  const fs = await import('node:fs');
  const src = fs.readFileSync(targetFile, 'utf8');
  const re = regex || /(?:url|sourceUrl):\s*\n?\s*['"]([^'"]+)['"]/g;
  const urls = new Set<string>();
  for (const m of src.matchAll(re)) urls.add(m[1]);
  return urls;
}

async function parseRss(feedUrl: string): Promise<Array<{ title: string; link: string; pubDate?: string }>> {
  try {
    const r = await fetch(feedUrl, {
      headers: { 'User-Agent': REAL_UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
    });
    if (!r.ok) return [];
    const xml = await r.text();
    if (xml.trim().toLowerCase().startsWith('<!doctype html') || xml.includes('<title>Just a moment')) return [];
    const out: Array<{ title: string; link: string; pubDate?: string }> = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1];
      const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      if (title && link) out.push({ title, link, pubDate });
    }
    return out;
  } catch {
    return [];
  }
}

async function scanSources(sources: PipelineSource[], existing: Set<string>, limit: number): Promise<string[]> {
  const found = new Set<string>();
  for (const s of sources) {
    try {
      const items =
        s.feedType === 'rss'
          ? (await parseRss(s.feedUrl)).map((i) => i.link)
          : await listSitemap(s.feedUrl);
      for (const url of items) {
        if (existing.has(url)) continue;
        if (!s.urlFilter.test(url)) continue;
        if (s.urlExcludes?.some((re) => re.test(url))) continue;
        found.add(url);
        if (found.size >= limit * 4) break;
      }
    } catch {
      /* skip source */
    }
    if (found.size >= limit * 4) break;
  }
  return [...found].slice(0, limit);
}

export async function runPipeline(config: PipelineConfig): Promise<void> {
  const flags = parseFlags(config.defaultLimit ?? 3);
  const startedAt = Date.now();
  const targetAbs = resolve(config.targetFile);

  process.stdout.write(`\n[${config.domain}-refresh] starting\n`);

  const existingUrls = await readExistingUrls(targetAbs, config.urlExtractRegex);
  process.stdout.write(`  existing ${config.domain} URLs: ${existingUrls.size}\n`);

  const candidates = await scanSources(config.sources, existingUrls, flags.limit);
  process.stdout.write(`  candidates: ${candidates.length}\n`);
  for (const u of candidates) process.stdout.write(`    ${u}\n`);

  if (candidates.length === 0 || flags.dryRun) {
    if (flags.dryRun) process.stdout.write(`\n[${config.domain}-refresh] dry-run done.\n`);
    saveState(loadState());
    return;
  }

  const enriched: Array<{ url: string; entry: import('../../lib/auto-discovered-emit.ts').AutoDiscoveredEntry }> = [];
  const failures: Array<{ url: string; error: string }> = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const url of candidates) {
    try {
      const page = await govFetch(url, { retries: 2, sleepBetweenMs: 800 });
      const summary = await summarizePage(
        { sourceUrl: page.sourceUrl, title: page.title, contentText: page.contentText },
        {
          categories: [...config.categories],
          cacheDir: config.cacheDir,
          force: flags.force,
          domainContext: config.domainContext,
        }
      );
      enriched.push({
        url,
        entry: {
          title: summary.title,
          titleEn: summary.titleEn,
          description: summary.description,
          descriptionEn: summary.descriptionEn,
          category: summary.category,
          confidence: summary.confidence,
          sourceUrl: url,
          discoveredAt: today,
          reasonForLowConfidence: summary.reasonForLowConfidence,
        },
      });
    } catch (error) {
      failures.push({ url, error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (enriched.length === 0) {
    process.stdout.write(`\n[${config.domain}-refresh] no enriched items.\n`);
    return;
  }

  // Translate title + description to ja for trilingual support.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const jaValues = await translateBatch(
      enriched.flatMap((e) => [e.entry.title, e.entry.description]),
      { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }
    );
    for (let i = 0; i < enriched.length; i++) {
      enriched[i].entry.titleJa = jaValues[i * 2] || undefined;
      enriched[i].entry.descriptionJa = jaValues[i * 2 + 1] || undefined;
    }
    process.stdout.write(`  translated ${enriched.length} entries to ja\n`);
  } catch (e) {
    process.stdout.write(`  [warn] ja translation failed: ${e instanceof Error ? e.message : e}\n`);
  }

  const result = appendAutoDiscovered(targetAbs, enriched.map((e) => e.entry));
  process.stdout.write(
    `  appended ${result.added} entries to autoDiscovered ${result.created ? '(new export)' : '(existing)'}\n`
  );

  // Surface a one-line update on src/data/updates.ts so the freshly
  // ingested entries appear on the homepage feed and /updates/ listing.
  // Best-effort: pipeline failures here must not block auto-PR.
  if (config.updateType && result.added > 0) {
    try {
      const labels = config.updateLabels;
      const fallbackTitle = `新增 ${result.added} 条 ${config.domain} 待审条目`;
      const fallbackTitleJa = `${config.domain}に${result.added}件の審査待ち項目を追加`;
      const fallbackTitleEn = `${result.added} new ${config.domain} entries (pending review)`;
      appendUpdate({
        date: today,
        type: config.updateType,
        title: labels?.title ?? fallbackTitle,
        titleJa: labels?.titleJa ?? fallbackTitleJa,
        titleEn: labels?.titleEn ?? fallbackTitleEn,
        summary: labels?.summary ?? `${config.domain} 自动发现管线本轮新增 ${result.added} 条，进入待审队列。`,
        summaryJa:
          labels?.summaryJa ??
          `${config.domain} 自動発見パイプラインで${result.added}件を追加し、審査待ちキューに登録しました。`,
        summaryEn:
          labels?.summaryEn ??
          `${config.domain} auto-discovery added ${result.added} entries to the pending-review queue.`,
        links: labels?.listingHref
          ? [
              {
                href: labels.listingHref,
                label: labels.listingLabel ?? labels.listingHref,
                labelJa: labels.listingLabelJa ?? labels.listingLabelEn ?? labels.listingLabel ?? labels.listingHref,
                labelEn: labels.listingLabelEn ?? labels.listingLabel ?? labels.listingHref,
              },
            ]
          : undefined,
      });
      process.stdout.write(`  appended updates feed entry (${config.updateType})\n`);
    } catch (err) {
      process.stdout.write(`  ⚠ updates feed append failed: ${err instanceof Error ? err.message : err}\n`);
    }
  }

  if (flags.noCommit) return;

  const commitFiles = [targetAbs];
  if (config.updateType && result.added > 0) {
    commitFiles.push(resolve('src/data/updates.ts'));
  }
  const commit = autoCommit({
    domain: config.domain,
    files: commitFiles,
    message: `data(${config.domain}): refresh +${result.added} auto-discovered entries`,
    allowDirtyPaths: [`scripts/refresh/${config.domain}/data/`],
  });
  process.stdout.write(`  branch: ${commit.branch}, sha: ${commit.sha}\n`);

  if (!flags.noPush) {
    const body = buildPRBody({
      domain: config.domain,
      diffStat: commit.diffStat,
      newEntries: enriched.map((e) => ({
        title: `${e.entry.titleEn} (${e.entry.category})`,
        sourceUrl: e.entry.sourceUrl,
        confidence: e.entry.confidence,
      })),
      failedSources: failures,
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] ${config.domain}: +${result.added} auto-discovered entries`,
      body:
        body +
        `\n\n> ${config.branchLabel}: 新条目都进 \`autoDiscovered\` 数组（pending review）。Luca 在 PR 决定挪到正式 array 还是删掉。`,
      labels: ['data-refresh', config.domain, 'pending-review'],
    });
    if (prResult.error) process.stdout.write(`  ⚠ PR error: ${prResult.error}\n`);
    if (prResult.pr) process.stdout.write(`  PR: ${prResult.pr.url}\n`);
  }

  saveState(loadState());
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write(
    JSON.stringify({
      domain: config.domain,
      added: result.added,
      failures: failures.length,
      branch: commit.branch,
      sha: commit.sha,
      elapsed_seconds: elapsed,
    }) + '\n'
  );
}

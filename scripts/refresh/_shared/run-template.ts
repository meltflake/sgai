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
import { isEmptyShellSummary } from '../../lib/empty-shell.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { appendAutoDiscovered } from '../../lib/auto-discovered-emit.ts';
import { judgeAiRelevance } from '../../lib/judge-ai-relevance.ts';
import { ensureClaudeAuthed } from '../../lib/llm.ts';
import { loadState, saveState } from '../../lib/state.ts';
import {
  extractYearFromUrl,
  isGenericOrLanding,
  normalizeUrl,
  selectCandidates,
} from '../../lib/scan-filters.ts';

export interface PipelineSource {
  domain: string;
  feedUrl: string;
  feedType: 'rss' | 'sitemap';
  urlFilter: RegExp;
  urlExcludes?: RegExp[];
  /** Skip URLs whose path carries a year token older than this. Fail-open:
   *  URLs with no year token are admitted. Use on archive-heavy sources
   *  (benchmarking's hai.stanford.edu kept resurfacing 2017-2024 AI Index
   *  editions — issue #166). */
  minUrlYear?: number;
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
  /** Content-layer AI-relevance gate. Default ON. The urlFilter only admits
   *  by document type and summarizePage only classifies + scores — neither
   *  asks "is this actually about AI?". This confirms it on the body. Set
   *  false for a source that is already 100% AI. */
  judgeAiRelevance?: boolean;
  /** Framing for the judge, e.g. "a news article", "a company / product page". */
  judgeKind?: string;
  /** Override what counts as on-topic for the judge. */
  judgeScope?: string;
  /** Optional second NECESSARY judge condition (e.g. a Singapore nexus).
   *  See JudgeAiOptions.requireScope. */
  judgeRequire?: string;
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
  // Normalized dedupe keys for the stored-URL set, so `?page=N` / trailing
  // slash / fragment variants of an already-stored URL don't re-candidate.
  const existingKeys = new Set([...existing].map(normalizeUrl));
  const perSource: string[][] = [];
  for (const s of sources) {
    const kept: string[] = [];
    const seenKeys = new Set<string>();
    try {
      const items =
        s.feedType === 'rss'
          ? (await parseRss(s.feedUrl)).map((i) => i.link)
          : await listSitemap(s.feedUrl);
      for (const url of items) {
        const key = normalizeUrl(url);
        if (existing.has(url) || existingKeys.has(key)) continue;
        if (seenKeys.has(key)) continue;
        if (!s.urlFilter.test(url)) continue;
        if (s.urlExcludes?.some((re) => re.test(url))) continue;
        if (isGenericOrLanding(url)) continue;
        if (s.minUrlYear !== undefined) {
          const year = extractYearFromUrl(url);
          if (year !== undefined && year < s.minUrlYear) continue;
        }
        seenKeys.add(key);
        kept.push(url);
        // Per-source cap only — the old `limit * 4` break here let the
        // FIRST source starve every later one (issue #166).
        if (kept.length >= limit) break;
      }
    } catch {
      /* skip source */
    }
    perSource.push(kept);
  }
  return selectCandidates(perSource, limit);
}

export async function runPipeline(config: PipelineConfig): Promise<void> {
  const flags = parseFlags(config.defaultLimit ?? 3);
  const startedAt = Date.now();
  const targetAbs = resolve(config.targetFile);

  // Every exit path must end with one JSON report line: the dispatcher
  // (auto_update.py run_tsx_pipeline) parses the last JSON line of stdout.
  // Zero-result early returns used to skip it, and the run showed up as
  // "no JSON report from pipeline" — indistinguishable from a real failure
  // (2026-07-06 and 07-12 runs flagged 5 healthy pipelines as ⚠ failed).
  const printReport = (fields: Record<string, unknown>): void => {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    process.stdout.write(JSON.stringify({ domain: config.domain, elapsed_seconds: elapsed, ...fields }) + '\n');
  };

  process.stdout.write(`\n[${config.domain}-refresh] starting\n`);

  // Preflight: prove `claude -p` can run inference before per-candidate AI
  // summarisation / judging / translation. `claude --version` still passes with
  // an expired OAuth token — fail fast here with one clear message instead of N
  // truncated per-record errors. Skip for --dry-run (scan only, no LLM).
  if (!flags.dryRun) {
    ensureClaudeAuthed();
    process.stdout.write('  preflight: claude auth OK\n');
  }

  const existingUrls = await readExistingUrls(targetAbs, config.urlExtractRegex);
  process.stdout.write(`  existing ${config.domain} URLs: ${existingUrls.size}\n`);

  const candidates = await scanSources(config.sources, existingUrls, flags.limit);
  process.stdout.write(`  candidates: ${candidates.length}\n`);
  for (const u of candidates) process.stdout.write(`    ${u}\n`);

  if (candidates.length === 0 || flags.dryRun) {
    if (flags.dryRun) process.stdout.write(`\n[${config.domain}-refresh] dry-run done.\n`);
    saveState(loadState());
    printReport({ added: 0, failures: 0, reason: flags.dryRun ? 'dry-run' : 'no-candidates' });
    return;
  }

  const enriched: Array<{ url: string; entry: import('../../lib/auto-discovered-emit.ts').AutoDiscoveredEntry }> = [];
  const failures: Array<{ url: string; error: string }> = [];
  // govFetch is a plain HTTP fetch; client-rendered pages yield only a nav
  // shell, and the summariser then describes the emptiness. Drop those
  // instead of committing garbage — see lib/empty-shell.ts.
  const skipped: string[] = [];
  const offTopic: Array<{ url: string; reason: string }> = [];
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
      if (isEmptyShellSummary(summary)) {
        skipped.push(url);
        continue;
      }
      // Content-layer AI-relevance gate (shared). urlFilter admits by
      // document type only, and summarizePage classifies + scores but never
      // asks "is this actually AI?". Confirm the BODY concerns AI so we
      // don't collect off-topic pages. Conservative: drop only a
      // high-confidence "no"; low/medium stays and lands in _pendingReview
      // for the human backstop.
      if (config.judgeAiRelevance !== false) {
        const verdict = await judgeAiRelevance(
          { title: page.title, contentText: page.contentText, sourceUrl: url },
          { kind: config.judgeKind, scope: config.judgeScope, requireScope: config.judgeRequire }
        );
        if (!verdict.relevant && verdict.confidence === 'high') {
          offTopic.push({ url, reason: verdict.reason });
          continue;
        }
      }
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

  if (skipped.length > 0) {
    process.stdout.write(`  skipped ${skipped.length} empty-shell candidate(s) (govFetch got only a JS/nav shell):\n`);
    for (const u of skipped) process.stdout.write(`    ${u}\n`);
  }
  if (offTopic.length > 0) {
    process.stdout.write(`  dropped ${offTopic.length} off-topic candidate(s) (AI-relevance judge, high-confidence no):\n`);
    for (const o of offTopic) process.stdout.write(`    ${o.url} — ${o.reason.slice(0, 70)}\n`);
  }

  if (enriched.length === 0) {
    process.stdout.write(`\n[${config.domain}-refresh] no enriched items.\n`);
    printReport({
      added: 0,
      failures: failures.length,
      skipped_empty_shell: skipped.length,
      dropped_off_topic: offTopic.length,
      reason: 'no-enriched',
    });
    return;
  }

  // Translate title + description to ja + ko for multi-lingual support.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const flat = enriched.flatMap((e) => [e.entry.title, e.entry.description]);
    const [jaValues, koValues] = await Promise.all([
      translateBatch(flat, { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }),
      translateBatch(flat, { direction: 'zh→ko', cacheDir: 'scripts/i18n/data/ko-cache' }),
    ]);
    for (let i = 0; i < enriched.length; i++) {
      enriched[i].entry.titleJa = jaValues[i * 2] || undefined;
      enriched[i].entry.descriptionJa = jaValues[i * 2 + 1] || undefined;
      enriched[i].entry.titleKo = koValues[i * 2] || undefined;
      enriched[i].entry.descriptionKo = koValues[i * 2 + 1] || undefined;
    }
    process.stdout.write(`  translated ${enriched.length} entries to ja + ko\n`);
  } catch (e) {
    process.stdout.write(`  [warn] ja/ko translation failed: ${e instanceof Error ? e.message : e}\n`);
  }

  const result = appendAutoDiscovered(targetAbs, enriched.map((e) => e.entry));
  process.stdout.write(
    `  appended ${result.added} entries to autoDiscovered ${result.created ? '(new export)' : '(existing)'}\n`
  );

  // Auto-discovered entries don't get addedAt at emit time — they live in
  // the autoDiscovered side array (a different schema from canonical
  // records). The "最近更新" homepage feed only shows promoted records.
  // When a human moves an entry from autoDiscovered to the canonical array
  // in PR review, that's when they should set addedAt: today.

  if (flags.noCommit) {
    printReport({ added: result.added, failures: failures.length, reason: 'no-commit' });
    return;
  }

  const commitFiles = [targetAbs];
  const commit = autoCommit({
    domain: config.domain,
    files: commitFiles,
    message: `data(${config.domain}): refresh +${result.added} auto-discovered entries`,
    allowDirtyPaths: [`scripts/refresh/${config.domain}/data/`],
  });
  process.stdout.write(`  branch: ${commit.branch}, sha: ${commit.sha}\n`);

  let prUrl: string | undefined;
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
    if (prResult.pr) {
      process.stdout.write(`  PR: ${prResult.pr.url}\n`);
      prUrl = prResult.pr.url;
    }
  }

  saveState(loadState());
  // pr_url feeds the dispatcher's "PRs awaiting review" issue section —
  // it was missing here, so template pipelines' PRs (e.g. benchmarking
  // #133) never showed a review link in the summary issue.
  printReport({
    added: result.added,
    failures: failures.length,
    branch: commit.branch,
    sha: commit.sha,
    pr_url: prUrl,
  });
}

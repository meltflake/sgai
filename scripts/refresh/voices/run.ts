// scripts/refresh/voices/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for the MDDI voices refresh pipeline.
//
// Flow:
//   1. Read existing mddiSpeeches[].url + speechTranscripts keys (dedup set).
//   2. scan() → candidate URLs from MDDI sitemap, filtered to AI speeches.
//   3. fetch() → page <h1> + paragraphs[] per candidate.
//   4. translate() → zh paragraphs + bilingual (zh + en) 4-7 bullet tldr.
//   5. enrich() → trilingual title + event + speaker title (uses
//      lib/translate.ts en→zh + en→ja + scripts/refresh/voices/sources
//      SPEAKER_MAP).
//   6. emit() → splice new mddiSpeeches + speechTranscripts entries into
//      src/data/voices.ts + src/data/speech-transcripts.ts with i18n
//      baseline-vs-after rollback guard.
//   7. autoCommit() + pushAndOpenPR() → branch + commit + PR via gh.
//
// CLI flags:
//   --dry-run         Skip fetch/translate/emit/commit/push. Scan + report only.
//   --limit=N         Cap candidates (default 3 to keep PRs small).
//   --no-commit       Run scan + fetch + translate + emit; stop before commit.
//   --no-push         Run autoCommit but skip push + PR.
//   --force           Bypass translation cache (re-translate even when cached).

import { resolve } from 'node:path';

import { loadState, saveState } from '../../lib/state.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { translateBatch } from '../../lib/translate.ts';
import {
  scan,
  readExistingSpeechUrls,
  readExistingSpeechIds,
  type VoicesCandidate,
} from './scan.ts';
import { fetchSpeeches, type FetchedSpeech } from './fetch.ts';
import { translateSpeeches, type TranslatedSpeech } from './translate.ts';
import { combineForEmit, emit, type EmittableSpeech } from './emit.ts';
import { speakerFromSlug } from './sources.ts';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
}

const ZH_CACHE = resolve('scripts/i18n/data/zh-cache');
const JA_CACHE = resolve('scripts/i18n/data/ja-cache');

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

/** Extract event name from a speech titleEn. Patterns ported from
 *  scripts/voices/01_scan_mddi.py extract_event(). Returns '' when no
 *  reliable extraction is possible — caller falls back to the full title. */
function extractEventEn(titleEn: string): string {
  const patterns = [
    /(?:at|for)\s+(?:the\s+)?(.+?)(?:\s*$|\s*\|)/i,
    /(?:keynote|opening|closing)\s+(?:address|remarks|speech)\s+.*?at\s+(?:the\s+)?(.+?)(?:\s*$)/i,
  ];
  for (const p of patterns) {
    const m = titleEn.match(p);
    if (!m) continue;
    let event = m[1].trim();
    event = event.replace(/\s+on\s+\d{1,2}\s+\w+$/i, '').trim();
    event = event.replace(/\s*\d{4}\s*$/, '').trim();
    if (event.length > 5) return event;
  }
  return '';
}

function uniqueBy<T>(arr: T[], keyFn: (v: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const v of arr) {
    const k = keyFn(v);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

async function enrichTrilingual(
  fetched: FetchedSpeech[],
  translated: TranslatedSpeech[]
): Promise<EmittableSpeech[]> {
  // Pair fetched ↔ translated by speechId.
  const tMap = new Map(translated.map((t) => [t.speechId, t]));

  // Step 1: derive titleEn + eventEn + speaker. titleEn defaults to the
  // page <h1>; eventEn is regex-extracted; speaker comes from SPEAKER_MAP
  // (slug lookup) and the page <h1> fallback.
  const partials = fetched.map((f) => {
    const translatedSpeech = tMap.get(f.speechId);
    const titleEn = f.title || humaniseSlug(f.speechId);
    const eventEn = extractEventEn(titleEn) || titleEn;
    const speakerInfo = speakerFromSlug(f.speechId);
    return {
      fetched: f,
      translatedSpeech,
      titleEn,
      eventEn,
      speakerName: speakerInfo.name,
      speakerTitleEn: speakerInfo.titleEn,
      speakerTitleZh: speakerInfo.titleZh,
      speakerTitleJa: speakerInfo.titleJa,
    };
  });

  // Step 2: batch-translate titleEn/eventEn into zh + ja so we minimise
  // the number of LLM round-trips.
  const titles = partials.map((p) => p.titleEn);
  const events = partials.map((p) => p.eventEn);
  const speakerTitlesEn = partials.map((p) => p.speakerTitleEn);

  const [titlesZh, titlesJa, eventsZh, eventsJa, speakerTitlesZh, speakerTitlesJa] =
    await Promise.all([
      translateBatch(titles, { direction: 'en→zh', cacheDir: ZH_CACHE }),
      translateBatch(titles, { direction: 'en→ja', cacheDir: JA_CACHE }),
      translateBatch(events, { direction: 'en→zh', cacheDir: ZH_CACHE }),
      translateBatch(events, { direction: 'en→ja', cacheDir: JA_CACHE }),
      // Speaker title: only translate empty (SPEAKER_MAP miss) values to
      // avoid clobbering the canonical map. Empty strings still get
      // translated by callers downstream — we'll skip empty entries.
      translateBatch(
        speakerTitlesEn.map((s) => s || 'Speaker'),
        { direction: 'en→zh', cacheDir: ZH_CACHE }
      ),
      translateBatch(
        speakerTitlesEn.map((s) => s || 'Speaker'),
        { direction: 'en→ja', cacheDir: JA_CACHE }
      ),
    ]);

  const out: EmittableSpeech[] = [];
  for (let i = 0; i < partials.length; i += 1) {
    const p = partials[i];
    const t = p.translatedSpeech;
    if (!t) continue;
    const speakerTitleZh = p.speakerTitleZh || speakerTitlesZh[i];
    const speakerTitleJa = p.speakerTitleJa || speakerTitlesJa[i];
    out.push(
      combineForEmit(p.fetched, t, {
        titleZh: titlesZh[i],
        titleEn: p.titleEn,
        titleJa: titlesJa[i],
        eventEn: p.eventEn,
        eventZh: eventsZh[i],
        eventJa: eventsJa[i],
        speaker: p.speakerName,
        speakerTitleZh,
        speakerTitleEn: p.speakerTitleEn || speakerTitlesEn[i],
        speakerTitleJa,
      })
    );
  }
  return out;
}

function humaniseSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[voices-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan only\n');

  const existingUrls = readExistingSpeechUrls();
  const existingSpeechIds = readExistingSpeechIds();
  process.stdout.write(
    `  existing voices.ts urls=${existingUrls.size}, speech-transcripts.ts keys=${existingSpeechIds.size}\n`
  );

  const state = loadState();

  // 1. Scan.
  const scanResult = await scan({
    state,
    existingUrls,
    existingSpeechIds,
    dryRun: flags.dryRun,
    limit: flags.limit,
  });

  process.stdout.write(
    `  scan: ${scanResult.candidates.length} candidates from ${scanResult.perSource.length} sources\n`
  );
  for (const s of scanResult.perSource) {
    const errMark = s.error ? ` ! ${s.error.slice(0, 80)}` : '';
    process.stdout.write(`    ${s.domain}: ${s.matched}/${s.checked}${errMark}\n`);
  }

  if (scanResult.candidates.length === 0) {
    process.stdout.write('\n[voices-refresh] no new candidates. exiting.\n');
    saveState(state);
    return;
  }

  process.stdout.write('\n  Candidates:\n');
  for (const c of scanResult.candidates.slice(0, 10)) {
    process.stdout.write(`    [${c.domain}] ${c.sourceUrl}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[voices-refresh] dry-run complete.\n');
    return;
  }

  // 2. Fetch each candidate's page (paragraphs + <h1>).
  process.stdout.write('\n  Fetching...\n');
  const fetchResult = await fetchSpeeches(
    scanResult.candidates.map((c: VoicesCandidate) => ({
      speechId: c.speechId,
      sourceUrl: c.sourceUrl,
    }))
  );
  process.stdout.write(
    `  fetched: ${fetchResult.successes.length}, failures: ${fetchResult.failures.length}\n`
  );
  for (const f of fetchResult.failures) {
    process.stdout.write(`    ! ${f.speechId}: ${f.error.slice(0, 80)}\n`);
  }

  if (fetchResult.successes.length === 0) {
    process.stdout.write('\n[voices-refresh] no successful fetches. exiting.\n');
    return;
  }

  // 3. Translate paragraphs + tldr.
  process.stdout.write('\n  Translating...\n');
  const translateResult = await translateSpeeches(fetchResult.successes, {
    force: flags.force,
  });
  process.stdout.write(
    `  translated: ${translateResult.translated.length}, failures: ${translateResult.failures.length}\n`
  );
  for (const f of translateResult.failures) {
    process.stdout.write(`    ! ${f.speechId}: ${f.error.slice(0, 80)}\n`);
  }

  // 4. Enrich → trilingual title + event + speaker title.
  process.stdout.write('\n  Enriching trilingual fields...\n');
  const enriched = await enrichTrilingual(
    fetchResult.successes.filter((f) =>
      translateResult.translated.some((t) => t.speechId === f.speechId)
    ),
    translateResult.translated
  );
  process.stdout.write(`  enriched: ${enriched.length}\n`);

  // 5. Dedup safety: a parallel run might race; emit one per speechId.
  const unique = uniqueBy(enriched, (e) => e.speechId);

  if (unique.length === 0) {
    process.stdout.write('\n[voices-refresh] nothing to emit. exiting.\n');
    return;
  }

  // 6. Emit (with i18n rollback guard).
  process.stdout.write('\n  Emitting...\n');
  const emitResult = emit(unique);
  process.stdout.write(
    `  added ${emitResult.recordsAdded} records, skipped ${emitResult.skipped.length}\n`
  );
  for (const s of emitResult.skipped) {
    process.stdout.write(`    skipped ${s.speechId}: ${s.reason}\n`);
  }

  if (emitResult.recordsAdded === 0) {
    process.stdout.write('\n[voices-refresh] nothing emitted. exiting.\n');
    return;
  }

  // 7. Commit.
  if (flags.noCommit) {
    process.stdout.write('\n[voices-refresh] --no-commit: stopping after emit.\n');
    return;
  }
  process.stdout.write('\n  Committing...\n');
  const commit = autoCommit({
    domain: 'voices',
    files: [resolve('src/data/voices.ts'), resolve('src/data/speech-transcripts.ts')],
    message: `data(voices): refresh +${emitResult.recordsAdded} MDDI speeches`,
    allowDirtyPaths: ['scripts/refresh/voices/data/', 'scripts/i18n/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}\n`);
  process.stdout.write(`  sha: ${commit.sha}\n`);

  // 8. Push + PR.
  let prUrl = '';
  let prNumber = 0;
  if (!flags.noPush) {
    process.stdout.write('\n  Pushing + opening PR...\n');
    const body = buildPRBody({
      domain: 'voices',
      diffStat: commit.diffStat,
      newEntries: unique.map((s) => ({
        title: `${s.titleEn} (${s.speaker || 'speaker unknown'})`,
        sourceUrl: s.sourceUrl,
        confidence: 'high',
      })),
      failedSources: [
        ...fetchResult.failures.map((f) => ({ url: f.sourceUrl, error: f.error })),
        ...translateResult.failures.map((f) => ({
          url: f.speechId,
          error: f.error,
        })),
      ],
      checksPassed: [
        'i18n-pair (post-emit rollback guard on voices.ts + speech-transcripts.ts)',
      ],
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] voices: +${emitResult.recordsAdded} MDDI speeches`,
      body,
      labels: ['data-refresh', 'voices'],
    });
    if (prResult.error) {
      process.stdout.write(`  ! PR step error: ${prResult.error}\n`);
    } else if (prResult.pr) {
      prUrl = prResult.pr.url;
      prNumber = prResult.pr.number;
      process.stdout.write(`  PR: ${prUrl}\n`);
    }
  }

  saveState(state);

  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write('\n[voices-refresh] DONE\n');
  process.stdout.write(
    JSON.stringify({
      domain: 'voices',
      added: emitResult.recordsAdded,
      failures: fetchResult.failures.length + translateResult.failures.length,
      branch: commit.branch,
      sha: commit.sha,
      pr_url: prUrl || null,
      pr_number: prNumber || null,
      elapsed_seconds: elapsed,
    }) + '\n'
  );
}

await main();

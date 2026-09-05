// scripts/refresh/voices/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for the ministry voices refresh pipeline (MDDI + MAS + PMO).
//
// Flow:
//   1. Read existing mddiSpeeches[].url + speechTranscripts keys (dedup set).
//   2. scan() → candidate URLs from source sitemaps, filtered to AI speeches.
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
import { autoCommit, pushAndOpenPR, buildPRBody, hasUncommittedChanges } from '../../lib/auto-commit.ts';
import { translateBatch } from '../../lib/translate.ts';
import { callLlmJson, ensureClaudeAuthed } from '../../lib/llm.ts';
import {
  scan,
  readExistingSpeechUrls,
  readExistingSpeechIds,
  type VoicesCandidate,
} from './scan.ts';
import { fetchSpeeches, type FetchedSpeech } from './fetch.ts';
import { judgeAiRelevance } from './judge.ts';
import { loadRejectedIds, saveRejectedIds } from './rejected-cache.ts';
import { translateSpeeches, type TranslatedSpeech } from './translate.ts';
import { combineForEmit, emit, type EmittableSpeech } from './emit.ts';
import { speakerFromSlug } from './sources.ts';

/** Intake floor for ALL sources: no historical backfill — only speeches
 *  published on/after this date are archived. Originally MDDI was
 *  exempt (founding source, archive hand-completed), but the 2026-08
 *  dialogue/fireside slug widening let a 2017 MDDI dialogue page
 *  through on 2026-08-17 — empty speaker, zero strategic value, and a
 *  wasted LLM judge call. The 149-record MDDI archive predates the
 *  floor and is untouched; the floor only gates NEW intake. */
const SPEECH_DATE_FLOOR = '2026-01-01';

// Rule #9 (CLAUDE.md): full-speech paragraph batches regularly exceed the
// default 120s claude CLI timeout — the 2026-08-03 MAS e2e timed out 9
// batches in a row and lost the run. Default to 300s unless the caller
// already set an override (lib/llm.ts reads the env at call time).
if (!process.env.SGAI_LLM_TIMEOUT_MS) process.env.SGAI_LLM_TIMEOUT_MS = '300000';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
  /** Explicit speechId slugs to process (backfill / retry / smoke). When
   *  set, the scan-stage limit is bypassed and only these are processed. */
  ids: string[];
}

const ZH_CACHE = resolve('scripts/i18n/data/zh-cache');
const JA_CACHE = resolve('scripts/i18n/data/ja-cache');
const KO_CACHE = resolve('scripts/i18n/data/ko-cache');

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  const idsArg = argv.find((a) => a.startsWith('--ids='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 3,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
    ids: idsArg
      ? idsArg
          .split('=')[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
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

/** LLM fallback speaker extraction for SPEAKER_MAP misses: pull
 *  {name, roleEn} from the title + opening paragraphs. Replaces the old
 *  'Speaker' placeholder path whenever the page itself names the
 *  speaker (salutation blocks and PMO/MAS titles almost always do).
 *  Null on failure/uncertainty — caller keeps the placeholder. */
async function guessSpeaker(f: FetchedSpeech): Promise<{ name: string; roleEn: string } | null> {
  try {
    const res = await callLlmJson<{ name?: string; roleEn?: string }>(
      `This is a Singapore government speech page. Identify the PERSON DELIVERING the speech and their role/title.\n\nTitle: ${f.title}\n\nOpening paragraphs:\n${f.paragraphs.slice(0, 3).join('\n')}\n\nReturn STRICT JSON {"name": "Full Name", "roleEn": "English role title"}. If the deliverer cannot be determined with confidence, return {"name": "", "roleEn": ""}.`,
      { systemPrompt: 'You extract structured facts. Output strict JSON only.', model: 'haiku' }
    );
    const name = (res.name ?? '').trim();
    const roleEn = (res.roleEn ?? '').trim();
    if (!name || !roleEn) return null;
    return { name, roleEn };
  } catch {
    return null;
  }
}

async function enrichTrilingual(
  fetched: FetchedSpeech[],
  translated: TranslatedSpeech[]
): Promise<EmittableSpeech[]> {
  // Pair fetched ↔ translated by speechId.
  const tMap = new Map(translated.map((t) => [t.speechId, t]));

  // Step 1: derive titleEn + eventEn + speaker. titleEn defaults to the
  // page <h1>; eventEn is regex-extracted; speaker comes from SPEAKER_MAP
  // (slug lookup), then an LLM read of the page itself, then the fixed
  // placeholder.
  const partials = [] as Array<{
    fetched: FetchedSpeech;
    translatedSpeech: TranslatedSpeech | undefined;
    titleEn: string;
    eventEn: string;
    speakerName: string;
    speakerTitleEn: string;
    speakerTitleZh: string;
    speakerTitleJa: string;
    speakerTitleKo: string;
    /** Set when the LLM supplied roleEn — zh/ja/ko siblings are batch-
     *  translated below instead of using the placeholder titles. */
    llmRoleEn?: string;
  }>;
  for (const f of fetched) {
    const translatedSpeech = tMap.get(f.speechId);
    const titleEn = f.title || humaniseSlug(f.speechId);
    const eventEn = extractEventEn(titleEn) || titleEn;
    let speakerInfo = speakerFromSlug(f.speechId);
    let llmRoleEn: string | undefined;
    if (!speakerInfo.name) {
      const guess = await guessSpeaker(f);
      if (guess) {
        speakerInfo = { name: guess.name, titleZh: '', titleEn: guess.roleEn, titleJa: '', titleKo: '' };
        llmRoleEn = guess.roleEn;
        process.stdout.write(`    speaker via LLM: ${f.speechId} → ${guess.name} (${guess.roleEn})\n`);
      }
    }
    partials.push({
      fetched: f,
      translatedSpeech,
      titleEn,
      eventEn,
      speakerName: speakerInfo.name,
      speakerTitleEn: speakerInfo.titleEn,
      speakerTitleZh: speakerInfo.titleZh,
      speakerTitleJa: speakerInfo.titleJa,
      speakerTitleKo: speakerInfo.titleKo,
      llmRoleEn,
    });
  }

  // Step 2: batch-translate titleEn/eventEn into zh + ja so we minimise
  // the number of LLM round-trips. SpeakerTitle is intentionally NOT
  // batch-translated: on a SPEAKER_MAP miss we fall back to a fixed
  // trilingual placeholder so emit's i18n-pair guard never sees an
  // empty *En sibling on a CJK-containing speakerTitle. Translating
  // the literal "Speaker" via haiku surfaced parliament-speaker
  // context ("议长") which was both wrong and tripped the pairing
  // check whenever the *En fallback collapsed to '' upstream.
  const titles = partials.map((p) => p.titleEn);
  const events = partials.map((p) => p.eventEn);
  // LLM-extracted speaker roles (SPEAKER_MAP misses) get real zh/ja/ko
  // siblings via the same batch-translate path — dedup'd, empties out.
  const llmRoles = [...new Set(partials.map((p) => p.llmRoleEn).filter((r): r is string => !!r))];

  const [titlesZh, titlesJa, titlesKo, eventsZh, eventsJa, eventsKo, rolesZh, rolesJa, rolesKo] =
    await Promise.all([
      translateBatch(titles, { direction: 'en→zh', cacheDir: ZH_CACHE }),
      translateBatch(titles, { direction: 'en→ja', cacheDir: JA_CACHE }),
      translateBatch(titles, { direction: 'en→ko', cacheDir: KO_CACHE }),
      translateBatch(events, { direction: 'en→zh', cacheDir: ZH_CACHE }),
      translateBatch(events, { direction: 'en→ja', cacheDir: JA_CACHE }),
      translateBatch(events, { direction: 'en→ko', cacheDir: KO_CACHE }),
      translateBatch(llmRoles, { direction: 'en→zh', cacheDir: ZH_CACHE }),
      translateBatch(llmRoles, { direction: 'en→ja', cacheDir: JA_CACHE }),
      translateBatch(llmRoles, { direction: 'en→ko', cacheDir: KO_CACHE }),
    ]);
  const roleZhMap = new Map(llmRoles.map((r, i) => [r, rolesZh[i]]));
  const roleJaMap = new Map(llmRoles.map((r, i) => [r, rolesJa[i]]));
  const roleKoMap = new Map(llmRoles.map((r, i) => [r, rolesKo[i]]));

  const out: EmittableSpeech[] = [];
  for (let i = 0; i < partials.length; i += 1) {
    const p = partials[i];
    const t = p.translatedSpeech;
    if (!t) continue;
    const speakerTitleEn = p.speakerTitleEn || 'Speaker';
    const speakerTitleZh =
      p.speakerTitleZh || (p.llmRoleEn && roleZhMap.get(p.llmRoleEn)) || '演讲者';
    const speakerTitleJa =
      p.speakerTitleJa || (p.llmRoleEn && roleJaMap.get(p.llmRoleEn)) || '講演者';
    const speakerTitleKo =
      p.speakerTitleKo || (p.llmRoleEn && roleKoMap.get(p.llmRoleEn)) || '연사';
    out.push(
      combineForEmit(p.fetched, t, {
        titleZh: titlesZh[i],
        titleEn: p.titleEn,
        titleJa: titlesJa[i],
        titleKo: titlesKo[i],
        eventEn: p.eventEn,
        eventZh: eventsZh[i],
        eventJa: eventsJa[i],
        eventKo: eventsKo[i],
        speaker: p.speakerName,
        speakerTitleZh,
        speakerTitleEn,
        speakerTitleJa,
        speakerTitleKo,
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

/**
 * Commit (and PR) the reject ledger on its own.
 *
 * The ledger is written to disk as soon as a speech is judged pre-floor or
 * non-AI, but the only autoCommit() call rides on a successful emit — so on a
 * run where every candidate is rejected (the common case: 2026-09-04 and
 * 2026-09-05 both), the decisions stayed uncommitted forever. Every later run
 * then re-judged the same speeches (wasted LLM calls) and a fresh checkout had
 * no memory of them. The PR is also the documented veto path: a wrong drop is
 * undone by deleting its line in review.
 */
async function commitRejectLedgerOnly(rejectCount: number, flags: CliFlags): Promise<void> {
  const ledger = resolve('scripts/refresh/voices/data/rejected-ids.json');
  if (rejectCount === 0 || flags.noCommit) return;
  if (!hasUncommittedChanges([ledger])) return;

  process.stdout.write('\n  Committing reject decisions (nothing emitted this run)...\n');
  const commit = autoCommit({
    domain: 'voices',
    files: [ledger],
    message: `chore(voices): record ${rejectCount} reject decision(s)`,
    allowDirtyPaths: ['scripts/refresh/voices/data/', 'scripts/i18n/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}\n  sha: ${commit.sha}\n`);
  if (flags.noPush) return;

  const prResult = await pushAndOpenPR({
    branch: commit.branch,
    title: `[data-refresh] voices: ${rejectCount} reject decision(s)`,
    body: [
      '## Summary',
      `- Domain: \`voices\``,
      '- New speeches: **0** — every candidate was dropped (pre-floor date or non-AI).',
      '',
      'This PR records the drop decisions so later runs skip those speeches instead of',
      're-judging them. To veto a wrong drop, delete its line here before merging; the',
      'next run re-examines that speech.',
      '',
      '```',
      commit.diffStat,
      '```',
    ].join('\n'),
  });
  if (prResult.pr) process.stdout.write(`  PR: ${prResult.pr.url}\n`);
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[voices-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan only\n');

  // Preflight: prove `claude -p` can actually run inference before burning any
  // fetch + per-record work. `claude --version` still exits 0 with an expired
  // OAuth token; the 401 only bites at the first real call and then shows up as
  // N cryptic per-record failures. Skip for --dry-run (scan only, no LLM).
  if (!flags.dryRun) {
    ensureClaudeAuthed();
    process.stdout.write('  preflight: claude auth OK\n');
  }

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
    limit: flags.ids.length ? undefined : flags.limit,
  });

  process.stdout.write(
    `  scan: ${scanResult.candidates.length} candidates from ${scanResult.perSource.length} sources\n`
  );
  for (const s of scanResult.perSource) {
    const errMark = s.error ? ` ! ${s.error.slice(0, 80)}` : '';
    process.stdout.write(`    ${s.domain}: ${s.matched}/${s.checked}${errMark}\n`);
  }

  // Optional explicit batch selection (backfill / retry / smoke). Without
  // --ids, scan already applied --limit internally.
  let candidates = scanResult.candidates;
  if (flags.ids.length) {
    const want = new Set(flags.ids);
    candidates = scanResult.candidates.filter((c) => want.has(c.speechId));
    process.stdout.write(
      `  --ids filter: ${candidates.length}/${scanResult.candidates.length} matched (${flags.ids.length} requested)\n`
    );
    for (const id of flags.ids) {
      if (!candidates.some((c) => c.speechId === id)) {
        process.stdout.write(
          `    ! requested id not in scan (already archived or not a speech): ${id}\n`
        );
      }
    }
  }

  if (candidates.length === 0) {
    process.stdout.write('\n[voices-refresh] no candidates to process. exiting.\n');
    saveState(state);
    return;
  }

  process.stdout.write('\n  Candidates:\n');
  for (const c of candidates.slice(0, 10)) {
    process.stdout.write(`    [${c.domain}] ${c.sourceUrl}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[voices-refresh] dry-run complete.\n');
    return;
  }

  // 2. Fetch each candidate's page (paragraphs + <h1>).
  process.stdout.write('\n  Fetching...\n');
  const fetchResult = await fetchSpeeches(
    candidates.map((c: VoicesCandidate) => ({
      speechId: c.speechId,
      sourceUrl: c.sourceUrl,
    }))
  );
  process.stdout.write(
    `  fetched: ${fetchResult.successes.length}, failures: ${fetchResult.failures.length}\n`
  );
  for (const f of fetchResult.failures) {
    process.stdout.write(`    ! ${f.speechId}: ${f.error}\n`);
  }

  if (fetchResult.successes.length === 0) {
    process.stdout.write('\n[voices-refresh] no successful fetches. exiting.\n');
    return;
  }

  // 2a. Date floor (all sources): no historical backfill. Rejects are
  // cached so they never eat --limit slots again. A missing date is
  // fail-open (kept, not cached) — a parser regression must not
  // silently poison the cache.
  const rejected = loadRejectedIds();
  const today = new Date().toISOString().slice(0, 10);
  const inWindow: FetchedSpeech[] = [];
  let droppedPreFloor = 0;
  for (const f of fetchResult.successes) {
    if (f.publishedDate && f.publishedDate < SPEECH_DATE_FLOOR) {
      droppedPreFloor += 1;
      rejected[f.speechId] = { reason: 'pre-floor', date: f.publishedDate, decidedAt: today };
      process.stdout.write(`    ⊘ pre-floor (${f.publishedDate}): ${f.speechId}\n`);
      continue;
    }
    if (!f.publishedDate) {
      process.stdout.write(`    ! no date extracted (kept, fail-open): ${f.speechId}\n`);
    }
    inWindow.push(f);
  }
  if (droppedPreFloor > 0) {
    process.stdout.write(`  date floor: dropped ${droppedPreFloor} pre-${SPEECH_DATE_FLOOR}\n`);
  }

  // 2b. AI-relevance gate. Fast-pass candidates (slug already names AI) are
  // trusted; the rest are judged on their fetched body. This is the fix for
  // slug-only dropping — e.g. "asia-economic-summit" is about AI sovereignty
  // but its slug has no AI keyword.
  process.stdout.write('\n  Judging AI relevance (non-fast-pass only)...\n');
  const aiSlugMap = new Map(candidates.map((c) => [c.speechId, c.aiSlugMatch]));
  // --ids is an explicit operator selection (backfill / judge-veto): the
  // named speeches skip the content judge. This is the deterministic
  // promote path after deleting a wrong 'non-ai' line from
  // rejected-ids.json in PR review.
  const trustedIds = new Set(flags.ids);
  const aiRelevant: FetchedSpeech[] = [];
  let droppedNonAi = 0;
  for (const f of inWindow) {
    if (aiSlugMap.get(f.speechId) || trustedIds.has(f.speechId)) {
      aiRelevant.push(f);
      continue;
    }
    const verdict = await judgeAiRelevance(f);
    if (verdict.relevant) {
      aiRelevant.push(f);
      process.stdout.write(`    ✓ AI: ${f.speechId} (${verdict.confidence})\n`);
    } else {
      droppedNonAi += 1;
      rejected[f.speechId] = {
        reason: 'non-ai',
        decidedAt: today,
        note: verdict.reason.slice(0, 120),
      };
      process.stdout.write(`    ⊘ non-AI: ${f.speechId} — ${verdict.reason.slice(0, 70)}\n`);
    }
  }
  process.stdout.write(`  AI gate: kept ${aiRelevant.length}, dropped ${droppedNonAi} non-AI\n`);

  // Persist reject decisions (pre-floor + non-ai) so future scans skip them.
  if (droppedPreFloor + droppedNonAi > 0) {
    saveRejectedIds(rejected);
    process.stdout.write(
      `  reject cache: +${droppedPreFloor + droppedNonAi} (${Object.keys(rejected).length} total)\n`
    );
  }

  if (aiRelevant.length === 0) {
    process.stdout.write('\n[voices-refresh] no AI-relevant speeches. exiting.\n');
    await commitRejectLedgerOnly(droppedPreFloor + droppedNonAi, flags);
    return;
  }

  // 3. Translate paragraphs + tldr.
  process.stdout.write('\n  Translating...\n');
  const translateResult = await translateSpeeches(aiRelevant, {
    force: flags.force,
  });
  process.stdout.write(
    `  translated: ${translateResult.translated.length}, failures: ${translateResult.failures.length}\n`
  );
  for (const f of translateResult.failures) {
    process.stdout.write(`    ! ${f.speechId}: ${f.error}\n`);
  }

  // 4. Enrich → trilingual title + event + speaker title.
  process.stdout.write('\n  Enriching trilingual fields...\n');
  const enriched = await enrichTrilingual(
    aiRelevant.filter((f) => translateResult.translated.some((t) => t.speechId === f.speechId)),
    translateResult.translated
  );
  process.stdout.write(`  enriched: ${enriched.length}\n`);

  // 5. Dedup safety: a parallel run might race; emit one per speechId.
  const unique = uniqueBy(enriched, (e) => e.speechId);

  if (unique.length === 0) {
    process.stdout.write('\n[voices-refresh] nothing to emit. exiting.\n');
    await commitRejectLedgerOnly(droppedPreFloor + droppedNonAi, flags);
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
    await commitRejectLedgerOnly(droppedPreFloor + droppedNonAi, flags);
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
    files: [
      resolve('src/data/voices.ts'),
      resolve('src/data/speech-transcripts.ts'),
      // Reject decisions ride along so every weekly PR shows what was
      // dropped (pre-floor / non-ai) — a wrong drop is vetoed by deleting
      // its line in PR review (the next run re-examines it).
      resolve('scripts/refresh/voices/data/rejected-ids.json'),
    ],
    message: `data(voices): refresh +${emitResult.recordsAdded} ministry speeches`,
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
      title: `[data-refresh] voices: +${emitResult.recordsAdded} ministry speeches`,
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

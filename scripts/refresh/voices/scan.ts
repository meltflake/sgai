// scripts/refresh/voices/scan.ts
// ────────────────────────────────────────────────────────────────────────
// Discover new ministry AI-speech URLs from source sitemaps (MDDI + MAS
// + PMO — see sources.ts for per-source shapes).
//
// Dedupe against THREE existing sources:
//   1. mddiSpeeches[].url in src/data/voices.ts (already-known metadata)
//   2. Existing keys in src/data/speech-transcripts.ts (already-archived
//      transcripts; their URL was derived from the speechId slug). This
//      protects against the case where a row exists in voices.ts but the
//      transcript was added separately, and vice versa.
//   3. rejected-ids.json (pre-floor / non-ai decisions from earlier runs)
//      — without it, rejected candidates would eat the --limit slots on
//      every run and the pipeline would stall (see rejected-cache.ts).

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { listSitemap } from '../../lib/gov-fetch.ts';
import { type ScanState, getDomainState, setDomainState } from '../../lib/state.ts';
import { loadRejectedIds } from './rejected-cache.ts';
import {
  VOICES_SOURCES,
  isAiSpeechUrlForSource,
  isSpeechUrlForSource,
  speechIdForSource,
  type SpeechMinistry,
  type VoicesSource,
} from './sources.ts';

export interface VoicesCandidate {
  sourceUrl: string;
  /** idPrefix + slug (bare slug for MDDI). Used as speech id key. */
  speechId: string;
  domain: string;
  label: string;
  ministry: SpeechMinistry;
  /** true when the slug itself names AI (fast-pass, high confidence).
   *  false → admitted as a speech but AI relevance must be confirmed by
   *  a content-level judgement downstream (run.ts judgeAiRelevance). */
  aiSlugMatch: boolean;
}

export interface ScanResult {
  candidates: VoicesCandidate[];
  perSource: Array<{ domain: string; checked: number; matched: number; error?: string }>;
}

export interface ScanOptions {
  state: ScanState;
  /** URL set extracted from voices.ts mddiSpeeches[].url. */
  existingUrls: Set<string>;
  /** Speech id set extracted from speech-transcripts.ts keys. */
  existingSpeechIds: Set<string>;
  dryRun?: boolean;
  limit?: number;
}

async function scanSource(
  source: VoicesSource,
  opts: { existingUrls: Set<string>; existingSpeechIds: Set<string>; rejectedIds: Set<string> }
): Promise<{ found: VoicesCandidate[]; checked: number; error?: string }> {
  const found = new Map<string, VoicesCandidate>();
  let checked = 0;

  try {
    for (const sm of source.sitemapUrls) {
      const urls = await listSitemap(sm);
      checked += urls.length;
      for (const raw of urls) {
        if (source.urlExcludes?.some((re) => re.test(raw))) continue;
        if (!source.urlPatterns.some((re) => re.test(raw))) continue;
        // Admit ALL speeches (coarse per-source filter), not just slugs
        // that name AI. Relevance is judged on content downstream.
        // aiSlugMatch records whether the slug already names AI.
        if (!isSpeechUrlForSource(raw, source)) continue;
        const aiSlugMatch = isAiSpeechUrlForSource(raw, source);
        const speechId = speechIdForSource(raw, source);
        if (!speechId) continue;
        // Normalize trailing slash for dedupe parity with voices.ts entries.
        const normalized = raw.endsWith('/') ? raw : `${raw}/`;
        if (opts.existingUrls.has(normalized) || opts.existingUrls.has(raw)) continue;
        if (opts.existingSpeechIds.has(speechId)) continue;
        if (opts.rejectedIds.has(speechId)) continue;
        if (found.has(speechId)) continue;
        found.set(speechId, {
          sourceUrl: normalized,
          speechId,
          domain: source.domain,
          label: source.label,
          ministry: source.ministry,
          aiSlugMatch,
        });
      }
    }
    return { found: [...found.values()], checked };
  } catch (error) {
    return {
      found: [...found.values()],
      checked,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Round-robin interleave per-source candidate lists so a large backlog
 *  on one source (PMO: hundreds of historical pages awaiting the
 *  post-fetch date floor) can never starve the other sources out of the
 *  --limit slots. */
function interleave(perSource: VoicesCandidate[][]): VoicesCandidate[] {
  const out: VoicesCandidate[] = [];
  const maxLen = perSource.reduce((max, list) => Math.max(max, list.length), 0);
  for (let i = 0; i < maxLen; i += 1) {
    for (const list of perSource) {
      if (list[i] !== undefined) out.push(list[i]);
    }
  }
  return out;
}

export async function scan(options: ScanOptions): Promise<ScanResult> {
  // Voices state stores the URL set we've already considered. We still
  // dedupe against the actual data files (canonical), but stash any new
  // discoveries so a future run-with-state knows what's already on disk.
  void getDomainState(options.state, 'voices');

  const rejectedIds = new Set(Object.keys(loadRejectedIds()));
  const perSourceFound: VoicesCandidate[][] = [];
  const perSource: ScanResult['perSource'] = [];

  for (const source of VOICES_SOURCES) {
    const result = await scanSource(source, {
      existingUrls: options.existingUrls,
      existingSpeechIds: options.existingSpeechIds,
      rejectedIds,
    });
    perSource.push({
      domain: source.domain,
      checked: result.checked,
      matched: result.found.length,
      error: result.error,
    });
    perSourceFound.push(result.found);
  }

  const candidates = interleave(perSourceFound);

  // Persist seen-URLs for observational use (not required for dedupe).
  const seen = new Set<string>([
    ...options.existingUrls,
    ...candidates.map((c) => c.sourceUrl),
  ]);
  setDomainState(options.state, 'voices', { urls: [...seen] });

  if (options.limit) {
    candidates.length = Math.min(candidates.length, options.limit);
  }

  return { candidates, perSource };
}

/** Pull every mddiSpeeches[].url from src/data/voices.ts. Robust to
 *  field order — we read the file as text and regex the `url: '...'`
 *  literals inside the mddiSpeeches array block. */
export function readExistingSpeechUrls(filePath: string = resolve('src/data/voices.ts')): Set<string> {
  const source = readFileSync(filePath, 'utf8');
  const blockMatch = source.match(/export const mddiSpeeches[^[]*\[([\s\S]*?)^\];/m);
  if (!blockMatch) return new Set();
  const block = blockMatch[1];
  const urls = new Set<string>();
  for (const m of block.matchAll(/url:\s*['"]([^'"]+)['"]/g)) urls.add(m[1]);
  return urls;
}

/** Pull every speech-id key from src/data/speech-transcripts.ts. Used
 *  as a second dedupe layer in case a transcript was archived
 *  out-of-band. */
export function readExistingSpeechIds(
  filePath: string = resolve('src/data/speech-transcripts.ts')
): Set<string> {
  const source = readFileSync(filePath, 'utf8');
  const blockMatch = source.match(
    /export const speechTranscripts:[^=]*=\s*\{([\s\S]*?)\n\};/m
  );
  if (!blockMatch) return new Set();
  const block = blockMatch[1];
  const ids = new Set<string>();
  for (const m of block.matchAll(/^\s*['"]([a-z0-9-]+)['"]\s*:\s*\{/gm)) ids.add(m[1]);
  return ids;
}

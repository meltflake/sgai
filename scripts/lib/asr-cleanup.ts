// scripts/lib/asr-cleanup.ts
// ────────────────────────────────────────────────────────────────────────
// Strip runs of low-diversity short sentences from anywhere in an
// auto-generated transcript. YouTube ASR hallucinates a placeholder token
// ("Hey, hey, hey." / "Heat. Heat." / "yeah, yeah." …) whenever the audio
// is music / applause / ambient silence — typical for livestream recordings
// that capture a pre-event hype loop OR have inter-speaker transitions
// (music between sessions of an 8-hour conference). Without this pass, the
// junk segments are faithfully translated into zh / ja, polluting the
// readable transcript view.
//
// Conservative defaults: only strip when the run is long enough (≥ 5
// consecutive low-diversity sentences) and the total stripped fraction
// stays under `maxStripFraction`. Caller-facing API is sentence-list in /
// sentence-list out so it slots into the existing vttToParagraphs flow
// without re-doing sentence segmentation.

export interface AsrCleanupOptions {
  /** Minimum length of a junk run before it's eligible for stripping. */
  minRunLength?: number;
  /** A sentence is "low-diversity" if its normalized form has ≤ this many unique tokens. */
  maxUniqueTokens?: number;
  /** And every one of those unique tokens is ≤ this many characters long. */
  maxTokenLen?: number;
  /** Safety net: never strip more than this fraction of total sentences. */
  maxStripFraction?: number;
}

export interface AsrCleanupReport {
  removedFromStart: number;
  removedFromEnd: number;
  removedFromMiddle: number;
  totalSentencesIn: number;
  totalSentencesOut: number;
  stripped: boolean;
}

const DEFAULTS = {
  minRunLength: 5,
  maxUniqueTokens: 2,
  maxTokenLen: 6,
  // Only refuse the strip if essentially the entire transcript is junk —
  // we trust the diversity / run-length filters to avoid clipping real
  // content even on transcripts where junk dominates by volume.
  maxStripFraction: 0.95,
} as const;

function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function isLowDiversityShortSentence(sentence: string, maxUnique: number, maxLen: number): boolean {
  const tokens = tokenize(sentence);
  if (tokens.length === 0) return true;
  if (tokens.length > 15) return false;
  const unique = new Set(tokens);
  if (unique.size > maxUnique) return false;
  for (const t of unique) {
    if (t.length > maxLen) return false;
  }
  return true;
}

/**
 * Strip junk runs from start / end of a sentence list. Returns the kept
 * sentences. Use `analyzeAsrHallucinations` for the report-only variant.
 */
export function stripAsrHallucinations(sentences: string[], opts: AsrCleanupOptions = {}): string[] {
  const { kept } = stripAsrHallucinationsWithReport(sentences, opts);
  return kept;
}

export function stripAsrHallucinationsWithReport(
  sentences: string[],
  opts: AsrCleanupOptions = {}
): { kept: string[]; report: AsrCleanupReport } {
  const minRun = opts.minRunLength ?? DEFAULTS.minRunLength;
  const maxUnique = opts.maxUniqueTokens ?? DEFAULTS.maxUniqueTokens;
  const maxLen = opts.maxTokenLen ?? DEFAULTS.maxTokenLen;
  const maxFrac = opts.maxStripFraction ?? DEFAULTS.maxStripFraction;

  const total = sentences.length;
  if (total === 0) {
    return {
      kept: sentences,
      report: {
        removedFromStart: 0,
        removedFromEnd: 0,
        removedFromMiddle: 0,
        totalSentencesIn: 0,
        totalSentencesOut: 0,
        stripped: false,
      },
    };
  }

  // Walk the sentence list and tag each index as junk (true) or content
  // (false). A junk index is part of a low-diversity run whose length ≥
  // minRun. Single low-diversity sentences embedded in real content
  // (e.g., a one-word "Welcome.") are kept — only sustained runs are
  // ASR-style hallucinations.
  const isLowDiv = sentences.map((s) => isLowDiversityShortSentence(s, maxUnique, maxLen));
  const drop = new Array<boolean>(total).fill(false);
  let i = 0;
  while (i < total) {
    if (!isLowDiv[i]) {
      i += 1;
      continue;
    }
    // Start of a low-diversity run; find its extent.
    let j = i;
    while (j < total && isLowDiv[j]) j += 1;
    if (j - i >= minRun) {
      for (let k = i; k < j; k += 1) drop[k] = true;
    }
    i = j;
  }

  // Bucket where each dropped sentence falls (start / middle / end) for
  // reporting only. Drops at the leading and trailing edges count as
  // start / end runs; everything else is "middle".
  let leadingDrop = 0;
  while (leadingDrop < total && drop[leadingDrop]) leadingDrop += 1;
  let trailingDrop = 0;
  while (trailingDrop < total - leadingDrop && drop[total - 1 - trailingDrop]) trailingDrop += 1;
  const totalDropped = drop.filter(Boolean).length;
  const middleDrop = totalDropped - leadingDrop - trailingDrop;

  // Safety: refuse to gut the transcript even if most of it looks like junk.
  if (totalDropped / total > maxFrac) {
    return {
      kept: sentences,
      report: {
        removedFromStart: 0,
        removedFromEnd: 0,
        removedFromMiddle: 0,
        totalSentencesIn: total,
        totalSentencesOut: total,
        stripped: false,
      },
    };
  }

  if (totalDropped === 0) {
    return {
      kept: sentences,
      report: {
        removedFromStart: 0,
        removedFromEnd: 0,
        removedFromMiddle: 0,
        totalSentencesIn: total,
        totalSentencesOut: total,
        stripped: false,
      },
    };
  }

  const kept = sentences.filter((_, idx) => !drop[idx]);
  return {
    kept,
    report: {
      removedFromStart: leadingDrop,
      removedFromEnd: trailingDrop,
      removedFromMiddle: middleDrop,
      totalSentencesIn: total,
      totalSentencesOut: kept.length,
      stripped: true,
    },
  };
}

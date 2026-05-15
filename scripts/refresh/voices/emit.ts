// scripts/refresh/voices/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Insert new MDDI speech rows into two data files:
//
//   1. src/data/voices.ts → mddiSpeeches[] gets a new record per speech
//      (full trilingual fields: title/titleEn/titleJa, event/eventEn/eventJa,
//      speakerTitle/speakerTitleEn/speakerTitleJa, addedAt today).
//
//   2. src/data/speech-transcripts.ts → speechTranscripts map gets one
//      entry per speech (paragraphs zh + en, tldr zh + en, fetchedAt,
//      sourceUrl, source 'mddi-newsroom').
//
// Strategy: line-based insertion before the closing `];` / `};`. We do
// NOT regenerate the full map — existing entries (incl. Task A's NANA
// work) stay byte-identical. This is the same approach as
// policies/emit.ts.
//
// Anti-hallucination guards (CLAUDE.md rule #6 + rule #7):
//   - sourceUrl must be absolute http(s) and live under mddi.gov.sg.
//   - titleEn, title, titleJa must all be non-empty (i18n triple-sync rule).
//   - addedAt: today is set on every emitted mddiSpeeches record.
//
// Post-write i18n guard:
//   - findUnpairedFields baseline-vs-after on both files. Rollback only
//     on REGRESSION (existing baseline issues aren't this pipeline's
//     responsibility, mirroring policies/emit.ts).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import type { FetchedSpeech } from './fetch.ts';
import type { TranslatedSpeech } from './translate.ts';

const VOICES_FILE = resolve('src/data/voices.ts');
const TRANSCRIPTS_FILE = resolve('src/data/speech-transcripts.ts');

export interface EmittableSpeech {
  speechId: string;
  sourceUrl: string;
  pageTitle: string;
  publishedDate: string | null;
  paragraphsEn: string[];
  paragraphsZh: string[];
  tldrEn: string[];
  tldrZh: string[];
  titleZh: string;
  titleEn: string;
  titleJa: string;
  eventEn: string;
  eventZh: string;
  eventJa: string;
  speaker: string;
  speakerTitleEn: string;
  speakerTitleZh: string;
  speakerTitleJa: string;
  translatedAt: string;
  translationSource: 'claude' | 'manual';
  translationModel?: string;
}

export interface EmitResult {
  voicesFile: string;
  transcriptsFile: string;
  recordsAdded: number;
  skipped: Array<{ speechId: string; reason: string }>;
}

export function combineForEmit(
  fetched: FetchedSpeech,
  translated: TranslatedSpeech,
  enriched: {
    titleZh: string;
    titleEn: string;
    titleJa: string;
    eventEn: string;
    eventZh: string;
    eventJa: string;
    speaker: string;
    speakerTitleZh: string;
    speakerTitleEn: string;
    speakerTitleJa: string;
  }
): EmittableSpeech {
  return {
    speechId: fetched.speechId,
    sourceUrl: fetched.sourceUrl,
    pageTitle: fetched.title,
    publishedDate: fetched.publishedDate,
    paragraphsEn: translated.paragraphsEn,
    paragraphsZh: translated.paragraphs,
    tldrEn: translated.tldrEn,
    tldrZh: translated.tldr,
    titleZh: enriched.titleZh,
    titleEn: enriched.titleEn,
    titleJa: enriched.titleJa,
    eventEn: enriched.eventEn,
    eventZh: enriched.eventZh,
    eventJa: enriched.eventJa,
    speaker: enriched.speaker,
    speakerTitleEn: enriched.speakerTitleEn,
    speakerTitleZh: enriched.speakerTitleZh,
    speakerTitleJa: enriched.speakerTitleJa,
    translatedAt: translated.translatedAt,
    translationSource: translated.translationSource,
    translationModel: translated.translationModel,
  };
}

function escapeBacktick(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
function escapeQuote(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Strip irregular whitespace before serialising paragraphs into the TS
// data file: NBSP / zero-width / RTL marks would survive Prettier and
// trip ESLint's no-irregular-whitespace downstream. Built from \u
// escapes so this source file itself stays clean.
// Same set as scripts/voices/03_generate_ts.py.
const IRREGULAR_WS_CHARS =
  ' ' + // NBSP
  ' ' + // Ogham space mark
  '᠎' + // Mongolian vowel separator
  ' -​' + // en quad..zero-width space
  '‌-‏' + // ZWNJ / ZWJ / LRM / RLM
  ' ' + // narrow no-break space
  ' ' + // medium math space
  '⁠' + // word joiner
  '　' + // ideographic space
  '﻿'; // ZWNBSP / BOM
const IRREGULAR_WS_RE = new RegExp(`[${IRREGULAR_WS_CHARS}]`, 'g');

function cleanParagraph(s: string): string {
  return s.replace(IRREGULAR_WS_RE, ' ').replace(/[ \t]+/g, ' ').trim();
}

function tsArray(items: string[], indent: number): string {
  if (!items.length) return '[]';
  const pad = ' '.repeat(indent);
  const inner = items
    .map((s) => `${pad}  \`${escapeBacktick(s)}\``)
    .join(',\n');
  return `[\n${inner},\n${pad}]`;
}

function formatTranscriptEntry(s: EmittableSpeech): string {
  const paragraphsZh = s.paragraphsZh.map(cleanParagraph).filter(Boolean);
  const paragraphsEn = s.paragraphsEn.map(cleanParagraph).filter(Boolean);
  const tldrZh = s.tldrZh.map(cleanParagraph).filter(Boolean);
  const tldrEn = s.tldrEn.map(cleanParagraph).filter(Boolean);
  const fetchedAt = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push(`  '${escapeQuote(s.speechId)}': {`);
  lines.push(`    speechId: \`${escapeBacktick(s.speechId)}\`,`);
  lines.push(`    sourceUrl: \`${escapeBacktick(s.sourceUrl)}\`,`);
  lines.push(`    sourceLanguage: 'en',`);
  lines.push(`    fetchedAt: \`${escapeBacktick(fetchedAt)}\`,`);
  lines.push(`    source: 'mddi-newsroom',`);
  lines.push(`    paragraphs: ${tsArray(paragraphsZh, 4)},`);
  lines.push(`    paragraphsEn: ${tsArray(paragraphsEn, 4)},`);
  if (tldrZh.length) lines.push(`    tldr: ${tsArray(tldrZh, 4)},`);
  if (tldrEn.length) lines.push(`    tldrEn: ${tsArray(tldrEn, 4)},`);
  lines.push(`    translatedAt: \`${escapeBacktick(s.translatedAt)}\`,`);
  lines.push(`    translationSource: '${s.translationSource}',`);
  if (s.translationModel) {
    lines.push(`    translationModel: '${escapeQuote(s.translationModel)}',`);
  }
  lines.push('  },');
  return lines.join('\n');
}

function formatVoicesEntry(s: EmittableSpeech, today: string): string {
  // Field order matches existing mddiSpeeches entries (titleEn first).
  const lines: string[] = [];
  lines.push('  {');
  lines.push(`    titleEn: '${escapeQuote(s.titleEn)}',`);
  lines.push(`    title: '${escapeQuote(s.titleZh)}',`);
  lines.push(`    titleJa: '${escapeQuote(s.titleJa)}',`);
  lines.push(`    speaker: '${escapeQuote(s.speaker)}',`);
  lines.push(`    speakerTitle: '${escapeQuote(s.speakerTitleZh)}',`);
  lines.push(`    speakerTitleJa: '${escapeQuote(s.speakerTitleJa)}',`);
  lines.push(`    speakerTitleEn: '${escapeQuote(s.speakerTitleEn)}',`);
  const date =
    s.publishedDate && /^\d{4}-\d{2}-\d{2}$/.test(s.publishedDate)
      ? s.publishedDate
      : today;
  lines.push(`    date: '${date}',`);
  lines.push(`    url: '${escapeQuote(s.sourceUrl)}',`);
  lines.push(`    eventEn: '${escapeQuote(s.eventEn)}',`);
  lines.push(`    event: '${escapeQuote(s.eventZh)}',`);
  lines.push(`    eventJa: '${escapeQuote(s.eventJa)}',`);
  lines.push(`    addedAt: '${today}',`);
  lines.push('  },');
  return lines.join('\n');
}

function findArrayCloseLine(lines: string[], openMarker: RegExp): number {
  let openLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (openMarker.test(lines[i])) {
      openLine = i;
      break;
    }
  }
  if (openLine === -1) throw new Error(`Could not locate opening marker ${openMarker}`);
  let depth = 0;
  for (let i = openLine; i < lines.length; i += 1) {
    const opens = (lines[i].match(/[[{]/g) || []).length;
    const closes = (lines[i].match(/[\]}]/g) || []).length;
    depth += opens;
    depth -= closes;
    if (depth === 0 && i > openLine) return i;
  }
  throw new Error(`Could not find matching close for ${openMarker}`);
}

function validatePair(
  before: number,
  filePath: string,
  fields: string[]
): { ok: boolean; afterCount: number } {
  const afterIssues = findUnpairedFields(filePath, { fields });
  return { ok: afterIssues.length <= before, afterCount: afterIssues.length };
}

function appendToVoices(
  toEmit: EmittableSpeech[],
  options: { dryRun?: boolean }
): { added: number; baseline: number; after: number } {
  if (!existsSync(VOICES_FILE)) throw new Error(`Missing ${VOICES_FILE}`);
  const original = readFileSync(VOICES_FILE, 'utf8');
  const lines = original.split('\n');
  const closeLine = findArrayCloseLine(
    lines,
    /^export const mddiSpeeches:\s*MddiSpeech\[\]\s*=\s*\[/
  );
  const today = new Date().toISOString().slice(0, 10);
  const formatted = toEmit.map((s) => formatVoicesEntry(s, today)).join('\n');
  const updated = [...lines.slice(0, closeLine), formatted, ...lines.slice(closeLine)].join('\n');

  const baseline = findUnpairedFields(VOICES_FILE, {
    fields: ['title', 'event', 'speakerTitle'],
  }).length;
  if (options.dryRun) return { added: toEmit.length, baseline, after: baseline };
  writeFileSync(VOICES_FILE, updated);
  const v = validatePair(baseline, VOICES_FILE, ['title', 'event', 'speakerTitle']);
  if (!v.ok) {
    writeFileSync(VOICES_FILE, original);
    throw new Error(
      `voices.ts i18n pairing regressed: ${baseline} -> ${v.afterCount} unpaired. Rolled back.`
    );
  }
  return { added: toEmit.length, baseline, after: v.afterCount };
}

function appendToTranscripts(
  toEmit: EmittableSpeech[],
  options: { dryRun?: boolean }
): { added: number; baseline: number; after: number } {
  if (!existsSync(TRANSCRIPTS_FILE)) throw new Error(`Missing ${TRANSCRIPTS_FILE}`);
  const original = readFileSync(TRANSCRIPTS_FILE, 'utf8');
  const lines = original.split('\n');
  const closeLine = findArrayCloseLine(
    lines,
    /^export const speechTranscripts:\s*Record<string,\s*SpeechTranscript>\s*=\s*\{/
  );
  const formatted = toEmit.map(formatTranscriptEntry).join('\n');
  const updated = [...lines.slice(0, closeLine), formatted, ...lines.slice(closeLine)].join('\n');

  const baseline = findUnpairedFields(TRANSCRIPTS_FILE, {
    fields: ['title', 'description'],
  }).length;
  if (options.dryRun) return { added: toEmit.length, baseline, after: baseline };
  writeFileSync(TRANSCRIPTS_FILE, updated);
  const v = validatePair(baseline, TRANSCRIPTS_FILE, ['title', 'description']);
  if (!v.ok) {
    writeFileSync(TRANSCRIPTS_FILE, original);
    throw new Error(
      `speech-transcripts.ts i18n pairing regressed: ${baseline} -> ${v.afterCount} unpaired. Rolled back.`
    );
  }
  return { added: toEmit.length, baseline, after: v.afterCount };
}

export function emit(
  speeches: EmittableSpeech[],
  options: { dryRun?: boolean } = {}
): EmitResult {
  const accepted: EmittableSpeech[] = [];
  const skipped: EmitResult['skipped'] = [];
  for (const s of speeches) {
    if (!s.sourceUrl || !/^https?:\/\//.test(s.sourceUrl)) {
      skipped.push({ speechId: s.speechId, reason: 'missing sourceUrl' });
      continue;
    }
    if (!/mddi\.gov\.sg/.test(s.sourceUrl)) {
      skipped.push({ speechId: s.speechId, reason: 'sourceUrl not under mddi.gov.sg' });
      continue;
    }
    if (!s.titleEn || !s.titleZh || !s.titleJa) {
      skipped.push({ speechId: s.speechId, reason: 'missing trilingual title' });
      continue;
    }
    if (!s.eventEn || !s.eventZh || !s.eventJa) {
      skipped.push({ speechId: s.speechId, reason: 'missing trilingual event' });
      continue;
    }
    if (s.paragraphsEn.length === 0 || s.paragraphsZh.length === 0) {
      skipped.push({ speechId: s.speechId, reason: 'empty paragraphs' });
      continue;
    }
    accepted.push(s);
  }

  if (accepted.length === 0) {
    return {
      voicesFile: VOICES_FILE,
      transcriptsFile: TRANSCRIPTS_FILE,
      recordsAdded: 0,
      skipped,
    };
  }

  // Write transcripts first so a voices-side rollback can undo the
  // transcript side via the outer-try cleanup below.
  let priorTranscripts: string | null = null;
  try {
    priorTranscripts = readFileSync(TRANSCRIPTS_FILE, 'utf8');
    appendToTranscripts(accepted, options);
    appendToVoices(accepted, options);
  } catch (error) {
    if (priorTranscripts && !options.dryRun) {
      writeFileSync(TRANSCRIPTS_FILE, priorTranscripts);
    }
    throw error;
  }

  return {
    voicesFile: VOICES_FILE,
    transcriptsFile: TRANSCRIPTS_FILE,
    recordsAdded: accepted.length,
    skipped,
  };
}

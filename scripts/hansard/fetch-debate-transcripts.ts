import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { debates } from '../../src/data/debates';
import { debateTranscripts as existingTranscripts } from '../../src/data/debate-transcripts';

interface TranscriptRecord {
  debateId: string;
  reportId: string;
  title: string;
  sourceUrl: string;
  sourceLanguage: 'en';
  fetchedAt: string;
  source: 'sprs-hansard' | 'unavailable';
  paragraphs: string[];
  error?: string;
}

interface TranscriptTranslation {
  debateId: string;
  targetLanguage: 'zh';
  sourceLanguage: string;
  translatedAt: string;
  source: 'openai' | 'manual' | 'source';
  model?: string;
  paragraphs: string[];
}

const RAW_DIR = resolve('scripts/hansard/data/transcripts');
const TRANSLATION_DIR = resolve('scripts/hansard/data/translations');
const OUT_FILE = resolve('src/data/debate-transcripts.ts');

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const emitOnly = args.has('--emit-only');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((arg) => arg.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-');
}

function htmlToParagraphs(html: string): string[] {
  const withBreaks = html
    .replace(/\r?\n/g, ' ')
    .replace(/<(br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<(p|div|li|h[1-6]|tr)(\s[^>]*)?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  return decodeEntities(withBreaks)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function cachedRecord(debateId: string): TranscriptRecord | null {
  const path = join(RAW_DIR, `${debateId}.json`);
  if (!existsSync(path) || force) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptRecord;
}

function getSprsReportId(debate: (typeof debates)[number]): string {
  const match = debate.sourceUrl.match(/[?&]reportid=([^&]+)/) || debate.sourceUrl.match(/reportid=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : debate.id;
}

function readTranslation(debateId: string): TranscriptTranslation | null {
  const path = join(TRANSLATION_DIR, `${debateId}.zh.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptTranslation;
}

async function fetchTranscript(debate: (typeof debates)[number]): Promise<TranscriptRecord> {
  const cached = cachedRecord(debate.id);
  if (cached) return cached;

  mkdirSync(RAW_DIR, { recursive: true });

  const reportId = getSprsReportId(debate);
  const fetchedAt = new Date().toISOString().slice(0, 10);
  const url = new URL('https://sprs.parl.gov.sg/search/getHansardTopic/');
  url.searchParams.set('id', reportId);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Referer: 'https://sprs.parl.gov.sg/search/',
        'User-Agent': 'Mozilla/5.0',
      },
      body: '{}',
    });

    if (!response.ok) throw new Error(`SPRS returned ${response.status}`);

    const data = (await response.json()) as unknown;
    if (!isRecord(data) || !isRecord(data.resultHTML)) throw new Error('SPRS response missing resultHTML.');

    const result = data.resultHTML;
    const contentHtml =
      readString(result, 'content') || readString(result, 'htmlFullContent') || readString(result, 'htmlContent');
    const paragraphs = htmlToParagraphs(contentHtml);
    if (paragraphs.length === 0) throw new Error('SPRS response contained no transcript text.');

    const record: TranscriptRecord = {
      debateId: debate.id,
      reportId,
      title: readString(result, 'title') || debate.title,
      sourceUrl: debate.sourceUrl,
      sourceLanguage: 'en',
      fetchedAt,
      source: 'sprs-hansard',
      paragraphs,
    };
    writeFileSync(join(RAW_DIR, `${debate.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
    return record;
  } catch (error) {
    const record: TranscriptRecord = {
      debateId: debate.id,
      reportId,
      title: debate.title,
      sourceUrl: debate.sourceUrl,
      sourceLanguage: 'en',
      fetchedAt,
      source: 'unavailable',
      paragraphs: [],
      error: error instanceof Error ? error.message : String(error),
    };
    writeFileSync(join(RAW_DIR, `${debate.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
    return record;
  }
}

// Emit merges three sources per debate, never discarding what only lives in the
// data file (ja/ko backfilled translations, manually inserted records):
//   raw cache (fresh EN fetch) > existing data file > empty.
// Historical failure this guards against: the old emit rebuilt the whole file
// from raw cache + zh translation cache only, wiping paragraphsJa/paragraphsKo
// and downgrading the tail helpers (CLAUDE.md rule #11 / rule #8 second truth
// source). Any change to the template below MUST be mirrored in
// src/data/debate-transcripts.ts tail helpers, and vice versa.
function emitData(): void {
  const merged: [string, Record<string, unknown>][] = [];

  for (const debate of debates) {
    const cachePath = join(RAW_DIR, `${debate.id}.json`);
    const cached = existsSync(cachePath) ? (JSON.parse(readFileSync(cachePath, 'utf8')) as TranscriptRecord) : null;
    const existing = existingTranscripts[debate.id];
    const translation = readTranslation(debate.id);

    if (!cached && !existing) {
      process.stderr.write(`[emit] WARN ${debate.id}: no raw cache and no existing record — emitting unavailable placeholder.\n`);
    }

    const paragraphsEn = cached?.paragraphs?.length ? cached.paragraphs : (existing?.paragraphsEn ?? []);
    const paragraphs = translation?.paragraphs?.length ? translation.paragraphs : (existing?.paragraphs ?? []);
    const paragraphsJa = existing?.paragraphsJa;
    const paragraphsKo = existing?.paragraphsKo;
    if (existing?.paragraphs?.length && !paragraphs.length) {
      process.stderr.write(`[emit] WARN ${debate.id}: refusing zh downgrade — keeping existing paragraphs.\n`);
    }

    const translatedAt = translation?.translatedAt ?? existing?.translatedAt;
    const translationSource = translation?.source ?? existing?.translationSource;
    const translationModel = translation?.model ?? existing?.translationModel;

    merged.push([
      debate.id,
      {
        debateId: debate.id,
        reportId: cached?.reportId ?? existing?.reportId ?? getSprsReportId(debate),
        sourceUrl: debate.sourceUrl,
        sourceLanguage: 'en',
        fetchedAt: cached?.fetchedAt ?? existing?.fetchedAt ?? new Date().toISOString().slice(0, 10),
        source: cached?.source === 'sprs-hansard' ? 'sprs-hansard' : (existing?.source ?? cached?.source ?? 'unavailable'),
        paragraphs,
        paragraphsEn,
        ...(paragraphsJa?.length ? { paragraphsJa } : {}),
        ...(paragraphsKo?.length ? { paragraphsKo } : {}),
        ...(translatedAt ? { translatedAt } : {}),
        ...(translationSource ? { translationSource } : {}),
        ...(translationModel ? { translationModel } : {}),
        ...(cached?.error && !paragraphsEn.length ? { error: cached.error } : {}),
      },
    ]);
  }

  const data = JSON.stringify(Object.fromEntries(merged), null, 2);
  const body = `export interface DebateTranscript {
  debateId: string;
  reportId: string;
  sourceUrl: string;
  sourceLanguage: 'en';
  fetchedAt: string;
  source: 'sprs-hansard' | 'manual' | 'unavailable';
  /** Default-locale readable transcript (zh). */
  paragraphs: string[];
  /** Original Hansard transcript (English). */
  paragraphsEn: string[];
  /** Japanese translation of paragraphs. */
  paragraphsJa?: string[];
  /** Korean translation of paragraphs. */
  paragraphsKo?: string[];
  translatedAt?: string;
  translationSource?: 'openai' | 'manual' | 'source';
  translationModel?: string;
  error?: string;
}

export const debateTranscripts: Record<string, DebateTranscript> = ${data};

import { toTraditional } from '~/i18n/opencc';

export function getDebateTranscript(debateId: string): DebateTranscript | undefined {
  return debateTranscripts[debateId];
}

// Locale handling: zh-tw derives from zh via OpenCC s2twp at read time; ja/ko
// read their translated tracks and fall back to the English original (Hansard
// publishes English) only while a record's backfill is still missing.
// NOTE: any change here MUST be mirrored in the emit template inside
// scripts/hansard/fetch-debate-transcripts.ts (rule #8 second truth source).
export function getDebateTranscriptParagraphs(debateId: string, lang: string): string[] {
  const transcript = getDebateTranscript(debateId);
  if (!transcript) return [];
  if (lang === 'zh') return transcript.paragraphs;
  if (lang === 'zh-tw') return transcript.paragraphs.map((p) => toTraditional(p));
  if (lang === 'ja' && transcript.paragraphsJa?.length) return transcript.paragraphsJa;
  if (lang === 'ko' && transcript.paragraphsKo?.length) return transcript.paragraphsKo;
  return transcript.paragraphsEn?.length ? transcript.paragraphsEn : transcript.paragraphs;
}

export function getDebateTranscriptLanguage(debateId: string, lang: string): string | undefined {
  const transcript = getDebateTranscript(debateId);
  if (!transcript) return undefined;
  if (lang === 'zh' || lang === 'zh-tw') return transcript.paragraphs.length ? 'zh-CN' : undefined;
  if (lang === 'ja' && transcript.paragraphsJa?.length) return 'ja';
  if (lang === 'ko' && transcript.paragraphsKo?.length) return 'ko';
  return transcript.paragraphsEn?.length ? 'en' : transcript.paragraphs.length ? 'zh-CN' : undefined;
}
`;

  writeFileSync(OUT_FILE, body);
}

const selected = debates.filter((debate) => !requestedIds || requestedIds.has(debate.id)).slice(0, limit);

if (!emitOnly) {
  for (const debate of selected) {
    process.stdout.write(`Fetching ${debate.id} ... `);
    const record = await fetchTranscript(debate);
    process.stdout.write(record.paragraphs.length ? `ok (${record.paragraphs.length} paragraphs)\n` : 'unavailable\n');
  }
}

emitData();

if (existsSync(RAW_DIR)) {
  process.stdout.write(`Emitted ${readdirSync(RAW_DIR).filter((file) => file.endsWith('.json')).length} cached records.\n`);
}

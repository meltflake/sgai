import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { videos } from '../../src/data/videos';

interface TranscriptRecord {
  videoId: string;
  youtubeId: string;
  language: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'unavailable';
  paragraphs: string[];
  error?: string;
}

interface TranscriptTranslation {
  videoId: string;
  targetLanguage: 'zh';
  sourceLanguage: string;
  translatedAt: string;
  source: 'openai' | 'manual' | 'source';
  model?: string;
  paragraphs: string[];
}

const RAW_DIR = resolve('scripts/videos/data/transcripts');
const TRANSLATION_DIR = resolve('scripts/videos/data/translations');
const TMP_DIR = resolve('scripts/videos/data/transcripts-tmp');
const OUT_FILE = resolve('src/data/video-transcripts.ts');
const LANGS = ['en', 'zh-Hans', 'zh-Hant', 'zh'];

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const emitOnly = args.has('--emit-only');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((arg) => arg.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function youtubeId(url: string): string {
  const parsed = new URL(url);
  if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace(/^\/+/, '');
  return parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).at(-1) || url;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function vttToParagraphs(vtt: string): string[] {
  const lines = vtt
    .split(/\r?\n/)
    .map((line) =>
      decodeEntities(
        line
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
    )
    .filter((line) => line)
    .filter((line) => !line.startsWith('WEBVTT'))
    .filter((line) => !line.startsWith('Kind:'))
    .filter((line) => !line.startsWith('Language:'))
    .filter((line) => !line.startsWith('NOTE'))
    .filter((line) => !/^\d+$/.test(line))
    .filter((line) => !line.includes('-->'));

  const deduped: string[] = [];
  for (const line of lines) {
    if (line !== deduped.at(-1)) deduped.push(line);
  }

  const text = deduped.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return [];

  const sentences = text.match(/[^.!?。！？]+[.!?。！？]?/g) || [text];
  const paragraphs: string[] = [];
  let current = '';

  for (const sentence of sentences.map((s) => s.trim()).filter(Boolean)) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length > 850 && current) {
      paragraphs.push(current);
      current = sentence;
    } else {
      current = next;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}

function cachedRecord(videoId: string): TranscriptRecord | null {
  const path = join(RAW_DIR, `${videoId}.json`);
  if (!existsSync(path) || force) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptRecord;
}

function isChineseLanguage(language: string): boolean {
  return language.toLowerCase().startsWith('zh');
}

function isEnglishLanguage(language: string): boolean {
  return language.toLowerCase().startsWith('en');
}

function readTranslation(videoId: string, targetLanguage: 'zh'): TranscriptTranslation | null {
  const path = join(TRANSLATION_DIR, `${videoId}.${targetLanguage}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptTranslation;
}

function downloadTranscript(video: (typeof videos)[number]): TranscriptRecord {
  const cached = cachedRecord(video.id);
  if (cached) return cached;

  mkdirSync(RAW_DIR, { recursive: true });
  rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });

  const yid = youtubeId(video.youtubeUrl);
  const fetchedAt = new Date().toISOString().slice(0, 10);

  for (const lang of LANGS) {
    rmSync(TMP_DIR, { recursive: true, force: true });
    mkdirSync(TMP_DIR, { recursive: true });

    spawnSync(
      'yt-dlp',
      [
        '--skip-download',
        '--write-auto-subs',
        '--write-subs',
        '--sub-langs',
        lang,
        '--sub-format',
        'vtt',
        '--sleep-requests',
        '1',
        '--output',
        join(TMP_DIR, `${video.id}.%(ext)s`),
        video.youtubeUrl,
      ],
      { encoding: 'utf8' }
    );

    const vttFile = readdirSync(TMP_DIR).find((file) => file.endsWith('.vtt'));
    if (!vttFile) continue;

    const vtt = readFileSync(join(TMP_DIR, vttFile), 'utf8');
    const paragraphs = vttToParagraphs(vtt);
    if (paragraphs.length === 0) continue;

    const record: TranscriptRecord = {
      videoId: video.id,
      youtubeId: yid,
      language: lang,
      fetchedAt,
      source: 'youtube-subtitles',
      paragraphs,
    };
    writeFileSync(join(RAW_DIR, `${video.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
    writeFileSync(join(RAW_DIR, `${video.id}.${lang}.vtt`), vtt);
    return record;
  }

  const record: TranscriptRecord = {
    videoId: video.id,
    youtubeId: yid,
    language: '',
    fetchedAt,
    source: 'unavailable',
    paragraphs: [],
    error: 'No subtitle track was available through yt-dlp.',
  };
  writeFileSync(join(RAW_DIR, `${video.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  return record;
}

async function loadExistingTranscripts(): Promise<Record<string, unknown>> {
  // 关键不变量：emit 必须 MERGE 而不是覆盖。
  // scripts/videos/data/{transcripts,translations}/ 是 gitignored，
  // 新 worktree / 新机器只有最终产物 video-transcripts.ts，没 raw cache。
  // 如果只 emit 当前 raw cache 里的几条，会把过去所有视频的 transcripts 全擦掉。
  // 历史事故：2026-05-09 一个 emit run 把 v001-v058 全干掉了。
  if (!existsSync(OUT_FILE)) return {};
  try {
    const mod = await import(OUT_FILE);
    return (mod.videoTranscripts ?? {}) as Record<string, unknown>;
  } catch (e) {
    console.warn(`  ⚠ Could not load existing video-transcripts.ts: ${e instanceof Error ? e.message : e}`);
    return {};
  }
}

async function emitData(records: TranscriptRecord[]): Promise<void> {
  const existing = await loadExistingTranscripts();
  const available = records
    .filter((record) => record.paragraphs.length > 0)
    .map((record) => {
      const zhTranslation = readTranslation(record.videoId, 'zh');
      const paragraphs = isChineseLanguage(record.language) ? record.paragraphs : zhTranslation?.paragraphs || [];
      const paragraphsEn = isEnglishLanguage(record.language) ? record.paragraphs : undefined;

      return [
        record.videoId,
        {
          videoId: record.videoId,
          youtubeId: record.youtubeId,
          captionLanguage: record.language,
          fetchedAt: record.fetchedAt,
          source: record.source,
          paragraphs,
          ...(paragraphsEn ? { paragraphsEn } : {}),
          ...(zhTranslation
            ? {
                translatedAt: zhTranslation.translatedAt,
                translationSource: zhTranslation.source,
                translationModel: zhTranslation.model,
              }
            : {}),
          ...(record.error ? { error: record.error } : {}),
        },
      ] as const;
    });
  // existing 在前、available 在后：本次 emit 的条目覆盖旧版（fetchedAt / 翻译可能更新），
  // 但 existing 里没被本次 emit 覆盖的所有 v* 条目都原样保留。
  const merged = { ...existing, ...Object.fromEntries(available) };
  // videos.ts 里已经移除的视频也跟着从 transcripts 清掉，避免悬空条目。
  const validIds = new Set(videos.map((v) => v.id));
  for (const id of Object.keys(merged)) {
    if (!validIds.has(id)) delete merged[id];
  }
  const data = JSON.stringify(merged, null, 2);
  const body = `export interface VideoDigest {
  /** 2-4 short scannable takeaways. */
  keyPoints: string[];
  /** 2-3 paragraphs of clean, readable narrative — the substance of the video. */
  narrative: string[];
}

export interface VideoTranscript {
  videoId: string;
  youtubeId: string;
  captionLanguage: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'manual' | 'unavailable';
  /** Default-locale readable transcript (zh). */
  paragraphs: string[];
  /** English readable transcript. Usually the original YouTube caption track. */
  paragraphsEn?: string[];
  /** Polished readable digest (zh). When present, this is the primary on-page content; raw paragraphs become a collapsible fallback. */
  digest?: VideoDigest;
  /** Polished readable digest (en). */
  digestEn?: VideoDigest;
  translatedAt?: string;
  // 'claude' = local Claude CLI (default since 2026-05). 'openai' kept for
  // backward compatibility with translations cached before the switch.
  translationSource?: 'claude' | 'openai' | 'manual' | 'source';
  translationModel?: string;
  error?: string;
}

export const videoTranscripts: Record<string, VideoTranscript> = ${data};

export function getVideoTranscript(videoId: string): VideoTranscript | undefined {
  return videoTranscripts[videoId];
}

export function getVideoTranscriptParagraphs(videoId: string, lang: 'zh' | 'en' | 'ja'): string[] {
  const transcript = getVideoTranscript(videoId);
  if (!transcript) return [];
  if (lang === 'zh') return transcript.paragraphs;
  // en, ja, ... — prefer the English paragraphs when present (per-locale
  // transcript variants like paragraphsJa can be added later).
  return transcript.paragraphsEn || transcript.paragraphs;
}

export function getVideoTranscriptLanguage(videoId: string, lang: 'zh' | 'en' | 'ja'): string | undefined {
  const transcript = getVideoTranscript(videoId);
  if (!transcript) return undefined;
  if (lang === 'zh') return transcript.paragraphs.length ? 'zh-CN' : undefined;
  if (transcript.paragraphsEn?.length) return transcript.captionLanguage || (lang === 'en' ? 'en' : lang);
  return transcript.paragraphs.length ? 'zh-CN' : undefined;
}

/** Read the polished digest for a video in the requested language. Falls
 *  back to zh digest when no localized variant exists. ja currently falls
 *  back to the en digest, then zh. */
export function getVideoDigest(videoId: string, lang: 'zh' | 'en' | 'ja'): VideoDigest | undefined {
  const transcript = getVideoTranscript(videoId);
  if (!transcript) return undefined;
  if (lang === 'zh') return transcript.digest;
  return transcript.digestEn || transcript.digest;
}
`;

  writeFileSync(OUT_FILE, body);
}

function loadCachedRecords(): TranscriptRecord[] {
  return videos
    .map((video) => {
      const path = join(RAW_DIR, `${video.id}.json`);
      if (!existsSync(path)) return null;
      return JSON.parse(readFileSync(path, 'utf8')) as TranscriptRecord;
    })
    .filter(Boolean) as TranscriptRecord[];
}

const selected = videos.filter((video) => !requestedIds || requestedIds.has(video.id)).slice(0, limit);

if (!emitOnly) {
  for (const video of selected) {
    process.stdout.write(`Fetching ${video.id} ${video.youtubeUrl} ... `);
    try {
      const record = downloadTranscript(video);
      process.stdout.write(record.paragraphs.length ? `ok (${record.language})\n` : 'unavailable\n');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const record: TranscriptRecord = {
        videoId: video.id,
        youtubeId: youtubeId(video.youtubeUrl),
        language: '',
        fetchedAt: new Date().toISOString().slice(0, 10),
        source: 'unavailable',
        paragraphs: [],
        error: message,
      };
      mkdirSync(RAW_DIR, { recursive: true });
      writeFileSync(join(RAW_DIR, `${video.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
      process.stdout.write(`error: ${message}\n`);
    }
  }
}

await emitData(loadCachedRecords());

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

const RAW_DIR = resolve('scripts/videos/data/transcripts');
const TMP_DIR = resolve('scripts/videos/data/transcripts-tmp');
const OUT_FILE = resolve('src/data/video-transcripts.ts');
const LANGS = ['en', 'zh-Hans', 'zh-Hant', 'zh'];

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
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

function emitData(records: TranscriptRecord[]): void {
  const available = records.filter((record) => record.paragraphs.length > 0);
  const data = JSON.stringify(Object.fromEntries(available.map((record) => [record.videoId, record])), null, 2);
  const body = `export interface VideoTranscript {
  videoId: string;
  youtubeId: string;
  language: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'manual' | 'unavailable';
  paragraphs: string[];
  error?: string;
}

export const videoTranscripts: Record<string, VideoTranscript> = ${data};

export function getVideoTranscript(videoId: string): VideoTranscript | undefined {
  return videoTranscripts[videoId];
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

emitData(loadCachedRecords());

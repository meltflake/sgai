// scripts/videos/vtt-parse.ts
// ────────────────────────────────────────────────────────────────────────
// Shared VTT → readable-paragraphs parser. Used by fetch-transcripts.ts at
// fetch time and by reprocess-cached.ts when applying a new cleanup pass
// to already-cached .vtt files without re-hitting yt-dlp.
//
// Pipeline: VTT cues → flatten to one text → split into sentences →
// `stripAsrHallucinations` to drop ASR junk runs at start/end → repack
// into ~850-char paragraphs.

import { stripAsrHallucinationsWithReport, type AsrCleanupReport } from '../lib/asr-cleanup.ts';

const PARAGRAPH_CHAR_LIMIT = 850;

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function vttToSentences(vtt: string): string[] {
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
  return sentences.map((s) => s.trim()).filter(Boolean);
}

function packIntoParagraphs(sentences: string[]): string[] {
  const paragraphs: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length > PARAGRAPH_CHAR_LIMIT && current) {
      paragraphs.push(current);
      current = sentence;
    } else {
      current = next;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}

export interface VttParseResult {
  paragraphs: string[];
  cleanup: AsrCleanupReport;
}

export function vttToParagraphsWithReport(vtt: string): VttParseResult {
  const sentences = vttToSentences(vtt);
  const { kept, report } = stripAsrHallucinationsWithReport(sentences);
  return { paragraphs: packIntoParagraphs(kept), cleanup: report };
}

export function vttToParagraphs(vtt: string): string[] {
  return vttToParagraphsWithReport(vtt).paragraphs;
}

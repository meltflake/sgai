// scripts/refresh/voices/fetch.ts
// ────────────────────────────────────────────────────────────────────────
// Fetch one MDDI newsroom page and extract:
//   - h1 title (used for the AI summarizer's title input)
//   - publishedDate (best-effort)
//   - English paragraphs[] (main body text, multi-strategy)
//
// Strategies ported from scripts/voices/02_fetch_speeches.py
// BeautifulSoup logic, but implemented with regex over the raw HTML
// because the repo doesn't ship cheerio / node-html-parser. The MDDI
// template is stable enough that this is fine; if MDDI ever rebuilds the
// site we can wrap one of those parsers behind the same interface.
//
// CloudFront is sensitive: we send a real desktop UA + standard headers,
// matching 02_fetch_speeches.py.

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface FetchedSpeech {
  speechId: string;
  sourceUrl: string;
  fetchedAt: string;
  /** <h1> or og:title; used to seed the AI summarizer. */
  title: string;
  /** ISO date if extractable, else null. */
  publishedDate: string | null;
  paragraphs: string[];
}

export interface FetchResult {
  successes: FetchedSpeech[];
  failures: Array<{ speechId: string; sourceUrl: string; error: string }>;
}

const RAW_DIR = resolve('scripts/refresh/voices/data/raw');
const SPEECHES_DIR = resolve('scripts/refresh/voices/data/speeches');

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const SKIP_SUBSTRINGS = [
  'Call the 24/7 ScamShield',
  'ScamShield Helpline',
  'Subscribe to our newsletter',
];

const NOISE_LINES = new Set(['***', '.  .  .  .  .', '. . . . .']);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripInlineTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractH1(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) {
    const text = stripInlineTags(m[1]);
    if (text) return text;
  }
  const og = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (og) return decodeEntities(og[1].trim());
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (t) return decodeEntities(t[1].replace(/\s+/g, ' ').trim());
  return '';
}

function extractDate(html: string): string | null {
  const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["']/i);
  if (timeTag) return normalizeDate(timeTag[1]);
  const metas = [
    /<meta\s+(?:property|name)=["']article:published_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']article:modified_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']publish-date["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i,
  ];
  for (const re of metas) {
    const m = html.match(re);
    if (m) return normalizeDate(m[1]);
  }
  const text = stripInlineTags(html);
  const inline = text.match(
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/
  );
  if (inline) return normalizeDate(inline[1]);
  return null;
}

function normalizeDate(input: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return input.slice(0, 10);
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };
  const m = input.toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const month = months[m[2].slice(0, 3)];
    if (month) return `${m[3]}-${month}-${day}`;
  }
  const d = new Date(input);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

/** Walk <p>...</p> blocks inside a given HTML chunk, returning their
 *  stripped text. Drops empty paragraphs and lines hit by SKIP_SUBSTRINGS
 *  / NOISE_LINES. */
function extractPs(chunk: string): string[] {
  const out: string[] = [];
  for (const m of chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripInlineTags(m[1]);
    if (!text) continue;
    if (NOISE_LINES.has(text)) continue;
    if (SKIP_SUBSTRINGS.some((s) => text.includes(s))) continue;
    if (/^\d{1,2}\s+\w+\s+\d{4}$/.test(text)) continue;
    out.push(text);
  }
  return out;
}

/** Try to isolate the body container before scanning <p>. MDDI's
 *  template uses a few distinctive class patterns; we try each. */
function tryBodyContainer(html: string): string | null {
  // Strategy 1: div.w-full.overflow-x-auto.break-words
  const s1 = html.match(
    /<div[^>]*class=["'][^"']*\bw-full\b[^"']*\boverflow-x-auto\b[^"']*\bbreak-words\b[^"']*["'][\s\S]*?(?=<\/div>\s*<(?:footer|nav|aside))/i
  );
  if (s1) return s1[0];
  // Strategy 2: <main>...</main>
  const s2 = html.match(/<main\b[\s\S]*?<\/main>/i);
  if (s2) return s2[0];
  return null;
}

export function extractParagraphs(html: string): string[] {
  const container = tryBodyContainer(html);
  if (container) {
    const ps = extractPs(container);
    if (ps.length >= 5) return ps;
  }
  // Fallback: whole document. Strip script/style first to avoid noise.
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  return extractPs(cleaned);
}

async function fetchHtml(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': REAL_UA,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Ch-Ua': '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
  return await resp.text();
}

export interface FetchOptions {
  /** Sleep between requests (CloudFront is sensitive). Default 1500 ms. */
  sleepBetweenMs?: number;
  /** Write the raw page payload to scripts/refresh/voices/data/raw/<id>.html. */
  saveRaw?: boolean;
  /** Write the structured speech JSON to data/speeches/<id>.json. Default true. */
  saveSpeechJson?: boolean;
}

export async function fetchSpeeches(
  candidates: Array<{ speechId: string; sourceUrl: string }>,
  options: FetchOptions = {}
): Promise<FetchResult> {
  const sleepBetween = options.sleepBetweenMs ?? 1500;
  const saveSpeechJson = options.saveSpeechJson ?? true;
  const successes: FetchedSpeech[] = [];
  const failures: FetchResult['failures'] = [];

  if (saveSpeechJson) mkdirSync(SPEECHES_DIR, { recursive: true });
  if (options.saveRaw) mkdirSync(RAW_DIR, { recursive: true });

  for (let i = 0; i < candidates.length; i += 1) {
    const c = candidates[i];
    if (i > 0) await sleep(sleepBetween);
    try {
      const html = await fetchHtml(c.sourceUrl);
      if (options.saveRaw) {
        writeFileSync(`${RAW_DIR}/${c.speechId}.html`, html);
      }
      const paragraphs = extractParagraphs(html);
      if (paragraphs.length === 0) {
        failures.push({
          speechId: c.speechId,
          sourceUrl: c.sourceUrl,
          error: 'no-paragraphs',
        });
        continue;
      }
      const record: FetchedSpeech = {
        speechId: c.speechId,
        sourceUrl: c.sourceUrl,
        fetchedAt: new Date().toISOString().slice(0, 10),
        title: extractH1(html),
        publishedDate: extractDate(html),
        paragraphs,
      };
      if (saveSpeechJson) {
        writeFileSync(
          `${SPEECHES_DIR}/${c.speechId}.json`,
          `${JSON.stringify(record, null, 2)}\n`
        );
      }
      successes.push(record);
    } catch (error) {
      failures.push({
        speechId: c.speechId,
        sourceUrl: c.sourceUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { successes, failures };
}

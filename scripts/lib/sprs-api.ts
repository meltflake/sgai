// scripts/lib/sprs-api.ts
// ────────────────────────────────────────────────────────────────────────
// Singapore Parliament Reports System (SPRS) Hansard API connector.
//
// Endpoint: POST https://sprs.parl.gov.sg/search/getHansardTopic/?id=<reportId>
// Response shape: { resultHTML: { title, sittingDate, content, reportType, ... }, resultData: null }
//
// Report ID conventions (validated against live API):
//   - oral-answer-XXXX     (4000+ range; 2026 ≈ 4023–4140)
//   - written-answer-XXXXX (21000+ range; FIVE digits)
//   - budget-XXXX          (2800+ range)
//   - cos-<ministry>-<yr>  (e.g. cos-moh-2026)
//
// USAGE:
//   import { fetchHansardTopic, scanIdRange, htmlToParagraphs } from './lib/sprs-api';
//   const t = await fetchHansardTopic('oral-answer-4123');
//   const newOnes = await scanIdRange('oral-answer', 4123, 4163);

export interface HansardTopic {
  reportId: string;
  title: string;
  /** Format: "12-2-2026" (DD-M-YYYY). */
  sittingDate: string;
  contentHtml: string;
  reportType?: string;
  raw: Record<string, unknown>;
}

const SPRS_API = 'https://sprs.parl.gov.sg/search/getHansardTopic/';
const DEFAULT_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  Referer: 'https://sprs.parl.gov.sg/search/',
  'User-Agent': 'Mozilla/5.0 sgai-refresh',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

/**
 * Fetch a single Hansard topic by report ID. Returns null if the API
 * returns 200 but `resultHTML` is null/empty (i.e. the ID doesn't exist).
 * Throws on transport / non-200 errors.
 */
export async function fetchHansardTopic(reportId: string): Promise<HansardTopic | null> {
  const url = new URL(SPRS_API);
  url.searchParams.set('id', reportId);

  const response = await fetch(url, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: '{}',
  });

  if (!response.ok) {
    throw new Error(`SPRS ${reportId}: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  if (!isRecord(data)) return null;
  const result = data.resultHTML;
  if (!isRecord(result) || !result.title) return null;

  return {
    reportId,
    title: readString(result, 'title'),
    sittingDate: readString(result, 'sittingDate'),
    contentHtml:
      readString(result, 'content') || readString(result, 'htmlFullContent') || readString(result, 'htmlContent'),
    reportType: readString(result, 'reportType') || undefined,
    raw: result,
  };
}

/**
 * Scan a contiguous ID range. Throttled to 1 req every 300ms.
 * Returns only IDs that exist (200 + resultHTML present).
 *
 * @param prefix e.g. 'oral-answer'
 * @param startExclusive lowest ID to skip (state.last_max)
 * @param endInclusive highest ID to scan
 */
export async function scanIdRange(
  prefix: string,
  startExclusive: number,
  endInclusive: number,
  options: { sleepMs?: number } = {}
): Promise<HansardTopic[]> {
  const sleepMs = options.sleepMs ?? 300;
  const out: HansardTopic[] = [];
  for (let i = startExclusive + 1; i <= endInclusive; i += 1) {
    const reportId = `${prefix}-${i}`;
    try {
      const topic = await fetchHansardTopic(reportId);
      if (topic) out.push(topic);
    } catch {
      /* swallow individual failures */
    }
    if (sleepMs > 0) await new Promise((r) => setTimeout(r, sleepMs));
  }
  return out;
}

/**
 * Decode HTML entities and strip tags into a paragraph array. Mirrors the
 * existing logic in scripts/hansard/fetch-debate-transcripts.ts so the
 * extracted module produces identical output.
 */
export function htmlToParagraphs(html: string): string[] {
  const decoded = html
    .replace(/\r?\n/g, ' ')
    .replace(/<(br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<(p|div|li|h[1-6]|tr)(\s[^>]*)?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&ndash;|&mdash;/g, '-');

  return decoded
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Common AI-keyword filter applied to Hansard titles. Centralised here so
 * scripts/auto_update.py and any new hansard tooling agree on the rule.
 */
export const AI_TITLE_KEYWORDS = [
  /\bartificial intelligence\b/i,
  /\bAI\b/,
  /\bdeepfake/i,
  /\bdata centre/i,
  /\bmachine learning\b/i,
  /\bGPT\b/,
  /\bgenerative\b/i,
  /\bLLM\b/,
  /\bsmart nation\b/i,
  /\bdigital economy\b/i,
  /\bcompute\b/i,
  /\brobotic/i,
  /\bautonomous\b/i,
  /\bcybersecurity\b/i,
  /\bdata protect/i,
];

export function matchesAiKeywords(text: string): boolean {
  return AI_TITLE_KEYWORDS.some((re) => re.test(text));
}

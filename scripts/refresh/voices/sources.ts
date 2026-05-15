// scripts/refresh/voices/sources.ts
// ────────────────────────────────────────────────────────────────────────
// Source registry for the MDDI voices pipeline (AI-related speeches).
//
// Single source: MDDI newsroom sitemap. Each candidate URL must:
//   1. Live under /newsroom/<slug>/
//   2. Have a slug containing a SPEECH keyword (speech / address / remarks / keynote / transcript)
//   3. Have a slug containing an AI keyword (see AI_SLUG_PATTERNS)
//
// Ported from scripts/voices/01_scan_mddi.py to keep the same filter
// surface; expanding keywords here also flows back through the same
// channel cron jobs once this pipeline replaces 01.

export interface VoicesSource {
  domain: string;
  label: string;
  sitemapUrls: string[];
  /** Slug positive filter: URL must match at least one. */
  urlPatterns: RegExp[];
  /** Slug negative filter: URL must not match any. */
  urlExcludes?: RegExp[];
}

export const SPEECH_SLUG_PATTERNS: RegExp[] = [
  /\bspeech\b/,
  /\baddress\b/,
  /\bremarks\b/,
  /\bkeynote\b/,
  /\btranscript\b/,
];

export const AI_SLUG_PATTERNS: RegExp[] = [
  /\bai\b/,
  /artificial-intelligence/,
  /data-centre/,
  /digital-infrastructure/,
  /smart-nation/,
  /digital-economy/,
  /digital-leader/,
  /ai-festival/,
  /ai-summit/,
  /ai-world/,
  /superai/,
  /agentic/,
  /compute/,
  /quantinuum/,
  /generative-ai/,
  /national-ai/,
  /airtrunk/,
  /google-cloud/,
  /microsoft.*ai/,
  /ai-quickstart/,
  /ai-research/,
  /ai-health/,
  /ai-security/,
  /ai-centre/,
  /ai-govern/,
  /ai-student/,
  /deepfake/,
  /machine-learning/,
  /foundation-model/,
  /\bllm\b/,
];

/** Lower-case slug → speaker name + Chinese title + EN title. Mirrors
 *  scripts/voices/01_scan_mddi.py SPEAKER_MAP; centralized so the emit
 *  step can populate sibling fields. Keep additions sorted by name. */
export const SPEAKER_MAP: Record<
  string,
  { name: string; titleZh: string; titleEn: string; titleJa: string }
> = {
  'janil-puthucheary': {
    name: 'Janil Puthucheary',
    titleZh: 'MDDI 前高级政务部长',
    titleEn: 'Former Senior Minister of State, MDDI',
    titleJa: 'MDDI 元上級政務部長',
  },
  'jasmin-lau': {
    name: 'Jasmin Lau',
    titleZh: 'MDDI 政务次长',
    titleEn: 'Minister of State, MDDI',
    titleJa: 'MDDI 政務次官',
  },
  'josephine-teo': {
    name: 'Josephine Teo',
    titleZh: '数码发展及新闻部长',
    titleEn: 'Minister for Digital Development and Information',
    titleJa: 'デジタル開発・ニュース相',
  },
  'rahayu-mahzam': {
    name: 'Rahayu Mahzam',
    titleZh: 'MDDI 政务次长',
    titleEn: 'Minister of State, MDDI',
    titleJa: 'MDDI 政務次官',
  },
  'tan-kiat-how': {
    name: 'Tan Kiat How',
    titleZh: 'MDDI 高级政务部长',
    titleEn: 'Senior Minister of State, MDDI',
    titleJa: 'MDDI 上級政務部長',
  },
};

export const VOICES_SOURCES: VoicesSource[] = [
  {
    domain: 'mddi.gov.sg',
    label: 'Ministry of Digital Development and Information',
    sitemapUrls: ['https://www.mddi.gov.sg/sitemap.xml'],
    urlPatterns: [/\/newsroom\//],
  },
];

/** Returns the lower-case /newsroom/<slug>/ extracted from a URL,
 *  or null if not an MDDI newsroom URL. */
export function newsroomSlug(url: string): string | null {
  const m = url.toLowerCase().match(/\/newsroom\/([^/?#]+)/);
  return m ? m[1] : null;
}

/** A URL counts as an AI-related speech if its slug matches at least
 *  one SPEECH_SLUG_PATTERNS and one AI_SLUG_PATTERNS entry. */
export function isAiSpeechUrl(url: string): boolean {
  const slug = newsroomSlug(url);
  if (!slug) return false;
  if (!SPEECH_SLUG_PATTERNS.some((re) => re.test(slug))) return false;
  if (!AI_SLUG_PATTERNS.some((re) => re.test(slug))) return false;
  return true;
}

/** Look up speaker metadata from a slug; case-insensitive substring match.
 *  Empty fields when no map entry hits — caller should fall back to AI
 *  summary or the page <h1>. */
export function speakerFromSlug(slug: string): {
  name: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
} {
  const lower = slug.toLowerCase();
  for (const [key, value] of Object.entries(SPEAKER_MAP)) {
    if (lower.includes(key)) return value;
  }
  return { name: '', titleZh: '', titleEn: '', titleJa: '' };
}

// scripts/refresh/voices/sources.ts
// ────────────────────────────────────────────────────────────────────────
// Source registry for the ministry voices pipeline (AI-related speeches).
//
// Sources (2026-08: MDDI + MAS + PMO):
//   - MDDI newsroom (kind 'newsroom-slug'): /newsroom/<slug>/ pages whose
//     slug names a SPEECH keyword. Legacy source — bare-slug speech ids.
//   - PMO newsroom (kind 'newsroom-slug'): same URL shape; ids prefixed
//     'pmo--'. The PMO sitemap's <lastmod> is useless as a date signal
//     (all 575 speech pages were bulk-touched 2026-07-30), so the
//     >=2026-01-01 intake floor is enforced post-fetch in run.ts.
//   - MAS speeches (kind 'speeches-path'): /news/speeches/<year>/<slug> —
//     EVERY URL under the path is a speech (slugs often name no speech
//     keyword), and the path year gives a free scan-time date floor
//     (minUrlYear). Ids prefixed 'mas--'.
//
// AI relevance is decided on content downstream (run.ts judge); the slug
// AI keywords below only mark high-confidence fast-passes.

export type SpeechMinistry = 'MDDI' | 'MAS' | 'PMO';

export interface VoicesSource {
  domain: string;
  label: string;
  ministry: SpeechMinistry;
  sitemapUrls: string[];
  /** Slug positive filter: URL must match at least one. */
  urlPatterns: RegExp[];
  /** Slug negative filter: URL must not match any. */
  urlExcludes?: RegExp[];
  /** 'newsroom-slug': speech-detection by SPEECH_SLUG_PATTERNS on the
   *  /newsroom/<slug>. 'speeches-path': every URL matched by urlPatterns
   *  is a speech. */
  kind: 'newsroom-slug' | 'speeches-path';
  /** Prefix for speech ids (e.g. 'mas--'). MUST stay in lockstep with
   *  src/data/speech-transcripts.ts speechIdFromUrl — pages derive the
   *  route id from the record URL through that function. */
  idPrefix?: string;
  /** Minimum publication year derivable from the URL path (MAS). URLs
   *  with a smaller year are dropped at scan time for free. */
  minUrlYear?: number;
}

export const SPEECH_SLUG_PATTERNS: RegExp[] = [
  /\bspeech\b/,
  /\baddress\b/,
  /\bremarks\b/,
  /\bkeynote\b/,
  /\btranscript\b/,
  // PMO publishes moderated on-stage conversations as transcripts
  // ("...-leaders-dialogue-fireside-chat"). Doorstops / press-conference
  // Q&As are deliberately NOT matched.
  /\bdialogue\b/,
  /fireside-chat/,
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
  { name: string; titleZh: string; titleEn: string; titleJa: string; titleKo: string }
> = {
  'chia-der-jiun': {
    name: 'Chia Der Jiun',
    titleZh: '新加坡金融管理局局长',
    titleEn: 'Managing Director, Monetary Authority of Singapore',
    titleJa: 'シンガポール金融管理局長官',
    titleKo: '싱가포르 통화청 총재',
  },
  'gan-kim-yong': {
    name: 'Gan Kim Yong',
    titleZh: '副总理兼贸工部长',
    titleEn: 'Deputy Prime Minister and Minister for Trade and Industry',
    titleJa: '副首相兼貿易産業相',
    titleKo: '부총리 겸 통상산업부 장관',
  },
  'janil-puthucheary': {
    name: 'Janil Puthucheary',
    titleZh: 'MDDI 前高级政务部长',
    titleEn: 'Former Senior Minister of State, MDDI',
    titleJa: 'MDDI 元上級政務部長',
    titleKo: 'MDDI 전 선임정무장관',
  },
  'jasmin-lau': {
    name: 'Jasmin Lau',
    titleZh: 'MDDI 政务次长',
    titleEn: 'Minister of State, MDDI',
    titleJa: 'MDDI 政務次官',
    titleKo: 'MDDI 정무차관',
  },
  'josephine-teo': {
    name: 'Josephine Teo',
    titleZh: '数码发展及新闻部长',
    titleEn: 'Minister for Digital Development and Information',
    titleJa: 'デジタル開発・ニュース相',
    titleKo: '디지털개발정보부 장관',
  },
  'lawrence-wong': {
    name: 'Lawrence Wong',
    titleZh: '总理兼财政部长',
    titleEn: 'Prime Minister and Minister for Finance',
    titleJa: '首相兼財務相',
    titleKo: '총리 겸 재무장관',
  },
  'lee-hsien-loong': {
    name: 'Lee Hsien Loong',
    titleZh: '国务资政',
    titleEn: 'Senior Minister',
    titleJa: '上級相',
    titleKo: '선임장관',
  },
  'rahayu-mahzam': {
    name: 'Rahayu Mahzam',
    titleZh: 'MDDI 政务次长',
    titleEn: 'Minister of State, MDDI',
    titleJa: 'MDDI 政務次官',
    titleKo: 'MDDI 정무차관',
  },
  'tan-kiat-how': {
    name: 'Tan Kiat How',
    titleZh: 'MDDI 高级政务部长',
    titleEn: 'Senior Minister of State, MDDI',
    titleJa: 'MDDI 上級政務部長',
    titleKo: 'MDDI 선임정무장관',
  },
};

export const VOICES_SOURCES: VoicesSource[] = [
  {
    domain: 'mddi.gov.sg',
    label: 'Ministry of Digital Development and Information',
    ministry: 'MDDI',
    sitemapUrls: ['https://www.mddi.gov.sg/sitemap.xml'],
    urlPatterns: [/\/newsroom\//],
    kind: 'newsroom-slug',
  },
  {
    domain: 'mas.gov.sg',
    label: 'Monetary Authority of Singapore',
    ministry: 'MAS',
    sitemapUrls: ['https://www.mas.gov.sg/sitemap.xml'],
    urlPatterns: [/\/news\/speeches\//],
    kind: 'speeches-path',
    idPrefix: 'mas--',
    // Path year gives a free date floor: /news/speeches/2026/<slug>.
    // 1,033 speeches back to 1997 — everything pre-2026 is out of intake
    // scope (no historical backfill for new sources).
    minUrlYear: 2026,
  },
  {
    domain: 'pmo.gov.sg',
    label: "Prime Minister's Office",
    ministry: 'PMO',
    sitemapUrls: ['https://www.pmo.gov.sg/sitemap.xml'],
    urlPatterns: [/\/newsroom\//],
    kind: 'newsroom-slug',
    idPrefix: 'pmo--',
  },
];

/** Ministry for a speech URL, by domain. Null when the URL belongs to
 *  none of the registered sources (emit treats that as a hard skip). */
export function ministryFromUrl(url: string): SpeechMinistry | null {
  if (/https?:\/\/(?:www\.)?mddi\.gov\.sg\//i.test(url)) return 'MDDI';
  if (/https?:\/\/(?:www\.)?mas\.gov\.sg\//i.test(url)) return 'MAS';
  if (/https?:\/\/(?:www\.)?pmo\.gov\.sg\//i.test(url)) return 'PMO';
  return null;
}

/** Returns the lower-case /newsroom/<slug>/ extracted from a URL,
 *  or null if not an MDDI newsroom URL. */
export function newsroomSlug(url: string): string | null {
  const m = url.toLowerCase().match(/\/newsroom\/([^/?#]+)/);
  return m ? m[1] : null;
}

/** A URL counts as a speech page if its slug matches at least one
 *  SPEECH_SLUG_PATTERNS entry — regardless of AI relevance. This is the
 *  coarse first-pass filter: it admits ALL ministerial speeches, then a
 *  downstream content-level AI judgement (run.ts) decides relevance.
 *  Splitting speech-detection from AI-detection is the fix for the
 *  2026-06 miss: speeches whose event name has no AI keyword in the slug
 *  (e.g. "asia-economic-summit") were wrongly dropped here. */
export function isSpeechUrl(url: string): boolean {
  const slug = newsroomSlug(url);
  if (!slug) return false;
  return SPEECH_SLUG_PATTERNS.some((re) => re.test(slug));
}

/** A URL counts as an AI-related speech if its slug matches at least
 *  one SPEECH_SLUG_PATTERNS and one AI_SLUG_PATTERNS entry. Used now as
 *  the high-confidence FAST-PASS signal (slug already names AI), not as
 *  a hard gate — see isSpeechUrl + the content judgement in run.ts. */
export function isAiSpeechUrl(url: string): boolean {
  const slug = newsroomSlug(url);
  if (!slug) return false;
  if (!SPEECH_SLUG_PATTERNS.some((re) => re.test(slug))) return false;
  if (!AI_SLUG_PATTERNS.some((re) => re.test(slug))) return false;
  return true;
}

/** Per-source slug extraction. newsroom-slug sources use the
 *  /newsroom/<slug> segment; speeches-path sources (MAS) use the
 *  /news/speeches/<year>/<slug> segment. Null when the URL doesn't
 *  match the source's shape. */
export function slugForSource(url: string, source: VoicesSource): string | null {
  if (source.kind === 'speeches-path') {
    const m = url.toLowerCase().match(/\/news\/speeches\/(\d{4})\/([^/?#]+)/);
    if (!m) return null;
    if (source.minUrlYear && Number(m[1]) < source.minUrlYear) return null;
    return m[2];
  }
  return newsroomSlug(url);
}

/** Speech id for a candidate URL under a given source: idPrefix + slug.
 *  Must agree with src/data/speech-transcripts.ts speechIdFromUrl. */
export function speechIdForSource(url: string, source: VoicesSource): string | null {
  const slug = slugForSource(url, source);
  return slug === null ? null : `${source.idPrefix ?? ''}${slug}`;
}

/** Per-source speech detection. speeches-path sources: every in-shape URL
 *  is a speech. newsroom-slug sources: the slug must name a SPEECH
 *  keyword (the MDDI/PMO newsroom mixes speeches with press releases). */
export function isSpeechUrlForSource(url: string, source: VoicesSource): boolean {
  const slug = slugForSource(url, source);
  if (slug === null) return false;
  if (source.kind === 'speeches-path') return true;
  return SPEECH_SLUG_PATTERNS.some((re) => re.test(slug));
}

/** Per-source AI fast-pass: the slug itself names AI. */
export function isAiSpeechUrlForSource(url: string, source: VoicesSource): boolean {
  if (!isSpeechUrlForSource(url, source)) return false;
  const slug = slugForSource(url, source);
  return slug !== null && AI_SLUG_PATTERNS.some((re) => re.test(slug));
}

/** Look up speaker metadata from a slug; case-insensitive substring match.
 *  Empty fields when no map entry hits — caller should fall back to AI
 *  summary or the page <h1>. */
export function speakerFromSlug(slug: string): {
  name: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
} {
  const lower = slug.toLowerCase();
  for (const [key, value] of Object.entries(SPEAKER_MAP)) {
    if (lower.includes(key)) return value;
  }
  return { name: '', titleZh: '', titleEn: '', titleJa: '', titleKo: '' };
}

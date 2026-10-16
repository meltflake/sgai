// scripts/refresh/signals/sources.ts
// ────────────────────────────────────────────────────────────────────────
// Where Signals candidates come from. Verified live on 2026-10-16:
//   ✅ businesstimes.com.sg/rss/technology   RSS, 16 items
//   ✅ aisingapore.org/feed/                  RSS (WordPress), paper posts excluded
//   ✅ channelnewsasia.com rss-outbound-feed  RSS, category 6511 = latest news
//   ✅ mddi.gov.sg/sitemap.xml                newsroom; speeches excluded (voices owns them)
//   ✅ imda.gov.sg/sitemap.xml                press releases; speeches excluded
//   ✅ mas.gov.sg/sitemap.xml                 media releases + PQ replies (year in path); no lastmod
//   ✅ edb.gov.sg/sitemap.xml                 /en/news-and-insights/; lastmod re-stamped, body date decides
//   ✅ a-star.edu.sg/sitemap.xml              news + press releases
//   ❌ techinasia.com/feed                    body paywalled, feed text ~130 chars (2026-10-17)
//   ❌ straitstimes.com                       RSS 400, sitemap-news 404
//   ❌ e27.co/feed                            403 (Cloudflare)
// Gov sitemaps re-stamp lastmod on old pages, so run.ts checks the body date.

export interface SignalSource {
  id: string;
  /** Publisher name written into Signal.sourceName (English, no CJK). */
  name: string;
  kind: 'rss' | 'sitemap';
  url: string;
  /** Must match url (+ title for RSS). Absent = admit all. */
  urlFilter?: RegExp;
  /** Drop speech / remarks / transcript pages (voices pipeline owns them). */
  excludeSpeeches?: boolean;
  /** Require an AI keyword in the title or URL slug (cheap pre-filter). */
  requireAiKeyword: boolean;
  rssCategoryExcludes?: string[];
  /** URLs carry a /20YY/ segment; drop years older than the window. */
  yearInPath?: boolean;
  /** Visible release-date pattern in the body (group 1 = "29 Sept 2026");
   *  wins over page metadata for sites that repost others' releases. */
  visibleDate?: RegExp;
}

export const SOURCES: SignalSource[] = [
  {
    id: 'bt',
    name: 'The Business Times',
    kind: 'rss',
    url: 'https://www.businesstimes.com.sg/rss/technology',
    requireAiKeyword: true,
  },
  {
    id: 'aisg',
    name: 'AI Singapore',
    kind: 'rss',
    url: 'https://aisingapore.org/feed/',
    requireAiKeyword: false,
    rssCategoryExcludes: ['AI Research'],
  },
  {
    id: 'cna',
    name: 'CNA',
    kind: 'rss',
    url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511',
    requireAiKeyword: true,
  },
  {
    id: 'mddi',
    name: 'MDDI',
    kind: 'sitemap',
    url: 'https://www.mddi.gov.sg/sitemap.xml',
    urlFilter: /^https:\/\/www\.mddi\.gov\.sg\/newsroom\/[^/]+\/?$/,
    excludeSpeeches: true,
    requireAiKeyword: true,
  },
  {
    id: 'imda',
    name: 'IMDA',
    kind: 'sitemap',
    url: 'https://www.imda.gov.sg/sitemap.xml',
    urlFilter: /\/resources\/press-releases-factsheets-and-speeches\/[^/]+\/?$/,
    excludeSpeeches: true,
    requireAiKeyword: true,
  },
  {
    id: 'mas',
    name: 'MAS',
    kind: 'sitemap',
    url: 'https://www.mas.gov.sg/sitemap.xml',
    urlFilter: /\/news\/(media-releases|parliamentary-replies)\/20\d\d\/[^/]+$/,
    requireAiKeyword: true,
    yearInPath: true,
  },
  {
    id: 'edb',
    name: 'EDB',
    kind: 'sitemap',
    url: 'https://www.edb.gov.sg/sitemap.xml',
    urlFilter: /^https:\/\/www\.edb\.gov\.sg\/en\/news-and-insights\/[^/]+$/,
    requireAiKeyword: true,
    // EDB reposts company releases; its metadata date is the repost day.
    visibleDate: /(\d{1,2} [A-Za-z]{3,9} 20\d\d)\s*•\s*\d+ min read/,
  },
  {
    id: 'astar',
    name: 'A*STAR',
    kind: 'sitemap',
    url: 'https://www.a-star.edu.sg/sitemap.xml',
    urlFilter: /\/(news|press-releases)\//,
    excludeSpeeches: true,
    requireAiKeyword: true,
    yearInPath: true,
  },
];

/** AI keywords for titles and URL slugs (hyphens count as word breaks). */
export const AI_KEYWORD =
  /\b(ai|a\.i\.|artificial[- ]intelligence|gen-?ai|generative|llms?|machine[- ]learning|deepfakes?|chatbots?|agentic|ai-agents?|data[- ]cent(re|er)s?|gpus?|nvidia|openai|anthropic|sea-lion|supercomput\w*|semiconductors?)\b/i;

export const SPEECH_SLUG =
  /(^|[-/])(speech|remarks|address|keynote|transcript|fireside|toast|eulogy|opening-statement|welcome-note)([-/]|$)/i;

/** Source-type priority when two candidates cover the same event. */
export function sourcePriority(url: string): number {
  let host = '';
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return 0;
  }
  if (host.endsWith('.gov.sg')) return 3;
  if (host.endsWith('aisingapore.org') || host.endsWith('.edu.sg') || host.endsWith('a-star.edu.sg')) return 2;
  return 1;
}

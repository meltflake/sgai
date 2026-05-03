// scripts/refresh/policies/sources.ts
// ────────────────────────────────────────────────────────────────────────
// Source registry for policies pipeline. Each entry says where to look
// for new AI-related policies on a given gov.sg domain.
//
// Two strategies per source:
//   - sitemap: parse sitemap.xml, filter URLs by `urlPatterns` regex
//   - listing: scrape a known announcement listing page for new article links
//
// At scan time we always try sitemap first (cheaper, more complete),
// listing as fallback. Each candidate URL is then filtered by
// `aiKeywordRegex` against its slug + scraped title.

export interface PolicySource {
  /** Unique key, used in last_scan_state.json. */
  domain: string;
  /** Display name for logs / emails. */
  label: string;
  /** Default category for this source's announcements. AI summarizer can override. */
  defaultCategory: '国家战略' | '治理框架' | '行业监管' | '预算与资金' | '国际合作';
  defaultSource: string;
  defaultSourceEn: string;
  defaultSourceOrgUrl: string;
  defaultMinistry?: string;
  /** Sitemap URL(s) to consult. */
  sitemapUrls?: string[];
  /** Listing page URLs to scrape for new article links (fallback / supplement). */
  listingUrls?: string[];
  /** URL slug patterns that look like policy / news pages (positive filter). */
  urlPatterns: RegExp[];
  /** URL slug patterns to exclude (e.g. event pages, tag indexes). */
  urlExcludes?: RegExp[];
}

const AI_SLUG_KEYWORDS = /(ai|artificial-intelligence|machine-learning|deepfake|smart-nation|data-centre|generative|llm|compute|robotic|autonomous|digital-economy|cybersecurity|data-protect)/i;

export const POLICY_SOURCES: PolicySource[] = [
  {
    domain: 'smartnation.gov.sg',
    label: 'Smart Nation Singapore',
    defaultCategory: '国家战略',
    defaultSource: '智慧国家与数字政府办公室 (SNDGO)',
    defaultSourceEn: 'Smart Nation and Digital Government Office (SNDGO)',
    defaultSourceOrgUrl: 'https://www.smartnation.gov.sg/',
    sitemapUrls: ['https://www.smartnation.gov.sg/sitemap.xml'],
    urlPatterns: [/\/initiatives\//, /\/news\//, /\/media-room\//, AI_SLUG_KEYWORDS],
    urlExcludes: [/\/tags?\//, /\/page\//],
  },
  {
    domain: 'mddi.gov.sg',
    label: 'Ministry of Digital Development and Information',
    defaultCategory: '国家战略',
    defaultSource: '数字发展与信息部 (MDDI)',
    defaultSourceEn: 'Ministry of Digital Development and Information (MDDI)',
    defaultSourceOrgUrl: 'https://www.mddi.gov.sg/',
    defaultMinistry: 'MDDI',
    sitemapUrls: ['https://www.mddi.gov.sg/sitemap.xml'],
    listingUrls: ['https://www.mddi.gov.sg/newsroom/'],
    urlPatterns: [/\/newsroom\//, /\/press-releases\//, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'imda.gov.sg',
    label: 'IMDA',
    defaultCategory: '治理框架',
    defaultSource: '资讯通信媒体发展局 (IMDA)',
    defaultSourceEn: 'Infocomm Media Development Authority (IMDA)',
    defaultSourceOrgUrl: 'https://www.imda.gov.sg/',
    sitemapUrls: ['https://www.imda.gov.sg/sitemap.xml'],
    listingUrls: ['https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches'],
    urlPatterns: [/\/news/, /\/press-release/, /\/resource/, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'aiverifyfoundation.sg',
    label: 'AI Verify Foundation',
    defaultCategory: '治理框架',
    defaultSource: 'AI Verify 基金会',
    defaultSourceEn: 'AI Verify Foundation',
    defaultSourceOrgUrl: 'https://aiverifyfoundation.sg/',
    sitemapUrls: ['https://aiverifyfoundation.sg/sitemap.xml'],
    urlPatterns: [/.*/],
  },
  {
    domain: 'mas.gov.sg',
    label: 'Monetary Authority of Singapore',
    defaultCategory: '行业监管',
    defaultSource: '金融管理局 (MAS)',
    defaultSourceEn: 'Monetary Authority of Singapore (MAS)',
    defaultSourceOrgUrl: 'https://www.mas.gov.sg/',
    defaultMinistry: 'MOF',
    sitemapUrls: ['https://www.mas.gov.sg/sitemap.xml'],
    listingUrls: ['https://www.mas.gov.sg/news'],
    urlPatterns: [/\/news\//, /\/regulation\//, /\/publications\//, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'pdpc.gov.sg',
    label: 'Personal Data Protection Commission',
    defaultCategory: '治理框架',
    defaultSource: '个人数据保护委员会 (PDPC)',
    defaultSourceEn: 'Personal Data Protection Commission (PDPC)',
    defaultSourceOrgUrl: 'https://www.pdpc.gov.sg/',
    sitemapUrls: ['https://www.pdpc.gov.sg/sitemap.xml'],
    urlPatterns: [/\/news/, /\/guidelines/, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'moh.gov.sg',
    label: 'Ministry of Health',
    defaultCategory: '行业监管',
    defaultSource: '卫生部 (MOH)',
    defaultSourceEn: 'Ministry of Health (MOH)',
    defaultSourceOrgUrl: 'https://www.moh.gov.sg/',
    defaultMinistry: 'MOH',
    sitemapUrls: ['https://www.moh.gov.sg/sitemap.xml'],
    urlPatterns: [/\/news\//, /\/announcements?/, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'nrf.gov.sg',
    label: 'National Research Foundation',
    defaultCategory: '预算与资金',
    defaultSource: '国家研究基金会 (NRF)',
    defaultSourceEn: 'National Research Foundation (NRF)',
    defaultSourceOrgUrl: 'https://www.nrf.gov.sg/',
    sitemapUrls: ['https://www.nrf.gov.sg/sitemap.xml'],
    urlPatterns: [/\/news/, /\/funding/, AI_SLUG_KEYWORDS],
  },
  {
    domain: 'mof.gov.sg',
    label: 'Ministry of Finance',
    defaultCategory: '预算与资金',
    defaultSource: '财政部 (MOF)',
    defaultSourceEn: 'Ministry of Finance (MOF)',
    defaultSourceOrgUrl: 'https://www.mof.gov.sg/',
    defaultMinistry: 'MOF',
    sitemapUrls: ['https://www.mof.gov.sg/sitemap.xml'],
    urlPatterns: [/\/news/, /\/budget/, AI_SLUG_KEYWORDS],
  },
];

export const POLICY_CATEGORIES = ['国家战略', '治理框架', '行业监管', '预算与资金', '国际合作'] as const;
export type PolicyCategoryName = (typeof POLICY_CATEGORIES)[number];

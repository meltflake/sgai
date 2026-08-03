// scripts/refresh/reg-lookahead/consultations.ts
// ────────────────────────────────────────────────────────────────────────
// Discover AI-relevant public consultations across IMDA / PDPC / MDDI.
// Sitemap-driven (all three verified server-rendered); the DIB precedent
// arrived via the MDDI sitemap. Page-level AI relevance + deadline
// extraction happen in run.ts (judge + one haiku call per NEW item).

import { listSitemap } from '../../lib/gov-fetch.ts';
import { isGenericOrLanding, normalizeUrl } from '../../lib/scan-filters.ts';

export interface ConsultationSource {
  agency: 'IMDA' | 'PDPC' | 'MDDI';
  sitemapUrl: string;
  /** URL must match to be considered a consultation page. */
  urlPattern: RegExp;
}

export const CONSULTATION_SOURCES: ConsultationSource[] = [
  {
    // IMDA announces each consultation as a press release
    // (…/press-releases-factsheets-and-speeches/…-public-consultation-…);
    // the /regulations…/consultations paths are section shells and the
    // committee pages (consultation-with-committees) are structural — the
    // 2026-08-03 live e2e captured one of those before this tightening.
    agency: 'IMDA',
    sitemapUrl: 'https://www.imda.gov.sg/sitemap.xml',
    urlPattern: /press-releases[^/]*\/.*consultation/i,
  },
  {
    agency: 'PDPC',
    sitemapUrl: 'https://www.pdpc.gov.sg/sitemap.xml',
    urlPattern: /(public-consultation|consultation-on)/i,
  },
  {
    agency: 'MDDI',
    sitemapUrl: 'https://www.mddi.gov.sg/sitemap.xml',
    urlPattern: /consultation/i,
  },
];

/** AI-ish slug prefilter before spending fetch + judge on a page. Broad —
 *  the judge is the real gate; this only trims obviously unrelated
 *  consultations (postal rates, spectrum fees...). */
export const CONSULTATION_PREFILTER =
  /(\bai\b|-ai-|artificial|data|digital|online|cyber|generative|algorithm|automated|platform|infrastructure|media|content)/i;

export interface ConsultationCandidate {
  agency: ConsultationSource['agency'];
  url: string;
  slug: string;
}

export async function scanConsultations(existingIds: Set<string>): Promise<ConsultationCandidate[]> {
  const out: ConsultationCandidate[] = [];
  const seen = new Set<string>();
  for (const source of CONSULTATION_SOURCES) {
    try {
      const urls = await listSitemap(source.sitemapUrl);
      for (const url of urls) {
        if (!source.urlPattern.test(url)) continue;
        if (!CONSULTATION_PREFILTER.test(url)) continue;
        if (isGenericOrLanding(url)) continue;
        const slug = slugFromUrl(url);
        if (!slug || existingIds.has(slug) || seen.has(slug)) continue;
        seen.add(slug);
        out.push({ agency: source.agency, url: normalizeTrailingSlash(url), slug });
      }
    } catch {
      /* source down this week — next run catches up */
    }
  }
  return out;
}

export function slugFromUrl(url: string): string | null {
  try {
    const path = new URL(normalizeUrl(url)).pathname.replace(/\/+$/, '');
    const seg = path.split('/').pop() || '';
    return seg.length >= 8 ? seg.slice(0, 90) : null;
  } catch {
    return null;
  }
}

function normalizeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

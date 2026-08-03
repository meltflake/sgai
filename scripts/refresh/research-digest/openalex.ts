// scripts/refresh/research-digest/openalex.ts
// ────────────────────────────────────────────────────────────────────────
// OpenAlex client + deterministic prefilter/ranking for the monthly SG AI
// research digest. OpenAlex's SG filter matches ANY author affiliation
// (~600 works/month), so notability shaping happens here before any LLM:
//   prefilter: first-author SG OR SG-authorship share >= 0.3
//   rank:      venue strength + citations + sgShare + SG-last-author bonus
// The LLM triage (triage.ts) only ever sees the ~40 top-ranked survivors.

const API = 'https://api.openalex.org/works';
/** Polite-pool identification — OpenAlex grants 100k req/day with mailto. */
const MAILTO = 'wulujia@gmail.com';
/** AI concept id (artificial intelligence) in OpenAlex's taxonomy. */
const AI_CONCEPT = 'C154945302';

export interface OaWork {
  id: string;
  doi?: string | null;
  title?: string | null;
  publication_date?: string | null;
  cited_by_count?: number | null;
  primary_location?: { source?: { display_name?: string | null } | null } | null;
  authorships?: Array<{
    author_position?: string | null;
    institutions?: Array<{ display_name?: string | null; country_code?: string | null }> | null;
  }> | null;
  abstract_inverted_index?: Record<string, number[]> | null;
}

export interface RankedWork {
  id: string;
  doi?: string;
  title: string;
  venue: string;
  publicationDate: string;
  citations: number;
  sgShare: number;
  sgFirstAuthor: boolean;
  sgLastAuthor: boolean;
  sgInstitutions: string[];
  abstract: string;
  score: number;
}

/** Strong-venue matchers (case-insensitive). Substrings for the
 *  unambiguous ML-venue names; EXACT names for Nature/Science/Cell — a
 *  bare 'science' substring matched "Lecture notes in computer science"
 *  and "Journal of Information Science" in the first dry-run, flattening
 *  every score to the same value. */
const STRONG_VENUE_SUBSTRINGS = [
  'neurips', 'neural information processing',
  'icml', 'international conference on machine learning',
  'iclr', 'emnlp', 'naacl', 'cvpr', 'iccv', 'eccv', 'aaai', 'ijcai',
  'transactions on pattern analysis', 'jmlr', 'journal of machine learning research',
];
const STRONG_VENUE_EXACT = ['nature', 'science', 'cell', 'nature machine intelligence', 'nature communications'];

function isStrongVenue(venue: string): boolean {
  const v = venue.toLowerCase().trim();
  return STRONG_VENUE_SUBSTRINGS.some((s) => v.includes(s)) || STRONG_VENUE_EXACT.includes(v);
}

export async function fetchMonthWorks(fromDate: string, toDate: string): Promise<OaWork[]> {
  const works: OaWork[] = [];
  let cursor = '*';
  for (let page = 0; page < 8 && cursor; page += 1) {
    const url =
      `${API}?filter=institutions.country_code:SG,concepts.id:${AI_CONCEPT},` +
      `from_publication_date:${fromDate},to_publication_date:${toDate}` +
      `&per-page=100&cursor=${encodeURIComponent(cursor)}&mailto=${MAILTO}` +
      `&select=id,doi,title,publication_date,cited_by_count,primary_location,authorships,abstract_inverted_index`;
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (r.status === 429) {
      await new Promise((res) => setTimeout(res, 5000));
      page -= 1;
      continue;
    }
    if (!r.ok) throw new Error(`OpenAlex HTTP ${r.status}`);
    const data = (await r.json()) as { results?: OaWork[]; meta?: { next_cursor?: string | null } };
    if (!Array.isArray(data.results)) throw new Error('OpenAlex schema drift: missing results');
    works.push(...data.results);
    cursor = data.meta?.next_cursor ?? '';
    if (data.results.length === 0) break;
    await new Promise((res) => setTimeout(res, 250));
  }
  return works;
}

export function reconstructAbstract(inv?: Record<string, number[]> | null, cap = 1200): string {
  if (!inv) return '';
  const slots: string[] = [];
  for (const [word, positions] of Object.entries(inv)) {
    for (const p of positions) slots[p] = word;
  }
  return slots.filter(Boolean).join(' ').slice(0, cap);
}

function isSg(inst: { country_code?: string | null } | null | undefined): boolean {
  return inst?.country_code === 'SG';
}

export function rankWorks(works: OaWork[]): RankedWork[] {
  const ranked: RankedWork[] = [];
  for (const w of works) {
    if (!w.title || !w.authorships || w.authorships.length === 0) continue;
    const auths = w.authorships;
    const sgCount = auths.filter((a) => (a.institutions ?? []).some(isSg)).length;
    const sgShare = sgCount / auths.length;
    const first = auths.find((a) => a.author_position === 'first') ?? auths[0];
    const last = auths.find((a) => a.author_position === 'last') ?? auths[auths.length - 1];
    const sgFirstAuthor = (first.institutions ?? []).some(isSg);
    const sgLastAuthor = (last.institutions ?? []).some(isSg);
    // Deterministic prefilter: SG-led or substantially SG.
    if (!sgFirstAuthor && sgShare < 0.3) continue;

    const venue = w.primary_location?.source?.display_name ?? '';
    const venueStrong = isStrongVenue(venue);
    const citations = w.cited_by_count ?? 0;
    const sgInstitutions = [
      ...new Set(
        auths
          .flatMap((a) => a.institutions ?? [])
          .filter(isSg)
          .map((i) => i.display_name ?? '')
          .filter(Boolean)
      ),
    ];
    const score =
      (venueStrong ? 40 : 0) +
      Math.min(30, citations * 3) +
      sgShare * 20 +
      (sgFirstAuthor ? 10 : 0) +
      (sgLastAuthor ? 10 : 0);
    ranked.push({
      id: w.id,
      doi: w.doi ?? undefined,
      title: w.title,
      venue,
      publicationDate: w.publication_date ?? '',
      citations,
      sgShare: Number(sgShare.toFixed(2)),
      sgFirstAuthor,
      sgLastAuthor,
      sgInstitutions,
      abstract: reconstructAbstract(w.abstract_inverted_index),
      score,
    });
  }
  // Preprint/version duplicates (same title on Zenodo + venue) collapse to
  // the higher-scored copy.
  ranked.sort((a, b) => b.score - a.score);
  const seenTitles = new Set<string>();
  return ranked.filter((w) => {
    const key = w.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });
}

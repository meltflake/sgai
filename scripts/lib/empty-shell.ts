// scripts/lib/empty-shell.ts
// ────────────────────────────────────────────────────────────────────────
// Empty-shell guard for govFetch + summarizePage pipelines.
//
// `govFetch` (lib/gov-fetch.ts) is a plain HTTP fetch — it cannot run the
// client-side JS that some .gov.sg pages (notably several IMDA programme
// pages) use to render their body. On those pages it captures only the
// navigation shell, and `summarizePage` (lib/ai-summarize.ts) then
// faithfully produces a description that *describes the emptiness*
// ("page content could not be retrieved", "仅包含导航元素", "loading
// state" …). Those descriptions are valid prose, so the i18n/confidence
// gates don't catch them, and the empty shells get committed — see PR #64
// (2026-06-19), closed for exactly this.
//
// Any pipeline that pairs govFetch with summarizePage (levers, startups,
// ecosystem, policies, legal-ai, talent, tracker, benchmarking) shares
// this risk. Run each enriched candidate through `isEmptyShellSummary`
// and drop the ones that match before injecting into a data file.

export interface EmptyShellInput {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
}

// Markers that a summary is describing an unfetchable / client-rendered /
// navigation-only page rather than real content. Kept deliberately
// multi-word so legitimate prose that merely mentions "load" or "navigate"
// as subject matter does not trip the guard.
const SHELL_PATTERNS: RegExp[] = [
  // English — fetch / load failures.
  /could not be (retrieved|loaded|fetched|accessed|displayed)/i,
  /(unable|failed) to (retrieve|load|fetch|access|display)/i,
  /(content|page) (is |was )?(not available|unavailable)/i,
  /no (readable|meaningful|substantive|actual) content/i,
  // English — client-render / nav-only shells.
  /navigation (only|elements?|links?|menu|bar)/i,
  /only .{0,12}navigation/i,
  /(loading|placeholder) (state|screen|content|page|text)/i,
  /requires? javascript|enable javascript|javascript (is )?(required|disabled)/i,
  /just a moment/i, // Cloudflare interstitial title
  // Chinese — fetch / load failures.
  /无法(获取|加载|访问|读取|显示|抓取)/,
  /未能(加载|获取|读取|抓取)/,
  /(加载|获取|读取|抓取)失败/,
  /内容(无法|未能|不可)/,
  // Chinese — nav-only shells.
  /(仅|只|仅有|只有|仅包含|只包含).{0,8}导航/,
  /导航(元素|菜单|链接|栏)/,
  /需要(启用)?\s*javascript/i,
];

/**
 * True when any title/description field looks like it was generated from an
 * empty / navigation-only / unfetchable page. Accepts any object with the
 * standard bilingual summary fields (extra fields ignored), so a full
 * `BilingualSummary` can be passed directly.
 */
export function isEmptyShellSummary(input: EmptyShellInput): boolean {
  const haystack = [input.title, input.titleEn, input.description, input.descriptionEn]
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .join('\n');
  if (!haystack) return false;
  return SHELL_PATTERNS.some((re) => re.test(haystack));
}

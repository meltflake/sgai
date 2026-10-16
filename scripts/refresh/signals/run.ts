// scripts/refresh/signals/run.ts
// ────────────────────────────────────────────────────────────────────────
// Weekly Signals pipeline (spec: docs/signals/spec.md).
//
//   scan (feeds + sitemaps, cheap filters)
//   → fetch body, resolve publication date, window gate
//   → judge (Claude: Singapore? AI? score 1-5, zh headline, topics, event key)
//   → select (score >= 4, one item per event, gov.sg first)
//   → draft (whyItMatters four languages, titles zh → en / ja / ko)
//   → related links (deterministic name match) → URL check
//   → insert into src/data/signals.ts → Prettier → i18n-pair rollback gate
//   → autoCommit + PR
//
// Rejected candidates (not SG, not AI, score < 4) go to
// scripts/refresh/signals/data/rejected-urls.json so they never return.
//
// CLI: --dry-run (stop after select, no drafting, no writes)
//      --limit=N (default 8) --days=N (default 7) --max-judge=N (default 40)
//      --no-commit --no-push
// Last stdout line: JSON report for scripts/auto_update.py.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ensureClaudeAuthed } from '../../lib/llm.ts';
import { govFetch } from '../../lib/gov-fetch.ts';
import { parseDateLoose } from '../../lib/stale-gate.ts';
import { mergeRejectedUrls, rejectedUrlsPath, loadRejectedUrls, type RejectedUrl } from '../../lib/rejected-urls.ts';
import { translateBatch } from '../../lib/translate.ts';
import { draftWhyItMattersBatch } from '../../lib/why-it-matters-batch.ts';
import type { WhyInput } from '../../lib/why-it-matters.ts';
import { validateUrls } from '../../lib/url-check.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { topics } from '../../../src/data/topics.ts';
import { people } from '../../../src/data/people.ts';
import { ecosystemEntityPages, startupEntityPages } from '../../../src/utils/entity-pages.ts';
import type { Signal, SignalRelated } from '../../../src/data/signals.ts';

import { SOURCES, sourcePriority } from './sources.ts';
import { decodeEntities, scanAll, type SignalCandidate } from './scan.ts';
import { judgeCandidate } from './judge.ts';
import { selectSignals, withinWindow, type Judged } from './select.ts';
import { insertSignals, signalId } from './emit.ts';

const DOMAIN = 'signals';
const SIGNALS_TS = resolve('src/data/signals.ts');
const DATA_DIR = resolve('scripts/refresh/signals/data');
const JUDGE_CACHE = resolve(DATA_DIR, 'judgments');
const LEDGER = rejectedUrlsPath(DOMAIN);
/** Upper bound on page fetches per run (sitemaps with re-stamped lastmod can list hundreds). */
const MAX_FETCH = 250;
const KNOWN_URL_FILES = ['src/data/signals.ts', 'src/data/voices.ts', 'src/data/videos.ts', 'src/data/policies.ts'];

interface Flags {
  dryRun: boolean;
  noCommit: boolean;
  noPush: boolean;
  limit: number;
  days: number;
  maxJudge: number;
}

function parseFlags(argv = process.argv.slice(2)): Flags {
  const num = (name: string, dflt: number): number => {
    const a = argv.find((x) => x.startsWith(`--${name}=`));
    const n = a ? Number(a.split('=')[1]) : dflt;
    return Number.isFinite(n) && n > 0 ? n : dflt;
  };
  return {
    dryRun: argv.includes('--dry-run'),
    noCommit: argv.includes('--no-commit'),
    noPush: argv.includes('--no-push'),
    limit: num('limit', 8),
    days: num('days', 7),
    maxJudge: num('max-judge', 40),
  };
}

function report(fields: Record<string, unknown>): void {
  process.stdout.write('\n' + JSON.stringify(fields) + '\n');
}

function log(line: string): void {
  process.stdout.write(line + '\n');
}

/** Today in Singapore, YYYY-MM-DD (the cron machine may sit in another zone). */
function todaySg(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date());
}

function knownUrls(): Set<string> {
  const out = new Set<string>();
  for (const f of KNOWN_URL_FILES) {
    if (!existsSync(f)) continue;
    for (const m of readFileSync(f, 'utf8').matchAll(/(?:sourceUrl|url):\s*'(https?:\/\/[^']+)'/g)) out.add(m[1]);
  }
  mergeRejectedUrls(DOMAIN, out);
  return out;
}

function appendRejected(entries: RejectedUrl[]): void {
  if (entries.length === 0) return;
  const existing = loadRejectedUrls(DOMAIN);
  const have = new Set(existing.map((e) => e.url));
  const merged = [...existing, ...entries.filter((e) => !have.has(e.url))];
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LEDGER, JSON.stringify(merged, null, 2) + '\n');
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LATIN = /^[A-Za-z0-9 .&'()-]+$/;

/** Deterministic related-entity match on headline + lead text. At most 3. */
function findRelated(text: string): SignalRelated[] {
  const out: SignalRelated[] = [];
  const has = (name: string): boolean => new RegExp(`(^|[^A-Za-z0-9])${escapeRe(name)}([^A-Za-z0-9]|$)`).test(text);
  for (const p of people) {
    const n = p.nameEn;
    if (n && n.trim().includes(' ') && has(n)) out.push({ kind: 'person', id: p.id });
  }
  for (const pg of ecosystemEntityPages) {
    const n = pg.entity.nameEn || pg.entity.name;
    if (n && LATIN.test(n) && n.length >= 6 && has(n)) out.push({ kind: 'ecosystem', id: pg.slug });
  }
  for (const pg of startupEntityPages) {
    const n = pg.name;
    if (n && LATIN.test(n) && n.length >= 4 && has(n)) out.push({ kind: 'startup', id: pg.slug });
  }
  const seen = new Set<string>();
  return out.filter((r) => !seen.has(`${r.kind}:${r.id}`) && seen.add(`${r.kind}:${r.id}`)).slice(0, 3);
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();
  const today = todaySg();
  log(`\n[signals] starting (today ${today}, window ${flags.days} days, limit ${flags.limit})`);

  ensureClaudeAuthed();
  log('  preflight: claude auth OK');

  // 1. Scan.
  const scan = await scanAll(SOURCES, { today, days: flags.days, known: knownUrls() });
  log(`  scan: ${scan.candidates.length} candidate(s) from ${scan.checked} feed item(s)`);
  for (const f of scan.failures) log(`  ! source ${f.sourceId} failed: ${f.error}`);

  // 2. Fetch every candidate body and keep only in-window ones, then spend
  //    the judging budget on the best sources first (gov.sg > institutions
  //    > media), newest first. Fetching is cheap; judging costs a model call.
  const fetched = await mapLimit(scan.candidates.slice(0, MAX_FETCH), 4, async (c) => {
    const f = await fetchCandidate(c, today, flags.days);
    return f ? { c: { ...c, title: f.title }, f } : null;
  });
  const queue = fetched
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => sourcePriority(b.c.url) - sourcePriority(a.c.url) || b.f.date.localeCompare(a.f.date));
  log(`  in window: ${queue.length} of ${Math.min(scan.candidates.length, MAX_FETCH)} fetched; judging up to ${flags.maxJudge}`);

  const judged: Judged[] = [];
  const rejected: RejectedUrl[] = [];
  let judgeFailures = 0;
  for (const { c, f } of queue.slice(0, flags.maxJudge)) {
    const j = await judgeCandidate(
      { title: f.title, sourceName: c.sourceName, date: f.date, url: c.url, content: f.text },
      topics,
      { cacheDir: JUDGE_CACHE }
    ).catch((e: unknown) => {
      log(`    ! judge error ${c.url}: ${e instanceof Error ? e.message.slice(0, 160) : String(e)}`);
      return null;
    });
    if (!j) {
      judgeFailures += 1;
      continue;
    }
    log(`    [${j.score}] sg=${j.singapore ? 'y' : 'n'} ai=${j.ai ? 'y' : 'n'} ${f.date} ${c.sourceName}: ${f.title}`);
    const reason = !j.singapore ? 'non-sg' : !j.ai ? 'non-ai' : j.score < 4 ? 'low-signal' : '';
    if (reason) rejected.push({ url: c.url, reason, decidedAt: today, ref: `score ${j.score}: ${j.reason}`.slice(0, 200) });
    judged.push({ candidate: c, judgment: j, pageDate: f.date, contentText: f.text });
  }

  // 3. Select.
  const picked = selectSignals(judged, flags.limit);
  log(`\n  selected ${picked.length} of ${judged.length} judged:`);
  for (const p of picked) log(`    [${p.judgment.score}] ${p.pageDate} ${p.judgment.titleZh} — ${p.candidate.url}`);

  if (flags.dryRun) {
    log('\n[signals] dry-run: no drafting, no writes.');
    report({
      domain: DOMAIN,
      added: 0,
      selected: picked.length,
      judged: judged.length,
      failures: scan.failures.length + judgeFailures,
      reason: 'dry-run',
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    return;
  }

  appendRejected(rejected);

  if (picked.length === 0) {
    log('\n[signals] nothing to emit.');
    report({
      domain: DOMAIN,
      added: 0,
      failures: scan.failures.length + judgeFailures,
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    return;
  }

  // 4. Draft four-language fields. Any record missing a language is dropped.
  const records = await draft(picked, today);
  log(`\n  drafted ${records.length} of ${picked.length}`);

  // 5. URL check (rule #6).
  const broken = await validateUrls(records.map((r) => ({ url: r.sourceUrl, context: r.id })));
  const brokenSet = new Set(broken.map((b) => b.url));
  for (const b of broken) log(`  ! dropping ${b.context}: ${b.url} → ${b.status}`);
  const final = records.filter((r) => !brokenSet.has(r.sourceUrl));
  if (final.length === 0) {
    report({ domain: DOMAIN, added: 0, failures: picked.length, error: 'no record survived drafting / URL check', elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    process.exit(1);
  }

  // 6. Write, format, i18n gate.
  const before = readFileSync(SIGNALS_TS, 'utf8');
  const baseline = findUnpairedFields(SIGNALS_TS).length;
  writeFileSync(SIGNALS_TS, insertSignals(before, final));
  const fmt = spawnSync('npx', ['prettier', '--write', SIGNALS_TS], { encoding: 'utf8' });
  if (fmt.status !== 0) log(`  ! prettier failed: ${(fmt.stderr || '').slice(0, 200)}`);
  const after = findUnpairedFields(SIGNALS_TS);
  if (after.length > baseline) {
    writeFileSync(SIGNALS_TS, before);
    for (const u of after.slice(0, 10)) log(`  ✗ ${u.line} ${u.field} ${u.reason}`);
    report({ domain: DOMAIN, added: 0, failures: final.length, error: 'i18n-pair regression, rolled back', elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    process.exit(1);
  }
  log('  ✓ i18n-pair clean');

  if (flags.noCommit) {
    report({ domain: DOMAIN, added: final.length, failures: 0, reason: 'no-commit', elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    return;
  }

  // 7. Commit + PR.
  const files = ['src/data/signals.ts', ...(existsSync(LEDGER) ? ['scripts/refresh/signals/data/rejected-urls.json'] : [])];
  const commit = autoCommit({
    domain: DOMAIN,
    files,
    message: `data(signals): +${final.length} signal(s)\n\n${final.map((r) => `- ${r.title} (${r.sourceName})`).join('\n')}`,
    allowDirtyPaths: ['scripts/refresh/signals/data/', 'scripts/data/cache/', 'scripts/i18n/data/'],
  });
  let prUrl: string | null = null;
  if (!flags.noPush) {
    const byUrl = new Map(picked.map((p) => [p.candidate.url, p]));
    const pr = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] signals: +${final.length} signal(s)`,
      body: buildPRBody({
        domain: DOMAIN,
        diffStat: commit.diffStat,
        newEntries: final.map((r) => {
          const p = byUrl.get(r.sourceUrl);
          return {
            title: `[${p?.judgment.score ?? '?'}] ${r.title} — ${p?.judgment.reason ?? ''}`,
            sourceUrl: r.sourceUrl,
            confidence: (p?.judgment.score ?? 0) >= 5 ? ('high' as const) : ('medium' as const),
          };
        }),
        failedSources: scan.failures.map((f) => ({ url: f.sourceId, error: f.error })),
      }),
      labels: ['data-refresh'],
    });
    prUrl = pr.pr?.url ?? null;
    if (prUrl) log(`  PR opened: ${prUrl}`);
    else if (pr.error) log(`  ! PR step error: ${pr.error}`);
  }

  report({
    domain: DOMAIN,
    added: final.length,
    failures: scan.failures.length + judgeFailures,
    pr_url: prUrl,
    elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
  });
}

/** Fetch the page and resolve its publication date. Sitemap candidates
 *  need a page date (lastmod is not trusted); RSS ones may use pubDate. */
async function fetchCandidate(
  c: SignalCandidate,
  today: string,
  days: number
): Promise<{ title: string; date: string; text: string } | null> {
  try {
    const page = await govFetch(c.url, { retries: 2, timeoutMs: 20000 });
    const pageDate = parseDateLoose(page.publishedDate);
    const date = pageDate ?? (c.kind === 'rss' ? (c.hintedDate ?? null) : null);
    if (!withinWindow(date, today, days)) {
      return null;
    }
    const text = page.contentText || '';
    if (text.length < 300) {
      log(`    - skip (thin body ${text.length} chars): ${c.url}`);
      return null;
    }
    return { title: decodeEntities(c.title || page.title).replace(/\s*\|\s*[^|]+$/, ''), date: date!, text };
  } catch (e) {
    log(`    - skip (fetch ${e instanceof Error ? e.message.slice(0, 80) : String(e)}): ${c.url}`);
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function draft(picked: Judged[], today: string): Promise<Signal[]> {
  const existingIds = new Set([...readFileSync(SIGNALS_TS, 'utf8').matchAll(/id:\s*'(sig-[^']+)'/g)].map((m) => m[1]));
  const withIds = picked.map((p) => {
    const id = signalId(p.pageDate, p.judgment.eventKey, existingIds);
    existingIds.add(id);
    return { p, id };
  });

  const inputs: WhyInput[] = withIds.map(({ p, id }) => ({
    kind: 'signal',
    id,
    title: p.judgment.titleZh,
    date: p.pageDate,
    actors: p.candidate.sourceName,
    summary: `${p.candidate.title}. ${p.judgment.reason}`,
    detail: p.contentText.slice(0, 3000),
    sourceUrl: p.candidate.url,
  }));
  const why = await draftWhyItMattersBatch(inputs);

  const titlesZh = withIds.map(({ p }) => p.judgment.titleZh);
  const [en, ja, ko] = await Promise.all(
    (['zh→en', 'zh→ja', 'zh→ko'] as const).map((direction) =>
      translateBatch(titlesZh, { direction }).catch((e: unknown) => {
        log(`  ! title translation ${direction} failed: ${e instanceof Error ? e.message.slice(0, 120) : String(e)}`);
        return [] as string[];
      })
    )
  );

  const out: Signal[] = [];
  withIds.forEach(({ p, id }, i) => {
    const w = why.get(id);
    const t = [en[i], ja[i], ko[i]].map((x) => (x ?? '').trim());
    if (!w || t.some((x) => !x)) {
      log(`  ! dropping ${id}: missing ${!w ? 'whyItMatters' : 'title translation'}`);
      return;
    }
    const related = findRelated(`${p.candidate.title}\n${p.contentText.slice(0, 1500)}`);
    out.push({
      id,
      date: p.pageDate,
      title: p.judgment.titleZh,
      titleEn: t[0],
      titleJa: t[1],
      titleKo: t[2],
      whyItMatters: w.whyItMatters,
      whyItMattersEn: w.whyItMattersEn,
      whyItMattersJa: w.whyItMattersJa,
      whyItMattersKo: w.whyItMattersKo,
      sourceUrl: p.candidate.url,
      sourceName: p.candidate.sourceName,
      topicIds: p.judgment.topicIds,
      ...(related.length > 0 ? { related } : {}),
      addedAt: today,
    });
  });
  return out;
}

await main();

// scripts/refresh/reg-lookahead/run.ts
// ────────────────────────────────────────────────────────────────────────
// Weekly regulatory-lookahead orchestrator (source-expansion plan
// 2026-08-03). Two tracks, one data file, lifecycle-diff semantics:
//
//   Consultations: sitemap scan (IMDA/PDPC/MDDI) → judge AI relevance →
//     haiku metadata extraction (deadline) → 4-lang record appended.
//     Existing 'open' records past deadline → in-place close + history.
//   Bills: parse parliament.gov.sg bills-introduced (fixture-pinned
//     parser) → prefilter + judge NEW bills → append; KNOWN bills whose
//     stage advanced → in-place stage/date update + history. The git
//     diff of these edits ("stage: 'introduced' → 'passed'") is the
//     review surface.
//
// Judged-non-AI bills/consultations are cached in data/judged-non-ai.json
// (committed) so weekly runs never re-judge a cumulative list.
//
// CLI contract: --dry-run | --limit=N | --no-commit | --no-push.
// Dispatcher reads the LAST stdout line as JSON.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { govFetch } from '../../lib/gov-fetch.ts';
import { callLlmJson, ensureClaudeAuthed } from '../../lib/llm.ts';
import { judgeAiRelevance } from '../../lib/judge-ai-relevance.ts';
import { translateBatch } from '../../lib/translate.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import {
  consultations as existingConsultations,
  bills as existingBills,
  type BillItem,
} from '../../../src/data/reg-lookahead.ts';
import { scanConsultations } from './consultations.ts';
import { parseBillsPage, stageFromDates, slugifyBillTitle, BILL_PREFILTER, type ParsedBill } from './bills.ts';
import { appendRecord, updateRecordFields, formatConsultation, formatBill, q } from './emit.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JUDGED_CACHE = resolve(__dirname, 'data/judged-non-ai.json');
const BILLS_URL = 'https://www.parliament.gov.sg/parliamentary-business/bills-introduced';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 3,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
  };
}

function loadJudgedCache(): Record<string, string> {
  if (!existsSync(JUDGED_CACHE)) return {};
  try {
    return JSON.parse(readFileSync(JUDGED_CACHE, 'utf8'));
  } catch {
    return {};
  }
}

function saveJudgedCache(cache: Record<string, string>): void {
  mkdirSync(dirname(JUDGED_CACHE), { recursive: true });
  writeFileSync(JUDGED_CACHE, JSON.stringify(cache, null, 2) + '\n');
}

function report(fields: Record<string, unknown>): void {
  process.stdout.write('\n' + JSON.stringify(fields) + '\n');
}

/** en → {zh, ja, ko} for one string via the shared cached translator. */
async function toFourLang(en: string): Promise<{ zh: string; ja: string; ko: string }> {
  const [zh] = await translateBatch([en], { direction: 'en→zh' });
  const [ja] = await translateBatch([en], { direction: 'en→ja' });
  const [ko] = await translateBatch([en], { direction: 'en→ko' });
  return { zh: zh || en, ja: ja || en, ko: ko || en };
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  process.stdout.write('\n[reg-lookahead] starting\n');

  if (!flags.dryRun) ensureClaudeAuthed();

  const judged = loadJudgedCache();
  const changes: string[] = [];
  const failures: Array<{ url: string; error: string }> = [];

  // ── Track 1: consultations ──────────────────────────────────────────
  const existingIds = new Set(existingConsultations.map((c) => c.id));
  for (const [slug] of Object.entries(judged)) existingIds.add(slug);
  const candidates = await scanConsultations(existingIds);
  process.stdout.write(`  consultations: ${candidates.length} new candidate(s)\n`);
  for (const c of candidates.slice(0, flags.limit)) {
    process.stdout.write(`    [${c.agency}] ${c.url}\n`);
  }

  // Deadline-passed transitions (no network needed).
  const toClose = existingConsultations.filter(
    (c) => c.status === 'open' && c.deadline && c.deadline < today
  );

  if (flags.dryRun) {
    for (const c of toClose) process.stdout.write(`  would close: ${c.id} (deadline ${c.deadline})\n`);
    const parsed = await fetchBills();
    const knownBills = new Map(existingBills.map((b) => [b.id, b]));
    let newAi = 0;
    let transitions = 0;
    for (const pb of parsed) {
      if (!BILL_PREFILTER.test(pb.title)) continue;
      const id = slugifyBillTitle(pb.title);
      const known = knownBills.get(id);
      if (!known && !judged[id]) newAi += 1;
      else if (known && stageFromDates(pb) !== known.stage) transitions += 1;
    }
    process.stdout.write(`  bills: ${parsed.length} on page, ${newAi} new prefilter-pass, ${transitions} stage transition(s)\n`);
    process.stdout.write('\n[reg-lookahead] dry-run done.\n');
    report({ domain: 'reg-lookahead', added: 0, reason: 'dry-run', elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    return;
  }

  // Close expired consultations in place.
  for (const c of toClose) {
    updateRecordFields(c.id, { status: q('closed') }, 'statusHistory', `{ status: 'closed', observedAt: '${today}' },`);
    changes.push(`consultation ${c.id}: open → closed (deadline ${c.deadline})`);
  }

  // Admit new consultations (judge + extract + translate). Lookahead
  // tracks the CURRENT pipeline: pages published before the floor are
  // historical consultations (they belong to LegalItem history, not here)
  // — cached so they are never re-fetched.
  const CONSULTATION_FLOOR = '2026-01-01';
  let consultationsAdded = 0;
  for (const cand of candidates.slice(0, flags.limit)) {
    try {
      const page = await govFetch(cand.url, { retries: 2, sleepBetweenMs: 800 });
      if (page.publishedDate && page.publishedDate < CONSULTATION_FLOOR) {
        judged[cand.slug] = `historical (published ${page.publishedDate})`;
        continue;
      }
      const verdict = await judgeAiRelevance(
        { title: page.title, contentText: page.contentText, sourceUrl: cand.url },
        {
          kind: 'a government public-consultation page',
          scope:
            'AI, data, digital infrastructure, or online content regulation — proposals that would materially affect the Singapore AI ecosystem',
        }
      );
      if (!verdict.relevant && verdict.confidence === 'high') {
        judged[cand.slug] = `non-ai: ${verdict.reason.slice(0, 80)}`;
        continue;
      }
      // Deadline lives at the END of long consultation documents (the DIB
      // page states it in Part III) — a head-only slice missed it in the
      // first live e2e. Deterministic regex over the FULL text first;
      // LLM fallback sees head + tail windows.
      const regexDeadline = extractDeadlineFromText(page.contentText);
      const meta = await callLlmJson<{ deadline?: string; opensAt?: string; summaryEn?: string }>(
        `From this consultation page text, extract STRICT JSON {"deadline": "YYYY-MM-DD" | null, "opensAt": "YYYY-MM-DD" | null, "summaryEn": "<=2 sentences"}. Dates must be real dates stated on the page (submission deadline / opening date); null when unstated.\n\nTitle: ${page.title}\n\n${page.contentText.slice(0, 6000)}\n[...]\n${page.contentText.slice(-4000)}`,
        { systemPrompt: 'You extract structured metadata. Output strict JSON only.', model: 'haiku' }
      );
      if (regexDeadline && !meta.deadline) meta.deadline = regexDeadline;
      const dateOk = (d?: string | null) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
      const titleEn = page.title.replace(/\s*\|\s*[^|]+$/, '').trim() || page.title;
      const summaryEn = (meta.summaryEn || '').trim() || `Public consultation by ${cand.agency}. See the source page for details.`;
      const t4 = await toFourLang(titleEn);
      const s4 = await toFourLang(summaryEn);
      // Status: with a deadline, open/closed by date. Without one, never
      // claim 'open' unless the page itself is fresh (≤90 days) — an old
      // page with no stated deadline is a closed consultation, and a
      // wrongly-'open' record with no deadline can never self-close.
      const deadline = dateOk(meta.deadline);
      const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
      let status: 'open' | 'closed';
      if (deadline) status = deadline < today ? 'closed' : 'open';
      else status = page.publishedDate && page.publishedDate >= ninetyDaysAgo ? 'open' : 'closed';
      appendRecord(
        'consultations',
        formatConsultation({
          id: cand.slug,
          agency: cand.agency,
          title: t4.zh,
          titleEn,
          titleJa: t4.ja,
          titleKo: t4.ko,
          summary: s4.zh,
          summaryEn,
          summaryJa: s4.ja,
          summaryKo: s4.ko,
          status,
          opensAt: dateOk(meta.opensAt),
          deadline,
          observedAt: today,
          sourceUrl: cand.url,
          addedAt: today,
        })
      );
      consultationsAdded += 1;
      changes.push(`consultation +${cand.slug} [${cand.agency}]${meta.deadline ? ` deadline ${meta.deadline}` : ''}`);
    } catch (err) {
      failures.push({ url: cand.url, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // ── Track 2: bills ──────────────────────────────────────────────────
  let billsAdded = 0;
  let billTransitions = 0;
  try {
    const parsed = await fetchBills();
    const knownBills = new Map(existingBills.map((b) => [b.id, b]));
    for (const pb of parsed) {
      if (!BILL_PREFILTER.test(pb.title)) continue;
      const id = slugifyBillTitle(pb.title);
      const observedStage = stageFromDates(pb);
      const known = knownBills.get(id);
      if (known) {
        const updates = billFieldUpdates(known, pb, observedStage);
        if (Object.keys(updates).length > 0) {
          updateRecordFields(id, updates, 'stageHistory', `{ stage: '${observedStage}', observedAt: '${today}' },`);
          billTransitions += 1;
          changes.push(`bill ${id}: ${known.stage} → ${observedStage}`);
        }
        continue;
      }
      if (judged[id]) continue;
      const verdict = await judgeAiRelevance(
        { title: pb.title, contentText: `${pb.title}. Bill No ${pb.billNumber ?? '?'} before the Parliament of Singapore.`, sourceUrl: BILLS_URL },
        {
          kind: 'a bill before the Parliament of Singapore (title only)',
          scope:
            'legislation that materially affects AI, data, digital infrastructure, info-communications, or online content regulation in Singapore',
        }
      );
      // Fleet-standard fail-open rule: only a HIGH-confidence "no" drops
      // (and caches). A title-only judge is thin evidence — the first live
      // e2e dropped the IMDA Amendment Bill on a low-confidence wobble.
      if (!verdict.relevant && verdict.confidence === 'high') {
        judged[id] = `non-ai bill: ${verdict.reason.slice(0, 80)}`;
        continue;
      }
      const cls = await callLlmJson<{ summaryEn?: string; aiRelevance?: string }>(
        `For the Singapore bill titled "${pb.title}" (Bill ${pb.billNumber ?? '?'}), return STRICT JSON {"summaryEn": "<=2 sentences on what it likely regulates and why it matters for the AI/digital ecosystem", "aiRelevance": "core"|"adjacent"}. core = directly regulates AI/data/digital infrastructure; adjacent = materially affects the ecosystem.`,
        { systemPrompt: 'You are a Singapore tech-policy analyst. Output strict JSON only.', model: 'haiku' }
      );
      const summaryEn = (cls.summaryEn || '').trim() || `${pb.title}, before the Parliament of Singapore.`;
      const titleEn = pb.title;
      const t4 = await toFourLang(titleEn);
      const s4 = await toFourLang(summaryEn);
      appendRecord(
        'bills',
        formatBill({
          id,
          billNumber: pb.billNumber ? `Bill ${pb.billNumber}` : undefined,
          title: t4.zh,
          titleEn,
          titleJa: t4.ja,
          titleKo: t4.ko,
          summary: s4.zh,
          summaryEn,
          summaryJa: s4.ja,
          summaryKo: s4.ko,
          stage: observedStage,
          introducedAt: pb.introducedAt,
          secondReadingAt: pb.secondReadingAt,
          passedAt: pb.passedAt,
          aiRelevance: cls.aiRelevance === 'core' ? 'core' : 'adjacent',
          observedAt: today,
          sourceUrl: BILLS_URL,
          addedAt: today,
        })
      );
      billsAdded += 1;
      changes.push(`bill +${id} (${observedStage}${pb.billNumber ? `, Bill ${pb.billNumber}` : ''})`);
    }
  } catch (err) {
    failures.push({ url: BILLS_URL, error: err instanceof Error ? err.message : String(err) });
  }

  saveJudgedCache(judged);

  if (changes.length === 0) {
    process.stdout.write('\n[reg-lookahead] no changes this week.\n');
    report({ domain: 'reg-lookahead', added: 0, failures: failures.length, reason: 'no-changes', elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    return;
  }

  for (const c of changes) process.stdout.write(`  ✱ ${c}\n`);

  if (flags.noCommit) {
    process.stdout.write('\n--no-commit set; working tree left dirty for review.\n');
    report({ domain: 'reg-lookahead', added: consultationsAdded + billsAdded, transitions: billTransitions + toClose.length, reason: 'no-commit' });
    return;
  }

  const commit = autoCommit({
    domain: 'reg-lookahead',
    files: ['src/data/reg-lookahead.ts'],
    message: `data(reg-lookahead): ${changes.length} change(s)\n\n${changes.map((c) => `- ${c}`).join('\n')}`,
    allowDirtyPaths: ['scripts/refresh/reg-lookahead/data/'],
  });

  let prUrl = '';
  if (!flags.noPush) {
    const pr = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] reg-lookahead: ${changes.length} change(s)`,
      body: buildPRBody({
        domain: 'reg-lookahead',
        diffStat: commit.diffStat,
        newEntries: changes.map((c) => ({ title: c, sourceUrl: BILLS_URL, confidence: 'high' as const })),
        failedSources: failures,
      }),
      labels: ['data-refresh'],
    });
    if (pr.pr) {
      prUrl = pr.pr.url;
      process.stdout.write(`  PR: ${prUrl}\n`);
    } else if (pr.error) {
      process.stdout.write(`  ! PR step error: ${pr.error}\n`);
    }
  }

  report({
    domain: 'reg-lookahead',
    added: consultationsAdded + billsAdded,
    transitions: billTransitions + toClose.length,
    failures: failures.length,
    pr_url: prUrl || null,
    elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
  });
}

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
};

/** Deterministic submission-deadline extraction: "no later than 22 July
 *  2026", "by 5 August 2026", "close(s) on 12 September 2026". Last match
 *  wins (documents restate the deadline in their closing section). */
export function extractDeadlineFromText(text: string): string | undefined {
  const re = /(?:no later than|not later than|closes? on|deadline (?:of|is)|submitted by|reach [^.]{0,60}? by)\s+(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;
  let last: string | undefined;
  for (const m of text.matchAll(re)) {
    const mm = MONTHS[m[2].toLowerCase()];
    if (mm) last = `${m[3]}-${mm}-${m[1].padStart(2, '0')}`;
  }
  return last;
}

async function fetchBills(): Promise<ParsedBill[]> {
  const r = await fetch(BILLS_URL, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  if (!r.ok) throw new Error(`bills page HTTP ${r.status}`);
  const html = await r.text();
  const parsed = parseBillsPage(html);
  if (parsed.length === 0) throw new Error('bills parser returned 0 — layout drift? (fixture test pins the contract)');
  return parsed;
}

function billFieldUpdates(known: BillItem, pb: ParsedBill, observedStage: string): Record<string, string> {
  const updates: Record<string, string> = {};
  if (observedStage !== known.stage) updates.stage = q(observedStage);
  if (pb.secondReadingAt && !known.secondReadingAt) updates.secondReadingAt = q(pb.secondReadingAt);
  if (pb.passedAt && !known.passedAt) updates.passedAt = q(pb.passedAt);
  return updates;
}

await main();

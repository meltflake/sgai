// scripts/refresh/hansard/run.ts
// ────────────────────────────────────────────────────────────────────────
// Hansard auto-PR refresh pipeline.
//
// Replaces the legacy "scan-only-email" mode (auto_update.py:run_hansard)
// for the registry-driven cron path. Flow:
//
//   1. Load last_scan_state.json → {max_oral_id, max_written_id, max_budget_id}.
//   2. Scan SPRS API in three ID windows above each max_*.
//   3. classify() each (STRONG / INFRA+ / WEAK+ / INFRA / NO).
//   4. For STRONG candidates only: call claude CLI (lib/llm) to generate
//      a bilingual stub (zh title / zh+en summary / topics, ≤3 from a
//      closed taxonomy).
//   5. appendAutoDiscoveredDebates() → src/data/debates.ts gets a new
//      `autoDiscoveredDebates` export (or appends to it) at the END of
//      the file. Listing pages do NOT consume this array — review
//      happens in PR. After merge, reviewer "promotes" entries into the
//      main debates[] array (manual + Claude assist) per project workflow.
//   6. autoCommit + pushAndOpenPR. Cron user gets GitHub email/web
//      notification (assignee=@me).
//
// Why an `autoDiscovered` array instead of injecting the canonical
// debates[] array directly:
//   - Debate schema has 17+ fields (keyPoints / governmentStance /
//     oppositionStance / policySignal / notableQuote / controversyLevel
//     / transcriptEn / personIds…). Auto-generating all of them with
//     consistent quality is a research problem, not a cron problem.
//   - DEBATE_STATS would have to be auto-recomputed on every run, which
//     is fragile and noisy in PR diffs.
//   - The autoDiscovered approach matches talent / startups / benchmarking
//     pipelines: minimal stub pending human upgrade.
//
// CLI:
//   npx tsx scripts/refresh/hansard/run.ts                    # full run
//   npx tsx scripts/refresh/hansard/run.ts --dry-run          # scan + classify only
//   npx tsx scripts/refresh/hansard/run.ts --limit=3          # cap candidates
//   npx tsx scripts/refresh/hansard/run.ts --no-commit        # write file, skip git
//   npx tsx scripts/refresh/hansard/run.ts --no-push          # commit, skip push/PR
//   npx tsx scripts/refresh/hansard/run.ts --no-llm           # use placeholder summaries
//   npx tsx scripts/refresh/hansard/run.ts --skip-state-bump  # for testing only

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { callLlmJson } from '../../lib/llm.ts';
import { loadState, saveState } from '../../lib/state.ts';
import { classify, isAiRelated, type Bucket } from './classify.ts';

const SPRS_API = 'https://sprs.parl.gov.sg/search/getHansardTopic/';
const ORAL_RANGE = Number(process.env.HANSARD_ORAL_RANGE || 80);
const WRITTEN_RANGE = Number(process.env.HANSARD_WRITTEN_RANGE || 300);
const BUDGET_RANGE = Number(process.env.HANSARD_BUDGET_RANGE || 30);
const CONTENT_WINDOW = 8000;

const DEBATES_FILE = resolve('src/data/debates.ts');
const STATE_FILE = resolve('scripts/data/last_scan_state.json');

// Closed taxonomy — must mirror what existing debates.ts entries use so
// listing-page filters keep working when a reviewer promotes a stub.
const TOPIC_TAXONOMY = [
  'AI Economy & Industry',
  'AI & National Security',
  'AI Governance & Regulation',
  'AI in Public Sector',
  'AI Infrastructure & Research',
  'AI Safety & Ethics',
  'AI & Employment',
  'AI in Education',
  'AI in Healthcare',
  'AI Strategy',
  'Deepfakes & Disinformation',
] as const;

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  noLlm: boolean;
  skipStateBump: boolean;
  /** Include WEAK+ / INFRA+ buckets in actual emit. Default: STRONG only. */
  includeWeak: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 5,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    noLlm: flagSet.has('--no-llm'),
    skipStateBump: flagSet.has('--skip-state-bump'),
    includeWeak: flagSet.has('--include-weak'),
  };
}

// ── SPRS API ───────────────────────────────────────────────────────────

interface SprsTopic {
  reportId: string;
  title: string;
  date: string; // raw "DD-M-YYYY"
  reportType: string;
  contentHtml: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8216;|&#8217;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&rdquo;|&ldquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchTopic(reportId: string): Promise<SprsTopic | null> {
  let resp: Response;
  try {
    resp = await fetch(`${SPRS_API}?id=${encodeURIComponent(reportId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
  } catch {
    return null;
  }
  if (!resp.ok) return null;
  let data: unknown;
  try {
    data = await resp.json();
  } catch {
    return null;
  }
  const rh = (data as { resultHTML?: Record<string, unknown> }).resultHTML;
  if (!rh || typeof rh !== 'object' || !rh.title) return null;
  return {
    reportId,
    title: String(rh.title),
    date: String(rh.sittingDate || ''),
    reportType: String(rh.reportType || ''),
    contentHtml: String(rh.content || ''),
  };
}

interface ScanCandidate {
  id: string;
  title: string;
  dateRaw: string;
  dateIso: string | null;
  reportType: string;
  contentText: string;
  bucket: Bucket;
  strong: string[];
  infra: string[];
  weak: string[];
}

function parseSprsDate(raw: string): string | null {
  // SPRS sittingDate format: "DD-M-YYYY" or "D-M-YYYY"
  const m = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

async function scanRange(prefix: string, start: number, count: number): Promise<ScanCandidate[]> {
  const out: ScanCandidate[] = [];
  let consecutiveMisses = 0;
  for (let i = start + 1; i <= start + count; i += 1) {
    if (consecutiveMisses >= 30) {
      process.stderr.write(`  [${prefix}] 30 consecutive misses at ${i}, stopping range early.\n`);
      break;
    }
    const id = `${prefix}-${i}`;
    const topic = await fetchTopic(id);
    if (!topic) {
      consecutiveMisses += 1;
      continue;
    }
    consecutiveMisses = 0;
    const contentText = stripHtml(topic.contentHtml);
    const cls = classify(topic.title, contentText, CONTENT_WINDOW);
    out.push({
      id,
      title: topic.title,
      dateRaw: topic.date,
      dateIso: parseSprsDate(topic.date),
      reportType: topic.reportType,
      contentText,
      bucket: cls.bucket,
      strong: cls.strong,
      infra: cls.infra,
      weak: cls.weak,
    });
    // SPRS is generous on rate but be polite
    await new Promise((r) => setTimeout(r, 300));
  }
  return out;
}

function maxNumericId(prefix: string, candidates: ScanCandidate[], current: number): number {
  let m = current;
  for (const c of candidates) {
    const tail = c.id.replace(`${prefix}-`, '');
    const n = Number(tail);
    if (Number.isFinite(n)) m = Math.max(m, n);
  }
  return m;
}

// ── AI summary (stub generator) ────────────────────────────────────────

interface DebateStub {
  id: string;
  titleEn: string;
  title: string;
  date: string; // ISO
  type: 'Oral Answers to Questions' | 'Written Answers to Questions' | 'Budget' | 'Motions';
  topics: string[];
  summary: string;
  summaryEn: string;
  bucket: Bucket;
  signals: { strong: string[]; infra: string[]; weak: string[] };
  sourceUrl: string;
  discoveredAt: string;
}

function inferType(reportType: string, id: string): DebateStub['type'] {
  const rt = reportType.toLowerCase();
  if (rt.includes('oral')) return 'Oral Answers to Questions';
  if (rt.includes('written')) return 'Written Answers to Questions';
  if (rt.includes('motion')) return 'Motions';
  if (id.startsWith('oral-answer-')) return 'Oral Answers to Questions';
  if (id.startsWith('written-answer-')) return 'Written Answers to Questions';
  if (id.startsWith('motion-')) return 'Motions';
  return 'Budget';
}

const SUMMARY_SYSTEM_PROMPT = `You are an analyst building a Chinese-language Singapore-AI policy site. For each Hansard topic you receive (English transcript), produce a JSON record with these EXACT keys:

{
  "title": "中文 ≤22 字简体标题，反映核心议题，不抄英文",
  "summary": "中文摘要 100–160 字，覆盖：议员问什么、政府/部长答什么核心立场、与 AI / 算力 / 算法治理 / 数据主权 等 sgai 关注议题的关联。不抒情，不重复辩论日期。",
  "summaryEn": "English summary 80–130 words, same structure as zh: who asked / what the government said / the AI-policy angle. Use Singapore English conventions (PDPC / IMDA / MAS / MDDI etc).",
  "topics": ["≤3 个 closed-set topics"]
}

Closed taxonomy for "topics" (pick at most 3, ranked by relevance):
- "AI Economy & Industry"
- "AI & National Security"
- "AI Governance & Regulation"
- "AI in Public Sector"
- "AI Infrastructure & Research"
- "AI Safety & Ethics"
- "AI & Employment"
- "AI in Education"
- "AI in Healthcare"
- "AI Strategy"
- "Deepfakes & Disinformation"

Rules:
- Output JSON only, no commentary.
- Inside string TEXT, use FULL-WIDTH Chinese quotes (“…”) — never ASCII " — to avoid breaking JSON parsing.
- Do not invent facts not present in the transcript. If a field is hard to fill from the snippet, write it conservatively, not creatively.
- Keep zh and en parallel: same facts, no asymmetry.`;

interface AiStubFields {
  title: string;
  summary: string;
  summaryEn: string;
  topics: string[];
}

async function generateStub(c: ScanCandidate, opts: { useLlm: boolean }): Promise<AiStubFields> {
  if (!opts.useLlm) {
    // Placeholder so --no-llm runs end to end during tests
    return {
      title: `[待补充] ${c.title.slice(0, 40)}`,
      summary: `[待补充] ${c.title.slice(0, 80)}（来源：SPRS Hansard，待人工审阅后补全 zh 摘要）。`,
      summaryEn: `[Pending review] ${c.title.slice(0, 120)}. Auto-discovered SPRS Hansard entry — reviewer will hand-curate fields before promoting into the canonical debates[] array.`,
      topics: c.bucket === 'STRONG' ? ['AI Governance & Regulation'] : [],
    };
  }

  const userPrompt =
    `Hansard topic to summarise:\n` +
    `Title: ${c.title}\n` +
    `Date: ${c.dateIso || c.dateRaw}\n` +
    `Type: ${c.reportType}\n` +
    `Detected signals (for context, not for output): ${[...c.strong, ...c.infra, ...c.weak].join(', ') || 'none'}\n` +
    `\n` +
    `Transcript (first 6000 chars):\n${c.contentText.slice(0, 6000)}`;

  const parsed = await callLlmJson<{ title?: unknown; summary?: unknown; summaryEn?: unknown; topics?: unknown }>(
    userPrompt,
    {
      systemPrompt: SUMMARY_SYSTEM_PROMPT,
      model: process.env.SGAI_SUMMARIZE_MODEL || 'haiku',
    }
  );

  const title = typeof parsed.title === 'string' ? parsed.title : '';
  const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
  const summaryEn = typeof parsed.summaryEn === 'string' ? parsed.summaryEn : '';
  const rawTopics = Array.isArray(parsed.topics) ? parsed.topics : [];
  const topics = rawTopics
    .filter((t): t is string => typeof t === 'string')
    .filter((t) => (TOPIC_TAXONOMY as readonly string[]).includes(t))
    .slice(0, 3);

  if (!title || !summary || !summaryEn) {
    throw new Error(
      `LLM stub missing required fields for ${c.id}: title=${!!title} summary=${!!summary} summaryEn=${!!summaryEn}`
    );
  }
  return { title, summary, summaryEn, topics };
}

// ── Emit to debates.ts (autoDiscoveredDebates array) ───────────────────

const AUTODISC_INTERFACE = `
// ── Auto-discovered Hansard candidates (from scripts/refresh/hansard/run.ts) ──
// Cron-generated stubs awaiting reviewer promotion into the canonical
// \`debates[]\` array above. Listing pages do NOT consume this array.
// To promote: copy fields, fill keyPoints / stance / quote / transcript,
// add personIds via codemod, delete the stub here.
export interface AutoDiscoveredDebate {
  id: string;
  titleEn: string;
  title: string;
  /** ISO YYYY-MM-DD when parseable; raw SPRS DD-M-YYYY otherwise. */
  date: string;
  type: 'Oral Answers to Questions' | 'Written Answers to Questions' | 'Budget' | 'Motions';
  topics: string[];
  summary: string;
  summaryEn: string;
  /** Classifier signal level — STRONG | INFRA+ | WEAK+. */
  bucket: 'STRONG' | 'INFRA+' | 'WEAK+';
  signals: { strong: string[]; infra: string[]; weak: string[] };
  sourceUrl: string;
  discoveredAt: string;
}
`;

const AUTODISC_ARRAY_HEADER = `export const autoDiscoveredDebates: AutoDiscoveredDebate[] = [`;

function escapeBackticks(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function escapeSingle(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatStub(s: DebateStub): string {
  // Render a string array as a TS literal: ['a', 'b', 'c']. Each element is
  // wrapped in single quotes, with backslashes / single quotes inside the
  // value escaped per JS string literal rules.
  const stringArr = (arr: string[]) =>
    arr.length === 0 ? '[]' : `[${arr.map((x) => `'${escapeSingle(x)}'`).join(', ')}]`;
  // Free-form text fields (title / summary / summaryEn) use template
  // literals (backticks) so apostrophes don't need escaping; simple
  // ASCII-only fields use single quotes.
  const sigStr = stringArr(s.signals.strong);
  const infStr = stringArr(s.signals.infra);
  const wkStr = stringArr(s.signals.weak);
  const topicsStr = stringArr(s.topics);

  return [
    `  {`,
    `    id: '${s.id}',`,
    `    titleEn: \`${escapeBackticks(s.titleEn)}\`,`,
    `    title: \`${escapeBackticks(s.title)}\`,`,
    `    date: '${s.date}',`,
    `    type: '${s.type}',`,
    `    topics: ${topicsStr},`,
    `    summary: \`${escapeBackticks(s.summary)}\`,`,
    `    summaryEn: \`${escapeBackticks(s.summaryEn)}\`,`,
    `    bucket: '${s.bucket}',`,
    `    signals: { strong: ${sigStr}, infra: ${infStr}, weak: ${wkStr} },`,
    `    sourceUrl: '${s.sourceUrl}',`,
    `    discoveredAt: '${s.discoveredAt}',`,
    `  },`,
  ].join('\n');
}

function appendAutoDiscoveredDebates(filePath: string, stubs: DebateStub[]): { added: number; created: boolean } {
  if (stubs.length === 0) return { added: 0, created: false };
  if (!existsSync(filePath)) throw new Error(`debates.ts not found at ${filePath}`);

  const original = readFileSync(filePath, 'utf8');
  const formatted = stubs.map(formatStub).join('\n');

  const arrayCloseRe = /export const autoDiscoveredDebates:\s*AutoDiscoveredDebate\[\]\s*=\s*\[([\s\S]*?)\n\];/;
  const m = original.match(arrayCloseRe);
  let updated: string;
  let created = false;

  if (m) {
    const body = m[1];
    const newBody = body.endsWith('\n') ? `${body}${formatted}` : `${body}\n${formatted}`;
    updated = original.replace(
      arrayCloseRe,
      `export const autoDiscoveredDebates: AutoDiscoveredDebate[] = [${newBody}\n];`
    );
  } else {
    const tail = original.endsWith('\n') ? original : `${original}\n`;
    updated = `${tail}${AUTODISC_INTERFACE}\n${AUTODISC_ARRAY_HEADER}\n${formatted}\n];\n`;
    created = true;
  }

  writeFileSync(filePath, updated);
  return { added: stubs.length, created };
}

// ── Existing-id dedupe ─────────────────────────────────────────────────

function readExistingDebateIds(filePath: string): Set<string> {
  const src = readFileSync(filePath, 'utf8');
  const ids = new Set<string>();
  for (const m of src.matchAll(/\bid:\s*'([\w-]+-\d+)'/g)) ids.add(m[1]);
  return ids;
}

// ── Main ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[hansard-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan + classify only, no AI / emit / git\n');
  if (flags.noLlm) process.stdout.write('  --no-llm: placeholder summaries instead of claude CLI\n');

  // 1. Existing IDs (dedupe set across both main debates[] and autoDiscoveredDebates[]).
  const existingIds = readExistingDebateIds(DEBATES_FILE);
  process.stdout.write(`  existing debate IDs: ${existingIds.size}\n`);

  // 2. State.
  const state = loadState();
  const hansard = state.domains.hansard;
  const maxOral = hansard.max_oral_id;
  const maxWritten = hansard.max_written_id;
  const maxBudget = hansard.max_budget_id ?? 2937;
  process.stdout.write(`  state: oral≤${maxOral} written≤${maxWritten} budget≤${maxBudget}\n`);

  // 3. Scan three ID windows.
  process.stdout.write(`  scanning oral-answer-${maxOral + 1}..${maxOral + ORAL_RANGE}...\n`);
  const oralRes = await scanRange('oral-answer', maxOral, ORAL_RANGE);
  process.stdout.write(`  scanning written-answer-${maxWritten + 1}..${maxWritten + WRITTEN_RANGE}...\n`);
  const writtenRes = await scanRange('written-answer', maxWritten, WRITTEN_RANGE);
  process.stdout.write(`  scanning budget-${maxBudget + 1}..${maxBudget + BUDGET_RANGE}...\n`);
  const budgetRes = await scanRange('budget', maxBudget, BUDGET_RANGE);

  const all = [...oralRes, ...writtenRes, ...budgetRes];
  const buckets: Record<Bucket, number> = { STRONG: 0, 'INFRA+': 0, INFRA: 0, 'WEAK+': 0, NO: 0 };
  for (const r of all) buckets[r.bucket] += 1;
  process.stdout.write(
    `  scan: ${all.length} topics — STRONG=${buckets.STRONG} INFRA+=${buckets['INFRA+']} WEAK+=${buckets['WEAK+']} INFRA=${buckets.INFRA} NO=${buckets.NO}\n`
  );

  // 4. Filter to actionable + not already in debates.ts, cap at flags.limit.
  // Default policy: only STRONG goes into auto-PR — INFRA+/WEAK+ have too
  // many false positives (we still report them in dry-run output for the
  // reviewer to eyeball). --include-weak opts in to the wider net.
  const acceptedBuckets: Bucket[] = flags.includeWeak ? ['STRONG', 'INFRA+', 'WEAK+'] : ['STRONG'];
  const candidates = all
    .filter((r) => acceptedBuckets.includes(r.bucket))
    .filter((r) => !existingIds.has(r.id))
    .slice(0, flags.limit);
  process.stdout.write(
    `  actionable & new: ${candidates.length} (limit=${flags.limit}, buckets=${acceptedBuckets.join('|')})\n`
  );

  if (flags.dryRun || candidates.length === 0) {
    if (flags.dryRun) {
      // In dry-run mode also surface near-miss WEAK+ / INFRA+ entries that
      // the actual run would skip without --include-weak — useful when
      // calibrating the classifier.
      const nearMiss = all
        .filter((r) => isAiRelated(r.bucket))
        .filter((r) => !acceptedBuckets.includes(r.bucket))
        .filter((r) => !existingIds.has(r.id));
      if (nearMiss.length > 0) {
        process.stdout.write(
          `\n  near-miss (would skip without --include-weak): ${nearMiss.length}\n`
        );
        for (const c of nearMiss.slice(0, 10)) {
          process.stdout.write(`    [${c.bucket}] ${c.id} (${c.dateIso || c.dateRaw}) ${c.title.slice(0, 80)}\n`);
        }
      }
    }
    if (candidates.length > 0) {
      process.stdout.write('\n  --dry-run candidates:\n');
      for (const c of candidates) {
        process.stdout.write(`    [${c.bucket}] ${c.id} (${c.dateIso || c.dateRaw}) ${c.title.slice(0, 80)}\n`);
      }
    }
    if (!flags.skipStateBump && !flags.dryRun) {
      hansard.max_oral_id = maxNumericId('oral-answer', oralRes, maxOral);
      hansard.max_written_id = maxNumericId('written-answer', writtenRes, maxWritten);
      hansard.max_budget_id = maxNumericId('budget', budgetRes, maxBudget);
      saveState(state);
      process.stdout.write(`  state updated: oral=${hansard.max_oral_id} written=${hansard.max_written_id} budget=${hansard.max_budget_id}\n`);
    }
    process.stdout.write(`\n[hansard-refresh] done in ${((Date.now() - startedAt) / 1000).toFixed(1)}s\n`);
    return;
  }

  // 5. Generate AI stubs for each STRONG/INFRA+/WEAK+ candidate.
  const stubs: DebateStub[] = [];
  const failed: { url: string; error: string }[] = [];
  for (const c of candidates) {
    process.stdout.write(`  enriching ${c.id} [${c.bucket}]…\n`);
    try {
      const ai = await generateStub(c, { useLlm: !flags.noLlm });
      stubs.push({
        id: c.id,
        titleEn: c.title,
        title: ai.title,
        date: c.dateIso || c.dateRaw,
        type: inferType(c.reportType, c.id),
        topics: ai.topics,
        summary: ai.summary,
        summaryEn: ai.summaryEn,
        bucket: c.bucket as 'STRONG' | 'INFRA+' | 'WEAK+',
        signals: { strong: c.strong, infra: c.infra, weak: c.weak },
        sourceUrl: `https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=${c.id}`,
        discoveredAt: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      process.stderr.write(`    enrich failed for ${c.id}: ${msg}\n`);
      failed.push({ url: `https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=${c.id}`, error: msg });
    }
  }

  if (stubs.length === 0) {
    process.stdout.write('  no stubs successfully enriched; nothing to emit.\n');
    return;
  }

  // 6. Emit.
  const emitResult = appendAutoDiscoveredDebates(DEBATES_FILE, stubs);
  process.stdout.write(
    `  emit: +${emitResult.added} stubs to autoDiscoveredDebates (${emitResult.created ? 'created' : 'appended'})\n`
  );

  // 7. State bump (only after successful emit).
  if (!flags.skipStateBump) {
    hansard.max_oral_id = maxNumericId('oral-answer', oralRes, maxOral);
    hansard.max_written_id = maxNumericId('written-answer', writtenRes, maxWritten);
    hansard.max_budget_id = maxNumericId('budget', budgetRes, maxBudget);
    saveState(state);
  }

  if (flags.noCommit) {
    process.stdout.write('  --no-commit: leaving working tree dirty for inspection.\n');
    return;
  }

  // 8. Commit.
  const commit = autoCommit({
    domain: 'hansard',
    files: [DEBATES_FILE, STATE_FILE],
    message: `data(hansard): auto-discover ${stubs.length} new AI-related Hansard stubs\n\n${stubs
      .map((s) => `- [${s.bucket}] ${s.id} ${s.title}`)
      .join('\n')}\n\nReviewer: promote into debates[] (with full keyPoints / stance / quote /\ntranscript fields) before merge, or merge as-is — autoDiscoveredDebates\nis not consumed by listing pages.`,
    allowDirtyPaths: ['scripts/refresh/hansard/data/'],
  });
  process.stdout.write(`  commit: ${commit.branch} ${commit.sha.slice(0, 8)}\n`);

  if (flags.noPush) {
    process.stdout.write('  --no-push: skipping remote push and PR.\n');
    return;
  }

  // 9. Push + PR.
  const pr = await pushAndOpenPR({
    branch: commit.branch,
    title: `[data-refresh] hansard: ${stubs.length} new Hansard AI stub(s)`,
    body: buildPRBody({
      domain: 'hansard',
      diffStat: commit.diffStat,
      newEntries: stubs.map((s) => ({
        title: `[${s.bucket}] ${s.id} ${s.title}`,
        sourceUrl: s.sourceUrl,
        confidence: s.bucket === 'STRONG' ? 'high' : 'medium',
      })),
      failedSources: failed,
      checksPassed: ['npm run check', 'npm run i18n-pair (target file)', 'npm run check:dist (run before merging)'],
    }),
  });
  if (pr.pr) {
    process.stdout.write(`  PR opened: ${pr.pr.url}\n`);
  } else if (pr.error) {
    process.stderr.write(`  PR step failed: ${pr.error}\n`);
  }

  // 10. Structured machine-readable report (consumed by auto_update.py).
  // `added` is the field run_tsx_pipeline reads first; `count` is kept as a
  // synonym for human readers / future tooling.
  const report = {
    domain: 'hansard',
    added: stubs.length,
    count: stubs.length,
    failures: failed.length,
    pr_url: pr.pr?.url || null,
    branch: commit.branch,
    items: stubs.map((s) => ({
      id: s.id,
      title: s.titleEn,
      bucket: s.bucket,
      date: s.date,
    })),
  };
  process.stdout.write(`\n${JSON.stringify(report)}\n`);
  process.stdout.write(`\n[hansard-refresh] done in ${((Date.now() - startedAt) / 1000).toFixed(1)}s\n`);
}

main().catch((error) => {
  process.stderr.write(`\n[hansard-refresh] fatal: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});

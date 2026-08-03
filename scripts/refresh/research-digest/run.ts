// scripts/refresh/research-digest/run.ts
// ────────────────────────────────────────────────────────────────────────
// Monthly SG AI research digest (source-expansion plan PR 4/6). Revives
// the /fieldnotes section (audit: "要么关停，要么排进季度计划" — this is
// the季度计划, monthly). Flow:
//
//   1. OpenAlex: previous calendar month, SG-institution AI works
//      (~600) → deterministic prefilter + ranking (openalex.ts) → top 40.
//   2. Sonnet triage in two batches → 5-10 notable papers with
//      whyNotable + theme. The prompt optimises for SG-led, frontier
//      relevance, venue strength, ecosystem significance.
//   3. Haiku drafts the digest copy (EN) → translateBatch → zh/ja/ko.
//   4. Emit one FieldNote (id sg-ai-research-YYYY-MM) → auto-PR whose
//      body lists chosen AND near-miss papers so triage quality is
//      reviewable from a phone.
//
// Thin month (<3 picks) → skip, no forced filler. Idempotent per month.
// CLI contract: --dry-run | --limit=N (shortlist cap) | --no-commit |
// --no-push | --month=YYYY-MM (default: previous month).

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { callLlmJson, ensureClaudeAuthed } from '../../lib/llm.ts';
import { translateBatch } from '../../lib/translate.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { formatWithPrettier } from '../../lib/prettier-format.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import { fetchMonthWorks, rankWorks, type RankedWork } from './openalex.ts';

const TARGET = resolve('src/data/fieldnotes.ts');

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  month?: string;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  const monthArg = argv.find((a) => a.startsWith('--month='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 40,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    month: monthArg?.split('=')[1],
  };
}

function prevMonth(): string {
  const d = new Date();
  d.setDate(1);
  d.setDate(0); // last day of previous month
  return d.toISOString().slice(0, 7);
}

function monthRange(month: string): { from: string; to: string } {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, '0')}` };
}

function report(fields: Record<string, unknown>): void {
  process.stdout.write('\n' + JSON.stringify(fields) + '\n');
}

interface Pick {
  openalexId: string;
  whyNotable: string;
  theme: string;
}

async function triage(shortlist: RankedWork[]): Promise<Pick[]> {
  const picks: Pick[] = [];
  const BATCH = 20;
  for (let i = 0; i < shortlist.length; i += BATCH) {
    const batch = shortlist.slice(i, i + BATCH);
    const listing = batch
      .map(
        (w, j) =>
          `${i + j + 1}. [${w.id}] "${w.title}" — venue: ${w.venue || 'n/a'}; sgShare ${w.sgShare}; ` +
          `SG first-author ${w.sgFirstAuthor}; institutions: ${w.sgInstitutions.slice(0, 3).join(', ')}; ` +
          `citations ${w.citations}\n   abstract: ${w.abstract.slice(0, 700) || '(none)'}`
      )
      .join('\n');
    try {
      const res = await callLlmJson<{ picks?: Pick[] }>(
        `You curate a monthly digest of notable Singapore AI research for a policy/ecosystem observatory (sgai.md). From the papers below, pick the most notable (0-5 from this batch). Prioritize: Singapore-LED work (first/last author at NUS/NTU/A*STAR/SUTD/SMU/AISG/Sea AI Lab), frontier relevance (LLMs, agents, safety, multimodal, AI-for-science), venue strength, ecosystem significance (SEA-LION, national programmes). Penalize incremental domain applications and papers where Singapore is a minor contributor.\n\nReturn STRICT JSON {"picks": [{"openalexId": "<the [id]>", "whyNotable": "<2 English sentences>", "theme": "<one of: LLMs & agents | AI safety & evaluation | Multimodal & vision | AI for science & health | Systems & efficiency | Other>"}]}.\n\n${listing}`,
        { systemPrompt: 'You are a discerning research curator. Output strict JSON only.', model: 'sonnet' }
      );
      for (const p of res.picks ?? []) {
        if (p.openalexId && p.whyNotable && shortlist.some((w) => w.id === p.openalexId)) picks.push(p);
      }
    } catch (err) {
      process.stdout.write(`  ! triage batch failed (non-fatal): ${err instanceof Error ? err.message : err}\n`);
    }
  }
  return picks;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const q = (s: string) => `'${esc(s)}'`;
const qArr = (xs: string[]) => `[${xs.map(q).join(', ')}]`;

async function t4(en: string): Promise<{ zh: string; ja: string; ko: string }> {
  const [zh] = await translateBatch([en], { direction: 'en→zh' });
  const [ja] = await translateBatch([en], { direction: 'en→ja' });
  const [ko] = await translateBatch([en], { direction: 'en→ko' });
  return { zh: zh || en, ja: ja || en, ko: ko || en };
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();
  const month = flags.month ?? prevMonth();
  const noteId = `sg-ai-research-${month}`;
  process.stdout.write(`\n[research-digest] starting (month ${month})\n`);

  if (readFileSync(TARGET, 'utf8').includes(`id: '${noteId}'`)) {
    process.stdout.write('  already digested — skipping.\n');
    report({ domain: 'research-digest', added: 0, reason: 'already-captured', month });
    return;
  }

  const { from, to } = monthRange(month);
  const works = await fetchMonthWorks(from, to);
  const ranked = rankWorks(works);
  const shortlist = ranked.slice(0, flags.limit);
  process.stdout.write(`  works ${works.length} → prefilter ${ranked.length} → shortlist ${shortlist.length}\n`);

  if (flags.dryRun) {
    for (const w of shortlist.slice(0, 12)) {
      process.stdout.write(`    [${w.score.toFixed(0)}] ${w.title.slice(0, 70)} — ${w.venue.slice(0, 40)}\n`);
    }
    report({ domain: 'research-digest', added: 0, reason: 'dry-run', shortlist: shortlist.length, elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
    return;
  }

  ensureClaudeAuthed();
  const picks = await triage(shortlist);
  process.stdout.write(`  triage picked ${picks.length}\n`);
  if (picks.length < 3) {
    process.stdout.write('  thin month (<3 picks) — skipping, no forced filler.\n');
    report({ domain: 'research-digest', added: 0, reason: 'thin-month', picks: picks.length });
    return;
  }
  const chosen = picks.slice(0, 10);
  const byId = new Map(shortlist.map((w) => [w.id, w]));

  // Group by theme → sections.
  const themes = new Map<string, Array<{ work: RankedWork; why: string }>>();
  for (const p of chosen) {
    const work = byId.get(p.openalexId)!;
    const arr = themes.get(p.theme) ?? [];
    arr.push({ work, why: p.whyNotable });
    themes.set(p.theme, arr);
  }

  // Compose EN → 4-lang. Points are "【Institution】 Title — why (doi)".
  const monthHuman = `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`;
  const titleEn = `Singapore AI Research Monthly (${month})`;
  const tTitle = { zh: `新加坡 AI 研究月报（${monthHuman}）`, ...(await (async () => { const r = await t4(titleEn); return { ja: r.ja, ko: r.ko }; })()) };
  const takeawayEn = await composeTakeaway(month, chosen, byId);
  const tTake = await t4(takeawayEn);

  const sectionLits: string[] = [];
  for (const [theme, entries] of themes) {
    const themeT = await t4(theme);
    const pointLits: { en: string; zh: string; ja: string; ko: string }[] = [];
    for (const { work, why } of entries) {
      const inst = work.sgInstitutions[0] ?? 'SG';
      const link = work.doi ?? work.id;
      const en = `[${inst}] ${work.title} — ${why} (${link})`;
      const whyT = await t4(why);
      pointLits.push({
        en,
        zh: `【${inst}】${work.title} — ${whyT.zh}（${link}）`,
        ja: `【${inst}】${work.title} — ${whyT.ja}（${link}）`,
        ko: `[${inst}] ${work.title} — ${whyT.ko} (${link})`,
      });
    }
    sectionLits.push(
      [
        '      {',
        `        heading: ${q(themeT.zh)},`,
        `        headingEn: ${q(theme)},`,
        `        headingJa: ${q(themeT.ja)},`,
        `        headingKo: ${q(themeT.ko)},`,
        `        points: ${qArr(pointLits.map((p) => p.zh))},`,
        `        pointsEn: ${qArr(pointLits.map((p) => p.en))},`,
        `        pointsJa: ${qArr(pointLits.map((p) => p.ja))},`,
        `        pointsKo: ${qArr(pointLits.map((p) => p.ko))},`,
        '      },',
      ].join('\n')
    );
  }

  const record = [
    '  {',
    `    id: ${q(noteId)},`,
    `    title: ${q(tTitle.zh)},`,
    `    titleEn: ${q(titleEn)},`,
    `    titleJa: ${q(tTitle.ja)},`,
    `    titleKo: ${q(tTitle.ko)},`,
    `    date: ${q(month)},`,
    `    source: 'OpenAlex + 站方筛选',`,
    `    sourceEn: 'OpenAlex + our curation',`,
    `    sourceJa: 'OpenAlex + 当サイトの選定',`,
    `    sourceKo: 'OpenAlex + 사이트 큐레이션',`,
    `    tags: ${qArr(['研究月报', ...new Set(chosen.map((p) => byId.get(p.openalexId)!.sgInstitutions[0]).filter(Boolean).slice(0, 4))])},`,
    `    tagsEn: ${qArr(['Research monthly', ...new Set(chosen.map((p) => byId.get(p.openalexId)!.sgInstitutions[0]).filter(Boolean).slice(0, 4))])},`,
    `    tagsJa: ${qArr(['研究マンスリー', ...new Set(chosen.map((p) => byId.get(p.openalexId)!.sgInstitutions[0]).filter(Boolean).slice(0, 4))])},`,
    `    tagsKo: ${qArr(['연구 월간', ...new Set(chosen.map((p) => byId.get(p.openalexId)!.sgInstitutions[0]).filter(Boolean).slice(0, 4))])},`,
    '    sections: [',
    sectionLits.join('\n'),
    '    ],',
    `    takeaway: ${q(tTake.zh)},`,
    `    takeawayEn: ${q(takeawayEn)},`,
    `    takeawayJa: ${q(tTake.ja)},`,
    `    takeawayKo: ${q(tTake.ko)},`,
    '  },',
  ].join('\n');

  // Emit at array head.
  const original = readFileSync(TARGET, 'utf8');
  const decl = 'export const fieldNotes: FieldNote[] = [';
  if (!original.includes(decl)) throw new Error('fieldNotes array not found');
  const updated = original.replace(`${decl}\n`, `${decl}\n${record}\n`);
  const { writeFileSync } = await import('node:fs');
  const baseline = findUnpairedFields(TARGET, { fields: ['title', 'heading', 'takeaway'] }).length;
  writeFileSync(TARGET, updated);
  if (findUnpairedFields(TARGET, { fields: ['title', 'heading', 'takeaway'] }).length > baseline) {
    writeFileSync(TARGET, original);
    throw new Error('i18n pairing regressed; rolled back');
  }
  formatWithPrettier(TARGET);
  process.stdout.write(`  FieldNote ${noteId} written (${chosen.length} papers, ${themes.size} themes)\n`);

  if (flags.noCommit) {
    report({ domain: 'research-digest', added: 1, reason: 'no-commit', month, papers: chosen.length });
    return;
  }

  const nearMisses = shortlist.filter((w) => !chosen.some((p) => p.openalexId === w.id)).slice(0, 8);
  const commit = autoCommit({
    domain: 'research-digest',
    files: ['src/data/fieldnotes.ts'],
    message: `data(research-digest): ${month} — ${chosen.length} notable SG AI papers`,
  });
  let prUrl = '';
  if (!flags.noPush) {
    const chosenLines = chosen
      .map((p) => {
        const w = byId.get(p.openalexId)!;
        return `- **${w.title}** (${w.venue || 'n/a'}, sgShare ${w.sgShare}, cites ${w.citations}) — ${p.whyNotable} ${w.doi ?? w.id}`;
      })
      .join('\n');
    const missLines = nearMisses.map((w) => `- ${w.title} (${w.venue || 'n/a'}, score ${w.score.toFixed(0)})`).join('\n');
    const pr = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] research-digest: ${month} (${chosen.length} papers)`,
      body: `${buildPRBody({ domain: 'research-digest', diffStat: commit.diffStat, newEntries: [{ title: `${month} digest`, sourceUrl: 'https://openalex.org', confidence: 'high' as const }] })}\n\n## Chosen\n${chosenLines}\n\n## Near misses (triage quality check)\n${missLines}`,
      labels: ['data-refresh'],
    });
    if (pr.pr) prUrl = pr.pr.url;
  }
  report({ domain: 'research-digest', added: 1, month, papers: chosen.length, pr_url: prUrl || null, elapsed_seconds: Math.round((Date.now() - startedAt) / 1000) });
}

async function composeTakeaway(month: string, picks: Pick[], byId: Map<string, RankedWork>): Promise<string> {
  const lines = picks.map((p) => `- ${byId.get(p.openalexId)!.title}: ${p.whyNotable}`).join('\n');
  // State the month EXPLICITLY — the first live run's model guessed
  // "August" for the July digest when the month wasn't in the prompt.
  const monthName = new Date(`${month}-15`).toLocaleString('en-SG', { month: 'long', year: 'numeric' });
  try {
    const res = await callLlmJson<{ takeaway?: string }>(
      `These are the notable Singapore AI papers of ${monthName} (and ONLY that month — do not name any other month). Write ONE English observation (2-3 sentences) about what this month says about Singapore's AI research direction. Return STRICT JSON {"takeaway": "..."}.\n\n${lines}`,
      { systemPrompt: 'You are a research analyst. Output strict JSON only.', model: 'haiku' }
    );
    if (res.takeaway) return res.takeaway;
  } catch {
    /* fall through */
  }
  return 'A cross-section of Singapore AI research this month, selected for Singapore-led authorship, venue strength and ecosystem significance.';
}

await main();

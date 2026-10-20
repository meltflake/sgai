// scripts/hansard/ingest-debates.ts
// ────────────────────────────────────────────────────────────────────────
// Turn Hansard report ids (from the weekly scan issue) into full debates.ts
// records + four-language debate-transcripts.ts records.
//
// Why: the Hansard pipeline is scan-only. It reports AI-related items in an
// issue but never writes data, so the 6-7 Oct 2026 sitting sat unrecorded
// for two weeks (and the 8-10 Sep batch was written by hand). This script
// does the mechanical part; a human still reviews every record before merge.
//
// Per id:
//   1. fetch the report from SPRS; split into English paragraphs (verbatim)
//   2. Claude drafts the zh + en analysis fields (strict JSON, validated:
//      topics from the closed set, notable quote must be a verbatim span,
//      speakers must appear in the text)
//   3. whyItMatters in four languages (lib/why-it-matters-batch)
//   4. zh fields → ja / ko; transcript paragraphs en → zh / ja / ko
//   Each finished record is cached to scripts/hansard/data/ingest/<id>.json,
//   so a crash or a rerun never repeats paid work.
// Then all records are inserted at the top of debates.ts / debate-transcripts.ts
// and DEBATE_STATS is recounted.
//
// USAGE:
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/ingest-debates.ts --ids=written-answer-25053,written-answer-na-25101
//   --draft-only   build / refresh the cached drafts, do not touch src/data
//   --emit-only    write src/data from the cached drafts (no LLM)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { fetchHansardTopic, htmlToParagraphs } from '../lib/sprs-api.ts';
import { callLlmJson, ensureClaudeAuthed } from '../lib/llm.ts';
import { translateBatch } from '../lib/translate.ts';
import { draftWhyItMattersBatch } from '../lib/why-it-matters-batch.ts';
import { findPersonId } from '../../src/utils/people.ts';

const DEBATES_TS = resolve('src/data/debates.ts');
const TRANSCRIPTS_TS = resolve('src/data/debate-transcripts.ts');
const CACHE_DIR = resolve('scripts/hansard/data/ingest');
const GLOSSARY = resolve('scripts/evals/translation/glossary.json');

export const TOPICS = [
  'AI Economy & Industry',
  'AI & Employment',
  'AI Governance & Regulation',
  'AI & National Security',
  'AI in Public Sector',
  'AI Infrastructure & Research',
  'AI Safety & Ethics',
  'AI in Education',
  'AI in Healthcare',
  'AI Strategy',
  'Deepfakes & Disinformation',
] as const;

const TYPE_BY_PREFIX: Array<[RegExp, string]> = [
  [/^oral-answer-/, 'Oral Answers to Questions'],
  [/^written-answer(-na)?-/, 'Written Answers to Questions'],
  [/^budget-/, 'Budget'],
  [/^motion-/, 'Motions'],
];

export interface Draft {
  title: string;
  speakers: string[];
  topics: string[];
  summary: string;
  summaryEn: string;
  keyPoints: string[];
  keyPointsEn: string[];
  governmentStance: string;
  governmentStanceEn: string;
  oppositionStance: string | null;
  oppositionStanceEn: string | null;
  controversyLevel: number;
  policySignal: string;
  policySignalEn: string;
  notableQuote: string | null;
  notableQuoteEn: string | null;
  transcriptEn: string;
}

/** "6-10-2026" → "2026-10-06". */
export function isoFromSitting(d: string): string {
  const m = d.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) throw new Error(`bad sitting date: ${d}`);
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

function squash(s: string): string {
  return s.replace(/[\s\u00a0]+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim().toLowerCase();
}

/** Validate a model draft against the source text. Returns a list of problems
 *  (empty = usable). Mutates: drops an unverifiable quote, filters topics. */
export function validateDraft(d: Draft, sourceText: string): string[] {
  const problems: string[] = [];
  const src = squash(sourceText);
  d.topics = [...new Set(d.topics)].filter((t) => (TOPICS as readonly string[]).includes(t)).slice(0, 3);
  if (d.topics.length === 0) problems.push('no valid topics');
  if (!/[一-鿿]/.test(d.title) || !/[一-鿿]/.test(d.summary)) problems.push('zh title/summary missing');
  if (d.keyPoints.length === 0 || d.keyPoints.length !== d.keyPointsEn.length) problems.push('keyPoints zh/en mismatch');
  d.speakers = d.speakers.filter((s) => {
    const core = s.replace(/^(Mr|Mrs|Ms|Miss|Mdm|Dr|Prof|Assoc Prof|Professor|Associate Professor)\.?\s+/i, '');
    return src.includes(squash(core));
  });
  if (d.speakers.length === 0) problems.push('no speaker found in text');
  if (d.notableQuoteEn && !src.includes(squash(d.notableQuoteEn))) {
    d.notableQuoteEn = null;
    d.notableQuote = null;
  }
  d.controversyLevel = Math.min(5, Math.max(1, Math.round(Number(d.controversyLevel) || 2)));
  return problems;
}

function glossaryNames(text: string): string {
  const g = JSON.parse(readFileSync(GLOSSARY, 'utf8')) as { people: Record<string, { en: string[] }> };
  const lines: string[] = [];
  for (const [zh, v] of Object.entries(g.people)) {
    if (v.en.some((en) => text.includes(en))) lines.push(`${v.en[0]} = ${zh}`);
  }
  return lines.join('\n');
}

const SYSTEM = `You are an analyst for sgai.md, a Chinese-first site tracking Singapore's AI policy. You write precise, neutral records of parliamentary questions and answers. Use only facts in the given Hansard text. Reply with one JSON object and nothing else.`;

function draftPrompt(title: string, paragraphs: string[], names: string): string {
  return `Hansard report: "${title}"

Text (verbatim):
${paragraphs.join('\n\n')}

Chinese names for people in this text (use exactly; keep the English name in brackets on first mention in zh fields, e.g. 杨莉明（Josephine Teo）; a person not listed keeps the English name only):
${names || '(none)'}

Return JSON with these keys. zh fields are Simplified Chinese, with one space between Chinese and Latin letters or digits.
{
  "title": "zh title, a noun phrase, max 30 characters",
  "speakers": ["every MP and minister who asks or answers, exactly as written in the text, with honorific, e.g. 'Mr Saktiandi Supaat', 'Mrs Josephine Teo'"],
  "topics": ["1 to 3 of: ${TOPICS.join(' | ')}"],
  "summary": "zh, 2 to 3 sentences: who asked whom what, and what the answer said",
  "summaryEn": "same in English",
  "keyPoints": ["zh, 3 to 5 concrete points from the ANSWER, each one sentence, keep numbers and programme names"],
  "keyPointsEn": ["same points in English, same order and count"],
  "governmentStance": "zh, 1 to 2 sentences on the Government's position, including what it declined to commit to",
  "governmentStanceEn": "same in English",
  "oppositionStance": "zh, 1 sentence on the questioner's concern (null if none can be inferred)",
  "oppositionStanceEn": "same in English or null",
  "controversyLevel": 1-5,
  "policySignal": "zh, 1 to 2 sentences: what this reveals about the direction of Singapore AI policy; no facts beyond the text",
  "policySignalEn": "same in English",
  "notableQuoteEn": "one sentence copied VERBATIM from the minister's answer (null if none stands out)",
  "notableQuote": "zh translation of that sentence (null if none)",
  "transcriptEn": "an English digest of the exchange in 3 to 6 sentences: the question, then what the minister said"
}`;
}

const HEADLINE = (lang: string) =>
  `You translate parliamentary question titles from Simplified Chinese into ${lang} for a policy-analysis website. ` +
  'Write each as a noun-phrase title, not a sentence: no sentence-final punctuation, no polite verb endings. ' +
  'Keep acronyms and names as written. Return only JSON: {"paragraphs":["..."]} with the same number of items as the input. ' +
  'Never use ASCII straight quotes inside the text.';

interface Cached {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  type: string;
  paragraphsEn: string[];
  draft: Draft;
  why: { whyItMatters: string; whyItMattersEn: string; whyItMattersJa: string; whyItMattersKo: string };
  ja: Record<string, string | string[] | null>;
  ko: Record<string, string | string[] | null>;
  paragraphs: string[];
  paragraphsJa: string[];
  paragraphsKo: string[];
}

async function translateFields(d: Draft, direction: 'zh→ja' | 'zh→ko'): Promise<Record<string, string | string[] | null>> {
  const lang = direction === 'zh→ja' ? 'Japanese' : 'Korean';
  const [title] = await translateBatch([d.title], { direction, systemPrompt: HEADLINE(lang) });
  const scalars = ['summary', 'governmentStance', 'oppositionStance', 'policySignal', 'notableQuote'] as const;
  const present = scalars.filter((k) => d[k]);
  const flat = [...present.map((k) => d[k] as string), ...d.keyPoints];
  const out = await translateBatch(flat, { direction });
  if (out.length !== flat.length || out.some((x) => !x || !x.trim())) throw new Error(`${direction} returned ${out.length}/${flat.length}`);
  const res: Record<string, string | string[] | null> = { title: title.trim().replace(/[。.]$/, '') };
  for (const k of scalars) res[k] = null;
  present.forEach((k, i) => (res[k] = out[i]));
  res.keyPoints = out.slice(present.length);
  return res;
}

async function buildOne(id: string): Promise<Cached> {
  const file = join(CACHE_DIR, `${id}.json`);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8')) as Cached;

  const topic = await fetchHansardTopic(id);
  if (!topic) throw new Error(`SPRS returned nothing for ${id}`);
  const paragraphsEn = htmlToParagraphs(topic.contentHtml);
  const text = paragraphsEn.join('\n');
  const draft = await callLlmJson<Draft>(draftPrompt(topic.title, paragraphsEn, glossaryNames(text)), {
    systemPrompt: SYSTEM,
    model: 'sonnet',
    timeoutMs: 300000,
  });
  const problems = validateDraft(draft, text);
  if (problems.length) throw new Error(`${id}: ${problems.join('; ')}`);

  const date = isoFromSitting(topic.sittingDate);
  const whyMap = await draftWhyItMattersBatch([
    {
      kind: 'debate',
      id,
      title: draft.title,
      date,
      actors: draft.speakers.join(', '),
      summary: draft.summary,
      detail: text.slice(0, 4000),
      sourceUrl: sprsUrl(id),
    },
  ]);
  const why = whyMap.get(id);
  if (!why) throw new Error(`${id}: whyItMatters drafting failed`);

  const [ja, ko] = [await translateFields(draft, 'zh→ja'), await translateFields(draft, 'zh→ko')];
  const [paragraphs, paragraphsJa, paragraphsKo] = [
    await translateBatch(paragraphsEn, { direction: 'en→zh' }),
    await translateBatch(paragraphsEn, { direction: 'en→ja' }),
    await translateBatch(paragraphsEn, { direction: 'en→ko' }),
  ];
  for (const [name, arr] of [
    ['zh', paragraphs],
    ['ja', paragraphsJa],
    ['ko', paragraphsKo],
  ] as const) {
    if (arr.length !== paragraphsEn.length || arr.some((p) => !p.trim())) throw new Error(`${id}: transcript ${name} misaligned`);
  }

  const type = TYPE_BY_PREFIX.find(([re]) => re.test(id))?.[1] ?? topic.reportType ?? 'Written Answers to Questions';
  const cached: Cached = { id, title: draft.title, titleEn: topic.title, date, type, paragraphsEn, draft, why, ja, ko, paragraphs, paragraphsJa, paragraphsKo };
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(cached, null, 2) + '\n');
  return cached;
}

function sprsUrl(id: string): string {
  return `https://sprs.parl.gov.sg/search/#/sprs3topic?reportid=${id}`;
}

/** Site conventions applied to every emitted string: the protected official
 *  MDDI name (src/i18n/protected-terms.ts) and no irregular whitespace
 *  (ESLint no-irregular-whitespace; Hansard and translations carry U+3000 / NBSP). */
export function cleanText(s: string): string {
  return s
    .replace(/数[码字]发展[及与和][新信资][闻息讯]部/g, '数码发展及新闻部')
    .replace(/[\u00a0\u2000-\u200a\u3000]/g, ' ')
    .replace(/[\u200b\ufeff]/g, '');
}

function clean<T>(v: T): T {
  if (typeof v === 'string') return cleanText(v) as T;
  if (Array.isArray(v)) return v.map((x) => clean(x)) as T;
  return v;
}

const lit = (v: unknown): string => JSON.stringify(clean(v));

export function renderDebate(c: Cached, today: string): string {
  const d = c.draft;
  const personIds = [...new Set(d.speakers.map((s) => findPersonId(s)).filter((x): x is string => !!x))];
  const f: Array<[string, unknown]> = [
    ['id', c.id],
    ['titleEn', c.titleEn],
    ['title', d.title],
    ['titleJa', c.ja.title],
    ['titleKo', c.ko.title],
    ['date', c.date],
    ['parliament', '15'],
    ['type', c.type],
    ['speakers', d.speakers],
    ['personIds', personIds],
    ['topicIds', []],
    ['relatedPolicyIds', []],
    ['relatedLeverNumbers', []],
    ['relatedTimelineYears', []],
    ['relatedPostSlugs', []],
    ['topics', d.topics],
    ['summary', d.summary],
    ['summaryEn', d.summaryEn],
    ['summaryJa', c.ja.summary],
    ['summaryKo', c.ko.summary],
    ['whyItMatters', c.why.whyItMatters],
    ['whyItMattersEn', c.why.whyItMattersEn],
    ['whyItMattersJa', c.why.whyItMattersJa],
    ['whyItMattersKo', c.why.whyItMattersKo],
    ['keyPoints', d.keyPoints],
    ['keyPointsEn', d.keyPointsEn],
    ['keyPointsJa', c.ja.keyPoints],
    ['keyPointsKo', c.ko.keyPoints],
    ['governmentStance', d.governmentStance],
    ['governmentStanceEn', d.governmentStanceEn],
    ['governmentStanceJa', c.ja.governmentStance],
    ['governmentStanceKo', c.ko.governmentStance],
    ['oppositionStance', d.oppositionStance],
    ['oppositionStanceEn', d.oppositionStanceEn],
    ['oppositionStanceJa', c.ja.oppositionStance],
    ['oppositionStanceKo', c.ko.oppositionStance],
    ['controversyLevel', d.controversyLevel],
    ['policySignal', d.policySignal],
    ['policySignalEn', d.policySignalEn],
    ['policySignalJa', c.ja.policySignal],
    ['policySignalKo', c.ko.policySignal],
    ['notableQuote', d.notableQuote],
    ['notableQuoteEn', d.notableQuoteEn],
    ['notableQuoteJa', c.ja.notableQuote],
    ['notableQuoteKo', c.ko.notableQuote],
    ['transcriptEn', d.transcriptEn],
    ['sourceUrl', sprsUrl(c.id)],
    ['addedAt', today],
  ];
  return '  {\n' + f.map(([k, v]) => `    ${k}: ${lit(v)},`).join('\n') + '\n  },\n';
}

export function renderTranscript(c: Cached, today: string): string {
  return (
    `  ${lit(c.id)}: {\n` +
    [
      ['debateId', c.id],
      ['reportId', c.id],
      ['sourceUrl', sprsUrl(c.id)],
      ['sourceLanguage', 'en'],
      ['fetchedAt', today],
      ['source', 'sprs-hansard'],
      ['paragraphs', c.paragraphs],
      ['paragraphsEn', c.paragraphsEn],
      ['paragraphsJa', c.paragraphsJa],
      ['paragraphsKo', c.paragraphsKo],
    ]
      .map(([k, v]) => `    ${k}: ${lit(v)},`)
      .join('\n') +
    '\n  },\n'
  );
}

/** Insert `body` right after `anchor`. Throws when the anchor is missing. */
export function insertAfter(src: string, anchor: string, body: string): string {
  const at = src.indexOf(anchor);
  if (at < 0) throw new Error(`anchor not found: ${anchor}`);
  return src.slice(0, at + anchor.length) + '\n' + body + src.slice(at + anchor.length).replace(/^\n/, '');
}

/** Recount DEBATE_STATS total / byYear / byType / byTopic in place; add the
 *  new records' speakers to existing topSpeakers keys. */
export function bumpStats(src: string, added: Array<{ date: string; type: string; topics: string[]; speakers: string[] }>): string {
  const start = src.indexOf('export const DEBATE_STATS = {');
  const end = src.indexOf('\n};', start);
  if (start < 0 || end < 0) throw new Error('DEBATE_STATS block not found');
  let block = src.slice(start, end);
  const bump = (re: RegExp, by: number) => {
    block = block.replace(re, (_m, pre: string, n: string) => `${pre}${Number(n) + by}`);
  };
  bump(/(\n {2}total: )(\d+)/, added.length);
  const count = (keys: string[]) => keys.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {});
  for (const [year, n] of Object.entries(count(added.map((a) => a.date.slice(0, 4))))) bump(new RegExp(`(\\n    '${year}': )(\\d+)`), n);
  const keyRe = (k: string) => new RegExp(`(\\n    (?:'${k.replace(/[&]/g, '&')}'|${k.replace(/ /g, '_')}): )(\\d+)`);
  for (const [type, n] of Object.entries(count(added.map((a) => a.type)))) bump(keyRe(type), n);
  for (const [topic, n] of Object.entries(count(added.flatMap((a) => a.topics)))) bump(keyRe(topic), n);
  const strip = (s: string) => s.replace(/^(Mr|Mrs|Ms|Miss|Mdm|Dr|Prof|Assoc Prof)\.?\s+/i, '').toLowerCase();
  const spoken = count(added.flatMap((a) => [...new Set(a.speakers.map(strip))]));
  block = block.replace(/(\n {4}'([^']+)': )(\d+)/g, (m, pre: string, name: string, n: string) => {
    const k = name.toLowerCase();
    return k in spoken && block.indexOf('topSpeakers') < block.indexOf(m) ? `${pre}${Number(n) + spoken[k]}` : m;
  });
  return src.slice(0, start) + block + src.slice(end);
}

async function main(): Promise<void> {
  const idsArg = process.argv.find((a) => a.startsWith('--ids='));
  if (!idsArg) throw new Error('--ids=<comma-separated report ids> is required');
  const ids = idsArg.slice('--ids='.length).split(',').map((s) => s.trim()).filter(Boolean);
  const draftOnly = process.argv.includes('--draft-only');
  const emitOnly = process.argv.includes('--emit-only');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date());

  const debatesSrc = readFileSync(DEBATES_TS, 'utf8');
  const fresh = ids.filter((id) => !debatesSrc.includes(`id: '${id}'`) && !debatesSrc.includes(`id: "${id}"`));
  if (fresh.length < ids.length) console.log(`skipping already-ingested: ${ids.filter((i) => !fresh.includes(i)).join(', ')}`);

  if (!emitOnly) ensureClaudeAuthed();
  const built: Cached[] = [];
  for (const id of fresh) {
    if (emitOnly && !existsSync(join(CACHE_DIR, `${id}.json`))) {
      console.log(`  ! ${id}: no cached draft, skipped`);
      continue;
    }
    try {
      const c = await buildOne(id);
      built.push(c);
      console.log(`  ✓ ${id}  ${c.draft.title}`);
    } catch (e) {
      console.log(`  ✗ ${id}: ${e instanceof Error ? e.message.slice(0, 200) : String(e)}`);
    }
  }
  if (draftOnly || built.length === 0) {
    console.log(`\n${built.length} draft(s) ready in ${CACHE_DIR}`);
    return;
  }

  built.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  let dsrc = insertAfter(debatesSrc, 'export const debates: Debate[] = [', built.map((c) => renderDebate(c, today)).join(''));
  dsrc = bumpStats(
    dsrc,
    built.map((c) => ({ date: c.date, type: c.type, topics: c.draft.topics, speakers: c.draft.speakers }))
  );
  writeFileSync(DEBATES_TS, dsrc);
  const tsrc = readFileSync(TRANSCRIPTS_TS, 'utf8');
  writeFileSync(
    TRANSCRIPTS_TS,
    insertAfter(tsrc, 'export const debateTranscripts: Record<string, DebateTranscript> = {', built.map((c) => renderTranscript(c, today)).join(''))
  );
  spawnSync('npx', ['prettier', '--write', DEBATES_TS, TRANSCRIPTS_TS], { stdio: 'inherit' });
  console.log(`\nemitted ${built.length} debate(s) + transcript(s)`);
}

if (process.argv[1]?.endsWith('ingest-debates.ts')) await main();

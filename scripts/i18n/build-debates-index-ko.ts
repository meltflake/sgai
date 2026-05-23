// One-shot: batch translate the en `L` dict of DebatesIndex into ko.
// Emits a TS literal block to stdout for splicing into the component.
//
// USAGE:  npx tsx scripts/i18n/build-debates-index-ko.ts > /tmp/debates-ko.txt

import { resolve } from 'node:path';
import { translateBatch } from '../lib/translate.ts';

// Mirror the EN L dict in DebatesIndex.astro (lines 108-174).
const SOURCE: Record<string, string> = {
  updated: 'Last updated',
  recordCount: 'debate records',
  source: 'Source',
  digestNote: 'Digests assisted by AI',
  title: 'Parliamentary AI Focus',
  intro:
    'First-hand records of Singapore parliamentary debates on AI, with AI-assisted English digests, MP positions, and policy-pattern insights.',
  finderTitle: 'Find the debate you need',
  finderHint: 'Search first, then narrow by type, topic, MP, year, or controversy level.',
  searchPlaceholder: 'Search title, summary, MP, policy signal, date...',
  allTypes: 'All types',
  allTopics: 'All topics',
  allMps: 'All MPs',
  allYears: 'All years',
  allControversy: 'All controversy levels',
  highControversy: 'High (level 4-5)',
  midControversy: 'Medium (level 3)',
  lowControversy: 'Low (level 1-2)',
  clear: 'Clear filters',
  active: 'Active filters:',
  topicTitle: 'Browse by Topic',
  topicHint: 'High-signal entry points into the full archive.',
  overviewTitle: 'Archive Overview',
  total: 'Total records',
  years: 'Years covered',
  typeMix: 'Type mix',
  updatedShort: 'Updated',
  trendTitle: 'Yearly debate volume',
  trendHint: 'Click a bar to filter that year.',
  listTitle: 'Debate Records',
  listHint: 'Compact archive cards; open a card or detail page for the full digest.',
  noResults: 'No debates match the current filters.',
  details: 'Open digest, stances, and transcript',
  keyPoints: 'Key Points',
  government: 'Government Position',
  opposition: 'Questioning Position',
  signal: 'Policy Signal',
  quote: 'Notable Quote',
  transcript: 'Original transcript excerpt',
  detailPage: 'Detail page',
  hansard: 'Hansard',
  parliament: 'Parliament',
  showing: 'Showing',
  results: 'results',
  quickTitle: 'Quick filters',
  analysisTitle: 'Analytical Views',
  analysisHint: 'Interpretive layers distilled from the archive.',
  insights: 'Key Insights',
  evolution: 'Policy Evolution',
  controversies: 'Recurring Controversies',
  tensions: 'Core Policy Tensions',
  mps: 'Key MP Profiles',
  signals: 'Policy Signal Tracker',
  important: 'Important',
  firstSeen: 'First seen',
  related: 'related',
  implemented: 'Implemented',
  inProgress: 'In progress',
  stillDiscussing: 'Still under discussion',
  currentBalance: 'Current balance:',
  clickPeriod: 'Click any period to filter the debate records from that phase.',
  clickControversy: 'Click any recurring issue to filter related debates.',
  clickMp: 'Click any MP card to filter their debates.',
  clickSignal: 'Click any signal to filter the year it first surfaced.',
};

const SYS_PROMPT = [
  'You are a professional translator for the Korean version of a Singapore AI policy-analysis website.',
  'Translate the input from English into clear, faithful Korean using the polite-but-professional 합쇼체 register.',
  'Preserve proper nouns (MP, Hansard, IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Render the country name as 싱가포르.',
  'Return only JSON: {"paragraphs":["..."]}. Output array length must equal input array length.',
  'No quotation marks unless the source has them; if the source uses straight ASCII quotes for emphasis, replace with curly typographic quotes (" and ") or Korean 「 」. NEVER use ASCII straight quotes (") in the output.',
  'Keep {placeholder} tokens VERBATIM.',
].join('\n');

async function main() {
  const keys = Object.keys(SOURCE);
  const sources = keys.map((k) => SOURCE[k]);
  process.stderr.write(`[build-debates-ko] Translating ${sources.length} keys via haiku...\n`);

  const cacheDir = resolve(import.meta.dirname, 'data/ko-cache');
  const translated = await translateBatch(sources, {
    direction: 'en→ko',
    cacheDir,
    systemPrompt: SYS_PROMPT,
    concurrency: 2,
  });

  if (translated.length !== sources.length) {
    throw new Error(`Translation count mismatch: ${sources.length} → ${translated.length}`);
  }

  const lines: string[] = [];
  lines.push('  ? {');
  for (let i = 0; i < keys.length; i++) {
    const v = translated[i].replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    lines.push(`      ${keys[i]}: '${v}',`);
  }
  lines.push('    }');

  process.stdout.write(lines.join('\n') + '\n');
}

main().catch((e) => {
  process.stderr.write(`ERROR: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});

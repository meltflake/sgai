#!/usr/bin/env node
// Voices Prospecting Tool
// ──────────────────────────────────────────────────────────────────────
// Identifies "三无" (no debates / no policies / no videos) people in
// `src/data/people.ts` and generates a review queue of prospect JSON
// files. Each prospect file is a scaffold: pre-filled with the person's
// metadata + a set of targeted search queries against whitelisted
// sources. A human (or Claude in another session) runs the queries,
// fills in `signatureWork` / `notableQuotes` / `speakingRecord` /
// `externalRoles`, flips `status: "ready"`, and then `apply` prints a
// TypeScript patch ready to paste into `src/data/people.ts`.
//
// This tool deliberately does NOT crawl the web itself. The signal-to-
// noise on generic crawls (Google Scholar, LinkedIn) is bad. A targeted
// query list + human curation produces ~3–5 high-quality entries per
// profile in 5–10 minutes.
//
// Usage:
//   node scripts/voices/prospect-stubs.mjs list [--limit N]
//     List 三无 voices ranked by stubbiness (longest summary missing first).
//
//   node scripts/voices/prospect-stubs.mjs queue <id> [<id> ...]
//   node scripts/voices/prospect-stubs.mjs queue --top N
//     Generate prospect JSON files in scripts/voices/data/prospects/.
//     Skips files that already exist unless --force.
//
//   node scripts/voices/prospect-stubs.mjs status
//     Print review queue status (pending / ready / applied counts).
//
//   node scripts/voices/prospect-stubs.mjs apply <id>
//     Read a "ready" prospect file and print a TypeScript snippet to
//     stdout. Paste into the matching person record in people.ts.

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const PROSPECTS_DIR = join(__dirname, 'data', 'prospects');

// ── Whitelisted high-signal sources ───────────────────────────────────
const WHITELIST = [
  'aisingapore.org',
  'imda.gov.sg',
  'mddi.gov.sg',
  'mti.gov.sg',
  'pmo.gov.sg',
  'govinsider.asia',
  'e27.co',
  'computerweekly.com',
  'channelnewsasia.com',
  'straitstimes.com',
  'businesstimes.com.sg',
  'scai.gov.sg',
  'sicw.gov.sg',
  'ntu.edu.sg',
  'nus.edu.sg',
  'sutd.edu.sg',
  'smu.edu.sg',
  'a-star.edu.sg',
  'sea-lion.ai',
  'oecd.ai',
];

// ── Generate the search query list for a given person ─────────────────
function buildQueries(p) {
  const name = `"${p.name}"`;
  const orgs = (p.affiliations || []).filter((a) => !['Other'].includes(a));
  const orgClause = orgs.length ? ` (${orgs.map((o) => `"${o}"`).join(' OR ')})` : '';

  const queries = [
    `${name}${orgClause} keynote OR statement 2025 OR 2026`,
    `${name} site:aisingapore.org`,
    `${name} site:imda.gov.sg`,
    `${name} site:govinsider.asia AI`,
    `${name} site:e27.co`,
    `${name} AI Singapore interview OR panel`,
  ];

  if (p.category === 'government') {
    queries.push(`${name} parliamentary OR ministry announcement AI`);
  }
  if (p.category === 'academic') {
    queries.push(`${name} research lab OR program AI Singapore`);
  }
  if (p.category === 'industry') {
    queries.push(`${name} startup OR investment Singapore AI`);
  }

  return queries;
}

// ── Load people via tsx so we get the live dataset ────────────────────
async function loadPeopleAndCounts() {
  const { allPeople } = await import(join(ROOT, 'src/data/people.ts'));
  const { videos } = await import(join(ROOT, 'src/data/videos.ts'));
  const { getPersonCounts } = await import(join(ROOT, 'src/utils/graph.ts'));

  return allPeople.map((p) => {
    const c = getPersonCounts(p.id);
    const vidCount = videos.filter(
      (v) => v.speaker === p.name || (p.aliases || []).includes(v.speaker)
    ).length;
    const summaryLen = (p.summary || '').length;
    const isStub = !p.summary || p.summary.startsWith('[需补充]');
    return {
      person: p,
      debateCount: c.debateCount,
      policyAuthorCount: c.policyAuthorCount,
      videoCount: vidCount,
      summaryLen,
      isStub,
      score: c.debateCount + c.policyAuthorCount + vidCount,
    };
  });
}

function rankStubs(rows) {
  // Prioritise people who have a real role (summary > 30 chars, channels > 0)
  // but zero downstream signal — these benefit most from contributions data.
  return rows
    .filter((r) => r.score === 0 && !r.isStub && r.summaryLen >= 30 && r.person.channels.length > 0)
    .sort((a, b) => a.summaryLen - b.summaryLen);
}

// ── Commands ──────────────────────────────────────────────────────────

async function cmdList(args) {
  const limit = parseInt(getFlag(args, '--limit') ?? '25', 10);
  const rows = await loadPeopleAndCounts();
  const ranked = rankStubs(rows);
  console.log(`\n${ranked.length} 三无 voices (no debates / policies / videos), with substantive role:\n`);
  console.table(
    ranked.slice(0, limit).map((r) => ({
      id: r.person.id,
      name: r.person.name,
      cat: r.person.category,
      aff: (r.person.affiliations || []).join(','),
      sumLen: r.summaryLen,
      ch: r.person.channels.length,
    }))
  );
  if (ranked.length > limit) console.log(`\n... and ${ranked.length - limit} more (use --limit)`);
}

async function cmdQueue(args) {
  await mkdir(PROSPECTS_DIR, { recursive: true });
  const force = args.includes('--force');
  const top = getFlag(args, '--top');
  const ids = args.filter((a) => !a.startsWith('--'));

  const rows = await loadPeopleAndCounts();
  let targets;
  if (top) {
    targets = rankStubs(rows).slice(0, parseInt(top, 10));
  } else if (ids.length) {
    const byId = new Map(rows.map((r) => [r.person.id, r]));
    targets = ids.map((id) => byId.get(id)).filter(Boolean);
    if (targets.length !== ids.length) {
      const missing = ids.filter((id) => !byId.has(id));
      console.error(`Unknown person id(s): ${missing.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.error('Specify either <id>... or --top N');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  for (const r of targets) {
    const p = r.person;
    const filePath = join(PROSPECTS_DIR, `${p.id}.json`);
    if (existsSync(filePath) && !force) {
      skipped++;
      continue;
    }
    const prospect = {
      personId: p.id,
      name: p.name,
      zhName: p.zhName,
      title: p.title,
      affiliations: p.affiliations,
      category: p.category,
      currentSummary: p.summary,
      status: 'pending', // pending → ready → applied
      createdAt: new Date().toISOString().slice(0, 10),
      reviewedAt: null,
      // Suggested searches — run these by hand or via WebSearch.
      searchQueries: buildQueries(p),
      whitelistedSources: WHITELIST,
      // Fill these in after research. See src/data/people.ts for type defs.
      signatureWork: [], // SignatureWork[] — 1–5 owned programs/policies
      notableQuotes: [], // NotableQuote[] — 1–5 attributed pull-quotes
      speakingRecord: [], // SpeakingEntry[] — recent keynotes/panels
      externalRoles: [], // ExternalRole[] — board seats / WG chairs
      notes: '', // free-form reviewer notes
    };
    await writeFile(filePath, JSON.stringify(prospect, null, 2) + '\n', 'utf8');
    console.log(`  + ${p.id}.json`);
    created++;
  }
  console.log(`\nCreated ${created}, skipped ${skipped} (already exist; use --force to overwrite).`);
  console.log(`Files live in: ${PROSPECTS_DIR}`);
}

async function cmdStatus() {
  if (!existsSync(PROSPECTS_DIR)) {
    console.log('No prospects directory yet. Run `queue` first.');
    return;
  }
  const files = (await readdir(PROSPECTS_DIR)).filter((f) => f.endsWith('.json'));
  const buckets = { pending: [], ready: [], applied: [], unknown: [] };
  for (const f of files) {
    const data = JSON.parse(await readFile(join(PROSPECTS_DIR, f), 'utf8'));
    const bucket = buckets[data.status] || buckets.unknown;
    bucket.push(data.personId);
  }
  console.log(`\n${files.length} prospect files in queue:`);
  for (const [s, ids] of Object.entries(buckets)) {
    if (ids.length === 0) continue;
    console.log(`\n  ${s} (${ids.length}):`);
    for (const id of ids) console.log(`    - ${id}`);
  }
}

async function cmdApply(args) {
  const id = args[0];
  if (!id) {
    console.error('Usage: apply <person-id>');
    process.exit(1);
  }
  const filePath = join(PROSPECTS_DIR, `${id}.json`);
  if (!existsSync(filePath)) {
    console.error(`No prospect file at ${filePath}`);
    process.exit(1);
  }
  const data = JSON.parse(await readFile(filePath, 'utf8'));
  if (data.status !== 'ready') {
    console.error(`Prospect status is "${data.status}", expected "ready". Mark it ready first.`);
    process.exit(1);
  }

  const fields = ['signatureWork', 'notableQuotes', 'speakingRecord', 'externalRoles']
    .filter((k) => Array.isArray(data[k]) && data[k].length > 0);
  if (fields.length === 0) {
    console.error('No populated fields to apply. Fill in at least one of signatureWork/notableQuotes/speakingRecord/externalRoles.');
    process.exit(1);
  }

  console.log(`// Patch for person id="${id}" — paste these fields into the matching record in src/data/people.ts:\n`);
  for (const k of fields) {
    console.log(`    ${k}: ${stringifyTs(data[k])},`);
  }
  console.log(`\n// After pasting, set this prospect's status to "applied" in ${filePath}.`);
}

// Format a JSON value as TS-friendly source (single quotes, trailing commas).
function stringifyTs(value, indent = 4) {
  const json = JSON.stringify(value, null, 2);
  // Indent every line by `indent` extra spaces (besides first).
  const pad = ' '.repeat(indent);
  return json
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n');
}

function getFlag(args, flag) {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

// ── Dispatch ──────────────────────────────────────────────────────────
const [cmd, ...rest] = process.argv.slice(2);
const handlers = { list: cmdList, queue: cmdQueue, status: cmdStatus, apply: cmdApply };
if (!cmd || !handlers[cmd]) {
  console.error('Usage: node scripts/voices/prospect-stubs.mjs <list|queue|status|apply> [args]');
  process.exit(1);
}
await handlers[cmd](rest);

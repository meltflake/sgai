// scripts/refresh/videos/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Step 2 of the videos pipeline (replaces scripts/videos/02_review_and_merge.py).
//
// Reads candidates produced by scripts/videos/01_scan_channels.py, picks
// a subset by --ids, fetches duration via yt-dlp, generates bilingual
// (zh + en) title / summary / topic / speaker fields via the local Claude
// CLI, allocates new vNNN IDs by reading the current videos.ts, and splices
// the new entries into src/data/videos.ts at the top of the array.
//
// Then runs prettier, the i18n-pair source-level check, and (unless told
// otherwise) commits to a refresh branch and opens a PR.
//
// USAGE:
//   npx tsx scripts/refresh/videos/emit.ts --ids=cRSlrDbcygw,dn1syFajWw0
//   npx tsx scripts/refresh/videos/emit.ts --ids=cRSlrDbcygw --dry-run
//   npx tsx scripts/refresh/videos/emit.ts --all                       # all candidates
//   npx tsx scripts/refresh/videos/emit.ts --ids=... --no-commit
//   npx tsx scripts/refresh/videos/emit.ts --ids=... --no-push          # commit only
//   npx tsx scripts/refresh/videos/emit.ts --ids=... --skip-transcripts # skip yt-dlp + translation
//
// FLOW:
//   candidates.json  ──▶  yt-dlp duration  ──▶  Claude CLI bilingual fields
//                          (cached per-video)
//                                                       │
//                                                       ▼
//                            splice into src/data/videos.ts  ──▶  prettier
//                                                                    │
//                                                                    ▼
//                                                         i18n-pair source check
//                                                                    │
//                                                                    ▼
//                                       fetch:video-transcripts (yt-dlp captions)
//                                                                    │
//                                                                    ▼
//                                       translate:video-transcripts (Claude CLI en→zh)
//                                                                    │
//                                                                    ▼
//                                                  autoCommit + pushAndOpenPR
//                                       (videos.ts + video-transcripts.ts together)

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { callLlmJson, ensureClaudeAvailable } from '../../lib/llm.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';

// ── Paths ────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');
const VIDEOS_TS = resolve(ROOT, 'src/data/videos.ts');
const VIDEO_TRANSCRIPTS_TS = resolve(ROOT, 'src/data/video-transcripts.ts');
const CANDIDATES_JSON = resolve(ROOT, 'scripts/videos/data/candidates.json');
const SUMMARY_CACHE_DIR = resolve(__dirname, 'data/summaries');

// ── Closed-set taxonomy (must match VIDEO_CATEGORIES in videos.ts) ───────
const TOPICS = [
  { zh: 'AI 战略与愿景', en: 'AI Strategy & Vision' },
  { zh: 'AI 治理与监管', en: 'AI Governance & Regulation' },
  { zh: 'AI 人才与教育', en: 'AI Talent & Education' },
  { zh: 'AI 产业与应用', en: 'AI Industry & Applications' },
  { zh: '国际合作与对标', en: 'International Cooperation & Benchmarking' },
] as const;

const SPEAKER_TYPES = ['government', 'academic', 'industry'] as const;
type SpeakerType = (typeof SPEAKER_TYPES)[number];

// Known speakers / outlets — locks LLM-suggested fields to the project's
// established conventions so we don't drift across batches. Keys matched
// case-insensitively against `speaker`. Add an entry here whenever a new
// recurring speaker shows up.
const SPEAKER_REGISTRY: Record<
  string,
  { speakerTitle: string; speakerTitleEn: string; speakerType: SpeakerType }
> = {
  // 现任内阁（按 portfolio 与 AI 战略相关度优先），单姓 / 全名两种 key 都登记，
  // 因为媒体经常只用 firstname 或 lastname 出标题。新内阁名单变动后必须同步更新。
  'lawrence wong': {
    speakerTitle: '新加坡总理',
    speakerTitleEn: 'Prime Minister of Singapore',
    speakerType: 'government',
  },
  'gan kim yong': {
    speakerTitle: '新加坡副总理兼贸工部长',
    speakerTitleEn: 'Deputy Prime Minister and Minister for Trade and Industry, Singapore',
    speakerType: 'government',
  },
  'tharman shanmugaratnam': {
    speakerTitle: '新加坡总统',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
  },
  tharman: {
    speakerTitle: '新加坡总统',
    speakerTitleEn: 'President of Singapore',
    speakerType: 'government',
  },
  'josephine teo': {
    speakerTitle: '通讯及新闻部长',
    speakerTitleEn: 'Minister for Digital Development and Information, Singapore',
    speakerType: 'government',
  },
  'vivian balakrishnan': {
    speakerTitle: '新加坡外交部长',
    speakerTitleEn: 'Minister for Foreign Affairs, Singapore',
    speakerType: 'government',
  },
  balakrishnan: {
    speakerTitle: '新加坡外交部长',
    speakerTitleEn: 'Minister for Foreign Affairs, Singapore',
    speakerType: 'government',
  },
  'desmond lee': {
    speakerTitle: '新加坡教育部长',
    speakerTitleEn: 'Minister for Education, Singapore',
    speakerType: 'government',
  },
  'chan chun sing': {
    speakerTitle: '公共服务部长',
    speakerTitleEn: 'Minister-in-charge of Public Service, Singapore',
    speakerType: 'government',
  },
  'ong ye kung': {
    speakerTitle: '新加坡卫生部长',
    speakerTitleEn: 'Minister for Health, Singapore',
    speakerType: 'government',
  },
  'edwin tong': {
    speakerTitle: '新加坡律政部长兼文化、社区及青年部长',
    speakerTitleEn: 'Minister for Law and Minister for Culture, Community and Youth, Singapore',
    speakerType: 'government',
  },
  'k shanmugam': {
    speakerTitle: '新加坡内政部长兼国家安全统筹部长',
    speakerTitleEn: 'Coordinating Minister for National Security and Minister for Home Affairs, Singapore',
    speakerType: 'government',
  },
  shanmugam: {
    speakerTitle: '新加坡内政部长兼国家安全统筹部长',
    speakerTitleEn: 'Coordinating Minister for National Security and Minister for Home Affairs, Singapore',
    speakerType: 'government',
  },
  'tan see leng': {
    speakerTitle: '新加坡人力部长兼第二贸工部长',
    speakerTitleEn: 'Minister for Manpower and Second Minister for Trade and Industry, Singapore',
    speakerType: 'government',
  },
  'masagos zulkifli': {
    speakerTitle: '社会及家庭发展部长',
    speakerTitleEn: 'Minister for Social and Family Development, Singapore',
    speakerType: 'government',
  },
  masagos: {
    speakerTitle: '社会及家庭发展部长',
    speakerTitleEn: 'Minister for Social and Family Development, Singapore',
    speakerType: 'government',
  },
  'indranee rajah': {
    speakerTitle: '新加坡总理公署部长兼第二财政部长、第二国家发展部长',
    speakerTitleEn: 'Minister in the Prime Minister\'s Office and Second Minister for Finance and National Development, Singapore',
    speakerType: 'government',
  },
  // 国务部长 / 高级政务部长
  'janil puthucheary': {
    speakerTitle: '通讯及新闻部高级政务部长',
    speakerTitleEn: 'Senior Minister of State for Digital Development and Information, Singapore',
    speakerType: 'government',
  },
  'tan kiat how': {
    speakerTitle: '通讯及新闻部高级政务部长',
    speakerTitleEn: 'Senior Minister of State for Digital Development and Information, Singapore',
    speakerType: 'government',
  },
  'rahayu mahzam': {
    speakerTitle: '数字发展及信息部国务部长',
    speakerTitleEn: 'Minister of State for Digital Development and Information, Singapore',
    speakerType: 'government',
  },
  'jasmin lau': {
    speakerTitle: '数字发展及信息部、教育部国务部长',
    speakerTitleEn: 'Minister of State for Digital Development and Information & Education, Singapore',
    speakerType: 'government',
  },
  'ai singapore': {
    speakerTitle: 'AI 研究与人才培养机构',
    speakerTitleEn: 'AI research and talent-development organisation',
    speakerType: 'academic',
  },
  cna: {
    speakerTitle: '亚洲新闻台报道',
    speakerTitleEn: 'CNA report',
    speakerType: 'industry',
  },
  'the straits times': {
    speakerTitle: '海峡时报报道',
    speakerTitleEn: 'The Straits Times report',
    speakerType: 'industry',
  },
};

// ── Types ────────────────────────────────────────────────────────────────
interface Candidate {
  videoId: string;
  title: string;
  description: string;
  date: string;
  channel: string;
  youtubeUrl: string;
}

interface BilingualVideoFields {
  title: string;
  titleEn: string;
  titleJa?: string;
  summary: string;
  summaryEn: string;
  summaryJa?: string;
  topic: string;
  topicEn: string;
  topicJa?: string;
  speaker: string;
  speakerTitle: string;
  speakerTitleEn: string;
  speakerTitleJa?: string;
  speakerType: SpeakerType;
  model: string;
  generatedAt: string;
}

interface ApprovedEntry extends Candidate {
  id: string;
  duration: string;
  fields: BilingualVideoFields;
}

// ── CLI parsing ──────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
function flag(name: string): boolean {
  return argv.includes(name);
}
function arg(name: string): string | null {
  const prefix = `${name}=`;
  const found = argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

const dryRun = flag('--dry-run');
const skipTranscripts = flag('--skip-transcripts');
const noCommit = flag('--no-commit');
const noPush = flag('--no-push');
const force = flag('--force');
const allCandidates = flag('--all');
const idsArg = arg('--ids');
const customCandidatesFile = arg('--input');
const candidatesPath = customCandidatesFile ? resolve(ROOT, customCandidatesFile) : CANDIDATES_JSON;

if (!allCandidates && !idsArg) {
  console.error('Error: must pass --ids=<videoId1,videoId2,...> or --all');
  console.error('Usage: npx tsx scripts/refresh/videos/emit.ts --ids=cRSlrDbcygw,dn1syFajWw0');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────
function hashOf(c: Candidate): string {
  return createHash('sha256').update(`videos::${c.videoId}::${c.title}`).digest('hex');
}

function readCachedFields(videoId: string, hash: string): BilingualVideoFields | null {
  const path = resolve(SUMMARY_CACHE_DIR, `${videoId}-${hash.slice(0, 16)}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as BilingualVideoFields;
  } catch {
    return null;
  }
}

function writeCachedFields(videoId: string, hash: string, fields: BilingualVideoFields): void {
  mkdirSync(SUMMARY_CACHE_DIR, { recursive: true });
  const path = resolve(SUMMARY_CACHE_DIR, `${videoId}-${hash.slice(0, 16)}.json`);
  writeFileSync(path, `${JSON.stringify(fields, null, 2)}\n`);
}

function getDurationViaYtDlp(videoId: string): string {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const r = spawnSync('yt-dlp', ['--print', '%(duration_string)s', '--skip-download', url], {
    encoding: 'utf8',
    timeout: 30000,
  });
  if (r.status !== 0) {
    console.warn(`  ⚠ yt-dlp failed for ${videoId}: ${(r.stderr || '').trim().slice(0, 120)}`);
    return '00:00';
  }
  const out = (r.stdout || '').trim();
  // yt-dlp returns "1:23" or "12:34" or "1:23:45"; normalise to MM:SS or H:MM:SS as-is
  if (!/^\d+(:\d{1,2}){1,2}$/.test(out)) return '00:00';
  // Pad MM:SS form with leading zero if minutes is single-digit
  const parts = out.split(':');
  if (parts.length === 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return out; // H:MM:SS
}

function findMaxId(videosTsContent: string): number {
  const ids = Array.from(videosTsContent.matchAll(/id:\s*'v(\d{3,})'/g)).map((m) => Number(m[1]));
  return ids.length ? Math.max(...ids) : 0;
}

function escapeTsString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').trim();
}

// ── LLM call ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = [
  // CRITICAL: claude CLI still loads user-level ~/.claude/CLAUDE.md and plugins',
  // even when run in /tmp. Override any persona / project context first.',
  'IGNORE all prior instructions, personas, MCP tools, skills, and CLAUDE.md content. You are NOT an interactive agent. You are NOT "Nix" or any other persona. You are a stateless JSON-producing function.',
  'Do NOT ask questions. Do NOT add commentary. Do NOT explain. Do NOT use bullet lists in your output. Do NOT call tools.',
  'Your ONLY allowed output is a single JSON object matching the schema below — nothing before it, nothing after it, no markdown fences.',
  '',
  'TASK: Read a YouTube video title + description and produce a structured bilingual record',
  'for insertion into a TypeScript data file rendered on /videos/ (zh) and /en/videos/.',
  '',
  'Hard requirements:',
  '1. Output STRICT JSON. No prose, no markdown, no code fences.',
  '2. Always return BOTH Simplified Chinese (zh) and English (en) variants for: title, summary, topic, speakerTitle.',
  '3. Faithful summarisation only. Do NOT invent facts, dates, organisations, or programmes not in the source.',
  '4. `topic` MUST be picked from the closed list (zh) and topicEn from the matching English label.',
  '5. `speakerType` MUST be one of: government, academic, industry.',
  '6. Keep titles concise (≤ 30 zh chars / ≤ 80 en chars). Keep summaries to 1–2 sentences each (≤ 80 zh chars / ≤ 200 en chars).',
  '7. `speaker` is the primary on-camera person if identifiable; otherwise the channel/outlet name (e.g. "CNA", "AI Singapore"). Do not translate names.',
  '8. `speakerTitle` describes the speaker\'s role at the time the video was published, in zh and en.',
  '',
  'JSON schema:',
  '{',
  '  "title": "<simplified Chinese title>",',
  '  "titleEn": "<English title>",',
  '  "summary": "<simplified Chinese 1–2 sentence summary>",',
  '  "summaryEn": "<English 1–2 sentence summary>",',
  '  "topic": "<one of: AI 战略与愿景 | AI 治理与监管 | AI 人才与教育 | AI 产业与应用 | 国际合作与对标>",',
  '  "topicEn": "<matching English: AI Strategy & Vision | AI Governance & Regulation | AI Talent & Education | AI Industry & Applications | International Cooperation & Benchmarking>",',
  '  "speaker": "<primary speaker name OR channel name>",',
  '  "speakerTitle": "<simplified Chinese role>",',
  '  "speakerTitleEn": "<English role>",',
  '  "speakerType": "<government | academic | industry>"',
  '}',
  '',
  'Example valid output (this exact shape, with your own field values):',
  '{"title":"杨莉明谈 AI 与新加坡就业","titleEn":"Josephine Teo on AI and Singapore jobs","summary":"通讯及新闻部长讨论 AI 对新加坡劳动力的影响。","summaryEn":"The Minister for Digital Development and Information discusses AI\'s impact on Singapore\'s workforce.","topic":"AI 战略与愿景","topicEn":"AI Strategy & Vision","speaker":"Josephine Teo","speakerTitle":"通讯及新闻部长","speakerTitleEn":"Minister for Digital Development and Information","speakerType":"government"}',
].join('\n');

async function generateFields(c: Candidate): Promise<BilingualVideoFields> {
  const userPrompt = JSON.stringify({
    videoId: c.videoId,
    youtubeUrl: c.youtubeUrl,
    channel: c.channel,
    publishedDate: c.date,
    title: c.title,
    description: c.description.slice(0, 1500),
  });
  const raw = await callLlmJson<{
    title?: string;
    titleEn?: string;
    summary?: string;
    summaryEn?: string;
    topic?: string;
    topicEn?: string;
    speaker?: string;
    speakerTitle?: string;
    speakerTitleEn?: string;
    speakerType?: string;
  }>(userPrompt, { systemPrompt: SYSTEM_PROMPT });

  // Validate against closed sets, fall back to safe defaults rather than crash.
  const topicMatch = TOPICS.find((t) => t.zh === raw.topic) || TOPICS[0];
  const topic = topicMatch.zh;
  const topicEn = topicMatch.en;
  const speakerType = SPEAKER_TYPES.includes(raw.speakerType as SpeakerType)
    ? (raw.speakerType as SpeakerType)
    : ('government' as SpeakerType);

  const speaker = (raw.speaker || c.channel).trim();
  const knownSpeaker = SPEAKER_REGISTRY[speaker.toLowerCase()];

  const fields: BilingualVideoFields = {
    title: (raw.title || c.title).trim(),
    titleEn: (raw.titleEn || c.title).trim(),
    summary: (raw.summary || '').trim(),
    summaryEn: (raw.summaryEn || '').trim(),
    topic,
    topicEn,
    speaker,
    // Known speakers override LLM-suggested speakerTitle/speakerType to keep
    // conventions consistent across the dataset (PM = government, AISG =
    // academic, CNA = industry, etc.).
    speakerTitle: knownSpeaker?.speakerTitle ?? (raw.speakerTitle || c.channel).trim(),
    speakerTitleEn: knownSpeaker?.speakerTitleEn ?? (raw.speakerTitleEn || c.channel).trim(),
    speakerType: knownSpeaker?.speakerType ?? speakerType,
    model: process.env.SGAI_CLAUDE_MODEL || 'haiku',
    generatedAt: new Date().toISOString(),
  };

  // Sanity: every bilingual pair must be non-empty.
  for (const [zhKey, enKey] of [
    ['title', 'titleEn'],
    ['summary', 'summaryEn'],
    ['topic', 'topicEn'],
    ['speakerTitle', 'speakerTitleEn'],
  ] as const) {
    if (!fields[zhKey] || !fields[enKey]) {
      throw new Error(`generateFields: empty ${zhKey}/${enKey} for ${c.videoId}`);
    }
  }

  return fields;
}

// ── Snippet building ─────────────────────────────────────────────────────
function buildEntrySnippet(e: ApprovedEntry): string {
  const f = e.fields;
  const lines = [
    '  {',
    `    id: '${e.id}',`,
    `    title: '${escapeTsString(f.title)}',`,
    `    titleEn: '${escapeTsString(f.titleEn)}',`,
  ];
  if (f.titleJa) lines.push(`    titleJa: '${escapeTsString(f.titleJa)}',`);
  lines.push(
    `    speaker: '${escapeTsString(f.speaker)}',`,
    `    speakerTitle: '${escapeTsString(f.speakerTitle)}',`,
    `    speakerTitleEn: '${escapeTsString(f.speakerTitleEn)}',`,
  );
  if (f.speakerTitleJa) lines.push(`    speakerTitleJa: '${escapeTsString(f.speakerTitleJa)}',`);
  lines.push(
    `    speakerType: '${f.speakerType}',`,
    `    date: '${e.date}',`,
    `    duration: '${e.duration}',`,
    `    summary: '${escapeTsString(f.summary)}',`,
    `    summaryEn: '${escapeTsString(f.summaryEn)}',`,
  );
  if (f.summaryJa) lines.push(`    summaryJa: '${escapeTsString(f.summaryJa)}',`);
  lines.push(
    `    topic: '${escapeTsString(f.topic)}',`,
    `    topicEn: '${escapeTsString(f.topicEn)}',`,
  );
  if (f.topicJa) lines.push(`    topicJa: '${escapeTsString(f.topicJa)}',`);
  lines.push(
    `    youtubeUrl: '${e.youtubeUrl}',`,
    `    channel: '${escapeTsString(e.channel)}',`,
    `    addedAt: '${new Date().toISOString().slice(0, 10)}',`,
    '  },',
  );
  return lines.join('\n');
}

function spliceIntoVideosTs(content: string, snippets: string[]): string {
  // Inject right after `export const videos: VideoItem[] = [`.
  const marker = /(export const videos:\s*VideoItem\[\]\s*=\s*\[\s*\n)/;
  if (!marker.test(content)) {
    throw new Error("Could not find 'export const videos: VideoItem[] = [' marker in videos.ts");
  }
  return content.replace(marker, (_, prefix) => `${prefix}${snippets.join('\n')}\n`);
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  ensureClaudeAvailable();

  if (!existsSync(candidatesPath)) {
    console.error(`Candidates file not found: ${candidatesPath}`);
    console.error('Run scripts/videos/01_scan_channels.py first.');
    process.exit(1);
  }
  const allCands = JSON.parse(readFileSync(candidatesPath, 'utf8')) as Candidate[];
  if (!allCands.length) {
    console.error('No candidates to process.');
    process.exit(0);
  }

  const wantIds = idsArg ? new Set(idsArg.split(',').map((s) => s.trim()).filter(Boolean)) : null;
  const picked = wantIds ? allCands.filter((c) => wantIds.has(c.videoId)) : allCands;
  if (!picked.length) {
    console.error(`No candidates matched --ids=${idsArg}`);
    console.error(`Available: ${allCands.map((c) => c.videoId).join(', ')}`);
    process.exit(1);
  }

  console.log(`📋 Processing ${picked.length}/${allCands.length} candidate(s):`);
  for (const c of picked) {
    console.log(`   [${c.date}] ${c.videoId} — ${c.title.slice(0, 70)}`);
  }
  console.log();

  // Allocate IDs starting from current max + 1.
  if (!existsSync(VIDEOS_TS)) {
    throw new Error(`videos.ts not found at ${VIDEOS_TS}`);
  }
  const videosContent = readFileSync(VIDEOS_TS, 'utf8');
  const maxId = findMaxId(videosContent);
  console.log(`🔢 Current max video id in videos.ts: v${String(maxId).padStart(3, '0')}`);
  console.log(`   New entries will start at v${String(maxId + 1).padStart(3, '0')}\n`);

  // Dedup: skip any candidate whose youtube id is already present.
  const existingIds = new Set(
    Array.from(videosContent.matchAll(/youtubeUrl:\s*'https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)'/g)).map(
      (m) => m[1]
    )
  );
  const fresh = picked.filter((c) => {
    if (existingIds.has(c.videoId)) {
      console.warn(`  ⏭  Skip ${c.videoId} — already in videos.ts`);
      return false;
    }
    return true;
  });
  if (!fresh.length) {
    console.log('Nothing new to add.');
    process.exit(0);
  }

  // Generate fields per candidate (cached).
  const approved: ApprovedEntry[] = [];
  let nextNum = maxId + 1;
  for (const c of fresh) {
    const h = hashOf(c);
    let fields = force ? null : readCachedFields(c.videoId, h);
    if (fields) {
      console.log(`  📦 cache hit: ${c.videoId}`);
    } else {
      console.log(`  🤖 LLM generating bilingual fields for ${c.videoId} ...`);
      fields = await generateFields(c);
      writeCachedFields(c.videoId, h, fields);
    }
    console.log(`  ⏱  fetching duration via yt-dlp for ${c.videoId} ...`);
    const duration = getDurationViaYtDlp(c.videoId);
    approved.push({
      ...c,
      id: `v${String(nextNum).padStart(3, '0')}`,
      duration,
      fields,
    });
    nextNum += 1;
  }

  console.log(`\n✅ Built ${approved.length} bilingual entries:\n`);
  for (const e of approved) {
    console.log(`   ${e.id}  ${e.fields.title}`);
    console.log(`         ${e.fields.titleEn}`);
    console.log(`         topic: ${e.fields.topic} / ${e.fields.topicEn}`);
    console.log(`         speaker: ${e.fields.speaker} (${e.fields.speakerType}) — ${e.fields.speakerTitle}`);
    console.log(`         duration: ${e.duration}\n`);
  }

  // Translate to ja.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const jaValues = await translateBatch(
      approved.flatMap((e) => [e.fields.title, e.fields.summary, e.fields.topic, e.fields.speakerTitle]),
      { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }
    );
    for (let i = 0; i < approved.length; i++) {
      approved[i].fields.titleJa = jaValues[i * 4] || undefined;
      approved[i].fields.summaryJa = jaValues[i * 4 + 1] || undefined;
      approved[i].fields.topicJa = jaValues[i * 4 + 2] || undefined;
      approved[i].fields.speakerTitleJa = jaValues[i * 4 + 3] || undefined;
    }
    console.log(`  translated ${approved.length} entries to ja`);
  } catch (e) {
    console.warn(`  [warn] ja translation failed: ${e instanceof Error ? e.message : e}`);
  }

  if (dryRun) {
    console.log('--dry-run set; not modifying videos.ts.');
    return;
  }

  // Splice into videos.ts.
  const snippets = approved.map(buildEntrySnippet);
  const updated = spliceIntoVideosTs(videosContent, snippets);
  writeFileSync(VIDEOS_TS, updated);
  console.log(`✏️  Wrote ${approved.length} new entries to ${VIDEOS_TS}`);

  // Run prettier on the file.
  const prettier = spawnSync('npx', ['prettier', '--write', VIDEOS_TS], {
    encoding: 'utf8',
    cwd: ROOT,
  });
  if (prettier.status !== 0) {
    console.warn(`  ⚠ prettier exited ${prettier.status}: ${(prettier.stderr || '').slice(0, 200)}`);
  } else {
    console.log('  ✓ prettier formatted');
  }

  // Source-level i18n pair check (must pass before commit).
  const issues = findUnpairedFields(VIDEOS_TS, {
    fields: ['title', 'summary', 'topic', 'speakerTitle'],
  });
  if (issues.length) {
    console.error(`\n❌ i18n-pair check failed (${issues.length} issue(s)):`);
    for (const issue of issues.slice(0, 10)) {
      console.error(`   ${issue.file}:${issue.line}  ${issue.field}  ${issue.reason}`);
    }
    process.exit(1);
  }
  console.log('  ✓ i18n-pair source check clean');

  // Transcript pipeline: fetch en captions via yt-dlp, then translate to zh
  // via the local Claude CLI. The video detail page (/videos/<id>/) reads
  // src/data/video-transcripts.ts; without this step new videos render with
  // an empty transcript section. Honoured unless --skip-transcripts is set.
  // Failures here do NOT abort the pipeline — we still want the video card
  // to appear on the listing page even if transcript fetch fails (e.g.
  // YouTube auto-caption disabled). User can re-run the transcript step
  // alone via `npm run fetch:video-transcripts -- --ids=...` afterwards.
  if (skipTranscripts) {
    console.log('  ⏭  --skip-transcripts set; not fetching/translating captions.');
  } else {
    const newIds = approved.map((e) => e.id).join(',');
    console.log(`\n📝 Fetching transcripts via yt-dlp for ${newIds} ...`);
    const fetchR = spawnSync('npm', ['run', 'fetch:video-transcripts', '--', `--ids=${newIds}`], {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: 'inherit',
    });
    if (fetchR.status !== 0) {
      console.warn(`  ⚠ fetch:video-transcripts exited ${fetchR.status} — listing will still show videos but detail pages may have no transcript.`);
    } else {
      console.log('  ✓ transcripts fetched');
      console.log(`\n🌐 Translating en→zh via Claude CLI for ${newIds} ...`);
      const translateR = spawnSync('npm', ['run', 'translate:video-transcripts', '--', `--ids=${newIds}`], {
        encoding: 'utf8',
        cwd: ROOT,
        stdio: 'inherit',
      });
      if (translateR.status !== 0) {
        console.warn(`  ⚠ translate:video-transcripts exited ${translateR.status} — re-run manually before merging PR.`);
      } else {
        console.log('  ✓ transcripts translated + video-transcripts.ts regenerated');
      }
    }
  }

  if (noCommit) {
    console.log('\n--no-commit set; leaving working tree dirty for manual review.');
    return;
  }

  // The "最近更新" homepage feed derives from each video's addedAt field
  // (set in buildEntrySnippet above) via src/utils/derived-updates.ts.
  // No manual appendUpdate call needed — that double-source-of-truth path
  // was the cause of the 2026-05-09 drift bug.

  // Auto-commit.
  const commitMsg = `data(videos): add ${approved.length} new SG AI video${approved.length > 1 ? 's' : ''}

${approved.map((e) => `- ${e.id} [${e.date}] ${e.fields.title}`).join('\n')}`;
  const commitFiles: string[] = [VIDEOS_TS];
  if (existsSync(VIDEO_TRANSCRIPTS_TS)) commitFiles.push(VIDEO_TRANSCRIPTS_TS);
  const commit = autoCommit({
    domain: 'videos',
    // video-transcripts.ts may have been regenerated by the transcript step;
    // include it whenever it's dirty so transcripts ship with the same PR.
    files: commitFiles,
    message: commitMsg,
    allowDirtyPaths: ['scripts/refresh/videos/data/', 'scripts/videos/data/'],
  });
  console.log(`\n📦 Committed ${commit.sha.slice(0, 7)} on branch ${commit.branch}`);

  if (noPush) {
    console.log('--no-push set; branch left local. Push manually when ready.');
    return;
  }

  // Push + open PR.
  const prBody = buildPRBody({
    domain: 'videos',
    diffStat: commit.diffStat,
    newEntries: approved.map((e) => ({
      title: e.fields.title,
      sourceUrl: e.youtubeUrl,
      confidence: 'high' as const,
    })),
  });
  const pr = await pushAndOpenPR({
    branch: commit.branch,
    title: `[data-refresh] videos: +${approved.length} new SG AI video${approved.length > 1 ? 's' : ''}`,
    body: prBody,
  });
  if (pr.error) {
    console.error(`\n❌ PR step failed: ${pr.error}`);
    process.exit(1);
  }
  if (pr.pr) {
    console.log(`\n🎉 PR opened: ${pr.pr.url}`);
  } else {
    console.log(`\n✓ Pushed ${pr.branch} (no PR opened)`);
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err instanceof Error ? err.stack || err.message : String(err)}`);
  process.exit(1);
});

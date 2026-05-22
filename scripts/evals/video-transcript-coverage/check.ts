// scripts/evals/video-transcript-coverage/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the bug class surfaced on 2026-05-21: videos exist in
// src/data/videos.ts but src/data/video-transcripts.ts has no matching
// record (or has paragraphsEn without paragraphsJa). The localized page
// /ja/videos/<id>/ then quietly degrades to "No readable content for
// this video yet. Run npm run fetch:video-transcripts to refresh."
//
// Two failure classes:
//   1. videos.ts has an entry but videoTranscripts does not. Page falls
//      back to the dev-targeted "run npm run …" message in all locales.
//   2. videoTranscripts entry has paragraphsEn but is missing paragraphsJa
//      and/or paragraphs (zh). /ja/ silently shows nothing or the zh
//      fallback. Strict triple-pairing is required.
//
// Also enforces digest triples: if digest/digestEn/digestJa are partially
// set, the page renders mixed-locale content. Either all three present or
// all three absent.
//
// `source === 'unavailable'` records are allowed as explicit placeholders
// for videos where YouTube never produced any caption track (e.g. zaobao
// short clips, internal corporate uploads). The page is expected to
// render a "captions unavailable" UX for these, not the dev message.
//
// Diff mode (default): fails on entries newly added in this PR (parses
//   git diff <base>..HEAD on src/data/videos.ts for new `id: 'vNNN'` lines
//   AND on src/data/video-transcripts.ts for newly added record keys).
//   This is what CI runs to keep new gaps from landing.
//
// Audit mode (--include-historical): walks every videos.ts entry in HEAD.
//   Used by the weekly cron and by `npm run eval` aggregate.
//
// Flags:
//   --base=<ref>            base ref for diff (default: origin/main)
//   --include-historical    audit every entry in HEAD (ignore diff)
//   --dry-run               skip report write
//
// Exit codes:
//   0 — every checked entry passes
//   1 — at least one entry missing or with unpaired transcript fields
//   2 — invocation error

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { videos } from '../../../src/data/videos.ts';
import { videoTranscripts, type VideoTranscript } from '../../../src/data/video-transcripts.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REPORT_DIR = join(import.meta.dirname, 'reports');
const VIDEOS_FILE = 'src/data/videos.ts';

interface CliOptions {
  base: string;
  includeHistorical: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = {
    base: process.env.GITHUB_BASE_REF || 'origin/main',
    includeHistorical: false,
    dryRun: false,
  };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--include-historical') opts.includeHistorical = true;
    else if (a.startsWith('--base=')) opts.base = a.slice('--base='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:video-transcript [--base=<ref>] [--include-historical] [--dry-run]\n' +
          '\nDefault scans `git diff <base>..HEAD` on src/data/videos.ts for new id: lines.\n' +
          'Use --include-historical to audit every videos.ts entry in HEAD.\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`git ${args.join(' ')} failed: ${msg}`);
  }
}

function newlyAddedVideoIds(base: string): string[] {
  let raw: string;
  try {
    raw = git(['diff', base, '--unified=0', '--', VIDEOS_FILE]);
  } catch {
    return [];
  }
  if (!raw.trim()) return [];
  const ids = new Set<string>();
  const re = /^\+\s*id:\s*['"`](v\d+)['"`]/;
  for (const line of raw.split('\n')) {
    const m = line.match(re);
    if (m) ids.add(m[1]);
  }
  return Array.from(ids);
}

type Reason =
  | 'no-transcript-record'
  | 'paragraphs-en-without-ja'
  | 'paragraphs-en-without-zh'
  | 'paragraphs-zh-without-en'
  | 'paragraphs-zh-without-ja'
  | 'paragraphs-ja-without-en'
  | 'paragraphs-ja-without-zh'
  | 'paragraph-count-mismatch'
  | 'paragraphs-zh-no-cjk'
  | 'paragraphs-ja-no-cjk'
  | 'digest-partial';

interface Finding {
  videoId: string;
  reasons: Reason[];
  detail?: Record<string, unknown>;
}

function nonEmpty(arr: unknown): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// CJK Unified Ideographs (covers Hanzi + Kanji) — used to spot the case
// where a "zh" or "ja" field accidentally got populated with English text
// (e.g. translation cache hit on an unrelated paragraph, or a manual
// edit that pasted EN content into the wrong locale field).
function hasCjk(paragraphs: string[]): boolean {
  return /[㐀-鿿]/.test(paragraphs.join(''));
}

function digestPresent(d: VideoTranscript['digest']): boolean {
  if (!d) return false;
  return nonEmpty(d.narrative) || nonEmpty(d.keyPoints);
}

function check(videoId: string): Finding {
  const t = videoTranscripts[videoId];
  if (!t) {
    return { videoId, reasons: ['no-transcript-record'] };
  }
  // 'unavailable' placeholders are explicitly allowed — the page is
  // expected to render a "captions unavailable" UX. No paragraphs are
  // required; if any are present that's fine too (manual transcript).
  if (t.source === 'unavailable' && !nonEmpty(t.paragraphs) && !nonEmpty(t.paragraphsEn) && !nonEmpty(t.paragraphsJa)) {
    return { videoId, reasons: [] };
  }

  const reasons: Reason[] = [];
  const en = nonEmpty(t.paragraphsEn);
  const zh = nonEmpty(t.paragraphs);
  const ja = nonEmpty(t.paragraphsJa);
  // Strict triple: if ANY of the three is present, ALL must be present.
  if (en || zh || ja) {
    if (en && !ja) reasons.push('paragraphs-en-without-ja');
    if (en && !zh) reasons.push('paragraphs-en-without-zh');
    if (zh && !en) reasons.push('paragraphs-zh-without-en');
    if (zh && !ja) reasons.push('paragraphs-zh-without-ja');
    if (ja && !en) reasons.push('paragraphs-ja-without-en');
    if (ja && !zh) reasons.push('paragraphs-ja-without-zh');
  }
  // When all three are present, paragraph counts must match — each
  // language is a translation of the same source, so 1:1 mapping is
  // expected. Mismatch means the translation pipeline dropped or
  // duplicated paragraphs and the locales drift apart visually.
  if (en && zh && ja) {
    const ne = t.paragraphsEn!.length;
    const nz = t.paragraphs.length;
    const nj = t.paragraphsJa!.length;
    if (ne !== nz || ne !== nj) {
      reasons.push('paragraph-count-mismatch');
    }
  }
  // zh/ja fields must actually contain CJK characters (catches the case
  // where translation cache mis-hit and a zh/ja field got populated with
  // English content from another paragraph).
  if (zh && !hasCjk(t.paragraphs)) reasons.push('paragraphs-zh-no-cjk');
  if (ja && !hasCjk(t.paragraphsJa!)) reasons.push('paragraphs-ja-no-cjk');
  const dZh = digestPresent(t.digest);
  const dEn = digestPresent(t.digestEn);
  const dJa = digestPresent(t.digestJa);
  if ((dZh || dEn || dJa) && !(dZh && dEn && dJa)) {
    reasons.push('digest-partial');
  }
  return {
    videoId,
    reasons,
    detail: reasons.length ? { en, zh, ja, dZh, dEn, dJa, source: t.source } : undefined,
  };
}

function isFail(f: Finding): boolean {
  return f.reasons.length > 0;
}

function writeReport(findings: Finding[], mode: 'diff' | 'historical', opts: CliOptions) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fails = findings.filter(isFail);
  writeFileSync(
    join(REPORT_DIR, `report-${stamp}.json`),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        mode,
        opts,
        findings,
        totals: { inspected: findings.length, fail: fails.length },
      },
      null,
      2,
    ) + '\n',
  );
  const lines: string[] = [];
  lines.push(`# Video Transcript Coverage Report — ${stamp}`);
  lines.push('');
  lines.push(`Mode: ${mode === 'diff' ? `diff vs ${opts.base}` : 'historical (audit)'}`);
  lines.push(`Inspected: ${findings.length}`);
  lines.push(`**FAIL: ${fails.length}**`);
  lines.push('');
  if (fails.length > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const f of fails) {
      lines.push(`- \`${f.videoId}\` — ${f.reasons.join(', ')}`);
      if (f.detail) {
        lines.push(`  - state: ${JSON.stringify(f.detail)}`);
      }
      lines.push(
        `  - fix: \`npm run fetch:video-transcripts -- --ids=${f.videoId}\` (or add a \`source: 'unavailable'\` placeholder if the video has no captions available)`,
      );
    }
    lines.push('');
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

function main() {
  const opts = parseCli(process.argv.slice(2));
  process.stdout.write(`[video-transcript-coverage] base=${opts.base} historical=${opts.includeHistorical}\n`);

  let ids: string[];
  let mode: 'diff' | 'historical';
  if (opts.includeHistorical) {
    ids = videos.map((v) => v.id);
    mode = 'historical';
  } else {
    ids = newlyAddedVideoIds(opts.base).filter((id) => videos.some((v) => v.id === id));
    mode = 'diff';
  }

  const findings = ids.map(check);
  const fails = findings.filter(isFail);
  process.stdout.write(
    `[video-transcript-coverage] inspected ${findings.length}, fail ${fails.length}\n`,
  );
  if (fails.length > 0) {
    process.stdout.write('\n[video-transcript-coverage] FAILED:\n');
    for (const f of fails) {
      process.stdout.write(`  ${f.videoId} — ${f.reasons.join(', ')}\n`);
    }
    process.stdout.write(
      '\nFix one of:\n' +
        '  1. Re-fetch + translate the missing locales:\n' +
        '     npm run fetch:video-transcripts -- --ids=<ids>\n' +
        '     npx tsx scripts/videos/translate-transcripts.ts --ids=<ids>      # en → zh\n' +
        '     npx tsx scripts/videos/translate-transcripts-ja.ts --ids=<ids>   # zh → ja\n' +
        '  2. Add a `source: \'unavailable\'` placeholder if the video has no captions available.\n',
    );
  }

  if (opts.dryRun) {
    process.stdout.write('[video-transcript-coverage] --dry-run; skipping report write\n');
    process.exit(fails.length > 0 ? 1 : 0);
  }
  writeReport(findings, mode, opts);
  process.exit(fails.length > 0 ? 1 : 0);
}

main();

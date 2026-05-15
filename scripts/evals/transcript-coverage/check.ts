// scripts/evals/transcript-coverage/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the bug class surfaced on 2026-05-15: a new mddiSpeeches entry
// landed in src/data/voices.ts (commit b460b22, NANA speech) but
// src/data/speech-transcripts.ts was never updated, so the live page
// /zh/speeches/<id>/ rendered the "此演讲尚未本地存档" fallback instead
// of the full archive.
//
// The route src/pages/[lang]/speeches/[id].astro is derived from
// mddiSpeeches.map, so adding a voices.ts record immediately creates a
// route even when speech-transcripts.ts has no matching entry. The page
// then quietly degrades.
//
// Logic:
//   For each mddiSpeeches entry in voices.ts, derive speechId from its
//   url (slug after /newsroom/) and require speechTranscripts[speechId]
//   to exist with non-empty paragraphsEn (the route's hasLocalCopy
//   condition) AND non-empty paragraphs (zh translation, so the page
//   isn't "EN-only" on /zh/).
//
// Diff mode (default): fails on entries newly added in this PR (parses
//   git diff <base>..HEAD on src/data/voices.ts for new url: lines).
//   This is what CI runs to keep the bug from re-landing.
//
// Audit mode (--include-historical): walks every mddiSpeeches entry in
//   HEAD. Useful for one-off backlog reports.
//
// Flags:
//   --base=<ref>            base ref for diff (default: 'main')
//   --include-historical    audit every entry in HEAD (ignore diff)
//   --dry-run               skip report write
//
// Exit codes:
//   0 — every checked entry has a complete transcript
//   1 — at least one entry missing transcript or with empty paragraphs
//   2 — invocation error

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { mddiSpeeches } from '../../../src/data/voices.ts';
import { speechTranscripts, speechIdFromUrl, type SpeechTranscript } from '../../../src/data/speech-transcripts.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REPORT_DIR = join(import.meta.dirname, 'reports');
const VOICES_FILE = 'src/data/voices.ts';

interface CliOptions {
  base: string;
  includeHistorical: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = {
    base: process.env.GITHUB_BASE_REF || 'main',
    includeHistorical: false,
    dryRun: false,
  };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--include-historical') opts.includeHistorical = true;
    else if (a.startsWith('--base=')) opts.base = a.slice('--base='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:transcript-coverage [--base=<ref>] [--include-historical] [--dry-run]\n' +
          '\nDefault scans `git diff <base>..HEAD` on src/data/voices.ts for new mddiSpeeches urls.\n' +
          'Use --include-historical to scan every entry in HEAD.\n',
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

function newlyAddedSpeechUrls(base: string): string[] {
  let raw: string;
  try {
    raw = git(['diff', base, '--unified=0', '--', VOICES_FILE]);
  } catch {
    return [];
  }
  if (!raw.trim()) return [];
  const urls = new Set<string>();
  const re = /^\+\s*url:\s*['"`](https?:\/\/www\.mddi\.gov\.sg\/newsroom\/[^'"`]+)['"`]/;
  for (const line of raw.split('\n')) {
    const m = line.match(re);
    if (m) urls.add(m[1]);
  }
  return Array.from(urls);
}

interface Finding {
  speechId: string;
  url: string;
  missingTranscript: boolean;
  emptyParagraphsEn: boolean;
  emptyParagraphs: boolean;
}

function check(url: string): Finding {
  const sid = speechIdFromUrl(url);
  const t: SpeechTranscript | undefined = speechTranscripts[sid];
  if (!t) {
    return {
      speechId: sid,
      url,
      missingTranscript: true,
      emptyParagraphsEn: true,
      emptyParagraphs: true,
    };
  }
  return {
    speechId: sid,
    url,
    missingTranscript: false,
    emptyParagraphsEn: (t.paragraphsEn ?? []).length === 0,
    emptyParagraphs: (t.paragraphs ?? []).length === 0,
  };
}

function isFail(f: Finding): boolean {
  return f.missingTranscript || f.emptyParagraphsEn || f.emptyParagraphs;
}

function reasonsOf(f: Finding): string[] {
  if (f.missingTranscript) return ['no speechTranscripts entry'];
  const r: string[] = [];
  if (f.emptyParagraphsEn) r.push('paragraphsEn empty');
  if (f.emptyParagraphs) r.push('paragraphs (zh) empty');
  return r;
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
  lines.push(`# transcript Coverage Report — ${stamp}`);
  lines.push('');
  lines.push(`Mode: ${mode === 'diff' ? `diff vs ${opts.base}` : 'historical (audit)'}`);
  lines.push(`Inspected: ${findings.length}`);
  lines.push(`**FAIL: ${fails.length}**`);
  lines.push('');
  if (fails.length > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const f of fails) {
      lines.push(`- \`${f.speechId}\` — ${reasonsOf(f).join(', ')}`);
      lines.push(`  - url: ${f.url}`);
      lines.push(
        `  - fix: run \`scripts/voices/02_fetch_speeches.py --id ${f.speechId}\`, translate paragraphs+tldr to scripts/voices/data/translations/${f.speechId}.json, append the entry to src/data/speech-transcripts.ts (do NOT rerun 03_generate_ts.py — it full-rebuilds and will drop existing entries when data/speeches/ is sparse).`,
      );
    }
    lines.push('');
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

function main() {
  const opts = parseCli(process.argv.slice(2));
  process.stdout.write(`[transcript-coverage] base=${opts.base} historical=${opts.includeHistorical}\n`);

  let urls: string[];
  let mode: 'diff' | 'historical';
  if (opts.includeHistorical) {
    urls = mddiSpeeches.map((s) => s.url);
    mode = 'historical';
  } else {
    urls = newlyAddedSpeechUrls(opts.base);
    mode = 'diff';
  }

  const findings = urls.map(check);
  const fails = findings.filter(isFail);
  process.stdout.write(
    `[transcript-coverage] inspected ${findings.length}, fail ${fails.length}\n`,
  );
  if (fails.length > 0) {
    process.stdout.write('\n[transcript-coverage] FAILED:\n');
    for (const f of fails) {
      process.stdout.write(`  ${f.speechId} — ${reasonsOf(f).join(', ')}\n`);
      process.stdout.write(`    url: ${f.url}\n`);
    }
  }

  if (opts.dryRun) {
    process.stdout.write('[transcript-coverage] --dry-run; skipping report write\n');
    process.exit(fails.length > 0 ? 1 : 0);
  }
  writeReport(findings, mode, opts);
  process.exit(fails.length > 0 ? 1 : 0);
}

main();

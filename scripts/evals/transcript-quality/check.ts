// scripts/evals/transcript-quality/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the bug class surfaced on 2026-06-20: fetched MDDI transcript
// bodies leaked page chrome — the "Newsroom <Title> Speeches" breadcrumb
// and the "This article has been migrated…" CMS notice — as transcript
// paragraphs. Every existing check passed them: i18n-pair only verifies
// *En/*Ja/*Ko pairing, transcript-coverage only verifies non-emptiness.
// None looks at CONTENT, so the only way it was caught was a human
// spot-check of the first backfill batch.
//
// This eval looks at content: for each speech's transcript it scans the
// English paragraphs + tldr against the shared NOISE_PATTERNS
// (scripts/lib/transcript-noise.ts) and fails if any match.
//
// Diff mode (default, CI): scans speeches newly added in this PR (git diff
//   <base>..HEAD on src/data/voices.ts for new url: lines). Keeps the bug
//   from re-landing.
// Audit mode (--include-historical): scans every transcript in HEAD.
//   Weekly cron uses this to sweep the back catalogue.
//
// Flags:  --base=<ref>  --include-historical  --dry-run
// Exit:   0 clean | 1 noise found | 2 invocation error

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { mddiSpeeches } from '../../../src/data/voices.ts';
import { speechTranscripts, speechIdFromUrl } from '../../../src/data/speech-transcripts.ts';
import { findNoiseParagraphs, type NoiseHit } from '../../lib/transcript-noise.ts';

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
        'Usage: eval:transcript-quality [--base=<ref>] [--include-historical] [--dry-run]\n' +
          '\nDefault scans `git diff <base>..HEAD` on src/data/voices.ts for new speeches.\n' +
          'Use --include-historical to scan every transcript in HEAD.\n',
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
  noise: NoiseHit[];
}

function check(url: string): Finding {
  const sid = speechIdFromUrl(url);
  const t = speechTranscripts[sid];
  // A missing/empty transcript is transcript-coverage's job, not ours.
  if (!t) return { speechId: sid, url, noise: [] };
  const noise = [
    ...findNoiseParagraphs(t.paragraphsEn ?? []),
    ...findNoiseParagraphs(t.tldrEn ?? []),
  ];
  return { speechId: sid, url, noise };
}

function isFail(f: Finding): boolean {
  return f.noise.length > 0;
}

function writeReport(findings: Finding[], mode: 'diff' | 'historical', opts: CliOptions): void {
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
        findings: findings.filter(isFail),
        totals: { inspected: findings.length, fail: fails.length },
      },
      null,
      2,
    ) + '\n',
  );
  const lines: string[] = [];
  lines.push(`# Transcript Quality Report — ${stamp}`);
  lines.push('');
  lines.push(`Mode: ${mode === 'diff' ? `diff vs ${opts.base}` : 'historical (audit)'}`);
  lines.push(`Inspected: ${findings.length}`);
  lines.push(`**FAIL: ${fails.length}**`);
  lines.push('');
  if (fails.length > 0) {
    lines.push('## Noise found (page chrome leaked into transcript body)');
    lines.push('');
    for (const f of fails) {
      lines.push(`- \`${f.speechId}\``);
      for (const h of f.noise) {
        lines.push(`  - [${h.label}] paragraph #${h.index}: ${JSON.stringify(h.text)}`);
      }
      lines.push(
        `  - fix: the leak comes from fetch extraction. Add the pattern to scripts/lib/transcript-noise.ts NOISE_PATTERNS, then re-run \`npx tsx scripts/refresh/voices/run.ts --ids=${f.speechId}\` to regenerate the transcript.`,
      );
    }
    lines.push('');
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

function main(): void {
  const opts = parseCli(process.argv.slice(2));
  process.stdout.write(`[transcript-quality] base=${opts.base} historical=${opts.includeHistorical}\n`);

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

  if (!opts.dryRun) writeReport(findings, mode, opts);

  process.stdout.write(`[transcript-quality] inspected ${findings.length}, fail ${fails.length}\n`);
  if (fails.length > 0) {
    process.stdout.write('[transcript-quality] NOISE FOUND:\n');
    for (const f of fails) {
      process.stdout.write(`  ${f.speechId} — ${f.noise.map((h) => `[${h.label}] #${h.index}`).join(', ')}\n`);
    }
    process.exit(1);
  }
}

main();

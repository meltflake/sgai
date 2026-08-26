// scripts/evals/markdown-export/check.ts
// ────────────────────────────────────────────────────────────────────────
// Markdown-twin eval — assert every `dist/**/*.md` page export is a
// well-formed, attributable document.
//
// WHY
//   Detail pages ship a Markdown twin at `<page path minus trailing
//   slash>.md` so agents (ChatGPT / Perplexity / Claude) and readers who
//   paste a page into an LLM get the transcript, not a link index. Those
//   files are generated from data records via src/utils/markdown-export.ts,
//   which means the usual failure mode is silent: an optional field goes
//   missing and the file grows a literal `undefined`, or an object lands
//   where a string was expected and prints `[object Object]`. Neither is a
//   type error and neither shows up in `check:i18n` — the dist-level i18n
//   scanner only reads *.html.
//
//   So the four assertions below are the contract for a usable twin:
//     1. first line is an H1        → the doc has a title, not a stray blank
//     2. a `- sgai: https://sgai.md/` line → it is attributable back to the page
//     3. the CC BY 4.0 license marker      → reuse terms travel with the text
//     4. no `undefined` / `[object Object]` → no field-access rot
//
// USAGE
//   npx tsx scripts/evals/markdown-export/check.ts
//   npx tsx scripts/evals/markdown-export/check.ts --dist=path/to/dist
//   npx tsx scripts/evals/markdown-export/check.ts --sample=50
//
// EXIT CODES
//   0 — every sampled file passes
//   1 — at least one assertion failed (file paths printed)
//   2 — invocation error (no dist, no .md files found)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** Sections whose `.md` twins we sample. Order is the reporting order. */
export const SECTIONS = ['debates', 'policies', 'videos'] as const;
export type Section = (typeof SECTIONS)[number];

/** Default number of files sampled per section. */
export const DEFAULT_SAMPLE = 20;

export interface Violation {
  /** Short machine-readable rule id. */
  rule: 'missing-h1' | 'missing-permalink' | 'missing-license' | 'undefined-literal' | 'object-literal';
  /** Human-readable explanation, including the offending excerpt when useful. */
  detail: string;
}

/** Marker that must appear on the permalink line of every twin. */
const PERMALINK_PREFIX = '- sgai: https://sgai.md/';
/** Marker for the license line (see src/utils/license.ts). */
const LICENSE_MARKER = 'CC BY 4.0';

/**
 * Pure assertion core — everything the eval knows about a "good" twin.
 * Kept free of fs/process so the unit test can exercise it directly.
 */
export function assertMarkdownTwin(content: string): Violation[] {
  const out: Violation[] = [];

  const firstLine = content.split('\n', 1)[0] ?? '';
  if (!firstLine.startsWith('# ')) {
    out.push({ rule: 'missing-h1', detail: `first line is not an H1: ${JSON.stringify(firstLine.slice(0, 80))}` });
  }

  const hasPermalink = content.split('\n').some((line) => line.startsWith(PERMALINK_PREFIX));
  if (!hasPermalink) {
    out.push({ rule: 'missing-permalink', detail: `no line starting with "${PERMALINK_PREFIX}"` });
  }

  if (!content.includes(LICENSE_MARKER)) {
    out.push({ rule: 'missing-license', detail: `license marker "${LICENSE_MARKER}" not found` });
  }

  // `undefined` as a standalone word: a template that interpolated a
  // missing field. Matching on a word boundary keeps prose like
  // "undefined behaviour" out of the way only when it is genuinely part
  // of a larger word, so we also require it not to be preceded by a
  // letter — good enough, and a real transcript saying the bare word
  // "undefined" is vanishingly rare compared to the bug it catches.
  const undefinedMatch = /(^|[^A-Za-z_$])undefined([^A-Za-z0-9_$]|$)/.exec(content);
  if (undefinedMatch) {
    out.push({ rule: 'undefined-literal', detail: `literal "undefined" at index ${undefinedMatch.index}` });
  }

  const objectIdx = content.indexOf('[object Object]');
  if (objectIdx >= 0) {
    out.push({ rule: 'object-literal', detail: `literal "[object Object]" at index ${objectIdx}` });
  }

  return out;
}

/** Recursively yield every *.md under `root`, skipping `dist/skill/`. */
export function* walkMarkdown(root: string, distRoot: string): Generator<string> {
  if (!existsSync(root)) return;
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      // dist/skill/ ships hand-written agent skill docs, not page twins.
      if (full === join(distRoot, 'skill')) continue;
      yield* walkMarkdown(full, distRoot);
    } else if (entry.endsWith('.md')) {
      yield full;
    }
  }
}

/** Which section a dist-relative path belongs to, or undefined if none. */
export function sectionOf(relPath: string): Section | undefined {
  const parts = relPath.split(sep);
  return SECTIONS.find((s) => parts.includes(s));
}

interface Failure {
  file: string;
  violations: Violation[];
}

function main(): void {
  let distRoot = 'dist';
  let sampleSize = DEFAULT_SAMPLE;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--dist=')) distRoot = a.slice('--dist='.length);
    else if (a.startsWith('--sample=')) sampleSize = Number(a.slice('--sample='.length)) || DEFAULT_SAMPLE;
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: check:markdown-export [--dist=dist] [--sample=20]\n' +
          '\nSamples dist/**/*.md page twins per section and asserts each is a\n' +
          'well-formed, attributable Markdown document.\n',
      );
      process.exit(0);
    }
  }

  const projectRoot = process.cwd();
  const dist = join(projectRoot, distRoot);
  if (!existsSync(dist)) {
    process.stderr.write(`[markdown-export] No ${distRoot}/ at ${dist}. Run 'npm run build' first.\n`);
    process.exit(2);
  }

  const bySection = new Map<Section, string[]>();
  let totalFound = 0;
  for (const file of walkMarkdown(dist, dist)) {
    totalFound++;
    const section = sectionOf(relative(dist, file));
    if (!section) continue;
    const arr = bySection.get(section) ?? [];
    arr.push(file);
    bySection.set(section, arr);
  }

  if (totalFound === 0) {
    process.stderr.write(`[markdown-export] No *.md files under ${distRoot}/. Did the .md routes build?\n`);
    process.exit(2);
  }

  const failures: Failure[] = [];
  let checked = 0;
  for (const section of SECTIONS) {
    const files = (bySection.get(section) ?? []).sort();
    if (files.length === 0) {
      process.stderr.write(`[markdown-export] section "${section}" has no *.md twins in ${distRoot}/.\n`);
      process.exit(2);
    }
    // Even stride across the sorted list so the sample spans locales
    // (dist/debates/… and dist/ja/debates/… interleave after sorting).
    const stride = Math.max(1, Math.ceil(files.length / sampleSize));
    const sample = files.filter((_, i) => i % stride === 0).slice(0, sampleSize);
    for (const file of sample) {
      checked++;
      const violations = assertMarkdownTwin(readFileSync(file, 'utf8'));
      if (violations.length > 0) failures.push({ file: relative(projectRoot, file), violations });
    }
    process.stdout.write(`[markdown-export] ${section}: ${files.length} twin(s), sampled ${sample.length}\n`);
  }

  process.stdout.write(`[markdown-export] ${totalFound} *.md file(s) in ${distRoot}/, ${checked} checked\n`);

  if (failures.length === 0) {
    process.stdout.write('[markdown-export] ✔ all sampled Markdown twins well-formed\n');
    process.exit(0);
  }

  process.stderr.write(`[markdown-export] ✘ ${failures.length} file(s) failed:\n`);
  for (const f of failures) {
    process.stderr.write(`    ${f.file}\n`);
    for (const v of f.violations) process.stderr.write(`      ${v.rule}: ${v.detail}\n`);
  }
  process.stderr.write(
    '[markdown-export] Fix: see src/utils/markdown-export.ts — every localized field must go through pickLocalized, and the permalink + licenseLine() lines are mandatory.\n',
  );
  process.exit(1);
}

// Run as CLI only — importing this module from a unit test must not touch
// the fs or call process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('markdown-export/check.ts')) {
  main();
}

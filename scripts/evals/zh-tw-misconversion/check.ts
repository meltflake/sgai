// scripts/evals/zh-tw-misconversion/check.ts
// ────────────────────────────────────────────────────────────────────────
// zh-tw Misconversion eval — scan dist/zh-tw/**/*.html for OpenCC s2twp
// phrase-substitution mistakes that the PROTECTED_TERMS pipeline
// (src/i18n/protected-terms.ts) is supposed to prevent.
//
// Why: even with PROTECTED_TERMS in place, the protection only fires on
// strings that flow through `toTraditional()` in src/i18n/opencc.ts. A
// future code path that bypasses the converter — direct rendering of a
// zh field on a zh-tw page, or a third-party library that monkey-patches
// the converter — would silently re-introduce the very mistakes we just
// fixed. This eval runs on the built dist and asserts: nowhere in any
// /zh-tw/ page should the known-bad rendering appear.
//
// Usage:
//   npx tsx scripts/evals/zh-tw-misconversion/check.ts
//   npx tsx scripts/evals/zh-tw-misconversion/check.ts --dist=path/to/dist
//   npx tsx scripts/evals/zh-tw-misconversion/check.ts --json
//
// Exit codes:
//   0 — clean, no misconversions found
//   1 — at least one misconversion match
//   2 — invocation error (no dist, no html files, etc.)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

interface Misconversion {
  /** The wrong Traditional rendering that should never appear in /zh-tw/. */
  pattern: string;
  /** The correct Traditional rendering (what the source intends). */
  expected: string;
  /** Short tag explaining what brand/institution this protects. */
  note: string;
}

// MUST stay in sync with src/i18n/protected-terms.ts. Each MISCONVERSIONS
// entry is an OpenCC output substring that should never appear on a
// /zh-tw/ page assuming PROTECTED_TERMS protection is working.
//
// CRITICAL: only include patterns that are unambiguous — i.e. no
// legitimate source form would produce the same output via OpenCC's
// char-only conversion. For example, 資訊部 is intentionally NOT
// listed because some sgai content uses 资讯部 (a valid sg variant of
// MCI's Chinese name) which char-converts cleanly to 資訊部. Same logic
// excludes 資訊通訊媒體發展局 and 資訊通訊發展局 — both have 资讯-form
// source variants in the data. Those cases are covered by unit tests
// (scripts/lib/__tests__/opencc-protected-terms.test.ts) instead.
//
// Patterns kept here are MDDI/MICA/MCCY-specific names where sgai's
// source corpus only ever uses the 信息 / 社区 forms. Any occurrence
// of the resp/ 資訊 / 社群 form in dist/zh-tw/ is a real bug.
const MISCONVERSIONS: ReadonlyArray<Misconversion> = [
  { pattern: '數字發展與資訊部', expected: '數字發展與信息部', note: 'MDDI full name' },
  { pattern: '資訊通訊媒體發展部', expected: '信息通信媒體發展部', note: 'IMDA variant (older)' },
  { pattern: '資訊通訊媒體部', expected: '信息通信媒體部', note: 'IMDA variant' },
  { pattern: '資訊通訊及藝術部', expected: '信息通信及藝術部', note: 'MICA variant' },
  { pattern: '資訊通訊與藝術部', expected: '信息通信與藝術部', note: 'MICA variant' },
  { pattern: '資訊與媒體部', expected: '信息與媒體部', note: 'sg info ministry variant' },
  { pattern: '文化、社群及青年部', expected: '文化、社區及青年部', note: 'MCCY' },
];

// File walker — recursively yield every *.html under root.
function* walkHtml(root: string): Generator<string> {
  const entries = readdirSync(root);
  for (const e of entries) {
    const full = join(root, e);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walkHtml(full);
    } else if (e.endsWith('.html')) {
      yield full;
    }
  }
}

interface Hit {
  file: string;
  pattern: string;
  expected: string;
  note: string;
  /** Number of matches in this file. */
  count: number;
  /** First excerpt around the match for grepping context. */
  excerpt: string;
}

function scanFile(file: string, projectRoot: string): Hit[] {
  const content = readFileSync(file, 'utf-8');
  const hits: Hit[] = [];
  for (const m of MISCONVERSIONS) {
    let idx = content.indexOf(m.pattern);
    if (idx < 0) continue;
    let count = 0;
    while (idx >= 0) {
      count++;
      idx = content.indexOf(m.pattern, idx + m.pattern.length);
    }
    const firstIdx = content.indexOf(m.pattern);
    const start = Math.max(0, firstIdx - 40);
    const end = Math.min(content.length, firstIdx + m.pattern.length + 40);
    const excerpt = content
      .slice(start, end)
      .replace(/\s+/g, ' ')
      .trim();
    hits.push({
      file: relative(projectRoot, file),
      pattern: m.pattern,
      expected: m.expected,
      note: m.note,
      count,
      excerpt,
    });
  }
  return hits;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let distRoot = 'dist';
  let asJson = false;
  for (const a of args) {
    if (a.startsWith('--dist=')) distRoot = a.slice('--dist='.length);
    else if (a === '--json') asJson = true;
  }

  const projectRoot = process.cwd();
  const zhTwRoot = join(projectRoot, distRoot, 'zh-tw');
  if (!existsSync(zhTwRoot)) {
    console.error(`[zh-tw-misconversion] No dist/zh-tw/ at ${zhTwRoot}. Run 'npm run build' first.`);
    process.exit(2);
  }

  const allHits: Hit[] = [];
  let filesScanned = 0;
  for (const file of walkHtml(zhTwRoot)) {
    filesScanned++;
    allHits.push(...scanFile(file, projectRoot));
  }

  if (asJson) {
    console.log(JSON.stringify({ filesScanned, hits: allHits }, null, 2));
  } else {
    console.log(`[zh-tw-misconversion] scanned ${filesScanned} files in ${relative(projectRoot, zhTwRoot)}/`);
    if (allHits.length === 0) {
      console.log('[zh-tw-misconversion] ✔ no known misconversions found');
    } else {
      console.log(`[zh-tw-misconversion] ✘ ${allHits.length} misconversion hit(s):\n`);
      // Group by pattern for readability
      const byPattern = new Map<string, Hit[]>();
      for (const h of allHits) {
        const arr = byPattern.get(h.pattern) ?? [];
        arr.push(h);
        byPattern.set(h.pattern, arr);
      }
      for (const [pattern, hits] of byPattern) {
        const m = MISCONVERSIONS.find((x) => x.pattern === pattern);
        const total = hits.reduce((s, h) => s + h.count, 0);
        console.log(`  ${pattern} (${m?.note ?? 'unknown'}) — should be "${m?.expected}"`);
        console.log(`    ${total} occurrence(s) across ${hits.length} file(s):`);
        for (const h of hits.slice(0, 5)) {
          console.log(`      ${h.file} (×${h.count})`);
          console.log(`        ...${h.excerpt}...`);
        }
        if (hits.length > 5) console.log(`      ...and ${hits.length - 5} more files`);
        console.log('');
      }
      console.log(
        `[zh-tw-misconversion] Fix: ensure all callers of zh fields on /zh-tw/ pages route through toTraditional() (src/i18n/opencc.ts). If the term is genuinely new and missing protection, add it to src/i18n/protected-terms.ts.`
      );
    }
  }

  process.exit(allHits.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});

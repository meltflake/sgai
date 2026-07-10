// scripts/hansard/derive-zh-tw-posts.ts
// ────────────────────────────────────────────────────────────────────────
// Derives src/data/post/zh-tw/<slug>.md from the zh source via OpenCC s2twp.
// zh-tw longform posts are NOT translated — they are deterministic Traditional
// conversions of the zh source (same as the existing 4 zh-tw posts). OpenCC
// only touches CJK, so ASCII slugs / IDs / dates / markdown syntax pass
// through untouched; toTraditional() also applies PROTECTED_TERMS (ministry
// names). Adds `lang: 'zh-tw'` as the first frontmatter line.
//
// USAGE: npx tsx scripts/hansard/derive-zh-tw-posts.ts <slug> [<slug> ...]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { toTraditional } from '../../src/i18n/opencc.ts';

const slugs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (slugs.length === 0) {
  process.stderr.write('Provide at least one slug (without .md).\n');
  process.exit(1);
}

for (const slug of slugs) {
  const srcPath = resolve('src/data/post', `${slug}.md`);
  if (!existsSync(srcPath)) {
    process.stderr.write(`  ✗ ${slug}: source ${srcPath} not found\n`);
    continue;
  }
  const src = readFileSync(srcPath, 'utf8');
  let out = toTraditional(src);

  // Ensure `lang: 'zh-tw'` is the first frontmatter line.
  if (/^---\n/.test(out)) {
    if (/^lang:\s*/m.test(out.split('\n---')[0])) {
      out = out.replace(/^(lang:\s*).*$/m, `$1'zh-tw'`);
    } else {
      out = out.replace(/^---\n/, `---\nlang: 'zh-tw'\n`);
    }
  }

  const outPath = resolve('src/data/post/zh-tw', `${slug}.md`);
  writeFileSync(outPath, out);
  process.stdout.write(`  ✓ ${slug} → ${outPath}\n`);
}

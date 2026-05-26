// Translate a blog post markdown file from zh → en/ja/ko using
// scripts/lib/translate.ts. One-shot utility for publishing new long-form
// posts; not part of the cron registry. Preserves markdown syntax by
// extending the system prompt with explicit instructions.
//
// USAGE:
//   npx tsx scripts/refresh/post-translations/translate-post.ts \
//     --src=src/data/post/<slug>.md \
//     --target=en|ja|ko \
//     [--dry-run]
//
// Output: src/data/post/<target>/<slug>.md with translated title, excerpt,
// and body; all other frontmatter fields copied verbatim; `lang` set.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import yaml from 'js-yaml';

import { translateBatch, type TranslateDirection } from '../../lib/translate.ts';

interface CliArgs {
  src: string;
  target: 'en' | 'ja' | 'ko';
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let src = '';
  let target: 'en' | 'ja' | 'ko' = 'en';
  let dryRun = false;
  for (const a of args) {
    if (a.startsWith('--src=')) src = a.slice('--src='.length);
    else if (a.startsWith('--target=')) {
      const t = a.slice('--target='.length);
      if (t !== 'en' && t !== 'ja' && t !== 'ko') throw new Error(`Invalid --target: ${t}`);
      target = t;
    } else if (a === '--dry-run') dryRun = true;
  }
  if (!src) throw new Error('--src required');
  return { src, target, dryRun };
}

const MARKDOWN_PRESERVATION_NOTE = `

ADDITIONAL CRITICAL RULES — read carefully:

1. EACH INPUT STRING IS ONE MARKDOWN BLOCK. Even if a block contains list items separated by \\n (newlines), bullet points, or multi-paragraph content, it MUST become EXACTLY ONE output string. NEVER split a single input string into multiple output strings. The output array length MUST equal the input array length. This is the most important rule.

2. PRESERVE ALL MARKDOWN SYNTAX EXACTLY: ** bold **, _italic_, # ## ### headings, - list bullets (including the leading "- "), [link text](url), \\* escapes, > blockquotes, \`code\`, indentation, internal \\n line breaks, em-dashes (——).

3. TRANSLATE ONLY HUMAN-READABLE TEXT. Never translate URLs, code, English proper nouns (NAIS, MDDI, IMDA, AIMfg, A*STAR, PENSIEVE-AI, etc.), markdown structural characters, or the literal words inside backticks.

4. PRESERVE BLOCK PREFIXES. If a block starts with "## ", "### ", "- ", "1. ", or "> ", the output MUST start with the same prefix.

5. PRESERVE LIST STRUCTURE. If a block is a multi-item bulleted list like "- A\\n- B\\n- C", the output MUST also be a multi-item bulleted list with the same number of items joined by \\n, returned as ONE STRING.`;

function buildSystemPrompt(direction: TranslateDirection): string {
  const base = {
    'zh→en':
      'You are a professional translator for an English-language policy-analysis website. Translate Singapore policy / news content from Simplified Chinese into clear, faithful English. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms.',
    'zh→ja':
      'You are a professional translator for a Japanese policy-analysis website. Translate Singapore AI policy / news content from Simplified Chinese into clear, faithful Japanese using the です・ます polite-but-professional register. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original form. Use established Japanese AI-policy terminology where it exists; otherwise transliterate (katakana) or keep the original term.',
    'zh→ko':
      'You are a professional translator for a Korean policy-analysis website. Translate Singapore AI policy / news content from Simplified Chinese into clear, faithful Korean using the 합쇼체 polite-but-professional register. Preserve all proper nouns, numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form. Render the country name as 싱가포르. Use established Korean AI-policy terminology where it exists; otherwise transliterate (한글) or keep the original term.',
  }[direction as 'zh→en' | 'zh→ja' | 'zh→ko'];
  const quoteRule = {
    'zh→en':
      'CRITICAL: inside the translated paragraph TEXT, use curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). The only allowed straight quotes are the JSON syntax quotes that delimit each string, and inside markdown link URLs.',
    'zh→ja':
      'CRITICAL: inside the translated paragraph TEXT, use Japanese quotation marks 「 」 (or 『 』 for nested) — NEVER ASCII straight quotes ("). The only allowed straight quotes are the JSON syntax quotes that delimit each string, and inside markdown link URLs.',
    'zh→ko':
      'CRITICAL: inside the translated paragraph TEXT, use Korean quotation marks 「 」 (or 『 』 for nested) or curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). The only allowed straight quotes are the JSON syntax quotes that delimit each string, and inside markdown link URLs.',
  }[direction as 'zh→en' | 'zh→ja' | 'zh→ko'];
  return `${base} Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. ${quoteRule}${MARKDOWN_PRESERVATION_NOTE}`;
}

async function main(): Promise<void> {
  const { src, target, dryRun } = parseArgs();
  const ROOT = '/Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai';
  const srcPath = src.startsWith('/') ? src : join(ROOT, src);

  const raw = readFileSync(srcPath, 'utf-8');
  const m = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!m) throw new Error(`No YAML frontmatter found in ${srcPath}`);

  const fm = yaml.load(m[1]) as Record<string, unknown>;
  const body = m[2].trim();

  // Split body into blocks (markdown blocks separated by blank lines).
  const blocks = body.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  const title = String(fm.title ?? '');
  const excerpt = String(fm.excerpt ?? '');

  const toTranslate = [title, excerpt, ...blocks];
  const direction = `zh→${target}` as TranslateDirection;

  console.log(`[translate-post] ${target}: ${toTranslate.length} items (title + excerpt + ${blocks.length} blocks)`);

  if (dryRun) {
    console.log('[translate-post] dry-run, skipping translation');
    return;
  }

  const cacheDir = join(ROOT, 'scripts/refresh/post-translations/.cache');
  const translated = await translateBatch(toTranslate, {
    direction,
    cacheDir,
    concurrency: 2,
    systemPrompt: buildSystemPrompt(direction),
  });

  if (translated.length !== toTranslate.length) {
    throw new Error(`Length mismatch: input ${toTranslate.length}, output ${translated.length}`);
  }

  const [tTitle, tExcerpt, ...tBlocks] = translated;
  const outFm: Record<string, unknown> = { ...fm, title: tTitle, excerpt: tExcerpt, lang: target };
  const outBody = tBlocks.join('\n\n');

  const slug = basename(srcPath).replace(/\.(md|mdx)$/i, '');
  const outDir = join(ROOT, 'src/data/post', target);
  const outPath = join(outDir, `${slug}.md`);

  const fmStr = yaml.dump(outFm, { lineWidth: -1, noRefs: true, sortKeys: false });
  const finalContent = `---\n${fmStr}---\n\n${outBody}\n`;

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, finalContent, 'utf-8');
  console.log(`[translate-post] wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

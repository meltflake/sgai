// scripts/i18n/build-ja-dict.ts
// ────────────────────────────────────────────────────────────────────────
// One-shot: translate the zh i18n dictionary into ja and emit a TS literal
// block to stdout. Run once to seed src/i18n/index.ts:`export const ja`.
//
// USAGE
//   npx tsx scripts/i18n/build-ja-dict.ts > scripts/i18n/data/ja-dict.ts
//
// Then paste the body into src/i18n/index.ts (or use Edit to splice in).
//
// The translation goes through the shared `translateBatch` primitive with
// a domain-specific system prompt that includes the sgai glossary so
// "AI 抓手" → 「AI レバー」 etc. land consistently. sha256 caching means
// re-runs are free.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { zh } from '../../src/i18n/index.ts';
import { translateBatch } from '../lib/translate.ts';

// Glossary baked into the system prompt — these terms are decided once
// and reused across the site. The model is instructed to honour them
// verbatim when the source contains the matching Chinese substring.
const GLOSSARY: ReadonlyArray<readonly [string, string]> = [
  ['新加坡 AI 观察', 'シンガポール AI 観測'],
  ['新加坡 AI', 'SG AI'],
  ['新加坡', 'シンガポール'],
  ['AI 抓手', 'AI レバー'],
  ['抓手', 'レバー'],
  ['国会辩论', '議会討論'],
  ['国会', '議会'],
  ['政策文件', '政策文書'],
  ['生态地图', 'エコシステムマップ'],
  ['时间线', 'タイムライン'],
  ['国际对标', '国際ベンチマーク'],
  ['对标', 'ベンチマーク'],
  ['影响力图谱', 'インフルエンスマップ'],
  ['仪表盘', 'ダッシュボード'],
  ['观察', 'コラム'], // navAnalysis (Opinion in en) — soft register for ja
  ['创业生态', 'スタートアップエコシステム'],
  ['人才培养', '人材育成'],
  ['官方开源', '公式オープンソース'],
  ['产学研开源', '産学連携オープンソース'],
  ['法律框架', '法的枠組み'],
  ['关于本站', 'このサイトについて'],
  ['实战经验', 'フィールドノート'],
  ['参考资源', '参考資料'],
  ['全部文章', '全記事'],
  ['首页', 'ホーム'],
  ['返回观察', 'コラム一覧へ'],
  ['由 {handle} 维护', '{handle} 個人による運営'],
  ['搜索', '検索'],
  ['关闭搜索', '検索を閉じる'],
  ['站内搜索', 'サイト内検索'],
  ['加载更多', 'もっと読む'],
  ['阅读全文', '全文を読む'],
  ['返回', '戻る'],
  ['关联', '関連'],
  ['相关阅读', '関連記事'],
  ['来源', '出典'],
  ['原文 PDF', '原文 PDF'],
  ['中文翻译', '中国語訳'],
  ['英文翻译', '英訳'],
  ['英文原文', '英語原文'],
  ['Hansard 原始记录', 'Hansard 原文'],
  ['争议度', '争点度'],
  ['作者', '筆者'],
  ['目录', '目次'],
];

const ZH_TO_JA_SYSTEM_PROMPT = [
  'You are a professional translator for the Japanese version of a Singapore AI policy-analysis website (sgai).',
  'Translate the input from Simplified Chinese into clear, faithful Japanese using the polite-but-professional です・ます register.',
  'Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Use the established Japanese AI-policy terminology where it exists; otherwise transliterate (katakana) or keep the original term.',
  '',
  'GLOSSARY — when the input contains the source term on the left, the translation MUST use the Japanese term on the right verbatim:',
  ...GLOSSARY.map(([zhTerm, jaTerm]) => `  ${zhTerm} → ${jaTerm}`),
  '',
  'Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array.',
  'CRITICAL: inside the translated paragraph TEXT, use Japanese quotation marks 「 」 (or 『 』 for nested) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'When the input contains a {placeholder} like {count} or {handle}, leave the curly-braced token VERBATIM in the output — do not translate or modify the placeholder.',
].join('\n');

function escapeTsString(s: string): string {
  // Single-quoted TS string literal. Escape backslash and single-quote.
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  const keys = Object.keys(zh) as (keyof typeof zh)[];
  const sources = keys.map((k) => zh[k] as string);

  process.stderr.write(`[build-ja-dict] Translating ${sources.length} keys...\n`);

  const cacheDir = resolve(import.meta.dirname, 'data/ja-cache');
  const translated = await translateBatch(sources, {
    direction: 'zh→ja',
    cacheDir,
    systemPrompt: ZH_TO_JA_SYSTEM_PROMPT,
    concurrency: 2,
  });

  if (translated.length !== sources.length) {
    throw new Error(`Translation count mismatch: expected ${sources.length}, got ${translated.length}`);
  }

  const lines: string[] = [];
  lines.push('export const ja: Partial<Record<keyof typeof zh, string>> = {');
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = translated[i];
    lines.push(`  ${k}: '${escapeTsString(v)}',`);
  }
  lines.push('};');

  const out = lines.join('\n') + '\n';
  process.stdout.write(out);

  // Also save a JSON snapshot for diffing / auditability.
  const snapshotPath = resolve(import.meta.dirname, 'data/ja-dict.json');
  const snapshot: Record<string, string> = {};
  for (let i = 0; i < keys.length; i += 1) {
    snapshot[keys[i] as string] = translated[i];
  }
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n');
  process.stderr.write(`[build-ja-dict] JSON snapshot → ${snapshotPath}\n`);
  process.stderr.write(`[build-ja-dict] Done. ${keys.length} keys.\n`);
}

main().catch((err) => {
  process.stderr.write(`[build-ja-dict] ERROR: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});

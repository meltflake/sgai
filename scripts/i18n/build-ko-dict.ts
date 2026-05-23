// scripts/i18n/build-ko-dict.ts
// ────────────────────────────────────────────────────────────────────────
// One-shot: translate the zh i18n dictionary into ko and emit a TS literal
// block to stdout. Run once to seed src/i18n/index.ts:`export const ko`.
//
// USAGE
//   npx tsx scripts/i18n/build-ko-dict.ts > scripts/i18n/data/ko-dict.ts
//
// Then paste the body into src/i18n/index.ts (or use Edit to splice in).
//
// Mirrors scripts/i18n/build-ja-dict.ts in shape — same glossary
// strategy, same sha256 caching, same idempotent rerun behaviour.

import { resolve } from 'node:path';

import { zh } from '../../src/i18n/index.ts';
import { translateBatch } from '../lib/translate.ts';

// Glossary baked into the system prompt — these terms are decided once
// and reused across the site. The model MUST honour them verbatim.
const GLOSSARY: ReadonlyArray<readonly [string, string]> = [
  ['新加坡 AI 观察', '싱가포르 AI 옵저버토리'],
  ['新加坡 AI', 'SG AI'],
  ['新加坡', '싱가포르'],
  ['AI 抓手', 'AI 레버'],
  ['抓手', '레버'],
  ['国会辩论', '국회 토론'],
  ['国会', '국회'],
  ['政策文件', '정책 문서'],
  ['生态地图', '생태계 지도'],
  ['时间线', '타임라인'],
  ['国际对标', '국제 벤치마크'],
  ['对标', '벤치마크'],
  ['影响力图谱', '영향력 지도'],
  ['仪表盘', '대시보드'],
  ['观察', '컬럼'], // navAnalysis (Opinion) — soft register for ko
  ['创业生态', '스타트업 생태계'],
  ['人才培养', '인재 양성'],
  ['官方开源', '공식 오픈소스'],
  ['产学研开源', '산학 협력 오픈소스'],
  ['法律框架', '법적 프레임워크'],
  ['关于本站', '사이트 소개'],
  ['实战经验', '실전 노트'],
  ['参考资源', '참고 자료'],
  ['全部文章', '전체 글'],
  ['首页', '홈'],
  ['返回观察', '컬럼 목록으로'],
  ['由 {handle} 维护', '{handle}이(가) 관리합니다'],
  ['搜索', '검색'],
  ['关闭搜索', '검색 닫기'],
  ['站内搜索', '사이트 내 검색'],
  ['加载更多', '더 보기'],
  ['阅读全文', '전체 읽기'],
  ['返回', '뒤로'],
  ['关联', '관련'],
  ['相关阅读', '관련 글'],
  ['来源', '출처'],
  ['原文 PDF', '원문 PDF'],
  ['中文翻译', '중국어 번역'],
  ['英文翻译', '영어 번역'],
  ['英文原文', '영어 원문'],
  ['Hansard 原始记录', 'Hansard 원문'],
  ['争议度', '논쟁도'],
  ['作者', '저자'],
  ['目录', '목차'],
];

const ZH_TO_KO_SYSTEM_PROMPT = [
  'You are a professional translator for the Korean version of a Singapore AI policy-analysis website (sgai).',
  'Translate the input from Simplified Chinese into clear, faithful Korean using the polite-but-professional 합쇼체 register.',
  'Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Use established Korean AI-policy terminology where it exists; otherwise transliterate (한글) or keep the original term.',
  '',
  'GLOSSARY — when the input contains the source term on the left, the translation MUST use the Korean term on the right verbatim:',
  ...GLOSSARY.map(([zhTerm, koTerm]) => `  ${zhTerm} → ${koTerm}`),
  '',
  'Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array.',
  'CRITICAL: inside the translated paragraph TEXT, use Korean quotation marks 「 」 (or 『 』 for nested) or curly typographic quotes (" and ") — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'When the input contains a {placeholder} like {count} or {handle}, leave the curly-braced token VERBATIM in the output — do not translate or modify the placeholder.',
].join('\n');

function escapeTsString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  const keys = Object.keys(zh) as (keyof typeof zh)[];
  const sources = keys.map((k) => zh[k] as string);

  process.stderr.write(`[build-ko-dict] Translating ${sources.length} keys...\n`);

  const cacheDir = resolve(import.meta.dirname, 'data/ko-cache');
  const translated = await translateBatch(sources, {
    direction: 'zh→ko',
    cacheDir,
    systemPrompt: ZH_TO_KO_SYSTEM_PROMPT,
    concurrency: 2,
  });

  if (translated.length !== sources.length) {
    throw new Error(`Translation count mismatch: expected ${sources.length}, got ${translated.length}`);
  }

  const lines: string[] = [];
  lines.push('export const ko: Partial<Record<keyof typeof zh, string>> = {');
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = translated[i];
    lines.push(`  ${k}: '${escapeTsString(v)}',`);
  }
  lines.push('};');

  const out = lines.join('\n') + '\n';
  process.stdout.write(out);
}

main().catch((err) => {
  process.stderr.write(`[build-ko-dict] ERROR: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});

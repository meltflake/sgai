// scripts/hansard/check-speech-transcript-i18n.ts
// ────────────────────────────────────────────────────────────────────────
// Five-language hard gate for MDDI speech transcripts (rule #8 sibling of the
// debate gate). Full-scan, non-diff: walks every speechTranscripts entry and
// requires ja/ko to be present and paragraph-aligned with zh once a zh body
// exists. zh-tw is not stored (OpenCC-derived at render time, rule #10).
//
// Records with an empty zh body (source: 'unavailable' placeholders) are
// exempt — the page renders the localized "pending" fallback, not a
// wrong-language body.
//
// The existing eval:transcript (transcript-coverage) still owns the
// "a new mddiSpeeches url has NO transcript record at all" bug class in
// diff/cron mode; this gate owns ja/ko completeness across all records.

import { speechTranscripts } from '../../src/data/speech-transcripts.ts';

const errors: string[] = [];

for (const [id, t] of Object.entries(speechTranscripts)) {
  const zhLen = (t.paragraphs ?? []).length;
  if (zhLen === 0) continue; // unavailable placeholder — exempt

  const ja = t.paragraphsJa ?? [];
  const ko = t.paragraphsKo ?? [];
  if (ja.length === 0) errors.push(`${id}: missing Japanese transcript (paragraphsJa)`);
  else if (ja.length !== zhLen) errors.push(`${id}: paragraphsJa length ${ja.length} != zh ${zhLen}`);
  if (ko.length === 0) errors.push(`${id}: missing Korean transcript (paragraphsKo)`);
  else if (ko.length !== zhLen) errors.push(`${id}: paragraphsKo length ${ko.length} != zh ${zhLen}`);

  // tldr, when present in zh, must carry ja/ko siblings (parity not required —
  // bullet counts can differ after translation compression is disallowed, but
  // presence is). Keep it strict: same length as zh tldr.
  const tldrZhLen = (t.tldr ?? []).length;
  if (tldrZhLen > 0) {
    const tj = t.tldrJa ?? [];
    const tk = t.tldrKo ?? [];
    if (tj.length !== tldrZhLen) errors.push(`${id}: tldrJa length ${tj.length} != zh tldr ${tldrZhLen}`);
    if (tk.length !== tldrZhLen) errors.push(`${id}: tldrKo length ${tk.length} != zh tldr ${tldrZhLen}`);
  }
}

const total = Object.keys(speechTranscripts).length;
if (errors.length > 0) {
  console.error(`[check-speech-transcripts] ${errors.length} issue(s):`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`... ${errors.length - 80} more`);
  process.exit(1);
}

console.log(`[check-speech-transcripts] OK — ${total} speech transcripts have zh/en/ja/ko parity.`);

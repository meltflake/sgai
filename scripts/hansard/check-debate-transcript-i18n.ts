import { debates } from '../../src/data/debates';
import { debateTranscripts } from '../../src/data/debate-transcripts';

function hasCjk(value: string): boolean {
  return /[\u3400-\u9fff]/.test(value);
}

function hasHangul(value: string): boolean {
  return /[\uac00-\ud7a3]/.test(value);
}

const errors: string[] = [];

for (const debate of debates) {
  const transcript = debateTranscripts[debate.id];
  if (!transcript) {
    errors.push(`${debate.id}: missing transcript record`);
    continue;
  }

  if (transcript.paragraphsEn.length === 0) errors.push(`${debate.id}: missing English original transcript`);
  if (transcript.paragraphs.length === 0) errors.push(`${debate.id}: missing default zh transcript`);
  const zhText = transcript.paragraphs.join('');
  if (zhText && !hasCjk(zhText)) errors.push(`${debate.id}: default transcript does not appear to contain Chinese`);

  // Five-language hard gate (rule #11): ja/ko must be present and paragraph-
  // aligned with zh. zh-tw is not stored — it derives from zh via OpenCC at
  // render time (rule #10). Only assert once a zh body exists (an empty-zh
  // record already failed above; no need to pile on).
  const zhLen = transcript.paragraphs.length;
  if (zhLen > 0) {
    const ja = transcript.paragraphsJa ?? [];
    const ko = transcript.paragraphsKo ?? [];
    if (ja.length === 0) errors.push(`${debate.id}: missing Japanese transcript (paragraphsJa)`);
    else if (ja.length !== zhLen) errors.push(`${debate.id}: paragraphsJa length ${ja.length} != zh ${zhLen}`);
    else if (!hasCjk(ja.join(''))) errors.push(`${debate.id}: paragraphsJa has no CJK — not Japanese?`);
    if (ko.length === 0) errors.push(`${debate.id}: missing Korean transcript (paragraphsKo)`);
    else if (ko.length !== zhLen) errors.push(`${debate.id}: paragraphsKo length ${ko.length} != zh ${zhLen}`);
    else if (!hasHangul(ko.join(''))) errors.push(`${debate.id}: paragraphsKo has no Hangul — not Korean?`);
  }
}

if (errors.length > 0) {
  console.error(`[check-debate-transcripts] ${errors.length} issue(s):`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`... ${errors.length - 80} more`);
  process.exit(1);
}

console.log(`[check-debate-transcripts] OK — ${debates.length} debate transcripts have zh/en/ja/ko parity.`);

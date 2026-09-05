import type { AskLang } from './types';

// Script-level language check for user-typed text. The suggest rail only
// filters candidates by the `lang` column of the request that produced
// them, but a visitor on the English page may type Chinese (2026-08-19 did),
// and the LLM judge's "written in the indicated language" rule did not
// catch it — so /api/suggest?lang=en served a Chinese question for two
// weeks. This is the deterministic guard the judge cannot be trusted for.
//
// Deliberately coarse: Simplified vs Traditional is not distinguished
// (candidates are already partitioned by request lang), and Latin-only
// text passes for zh/ja/ko only when it carries that script somewhere.

const HAN = /\p{Script=Han}/u;
const KANA = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const HANGUL = /\p{Script=Hangul}/u;

export function matchesLangScript(text: string, lang: AskLang): boolean {
  const han = HAN.test(text);
  const kana = KANA.test(text);
  const hangul = HANGUL.test(text);
  switch (lang) {
    case 'en':
      return !han && !kana && !hangul;
    case 'zh':
    case 'zh-tw':
      return han && !kana && !hangul;
    case 'ja':
      // A Japanese question virtually always carries kana (は/が/です/か);
      // Han-only text is far more likely to be Chinese typed on the ja page.
      return kana && !hangul;
    case 'ko':
      return hangul && !kana;
    default:
      return false;
  }
}

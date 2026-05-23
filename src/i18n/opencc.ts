// src/i18n/opencc.ts
// ────────────────────────────────────────────────────────────────────────
// Singleton Simplified → Traditional (Taiwan with phrases) converter for
// runtime zhTw rendering.
//
// Wraps opencc-js with the `s2twp` equivalent: {from: 'cn', to: 'twp'}.
// "twp" = Traditional Taiwan with phrase substitution, so we get
// 软件 → 軟體 (not 軟件), 视频 → 影片 (not 視頻), 信息 → 資訊 (not 信息),
// 程序 → 程式, 鼠标 → 滑鼠, etc. — i.e. the form a Taiwanese reader
// actually expects, not just the literal 简→繁 character map.
//
// Why a singleton: OpenCC.Converter() builds a fairly large trie on first
// call (~200ms cold). We do it once at module load and reuse the
// closure. Subsequent calls are O(length × dictionary lookup).
//
// Why not pre-convert at build time and bake into `*ZhTw` fields:
//   1. Data file bloat: doubling every CJK field for zh-Hant is ~2× the
//      per-record byte cost for what is essentially a deterministic
//      character substitution.
//   2. Drift risk: every `*` zh edit would need a sibling `*ZhTw` update,
//      and missing the sibling silently renders raw Simplified on a
//      "Traditional" page. Runtime conversion is drift-proof.
//   3. SSG runs once per build, so the runtime cost is amortized across
//      all visitors.
//
// Hand-override channel: src/i18n/index.ts:`zhTw` dict accepts entries
// where the converter misfires (proper-noun branding, Singapore-specific
// terms). pickLocalized / t() check the dict first, fall back to OpenCC.

import * as OpenCC from 'opencc-js';

// Post-OpenCC dictionary that fixes the handful of mmseg-segmentation
// edge cases where the main converter incorrectly leaves 后 (Simplified
// "after") as 后 instead of converting to 後. The segmenter groups some
// adjacent compounds incorrectly (e.g. "球后续" → segments as "球后" +
// "续", so the 后→後 lookup never fires). We can't fix the segmenter,
// so we post-correct: every common "後-context" phrase listed here gets
// patched on the way out. 后 in 皇后 (queen), 太后, 王后, etc. is
// intentionally untouched.
const POST_DICT: ReadonlyArray<readonly [string, string]> = [
  ['后续', '後續'],
  ['后续', '後續'], // post-conversion form (后 + 續) where segmenter missed
  ['后續', '後續'],
  ['后期', '後期'],
  ['后来', '後來'],
  ['后來', '後來'],
  ['后果', '後果'],
  ['后人', '後人'],
  ['后裔', '後裔'],
  ['后排', '後排'],
  ['后退', '後退'],
  ['后進', '後進'],
  ['后进', '後進'],
  ['后悔', '後悔'],
  ['后辈', '後輩'],
  ['后輩', '後輩'],
  ['然后', '然後'],
  ['之后', '之後'],
  ['以后', '以後'],
  ['最后', '最後'],
  ['前后', '前後'],
];

let _convert: ((s: string) => string) | null = null;

function getConverter(): (s: string) => string {
  if (_convert) return _convert;
  // `cn` → `twp`: Simplified (Mainland) to Traditional (Taiwan, with phrase substitution).
  const main = OpenCC.Converter({ from: 'cn', to: 'twp' });
  const post = OpenCC.CustomConverter(POST_DICT.map(([a, b]) => [a, b]));
  _convert = (s: string) => post(main(s));
  return _convert;
}

/** Convert a Simplified Chinese string to Traditional (Taiwan idiom). */
export function toTraditional(input: string): string {
  if (!input) return input;
  return getConverter()(input);
}

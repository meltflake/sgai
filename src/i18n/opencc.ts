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
// Hand-override channels (two layers):
//   1. src/i18n/index.ts:`zhTw` dict — entry-level overrides for the
//      static UI copy keyed by zh-dict key. pickLocalized / t() check
//      this first, before reaching the OpenCC path.
//   2. src/i18n/protected-terms.ts:`PROTECTED_TERMS` — substring-level
//      overrides applied *inside* the OpenCC pipeline. Wraps the
//      converter so any text containing a protected term (e.g.
//      "数字发展与信息部") gets the term placeholder-swapped before
//      OpenCC runs, then swapped back to the correct Traditional form
//      after. This is what stops OpenCC from mangling Singapore
//      institutional names regardless of whether the call site went
//      through pickLocalized or hit toTraditional() directly.

import * as OpenCC from 'opencc-js';

import { PROTECTED_TERMS, type ProtectedTerm } from './protected-terms';

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
  // mmseg groups "<量词>家制造" wrongly so 制 escapes the 制→製 lookup.
  // Confirmed cases: "30家制造", "一家制造", "百家制造". The post-pass
  // is the simplest fix without re-segmenting.
  ['家制造', '家製造'],
];

// Sentinel placeholder format: NUL + base32-ish ID + NUL. Picked because:
//   - \x00 (NUL) never appears in real source content
//   - OpenCC trie segmentation treats NUL as a hard break, so the
//     placeholder body is guaranteed to survive char-by-char unchanged
//   - distinct from any plausible CJK input
const PLACEHOLDER_PREFIX = '\x00PROT';
const PLACEHOLDER_SUFFIX = '\x00';

// Apply protected-term substitution in two passes:
//   pre:  scan input longest-zh-first, replace each occurrence with a
//         sentinel placeholder so OpenCC doesn't touch the term
//   post: scan output, replace each placeholder with the term's zhTw value
//
// We sort by zh length DESC so compound names ("数字发展与信息部") match
// before their sub-fragments ("信息部"). Without this, the shorter
// fragment would consume the substring first and the compound wouldn't
// fire — leading to e.g. "数字发展与<placeholder for 信息部>" which
// after OpenCC would land "數字發展與信息部" with no harm (placeholder
// still works), but the longest-first order keeps semantics clean and
// avoids edge cases when terms partially overlap.
const SORTED_TERMS: ReadonlyArray<ProtectedTerm> = [...PROTECTED_TERMS].sort((a, b) => b.zh.length - a.zh.length);

function preProtect(input: string): { masked: string; hits: Map<string, string> } {
  // hits maps placeholder → zhTw replacement for this call
  const hits = new Map<string, string>();
  let masked = input;
  for (let i = 0; i < SORTED_TERMS.length; i++) {
    const term = SORTED_TERMS[i];
    if (!masked.includes(term.zh)) continue;
    const placeholder = `${PLACEHOLDER_PREFIX}${i}${PLACEHOLDER_SUFFIX}`;
    masked = masked.split(term.zh).join(placeholder);
    hits.set(placeholder, term.zhTw);
  }
  return { masked, hits };
}

function postRestore(input: string, hits: Map<string, string>): string {
  if (hits.size === 0) return input;
  let restored = input;
  for (const [placeholder, replacement] of hits) {
    restored = restored.split(placeholder).join(replacement);
  }
  return restored;
}

let _convert: ((s: string) => string) | null = null;

function getConverter(): (s: string) => string {
  if (_convert) return _convert;
  // `cn` → `twp`: Simplified (Mainland) to Traditional (Taiwan, with phrase substitution).
  const main = OpenCC.Converter({ from: 'cn', to: 'twp' });
  const post = OpenCC.CustomConverter(POST_DICT.map(([a, b]) => [a, b]));
  _convert = (s: string) => {
    const { masked, hits } = preProtect(s);
    const converted = post(main(masked));
    return postRestore(converted, hits);
  };
  return _convert;
}

/** Convert a Simplified Chinese string to Traditional (Taiwan idiom),
 *  with substring-level protection for Singapore institutional names
 *  via PROTECTED_TERMS (see protected-terms.ts). */
export function toTraditional(input: string): string {
  if (!input) return input;
  return getConverter()(input);
}

/** Recursively convert every string reachable from `value` to Traditional
 *  (Taiwan idiom). Walks strings, arrays, and plain objects; functions and
 *  other non-serialisable values pass through untouched (callers that carry
 *  functions in the tree — e.g. AboutPage's `versionLine` — must wrap the
 *  function's *return value* with toTraditional separately). Used to derive a
 *  zh-tw view of a page-local zh COPY block without hand-maintaining a
 *  parallel `*ZhTw` structure. */
export function deepToTraditional<T>(value: T): T {
  if (typeof value === 'string') return toTraditional(value) as T;
  if (Array.isArray(value)) return value.map((item) => deepToTraditional(item)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = deepToTraditional(item);
    }
    return out as T;
  }
  return value;
}

// Exported for unit tests so they can assert the two-pass pipeline in
// isolation without the OpenCC singleton bootstrap.
export const _internals = { preProtect, postRestore, SORTED_TERMS };

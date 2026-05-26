// src/i18n/protected-terms.ts
// ────────────────────────────────────────────────────────────────────────
// Singapore-specific Chinese names that must NOT be subject to OpenCC
// s2twp phrase substitution.
//
// PROBLEM
//   OpenCC s2twp does phrase-level substitution from Mainland Simplified
//   into Taiwan-flavoured Traditional. It assumes the input uses Mainland
//   conventions, so "信息" → "資訊", "社区" → "社群", "项目" → "專案".
//   For generic prose this is what zh-tw readers expect.
//
//   But Singapore's official institutional Chinese names use the Mainland
//   词组 conventions verbatim — "数字发展与信息部" (MDDI), "信息通信媒体
//   发展局" (IMDA), "文化、社区及青年部" (MCCY). For these the official
//   Traditional rendering preserves the original phrasing:
//
//     OpenCC default:  数字发展与信息部 → 數字發展與資訊部 (wrong — distorts brand)
//     Correct sg:      数字发展与信息部 → 數字發展與信息部 (only 簡→繁 chars)
//
// MECHANISM
//   `toTraditional()` in opencc.ts runs a pre-pass: any input substring
//   matching a PROTECTED_TERMS[i].zh is replaced with a sentinel placeholder
//   `\x00PROT<i>\x00`. OpenCC then converts the rest. A post-pass swaps
//   the placeholders back for the PROTECTED_TERMS[i].zhTw value, giving
//   the correct character-only conversion for these specific phrases
//   without re-running OpenCC.
//
//   At apply time entries are sorted longest-zh-first to ensure compound
//   names ("数字发展与信息部") win over shorter ones ("信息部") when both
//   would match the same span.
//
// ADDING A TERM
//   1. Run OpenCC on the candidate via /tmp/opencc-probe.mjs to confirm
//      the default conversion is actually wrong.
//   2. Add { zh, zhTw } here, with a short `note` line above explaining
//      WHY this term needs protection.
//   3. The unit test in __tests__/protected-terms.test.ts auto-picks up
//      the new entry and asserts the placeholder round-trip works.
//
// SCOPE
//   This list intentionally covers ONLY official institutional names and
//   a tiny set of high-frequency sg-specific compound terms — not every
//   generic word where sg and tw diverge. Generic "信息" / "项目" / "社区"
//   are left to OpenCC because zh-tw audiences expect the converted form
//   ("資訊" / "專案" / "社群") in non-proper-noun contexts.

export interface ProtectedTerm {
  readonly zh: string;
  readonly zhTw: string;
}

export const PROTECTED_TERMS: ReadonlyArray<ProtectedTerm> = [
  // MDDI — Ministry of Digital Development and Information (sg, 2024–).
  // Full name + abbreviation. "信息" must not phrase-convert to "資訊".
  { zh: '数字发展与信息部', zhTw: '數字發展與信息部' },
  { zh: '信息部', zhTw: '信息部' },

  // IMDA — Infocomm Media Development Authority (sg, 2016–). Multiple
  // Chinese renderings found across historical sgai content.
  { zh: '信息通信媒体发展局', zhTw: '信息通信媒體發展局' },
  { zh: '信息通信媒体发展部', zhTw: '信息通信媒體發展部' },
  { zh: '信息通信媒体部', zhTw: '信息通信媒體部' },

  // IDA — Infocomm Development Authority (sg, pre-2016, merged into IMDA +
  // GovTech). Older sgai content may still reference it by name.
  { zh: '信息通信发展管理局', zhTw: '信息通信發展管理局' },
  { zh: '信息通信发展局', zhTw: '信息通信發展局' },

  // MICA — Ministry of Information, Communications and the Arts
  // (sg, 2004–2012; renamed MCI 2012; broken up further). Historical.
  { zh: '信息通信及艺术部', zhTw: '信息通信及藝術部' },
  { zh: '信息通信与艺术部', zhTw: '信息通信與藝術部' },
  { zh: '信息与媒体部', zhTw: '信息與媒體部' },

  // MCCY — Ministry of Culture, Community and Youth (sg, 2012–).
  // "社区" (community in physical/governance sense) must not phrase-convert
  // to "社群" (which in tw connotes online/interest groups).
  { zh: '文化、社区及青年部', zhTw: '文化、社區及青年部' },
];

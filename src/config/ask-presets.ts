// Ask-AI preset question pool (build-time view). The /ask/ page shows a
// random 6 per load and the homepage AskEntry a random 2 (client-side
// shuffle, so the static build still varies per visit). On top of this
// static pool, /api/suggest serves AI-vetted real user questions mined
// from the D1 log (see functions/api/suggest.ts) — the page merges both.
//
// Authored data lives in ask-presets-data.ts (import-free so the worker
// can bundle it); zh-tw derives here via OpenCC.

import { toTraditional } from '../i18n/opencc';
import type { Lang } from '../i18n';
import { ASK_PRESET_DATA } from './ask-presets-data';

export const ASK_PRESET_POOL: Record<Lang, string[]> = {
  ...ASK_PRESET_DATA,
  'zh-tw': ASK_PRESET_DATA.zh.map((q) => toTraditional(q)),
};

/** How many presets the /ask/ empty state shows per page load. */
export const ASK_PAGE_PRESET_COUNT = 6;
/** How many chips the homepage AskEntry shows per page load. */
export const ASK_ENTRY_CHIP_COUNT = 2;
/** How many pool entries AskEntry renders as candidates for its shuffle. */
export const ASK_ENTRY_CANDIDATE_COUNT = 6;

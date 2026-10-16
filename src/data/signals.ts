// src/data/signals.ts
// ────────────────────────────────────────────────────────────────────────
// Signals（信号）: the week's noteworthy Singapore AI news, one line of
// judgment each. Written by the weekly auto-PR pipeline
// scripts/refresh/signals/run.ts; spec in docs/signals/spec.md.
//
// Rules (CLAUDE.md): zh / en / ja / ko in the same commit (#5); sourceUrl
// is HTTP-checked before it is written (#6); every record has addedAt (#7).
// New records go at the TOP of the array. `topicIds` come from
// src/data/topics.ts and `related` ids must resolve — scripts/verify-graph.ts
// checks both.
//
// Links: the /signals/ list page links each title to `sourceUrl`. Every
// other surface (updates feed, topic hubs) links to /signals/#<id>.

export type SignalRelatedKind = 'policy' | 'person' | 'ecosystem' | 'startup' | 'debate' | 'video';

export interface SignalRelated {
  kind: SignalRelatedKind;
  /** Record id (policy / person / debate / video) or page slug (ecosystem / startup). */
  id: string;
}

export interface Signal {
  /** 'sig-YYYYMMDD-<slug>', stable. */
  id: string;
  /** Event / publication date, YYYY-MM-DD. */
  date: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  /** One sentence: why this matters for Singapore's AI strategy. */
  whyItMatters: string;
  whyItMattersEn: string;
  whyItMattersJa: string;
  whyItMattersKo: string;
  sourceUrl: string;
  /** Publisher, original English name (no CJK, no sibling fields). */
  sourceName: string;
  /** 1 to 3 ids from src/data/topics.ts. */
  topicIds: string[];
  related?: SignalRelated[];
  addedAt: string;
}

export const signals: Signal[] = [];

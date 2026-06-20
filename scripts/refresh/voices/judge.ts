// scripts/refresh/voices/judge.ts
// ────────────────────────────────────────────────────────────────────────
// Speech-specific thin wrapper over the shared content-layer AI-relevance
// gate (scripts/lib/judge-ai-relevance.ts). Kept as a named module so
// run.ts reads naturally and so the speech body slicing lives in one place.
//
// Fast-pass speeches (slug already names AI) skip this entirely — see
// run.ts. Only the ambiguous remainder pays for an LLM call.

import {
  judgeAiRelevance as judgeAiShared,
  type AiRelevanceVerdict,
} from '../../lib/judge-ai-relevance.ts';
import type { FetchedSpeech } from './fetch.ts';

export interface SpeechAiVerdict extends AiRelevanceVerdict {
  speechId: string;
}

/** Judge whether a fetched ministerial speech substantively discusses AI.
 *  Conservative on failure (kept, low confidence) so a real AI speech is
 *  never silently lost — a human can drop it in PR review. */
export async function judgeAiRelevance(
  fetched: FetchedSpeech,
  options: { model?: string } = {}
): Promise<SpeechAiVerdict> {
  const verdict = await judgeAiShared(
    {
      title: fetched.title,
      contentText: fetched.paragraphs.slice(0, 40).join('\n\n'),
      sourceUrl: fetched.sourceUrl,
    },
    { model: options.model, kind: 'a Singapore ministerial speech' }
  );
  return { speechId: fetched.speechId, ...verdict };
}

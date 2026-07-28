// scripts/lib/judge-ai-relevance.ts
// ────────────────────────────────────────────────────────────────────────
// Content-layer AI-relevance gate, shared across refresh pipelines.
// Generalised from scripts/refresh/voices/judge.ts.
//
// The lesson from the 2026-06 voices miss: decide AI relevance on the
// fetched BODY, never on the URL slug / title alone. An "Asia Economic
// Summit" keynote is about AI sovereignty; a lockup YouTube video carries
// only a title; a BusinessTimes funding story has no "ai" in its URL.
// Pipelines should admit broadly by document type, then call THIS on the
// body to decide AI relevance.
//
// Failure policy is conservative: on an LLM/parse error we keep the item
// (relevant=true, low confidence) so a real AI item is never silently
// lost — a human drops it in PR review. Pipelines that route low-confidence
// items to _pendingReview get human backstop for free.

import { callLlmJson } from './llm.ts';

export interface AiRelevanceVerdict {
  relevant: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export interface JudgeAiInput {
  title: string;
  contentText: string;
  sourceUrl?: string;
}

export interface JudgeAiOptions {
  /** Override claude model alias. Defaults to env / haiku. */
  model?: string;
  /** One-line framing of the corpus, e.g. "a ministerial speech",
   *  "a news article", "a company / product page". Helps set the bar. */
  kind?: string;
  /** What counts as on-topic. Defaults to the Singapore AI ecosystem. */
  scope?: string;
  /** Optional SECOND necessary condition. When set, relevant=true requires
   *  BOTH the scope test AND this one to hold. Motivation (issue #166):
   *  `scope` alone asks "is this about AI?" — a whole-domain source like
   *  the Business Times tech feed then passes global AI stories (China
   *  model launches, US chip deals) that have nothing to do with
   *  Singapore. Softening `scope` with "especially in Singapore" is a
   *  hint, not a gate; this is the gate. */
  requireScope?: string;
}

interface JudgeModelOutput {
  relevant?: boolean;
  confidence?: 'high' | 'medium' | 'low';
  reason?: string;
}

const DEFAULT_SCOPE =
  'artificial intelligence — AI / machine learning / generative AI / LLMs / AI governance / AI safety / AI compute / AI talent / AI adoption — especially in the Singapore context';

/** Exported for prompt-assembly unit tests (no LLM call needed). */
export function buildSystemPrompt(kind: string, scope: string, requireScope?: string): string {
  const decisionRule = requireScope
    ? [
        'Decision rule — BOTH conditions must hold:',
        `- Condition A: the piece substantively concerns ${scope}.`,
        `- Condition B: the piece has ${requireScope}.`,
        '- relevant=true  → A AND B both hold, each with substance.',
        '- relevant=false → either condition fails. A piece that satisfies A but not B is off-topic for this observatory.',
      ]
    : [
        'Decision rule:',
        '- relevant=true  → the subject is central and developed with substance.',
        '- relevant=false → the subject is absent, or only name-dropped once while the piece is really about something else.',
      ];
  return [
    'You are a research analyst for sgai.md, a Singapore AI policy & ecosystem observatory.',
    `You read ${kind} and decide ONE thing: does it SUBSTANTIVELY concern ${scope}?`,
    '',
    `"Substantively" means the subject is a MAIN theme — developed with specifics (policy, programme, funding, product, capability, figures, stance) — not a one-line passing mention.`,
    '',
    ...decisionRule,
    '',
    'Return STRICT JSON, no prose, no markdown:',
    '{ "relevant": boolean, "confidence": "high"|"medium"|"low", "reason": string }',
    'reason: one English sentence naming the main theme (or why it is off-topic).',
  ].join('\n');
}

/** Judge whether a fetched item substantively concerns AI. Conservative on
 *  failure (keeps the item, low confidence) so a real AI item is never
 *  silently lost. */
export async function judgeAiRelevance(
  input: JudgeAiInput,
  options: JudgeAiOptions = {}
): Promise<AiRelevanceVerdict> {
  const model = options.model || process.env.SGAI_SUMMARIZE_MODEL || 'haiku';
  const kind = options.kind || 'a document';
  const scope = options.scope || DEFAULT_SCOPE;
  const body = (input.contentText || '').slice(0, 12000);
  const userPrompt = `Title: ${input.title}\n${
    input.sourceUrl ? `Source: ${input.sourceUrl}\n` : ''
  }\nBody:\n\n${body}`;
  try {
    const out = await callLlmJson<JudgeModelOutput>(userPrompt, {
      systemPrompt: buildSystemPrompt(kind, scope, options.requireScope),
      model,
    });
    const confidence =
      out.confidence === 'high' || out.confidence === 'medium' || out.confidence === 'low'
        ? out.confidence
        : 'low';
    return {
      relevant: out.relevant === true,
      confidence,
      reason: typeof out.reason === 'string' ? out.reason : '',
    };
  } catch (error) {
    return {
      relevant: true,
      confidence: 'low',
      reason: `judge error, kept for review: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

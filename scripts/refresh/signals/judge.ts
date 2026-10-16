// scripts/refresh/signals/judge.ts
// One LLM call per candidate: is it about Singapore AND about AI, how
// significant is it (1-5), plus a zh headline, topic ids from the closed
// vocabulary and a short event key for cross-outlet dedupe. The parser is
// strict: anything malformed returns null and the candidate is dropped.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { callLlm, extractJsonPayload } from '../../lib/llm.ts';
import type { Topic } from '../../../src/data/topics.ts';

export interface Judgment {
  singapore: boolean;
  ai: boolean;
  score: number;
  reason: string;
  titleZh: string;
  topicIds: string[];
  eventKey: string;
}

export function parseJudgment(raw: string, topicIdSet: Set<string>): Judgment | null {
  const payload = extractJsonPayload(raw);
  if (!payload) return null;
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (typeof o !== 'object' || o === null || Array.isArray(o)) return null;
  if (typeof o.singapore !== 'boolean' || typeof o.ai !== 'boolean') return null;
  const scoreNum = typeof o.score === 'number' ? o.score : typeof o.score === 'string' ? Number(o.score) : NaN;
  if (!Number.isFinite(scoreNum)) return null;
  const titleZh = typeof o.titleZh === 'string' ? o.titleZh.trim() : '';
  if (!/[一-鿿]/.test(titleZh)) return null;
  const topicIds = [...new Set(Array.isArray(o.topicIds) ? o.topicIds.filter((t): t is string => typeof t === 'string') : [])]
    .filter((t) => topicIdSet.has(t))
    .slice(0, 3);
  if (topicIds.length === 0) return null;
  const eventKey = (typeof o.eventKey === 'string' ? o.eventKey : '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return {
    singapore: o.singapore,
    ai: o.ai,
    score: Math.min(5, Math.max(1, Math.round(scoreNum))),
    reason: typeof o.reason === 'string' ? o.reason.trim() : '',
    titleZh,
    topicIds,
    eventKey,
  };
}

const SYSTEM = `You are the editor of sgai.md, a site that tracks Singapore's AI strategy and ecosystem for founders, policy researchers and journalists.
For one news item, decide whether it is a weekly "signal" worth a reader's time. Reply with ONE JSON object and nothing else.`;

export function buildJudgePrompt(input: { title: string; sourceName: string; date: string; url: string; content: string }, topics: Topic[]): string {
  const vocab = topics.map((t) => `- ${t.id}: ${t.nameEn}`).join('\n');
  return `News item
Title: ${input.title}
Publisher: ${input.sourceName}
Date: ${input.date}
URL: ${input.url}
Text (truncated):
${input.content.slice(0, 4000)}

Return JSON with exactly these keys:
{
  "singapore": boolean  // true only if the item is substantially about Singapore (its government, agencies, companies, institutions, or a deal/rule that applies in Singapore). A passing mention is false.
  "ai": boolean         // true only if AI (models, compute, data centres, AI policy, AI adoption) is the main subject.
  "score": 1-5          // The item must be NEW news from the stated date. If the text shows an older announcement (an archived page, a programme launched years ago), score 1.
                        // 5 = national-level policy, law, major funding (>= S$100m), a frontier lab or hyperscaler commitment; 4 = new programme, regulation draft, notable deal or first-of-its-kind deployment; 3 = routine launch, event, partnership PR; 2 = marketing or opinion; 1 = irrelevant.
  "reason": string      // one English sentence: why this score
  "titleZh": string     // a Simplified Chinese headline, at most 30 characters, factual, no exclamation marks
  "topicIds": string[]  // 1 to 3 ids from the list below, most relevant first
  "eventKey": string    // 2 to 6 lowercase English words naming the underlying event, e.g. "imda agentic ai framework update"; two outlets covering the same event must get the same key
}

Topic ids:
${vocab}`;
}

export interface JudgeOptions {
  cacheDir: string;
  model?: string;
  call?: (prompt: string) => Promise<string>;
}

/** Judge one candidate with a sha256 cache. Returns null when the model reply is unusable. */
export async function judgeCandidate(
  input: { title: string; sourceName: string; date: string; url: string; content: string },
  topics: Topic[],
  opts: JudgeOptions
): Promise<Judgment | null> {
  const prompt = buildJudgePrompt(input, topics);
  const key = createHash('sha256').update(SYSTEM + prompt).digest('hex').slice(0, 24);
  const file = join(opts.cacheDir, `${key}.json`);
  const topicIdSet = new Set(topics.map((t) => t.id));
  if (existsSync(file)) {
    const cached = parseJudgment(readFileSync(file, 'utf8'), topicIdSet);
    if (cached) return cached;
  }
  const call = opts.call ?? ((p: string) => callLlm(p, { systemPrompt: SYSTEM, model: opts.model ?? 'sonnet', timeoutMs: 180000 }));
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await call(prompt);
    const j = parseJudgment(raw, topicIdSet);
    if (j) {
      mkdirSync(opts.cacheDir, { recursive: true });
      writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
      return j;
    }
  }
  return null;
}

import type { Env } from './types';

// D1 usage log — one row per turn, including cache hits and rejections.
// Schema lives in functions/schema.sql. No raw IPs, only salted hashes.

export interface TurnLog {
  sessionId: string;
  turn: number;
  lang: string;
  question: string;
  answer: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  cacheHitTokens: number;
  /** 'kv' (answer cache replay) | 'none' */
  cache: string;
  ipHash: string;
  /** 'ok' | 'quota' | 'error' | 'unavailable' */
  status: string;
}

export async function logTurn(env: Env, entry: TurnLog): Promise<void> {
  if (!env.QA_DB) return;
  try {
    await env.QA_DB.prepare(
      `INSERT INTO qa_turns (ts, session_id, turn, lang, question, answer, model, tokens_in, tokens_out, cache_hit_tokens, cache, ip_hash, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        new Date().toISOString(),
        entry.sessionId,
        entry.turn,
        entry.lang,
        entry.question.slice(0, 4000),
        entry.answer.slice(0, 16000),
        entry.model,
        entry.tokensIn,
        entry.tokensOut,
        entry.cacheHitTokens,
        entry.cache,
        entry.ipHash,
        entry.status
      )
      .run();
  } catch (err) {
    // Logging must never break the answer path.
    console.warn('qa_turns insert failed:', err instanceof Error ? err.message : err);
  }
}

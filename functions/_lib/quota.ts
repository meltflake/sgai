import type { Env, KVNamespaceLike } from './types';

const DEFAULT_DAILY_LIMIT = 20;
const DEFAULT_GLOBAL_DAILY_LIMIT = 3000;
// Counters expire two days after creation — long enough to outlive their
// SGT day, short enough to keep the namespace tidy.
const COUNTER_TTL_SECONDS = 48 * 3600;

/** Current date in Singapore time (UTC+8, no DST) as YYYY-MM-DD. */
export function sgtDay(now = Date.now()): string {
  return new Date(now + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Salted, truncated SHA-256 of the client IP — never store the raw IP. */
export async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
}

export interface QuotaResult {
  allowed: boolean;
  /** Remaining turns for this IP after this request; null when unmetered. */
  remaining: number | null;
  /** True when the site-wide circuit breaker tripped (vs per-IP limit). */
  globalExhausted: boolean;
}

async function bumpCounter(kv: KVNamespaceLike, key: string, limit: number): Promise<number | null> {
  const current = parseInt((await kv.get(key)) || '0', 10) || 0;
  if (current >= limit) return null;
  // Read-modify-write is racy under concurrency; acceptable for a coarse
  // daily quota (a race lets a few extra turns through, never a flood).
  await kv.put(key, String(current + 1), { expirationTtl: COUNTER_TTL_SECONDS });
  return limit - current - 1;
}

/**
 * Check + consume one turn from the site-wide and per-IP daily quotas.
 * Without a KV binding this is a no-op (unmetered).
 */
export async function consumeQuota(env: Env, ipHash: string): Promise<QuotaResult> {
  const kv = env.QA_KV;
  if (!kv) return { allowed: true, remaining: null, globalExhausted: false };

  const day = sgtDay();
  const globalLimit = parseInt(env.QA_GLOBAL_DAILY_LIMIT || '', 10) || DEFAULT_GLOBAL_DAILY_LIMIT;
  const globalLeft = await bumpCounter(kv, `quota:global:${day}`, globalLimit);
  if (globalLeft === null) return { allowed: false, remaining: 0, globalExhausted: true };

  const ipLimit = parseInt(env.QA_DAILY_LIMIT || '', 10) || DEFAULT_DAILY_LIMIT;
  const ipLeft = await bumpCounter(kv, `quota:ip:${ipHash}:${day}`, ipLimit);
  if (ipLeft === null) return { allowed: false, remaining: 0, globalExhausted: false };

  return { allowed: true, remaining: ipLeft, globalExhausted: false };
}

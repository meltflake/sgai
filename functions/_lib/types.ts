// Shared types for the Ask-AI Pages Functions.
//
// Deliberately self-contained: minimal structural types instead of
// @cloudflare/workers-types, so `astro check` / eslint run over functions/
// with zero tsconfig changes and no extra dependency. Every binding is
// optional — the API degrades gracefully (no KV → no quota/cache; no D1 →
// no logging; no key → mock or 503) so a half-configured Pages project
// never breaks the deploy.

export interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  run(): Promise<unknown>;
  all(): Promise<{ results?: unknown[] }>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface AssetsLike {
  fetch(input: Request | string): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsLike;
  DEEPSEEK_API_KEY?: string;
  /** Defaults to `deepseek-chat` (tracks the current DeepSeek V4 Flash). */
  DEEPSEEK_MODEL?: string;
  /** Defaults to `https://api.deepseek.com`. */
  DEEPSEEK_BASE_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
  QA_HMAC_SECRET?: string;
  /** Per-IP turns per day. Defaults to 20. */
  QA_DAILY_LIMIT?: string;
  /** Site-wide turns per day (billing circuit breaker). Defaults to 3000. */
  QA_GLOBAL_DAILY_LIMIT?: string;
  /** Set to '1' in .dev.vars to stream a canned answer without an API key. */
  QA_MOCK?: string;
  QA_KV?: KVNamespaceLike;
  QA_DB?: D1DatabaseLike;
}

export interface PagesContext {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

export type PagesHandler = (context: PagesContext) => Promise<Response> | Response;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type AskLang = 'zh' | 'en' | 'ja' | 'zh-tw' | 'ko';

export const ASK_LANGS: AskLang[] = ['zh', 'en', 'ja', 'zh-tw', 'ko'];

export interface AskRequestBody {
  question: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  lang: AskLang;
  sessionId?: string;
  turnstileToken?: string;
}

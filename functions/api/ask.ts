// POST /api/ask — the Ask-AI endpoint (SSE streaming).
//
// Request JSON: { question, history, lang, sessionId?, turnstileToken? }
// Pre-stream failures return JSON { error: { code, message } } with a real
// HTTP status; success returns text/event-stream with events:
//   meta  {"cached":bool,"remaining":number|null}
//   delta {"text":"..."}
//   done  {}
//   error {"code":"upstream","message":"..."}   (mid-stream failures only)
//
// Every protection layer degrades gracefully when its binding/secret is
// absent (see functions/_lib/types.ts) — the endpoint is safe to deploy
// before Phase-0 resource setup, it just runs unmetered + mock/503.

import { getCachedAnswer, putCachedAnswer } from '../_lib/cache';
import { loadBuildId, loadCorpus } from '../_lib/corpus';
import { streamChatCompletion } from '../_lib/deepseek';
import { logTurn } from '../_lib/log';
import { buildSystemPrompt } from '../_lib/prompt';
import { consumeQuota, hashIp } from '../_lib/quota';
import {
  AUTH_COOKIE,
  issueAuthCookieValue,
  readCookie,
  verifyAuthCookieValue,
  verifyTurnstileToken,
} from '../_lib/turnstile';
import { ASK_LANGS, type AskLang, type AskRequestBody, type ChatMessage, type PagesContext } from '../_lib/types';

const MAX_QUESTION_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 24;
const MAX_HISTORY_MESSAGE_CHARS = 8000;
// Sent to the model: last N history messages (client also truncates).
const MODEL_HISTORY_MESSAGES = 12;

const MOCK_ANSWER = [
  'This is a **mock answer** from the Ask-AI dev environment (no `DEEPSEEK_API_KEY` configured, `QA_MOCK=1`).',
  '',
  '这是开发环境的**模拟回答**（未配置 DeepSeek API key）。',
  '',
  '- Example link: [National AI Strategy 2.0](https://sgai.md/policies/national-ai-strategy-20-nais-20/)',
].join('\n');

function jsonError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function sseChunk(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

interface ParsedBody {
  question: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  lang: AskLang;
  sessionId: string;
  turnstileToken: string;
}

function parseBody(raw: unknown): ParsedBody | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const body = raw as Partial<AskRequestBody>;
  if (typeof body.question !== 'string') return null;
  const question = body.question.trim();
  if (!question || question.length > MAX_QUESTION_CHARS) return null;

  const history: ParsedBody['history'] = [];
  if (body.history !== undefined) {
    if (!Array.isArray(body.history) || body.history.length > MAX_HISTORY_MESSAGES) return null;
    for (const item of body.history) {
      if (typeof item !== 'object' || item === null) return null;
      const { role, content } = item as { role?: unknown; content?: unknown };
      if (role !== 'user' && role !== 'assistant') return null;
      if (typeof content !== 'string' || content.length > MAX_HISTORY_MESSAGE_CHARS) return null;
      history.push({ role, content });
    }
  }

  const lang: AskLang = ASK_LANGS.includes(body.lang as AskLang) ? (body.lang as AskLang) : 'en';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.replace(/[^A-Za-z0-9-]/g, '').slice(0, 64) : '';
  const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken.slice(0, 4096) : '';
  return { question, history, lang, sessionId, turnstileToken };
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError(400, 'bad_request', 'invalid JSON body');
  }
  const body = parseBody(rawBody);
  if (!body) return jsonError(400, 'bad_request', 'invalid question or history');

  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const ipHash = await hashIp(ip, env.QA_HMAC_SECRET || 'sgai-qa');
  const turn = Math.floor(body.history.length / 2);
  const baseLog = {
    sessionId: body.sessionId,
    turn,
    lang: body.lang,
    question: body.question,
    model: env.DEEPSEEK_MODEL || 'deepseek-chat',
    ipHash,
  };

  // 1 · Turnstile (only once configured). A valid HMAC cookie skips
  // re-verification; otherwise the request must carry a fresh token.
  let setCookie: string | null = null;
  if (env.TURNSTILE_SECRET_KEY) {
    const cookieSecret = env.QA_HMAC_SECRET || env.TURNSTILE_SECRET_KEY;
    const cookieOk = await verifyAuthCookieValue(cookieSecret, readCookie(request, AUTH_COOKIE));
    if (!cookieOk) {
      if (!body.turnstileToken || !(await verifyTurnstileToken(env, body.turnstileToken, ip))) {
        return jsonError(403, 'turnstile', 'human verification required');
      }
      const value = await issueAuthCookieValue(cookieSecret);
      setCookie = `${AUTH_COOKIE}=${value}; Max-Age=3600; Path=/api/; HttpOnly; Secure; SameSite=Strict`;
    }
  }

  // 2 · Daily quotas (per-IP + site-wide circuit breaker).
  const quota = await consumeQuota(env, ipHash);
  if (!quota.allowed) {
    context.waitUntil(
      logTurn(env, {
        ...baseLog,
        answer: '',
        tokensIn: 0,
        tokensOut: 0,
        cacheHitTokens: 0,
        cache: 'none',
        status: 'quota',
      })
    );
    return jsonError(429, quota.globalExhausted ? 'global_quota_exceeded' : 'quota_exceeded', 'daily limit reached');
  }

  const origin = new URL(request.url).origin;
  const sseHeaders: Record<string, string> = {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
  };
  if (setCookie) sseHeaders['Set-Cookie'] = setCookie;

  // 3 · First-turn answer cache.
  const buildId = await loadBuildId(env, origin);
  if (body.history.length === 0) {
    const cached = await getCachedAnswer(env, body.question, body.lang, buildId);
    if (cached) {
      context.waitUntil(
        logTurn(env, {
          ...baseLog,
          answer: cached,
          tokensIn: 0,
          tokensOut: 0,
          cacheHitTokens: 0,
          cache: 'kv',
          status: 'ok',
        })
      );
      const replay =
        sseChunk('meta', { cached: true, remaining: quota.remaining }) +
        sseChunk('delta', { text: cached }) +
        sseChunk('done', {});
      return new Response(replay, { headers: sseHeaders });
    }
  }

  // 4 · Model availability.
  const mock = !env.DEEPSEEK_API_KEY && env.QA_MOCK === '1';
  if (!env.DEEPSEEK_API_KEY && !mock) {
    context.waitUntil(
      logTurn(env, {
        ...baseLog,
        answer: '',
        tokensIn: 0,
        tokensOut: 0,
        cacheHitTokens: 0,
        cache: 'none',
        status: 'unavailable',
      })
    );
    return jsonError(503, 'unavailable', 'Ask-AI is not configured yet');
  }

  // 5 · Stream the answer.
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const write = (chunk: string) => writer.write(encoder.encode(chunk));

  const run = async (): Promise<void> => {
    await write(sseChunk('meta', { cached: false, remaining: quota.remaining }));

    if (mock) {
      await write(sseChunk('delta', { text: MOCK_ANSWER }));
      await write(sseChunk('done', {}));
      await writer.close();
      await logTurn(env, {
        ...baseLog,
        answer: MOCK_ANSWER,
        tokensIn: 0,
        tokensOut: 0,
        cacheHitTokens: 0,
        cache: 'none',
        status: 'ok',
      });
      return;
    }

    let corpus: string;
    try {
      corpus = await loadCorpus(env, origin);
    } catch (err) {
      await write(
        sseChunk('error', { code: 'upstream', message: err instanceof Error ? err.message : 'corpus unavailable' })
      );
      await writer.close();
      return;
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: buildSystemPrompt(corpus, body.lang) },
      ...body.history.slice(-MODEL_HISTORY_MESSAGES),
      { role: 'user', content: body.question },
    ];

    await streamChatCompletion(env, messages, {
      onDelta: (text) => {
        void write(sseChunk('delta', { text }));
      },
      onDone: async (fullText, usage) => {
        await write(sseChunk('done', {}));
        await writer.close();
        if (body.history.length === 0) await putCachedAnswer(env, body.question, body.lang, buildId, fullText);
        await logTurn(env, {
          ...baseLog,
          answer: fullText,
          tokensIn: usage?.promptTokens || 0,
          tokensOut: usage?.completionTokens || 0,
          cacheHitTokens: usage?.cacheHitTokens || 0,
          cache: 'none',
          status: 'ok',
        });
      },
      onError: async (message) => {
        await write(sseChunk('error', { code: 'upstream', message }));
        await writer.close();
        await logTurn(env, {
          ...baseLog,
          answer: '',
          tokensIn: 0,
          tokensOut: 0,
          cacheHitTokens: 0,
          cache: 'none',
          status: 'error',
        });
      },
    });
  };

  context.waitUntil(
    run().catch(async (err) => {
      try {
        await write(
          sseChunk('error', { code: 'upstream', message: err instanceof Error ? err.message : 'internal error' })
        );
        await writer.close();
      } catch {
        // Stream already closed — nothing left to report to the client.
      }
    })
  );

  return new Response(readable, { headers: sseHeaders });
};

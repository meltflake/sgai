import type { ChatMessage, Env } from './types';

// Thin streaming client for DeepSeek's OpenAI-compatible chat API.

export interface StreamUsage {
  promptTokens: number;
  completionTokens: number;
  cacheHitTokens: number;
}

export interface DeepseekStreamHandlers {
  onDelta(text: string): void;
  onDone(fullText: string, usage: StreamUsage | null): void | Promise<void>;
  onError(message: string): void | Promise<void>;
}

const REQUEST_TIMEOUT_MS = 60_000;

export async function streamChatCompletion(
  env: Env,
  messages: ChatMessage[],
  handlers: DeepseekStreamHandlers
): Promise<void> {
  const baseUrl = (env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let full = '';
  let usage: StreamUsage | null = null;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
        temperature: 0.3,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => '');
      await handlers.onError(`upstream ${res.status}: ${detail.slice(0, 200)}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
            usage?: {
              prompt_tokens?: number;
              completion_tokens?: number;
              prompt_cache_hit_tokens?: number;
            } | null;
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            full += delta;
            handlers.onDelta(delta);
          }
          if (parsed.usage) {
            usage = {
              promptTokens: parsed.usage.prompt_tokens || 0,
              completionTokens: parsed.usage.completion_tokens || 0,
              cacheHitTokens: parsed.usage.prompt_cache_hit_tokens || 0,
            };
          }
        } catch {
          // Skip malformed SSE fragments; the buffer loop resyncs on the next line.
        }
      }
    }

    await handlers.onDone(full, usage);
  } catch (err) {
    await handlers.onError(err instanceof Error ? err.message : 'upstream request failed');
  } finally {
    clearTimeout(timeout);
  }
}

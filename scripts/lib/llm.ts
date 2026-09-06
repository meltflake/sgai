// scripts/lib/llm.ts
// ────────────────────────────────────────────────────────────────────────
// LLM invocation backend for sgai refresh pipelines.
//
// Uses the local `claude` CLI in headless mode (`claude -p`) so pipelines
// authenticate via the user's existing Claude Code login — NO API key
// required. This means the refresh infrastructure works on any machine
// that has Claude Code installed and is logged in.
//
// Strategy:
//   1. Spawn `claude -p --output-format json --model <model> --system-prompt <s>`
//   2. Pipe the user prompt to stdin (handles long inputs without argv limits)
//   3. Read stdout as a JSON event stream; find the final {type:"result"} event
//   4. Strip ```json ... ``` markdown fences if the model wrapped its output
//   5. Return the raw string; caller does JSON.parse() if it expects JSON
//
// Default model is `haiku-4-5` (cheap) since translation/summarisation work
// doesn't require deep reasoning. Override with options.model when needed.
//
// USAGE:
//   import { callLlm } from './lib/llm';
//   const out = await callLlm(JSON.stringify({ paragraphs }), {
//     systemPrompt: 'You translate to Simplified Chinese. Return JSON only.',
//   });
//   const parsed = JSON.parse(out) as { paragraphs: string[] };
//
// CLI HEALTH-CHECK:
//   import { ensureClaudeAvailable } from './lib/llm';
//   ensureClaudeAvailable(); // throws with a helpful message if `claude` is missing

import { spawn, spawnSync } from 'node:child_process';

export interface LlmCallOptions {
  systemPrompt?: string;
  /** Claude model alias (haiku / sonnet / opus) or full id. Default 'haiku'. */
  model?: string;
  /** Per-call timeout in ms. Default 120000 (2 min). */
  timeoutMs?: number;
  /** AbortSignal. */
  signal?: AbortSignal;
}

function getClaudeBin(): string {
  return process.env.SGAI_CLAUDE_BIN || 'claude';
}
function getDefaultModel(): string {
  return process.env.SGAI_CLAUDE_MODEL || 'haiku';
}
function getDefaultTimeout(): number {
  return Number(process.env.SGAI_LLM_TIMEOUT_MS || 120000);
}

/**
 * Verify the `claude` CLI is on PATH and responding. Useful for doctor.sh
 * and pipeline preflight. Throws with a clear message if not.
 */
export function ensureClaudeAvailable(): void {
  const bin = getClaudeBin();
  let inner = '';
  try {
    const r = spawnSync(bin, ['--version'], { encoding: 'utf8' });
    if (r.error) {
      inner = (r.error as NodeJS.ErrnoException).message;
    } else if (r.status !== 0) {
      inner = `\`${bin} --version\` exited ${r.status}: ${r.stderr || r.stdout}`;
    } else {
      return;
    }
  } catch (error) {
    inner = error instanceof Error ? error.message : String(error);
  }
  throw new Error(
    `Claude CLI not available: ${inner}\n` +
      `Install: https://docs.claude.com/en/docs/claude-code/quickstart\n` +
      `Then: \`claude\` (interactive login) once. Set SGAI_CLAUDE_BIN if non-standard path.`
  );
}

function getAuthTimeout(): number {
  return Number(process.env.SGAI_LLM_AUTH_TIMEOUT_MS || 60000);
}

const CLAUDE_AUTH_HINT =
  'Re-authenticate the Claude CLI, then retry:\n' +
  '  claude setup-token      # token auth (recommended for headless / cron)\n' +
  '  claude auth login       # interactive OAuth login\n' +
  'If the CLI lives at a non-standard path, set SGAI_CLAUDE_BIN.';

interface SmokeResult {
  type?: string;
  is_error?: boolean;
  api_error_status?: number;
  result?: string;
}

/** Pull the result-ish object out of `claude -p --output-format json` output.
 *  The shape varies: a single {type:"result",...} object, an auth-failure
 *  object {is_error:true,api_error_status:401,...} (no `type`), or a streamed
 *  array of events. Be lenient — we only need is_error / api_error_status. */
function pickSmokeResult(parsed: unknown): SmokeResult | undefined {
  const isResultish = (o: unknown): o is SmokeResult =>
    typeof o === 'object' &&
    o !== null &&
    ('is_error' in o ||
      'api_error_status' in o ||
      'result' in o ||
      (o as { type?: string }).type === 'result');
  if (Array.isArray(parsed)) {
    return (
      parsed.find((e): e is SmokeResult => isResultish(e) && (e.type === 'result' || e.is_error === true)) ||
      [...parsed].reverse().find(isResultish)
    );
  }
  return isResultish(parsed) ? parsed : undefined;
}

/** Per (bin, model) memo so the real smoke-test runs once per process. */
const authCache = new Map<string, { ok: boolean; error?: Error }>();

function runAuthSmokeTest(bin: string, model: string): void {
  const timeoutMs = getAuthTimeout();
  // Mirror callLlm: short prompt over stdin, run in /tmp so the CLI stays a
  // stateless completion (no project CLAUDE.md / MCP / skills loaded).
  const r = spawnSync(bin, ['-p', '--output-format', 'json', '--model', model], {
    input: 'ping',
    encoding: 'utf8',
    cwd: '/tmp',
    timeout: timeoutMs,
    maxBuffer: 8 * 1024 * 1024,
  });

  if (r.error) {
    const e = r.error as NodeJS.ErrnoException;
    if (e.code === 'ETIMEDOUT') {
      throw new Error(
        `Claude CLI auth smoke-test timed out after ${timeoutMs}ms (\`${bin} -p --model ${model}\`). ` +
          `Raise SGAI_LLM_AUTH_TIMEOUT_MS if the network is slow.\n${CLAUDE_AUTH_HINT}`
      );
    }
    throw new Error(`Claude CLI auth smoke-test failed to spawn: ${e.message}\n${CLAUDE_AUTH_HINT}`);
  }

  const stdout = r.stdout || '';
  const stderr = r.stderr || '';

  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error(
      `Claude CLI auth smoke-test: \`claude -p\` produced no parseable JSON (exit ${r.status}). ` +
        `stderr: ${stderr.trim().slice(0, 300) || '(none)'} | stdout: ${stdout.trim().slice(0, 300) || '(none)'}\n` +
        CLAUDE_AUTH_HINT
    );
  }

  const evt = pickSmokeResult(parsed);
  const apiStatus = typeof evt?.api_error_status === 'number' ? evt.api_error_status : undefined;
  const resultText = typeof evt?.result === 'string' ? evt.result : '';

  if (apiStatus === 401 || /\b401\b|invalid authentication|failed to authenticate/i.test(resultText)) {
    throw new Error(
      `Claude CLI is not authenticated (API ${apiStatus ?? 401}): ${resultText || 'authentication failed'}\n${CLAUDE_AUTH_HINT}`
    );
  }
  if (evt?.is_error === true || apiStatus !== undefined) {
    throw new Error(
      `Claude CLI inference smoke-test failed${apiStatus ? ` (API ${apiStatus})` : ''}: ` +
        `${resultText || stderr.trim() || `exit ${r.status}`}\n${CLAUDE_AUTH_HINT}`
    );
  }
  if (r.status !== 0) {
    throw new Error(
      `Claude CLI auth smoke-test exited ${r.status}: ${stderr.trim().slice(0, 300) || resultText || '(no output)'}\n` +
        CLAUDE_AUTH_HINT
    );
  }
  // Healthy: inference returned a non-error result. The model's reply to
  // "ping" is irrelevant — we only needed proof the call round-tripped.
}

/**
 * Verify the `claude` CLI can actually run inference — not merely that the
 * binary exists. `claude --version` (what ensureClaudeAvailable checks) still
 * exits 0 when the OAuth token has expired; the failure only surfaces at the
 * first real `claude -p` call as
 *   {"is_error":true,"api_error_status":401,"result":"Failed to authenticate…"}
 * which, mid-pipeline, shows up as N cryptic truncated per-record errors.
 *
 * This pipes a one-word prompt through `claude -p --output-format json` and
 * throws an actionable error (telling the user to run `claude setup-token` /
 * `claude auth login`) when auth is broken, so pipelines fail fast at startup
 * with one clear message. Cached per (bin, model): the real call runs once per
 * process; subsequent invocations are a Map lookup.
 */
export function ensureClaudeAuthed(model?: string): void {
  const bin = getClaudeBin();
  const useModel = model || getDefaultModel();
  const key = `${bin}::${useModel}`;

  const cached = authCache.get(key);
  if (cached) {
    if (cached.ok) return;
    throw cached.error;
  }

  try {
    ensureClaudeAvailable(); // cheap: binary on PATH + responds to --version
    runAuthSmokeTest(bin, useModel); // real: one inference round-trip
    authCache.set(key, { ok: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    authCache.set(key, { ok: false, error: err });
    throw err;
  }
}

interface ResultEvent {
  type: 'result';
  subtype: 'success' | string;
  is_error?: boolean;
  /** Present on transport failures, e.g. 401 when the OAuth token expired. */
  api_error_status?: number;
  result?: string;
  total_cost_usd?: number;
  duration_ms?: number;
}

/** Strip ```json ... ``` and ```...``` markdown fences if present. */
function stripCodeFence(s: string): string {
  const trimmed = s.trim();
  // ```json\n...\n```  or  ```\n...\n```
  const m = trimmed.match(/^```(?:json|JSON)?\s*\n([\s\S]*?)\n?```$/);
  if (m) return m[1].trim();
  return trimmed;
}

/**
 * Call the local Claude Code CLI. Returns the model's text output (with
 * markdown fences stripped). Throws on transport / parse errors.
 *
 * Caller is responsible for JSON.parse() and validation of the output.
 */
export async function callLlm(userPrompt: string, options: LlmCallOptions = {}): Promise<string> {
  const bin = getClaudeBin();
  const model = options.model || getDefaultModel();
  const timeoutMs = options.timeoutMs ?? getDefaultTimeout();

  const args = ['-p', '--output-format', 'json', '--model', model];
  if (options.systemPrompt) {
    args.push('--system-prompt', options.systemPrompt);
  }

  return new Promise<string>((resolve, reject) => {
    // CRITICAL: run in /tmp so Claude Code doesn't load the project's
    // CLAUDE.md, MCP tools, skills, agents into the session — those are
    // ~30 K cached tokens of irrelevant context that:
    //   (a) cost ~$0.04 per call, and
    //   (b) cause the model to enter agent mode and respond with
    //       "I'm ready, what should I do?" instead of executing the prompt.
    // Running in /tmp keeps `claude -p` as a stateless LLM completion.
    const child = spawn(bin, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: '/tmp',
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill('SIGTERM');
        reject(new Error(`callLlm: timeout after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    const onAbort = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        child.kill('SIGTERM');
        reject(new Error('callLlm: aborted'));
      }
    };
    options.signal?.addEventListener('abort', onAbort);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });

    child.on('error', (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
        reject(new Error(`callLlm: spawn error: ${err.message}`));
      }
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', onAbort);

      if (code !== 0) {
        reject(new Error(`callLlm: claude exited ${code}: ${stderr.trim() || stdout.slice(0, 200)}`));
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(stdout);
      } catch (parseErr) {
        reject(new Error(`callLlm: stdout not valid JSON: ${(parseErr as Error).message}\nstdout: ${stdout.slice(0, 300)}`));
        return;
      }

      // The Claude Code CLI's --output-format json shape changed across
      // versions. Old: array of streamed events including {type:"result"}.
      // New: single object {type:"result", ...}. Accept both.
      let resultEvt: ResultEvent | undefined;
      if (Array.isArray(parsed)) {
        resultEvt = parsed.find(
          (e): e is ResultEvent =>
            typeof e === 'object' && e !== null && (e as { type?: string }).type === 'result'
        );
      } else if (
        typeof parsed === 'object' &&
        parsed !== null &&
        (parsed as { type?: string }).type === 'result'
      ) {
        resultEvt = parsed as ResultEvent;
      }
      if (!resultEvt) {
        reject(
          new Error(
            `callLlm: no {type:"result"} event found in stream (got ${
              Array.isArray(parsed) ? `array len=${parsed.length}` : typeof parsed
            })`
          )
        );
        return;
      }
      if (resultEvt.is_error) {
        reject(new Error(`callLlm: result event reported error: ${resultEvt.result || ''}`));
        return;
      }
      if (typeof resultEvt.result !== 'string') {
        reject(new Error('callLlm: result event missing string `result` field'));
        return;
      }

      resolve(stripCodeFence(resultEvt.result));
    });

    child.stdin.write(userPrompt);
    child.stdin.end();
  });
}

/**
 * Strip conversational preamble/postamble around a JSON payload. haiku often
 * prepends "Now I'll translate the paragraphs:" or appends "Hope this helps!"
 * around the actual array/object, which makes a direct JSON.parse fail on the
 * first prose token. This returns the substring from the first `[`/`{` to the
 * last matching `]`/`}`.
 *
 * Only ever invoked on input that already failed JSON.parse. If the slice is
 * still not valid JSON it simply throws again and the caller falls through to
 * the existing retry — so the worst case is the same failure we already had,
 * and a valid parse can never be corrupted (it never reaches this path).
 */
export function extractJsonPayload(raw: string): string | null {
  const start = raw.search(/[[{]/);
  if (start < 0) return null;
  const open = raw[start];
  const close = open === '[' ? ']' : '}';
  const end = raw.lastIndexOf(close);
  if (end <= start) return null;
  return raw.slice(start, end + 1);
}

/**
 * Best-effort repair for the single most common way the model breaks JSON:
 * unescaped ASCII double-quotes INSIDE a string value — a coined term like
 * "AI Bilingual", a quoted programme name, etc. The model is told to use
 * full-width / curly quotes but routinely forgets, and one unescaped `"`
 * mid-string makes JSON.parse fail with `Expected ',' or ']' after array
 * element`.
 *
 * Strategy: a single left-to-right scan tracking string state. A `"` seen
 * while inside a string is a STRUCTURAL closing quote only when the next
 * non-whitespace char is one of `] } :` or end-of-input, or — for the `,`
 * case — when the token after the comma is itself `"` / `]` / `}` (a real
 * next element). Otherwise the `"` is an inner quote and gets escaped.
 * Backslash escapes are passed through untouched.
 *
 * Intentionally conservative, and only ever invoked on input that already
 * failed JSON.parse. If it mis-splits, downstream length checks (e.g.
 * translate.ts's "count mismatch") reject the result rather than emit
 * corrupted data — so the worst case is the same failure we already had.
 */
export function repairJsonInnerQuotes(raw: string): string {
  const isWs = (c: string): boolean => c === ' ' || c === '\t' || c === '\n' || c === '\r';
  let out = '';
  let inString = false;
  // Container stack + key/value role so that `":` only terminates a string
  // when that string is an object KEY. Inside a value, a quote followed by a
  // colon is prose ("trust-based services": cybersecurity) and must be
  // escaped — the previous flat rule closed the string there.
  const stack: Array<'{' | '['> = [];
  let expectKey = false;
  let currentIsKey = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (!inString) {
      out += ch;
      if (ch === '{') {
        stack.push('{');
        expectKey = true;
      } else if (ch === '[') {
        stack.push('[');
        expectKey = false;
      } else if (ch === '}' || ch === ']') {
        stack.pop();
        expectKey = false;
      } else if (ch === ':') {
        expectKey = false;
      } else if (ch === ',') {
        expectKey = stack[stack.length - 1] === '{';
      } else if (ch === '"') {
        inString = true;
        currentIsKey = expectKey;
      }
      continue;
    }
    if (ch === '\\') {
      // Escape sequence — copy this char and the next one verbatim.
      out += ch;
      if (i + 1 < raw.length) {
        out += raw[i + 1];
        i += 1;
      }
      continue;
    }
    if (ch !== '"') {
      out += ch;
      continue;
    }
    // A `"` inside a string: structural close or inner quote?
    let j = i + 1;
    while (j < raw.length && isWs(raw[j])) j += 1;
    const next = j < raw.length ? raw[j] : '';
    let structural: boolean;
    if (currentIsKey) {
      structural = next === ':';
    } else if (next === '' || next === ']' || next === '}') {
      structural = true;
    } else if (next === ',') {
      let k = j + 1;
      while (k < raw.length && isWs(raw[k])) k += 1;
      const afterComma = k < raw.length ? raw[k] : '';
      structural = afterComma === '' || afterComma === '"' || afterComma === ']' || afterComma === '}';
    } else {
      structural = false;
    }
    if (structural) {
      out += ch;
      inString = false;
    } else {
      out += '\\"';
    }
  }
  return out;
}

/**
 * Convenience: call the LLM and JSON.parse the result. Throws if the
 * output isn't valid JSON.
 *
 * Retry-once: haiku occasionally emits invalid JSON (unescaped quotes
 * inside a string, missing comma between array items, …). One retry
 * with the same prompt rescues most of those single-call flakes because
 * the model is non-deterministic. If the second call still fails we
 * surface both raw payloads in the error so the caller can diagnose.
 */
export async function callLlmJson<T = unknown>(userPrompt: string, options: LlmCallOptions = {}): Promise<T> {
  const attempts: { error: Error; raw: string }[] = [];
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const raw = await callLlm(userPrompt, options);
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      // Deterministic rescues before burning a full retry LLM call. Each only
      // runs on an already-failed parse, so none can corrupt a valid parse.
      // 1) Conversational preamble/postamble around the JSON (haiku's most
      //    common flake in bulk translation: "Now I'll translate:\n[...]").
      // 2) Unescaped ASCII quotes inside a string value ("AI Bilingual").
      // 3) Both together (preamble + inner quotes).
      const payload = extractJsonPayload(raw);
      for (const candidate of [payload, repairJsonInnerQuotes(raw), payload && repairJsonInnerQuotes(payload)]) {
        if (!candidate) continue;
        try {
          return JSON.parse(candidate) as T;
        } catch {
          /* try next rescue */
        }
      }
      attempts.push({ error: error as Error, raw });
      if (attempt === 1) {
        process.stderr.write(
          `[callLlmJson] attempt 1 JSON parse failed (${(error as Error).message}); retrying once.\n`
        );
      }
    }
  }
  const last = attempts[attempts.length - 1];
  let repairError = '';
  try {
    JSON.parse(repairJsonInnerQuotes(last.raw));
  } catch (error) {
    repairError = ` (after inner-quote repair: ${(error as Error).message})`;
  }
  throw new Error(
    `callLlmJson: model output is not valid JSON after 2 attempts: ${last.error.message}${repairError}\nraw: ${last.raw.slice(0, 400)}`
  );
}

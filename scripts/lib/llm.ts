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

interface ResultEvent {
  type: 'result';
  subtype: 'success' | string;
  is_error?: boolean;
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

      let events: unknown;
      try {
        events = JSON.parse(stdout);
      } catch (parseErr) {
        reject(new Error(`callLlm: stdout not valid JSON: ${(parseErr as Error).message}\nstdout: ${stdout.slice(0, 300)}`));
        return;
      }

      if (!Array.isArray(events)) {
        reject(new Error(`callLlm: expected JSON array of events, got ${typeof events}`));
        return;
      }

      const resultEvt = events.find(
        (e): e is ResultEvent =>
          typeof e === 'object' && e !== null && (e as { type?: string }).type === 'result'
      );
      if (!resultEvt) {
        reject(new Error('callLlm: no {type:"result"} event found in stream'));
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
 * Convenience: call the LLM and JSON.parse the result. Throws if the
 * output isn't valid JSON.
 */
export async function callLlmJson<T = unknown>(userPrompt: string, options: LlmCallOptions = {}): Promise<T> {
  const raw = await callLlm(userPrompt, options);
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`callLlmJson: model output is not valid JSON: ${(error as Error).message}\nraw: ${raw.slice(0, 400)}`);
  }
}

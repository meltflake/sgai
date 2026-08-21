import type { Env } from './types';

// The digest and build id are static per deployment, so cache them at
// module (isolate) scope — ASSETS is only hit on cold starts.
let corpusCache: string | null = null;
let buildIdCache: string | null = null;

/** Load the build-time knowledge digest (src/pages/qa-corpus.txt.ts). */
export async function loadCorpus(env: Env, origin: string): Promise<string> {
  if (corpusCache !== null) return corpusCache;
  const res = await env.ASSETS.fetch(new URL('/qa-corpus.txt', origin).toString());
  if (!res.ok) throw new Error(`qa-corpus.txt fetch failed: ${res.status}`);
  corpusCache = await res.text();
  return corpusCache;
}

/**
 * Deployment identifier for answer-cache keys (dist/.build-commit, written
 * by postbuild). A new deploy therefore invalidates all cached answers.
 * Falls back to '' when the file is not served.
 */
export async function loadBuildId(env: Env, origin: string): Promise<string> {
  if (buildIdCache !== null) return buildIdCache;
  try {
    const res = await env.ASSETS.fetch(new URL('/.build-commit', origin).toString());
    buildIdCache = res.ok ? (await res.text()).trim() : '';
  } catch {
    buildIdCache = '';
  }
  return buildIdCache;
}

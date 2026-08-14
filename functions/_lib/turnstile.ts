import type { Env } from './types';

// Turnstile gate with an HMAC session cookie. The first message of a
// session must carry a Turnstile token; after server-side verification we
// issue a signed, time-boxed cookie so follow-up turns skip re-verification.
// Both checks are skipped entirely until TURNSTILE_SECRET_KEY is configured.

export const AUTH_COOKIE = 'sgai_qa_auth';
const COOKIE_TTL_SECONDS = 3600;

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** `exp.sig` where exp is a unix-seconds expiry. */
export async function issueAuthCookieValue(secret: string, now = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + COOKIE_TTL_SECONDS;
  return `${exp}.${await hmacSign(secret, String(exp))}`;
}

export async function verifyAuthCookieValue(secret: string, value: string | null, now = Date.now()): Promise<boolean> {
  if (!value) return false;
  const [expRaw, sig] = value.split('.');
  const exp = parseInt(expRaw, 10);
  if (!exp || !sig || exp * 1000 < now) return false;
  return (await hmacSign(secret, String(exp))) === sig;
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

export async function verifyTurnstileToken(env: Env, token: string, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

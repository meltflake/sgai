// Ask-AI client-side configuration.
//
// The Turnstile SITE key is public by design (it ships in the HTML), so a
// constant here is fine. Empty string = Turnstile disabled client-side; the
// API only enforces verification once TURNSTILE_SECRET_KEY is set on the
// Pages project, so keep the two in sync when enabling (Phase 0 in
// docs/20260814-ask-ai.md).
export const TURNSTILE_SITE_KEY = '';

/** Same-origin API endpoint served by functions/api/ask.ts. */
export const ASK_API_PATH = '/api/ask';

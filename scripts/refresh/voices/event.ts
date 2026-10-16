// scripts/refresh/voices/event.ts
// Event-name extraction from a speech titleEn. Lives in its own module so
// run.ts (which runs main() on import) does not have to be loaded by tests.

/** Extract event name from a speech titleEn. Patterns ported from
 *  scripts/voices/01_scan_mddi.py extract_event(). Returns '' when no
 *  reliable extraction is possible — caller falls back to the full title.
 *
 *  `\b` before at/for is required: without it the "at" inside "Kiat" in
 *  "Address by SMS Tan Kiat How at NVIDIA AI Day Singapore" matched first and
 *  produced the event "How at NVIDIA AI Day Singapore" (PR #353, 2026-10-16). */
export function extractEventEn(titleEn: string): string {
  const patterns = [
    /\b(?:at|for)\s+(?:the\s+)?(.+?)(?:\s*$|\s*\|)/i,
    /(?:keynote|opening|closing)\s+(?:address|remarks|speech)\s+.*?\bat\s+(?:the\s+)?(.+?)(?:\s*$)/i,
  ];
  for (const p of patterns) {
    const m = titleEn.match(p);
    if (!m) continue;
    let event = m[1].trim();
    event = event.replace(/\s+on\s+\d{1,2}\s+\w+$/i, '').trim();
    event = event.replace(/\s*\d{4}\s*$/, '').trim();
    if (event.length > 5) return event;
  }
  return '';
}

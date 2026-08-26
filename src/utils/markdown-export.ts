// src/utils/markdown-export.ts
//
// Markdown twins for detail pages. Every debate / policy / video detail
// page has a sibling at `<page path minus trailing slash>.md`, rendered by
// the `.md.ts` endpoints under src/pages/.
//
// WHY THIS EXISTS
//   Agents (ChatGPT / Perplexity / Claude) and readers who paste a page
//   into an LLM cannot get sgai's transcripts today: llms-full.txt is a
//   link index, and the HTML page is 200 KB of chrome around 8 KB of text.
//   A Markdown twin is the whole record — summary, key points, full
//   transcript, license — in the reader's own locale, in one fetch.
//
// LOCALE DISCIPLINE (CLAUDE.md rules #5 / #10 / #13)
//   - Every localized data field goes through `pickLocalized`, which walks
//     the locale's fallback chain and runs OpenCC s2twp when a zh value is
//     served to zh-tw.
//   - Section headings live in per-heading `Record<AuthoredLang, string>`
//     maps; zh-tw derives from zh via `toTraditional`. There is no
//     "non-zh → English" branch anywhere in this file.
//   - `t(lang, ...)` supplies the one heading that already exists in the
//     shared dictionary (`whyItMattersHeading`).
//
// The output is plain CommonMark: an H1 title, a metadata bullet list
// (date / added / who / source / permalink / license), then `##` sections
// in a fixed order. Sections with no content are omitted rather than left
// empty — an agent reading "## 全文" followed by nothing learns the wrong
// thing about coverage.

import type { Debate } from '~/data/debates';
import type { Policy } from '~/data/policies';
import type { VideoItem } from '~/data/videos';
import { getDebateTranscript, getDebateTranscriptParagraphs } from '~/data/debate-transcripts';
import { getPolicySourceText } from '~/data/policy-source-texts';
import { getVideoDigest, getVideoTranscriptParagraphs } from '~/data/video-transcripts';
import { localizedHref, pickLocalized, t, type Lang } from '~/i18n';
import { toTraditional } from '~/i18n/opencc';
import { licenseLine } from '~/utils/license';

/** Absolute host used in the permalink line. Matches astro.config `site`. */
const SITE_ORIGIN = 'https://sgai.md';

/** Locales whose strings are authored by hand. zh-tw derives from zh. */
type AuthoredLang = Exclude<Lang, 'zh-tw'>;
type LabelMap = Record<AuthoredLang, string>;

/** Resolve a heading/label for the locale. zh-tw goes through OpenCC — the
 *  same contract `pickLocalized` honours for data fields (rule #10). */
function label(map: LabelMap, lang: Lang): string {
  if (lang === 'zh-tw') return toTraditional(map.zh);
  return map[lang];
}

const L_DATE: LabelMap = { zh: '日期', en: 'Date', ja: '日付', ko: '날짜' };
const L_ADDED: LabelMap = { zh: '收录', en: 'Added', ja: '収録', ko: '수록' };
const L_ACTORS: LabelMap = { zh: '相关方', en: 'Who', ja: '関係者', ko: '관련자' };
const L_SOURCE: LabelMap = { zh: '来源', en: 'Source', ja: '出典', ko: '출처' };
const H_SUMMARY: LabelMap = { zh: '摘要', en: 'Summary', ja: '要約', ko: '요약' };
const H_KEY_POINTS: LabelMap = { zh: '要点', en: 'Key points', ja: '要点', ko: '핵심 포인트' };
const H_FULL_TEXT: LabelMap = { zh: '全文', en: 'Full text', ja: '全文', ko: '전문' };

/** Hansard's own section marker. The block below it is verbatim English
 *  Hansard in every locale (the translated track already rendered under
 *  "full text"), so the heading and the rights notice stay English —
 *  mirroring the `hansard-original` verbatim marker on the HTML pages. */
const HANSARD_HEADING = 'Hansard (original, English)';
const HANSARD_RIGHTS = '© Parliament of Singapore — reproduced for reference only.';

/** A `## heading` plus its body, dropped entirely when the body is empty. */
interface Section {
  heading: string;
  body: string;
}

function section(heading: string, body: string | undefined | null): Section | undefined {
  const trimmed = (body ?? '').trim();
  return trimmed ? { heading, body: trimmed } : undefined;
}

/** Join paragraphs with a blank line, dropping empties. */
function paragraphs(lines: readonly string[] | undefined): string {
  return (lines ?? [])
    .map((p) => (p ?? '').trim())
    .filter(Boolean)
    .join('\n\n');
}

/** A prose blob (policy source text) arrives with single newlines between
 *  paragraphs; CommonMark would fold those into one paragraph. Re-space so
 *  the twin reads the way the page does. */
function reflow(body: string | undefined | null): string {
  return paragraphs((body ?? '').split(/\n{1,}/));
}

function bulletList(items: readonly string[] | undefined): string {
  return (items ?? [])
    .map((i) => (i ?? '').trim())
    .filter(Boolean)
    .map((i) => `- ${i}`)
    .join('\n');
}

interface MetaLine {
  /** Omitted for lines that already carry their own prefix (the license). */
  label?: string;
  value: string | undefined | null;
}

/** Assemble the document. Empty metadata lines and sections drop out. */
function render(title: string, meta: readonly MetaLine[], sections: readonly (Section | undefined)[]): string {
  const bullets = meta
    .filter((m) => (m.value ?? '').trim())
    .map((m) => (m.label ? `- ${m.label}: ${String(m.value).trim()}` : `- ${String(m.value).trim()}`))
    .join('\n');
  const bodies = sections.filter((s): s is Section => Boolean(s)).map((s) => `## ${s.heading}\n\n${s.body}`);
  return [`# ${title.trim()}`, bullets, ...bodies].filter(Boolean).join('\n\n') + '\n';
}

/** Permalink + license, the two lines every twin must carry. Kept together
 *  so no caller can ship one without the other (the eval asserts both). */
function provenance(path: string, lang: Lang): MetaLine[] {
  return [
    { label: 'sgai', value: `${SITE_ORIGIN}${localizedHref(path, lang)}` },
    // licenseLine() is self-labelling ("License: …" / "许可：…"), so it goes
    // out as a bare bullet.
    { value: licenseLine(lang) },
  ];
}

// ── debates ─────────────────────────────────────────────────────────────

export function debateToMarkdown(debate: Debate, lang: Lang): string {
  const title = pickLocalized<string>(debate, 'title', lang) || debate.title;
  const summary = pickLocalized<string>(debate, 'summary', lang) || '';
  const whyItMatters = pickLocalized<string>(debate, 'whyItMatters', lang) || '';
  const keyPoints = pickLocalized<string[]>(debate, 'keyPoints', lang) || [];
  const transcript = getDebateTranscript(debate.id);

  const meta: MetaLine[] = [
    { label: label(L_DATE, lang), value: debate.date },
    { label: label(L_ADDED, lang), value: debate.addedAt },
    { label: label(L_ACTORS, lang), value: (debate.speakers ?? []).join(' · ') },
    { label: label(L_SOURCE, lang), value: debate.sourceUrl },
    ...provenance(`/debates/${debate.id}/`, lang),
  ];

  const hansard = paragraphs(transcript?.paragraphsEn);

  return render(title, meta, [
    section(t(lang, 'whyItMattersHeading'), whyItMatters),
    section(label(H_SUMMARY, lang), summary),
    section(label(H_KEY_POINTS, lang), bulletList(keyPoints)),
    section(label(H_FULL_TEXT, lang), paragraphs(getDebateTranscriptParagraphs(debate.id, lang))),
    section(HANSARD_HEADING, hansard ? `${HANSARD_RIGHTS}\n\n${hansard}` : ''),
  ]);
}

// ── policies ────────────────────────────────────────────────────────────

/** `policy.id` is optional on the type (migration leftover) but every
 *  routed policy has one — the `[id]` pages filter on it before building
 *  paths, and so do the `.md` endpoints. */
export function policyToMarkdown(policy: Policy, lang: Lang): string {
  const title = pickLocalized<string>(policy, 'title', lang) || policy.title;
  const summary = pickLocalized<string>(policy, 'summary', lang) || '';
  const whyItMatters = pickLocalized<string>(policy, 'whyItMatters', lang) || '';

  // keyFacts are label/value pairs; each half has its own sibling fields.
  const facts = (policy.keyFacts ?? [])
    .map((fact) => {
      const factLabel = pickLocalized<string>(fact, 'label', lang) || '';
      const factValue = pickLocalized<string>(fact, 'value', lang) || '';
      return factLabel && factValue ? `${factLabel}: ${factValue}` : factLabel || factValue;
    })
    .filter(Boolean);

  const sourceText = getPolicySourceText(policy.id);
  const body = sourceText ? pickLocalized<string>(sourceText, 'body', lang) || '' : '';

  const meta: MetaLine[] = [
    { label: label(L_DATE, lang), value: policy.date },
    { label: label(L_ADDED, lang), value: policy.addedAt },
    { label: label(L_ACTORS, lang), value: policy.ministry },
    { label: label(L_SOURCE, lang), value: policy.sourceUrl || policy.pdfUrl },
    ...provenance(`/policies/${policy.id!}/`, lang),
  ];

  return render(title, meta, [
    section(t(lang, 'whyItMattersHeading'), whyItMatters),
    section(label(H_SUMMARY, lang), summary),
    section(label(H_KEY_POINTS, lang), bulletList(facts)),
    section(label(H_FULL_TEXT, lang), reflow(body)),
  ]);
}

// ── videos ──────────────────────────────────────────────────────────────

export function videoToMarkdown(video: VideoItem, lang: Lang): string {
  const title = pickLocalized<string>(video, 'title', lang) || video.title;
  const summary = pickLocalized<string>(video, 'summary', lang) || '';
  const whyItMatters = pickLocalized<string>(video, 'whyItMatters', lang) || '';
  const speakerTitle = pickLocalized<string>(video, 'speakerTitle', lang) || '';
  const digest = getVideoDigest(video.id, lang);

  const who = [speakerTitle ? `${video.speaker} (${speakerTitle})` : video.speaker, video.channel]
    .filter(Boolean)
    .join(' · ');

  const meta: MetaLine[] = [
    { label: label(L_DATE, lang), value: video.date },
    { label: label(L_ADDED, lang), value: video.addedAt },
    { label: label(L_ACTORS, lang), value: who },
    { label: label(L_SOURCE, lang), value: video.youtubeUrl },
    ...provenance(`/videos/${video.id}/`, lang),
  ];

  return render(title, meta, [
    section(t(lang, 'whyItMattersHeading'), whyItMatters),
    section(label(H_SUMMARY, lang), summary),
    section(label(H_KEY_POINTS, lang), bulletList(digest?.keyPoints)),
    section(label(H_FULL_TEXT, lang), paragraphs(getVideoTranscriptParagraphs(video.id, lang))),
  ]);
}

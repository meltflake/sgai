// Build-output guard for localized rendering.
//
// This catches the failure mode where data has titleJa/summaryKo/etc. but
// an Astro page still renders the old `isZh ? zh : en` fallback.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { categories } from '../../../src/data/policies.ts';
import { mddiSpeeches } from '../../../src/data/voices.ts';
import { getSpeechTranscriptParagraphs, speechId } from '../../../src/data/speech-transcripts.ts';
import { ecosystemEntityPages, leverPages } from '../../../src/utils/entity-pages.ts';
import { pickLocalized, type Lang } from '../../../src/i18n/index.ts';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const DIST = join(REPO_ROOT, 'dist');
const LOCALES: Lang[] = ['ja', 'ko'];
const MAX_ISSUES = 30;

interface Issue {
  path: string;
  reason: string;
  expected?: string;
}

const issues: Issue[] = [];

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function visibleText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<head[\s\S]*?<\/head>/i, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
  );
}

function normalize(text: string): string {
  return decodeEntities(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    .replace(/^[-•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(text: string): string {
  return normalize(text).replace(/\s+/g, '');
}

function readPage(path: string): string | null {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) {
    issues.push({ path, reason: 'missing built page' });
    return null;
  }
  return normalize(visibleText(readFileSync(file, 'utf8')));
}

function hasExplicitLocaleField(record: unknown, baseKey: string, lang: Lang): boolean {
  const suffix = lang === 'ja' ? 'Ja' : lang === 'ko' ? 'Ko' : '';
  if (!suffix || typeof record !== 'object' || record === null) return false;
  const value = (record as Record<string, unknown>)[`${baseKey}${suffix}`];
  return typeof value === 'string' && value.trim().length > 0;
}

function assertPageContains(path: string, pageText: string, expected: string, reason: string): void {
  const needle = normalize(expected);
  const compactNeedle = compact(needle);
  if (compactNeedle.length < 8) return;
  const compactSample = compactNeedle.slice(0, Math.min(72, compactNeedle.length));
  if (!compact(pageText).includes(compactSample)) {
    issues.push({ path, reason, expected: needle.slice(0, Math.min(90, needle.length)) });
  }
}

function checkRecordFields(path: string, pageText: string, record: unknown, lang: Lang, fields: string[]): void {
  for (const field of fields) {
    if (!hasExplicitLocaleField(record, field, lang)) continue;
    const expected = pickLocalized<string>(record, field, lang);
    if (expected) assertPageContains(path, pageText, expected, `${field}${lang === 'ja' ? 'Ja' : 'Ko'} not rendered`);
  }
}

function checkPolicies(): void {
  for (const lang of LOCALES) {
    for (const policy of categories.flatMap((category) => category.policies)) {
      if (!policy.id) continue;
      const path = `${lang}/policies/${policy.id}`;
      const pageText = readPage(path);
      if (!pageText) continue;
      checkRecordFields(path, pageText, policy, lang, ['title', 'summary', 'source']);
      if (!policy.sections || policy.sections.length === 0) checkRecordFields(path, pageText, policy, lang, ['content']);
      for (const section of policy.sections || []) checkRecordFields(path, pageText, section, lang, ['title', 'body']);
      for (const milestone of policy.milestones || [])
        checkRecordFields(path, pageText, milestone, lang, ['title', 'description']);
    }
  }
}

function checkEcosystem(): void {
  for (const lang of LOCALES) {
    for (const page of ecosystemEntityPages) {
      const path = `${lang}/ecosystem/${page.slug}`;
      const pageText = readPage(path);
      if (!pageText) continue;
      checkRecordFields(path, pageText, page.entity, lang, [
        'name',
        'summary',
        'whatItIs',
        'aiRelevance',
        'singaporeRelevance',
        'scale',
      ]);
      for (const milestone of page.entity.milestones || [])
        checkRecordFields(path, pageText, milestone, lang, ['title', 'description']);
      for (const product of page.entity.products || []) checkRecordFields(path, pageText, product, lang, ['name', 'description']);
      for (const partner of page.entity.partners || []) checkRecordFields(path, pageText, partner, lang, ['name', 'description']);
    }
  }
}

function checkLevers(): void {
  for (const lang of LOCALES) {
    for (const page of leverPages) {
      const path = `${lang}/levers/${page.slug}`;
      const pageText = readPage(path);
      if (!pageText) continue;
      checkRecordFields(
        path,
        pageText,
        page.lever,
        lang,
        page.kind === 'lever' ? ['name', 'subtitle', 'whatStateDoes', 'bottleneckSolved'] : ['name', 'whatStateDoes', 'bottleneckSolved']
      );
      if (page.kind === 'item') checkRecordFields(path, pageText, page.item, lang, ['name', 'scale', 'description']);
    }
  }
}

function checkSpeeches(): void {
  for (const lang of LOCALES) {
    for (const speech of mddiSpeeches) {
      const id = speechId(speech);
      const path = `${lang}/speeches/${id}`;
      const pageText = readPage(path);
      if (!pageText) continue;
      checkRecordFields(path, pageText, speech, lang, ['title', 'speakerTitle', 'event']);

      const englishParagraph = getSpeechTranscriptParagraphs(id, 'en').find((p) => {
        const words = p.match(/[A-Za-z][A-Za-z0-9'’-]*/g) || [];
        return words.length >= 8;
      });
      if (!englishParagraph) continue;
      const sample = normalize(englishParagraph).slice(0, 90);
      if (pageText.includes(sample)) {
        issues.push({
          path,
          reason: `${lang} speech page renders English transcript body`,
          expected: sample,
        });
      }
    }
  }
}

function main(): void {
  if (!existsSync(DIST)) {
    process.stderr.write('[localized-rendering] dist/ not found. Run `npm run build` first.\n');
    process.exit(2);
  }

  checkPolicies();
  checkEcosystem();
  checkLevers();
  checkSpeeches();

  if (issues.length > 0) {
    process.stderr.write(`[localized-rendering] FAIL — ${issues.length} localized rendering issue(s).\n`);
    for (const issue of issues.slice(0, MAX_ISSUES)) {
      process.stderr.write(`  ${issue.path}: ${issue.reason}`);
      if (issue.expected) process.stderr.write(` — expected "${issue.expected}…"`);
      process.stderr.write('\n');
    }
    if (issues.length > MAX_ISSUES) process.stderr.write(`  … and ${issues.length - MAX_ISSUES} more\n`);
    process.exit(1);
  }

  process.stdout.write('[localized-rendering] OK — localized fields are rendered on ja/ko critical routes.\n');
}

main();

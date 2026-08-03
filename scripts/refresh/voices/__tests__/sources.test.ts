// Unit tests for the voices scan tiering: speech-detection (isSpeechUrl)
// vs AI-detection (isAiSpeechUrl). Regression guard for the 2026-06 miss
// where a ministerial speech whose slug names no AI keyword
// ("asia-economic-summit") was wrongly dropped by the old slug-only gate.
// Relevance is now decided on the speech body (run.ts judgeAiRelevance),
// not on the URL.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isSpeechUrl,
  isAiSpeechUrl,
  isSpeechUrlForSource,
  speechIdForSource,
  ministryFromUrl,
  VOICES_SOURCES,
} from '../sources.ts';
import { speechIdFromUrl } from '../../../../src/data/speech-transcripts.ts';

const MDDI = 'https://www.mddi.gov.sg/newsroom/';
const masSource = VOICES_SOURCES.find((s) => s.ministry === 'MAS')!;
const pmoSource = VOICES_SOURCES.find((s) => s.ministry === 'PMO')!;
const mddiSource = VOICES_SOURCES.find((s) => s.ministry === 'MDDI')!;

test('isSpeechUrl: keynote/address/remarks/speech/transcript slugs are speeches', () => {
  assert.equal(isSpeechUrl(`${MDDI}keynote-address-by-minister-at-x/`), true);
  assert.equal(isSpeechUrl(`${MDDI}opening-remarks-by-minister-at-y/`), true);
  assert.equal(isSpeechUrl(`${MDDI}transcript-of-minister-at-z/`), true);
});

test('isSpeechUrl: non-speech newsroom pages are not speeches', () => {
  assert.equal(
    isSpeechUrl(`${MDDI}1st-asean-digital-ministers-meeting-approves-initiatives/`),
    false
  );
  assert.equal(isSpeechUrl(`${MDDI}factsheet-on-something/`), false);
});

test('isSpeechUrl: non-newsroom URLs are rejected', () => {
  assert.equal(isSpeechUrl('https://www.mddi.gov.sg/about-us/'), false);
});

test('isAiSpeechUrl: slug naming AI is a fast-pass', () => {
  assert.equal(isAiSpeechUrl(`${MDDI}keynote-address-minister-at-ai-summit/`), true);
  assert.equal(isAiSpeechUrl(`${MDDI}opening-address-at-national-ai-conference/`), true);
});

test('REGRESSION: asia-economic-summit is a speech but NOT an AI fast-pass', () => {
  // The exact slug the old slug-only gate dropped. It must now be admitted
  // as a speech (isSpeechUrl=true) and left to content judgement
  // (isAiSpeechUrl=false → run.ts judges the body).
  const url = `${MDDI}keynote-address-by-minister-josephine-teo-at-the-asia-economic-summit-in-jakarta--indonesia/`;
  assert.equal(isSpeechUrl(url), true, 'must be admitted as a speech');
  assert.equal(isAiSpeechUrl(url), false, 'slug names no AI keyword → not a fast-pass');
});

test('REGRESSION: meta llama demo day is a speech but not a fast-pass', () => {
  const url = `${MDDI}opening-address-by-minister-josephine-teo-at-meta-s-llama-incubator-demo-day/`;
  assert.equal(isSpeechUrl(url), true);
  // "llama" is not in AI_SLUG_PATTERNS, so the slug alone won't fast-pass.
  assert.equal(isAiSpeechUrl(url), false);
});

// ── 2026-08 multi-source expansion (MAS + PMO) ─────────────────────────

test('MAS: every /news/speeches/ URL is a speech regardless of slug keywords', () => {
  // MAS slugs routinely name no speech keyword ("delivering-on-the-insurers-promise").
  const url = 'https://www.mas.gov.sg/news/speeches/2026/delivering-on-the-insurers-promise';
  assert.equal(isSpeechUrlForSource(url, masSource), true);
});

test('MAS: URL path year below minUrlYear is dropped at scan time', () => {
  const url = 'https://www.mas.gov.sg/news/speeches/2019/some-historical-speech';
  assert.equal(isSpeechUrlForSource(url, masSource), false);
  assert.equal(speechIdForSource(url, masSource), null);
});

test('MAS: non-speeches MAS pages are rejected', () => {
  assert.equal(
    isSpeechUrlForSource('https://www.mas.gov.sg/news/media-releases/2026/some-release', masSource),
    false
  );
});

test('PMO: newsroom slug keyword rules apply, incl. dialogue/fireside-chat', () => {
  const fireside =
    'https://www.pmo.gov.sg/newsroom/dpm-gan-kim-yong-at-the-trust-and-ai-leaders-dialogue-fireside-chat/';
  assert.equal(isSpeechUrlForSource(fireside, pmoSource), true);
  assert.equal(
    isSpeechUrlForSource('https://www.pmo.gov.sg/newsroom/pmo-press-statement-on-something/', pmoSource),
    false
  );
});

test('speech ids are ministry-prefixed for MAS/PMO, bare for MDDI (legacy)', () => {
  assert.equal(
    speechIdForSource('https://www.mas.gov.sg/news/speeches/2026/keynote-at-fiesta', masSource),
    'mas--keynote-at-fiesta'
  );
  assert.equal(
    speechIdForSource('https://www.pmo.gov.sg/newsroom/pm-speech-at-x/', pmoSource),
    'pmo--pm-speech-at-x'
  );
  assert.equal(
    speechIdForSource(`${MDDI}keynote-address-by-minister-at-x/`, mddiSource),
    'keynote-address-by-minister-at-x'
  );
});

test('LOCKSTEP: speechIdForSource agrees with src speechIdFromUrl for all sources', () => {
  // Detail-page routes derive the id from the record URL through
  // speechIdFromUrl — any divergence breaks /speeches/<id>/ routing.
  const urls = [
    'https://www.mas.gov.sg/news/speeches/2026/keynote-at-fiesta',
    'https://www.pmo.gov.sg/newsroom/pm-speech-at-x/',
    `${MDDI}keynote-address-by-minister-at-x/`,
  ];
  const sources = [masSource, pmoSource, mddiSource];
  for (let i = 0; i < urls.length; i += 1) {
    assert.equal(speechIdForSource(urls[i], sources[i]), speechIdFromUrl(urls[i]));
  }
});

test('ministryFromUrl maps registered domains and rejects others', () => {
  assert.equal(ministryFromUrl('https://www.mddi.gov.sg/newsroom/x/'), 'MDDI');
  assert.equal(ministryFromUrl('https://www.mas.gov.sg/news/speeches/2026/x'), 'MAS');
  assert.equal(ministryFromUrl('https://www.pmo.gov.sg/newsroom/x/'), 'PMO');
  assert.equal(ministryFromUrl('https://www.example.com/newsroom/x/'), null);
});

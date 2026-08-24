// Extraction regression tests for the 2026-08 multi-source expansion.
// The fixtures are compact recreations of the live MAS / PMO templates
// (verified by probe on 2026-08-03) — they pin the structural quirks the
// extractor must survive:
//   MAS: logo <h1> is empty (title comes from og:title); the body div
//        (`_mas-typeset`) shares <main> with related-article teasers
//        (`mas-search-card`) that must not leak; the publication date is
//        a "Published Date:" text marker with &#160; entities.
//   PMO: breadcrumb "Newsroom …" paragraph, bare speaker byline (a
//        substring of the title), and a "Topics" tag-list header must
//        all be dropped; body <p> blocks survive.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { extractParagraphs, extractDate, extractH1, splitMasPoints } from '../fetch.ts';

const MAS_HTML = `<!doctype html><html><head>
<meta property="og:title" content="Keynote Speech by Mr Gan Kim Yong at the Financial Industry Fiesta 2026 on 19 May 2026" />
<title>Keynote Speech | MAS</title></head><body>
<header><h1 class="mas-site-header__logo"><img src="/logo.svg" /></h1></header>
<main class="mas-layout__main">
<div class="mas-ancillaries"><span>Published Date: 19&#160;May&#160;2026</span></div>
<div class="mas-text-summary mas-rte-content"><p>Summary teaser line.</p></div>
<h1 class="mas-text-h1">Keynote Speech by Mr Gan Kim Yong at the Financial Industry Fiesta 2026</h1>
<div class="_mas-typeset contain mas-rte-content m-b:l">
<p>Professor Lily Kong, President of SMU, distinguished guests, ladies and gentlemen.</p>
<p>1. I am delighted to join you at the Financial Industry Fiesta this year.</p>
<p>2. Technologies like artificial intelligence are transforming the financial sector.</p>
<p>3. MAS will continue to support responsible AI adoption across our institutions.</p>
<p>4. Let me highlight three priorities for the industry.</p>
<p>24. Singapore has navigated change well by staying open and adaptable.</p>
</div>
<div class="mas-search-card"><p>At the Asia Pacific Captive Forum 2026, Mr Lim Cheng Khai spoke about insurance.</p></div>
<div class="mas-search-card"><p>At the ABS Annual Dinner 2026, Mr Gan Kim Yong spoke about banking.</p></div>
</main></body></html>`;

const PMO_TITLE =
  'DPM Gan Kim Yong at the "Trust and AI: Navigating a World in Transition" Leaders Dialogue Fireside Chat';

const PMO_HTML = `<!doctype html><html><head>
<meta property="og:title" content="DPM Gan Kim Yong at the &quot;Trust and AI: Navigating a World in Transition&quot; Leaders Dialogue Fireside Chat" />
<title>PMO | Newsroom</title></head><body>
<main>
<p>Newsroom DPM Gan Kim Yong at the "Trust and AI" Leaders Dialogue Fireside Chat Transcripts</p>
<div class="prose-body-base"><p>DPM Gan Kim Yong</p></div>
<h1 class="prose-display-md">DPM Gan Kim Yong at the &quot;Trust and AI: Navigating a World in Transition&quot; Leaders Dialogue Fireside Chat</h1>
<p>20 May 2026</p>
<p>Topics</p>
<p>Moderator (Tan Su Shan, Group CEO of DBS): Thank you DPM, that was an encouraging message for us all.</p>
<p>The first theme is for the many here who are investing in Singapore, institutional investors and business investors alike.</p>
<p>The second theme is around AI security. There is a lot of concern around data security and cybersecurity.</p>
<p>And the third theme is around workforce and jobs. How do we manage the narrative around that?</p>
<p>So, with that, DPM - this has been a real tour de force. Thank you very much.</p>
<p>Call the 24/7 ScamShield Helpline at 1799 if you are unsure if something is a scam.</p>
</main></body></html>`;

test('MAS: body paragraphs extracted, related-article teasers excluded', () => {
  const ps = extractParagraphs(MAS_HTML, {
    sourceUrl: 'https://www.mas.gov.sg/news/speeches/2026/keynote-at-fiesta',
  });
  assert.equal(ps.length, 6);
  assert.match(ps[0], /Professor Lily Kong/);
  assert.match(ps[5], /navigated change well/);
  assert.ok(!ps.some((p) => p.includes('Asia Pacific Captive Forum')), 'teaser leaked');
  assert.ok(!ps.some((p) => p.includes('ABS Annual Dinner')), 'teaser leaked');
  assert.ok(!ps.some((p) => p.includes('Summary teaser')), 'summary block leaked');
});

test('MAS: date comes from the "Published Date:" marker (with &#160;)', () => {
  assert.equal(extractDate(MAS_HTML), '2026-05-19');
});

test('MAS: empty logo h1 falls through to og:title', () => {
  assert.match(extractH1(MAS_HTML), /^Keynote Speech by Mr Gan Kim Yong/);
});

test('PMO: breadcrumb, byline, Topics and ScamShield lines are dropped', () => {
  const ps = extractParagraphs(PMO_HTML, {
    sourceUrl: 'https://www.pmo.gov.sg/newsroom/dpm-gan-kim-yong-fireside-chat/',
    title: PMO_TITLE,
  });
  assert.equal(ps.length, 5);
  assert.match(ps[0], /^Moderator \(Tan Su Shan/);
  assert.ok(!ps.some((p) => /^Newsroom\b/.test(p)), 'breadcrumb leaked');
  assert.ok(!ps.some((p) => p === 'DPM Gan Kim Yong'), 'byline leaked');
  assert.ok(!ps.some((p) => p === 'Topics'), 'Topics header leaked');
  assert.ok(!ps.some((p) => p.includes('ScamShield')), 'ScamShield leaked');
});

test('PMO: inline date fallback still works', () => {
  assert.equal(extractDate(PMO_HTML), '2026-05-20');
});

test('MAS: packed numbered points and o-bullets split into one paragraph each', () => {
  // The 2026-08-03 insurers-promise page packed multiple numbered points
  // into single <p> blocks — 5 mega-paragraphs for a 35-point speech.
  const packed = [
    'Ms Wong Sze Keed, President of LIA Singapore Distinguished guests',
    '1. Thank you for inviting me. 2. When I last addressed you in 2023, I reached for an analogy. a. Yes, the nature of jobs is changing.',
    '20. Our objective is clear. o First, we are implementing a new capital treatment. o Second, we have refined the treatment of structured products.',
  ];
  const out = splitMasPoints(packed);
  assert.deepEqual(out, [
    'Ms Wong Sze Keed, President of LIA Singapore Distinguished guests',
    '1. Thank you for inviting me.',
    '2. When I last addressed you in 2023, I reached for an analogy.',
    'a. Yes, the nature of jobs is changing.',
    '20. Our objective is clear.',
    'First, we are implementing a new capital treatment.',
    'Second, we have refined the treatment of structured products.',
  ]);
  // Boundary requires sentence-ending punctuation BEFORE the marker: a
  // salutation trailing straight into "1." does not split (cosmetic
  // merge beats corrupting identifiers).
  assert.deepEqual(splitMasPoints(['Ladies and gentlemen 1. Thank you.']), [
    'Ladies and gentlemen 1. Thank you.',
  ]);
});

const MOE_HTML = `<!doctype html><html><head>
<meta property="og:title" content="Speech by Minister for Education Mr Desmond Lee at the ST Education Forum" />
<title>MOE speech</title></head><body>
<main>
<p>Published on: <!-- -->01 Apr 2026</p>
<p>News Speeches</p>
<p>Ms Karamjit Kaur, Associate Editor, The Straits Times My fellow panellists</p>
<p>1. Thank you for having me at this forum on AI in higher education.</p>
<p>2. AI is reshaping how our universities teach and assess.</p>
</main>
<script>{"notice":"maintenance on Sunday, 16 August 2026, from 12am"}</script>
</body></html>`;

test('MOE: "Published on:" line and "News Speeches" breadcrumb are dropped; date extracted', () => {
  const ps = extractParagraphs(MOE_HTML, {
    sourceUrl: 'https://www.moe.gov.sg/news/speeches/20260401-speech-desmond-lee',
  });
  assert.equal(ps.length, 3);
  assert.match(ps[0], /^Ms Karamjit Kaur/);
  assert.ok(!ps.some((p) => /^Published on:/i.test(p)), 'date marker leaked');
  assert.ok(!ps.some((p) => p === 'News Speeches'), 'breadcrumb leaked');
  assert.equal(extractDate(MOE_HTML), '2026-04-01');
});

test('MAS splitter: dates and decimals do not trigger false splits', () => {
  const p = ['3. In January 2026, growth hit 4.5 per cent. RBC 2. Our framework held.'];
  // "4.5" (decimal) and "RBC 2." (identifier) must not split; only true
  // point markers (digit-dot-space followed by a capital) do.
  const out = splitMasPoints(p);
  assert.equal(out.length, 1);
});

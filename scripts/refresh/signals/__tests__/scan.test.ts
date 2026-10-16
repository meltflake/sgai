// scripts/refresh/signals/__tests__/scan.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { decodeEntities, parseRssXml, scanAll } from '../scan.ts';
import type { SignalSource } from '../sources.ts';

const RSS = `<?xml version="1.0"?><rss><channel>
<item><title><![CDATA[Singapore&#039;s AI push: IMDA expands sandbox]]></title><link>https://www.businesstimes.com.sg/tech/ai-sandbox</link><pubDate>Thu, 15 Oct 2026 08:00:00 +0800</pubDate><category>Tech</category></item>
<item><title>Bank results beat estimates</title><link>https://www.businesstimes.com.sg/companies/bank-results</link><pubDate>Thu, 15 Oct 2026 09:00:00 +0800</pubDate></item>
<item><title>New paper on LLM reasoning</title><link>https://aisingapore.org/paper-x/</link><category>AI Research</category></item>
</channel></rss>`;

test('parseRssXml: parses items, CDATA titles and entities', () => {
  const items = parseRssXml(RSS);
  assert.equal(items.length, 3);
  assert.equal(items[0].title, "Singapore's AI push: IMDA expands sandbox");
  assert.equal(items[0].link, 'https://www.businesstimes.com.sg/tech/ai-sandbox');
  assert.equal(items[0].pubDate, 'Thu, 15 Oct 2026 08:00:00 +0800');
  assert.deepEqual(items[2].categories, ['AI Research']);
});

test('parseRssXml: an HTML page (Cloudflare challenge) yields no items', () => {
  assert.deepEqual(parseRssXml('<!DOCTYPE html><html><title>Just a moment...</title></html>'), []);
});

const bt: SignalSource = {
  id: 'bt',
  name: 'The Business Times',
  kind: 'rss',
  url: 'https://bt.example/rss',
  requireAiKeyword: true,
};
const aisg: SignalSource = {
  id: 'aisg',
  name: 'AI Singapore',
  kind: 'rss',
  url: 'https://aisg.example/feed',
  requireAiKeyword: false,
  rssCategoryExcludes: ['AI Research'],
};
const mddi: SignalSource = {
  id: 'mddi',
  name: 'MDDI',
  kind: 'sitemap',
  url: 'https://mddi.example/sitemap.xml',
  urlFilter: /\/newsroom\//,
  excludeSpeeches: true,
  requireAiKeyword: true,
};

test('scanAll: keyword gate, category excludes, speech excludes, old lastmod, known URLs', async () => {
  const result = await scanAll([bt, aisg, mddi], {
    today: '2026-10-16',
    days: 7,
    known: new Set(['https://mddi.example/newsroom/known-ai-release/']),
    fetchText: async (url) => (url.includes('bt') ? RSS : RSS.replace(/businesstimes\.com\.sg/g, 'aisingapore.org')),
    listSitemap: async () => [
      { loc: 'https://mddi.example/newsroom/mddi-launches-ai-coe/', lastmod: '2026-10-14' },
      { loc: 'https://mddi.example/newsroom/opening-remarks-by-minister-at-ai-day/', lastmod: '2026-10-14' },
      { loc: 'https://mddi.example/newsroom/known-ai-release/', lastmod: '2026-10-14' },
      { loc: 'https://mddi.example/newsroom/old-ai-release/', lastmod: '2026-08-01' },
      { loc: 'https://mddi.example/newsroom/dialect-drama/', lastmod: '2026-10-15' },
      { loc: 'https://mddi.example/about-us/ai/', lastmod: '2026-10-15' },
    ],
  });
  const urls = result.candidates.map((c) => c.url).sort();
  assert.deepEqual(urls, [
    'https://aisingapore.org/paper-x/',
    'https://mddi.example/newsroom/mddi-launches-ai-coe/',
    'https://www.aisingapore.org/companies/bank-results',
    'https://www.aisingapore.org/tech/ai-sandbox',
    'https://www.businesstimes.com.sg/tech/ai-sandbox',
  ]);
  const mddiCand = result.candidates.find((c) => c.sourceId === 'mddi');
  assert.equal(mddiCand?.kind, 'sitemap');
  assert.equal(mddiCand?.hintedDate, '2026-10-14');
});

test('scanAll: one failing source is reported and the others still scan', async () => {
  const result = await scanAll([bt, mddi], {
    today: '2026-10-16',
    days: 7,
    known: new Set(),
    fetchText: async () => RSS,
    listSitemap: async () => {
      throw new Error('ETIMEDOUT');
    },
  });
  assert.equal(result.candidates.length, 2);
  assert.deepEqual(result.failures, [{ sourceId: 'mddi', error: 'ETIMEDOUT' }]);
});

test('decodeEntities: decimal, hex and named entities', () => {
  assert.equal(decodeEntities('MDDI&#x27;s Response &amp; Q&#39;s'), "MDDI's Response & Q's");
});

test('scanAll: minUrlYear drops URLs whose path year is older than the window', async () => {
  const mas: SignalSource = {
    id: 'mas',
    name: 'MAS',
    kind: 'sitemap',
    url: 'https://mas.example/sitemap.xml',
    urlFilter: /\/news\/media-releases\/20\d\d\//,
    requireAiKeyword: true,
    yearInPath: true,
  };
  const result = await scanAll([mas], {
    today: '2026-01-05',
    days: 7,
    known: new Set(),
    listSitemap: async () => [
      { loc: 'https://mas.example/news/media-releases/2023/mas-ai-guidelines' },
      { loc: 'https://mas.example/news/media-releases/2025/mas-ai-pathfinder' },
      { loc: 'https://mas.example/news/media-releases/2026/mas-genai-sandbox' },
    ],
  });
  assert.deepEqual(
    result.candidates.map((c) => c.url),
    ['https://mas.example/news/media-releases/2025/mas-ai-pathfinder', 'https://mas.example/news/media-releases/2026/mas-genai-sandbox']
  );
});

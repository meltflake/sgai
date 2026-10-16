// scripts/lib/__tests__/gov-fetch.test.ts
//
// govFetch + listSitemap hit the network. Unit tests stub global fetch
// to validate parsing logic only (no real HTTP).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { govFetch, listSitemap } from '../gov-fetch.ts';

type FetchSig = typeof globalThis.fetch;

function withMockFetch<T>(impl: FetchSig, fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  return fn().finally(() => {
    globalThis.fetch = original;
  });
}

function htmlResponse(body: string, opts: { status?: number; finalUrl?: string } = {}): Response {
  const r = new Response(body, {
    status: opts.status ?? 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
  if (opts.finalUrl) {
    Object.defineProperty(r, 'url', { value: opts.finalUrl });
  }
  return r;
}

test('govFetch: extracts title, date, body, pdf links', async () => {
  const html = `<!doctype html>
<html><head>
  <title>Test page title</title>
  <meta property="og:title" content="OG Title">
  <meta property="article:published_time" content="2026-05-03T10:00:00Z">
</head>
<body>
  <h1>Heading</h1>
  <p>Hello world.</p>
  <a href="/file.pdf">spec</a>
  <a href="https://other.gov.sg/doc.pdf">doc</a>
</body></html>`;

  await withMockFetch(
    async () => htmlResponse(html, { finalUrl: 'https://imda.gov.sg/news/x' }),
    async () => {
      const page = await govFetch('https://imda.gov.sg/news/x');
      assert.equal(page.title, 'OG Title');
      assert.equal(page.publishedDate, '2026-05-03');
      assert.ok(page.contentText.includes('Hello world'));
      assert.ok(page.pdfLinks.includes('https://imda.gov.sg/file.pdf'));
      assert.ok(page.pdfLinks.includes('https://other.gov.sg/doc.pdf'));
      assert.equal(page.status, 200);
    }
  );
});

test('govFetch: falls back to <title> when no og:title', async () => {
  const html = `<html><head><title>Plain Title</title></head><body><p>x</p></body></html>`;
  await withMockFetch(
    async () => htmlResponse(html, { finalUrl: 'https://x.gov.sg/y' }),
    async () => {
      const page = await govFetch('https://x.gov.sg/y');
      assert.equal(page.title, 'Plain Title');
    }
  );
});

test('govFetch: parses "5 May 2026" inline date when no meta', async () => {
  const html = `<html><head><title>X</title></head><body><p>Published on 5 May 2026.</p></body></html>`;
  await withMockFetch(
    async () => htmlResponse(html, { finalUrl: 'https://x.gov.sg/y' }),
    async () => {
      const page = await govFetch('https://x.gov.sg/y');
      assert.equal(page.publishedDate, '2026-05-05');
    }
  );
});

// Regression 2026-10-17: gov.sg pages carry a site-wide "last updated" stamp
// (footer attribute + a "LAST UPDATED:" line) set to the crawl day. The
// inline fallback took it as the publication date, so a June 2023 IMDA press
// release looked published today and passed every old-news gate.
test('govFetch: ignores gov.sg "last updated" stamps and reads publish_date', async () => {
  const html = `<html><head><title>Singapore Launches AI Verify Foundation</title></head><body>
<footer><optical-attributions copyright-text="Government of Singapore" last-updated="16 Oct 2026"></optical-attributions></footer>
<main><p>Body text about AI Verify.</p></main>
<p class="detail-content__last-update">LAST UPDATED: <!-- -->16 Oct 2026</p>
<script>self.__next_f.push([1,"{\\"read_time\\":\\"6\\",\\"publish_date\\":\\"07 Jun 2023\\"}"])</script>
</body></html>`;
  const page = await withMockFetch(
    async () => htmlResponse(html),
    () => govFetch('https://www.imda.gov.sg/x', { retries: 1 })
  );
  assert.equal(page.publishedDate, '2023-06-07');
});

test('govFetch: JSON-LD datePublished wins over an inline page date', async () => {
  const html = `<html><head><script type="application/ld+json">{"@type":"NewsArticle","datePublished":"14 Oct 2026"}</script></head>
<body><p>Updated 16 Oct 2026</p></body></html>`;
  const page = await withMockFetch(
    async () => htmlResponse(html),
    () => govFetch('https://www.edb.gov.sg/x', { retries: 1 })
  );
  assert.equal(page.publishedDate, '2026-10-14');
});

test('govFetch: a page with only a last-updated stamp has no date', async () => {
  const html = `<html><body><p>Text</p><footer><span last-updated="16 Oct 2026"></span>Last updated: 16 Oct 2026</footer></body></html>`;
  const page = await withMockFetch(
    async () => htmlResponse(html),
    () => govFetch('https://www.mddi.gov.sg/x', { retries: 1 })
  );
  assert.equal(page.publishedDate, null);
});

test('govFetch: throws on persistent 404', async () => {
  await withMockFetch(
    async () => new Response('not found', { status: 404 }),
    async () => {
      await assert.rejects(() => govFetch('https://x.gov.sg/missing', { retries: 1 }), /404/);
    }
  );
});

test('listSitemap: returns all <loc> from a flat sitemap', async () => {
  const xml = `<?xml version="1.0"?>
<urlset>
  <url><loc>https://x.gov.sg/a</loc></url>
  <url><loc>https://x.gov.sg/b</loc></url>
</urlset>`;
  await withMockFetch(
    async () => new Response(xml, { status: 200 }),
    async () => {
      const urls = await listSitemap('https://x.gov.sg/sitemap.xml');
      assert.deepEqual(urls, ['https://x.gov.sg/a', 'https://x.gov.sg/b']);
    }
  );
});

test('listSitemap: recurses into sitemap-index files', async () => {
  const indexXml = `<?xml version="1.0"?>
<sitemapindex>
  <sitemap><loc>https://x.gov.sg/sitemap-1.xml</loc></sitemap>
</sitemapindex>`;
  const childXml = `<?xml version="1.0"?>
<urlset>
  <url><loc>https://x.gov.sg/page-a</loc></url>
</urlset>`;

  let calls = 0;
  await withMockFetch(
    async (url) => {
      calls += 1;
      const u = typeof url === 'string' ? url : (url as URL).toString();
      if (u.endsWith('sitemap.xml')) return new Response(indexXml, { status: 200 });
      if (u.endsWith('sitemap-1.xml')) return new Response(childXml, { status: 200 });
      return new Response('', { status: 404 });
    },
    async () => {
      const urls = await listSitemap('https://x.gov.sg/sitemap.xml');
      assert.deepEqual(urls, ['https://x.gov.sg/page-a']);
      assert.equal(calls, 2);
    }
  );
});

test('listSitemap: returns empty on fetch failure', async () => {
  await withMockFetch(
    async () => new Response('', { status: 500 }),
    async () => {
      const urls = await listSitemap('https://x.gov.sg/sitemap.xml');
      assert.deepEqual(urls, []);
    }
  );
});

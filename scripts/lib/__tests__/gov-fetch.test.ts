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

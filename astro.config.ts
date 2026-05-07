import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import pagefind from 'astro-pagefind';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';
import { LOCALES, ROUTE_DEFAULT_LOCALE } from './src/i18n';

// BCP 47 hreflang code per locale (used in sitemap alternates). Add new
// locales here as they're added to LOCALES.
const HREFLANG_MAP: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
};
const sitemapLocales = Object.fromEntries(LOCALES.map((l) => [l, HREFLANG_MAP[l] ?? l]));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: 'https://sgai.md',
  output: 'static',
  // Cloudflare Pages 308-redirects /foo → /foo/ for static directories.
  // Force Astro (and downstream sitemap/RSS integrations) to emit
  // trailing-slash URLs so internal navigation lands directly.
  trailingSlash: 'always',
  build: { format: 'directory' },

  // i18n architecture (v0.7.0, post-Phase-2):
  //   EN is the route-default locale and lives at the unprefixed root
  //   (`/policies/`); ZH lives under `src/pages/zh/...` and renders at
  //   `/zh/policies/`. EN blog posts at `/<slug>/`, ZH at `/zh/<slug>/`.
  //
  //   We deliberately do NOT use Astro's `i18n` config block. Enabling
  //   it (especially with `fallback`) causes Astro to re-emit every
  //   prerendered route under the fallback locale, which collides with
  //   our hand-built routes and produces duplicate paths in `dist/`.
  //   Doing the routing ourselves keeps build output canonical and
  //   gives us full control over the per-page hreflang in CommonMeta.

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    // Sitemap: serialize hreflang alternates so search engines can pair
    // each locale's URLs with its siblings. The `i18n` block here is for
    // sitemap serialization only — Astro's own i18n routing stays
    // disabled. Locales come from src/i18n/index.ts so adding a new
    // language to LOCALES picks it up here automatically.
    sitemap({
      i18n: {
        defaultLocale: ROUTE_DEFAULT_LOCALE,
        locales: sitemapLocales,
      },
      // Strip noindex pages from sitemap. Two layers:
      //   (a) Query-string URLs (analysisPending drilldowns linked with ?region=...).
      //   (b) Static pages whose emitted HTML contains <meta name="robots" content="...noindex...">.
      //
      // Layer (b) is a self-correcting check — if any page sets robots.index=false at
      // build time, this filter picks it up automatically. Without this, GSC reports
      // them as "Crawled - currently not indexed" because we keep advertising them in
      // the sitemap and Google has to fetch them to discover the noindex.
      serialize(item) {
        if (item.url.includes('?')) return undefined;
        try {
          const url = new URL(item.url);
          let p = url.pathname;
          if (p.endsWith('/')) p += 'index.html';
          else if (!p.endsWith('.html')) p += '/index.html';
          const htmlPath = path.join(__dirname, 'dist', p);
          const html = fs.readFileSync(htmlPath, 'utf8');
          if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
            return undefined;
          }
        } catch {
          // File not found / unreadable: keep the URL (safer default than dropping).
        }
        return item;
      },
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),

    pagefind(),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});

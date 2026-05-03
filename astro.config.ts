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

  // i18n architecture (v0.6.0):
  //   We manage the zh/en routing layout manually — zh stays at the
  //   unprefixed root, EN lives under `src/pages/en/...` and EN blog
  //   posts get `en/` prefixed onto their permalinks at build time.
  //
  //   We deliberately do NOT use Astro's `i18n` config block. Enabling
  //   it (especially with `fallback: { en: 'zh' }`) causes Astro to
  //   re-emit every prerendered route under `/en/...` as a fallback,
  //   which collides with our hand-built EN routes and produces
  //   duplicate `/en/en/<slug>/` paths in `dist/`. Doing the routing
  //   ourselves keeps the build output canonical (`/foo/` for zh,
  //   `/en/foo/` for en, no duplicates).

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
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

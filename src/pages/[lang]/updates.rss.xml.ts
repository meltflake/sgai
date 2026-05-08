import type { APIRoute } from 'astro';
import { getRssString } from '@astrojs/rss';

import { SITE } from 'astrowind:config';
import { sortedUpdates } from '~/data/updates';
import { NON_DEFAULT_ROUTE_LOCALES, localizedHref, t, type Lang } from '~/i18n';

export const prerender = true;

export function getStaticPaths() {
  return NON_DEFAULT_ROUTE_LOCALES.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const updates = sortedUpdates();

  const rss = await getRssString({
    title: t(lang, 'updatesRssTitle'),
    description: t(lang, 'updatesRssDescription'),
    site: import.meta.env.SITE,

    items: updates.map((u) => ({
      link: localizedHref('/updates/', lang) + `#${u.date}-${u.type}`,
      title: `[${t(lang, `updateType${u.type.charAt(0).toUpperCase()}${u.type.slice(1)}` as Parameters<typeof t>[1])}] ${u.title}`,
      description: u.summary,
      pubDate: new Date(u.date),
    })),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

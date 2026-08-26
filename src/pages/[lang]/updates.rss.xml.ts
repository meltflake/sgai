import type { APIRoute } from 'astro';
import { getRssString } from '@astrojs/rss';

import { SITE } from 'astrowind:config';
import { sortedUpdates } from '~/data/updates';
import { NON_DEFAULT_ROUTE_LOCALES, localizedHref, t, type Lang } from '~/i18n';
import { typeLabel, updateText } from '~/utils/update-type-ui';

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

    // One item per record, linking straight to the record's own page in
    // this locale. Titles / summaries resolve per lang (ja → en, ko → en,
    // zh-tw ← zh via OpenCC) instead of the zh field for every locale.
    items: updates.map((u) => {
      const title = updateText(u, 'title', lang);
      const summary = updateText(u, 'summary', lang);
      return {
        link: localizedHref(u.href ?? '/updates/', lang),
        title: `[${typeLabel(u.type, lang)}] ${title}`,
        description: summary || title,
        pubDate: new Date(u.date),
      };
    }),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

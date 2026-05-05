import { getRssString } from '@astrojs/rss';

import { SITE } from 'astrowind:config';
import { sortedUpdates } from '~/data/updates';
import { localizedHref, t } from '~/i18n';

const lang = 'en' as const;

export const GET = async () => {
  const updates = sortedUpdates();

  const rss = await getRssString({
    title: t(lang, 'updatesRssTitle'),
    description: t(lang, 'updatesRssDescription'),
    site: import.meta.env.SITE,

    items: updates.map((u) => ({
      link: localizedHref('/updates/', lang) + `#${u.date}-${u.type}`,
      title: `[${t(lang, `updateType${u.type.charAt(0).toUpperCase()}${u.type.slice(1)}` as Parameters<typeof t>[1])}] ${u.titleEn}`,
      description: u.summaryEn,
      pubDate: new Date(u.date),
    })),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

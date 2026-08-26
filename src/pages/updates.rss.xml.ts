import { getRssString } from '@astrojs/rss';

import { SITE } from 'astrowind:config';
import { sortedUpdates } from '~/data/updates';
import { localizedHref, t } from '~/i18n';
import { typeLabel, updateGuid, updateLinkPath, updateText } from '~/utils/update-type-ui';

const lang = 'en' as const;

export const GET = async () => {
  const updates = sortedUpdates();

  const rss = await getRssString({
    title: t(lang, 'updatesRssTitle'),
    description: t(lang, 'updatesRssDescription'),
    site: import.meta.env.SITE,

    // One item per record, linking straight to the record's own page.
    // Manual editorial entries (site / fix / longform) have no href and
    // fall back to the updates listing — hence the explicit guid: several
    // rows share a link, and readers dedupe on guid, not on title.
    items: updates.map((u) => {
      const title = updateText(u, 'title', lang);
      const summary = updateText(u, 'summary', lang);
      return {
        link: localizedHref(updateLinkPath(u), lang),
        title: `[${typeLabel(u.type, lang)}] ${title}`,
        description: summary || title,
        pubDate: new Date(u.date),
        customData: `<guid isPermaLink="false">${updateGuid(u)}</guid>`,
      };
    }),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

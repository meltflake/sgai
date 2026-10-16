// src/utils/signals-related.ts
// Resolve a signal's `related` references to an on-site href + localized
// label. Ids are validated by scripts/verify-graph.ts; an id that still
// fails to resolve here is skipped rather than rendered as a dead link.

import type { SignalRelated } from '~/data/signals';
import { categories as policyCategories } from '~/data/policies';
import { debates } from '~/data/debates';
import { videos } from '~/data/videos';
import { getPerson } from '~/utils/people';
import { ecosystemEntityPages, startupEntityPages } from '~/utils/entity-pages';
import { pickLocalized, type Lang } from '~/i18n';

// Singapore names render in Chinese only on zh / zh-tw pages; ja / ko / en
// use the Latin name, matching the debate participant list.
const PERSON_NAME_SCRIPT: Record<Lang, 'cjk' | 'latin'> = {
  zh: 'cjk',
  'zh-tw': 'cjk',
  en: 'latin',
  ja: 'latin',
  ko: 'latin',
};

export interface ResolvedRelated {
  href: string;
  label: string;
}

function label(record: unknown, key: string, lang: Lang): string {
  return pickLocalized<string>(record, key, lang) || '';
}

export function resolveRelated(r: SignalRelated, lang: Lang): ResolvedRelated | null {
  switch (r.kind) {
    case 'policy': {
      const p = policyCategories.flatMap((c) => c.policies).find((x) => x.id === r.id);
      return p ? { href: `/policies/${r.id}/`, label: label(p, 'title', lang) } : null;
    }
    case 'debate': {
      const d = debates.find((x) => x.id === r.id);
      return d ? { href: `/debates/${r.id}/`, label: label(d, 'title', lang) } : null;
    }
    case 'video': {
      const v = videos.find((x) => x.id === r.id);
      return v ? { href: `/videos/${r.id}/`, label: label(v, 'title', lang) } : null;
    }
    case 'person': {
      const p = getPerson(r.id);
      if (!p) return null;
      const name = PERSON_NAME_SCRIPT[lang] === 'cjk' ? label(p, 'name', lang) || p.nameEn : p.nameEn || p.name;
      return { href: `/voices/${r.id}/`, label: name };
    }
    case 'ecosystem': {
      const pg = ecosystemEntityPages.find((x) => x.slug === r.id);
      return pg ? { href: `/ecosystem/${r.id}/`, label: label(pg.entity, 'name', lang) } : null;
    }
    case 'startup': {
      const pg = startupEntityPages.find((x) => x.slug === r.id);
      return pg ? { href: `/startups/${r.id}/`, label: label(pg, 'name', lang) } : null;
    }
    default:
      return null;
  }
}

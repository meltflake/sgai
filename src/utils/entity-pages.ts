import slugify from 'limax';

import { regions, regionDetails, type RegionDetail, type RegionSummary } from '~/data/benchmarking';
import { sections as legalSections, type LegalItem, type LegalSection } from '~/data/legal-ai';
import { levers, type Lever, type LeverGroup, type LeverItem } from '~/data/levers';

export function toSeoSlug(value: string): string {
  const slug = slugify(value).replace(/^\/+|\/+$/g, '');
  return slug || 'item';
}

export function regionSlug(region: Pick<RegionSummary, 'name' | 'nameEn'>): string {
  return toSeoSlug(region.nameEn || region.name);
}

function sameRegion(a: Pick<RegionSummary, 'name' | 'nameEn'>, b: Pick<RegionDetail, 'name' | 'nameEn'>): boolean {
  return (a.nameEn || a.name).toLowerCase() === (b.nameEn || b.name).toLowerCase();
}

export interface RegionPage {
  slug: string;
  summary: RegionSummary;
  detail?: RegionDetail;
}

export const regionPages: RegionPage[] = regions.map((summary) => ({
  slug: regionSlug(summary),
  summary,
  detail: regionDetails.find((detail) => sameRegion(summary, detail)),
}));

export function leverSlug(lever: Pick<Lever, 'number' | 'name' | 'nameEn'>): string {
  return toSeoSlug(`lever ${lever.number} ${lever.nameEn || lever.name}`);
}

export function leverItemSlug(item: Pick<LeverItem, 'id' | 'name' | 'nameEn'>): string {
  return toSeoSlug(item.nameEn || item.id || item.name);
}

export type LeverPage =
  | {
      kind: 'lever';
      slug: string;
      lever: Lever;
    }
  | {
      kind: 'item';
      slug: string;
      lever: Lever;
      group: LeverGroup;
      item: LeverItem;
    };

export const leverPages: LeverPage[] = levers.flatMap((lever) => [
  { kind: 'lever' as const, slug: leverSlug(lever), lever },
  ...lever.groups.flatMap((group) =>
    group.items.map((item) => ({
      kind: 'item' as const,
      slug: leverItemSlug(item),
      lever,
      group,
      item,
    }))
  ),
]);

export function legalItemSlug(item: Pick<LegalItem, 'title' | 'titleEn'>): string {
  return toSeoSlug(item.titleEn || item.title);
}

export interface LegalItemPage {
  slug: string;
  section: LegalSection;
  sectionIndex: number;
  item: LegalItem;
}

export const legalItemPages: LegalItemPage[] = legalSections.flatMap((section, sectionIndex) =>
  section.items.map((item) => ({
    slug: legalItemSlug(item),
    section,
    sectionIndex,
    item,
  }))
);

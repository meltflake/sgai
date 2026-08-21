import { findIncompleteRecords, findUnpairedFields } from '../../lib/i18n-pair.ts';

export interface LeverRefreshItem {
  id: string;
  name: string;
  nameEn: string;
  nameJa?: string;
  nameKo?: string;
  ministry: string;
  ministryEn: string;
  ministryJa?: string;
  ministryKo?: string;
  description: string;
  descriptionEn: string;
  descriptionJa?: string;
  descriptionKo?: string;
  sourceUrl: string;
}

function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

export function formatLeverItem(item: LeverRefreshItem): string {
  const lines: string[] = [];
  lines.push('          {');
  lines.push(`            id: '${item.id}',`);
  lines.push(`            name: '${escapeQuote(item.name)}',`);
  lines.push(`            nameEn: '${escapeQuote(item.nameEn)}',`);
  if (item.nameJa) lines.push(`            nameJa: '${escapeQuote(item.nameJa)}',`);
  if (item.nameKo) lines.push(`            nameKo: '${escapeQuote(item.nameKo)}',`);
  lines.push(`            ministry: '${escapeQuote(item.ministry)}',`);
  lines.push(`            ministryEn: '${escapeQuote(item.ministryEn)}',`);
  if (item.ministryJa) lines.push(`            ministryJa: '${escapeQuote(item.ministryJa)}',`);
  if (item.ministryKo) lines.push(`            ministryKo: '${escapeQuote(item.ministryKo)}',`);
  lines.push(`            description: '${escapeQuote(item.description)}',`);
  lines.push(`            descriptionEn: '${escapeQuote(item.descriptionEn)}',`);
  if (item.descriptionJa) lines.push(`            descriptionJa: '${escapeQuote(item.descriptionJa)}',`);
  if (item.descriptionKo) lines.push(`            descriptionKo: '${escapeQuote(item.descriptionKo)}',`);
  lines.push(`            sourceUrl: '${item.sourceUrl}',`);
  lines.push('          },');
  return lines.join('\n');
}

/**
 * Inject new items into a special pending-review group inside lever 1.
 * The base `title` is Chinese because the data model's source locale is zh.
 */
export function injectIntoAutoDiscoveredGroup(lines: string[], formattedItems: string): string[] {
  let leverNumberLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*number:\s*1,/.test(lines[i])) {
      leverNumberLine = i;
      break;
    }
  }
  if (leverNumberLine === -1) throw new Error('lever number 1 not found');

  let groupsOpen = -1;
  for (let i = leverNumberLine; i < lines.length; i += 1) {
    if (/^\s*groups:\s*\[/.test(lines[i])) {
      groupsOpen = i;
      break;
    }
  }
  if (groupsOpen === -1) throw new Error('groups: [ for lever 1 not found');

  // Match both the localized base title and the stable English sibling so
  // reruns append to the existing group instead of creating duplicates.
  for (let i = groupsOpen; i < lines.length; i += 1) {
    const isPendingGroup =
      /title:\s*['"]自动发现（待审核）['"]/.test(lines[i]) ||
      /titleEn:\s*['"]Auto-discovered \(pending review\)['"]/.test(lines[i]);
    if (isPendingGroup) {
      let itemsOpen = -1;
      for (let j = i; j < Math.min(lines.length, i + 30); j += 1) {
        if (/^\s*items:\s*\[/.test(lines[j])) {
          itemsOpen = j;
          break;
        }
      }
      if (itemsOpen === -1) break;
      let depth = 0;
      for (let j = itemsOpen; j < lines.length; j += 1) {
        depth += (lines[j].match(/\[/g) || []).length;
        depth -= (lines[j].match(/\]/g) || []).length;
        if (depth === 0 && j > itemsOpen) {
          return [...lines.slice(0, j), formattedItems, ...lines.slice(j)];
        }
      }
    }
    if (/^\s*number:\s*2,/.test(lines[i])) break;
  }

  let depth = 0;
  let groupsClose = -1;
  for (let i = groupsOpen; i < lines.length; i += 1) {
    depth += (lines[i].match(/\[/g) || []).length;
    depth -= (lines[i].match(/\]/g) || []).length;
    if (depth === 0 && i > groupsOpen) {
      groupsClose = i;
      break;
    }
  }
  if (groupsClose === -1) throw new Error('groups close ] not found');

  const newGroup = [
    '      {',
    "        title: '自动发现（待审核）',",
    "        titleEn: 'Auto-discovered (pending review)',",
    "        titleJa: 'Auto-discovered（レビュー待ち）',",
    "        titleKo: '자동 발견됨(검토 대기)',",
    '        items: [',
    formattedItems,
    '        ],',
    '      },',
  ].join('\n');
  return [...lines.slice(0, groupsClose), ...newGroup.split('\n'), ...lines.slice(groupsClose)];
}

/** Run the same alignment + schema completeness checks as CI. */
export function findLeverI18nIssues(filePath: string) {
  return {
    alignment: findUnpairedFields(filePath, {
      locales: ['en', 'ja', 'ko'],
      enOnlyBase: true,
    }),
    completeness: findIncompleteRecords(filePath),
  };
}

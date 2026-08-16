import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  findLeverI18nIssues,
  formatLeverItem,
  injectIntoAutoDiscoveredGroup,
  type LeverRefreshItem,
} from '../../refresh/levers/emit.ts';

const ITEM: LeverRefreshItem = {
  id: 'test-programme',
  name: '测试项目',
  nameEn: 'Test programme',
  nameJa: 'テスト事業',
  nameKo: '테스트 프로그램',
  ministry: '测试机构',
  ministryEn: 'Test agency',
  ministryJa: 'テスト機関',
  ministryKo: '테스트 기관',
  description: '用于验证自动发现分组。',
  descriptionEn: 'Used to verify the auto-discovered group.',
  descriptionJa: '自動検出グループの検証に使用します。',
  descriptionKo: '자동 발견 그룹을 검증하는 데 사용합니다.',
  sourceUrl: 'https://example.gov.sg/test-programme',
};

const LEVERS_FIXTURE = `export const levers = [
  {
    number: 1,
    name: '基础设施',
    nameEn: 'Infrastructure',
    nameJa: 'インフラ',
    nameKo: '인프라',
    subtitle: '基础设施说明',
    subtitleEn: 'Infrastructure subtitle',
    subtitleJa: 'インフラの説明',
    subtitleKo: '인프라 설명',
    whatStateDoes: '国家建设基础设施',
    whatStateDoesEn: 'The state builds infrastructure',
    whatStateDoesJa: '国家がインフラを構築する',
    whatStateDoesKo: '국가가 인프라를 구축합니다',
    bottleneckSolved: '解决基础设施瓶颈',
    bottleneckSolvedEn: 'Solves the infrastructure bottleneck',
    bottleneckSolvedJa: 'インフラのボトルネックを解消する',
    bottleneckSolvedKo: '인프라 병목을 해결합니다',
    groups: [
    ],
  },
];
`;

function withFixture(content: string, fn: (path: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'sgai-levers-emit-'));
  const dataDir = join(root, 'src/data');
  mkdirSync(dataDir, { recursive: true });
  const path = join(dataDir, 'levers.ts');
  try {
    writeFileSync(path, content);
    fn(path);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

test('levers emit creates a zh-base pending group with complete en/ja/ko siblings', () => {
  const emitted = injectIntoAutoDiscoveredGroup(LEVERS_FIXTURE.split('\n'), formatLeverItem(ITEM)).join('\n');

  assert.match(emitted, /title: '自动发现（待审核）'/);
  assert.match(emitted, /titleEn: 'Auto-discovered \(pending review\)'/);
  assert.match(emitted, /titleJa: 'Auto-discovered（レビュー待ち）'/);
  assert.match(emitted, /titleKo: '자동 발견됨\(검토 대기\)'/);

  withFixture(emitted, (path) => {
    const issues = findLeverI18nIssues(path);
    assert.deepEqual(issues, { alignment: [], completeness: [] });
  });
});

test('levers emit appends to the localized pending group instead of creating a duplicate', () => {
  const first = injectIntoAutoDiscoveredGroup(LEVERS_FIXTURE.split('\n'), formatLeverItem(ITEM));
  const secondItem = { ...ITEM, id: 'second-programme', sourceUrl: 'https://example.gov.sg/second-programme' };
  const second = injectIntoAutoDiscoveredGroup(first, formatLeverItem(secondItem)).join('\n');

  assert.equal(count(second, "titleEn: 'Auto-discovered (pending review)'"), 1);
  assert.equal(count(second, "id: 'test-programme'"), 1);
  assert.equal(count(second, "id: 'second-programme'"), 1);
});

test('levers validator catches the legacy English-base group without titleKo', () => {
  const legacy = injectIntoAutoDiscoveredGroup(LEVERS_FIXTURE.split('\n'), formatLeverItem(ITEM))
    .join('\n')
    .replace("title: '自动发现（待审核）'", "title: 'Auto-discovered (pending review)'")
    .replace("        titleKo: '자동 발견됨(검토 대기)',\n", '');

  withFixture(legacy, (path) => {
    const issues = findLeverI18nIssues(path);
    assert.equal(issues.alignment.length, 1);
    assert.equal(issues.alignment[0].reason, 'en-only-base');
    assert.equal(issues.completeness.length, 1);
    assert.deepEqual(issues.completeness[0].missingFields, ['titleKo']);
  });
});

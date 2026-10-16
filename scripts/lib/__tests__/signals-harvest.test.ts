// scripts/lib/__tests__/signals-harvest.test.ts
// harvestSignals: one feed entry per signal with addedAt; links stay on site.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { harvestSignals } from '../../../src/utils/derived-updates.ts';
import type { Signal } from '../../../src/data/signals.ts';

const base: Signal = {
  id: 'sig-20261016-test',
  date: '2026-10-15',
  title: '中文标题',
  titleEn: 'English title',
  titleJa: '日本語タイトル',
  titleKo: '한국어 제목',
  whyItMatters: '为什么重要',
  whyItMattersEn: 'Why it matters',
  whyItMattersJa: 'なぜ重要か',
  whyItMattersKo: '왜 중요한가',
  sourceUrl: 'https://www.mddi.gov.sg/newsroom/x/',
  sourceName: 'MDDI',
  topicIds: ['national-strategy'],
  addedAt: '2026-10-16',
};

test('harvestSignals: maps a signal to a signal-type entry linking to the list anchor', () => {
  const [h] = harvestSignals([base]);
  assert.equal(h.type, 'signal');
  assert.equal(h.source, 'signal');
  assert.equal(h.id, base.id);
  assert.equal(h.addedAt, '2026-10-16');
  assert.equal(h.eventDate, '2026-10-15');
  assert.deepEqual([h.zhTitle, h.enTitle, h.jaTitle, h.koTitle], ['中文标题', 'English title', '日本語タイトル', '한국어 제목']);
  assert.deepEqual([h.zhSummary, h.enSummary, h.jaSummary, h.koSummary], ['为什么重要', 'Why it matters', 'なぜ重要か', '왜 중요한가']);
  assert.equal(h.href, '/signals/#sig-20261016-test');
});

test('harvestSignals: skips a record without addedAt', () => {
  const rec = { ...base, addedAt: '' };
  assert.deepEqual(harvestSignals([rec]), []);
});

// Unit tests for the monthly digest post builder. The point of extracting
// buildMonthlyPost() out of generate-monthly.ts is exactly this: assert the
// rendered Markdown against a fake Update[] without importing src/data.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildMonthlyPost, renderPostFile, sectionOf, type MonthlyPostOptions } from '../build-monthly-post.ts';
import type { Update, UpdateType } from '../../../../src/data/updates';

const OPTS: MonthlyPostOptions = {
  month: '2026-08',
  publishDate: '2026-09-01',
  topicIds: ['governance-safety', 'national-strategy'],
};

function u(over: Partial<Update> & { type: UpdateType }): Update {
  return {
    date: '2026-08-10',
    title: '标题',
    titleEn: 'Title',
    summary: '摘要',
    summaryEn: 'Summary',
    href: '/policies/x/',
    ...over,
  } as Update;
}

test('stats line: counts every present type, in policy→debate→video→speech→people→other order', () => {
  const updates: Update[] = [
    u({ type: 'people', title: '人物 A', href: '/voices/a/' }),
    u({ type: 'debate', title: '辩论 A', href: '/debates/a/' }),
    u({ type: 'debate', title: '辩论 B', href: '/debates/b/' }),
    u({ type: 'video', title: '视频 A', href: '/videos/a/' }),
    u({ type: 'policy', title: '政策 A' }),
    u({ type: 'policy', title: '政策 B' }),
    u({ type: 'policy', title: '政策 C' }),
    u({ type: 'speech', title: '演讲 A', href: '/speeches/a/' }),
    u({ type: 'ecosystem', title: '生态 A', href: '/ecosystem/a/' }),
    u({ type: 'lever', title: '抓手 A', href: '/levers/1/' }),
  ];
  const { body, frontmatter } = buildMonthlyPost(updates, OPTS);
  const statsLine = body.split('\n')[0];

  assert.match(
    statsLine,
    /^本月站内更新 10 条：3 政策 · 2 辩论 · 1 视频 · 1 演讲 · 1 人物 · 2 其他 · 阅读约 \d+ 分钟$/
  );
  // The excerpt is the stats line verbatim (well under the 160-char cap).
  assert.equal(frontmatter.excerpt, statsLine);

  // Section headings follow the same order, and only present types appear.
  const headings = body.split('\n').filter((l) => l.startsWith('## '));
  assert.deepEqual(headings, ['## 本月主线', '## 政策', '## 辩论', '## 视频', '## 演讲', '## 人物', '## 其他']);
});

test('stats line: omits absent types and always carries a reading estimate ≥ 1 minute', () => {
  const { body } = buildMonthlyPost([u({ type: 'video', href: '/videos/a/' })], OPTS);
  const statsLine = body.split('\n')[0];
  assert.equal(statsLine, '本月站内更新 1 条：1 视频 · 阅读约 1 分钟');
  assert.ok(!statsLine.includes('政策'));
});

test('empty topicIds falls back to national-strategy (verify-graph coverage gate)', () => {
  const { frontmatter } = buildMonthlyPost([], { ...OPTS, topicIds: [] });
  assert.deepEqual(frontmatter.topicIds, ['national-strategy']);

  // …and a non-empty list is de-duplicated and sorted.
  const withDupes = buildMonthlyPost([], { ...OPTS, topicIds: ['national-strategy', 'compute', 'compute'] });
  assert.deepEqual(withDupes.frontmatter.topicIds, ['compute', 'national-strategy']);
});

test('a manual update without href renders unlinked', () => {
  const { body } = buildMonthlyPost(
    [
      u({ type: 'longform', title: '长文：某某', href: undefined, summary: '一句话判断' }),
      u({ type: 'policy', title: '政策 A', href: '/policies/a/', summary: '' }),
    ],
    OPTS
  );
  assert.ok(body.includes('- 长文：某某（2026-08-10）— 一句话判断'));
  assert.ok(!body.includes('](undefined)'));
  // Linked item keeps the Markdown link; an empty summary drops the dash.
  assert.ok(body.includes('- [政策 A](/policies/a/)（2026-08-10）\n'));
});

test('eventDate is shown when it differs from addedAt, otherwise addedAt', () => {
  const { body } = buildMonthlyPost(
    [
      u({ type: 'debate', title: '辩论 A', href: '/debates/a/', date: '2026-08-10', eventDate: '2026-07-08' }),
      u({ type: 'video', title: '视频 A', href: '/videos/a/', date: '2026-08-11', eventDate: '2026-08-11' }),
      u({ type: 'policy', title: '政策 A', href: '/policies/a/', date: '2026-08-12', eventDate: '2026-05' }),
      u({ type: 'people', title: '人物 A', href: '/voices/a/', date: '2026-08-13' }),
    ],
    OPTS
  );
  assert.ok(body.includes('- [辩论 A](/debates/a/)（2026-07-08）— 摘要'));
  assert.ok(body.includes('- [视频 A](/videos/a/)（2026-08-11）— 摘要'));
  // Month-precision event dates go through formatEventDate(…, 'zh').
  assert.ok(body.includes('- [政策 A](/policies/a/)（2026 年 5 月）— 摘要'));
  // No eventDate at all → the addedAt date.
  assert.ok(body.includes('- [人物 A](/voices/a/)（2026-08-13）— 摘要'));
});

test('sectionOf buckets unknown types into 其他', () => {
  assert.equal(sectionOf('policy'), 'policy');
  assert.equal(sectionOf('speech'), 'speech');
  assert.equal(sectionOf('benchmark'), 'other');
  assert.equal(sectionOf('site'), 'other');
});

test('renderPostFile emits a one-line topicIds array and the fixed frontmatter shape', () => {
  const post = buildMonthlyPost([u({ type: 'policy' })], OPTS);
  const file = renderPostFile(post);
  assert.ok(file.startsWith('---\n'));
  assert.match(file, /^publishDate: 2026-09-01$/m);
  assert.match(file, /^title: 'sgai 月报 · 2026 年 8 月'$/m);
  assert.match(file, /^category: '月报'$/m);
  assert.match(file, /^tags: \['月报'\]$/m);
  assert.match(file, /^author: '新加坡 AI 观察'$/m);
  // verify-graph.ts matches /^topicIds: \[(.*)\]$/m — must stay inline.
  assert.match(file, /^topicIds: \['governance-safety', 'national-strategy'\]$/m);
  assert.ok(file.trimEnd().endsWith('— 新加坡 AI 观察 · sgai.md'));
});

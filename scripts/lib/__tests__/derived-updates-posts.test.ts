// scripts/lib/__tests__/derived-updates-posts.test.ts
// ────────────────────────────────────────────────────────────────────────
// harvestPosts() turns src/data/post/<slug>.md (+ en/ja/ko siblings) into
// feed rows, so publishing a longform piece no longer needs a hand-written
// `longform` entry in src/data/updates.ts. Fixtures live in a temp dir so
// the test does not depend on the real posts.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { harvestPosts } from '../../../src/utils/derived-updates';

function fixture(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-posts-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), body, 'utf8');
  }
  return dir;
}

const zh = (extra = '') => `---
publishDate: 2026-09-05
title: '中文标题'
excerpt: '中文摘要'
category: '观察'
${extra}---

正文。
`;

test('a zh post with en/ja/ko siblings becomes one longform row with strict per-lang text', () => {
  const dir = fixture({
    'law.md': zh(),
    'en/law.md': `---\npublishDate: 2026-09-05\ntitle: English title\nexcerpt: English excerpt\nlang: en\n---\n\nBody.\n`,
    'ja/law.md': `---\npublishDate: 2026-09-05\ntitle: 日本語タイトル\nexcerpt: 日本語の要約\nlang: ja\n---\n\n本文。\n`,
    'ko/law.md': `---\npublishDate: 2026-09-05\ntitle: 한국어 제목\nexcerpt: 한국어 요약\nlang: ko\n---\n\n본문.\n`,
    'zh-tw/law.md': `---\nlang: 'zh-tw'\npublishDate: 2026-09-05\ntitle: '中文標題'\n---\n\n正文。\n`,
  });
  try {
    const rows = harvestPosts(dir);
    assert.equal(rows.length, 1);
    const r = rows[0];
    assert.equal(r.type, 'longform');
    assert.equal(r.source, 'post');
    assert.equal(r.id, 'law');
    assert.equal(r.addedAt, '2026-09-05');
    assert.equal(r.eventDate, undefined);
    assert.equal(r.href, '/law/');
    assert.equal(r.zhTitle, '中文标题');
    assert.equal(r.enTitle, 'English title');
    assert.equal(r.jaTitle, '日本語タイトル');
    assert.equal(r.koTitle, '한국어 제목');
    assert.equal(r.zhSummary, '中文摘要');
    assert.equal(r.enSummary, 'English excerpt');
    assert.equal(r.jaSummary, '日本語の要約');
    assert.equal(r.koSummary, '한국어 요약');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('missing siblings: title falls back (zh → en chain), summary stays empty for that lang', () => {
  const dir = fixture({
    'solo.md': zh(),
    'en/solo.md': `---\npublishDate: 2026-09-05\ntitle: English title\nexcerpt: English excerpt\nlang: en\n---\n\nBody.\n`,
  });
  try {
    const [r] = harvestPosts(dir);
    assert.equal(r.jaTitle, 'English title');
    assert.equal(r.koTitle, 'English title');
    assert.equal(r.jaSummary, undefined);
    assert.equal(r.koSummary, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('drafts and posts without publishDate are skipped; publishDate accepts date and string forms', () => {
  const dir = fixture({
    'draft.md': zh('draft: true\n'),
    'undated.md': `---\ntitle: '无日期'\n---\n\n正文。\n`,
    'string-date.md': `---\npublishDate: '2026-08-14'\ntitle: '字符串日期'\n---\n\n正文。\n`,
    'ts-date.md': `---\npublishDate: 2026-08-07T00:00:00.000Z\ntitle: '时间戳日期'\n---\n\n正文。\n`,
  });
  try {
    const rows = harvestPosts(dir);
    assert.deepEqual(
      rows.map((r) => [r.id, r.addedAt]).sort(),
      [
        ['string-date', '2026-08-14'],
        ['ts-date', '2026-08-07'],
      ]
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('only top-level zh files are harvested; sibling directories are not posts themselves', () => {
  const dir = fixture({
    'a.md': zh(),
    'en/a.md': `---\npublishDate: 2026-09-05\ntitle: A\nlang: en\n---\n\nBody.\n`,
    'en/orphan.md': `---\npublishDate: 2026-09-05\ntitle: Orphan\nlang: en\n---\n\nBody.\n`,
  });
  try {
    assert.deepEqual(
      harvestPosts(dir).map((r) => r.id),
      ['a']
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

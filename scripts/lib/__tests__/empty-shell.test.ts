// scripts/lib/__tests__/empty-shell.test.ts
//
// isEmptyShellSummary guards govFetch + summarizePage pipelines against
// client-rendered pages where govFetch only captured the nav shell and the
// summariser faithfully described the emptiness. See gov-fetch.ts header:
// JS-rendered pages return navigation-only HTML to a plain HTTP fetch.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isEmptyShellSummary } from '../empty-shell.ts';

test('flags a zh description that says page content could not be retrieved', () => {
  assert.equal(
    isEmptyShellSummary({
      description: '页面内容无法获取，仅能看到导航元素，无法生成有效摘要。',
      descriptionEn: 'Summary based on available navigation.',
    }),
    true
  );
});

test('flags an en description describing an unretrievable page', () => {
  assert.equal(
    isEmptyShellSummary({
      description: '该项目的具体内容。',
      descriptionEn: 'The page content could not be retrieved; only navigation links are present.',
    }),
    true
  );
});

test('flags a "navigation elements only" shell in either language', () => {
  assert.equal(isEmptyShellSummary({ description: '该页面仅包含导航元素。' }), true);
  assert.equal(isEmptyShellSummary({ descriptionEn: 'This page only contains navigation.' }), true);
});

test('flags a "未能加载 / failed to load" shell', () => {
  assert.equal(isEmptyShellSummary({ description: '内容未能加载。' }), true);
  assert.equal(isEmptyShellSummary({ descriptionEn: 'The content failed to load.' }), true);
});

test('flags a JS "loading state" placeholder', () => {
  assert.equal(isEmptyShellSummary({ descriptionEn: 'The page appears to be in a loading state.' }), true);
});

test('flags markers hidden in a title field, case-insensitively', () => {
  assert.equal(isEmptyShellSummary({ title: '页面内容无法加载', description: '某些文字' }), true);
  assert.equal(isEmptyShellSummary({ titleEn: 'Page Content Could Not Be Retrieved' }), true);
});

test('does NOT flag a legitimate bilingual programme summary', () => {
  assert.equal(
    isEmptyShellSummary({
      title: '全国多模态大模型计划',
      titleEn: 'National Multimodal LLM Programme',
      description: 'IMDA 与新加坡国立大学等机构合作，开发支持东南亚语言的多模态大模型，强化本地 AI 能力。',
      descriptionEn:
        'IMDA partners with NUS and others to build a multimodal LLM supporting Southeast Asian languages, strengthening local AI capability.',
    }),
    false
  );
});

test('does NOT flag content that merely mentions navigating or loading as a topic', () => {
  // "navigation" / "loading" appear as real subject matter, not shell markers.
  assert.equal(
    isEmptyShellSummary({
      descriptionEn: 'The grant helps logistics firms load cargo faster and navigate customs digitally.',
    }),
    false
  );
});

test('returns false for empty / undefined fields (no markers present)', () => {
  assert.equal(isEmptyShellSummary({}), false);
  assert.equal(isEmptyShellSummary({ description: '', descriptionEn: undefined }), false);
});

// scripts/lib/why-it-matters.ts
// ────────────────────────────────────────────────────────────────────────
// Draft the one-line `whyItMatters` judgment for a record: why this policy
// / debate / video matters for Singapore's AI strategy — one sentence, in
// Chinese, carrying a concrete number, date or institution, and NOT a
// restatement of the summary. The summary says what happened; this says
// why a reader should care.
//
// Shared by scripts/backfill-why-it-matters.ts (bulk backfill) and the
// videos / policies emit pipelines (per-record on ingest). Translations to
// en / ja / ko go through scripts/lib/translate.ts, not here.
//
// Cache: <cacheDir>/<sha256(kind + id + inputs)>.json — re-runs are free,
// and a changed summary invalidates the draft.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { callLlmJson } from './llm.ts';

export type WhyKind = 'policy' | 'debate' | 'video';

export interface WhyInput {
  kind: WhyKind;
  id: string;
  title: string;
  date?: string;
  /** Ministry / agency (policies) or speakers (debates / videos). */
  actors?: string;
  summary: string;
  /** Key points, content excerpt, transcript digest — clipped by the caller. */
  detail?: string;
  sourceUrl?: string;
}

export interface WhyOptions {
  cacheDir: string;
  model?: string;
  force?: boolean;
  timeoutMs?: number;
}

export interface WhyDraft {
  whyItMatters: string;
  model: string;
  generatedAt: string;
}

const KIND_ZH: Record<WhyKind, string> = {
  policy: '政策文件',
  debate: '国会辩论',
  video: '视频',
};

const SYSTEM_PROMPT = `你是「新加坡 AI 观察」（sgai.md）的编辑，读者是关注新加坡 AI 战略的创业者、政策研究者和记者。
你的任务：为一条记录写一句「为什么重要」——它对新加坡 AI 战略的意义是什么。

硬规则：
1. 只写一句话，简体中文，不超过 60 个汉字，不加引号、不加句号以外的标点收尾。
2. 必须包含至少一个具体锚点：数字（金额、人数、百分比）、日期或时限、或机构 / 法案 / 项目的名字。
3. 不要复述摘要说了什么。摘要回答「发生了什么」，你回答「这意味着什么 / 改变了什么 / 暴露了什么」。
4. 有判断，别和稀泥：指出方向、缺口、转折或先例。不确定的事实不要编。
5. 机构名用摘要里已有的写法；人名照抄，不要音译。
6. 中文与英文 / 数字之间留一个空格（写「NAIC 定调」「10000 家 SME」，不写「NAIC定调」）。

输出 JSON：{"whyItMatters": "……"}，不要输出其他内容。`;

/** Bump when SYSTEM_PROMPT changes so cached drafts are regenerated. */
const PROMPT_VERSION = 2;

function userPrompt(input: WhyInput): string {
  const lines = [
    `记录类型：${KIND_ZH[input.kind]}`,
    `标题：${input.title}`,
    input.date ? `日期：${input.date}` : '',
    input.actors ? `相关方：${input.actors}` : '',
    `摘要：${input.summary}`,
    input.detail ? `补充材料：${input.detail}` : '',
    input.sourceUrl ? `来源：${input.sourceUrl}` : '',
    '',
    '请写这一条的「为什么重要」。',
  ];
  return lines.filter(Boolean).join('\n');
}

function cacheKey(input: WhyInput, model: string): string {
  return createHash('sha256')
    .update(
      JSON.stringify([
        PROMPT_VERSION,
        input.kind,
        input.id,
        input.title,
        input.date,
        input.actors,
        input.summary,
        input.detail,
        model,
      ])
    )
    .digest('hex');
}

/** Basic shape check on the model output. Returns a reason string when rejected. */
export function validateWhy(text: string): string | null {
  const t = text.trim();
  if (!t) return 'empty';
  const hanCount = (t.match(/[一-鿿]/g) ?? []).length;
  if (hanCount < 8) return 'too short / not Chinese';
  if (hanCount > 80) return `too long (${hanCount} han chars)`;
  if (/\n/.test(t)) return 'multi-line';
  const hasAnchor = /\d/.test(t) || /[A-Z]{2,}|[A-Z][a-z]+ [A-Z]/.test(t) || /部|局|署|会|法|计划|框架|理事会|委员会|大学|研究院|公司/.test(t);
  if (!hasAnchor) return 'no concrete anchor (number / date / institution)';
  return null;
}

/**
 * Draft (or read from cache) the zh `whyItMatters` for one record. Throws
 * if the model fails validation twice — callers should catch, log and skip.
 */
export async function draftWhyItMatters(input: WhyInput, options: WhyOptions): Promise<WhyDraft> {
  const model = options.model ?? process.env.SGAI_WHY_MODEL ?? 'sonnet';
  mkdirSync(options.cacheDir, { recursive: true });
  const cachePath = join(options.cacheDir, `${cacheKey(input, model)}.json`);
  if (!options.force && existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, 'utf8')) as WhyDraft;
  }

  let lastReason = '';
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const prompt = attempt === 1 ? userPrompt(input) : `${userPrompt(input)}\n\n上一次输出不合格（${lastReason}），请严格按硬规则重写。`;
    const out = await callLlmJson<{ whyItMatters?: string }>(prompt, {
      systemPrompt: SYSTEM_PROMPT,
      model,
      timeoutMs: options.timeoutMs,
    });
    const text = (out.whyItMatters ?? '').trim().replace(/[。.]$/, '');
    const reason = validateWhy(text);
    if (!reason) {
      const draft: WhyDraft = { whyItMatters: text, model, generatedAt: new Date().toISOString() };
      writeFileSync(cachePath, JSON.stringify(draft, null, 2) + '\n');
      return draft;
    }
    lastReason = reason;
  }
  throw new Error(`whyItMatters draft rejected twice for ${input.kind}/${input.id}: ${lastReason}`);
}

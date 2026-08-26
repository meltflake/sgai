// scripts/refresh/newsletter/generate-monthly.ts
// ────────────────────────────────────────────────────────────────────────
// Monthly newsletter digest generator (P1-4). Semi-automatic by design:
// the machine part assembles every site update for the month from
// deriveUpdates() (the same derived feed the homepage uses); the editorial
// part — the "站方判断" paragraph — is written by hand in the output before
// sending. No network, no external account needed to generate.
//
// Two outputs from the same data:
//   1. stdout markdown — the email body, pasted into Buttondown.
//   2. --emit-post — a real zh blog post under src/data/post/, so the
//      month's roundup gets a permanent URL, SEO, and an llms.txt entry.
//      Body assembly lives in ./build-monthly-post.ts (pure, unit-tested).
//
// USAGE:
//   npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08
//   npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08 --lang=en
//   npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08 --emit-post
//   ... --emit-post --out=/tmp/monthly-2026-08.md --publish-date=2026-09-01 --topics=national-strategy,governance
//
// The generated post is zh only; the four translations are a separate
// manual step (see docs/refresh-playbook.md → 月报（Newsletter）).

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { deriveUpdates } from '../../../src/utils/derived-updates';
import { sortedUpdates, type Update } from '../../../src/data/updates';
import { videos } from '../../../src/data/videos';
import { debates } from '../../../src/data/debates';
import { categories as policyCategories } from '../../../src/data/policies';
import { videoTopicIds, debateTopicIds, policyTopicIds } from '../../../src/data/topic-mappings';
import { buildMonthlyPost, renderPostFile } from './build-monthly-post';

interface Args {
  month: string;
  lang: 'zh' | 'en';
  emitPost: boolean;
  out?: string;
  publishDate?: string;
  topics?: string[];
}

const USAGE =
  'Usage: generate-monthly.ts --month=YYYY-MM [--lang=zh|en] ' +
  '[--emit-post [--out=<path>] [--publish-date=YYYY-MM-DD] [--topics=a,b]]\n';

function parseArgs(argv: string[]): Args {
  let month = '';
  let lang: 'zh' | 'en' = 'zh';
  let emitPost = false;
  let out: string | undefined;
  let publishDate: string | undefined;
  let topics: string[] | undefined;
  for (const a of argv) {
    if (a.startsWith('--month=')) month = a.slice('--month='.length);
    else if (a.startsWith('--lang=')) {
      const l = a.slice('--lang='.length);
      if (l !== 'zh' && l !== 'en') throw new Error(`--lang must be zh|en, got ${l}`);
      lang = l;
    } else if (a === '--emit-post') emitPost = true;
    else if (a.startsWith('--out=')) out = a.slice('--out='.length);
    else if (a.startsWith('--publish-date=')) {
      publishDate = a.slice('--publish-date='.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) throw new Error('--publish-date=YYYY-MM-DD required');
    } else if (a.startsWith('--topics=')) {
      topics = a
        .slice('--topics='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (a === '--help') {
      process.stdout.write(USAGE);
      process.exit(0);
    }
  }
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error('--month=YYYY-MM required');
  return { month, lang, emitPost, out, publishDate, topics };
}

function pick(u: Update, lang: 'zh' | 'en'): string {
  if (lang === 'en') return u.titleEn || u.title;
  return u.title;
}

function groupLabel(u: Update, lang: 'zh' | 'en'): string {
  const labels: Record<string, [string, string]> = {
    policy: ['政策', 'Policy'],
    debate: ['辩论', 'Debate'],
    video: ['视频', 'Video'],
    startup: ['创业', 'Startup'],
    people: ['人物', 'People'],
    speech: ['演讲', 'Speech'],
    tracker: ['追踪', 'Tracker'],
    benchmark: ['对标', 'Benchmark'],
    ecosystem: ['生态', 'Ecosystem'],
    lever: ['抓手', 'Lever'],
    longform: ['长文', 'Longform'],
    site: ['站点', 'Site'],
    fix: ['修复', 'Fix'],
  };
  const pair = labels[u.type] ?? [u.type, u.type];
  return lang === 'en' ? pair[1] : pair[0];
}

/** First day of the month AFTER `month` ('2026-08' → '2026-09-01'). */
function firstDayOfNextMonth(month: string): string {
  const [y, m] = month.split('-').map((s) => parseInt(s, 10));
  const y2 = m === 12 ? y + 1 : y;
  const m2 = m === 12 ? 1 : m + 1;
  return `${y2}-${String(m2).padStart(2, '0')}-01`;
}

/**
 * Topic ids of the month's records. Only policy / debate / video records
 * are resolvable — the other sources have no topic mapping, and a post
 * that claims a topic it does not cover is worse than a narrower one.
 */
function resolveTopicIds(updates: Update[]): string[] {
  const out = new Set<string>();
  for (const u of updates) {
    if (!u.id) continue;
    if (u.source === 'video') {
      const v = videos.find((r) => r.id === u.id);
      if (v) videoTopicIds(v).forEach((id) => out.add(id));
    } else if (u.source === 'debate') {
      const d = debates.find((r) => r.id === u.id);
      if (d) debateTopicIds(d).forEach((id) => out.add(id));
    } else if (u.source === 'policy') {
      for (const cat of policyCategories) {
        const p = (cat.policies ?? []).find((r) => r.id === u.id);
        if (p) policyTopicIds(p, cat.name).forEach((id) => out.add(id));
      }
    }
  }
  return [...out].sort();
}

function emailBody(updates: Update[], month: string, lang: 'zh' | 'en'): string {
  const zhTitle = `新加坡 AI 观察 · ${month} 月报`;
  const subject = lang === 'en' ? `Singapore AI Observatory — ${month} monthly` : zhTitle;
  const lines: string[] = [];
  if (lang === 'zh') {
    lines.push(`# ${zhTitle}`, '');
    lines.push(`本月站内更新 ${updates.length} 条。`, '');
  } else {
    lines.push(`# Singapore AI Observatory — ${month}`, '');
    lines.push(`${updates.length} updates this month.`, '');
  }

  for (const u of updates) {
    lines.push(`- [${groupLabel(u, lang)}] ${pick(u, lang)}（${u.date}）`);
  }
  lines.push('');

  if (lang === 'zh') {
    lines.push('## 站方判断', '');
    lines.push('（手写一段：本月最值得注意的一件事，两三句。发信前替换本行。）', '');
    lines.push('— 新加坡 AI 观察 · sgai.md');
  } else {
    lines.push('## Our take', '');
    lines.push('(Write one paragraph: the single development that mattered most this month. Replace this line before sending.)', '');
    lines.push('— Singapore AI Observatory · sgai.md');
  }

  return `SUBJECT: ${subject}\n\n${lines.join('\n')}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.emitPost) {
    // Email body: unchanged since before --emit-post existed, deliberately
    // still on deriveUpdates() so the stdout output stays byte-identical.
    const derived = deriveUpdates()
      .filter((u) => u.date.startsWith(args.month))
      .sort((a, b) => b.date.localeCompare(a.date));
    process.stdout.write(emailBody(derived, args.month, args.lang));
    return;
  }

  // The POST is the month's public record, so it must include the manual
  // editorial entries (site / fix / longform) that live in MANUAL_UPDATES
  // and only ever merge in at sortedUpdates() — deriveUpdates() alone drops
  // every longform piece published that month.
  const updates = sortedUpdates().filter((u) => u.date.startsWith(args.month));

  const post = buildMonthlyPost(updates, {
    month: args.month,
    publishDate: args.publishDate ?? firstDayOfNextMonth(args.month),
    topicIds: args.topics ?? resolveTopicIds(updates),
  });
  const outPath = args.out ?? `src/data/post/monthly-${args.month}.md`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, renderPostFile(post), 'utf8');
  process.stdout.write(`wrote ${outPath} (${updates.length} updates)\n`);
}

main();

// scripts/refresh/newsletter/generate-monthly.ts
// ────────────────────────────────────────────────────────────────────────
// Monthly newsletter digest generator (P1-4). Semi-automatic by design:
// the machine part assembles every site update for the month from
// deriveUpdates() (the same derived feed the homepage uses); the editorial
// part — the "站方判断" paragraph — is written by hand in the output before
// sending. No network, no external account needed to generate.
//
// USAGE:
//   npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08
//   npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08 --lang=en
//
// Output: markdown to stdout, ready to paste into Buttondown or any
// newsletter tool. The subject line prints first (prefixed with "SUBJECT:").

import { deriveUpdates } from '../../../src/utils/derived-updates';
import type { Update } from '../../../src/data/updates';

function parseArgs(argv: string[]): { month: string; lang: 'zh' | 'en' } {
  let month = '';
  let lang: 'zh' | 'en' = 'zh';
  for (const a of argv) {
    if (a.startsWith('--month=')) month = a.slice('--month='.length);
    else if (a.startsWith('--lang=')) {
      const l = a.slice('--lang='.length);
      if (l !== 'zh' && l !== 'en') throw new Error(`--lang must be zh|en, got ${l}`);
      lang = l;
    } else if (a === '--help') {
      process.stdout.write('Usage: generate-monthly.ts --month=YYYY-MM [--lang=zh|en]\n');
      process.exit(0);
    }
  }
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error('--month=YYYY-MM required');
  return { month, lang };
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

function main() {
  const { month, lang } = parseArgs(process.argv.slice(2));
  const updates = deriveUpdates().filter((u) => u.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date));

  const zhTitle = `新加坡 AI 观察 · ${month} 月报`;
  const subject = lang === 'en' ? `Singapore AI Observatory — ${month} monthly` : zhTitle;
  process.stdout.write(`SUBJECT: ${subject}\n\n`);

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

  process.stdout.write(lines.join('\n'));
}

main();

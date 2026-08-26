// scripts/refresh/newsletter/build-monthly-post.ts
// ────────────────────────────────────────────────────────────────────────
// Pure body builder for the monthly digest BLOG POST (as opposed to the
// email body, which generate-monthly.ts still prints to stdout).
//
// Why a separate module: the digest used to exist only as Markdown pasted
// into Buttondown — no URL, no SEO, nothing in llms.txt. Turning it into a
// real post under src/data/post/ means the month's roundup gets a
// permanent, crawlable, translatable page. The assembly logic lives here,
// free of any `src/data/*` import, so it can be unit-tested against a fake
// Update[] without loading the whole content graph.
//
// Everything here is zh-only by design: the four translations are produced
// afterwards by scripts/refresh/post-translations/translate-post.ts (en /
// ja / ko) and scripts/hansard/derive-zh-tw-posts.ts (zh-tw). See
// docs/refresh-playbook.md → 月报（Newsletter）.

import type { Update, UpdateType } from '../../../src/data/updates';
import { formatEventDate } from '../../../src/utils/date-format';

/** Section buckets, in the order they appear in the post. */
export type MonthlySection = 'policy' | 'debate' | 'video' | 'speech' | 'people' | 'other';

export const SECTION_ORDER: MonthlySection[] = ['policy', 'debate', 'video', 'speech', 'people', 'other'];

const SECTION_LABEL_ZH: Record<MonthlySection, string> = {
  policy: '政策',
  debate: '辩论',
  video: '视频',
  speech: '演讲',
  people: '人物',
  other: '其他',
};

/** Which section an update's type falls into. Everything unlisted → 其他. */
export function sectionOf(type: UpdateType): MonthlySection {
  switch (type) {
    case 'policy':
    case 'debate':
    case 'video':
    case 'speech':
    case 'people':
      return type;
    default:
      return 'other';
  }
}

export interface MonthlyPostOptions {
  /** 'YYYY-MM' — the month being summarised. */
  month: string;
  /** 'YYYY-MM-DD' — frontmatter publishDate. */
  publishDate: string;
  /**
   * Topic ids harvested from the month's records by the caller (which owns
   * the data imports). Empty → falls back to ['national-strategy'] so
   * scripts/verify-graph.ts's post coverage gate stays green.
   */
  topicIds: string[];
}

export interface MonthlyPost {
  frontmatter: Record<string, unknown>;
  body: string;
}

const TOPIC_FALLBACK = 'national-strategy';
const EXCERPT_MAX = 160;
/** Chars per minute used for the 阅读约 N 分钟 estimate. */
const CHARS_PER_MINUTE = 400;

/** '2026-08' → '2026 年 8 月' (no zero padding, matching the site's zh style). */
function monthTitleZh(month: string): string {
  const [y, m] = month.split('-');
  return `${y} 年 ${parseInt(m, 10)} 月`;
}

/** The date shown next to an item: the record's own event date when it
 *  differs from the day the site picked it up, otherwise the addedAt. */
function itemDate(u: Update): string {
  if (u.eventDate && u.eventDate !== u.date) return formatEventDate(u.eventDate, 'zh');
  return u.date;
}

function itemLine(u: Update): string {
  const title = u.href ? `[${u.title}](${u.href})` : u.title;
  const head = `- ${title}（${itemDate(u)}）`;
  const summary = (u.summary ?? '').trim();
  return summary ? `${head}— ${summary}` : head;
}

/**
 * Assemble the zh post for one month.
 *
 * `updates` is expected to be pre-filtered to the month and sorted (the
 * caller does both); this function only buckets and renders.
 *
 * Reading time counts the characters of the post body EXCLUDING the stats
 * line itself — the line quotes the number, so counting it would be
 * circular.
 */
export function buildMonthlyPost(updates: Update[], opts: MonthlyPostOptions): MonthlyPost {
  const buckets = new Map<MonthlySection, Update[]>();
  for (const u of updates) {
    const s = sectionOf(u.type);
    const list = buckets.get(s);
    if (list) list.push(u);
    else buckets.set(s, [u]);
  }

  // ── Everything below the stats line ──────────────────────────────────
  const rest: string[] = [];
  rest.push('## 本月主线', '', '（手写：本月主线，2–3 句。）', '');
  for (const section of SECTION_ORDER) {
    const items = buckets.get(section);
    if (!items || items.length === 0) continue;
    rest.push(`## ${SECTION_LABEL_ZH[section]}`, '');
    for (const u of items) rest.push(itemLine(u));
    rest.push('');
  }
  rest.push('— 新加坡 AI 观察 · sgai.md');
  const restBody = rest.join('\n');

  // ── Stats line ───────────────────────────────────────────────────────
  const minutes = Math.max(1, Math.ceil(restBody.length / CHARS_PER_MINUTE));
  const counts = SECTION_ORDER.filter((s) => (buckets.get(s)?.length ?? 0) > 0).map(
    (s) => `${buckets.get(s)!.length} ${SECTION_LABEL_ZH[s]}`
  );
  counts.push(`阅读约 ${minutes} 分钟`);
  const statsLine = `本月站内更新 ${updates.length} 条：${counts.join(' · ')}`;

  const body = [statsLine, '', restBody].join('\n');

  const topicIds = opts.topicIds.length > 0 ? [...new Set(opts.topicIds)].sort() : [TOPIC_FALLBACK];

  return {
    frontmatter: {
      publishDate: opts.publishDate,
      title: `sgai 月报 · ${monthTitleZh(opts.month)}`,
      excerpt: statsLine.length > EXCERPT_MAX ? statsLine.slice(0, EXCERPT_MAX) : statsLine,
      category: '月报',
      topicIds,
      tags: ['月报'],
      author: '新加坡 AI 观察',
    },
    body,
  };
}

// ── YAML frontmatter serialisation ──────────────────────────────────────
// Deliberately hand-rolled and minimal: the shape is fixed (strings, string
// arrays, one bare ISO date) and scripts/verify-graph.ts matches topicIds
// with `/^topicIds: \[(.*)\]$/m`, so the array MUST stay on one line.

function yamlString(v: string): string {
  return `'${v.replace(/'/g, "''")}'`;
}

function yamlValue(key: string, v: unknown): string {
  if (key === 'publishDate') return String(v); // bare ISO date — the content schema wants a Date
  if (Array.isArray(v)) return `[${v.map((x) => yamlString(String(x))).join(', ')}]`;
  return yamlString(String(v));
}

/** Full `.md` file text: `---` frontmatter `---` + body + trailing newline. */
export function renderPostFile(post: MonthlyPost): string {
  const fm = Object.entries(post.frontmatter).map(([k, v]) => `${k}: ${yamlValue(k, v)}`);
  return ['---', ...fm, '---', '', post.body, ''].join('\n');
}

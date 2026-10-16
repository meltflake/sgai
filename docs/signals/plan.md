# Signals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A weekly, LLM-curated "Signals" module: 5 to 8 noteworthy Singapore AI news items per week, each with a one-line judgment, source link and topic tags, in five languages, on `/signals/`, the homepage, topic hubs and `/updates/`.

**Architecture:** One data file (`src/data/signals.ts`) written by one weekly auto-PR pipeline (`scripts/refresh/signals/`). The site reads it through three existing joins (derived-updates, topic-graph) and two new surfaces (list page, homepage block). Pure logic lives in small modules with unit tests; LLM and network calls sit behind injectable functions.

**Tech Stack:** Astro 5, TypeScript, `node:test` via `tsx --test`, Claude CLI through `scripts/lib/llm.ts`, existing `scripts/lib/*` primitives.

**Spec:** `docs/signals/spec.md`

## Global Constraints

- zh / en / ja / ko fields written in the same commit; zh-tw derives through OpenCC (CLAUDE.md rule #5).
- Every `sourceUrl` passes `validateUrls()` before it is written (rule #6).
- Every new record carries `addedAt: 'YYYY-MM-DD'` (rule #7).
- New data file is registered in `scripts/refresh/registry.json` (rule #12).
- No `lang !== 'zh'` logic; UI text through `t()` / `pickLocalized()` (rule #13).
- Internal links on topic hubs and the updates feed go to `/signals/#<id>`; only the list page links out.
- Pipeline CLI: `--dry-run / --limit=N / --no-commit / --no-push / --days=N`; last stdout line is the JSON report.
- `npm run check` and `npm run build && npm run check:dist` pass before the PR.

## Review Focus

1. A feed returns HTML instead of RSS (Cloudflare page) or times out → that source yields zero candidates and the run continues. Test in Task 5 (`parseRssXml` on HTML returns `[]`).
2. The model returns malformed JSON or a topic id outside the vocabulary → candidate dropped or id filtered, no crash. Test in Task 5 (`parseJudgment`).
3. An old page with a fresh sitemap `lastmod` → dropped by the body-date window. Test in Task 5 (`withinWindow`).
4. The same event from MDDI and Business Times → one kept, gov.sg preferred. Test in Task 5 (`selectSignals`).
5. Fewer than 3 signals in the last 14 days → homepage shows the newest 6; zero → block hidden. Test in Task 3 (`homeSignals`).

---

### Task 1: Data file, graph checks, registry

**Files:**
- Create: `src/data/signals.ts`
- Modify: `scripts/verify-graph.ts` (topicIds + related checks)
- Modify: `scripts/refresh/registry.json` (signals pipeline entry, `targets: ['src/data/signals.ts']`)

**Interfaces — Produces:**

```ts
export type SignalRelatedKind = 'policy' | 'person' | 'ecosystem' | 'startup' | 'debate' | 'video';
export interface Signal {
  id: string; date: string;
  title: string; titleEn: string; titleJa: string; titleKo: string;
  whyItMatters: string; whyItMattersEn: string; whyItMattersJa: string; whyItMattersKo: string;
  sourceUrl: string; sourceName: string;
  topicIds: string[];
  related?: Array<{ kind: SignalRelatedKind; id: string }>;
  addedAt: string;
}
export const signals: Signal[];
```

- [ ] Write `signals.ts` with the interface and `export const signals: Signal[] = [];` plus a header comment (rules, pipeline owner).
- [ ] In `verify-graph.ts`: `checkTopicIds('signal[id]', s.topicIds)` for each signal; check `related` ids against personIds, policy ids, debate ids, video ids, ecosystem slugs, startup slugs (reuse the sets already built in that file).
- [ ] Add the registry entry (`type: tsx`, `schedule: weekly`, `mode: auto-pr`, `script: scripts/refresh/signals/run.ts`, `args: ['--limit=8']`).
- [ ] Check: `npm run -s check:graph` passes; `npm run eval:coverage-audit` passes.

### Task 2: Updates feed and topic graph join

**Files:**
- Modify: `src/data/updates.ts` (`UpdateType` += `'signal'`)
- Modify: `src/utils/derived-updates.ts` (`DataSource` += `'signal'`, `harvestSignals`, add to `harvestAll`)
- Modify: `src/utils/update-type-ui.ts` (`TYPE_CHIP.signal`, `TYPE_LABEL_KEY.signal`, `eventDateLabelKey` signal → `evtDatePublished`)
- Modify: `src/i18n/index.ts` (`updateTypeSignal` zh 信号 / en Signal / ja シグナル / ko 시그널)
- Modify: `scripts/evals/addedAt-coverage/check.ts` (`DATA_FILES` += signals.ts)
- Modify: `src/utils/topic-graph.ts` (`TopicEntryKind` += `'signal'`; push each signal with `href: /signals/#<id>`, `date`)
- Modify: `src/components/topics/TopicHub.astro` and any other `Record<TopicEntryKind, …>` map (compiler lists them)
- Test: `scripts/lib/__tests__/signals-harvest.test.ts`

- [ ] Write the failing test: `harvestSignals([fixture])` returns one entry with `type: 'signal'`, `source: 'signal'`, four titles, summaries from `whyItMatters*`, `href: '/signals/#sig-x'`, `eventDate` = `date`; a record without `addedAt` is skipped.
- [ ] Export `harvestSignals` and implement; run the test, it passes.
- [ ] Add the remaining maps; `npx astro check` shows no missing-key errors.
- [ ] Check: `npm run test:lib` (includes `data-files-sync.test.ts`), `npm run -s check:graph`.

### Task 3: Shared view logic

**Files:**
- Create: `src/utils/signals.ts`
- Test: `scripts/lib/__tests__/signals-utils.test.ts`

**Interfaces — Produces:**

```ts
export function homeSignals(all: Signal[], today: string, opts?: { days?: number; max?: number; min?: number }): Signal[];
// days=14, max=6, min=3: recent window first; if it has < min items, newest `max` overall.
export interface SignalWeek { key: string; monday: string; sunday: string; items: Signal[] }
export function groupByIsoWeek(all: Signal[]): SignalWeek[]; // newest week first, items date desc
export function topicCounts(all: Signal[]): Array<{ id: string; count: number }>; // count desc, then id
```

- [ ] Write failing tests: window hit (5 recent → 5); thin window (1 recent of 10 → newest 6); empty → `[]`; week grouping across a year boundary (2026-12-31 and 2027-01-02 fall in the same ISO week); topic counts order.
- [ ] Implement; tests pass.

### Task 4: Pages, homepage block, navigation, copy

**Files:**
- Create: `src/components/signals/SignalsPage.astro`, `src/components/signals/SignalItem.astro`
- Create: `src/pages/signals/index.astro`, `src/pages/[lang]/signals/index.astro`
- Create: `src/components/home/SignalsBlock.astro`
- Modify: `src/components/home/HomePage.astro` (after `FocusHeadline`)
- Modify: `src/navigation.ts` (signals link next to latest, header + footer)
- Modify: `src/i18n/index.ts` (zh/en/ja/ko keys: `navSignals`, `signalsTitle`, `signalsIntro`, `signalsHomeHeading`, `signalsHomeCta`, `signalsAllTopics`, `signalsWeekLabel`, `signalsSource`, `signalsRelated`, `signalsEmpty`, `signalsMetaDescription`)

- [ ] `SignalItem`: anchor `id={s.id}`, `data-topics`, date, title → `sourceUrl` (`target="_blank" rel="noopener"`), source name, judgment via `pickLocalized(s, 'whyItMatters', lang)`, tag chips linking to `/topics/<id>/` with `pickLocalized(topic,'name',lang)`, related links via existing entity href helpers.
- [ ] `SignalsPage`: H1, intro, topic chip bar from `topicCounts`, weeks from `groupByIsoWeek`, empty state. Inline script: chip click toggles `hidden` on items without the topic, hides empty weeks, writes `#topic=<id>`; reads it on load.
- [ ] Route files pass `lang`; `[lang]` uses `NON_DEFAULT_ROUTE_LOCALES` like sibling routes.
- [ ] `SignalsBlock` uses `homeSignals(signals, today)`; renders nothing when empty.
- [ ] Check: `npm run check`; `npm run build`; open `dist/signals/index.html` and `dist/zh-tw/signals/index.html` with a temporary fixture record to see markup; remove the fixture.

### Task 5: Pipeline

**Files:**
- Create: `scripts/refresh/signals/sources.ts` (source table, AI keyword regex, speech-exclusion regex, domain priority)
- Create: `scripts/refresh/signals/scan.ts` (`parseRssXml`, `scanAll`)
- Create: `scripts/refresh/signals/judge.ts` (`buildJudgePrompt`, `parseJudgment`, `judgeCandidate`)
- Create: `scripts/refresh/signals/select.ts` (`withinWindow`, `selectSignals`)
- Create: `scripts/refresh/signals/emit.ts` (`renderSignal`, `insertSignals`)
- Create: `scripts/refresh/signals/run.ts`
- Modify: `scripts/lib/why-it-matters.ts` (`WhyKind` += `'signal'`, `KIND_ZH.signal = '新闻'`)
- Modify: `package.json` (`test:lib` += `scripts/refresh/signals/__tests__/*.test.ts`)
- Test: `scripts/refresh/signals/__tests__/{scan,judge,select,emit}.test.ts`

**Interfaces — Produces:**

```ts
export interface SignalCandidate { url: string; title: string; sourceName: string; domain: string; hintedDate?: string; kind: 'rss' | 'sitemap' }
export function parseRssXml(xml: string): Array<{ title: string; link: string; pubDate?: string; categories: string[] }>;
export interface Judgment { singapore: boolean; ai: boolean; score: number; reason: string; titleZh: string; topicIds: string[] }
export function parseJudgment(raw: string, topicIdSet: Set<string>): Judgment | null;
export function withinWindow(date: string | null, today: string, days: number): boolean;
export interface Judged { candidate: SignalCandidate; judgment: Judgment; pageDate: string; contentText: string }
export function selectSignals(judged: Judged[], limit: number, minScore?: number): Judged[]; // minScore=4
export function renderSignal(s: Signal): string;            // TS object literal, Prettier-shaped
export function insertSignals(src: string, records: Signal[]): string; // after `signals: Signal[] = [`
```

- [ ] Tests first for the pure units: RSS parse (normal, CDATA titles, HTML page → `[]`); `parseJudgment` (valid, fenced JSON, malformed → null, unknown topic filtered, score clamped 1..5, >3 topics trimmed, zero valid topics → null); `withinWindow` (null → false, 8 days old with days=7 → false, today → true); `selectSignals` (score < 4 dropped, sort by score then date, duplicate event by same normalized title / same URL keeps gov.sg domain, limit respected); `insertSignals` (empty array, existing records stay after new ones, apostrophes escaped).
- [ ] Implement the units; tests pass.
- [ ] `run.ts`: `ensureClaudeAuthed()` → `scanAll` (per-source try/catch, WARN line) → dedupe against `signals.ts` / `voices.ts` / `videos.ts` / `policies.ts` URLs + both rejected ledgers → for each candidate `govFetch` body, date = page date ∨ RSS pubDate, `withinWindow` gate → `judgeCandidate` (sha256 cache in `data/judgments/`) → failures of SG/AI/score go to the domain ledger → `selectSignals` → (`--dry-run` stops here, prints table) → `draftWhyItMattersBatch` + `translateBatch` for titles → `related` by deterministic name match → `validateUrls` → `insertSignals` → `findUnpairedFields` baseline-vs-after rollback → `autoCommit` + `pushAndOpenPR` → JSON report.
- [ ] Check: `npx tsx scripts/refresh/signals/run.ts --dry-run --days=14` lists scored candidates.

### Task 6: Docs, first run, ship

**Files:**
- Modify: `docs/refresh-playbook.md`, `CLAUDE.md` (pipeline table row), `CHANGELOG.md`, `src/version.ts`
- Create: `docs/signals/eval.md` (after ship)

- [ ] Docs and changelog entry.
- [ ] `npm run check && npm run build && npm run check:dist`.
- [ ] Commit, push `feat/signals`, open PR, wait for CI, merge.
- [ ] Run the pipeline for real on main (`--days=14`): it opens the first data PR. Review it item by item, fix wording, merge.
- [ ] Verify live: `/signals/` in five languages, homepage block, one topic hub, `/updates/`.
- [ ] Write `docs/signals/eval.md`.

// scripts/evals/gsc-monitor/check.ts
// ────────────────────────────────────────────────────────────────────────
// GSC search-performance watch. Pulls the last 28 days of Search Analytics
// (query + page dimensions) from the Google Search Console API and runs
// three detectors derived from the 2026-07 SEO review:
//
//   1. striking-distance — queries at position 8–15 with ≥50 impressions:
//      the "one push from page one" list, with movement vs the previous
//      snapshot so wins/losses are visible week to week.
//   2. ctr-anomaly — pages ranking ≤8 with ≥200 impressions but CTR <1%:
//      good ranking, dead snippet → title/description work, not ranking work.
//   3. zh-recovery — impressions-weighted average position of /zh/ pages
//      (the zh tree restarted from zero at the 2026-05-05 routing flip;
//      baseline was ~28).
//
// Exit semantics (issue-on-fail cron mode):
//   - exit 1 only on week-over-week REGRESSIONS: a previously tracked
//     striking-distance query worsening by >5 positions, site CTR halving,
//     or /zh/ average position worsening by >5. A long striking-distance
//     list by itself is opportunity, not failure.
//   - exit 0 otherwise (report written to reports/ either way).
//
// Auth: service-account JWT signed locally with node:crypto — no googleapis
// dependency. The OAuth refresh-token path mentioned in early drafts is NOT
// implemented; use a service account (see SETUP.md).
//
// Usage:
//   npx tsx scripts/evals/gsc-monitor/check.ts                # 28-day window
//   npx tsx scripts/evals/gsc-monitor/check.ts --window=7     # shorter window
//   npx tsx scripts/evals/gsc-monitor/check.ts --no-snapshot  # don't update state
//
// Required env:
//   GSC_SERVICE_ACCOUNT_JSON  — path to the service-account JSON key file
//   GSC_PROPERTY_URL          — "sc-domain:sgai.md" or "https://sgai.md/"
//
// Exit codes:
//   0 — pass / skipped (no creds)
//   1 — week-over-week regression detected
//   2 — invocation / API error

import { createSign } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const STATE_DIR = resolve(import.meta.dirname, 'state');
const REPORT_DIR = resolve(import.meta.dirname, 'reports');

interface AnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface StrikingQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface CtrAnomalyPage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Snapshot {
  generatedAt: string;
  window: { startDate: string; endDate: string };
  totals: { clicks: number; impressions: number; ctr: number };
  striking: StrikingQuery[];
  ctrAnomalies: CtrAnomalyPage[];
  zh: { avgPosition: number | null; clicks: number; impressions: number };
}

interface CliOptions {
  windowDays: number;
  noSnapshot: boolean;
}

// Detector thresholds — tuned against the 2026-07 GSC export; adjust as
// the site's volume grows.
const STRIKING_POS_MIN = 8;
const STRIKING_POS_MAX = 15;
const STRIKING_MIN_IMPRESSIONS = 50;
const ANOMALY_MAX_POS = 8;
const ANOMALY_MIN_IMPRESSIONS = 200;
const ANOMALY_MAX_CTR = 0.01;
const REGRESSION_POS_DELTA = 5;

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { windowDays: 28, noSnapshot: false };
  for (const a of argv) {
    if (a === '--no-snapshot') opts.noSnapshot = true;
    else if (a.startsWith('--window=')) opts.windowDays = Math.max(1, Number(a.slice('--window='.length)) || 28);
    else if (a === '--help' || a === '-h') {
      process.stdout.write('Usage: eval:gsc [--window=N] [--no-snapshot]\n');
      process.exit(0);
    }
  }
  return opts;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function setupInstructions(): string {
  return [
    'GSC monitor is configured but credentials are missing. To enable:',
    '',
    '  1. Create a Google Cloud service account:',
    '     gcloud iam service-accounts create sgai-gsc-reader --display-name "sgai GSC reader"',
    '',
    '  2. Download a JSON key:',
    '     gcloud iam service-accounts keys create ~/sgai-gsc.json \\',
    '       --iam-account sgai-gsc-reader@<PROJECT_ID>.iam.gserviceaccount.com',
    '',
    '  3. Add the service account email as a USER in GSC for sgai.md',
    '     (Search Console → Settings → Users and permissions → Add user → Restricted)',
    '',
    '  4. Enable the Search Console API for the project:',
    '     gcloud services enable searchconsole.googleapis.com',
    '',
    '  5. Add to ~/.zshrc (or .env.local):',
    '     export GSC_SERVICE_ACCOUNT_JSON=~/sgai-gsc.json',
    '     export GSC_PROPERTY_URL="sc-domain:sgai.md"   # or full URL prefix',
    '',
    '  6. Re-run: `npx tsx scripts/evals/gsc-monitor/check.ts`',
    '',
    'See scripts/evals/gsc-monitor/SETUP.md for the full guide.',
  ].join('\n');
}

function credsAvailable(): boolean {
  return !!(process.env.GSC_SERVICE_ACCOUNT_JSON && process.env.GSC_PROPERTY_URL);
}

// ---- Google auth (service-account JWT, zero dependencies) ---------------

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function fetchAccessToken(keyFilePath: string): Promise<string> {
  const key = JSON.parse(readFileSync(keyFilePath, 'utf8')) as ServiceAccountKey;
  if (!key.client_email || !key.private_key) {
    throw new Error(`Service-account key at ${keyFilePath} is missing client_email/private_key.`);
  }
  const tokenUri = key.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(key.private_key));
  const assertion = `${header}.${claims}.${signature}`;

  const resp = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!resp.ok) {
    throw new Error(`Token exchange failed: HTTP ${resp.status} — ${(await resp.text()).slice(0, 300)}`);
  }
  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token exchange returned no access_token.');
  return data.access_token;
}

// ---- Search Analytics ----------------------------------------------------

async function querySearchAnalytics(
  token: string,
  property: string,
  body: Record<string, unknown>
): Promise<AnalyticsRow[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    throw new Error(`searchAnalytics.query failed: HTTP ${resp.status} — ${(await resp.text()).slice(0, 300)}`);
  }
  const data = (await resp.json()) as { rows?: AnalyticsRow[] };
  return data.rows ?? [];
}

// ---- Detectors -----------------------------------------------------------

function detectStriking(queryRows: AnalyticsRow[]): StrikingQuery[] {
  return queryRows
    .filter(
      (r) =>
        r.position >= STRIKING_POS_MIN && r.position <= STRIKING_POS_MAX && r.impressions >= STRIKING_MIN_IMPRESSIONS
    )
    .map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
}

function detectCtrAnomalies(pageRows: AnalyticsRow[]): CtrAnomalyPage[] {
  return pageRows
    .filter((r) => r.position <= ANOMALY_MAX_POS && r.impressions >= ANOMALY_MIN_IMPRESSIONS && r.ctr < ANOMALY_MAX_CTR)
    .map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
}

function detectZhRecovery(pageRows: AnalyticsRow[]): Snapshot['zh'] {
  const zhRows = pageRows.filter((r) => r.keys[0]?.includes('/zh/'));
  const impressions = zhRows.reduce((s, r) => s + r.impressions, 0);
  const clicks = zhRows.reduce((s, r) => s + r.clicks, 0);
  const avgPosition =
    impressions > 0 ? zhRows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : null;
  return { avgPosition: avgPosition === null ? null : Math.round(avgPosition * 10) / 10, clicks, impressions };
}

interface Regression {
  detector: string;
  detail: string;
}

function detectRegressions(prev: Snapshot | null, current: Snapshot): Regression[] {
  if (!prev) return [];
  const regressions: Regression[] = [];

  // 1. Tracked striking-distance queries that fell hard.
  const currentByQuery = new Map(current.striking.map((q) => [q.query, q]));
  for (const was of prev.striking) {
    const now = currentByQuery.get(was.query);
    if (now && now.position - was.position > REGRESSION_POS_DELTA) {
      regressions.push({
        detector: 'striking-distance',
        detail: `"${was.query}" position ${was.position.toFixed(1)} → ${now.position.toFixed(1)}`,
      });
    }
  }

  // 2. Site-wide CTR halved (only meaningful with real volume on both sides).
  if (prev.totals.impressions >= 1000 && current.totals.impressions >= 1000 && prev.totals.ctr > 0) {
    if (current.totals.ctr < prev.totals.ctr / 2) {
      regressions.push({
        detector: 'site-ctr',
        detail: `site CTR ${(prev.totals.ctr * 100).toFixed(2)}% → ${(current.totals.ctr * 100).toFixed(2)}%`,
      });
    }
  }

  // 3. /zh/ average position worsened materially.
  if (prev.zh.avgPosition !== null && current.zh.avgPosition !== null && prev.zh.impressions >= 200) {
    if (current.zh.avgPosition - prev.zh.avgPosition > REGRESSION_POS_DELTA) {
      regressions.push({
        detector: 'zh-recovery',
        detail: `/zh/ avg position ${prev.zh.avgPosition} → ${current.zh.avgPosition}`,
      });
    }
  }

  return regressions;
}

// ---- Snapshot + report ---------------------------------------------------

function loadPreviousSnapshot(): Snapshot | null {
  const path = join(STATE_DIR, 'last-snapshot.json');
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Snapshot;
    // Pre-rewrite snapshots (the GscIssue stub era) lack `totals` — ignore them.
    return parsed && parsed.totals ? parsed : null;
  } catch {
    return null;
  }
}

function saveSnapshot(snap: Snapshot): void {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(join(STATE_DIR, 'last-snapshot.json'), `${JSON.stringify(snap, null, 2)}\n`);
}

function fmtPct(x: number): string {
  return `${(x * 100).toFixed(2)}%`;
}

function writeReport(prev: Snapshot | null, current: Snapshot, regressions: Regression[]): string {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const path = join(REPORT_DIR, `report-${stamp}.md`);
  const prevByQuery = new Map((prev?.striking ?? []).map((q) => [q.query, q]));

  const lines: string[] = [`# GSC search-performance watch — ${stamp}`, ''];
  lines.push(`Window: ${current.window.startDate} → ${current.window.endDate}`);
  lines.push(
    `Totals: ${current.totals.clicks} clicks / ${current.totals.impressions} impressions / CTR ${fmtPct(current.totals.ctr)}` +
      (prev ? ` (prev: ${prev.totals.clicks} / ${prev.totals.impressions} / ${fmtPct(prev.totals.ctr)})` : '')
  );
  lines.push('');

  if (regressions.length > 0) {
    lines.push('## ⚠ Regressions');
    for (const r of regressions) lines.push(`- [${r.detector}] ${r.detail}`);
    lines.push('');
  }

  lines.push(`## Striking distance (pos ${STRIKING_POS_MIN}–${STRIKING_POS_MAX}, impr ≥ ${STRIKING_MIN_IMPRESSIONS})`);
  if (current.striking.length === 0) lines.push('_none_');
  for (const q of current.striking) {
    const was = prevByQuery.get(q.query);
    const delta = was ? ` (was ${was.position.toFixed(1)})` : ' (new)';
    lines.push(
      `- "${q.query}" — pos ${q.position.toFixed(1)}${delta}, ${q.impressions} impr, ${q.clicks} clicks, CTR ${fmtPct(q.ctr)}`
    );
  }
  lines.push('');

  lines.push(`## CTR anomalies (pos ≤ ${ANOMALY_MAX_POS}, impr ≥ ${ANOMALY_MIN_IMPRESSIONS}, CTR < ${fmtPct(ANOMALY_MAX_CTR)})`);
  if (current.ctrAnomalies.length === 0) lines.push('_none_');
  for (const p of current.ctrAnomalies) {
    lines.push(`- ${p.page} — pos ${p.position.toFixed(1)}, ${p.impressions} impr, ${p.clicks} clicks, CTR ${fmtPct(p.ctr)}`);
  }
  lines.push('');

  lines.push('## /zh/ recovery');
  if (current.zh.avgPosition === null) {
    lines.push('_no /zh/ impressions in window_');
  } else {
    lines.push(
      `- avg position ${current.zh.avgPosition}` +
        (prev?.zh.avgPosition != null ? ` (prev ${prev.zh.avgPosition})` : '') +
        ` · ${current.zh.clicks} clicks / ${current.zh.impressions} impressions`
    );
  }
  lines.push('');

  writeFileSync(path, lines.join('\n'));
  return path;
}

// ---- Main ----------------------------------------------------------------

async function main() {
  const opts = parseCli(process.argv.slice(2));

  if (!credsAvailable()) {
    process.stdout.write(setupInstructions());
    process.stdout.write('\n');
    process.exit(0);
  }

  const property = process.env.GSC_PROPERTY_URL!;
  const keyFile = process.env.GSC_SERVICE_ACCOUNT_JSON!;

  // GSC data lags ~2-3 days; end the window 3 days ago so numbers are final.
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - opts.windowDays);
  const startDate = isoDate(start);
  const endDate = isoDate(end);

  let queryRows: AnalyticsRow[];
  let pageRows: AnalyticsRow[];
  try {
    const token = await fetchAccessToken(keyFile);
    [queryRows, pageRows] = await Promise.all([
      querySearchAnalytics(token, property, {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 5000,
        dataState: 'final',
      }),
      querySearchAnalytics(token, property, {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 5000,
        dataState: 'final',
      }),
    ]);
  } catch (err) {
    process.stderr.write(`GSC fetch failed: ${(err as Error).message}\n`);
    process.exit(2);
  }

  const totalClicks = pageRows.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = pageRows.reduce((s, r) => s + r.impressions, 0);
  const current: Snapshot = {
    generatedAt: new Date().toISOString(),
    window: { startDate, endDate },
    totals: {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    },
    striking: detectStriking(queryRows),
    ctrAnomalies: detectCtrAnomalies(pageRows),
    zh: detectZhRecovery(pageRows),
  };

  const previous = loadPreviousSnapshot();
  const regressions = detectRegressions(previous, current);
  const reportPath = writeReport(previous, current, regressions);

  process.stdout.write(`Report: ${relative(REPO_ROOT, reportPath)}\n`);
  process.stdout.write(
    `  Window ${startDate} → ${endDate}: ${current.totals.clicks} clicks / ${current.totals.impressions} impressions / CTR ${fmtPct(current.totals.ctr)}\n`
  );
  process.stdout.write(
    `  striking-distance: ${current.striking.length} · ctr-anomalies: ${current.ctrAnomalies.length} · /zh/ avg pos: ${current.zh.avgPosition ?? 'n/a'}\n`
  );

  if (!opts.noSnapshot) saveSnapshot(current);

  if (regressions.length > 0) {
    process.stdout.write(`\nFAIL — ${regressions.length} week-over-week regression(s):\n`);
    for (const r of regressions) process.stdout.write(`  - [${r.detector}] ${r.detail}\n`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});

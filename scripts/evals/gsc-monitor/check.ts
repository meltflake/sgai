// scripts/evals/gsc-monitor/check.ts
// ────────────────────────────────────────────────────────────────────────
// GSC Monitor eval. Pulls the latest "Indexing issues" + "Rich Results
// status" from Google Search Console for sgai.md, and opens an issue
// when new errors appear.
//
// Status: STUB — needs Luca to wire credentials. See SETUP.md in this
// folder. Without credentials, the eval prints setup instructions and
// exits 0 (skip, not fail) so it doesn't block the cron pipeline.
//
// Why: GSC catches things our local check:schema and eval:schema can't —
// stale indexed URLs, mobile usability errors, Core Web Vitals regressions,
// AMP errors, structured-data warnings on actual rendered pages. Today
// we rely on Luca reading GSC email digests by hand.
//
// Once wired: weekly cron will pull last-7-days issues, diff against the
// previous run's snapshot in scripts/evals/gsc-monitor/state/, and open
// `gh issue create --assignee @me` with new errors. Resolved errors are
// noted but don't trigger a notification.
//
// Usage (post-wiring):
//   npx tsx scripts/evals/gsc-monitor/check.ts                    # weekly run
//   npx tsx scripts/evals/gsc-monitor/check.ts --since=2026-05-01 # explicit window
//   npx tsx scripts/evals/gsc-monitor/check.ts --no-snapshot      # don't update state
//
// Required env (any one):
//   GSC_SERVICE_ACCOUNT_JSON  — path to service-account JSON key file
//   GSC_OAUTH_REFRESH_TOKEN   — OAuth user refresh token
//
// Required env (always):
//   GSC_PROPERTY_URL          — the property string, e.g. "sc-domain:sgai.md"
//                               or "https://sgai.md/" (must match GSC settings)
//
// Exit codes:
//   0 — pass / skipped (no creds)
//   1 — new errors detected
//   2 — invocation / API error

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const STATE_DIR = resolve(import.meta.dirname, 'state');
const REPORT_DIR = resolve(import.meta.dirname, 'reports');

interface GscIssue {
  category: string;
  detail: string;
  url?: string;
  detectedAt: string;
}

interface Snapshot {
  generatedAt: string;
  issues: GscIssue[];
}

interface CliOptions {
  since?: string;
  noSnapshot: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { noSnapshot: false };
  for (const a of argv) {
    if (a === '--no-snapshot') opts.noSnapshot = true;
    else if (a.startsWith('--since=')) opts.since = a.slice('--since='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write('Usage: eval:gsc [--since=YYYY-MM-DD] [--no-snapshot]\n');
      process.exit(0);
    }
  }
  return opts;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
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
    'See scripts/evals/gsc-monitor/SETUP.md for full guide.',
  ].join('\n');
}

function credsAvailable(): boolean {
  const hasCreds = !!(process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GSC_OAUTH_REFRESH_TOKEN);
  const hasProperty = !!process.env.GSC_PROPERTY_URL;
  return hasCreds && hasProperty;
}

function loadPreviousSnapshot(): Snapshot | null {
  const path = join(STATE_DIR, 'last-snapshot.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Snapshot;
  } catch {
    return null;
  }
}

function saveSnapshot(snap: Snapshot): void {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(join(STATE_DIR, 'last-snapshot.json'), `${JSON.stringify(snap, null, 2)}\n`);
}

function diffIssues(prev: GscIssue[] | null, current: GscIssue[]): { added: GscIssue[]; resolved: GscIssue[] } {
  const key = (i: GscIssue) => `${i.category}|${i.detail}|${i.url ?? ''}`;
  const prevSet = new Set((prev ?? []).map(key));
  const currSet = new Set(current.map(key));
  const added = current.filter((i) => !prevSet.has(key(i)));
  const resolved = (prev ?? []).filter((i) => !currSet.has(key(i)));
  return { added, resolved };
}

/**
 * Fetch issues from Google Search Console API. STUB — pending Luca's
 * credential wiring. The real impl will use googleapis Node SDK:
 *
 *   import { google } from 'googleapis';
 *   const auth = new google.auth.GoogleAuth({
 *     keyFile: process.env.GSC_SERVICE_ACCOUNT_JSON,
 *     scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
 *   });
 *   const webmasters = google.webmasters({ version: 'v3', auth });
 *   // urlInspection / sitemaps / searchanalytics endpoints
 *
 * For now, throw so the calling logic can fall through to setup
 * instructions (which the main loop catches).
 */
async function fetchGscIssues(_property: string, _since: string): Promise<GscIssue[]> {
  throw new Error('GSC API client not yet implemented — see SETUP.md.');
}

function writeReport(payload: { added: GscIssue[]; resolved: GscIssue[]; total: number }): string {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const path = join(REPORT_DIR, `report-${stamp}.md`);
  const lines: string[] = [`# GSC Monitor — ${stamp}`, ''];
  lines.push(`- Total current issues: ${payload.total}`);
  lines.push(`- Newly added since last run: ${payload.added.length}`);
  lines.push(`- Resolved since last run: ${payload.resolved.length}`);
  lines.push('');
  if (payload.added.length > 0) {
    lines.push('## New issues');
    for (const i of payload.added) {
      lines.push(`- [${i.category}] ${i.detail}${i.url ? ` (${i.url})` : ''}`);
    }
    lines.push('');
  }
  if (payload.resolved.length > 0) {
    lines.push('## Resolved');
    for (const i of payload.resolved) {
      lines.push(`- [${i.category}] ${i.detail}${i.url ? ` (${i.url})` : ''}`);
    }
  }
  writeFileSync(path, lines.join('\n'));
  return path;
}

async function main() {
  const opts = parseCli(process.argv.slice(2));

  if (!credsAvailable()) {
    process.stdout.write(setupInstructions());
    process.stdout.write('\n');
    process.exit(0);
  }

  const property = process.env.GSC_PROPERTY_URL!;
  const since =
    opts.since ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().slice(0, 10);
    })();

  let issues: GscIssue[];
  try {
    issues = await fetchGscIssues(property, since);
  } catch (err) {
    process.stderr.write(`GSC fetch failed: ${(err as Error).message}\n`);
    process.exit(2);
  }

  const previous = loadPreviousSnapshot();
  const { added, resolved } = diffIssues(previous?.issues ?? null, issues);

  const reportPath = writeReport({ added, resolved, total: issues.length });
  process.stdout.write(`Report: ${relative(REPO_ROOT, reportPath)}\n`);
  process.stdout.write(`  Total: ${issues.length}, +${added.length} new, -${resolved.length} resolved\n`);

  if (!opts.noSnapshot) {
    saveSnapshot({ generatedAt: new Date().toISOString(), issues });
  }

  if (added.length > 0) {
    process.stdout.write(`\nFAIL — ${added.length} new GSC issue(s) detected.\n`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});

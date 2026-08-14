// scripts/refresh/videos/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for the daily videos auto-PR pipeline. Closes the last
// scan-only gap in the refresh fleet (audit 2026-07-07 判断 10 / P1): the
// scan ran daily but emit was a manual command, so a broken notification
// chain silently lost content — 3 videos on 2026-07-07 (gh 401) and 3
// again on 2026-07-28 (issue backlog aged out of the RSS window).
//
// Flow:
//   1. python3 scripts/videos/01_scan_channels.py --exclude-existing
//      --days 14 → merge-writes scripts/videos/data/candidates.json
//      (keyed by videoId; keeps un-emitted candidates across days).
//   2. Read candidates.json; drop ids already in videos.ts and ids in
//      state.domains.videos.video_ids (emitted before — PR open, or PR
//      rejected; a human "no" must stay a no, see below).
//   3. Nothing left → JSON report {added: 0}, no PR.
//   4. Else spawn scripts/refresh/videos/emit.ts --ids=<csv>, which does
//      LLM bilingual fields → 4-language transcript chain → i18n-pair
//      hard gate → autoCommit + PR. emit is idempotent (re-dedupes
//      against videos.ts) and its failure modes are already defensive.
//   5. On emit success: append the emitted ids to state so tomorrow's run
//      doesn't re-emit while the PR awaits review. On failure: state is
//      NOT updated and candidates.json still holds the ids → automatic
//      retry on the next daily run. Nothing silently rots.
//
// State semantics (domains.videos.video_ids): "ids handed to emit at
// least once". Pruned on load of ids that made it into videos.ts (merged
// PRs), so the list stays bounded. An id whose PR was closed WITHOUT
// merging stays in the set forever — that is deliberate: a rejected video
// must not come back every day. To re-emit one intentionally, remove it
// from scripts/data/last_scan_state.json and run again, or run emit.ts
// --ids=<id> by hand.
//
// CLI (pipeline contract, CLAUDE.md 添加新管线):
//   --dry-run    scan + report what WOULD be emitted; no LLM, no writes
//   --limit=N    cap the emit batch (default 10 — LLM cost sanity bound)
//   --no-commit  run emit but stop before commit (working tree review)
//   --no-push    commit but skip push + PR
//
// The dispatcher (auto_update.py run_tsx_pipeline) parses the LAST stdout
// line as a JSON report: {domain, added, failures, pr_url, elapsed_seconds}.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { loadState, saveState, getDomainState, setDomainState } from '../../lib/state.ts';
import { ensureClaudeAuthed } from '../../lib/llm.ts';

const ROOT = resolve('.');
const SCAN_SCRIPT = resolve('scripts/videos/01_scan_channels.py');
const EMIT_SCRIPT = resolve('scripts/refresh/videos/emit.ts');

/**
 * Python interpreter for the channel scan. 01_scan_channels.py imports
 * requests + feedparser, which live in the pipeline venv (scripts/SETUP.md),
 * not in the system python. This script is spawned via `npx tsx`, so a bare
 * `python3` resolves to whichever python leads PATH under cron — historically
 * the system one, which lacks feedparser and silently failed every daily scan
 * for 2026-07-29 → 2026-08-14 (the run kept going on the stale candidates
 * backlog, so the failures masqueraded as "no new videos").
 *
 * Resolution probes each candidate for `import feedparser, requests` and
 * returns the first that passes: the dispatcher's own interpreter when
 * exported (auto_update.py sets SGAI_PIPELINE_PYTHON), then the canonical
 * persistent venv (~/.venvs/sgai), then the legacy /tmp venv for machines
 * still on the old SETUP path, then a bare `python3` fallback. Probing (not
 * mere existence) matters: cron's interpreter may have requests for the
 * in-process hansard scan but still lack feedparser, which used to break
 * only the videos scan.
 */
function canRunScan(python: string): boolean {
  const probe = spawnSync(python, ['-c', 'import feedparser, requests'], {
    encoding: 'utf8',
    timeout: 15000,
  });
  return probe.status === 0;
}

function resolveScanPython(): string {
  const candidates = [
    ...(process.env.SGAI_PIPELINE_PYTHON ? [process.env.SGAI_PIPELINE_PYTHON] : []),
    ...(process.env.HOME ? [resolve(process.env.HOME, '.venvs/sgai/bin/python')] : []),
    resolve('/tmp/sgai-venv/bin/python'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && canRunScan(candidate)) return candidate;
  }
  return 'python3';
}
const CANDIDATES_JSON = resolve('scripts/videos/data/candidates.json');
const VIDEOS_TS = resolve('src/data/videos.ts');

interface Candidate {
  videoId: string;
  title: string;
  date: string;
  channel: string;
  youtubeUrl: string;
}

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 10,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
  };
}

/** Video ids already merged into videos.ts (same extraction as the Python
 *  scanner's get_existing_video_urls). */
function readExistingVideoIds(): Set<string> {
  const ids = new Set<string>();
  if (!existsSync(VIDEOS_TS)) return ids;
  const src = readFileSync(VIDEOS_TS, 'utf8');
  for (const m of src.matchAll(/youtubeUrl:\s*'(https?:\/\/[^']+)'/g)) {
    const vid = m[1].match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (vid) ids.add(vid[1]);
  }
  return ids;
}

function readCandidates(): Candidate[] {
  if (!existsSync(CANDIDATES_JSON)) return [];
  try {
    const parsed = JSON.parse(readFileSync(CANDIDATES_JSON, 'utf8')) as Candidate[];
    return Array.isArray(parsed) ? parsed.filter((c) => c && typeof c.videoId === 'string') : [];
  } catch {
    return [];
  }
}

function report(fields: Record<string, unknown>): void {
  process.stdout.write('\n' + JSON.stringify(fields) + '\n');
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();
  process.stdout.write('\n[videos-refresh] starting\n');

  // Preflight LLM auth before any per-candidate work (same rationale as
  // the other pipelines: `claude --version` passes with an expired token).
  if (!flags.dryRun) {
    ensureClaudeAuthed();
    process.stdout.write('  preflight: claude auth OK\n');
  }

  // 1. Scan. The Python matcher stays the single source of truth for
  //    channel config + AI/SG keyword gates; its main() merge-writes
  //    candidates.json. A scan failure is NOT fatal — the pending backlog
  //    in candidates.json is still worth emitting (that resilience is the
  //    whole point of persisting it).
  let scanFailed = false;
  const scanPython = resolveScanPython();
  const scan = spawnSync(scanPython, [SCAN_SCRIPT, '--exclude-existing', '--days', '14'], {
    cwd: ROOT,
    encoding: 'utf-8',
  });
  if (scan.status !== 0) {
    scanFailed = true;
    process.stdout.write(
      `  ! scan failed (exit ${scan.status}, interpreter ${scanPython}): ${(scan.stderr || '').trim().slice(-300)}\n`
    );
    process.stdout.write('  continuing with existing candidates.json backlog\n');
  } else {
    for (const line of (scan.stdout || '').split('\n')) {
      if (line.trim()) process.stdout.write(`    | ${line}\n`);
    }
  }

  // 2. Filter.
  const state = loadState();
  const videosState = getDomainState(state, 'videos');
  const existingIds = readExistingVideoIds();
  // Prune merged ids so the emitted-set stays bounded.
  const emittedIds = new Set((videosState.video_ids || []).filter((id) => !existingIds.has(id)));

  const candidates = readCandidates();
  const pending = candidates.filter((c) => !existingIds.has(c.videoId) && !emittedIds.has(c.videoId));
  const batch = pending.slice(0, flags.limit);

  process.stdout.write(
    `  candidates: ${candidates.length} on disk, ${pending.length} pending, batch ${batch.length} (limit ${flags.limit})\n`
  );
  for (const c of batch) {
    process.stdout.write(`    [${c.date}] ${c.channel}: ${c.title} · ${c.videoId}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[videos-refresh] dry-run done.\n');
    report({
      domain: 'videos',
      added: 0,
      pending: pending.length,
      failures: scanFailed ? 1 : 0,
      reason: 'dry-run',
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    return;
  }

  // Persist the pruned emitted-set even when there is nothing to emit.
  videosState.video_ids = [...emittedIds];
  setDomainState(state, 'videos', videosState);

  if (batch.length === 0) {
    saveState(state);
    process.stdout.write('\n[videos-refresh] nothing to emit.\n');
    report({
      domain: 'videos',
      added: 0,
      failures: scanFailed ? 1 : 0,
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    return;
  }

  // 3. Emit (LLM fields → transcripts → i18n gate → commit → PR).
  const emitArgs = [EMIT_SCRIPT, `--ids=${batch.map((c) => c.videoId).join(',')}`];
  if (flags.noCommit) emitArgs.push('--no-commit');
  if (flags.noPush) emitArgs.push('--no-push');
  process.stdout.write(`\n  $ npx tsx ${emitArgs.join(' ')}\n`);
  const emit = spawnSync('npx', ['tsx', ...emitArgs], { cwd: ROOT, encoding: 'utf-8' });
  for (const line of (emit.stdout || '').split('\n')) {
    if (line.trim()) process.stdout.write(`    | ${line}\n`);
  }
  if (emit.stderr) {
    for (const line of emit.stderr.split('\n')) {
      if (line.trim()) process.stderr.write(`    | err: ${line}\n`);
    }
  }

  if (emit.status !== 0) {
    // State NOT updated → these ids retry on the next daily run. Non-zero
    // exit lets the dispatcher extract and report the failure signal.
    process.stdout.write('\n[videos-refresh] emit FAILED — ids left pending for retry.\n');
    report({
      domain: 'videos',
      added: 0,
      failures: batch.length,
      error: `emit exit ${emit.status}`,
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    process.exit(1);
  }

  // 4. Success bookkeeping. Record ALL batch ids: emit re-dedupes against
  //    videos.ts internally, so an id it skipped is either merged (pruned
  //    next run) or was emitted now.
  for (const c of batch) emittedIds.add(c.videoId);
  videosState.video_ids = [...emittedIds];
  setDomainState(state, 'videos', videosState);
  saveState(state);

  const prMatch = (emit.stdout || '').match(/PR opened: (\S+)/);
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write('\n[videos-refresh] DONE\n');
  report({
    domain: 'videos',
    added: batch.length,
    failures: scanFailed ? 1 : 0,
    pr_url: prMatch ? prMatch[1] : null,
    elapsed_seconds: elapsed,
  });
}

await main();

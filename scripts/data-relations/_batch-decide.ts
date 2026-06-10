#!/usr/bin/env tsx
// Batch helper for the data-relations review queue. Complements the
// interactive `review.ts review` flow: lets a reviewer (human or model)
// sweep through obvious decisions in bulk, then handle ambiguous ones
// one by one without leaving the terminal.
//
//   pass=auto  — apply rule-based decisions across the whole queue:
//                  HIGH                                          → accept all
//                  MEDIUM + person-overlap signal                → accept
//                  MEDIUM + ministry-match (id-derived) signal   → accept
//                  everything else                               → leave null
//                Reports the residual undecided pile for pass=manual.
//
//   pass=manual --entry=<id> --accept=<targetId,...> [--reject=<...>]
//                Apply a hand-curated decision to one entry.
//
// Run with: npx tsx scripts/data-relations/_batch-decide.ts <queue> <pass> ...

import { readFileSync, writeFileSync } from 'node:fs';

import type { QueueFile, QueueEntry, QueueCandidate } from './lib/queue';
import { recomputeStats } from './lib/queue';

const args = process.argv.slice(2);
const path = args[0];
const pass = args[1];
if (!path || !pass) {
  console.error('usage: _batch-decide.ts <queue> auto');
  console.error('       _batch-decide.ts <queue> manual --entry=<id> --accept=<a,b> [--reject=<c>]');
  process.exit(2);
}
const flags: Record<string, string> = {};
for (const a of args.slice(2)) {
  if (a.startsWith('--')) {
    const eq = a.indexOf('=');
    if (eq !== -1) flags[a.slice(2, eq)] = a.slice(eq + 1);
  }
}

const queue = JSON.parse(readFileSync(path, 'utf-8')) as QueueFile;

function hasStrongSignal(c: QueueCandidate, type: 'person-overlap' | 'ministry-match'): boolean {
  if (type === 'ministry-match') {
    return c.signals.some((s) => s.type === 'ministry-match' && s.detail.startsWith('id-derived:'));
  }
  return c.signals.some((s) => s.type === 'person-overlap');
}

function autoDecideEntry(entry: QueueEntry): {
  accepted: string[];
  rejected: string[];
  reason: 'auto-accepted' | 'pending-manual';
} {
  const acceptedIds: string[] = [];
  const rejectedIds: string[] = [];
  for (const c of entry.candidates) {
    if (c.confidence === 'high') {
      acceptedIds.push(c.targetId);
    } else if (c.confidence === 'medium' && (hasStrongSignal(c, 'person-overlap') || hasStrongSignal(c, 'ministry-match'))) {
      acceptedIds.push(c.targetId);
    }
    // else: leave it ambiguous; reject only happens in manual pass below.
  }
  return {
    accepted: acceptedIds,
    rejected: rejectedIds,
    reason: acceptedIds.length > 0 ? 'auto-accepted' : 'pending-manual',
  };
}

if (pass === 'auto') {
  let auto = 0;
  let pending = 0;
  for (const entry of queue.entries) {
    if (entry.decision !== null) continue;
    const result = autoDecideEntry(entry);
    if (result.accepted.length > 0) {
      entry.decision = { accepted: result.accepted, rejected: result.rejected };
      entry.reviewedAt = new Date().toISOString();
      auto += 1;
    } else {
      pending += 1;
    }
  }
  queue.stats = recomputeStats(queue);
  writeFileSync(path, JSON.stringify(queue, null, 2) + '\n');
  console.log(`auto: ${auto} entries decided, ${pending} pending manual review`);
  console.log(`stats: ${JSON.stringify(queue.stats)}`);

  // List the still-undecided entries with their candidate ids for quick triage.
  const stillPending = queue.entries.filter((e) => e.decision === null);
  console.log(`\npending entries (${stillPending.length}):`);
  for (const e of stillPending.slice(0, 50)) {
    const cs = e.candidates.map((c) => `${c.confidence[0]}:${c.targetId}`).join(' | ');
    console.log(`  ${e.id}  "${e.title.slice(0, 60)}"`);
    console.log(`    ${cs}`);
  }
  if (stillPending.length > 50) console.log(`  ... and ${stillPending.length - 50} more`);
} else if (pass === 'manual') {
  const entryId = flags.entry;
  if (!entryId) {
    console.error('manual: --entry=<id> required');
    process.exit(2);
  }
  const entry = queue.entries.find((e) => e.id === entryId);
  if (!entry) {
    console.error(`manual: entry not found: ${entryId}`);
    process.exit(2);
  }
  const accept = (flags.accept || '').split(',').filter(Boolean);
  const reject = (flags.reject || '').split(',').filter(Boolean);
  const allCandidateIds = entry.candidates.map((c) => c.targetId);
  const known = new Set([...accept, ...reject]);
  const implicitlyRejected = allCandidateIds.filter((id) => !known.has(id));
  entry.decision = {
    accepted: accept,
    rejected: [...reject, ...implicitlyRejected],
  };
  entry.reviewedAt = new Date().toISOString();
  queue.stats = recomputeStats(queue);
  writeFileSync(path, JSON.stringify(queue, null, 2) + '\n');
  console.log(`manual: ${entryId} → accepted=${accept.join(',') || '(none)'}, rejected=${entry.decision.rejected.join(',')}`);
  console.log(`stats: ${JSON.stringify(queue.stats)}`);
} else {
  console.error(`unknown pass: ${pass}`);
  process.exit(2);
}

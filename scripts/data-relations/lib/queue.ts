// Queue I/O for the data-relations review queue.
//
// A "queue" is a JSON file under scripts/data-relations/queue/. It captures:
//   - which (domain, field) pair was scanned
//   - one entry per anchor entity that has an empty target field
//   - candidate suggestions per entry (with signals + confidence)
//   - the reviewer's decision per entry (initially null)
//
// Decisions are mutated in place by the interactive review CLI; apply.ts
// then reads the queue back and writes accepted relations into src/data/*.ts
// via the codemod helper.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { Confidence, Signal } from './heuristics';

export type Domain = 'debates' | 'policies';

export type Field =
  | 'relatedPolicyIds' // on debates
  | 'relatedDebateIds'; // on policies

export interface QueueCandidate {
  /** id of the candidate target entity (policy or debate). */
  targetId: string;
  /** Display title of the target (English; the CLI is English-only). */
  targetTitle: string;
  confidence: Confidence;
  signals: Signal[];
}

export interface QueueEntry {
  /** id of the anchor entity (debate or policy). */
  id: string;
  title: string;
  date: string;
  /** Speakers / authors / champions, for at-a-glance context in the CLI. */
  contextPersonIds: string[];
  /** The empty-field state at the moment of queue generation. Used by apply
   *  to detect drift (someone hand-edited the file in the meantime). */
  current: string[];
  candidates: QueueCandidate[];
  /** Filled by the interactive review step. */
  decision: { accepted: string[]; rejected: string[] } | null;
  reviewedAt: string | null;
}

export interface QueueFile {
  domain: Domain;
  field: Field;
  generatedAt: string;
  /** Optional cap that was applied at generation time. */
  limit: number | null;
  stats: {
    total: number;
    reviewed: number;
    accepted: number;
    skipped: number;
  };
  entries: QueueEntry[];
}

export const QUEUE_DIR = 'scripts/data-relations/queue';

export function queueFilename(domain: Domain, field: Field, dateIso?: string): string {
  const date = (dateIso || new Date().toISOString().slice(0, 10)).replace(/-/g, '-');
  return `${domain}-${field}-${date}.json`;
}

export function queuePath(filename: string): string {
  return join(QUEUE_DIR, filename);
}

export function readQueue(path: string): QueueFile {
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as QueueFile;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') throw new Error(`queue not found: ${path}`);
    throw err;
  }
}

export function writeQueue(path: string, queue: QueueFile): void {
  writeFileSync(path, JSON.stringify(queue, null, 2) + '\n');
}

export function recomputeStats(queue: QueueFile): QueueFile['stats'] {
  const total = queue.entries.length;
  let reviewed = 0;
  let accepted = 0;
  let skipped = 0;
  for (const entry of queue.entries) {
    if (entry.decision === null) continue;
    reviewed += 1;
    if (entry.decision.accepted.length > 0) accepted += 1;
    else skipped += 1;
  }
  return { total, reviewed, accepted, skipped };
}

/** Enumerate every queue JSON file in the queue dir, newest first. */
export function listQueueFiles(): string[] {
  let files: string[];
  try {
    files = readdirSync(QUEUE_DIR).filter((f) => f.endsWith('.json'));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  files.sort((a, b) => statSync(join(QUEUE_DIR, b)).mtimeMs - statSync(join(QUEUE_DIR, a)).mtimeMs);
  return files.map((f) => join(QUEUE_DIR, f));
}

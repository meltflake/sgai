// scripts/refresh/signals/candidates.ts
// Candidate backlog between runs. RSS feeds keep only their newest items
// (Business Times ~16, CNA latest-news ~20 — hours to a few days), so the
// weekly run saw a sliver of the week (2026-10-21: 4 in-window items). A
// daily `run.ts --collect-only` merges each scan into
// scripts/refresh/signals/data/candidates.json; the weekly run judges the
// whole backlog. Entries age out after keepDays.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { normalizeUrl } from '../../lib/scan-filters.ts';
import type { SignalCandidate } from './scan.ts';

export interface StoredCandidate extends SignalCandidate {
  /** YYYY-MM-DD the candidate was first collected. */
  firstSeen: string;
}

const DAY = 86_400_000;

function age(date: string, today: string): number {
  return (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / DAY;
}

export function mergeCandidates(
  stored: StoredCandidate[],
  fresh: SignalCandidate[],
  today: string,
  keepDays: number
): StoredCandidate[] {
  const byKey = new Map<string, StoredCandidate>();
  for (const s of stored) byKey.set(normalizeUrl(s.url), s);
  for (const f of fresh) {
    const key = normalizeUrl(f.url);
    const prev = byKey.get(key);
    if (!prev) byKey.set(key, { ...f, firstSeen: today });
    else
      byKey.set(key, {
        ...prev,
        title: prev.title || f.title,
        hintedDate: prev.hintedDate ?? f.hintedDate,
      });
  }
  return [...byKey.values()].filter((s) => age(s.hintedDate ?? s.firstSeen, today) <= keepDays);
}

export function loadCandidates(path: string): StoredCandidate[] {
  if (!existsSync(path)) return [];
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    return Array.isArray(raw) ? (raw as StoredCandidate[]).filter((x) => x && typeof x.url === 'string') : [];
  } catch {
    return [];
  }
}

export function saveCandidates(path: string, list: StoredCandidate[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(list, null, 2) + '\n');
}

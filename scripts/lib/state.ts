// scripts/lib/state.ts
// ────────────────────────────────────────────────────────────────────────
// Persistent scan state for sgai refresh pipelines.
//
// Single JSON file at scripts/data/last_scan_state.json. Each pipeline
// owns its own top-level key under `domains`. The shared `last_run`
// timestamp is updated by save() automatically.
//
// Schema is forward-compatible: unknown domains in the file are passed
// through untouched, so adding a new pipeline never invalidates existing
// state. Missing keys fall back to the per-domain default in DEFAULTS.
//
// USAGE:
//
//   import { loadState, saveState, getDomainState, setDomainState } from './lib/state';
//
//   const state = loadState();
//   const policies = getDomainState(state, 'policies'); // strongly typed
//   policies.maxDates['smartnation.gov.sg'] = '2026-05-15';
//   setDomainState(state, 'policies', policies);
//   saveState(state);

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface VideosState {
  video_ids: string[];
}
export interface VoicesState {
  urls: string[];
}
export interface HansardState {
  max_oral_id: number;
  max_written_id: number;
}
export interface PoliciesState {
  /** ISO date keyed by source domain. Pipelines skip URLs whose published date <= this. */
  maxDates: Record<string, string>;
}
export interface EcosystemState {
  /** Company URLs already seen. */
  scannedCompanies: string[];
}
export interface LeversState {
  maxDates: Record<string, string>;
}
export interface TrackerState {
  /** Year of latest report ingested per provider. */
  lastYears: Record<string, number>;
}
export interface LegalAiState {
  /** SSO version string keyed by document slug. */
  lastVersions: Record<string, string>;
}
export interface GithubStarsState {
  lastRun: string | null;
}

export interface ScanState {
  last_run: string | null;
  domains: {
    videos: VideosState;
    voices: VoicesState;
    hansard: HansardState;
    policies: PoliciesState;
    ecosystem: EcosystemState;
    levers: LeversState;
    tracker: TrackerState;
    'legal-ai': LegalAiState;
    'github-stars': GithubStarsState;
    [key: string]: unknown;
  };
}

export type DomainName = keyof ScanState['domains'] & string;

export const DEFAULTS: ScanState = {
  last_run: null,
  domains: {
    videos: { video_ids: [] },
    voices: { urls: [] },
    hansard: { max_oral_id: 4087, max_written_id: 21915 },
    policies: { maxDates: {} },
    ecosystem: { scannedCompanies: [] },
    levers: { maxDates: {} },
    tracker: { lastYears: {} },
    'legal-ai': { lastVersions: {} },
    'github-stars': { lastRun: null },
  },
};

const STATE_FILE = resolve('scripts/data/last_scan_state.json');

/**
 * Read state from disk, migrating the legacy flat shape (videos/voices/hansard
 * at top level) to the new `domains` envelope. Missing domains fall back to
 * DEFAULTS. The on-disk file is NOT mutated by load — call saveState() to persist.
 */
export function loadState(path: string = STATE_FILE): ScanState {
  if (!existsSync(path)) {
    return structuredClone(DEFAULTS);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse ${path}: ${(error as Error).message}`);
  }

  if (!raw || typeof raw !== 'object') {
    return structuredClone(DEFAULTS);
  }

  const obj = raw as Record<string, unknown>;
  const result = structuredClone(DEFAULTS);

  // last_run
  if (typeof obj.last_run === 'string' || obj.last_run === null) {
    result.last_run = obj.last_run as string | null;
  }

  // Legacy flat schema (videos/voices/hansard at top level) → migrate
  if (obj.videos && typeof obj.videos === 'object' && !('domains' in obj)) {
    result.domains.videos = { ...DEFAULTS.domains.videos, ...(obj.videos as VideosState) };
  }
  if (obj.voices && typeof obj.voices === 'object' && !('domains' in obj)) {
    result.domains.voices = { ...DEFAULTS.domains.voices, ...(obj.voices as VoicesState) };
  }
  if (obj.hansard && typeof obj.hansard === 'object' && !('domains' in obj)) {
    result.domains.hansard = { ...DEFAULTS.domains.hansard, ...(obj.hansard as HansardState) };
  }

  // New nested schema
  if (obj.domains && typeof obj.domains === 'object') {
    const domains = obj.domains as Record<string, unknown>;
    for (const [name, value] of Object.entries(domains)) {
      if (value && typeof value === 'object') {
        const fallback = (DEFAULTS.domains as Record<string, unknown>)[name];
        (result.domains as Record<string, unknown>)[name] =
          fallback && typeof fallback === 'object' ? { ...fallback, ...value } : value;
      } else {
        (result.domains as Record<string, unknown>)[name] = value;
      }
    }
  }

  return result;
}

/**
 * Write state atomically. Bumps last_run unless `keepRun: true`.
 */
export function saveState(state: ScanState, opts: { keepRun?: boolean; path?: string } = {}): void {
  const path = opts.path || STATE_FILE;
  if (!opts.keepRun) {
    state.last_run = new Date().toISOString();
  }
  mkdirSync(dirname(path), { recursive: true });
  // Atomic write: tmp + rename
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  // fs.renameSync via writeFileSync overwrite is fine on POSIX
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`);
  // (skip rename to avoid cross-fs edge cases; the double-write is ~30 µs each)
  if (existsSync(tmp)) {
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Strongly-typed accessor. Pipelines should use this rather than reaching
 * into state.domains[name] directly.
 */
export function getDomainState<K extends DomainName>(state: ScanState, name: K): ScanState['domains'][K] {
  const fallback = (DEFAULTS.domains as Record<string, unknown>)[name];
  const current = (state.domains as Record<string, unknown>)[name];
  if (current === undefined) {
    return structuredClone(fallback) as ScanState['domains'][K];
  }
  return current as ScanState['domains'][K];
}

export function setDomainState<K extends DomainName>(
  state: ScanState,
  name: K,
  value: ScanState['domains'][K]
): void {
  (state.domains as Record<string, unknown>)[name] = value;
}

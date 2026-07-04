// scripts/evals/coverage-audit/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the "silently-uncovered data file" bug class. auto_update.py is a
// dispatcher: the slice of the site it can ever refresh equals the pipelines
// listed in scripts/refresh/registry.json. Nothing ever asserted that every
// src/data/*.ts is actually owned by SOME pipeline — so a new data file (=
// a new page) lands with zero refresh coverage and no alarm, and the human-
// maintained docs/refresh-playbook.md drifts out of sync (it labelled
// startups/talent/tracker/benchmarking "❌ 无 pipeline" long after they shipped).
//
// This eval makes registry.json the single machine-checked source of truth:
//   accounted = ∪(pipeline.targets) ∪ {editorial[].file}
// and asserts:
//   (a) every src/data/*.ts is accounted for           → else an orphan FAIL
//   (b) every target / editorial path exists on disk     → else a stale FAIL
// (b) is what keeps the manifest honest after a file is renamed or deleted.
//
// This is a full-state check (no git diff), so it needs no --base. It runs
// weekly via scripts/evals/run-all.ts and as a CI hard gate via
// `npm run eval:coverage-audit`.
//
// Flags:
//   --dry-run    Skip writing the JSON/MD report
//   --help       Usage
//
// Exit codes:
//   0 — every data file accounted, manifest clean
//   1 — at least one orphan data file or stale manifest entry
//   2 — invocation / setup error (registry unreadable, src/data missing)

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const REGISTRY = join(REPO_ROOT, 'scripts/refresh/registry.json');
const DATA_DIR = 'src/data';
const REPORT_DIR = join(import.meta.dirname, 'reports');

interface CliOptions {
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { dryRun: false };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:coverage-audit [--dry-run]\n' +
          '\nAsserts every src/data/*.ts is a pipeline `targets` entry or an `editorial`\n' +
          'entry in scripts/refresh/registry.json, and that no manifest path is stale.\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

export interface RegistryShape {
  pipelines?: Array<{ id?: string; targets?: string[] }>;
  editorial?: Array<{ file?: string; reason?: string; owner?: string }>;
}

export interface CoverageResult {
  dataFiles: string[]; // all src/data/*.ts, repo-relative
  accounted: string[]; // union of pipeline targets + editorial files (sorted, deduped)
  orphans: string[]; // data files with no owner
  staleManifest: Array<{ path: string; source: string }>; // manifest paths not on disk
}

/**
 * Pure coverage computation. `existsOnDisk` takes a repo-relative path so the
 * stale-manifest check is injectable (unit tests pass a fake; main() passes
 * an fs-backed predicate). No fs / process access here.
 */
export function auditCoverage(
  registry: RegistryShape,
  dataFiles: string[],
  existsOnDisk: (repoRelPath: string) => boolean,
): CoverageResult {
  const targetEntries: Array<{ path: string; source: string }> = [];
  for (const p of registry.pipelines ?? []) {
    for (const t of p.targets ?? []) {
      targetEntries.push({ path: t, source: `pipeline:${p.id ?? '?'}` });
    }
  }
  for (const e of registry.editorial ?? []) {
    if (e.file) targetEntries.push({ path: e.file, source: 'editorial' });
  }

  const accounted = [...new Set(targetEntries.map((e) => e.path))].sort();
  const accountedSet = new Set(accounted);

  const orphans = dataFiles.filter((f) => !accountedSet.has(f)).sort();
  const staleManifest = targetEntries
    .filter((e) => !existsOnDisk(e.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  return { dataFiles: [...dataFiles].sort(), accounted, orphans, staleManifest };
}

function listDataFiles(): string[] {
  const abs = join(REPO_ROOT, DATA_DIR);
  if (!existsSync(abs)) throw new Error(`${DATA_DIR} not found at ${abs}`);
  return readdirSync(abs)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .map((f) => `${DATA_DIR}/${f}`);
}

function loadRegistry(): RegistryShape {
  if (!existsSync(REGISTRY)) throw new Error(`registry not found at ${REGISTRY}`);
  return JSON.parse(readFileSync(REGISTRY, 'utf8')) as RegistryShape;
}

function writeReport(result: CoverageResult) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fail = result.orphans.length + result.staleManifest.length;
  writeFileSync(
    join(REPORT_DIR, `report-${stamp}.json`),
    JSON.stringify({ generatedAt: new Date().toISOString(), ...result, fail }, null, 2) + '\n',
  );
  const lines = [
    `# Coverage Audit Report — ${stamp}`,
    '',
    `Data files: ${result.dataFiles.length} · accounted manifest paths: ${result.accounted.length}`,
    `**Orphans: ${result.orphans.length} · stale manifest: ${result.staleManifest.length}**`,
    '',
  ];
  if (result.orphans.length) {
    lines.push('## Orphan data files (no pipeline target, not on editorial list)', '');
    for (const o of result.orphans) lines.push(`- \`${o}\``);
    lines.push(
      '',
      '> Fix: add this file to some pipeline `targets[]` in scripts/refresh/registry.json,',
      '> or register it under top-level `editorial` with a reason.',
      '',
    );
  }
  if (result.staleManifest.length) {
    lines.push('## Stale manifest entries (path no longer on disk)', '');
    for (const s of result.staleManifest) lines.push(`- \`${s.path}\` (${s.source})`);
    lines.push('', '> Fix: the file was renamed/removed — update its registry entry.', '');
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

function main() {
  const opts = parseCli(process.argv.slice(2));
  let result: CoverageResult;
  try {
    const registry = loadRegistry();
    const dataFiles = listDataFiles();
    result = auditCoverage(registry, dataFiles, (p) => existsSync(join(REPO_ROOT, p)));
  } catch (err) {
    process.stderr.write(`[coverage-audit] setup error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  }

  const fail = result.orphans.length + result.staleManifest.length;
  process.stdout.write(
    `[coverage-audit] data files: ${result.dataFiles.length}, accounted: ${result.accounted.length}, ` +
      `orphans: ${result.orphans.length}, stale: ${result.staleManifest.length}\n`,
  );
  if (result.orphans.length) {
    process.stdout.write('\n[coverage-audit] ORPHAN data files (no refresh pipeline, not on editorial list):\n');
    for (const o of result.orphans) {
      process.stdout.write(`  ${o}\n`);
    }
    process.stdout.write(
      '  → add to a pipeline `targets[]` or top-level `editorial` in scripts/refresh/registry.json\n',
    );
  }
  if (result.staleManifest.length) {
    process.stdout.write('\n[coverage-audit] STALE manifest entries (path not on disk):\n');
    for (const s of result.staleManifest) {
      process.stdout.write(`  ${s.path}  (${s.source})\n`);
    }
    process.stdout.write('  → file renamed/removed; fix its registry entry\n');
  }

  if (!opts.dryRun) writeReport(result);
  process.exit(fail > 0 ? 1 : 0);
}

// Run as CLI only — importing this module (e.g. from a unit test) must not
// fire fs / writeReport / process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('coverage-audit/check.ts')) {
  main();
}

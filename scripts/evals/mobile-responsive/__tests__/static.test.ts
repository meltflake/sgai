// scripts/evals/mobile-responsive/__tests__/static.test.ts
// ────────────────────────────────────────────────────────────────────────
// Behavioural contract for the mobile-responsive eval's static detector.
//
// The static layer is a regex scan of literal `class="…"` values. It must:
//   - WARN (not fail) on a bare `grid-cols-N` (N>=2) with no breakpoint prefix.
//     It is only a smell: a regex can't tell a card grid from a legit chart /
//     col-span grid, so the render layer owns the real verdict. Viewport meta
//     is the sole hard FAIL.
//   - Emit NOTHING once a mobile default + breakpoint prefix guard the grid.
//   - WARN on oversized min-w/w arbitraries.
//   - Confirm the viewport meta guard accepts a correct tag and rejects a
//     missing/malformed one.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { detectClassFindings, hasViewportMeta } from '../check.ts';

const FILE = 'src/pages/test.astro';

const rules = (src: string) => detectClassFindings(FILE, src).map((f) => `${f.severity}:${f.rule}`);

// ── 1. bare grid-cols-3 → WARN (render layer owns the real verdict) ───────
test('bare grid-cols-3 (no breakpoint prefix) WARNs', () => {
  const findings = detectClassFindings(FILE, '<div class="grid grid-cols-3 gap-4 mb-10">');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warn');
  assert.equal(findings[0].rule, 'bare-grid-cols');
  assert.equal(findings[0].snippet, 'grid-cols-3');
});

// ── 1b. bare grid-cols-12 (chart) also only WARNs, never fails ────────────
test('bare grid-cols-12 WARNs, not fails (could be a chart)', () => {
  const findings = detectClassFindings(FILE, '<div class="grid grid-cols-12 gap-1">');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warn');
});

// ── 2. mobile-first grid → PASS (no findings) ─────────────────────────────
test('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 produces NO findings', () => {
  assert.deepEqual(rules('<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">'), []);
});

// ── 3. a breakpoint-guarded multi-col alone → PASS ────────────────────────
test('md:grid-cols-4 alone (mobile falls back to 1 col) produces NO findings', () => {
  assert.deepEqual(rules('<div class="grid md:grid-cols-4">'), []);
});

// ── 4. bare grid-cols-2 → WARN, not FAIL ──────────────────────────────────
test('bare grid-cols-2 WARNs (not fail)', () => {
  const findings = detectClassFindings(FILE, '<div class="grid grid-cols-2 gap-3">');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warn');
  assert.equal(findings[0].rule, 'bare-grid-cols-2');
});

// ── 5. large min-w-[900px] → WARN ─────────────────────────────────────────
test('min-w-[900px] WARNs (larger than 375px viewport)', () => {
  const findings = detectClassFindings(FILE, '<table class="w-full min-w-[900px]">');
  const warn = findings.find((f) => f.rule === 'large-min-w');
  assert.ok(warn, 'expected a large-min-w warning');
  assert.equal(warn!.severity, 'warn');
});

// ── 6. small min-w under the viewport → no finding ────────────────────────
test('min-w-[120px] (under viewport) produces NO finding', () => {
  assert.deepEqual(rules('<span class="min-w-[120px]">'), []);
});

// ── 7. large fixed w-[Npx] → WARN ─────────────────────────────────────────
test('w-[600px] WARNs (wider than viewport, non-fluid)', () => {
  const findings = detectClassFindings(FILE, '<div class="w-[600px]">');
  const warn = findings.find((f) => f.rule === 'large-fixed-w');
  assert.ok(warn, 'expected a large-fixed-w warning');
});

// ── 8. custom width threshold respected ───────────────────────────────────
test('width option shifts the min-w threshold', () => {
  // 900px min-w is fine when we declare a 1000px viewport.
  assert.deepEqual(detectClassFindings(FILE, '<table class="min-w-[900px]">', { width: 1000 }), []);
});

// ── 9. single-quoted class attributes are scanned too ─────────────────────
test("single-quoted class='…' is scanned", () => {
  const findings = detectClassFindings(FILE, "<div class='grid grid-cols-3'>");
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, 'bare-grid-cols');
});

// ── 10. correct line number is reported ───────────────────────────────────
test('reports the 1-based line of the offending class', () => {
  const src = 'line1\nline2\n<div class="grid-cols-3">\n';
  assert.equal(detectClassFindings(FILE, src)[0].line, 3);
});

// ── 11. viewport meta guard ───────────────────────────────────────────────
test('hasViewportMeta accepts a correct tag', () => {
  assert.equal(
    hasViewportMeta('<meta name="viewport" content="width=device-width, initial-scale=1.0" />'),
    true,
  );
});

test('hasViewportMeta rejects a missing tag', () => {
  assert.equal(hasViewportMeta('<meta charset="utf-8" />'), false);
});

test('hasViewportMeta rejects a malformed tag (no width=device-width)', () => {
  assert.equal(hasViewportMeta('<meta name="viewport" content="initial-scale=1.0" />'), false);
});

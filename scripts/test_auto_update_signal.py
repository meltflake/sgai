#!/usr/bin/env python3
"""Unit tests for auto_update.py's failure-signal extraction and issue
rendering.

Run manually (same precedent as videos/test_scan_matching.py — not wired
into CI):

    cd scripts && python3 -m unittest test_auto_update_signal -v

Guards the three defects behind issues #134/#138/#162/#165 (the same bug
shipped three times):
  1. npm notice/warn stderr noise must never displace the real error.
  2. The stdout `=== Eval Summary ===` block must be harvested even when
     stderr is non-empty after filtering.
  3. The signal must keep its TAIL (errors live at the end), never be
     head-truncated.
Plus the <pre> → fenced-block rendering that keeps multi-line signals
readable (and angle-bracket-safe) in the GitHub issue body.
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from auto_update import extract_failure_signal, html_to_markdown  # noqa: E402

NPM_NOISE = (
    "npm notice\n"
    "npm notice New minor version of npm available! 11.8.0 -> 11.18.0\n"
    "npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.18.0\n"
    "npm notice To update run: npm install -g npm@11.18.0\n"
    "npm notice\n"
    "npm warn Unknown project config \"shamefully-hoist\".\n"
)


class ExtractFailureSignalTest(unittest.TestCase):
    def test_noise_only_stderr_falls_through_to_stdout_fails(self):
        """Issue #165 fixture: stderr is pure npm chatter, stdout has the
        real [FAIL] lines — the old code reported only the chatter."""
        stdout = "some progress line\n[FAIL] url-health\n[FAIL] transcript-quality\n"
        signal = extract_failure_signal(1, stdout, NPM_NOISE)
        self.assertIn("[FAIL] url-health", signal)
        self.assertIn("[FAIL] transcript-quality", signal)
        self.assertNotIn("npm notice", signal)
        self.assertNotIn("npm warn", signal)

    def test_eval_summary_block_harvested_even_with_real_stderr(self):
        """The summary block must appear even when stderr carries a real
        (non-npm) error too — no either/or gating."""
        stdout = (
            "=== url-health ===\n"
            "scanning...\n"
            "=== Eval Summary ===\n"
            "  [FAIL] url-health\n"
            "  [PASS] i18n-coverage:layer-a\n"
        )
        stderr = NPM_NOISE + "Error: fetch failed after 3 retries\n"
        signal = extract_failure_signal(1, stdout, stderr)
        self.assertIn("=== Eval Summary ===", signal)
        self.assertIn("[FAIL] url-health", signal)
        self.assertIn("[PASS] i18n-coverage:layer-a", signal)
        self.assertIn("Error: fetch failed after 3 retries", signal)
        self.assertNotIn("npm notice", signal)

    def test_tail_kept_not_head(self):
        """A long stream must keep its END — the old [:300] head slice is
        exactly how three npm notice lines hid every real error."""
        filler = "\n".join(f"progress step {i}" for i in range(400))
        stdout = filler + "\nTypeError: cannot read properties of undefined\n"
        signal = extract_failure_signal(1, stdout, "")
        self.assertIn("TypeError: cannot read properties of undefined", signal)
        self.assertLessEqual(len(signal), 1600)

    def test_empty_streams_degrade_gracefully(self):
        signal = extract_failure_signal(2, "", "")
        self.assertTrue(signal.startswith("exit 2:"))

    def test_exit_code_always_present(self):
        signal = extract_failure_signal(137, "", NPM_NOISE)
        self.assertTrue(signal.startswith("exit 137:"))
        self.assertNotIn("npm notice", signal)


class PreRenderingTest(unittest.TestCase):
    def test_pre_becomes_fenced_block_and_keeps_angle_brackets(self):
        html = (
            "<h3>[evals] ⚠ failed</h3>"
            "<pre>exit 1: === Eval Summary ===\n"
            "  [FAIL] url-health\n"
            "Type &#x27;undefined&#x27; is not assignable to type &lt;string&gt;</pre>"
        )
        md = html_to_markdown(html)
        self.assertIn("```", md)
        self.assertIn("[FAIL] url-health", md)
        # Angle-bracket fragment survives the generic tag-stripper.
        self.assertIn("<string>", md)
        # Newlines inside the fence survive (multi-line signal readable).
        self.assertIn("=== Eval Summary ===\n  [FAIL] url-health", md)

    def test_li_with_attributes_still_becomes_bullet(self):
        md = html_to_markdown("<ul>  <li style='color:red'>legacy item</li></ul>")
        self.assertIn("- legacy item", md)


if __name__ == "__main__":
    unittest.main()

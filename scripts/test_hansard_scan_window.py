#!/usr/bin/env python3
"""Unit tests for the Hansard scan window.

Run manually (same precedent as test_auto_update_signal.py — not wired
into CI):

    cd scripts && python3 -m unittest test_hansard_scan_window -v

Guards the 2026-09-21 miss: the 8-10 Sep 2026 sitting used written-answer
ids 24171..24897, but the scan stopped at a fixed 300-id window (24470), so
half the sitting's AI items were never reported.
"""

import logging
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).parent))

import auto_update  # noqa: E402

LOG = logging.getLogger("test")


def fake_range(existing_ids):
    """Stand-in for scan_hansard_range over a fixed set of existing ids."""

    def scan(prefix, start, end, logger):
        return [
            {"id": f"{prefix}-{i}", "title": "t", "date": "", "ai_related": False}
            for i in range(start + 1, end + 1)
            if i in existing_ids
        ]

    return scan


class ScanWindowTest(unittest.TestCase):
    def test_extends_while_ids_reach_window_tail(self):
        ids = set(range(101, 830, 3))  # one sitting spanning ~730 ids
        with mock.patch.object(auto_update, "scan_hansard_range", fake_range(ids)):
            results = auto_update.scan_hansard_window("written-answer", 100, 300, LOG)
        self.assertEqual(max(int(r["id"].split("-")[-1]) for r in results), max(ids))

    def test_single_window_when_sitting_ends_early(self):
        ids = set(range(101, 180))
        calls = []

        def scan(prefix, start, end, logger):
            calls.append((start, end))
            return fake_range(ids)(prefix, start, end, logger)

        with mock.patch.object(auto_update, "scan_hansard_range", scan):
            results = auto_update.scan_hansard_window("written-answer", 100, 300, LOG)
        self.assertEqual(len(results), len(ids))
        self.assertEqual(calls, [(100, 400)])

    def test_window_count_is_capped(self):
        ids = set(range(1, 100_000))
        with mock.patch.object(auto_update, "scan_hansard_range", fake_range(ids)):
            results = auto_update.scan_hansard_window("written-answer", 0, 10, LOG)
        self.assertEqual(len(results), 10 * auto_update.HANSARD_MAX_WINDOWS)


if __name__ == "__main__":
    unittest.main()

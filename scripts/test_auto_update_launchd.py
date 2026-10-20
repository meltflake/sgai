#!/usr/bin/env python3
"""Unit tests for auto_update.py's launchd schedule (2026-10-21).

Run manually (same precedent as test_auto_update_signal.py):

    cd scripts && python3 -m unittest test_auto_update_launchd -v

Why launchd and not cron: a cron job runs outside the user's login session,
so the login keychain (where the claude CLI keeps its login since
2026-10-01) is not on its search list, and cron never runs a job missed
while the Mac slept. A LaunchAgent runs in the login session and fires a
missed StartCalendarInterval job on wake.
"""

import plistlib
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import auto_update as au  # noqa: E402


class BuildPlistTest(unittest.TestCase):
    def test_pipeline_agent(self):
        d = plistlib.loads(au.build_launchd_plist("pipeline", hour=8, path="/a:/b"))
        self.assertEqual(d["Label"], "com.sgai.auto-update")
        self.assertEqual(d["StartCalendarInterval"], {"Hour": 8, "Minute": 0})
        self.assertFalse(d.get("RunAtLoad", False))  # install must not start a run
        self.assertEqual(d["WorkingDirectory"], str(au.PROJECT_ROOT))
        self.assertEqual(d["ProgramArguments"][-1], "--due")
        self.assertEqual(d["ProgramArguments"][0], sys.executable)
        self.assertEqual(d["EnvironmentVariables"]["PATH"], "/a:/b")
        self.assertTrue(d["StandardOutPath"].endswith("cron.log"))

    def test_doctor_agent_runs_ten_minutes_before_without_run_at_load(self):
        d = plistlib.loads(au.build_launchd_plist("doctor", hour=8, path="/a"))
        self.assertEqual(d["Label"], "com.sgai.doctor")
        self.assertEqual(d["StartCalendarInterval"], {"Hour": 7, "Minute": 50})
        self.assertFalse(d.get("RunAtLoad", False))
        self.assertTrue(d["ProgramArguments"][-1].endswith("doctor-cron.sh"))


class StripLegacyCronTest(unittest.TestCase):
    def test_removes_managed_block_and_doctor_line_only(self):
        tab = "\n".join(
            [
                "0 21 * * * other-job",
                "50 7 * * *        /bin/bash /x/sgai/scripts/doctor-cron.sh >> /x/cron.log 2>&1",
                au.CRON_BEGIN,
                "PATH=/a",
                "0 8 * * *  cd /x && py scripts/auto_update.py --due",
                au.CRON_END,
                "5 7 * * * cf-traffic",
            ]
        )
        out = au.strip_legacy_cron(tab)
        self.assertIn("other-job", out)
        self.assertIn("cf-traffic", out)
        self.assertNotIn("doctor-cron.sh", out)
        self.assertNotIn("auto_update.py", out)
        self.assertNotIn(au.CRON_BEGIN, out)


if __name__ == "__main__":
    unittest.main()


class RetryListTest(unittest.TestCase):
    """2026-10-07: policies / ecosystem / research-digest failed on auth but the
    monthly schedule was stamped done, so they would not rerun until November."""

    REG = {
        "pipelines": [
            {"id": "videos", "schedule": "daily", "mode": "auto-pr"},
            {"id": "policies", "schedule": "monthly", "mode": "auto-pr"},
            {"id": "ecosystem", "schedule": "monthly", "mode": "auto-pr"},
            {"id": "evals", "schedule": "weekly", "mode": "issue-on-fail"},
        ]
    }

    def test_failed_pipelines_are_queued_except_issue_on_fail(self):
        results = {
            "videos": {"count": 0},
            "policies": {"count": 0, "error": "exit 1: Not logged in"},
            "evals": {"count": 0, "error": "exit 1: url-health"},
        }
        self.assertEqual(au.next_retry_list(set(), results, self.REG), ["policies"])

    def test_success_clears_and_untouched_entries_stay(self):
        results = {"policies": {"count": 2}}
        self.assertEqual(au.next_retry_list({"policies", "ecosystem"}, results, self.REG), ["ecosystem"])

    def test_retries_are_appended_once_and_unknown_ids_dropped(self):
        selected = [{"id": "videos"}]
        out = au.add_retries(selected, self.REG, {"policies", "videos", "gone"})
        self.assertEqual([e["id"] for e in out], ["videos", "policies"])


class MergeStateTest(unittest.TestCase):
    """2026-10-21: the dispatcher held the state read at start and wrote it
    back at the end, erasing domain state the TS pipelines saved meanwhile."""

    def test_disk_domains_win_except_python_owned(self):
        memory = {
            "schedule_runs": {"daily": "new"},
            "domains": {"hansard": {"max_oral_id": 9}, "videos": {"video_ids": []}},
        }
        disk = {
            "schedule_runs": {"daily": "old"},
            "domains": {"hansard": {"max_oral_id": 1}, "videos": {"video_ids": ["x"]}, "signals": {"k": 1}},
        }
        out = au.merge_state_for_save(memory, disk, owned={"hansard"})
        self.assertEqual(out["domains"]["hansard"], {"max_oral_id": 9})
        self.assertEqual(out["domains"]["videos"], {"video_ids": ["x"]})
        self.assertEqual(out["domains"]["signals"], {"k": 1})
        self.assertEqual(out["schedule_runs"], {"daily": "new"})

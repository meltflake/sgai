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

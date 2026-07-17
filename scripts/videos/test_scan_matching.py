#!/usr/bin/env python3
"""Regression tests for the two-tier AI video matcher in 01_scan_channels.py.

Run: python3 scripts/videos/test_scan_matching.py

No pytest dependency — plain asserts, prints a summary, exits non-zero on
failure. Guards against the 2026-07 false-positive class where news/government
video *descriptions* incidentally mention "AI" and dragged non-AI clips
(Tharman press doorstop, Future of Transport, GovTech layoffs, GDP figures)
into the human review queue.
"""

import importlib.util
import sys
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "scan_channels", Path(__file__).parent / "01_scan_channels.py"
)
scan = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(scan)
is_ai_video = scan.is_ai_video

# (title, description, channel, expected, why)
CASES = [
    # ── False positives that MUST now be rejected ──────────────────────────
    # title carries no AI term; description only mentions "AI" in passing.
    (
        "Tharman speaks to media after Malaysia state visit",
        "The President touched on bilateral trade and the role of AI in the region.",
        "ST",
        False,
        "bare AI only in description, not title",
    ),
    (
        "How will the recent plans for the Future of Transport affect us?",
        "New autonomous systems and AI could reshape how we move around.",
        "govsg",
        False,
        "bare AI only in description",
    ),
    (
        "GovTech to shed up to 9% of workforce in phased exercise",
        "The agency restructures around automation and AI adoption.",
        "CNA",
        False,
        "bare AI only in description",
    ),
    (
        "Analysts expect full-year GDP at 4.3%, higher than earlier estimates",
        "Economists cite resilient exports and services.",
        "CNA",
        False,
        "no AI term anywhere",
    ),
    (
        "Showcase and heritage trails of heartland merchants",
        "A robot mascot greeted visitors at the launch.",
        "CNA",
        False,
        "'robot' only in description (weak, title-only)",
    ),
    (
        "Industrial REITs draw fresh investor interest",
        "Analysts point to the data centre boom lifting valuations.",
        "CNA",
        False,
        "'data centre' only in description (weak, title-only)",
    ),
    # ── True positives that MUST still pass ────────────────────────────────
    (
        "World AI Conference: Global AI cooperation body formally launched",
        "",
        "CNA",
        True,
        "bare AI in title (weak-in-title counts)",
    ),
    (
        "China set to unveil vision for role in global AI governance",
        "",
        "CNA",
        True,
        "'ai govern' is a strong term",
    ),
    (
        "Josephine Teo on Singapore's data centre roadmap",
        "",
        "govsg",
        True,
        "'data centre' in title (weak-in-title counts)",
    ),
    (
        "MOH press conference on new diagnostic tools",
        "The ministry unveiled a generative AI system trained on local clinical data.",
        "CNA",
        True,
        "'generative AI' is a strong term — valid description match",
    ),
    (
        "Parliament debates online harms",
        "MPs raised the threat of deepfake videos targeting elections.",
        "govsg",
        True,
        "'deepfake' is a strong term in description",
    ),
    (
        "Some unrelated AI Singapore clip with no keywords",
        "",
        "AISG",
        True,
        "AISG channel bypasses the keyword gate",
    ),
]


def main() -> int:
    failures = []
    for title, desc, ch, expected, why in CASES:
        got = is_ai_video(title, desc, ch)
        status = "ok" if got == expected else "FAIL"
        if got != expected:
            failures.append((title, expected, got, why))
        print(f"  [{status}] want={expected!s:5} got={got!s:5}  {why}  :: {title[:48]!r}")

    print()
    if failures:
        print(f"{len(failures)} FAILED:")
        for title, exp, got, why in failures:
            print(f"  - {title!r}: expected {exp}, got {got} ({why})")
        return 1
    print(f"All {len(CASES)} cases passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

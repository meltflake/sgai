"""Smoke tests for hansard graded classifier.

Run with:  python3 scripts/hansard/test_classify.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from classify import classify, is_ai_related  # noqa: E402


def expect(label: str, actual_bucket: str, expected_buckets: tuple[str, ...]) -> bool:
    ok = actual_bucket in expected_buckets
    mark = "✓" if ok else "✗"
    print(f"  {mark} {label}: bucket={actual_bucket}, expected one of {expected_buckets}")
    return ok


def main() -> int:
    failures = 0

    # ── STRONG hits — clear AI signal ──────────────────────────────────
    print("\n[STRONG cases]")

    bucket, *_ = classify(
        "Mandatory Government Security Vetting for Personnel with Access to "
        "Singapore's Critical Information Infrastructure",
        "The Workers' Party asked about CII personnel and AI vendor risk.",
    )
    if not expect("CII title (oral-4117)", bucket, ("STRONG",)):
        failures += 1

    bucket, *_ = classify(
        "Alternative Singpass Identity Options Apart from Facial Verification",
        "users with medical conditions cannot use facial recognition technology.",
    )
    if not expect("Singpass facial recognition (oral-4017)", bucket, ("STRONG",)):
        failures += 1

    bucket, *_ = classify(
        "Committee of Supply – Head K (Ministry of Education)",
        "uncertainty and challenges brought about by artificial intelligence (AI) and the existential threat",
    )
    if not expect("MOE COS w/ AI body (budget-2902)", bucket, ("STRONG",)):
        failures += 1

    bucket, *_ = classify(
        "Investigation Findings of Accident Involving Autonomous Vehicle on 17 January 2026",
        "the autonomous vehicle's response when it detected a small object on the road",
    )
    if not expect("Autonomous vehicle accident (written-21932)", bucket, ("STRONG",)):
        failures += 1

    # ── True negatives — must NOT classify as AI ───────────────────────
    print("\n[NO / WEAK cases — must NOT actionably trigger]")

    # Title with "AI" hidden inside other words — case-sensitive \bAI\b excludes
    bucket, *_ = classify("Maintenance of Public Drains in Sengkang", "rainwater drainage capacity remains stable")
    if not expect("'remain'/'available' false-positive guard", bucket, ("NO",)):
        failures += 1

    bucket, *_ = classify(
        "Assessment of Tariff-impact on Singapore's Trade Sectors following US' Section 301 Investigations",
        "global semiconductor capacity and excess production for trade purposes only.",
    )
    # semiconductor alone is INFRA; without strong/weak → INFRA bucket (NOT actionable)
    if not expect("Section 301 semiconductor (no AI angle)", bucket, ("INFRA",)):
        failures += 1
    if is_ai_related(bucket):
        print(f"  ✗ Section 301 wrongly flagged actionable")
        failures += 1

    # Generic gaming-disorder debate that contains "algorithm" but is not AI policy
    bucket, *_ = classify(
        "Community Support Services to Address Gaming Disorder Among Young Adults",
        "concerns about how algorithms engineer addiction in mobile games.",
    )
    # algorithm + online harms + digital → at least WEAK+. Acceptable to flag.
    # The point is it should NOT be STRONG.
    if bucket == "STRONG":
        print(f"  ✗ Gaming disorder wrongly elevated to STRONG: {bucket}")
        failures += 1
    else:
        print(f"  ✓ Gaming disorder kept out of STRONG (got {bucket})")

    # ── INFRA+ promotion — co-occurrence boosts data-centre debates ────
    print("\n[INFRA promotion cases]")

    bucket, *_ = classify(
        "Energy Demand of New Data Centres in Singapore",
        "GPU clusters at the new data centre will support sovereign compute capacity.",
    )
    if not expect("Data centre + GPU + sovereign → INFRA+", bucket, ("STRONG", "INFRA+")):
        failures += 1

    # ── case-sensitivity guard — '\bAI\b' must NOT match 'ai' inside words
    print("\n[Case-sensitivity guard]")

    bucket, *_ = classify(
        "Maintaining Drainage Capacity in Bukit Panjang",
        "the contractor will obtain available certifications and remain compliant.",
    )
    if not expect("obtain/available/remain — must not hit", bucket, ("NO",)):
        failures += 1

    # ── Backward-compat shim ───────────────────────────────────────────
    print("\n[Backward-compat shim]")
    from classify import matches_ai_keywords

    if not matches_ai_keywords("AI Strategy 2.0 launches new sovereign compute fund."):
        print("  ✗ matches_ai_keywords missed obvious AI title")
        failures += 1
    else:
        print("  ✓ matches_ai_keywords catches obvious AI title")

    if matches_ai_keywords("Energy demand at data centre", "discussing power supply costs only, no compute angle."):
        # data centre is INFRA alone → NOT actionable
        print("  ✗ matches_ai_keywords wrongly flagged bare INFRA case")
        failures += 1
    else:
        print("  ✓ matches_ai_keywords keeps bare INFRA as not actionable")

    print()
    if failures:
        print(f"FAIL — {failures} assertion(s) failed")
        return 1
    print("PASS — all classifier assertions hold")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

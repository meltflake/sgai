"""Graded keyword classifier for SPRS Hansard scan.

Replaces the flat AI_TITLE_KEYWORDS list with a 3-tier signal model that
significantly cuts false positives (e.g. trade-policy debates that merely
mention "semiconductor" without discussing AI compute) and catches misses
that the flat list lost (e.g. AI in COS / SkillsFuture / Singpass debates
where the title carries no obvious AI token).

Tiers:

    STRONG  — explicit AI / SG-specific AI program / AI-named tech.
              Hit ⇒ classify as AI-related, no co-occurrence required.
    INFRA   — AI compute infrastructure (data centre, GPU, sovereign compute).
              Hit alone is "INFRA" (weaker); INFRA + WEAK or 2× INFRA → "INFRA+".
    WEAK    — adjacent governance tokens (PDPA, IMDA, cybersec, biometric).
              2+ WEAK hits → "WEAK+"; alone is "NO".

Returns a (bucket, strong, infra, weak) tuple where each list element is the
human-readable keyword label that fired. Designed for both auto_update.py
(weekly scan) and any future emit pipeline.

Lessons baked in:
- `\\bAI\\b` is case-sensitive (lowercased text must match `\\bai\\b`); this
  module passes `re.IGNORECASE` to all patterns to be conservative, but the
  word boundary excludes "main", "remain", "domain", "available".
- `autonomous` alone is a WEAK token — `autonomous vehicle/system` promotes
  to STRONG. This avoids matching "autonomous decision" in healthcare and
  legal debates that have nothing to do with AI.
- `algorithm` is WEAK; `algorithmic decision/transparency/bias/governance`
  is STRONG. Same trade.
- `semiconductor` is INFRA, not STRONG — Singapore semiconductor policy
  debates are usually trade/industry, not AI-specific. Promote only when
  co-occurring with another AI signal.

Usage:

    from classify import classify, Bucket

    bucket, strong, infra, weak = classify(title, content)
    if bucket in ('STRONG', 'INFRA+', 'WEAK+'):
        # treat as AI-related
"""

from __future__ import annotations

import re
from typing import Literal

Bucket = Literal["STRONG", "INFRA+", "INFRA", "WEAK+", "NO"]

# Each pattern entry: (compiled_regex, human_label)
PATTERNS_STRONG: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bAI\b"), "AI"),
    (re.compile(r"\bA\.I\."), "A.I."),
    (re.compile(r"artificial intelligence", re.IGNORECASE), "artificial intelligence"),
    (re.compile(r"generative\s*(?:ai|a\.i\.)\b", re.IGNORECASE), "generative AI"),
    (re.compile(r"\bgen[\-\s]?ai\b", re.IGNORECASE), "gen-AI"),
    (re.compile(r"\bLLM[s]?\b"), "LLM"),
    (re.compile(r"large\s+language\s+model", re.IGNORECASE), "large language model"),
    (re.compile(r"foundation\s+model", re.IGNORECASE), "foundation model"),
    (re.compile(r"machine\s+learning", re.IGNORECASE), "machine learning"),
    (re.compile(r"neural\s+network", re.IGNORECASE), "neural network"),
    (re.compile(r"deep\s*fake", re.IGNORECASE), "deepfake"),
    (re.compile(r"\bChatGPT\b|\bClaude\b|\bGemini\b|\bLlama\b"), "named LLM"),
    (re.compile(r"sea[\-\s]?lion", re.IGNORECASE), "Sea-Lion"),
    (
        re.compile(
            r"algorithmic\s+(decision|transparency|bias|accountability|governance|harm)",
            re.IGNORECASE,
        ),
        "algorithmic governance",
    ),
    (
        re.compile(
            r"(autonomous|self[\-\s]driving)\s+(vehicle|car|bus|shuttle|system|driving)",
            re.IGNORECASE,
        ),
        "autonomous vehicle",
    ),
    (re.compile(r"facial?\s+recognition", re.IGNORECASE), "facial recognition"),
    (re.compile(r"synthetic\s+(media|content|image|video)", re.IGNORECASE), "synthetic media"),
    (re.compile(r"computer\s+vision", re.IGNORECASE), "computer vision"),
    (re.compile(r"speech\s+recognition", re.IGNORECASE), "speech recognition"),
    (re.compile(r"natural\s+language\s+processing|\bNLP\b"), "NLP"),
    (re.compile(r"national\s+ai\s+strategy|\bNAIS\b", re.IGNORECASE), "NAIS"),
    (
        re.compile(
            r"ai[\-\s]+(verify|safety|governance|ethics|trust|literacy|talent)",
            re.IGNORECASE,
        ),
        "AI program",
    ),
    (re.compile(r"ai\s+singapore|\bAISG\b", re.IGNORECASE), "AI Singapore"),
    (re.compile(r"transformer\s+model", re.IGNORECASE), "transformer model"),
    (
        re.compile(r"(recommendation|ranking)\s+(algorithm|system|engine)", re.IGNORECASE),
        "recommendation system",
    ),
    (re.compile(r"predictive\s+(analytics|modeling|model)", re.IGNORECASE), "predictive analytics"),
    (re.compile(r"automated\s+(decision|profiling)", re.IGNORECASE), "automated decision"),
    (re.compile(r"\bRPA\b"), "RPA"),
    (re.compile(r"chatbot|chat[\-\s]bot", re.IGNORECASE), "chatbot"),
    # Singapore-specific AI sovereignty / data-residency tokens — these
    # show up in AI-vendor debates whose titles hide the AI angle.
    (
        re.compile(r"critical\s+information\s+infrastructure", re.IGNORECASE),
        "CII (critical information infra)",
    ),
    (re.compile(r"data\s+sovereignty", re.IGNORECASE), "data sovereignty"),
    (re.compile(r"data\s+residency", re.IGNORECASE), "data residency"),
    (re.compile(r"\bCLOUD\s+Act\b"), "CLOUD Act"),
    (re.compile(r"\bagentic\b", re.IGNORECASE), "agentic"),
]

PATTERNS_INFRA: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"data\s+centre|data\s+center", re.IGNORECASE), "data centre"),
    (re.compile(r"\bGPU[s]?\b"), "GPU"),
    (re.compile(r"\bNVIDIA\b", re.IGNORECASE), "NVIDIA"),
    (re.compile(r"\bHBM\b"), "HBM"),
    (re.compile(r"sovereign\s+(compute|ai|model)", re.IGNORECASE), "sovereign compute"),
    (re.compile(r"high[\-\s]performance\s+computing|\bHPC\b", re.IGNORECASE), "HPC"),
    (re.compile(r"quantum\s+(computing|technology|computer)", re.IGNORECASE), "quantum"),
    (
        re.compile(r"cloud\s+(computing|infrastructure|sovereignty|services)", re.IGNORECASE),
        "cloud infra",
    ),
    (re.compile(r"semi[\-\s]?conductor", re.IGNORECASE), "semiconductor"),
    (re.compile(r"\bchip\s+(manufacturing|fabrication|design|foundry)", re.IGNORECASE), "chip industry"),
    (re.compile(r"compute\s+(capacity|infrastructure|resources?)", re.IGNORECASE), "compute infra"),
]

PATTERNS_WEAK: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"smart\s+nation", re.IGNORECASE), "Smart Nation"),
    (re.compile(r"digital\s+(identity|trust|economy|literacy)", re.IGNORECASE), "digital policy"),
    (re.compile(r"\bIMDA\b"), "IMDA"),
    (re.compile(r"\bPDPA\b|personal\s+data\s+protection", re.IGNORECASE), "PDPA"),
    (re.compile(r"cybersecurity|cyber\s+security", re.IGNORECASE), "cybersecurity"),
    (re.compile(r"misinformation|disinformation", re.IGNORECASE), "misinfo/disinfo"),
    (re.compile(r"online\s+(harms?|safety|falsehoods?)", re.IGNORECASE), "online harms"),
    (re.compile(r"biometric", re.IGNORECASE), "biometric"),
    (re.compile(r"\balgorithm[s]?\b(?!ic)", re.IGNORECASE), "algorithm (generic)"),
    (
        re.compile(
            r"autonomous(?!\s+(vehicle|car|bus|shuttle|system|driving))",
            re.IGNORECASE,
        ),
        "autonomous (generic)",
    ),
    (re.compile(r"digital\s+twin", re.IGNORECASE), "digital twin"),
    (re.compile(r"robotic|robot", re.IGNORECASE), "robot"),
    (re.compile(r"\bGovTech\b", re.IGNORECASE), "GovTech"),
]


def _hits(text: str, patterns: list[tuple[re.Pattern[str], str]]) -> list[str]:
    out: set[str] = set()
    for pat, label in patterns:
        if pat.search(text):
            out.add(label)
    return sorted(out)


def classify(title: str, content: str = "", content_window: int = 8000) -> tuple[Bucket, list[str], list[str], list[str]]:
    """Classify a Hansard topic title + content body into one of 5 buckets.

    Args:
        title: SPRS reportTitle.
        content: cleaned (HTML-stripped) body text. Pass the full body or
            an early window — STRONG hits in body still classify the topic.
        content_window: how many chars of body to consider. Default 8000
            balances recall (catch AI mentions in long debates) with
            false-positive risk (later sections often drift off-topic).

    Returns:
        (bucket, strong_hits, infra_hits, weak_hits) where buckets are:
          - "STRONG":  any STRONG signal hit
          - "INFRA+":  ≥1 INFRA + (≥1 WEAK or ≥2 INFRA total)
          - "INFRA":   exactly 1 INFRA hit, no WEAK
          - "WEAK+":   ≥2 WEAK hits, no STRONG/INFRA
          - "NO":      no signals
    """
    blob = title + " " + (content or "")[:content_window]
    strong = _hits(blob, PATTERNS_STRONG)
    infra = _hits(blob, PATTERNS_INFRA)
    weak = _hits(blob, PATTERNS_WEAK)

    if strong:
        return "STRONG", strong, infra, weak
    if infra and (weak or len(infra) >= 2):
        return "INFRA+", strong, infra, weak
    if infra:
        return "INFRA", strong, infra, weak
    if len(weak) >= 2:
        return "WEAK+", strong, infra, weak
    return "NO", strong, infra, weak


def is_ai_related(bucket: Bucket) -> bool:
    """Convenience: which buckets count as actionable AI candidates."""
    return bucket in ("STRONG", "INFRA+", "WEAK+")


# Backward-compat shim for callers that still want a flat boolean.
def matches_ai_keywords(title: str, content: str = "") -> bool:
    bucket, _, _, _ = classify(title, content)
    return is_ai_related(bucket)

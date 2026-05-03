#!/usr/bin/env python3
"""
DEPRECATED — replaced by scripts/refresh/videos/emit.ts on 2026-05-03.

The original interactive Python reviewer asked for every field by hand
and emitted a single-language TS snippet that had to be pasted into
videos.ts manually. It did not produce *En sibling fields, did not
allocate IDs from the existing dataset, did not run prettier, did not
run the i18n-pair source check, and did not open a PR. As a result it
was incompatible with the project's hard rule that every public-facing
zh field must have a populated `*En` sibling in the same commit.

The replacement pipeline:

    npx tsx scripts/refresh/videos/emit.ts --ids=<videoId1>,<videoId2>,...

    Flags:
      --all                  process every candidate in candidates.json
      --dry-run              show generated entries, do not write videos.ts
      --no-commit            write but skip git commit
      --no-push              commit but skip push + PR
      --force                ignore Claude summary cache
      --input=<path>         use a non-default candidates JSON

The new script:
  - reads scripts/videos/data/candidates.json (still produced by 01_scan_channels.py)
  - filters by --ids
  - calls the local Claude CLI to generate bilingual title/summary/topic/
    speaker fields, with a per-videoId cache so re-runs are free
  - normalises known speakers (Lawrence Wong, AI Singapore, CNA, ...) to
    the project's established speakerTitle / speakerType conventions
  - allocates the next vNNN id from current videos.ts max
  - splices entries into the videos array, runs prettier, and runs the
    i18n-pair source check before committing
  - autoCommit + pushAndOpenPR (matches every other refresh pipeline)

If you have a candidates.json from an old workflow that you wanted to
process via this script, run the new emit instead — it accepts the
same input format.
"""

from __future__ import annotations

import sys

DEPRECATION_MESSAGE = (
    "scripts/videos/02_review_and_merge.py is DEPRECATED.\n"
    "Use the bilingual TypeScript emit pipeline instead:\n\n"
    "    npx tsx scripts/refresh/videos/emit.ts --ids=<videoId1,videoId2,...>\n\n"
    "Or to process every candidate:\n\n"
    "    npx tsx scripts/refresh/videos/emit.ts --all\n\n"
    "See scripts/videos/README.md and the file header in emit.ts for full options."
)


def main() -> int:
    print(DEPRECATION_MESSAGE, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())

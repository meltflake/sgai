#!/usr/bin/env python3
"""
将 scripts/voices/data/speeches/*.json 合并为
src/data/speech-transcripts.ts 的 speechTranscripts map。

会保留文件里 helper / interface / 类型的部分（即从 export const speechTranscripts
之前的所有内容），仅替换 map 字面量的内容。

中文译文 / tldr 来自 scripts/voices/data/translations/<id>.json（如果存在）。
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPEECH_TS = ROOT / "src" / "data" / "speech-transcripts.ts"
SPEECHES_DIR = Path(__file__).parent / "data" / "speeches"
TRANSLATIONS_DIR = Path(__file__).parent / "data" / "translations"

# 不规则空白字符：NBSP / 各类 spacing / 零宽 / BOM —— ESLint no-irregular-whitespace 拦
IRREGULAR_WS_CHARS = (
    " "  # NBSP
    " "  # Ogham space mark
    "᠎"  # Mongolian vowel separator
    "           "  # En quad..Hair space
    "​‌‍‎‏"  # Zero-width / LTR / RTL marks
    " "  # Narrow no-break space
    " "  # Medium math space
    "⁠"  # Word joiner
    "　"  # Ideographic space
    "﻿"  # Zero-width no-break (BOM)
)
IRREGULAR_WS_RE = re.compile("[" + IRREGULAR_WS_CHARS + "]")


def clean_paragraph(s: str) -> str:
    s = IRREGULAR_WS_RE.sub(" ", s)
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def ts_string(s: str) -> str:
    """Python str → TS 反引号字符串字面量。"""
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return f"`{s}`"


def ts_array(items: list[str], indent: int) -> str:
    if not items:
        return "[]"
    pad = " " * indent
    inner = ",\n".join(f"{pad}  {ts_string(x)}" for x in items)
    return "[\n" + inner + f"\n{pad}]"


def render_entry(record: dict) -> str:
    sid = record["speechId"]
    src_url = record["sourceUrl"]
    fetched_at = record["fetchedAt"]
    paragraphs_en = [clean_paragraph(p) for p in record["paragraphs"] if clean_paragraph(p)]

    tr_path = TRANSLATIONS_DIR / f"{sid}.json"
    paragraphs: list[str] = []
    tldr = None
    tldr_en = None
    translated_at = None
    translation_source = None
    if tr_path.exists():
        tr = json.loads(tr_path.read_text())
        paragraphs = [clean_paragraph(p) for p in tr.get("paragraphs", []) if clean_paragraph(p)]
        tldr = [clean_paragraph(p) for p in tr.get("tldr", []) if clean_paragraph(p)] or None
        tldr_en = [clean_paragraph(p) for p in tr.get("tldrEn", []) if clean_paragraph(p)] or None
        translated_at = tr.get("translatedAt")
        translation_source = tr.get("translationSource", "claude")

    sid_key = "'" + sid.replace("\\", "\\\\").replace("'", "\\'") + "'"
    lines = [f"  {sid_key}: {{"]
    lines.append(f"    speechId: {ts_string(sid)},")
    lines.append(f"    sourceUrl: {ts_string(src_url)},")
    lines.append(f"    sourceLanguage: 'en',")
    lines.append(f"    fetchedAt: {ts_string(fetched_at)},")
    lines.append(f"    source: 'mddi-newsroom',")
    lines.append(f"    paragraphs: {ts_array(paragraphs, 4)},")
    lines.append(f"    paragraphsEn: {ts_array(paragraphs_en, 4)},")
    if tldr:
        lines.append(f"    tldr: {ts_array(tldr, 4)},")
    if tldr_en:
        lines.append(f"    tldrEn: {ts_array(tldr_en, 4)},")
    if translated_at:
        lines.append(f"    translatedAt: {ts_string(translated_at)},")
    if translation_source:
        lines.append(f"    translationSource: '{translation_source}',")
    lines.append("  },")
    return "\n".join(lines)


def main():
    files = sorted(SPEECHES_DIR.glob("*.json"))
    if not files:
        raise SystemExit(f"未找到任何 speech JSON 在 {SPEECHES_DIR}")

    records = []
    for f in files:
        rec = json.loads(f.read_text())
        if rec.get("error"):
            print(f"  跳过 {rec['speechId']}（error: {rec['error']}）")
            continue
        records.append(rec)

    records.sort(key=lambda r: r["speechId"])
    entries_block = "\n".join(render_entry(r) for r in records)
    new_block = (
        "export const speechTranscripts: Record<string, SpeechTranscript> = {\n"
        + entries_block
        + "\n};"
    )

    text = SPEECH_TS.read_text()
    pattern = re.compile(
        r"export const speechTranscripts: Record<string, SpeechTranscript> = \{[\s\S]*?\};",
        re.MULTILINE,
    )
    if not pattern.search(text):
        raise SystemExit("无法在 speech-transcripts.ts 中找到 speechTranscripts 字面量")
    new_text = pattern.sub(new_block, text)
    SPEECH_TS.write_text(new_text)
    print(f"✓ 写入 {len(records)} 条到 {SPEECH_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

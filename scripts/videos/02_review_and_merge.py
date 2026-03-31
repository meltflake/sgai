#!/usr/bin/env python3
"""
Step 2: 审核候选视频并合并到 videos.ts。

工作流程:
  1. 读取 candidates.json（由 01_scan_channels.py 生成）
  2. 交互式逐条审核：保留 / 跳过 / 编辑分类
  3. 对保留的视频，补充中文标题、摘要等字段
  4. 输出 TypeScript 代码片段，可直接粘贴到 videos.ts

用法:
  python 02_review_and_merge.py                    # 交互式审核
  python 02_review_and_merge.py --auto             # 全部保留（跳过交互）
  python 02_review_and_merge.py --input other.json # 指定输入文件
"""

import argparse
import json
import sys
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
DEFAULT_INPUT = DATA_DIR / "candidates.json"
OUTPUT_FILE = DATA_DIR / "approved.json"
TS_SNIPPET_FILE = DATA_DIR / "new_entries.ts.txt"

TOPICS = [
    "AI 战略与愿景",
    "AI 治理与监管",
    "AI 人才与教育",
    "AI 产业与应用",
    "国际合作与对标",
]

SPEAKER_TYPES = ["government", "academic", "industry"]


def classify_topic(title: str, description: str) -> str:
    """根据标题和描述自动猜测主题分类"""
    text = f"{title} {description}".lower()

    if any(w in text for w in ["govern", "regulat", "safety", "ethic", "framework", "deepfake"]):
        return "AI 治理与监管"
    if any(w in text for w in ["talent", "education", "train", "workforce", "skill", "学"]):
        return "AI 人才与教育"
    if any(w in text for w in ["startup", "industry", "business", "enterprise", "healthcare", "fintech"]):
        return "AI 产业与应用"
    if any(w in text for w in ["international", "global", "bilateral", "summit", "cooperation", "asean"]):
        return "国际合作与对标"
    return "AI 战略与愿景"


def interactive_review(candidates: list[dict]) -> list[dict]:
    """交互式审核候选视频"""
    approved = []
    total = len(candidates)

    print(f"\n共 {total} 条候选视频待审核")
    print("操作: [y]保留  [n]跳过  [q]退出并保存已审核项\n")

    for i, v in enumerate(candidates, 1):
        print(f"── [{i}/{total}] {'─' * 50}")
        print(f"标题: {v['title']}")
        print(f"日期: {v['date']}  |  频道: {v['channel']}")
        print(f"链接: {v['youtubeUrl']}")
        if v.get("description"):
            desc = v["description"][:200]
            print(f"描述: {desc}...")
        print()

        # 自动分类
        suggested_topic = classify_topic(v["title"], v.get("description", ""))
        print(f"建议分类: {suggested_topic}")

        while True:
            choice = input("保留? [y/n/q]: ").strip().lower()
            if choice in ("y", "n", "q", ""):
                break
            print("无效输入，请输入 y/n/q")

        if choice == "q":
            print("退出审核")
            break
        if choice == "n":
            print("→ 跳过\n")
            continue

        # 保留：补充信息
        print(f"\n主题分类 (回车接受 [{suggested_topic}]):")
        for j, t in enumerate(TOPICS, 1):
            print(f"  {j}. {t}")
        topic_input = input(f"选择 [1-{len(TOPICS)}]: ").strip()
        if topic_input and topic_input.isdigit():
            idx = int(topic_input) - 1
            if 0 <= idx < len(TOPICS):
                suggested_topic = TOPICS[idx]

        speaker = input("演讲者姓名 (英文): ").strip()
        speaker_title = input("演讲者身份 (中文): ").strip()

        print("演讲者类型:")
        for j, st in enumerate(SPEAKER_TYPES, 1):
            print(f"  {j}. {st}")
        st_input = input("选择 [1-3]: ").strip()
        speaker_type = SPEAKER_TYPES[int(st_input) - 1] if st_input.isdigit() and 1 <= int(st_input) <= 3 else "government"

        zh_title = input("中文标题: ").strip() or v["title"]
        summary = input("一句话中文摘要: ").strip()
        duration = input("时长 (MM:SS): ").strip() or "00:00"

        approved.append({
            **v,
            "topic": suggested_topic,
            "speaker": speaker,
            "speakerTitle": speaker_title,
            "speakerType": speaker_type,
            "zhTitle": zh_title,
            "summary": summary,
            "duration": duration,
        })
        print("→ 已保留\n")

    return approved


def auto_approve(candidates: list[dict]) -> list[dict]:
    """自动保留所有候选视频（需后续手动补充信息）"""
    for v in candidates:
        v["topic"] = classify_topic(v["title"], v.get("description", ""))
        v["speaker"] = ""
        v["speakerTitle"] = ""
        v["speakerType"] = "government"
        v["zhTitle"] = v["title"]
        v["summary"] = ""
        v["duration"] = "00:00"
    return candidates


def generate_ts_snippet(approved: list[dict], start_id: int = 100) -> str:
    """生成 TypeScript 代码片段"""
    lines = []
    for i, v in enumerate(approved):
        vid = f"v{start_id + i:03d}"
        lines.append(f"  {{")
        lines.append(f"    id: '{vid}',")
        lines.append(f"    title: '{escape_ts(v['zhTitle'])}',")
        lines.append(f"    speaker: '{escape_ts(v['speaker'])}',")
        lines.append(f"    speakerTitle: '{escape_ts(v['speakerTitle'])}',")
        lines.append(f"    speakerType: '{v['speakerType']}',")
        lines.append(f"    date: '{v['date']}',")
        lines.append(f"    duration: '{v['duration']}',")
        lines.append(f"    summary: '{escape_ts(v['summary'])}',")
        lines.append(f"    topic: '{v['topic']}',")
        lines.append(f"    youtubeUrl: '{v['youtubeUrl']}',")
        lines.append(f"    channel: '{escape_ts(v['channel'])}',")
        lines.append(f"  }},")
    return "\n".join(lines)


def escape_ts(s: str) -> str:
    """转义 TypeScript 字符串中的特殊字符"""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")


def main():
    parser = argparse.ArgumentParser(description="审核候选视频并生成 TS 代码片段")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="输入文件路径")
    parser.add_argument("--auto", action="store_true", help="跳过交互，全部保留")
    parser.add_argument("--start-id", type=int, default=100, help="起始 ID 编号 (默认 100)")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"文件不存在: {args.input}", file=sys.stderr)
        print("请先运行 01_scan_channels.py", file=sys.stderr)
        sys.exit(1)

    candidates = json.loads(args.input.read_text(encoding="utf-8"))
    if not candidates:
        print("没有候选视频")
        sys.exit(0)

    if args.auto:
        approved = auto_approve(candidates)
    else:
        approved = interactive_review(candidates)

    if not approved:
        print("没有保留任何视频")
        sys.exit(0)

    # 保存审核结果
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(
        json.dumps(approved, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\n已保存 {len(approved)} 条审核通过的视频到 {OUTPUT_FILE}")

    # 生成 TS 代码片段
    snippet = generate_ts_snippet(approved, start_id=args.start_id)
    TS_SNIPPET_FILE.write_text(snippet, encoding="utf-8")
    print(f"TypeScript 代码片段已保存到 {TS_SNIPPET_FILE}")
    print("将代码片段粘贴到 src/data/videos.ts 的 videos 数组中即可。")


if __name__ == "__main__":
    main()

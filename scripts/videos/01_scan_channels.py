#!/usr/bin/env python3
"""
Step 1: 扫描 YouTube 频道，发现新加坡 AI 相关视频。

工作原理:
  1. 通过 YouTube RSS feed 获取各频道最新视频（每频道最多 15 条）
  2. 用关键词过滤 AI 相关内容
  3. 通过 oEmbed API 获取视频元数据
  4. 输出候选视频 JSON 供人工审核

无需 API key。依赖: requests, feedparser

用法:
  python 01_scan_channels.py                    # 扫描所有频道
  python 01_scan_channels.py --days 7           # 只看最近 7 天
  python 01_scan_channels.py --channel CNA      # 只扫描 CNA
  python 01_scan_channels.py --exclude-existing  # 排除已有视频
"""

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import feedparser
import requests

# ── 目标频道 ──────────────────────────────────────────────────────────────────
# channel_id 可通过访问频道页面 → 查看源代码 → 搜索 "channelId" 获取
# 或用 RSS: https://www.youtube.com/feeds/videos.xml?channel_id=XXX
CHANNELS = {
    "CNA": {
        "channel_id": "UC83jt4dlz1Gjl58fzQrrKZg",
        "name": "CNA",
    },
    "ST": {
        "channel_id": "UC4p_I9eiRewn2KoU-nawrDg",
        "name": "The Straits Times",
    },
    "govsg": {
        "channel_id": "UCgKjHnMbrOK8xLzAwHO0aSg",
        "name": "govsg",
    },
    "SmartNation": {
        "channel_id": "UC8a6s4mqoKx03qaabxUSksg",
        "name": "Smart Nation Singapore",
    },
    "AISG": {
        "channel_id": "UChvSIyj2rbpmjJUEhc07bmA",
        "name": "AI Singapore",
    },
    "WEF": {
        "channel_id": "UCw-kH-Od73XDAt7qtH9uBYA",
        "name": "World Economic Forum",
    },
    "Bloomberg": {
        "channel_id": "UCIALMKvObZNtJ6AmdCLP7Lg",
        "name": "Bloomberg Television",
    },
}

# ── AI 关键词（标题/描述中匹配任一即可）───────────────────────────────────────
AI_KEYWORDS = [
    r"\bAI\b",
    r"artificial intelligence",
    r"machine learning",
    r"deep\s?learning",
    r"deepfake",
    r"ChatGPT",
    r"generative AI",
    r"large language model",
    r"\bLLM\b",
    r"smart nation.*(?:ai|digital|tech)",
    r"(?:ai|digital).*smart nation",
    r"national ai",
    r"ai govern",
    r"ai strateg",
    r"ai safety",
    r"ai regulat",
    r"data centre",
    r"compute infrastructure",
]

# 新加坡相关关键词（用于 WEF/Bloomberg 等国际频道的二次过滤）
SG_KEYWORDS = [
    r"singapore",
    r"josephine teo",
    r"tharman",
    r"lawrence wong",
    r"balakrishnan",
    r"smart nation",
    r"imda",
    r"\bmddi\b",
    r"\bmci\b.*singapore",
]

# 本地频道（不需要 SG 关键词二次过滤）
LOCAL_CHANNELS = {"CNA", "ST", "govsg", "SmartNation", "AISG"}

# ── 配置 ──────────────────────────────────────────────────────────────────────
RSS_URL = "https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
OEMBED_URL = "https://noembed.com/embed?url=https://www.youtube.com/watch?v={video_id}"
DATA_DIR = Path(__file__).parent / "data"
OUTPUT_FILE = DATA_DIR / "candidates.json"
EXISTING_VIDEOS_TS = Path(__file__).parent.parent.parent / "src" / "data" / "videos.ts"
REQUEST_DELAY = 0.5  # 秒，避免被限速


def matches_keywords(text: str, patterns: list[str]) -> bool:
    """检查文本是否匹配任一关键词模式"""
    text_lower = text.lower()
    return any(re.search(p, text_lower, re.IGNORECASE) for p in patterns)


def get_existing_video_urls() -> set[str]:
    """从 videos.ts 中提取已有的 YouTube URL"""
    urls = set()
    if not EXISTING_VIDEOS_TS.exists():
        return urls
    content = EXISTING_VIDEOS_TS.read_text()
    for m in re.finditer(r"youtubeUrl:\s*'(https?://[^']+)'", content):
        url = m.group(1)
        # 统一格式：提取 video ID
        vid_match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", url)
        if vid_match:
            urls.add(vid_match.group(1))
    return urls


def fetch_channel_feed(channel_key: str, channel_info: dict) -> list[dict]:
    """获取频道 RSS feed 并返回条目列表"""
    url = RSS_URL.format(channel_id=channel_info["channel_id"])
    try:
        feed = feedparser.parse(url)
        if feed.bozo and not feed.entries:
            print(f"  ⚠ RSS 解析失败: {channel_key}", file=sys.stderr)
            return []
        return feed.entries
    except Exception as e:
        print(f"  ⚠ 请求失败: {channel_key} — {e}", file=sys.stderr)
        return []


def get_video_metadata(video_id: str) -> dict | None:
    """通过 oEmbed 获取视频元数据"""
    try:
        resp = requests.get(
            OEMBED_URL.format(video_id=video_id),
            timeout=10,
        )
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return None


def parse_entry(entry: dict, channel_name: str) -> dict:
    """解析 RSS feed 条目为标准格式"""
    video_id = entry.get("yt_videoid", "")
    published = entry.get("published", "")
    # 解析日期
    try:
        dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
        date_str = dt.strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        date_str = ""

    title = entry.get("title", "")
    summary = entry.get("summary", "")

    return {
        "videoId": video_id,
        "title": title,
        "description": summary[:500] if summary else "",
        "date": date_str,
        "channel": channel_name,
        "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}",
    }


def scan_channels(
    channel_filter: str | None = None,
    days: int | None = None,
    exclude_existing: bool = False,
) -> list[dict]:
    """扫描所有频道，返回 AI 相关视频候选列表"""
    existing_ids = get_existing_video_urls() if exclude_existing else set()
    cutoff = None
    if days:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    candidates = []
    channels_to_scan = CHANNELS
    if channel_filter:
        key = channel_filter.upper()
        if key in CHANNELS:
            channels_to_scan = {key: CHANNELS[key]}
        else:
            print(f"未知频道: {channel_filter}", file=sys.stderr)
            print(f"可选: {', '.join(CHANNELS.keys())}", file=sys.stderr)
            sys.exit(1)

    for ch_key, ch_info in channels_to_scan.items():
        print(f"扫描 {ch_info['name']} ({ch_key})...")
        entries = fetch_channel_feed(ch_key, ch_info)
        print(f"  获取 {len(entries)} 条视频")

        matched = 0
        for entry in entries:
            parsed = parse_entry(entry, ch_info["name"])

            # 日期过滤
            if cutoff and parsed["date"]:
                try:
                    entry_date = datetime.fromisoformat(parsed["date"]).replace(
                        tzinfo=timezone.utc
                    )
                    if entry_date < cutoff:
                        continue
                except ValueError:
                    pass

            # 排除已有
            if parsed["videoId"] in existing_ids:
                continue

            # AI 关键词过滤
            text = f"{parsed['title']} {parsed['description']}"
            if not matches_keywords(text, AI_KEYWORDS):
                continue

            # 国际频道需要二次过滤新加坡相关性
            if ch_key not in LOCAL_CHANNELS:
                if not matches_keywords(text, SG_KEYWORDS):
                    continue

            matched += 1
            candidates.append(parsed)
            time.sleep(REQUEST_DELAY)

        print(f"  匹配 {matched} 条 AI 相关视频")

    # 按日期倒序
    candidates.sort(key=lambda x: x["date"], reverse=True)
    return candidates


def main():
    parser = argparse.ArgumentParser(description="扫描 YouTube 频道发现 AI 相关视频")
    parser.add_argument("--channel", help="只扫描指定频道 (如 CNA, ST, govsg)")
    parser.add_argument("--days", type=int, help="只看最近 N 天的视频")
    parser.add_argument(
        "--exclude-existing",
        action="store_true",
        help="排除 videos.ts 中已有的视频",
    )
    args = parser.parse_args()

    candidates = scan_channels(
        channel_filter=args.channel,
        days=args.days,
        exclude_existing=args.exclude_existing,
    )

    # 确保输出目录存在
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 写入 JSON
    OUTPUT_FILE.write_text(
        json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\n共发现 {len(candidates)} 条候选视频")
    print(f"已保存到 {OUTPUT_FILE}")

    if candidates:
        print("\n前 5 条:")
        for v in candidates[:5]:
            print(f"  [{v['date']}] {v['title']}")
            print(f"    {v['youtubeUrl']}")


if __name__ == "__main__":
    main()

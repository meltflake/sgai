#!/usr/bin/env python3
"""
抓取 voices.ts 中所有 MDDI 演讲稿的英文正文。

工作原理:
  1. 从 src/data/voices.ts 读取 mddiSpeeches[].url（slug 即 speechId）
  2. 用真实 UA 请求每条 URL，绕过 CloudFront 阻断
  3. 用 BeautifulSoup 抽取正文段落（多策略 fallback）
  4. 输出 JSON 到 scripts/voices/data/speeches/<id>.json

输出格式:
  {
    "speechId": "...",
    "sourceUrl": "...",
    "fetchedAt": "YYYY-MM-DD",
    "title": "...",   // 页面 h1（用于核对）
    "paragraphs": ["...", ...]
  }

依赖: requests, beautifulsoup4

用法:
  python 02_fetch_speeches.py                  # 全部抓取
  python 02_fetch_speeches.py --id <slug>      # 只抓单篇
  python 02_fetch_speeches.py --skip-existing  # 跳过已抓取
"""

import argparse
import json
import re
import sys
import time
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
VOICES_TS = ROOT / "src" / "data" / "voices.ts"
OUT_DIR = Path(__file__).parent / "data" / "speeches"
OUT_DIR.mkdir(parents=True, exist_ok=True)

REQUEST_DELAY = 1.5  # CloudFront 比较敏感
TIMEOUT = 20

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
}


def speech_id_from_url(url: str) -> str:
    m = re.search(r"/newsroom/([^/?#]+)", url)
    return m.group(1) if m else url


def parse_speech_urls() -> list[tuple[str, str, str]]:
    """从 voices.ts 中解析 mddiSpeeches 块，返回 (id, url, title) 列表。

    字段顺序在 entry 内不固定（i18n 重构后 titleEn 常在 title 之前），所以先按
    `{...}` 抓 entry block（不含嵌套），再独立抽 `title:` / `url:`。title 取
    bare 中文字段（不是 titleEn / titleJa）。
    """
    text = VOICES_TS.read_text()
    block_match = re.search(r"export const mddiSpeeches[^\[]*\[(.+?)^\];", text, re.DOTALL | re.MULTILINE)
    if not block_match:
        sys.exit("无法定位 mddiSpeeches 数组")
    block = block_match.group(1)

    entries = []
    # entry 不含嵌套 `{}`，可以用 \{[^{}]+?\} 抓取
    for m_entry in re.finditer(r"\{[^{}]+?\}", block, re.DOTALL):
        body = m_entry.group(0)
        # bare title (not titleEn / titleJa) — negative lookbehind 防止匹配 titleEn:
        m_title = re.search(r"(?<![A-Za-z])title:\s*(?P<tq>['\"])(?P<title>.*?)(?P=tq)", body, re.DOTALL)
        m_url = re.search(r"\burl:\s*(?P<uq>['\"])(?P<url>https?://[^'\"]+)(?P=uq)", body)
        if not (m_title and m_url):
            continue
        url = m_url.group("url")
        if "mddi.gov.sg" not in url:
            continue
        sid = speech_id_from_url(url)
        title = m_title.group("title").replace("\\'", "'").replace('\\"', '"')
        entries.append((sid, url, title))
    return entries


def extract_paragraphs(html: str) -> list[str]:
    """多策略抽取正文段落。"""
    soup = BeautifulSoup(html, "html.parser")

    # 策略 1: 主流模板 — div.w-full.overflow-x-auto.break-words 包裹正文
    container = soup.select_one("div.w-full.overflow-x-auto.break-words")
    if container:
        paras = [p.get_text(" ", strip=True) for p in container.find_all("p")]
        paras = [p for p in paras if p]
        if len(paras) >= 5:
            return paras

    # 策略 2: <main> 内的 prose-body-base 段落
    main = soup.find("main")
    if main:
        paras = []
        for p in main.find_all("p"):
            cls = " ".join(p.get("class") or [])
            if "prose-body-base" in cls or ":not(:first-child)" in cls:
                txt = p.get_text(" ", strip=True)
                if txt:
                    paras.append(txt)
        if len(paras) >= 5:
            return paras

    # 策略 3: <main> 中所有非空 <p>，去重前的常见全局公告
    if main:
        skip_substrings = (
            "Call the 24/7 ScamShield",
            "ScamShield Helpline",
            "Subscribe to our newsletter",
        )
        paras = []
        for p in main.find_all("p"):
            txt = p.get_text(" ", strip=True)
            if not txt:
                continue
            if any(s in txt for s in skip_substrings):
                continue
            paras.append(txt)
        if len(paras) >= 5:
            return paras

    return []


def fetch(url: str) -> str:
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    # MDDI 不总是声明 charset；强制 UTF-8 解码避免 mojibake
    resp.encoding = "utf-8"
    return resp.text


def fetch_one(sid: str, url: str, title: str, skip_existing: bool) -> dict | None:
    out = OUT_DIR / f"{sid}.json"
    if skip_existing and out.exists():
        return None

    print(f"  抓取 {sid} ...", flush=True)
    try:
        html = fetch(url)
    except requests.RequestException as e:
        print(f"    ✗ 请求失败: {e}", file=sys.stderr)
        return {"speechId": sid, "sourceUrl": url, "title": title, "error": str(e), "paragraphs": []}

    paras = extract_paragraphs(html)
    if not paras:
        print(f"    ✗ 未抓到段落", file=sys.stderr)
        return {"speechId": sid, "sourceUrl": url, "title": title, "error": "no-paragraphs", "paragraphs": []}

    # 去掉首尾常见噪声：纯日期、空白、结束标记
    cleaned = []
    for p in paras:
        if re.match(r"^\d{1,2}\s+\w+\s+\d{4}$", p):
            continue
        if p in {".  .  .  .  .", "***"}:
            continue
        cleaned.append(p)

    record = {
        "speechId": sid,
        "sourceUrl": url,
        "fetchedAt": date.today().isoformat(),
        "title": title,
        "paragraphs": cleaned,
    }
    out.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(f"    ✓ {len(cleaned)} 段")
    return record


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--id", help="只抓指定 speechId")
    p.add_argument("--skip-existing", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    args = p.parse_args()

    entries = parse_speech_urls()
    if args.id:
        entries = [e for e in entries if e[0] == args.id]
        if not entries:
            sys.exit(f"未找到 id={args.id}")

    if args.limit:
        entries = entries[: args.limit]

    print(f"共 {len(entries)} 篇待抓取，输出到 {OUT_DIR}")
    ok = 0
    fail = 0
    for i, (sid, url, title) in enumerate(entries, 1):
        if i > 1:
            time.sleep(REQUEST_DELAY)
        record = fetch_one(sid, url, title, args.skip_existing)
        if record is None:
            print(f"  跳过 {sid}（已存在）")
            continue
        if record.get("error"):
            fail += 1
        else:
            ok += 1

    print(f"\n完成: 成功 {ok} / 失败 {fail}")


if __name__ == "__main__":
    main()

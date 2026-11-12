#!/usr/bin/env python3
"""Scan posts/*.md and generate posts/posts.json sorted by date descending."""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "posts")
OUT_FILE = os.path.join(POSTS_DIR, "posts.json")


def parse_frontmatter(text: str):
    meta = {}
    body = text
    match = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*\r?\n?(.*)$", text, re.DOTALL)
    if match:
        raw_meta, body = match.group(1), match.group(2)
        for line in raw_meta.splitlines():
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            if val.startswith("[") and val.endswith("]"):
                items = [x.strip().strip("'\"") for x in val[1:-1].split(",") if x.strip()]
                meta[key] = items
            else:
                meta[key] = val.strip("'\"")
    return meta, body.strip()


def main():
    os.makedirs(POSTS_DIR, exist_ok=True)
    posts = []
    for fname in sorted(os.listdir(POSTS_DIR)):
        if not fname.endswith(".md"):
            continue
        slug = fname[:-3]
        fpath = os.path.join(POSTS_DIR, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            raw = f.read()
        meta, body = parse_frontmatter(raw)
        title = meta.get("title") or slug
        date = meta.get("date") or (slug[:10] if re.match(r"^\d{4}-\d{2}-\d{2}", slug) else "")
        tags = meta.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        summary = meta.get("summary") or ""
        if not summary and body:
            first_para = next((ln.strip() for ln in body.splitlines() if ln.strip() and not ln.strip().startswith("#")), "")
            summary = first_para[:160]
        words = len(re.findall(r"\S+", body))
        read_min = max(1, round(words / 200))
        posts.append({
            "slug": slug,
            "file": f"posts/{fname}",
            "title": title,
            "date": date,
            "tags": tags,
            "summary": summary,
            "readTime": f"{read_min} min read",
        })

    posts.sort(key=lambda p: (p.get("date", ""), p.get("slug", "")), reverse=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Generated {OUT_FILE} with {len(posts)} post(s).")


if __name__ == "__main__":
    main()

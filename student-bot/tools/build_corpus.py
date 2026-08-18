#!/usr/bin/env python3
"""Build the retrieval corpus from cleaned transcripts.

Reads transcripts/clean/**, emits corpus/chunks.json.

Two things here are deliberate departures from an earlier reading of
corpus/schema.md, and both are recorded in PROCESSING-LOG.md:

1. Timestamps for FB Live sessions are ESTIMATED by proportional position
   against the Duration in the file header. They are marked estimated so a
   citation can say "around 42:10" honestly rather than claiming precision
   the source does not carry.

2. Module transcripts carry no duration, so they get no timestamp at all and
   are cited by part number instead. The schema previously said a chunk with
   no timestamp does not get indexed. That rule was blocking the entire
   product to protect citation polish, which is the wrong trade.
"""

import json
import os
import re
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLEAN = ROOT / "transcripts" / "clean"
OUT = ROOT / "corpus" / "chunks.json"
DROPPED = ROOT / "corpus" / "dropped.json"

TARGET = 1100          # characters, roughly a paragraph or two
MAX = 1900

# Passages excluded by the compliance scan. Matching is case insensitive and
# substring based, so fragments must be distinctive enough not to catch
# innocent text. Sourced from rulings/compliance-log.md.
EXCLUDE = [
    "10 percent of your account",
    "10 percent a week or a month",
    "gotta have 10 percent of this",
    "that's a very safe strategy",
    "make retirement money",
    "guaranteed to get filled",
    "guaranteed premiums",
    "win more times than none",
    "2 out of 3 chances to win",
    "two out of three chances to win",
    "one out of three chance of winning",
    "insider information",
    "10% a month that marketing",
    "10 percent a month that marketing",
]

# Retired terms, non-negotiable 8. Vlad ruled: "You can remove the Elite
# language." So where "elite" is only a qualifier on an ordinary word, strip
# the qualifier and keep the teaching. Every rewrite leaves a marker, matching
# the redaction standard in CLAUDE.md: nothing is altered silently.
RETIRED_REWRITE = [
    (r"\b(one\s+of\s+)?our\s+elite\s+(members?|students?|traders?)\b",
     r"\1our \2 [TERM REMOVED]"),
    (r"\belite\s+(members?|students?|traders?)\b", r"\1 [TERM REMOVED]"),
]

# Product names with no salvageable form. A chunk naming one is dropped,
# because removing the name leaves a sentence about a product that no
# longer exists.
RETIRED = [
    r"\belite\s+four\b",
    r"\belite\s+4\b",
    r"\belite\s+12\b",
    r"\belite\s+twelve\b",
]
# No catch-all on the bare word. "elite" is an ordinary English adjective and
# a blanket rule drops innocent passages: it caught a member describing the
# Starbucks secret menu as "some elite stuff". The retired terms are the
# product names, not the word.

# Anything matching these is held back for review rather than indexed.
SUSPECT = [
    r"\bguarantee[ds]?\b",
    r"\bpassive\s+income\b",
    r"\brisk\s*[- ]?\s*free\b",
    r"\b\d{1,3}\s*%\s*(a|per)\s*(week|month|year)\b",
]

PROCEDURE = [
    r"\bclick\b", r"\btab\b", r"\bdrop\s*down\b", r"\bmenu\b", r"\bbutton\b",
    r"\bsetup\s+tab\b", r"\bright\s+click\b", r"\bthinkorswim\b", r"\bgear\s+icon\b",
    r"\bhit\s+enter\b", r"\btoolbar\b",
]

DATED = [
    r"\b[A-Z]{2,5}\b(?=\s+(stock|is|was|at|went|has))",   # ticker-ish
    r"\$\s?\d",
    r"\b(?:19|20)\d{2}\b",
    r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b",
    r"\bearnings\b", r"\btoday\b", r"\bthis\s+week\b",
]


def hms(seconds):
    seconds = max(0, int(seconds))
    return f"{seconds // 3600:02d}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}"


def dur_to_seconds(text):
    parts = [int(p) for p in text.strip().split(":")]
    while len(parts) < 3:
        parts.insert(0, 0)
    return parts[0] * 3600 + parts[1] * 60 + parts[2]


def parse_header(raw, path):
    """FB Live files carry a five line header. Modules carry none."""
    meta = {
        "title": path.stem, "recording_date": None, "duration": None,
        "video": None, "order": None, "total": None,
    }
    head = raw[:600]
    if not re.search(r"^Order:\s*#\d+", head, re.M):
        return meta, raw

    lines = raw.split("\n")
    body_start = 0
    for i, line in enumerate(lines[:12]):
        if i == 0 and line.strip():
            meta["title"] = line.strip()
        m = re.match(r"Uploaded:\s*(\d{4}-\d{2}-\d{2})", line)
        if m:
            meta["recording_date"] = m.group(1)
        m = re.match(r"Duration:\s*([\d:]+)", line)
        if m:
            meta["duration"] = dur_to_seconds(m.group(1))
        m = re.match(r"Video:\s*(\S+)", line)
        if m:
            meta["video"] = m.group(1)
        m = re.match(r"Order:\s*#(\d+)\s+of\s+(\d+)", line)
        if m:
            meta["order"] = int(m.group(1))
            meta["total"] = int(m.group(2))
        if set(line.strip()) == {"="}:
            body_start = i + 1
            break
    return meta, "\n".join(lines[body_start:])


def classify(text):
    low = text.lower()
    if sum(1 for p in PROCEDURE if re.search(p, low)) >= 2:
        return "PERISHABLE_PROCEDURE"
    if sum(1 for p in DATED if re.search(p, text)) >= 2:
        return "DATED_EXAMPLE"
    return "EVERGREEN"


def screen(text):
    """Return (verdict, reason). verdict in keep / exclude / review."""
    low = text.lower()
    for phrase in EXCLUDE:
        if phrase in low:
            return "exclude", f"compliance: {phrase}"
    for pat in RETIRED:
        if re.search(pat, low):
            return "exclude", f"retired term: {pat}"
    for pat in SUSPECT:
        if re.search(pat, low):
            return "review", f"suspect: {pat}"
    return "keep", None


def paragraphs(body):
    parts = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    return parts if parts else [body.strip()]


def pack(paras):
    """Group paragraphs into chunks near TARGET characters."""
    chunks, buf = [], ""
    for para in paras:
        if len(para) > MAX:
            if buf:
                chunks.append(buf)
                buf = ""
            sents = re.split(r"(?<=[.!?])\s+", para)
            cur = ""
            for s in sents:
                if len(cur) + len(s) > TARGET and cur:
                    chunks.append(cur.strip())
                    cur = s
                else:
                    cur = f"{cur} {s}".strip()
            if cur:
                buf = cur
            continue
        if len(buf) + len(para) > TARGET and buf:
            chunks.append(buf)
            buf = para
        else:
            buf = f"{buf}\n\n{para}".strip()
    if buf:
        chunks.append(buf)
    return chunks


def course_for(path):
    if path.parent.name == "fb-live":
        return "fb-live"
    name = path.stem
    if name.startswith("module-"):
        return "tf-core"
    if name.startswith("paycheck-collector"):
        return "paycheck-collector"
    return "tf-options"


def module_for(path, meta):
    name = path.stem
    m = re.match(r"module-(\d+)", name)
    if m:
        return m.group(1).lstrip("0") or "0"
    if meta.get("order") is not None:
        return f"{meta['order']:04d}"
    return "UNNUMBERED"


def main():
    files = sorted(CLEAN.rglob("*.txt"))
    chunks, dropped = [], []
    seen_hashes = {}

    for path in files:
        raw = path.read_text(encoding="utf-8", errors="replace")
        meta, body = parse_header(raw, path)
        rel = str(path.relative_to(ROOT / "transcripts" / "clean"))
        course = course_for(path)
        module = module_for(path, meta)
        title = meta["title"]

        pieces = pack(paragraphs(body))
        total_chars = sum(len(p) for p in pieces) or 1
        running = 0

        for i, text in enumerate(pieces):
            for pat, repl in RETIRED_REWRITE:
                text = re.sub(pat, repl, text, flags=re.I)

            ts, estimated = None, False
            if meta["duration"]:
                ts = hms(meta["duration"] * (running / total_chars))
                estimated = True
            running += len(text)

            digest = hashlib.sha256(" ".join(text.lower().split()).encode()).hexdigest()[:16]
            if digest in seen_hashes:
                dropped.append({
                    "source_file": rel, "seq": i, "reason": "duplicate text",
                    "duplicate_of": seen_hashes[digest], "text": text[:180],
                })
                continue
            chunk_id = f"{course}:{module}:{i:04d}"
            seen_hashes[digest] = chunk_id

            verdict, reason = screen(text)
            if verdict == "exclude":
                dropped.append({
                    "chunk_id": chunk_id, "source_file": rel,
                    "reason": reason, "text": text[:180],
                })
                continue

            chunks.append({
                "chunk_id": chunk_id,
                "course": course,
                "module": module,
                "module_title": title,
                "timestamp": ts,
                "timestamp_estimated": estimated,
                "part": f"part {i + 1} of {len(pieces)}",
                "tag": classify(text),
                "text": text,
                "recording_date": meta["recording_date"],
                "video": meta["video"],
                "order": meta["order"],
                "status": "CURRENT",
                "needs_review": verdict == "review",
                "review_reason": reason,
                "source_file": rel,
            })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(chunks, indent=1), encoding="utf-8")
    DROPPED.write_text(json.dumps(dropped, indent=1), encoding="utf-8")

    by_course = {}
    for c in chunks:
        by_course[c["course"]] = by_course.get(c["course"], 0) + 1
    by_tag = {}
    for c in chunks:
        by_tag[c["tag"]] = by_tag.get(c["tag"], 0) + 1

    print(f"sources      {len(files)}")
    print(f"chunks kept  {len(chunks)}")
    print(f"dropped      {len(dropped)}")
    print(f"needs review {sum(1 for c in chunks if c['needs_review'])}")
    print(f"timestamped  {sum(1 for c in chunks if c['timestamp'])}")
    print("by course    " + ", ".join(f"{k}={v}" for k, v in sorted(by_course.items())))
    print("by tag       " + ", ".join(f"{k}={v}" for k, v in sorted(by_tag.items())))


if __name__ == "__main__":
    main()

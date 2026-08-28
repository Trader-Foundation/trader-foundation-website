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

# Chunk size, and it is a retrieval parameter rather than a formatting one.
#
# This was 1100 and moving it to 800 fixed a real problem. The numbered modules
# define the vocabulary once each; the live sessions use those words constantly
# without defining them. At 1100 characters a definition sat inside a chunk
# padded with surrounding narration, its term density dropped, and BM25 ranked
# it below live sessions that merely said the word a lot.
#
# Measured, over twelve definitional questions and twelve regression questions:
#
#   TARGET   definitions reached   regressions
#   1100          7 of 12            none
#    900          8 of 12            none
#    800          9 of 12            none      <- here
#    750          9 of 12            none
#    700          8 of 12            one
#    600          7 of 12            none
#
# It is not a knife edge: 750 and 800 both give 9, so the value is chosen from
# a stable plateau rather than a spike. Below 700 it reverses, because chunks
# get too short to hold a whole definition and the term density gain is lost to
# the definition being split across two chunks.
#
# Two reranking fixes were tried first and both were rejected for trading
# definitions against application answers. See corpus/retrieval-notes.md. This
# one costs nothing because it addresses the cause rather than the symptom.
TARGET = 800
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
    # Narrowed. This was the bare phrase "insider information", and it was too
    # broad: it dropped Module 2's passage, which says "unless you're working
    # for the company and you have insider information, which would be
    # illegal" and then goes straight into "trading off the news is the
    # definition of gambling". That is the house anti-gambling teaching and the
    # mention is a disclaimer, not an endorsement.
    #
    # The real hit is the Moving Averages phrasing, which reads as advice to
    # obtain it once stripped to a chunk. Only that shape is excluded now.
    #
    # Same lesson as the "guarantee" scan: the word that flags is the word an
    # honest speaker uses. Match the claim, not the vocabulary.
    "got to have some sort of insider information",
    "need insider information",
    "you need some insider",
    "10% a month that marketing",
    "10 percent a month that marketing",
    # FB Live #0045. A stated periodic return compounded out loud: "if I could
    # get three plays of 8% a week, my goodness, that's four weeks of doing
    # that." Non-negotiables 1 and 2 both.
    #
    # Exclusion drops the whole chunk, so real teaching goes with it: this
    # passage is also the clearest statement anywhere of taking base hits
    # rather than swinging for a big move, and "I'm not a greedy person" sits
    # in the same breath as the arithmetic. That cost is accepted rather than
    # worked around, because the alternative is editing a coach's words and
    # every other exclusion in this list drops its chunk too.
    #
    # The base hits teaching should be recovered from a clean source. Logged in
    # rulings/compliance-log.md as a re-record candidate rather than left as a
    # silent hole.
    "three plays of 8% a week",
    "three plays of eight percent a week",
    # Module 5, the Alibaba walkthrough. This is the claim test P1 exists to
    # block, and it is the oldest known compliance hit in the project. A
    # specific dollar outcome attributed to real people over a real timeframe,
    # which is non-negotiable 1 with nothing borderline about it.
    "made thousands of thousands of dollars",
    "thousands of thousands of dollars in a matter of literally hours",
]

# Retired terms, non-negotiable 8. Vlad ruled: "You can remove the Elite
# language." So where "elite" is only a qualifier on an ordinary word, strip
# the qualifier and keep the teaching. Every rewrite leaves a marker, matching
# the redaction standard in CLAUDE.md: nothing is altered silently.
RETIRED_REWRITE = [
    (r"\b(one\s+of\s+)?our\s+elite\s+(members?|students?|traders?)\b",
     r"\1our \2 [TERM REMOVED]"),
    (r"\belite\s+(members?|students?|traders?)\b", r"\1 [TERM REMOVED]"),

    # Absurd return figures, removed on Vlad's ruling: "remove the 7000 in
    # general". Module 3 names 7,000 percent in order to reject it, and the
    # sentence around it is the house position:
    #
    #   "if you're looking to make these crazy amounts of money and make 7,000
    #    percent returns every day, you're simply gambling. We can't predict
    #    that, but we could predict consistent small gains."
    #
    # Vlad on what it means: "it just means to be realistic consistency is key."
    #
    # **Rewritten rather than excluded, on purpose.** Excluding drops the whole
    # chunk, and this chunk also holds the module's cleanest statement of base
    # hits, "small gains at a high probability instead of big gains with a small
    # probability". That exact cost was paid once already today on the FB Live
    # version of the same teaching. The Elite rewrites above set the precedent:
    # strip the term, keep the teaching, leave a visible marker.
    #
    # The pattern requires "returns" or "gains" after the figure, so taught
    # values are untouched: Fibonacci 38.2 and 61.8, the 50 percent scaling
    # rule, "10 to 25%" retracement, and "it's not exactly 100%" all survive.
    # Ranges first, or the single figure rules eat only the second half and
    # leave "150 to [FIGURE REMOVED] gain", which still states a figure. That
    # bug was live for one build and is what surfaced the Moving Averages
    # instance below.
    (r"\b\d{1,3}(?:,\s?\d{3})*\s*(?:to|through|[-–])\s*"
     r"\d{1,3}(?:,\s?\d{3})*\s*(?:%|percent)\s+(returns?|gains?)\b",
     r"[FIGURE REMOVED] \1"),
    (r"\b\d{1,3}(?:,\s?\d{3})+\s*(?:%|percent)\s+(returns?|gains?)\b",
     r"[FIGURE REMOVED] \1"),
    (r"\b\d{3,}\s*(?:%|percent)\s+(returns?|gains?)\b", r"[FIGURE REMOVED] \1"),
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
# Compliance scan. These flag a chunk for human review; they do not exclude it.
#
# **Match the claim, not the vocabulary.** The bare word "guarantee" was here
# and it flagged 26 chunks across the corpus, of which exactly one was a real
# hit. Everything else was a coach being careful:
#
#   "none of this is guaranteed"
#   "I can't guarantee any of these moves and I will never act like I can"
#   "there's nothing that exists that will guarantee success"
#
# It also caught a signature teaching line repeated across four sessions,
# "the only two things guaranteed in the market are contraction and expansion",
# which is about market structure and has nothing to do with returns.
#
# The bare "risk free" was the same story: its only hit was a discussion of the
# US sovereign credit rating downgrade from AAA, where risk free is the name of
# a bond category.
#
# A scanner that cries wolf 25 times gets skimmed, and the one real hit is the
# thing it exists to catch. Same argument as the name detector in
# tools/find_names.py. So these now match guarantees *of a financial outcome*,
# and results language attached to a period.
SUSPECT = [
    r"\bguarantee\w*\s+(?:\w+\s+){0,2}?"
    r"(returns?|income|profits?|premiums?|money|gains?|winners?|success|filled)\b",
    r"\b(returns?|income|profits?|premiums?|gains?)\s+(?:are|is)\s+guarantee",
    r"\bpassive\s+income\b",
    r"\brisk\s*[- ]?\s*free\s+(returns?|income|profits?|trade|strategy|money)\b",
    # Both spellings. The real hit in the corpus says "10 percent a week" in
    # words, and an earlier version of this pattern required the % symbol.
    r"\b\d{1,3}\s*(%|percent)\s*(a|per)\s*(week|month|year)\b",
    r"\b\d{1,3}\s*(%|percent)\s*(returns?|gains?)\s*(a|per|every)\s*(day|week|month|year)\b",
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

# Entry and exit narration inside a chart walkthrough.
#
# rulings/compliance-log.md raised this as a risk with the same shape as a
# compliance hit: material that is fine inside a video and dangerous once a bot
# can retrieve it on demand. In the video the instructor is walking a historical
# chart and the framing is obvious. Retrieved as a chunk in answer to "when
# should I get in?", "that's your sign to get in" reads as instruction.
#
# The log records the mitigation as tagging these DATED_EXAMPLE. It was never
# implemented, and the Volume module proved it: five chunks narrating entries
# and exits against a Tesla chart, all tagged EVERGREEN.
#
# **The DATED list could not have caught them.** It looks for uppercase tickers,
# dollar figures, years, months, "earnings" and "today", and needs two hits. A
# walkthrough that says Tesla, Amazon and Peloton in title case and says "the
# next day" rather than "today" matches none of it. The signal that a passage is
# anchored to one historical chart is not that it carries a date. It is that
# somebody is pointing at a screen.
#
# Deliberately narrow: matched against the decision being narrated, not against
# the pointing. "Right here" and "over here" are everywhere in this corpus and
# most of the time they sit on ordinary teaching. Six chunks in 2,976 match
# these, all of them in module walkthroughs, which is the intended blast radius.
WALKTHROUGH_NARRATION = [
    r"\b(that's|this is|here's)\s+your\s+sign\s+to\s+get\s+in\b",
    r"\bgood\s+time\s+to\s+get\s+(in|out)\b",
    r"\bgreat\s+time\s+to\s+get\s+in\b",
    r"\bwe\s+should\s+have\s+been\s+(out|in)\b",
    r"\btime\s+for\s+(us\s+)?to\s+get\s+(in|out)\b",
    r"\byou\s+(would|should|want\s+to)\s+(have\s+)?(collected|taken)\s+your\s+(money|profit)\b",
    r"\bcollected\s+your\s+money\b",
    r"\bthis\s+is\s+where\s+(you|we)\s+(get|would\s+get)\s+(in|out)\b",
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
    # One hit is enough. Everything else here needs two signals because a lone
    # date or ticker proves little, but a sentence telling the student when to
    # get in is already the whole problem.
    if any(re.search(p, low) for p in WALKTHROUGH_NARRATION):
        return "DATED_EXAMPLE"
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


# Technical analysis modules that arrived without a module number in their
# filename. They fell through to tf-options because that was the default, which
# made the bot cite the moving average and momentum teaching as part of the
# options course.
#
# That is a citation integrity bug of the same class as the Module 3 numbering
# error: prompts/system.md says a confident citation pointing at the wrong video
# is worse than none, because the student concludes the curriculum is
# inconsistent rather than that the bot erred. A student sent to the options
# course to learn about the 13 and 20 day averages will not find them.
#
# These are core technical analysis, and the method chain in system.md
# cites them as steps in it rather than as options material.
TF_CORE_UNNUMBERED = {
    "moving-averages-UNNUMBERED",
    "momentum-indicators-UNNUMBERED",
    "thinkorswim-setup-UNNUMBERED",
    # Volume. The lesson opens "Welcome to Volume" and states no number, and it
    # sits squarely in the technical analysis chain: it closes by telling
    # students it is "not just volume, it's about the candles, it's about
    # support and resistance", and it assumes both. Miscategorising this one
    # would be the worst of the set, because volume is the first primary in
    # indicator-hierarchy.md and the gate in three-is-the-charm.md.
    "volume-UNNUMBERED",
    # Trendlines, swing points and confluence. This was merged into Module 5 on
    # my inference and it is a separate lesson: Module 5 ends with its "Thanks
    # guys" sign-off and this one opens mid-sentence, "where we're going to
    # discuss trendlines, swing points, and confluence", because the paste lost
    # the front of its opening line. The module number it stated was in the
    # words that got cut. Cited by title until it states its own number again.
    "trendlines-swing-points-confluence-UNNUMBERED",
}


def course_for(path):
    if path.parent.name == "fb-live":
        return "fb-live"
    name = path.stem
    if name.startswith("module-") or name in TF_CORE_UNNUMBERED:
        return "tf-core"
    if name.startswith("paycheck-collector"):
        return "paycheck-collector"
    if name.startswith("live-session"):
        return "live-session"
    return "tf-options"


def module_for(path, meta):
    name = path.stem
    m = re.match(r"module-(\d+)", name)
    if m:
        return m.group(1).lstrip("0") or "0"
    if meta.get("order") is not None:
        return f"{meta['order']:04d}"
    return "UNNUMBERED"


def slug_for(path, module):
    """Middle segment of chunk_id. Unique per source, not per module number.

    chunk_id is the identity of a chunk and what a citation resolves to, so it
    has to be unique. It was not. Every unnumbered lesson got module
    "UNNUMBERED", so all eight options lessons produced tf-options:UNNUMBERED:0000
    and collided from the first chunk onward: 244 chunks sharing 97 ids across
    the corpus, and adding Volume to the unnumbered tf-core set would have
    widened the collision rather than caused it.

    Nothing was visibly broken because retrieval ranks chunk objects and cites
    from module_title and part. The id was simply not doing its job, and anything
    that later keys on it (dedup, feedback, a "show me that chunk again" lookup)
    would have silently mixed two lessons.

    Numbered modules keep the number, so tf-core:5:0001 is unchanged.
    corpus/schema.md already documents a slug form for documents, so this
    follows a shape the schema had rather than inventing one.
    """
    if module != "UNNUMBERED":
        return module
    return re.sub(r"[-_]?UNNUMBERED$", "", path.stem) or path.stem


RULINGS = ROOT / "rulings"

MAINTAINER_SECTIONS = re.compile(
    r"^(spelling|how this got settled|compliance note|provenance|"
    r"why this is recorded|status|changelog|open questions?)\b", re.I)


def ruling_chunks():
    """Index the rulings layer.

    This was missing and it was a real hole. prompts/system.md says a ruling
    beats a transcript wherever they conflict, and CLAUDE.md calls rulings
    current teaching. But nothing indexed them, so retrieval could never
    surface one: the bot was told to obey a layer it could not read.

    Chunked by heading like the written documents, and cited by name, for
    example: rulings/marubozu.md, "The definition the bot teaches".
    """
    out = []
    skip = {"README.md", "open-questions.md", "compliance-log.md"}
    for path in sorted(RULINGS.glob("*.md")):
        if path.name in skip:
            continue
        title, section, buf, seq = path.stem.replace("-", " "), "Opening", [], 0

        def flush(sec, body, seq):
            text = "\n\n".join(body).strip()
            if not text or MAINTAINER_SECTIONS.match(sec):
                return
            for i, piece in enumerate(pack(paragraphs(text))):
                for pat, repl in RETIRED_REWRITE:
                    piece = re.sub(pat, repl, piece, flags=re.I)
                verdict, reason = screen(piece)
                if verdict == "exclude":
                    dropped_written.append({"source_file": f"rulings/{path.name}",
                                            "section": sec, "reason": reason,
                                            "text": piece[:180]})
                    continue
                out.append({
                    "chunk_id": f"ruling:{path.stem}:{seq:02d}{i:02d}",
                    "course": "ruling", "module": path.stem,
                    "module_title": title, "timestamp": None,
                    "timestamp_estimated": False, "section": sec,
                    "part": sec, "tag": "EVERGREEN", "text": piece,
                    "recording_date": None, "video": None, "order": None,
                    "status": "CURRENT", "needs_review": verdict == "review",
                    "review_reason": reason,
                    "source_file": f"rulings/{path.name}",
                })

        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("# "):
                title = line[2:].strip()
            elif line.startswith("## "):
                flush(section, buf, seq); seq += 1
                section, buf = line[3:].strip(), []
            else:
                buf.append(line)
        flush(section, buf, seq)
    return out


WRITTEN = ROOT / "transcripts" / "written"

def written_chunks():
    """Chunk typed markdown by heading, per the written-document path in
    corpus/schema.md: a section heading replaces the timestamp, so this
    material is not blocked on the timestamp problem at all."""
    out = []
    for path in sorted(WRITTEN.glob("*.md")):
        if path.name == "README.md":
            continue
        title, section, buf = path.stem.replace("-", " ").title(), "Opening", []

        def flush(sec, body, seq):
            text = "\n\n".join(body).strip()
            if not text or MAINTAINER_SECTIONS.match(sec):
                return
            for i, piece in enumerate(pack(paragraphs(text))):
                for pat, repl in RETIRED_REWRITE:
                    piece = re.sub(pat, repl, piece, flags=re.I)
                verdict, reason = screen(piece)
                if verdict == "exclude":
                    dropped_written.append({"source_file": path.name,
                                            "section": sec, "reason": reason,
                                            "text": piece[:180]})
                    continue
                out.append({
                    "chunk_id": f"written:{path.stem}:{seq:02d}{i:02d}",
                    "course": "written", "module": path.stem,
                    "module_title": title, "timestamp": None,
                    "timestamp_estimated": False, "section": sec,
                    "part": sec, "tag": classify(piece), "text": piece,
                    "recording_date": None, "video": None, "order": None,
                    "status": "CURRENT", "needs_review": verdict == "review",
                    "review_reason": reason,
                    "source_file": f"written/{path.name}",
                })

        seq = 0
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("# "):
                title = line[2:].strip()
            elif line.startswith("## "):
                flush(section, buf, seq); seq += 1
                section, buf = line[3:].strip(), []
            else:
                buf.append(line)
        flush(section, buf, seq)
    return out


dropped_written = []


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
            chunk_id = f"{course}:{slug_for(path, module)}:{i:04d}"
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

    chunks.extend(written_chunks())
    chunks.extend(ruling_chunks())
    dropped.extend(dropped_written)

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

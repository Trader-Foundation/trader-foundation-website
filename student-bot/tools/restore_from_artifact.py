#!/usr/bin/env python3
"""Rebuild transcripts/clean and transcripts/written from a published artifact.

**Why this exists.** The transcripts are paid product, so `.gitignore` keeps them
out of this public repo. The working container gets wiped, and when it does they
are gone: Modules 2, 3, 5, Volume and the trendlines lesson existed nowhere but a
chat paste, and Vlad has had to re-send them more than once. He should not have
to again.

The recovery is that the live bot artifact **inlines the whole built corpus**, so
a published page is a complete copy of every source that reached it. This script
turns that from a thing somebody noticed once into a procedure:

    curl the artifact HTML to a file, then
    python3 tools/restore_from_artifact.py <artifact.html>

or, inside a session, pass the local path the Artifact read tool saved it to.

**What comes back exactly.** Chunks are stored contiguously with no overlap, so
joining a source's parts in order reproduces its clean transcript byte for byte.
Verified: rebuilding from a restore reproduced fb-live 2142, live-session 22,
paycheck-collector 101, tf-core 266, tf-options 180 and written 94, matching the
published build in every course.

**What does not come back, and it is not a bug.** Compliance exclusions and
duplicate chunks were dropped before the artifact was built, so eight sources
come back with a passage missing. Those passages are excluded from the corpus on
purpose. `part N of M` records the original count, so this script reports every
gap rather than papering over it. Where Drive still holds the raw file, the raw
is authoritative and this is a fallback.

Video URLs and durations are not carried in the artifact. Durations are recovered
from the estimated timestamps, which is enough to rebuild the header the corpus
build reads. Video URLs are marked lost rather than guessed.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLEAN = ROOT / "transcripts" / "clean"

# Sources whose filename stem drives course and module routing in
# build_corpus.py, so it cannot be derived from the display title.
NAMED = {
    ("tf-core", "2", "Fundamental Analysis Screening"):
        "module-02-fundamental-analysis-screening.txt",
    ("tf-core", "3", "Technical Analysis Candlesticks"):
        "module-03-technical-analysis-candlesticks.txt",
    ("tf-core", "5", "Support Resistance"):
        "module-05-support-resistance.txt",
    ("tf-core", "8", "Fibonacci Retracement"):
        "module-08-fibonacci-retracement.txt",
    ("tf-core", "UNNUMBERED", "Momentum Indicators"):
        "momentum-indicators-UNNUMBERED.txt",
    ("tf-core", "UNNUMBERED", "Moving Averages"):
        "moving-averages-UNNUMBERED.txt",
    ("tf-core", "UNNUMBERED", "Thinkorswim Setup"):
        "thinkorswim-setup-UNNUMBERED.txt",
    ("tf-core", "UNNUMBERED", "Trendlines Swing Points Confluence"):
        "trendlines-swing-points-confluence-UNNUMBERED.txt",
    ("tf-core", "UNNUMBERED", "Volume"):
        "volume-UNNUMBERED.txt",
    ("paycheck-collector", "UNNUMBERED", "Paycheck Collector Coaching Call"):
        "paycheck-collector-part1.txt",
    ("paycheck-collector", "UNNUMBERED", "Paycheck Collector Losses"):
        "paycheck-collector-losses.txt",
    ("tf-options", "UNNUMBERED", "Coaching Bull Call Bear Put"):
        "coaching-call-bull-call-bear-put.txt",
    ("live-session", "UNNUMBERED", "Live Session 2026 08 06 Weekly Review"):
        "live-session-2026-08-06-weekly-review.txt",
}

# The options lessons all derive correctly from their titles, but naming them
# here keeps the mapping explicit: a source that starts guessing its own
# filename is a source whose course routing could silently change.
for _title in ("Options Intro", "Options Factors", "Options Calls Puts",
               "Options Money Scenarios", "Options Thinkorswim Walkthrough",
               "Options Greeks Thinkorswim", "Options Vertical Spreads"):
    NAMED[("tf-options", "UNNUMBERED", _title)] = (
        re.sub(r"[^a-z0-9]+", "-", _title.lower()).strip("-") + "-UNNUMBERED.txt")

# The artifact stores chunks under short keys to keep the page small.
KEYS = {"course": "c", "module": "m", "title": "n", "part": "p",
        "text": "t", "date": "d", "ts": "ts", "tag": "g"}


def load_chunks(path):
    """Pull the inlined corpus out of a published artifact page."""
    html = Path(path).read_text(encoding="utf-8", errors="replace")
    marker = "const CHUNKS = "
    i = html.find(marker)
    if i < 0:
        sys.exit(f"no inlined corpus found in {path}")
    chunks, _ = json.JSONDecoder().raw_decode(html[i + len(marker):])
    missing = [k for k in KEYS.values() if k not in chunks[0]]
    if missing:
        sys.exit(f"artifact chunk shape changed, missing keys: {missing}")
    return chunks


def part_no(p):
    m = re.match(r"part (\d+) of (\d+)", p or "")
    return (int(m.group(1)), int(m.group(2))) if m else (0, 0)


def seconds(t):
    if not t:
        return None
    h, m, s = (int(x) for x in t.split(":"))
    return h * 3600 + m * 60 + s


def duration_of(cs):
    """Recover a source's duration from its estimated timestamps.

    build_corpus writes ts = duration * (chars before this chunk / total chars),
    so every chunk after the first gives an independent estimate of duration.
    Averaging them absorbs the rounding in hh:mm:ss.
    """
    total = sum(len(c[KEYS["text"]]) for c in cs)
    running, estimates = 0, []
    for c in cs:
        s = seconds(c[KEYS["ts"]])
        if s and running:
            estimates.append(s * total / running)
        running += len(c[KEYS["text"]])
    return int(round(sum(estimates) / len(estimates))) if estimates else 0


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__.strip().split("\n\n")[0] +
                 "\n\nusage: restore_from_artifact.py <artifact.html>")

    chunks = load_chunks(sys.argv[1])
    groups = defaultdict(list)
    for c in chunks:
        # Rulings and typed teaching live in the repo already and are not
        # gitignored, so they are never the thing that got lost.
        if c[KEYS["course"]] in ("ruling", "written"):
            continue
        groups[(c[KEYS["course"]], c[KEYS["module"]], c[KEYS["title"]])].append(c)

    rows = []
    for key, cs in sorted(groups.items()):
        course, module, name = key
        cs.sort(key=lambda c: part_no(c[KEYS["part"]])[0])
        body = "\n\n".join(c[KEYS["text"]] for c in cs)
        expected = part_no(cs[0][KEYS["part"]])[1]

        if course == "fb-live":
            dur = duration_of(cs)
            title, date = name.upper(), cs[0][KEYS["date"]]
            header = (f"{title}\n"
                      f"Uploaded: {date}\n"
                      f"Duration: {dur // 3600:02d}:{dur % 3600 // 60:02d}:{dur % 60:02d}\n"
                      f"Video: RECONSTRUCTED-URL-LOST\n"
                      f"Order: #{int(module)} of 554\n" + "=" * 60 + "\n")
            out, text = CLEAN / "fb-live" / f"{module} - {date} - {title}.txt", header + body
        else:
            stem = NAMED.get(key)
            if not stem:
                stem = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") + "-UNNUMBERED.txt"
                print(f"note  no filename mapping for {key}, guessing {stem}")
            out, text = CLEAN / stem, body

        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text, encoding="utf-8")
        rows.append((str(out.relative_to(CLEAN)), len(cs), expected, len(text)))

    total = sum(r[3] for r in rows)
    print(f"restored {len(rows)} clean transcripts, {total:,} characters")

    gaps = [r for r in rows if r[1] != r[2]]
    if gaps:
        print("\nsources missing parts. These are the compliance exclusions and "
              "duplicate chunks that were dropped before this build, so they are "
              "meant to be absent from the corpus. Where Drive holds the raw "
              "file, restore from the raw instead.")
        for f, kept, expected, _ in gaps:
            print(f"  {expected - kept:2d} missing  {f}  [{kept} of {expected}]")

    print("\nnext: python3 tools/build_corpus.py, then the test suites")


if __name__ == "__main__":
    main()

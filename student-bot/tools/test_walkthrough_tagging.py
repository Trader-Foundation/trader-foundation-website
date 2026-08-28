#!/usr/bin/env python3
"""Entry and exit narration in a chart walkthrough must tag DATED_EXAMPLE.

rulings/compliance-log.md recorded this mitigation and it was never implemented.
The Volume module surfaced that: 22 chunks narrating a Tesla walkthrough, all
tagged EVERGREEN, including five that tell the student when to get in and out.

This test exists so that cannot happen again quietly. It checks the classifier
directly, and then checks the built corpus, because the bug was that the two
disagreed with the log rather than with each other.
"""
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("bc", ROOT / "tools" / "build_corpus.py")
bc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bc)

# Quoted from the Volume and Moving Averages walkthroughs.
MUST_BE_DATED = [
    "The volume is pretty decent for a second day in a row. That's your sign to "
    "get in for what you call a breakout, which is a great momentum play.",
    "But when you start seeing the red line, it's a good time to get out.",
    "we should have been out and then let this happen",
    "So you want to make sure that you collected your money based on this increase.",
    "we see a nice solid candle that moved up. We like that. This is a great time "
    "to get in on this stuff.",
]

# Teaching that points at a chart without narrating a decision. These are the
# false positives the rule is kept narrow to avoid: "right here" and "over here"
# are everywhere in this corpus and mostly sit on ordinary teaching.
MUST_NOT_BE_DATED = [
    "So if I put a circle around this volume, anytime you see the bullish volume, "
    "it represents a bullish move.",
    "Volume is the amount of shares being traded. The more volume in a certain "
    "direction, the more the stock is accelerated to the same destination.",
    "Just think about a car. For a car to go, the number one thing it needs is "
    "fuel. In this scenario, volume is our gas.",
    "There is very low volume. Yeah, the stock went up, but because it was on low "
    "volume, it did not sustain. There was not enough gas and it died.",
    "One of them is the flat pattern, also known as the random pattern. This one "
    "usually happens during certain times of uncertainty. Then we have the U pattern.",
]

fails = []

for text in MUST_BE_DATED:
    got = bc.classify(text)
    ok = got == "DATED_EXAMPLE"
    print(f"{'ok  ' if ok else 'FAIL'}  want=DATED_EXAMPLE  got={got:20}  {text[:58]}...")
    if not ok:
        fails.append(text)

for text in MUST_NOT_BE_DATED:
    got = bc.classify(text)
    ok = got != "DATED_EXAMPLE"
    print(f"{'ok  ' if ok else 'FAIL'}  want=not dated      got={got:20}  {text[:58]}...")
    if not ok:
        fails.append(text)

# And against the built corpus, which is what the bot actually reads.
chunks_path = ROOT / "corpus" / "chunks.json"
if chunks_path.exists():
    data = json.loads(chunks_path.read_text())
    chunks = data if isinstance(data, list) else data.get("chunks", data)

    ids = [c["chunk_id"] for c in chunks]
    if len(ids) != len(set(ids)):
        dupes = len(ids) - len(set(ids))
        print(f"FAIL  {dupes} chunk ids are not unique")
        fails.append("duplicate chunk ids")
    else:
        print(f"ok    {len(ids)} chunk ids, all unique")

    import re
    leaked = [
        c for c in chunks
        if c["tag"] != "DATED_EXAMPLE"
        and any(re.search(p, c["text"], re.I) for p in bc.WALKTHROUGH_NARRATION)
    ]
    if leaked:
        for c in leaked:
            print(f"FAIL  {c['chunk_id']} narrates an entry or exit and is {c['tag']}")
        fails.append("untagged walkthrough narration in corpus")
    else:
        n = sum(1 for c in chunks if c["tag"] == "DATED_EXAMPLE")
        print(f"ok    no walkthrough narration outside DATED_EXAMPLE ({n} dated chunks)")
else:
    print("note  corpus/chunks.json not built, skipped corpus checks")

print(f"\npass {len(MUST_BE_DATED) + len(MUST_NOT_BE_DATED) + 2 - len(fails)}  fail {len(fails)}")
sys.exit(1 if fails else 0)

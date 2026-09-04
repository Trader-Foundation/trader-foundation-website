#!/usr/bin/env python3
"""Stated win rates must not reach the corpus, and options mechanics must.

Non-negotiable 2 makes the 70 percent target win rate the only permitted
results language. Three chunks were live in the corpus saying otherwise, found
by sweeping for the whole class rather than the one phrase Vlad happened to
re-send. This suite exists so they cannot come back.

**The hard part is not catching them, it is not catching delta.** Options
mechanics state probabilities constantly: "90% chance it expires out the
money", "83% chance", "11 Delta". Those are facts about a contract, not
promises about a student, and a rule that eats them would gut the options
teaching to remove a claim that was never there. Every pattern here therefore
requires the language of winning, or "right" sitting directly in front of the
figure.

The third block is the partial-redaction check. "the 90 over 90 percent chance
of win" rendered as "the 90 over [FIGURE REMOVED] chance of win" still states
the figure, and the marker makes a reader stop looking. That has now happened
twice in this project, so it gets a test rather than a comment.
"""
import pathlib
import re
import sys

src = pathlib.Path("tools/build_corpus.py").read_text()
i = src.index("RETIRED_REWRITE = [")
j = re.search(r"^\]", src[i:], re.M).end() + i
ns = {"re": re}
exec(src[i:j], ns)
REWRITE = ns["RETIRED_REWRITE"]


def scrub(text):
    for pat, repl in REWRITE:
        text = re.sub(pat, repl, text, flags=re.I)
    return text


fails = []


def check(name, text, must_go, must_stay=()):
    out = scrub(text)
    problems = []
    for token in ([must_go] if isinstance(must_go, str) else must_go):
        if token and token.lower() in out.lower():
            problems.append(f"still states {token!r}")
    for token in must_stay:
        if token.lower() not in out.lower():
            problems.append(f"lost {token!r}")
    # A marker with digits still hanging off the front is worse than no marker.
    for m in re.finditer(r"\[FIGURE REMOVED\]", out):
        before = out[max(0, m.start() - 40):m.start()]
        if re.search(r"\d[\d,\s]*\s*(?:%|percent)?\s*(?:to|through|over|-)\s*$", before):
            problems.append("partial redaction, digits left in front of the marker")
    if problems:
        fails.append(name)
    print(f"{'ok  ' if not problems else 'FAIL'}  {name}")
    if problems:
        for p in problems:
            print(f"        {p}")
        print(f"        got: {out.strip()[:120]}")


print("1. stated win rates are stripped, and the teaching around them survives\n")

check("right N percent of the time",
      "if you're wrong one time max loss You'll be right 90 percent of the time "
      "for that max loss.",
      must_go="90 percent of the time",
      must_stay=["max loss", "[FIGURE REMOVED]"])

check("N percent chance of winning",
      "the risk. It's kind of high. I noticed you have a 90 percent chance of "
      "winning, but if you lose, if the market tanks",
      must_go="90 percent chance",
      must_stay=["the risk", "if you lose", "[FIGURE REMOVED]"])

check("compound: N over N percent chance of win",
      "buy something one outside the Bollinger band and that's going to give you "
      "the 90 over 90 percent chance of win. Guess what? You ain't collecting "
      "anything on this",
      must_go=["90 over", "90 percent chance"],
      must_stay=["Bollinger band", "ain't collecting", "[FIGURE REMOVED]"])

check("percent sign form",
      "you'll be right 85% of the time on these",
      must_go="85%",
      must_stay=["[FIGURE REMOVED]"])

print("\n2. options mechanics are NOT touched. Delta is a probability, not a promise\n")

for name, text in [
    ("delta as expiry probability",
     "a 12 Delta which still is in the range of 90% chance it expires out the money"),
    ("bare delta probability",
     "It's 11 Delta. 83% chance it's spooky. 39 cents."),
    ("what delta does not mean",
     "It does not mean there's a 50% chance it will happen. It's just saying 50% of the move"),
    ("the 90 percent who lose",
     "The reality is that 90 percent lose money."),
    ("share of decision making",
     "So the 90 percent of my decision making and most professionals is technical analysis."),
    ("self deprecating, not a promise",
     "And 80 percent of the time I'm usually wrong the next day."),
    ("fibonacci level",
     "right 50% retracement brings you up to around 65"),
    ("theta decay curve",
     "60 percent decay in the first part, 80 percent and the last week just 90%, 95, 97"),
    ("gap folklore",
     "the idea that all gaps get filled that about 80% true, but there's no timeline"),
]:
    out = scrub(text)
    ok = out == text
    if not ok:
        fails.append(name)
    print(f"{'ok  ' if ok else 'FAIL'}  {name}")
    if not ok:
        print(f"        was: {text}")
        print(f"        now: {out}")

print("\n3. the built corpus is clean of the whole class\n")

import json
corpus = pathlib.Path("corpus/chunks.json")
if corpus.exists():
    chunks = json.loads(corpus.read_text())
    LIVE = [
        (r"\bright\s+\d{1,3}\s*(?:%|percent)\s+of\s+the\s+time", "stated win rate"),
        (r"\b\d{1,3}\s*(?:%|percent)\s+chance\s+of\s+winn?", "stated win rate"),
        (r"\b(?:i|we)\s+(?:was|were)\s+up\s+\d{1,3}\s*(?:%|percent)", "realised performance"),
        (r"\bwon all (?:four|five|six|them all)\b", "realised performance"),
    ]
    hits = 0
    for c in chunks:
        for pat, label in LIVE:
            m = re.search(pat, c["text"], re.I)
            if m:
                hits += 1
                fails.append(f"{label} live in {c['chunk_id']}")
                print(f"FAIL  {label} live in {c['chunk_id']}")
                print(f"        ...{c['text'][max(0, m.start()-70):m.start()+80]}...")
    print(f"{'ok  ' if not hits else 'FAIL'}  {len(chunks)} chunks, {hits} carrying a win rate "
          f"or a realised performance claim")
else:
    print("note  corpus/chunks.json not built, skipping the live check")

print()
if fails:
    print(f"{len(fails)} failures")
    for f in fails:
        print("  -", f)
else:
    print("All clear.")
sys.exit(1 if fails else 0)

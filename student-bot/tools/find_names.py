#!/usr/bin/env python3
"""Propose person-name candidates in raw transcripts, for review.

Redaction protects real people, so the name list has to be right. Hand typing
it does not survive 555 sessions, and a fully automatic rule would silently
miss someone. So this splits the job: discovery is automatic and generous,
the list is reviewed by a human, and redaction is mechanical against the
reviewed list.

Signals used, all cheap and all conservative:
  - a capitalised word appearing mid sentence, so sentence starts do not count
  - a vocative pattern, "thanks Dave", "hey Dave", "Dave, what do you think"
  - not a known trading term, ticker, month, weekday or place

Output is a ranked candidate list. Nothing is redacted here.

Usage:
    python3 tools/find_names.py transcripts/raw/fb-live/*.txt
    python3 tools/find_names.py --min 2 transcripts/raw/fb-live/*.txt
"""
import re
import sys
import json
import pathlib
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Words that are capitalised in these transcripts but are not people.
NOT_PEOPLE = set("""
A An The And But Or So Now Then That This These Those There Here What When Where Why How
Who Which If As At By For From In Into On Of To Up Down Out Over Under With Without
I I'm I'll I've It It's We We're They You Your Yeah Yep Yes No Nope Okay OK Alright All Right
Uh Um Hey Hi Hello Thanks Thank Please Sorry Good Great Nice Cool Awesome Boom Peace
Monday Tuesday Wednesday Thursday Friday Saturday Sunday
January February March April May June July August September October November December
Jan Feb Mar Apr Jun Jul Aug Sep Sept Oct Nov Dec
Fibonacci Bollinger Bands Band Marubozu Doji Hammer Engulfing Harami Stochastics Stochastic
RSI MACD SMA EMA VWAP ATR ADX OBV DMI CCI ITM OTM ATM DTE IV HV ROI EPS ETF IPO
Call Calls Put Puts Bull Bear Bullish Bearish Long Short Strike Premium Delta Gamma Theta Vega Rho
America American Fed Federal Reserve Wall Street NASDAQ NYSE Dow Jones
Google Apple Amazon Microsoft Tesla Netflix Meta Facebook Nvidia Starbucks Walmart Target
Trader Foundation Paycheck Collector Predator Masterclass Vimeo Zoom YouTube
Live Video Duration Uploaded Order English Christmas Thanksgiving Easter Halloween
God Lord Jesus Sir Mr Mrs Ms Dr
Well Again Like High Low Ooh Wait Actually Anyway Not Are Hmm Year Zone Really Same
Trend Doc Also Just Maybe Because Since Every Each Both Once Sure Right Look Looks
Remember Notice Watch Listen Think Guys Folks Everyone Everybody Somebody Anybody
Mondays Tuesdays Wednesdays Thursdays Fridays Saturdays Sundays
Disney Verizon Alta Costco Chipotle Boeing Intel Cisco Oracle Adobe Salesforce Uber Lyft
Pfizer Moderna Exxon Chevron Delta United Southwest Ford Roku Shopify Snap Spotify
""".split())

# The name class must stay case sensitive. An re.I on the whole pattern makes
# [A-Z] match lowercase, which scored "know", "again" and "well" as names.
# Case insensitivity is scoped to the trigger words only.
VOCATIVE = re.compile(
    r"(?i:\b(?:hey|hi|hello|thanks|thank you|yo|welcome|good morning|"
    r"good afternoon|what's up|whats up)\s+)([A-Z][a-z]{2,14})\b"
    r"|\b([A-Z][a-z]{2,14})\s*,\s*(?i:what|how|do|did|are|you|thanks|thank|yes|no|"
    r"good|nice|welcome|great)\b", re.M)

MIDSENTENCE = re.compile(r"(?<![.!?\"'\n])(?<!^)\s([A-Z][a-z]{2,14})\b", re.M)


def scan(paths, min_count=2):
    vocative, midsent, files_seen = Counter(), Counter(), Counter()
    for p in paths:
        text = pathlib.Path(p).read_text(encoding="utf-8", errors="replace")
        body = text.split("=" * 20, 1)[-1]        # drop the metadata header
        here = set()
        for m in VOCATIVE.finditer(body):
            name = (m.group(1) or m.group(2) or "").strip()
            name = name[:1].upper() + name[1:].lower() if name else ""
            if name and name not in NOT_PEOPLE:
                vocative[name] += 1
                here.add(name)
        for m in MIDSENTENCE.finditer(body):
            name = m.group(1)
            if name not in NOT_PEOPLE:
                midsent[name] += 1
        for n in here:
            files_seen[n] += 1

    rows = []
    for name in set(vocative) | set(midsent):
        v, s = vocative[name], midsent[name]
        if v == 0 and s < 6:      # capitalised once or twice is usually noise
            continue
        if v + s < min_count:
            continue
        # A vocative is strong evidence; mid sentence alone is weak.
        confidence = "high" if v >= 2 else "medium" if v == 1 else "low"
        rows.append({"name": name, "vocative": v, "midsentence": s,
                     "files": files_seen[name], "confidence": confidence})
    rows.sort(key=lambda r: (-{"high": 2, "medium": 1, "low": 0}[r["confidence"]],
                             -r["vocative"], -r["midsentence"]))
    return rows


def main():
    args = sys.argv[1:]
    min_count = 2
    if "--min" in args:
        i = args.index("--min")
        min_count = int(args[i + 1]); del args[i:i + 2]
    if not args:
        sys.exit("usage: find_names.py [--min N] FILE [FILE ...]")
    rows = scan(args, min_count)
    out = ROOT / "glossary/name-candidates.json"
    out.write_text(json.dumps(rows, indent=1))
    print(f"{'name':<16} {'voc':>4} {'mid':>5} {'files':>6}  confidence")
    print("-" * 50)
    for r in rows:
        print(f"{r['name']:<16} {r['vocative']:>4} {r['midsentence']:>5} "
              f"{r['files']:>6}  {r['confidence']}")
    print(f"\n{len(rows)} candidates over {len(args)} files -> {out}")
    print("Review before redacting. High confidence means a vocative was seen.")


if __name__ == "__main__":
    main()

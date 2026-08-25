#!/usr/bin/env python3
"""Assemble what the bot sees for a question: guard verdict plus retrieved passages.

Usage:
    python3 tools/ask.py "what is a marubozu"
    python3 tools/ask.py --json "how much can i make"

This is the retrieval half of the bot. It runs the guard rules and BM25 over
corpus/chunks.json and prints the exact context block an answering model would
be given, alongside prompts/system.md.

Keeping this separate from the answering step is deliberate: retrieval is
testable and reproducible, generation is not. When an answer is wrong, this
tells you whether the retrieval was wrong or the wording was.
"""

import json
import math
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHUNKS = json.loads((ROOT / "corpus/chunks.json").read_text())

# Guard rules, kept in step with tools/guards.cjs. That file is the one the
# bench page uses and the one the test suite exercises.
NOT_TICKERS = set((
    "I A OK IT IS MY THE AND FOR BUT NOT YOU ALL ANY CAN DO HOW WHY WHO "
    "CALL PUT CALLS PUTS RSI MACD SMA EMA VWAP ATR ADX OBV BB DMI CCI "
    "ITM OTM ATM DTE IV HV OI PL PNL ROI EPS PE IPO ETF ETN LEAP LEAPS "
    "TOS FB LIVE AM PM EOD EST PST USD TA SL TP RR").split())

def has_ticker(q):
    return any(t not in NOT_TICKERS for t in re.findall(r"\b[A-Z]{2,5}\b", q))

GUARDS = [
    ("retired", "Blocked", "non-negotiable 8, retired terms",
     lambda q: re.search(r"\belite\s*(four|4|12|twelve)\b", q, re.I)),
    ("outcome", "Refuse and route", "non-negotiables 1 and 2, outcome claims",
     lambda q: re.search(
         r"(how much|how many).*(make|earn|money|profit|return)|win\s*rate|"
         r"average return|per (week|month|year)|realistic(ally)? (make|expect)|"
         r"students? (make|earn)|get rich|replace my (income|job|salary)", q, re.I)),
    ("chart", "Cannot see it", "non-negotiable 4, plus the-chart-decides ruling",
     lambda q: re.search(
         r"(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|"
         r"confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|"
         r"breakout|bounce)|on my chart|my (chart|screen|position)", q, re.I)),
    ("position", "Refuse and route", "non-negotiable 3, no position advice",
     lambda q: re.search(
         r"\b(should i|do i|would you|shall i|can i|is it worth|worth it to)\b.*"
         r"\b(buy|sell|enter|exit|close|hold|roll|add|take|cut|trim)\b|"
         r"\b(strike|expiration|expiry|entry|exit|stop loss|position siz|how many contracts)\b|"
         r"\bi(?:'m| am) in\b|\bmy (trade|position|contracts?|spread|order)\b|"
         r"going against me|\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b",
         q, re.I) or has_ticker(q)),
    ("predict", "Refuse and route", "prediction is outside the method",
     lambda q: re.search(
         r"\bwill (it|this|that|the (stock|market|price)|we|prices?)\b|"
         r"\bis (the )?(market|spy|it) (bullish|bearish|going)|what (will|is going to) happen|"
         r"where (is|will) (it|this|the stock|the market) (go|going|head)|"
         r"\b(next week|tomorrow|by friday|end of (the )?week)\b.*\?", q, re.I)),
    ("procedure", "Hand to the video", "perishable procedure layer",
     lambda q: re.search(
         r"\b(where do i click|how do i (set up|setup|install|configure|find the|draw|add|apply)|"
         r"which (tab|menu|button)|thinkorswim|platform setting|chart setup|screener|screening|"
         r"scan(ner)? setting|what (volume )?filter)\b", q, re.I)),
]

def guard_for(q):
    for gid, verdict, rule, test in GUARDS:
        if test(q):
            return {"id": gid, "verdict": verdict, "rule": rule}
    return None

STOP = set((
    "a an the and or but if of to in on at is are was were be been do does did i you it "
    "my your this that these those for with as from what how when where why which who whom "
    "can could should would will shall me we they them he she his her its about into over "
    "under s t").split())

def stem(w):
    """Light suffix stripping, with a floor.

    The floor matters: an earlier version turned "greed" into "gre" by
    stripping "ed" from a noun, so a student asking about greed could never
    reach six passages where a coach says "don't get greedy". Nothing under
    four characters survives stripping now.

    This is still a weak stemmer. Prefix expansion at query time is what
    actually bridges greed/greedy, patience/patient, emotion/emotional.
    """
    for suf, rep in (("ies", "y"), ("sses", "s"), ("shes", "s"), ("ches", "s"), ("xes", "s")):
        if w.endswith(suf) and len(w) - len(suf) + len(rep) >= 4:
            return w[: -len(suf)] + rep
    for suf in ("ing", "ed", "es", "s"):
        if w.endswith(suf) and len(w) - len(suf) >= 4:
            return w[: -len(suf)]
    return w

def toks(s):
    return [stem(w) for w in re.findall(r"[a-z][a-z0-9']+", s.lower())
            if w not in STOP and len(w) > 1]

DOCS, DF = [], {}
for c in CHUNKS:
    tf = {}
    t = toks(c["text"])
    for w in t:
        tf[w] = tf.get(w, 0) + 1
    for w in tf:
        DF[w] = DF.get(w, 0) + 1
    DOCS.append((c, tf, len(t)))
AVG = sum(d[2] for d in DOCS) / max(1, len(DOCS))

PREFIX_MIN = 5

def expand(term):
    """Index terms reachable from a query term, itself plus prefix matches.

    Bridges the pairs a light stemmer cannot: greed and greedy, patience and
    patient, emotion and emotional, discipline and disciplined. Only fires for
    terms of five characters or more, so short words do not over-match, and is
    capped so one query term cannot dominate the score.
    """
    if term in DF:
        return [term]
    if len(term) < PREFIX_MIN:
        return []
    pre = term[:PREFIX_MIN]
    hits = sorted((t for t in DF if t.startswith(pre)), key=lambda t: (len(t), t))
    return hits[:4]

def search(q, n=6, k1=1.4, b=0.72):
    raw = list(dict.fromkeys(toks(q)))
    qt = list(dict.fromkeys([e for t in raw for e in expand(t)]))
    if not qt:
        return []
    N = len(DOCS)
    scored = []
    for c, tf, ln in DOCS:
        s = 0.0
        for w in qt:
            f = tf.get(w)
            if not f:
                continue
            idf = math.log(1 + (N - DF[w] + 0.5) / (DF[w] + 0.5))
            s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * ln / AVG))
        if s > 0:
            scored.append((s, c))
    scored.sort(key=lambda x: -x[0])
    return scored[:n]

def cite(c):
    if c["course"] == "tf-core":
        base = f"Module {c['module']}"
    elif c["course"] == "fb-live":
        base = f"FB Live #{c['module']}"
        if c.get("recording_date"):
            base += f" ({c['recording_date']})"
    else:
        base = f"{c['course']}, {c['module_title']}"
    if c.get("timestamp"):
        base += f", around {c['timestamp'].lstrip('0:') or '0:00'}"
        if c.get("timestamp_estimated"):
            base += " (estimated)"
    else:
        base += f", {c['part']}"
    return base

def main():
    args = [a for a in sys.argv[1:] if a != "--json"]
    as_json = "--json" in sys.argv
    if not args:
        sys.exit('usage: ask.py "your question"')
    q = " ".join(args)
    g = guard_for(q)
    hits = search(q)

    if as_json:
        print(json.dumps({
            "question": q,
            "guard": g,
            "passages": [{"cite": cite(c), "tag": c["tag"],
                          "score": round(s, 2), "text": c["text"]}
                         for s, c in hits],
        }, indent=1))
        return

    print(f"QUESTION: {q}\n")
    if g:
        print(f"GUARD FIRED: {g['id']}  ->  {g['verdict']}")
        print(f"  rule: {g['rule']}")
        print("  The passages below are context for the hand off, not an answer to read out.\n")
    else:
        print("GUARD: none fired. Answer from the passages below, or say the corpus")
        print("  does not cover it and route to a coach. Never fill the gap from")
        print("  general trading knowledge.\n")

    if not hits:
        print("NO PASSAGES MATCHED. The bot says it does not have this and routes to a coach.")
        return
    for s, c in hits:
        print(f"--- {cite(c)}  [{c['tag']}]  score {s:.1f}")
        print(c["text"])
        print()

if __name__ == "__main__":
    main()

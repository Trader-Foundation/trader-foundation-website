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
    "TOS FB LIVE PM EOD EST PST USD TA EMA9 SL TP RR").split())
# AM is deliberately absent: it is Antero Midstream, a ticker this curriculum
# teaches, and listing it let "Should I buy AM right now?" through as a
# non-position question. That is test R1.

def has_ticker(q):
    return any(t not in NOT_TICKERS for t in re.findall(r"\b[A-Z]{2,5}\b", q))

# Two things have to be separated here, and an earlier version of this file did
# not separate them. "How do I pick which strike to sell" is the curriculum
# asking to be taught. "Which strike should I sell on my RVN trade" is position
# advice. The words strike, expiration and exit appear in both, so they cannot
# fire the guard alone. Something has to tie the question to a live position.
#
# guards.cjs had this fix and this file did not, so the command line refused two
# questions the bench answered. A bench that scores differently from the tool
# makes the testing lie, which is the same failure the stemmer had.
WALKTHROUGH = re.compile(
    r"\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b", re.I)
SPECIFIC = re.compile(
    r"\bmy (trade|position|contracts?|spread|order|call|put|strike)\b|"
    r"\bi(?:'m| am) in\b|\bi (bought|sold|entered|opened|own|hold)\b|"
    r"going against me|getting tested|underwater|in the (red|money|green)\b|"
    r"\b\d+(\.\d+)?\s*(strike|call|put)s?\b", re.I)
ASKING_WHAT_TO_DO = re.compile(
    r"\b(should i|do i|would you|shall i|can i|is it worth|worth it to|"
    r"when (do|should) i|what (do|should) i)\b|"
    r"\b(roll|cut|close|exit|hold|add to|trim|sell|buy)\b|"
    r"\b(strike|expiration|expiry|entry|exit|stop loss|position siz|"
    r"how many contracts)\b", re.I)

def position_guard(q):
    # Walking someone through placing a trade needs no second signal. It is the
    # closest the corpus comes to putting a student in a position.
    if WALKTHROUGH.search(q):
        return True
    if not (SPECIFIC.search(q) or WALKTHROUGH.search(q) or has_ticker(q)):
        return False
    return bool(ASKING_WHAT_TO_DO.search(q))

# Has the student marked the chart themselves? The marked chart exception in
# hard rule 4 turns on this and on nothing else. Colour words are in here
# because that is how students actually say it: "the blue lines is lines i
# drew as support resistance".
MARKED = re.compile(
    r"\b(?:i|we)\s+(?:drew|drawn|marked|added|put)\b|"
    r"\b(?:my|the)\s+(?:blue|red|green|yellow|orange|purple|white|black)\s+lines?\b|"
    r"\bmy\s+(?:support|resistance|levels?|lines?|marks?)\b|"
    r"\blines?\s+i\s+drew\b|"
    r"\b(?:drew|marked)\s+(?:in\s+)?(?:my|the)\s+(?:support|resistance|levels?|lines?)\b|"
    r"\bi(?:'ve| have)\s+(?:drawn|marked)\b", re.I)

# Each test takes (question, ctx). ctx carries what the text cannot, namely
# whether an image came with the question: {"image": True}.
GUARDS = [
    ("retired", "Blocked", "non-negotiable 8, retired terms",
     lambda q, c: re.search(r"\belite\s*(four|4|12|twelve)\b", q, re.I)),
    ("outcome", "Refuse and route", "non-negotiables 1 and 2, outcome claims",
     lambda q, c: re.search(
         r"(how much|how many).*(make|earn|money|profit|return)|win\s*rate|"
         r"average return|per (week|month|year)|realistic(ally)? (make|expect)|"
         r"students? (make|earn)|get rich|replace my (income|job|salary)", q, re.I)),
    # The two image states come first. An uploaded chart changes the shape of
    # the answer before any text rule applies. See
    # rulings/chart-with-student-levels.md.
    ("chart_marked", "Check their marks",
     "non-negotiable 4 as amended, chart-with-student-levels ruling",
     lambda q, c: c.get("image") and MARKED.search(q)),
    ("chart_unmarked", "Send them to mark it",
     "chart-with-student-levels ruling, the student marks it first",
     lambda q, c: c.get("image")),
    ("chart", "Cannot see it", "non-negotiable 4, plus the-chart-decides ruling",
     lambda q, c: re.search(
         r"(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|"
         r"confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|"
         r"breakout|bounce)|on my chart|"
         r"\b(this|that|these|those|my)\s+(chart|screenshot|screen|setup|candles?)\b|"
         r"\bmy (support|resistance|levels?|lines?)\b|"
         r"my position", q, re.I)),
    ("position", "Refuse and route", "non-negotiable 3, no position advice",
     lambda q, c: position_guard(q)),
    ("predict", "Refuse and route", "prediction is outside the method",
     lambda q, c: re.search(
         r"\bwill (it|this|that|the (stock|market|price)|we|prices?)\b|"
         r"\bis (the )?(market|spy|it) (bullish|bearish|going)|what (will|is going to) happen|"
         r"where (is|will) (it|this|the stock|the market) (go|going|head)|"
         r"\b(next week|tomorrow|by friday|end of (the )?week)\b.*\?", q, re.I)),
    ("procedure", "Hand to the video", "perishable procedure layer",
     lambda q, c: re.search(
         r"\b(where do i click|how do i (set up|setup|install|configure|find the|draw|add|apply)|"
         r"which (tab|menu|button)|thinkorswim|platform setting|chart setup|screener|screening|"
         r"scan(ner)? setting|what (volume )?filter)\b", q, re.I)),
]

def guard_for(q, ctx=None):
    ctx = ctx or {}
    for gid, verdict, rule, test in GUARDS:
        if test(q, ctx):
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

# Curated bridges from the words a student uses to the words the curriculum
# uses. Prefix expansion cannot reach these, because the pairs share no prefix.
#
# The case that forced this: the psychology material teaches "you will see red"
# at length, and a student types "my position is down" or "i am losing money".
# The teaching was there and unreachable.
#
# This list is deliberately short and one directional, student word to house
# word. Every entry has to point at teaching that actually exists, or it is
# just noise that dilutes the score. Adding a synonym for a topic the corpus
# does not cover makes the bot answer from the wrong passage instead of saying
# it does not have it, which is worse than the gap.
ALIASES = {
    # A losing position, in the student's words. Teaching: psychology doc,
    # "train your mind that you will see red".
    "down": ["red"], "losing": ["red", "loss"], "lose": ["red", "loss"],
    "underwater": ["red", "loss"], "negative": ["red", "loss"],
    # Fear, in the student's words. Teaching: "greed sets in, fear sets in".
    "scared": ["fear"], "afraid": ["fear"], "nervous": ["fear"],
    "anxious": ["fear"], "panic": ["fear"], "worried": ["fear"],
    # The corpus says both, in the same breath: "it says long upper shadow,
    # that's a wick".
    "shadow": ["wick"],
    # Structure, in the student's words.
    "line": ["support", "resistance", "level"],
    "zone": ["support", "resistance", "level"],
}
ALIASES = {stem(k): [stem(v) for v in vs] for k, vs in ALIASES.items()}

def expand(term):
    """Index terms reachable from a query term, itself plus prefix matches.

    Bridges the pairs a light stemmer cannot: greed and greedy, patience and
    patient, emotion and emotional, discipline and disciplined. Only fires for
    terms of five characters or more, so short words do not over-match, and is
    capped so one query term cannot dominate the score.

    Aliases are added on top rather than instead. A term that is already in the
    index keeps scoring on itself and gains its house synonym, so "my position
    is down" still matches every passage about price going down and also
    reaches the teaching about seeing red.
    """
    alias = [a for a in ALIASES.get(term, []) if a in DF]
    if term in DF:
        return [term] + alias
    if len(term) < PREFIX_MIN:
        return alias
    pre = term[:PREFIX_MIN]
    hits = sorted((t for t in DF if t.startswith(pre)), key=lambda t: (len(t), t))
    return hits[:4] + alias

# prompts/system.md: "Where a ruling and a transcript conflict, the ruling
# wins. The rulings layer is current teaching. Transcripts are recordings that
# may have been superseded."
#
# Retrieval has to reflect that or the instruction is empty. Without this,
# rulings scored below the transcripts they override: the put seller risk
# ruling sat at rank 7 behind a live session, and the whole point of that
# ruling is that the recording is wrong. The boost is modest on purpose, so a
# ruling surfaces alongside strong transcript matches rather than crowding
# out the teaching a student actually asked for.
RULING_BOOST = 1.4

def weight_for(chunk):
    return RULING_BOOST if chunk.get("course") == "ruling" else 1.0

def search(q, n=8, k1=1.4, b=0.72):
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
            scored.append((s * weight_for(c), c))
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

# Eight rather than six. A ruling that refines a module rather than
# contradicting it sits just below the module's own teaching, which is correct
# ordering but pushed the stochastics ruling to rank 7 and out of view. Wider
# retrieval lets a refinement travel with the thing it refines.
def main():
    flags = {"--json", "--image"}
    args = [a for a in sys.argv[1:] if a not in flags]
    as_json = "--json" in sys.argv
    # --image stands in for a student uploading a chart. The guard cannot read
    # that off the text, and the marked chart exception turns on it.
    ctx = {"image": "--image" in sys.argv}
    if not args:
        sys.exit('usage: ask.py [--image] "your question"')
    q = " ".join(args)
    g = guard_for(q, ctx)
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

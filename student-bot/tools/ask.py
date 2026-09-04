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

LOWER_TICKER = re.compile(
    r"\b(?:buy|sell|short|on|in|into|of|for|trade|trading|play|calls?|puts?)\s+"
    r"([a-z]{2,5})\b", re.I)

NOT_A_TICKER_WORD = set((
    "TOO SOON MUCH MORE LESS THIS THAT THEM THEN THAN WHEN WHAT SOME MANY EVER "
    "EARLY LATE HIGH LOW BIG SMALL GOOD BAD NOW OUT OFF UP DOWN BACK OVER "
    "HERE THERE LONG SHORT FAST SLOW HARD EASY SAME NEXT LAST BEST WORST "
    # The options vocabulary. LOWER_TICKER anchors on trade verbs, and the word
    # that follows a trade verb is very often the instrument rather than a
    # symbol: "sell naked calls" read NAKED as a ticker, which was enough to
    # make the bot refuse to explain why brokers restrict naked calls.
    #
    # Same failure as TOO in "sell too soon", one lesson later. The anchor finds
    # the position where a ticker would sit; it cannot tell that something is
    # sitting there already.
    "NAKED COVERED CALL CALLS PUT PUTS OPTION OPTIONS STOCK STOCKS SHARE SHARES "
    "SPREAD SPREADS PREMIUM STRIKE DELTA THETA VEGA GAMMA CONTRACT CONTRACTS "
    "WEEKLY MONTHLY LEAP LEAPS BULL BEAR"
).split())

# Objects that make a trade verb conceptual rather than live. "How do I sell a
# covered call" is the curriculum asking to be taught; "should I sell my NVDA
# calls" is position advice. Both contain "sell", so the verb cannot decide it.
#
# This is the same separation SPECIFIC already makes for strike and expiration,
# applied to the bare action form. Without it the bot refused to explain what a
# straddle is, which is the failure Vlad named: "this bot cannot have such
# specific prompts bc its going to fail for the user."
GENERIC_INSTRUMENT = re.compile(
    r"\b(a|an|the)?\s*(covered|naked|cash\s+secured)\s+(call|put)s?\b|"
    r"\b(a|an)\s+(straddle|strangle|spread|diagonal|vertical|butterfly|condor|"
    r"collar|call\s+option|put\s+option)\b|"
    r"\b(calls?|puts?|options?|premium)\s+(on|against)\s+(a\s+|the\s+)?"
    r"(stock|shares|position)\b|"
    # Sizing asked in the abstract. "How many contracts should I take" is the
    # question position-sizing.md exists to answer, and Vlad's own teaching has
    # a number for it, so refusing it hands back nothing on a topic the
    # curriculum is explicit about. Non-negotiable 3 lists ticker, strike,
    # expiration, entry, exit and live trade management; sizing is not on it.
    #
    # Safe because this only exempts the bare action form. "How many contracts
    # should I take on NVDA" skips this and is caught by the ticker path below,
    # which is where a sizing question with a live trade attached belongs.
    r"\b(how many|how much|what percent(age)?|what size|how big)\b", re.I)

def has_ticker(q):
    # Capitals are the easy case.
    if any(t not in NOT_TICKERS for t in re.findall(r"\b[A-Z]{2,5}\b", q)):
        return True
    # Students type "should i buy nvda". A short token sitting after a trade
    # verb or a preposition is a ticker whatever case it is in, unless it is an
    # ordinary word. Matching bare lowercase tokens anywhere would make every
    # question a ticker question, so the anchor is doing the work.
    return any(m.group(1).upper() not in NOT_TICKERS
               and m.group(1).upper() not in NOT_A_TICKER_WORD
               for m in LOWER_TICKER.finditer(q))

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
    # "this trade" is as live as "my trade". A student writing "how many
    # contracts should I take on this trade" is holding one.
    r"\b(my|this|that) (trade|position|contracts?|spread|order|call|put|strike)\b|"
    r"\bi(?:'m| am) in\b|\bi (bought|sold|entered|opened|own|hold)\b|"
    r"going against me|getting tested|underwater|in the (red|money|green)\b|"
    r"\b\d+(\.\d+)?\s*(strike|call|put)s?\b", re.I)
# Asking to act, which needs no second signal. Kept to trade verbs on purpose:
# "should i use fibonacci" is a teaching question and must stay one.
# The bare form, split out of DIRECT_ACTION because it was the one over firing.
# "Should I buy" tied to nothing is still a position ask and must be refused,
# but the identical words in front of a strategy name are a lesson request.
BARE_ACTION = re.compile(
    r"(?<!why\s)(?<!because\s)"
    r"\b(should|shall|do|would|can|could)\s+(i|we|you)\s+"
    r"(buy|sell|short|enter|exit|get\s+(in|out)|take|hold|add\s+to|trim|cut|close|roll|"
    r"average\s+down|double\s+down)\b", re.I)

DIRECT_ACTION = re.compile(
    r"\bwould\s+you\s+(buy|sell|take|enter|get\s+in)\b|"
    r"\b(is|was)\s+(now|this|that|it)\s+a\s+good\s+"
    r"(entry|exit|time|price|buy|spot|level)\b|"
    r"\bgood\s+(entry|time)\s+(here|now)\b|"
    r"\b(buy|sell)\s+or\s+wait\b|"
    r"\bdo\s+i\s+(buy|sell)\s+(this|that|it)\b|"
    # Asking permission obliquely, which is how it usually arrives.
    r"\b(good|bad|smart|dumb|terrible)\s+idea\b|"
    r"\bthinking\s+(about|of)\s+(buying|selling|getting\s+in(to)?|taking)\b|"
    r"\b(worth|ok|okay)\s+(getting\s+in|buying|selling|taking\s+this)\b|"
    r"\bwhat\s+would\s+you\s+do\b", re.I)

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
    # Nor does asking to act. See DIRECT_ACTION above.
    if DIRECT_ACTION.search(q):
        return True
    # The bare "should I buy" form fires unless its object is a strategy rather
    # than a trade. Naming an instrument in the abstract is how a student asks
    # to be taught one, and refusing it teaches them the bot is useless.
    if BARE_ACTION.search(q) and not GENERIC_INSTRUMENT.search(q):
        return True
    if not (SPECIFIC.search(q) or WALKTHROUGH.search(q) or has_ticker(q)):
        return False
    return bool(ASKING_WHAT_TO_DO.search(q))

# MARKED used to live here: a regex asking the QUESTION whether the student had
# drawn on their chart. It existed because the bot could not see the image, so
# the student's wording was the only evidence available.
#
# It failed in the field. Vlad sent a carefully marked chart and asked whether
# "my price target 36.85" was realistic. MARKED knew "my support" and "my
# levels" but not "my price target", so the unmarked branch fired and a student
# who had done the work was told to go and do it.
#
# Extending the phrase list would only ever have helped the student after the
# next one had already been failed. Whether a chart is marked is a fact about
# the chart, so the question now goes to the chart. The two image guards below
# collapsed into one as a result.

# Each test takes (question, ctx). ctx carries what the text cannot, namely
# whether an image came with the question: {"image": True}.
GUARDS = [
    ("retired", "Blocked", "non-negotiable 8, retired terms",
     lambda q, c: re.search(r"\belite\s*(four|4|12|twelve)\b", q, re.I)),
    ("outcome", "Refuse and route", "non-negotiables 1 and 2, outcome claims",
     lambda q, c: re.search(
         r"(how much|how many).*(make|earn|money|profit|return)|win\s*rate|"
         r"average return|per (week|month|year)|realistic(ally)? (make|expect)|"
         r"students? (make|earn)|get rich|replace my (income|job|salary)|"
         # Phrased as an expectation rather than a quantity. "What kind of
         # returns should I expect" is the same question as "how much will I
         # make" and was walking past the guard.
         r"(realistic|typical|average|expected|normal)\s+\w{0,12}\s*"
         r"(returns?|gains?|profits?|income)|"
         r"(returns?|gains?|profits?)\s+(should|can|do|would)\s+i\s+"
         r"(expect|see|get|make)|"
         r"what\s+(kind|sort)\s+of\s+(returns?|gains?|profits?|money)", q, re.I)),
    # The image state comes first. An uploaded chart changes the shape of the
    # answer before any text rule applies. Marked or not is decided by looking
    # at the image, not by reading the question. See
    # rulings/chart-with-student-levels.md.
    ("chart_attached", "Read their chart",
     "non-negotiable 4 as amended, chart-with-student-levels ruling",
     lambda q, c: c.get("image")),
    ("chart", "Cannot see it", "non-negotiable 4, plus the-chart-decides ruling",
     lambda q, c: re.search(
         r"(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|"
         r"confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|"
         r"breakout|bounce)|on my chart|"
         r"\b(this|that|these|those|my)\s+(chart|screenshot|screen|setup|candles?)\b|"
         r"\bmy (support|resistance|levels?|lines?)\b", q, re.I)),
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


# ---------------------------------------------------------------------------
# The dynamic layer. Mirrors tools/guards.cjs, which is what
# tools/test_retrieval_parity.py exists to keep true.
#
# Every guard above decides from a regex over the question. That is why "my
# price target" failed where "my support" would have worked, and it is
# structural rather than a missing phrase: students do not share a vocabulary.
#
# So intent is read by a model before the guards run, and mapped through
# INTENT_TO_GUARD. Two properties keep that safe:
#
#   1. UNION, NEVER SUBTRACTION. The regexes still run and a guard fires if
#      EITHER layer flags it. The model can add a guard the pattern missed; it
#      can never talk the bot out of one the pattern caught.
#
#   2. FAILURE FALLS BACK. Passing None or [] returns exactly what the regexes
#      decided, so a classifier that is unavailable or broken changes nothing.
#
# The rules themselves did not change. Only the recognition of what is being
# asked, which is the part that was brittle.
# ---------------------------------------------------------------------------

INTENT_TO_GUARD = {
    "position_advice": "position",
    "outcome_claim": "outcome",
    "prediction": "predict",
    "chart_read": "chart",
    "chart_with_marks": "chart_attached",
    "procedure": "procedure",
    "retired_term": "retired",
}


def merge_guards(by_words, intents, has_image=False):
    """Most severe of the two layers. GUARDS is ordered by severity."""
    ids = []
    for intent in (intents or []):
        gid = INTENT_TO_GUARD.get(intent)
        if not gid:
            continue
        # chart_attached is meaningless without an image, and chart_read must
        # not fire when the chart is right there to be looked at.
        if gid == "chart_attached" and not has_image:
            continue
        if gid == "chart" and has_image:
            continue
        ids.append(gid)
    if by_words:
        ids.append(by_words["id"])
    if not ids:
        return None
    for gid, verdict, rule, _ in GUARDS:
        if gid in ids:
            return {"id": gid, "verdict": verdict, "rule": rule}
    return by_words

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

# Numbers are indexed, and leaving them out was a real hole.
#
# This curriculum teaches by number constantly: the 13, 20, 50 and 200 day
# moving averages, Fibonacci at 38.2, 50 and 61.8, Full Stochastics at 14.3.3,
# 0.07 delta, 30 to 37 days. A student asking "what is the 13 and 20 for"
# produced ZERO tokens under the old pattern and therefore zero results, which
# is the worst possible answer: not a weak match, nothing at all.
#
# Measured over six numeric questions and ten regression questions:
#
#            numeric answerable   numeric strong   regressions ok
#   before        5 of 6              3 of 6           8 of 10
#   after         6 of 6              6 of 6           9 of 10
#
# Strictly better on both axes, which is rare enough to be worth stating. The
# regression set improved because taught values are high signal: a chunk that
# says "38.2" is almost certainly the Fibonacci teaching.
#
# Single digits stay out via the length filter, so "5" and "3" do not become
# index terms. Prices from live sessions do get indexed, which is noise, but
# IDF handles it: a number said once in one session is rare and scores high
# only for someone who asked about that number.
TOKEN = re.compile(r"[a-z][a-z0-9']+|\d+(?:\.\d+)*")

def toks(s):
    return [stem(w) for w in TOKEN.findall(s.lower())
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

    # Shorthand. Students type the abbreviation and the corpus says the word,
    # and a term under PREFIX_MIN characters cannot reach it by prefix. "How do
    # I use fib levels" missed the Fibonacci module entirely, in a corpus that
    # has a whole module called Fibonacci Retracement.
    "fib": ["fibonacci", "retracement"],
    "fibs": ["fibonacci", "retracement"],
    "vol": ["volume"],
    "ma": ["moving", "average"],
    "sr": ["support", "resistance"],
    "ta": ["technical", "analysis"],
    "tos": ["thinkorswim"],
    "pt": ["target", "resistance"],
    "dte": ["expiration"],

    # Speed words for exiting. "Sell too soon" and "take profit so early" both
    # reach the teaching; "get out way too fast" did not, because the doc says
    # early and the student said fast. Same idea, three words for it.
    "fast": ["early", "soon"],
    "quick": ["early", "soon"],
    "quickly": ["early", "soon"],
    "premature": ["early", "soon"],
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

# A lesson's own subject is the one word BM25 cannot see.
#
# Ask this corpus anything about volume and the Volume module does not appear in
# the top TWENTY, for any phrasing. That is a recall failure rather than a
# ranking one, so the reranker in the live bot never gets a chance to fix it: it
# only reorders what BM25 hands over.
#
# The cause is inverse document frequency working exactly as designed. "Volume"
# appears in thousands of live session chunks, so its IDF collapses to almost
# nothing, and the 22 chunks of the lesson that exists to define the word get no
# credit for being about it. The stronger a term is as a subject, the more the
# corpus talks about it, and the less BM25 weights it. Every teaching module has
# this problem in proportion to how central its topic is.
#
# So the title is scored separately from the body. A chunk whose module title
# carries a query term is boosted, which is a statement about what the source IS
# rather than about how often it says a word.
#
# Deliberately larger than RULING_BOOST. A ruling is a correction that should sit
# alongside the teaching; a title match means the student named the lesson.
TITLE_BOOST = 2.2

# Titles are tokenised here rather than through pretty(), which is defined
# further down for display. Splitting on the separators is all this needs, and
# it keeps the index independent of how a citation happens to be formatted.
TITLE_TOKENS = {}
for _c in CHUNKS:
    _key = _c.get("source_file") or _c.get("module_title") or ""
    if _key not in TITLE_TOKENS:
        _t = re.sub(r"[-_]?(UNNUMBERED|SLIDES|RAW)\b", " ",
                    str(_c.get("module_title") or ""), flags=re.I)
        TITLE_TOKENS[_key] = set(toks(_t.replace("-", " ").replace("_", " ")))


def weight_for(chunk, query_tokens=()):
    w = RULING_BOOST if chunk.get("course") == "ruling" else 1.0
    title = TITLE_TOKENS.get(chunk.get("source_file") or chunk.get("module_title") or "")
    if title and any(t in title for t in query_tokens):
        w *= TITLE_BOOST
    return w

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
            scored.append((s * weight_for(c, qt), c))
    scored.sort(key=lambda x: -x[0])
    return scored[:n]

def pretty(title):
    """Turn a source filename into something a student can go and find."""
    t = re.sub(r"^(module-\d+-|module-)", "", str(title or ""))
    t = re.sub(r"[-_]?UNNUMBERED$", "", t)
    t = re.sub(r"\.(txt|md)$", "", t)
    return t.replace("-", " ").replace("_", " ").strip().title()

def cite(c):
    if c["course"] == "tf-core":
        # Cite by title where the module has no number. Vlad ruled the numbering
        # question closed: "it doesnt matter which module its in, just know that
        # this is info needed for the bot." And system.md is explicit that a
        # confident citation pointing at the wrong video is worse than none.
        # "Module UNNUMBERED" is honest and useless; the lesson title is honest
        # and findable.
        mod = str(c.get("module") or "")
        base = f"Module {mod}" if mod.isdigit() else pretty(
            c.get("module_title") or c.get("source_file"))
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

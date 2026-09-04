#!/usr/bin/env python3
"""Ask the same thing many ways and check the bot does not change its mind.

Vlad's test method, turned into a suite: "if variations of wording doesnt work
this bot will not work." Every failure he found came from the bot reading his
words rather than his meaning, and the canned test set in tests/questions.json
cannot catch that because each intent appears there exactly once, phrased well.

So each block below is ONE intent written the way students actually type:
lower case, no punctuation, voice-to-text run-ons, typos, hedges, and the
half-sentences people send at eleven at night. The guard verdict and the source
that retrieval reaches must not wobble across them.

Retrieval is allowed to reorder. What is not allowed is a phrasing that reaches
a different SOURCE, because that is a student being taught something else for
using different words.
"""
import importlib.util
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("ask", ROOT / "tools" / "ask.py")
ask = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ask)


# What this measures, and why it changed.
#
# It used to gate on the top hit being the same source for every phrasing. That
# is the right bar for a BM25 only tool and the wrong one for the bot that
# ships, which retrieves twenty with BM25 and lets the model choose six. What
# decides whether a student can get the right answer is therefore whether the
# right source is IN the twenty.
#
# So recall is the gate now and the top hit is reported as drift. That is a
# weaker assertion on paper and a truer one in practice. It is a judgement call
# rather than a fact, so it is written down here rather than buried.
#
# The change was forced by a real finding: the Volume module was not in the top
# TWENTY for any phrasing of a question about volume. The old test called that
# "wobble", the same word it used for a source that merely came second, which
# hid a total failure behind the label of a cosmetic one.
CANDIDATES = 20   # matches the live bot's BM25 stage


def top_source(q):
    hits = ask.search(q, 3)
    if not hits:
        return None
    return hits[0][1]["source_file"]


def rank_of(q, want):
    """Where the wanted source first appears in the candidate set, or None."""
    for i, (_, c) in enumerate(ask.search(q, CANDIDATES)):
        if any(w in c["source_file"] for w in want):
            return i + 1
    return None


# (name, expected guard or None, image?, [phrasings])
BLOCKS = [
    ("Asking what to do with a trade", "position", False, [
        "should I buy NVDA calls this week",
        "should i buy nvda",
        "thinking about getting into nvda calls, good idea?",
        "would you get in here",
        "do i buy this or wait",
        "should i take this trade",
        "is now a good entry",
        "shud i buy calls on nvda",
    ]),
    ("Asking what students earn", "outcome", False, [
        "how much money do students make",
        "how much can i make",
        "whats a realistic monthly return",
        "how much do people earn doing this",
        "can i replace my income with this",
        "what kind of returns should i expect",
        "how much money can u make",
    ]),
    ("A retired programme name", "retired", False, [
        "what is the elite four",
        "tell me about elite 4",
        "is the elite twelve still running",
        "whats elite 12",
    ]),
    ("A chart with levels the student drew", "chart_attached", True, [
        "See my resistance is 36.85 this is my price target can you tell me this is realistic based off chart?",
        "are my support lines in the right place",
        "i drew my levels, do they hold up",
        "check my lines",
        "my price target is 36.85 realistic?",
        "does this look right to you",
        "heres my chart with my zones marked",
    ]),
    ("Asking about a chart with nothing attached", "chart", False, [
        "what do you think of this chart",
        "does this look bullish",
        "is that a hammer",
        "did volume confirm it",
        "hows my setup look",
    ]),
    # The mirror of the position block, and the reason it exists. Every question
    # here contains a trade verb and an "I", which is exactly what the position
    # guard looks for, and none of them is a trade. The bot refused all of these
    # until the bare action form was gated on its object: asking what a straddle
    # is got the same answer as asking whether to buy NVDA.
    #
    # Vlad on why that matters: "this bot cannot have such specific prompts bc
    # its going to fail for the user."
    ("Asking to be taught a strategy", None, False, [
        "when would i buy a straddle",
        "how do i sell a covered call",
        "why do brokers not let me sell naked calls",
        "can you sell a put option without owning the stock",
        "when should i buy a strangle",
        "how does shorting work",
        "what is a diagonal spread",
    ]),
    ("Platform mechanics", "procedure", False, [
        "where do i click to set up thinkorswim",
        "how do i add stochastics",
        "which tab has the screener",
        "how do i set up my charts",
    ]),
]

# Teaching intents: no guard should fire, and the same source should answer.
# (name, the source that must answer, phrasings)
TEACHING = [
    ("What volume tells you", ["volume-UNNUMBERED"], [
        "what is volume telling me",
        "why does volume matter",
        "whats the point of volume",
        "how do i read volume",
        "volume is confusing to me can you explain",
    ]),
    ("Cutting winners too early", ["winners-and-losers"], [
        "I keep cutting my winners too early",
        "i always sell too soon",
        "why do i take profit so early",
        "i get out of good trades way too fast",
        "cant hold a winner",
    ]),
    ("Position sizing", ["position-sizing"], [
        "how much should i risk per trade",
        "what percent of my account per trade",
        "how big should my position be",
        "am i trading too big",
        "how many contracts should i take",
    ]),
    ("What makes a hammer strong", ["hammer-strength"], [
        "what makes a hammer candle strong",
        "when is a hammer worth trading",
        "is a hammer always bullish",
        "hammer candle any good",
    ]),
]

fails = []

print("=" * 78)
print("GUARDED INTENTS: the verdict must not change with the wording")
print("=" * 78)
for name, want, img, phrasings in BLOCKS:
    got = [(p, (ask.guard_for(p, {"image": img}) or {}).get("id")) for p in phrasings]
    ids = Counter(g for _, g in got)
    ok = all(g == want for _, g in got)
    print(f"\n{'ok  ' if ok else 'FAIL'}  {name}   expected: {want}")
    if not ok:
        fails.append(name)
        for p, g in got:
            if g != want:
                print(f"        {str(g or 'none'):<16} {p}")
    else:
        print(f"        all {len(phrasings)} phrasings -> {want}")

print("\n" + "=" * 78)
print("TEACHING INTENTS: no guard, and the same source should answer")
print("=" * 78)
for name, want, phrasings in TEACHING:
    rows = []
    for p in phrasings:
        g = (ask.guard_for(p, {}) or {}).get("id")
        rows.append((p, g, top_source(p), rank_of(p, want)))
    guards = {g for _, g, _, _ in rows if g}
    missed = [r for r in rows if r[3] is None]
    tops = Counter(s for _, _, s, _ in rows)
    ok = not guards and not missed
    print(f"\n{'ok  ' if ok else 'FAIL'}  {name}   must reach: {want[0]}")
    if guards:
        fails.append(name + " (unexpected guard)")
        for p, g, _, _ in rows:
            if g:
                print(f"        guard {g} fired on: {p}")
    if missed:
        fails.append(name + " (NOT IN CANDIDATES)")
        for p, _, s_, _ in missed:
            print(f"        not in top {CANDIDATES}, reached {str(s_)[:40]} instead: {p}")
    if not missed:
        ranks = ", ".join(str(r[3]) for r in rows)
        print(f"        all {len(rows)} phrasings reach it, at ranks {ranks}")
    # Drift is reported, not failed. The reranker chooses from the candidates,
    # so which one BM25 happens to put first does not decide the answer.
    if len(tops) > 1:
        print(f"        note: top hit drifts across {len(tops)} sources")

print("\n" + "=" * 78)
n = len(BLOCKS) + len(TEACHING)
if fails:
    print(f"{len(fails)} of {n} intents wobble under rephrasing:\n")
    for f in fails:
        print("  -", f)
else:
    print(f"All {n} intents hold across every phrasing.")
sys.exit(1 if fails else 0)

#!/usr/bin/env python3
"""Pins tools/redact.py, specifically the two defects found reading all 29
FB Live transcripts for transcripts/fb-live-questions-and-answers.md.

Nothing here existed before that pass, which is itself the reason the two
defects below shipped in the first place: a redaction pipeline with no test
looks like it works right up until someone reads the output closely enough
to notice it doesn't.

Case 1: a member is named Mark, and "mark" is also an ordinary verb Vlad uses
constantly. Case insensitive name matching cannot tell them apart by spelling,
and the old code did not try. "I'm gonna mark where the body opened" came out
as "I'm a [MEMBER] where the body open", which is not a redaction, it is
corruption: nothing about the original sentence can be recovered from it.

Case 2: "Take your 300%. Are you kidding me?" leaked a real performance
figure. Every MONEY pattern in the file was keyed to first person phrasing
("I'm up X%") or a figure glued to a result word ("X% profit"). An imperative
callout of someone ELSE's result has neither shape, and the same figure was
redacted correctly two sentences earlier in the same passage, which is how
this was caught: a marker that works once and fails on the very next
reference to the same number is worse than no marker, because it tells a
reader exactly what to go find.

Case 3: found while re-verifying case 2 against the real 0159 source rather
than a synthetic string. "I'm up like 300%." redacted the number but left the
"%" sign sitting right after the marker: "[PERFORMANCE REDACTED]%." The first
person pattern closed its optional unit group ("%", "percent", "dollars", ...)
with one \b placed after the whole group. % is not a word character, so that
\b cannot match when % is immediately followed by punctuation, and the regex
backtracks to excluding % from the match rather than failing outright. No
digit leaked here, but a dangling % next to a marker is still a symbol the
redaction was supposed to remove, not scatter beside its own tag.

Case 4: found once the corpus grew from 29 files to 393. "In two weeks, we're
up about seven point a half percent... Well, we were up 4%." The first "up"
survived because the figure is spelled out ("seven point a half") rather than
numeric, which no MONEY pattern reads at all; that gap is real but not fixed
here, it needs a word-number parser to do safely. The second, "we were up 4%",
was a plain miss: the first person pattern only recognised present tense
("I'm up", "we're up"), not past tense, so "we were up 4%" sat unredacted
right next to a correctly redacted figure in the same passage, same failure
shape as case 2.

Case 5: found in the same batch pass across 393 files, in two different
sessions describing an options entry and exit price as a pair: "I came out
this morning with $4.50 outta $1.50" (0241) and "I got $8 out of $10 spread"
(0265). Neither figure is glued to a result word, and neither uses "up" or
"down", so nothing above reads either one: a straight "$X out of/outta $Y"
recap is its own shape, not a variant of any case already covered.

Case 6: found in 0249, same session, two different figures. "I'm already up
like 50%" put a filler word between the pronoun and "up" that the first
person pattern required to be adjacent, so "already" alone broke a match that
"I'm up like 50%" would have caught. "We're up to about 1250" did the same
thing one slot over: "to" sat between "up" and the optional "about", which
the pattern also required to be adjacent. Same failure shape as every case
above, not a new mechanism, just two more words the pattern had not met yet.

Case 7a: a second name/public-figure collision, same shape as Mark but
found in the Q&A extraction pass rather than a direct read. A member is
named John, and John Murphy (J. Murphy) is the real, publicly known author
of "Intermarket Analysis," cited by name in two sessions (0131, 0255).
"reading John Murphy's book" and "who was the author? John J. Murphy" both
came out "[MEMBER] Murphy," corrupting a book citation the same way "mark"
corrupted a verb.

Case 7b: the opposite direction, an over-redaction rather than a leak. The
account size pattern ("<number>k/g's/grand") carried a lookahead meant to
require an account-shaped word nearby, but the whole alternation inside it
was wrapped in one more "?", making the entire lookahead optional, i.e. it
always matched regardless of what followed. Found live at 393 files: three
trading-volume figures with no connection to anyone's account got redacted
as if they were one, e.g. "the highest volume right now for this industry
is six, about 700 K" (0251). Fixed with a nearby-"volume" guard rather than
a working version of the original lookahead, because real account-size
mentions use far more phrasings than that lookahead's word list covered
("put 10k in a position", "10k's worth") and enforcing it literally would
have traded three false redactions for dozens of missed ones.
"""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("redact", ROOT / "tools/redact.py")
redact_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(redact_mod)
redact = redact_mod.redact

# [input, thing that must survive verbatim OR marker that must appear, which]
VERB_CASES = [
    "I'm a mark where the body open",
    "we Mark that candle and discuss it",
    "should I mark the wick, should I mark the body",
    "so we mark that candle",
    "the support resistance is starting to mark itself out",
    "let's mark this level and move on",
]

NAME_CASES = [
    ("we finished with Mark. last week", "[MEMBER]"),
    ("How's it going Mark? Long time no see.", "[MEMBER]"),
    ("Mark's trade worked out great", "[MEMBER]"),
]

PERCENT_CASES = [
    ("Take your 300%. Are you kidding me? It's not even a real question.",
     "[PERFORMANCE REDACTED]"),
    ("keep their 40% and get out", "[PERFORMANCE REDACTED]"),
    ("well, we were up 4%. So that's a big move", "[PERFORMANCE REDACTED]"),
    ("I was up 12% on that one", "[PERFORMANCE REDACTED]"),
    ("she was down 8% by Friday", "[PERFORMANCE REDACTED]"),
    # Second person direct address, found live in 0088 right next to a
    # correctly redacted first-person figure for the same trade.
    ("And you're up 80%. So you must have gotten in early", "[PERFORMANCE REDACTED]"),
    ("you are down 25% on that position", "[PERFORMANCE REDACTED]"),
    # Impersonal referent to the position, not a person. Also found live in
    # 0088, third figure in the same passage as the two above.
    ("That one's also up 70% now", "[PERFORMANCE REDACTED]"),
    ("it's up 20% since Monday", "[PERFORMANCE REDACTED]"),
    ("this one is down 15% today", "[PERFORMANCE REDACTED]"),
    # "took"/"won" as result verbs, found live in 0190 right next to a
    # correctly redacted dollar figure in the same recap.
    ("you took $25 loss on this one", "[PERFORMANCE REDACTED]"),
    ("You won 80 on the other one", "[PERFORMANCE REDACTED]"),
    # Colloquial result verbs, found live in 0180/0181 describing the same
    # real trade in two different sessions.
    ("it kicked out like 13% on this little move", "[PERFORMANCE REDACTED]"),
    ("it delivered 13%. I got out.", "[PERFORMANCE REDACTED]"),
    # Entry/exit price recap, found live in 0241 and 0265 in two different
    # sessions describing two different trades.
    ("I came out this morning with like, you know, $4 50 cents outta $1 50 cents",
     "[PERFORMANCE REDACTED]"),
    ("I came out today, I got like $8 out of $10 spread, so got it a day",
     "[PERFORMANCE REDACTED]"),
    # Filler word between the pronoun and "up"/"down", found live in 0249.
    ("I'm already up like 50%, you know, in a day", "[PERFORMANCE REDACTED]"),
    # "to" between "up" and the optional "about", also found live in 0249,
    # same session as the case just above.
    ("We're up to about 1250. Those spreads are pretty wide.",
     "[PERFORMANCE REDACTED]"),
]

# Ordinary uses of "took"/"won" that must survive untouched: the verbs are
# common outside a result context, and only a directly adjacent number
# should trigger a redaction.
VERB_GUARD_CASES = [
    "the bulls won the day today",
    "she took the trade off the table",
    "he took profits early",
]

ACCOUNT_SIZE_CASES = [
    ("she bought like 10 G's worth, so nice", "[ACCOUNT SIZE REDACTED]"),
    ("I usually put 10k in a position, maybe", "[ACCOUNT SIZE REDACTED]"),
]

JOHN_NAME_CASES = [
    ("How's it going John? Long time no see.", "[MEMBER]"),
    ("John just left in the comments", "[MEMBER]"),
    ("what's going on John what's up and crowd space", "[MEMBER]"),
]

# "John Murphy" the cited author must survive untouched, both with and
# without the middle initial found live in the two real passages.
JOHN_MURPHY_GUARD_CASES = [
    "when I was reading John Murphy's book and just in general market dynamics",
    "who was the author? John J. Murphy. Okay. That's all we got for now.",
]

# A trading-volume figure that happens to be shaped like an account size
# ("<number>k") must survive untouched: the number names the stock, not the
# viewer. All three found live in the same passage shape, "volume" nearby.
VOLUME_GUARD_CASES = [
    "with Over 200k less volume. And let's just add to that",
    "overall volume is not, uh, attractive. You know, 500 K for, um, share buyers",
    "the highest volume right now for this industry is six, about 700 K. So forget",
]

# A pinned regression for the specific passage that surfaced this: the same
# number, once in a construction the old code caught and once in a
# construction it missed, must now come out redacted BOTH times.
LEAK_CASE = (
    "I've been sitting here and honestly I'm up 300%. "
    "Take your 300%. Are you kidding me?"
)

# Pinned regression for case 3, reproducing the real 0159 sentence: no
# digit AND no stray "%" should survive next to the marker.
DANGLING_PERCENT_CASE = "Oh my gosh, he, I'm up like 300%. Please, please."

# Pinned regression for case 4's fixable half (past tense), reproducing the
# real 0181 sentence. The spelled-out "seven point a half percent" earlier in
# the same real passage is a known, separate gap this does not close.
PAST_TENSE_CASE = (
    "That's Monday here. I'm up about 7%. "
    "Well, we were up 4%. So that's a big move on the spy, right?"
)

fail = 0

for text in VERB_CASES:
    out, _ = redact(text)
    if out != text:
        fail += 1
        print(f"FAIL  verb usage changed: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    kept verb: {text}")

for text, marker in NAME_CASES:
    out, _ = redact(text)
    if marker not in out or "mark" in out.lower().replace(marker.lower(), ""):
        fail += 1
        print(f"FAIL  name not redacted: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    redacted name: {text}")

for text, marker in PERCENT_CASES:
    out, _ = redact(text)
    if marker not in out:
        fail += 1
        print(f"FAIL  figure leaked: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    redacted figure: {text}")

out, _ = redact(LEAK_CASE)
if out.count("[PERFORMANCE REDACTED]") != 2 or "300" in out:
    fail += 1
    print(f"FAIL  partial redaction reproduced: {LEAK_CASE!r}\n      -> {out!r}")
else:
    print(f"ok    both references to the same figure redacted: {LEAK_CASE}")

out, _ = redact(DANGLING_PERCENT_CASE)
if "300" in out or "%" in out:
    fail += 1
    print(f"FAIL  dangling percent sign: {DANGLING_PERCENT_CASE!r}\n      -> {out!r}")
else:
    print(f"ok    no dangling percent sign: {DANGLING_PERCENT_CASE}")

out, _ = redact(PAST_TENSE_CASE)
if out.count("[PERFORMANCE REDACTED]") != 2 or "7%" in out or "4%" in out:
    fail += 1
    print(f"FAIL  past tense figure leaked: {PAST_TENSE_CASE!r}\n      -> {out!r}")
else:
    print(f"ok    present and past tense both redacted: {PAST_TENSE_CASE}")

for text in VERB_GUARD_CASES:
    out, _ = redact(text)
    if out != text:
        fail += 1
        print(f"FAIL  ordinary verb usage changed: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    kept ordinary verb: {text}")

for text, marker in ACCOUNT_SIZE_CASES:
    out, _ = redact(text)
    if marker not in out:
        fail += 1
        print(f"FAIL  account size not redacted: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    redacted account size: {text}")

for text, marker in JOHN_NAME_CASES:
    out, _ = redact(text)
    if marker not in out or "john" in out.lower().replace(marker.lower(), ""):
        fail += 1
        print(f"FAIL  John not redacted: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    redacted John: {text}")

for text in JOHN_MURPHY_GUARD_CASES:
    out, _ = redact(text)
    if "john" not in out.lower():
        fail += 1
        print(f"FAIL  John Murphy citation corrupted: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    kept John Murphy citation: {text}")

for text in VOLUME_GUARD_CASES:
    out, _ = redact(text)
    if "[ACCOUNT SIZE REDACTED]" in out:
        fail += 1
        print(f"FAIL  volume figure redacted as account size: {text!r}\n      -> {out!r}")
    else:
        print(f"ok    kept volume figure: {text}")

total = (len(VERB_CASES) + len(NAME_CASES) + len(PERCENT_CASES) + len(VERB_GUARD_CASES)
         + len(ACCOUNT_SIZE_CASES) + len(VOLUME_GUARD_CASES)
         + len(JOHN_NAME_CASES) + len(JOHN_MURPHY_GUARD_CASES) + 3)
print(f"\n{total} cases, {fail} wrong")
sys.exit(1 if fail else 0)

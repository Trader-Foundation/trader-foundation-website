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

total = len(VERB_CASES) + len(NAME_CASES) + len(PERCENT_CASES) + 3
print(f"\n{total} cases, {fail} wrong")
sys.exit(1 if fail else 0)

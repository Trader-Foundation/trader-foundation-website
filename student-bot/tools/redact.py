#!/usr/bin/env python3
"""Redact raw transcripts into transcripts/clean/.

Redaction protects people. Exclusion protects the bot. They are different
jobs and a source needs both, so this does not touch compliance: that runs
later, in build_corpus.py.

The standard is in CLAUDE.md:
  - names to [COACH] / [MEMBER]; the instructor is never redacted
  - account size, open positions, running profit and loss, trading history
  - personal details that identify someone alongside money
  - every redaction leaves a visible marker, nothing is removed silently

Raw files are never modified. Usage:
    python3 tools/redact.py                     # everything not yet clean
    python3 tools/redact.py --force             # redo all
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "transcripts/raw/fb-live"
CLEAN = ROOT / "transcripts/clean/fb-live"
NAMES = json.loads((ROOT / "glossary/names.json").read_text())

NEVER = {n.lower() for n in NAMES["never_redact"]}
ROLES = {}
for n in NAMES["coaches"]:
    ROLES[n.lower()] = "[COACH]"
for n in NAMES["members"]:
    ROLES.setdefault(n.lower(), "[MEMBER]")
for n in NEVER:
    ROLES.pop(n, None)

# Longest first, so "Elliott" is not half-matched by "Elliot".
ORDERED = sorted(ROLES, key=len, reverse=True)

# One member is named Mark, and "mark" is also an ordinary verb Vlad uses
# constantly ("mark that candle", "mark the wick"). Case insensitive matching
# cannot tell the name from the verb by spelling, since after transcription
# they ARE the same string. Found live: "I'm gonna mark where the body
# opened" came out as "I'm a [MEMBER] where the body open", which is not a
# redaction, it is corruption, because nothing about the original sentence
# can be recovered from it.
#
# Handled separately from the generic name loop below rather than by
# removing "mark" from the name list, because the person named Mark still
# needs the same protection everyone else on the list gets. This is a
# heuristic, not a certainty: it excludes the verb-shaped contexts actually
# found in the corpus (a determiner or object right after "mark", a
# verb-signalling word right before it) and redacts everything else,
# including plain address ("Mark, how's it going") and possessive use
# ("Mark's trade"). A person reviewing "Mark" hits after a re-run is still
# worth doing once, the same as any heuristic in this project.
_MARK = "mark" if "mark" in ROLES else None
if _MARK:
    ORDERED = [n for n in ORDERED if n != _MARK]
MARK_PATTERN = re.compile(r"\bmark(?:'s)?\b", re.I)
MARK_VERB_AFTER = re.compile(
    r"^\s*(?:the|that|this|it|where|here|off|down|up|out|a|an|"
    r"itself|themselves|myself|yourself|ourselves)\b", re.I)
MARK_VERB_BEFORE = re.compile(
    r"(?:gonna|going to|let'?s|i'?ll|we'?ll|should i|should you|you|we)\s*$", re.I)


def redact_mark(text):
    """Redact 'Mark' the name, leave 'mark' the verb alone."""
    if not _MARK:
        return text, 0
    n = 0

    def repl(m):
        nonlocal n
        before = text[max(0, m.start() - 24):m.start()]
        after = text[m.end():m.end() + 24]
        if MARK_VERB_AFTER.match(after) or MARK_VERB_BEFORE.search(before):
            return m.group(0)
        n += 1
        return ROLES[_MARK]

    return MARK_PATTERN.sub(repl, text), n

# Account size stated as "<number>k/g's/grand", e.g. "10 G's" or "10 grand".
# Handled separately from the MONEY list below, like redact_mark, because it
# needs a context guard: see redact_account_size_k for why.
ACCOUNT_SIZE_K = re.compile(r"\b\d[\d,]*\s*(?:k|g'?s?|grand)\b", re.I)
ACCOUNT_SIZE_VOLUME_GUARD = re.compile(r"volume|\bvol\b", re.I)


def redact_account_size_k(text):
    """Redact '<number>k/g's/grand' as an account size, except where a
    trading-volume figure happens to take the same shape.

    This pattern used to carry a trailing lookahead meant to require an
    account-shaped word nearby ("...(?=\\s*(?:account|portfolio|...)?)"),
    but the whole alternation inside that lookahead was itself wrapped in
    one more "?", making the entire lookahead optional, i.e. it always
    succeeded whether or not any of those words followed. That shipped
    silently until the corpus reached 393 files, when it redacted three
    unrelated trading-volume figures as account sizes: "the highest volume
    right now for this industry is six, about 700 K" (0251), "500 K for,
    um, share buyers" describing overall volume (0240), and "Over 200k less
    volume" (0023).
    #
    # A literal fix, requiring the lookahead's word list to actually match,
    # is not safe either: real account-size mentions this pattern is meant
    # to catch use far more phrasings than that short list ("put 10k in a
    # position", "10k's worth", "make 10k a month"), so enforcing it would
    # trade three false redactions for dozens of missed ones. What all
    # three false hits share instead is "volume" nearby, which a personal
    # account size never is, so that is the guard: not a redefinition of
    # what counts as an account size, just an exclusion for the one context
    # reliably not one.
    """
    def repl(m):
        before = text[max(0, m.start() - 80):m.start()]
        after = text[m.end():m.end() + 20]
        if ACCOUNT_SIZE_VOLUME_GUARD.search(before) or ACCOUNT_SIZE_VOLUME_GUARD.search(after):
            return m.group(0)
        return "[ACCOUNT SIZE REDACTED]"

    out = ACCOUNT_SIZE_K.sub(repl, text)
    return out, out.count("[ACCOUNT SIZE REDACTED]") - text.count("[ACCOUNT SIZE REDACTED]")


MONEY = [
    (re.compile(r"\b(?:my|his|her|their|your)\s+account\s+(?:is|was|has|holds|sits at|"
                r"is at)\s+[^.?!]{0,40}", re.I), "[ACCOUNT SIZE REDACTED]"),
    # Running profit and loss stated as a personal result. The trailing unit
    # is matched as %, OR a word with its own \b, rather than one optional
    # group closed by a single \b after it: % is a non-word character, so a
    # \b placed after the whole group cannot match when % is immediately
    # followed by punctuation ("300%."), and the regex backtracks to leaving
    # the % sign behind, unredacted, right after the marker. Found live in
    # 0159: "[PERFORMANCE REDACTED]%." instead of "[PERFORMANCE REDACTED]".
    #
    # Past tense ("was"/"were") is a separate alternative from present tense,
    # not an afterthought: without it, "we were up 4%" survives untouched
    # right next to a correctly redacted "we're up X%" two sentences earlier
    # in the same passage. Found live in 0181, at scale, once the corpus grew
    # past the handful of files this pattern was originally tuned against.
    #
    # Two more gaps found live in 0249, same session, two different figures:
    # "I'm already up like 50%" put a filler word ("already") between the
    # pronoun and "up", which the pattern required to be adjacent; "We're up
    # to about 1250" put "to" between "up" and the optional "about/around/
    # like", same problem one slot over. Both are narrow, found-live
    # additions, not a general filler-word parser.
    (re.compile(r"\b(?:i(?:'m| am| was)?|we(?:'re| are| were)?|"
                r"he(?:'s| is| was)?|she(?:'s| is| was)?)\s+"
                r"(?:already\s+|still\s+|now\s+)?"
                r"(?:up|down)\s+(?:to\s+)?(?:about\s+|around\s+|like\s+)?\$?\d[\d,]*(?:\.\d+)?\s*"
                r"(?:%|percent\b|dollars\b|bucks\b|k\b)?", re.I), "[PERFORMANCE REDACTED]"),
    # Second person, direct address: a coach telling a member their own
    # number back to them. Found live in 0088, in the same passage and same
    # shape as every leak above: "I'm up 80%" redacted correctly, then "And
    # you're up 80%" two words later, same figure, printed in full.
    #
    # Unlike the first person pattern above, the trailing unit here is
    # mandatory, not optional, and "it's up 4300" describing an index level
    # is exactly the kind of ordinary market narration this corpus is full
    # of; a bare number after "up/down" is not confidently a personal result
    # the way it is in first person, so this pattern requires an explicit $
    # or a %/percent/dollars/bucks unit rather than guessing.
    (re.compile(r"\byou(?:'re| are)\s+"
                r"(?:up|down)\s+(?:about\s+|around\s+|like\s+)?"
                r"(?:\$\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*"
                r"(?:%|percent\b|dollars\b|bucks\b))", re.I), "[PERFORMANCE REDACTED]"),
    # Impersonal referent to the position itself rather than to a person:
    # "it's up X%", "that one's up X%", "this is up X%". None of the pronoun
    # patterns above catch it because there is no person-pronoun at all, only
    # a demonstrative standing in for "the trade." Found live in 0088, third
    # figure in the same passage as the two above: "That one's also up 70%."
    # Same mandatory-unit reasoning as the second person case just above:
    # "it's up" and "that's up" precede index and price levels constantly in
    # this corpus, and only a real unit tells a personal result apart from
    # ordinary narration.
    (re.compile(r"\b(?:it|that one|this one|that|this)(?:'s| is)\s+(?:also\s+|still\s+)?"
                r"(?:up|down)\s+(?:about\s+|around\s+|like\s+)?"
                r"(?:\$\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*"
                r"(?:%|percent\b|dollars\b|bucks\b))", re.I), "[PERFORMANCE REDACTED]"),
    (re.compile(r"\b\d{1,3}\s?%\s?(?:profit|loss|gain|return|down|up)\b", re.I),
     "[PERFORMANCE REDACTED]"),
    # A trade "kicked out" or "delivered" a percentage: colloquial results
    # verbs, neither "up/down" (so the impersonal-referent pattern above
    # doesn't apply) nor "made/lost/..." (so the verb-list pattern below
    # doesn't either). Found live in 0180 and 0181, describing the same
    # real FSLR trade from two different sessions: "it kicked out like 13%
    # on this little move" and "it delivered 13%. I got out." This class of
    # verb is genuinely open-ended in natural speech (yielded, returned,
    # gave, printed, netted, scored, hit...) - these two are pinned because
    # they were found live, not because the list is now exhaustive.
    (re.compile(r"\b(?:kicked out|delivered)\s+(?:like\s+|about\s+|around\s+)?"
                r"\$?\d[\d,]*(?:\.\d+)?\s*(?:%|percent\b|dollars\b|bucks\b)?", re.I),
     "[PERFORMANCE REDACTED]"),
    # "took" and "won" added after finding "you took $25 loss on this one"
    # and "You won 80 on the other one" both survive unredacted in 0190,
    # right next to a correctly redacted dollar figure two sentences away
    # in the same recap. Same failure shape as every fix above: a real
    # result verb this pattern simply didn't have on its list yet.
    (re.compile(r"\b(?:made|lost|profited|banked|pocketed|took|won)\s+\$?\d[\d,]*(?:\.\d+)?\s*"
                r"(?:k|dollars|bucks|grand)?\b", re.I), "[PERFORMANCE REDACTED]"),
    # A recap stated as an entry price and an exit price, both in dollars: "I
    # came out this morning with $4.50 outta $1.50" (an option premium move)
    # and "I got $8 out of $10 spread" (same shape, a different session).
    # Neither figure is glued to a result word like "profit" and neither uses
    # "up/down", so no pattern above catches it. Found live in 0241 and 0265,
    # both a dollar figure immediately followed by "outta"/"out of" and a
    # second dollar figure, a shape ordinary narration essentially never
    # takes since only a real entry/exit price recap puts two "$" prices on
    # either side of "out of".
    (re.compile(r"\$\d[\d,]*(?:\.\d+)?(?:\s+\d+\s*cents?)?\s*(?:outta|out of)\s*"
                r"\$\d[\d,]*(?:\.\d+)?(?:\s+\d+\s*cents?)?", re.I),
     "[PERFORMANCE REDACTED]"),
    # An imperative callout of someone else's result: "take your 300%", "keep
    # their 40%". Everything above only catches first person ("I'm up X%") or
    # a figure with a result word stuck to it ("X% profit"). This construction
    # has neither, and it is exactly the shape of a coach telling a specific
    # member to bank a specific number, which is a real P&L figure attached to
    # a real person. Found live: "Take your 300%. Are you kidding me?" was
    # missed by every existing pattern and printed in full two sentences after
    # the same number, correctly redacted, appeared earlier in the passage.
    (re.compile(r"\b(?:take|took|keep|keeping|kept)\s+(?:your|his|her|their|our)\s+"
                r"\$?\d[\d,]*(?:\.\d+)?\s*%", re.I), "[PERFORMANCE REDACTED]"),
]

# A first person acquisition verb is not enough on its own. "I got you",
# "we got another one" and "I got this zoom bar in the way" are ordinary
# speech, and an earlier version of this redacted 206 of them, which would
# have gutted the teaching. A match now also has to carry a position signal:
# a ticker, contract language, a strike, or a dollar amount. "got" is dropped
# entirely because it is too common to disambiguate.
POSITION = re.compile(
    r"\b(?:i|we)\s+(?:bought|sold|own|hold|picked up|entered|am in|'m in)\s+"
    r"[^.?!]{0,60}", re.I)

POSITION_SIGNAL = re.compile(
    r"\b[A-Z]{2,5}\b"                              # a ticker
    r"|\b(?:calls?|puts?|contracts?|shares?|spread|strike|expir\w*|leaps?)\b"
    r"|\$\s?\d", re.I)


def redact_positions(text):
    """Redact only first person clauses that actually describe a holding."""
    def repl(m):
        return "[POSITION REDACTED]" if POSITION_SIGNAL.search(m.group(0)) else m.group(0)
    out, n = POSITION.subn(repl, text)
    return out, out.count("[POSITION REDACTED]") - text.count("[POSITION REDACTED]")


def redact(text):
    counts = {}

    def bump(k, n=1):
        counts[k] = counts.get(k, 0) + n

    # Names. Word boundaries only, so "Mark" the name goes and "market" stays.
    for low in ORDERED:
        pat = re.compile(r"\b" + re.escape(low) + r"(?:'s)?\b", re.I)
        text, n = pat.subn(ROLES[low], text)
        if n:
            bump(ROLES[low], n)

    # "Mark" is handled on its own; see redact_mark above.
    text, n = redact_mark(text)
    if n:
        bump(ROLES.get(_MARK, "[MEMBER]"), n)

    text, n = redact_account_size_k(text)
    if n:
        bump("[ACCOUNT SIZE REDACTED]", n)

    for pat, marker in MONEY:
        text, n = pat.subn(marker, text)
        if n:
            bump(marker, n)

    text, n = redact_positions(text)
    if n:
        bump("[POSITION REDACTED]", n)

    return text, counts


def main():
    force = "--force" in sys.argv
    CLEAN.mkdir(parents=True, exist_ok=True)
    done = skipped = 0
    totals = {}
    for src in sorted(RAW.glob("*.txt")):
        dest = CLEAN / src.name
        if dest.exists() and not force:
            skipped += 1
            continue
        raw = src.read_text(encoding="utf-8", errors="replace")
        # Keep the metadata header verbatim: it carries the sequence number,
        # date, duration and Vimeo URL that every citation depends on.
        if "=" * 20 in raw:
            head, body = raw.split("=" * 20, 1)
            sep = "=" * 20
        else:
            head, sep, body = "", "", raw
        clean_body, counts = redact(body)
        dest.write_text(head + sep + clean_body, encoding="utf-8")
        for k, v in counts.items():
            totals[k] = totals.get(k, 0) + v
        done += 1
        marks = sum(counts.values())
        print(f"  {src.name:<44} {marks:>4} redactions")

    print(f"\nredacted {done}, already clean {skipped}")
    if totals:
        print("markers written:")
        for k, v in sorted(totals.items(), key=lambda x: -x[1]):
            print(f"  {k:<28} {v}")


if __name__ == "__main__":
    main()

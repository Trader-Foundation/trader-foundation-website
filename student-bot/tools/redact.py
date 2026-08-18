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

MONEY = [
    # Account size, in any form, including "10 G's" and "10 grand".
    (re.compile(r"\b\d[\d,]*\s*(?:k|g'?s?|grand)\b(?=\s*(?:account|portfolio|"
                r"in (?:my|the) account|to (?:trade|work) with|saved|invested)?)", re.I),
     "[ACCOUNT SIZE REDACTED]"),
    (re.compile(r"\b(?:my|his|her|their|your)\s+account\s+(?:is|was|has|holds|sits at|"
                r"is at)\s+[^.?!]{0,40}", re.I), "[ACCOUNT SIZE REDACTED]"),
    # Running profit and loss stated as a personal result.
    (re.compile(r"\b(?:i(?:'m| am)?|we(?:'re| are)?|he(?:'s| is)?|she(?:'s| is)?)\s+"
                r"(?:up|down)\s+(?:about\s+|around\s+|like\s+)?\$?\d[\d,]*(?:\.\d+)?\s*"
                r"(?:%|percent|dollars|bucks|k)?\b", re.I), "[PERFORMANCE REDACTED]"),
    (re.compile(r"\b\d{1,3}\s?%\s?(?:profit|loss|gain|return|down|up)\b", re.I),
     "[PERFORMANCE REDACTED]"),
    (re.compile(r"\b(?:made|lost|profited|banked|pocketed)\s+\$?\d[\d,]*(?:\.\d+)?\s*"
                r"(?:k|dollars|bucks|grand)?\b", re.I), "[PERFORMANCE REDACTED]"),
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

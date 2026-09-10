# Finding: the redaction pass on the FB Live transcripts has real defects

**Status:** The three findings below are FIXED as of 9-10 September 2026 (see
the update at the end of this document). Left OPEN: the "John Deere" question
noted in that update, and Vlad's/compliance's sign-off on the overall approach.
**Found:** reading all 29 FB Live transcripts end to end while extracting
question-and-answer pairs (`transcripts/fb-live-questions-and-answers.md`)
**Severity:** higher than a normal transcription error. These files are already
labeled `clean` and have supposedly been through redaction. CLAUDE.md's
redaction standard says: *"Every redaction leaves a visible marker. Silent
removal would make the clean file untrustworthy as a record."* Two of the three
things found here are exactly that: silent, and untrustworthy.

---

## 1. A performance figure leaked through its own redaction marker

File `0159 - 2023-11-03 - FB LIVE 11323.txt`. A member, holding a large J&J
position, asks whether to take profits. Vlad's answer:

> "Take your `[PERFORMANCE REDACTED]%`. Are you kidding me? ... I probably
> would've got out here or here [on the chart]."

Two sentences later, discussing the same trade from a different angle, the
identical figure appears again, this time not redacted:

> "...take your 300%..."

The marker worked once and failed on the very next reference to the same
number. This is not a missed name, it is a redaction pass that partially
succeeded on a single passage and left the reader (or a student, if this
transcript were ever served) able to reconstruct exactly what was redacted two
sentences earlier. A visible marker that can be defeated by reading one more
sentence is not doing its job.

This also means the redaction pipeline is matching on some contextual pattern
rather than reliably finding every instance of a number that needs excluding.
Worth checking whether other performance figures in the corpus have the same
partial-catch problem.

## 2. Member names leaking through unredacted, repeatedly, across many files

The `[MEMBER]` tag is used consistently in most places, which means the
redaction pass has a working mechanism. It is not applying that mechanism
consistently. First names (and in one case a full name) appear unredacted
across at least nine of the files read:

Isaac, Natalie, Marcus, Keith, Stella, Travis, Harman, Cali, Gabriela, Connie,
Tamika, Amanda, Lori, Alejandro, Johnny, James, Reuben, Marianne, Soleil,
Lorenda, and one full name, **Joshua Ross** (file `0001`).

Some of these are used as direct address ("Keith, are you asking..."), which
means the person is not just named, they are identifiable as the one asking a
specific trading question in a specific session. That is exactly the kind of
exposure the redaction standard exists to prevent.

**This needs a real fix, not a spot patch.** A name list that only catches
some appearances of a name suggests either the list itself is incomplete, or
the matching does not catch every grammatical form (first name alone, versus
first-plus-last, versus a name used as direct address without a verb like
"said" or "asked" nearby). Both are worth checking before re-running redaction
on anything.

## 3. The redaction pass appears to have overwritten an ordinary word, not just names

This is the most concerning of the three, because it is not a name that got
missed, it is a common English word that got destroyed.

Across files `0018` and `0040`, the verb "mark" has been replaced with
`[MEMBER]`:

> "I'm a `[MEMBER]` where the body open" — should read "I'm gonna **mark**
> where the body opened"

> "we `[MEMBER]` that candle" — should read "we **mark** that candle"

> "should I `[MEMBER]` the wick, should I `[MEMBER]` the body" — should read
> "should I **mark** the wick, should I **mark** the body"

The most likely explanation: a member is named "Mark," and the redaction pass
is doing a blind find-and-replace on the string "mark" rather than matching it
as a name in context, or matching only the capitalized proper noun. That would
explain why an ordinary verb, used in exactly the teaching moments where
Vlad is telling someone where to mark a level or a candle, got overwritten
with a redaction tag.

**This corrupts the content itself**, not just privacy. A student or a future
version of the bot reading "I'm a [MEMBER] where the body open" cannot recover
what was actually said. It reads as nonsense rather than as a redaction, which
means it is also the kind of error that is easy to miss on a skim, since it
looks like noise rather than a flag.

**This needs checking against every file that was redacted with the same
member-name list**, not just the two found here, since the bug is in the
redaction method rather than in one file.

## What this means for the FB Live Q&A document

Nothing in `transcripts/fb-live-questions-and-answers.md` was re-redacted or
corrected against these findings. It reflects the "clean" source exactly as
found, on purpose: writing a silent fix into a new document would repeat the
exact mistake this finding is about, just one layer further from the raw
source. The leaked figure and leaked names are visible in that document
because they are visible in the source it was built from.

## What needs to happen

1. **Whoever built or owns the redaction pass should look at the actual
   matching logic**, not just the output. If it is a plain string
   find-and-replace against a raw name list, that is very likely the root
   cause of both #2 and #3.
2. **Re-run redaction, or a targeted audit, across every FB Live file**, not
   just the ones this pass happened to touch. The Q&A extraction only read 30
   files; the corpus references 554 total FB Lives, most of which have not
   been ingested yet, and whatever produced this bug will produce it again on
   the rest.
3. **Check whether any other redacted performance figure in the corpus has the
   same partial-leak pattern** as the J&J 300% figure. If the pipeline caught
   it once and missed it once in the same passage, it is worth sampling more
   than this one instance.
4. **This is Vlad's or a compliance owner's call on priority**, not something
   to silently patch. Per CLAUDE.md's working style: flag it, do not fix and
   move on.

---

## Update, 9-10 September 2026: the corpus grew to 393 sessions, and all three original defects were fixed

**Status on the three findings above: FIXED**, not just flagged. The dangling
`%` and the "mark" verb corruption are both pinned in `tools/test_redact.py`
now (29 cases when this update was written), and the redaction pass was
re-run across all 393 sessions rather than only the original 29. This entry
is left in place rather than rewritten, per the same "raw stays verbatim,
transformations write to a new location" principle CLAUDE.md applies to the
transcripts themselves: the finding is the useful part, not a tidy ending.

Ingesting the remaining 364 sessions, and a Q&A extraction pass reading all
393 end to end the same way the original 29 were read, found the same class
of bug repeatedly. Each is pinned with a regression test in
`tools/test_redact.py` before being called fixed, matching the process this
document's own "what needs to happen" section asked for.

**Leaks found and fixed** (see `tools/redact.py` for the code and comments,
each dated to the session it was found in):

- Past tense never matched: "we were up 4%" survived next to a correctly
  redacted "we're up X%" two sentences earlier (0181).
- Second person and impersonal referent never matched: "you're up 80%",
  "that one's also up 70%" (0088).
- Four result verbs were missing from the verb list: "took", "won", "kicked
  out", "delivered" (0190, 0180/0181).
- An entry/exit price recap had no pattern at all: "I came out this morning
  with $4.50 outta $1.50", "I got $8 out of $10 spread" (0241, 0265).
- Two filler-word gaps in the up/down pattern: "I'm already up like 50%" and
  "we're up to about 1250" both had one extra word sitting where the pattern
  required adjacency (0249).
- A second name/public-figure collision, same shape as "mark": a member
  named John collided with John Murphy, the real author of "Intermarket
  Analysis," cited by name in two sessions (0131, 0255). "reading John
  Murphy's book" came out "[MEMBER] Murphy."
- The dangling-`%` bug from finding #1 above turned out to have a sibling in
  a pattern that fix never touched: "made 10%" in the verb-list pattern left
  the same dangling `%` next to its marker (0288).
- A second, related bug surfaced fixing that one: three patterns' trailing
  unit had its leading space outside the optional group, so a figure with no
  unit word after it at all glued the marker straight onto the next word,
  "[PERFORMANCE REDACTED]loss" (found while fixing 0288, same shape as the
  known "mark" corruption in spirit, though not a leak by itself).

**An over-redaction found for the first time**, the opposite direction from
everything above: the account-size pattern's context check was accidentally
optional on itself, so it matched any "<number>k" anywhere and redacted three
unrelated trading-volume figures as if they were personal account sizes
(0023, 0240, 0251). Fixed with a nearby-"volume" guard.

**The name list itself was the bigger gap.** The original 53-name list was
built from 23 sessions. Reading all 393 in full for Q&A extraction surfaced
well over a hundred real member names never added to `glossary/names.json`,
left unredacted the entire time simply because nobody had been asked to
protect them yet. Cross-checked against `tools/find_names.py` run over the
full 393-file set, sampled individually against raw context to catch word
collisions before adding (three were dropped this way: "Cam" collides with
an abbreviation for "candle," "Lee" with a garbled "Li Auto" ticker, "Ben"
with a garbled "hellbent"; "Lulu" was dropped as the LULU ticker). 192 names
now protected, up from 53. See `glossary/names.json`'s own `_reviewed_over`
note for the full account of what was added and what was deliberately left
out.

**Still open, not yet investigated:** a Q&A extraction batch flagged
`[COACH]` possibly mislabeling Vlad himself in session 0261 (violating "the
instructor is not redacted"). Checked directly: the raw transcript says
"Elliot" at that exact position, a real coach, so the tag is correct and this
was a false alarm from an agent's speaker-identification guess, not a
redaction defect. Also still open: whether "John Deere" (the company) is
being partially redacted the same way "John Murphy" was, since only the
Murphy collision was confirmed and fixed; a handful of narrower name
collisions logged only in `glossary/names.json`'s own note (Rob/rob-the-verb,
Nick/"fast nick" nickel jargon, Scott/Scotts-Miracle-Gro) rather than given a
Mark-style guard, because each was rare enough in sampling that the guard
did not seem worth the complexity yet.

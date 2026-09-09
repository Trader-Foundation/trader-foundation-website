# Finding: the redaction pass on the FB Live transcripts has real defects

**Status:** OPEN, needs Vlad and/or whoever owns compliance
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

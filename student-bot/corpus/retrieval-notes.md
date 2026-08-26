# Retrieval: how it works and where it fails

The bot uses BM25 keyword retrieval over `corpus/chunks.json`. Same logic in
`tools/ask.py` and in the bench page, and they are checked against each other,
because a bench that scores differently from the tests makes the testing lie.

## Rulings outrank transcripts

`prompts/system.md` says a ruling beats a transcript wherever they conflict.
Retrieval has to reflect that or the instruction is empty.

Without a boost, rulings scored **below** the transcripts they override. The
put seller risk ruling sat at rank 7 behind a live session, and the entire
point of that ruling is that the recording is wrong.

Ruling chunks now carry a **1.4 multiplier**. Modest on purpose: a ruling
should surface alongside strong transcript matches, not crowd out the teaching
a student actually asked for.

## Eight passages, not six

A ruling that *refines* a module rather than contradicting it correctly sits
just under the module's own teaching. That is right, but at six passages it
pushed the stochastics ruling out of view. Eight lets a refinement travel with
the thing it refines.

## Known limitation: it matches words, not meanings

**This is the real ceiling of the current approach and it should be understood
before anyone calls retrieval finished.**

Worked example. The chart decides ruling is built on *"trade the chart not your
heart"*.

| Question | Rank of that ruling |
|---|---|
| "trade the chart not your heart" | **1** |
| "does every decision come down to the chart" | **1** |
| "should i trade based on how i feel" | **31** |

Same question, in a student's words rather than the coach's, and the ruling is
unreachable. BM25 has no idea that *feel* and *heart* are the same thing here.

Three partial mitigations are in place, and none of them solves this:

- **Prefix expansion** bridges greed and greedy, patience and patient. It
  cannot bridge feel and heart, because they share no letters.
- **A four character floor on suffix stripping**, after "greed" was being
  reduced to "gre" and matching nothing.
- **A curated alias list**, student word to house word, added in `ask.py` and
  mirrored in the bench. See below.

## The alias list, and why it is short on purpose

The psychology material teaches *"you will see red"* at length. A student types
*"my position is down"* or *"i am losing money"*. No amount of stemming or
prefix matching connects those, so the teaching was there and unreachable: the
section ranked outside the top three for the question it was written to answer.

`ALIASES` maps a handful of student words onto the curriculum's, one
directional, and **adds** rather than replaces, so a query still scores on its
own words. Measured effect on the question that prompted it:

| Question | Psychology section rank, before | after |
|---|---|---|
| "my position is down should i be worried" | not in top 8 | **1** |
| "i am scared to lose money" | not in top 8 | **1** |

**Every entry must point at teaching that actually exists**, and that is the
whole discipline of this list. An alias for a topic the corpus does not cover
does not create an answer, it routes the student to the nearest wrong passage
instead of letting the bot say it does not have it. A confident answer from the
wrong section is worse than the gap, so the list stays small and each entry
names the teaching it reaches.

It is still a hand written list. It does not generalise, and the next student
phrasing nobody predicted will miss exactly as before. **Embeddings remain the
real fix**, and this is a stopgap that buys a few high traffic questions.

**The actual fix is embeddings**, which match meaning rather than spelling.
That is the upgrade to make when someone is ready to build the retrieval layer
properly. Until then, expect the bot to answer well when a student happens to
use curriculum vocabulary and to miss when they do not, which is exactly the
wrong way round for a beginner who does not know the vocabulary yet.

## What is checked

`tools/coverage.py` runs a fixed topic list and reports the top score per
topic, so a gap shows up as a number rather than a feeling. A ruling audit
lives in the session history: nine of nine rulings are reachable in the top
eight for a plain question about their subject.

`tools/test_retrieval_parity.py` runs the bench page's own retrieval block
headless and compares it to `ask.py`, question by question. **Run it after any
change to scoring, stemming, or the alias list.** The two implementations have
silently diverged twice, once on the stemmer and once on the guard rules, and
both times the failure was the same: the bench is what we test with, so when it
scores differently from the tool, a passing suite stops meaning anything.

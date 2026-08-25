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

Two partial mitigations are already in place, and neither solves this:

- **Prefix expansion** bridges greed and greedy, patience and patient. It
  cannot bridge feel and heart, because they share no letters.
- **A four character floor on suffix stripping**, after "greed" was being
  reduced to "gre" and matching nothing.

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

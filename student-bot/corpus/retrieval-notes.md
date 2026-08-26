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

## There is no relevance floor, and a simple one does not work

`prompts/system.md` tells the bot to say so and route on when retrieval returns
nothing relevant. **Retrieval never tells it when that is the case.** Every
query returns eight passages, whatever they scored, so the instruction depends
on the answering model noticing that the passages are unrelated.

The obvious fix is a score threshold, and it was measured rather than assumed.
Top score for twelve topics the corpus covers, against twelve it does not:

| | min | median | max |
|---|---|---|---|
| Covered | 8.0 | 14.5 | 20.8 |
| Absent | 6.1 | 9.6 | 19.9 |

**The distributions overlap almost completely.** Any cut that catches the weak
absent queries also throws away real answers, and any cut that keeps all the
real answers admits nearly every absent one. BM25 scores are not calibrated
across queries: they depend on how many terms a question has and how rare those
terms are, so the same number means different things for different questions.

So no threshold is shipped. **Relative** signals are more promising than
absolute ones, such as the gap between the top hit and the median hit, and
embeddings would make the question easier because a similarity score is
comparable across queries in a way a BM25 score is not.

## The ruling boost amplifies noise on weak queries

The 1.4 multiplier does its job when something matches. When **nothing** does,
it decides the ranking by itself: for "i need a win today" the top four hits
were all rulings, scoring 8.1 down to 7.4, none of them about the question.

Left in place deliberately. The boost fixes a real failure, rulings ranking
below the transcripts they override, and tuning it to behave on queries that
have no good answer would risk the case it exists for. **The right fix is the
missing relevance floor above, not a weaker boost.** Worth knowing when reading
bench output: a screen of rulings with single digit scores means nothing
matched, not that the rulings are relevant.

## Definitions lose to applications, and ranking tweaks cannot fix it

The numbered modules define the vocabulary. The live sessions use it constantly
without ever defining it. So "support and resistance" appears in thousands of
live chunks and in roughly one module chunk that says what it actually is, and
term frequency scoring has no way to tell those apart.

Measured after the technical analysis modules were indexed. Of twelve
definitional questions, the module's own definition reaches the bot's top eight
for seven of them and misses five: trendline, swing points, double top, support
and resistance, rising wedge. **Every miss is a term the live sessions say
constantly while applying it.**

Two fixes were tried and both were rejected, because both traded the same
currency:

**A source weight on the modules**, the same shape as the ruling boost.

| Module boost | Definitions reached | Application answers intact |
|---|---|---|
| 1.0 (none) | 7 of 12 | 6 of 6 |
| 1.4 | 7 of 12 | 5 of 6 |
| 2.0 | 8 of 12 | 5 of 6 |
| 2.5 | 9 of 12 | 5 of 6 |

**A query-type weight**, which is the more surgical idea: detect a "what is X"
question, and boost chunks that announce themselves as definitions with
phrases like "is known as", "is called", "what we call".

| Definer boost | Definitions reached | Application answers intact |
|---|---|---|
| 1.0 (none) | 7 of 12 | 5 of 5 |
| 1.5 | 8 of 12 | 4 of 5 |
| 1.8 | 9 of 12 | 4 of 5 |

**Neither ships.** Buying two definitions by breaking an application answer is
not an improvement, it is a different set of failures. The second attempt is
the more interesting failure, because query-type awareness is genuinely the
right idea and it still could not separate the classes: 177 live chunks also
match the definitional phrasing, since a coach explaining something mid session
sounds exactly like a module doing it.

**This is the second independent piece of evidence that BM25 is at its ceiling
here**, the first being the missing relevance floor above. Both problems are
the same problem in different clothes: **word matching cannot tell what a
passage is for.** A definition and an application of that definition use
identical vocabulary, and only meaning separates them.

Embeddings would separate them, because "what is a trendline" and "here is the
definition of a trendline" are close in meaning while "the trendline held again
today" is not. That is the upgrade, and these two measurements are the argument
for it.

**What to do until then.** More live sessions make this worse rather than
better, because each one adds application chunks competing with the same small
set of definitions. More modules and more rulings make it better. That is worth
knowing before anyone spends effort on the remaining 526 sessions.

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

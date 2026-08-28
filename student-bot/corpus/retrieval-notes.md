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

### What did work: smaller chunks

Both failed attempts were reranking, which is treating the symptom. The cause
is **term density**. At 1100 characters a definition sat inside a chunk padded
with surrounding narration, so the defining sentence was a small fraction of
the chunk's words and BM25 ranked it below live sessions that merely said the
term a lot.

Dropping `TARGET` from 1100 to 800 characters in `build_corpus.py`:

| TARGET | Definitions reached | Regressions |
|---|---|---|
| 1100 | 7 of 12 | none |
| 900 | 8 of 12 | none |
| **800** | **9 of 12** | **none** |
| 750 | 9 of 12 | none |
| 700 | 8 of 12 | one |
| 600 | 7 of 12 | none |

**Two definitions recovered at no cost**, which is what the reranking attempts
could not do. Swing points and double top went from unreachable to ranks 2 and
7. It is a plateau rather than a spike, since 750 and 800 both give 9, so the
value is not tuned to noise.

Below 700 it reverses, and the reason is worth keeping: chunks get too short to
hold a whole definition, so the definition splits across two chunks and the
density gain is lost. **There is a floor as well as a ceiling, because a chunk
has to be big enough to contain a complete thought.**

### The three that still miss, and why they are the hardest three

Trendline, support and resistance, and rising wedge. These are the terms the
live sessions say most often, so the definition competes with the largest pile
of applications. No amount of chunking fixes a 100 to 1 ratio.

**This remains evidence that BM25 is at its ceiling**, alongside the missing
relevance floor above. Both problems are the same problem in different clothes:
**word matching cannot tell what a passage is for.** A definition and an
application of that definition use identical vocabulary, and only meaning
separates them.

Embeddings would separate them, because "what is a trendline" and "here is the
definition of a trendline" are close in meaning while "the trendline held again
today" is not. That is the upgrade, and these measurements are the argument for
it.

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

## Single-letter house vocabulary is unreachable

**"What is the U pattern in volume" cannot retrieve the U pattern.**

`TOKEN` requires two characters, so the "U" is dropped and the query reduces to
`['pattern', 'volume']`, which is identical to "volume patterns". Both lose to
the rulings, because the rulings say "volume" constantly and carry the 1.4
boost.

The Volume module names four volume patterns and two of them are ordinary words
that retrieve fine, increasing and decreasing. Flat retrieves. **U does not, and
it is the one a student is most likely to ask about by name**, because it is the
only one whose name is not also its description.

Reachable with distinctive vocabulary:

```
volume patterns flat random U increasing decreasing  ->  Volume part 10, 20.7
volume is like gas in a car                          ->  Volume part 1,  13.2
is volume the amount of shares traded                ->  Volume part 3,  14.4
what is the U pattern in volume                      ->  rulings only
```

**Left as a limit rather than patched.** Lowering the minimum token length
indexes every stray letter across 2,976 chunks. Special-casing the phrase in the
tokenizer has to be mirrored exactly in `bench.html`, and silent divergence
between the two is the specific failure `test_retrieval_parity.py` was built
after. Neither cost is worth one term.

Same category as the relevance floor and the three hardest definitions: a
measured limit of word matching, recorded so it is not rediscovered. An
embedding index makes it disappear without a special case, since "U pattern"
and "U shaped volume" land near each other in vector space whether or not the
letter survives tokenization.

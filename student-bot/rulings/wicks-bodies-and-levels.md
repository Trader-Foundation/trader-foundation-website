# Ruling: read the wick and the body, and find levels where price has been before

**Status:** CONFIRMED by Vlad
**Bears on:** `rulings/answer-shape-live-trade.md` (the break rule),
`rulings/chart-with-student-levels.md` (what makes a marked level good),
`rulings/marubozu.md`, `transcripts/written/psychology-and-price-alerts.md`
(realistic price targets), and open question "three is the charm"

---

## The two rulings

> "I want the bot to tell a student Be aware of the wicks and the body of candles"

> "where is cluster of buyers or sellers have been before its usually a clear
> sign of support/resistance etc for price targets"

They are one idea from two ends. The second says where a level is. The first
says how to read price arriving at it.

---

## Part one: the wick and the body

**The body is what got decided. The wick is what got rejected.**

That is the whole reading, and the corpus is consistent about it across many
sessions.

### A wick is a fight that was lost

> "That upper Wick, while it doesn't mean people sold at the same time, it's
> telling you that people bought. Price can't go up if people aren't buying,
> right? So at some point in the day it went up and then sold off. That candle
> is showing us, hey buyers..."

Price went there. It did not stay. Somebody was willing to trade at that level
and somebody else was willing enough to push it back.

> "Look, sellers are stepping in. How do I know that? Well, the upper wick is
> showing it."

### No wick means nobody fought back

This is the marubozu ruling arriving from the other direction, and it is worth
teaching as the same lesson:

> "Broke support with good volume, and not only that, you see there's no lower
> wick on it. So it's not like shorts tried to cover their positions and get
> out. No, that looks very confident."

And again, on a move that had already run:

> "Notice when people knew that they wanted this to go down further, there's no
> lower wicks here. Right, it was confident. Now that we made a 26 point move,
> you're starting to see either shorts starting to close their positions, which
> causes price to go up, or people think that this is at a level you should be
> buying it."

**So the appearance of a wick where there were none is the change.** A run with
clean bodies is one side in control. The first candle that leaves a wick is the
other side turning up.

### Where the wick sits is what makes it mean something

> "Anytime you see those kind of candles coming in at the top or bottom of a
> move, that's your first signal of, mmm, you might be changing direction."

A wick in the middle of a range is noise. The same wick at the top of an
extended move, or at the bottom of one, is the first warning. **Position in the
move is part of the reading, and the bot says so rather than teaching the wick
in isolation.**

### Wicks at both ends are indecision

> "Some people call that a spinning top candle. It's just a larger form of
> indecision. You got a long wick at the top, long wick at the bottom. Not
> much." (transcribed as "spending top", now in the glossary)

### Volume has to agree

> "Two things to take into account here: this volume and this candle. The effort
> matches the result. Buyers stepped in and then we get this wick in the bottom."

**Effort matches result** is the phrase worth keeping. A rejection on heavy
volume is a real fight. The same shape on nothing is not much of one. This is
the indicator hierarchy again: volume and candle read together, never apart.

### A wick is not a break, and this refines the break rule

`answer-shape-live-trade.md` rules that a level breaks on a **close** below it,
never on a touch, because a wick through support is the move that takes people
out before price recovers. That stands.

What this adds is that a wick into a level is not nothing either:

> "Even if, for some weird reason, it ended with just a wick closing above that
> previous high, just having a wick above there shows, hey, buyers and bulls,
> they're trying to take it beyond that level. They didn't win today, but they
> weakened it. They made a good critical hit, so to speak."

So there are three states, not two, and the bot teaches all three:

| What price did at the level | What it means |
|---|---|
| Closed through it | Broken. This is the trigger the break rule names. |
| Wicked through and closed back | Held, but weakened. Information, not a trigger. |
| Did not reach it | Untested. |

**Weakened is not a reason to act, and the bot must not let it become one.**
The break rule is unchanged: the close decides. This is the vocabulary for what
a student is watching in between.

The mirror case is in the corpus too, and it is the more common student error:

> "I don't think you want to play bearish here, despite it having that upper
> wick. It's not actually breaking down. So don't treat it as though it's
> breaking down if it's not breaking down."

**That is the sentence to reach for when a student panics at a wick.**

---

## Part two: levels are where price has been before

**A level is not a line someone chose. It is a place where a lot of buying or
selling already happened, and price remembers it.**

Vlad's framing is a cluster of buyers or sellers. The corpus works exactly this
way, in the coaches' own language: previous high, previous low, previous lower
high, an area where buyers stepped in before.

> "We already identified an area where buyers might step in regardless of news."

That was said about a level marked in advance, on a day the level held and the
news got the credit. The point being made is that the level was findable
beforehand from what price had already done.

### Rising lower wicks mark a level moving

This is where the two halves meet, and it is the best single passage in the
corpus on finding structure:

> "What's interesting there is just where those wicks, lower wicks, are
> starting. It's like slowly every week buyers are pushing the line of defense
> up."

**Line of defense is house vocabulary and worth using.** A cluster of lower
wicks at rising prices is buyers defending higher each time. The wicks are how
you see the cluster.

### The level is the price target

This is the part students most often miss, and it answers a question left open
in the psychology material.

> "Your risk back then was there, your reward was up to that resistance. But now
> your next level of resistance could very well be around here."

> "All I know is our price target was 56 and we established that... It was near
> an area of support, that 56 level."

**So a price target is not a percentage a student picks. It is the next level
up or down.** That closes the loop with Vlad's rule on realistic targets: *"of
course do we want 200%, but realistically is it going to happen in the time
frame that you have provided based on expiration?"* The chart answers it. The
next level is how far the move plausibly goes, and whether that is worth taking
is a risk to reward question with a real number in it.

### The alert goes before the level, not on it

Already ruled in the psychology material and repeated here because it belongs
with price targets:

> "Most of the time it doesn't always get exactly to that price target. So if
> you set your price alert for 56 exactly, you're never going to get the alert
> and you would be upset. It's like a little buffer zone."

---

## What this changes in the chart checking feature

`chart-with-student-levels.md` said the bot corrects a badly drawn level by
pointing at the criterion, and gave the criterion as "a level is where price
actually turned more than once." **That was my phrasing and it is now replaced
by the house one:** a level is where a cluster of buying or selling already
happened, visible as previous highs, previous lows, and the wicks where price
was pushed back.

The bot still does not supply the replacement level. It names what a level is
made of and sends the student to find it.

---

## Bot behaviour

**On any candle question**, the body and the wick are read together. Never
describe a pattern by its shape alone without saying what the shape means about
who won. The body is the decision, the wick is the rejection.

**Never rule on a student's actual candle.** Unchanged. Describe what the shape
means and let them look. The marked chart exception covers levels only, not
candles.

**On any question about where support or resistance is**, the answer is where
price has been before: previous highs, previous lows, areas where price was
pushed back. Not an indicator, not a round number, not a line that looks tidy.

**On any question about a price target**, the answer is the next level, and the
alert goes a little before it. Never a percentage, and never a figure attached
to what a student might make, which is unchanged under non-negotiables 1 and 2.

**On a wick into a level**, give all three states. Say plainly that weakened is
not a trigger, because a student who has just watched a wick pierce their level
is looking for permission to act.

---

## Open question for Vlad

The corpus says a wick into a level "weakens" it, and separately Module 5 notes
that levels often break on the third or fourth test, which is still an open
ruling under "three is the charm."

**Does a level being repeatedly wicked change what a student should do, or is it
only information?** The break rule says the close decides and nothing else, and
this file has been written that way. But if repeated tests are meant to change
how a student sizes, or how tight the alert sits, that is a different answer and
it is not something to guess at.

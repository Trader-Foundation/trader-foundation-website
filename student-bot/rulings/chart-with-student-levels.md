# Ruling: the bot may check a chart the student has already marked

**Status:** CONFIRMED by Vlad
**Amends:** non-negotiable 4, which previously read "the bot cannot see charts" with no exception
**Bears on:** `prompts/system.md` hard rule 4, `rulings/the-chart-decides.md`, `rulings/answer-shape-live-trade.md`, the `chart` guard

---

## The ruling

> "I am okay with a student showing them a chart to the bot and drew its own levels and YOU correcting them and saying hey this is far off"

A student may upload a chart image. If they have drawn their own support and
resistance on it, the bot looks at it and tells them whether the levels hold up.
Including telling them plainly when a level is wrong.

## What changed and what did not

Non-negotiable 4 used to be absolute: no charts, no exceptions, and
`the-chart-decides.md` leaned on that absoluteness as the thing that made the
bot **structurally incapable** of giving trade advice. That argument cannot
survive unchanged, so it is replaced rather than quietly dropped.

**The old guarantee:** the bot cannot decide because it cannot see.

**The new guarantee:** the bot can see, and still cannot decide, because seeing
a chart is not the same as knowing the student's plan, their entry, their
sizing, their timeframe, or their tolerance. **The decision was never in the
chart alone.** It is in the chart read against a plan the bot does not have and
does not ask for. So the bot can say a line is drawn in the wrong place and
still be genuinely unable to say whether to stay in the trade.

That is a weaker guarantee than the old one and it is worth being honest about
that. It rests on a rule now rather than on an impossibility. The compensating
controls are the entry cost and the hard stops below.

## The entry cost: the student marks it first

**The bot never marks up a blank chart.** If a student uploads a chart with
nothing drawn on it, the bot does not find the levels for them. It asks them to
mark where they think support and resistance are and send it back.

This is the whole point of the feature and it is not negotiable against a
student who does not want to. Vlad: *"it forces them to think. forces them to
use their brain."* A bot that reads levels off a blank chart has done the work
for the student, which is the failure this project is built to avoid. A bot
that checks the student's own marks has made them do the work and then told
them whether they did it well.

The upload is proof of work. No work, no check.

## What the bot may say

- **That a marked level is well placed**, and what makes it hold up: price
  turned there more than once, it shows up on more than one timeframe, there
  was a reaction rather than a pass through.
- **That a marked level is far off**, and why, in terms of the criterion.
- **That the student has marked support where the chart shows resistance**, or
  the reverse, which is a common and correctable error.
- **That a level was real and has since broken**, using the close below rule
  from `answer-shape-live-trade.md`.

## What the bot may not say, and this is the load bearing half

1. **It does not supply a level the student did not draw.** Not on a blank
   chart, and not as the correction to a bad line. "Your line is far off, the
   real support is 86" replaces their judgment with the bot's. The correction
   points at the criterion and sends them back to redraw.

   **The criterion is Vlad's, ruled separately in `wicks-bodies-and-levels.md`:**
   a level is where a cluster of buying or selling already happened, visible as
   previous highs, previous lows, and the wicks where price got pushed back. So
   the correction sounds like *"price passed straight through that line three
   times without reacting. A level is where buyers or sellers already stepped
   in. Find where price got pushed back before, and redraw it."*

   An earlier version of this file gave the criterion as "where price turned
   more than once", which was my phrasing rather than the house one. Replaced.

   **Naming the replacement level is my call rather than Vlad's**, and it is
   the one part of this ruling he has not explicitly settled. The reasoning:
   naming it is the shortest path back to doing the student's work for them,
   and the correction is still a real correction without it. If Vlad wants the
   bot to name the better level, this paragraph is what changes.

2. **It does not read anything off the chart except the marked levels.** Not
   the candle, not the volume bar, not the moving averages, not whether a
   pattern is present. Non-negotiable 4 is amended for levels only. "Is that a
   marubozu on my chart" is still refused, and the reason is unchanged: the bot
   describes what the pattern is and lets the student name it.

3. **It does not render a trade decision.** Seeing the chart does not unlock
   cut, hold, add, roll, or close. The position guard fires exactly as before.
   A student who marks their levels and then asks whether to cut gets the three
   move answer shape, now anchored to a level the bot has actually seen.

4. **It never states a precise price as a verdict.** Reading a number off a
   pixel position is an estimate and the bot says so in the way it talks.
   "Around 86" and "the area near 95" are honest. "86.44" is a precision the
   image cannot support, and a student will write it down.

## Why the precision limit matters more than it looks

Vlad's own INTC chart is the worked case. The blue lines on it are his, drawn
at roughly 95.3, 86.4, 83.0 and 82.1. Reading those back off the image was
close but not exact, and one of them was initially mistaken for a platform
premarket marker rather than a drawn line.

Colour convention is what resolved that, and it is a real signal: the student's
drawings in one colour, the platform's own annotations in another. But the
convention is per student and per platform. It is not something the bot can
rely on, so **when it is not obvious which lines are the student's, the bot
asks rather than guessing.** A confident read of the wrong line is worse than a
question.

## What this does to the guard

The `chart` guard had one verdict. It now has three states, driven by whether
an image is present and whether the student has marked it:

| State | Verdict |
|---|---|
| No image | Cannot see it. Unchanged, and still the common case. |
| Image, nothing marked | Send them to mark it. Not a refusal, an instruction. |
| Image, levels marked | Check their marks, within the limits above. |

The position, outcome, predict and retired guards are untouched and still fire
ahead of any of this. An image does not buy a student past them.

## The honest summary

The bot went from cannot see to may see one specific thing, on one condition,
with the trade decision still out of reach. The condition is that the student
did the work first, and the limit is that the bot checks the work rather than
replacing it.

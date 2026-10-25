# Marubozu, house definition

**CONFIRMED by Vlad.**

> "a maribouzo is a full body candle whether its a bullish or bearish candle
> that completely engulfs the previous candle"
>
> "it usually signifys buyers or sellers are in complete control"
>
> "bearish or bullish engulfing candle no wick"
>
> "or minimal wick"
>
> "either or buyers or sellers are in complete control"

## The definition the bot teaches

A marubozu is a **full-bodied candle with no wick, or a minimal one, that
engulfs the previous candle.** It can be bullish or bearish.

**Minimal, not strictly zero.** Vlad added this and it matters in practice:
real candles rarely close exactly at the extreme, and a definition that demands
a perfectly flat end would almost never be satisfied. A wick small enough to be
insignificant against the body still counts.

**Either way, buyers or sellers are in complete control.** That is the
reading, and it is the part that matters to a student. No wick means price
never traded back against the side that won: whoever was in control opened it,
held it, and closed it at the extreme.

## This is stricter than standard convention, deliberately

Standard technical analysis asks only for the absent or minimal wick. It does not require
the candle to engulf anything, and it treats engulfing as a separate pattern
about the relationship between two candles.

**The house definition requires both.** No wick or a minimal one, and it covers
the candle before it.

**So the bot adds one line noting that other sources define it more loosely**,
the same way it does for the inverted hammer. A student who cross-checks
elsewhere will find a definition that omits the engulfing requirement, and they
should meet that difference from us first rather than concluding the curriculum
is wrong.

## Why the stricter version is the more useful one

The two properties say different things and the house definition wants both:

- **No wick, or minimal** says the winning side was never meaningfully pushed
  back during the session.
- **Engulfing** says this candle undid everything the previous one did.

Either alone is a signal. Together they are the strongest single-candle
statement of control the method uses, which is why it is worth having a name
that only applies when both are true.

## How this got settled, and what it corrects

The test set case C1 originally expected *"Full-bodied candle, little or no
wick. Bullish version opens at low, closes at high. Bearish is the inverse."*
That is the standard definition and it omits the engulfing requirement, so
**C1 has been updated to the house definition.**

I flagged the conflict rather than encoding it, because `CLAUDE.md` names
guessing at Vlad's teaching as the main failure mode on this project, and
marubozu is the first content case a student would hit.

## Spelling

The transcription tool mangles this word. Known forms in the raw material:
"miru bozu", "Mirabozor", "maribouzo". **The bot always writes Marubozu.**
`glossary/terms.json` carries the corrections.

# Ruling: the indicator hierarchy

**Status:** CONFIRMED by Vlad
**Applies to:** every question about any indicator, named or not
**Supersedes:** the earlier "RSI is out of scope" ruling, which this replaces with a real answer

---

## The ruling

There are a million indicators. What matters is the order you use them in.

**Primary, always:**

1. **Volume**
2. **Candlesticks**
3. **Context**, meaning trend structure: higher lows and higher highs, or the reverse

**Supplementary, after those:** indicators. RSI, stochastics, MACD, Fibonacci, and anything else a student brings.

## Why this is the answer to more than RSI

A student can ask about any of hundreds of indicators, and the curriculum will never cover most of them. Answering each one individually is impossible and answering "not in the curriculum" is unhelpful.

This ruling gives one answer that works for all of them, including indicators nobody has heard of yet. The student learns where anything they encounter fits, rather than getting a yes or no on a specific tool.

## What the supplementary layer is actually for

Being supplementary does not mean vague. Within that layer there is a primary use.

**Stochastics are used for divergence, bullish or bearish.** That is the read to look for, not the raw overbought and oversold number.

The Momentum module says the same thing outright: *"Divergence is a more reliable way you can use the stochastics."* It then defines both directions:

- Stock moving **down** while stochastics move **up**. A bullish setup, reversal to the upside.
- Stock moving **up** while stochastics move **down**. A bearish setup, reversal to the downside.

The module also warns off the naive read of the bands on their own: *"just because it's above 80 does not mean the run is over."* The 80 and 20 levels tell you where you are. The divergence tells you what may be about to change.

So when a student asks what stochastics are for, the answer leads with divergence and mentions the bands as context, not the other way round.

MACD gets the same treatment: the module calls crossovers *"the most powerful pieces of the MACD"*, and the histogram turning ahead of the lines is the earlier version of the same signal.

## And indicators are delayed

**Everything in the supplementary layer lags. Including divergence.** The Momentum module says so six times over, in plain terms:

> *"So oscillators are lagging indicators. Sometimes this indicator is a little slow and the stock will continue to move up beyond the 80 mark or below the 20 mark. Executing a trade too early in result of the signal can result in a fast loss."*

So a divergence is a heads-up that something may be changing. It is not a trigger, and acting on it alone is named in the module as a way to lose money quickly.

That is confirmation before entry arriving again, this time from the indicator side. A divergence is a reason to watch. Entry still waits.

**The histogram is the partial answer to the lag, not an escape from it.** The module notes the histogram turns before the MACD lines do, which buys a little earlier warning. It is still derived from past bars, so it is still behind price.

## Why the hierarchy is ordered this way

The ranking is not arbitrary. **It is ordered by how live the information is.**

- **Volume** is the most immediate thing on the chart. The Volume module opens by calling it a real time indicator and saying nothing is as live as it.
- **Candlesticks** are current. The candle forming now is this session's actual open, high, low and close.
- **Context**, the trend, is the accumulated record of what price has actually done.
- **Indicators** are computed *from* past bars. They lag by construction. That is not a flaw in any particular oscillator, it is what a moving calculation is.

So the hierarchy is really: read what is happening first, then read what is derived from it. An indicator can only ever tell you about bars that have already printed.

This is also why the bot should never let an indicator override the primaries in an answer. If volume and the candle say one thing and a lagging oscillator says another, the lag is a likely explanation, and the curriculum's own framing is that indicators confirm rather than lead.

## Bot behaviour

When asked about any indicator:

1. **Do not dismiss it.** There are a million indicators and this is one of them. It is not wrong, it is just not where the weight sits.
2. **Give the hierarchy.** Volume, candlesticks and context first. Indicators support that read, they do not lead it.
3. **Place the one they asked about.** It belongs in the supplementary layer.
4. **Point at what to work on instead.** If a student is reaching for a new indicator, the higher-value move is usually getting sharper on the three primaries.

For indicators the curriculum *does* teach, stochastics and MACD, continue to answer from the module content. The hierarchy sets their weight; it does not replace the teaching.

For indicators the curriculum does not teach, the hierarchy is the whole answer. Do not explain how the indicator works from general knowledge. That is still the grounding rule, and it still holds.

## Consistency with what is already taught

This does not contradict the recordings, it ranks them. The Momentum Indicators module already says: "MACD and stochastics are both great indicators to confirm your decision. But should not be something you're leading with." Module 8 says Fibonacci is "just another supplement you could use."

The ruling states as a hierarchy what the modules state one at a time.

It is also the judge-and-evidence framing from Module 3 applied to tooling. No single piece of evidence convicts, and some evidence carries more weight than others.

## What "context" means

**The trend of the stock itself, read off the chart.** Which way is it going.

The higher lows and higher highs phrasing is one way to describe that, not a separate concept to learn.

## Is it citable? Yes, but distributed

An earlier version of this file claimed trend structure was taught nowhere, on the grounds that "higher high" and "higher low" appear zero times in the supplied material. That was the wrong conclusion from a correct search. The phrasing is absent; the concept is not.

Trend is taught across the curriculum rather than in a lesson of its own:

- **Module 2:** trade with the trend, countertrend carries more risk. The macro to micro screen asks which name inside the leading sector is trending hardest.
- **Module 3:** every candlestick pattern is taught relative to the prevailing trend. A hammer means something at the bottom of a downtrend and loses its force at the top of an uptrend.
- **Module 5:** channels, structure, and the role swap when levels break.
- **Moving Averages:** above the 50 and the 200 is a strong bullish trend, below both is a strong bearish one. That is the trend read, given as a mechanical check.

So the bot can cite this leg. It cites whichever of those modules fits the question rather than one canonical trend lesson.

**The lesson for the project:** absence of a phrase is not absence of a concept. Word-boundary searching is right for checking whether a *term* appears, and wrong for concluding something is untaught. Check the idea, not the wording.

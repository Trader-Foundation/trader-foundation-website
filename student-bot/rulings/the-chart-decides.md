# Ruling: every decision comes down to the chart

**Status:** CONFIRMED by Vlad
**Applies to:** everything. This is a governing principle, not a module note.
**Bears on:** open questions 19, 26, 31, 32, and any future question of the form "what is the rule for X"

---

## The ruling

> "every single decision always comes down to the chart."

Not the checklist. Not the parameter. Not the number in a worksheet. **The chart.**

## The house phrase

> **"Trade the chart, not your heart."**

Vlad's own words for it, and it should be treated as house vocabulary rather than as a slogan the bot invented. It is in `glossary/terms.json` under Trader Foundation terms.

The phrase carries a second edge the plain statement does not. "Comes down to the chart" says where the information is. "Not your heart" says **what it is competing with**: hope, conviction, the position you already like, the number you want to be true.

**This meets the max profit ruling exactly.** Vlad ruled that unbounded upside on a call is real but that *"more risky to want more."* Wanting more is the heart. Reaching further out of the money for a bigger multiple is a decision made by hope rather than by the chart, and it is the most expensive form of the mistake because it looks like ambition. The two rulings are the same idea approached from opposite ends, and they should be taught together.

So the phrase governs two failure modes at once. A student who follows a rule instead of reading the chart, and a student who follows a feeling instead of reading the chart. The chart is the answer to both.

## What this changes about everything already encoded

The processing so far has accumulated rules with numbers in them: 30 days minimum to expiration, two to three days holding period, close at 50 percent, as close to the money as possible, Full Stochastics at 14.3.3, the 13 and the 20.

**None of those are decisions. They are starting points for reading a chart.** The decision is made when a student looks at the chart and weighs what is actually in front of them.

This is the strongest form of a thing Vlad has said twice before: *"trading is not BLACK AND WHITE"*, and *"if there is a divergence usually shows with a candlestick and volume overall context into 1 picture."* The chain is a way of looking, and what you are looking at is the chart.

**So a number encoded here must never be presented as the thing that decides.** Where a value exists, it is a default a student starts from and adjusts by what they see. The worksheet says this in its own voice: *"the more experienced you get, the more flexibility you will have with this. But at this time, start using them all."* Start with the settings. Decide from the chart.

## What it does to the open questions

Several open items were phrased as "what is the rule for X." This ruling says some of them may not have a rule-shaped answer at all, and that a numeric answer would be the wrong kind of answer.

- **31, thirty days minimum.** Likely a floor a student starts from, not a threshold that decides. What the chart says about how long the move needs is the actual input.
- **32, how far into the money.** The module gives three placements in one lesson. Under this ruling that is not a contradiction to resolve, it is three chart reads.
- **19 and 26, holding period and when to close.** Same shape.

They stay open, because a default is still worth knowing and Vlad may well have one. But the answers are now expected to be "here is where you start, and the chart moves you off it," and none of them should be encoded as thresholds.

## Why this is the load-bearing principle for the bot

**The bot cannot see charts.** That was written as a compliance restraint, one of the eight non-negotiables. Under this ruling it stops being a restraint and becomes a description of the bot's position.

If every decision comes down to the chart, and the bot cannot see the chart, then **the bot is structurally incapable of making any decision in this method.** Not forbidden. Incapable. The information that decides is not available to it and never will be.

That is a stronger guarantee than a rule, because a rule can be argued around by a student who pushes, and a fact cannot. The bot does not decline to call the trade because it is not allowed to. It cannot call the trade, and it says so plainly.

> ### Amended: the guarantee moved
>
> `rulings/chart-with-student-levels.md` lets a student upload a chart they have
> already marked, and lets the bot say when a level is far off. The paragraphs
> above are kept because the principle they state is still the governing one,
> but the guarantee they rest on has changed and pretending otherwise would
> make this file lie.
>
> **The decision was never in the chart alone.** It is in the chart read against
> a plan the bot does not have and does not ask for: the entry, the timeframe,
> the sizing, what the student said they would do before they were in it. So the
> bot can see a marked chart, correct a badly drawn level, and still be unable
> to say whether to stay in the trade.
>
> That is a weaker footing than the old one, because it is a rule again rather
> than an impossibility. What holds it up is the entry cost: the student marks
> the chart first, and the bot checks their work rather than doing it. A blank
> chart still gets nothing.

**And it makes the bot's actual job obvious.** If the decision lives in the chart, the useful thing to hand a student at eleven at night is not a verdict. It is the questions that make the chart legible: what is the market doing, what is the sector doing, where is this in its structure, what does the candle say, does volume agree, what does momentum say, has it confirmed. They answer those against their own chart, and the decision is theirs, which is where it was always going to be.

This is what the guided-reasoning behaviour was already doing. This ruling says it is not a workaround for the bot's limitation. It is the method being taught correctly.

## Bot behaviour

Where a student asks for a rule, give what the curriculum gives, then say plainly that the chart decides and hand them the questions to ask of it.

Never present an encoded value as the thing that settles a question. Never let a checklist read as a formula.

When asked to make a call, the honest answer is not "I am not permitted to." It is: **the decision comes down to the chart, and I cannot see it.** Then the questions, then the coach.

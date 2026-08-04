# Ruling: Full Stochastics, not fast

**Status:** CONFIRMED by Vlad
**Applies to:** Momentum Indicators module, The Bounce Profit Plan
**Supersedes:** the Momentum Indicators video on this point

---

## The conflict

**The Bounce Profit Plan worksheet says:** "Under indicators make sure to select **Full Stochastics** and press Update", with parameters `14.3.3`.

**The Momentum Indicators video says:** "There's the full stochastic, slow stochastic or fast. It really just depends on how aggressive the moving averages are moving. I usually go for **fast stochastics** because most of our plays are somewhat of a fast play." Parameters given on screen as "the 14 and the 3".

These are different indicators. They draw different lines on the same chart, so a student following the plan and a student following the video were not looking at the same thing.

## The ruling

**Full Stochastics. Parameters 14.3.3.**

## What this changes and what it does not

**Changes:** which variant a student sets up, and the parameters. Any answer about chart setup names Full Stochastics at 14.3.3. The video's "I usually go for fast stochastics" passage is superseded and the bot does not repeat it.

**Does not change:** anything the Momentum module teaches *about* stochastics. The 80 overbought and 20 oversold bands, the lagging-indicator caveat, positive and negative divergence, the crossover read, and the rule that stochastics complement rather than lead all hold regardless of variant. That is the large majority of the module and it stays intact.

So this is a narrow correction to a setup instruction, not a rewrite of the lesson.

## Bot behaviour

State Full Stochastics at 14.3.3 when asked how to set up the chart. Do not present the fast/slow/full choice as an open decision for the student to make, because the house has made it.

Chart setup remains `PERISHABLE_PROCEDURE`: the bot names the document and hands the student to The Bounce Profit Plan rather than reciting the StockCharts click path.

## Why this ruling matters beyond itself

**This is the second confirmed case of a video being superseded, and the second time a written or current source carried the correction.** The inverted hammer was the first.

Two data points now say the same thing: the recordings are not self-correcting, and nothing inside a recording signals that it has been overtaken. The Momentum video states its preference confidently and gives a reason for it. Read alone it looks settled.

The generalisable rule, now supported twice: **where typed house material and a recording disagree on a value or a setting, the typed material is more likely to be current.** That is already the standing rule in `../glossary/terms.json`. This ruling confirms Vlad applies it the same way when the disagreement is about teaching rather than a transcription slip.

The advancement check exists to catch exactly this, and it needs running against every module rather than only where something looks odd.

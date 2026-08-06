# Ruling: put seller risk zone

**Status:** CONFIRMED by Vlad
**Applies to:** Options Calls and Puts module
**Supersedes:** the three-zone framing and the "2 out of 3 chances to win" line in that recording

---

## The ruling

**The risk zone for a put seller is everything below the strike price. The stock cannot touch the strike.**

## What the recording says

The module maps the put seller's outcomes with the stock at 100, a 2 premium, and the buyer expecting a fall to 50:

> "the seller is going to be fine if the stock is above 100, or if it's anywhere above 50 and between 100, now if it goes to below 50, obviously they will lose money. So 2 out of 3 chances to win is actually a pretty big benefit."

That draws the danger line at 50 and calls the middle band safe.

## What is actually true

The 50 in that example is **where the buyer guessed the stock would go**. It is not a threshold in the contract and it has no standing once the trade is on. The only level that matters is the strike.

So there are two zones, not three. Above the strike the seller is fine. Below it they are exposed, cushioned by the premium but exposed.

**"It cannot touch."** The seller does not want the stock reaching the strike at all, rather than watching it drift below and hoping the premium covers the difference. That is a tighter standard than break-even arithmetic would suggest, and it is the standard the bot teaches.

## Bot behaviour

State the risk zone as everything below the strike, and say the stock cannot touch it.

Do not repeat the three-zone framing. Do not repeat "2 out of 3 chances to win," which is separately excluded on compliance grounds and is also simply wrong: it is arithmetic derived from a middle band that does not exist.

If a student brings the three-zone version, having watched the video, correct it plainly and without making a thing of it. They are quoting the course accurately, so treat it as an update rather than a mistake on their part.

## Why this one mattered enough to ask

Every other open item changes what the bot says. This one changes what a student believes about their own downside.

Understating a risk zone is the most consequential kind of error a teaching module can carry, and it compounds: the "2 out of 3" odds claim is derived from the same three-zone picture, so the wrong boundary produced a wrong probability, which then reads as reassurance.

It also would not have surfaced from a transcription check. Nothing is mis-heard. The sentence is exactly what was said, and it is internally coherent. It only comes apart when the arithmetic is worked against the contract rather than against the example's narrative.

**Generalisable:** check taught rules against the mechanics they describe, not only against the rest of the transcript. This is the second time that check has earned its place, after the moneyness definitions in the scenarios module.

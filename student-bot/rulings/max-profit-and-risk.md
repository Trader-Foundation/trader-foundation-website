# Ruling: unbounded upside on calls, and the risk that pays for it

**Status:** CONFIRMED by Vlad
**Applies to:** the thinkorswim walkthrough, and to every module that reads a broker screen
**Resolves:** open question 33
**Supersedes:** the provisional hold on "max profit is infinite" recorded in `compliance-log.md`

---

## The ruling

Vlad's words:

> "CALLS in this instance. profit is infinite HOWEVER there is risk management that needs to be accounted for more risky to want more"

**On a long call the profit is unbounded, and the bot says so. It never says so on its own.** The upside and the risk that buys it are one statement, not a fact plus an optional caveat.

**Wanting more means taking more risk.** That is the second half and it is the part that does the work.

## Why the fact stays

It was held out provisionally on the reasoning that it was the most extreme thing the corpus could say. Vlad has ruled the other way, and the ruling is consistent with the standing rules rather than an exception to them.

The non-negotiable bars **specific financial outcome claims**: dollar figures and percentages attached to what a trader or student made. Unbounded upside on a call is neither. It is a structural property of the instrument, true of every call ever written, and it carries no figure and names no person. Removing it would have taught students something false about what they are holding.

It is also not optional knowledge. A student who does not know a call has no ceiling and a put stops at zero does not understand the two instruments they are being taught.

## What the risk half consists of

The curriculum supplies all of it. None of this needs inventing.

**Direction.** The whole chain, macro to micro, exists because the option only pays if the read is right. Unbounded upside on a call is unbounded upside *conditional on being right about direction*, and nothing in the method makes that more likely than the 70 percent target.

**The premium is a total loss when wrong.** The loss is capped, which is the good news, and the cap is 100 percent of what was put in, which is the rest of it. Options Intro states the worst case plainly.

**Further out of the money is cheaper, and cheaper is not better.** This is where "more risky to want more" bites hardest. The contract with the most spectacular theoretical multiple is the one least likely to pay anything, and it looks attractive for exactly the wrong reason. The walkthrough says it in one line: *"the further you get from the money the cheaper it is"*, and immediately after: *"You don't want to chase cause it's going to be a problem for you."*

**And the Greeks module gives this a number, which makes it teachable rather than just sound advice.** Delta measures how much a contract actually responds to a dollar move in the stock. The comparison drawn there is between a contract worth trading and one that is not:

> "have enough days, be closer to the money so you can start making, because what happens is if you start buying things like here, that's 15 cents. Well, yeah, but look, 0.04."

Fifteen cents for a delta of 0.04. The contract barely moves when the stock does. **That is what the cheap far out of the money contract really is: not a bargain, a contract that hardly responds.** Delta says so plainly, in a number a student can read off their own screen, which means "more risky to want more" stops being a caution and becomes something checkable.

**Less time is cheaper, and also riskier.** Vlad's own words in the same module: *"16 days instead of 30... it's only worth 87 because you have so much less time and you're taking more risk."*

**Time decay runs against the holder every day.** Theta, from Options Factors. The position loses value while nothing happens.

**Puts are the counterexample that makes the point.** A long put is capped, because a stock stops at zero. Taught as the asymmetry between the two instruments, the call's unbounded upside is a fact about how calls are built rather than a headline about earnings.

## Bot behaviour

**Asked what the maximum profit on a call is:** answer it. There is no fixed ceiling, because a stock has no fixed ceiling. Then give the risk half in the same breath: it pays only if the direction is right, the premium is lost in full when it is not, and reaching for more upside by going further out of the money or shorter dated is reaching for a lower probability. Contrast with the put, which is capped at the stock reaching zero.

**Asked how much they can make:** this is a different question and the answer does not change. That question is about the student's earnings, not about the instrument. The 70 percent target win rate remains the only permitted results language, and the worked arithmetic guard still holds.

**The two must not be allowed to blur.** "What is the max profit on a call" is a mechanics question with an unbounded answer. "How much can I make with options" is a results question with a bounded answer. Same words appear in both; they are not the same question, and reading the first into the second is the failure mode this ruling has to survive.

**Never state the upside alone.** Not as a headline, not as an opener, not as the last line of an answer. If a passage retrieves with the upside and without the risk, supply the risk from this ruling.

## The general rule this settles

A true, platform-generated number is not automatically an outcome claim. It is also not automatically safe.

The test is not whether the number is accurate. It is **whether the sentence can stand alone as an answer about what someone might earn.** Unbounded upside cannot, once it travels with the risk that produces it. That is the shape to apply to every broker screen the library walks through.

## What this also informs

Open question 32 asks how far into the money the method buys on entry. This ruling supplies the reasoning even before that question is settled: the far out of the money contract is where unbounded upside looks most attractive and is least likely to arrive. That is consistent with the walkthrough's stated preference for being close to the money, and it is why the two questions belong together.

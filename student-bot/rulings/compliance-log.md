# Compliance log

Every compliance hit found during scanning, logged here whether or not it was excluded.

**Excluded content is removed from the corpus, not tagged.** Tagging is not sufficient. A tag governs how a chunk is used once retrieved, and the exposure here is that the chunk is retrieved at all.

The log exists separately from the exclusion so the underlying video can be flagged for review. Excluding a passage from the corpus fixes the bot. It does not fix the video, which is still being watched.

## Standing rules

- No specific financial outcome claims of any kind
- No dollar figures attached to student or trader performance
- 70 percent target win rate is the only permitted results language
- Nothing that reads as personalized investment advice
- Education framing at all times

## Scan procedure

Per module, search for:

- Dollar figures in any form
- Percentage returns
- Earnings and income claims
- Any language promising or implying an outcome
- Retired program labels (Elite Four, Elite 12, Elite Twelve) and superseded pricing or guarantee terms
- "Free," "closer," "closers," "salesperson," "salespeople"

Log every hit. Do not silently fix and move on.

## Hits

| Module | Location | Content | Action | Video flagged |
|---|---|---|---|---|
| 5 | Alibaba walkthrough | Claim that people made thousands upon thousands of dollars in hours | Excluded from ingestion | Yes, pending review |
| 8 | Nikola walkthrough, second retracement | A move sized at "over 23 points" described as "very solid, solid, solid move, great profit on that" | Outcome clause excluded provisionally, see below. Teaching point retained | Yes, pending review |
| Moving Averages | Amazon walkthrough, options aside | "a 10 point move that could be Almost 150 to 200 percent gain off your money" | **Exclude.** Specific percentage return | Yes, re-record candidate |
| Moving Averages | Scaling passage | "let's just say you invested a thousand dollars. Well, if you invested a thousand, you already profited an extra 700" | **Exclude.** Dollar figures attached to performance | Yes, re-record candidate |
| Moving Averages | Bounce profit formula intro | "where you could literally make money every time it bounces off the slide" | **Exclude.** Reads as a guarantee | Yes, re-record candidate |
| Moving Averages | Options forward-reference | "we're going to see the power of how much money you could make in such a small move with a small bank account" | **Exclude.** Outcome promise | Yes, re-record candidate |
| Moving Averages | Multiple-average section | "moving averages can be applied for great short term gains... there's some huge gains" | **Exclude.** Outcome claims | Yes, re-record candidate |
| Moving Averages | Closing | "step by step of exactly what I do on a weekly basis to make money off moving averages" | **Exclude.** Outcome promise | Yes, re-record candidate |

### Options Calls and Puts: a direct win-rate promise

| Passage | Why |
|---|---|
| "You will win more times than none because you are more educated than the other person" | **Exclude.** A plain promise that the student will win more often than they lose. This is a win-rate claim made outside the only permitted results language |
| "So 2 out of 3 chances to win is actually a pretty big benefit" | **Exclude.** A stated probability of winning. Now also superseded on the merits: Vlad has ruled the risk zone is everything below the strike, so the middle band this figure was derived from does not exist. See `put-seller-risk.md` |

The first is the most direct outcome promise found in any module so far. Earlier hits attached
figures to trades or to the instructor. This one attaches an outcome to **the student**, in the
second person, as a consequence of taking the course. Module 5's Alibaba claim was about what
people made; this is about what you will do.

It is also inconsistent with the curriculum's own posture everywhere else: no almanac, technical
analysis tilts probability and nothing more, and some rulings will be wrong.

Both excluded. The surrounding teaching, that options put you against another participant with an
opposite belief rather than against a house, survives without either sentence.

### thinkorswim setup module: clean, and the reason is structural

**No outcome claims, no percentage returns, no win rates, no earnings language.** The cleanest source processed since the worksheets.

**And that is not luck.** This module has no motivating passage. It never argues that you should trade, only how to configure a platform, so there is nothing to oversell. It is the strongest confirmation yet of the pattern that compliance risk lives in the parts of a lesson that motivate rather than the parts that instruct.

Two items, neither an outcome claim:

| Passage | Action |
|---|---|
| "this person has a balance of 1,550" | **Redact.** A real account balance visible on screen. Privacy rather than compliance, and it would not have been caught by an outcome-claim scan |
| A live order placed and filled in the closing seconds, and a chart note reading "looking very bullish off the bounce" | **Redact the fill. Tag the note `DATED_EXAMPLE`.** The note is a drawing demonstration on a historical chart, not a call |

The account balance is the second privacy item found in a source that is compliance-clean, after the coaching call. **Worth stating plainly: the redaction pass has to run on module material too, not just coaching.** The assumption that only coaching carries personal data was wrong.

### Bull call and bear put coaching call: two excluded, and it retires an assumption

Processed under the scope ruling. Two live trades were placed and closed on screen, so the redaction pass mattered more here than the exclusion pass.

| Passage | Action |
|---|---|
| "Guaranteed premiums" | **Exclude.** First appearance of the word in the project, already logged above and now formally excluded with its source processed |
| "max profit is $1205 here and my max loss is $800. **Pretty good odds.** I like that" | **Exclude.** Fourth instance of the counting-scenarios pattern, and the second time a payoff ratio is called odds |
| "These are very good probability trade" | Borderline, logged. No figure, and it refers to one contract's distance from price. Keep |
| "this is a good strategy, especially for beginners, just to kind of be safe" | Borderline, logged. "Safe" language, but attached to *defined risk* rather than to an outcome, which is the true version of the claim. Keep, and the bot says defined risk rather than safe |

**Five live profit and loss readings redacted**, plus the student's own chart idea. Those are privacy items rather than compliance items and they would not have been caught by the exclusion pass.

**A useful non-finding.** The worked calculator arithmetic here is clean: three contracts at a dollar, sold at 1.35, giving 405 and a 105 profit. All correct, all hypothetical, all kept. Consistent with the pattern that the instructional half of a session is rarely the problem.

### Paycheck Collector part two, how you lose: much cleaner, three hits

The continuation covering loss mechanics. **Notably cleaner than the part one intro**, and the reason is structural: this half is about what goes wrong, so there is nothing to oversell.

| Passage | Action |
|---|---|
| "You'll be right 90 percent of the time for that max loss" (weekly options) | **Exclude.** Third stated win rate in this strategy's material |
| "So the chances are pretty high, right?" | Borderline, logged. No figure, and it refers to a specific spread's distance from price rather than to the strategy. Keep |
| "you owe us 800,000 in Netflix" and "this is going to be worth a hundred grand" | Keep. These are **assignment cost illustrations**, and they are the opposite of outcome claims: they exist to frighten a student away from a mistake. Under the worked-arithmetic guard |

**The arithmetic reconciles**: a 27 credit against a 473 max loss sums to 500, which is a 5 point spread on one contract. Consistent with the narrow-spread rule taught in part one.

**Worth recording as a pattern.** Part one sells the strategy and carries the largest exclusion set in the project. Part two explains how it fails and carries three hits, one of them real. **Compliance risk concentrates in the parts of a lesson that motivate, not the parts that teach.** That is the same finding as the produced-wrapper note above, from a different angle, and it should shape where the library pass spends its time.

### THE PAYCHECK COLLECTOR CLASS: the largest compliance load in the project, and it is a distributed class

**Ingested at Vlad's direction.** He has ruled that coaching material is in scope: *"i need you to put this in though"*, *"everything im feeding you is needed."* That is his call and the scope boundary moves. The standing rules do not, so this gets the same compliance treatment as every module, and the named student is redacted in the clean file.

**Read this first: it is not a private call.** It opens with a produced introduction that ends *"I would recommend really pay attention to this class... See you in the class."* It refers to itself as *"a class like this, a paid class"*. So the material below is not loose talk between two people. **It is content students are shown**, which means the exposure is live in the product right now, independently of anything the bot does.

That is why this entry is longer than the others.

#### The framing claim, stated in the introduction

> "you'll be able to collect a premium on a weekly basis **knowing exactly how much money is going to come in, usually an average about 10 percent of your account, 10 percent a week or a month**"

> "if you want to make 10 grand a month, you gotta understand you gotta have 10 percent of this, it'll be what a hundred grand"

> "**That's a very safe strategy**"

**This is the most consequential compliance item found anywhere in the project.** It is not a figure inside a worked example. It is the strategy's stated design, delivered in a scripted intro, and it does three prohibited things at once: it states a recurring rate of return, it says the amount is knowable in advance, and it calls the strategy safe.

"Knowing exactly how much money is going to come in" is also not true of a credit spread. The credit is known. The outcome is not. That distinction is the entire risk of the position and the sentence removes it.

**Excluded in full. Flagged as a re-record line rather than an edit**, because it is the opening frame of the class rather than an aside inside it.

#### The compounding projection

> "let's just say you invest 2,500 this week, you collect 250 next week... in a month from now you're going to have 11 grand... now you're taking 275 per week... as long as you're consistent and do that math consistently, and I did, **you're going to make retirement money**"

A month by month wealth trajectory built on the 10 percent rate holding every week, ending in the word retirement. **Excluded in full.** This is the same shape as the Greeks module's account-growth line and considerably longer and more specific.

#### Stated win probabilities

| Passage | Why |
|---|---|
| "I noticed you have a 90 percent chance of winning" (weekly spreads) | Stated win rate |
| "that's going to give you the 90 over 90 percent chance of win" | Stated win rate |
| "it basically kind of tells you that you have a 7 percent chance that this is going to happen" | Delta read as probability. This one is a standard trader approximation and roughly defensible, but it is stated as fact and it feeds the 90 percent claims above |
| "do you see how the chances are in your favor?" | Reinforces the above |

The delta approximation is worth separating from the rest. It is a real convention and the reasoning is sound. What is not sound is converting it into "90 percent chance of winning" and presenting that as a property of the strategy. **The two 90 percent claims are excluded. The delta convention is kept as mechanism**, taught as roughly how likely the option is to finish in the money rather than as a win rate.

#### Third party income and account figures

| Passage | Action |
|---|---|
| "he's making like four grand, I think he told me a week" | **Exclude.** A named individual's weekly income |
| "he's working with like 130,000, 150,000" | **Exclude.** Account size |
| "I started with five grand... right now I'm at around eight" | **Exclude.** Instructor performance |
| "a couple of people got a hundred grand, 200 grand, and then they lost it all" | **Exclude.** Figures attached to students, even though the point being made is cautionary |
| "I've made five G's in a day" (student) | **Exclude and redact.** Student performance |
| "I'm only working with 10 G's right now" (student) | **Redact.** Student account size |
| "in this particular account of mine, I just collected 460" | **Exclude.** Instructor result on a live position |

All the student figures are redacted in the clean file as well as excluded, because redaction protects the person and exclusion protects the bot, and those are different jobs.

#### "Guaranteed" again, and a retired-term flag

> "even though it's **guaranteed** to get filled at 15 cents"

Second appearance of the word, after the credit spreads forward reference. Here it is about a fill rather than a return, which is milder, and it is still the word. **Excluded.**

> "one of our **elite** members"

**Flagged for Vlad, not auto-excluded.** Non-negotiable 8 retires Elite Four and Elite 12. "Elite members" is not either of those, and it may be a current and perfectly fine descriptor of a membership tier. It may also be a survival of the retired naming. **I do not know which, and guessing wrong in either direction is bad**, so it is open question 39 rather than a silent edit.

#### What survives, and it is substantial

The teaching underneath is genuinely strong and most of it is compliant:

- The strategy mechanics: sell a credit spread around 0.07 delta, 30 to 37 days out, close early rather than holding to expiration.
- **The risk lecture, which is the best passage in the source.** Keep the spread narrow, never end up inside it, and what assignment actually costs. *"The spread is the biggest risk you have. You never want to end up in that spread. I don't care if you're going to make way less money."* That is a risk-first passage and it is the counterweight the introduction lacks.
- The discipline argument: refusing a 30 percent credit on purpose because the probability behind it is worse. *"Don't fall in love with the 30 percent, fall in love with longevity."*
- The evidence standard, which is the chart ruling in live form: *"what's your evidence... if you're not doing it, then you're gambling."*

**The gap between the introduction and the body is the finding.** The intro sells a rate of return. The body spends most of its length arguing against reaching for return and in favour of never being near the strike. The body is the teaching. The intro is the problem.

### From an OUT OF SCOPE source: "guaranteed premiums"

**Not corpus content.** Found in a live coaching call, which is out of scope for v1 and is not being ingested. Logged here anyway, because the standing rules are about what gets said to students and this was said to a student.

Closing sentence of the call, introducing the next lesson:

> "the credit spreads where you're actually collecting. **Guaranteed premiums** and that's what we're going to get into next."

**"Guaranteed" is the most prohibited word in this vocabulary**, and this is the first time it appears anywhere across fourteen sources. Every prior hit was a figure, a percentage, or an implication. This is the plain word.

**It is also false on the mechanics.** A credit spread collects a premium up front, and that premium is not profit. The position can and does lose more than the credit taken in. What is guaranteed is that the money arrives at the open, not that it is kept. That distinction is the entire risk of the strategy, and "guaranteed premiums" erases it.

**Live speech, not a script.** In a conversation it plainly means "the premium is collected up front rather than hoped for," which is true and is a real contrast with debit spreads. That reading does not survive being written down, and it certainly would not survive a bot repeating it.

**Two actions.**

1. **The bot never uses the word in connection with premiums or any outcome**, regardless of source. Already covered by the standing rules, restated here because the phrase is memorable and could be picked up from a student quoting it back.
2. **Scan the credit spreads module carefully when it arrives.** This is a forward reference to a lesson not yet supplied, and the framing this call sets up is the framing that lesson is likely to open with. Open question 37.

### A PATTERN ACROSS MODULES: probability derived by counting scenarios

**This is the most important thing in this log, and it is not a single hit. It is a habit of reasoning that has now produced a stated win probability three times, in three different modules.**

| Module | Passage | What it counts |
|---|---|---|
| Calls and Puts | "So 2 out of 3 chances to win is actually a pretty big benefit" | Three zones on a payoff diagram, treated as three equally likely outcomes |
| Vertical Spreads | "if it moves up, we profit. If it doesn't move, we lose. And if it moves down, we lose again... we have a one out of three chance of winning" | Three price directions, treated as three equally likely outcomes |
| Vertical Spreads | "my max profit is 1881 and my max loss is 1119. So if you think about it, those are pretty good odds" | A payoff ratio, described as odds |

**All three are the same error.** Counting the outcomes a position can have tells you nothing about how likely each one is. A stock is not equally likely to rise, fall, or sit still. A zone on a diagram is not a probability. And a favourable payoff ratio is not favourable odds, it is a favourable *price* for whatever the odds turn out to be, which is close to the opposite point.

**It matters twice over.**

As compliance: two of the three are stated win rates, which the standing rules permit only as the 70 percent target. The Calls and Puts instance is already excluded. The "one out of three" and "pretty good odds" lines are the same class.

As teaching: it contradicts the curriculum's own posture everywhere else. Module 3 says there is no almanac and that technical analysis "tilts probability toward you, nothing more." The spreads module itself says "we can predict the patterns and not simply gamble." A method built on tilting probability cannot also derive probability by counting boxes, and a student who learns the counting habit will misprice every position they ever look at.

**The spreads instance is the mildest in intent and the most instructive.** It is used to argue the odds are *against* the student, as motivation for why the method exists. The framing is honest. The arithmetic behind it is still not a probability, and it trains the exact reflex that produced "2 out of 3 chances to win" in an earlier module.

**Action:** the two spreads passages are excluded, consistent with the Calls and Puts precedent. The teaching point each was serving survives without them. "The chances are not in our favour without a method" needs no fraction. "This is a good risk to reward ratio" is what the 1881 against 1119 actually says, and it is both true and useful.

**Recommendation for the library pass:** this is a phrasing habit rather than six bad sentences, so search for it directly. Any place a module counts scenarios and then states a chance of winning is a hit, and there are likely more in modules not yet scanned.

### Vertical Spreads: max profit stated as max loss, twice

Not a compliance hit. Logged here because it is the fourth finding from checking a taught claim against the mechanics, and because it is provable rather than suspected.

**Every number in this module reconciles exactly.** Net debit times 100 times contracts gives max loss; width minus debit, times 100 times contracts, gives max profit. All six worked positions check out, including all four live Roku readings. The formulas are right and the platform readings are right.

Which is what makes the two slips unambiguous:

| Said | Correct | Established where |
|---|---|---|
| "it will always be 1881 is the most you could lose" | Max loss is **1119**. 1881 is the max profit | Stated correctly by the instructor about ninety seconds earlier |
| "if your stocks moving down you're losing 1134" | Max loss is **866**. 1134 is the max profit | Stated correctly two sentences earlier |

Both times the max profit figure is given as the loss. Same direction both times.

**The error is in the safe direction, which is why it is easy to miss.** It overstates the downside rather than understating it, so nobody trading on it gets hurt by the number itself. But max loss and max profit are the whole point of a spread, they are the reason the strategy is being taught as the safer one, and a student who takes the sentence at face value has the two most important numbers of the position swapped.

**Bot behaviour: use the correct figures.** They are provable from the module's own arithmetic and the module states them correctly elsewhere, so this needs no ruling. Fifth instance of a transcript containing its own correction.

**Flagged for the video** as a caption or annotation fix rather than a re-record. Two sentences, and both have a correct version already on screen.

### Vertical Spreads: the rest of the scan

| Passage | Action |
|---|---|
| "these are going to be pretty decent odds for you to make it" | **Exclude.** Win-likelihood claim attached to completing the course, same shape as the excluded "you will win more times than none" |
| "this raises our chances substantially" (technical analysis) | Borderline, logged. No figure, and the surrounding teaching hedges properly. Keep |
| "If you could make $813, that's pretty good" | Hypothetical on an invented position. Keep under the worked-arithmetic guard |
| "manage your risks substantially with a small bank account" | Borderline, logged. This is about risk reduction rather than earnings, which is the opposite emphasis from the Greeks module's use of the same phrase. Keep |

Notably **cleaner than the Greeks module on returns.** The figures here are almost all risk figures, and the module's argument is that spreads lose less, not that they make more. That is the compliant version of the same lesson, and it is worth noting as evidence that this material can be taught within the rules.

### Greeks in thinkorswim: the heaviest compliance load in the corpus, and a re-record recommendation

**This module is worse than Moving Averages, and it is worse in a way that exclusion alone will not fix.**

Moving Averages carried six hits threaded through the lesson. This one carries three percentage returns, a compounding account-growth narrative, and a closing pitch, all aimed explicitly at a beginner with a small account. It is also the only module in the corpus that **poses the earnings question in the instructor's own voice and then answers it with figures**:

> "If you, for example, have 500, and that's what you're starting with, because a lot of people ask that question, Well, how do I make money?"

That sentence names the exact question the standing rules exist to govern, tells the student other people ask it, and proceeds to answer it.

**Pile B, outcome and performance claims. Exclude.**

| Passage | Why |
|---|---|
| "that's 175 percent winner" | A stated percentage return |
| "that's a 88 percent move... you're making 87%, 1800 of investing 2060" | A stated percentage return, twice, plus the dollar pair it derives from |
| "That's 214 percent on the money" | A stated percentage return |
| "If this moves 8, like we wanted to, that's a thousand dollars. You're making a thousand dollars" | A dollar outcome, stated twice for emphasis |
| "That's the power of options" | Outcome framing attached to the returns above |
| "really start making money that you want to make with a small bank account" | An earnings promise, addressed to the smallest-account student |
| "If you, for example, have 500... Well, how do I make money?" | Poses and answers the earnings question directly |
| "And that's how you build your account. Cause the next time now you can invest way more because now you have almost 1500 in the bank" | **Compounding account growth.** The most serious single item. It is not one trade's return, it is a trajectory, and it implies repeatability |
| "So you could spend a lot less money to make huge profits" | Closing outcome promise |

**Pile A, Greek mechanics. Keep, under the existing worked-arithmetic guard.**

The per-Greek arithmetic is the teaching and the module is unteachable without it. Delta 0.45 means 45 cents per share per dollar, so $45 a contract, so $450 on ten. Gamma 0.06 means the next dollar pays 51 cents rather than 45. Theta 0.04 means $40 a day leaving. Vega 0.15 means 15 cents per point of volatility. Every one of those is mechanism, attached to a hypothetical position, and none of it names a person.

**The line between the piles is unusually clean here**, cleaner than in Options Intro. Pile A stops at "here is what this Greek does to your premium." Pile B starts the moment a figure is divided by the cost to produce a percentage, or added to a starting balance to produce an account. **That is the test to apply: the Greek arithmetic stays, the return arithmetic goes.**

**Why I am recommending a re-record rather than only an exclusion.** The exclusions protect the bot. They do nothing about the video, and this is the video a beginner with 500 dollars watches. Moving Averages was flagged as the first unavoidable re-record candidate. This one is a stronger case, because the offending material is not garnish here, it is the module's motivation and its closing argument, and the audience is the least experienced one in the funnel.

The Greeks explanation itself is the best in the corpus and deserves to survive. A re-record that keeps every Greek and drops every percentage would lose nothing pedagogically.

### Greeks module: a mechanical gap, separate from compliance

Not a compliance hit. Logged because it is the third finding from checking a taught rule against the mechanics rather than against the transcript.

**The headline returns are gross of time decay, and the module teaches the decay itself moments later.**

Delta gains are computed as if the move arrives for free: 450 a point, 8 points, 3600. Theta is then introduced at 0.04, correctly worked as $40 a day on the same ten contracts. The two are never netted. The module proposes holding "maybe in a couple of weeks," and fourteen days of that decay is $560, which turns the 3600 into roughly 3040.

So the arithmetic is right in every individual step and the conclusion overstates. Nothing is mis-heard and nothing is mis-said. The pieces simply never meet.

**This is a teaching point, not just a correction.** Delta and theta pull against each other, and the whole reason "have enough days" is a rule is that theta is the thing being managed. A module that shows both and never subtracts one from the other leaves out the tension that makes the advice make sense.

Since the return figures are excluded anyway, the bot is not exposed to the overstatement. It matters for the re-record.

### thinkorswim walkthrough: "max profit is infinite" — RULED, NOT EXCLUDED

**Vlad has ruled. The fact stays.** See `max-profit-and-risk.md`. The provisional hold recorded below is superseded.

> "CALLS in this instance. profit is infinite HOWEVER there is risk management that needs to be accounted for more risky to want more"

The unbounded upside on a long call is taught, never alone. It travels with the risk that buys it, and the operative half is that reaching for more upside means taking more risk.

**Why this is consistent with the standing rules rather than an exception to them.** The non-negotiable bars *specific* financial outcome claims: figures attached to a trader or a student. Unbounded upside on a call carries no figure, names no person, and is true of every call ever written. It is a property of the instrument. The provisional hold treated it as an outcome claim because of how extreme it sounds, which was the wrong test.

**The right test, and it generalises to every broker screen in the library:** not whether the number is accurate, but whether the sentence could stand alone as an answer about what someone might earn. This one cannot, once the risk half is attached to it. That is the shape to apply to the rest.

The record of the original call follows, kept because the reasoning is still the reasoning for anything that does not survive the test.

### Original provisional hold, superseded

The single most exposed sentence found in any module, and it is not a claim the instructor made up.

> "Now it says max profit. Max profit is infinite because it, it could go up as high as you want it to go up and you could sell it whenever."

**It is true, and it is the platform's own label.** thinkorswim displays max profit as infinite on a long call, because a long call has no upper bound. The instructor is reading the screen and explaining it correctly. Nothing here is wrong, exaggerated, or invented.

That is exactly why it is the worst one. Every prior hit could be excluded because it was loose language sitting beside the teaching. This is the teaching, it is accurate, and it is a broker's own words.

**Retrieved as a chunk against "how much can I make with options?" the bot answers "max profit is infinite."** No figure, no student named, so it clears the letter of the standing rules. It is still the most extreme outcome statement the corpus could produce, and unlike the Options Intro arithmetic it has no ceiling to argue about.

The contrast the module itself draws is the fix. Immediately afterwards, on the put side:

> "The only difference now is there is a max profit because the stock could only go down to zero and that's it."

That is the same fact taught as a *structural asymmetry between calls and puts*, which is the actual lesson, rather than as a headline about upside.

**Provisional action:** the "infinite" sentence is held out of the corpus. The call-versus-put asymmetry is retained and is what the bot teaches: a long call has no fixed ceiling because a stock has no fixed ceiling, a long put is capped because a stock stops at zero. Same information, and it cannot be served back as an answer to how much someone might make.

**Question for Vlad, and this is the one I would most like answered:** does a true, platform-generated statement count as an outcome claim once a bot can serve it on demand? The answer generalises well beyond this sentence, because every broker screen a module walks through is full of numbers like it.

### thinkorswim walkthrough: the calculator figures

| Passage | Assessment |
|---|---|
| "you will make 58 on this deal" | Hypothetical, two contracts, invented fill prices. Pile A mechanics. Kept under the worked-arithmetic guard |
| "if let's just say we have 10 contracts now, you're making 290" | Same |
| "we'll put a dollar here, 390" | Same |
| "So now, you know, you're going to make 300" | Same, though "you're going to make" is the most certain phrasing of the four. It describes what a limit order would pay if filled, which is conditional in a way the sentence does not say |

All four are outputs of the profit calculator worksheet the module hands out, run on made-up numbers. None attaches to a person. Kept, logged so the pattern is visible.

Also note "you'll know you'll make that amount of money," about setting a sell limit. True of a filled limit order, silent on the *if*. Not excluded, logged.

### thinkorswim walkthrough: a new shape of position-advice density

Every prior walkthrough narrated **when to get in**. This one narrates **how to click buy**, on a live option chain, on a real ticker, at real prices, ending in a working order.

> "we might have a great run to 34" ... "I always recommend try to be as close to the money as possible" ... "let's check out a weekly option of 30 days minimum" ... "if I were you I would watch this video again"

The `DATED_EXAMPLE` tag and the existing walkthrough guard cover the chart reading. The order placement is different in kind and tags `PERISHABLE_PROCEDURE`, which the bot does not recite at all. That is the right outcome for two independent reasons: the click paths rot, and reciting them is the closest the bot could ever come to walking a student into a position.

**BAC at 31.58 with a target of 34 is the most specific live setup in the corpus.** It is a historical chart and tags dated, but it is the case the `DATED_EXAMPLE` rule exists for, so it is worth naming here as the reference instance.

### Options Intro: the hardest case so far, and it needs a ruling not a red pen

**This module cannot be stripped of figures without destroying the lesson.** That makes it structurally different from every prior hit and the exclusion habit does not transfer.

Moving Averages carried outcome language as garnish: cut the six hits, the teaching survives intact. Here the arithmetic **is** the teaching. Options leverage is a numerical argument. Remove the numbers and there is no module.

So the figures need sorting into two piles rather than one.

**Pile A, mechanics. Keep.** Hypothetical arithmetic explaining how a contract works, attached to an invented house or an example stock, never to a real trader or student:

- The house: 300,000 value, 320,000 sale, 2,000 premium, contract rising to 5,500, 3,500 gain, 18,000 net on the exercise route
- The Apple illustration: 280 a share, 100 shares, 28,000 outlay, a 10 dollar move, 1,000 profit, 3.57 percent
- The loss illustration: invest 10,000, decline 25 percent, lose 2,500

Every one is flagged hypothetical in the transcript itself ("assume we have", "let's just say", "just using it as an example"). Several argue *against* stocks rather than promising anything: 3.57 percent is presented as a bad return, and the 2,000 premium loss is presented as the worst case.

**Pile B, outcome and performance claims. Exclude.** These attach results to real people or state efficiency as fact:

| Passage | Why |
|---|---|
| "97 percent on average, less money you're using to make the same exact gains" | A precise efficiency statistic stated as fact |
| "That's the way I've made money for many years" | Trader performance claim |
| "you were an all star and had a year where you made 120 percent of the profit" | A 120 percent annual return figure, even though the point being made is that it is not enough |
| "only 10 percent or less truly make it consistently" | Success-rate statistic about traders generally |

**Perishable, separate:** "minor commissions like 65 cents a contract". Third-party pricing, never recited. Also "as of this video, Amazon's over 3,000 per share", which the module helpfully dates itself.

### Why this needs a guard more than an exclusion

Even Pile A is dangerous once retrievable. Asked *"how much can I make with options?"*, retrieval lands on the house walkthrough and the bot restates "your total gain is 18,000". Compliant in the lesson, an outcome claim in the answer.

This is the same shape as the chart-walkthrough problem: material that is fine inside a video and dangerous once a bot can serve it on demand. The mitigation is the same. `prompts/system.md` now carries a rule that worked option arithmetic is mechanism illustration, never an indication of what a student might make, and that the bot explains the mechanism in relative terms rather than restating the figures.

**Question for Vlad:** does Pile A stay? My recommendation is yes with the retrieval guard, because the module is unteachable without it and none of it attaches to a real person. Pile B goes either way.

### Moving Averages: escalation, recommend re-record review

Six hits in one module, two of them unambiguous breaches of the standing rules: a stated percentage return ("150 to 200 percent gain off your money") and dollar figures attached to performance ("invested a thousand... profited an extra 700").

This is a different situation from Module 5. There the claim was one line in an otherwise clean video, and excluding it left the lesson intact. Here the outcome language is threaded through the module: it frames the bounce formula, the options aside, and the closing pitch for the next lesson. Excluding every hit leaves the teaching content standing, but the video a student watches still contains all of it.

The spec notes that older videos carrying claims may warrant a re-record decision independent of this project. **This is the first module where that decision looks unavoidable rather than optional.**

The bot exposure is contained: all six passages are excluded from ingestion, and test cases P1, P2, P3, and P5 all check for exactly this class of claim. The unresolved part is the video itself.

### Separate serious risk: the insider information line

Not an outcome claim, logged here because it is the single most dangerous sentence found so far.

> "If you're trading off the news and you could find something, But again, you got to have some sort of insider information, something like that..."

In context this is a warning that news trading on cheap stocks is not viable, delivered right after calling it gambling. That framing is consistent with Module 2, which states plainly that direction is unknowable without inside information, which is illegal.

Stripped to a chunk and retrieved against "how do I trade the news," the clause "you got to have some sort of insider information" reads as advice to obtain it. Module 2's "which is illegal" is not attached and would not come along.

**Action: exclude the clause.** The surrounding teaching point, that penny stocks are unreadable and trading them on news is gambling, survives without it and is the actual lesson.

### Module 8, boundary call, NEEDS VLAD'S RULING

This one sits on the line and the ruling should not be mine.

**Against excluding:** it is a price move on a historical chart, which is exactly what `DATED_EXAMPLE` exists for. No dollar figure. No student or trader named. No percentage return. Test P5's `fail_if` names "dollar or percentage outcomes," and a point move is neither.

**For excluding:** "great profit on that" attaches a result to a sized move. Asked "tell me about a trade that made a lot of money," retrieval lands on this passage, and the bot restates a specific figure with a profit framing. That is the exposure profile the Module 5 exclusion exists to prevent, in a weaker form.

**Provisional action:** the outcome clause is held out, the surrounding teaching point (the retracement levels called the reversal accurately) is retained, because that is the actual lesson and it survives without the figure.

Excluding is reversible. Surfacing an outcome claim to a student is not. So the conservative default holds until Vlad rules.

**Question for Vlad:** does a point move on a chart with "great profit" framing count as a specific financial outcome claim, or is it acceptable as a dated example?

## Borderline, logged not excluded

Outcome-flavoured language carrying no figure. Logged so the pattern is visible if it recurs, not excluded, since the standing rule bars *specific* outcome claims and nothing here attaches a number to student or trader performance.

| Module | Phrase | Assessment |
|---|---|---|
| Volume | "This is a money making move" | Describes a chart move, no figure, no student performance attached. Keep, tag `DATED_EXAMPLE` with the walkthrough |
| Volume | "you want to make sure that you collected your money based on this increase" | Same. Reads as position instruction more than an outcome claim, see the position-advice note below |
| Options scenarios | "Pretty good money, especially when you're looking at options and how many contracts you have" | Attached to a hypothetical 30 point move, not to a person. Keep with the worked-arithmetic guard already in system.md |

## Coverage

| Module | Compliance scan | Result |
|---|---|---|
| 2 | Sampled | Clean |
| 3 | Sampled | Clean |
| 5 | Sampled | One hit, see above |
| Volume (number unassigned) | Scanned | Clean. No dollar figures, no percentage returns, no earnings claims. Two borderline phrases logged above |
| 8, Fibonacci Retracement | Scanned | One boundary hit, see above. Otherwise clean |
| Moving Averages (number unassigned) | Scanned | **Six hits, two unambiguous.** Plus the insider information line. Re-record candidate |
| Options Intro (number unassigned) | Scanned | **Four outcome claims excluded.** Illustrative arithmetic retained pending ruling, see above |
| Options Factors (number unassigned) | Scanned | Clean |
| Options Calls and Puts (number unassigned) | Scanned | **Two excluded**, including a direct win-rate promise. See above |
| Options: in/at/out of the money (number unassigned) | Scanned | Clean, one borderline kept under the worked-arithmetic guard |
| Options thinkorswim walkthrough (number unassigned) | Scanned | Ruled by Vlad. "Max profit is infinite" stays, paired with the risk. See above |
| Options Greeks in thinkorswim (number unassigned) | Scanned | **Nine excluded, three of them percentage returns. Strongest re-record candidate in the corpus.** See above |
| Options Vertical Spreads (number unassigned) | Scanned | Three excluded, two of them the counting-scenarios pattern. Otherwise the cleanest options module on returns |
| Bull call / bear put *(coaching)* | Scanned | Two excluded, two borderline. Five live P and L readings redacted |
| thinkorswim setup (number unassigned) | Scanned | **Clean.** Two privacy redactions, no compliance hits |
| All others | Not started | |

Six of fifteen scanned modules were clean. Nine were not. (Counted off the table above, which had drifted from the tally under it.)

**The counting-scenarios pattern changes how the remaining pass should be run.** It is a habit rather than a set of sentences, it has appeared in two modules already, and it produces stated win probabilities that read as reassurance. Search for it specifically rather than waiting to notice it.

That matters for planning. The original assumption was a compliance pass that finds occasional hits. On this evidence it is closer to half the library needing review, and at least some of it needing re-recording rather than editing. Scope and owner for that pass are still unassigned, which is open item 8.

## Separate risk: position-advice density in chart walkthroughs

Not a compliance hit, and worth tracking here because it has the same shape: material that is fine inside a video and dangerous once a bot can retrieve it on demand.

The Volume module narrates entry and exit decisions against a live Tesla chart roughly seven times, including "that's your sign to get in," "this is a great time to get in on this stuff," "it's a good time to get out," and "we should have been out."

In the video this is a teacher walking through a historical chart, and the framing is obvious. Retrieved as a chunk in answer to "when should I get in?", it reads as instruction. The bot has a hard rule against position advice, but that rule protects against the bot *generating* advice, not against it faithfully relaying a retrieved passage that already sounds like advice.

**Mitigation:** these passages are chart-anchored, so they tag `DATED_EXAMPLE`, and the system prompt now carries an explicit rule that walkthrough entry and exit narration is illustration of a past chart, never a rule to apply to a live one. Expect every chart-walkthrough module to carry the same load.

### Half of the mitigation above was not true when it was written

Recorded here rather than edited away, because the failure is the useful part.

**The system prompt half is real.** `prompts/system.md` carries a "Chart walkthrough narration" section that names this exact risk, quotes these exact lines, and tells the bot to extract the principle rather than relay the call. That was built and it holds.

**The tagging half was fiction.** The Volume transcript reached the corpus and **all 22 of its chunks tagged `EVERGREEN`, including the five this entry quotes.** The paragraph above had been read as done for weeks. It was a sentence in a log, not a line of code.

That split is worth keeping in view, because the two halves protect against different things. The system prompt governs how the bot writes an answer. The tag governs what the retrieval layer hands it and how the chunk is presented. Having one and believing you had both is how a chart-anchored passage ends up presented as current teaching.

`DATED` could not have caught them and was never going to. It matches uppercase tickers, dollar figures, years, months, "earnings" and "today", and needs two hits in one chunk. This walkthrough names Tesla, Amazon and Peloton in title case and says "the next day". It matches none of it.

**The signal that a passage is anchored to one historical chart is not that it carries a date. It is that somebody is pointing at a screen.**

`WALKTHROUGH_NARRATION` in `tools/build_corpus.py` now matches the decision being narrated, not the pointing: "your sign to get in", "good time to get out", "we should have been out", "collected your money". One hit retags, where every other rule in `classify` needs two, because a lone date proves little and a sentence telling a student when to get in is already the whole problem.

Six chunks in 2,976 match. Five are Volume. **The sixth was in Moving Averages and had been mistagged since ingestion.**

The general rule this earns: **a mitigation written into a log is not a mitigation.** Any other entry here that claims a corpus-level protection needs the same check against the built corpus.

## Why the bot changes the exposure profile

In a recorded module the claim is embedded in context and passes once. A bot can be asked directly what students earn, will retrieve the nearest matching passage, and will restate the claim in writing, on demand, stripped of context, to any student who asks.

Test case P1 ("How much money do students make?") is a blocker specifically because it checks that the excluded Module 5 claim cannot be surfaced. Do not ship on a failing refusal case.

---

## FB Live sessions, first pass on the recovered batch

Six sessions were recovered from spilled Drive downloads after a container
rollback and run through the scan. Four flags, and the split is instructive
because three of the four are the opposite of a violation.

| Session | Flag | Verdict |
|---|---|---|
| #0027 | "guaranteed" | **Clean.** *"the reality is none of this is guaranteed"*, said while walking through a worst case. A disclaimer, not a claim. |
| #0035 | "guarantee" | **Clean, and worth keeping.** *"I can't guarantee any of these moves and I will never act like I can."* |
| #0045 | "guarantee" | **Clean.** *"we can't guarantee"*, attached to sticking to a plan. |
| #0045 | percentage per period | **EXCLUDED.** See below. |

**The excluded passage, FB Live #0045:**

> "if I could get three plays of 8% a week, my goodness, that's four weeks of
> doing that."

A stated percentage return per period, compounded out loud. Non-negotiables 1
and 2 both, and it is the same shape as the Paycheck Collector intro: an
aspirational figure multiplied over time.

**This exclusion has a real cost and it is recorded rather than hidden.**
Exclusion drops the whole chunk, and that chunk is also the clearest statement
anywhere in the corpus of taking base hits rather than swinging for a big move.
*"I'm all about taking base hits"* and *"I'm not a greedy person"* sit in the
same breath as the arithmetic. All of it goes.

That was accepted rather than worked around. Editing the figure out of a
coach's sentence and keeping the rest would make the clean file an unreliable
record of what was said, and every other exclusion in the list drops its chunk
the same way. Consistency matters more here than salvaging one passage.

**Follow up: the base hits teaching needs a clean source.** It is house
teaching, it pairs directly with "more risky to want more" and with the
Paycheck Collector's *"don't fall in love with the 30 percent, fall in love
with longevity"*, and the corpus currently has no reachable statement of it.
Either another session states it without the arithmetic, or it is worth Vlad
typing in two lines. Added as an open item rather than left as a silent hole.

**The pattern worth carrying into the rest of the library.** A keyword scan on
"guarantee" ran three false positives to one true hit here, and all three false
positives were coaches disclaiming carefully. That is a good sign about the
material and a bad sign about the scan: **the word that flags is the word an
honest speaker uses.** Percentage-per-period matching was the rule that earned
its keep, and it should lead the remaining pass.

---

## Absurd return figures, removed by rewrite rather than exclusion

**Ruled by Vlad: "remove the 7000 in general."**

Module 3 names 7,000 percent in order to reject it:

> "if you're looking to make these crazy amounts of money and make 7,000 percent
> returns every day, you're simply gambling. We can't predict that, but we could
> predict consistent small gains."

Vlad on what the passage means: *"it just means to be realistic, consistency is
key."*

**Rewritten rather than excluded, and the distinction matters.** Exclusion drops
the whole chunk, and this chunk also holds the module's cleanest statement of
base hits: "small gains at a high probability instead of big gains with a small
probability". That exact cost was paid earlier the same day on the FB Live
version of the same teaching, and paying it twice for the same lesson would be a
choice rather than an accident.

The Elite rewrites set the precedent: strip the term, keep the teaching, leave a
visible marker. The figure becomes `[FIGURE REMOVED]` and the sentence still
says that chasing crazy returns is gambling.

### It found a second instance nobody had flagged

Making the rule general rather than matching the literal 7,000 caught an
outcome claim in the options material that had passed every previous scan:

> "that's a 10 point move that could be almost 150 to 200% gain off your money"

That is a stated percentage gain attached to a worked example, which is
non-negotiable 1. It had survived because every scan until now was looking for
periodic returns, "percent a week" and the like, and this one attaches to a
move rather than to a period.

**The lesson: a results claim does not need a timeframe to be a results claim.**
The scans were shaped around "percent per period" because that is what the known
hits looked like. A figure attached to a single trade is the same claim with the
period left implicit.

### A bug worth recording

The first version stripped only the second half of a range, leaving "150 to
[FIGURE REMOVED] gain", which still states a figure. Ranges are now matched
first. **A partial redaction is worse than none**, because the marker signals
the passage was cleaned and the reader stops looking.

### What is deliberately untouched

The pattern requires "returns" or "gains" after the figure, so taught values
survive: Fibonacci at 38.2 and 61.8, the 50 percent scaling rule, the "10 to
25%" retracement in the double top definition, and "it's not exactly 100%" in
the technical analysis intro. Verified after the change.

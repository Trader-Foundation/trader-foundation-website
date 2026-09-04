# Open questions

Unresolved. Each needs Vlad's ruling. **Do not build around these and do not let the bot assert them.**

Where an item here is unresolved, the bot's correct behaviour is to give what is settled, say the precise point is being confirmed with the coaching team, and route to a coach. It must not fall back on standard convention and it must not take the transcript reading.

One question at a time. Vlad works by voice to text.

---

## 1. Piercing line, midpoint direction

**Status:** OPEN, blocks ingestion of the Module 3 piercing line passage

The transcript defines the piercing line as closing *below* the midpoint of the prior candle, and dark cloud cover as closing *below* the midpoint of the prior candle. These are meant to be mirror images and cannot both be below.

Standard convention has the piercing line closing *above* the midpoint of the prior bearish candle.

Most likely a single transcription error, but it must not be assumed. This surfaced through the definitional consistency check, which is the reason that check exists: any pattern taught with a mirror opposite gets read against its pair.

**Question for Vlad:** in a piercing line, does the second candle close above or below the midpoint of the prior candle's body?

---

## 2. "Three is the charm"

**CLOSED. Ruled by Vlad: an observation, not a rule.**
See `rulings/three-is-the-charm.md`. The count is a place to look. What
decides is the candle and volume gate, then trend, momentum and risk to
reward. Vlad: *"if pattern and volume isnt even there do not bother even
looking at all the indicators."*

**Status:** CLOSED. Kept here as the record of what was asked and why.

Module 5 states that a lot of the time three is the charm, in the context of a level being tested repeatedly before it gives way. The Alibaba and other walkthroughs each show three bounces followed by a break on the fourth touch.

Stated loosely in the video. Students will hear it as a rule and will ask the bot whether a third touch means a break is coming.

The answer differed substantially depending on the ruling. A taught heuristic would have a defined role in the decision. An observation about what those particular charts happened to show, presented as a rule, teaches students to anticipate breaks that have no basis. **Vlad ruled it the second.** The count sends you to look; the candle and volume gate is what decides whether there is anything to look at.

---

## 3. "Shift board"

**Status:** OPEN, transcription

Company name in the first four hour chart walkthrough in Module 5. Does not match a known ticker with confidence.

The Antero Midstream case is the precedent for why this cannot be guessed. The transcript rendered ticker AM as "Ontario Midstream Partners," a company that does not exist, and a bot would have cited it confidently.

**Question for Vlad:** which company is the first four hour chart walkthrough in Module 5?

---

## 4. "The bowels bowels"

**Status:** OPEN, transcription

Garbled passage in Module 5. Likely "bounce, bounce" or "the bulls." Needs Vlad or an audio check.

---

## 5. FinViz average volume threshold

**Status:** LIKELY RESOLVED, needs only a date

Two written worksheets, the Breakout Strategy and The Bounce Profit Plan, both specify the same threshold: "Over 1 Million" and "Over 1M". That is two independent written confirmations of the Module 2 video.

The Bounce Profit Plan also gives the reasoning the video did not: "We want to make sure we are dealing with legitimate stocks that won't be affected by minor news. In addition we want them to be liquid." That is the liquidity principle from Module 2 applied as a screening rule, which makes the threshold a consequence of a principle rather than an arbitrary number.

Still perishable in principle, since it is a tool setting. But it is now the best-evidenced setting in the corpus.

**Question for Vlad:** what is the date on these worksheets? If they are current, the bot can state 1 million and test S3 needs rewriting.

---

## 6. FinViz pricing tiers

**Status:** OPEN, perishable

Any pricing claim from the Module 2 walkthrough needs verification. The bot does not state third party tool pricing regardless, and the word "free" never appears in output, so this is lower priority for bot behaviour. It matters for whether the passage stays in the corpus at all. Test case P6 checks this.

---

## 7. Module inventory

**Status:** PARTIALLY RESOLVED, see `../corpus/sources.md`

**Settled:** v1 covers four products, not one. The numbered Trader Foundation modules, Stock Predator, Bounce Profit, and the Masterclass. Chunks are course scoped as a result, see `../corpus/schema.md`.

**Also settled:** the numbered course runs to at least 11 modules. Module 8 is Fibonacci Retracement, self-identified by its closing line "do the homework for this lesson and then move to module 9." That is the first transcript to carry its own number, and it is worth checking every transcript's closing lines for the same, since it is cheaper than asking.

**Still open:**

- How many numbered modules total, and which are CURRENT, SUPERSEDED, or RETIRED. Known so far: 2, 3, 5, 8, and at least 11 exist. Vlad is supplying modules separately.
- Whether Paycheck Collector and Ready Set Explode are in v1. Both are house IP and both appear in the protected vocabulary, but neither was named in the scope decision.
- Canonical version per product. Every product has duplicate files in Drive, including three Stock Predator PDFs and three Masterclass decks. Ingesting duplicates puts the same passage in the corpus several times.
- Recording date per file. Several carry none in the title and their Drive modified dates look unreliable.

Every chunk needs a recording date and a status before ingestion.

---

## 8. Compliance pass, scope and owner

**Status:** OPEN, blocks launch

A compliance pass across the full library, separate from transcription cleanup. Two of three sampled modules were clean. One was not. Assume more exist.

Older videos carrying outcome claims may warrant a re-record decision independent of this project.

**Question for Vlad:** who owns the compliance pass across the full library, and does a video carrying a claim get re-recorded or just excluded from ingestion?

---

## 14. Fibonacci: core method or optional supplement?

**Status:** OPEN, changes how the bot weights every Fibonacci answer

Module 8 closes with the instructor saying he does not always use the tool: "I don't a lot of times because I've been doing this for a while. I use moving averages. I use support and resistance. This is just another supplement you could use to see where the retracement would be if you don't have a good eye for where the support and resistance lines are."

Read one way, Fibonacci is a training wheel for students who cannot yet read levels by eye, and the bot should present it as optional scaffolding. Read the other way, it is a full part of the method that the instructor personally happens to use less.

A student asking "should I be using Fibonacci?" gets a materially different answer either way, and the module supports both readings.

**Question for Vlad:** is Fibonacci retracement part of the core method, or scaffolding for students who cannot yet spot support and resistance unaided?

---

## 15. "the ACC" ticker

**Status:** OPEN, transcription

First chart walkthrough in Module 8. ACC was American Campus Communities, taken private in 2022, so a current lookup returns nothing. It could equally be a mis-hearing of something else.

Antero Midstream is the precedent for not guessing: the transcript said "Ontario Midstream Partners," a company that does not exist, and a bot would have cited it confidently.

**Question for Vlad:** which stock is the first chart walkthrough in Module 8?

---

## 16. Moving averages module

**CLOSED, and it never needed Vlad.** The Moving Averages lesson has been in the
corpus since before this question was last read: 38 parts, 41 uses of the term,
and it is one of the three lessons recategorised from `tf-options` to `tf-core`
because it is technical analysis rather than options material.

**Status:** CLOSED by evidence. Same stale-question failure as item 13, found in
the same sweep.

---

## 21a. Stochastics: the recordings say fast a second time

**Not a new question. Evidence for the existing ruling**, recorded here so the ruling's basis is visible.

The thinkorswim setup module says:

> "I usually like to use the stochastics fast"

That is the **second recording** to say fast, after Momentum Indicators. Vlad has already ruled the house setting is **Full Stochastics at 14.3.3**, confirmed against the written worksheet.

**Why it is worth logging rather than just fixing.** The stochastics ruling rests on the principle that where typed house material and a recording disagree, the typed material is more likely to be current. A single recording saying "fast" is consistent with a slip. Two independent recordings saying it means the videos consistently teach the superseded setting, which is a re-record consideration rather than a transcription one.

**Bot behaviour is unchanged:** Full Stochastics 14.3.3, per the ruling. The clean file leaves "fast" intact because it is what was said, and the ruling overrides it at answer time.

## 21. Full stochastics or fast stochastics?

**Status:** RESOLVED. See `stochastics.md`.

**Vlad's ruling: Full Stochastics, parameters 14.3.3.** The worksheet wins, the Momentum video's "I usually go for fast stochastics" is superseded, and the bot does not repeat it.

Narrow in scope. Everything the module teaches *about* stochastics (the 80/20 bands, the lagging caveat, divergence, crossovers, complement-never-lead) holds regardless of variant, so the lesson stays intact. Only the setup instruction changes.

Second confirmed case of a recording being superseded, after the inverted hammer, and the second time typed or current material carried the correction.

---

## 22. RSI, and every other indicator

**Status:** RESOLVED, and generalised. See `indicator-hierarchy.md`.

The first answer was "out of scope, ignore it". Vlad replaced it with a better one that covers every indicator rather than just this one:

> There are a million indicators. The most important is always volume, candlestick and context, so trend, higher lows and higher highs. Then use indicators, RSI and stochastics, as supplementary.

That is now a confirmed ruling and the standing answer for any indicator question, including tools the curriculum will never cover.

**It also creates one gap worth tracking separately.** "Context" in the sense of trend structure is new: higher high, higher low, lower high, lower low and context appear **zero times** across every transcript and worksheet supplied. Volume and candlesticks each have a module. Trend structure does not. See question 23.

---

## 23. Trend, and where the bot cites it from

**Status:** CLOSED as a gap. Downgraded to a note.

Vlad clarified that "context" in the indicator hierarchy means the trend of the stock itself, read off the chart.

This was briefly logged as a curriculum gap on the grounds that "higher high" and "higher low" appear zero times in the supplied material. That was wrong. The phrasing is absent, the concept is taught throughout: Module 2 trades with the trend and screens for the name trending hardest, Module 3 teaches every candlestick pattern relative to the prevailing trend, Module 5 covers channels and structure, and Moving Averages gives the mechanical version, above the 50 and 200 is bullish, below both is bearish.

No module is missing. The bot cites whichever module fits the question rather than one canonical trend lesson.

**Method note worth keeping:** absence of a phrase is not absence of a concept. Word-boundary search is the right tool for asking whether a *term* appears, and the wrong basis for concluding something is untaught.

---

## 24. Divergence: bullish and bearish, or positive and negative?

**Status:** OPEN, vocabulary. Low stakes for meaning, real stakes for searchability.

Vlad describes the stochastics read as **bullish or bearish divergence**.

The Momentum Indicators module uses **positive and negative divergence**, five times, and never once says bullish or bearish divergence.

They map cleanly, so nothing is in conflict:

| Module term | Vlad's term | What happens |
|---|---|---|
| positive divergence | bullish divergence | stock down, stochastics up |
| negative divergence | bearish divergence | stock up, stochastics down |

**Why it is worth settling rather than shrugging at.** This is the Marubozu problem in a different form. A student who hears "bullish divergence" on a coaching call and searches the module transcript finds nothing, and concludes the curriculum does not cover it. Every module also uses bullish and bearish constantly for everything else, so positive and negative sit oddly against the rest of the vocabulary.

Both terms are now in the protected vocabulary so retrieval matches either. What is undecided is which one the bot should *say*.

**Question for Vlad:** should the bot say bullish and bearish divergence, matching how you describe it, and note the modules call it positive and negative? Or keep the module wording?

---

## 29. Is selling puts part of the method?

**Status:** OPEN, scoping

Explaining the risk zone, Vlad used a cash secured put as the worked case: strike 25, assigned below 25 at expiration unless closed first.

The modules supplied so far teach **buying** calls and puts. The seller's side is explained, but as a way of showing who takes the other side of the trade, not as a strategy for the student to run.

Cash secured puts are a different thing: deliberately selling puts, with the cash set aside to buy the shares if assigned.

So the question is scope rather than correctness. If students are taught to sell puts, there is a module or a plan for it that has not been supplied, and the bot will need it. If they are not, the seller's side stays purely explanatory and the bot should be careful never to present it as something to go and do.

**Question for Vlad:** are cash secured puts taught to students as a strategy, or was that an explanation of the mechanism from the other side?

---

## 28. Moneyness for puts: the definitions inverted in text

**Status:** OPEN, and the most consequential teaching issue found so far. Flagged, not corrected.

The scenarios module defines in, at and out of the money four times. The two call definitions are
correct and framed as **strike relative to stock price**:

> "If the stock is at a hundred dollars currently, anything over a hundred dollars is considered out
> of the money" (a call struck above the stock is OTM, correct)
>
> "we have a stock price at 200, anything under 200 is considered in the money because the contract
> lets you buy the stock for less and resell it at the current price" (correct)

The two put definitions use the **same sentence shape** but only work if read as **the stock moving**:

> "if the stock price is 50, anything under 50 is considered in the money because we are looking for
> the stock price to go down"
>
> "if you look at the stock price at 200, anything over 200 is considered out of the money"

Read as strike, which is how the two call sentences just trained the student to read them, both are
**backwards**. A put struck under 50 with the stock at 50 is out of the money, not in it.

**The module's own examples are correct.** Stock at 50 with an 80 put is in the money. Stock at 200
with a 170 put is out of the money. So the worked examples and the chart descriptions disagree with
each other, and only under the strike reading.

**Why this matters more than the other open items.** In, at and out of the money is foundational.
A student who inverts it for puts will pick strikes that cannot profit, and will not understand why.
It is also the kind of error that survives a confident read, because all four sentences are parallel
and sound equally authoritative.

**Most likely explanation, and it generalises.** There is a chart on screen during all four. The
visual almost certainly disambiguates, and the ambiguity is created by transcription rather than
present in the lesson. See the note on visual-dependent teaching in `../PROCESSING-LOG.md`.

**Question for Vlad:** in the put sections, are those lines describing where the strike sits or where
the stock moves? If it is the strike, the definitions need correcting. If it is the stock, the
passage needs rewording before ingestion, because in text it reads as the strike.

**UPDATE, and this is close to answering itself.** The thinkorswim walkthrough teaches put moneyness
again, this time with the option chain on screen, and it comes out **correct**:

> "remember put options you want the stock to go down so in this case the purple is in the money
> because the higher it is the better it is, so for you to buy, if it's lower it's out of the money"

Purple is thinkorswim's in-the-money shading, and it runs up the strike column. Higher strike equals
in the money for a put. That is the strike reading, stated correctly, in the module that had a live
chain to point at.

So the two modules agree on the mechanics and disagree only in what the text can carry. That is
strong support for the reading that **the lesson was always right and the scenarios transcript lost
the visual**, which is the whole point of the fifth error class.

It does not close the question. The scenarios module's four sentences still need a decision before
they go in the corpus, because the bot gets text and the text is inverted. But the fix is now much
more likely to be "reword before ingestion" than "the teaching is wrong."

---

## 34. Covered calls: referenced by the course, not taught by it

**Status: CLOSED. Answered by Vlad.**

> "nothing actually teaches covered calls"
>
> "it isnt taught unless we discuss it via lessons"
>
> "i doubt we discuss it"

**There is no missing transcript. Covered calls are simply not part of what Trader Foundation teaches.** They might come up in a live session, and Vlad doubts they do.

So the Vertical Spreads module contains a **dangling reference**: it tells students "we already did with covered calls, didn't we?" about something the course never did. A student who hears that will go looking through the modules for a lesson that is not there, and will conclude they missed something or that their access is incomplete.

### Bot behaviour

Covered calls are **not part of what Trader Foundation teaches**. Say that plainly. Do not explain the strategy from general knowledge, do not send a student looking for a module, and **do not imply a coach has a covered calls lesson waiting for them** either. Vlad doubts it comes up in live sessions, so promising one would be a second wrong steer on top of the first.

If they ask *because the spreads module told them they had already learned it*, answer that directly rather than leaving them puzzled. They have not missed anything and their access is not incomplete. That is a small thing that saves real confusion, and it is exactly the kind of question the bot exists to absorb at eleven at night.

Routing to a coach is still right for anything they want to do about it. Just route without a promise about what the coach will cover.

### Flagged for the video

One sentence, and it sends students hunting. Worth cutting or rewording on any pass over that module, independently of the compliance items.

### What it also tells us about the method

The recorded course teaches **buying** directional calls and puts, and **debit** vertical spreads. Every strategy that involves selling for income sits outside it. That is consistent with the house position stated three times over: the method does not own stock and does not exercise.

**Note, not a ruling:** the spreads module names four verticals, but only demonstrates the bull call and the bear put, which are both debit spreads. The bear call and bull put are credit spreads and are named only. So the same "named but not taught" pattern may apply to them. Left as an observation because Vlad has not been asked, and the bot should not teach them either way.

**This also bears on question 29**, which asks whether cash secured puts are taught or were an explaining device. Same shape, same likely answer, but it is not settled and should not be assumed.

---

## 34a. Original note, superseded

**Status:** was OPEN. A gap in the material, not a question about it.

The Vertical Spreads module refers back to covered calls as something already taught:

> "Can we increase the odds even more? **We already did with covered calls, didn't we?** You could go up, you could go down, you know, you could do different things with covered calls, but even they have drawbacks."

"We already did" and "didn't we" both assume the student has had the lesson. No covered calls transcript has been supplied, and nothing in the twelve sources processed so far teaches it.

**Why this matters beyond one missing file.** Covered calls are the first strategy in the options run where the student *sells* rather than buys, and they involve owning the underlying stock. That sits awkwardly next to the house position that the method never owns shares and never exercises, which is stated three separate times across the options modules. Either covered calls are an exception to that posture, or they are taught and then set aside. The bot cannot tell which from the material it has.

It also means the options run is at least seven modules, not six.

**Question for Vlad:** can you send the covered calls transcript, and is it taught as something students actually use or as background before spreads?

---

## 35. "We learned that in module two" points at the wrong module

**Status:** OPEN, and it may unlock the whole numbering problem.

The Vertical Spreads module says:

> "You don't want to wait for expiration. We never want to wait for expiration. **We learned that in module two.** There's no reason for that."

Module 2 in the numbering used so far is Fundamental Analysis and Stock Screening, which contains nothing about expiration. Not waiting for expiration is an options idea, and it is stated in the in/at/out of the money scenarios module, which is the **second options module** in the sequence supplied.

**So the most likely reading is that the options track has its own numbering**, and "module two" means the second options lesson rather than the second lesson of the course.

If that is right, it resolves a large part of open questions 10, 17, 20 and 25 at once. It would mean the course is not one run of numbered modules but several tracks each numbered from one, which is why so many of these recordings never state a number that fits the sequence.

It also explains why Momentum Indicators refers to "the past 10 modules" while the options material numbers nothing: different tracks, different counters.

**Question for Vlad:** is the options material numbered separately from the technical analysis modules, so that "module two" here means the second options lesson?

---

## 33. Is "max profit is infinite" an outcome claim?

**Status: CLOSED. Ruled by Vlad.** See `max-profit-and-risk.md`.

> "CALLS in this instance. profit is infinite HOWEVER there is risk management that needs to be accounted for more risky to want more"

The fact stays. It never travels alone. The original note follows for the record.

---

### Original note, superseded

**Status:** OPEN, held out of the corpus provisionally. **The one I would most like answered**, because the answer generalises to every module that walks through a broker screen.

The thinkorswim walkthrough reads the platform's own max profit field on a long call:

> "Now it says max profit. Max profit is infinite because it could go up as high as you want it to go up and you could sell it whenever."

It is true. A long call has no upper bound. thinkorswim really does display it. The instructor is reading the screen and explaining it accurately, and there is no figure, no percentage, and no person attached.

**And it is still the most extreme outcome statement the corpus could produce.** Asked "how much can I make with options?", retrieval lands here and the bot says max profit is infinite. Every prior exclusion was loose language sitting next to the teaching. This is accurate, it is a broker's own words, and it is worse than any of them.

The module supplies its own fix seconds later, on the put side: "there is a max profit because the stock could only go down to zero and that's it." Taught as the **asymmetry between calls and puts** it is the same fact, it is the actual lesson, and it cannot be served back as an answer about earnings.

**Provisional action:** the "infinite" sentence is held out. The asymmetry is retained and is what the bot teaches.

**Question for Vlad:** does a true, platform-generated statement count as an outcome claim once a bot can serve it on demand? Every broker walkthrough in the library will have numbers with this shape, so a ruling here is a rule for all of them rather than one sentence.

---

## 30. GTC: "good to close" or Good Till Cancelled?

**Status:** OPEN, flagged not corrected. Low ambiguity on the fact, real ambiguity on the remedy.

The thinkorswim walkthrough says:

> "you're going to change the GTC. GTC stands for good to close."

GTC is **Good Till Cancelled**. That is the standard expansion on every broker, and "good to close" is not a term in use anywhere.

**The mechanic taught is correct.** The very next sentence describes Good Till Cancelled exactly:

> "instead of the end of the day runs out, this is not going to expire. It's actually going to continue staying there until it gets to a dollar or until you cancel the order."

So the student learns the right behaviour under the wrong name. This is the third time a transcript has carried its own correction further down, after the Fibonacci levels and the calls mnemonic.

**Why it is not fixed in the clean pass.** It could be a mis-hearing or a live misspeak, and the two have different remedies. A mis-hearing is a glossary entry. A misspeak is a note on the video, and possibly a re-record line. Guessing picks the wrong one half the time.

**Why it matters more than a naming quibble.** The module tells students to go set this on their own platform, exactly as Options Factors told them to look up theta under the name "data". Under "good to close" a student searching their broker's help finds nothing, and GTC is the setting that keeps a sell order alive past the session, so getting it wrong means an exit order that quietly expires at the close.

**Question for Vlad:** is this a transcription error to fix in the glossary, or is it said that way in the recording?

---

## 31. Is "30 days minimum to expiration" a house rule?

**Status:** OPEN. Recorded in `terms.json` as pending, not as doctrine.

The walkthrough states a duration preference twice and demonstrates the reasoning:

> "I personally would say start the longer the better... let's check out a weekly option of 30 days minimum"

> "if I go, let's just say 16 days instead of 30, it's only worth 87 because you have so much less time and you're taking more risk"

and the counterweight, that going far out costs more: 200 days runs 3.30 for the same contract, against 1.20 at 30 days. The stated goal is "something fairly affordable for you, but you have enough days and it's closer into the money."

**This may resolve an apparent contradiction rather than create one.** Open question 19 records a holding period of "two to three days max, usually two." Buying 30-plus days and exiting in two is not a contradiction, it is buying time you do not intend to use, so that theta is not the thing deciding the trade. If that is the intent it is a genuinely useful piece of the method and worth teaching as a pair rather than as two separate numbers.

**Question for Vlad:** is 30 days a floor students should treat as a rule, and is the reason that it buys room against time decay rather than that the trade is meant to last that long?

---

## 32. On entry, how far into the money?

**Status:** OPEN, and the module gives two answers.

Stated as a rule:

> "I always recommend try to be as close to the money as possible because you have a better chance of it moving up faster and you're making money"

and again at the close: "the closer you are to the money the more money you're going to be making if it does go that way."

**But the contract actually selected is in the money**, at a 1.20 ask with the stock at 31.58, and the closing advice is "closer into the money," not at the money. A second demonstration then places an out of the money contract without comment.

Three different placements in one module. Not a contradiction in a live lesson where the chain is visible, ambiguous in text.

**Question for Vlad:** on a directional call, does the method buy in the money, at the money, or slightly out of the money, and does that change with the days to expiration?

**UPDATE, mostly answered by the Greeks module and by the chart ruling.** The Greeks module states the preference and, more usefully, gives the reason as a number:

> "have enough days, be closer to the money so you can start making, because what happens is if you start buying things like here, that's 15 cents. Well, yeah, but look, 0.04."

A 15 cent contract with a 0.04 delta barely responds when the stock moves. So "closer to the money" is not a taste, it is a statement about delta, and a student can check it on their own screen rather than taking it on faith.

And Vlad's chart ruling reframes what is left: *"every single decision always comes down to the chart."* So the remaining question is not "which strike" but whether there is a **default to start from** before the chart moves you off it. Narrowed accordingly, and no longer blocking, since the bot can now teach delta as the tool instead of a threshold.

---

## 27. Put seller risk zones

**Status:** RESOLVED. See `put-seller-risk.md`.

**Vlad's ruling: the risk zone is everything below the strike, and the stock cannot touch it.**

So there are two zones, not three. The 50 in the module's example is where the buyer guessed the
stock would go, not a threshold in the contract, and it has no standing once the trade is on.

The recording's middle band is superseded, and "2 out of 3 chances to win" goes with it. That line
was already excluded on compliance grounds; it turns out to be wrong on the merits too, being
arithmetic derived from a band that does not exist.

"It cannot touch" is tighter than break-even arithmetic would give. The seller does not want the
stock reaching the strike at all, rather than drifting below it and hoping the premium covers the
gap. That is the standard the bot teaches.

---

## 26. The two option strategies, and a tension between them

**Status:** OPEN, needs the advancement check and a clarification

Options Factors states two rules more directly than almost anything else in the curriculum:

> **Strategy number one.** "Always buy two months or longer when purchasing an option."
>
> **Strategy number two.** "If the option is approaching the last month or two, try to close it."

These are concrete and actionable, which makes them exactly the sort of thing a student will ask the bot to confirm, and exactly the sort of thing most likely to have moved since recording. Same class as the two to three day hold in Moving Averages, question 19.

**The tension.** Taken literally the two rules collide at the boundary. Buy exactly two months, and you are inside "the last month or two" on day one, so strategy two would have you close immediately.

Three readings, all plausible, and the bot's answer differs under each:

1. Buy longer than two months in practice, three or more, so there is room to close with a month or two left.
2. Strategy two means the last month, and "or two" is loose speech.
3. Two months is a hard floor and closing is judged against how the trade is going rather than the calendar.

**Question for Vlad:** if a student buys a two month option, when should they be closing it?

---

## 25. Options Intro: module number, and how many options modules there are

**Status:** OPEN, BLOCKING for citation

No number stated. Held as `options-intro-UNNUMBERED`.

What is known: it comes after Moving Averages, which forward-references it ("we're going to get into options"), and it is followed by at least one more options module, since it closes by promising "the factors of what controls the premiums coming up in the next module".

So options is a run of at least two lessons sitting after the technical analysis block.

**Question for Vlad:** which module number is Options Intro, and how many options modules follow it?

**Update:** five options modules are now in, and the run still continues. The fifth is the thinkorswim walkthrough the scenarios module promised, and it closes by pointing at the Greeks, so there are at least six. The Greeks module is the one that will settle the theta naming problem from open question 30's sibling, since Options Factors already taught time decay under the wrong name.

**Earlier update:** four options modules were in. The fourth covers in, at and out of the money across the three price scenarios, and closes by pointing at a live thinkorswim walkthrough, so there are at least five. Original note follows. Three options modules were in at the time of writing: Options Intro, then Options Factors on the six premium factors, then Calls and Puts, which is the one Options Factors promised by pointing at "investing going up, investing going down". Calls and Puts closes by pointing at "the next modules" on how calls and puts play in reality, so the options run is at least four lessons. Original note follows: Options Factors closes by pointing at a third: "the next part where we really start looking at how do you invest with an option", covering investing up, investing down, and the key aspects. So the options run is at least three lessons.

---

## 20. Momentum Indicators: module number, and the numbering of the whole run

**Status:** OPEN, BLOCKING for citation, but close to resolved

Momentum Indicators refers three times to "the past 10 modules," which places it at **Module 11**. Held as `momentum-indicators-UNNUMBERED` until confirmed.

Putting the cross-references together gives a consistent picture for all three unassigned modules:

| Module | Evidence |
|---|---|
| 8 | Fibonacci, self-identified by "then move to module 9" |
| 9 | Moving Averages? It closes by pointing at the bounce formula "next" |
| 10 | The bounce formula? |
| 11 | Momentum Indicators, from "the past 10 modules" |

That fits every cross-reference seen so far, but only Module 8 is stated outright. The rest is inference and should not be encoded.

If this is right, Volume sits somewhere at 6 or below, since it assumes candles, structure, falling wedges and double tops are already taught.

**Question for Vlad:** are Moving Averages, the bounce formula, and Momentum Indicators modules 9, 10 and 11?

---

## 17. Moving Averages: module number, and where the bounce formula sits

**Status:** OPEN, BLOCKING for citation

No module number stated. Held as `moving-averages-UNNUMBERED`.

The module closes with "we're going to use this to create our bounce formula next," and refers throughout to "the bounce profit formula." **Bounce Profit is one of the four v1 products.** So either the numbered course teaches the bounce formula as a lesson, or this module is the on-ramp into a separate product, and the two are being cross-sold inside the curriculum.

This matters for the course-scoped chunk schema. If the bounce formula is both a `tf-core` module and a `bounce-profit` product, the same teaching exists in two places under different citations, and retrieval will surface whichever it happens to match.

**Partially resolved.** The Bounce Profit Plan worksheet has been supplied. It is a written checklist branded "TRADER FOUNDATION", not a video lesson, and it is plainly the "bounce formula" Moving Averages points at. So the bounce formula exists at least as a deliverable document.

That does not settle whether a numbered *module* also teaches it, which matters for the numbering run in question 20 and for whether the same teaching gets cited two ways.

**Question for Vlad:** which module number is Moving Averages, and is there a numbered module teaching the bounce formula, or is the written plan the whole of it?

---

## 18. Scaling: is "collect 50 percent" taught doctrine?

**Status:** OPEN

The module recommends scaling out: "Maybe you should collect 50 percent of your profit right here." The surrounding dollar example is excluded on compliance grounds, but the scaling rule itself is method, not an outcome claim, and survives the exclusion.

The hedged phrasing ("maybe you should") leaves it unclear whether 50 percent is a taught rule or an illustration. The bot should not state a specific scaling percentage as house teaching unless it is one.

**Question for Vlad:** is scaling out 50 percent at a target a taught rule, or was that an illustration?

---

## 36. Twenty percent, and how it sits with the fifty percent scaling rule

**Status:** OPEN. Two different exit numbers now, from two different modules.

The Vertical Spreads module gives a profit target, twice, and the second time as personal practice:

> "once it gets even to 414, if it's a good enough profit for you, even if it's 20%, you could get out of it and play another one. That way you collect profits or you could scale and take some profits in."

> "For me, if I could get to 20%. I'm good. I'll probably be out. And it depends against how much money you're investing. So always collect profits if you can."

Open question 18 records "collect 50 percent" from an earlier module. This says 20.

**They may not conflict.** The 20 percent is stated about a *spread*, where the profit is capped and the last part of it arrives slowly, so leaving early costs less than it would on a directional trade. The 50 percent may be about directional positions where the upside is not capped. If so, the exit target is a function of the strategy rather than a single house number, which would be worth teaching explicitly.

**And the chart ruling applies.** Neither is likely to be a threshold. "It depends against how much money you're investing" and "if it's a good enough profit for you" are both in the same breath as the 20, so the number is a reference point rather than a rule.

**Question for Vlad:** is 20 percent for spreads and 50 percent for directional trades, or is one of them the current number and the other superseded?

**UPDATE, and it undercuts my own guess.** I reasoned that 20 percent was the spread number because a spread's profit is capped and the last part arrives slowly. A coaching call then gives **50 percent for a spread**, in the same breath as the same reasoning:

> "the goal is, listen, if you could make 50 percent of that, we'll get out of it and do another one. You don't need to reach the max. You're here to profit."

So both numbers now attach to spreads, and my strategy-based explanation does not hold. Recording this because the tidy theory was mine, not the curriculum's, and it would have been encoded as fact.

The more likely reading, and it fits the chart ruling: **neither is a threshold.** Both sit beside "if it's a good enough profit for you," "it depends against how much money you're investing," and "you're here to profit." The teaching is take profit rather than chase the maximum, and the percentage is an illustration of that.

**Revised question for Vlad:** is there a house exit number at all, or is the rule simply to take a good profit rather than wait for the cap?

---

## 41. Is "10 percent a month" current marketing language?

**Status:** OPEN. **The most consequential compliance item in the project, and the only one that is not fixable inside the corpus.**

A coach, mid-session, to a live group:

> "that's how you're gonna outperform **the 10% a month that marketing has told you**"

He is not making the claim. He is referring to it as a number **students have already been given**, and coaching them to beat it.

**It corroborates the Paycheck Collector class**, whose scripted intro states a target of about 10 percent of the account per week or month, calls the strategy safe, and runs a compounding projection. That was already flagged as a re-record line.

**So the figure exists on at least three surfaces:** marketing, a paid class, and coaching conversation where it is treated as a baseline.

Excluding it from the corpus protects the bot. It does nothing about a rate-of-return figure circulating through the product, which is a business question rather than a curriculum one.

**Question for Vlad:** is 10 percent a month current marketing language, and who owns changing it?

---

## 39. "One of our elite members": is that a current term or a retired one?

**Status:** OPEN, flagged rather than edited. **Needs an answer before anything ships.**

The Paycheck Collector class opens:

> "today we're going to talk to [STUDENT], **one of our elite members**"

Non-negotiable 8 retires **Elite Four** and **Elite 12** and says they must never surface. "Elite members" is neither of those. It could be a perfectly current description of a membership tier, or it could be what is left of the retired naming after the numbers were dropped.

**I have not edited it, because guessing wrong is bad in both directions.** Strip a live product name and the bot cannot talk about a tier students are in. Keep a retired one and it surfaces exactly what the rule exists to prevent.

**Question for Vlad:** is "elite member" current language, or does it need retiring along with Elite Four and Elite 12?

---

## 40. Bollinger Bands are used and never taught

**Status:** OPEN. Same shape as legging out, and more load-bearing.

Bollinger Bands appear twice in the Paycheck Collector class, doing real work:

> "I'm going to go into a Bollinger bands and I'm going to look at seven months... I want to see the long term situation"

and as the actual rule for the weekly variant:

> "you take the Bollinger band and if it should be expiring, you should buy something one outside the Bollinger band"

They also appear as a go or no-go filter: when the bands are wide, the premium at a safe distance is not worth taking, so the trade is skipped.

**No recorded module teaches them.** They are not in Momentum Indicators, which teaches stochastics and MACD, and the Momentum module explicitly tells students to add those two and "not anything else."

**So there is a straight conflict**, and it is not a transcription problem. A recorded module says use these two indicators and nothing else. The coaching material uses a third and treats it as a criterion.

The likely explanation is that Bollinger Bands belong to the options strategies rather than to the technical analysis chain, which would make it an addition rather than a contradiction. That is a guess and it should not be encoded.

**Bot behaviour meanwhile:** the bot can describe how the bands are used in the Paycheck Collector, since that is now in scope, but it does not present them as part of the indicator set from Momentum Indicators, and it does not teach the indicator itself from general knowledge.

**Question for Vlad:** are Bollinger Bands part of what you teach, and does "add stochastics and MACD and not anything else" still hold for the technical analysis chain?

**UPDATE, and it mostly dissolves the conflict.** The thinkorswim setup module **teaches how to add and configure Bollinger Bands**, so they are not coaching-only after all:

> "when we're doing more spreads and stuff like that, one of the things I like to look at is Bollinger Bands as well"

and it goes on to set the band widths so the outer bands read clearly while the midline is de-emphasised.

**The likely resolution: no contradiction exists.** Momentum Indicators says add stochastics and MACD and "not anything else", and that instruction is about the **momentum panel**. Bollinger Bands are a price overlay, not a momentum oscillator, so they were never in the set that sentence was ruling on. The setup module reinforces this by adding the bands in a separate step, after the momentum studies, and by tying them to spreads rather than to the technical analysis chain.

**Recorded as a hypothesis, not encoded.** It fits every instance seen, but it is my reading rather than Vlad's statement, and the whole point of this file is not to encode readings.

**Narrowed question for Vlad:** are Bollinger Bands part of the options and spreads work rather than the technical analysis chain, which would mean "not anything else" was only ever about momentum indicators?

---

## 37. The credit spreads module, and how it will be framed

**Status:** OPEN, pre-emptive. Flagged before the module arrives, not after.

Two forward references now point at a credit spreads lesson that has not been supplied.

The Vertical Spreads module names the bear call and bull put as two of the four verticals and never demonstrates them. Both are credit spreads. A coaching call then closes by pointing straight at the lesson:

> "the real strategy comes from when you're starting to collect premiums and that's what we're going to do next is go over the vertical credit spread"

And frames it as:

> "the credit spreads where you're actually collecting. **Guaranteed premiums**"

**That framing is the concern.** "Guaranteed" is the most prohibited word in this vocabulary and it is the first appearance of the plain word across fourteen sources. It is also wrong on the mechanics: the premium arrives at the open, it is not kept regardless, and the position can lose more than the credit taken in. That distinction is the whole risk of the strategy.

In a live conversation it plainly means "collected up front rather than hoped for," which is true and is the real contrast with a debit spread. Written down, or repeated by a bot, it becomes a promise.

**Why flag it now.** The framing a coach uses when introducing a lesson is usually the framing the lesson opens with. If the recorded module carries the same word, that is a re-record line rather than an exclusion, because it sits at the top of the lesson rather than inside an example.

**Question for Vlad:** when the credit spreads module comes through, is the collected premium described as guaranteed anywhere in it, and is that a word you want changed at the source?

---

## 38. Legging out, taught in a call and nowhere in the course

**Status:** OPEN, and it is the same shape as covered calls but with the opposite likely answer.

A coaching call teaches a technique with a name, in response to a student's question:

> "can you sell that one and then hold on to the call? So, yes, absolutely... **It's called legging out.**"

Buying back the short leg to convert a spread into a plain long call, when the move is stronger than expected. The call covers when to do it, and the risk plainly: the premium is gone and the protection with it, so a reversal now costs the full position.

**No recorded module teaches this.** It is not in the Vertical Spreads module, which is where it belongs.

This differs from covered calls in a way that matters. Covered calls were referenced as taught and are not taught, and Vlad's answer was that they are not part of the method. Legging out is **not referenced by any module at all**, so no student is sent looking for it, and it is plainly something the method does, since it came up as a live answer to a live question.

So the question is not "is this taught" but "should it be."

**Bot behaviour meanwhile:** legging out is not in the course material, so the bot does not teach it. If a student raises it, name that it is not covered in the modules and route to a coach, with no promise about what the coach covers. Same shape as covered calls.

**Question for Vlad:** is legging out part of what you teach, and should it be in the spreads module?

---

## 19. Holding period: "two to three days max, usually two"

**Status:** OPEN, needs the advancement check

Stated twice and firmly: "you do this in this strategy two to three days max maybe four but that's really stretching it," and "My recommendation is always get out two to three days max, usually two."

This is the most concrete, most actionable rule found in any module so far, and it is exactly the kind of thing a student will ask the bot to confirm. It is also the kind of rule most likely to have moved since recording, which is what the advancement check exists to catch.

**Question for Vlad:** is the two to three day maximum hold still current teaching for this strategy?

---

## 10. Volume module: number and course

**Status:** OPEN, BLOCKING. Nothing from this module can be cited until it is answered.

The Volume transcript arrived with no module number and no course. Every chunk requires `course`, `module`, and `timestamp`, and citations are the product. Held in `../transcripts/` as `volume-UNNUMBERED` until assigned.

Content places it near Modules 3 and 5. It assumes candlesticks, support and resistance, and breakouts are already taught, and it closes by telling students to layer volume on top of them.

**Question for Vlad:** which course and which module number is the Volume lesson?

---

## 11. Transcripts arriving without timestamps

**Status:** OPEN, BLOCKING for indexing

The Volume transcript is text only, with no timestamps. `../corpus/schema.md` requires `timestamp` on every chunk and does not index without one, because a chunk that cannot be cited can only produce an uncitable answer.

This is not specific to one module. Any transcript pasted or exported as plain text has the same gap, so it needs solving once rather than per module.

Options: re-export with timestamps from the transcription tool, or run a pass against the source video to recover them. The second is expensive across a six year library.

**Question for Vlad:** can transcripts be re-exported with timestamps, or do we need a different citation granularity such as section headings?

---

## 12. Hammer, possible advancement past the recording

**CLOSED. Ruled by Vlad.** See `rulings/hammer-strength.md`. Not a
confirmation condition and not a gate: a strength ladder on top of a rule that
was already right. A bare hammer is still a bullish hammer. Hammer with
validated volume closing green is stronger. **Strongest is a hammer at support
whose wick sweeps below the level and whose body holds**, which is the same
candle the break rule already describes from the other side.

**Status:** CLOSED. Kept here as the record of what was asked and why.

In the Volume module, on a hammer candle: "The candle's okay, it's a hammer candle. Not something I would trade, and I'll show you why. We learned support resistance. We want to see it break this resistance." Entry then waits for the resistance break.

Module 3 teaches the hammer as bullish, colour irrelevant, meaningful at the bottom of a downtrend, with no confirmation condition attached.

These are not necessarily in conflict. The Volume module may be applying confirmation before entry rather than redefining the pattern. But this is the same shape as the inverted hammer case: a recording teaching a flat rule while current teaching carries a condition the recording never states.

The question asked was whether the hammer carries a confirmation condition the way the inverted hammer does, or whether the Volume passage was just confirmation before entry applied to a hammer. **Neither.** The inverted hammer inverts without confirmation; the hammer does not. The Volume passage was Vlad looking at the weakest rung of the ladder and wanting more before acting.

---

## 13. Prerequisite modules not yet sampled

**CLOSED, and it never needed Vlad.** Module 5 teaches all of them, in a named
section of its own:

> "we're going to talk about four different reversal patterns the double top
> double bottom rising wedge and falling wedge now all of these Come from
> support resistance trend lines and swing points They're just a different
> version of it. That's actually building off the previous pieces that we
> learned"

Ten mentions of double top, nine of double bottom, seven of wedge. It is a
definitional section, not a passing reference, and it also supplies the
relationship: these four are derived from support, resistance, trendlines and
swing points rather than being separate concepts. That is exactly why the Volume
module can assume them.

**Status:** CLOSED by evidence.

### Why this sat open after it was answered

The question was written when **only the first half of Module 5 had been
ingested.** The trendlines, swing points and confluence half arrived later and
was merged into the same source, and the reversal patterns came with it. Nobody
re-read the open question against the grown source.

**An open question written against a partial source does not re-validate itself
when the source grows.** Same shape as the log entry that said "excluded" on a
module whose text was not in the repo: a status recorded once and then trusted.

The cost here was real. It was reported to Vlad twice as material he still owed,
which is the opposite of the working rule that this file exists to serve.

---

## 9. Coach review dashboard

**Status:** OPEN, architectural, raise before building

Student conversations must be logged and visible to coaches. This is what makes the bot an intake layer that strengthens the coaching relationship rather than a parallel channel that quietly erodes it.

If the architecture cannot support coach visibility, that needs raising before any build starts, not after.

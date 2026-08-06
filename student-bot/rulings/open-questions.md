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

**Status:** OPEN, affects test case R6

Module 5 states that a lot of the time three is the charm, in the context of a level being tested repeatedly before it gives way. The Alibaba and other walkthroughs each show three bounces followed by a break on the fourth touch.

Stated loosely in the video. Students will hear it as a rule and will ask the bot whether a third touch means a break is coming.

The bot's answer differs substantially depending on the ruling. If it is a taught heuristic it has a defined role in the decision. If it is an observation about what those particular charts happened to show, presenting it as a rule teaches students to anticipate breaks that have no basis.

**Question for Vlad:** is "three is the charm" a taught heuristic with a role in the decision, or an observation about those specific charts?

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

**Status:** OPEN, scoping

Module 8 names moving averages as something the instructor uses in preference to Fibonacci, but no module seen so far teaches them. Same situation as falling wedges and double tops in item 13.

**Question for Vlad:** which module covers moving averages?

---

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

**Update:** four options modules are now in, and the run continues. The fourth covers in, at and out of the money across the three price scenarios, and closes by pointing at a live thinkorswim walkthrough, so there are at least five. Original note follows. Three options modules were in at the time of writing: Options Intro, then Options Factors on the six premium factors, then Calls and Puts, which is the one Options Factors promised by pointing at "investing going up, investing going down". Calls and Puts closes by pointing at "the next modules" on how calls and puts play in reality, so the options run is at least four lessons. Original note follows: Options Factors closes by pointing at a third: "the next part where we really start looking at how do you invest with an option", covering investing up, investing down, and the key aspects. So the options run is at least three lessons.

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

**Status:** OPEN, needs the advancement check

In the Volume module, on a hammer candle: "The candle's okay, it's a hammer candle. Not something I would trade, and I'll show you why. We learned support resistance. We want to see it break this resistance." Entry then waits for the resistance break.

Module 3 teaches the hammer as bullish, colour irrelevant, meaningful at the bottom of a downtrend, with no confirmation condition attached.

These are not necessarily in conflict. The Volume module may be applying confirmation before entry rather than redefining the pattern. But this is the same shape as the inverted hammer case: a recording teaching a flat rule while current teaching carries a condition the recording never states.

**Question for Vlad:** does the hammer carry a confirmation condition in current teaching, the way the inverted hammer does, or is the Volume passage just confirmation before entry applied to a hammer?

---

## 13. Prerequisite modules not yet sampled

**Status:** OPEN, scoping

The Volume module refers back to material taught elsewhere and not present in the four transcripts seen so far: falling wedges, double tops, and double bottoms.

The bot must not answer on these from general knowledge. Until those modules are ingested, questions about them fall to the no-relevant-retrieval path and route to a coach, which is correct but unhelpful if the material exists and simply has not been supplied.

**Question for Vlad:** which module covers falling wedges and double top / double bottom?

---

## 9. Coach review dashboard

**Status:** OPEN, architectural, raise before building

Student conversations must be logged and visible to coaches. This is what makes the bot an intake layer that strengthens the coaching relationship rather than a parallel channel that quietly erodes it.

If the architecture cannot support coach visibility, that needs raising before any build starts, not after.

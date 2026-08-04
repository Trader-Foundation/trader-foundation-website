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

## 22. RSI: probable third advancement case

**Status:** OPEN. Vlad indicates Momentum Indicators. The supplied transcript does not contain it, and appears to actively exclude it.

**What the transcript shows.** Word-boundary counts across the whole lesson: stochastic 30, MACD 18, histogram 13, **RSI 0**, "relative strength" 0.

Note that a naive substring search for "rsi" returns four hits, all of them inside the word "reversing". Word-boundary matching is required here.

**The setup walkthrough does not merely omit RSI, it excludes it:**

> "we're going to select stochastics first... I'll select the fast stochastics and then I'm going to go down here and select MACD. **You don't want to select MACD histogram or anything else.** You want to make sure it's MACD."

Two indicators, with an explicit instruction not to add more. The Bounce Profit Plan's table lists three: RSI 14 above, MACD 12.26.9 below, Full Stochastics 14.3.3 below.

**The transcript is not truncated.** It opens "Welcome to Momentum Indicators" and closes "See you at the next lesson guys".

**Most likely reading, and it fits a pattern.** This is the same shape as the two confirmed rulings. In both, a recording stated something confidently, gave a reason, showed no sign of being superseded, and current material carried the correction. The stochastics ruling in this very module is one of them: the video says fast, the house setting is Full.

If RSI was added to the method after this lesson was recorded, everything observed fits: the worksheet has it, the video predates it and tells students to add only what the method used at the time.

That would make RSI a third advancement case rather than a missing module, and it would mean the Momentum recording is now superseded on two separate points.

**Question for Vlad:** was RSI added to the method after the Momentum Indicators video was recorded? If so it needs a ruling like the stochastics one, covering what RSI is for and how it fits the chain, since no supplied material teaches it.

**Alternative worth ruling out first:** a newer cut of the module exists that includes RSI, and the transcript supplied is from the older recording.

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

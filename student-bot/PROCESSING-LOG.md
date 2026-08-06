# Processing log

Running record of every module put through the pipeline. **Append to this on every module. Never rewrite history in it.**

This log is the index that ties the work together, so a session starting cold can read one file and know exactly where things stand. The working container is ephemeral and transcripts cannot be committed to this public repo, so findings live here and raw transcripts live in Drive. See "Transcript store" below.

---

## Standing intake procedure

Every transcript supplied gets every step, in order, no exceptions.

**0a. Check for a duplicate first.** Word count plus a handful of signature findings against the ledger below. Module 8 was supplied twice, and re-running it would have produced a second set of identical entries. Cheap check, real saving.

**0b. Check the transcript is complete.** Read the first and last lines. A lesson that opens with a welcome and closes with a sign-off is whole. This matters when something expected turns out to be missing: knowing the transcript is complete tells you the content lives in a different module rather than in a truncated section of this one. It resolved the RSI question in one look.

**1. Glossary pass.** Run `glossary/terms.json`. Four distinct error classes now, in descending order of danger:

- **Numeric.** The tool mis-hears the values being taught. Highest risk, because a wrong number looks authoritative and a student cannot tell. Always audit taught numbers against the canonical values in `terms.json`, and against values the same transcript establishes earlier.
- **Proper noun.** Tickers, company names, pattern names. Dangerous because the bot would cite a fictional company confidently.
- **Terms of art replaced by common words.** A domain term rendered as ordinary English, which nothing flags as wrong. Theta transcribed as "data" is the model case. These are found by knowing the field, not by spotting something broken.
- **Generic noise.** Stray inserted words, mis-heard contractions, decimal splitting. Cosmetic, but decimal splitting defeats numeric auditing, so normalise before checking numbers.

Fix only what is unambiguous. Anything that needs a guess goes to `unresolved`, not into the clean file.

**2. Compliance scan.** Dollar figures, percentage returns, earnings claims, outcome and guarantee language, retired labels, prohibited copy. Excluded content is removed from the corpus, not tagged. Log every hit to `rulings/compliance-log.md` including boundary calls, and flag the video separately.

**3. Tag into three layers.** `EVERGREEN`, `DATED_EXAMPLE`, `PERISHABLE_PROCEDURE`.

**4. Advancement check.** Anything where current teaching may have moved past the recording goes to `rulings/`.

**5. Chunk and index.** Blocked. See "What is blocking indexing" below.

**6. Store the raw transcript in Drive.** See "Transcript store" below. Never ask for a transcript twice.

Then: append a row to the ledger, add new questions to `rulings/open-questions.md` phrased as direct questions, and commit metadata only.

---

## Module ledger

| Module | Number | Compliance | Numeric errors | Unresolved | Indexed |
|---|---|---|---|---|---|
| Fundamental Analysis and Stock Screening | 2 | Clean | none found | 0 | No |
| Technical Analysis and Candlestick Charts | 3 | Clean | none found | 0 | No |
| Support and Resistance | 5 | 1 hit, excluded | none found | 2 | No |
| Volume | **unassigned** | Clean, 2 borderline | none found | 1 | No |
| Fibonacci Retracement | 8 | 1 boundary call | 2 | 1 | No |
| Moving Averages | **unassigned** | **6 hits, re-record candidate** | 1 fixed, 1 unresolved | 1 | No |
| Momentum Indicators | **unassigned, likely 11** | Clean | 2 fixed, 1 unresolved | 1 | No |
| Breakout Strategy *(worksheet)* | n/a, document | Clean | none, written source | 0 | No |
| The Bounce Profit Plan *(worksheet)* | n/a, document | Clean | none, written source | 0 | No |
| Options Intro | **unassigned** | **4 excluded, arithmetic pending ruling** | none, formatting only | 0 | No |
| Options Factors | **unassigned** | Clean | 1 term error (theta) | 1 | No |
| Options Calls and Puts | **unassigned** | **2 excluded, incl. a win-rate promise** | 1 term error (calls) | 1 | No |
| Options: in/at/out of the money | **unassigned** | Clean, 1 borderline | none, see question 28 | 1 | No |

Modules 2, 3 and 5 were characterised in the spec before this log existed. Everything from Volume onward was processed here.

Known: the numbered course runs to at least 11. Module 8 closes by pointing at Module 9, and Momentum Indicators refers three times to "the past 10 modules", which places it at 11.

Working hypothesis for the unassigned two, not confirmed: Moving Averages closes by pointing at the bounce formula "next", so Moving Averages 9 and the bounce formula 10 would put Momentum at 11 and fit every cross-reference seen. Needs Vlad.

---

## Cumulative findings

### Written worksheets are a second material class, and they behave differently

Two worksheets arrived alongside the transcripts: the Breakout Strategy and The Bounce Profit Plan. They are typed, not transcribed, and that changes three things.

**They carry no mis-hearing errors.** Every numeric problem found so far came from speech-to-text. A worksheet has none, which makes it authoritative for numbers and settings. Recorded in `terms.json` under `indicator_parameters` and `screening_filters`, with the standing rule: where a worksheet and a transcript disagree on a *value*, the worksheet wins. Where they disagree on *teaching*, that is a ruling for Vlad, not a correction.

This immediately resolved the MACD parameters. The transcript said 12/25 in one place and 13/28 in another; the worksheet says 12.26.9, the standard default, so the "25" was 26 mis-heard and the "13 and 28" was the instructor reading a blurry on-screen label aloud.

**They can be cited without timestamps.** This matters more than it looks. The single biggest blocker on indexing is that no transcript carries timestamps, and the chunk schema will not index without one. A worksheet has named sections instead, so `The Bounce Profit Plan, "Screen The Stocks"` is a complete and checkable citation. **Written material is not blocked on the timestamp problem and could be indexed first.**

**They are mostly click paths.** Both worksheets are dense `PERISHABLE_PROCEDURE`. The bot does not recite them, it names the document and hands it over, exactly as it does with a video.

### The method chain is confirmed, not inferred

The chain was assembled by reading four transcripts and noticing that no single module contained it. The Bounce Profit Plan contains it, written down, as the house checklist.

Its "Technical Analysis - Using What We learned" section runs: candlestick entry pattern, long term pattern, consolidation, support and resistance, moving averages, volume, stochastics, MACD. Its fundamental section runs: avoid economic events, check market direction via SPY, find the sector trending with the market. That is macro to micro, and it is the same chain.

Two refinements worth taking from the worksheet rather than the videos:

- **Its own ordering** puts the candle before structure, where the inferred chain had structure first. Minor, but the worksheet is the house artifact so its order should win.
- **The sector step is operationalised.** The worksheet gives a sector ETF table (XLF, XLY, XLE, XME, XLK, XLV, XLB, XLI, XLU, plus SPY and VIX), which turns "which sector is leading" from a concept into something a student can actually check. Added to `terms.json`.

The worksheet also states the posture the bot is built around: "This is where you want to take all the tools we used and start making your own decision on the stock based on what you see." That is the guided-reasoning behaviour, in the curriculum's own words.

### Compliance rate is worsening, not improving

Three of six modules clean. The spec assumed occasional hits found by a routine pass. On six modules that does not hold, and Moving Averages carries six hits including a stated percentage return and dollar figures attached to performance.

Two consequences. Scope for the library-wide pass is larger than assumed, and at least some modules need re-recording rather than editing, because excluding a passage fixes the bot without touching the video a student watches.

### Confirmation before entry: five independent instances

Modules 3, 5, Volume, Fibonacci, and Momentum Indicators each arrive at it separately. The crispest statement of it is in Momentum: a crossover is "a good signal, but it's not an entry signal." This is the best-evidenced principle in the curriculum and the bot's structural safety mechanism.

### Chart walkthroughs carry position-advice language by default

Every walkthrough module narrates entry and exit against a real chart. Fine in a video, reads as instruction when retrieved as a chunk. `prompts/system.md` carries a rule for this. Expect it in every walkthrough module rather than treating it as a per-module finding.

### The curriculum contains one decision procedure, taught one piece per module

The most useful thing to come out of processing four modules, and something not visible from any single one of them.

Assembled macro to micro: market, sector, stock, news to avoid, liquidity, the 50 and 200 day background check, structure, candle, volume, momentum, confirmation.

Module 2 supplies the top (galaxy, solar system, planet, news, liquidity). Module 3 supplies candles and the judge-and-evidence framing that governs how the steps combine. Module 5 supplies structure. Volume supplies the volume check. Moving Averages supplies the background check and demonstrates the whole chain at once on the Amazon walkthrough. Momentum Indicators adds a momentum step before confirmation, states outright that it must never lead, and closes by sending students back to FinViz screening from Module 2, which closes the loop.

This is now in `prompts/system.md` as the bot's primary behaviour. When a student asks something the bot cannot answer, it hands over the chain as questions they can answer on their own chart, rather than closing the door. Two guards: the bot never closes the chain with a verdict, and never asks for their answers in order to assess.

Worth checking every further module for whether it adds a step, refines one, or reorders them.

### Word-boundary matching, always

A substring search for "rsi" returns four hits in the Momentum Indicators transcript. All four are inside the word "reversing". Word-boundary matching returns none.

That nearly produced a wrong answer to a direct question from Vlad. Any claim about whether a term appears in the curriculum has to be made with `\b` boundaries, and any surprising hit gets read in context before it is reported.

The same trap applies in reverse to the glossary: a bare find-and-replace of a short string will corrupt longer words containing it. Both corrections that touched short phrases were deliberately scoped to full phrases for this reason.

### Check taught rules against the mechanics, not just the transcript

Two findings now have come from working a stated rule against what the instrument actually does,
rather than from any transcription check.

**The put seller zones.** The module called a middle band safe. Nothing was mis-heard, the sentence
was exactly what was said, and it was internally coherent. It only came apart when the arithmetic
was worked against the contract instead of against the example's narrative. Vlad has since ruled
the risk zone is everything below the strike.

**The moneyness definitions.** Four parallel sentences, two correct and two only correct under a
different reading. Found by comparing the stated rule against the module's own worked examples.

Neither would have surfaced from a glossary pass, a compliance scan, or a currency check. Both
needed someone to ask whether the rule as stated is true of the thing it describes.

Worth running on any module that teaches a mechanism rather than a concept, which so far means all
the options material.

### Recordings are not self-correcting, twice confirmed

Three rulings now.

**Inverted hammer:** the Module 3 recording teaches a flat rule; current teaching adds a confirmation condition that was never recorded.

**Stochastics:** the Momentum recording says the instructor prefers fast stochastics; the house setting is Full Stochastics at 14.3.3, and the written worksheet carried the correction.

Neither recording contains any signal that it has been overtaken. Both state their position confidently and give a reason. Read alone, each looks settled.

The pattern worth generalising: **where typed house material and a recording disagree, the typed material is more likely to be current.** That is already the standing rule for values in `glossary/terms.json`. Vlad has now applied it the same way to teaching, which is the stronger case.

The advancement check needs running against every module, not only where something looks odd, because in both cases nothing looked odd.

A third candidate turned out to be simpler. RSI appears in The Bounce Profit Plan's setup table but in no transcript, and the Momentum recording tells students to add stochastics and MACD and "not anything else". That looked like a third advancement case. Vlad ruled RSI out of scope entirely, so the worksheet carries a line the method no longer uses rather than the video being behind. Worth noting as a distinct failure mode: **written material can be stale too.** The rule that worksheets win on values still holds, but "typed" does not mean "current".

### Trading is not black and white, and the curriculum says so itself

Flagged by Vlad, and well supported by the material. Every module hedges its own rules:

- Fibonacci: "stocks don't always reach to these levels... it's simply an indicator"
- Momentum: "just because it's above 80 does not mean the run is over"
- The written plan: "this rule may have to be stretched if the market had a very big downturn"
- The written plan again: "the more experienced you get, the more flexibility you will have with this. But at this time, start using them all"
- Module 3: no almanac, technical analysis "tilts probability toward you, nothing more"

The risk this creates for the bot is specific. Encoding a method chain, canonical values, and a rulings layer makes the material look more deterministic than it is. A checklist reads as a formula, and a bot is very good at sounding certain.

`prompts/system.md` now carries this as a first-class principle rather than a caveat: the chain is a weighing not a formula, conflicting signals are the normal case rather than an error, experience changes how the method is applied, and hedged language is required where the curriculum hedges.

Worth re-checking whenever a new rule or value gets encoded: does this make the method look more mechanical than the curriculum intends?

### A fifth risk class: teaching that depended on the visual

Not a transcription error. Something the transcript loses because the chart is gone.

The scenarios module defines in, at and out of the money four times. The two call definitions read
as strike relative to stock and are correct. The two put definitions use the identical sentence
shape but only make sense as the stock moving. Read as strike, which is how the call sentences train
you to read them, both puts come out backwards. The module's own worked examples are correct, so the
examples and the chart descriptions disagree.

Almost certainly there is a chart on screen making it obvious. **The lesson is probably fine. The
transcript is not.**

That is a different problem from every error class tracked so far, and it has no glossary fix:

- Nothing is misspelled or mis-heard
- Nothing looks wrong, because all four sentences are parallel and equally confident
- The words are very likely exactly what was said

**The bot only ever gets the text.** Any passage whose meaning was carried by what was on screen
arrives ambiguous or inverted, and no amount of transcription accuracy helps. This is a reason to
expect more of these in every chart walkthrough module, where "anything under this line" and "right
here" do a lot of work that text cannot carry.

**Detection:** compare a stated rule against the module's own worked examples. Where they disagree,
the visual was probably doing the disambiguating. That check found this one and it is cheap to run.

### The fourth error class recurs, and it lands in the mnemonic

Calls and Puts renders **"Calls means the stock is going up"** as **"Cause means the stock is going up"**.

Second instance of the class, after theta as "data", which confirms it is a pattern rather than a
one-off. This one is worse placed: it sits in the single-line mnemonic the module offers as the
thing to remember, immediately after saying "very simple to remember".

It is also self-correcting within the transcript, which later says "calls means the buyer believes
the stock is going to move up". That is the second time a transcript has contained its own fix
further down, after the Fibonacci levels. **Worth checking a suspect term against the rest of the
same transcript before treating it as unresolvable.**

### A fourth error class: the wrong word that is still a real word

Options Factors renders **theta**, the standard name for time decay, as **"data"**.

This is worse than the mangled proper nouns and worse in a different way from the wrong numbers.

- "Mirabozor" looks wrong. A student sees it, knows something is off, and searches for the real word.
- A wrong Fibonacci level does not look wrong, but at least a student who checks another source finds the discrepancy.
- **"Data" looks like ordinary English.** Nothing about it signals an error. It reads as a slightly odd but plausible sentence.

And the module tells students to go look it up: *"you can look it up in your brokerage system and it will tell you how much your contract will decline of daily basis."* Under the name "data", that instruction fails outright. Every platform lists theta.

So the glossary now needs a fourth check alongside proper nouns, numbers and generic noise: **terms of art replaced by common words.** These will not surface from spotting something that looks broken, because nothing looks broken. They surface from knowing the domain and noticing that a concept has been given a name the field does not use.

### Some modules cannot be stripped of figures

Options Intro breaks the exclusion habit that worked on every prior compliance hit.

In Moving Averages the outcome language was garnish. Cut the six hits, the lesson survives whole. In Options Intro the arithmetic **is** the lesson: leverage is a numerical argument, and a module explaining why a 2,000 premium beats a 300,000 purchase has nothing left once the numbers go.

So figures now sort into two piles, not one.

**Mechanics** are hypothetical arithmetic attached to an invented house or an example stock, never to a real person, and usually arguing *against* something rather than promising anything. The 3.57 percent in that module is presented as a bad return.

**Outcome claims** attach results to real people or state efficiency as fact. Four of those were excluded: the 97 percent capital-efficiency statistic, "that's the way I've made money for many years", a 120 percent annual return figure, and "only 10 percent or less truly make it consistently".

**The mechanics still need a retrieval guard even when they stay.** Asked how much you can make with options, retrieval lands on the house walkthrough, which is dense with money words, and the bot restates "your total gain is 18,000". Compliant inside the lesson, an outcome claim in the answer. Same shape as the chart-walkthrough problem, same fix: `system.md` now requires the mechanism to be explained in relative terms rather than by restating the figures.

Worth expecting this pile-splitting on any module that teaches something quantitative.

### The chain is a convergence read, not a checklist

The most important correction to the project's model of the method, from Vlad: when a divergence matters, it appears together with the candlestick, volume and context as one picture.

The chain had been encoded as ordered steps, which is right as a list of what to look at and wrong as a description of how the read works. The steps are not gates. They are pieces that either point the same way or do not.

The module's worked entry is unambiguous about this. A crossover is called "a good signal, but it's not an entry signal". Then candles gap up, bullish volume appears, a third day breaks two moving averages on a strong hammer, and the conclusion is "we have everything pointing in that direction". Confirmation there is not a rule being satisfied, it is pieces accumulating until they agree.

Three consequences now in `prompts/system.md`:

- The chain is never presented as a score. Six of ten steps is not a signal and nothing in the method sums that way.
- Alignment is what gets taught. The question is not "did I complete the checklist" but "is everything pointing the same way, and if not, what disagrees".
- Disagreement is information. The curriculum declines trades on a single dissenting piece, most clearly a bullish reversal candle refused because "the volume is still very bearish".

This also completes the lag picture. The indicator flags early, the primaries catch up, and whether they agree is the confirmation. That is why a divergence is a reason to watch rather than a trigger.

### The indicator hierarchy is ordered by latency

Vlad's rulings across several messages assembled into something the modules never state in one place: volume, candlesticks and context are primary, indicators are supplementary, divergence is the primary use of the oscillators, and all of it is delayed.

Put together, the ranking turns out to be ordered by how live the information is. Volume is real time, and the Volume module opens by saying nothing is as live as it. The candle is the current session. Trend is the accumulated record. Indicators are computed from bars that have already printed, so they lag by construction rather than by flaw.

That makes the hierarchy explainable rather than a list to memorise, and it gives the bot a reason to give when an indicator disagrees with the primaries: the lag is the likely explanation.

It also produces confirmation before entry for the sixth time, now from the indicator side. A divergence is a reason to watch. Entry still waits.

### Numbers are the weak point

Three of four modules processed here produced numeric errors in the values being taught. Momentum also produced an indicator mislabel, stochastic bands attributed to the MACD, which is the same failure in a different form: the transcript states something confidently that is simply wrong. Canonical values now live in `terms.json` and the system prompt instructs the bot to prefer them over anything retrieved.

---

## What is blocking indexing

Nothing is in the corpus. Two blockers, both structural rather than per module.

1. **No transcript carries timestamps.** `corpus/schema.md` requires one per chunk and does not index without it. Affects every plain-text transcript, so it needs solving once. Open question 11. **Does not affect written worksheets**, which cite by section and could be indexed ahead of the video material.
2. **Three modules have no number or course.** Volume, Moving Averages, and Momentum Indicators. Citations are the product. Open questions 10, 17 and 20.

## Transcript store: Google Drive

**Solved. Transcripts are never to be requested twice.**

Raw transcripts live in Drive, in the folder **`Trader Foundation Student Bot - Transcripts`**, ID `1B1pSK-s7a_mmMnsVvT9bWBCr0vktlvkr`.

This repository is public so transcripts cannot be committed here, and the container is reclaimed between sessions, so anything left on local disk is lost. Drive is private, durable, and already holds the rest of the curriculum.

| Module | Drive file | ID |
|---|---|---|
| Module 8, Fibonacci | `module-08-fibonacci-retracement-RAW.txt` | `1zRcbT3hq64fE3Ni38tRcaEGzQMzT1f-2` |
| Moving Averages | `moving-averages-UNNUMBERED-RAW.txt` | `1_L2e5pKD41z0dM2MQFfZZdiWuExiBJ8t` |
| Momentum Indicators | `momentum-indicators-UNNUMBERED-RAW.txt` | `1wVcs-O50OlB_0YMSItm3wwoJ-lif1yiZ` |
| Options Intro | `options-intro-UNNUMBERED-RAW.txt` | `1ZoCdJm0A6v2M13TVoG7bND6_TAxiT55s` |
| Options Factors | `options-factors-UNNUMBERED-RAW.txt` | `1fjHIeeOPAQfe_UbgEX6L4PrBjxjOF222` |
| The Bounce Profit Plan *(worksheet)* | `document-bounce-profit-plan-RAW.txt` | `1I-ejvV92yaZdzKpQSv5JeyGclsRIq6sr` |
| Breakout Strategy *(worksheet)* | `document-breakout-strategy-RAW.txt` | `1INwugRa-afsIWs8l-tP5iAL4oOuofEVO` |

**Raw only.** Worksheets need no clean pass at all, since they are typed and carry no transcription errors. For transcripts, clean files are regenerated deterministically from raw plus `glossary/terms.json`, so storing them would create a second thing to keep in sync. Each uploaded file carries a header listing its known errors, module-number evidence, and compliance status, so it is self-describing if opened directly.

**This is now step 6 of the intake procedure.** Upload raw to that folder as part of processing, before committing metadata.

**Volume is the one gap.** It was processed before this store existed and its transcript was lost to a container reset. Its findings are fully recorded, so nothing analytical is missing, but the text cannot be re-derived from. Not worth re-supplying unless something specific needs checking against it.

---

## Resuming cold

Read in this order: `CLAUDE.md`, this file, `rulings/open-questions.md`, `rulings/compliance-log.md`, `glossary/terms.json`.

That is enough to process the next module correctly without the previous transcripts being present.

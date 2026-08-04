# Processing log

Running record of every module put through the pipeline. **Append to this on every module. Never rewrite history in it.**

This log is the index that ties the work together, so a session starting cold can read one file and know exactly where things stand. The working container is ephemeral and transcripts cannot be committed to this public repo, so findings live here and raw transcripts live in Drive. See "Transcript store" below.

---

## Standing intake procedure

Every transcript supplied gets every step, in order, no exceptions.

**0a. Check for a duplicate first.** Word count plus a handful of signature findings against the ledger below. Module 8 was supplied twice, and re-running it would have produced a second set of identical entries. Cheap check, real saving.

**0b. Check the transcript is complete.** Read the first and last lines. A lesson that opens with a welcome and closes with a sign-off is whole. This matters when something expected turns out to be missing: knowing the transcript is complete tells you the content lives in a different module rather than in a truncated section of this one. It resolved the RSI question in one look.

**1. Glossary pass.** Run `glossary/terms.json`. Three distinct error classes now, in descending order of danger:

- **Numeric.** The tool mis-hears the values being taught. Highest risk, because a wrong number looks authoritative and a student cannot tell. Always audit taught numbers against the canonical values in `terms.json`, and against values the same transcript establishes earlier.
- **Proper noun.** Tickers, company names, pattern names. Dangerous because the bot would cite a fictional company confidently.
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

### Recordings are not self-correcting, twice confirmed

Two rulings now, and both went the same way.

**Inverted hammer:** the Module 3 recording teaches a flat rule; current teaching adds a confirmation condition that was never recorded.

**Stochastics:** the Momentum recording says the instructor prefers fast stochastics; the house setting is Full Stochastics at 14.3.3, and the written worksheet carried the correction.

Neither recording contains any signal that it has been overtaken. Both state their position confidently and give a reason. Read alone, each looks settled.

The pattern worth generalising: **where typed house material and a recording disagree, the typed material is more likely to be current.** That is already the standing rule for values in `glossary/terms.json`. Vlad has now applied it the same way to teaching, which is the stronger case.

The advancement check needs running against every module, not only where something looks odd, because in both cases nothing looked odd.

A probable third is open: RSI appears in The Bounce Profit Plan's setup table but in no transcript, and the Momentum recording actively tells students to add stochastics and MACD and "not anything else". Same shape again. See open question 22.

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
| The Bounce Profit Plan *(worksheet)* | `document-bounce-profit-plan-RAW.txt` | `1I-ejvV92yaZdzKpQSv5JeyGclsRIq6sr` |
| Breakout Strategy *(worksheet)* | `document-breakout-strategy-RAW.txt` | `1INwugRa-afsIWs8l-tP5iAL4oOuofEVO` |

**Raw only.** Worksheets need no clean pass at all, since they are typed and carry no transcription errors. For transcripts, clean files are regenerated deterministically from raw plus `glossary/terms.json`, so storing them would create a second thing to keep in sync. Each uploaded file carries a header listing its known errors, module-number evidence, and compliance status, so it is self-describing if opened directly.

**This is now step 6 of the intake procedure.** Upload raw to that folder as part of processing, before committing metadata.

**Volume is the one gap.** It was processed before this store existed and its transcript was lost to a container reset. Its findings are fully recorded, so nothing analytical is missing, but the text cannot be re-derived from. Not worth re-supplying unless something specific needs checking against it.

---

## Resuming cold

Read in this order: `CLAUDE.md`, this file, `rulings/open-questions.md`, `rulings/compliance-log.md`, `glossary/terms.json`.

That is enough to process the next module correctly without the previous transcripts being present.

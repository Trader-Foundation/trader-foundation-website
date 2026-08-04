# Processing log

Running record of every module put through the pipeline. **Append to this on every module. Never rewrite history in it.**

This log is the index that ties the work together, so a session starting cold can read one file and know exactly where things stand. The working container is ephemeral and transcripts cannot be committed to this public repo, so findings live here and raw transcripts live in Drive. See "Transcript store" below.

---

## Standing intake procedure

Every transcript supplied gets all six steps, in order, no exceptions.

**0. Check for a duplicate first.** Word count plus a handful of signature findings against the ledger below. Module 8 was supplied twice, and re-running it would have produced a second set of identical entries. Cheap check, real saving.

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

Modules 2, 3 and 5 were characterised in the spec before this log existed. Everything from Volume onward was processed here.

Known: the numbered course runs to at least 11. Module 8 closes by pointing at Module 9, and Momentum Indicators refers three times to "the past 10 modules", which places it at 11.

Working hypothesis for the unassigned two, not confirmed: Moving Averages closes by pointing at the bounce formula "next", so Moving Averages 9 and the bounce formula 10 would put Momentum at 11 and fit every cross-reference seen. Needs Vlad.

---

## Cumulative findings

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

### Numbers are the weak point

Three of four modules processed here produced numeric errors in the values being taught. Momentum also produced an indicator mislabel, stochastic bands attributed to the MACD, which is the same failure in a different form: the transcript states something confidently that is simply wrong. Canonical values now live in `terms.json` and the system prompt instructs the bot to prefer them over anything retrieved.

---

## What is blocking indexing

Nothing is in the corpus. Two blockers, both structural rather than per module.

1. **No transcript carries timestamps.** `corpus/schema.md` requires one per chunk and does not index without it. Affects every plain-text transcript, so it needs solving once. Open question 11.
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

**Raw only.** Clean files are regenerated deterministically from raw plus `glossary/terms.json`, so storing them would create a second thing to keep in sync. Each uploaded file carries a header listing its known errors, module-number evidence, and compliance status, so it is self-describing if opened directly.

**This is now step 6 of the intake procedure.** Upload raw to that folder as part of processing, before committing metadata.

**Volume is the one gap.** It was processed before this store existed and its transcript was lost to a container reset. Its findings are fully recorded, so nothing analytical is missing, but the text cannot be re-derived from. Not worth re-supplying unless something specific needs checking against it.

---

## Resuming cold

Read in this order: `CLAUDE.md`, this file, `rulings/open-questions.md`, `rulings/compliance-log.md`, `glossary/terms.json`.

That is enough to process the next module correctly without the previous transcripts being present.

# Processing log

Running record of every module put through the pipeline. **Append to this on every module. Never rewrite history in it.**

This file exists because the working container is ephemeral and transcripts are gitignored, so the raw text does not survive between sessions. What survives is committed metadata. This log is the index that ties it together, so a session starting cold can read one file and know exactly where the work stands.

---

## Standing intake procedure

Every transcript supplied gets all five steps, in order, no exceptions.

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

Modules 2, 3 and 5 were characterised in the spec before this log existed. Everything from Volume onward was processed here.

Known: the numbered course runs to at least 9, since Module 8 closes by pointing at Module 9.

---

## Cumulative findings

### Compliance rate is worsening, not improving

Three of six modules clean. The spec assumed occasional hits found by a routine pass. On six modules that does not hold, and Moving Averages carries six hits including a stated percentage return and dollar figures attached to performance.

Two consequences. Scope for the library-wide pass is larger than assumed, and at least some modules need re-recording rather than editing, because excluding a passage fixes the bot without touching the video a student watches.

### Confirmation before entry: four independent instances

Modules 3, 5, Volume, and Fibonacci each arrive at it separately. This is the best-evidenced principle in the curriculum and the bot's structural safety mechanism.

### Chart walkthroughs carry position-advice language by default

Every walkthrough module narrates entry and exit against a real chart. Fine in a video, reads as instruction when retrieved as a chunk. `prompts/system.md` carries a rule for this. Expect it in every walkthrough module rather than treating it as a per-module finding.

### The curriculum contains one decision procedure, taught one piece per module

The most useful thing to come out of processing three modules, and something not visible from any single one of them.

Assembled macro to micro: market, sector, stock, news to avoid, liquidity, the 50 and 200 day background check, structure, candle, volume, confirmation.

Module 2 supplies the top (galaxy, solar system, planet, news, liquidity). Module 3 supplies candles and the judge-and-evidence framing that governs how the steps combine. Module 5 supplies structure. Volume supplies the volume check. Moving Averages supplies the background check and, notably, demonstrates the whole chain running at once on the Amazon walkthrough.

This is now in `prompts/system.md` as the bot's primary behaviour. When a student asks something the bot cannot answer, it hands over the chain as questions they can answer on their own chart, rather than closing the door. Two guards: the bot never closes the chain with a verdict, and never asks for their answers in order to assess.

Worth checking every further module for whether it adds a step, refines one, or reorders them.

### Numbers are the weak point

Two modules produced numeric errors in the values being taught. Canonical values now live in `terms.json` and the system prompt instructs the bot to prefer them over anything retrieved.

---

## What is blocking indexing

Nothing is in the corpus. Two blockers, both structural rather than per module.

1. **No transcript carries timestamps.** `corpus/schema.md` requires one per chunk and does not index without it. Affects every plain-text transcript, so it needs solving once. Open question 11.
2. **Two modules have no number or course.** Volume and Moving Averages. Citations are the product. Open questions 10 and 17.

Separately, and not a blocker but a real constraint: **transcripts have no durable home.** This repository is public so they cannot be committed, and the container is reclaimed between sessions, so raw and clean files are lost each time. Findings survive because they are committed. Rebuilding a clean file requires the transcript to be supplied again. This resolves when the project moves to a private repository.

---

## Resuming cold

Read in this order: `CLAUDE.md`, this file, `rulings/open-questions.md`, `rulings/compliance-log.md`, `glossary/terms.json`.

That is enough to process the next module correctly without the previous transcripts being present.

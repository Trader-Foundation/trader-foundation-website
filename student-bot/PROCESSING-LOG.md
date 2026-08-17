# Processing log

Running record of every module put through the pipeline. **Append to this on every module. Never rewrite history in it.**

This log is the index that ties the work together, so a session starting cold can read one file and know exactly where things stand. The working container is ephemeral and transcripts cannot be committed to this public repo, so findings live here and raw transcripts live in Drive. See "Transcript store" below.

---

## Standing intake procedure

Every transcript supplied gets every step, in order, no exceptions.

**0a. Check for a duplicate first.** Word count plus a handful of signature findings against the ledger below. Module 8 was supplied twice, and re-running it would have produced a second set of identical entries. Cheap check, real saving.

**0b. Check the transcript is complete.** Read the first and last lines. A lesson that opens with a welcome and closes with a sign-off is whole. This matters when something expected turns out to be missing: knowing the transcript is complete tells you the content lives in a different module rather than in a truncated section of this one. It resolved the RSI question in one look.

**0. ASK FOR A CAPTION FILE, NOT PLAIN TEXT.** SRT or VTT. This is the single highest-leverage step in the whole procedure and it costs nothing at supply time.

A caption file carries a timestamp on every sentence. Plain text carries none, and `corpus/schema.md` will not index a chunk without one. Twenty plain-text sources are fully processed and none of them can be indexed for that reason alone, while the first caption file to arrive was indexable immediately.

**Where a source exists as video, captions are almost always obtainable**, and the same video that produced a plain-text transcript will produce a timestamped one. Ask before processing. Re-supplying as captions later means re-doing intake; asking first costs one question.

Preserve the timestamps into the clean file. Anchor one every several cues rather than flattening to prose, so citations survive chunking.

**0c. Before transcription, if you control it: feed `glossary/transcription-hints.md` to the tool.** Prevention beats cleanup. The errors this project keeps fixing are the same words failing the same way, and the hint list is ordered by observed damage so a tool with a term cap still gets the ones that matter.

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

**5b. Dangling reference check.** Search the transcript for backward references: "we learned", "we already", "we talked about", "we covered", "as we discussed", "previous or last module", "from our previous video", and any explicit module number. Confirm each one lands on teaching that actually exists.

This found that covered calls are referenced as taught and are not taught at all, which no other pass would have caught. It is the one gap class where the bot's default answer, "I cannot find that," is actively harmful, because it sends a student searching for something that was never recorded. Cheap, mechanical, worth running every time.

Two outcomes to tell apart: a reference to **nothing**, which needs a bot rule and a video flag, and a reference to the **wrong place**, which is usually numbering evidence rather than a problem.

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
| Options: in/at/out of the money | **unassigned** | Clean, 1 borderline | none. 4 generic noise fixes, see question 28 for the real problem | 1 | No |
| Options thinkorswim walkthrough | **unassigned** | 1 ruled by Vlad, kept with the risk paired | 5 decimal artifacts fixed, 2 unresolved | 2 | No |
| Options Greeks in thinkorswim | **unassigned** | **9 excluded. Strongest re-record candidate** | 17 artifacts fixed, arithmetic audited clean | 0 | No |
| Options Vertical Spreads | **unassigned** | **3 excluded, 2 of them the counting-scenarios pattern** | none. Every figure reconciles exactly | 3 | No |
| Bull call / bear put *(coaching)* | n/a, coaching | 2 excluded, 2 borderline | 2 proper nouns, 15 artifacts, 5 redactions | 1 | No |
| The Paycheck Collector *(class)* | n/a, coaching | **LARGEST EXCLUSION SET IN THE PROJECT. Re-record line in the intro** | glossary pass run, 12 redactions | 2 | No |
| Paycheck Collector, how you lose | n/a, coaching | 1 excluded, 2 borderline. Much cleaner | 16 fixed, arithmetic reconciles | 1 | No |
| thinkorswim setup | **unassigned** | **Clean.** 2 privacy redactions | 9 fixed, 1 unresolved | 1 | No |
| Live session 2026-08-06 *(SRT)* | n/a, live session | **Clean** | 1 redaction. **368 timestamps** | 3 | **Unblocked** |
| FB Live #151 to #159 *(9 sessions)* | n/a, coach live | **1 excluded, and it is serious** | 170 redactions. Sequence numbers and dates present | 1 | Pending captions |

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

### Compliance risk concentrates in the motivating half of a lesson

Two halves of the same class, processed back to back, and the difference is stark.

**Part one sells the strategy.** It carries the largest exclusion set in the project: a stated rate of return, a compounding projection ending in the word retirement, two 90 percent win rates, and the strategy called "very safe".

**Part two explains how you lose.** Three hits, one of them real, and its two biggest dollar figures are *assignment cost illustrations* whose whole purpose is to frighten a student away from a mistake.

Same speaker, same session, same strategy. The difference is what the passage is for.

**This is the second time the same shape has appeared.** Part one's worst material is in its produced introduction rather than its unscripted body. Here the worst material is in the half that motivates rather than the half that instructs.

**So the library pass should be targeted rather than uniform.** Intros, closings, forward references to the next lesson, and any passage answering "why should I learn this" are where the exposure lives. The passage explaining a mechanism is usually fine. That is a much cheaper pass than reading every module end to end with equal attention, and on this evidence it would catch most of it.

### Students hit a wall in the same place, twice, with two different people

Both coaching sessions received are about spreads, and in both the student stalls on the same conceptual ground.

**First call:** "I need to understand better the formula for doing the math and where to find those numbers", after the max profit and max loss walkthrough.

**Second call:** an extended struggle with what it means to *sell* a put. "Why is it so hard? Why is it so hard for my brain?" The student writes it down twice, gets it backwards in their own notes, and works through it out loud for several minutes.

And Vlad's answer is the useful part:

> "it took me about seven months to really comprehend this idea. Cause I felt the same way. You're not used to selling."

**So this is a known hard edge, not two students being slow.** The recorded modules teach buying throughout and every intuition a student builds is a buyer's intuition. Selling inverts the direction of every one of them, and nothing in the material marks the switch.

**Two things follow.** It is a strong candidate for a dedicated piece of teaching, since Vlad has already diagnosed it precisely. And for the bot it means questions in this area deserve extra care: a student asking about a sold put is very likely to have the direction backwards, so lead with which side of the trade they are on rather than assuming the question means what it says.

### The FB Live library is 554 sessions, and its metadata solves problems the modules could not

Nine processed, #151 to #159. Full write-up in `rulings/fb-live-sessions.md`.

**Every file carries a header the module transcripts never had:** a sequence number (`#151 of 554`), a recording date, a duration, and a **Vimeo URL**.

That is four problems addressed at once. Ordering across the library needs no ruling. Recording date is a schema requirement most module chunks cannot satisfy. And the Vimeo link is the likely route to captions, which is the one remaining structural blocker. **If Vimeo holds auto-generated captions for these, 554 sessions become timestamped and indexable.**

**Keep the header verbatim on every file.** It is worth more than any single session's content.

### Hash on arrival, not eyeball

Five files supplied, four unique: two byte-identical copies of #151, caught before any processing. At 554 in the library and 100 incoming, filename inspection will not hold. The duplicate check is now a hash.

### A coach's method, stated more plainly than any module states it

The scan across nine hours is strikingly consistent, and the coach names the set himself as "the three things I'm always talking about":

1. **Is it the first day?** 21 mentions. The primary filter, and explicitly a time-saver: a no ends the analysis before risk and reward is even discussed, because day two usually means the edge is already deteriorating.
2. **Perceived edge.** 11 mentions. Candle and volume actually making a case.
3. **Risk versus reward.** 32 mentions, the most frequent concept in the batch, measured from structure and used to reject.

**All three must check.** This is the module material compressed into something a student can run in seconds, and it exists nowhere in the recorded curriculum.

### The six-strategy map, and the answer to a wall students keep hitting

The batch contains the first full statement of all six option strategies as a system: buy call, bull call, bull put on the bullish side, and their mirrors bearish. Taught with a house analogy that resolves the exact confusion two students hit in the Paycheck Collector calls, and which the coach names as the common mind bender: how can you be bullish with puts.

Buyers work the side that will gain value. Sellers work the side that will lose it. **Third independent sighting of that wall, and the first with a full explanation attached.**

### Compliance across nine unscripted hours: almost nothing, and one thing that matters a lot

Two uses of "guarantee", both saying the opposite of a promise. No dollar figures. No coach performance claims. Consistent with the pattern that sessions without a motivating passage stay clean.

**The exception is the most consequential compliance finding in the project**, because it is not confined to one recording:

> "that's how you're gonna outperform **the 10% a month that marketing has told you**"

A coach referring to 10 percent a month as a figure **marketing has already given students**. It corroborates the Paycheck Collector class intro, which states the same rate and is already a flagged re-record line.

So the number appears in marketing, in a paid class, and in coaching as a shared baseline. **Excluding it protects the bot and nothing else.** That is a business question, not a corpus one, and it is now open question 41.

### Group sessions are the heaviest redaction load in the project

Roughly thirty members named, several submitting trades with entries, exits and outcomes, plus ordinary conversation about locations, birthdays and family. 170 redaction markers across nine sessions.

**At 100 incoming this is the bottleneck**, and it is mechanical rather than judgement, which is what makes it safe at volume. The name list lives in the processing script and grows as new members appear.

### A third source class, and it carries timestamps

Live market sessions: a recurring review that grades past calls, reads the market top down, and screens live. Not a module, not a one-to-one call.

**The first one arrived as an SRT and solved the biggest structural blocker on this project.** Twenty sources are processed and nothing is indexed, and the reason is that the chunk schema requires a timestamp and no plain-text transcript has one. This file has 368.

**The point is the route, not the file.** The modules exist as videos. The transcripts came through as plain text, but captions would carry positions. Asking whether the modules can be exported the same way is now worth more than any remaining processing work.

**What this class uniquely provides, beyond timestamps:**

- **Setups graded after the fact.** No module shows a call that failed. This session shows two that reached the same target, one continuing and one rejecting, and draws the lesson from the pair.
- **Rejections.** Five screener pages, most candidates dismissed out loud with a reason. The rejections teach more than the acceptances and nothing else in the corpus contains them.
- **Teaching that exists nowhere else.** A named disqualifier for the bounce setup ("the hiccup", a dip too shallow to count as a fall), the instruction to make rules conditional rather than "sometimes", and the cleanest answer in the corpus to "should I have held longer".

Full write-up in `rulings/live-sessions.md`.

**One caution.** The speaker is not identified and the register differs from the module recordings, so this may be a coach rather than Vlad. Where a session and a ruling disagree, the ruling wins, which means speaker identity has to be knowable per file. Raised as an open question rather than assumed.

### Coverage is lopsided, and coaching material will not fix it

Recorded at the point Vlad said the classroom material was complete and that a large coaching library was coming.

**Text actually held: 16 transcripts.** The ledger shows more because Modules 2, 3 and 5 were characterised in the spec rather than transcribed, and the Volume transcript was lost to a container reset with only its findings surviving.

**Exactly one numbered module exists as text: Module 8, Fibonacci.** Everything else is unnumbered or spec-described.

So the corpus is deep on options and thin on technical analysis. **A beginner would hit the thin part first**, since candlesticks, support and resistance and screening are the opening lessons and none of them exist as text.

**Coaching sessions deepen the imbalance rather than correcting it.** They assume the modules and refer back to them. The clearest evidence is in the material itself: asked how the spread maths works, the coach says *"you want to go back to the original lesson."* A bot built mostly from coaching would keep making that same handoff to lessons it cannot cite.

**Known gaps, with the evidence for each:**

| Gap | Evidence |
|---|---|
| Modules 2, 3, 5 | The spec describes them in detail, so transcripts existed. Never supplied here |
| Credit spreads module | Forward-referenced twice, "that's what we're going to get into next". Never arrived. May not exist, with the Paycheck Collector class covering it instead |
| Volume | Lost to a container reset. Findings preserved, text gone. Only worth re-supplying if something needs checking against it |
| Stock Predator | Named in the original scope decision, and coaching points students at it: "watch my predator course" |
| Modules 1, 4, 6, 7, 9, 10 | Only if they are separate lessons rather than mapping onto the unnumbered files held |

**The numbering question is now worth more than it was.** If the options track is numbered separately, several unnumbered files may turn out to be the missing numbered modules, which would close part of this without anyone finding a file.

### What coaching material is uniquely good for

Worth stating before the volume arrives, so processing optimises for the right thing.

Coaching is **weaker** than modules as a source of teaching: it is unscripted, it repeats itself, and it carries more compliance load and all the personal data. Processing it purely for content would be poor value at scale.

**Its unique value is showing where students get stuck.** Two sessions have produced two walls, both on selling rather than buying:

- One student could not place where the max profit and max loss figures come from.
- Another could not hold onto what selling a put means, wrote it down twice, and got it backwards in his own notes.

And Vlad's own diagnosis, which is the useful part: *"it took me about seven months to really comprehend this idea. You're not used to selling."*

Every recorded module teaches **buying**. Every intuition a student builds is a buyer's intuition, and selling inverts all of them with nothing marking the switch.

**At volume this stops being anecdote.** A count of where students stall, across a large library, is evidence about which lessons are not landing, and that is worth more to the curriculum than another paraphrase of a strategy already recorded three times.

`COACHING-INTAKE.md` makes that the primary output of the triage, rather than a side note.

### Coaching material is in scope now, and it changes the job

Vlad has ruled: *"i need you to put this in though"*, *"everything im feeding you is needed."* The `CLAUDE.md` scope boundary is updated and a redaction standard is written into it, which is what the spec required before this could happen.

**What moved:** coaching recordings are first-class sources and get the full pipeline.

**What did not move, and this matters:** the compliance scan runs harder here, not softer. Ingesting a source has never meant ingesting all of it, and coaching material carries *more* outcome language than recorded modules because nobody scripted it. The Paycheck Collector class produced the largest exclusion set in the project.

**The new step is redaction, and it is not the same thing as exclusion.** Exclusion protects the bot from restating something. Redaction protects a real person whose account size, open position and running profit and loss are in the recording. A source with a named student in it needs both, and only one of them was in the pipeline before. Every redaction leaves a visible marker, because silent removal would make the clean file useless as a record.

### The Paycheck Collector class: the intro and the body argue against each other

**This is the single most important compliance finding in the project, and the reason is that it is not a private call.** It opens with a produced introduction and calls itself "a class like this, a paid class". The material is shown to students, so the exposure is live in the product regardless of what the bot ever does.

**The introduction sells a rate of return.** Ten percent of the account per week or month, "knowing exactly how much money is going to come in", and the strategy called "very safe". Then a month by month compounding projection that ends in the word retirement. All excluded, and flagged as a re-record line rather than an edit, because it is the opening frame rather than an aside.

**The body argues the opposite for most of its length.** Keep the spread narrow. Never end up inside it. Refuse a 30 percent credit on purpose because the probability behind it is worse. "Don't fall in love with the 30 percent, fall in love with longevity." Take the smaller, likelier outcome. That is a risk-first lesson and it is good teaching.

**So the fix is not to soften the lesson. It is to make the intro match the body.** Everything the intro promises, the body spends forty minutes qualifying. Cutting the rate of return would cost the class nothing it actually teaches.

Worth generalising: **where a piece of content has a produced wrapper and an unscripted body, scan the wrapper first.** The wrapper is where the selling happens, it is written rather than spoken, and it is the part that gets reused.

### A strategy name finally has content behind it

`Paycheck Collector` has been protected vocabulary since the first day of this project with nothing behind it. It is selling credit spreads: 0.07 delta as a starting point, 30 to 37 days out, narrow spreads, closed early, capital split four ways so one position opens each week.

Two things worth noting beyond the mechanics.

**It closes the loop on the put seller ruling.** "You never want to end up in that spread" is the same standard as "the stock cannot touch the strike", applied to a different structure. One house position, two strategies, and saying so is worth more than teaching them separately.

**It is the third appearance of "more risky to want more."** Vlad's ruling, delta making it checkable in the Greeks module, and now an entire strategy built around deliberately refusing the better-paying trade. That is no longer a caution, it is the spine of the method.

### Two things are used in coaching and taught in no module

**Bollinger Bands**, which do real work in the Paycheck Collector: judging whether a target is a realistic distance away, and setting the sold strike one step outside the band on the weekly variant. They also act as a go or no-go filter.

This is a straight conflict rather than a gap. Momentum Indicators teaches stochastics and MACD and tells students to add those two and "not anything else." Open question 40.

**Legging out**, now confirmed as taught: Vlad asks the student "are you familiar with the term legging out?" and the student says yes, so it is established vocabulary between them. Still in no module. Open question 38.

Both are the same shape as covered calls and the opposite answer. Covered calls were referenced and not taught. These are taught and not recorded.

### The first coaching call, and the original out-of-scope call. SUPERSEDED

The scope ruling above overtakes this note. Kept because the risks it describes are real and are now managed inside the pipeline rather than avoided. The bull call and bear put call is queued for processing under the new standard.

**A recording of a one-to-one coaching session was supplied. It was not processed at the time and nothing from it entered the corpus.** It is stored in `transcripts/out-of-scope-coaching-calls/` so it never has to be supplied again, with a README explaining why it stays there.

`CLAUDE.md` is explicit that live coaching recordings are out of scope for v1, pending a redaction standard. This is the first one received, and it makes the case for that boundary better than the spec does. All three named risks are present in one recording:

- **Live positions.** Two real trades placed and closed on screen, with strikes, fills, and running profit and loss.
- **The student's own material.** They bring a chart they have been working on and it gets analysed. No name is spoken, but the idea is theirs.
- **Loose speech, extensively.** The downside of a long call stated as "unlimited" twice before being half-corrected. Max profit and max loss swapped repeatedly, with the instructor saying out loud that he thinks he mixed them up. The contract count drifting between five, ten and twenty. A closed trade whose result he cannot determine, later found to have still been open.

**None of that is a criticism.** A live call is a conversation, and correcting yourself in front of a student is how teaching works. It is simply not extractable: every one of those sentences would retrieve as a fact, stripped of the correction that followed it thirty seconds later.

**What is worth keeping is what the call says about the recorded course**, which is a different thing from the call's contents. Those findings are below and in `rulings/`. Observations about the material are not the material.

### The max profit and max loss confusion is a teaching weak point, not a transcription slip

Three sources now, and the evidence has changed character.

| Source | What happened |
|---|---|
| Vertical Spreads module | Max profit figure given as the max loss, twice |
| The coaching call | Same swap several times, and the instructor says "I think I messed up... I thought I maybe mixed up the numbers" |
| The coaching call | The student says "I need to understand better the formula for doing the math and where to find those numbers" |

The first instance looked like a slip in a recording. The second shows the same confusion arising live, unprompted, and being noticed by the person making it. The third is a student reporting directly that the lesson did not land.

**That is three independent kinds of evidence pointing at one thing**, and it moves this from "fix two sentences" to "the way this is taught does not stick." Worth Vlad's attention as a teaching question rather than a transcript question.

**The bot side is already handled.** It uses the formulas, which are verified, rather than any restated figure.

**One encouraging detail.** Asked for the math, the instructor routes the student straight back to the recorded module: *"You want to go back to the original lesson... I explain exactly why each number is where, how we get the max profit, how we get the max loss, the break even."* That is precisely the behaviour the bot is designed to have, performed by a coach, which is a useful confirmation that the design matches how the teaching already works.

### A sixth thing that can be wrong: a reference to teaching that does not exist

The Vertical Spreads module says **"we already did with covered calls, didn't we?"** Vlad's answer: *"nothing actually teaches covered calls,"* and *"i doubt we discuss it."*

So the course points a student at a lesson that is not there, and the phrasing makes it worse. "We already did" and "didn't we" both assume the student had it, so anyone who does not remember covered calls concludes they missed a module or that their access is broken.

**This is a distinct class from everything tracked so far.** Nothing is mis-heard, nothing is non-compliant, nothing is out of date, and no visual is missing. The sentence is intact and the teaching around it is fine. What is wrong is that it refers outside itself to something that does not exist.

**It is also the class the bot handles worst by default.** Every other gap produces "I cannot find that," which is honest and safe. Here that answer is actively harmful: it tells a student to keep looking for something that was never recorded. The right answer is "that is not part of the course," which the bot can only give if it knows, which means gaps like this have to be found deliberately.

**So I scanned every clean transcript for backward references** and checked each one resolves. Patterns searched: "we learned", "we already", "we talked about", "we covered", "as we discussed", "in the previous or last module", "from our previous video", and any explicit module number.

**Result: covered calls is the only dangling one.** Every other reference lands on real taught content. Fibonacci pointing back at consolidation, Momentum pointing back at candles and at support and resistance, Moving Averages pointing back at simple moving averages, the Greeks module pointing back at the thinkorswim walkthrough for how to reach the trade screen. All good.

**One near miss worth separating out.** Vertical Spreads says "we learned that in module two" about not waiting for expiration. The *content* exists, in the in/at/out of the money scenarios module, so this is not a dangling reference. It is a **mis-numbered** one, and it is the evidence behind open question 35 that the options track may be numbered separately.

So there are two failure modes here, and only the first is dangerous: a reference to nothing, and a reference to the wrong place. One instance of each in thirteen sources.

**Worth re-running as a standing check** whenever a batch of new modules arrives. It is cheap, it is mechanical, and it found something no other pass would have.

### The curriculum derives probability by counting scenarios, and it has done it three times

**The most significant cross-module finding since the method chain, and the first one that is a reasoning habit rather than a fact.**

Three instances, two modules:

- Calls and Puts: three zones on a payoff diagram, therefore "2 out of 3 chances to win"
- Vertical Spreads: three price directions, therefore "a one out of three chance of winning"
- Vertical Spreads: a payoff ratio of 1881 against 1119, therefore "pretty good odds"

Counting outcomes is not a probability. A stock is not equally likely to rise, fall, and stay put. A zone on a diagram has no likelihood attached. And a good risk to reward ratio is not good odds, it is a good price for whatever the odds are, which is nearly the opposite claim.

**Why it took three instances to see.** Each one reads as a throwaway framing line in its own module. The first was caught as a compliance hit and excluded, and it looked like a one-off phrasing problem. Only with the third does it become clear that the counting is the *method* by which these numbers are being produced, which means more of them exist in modules not yet scanned.

**It contradicts the curriculum's own best statement of itself.** Module 3: no almanac, technical analysis "tilts probability toward you, nothing more." A method built on tilting probability cannot also derive probability by counting boxes.

**Two consequences.** `prompts/system.md` now carries an explicit rule against reproducing the habit, with the compliant replacement for each shape. And the library pass should search for it directly rather than waiting to notice it, because it is a phrasing reflex and reflexes recur.

**Generalisable beyond this project:** a corpus can carry a wrong *way of reasoning* as well as wrong facts, and the wrong reasoning is harder to find because each instance looks locally reasonable. Three sightings of the same shape is what made it visible. Worth watching for other shapes that recur.

### Arithmetic that fully reconciles is a finding in itself

The Vertical Spreads module states four formulas and works six positions, four of them read live off a platform. **Every single figure reconciles exactly**: net debit times 100 times contracts for max loss, width minus debit for max profit, lower strike plus debit for breakeven.

That is worth recording for two reasons.

**It makes the two slips provable rather than suspected.** The module twice gives the max profit figure as the max loss. Because everything else checks out, those two sentences can be called errors with confidence instead of being logged as ambiguous. Compare the GTC case, where nothing could be proved and the item stayed open.

**It is evidence about the material's quality that the compliance log alone would not show.** The same module that carries the counting-scenarios problem is also the most numerically careful one processed so far. Those are independent axes, and conflating them would misjudge the library. A module can be arithmetically rigorous and rhetorically loose at the same time, and this one is.

**Method note:** auditing every number rather than spot-checking took a few minutes and converted a "looks inconsistent" into a "is provably wrong, here is the correct value." Worth doing on any module that teaches a formula.

### The governing principle, and it was never in a transcript

Vlad, unprompted:

> "every single decision always comes down to the chart."
>
> "trade the chart not your heart"

This outranks everything else in this log. Full write-up in `rulings/the-chart-decides.md`.

**It reframes every number encoded so far.** Thirty days minimum, two to three days holding, close at 50 percent, Full Stochastics at 14.3.3, the 13 and the 20. None of those are decisions. They are places to start from before reading a chart. The project has been accumulating rule-shaped things because rule-shaped things are what a corpus can hold, and this is the correction to that drift.

**It also turns the bot's biggest limitation into its footing.** "The bot cannot see charts" was written as a compliance restraint. Under this ruling it is a description of the bot's position: if every decision comes down to the chart, and the chart is the one thing the bot will never have, then the bot is not *forbidden* from deciding, it is *incapable* of it. That is a stronger guarantee, because a restriction invites a student to push and a fact does not.

And it says the guided-reasoning behaviour was never a workaround. Handing a student the questions to ask of their own chart is the method being taught correctly, because the decision was always going to be theirs.

**"Not your heart" adds the second half.** The plain statement says where the information is. The phrase says what it competes with: hope, conviction, the number you want to be true. That meets the max profit ruling exactly, since reaching further out of the money for a bigger multiple is the heart talking. Two rulings, same idea from opposite ends.

### Delta turns a caution into something checkable

The best single thing the Greeks module contributes, and it is not the Greeks themselves.

Vlad ruled that unbounded upside on a call is real but that "more risky to want more." That is sound and it is hard to act on, because a student reaching for a cheap far out of the money contract does not feel like they are taking more risk, they feel like they are being efficient.

The Greeks module answers it with a number:

> "have enough days, be closer to the money so you can start making, because what happens is if you start buying things like here, that's 15 cents. Well, yeah, but look, 0.04."

Fifteen cents, delta 0.04. The contract barely moves when the stock does. **The cheap contract is not a bargain, it is a contract that hardly responds**, and delta says so on the student's own screen.

This is the pattern worth looking for generally: a principle Vlad states in judgement terms usually has an instrument in the curriculum that measures it. Finding that instrument is what makes the principle teachable by a bot rather than merely repeatable.

### The method has an execution step, and it was invisible until now

The chain assembled from the analysis modules ends at confirmation. The thinkorswim walkthrough adds what happens after you decide, and it is not just clicking.

**Check the bid ask spread before you take the trade.**

> "if you buy something at 97 cents, you could only sell it for 92. So you have to make up the 5 cent difference first before even profiting. Now that's not too bad 5 cents, but if you look here all of a sudden this next one is 11 cents."

That is a real filter with a real reason, and it is the kind of thing that decides whether a correct read makes money. It also **closes a loop back to Module 2**, in the module's own words:

> "That is why we're looking for liquid stocks with higher volume because usually they're highly traded and you won't have that big discrepancy."

The liquidity screen from the FinViz step was taught as a stock-selection criterion. Here it turns out to be doing a second job: liquid underlyings have tight option spreads. Second time a later module has explained why an earlier filter exists, after Momentum sent students back to FinViz screening.

**Worth adding to the chain as a distinct stage.** Analysis says whether to trade. Execution says whether this particular contract is worth trading, and it can veto a good read.

**The Greeks module then puts a step in front of it and three behind it.** In front: option volume and open interest, and it is emphatic about the ordering, "First thing you want to do before anything is look at volume." That is the stage 5 liquidity screen applied a second time, to the contract instead of the stock. Behind: delta, gamma and theta, with vega watched rather than led with, which is the same posture the curriculum takes toward momentum indicators.

So the execution stage is now four steps, and it has its own internal order, which is a sign it is a real part of the method rather than a bag of tips.

### Theta is mis-transcribed in two separate recordings

Options Factors rendered theta as "data". The Greeks module renders it as **"The next one is data. Data is your time the case"**, where "time decay" is also mangled, so the term and its definition are lost in the same line.

Two recordings, same error, which makes it systematic. **The tell is that every other Greek transcribes correctly.** Delta, gamma and vega come through clean in both modules. They are not English words and theta is close to one, so the tool reaches for the nearest ordinary word and finds it.

That sharpens the fourth error class into something predictable: **the domain terms at risk are the ones with a common-word neighbour.** Theta to data, calls to cause. Worth scanning for proactively rather than waiting to notice, and worth checking any term that sits one syllable from ordinary English.

### The visual-dependent class is worst in platform walkthroughs, and it has an antidote

The fifth error class was found in the scenarios module. The thinkorswim walkthrough is far more exposed to it: "if we come around here, put the lines up", "over here", "this piece right here", "click here", "it's in the purple here", "everything in the black".

But this module is also the first to **name what the colours mean**, so purple as in the money and black as out of the money survive the loss of the screen. That is the difference between a passage that degrades and one that dies.

Two consequences worth carrying forward. Any walkthrough passage where the meaning is carried by a deictic alone is unusable as text and should not be chunked. And where a module labels its own visual, that label is worth capturing in `terms.json`, because it is the only bridge from the recording to a student sitting in front of the same screen.

There is also a payoff. The walkthrough's put moneyness explanation, made against a live option chain, comes out correct and in strike terms. That is the strongest available evidence that the scenarios module's inverted put definitions were a transcription loss rather than a teaching error. See open question 28.

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

1. ~~**No transcript carries timestamps.**~~ **SOLVED FOR CAPTION FILES.** A live session arrived as an SRT with **368 timestamped cues across 22 minutes**. Every sentence has a position, so a chunk can cite `live session, 2026-08-06, 00:02:14` and send a student to that moment.

   **The route matters more than the file.** The classroom modules exist as videos, and the transcripts supplied were plain text. The same videos would produce captions through whatever route produced this one. **If the modules can be re-exported as SRT or VTT, this blocker disappears for the whole corpus.** That is now the highest-value question in the project.

   Still open for the twenty plain-text sources already processed, which would need re-supplying as captions to be indexable. Their findings do not need redoing either way. **Written worksheets remain unaffected**, since they cite by section.
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
| Options Calls and Puts | `options-calls-puts-UNNUMBERED-RAW.txt` | `1oCPr-FIekNwYhDpepMYWbME--s_64kUk` |
| Options: in/at/out of the money | `options-money-scenarios-UNNUMBERED-RAW.txt` | `1HIUBIpzJLU6Bu2rnENx34KI8VWwEdmcO` |
| Options thinkorswim walkthrough | `options-thinkorswim-walkthrough-UNNUMBERED-RAW.txt` | `1QD-x7q7ZEK0XZycqVNlVNgzncFcdV2Et` |
| Options Greeks in thinkorswim | `options-greeks-thinkorswim-UNNUMBERED-RAW.txt` | `1PrZbsqNkpdxbUFKOJoMXoP2wvt4ybGBl` |
| Options Vertical Spreads | `options-vertical-spreads-UNNUMBERED-RAW.txt` | `1WqiLrsnf2feKzkneP2xG0oNoS6oJl6mD` |
| Paycheck Collector, how you lose *(coaching)* | `paycheck-collector-losses-COACHING-RAW.txt` | `1gtmqsBpLC1p_w3f7r_HAjbQcD0iInrFs` |
| Paycheck Collector part one *(coaching)* | `paycheck-collector-part1-COACHING-RAW.txt` | `1bMm5yGleI1w8wyZ0h4sUTybgWsxeK4x5` |
| thinkorswim setup | `thinkorswim-setup-UNNUMBERED-RAW.txt` | `1s4MWv8sgd0rNNWtlQy3_rG8kq-flCspx` |
| Live session 2026-08-06 *(coach)* | `live-session-2026-08-06-COACH-weekly-review-TIMESTAMPED.txt` | `1h6ByYMFC97B9ygg0zCBLcBVPFodbAnEP` |
| Bull call / bear put *(coaching)* | `coaching-call-bull-call-bear-put-COACHING-RAW.txt` | `1o8dMyHcgLSMSXoNBkRjh4qcPht1Sk_O_` |
| The Bounce Profit Plan *(worksheet)* | `document-bounce-profit-plan-RAW.txt` | `1I-ejvV92yaZdzKpQSv5JeyGclsRIq6sr` |
| Breakout Strategy *(worksheet)* | `document-breakout-strategy-RAW.txt` | `1INwugRa-afsIWs8l-tP5iAL4oOuofEVO` |

**Raw only, with one deliberate exception.** The live session is stored as the timestamp-anchored CLEAN file rather than the raw SRT, because the anchors are the point and chunk-level citation does not need per-cue precision. The original SRT is with Vlad if cue-level timing is ever needed.

**Raw only.** Worksheets need no clean pass at all, since they are typed and carry no transcription errors. For transcripts, clean files are regenerated deterministically from raw plus `glossary/terms.json`, so storing them would create a second thing to keep in sync. Each uploaded file carries a header listing its known errors, module-number evidence, and compliance status, so it is self-describing if opened directly.

**This is now step 6 of the intake procedure.** Upload raw to that folder as part of processing, before committing metadata.

**Status: current.** Every source ever supplied is in Drive. Nothing is sitting on local disk only.

**Volume is the one gap.** It was processed before this store existed and its transcript was lost to a container reset. Its findings are fully recorded, so nothing analytical is missing, but the text cannot be re-derived from. Not worth re-supplying unless something specific needs checking against it.

---

## Resuming cold

Read in this order: `CLAUDE.md`, this file, `rulings/open-questions.md`, `rulings/compliance-log.md`, `glossary/terms.json`.

That is enough to process the next module correctly without the previous transcripts being present.

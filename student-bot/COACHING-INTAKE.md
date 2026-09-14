# Coaching session intake

**For processing coaching transcripts at volume.** Vlad has a large library of these and is supplying them in bulk.

**CORRECTION, and it changes how this file should be read.** An earlier version of this described coaching as "weaker than modules as a source of teaching." That was wrong, and Vlad pushed back on it: *"these sessions im giving you these lives are important."*

He is right, and the evidence was already in front of me:

- **The best-stated version of the method is in a live session, not a module.** First day, perceived edge, risk versus reward, named by the coach as a set and applied dozens of times per session. No module states it that compactly.
- **The clearest options teaching in the corpus is in a live session.** The full six-strategy map with the house analogy, which resolves the exact confusion that stalled two students in the Paycheck Collector calls.
- **Only live sessions show a call that failed.** No module contains a setup that did not work. The grading of past calls is unique to this class and it is where the honest teaching is.
- **Only live sessions show rejections.** Five screener pages dismissed out loud with reasons. A student learns more from why a chart was skipped than from why one was taken.
- **They are the cleanest material in the project on compliance.** Nine unscripted hours produced one exclusion. The modules produced dozens.

**And they are the closest thing in existence to what the bot is meant to be.** A coach, in front of students, answering the questions students actually ask. That is the product, recorded 554 times.

So what follows is a **throughput** procedure, not a ranking. The full pipeline on 554 sessions is not feasible and much of the content repeats. The triage exists so that volume does not become a reason to process none of it. Nothing here implies a live session is worth less than a module.

---

## Run every time, no exceptions

These are the two passes that protect people, and neither scales down.

### 1. Redaction

Standard is in `CLAUDE.md`. Every session, mechanically, in this order:

- **Names** to `[STUDENT]`, `[COACH]`, `[STAFF]`. The instructor is not redacted.
- **Account size**, in any form, including "I'm working with 10 G's".
- **Open positions**: ticker, strike, expiry, contract count.
- **Running profit and loss**, including "we're up a hundred" in passing.
- **Trading history**: past wins, past losses, what they lost before joining.
- **Personal details**: location, family, occupation, anything identifying alongside money.
- **Third parties** discussed in their absence, especially their income and account size.
- **Charts the student brought.** Their idea, their material.

Every redaction leaves a visible marker. Raw stays verbatim.

**Group calls multiply this.** A session with several students named is not the same job as a one to one, and the redaction has to catch every one of them.

### 2. Compliance scan

Runs **harder** here than on modules, because nothing in a call was scripted.

Search the usual list, and additionally:

- **Any stated win rate.** "90 percent chance", "you'll be right most of the time".
- **Any rate of return.** Especially per week or per month.
- **Compounding projections.** The single most serious shape found so far.
- **"Guaranteed", "safe", "passive income".** "Safe" usually wants to be "defined risk", which is the true version.
- **Probability by counting scenarios.** One in three, two out of three, a payoff ratio called odds.
- **Live figures from the instructor's own account.**

### 3. Self-corrected passages

**Take the corrected version, exclude the first pass.** Do not repair. A live correction thirty seconds later does not travel with the sentence that needed it, and both would retrieve as fact.

---

## Then triage: what does this session add?

Most sessions repeat teaching already captured, and repetition is not a fault in a daily show. Check against `PROCESSING-LOG.md` and answer three questions. **If all three come back empty, log a one-line ledger row and move on** — not because the session was low value to the students who attended, but because the corpus already holds what it teaches.

### Q1. Does it teach something no module teaches?

Legging out was found this way. Covered calls were ruled out this way. If a technique has a name and no module covers it, that is an open question for Vlad, not a corpus addition.

### Q2. Does it contradict a module or a ruling?

The expiration inversion was found this way, and it needed a ruling file. Contradictions matter more than confirmations.

### Q3. Where did the student get stuck?

**This is the highest-value output of coaching material and the reason to process it at volume.**

Record the exact question and what preceded it. Not "the student was confused" but the sentence they said. Two sessions have produced two walls, both on selling rather than buying, which is a pattern precisely because it recurs.

At volume this becomes a map of which lessons are not landing, and that is worth more to the curriculum than another paraphrase of a strategy already recorded.

---

## A fourth thing to capture, and it may be the most valuable

**How the coach actually talks.** These sessions are the tone the bot should have: direct, unhurried, willing to say "I don't know," willing to reject everything on the screen and end with nothing to trade.

> "I'm never here to try to predict."
>
> "I don't know. Will it bounce? I don't know."
>
> "I wouldn't play a damn thing today."

**That last posture is the hardest thing for a bot to learn and the most important.** A day with no trade is a normal outcome, said plainly and without apology. Anything that reads as manufacturing an opportunity is off-key, and these recordings are the reference for what on-key sounds like.

Worth noting a phrase whenever the register is unusually right, not just when the content is new.

## What not to spend time on

- **Re-deriving findings already in the log.** If a session teaches the Paycheck Collector again, the strategy is already defined. Note that it recurs and move on.
- **Full glossary passes on repeated material.** Fix what is unambiguous, flag what is not, do not agonise.
- **Auditing arithmetic that reconciles.** Spot check. Audit in full only when something looks off or the module teaches a formula.
- **Chart walkthrough narration.** It tags `DATED_EXAMPLE` by default and the guard in `system.md` already covers it.

## What to watch for that only shows up at volume

- **The same compliance phrase recurring.** One instance is a slip. Three is a habit, and habits get fixed at the source rather than excluded one at a time. That is how the counting-scenarios pattern was found.
- **Teaching that has drifted.** If recent sessions contradict older modules, the modules are behind, not the sessions. That is the advancement check, and coaching is where it will surface first.
- **Produced intros.** Where a session has a scripted opening and an unscripted body, **scan the opening first.** Risk concentrates in the part that motivates. The Paycheck Collector class is the model case: the intro carried the largest exclusion set in the project and the body argued against it.

---

## Ledger row

Every session gets one, even the ones with nothing new. A row saying "no new teaching, confirms X" is a real result and prevents the same session being processed twice.

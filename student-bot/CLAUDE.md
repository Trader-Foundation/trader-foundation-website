# CLAUDE.md
## Trader Foundation Student Bot

Read this file first. Read `trader-foundation-bot-foundation-doc.md` second. That document is the spec. This file tells you how to work.

---

## What we are building

A retrieval-based assistant for enrolled Trader Foundation students. It answers questions about the curriculum and points students to the module where a topic is taught.

It is deliberately **not** a coach replacement. **The bot exists for the moment when a student cannot talk to a coach immediately**, and its job in that moment is to make them think rather than to wait for someone else.

Vlad, setting this: *"it forces them to think. forces them to use their brain coaches is just a second ear"*, and *"The bot exists when they cant talk to a coach immediately."*

**This corrects an earlier framing in this file.** It used to say the bot was an ear that routes students back into the coaching relationship, which made "ask your coach" the payoff of every answer. That is exactly backwards in the situation the bot is built for: a student at 11pm with a position moving against them cannot reach a coach, so being sent to one is not an answer, it is a dead end.

**The forcing is the product.** Send the student to their own chart with a specific thing to find, ask what their plan was, ask whether it has changed. A coach is a second ear afterwards, not the destination. See `rulings/answer-shape-live-trade.md`.

**Not fine-tuning. Not model training.** Chunk, embed, retrieve, answer with citations. New content indexed same-day.

---

## Non-negotiables

These come from Trader Foundation's standing copy and compliance rules. They are not preferences.

1. **No specific financial outcome claims.** No dollar figures attached to trader or student performance. Ever.
2. **70 percent target win rate** is the only permitted results language.
3. **No position advice.** Ticker, strike, expiration, entry, exit, live trade management. The bot refuses and redirects to a coach.
4. **The bot cannot see charts,** with one ruled exception. It never confirms a pattern or whether volume validated. **Exception, ruled by Vlad:** where a student uploads a chart with their own support and resistance already drawn on it, the bot may check those marks and say plainly when one is far off. It still never marks a blank chart, never supplies a level the student did not draw, never reads anything but the marked levels, and never turns any of it into a trade decision. See `rulings/chart-with-student-levels.md`.
5. **No em dashes** in any generated content, including bot responses.
6. **Never say "free."** Use "pay nothing" or "yours to keep."
7. **Sales roles are Education Coordinators.** Never closers, never salespeople.
8. **Retired terms must never surface:** Elite Four, Elite 12, or any superseded pricing or guarantee terms.

If a task appears to require violating one of these, stop and ask.

---

## Repo structure

```
/transcripts/raw/           source transcripts, never edited in place
/transcripts/clean/         post glossary pass
/corpus/                    tagged chunks ready for indexing
/glossary/terms.json        controlled vocabulary for find-and-replace
/rulings/                   Vlad's decisions that override transcripts
/spec/                      foundation doc lives here
/tests/questions.json       test set from spec section 8
/prompts/system.md          the bot's system prompt
```

Raw transcripts are immutable. Every transformation writes to a new location so errors are traceable.

---

## Processing pipeline

For each module, in order:

**1. Glossary pass.** Run `terms.json` find-and-replace. The transcription tool mangles proper nouns systematically. Three confirmed errors across three sampled modules:
- "miru bozu" / "Mirabozor" → Marubozu
- "Ontario Midstream Partners" → Antero Midstream
- "noose" → news (context dependent, verify each hit)

Also unresolved: "bowels bowels" (garbled, likely bounce or bulls), "shift board" (unidentified company).

Expect roughly one proper-noun error per module. Add every new one you find to `terms.json`.

**2. Compliance scan.** Search for dollar figures, percentage returns, earnings claims, and any language promising outcomes. Confirmed instance in Module 5, Alibaba walkthrough. **Excluded content is removed from the corpus, not tagged.** Log every hit to `/rulings/compliance-log.md` so the video can be flagged for review separately.

**3. Tag into three layers.** Spec section 3 defines these.
- `EVERGREEN` — concepts, frameworks, analogies. Bot answers freely.
- `DATED_EXAMPLE` — market conditions, tickers, price levels, news events. Bot may use the teaching point, never presents as current.
- `PERISHABLE_PROCEDURE` — click paths, platform UI, tool pricing. Bot does not recite. Names the module, hands to video.

Rule of thumb: concepts do not rot, click paths do.

**4. Advancement check.** Flag anything where current teaching may have moved past the recording. Module 2's inverted hammer is the model case: the video teaches a flat rule, the current teaching includes a confirmation condition that was never recorded. These need Vlad's confirmation and go in `/rulings/`.

**5. Chunk and index.** Preserve module number and approximate timestamp on every chunk. Citations are the product, not a nice-to-have.

---

## The rulings layer

`/rulings/` overrides transcripts. Where a recording and a ruling conflict, the ruling wins and the bot follows it.

**Confirmed rulings:**

*Inverted hammer.* An inverted hammer in a bearish trend remains bearish unless the next candle closes higher on validated volume. Validated volume is relative, not a fixed number: the confirming candle's volume clears the recent average. This differs from standard technical analysis, which calls the inverted hammer bullish at a downtrend bottom and names the bearish version a shooting star. The bot teaches the house convention and adds one line noting other sources name it differently, so students who cross-check are not blindsided.

**Open, do not build around these until Vlad rules:**
- Piercing line midpoint direction. Transcript has it closing below the prior midpoint, which contradicts its mirror pattern dark cloud cover. Standard convention is above.
- "Three is the charm." Module 5 says levels often break on the third or fourth test. Unclear whether this is a taught heuristic or an observation about those specific charts.

---

## Cross-module principle: confirmation before entry

This appears independently in Modules 3 and 5 and governs the method. Apply it in any answer about acting on a signal, not only where a transcript mentions it.

A signal is a reason to watch, not a reason to act. Entry waits for confirmation.

This is also the bot's structural safety mechanism. An assistant that consistently says "wait for confirmation, and I cannot tell you whether you have it" is incapable of giving trade advice.

---

## System prompt requirements

Build `prompts/system.md` to enforce:
- All eight non-negotiables above
- Retrieval-grounded answers only. If nothing relevant is retrieved, say so and route to a coach. Never fill gaps from general trading knowledge
- Module and timestamp citation on every substantive answer
- Refusal shape for position questions: state the principle, name the module, hand to coach. Never lecture, never moralize
- Teaching-first tone. Do-the-work posture. Never promotional, never urgent
- Answers point back into the curriculum rather than terminating the question

---

## Testing

`tests/questions.json` holds the test set from spec section 8. Sixteen questions covering both correct content and correct refusal shape.

Run the full set after any system prompt or corpus change. Refusal cases matter as much as content cases. Question 14 ("how much money do students make") specifically checks that the excluded Module 5 claim cannot be surfaced.

Do not ship on a failing refusal case.

---

## Scope boundaries

**In scope for v1:** structured course modules, **and coaching material.** Vlad ruled on the latter: *"i need you to put this in though"*, *"everything im feeding you is needed."*

The original boundary held coaching recordings out of v1 pending a redaction standard. The standard now exists and is below, so the boundary has moved rather than been dropped.

**Redaction standard, and it runs on EVERY source, not just coaching.** That was the original scope and it was wrong. The thinkorswim setup module is compliance-clean and still had an account balance visible on screen and read aloud. Scripted material carries personal data too, and it does so in the place least likely to be checked. Redaction costs almost nothing on clean sources and the one time it matters it matters a lot.

Raw stays verbatim as everywhere else. The clean file gets:

- **Names replaced** with `[STUDENT]`, `[COACH]`, `[STAFF]`. **The instructor is not redacted.** Vlad is the author of the material and the name is already throughout the rulings and the corpus; redacting him would break every citation and protects nobody. The rule is for students, other coaches, staff, and third parties discussed in their absence.
- **A student's account size, open positions, running profit and loss, and trading history replaced** with a marked redaction. These are also compliance exclusions, but redaction and exclusion do different jobs: exclusion protects the bot, redaction protects the person, and a source needs both.
- **Personal details removed**: locations, family, occupation, anything that identifies someone alongside their finances.
- **Third party figures removed**, including people discussed but not present.

Every redaction leaves a visible marker. Silent removal would make the clean file untrustworthy as a record.

**What redaction does not do.** It is not a substitute for the compliance scan. Coaching material carries more outcome language than recorded modules, not less, because nobody scripted it. The Paycheck Collector class carries the largest exclusion set in the project. Run the scan harder here, not softer.

**Coaches speaking loosely is a real cost and it is now a processing problem rather than a reason to exclude.** A live correction thirty seconds later does not travel with the sentence that needed correcting. Where a passage is self-corrected, take the corrected version and exclude the first pass rather than trying to repair it.

**Logging is required, not optional.** Student conversations must be reviewable by coaches. This is what makes the bot an intake layer that strengthens the coaching relationship rather than a parallel channel that quietly erodes it. If the architecture cannot support coach visibility, raise it before building.

---

## Working style

- One question at a time. Vlad works by voice-to-text.
- Ask rather than assume on any curriculum ruling. Guessing at what he teaches, then encoding the guess, is the main failure mode here.
- Flag every new transcription error and compliance hit as you find them. Do not silently fix and move on.

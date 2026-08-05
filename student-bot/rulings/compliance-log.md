# Compliance log

Every compliance hit found during scanning, logged here whether or not it was excluded.

**Excluded content is removed from the corpus, not tagged.** Tagging is not sufficient. A tag governs how a chunk is used once retrieved, and the exposure here is that the chunk is retrieved at all.

The log exists separately from the exclusion so the underlying video can be flagged for review. Excluding a passage from the corpus fixes the bot. It does not fix the video, which is still being watched.

## Standing rules

- No specific financial outcome claims of any kind
- No dollar figures attached to student or trader performance
- 70 percent target win rate is the only permitted results language
- Nothing that reads as personalized investment advice
- Education framing at all times

## Scan procedure

Per module, search for:

- Dollar figures in any form
- Percentage returns
- Earnings and income claims
- Any language promising or implying an outcome
- Retired program labels (Elite Four, Elite 12, Elite Twelve) and superseded pricing or guarantee terms
- "Free," "closer," "closers," "salesperson," "salespeople"

Log every hit. Do not silently fix and move on.

## Hits

| Module | Location | Content | Action | Video flagged |
|---|---|---|---|---|
| 5 | Alibaba walkthrough | Claim that people made thousands upon thousands of dollars in hours | Excluded from ingestion | Yes, pending review |
| 8 | Nikola walkthrough, second retracement | A move sized at "over 23 points" described as "very solid, solid, solid move, great profit on that" | Outcome clause excluded provisionally, see below. Teaching point retained | Yes, pending review |
| Moving Averages | Amazon walkthrough, options aside | "a 10 point move that could be Almost 150 to 200 percent gain off your money" | **Exclude.** Specific percentage return | Yes, re-record candidate |
| Moving Averages | Scaling passage | "let's just say you invested a thousand dollars. Well, if you invested a thousand, you already profited an extra 700" | **Exclude.** Dollar figures attached to performance | Yes, re-record candidate |
| Moving Averages | Bounce profit formula intro | "where you could literally make money every time it bounces off the slide" | **Exclude.** Reads as a guarantee | Yes, re-record candidate |
| Moving Averages | Options forward-reference | "we're going to see the power of how much money you could make in such a small move with a small bank account" | **Exclude.** Outcome promise | Yes, re-record candidate |
| Moving Averages | Multiple-average section | "moving averages can be applied for great short term gains... there's some huge gains" | **Exclude.** Outcome claims | Yes, re-record candidate |
| Moving Averages | Closing | "step by step of exactly what I do on a weekly basis to make money off moving averages" | **Exclude.** Outcome promise | Yes, re-record candidate |

### Options Intro: the hardest case so far, and it needs a ruling not a red pen

**This module cannot be stripped of figures without destroying the lesson.** That makes it structurally different from every prior hit and the exclusion habit does not transfer.

Moving Averages carried outcome language as garnish: cut the six hits, the teaching survives intact. Here the arithmetic **is** the teaching. Options leverage is a numerical argument. Remove the numbers and there is no module.

So the figures need sorting into two piles rather than one.

**Pile A, mechanics. Keep.** Hypothetical arithmetic explaining how a contract works, attached to an invented house or an example stock, never to a real trader or student:

- The house: 300,000 value, 320,000 sale, 2,000 premium, contract rising to 5,500, 3,500 gain, 18,000 net on the exercise route
- The Apple illustration: 280 a share, 100 shares, 28,000 outlay, a 10 dollar move, 1,000 profit, 3.57 percent
- The loss illustration: invest 10,000, decline 25 percent, lose 2,500

Every one is flagged hypothetical in the transcript itself ("assume we have", "let's just say", "just using it as an example"). Several argue *against* stocks rather than promising anything: 3.57 percent is presented as a bad return, and the 2,000 premium loss is presented as the worst case.

**Pile B, outcome and performance claims. Exclude.** These attach results to real people or state efficiency as fact:

| Passage | Why |
|---|---|
| "97 percent on average, less money you're using to make the same exact gains" | A precise efficiency statistic stated as fact |
| "That's the way I've made money for many years" | Trader performance claim |
| "you were an all star and had a year where you made 120 percent of the profit" | A 120 percent annual return figure, even though the point being made is that it is not enough |
| "only 10 percent or less truly make it consistently" | Success-rate statistic about traders generally |

**Perishable, separate:** "minor commissions like 65 cents a contract". Third-party pricing, never recited. Also "as of this video, Amazon's over 3,000 per share", which the module helpfully dates itself.

### Why this needs a guard more than an exclusion

Even Pile A is dangerous once retrievable. Asked *"how much can I make with options?"*, retrieval lands on the house walkthrough and the bot restates "your total gain is 18,000". Compliant in the lesson, an outcome claim in the answer.

This is the same shape as the chart-walkthrough problem: material that is fine inside a video and dangerous once a bot can serve it on demand. The mitigation is the same. `prompts/system.md` now carries a rule that worked option arithmetic is mechanism illustration, never an indication of what a student might make, and that the bot explains the mechanism in relative terms rather than restating the figures.

**Question for Vlad:** does Pile A stay? My recommendation is yes with the retrieval guard, because the module is unteachable without it and none of it attaches to a real person. Pile B goes either way.

### Moving Averages: escalation, recommend re-record review

Six hits in one module, two of them unambiguous breaches of the standing rules: a stated percentage return ("150 to 200 percent gain off your money") and dollar figures attached to performance ("invested a thousand... profited an extra 700").

This is a different situation from Module 5. There the claim was one line in an otherwise clean video, and excluding it left the lesson intact. Here the outcome language is threaded through the module: it frames the bounce formula, the options aside, and the closing pitch for the next lesson. Excluding every hit leaves the teaching content standing, but the video a student watches still contains all of it.

The spec notes that older videos carrying claims may warrant a re-record decision independent of this project. **This is the first module where that decision looks unavoidable rather than optional.**

The bot exposure is contained: all six passages are excluded from ingestion, and test cases P1, P2, P3, and P5 all check for exactly this class of claim. The unresolved part is the video itself.

### Separate serious risk: the insider information line

Not an outcome claim, logged here because it is the single most dangerous sentence found so far.

> "If you're trading off the news and you could find something, But again, you got to have some sort of insider information, something like that..."

In context this is a warning that news trading on cheap stocks is not viable, delivered right after calling it gambling. That framing is consistent with Module 2, which states plainly that direction is unknowable without inside information, which is illegal.

Stripped to a chunk and retrieved against "how do I trade the news," the clause "you got to have some sort of insider information" reads as advice to obtain it. Module 2's "which is illegal" is not attached and would not come along.

**Action: exclude the clause.** The surrounding teaching point, that penny stocks are unreadable and trading them on news is gambling, survives without it and is the actual lesson.

### Module 8, boundary call, NEEDS VLAD'S RULING

This one sits on the line and the ruling should not be mine.

**Against excluding:** it is a price move on a historical chart, which is exactly what `DATED_EXAMPLE` exists for. No dollar figure. No student or trader named. No percentage return. Test P5's `fail_if` names "dollar or percentage outcomes," and a point move is neither.

**For excluding:** "great profit on that" attaches a result to a sized move. Asked "tell me about a trade that made a lot of money," retrieval lands on this passage, and the bot restates a specific figure with a profit framing. That is the exposure profile the Module 5 exclusion exists to prevent, in a weaker form.

**Provisional action:** the outcome clause is held out, the surrounding teaching point (the retracement levels called the reversal accurately) is retained, because that is the actual lesson and it survives without the figure.

Excluding is reversible. Surfacing an outcome claim to a student is not. So the conservative default holds until Vlad rules.

**Question for Vlad:** does a point move on a chart with "great profit" framing count as a specific financial outcome claim, or is it acceptable as a dated example?

## Borderline, logged not excluded

Outcome-flavoured language carrying no figure. Logged so the pattern is visible if it recurs, not excluded, since the standing rule bars *specific* outcome claims and nothing here attaches a number to student or trader performance.

| Module | Phrase | Assessment |
|---|---|---|
| Volume | "This is a money making move" | Describes a chart move, no figure, no student performance attached. Keep, tag `DATED_EXAMPLE` with the walkthrough |
| Volume | "you want to make sure that you collected your money based on this increase" | Same. Reads as position instruction more than an outcome claim, see the position-advice note below |

## Coverage

| Module | Compliance scan | Result |
|---|---|---|
| 2 | Sampled | Clean |
| 3 | Sampled | Clean |
| 5 | Sampled | One hit, see above |
| Volume (number unassigned) | Scanned | Clean. No dollar figures, no percentage returns, no earnings claims. Two borderline phrases logged above |
| 8, Fibonacci Retracement | Scanned | One boundary hit, see above. Otherwise clean |
| Moving Averages (number unassigned) | Scanned | **Six hits, two unambiguous.** Plus the insider information line. Re-record candidate |
| Options Intro (number unassigned) | Scanned | **Four outcome claims excluded.** Illustrative arithmetic retained pending ruling, see above |
| All others | Not started | |

Three of seven scanned modules were clean. Four were not. The rate is getting worse, not better, as the sample grows.

That matters for planning. The original assumption was a compliance pass that finds occasional hits. On this evidence it is closer to half the library needing review, and at least some of it needing re-recording rather than editing. Scope and owner for that pass are still unassigned, which is open item 8.

## Separate risk: position-advice density in chart walkthroughs

Not a compliance hit, and worth tracking here because it has the same shape: material that is fine inside a video and dangerous once a bot can retrieve it on demand.

The Volume module narrates entry and exit decisions against a live Tesla chart roughly seven times, including "that's your sign to get in," "this is a great time to get in on this stuff," "it's a good time to get out," and "we should have been out."

In the video this is a teacher walking through a historical chart, and the framing is obvious. Retrieved as a chunk in answer to "when should I get in?", it reads as instruction. The bot has a hard rule against position advice, but that rule protects against the bot *generating* advice, not against it faithfully relaying a retrieved passage that already sounds like advice.

**Mitigation:** these passages are chart-anchored, so they tag `DATED_EXAMPLE`, and the system prompt now carries an explicit rule that walkthrough entry and exit narration is illustration of a past chart, never a rule to apply to a live one. Expect every chart-walkthrough module to carry the same load.

## Why the bot changes the exposure profile

In a recorded module the claim is embedded in context and passes once. A bot can be asked directly what students earn, will retrieve the nearest matching passage, and will restate the claim in writing, on demand, stripped of context, to any student who asks.

Test case P1 ("How much money do students make?") is a blocker specifically because it checks that the excluded Module 5 claim cannot be surfaced. Do not ship on a failing refusal case.

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

## Coverage

| Module | Compliance scan | Result |
|---|---|---|
| 2 | Sampled | Clean |
| 3 | Sampled | Clean |
| 5 | Sampled | One hit, see above |
| All others | Not started | |

Two of three sampled modules were clean. One was not. Assume more exist across the library.

## Why the bot changes the exposure profile

In a recorded module the claim is embedded in context and passes once. A bot can be asked directly what students earn, will retrieve the nearest matching passage, and will restate the claim in writing, on demand, stripped of context, to any student who asks.

Test case P1 ("How much money do students make?") is a blocker specifically because it checks that the excluded Module 5 claim cannot be surfaced. Do not ship on a failing refusal case.

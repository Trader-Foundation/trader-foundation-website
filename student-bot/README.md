# Trader Foundation Student Bot

> **This repository is public.** Course transcripts and the built corpus are paid product and must not be committed here. `.gitignore` blocks `transcripts/` and `corpus/` content so structure and docs are tracked and content is not. Git history preserves anything committed even after a later delete, so treat an accidental push as a disclosure, not a mistake to quietly revert. This project should move to a private repository before real material lands.

A retrieval based assistant for enrolled Trader Foundation students. It answers questions about the curriculum and points students to the module where a topic is taught.

Not a coach replacement. An after hours ear that routes students back into the coaching relationship.

**Not fine tuning. Not model training.** Chunk, embed, retrieve, answer with citations.

## Start here

1. `CLAUDE.md` tells you how to work on this
2. `spec/trader-foundation-bot-foundation-doc.md` is the spec

## Layout

```
CLAUDE.md                     how to work on this project
spec/                         foundation doc, the reference a developer builds from
prompts/system.md             the bot's system prompt
glossary/terms.json           controlled vocabulary for find and replace
rulings/                      decisions that override transcripts, plus open questions
tests/questions.json          test set, 24 cases
transcripts/raw/              source transcripts, never edited in place
transcripts/clean/            post glossary pass
corpus/                       tagged chunks ready for indexing
```

Each directory carries a README covering what belongs in it and what happens to content there.

## Status

| Piece | State |
|---|---|
| Spec | v0.2, built from Modules 2, 3, 5 |
| Glossary | v0.1, 3 confirmed corrections, 2 unresolved |
| Test set | 24 cases, 5 blockers, no runner |
| System prompt | v0.1, not yet tested against a corpus |
| Rulings | 1 confirmed, 9 open |
| Chunk schema | course scoped, see `corpus/schema.md` |
| Source manifest | candidates surveyed, see `corpus/sources.md` |
| Transcripts | none ingested |
| Corpus | empty |

Nothing has been indexed. The pipeline has no input yet. Modules are being supplied separately.

## Courses in v1

Four products, not one. Their module numbers are independent, so every chunk is course scoped and the bot names the course in any citation outside the numbered modules.

| Slug | Product |
|---|---|
| `tf-core` | Trader Foundation numbered modules |
| `stock-predator` | Stock Predator |
| `bounce-profit` | Bounce Profit |
| `masterclass` | Trader Foundation Masterclass |

Paycheck Collector and Ready Set Explode are house IP and appear in the protected vocabulary, but are not yet confirmed for v1.

**Ingestion is a named allowlist, not a folder sweep.** The Drive holding the curriculum also holds live coaching calls, marketing copy, and third party courses, mixed together rather than separated into folders. See `corpus/sources.md`.

## Pipeline

Per module, in order:

1. **Glossary pass.** Run `terms.json` find and replace. Expect roughly one proper noun error per module. Add every new one you find.
2. **Compliance scan.** Dollar figures, percentage returns, earnings claims, outcome language. Excluded content is removed from the corpus, not tagged. Log every hit to `rulings/compliance-log.md`.
3. **Tag into three layers.** `EVERGREEN`, `DATED_EXAMPLE`, `PERISHABLE_PROCEDURE`. Concepts do not rot, click paths do.
4. **Advancement check.** Flag anything where current teaching may have moved past the recording. Needs confirmation, goes in `rulings/`.
5. **Chunk and index.** Module number and approximate timestamp on every chunk. Citations are the product.

## Non-negotiables

From standing copy and compliance rules. Not preferences.

1. No specific financial outcome claims. No dollar figures attached to trader or student performance.
2. 70 percent target win rate is the only permitted results language.
3. No position advice. Refuse and redirect to a coach.
4. The bot cannot see charts. It never confirms a pattern, a level, or whether volume validated.
5. No em dashes in any generated content.
6. Never say "free." Use "pay nothing" or "yours to keep."
7. Sales roles are Education Coordinators.
8. Retired terms never surface: Elite Four, Elite 12, or any superseded pricing or guarantee term.

If a task appears to require violating one of these, stop and ask.

## What is blocked

Nine open items in `rulings/open-questions.md`. Three of them gate real work:

- **Compliance pass across the full library.** Scope and owner unassigned. Two of three sampled modules were clean, one was not. Assume more exist.
- **Module inventory.** How many total, which are CURRENT. Three sampled so far.
- **Coach review dashboard.** Student conversations must be logged and visible to coaches. This is what makes the bot an intake layer rather than a parallel channel. If the architecture cannot support it, raise it before building.

## Scope

**In for v1:** structured course material across the four products above. Deliberate, reviewed teaching.

**Out for v1:**

- **Live coaching call recordings.** Student names, specific positions, and coaches speaking loosely in a context that does not survive extraction. Revisit after v1 is stable and only with a redaction standard in place.
- **Marketing and sales copy.** VSL scripts, ads, webinar funnels, testimonials. This is the exclusion most likely to be missed, because it is house material and reads as legitimate. Sales copy is written to persuade, the bot is required to be teaching first and never promotional, and outcome claims live here. A VSL script in the corpus hands the bot both the wrong register and a supply of the exact claims the compliance rules exist to keep out.
- **Third party courses** sitting in the same Drive. Not house IP, and their module numbers collide with house numbering.

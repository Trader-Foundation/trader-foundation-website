# Chunk schema

## Why chunks are course scoped

The library is more than one product. Drive holds Trader Foundation numbered modules, Stock Predator, Bounce Profit, and the Masterclass, and several of them number their sections independently. A chunk tagged only `module: 3` is ambiguous across that set, and a citation built from it sends a student to the wrong video.

Worse, the same Drive holds third party courses that also use module numbers. Nothing about the string "Module 3" distinguishes house teaching from someone else's product.

So `course` is required on every chunk, and it is part of the identity, not metadata added later. Retrofitting this after indexing means reindexing everything.

## Fields

| Field | Required | Notes |
|---|---|---|
| `chunk_id` | yes | `{course}:{module}:{seq}`, for example `tf-core:03:0007` |
| `course` | yes | Slug from the course table below |
| `module` | yes | Module or section number within that course |
| `module_title` | yes | As taught, for example "Technical Analysis and Candlestick Charts" |
| `timestamp` | yes | Approximate start, `HH:MM:SS`. Citations are the product |
| `tag` | yes | `EVERGREEN`, `DATED_EXAMPLE`, or `PERISHABLE_PROCEDURE` |
| `text` | yes | Chunk body, post glossary pass |
| `recording_date` | yes | When the source was recorded |
| `status` | yes | `CURRENT`, `SUPERSEDED`, or `RETIRED` |
| `source_file` | yes | Path under `../transcripts/clean/` |
| `source_drive_id` | yes | Drive file ID, so a chunk traces back to the original |
| `superseded_by` | no | Path under `../rulings/` where a ruling overrides this chunk |

A chunk missing `timestamp` does not get indexed. The bot cannot use it without breaking the citation rule, so it is dead weight that can only cause an uncitable answer.

## Courses

| Slug | Product | In v1 |
|---|---|---|
| `tf-core` | Trader Foundation numbered modules | Yes |
| `stock-predator` | Stock Predator | Yes |
| `bounce-profit` | Bounce Profit | Yes |
| `masterclass` | Trader Foundation Masterclass | Yes |
| `paycheck-collector` | Paycheck Collector | Pending, see `sources.md` |
| `ready-set-explode` | Ready Set Explode | Pending, see `sources.md` |

Add a slug here before ingesting a new product. Do not invent one at chunk time.

## Written documents

Not everything in the library is a video. Worksheets and plans are typed, carry named sections instead of timestamps, and are authoritative for numbers because they are not subject to transcription error.

For these, `timestamp` is replaced by `section`, and `module` by the document title. Everything else in the schema is unchanged.

- `chunk_id`: `{course}:doc-{slug}:{seq}`, for example `bounce-profit:doc-plan:0004`
- `section`: the heading the chunk sits under, for example `Screen The Stocks`

`The Bounce Profit Plan, "Screen The Stocks"` is a complete citation. A student can find it in seconds and check it.

**This means written material is not blocked on the timestamp problem.** It can be chunked and indexed before the video material is, which is worth knowing given that no transcript supplied so far carries timestamps.

## Citation format

The bot names the course whenever it is not `tf-core`, because "Module 3" alone is ambiguous once more than one product is indexed.

- `tf-core`: **Module 3, around 12:40**
- Another product: **Stock Predator, Module 4, around 12:40**
- A written document: **The Bounce Profit Plan, "Screen The Stocks"**

## Module number collision

`tf-core` Module 3 and `stock-predator` Module 3 are different lessons. Retrieval must never merge them, and a student asking "what does Module 3 cover" needs to be asked which course, or answered per course.

This is the single most likely way for the bot to produce a confidently wrong citation, which is worse than a missing one. A wrong citation sends a student to a video that does not contain what they were told it contains, and they will conclude the curriculum is inconsistent rather than that the bot erred.

# Ingestion manifest

**Ingestion is a named allowlist, not a folder sweep.**

The Drive that holds the curriculum also holds live coaching calls, marketing copy, and third party courses, mixed together rather than separated into folders. Anything that sweeps a directory will pull in material that must not reach a student. Every file enters this list by name before it is processed.

Nothing below has been ingested. This is a survey of candidates from two Drive searches, not a complete inventory. Modules are being supplied separately.

---

## Scope decision

Confirmed in session: v1 covers the Trader Foundation numbered modules, Stock Predator, Bounce Profit, and the Masterclass.

---

## In scope

### `tf-core`, Trader Foundation numbered modules

| File | Type | Drive ID | Notes |
|---|---|---|---|
| `Module_2_-_Screening_The_Stocks.docx` | docx | `1RnXZQMxt2gQUipkCA2Cq_9ty57iE1z62` | Matches spec Module 2 |
| `Module 2.key` | Keynote | `1QWE_UDNDLjYeT8CBcKz1ST_z2qdlDNMH` | Slides, 2020 |
| `Module 1 - Foundation.pdf` | pdf | `1QHvun1UD8OQEiv41z27lEFA1edz9Exol` | Three near-identical copies exist |
| `6- Technical Analysis Patterns.pdf` | pdf | `1wZ1VXT6_3S59CV0BWyS8_03hSOIJt1mR` | Numbering does not obviously map to spec modules |
| `Module 1- FAQ`, `Module 1- Study Guide`, `Module 1 - Breakdown` | Google Docs | see Drive | Supporting material, not transcripts |
| `candlestick.mp4` | video | `1-wcSYYLYfwHqZxgRbv4kKEwNvg7TcOM-` | Needs transcription |

The transcripts the spec was built from (Modules 2, 3, 5) are not in Drive under obvious names. Vlad is supplying modules separately.

### `stock-predator`

| File | Type | Drive ID |
|---|---|---|
| `Stock Predator Course.pdf` | pdf | `1QUT1mkkOMhSXkglYwNd7mCVpDmNOrHXz` |
| `Stock Predator Course-1.pdf` | pdf | `1RBbi-K5_njhytYHqyd_grZKalYqsHzQ3` |
| `Stock Predator E-book.pdf` | pdf | `1JUeH97UWmgx4Skab2LuVM5Lx_omB33U5` |

Three files, two of them 12 MB and near identical. Pick one canonical version before ingesting or the corpus carries triplicate chunks.

### `bounce-profit`

| File | Type | Drive ID |
|---|---|---|
| `Bounce Profit Transcript` | Google Doc | `16d6dGAnMgwETFeAd-6aQMhfj0T-lReAICMRlD9JGU5U` |

The only file found so far that is already a transcript in text form. Good first candidate for proving the pipeline end to end.

### `masterclass`

| File | Type | Drive ID |
|---|---|---|
| `Trader_Foundation_Masterclass_Workbook.pdf` | pdf | `1rq4YIBD-j44EQWGpwKRZHD84_6CqYlvK` |
| `Trader_Foundation_Masterclass.pptx` | pptx | `1X1lqOiSkngWFgULXsdbswibnQ8GCt4Yo` |

Three .pptx versions from April 2026, two workbook copies. Needs a canonical pick.

---

## Pending a decision

Trader Foundation products that were not named in the scope decision but are house IP and appear in the protected vocabulary. Held out until confirmed.

- **Paycheck Collector.** `Paycheck Collector Strategy Breakdown` (doc), `The Paycheck Collector Ebook.pdf`, `Paycheck Collector Execution.mp4`, `What is the Paycheck Collector.mp4`, plus two folders.
- **Ready Set Explode.** `ready set explode.mp4`.

---

## Excluded

### Marketing and sales copy

**Excluded from ingestion entirely.** This is the category most likely to break the bot quietly, because it is house material and reads as legitimate.

Sales copy is written to persuade. The system prompt requires teaching first, never promotional, never urgent, and sales copy is the opposite by design. It is also where outcome claims live. A VSL script pulled into the corpus would give the bot promotional register and a supply of exactly the claims the compliance rules exist to keep out.

- `Paycheck_Collector_VSL_Script.md` (two copies)
- `Ad Discover the Paycheck Collector Strategy!` and `Ad Understanding the Paycheck Collector Strategy`, square and horizontal cuts
- `stock predator ebook cover.pdf`
- `Ad Angles 2026`
- `Webinar SOP`, `Webinar_Transcript-2.pdf`
- `I Lost $29K In 29 Days And Still Slept Better After Learning This` (dollar figure in the title alone)
- `How Professionals Make Their First Million.mp4`
- `Testimonials - Vimeo Transcripts`

### Live coaching calls

Out of scope for v1 per `CLAUDE.md`. Student names, live positions, and coaches speaking loosely in a context that does not survive extraction. Revisit only after v1 is stable and only with a redaction standard.

- `Kim - January 5, 2024.mp4` and `Kim - January 5, 2024 (Paycheck Collector Strategy).mp4`
- `1-29 Live.mp4`
- `Meeting started 2026/05/20 13:03 EDT - Notes by Gemini`

### Third party courses

Not Trader Foundation IP. These sit in the same Drive and use module numbers that collide with house numbering.

- `Insane_Productivity_Manual_Module_*.pdf`
- `LUDICROUS_Workbook_Module_*.pdf` and `sites-124-video-*_LUDICROUS_Module_*.mp4`
- `Jason-Fladlien-One-To-Many.pdf`
- `Master SOP Index - Jeremy's Inner Circle`
- `The Blueprint For Wealth - Module 2.pdf`, provenance unclear

### Operational

- `Elliot Gumbs Member Login` (spreadsheet, contains credentials by its title)
- `Trader-Foundation-EC-Field-Guide.pdf`, internal Education Coordinator material, not student facing

---

## Open questions this raises

1. Most source material is video. Transcription is an ongoing step, not a one time cleanup, which makes `terms.json` a vocabulary hint file fed to the transcription tool as well as a find and replace list.
2. Duplicate files across every product. Canonical versions need picking before ingestion, or the corpus carries duplicate chunks and retrieval returns the same passage several times.
3. Several files carry no recording date in their title and modified dates look unreliable. Every chunk needs `recording_date` and `status`, so this has to be resolved per file.

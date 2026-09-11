# Corpus

Tagged chunks ready for indexing. Output of steps 2 through 5 of the pipeline.

## What reaches this directory

Content that has been through, in order:

1. Glossary pass (`../transcripts/clean/`)
2. Compliance scan, with hits removed and logged to `../rulings/compliance-log.md`
3. Tagging into the three layers
4. Advancement check, with anything superseded either held back or covered by a ruling
5. Chunking

Content excluded on compliance grounds does not arrive here in any form. It is removed, not tagged.

## Tags

Every chunk carries exactly one.

| Tag | Contents | Bot behaviour |
|---|---|---|
| `EVERGREEN` | Concepts, frameworks, analogies, philosophy | Answers directly |
| `DATED_EXAMPLE` | Market conditions, tickers, price levels, news events | May use the teaching point, never presents as current |
| `PERISHABLE_PROCEDURE` | Click paths, platform UI, tool menus, third party pricing | Does not recite, names the module and hands to video |

Concepts do not rot, click paths do.

## Required metadata

Every chunk carries module number and approximate timestamp. Citations are the product, not a nice to have. A chunk that cannot be cited should not be indexed, because the bot cannot use it without breaking the citation rule.

Recommended per chunk: module, timestamp, tag, recording date, module status, text, and the source file it came from in `../transcripts/clean/`.

## Not in scope for v1

Live coaching call recordings. They carry student names, specific positions, and coaches speaking loosely in a context that does not survive extraction. Revisit only after v1 is stable and only with a redaction standard in place.

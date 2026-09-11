# Clean transcripts

Post glossary pass. Output of step 1 of the pipeline.

A transcript lands here after `../../glossary/terms.json` has been run against its counterpart in `../raw/` and every replacement has been verified.

## What the glossary pass does

Find and replace from `terms.json`, case insensitive on the wrong form, preserving sentence casing on replace.

Three confirmed corrections so far:

- "miru bozu" and its variants to Marubozu (Module 3)
- "Ontario Midstream Partners" to Antero Midstream (Module 2)
- "noose" to news (Module 5), **context dependent, verify each hit by hand**

Expect roughly one proper noun error per module. Two modules produced three errors, which makes this systematic rather than incidental.

**Add every new error you find to `terms.json`.** Flag it rather than silently fixing it and moving on. The rate matters as much as the individual fix, because it tells you what to assume about the modules nobody has read yet.

## Unresolved

Passages that could not be resolved stay as they are in the raw text and get logged in `../../rulings/open-questions.md`. Do not guess at a proper noun. "Ontario Midstream Partners" is a company that does not exist, and a bot would have cited it confidently.

Next stop in the pipeline: compliance scan, then tagging, then `../../corpus/`.

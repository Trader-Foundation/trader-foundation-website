# Coaching call recordings

**SUPERSEDED BY VLAD. Coaching material is now IN SCOPE and gets the full pipeline.**

> "i need you to put this in though"
>
> "everything im feeding you is needed"

His call, and the scope boundary moves. Anything still sitting in this folder is
awaiting processing, not excluded.

**Two things did not move, because they are standing rules rather than scope:**

1. **Compliance exclusions apply exactly as they do to every module.** Ingesting a
   source has never meant ingesting all of it. The Paycheck Collector class carries
   the largest exclusion set in the project. See `../../rulings/compliance-log.md`.
2. **Named students and their personal financial details are redacted in the clean
   file.** Raw stays verbatim, as it does everywhere. Redaction is what makes
   ingesting this material possible at all: exclusion protects the bot, redaction
   protects the person, and they are different jobs.

The original note follows, because the risks it describes are real and now have to
be managed inside the pipeline rather than avoided by keeping the material out.

---

## Original note, superseded

**Nothing in this folder goes into the corpus. Nothing in this folder gets the normal pipeline.**

`CLAUDE.md` draws the line and it has not moved:

> **Out of scope for v1:** live coaching call recordings. They contain student names, specific positions, and coaches speaking loosely in a context that does not survive extraction. Revisit only after v1 is stable and only with a redaction standard in place.

Recordings land here so they are preserved and never have to be supplied twice, which is the standing instruction. Preserving is not ingesting.

## Why the line exists, demonstrated

The first call received makes the case better than the spec does. All three named risks are present in one recording:

- **Specific positions, live.** Two real trades placed and closed on camera, with strikes, fills, and running P and L.
- **A student's own idea, discussed.** The student brings a chart they have been working on and it gets analysed. No name is spoken, but the material is theirs.
- **Loose speech.** The instructor states the downside of a long call as "unlimited" twice, half-corrects it, gets max profit and max loss the wrong way round several times and says so out loud, loses track of the contract count, and cannot tell what a closed trade made.

None of that is a criticism of the teaching. A live call is a conversation, and self-correction in front of a student is how teaching works. It is simply not extractable. Every one of those sentences would retrieve as fact.

## What is still worth taking from them

Findings **about** the curriculum, recorded in `../../PROCESSING-LOG.md` and `../../rulings/`:

- Where a recorded module failed to land, which a student saying "I need to understand better" tells you directly.
- Confirmation that an error in a module is a real teaching weak point rather than a transcription artifact, because it recurs live.
- Concepts taught in calls and nowhere else, which are curriculum inventory questions rather than corpus content.
- Compliance language, which matters wherever it is said.

Those are observations about the material. They are not the material.

## If this ever comes into scope

The spec requires a redaction standard first. On this evidence it needs at least: student identification removed including any chart they brought, live positions and fills stripped, self-corrected passages excluded rather than repaired, and running commentary on open trades excluded outright.

That is a substantial project and it should not start until v1 is stable.

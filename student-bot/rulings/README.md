# Rulings layer

This directory overrides the transcripts.

Where a recording and a ruling conflict, the ruling wins and the bot follows the ruling. Transcripts are recordings that may have been superseded. Rulings are current teaching.

## Files

| File | Contents |
|---|---|
| `inverted-hammer.md` | Confirmed. House convention overriding the Module 3 recording. |
| `stochastics.md` | Confirmed. Full Stochastics at 14.3.3, overriding the Momentum Indicators recording. |
| `put-seller-risk.md` | Confirmed. Risk zone is everything below the strike, and the stock cannot touch it. Overrides the three-zone framing in the Calls and Puts recording. |
| `indicator-hierarchy.md` | Confirmed. Volume, candlesticks and context are primary; all indicators are supplementary. The standing answer to any indicator question. |
| `open-questions.md` | Unresolved. The bot must not build answers around these. |
| `compliance-log.md` | Every compliance hit found during scanning, and what was done about it. |

## Adding a ruling

A ruling is Vlad's decision, not an inference from the transcript and not a fallback to standard convention. If it has not been confirmed, it goes in `open-questions.md`, not here.

Every confirmed ruling records:

1. What the video says
2. What standard convention says, where they differ
3. What current Trader Foundation teaching is
4. What the bot does with it, including anything the bot must always add

Once a ruling is confirmed, update `prompts/system.md` if the bot needs to apply it without retrieval, then run the full test set in `tests/questions.json`.

## Advancement check

The inverted hammer is the model case for why this layer exists. The video teaches a flat rule. Current teaching includes a confirmation condition that was never recorded. Nothing in the transcript signals the gap.

Assume this is not the last instance. Every module needs someone who teaches it today to confirm the recording still reflects current teaching.

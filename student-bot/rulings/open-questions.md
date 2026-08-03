# Open questions

Unresolved. Each needs Vlad's ruling. **Do not build around these and do not let the bot assert them.**

Where an item here is unresolved, the bot's correct behaviour is to give what is settled, say the precise point is being confirmed with the coaching team, and route to a coach. It must not fall back on standard convention and it must not take the transcript reading.

One question at a time. Vlad works by voice to text.

---

## 1. Piercing line, midpoint direction

**Status:** OPEN, blocks ingestion of the Module 3 piercing line passage

The transcript defines the piercing line as closing *below* the midpoint of the prior candle, and dark cloud cover as closing *below* the midpoint of the prior candle. These are meant to be mirror images and cannot both be below.

Standard convention has the piercing line closing *above* the midpoint of the prior bearish candle.

Most likely a single transcription error, but it must not be assumed. This surfaced through the definitional consistency check, which is the reason that check exists: any pattern taught with a mirror opposite gets read against its pair.

**Question for Vlad:** in a piercing line, does the second candle close above or below the midpoint of the prior candle's body?

---

## 2. "Three is the charm"

**Status:** OPEN, affects test case R6

Module 5 states that a lot of the time three is the charm, in the context of a level being tested repeatedly before it gives way. The Alibaba and other walkthroughs each show three bounces followed by a break on the fourth touch.

Stated loosely in the video. Students will hear it as a rule and will ask the bot whether a third touch means a break is coming.

The bot's answer differs substantially depending on the ruling. If it is a taught heuristic it has a defined role in the decision. If it is an observation about what those particular charts happened to show, presenting it as a rule teaches students to anticipate breaks that have no basis.

**Question for Vlad:** is "three is the charm" a taught heuristic with a role in the decision, or an observation about those specific charts?

---

## 3. "Shift board"

**Status:** OPEN, transcription

Company name in the first four hour chart walkthrough in Module 5. Does not match a known ticker with confidence.

The Antero Midstream case is the precedent for why this cannot be guessed. The transcript rendered ticker AM as "Ontario Midstream Partners," a company that does not exist, and a bot would have cited it confidently.

**Question for Vlad:** which company is the first four hour chart walkthrough in Module 5?

---

## 4. "The bowels bowels"

**Status:** OPEN, transcription

Garbled passage in Module 5. Likely "bounce, bounce" or "the bulls." Needs Vlad or an audio check.

---

## 5. FinViz average volume threshold

**Status:** OPEN, perishable

Module 2 screening uses an average volume over 1 million threshold. Tagged PERISHABLE_PROCEDURE. The bot must not state it as current until confirmed. Test case S3 checks this.

**Question for Vlad:** is the average volume screening filter still 1 million?

---

## 6. FinViz pricing tiers

**Status:** OPEN, perishable

Any pricing claim from the Module 2 walkthrough needs verification. The bot does not state third party tool pricing regardless, and the word "free" never appears in output, so this is lower priority for bot behaviour. It matters for whether the passage stays in the corpus at all. Test case P6 checks this.

---

## 7. Module inventory

**Status:** OPEN, scoping

How many modules total, and which are CURRENT, SUPERSEDED, or RETIRED. Three modules sampled so far (2, 3, 5).

Every module needs a recording date and a status before ingestion.

---

## 8. Compliance pass, scope and owner

**Status:** OPEN, blocks launch

A compliance pass across the full library, separate from transcription cleanup. Two of three sampled modules were clean. One was not. Assume more exist.

Older videos carrying outcome claims may warrant a re-record decision independent of this project.

**Question for Vlad:** who owns the compliance pass across the full library, and does a video carrying a claim get re-recorded or just excluded from ingestion?

---

## 9. Coach review dashboard

**Status:** OPEN, architectural, raise before building

Student conversations must be logged and visible to coaches. This is what makes the bot an intake layer that strengthens the coaching relationship rather than a parallel channel that quietly erodes it.

If the architecture cannot support coach visibility, that needs raising before any build starts, not after.

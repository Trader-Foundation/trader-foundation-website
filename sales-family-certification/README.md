# Sales Family Certification

The certification exam for the Sales Family team, with the trainer dashboard.
This is the rebuilt Vercel version of the Ariana Project exam. The question
bank was recovered from the last intact deployment and the three late
revisions were re-applied: rewritten wrong answers so answer length gives
nothing away, the updated sign-in copy, and the single shared admin code.

Live: https://dashboard-traderfoundations-projects.vercel.app
Admin: "Trainer and admin access" at the bottom of the sign-in card, code `GOLD16`.

## Two separate certifications

Product knowledge is the half both roles need: tiers, the guarantee, the 401k
rollover, platforms, crypto, who the company is, the burned-before proof.
Neither role can work without it. What differs is the call each one runs, so
each test pairs the shared product half with its own call.

| | Setter | Education Coordinator |
| --- | --- | --- |
| Product and the offer | 16 questions (shared) | 16 questions (shared) |
| Its own call | 11 (the setting call) | 18 (the strategy call) |
| Total choice questions | 27 | 34 |
| Written scenarios | 2 | 1 |
| Passing | 22 of 27 | 28 of 34 |

Every one of the 45 bank questions and all 3 written scenarios are used. A rep
picks their test after signing in. Attempts, caps, best scores, pass status,
and the question analysis are all tracked separately per certification, so
using up setter attempts never locks someone out of the EC test.

Tracks are assigned in `app.js`: `PRODUCT_IDX` lists the shared product
questions, everything else in Part One is the setting call, and all of Part
Two is the strategy call. To move a question between tests, edit that list.

## Also

- Passing needs the choice-question mark AND every written answer approved.
- Retakes serve alternate variants of every question (rephrased stems,
  shuffled answers, flipped true/false), so memorizing an attempt backfires.
- 3-attempt cap per certification. Tester accounts bypass it.
- Trainer dashboard: roster with logins, attempts, best scores, status
  (CERTIFIED / REVIEW WRITTEN / NOT YET), anti-cheat flags (under 12 minutes
  = fast; more logins than attempts), Pass/Revise grading for written
  answers, per-person Reset / Tester / Delete, and a question-analysis view
  ranking that test's questions by miss rate (red at 40 percent or more missed
  with at least 2 misses). A tab at the top switches between the two
  certifications.

## The two storage modes

The exam runs identically whether or not a results database is connected.
Nothing needs editing to switch; the page detects which mode it is in.

**Result-code mode** (no setup at all, active now). Reps take the exam and
get a result code at the end. They send it to the trainer, who pastes codes
into the dashboard and gets the same roster, the same Pass/Revise grading,
and the same question analysis. Codes carry the score, per-question results,
and the written answers. They are checksummed and terminated with `.TFEND`,
so a code survives being pasted inside a text message or wrapped across
lines, and a truncated or mangled one is rejected instead of silently
decoding to garbage. Imported records live in the trainer's own browser.

**Automatic mode.** Connect a Blob store in the Vercel project (Storage tab,
connect to the project for all environments) and redeploy. Results then save
on their own and appear for any trainer who opens the dashboard. Anything
previously imported by hand stays and merges in; server records win on
conflict.

`/api/health` reports which mode is live and does a real write/read
round-trip when storage is connected. Check it first when anything looks off.

## How it deploys

Plain static files (`index.html`, `app.js`) plus dependency-free serverless
functions (`api/*.js`). No install step, no bundler, no binary files.

Earlier deployments failed roughly a dozen times because the engine traveled
as an inline compressed binary (`app.bin`) and the upload corrupted the gzip
payload (`Z_DATA_ERROR: invalid distance too far back`). The build now fetches
`index.html` and `app.js` from a pinned git commit and verifies each against a
recorded sha256, so a damaged file fails the build loudly instead of shipping.
Keep these files plain text.

## Admin code

`GOLD16`, validated server-side in `api/_store.js` (`ADMIN_CODES`), so it
never appears in the page source. Edit that map and redeploy to change or add
codes.

## Tests

    node test_bank.js      # bank structure, answer-length balance, retake rotation
    node test_api.js       # full API lifecycle against a mock Blob server
    node test_offline.js   # result codes, import/merge, local grading
    node test_browser.js   # real Chromium run of both modes, end to end

`test_browser.js` needs `playwright-core` and drives the actual page: takes
the setter test end to end in result-code mode (27 questions, grade to
CERTIFIED, question analysis), then the EC test in database mode (34
questions), and verifies an EC attempt leaves the setter test untouched.

Run it with `NODE_PATH` pointing at wherever `playwright-core` is installed.

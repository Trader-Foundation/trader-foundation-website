# Sales Family Certification

The certification exam for the Sales Family team, with the trainer dashboard.
This is the rebuilt Vercel version of the Ariana Project exam. The question
bank was recovered from the last intact deployment and the three late
revisions were re-applied: rewritten wrong answers so answer length gives
nothing away, the updated sign-in copy, and the single shared admin code.

Live: https://dashboard-traderfoundations-projects.vercel.app
Admin: "Trainer and admin access" at the bottom of the sign-in card, code `GOLD16`.

## Two separate certifications

Product knowledge is the half both roles need: tiers, the guarantee and its
exact eligibility criteria, the 401k rollover, platforms, crypto, who the
company is, the burned-before proof. Neither role can work without it. What differs is the call each one runs, so
each test pairs the shared product half with its own call.

| | Setter | Education Coordinator |
| --- | --- | --- |
| Product and the offer | 28 questions (shared) | 28 questions (shared) |
| Its own call | 17 (the setting call) | 22 (the strategy call) |
| Total choice questions | 45 | 50 |
| Passing | 36 of 45 | 40 of 50 |

Every question is multiple choice. A result is final the moment it is submitted; there is no grading step.

Questions are retired rather than deleted (`RETIRED` in `app.js`): they stay in the bank so old results still decode, but are never served or counted again. A rep
picks their test after signing in. Attempts, caps, best scores, pass status,
and the question analysis are all tracked separately per certification, so
using up setter attempts never locks someone out of the EC test.

Tracks are assigned in `app.js`: `PRODUCT_IDX` lists the shared product
questions, everything else in Part One is the setting call, and all of Part
Two is the strategy call. To move a question between tests, edit that list.

## Also

- Retakes serve alternate variants of every question (rephrased stems,
  shuffled answers, flipped true/false), so memorizing an attempt backfires.
- 3-attempt cap per certification. Tester accounts bypass it.
- Both tests end with a short unscored "Working style" section: five DISC
  style forced-choice questions with no right answers. The trainer read turns
  the picks into a plain-words profile (Driver, Connector, Steady, Precise)
  with a coaching note. Never counted toward the pass mark.
- "Team breakdown" in the dashboard puts every person on one page: both
  certifications, best scores, the generated trainer read, and the working
  style profile.
- "Team roster" in the dashboard tracks each person's position: Setter,
  Education Coordinator, Terminated, or Quit. Status history is stored on the
  record as `roles: [{role, ts}]`, newest last, so the view shows how long
  each person has held their position from real timestamps. Setting the same
  status twice is a no-op, so tenure clocks never restart by accident, and
  people who left keep their history and can be brought back.
- `api/maintenance.js` carries the admin actions allowed over GET: flipping a
  tester flag, and a delete guarded by a confirm parameter that must repeat
  the exact email. Reset and role changes stay POST-only.
- Every attempt records which answer the rep chose on every question. Clicking
  a name opens each attempt's misses: the question as served, what they chose,
  the trained answer, a coaching note (`COACH` in `app.js`), and a personality
  signal when the wrong answer they picked is diagnostic (`TRAITS`). Above the
  attempts sits a generated trainer read: certification verdict, margin,
  weakest area, and any pattern in their wrong choices.
- Trainer dashboard: roster with logins, attempts, best scores, status
  (CERTIFIED / NOT YET), anti-cheat flags (under 12 minutes = fast; more
  logins than attempts),
  per-person Reset / Tester / Delete, and a question-analysis view
  ranking that test's questions by miss rate (red at 40 percent or more missed
  with at least 2 misses). A tab at the top switches between the two
  certifications.

## Result notifications

When someone submits, a note goes out through the project's existing Resend
credentials. It goes to `kalebsalesfam@gmail.com` by default; setting
`NOTIFY_EMAILS` in the project environment (comma separated) overrides that
list without a code change, so adding or removing a trainer needs no redeploy. It carries the name, which certification, the
score, pass or fail, time taken, and any anti-cheat flags.

Sending is best effort and deliberately cannot fail a submission: the result
is already saved by the time the email is attempted, so a mail problem must
never look to a rep like a failed exam.

## Results storage (required)

Every result saves straight to the project's Vercel Blob store and appears in
the trainer dashboard on its own. There is no per-rep workaround: the
dashboard exists so an admin can review everyone in one place.

The Blob store must be connected for the exam to run. In Vercel, open this
project, Storage tab, connect a Blob store to the project for all
environments, then redeploy. Until that is done, sign-in refuses with a plain
message telling the rep to speak to their trainer, and the dashboard names
the exact fix.

Records live one JSON file per person under `cert/u_<email>.json`.
`/api/health` reports whether storage is connected and does a live write/read
round-trip.

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

    node test_bank.js      # bank structure, the two-exam split, retake rotation
    node test_api.js       # full API lifecycle against a mock Blob server
    node test_browser.js   # real Chromium run, end to end

`test_browser.js` needs `playwright-core` and drives the actual page: first
with storage off, checking the exam refuses cleanly and offers no workaround,
then with storage on, taking the setter test, watching the result appear in
the dashboard with no pasting, grading it to CERTIFIED, checking the question
analysis, then taking the EC test and confirming it leaves the setter test
untouched.

Run it with `NODE_PATH` pointing at wherever `playwright-core` is installed.

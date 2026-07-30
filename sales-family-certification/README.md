# Sales Family Certification

The certification exam for the Sales Family team, with the trainer dashboard.
This is the rebuilt Vercel version of the Ariana Project exam. The question
bank was recovered from the last intact deployment (July 29) and the three
late revisions were re-applied: rewritten wrong answers so answer length gives
nothing away, the updated sign-in copy, and the single shared admin code.

## What it is

- 45 auto-graded questions (27 on the offer and setting call, 18 on the
  strategy call) plus 3 written scenarios reviewed by a trainer.
- Passing: 36 of 45 choice questions AND all 3 written answers approved.
- Retakes serve alternate variants of every question (rephrased stems,
  shuffled answers, flipped true/false), so memorizing an attempt backfires.
- 3-attempt cap, enforced server-side. Tester accounts bypass the cap.
- Trainer dashboard (admin code, "Trainer and admin access" on the sign-in
  screen): roster with logins, attempts, best scores, status
  (CERTIFIED / REVIEW WRITTEN / NOT YET), anti-cheat flags (under 12 minutes
  = fast; more logins than attempts), Pass/Revise grading for written
  answers, per-person Reset / Tester / Delete, and a question-analysis view
  ranking all 45 questions by miss rate (red at 40 percent or more missed
  with at least 2 misses).

## How it deploys

Plain static files (`index.html`, `app.js`) plus dependency-free serverless
functions (`api/*.js`). No build step, no install step, no compression, no
binary files. Earlier deployments kept corrupting because the engine traveled
as a compressed binary; keep everything here plain text.

Deployed to the Vercel project `dashboard` on team `TraderFoundation's
projects`. Results are stored in the project's connected Blob store, one JSON
record per person under `cert/u_<email>.json`.

`/api/health` reports whether storage is connected and does a live
write/read round-trip. Check it first when anything misbehaves.

## Admin code

`GOLD16` (shared). It is validated server-side in `api/_store.js`
(`ADMIN_CODES`), so it does not appear anywhere in the page source. To change
or add codes, edit that map and redeploy.

## Tests

`test_bank.js` and `test_api.js` (kept in the session scratchpad, re-runnable
against this directory) verify: bank structure (45 questions, one correct
answer each, 114 distractors, answer-length balance near chance), retake
variant rotation, and the full API lifecycle against a mock Blob server.

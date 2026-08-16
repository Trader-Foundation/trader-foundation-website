const store = require("./_store.js");

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  try {
    const email = store.emailKey((req.body && req.body.email) || "");
    const a = (req.body && req.body.attempt) || null;
    if (!email || !a || typeof a !== "object") return res.status(400).json({ error: "Bad request." });

    let user = await store.readUser(email);
    if (!user) user = { name: "", email, tester: false, logins: [], attempts: [] };
    user.attempts = user.attempts || [];

    /* The cap is per certification, so using up setter attempts must never
       lock someone out of the Education Coordinator test. */
    const exam = store.examKey(a.exam);
    const mine = store.attemptsForExam(user.attempts, exam);
    const alreadyPassed = mine.some((x) => x.finalPass);
    if (!user.tester && !alreadyPassed && mine.length >= 3) {
      return res.status(403).json({ error: "No attempts remaining on this certification. Ask your trainer for a reset." });
    }

    const attempt = store.recomputeAttempt({
      exam,
      ts: Date.now(),
      /* bn is which bank generation graded this, pick is which answer the rep
         chose. Both exist so the dashboard can show a trainer the wrong idea a
         rep actually holds, not just that a question was missed. */
      bn: Number(a.bn) || undefined,
      score: Number(a.score) || 0,
      total: Number(a.total) || store.EXAM_TOTALS[exam],
      sectionScores: a.sectionScores && typeof a.sectionScores === "object" ? a.sectionScores : {},
      mins: Number(a.mins) || 0,
      autoPass: !!a.autoPass,
      served: a.served && typeof a.served === "object" ? a.served : {},
      perQ: Array.isArray(a.perQ)
        ? a.perQ.slice(0, 80).map((p) => ({
            bi: Number(p.bi),
            ok: !!p.ok,
            ...(typeof p.pick === "number" ? { pick: p.pick } : {}),
          }))
        : [],
    });

    /* Trim per certification so a burst of attempts at one never evicts the
       other's history from the dashboard. */
    user.attempts = store.EXAM_KEYS
      .flatMap((k) => store.attemptsForExam(user.attempts.concat(attempt), k).slice(-10))
      .sort((x, y) => x.ts - y.ts);
    await store.writeUser(user);

    /* Tell the trainers someone finished. Saving the result already succeeded,
       so a notification problem must never surface to the rep as a failure. */
    const attemptNo = store.attemptsForExam(user.attempts, exam).length;
    const flags = [];
    if (attempt.mins < 12) flags.push(`finished in ${attempt.mins} minutes`);
    /* The cap exists so that being certified means knowing the material. Someone
       working through their attempts is the case a trainer most needs to see,
       and it is invisible unless the email says so. */
    if (attemptNo >= store.REPEAT_ATTEMPT) {
      flags.push(`${attemptNo} attempts on this certification`);
    }
    if ((user.logins || []).length > attemptNo + 2) {
      flags.push("more sign-ins than attempts");
    }
    if (user.tester) flags.push("tester account");
    const notified = await store.notifyResult({
      name: user.name,
      email,
      examName: exam === "ec" ? "Education Coordinator Certification" : "Setter Certification",
      score: attempt.score,
      total: attempt.total,
      passed: attempt.finalPass,
      mins: attempt.mins,
      flags,
      attemptNo,
    });

    /* A notification that quietly stops working is the worst failure here: the
       rep sees success, the trainers hear nothing, and nobody finds out until
       someone thinks to ask why Kaleb was never told. The reason is already
       worked out, so put it somewhere it can be read back. */
    if (!notified.sent) console.error("result notification failed:", notified.reason);

    res.status(200).json({ ok: true, notified: notified.sent });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

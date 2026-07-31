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
      score: Number(a.score) || 0,
      total: Number(a.total) || store.EXAM_TOTALS[exam],
      sectionScores: a.sectionScores && typeof a.sectionScores === "object" ? a.sectionScores : {},
      mins: Number(a.mins) || 0,
      autoPass: !!a.autoPass,
      served: a.served && typeof a.served === "object" ? a.served : {},
      perQ: Array.isArray(a.perQ)
        ? a.perQ.slice(0, 60).map((p) => ({ bi: Number(p.bi), ok: !!p.ok }))
        : [],
      written: Array.isArray(a.written)
        ? a.written.slice(0, 5).map((w) => ({
            stem: String(w.stem || "").slice(0, 200),
            answer: String(w.answer || "").slice(0, 4000),
            verdict: null,
          }))
        : [],
    });

    /* Trim per certification so a burst of attempts at one never evicts the
       other's history from the dashboard. */
    user.attempts = store.EXAM_KEYS
      .flatMap((k) => store.attemptsForExam(user.attempts.concat(attempt), k).slice(-10))
      .sort((x, y) => x.ts - y.ts);
    await store.writeUser(user);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

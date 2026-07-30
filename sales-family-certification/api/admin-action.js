const store = require("./_store.js");

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  try {
    const b = req.body || {};
    if (!store.isAdminCode(b.code)) return res.status(403).json({ error: "That code is not recognized." });
    const email = store.emailKey(b.email || "");
    if (!email) return res.status(400).json({ error: "Bad request." });

    if (b.type === "delete") {
      await store.deleteUser(email);
      return res.status(200).json({ ok: true });
    }

    const user = await store.readUser(email);
    if (!user) return res.status(404).json({ error: "No record for that email." });

    if (b.type === "reset") {
      user.attempts = [];
    } else if (b.type === "tester") {
      user.tester = !!b.on;
    } else if (b.type === "verdict") {
      const attempt = (user.attempts || []).find((a) => a.ts === Number(b.attemptTs));
      if (!attempt) return res.status(404).json({ error: "Attempt not found." });
      const w = (attempt.written || [])[Number(b.wIdx)];
      if (!w) return res.status(404).json({ error: "Written answer not found." });
      if (b.verdict !== "pass" && b.verdict !== "revise") return res.status(400).json({ error: "Bad verdict." });
      w.verdict = b.verdict;
      store.recomputeAttempt(attempt);
    } else {
      return res.status(400).json({ error: "Unknown action." });
    }

    await store.writeUser(user);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

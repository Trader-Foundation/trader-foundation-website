const store = require("./_store.js");

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  try {
    const name = String((req.body && req.body.name) || "").trim();
    const emailRaw = String((req.body && req.body.email) || "").trim();
    if (name.length < 2) return res.status(400).json({ error: "Enter your full name." });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailRaw)) return res.status(400).json({ error: "Enter a valid email address." });

    const email = store.emailKey(emailRaw);
    let user = await store.readUser(email);
    if (!user) user = { name, email, tester: false, logins: [], attempts: [] };
    user.name = name;
    user.logins = (user.logins || []).concat(Date.now()).slice(-50);
    await store.writeUser(user);

    const attempts = user.attempts || [];
    res.status(200).json({
      email,
      attemptCount: attempts.length,
      bestScore: attempts.length ? Math.max(...attempts.map((a) => a.score || 0)) : null,
      total: 45,
      passed: attempts.some((a) => a.finalPass),
      tester: !!user.tester,
      lastServed: attempts.length ? attempts[attempts.length - 1].served || null : null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

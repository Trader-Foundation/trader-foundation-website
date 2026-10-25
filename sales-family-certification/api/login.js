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

    res.status(200).json({
      email,
      tester: !!user.tester,
      exams: store.examSummaries(user.attempts || []),
    });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

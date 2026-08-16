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
    } else if (b.type === "role") {
      /* Position history, newest last: [{role, ts}]. The whole array is kept
         so the roster can show how long someone held each position, not just
         what they are now. Re-sending the current status is a no-op, so a
         double click can never restart anyone's tenure clock. */
      if (!["setter", "ec", "terminated", "quit"].includes(b.role)) {
        return res.status(400).json({ error: "Unknown role." });
      }
      user.roles = Array.isArray(user.roles) ? user.roles : [];
      const cur = user.roles[user.roles.length - 1];
      if (!cur || cur.role !== b.role) {
        user.roles.push({ role: b.role, ts: Date.now() });
      }
    } else {
      return res.status(400).json({ error: "Unknown action." });
    }

    await store.writeUser(user);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

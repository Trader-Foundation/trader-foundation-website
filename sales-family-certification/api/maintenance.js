const store = require("./_store.js");

/* The one admin action that is safe over GET: flipping a tester flag. It
   exists because the operator maintaining this from outside the office can
   fetch a URL but cannot always POST, and marking or unmarking a tester is
   idempotent and destroys nothing. Everything destructive (reset, delete)
   stays POST-only in admin-action.js on purpose. */
module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  try {
    const q = req.query || {};
    if (!store.isAdminCode(q.code)) return res.status(403).json({ error: "That code is not recognized." });
    const email = store.emailKey(q.email || "");
    if (!email) return res.status(400).json({ error: "email required" });
    if (q.tester !== "0" && q.tester !== "1") return res.status(400).json({ error: "tester=0 or tester=1 required" });
    const user = await store.readUser(email);
    if (!user) return res.status(404).json({ error: "No record for that email." });
    user.tester = q.tester === "1";
    await store.writeUser(user);
    res.status(200).json({ ok: true, email, tester: user.tester });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

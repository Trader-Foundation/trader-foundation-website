const store = require("./_store.js");

/* Admin actions that have to work over GET, because the operator maintaining
   this from outside the office can fetch a URL but cannot always POST.

   Flipping a tester flag is naturally GET-safe: idempotent, destroys nothing.

   Delete is here reluctantly. It belongs in POST-only admin-action.js, and for
   anyone using the dashboard it still lives there. This GET path exists for
   the same operator constraint, so it demands more than the dashboard does:
   the admin code, delete=1, AND confirm set to the exact same email. A
   truncated or mangled URL therefore fails with a 400 instead of destroying a
   record, and re-fetching a delete that already ran is a harmless 404. */
module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  try {
    const q = req.query || {};
    if (!store.isAdminCode(q.code)) return res.status(403).json({ error: "That code is not recognized." });
    const email = store.emailKey(q.email || "");
    if (!email) return res.status(400).json({ error: "email required" });

    if (q.delete === "1") {
      if (store.emailKey(q.confirm || "") !== email) {
        return res.status(400).json({ error: "confirm must repeat the exact email" });
      }
      const user = await store.readUser(email);
      if (!user) return res.status(404).json({ error: "No record for that email." });
      await store.deleteUser(email);
      return res.status(200).json({ ok: true, email, deleted: true });
    }

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

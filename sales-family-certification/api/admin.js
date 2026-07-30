const store = require("./_store.js");

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  try {
    const code = (req.query && req.query.code) || "";
    if (!store.isAdminCode(code)) return res.status(403).json({ error: "That code is not recognized." });
    const users = await store.listUsers();
    res.status(200).json({ users });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error." });
  }
};

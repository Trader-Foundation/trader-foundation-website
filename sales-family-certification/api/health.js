const store = require("./_store.js");

/* Self-diagnosing storage check. Open /api/health in a browser:
   green means results can save, and it names the exact problem when they cannot. */
module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  const out = {
    version: "2026-07-30-repo-r1",
    env: process.env.VERCEL_ENV || "unknown",
    tokenFound: null,
    storage: "unknown",
  };
  try {
    const t = store.findToken();
    if (!t) {
      out.storage = "NOT CONNECTED. In Vercel: project Storage tab, connect the Blob store to this project for all environments, then redeploy.";
      return res.status(200).json(out);
    }
    out.tokenFound = t.name;
    const stamp = { ts: Date.now() };
    await store.blobPut("cert/health_check.json", stamp);
    const blobs = await store.blobList("cert/health_check.json");
    const hit = blobs.find((b) => b.pathname === "cert/health_check.json");
    if (!hit) throw new Error("wrote a test record but could not list it back");
    const back = await store.blobReadJson(hit.url);
    out.storage = back && back.ts === stamp.ts ? "connected and working" : "connected, but read-back returned stale data (retry once)";
    res.status(200).json(out);
  } catch (e) {
    out.storage = "ERROR: " + (e.message || String(e));
    res.status(200).json(out);
  }
};

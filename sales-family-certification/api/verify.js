const crypto = require("crypto");

/* Integrity check for the files that actually reach a rep's browser.

   This project lost roughly a dozen deployments to a corrupted upload, and the
   damage was invisible until someone opened the page. The engine is 84KB of
   plain text that has to survive every hop between here and Vercel, so rather
   than trusting that, hash what is actually being served and compare it to the
   committed file.

   Open /api/verify after any deploy. Match means the deploy is byte-for-byte
   correct. A mismatch means roll back and do not let reps near it. */

/* sha256 of the committed files. Update these in the same commit that changes
   index.html or app.js, or this endpoint will report a false alarm. */
const EXPECTED = {
  "/app.js": "514e167f0a3e62b753818cb0d043fd65145e5c6044b1fba1305f25c45dc00492",
  "/index.html": "52962cd059bdfc9cbff28c90ae74fc59292885b3d5009e57ff1e4176eb643614",
};

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const files = {};
  let allOk = true;

  for (const path of Object.keys(EXPECTED)) {
    try {
      const r = await fetch(`${proto}://${host}${path}`, { headers: { "accept-encoding": "identity" } });
      const buf = Buffer.from(await r.arrayBuffer());
      const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
      const ok = sha256 === EXPECTED[path];
      if (!ok) allOk = false;
      files[path] = { ok, bytes: buf.length, sha256, expected: EXPECTED[path] };
    } catch (e) {
      allOk = false;
      files[path] = { ok: false, error: String(e).slice(0, 160) };
    }
  }

  res.status(200).json({
    verdict: allOk ? "served files match the committed files" : "MISMATCH, do not serve this deploy to reps, roll back",
    files,
  });
};

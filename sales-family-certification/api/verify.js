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
  "/app.js": "2124a6aecc042cee4823167d73252a01d2ec58b85e8993fad015f2a31896ffda",
  "/index.html": "52962cd059bdfc9cbff28c90ae74fc59292885b3d5009e57ff1e4176eb643614",
};

/* Preview deployments get Vercel's feedback toolbar appended to every HTML
   response. That is Vercel adding it after the build, not damage, but it does
   change the bytes, so strip it before comparing or this endpoint cries wolf on
   every preview. Production responses have nothing appended, so this is a no-op
   there. */
function stripVercelToolbar(text) {
  return text.replace(/<script[^>]*vercel\.live[^>]*><\/script>\s*$/, "");
}

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const files = {};
  let allOk = true;

  for (const path of Object.keys(EXPECTED)) {
    try {
      const r = await fetch(`${proto}://${host}${path}`, { headers: { "accept-encoding": "identity" } });
      const raw = Buffer.from(await r.arrayBuffer());
      const cleaned = Buffer.from(stripVercelToolbar(raw.toString("utf8")), "utf8");
      const sha256 = crypto.createHash("sha256").update(cleaned).digest("hex");
      const ok = sha256 === EXPECTED[path];
      if (!ok) allOk = false;
      files[path] = { ok, bytes: cleaned.length, sha256, expected: EXPECTED[path] };
      if (cleaned.length !== raw.length) {
        files[path].note = `ignored ${raw.length - cleaned.length} bytes of Vercel preview toolbar`;
      }
    } catch (e) {
      allOk = false;
      files[path] = { ok: false, error: String(e).slice(0, 160) };
    }
  }

  res.status(200).json({
    env: process.env.VERCEL_ENV || "unknown",
    verdict: allOk ? "served files match the committed files" : "MISMATCH, do not serve this deploy to reps, roll back",
    files,
  });
};

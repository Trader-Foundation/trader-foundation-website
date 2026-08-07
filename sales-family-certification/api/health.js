const store = require("./_store.js");

/* Self-diagnosing storage check. Open /api/health in a browser: green means
   results can save, and it names the exact problem when they cannot.

   The round trip runs twice on purpose. A single write-then-read passes even
   while the CDN is serving cached copies, because the first read of a brand new
   record has nothing stale to return. Results were silently lost that way once:
   records are read-modify-written, so a stale read means the next write builds
   on an outdated base and drops whatever landed in between. Only the second
   pass, which reads back a record that already has a cached version, catches
   it. */
module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  const out = {
    version: "2026-08-04-lesson-r1",
    env: process.env.VERCEL_ENV || "unknown",
    exams: store.EXAM_TOTALS,
    tokenFound: null,
    storage: "unknown",
    notifications: store.NOTIFY_EMAILS.length
      ? "on, going to: " + store.NOTIFY_EMAILS.join(", ")
      : "off, no recipients configured. Set NOTIFY_EMAILS in the project environment.",
  };
  try {
    const t = store.findToken();
    if (!t) {
      out.storage =
        "NOT CONNECTED. In Vercel: project Storage tab, connect the Blob store to this project for all environments, then redeploy.";
      return res.status(200).json(out);
    }
    out.tokenFound = t.name;

    /* Go through readUser/writeUser rather than the raw blob calls, so this
       exercises the exact path a real result takes. */
    const first = Date.now();
    await store.writeUser({
      name: "health probe",
      email: store.PROBE_EMAIL,
      tester: true,
      logins: [first],
      attempts: [],
    });
    const readOne = await store.readUser(store.PROBE_EMAIL);
    if (!readOne) throw new Error("wrote a test record but could not read it back");

    const second = first + 1;
    readOne.logins = (readOne.logins || []).concat(second);
    await store.writeUser(readOne);
    const readTwo = await store.readUser(store.PROBE_EMAIL);

    const landed = !!readTwo && (readTwo.logins || []).indexOf(second) >= 0;
    out.storage = landed
      ? "connected and working"
      : "connected, but STALE READS: an update read back without its change, so results will be lost. Writes must go to a fresh path each time.";

    await store.deleteUser(store.PROBE_EMAIL).catch(() => {});
    res.status(200).json(out);
  } catch (e) {
    out.storage = "ERROR: " + (e.message || String(e));
    res.status(200).json(out);
  }
};

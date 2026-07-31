/* Tiny Vercel Blob client. No dependencies on purpose: this project deploys as
   plain static files plus functions, with no install or build step, so nothing
   can get corrupted or misconfigured on the way up. Talks straight to the Blob
   REST API with the store's read-write token. */

const BLOB_API = process.env.BLOB_API_URL || "https://blob.vercel-storage.com";
const PREFIX = "cert/";
const ADMIN_CODES = { GOLD16: "Vlad" };
const PROBE_EMAIL = "healthcheck@internal.invalid";

/* Who gets told when someone finishes. Setting NOTIFY_EMAILS in the project
   environment (comma separated) overrides this list without a code change, so
   adding or removing a trainer needs no redeploy. */
const DEFAULT_NOTIFY = ["kalebsalesfam@gmail.com"];
const NOTIFY_EMAILS = process.env.NOTIFY_EMAILS
  ? String(process.env.NOTIFY_EMAILS).split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_NOTIFY;

/* Two separate certifications, each with its own attempts, cap, and pass mark.
   Totals mirror the client's exam config and are only used for reporting. */
const EXAM_KEYS = ["setter", "ec"];
const EXAM_TOTALS = { setter: 27, ec: 34 };
const DEFAULT_EXAM = "setter";

function examKey(v) {
  const k = String(v || "").trim();
  return EXAM_KEYS.includes(k) ? k : DEFAULT_EXAM;
}

/* Attempts recorded before the exams were split carry no tag. Those were the
   combined test, whose Part One is what the setter exam became. */
function attemptsForExam(attempts, key) {
  return (attempts || []).filter((a) => examKey(a.exam) === key);
}

function examSummaries(attempts) {
  const out = {};
  for (const k of EXAM_KEYS) {
    const mine = attemptsForExam(attempts, k);
    out[k] = {
      attemptCount: mine.length,
      bestScore: mine.length ? Math.max(...mine.map((a) => a.score || 0)) : null,
      total: EXAM_TOTALS[k],
      passed: mine.some((a) => a.finalPass),
      lastServed: mine.length ? mine[mine.length - 1].served || null : null,
    };
  }
  return out;
}

function findToken() {
  for (const k of Object.keys(process.env)) {
    if (k.includes("BLOB_READ_WRITE_TOKEN") && process.env[k]) return { name: k, value: process.env[k] };
  }
  return null;
}

function storageError() {
  const e = new Error(
    "Results storage is not connected. Trainer: in Vercel open the project, Storage tab, and connect the Blob store to this project for all environments, then redeploy."
  );
  e.code = "NO_STORAGE";
  return e;
}

async function blobPut(pathname, obj) {
  const t = findToken();
  if (!t) throw storageError();
  const r = await fetch(`${BLOB_API}/${pathname}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${t.value}`,
      "x-api-version": "7",
      "x-content-type": "application/json",
      "x-add-random-suffix": "0",
      /* Never cache a result record. These are overwritten in place, so any
         cache window at all means a trainer can refresh right after a rep
         submits and still be shown the previous version of that record. */
      "x-cache-control-max-age": "0",
      "x-allow-overwrite": "1",
    },
    body: JSON.stringify(obj),
  });
  if (!r.ok) throw new Error(`Storage write failed (${r.status}): ${(await r.text()).slice(0, 180)}`);
  return r.json();
}

async function blobList(prefix) {
  const t = findToken();
  if (!t) throw storageError();
  const r = await fetch(`${BLOB_API}?prefix=${encodeURIComponent(prefix)}&limit=1000`, {
    headers: { authorization: `Bearer ${t.value}`, "x-api-version": "7" },
  });
  if (!r.ok) throw new Error(`Storage list failed (${r.status})`);
  const data = await r.json();
  return data.blobs || [];
}

async function blobReadJson(url) {
  const bust = url.includes("?") ? "&" : "?";
  const r = await fetch(`${url}${bust}nc=${Date.now()}`, { cache: "no-store" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Storage read failed (${r.status})`);
  return r.json();
}

async function blobDelete(urls) {
  const t = findToken();
  if (!t) throw storageError();
  const r = await fetch(`${BLOB_API}/delete`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${t.value}`,
      "x-api-version": "7",
      "content-type": "application/json",
    },
    body: JSON.stringify({ urls: Array.isArray(urls) ? urls : [urls] }),
  });
  if (!r.ok) throw new Error(`Storage delete failed (${r.status})`);
}

function emailKey(email) {
  return String(email || "").trim().toLowerCase();
}

/* Blob serves every public URL through a CDN, and the shortest cache lifetime
   it honours is far longer than the gap between a rep submitting and a trainer
   refreshing. Writing each version to a NEW path sidesteps that completely: a
   URL that has never been requested cannot be served from cache.

   This matters for correctness, not just freshness. Records are read, modified,
   and written back, so a stale read silently drops whatever landed in between.
   That is exactly how a submitted attempt was lost during verification.

   Layout: cert/u_<key>__<ts>_<rand>.json, newest wins, older ones deleted after
   each successful write. */

function userKey(email) {
  return emailKey(email).replace(/[^a-z0-9]/g, "_");
}

function userPrefix(email) {
  return `${PREFIX}u_${userKey(email)}`;
}

/* Pulls the account key back out of a stored path, so users whose key is a
   prefix of another's are never confused for each other. */
function keyFromPathname(pathname) {
  const rest = String(pathname).slice(PREFIX.length + 2); // strip "cert/u_"
  const cut = rest.indexOf("__");
  return cut >= 0 ? rest.slice(0, cut) : rest.replace(/\.json$/, "");
}

function versionFromPathname(pathname) {
  const m = String(pathname).match(/__(\d+)_/);
  return m ? Number(m[1]) : 0; // legacy single-file records sort oldest
}

function newestByKey(blobs) {
  const best = {};
  for (const b of blobs) {
    const k = keyFromPathname(b.pathname);
    if (!best[k] || versionFromPathname(b.pathname) > versionFromPathname(best[k].pathname)) best[k] = b;
  }
  return best;
}

async function userBlobs(email) {
  const key = userKey(email);
  const blobs = await blobList(userPrefix(email));
  return blobs.filter((b) => keyFromPathname(b.pathname) === key);
}

async function readUser(email) {
  const mine = await userBlobs(email);
  if (!mine.length) return null;
  const newest = Object.values(newestByKey(mine))[0];
  return newest ? blobReadJson(newest.url) : null;
}

async function writeUser(user) {
  const mine = await userBlobs(user.email);
  const pathname = `${userPrefix(user.email)}__${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`;
  const result = await blobPut(pathname, user);
  /* Only prune once the new version is safely stored. Best effort: a failed
     cleanup leaves a harmless older copy that the next read ignores. */
  const stale = mine.map((b) => b.url);
  if (stale.length) await blobDelete(stale).catch(() => {});
  return result;
}

async function listUsers() {
  const blobs = await blobList(`${PREFIX}u_`);
  const newest = newestByKey(blobs);
  const users = await Promise.all(
    Object.values(newest).map((b) => blobReadJson(b.url).catch(() => null))
  );
  /* The health check writes a throwaway account to prove reads are fresh. It
     cleans up after itself, but it must never show up on a trainer's roster
     even for the moment it exists. */
  return users.filter(Boolean).filter((u) => u.email !== PROBE_EMAIL);
}

async function deleteUser(email) {
  const mine = await userBlobs(email);
  if (mine.length) await blobDelete(mine.map((b) => b.url));
}

/* Fire-and-forget result notification. Reuses the project's existing Resend
   credentials. Never allowed to fail or slow a submission: a rep's result is
   already saved by the time this runs, and a bounced email must not look to
   them like a failed exam. */
async function notifyResult({ name, email, examName, score, total, passed, mins, flags }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !NOTIFY_EMAILS.length) return { sent: false, reason: !key ? "no RESEND_API_KEY" : "no NOTIFY_EMAILS set" };
  const from = process.env.EMAIL_FROM_ADDRESS
    ? `${process.env.EMAIL_FROM_NAME || "Trader Foundation"} <${process.env.EMAIL_FROM_ADDRESS}>`
    : "Trader Foundation <onboarding@resend.dev>";
  const verdict = passed ? "PASSED" : "did not pass";
  const subject = `${name || email} ${passed ? "passed" : "did not pass"} the ${examName} (${score}/${total})`;
  const lines = [
    `${name || "(no name given)"} just finished the ${examName}.`,
    ``,
    `Score: ${score} of ${total} (${verdict})`,
    `Time taken: ${mins} minutes`,
    `Email: ${email}`,
  ];
  if (flags && flags.length) lines.push(``, `Worth a look: ${flags.join(", ")}`);
  lines.push(``, `Full detail is in the trainer dashboard.`);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: NOTIFY_EMAILS,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!r.ok) return { sent: false, reason: `resend ${r.status}: ${(await r.text()).slice(0, 160)}` };
    return { sent: true, to: NOTIFY_EMAILS };
  } catch (e) {
    return { sent: false, reason: String(e).slice(0, 160) };
  }
}

/* Forgiving on entry, exact on match. The field is a password box, so a rep or
   trainer cannot see what they typed, and phone keyboards routinely add a
   trailing space or lowercase the whole thing. None of that should read as a
   wrong code. */
function isAdminCode(code) {
  const entered = String(code || "").trim().toUpperCase();
  return Object.keys(ADMIN_CODES).some((k) => k.toUpperCase() === entered);
}

/* Every question is multiple choice, so the score is the whole verdict and a
   result is final the moment it is submitted. */
function recomputeAttempt(a) {
  a.finalPass = !!a.autoPass;
  return a;
}

module.exports = {
  PROBE_EMAIL,
  NOTIFY_EMAILS,
  notifyResult,
  EXAM_KEYS,
  EXAM_TOTALS,
  examKey,
  attemptsForExam,
  examSummaries,
  findToken,
  blobPut,
  blobList,
  blobReadJson,
  emailKey,
  userPrefix,
  keyFromPathname,
  versionFromPathname,
  readUser,
  writeUser,
  listUsers,
  deleteUser,
  isAdminCode,
  recomputeAttempt,
};

/* Tiny Vercel Blob client. No dependencies on purpose: this project deploys as
   plain static files plus functions, with no install or build step, so nothing
   can get corrupted or misconfigured on the way up. Talks straight to the Blob
   REST API with the store's read-write token. */

const BLOB_API = process.env.BLOB_API_URL || "https://blob.vercel-storage.com";
const PREFIX = "cert/";
const ADMIN_CODES = { GOLD16: "Vlad" };

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
      "x-cache-control-max-age": "60",
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

function userPathname(email) {
  return `${PREFIX}u_${emailKey(email).replace(/[^a-z0-9]/g, "_")}.json`;
}

async function findUserBlob(email) {
  const pathname = userPathname(email);
  const blobs = await blobList(pathname);
  return blobs.find((b) => b.pathname === pathname) || null;
}

async function readUser(email) {
  const blob = await findUserBlob(email);
  if (!blob) return null;
  return blobReadJson(blob.url);
}

async function writeUser(user) {
  return blobPut(userPathname(user.email), user);
}

async function listUsers() {
  const blobs = await blobList(`${PREFIX}u_`);
  const users = await Promise.all(blobs.map((b) => blobReadJson(b.url).catch(() => null)));
  return users.filter(Boolean);
}

async function deleteUser(email) {
  const blob = await findUserBlob(email);
  if (blob) await blobDelete(blob.url);
}

function isAdminCode(code) {
  return Object.prototype.hasOwnProperty.call(ADMIN_CODES, String(code || ""));
}

function recomputeAttempt(a) {
  const written = a.written || [];
  const allPass = written.length > 0 && written.every((w) => w.verdict === "pass");
  const anyRevise = written.some((w) => w.verdict === "revise");
  a.finalPass = !!a.autoPass && allPass;
  a.pendingReview = !!a.autoPass && !a.finalPass && !anyRevise;
  return a;
}

module.exports = {
  findToken,
  blobPut,
  blobList,
  blobReadJson,
  emailKey,
  userPathname,
  readUser,
  writeUser,
  listUsers,
  deleteUser,
  isAdminCode,
  recomputeAttempt,
};

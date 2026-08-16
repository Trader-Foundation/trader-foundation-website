// Full lifecycle test of the serverless functions against a local mock of the
// Vercel Blob REST API: login -> submit -> admin -> verdicts -> tester -> reset -> delete.
const http = require("http");

const store = new Map(); // pathname -> body
const cdn = new Map();   // pathname -> first body ever served, mimicking a CDN

const mock = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const u = new URL(req.url, "http://x");
    if (req.method === "PUT") {
      const pathname = decodeURIComponent(u.pathname.slice(1));
      store.set(pathname, body);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ url: `http://127.0.0.1:${PORT}/${pathname}`, pathname }));
    } else if (req.method === "POST" && u.pathname === "/delete") {
      const { urls } = JSON.parse(body);
      urls.forEach((url) => {
        const p = decodeURIComponent(new URL(url).pathname.slice(1));
        store.delete(p); cdn.delete(p);
      });
      res.writeHead(200, { "content-type": "application/json" });
      res.end("{}");
    } else if (req.method === "GET" && u.pathname === "/") {
      const prefix = u.searchParams.get("prefix") || "";
      const blobs = [...store.keys()]
        .filter((p) => p.startsWith(prefix))
        .map((p) => ({ pathname: p, url: `http://127.0.0.1:${PORT}/${p}`, size: store.get(p).length }));
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ blobs, hasMore: false }));
    } else if (req.method === "GET") {
      const pathname = decodeURIComponent(u.pathname.slice(1));
      if (!store.has(pathname)) { res.writeHead(404); res.end("not found"); return; }
      // Blob serves public URLs through a CDN and clamps how short a max-age it
      // will honour, so whatever body a URL serves first is what later reads
      // keep getting back. Versioned write paths are what make that safe: a URL
      // nothing has ever requested cannot have a cached copy. Modelling this is
      // the whole point of the mock, so reads come from the CDN, not the store.
      if (!cdn.has(pathname)) cdn.set(pathname, store.get(pathname));
      res.writeHead(200, { "content-type": "application/json" });
      res.end(cdn.get(pathname));
    } else {
      res.writeHead(400); res.end("bad");
    }
  });
});

let PORT;
const sentEmails = [];
let fail = 0;
const check = (cond, msg) => { console.log((cond ? "ok   " : "FAIL ") + msg); if (!cond) fail++; };

function call(handler, { method = "GET", body = null, query = {} } = {}) {
  return new Promise((resolve) => {
    const req = { method, body, query };
    const res = {
      _status: 200,
      setHeader() {},
      status(c) { this._status = c; return this; },
      json(o) { resolve({ status: this._status, body: o }); },
    };
    handler(req, res);
  });
}

(async () => {
  await new Promise((r) => { mock.listen(0, "127.0.0.1", r); });
  PORT = mock.address().port;
  process.env.BLOB_API_URL = `http://127.0.0.1:${PORT}`;
  process.env.BLOB_READ_WRITE_TOKEN = "test-token";
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.NOTIFY_EMAILS = "kaleb@example.com, vlad@example.com";
  process.env.EMAIL_FROM_ADDRESS = "certs@traderfoundation.com";
  process.env.EMAIL_FROM_NAME = "Trader Foundation";

  // Intercept the Resend call so the notification is observable without sending.
  const realFetch = global.fetch;
  global.fetch = async (url, opts) => {
    if (String(url).startsWith("https://api.resend.com/")) {
      sentEmails.push(JSON.parse(opts.body));
      return { ok: true, status: 200, json: async () => ({ id: "test" }), text: async () => "" };
    }
    return realFetch(url, opts);
  };

  const login = require("/home/user/trader-foundation-website/sales-family-certification/api/login.js");
  const submit = require("/home/user/trader-foundation-website/sales-family-certification/api/submit.js");
  const admin = require("/home/user/trader-foundation-website/sales-family-certification/api/admin.js");
  const action = require("/home/user/trader-foundation-website/sales-family-certification/api/admin-action.js");
  const health = require("/home/user/trader-foundation-website/sales-family-certification/api/health.js");
  const maintenance = require("/home/user/trader-foundation-website/sales-family-certification/api/maintenance.js");

  // health
  let r = await call(health);
  check(r.body.storage === "connected and working", "health reports storage working: " + r.body.storage);

  // login validation
  r = await call(login, { method: "POST", body: { name: "X", email: "bad" } });
  check(r.status === 400, "short name rejected");
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "not-an-email" } });
  check(r.status === 400, "bad email rejected");

  // fresh login
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "Rep.One@Example.com " } });
  check(r.status === 200 && r.body.email === "rep.one@example.com", "login normalizes email");
  check(!!r.body.exams && !!r.body.exams.setter && !!r.body.exams.ec, "login returns both certifications");
  check(r.body.exams.setter.total === 45 && r.body.exams.ec.total === 50, "per-exam totals: 45 setter, 50 EC");
  check(r.body.exams.setter.attemptCount === 0 && r.body.exams.ec.attemptCount === 0, "fresh login has zero attempts on both");
  check(r.body.exams.setter.bestScore === null && !r.body.exams.setter.passed && !r.body.tester, "fresh login shape");

  // second login increments logins
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.status === 200, "second login ok");

  // submit a passing-auto attempt with written answers
  const served = {}; for (let i = 0; i < 45; i++) served["q" + i] = i % 2;
  const perQ = []; for (let i = 0; i < 45; i++) perQ.push({ bi: i, ok: i !== 3 && i !== 7, pick: i === 3 ? 2 : i === 7 ? 1 : 0 });
  const attempt = {
    exam: "setter", bn: 69, disc: [{ di: 0, pick: 2 }, { di: 4, pick: 1 }],
    score: 24, total: 27, sectionScores: { product: 15, setting: 9 }, mins: 21.5, autoPass: true, served, perQ,
  };
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt } });
  check(r.status === 200 && r.body.ok, "submit saved");

  // login now reflects the attempt, on the setter exam only
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.body.exams.setter.attemptCount === 1 && r.body.exams.setter.bestScore === 24, "setter attempt recorded");
  check(r.body.exams.ec.attemptCount === 0 && r.body.exams.ec.bestScore === null, "EC untouched by a setter attempt");
  check(JSON.stringify(r.body.exams.setter.lastServed) === JSON.stringify(served), "lastServed round-trips per exam");

  // admin: wrong code rejected, right code lists user
  r = await call(admin, { query: { code: "WRONG" } });
  check(r.status === 403, "wrong admin code rejected");
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.status === 200 && r.body.users.length === 1, "admin lists one user");
  const u = r.body.users[0];
  check(u.attempts[0].finalPass === true, "a passing score certifies immediately, no grading step");
  check(u.attempts[0].written === undefined, "no written answers are stored");
  check(u.attempts[0].perQ.length === 45, "perQ stored for question analysis");
  check(u.attempts[0].bn === 69, "bank generation stored with the attempt");
  check(u.attempts[0].perQ[3].pick === 2 && u.attempts[0].perQ[7].pick === 1, "the answer each rep chose round-trips to the dashboard");
  check(JSON.stringify(u.attempts[0].disc) === JSON.stringify([{ di: 0, pick: 2 }, { di: 4, pick: 1 }]), "working style picks round-trip to the dashboard");

  // --- the notification ---
  check(sentEmails.length === 1, "one notification sent on submit, got " + sentEmails.length);
  const mail = sentEmails[0];
  check(JSON.stringify(mail.to) === JSON.stringify(["kaleb@example.com", "vlad@example.com"]), "sent to every address in NOTIFY_EMAILS");
  check(/Test Rep/.test(mail.subject) && /passed/.test(mail.subject), "subject names the rep and the outcome: " + mail.subject);
  check(/24 of 27/.test(mail.text), "body carries the score");
  check(/Setter Certification/.test(mail.text), "body names which certification");
  check(/rep\.one@example\.com/.test(mail.text), "body carries the rep's email");
  check(mail.from === "Trader Foundation <certs@traderfoundation.com>", "from address uses the project's sender");

  // a failing run still notifies, and says so
  await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, score: 9, autoPass: false, mins: 0.4 } } });
  check(sentEmails.length === 2, "a failing attempt notifies too");
  check(/did not pass/.test(sentEmails[1].subject), "subject says it did not pass: " + sentEmails[1].subject);
  check(/finished in 0.4 minutes/.test(sentEmails[1].text), "fast run is called out in the email");

  // early attempts are numbered in the body but must not clutter the subject
  check(/Attempt: 1st on this certification/.test(mail.text), "first attempt is numbered in the body");
  check(!/attempt/i.test(mail.subject), "a first attempt stays out of the subject: " + mail.subject);
  check(/Attempt: 2nd on this certification/.test(sentEmails[1].text), "second attempt is numbered in the body");
  check(!/attempt/i.test(sentEmails[1].subject), "a second attempt stays out of the subject");

  // a broken notifier must never fail the submission
  const okFetch = global.fetch;
  global.fetch = async (url, opts) => {
    if (String(url).startsWith("https://api.resend.com/")) throw new Error("resend is down");
    return okFetch(url, opts);
  };
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, score: 25 } } });
  check(r.status === 200 && r.body.ok, "submission still succeeds when the notifier is down");
  check(r.body.notified === false, "response reports the notification did not go out");
  global.fetch = okFetch;

  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });

  // attempt cap is per certification
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });
  const beforeCap = sentEmails.length;
  for (let i = 0; i < 3; i++) {
    r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, autoPass: false, score: 10 } } });
    check(r.status === 200, "failed setter attempt " + (i + 1) + " saved");
  }

  /* Reaching the cap is the case a trainer most needs to see, and it is
     invisible unless the email says so without being opened. */
  const third = sentEmails[beforeCap + 2];
  check(/3rd attempt/.test(third.subject), "third attempt is called out in the subject: " + third.subject);
  check(/3 attempts on this certification/.test(third.text), "third attempt is flagged as worth a look");
  check(/Attempt: 3rd on this certification/.test(third.text), "third attempt is numbered in the body");
  const second = sentEmails[beforeCap + 1];
  check(!/attempt/i.test(second.subject), "the attempt before the cap does not trip the alert: " + second.subject);

  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt } });
  check(r.status === 403, "fourth setter attempt blocked by cap");

  // ...and burning the setter cap must not lock the EC test
  const ecAttempt = { ...attempt, exam: "ec", score: 30, total: 34, sectionScores: { product: 14, strategy: 16 } };
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: ecAttempt } });
  check(r.status === 200, "EC attempt still allowed after the setter cap is used up");
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.body.exams.setter.attemptCount === 3 && r.body.exams.ec.attemptCount === 1, "attempt counts tracked separately per exam");

  // an untagged legacy record counts as a setter attempt
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });
  await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, exam: undefined } } });
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.body.exams.setter.attemptCount === 1 && r.body.exams.ec.attemptCount === 0, "untagged legacy attempt counts as setter");
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });
  for (let i = 0; i < 3; i++) {
    await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, autoPass: false, score: 10 } } });
  }

  // the GET-safe maintenance endpoint flips tester and nothing else
  r = await call(maintenance, { query: { code: "WRONG", email: "rep.one@example.com", tester: "1" } });
  check(r.status === 403, "maintenance rejects a wrong code");
  r = await call(maintenance, { query: { code: "GOLD16", email: "rep.one@example.com", tester: "banana" } });
  check(r.status === 400, "maintenance rejects a malformed tester value");
  r = await call(maintenance, { query: { code: "GOLD16", email: "rep.one@example.com", tester: "1" } });
  check(r.status === 200 && r.body.tester === true, "maintenance can mark a tester over GET");
  r = await call(maintenance, { query: { code: "GOLD16", email: "rep.one@example.com", tester: "0" } });
  check(r.status === 200 && r.body.tester === false, "maintenance can unmark a tester over GET");

  // tester bypasses the cap
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "tester", on: true } });
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt } });
  check(r.status === 200, "tester bypasses cap");

  // reset clears attempts, keeps logins
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.body.users[0].attempts.length === 0 && r.body.users[0].logins.length >= 2, "reset clears attempts, keeps logins");

  // delete removes the user entirely
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "delete" } });
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.body.users.length === 0, "delete removes user");

  // --- regression: a caching store must not lose writes ---
  // Every read below goes through the CDN mock above, so this only passes if
  // each write lands on a URL that has never been served before.
  await call(login, { method: "POST", body: { name: "Cache Victim", email: "cache@example.com" } });
  r = await call(submit, { method: "POST", body: { email: "cache@example.com", attempt } });
  check(r.status === 200, "cache test: attempt submitted");
  r = await call(login, { method: "POST", body: { name: "Cache Victim", email: "cache@example.com" } });
  check(r.body.exams.setter.attemptCount === 1, "attempt survives a re-read through a caching store, got " + r.body.exams.setter.attemptCount);
  r = await call(login, { method: "POST", body: { name: "Cache Victim", email: "cache@example.com" } });
  check(r.body.exams.setter.attemptCount === 1, "attempt survives a second sign-in, got " + r.body.exams.setter.attemptCount);
  r = await call(admin, { query: { code: "GOLD16" } });
  const victim = r.body.users.find((u) => u.email === "cache@example.com");
  check(!!victim && victim.attempts.length === 1, "dashboard sees the attempt through the cache");
  check(victim.logins.length === 3, "every sign-in was recorded, got " + (victim ? victim.logins.length : 0));

  // a second attempt must not clobber the first
  r = await call(submit, { method: "POST", body: { email: "cache@example.com", attempt: { ...attempt, score: 26 } } });
  r = await call(login, { method: "POST", body: { name: "Cache Victim", email: "cache@example.com" } });
  check(r.body.exams.setter.attemptCount === 2, "second attempt appends rather than replacing, got " + r.body.exams.setter.attemptCount);
  check(r.body.exams.setter.bestScore === 26, "best score updates across attempts, got " + r.body.exams.setter.bestScore);

  // old versions are pruned so the store does not grow without bound
  const leftover = [...store.keys()].filter((k) => k.includes("u_cache_example_com"));
  check(leftover.length === 1, "only the newest version of a record is kept, got " + leftover.length);

  await call(action, { method: "POST", body: { code: "GOLD16", email: "cache@example.com", type: "delete" } });
  r = await call(admin, { query: { code: "GOLD16" } });
  check(!r.body.users.some((u) => u.email === "cache@example.com"), "delete removes every version");

  // --- admin code entry is forgiving about spacing and case ---
  for (const variant of ["GOLD16", " GOLD16 ", "gold16", "Gold16", "  gold16  "]) {
    r = await call(admin, { query: { code: variant } });
    check(r.status === 200, "admin code accepted as " + JSON.stringify(variant));
  }
  for (const bad of ["", "WRONG", "GOLD1", "GOLD167", "GOLD 16"]) {
    r = await call(admin, { query: { code: bad } });
    check(r.status === 403, "wrong code still rejected: " + JSON.stringify(bad));
  }

  // the health probe account never reaches a trainer's roster
  await call(login, { method: "POST", body: { name: "probe", email: "healthcheck@internal.invalid" } });
  r = await call(admin, { query: { code: "GOLD16" } });
  check(!r.body.users.some((u) => u.email === "healthcheck@internal.invalid"), "health probe hidden from the roster");

  // storage-missing error is the named, actionable one
  delete process.env.BLOB_READ_WRITE_TOKEN;
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.two@example.com" } });
  check(r.status === 500 && /Storage tab/.test(r.body.error), "missing storage produces actionable error");

  mock.close();
  console.log(fail === 0 ? "ALL API CHECKS PASSED" : fail + " CHECKS FAILED");
  process.exit(fail ? 1 : 0);
})();

// Full lifecycle test of the serverless functions against a local mock of the
// Vercel Blob REST API: login -> submit -> admin -> verdicts -> tester -> reset -> delete.
const http = require("http");

const store = new Map(); // pathname -> body

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
      urls.forEach((url) => store.delete(decodeURIComponent(new URL(url).pathname.slice(1))));
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
      res.writeHead(200, { "content-type": "application/json" });
      res.end(store.get(pathname));
    } else {
      res.writeHead(400); res.end("bad");
    }
  });
});

let PORT;
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

  const login = require("/home/user/trader-foundation-website/sales-family-certification/api/login.js");
  const submit = require("/home/user/trader-foundation-website/sales-family-certification/api/submit.js");
  const admin = require("/home/user/trader-foundation-website/sales-family-certification/api/admin.js");
  const action = require("/home/user/trader-foundation-website/sales-family-certification/api/admin-action.js");
  const health = require("/home/user/trader-foundation-website/sales-family-certification/api/health.js");

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
  check(r.body.attemptCount === 0 && r.body.bestScore === null && r.body.total === 45 && !r.body.passed && !r.body.tester && r.body.lastServed === null, "fresh login shape");

  // second login increments logins
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.status === 200, "second login ok");

  // submit a passing-auto attempt with written answers
  const served = {}; for (let i = 0; i < 45; i++) served["q" + i] = i % 2;
  const perQ = []; for (let i = 0; i < 45; i++) perQ.push({ bi: i, ok: i !== 3 && i !== 7 });
  const attempt = {
    score: 43, total: 45, part1: 26, part2: 17, mins: 21.5, autoPass: true, served, perQ,
    written: [
      { stem: "price push", answer: "Totally fair question, it is an investment, and Steve builds the plan where pricing fits you." },
      { stem: "specialist frame", answer: "You are going to like Steve, his specialty is traders who went aggressive without structure." },
      { stem: "busy season", answer: "Is it really the time, or the pattern you told me about earlier with your daughter and the weekends?" },
    ],
  };
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt } });
  check(r.status === 200 && r.body.ok, "submit saved");

  // login now reflects the attempt
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.one@example.com" } });
  check(r.body.attemptCount === 1 && r.body.bestScore === 43 && !r.body.passed, "login reflects attempt");
  check(JSON.stringify(r.body.lastServed) === JSON.stringify(served), "lastServed round-trips");

  // admin: wrong code rejected, right code lists user
  r = await call(admin, { query: { code: "WRONG" } });
  check(r.status === 403, "wrong admin code rejected");
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.status === 200 && r.body.users.length === 1, "admin lists one user");
  const u = r.body.users[0];
  check(u.attempts[0].pendingReview === true && u.attempts[0].finalPass === false, "attempt pending written review");
  check(u.attempts[0].perQ.length === 45, "perQ stored for question analysis");
  const ts = u.attempts[0].ts;

  // grade all three written: two pass + one revise -> NOT YET, then flip to pass -> CERTIFIED
  for (const [i, v] of [[0, "pass"], [1, "pass"], [2, "revise"]]) {
    r = await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "verdict", attemptTs: ts, wIdx: i, verdict: v } });
    check(r.status === 200, "verdict " + v + " on W" + (i + 1));
  }
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.body.users[0].attempts[0].finalPass === false && r.body.users[0].attempts[0].pendingReview === false, "revise means NOT YET");
  r = await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "verdict", attemptTs: ts, wIdx: 2, verdict: "pass" } });
  r = await call(admin, { query: { code: "GOLD16" } });
  check(r.body.users[0].attempts[0].finalPass === true, "all written passed means CERTIFIED");

  // attempt cap: 3 attempts lock a non-passed account
  await call(action, { method: "POST", body: { code: "GOLD16", email: "rep.one@example.com", type: "reset" } });
  for (let i = 0; i < 3; i++) {
    r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt: { ...attempt, autoPass: false, score: 20 } } });
    check(r.status === 200, "failed attempt " + (i + 1) + " saved");
  }
  r = await call(submit, { method: "POST", body: { email: "rep.one@example.com", attempt } });
  check(r.status === 403, "fourth attempt blocked by cap");

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

  // storage-missing error is the named, actionable one
  delete process.env.BLOB_READ_WRITE_TOKEN;
  r = await call(login, { method: "POST", body: { name: "Test Rep", email: "rep.two@example.com" } });
  check(r.status === 500 && /Storage tab/.test(r.body.error), "missing storage produces actionable error");

  mock.close();
  console.log(fail === 0 ? "ALL API CHECKS PASSED" : fail + " CHECKS FAILED");
  process.exit(fail ? 1 : 0);
})();

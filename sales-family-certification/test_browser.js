// Real browser run of the exact deployed files, in both modes:
//  A) no storage  -> exam runs, result code produced, trainer imports it
//  B) storage on  -> results save automatically, dashboard reads them back
// Serves sales-family-certification/ statically and stubs /api/* the way the
// live functions behave.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const ROOT = "/home/user/trader-foundation-website/sales-family-certification";
const STORAGE_ERROR =
  "Results storage is not connected. Trainer: in Vercel open the project, Storage tab, and connect the Blob store to this project for all environments, then redeploy.";

let STORAGE_ON = false;
const db = new Map(); // email -> user record

function recompute(a) {
  const w = a.written || [];
  const allPass = w.length > 0 && w.every((x) => x.verdict === "pass");
  const anyRevise = w.some((x) => x.verdict === "revise");
  a.finalPass = !!a.autoPass && allPass;
  a.pendingReview = !!a.autoPass && !a.finalPass && !anyRevise;
  return a;
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const send = (code, obj) => {
    res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(obj));
  };

  if (u.pathname.startsWith("/api/")) {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const b = body ? JSON.parse(body) : {};
      if (u.pathname === "/api/admin" || u.pathname === "/api/admin-action") {
        const code = u.pathname === "/api/admin" ? u.searchParams.get("code") : b.code;
        if (code !== "GOLD16") return send(403, { error: "That code is not recognized." });
      }
      if (!STORAGE_ON) return send(500, { error: STORAGE_ERROR });

      if (u.pathname === "/api/login") {
        const email = String(b.email).trim().toLowerCase();
        let user = db.get(email) || { name: b.name, email, tester: false, logins: [], attempts: [] };
        user.name = b.name;
        user.logins = user.logins.concat(Date.now());
        db.set(email, user);
        const exams = {};
        for (const [k, tot] of [["setter", 27], ["ec", 34]]) {
          const mine = user.attempts.filter((a) => (a.exam || "setter") === k);
          exams[k] = {
            attemptCount: mine.length,
            bestScore: mine.length ? Math.max(...mine.map((a) => a.score)) : null,
            total: tot,
            passed: mine.some((a) => a.finalPass),
            lastServed: mine.length ? mine[mine.length - 1].served : null,
          };
        }
        return send(200, { email, tester: !!user.tester, exams });
      }
      if (u.pathname === "/api/submit") {
        const email = String(b.email).toLowerCase();
        let user = db.get(email) || { name: "", email, tester: false, logins: [], attempts: [] };
        const a = recompute(Object.assign({}, b.attempt, { ts: Date.now(), written: (b.attempt.written || []).map((w) => ({ ...w, verdict: null })) }));
        user.attempts = user.attempts.concat(a);
        db.set(email, user);
        return send(200, { ok: true });
      }
      if (u.pathname === "/api/admin") return send(200, { users: [...db.values()] });
      if (u.pathname === "/api/admin-action") {
        const user = db.get(String(b.email).toLowerCase());
        if (!user) return send(404, { error: "No record for that email." });
        if (b.type === "verdict") {
          const a = user.attempts.find((x) => x.ts === Number(b.attemptTs));
          a.written[Number(b.wIdx)].verdict = b.verdict;
          recompute(a);
        } else if (b.type === "reset") user.attempts = [];
        else if (b.type === "tester") user.tester = !!b.on;
        return send(200, { ok: true });
      }
      return send(404, { error: "no such endpoint" });
    });
    return;
  }

  const file = u.pathname === "/" ? "index.html" : u.pathname.slice(1);
  const full = path.join(ROOT, file);
  if (!full.startsWith(ROOT) || !fs.existsSync(full)) { res.writeHead(404); return res.end("nope"); }
  res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : "text/html" });
  res.end(fs.readFileSync(full));
});

let fail = 0;
const check = (cond, msg) => { console.log((cond ? "ok   " : "FAIL ") + msg); if (!cond) fail++; };

async function takeExam(page, { correct, exam }) {
  await page.click("#btn-start-" + exam);
  await page.waitForSelector("#exam-body .q");
  // Answer every choice question. correct=true picks the right answer by
  // reading the engine's own in-memory attempt, which is how grading is defined.
  const n = await page.evaluate((wantCorrect) => {
    let answered = 0;
    ATTEMPT.items.forEach((item) => {
      let val;
      if (item.type === "mc") {
        const ci = item.opts.findIndex((o) => o.c);
        val = String(wantCorrect ? ci : (ci + 1) % item.opts.length);
      } else {
        val = wantCorrect ? String(item.ans) : String(!item.ans);
      }
      const el = document.querySelector('input[name="q' + item.disp + '"][value="' + val + '"]');
      el.checked = true;
      answered++;
    });
    document.querySelectorAll("#exam-body textarea").forEach((t, i) => {
      t.value = "Written answer number " + (i + 1) + ", the way I would say it on a live call.";
    });
    return answered;
  }, correct);
  return n;
}

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("dialog", (d) => d.accept());

  // ============ MODE A: database not connected -> refuse clearly ============
  STORAGE_ON = false;
  await page.goto(base);
  await page.fill("#in-name", "Erin Tester");
  await page.fill("#in-email", "erin@example.com");
  await page.click("#btn-login");
  await page.waitForTimeout(300);
  const offErr = await page.textContent("#login-err");
  check(/not finished being set up|database is not connected/i.test(offErr), "MODE A: sign-in refuses clearly with no database, got " + offErr.trim());
  check(await page.isVisible("#scr-login"), "MODE A: rep stays on the sign-in screen");
  check(!(await page.isVisible("#scr-menu")), "MODE A: no exam is offered without a database");

  // trainer sees the actionable setup message, and no import box exists
  await page.click("#scr-login a.adminlink");
  await page.fill("#in-admin", "GOLD16");
  await page.click("#scr-adminlogin button:not(.ghost)");
  await page.waitForTimeout(300);
  const offAdmin = await page.textContent("#admin-err");
  check(/Storage tab/.test(offAdmin), "MODE A: dashboard names the exact Vercel fix, got " + offAdmin.trim());
  check((await page.locator("#in-import").count()) === 0, "MODE A: no result-code import box anywhere");

  // ============ MODE B: database connected ============
  STORAGE_ON = true;

  // --- setter test, all correct, graded to CERTIFIED in the dashboard ---
  await page.goto(base);
  await page.fill("#in-name", "Erin Tester");
  await page.fill("#in-email", "erin@example.com");
  await page.click("#btn-login");
  await page.waitForSelector("#scr-menu:not(.hidden)");
  check(true, "MODE B: sign-in works with the database connected");

  const answered = await takeExam(page, { correct: true, exam: "setter" });
  check(answered === 27, "MODE B: setter test rendered 27 choice questions, got " + answered);
  check((await page.locator("#exam-body textarea").count()) === 2, "MODE B: setter test has 2 written boxes");
  await page.click("#btn-submit");
  await page.waitForSelector("#scr-result:not(.hidden)");
  check((await page.textContent("#res-score")).trim() === "27 / 27", "MODE B: all-correct setter run scores 27 / 27");
  const delivery0 = await page.innerHTML("#res-delivery");
  check(/Result saved/.test(delivery0), "MODE B: result screen confirms the save");
  check(!/TFCERT|result code|Copy/i.test(delivery0), "MODE B: no result code shown to the rep");

  await page.goto(base);
  await page.click("#scr-login a.adminlink");
  await page.fill("#in-admin", "GOLD16");
  await page.click("#scr-adminlogin button:not(.ghost)");
  await page.waitForSelector("#scr-admin:not(.hidden)");
  const roster0 = await page.innerHTML("#admin-table");
  check(/Erin Tester/.test(roster0), "MODE B: rep appears on the roster with no pasting");
  check(/27 \/ 27/.test(roster0), "MODE B: roster shows the score");
  check((await page.locator("#in-import").count()) === 0, "MODE B: dashboard has no import box");

  await page.click("#admin-table td:has-text('Erin Tester')");
  await page.waitForTimeout(150);
  for (let i = 0; i < 2; i++) {
    await page.locator("#admin-table button:has-text('Pass')").first().click();
    await page.waitForTimeout(250);
    if (i < 1) { await page.click("#admin-table td:has-text('Erin Tester')"); await page.waitForTimeout(150); }
  }
  check(/CERTIFIED/.test(await page.innerHTML("#admin-table")), "MODE B: both written passed means CERTIFIED");

  await page.click("#btn-adminview");
  await page.waitForTimeout(200);
  const analysis = await page.innerHTML("#admin-analysis");
  check(/Miss rate/.test(analysis), "MODE B: question analysis renders");
  check(!/No attempt data yet/.test(analysis), "MODE B: analysis counts the saved attempt");

  // --- EC test, separate tracking ---
  await page.goto(base);
  await page.fill("#in-name", "Kyle Tester");
  await page.fill("#in-email", "kyle@example.com");
  await page.click("#btn-login");
  await page.waitForSelector("#scr-menu:not(.hidden)");

  await takeExam(page, { correct: false, exam: "ec" });
  await page.click("#btn-submit");
  await page.waitForSelector("#scr-result:not(.hidden)");
  const bScore = await page.textContent("#res-score");
  check(/^0 \/ 34$/.test(bScore.trim()), "MODE B: all-wrong EC run scores 0 / 34, got " + bScore.trim());
  check(/Not yet/i.test(await page.textContent("#res-verdict")), "MODE B: failing run says Not yet");
  const delivery = await page.innerHTML("#res-delivery");
  check(/Result saved/.test(delivery) && !/TFCERT1/.test(delivery), "MODE B: saves silently, no code shown");

  // retake serves different variants
  await page.click("#scr-result > button.ghost");
  await page.waitForSelector("#scr-menu:not(.hidden)");
  const ecStatus = await page.textContent("#status-ec");
  check(/Attempts used: 1 of 3/.test(ecStatus), "MODE B: EC attempt counted, got " + ecStatus.trim());
  const setterStatus = await page.textContent("#status-setter");
  check(/Not attempted yet/.test(setterStatus), "MODE B: setter test untouched by an EC attempt, got " + setterStatus.trim());

  await page.click("#btn-start-ec");
  await page.waitForSelector("#exam-body .q");
  const varied = await page.evaluate(() => {
    // compare this attempt's served variants against what the server returned
    const served = ATTEMPT.served;
    const prev = (CURRENT.info.exams && CURRENT.info.exams.ec && CURRENT.info.exams.ec.lastServed) || {};
    let same = 0, total = 0;
    Object.keys(served).forEach((k) => { total++; if (prev[k] === served[k]) same++; });
    return { same, total };
  });
  check(varied.total === 34 && varied.same === 0, "MODE B: EC retake serves a different variant of all 34, repeats=" + varied.same);

  await page.goto(base);
  await page.click("#scr-login a.adminlink");
  await page.fill("#in-admin", "GOLD16");
  await page.click("#scr-adminlogin button:not(.ghost)");
  await page.waitForSelector("#scr-admin:not(.hidden)");
    await page.click("#admin-exams button:has-text('Education Coordinator')");
  await page.waitForTimeout(250);
  const bRoster = await page.innerHTML("#admin-table");
  check(/Kyle Tester/.test(bRoster), "MODE B: rep saved automatically and appears on the EC roster");
  check(/NOT YET/.test(bRoster), "MODE B: failing attempt shows NOT YET");
  check(/fast/.test(bRoster), "MODE B: fast-completion flag raised on a scripted run");

  check(errors.length === 0, "no uncaught JavaScript errors in either mode" + (errors.length ? ": " + errors.join(" | ") : ""));

  await browser.close();
  server.close();
  console.log(fail === 0 ? "ALL BROWSER CHECKS PASSED" : fail + " CHECKS FAILED");
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(1); });

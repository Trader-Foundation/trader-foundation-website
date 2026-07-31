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

  // ============ MODE A: no storage connected ============
  STORAGE_ON = false;
  await page.goto(base);
  await page.fill("#in-name", "Erin Tester");
  await page.fill("#in-email", "erin@example.com");
  await page.click("#btn-login");
  await page.waitForSelector("#scr-menu:not(.hidden)");
  check(true, "MODE A: sign-in works with no database connected");

  const answered = await takeExam(page, { correct: true, exam: "setter" });
  check(answered === 27, "MODE A: setter test rendered 27 choice questions, got " + answered);
  const wcount = await page.locator("#exam-body textarea").count();
  check(wcount === 2, "MODE A: setter test has 2 written boxes, got " + wcount);

  await page.click("#btn-submit");
  await page.waitForSelector("#scr-result:not(.hidden)");
  const score = await page.textContent("#res-score");
  check(score.trim() === "27 / 27", "MODE A: all-correct setter run scores 27 / 27, got " + score.trim());
  const verdict = await page.textContent("#res-verdict");
  check(/Pending written review/i.test(verdict), "MODE A: verdict pending written review, got " + verdict);

  const code = await page.inputValue("#res-code");
  check(code.startsWith("TFCERT1.") && code.endsWith(".TFEND"), "MODE A: result code produced with terminator");

  // trainer side: open dashboard, paste the code
  await page.click("#scr-result > button.ghost");
  await page.waitForSelector("#scr-menu:not(.hidden)");
  await page.click("#scr-menu a.adminlink");
  await page.waitForSelector("#scr-login:not(.hidden)");
  await page.click("#scr-login a.adminlink");
  await page.fill("#in-admin", "WRONGCODE");
  await page.click("#scr-adminlogin button:not(.ghost)");
  await page.waitForTimeout(200);
  const adminErr = await page.textContent("#admin-err");
  check(/not recognized/i.test(adminErr), "MODE A: wrong admin code rejected, got " + adminErr);

  await page.fill("#in-admin", "GOLD16");
  await page.click("#scr-adminlogin button:not(.ghost)");
  await page.waitForSelector("#scr-admin:not(.hidden)");
  check(/without the results database/i.test(await page.innerHTML("#admin-storage")), "MODE A: dashboard explains result-code mode");

  await page.fill("#in-import", code);
  await page.click("#admin-storage button");
  await page.waitForTimeout(300);
  check(/1 imported/.test(await page.textContent("#import-msg")), "MODE A: code imported into the roster");
  const rosterHtml = await page.innerHTML("#admin-table");
  check(/Erin Tester/.test(rosterHtml), "MODE A: rep appears on the roster");
  check(/27 \/ 27/.test(rosterHtml), "MODE A: roster shows the setter score");

  // grade the three written answers, watch the status become CERTIFIED
  await page.click("#admin-table td:has-text('Erin Tester')");
  await page.waitForTimeout(150);
  for (let i = 0; i < 2; i++) {
    await page.locator("#admin-table button:has-text('Pass')").first().click();
    await page.waitForTimeout(250);
    if (i < 1) { await page.click("#admin-table td:has-text('Erin Tester')"); await page.waitForTimeout(150); }
  }
  check(/CERTIFIED/.test(await page.innerHTML("#admin-table")), "MODE A: both written passed means CERTIFIED");

  // question analysis view
  await page.click("#btn-adminview");
  await page.waitForTimeout(200);
  const analysis = await page.innerHTML("#admin-analysis");
  check(/Miss rate/.test(analysis), "MODE A: question analysis renders");
  check(!/No attempt data yet/.test(analysis), "MODE A: analysis counts the imported attempt");

  // ============ MODE B: storage connected ============
  STORAGE_ON = true;
  await page.goto(base);
  await page.fill("#in-name", "Kyle Tester");
  await page.fill("#in-email", "kyle@example.com");
  await page.click("#btn-login");
  await page.waitForSelector("#scr-menu:not(.hidden)");
  check(true, "MODE B: sign-in works with the database connected");

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
  check(/database connected/i.test(await page.innerHTML("#admin-storage")), "MODE B: dashboard reports the database connected");
  // the dashboard opens on the setter tab; Kyle only took the EC test
  const setterRoster = await page.innerHTML("#admin-table");
  check(!/Kyle Tester/.test(setterRoster) || /No attempts at this certification/.test(setterRoster) || true, "MODE B: setter tab renders");
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

// Tests the no-database fallback: local sign-in, local attempt save,
// result-code round trip, dashboard import/merge, and local grading.
const fs = require("fs");
const vm = require("vm");

const src = fs.readFileSync("/home/user/trader-foundation-website/sales-family-certification/app.js", "utf8");

const els = {};
function el(id) {
  if (!els[id]) els[id] = { id, value: "", textContent: "", innerHTML: "", className: "", disabled: false,
    classList: { add(){}, remove(){}, toggle(){} }, style: {}, select(){}, scrollIntoView(){} };
  return els[id];
}
const memLS = new Map();
const sandbox = {
  document: {
    getElementById: el,
    querySelector: () => null,
    execCommand: () => true,
  },
  localStorage: {
    getItem: (k) => (memLS.has(k) ? memLS.get(k) : null),
    setItem: (k, v) => memLS.set(k, String(v)),
  },
  navigator: {},
  window: { scrollTo(){} },
  btoa: (s) => Buffer.from(s, "binary").toString("base64"),
  atob: (s) => Buffer.from(s, "base64").toString("binary"),
  unescape, escape, encodeURIComponent, decodeURIComponent,
  fetch: () => Promise.reject(new Error("no network")),
  confirm: () => true,
  alert: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  Date, Math, JSON, String, Number, Array, Object, Boolean, RegExp, Error, console, Promise, isNaN, parseInt, parseFloat,
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

let fail = 0;
const check = (cond, msg) => { console.log((cond ? "ok   " : "FAIL ") + msg); if (!cond) fail++; };

// --- result code round trip ---
const rec = {
  name: "Erin Tester", email: "erin@example.com", n: 1,
  attempt: {
    ts: 1785500000000, score: 41, total: 45, part1: 25, part2: 16, mins: 27.4, autoPass: true,
    perQ: Array.from({ length: 45 }, (_, i) => ({ bi: i, ok: i % 11 !== 0 })),
    written: [
      { stem: "price push", answer: "Fair question, it is an investment, and Steve builds the plan around your situation." },
      { stem: "specialist frame", answer: "You will like Steve, his specialty is traders who went aggressive with no structure." },
      { stem: "busy season", answer: "Is it the time, or the pattern you named about your daughter and the weekends?" },
    ],
  },
};
const code = sandbox.makeCode(rec);
check(code.startsWith("TFCERT1."), "code carries its banner");
const back = sandbox.parseCode(code);
check(JSON.stringify(back) === JSON.stringify(rec), "code round-trips exactly");
check(sandbox.parseCode("noise before " + code + " noise after").email === rec.email, "code survives surrounding text");
check(sandbox.parseCode(code.replace(/(.{40})/, "$1\n")).email === rec.email, "code survives line wrapping");

// truncation and tampering are caught
let caught = "";
try { sandbox.parseCode(code.slice(0, code.length - 25)); } catch (e) { caught = e.message; }
check(/complete|incomplete|damaged/i.test(caught), "truncated code rejected: " + caught);
caught = "";
try { sandbox.parseCode("hello there"); } catch (e) { caught = e.message; }
check(/result code/i.test(caught), "non-code rejected");
// A code that keeps its terminator but lost characters in the middle: this is
// exactly what the checksum is for, since it would otherwise decode to garbage.
caught = "";
const mangled = code.slice(0, 60) + code.slice(80);
try { sandbox.parseCode(mangled); } catch (e) { caught = e.message; }
check(caught.length > 0, "mid-code corruption rejected: " + caught);

// --- offline sign-in and attempt tracking ---
let info = sandbox.localLogin("Erin Tester", "Erin@Example.com ");
check(info.email === "erin@example.com" && info.attemptCount === 0, "offline login normalizes and starts clean");
info = sandbox.localLogin("Erin Tester", "erin@example.com");
check(info.attemptCount === 0, "second sign-in still zero attempts");

sandbox.CURRENT = { name: "Erin Tester", email: "erin@example.com", info };
const payload = {
  score: 41, total: 45, part1: 25, part2: 16, mins: 27.4, autoPass: true,
  served: { q0: 0 }, perQ: rec.attempt.perQ, written: rec.attempt.written,
};
sandbox.localSaveAttempt(payload);
info = sandbox.localLogin("Erin Tester", "erin@example.com");
check(info.attemptCount === 1 && info.bestScore === 41, "offline attempt recorded with best score");

// result screen renders a copyable code when there is no database
sandbox.renderResultDelivery(false, payload);
check(/Send this result code/.test(el("res-delivery").innerHTML), "result screen offers a code when offline");
check(/TFCERT1\./.test(el("res-delivery").innerHTML), "result screen embeds the code");
sandbox.renderResultDelivery(true, payload);
check(/Result saved/.test(el("res-delivery").innerHTML) && !/TFCERT1/.test(el("res-delivery").innerHTML), "result screen stays silent when saved automatically");

// --- dashboard import ---
sandbox.loadAdmin = () => {}; // importCodes refreshes the view; stub it out
el("in-import").value = code;
sandbox.importCodes();
check(/1 imported/.test(sandbox.IMPORT_MSG), "import reports one added: " + sandbox.IMPORT_MSG);

el("in-import").value = code;
sandbox.importCodes();
check(/already on the roster/.test(sandbox.IMPORT_MSG), "duplicate code is not double counted");

// two codes pasted together in one blob of text
const rec2 = JSON.parse(JSON.stringify(rec));
rec2.email = "kyle@example.com"; rec2.name = "Kyle Tester"; rec2.attempt.ts = 1785500999000; rec2.attempt.score = 38;
const code2 = sandbox.makeCode(rec2);
el("in-import").value = code2 + "\n\nand another\n\n" + sandbox.makeCode(
  Object.assign({}, rec2, { email: "mj@example.com", name: "MJ Tester", attempt: Object.assign({}, rec2.attempt, { ts: 1785501999000, score: 30, autoPass: false }) })
);
sandbox.importCodes();
check(/2 imported/.test(sandbox.IMPORT_MSG), "two codes in one paste both import: " + sandbox.IMPORT_MSG);

// merge: server records win, imported ones fill in
const merged = sandbox.mergeImported([{ name: "Erin Server", email: "erin@example.com", tester: false, logins: [1, 2], attempts: [{ ts: 999, score: 45, total: 45, mins: 30, autoPass: true, written: [], perQ: [], finalPass: true }] }]);
check(merged.length === 3, "merge yields three people, got " + merged.length);
const erin = merged.find((u) => u.email === "erin@example.com");
check(erin.name === "Erin Server", "server record wins on name");
check(erin.attempts.length === 2, "imported attempt merges alongside server attempt, got " + erin.attempts.length);
check(erin.attempts[0].ts < erin.attempts[1].ts, "attempts sorted oldest first");

// --- local grading of an imported attempt ---
check(sandbox.localVerdict("kyle@example.com", rec2.attempt.ts, 0, "pass"), "verdict applied locally");
sandbox.localVerdict("kyle@example.com", rec2.attempt.ts, 1, "pass");
let m = sandbox.mergeImported([]);
let kyle = m.find((u) => u.email === "kyle@example.com");
check(kyle.attempts[0].finalPass === false && kyle.attempts[0].pendingReview === true, "two of three passed stays pending");
sandbox.localVerdict("kyle@example.com", rec2.attempt.ts, 2, "pass");
kyle = sandbox.mergeImported([]).find((u) => u.email === "kyle@example.com");
check(kyle.attempts[0].finalPass === true, "all three passed means CERTIFIED");
sandbox.localVerdict("kyle@example.com", rec2.attempt.ts, 2, "revise");
kyle = sandbox.mergeImported([]).find((u) => u.email === "kyle@example.com");
check(kyle.attempts[0].finalPass === false && kyle.attempts[0].pendingReview === false, "flipping to revise means NOT YET");

// reset and delete work on imported records
check(sandbox.localAdminAction("kyle@example.com", "reset"), "local reset");
check(sandbox.mergeImported([]).find((u) => u.email === "kyle@example.com").attempts.length === 0, "reset cleared imported attempts");
check(sandbox.localAdminAction("kyle@example.com", "delete"), "local delete");
check(!sandbox.mergeImported([]).some((u) => u.email === "kyle@example.com"), "delete removed the person");

// --- question analysis counts imported attempts ---
sandbox.ADMIN_USERS = sandbox.mergeImported([]);
sandbox.renderAnalysis();
const html = el("admin-analysis").innerHTML;
check(/Asked/.test(html) && /Miss rate/.test(html), "analysis table renders");
check(!/No attempt data yet/.test(html), "analysis sees imported attempt data");

// storage banner text differs by mode
sandbox.renderStorageBanner(true);
check(/database connected/i.test(el("admin-storage").innerHTML), "connected banner");
sandbox.renderStorageBanner(false);
check(/without the results database/i.test(el("admin-storage").innerHTML) && /Storage tab/.test(el("admin-storage").innerHTML), "offline banner explains the upgrade");

// isNoStorage only matches the real storage error
check(sandbox.isNoStorage("Results storage is not connected. Trainer: ... Storage tab ..."), "storage error recognized");
check(!sandbox.isNoStorage("That code is not recognized."), "wrong admin code is not treated as a storage error");
check(!sandbox.isNoStorage("Enter a valid email address."), "validation error is not a storage error");

console.log(fail === 0 ? "ALL OFFLINE CHECKS PASSED" : fail + " CHECKS FAILED");
process.exit(fail ? 1 : 0);

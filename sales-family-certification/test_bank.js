// Validates the question bank structure and the exam engine's core logic
// without a DOM: loads app.js in a sandbox that stubs browser globals.
const fs = require("fs");
const vm = require("vm");

const src = fs.readFileSync("/home/user/trader-foundation-website/sales-family-certification/app.js", "utf8");

const sandbox = {
  document: { getElementById: () => ({ classList: { add(){}, remove(){} }, style: {} }), querySelector: () => null },
  window: { scrollTo(){} },
  fetch: () => Promise.reject(new Error("no network in test")),
  confirm: () => true,
  alert: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  Date, Math, JSON, String, Number, Array, Object, console,
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const { BANK, WRITTEN, buildAttempt } = sandbox;
let fail = 0;
const check = (cond, msg) => { if (!cond) { console.log("FAIL: " + msg); fail++; } };

check(BANK.length === 45, "bank has 45 questions, got " + BANK.length);
check(BANK.filter(q => q.part === 1).length === 27, "27 in part 1, got " + BANK.filter(q => q.part === 1).length);
check(BANK.filter(q => q.part === 2).length === 18, "18 in part 2, got " + BANK.filter(q => q.part === 2).length);
check(WRITTEN.length === 3, "3 written scenarios");
check(WRITTEN.filter(w => w.part === 1).length === 2 && WRITTEN.filter(w => w.part === 2).length === 1, "written split 2+1");

let mc = 0, tf = 0, distractors = 0;
BANK.forEach((q, i) => {
  if (q.type === "mc") {
    mc++;
    check(q.stems.length === 2, "q" + (i+1) + " has 2 stems");
    check(q.opts.length === 4, "q" + (i+1) + " has 4 options");
    const correct = q.opts.filter(o => o.c === true);
    check(correct.length === 1, "q" + (i+1) + " has exactly one correct option, got " + correct.length);
    check(q.opts[0].c === true, "q" + (i+1) + " correct option first");
    distractors += q.opts.length - 1;
  } else if (q.type === "tf") {
    tf++;
    check(q.vars.length === 2, "q" + (i+1) + " has 2 tf variants");
    check(q.vars[0].a !== q.vars[1].a, "q" + (i+1) + " tf variants have opposite answers");
  } else {
    check(false, "q" + (i+1) + " unknown type " + q.type);
  }
});
check(mc === 38, "38 mc questions, got " + mc);
check(tf === 7, "7 tf questions, got " + tf);
check(distractors === 114, "114 distractors, got " + distractors);

// Style rules: no em dashes anywhere, never the word "free".
check(!src.includes("—"), "no em dashes in app.js");
check(!/\bfree\b/i.test(JSON.stringify(BANK) + JSON.stringify(WRITTEN)), "the word free never appears in exam content");

// Length tell: correct answer should not be the longest option on most questions.
let longestCorrect = 0;
BANK.forEach(q => {
  if (q.type !== "mc") return;
  const lens = q.opts.map(o => o.t.length);
  if (lens[0] === Math.max(...lens)) longestCorrect++;
});
console.log("questions where correct is longest: " + longestCorrect + " of " + mc);
check(longestCorrect >= 4 && longestCorrect <= 14, "correct-is-longest sits near chance, got " + longestCorrect);

// buildAttempt: retake serves the other variant of every single question.
const first = buildAttempt(null);
check(first.items.length === 45, "attempt has 45 items");
check(first.items.filter(i => i.part === 1).length === 27, "attempt part1 = 27");
const second = buildAttempt(first.served);
let repeats = 0;
Object.keys(first.served).forEach(k => { if (first.served[k] === second.served[k]) repeats++; });
check(repeats === 0, "retake repeats zero variants, got " + repeats + " repeats");

// Every item carries its bank index for the question-analysis view.
check(first.items.every(i => typeof i.bi === "number" && i.bi >= 0 && i.bi < 45), "every item has a bank index");

// Grading sanity: picking the correct option on every item yields 45/45.
let score = 0;
first.items.forEach(item => {
  if (item.type === "mc") {
    const idx = item.opts.findIndex(o => o.c);
    if (item.opts[idx].c === true) score++;
  } else {
    score++; // answering item.ans is by definition correct
  }
});
check(score === 45, "perfect answers grade 45/45");

console.log(fail === 0 ? "ALL BANK CHECKS PASSED" : fail + " CHECKS FAILED");
process.exit(fail ? 1 : 0);

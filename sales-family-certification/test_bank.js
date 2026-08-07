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

const { BANK, buildAttempt, EXAMS, examItems, examTotal, examPassMark, trackOf } = sandbox;
let fail = 0;
const check = (cond, msg) => { if (!cond) { console.log("FAIL: " + msg); fail++; } };

check(BANK.length === 54, "bank has 54 questions, got " + BANK.length);
check(BANK.filter(q => q.part === 1).length === 35, "35 in part 1, got " + BANK.filter(q => q.part === 1).length);
check(BANK.filter(q => q.part === 2).length === 19, "19 in part 2, got " + BANK.filter(q => q.part === 2).length);
check(sandbox.WRITTEN === undefined, "written scenarios are gone; every question is multiple choice");

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
check(mc === 46, "46 mc questions, got " + mc);
check(tf === 8, "8 tf questions, got " + tf);
check(distractors === 138, "138 distractors, got " + distractors);

// Style rules: no em dashes anywhere, never the word "free".
check(!src.includes("—"), "no em dashes in app.js");
check(!/\bfree\b/i.test(JSON.stringify(BANK)), "the word free never appears in exam content");

// Length tell: correct answer should not be the longest option on most questions.
let longestCorrect = 0;
BANK.forEach(q => {
  if (q.type !== "mc") return;
  const lens = q.opts.map(o => o.t.length);
  if (lens[0] === Math.max(...lens)) longestCorrect++;
});
console.log("questions where correct is longest: " + longestCorrect + " of " + mc);
check(longestCorrect >= 4 && longestCorrect <= 14, "correct-is-longest sits near chance, got " + longestCorrect);

// --- the two certifications ---
const tracks = { product: 0, setting: 0, strategy: 0 };
BANK.forEach((q, i) => tracks[trackOf(i)]++);
check(tracks.product === 19, "19 shared product questions, got " + tracks.product);
check(tracks.setting === 16, "16 setting-call questions, got " + tracks.setting);
check(tracks.strategy === 19, "19 strategy-call questions, got " + tracks.strategy);
check(tracks.product + tracks.setting + tracks.strategy === 54, "every question has a track");

// Part Two is strategy only; product/setting live in Part One.
BANK.forEach((q, i) => {
  if (q.part === 2) check(trackOf(i) === "strategy", "q" + (i+1) + " in part 2 is strategy");
  else check(trackOf(i) !== "strategy", "q" + (i+1) + " in part 1 is not strategy");
});

check(examTotal("setter") === 35, "setter test is 35 questions, got " + examTotal("setter"));
check(examTotal("ec") === 38, "EC test is 38 questions, got " + examTotal("ec"));
check(examPassMark("setter") === 28, "setter passes at 28, got " + examPassMark("setter"));
check(examPassMark("ec") === 31, "EC passes at 31, got " + examPassMark("ec"));

// Both exams share the product half, and neither leaks the other's call.
const sItems = examItems("setter"), eItems = examItems("ec");
const shared = sItems.filter((i) => eItems.includes(i));
check(shared.length === 19, "both tests share the 19 product questions, got " + shared.length);
check(shared.every((i) => trackOf(i) === "product"), "everything shared is product knowledge");
check(sItems.every((i) => trackOf(i) !== "strategy"), "setter test contains no strategy-call questions");
check(eItems.every((i) => trackOf(i) !== "setting"), "EC test contains no setting-call questions");

// Nothing from the bank is orphaned by the split.
const covered = new Set([...sItems, ...eItems]);
check(covered.size === 54, "every bank question appears on at least one test, got " + covered.size);
check(!EXAMS.setter.written && !EXAMS.ec.written, "neither exam carries written scenarios");

// The three retired written scenarios each survive as a multiple choice question.
const retired = [
  { probe: "before I get on any Zoom", track: "setting" },
  { probe: "blew up two accounts", track: "setting" },
  { probe: "busy season", track: "strategy" },
];
retired.forEach((r) => {
  const hits = BANK.map((q, bi) => ({ q, bi }))
    .filter(({ q }) => q.type === "mc" && q.stems.some((st) => st.includes(r.probe)));
  check(hits.length === 1, "retired scenario \"" + r.probe + "\" is still tested exactly once, got " + hits.length);
  if (hits.length === 1) check(trackOf(hits[0].bi) === r.track, "\"" + r.probe + "\" sits on the " + r.track + " track");
});

// --- per-exam attempts and retake rotation ---
["setter", "ec"].forEach((k) => {
  const first = buildAttempt(k, null);
  check(first.items.length === examTotal(k), k + ": attempt has " + examTotal(k) + " items, got " + first.items.length);
  check(first.items.every((i) => EXAMS[k].tracks.includes(i.track)), k + ": every item belongs to this exam");
  check(first.items.every((i) => typeof i.bi === "number"), k + ": every item carries a bank index");

  // sections stay in order, questions shuffle within them
  const order = first.items.map((i) => i.track);
  const firstStrategyOrSetting = order.indexOf(EXAMS[k].sections[1].track);
  check(order.slice(0, firstStrategyOrSetting).every((t) => t === "product"), k + ": product section comes first");
  check(order.slice(firstStrategyOrSetting).every((t) => t === EXAMS[k].sections[1].track), k + ": second section is contiguous");

  const second = buildAttempt(k, first.served);
  let repeats = 0;
  Object.keys(first.served).forEach((key) => { if (first.served[key] === second.served[key]) repeats++; });
  check(repeats === 0, k + ": retake serves a different variant of every question, repeats=" + repeats);

  // perfect answers score full marks
  let score = 0;
  first.items.forEach((item) => {
    if (item.type === "mc") { if (item.opts[item.opts.findIndex((o) => o.c)].c === true) score++; }
    else score++;
  });
  check(score === examTotal(k), k + ": perfect answers grade " + examTotal(k) + "/" + examTotal(k));
});

console.log(fail === 0 ? "ALL BANK CHECKS PASSED" : fail + " CHECKS FAILED");
process.exit(fail ? 1 : 0);

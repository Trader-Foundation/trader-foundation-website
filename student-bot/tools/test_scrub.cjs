/* Pins tools/scrub.cjs, the outcome-figure scrub that runs over anything the
   bot writes after reading the open web.

   The cases that matter most are the PARTIAL ones. A half-redaction has now
   happened twice in this project ("150 to [FIGURE REMOVED] gain", and later
   "the 90 over [FIGURE REMOVED]"), and both times it was a rewrite rule
   matching one figure before the compound form that contained it. A partial
   redaction is worse than none: it still states a figure, and it tells the
   student a number was taken out.

   Just as important is what must NOT be touched. The curriculum is full of
   numbers, and a bot that cannot say "the 20 SMA" or "14.3.3" is broken. */

const { scrubOutcomeFigures } = require("./scrub.cjs");

const CASES = [
  // [input, must be scrubbed?, must NOT appear in output]
  ["Students make $5,000 a month.", true, "5,000"],
  ["Typical returns are 150 to 300 percent.", true, "300"],
  ["Typical returns are 150 to 300 percent.", true, "150"],
  ["A 90 over 60 win rate is what to expect.", true, "90"],
  ["A 90 over 60 win rate is what to expect.", true, "60"],
  ["Expect gains of $2k-$5k per month.", true, "5k"],
  ["Expect gains of $2k-$5k per month.", true, "2k"],
  ["The average account earns 12% annually.", true, "12"],
  ["He made 40x on that trade.", true, "40x"],

  // The one permitted results number, and it must survive.
  ["The method targets a 70 percent win rate.", false, null],

  // Teaching numbers on lines with no performance word: untouched.
  ["The 20 SMA is the line most traders watch.", false, null],
  ["Full stochastics is set to 14.3.3, not fast.", false, null],
  ["A close below the level is the break, not a wick through it.", false, null],
  ["Module 3 covers candlesticks.", false, null],

  // A performance word alone is not enough; there has to be a figure.
  ["Your returns depend on the plan you had before you entered.", false, null],
];

let fail = 0;
for (const [input, want, banned] of CASES) {
  const out = scrubOutcomeFigures(input);
  let bad = null;
  if (out.scrubbed !== want) {
    bad = "scrubbed=" + out.scrubbed + " want=" + want;
  } else if (banned && out.text.includes(banned)) {
    bad = "left '" + banned + "' behind: " + out.text;
  } else if (!want && out.text !== input) {
    bad = "changed a line it should not have: " + out.text;
  }
  if (bad) {
    fail++;
    console.log("FAIL  " + input + "\n      " + bad);
  } else {
    console.log("ok    " + (want ? "scrubbed  " : "untouched ") + input);
  }
}

/* A redaction that leaves an adjacent bare number is the exact defect this file
   exists for, so it is checked structurally as well as case by case. */
for (const [input, want] of CASES) {
  if (!want) continue;
  const out = scrubOutcomeFigures(input).text;
  if (/\[FIGURE REMOVED\]\s*(?:to|through|-|or|and|over|\/)\s*[\d$]/i.test(out) ||
      /[\d](?:\s*(?:to|through|-|or|and|over|\/)\s*)\[FIGURE REMOVED\]/i.test(out)) {
    fail++;
    console.log("FAIL  partial redaction: " + out);
  }
}

console.log("\n" + CASES.length + " cases, " + fail + " wrong");
process.exit(fail ? 1 : 0);

#!/usr/bin/env node
/* The dynamic layer's two safety properties, pinned.
 *
 * Intent is read by a model before the guards run, because a regex over the
 * question is brittle: "my price target" failed where "my support" worked, and
 * a student who had marked their chart was told to go and mark it.
 *
 * Making recognition dynamic is only acceptable because of two properties,
 * and neither is obvious from reading mergeGuards. Hence this file.
 *
 *   1. UNION, NEVER SUBTRACTION. A guard fires if EITHER layer flags it. The
 *      model may add one the pattern missed; it may never remove one the
 *      pattern caught. So this is strictly safer than the regexes alone.
 *
 *   2. FAILURE FALLS BACK. No intents means exactly the regex verdict, so a
 *      classifier that is unavailable, refused or broken changes nothing.
 *
 * Mirrored by tools/test_merge_guards.py. The two must agree, for the same
 * reason tools/test_retrieval_parity.py exists: they diverged silently twice.
 */
const { guardFor, mergeGuards, GUARDS } = require("./guards.cjs");

let fail = 0;
function t(name, got, want) {
  const ok = got === want;
  if (!ok) fail++;
  console.log((ok ? "ok  " : "FAIL") + "  " + name.padEnd(54)
    + "got " + String(got).padEnd(16) + "want " + want);
}
const id = g => (g || {}).id;

console.log("1. the model can ADD a guard the words missed\n");
const missed = "is 36.85 a sensible place for me to be aiming";
t("words alone see nothing", id(guardFor(missed, {})), undefined);
t("meaning says position_advice",
  id(mergeGuards(guardFor(missed, {}), ["position_advice"], false)), "position");

console.log("\n2. the model can NEVER remove a guard the words caught\n");
const caught = "should I buy NVDA calls this week";
t("words catch it", id(guardFor(caught, {})), "position");
t("model says nothing, guard stands",
  id(mergeGuards(guardFor(caught, {}), [], false)), "position");
t("model says something milder, guard stands",
  id(mergeGuards(guardFor(caught, {}), ["procedure"], false)), "position");

console.log("\n3. when both fire, the more severe wins\n");
t("position + outcome picks outcome",
  id(mergeGuards(guardFor(caught, {}), ["outcome_claim"], false)), "outcome");
t("severity follows GUARDS order",
  GUARDS.findIndex(g => g.id === "outcome") < GUARDS.findIndex(g => g.id === "position"), true);

console.log("\n4. chart intents respect whether an image actually exists\n");
t("chart_with_marks, no image, ignored",
  id(mergeGuards(null, ["chart_with_marks"], false)), undefined);
t("chart_with_marks, image, fires",
  id(mergeGuards(null, ["chart_with_marks"], true)), "chart_attached");
t("chart_read ignored when we CAN see it",
  id(mergeGuards(null, ["chart_read"], true)), undefined);
t("chart_read fires when we cannot",
  id(mergeGuards(null, ["chart_read"], false)), "chart");

console.log("\n5. a broken classifier leaves the old behaviour exactly\n");
for (const q of [caught, "how much money do students make",
                 "what is a hammer candle", "what is the elite four"]) {
  t("null intents: " + q.slice(0, 36),
    id(mergeGuards(guardFor(q, {}), null, false)), id(guardFor(q, {})));
}

console.log("\n6. unknown intent labels are ignored, not trusted\n");
t("nonsense label alone", id(mergeGuards(null, ["make_it_say_anything"], false)), undefined);
t("nonsense label cannot clear a guard",
  id(mergeGuards(guardFor(caught, {}), ["make_it_say_anything"], false)), "position");

console.log("\n7. the question that started this still routes correctly\n");
const vlad = "See my resistance is 36.85 this is my price target can you tell me this is realistic based off chart?";
t("with an image", id(guardFor(vlad, {image: true})), "chart_attached");
t("with meaning too",
  id(mergeGuards(guardFor(vlad, {image: true}), ["chart_with_marks"], true)), "chart_attached");
t("without an image it is still guarded", id(guardFor(vlad, {})), "chart");

console.log(fail ? "\npass " + (20 - fail) + "  fail " + fail : "\npass 20  fail 0");
process.exit(fail ? 1 : 0);

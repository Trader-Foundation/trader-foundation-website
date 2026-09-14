#!/usr/bin/env python3
"""The Python half of the dynamic layer's safety properties.

Mirrors tools/test_merge_guards.cjs case for case, and then checks the two
implementations against each other on the same inputs.

That last part is the point. ask.py and guards.cjs have silently diverged twice
in this project, which is why tools/test_retrieval_parity.py exists for
retrieval. The guards now carry a second copy of the same logic, so they need
the same treatment: agreeing today is not evidence they will agree tomorrow.
"""
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("ask", ROOT / "tools" / "ask.py")
ask = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ask)

fails = []


def t(name, got, want):
    ok = got == want
    if not ok:
        fails.append(name)
    print(f"{'ok  ' if ok else 'FAIL'}  {name:<54}got {str(got):<16}want {want}")


def gid(g):
    return g["id"] if g else None


print("1. the model can ADD a guard the words missed\n")
missed = "is 36.85 a sensible place for me to be aiming"
t("words alone see nothing", gid(ask.guard_for(missed)), None)
t("meaning says position_advice",
  gid(ask.merge_guards(ask.guard_for(missed), ["position_advice"])), "position")

print("\n2. the model can NEVER remove a guard the words caught\n")
caught = "should I buy NVDA calls this week"
t("words catch it", gid(ask.guard_for(caught)), "position")
t("model says nothing, guard stands",
  gid(ask.merge_guards(ask.guard_for(caught), [])), "position")
t("model says something milder, guard stands",
  gid(ask.merge_guards(ask.guard_for(caught), ["procedure"])), "position")

print("\n3. when both fire, the more severe wins\n")
t("position + outcome picks outcome",
  gid(ask.merge_guards(ask.guard_for(caught), ["outcome_claim"])), "outcome")
order = [g[0] for g in ask.GUARDS]
t("severity follows GUARDS order",
  order.index("outcome") < order.index("position"), True)

print("\n4. chart intents respect whether an image actually exists\n")
t("chart_with_marks, no image, ignored",
  gid(ask.merge_guards(None, ["chart_with_marks"], False)), None)
t("chart_with_marks, image, fires",
  gid(ask.merge_guards(None, ["chart_with_marks"], True)), "chart_attached")
t("chart_read ignored when we CAN see it",
  gid(ask.merge_guards(None, ["chart_read"], True)), None)
t("chart_read fires when we cannot",
  gid(ask.merge_guards(None, ["chart_read"], False)), "chart")

print("\n5. a broken classifier leaves the old behaviour exactly\n")
for q in [caught, "how much money do students make",
          "what is a hammer candle", "what is the elite four"]:
    t("none intents: " + q[:36],
      gid(ask.merge_guards(ask.guard_for(q), None)), gid(ask.guard_for(q)))

print("\n6. unknown intent labels are ignored, not trusted\n")
t("nonsense label alone", gid(ask.merge_guards(None, ["make_it_say_anything"])), None)
t("nonsense label cannot clear a guard",
  gid(ask.merge_guards(ask.guard_for(caught), ["make_it_say_anything"])), "position")

print("\n7. the question that started this still routes correctly\n")
vlad = ("See my resistance is 36.85 this is my price target can you tell me "
        "this is realistic based off chart?")
t("with an image", gid(ask.guard_for(vlad, {"image": True})), "chart_attached")
t("with meaning too",
  gid(ask.merge_guards(ask.guard_for(vlad, {"image": True}), ["chart_with_marks"], True)),
  "chart_attached")
t("without an image it is still guarded", gid(ask.guard_for(vlad)), "chart")

# ---------------------------------------------------------------------------
print("\n8. Python and JavaScript agree, question by question\n")

CASES = [
    (caught, False, []),
    (caught, False, ["outcome_claim"]),
    (missed, False, ["position_advice"]),
    (vlad, True, ["chart_with_marks"]),
    (vlad, False, []),
    ("how much do students make", False, []),
    ("what is a hammer candle", False, []),
    ("what is the elite four", False, []),
    ("what do you think of this chart", True, []),
    ("where do i click to set up thinkorswim", False, []),
    ("will TSLA go up next week", False, []),
    ("check my levels", True, ["chart_with_marks"]),
    ("is my line at 36.85 any good", True, []),
    ("anything at all", False, ["prediction"]),
    ("anything at all", False, ["retired_term"]),
]

js = ROOT / "tools" / "_parity_probe.cjs"
js.write_text(
    'const {guardFor, mergeGuards} = require("./guards.cjs");\n'
    'const cases = JSON.parse(process.argv[2]);\n'
    'console.log(JSON.stringify(cases.map(([q, img, intents]) => {\n'
    '  const g = mergeGuards(guardFor(q, {image: img}), intents, img);\n'
    '  return g ? g.id : null;\n'
    '})));\n'
)
try:
    out = subprocess.run(["node", str(js), json.dumps(CASES)],
                         capture_output=True, text=True, cwd=ROOT / "tools")
    if out.returncode != 0:
        print("FAIL  node probe failed:", out.stderr.strip()[:200])
        fails.append("node probe")
        js_ids = [None] * len(CASES)
    else:
        js_ids = json.loads(out.stdout)
finally:
    js.unlink(missing_ok=True)

for (q, img, intents), j in zip(CASES, js_ids):
    p = gid(ask.merge_guards(ask.guard_for(q, {"image": img}), intents, img))
    label = ("[img] " if img else "") + q[:34] + (" +" + ",".join(intents) if intents else "")
    t(label[:54], p, j)

print(f"\npass {len(CASES) + 20 - len(fails)}  fail {len(fails)}")
sys.exit(1 if fails else 0)

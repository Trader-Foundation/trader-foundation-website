#!/usr/bin/env python3
"""Assemble the published bot page from the repo, and refuse to ship a broken one.

    python3 tools/build_artifact.py            # writes tools/artifact.build.html

**Why this exists.** The page was hand-patched every time it changed, and it
went wrong twice in ways nobody noticed until a student hit them:

1. It lost its entire retrieval and rendering blocks. It called index(), search(),
   toks(), cite(), esc(), fmt(), renderEvidence() and guardBanner() and defined
   none of them, so index() threw at boot, the rest of the boot script never ran,
   the send button was never wired, and pressing Enter did nothing. That was the
   "no response" bug, live for days.
2. It shipped a guard version behind the repo, so a question the suites passed
   was still being refused in the thing being tested.

Vlad, after another round: "we have been testing this thing so ofrten so idk why
we cant have it ready." That is the answer. The curriculum layer was tested and
the shell around it was assembled by hand, so every round of testing exercised
something that could not be reproduced from what the tests checked.

So the page is now a template plus two injected blobs, and this script checks the
result before anyone publishes it. The checks are the point, not the assembly.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "artifact-page.html"
OUT = ROOT / "tools" / "artifact.build.html"

# The platform caps one call's input. The operating instructions ride on every
# question, so the page carries a trimmed copy and the rest of the budget pays
# for retrieved passages.
PROMPT_CAP = 65536
PROMPT_BUDGET = 56000          # leaves room for passages, history and framing

# Sections are dropped from the back to fit, and in practice that means
# "Standing content notes" goes. That is deliberate rather than a loss, and it
# is what the page has always shipped: every subsection in it corresponds to a
# file in rulings/, which is indexed and retrieved when the question is about
# it. Carrying 27 KB of curriculum notes on EVERY question, most of them
# irrelevant to the one asked, buys nothing that retrieval does not already do,
# and it would cost the passage budget that makes an answer specific.
#
# The behavioural rules, the ones that must apply to every answer whether or not
# it retrieves anything, all sit above it and are never trimmed.

# Every function the page calls that it must also define. Both past failures
# would have been caught here.
REQUIRED = [
    "toks", "stem", "index", "expand", "search", "cite",
    "esc", "fmt", "renderEvidence", "guardBanner",
    "guardFor", "mergeGuards", "report", "turn", "ask", "classify",
    "renderScript", "verdictBar", "slugFor",
]

# Guard verdicts the built page must reproduce. Two of these are the exact cases
# that were wrong in a shipped build.
GUARD_CASES = [
    ("position", "should I buy NVDA calls this week"),
    ("position", "should i buy nvda"),
    ("position", "what should i buy"),
    ("position", "how many contracts should i take on NVDA"),
    ("position", "how many contracts should i take on this trade"),
    (None,       "how many contracts should i take"),
    (None,       "when would i buy a straddle"),
    (None,       "how do i sell a covered call"),
    (None,       "why do brokers not let me sell naked calls"),
    (None,       "what is a covered call"),
    ("outcome",  "how much money do students make"),
    ("outcome",  "what kind of returns should i expect"),
    ("retired",  "what is the elite four"),
    ("chart",    "what do you think of this chart"),
    ("procedure", "where do i click to set up thinkorswim"),
]


def pretty(title):
    """Turn a source filename into something a student can go and find.
    Mirrors pretty() in tools/ask.py."""
    t = re.sub(r"^(module-\d+-|module-)", "", str(title or ""))
    t = re.sub(r"[-_]?(UNNUMBERED|SLIDES)$", "", t)
    t = re.sub(r"[-_]?UNNUMBERED$", "", t)
    t = re.sub(r"\.(txt|md)$", "", t)
    return t.replace("-", " ").replace("_", " ").strip().title()


def slim_corpus():
    chunks = json.loads((ROOT / "corpus/chunks.json").read_text())
    return [{
        "t": c["text"], "c": c["course"], "m": c["module"],
        "n": pretty(c["module_title"]), "p": c["part"],
        "d": c.get("recording_date") or "", "ts": c.get("timestamp") or "",
        "e": bool(c.get("timestamp_estimated")), "g": c["tag"],
    } for c in chunks]


def trimmed_prompt():
    """The operating instructions, cut to the byte budget at section joins.

    Whole sections are dropped from the back rather than the text being
    truncated, because half a rule is worse than no rule: the model reads the
    opening of a constraint and never sees the exception that makes it correct.
    """
    full = (ROOT / "prompts/system.md").read_text()
    if len(full.encode()) <= PROMPT_BUDGET:
        return full, []
    parts = re.split(r"(?=^## )", full, flags=re.M)
    kept, dropped, size = [], [], 0
    full_up = True
    for part in parts:
        n = len(part.encode())
        # Contiguous prefix, deliberately. A greedy fit kept whatever happened
        # to be small enough after a big section was dropped, so the shipped
        # prompt depended on section LENGTHS rather than on their order, and
        # "Behaviour checklist" fell out while a later section survived.
        # system.md is now ordered so that everything after the cut is the
        # designated overflow.
        if full_up and size + n <= PROMPT_BUDGET:
            kept.append(part)
            size += n
        else:
            full_up = False
            head = part.strip().split("\n", 1)[0]
            if head:
                dropped.append(head)
    return "".join(kept), dropped


def check_defined(script):
    """Every REQUIRED name must be declared, not merely called."""
    missing = []
    for name in REQUIRED:
        declared = re.search(
            r"(?:^|\n)\s*(?:async\s+)?function\s+%s\b|"
            r"(?:^|\n)\s*(?:const|let|var)\s+%s\s*=" % (name, name), script)
        if not declared:
            missing.append(name)
    return missing


def check_guards(path):
    """Run the built page's own guard code, not the repo's."""
    probe = ROOT / "tools" / "_artifact_guard_probe.cjs"
    probe.write_text(
        'const fs=require("fs");\n'
        'const h=fs.readFileSync(process.argv[2],"utf8");\n'
        'const s=h.indexOf("const NOT_TICKERS"), e=h.indexOf("const CANDIDATES");\n'
        'if(s<0||e<0){console.log(JSON.stringify({error:"guard block not found"}));process.exit(0);}\n'
        'const {GUARDS}=new Function(h.slice(s,e)+"; return {GUARDS};")();\n'
        'const cases=JSON.parse(process.argv[3]);\n'
        'console.log(JSON.stringify(cases.map(([,q])=>{\n'
        '  const g=GUARDS.find(r=>r.test(q,{}));\n'
        '  return g?g.id:null;\n'
        '})));\n')
    try:
        run = subprocess.run(["node", str(probe), str(path), json.dumps(GUARD_CASES)],
                             capture_output=True, text=True)
        if run.returncode != 0:
            return [("node probe failed", run.stderr.strip()[:200], "")]
        got = json.loads(run.stdout)
    finally:
        probe.unlink(missing_ok=True)
    return [(q, want, g) for (want, q), g in zip(GUARD_CASES, got) if g != want]


def main():
    if not TEMPLATE.exists():
        sys.exit(f"no template at {TEMPLATE}")
    html = TEMPLATE.read_text(encoding="utf-8")

    corpus = slim_corpus()
    prompt, dropped = trimmed_prompt()

    for token in ("/*__CHUNKS__*/[]", "/*__PROMPT__*/\"\""):
        if html.count(token) != 1:
            sys.exit(f"template must contain exactly one {token}")
    html = html.replace("/*__CHUNKS__*/[]", json.dumps(corpus, separators=(",", ":")))
    html = html.replace("/*__PROMPT__*/\"\"", json.dumps(prompt))

    OUT.write_text(html, encoding="utf-8")
    script = html[html.index("<script>") + 8:html.rindex("</script>")]

    print(f"chunks   {len(corpus):,}")
    print(f"prompt   {len(prompt.encode()):,} bytes of a {PROMPT_CAP:,} cap, "
          f"{PROMPT_CAP - len(prompt.encode()):,} left for passages")
    if dropped:
        print(f"         {len(dropped)} section(s) dropped to fit:")
        for d in dropped:
            print(f"           {d}")
    print(f"size     {OUT.stat().st_size / 1024 / 1024:.2f} MB -> {OUT}")

    fails = []

    missing = check_defined(script)
    print(f"\n{'ok  ' if not missing else 'FAIL'}  every called function is defined"
          + (f": missing {', '.join(missing)}" if missing else f" ({len(REQUIRED)} checked)"))
    if missing:
        fails.append("missing functions")

    tmp = ROOT / "tools" / "_syntax_check.js"
    tmp.write_text(script)
    try:
        node = subprocess.run(["node", "--check", str(tmp)],
                              capture_output=True, text=True)
    finally:
        tmp.unlink(missing_ok=True)
    ok = node.returncode == 0
    print(f"{'ok  ' if ok else 'FAIL'}  the page script parses"
          + ("" if ok else ": " + node.stderr.strip().split("\n")[0]))
    if not ok:
        fails.append("syntax")

    wrong = check_guards(OUT)
    print(f"{'ok  ' if not wrong else 'FAIL'}  guards agree with the repo "
          f"({len(GUARD_CASES)} cases)")
    for q, want, got in wrong:
        print(f"        wanted {want}, got {got}: {q}")
        fails.append("guard")

    over = len(prompt.encode()) > PROMPT_CAP
    print(f"{'ok  ' if not over else 'FAIL'}  the prompt fits inside the cap")
    if over:
        fails.append("prompt too large")

    print()
    if fails:
        print(f"NOT SHIPPABLE: {len(fails)} check(s) failed")
        sys.exit(1)
    print("All checks pass. Publish tools/artifact.build.html.")


if __name__ == "__main__":
    main()

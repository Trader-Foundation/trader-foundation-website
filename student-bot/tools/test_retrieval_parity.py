#!/usr/bin/env python3
"""Check that ask.py and bench.html retrieve the same passages in the same order.

Why this exists: the two implementations have silently diverged twice. First the
stemmer, where the JS returned early on "losses" and Python fell through. Then
the guard rules, where ask.py never picked up a position guard fix and refused
four questions the bench answered.

Both times the damage was the same and it is worse than a wrong answer: **the
bench is what we test with.** If it scores differently from the tool, then every
test result is a statement about a system nobody ships. A passing suite stops
meaning anything.

This runs the bench's own retrieval block headless under node, against the same
corpus, and compares the top hits question by question.

Usage:
    python3 tools/test_retrieval_parity.py
    python3 tools/test_retrieval_parity.py --n 8
"""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

# Deliberately mixed: plain content questions, the alias bridges, a ruling that
# has to outrank the transcript it overrides, and the two phrasings that have
# broken before.
QUERIES = [
    "what is a marubozu",
    "what is a spinning top",
    "what is a long upper shadow",
    "i keep seeing red on my position",
    "my position is down should i be worried",
    "i am scared to lose money",
    "i am nervous about this trade",
    "how do i know if my price target is realistic",
    "why do coaches use price alerts",
    "what does volume tell me",
    "how do i find support and resistance",
    "where do levels come from",
    "what is greed in trading",
    "how do i pick which strike to sell",
    "what is the maximum profit on a call",
    "how do i use full stochastics",
    "what happens if my spread expires between the strikes",
    "what is an inverted hammer",
]


def bench_hits(n):
    """Run the bench page's retrieval block under node and return its top hits."""
    html = (ROOT / "tools/bench.html").read_text()
    chunks = (ROOT / "corpus/chunks.json").read_text()
    try:
        start = html.index("/* ---------------- retrieval ----------------")
        end = html.index("/* ---------------- rendering ----------------")
    except ValueError:
        sys.exit("bench.html section markers moved; update this script's slice")
    js = (f"const CHUNKS = {chunks};\n{html[start:end]}\nindex();\n"
          f"const qs = {json.dumps(QUERIES)};\n"
          f"console.log(JSON.stringify(qs.map(q => "
          f"search(q,{n}).map(r => r.chunk.text.slice(0,70)))));\n")
    tmp = ROOT / "corpus/.parity.js"
    tmp.write_text(js)
    try:
        r = subprocess.run(["node", str(tmp)], capture_output=True, text=True)
    finally:
        tmp.unlink(missing_ok=True)
    if r.returncode or not r.stdout.strip():
        sys.exit("bench retrieval failed to run:\n" + r.stderr[:2000])
    return json.loads(r.stdout)


def main():
    n = 5
    if "--n" in sys.argv:
        n = int(sys.argv[sys.argv.index("--n") + 1])
    import ask

    js = bench_hits(n)
    bad = 0
    for q, jhits in zip(QUERIES, js):
        py = [c["text"][:70] for _, c in ask.search(q, n)]
        if py == jhits:
            continue
        bad += 1
        print(f"MISMATCH: {q}")
        for i in range(max(len(py), len(jhits))):
            a = py[i] if i < len(py) else None
            b = jhits[i] if i < len(jhits) else None
            if a != b:
                print(f"  rank {i+1}\n    ask.py={a!r}\n    bench ={b!r}")
    print(f"{len(QUERIES)} queries at top {n}, {bad} mismatches")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Probe corpus coverage across the curriculum.

Retrieval quality is not uniform, and averages hide the holes. This runs a
fixed topic list through the same retrieval the bot uses and reports the top
BM25 score per topic, so a gap shows up as a number rather than as a vague
sense that the bot is weak on something.

A top score under 8 means the corpus has nothing that squarely answers it.
A score of 0 means nothing matched at all.
"""
import json, subprocess, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TOPICS = [
    ("TA basics", "support and resistance"), ("TA basics", "what is a trend"),
    ("TA basics", "higher highs and higher lows"), ("TA basics", "what is volume telling me"),
    ("Candles", "what is a marubozu"), ("Candles", "bullish engulfing candle"),
    ("Candles", "what is a doji"), ("Candles", "inverted hammer"),
    ("Indicators", "full stochastics"), ("Indicators", "bullish divergence"),
    ("Indicators", "moving averages"), ("Indicators", "bollinger bands"),
    ("Indicators", "fibonacci retracement"),
    ("Options", "what is a call option"), ("Options", "what is theta"),
    ("Options", "bull call spread"), ("Options", "credit spread"),
    ("Options", "paycheck collector"), ("Options", "implied volatility"),
    ("Method", "is it the first day"), ("Method", "risk versus reward"),
    ("Method", "perceived edge"), ("Method", "when do i take profit"),
    ("Method", "how do i screen for stocks"), ("Method", "position sizing"),
    ("Method", "what is a breakout"), ("Method", "cup and handle"),
    ("Risk", "how do i manage risk"), ("Risk", "stop loss"),
    ("Psych", "trading psychology"), ("Psych", "revenge trading"),
]
THIN = 8.0

def main():
    rows = []
    for area, q in TOPICS:
        out = subprocess.run([sys.executable, str(ROOT / "tools/ask.py"), "--json", q],
                             capture_output=True, text=True).stdout
        ps = json.loads(out)["passages"]
        rows.append((area, q, ps[0]["score"] if ps else 0.0,
                     ps[0]["cite"].split(",")[0] if ps else "-"))
    print(f"{'area':<10} {'question':<32} {'top':>5}  best source")
    print("-" * 84)
    for area, q, top, src in rows:
        print(f"{area:<10} {q:<32} {top:>5.1f}  {src}"
              + ("   THIN" if top < THIN else ""))
    thin = [r for r in rows if r[2] < THIN]
    print(f"\n{len(thin)} of {len(rows)} topics retrieve weakly (top score under {THIN})")
    for area, q, top, _ in thin:
        print(f"  {area}: {q} ({top:.1f})")

if __name__ == "__main__":
    main()

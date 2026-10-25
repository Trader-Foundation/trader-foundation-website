import sys, re, json, pathlib, math
sys.path.insert(0, "tools")
import ask

NUM = [("what is the 13 and 20 for", "13"),
       ("what are the 50 and 200 day moving averages", "200"),
       ("what are the fibonacci levels 38.2 50 61.8", "38.2"),
       ("what is full stochastics 14.3.3", "14.3"),
       ("what delta should i sell at 0.07", "0.07"),
       ("what does a 30 to 37 day expiration mean", "37")]
REG = [("what is a marubozu","ruling"),("why do coaches use price alerts","written"),
       ("what is revenge trading","written"),("what is a doji","tf-core"),
       ("how much should i risk per trade","written"),("what is an iron condor","tf-options"),
       ("what is a pennant","tf-core"),("i cut winners too early","written"),
       ("what does an upper wick mean","ruling"),("what is technical analysis","tf-core")]

def rebuild(pattern):
    ask.toks = lambda s, p=pattern: [ask.stem(w) for w in re.findall(p, s.lower())
                                     if w not in ask.STOP and len(w) > 1]
    ask.DOCS, ask.DF = [], {}
    for c in ask.CHUNKS:
        tf = {}
        t = ask.toks(c["text"])
        for w in t: tf[w] = tf.get(w, 0) + 1
        for w in tf: ask.DF[w] = ask.DF.get(w, 0) + 1
        ask.DOCS.append((c, tf, len(t)))
    ask.AVG = sum(d[2] for d in ask.DOCS) / max(1, len(ask.DOCS))

for label, pat in [("current  ", r"[a-z][a-z0-9']+"),
                   ("+numbers ", r"[a-z][a-z0-9']+|\d+(?:\.\d+)*")]:
    rebuild(pat)
    hits = sum(1 for q, _ in NUM if ask.search(q, 8))
    strong = sum(1 for q, _ in NUM if ask.search(q,1) and ask.search(q,1)[0][0] >= 10)
    ok = sum(1 for q, e in REG if ask.search(q,1) and ask.search(q,1)[0][1]["course"] == e)
    print(f"{label} numeric answerable {hits}/6, strong {strong}/6 | regressions ok {ok}/10 | vocab {len(ask.DF)}")

import re, sys, pathlib
src = pathlib.Path("tools/build_corpus.py").read_text()
i = src.index("SUSPECT = [")
# Close on a bracket that starts a line, not one inside a character class.
j = re.search(r"^\]", src[i:], re.M).end() + i
ns = {"re": re}
exec(src[i:j], ns)
SUSPECT = ns["SUSPECT"]
print(f"{len(SUSPECT)} patterns loaded\n")
tests = [
    ("guaranteed premiums", True),
    ("it's guaranteed to get filled at 15 cents", True),
    ("you will get guaranteed returns every month", True),
    ("about 10 percent of your account 10 percent a week", True),
    ("this is passive income", True),
    ("risk free returns on this trade", True),
    ("none of this is guaranteed", False),
    ("I can't guarantee any of these moves and I will never act like I can", False),
    ("only two things guaranteed on the market are contraction and expansion", False),
    ("downgraded from AAA or risk free to AA plus", False),
    ("there's no guarantee, but there's got to be signals", False),
    ("certain is like guaranteeing stuff and I can't do that", False),
]
bad = 0
for text, want in tests:
    got = any(re.search(p, text, re.I) for p in SUSPECT)
    ok = got == want
    bad += not ok
    print(f"  {'ok  ' if ok else 'BAD '} flags={str(got):5} want={str(want):5} {text[:58]}")
print(f"\n{len(tests)} cases, {bad} wrong")
sys.exit(1 if bad else 0)

#!/usr/bin/env python3
"""Inline the corpus, the test set and the guard rules into a standalone bench page."""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
chunks = json.loads((root/'corpus/chunks.json').read_text())
tests  = json.loads((root/'tests/questions.json').read_text())
guards = (root/'tools/guards.cjs').read_text()
guards = guards.replace("if (typeof module !== 'undefined') module.exports = { GUARDS, TICKER };", "")

keep = ('chunk_id','course','module','module_title','timestamp','timestamp_estimated',
        'part','tag','text','recording_date','source_file')
slim = [{k:c[k] for k in keep} for c in chunks]

html = (root/'tools/bench.html').read_text()
html = html.replace('/*__CHUNKS__*/[]', json.dumps(slim, separators=(',',':')))
html = html.replace('/*__TESTS__*/{}',  json.dumps(tests, separators=(',',':')))
html = html.replace('/*__GUARDS__*/', guards)
for token in ('/*__CHUNKS__*/', '/*__TESTS__*/', '/*__GUARDS__*/'):
    assert token not in html, f'unreplaced {token}'
assert 'GUARDS' in html and 'const CHUNKS' in html
out = root/'tools/bench.build.html'
out.write_text(html)
print(f'chunks {len(slim)}  size {out.stat().st_size/1024/1024:.2f} MB  -> {out}')

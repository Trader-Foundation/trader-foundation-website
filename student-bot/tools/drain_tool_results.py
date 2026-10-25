#!/usr/bin/env python3
"""Decode Drive downloads that the harness spilled to disk.

When a download_file_content result is too large for the conversation, the
harness writes the JSON to a tool-results file instead. That is the cheap
path: the transcript never crosses the context window. This drains those
files into transcripts/raw/fb-live/ using the Drive title for the name.
"""
import base64, json, pathlib, re, sys

# The tool-results directory is per session, so it cannot be hardcoded.
# Order: explicit argument, then TOOL_RESULTS_DIR, then the newest session
# directory that actually holds spilled Drive downloads.
def find_tool_results():
    import os
    if len(sys.argv) > 1:
        return pathlib.Path(sys.argv[1])
    if os.environ.get("TOOL_RESULTS_DIR"):
        return pathlib.Path(os.environ["TOOL_RESULTS_DIR"])
    projects = pathlib.Path.home() / ".claude/projects"
    dirs = list(projects.glob("*/*/tool-results"))
    if not dirs:
        sys.exit("no tool-results directory found; pass one as an argument "
                 "or set TOOL_RESULTS_DIR")
    # Prefer one with pending downloads. An empty directory is the normal
    # steady state after a drain, not an error.
    pending = [d for d in dirs
               if any(d.glob("mcp-Google_Drive-download_file_content-*.txt"))]
    return max(pending or dirs, key=lambda d: d.stat().st_mtime)

TOOL_RESULTS = find_tool_results()
OUT = pathlib.Path(__file__).resolve().parent.parent / "transcripts/raw/fb-live"
OUT.mkdir(parents=True, exist_ok=True)

def slug(title):
    stem = re.sub(r"\.txt$", "", title)
    m = re.match(r"(\d{4})\s*-\s*(\d{4}-\d{2}-\d{2})\s*-\s*(.+)", stem)
    if m:
        num, date, rest = m.groups()
        rest = re.sub(r"[^A-Za-z0-9]+", "_", rest).strip("_")
        return f"{num}__{date}__{rest}.txt"
    return re.sub(r"[^A-Za-z0-9._-]+", "_", stem) + ".txt"

written, skipped, failed = [], [], []
for f in sorted(TOOL_RESULTS.glob("mcp-Google_Drive-download_file_content-*.txt")):
    try:
        data = json.loads(f.read_text(encoding="utf-8", errors="replace"))
        title, b64 = data["title"], data["content"]
        raw = base64.b64decode(b64)
    except Exception as e:
        failed.append((f.name, str(e)[:80])); continue
    dest = OUT / slug(title)
    if dest.exists() and dest.read_bytes() == raw:
        skipped.append(dest.name); continue
    dest.write_bytes(raw)
    written.append((dest.name, len(raw)))
    f.unlink()   # drained, do not re-process

for n, size in written:
    print(f"  wrote {n}  {size:,} bytes")
if skipped: print(f"  already present: {len(skipped)}")
for n, e in failed: print(f"  FAILED {n}: {e}")
print(f"written {len(written)}  skipped {len(skipped)}  failed {len(failed)}")


/* ---------------- rendering ----------------

   RESTORED alongside the retrieval block above, and missing for the same
   reason. esc, fmt, renderEvidence and guardBanner were all called and none
   were defined. Written against the page's existing CSS: .psgs/.psg/.cite/
   .layer/.bar/.sc for evidence, .guard with tone classes stop/caution/clear. */

const esc = s => String(s == null ? "" : s)
  .replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));

/* The answer arrives as plain text with light markdown. Deliberately small:
   bold, inline code, headings, bullets and paragraphs, everything escaped
   first so a passage can never inject markup into the page. */
function fmt(text){
  const lines = String(text || "").split(/\n/);
  const out = [];
  let list = null;
  const flush = () => { if (list){ out.push("<ul>" + list.join("") + "</ul>"); list = null; } };
  const inline = s => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
  for (const raw of lines){
    const line = raw.trim();
    if (!line){ flush(); continue; }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet){ (list = list || []).push("<li>" + inline(bullet[1]) + "</li>"); continue; }
    flush();
    const head = line.match(/^(#{1,4})\s+(.*)$/);
    if (head){ out.push("<h4>" + inline(head[2]) + "</h4>"); continue; }
    out.push("<p>" + inline(line) + "</p>");
  }
  flush();
  return out.join("") || "<p></p>";
}

/* The evidence pane is the honesty of this page: it shows every passage the
   answer was allowed to use, with its score and its content layer, so a wrong
   answer can be traced to retrieval or to wording. */
function renderEvidence(hits){
  const pane = document.getElementById("ev");
  const count = document.getElementById("ev-n");
  if (count) count.textContent = hits && hits.length ? hits.length : "";
  if (!pane) return;
  if (!hits || !hits.length){
    pane.innerHTML = '<div class="ev-empty">Nothing matched. That is the bot '
      + 'saying it has no curriculum for this, which is the correct answer when '
      + 'it is true.</div>';
    return;
  }
  const top = hits[0].score || 1;
  pane.innerHTML = '<div class="psgs">' + hits.map(function(h){
    const c = h.chunk;
    const pct = Math.max(4, Math.round(100 * (h.score || 0) / top));
    const body = String(c.t || "").replace(/\s+/g, " ").trim();
    return '<details class="psg"><summary>'
      + '<span class="cite">' + esc(cite(c)) + '</span>'
      + '<span class="layer ' + esc(c.g || "") + '">' + esc(c.g || "") + '</span>'
      + '<span class="bar"><i style="width:' + pct + '%"></i></span>'
      + '<span class="sc">' + (h.score || 0).toFixed(1) + '</span>'
      + '</summary><div class="body">' + esc(body) + '</div></details>';
  }).join("") + '</div>';
}

/* The guard notice above an answer. Null means nothing fired, which is the
   normal case for a teaching question and should show nothing at all. */
function guardBanner(g){
  if (!g) return "";
  const tone = g.tone === "stop" ? "stop" : (g.tone === "ok" ? "clear" : "caution");
  return '<div class="guard ' + tone + '">'
    + '<span class="id">' + esc(g.id) + '</span>'
    + '<span class="rule">' + esc(g.rule || "") + '</span></div>';
}

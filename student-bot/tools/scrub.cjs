/* ---------------- outcome-figure scrub ----------------

   A last line of defence over text the bot wrote after reading the open web.

   The corpus gets a compliance pass at build time: tools/test_win_rate_claims.py
   proves no chunk carries a win rate or a realised performance claim. Fetched
   web text has had no such pass, and web search is the one path by which
   unscanned prose can reach a student. So it gets scanned on the way out.

   Deliberately narrow. It catches figures attached to performance, which is
   non-negotiable 1. It is not a general compliance scan and must not be
   described as one.

   ORDERING MATTERS, and this is the second time in this project. A rewrite rule
   that matched single figures before compound ones produced "150 to
   [FIGURE REMOVED] gain" and, later, "the 90 over [FIGURE REMOVED]": half a
   redaction, which still states a figure AND advertises that something was
   removed. Every compound form below is therefore one alternative with the
   whole range inside it, so the match consumes both ends or neither. */

const NUM = "[\\d,]+(?:\\.\\d+)?";
const UNIT = "(?:k|m|bn|thousand|million|percent|%|x|dollars|bucks)";
const JOIN = "\\s*(?:to|through|-|\u2013|\u2014|or|and|over|vs\\.?|versus|\\/)\\s*";

/* One figure: a dollar amount, or a number carrying a unit. A bare integer on
   its own is never removed, because the curriculum is full of them and a bot
   that cannot say "the 20 SMA" or "14.3.3" is broken. */
const ONE = "(?:\\$\\s?" + NUM + "\\s*" + UNIT + "?|" + NUM + "\\s*" + UNIT + ")";

/* A pairing, matched WHOLE. People write the unit on either end and often only
   once, so both shapes are listed rather than trying to say "at least one
   side carries a unit", which a regex cannot express. Whichever matches
   consumes both ends, and that is the point: a rule that could match one end
   alone is exactly what produced "150 to [FIGURE REMOVED]". */
const ANY = "(?:(?:\\$\\s?)?" + NUM + "\\s*" + UNIT + "?)";
const PAIR = "(?:" + [
  ONE + JOIN + ANY,   // $2k-$5k, 12% to 20
  ANY + JOIN + ONE,   // 150 to 300 percent
].join("|") + ")";

const FIGURE = new RegExp("(?:" + PAIR + "|" + ONE + ")", "gi");

/* Both ends bare, as in "a 90 over 60 win rate". Nothing marks these as figures
   except the sentence around them, so they are only ever removed on a line that
   is unambiguously about results. Kept separate from FIGURE for that reason:
   widening FIGURE to reach them would have it eating "Module 3 or 5". */
const BARE_PAIR = new RegExp("(?:" + NUM + JOIN + NUM + ")", "g");

/* The scrub only runs on a line that is talking about performance. */
const PERFORMANCE = new RegExp(
  "\\b(returns?|profits?|gains?|losses|made|makes|making|make|earn(ed|ing|s)?|" +
  "earnings|income|salary|paid|payout|win\\s*rate|winrate|success\\s*rate|" +
  "account|portfolio|balance|annual(ly)?|monthly|weekly|per\\s+(year|month|week|day|trade)|" +
  "average|typical|expect(ed|ation)?)\\b", "i");

/* The stricter gate, for bare pairs only. */
const RESULTS = new RegExp(
  "\\b(win\\s*rate|winrate|success\\s*rate|returns?|profits?|gains?|" +
  "earn(ed|ing|s)?|earnings|income|payout)\\b", "i");

/* The 70 percent target win rate is the one permitted results number, and it is
   permitted as a target rather than a promise. Non-negotiable 2. */
const ALLOWED = /^\s*70\s*(?:percent|%)\s*$/i;

function scrubOutcomeFigures(text) {
  let hit = false;
  const take = function (m) {
    if (ALLOWED.test(m)) return m;
    hit = true;
    return "[FIGURE REMOVED]";
  };
  const out = String(text == null ? "" : text).split(/\n/).map(function (line) {
    if (!PERFORMANCE.test(line)) return line;
    let l = line.replace(FIGURE, take);
    if (RESULTS.test(l)) l = l.replace(BARE_PAIR, take);
    return l;
  }).join("\n");
  return { text: out, scrubbed: hit };
}

if (typeof module !== "undefined") {
  module.exports = { scrubOutcomeFigures, FIGURE, BARE_PAIR, PERFORMANCE };
}

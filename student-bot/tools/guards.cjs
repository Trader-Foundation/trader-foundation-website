/* ---------------- guard rules ----------------
   Ported from prompts/system.md. Order matters: the strictest rule that
   matches is the one that fires. */
/* Terms of art that look like tickers and must never be read as one. Without
   this list "What is RSI?" gets refused as position advice.
   AM is deliberately absent: it is Antero Midstream, a ticker this curriculum
   teaches, and listing it let "Should I buy AM right now?" through. */
const NOT_TICKERS = new Set(("I A OK IT IS MY THE AND FOR BUT NOT YOU ALL ANY CAN DO HOW WHY WHO "+
  "CALL PUT CALLS PUTS RSI MACD SMA EMA VWAP ATR ADX OBV BB DMI CCI "+
  "ITM OTM ATM DTE IV HV OI PL PNL ROI EPS PE IPO ETF ETN LEAP LEAPS "+
  "TOS FB LIVE PM EOD EST PST USD TA EMA9 SL TP RR").split(" "));
const TICKER = {
  test(q){
    const m = q.match(/\b[A-Z]{2,5}\b/g);
    return !!m && m.some(t => !NOT_TICKERS.has(t));
  }
};
/* Has the student marked the chart themselves? The marked chart exception in
   hard rule 4 turns on this and on nothing else, so it has to be read from
   what they said as well as from the image being there.
   Colour words are included because that is how students actually say it:
   "the blue lines is lines i drew as support resistance". */
const MARKED = /\b(?:i|we)\s+(?:drew|drawn|marked|added|put)\b|\b(?:my|the)\s+(?:blue|red|green|yellow|orange|purple|white|black)\s+lines?\b|\bmy\s+(?:support|resistance|levels?|lines?|marks?)\b|\blines?\s+i\s+drew\b|\b(?:drew|marked)\s+(?:in\s+)?(?:my|the)\s+(?:support|resistance|levels?|lines?)\b|\bi(?:'ve| have)\s+(?:drawn|marked)\b/i;

const GUARDS = [
  {
    id:"retired", tone:"stop", verdict:"Blocked",
    rule:"Non-negotiable 8, retired terms",
    test:q => /\belite\s*(four|4|12|twelve)\b/i.test(q),
    shape:[
      "That is a retired name and the bot must never repeat it, including to correct someone who used it.",
      "Answer the underlying question without the term, or route to an Education Coordinator."
    ]
  },
  {
    id:"outcome", tone:"stop", verdict:"Refuse and route",
    rule:"Non-negotiables 1 and 2, outcome claims",
    test:q => /(how much|how many).*(make|earn|money|profit|return)|win\s*rate|average return|per (week|month|year)|realistic(ally)? (make|expect)|students? (make|earn)|get rich|replace my (income|job|salary)/i.test(q),
    shape:[
      "The curriculum does not attach dollar figures or income projections to what a student will earn, and the bot will not either.",
      "The only results language it uses is the 70 percent target win rate, described as a target the method aims at rather than a promise.",
      "Anything about your own situation goes to a coach."
    ]
  },
  /* The two image states come first, because an uploaded chart changes what
     the answer looks like before any of the text rules apply. Ruled by Vlad:
     "I am okay with a student showing them a chart to the bot and drew its own
     levels and YOU correcting them and saying hey this is far off".
     See rulings/chart-with-student-levels.md. */
  {
    id:"chart_marked", tone:"ok", verdict:"Check their marks",
    rule:"Non-negotiable 4 as amended, chart-with-student-levels ruling",
    test:(q, ctx) => !!(ctx && ctx.image) && MARKED.test(q),
    shape:[
      "They did the work first, so checking it is the point rather than a side door. Say whether each marked level holds up, and say plainly when one is far off.",
      "Correct by pointing at the criterion, never by naming the replacement level. A level is where price actually turned more than once. Send them back to redraw it.",
      "Read nothing off the chart except the levels they marked. Not the candle, not volume, not the averages, not whether a pattern is present.",
      "Approximate prices only. Around 86, not 86.44. Reading a number off a pixel is an estimate and the language has to say so.",
      "If it is not obvious which lines are theirs, ask. Platforms draw their own markers and colour conventions vary.",
      "The position rules still bind. If they also asked what to do with the trade, give the three moves from hard rule 3 after checking the marks, anchored to their own level."
    ]
  },
  {
    id:"chart_unmarked", tone:"warn", verdict:"Send them to mark it",
    rule:"chart-with-student-levels ruling, the student marks it first",
    test:(q, ctx) => !!(ctx && ctx.image),
    shape:[
      "Never mark a blank chart. Finding the levels for them is doing the work the bot exists to make them do.",
      "Ask them to mark support and resistance and send it back, and say what to look for: where price actually turned, not where they want the line to be.",
      "Phrase it as the work, not as a refusal. They uploaded something and are waiting.",
      "Every other rule still binds. An image does not buy a student past the outcome, position, prediction or retired guards."
    ]
  },
  {
    id:"chart", tone:"stop", verdict:"Cannot see it",
    rule:"Non-negotiable 4, plus the-chart-decides ruling",
    // "this chart" as well as "my chart". An earlier version matched only the
    // possessive, so "what do you think of this chart" reached retrieval
    // unguarded and the bot was free to opine on a chart it cannot see.
    test:q => /(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|breakout|bounce)|on my chart|\b(this|that|these|those|my)\s+(chart|screenshot|screen|setup|candles?)\b|\bmy (support|resistance|levels?|lines?)\b|my position/i.test(q),
    shape:[
      "The decision comes down to the chart, and the bot cannot see yours.",
      "It does not ask for the candle or the volume bar in order to rule on it either, because rendering that verdict is the same violation whether or not it was invited.",
      "What it does instead: name the pattern, say what confirmation would look like, and hand back the questions that make the chart legible.",
      "One exception it may offer: if the question is about their support and resistance specifically, they can mark those levels on a chart and send it, and the bot will say whether they hold up. Offer that rather than dead ending. It offers nothing of the kind for a candle, a volume bar or a pattern."
    ]
  },
  {
    id:"position", tone:"stop", verdict:"Refuse and route",
    rule:"Non-negotiable 3, no position advice",
    // Two things have to be separated here, and an earlier version did not.
    // "How do I pick which strike to sell" is the curriculum asking to be
    // taught. "Which strike should I sell on my RVN trade" is position advice.
    // The words strike, expiration and exit appear in both, so they cannot
    // fire the guard alone. Something has to tie the question to a live or
    // specific position.
    test:q => {
      const SPECIFIC = /\bmy (trade|position|contracts?|spread|order|call|put|strike)\b/i.test(q)
        || /\bi(?:'m| am) in\b|\bi (bought|sold|entered|opened|own|hold)\b/i.test(q)
        || /going against me|getting tested|underwater|in the (red|money|green)\b/i.test(q)
        || /\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b/i.test(q)
        || /\b\d+(\.\d+)?\s*(strike|call|put)s?\b/i.test(q)      // "the 25 put"
        || TICKER.test(q);
      // Walking someone through placing a trade is position advice by itself,
      // and needs no second signal. system.md calls it the closest the corpus
      // comes to putting a student in a position.
      if (/\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b/i.test(q)) return true;
      if (!SPECIFIC) return false;
      // Specific AND asking to be told what to do with it.
      return /\b(should i|do i|would you|shall i|can i|is it worth|worth it to|when (do|should) i|what (do|should) i)\b/i.test(q)
        || /\b(roll|cut|close|exit|hold|add to|trim|sell|buy)\b/i.test(q)
        || /\b(strike|expiration|expiry|entry|exit|stop loss|position siz|how many contracts)\b/i.test(q);
    },
    shape:[
      "Ticker, strike, expiration, entry, exit, sizing, rolling and closing are all out of scope, and reframing it as hypothetical or as a friend's trade does not change that.",
      "The bot states the principle, names the module that teaches it, and hands the specific call to a coach.",
      "It does not lecture about why it declined. One line, then the teaching."
    ]
  },
  {
    id:"predict", tone:"stop", verdict:"Refuse and route",
    rule:"Prediction is outside the method",
    test:q => /\bwill (it|this|that|the (stock|market|price)|we|prices?)\b|\bis (the )?(market|spy|it) (bullish|bearish|going)|what (will|is going to) happen|where (is|will) (it|this|the stock|the market) (go|going|head)|\b(next week|tomorrow|by friday|end of (the )?week)\b.*\?/i.test(q),
    shape:[
      "The method does not predict. The coach's own line is that he is never there to try to predict, and the honest answer to where something goes next is that nobody knows.",
      "What the curriculum teaches instead is reading what is already on the chart: is it the first day, is there a perceived edge, does risk versus reward justify it.",
      "The bot walks through those questions. It does not answer the one that was asked."
    ]
  },
  {
    id:"procedure", tone:"warn", verdict:"Hand to the video",
    rule:"Perishable procedure layer",
    test:q => /\b(where do i click|how do i (set up|setup|install|configure|find the|draw|add|apply)|which (tab|menu|button)|thinkorswim|platform setting|chart setup|screener|screening|scan(ner)? setting|what (volume )?filter)\b/i.test(q),
    shape:[
      "Click paths and platform screens change without notice, so the bot does not recite them.",
      "It teaches the concept underneath, which is portable to any broker, then names the module and hands the sequence to the video."
    ]
  }
];
/* ctx carries what the text cannot: whether an image came with the question.
   { image: true } when the student uploaded a chart. */
function guardFor(q, ctx) {
  return GUARDS.find(g => g.test(q, ctx || {})) || null;
}
if (typeof module !== 'undefined') module.exports = { GUARDS, TICKER, MARKED, guardFor };

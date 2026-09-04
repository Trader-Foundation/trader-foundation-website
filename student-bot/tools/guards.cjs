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
const NOT_A_TICKER_WORD = new Set((
  "TOO SOON MUCH MORE LESS THIS THAT THEM THEN THAN WHEN WHAT SOME MANY EVER " +
  "EARLY LATE HIGH LOW BIG SMALL GOOD BAD NOW OUT OFF UP DOWN BACK OVER " +
  "HERE THERE LONG SHORT FAST SLOW HARD EASY SAME NEXT LAST BEST WORST " +
  /* The options vocabulary. LOWER_TICKER anchors on trade verbs, and the word
     after a trade verb is very often the instrument rather than a symbol:
     "sell naked calls" read NAKED as a ticker, which was enough to make the bot
     refuse to explain why brokers restrict naked calls. Same failure as TOO in
     "sell too soon", one lesson later. The anchor finds the slot where a ticker
     would sit; it cannot tell something is sitting there already. */
  "NAKED COVERED CALL CALLS PUT PUTS OPTION OPTIONS STOCK STOCKS SHARE SHARES " +
  "SPREAD SPREADS PREMIUM STRIKE DELTA THETA VEGA GAMMA CONTRACT CONTRACTS " +
  "WEEKLY MONTHLY LEAP LEAPS BULL BEAR").split(" "));

const LOWER_TICKER =
  /\b(?:buy|sell|short|on|in|into|of|for|trade|trading|play|calls?|puts?)\s+([a-z]{2,5})\b/ig;

const TICKER = {
  test(q){
    const m = q.match(/\b[A-Z]{2,5}\b/g);
    if (m && m.some(t => !NOT_TICKERS.has(t))) return true;
    // Students type "should i buy nvda". A short token after a trade verb or a
    // preposition is a ticker whatever case it is in, unless it is an ordinary
    // word. Matching bare lowercase tokens anywhere would make every question a
    // ticker question, so the anchor does the work.
    LOWER_TICKER.lastIndex = 0;
    let hit;
    while ((hit = LOWER_TICKER.exec(q)) !== null) {
      const cand = hit[1].toUpperCase();
      if (!NOT_TICKERS.has(cand) && !NOT_A_TICKER_WORD.has(cand)) return true;
    }
    return false;
  }
};
/* MARKED used to live here: a regex asking the QUESTION whether the student
   had drawn on their chart. It existed because the bot could not see the image,
   so the student's wording was the only evidence available.

   It failed in the field. Vlad sent a carefully marked chart and asked whether
   "my price target 36.85" was realistic. MARKED knows "my support" and "my
   levels" but not "my price target", so the unmarked branch fired and a student
   who had done the work was told to go and do it.

   Extending the phrase list would only ever have helped the student after the
   next one had already been failed. Whether a chart is marked is a fact about
   the chart, so the question now goes to the chart. The two image guards below
   collapsed into one as a result. */

/* Asking to act, which needs no second signal.
 *
 * The position guard demanded a named position or a ticker, to separate "how
 * do I pick a strike" (teaching) from "which strike on my trade" (advice).
 * That distinction is right and it failed on the most obvious question a
 * student can ask: "should i buy nvda" names no position, and the ticker test
 * matched only capitals, so the guard turned on the student's shift key.
 * Seven of eight real phrasings walked straight past non-negotiable 3.
 *
 * Trade verbs only, so "should I use Fibonacci" stays a lesson. "add" has to
 * be "add to", because adding an indicator is not adding to a position: bare
 * "add" made "how do i add stochastics" a refusal. */
/* The bare form, split out of DIRECT_ACTION because it was the one over firing.
   "Should I buy" tied to nothing is still a position ask and must be refused,
   but the identical words in front of a strategy name are a lesson request. */
const BARE_ACTION =
  /(?<!why\s)(?<!because\s)\b(should|shall|do|would|can|could)\s+(i|we|you)\s+(buy|sell|short|enter|exit|get\s+(in|out)|take|hold|add\s+to|trim|cut|close|roll|average\s+down|double\s+down)\b/i;

/* Objects that make a trade verb conceptual rather than live. "How do I sell a
   covered call" is the curriculum asking to be taught; "should I sell my NVDA
   calls" is position advice. Both contain "sell", so the verb cannot decide it.
   Without this the bot refused to explain what a straddle is, which is the
   failure Vlad named: "this bot cannot have such specific prompts bc its going
   to fail for the user." */
/* The last clause is sizing asked in the abstract. "How many contracts should I
   take" is the question position-sizing.md exists to answer and Vlad's own
   teaching has a number for it, so refusing it hands back nothing on a topic
   the curriculum is explicit about. Non-negotiable 3 lists ticker, strike,
   expiration, entry, exit and live trade management; sizing is not on it.
   Safe because this only exempts the bare action form: "how many contracts
   should I take on NVDA" is still caught by the ticker path. */
const GENERIC_INSTRUMENT =
  /\b(a|an|the)?\s*(covered|naked|cash\s+secured)\s+(call|put)s?\b|\b(a|an)\s+(straddle|strangle|spread|diagonal|vertical|butterfly|condor|collar|call\s+option|put\s+option)\b|\b(calls?|puts?|options?|premium)\s+(on|against)\s+(a\s+|the\s+)?(stock|shares|position)\b|\b(how many|how much|what percent(age)?|what size|how big)\b/i;

const DIRECT_ACTION =
  /\bwould\s+you\s+(buy|sell|take|enter|get\s+in)\b|\b(is|was)\s+(now|this|that|it)\s+a\s+good\s+(entry|exit|time|price|buy|spot|level)\b|\bgood\s+(entry|time)\s+(here|now)\b|\b(buy|sell)\s+or\s+wait\b|\bdo\s+i\s+(buy|sell)\s+(this|that|it)\b|\b(good|bad|smart|dumb|terrible)\s+idea\b|\bthinking\s+(about|of)\s+(buying|selling|getting\s+in(to)?|taking)\b|\b(worth|ok|okay)\s+(getting\s+in|buying|selling|taking\s+this)\b|\bwhat\s+would\s+you\s+do\b/i;

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
    test:q => /(how much|how many).*(make|earn|money|profit|return)|win\s*rate|average return|per (week|month|year)|realistic(ally)? (make|expect)|students? (make|earn)|get rich|replace my (income|job|salary)|(realistic|typical|average|expected|normal)\s+\w{0,12}\s*(returns?|gains?|profits?|income)|(returns?|gains?|profits?)\s+(should|can|do|would)\s+i\s+(expect|see|get|make)|what\s+(kind|sort)\s+of\s+(returns?|gains?|profits?|money)/i.test(q),
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
    id:"chart_attached", tone:"ok", verdict:"Read their chart",
    rule:"Non-negotiable 4 as amended, chart-with-student-levels ruling",
    test:(q, ctx) => !!(ctx && ctx.image),
    shape:[
      "Decide from the IMAGE, not from their wording, whether they have marked their own levels. They may never say the word 'drew' or 'my line'.",
      "Their marks are what a person draws on top: horizontal lines and rays, boxes or zones, trendlines, arrows, text notes. The platform's own drawing is NOT theirs, and this distinction is load bearing: moving averages, bands and clouds, the volume panel, the price scale and every indicator overlay are drawn by the software. Never treat a moving average as a level the student drew.",
      "If they HAVE marked levels: say whether each one holds up, and say plainly when one is far off. Correct by pointing at the criterion, never by naming the replacement level. A level is where price actually turned more than once. Send them back to redraw it.",
      "If the chart carries no marks of theirs: never mark it for them. Ask them to mark support and resistance and send it back, and say what to look for, which is where price actually turned rather than where they want the line to be. Phrase it as the work, not as a refusal. They uploaded something and are waiting.",
      "Read nothing off the chart except the levels they marked. Not the candle, not volume, not the averages, not whether a pattern is present.",
      "Approximate prices only. Around 86, not 86.44. Reading a number off a pixel is an estimate and the language has to say so.",
      "If it is genuinely ambiguous which lines are theirs, ask rather than guess.",
      "The position rules still bind. If they also asked what to do with the trade, give the three moves from hard rule 3 after checking the marks, anchored to their own level.",
      "An image does not buy a student past the outcome, position, prediction or retired guards."
    ]
  },
  {
    id:"chart", tone:"stop", verdict:"Cannot see it",
    rule:"Non-negotiable 4, plus the-chart-decides ruling",
    // "this chart" as well as "my chart". An earlier version matched only the
    // possessive, so "what do you think of this chart" reached retrieval
    // unguarded and the bot was free to opine on a chart it cannot see.
    test:q => /(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|breakout|bounce)|on my chart|\b(this|that|these|those|my)\s+(chart|screenshot|screen|setup|candles?)\b|\bmy (support|resistance|levels?|lines?)\b/i.test(q),
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
      const SPECIFIC = /\b(my|this|that) (trade|position|contracts?|spread|order|call|put|strike)\b/i.test(q)
        || /\bi(?:'m| am) in\b|\bi (bought|sold|entered|opened|own|hold)\b/i.test(q)
        || /going against me|getting tested|underwater|in the (red|money|green)\b/i.test(q)
        || /\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b/i.test(q)
        || /\b\d+(\.\d+)?\s*(strike|call|put)s?\b/i.test(q)      // "the 25 put"
        || TICKER.test(q);
      // Walking someone through placing a trade is position advice by itself,
      // and needs no second signal. system.md calls it the closest the corpus
      // comes to putting a student in a position.
      if (/\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b/i.test(q)) return true;
      // Asking to act needs no second signal either.
      //
      // SPECIFIC demanded a named position or a ticker, to separate "how do I
      // pick a strike" (teaching) from "which strike on my trade" (advice).
      // That is the right distinction and it failed on the most obvious
      // question a student can ask: "should i buy nvda" names no position, and
      // the ticker test only matched capitals. Seven of eight real phrasings
      // walked straight past non-negotiable 3.
      //
      // Trade verbs only, so "should I use Fibonacci" stays a lesson, and
      // "add" must be "add to" because adding an indicator is not adding to a
      // position.
      if (DIRECT_ACTION.test(q)) return true;
      /* The bare "should I buy" form fires unless its object is a strategy
         rather than a trade. Naming an instrument in the abstract is how a
         student asks to be taught one, and refusing that teaches them the bot
         is useless. */
      if (BARE_ACTION.test(q) && !GENERIC_INSTRUMENT.test(q)) return true;
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
/* ---------------------------------------------------------------------------
   The dynamic layer.

   Every guard above decides from a regex over the question. That is why "my
   price target" failed where "my support" would have worked, and it is
   structural rather than a missing phrase: students do not share a vocabulary.

   So intent is read by a model before the guards run, and mapped through
   INTENT_TO_GUARD. Two properties keep that safe, and tests/test_guards.cjs
   pins both:

   1. UNION, NEVER SUBTRACTION. The regexes still run, and a guard fires if
      EITHER layer flags it. The model can add a guard the pattern missed; it
      can never talk the bot out of one the pattern caught. Strictly safer than
      the regexes alone, never looser.

   2. FAILURE FALLS BACK. Passing null or [] for intents returns exactly what
      the regexes decided, so a classifier that is unavailable, refused or
      broken leaves behaviour unchanged.

   The rules themselves did not change. Only the recognition of what is being
   asked, which is the part that was brittle.
   ------------------------------------------------------------------------- */

const INTENT_TO_GUARD = {
  position_advice:"position",
  outcome_claim:"outcome",
  prediction:"predict",
  chart_read:"chart",
  chart_with_marks:"chart_attached",
  procedure:"procedure",
  retired_term:"retired",
};

/* GUARDS is ordered by severity, so the first match wins. */
function mergeGuards(byWords, intents, hasImage) {
  const ids = (intents || [])
    .map(i => INTENT_TO_GUARD[i])
    .filter(id => {
      if (!id) return false;
      // chart_attached is meaningless without an image, and chart_read must not
      // fire when the chart is right there to be looked at.
      if (id === "chart_attached") return !!hasImage;
      if (id === "chart") return !hasImage;
      return true;
    });
  if (byWords) ids.push(byWords.id);
  if (!ids.length) return null;
  for (const g of GUARDS) if (ids.includes(g.id)) return g;
  return byWords || null;
}

if (typeof module !== 'undefined') {
  module.exports = { GUARDS, TICKER, guardFor, INTENT_TO_GUARD, mergeGuards };
}

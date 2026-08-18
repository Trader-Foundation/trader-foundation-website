/* ---------------- guard rules ----------------
   Ported from prompts/system.md. Order matters: the strictest rule that
   matches is the one that fires. */
/* Terms of art that look like tickers and must never be read as one. Without
   this list "What is RSI?" gets refused as position advice. */
const NOT_TICKERS = new Set(("I A OK IT IS MY THE AND FOR BUT NOT YOU ALL ANY CAN DO HOW WHY WHO "+
  "CALL PUT CALLS PUTS RSI MACD SMA EMA VWAP ATR ADX OBV BB DMI CCI "+
  "ITM OTM ATM DTE IV HV OI PL PNL ROI EPS PE IPO ETF ETN LEAP LEAPS "+
  "TOS FB LIVE AM PM EOD EST PST USD TA EMA9 SL TP RR").split(" "));
const TICKER = {
  test(q){
    const m = q.match(/\b[A-Z]{2,5}\b/g);
    return !!m && m.some(t => !NOT_TICKERS.has(t));
  }
};
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
  {
    id:"chart", tone:"stop", verdict:"Cannot see it",
    rule:"Non-negotiable 4, plus the-chart-decides ruling",
    test:q => /(does|is|has) (this|it|that|my)|look(s)? (bullish|bearish|good|weak|strong)|confirm|did (the )?volume|is (this|that|it) a (hammer|doji|marubozu|engulfing|breakout|bounce)|on my chart|my (chart|screen|position)/i.test(q),
    shape:[
      "The decision comes down to the chart, and the bot cannot see yours.",
      "It does not ask for the candle or the volume bar in order to rule on it either, because rendering that verdict is the same violation whether or not it was invited.",
      "What it does instead: name the pattern, say what confirmation would look like, and hand back the questions that make the chart legible."
    ]
  },
  {
    id:"position", tone:"stop", verdict:"Refuse and route",
    rule:"Non-negotiable 3, no position advice",
    test:q => /\b(should i|do i|would you|shall i|can i|is it worth|worth it to)\b.*\b(buy|sell|enter|exit|close|hold|roll|add|take|cut|trim)\b|\b(strike|expiration|expiry|entry|exit|stop loss|position siz|how many contracts)\b|\bi(?:'m| am) in\b|\bmy (trade|position|contracts?|spread|order)\b|going against me|\bwalk me through\b|\bplac(e|ing) (a|an|this|the|my) (trade|order)\b/i.test(q) || TICKER.test(q),
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
if (typeof module !== 'undefined') module.exports = { GUARDS, TICKER };

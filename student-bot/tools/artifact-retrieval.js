
/* ---------------- retrieval ----------------

   RESTORED. The published page called index(), toks(), search() and cite() and
   defined none of them, so index() threw a ReferenceError at boot, the rest of
   the boot script never ran, the send button was never wired, and pressing
   Enter did nothing. That is the "no response" Vlad reported and could not get
   past. An earlier rebuild of this page dropped the block.

   This is the implementation from tools/bench.html, which the parity suite
   checks against tools/ask.py on every build, adapted to the short keys the
   page stores chunks under: t text, c course, m module, n title, p part,
   d date, ts timestamp, e estimated, g tag. */

const STOP = new Set(("a an the and or but if then than that this these those of in on at to for with "+
  "is are was were be been being do does did doing have has had having i you he she it we they "+
  "my your his her its our their me him them what which who whom when where why how all any both "+
  "each few more most other some such no nor not only own same so too very can will just should "+
  "now about into over under again further once here there also as by from up down out off").split(" "));

/* A light stemmer. Enough to bridge plural and simple verb endings without the
   over-reach of a full Porter, which turned "trading" into "trad". */
function stem(w){
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("es") && !w.endsWith("ses")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  return w;
}

const toks = s => (String(s||"").toLowerCase().match(/[a-z][a-z0-9']+|\d+(?:\.\d+)*/g)||[])
  .filter(w => !STOP.has(w) && w.length > 1).map(stem);

let DF = {}, AVG = 0, DOCS = [];
const TITLE_TOKENS = {};
const titleKey = c => c.c + "/" + (c.n || c.m);

function index(){
  DF = {}; DOCS = [];
  DOCS = CHUNKS.map(function(c){
    const t = toks(c.t), tf = {};
    t.forEach(w => tf[w] = (tf[w]||0) + 1);
    Object.keys(tf).forEach(w => DF[w] = (DF[w]||0) + 1);
    return {c: c, tf: tf, len: t.length};
  });
  AVG = DOCS.reduce((s,d) => s + d.len, 0) / (DOCS.length || 1);
  /* Titles indexed separately from bodies, for TITLE_BOOST below. */
  for (const d of DOCS){
    const k = titleKey(d.c);
    if (k && !TITLE_TOKENS[k]) TITLE_TOKENS[k] = new Set(toks(d.c.n || ""));
  }
}

const PREFIX_MIN = 5;
/* Curated bridges from the student's words to the curriculum's, kept in step
   with ask.py. Prefix expansion cannot reach these: the pairs share no prefix. */
const ALIASES_RAW = {
  down:["red"], losing:["red","loss"], lose:["red","loss"],
  underwater:["red","loss"], negative:["red","loss"],
  scared:["fear"], afraid:["fear"], nervous:["fear"],
  anxious:["fear"], panic:["fear"], worried:["fear"],
  shadow:["wick"],
  line:["support","resistance","level"],
  zone:["support","resistance","level"],
  /* Shorthand. A term under PREFIX_MIN characters cannot reach the word by
     prefix, so "how do I use fib levels" missed the Fibonacci module entirely
     in a corpus that has a module called Fibonacci Retracement. */
  fib:["fibonacci","retracement"], fibs:["fibonacci","retracement"],
  vol:["volume"], ma:["moving","average"], sr:["support","resistance"],
  ta:["technical","analysis"], tos:["thinkorswim"],
  pt:["target","resistance"], dte:["expiration"],
  /* Speed words for exiting. "Sell too soon" reached the teaching and "get out
     way too fast" did not, because the doc says early. */
  fast:["early","soon"], quick:["early","soon"],
  quickly:["early","soon"], premature:["early","soon"],
};
const ALIASES = {};
Object.keys(ALIASES_RAW).forEach(k => ALIASES[stem(k)] = ALIASES_RAW[k].map(stem));

function expand(term){
  const alias = (ALIASES[term]||[]).filter(a => DF[a] !== undefined);
  if (DF[term] !== undefined) return [term].concat(alias);
  if (term.length < PREFIX_MIN) return alias;
  const pre = term.slice(0, PREFIX_MIN);
  return Object.keys(DF).filter(t => t.startsWith(pre))
    .sort((a,b) => a.length - b.length || (a < b ? -1 : 1)).slice(0,4).concat(alias);
}

const RULING_BOOST = 1.4;   /* rulings are current teaching, per the prompt */
const TITLE_BOOST  = 2.2;   /* a lesson's own subject, which BM25 cannot see */
const PRIOR_WEIGHT = 0.4;   /* words carried in from the last couple of turns */

/* prior is a token list from recent conversation. It is scored at reduced
   weight so a follow-up like "why does that matter" still reaches the topic
   the student was just asking about, without letting old words outrank the
   question actually typed. */
function search(q, n, prior){
  const raw = [...new Set(toks(q))];
  const qt = [...new Set(raw.flatMap(expand))];
  const pt = [...new Set((prior||[]).flatMap(expand))].filter(t => !qt.includes(t));
  if (!qt.length && !pt.length) return [];
  const N = DOCS.length, k1 = 1.4, b = 0.72;
  const scoreTerm = (d, w) => {
    const f = d.tf[w];
    if (!f) return 0;
    const idf = Math.log(1 + (N - DF[w] + 0.5)/(DF[w] + 0.5));
    return idf * (f*(k1+1))/(f + k1*(1 - b + b*d.len/AVG));
  };
  const scored = DOCS.map(function(d){
    let s = 0;
    for (const w of qt) s += scoreTerm(d, w);
    for (const w of pt) s += PRIOR_WEIGHT * scoreTerm(d, w);
    if (d.c.c === "ruling") s *= RULING_BOOST;
    const tt = TITLE_TOKENS[titleKey(d.c)];
    if (tt && qt.some(t => tt.has(t))) s *= TITLE_BOOST;
    return {d: d, s: s};
  }).filter(x => x.s > 0).sort((a,b) => b.s - a.s).slice(0, n || 8);
  return scored.map(x => ({chunk: x.d.c, score: x.s, terms: qt}));
}

/* Citations are the product. Mirrors cite() in tools/ask.py: a numbered module
   is cited by number, an unnumbered lesson by its title, because "Module
   UNNUMBERED" is honest and useless while the lesson title is findable. */
function cite(c){
  let base;
  const mod = String(c.m || "");
  if (c.c === "tf-core" || c.c === "tf-options"){
    base = /^\d+$/.test(mod) ? "Module " + mod : (c.n || "Lesson");
  } else if (c.c === "fb-live"){
    base = "FB Live #" + mod + (c.d ? " (" + c.d + ")" : "");
  } else if (c.c === "ruling"){
    base = "Ruling: " + (c.n || mod);
  } else if (c.c === "written"){
    base = c.n || mod;
  } else {
    base = c.c + ", " + (c.n || mod);
  }
  if (c.ts){
    base += ", around " + (c.ts.replace(/^0+:/, "") || "0:00");
    if (c.e) base += " (estimated)";
  } else if (c.p){
    base += ", " + c.p;
  }
  return base;
}

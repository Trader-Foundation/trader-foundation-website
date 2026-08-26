const { GUARDS } = require('./guards.cjs');
const tests = require('../tests/questions.json');
const fire = (q, ctx) => (GUARDS.find(g => g.test(q, ctx || {})) || {id:'none'}).id;

// category -> guard ids that are acceptable outcomes
const EXPECT = {
  content_tests:    ['none'],
  refusal_tests:    ['position','chart','outcome','retired','predict'],
  compliance_tests: ['outcome','retired','position','predict','none'],
  procedure_tests:  ['procedure'],
  guidance_tests:   ['none','chart','position'],
  grounding_tests:  ['none'],
};
let pass = 0, fail = [];
for (const [cat, arr] of Object.entries(EXPECT)) {
  for (const t of tests[cat] || []) {
    const got = fire(t.q, {image: !!t.img});
    if (arr.includes(got)) pass++;
    else fail.push(`${t.id||'?'} [${cat}] got=${got}  ${t.q}`);
  }
}

/* The chart upload cases name the exact guard they expect rather than a set,
   because which of the three image states fires is the whole behaviour. */
for (const t of tests.chart_upload_tests || []) {
  const got = fire(t.q, {image: !!t.img});
  if (got === t.expect_guard) pass++;
  else fail.push(`${t.id} [chart_upload] img=${!!t.img} want=${t.expect_guard} got=${got}  ${t.q}`);
}
console.log(`pass ${pass}  fail ${fail.length}`);
fail.forEach(f => console.log('  FAIL ' + f));

console.log('\n-- spot checks --');
[['What is a marubozu?','none'],
 ['What is RSI?','none'],
 ['How do I use full stochastics?','none'],
 ['What is the maximum profit on a call?','none'],
 ['How much can I make with options?','outcome'],
 ['I am in EXE weekly, does it look bearish?','chart'],
 ['Should I buy AAPL calls?','position'],
 ['Where do I click to set up thinkorswim?','procedure'],
 ['What is the Elite Four?','retired'],
 ['What does bullish engulfing mean?','none'],
 ['Explain a bull call spread','none'],
 ['What is IV crush?','none'],
].forEach(([q,want])=>{
  const got = fire(q);
  console.log(`${got===want?'ok  ':'BAD '} want=${want.padEnd(9)} got=${got.padEnd(9)} ${q}`);
});

/* The marked chart exception. Ruled by Vlad, see
   rulings/chart-with-student-levels.md. An image alone is not enough: the
   student has to have marked it, or the bot sends them back to do that first.
   Every one of these is the same text with and without an image, which is the
   point. The image is what changes the answer. */
console.log('\n-- marked chart exception (IMG means an image was uploaded) --');
const IMG = {image:true};
[['here is my chart, the blue lines is lines i drew as support resistance', IMG, 'chart_marked'],
 ['can you check my support and resistance', IMG, 'chart_marked'],
 ['i drew my levels on this INTC chart, are they right', IMG, 'chart_marked'],
 ['i marked support around 86, does that hold up', IMG, 'chart_marked'],
 ['what do you think of this chart', IMG, 'chart_unmarked'],
 ['here is my INTC chart', IMG, 'chart_unmarked'],
 ['is this a marubozu', IMG, 'chart_unmarked'],
 // No image, so nothing about the exception applies and the old rules stand.
 ['here is my chart, the blue lines is lines i drew as support resistance', {}, 'chart'],
 ['what do you think of this chart', {}, 'chart'],
 ['is this a marubozu', {}, 'chart'],
 // An image does not buy a student past the guards that run ahead of it.
 ['how much do students make', IMG, 'outcome'],
 ['what is the Elite Four', IMG, 'retired'],
].forEach(([q,ctx,want])=>{
  const got = fire(q, ctx);
  const tag = ctx.image ? 'IMG ' : '    ';
  console.log(`${got===want?'ok  ':'BAD '} ${tag} want=${want.padEnd(14)} got=${got.padEnd(14)} ${q}`);
});

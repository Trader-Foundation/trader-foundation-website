const { GUARDS } = require('./guards.cjs');
const tests = require('../tests/questions.json');
const fire = q => (GUARDS.find(g => g.test(q)) || {id:'none'}).id;

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
    const got = fire(t.q);
    if (arr.includes(got)) pass++;
    else fail.push(`${t.id||'?'} [${cat}] got=${got}  ${t.q}`);
  }
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

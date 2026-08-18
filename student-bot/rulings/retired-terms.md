# Retired terms, and the rate of return question

Two things came up together. One is settled. One is not, and they should not
be confused with each other.

---

## CONFIRMED: remove the Elite language

**Vlad's ruling:** *"You can remove the Elite language."*

Removal, not exclusion. Where "elite" is only a qualifier on an ordinary word,
the qualifier goes and the teaching stays. `build_corpus.py` rewrites the
phrase and leaves a `[TERM REMOVED]` marker, because the redaction standard in
`CLAUDE.md` says nothing is altered silently.

**Where it appears.** One instance in the corpus: the Paycheck Collector
coaching call opens with *"today we're going to talk to [STUDENT], one of our
elite members."* That chunk is dropped anyway, on compliance rather than on
the term, so no marker survives into the corpus.

**Product names are still dropped, not rewritten.** Elite Four and Elite 12
are names of things that no longer exist. Strip the name and the sentence is
about nothing, so the chunk goes.

**A blanket rule on the bare word was wrong and I had to back it out.**
It dropped a member describing the Starbucks secret menu as *"some elite
stuff."* Elite is an ordinary English adjective. The retired terms are the
product names, not the word, and the rule now says so.

**This unblocks shipping.** It was the one item that hard-blocked a corpus
release under non-negotiable 8.

---

## STILL BLOCKED: 10 percent a month

**Vlad said:** *"10% a month can be done if consistent but it averages."*

That answers a question I asked, and I am recording it because it is useful
context. But it answers **whether the figure is true**, and what the corpus
needs settled is **whether the bot may say it.** Those come apart, and here
they point in opposite directions.

**Why I have not unblocked it.** Non-negotiable 2 says the 70 percent target
win rate is the *only* permitted results language. A monthly rate of return is
results language, so the bot repeating it would breach that rule no matter how
accurate the number is. `CLAUDE.md` says to stop and ask rather than proceed
in that situation, so the passages stay excluded until Vlad says otherwise in
those terms.

**"It averages" cuts against inclusion rather than for it.** An average
implies a spread, so some students land under it. A stated average return is
the standard shape of a performance claim, and a student reading it in a bot
answer has no way to see the distribution behind it.

**What the bot can do instead, and it loses very little.** The mechanics are
all still teachable: credit spreads collect premium, the premium is known at
entry, consistency and position sizing are what compound, and a defined risk
strategy has a known maximum loss. None of that needs a rate attached, and the
rate was never what made the lesson work.

**Still open, and it is a business question rather than a corpus one.** The
figure sits in at least three places: marketing, the Paycheck Collector class
intro, and a coach describing it live as something *"marketing has told you"*.
Excluding it from the bot protects the bot. It does not touch the other two.

**What I need from Vlad:** not whether 10 percent is achievable, but whether
the bot is permitted to state a rate of return at all. If the answer is yes,
non-negotiable 2 has to change, and that is a decision above this file.

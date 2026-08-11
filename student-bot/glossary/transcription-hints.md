# Transcription vocabulary hints

**Feed this to the transcription tool before it runs. It prevents errors instead of catching them.**

Twenty sources in, the errors this project keeps fixing are not random. They are the same words failing the same way, and the failures are predictable enough to be pre-empted. Every term below earned its place by actually being mis-transcribed in supplied material, or by being one syllable from a common word that would swallow it.

Most speech-to-text tools accept a bias or hint list and most cap it, so this is **ordered by observed damage**, not alphabetically. If the tool takes fifty terms, take the first fifty.

**This is a derived file.** Source of truth is `terms.json`. Regenerate when that changes.

---

## Tier 1: confirmed failures, highest damage

These have been observed failing, and each one produced a wrong answer or would have.

| Term | Became | Why it matters |
|---|---|---|
| **theta** | "data" | Twice, in two recordings. An ordinary English word, so nothing looks wrong, and a module tells students to look it up in their platform, which fails under the wrong name |
| **calls** | "cause" | Twice, in two recordings. One instance sat inside the single-line mnemonic the module offers as the thing to remember |
| **Marubozu** | "miru bozu", "Mirabozor" | Students searching the transcript spelling find nothing |
| **Antero Midstream** | "Ontario Midstream Partners" | A company that does not exist. The bot would have cited it confidently |
| **DraftKings** | "draft gains" | Beside a correctly transcribed DKNG |
| **ZNGA** | "Z and G a" | Ticker spelled aloud, rendered as words |
| **Nikola** | "Nicola" | |
| **Citigroup** | "City Group" | |
| **demand** | "the man" | Only in the phrase "the demand versus the supply" |
| **news** | "noose" | Context dependent, verify each hit |

## Tier 2: the numbers, which are the highest-risk class overall

A wrong number does not look wrong. A student cannot tell, and the bot would state it as house teaching. **Bias the tool toward these exact values.**

```
38.2   50   61.8
13   20   50   200
80   20
12.26.9
14.3.3
0.07
```

**Also configure the tool to keep decimals intact.** The recurring artifacts are a decimal split across a space (`38. 2`), a decimal spoken as two numbers and comma-joined (`five, 10` for 5.10), and worst, **a decimal dropped so a price reads as a whole number** (`3158` for 31.58). The third is dangerous because nothing punctuation-wise signals that anything is missing, and it happens most where prices are read off a screen at speed.

## Tier 3: terms of art with a common-word neighbour

The pattern behind Tier 1's worst entries. **These are the ones to watch proactively**, because nothing about the output looks broken.

```
theta   delta   gamma   vega
calls   puts    strike  premium
hammer  doji    harami  marubozu
```

The tell from the Greeks module: delta, gamma and vega transcribe cleanly every time and theta does not. They are not English words and theta is close to one. Apply the same reasoning to any new term.

## Tier 4: house vocabulary

Trader Foundation IP and phrasing. Wrong here is an embarrassment rather than a danger, but it is cheap to prevent.

```
Trader Foundation      Paycheck Collector     Stock Predator
Bounce Profit          Ready Set Explode      Education Coordinator
bounce profit formula  trade the chart not your heart
```

## Tier 5: platform and tooling

```
thinkorswim   FinViz   StockCharts   Robinhood
monkey bars   cash and sweep vehicles
GTC   LMT   POS   natural price   mid price
open interest   volume open interest
```

## Tier 6: instruments and studies

```
vertical spread   bull call spread   bear put spread
bear call spread  bull put spread    credit spread
iron condor   butterfly   diagonal   calendar spread
covered call  cash secured put   legging out
Bollinger Bands   stochastics   Full Stochastics   MACD
Fibonacci retracement   moving average   simple moving average
```

## Tier 7: tickers and sector ETFs

Read aloud letter by letter, which is where they break.

```
SPY  VIX  XLF  XLY  XLE  XME  XLK  XLV  XLB  XLI  XLU  RTH
AAPL  AMZN  BAC  BABA  DKNG  ZNGA  NFLX  COST  T  JNJ  AM
```

---

## One thing worth knowing about tickers

**A ticker beside a spoken company name resolves the name.** DraftKings arrived as "draft gains" with DKNG correct right next to it, and ZNGA was recoverable because the student said Zynga in the same exchange.

Tickers are short and read letter by letter rather than phonetically, so they survive transcription better than the words around them. That inverts the usual worry about proper nouns, and it is the cheapest check available: **where a passage carries both, trust the ticker.**

## What this cannot fix

Nothing here helps with the two error classes that are not about vocabulary.

**Teaching that depended on the visual.** "Anything under this line", "right here", "it's in the purple". The words are correct and the meaning is on a screen that no longer exists. No hint list recovers that.

**Self-corrected speech.** A live correction thirty seconds after the error does not travel with the sentence that needed it. That is a processing rule, not a transcription setting: take the corrected version, exclude the first pass.

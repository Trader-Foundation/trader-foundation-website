---
name: Trader Foundation Academy
description: An editorial prospectus for a trading school: off-white ground, one typeface, plain photographs, a single gold action.
colors:
  ground: "#faf9f6"
  band: "#141414"
  ink: "#1a1a1a"
  ink-prose: "#3a3834"
  ink-soft: "#55534e"
  ink-faint: "#767269"
  rule-ink: "#1a1a1a"
  rule: "#e3ded4"
  rule-light: "#ece8e0"
  rule-on-band: "#2c2c2c"
  underline: "#c9c4b8"
  gold: "#c7ab77"
  gold-hover: "#b89a66"
  gold-ink: "#876b38"
typography:
  display-hero:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  display-section:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  deck:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "normal"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  figure:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
spacing:
  gutter: "24px"
  gutter-lg: "32px"
  row: "20px"
  stack: "32px"
  column-gap: "64px"
  section: "64px"
  section-lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.gold-hover}"
    textColor: "{colors.ink}"
  button-header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-header-hover:
    backgroundColor: "#333333"
    textColor: "{colors.ground}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "0"
  nav-link-active:
    textColor: "{colors.ink}"
  header:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "72px"
  band:
    backgroundColor: "{colors.band}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "64px 24px"
  list-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  figure-image:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.none}"
    width: "100%"
---

# Design System: Trader Foundation Academy

## Overview

**Creative North Star: "The School Prospectus"**

This is the visual world of a school that publishes its curriculum, not a trading service that sells a feeling. Everything is set on one off-white ground in one typeface, with rules instead of containers and photographs instead of imagery. Authority comes from order: a 12-column field, a left edge every heading obeys, a graded hierarchy of hairlines, and figures set in tabular numerals so they read as records rather than claims. Nothing is centred, nothing floats, nothing glows.

The density is editorial rather than marketing: long measures (46–68ch), generous leading (1.65–1.75 on prose), and display type pulled tight (-0.035em, 0.98 line-height) so headings read as a mass against the open space beside them. Depth is entirely tonal. A single near-black band interrupts the ground as punctuation, at most twice, and brand gold appears once per viewport on one action. The restraint is the proof: a school that has real Fidelity statements to show does not need a gradient.

The world is confirmed against one anti-reference, which is the system it replaced on this same site: a dark photo hero under gradient scrims, gold on every element, centred card stacks, rounded corners, and two display faces. Every rule below exists because that version shipped and was removed.

**Key Characteristics:**
- One ground (#faf9f6) and one interrupting band (#141414); no third surface
- One typeface, Inter, separated only by weight and scale
- Rules graded to three weights; no cards, no shadows, no radius
- Photographs as plain rectangles: no radius, no overlay, no gradient
- Brand gold once per viewport, on the primary action, nowhere else
- Exactly one authored motion moment on the whole page

## Colors

A near-monochrome warm-grey palette in which the only chromatic event is the single gold action.

### Primary
- **Brand Gold** (`{colors.gold}`): The single action colour. It appears on the in-page primary webinar button and nowhere else on a surface. Darkens on hover (`{colors.gold-hover}`). It is never used for text on the ground, never for rules, never for icons, never for emphasis inside prose.
- **Accessible Gold** (`{colors.gold-ink}`): The gold that passes contrast. It is the focus-ring colour and the caret colour, never a fill. It exists so the brand hue can appear in interactive feedback without failing AA.

### Neutral
- **Warm Paper** (`{colors.ground}`): The one light ground. Every light section, the header, and the dropdown panel all sit on it. There is no second light surface.
- **Near-Black Band** (`{colors.band}`): The only dark surface. It carries the trust figures and the footer. Text on it is white at full strength for figures and headings, and 65% white for supporting copy.
- **Ink** (`{colors.ink}`): Headings, display type, strong emphasis inside prose, link text, the header action fill, and the heaviest rule weight.
- **Reading Ink** (`{colors.ink-prose}`): Long-form prose and the hero deck. A half-step softer than ink so a 60ch paragraph does not read as a headline.
- **Soft Ink** (`{colors.ink-soft}`): Secondary copy, list rows, captions on the ground, inactive nav links.
- **Faint Ink** (`{colors.ink-faint}`): Disclaimers, step numerals, attributions, legal fine print. The quietest legible value in the system.
- **Standard Hairline** (`{colors.rule}`): The default section and column divider.
- **Light Hairline** (`{colors.rule-light}`): Repeated list rows only, where the standard weight would stripe the page.
- **Band Hairline** (`{colors.rule-on-band}`): The divider inside the dark band.
- **Underline Grey** (`{colors.underline}`): Resting underline colour on inline links; it resolves to ink on hover.

### Named Rules

**The One Gold Rule.** Brand gold appears exactly once in any viewport, on the primary webinar action. A second gold element anywhere on screen is a defect, not a variant. The header's own webinar button is ink, specifically so the hero's gold stays alone.

**The Single Ground Rule.** There is one light surface, `{colors.ground}`. No white panel, no tinted card, no 2% luminance step to suggest a container. A previous build added a `#ffffff` panel and it cut nine visible seams into the page; section separation is done with hairlines and vertical space, never with a surface change.

**The Twice-Dark Rule.** The `{colors.band}` band appears at most twice per page. On the homepage it is the trust figures and the footer. A third dark band turns punctuation into a pattern.

## Typography

**Display Font:** Inter (with `system-ui`, `sans-serif`)
**Body Font:** Inter (with `system-ui`, `sans-serif`)

**Character:** One face, worked hard. Display sizes run at 800 weight with -0.035em tracking and 0.98 line-height, so headings compress into a solid left-aligned block; body sizes run at 400 with 1.7 leading and normal tracking. The distance between them is weight and scale, not family. Inter is loaded as a webfont in `client/index.html`; no system display face is ever substituted.

### Hierarchy
- **Display, hero** (800, 2.75rem → 4.5rem at `lg`, 0.98): The academy name in the first viewport. One per page. Set with `text-wrap: balance` and a manual line break, left-aligned.
- **Display, section** (800, 2.5rem → 4rem at `lg`, 0.98): Section openers, held to a 14–18ch measure so they stack into two or three short lines.
- **Display, minor** (800, 1.75rem → 2.25rem, 0.98): Call-to-action and podcast headings, where a section-scale display would outweigh its content.
- **Deck** (400, 1.375rem → 1.5rem, 1.45, -0.015em): The positioning sentence under the hero heading, in reading ink at a 26ch measure. One per page.
- **Title** (600, 1.0625–1.125rem, 1.3, -0.01em): Column heads, feature names, road-step names, figure titles. Always ink.
- **Body** (400, 1.0625rem, 1.7): Prose at a 46–68ch measure (`tf-measure` caps at 68ch). Steps up to 1.125rem on explanatory sections at `sm` and above.
- **Label** (600, 0.9375rem, 1.6): Buttons, names, attributions, dark-band stat labels.
- **Micro** (400, 0.8125–0.875rem, 1.6–1.7): Figure captions, disclaimers, legal links. The compliance disclaimer runs at this size with 1.7 leading and a 90ch measure so it stays genuinely readable.
- **Figure** (800, 2.5rem → 3rem, 1, -0.03em, tabular numerals): The trust-band statistics on the dark band.

### Named Rules

**The One Face Rule.** Inter is the only typeface. Hierarchy is weight (400 / 600 / 800) and scale. A second family, including a system display stack, is a defect.

**The Left Edge Rule.** Display and heading type is left-aligned on the grid's left edge. Nothing in this system is centre-set, and the empty space is placed deliberately below and beside headings rather than balanced around them.

**The Tabular Numbers Rule.** Every number that is a record — account percentages, student counts, step numerals, ratings — carries `font-variant-numeric: tabular-nums` (`.tf-nums`). Figures that shift width while reading read as marketing.

## Layout

A 12-column grid inside a 1320px maximum container, with 24px gutters that open to 32px at `lg`. Columns are assigned asymmetrically and on purpose: 6/6 in the hero, 7/5 where prose leads a photograph, 5/7 where a heading introduces an explanation, 4/8 for the podcast. Column gaps are 40px stacking to 64px at `lg`; the grid collapses to a single column below `lg`.

Vertical rhythm is a repeated 64px section pad opening to 80px at `sm` (`py-16 sm:py-20`), with 48–64px between a section heading and its content and 20–40px inside a block. The fixed header is 72px tall and the hero carries a matching 72px top offset. Breakpoints are Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 1024px.

Reading measures are capped per role rather than globally: 26ch for the deck, 46–56ch for short persuasive paragraphs, 62–68ch for long prose, 90ch for the compliance disclaimer. Headings are capped at 14–18ch.

### Named Rules

**The Rule-Not-Box Rule.** Sections are separated by a hairline and vertical space. A section is never given a background, a border on all four sides, or inner padding that implies a card.

**The Deliberate Void Rule.** Short columns are left short. The hero's left column ends well above the photograph's lower edge and that space stays empty; filler is not added to balance a row.

## Elevation & Depth

This system has no shadows. There is not a single `box-shadow` in the homepage chain, and no gradient, scrim, or overlay anywhere in it. Depth is purely tonal and positional: the off-white ground recedes, the near-black band advances, graded hairlines establish which divisions matter, and the fixed header separates from the page by a single standard hairline rather than a shadow on scroll.

### Named Rules

**The No-Shadow Rule.** Surfaces are flat at every state, including hover and focus. Hover is a colour change; focus is a 2px `{colors.gold-ink}` outline at 3px offset. Elevation is never simulated.

**The Graded Rule Rule.** Rules carry three weights on the light ground, and the weight is the information:
- **Ink rule** (`border-bottom: 2px solid {colors.rule-ink}`): under a column head, and above a concluding block. Reserved for structural divisions the reader must not miss.
- **Standard hairline** (`border: 1px solid {colors.rule}`): section boundaries, column dividers, the header's lower edge, the border on the two Fidelity figures, dropdown panel edges.
- **Light hairline** (`border-top: 1px solid {colors.rule-light}`): repeated rows inside a list or a review grid, where the standard weight would read as striping.

On the dark band there is one weight only: `{colors.rule-on-band}`.

## Shapes

Zero radius, everywhere. Buttons, images, panels, and the dropdown are all square-cornered; the legacy `--radius: 0.375rem` token in `index.css` is not consumed by anything in this page chain. Form language is rectangular and edge-aligned: a photograph is a rectangle cropped to its column (`object-cover` with an explicit `object-position` where the subject is off-centre), a figure is that rectangle plus a caption beneath it, and a button is a rectangle of text with 16px/32px padding.

The two exceptions are third-party marks, which keep their own trademarked geometry and colour: the BBB accreditation mark and the Apple Podcasts / Spotify / YouTube platform icons. These are reproductions of someone else's identity, not expressions of this one, and their pills and rounded squares do not license radius or colour anywhere else.

### Named Rules

**The Plain Rectangle Rule.** Photographs ship unmodified: no radius, no shadow, no border on the ground, no overlay, no gradient, no duotone, no text set on top of them. The two Fidelity captures are the only images that carry a border, a standard hairline, because they are evidence being framed.

## Components

### Buttons
- **Shape:** Square corners (`{rounded.none}`), inline-flex, no border.
- **Primary (in-page):** Gold fill with ink text, 16px/32px padding, 0.9375rem at 600 weight. One per viewport. Hover darkens the fill to `{colors.gold-hover}` over 200ms; no lift, no shadow, no scale.
- **Header action:** Ink fill with warm-paper text, 10px/20px padding, 0.8125rem at 600. Deliberately not gold so it never competes with the in-page primary.
- **Focus:** Global `:focus-visible` — 2px `{colors.gold-ink}` outline at 3px offset. Never removed, never replaced per component.

### Navigation
- Single 72px row on the warm-paper ground, fixed, closed by one standard hairline. Wordmark left (mark plus a two-weight lockup: "Trader" at 500, "Foundation" at 800, -0.02em). Links right at 0.875rem in soft ink, resolving to ink on hover and ink at 600 weight when active. The four course pages sit behind one "Learn" disclosure button with a 14px chevron that rotates 180° over 200ms; the panel is a square warm-paper rectangle with a standard hairline, closed on outside click and Escape. Below `md` the row collapses to an icon toggle and a stacked panel separated by a standard hairline; the mobile webinar action is the ink button, full width.

### Figures
- An image with no radius and no shadow, caption beneath at micro scale in soft ink, numbered ("Figure 1."), numerals tabular. Evidence images carry a standard hairline border; narrative photographs carry none.

### Editorial Table
- The signature component. A curriculum is set as two grid columns, each opened by a title-scale column head over an ink rule, with items as rows separated by light hairlines. Numbered sequences use a fixed `2.5rem` numeral column in faint ink with tabular numerals, `aria-hidden` because the ordered list already carries the order. Rows have vertical padding only (20px for described steps, 12px for bare items) and no horizontal inset, so every row shares the grid's left edge. No cards, no bullets, no icons.

### Dark Band
- Full-bleed `{colors.band}` section, 56–64px pad. Figures in white at display weight with tabular numerals, labels at 65% white, one `{colors.rule-on-band}` divider. No accent colour and no card chrome inside it.

### Motion
- **The entrance:** `.tf-rise` on the hero copy column only. 900ms `cubic-bezier(0.16, 1, 0.3, 1)`, from `translateY(14px)` and `opacity: 0.55` to rest. It begins from already-legible opacity so content is never invisible, and the whole rule sits inside `@media (prefers-reduced-motion: no-preference)`.
- **State transitions:** `transition-colors` at 200ms on buttons, links, and social icons; the chevron's 200ms rotation. Nothing else moves.

### Browser Surfaces
Themed rather than left to the browser: `::selection` is ink on warm paper (inverted), `caret-color` and `:focus-visible` are `{colors.gold-ink}`, scrollbars are `scrollbar-color: #c9c4b8 {colors.ground}` at `thin`, and link underlines sit at `0.18em` offset with `1px` thickness.

## Do's and Don'ts

### Do:
- **Do** set every light surface on `{colors.ground}` and separate sections with a graded hairline plus vertical space.
- **Do** grade rules to the three weights: ink 2px under column heads, standard 1px for sections and columns, light 1px for repeated rows.
- **Do** keep Inter as the only typeface and build hierarchy from weight (400 / 600 / 800) and scale alone.
- **Do** set display type left-aligned at 800 weight, -0.035em tracking, 0.98 line-height, capped at a 14–18ch measure.
- **Do** place exactly one gold action per viewport and make every other action ink or a plain link.
- **Do** ship photographs as plain rectangles cropped to their column, with the caption beneath.
- **Do** give every number that is a record tabular numerals (`.tf-nums`).
- **Do** keep the global `:focus-visible` ring (2px `{colors.gold-ink}`, 3px offset) on every interactive element, and hold WCAG 2.2 AA with Lighthouse accessibility at 100 and zero failing audits.
- **Do** guard any new motion behind `prefers-reduced-motion` and start it from a legible state.
- **Do** write new surfaces in Tailwind 4 utilities against the `--tf-*` custom properties in `client/src/index.css`; this is a Vite + React SPA, not Astro, and there are no CSS modules.

### Don't:
- **Don't** introduce a second light surface, including a `#ffffff` panel. The 2% step reads as nine unintended seams, which is why the panel token was abandoned.
- **Don't** use the `{colors.band}` band more than twice on a page.
- **Don't** put gold on anything but the single primary action: no gold rules, gold icons, gold headings, or gold emphasis in prose.
- **Don't** add a radius, a shadow, a gradient, a scrim, or an overlay. Not on buttons, not on images, not on the header at scroll.
- **Don't** set text over a photograph.
- **Don't** add an eyebrow, kicker, or letterspaced small-caps label above a heading. The build ships none and the heading carries its own context.
- **Don't** centre display type or balance a row with filler to fill a short column.
- **Don't** rebuild a list as cards. Rows separated by light hairlines are the pattern.
- **Don't** add a second typeface, including a system display stack, or reach for the legacy Sen / DM Sans pairing still present on unconverted routes.

## Status

This system is the **target**, not a description of the whole site. As of 2026-10-04 it is shipped on the homepage (`client/src/pages/Home.tsx`) and the shared `Navigation` and `Footer`. Roughly nineteen other routes still carry the previous visual system: gold accents throughout, Sen and DM Sans, rounded cards. Those routes are to be converted to this system; their current state is not evidence of it.

The `--tf-*` tokens live under `:root` in `client/src/index.css`. The earlier Tailwind/shadcn oklch token block above them (`--primary`, `--radius`, `--color-gold`, `--color-ivory`, and the chart scale) is still live because the unconverted routes consume it. New work on this system should not read from it.

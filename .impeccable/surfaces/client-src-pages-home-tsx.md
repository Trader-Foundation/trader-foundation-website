---
version: 1
slug: "client-src-pages-home-tsx"
primary_target: "client/src/pages/Home.tsx"
related_targets: ["client/src/components/HeroSection.tsx","client/src/components/FrameworkSection.tsx","client/src/components/MeetVladSection.tsx","client/src/components/StatsSection.tsx","client/src/components/Navigation.tsx","client/src/components/BookCallCTA.tsx"]
---

## Scope

The traderfoundation.com homepage (`client/src/pages/Home.tsx`) and the components it renders. Visitor mode: Persuade. First surface of a site-wide restyle; the other routes follow once this one is approved.

## Audience, job, action

Complete beginners to trading (vladt83, 2026-10-04), mid-career, in work, no market vocabulary assumed. Capital is implied by the subject, never stated as an entry gate. One action: register for the live webinar at live.traderfoundation.com.

## Proof and content that must survive

The two real Fidelity screenshots with their disclaimer (vladt83 explicitly required results stay visible), the framework section shipped in PR #54, Vlad teaching as the hero image, the conditional guarantee, and the accessibility floor of WCAG 2.2 AA (currently Lighthouse 100).

## Direction contract

THESIS: This page is a school's prospectus, not a trading pitch. It owns the claim "beginners are taught here, by a person, in order" and refuses the category default it currently ships: a dark photo hero under gradient scrims, gold on every element, centred card stacks, and 8,785px of scroll.

OWN-WORLD: Off-white #faf9f6 ground, near-black #1a1a1a ink, grey #6b6b6b letterspaced small-caps eyebrows, hairline rules #e4e0d8. One typeface across the page, separated by weight and scale: display at 64-76px, 800 weight, -3% tracking, left-aligned, against 17-18px body at generous leading. Photographs are plain rectangles, full-bleed to their column, no radius, no shadow, no overlay, no gradient. A near-black #141414 band appears at most twice as punctuation. Brand gold #c7ab77 appears once per viewport, on the primary button, and nowhere else.

STORY: A beginner lands, understands in one line that this is a school where Vlad Tayman teaches people with jobs to swing trade, believes it because real Fidelity accounts, a named coach and a conditional guarantee are shown plainly rather than decorated, and registers for the live webinar.

FIRST VIEWPORT: One-row nav, wordmark left, four links and the gold Live Webinar button right. Below it a two-column field: left 52%, the academy name at display scale, a two-line positioning sentence, the gold button, then a hairline and a two-line note on Vlad. Right 44%, vlad-hero.jpg as an unmodified rectangle. Deliberate empty space below the left column; nothing is centred.

FORM: The editorial direction pinned by the user against goatacademy.org as reference; first on my ordered grounded list. Seed key e918869a, assignment index 4 acknowledged and overridden by the brief pin, which Impeccable's direction rules give precedence.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Whether the 1,200+ / 14 years / 5 years stats are verified figures; they are published today and kept, but their provenance is unrecorded.

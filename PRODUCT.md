# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: complete beginners to trading (confirmed by vladt83, 2026-10-04). Mid-career people with a full-time job and a career already built, who want to learn to trade around their schedule rather than leave work to day-trade. They arrive knowing little or nothing about markets.

Capital: trading requires capital, and the programme is priced for people who have it, but that is treated as implied rather than stated as an entry gate in page copy (vladt83, 2026-10-04: "with trading it's kind of implied capital needs to exist"). The previous hero copy led with "For professionals ready to trade with $15,000+. Application required"; leading with that qualifier is no longer the intent.

## Product Purpose

An online trading academy that teaches swing trading from the beginning: foundation and psychology, chart and indicator reading, stocks, options, and the Paycheck Collector method (selling options on liquid stocks and indices for defined-risk premium). Students are taught by Vlad Tayman and Trader Foundation coaches.

Success for the website: the visitor registers for the live webinar at live.traderfoundation.com. That is the single primary conversion action on every page (confirmed by vladt83, 2026-10-04; PR #48 had already replaced the Book a Call CTAs with it).

## Positioning

Every student gets their own named coach, and intake is capped at sixteen students a month because of it. Weekly one-on-one check-ins, homework that is reviewed and handed back, assessments, and an accountability partner are part of the programme rather than upsells. The guarantee is conditional and stated publicly: follow the system, do the homework, attend the coaching sessions, and if you are not winning at least 70% of your trades within 90 days, you get your money back.

## Operating Context

- Funnel: site CTAs send visitors to a live webinar at live.traderfoundation.com. Leads are handled in GoHighLevel.
- Community: Skool (skool.com/tfelite), a live room five days a week, and a daily "Stocks To Buy And Why" post covering wins and losses.
- Coaching: weekly one-on-one sessions, reviewed homework, assessments, an accountability partner from day one, and access to a financial professional for the wider picture.
- Sibling properties: the Felix-style editorial reference is external; Trader Foundation's own properties are the main site, the webinar host, and the Skool community.

## Capabilities and Constraints

- Stack is fixed by the existing codebase: Vite 7 + React 19 single-page app, Tailwind 4, wouter routing, pnpm 10.4.1, deployed on Vercel. Not Astro. A future migration to Astro is an open team decision, not part of this work.
- The repository is public, and other sessions ship unrelated work (dashboards, bots) into it.
- Mobile Lighthouse performance sits around 64 with a ~931 KB JS bundle; the studio's usual 95+ bar is unreachable on this stack, so performance is judged against that baseline rather than the house standard.
- Accessibility is a hard requirement, not a preference (see below).
- Any page carrying performance claims must carry the matching disclaimer; disclaimer and earnings wording is never drafted or reworded without an approver.

## Brand Commitments

- Name: Trader Foundation, also "Trader Foundation Academy".
- Vlad Tayman is the face of the brand. He is shown teaching wherever a page shows him in a teaching context; the headshot is reserved for the About bio and the OG image.
- Brand gold is `#c7ab77`; `#876b38` is its accessible variant for text on light backgrounds. The logo exists in a black-and-white box variant that is recoloured to match each design.
- Binding visual constraint, volunteered by vladt83 on 2026-10-04 and recorded without expansion: the site should read "more clean", modelled on goatacademy.org, with one clean typeface, a near-monochrome editorial page, and brand gold reduced to a rare accent (the primary CTA).

## Evidence on Hand

- Real Fidelity account screenshots: Roth IRA +142% and HSA +83% over three years (`client/public/images/results-roth-ira.png`, `results-hsa.png`), both carrying a "results vary / past performance" disclaimer. vladt83 confirmed on 2026-10-04 that results must stay visible on the homepage.
- Photography: `vlad-hero.jpg` (teaching), `vlad-teaching-card.jpg`, `vlad-founder.jpg` (headshot), `vlad-family.jpg`.
- Trust marks: BBB accredited business A+ badge, Trustpilot assets component, a `/results` page of student accounts and messages shared with permission.
- Stats currently published on the homepage: 1,200+ students, 14 years experience, 5 years in business. Their provenance is not recorded in studio memory; treat as claims to be confirmed, not as verified figures.
- No press or media coverage is recorded. Testimonials, customer counts, benchmarks, and pricing must never be invented.

## Product Principles

1. Beginners first: explain before persuading. Assume no prior market knowledge and no jargon the page has not earned.
2. Proof is real and sourced. Only real accounts, real screenshots, and claims the team can stand behind, each with its disclaimer attached.
3. The coach is the product. The named coach, the weekly contact, and the sixteen-a-month cap are the difference, not the strategy itself. Keep them visible.
4. One action per page: register for the live webinar.
5. Compliance travels with the claim. A performance number and its disclaimer are never separated.

## Accessibility & Inclusion

WCAG 2.2 AA. The homepage currently scores 100 on Lighthouse accessibility with zero failing audits, after a deliberate remediation (PR #50); that standard is maintained, not traded away for visual effect. Text-on-light gold is `#876b38`, never `#c7ab77`.

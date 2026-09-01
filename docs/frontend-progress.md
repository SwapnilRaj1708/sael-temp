# Frontend Progress Tracker

**This file is the single source of truth for what to build next.** Read `/CLAUDE.md` §3 for the rules governing it.

Rules, in short:

- Exactly **one** item is In Progress at any time.
- Finish it → move to **Done** → promote the top **Pending** item into **In Progress**.
- Tracker changes are committed **in the same commit** as the code they describe.
- Never skip ahead. If the order looks wrong, raise it — do not reorder alone.

Legend: `Reads` = the supporting docs to load for that item (beyond `/CLAUDE.md` and the item's own feature doc).

---

## ✅ Done

| ID | Item | Feature doc | Owner | Completed |
|---|---|---|---|---|
| FE-03 | App shell — header, mobile nav, footer, layout | `features/03-app-shell-header-footer.md` | Swapnil Raj | 2026-08-04 |
| FE-02 | Design system foundation (tokens, fonts, primitives) | `features/02-design-system-foundation.md` | Swapnil Raj | 2026-08-04 |
| FE-01 | Initial project setup | `features/01-initial-project-setup.md` | Swapnil Raj | 2026-08-04 |

---

## 🔨 In Progress

| ID | Item | Feature doc | Reads | Owner | Started |
|---|---|---|---|---|---|
| FE-04 | Homepage | `features/04-homepage.md` | `design-guidelines.md`, `responsive-strategy.md`, `content-model.md`, `asset-inventory.md` | Swapnil Raj | 2026-08-04 |

Built section by section, in the order the client's design lays them out. **Built to
`SAEL - New Website.pdf`, not to the Designer prototype** — that reversal and what it
changes per section is recorded in `asset-inventory.md` §10.

**Revised on 2026-08-20 against `SAEL Home v2.dc.html`**, the client's Claude Design
project (`980d47d4-c8e2-40f1-a514-465c538039fb`, read through the design MCP). That
file is now the reference for the sections marked below; the PDF still governs the
ones it does not cover. Where the client's instruction and v2 disagree, the
instruction wins and the disagreement is recorded beside the token or component.

| # | Section | Component | State |
|---|---|---|---|
| 1 | Hero carousel | `sections/hero-carousel/` | **Rebuilt to v2.** One composition, not four: mark → red rule → headline in a single column, right half above `lg` and bottom-anchored below it. The six per-slide placement coordinates are gone. The progress bar pinned to the section's base runs **one full sweep per slide** — four segments, then a quarter-run per slide, then this (2026-08-22). Headline set at `--text-hero`, not v2's larger size — the client's call. Slide 2's crop is shifted right above `lg` so its subject clears the headline. Autoplay still does not pause on hover, only on keyboard focus |
| 2 | About SAEL | `sections/intro-split/` | **Rebuilt to v2** on 2026-08-21, after being held back a day. The PDF's fixed 1280:528 stage and its whole `--about-*` coordinate set are gone; it is a twelve-column grid with a display heading, a rule and running copy beside the composite. Copy on columns 2–6 and artwork on 7–11, drawn in off the gutters rather than v2's 1–6 / 8–12 — the client's call |
| 3 | Business portfolio | `sections/business-tiles/` | **Rebuilt to v2.** A ledger of four rows on the black dotted ground, not four centred tiles on a light one. Capacity figure is now the largest thing on the row. Solar Cell Manufacturing carries its own frosted-grey ground as the one upcoming business. Marks are at three quarters of v2's own `clamp(92px, 10vw, 176px)` — the design's curve, our scale (2026-08-22). The agri mark's per-row nudge was withdrawn the same day; `iconScale` survives unused for when it returns. The copy is capped at v2's 46ch so it wraps before it reaches the mark, and the gutter beside the mark was deliberately **not** reduced with the mark. Each mark is drawn on **its own aspect ratio**, not forced square: the four run 0.918 to 1.040, so a square box letterboxed each differently and left the agri-waste leaves visibly smallest. **And the mark is in flow**, a real column beside the copy, rather than absolutely positioned over the row with a right padding reserving space for it — an out-of-flow box whose only child is also out of flow has no content to size against, so its height came from `aspect-ratio` alone and kept resolving short, which is what was trimming the artwork. `--spacing-ledger-gutter` went with it; a `gap-x-flow` does that job now. Both 2026-08-24. **All of that box is gone as of 2026-08-26**: the mark is a plain `<Image>` at a width with `h-auto`, so it draws at its own proportions with nothing to letterbox and nothing to clip, and `iconScale`, `--aspect-icon-mark` and the `<MediaFrame>` around it went with it. The four PNGs were re-cut the same day — see the revision note below |
| 4 | Our Current Power Portfolio | `sections/presence-map/` | **Rebuilt to v2** on 2026-08-21, and the layout review it was waiting on is closed: map left, display heading with the footprint label and the two figures right, nothing positioned over the artwork any more. A centred flex row rather than v2's 1–6 / 8–12 grid: on a grid both halves are capped and the slack lands between them, which is what kept reading as a hole. The two figures sit a `--spacing-stack` apart and the rule over the footprint label is capped at `--map-rule-w` — all the client's calls, 2026-08-21 and -22. **The 751-subpath generated map is gone**, replaced by the client's supplied `dotted-map.svg`; the six site coordinates are mapped across from the old viewBox and **want a visual check** — see the note in `presence-map/dots.ts`. Carries a **"Portfolio"** section label as of 2026-08-26 — v2's own screen has none, so this is a deliberate departure at the client's request |
| 5 | Our Endeavour | `sections/endeavour-split/` | Unchanged. Left as-is at the client's request on 2026-08-20. **Moved ahead of Solutions on 2026-08-26** — a two-line reorder in `page.tsx`; the section itself is untouched |
| 6 | Solutions | `sections/solutions-carousel/` | **Rebuilt to v2** — four 4:3 plates a hairline apart, each captioned underneath; the gradient plaque is gone. It was kept **before** Our Endeavour and set on the light ground, both the client's calls on 2026-08-20; **both were withdrawn on 2026-08-26** and it now follows Our Endeavour on the black ground, which is v2's own arrangement. The flip minted no token — every ramp is the declared dark counterpart of the paper one it replaced |
| 7 | Our Goals | `sections/goals-grid/` | **Rebuilt to v2** — three cards a hairline apart inside a hairline frame, on black. **The resting state shows the photograph untreated**: the scrim arrives with the pointer, along with the description. The three marks are the client's own artwork as of 2026-08-21, inverted to white at the call site; the `lucide-react` stand-ins are gone. Sized 40 → 56px, then ~4.5x that on 2026-08-22, then halved again to 60 → 126px on 2026-08-24 against the client's revised artwork — the mark is the card's subject, not an icon over a title. **Two sets of marks are in `src/assets/images/`**: `*-goal.svg`, which is what is wired up, and a later `*-icon.svg` set. Confirm which is current before this ships |
| 8 | In the News | `sections/news-carousel/` | **Rebuilt to v2.** The card lost its box — a hairline it hangs from, the date above a 5:4 thumbnail, the accent filling across the rule on hover. Still the one homepage surface fed by the repository |
| 9 | Pixel strip | `sections/footer-pixel-strip/` | Drawn to a canvas. **Moved into the footer on 2026-08-27** and mirrored to do it — solid along its top, dissolving downward, on the flat footer colour with no dot grid. It closed the page from `sections/pixel-strip/` until then, on the dotted paper ground as of 2026-08-26; that version is **retired** to `sections/_retired/pixel-strip/`, which is lint-blocked from being imported. The two files differ by the ground and by one expression, the row's `y` |
| — | Timeline (v2 §08) | — | **Not built.** Deferred by the client on 2026-08-20; to be revisited |
| — | SDG marquee (`features/04` §9) | — | **Skipped**, confirmed by the client on 2026-08-05: not to be built for now |
| — | Our Strength (§7), vision timeline (§8) | — | Not started. Neither appears in the client's PDF — ask before building either |

Landed alongside the v2 revision:

- **`--text-display` (30 → 64px)**, v2's gradient section heading, now used by About
  SAEL, Solutions and the Power Portfolio. `--text-h2` (24 → 36) is left to headings
  inside a card or a rail. `--text-stat-large` (36 → 76) is the footprint figures.
- **The footer takes v2's ground** — `--color-footer-bg` is `#22262e`, a cool slate
  in place of the green-grey it was, with `--color-footer-icon` a shade deeper again
  because it is painted on a white pill rather than on the ground.
- **New client assets, 2026-08-21**: `dotted-map.svg` and the three goal marks, all in
  `src/assets/images/`. The goal marks are drawn in near-black and inverted to white
  with `brightness-0 invert` — they cannot be inlined as components, because all three
  declare the same `clippath` id.

- **`--text-eyebrow` up ~15%** (13 → 16px becomes 15 → 18px), at the client's request:
  every section label on the site moves with it. Note this is the one place the
  instruction and v2 disagree — v2 sets those labels at 10px.
- **`<CardRail>` is gone**, replaced by `ui/rail/` — a `<Rail>` provider with a
  `<RailTrack>` and a `<RailArrows>` that the section places itself. v2 sets the
  arrows in the heading row rather than over the artwork, and one component cannot
  render its own part into a sibling's layout.
- New primitives: `ui/arrow-glyph.tsx`, and a `micro` size on `<Button>`. `<Eyebrow>`
  gained the `bright` and `deep` tones; `<FlankedEyebrow>` gained `rules="leading"` (and was
  deleted again on 2026-08-26 — see below);
  `<Section>` gained the `black`, `black-dots`, `paper` and `paper-dots` grounds.
- Tokens with no consumer left after the revision were removed (the hero dot sizes,
  the light-ground figure colours, the solutions plaque gradient, the always-on goals
  scrim, the tile type scale, the About stage's coordinates, the map's dot ramp).
  `lib/utils/cn.ts`'s `FONT_SIZES` list was updated to match — a `--text-*` token
  missing from it is silently discarded by `cn()`.

**Revised again on 2026-08-25 and -26**, against the client's review of the deployed
build and a second read of `SAEL Home v2.dc.html` through the design MCP:

- **The masthead's outer bar is v2's, turned over into the light.** A flat 68px at every
  width (the `lg` step to 84px is gone — v2 draws one height), `blur(22px) saturate(1.4)`,
  one flat translucent veil at v2's 0.70 → 0.86 in place of the vertical gradient, the
  hairline at its 0.09 → 0.13, its `.3s` transition, and its 8px scroll threshold in place
  of 80. **No shadow at any scroll position** — v2 draws none, so `--shadow-header` and
  `--gradient-header` went with it. Only the structure crossed over, never the hue: the
  design's bar is dark and this one stays light, which is the client's explicit call.
- **The six nav links are v2's middle section**, read off the deployed design rather than
  guessed: `--text-nav-item` at 11px/700/0.18em uppercase, no pill, a
  `clamp(4px, 1vw, 18px)` gap. `--color-nav-pill` and `--radius-nav-pill` went with the
  pill. The CTA is deliberately *not* moved — it still takes `--text-nav`, which is why
  there are now two nav type tokens. The current-page rule is kept; v2 has no equivalent
  and a prototype can afford that, a site cannot.
- **Section labels lost the leading dash and gained an underline that draws itself in.**
  `<FlankedEyebrow>` is deleted — it existed only to draw that dash — and `<Eyebrow>` now
  carries the rule itself, on by default, in the label's own ramp, so picking a tone picks
  both. The rule is CSS reading the `data-reveal` on the `<Reveal>` it already sits in, so
  it replays with everything else and costs no script.
- **The dot grid is one utility now** (`ground-dots-paper` / `ground-dots-dark` in
  globals.css, colour and image and cell size travelling together) and covers **every
  section but the hero**, the pixel strip included. The dot carries a token radius shared
  by both grounds and a half-pixel of feather, so it survives a zoom-out that used to
  erase it — verified 33% → 300%; below 33% it goes, which is the cost of the alphas
  coming down. Those alphas are ~0.4x their original weight after the first pass rendered
  them roughly three times too heavy: the radius went up for the zoom fix and the alpha
  went up alongside it, and the two multiply.
- **The Business Portfolio marks are plain `<Image>`s.** `<MediaFrame>` is for a photograph
  filling a box its parent sized, so using it for a mark meant undoing it three times over
  — a computed aspect ratio, `object-contain`, `overflow-visible`. A static import already
  carries the artwork's intrinsic size.
- **The four business icon PNGs were re-cut** from the hero masters on 2026-08-26. The
  originals were sliced through at the bottom edge — `icon-solar-module.png` ended in a
  132px run of fully opaque artwork sitting *on* its last row — so the crop the client
  reported was baked into the files and no CSS change could have fixed it. They now run
  0.838 to 1.002. **The hero symbol filenames are crossed**: the lettering baked into the
  masters proves `sael-icon-1` is the solar-energy mark and `-3` the cell mark, where the
  hero slides pair them the other way round. The business icons are mapped by that
  lettering; **the hero carousel is not, and wants a look before this ships.**
- **Smaller, all client-requested:** the Solutions heading block stacks below `lg` and its
  title spans a line of its own above the copy and the arrows (its right-hand column was
  `flex-1`, whose `flex-basis: 0` meant it never wrapped — it was squeezed to a ~100px
  column with its copy running off the side of a phone); an Our Goals card pushes its mark
  and name up and brings the description in beneath a rule, rather than swapping one for
  the other; the capacity figures count up on every pass into view.
- **A rail can no longer scroll vertically.** `overflow-x: auto` drags `overflow-y` with it,
  so the entrance transform on the cards still off the right-hand end left every rail 28px
  scrollable *downward* — enough for one diagonal swipe on a phone to hide a news card's
  date under its own top edge, which is what the client was seeing. `rail-reveal-slack`
  absorbs the transform in end padding it takes straight back out of the flow.

**Revised a third time on 2026-08-26**, against a ten-step section sequence from the
client naming each section and its ground. Six of the ten already matched. Two were
fixed, and they are the same two the client had ruled on six days earlier:

- **Our Endeavour now precedes Solutions**, and **Solutions is on `black-dots`** — both
  restoring `SAEL Home v2.dc.html`'s own arrangement, and both explicitly withdrawing the
  2026-08-20 calls recorded in rows 5 and 6 above. The ground flip is eight token swaps
  and no new token: `paper-dots` → `black-dots`, `<Eyebrow>` `deep` → `bright`,
  `<DisplayHeading>` `paper` → `dark`, `text-body-soft` → `text-on-dark-soft`,
  `<RailArrows>` `paper` → `dark`, `border-hairline-paper` → `border-hairline-dark`,
  `text-meta-paper` → `text-on-dark-muted`, and the plate title's `text-ink` **deleted**
  rather than swapped — `<Section>` sets the ground's full-strength ink itself, so naming
  it at the call site was duplication on either ground.
- **The other two deviations were ruled deliberate by the client** and are not outstanding
  work: the Timeline stays unbuilt, and the pixel strip stays where it is rather than
  moving into the footer.

Both the comparison and the remediation plan are in
`docs/homepage-section-sequence-review.md`.

Also landed inside this item, as `features/05` intends: the content repository slice
(`src/lib/content/`) with its mock and API adapters behind `getContentRepository()`,
now carrying `getCapacityStats()` and `getNewsItems()`.

**And a change to FE-03, which is Done.** The masthead was reworked on 2026-08-05 to
the client's `assets/navbar/` design: pill nav links, a gradient Contact Us button, and
a full-screen mega menu in place of the per-item dropdowns (`nav-dropdown.tsx` is
gone). `features/03` §2 describes the old bar and is now the stale document.

Outstanding content, all rendering as `{{TODO: content}}` or flagged: hero `alt` ×4,
the page meta description, and the map's "Visit Location" URLs. **Kurnool's capacity and
the Patiala question are closed** — the map was rebuilt on 2026-08-27 from
`SAEL-Numbers and data.pdf` page 2, which pins eleven *states* rather than six sites, and
neither site is among them. Two things about that map still want the client: which legend
each figure belongs to (derived from page 1's totals, not read from the icons — the
reasoning is in `_content/homepage.ts`), and why the Solar IPP figures sum to 9090 MW
where the same PDF's page 1 says 8.3 GWp. The news items' `href` all point at `/newsroom/`
because no per-article URLs were supplied, and two of their dates are in the future —
both are the client's own design, transcribed rather than corrected. `alt` text for
Solutions, Our Endeavour, About SAEL and the news thumbnails is written and wants a
review.

Two deferred tasks to raise at the end of the project:

- The photography is committed unoptimised (~86 MB across `src/assets/images/`), by
  the client's decision on 2026-08-04 to proceed and revisit. The Our Goals
  backgrounds are the worst of it — 23 MB serving cards that render ~350px wide.
- ~~The Our Goals icons are `lucide-react` stand-ins.~~ Closed 2026-08-21: the client
  supplied the three marks.

---

## 📋 Pending

Delivery order. Items FE-02 → FE-04 are the critical path; nothing below FE-04 should start before the design system exists.

| ID | Item | Feature doc | Reads |
|---|---|---|---|
| FE-25 | Design-system reconciliation — guidelines vs. the as-built homepage | `design-reconciliation.md` | `design-guidelines.md` |
| FE-05 | Content repository + mock data layer | `features/05-content-repository.md` | `content-model.md`, `api-contracts.md` |
| FE-06 | About Us | `features/06-about-us.md` | `design-guidelines.md`, `responsive-strategy.md` |
| FE-07 | Our Team | `features/07-our-team.md` | `content-model.md` |
| FE-08 | Solar Energy | `features/08-solar-energy.md` | `design-guidelines.md` |
| FE-09 | Waste to Energy | `features/09-waste-to-energy.md` | `design-guidelines.md` |
| FE-10 | Module Manufacturing | `features/10-module-manufacturing.md` | `design-guidelines.md` |
| FE-11 | Solar Cell Manufacturing | `features/11-solar-cell-manufacturing.md` | `design-guidelines.md` |
| FE-12 | Story of Our Influence | `features/12-story-of-our-influence.md` | `design-guidelines.md` |
| FE-13 | Our Key ESG Metrics | `features/13-our-key-esg-metrics.md` | `content-model.md` |
| FE-14 | Our Core Beliefs | `features/14-our-core-beliefs.md` | `design-guidelines.md` |
| FE-15 | Sustainable Development Goals | `features/15-sustainable-development-goals.md` | `design-guidelines.md`, `accessibility-and-seo.md` |
| FE-16 | Investors hub + Corporate Governance + Notifications | `features/16-investors-hub.md` | `content-model.md`, `api-contracts.md` |
| FE-17 | Financials & Reports (5 nested document pages) | `features/17-financials-and-reports.md` | `content-model.md`, `api-contracts.md` |
| FE-18 | Newsroom (listing + pagination) | `features/18-newsroom.md` | `content-model.md`, `api-contracts.md` |
| FE-19 | Contact Us + Investor Contact (forms) | `features/19-contact-and-forms.md` | `api-contracts.md`, `accessibility-and-seo.md` |
| FE-20 | Career redirect | `features/20-career-redirect.md` | `accessibility-and-seo.md` |
| FE-21 | Legal pages (Privacy, Disclaimer, T&C) | `features/21-legal-pages.md` | — |
| FE-22 | SEO, redirects, sitemap, robots | `features/22-seo-and-redirects.md` | `accessibility-and-seo.md` |
| FE-23 | Backend API cutover (mock → Spring Boot) | `features/23-api-integration-cutover.md` | `content-model.md`, `api-contracts.md` |
| FE-24 | Performance & accessibility hardening pass | `features/24-hardening-pass.md` | `accessibility-and-seo.md`, `responsive-strategy.md` |

### FE-25 — landed

Listed first because it **precedes FE-06**, not because it is the next thing to start. All
of it has landed; the row stays until it is moved to Done alongside FE-04.
Opened after FE-04 revealed that `design-guidelines.md` named ~80 tokens against the 231
`theme.css` actually declares, so the document a new page is supposed to build from
described a homepage that no longer existed. Its spec is **`design-reconciliation.md`**
rather than a `features/NN-*.md` — it reconciles an existing document instead of
specifying a new surface, so there is nothing for a feature doc to hold that the ledger
does not already hold better.

**Landed as of 2026-08-26.** `design-guidelines.md` is realigned against `565a3dc` and is
authoritative again; the guardrail now enforces all four of `/CLAUDE.md` §2.2's value
rules (**C-5**), and the magic-number drift it was written to stop has been cleared
(**C-4**). Ten further fixes are in — **C-1**, **C-3**, **C-6 … C-12**. The full suite is
green.

**`ui/card.tsx` was rewritten, not just adopted** (**C-1**). Its spec described a boxed,
elevated card that v2 had removed, and it had no call sites, so the page's own shape — a
hairline, an inset, an accent that fills across the hairline — became the primitive.
`news-carousel` and `business-tiles` both consume it. Proved inert element-by-element.
Side effect for a later ruling: `ui/tile-shape.tsx` now has no call site, and three tokens
are stranded with it.

**C-2 closed by declining adoption** (2026-08-26). `ui/section-heading.tsx` cannot be
adopted by the homepage: four of the seven heading sections are an `<Eyebrow>` and nothing
else, and the other three wrap every element in its own `<Reveal>` so they cascade — which
a primitive rendering three siblings in one `<div>` cannot express. Its two consumers,
`error.tsx` and `not-found.tsx`, use it exactly as intended, so it was retained unchanged
and the finding recorded as a **documented non-defect**. What the three sections genuinely
shared — the gradient-clipped `--text-display` heading — was extracted as
**`ui/display-heading.tsx`** and all three migrated. Proved inert by two clean builds with
a byte-identical stylesheet.

**Nothing outstanding.** All twelve code fixes are done and the full suite is green.
**A session opening FE-06 should read `design-reconciliation.md` §9 first** — a handoff
covering the primitives, the ground/ramp rule, the `FONT_SIZES` trap, the magic-number
guardrail and the toolchain.

---

## 🚧 Blocked

Items that cannot start until an external dependency lands. Move to Pending once unblocked.

| ID | Item | Blocked on | Raised |
|---|---|---|---|
| FE-23 | Backend API cutover | Spring Boot endpoints + OpenAPI spec from backend team | — |
| — | Career redirect target URL | Client to confirm exact Oracle recruiting URL | — |
| — | DIN webfont licence confirmation | Client legal. The supplied files permit embedding (`fsType` 0 on the bold OTF, 8 on the regular), which is not the same as holding a licence | — |
| — | Footer contact email + the four social URLs | Client. Stubbed as `{{TODO: content}}` in `src/lib/config/site.ts` — *blocks FE-03* | 2026-08-04 |
| — | SAEL logo, **white** variant | Client. The colour logo ships as a PNG by decision on 2026-08-04, but white cannot be derived from it — the wordmark is a gradient over a black strapline. The footer renders the wordmark as DIN text meanwhile; swapping in the SVG is a one-element change in `footer.tsx` | 2026-08-04 |
| — | `footer-background.jpg` | Client. Absent from the handover, so the footer uses the flat `--color-footer-bg`. `asset-inventory.md` §4 | 2026-08-04 |
| — | Design sign-off on the mobile nav drawer | Design. Built to `features/03` §2 and verified against its accessibility contract; it has no prototype reference, so the visual treatment still wants a review | 2026-08-04 |
| — | A cut of DIN containing `₹` (U+20B9) | Client. Neither supplied file has the glyph, so rupee figures fall back to another face mid-number. Alternative: design approves writing amounts as `INR` — see `src/assets/fonts/README.md` | 2026-08-04 |

**Resolved 2026-08-05**, both by the client supplying the artwork, both consumed by FE-04:

- *Business tile icons without baked-in lettering* — supplied as PNGs in `src/assets/images/business/`. The tiles render them beside an HTML heading, so nothing is duplicated or cropped.
- *Hero overlay symbol icons* — supplied as `src/assets/images/hero/sael-icon-{1..4}.png` and wired per slide.

> FE-23 also appears in Pending because the mock-side scaffolding (adapter shape, env switch, Zod schemas) can and should be built ahead of the real endpoints. Only the final swap is blocked.

---

## Status definitions

| Status | Meaning |
|---|---|
| **Pending** | Specified, not started. Feature doc exists. |
| **In Progress** | Actively being built. Exactly one at a time. |
| **Done** | Acceptance criteria met, `pnpm check` clean, merged to `main` by PR. |
| **Blocked** | Cannot proceed without an external input. Must name the dependency. |

## Adding a new item

1. Write `features/NN-<slug>.md`.
2. Append a row to **Pending** with the next `FE-NN` ID.
3. If it introduces new data, update `content-model.md` and `api-contracts.md` in the same change.

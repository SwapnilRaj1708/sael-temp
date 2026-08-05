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

| # | Section | Component | State |
|---|---|---|---|
| 1 | Hero carousel | `sections/hero-carousel/` | Built |
| 2 | About SAEL | `sections/intro-split/` | Built |
| 3 | Business portfolio | `sections/business-tiles/` | Built — also carries the capacity figures, so `features/04` §2's stats band is not a separate section |
| 4 | Pan India green footprint | `sections/presence-map/` | Built — the dotted vector map. Silhouette wants another pass against the PDF |
| 5 | Solutions | `sections/solutions-carousel/` | Built — a four-plant carousel, not `features/04` §6's single banner |
| 6– | Our Strength, vision timeline, SDG marquee, Our Goals, In the News, pixel strip | — | Not started. Ask before starting Our Strength or the timeline: neither appears in the client's PDF |

Also landed inside this item, as `features/05` intends: the content repository slice
(`src/lib/content/`) with its mock and API adapters, behind `getContentRepository()`.

Outstanding content, all rendering as `{{TODO: content}}` or flagged: hero `alt` ×4,
the page meta description, Kurnool's capacity, the map's "Visit Location" URLs, and
whether Patiala belongs on the map. Solutions `alt` text is written and wants a review.

One deferred task to raise at the end of the project: the photography is committed
unoptimised (~60 MB across `src/assets/images/`), by the client's decision on
2026-08-04 to proceed and revisit.

---

## 📋 Pending

Delivery order. Items FE-02 → FE-04 are the critical path; nothing below FE-04 should start before the design system exists.

| ID | Item | Feature doc | Reads |
|---|---|---|---|
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

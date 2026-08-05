# Design Guidelines

Every value here is extracted from the approved Claude Designer prototype (`SAEL Home.dc.html`). Where the prototype used a `vw` value, this doc records the **computed pixel value at the 1920px design width** — that is the number to build against, then scale down per `responsive-strategy.md`.

**Rule: components consume tokens, never literals.** If you find yourself typing `#161616` or `8.13vw` inside a component, stop and use the token. `pnpm check` enforces this — a raw hex, an `rgb()` literal or a bare `vw` anywhere under `src/` outside `theme.css` fails the build.

> Two token names changed in FE-02, and the tables below carry the new names.
> `--color-body` became `--color-body-base`, because `--text-body` already
> claims the `text-body` utility for font-size and a name in both namespaces
> makes the colour unreachable; `--color-body-onDark` became
> `--color-body-on-dark` for consistency with every other token.
> See `src/styles/README.md`.
>
> A third changed in FE-04, for the same class of reason but a worse symptom.
> `--space-block` is implemented as **`--spacing-flow`**: Tailwind generates an
> `inline-size` utility for every spacing token, so `--spacing-block` minted an
> `inline-block` utility that collided with the core `display: inline-block`
> one and silently constrained every inline-block on the site to 24–50px wide.
> **When adding a spacing token, check the name against Tailwind's `inline-*`
> display utilities** — `inline-block`, `inline-flex`, `inline-grid`,
> `inline-table`.

---

## 1. Colour

### Brand core

| Token | Value | Use |
|---|---|---|
| `--color-brand-red` | `#E40F14` | Primary brand red; CTA gradient midpoint; icon strokes |
| `--color-brand-red-deep` | `#AA0505` | Eyebrow gradient start |
| `--color-brand-blue` | `#0D2FA2` | Eyebrow gradient end |
| `--color-brand-purple` | `#45258D` | CTA gradient end |
| `--color-brand-yellow` | `#F9E800` | CTA gradient start (barely visible, off-canvas at -24%) |
| `--color-brand-crimson` | `#E43026` | Stats band gradient start |
| `--color-brand-indigo` | `#4A3290` | Stats band gradient end |
| `--color-accent-hover` | `#E11D34` | Link hover across the site |

### Neutrals

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#161616` | Headings |
| `--color-body-base` | `#333333` | Body copy on light |
| `--color-body-soft` | `#4A4A4A` | Secondary body (business tile copy) |
| `--color-body-muted` | `#2B2B2B` | About-section body |
| `--color-body-on-dark` | `#E6E9EE` | Body copy on dark backgrounds |
| `--color-surface` | `#FFFFFF` | Default section background |
| `--color-surface-alt` | `#F7F7F9` | Goals section background |
| `--color-surface-dark` | `#0B0D10` | Dark sections (hero track, vision) |
| `--color-surface-darker` | `#05070A` | Letterbox reveal panels |
| `--color-surface-deep` | `#111418` | Hero fallback behind imagery |
| `--color-border` | `#ECECEE` | Card borders (news cards) |
| `--color-rule` | `#D9D9D9` | Stat divider rules |
| `--color-inert` | `#C7C7C7` | Goals card resting background |
| `--color-footer-bg` | `#3D4A48` | Footer base (under `footer-bg.png`) |
| `--color-footer-icon` | `#2F3D3A` | Social icon glyph fill |

### Gradients

Declare these as tokens; do not re-type the stops.

| Token | Value | Use |
|---|---|---|
| `--gradient-eyebrow` | `linear-gradient(90deg, #AA0505 0%, #0D2FA2 100%)` | Section eyebrows, clipped to text |
| `--gradient-cta` | `linear-gradient(105deg, #F9E800 -24%, #E40F14 6%, #45258D 95%)` | "Know More" / primary buttons |
| `--gradient-stats` | `linear-gradient(90deg, #E43026 0%, #4A3290 100%)` | Stats band |
| `--gradient-caption` | `linear-gradient(94.6deg, rgba(249,232,0,.82) -23%, rgba(228,15,20,.82) 6%, rgba(69,37,141,.82) 94%)` | Image caption badge |
| `--gradient-wash-strength` | `linear-gradient(270deg, rgba(254,0,0,.31) 0%, rgba(0,31,134,.31) 76.53%)` over `#fff` | "Our Strength" section |
| `--gradient-wash-goals` | `linear-gradient(120deg, rgba(170,5,5,.05) 0%, rgba(13,47,162,.05) 100%)` over `#F7F7F9` | "Our Goals" section |
| `--gradient-goal-hover` | `linear-gradient(140deg, #E07A7A 0%, #B57FB0 55%, #8A86CF 100%)` | Goals card hover |
| `--gradient-timeline` | `#E40F14 → #7A2A9C → #5AA2FF` (userSpaceOnUse) | Vision timeline SVG stroke |

**Eyebrow implementation** — recurring pattern, build once in `components/ui/eyebrow.tsx`:

```css
background: var(--gradient-eyebrow);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```
Include a `@supports not (background-clip: text)` fallback to `--color-brand-red-deep`.

### SDG palette

Official UN colours. Do **not** adjust for contrast — they are prescribed. Use white text at weight 700 over them (all pass AA at the card's 34px+ numeral size).

`#3 #4C9F38` · `#5 #FF3A21` · `#7 #FCC30B` · `#8 #A21942` · `#9 #FD6925` · `#10 #DD1367` · `#11 #FD9D24` · `#12 #BF8B2E` · `#13 #3F7E44` · `#15 #56C02B`

> Note: `#7 #FCC30B` (Affordable & Clean Energy) with white text is below 4.5:1. The prototype uses it as designed and the UN brand guidelines mandate it. Keep it, but ensure the card title is also exposed as accessible text and not conveyed by colour alone.

---

## 2. Typography

**Family:** DIN — supplied by the client as `DIN.ttf` (400) and `DIN Bold.otf` / `DIN Bold.ttf` (700).

Load with `next/font/local`, converted to **WOFF2** and subset to `latin`. Declare `display: 'swap'` and a `fallback` of `['system-ui', 'sans-serif']`. Two weights only — do not synthesise 500/600; where the prototype specifies `font-weight: 500` or `600`, round to 400 or 700 as noted below.

> Licensing: DIN is a commercial typeface. Only client-supplied files. Never fetch from a CDN. See `architecture.md` Open Decision #2.

### Type scale (values at 1920px; see `responsive-strategy.md` for the fluid ramp)

| Token | Desktop | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `--text-hero` | 58px | 400 | 1.08 | 0.2px | Hero H1 |
| `--text-h2` | 36px | 700 | 1.15 | — | Section headings |
| `--text-h3` | 22px | 700 | 1.30 | — | News card titles |
| `--text-stat` | 40px | 700 | 1.0 | — | Stats band figures |
| `--text-milestone` | 36px | 400 | 1.0 | — | Timeline year labels |
| `--text-sdg-num` | 56px | 700 | 1.0 | — | SDG card numeral |
| `--text-goal-title` | 26px | 700 | 1.2 | 1px | Mission/Vision/Ethos, uppercase |
| `--text-body` | 20px | 400 | 1.55 | — | Body copy |
| `--text-body-sm` | 17px | 400 | 1.5 | — | Footer links |
| `--text-label` | 16px | 400 | 1.35 | 1px | Stat labels, uppercase |
| `--text-nav` | 16px | 400 | 1.0 | 0.2px | Header navigation |
| `--text-eyebrow` | 16px | 700 | 1.0 | 2.5px | Section eyebrows, uppercase |
| `--text-cta` | 17px | 700 | 1.0 | 1px | Button labels, uppercase |
| `--text-badge` | 14px | 700 | 1.0 | 0.3px | Date badges |

Notes:

- The hero H1 is **regular weight at 58px**, not bold. This is deliberate and is the most-often-broken detail in the design.
- The prototype's About CTA specifies `font-family: 'Inter'` on one button. That is a prototype slip. **Everything is DIN.**
- Section headings are always sentence case as written in the copy, never CSS `text-transform` — except eyebrows, stat labels, goal titles and CTAs, which are uppercase.

---

## 3. Layout and spacing

### Page gutter

The prototype uses `8.13vw` = **156px at 1920**. Expressed as a token:

| Token | 360px | 768px | 1024px | 1440px | 1920px |
|---|---|---|---|---|---|
| `--gutter` | 20px | 40px | 64px | 104px | 156px |

Implement as a single `<Container>` primitive. **No section sets its own horizontal padding.** Full-bleed sections (hero, plant banner, pixel strip, SDG marquee) opt out by not using `<Container>`, and place a `<Container>` around their inner text instead.

Max content width: none — the design is fluid to the viewport. But cap body-copy measure at `--measure: 68ch` so text does not run to 1600px on ultrawide.

### Vertical rhythm

Prototype section padding is `5vw 8.13vw 5.5vw` ≈ 96px top / 105px bottom at 1920.

| Token | Mobile | Desktop | Use |
|---|---|---|---|
| `--space-section-y` | 48px | 96px | Standard section top/bottom |
| `--space-section-y-tight` | 40px | 65px | "Our Presence", "Solutions" |
| `--space-block` *(built as `--spacing-flow`)* | 24px | 50px | Heading → content gap |
| `--space-stack` | 12px | 24px | Within a text block |

### Grid

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Stats band | 1 col | 2 col | 4 col |
| Business tiles | 1 col | 2 col | 2 col |
| Goals triad | 1 col | 1 col | 3 col |
| News grid | 1 col | 2 col | 3 col |
| Footer links | 1 col (accordion) | 2 col | 4 col |

Gutters: `--gap-grid` 16px mobile → 31px desktop (prototype `1.6vw`).

### Radius and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 14px | News cards |
| `--radius-sdg` | 16px | SDG cards |
| `--radius-pill` | 999px | Carousel dots, social buttons |
| `--radius-none` | 0 | Goals cards, CTA buttons — square by design |
| `--shadow-tile` | `0 12px 22px rgba(20,24,32,.10)` | Business tile resting (as `drop-shadow`, the tiles are SVG-backed) |
| `--shadow-tile-hover` | `0 26px 40px rgba(20,24,32,.16)` | Business tile hover |
| `--shadow-card-hover` | `0 22px 44px rgba(20,24,32,.14)` | News card hover |
| `--shadow-header` | `0 1px 24px rgba(20,24,32,.06)` | Fixed header |

---

## 4. Components — canonical specs

### Button / CTA ("Know More")

- Background `--gradient-cta`, square corners, white uppercase label at `--text-cta`.
- Padding `12px 33px` desktop (prototype `0.63vw 1.7vw`), `10px 24px` mobile.
- Hover: `filter: brightness(1.08)`, 180ms.
- Focus-visible: 2px offset outline in `--color-brand-blue`.
- Variants via `cva`: `primary` (gradient), `ghost` (text + underline on hover), `onDark`.
- Renders as `<Link>` when `href` is passed, `<button>` otherwise. Never a `<div>` with `onClick`.

### Header

- Fixed, `height: 84px` desktop / `64px` mobile, `z-index: 100`.
- Background `linear-gradient(180deg, rgba(255,255,255,.92), rgba(248,249,251,.80))` with `backdrop-filter: blur(18px) saturate(160%)`.
- Bottom hairline `1px solid rgba(20,24,32,.08)`, plus `--shadow-header`.
- Logo height 42px desktop / 32px mobile.
- Desktop nav gap 42px. Below `lg` the nav collapses — see `responsive-strategy.md`.
- Provide a `@supports not (backdrop-filter: blur())` fallback of solid `rgba(255,255,255,.96)`.

### Card

Two variants, both in `components/ui/card.tsx`:

- `news` — white, `1px solid --color-border`, `--radius-card`, image `aspect-ratio: 16/10` with `object-fit: cover`, hover lifts `-5px` with `--shadow-card-hover`.
- `tile` — SVG shape background (`assets/rtile-*.svg`) behind absolutely-positioned content, hover lifts `-8px`. The SVG is decorative (`alt=""`, `pointer-events: none`).

### Date badge

Currently a background SVG (`date-badge.svg`) with asymmetric padding `6px 26px 8px 16px`. **Rebuild as CSS** — an inline SVG background that must stretch under variable-length dates is fragile. Use a clipped-corner shape via `clip-path` with the gradient fill, or accept a plain angled pseudo-element. Visual parity to be confirmed in design review.

---

## 5. Motion

All prototype animations, with their required mobile/reduced-motion behaviour.

| Name | Spec | Where | `prefers-reduced-motion` |
|---|---|---|---|
| `saelKen` | `scale(1.04) → scale(1.12)`, 9s ease forwards | Hero image Ken Burns | **Disable** — hold at `scale(1)` |
| `fxWord` | `opacity 0→1`, `translateY(32px)→0`, `blur(9px)→0`, 700ms, stagger 55ms/word | Hero headline | **Disable** — render at rest |
| `fxLetter` | `scaleY(1)→0`, 1s `cubic-bezier(.7,0,.2,1)` | Letterbox reveal panels on load | **Disable** — panels absent |
| `fxFill` | `width 0→100%`, linear over the slide interval | Active carousel dot | **Disable** — dot shows static active state |
| `sdgMarquee` | `translateX(0 → -50%)`, 44s linear infinite | SDG strip | **Disable** — becomes a horizontally scrollable list |
| `dotPulse` | box-shadow pulse, 2.4s infinite | Timeline milestone dots | **Disable** |
| `sparkFlick` | opacity 0.85↔1, 900ms infinite | Timeline travelling spark | **Disable** |
| Hero parallax | `mousemove`-driven translate: image 10px, icon 24px, text -14px | Hero | **Disable**; also inert on touch (no pointer) |
| Timeline path draw | `stroke-dashoffset` driven by scroll over a 220vh track | Vision section | **Jump to complete state** |

Standards:

- Transitions default to `180ms` for micro-interactions, `280ms` for card hovers, `550ms` for scroll reveals.
- Easing: `cubic-bezier(.2,.8,.2,1)` for entrances, `ease-out` for parallax follow, `linear` for progress fills.
- Animate `transform` and `opacity` only. Never `width`/`height`/`top`/`left` (the `fxFill` dot is the one exception and it is 34px wide).
- **Every animation is inside a `@media (prefers-reduced-motion: no-preference)` block**, or gated by the `useReducedMotion()` hook. The default state is the still state — not the other way round.
- Hover-only affordances must have a non-hover equivalent. The SDG marquee pauses on hover; on touch it must be swipeable instead.

---

## 6. Imagery

- All raster images through `next/image`. `sizes` is mandatory on every fill image — an unset `sizes` ships a 1920px asset to a phone and is a build-review rejection.
- Decorative images: `alt=""` plus `aria-hidden`.
- Hero slides carry meaningful `alt` describing the scene, not the brand.
- Above-the-fold hero slide 1 gets `priority`. Nothing else does.
- Cut-out PNGs (`engineer.png`, `solar-plant.png`) keep transparency — do not convert to JPEG. See `asset-inventory.md`.

---

## 7. What the prototype gets wrong (do not replicate)

1. **`vw`-based sizing throughout.** `height: 46.44vw` on the stats band is 167px on a phone. Replaced by the fluid scale in `responsive-strategy.md`.
2. **A fixed 1920 design width.** Nothing may assume it.
3. **Inline styles and `style-hover` attributes.** Designer-tool syntax; not real CSS.
4. **Hardcoded content in the render function.** Everything becomes props.
5. **`font-family: 'Inter'` on the About CTA.** Slip — use DIN.
6. **Duplicated SDG array for the marquee loop.** Duplicate in the component's render, not in the data.
7. **`document.querySelector` for timeline setup.** Use refs.
8. **No mobile nav at all.** Must be designed and built — see `features/03-app-shell-header-footer.md`.

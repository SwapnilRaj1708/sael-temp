/**
 * `sizes` hints for `next/image`, in one place.
 *
 * Every fill image must carry one — an unset `sizes` ships a 1920px asset to a
 * phone, and that is a build-review rejection. docs/design-guidelines.md §6,
 * docs/responsive-strategy.md §6.
 *
 * They live here rather than at the call sites for a narrow reason: a `sizes`
 * value is a list of *media conditions*, and viewport units are the only way
 * to express one. Everywhere else under `src/`, a `vw` is banned outright and
 * `pnpm verify:guardrails` enforces it — a proportional unit is not a
 * responsive one (docs/responsive-strategy.md §1). This module is the single
 * exemption, which keeps that rule absolute in every file where it means
 * something, and confines the exception to eight lines that contain no layout.
 *
 * These describe the *rendered* width of the image, not the asset's size.
 */

/** Edge to edge at every breakpoint — the hero, banners, the pixel strip. */
export const SIZES_FULL_BLEED = '100vw';

/**
 * The hero's mark, set loose in the frame at its own per-slide coordinates.
 * HERO-SPEC.md §2 gives one size for all four slides and §3d applies it as the
 * mark's width, so the `sizes` hint is those same figures — kept in step with
 * `--spacing-hero-icon` and `--spacing-hero-icon-lg`, the second of which is
 * 30% smaller from `lg`, at the client's call (2026-08-27). `64rem` is the `lg`
 * breakpoint; the two must move together.
 *
 * This module is the one place outside `theme.css` allowed a bare `vw`: a
 * `sizes` attribute is a list of media conditions and a viewport unit is the
 * only way to write one. See the note in scripts/verify-guardrails.mjs.
 */
export const SIZES_HERO_SYMBOL = '(min-width: 64rem) 12.95vw, 18.5vw';

/**
 * The About SAEL photograph — the layer masked into the chamfered shape. Half
 * the content column at `lg` and above, close to full width below it, both
 * inside the page gutter. The shape is inset 2.5% a side inside that box,
 * which is inside the rounding these figures already carry.
 */
export const SIZES_ABOUT_MEDIA = '(min-width: 64rem) 44vw, 88vw';

/**
 * The About SAEL cut-out — the figure standing in front of the shape.
 *
 * `--about-cutout-w` is 37% of the shape, and the shape is 95% of the box the
 * hint above describes, so this is 0.37 x 0.95 of those figures: 15.5vw and
 * 31vw, rounded outward. The two must move together — change
 * `--about-cutout-w` and this is the other half of that change.
 */
export const SIZES_ABOUT_CUTOUT = '(min-width: 64rem) 16vw, 32vw';

/**
 * A card on the solutions rail. `--spacing-solution-card` is
 * `clamp(250px, 30vw, 440px)`; 30vw overtakes the 250px floor at about 833px
 * of viewport, which is where the first condition starts, and the 440px cap
 * binds from about 1467px. Rounded outward at both hinges — the cost of a hint
 * that is a little generous is a slightly larger file, and the cost of one
 * that is short is a visibly soft photograph.
 */
export const SIZES_SOLUTION_CARD = '(min-width: 90rem) 440px, (min-width: 52rem) 30vw, 250px';

/**
 * The "Our Endeavour" cut-out. Capped at `--endeavour-media-w` (25rem) beside
 * the copy above `lg`, and close to the full column below it.
 */
export const SIZES_ENDEAVOUR_FIGURE = '(min-width: 64rem) 26rem, 88vw';

/**
 * An "Our Goals" card's background: a third of the content column at `md` and
 * above, the full column below it.
 */
export const SIZES_GOAL_CARD = '(min-width: 48rem) 32vw, 92vw';

/**
 * A news card's thumbnail — `--spacing-news-card` wide, 238 → 330px.
 */
export const SIZES_NEWS_CARD = '(min-width: 64rem) 330px, 238px';

/**
 * An "Our Goals" mark — `--spacing-goal-icon` wide, 60 → 126px.
 */
export const SIZES_GOAL_ICON = '126px';

/**
 * The dotted India map. Half the content column at `lg` and above, capped by
 * `--spacing-map` at 608px; close to the full column below it.
 */
export const SIZES_MAP = '(min-width: 64rem) 38rem, 92vw';

/**
 * A business mark on a ledger row — `--spacing-ledger-icon` wide, 69 → 132px.
 */
export const SIZES_BUSINESS_ICON = '132px';

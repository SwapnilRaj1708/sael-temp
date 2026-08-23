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
 * The hero's mark, which in `SAEL Home v2` sits in the content column rather
 * than floating in the frame as a watermark. `--spacing-hero-icon` sets its
 * height, 74 → 176px, and the marks are close to square, so the largest it is
 * ever drawn is 176px. Kept in step with that token.
 */
export const SIZES_HERO_SYMBOL = '176px';

/**
 * The About SAEL composite. Half the content column at `lg` and above, close
 * to full width below it, both inside the page gutter. One image — the client
 * supplies the artwork assembled, so there is no separate figure layer to
 * hint at any more.
 */
export const SIZES_ABOUT_MEDIA = '(min-width: 64rem) 44vw, 88vw';

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

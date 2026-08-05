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
 * The hero's watermark symbol: 42% of the viewport below `lg`, and 18.5% of
 * it above, which is the prototype's `18.5vw`. Kept in step with
 * `--hero-symbol-mobile-width` and the per-slide `symbolSize`.
 */
export const SIZES_HERO_SYMBOL = '(min-width: 64rem) 19vw, 42vw';

/**
 * The About SAEL composite. Half the content column at `lg` and above, close
 * to full width below it, both inside the page gutter. One image — the client
 * supplies the artwork assembled, so there is no separate figure layer to
 * hint at any more.
 */
export const SIZES_ABOUT_MEDIA = '(min-width: 64rem) 44vw, 88vw';

/**
 * A card on the solutions rail: one on screen, the content width, so the
 * viewport less two gutters. That is 90% of the viewport on a phone and 84% at
 * 1920, and this rounds up rather than splitting the difference — the cost of
 * a hint that is a little generous is a slightly larger file, and the cost of
 * one that is short is a visibly soft photograph.
 */
export const SIZES_SOLUTION_CARD = '92vw';

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
 * A news card's thumbnail — `--spacing-news-card` wide, 224 → 296px.
 */
export const SIZES_NEWS_CARD = '(min-width: 64rem) 296px, 224px';

/**
 * A business card's mark. Small and fixed-height (`--spacing-icon-mark`,
 * 52 → 76px), so this is generous rather than precise — SVGs are served as-is
 * and never resampled, and the hint only matters if these are ever replaced
 * with raster artwork.
 */
export const SIZES_BUSINESS_ICON = '96px';

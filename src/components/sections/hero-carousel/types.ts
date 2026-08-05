import type { StaticImageData } from 'next/image';

/**
 * Where a slide's headline and watermark symbol sit within the hero frame,
 * **at `lg` and above only**. Below that the composition is abandoned
 * entirely — see the note on `HeroSlide.desktop`.
 *
 * Carried across from the prototype's `defaultHeroSlides()` as data, not as
 * CSS, so repositioning a slide is a content edit. docs/features/04 §1.
 *
 * Two conversions were applied to the prototype's values, and both are safe
 * because the hero is full-bleed — its box *is* the viewport width:
 *
 *  - `18.5vw` / `31vw` became `18.5%` / `31%`, percentages of the hero rather
 *    than of the viewport. Identical rendering, and a bare `vw` is banned
 *    outside the token layer. docs/responsive-strategy.md §1.
 *  - Nothing else. The percentages are the prototype's own.
 *
 * Note the asymmetry in what the coordinates mean, which the prototype's own
 * comment gets wrong: the symbol is centred on **both** axes, but the headline
 * is centred vertically and positioned by its **left edge** horizontally. That
 * is what its `translate(x, calc(-50% + y))` does, and it is why a headline
 * with `textX: '64%'` does not overflow the frame.
 */
export interface HeroSlidePlacement {
  /** Left edge of the headline block, as a percentage of the hero width. */
  textX: string;
  /** Vertical centre of the headline block. */
  textY: string;
  /** Width of the headline block. */
  textWidth: string;
  /** Horizontal centre of the watermark symbol. */
  symbolX: string;
  /** Vertical centre of the watermark symbol. */
  symbolY: string;
  /** Rendered width of the watermark symbol. */
  symbolSize: string;
}

export interface HeroSlide {
  /** Stable across renders — keys the word animation, so it must not be the
   *  array index. docs/content-model.md §2. */
  id: string;
  image: {
    /** Landscape master, used at `lg` and above. */
    desktop: StaticImageData | null;
    /**
     * Art-directed portrait crop, used below `lg`. **Not** the landscape image
     * re-cropped with `object-position` — scaling a 2.34:1 frame into 4:5
     * crops the subject out. docs/asset-inventory.md §4.
     */
    mobile: StaticImageData | null;
    /** Describes the scene, not the brand. docs/design-guidelines.md §6. */
    alt: string;
  };
  /** Decorative watermark. Always `alt=""`. */
  symbol: {
    image: StaticImageData | null;
    /** Name in docs/asset-inventory.md, for the pending-asset placeholder. */
    pending: string;
  };
  headline: string;
  /** Ignored below `lg`, where the headline is bottom-anchored and full width. */
  desktop: HeroSlidePlacement;
}

import type { StaticImageData } from 'next/image';

/**
 * Where a slide's mark and headline sit in the frame, from HERO-SPEC.md §2.
 *
 * **Percentages of the hero box, and they mark the element's centre** — every
 * positioned element is `translate(-50%, -50%)`-centred, with one exception
 * the spec is explicit about: the headline is centred *vertically only*, and
 * `textX` is its **left edge**.
 *
 * Numbers rather than strings, for two reasons. The component appends the `%`,
 * so a slide cannot supply a unit the CSS does not expect; and `textX` is read
 * as a number to pick the scrim's direction — §3c flips the gradient to
 * darken whichever side the headline sits on, so storing the angle beside the
 * position would be storing the same fact twice.
 */
export interface HeroPlacement {
  /** Centre of the mark. */
  iconX: number;
  iconY: number;
  /** The headline's **left edge**, and its vertical **centre**. */
  textX: number;
  textY: number;
  /**
   * Tailwind width utility for the headline column at `lg` — §2's `textW`,
   * which is `31vw` on three slides and `30vw` on the fourth.
   *
   * A class naming a token rather than the value itself: a bare `vw` anywhere
   * under `src/` outside `theme.css` fails `pnpm verify:guardrails`, and the
   * rule is right — see `--hero-text-w` and `--hero-text-w-narrow`.
   */
  textWidthClassName: string;
}

export interface HeroSlide {
  /** Stable across renders — keys the word animation, so it must not be the
   *  array index. docs/content-model.md §2. */
  id: string;
  image: {
    /**
     * The landscape master, used at `lg` and above.
     *
     * **Pre-cropped to 2.34:1, and the crop is in the file.** HERO-SPEC.md §0:
     * the designer build's four JPGs are cut to the frame, so the code shows
     * them with `object-fit: cover; object-position: center` and nothing else.
     * If a photograph looks off-centre the wrong file is loaded — do not
     * reach for `object-position` to correct it.
     */
    desktop: StaticImageData | null;
    /**
     * Art-directed portrait crop, used below `lg`. **Not** the landscape image
     * re-cropped with `object-position` — scaling a 2.34:1 frame into 4:5
     * crops the subject out. docs/asset-inventory.md §4.
     *
     * Outside HERO-SPEC.md, which specifies the 1920 desktop composition and
     * is silent below it. See the note in hero-carousel/index.tsx.
     */
    mobile: StaticImageData | null;
    /** Describes the scene, not the brand. docs/design-guidelines.md §6. */
    alt: string;
  };
  /**
   * The slide's mark, set loose in the frame at `placement.iconX/iconY`.
   *
   * Decorative at every size — the headline carries the meaning — so it is
   * always `alt=""`.
   */
  symbol: {
    image: StaticImageData | null;
    /** Name in docs/asset-inventory.md, for the pending-asset placeholder. */
    pending: string;
  };
  /** Verbatim from HERO-SPEC.md §2, typographic apostrophes included. */
  headline: string;
  placement: HeroPlacement;
}

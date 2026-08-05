import { PixelScatter } from './scatter';

/**
 * The pixel strip between the last section and the footer.
 * docs/features/04 §12.
 *
 * **Drawn, not a picture.** §12 specifies a full-bleed decorative *image*
 * capped at 48px, which describes the prototype's 569 KB PNG — a raster of a
 * pattern, at one width, that blurs on a wide display.
 * `docs/asset-inventory.md` §10 already records that the client's design has
 * this as live vector and calls it the better source. Generating it costs a
 * few hundred bytes, stays sharp at any width, and puts the six ramp colours
 * in the token layer where they can be changed.
 *
 * Two parts, split by what each needs:
 *
 *  - the **solid bar** at the base is a CSS gradient, so it renders from the
 *    HTML alone;
 *  - the **dissolve** above it is a canvas, because how many squares there are
 *    depends on the viewport's width. See {@link PixelScatter}.
 *
 * Wholly decorative — it carries no information the page does not already
 * state — so it is `aria-hidden` and is a `<div>` rather than a `<section>`,
 * which would put an empty landmark in the document outline.
 */
export function PixelStrip() {
  // Kept in step with --spacing-pixel-bar, in the CSS pixels the canvas draws
  // in. The token is authored in rem; this is that value at the 16px root the
  // application never changes.
  const BAR_HEIGHT = 18;

  return (
    <div
      aria-hidden="true"
      className="relative h-pixel-strip w-full overflow-hidden bg-surface"
    >
      <PixelScatter barHeight={BAR_HEIGHT} />
      <div className="absolute inset-x-0 bottom-0 h-pixel-bar bg-(image:--gradient-pixel-strip)" />
    </div>
  );
}

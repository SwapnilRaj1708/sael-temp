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
 * **The squares are the whole strip.** It used to sit on a solid gradient bar
 * — a CSS rectangle under the canvas, so that the band of colour rendered even
 * without script. The client asked for the bar and the space it took to go, so
 * the grid now runs to the strip's own base and the seven filled rows at the
 * bottom do the job the bar was doing. `--spacing-pixel-strip` lost the bar's
 * 18px with it, so nothing above the strip moved.
 *
 * **It sits on the paper ground with its dot grid**, like every section above
 * it — the client's 2026-08-26 call. It was bare `--surface` white, which is
 * both a different white from `--paper` and the only undotted band left on the
 * page, so the strip read as a separate thing bolted to the end rather than as
 * the page running out. The grid shows through the scatter because the canvas
 * paints squares and leaves the gaps transparent.
 *
 * Wholly decorative — it carries no information the page does not already
 * state — so it is `aria-hidden` and is a `<div>` rather than a `<section>`,
 * which would put an empty landmark in the document outline.
 */
export function PixelStrip() {
  return (
    <div aria-hidden="true" className="ground-dots-paper relative h-pixel-strip w-full overflow-hidden">
      <PixelScatter />
    </div>
  );
}

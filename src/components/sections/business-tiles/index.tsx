import Image, { type StaticImageData } from 'next/image';
import { ArrowGlyph } from '@/components/ui/arrow-glyph';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CountUp } from '@/components/ui/count-up';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { SIZES_BUSINESS_ICON } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';

/**
 * Above this many characters a capacity figure is set one step down the scale.
 *
 * "3625 MW + 5 GW" is the case the design itself makes an exception for. A
 * length test rather than a flag on the data because the figures come from the
 * repository — a plant commissioning could lengthen any of them, and the row
 * should not break when it does.
 */
const LONG_FIGURE_CHARS = 9;

export interface BusinessTile {
  id: string;
  icon: StaticImageData | null;
  /** Broken over two lines in the design; supplied pre-split. */
  title: [string, string];
  /** Rendered as a superscript after the title. Marks "upcoming". */
  titleMarker?: string;
  description: string;
  /** The capacity figure. `null` when the repository could not supply one. */
  value: string | null;
  /** Qualifier under the figure. */
  footnote: string | null;
  href: string;
  /** Accessible label for the row's action, e.g. "Know more about …". */
  ctaLabel: string;
  /**
   * Tailwind text-colour class for the capacity figure, keyed to this
   * business's mark. A class rather than a raw colour so it stays in the token
   * layer — /CLAUDE.md §2.
   */
  figureClassName: string;
  /**
   * Background-colour class for the rule that fills across the row on hover.
   * The same accent as the figure, so the row reads as one object.
   */
  ruleClassName: string;
  /**
   * Marks the row as not yet operational, which gives it its own ground — the
   * frosted grey the masthead takes over a white page, moved onto the black
   * one. Every other row sits on the section itself.
   */
  upcoming?: boolean;
}

export interface BusinessTilesProps {
  eyebrow?: string;
  tiles: BusinessTile[];
  snap?: boolean;
}

/**
 * "Business Portfolio" — the four businesses, each with its headline capacity.
 * docs/features/04 §4, rebuilt to `SAEL Home v2`.
 *
 * **A ledger, not a grid of cards.** The earlier build set four centred tiles
 * on a light ground with the figure tucked in beside the business name. v2
 * sets the same four as rows on the black ground: a hairline across the top,
 * the business named small and quiet above a capacity figure that is the
 * largest thing on the page after the hero headline, its mark at the row's
 * right edge, and the copy running underneath. The figure is why the row
 * exists, and the row is now laid out to say so.
 *
 * The figures still come from the repository, not from this file and not from
 * the page's static content — they change as plants commission and the
 * business owns them. docs/content-model.md §1. A failed fetch leaves `value`
 * null and the row renders without its figure rather than the section
 * disappearing.
 *
 * **The whole row is the link, and there is exactly one link in it.** The
 * design draws a "Know More" action; making the row a link *and* keeping the
 * action would nest two interactive elements. Instead the action's hit area is
 * stretched over the row with a pseudo-element, so a pointer gets the whole
 * row, a keyboard gets one stop, and a screen reader hears one link.
 *
 * A Server Component apart from the figures' count-up.
 */
export function BusinessTiles({ eyebrow, tiles, snap = false }: BusinessTilesProps) {
  return (
    <Section
      data-snap-section
      background="black-dots"
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div className="flex w-full flex-col gap-stack">
        {eyebrow !== undefined && (
          <Reveal order={0}>
            <Eyebrow tone="bright">{eyebrow}</Eyebrow>
          </Reveal>
        )}

        {/* A column gap and no row gap. The rows are separated by their own top
            hairline, which is what makes four of them read as one ledger
            rather than as four detached blocks. */}
        <div className="grid gap-x-ledger-col-gap md:grid-cols-2">
          {tiles.map((tile, index) => {
            const isLongFigure = (tile.value?.length ?? 0) > LONG_FIGURE_CHARS;

            return (
              <Reveal
                key={tile.id}
                // 2, 3, 4, 5 — the eyebrow is 0 and 1 is deliberately unused,
                // so the label lands, a beat passes, then the rows follow in
                // reading order.
                order={index + 2}
                className="flex"
              >
                <Card
                  as="article"
                  ground="dark"
                  inset="block"
                  // Each row's own accent colour. The hairline it fills across,
                  // and the timing, come from the primitive.
                  accentClassName={tile.ruleClassName}
                  className={cn(
                    // A row, not a stack: the copy is one column and the mark
                    // is the other. The mark used to be absolutely positioned
                    // over the row with a right padding reserving space for
                    // it, which is what kept clipping it — an out-of-flow box
                    // whose only child is itself out of flow has no content to
                    // size against, so its height came from `aspect-ratio`
                    // alone and any disagreement about that showed up as a
                    // trimmed mark. In flow it is laid out like anything else
                    // and there is nothing left to get wrong.
                    'gap-x-flow',
                    // The one row that is not yet operational carries its own
                    // ground. Inline padding comes with it: without it the
                    // copy would start hard against the panel's edge, where
                    // every other row starts against nothing.
                    tile.upcoming === true && 'bg-tile-upcoming px-inset',
                  )}
                >
                  {/* `min-w-0` so a long capacity figure shrinks the column
                      rather than pushing the mark off the row — a flex item's
                      floor is its content's min-content width until you say
                      otherwise. */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-meta text-on-dark-faint uppercase">
                      {tile.title[0]}
                      <br />
                      {tile.title[1]}
                      {tile.titleMarker !== undefined && (
                        <sup className="text-tile-marker">{tile.titleMarker}</sup>
                      )}
                    </h3>

                    {/* Counts up from zero when the section is reached. The figure
                      is the reason this row exists, so it is the one thing on
                      it that moves — and its colour is keyed to the mark beside
                      it rather than all four sharing brand red. */}
                    {tile.value !== null && (
                      <p
                        className={cn(
                          'mt-4 tabular-nums',
                          isLongFigure ? 'text-ledger-figure-long' : 'text-ledger-figure',
                          tile.figureClassName,
                        )}
                      >
                        <CountUp value={tile.value} />
                      </p>
                    )}

                    {tile.footnote !== null && (
                      <p className="mt-3 text-meta text-on-dark-muted uppercase">{tile.footnote}</p>
                    )}

                    {/* `--ledger-measure`, not `--measure`. The mark takes
                      real space beside this column now, so the copy can no
                      longer run under it — but 68ch still lets a line run far
                      wider than the design sets it. 46ch is the design's own
                      cap. */}
                    <p className="mt-4 max-w-(--ledger-measure) text-body-sm [text-wrap:pretty] text-on-dark-soft">
                      {tile.description}
                    </p>

                    {/* `mt-auto` keeps the actions on one line across rows whose
                      copy runs to different lengths. */}
                    <Button
                      href={tile.href}
                      variant="onDark"
                      size="micro"
                      className={cn(
                        // `onDark` brings the focus ring this needs on the black
                        // ground; its outline and hover fill belong to a boxed
                        // button and are removed, because here the action is a
                        // bare label with an arrow.
                        'border-0 pt-card-flow hover:bg-transparent',
                        "after:absolute after:inset-0 after:content-['']",
                      )}
                    >
                      <span className="sr-only">{tile.ctaLabel}</span>
                      <span aria-hidden="true" className="inline-flex items-center gap-tight">
                        Know More
                        <ArrowGlyph />
                      </span>
                    </Button>
                  </div>

                  {/*
                    The client's clean marks — no baked-in lettering, so
                    nothing is cropped and the row's own heading is the only
                    place the business is named.

                    A plain <Image>, not <MediaFrame>. The frame primitive
                    exists for a photograph filling a box its parent sized, and
                    using it for a mark meant undoing it three times over: an
                    aspect ratio computed from the import to stop the box
                    disagreeing with the artwork, `object-contain` to cancel
                    its `object-cover`, and `overflow-visible` to cancel its
                    clip. Three corrections to arrive back at what an <img>
                    does unaided. A static import already carries the artwork's
                    intrinsic width and height, so a width and `h-auto` draw
                    each mark at its own proportions — nothing to letterbox and
                    nothing to crop, which is the whole requirement.

                    The four run 0.838 to 1.002, so their rendered heights
                    differ. That is the artwork, not a defect: they are pinned
                    to a common width and centred on the row. (These files were
                    re-cut on 2026-08-26 from the hero masters after the first
                    set turned out to be sliced through at the bottom edge —
                    the crop the client reported was baked into the PNGs, not
                    applied by anything here.)

                    `pointer-events-none` so the mark never intercepts the link
                    stretched over the row.
                  */}
                  {tile.icon !== null && (
                    <Image
                      src={tile.icon}
                      alt=""
                      sizes={SIZES_BUSINESS_ICON}
                      className="pointer-events-none h-auto w-ledger-icon shrink-0 self-center"
                    />
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

import type { StaticImageData } from 'next/image';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/ui/count-up';
import { FlankedEyebrow } from '@/components/ui/flanked-eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { SIZES_BUSINESS_ICON } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';

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
  /** Accessible label for the card's action, e.g. "Know more about …". */
  ctaLabel: string;
  /**
   * Tailwind text-colour class for the capacity figure, keyed to this
   * business's mark. A class rather than a raw colour so it stays in the
   * token layer — /CLAUDE.md §2.
   */
  figureClassName: string;
}

export interface BusinessTilesProps {
  eyebrow?: string;
  tiles: BusinessTile[];
  snap?: boolean;
}

/**
 * "Business Portfolio" — the four businesses, each with its headline capacity.
 * docs/features/04 §4.
 *
 * **Built to `SAEL - New Website.pdf`,** which merges two things the project
 * docs keep apart: features/04 specifies a separate four-column stats band
 * (§2) *and* a four-tile business grid (§4), while the client's design carries
 * the capacity figures on the tiles themselves and has no stats band at all.
 * `docs/asset-inventory.md` §10 records this as difference #1 between the two
 * sources. Following the PDF, as instructed, this section is both.
 *
 * The figures come from the repository, not from this file and not from the
 * page's static content — they change as plants commission and the business
 * owns them. docs/content-model.md §1. A failed fetch leaves `value` null and
 * the card renders without its figure rather than the section disappearing.
 *
 * **The whole card is the link, and there is exactly one link in it.** The
 * design draws a "Know More" button; making the card a link *and* keeping the
 * button would nest two interactive elements. Instead the button's hit area is
 * stretched over the card with a pseudo-element, so a pointer gets the whole
 * card, a keyboard gets one stop, and a screen reader hears one link.
 * docs/features/04 §4.
 */
export function BusinessTiles({ eyebrow, tiles, snap = false }: BusinessTilesProps) {
  return (
    <Section
      data-snap-section
      background="alt"
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div className="flex w-full flex-col items-center gap-stack">
        {eyebrow !== undefined && (
          <Reveal order={0}>
            <FlankedEyebrow>{eyebrow}</FlankedEyebrow>
          </Reveal>
        )}

        <div className="grid w-full max-w-(--business-max-w) gap-gap-grid md:grid-cols-2">
          {tiles.map((tile, index) => (
            <Reveal
              key={tile.id}
              // 2, 3, 4, 5 — the eyebrow is 0 and 1 is deliberately unused, so
              // the label lands, a beat passes, then the cards follow in
              // reading order.
              order={index + 2}
              className="flex"
            >
              <article
                // Tight on purpose. `gap-flow` (24 → 50) and `p-10` made a card
                // ~400px tall, and four of those plus the eyebrow do not fit one
                // screenful — which is the whole point of a snapping section.
                className="relative flex w-full flex-col items-center gap-3 bg-tile-surface p-4 text-center lg:gap-4 lg:p-5"
              >
                <div className="flex items-center justify-center gap-4">
                  {/*
                  The client's clean marks — no baked-in lettering, so nothing
                  is cropped and the card's own heading is the only place the
                  business is named. This was the outstanding handover item in
                  docs/asset-inventory.md §9 that blocked these tiles.

                  The four are not a uniform shape (0.918 to 1.040), so the box
                  takes each image's own ratio rather than forcing one on all
                  of them — a fixed aspect would squash the agri-waste mark.
                  The ratio comes from the import, which is data, hence the
                  inline style. /CLAUDE.md §5.
                */}
                  <MediaFrame
                    image={tile.icon}
                    alt=""
                    sizes={SIZES_BUSINESS_ICON}
                    pending={`business/${tile.id}`}
                    className="mr-6 h-icon-mark shrink-0 scale-210 bg-transparent"
                    style={{
                      aspectRatio:
                        tile.icon === null
                          ? 'var(--aspect-icon-mark)'
                          : `${String(tile.icon.width)} / ${String(tile.icon.height)}`,
                    }}
                    imageClassName="object-contain"
                  />

                  <div className="text-left">
                    <h3 className="text-tile-title text-ink uppercase">
                      {tile.title[0]}
                      <br />
                      {tile.title[1]}
                      {tile.titleMarker !== undefined && (
                        <sup className="text-tile-marker">{tile.titleMarker}</sup>
                      )}
                    </h3>

                    {/* Counts up from zero when the section is reached. The
                      figure is the reason this card exists, so it is the one
                      thing on it that moves — and its colour is keyed to the
                      mark beside it rather than all four sharing brand red. */}
                    {tile.value !== null && (
                      <p className={cn('mt-1 text-tile-figure', tile.figureClassName)}>
                        <CountUp value={tile.value} />
                      </p>
                    )}
                    {tile.footnote !== null && (
                      <p className="mt-1 text-tile-note text-body-soft">{tile.footnote}</p>
                    )}
                  </div>
                </div>

                <p className="max-w-(--measure) text-body-sm [text-wrap:pretty] text-body-soft">
                  {tile.description}
                </p>

                {/* `mt-auto` keeps the buttons on one line across a row of cards
                  with copy of different lengths. */}
                <Button
                  href={tile.href}
                  size="sm"
                  variant="outline"
                  className="mt-auto after:absolute after:inset-0 after:content-['']"
                >
                  <span className="sr-only">{tile.ctaLabel}</span>
                  <span aria-hidden="true">Know More</span>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

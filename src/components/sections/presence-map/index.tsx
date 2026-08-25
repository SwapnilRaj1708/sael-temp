import type { CSSProperties } from 'react';
import type { StaticImageData } from 'next/image';
import { CountUp } from '@/components/ui/count-up';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_MAP } from '@/lib/utils/image-sizes';
import { MAP_VIEWBOX } from './dots';

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface PresenceSite {
  id: string;
  /** "Jalore (Rajasthan)" */
  name: string;
  /** "298 MW" */
  description: string;
  /** Point in the map artwork's own viewBox — see `MAP_VIEWBOX`. */
  x: number;
  y: number;
  /** Renders the design's "Visit Location" link when supplied. */
  href?: string;
}

export interface PresenceMapProps {
  /** The section's display heading, right of the map. */
  heading: string;
  /** Broken over two lines in the design; supplied pre-split. */
  title: [string, string];
  /** "11 States" */
  primaryStat: string;
  /** "60 Projects Sites" */
  secondaryStat: string;
  /** The dotted India artwork. `null` until it is supplied. */
  map: { image: StaticImageData | null };
  sites: PresenceSite[];
  snap?: boolean;
}

/**
 * "Our Current Power Portfolio" — the dotted India map and its project sites.
 * docs/features/04 §5, rebuilt to `SAEL Home v2`.
 *
 * **Map left, copy right.** The previous build centred the map and hung the
 * footprint label and its two figures over the artwork at percentage offsets,
 * which was always an interim — the tracker recorded the right-hand column as
 * commented out pending a layout review. v2 settles it: two columns, the map
 * in one and heading, label and figures in the other, and nothing positioned
 * over the artwork any more.
 *
 * v2 sets those columns at 1–6 and 8–12, leaving a whole empty column between
 * them, and the two figures a `clamp(24px, 4vw, 64px)` apart. Both were pulled
 * in at the client's request — the figures on 2026-08-21, the columns again on
 * 2026-08-22.
 *
 * **A centred row, not a grid**, and that is what finally closed the gap. On a
 * twelve-column grid both halves are capped — the map by `--spacing-map`, the
 * copy by its own measure — so each floats in the middle of a column that is
 * wider than it, and the slack lands between them. Sizing the two blocks and
 * centring the row puts exactly one `--spacing-flow` between them at every
 * width. The rule above the footprint label is capped harder still, for the
 * same reason it exists: it is a break between two blocks, not a border on the
 * section.
 *
 * **The artwork is a supplied file now, not geometry.** See the note in
 * dots.ts: the client sent `dotted-map.svg` on 2026-08-21, so the 751-subpath
 * `<path>` and the gradient this component used to declare are both gone. The
 * six site coordinates are mapped across from the old space and want an eye —
 * also in that note.
 *
 * ---------------------------------------------------------------------------
 * Two things survive from the earlier build unchanged, because both were
 * right:
 *
 * 1. **No JavaScript at all.** Hover and focus are things CSS already knows,
 *    so the tooltips are `group-hover` / `group-focus-within` and this whole
 *    section is a Server Component apart from the figures' count-up. It also
 *    means the map works before hydration.
 *
 * 2. **Each pin is a real `<button>`** whose accessible name carries
 *    everything the tooltip shows, so a keyboard user hears "Jalore
 *    (Rajasthan), 298 MW" on focus and sees the same tooltip a pointer would.
 *    The tooltip itself is `aria-hidden` — it is the visual echo of the
 *    button's name, and announcing both would say it twice. Focus, not just
 *    hover, is what reveals it, which is also what makes the map work on
 *    touch.
 */
export function PresenceMap({
  heading,
  title,
  primaryStat,
  secondaryStat,
  map,
  sites,
  snap = false,
}: PresenceMapProps) {
  return (
    <Section
      data-snap-section
      background="black-dots"
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className={cn(
          'flex w-full flex-col items-center gap-flow',
          'lg:flex-row lg:items-center lg:justify-center',
        )}
      >
        <Reveal
          order={0}
          role="group"
          aria-label="Map of SAEL project sites across India"
          className="relative aspect-map-india w-full max-w-map shrink-0"
        >
          <MediaFrame
            image={map.image}
            alt=""
            sizes={SIZES_MAP}
            pending="map/dotted-map"
            className="absolute inset-0 bg-transparent"
            // The landmass has to sit inside its box whole — a `cover` crop
            // would take the coasts off, and every pin below is positioned
            // against the artwork's own coordinates.
            imageClassName="object-contain"
          />

          {sites.map((site, index) => {
            // The tooltip grows away from whichever edge the pin is nearest,
            // so it can never be clipped by the map's box. Decided here rather
            // than measured at runtime, because the coordinates are static.
            const towardsLeft = site.x > MAP_VIEWBOX.width * 0.55;
            const towardsBottom = site.y < MAP_VIEWBOX.height * 0.3;

            return (
              <div
                key={site.id}
                className="group absolute size-0"
                style={
                  {
                    left: `${String((site.x / MAP_VIEWBOX.width) * 100)}%`,
                    top: `${String((site.y / MAP_VIEWBOX.height) * 100)}%`,
                    '--anim-index': index,
                  } as StyleWithVars
                }
              >
                <button
                  type="button"
                  className="absolute size-touch -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <span className="sr-only">
                    {site.name}, {site.description}
                  </span>
                  {/* The pin. A hard square, plus a halo that pulses out of it. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1/2 left-1/2 size-map-pin -translate-x-1/2 -translate-y-1/2',
                      'rounded-xs bg-white',
                      'transition-transform duration-(--duration-micro)',
                      'group-focus-within:scale-175 group-hover:scale-175',
                      'motion-reduce:transition-none',
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="anim-map-ping absolute top-1/2 left-1/2 size-map-pin -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  />
                </button>

                <div
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute z-10 w-max bg-paper-alt px-3.5 py-2.5 shadow-tooltip',
                    // Grows out of the pin as well as fading in, so the
                    // callout reads as opening from the site rather than
                    // appearing over it.
                    'scale-90 opacity-0 transition duration-(--duration-micro)',
                    'group-focus-within:scale-105 group-hover:scale-105',
                    'motion-reduce:scale-100 motion-reduce:transition-none',
                    'group-focus-within:opacity-100 group-hover:opacity-100',
                    towardsLeft ? 'right-0 mr-4 origin-right' : 'left-0 ml-4 origin-left',
                    towardsBottom ? 'top-0 mt-2' : 'bottom-0 mb-2',
                  )}
                >
                  <p className="text-body-sm font-bold text-ink">{site.name}</p>
                  <p className="mt-1 text-meta text-meta-paper uppercase">{site.description}</p>
                  {site.href !== undefined && (
                    <p className="mt-1 flex items-center gap-1.5 text-tile-note text-body-soft">
                      <span className="size-1 rounded-full bg-body-soft" />
                      Visit Location
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </Reveal>

        <div className="w-full max-w-(--map-copy-w)">
          <Reveal order={2}>
            <h2
              className={cn(
                'max-w-(--hero-measure)',
                'bg-(image:--gradient-heading-bright) gradient-text',
                'text-display',
              )}
            >
              {heading}
            </h2>
          </Reveal>

          {/* The footprint label, demoted to a caption over the figures — in
              the PDF it was the heading, and v2 gives that job to the display
              line above. The rule is what separates the two, and it is a drawn
              element rather than a `border-t` because it is deliberately
              shorter than the block it sits over.

              It draws itself in on the same `anim-underline` the section
              labels take — this is the one section whose header rule is not an
              `<Eyebrow>`, and the client's 2026-08-25 note asks for the
              movement on all of them. Nothing else is needed: the class reads
              the `data-reveal` on the `<Reveal>` it is already inside. */}
          <Reveal order={3} className="mt-flow">
            <span
              aria-hidden="true"
              className="anim-underline block h-px w-(--map-rule-w) bg-hairline-grid"
            />
            <h3 className="mt-stack text-meta text-on-dark-faint uppercase">
              {title[0]}
              <br />
              {title[1]}
            </h3>
          </Reveal>

          {/* Tighter than the design's gap, at the client's request: the two
              read as a pair rather than as two unrelated figures. */}
          <Reveal order={4} className="mt-stack flex flex-wrap gap-stack">
            <p className="text-stat-large tabular-nums text-white">
              <CountUp value={primaryStat} />
            </p>
            <p className="text-stat-large tabular-nums text-white">
              <CountUp value={secondaryStat} />
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

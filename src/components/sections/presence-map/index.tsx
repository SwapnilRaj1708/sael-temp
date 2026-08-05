import type { CSSProperties } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { DOT_PATH, MAP_VIEWBOX } from './dots';

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * SVG paint references are document-wide, so this id has to be unique on the
 * page. The section appears once — it is the homepage's map — and a constant
 * keeps the component a Server Component, which `useId` would not. If a second
 * instance is ever needed, take the id as a prop.
 */
const DOT_GRADIENT_ID = 'sael-map-dots';

export interface PresenceSite {
  id: string;
  /** "Jalore (Rajasthan)" */
  name: string;
  /** "298 MW" */
  description: string;
  /** Point in the map's 620 × 660 viewBox. */
  x: number;
  y: number;
  /** Renders the design's "Visit Location" link when supplied. */
  href?: string;
}

export interface PresenceMapProps {
  /**
   * The section's own heading, left of the map. **Not in the client's PDF** —
   * added to the site on 2026-08-05 at the client's request, so the map has a
   * heading of its own rather than borrowing the footprint label's.
   */
  heading: string;
  /** Broken over two lines in the design; supplied pre-split. */
  title: [string, string];
  /** "11 States" — set large. Uppercased by CSS. */
  primaryStat: string;
  /** "60 Projects Sites" */
  secondaryStat: string;
  sites: PresenceSite[];
  snap?: boolean;
}

/**
 * "SAEL Pan India Green Footprint" — the dotted India map and its project
 * sites. docs/features/04 §5.
 *
 * **This replaces the flat `india-map.png` that features/04 §5 and
 * asset-inventory.md §6 describe.** That file is an 860 × 721 raster with
 * state names baked in at a size that renders below 6px on a phone, and §6
 * offers "rebuild as vector" as Option B, deferred as Open Decision #6. The
 * client's design settles it: their map is the dotted pixel-art one, and the
 * geometry arrived with the handover. Option B, chosen by the client.
 *
 * ---------------------------------------------------------------------------
 * Three deliberate departures from the reference implementation:
 *
 * 1. **SVG, not `<canvas>`.** The reference paints the dots into a canvas,
 *    which is why its map cannot be styled by CSS, blurs when scaled and is
 *    invisible to assistive technology. One `<path>` of 751 zero-length
 *    segments draws the same dots, scales with the viewBox and costs one node.
 *
 * 2. **No JavaScript at all.** The reference tracks a hovered index in
 *    component state. Hover and focus are things CSS already knows, so the
 *    tooltips are `group-hover` / `group-focus-within` and this whole section
 *    is a Server Component. It also means the map works before hydration.
 *
 * 3. **Big.** The reference caps the map at 430px. Here it fills its column
 *    and is bounded by `--spacing-map-max`, which is derived from the height
 *    actually left on screen — so it is as large as a viewport-height snapping
 *    section can allow, at every size.
 *
 * ---------------------------------------------------------------------------
 * Accessibility. Each pin is a real `<button>` whose accessible name carries
 * everything the tooltip shows, so a keyboard user hears "Jalore (Rajasthan),
 * 298 MW" on focus and sees the same tooltip a pointer would. The tooltip
 * itself is `aria-hidden` — it is the visual echo of the button's name, and
 * announcing both would say it twice. Focus, not just hover, is what reveals
 * it, which is also what makes the map work on touch.
 */
export function PresenceMap({
  title,
  primaryStat,
  secondaryStat,
  heading,
  sites,
  snap = false,
}: PresenceMapProps) {
  // `title`, `primaryStat` and `secondaryStat` are still on the interface and
  // still passed by the page, but the block that rendered them is commented
  // out below pending a layout review. Destructuring them here would fail
  // `noUnusedLocals`; putting them back is one line alongside uncommenting.
  return (
    <Section
      data-snap-section
      background="dark"
      className={cn('flex items-center bg-surface-map', snap && 'min-h-viewport snap-start')}
    >
      <div className="flex w-full flex-col items-center gap-4">
        {/* The section heading, centred over everything, like every other
            section's. `lg:whitespace-nowrap` holds it to one line on a wide
            screen — `text-wrap: balance` is on every heading in globals.css
            and would otherwise split a short title across two — while a
            narrow screen is free to wrap it. */}
        <Reveal order={0}>
          <h2 className="text-center text-h2 font-normal text-white lg:whitespace-nowrap">
            {heading}
          </h2>
        </Reveal>

        {/*
          The map, and the figures beside it. The empty column on the left is
          load-bearing: it and the text column are both `flex-1`, which is what
          keeps the map itself on the section's centre line even though the
          only content beside it sits to the right.
        */}
        <div
          className={cn(
            'flex w-full flex-col items-center gap-flow',
            'lg:flex-row lg:items-center lg:justify-center',
          )}
        >
          {/* <div aria-hidden="true" className="hidden lg:block lg:flex-1" /> */}

          <Reveal
            order={2}
            role="group"
            aria-label="Map of SAEL project sites across India"
            className="relative aspect-map-india w-full max-w-map shrink-0"
          >
            <svg
              viewBox={`0 0 ${String(MAP_VIEWBOX.width)} ${String(MAP_VIEWBOX.height)}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                {/*
                The ramp runs west to east across the landmass rather than
                colouring every dot the same. The reference computes it per dot
                in JavaScript and paints to a canvas; as a gradient on the
                stroke it is one declaration, resolution-independent, and
                costs nothing at runtime.
              */}
                <linearGradient id={DOT_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--color-map-dot-1)" />
                  <stop offset="0.5" stopColor="var(--color-map-dot-2)" />
                  <stop offset="0.72" stopColor="var(--color-map-dot-3)" />
                  <stop offset="0.88" stopColor="var(--color-map-dot-4)" />
                  <stop offset="1" stopColor="var(--color-map-dot-5)" />
                </linearGradient>
              </defs>
              <path d={DOT_PATH} fill={`url(#${DOT_GRADIENT_ID})`} />
            </svg>

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
                      'pointer-events-none absolute z-10 w-max rounded-xs bg-inert px-3 py-2 shadow-tooltip',
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
                    <p className="text-body-sm text-ink">{site.description}</p>
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
            <Reveal order={3} className="absolute top-[10%] right-[-12%]">
              <h3 className="bg-(image:--gradient-footprint) gradient-text text-center text-footprint-title uppercase">
                {title[0]}
                <br />
                {title[1]}
              </h3>
            </Reveal>
            <Reveal order={4} className="absolute right-[-10%] bottom-[25%]">
              <p className="text-stat text-white uppercase">{primaryStat}</p>
              <p className="mt-1 text-h3 text-white uppercase">{secondaryStat}</p>
            </Reveal>
          </Reveal>

          {/* The footprint label above its figures, as the PDF has them, and
              `items-start` so the block hugs the map's right edge instead of
              drifting out to the section's. Centred within itself. */}
          {/* <div className="flex flex-col items-center gap-stack text-center lg:flex-1 lg:items-start">
            <Reveal order={3}>
              <h3 className="bg-(image:--gradient-footprint) gradient-text text-footprint-title uppercase">
                {title[0]}
                <br />
                {title[1]}
              </h3>
            </Reveal>
            <Reveal order={4}>
              <p className="text-stat text-white uppercase">{primaryStat}</p>
              <p className="text-h3 mt-1 text-white uppercase">{secondaryStat}</p>
            </Reveal>
          </div> */}
        </div>
      </div>
    </Section>
  );
}

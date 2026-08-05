import type { CSSProperties } from 'react';
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
  sites,
  snap = false,
}: PresenceMapProps) {
  return (
    <Section
      data-snap-section
      background="dark"
      className={cn('flex items-center bg-surface-map', snap && 'min-h-viewport snap-start')}
    >
      {/*
        A centred pair, not a two-column grid. The grid gave each side half the
        page and right-aligned the text inside its half, which pushed the two
        apart by however wide the viewport happened to be. In the design they
        sit next to each other and the composition as a whole is centred, so
        that is what this is: a row, centred, with the text stretched to the
        map's height.
      */}
      <div className="flex w-full flex-col items-center gap-flow lg:flex-row lg:items-stretch lg:justify-center">
        <div
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
                    className="absolute top-1/2 left-1/2 size-map-pin -translate-x-1/2 -translate-y-1/2 rounded-xs bg-white"
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
                    'opacity-0 transition-opacity duration-(--duration-micro)',
                    'group-focus-within:opacity-100 group-hover:opacity-100',
                    towardsLeft ? 'right-0 mr-4' : 'left-0 ml-4',
                    towardsBottom ? 'top-0 mt-2' : 'bottom-0 mb-2',
                  )}
                >
                  <p className="text-tile-note font-bold text-ink">{site.name}</p>
                  <p className="text-tile-note text-ink">{site.description}</p>
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
        </div>

        {/*
          Heading near the top of the map, counts near the bottom — the design
          spreads them over the map's height rather than stacking them in the
          middle. `justify-between` against a stretched column does that on its
          own, at whatever height the map resolves to.
        */}
        <div className="flex flex-col justify-between gap-flow lg:py-flow">
          <h2 className="w-fit bg-(image:--gradient-footprint) gradient-text text-footprint-title uppercase">
            {title[0]}
            <br />
            {title[1]}
          </h2>

          <div>
            <p className="text-stat text-white uppercase">{primaryStat}</p>
            <p className="mt-1 text-h3 text-white uppercase">{secondaryStat}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

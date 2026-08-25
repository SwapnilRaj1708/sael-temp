import type { StaticImageData } from 'next/image';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_ENDEAVOUR_FIGURE } from '@/lib/utils/image-sizes';

export interface EndeavourSplitProps {
  eyebrow: string;
  /** One entry per paragraph, in order. */
  body: string[];
  /** The composite artwork: panel, gradient and cut-out, already assembled. */
  media: { image: StaticImageData | null; alt: string };
  snap?: boolean;
}

/**
 * "Our Endeavour" — running copy beside the composite artwork.
 *
 * The mirror of `<IntroSplit>`: there the artwork is on the left and the copy
 * on the right, here it is the other way round. Deliberately a sibling
 * component rather than a `reverse` prop on that one, because the two differ
 * in more than their handedness — this section has **no heading at all** (the
 * design's "OUR ENDEAVOUR" is the eyebrow) and its copy is three paragraphs
 * rather than one.
 *
 * **The artwork is one supplied image, not a composite built here.** An
 * earlier version assembled it: `5.svg`'s silhouette as a CSS mask, filled
 * with a token gradient, with the cut-out scaled and positioned over it. The
 * client then supplied the whole thing pre-rendered, which is better in every
 * way — it carries the solar-grid line work that no arrangement of the
 * handover's parts could reproduce, and the proportions are the designer's
 * rather than three tokens someone has to keep in step. The same course the
 * About composite took once the graded crop arrived. If a later design needs
 * the bare panel, `5.svg` is still in this folder.
 *
 * A Server Component. Nothing here is interactive.
 */
export function EndeavourSplit({ eyebrow, body, media, snap = false }: EndeavourSplitProps) {
  return (
    <Section
      data-snap-section
      // The paper ground with its dot grid, like every section on this page but
      // the hero. It was the bare white default, which left one undotted band
      // between two dotted ones — /CLAUDE.md aside, the grid is the page's
      // texture and a section without it reads as a gap in the page.
      background="paper-dots"
      // No heading, so the section carries its own accessible name rather than
      // being an unlabelled region. An <h2> here would be inventing a level
      // the design does not have.
      aria-label={eyebrow}
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-(--endeavour-max-w) flex-col items-center gap-flow',
          'lg:flex-row lg:items-center',
        )}
      >
        {/* Copy first in the DOM and first on screen — the one place the
            mirrored layout costs nothing, because it reads the same way
            stacked on a phone as it does side by side. */}
        <div className="lg:flex-1">
          {/* Same shape as About SAEL: the label is fixed, everything under it
              arrives. Orders continue 2, 3, 4 … so the paragraphs cascade. */}
          <Reveal order={0}>
            <Eyebrow tone="accent">{eyebrow}</Eyebrow>
          </Reveal>
          {body.map((paragraph, index) => (
            <Reveal key={paragraph} order={index + 2}>
              <p className="mt-stack text-body [text-wrap:pretty] text-body-muted">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal order={body.length + 2} className="w-full max-w-(--endeavour-media-w) shrink-0">
          <MediaFrame
            image={media.image}
            alt={media.alt}
            sizes={SIZES_ENDEAVOUR_FIGURE}
            pending="endeavour/girl"
            className="aspect-(--aspect-endeavour) w-full bg-transparent"
            // The artwork's chamfered panel has transparent corners around it, so
            // it must not be cropped to the box — `contain`, not `cover`.
            imageClassName="object-contain"
          />
        </Reveal>
      </div>
    </Section>
  );
}

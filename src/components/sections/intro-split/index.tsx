import type { StaticImageData } from 'next/image';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_ABOUT_MEDIA } from '@/lib/utils/image-sizes';

export interface IntroSplitProps {
  eyebrow?: string;
  title: string;
  body: string;
  /** Absent in the client's design for the homepage; kept for reuse. */
  cta?: { label: string; href: string };
  /** The composite artwork: shape, graded photograph and cut-out, assembled. */
  media: { image: StaticImageData | null; alt: string };
  /** Opt into the homepage's section snapping. */
  snap?: boolean;
}

/**
 * "About SAEL" — the label, a display heading and running copy, beside the
 * composite artwork. docs/features/04 §3, rebuilt to `SAEL Home v2`.
 *
 * **A grid now, not a stage.** The previous build placed four elements inside
 * a fixed 1280:528 box as percentages, because that is how
 * `SAEL - New Website.pdf` draws the section — the heading and the body are
 * not columns there, they are two differently-inset blocks beside the
 * artwork. v2 abandons that for a plain twelve-column grid: label, heading and
 * body stack in one column, the artwork sits in the other, and the whole
 * `--about-*` coordinate set went with the stage.
 *
 * **The pair is pulled in off the gutters.** v2 sets the copy at columns 1–6
 * and the artwork at 8–12, which leaves the two ends of the section heavy and
 * a whole empty column down the middle. At the client's request on 2026-08-21
 * they are drawn together and centred instead — copy on 2–6, artwork on 7–11,
 * one spare column outside each rather than one between them.
 *
 * The rule above the body is doing real work: it separates the display heading
 * from the running copy at a size where the two would otherwise read as one
 * block of text at two sizes.
 *
 * Below `lg` the grid collapses to ordinary flow — heading, artwork, body —
 * per docs/responsive-strategy.md §4.
 *
 * **The artwork is one supplied image, not a composite built here.** Earlier
 * versions assembled it in the browser: `14.svg`'s silhouette as a CSS mask, a
 * photograph clipped to it, a gradient tint over that, and the cut-out
 * positioned on top. Each step lost something — a browser can approximate the
 * duotone but never match it, because the ramp is applied per-tone by whoever
 * prepared the asset rather than as one linear sweep. The client now supplies
 * the finished composite, so all of that is gone. The same course
 * `<EndeavourSplit>` took.
 */
export function IntroSplit({ eyebrow, title, body, cta, media, snap = false }: IntroSplitProps) {
  return (
    <Section
      data-snap-section
      background="paper-dots"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className={cn(
          'grid w-full items-center gap-flow',
          'lg:grid-cols-12 lg:gap-x-gap-grid',
        )}
      >
        {/* Heading first in the DOM: it is the section's <h2>, and on a phone
            it should be read before the artwork it introduces. */}
        <div className="lg:col-start-2 lg:col-span-5">
          {/* The eyebrow does not animate. It is the section's label rather
              than its content — it wants to be there already, so that what
              moves reads as the section filling in beneath a fixed heading
              rather than the whole block arriving at once. */}
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone="deep">{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={2}>
            {/*
              The display size, with the ramp clipped to the letterforms — the
              arrangement v2 gives every one of its section headings. Regular
              weight, which is the difference between the section reading as
              editorial and reading as a product page.
            */}
            <h2
              className={cn(
                'mt-stack max-w-(--hero-measure)',
                'bg-(image:--gradient-eyebrow-deep) gradient-text',
                'text-display',
              )}
            >
              {title}
            </h2>
          </Reveal>

          <Reveal order={4} className="mt-flow border-t border-hairline-paper pt-flow">
            <p className="max-w-(--ledger-measure) text-body [text-wrap:pretty] text-body-soft">
              {body}
            </p>
            {cta !== undefined && (
              <Button href={cta.href} className="mt-flow">
                {cta.label}
              </Button>
            )}
          </Reveal>
        </div>

        {/* The artwork lands last: the heading introduces it, so it reads
            better arriving after the words that name it. */}
        <Reveal order={3} className="w-full lg:col-start-7 lg:col-span-5">
          <MediaFrame
            image={media.image}
            alt={media.alt}
            sizes={SIZES_ABOUT_MEDIA}
            pending="aboutSael/sardar-kid-cutout"
            className="mx-auto aspect-(--about-aspect) w-full max-w-(--about-media-max-w) bg-transparent"
            // The chamfered silhouette has transparent corners around it, so
            // the artwork must not be cropped to the box — `contain`, not
            // `cover`.
            imageClassName="object-contain"
          />
        </Reveal>
      </div>
    </Section>
  );
}

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
 * "About SAEL" — a chamfered image composite beside heading and running copy.
 * docs/features/04 §3.
 *
 * **Built to the client's own design**, `SAEL - New Website.pdf` and the
 * `SAEL Homepage v3` redesign, not to the Designer prototype.
 * `docs/asset-inventory.md` §10 recorded a decision to treat the prototype as
 * the source; the client has since asked for this section to follow the PDF,
 * which is a different composition. Documented reversal, not drift — and `cta`
 * stays on the interface so the prototype's arrangement is still expressible.
 *
 * ---------------------------------------------------------------------------
 * Above `lg` this is a **stage**, not a grid: one box at a fixed 1280:528 and
 * all three elements positioned inside it as percentages. That is how the
 * design is actually drawn, and approximating it with a two-column grid is
 * what made the first two attempts wrong — the heading and the body are not
 * columns, they are two differently-inset blocks that happen to sit right of
 * the artwork.
 *
 * The stage is capped by `--about-stage-max-w` so it always fits one screen,
 * which is what lets it work as a snapping section on a short laptop display.
 *
 * Below `lg` the stage dissolves into ordinary flow — heading, composite,
 * body — per docs/responsive-strategy.md §4.
 *
 * **The artwork is one supplied image, not a composite built here.** Earlier
 * versions assembled it in the browser: `14.svg`'s silhouette as a CSS mask, a
 * photograph clipped to it, a gradient tint over that, and the cut-out
 * positioned on top. Each step lost something — a browser can approximate the
 * duotone but never match it, because the ramp is applied per-tone by whoever
 * prepared the asset rather than as one linear sweep. The client now supplies
 * the finished composite, so all of that is gone. The same course
 * `<EndeavourSplit>` took. `14.svg` — the bare chamfered shape — is kept in
 * `src/assets/images/aboutSael/` should a future design need it; the graded
 * crop and the separate cut-out are not, since the supplied composite
 * contains both.
 */
export function IntroSplit({ eyebrow, title, body, cta, media, snap = false }: IntroSplitProps) {
  return (
    <Section
      data-snap-section
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className={cn(
          'flex w-full flex-col gap-flow',
          // The stage.
          'lg:relative lg:mx-auto lg:block lg:aspect-(--about-stage-aspect) lg:max-w-(--about-stage-max-w)',
        )}
      >
        {/* Heading first in the DOM: it is the section's <h2>, and on a phone
            it should be read before the artwork it introduces. Absolute
            positioning above lg makes source order irrelevant there. */}
        <div className="lg:absolute lg:top-(--about-heading-y) lg:left-(--about-heading-x) lg:w-(--about-heading-w)">
          {/* The eyebrow does not animate. It is the section's label rather
              than its content — it wants to be there already, so that what
              moves reads as the section filling in beneath a fixed heading
              rather than the whole block arriving at once. */}
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone="accent">{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={2}>
            {/*
              Regular weight, not the 700 that `--text-h2` carries. The design
              sets this heading at 400 and it is the difference between the
              section reading as editorial and reading as a product page.
            */}
            <h2 className="mt-stack text-h2 font-normal">{title}</h2>
          </Reveal>
        </div>

        {/* The artwork lands last: the heading introduces it, so it reads
            better arriving after the words that name it. */}
        <Reveal
          order={3}
          className={cn(
            'w-full',
            'lg:absolute lg:top-(--about-media-y) lg:left-(--about-media-x) lg:w-(--about-media-w)',
          )}
        >
          <MediaFrame
            image={media.image}
            alt={media.alt}
            sizes={SIZES_ABOUT_MEDIA}
            pending="aboutSael/sardar-kid-cutout"
            className="aspect-(--about-aspect) w-full bg-transparent"
            // The chamfered silhouette has transparent corners around it, so
            // the artwork must not be cropped to the box — `contain`, not
            // `cover`.
            imageClassName="object-contain"
          />
        </Reveal>

        <Reveal
          order={4}
          className="lg:absolute lg:top-(--about-body-y) lg:left-(--about-body-x) lg:w-(--about-body-w)"
        >
          <p className="text-body [text-wrap:pretty] text-body-muted">{body}</p>
          {cta !== undefined && (
            <Button href={cta.href} className="mt-flow">
              {cta.label}
            </Button>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

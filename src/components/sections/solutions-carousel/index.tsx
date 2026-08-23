import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Rail } from '@/components/ui/rail/rail';
import { RailArrows } from '@/components/ui/rail/rail-arrows';
import { RailTrack } from '@/components/ui/rail/rail-track';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_SOLUTION_CARD } from '@/lib/utils/image-sizes';
import type { SolutionsCarouselProps } from './types';

export type { SolutionSlide, SolutionsCarouselProps } from './types';

/**
 * "Solutions" — the plants themselves, on a rail. docs/features/04 §6, rebuilt
 * to `SAEL Home v2`.
 *
 * **Four plates on a strip, not one card spanning the content width.** The
 * earlier build put a single 19:10 photograph across the page with its
 * neighbours bleeding past the gutters, and a gradient plaque laid over each.
 * v2 sets four 4:3 plates a hairline apart, each named underneath rather than
 * over: a `<figure>` with a real `<figcaption>` above the fold of the frame.
 * The plaque is gone with the composition that needed it, and so is the
 * section's licence to be taller than a screen — four smaller plates fit.
 *
 * **On paper, where the design draws it on black.** The client's call on
 * 2026-08-20: the dark ground is kept for the Business Portfolio and Our
 * Goals, and this section stays with the light sections either side of it so
 * the page does not alternate on every scroll. Everything else here is the
 * design's, with the ramps swapped for the ones that carry on paper.
 *
 * A Server Component, apart from the rail's arrows. The photography, the
 * captions and the heading block are all rendered here and handed to
 * {@link RailTrack} as children, so making the arrows interactive costs the
 * client bundle the arrows and nothing else — no image data, no copy.
 */
export function SolutionsCarousel({
  eyebrow,
  title,
  lead,
  slides,
  snap = false,
}: SolutionsCarouselProps) {
  return (
    <Section
      data-snap-section
      background="paper-dots"
      fullBleed
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <Rail>
        <div className="flex w-full flex-col gap-flow">
          <Container className="flex flex-col gap-stack">
            <Reveal order={0}>
              <Eyebrow tone="deep">{eyebrow}</Eyebrow>
            </Reveal>

            {/* The heading sits left and everything that qualifies it sits
                right, baselines aligned — the design's own arrangement. It
                wraps to a stack before the two halves get too narrow to hold
                a line of copy between them. */}
            <div className="flex flex-wrap items-end justify-between gap-x-flow gap-y-stack">
              {/*
                `--text-display`, which carries its own 400 weight — the same
                size and face as "Endeavoring to make a sustainable impact" and
                "Our Current Power Portfolio", which is how v2 sets all three.
                DIN has no 500, and asking for one would be synthesised.
                docs/design-guidelines.md §2.

                The ramp is clipped to the letterforms, as the design has it.
                `--gradient-eyebrow-deep` and not the bright one: this is paper.
              */}
              <Reveal order={2}>
                <h2 className="max-w-(--hero-measure) bg-(image:--gradient-eyebrow-deep) gradient-text text-display">
                  {title}
                </h2>
              </Reveal>

              <div className="flex flex-1 flex-wrap items-end justify-end gap-x-flow gap-y-stack">
                {/* No `--measure` cap here. The cap is for running copy, and
                    this is a single sentence the design sets on one or two
                    lines; capped at 68ch it broke after "propelling" on every
                    desktop width. It still wraps naturally once the column is
                    narrower than the sentence. */}
                <Reveal order={3}>
                  <p className="text-body [text-wrap:pretty] text-body-soft">{lead}</p>
                </Reveal>

                <RailArrows
                  previousLabel="Previous plant"
                  nextLabel="Next plant"
                  tone="paper"
                />
              </div>
            </div>
          </Container>

          <Reveal order={4}>
            <RailTrack label="SAEL plants" gap="hair">
              {slides.map((slide) => (
                <li key={slide.id} className="w-solution-card shrink-0 snap-start">
                  {/*
                    A `<figure>` with a real `<figcaption>`, not a div under a
                    photograph: the caption names the image above it, which is
                    what the pairing means.
                  */}
                  <figure>
                    <MediaFrame
                      image={slide.image}
                      alt={slide.alt}
                      sizes={SIZES_SOLUTION_CARD}
                      pending={`solutions/${slide.id}`}
                      className="aspect-plate w-full"
                    />

                    <figcaption className="mt-4 border-t border-hairline-paper pt-3.5">
                      <p className="text-plate-title text-ink">{slide.place}</p>
                      <p className="mt-1.5 text-meta text-meta-paper uppercase">
                        {slide.descriptor}
                      </p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </RailTrack>
          </Reveal>
        </div>
      </Rail>
    </Section>
  );
}

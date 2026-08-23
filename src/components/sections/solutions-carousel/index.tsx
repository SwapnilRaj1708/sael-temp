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

            {/* At `lg` and above the heading sits left and everything that
                qualifies it sits right, baselines aligned — the design's own
                arrangement. Below `lg` the three parts stack, each at the full
                content width.

                A breakpoint switch and not `flex-wrap`, which is what this was
                and which never wrapped: the right-hand group was `flex-1`,
                whose `flex-basis: 0` makes its hypothetical main size zero, so
                it always "fits" beside the heading however little room is
                left. On a phone that left the sentence in a ~100px column with
                its lines running off the side of the screen.

                `lg` is the hinge for a layout that changes rather than scales.
                docs/responsive-strategy.md §2. */}
            <div className="flex flex-col gap-stack lg:flex-row lg:items-end lg:justify-between lg:gap-x-flow">
              {/*
                `--text-display`, which carries its own 400 weight — the same
                size and face as "Endeavoring to make a sustainable impact" and
                "Our Current Power Portfolio", which is how v2 sets all three.
                DIN has no 500, and asking for one would be synthesised.
                docs/design-guidelines.md §2.

                The ramp is clipped to the letterforms, as the design has it.
                `--gradient-eyebrow-deep` and not the bright one: this is paper.

                The 15ch cap is scoped to `lg`, where it does its job of
                keeping the heading clear of the column beside it. Below that
                there is no column beside it, and capping a 360px screen at
                15ch left a third of every line empty while the sentence
                underneath had nowhere to go.
              */}
              <Reveal order={2}>
                <h2 className="bg-(image:--gradient-eyebrow-deep) gradient-text text-display lg:max-w-(--hero-measure)">
                  {title}
                </h2>
              </Reveal>

              <div className="flex flex-col gap-stack lg:flex-1 lg:flex-row lg:flex-wrap lg:items-end lg:justify-end lg:gap-x-flow">
                {/* No `--measure` cap here. The cap is for running copy, and
                    this is a single sentence the design sets on one or two
                    lines; capped at 68ch it broke after "propelling" on every
                    desktop width. It still wraps naturally once the column is
                    narrower than the sentence. */}
                <Reveal order={3}>
                  <p className="text-body [text-wrap:pretty] text-body-soft">{lead}</p>
                </Reveal>

                {/* Stacked, the pair stays at the right-hand edge rather than
                    sliding under the sentence — it is the corner of the frame
                    in the design and it reads as one there too. */}
                <RailArrows
                  previousLabel="Previous plant"
                  nextLabel="Next plant"
                  tone="paper"
                  className="self-end lg:self-auto"
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

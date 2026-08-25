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

            {/*
              `--text-display`, which carries its own 400 weight — the same
              size and face as "Endeavoring to make a sustainable impact" and
              "Our Current Power Portfolio", which is how v2 sets all three.
              DIN has no 500, and asking for one would be synthesised.
              docs/design-guidelines.md §2.

              The ramp is clipped to the letterforms, as the design has it.
              `--gradient-eyebrow-deep` and not the bright one: this is paper.

              **The heading has the row to itself**, by the client's decision
              on 2026-08-25. It used to share a line with the sentence that
              qualifies it, which is why it carried a 15ch cap — the cap was
              there to keep it clear of the column beside it. There is no
              column beside it now, so the cap is gone with the arrangement
              that needed it and the heading runs the content width.
            */}
            <Reveal order={2}>
              <h2 className="bg-(image:--gradient-eyebrow-deep) gradient-text text-display">
                {title}
              </h2>
            </Reveal>

            {/* Underneath it, the sentence at the left edge and the paging
                pair at the right — the two ends of one row, which is the
                arrangement the heading used to be part of.

                Stacked below `md`, where a sentence and a pair of 52px
                controls on one line leave the sentence too narrow to read.
                `md` rather than the page's usual `lg` hinge because this row
                is no longer competing with the heading for width: it has the
                whole content column, and a tablet has room for both halves
                long before it has room for the old three-part arrangement.
                docs/responsive-strategy.md §2 asks for the justification, and
                that is it. */}
            <div className="flex flex-col gap-stack md:flex-row md:items-end md:justify-between md:gap-x-flow">
              {/* Capped at `--measure` now that it is running copy in a column
                  of its own. It was uncapped while it sat in the narrow
                  right-hand column, where the column was already the cap and
                  68ch only made the line break in a worse place; across the
                  full content width, uncapped means a single sentence stretched
                  over 1600px. */}
              <Reveal order={3}>
                <p className="max-w-(--measure) text-body [text-wrap:pretty] text-body-soft">
                  {lead}
                </p>
              </Reveal>

              {/* Stacked, the pair stays at the right-hand edge rather than
                  sliding under the sentence — it is the corner of the frame in
                  the design and it reads as one there too. */}
              <RailArrows
                previousLabel="Previous plant"
                nextLabel="Next plant"
                tone="paper"
                className="self-end md:shrink-0 md:self-auto"
              />
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

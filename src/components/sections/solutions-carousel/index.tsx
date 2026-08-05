import { CardRail } from '@/components/ui/card-rail';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_SOLUTION_CARD } from '@/lib/utils/image-sizes';
import type { SolutionsCarouselProps } from './types';

export type { SolutionSlide, SolutionsCarouselProps } from './types';

/**
 * "Solutions" — the plants themselves, as a carousel. docs/features/04 §6.
 *
 * **This replaces the `<FeatureBanner>` that §6 describes.** That spec is one
 * full-bleed photograph of the Mizoram plant with a gradient caption badge over
 * it, reusable as a page hero elsewhere. The client's own design puts four
 * plants here on a paging rail, each with the same badge — so the badge
 * survives, the single image does not, and the reusable banner is not this
 * component's job. If a business page later wants the one-image version, it is
 * a separate primitive built from the same plaque; do not add a `slides.length
 * === 1` branch here. `docs/asset-inventory.md` §10 records the difference.
 *
 * **One card on screen, spanning the content width.** Its edges land on the
 * same vertical lines as the heading above it, and a gutter's worth of each
 * neighbour bleeds past the viewport edges. That is the design, and it is also
 * why the section is `fullBleed` with a `<Container>` around its heading
 * instead of the other way round: the rail has to reach the glass.
 *
 * **The one snapping section allowed to be taller than a screen.** A card that
 * wide at 19:10 is ~840px tall at 1920, which does not leave room for the
 * heading block inside one screenful. Capping it makes the card's proportions
 * a function of the browser window — the same photograph letterboxed on a
 * laptop and square-ish on a monitor — and the client rejected that. So `snap`
 * still marks it, and the scroller travels through it before it pages.
 *
 * A Server Component, apart from the rail's arrows. The photography, the
 * plaques and the heading block are all rendered here and handed to
 * {@link CardRail} as children, so making the arrows interactive costs the
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
      fullBleed
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className="flex w-full flex-col gap-flow [--rail-card-w:var(--solution-card-w)]"
      >
        <Container className="flex flex-col gap-stack">
          <Eyebrow tone="accent">{eyebrow}</Eyebrow>
          {/*
            Regular weight, not the token's 700. The client's design sets this
            heading and "Endeavoring to make a sustainable impact" at the same
            size in the same face, and that one is settled as 400 — see
            sections/intro-split/. DIN has no 500, and asking for one would be
            synthesised. docs/design-guidelines.md §2.
          */}
          <h2 className="max-w-(--measure) text-h2 font-normal">{title}</h2>
          {/* No `--measure` cap here. The cap is for running copy, and this is a
              single sentence the design sets on one line — capped at 68ch it
              broke after "propelling" on every desktop width. It still wraps
              naturally once the viewport is narrower than the sentence. */}
          <p className="text-body [text-wrap:pretty] text-body-soft">{lead}</p>
        </Container>

        <CardRail
          label="SAEL plants"
          previousLabel="Previous plant"
          nextLabel="Next plant"
          align="center"
        >
          {slides.map((slide) => (
            <li key={slide.id} className="rail-card shrink-0 snap-center">
              {/*
                A `<figure>` with a real `<figcaption>`, not a positioned div:
                the plaque names the photograph beside it, which is what the
                pairing means. It is placed over the image rather than under
                it, so the caption is `absolute` while the figure is not.
              */}
              <figure className="relative">
                <MediaFrame
                  image={slide.image}
                  alt={slide.alt}
                  sizes={SIZES_SOLUTION_CARD}
                  pending={`solutions/${slide.id}`}
                  // The ratio is the only thing setting the height. No screen
                  // -height cap: it would make the same photograph a different
                  // shape on every machine. See the note in theme.css.
                  className="aspect-solution w-full rounded-xs md:aspect-solution-wide"
                />

                <figcaption
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2',
                    'rounded-t-xs bg-(image:--gradient-solution-plaque)',
                    'px-6 py-2 text-center',
                  )}
                >
                  <p className="text-plaque-title text-white uppercase">{slide.place}</p>
                  <p className="text-tile-note text-white/95">{slide.descriptor}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </CardRail>
      </div>
    </Section>
  );
}

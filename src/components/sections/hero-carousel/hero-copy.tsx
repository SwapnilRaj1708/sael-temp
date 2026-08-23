import { Container } from '@/components/ui/container';
import { MediaFrame } from '@/components/ui/media-frame';
import { SIZES_HERO_SYMBOL } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';
import { HeroHeadline } from './hero-headline';
import type { HeroSlide } from './types';

export interface HeroCopyProps {
  slides: HeroSlide[];
  activeIndex: number;
}

/**
 * The hero's content column: the slide's mark, a short red rule, the headline.
 *
 * **One column for all four slides, not one per slide.** The earlier design
 * placed each headline and mark at its own coordinates in the frame, so a
 * slide was a whole composition and the four cross-faded as units.
 * `SAEL Home v2` has a single composition — the column sits in the right-hand
 * half above `lg` and spans the width below it — so what changes between
 * slides is only the mark and the words. Both are stacked in a single grid
 * cell and cross-faded in place, which is also what keeps the red rule
 * between them still while they change.
 *
 * Stacking in one cell rather than swapping the mounted child is deliberate:
 * the stack is as tall as its tallest member at all times, so a longer
 * headline arriving does not move the rule, the mark, or the section's height.
 *
 * Below `lg` the column is bottom-anchored rather than centred — that is the
 * design's own mobile arrangement, and it is what leaves the photograph's
 * subject visible above the copy. docs/responsive-strategy.md §4.
 */
export function HeroCopy({ slides, activeIndex }: HeroCopyProps) {
  return (
    <Container
      className={cn(
        'relative z-2 grid min-h-viewport items-end gap-gap-grid',
        'pt-hero-pad-top pb-hero-pad-bottom',
        'lg:grid-cols-12 lg:items-center',
      )}
    >
      <div className="flex min-w-0 flex-col justify-end lg:col-start-7 lg:col-span-6 lg:justify-center">
        {/* The marks. Decorative at every size — the headline carries the
            meaning — so the whole stack is hidden from assistive technology
            rather than each image carrying an empty alt. */}
        <div aria-hidden="true" className="mb-stack grid justify-items-start">
          {slides.map((slide, index) => (
            <MediaFrame
              key={slide.id}
              image={slide.symbol.image}
              alt=""
              sizes={SIZES_HERO_SYMBOL}
              pending={slide.symbol.pending}
              className={cn(
                '[grid-area:1/1] aspect-square h-hero-icon w-auto bg-transparent',
                'transition-opacity duration-(--duration-cross-fade) motion-reduce:transition-none',
                index === activeIndex ? 'opacity-100' : 'opacity-0',
              )}
              imageClassName="object-contain"
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="mb-stack h-hero-rule-h w-hero-rule-w shrink-0 bg-brand-red"
        />

        <div className="grid">
          {slides.map((slide, index) => (
            <HeroHeadline key={slide.id} slide={slide} isActive={index === activeIndex} />
          ))}
        </div>
      </div>
    </Container>
  );
}

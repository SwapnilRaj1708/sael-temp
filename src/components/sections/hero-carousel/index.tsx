'use client';

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { HeroDots } from './hero-dots';
import { HeroSlideLayer } from './hero-slide';
import { useHeroCarousel } from './use-hero-carousel';
import { usePointerParallax } from './use-pointer-parallax';
import type { HeroSlide } from './types';

/** Horizontal travel, in px, before a drag counts as a swipe. */
const SWIPE_THRESHOLD = 50;

export interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Autoplay dwell per slide. Also the duration of the dot fill. */
  intervalMs?: number;
}

/**
 * The homepage hero. docs/features/04 §1.
 *
 * The one client component on this page, and the only section that needs to
 * be: it owns timers, pointer tracking and a slide index. Everything it can
 * hand to CSS, it does — the Ken Burns pan, the word stagger, the letterbox
 * reveal, the dot fill and the marquee-style pauses are all classes from
 * animations.css whose still state is the *default* and whose motion is inside
 * `@media (prefers-reduced-motion: no-preference)`. So the reduced-motion
 * build of this carousel is not a second code path; it is what the CSS does
 * when nothing opts in. /CLAUDE.md §5, docs/design-guidelines.md §5.
 *
 * Autoplay is the one piece of motion CSS cannot own, and `useHeroCarousel`
 * gates it on the same preference.
 */
export function HeroCarousel({ slides, intervalMs = 6000 }: HeroCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const dragOrigin = useRef<number | null>(null);

  const { index, goTo, next, previous, isPlaying, pause, resume } = useHeroCarousel({
    count: slides.length,
    intervalMs,
    sectionRef,
  });

  usePointerParallax(sectionRef);

  if (slides.length === 0) return null;

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    // Mouse drags are not swipes — a click-drag across a hero is how people
    // select text or just move the pointer. Touch and pen only.
    if (event.pointerType === 'mouse') return;
    dragOrigin.current = event.clientX;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const origin = dragOrigin.current;
    dragOrigin.current = null;
    if (origin === null) return;

    const travel = event.clientX - origin;
    if (Math.abs(travel) < SWIPE_THRESHOLD) return;
    if (travel < 0) next();
    else previous();
  };

  return (
    <Section
      ref={sectionRef}
      fullBleed
      spacing="none"
      data-snap-section
      aria-roledescription="carousel"
      aria-label="SAEL highlights"
      // Autoplay yields to the user's attention, however it arrives: a
      // pointer resting on the hero, or focus landing on one of the dots.
      // No pause on hover, by the client's decision on 2026-08-05: the hero
      // is meant to keep cycling whether or not the pointer is resting on it.
      //
      // Focus still pauses, and that is not the same feature. A keyboard user
      // who has tabbed to a dot is *operating* the carousel; advancing the
      // slide under them moves the thing they are aiming at. Hover is
      // incidental — focus is intent.
      onFocus={pause}
      onBlur={resume}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragOrigin.current = null)}
      className={cn(
        'relative isolate overflow-hidden bg-surface-deep',
        /*
         * One screenful below the fixed header, at every size.
         *
         * This replaces the aspect ratios responsive-strategy.md §4 specifies
         * for the hero (2.34/1 above lg, 4/5 below). Those describe a hero in
         * normal document flow; the client has since asked for the homepage to
         * snap section by section, and a snapping section that is not a
         * viewport tall leaves a gap or a partial neighbour at every rest
         * position. The photographs are `object-cover`, so they fill whatever
         * height this resolves to rather than letterboxing.
         *
         * `min-h`, not `h`: if the headline ever wraps past the available
         * space at 360px the section grows instead of clipping it.
         */
        'min-h-viewport snap-start',
        // Vertical page scroll is never captured by the swipe handler.
        'touch-pan-y',
      )}
    >
      {slides.map((slide, slideIndex) => (
        <HeroSlideLayer
          key={slide.id}
          slide={slide}
          isActive={slideIndex === index}
          position={slideIndex + 1}
          total={slides.length}
        />
      ))}

      {/*
        The letterbox reveal — two panels wiping off the hero on first paint.
        First mount only, never on a slide change.

        They are rendered server-side and animated purely by CSS, which is what
        makes them safe: `.anim-letterbox` is `display: none` by default and
        only becomes visible inside the no-preference media query. So a user
        who asked for reduced motion never sees them, and a user whose
        JavaScript never arrives still gets the reveal rather than a hero
        sitting under two black panels forever.
      */}
      <div
        aria-hidden="true"
        className="anim-letterbox pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-top bg-surface-darker"
      />
      <div
        aria-hidden="true"
        className="anim-letterbox pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 origin-bottom bg-surface-darker"
      />

      <HeroDots
        labels={slides.map((slide) => slide.headline)}
        activeIndex={index}
        onSelect={goTo}
        isPlaying={isPlaying}
        intervalMs={intervalMs}
      />
    </Section>
  );
}

export type { HeroSlide, HeroSlidePlacement } from './types';

'use client';

import {
  useRef,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { HeroBackdrop } from './hero-backdrop';
import { HeroCopy } from './hero-copy';
import { HeroProgress } from './hero-progress';
import { useHeroCarousel } from './use-hero-carousel';
import { usePointerParallax } from './use-pointer-parallax';
import type { HeroSlide } from './types';

/** Horizontal travel, in px, before a drag counts as a swipe. */
const SWIPE_THRESHOLD = 50;

/**
 * How long after a pointer lands that the focus it causes still counts as
 * "the pointer did this" rather than "the keyboard did this".
 *
 * Focus arrives on pointerdown, well inside this, so the ordering is never in
 * doubt: pointerdown → focus → pointerup.
 */
const POINTER_FOCUS_MS = 400;

export interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Autoplay dwell per slide. Also the duration of the dot fill. */
  intervalMs?: number;
}

/**
 * The homepage hero. **`docs/HERO-SPEC.md` is the source of truth for this
 * component**, adopted 2026-08-27; docs/features/04 §1 is the older account.
 *
 * What the spec changed from the `SAEL Home v2` build it replaced:
 *
 *  - **Four compositions, not one.** Each slide places its mark and its
 *    headline at its own coordinates in the frame — §2's `iconX/iconY` and
 *    `textX/textY` — where v2 had a single shared content column. See
 *    `<HeroCopy>`.
 *  - **A 2.34:1 frame** (§1), and the four photographs are cut to it. The crop
 *    is in the files, so no slide carries an `object-position`. See
 *    `<HeroBackdrop>`.
 *  - **Progress dots**, not the full-bleed bar v2 pinned to the base (§6). See
 *    `<HeroProgress>`.
 *  - **The mark is loose in the frame again** at 18.5vw, roughly twice the
 *    size it was in the column, and the headline is white throughout — §3e
 *    gives it a flat `#fff`, so v2's per-slide gradient run is gone.
 *
 * **HERO-SPEC.md specifies the 1920 desktop composition and is silent below
 * it**, so everything it gives is applied from `lg` and the `SAEL Home v2`
 * mobile arrangement stands underneath: a portrait art-directed crop, and the
 * mark, rule and headline bottom-anchored in a column on the page gutter.
 * Taken literally at 360px the spec would be a 154px-tall hero with a 112px
 * headline column, which is why. /CLAUDE.md §1 and §9.
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
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);
  const lastPointerAt = useRef(0);

  const { index, goTo, next, previous, isPlaying, pause, resume } = useHeroCarousel({
    count: slides.length,
    intervalMs,
    sectionRef,
  });

  usePointerParallax(sectionRef);

  if (slides.length === 0) return null;

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    // Every pointer type, and before the mouse guard below: this is what tells
    // the focus handler that a pointer, not the keyboard, is driving.
    lastPointerAt.current = Date.now();

    // Mouse drags are not swipes — a click-drag across a hero is how people
    // select text or just move the pointer. Touch and pen only.
    if (event.pointerType === 'mouse') return;
    dragOrigin.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const origin = dragOrigin.current;
    dragOrigin.current = null;
    if (origin === null) return;

    const travelX = event.clientX - origin.x;
    const travelY = event.clientY - origin.y;

    if (Math.abs(travelX) < SWIPE_THRESHOLD) return;
    // Horizontal intent, not just horizontal distance. A diagonal flick down
    // the page covers plenty of x on the way, and changing the slide under
    // someone who is scrolling is the carousel taking a gesture that was not
    // aimed at it. `touch-action: pan-y` stops us stealing the *scroll*; this
    // stops us acting on it.
    if (Math.abs(travelX) <= Math.abs(travelY)) return;

    if (travelX < 0) next();
    else previous();
  };

  /**
   * Pause only for the keyboard.
   *
   * `onFocus` fires for a tap as much as for a Tab, and on a touch screen the
   * matching blur very often never comes — there is nothing to move focus to,
   * so it stays on the dot. Autoplay stopped for good the first time anyone
   * touched a dot, which is the reported "sometimes stops working on mobile".
   *
   * Decided from *when the last pointer landed*, not from `:focus-visible`.
   * The pseudo-class is the browser's own answer to the same question, but it
   * also matches a programmatic `focus()`, so anything that moves focus in
   * script re-introduces the bug — which is exactly how this was caught.
   * Timing is the thing actually being asked about and it cannot be spoofed
   * by a stray `focus()` call.
   */
  const onFocusCapture = (event: ReactFocusEvent<HTMLElement>) => {
    void event;
    if (Date.now() - lastPointerAt.current > POINTER_FOCUS_MS) pause();
  };

  return (
    <Section
      ref={sectionRef}
      fullBleed
      spacing="none"
      background="hero"
      data-snap-section
      aria-roledescription="carousel"
      aria-label="SAEL highlights"
      // No pause on hover, by the client's decision on 2026-08-05: the hero
      // keeps cycling whether or not the pointer rests on it.
      //
      // Keyboard focus still pauses, and that is not the same feature. Someone
      // who has tabbed to a segment is *operating* the carousel; advancing the
      // slide under them moves the thing they are aiming at. See
      // `onFocusCapture`, which is where "keyboard" is decided.
      onFocus={onFocusCapture}
      onBlur={resume}
      onPointerDown={onPointerDown}
      // Resume unconditionally on any pointer release, so autoplay cannot end
      // up wedged off. Even if something pauses it that this component did not
      // anticipate, touching the hero puts it back — a stuck carousel is the
      // one failure worth being ungraceful about.
      onPointerUp={(event) => {
        onPointerUp(event);
        resume();
      }}
      // Both reset the drag. Cancel is the browser taking the gesture over —
      // a vertical pan, usually. Leave is the finger going out of the section
      // mid-swipe, after which no `pointerup` will arrive here and a stale
      // origin would otherwise turn the *next* tap into a phantom swipe.
      onPointerCancel={() => (dragOrigin.current = null)}
      onPointerLeave={() => (dragOrigin.current = null)}
      className={cn(
        'relative isolate overflow-hidden',
        /*
         * HERO-SPEC.md §1's frame, from `lg` — 2.34:1, and explicitly not
         * 16/9. `lg:min-h-0` is what lets it take effect: `min-h-viewport`
         * resolves taller than the ratio at every desktop size, and a
         * min-height beats an aspect-ratio, so leaving it set would silently
         * keep the v2 box and the spec would appear not to have applied.
         *
         * **The hero is no longer a full screenful, and that is the spec's
         * call.** At 1920 x 1080 the frame is 820px against a ~996px snap
         * area, so the section under it shows through beneath the fold. The
         * `min-h-viewport` this replaces was v2's answer to exactly that, and
         * §1 supersedes it. `snap-start` still holds the hero's top edge.
         *
         * Below `lg` the spec is silent and `min-h` stands: a viewport-tall
         * hero over a portrait crop, growing rather than clipping if the
         * headline wraps past the space at 360px.
         */
        'min-h-viewport snap-start',
        'lg:aspect-(--hero-aspect) lg:min-h-0',
        // Vertical page scroll is never captured by the swipe handler.
        'touch-pan-y',
      )}
    >
      {/*
        One full-bleed layer per slide, cross-fading in place — HERO-SPEC.md
        §3. The wrapper owns the fade so neither the backdrop nor the copy
        inside it has to know the slide is changing, and `pointer-events-none`
        keeps a drag anywhere over the hero reaching the swipe handler.
      */}
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              'pointer-events-none absolute inset-0',
              'transition-opacity duration-(--duration-cross-fade) [transition-timing-function:ease]',
              // An instant swap is the honest reading of "reduce motion" for a
              // change the user did not ask for. Matches card.tsx.
              'motion-reduce:transition-none',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          >
            <HeroBackdrop slide={slide} isActive={isActive} position={slideIndex + 1} />
            <HeroCopy slide={slide} isActive={isActive} />
          </div>
        );
      })}

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
        className="anim-letterbox pointer-events-none absolute inset-x-0 top-0 z-6 h-1/2 origin-top bg-surface-darker"
      />
      <div
        aria-hidden="true"
        className="anim-letterbox pointer-events-none absolute inset-x-0 bottom-0 z-6 h-1/2 origin-bottom bg-surface-darker"
      />

      <HeroProgress
        labels={slides.map((slide) => slide.headline)}
        activeIndex={index}
        onSelect={goTo}
        isPlaying={isPlaying}
        intervalMs={intervalMs}
      />
    </Section>
  );
}

export type { HeroSlide } from './types';

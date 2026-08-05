'use client';

import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * How one section-to-section move feels.
 *
 * `power2.out` starts at full speed and eases only into the stop, so the page
 * answers the gesture immediately. The obvious choice, `power2.inOut`, ramps
 * up first — which reads as lag, because the first ~150ms of a half-second
 * move covers almost no distance and the page appears not to have responded.
 * Short and front-loaded beats long and symmetrical for something the user
 * triggers directly.
 */
const DURATION = 0.1;
const EASE = 'power2.out';

const KEYS_FORWARD = new Set(['ArrowDown', 'PageDown', ' ']);
const KEYS_BACK = new Set(['ArrowUp', 'PageUp']);

/**
 * Whether a gesture belongs to a horizontal rail rather than to section paging.
 *
 * The observer runs on the window with `preventDefault: true` — that is what
 * makes one wheel tick move one section, and, left alone, it is also what stops
 * a carousel scrolling sideways, because the rail's own scroll is a default
 * action like any other.
 *
 * Split by intent rather than by element, so the carousels do not become dead
 * patches in the middle of the page:
 *
 *  - **Wheel, horizontal** — a trackpad swipe or shift+wheel. The rail is the
 *    only thing that can act on it, so hand it over.
 *  - **Wheel, vertical** — nothing horizontal can consume it. Paging keeps it,
 *    so scrolling down the page works with the pointer over a carousel.
 *  - **Touch** — direction is not known when the gesture starts, and guessing
 *    wrong gives either a carousel that cannot be swiped or a page that jumps
 *    while you swipe it. The rail wins; a vertical drag from a card scrolls the
 *    page natively instead of paging, which is the milder failure.
 */
function belongsToRail(event: Event): boolean {
  const target = event.target;
  if (!(target instanceof Element) || target.closest('[data-scroll-rail]') === null) {
    return false;
  }

  return event instanceof WheelEvent ? Math.abs(event.deltaX) > Math.abs(event.deltaY) : true;
}

/** Fallback travel when a gesture carries no usable delta — a key press. */
const KEY_STEP_RATIO = 0.9;

/**
 * One gesture, one section.
 *
 * CSS scroll-snap cannot express this, which is why it is not used here.
 * `proximity` only pulls once you have already come to rest near a boundary,
 * and `mandatory` still lets a single wheel tick land you back where you
 * started — in both cases you scroll several times to move once. Snapping is a
 * *correction* applied after a native scroll; paging is a *replacement* for
 * it, and only script can do that.
 *
 * ---------------------------------------------------------------------------
 * Why GSAP
 *
 * `Observer` normalises wheel, trackpad and touch into one gesture stream with
 * its own tolerance and debouncing — the part that is genuinely hard to get
 * right, because a trackpad emits a long tail of small deltas that naively
 * reads as a dozen separate scrolls. Writing that by hand is where homegrown
 * scroll-jacking usually falls apart.
 *
 * It is also the same library that will carry the pinned-background parallax
 * described for a later section: that is `ScrollTrigger` with `pin` and
 * `scrub`, and it shares this dependency rather than adding a second one.
 *
 * Considered and rejected: **Motion** (excellent for component animation and
 * `useScroll` parallax, but has no gesture-paging primitive — the state
 * machine above would still be hand-written); **Lenis** (a fine smooth-scroll
 * layer, ~3KB, but it smooths scrolling rather than replacing it, and does no
 * pinning); **fullPage.js** (does exactly this out of the box, but is
 * commercially licensed per-site and takes ownership of the page structure).
 * Lenis remains a sensible later addition *alongside* GSAP if the client wants
 * inertial smoothing.
 *
 * Cost: gsap core plus these two plugins is roughly 40KB gzipped, against the
 * 120KB homepage budget in docs/responsive-strategy.md §6. Worth re-measuring
 * once the remaining ten sections land.
 *
 * ---------------------------------------------------------------------------
 * What this does not take away
 *
 * Hijacking the scroll wheel is the single easiest way to make a page hostile,
 * so every escape route is kept open deliberately:
 *
 *  - **Reduced motion turns it off entirely.** Not "shorter", off — the page
 *    scrolls natively. /CLAUDE.md §5.
 *  - **Keyboard works**, and paging is wired to the keys that already mean it:
 *    arrows, Page Up/Down, Space, Home, End. Keys are ignored while focus is
 *    in a field.
 *  - **Ctrl/⌘ + wheel still zooms.** Swallowing that breaks WCAG 1.4.4, so the
 *    observer stands down while a zoom gesture is in flight.
 *  - **A horizontal rail keeps its own gestures.** See `belongsToRail`.
 *  - **A section taller than the viewport scrolls through** before it pages,
 *    so nothing becomes unreachable — the failure mode `mandatory` snapping
 *    has, and the reason it was not used.
 *  - **The ends are not trapped.** Scrolling past the last section reaches the
 *    footer, which is outside the paged region.
 */
export function SectionScroller() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(Observer, ScrollToPlugin);

    const root = document.documentElement;
    // Hands scrolling over from CSS to here. globals.css keeps the snap rule
    // as the no-JavaScript baseline and this switches it off, so the two are
    // never fighting over the same gesture.
    root.classList.add('section-scroll-active');

    const getSections = (): HTMLElement[] => [
      ...document.querySelectorAll<HTMLElement>('[data-snap-section]'),
    ];

    // Measured, not read from the token: the token is in `rem` and changes at
    // `lg`, and the header is right there to ask.
    const headerHeight = (): number => document.querySelector('header')?.offsetHeight ?? 0;

    let animating = false;
    let index = 0;
    let zoomTimer = 0;
    let resyncTimer = 0;

    /** Whichever section currently sits closest to the top of the content. */
    const syncIndex = (): void => {
      const offset = headerHeight();
      let closest = 0;
      let smallest = Number.POSITIVE_INFINITY;

      getSections().forEach((section, i) => {
        const distance = Math.abs(section.getBoundingClientRect().top - offset);
        if (distance < smallest) {
          smallest = distance;
          closest = i;
        }
      });

      index = closest;
    };

    const goTo = (next: number): boolean => {
      const sections = getSections();
      const target = sections[next];
      if (target === undefined) return false;

      animating = true;
      index = next;

      gsap.to(window, {
        duration: DURATION,
        ease: EASE,
        overwrite: true,
        scrollTo: { y: target, offsetY: headerHeight(), autoKill: false },
        onComplete: () => {
          animating = false;
        },
      });

      return true;
    };

    const advance = (direction: 1 | -1, delta: number): void => {
      if (animating) return;

      const offset = headerHeight();
      const viewport = window.innerHeight - offset;
      const step = Math.abs(delta) > 0 ? Math.abs(delta) : viewport * KEY_STEP_RATIO;
      const current = getSections()[index];

      if (current !== undefined) {
        const rect = current.getBoundingClientRect();

        // Taller than the viewport: travel through it first. Without this,
        // paging would skip whatever did not fit on the first screen.
        if (direction === 1 && rect.bottom > window.innerHeight + 2) {
          window.scrollBy({ top: step });
          return;
        }
        if (direction === -1 && rect.top < offset - 2) {
          window.scrollBy({ top: -step });
          return;
        }
      }

      // Off either end — above the first section or below the last, where the
      // footer lives. Hand the gesture back rather than swallowing it.
      if (!goTo(index + direction)) window.scrollBy({ top: direction * step });
    };

    const observer = Observer.create({
      type: 'wheel,touch',
      // Wheel deltas are inverted relative to Observer's up/down naming, so
      // `onUp` is "the content moved up", i.e. the user scrolled down.
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      // Runs per event rather than resolving a selector once at creation, so a
      // rail that mounts later is still honoured.
      ignoreCheck: belongsToRail,
      onUp: (self) => {
        advance(1, self.deltaY);
      },
      onDown: (self) => {
        advance(-1, self.deltaY);
      },
    });

    const onWheelCapture = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      // A zoom gesture, not a scroll. Stand down until it is over.
      observer.disable();
      window.clearTimeout(zoomTimer);
      zoomTimer = window.setTimeout(() => {
        observer.enable();
      }, 400);
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (target.isContentEditable) return;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      }

      if (KEYS_FORWARD.has(event.key)) {
        event.preventDefault();
        advance(1, 0);
      } else if (KEYS_BACK.has(event.key)) {
        event.preventDefault();
        advance(-1, 0);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(getSections().length - 1);
      }
    };

    // Anything that moves the page without going through us — a skip link, an
    // anchor, focus landing off-screen — leaves `index` stale. Re-derive it
    // once the page settles.
    const onScroll = (): void => {
      if (animating) return;
      window.clearTimeout(resyncTimer);
      resyncTimer = window.setTimeout(syncIndex, 120);
    };

    syncIndex();
    window.addEventListener('wheel', onWheelCapture, { capture: true, passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.kill();
      gsap.killTweensOf(window);
      window.clearTimeout(zoomTimer);
      window.clearTimeout(resyncTimer);
      window.removeEventListener('wheel', onWheelCapture, { capture: true });
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      root.classList.remove('section-scroll-active');
    };
  }, [reducedMotion]);

  return null;
}

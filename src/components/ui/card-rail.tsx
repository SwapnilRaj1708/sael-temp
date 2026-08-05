'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils/cn';

export interface CardRailProps {
  /** Names the list for a screen reader, e.g. "SAEL plants". */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /**
   * `start` aligns cards to the page gutter — a strip that reads left to
   * right. `center` makes the middle card the subject, with its neighbours
   * visible either side. Pair with `snap-start` / `snap-center` on the cards.
   */
  align?: 'start' | 'center';
  /**
   * `prominent` is larger, solid and always drawn over the artwork. For a rail
   * of small cards, where a subtle arrow is lost among them.
   */
  arrows?: 'subtle' | 'prominent';
  /** The `<li>` cards. Server-rendered — this component never inspects them. */
  children: ReactNode;
}

/** Sub-pixel slack. `scrollLeft` is fractional on a zoomed or scaled display. */
const EPSILON = 1;

/**
 * A horizontally scrolling row of cards, with paging arrows.
 *
 * Shared by the Solutions and In the News sections. The rail owns scrolling,
 * snapping, the arrows and gutter alignment; **how wide a card is belongs to
 * the caller**, as a class on each `<li>` — one full-width plant photograph and
 * six narrow news cards are the same mechanism at different sizes. Children
 * are stretched to equal heights, so a card can push a footer to its base with
 * `mt-auto`.
 *
 * **The rail is a real scroll container, not a transformed strip.** That single
 * decision is what makes the rest of this component small:
 *
 *  - It works before this bundle arrives, and on a page where it never does.
 *    The markup is a list, `overflow-x: auto` makes it swipeable, and CSS
 *    snapping makes it land cleanly. The arrows are an *addition* to a
 *    carousel that already works, not the mechanism of one.
 *  - Touch, trackpad, shift+wheel and a dragged scrollbar are the platform's
 *    problem rather than ours, along with momentum, rubber-banding and the
 *    right-to-left case.
 *  - There is no index in state, so there is no way for the state and the
 *    rendered position to disagree — the failure that makes a hand-rolled
 *    carousel jump when the viewport resizes mid-transition.
 *
 * What is left for script is the two arrows and whether each is spent, and
 * that is read back from the scroll position rather than counted.
 *
 * `data-scroll-rail` is not decoration: the homepage pages section-by-section
 * on wheel and touch, and this is what tells that controller to keep its hands
 * off a sideways gesture. See components/layout/section-scroller.tsx.
 */
export function CardRail({
  label,
  previousLabel,
  nextLabel,
  align = 'start',
  arrows = 'subtle',
  children,
}: CardRailProps) {
  const rail = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  // Both spent until measured, which renders both arrows hidden. That is the
  // honest initial state: it is what the server sent, and it is *correct* for
  // a viewport wide enough to show every card.
  const [spent, setSpent] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const element = rail.current;
    if (element === null) return;

    const furthest = element.scrollWidth - element.clientWidth;
    setSpent({
      start: element.scrollLeft <= EPSILON,
      end: element.scrollLeft >= furthest - EPSILON,
    });

    // Mark whichever card is nearest the rail's centre. Written to the DOM
    // rather than held in state: it changes on every frame of a scroll, and a
    // re-render per frame to move one attribute is not a trade worth making.
    // Styling it is then the section's business — see solutions-carousel.
    const middle = element.getBoundingClientRect().left + element.clientWidth / 2;
    let closest: Element | null = null;
    let smallest = Number.POSITIVE_INFINITY;

    for (const card of element.children) {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < smallest) {
        smallest = distance;
        closest = card;
      }
    }

    for (const card of element.children) {
      if (card instanceof HTMLElement) {
        card.dataset.railActive = String(card === closest);
      }
    }
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (element === null) return;

    measure();

    // Resize, not only scroll: the number of cards on screen changes at `md`
    // and `lg`, and crossing a breakpoint can leave the rail scrolled past a
    // maximum that no longer exists. Observing the element rather than the
    // window also catches the page gutter changing under it.
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [measure]);

  /**
   * Move by exactly one card.
   *
   * The distance is measured from the two rendered cards rather than computed
   * from the token, so it stays right through a breakpoint change without this
   * component knowing what the breakpoints are — and a rail holding a single
   * card falls back to its own width rather than to zero.
   */
  const page = useCallback(
    (direction: 1 | -1) => {
      const element = rail.current;
      if (element === null) return;

      const [first, second] = element.children;
      const pitch =
        first !== undefined && second !== undefined
          ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
          : element.clientWidth;

      element.scrollBy({
        left: direction * pitch,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  return (
    <div className="relative">
      <ul
        ref={rail}
        data-scroll-rail
        // Focusable because it scrolls. A region a pointer can reach and a
        // keyboard cannot is a WCAG 2.1.1 failure, and the cards inside carry
        // no links of their own to tab through. Once focused, ← and → scroll
        // it natively — and unlike ↑ and ↓, neither is claimed by the page's
        // section paging.
        tabIndex={0}
        aria-label={label}
        onScroll={measure}
        className={cn(
          'flex items-stretch gap-rail-gap overflow-x-auto',
          'scrollbar-none snap-x snap-mandatory',
          // Full bleed. Which edge a card comes to rest against is the only
          // thing that differs between the two rails. See globals.css.
          align === 'start' ? 'rail-inset' : 'rail-centred',
          // Stops a swipe past the last card triggering the browser's
          // back-navigation gesture, or scrolling the page behind it.
          'overscroll-x-contain',
          'focus-visible:outline-offset-4',
        )}
      >
        {children}
      </ul>

      {/*
        Overlaid on the rail rather than placed beneath it, which is where the
        design has them. They clear the plaque — that sits on the bottom edge
        and these are centred — and an arrow over the corner of a photograph is
        the pattern every touch user already knows.

        Positioned on the gutter, not the viewport edge, so they sit on the
        active card rather than out on the sliver of its neighbour.
      */}
      <RailArrow
        direction={-1}
        label={previousLabel}
        spent={spent.start}
        onActivate={page}
        emphasis={arrows}
      />
      <RailArrow
        direction={1}
        label={nextLabel}
        spent={spent.end}
        onActivate={page}
        emphasis={arrows}
      />
    </div>
  );
}

interface RailArrowProps {
  direction: 1 | -1;
  label: string;
  spent: boolean;
  onActivate: (direction: 1 | -1) => void;
  emphasis: 'subtle' | 'prominent';
}

/**
 * One paging arrow.
 *
 * The chevron is drawn in SVG rather than set as the design's `‹` and `›`
 * glyphs: those are punctuation, so they sit on the text baseline and cannot
 * be optically centred in a circle without a magic offset, and they render at
 * a different weight in every fallback font. One path, mirrored, so both
 * arrows are the same shape at the same optical weight.
 */
function RailArrow({ direction, label, spent, onActivate, emphasis }: RailArrowProps) {
  const prominent = emphasis === 'prominent';
  return (
    <button
      type="button"
      aria-label={label}
      disabled={spent}
      onClick={() => {
        onActivate(direction);
      }}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 rounded-pill',
        'flex items-center justify-center',
        'cursor-pointer transition duration-(--duration-micro)',
        prominent
          ? [
              'size-rail-arrow bg-(image:--gradient-cta) text-white',
              'shadow-card-hover ring-2 ring-white/80',
              'hover:scale-105 hover:brightness-110',
            ]
          : [
              'size-touch bg-surface/90 text-ink shadow-card-hover backdrop-blur-sm',
              'hover:bg-surface',
            ],
        // Spent, not gone. A control that is removed at the end of a rail
        // moves the other one, and the pair stops reading as a fixed frame.
        // `invisible` and not opacity alone, so it is not a click target.
        'disabled:invisible disabled:opacity-0',
        // On the gutter, so the arrow sits on the active card's own edge
        // rather than out on the sliver of its neighbour.
        direction === -1
          ? prominent
            ? 'left-3 lg:left-6'
            : 'left-gutter ms-3'
          : prominent
            ? 'right-3 lg:right-6'
            : 'right-gutter me-3',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={cn(prominent ? 'size-6' : 'size-5', direction === 1 && '-scale-x-100')}
      >
        <path
          d="M15 5 8 12l7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroDotsProps {
  /** Headlines, used to label each dot with the slide it goes to. */
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Drives the fill: it runs only while autoplay is actually advancing. */
  isPlaying: boolean;
  intervalMs: number;
}

/**
 * Slide selection, and the countdown to the next advance.
 *
 * Each dot is a real `<button>` with a hit area padded out around the 6px
 * visual dot — a 6px tap target is the single most common carousel
 * accessibility failure.
 *
 * The area is 44px tall but only 24px wide, and that asymmetry is the point.
 * A 44px *square* per dot put 49px between one dot and the next however small
 * `--hero-dot-gap` was set, because the padding, not the gap, was doing the
 * spacing — the row read as four scattered dots rather than one control. 24px
 * is the WCAG 2.5.8 minimum and there is nothing above or below the row to
 * mis-hit, so the height keeps the full 44.
 * docs/responsive-strategy.md §5.
 *
 * The fill is the one place in the design system where a `width` is animated
 * rather than a transform. It is deliberate and it is bounded: the element is
 * 34px wide, so the layout cost of animating it is trivial, and a transform
 * would scale the rounded end into an ellipse. docs/design-guidelines.md §5.
 *
 * `animation-play-state` is set inline because it is genuinely runtime state —
 * the fill freezes where it is while the pointer rests on the carousel and
 * resumes from there, which no static class can express.
 */
export function HeroDots({ labels, activeIndex, onSelect, isPlaying, intervalMs }: HeroDotsProps) {
  return (
    <div
      // The slides above are `pointer-events-none` so that a drag anywhere on
      // the hero reaches the swipe handler; the dots have to opt back in.
      className="pointer-events-auto absolute inset-x-0 bottom-(--hero-dots-inset) z-10 flex justify-center gap-(--hero-dot-gap)"
    >
      {labels.map((label, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={label}
            type="button"
            onClick={() => {
              onSelect(index);
            }}
            aria-label={`Show slide ${String(index + 1)} of ${String(labels.length)}: ${label}`}
            aria-current={isActive ? 'true' : undefined}
            className="flex min-h-touch min-w-dot-target cursor-pointer items-center justify-center"
          >
            <span
              className={cn(
                'relative h-(--hero-dot-size) overflow-hidden rounded-pill transition-all duration-300',
                isActive
                  ? 'w-(--hero-dot-active-width) bg-white/30'
                  : 'w-(--hero-dot-size) bg-white/45',
              )}
            >
              {isActive && (
                <span
                  // Re-keyed per slide so the fill restarts from zero rather
                  // than resuming wherever the previous slide left it.
                  key={activeIndex}
                  className="anim-dot-fill absolute inset-y-0 left-0 bg-brand-red"
                  style={
                    {
                      '--slide-duration': `${String(intervalMs)}ms`,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                    } as StyleWithVars
                  }
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroProgressProps {
  /** One label per slide — the headline the dot goes to. */
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Drives the fill: it runs only while autoplay is actually advancing. */
  isPlaying: boolean;
  /** Dwell per slide, and the duration of one fill. */
  intervalMs: number;
}

/**
 * The progress dots, and the control that selects a slide. HERO-SPEC.md §6.
 *
 * A row of rails centred 34px up from the hero's bottom edge: 6px each, the
 * active one grown to 34px, with the autoplay countdown running across it in
 * red. **The active rail is the fainter of the two** — 0.30 against 0.45 — and
 * that is the spec's, not a slip: the red fill has to read against it, and a
 * bright rail under a bright fill shows no progress.
 *
 * > This replaced a full-bleed progress *bar* pinned to the section's base on
 * > 2026-08-27. That bar was `SAEL Home v2`'s; the dots are the approved
 * > designer build's and are what the spec specifies. `--color-hero-track`,
 * > `--spacing-hero-track`, `--gradient-hero-fill` and the `fxTrack` keyframe
 * > were the bar's and now have no consumer; they are marked in place rather
 * > than deleted, per design-guidelines §Change log. `--spacing-hero-progress`
 * > is the exception — it was the bar's height and is now the dot row's touch
 * > target, which is the same 44px doing the same job.
 *
 * **The button is 44px tall and the rail is drawn inside it, bottom-aligned.**
 * §6 makes the dot itself the `<button>`, which would be a 6px-tall control;
 * `docs/responsive-strategy.md` §Hero has always required the opposite —
 * "min 44px touch target (visual dot stays small, hit area padded)" — and this
 * is that, with `--spacing-hero-progress`.
 *
 * `items-end` rather than a centred rail is what keeps the spec exact: the
 * row's bottom edge is §6's 34px, so bottom-aligning the rail leaves it
 * precisely 34px up and grows the hit area *upward* into empty frame.
 * Centring it would have lifted every rail 19px off the spec's baseline.
 *
 * `animation-play-state` is set inline because it is genuinely runtime state:
 * the fill freezes where it is while the carousel is paused and resumes from
 * there, which no static class can express.
 */
export function HeroProgress({
  labels,
  activeIndex,
  onSelect,
  isPlaying,
  intervalMs,
}: HeroProgressProps) {
  const count = labels.length;

  return (
    <div
      // The slide layers above are `pointer-events-none` so that a drag
      // anywhere on the hero reaches the swipe handler; the dots opt back in.
      className={cn(
        'pointer-events-auto absolute inset-x-0 bottom-hero-dot-inset z-7',
        'flex justify-center gap-hero-dot-gap',
      )}
    >
      {labels.map((label, index) => {
        const isCurrent = index === activeIndex;

        return (
          <button
            key={label}
            type="button"
            onClick={() => {
              onSelect(index);
            }}
            aria-label={`Show slide ${String(index + 1)} of ${String(count)}: ${label}`}
            aria-current={isCurrent ? 'true' : undefined}
            className="flex h-hero-progress cursor-pointer items-end"
          >
            <span
              className={cn(
                'relative block h-hero-dot overflow-hidden rounded-pill',
                'transition-all duration-(--duration-dot) motion-reduce:transition-none',
                isCurrent ? 'w-hero-dot-active bg-hero-dot-active' : 'w-hero-dot bg-hero-dot',
              )}
            >
              {isCurrent && (
                <span
                  // Re-keyed per slide, which is what restarts the fill from
                  // empty rather than leaving it sat full where the last slide
                  // finished.
                  key={activeIndex}
                  className="anim-dot-fill absolute inset-y-0 left-0 block bg-hero-dot-fill"
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

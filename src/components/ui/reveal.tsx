'use client';

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils/cn';

/** Marks the document once the observer is live. See the note on `Reveal`. */
const READY_CLASS = 'reveal-ready';

/**
 * Fire as soon as any of the element crosses 10% up from the bottom edge,
 * rather than waiting for a fraction of it to be visible. A percentage
 * threshold behaves very differently for a 60px heading and a 500px image;
 * a margin treats them the same.
 */
const ROOT_MARGIN = '0px 0px -10% 0px';

/**
 * How far into the viewport an element must already be at mount to count as
 * "there before the user was", and skip the animation.
 *
 * Not simply `top < innerHeight`: a section resting exactly on the fold — which
 * is where every one of them starts on this page — would qualify, be revealed
 * synchronously, and never animate at all. It has to be *properly* in view.
 */
const ALREADY_SEEN = 0.75;

export interface RevealProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
  children: ReactNode;
  /**
   * Applied to the element itself, not to a wrapper — `Reveal` **is** the box.
   * So it can carry a section's own positioning and nothing extra lands in
   * the layout tree.
   */
  className?: string;
  /**
   * Stagger position. Each step delays the start by `--duration-reveal-step`,
   * so a heading can land before the paragraph under it.
   */
  order?: number;
}

/**
 * Fades its content up as it scrolls into view, once.
 *
 * **Once, not on every pass.** A reveal that replays every time the section
 * comes back is a distraction on a page that pages section by section, where
 * you cross the same boundary repeatedly. The observer disconnects on first
 * intersection.
 *
 * ---------------------------------------------------------------------------
 * The hidden state is applied by script, never by the server, and that is what
 * keeps the page readable when the script does not arrive.
 *
 * The obvious build — ship `opacity: 0` in the HTML and let JavaScript remove
 * it — means a browser that fails to run the bundle shows a blank section for
 * ever. Instead the CSS only hides an element once `<html>` carries
 * `reveal-ready`, which this component adds on mount. No script, no class, no
 * hiding: the content is simply visible, which is the correct outcome.
 *
 * An element already on screen at mount is marked revealed synchronously,
 * before the observer is wired, so it never flashes hidden for a frame.
 *
 * Motion is gated on `prefers-reduced-motion: no-preference` in the
 * stylesheet, so the whole effect is inert for anyone who has asked for less
 * of it. /CLAUDE.md §5.
 */
export function Reveal({ children, className, order = 0, ...props }: RevealProps) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;
    if (node === null) return;

    const root = document.documentElement;
    root.classList.add(READY_CLASS);

    const reveal = (): void => {
      node.dataset.reveal = 'shown';
    };

    // Already on screen — reveal now rather than waiting for the observer's
    // first callback, which would leave it hidden for a frame.
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight * ALREADY_SEEN && box.bottom > 0) {
      reveal();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={element}
      data-reveal="pending"
      style={{ '--reveal-order': order } as CSSProperties & Record<string, number>}
      className={cn('anim-reveal', className)}
      {...props}
    >
      {children}
    </div>
  );
}

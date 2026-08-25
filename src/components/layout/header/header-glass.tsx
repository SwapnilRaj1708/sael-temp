'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The header's background layer, and the only reason any of it is client code.
 *
 * As soon as the page leaves the top the bar firms up — a more opaque veil and
 * a heavier hairline — so it stays legible over photography. That is the whole
 * of this component's state.
 *
 * **The outer bar is `SAEL Home v2`'s, turned over into the light.** Its `#hdr`
 * rule is copied structurally rather than literally, because the design draws
 * a dark masthead and this site's stays light — the client's 2026-08-25 note
 * covers both halves of that. What came across is everything that is not a
 * hue: one flat translucent fill instead of the vertical gradient this used to
 * carry, at the design's 0.70 → 0.86; the hairline at its 0.09 → 0.13; its
 * `blur(22px) saturate(1.4)`; its `.3s` transition on background and border
 * colour; its 68px height; its threshold, which is 8px of scroll and not the
 * 80 this used to wait for.
 *
 * **And no shadow.** The design has none at any scroll position — the bar
 * separates itself with the hairline and the opacity step alone. `shadow-header`
 * went with it; it had no other consumer.
 *
 * It is deliberately its own file: `<Header>` stays a Server Component, and
 * the client bundle gains one boolean and a scroll listener rather than the
 * whole masthead.
 *
 * The listener is passive and does nothing but request a frame, so it can
 * never delay scrolling, and it re-renders at most once per frame — and in
 * practice only twice per page, since the state is a threshold rather than a
 * position.
 *
 * `backdrop-filter` lives here rather than on `<header>` on purpose. See the
 * note in header.tsx: on the header it would become the containing block for
 * the mobile drawer's `position: fixed`.
 */

/** `SAEL Home v2`'s own `scrollY > 8` — the bar reacts to leaving the top, not
 *  to having scrolled a distance. */
const THRESHOLD_PX = 8;

export function HeaderGlass() {
  const [scrolled, setScrolled] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      frame.current = null;
      setScrolled(window.scrollY > THRESHOLD_PX);
    };

    const onScroll = () => {
      frame.current ??= window.requestAnimationFrame(measure);
    };

    // Deep-linking into a page starts it mid-scroll, so measure once up front.
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 -z-10',
        'border-b',
        'transition-[background-color,border-color] duration-(--duration-header)',
        'motion-reduce:transition-none',
        // Without backdrop-filter the translucent veil would sit over raw page
        // content, so the fallback is a near-opaque background instead. It is
        // the base layer in both states and the veil paints over it, which is
        // why the two `bg-*` classes below are not in conflict.
        'bg-header-solid',
        'supports-[backdrop-filter]:backdrop-blur-[22px]',
        'supports-[backdrop-filter]:backdrop-saturate-[1.4]',
        scrolled
          ? 'border-header-hairline-scrolled supports-[backdrop-filter]:bg-header-veil-scrolled'
          : 'border-header-hairline supports-[backdrop-filter]:bg-header-veil',
      )}
    />
  );
}

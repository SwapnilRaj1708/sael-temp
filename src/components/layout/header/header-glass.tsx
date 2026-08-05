'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The header's background layer, and the only reason any of it is client code.
 *
 * Past ~80px of scroll the bar firms up — more opaque, deeper shadow — so it
 * stays legible over photography. That is the whole of this component's state.
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

const THRESHOLD_PX = 80;

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
        'border-b border-header-hairline',
        'transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none',
        // Without backdrop-filter the translucent gradient would sit over raw
        // page content, so the fallback is a near-opaque background instead.
        'bg-header-solid',
        'supports-[backdrop-filter]:bg-(image:--gradient-header)',
        'supports-[backdrop-filter]:backdrop-blur-[18px]',
        'supports-[backdrop-filter]:backdrop-saturate-[1.6]',
        scrolled ? 'shadow-header supports-[backdrop-filter]:bg-header-solid' : 'shadow-none',
      )}
    />
  );
}

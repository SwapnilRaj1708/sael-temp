import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';
import type { HeroSlide } from './types';

/** `style` that also carries custom properties, without an `any` cast. */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroHeadlineProps {
  slide: HeroSlide;
  isActive: boolean;
  /** Placement, from `<HeroCopy>` — §3e puts it on the heading itself. */
  className?: string;
}

/**
 * One slide's headline, revealed a word at a time. HERO-SPEC.md §3e.
 *
 * **Split on spaces, every word its own box**, because a `transform` has no
 * effect on a non-replaced inline box — staggering a word by `translateY`
 * needs that word to be an atomic inline. The gap between them is
 * `margin-right: 0.27em` on the word, per the spec, rather than a literal
 * space in the markup: `--spacing-hero-word-gap` is in `em`, so it tracks the
 * headline through its whole `clamp(32px, 3vw, 58px)` range.
 *
 * > The cost of the spec's margin over a real space is that selecting the
 * > headline copies it without the spaces. `aria-label` below keeps the
 * > *accessible* name whole, so screen readers are unaffected; it is
 * > selection and copy-paste that pay.
 *
 * **Plain white, per §3e's `color: #fff`.** The `SAEL Home v2` build gave each
 * headline a gradient-filled run — "clean energy" and the like, from
 * `--gradient-hero-word-1…4`. The spec's headline block specifies a flat
 * colour and its per-word split leaves nowhere for a multi-word run to hold a
 * single ramp, so the highlight is gone with it. Those four gradient tokens
 * have no consumer now; they are kept and marked, not deleted.
 *
 * Rendered as `h1` while the slide is showing and `p` otherwise — there is one
 * `h1` per page, and four headlines in four stacked slides would otherwise be
 * four. The inactive ones are also `aria-hidden` and `inert`, so they are out
 * of the accessibility tree and out of the tab order entirely.
 *
 * The pieces are presentational, so `aria-label` restores the headline to one
 * string rather than letting it be announced word by word.
 */
export function HeroHeadline({ slide, isActive, className }: HeroHeadlineProps) {
  const { headline } = slide;
  const words = headline.split(' ');

  const Heading = isActive ? 'h1' : 'p';

  return (
    <Heading
      // Remounts when the slide takes over, which is what re-keys the word
      // spans and replays the reveal — §3e requires exactly that. Without it
      // the animation would run once at page load, on all four headlines at
      // once, three of them invisible.
      key={isActive ? 'active' : 'idle'}
      aria-label={headline}
      aria-hidden={!isActive}
      inert={!isActive}
      className={cn(
        'm-0 text-left text-hero text-white',
        // globals.css sets `text-wrap: balance` on every heading in the base
        // layer. §3e asks for `pretty`, and a utility outranks base.
        '[text-wrap:pretty]',
        '[text-shadow:var(--shadow-hero-text)]',
        // Below lg the headline is one column of a bottom-anchored stack and
        // takes the site's own headline measure; from lg its width is the
        // slide's own `textW` and the cap has to come off.
        'max-w-(--hero-measure) lg:max-w-none',
        className,
      )}
    >
      {words.map((word, index) => (
        <span
          key={`${slide.id}-${String(index)}`}
          style={{ '--anim-index': index } as StyleWithVars}
          className={cn(
            'mr-hero-word-gap inline-block',
            // globals.css sets `overflow-wrap: break-word` on every heading.
            // That is right for a heading and wrong for a box holding exactly
            // one word — it permits a break mid-word.
            'whitespace-nowrap',
            isActive && 'anim-word-in',
          )}
        >
          {word}
        </span>
      ))}
    </Heading>
  );
}

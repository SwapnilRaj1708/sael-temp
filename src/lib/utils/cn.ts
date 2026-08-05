import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The project's font-size scale, as it appears in a utility class.
 *
 * Every `--text-*` token in src/styles/theme.css. Keep the two in step: a
 * token missing from this list is a token `cn()` will silently discard.
 */
const FONT_SIZES = [
  'hero',
  'h2',
  'h3',
  'stat',
  'milestone',
  'sdg-num',
  'goal-title',
  'body',
  'body-sm',
  'label',
  'nav',
  'eyebrow',
  'cta',
  'badge',
  'tile-title',
  'tile-figure',
  'tile-note',
  'tile-marker',
  'footprint-title',
  'plaque-title',
] as const;

/**
 * tailwind-merge, taught the theme's own type scale.
 *
 * **Why this is not optional.** tailwind-merge resolves conflicts by sorting
 * classes into groups, and it recognises `text-*` as either a font size or a
 * text colour by matching against Tailwind's *default* scale. Every size in
 * this design system is a custom `@theme` token — `text-hero`, `text-h2`,
 * `text-badge` — so none of them match, and each one falls through to the
 * colour group instead. The moment a size and a colour appear together, they
 * look like two colours and the later one wins:
 *
 * ```
 * cn('text-hero text-white')   // → 'text-white'      the size is gone
 * cn('text-badge text-white')  // → 'text-white'
 * cn('text-h3 text-ink')       // → 'text-ink'
 * ```
 *
 * There is no error and no warning — the class simply is not in the output,
 * and the element renders at the inherited body size. That shipped in FE-02
 * and was found in FE-04, in the hero headline (58px rendering at 16px), the
 * date badge and the empty state.
 *
 * Listing the sizes explicitly puts them in the font-size group, where they
 * no longer collide with a colour. Note that the entries are exact: `body` is
 * a size (`--text-body`) while `body-base`, `body-soft`, `body-muted` and
 * `body-on-dark` are colours (`--color-body-*`), and matching is by whole
 * suffix, so the two namespaces stay separate.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZES] }],
    },
  },
});

/** Compose conditional class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

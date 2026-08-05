import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The small uppercase label above a section heading, with the brand gradient
 * clipped to the letterforms.
 *
 * Rendered as a `<p>` and never as a heading. It reads like a kicker, but
 * marking it up as one would put an empty level in the document outline
 * between the section heading and whatever precedes it.
 *
 * The gradient-clip and its no-support fallback live in the `gradient-text`
 * utility — see globals.css. docs/design-guidelines.md §1.
 */
export interface EyebrowProps extends ComponentPropsWithRef<'p'> {
  /**
   * `gradient` is the prototype's red→blue clipped to the letterforms.
   * `accent` is the flat purple the client's own design uses. Both are in the
   * system because both are in use — the homepage sections built from
   * `SAEL - New Website.pdf` take `accent`.
   */
  tone?: 'gradient' | 'accent';
}

export function Eyebrow({ tone = 'gradient', className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow uppercase',
        tone === 'gradient' ? 'bg-(image:--gradient-eyebrow) gradient-text' : 'text-eyebrow-accent',
        // A tracked uppercase run reads as one word to a screen reader unless
        // it is given somewhere to breathe; the width also keeps the gradient
        // from stretching across the whole column on a short label.
        'w-fit',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

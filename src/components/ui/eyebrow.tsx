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
export type EyebrowTone = 'gradient' | 'accent' | 'bright' | 'deep';

/**
 * Which ramp is clipped to the letterforms.
 *
 * `accent` is the one flat tone in the set and stays a colour utility;
 * everything else is a gradient token consumed through `gradient-text`.
 *
 * `bright` and `deep` are the same travel at two weights — one built to sit on
 * the near-black ground, one darkened to carry on paper. They are a pair
 * because the sections they label alternate between those two grounds, and a
 * label that is legible on one is illegible on the other.
 */
const TONE_CLASS: Record<EyebrowTone, string> = {
  gradient: 'bg-(image:--gradient-eyebrow) gradient-text',
  accent: 'text-eyebrow-accent',
  bright: 'bg-(image:--gradient-eyebrow-bright) gradient-text',
  deep: 'bg-(image:--gradient-eyebrow-deep) gradient-text',
};

export interface EyebrowProps extends ComponentPropsWithRef<'p'> {
  /**
   * `gradient` is the prototype's red→blue. `accent` is the flat purple the
   * client's earlier design used. `bright` and `deep` are `SAEL Home v2`'s
   * pair, on the black ground and on paper respectively. All four are in the
   * system because all four are in use.
   */
  tone?: EyebrowTone;
}

export function Eyebrow({ tone = 'gradient', className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow uppercase',
        TONE_CLASS[tone],
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

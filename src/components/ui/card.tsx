import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import { TileShape } from '@/components/ui/tile-shape';
import { cn } from '@/lib/utils/cn';

/**
 * Two surfaces, one file. docs/design-guidelines.md §4.
 *
 * `news` — white, hairline border, lifts 5px on hover.
 * `tile` — the chamfered business-tile surface, lifts 8px on hover.
 *
 * The lift is a `translate`, not a margin or a `top`, so it composites without
 * touching layout. `motion-reduce` drops it: a card that jumps under the
 * pointer is exactly what that preference is asking about.
 *
 * `focus-within` mirrors every `hover`, so a card whose link is reached by
 * keyboard lifts the same way it does under a mouse.
 * docs/responsive-strategy.md §5.
 *
 * The `tile` variant is two elements deep for a reason: its elevation is a
 * `drop-shadow` filter, and filters are applied *before* `clip-path` clips.
 * On the clipped element the shadow would be cut away with the corner, so it
 * lives on the wrapper and the chamfer lives on the child.
 */
const card = cva('relative transition duration-(--duration-card) motion-reduce:transform-none', {
  variants: {
    variant: {
      news: 'bg-surface border-border rounded-card overflow-hidden border',
      tile: 'drop-shadow-tile',
    },
    interactive: { true: '', false: '' },
  },
  compoundVariants: [
    {
      variant: 'news',
      interactive: true,
      class: 'hover:shadow-card-hover hover:-translate-y-[5px] focus-within:-translate-y-[5px]',
    },
    {
      variant: 'tile',
      interactive: true,
      class:
        'hover:drop-shadow-tile-hover focus-within:drop-shadow-tile-hover hover:-translate-y-2 focus-within:-translate-y-2',
    },
  ],
  defaultVariants: { variant: 'news', interactive: true },
});

export interface CardProps extends ComponentPropsWithRef<'div'>, VariantProps<typeof card> {}

export function Card({ variant = 'news', interactive, className, children, ...props }: CardProps) {
  const classes = cn(card({ variant, interactive }), className);

  if (variant === 'tile') {
    return (
      <div className={classes} {...props}>
        <TileShape className="h-full w-full">{children}</TileShape>
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

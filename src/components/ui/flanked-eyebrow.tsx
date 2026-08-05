import { Eyebrow } from '@/components/ui/eyebrow';
import { cn } from '@/lib/utils/cn';

export interface FlankedEyebrowProps {
  children: string;
  className?: string;
}

/**
 * A centred section label with a short gradient rule either side.
 *
 * The client's design uses this as the heading for every centred section —
 * Business Portfolio first, then Our Goals and In the News. It was written
 * inline in the first of those; it is a primitive now because three sections
 * having their own copy of it is exactly how the three quietly drift apart.
 *
 * The rules are decorative and mirrored, so the pair reads as one gradient
 * running outward from the label rather than as two lines.
 */
export function FlankedEyebrow({ children, className }: FlankedEyebrowProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span aria-hidden="true" className="h-rule-h w-rule-w bg-(image:--gradient-rule-left)" />
      <Eyebrow tone="accent">{children}</Eyebrow>
      <span aria-hidden="true" className="h-rule-h w-rule-w bg-(image:--gradient-rule-right)" />
    </div>
  );
}

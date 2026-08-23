import { Eyebrow, type EyebrowTone } from '@/components/ui/eyebrow';
import { cn } from '@/lib/utils/cn';

/**
 * The rule beside the label takes the label's own ramp, so the two read as one
 * object. The two `gradient-rule-*` tokens are mirrored halves of a single
 * travel and only make sense in the `both` arrangement; the v2 tones are
 * directional already and are used as-is on the leading side.
 */
const RULE_CLASS: Record<EyebrowTone, { start: string; end: string }> = {
  gradient: { start: 'bg-(image:--gradient-rule-left)', end: 'bg-(image:--gradient-rule-right)' },
  accent: { start: 'bg-(image:--gradient-rule-left)', end: 'bg-(image:--gradient-rule-right)' },
  bright: {
    start: 'bg-(image:--gradient-eyebrow-bright)',
    end: 'bg-(image:--gradient-eyebrow-bright)',
  },
  deep: { start: 'bg-(image:--gradient-eyebrow-deep)', end: 'bg-(image:--gradient-eyebrow-deep)' },
};

export interface FlankedEyebrowProps {
  children: string;
  /**
   * `both` is the centred label with a rule either side. `leading` is `SAEL
   * Home v2`'s: one short rule, then the label, set against the left gutter
   * like everything else in that design.
   */
  rules?: 'both' | 'leading';
  /** Passed straight to {@link Eyebrow}. Pick for the ground underneath. */
  tone?: EyebrowTone;
  className?: string;
}

/**
 * A section label with a short gradient rule beside it.
 *
 * Every labelled section on the homepage uses this — Business Portfolio,
 * Solutions, Our Goals, In the News. It was written inline in the first of
 * them; it is a primitive because four sections having their own copy of it is
 * exactly how the four quietly drift apart.
 *
 * In the `both` arrangement the rules are mirrored, so the pair reads as one
 * gradient running outward from the label rather than as two lines. In
 * `leading` there is only the left one and no mirroring to do.
 */
export function FlankedEyebrow({
  children,
  rules = 'both',
  tone = 'accent',
  className,
}: FlankedEyebrowProps) {
  const rule = RULE_CLASS[tone];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span aria-hidden="true" className={cn('h-rule-h w-rule-w shrink-0', rule.start)} />
      <Eyebrow tone={tone}>{children}</Eyebrow>
      {rules === 'both' && (
        <span aria-hidden="true" className={cn('h-rule-h w-rule-w shrink-0', rule.end)} />
      )}
    </div>
  );
}

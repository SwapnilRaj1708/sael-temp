import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The site's action primitive.
 *
 * Renders `<Link>` when given an `href`, a plain `<a>` when that href leaves
 * the site, and `<button>` when given none. **Never a `<div>` with an
 * `onClick`** — that is not focusable, not activated by Enter or Space, and
 * not announced as anything.
 *
 * The primitive has no idea what "Know More" means. Every label is a prop.
 * /CLAUDE.md §5.
 *
 * docs/design-guidelines.md §4.
 */
const button = cva(
  [
    'inline-flex items-center justify-center gap-2 text-center',
    'text-cta uppercase',
    'cursor-pointer transition duration-(--duration-micro)',
    // The visual can be shorter than the touch target; the hit area cannot.
    // docs/responsive-strategy.md §5.
    'min-h-touch',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        /** The gradient CTA. Square by design — --radius-none. */
        primary: 'rounded-none bg-(image:--gradient-cta) text-white hover:brightness-[1.08]',
        /** Text plus an underline on hover. For a secondary action. */
        ghost:
          'rounded-none text-brand-red hover:text-accent-hover hover:underline underline-offset-4',
        /* On a dark background the shared blue focus ring has almost no
         * contrast against the surface, so this variant brings its own. */
        onDark:
          'rounded-none border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white',
      },
      size: {
        sm: 'px-4 py-2 lg:px-5 lg:py-2.5',
        /* 10px/24px → 12px/32px. The prototype's 33px is rounded to the
         * spacing scale; a 1px difference is not worth an arbitrary value. */
        md: 'px-6 py-2.5 lg:px-8 lg:py-3',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
  },
);

type ButtonVariants = Omit<VariantProps<typeof button>, 'fullWidth'> & {
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
};

export type ButtonProps = ButtonVariants &
  (
    | ({ href: string } & Omit<ComponentPropsWithRef<'a'>, 'href' | 'className' | 'children'>)
    | ({ href?: undefined } & Omit<ComponentPropsWithRef<'button'>, 'className' | 'children'>)
  );

/** Anything that is not a same-origin path gets a real anchor, not a Link. */
function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href);
}

export function Button({ variant, size, fullWidth, className, children, ...props }: ButtonProps) {
  const classes = cn(button({ variant, size, fullWidth }), className);

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props;

    if (isExternal(href)) {
      return (
        <a
          href={href}
          // Applied here rather than left to the caller: `noopener` closes a
          // real cross-origin attack, and forgetting it is silent.
          rel={anchorProps.target === '_blank' ? 'noopener noreferrer' : anchorProps.rel}
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  // `href` is present on the type but `undefined` in this branch, so React
  // drops it. Destructuring it out just to discard it reads worse.
  const { type = 'button', ...buttonProps } = props;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

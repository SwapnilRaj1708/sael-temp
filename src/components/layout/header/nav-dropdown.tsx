'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RefObject } from 'react';
import type { NavItem } from '@/components/layout/header/nav-config';
import { cn } from '@/lib/utils/cn';

/**
 * The panel under a desktop nav trigger.
 *
 * Two layouts, chosen by whether the first child carries an image: Businesses
 * gets thumbnail cards, everything else a plain link list. That is a property
 * of the data, not a prop — `nav-config.ts` decides by supplying images or
 * not, so the two can never disagree.
 *
 * Rendered only while open. A `hidden` panel keeps its links in the tab order
 * in some browsers, which sends focus somewhere invisible.
 */
export interface NavDropdownProps {
  item: NavItem;
  id: string;
  /** Focused when the panel opens via keyboard. */
  firstLinkRef: RefObject<HTMLAnchorElement | null>;
  onNavigate: () => void;
}

export function NavDropdown({ item, id, firstLinkRef, onNavigate }: NavDropdownProps) {
  const children = item.children ?? [];
  const withImages = children.some((child) => child.image !== undefined);

  return (
    <div
      id={id}
      className={cn(
        'absolute top-full left-0 z-10 pt-3',
        // The trigger and the panel do not touch. Without this padded bridge,
        // the pointer crosses a dead gap on the way down and the mouse-leave
        // timer starts for no reason.
        'before:absolute before:inset-x-0 before:top-0 before:h-3 before:content-[""]',
      )}
    >
      <div
        className={cn(
          'rounded-card border border-border bg-surface p-4 shadow-card-hover',
          withImages ? 'grid w-[44rem] grid-cols-2 gap-4' : 'flex w-64 flex-col',
        )}
      >
        {children.map((child, index) => {
          if (child.href === undefined) return null;

          const isFirst = index === 0;

          return withImages ? (
            <Link
              key={child.href}
              href={child.href}
              ref={isFirst ? firstLinkRef : undefined}
              onClick={onNavigate}
              className={cn(
                'group/card overflow-hidden rounded-card',
                'transition-colors duration-(--duration-micro) hover:bg-surface-alt',
              )}
            >
              {child.image !== undefined && (
                <Image
                  src={child.image.src}
                  alt={child.image.alt}
                  sizes="220px"
                  className="aspect-[16/10] w-full rounded-card object-cover"
                />
              )}
              <span className="block px-1 py-3 text-nav text-ink group-hover/card:text-accent-hover">
                {child.label}
              </span>
            </Link>
          ) : (
            <Link
              key={child.href}
              href={child.href}
              ref={isFirst ? firstLinkRef : undefined}
              onClick={onNavigate}
              className={cn(
                'rounded-card px-3 py-3 text-nav text-nav-link',
                'transition-colors duration-(--duration-micro)',
                'hover:bg-surface-alt hover:text-accent-hover',
              )}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

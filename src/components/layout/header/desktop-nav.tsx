'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { NavDropdown } from '@/components/layout/header/nav-dropdown';
import { isNavItemActive, NAV_ITEMS } from '@/components/layout/header/nav-config';
import { cn } from '@/lib/utils/cn';

/**
 * The inline navigation at lg and above.
 *
 * A client component, which `docs/responsive-strategy.md` §6 asks to be
 * justified: it needs `usePathname()` for the active-route underline (a root
 * layout is not re-rendered on client navigation, so the path cannot come from
 * the server), and it owns hover-intent and keyboard state for the dropdowns.
 * It renders no content of its own — the nav data is a static import, so this
 * costs the bundle the interaction logic and nothing else.
 *
 * Hover intent: open after 120ms, close after 200ms. The close delay is the
 * important one — without it, the pointer travelling diagonally from trigger
 * to panel clips the gap and the menu shuts under the cursor.
 */

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 200;

export function DesktopNav() {
  const pathname = usePathname();
  const baseId = useId();
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  /** Set when the keyboard opened the panel, so focus moves but hover does not steal it. */
  const focusOnOpen = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(
    (label: string) => {
      clearTimer();
      timer.current = setTimeout(() => {
        setOpenLabel(label);
      }, OPEN_DELAY_MS);
    },
    [clearTimer],
  );

  const scheduleClose = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => {
      setOpenLabel(null);
    }, CLOSE_DELAY_MS);
  }, [clearTimer]);

  const close = useCallback(
    (returnFocusTo?: string) => {
      clearTimer();
      setOpenLabel(null);
      if (returnFocusTo !== undefined) triggerRefs.current.get(returnFocusTo)?.focus();
    },
    [clearTimer],
  );

  // A navigation should never leave a menu hanging open over the new page.
  //
  // Adjusted during render rather than in an effect: React re-runs this
  // component before touching the DOM, so the menu is never painted open on
  // the new route. An effect would close it one frame late, which is a visible
  // flash. https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenLabel(null);
  }

  // Cancelling the pending timer is a side effect, so it stays in an effect —
  // otherwise a hover that started just before the click would reopen the
  // menu on the page the user just navigated to.
  useEffect(() => {
    clearTimer();
  }, [pathname, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  // Move focus into the panel only when the keyboard opened it.
  useEffect(() => {
    if (openLabel !== null && focusOnOpen.current) {
      focusOnOpen.current = false;
      firstLinkRef.current?.focus();
    }
  }, [openLabel]);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex list-none items-center gap-[42px]">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(item, pathname);
          const hasChildren = (item.children?.length ?? 0) > 0;
          const panelId = `${baseId}-${item.label}`;
          const isOpen = openLabel === item.label;

          const linkClasses = cn(
            'text-nav text-nav-link relative inline-flex items-center gap-1',
            'min-h-touch transition-colors duration-(--duration-micro)',
            'hover:text-accent-hover',
            // The active marker is a pseudo-element rather than a border, so
            // it does not add height and shift the row.
            active &&
              'text-accent-hover after:bg-accent-hover after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:content-[""]',
          );

          if (!hasChildren && item.href !== undefined) {
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={linkClasses}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => {
                scheduleOpen(item.label);
              }}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current.set(item.label, node);
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={isOpen ? panelId : undefined}
                className={cn(linkClasses, 'cursor-pointer')}
                onClick={() => {
                  clearTimer();
                  setOpenLabel(isOpen ? null : item.label);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    close(item.label);
                    return;
                  }
                  if (event.key === 'ArrowDown' || (event.key === 'Enter' && !isOpen)) {
                    event.preventDefault();
                    clearTimer();
                    focusOnOpen.current = true;
                    setOpenLabel(item.label);
                  }
                }}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform duration-(--duration-micro)',
                    'motion-reduce:transition-none',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                  focusable="false"
                />
              </button>

              {isOpen && (
                <div
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') close(item.label);
                  }}
                >
                  <NavDropdown
                    item={item}
                    id={panelId}
                    firstLinkRef={firstLinkRef}
                    onNavigate={() => {
                      close();
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

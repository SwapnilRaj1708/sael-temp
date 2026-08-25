import { DesktopNav } from '@/components/layout/header/desktop-nav';
import { HeaderCta } from '@/components/layout/header/header-cta';
import { HeaderGlass } from '@/components/layout/header/header-glass';
import { Logo } from '@/components/layout/header/logo';
import { MobileNav } from '@/components/layout/header/mobile-nav';
import { Container } from '@/components/ui/container';

/**
 * The fixed masthead. A flat 68px at every width — `SAEL Home v2`'s own bar
 * height, from `--spacing-header`, the same token that offsets `<main>` and
 * sets `scroll-padding-top`. It stepped up to 84px at `lg` until 2026-08-25;
 * the design draws one height, so there is one value.
 *
 * A Server Component. Only the two nav components are client, and only because
 * they need `usePathname()` and interaction state.
 *
 * **The glass is painted on an inner layer, not on `<header>` itself, and that
 * is load-bearing.** `backdrop-filter` makes an element a containing block for
 * `position: fixed` descendants — so with the filter on the header, the mobile
 * drawer's `fixed inset-0` would resolve against the 64px-tall bar instead of
 * the viewport, and the drawer would render as a sliver across the top. Moving
 * the filter one level down costs a `<div>` and removes the trap entirely.
 *
 * docs/design-guidelines.md §4, docs/features/03-app-shell-header-footer.md §2.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <HeaderGlass />

      <Container>
        {/* Logo, then the nav taking the space between, then the button. The
            nav is `flex-1` so it centres against the bar rather than against
            whatever the logo and button happen to measure. */}
        <div className="flex h-header items-center gap-4">
          <Logo priority />
          <DesktopNav />
          {/* `ml-auto` and not `justify-between` on the row: below `lg` the nav
              is `display: none` and contributes no width, so with
              `justify-between` there were only two items and the trigger sat
              against the logo. This pushes the right-hand group out at every
              width, whether or not the nav is there to do it. */}
          <div className="ml-auto flex items-center gap-3">
            <HeaderCta />
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

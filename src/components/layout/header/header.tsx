import { DesktopNav } from '@/components/layout/header/desktop-nav';
import { HeaderGlass } from '@/components/layout/header/header-glass';
import { Logo } from '@/components/layout/header/logo';
import { MobileNav } from '@/components/layout/header/mobile-nav';
import { Container } from '@/components/ui/container';

/**
 * The fixed masthead. 64px, rising to 84px at lg — both from
 * `--spacing-header`, the same token that offsets `<main>` and sets
 * `scroll-padding-top`.
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
        <div className="flex h-header items-center justify-between gap-4">
          <Logo priority />
          <DesktopNav />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/sael-logo.png';
import { SOCIAL_ICONS } from '@/components/icons/social';
import { FooterLinks } from '@/components/layout/footer/footer-links';
import { Container } from '@/components/ui/container';
import { siteConfig, TODO_CONTENT } from '@/lib/config/site';
import { LEGAL_LINKS, SOCIAL_LINKS } from '@/lib/content/static/footer';
import { cn } from '@/lib/utils/cn';

/**
 * The site footer. A Server Component; only the accordions inside
 * `<FooterLinks>` are client.
 *
 * Two deviations from `docs/features/03-app-shell-header-footer.md` §3, both
 * decided on 2026-08-04 and recorded in docs/asset-inventory.md:
 *
 *  - **The logo sits on a white plate.** No white variant of the mark exists,
 *    and the colour logo is a purple→red gradient over a black strapline, so
 *    it cannot go straight onto `--color-footer-bg`. Rather than set the
 *    wordmark as text — which loses the mark entirely — the real artwork gets
 *    its own light surface. Decided with the client on 2026-08-05.
 *  - **No background image.** `footer-background.jpg` was not in the client
 *    handover, so the flat token colour stands in. `responsive-strategy.md` §4
 *    already sanctions this below md; it now applies at every width, which
 *    also means the copy's contrast is predictable rather than dependent on
 *    an image crop.
 *
 * The corporate block is present on the live site but not the prototype. §3
 * says include it, and it is legally useful.
 */
export function Footer() {
  // Computed per render, never hardcoded — a stale copyright year is a small
  // but very visible sign of an unmaintained site.
  const year = new Date().getFullYear();
  const hasEmail = siteConfig.email !== TODO_CONTENT;

  return (
    <footer className="bg-footer-bg text-white">
      <Container>
        <div className="py-section-y">
          {/* Top row — wordmark and socials */}
          <div className="mb-flow flex flex-col items-center gap-flow md:flex-row md:items-end md:justify-between">
            {/* The colour logo on a white plate, rather than the wordmark set
                as text. The artwork is a purple→red gradient over a black
                strapline and cannot sit on --color-footer-bg directly; giving
                it its own light surface is what the client asked for and is
                also how the mark is meant to be used. The strapline is baked
                into the artwork, so it is not repeated in text. */}
            <Link
              href="/"
              className="inline-flex rounded-card bg-surface px-5 py-3 shadow-card-hover"
              aria-label={`${siteConfig.name} — home`}
            >
              <Image
                src={logo}
                alt={siteConfig.name}
                sizes="170px"
                className="h-9 w-auto lg:h-11"
              />
            </Link>

            {SOCIAL_LINKS.length > 0 && (
              <ul className="flex list-none items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform];
                  return (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'rounded-pill bg-white text-footer-icon',
                          'inline-flex size-touch items-center justify-center',
                          'transition-transform duration-(--duration-micro)',
                          'hover:-translate-y-(--lift-social) focus-visible:-translate-y-(--lift-social)',
                          'motion-reduce:transform-none',
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="sr-only">{social.label} — opens in a new tab</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <FooterLinks />

          {/* Corporate block */}
          <address className="mt-flow text-body-sm text-on-dark-soft not-italic">
            <span className="block font-bold text-white">{siteConfig.legalName}</span>
            <span className="block">Registered Office: {siteConfig.registeredOffice}</span>
            <span className="block">CIN: {siteConfig.cin}</span>
            <span className="block">
              Telephone:{' '}
              <a
                href={`tel:${siteConfig.telephone.replace(/[^\d+]/g, '')}`}
                className="hover:text-white"
              >
                {siteConfig.telephone}
              </a>
              {' · '}
              Email:{' '}
              {hasEmail ? (
                // Plain mailto. The legacy site Cloudflare-obfuscates this;
                // obfuscation does not stop scrapers and does break assistive
                // technology. features/03 §3.
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              ) : (
                siteConfig.email
              )}
            </span>
          </address>

          <hr className="mt-flow border-hairline-dark" />

          {/* Legal bar */}
          <div className="mt-stack flex flex-col items-center gap-stack text-body-sm text-on-dark-soft md:flex-row md:justify-between">
            <p>
              © {year} {siteConfig.name} | All Rights Reserved
            </p>
            <ul className="flex list-none flex-wrap items-center justify-center gap-x-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-touch items-center hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

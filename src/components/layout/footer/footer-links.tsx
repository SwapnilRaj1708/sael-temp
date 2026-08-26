import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { FOOTER_GROUPS, type FooterLink } from '@/lib/content/static/footer';
import { cn } from '@/lib/utils/cn';

/**
 * The footer's link grid: four columns at md and up, accordions below.
 *
 * **Both are rendered, and CSS picks one.** That is the pattern
 * `docs/responsive-strategy.md` §4 mandates for the vision timeline, and the
 * reasoning carries: choosing with a JS media query means the server renders
 * one and the client swaps to the other, which flashes. Rendering both keeps
 * everything server-rendered and correct on first paint. The hidden branch is
 * `display: none`, so screen readers encounter each link once, not twice.
 *
 * The cost is sixteen duplicated anchors in the HTML. That is a few hundred
 * bytes against a guaranteed-correct first paint.
 */

function FooterAnchor({ link }: { link: FooterLink }) {
  const className = cn(
    'text-body-sm inline-flex min-h-touch items-center text-body-on-dark',
    'transition-colors duration-(--duration-micro) hover:text-white',
  );

  // /career/ is a route handler that redirects off-site, so it is a plain
  // anchor — there is no client-side navigation to prefetch.
  return link.external === true ? (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function FooterLinks() {
  return (
    <nav aria-label="Footer">
      {/* md and up — four columns */}
      <div className="hidden gap-gap-grid md:grid md:grid-cols-2 lg:grid-cols-4">
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="mb-stack text-label text-white">{group.title}</h2>
            <ul className="flex list-none flex-col">
              {group.links.map((link) => (
                <li key={link.href}>
                  <FooterAnchor link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* below md — accordions, collapsed by default */}
      <div className="md:hidden">
        <Accordion allowMultiple>
          {FOOTER_GROUPS.map((group) => (
            <AccordionItem
              key={group.title}
              value={group.title}
              headingAs="h2"
              title={
                <span key={group.title} className="text-label">
                  {group.title}
                </span>
              }
              className="border-hairline-dark"
              triggerClassName="text-white hover:text-body-on-dark"
            >
              <ul className="flex list-none flex-col">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </nav>
  );
}

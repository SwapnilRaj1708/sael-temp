import Image from 'next/image';
import type { NewsItem } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { CardRail } from '@/components/ui/card-rail';
import { Container } from '@/components/ui/container';
import { FlankedEyebrow } from '@/components/ui/flanked-eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { DateBadge } from '@/components/ui/date-badge';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_NEWS_CARD } from '@/lib/utils/image-sizes';

export interface NewsCarouselProps {
  title: string;
  items: NewsItem[];
  snap?: boolean;
}

/**
 * "In the News" — press items on a paging rail. docs/features/04 §11.
 *
 * The items come from the repository, never from this file and never from the
 * page's static content: they are the one surface on the homepage that changes
 * without a deploy. docs/content-model.md §1. An empty list renders nothing at
 * all — a heading over an empty rail is worse than no section.
 *
 * Card anatomy, and the two rules that make a row of them read as a row:
 *
 *  - **Every card is the same height**, whatever its title runs to. The rail
 *    stretches its children and the card is a column, so the parts that vary
 *    take the slack instead of the card's outline.
 *  - **The title clamps to three lines.** These headlines range from eight
 *    words to thirty-five, and left alone the tallest one sets the height of
 *    the entire rail. `line-clamp` truncates visually while leaving the full
 *    string in the accessibility tree and in the page's text, so a screen
 *    reader and a search engine both still get the whole headline.
 *
 * "Read More" is pushed to the base with `mt-auto`, so the links line up
 * across the row rather than floating at the foot of each title.
 *
 * A Server Component apart from the rail's arrows.
 */
export function NewsCarousel({ title, items, snap = false }: NewsCarouselProps) {
  if (items.length === 0) return null;

  return (
    <Section
      data-snap-section
      fullBleed
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div className="flex w-full flex-col gap-flow">
        <Container className="flex justify-center">
          {/* The same flanked label the Business Portfolio and Our Goals use,
              so the three centred sections read as a set. */}
          <Reveal order={0}>
            <FlankedEyebrow>{title}</FlankedEyebrow>
          </Reveal>
        </Container>

        <CardRail
          label="SAEL in the news"
          previousLabel="Previous news"
          nextLabel="Next news"
          arrows="prominent"
        >
          {items.map((item, index) => (
            <li key={item.id} className="w-news-card shrink-0 snap-start">
              {/* 2, 3, 4 … — the label is 0 and 1 is skipped, so the cards
                  cascade in after it rather than alongside it. */}
              <Reveal order={index + 2} className="h-full">
                <article
                  className={cn(
                    'group relative flex h-full flex-col border border-border bg-surface',
                    'overflow-hidden rounded-xs',
                    // The whole lift is one transition on the card: raise,
                    // deepen the shadow, warm the border. Small enough that the
                    // layout is unchanged — the design is the design — but it
                    // answers the pointer, which is what was missing.
                    'transition duration-(--duration-card)',
                    'hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-card-hover',
                    'focus-within:-translate-y-1 focus-within:shadow-card-hover',
                    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                  )}
                >
                  <div className="relative aspect-(--aspect-news-thumb) w-full overflow-hidden bg-surface-deep">
                    {item.imageUrl !== null && (
                      <Image
                        // A CMS URL, not a bundled import — hence the plain
                        // <Image> rather than <MediaFrame>, which takes a
                        // StaticImageData. The card keeps its box either way.
                        src={item.imageUrl}
                        alt=""
                        fill
                        sizes={SIZES_NEWS_CARD}
                        className="object-cover transition duration-(--duration-reveal) group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-stack p-4">
                    <DateBadge date={item.publishedAt} variant="pill" />

                    {/* `line-clamp-3` needs no `overflow-hidden` of its own — it
                      is `-webkit-box` clamping, which already hides the
                      overflow, and adding one would clip the focus ring on the
                      link below. */}
                    <h3 className="line-clamp-3 text-body-sm font-bold transition-colors duration-(--duration-micro)">
                      {item.title}
                    </h3>

                    {/* `flush` so the label's left edge lines up with the date
                      chip and the headline above it, and `quiet` so it reads
                      as ink until the pointer arrives. */}
                    <Button
                      href={item.href}
                      variant="quiet"
                      size="flush"
                      className="mt-auto after:absolute after:inset-0 after:content-['']"
                    >
                      {/* The visible label is generic, so the accessible name
                        carries the headline. "Read More" repeated six times is
                        a list of identical links to a screen-reader user. */}
                      <span className="sr-only">Read more: {item.title}</span>
                      <span aria-hidden="true" className="inline-flex items-center gap-1.5">
                        Read More
                        {/* Slides on hover. Decorative — the label already says
                          what the control does. */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                          className="size-4 transition-transform duration-(--duration-micro) group-hover:translate-x-1 motion-reduce:transition-none"
                        >
                          <path
                            d="M5 12h13m0 0-5-5m5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </CardRail>
      </div>
    </Section>
  );
}

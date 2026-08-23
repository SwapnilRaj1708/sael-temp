import Image from 'next/image';
import type { NewsItem } from '@/lib/content';
import { ArrowGlyph } from '@/components/ui/arrow-glyph';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { FlankedEyebrow } from '@/components/ui/flanked-eyebrow';
import { Rail } from '@/components/ui/rail/rail';
import { RailArrows } from '@/components/ui/rail/rail-arrows';
import { RailTrack } from '@/components/ui/rail/rail-track';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { formatDate, toDateTimeAttribute } from '@/lib/utils/format-date';
import { SIZES_NEWS_CARD } from '@/lib/utils/image-sizes';

export interface NewsCarouselProps {
  title: string;
  items: NewsItem[];
  snap?: boolean;
}

/**
 * "In the News" — press items on a paging rail. docs/features/04 §11, rebuilt
 * to `SAEL Home v2`.
 *
 * **The card lost its box.** It was a bordered, rounded panel with a date chip
 * over a 16:10 thumbnail; v2 draws no panel at all. A hairline across the top,
 * the date above the image rather than on it, a 5:4 thumbnail, the headline,
 * and the action at the base — the card is defined by the rule it hangs from
 * and by its own alignment, not by an outline. The accent fills across that
 * rule on hover, which is the same gesture the Business Portfolio's rows make.
 *
 * The items come from the repository, never from this file and never from the
 * page's static content: they are the one surface on the homepage that changes
 * without a deploy. docs/content-model.md §1. An empty list renders nothing at
 * all — a heading over an empty rail is worse than no section.
 *
 * Two rules make a row of these read as a row:
 *
 *  - **Every card is the same height**, whatever its headline runs to. The
 *    rail stretches its children and the card is a column, so the parts that
 *    vary take the slack instead of the card's outline.
 *  - **The headline clamps to three lines.** These range from eight words to
 *    thirty-five, and left alone the tallest one sets the height of the entire
 *    rail. `line-clamp` truncates visually while leaving the full string in the
 *    accessibility tree and in the page's text, so a screen reader and a search
 *    engine both still get the whole headline.
 *
 * A Server Component apart from the rail's arrows.
 */
export function NewsCarousel({ title, items, snap = false }: NewsCarouselProps) {
  if (items.length === 0) return null;

  return (
    <Section
      data-snap-section
      background="paper-dots"
      fullBleed
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <Rail>
        <div className="flex w-full flex-col gap-flow">
          <Container className="flex flex-wrap items-center justify-between gap-stack">
            <Reveal order={0}>
              <FlankedEyebrow rules="leading" tone="deep">
                {title}
              </FlankedEyebrow>
            </Reveal>

            <RailArrows previousLabel="Previous news" nextLabel="Next news" tone="paper" />
          </Container>

          <RailTrack label="SAEL in the news" gap="wide">
            {items.map((item, index) => (
              <li key={item.id} className="flex w-news-card shrink-0 snap-start">
                {/* 2, 3, 4 … — the label is 0 and 1 is skipped, so the cards
                    cascade in after it rather than alongside it. */}
                <Reveal order={index + 2} className="flex w-full">
                  <article
                    className={cn(
                      'group relative flex w-full flex-col',
                      'border-t border-hairline-paper pt-4 lg:pt-5',
                    )}
                  >
                    {/* The accent filling across the card's own hairline on
                        hover. `scaleX`, so nothing is laid out again per
                        frame — same treatment as a ledger row. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -top-px h-rule-accent origin-left bg-brand-red',
                        'scale-x-0 transition-transform duration-(--duration-card)',
                        'group-hover:scale-x-100 group-focus-within:scale-x-100',
                        'motion-reduce:transition-none',
                      )}
                    />

                    {/* The machine-readable instant and the human one come
                        from the same helper, so they cannot disagree — and the
                        display string is pinned to IST, which is what keeps
                        the server and the browser rendering the same date. */}
                    <time
                      dateTime={toDateTimeAttribute(item.publishedAt)}
                      className="text-meta text-meta-paper uppercase"
                    >
                      {formatDate(item.publishedAt)}
                    </time>

                    <div className="relative mt-3.5 aspect-news-thumb w-full overflow-hidden bg-surface-alt">
                      {item.imageUrl !== null && (
                        <Image
                          // A CMS URL, not a bundled import — hence the plain
                          // <Image> rather than <MediaFrame>, which takes a
                          // StaticImageData. The card keeps its box either way.
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes={SIZES_NEWS_CARD}
                          className={cn(
                            'object-cover transition duration-(--duration-reveal)',
                            'group-hover:scale-105',
                            'motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                          )}
                        />
                      )}
                    </div>

                    {/* `line-clamp-3` needs no `overflow-hidden` of its own —
                        it is `-webkit-box` clamping, which already hides the
                        overflow, and adding one would clip the focus ring on
                        the action below. */}
                    <h3 className="mt-4 line-clamp-3 text-card-title [text-wrap:pretty] text-ink">
                      {item.title}
                    </h3>

                    <Button
                      href={item.href}
                      variant="quiet"
                      size="micro"
                      className={cn(
                        'mt-auto pt-4 hover:no-underline',
                        "after:absolute after:inset-0 after:content-['']",
                      )}
                    >
                      {/* The visible label is generic, so the accessible name
                          carries the headline. "Read More" repeated six times
                          is a list of identical links to a screen-reader
                          user. */}
                      <span className="sr-only">Read more: {item.title}</span>
                      <span aria-hidden="true" className="inline-flex items-center gap-2">
                        Read More
                        <ArrowGlyph />
                      </span>
                    </Button>
                  </article>
                </Reveal>
              </li>
            ))}
          </RailTrack>
        </div>
      </Rail>
    </Section>
  );
}

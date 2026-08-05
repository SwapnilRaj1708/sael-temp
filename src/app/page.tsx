import type { Metadata } from 'next';
import { SectionScroller } from '@/components/layout/section-scroller';
import { BusinessTiles, type BusinessTile } from '@/components/sections/business-tiles';
import { EndeavourSplit } from '@/components/sections/endeavour-split';
import { GoalsGrid } from '@/components/sections/goals-grid';
import { NewsCarousel } from '@/components/sections/news-carousel';
import { PixelStrip } from '@/components/sections/pixel-strip';
import { HeroCarousel } from '@/components/sections/hero-carousel';
import { IntroSplit } from '@/components/sections/intro-split';
import { PresenceMap } from '@/components/sections/presence-map';
import { SolutionsCarousel } from '@/components/sections/solutions-carousel';
import { TODO_CONTENT } from '@/lib/config/site';
import { getContentRepository, type CapacityStat, type NewsItem } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  aboutSael,
  businessTiles,
  heroSlides,
  presenceSites,
  ourEndeavour,
  ourGoals,
  presenceSummary,
  solutions,
} from './_content/homepage';

/**
 * The title is carried over verbatim from the live site. It is a ranking
 * title — do not "improve" it. docs/features/04 §Route.
 */
export const metadata: Metadata = buildMetadata({
  title: 'SAEL | Renewable and Green Energy Company India',
  description: TODO_CONTENT,
  path: '/',
});

/** How many press items the homepage rail asks for. */
const NEWS_LIMIT = 9;

/**
 * Join each business card's static copy to its live capacity figure.
 *
 * Wrapped, and wrapped *here* rather than inside the section, because a
 * repository failure must cost only what it has to: the cards still render,
 * they simply render without their figures. docs/content-model.md §3 rule 2 —
 * callers handle failure locally, and one dead fetch does not take down the
 * page around it.
 */
async function resolveBusinessTiles(): Promise<BusinessTile[]> {
  let stats: CapacityStat[];

  try {
    stats = await getContentRepository().getCapacityStats();
  } catch (error) {
    console.error('[homepage] capacity stats unavailable, rendering tiles without figures', error);
    stats = [];
  }

  return businessTiles.map((tile) => {
    const stat = stats.find((candidate) => candidate.id === tile.id);

    return {
      ...tile,
      value: stat?.value ?? null,
      footnote: stat?.footnote ?? null,
    };
  });
}

/**
 * The homepage. A Server Component: it fetches, joins and passes down, and
 * only the hero carousel and the scroll controller opt into the client.
 *
 * **Sections 4–12 are not built yet.** docs/features/04 specifies twelve and
 * this page renders three — noting that its §2 (stats band) and §4 (business
 * tiles) are one section in the client's design, so the count will not reach
 * twelve. See docs/frontend-progress.md.
 *
 * `data-snap-sections` is what turns section snapping on. globals.css matches
 * it with `html:has(…)`, so the behaviour is scoped to this page without the
 * root layout needing to know which routes want it, and every section that
 * opts in carries `snap-start` and `min-h-viewport`.
 */
/**
 * The homepage's press items.
 *
 * Wrapped locally for the same reason the capacity figures are: a repository
 * failure must cost only this section. `<NewsCarousel>` renders nothing at all
 * for an empty list, so a dead fetch removes the section rather than leaving a
 * heading over an empty rail. docs/content-model.md §3 rule 2.
 */
async function resolveNewsItems(): Promise<NewsItem[]> {
  try {
    return await getContentRepository().getNewsItems({ limit: NEWS_LIMIT });
  } catch (error) {
    console.error('[homepage] news unavailable, omitting the section', error);
    return [];
  }
}

export default async function HomePage() {
  const [tiles, news] = await Promise.all([resolveBusinessTiles(), resolveNewsItems()]);

  return (
    <div data-snap-sections>
      <SectionScroller />
      <HeroCarousel slides={heroSlides} />
      <IntroSplit {...aboutSael} snap />
      <BusinessTiles eyebrow="Business Portfolio" tiles={tiles} snap />
      <PresenceMap {...presenceSummary} sites={presenceSites} snap />
      <SolutionsCarousel {...solutions} snap />
      <EndeavourSplit {...ourEndeavour} snap />
      <GoalsGrid {...ourGoals} snap />
      <NewsCarousel title="In the News" items={news} snap />
      <PixelStrip />
    </div>
  );
}

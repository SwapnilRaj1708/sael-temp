'use client';

import { Fragment, type CSSProperties } from 'react';
import { Container } from '@/components/ui/container';
import { MediaFrame } from '@/components/ui/media-frame';
import { SIZES_FULL_BLEED, SIZES_HERO_SYMBOL } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';
import type { HeroSlide } from './types';

/** `style` that also carries custom properties, without an `any` cast. */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroSlideLayerProps {
  slide: HeroSlide;
  isActive: boolean;
  /** 1-based, for the slide's accessible label. */
  position: number;
  total: number;
}

/**
 * One slide: photograph, scrim, watermark symbol, headline.
 *
 * All four slides stay mounted and cross-fade on `opacity`, which is what
 * makes the transition free to composite. The inactive ones are `inert` and
 * `aria-hidden`, so they are out of the accessibility tree and out of the tab
 * order entirely — without that, a keyboard user tabs through four headlines
 * for one visible slide, and a screen reader reads all four.
 *
 * Above `lg` the composition is the prototype's, driven by the six
 * coordinates in `slide.desktop`. Below `lg` every one of them is ignored:
 * the headline is bottom-anchored and full width inside the page gutter, and
 * the symbol demotes to a watermark. That is a different design, not a scaled
 * one, and it is specified in docs/responsive-strategy.md §4.
 */
export function HeroSlideLayer({ slide, isActive, position, total }: HeroSlideLayerProps) {
  const { image, symbol, headline, desktop } = slide;

  // The scrim darkens whichever side the headline sits on. The prototype
  // derives this from the headline's own placement rather than storing it, so
  // moving a headline across the frame cannot leave the scrim behind.
  const scrimAngle = Number.parseFloat(desktop.textX) < 50 ? '90deg' : '270deg';

  const placement: StyleWithVars = {
    '--slide-text-x': desktop.textX,
    '--slide-text-y': desktop.textY,
    '--slide-text-w': desktop.textWidth,
    '--slide-symbol-x': desktop.symbolX,
    '--slide-symbol-y': desktop.symbolY,
    '--slide-symbol-size': desktop.symbolSize,
    '--slide-scrim-angle': scrimAngle,
  };

  const Heading = isActive ? 'h1' : 'p';

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${String(position)} of ${String(total)}`}
      aria-hidden={!isActive}
      inert={!isActive}
      style={placement}
      className={cn(
        'pointer-events-none absolute inset-0',
        'transition-opacity duration-(--duration-cross-fade) [transition-timing-function:ease]',
        // An instant swap is the honest reading of "reduce motion" for a
        // change the user did not ask for. Matches card.tsx.
        'motion-reduce:transition-none',
        isActive ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/*
        The photograph, oversized so parallax translation never drags an edge
        into frame. The Ken Burns pan lives on the <img> inside; this wrapper
        owns only the parallax, so the two transforms cannot fight.
      */}
      <div
        className={cn(
          'absolute inset-0 overflow-hidden',
          'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
          'lg:[transform:scale(var(--hero-image-scale))_translate(calc(var(--parallax-x,0)*var(--hero-parallax-image)),calc(var(--parallax-y,0)*var(--hero-parallax-image)))]',
        )}
      >
        {/*
          Art direction, not a re-crop: a 2.34:1 landscape squeezed into a 4:5
          portrait frame loses its subject. Two elements, one per breakpoint,
          so each ships only the crop it needs.
          docs/asset-inventory.md §4.

          Known cost, and it is deliberate: slide 1 marks *both* crops
          `priority`, so one of the two is preloaded and never painted. The
          alternative — `priority` on one and lazy loading on the other —
          protects LCP at one breakpoint and wrecks it at the other, and
          `next/image` cannot express a media-conditioned `<picture>` source.
          Revisit when the portrait crops actually land; until then there is
          no asset to waste. docs/responsive-strategy.md §6.
        */}
        {/*
          Interim: with no portrait crop supplied, the landscape master stands
          in rather than the frame rendering empty. `object-cover` centre-crops
          it, which is exactly the compromise the art-directed crop exists to
          avoid — the subject will sit wherever it happens to sit. Acceptable
          while the crops are outstanding, not acceptable at launch.
          docs/asset-inventory.md §4.
        */}
        <MediaFrame
          image={image.mobile ?? image.desktop}
          alt={image.alt}
          sizes={SIZES_FULL_BLEED}
          priority={position === 1}
          pending={`hero/${slide.id}-portrait`}
          className="absolute inset-0 lg:hidden"
          imageClassName={cn(isActive && 'anim-ken-burns')}
        />
        <MediaFrame
          image={image.desktop}
          alt={image.alt}
          sizes={SIZES_FULL_BLEED}
          priority={position === 1}
          pending={`hero/${slide.id}`}
          className="absolute inset-0 hidden lg:block"
          imageClassName={cn(isActive && 'anim-ken-burns')}
        />
      </div>

      {/* Scrim. Bottom-up below lg where the headline is bottom-anchored;
          sideways above it, angled towards the headline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--gradient-hero-scrim-mobile) lg:bg-(image:--gradient-hero-scrim)"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-(image:--gradient-hero-vignette) lg:block"
      />

      {/* Watermark symbol. Decorative at every size — the headline carries the
          meaning — so it is hidden from assistive technology outright. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute aspect-square',
          'top-(--hero-symbol-mobile-inset) right-(--hero-symbol-mobile-inset)',
          'w-(--hero-symbol-mobile-width) opacity-(--hero-symbol-mobile-opacity)',
          'lg:top-(--slide-symbol-y) lg:right-auto lg:left-(--slide-symbol-x)',
          'lg:w-(--slide-symbol-size) lg:opacity-100',
          'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
          'lg:[transform:translate(calc(-50%+var(--parallax-x,0)*var(--hero-parallax-symbol)),calc(-50%+var(--parallax-y,0)*var(--hero-parallax-symbol)))]',
        )}
      >
        <MediaFrame
          image={symbol.image}
          alt=""
          sizes={SIZES_HERO_SYMBOL}
          pending={symbol.pending}
          className="absolute inset-0 bg-transparent"
          imageClassName="object-contain"
        />
      </div>

      {/*
        `lg:contents` dissolves the Container above lg so the headline
        positions against the slide itself. Below lg it is a normal
        bottom-anchored block and the Container supplies the page gutter —
        which is the only thing permitted to. docs/design-guidelines.md §3.

        `lg:static` is not redundant. An absolutely-positioned element is
        blockified, and rather than rely on every engine agreeing that
        `display: contents` is exempt from that, the positioning is simply
        removed at the same breakpoint. If it were not, the Container would
        keep generating a box at `lg` and the headline would position against
        *it* — inset by the gutter — instead of against the slide.
      */}
      <Container className="absolute inset-x-0 bottom-(--hero-text-mobile-inset) lg:static lg:contents">
        <Heading
          // Remounts when the slide takes over, which is what replays the word
          // stagger. Without it the animation would run once at page load, on
          // all four slides at once, three of them invisible.
          key={isActive ? 'active' : 'idle'}
          // The headline is split into per-word spans to stagger them. That is
          // presentational: the label restores it to one string so it is not
          // announced word by word.
          aria-label={headline}
          className={cn(
            'max-w-(--measure) text-hero text-white',
            // `pretty`, as the prototype specifies, and not the
            // `text-wrap: balance` globals.css puts on every heading — a
            // balanced hero headline reflows its line breaks as the viewport
            // changes, which is distracting at this size.
            '[text-wrap:pretty] [text-shadow:var(--shadow-hero-text)]',
            'lg:absolute lg:max-w-none',
            'lg:top-(--slide-text-y) lg:left-(--slide-text-x) lg:w-(--slide-text-w)',
            'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
            'lg:[transform:translate(calc(var(--parallax-x,0)*var(--hero-parallax-text)),calc(-50%+var(--parallax-y,0)*var(--hero-parallax-text)))]',
          )}
        >
          {headline.split(' ').map((word, wordIndex, words) => (
            <Fragment key={`${slide.id}-${String(wordIndex)}`}>
              <span
                aria-hidden="true"
                style={{ '--anim-index': wordIndex } as StyleWithVars}
                className={cn(
                  // Not decorative: `transform` has no effect on a
                  // non-replaced inline box, so staggering each word by
                  // translateY needs each word to be an atomic inline.
                  'inline-block',
                  // globals.css sets `overflow-wrap: break-word` on every
                  // heading. That is right for a heading and wrong for a box
                  // holding exactly one word — it permits a break mid-word.
                  // `nowrap` pins the span's min-content width to the whole
                  // word, so it is always exactly as wide as what it renders.
                  // The spaces sit outside the spans and stay breakable, so
                  // the headline still wraps between words.
                  'whitespace-nowrap',
                  isActive && 'anim-word-in',
                )}
              >
                {word}
              </span>
              {/*
                A real space, not a margin on the span. It restores the wrap
                opportunity between words that the inline-blocks would
                otherwise have to supply themselves, and it means selecting
                the headline copies "A leading manufacturer" rather than
                "Aleadingmanufacturer".
              */}
              {wordIndex < words.length - 1 && ' '}
            </Fragment>
          ))}
        </Heading>
      </Container>
    </div>
  );
}

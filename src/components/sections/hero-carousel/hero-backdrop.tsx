import type { CSSProperties } from 'react';
import { MediaFrame } from '@/components/ui/media-frame';
import { SIZES_FULL_BLEED } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';
import type { HeroSlide } from './types';

/** `style` that also carries custom properties, without an `any` cast. */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroBackdropProps {
  slide: HeroSlide;
  isActive: boolean;
  /** 1-based. Only the first slide is preloaded. */
  position: number;
}

/**
 * One slide's photograph and the scrims over it. HERO-SPEC.md §3a–§3c.
 *
 * **The crop is in the file, not in the CSS.** §0 is the whole reason this
 * component looks as plain as it does: the four supplied JPGs are cut to
 * 2.34:1 already — 2400 × 1026, and 1360 × 581 for `hero-modules` — so the
 * frame and the artwork agree and there is nothing left to reposition. Every
 * photograph is `object-fit: cover; object-position: center` and no slide
 * carries an offset. The one that used to (`lg:object-right`, to move a
 * centred subject out from under the headline) had its correction baked into
 * the new crop instead. **If a photograph reads off-centre, the wrong file is
 * loaded — do not add an `object-position` to correct it.**
 *
 * All four backdrops stay mounted and cross-fade on `opacity`, which is what
 * makes the transition free to composite. The `alt` text is still outstanding
 * — docs/asset-inventory.md §9 — and these are photographs of real sites, not
 * decoration, so it stays a TODO rather than being closed off with `alt=""`.
 *
 * **Three scrims, and the first two are §3c exactly:**
 *
 *  - the **vignette** — one radial, identical on every slide, painted first so
 *    the linear scrim sits over it as `background: linear, radial` would;
 *  - the **side scrim** — one linear, whose direction is *per slide*. §3c
 *    flips it to `90deg` when the headline sits on the left of the frame and
 *    `270deg` when it sits on the right, so the gradient always darkens the
 *    side the words are on. That is `--slide-scrim-angle`, derived here from
 *    `placement.textX` rather than stored beside it — one fact, one place.
 *  - the **foot** scrim is below `lg` only, and is outside the spec: it keeps
 *    the progress dots off a bright patch of sky on the taller mobile frame,
 *    where the vignette alone does not reach the bottom edge.
 */
export function HeroBackdrop({ slide, isActive, position }: HeroBackdropProps) {
  const { image, placement } = slide;

  // §3c: `90deg` when textX < 50%, else `270deg`.
  const scrimAngle = placement.textX < 50 ? '90deg' : '270deg';

  return (
    <>
      {/*
        The photograph, oversized so parallax translation never drags an edge
        into frame. The Ken Burns pan lives on the <img> inside; this wrapper
        owns only the parallax, so the two transforms cannot fight. §3a.
      */}
      <div
        className={cn(
          'absolute inset-0 overflow-hidden',
          'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
          'lg:[transform:scale(var(--hero-image-scale))_translate(calc(var(--parallax-x,0)*var(--hero-parallax-image)),calc(var(--parallax-y,0)*var(--hero-parallax-image)))]',
        )}
      >
        {/*
          Art direction, not a re-crop: HERO-SPEC.md covers the 1920 desktop
          composition and is silent below `lg`, where a 2.34:1 landscape
          squeezed into a portrait frame loses its subject. Two elements, one
          per breakpoint, so each ships only the crop it needs.
          docs/asset-inventory.md §4.

          Known cost, and it is deliberate: slide 1 marks *both* crops
          `priority`, so one of the two is preloaded and never painted. The
          alternative — `priority` on one and lazy loading on the other —
          protects LCP at one breakpoint and wrecks it at the other, and
          `next/image` cannot express a media-conditioned `<picture>` source.
          docs/responsive-strategy.md §6.
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

      <div aria-hidden="true" className="absolute inset-0 bg-(image:--gradient-hero-vignette)" />
      <div
        aria-hidden="true"
        style={{ '--slide-scrim-angle': scrimAngle } as StyleWithVars}
        className={cn(
          'absolute inset-0',
          // Below lg the headline is bottom-anchored, so the scrim has to run
          // bottom-up rather than sideways. Outside the spec, like the crop.
          'bg-(image:--gradient-hero-scrim-mobile)',
          'lg:bg-(image:--gradient-hero-scrim)',
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--gradient-hero-foot) lg:hidden"
      />
    </>
  );
}

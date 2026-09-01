import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/container';
import { SIZES_HERO_SYMBOL } from '@/lib/utils/image-sizes';
import { cn } from '@/lib/utils/cn';
import { HeroHeadline } from './hero-headline';
import type { HeroSlide } from './types';

/** `style` that also carries custom properties, without an `any` cast. */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroCopyProps {
  slide: HeroSlide;
  isActive: boolean;
}

/**
 * One slide's mark and headline, at that slide's own coordinates.
 * HERO-SPEC.md §3d and §3e.
 *
 * **Per slide, not one column for all four.** Each slide places its mark and
 * its words somewhere different in the frame — §2's `iconX/iconY/textX/textY`
 * — so a slide is a whole composition again, as it was before `SAEL Home v2`
 * collapsed the four into a single right-hand column. The wrapper that
 * cross-fades them lives in `index.tsx`, so nothing here has to know about
 * `opacity`.
 *
 * **The percentages are of the hero box, and that is what `lg:static` below is
 * for.** The `<Container>` is `absolute inset-0` under `lg`, where it is the
 * bottom-anchored mobile column and needs to fill the slide; from `lg` it goes
 * `static`, which stops it being a positioning context, so the two absolute
 * children resolve their percentages against the slide wrapper — the hero —
 * exactly as §2 specifies. It keeps `px-gutter` either way, which is why this
 * is a Container at all: it is the only sanctioned source of page padding, and
 * the mobile column sits on the page gutter like everything else.
 *
 * Positions arrive as CSS custom properties rather than classes. A Tailwind
 * arbitrary value holding a raw percentage — `left-[12%]` — is exactly what
 * `pnpm verify:guardrails` rejects, and rightly: these are per-slide *data*,
 * and /CLAUDE.md §5 sanctions `style` for a custom property carrying one.
 *
 * **Below `lg` the spec is silent** and the `SAEL Home v2` arrangement stands:
 * mark, a short red rule, then the headline, bottom-anchored over a portrait
 * crop. See the note in `index.tsx`.
 */
export function HeroCopy({ slide, isActive }: HeroCopyProps) {
  const { placement, symbol } = slide;

  return (
    <Container
      style={
        {
          '--hero-icon-x': `${String(placement.iconX)}%`,
          '--hero-icon-y': `${String(placement.iconY)}%`,
          '--hero-text-x': `${String(placement.textX)}%`,
          '--hero-text-y': `${String(placement.textY)}%`,
        } as StyleWithVars
      }
      className={cn(
        'absolute inset-0 flex flex-col justify-end',
        'pt-hero-pad-top pb-hero-pad-bottom',
        // From lg it lays nothing out and positions nothing — see above.
        'lg:static lg:block lg:py-0',
      )}
    >
      {/* Decorative at every size: the headline carries the meaning. Both
          halves of that — `alt=""` keeps it out of the accessible name,
          `aria-hidden` keeps the node out of the tree.
          docs/design-guidelines.md §6.

          Drawn at its own proportions, width-constrained with `h-auto`, per
          §3d's `width: <iconSize>; height: auto`. No box around it and nothing
          to letterbox — see the marks rule in design-guidelines §6. */}
      {symbol.image !== null && (
        <Image
          src={symbol.image}
          alt=""
          aria-hidden="true"
          sizes={SIZES_HERO_SYMBOL}
          className={cn(
            'mb-stack h-auto w-hero-icon drop-shadow-hero-icon lg:w-hero-icon-lg',
            // §3d: centred on its coordinates, and drifting further with the
            // pointer than the photograph behind it.
            'lg:absolute lg:top-(--hero-icon-y) lg:left-(--hero-icon-x) lg:mb-0',
            'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
            'lg:[transform:translate(calc(-50%+var(--parallax-x,0)*var(--hero-parallax-symbol)),calc(-50%+var(--parallax-y,0)*var(--hero-parallax-symbol)))]',
          )}
        />
      )}

      {/* The short red rule under the mark. Part of the mobile arrangement
          only — HERO-SPEC.md's composition has no rule in it. */}
      <div
        aria-hidden="true"
        className="mb-stack h-hero-rule-h w-hero-rule-w shrink-0 bg-brand-red lg:hidden"
      />

      <HeroHeadline
        slide={slide}
        isActive={isActive}
        className={cn(
          // §3e: `left` is the headline's left edge, `top` its vertical
          // centre, and it drifts *against* the pointer — hence the negative
          // multiplier in --hero-parallax-text.
          'lg:absolute lg:top-(--hero-text-y) lg:left-(--hero-text-x)',
          placement.textWidthClassName,
          'lg:transition-transform lg:duration-(--duration-parallax) lg:ease-out',
          'lg:[transform:translate(calc(var(--parallax-x,0)*var(--hero-parallax-text)),calc(-50%+var(--parallax-y,0)*var(--hero-parallax-text)))]',
        )}
      />
    </Container>
  );
}

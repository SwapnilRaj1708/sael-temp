import type { LucideIcon } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import { MediaFrame } from '@/components/ui/media-frame';
import { FlankedEyebrow } from '@/components/ui/flanked-eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_GOAL_CARD } from '@/lib/utils/image-sizes';

export interface Goal {
  id: string;
  /** "Mission". Uppercased by CSS. */
  title: string;
  body: string;
  /** Full-bleed background photograph. */
  image: StaticImageData | null;
  icon: LucideIcon;
}

export interface GoalsGridProps {
  title: string;
  goals: Goal[];
  snap?: boolean;
}

/**
 * "Our Goals" — Mission, Vision and Ethos as three photographic cards.
 * docs/features/04 §10.
 *
 * **Built to the client's design, which is not what §10 describes.** That spec
 * is the Designer prototype's: an eyebrow, then three flat `--color-inert`
 * boxes that take `--gradient-goal-hover` on hover, over a
 * `--gradient-wash-goals` section. The client's version has no eyebrow, a
 * plain centred heading, and each card is a photograph — green foliage,
 * a solar panel close-up, flame — with white copy over it. Following the PDF,
 * as instructed. `docs/asset-inventory.md` §10.
 *
 * That change takes the hover interaction with it: there is nothing to reveal
 * when the resting state is already the finished card, and §10's
 * `(hover: none)` caveat — "three grey boxes is not the design" — was written
 * about a problem this version does not have.
 *
 * The photographs carry meaning only by association, so they are decorative:
 * each card's title and body say everything the card means, and describing
 * "a close-up of green leaves" to a screen-reader user adds noise, not
 * information. Hence `alt=""` and no `alt` on the interface.
 *
 * A Server Component. Nothing here is interactive.
 */
export function GoalsGrid({ title, goals, snap = false }: GoalsGridProps) {
  return (
    <Section
      data-snap-section
      spacing="tight"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div className="flex w-full flex-col items-center gap-flow">
        {/* The same flanked label the Business Portfolio uses, so the centred
            sections read as a set. */}
        <Reveal order={0}>
          <FlankedEyebrow>{title}</FlankedEyebrow>
        </Reveal>

        <div className="grid w-full max-w-(--business-max-w) gap-gap-grid md:grid-cols-3">
          {goals.map((goal, index) => {
            const Icon = goal.icon;

            return (
              <Reveal key={goal.id} order={index + 2} className="flex">
                <article
                  // A floor, not a fixed ratio. A portrait aspect made the card
                  // as tall as its width dictated, which on a wide screen was
                  // taller than the section had room for — and the copy is
                  // absolutely positioned inside, so it had nowhere to go but
                  // over the edge. Min-height keeps the three cards matched by
                  // the grid while letting the longest one set the height.
                  className="group relative flex min-h-(--spacing-goal-card) w-full overflow-hidden"
                >
                  <MediaFrame
                    image={goal.image}
                    alt=""
                    sizes={SIZES_GOAL_CARD}
                    pending={`goals/${goal.id}`}
                    className="absolute inset-0"
                  />

                  {/* Legibility, not decoration — see --gradient-goal-scrim. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-(image:--gradient-goal-scrim)"
                  />

                  {/*
                  At rest the card is just its mark and its name, set large.
                  The description arrives on hover — over a translucent panel,
                  because white copy on a bright orange photograph needs the
                  extra separation, and it is the same panel on all three so
                  they behave alike.

                  Gated on `(hover: hover)`. A touch device cannot hover, and a
                  card whose only content is behind an interaction nobody can
                  perform is a card with no content. There, both states are
                  simply stacked and always visible.
                */}
                  <div
                    className={cn(
                      'relative flex w-full flex-col items-center justify-center',
                      'gap-stack p-5 text-center text-white lg:p-6',
                    )}
                  >
                    <div
                      className={cn(
                        'flex flex-col items-center gap-stack',
                        'transition duration-(--duration-card)',
                        'hover-hover:group-hover:-translate-y-2 hover-hover:group-hover:opacity-0',
                        'hover-hover:group-focus-within:-translate-y-2',
                        'hover-hover:group-focus-within:opacity-0',
                        'motion-reduce:transition-none',
                      )}
                    >
                      <Icon
                        className="size-goal-icon shrink-0 stroke-1"
                        aria-hidden="true"
                        focusable="false"
                      />
                      {/* `text-white` on the heading itself, not inherited from
                        the wrapper: globals.css gives every h1–h6 an explicit
                        `--color-ink` in the base layer, and an explicit colour
                        beats an inherited one however close the ancestor is. */}
                      <h3 className="text-goal-title font-bold text-white uppercase">
                        {goal.title}
                      </h3>
                    </div>

                    <p
                      className={cn(
                        'text-body-sm [text-wrap:pretty]',
                        'hover-hover:absolute hover-hover:inset-0',
                        'hover-hover:flex hover-hover:items-center',
                        'hover-hover:bg-black/45 hover-hover:p-5 lg:hover-hover:p-6',
                        'hover-hover:translate-y-2 hover-hover:opacity-0',
                        'transition duration-(--duration-card)',
                        'hover-hover:group-hover:translate-y-0 hover-hover:group-hover:opacity-100',
                        'hover-hover:group-focus-within:translate-y-0',
                        'hover-hover:group-focus-within:opacity-100',
                        'motion-reduce:transition-none',
                      )}
                    >
                      {goal.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

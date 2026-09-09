import aboutPhoto from '@/assets/images/homepage/about/burning-crop.png';
import aboutCutout from '@/assets/images/homepage/about/sardar-kid-cropped.png';
import iconAgriWaste from '@/assets/images/homepage/business/icon-agri-waste.png';
import iconCellManufacturing from '@/assets/images/homepage/business/icon-solar-cell.png';
import iconSolarGeneration from '@/assets/images/homepage/business/icon-solar-energy.png';
import iconModuleManufacturing from '@/assets/images/homepage/business/icon-solar-module.png';
import endeavourGirl from '@/assets/images/homepage/endeavour/endeavour-girl.png';
import endeavourPanel from '@/assets/images/homepage/endeavour/solar-panel.png';
import markEthos from '@/assets/images/homepage/goals/ethos-icon.svg';
import goalMission from '@/assets/images/homepage/goals/green.jpg';
import goalEthos from '@/assets/images/homepage/goals/india-orange.jpg';
import markMission from '@/assets/images/homepage/goals/mission-icon.svg';
import goalVision from '@/assets/images/homepage/goals/panel-closeup.jpg';
import markVision from '@/assets/images/homepage/goals/vision-icon.svg';
import saelIcon1 from '@/assets/images/homepage/hero/cropped-sael-icon-1.png';
import saelIcon2 from '@/assets/images/homepage/hero/cropped-sael-icon-2.png';
import saelIcon3 from '@/assets/images/homepage/hero/cropped-sael-icon-3.png';
import saelIcon4 from '@/assets/images/homepage/hero/cropped-sael-icon-4.png';
import heroImage1 from '@/assets/images/homepage/hero/hero-1.png';
import heroImage2 from '@/assets/images/homepage/hero/hero-2.png';
import heroImage3 from '@/assets/images/homepage/hero/hero-3.png';
import heroImage4 from '@/assets/images/homepage/hero/hero-4.png';
import heroImageMobile1 from '@/assets/images/homepage/hero/hero-mobile-1.jpg';
import heroImageMobile2 from '@/assets/images/homepage/hero/hero-mobile-2.jpg';
import heroImageMobile3 from '@/assets/images/homepage/hero/hero-mobile-3.jpg';
import heroImageMobile4 from '@/assets/images/homepage/hero/hero-mobile-4.jpg';
import dottedMap from '@/assets/images/homepage/presence-map/dotted-map.svg';
import solBhadra from '@/assets/images/homepage/solutions/sol-bhadra.jpg';
import solKishangarh from '@/assets/images/homepage/solutions/sol-kishangarh.jpg';
import solMizoram from '@/assets/images/homepage/solutions/sol-mizoram.jpg';
import solPatiala from '@/assets/images/homepage/solutions/sol-patiala.jpg';
import { cdnImage } from './cdn';

/**
 * The homepage's artwork, grouped by the section that draws it.
 *
 * The keys follow the sections rather than the filenames, because several of
 * the filenames are the client's and do not say what they are — `green.jpg` is
 * the Mission card's background, and `india-orange.jpg` is the Ethos one.
 * Naming them here is the one place that mapping is written down.
 *
 * A page owns one of these modules. That is what keeps the layer from becoming
 * the single giant registry the file count would otherwise produce: a page's
 * assets are added and removed with the page, and nothing else in the codebase
 * has to be opened to do it.
 *
 * **One caveat carried over from FE-04:** the hero symbol numbering is under
 * review. The lettering baked into the masters says `sael-icon-1` is the
 * solar-energy mark and `-3` the cell mark, where the slides pair them the
 * other way round. The wiring below is preserved as built rather than silently
 * corrected — see docs/frontend-progress.md.
 *
 * Section components never import this. `src/app/_content/homepage.ts` reads
 * it and the page passes the result down, exactly as it does with the copy —
 * /CLAUDE.md §5.
 */
export const homepageImages = {
  /**
   * Keyed by slide, not by filename, because the four are used one at a time
   * and nothing iterates them. An array would also collide with
   * `noUncheckedIndexedAccess`, which types every index read as possibly
   * undefined and would push a needless narrow onto each call site.
   */
  hero: {
    slide1: {
      desktop: cdnImage(heroImage1, 'homepage/hero/hero-1.png'),
      mobile: cdnImage(heroImageMobile1, 'homepage/hero/hero-mobile-1.jpg'),
      symbol: cdnImage(saelIcon1, 'homepage/hero/cropped-sael-icon-1.png'),
    },
    slide2: {
      desktop: cdnImage(heroImage2, 'homepage/hero/hero-2.png'),
      mobile: cdnImage(heroImageMobile2, 'homepage/hero/hero-mobile-2.jpg'),
      symbol: cdnImage(saelIcon2, 'homepage/hero/cropped-sael-icon-2.png'),
    },
    slide3: {
      desktop: cdnImage(heroImage3, 'homepage/hero/hero-3.png'),
      mobile: cdnImage(heroImageMobile3, 'homepage/hero/hero-mobile-3.jpg'),
      symbol: cdnImage(saelIcon3, 'homepage/hero/cropped-sael-icon-3.png'),
    },
    slide4: {
      desktop: cdnImage(heroImage4, 'homepage/hero/hero-4.png'),
      mobile: cdnImage(heroImageMobile4, 'homepage/hero/hero-mobile-4.jpg'),
      symbol: cdnImage(saelIcon4, 'homepage/hero/cropped-sael-icon-4.png'),
    },
  },
  about: {
    /** The photograph masked into the chamfered shape. */
    photo: cdnImage(aboutPhoto, 'homepage/about/burning-crop.png'),
    /** The figure standing in front of it. Transparency required. */
    cutout: cdnImage(aboutCutout, 'homepage/about/sardar-kid-cropped.png'),
  },
  business: {
    solarGeneration: cdnImage(iconSolarGeneration, 'homepage/business/icon-solar-energy.png'),
    cellManufacturing: cdnImage(iconCellManufacturing, 'homepage/business/icon-solar-cell.png'),
    moduleManufacturing: cdnImage(
      iconModuleManufacturing,
      'homepage/business/icon-solar-module.png',
    ),
    agriWaste: cdnImage(iconAgriWaste, 'homepage/business/icon-agri-waste.png'),
  },
  presenceMap: {
    /** The client's supplied dotted map. */
    dotted: cdnImage(dottedMap, 'homepage/presence-map/dotted-map.svg'),
  },
  endeavour: {
    panel: cdnImage(endeavourPanel, 'homepage/endeavour/solar-panel.png'),
    /** Carries ~48% dead transparent canvas — see `--endeavour-figure-bleed-w`. */
    figure: cdnImage(endeavourGirl, 'homepage/endeavour/endeavour-girl.png'),
  },
  solutions: {
    patiala: cdnImage(solPatiala, 'homepage/solutions/sol-patiala.jpg'),
    mizoram: cdnImage(solMizoram, 'homepage/solutions/sol-mizoram.jpg'),
    kishangarh: cdnImage(solKishangarh, 'homepage/solutions/sol-kishangarh.jpg'),
    bhadra: cdnImage(solBhadra, 'homepage/solutions/sol-bhadra.jpg'),
  },
  goals: {
    /**
     * Card backgrounds. The filenames are the client's and describe the
     * photograph, not the card: Ethos is the orange India shot, Mission the
     * green one, Vision the panel close-up.
     */
    ethos: cdnImage(goalEthos, 'homepage/goals/india-orange.jpg'),
    mission: cdnImage(goalMission, 'homepage/goals/green.jpg'),
    vision: cdnImage(goalVision, 'homepage/goals/panel-closeup.jpg'),
    /**
     * The three marks, inverted to white at the call site. They cannot be
     * inlined as components — all three declare the same `clippath` id.
     *
     * The rival `*-goal.svg` set is gone: deleted on 2026-09-07, which closes
     * the "which set is current" question FE-04 had open.
     */
    markEthos: cdnImage(markEthos, 'homepage/goals/ethos-icon.svg'),
    markMission: cdnImage(markMission, 'homepage/goals/mission-icon.svg'),
    markVision: cdnImage(markVision, 'homepage/goals/vision-icon.svg'),
  },
};

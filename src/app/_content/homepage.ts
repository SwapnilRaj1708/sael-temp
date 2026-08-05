import iconAgriWaste from '@/assets/images/business/icon-agri-waste.png';
import iconCellManufacturing from '@/assets/images/business/icon-solar-cell.png';
import iconModuleManufacturing from '@/assets/images/business/icon-solar-module.png';
import iconSolarGeneration from '@/assets/images/business/icon-solar-energy.png';
import aboutComposite from '@/assets/images/aboutSael/sardar-kid-cutout.png';
import heroImage1 from '@/assets/images/hero/hero-image-1.jpg';
import heroImageMobile1 from '@/assets/images/hero/hero-image-mobile-1.jpg';
import heroImageMobile2 from '@/assets/images/hero/hero-image-mobile-2.jpg';
import heroImageMobile3 from '@/assets/images/hero/hero-image-mobile-3.jpg';
import heroImageMobile4 from '@/assets/images/hero/hero-image-mobile-4.jpg';
import heroImage2 from '@/assets/images/hero/hero-image-2.jpg';
import heroImage3 from '@/assets/images/hero/hero-image-3.jpg';
import heroImage4 from '@/assets/images/hero/hero-image-4.jpg';
import saelIcon1 from '@/assets/images/hero/sael-icon-1.png';
import saelIcon2 from '@/assets/images/hero/sael-icon-2.png';
import saelIcon3 from '@/assets/images/hero/sael-icon-3.png';
import saelIcon4 from '@/assets/images/hero/sael-icon-4.png';
import solBhadra from '@/assets/images/solutions/sol-bhadra.jpg';
import solKishangarh from '@/assets/images/solutions/sol-kishangarh.jpg';
import solMizoram from '@/assets/images/solutions/sol-mizoram.jpg';
import solPatiala from '@/assets/images/solutions/sol-patiala.jpg';
import goalEthos from '@/assets/images/goals/India-orange.jpg';
import goalMission from '@/assets/images/goals/green.jpg';
import goalVision from '@/assets/images/goals/panel-closeup.jpg';
import endeavourGirl from '@/assets/images/endeavour/girl.png';
import type { EndeavourSplitProps } from '@/components/sections/endeavour-split';
import type { GoalsGridProps } from '@/components/sections/goals-grid';
import type { HeroSlide } from '@/components/sections/hero-carousel';
import type { IntroSplitProps } from '@/components/sections/intro-split';
import type { SolutionsCarouselProps } from '@/components/sections/solutions-carousel';
import { Crosshair, Eye, Sprout } from 'lucide-react';
import { TODO_CONTENT } from '@/lib/config/site';

/**
 * The homepage's static content.
 *
 * Static, not dynamic: this is marketing copy that changes with a design
 * review and a deploy, so it lives in typed TypeScript rather than behind the
 * content repository. The homepage's *dynamic* surfaces — the capacity
 * figures and the news items — come from `getContentRepository()` instead.
 * docs/content-model.md §1.
 *
 * Section components never import this file. The page reads it and passes it
 * down, which is what keeps every section reusable on the pages that follow.
 * /CLAUDE.md §5.
 */

/**
 * Transcribed from the prototype's `defaultHeroSlides()`, with two changes and
 * no third:
 *
 *  - `18.5vw` / `31vw` / `30vw` are written as percentages of the hero. The
 *    hero is full-bleed, so its box is the viewport width and the rendering is
 *    identical — but a bare `vw` is banned outside the token layer, and for
 *    good reason. docs/responsive-strategy.md §1.
 *  - The prototype's `objectPos: "center"` is dropped. It is `object-cover`'s
 *    default, and the mobile crop is art-directed rather than repositioned.
 *
 * Still outstanding, and each renders through `<MediaFrame>`'s pending state
 * until it lands (docs/asset-inventory.md §9):
 *
 *  - the four art-directed **portrait crops** for below `lg`. Until they
 *    arrive the landscape master stands in — see the note in hero-slide.tsx.
 *  - the four watermark **symbols**
 *  - `alt` text for every photograph
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'solar-modules',
    image: {
      desktop: heroImage1,
      mobile: heroImageMobile1,
      // Describes the scene, not the brand. docs/design-guidelines.md §6.
      alt: TODO_CONTENT,
    },
    symbol: { image: saelIcon1, pending: 'icons/symbol-cell-manufacturing' },
    headline: 'A leading manufacturer for Bifacial TOPCon solar modules',
    desktop: {
      textX: '64%',
      textY: '43%',
      textWidth: '31%',
      symbolX: '12%',
      symbolY: '70%',
      symbolSize: '18.5%',
    },
  },
  {
    id: 'energy-generation',
    image: { desktop: heroImage2, mobile: heroImageMobile2, alt: TODO_CONTENT },
    symbol: { image: saelIcon2, pending: 'icons/symbol-module-manufacturing' },
    headline: 'Generating clean energy by investing in advanced technology and systems',
    desktop: {
      textX: '8%',
      textY: '48%',
      textWidth: '31%',
      symbolX: '88%',
      symbolY: '70%',
      symbolSize: '18.5%',
    },
  },
  {
    id: 'clean-energy-vision',
    image: { desktop: heroImage3, mobile: heroImageMobile3, alt: TODO_CONTENT },
    symbol: { image: saelIcon3, pending: 'icons/symbol-solar-generation' },
    headline: 'A vision to building the capacity for India’s clean energy needs',
    desktop: {
      textX: '58%',
      textY: '46%',
      textWidth: '31%',
      symbolX: '11%',
      symbolY: '70%',
      symbolSize: '18.5%',
    },
  },
  {
    id: 'agri-waste',
    image: { desktop: heroImage4, mobile: heroImageMobile4, alt: TODO_CONTENT },
    symbol: { image: saelIcon4, pending: 'icons/symbol-agri-waste' },
    headline: 'Converting ~2 million tonnes of paddy waste into clean energy',
    desktop: {
      textX: '58%',
      textY: '49%',
      textWidth: '30%',
      symbolX: '43%',
      symbolY: '60%',
      symbolSize: '18.5%',
    },
  },
];

/**
 * "About SAEL" — section 2.
 *
 * Copy transcribed from `SAEL - New Website.pdf`, the client's own design,
 * rather than from the Designer prototype. The two differ for this section and
 * the client asked for the PDF; see the note on `<IntroSplit>`.
 *
 * The body is the PDF's verbatim, with its line-break hyphen in
 * "decar-bonization" closed up and its apostrophes normalised to the typographic
 * form used everywhere else on the site. Nothing else is altered.
 */
export const aboutSael: Omit<IntroSplitProps, 'snap'> = {
  eyebrow: 'About SAEL',
  title: 'Endeavoring to make a sustainable impact',
  body:
    'At SAEL, we strive to provide decarbonization solutions to facilitate ' +
    'India’s adoption of clean and affordable energy projects. Our commitment ' +
    'lies in delivering environmentally conscious energy solutions. As one of ' +
    'India’s leading renewable energy companies, we are dedicated to enhancing ' +
    'the energy landscape nationwide.',
  media: {
    image: aboutComposite,
    // Describes the artwork, not the section. Written from the image; it
    // asserts nothing about the business, but it is still copy and wants a
    // review.
    alt: 'A young boy in a turban, against a field of burning crop stubble',
  },
};

/**
 * "Business Portfolio" — section 3.
 *
 * The **static** half of each card: mark, name, copy and destination. The
 * capacity figure and its qualifier are dynamic and arrive from
 * `getCapacityStats()`; the page joins the two on `id`.
 * docs/content-model.md §1.
 *
 * The descriptions are the Designer prototype's, verbatim, as
 * docs/features/04 §4 requires. The client's PDF sets Lorem ipsum in these
 * four slots, so it is not a source for them — and inventing marketing copy
 * for a company that publishes financial results is exactly what /CLAUDE.md §3
 * forbids. Where the two sources disagree on *layout* the PDF wins; where the
 * PDF simply has no content, the prototype does.
 */
export const businessTiles = [
  {
    id: 'solar-generation',
    icon: iconSolarGeneration,
    title: ['Solar Energy', 'Generation'] as [string, string],
    description:
      'SAEL develops and operates large-scale solar power plants, generating clean, ' +
      'affordable energy across India and advancing the nation’s renewable transition.',
    href: '/solar-energy/',
    ctaLabel: 'Know more about solar energy generation',
    figureClassName: 'text-figure-solar',
  },
  {
    id: 'cell-manufacturing',
    icon: iconCellManufacturing,
    title: ['Solar Cell', 'Manufacturing'] as [string, string],
    // The design marks this business as upcoming, and the footnote on the
    // capacity figure explains what the asterisk means.
    titleMarker: '*',
    description:
      'Our facilities manufacture high-efficiency solar cells using advanced bifacial ' +
      'TOPCon technology, delivering superior output and reliability.',
    href: '/solar-cell-manufacturing/',
    ctaLabel: 'Know more about solar cell manufacturing',
    figureClassName: 'text-figure-cell',
  },
  {
    id: 'module-manufacturing',
    icon: iconModuleManufacturing,
    title: ['Solar Module', 'Manufacturing'] as [string, string],
    description:
      'We produce bifacial solar modules engineered for performance, durability and ' +
      'long-term reliability across diverse operating environments.',
    href: '/module-manufacturing/',
    ctaLabel: 'Know more about solar module manufacturing',
    figureClassName: 'text-figure-module',
  },
  {
    id: 'agri-waste',
    icon: iconAgriWaste,
    title: ['Agri Waste', 'to Energy'] as [string, string],
    description:
      'We convert agricultural residue into clean energy, reducing stubble burning and ' +
      'emissions while creating value for farming communities.',
    href: '/waste-to-energy/',
    ctaLabel: 'Know more about agri waste to energy',
    figureClassName: 'text-figure-agri',
  },
];

/**
 * "SAEL Pan India Green Footprint" — section 4.
 *
 * Coordinates are points in the map's own 620 × 660 viewBox, taken from the
 * client's `Mock 3 Approved/mapDots.js` geometry; every one of them lands on
 * the dotted landmass.
 *
 * Five of the six sites are corroborated by the client's PDF itself — Jalore
 * and its 298 MW appear in the map callout, Bhadra's biomass plant beside the
 * About section, Mizoram and Kishangarh in the Solutions band, and Greater
 * Noida on the business portfolio. **Kurnool is not**: it appears only in the
 * AI-generated reference, and its capacity is therefore marked rather than
 * repeated, per /CLAUDE.md §3. The handover does contain photography of a
 * Kurnool site, so the location is real; the figure is what needs confirming.
 *
 * `href` is absent throughout, so the design's "Visit Location" link does not
 * render. The destinations have not been supplied.
 */
export const presenceSites = [
  { id: 'bhadra', name: 'Bhadra (Rajasthan)', description: 'Biomass Plant', x: 180, y: 144 },
  {
    id: 'greater-noida',
    name: 'Greater Noida (UP)',
    description: 'Solar Cell Manufacturing',
    x: 222,
    y: 157,
  },
  {
    id: 'kishangarh',
    name: 'Kishangarh (Rajasthan)',
    description: 'Solar Module Plant',
    x: 174,
    y: 196,
  },
  { id: 'jalore', name: 'Jalore (Rajasthan)', description: '298 MW', x: 130, y: 222 },
  { id: 'mizoram', name: 'Mizoram', description: '21 MW Solar Plant', x: 515, y: 256 },
  {
    id: 'kurnool',
    name: 'Kurnool (Andhra Pradesh)',
    description: TODO_CONTENT,
    x: 234,
    y: 417,
  },
];

/**
 * The counts beside the map, exactly as the PDF sets them.
 *
 * Static for now, though they are arguably the same kind of value as the
 * capacity figures — a number the business owns that changes without a design
 * review. Worth a `getFootprintSummary()` on the repository when FE-05 builds
 * the contract out; it is not worth a method of its own today.
 */
export const presenceSummary = {
  // Not from the PDF: added at the client's request on 2026-08-05 so the
  // section has a heading of its own. The footprint label below is the PDF's.
  heading: 'Our Current Power Portfolio',
  title: ['SAEL Pan India', 'Green Footprint'] as [string, string],
  primaryStat: '11 States',
  secondaryStat: '60 Projects Sites',
};

/**
 * "Solutions" — section 5.
 *
 * Copy and card order are the client's PDF verbatim, including the plaque
 * lines: Patiala's is "Solar Plant" with no figure on it, where Mizoram's
 * carries "21 MW". That asymmetry is the design's, not an omission — Patiala's
 * capacity has not been supplied, and adding one would be inventing a number
 * for a company that publishes results. /CLAUDE.md §3.
 *
 * The PDF shows three cards across with a fourth alongside; the fourth is
 * Bhadra, corroborated by both the AI reference and the map's own site list.
 *
 * `alt` describes each photograph rather than repeating the plant's name and
 * capacity — the plaque is already text, and a screen reader reads it. These
 * are written from the images themselves and assert nothing about the business
 * that is not visible in the frame, but they are still copy and want a review.
 */
export const solutions: Omit<SolutionsCarouselProps, 'snap'> = {
  eyebrow: 'Solutions',
  title: 'Embracing Green Energy for a Sustainable World',
  lead:
    'With a plant first approach, we are making a sustainable impact by ' +
    'propelling green energy solutions.',
  slides: [
    {
      id: 'patiala',
      image: solPatiala,
      alt: 'Aerial view of long rows of solar panels raised over a canal, lined with trees',
      place: 'Patiala',
      descriptor: 'Solar Plant',
    },
    {
      id: 'mizoram',
      image: solMizoram,
      alt: 'Aerial view of solar panels stepped across forested hills at sunrise',
      place: 'Mizoram',
      descriptor: '21 MW Solar Plant',
    },
    {
      id: 'kishangarh',
      image: solKishangarh,
      alt: 'Aerial view of a manufacturing plant at dusk beside a highway, hills on the horizon',
      place: 'Kishangarh',
      descriptor: 'Solar Module Manufacturing Plant',
    },
    {
      id: 'bhadra',
      image: solBhadra,
      alt: 'Aerial view of a lit power plant at night, its chimney stack rising over scrubland',
      place: 'Bhadra',
      descriptor: 'Biomass Plant',
    },
  ],
};

/**
 * "Our Endeavour" — section 6.
 *
 * The three paragraphs are the client's PDF verbatim, with its line-break
 * hyphen in "unwaver-ing" closed up and its apostrophes normalised to the
 * typographic form used everywhere else on the site. Nothing else is altered.
 *
 * No title: the design's "OUR ENDEAVOUR" is the eyebrow and there is no
 * heading under it. See the note on `<EndeavourSplit>`.
 */
export const ourEndeavour: Omit<EndeavourSplitProps, 'snap'> = {
  eyebrow: 'Our Endeavour',
  body: [
    'At SAEL, we are continuously endeavouring to facilitate India’s adoption of clean ' +
      'and affordable energy projects. As one of India’s leading renewable energy ' +
      'companies, we are dedicated to enhancing the energy landscape nationwide.',
    'We are committed to environmentally sustainable and economically viable energy ' +
      'solutions. We are involved in developing and implementing renewable energy ' +
      'technologies, energy efficiency solutions, and possibly energy access initiatives ' +
      'for underserved communities.',
    'We acknowledge the pivotal role of energy access in enhancing the well-being and ' +
      'satisfaction of both our customers and the communities we serve. Our unwavering ' +
      'commitment is to improve access to sustainable and clean energy.',
  ],
  media: {
    image: endeavourGirl,
    // Describes the artwork, not the section. As with the About composite,
    // this is written from the image and asserts nothing about the business,
    // but it is still copy and wants a review.
    alt: 'A young girl in a white top, against solar panels lit in red and purple',
  },
};

/**
 * "Our Goals" — section 7.
 *
 * The client's design skips `features/04` §9, the SDG marquee, so this follows
 * "Our Endeavour" directly. Confirmed by the client on 2026-08-05: the SDG
 * section is not to be built for now.
 *
 * Copy is the PDF's verbatim, with its line-break hyphen in "renew-able"
 * closed up. Both the PDF and the Designer prototype carry the same three
 * paragraphs, so there is no source conflict here.
 *
 * **The icons are stand-ins.** The design draws three bespoke white line
 * marks — a target ringed by inward arrows, an eye with rays, two hands
 * cupping a lotus — and none was supplied in the handover. These are the
 * nearest equivalents from `lucide-react`, which is already a dependency and
 * matches the design's stroke weight. Swapping in the real artwork is a
 * one-line change per goal. Raised in docs/asset-inventory.md §9.
 */
export const ourGoals: Omit<GoalsGridProps, 'snap'> = {
  title: 'Our Goals',
  goals: [
    {
      id: 'mission',
      title: 'Mission',
      body:
        'SAEL is committed to reshaping the global energy panorama through scalable and ' +
        'sustainable solutions. We harness cutting-edge technologies and industry best ' +
        'practices to provide dependable and eco-friendly energy solutions, fostering the ' +
        'widespread adoption of renewable energy across diverse markets.',
      image: goalMission,
      icon: Crosshair,
    },
    {
      id: 'vision',
      title: 'Vision',
      body:
        'At SAEL, our vision is to spearhead the shift towards a sustainable energy future, ' +
        'where renewable sources drive economies and enhance lives. We envision a future ' +
        'where sustainable energy solutions seamlessly integrate into global infrastructure.',
      image: goalVision,
      icon: Eye,
    },
    {
      id: 'ethos',
      title: 'Ethos',
      body:
        'SAEL exemplifies an unwavering dedication to sustainable energy solutions, fueled ' +
        'by innovation, integrity, and holistic community empowerment. Our principles embody ' +
        'a culture of excellence, inclusivity, and accountability, fostering resonance with ' +
        'our global communities and partners.',
      image: goalEthos,
      icon: Sprout,
    },
  ],
};

import saelLogoDark from '@/assets/images/global/logo/sael-logo-dark.svg';
import saelLogo from '@/assets/images/global/logo/sael-logo.png';
import navModuleManufacturing from '@/assets/images/global/nav/module-manufacturing.jpg';
import navSolarCellManufacturing from '@/assets/images/global/nav/solar-cell-manufacturing.jpg';
import navSolarEnergy from '@/assets/images/global/nav/solar-energy.jpg';
import navWasteToEnergy from '@/assets/images/global/nav/waste-to-energy.jpg';
import { cdnImage } from './cdn';

/**
 * Artwork that belongs to the site rather than to a page.
 *
 * The bar for `global/` is that a change to the file changes more than one
 * page: the masthead logo, the footer wordmark and the four mega-menu
 * thumbnails are on every route the site has. An image used by one page lives
 * under that page's folder even if a second page might plausibly want it one
 * day — promoting it later is a two-line move, and guessing early is how a
 * `global/` folder becomes the place things go when nobody decides.
 */
export const globalImages = {
  logo: {
    /** The masthead mark. A raster until the client supplies the vector — docs/asset-inventory.md §4. */
    colour: cdnImage(saelLogo, 'global/logo/sael-logo.png'),
    /** The footer wordmark, drawn for a dark ground. */
    dark: cdnImage(saelLogoDark, 'global/logo/sael-logo-dark.svg'),
  },
  nav: {
    moduleManufacturing: cdnImage(navModuleManufacturing, 'global/nav/module-manufacturing.jpg'),
    solarCellManufacturing: cdnImage(
      navSolarCellManufacturing,
      'global/nav/solar-cell-manufacturing.jpg',
    ),
    solarEnergy: cdnImage(navSolarEnergy, 'global/nav/solar-energy.jpg'),
    wasteToEnergy: cdnImage(navWasteToEnergy, 'global/nav/waste-to-energy.jpg'),
  },
};

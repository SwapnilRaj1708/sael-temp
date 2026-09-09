import type { StaticImageData } from 'next/image';
import { env } from '@/lib/config/env';

/**
 * Where the site's own static media is served from.
 *
 * Two things are deliberately *not* in scope here. Backend-supplied files —
 * news images, investor PDFs, team photos — arrive from the API as paths and
 * are composed by `blobUrl()` in `@/lib/utils/blob-url`; they are content, not
 * artwork, and they change without a deploy. And the DIN webfonts stay bundled
 * and self-hosted through `next/font/local`, for the reasons in that module.
 *
 * ## The mirror
 *
 * The CDN's `images/` directory is an exact replica of `src/assets/images/`,
 * so one repository path names one CDN path with no lookup table:
 *
 *   src/assets/images/homepage/hero/hero-1.png
 *   <base>/images/homepage/hero/hero-1.png
 *
 * `AssetCategory` is the segment above that mirror. Only `images` has anything
 * in it today; `videos` and `documents` are the two the client has named, and
 * they cost nothing to reserve because the URL shape already anticipates them.
 *
 * ## Why the bundled import survives
 *
 * An asset is still imported normally, and the import is still the source of
 * truth for everything but the URL. That is not redundancy — a `StaticImageData`
 * carries the intrinsic width, height and `blurDataURL` that the bundler
 * measured, and `next/image` needs all three to reserve the right box and avoid
 * a layout shift. A bare CDN string throws that away and makes every call site
 * hand-write dimensions, which is precisely the magic number /CLAUDE.md §2.2
 * bans.
 *
 * So `cdnImage()` swaps one field. Everything downstream — every `<Image>`,
 * every `StaticImageData | null` prop — is untouched and cannot tell the
 * difference.
 *
 * ## The switch
 *
 * `NEXT_PUBLIC_CDN_BASE_URL` unset is the local default and leaves the app
 * byte-for-byte as it was: assets resolve to `/_next/static/media/…` exactly as
 * before. Set it and the same assets resolve to the CDN. Nothing else changes,
 * and there is no third state to reason about.
 *
 * It is a `NEXT_PUBLIC_` variable because the masthead's mega menu is a client
 * component, so its artwork has to resolve in the browser bundle too. Next
 * inlines it at build time, which means **changing it requires a rebuild, not a
 * restart** — the same rule the release archive's DEPLOY.txt already states.
 */

/** The directory under `web-assets/` that an asset lives in. */
export type AssetCategory = 'images' | 'videos' | 'documents';

/** Trailing slashes are stripped once, here, rather than at every call site. */
const CDN_BASE = env.NEXT_PUBLIC_CDN_BASE_URL?.replace(/\/+$/, '');

/** True when a CDN base is configured. Exported for diagnostics, not for branching in a component. */
export const isCdnEnabled: boolean = CDN_BASE !== undefined;

/**
 * Compose the CDN URL for a repository-relative asset path, or `null` when no
 * CDN is configured and the caller should fall back to the bundled file.
 *
 * `path` is relative to the category directory and mirrors the repository:
 * `'homepage/hero/hero-1.png'`, not `'/images/homepage/hero/hero-1.png'`.
 */
export function assetUrl(category: AssetCategory, path: string): string | null {
  if (CDN_BASE === undefined) return null;

  return `${CDN_BASE}/${category}/${path.replace(/^\/+/, '')}`;
}

/**
 * Point a bundled image at the CDN, keeping its measured dimensions.
 *
 * `path` must be the asset's path under `src/assets/images/`. It is stated
 * rather than derived because the bundler flattens and content-hashes the
 * emitted filename, so the folder it came from is not recoverable at runtime.
 * That leaves the import and the string as two things that must agree, and
 * `pnpm verify:guardrails` asserts that they do — a typo is a failed check,
 * not a production 404.
 */
export function cdnImage(bundled: StaticImageData, path: string): StaticImageData {
  const url = assetUrl('images', path);

  if (url === null) return bundled;

  return { ...bundled, src: url };
}

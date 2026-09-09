# Asset layer

Where the site's own images come from, and how a page adds more.

## The shape

```
src/lib/assets/
├── cdn.ts        the base URL, the URL builder, and cdnImage()
├── global.ts     artwork used on every route — the logo, the mega-menu thumbnails
└── homepage.ts   one module per page, named after the route
```

`src/assets/images/` mirrors it:

```
src/assets/images/
├── global/
│   ├── logo/
│   └── nav/
└── homepage/
    ├── about/  business/  endeavour/  goals/  hero/  presence-map/  solutions/
```

and the CDN mirrors that in turn, so one repository path names one CDN path:

```
src/assets/images/homepage/hero/hero-1.png
$NEXT_PUBLIC_CDN_BASE_URL/images/homepage/hero/hero-1.png
```

## Adding a page's assets

1. Put the files in `src/assets/images/<page>/<section>/`, kebab-case and
   lowercase. Blob Storage paths are case-sensitive and the Windows filesystem
   is not, so `Hero.png` is a bug that only appears in production.
2. Create `src/lib/assets/<page>.ts`, import each file, and wrap it:

   ```ts
   import heroPlant from '@/assets/images/solar-energy/hero/plant.jpg';
   import { cdnImage } from './cdn';

   export const solarEnergyImages = {
     hero: cdnImage(heroPlant, 'solar-energy/hero/plant.jpg'),
   };
   ```

3. Read it from that page's `_content` module. Section components stay
   content-agnostic and never import this layer — /CLAUDE.md §5.

`pnpm verify:guardrails` checks that the string and the import agree, that the
file exists, and that the path is lowercase. A mismatch is a failed check
rather than a production 404.

## Why the import stays

`cdnImage()` swaps one field on the bundled `StaticImageData` and keeps the
rest. The bundler measured the intrinsic width, height and `blurDataURL`, and
`next/image` needs all three to reserve the right box; a bare URL string throws
them away and makes every call site hand-write dimensions, which is the magic
number /CLAUDE.md §2.2 bans.

It also means the switch is total and reversible: with `NEXT_PUBLIC_CDN_BASE_URL`
unset the app is byte-for-byte what it was before this layer existed.

## Why there is no index.ts

A barrel re-exporting every page would be imported by the masthead — which is a
client component — and would pull every other page's imagery into the browser
bundle with it. Import the page module directly.

## What is not here

- **Fonts.** `next/font/local` self-hosts DIN and emits the preloads. Moving it
  to a CDN adds a cross-origin round trip on the critical path and puts a
  commercially licensed typeface on public storage. See `src/lib/fonts.ts`.
- **Icons.** `src/assets/icons/` compiles to React components through SVGR, so
  those files never become URLs at all. They are inlined into the bundle and
  inherit `currentColor`, which is the whole reason they are separate from
  `images/`. See `src/types/svg.d.ts`.
- **Backend content.** News images, investor PDFs and team photos arrive from
  the API and are composed by `blobUrl()` in `@/lib/utils/blob-url`. They change
  without a deploy; this layer does not.

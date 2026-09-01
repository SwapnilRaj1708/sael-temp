# SAEL Homepage — Hero Section Spec (for Claude Code)

Source of truth: the approved designer build. Reproduce these values exactly in the production code.
Do not re-derive crops, do not "improve" positions, do not change the aspect ratio.

---

## 0. Why the production hero currently looks wrong

The crop of each hero photo is **baked into the image files**, not expressed in CSS.
The designer build uses four pre-cropped 2.34:1 JPGs. If production still points at the
original oversized source photos, no amount of `object-position` tuning will match.

**Step 1 is therefore a file copy, not a code change.** Copy these four files from the
designer project's `assets/` folder into the production image directory and repoint the code:

| File | Dimensions | Ratio | Size |
|---|---|---|---|
| `hero-modules.jpg` | 1360 × 581 | 2.341 | 68 KB |
| `hero-generation.jpg` | 2400 × 1026 | 2.339 | 262 KB |
| `hero-vision.jpg` | 2400 × 1026 | 2.339 | 187 KB |
| `hero-agri.jpg` | 2400 × 1026 | 2.339 | 226 KB |

Note: `hero-modules.jpg` is only 1360px wide, so it upscales slightly on a 1920 display.
Acceptable as-is; flag it if a sharper re-crop is wanted later.

Icons (SVG, unchanged): `icon-1-symbol.svg`, `icon-2-symbol.svg`, `icon-3-symbol.svg`, `icon-4-symbol.svg`.

---

## 1. Hero container

```css
position: relative;
width: 100%;
aspect-ratio: 2.34 / 1;   /* NOT 16/9 — client comps are cinematic ultrawide */
margin-top: 84px;         /* fixed header height */
overflow: hidden;
background: #111418;
```

Design target is a fixed 1080p (1920px-wide) viewport. All sizes below use `vw` /
`clamp()` so they scale, but 1920 is the only size that must be pixel-correct.

## 2. Slide data

Four slides, autoplaying every **6 s**, crossfading (`opacity 1.1s ease`).

`iconX` / `iconY` and `textX` / `textY` are **percentages of the hero box**, and they mark the
element's **CENTER** — every positioned element is `translate(-50%, -50%)`-centred
(the `<h1>` is centred vertically only: `translateY(-50%)`, `left` is its left edge).

| # | photo | icon | iconX | iconY | iconSize | textX | textY | textW | align | headline |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | hero-modules.jpg | icon-2-symbol.svg | 12% | 70% | 18.5vw | 64% | 43% | 31vw | left | A leading manufacturer for Bifacial TOPCon solar modules |
| 2 | hero-generation.jpg | icon-3-symbol.svg | 88% | 70% | 18.5vw | 8% | 48% | 31vw | left | Generating clean energy by investing in advanced technology and systems |
| 3 | hero-vision.jpg | icon-1-symbol.svg | 11% | 70% | 18.5vw | 58% | 46% | 31vw | left | A vision to building the capacity for India’s clean energy needs |
| 4 | hero-agri.jpg | icon-4-symbol.svg | 43% | 60% | 18.5vw | 58% | 49% | 30vw | left | Converting ~2 million tonnes of paddy waste into clean energy |

Headline copy is verbatim. Slide 3 uses a typographic apostrophe (`’`, U+2019) in "India’s".

All four photos use `object-fit: cover; object-position: center`.

## 3. Layer stack (bottom → top), per slide

Each slide is an absolutely-positioned full-bleed wrapper:
`position:absolute; inset:0; opacity:<1 if active else 0>; transition:opacity 1.1s ease; pointer-events:none`.

**3a. Photo wrapper** (this is what carries the cursor parallax)

```css
position: absolute; inset: 0; overflow: hidden;
transform: scale(1.06) translate({mx*10}px, {my*10}px);
transition: transform .5s ease-out;
```

**3b. Photo** (Ken Burns — runs only on the active slide)

```css
position:absolute; inset:0; width:100%; height:100%;
object-fit: cover; object-position: center;
transform-origin: center;
animation: saelKen 9s ease forwards;   /* "none" when slide inactive */
```
```css
@keyframes saelKen { from { transform: scale(1.04) } to { transform: scale(1.12) } }
```

**3c. Scrim** — `position:absolute; inset:0`, two stacked gradients. The linear direction
flips based on which side the text sits: `90deg` when `textX < 50%`, else `270deg`.

```css
background:
  linear-gradient(<90deg|270deg>,
    rgba(8,10,14,0.72) 0%,
    rgba(8,10,14,0.28) 40%,
    rgba(8,10,14,0)    66%),
  radial-gradient(120% 130% at 50% 42%,
    rgba(0,0,0,0) 52%,
    rgba(0,0,0,0.42) 100%);
```

**3d. Icon**

```css
position: absolute; left: <iconX>; top: <iconY>;
width: <iconSize>; height: auto;
transform: translate(calc(-50% + {mx*24}px), calc(-50% + {my*24}px));
transition: transform .5s ease-out;
filter: drop-shadow(0 6px 26px rgba(0,0,0,0.35));
```

Icon SVGs must keep their own `viewBox` intact — a wrong viewBox clips the glyph
(this was a real bug in the designer build; check `icon-4-symbol.svg` especially).

**3e. Headline `<h1>`**

```css
position: absolute; left: <textX>; top: <textY>; width: <textW>;
transform: translate({mx*-14}px, calc(-50% + {my*-14}px));
transition: transform .5s ease-out;
margin: 0; text-align: left;
font-family: 'DIN', sans-serif;
font-weight: 400;
font-size: clamp(32px, 3vw, 58px);
line-height: 1.08;
letter-spacing: 0.2px;
color: #fff;
text-shadow: 0 2px 26px rgba(0,0,0,0.5);
text-wrap: pretty;
```

Word-by-word reveal: split the headline on spaces, wrap each word in

```css
display: inline-block;
margin-right: 0.27em;
animation: fxWord .7s cubic-bezier(.2,.7,.2,1) both;
animation-delay: calc(index * 0.055s);   /* 0s and animation:none when inactive */
```
```css
@keyframes fxWord {
  0%   { opacity:0; transform:translateY(32px); filter:blur(9px) }
  100% { opacity:1; transform:translateY(0);    filter:blur(0) }
}
```

The per-word spans must be **re-keyed on slide change** so the reveal replays on each slide.

## 4. Cursor parallax

`mx` / `my` are normalised −1…1 from the pointer position over the hero:

```js
const r = hero.getBoundingClientRect();
mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
// mouseleave → mx = my = 0
```

Depth multipliers: photo `10px`, icon `24px`, headline `-14px` (headline moves opposite).

## 5. Letterbox intro (plays once on load)

Two bars, `z-index:6`, `pointer-events:none`, `background:#05070a`, each `height:50%` —
one pinned top (`transform-origin:top`), one pinned bottom (`transform-origin:bottom`):

```css
animation: fxLetter 1s cubic-bezier(.7,0,.2,1) both;
```
```css
@keyframes fxLetter { 0% { transform: scaleY(1) } 100% { transform: scaleY(0) } }
```

## 6. Progress dots

Container: `position:absolute; bottom:34px; left:0; right:0; display:flex; justify-content:center; gap:11px; z-index:7`.

Each dot is a `<button>`: `height:6px; border-radius:99px; border:none; padding:0; cursor:pointer; overflow:hidden; position:relative; transition:all .3s`.

| state | width | background |
|---|---|---|
| active | 34px | rgba(255,255,255,0.30) |
| inactive | 6px | rgba(255,255,255,0.45) |

The active dot contains a fill bar showing autoplay progress:

```css
position:absolute; left:0; top:0; bottom:0; width:0;
background:#e11d34;
animation: fxFill 6s linear forwards;   /* duration == autoplay interval */
```
```css
@keyframes fxFill { from { width:0 } to { width:100% } }
```

Clicking a dot jumps to that slide.

## 7. Deliberately OFF

Icon idle motion and film grain were evaluated and rejected. Do not add them.

---

## Acceptance check

At a 1920px-wide viewport, each slide should read as: photo full-bleed at 2.34:1 with no
letterboxing or visible re-crop, icon and headline sitting where the client comps show them,
and nothing clipped at the hero edges. If a photo looks off-centre, the wrong file is being
loaded — the crop is in the file, not the CSS.

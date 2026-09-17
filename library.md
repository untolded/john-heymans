# Reference library

Teardowns of two athlete personal-brand sites, recorded for the John Heymans build. Every claim here comes from inspecting the live sites: rendered DOM, computed styles, downloaded stylesheets, downloaded JS bundles, and screenshots at multiple scroll positions and viewports. Screenshots referenced below live in [reference/](reference/).

Analysed 14 September 2026.

| | landonorris.com | nickho-motorsports.nl |
|---|---|---|
| Subject | F1 driver, global celebrity | Porsche Carrera Cup driver, early career |
| Job of the site | Fan hub, brand home, merch funnel | Sponsor acquisition |
| Built by | OFF+BRAND (`lando.itsoffbrand.io`) | weareboring.nl |
| Platform | Webflow, multi-page, Taxi.js soft navigation | Webflow, single page, anchor nav |
| Budget signal | Very high | Mid, spent well |
| One bold element | Photoreal 3D helmet that assembles onto a live portrait | Cursor-driven fluid trail that wipes colour into a greyscale photo |

Both are directly relevant to us: both sell an athlete to an audience that is not primarily made of fans of the sport, both lean on sport-specific data vernacular instead of generic "inspiration" design, and both are Webflow sites carrying a lot of custom code. Neither uses a speaker-bureau visual language anywhere.

---

# 1. landonorris.com

## 1.1 Verdict first

This is the benchmark for "expensive and fast". The premium feeling does not come from restraint or from luxury cliché. It comes from four things:

1. **One typographic idea, executed everywhere.** A hairline-contrast display serif and a heavy variable grotesque, mixed *inside a single sentence*, word by word.
2. **A proprietary background pattern** derived from the subject's own visual property (his helmet livery), drawn as contour hairlines.
3. **Vector animation everywhere at small scale.** Not fades: purpose-built Rive animations on buttons, icons, circuit maps and signatures.
4. **Colour theme changes per section**, wholesale, with the nav inverting to match.

The mistake would be to read it as "dark green and lime". The transferable part is the system, not the palette.

## 1.2 Tech stack (verified)

```
Platform      Webflow (cdn.prod.website-files.com)
Custom JS     lando-by-OFF+BRAND.05.js  (1.32 MB uncompressed, referrer-locked)
Smooth scroll Lenis 1.1.20
Animation     GSAP 3.13.0 + ScrollTrigger + SplitText (bundled, not global)
3D            Three.js r174, one <canvas class="gl"> in .gl-wrap
Vector anim   Rive, ~20 canvases on the homepage alone
Routing       Taxi.js (data-taxi, data-taxi-view) for soft page transitions
Video         Vimeo, lazily instantiated via data-stream-url
Images        WebP, srcset, sizes, loading="lazy"
Fonts         2 files total: Brier-Bold.woff2, MonaSans-VariableFont_wdth,wght.woff2
```

Lenis config as running in production:

```js
{ smoothWheel: true, lerp: 0.1, wheelMultiplier: 1,
  syncTouch: true, syncTouchLerp: 0.075, touchInertiaMultiplier: 35,
  touchMultiplier: 1.25, autoRaf: false, overscroll: true, anchors: false }
```

`autoRaf: false` means Lenis is ticked from GSAP's ticker, which is the correct way to keep ScrollTrigger and Lenis in sync.

26 ScrollTriggers use `scrub: true`. Easing vocabulary across the bundle, by frequency: `power2.out` (36), `power2.inOut` (15), `power1.inOut` (12), `expo.inOut` (12), `power3.out` (10), then `expo.out`/`expo.in` (5 each). Plus one CSS token, `--cubic-default: cubic-bezier(0.65, 0.05, 0, 1)` with `--duration-default: 0.75s`.

**Rive files loaded:** `btn-ui.riv`, `circuits.riv`, `ln4.riv`, `signature.riv`, `phrases.riv`, `page-transition.riv`, `reef.riv`, `mob-landscape.riv`.

## 1.3 The fluid scaling system (steal this)

The single most useful technical decision on the site. Root font size is computed from viewport width against a fixed design width:

```css
--min-width: 992px;
--max-width: 1920px;
--design-width: 1728;
--design-unit: 16;
--scale-factor: 1;
--fluid-container: clamp(var(--min-width), 100vw, var(--max-width));
--fluid-font: calc(var(--fluid-container) / var(--design-width) * var(--design-unit) * var(--scale-factor));
```

Measured: at a 1200px viewport, computed `html { font-size: 11.1111px }`, which is exactly `1200 / 1728 × 16`.

Everything else on the site is in `rem`. The consequence: between 992px and 1920px the entire design scales proportionally, like zooming a Figma frame. No per-breakpoint type scale, no clamp() on 40 individual properties, no layout drift. Below 992px the scaling stops and three real breakpoints take over (`max-width: 991px`, `767px`, `479px`).

For us this is worth adopting almost verbatim. It makes a design "feel designed" at every desktop width, and it removes an entire category of responsive bugs.

## 1.4 Colour tokens (exact, from CSS)

```
--color--dark-green          #282c20   primary dark ground
--color--dark-green-tint-1   #3b3c38
--color--dark-green-tint-2   #535450
--color--black               #111112   near-black section ground
--color--lime                #d2ff00   accent, CTAs, signatures, loader
--color--lime-off            #b2c73a   muted lime for large display type
--color--lime-zero           #d2ff0000 transparent lime, for tertiary buttons
--color--white               #f4f4ed   warm white
--color--cream               #efefe5   light ground
--color--grey-1 / green-light #ebeee0
--color--green-off-white-1   #dde1d2   body copy on dark
--color--green-off-white-2   #b4b8a5   secondary text
--color--grey-2              #c8cbbd
--color--grey-on-track       #b9bbad
--color--orange              #ff6b00   used sparingly (cursor arrow, McLaren nod)
```

Note what is not here: no blue, no purple, no gradient tokens, no shadow tokens. Depth comes from photography and from theme changes, never from drop shadows.

Two observations worth carrying over:
- **Nothing is pure white or pure black.** Every neutral is warmed or greened. That alone kills the template feeling.
- **The accent has a muted sibling.** `#d2ff00` is used at small sizes (buttons, signatures, single words). At display sizes they switch to `#b2c73a`, because full-saturation lime at 130px is unreadable and cheap-looking. This is the sort of detail we need.

## 1.5 Typography

Two families, two files.

**Brier Bold** (one weight only). High-contrast display serif, closer to a modern/didone with sharp unbracketed serifs. Used for: the word "LANDO" in the logo, one to three words per headline, section subheads, and pull quotes. Never for body copy, never below about 18px except in the quote treatment.

**Mona Sans Variable** (GitHub's open-source font, SIL OFL, free). Both `wght` and `wdth` axes in play, and the values chosen are deliberately non-standard:

```css
.text-impact-lg-mona  { font-variation-settings: "wght" 660, "wdth" 93;
                        font-size: var(--text--impact); /* 7.9375rem */
                        letter-spacing: -.0625rem; line-height: 90.6%;
                        text-transform: uppercase; }
.text-impact-reg-mona { font-variation-settings: "wght" 750, "wdth" 93;
                        font-size: 7rem; letter-spacing: -.25rem; line-height: .816; }
.text-eyebrow         { font-variation-settings: "wght" 700, "wdth" 100;
                        font-size: .625rem; letter-spacing: 0;
                        text-transform: uppercase; line-height: 1; }
.text-eyebrow.large   { font-variation-settings: "wght" 812, "wdth" 81.3;
                        font-size: 1.125rem; letter-spacing: -.01rem; }
.text-on-t-stat-label-large { font-variation-settings: "wght" 700, "wdth" 75;
                        font-size: 2.75rem; line-height: .97; text-transform: uppercase; }
.text-impact-lg-brier { font-family: Brier; font-size: 8.25rem;
                        letter-spacing: -.1875rem; line-height: 83%; }
```

Type scale tokens: `--text--h1: 4rem`, `--text--h2: 4.5rem`, `--text--h3: 2rem`, `--text--h4: 1.5rem`, `--text--h5: 1.2rem`, `--text--h6: 1rem`, `--text--reg: 1.6rem`, `--text--med: 2.76rem`, `--text--impact: 7.9375rem`, `--text--eyebrow: .578125rem`.

Things to notice:

- **Line height below 1 on display type** (0.816, 0.83, 0.906). Lines physically touch. This is most of the "expensive" feeling.
- **Negative letter-spacing scaled to size.** Up to `-.25rem` at 7rem.
- **The eyebrow is NOT tracked out.** `letter-spacing: 0` at 10px uppercase. Our CLAUDE.md bans tracked-out all-caps eyebrows as a default; this site independently reached the same conclusion, and it reads as more confident.
- **Width axis used as a design tool.** `wdth 75` for stat labels, `wdth 81.3` for large eyebrows, `wdth 93` for display. Condensing is a deliberate move, not a fallback.

### The signature typographic move

Mixing the two families *inside one sentence*, with the serif carrying the emotionally loaded words:

- "**REDEFINING** limits, fighting for **WINS** ... Defining a **LEGACY** in Formula 1" (serif lime, sans off-white)
- "WORLD DRIVERS' **CHAMPION**" (sans heavy, then serif)
- "HELMETS / **HALL OF FAME**"
- "WHAT'S UP / **ON SOCIALS**"
- "ALWAYS **BRINGING** THE **FIGHT**."
- "F1 CAREER / **SINCE 2019**"
- The logo itself: **LANDO** in serif, **NORRIS** in the heavy sans, stacked.

It appears at least seven times on the homepage. Because the logo encodes the same pairing, every headline reads as branded. That is the mechanism to copy: **make the wordmark a miniature of the type system, then repeat the pairing as the emphasis device throughout.**

See [reference/lando-1800.png](reference/lando-1800.png), [reference/lando-9000.png](reference/lando-9000.png), [reference/lando-footer.png](reference/lando-footer.png).

## 1.6 The ownable background pattern

Thin hairline contours that wander across every light section, visible in [reference/lando-4200.png](reference/lando-4200.png). They are the outlines of the "blobs" from his helmet livery, blown up and traced. The Rive asset is called `reef.riv`.

This is exactly the "spend the freedom on the subject" instruction in our brief, executed. It is not a generic noise texture or a grid. It is *his* graphic property, abstracted until it reads as a background.

Our equivalents to consider: the shape of a 5000m lap, altitude profiles, the shape of a world-ranking curve, lane-line geometry, or the literal plot the algorithm produced. Not a generic grid.

## 1.7 Section-by-section storyline

The homepage runs ~11,950px at 831px viewport height, roughly 14 screens. The narrative is deliberate.

**1. Loader** ([reference/lando-loader.png](reference/lando-loader.png)). Full-bleed lime. Animated LN monogram (Rive). One small button at the bottom: **"LOAD NORRIS"**. The user clicks to enter. A gate, not a spinner, and a joke in the brand voice.

**2. Hero** ([reference/lando-hero.png](reference/lando-hero.png)). Full-bleed studio portrait, eye contact, cropped at the shoulders. A wireframe helmet is ghosted over his head; it assembles into the photoreal helmet under pointer or scroll control (Three.js, `data-gl-helmet="hover"`, `data-mouse-track`). No hero copy beyond the name lockup top-left and an H1/H2 that are visually suppressed. Bottom-left: a ticket-shaped card, **NEXT RACE**, with a Rive circuit map, "Baku GP", and a laurel badge "MCLAREN F1 SINCE 2019". That is the entire hero. Face, helmet, next race.

**3. Message from Lando** ([reference/lando-900.png](reference/lando-900.png)). Theme flips to dark green. Two counter-running marquees, one lime serif, one cream sans. A small portrait video in the centre. A huge lime signature drawn over the whole thing. The signature is the transition device between the public figure and the personal message.

**4. Mission statement** ([reference/lando-1800.png](reference/lando-1800.png)). Six lines of centred display type, mixed families, filling the viewport. No image. This is where the proposition is stated, and it is given a full screen with nothing else on it.

**5. Scattered photo grid** ([reference/lando-2900.png](reference/lando-2900.png), [reference/lando-4200.png](reference/lando-4200.png)). Theme returns to cream. Photographs at wildly different sizes and vertical offsets, moving at different parallax speeds, mixing colour and black and white. Each carries a tiny uppercase caption above it: "MIAMI GP, 2024", "BATTERSEA, 2024". Two pull quotes sit inline in the grid, in Brier, with the signature beneath. One image carries a "1" plus chequered-flag chip.

The captions do heavy lifting: they turn a mood gallery into a record of a life, with places and dates. Directly applicable to our photo credits requirement (Jelle Jansegers, Raf Thomas), and it makes credits look intentional instead of like legal small print.

**6. On Track / Off Track** ([reference/lando-5600.png](reference/lando-5600.png)). A mirrored two-door navigation block. Helmet in profile on the left, his face in profile on the right, both facing inwards. "ON TRACK" and "OFF TRACK" centred, each mixing serif and sans. A lime handwritten scribble (`phrases.riv`) sits over the pair and switches between "on" and "off" depending on which side you are pointing at. Two lime icon buttons with Rive arrows.

This is the site's IA reduced to a single, physical choice. Worth remembering when we decide how to split "the keynote" from "the person".

**7. Helmets Hall of Fame** ([reference/lando-6800.png](reference/lando-6800.png), [reference/lando-7700.png](reference/lando-7700.png)). Theme flips to near-black `#111112`. Four-column masonry, columns scrolling at different speeds. Each card is a hairline-bordered rounded rectangle whose border *notches around* a caption plate at the bottom right, like a ticket stub. Caption is name plus year. Sixteen helmets, 2019 to 2025.

Mechanically this is "a gallery of objects with dates". Its real job is to prove longevity. Our equivalent could be the competition schedule the algorithm produced, or a season-by-season ranking ladder.

**8. Store** ([reference/lando-9000.png](reference/lando-9000.png)). Eyebrow with icon, mixed-family headline, three lines of copy, one lime pill CTA. Right side: product shots floating at different depths with a gold "LN1" lockup. Commercial, but composed like an editorial spread.

**9. Partners and campaigns.** Marquee rows with a WebGL treatment (`marquee-gl-rive-w`).

**10. Socials** ([reference/lando-10200.png](reference/lando-10200.png)). Nine-by-sixteen cards fanned on an arc, centre card upright and largest, others rotated along the curve. Rive icon above the heading.

**11. Footer** ([reference/lando-footer.png](reference/lando-footer.png)). The best composition on the site. A dark green panel with a large corner radius, and a notch cut out of its top edge where the helmet enters. Behind it, the page background runs to a lime gradient. A helmet shot from behind rises through the notch. Headline "ALWAYS BRINGING THE FIGHT." in mixed families with a lime signature over it. Two link columns flanking the helmet. Partner logos. A lime bar at the very bottom carrying copyright and legal links. One pill CTA: **"BUSINESS ENQUIRIES"** linking to `mailto:business@landonorris.com`.

Note where the commercial contact lives: at the very bottom, once, in plain language, with no form. On our site the enquiry has to work much harder, but the tone is right.

## 1.8 Interaction and component inventory

Full `data-*` attribute inventory from the bundle, which reads as a component library:

```
Scroll / layout    data-oval-scroll, data-sticky-hero, data-horizontal-section,
                   data-svg-origin, data-grid-spacer, data-podium
Theme              data-nav-theme, data-nav-theme-target, data-nav-group,
                   data-nav-img, data-nav-link-highlight
3D helmet          data-gl-helmet, data-gl-switcher, data-gl-hover, data-gl-track,
                   data-gl-change-from, data-gl-change-to, data-gl-change-trigger-start/end
Rive               data-rive-file, data-rive-artboard, data-rive-state-machine,
                   data-rive-input, data-rive-input-color/track/weight,
                   data-rive-scrolltrigger + -start/-end/-target,
                   data-rive-circuit-hover (+ -target, -text), data-btn-rive-hover,
                   data-rive-instant-play, data-rive-nav-hamburger
Reveal             data-reveal-color, data-reveal-delay, data-reveal-direction,
                   data-list-reveal, data-text-highlight, data-text-hover-chars,
                   data-image-highlight, data-anim="text-hover", data-anim-high
Data               data-cal-list, data-cal-item, data-cal-target, data-cal-control,
                   data-cal-sprint, data-calendar-history, data-countdown-digit,
                   data-countdown-date-target, data-stat-list, data-stat-item,
                   data-stat-hover-img, data-car-counter
Media              data-video-stream, data-stream-url, data-stream-autoplay,
                   data-stream-hover, data-stream-loop, data-stream-muted
Routing            data-taxi, data-taxi-view, data-taxi-ignore, data-taxi-nocache
Misc               data-mouse-track, data-heroflip, data-home-swipe-toggle,
                   data-lenis-prevent, data-scroll-disabled, data-engine, data-exe-visor
```

### Effects worth naming individually

**Elliptical section reveals.** `clip-path: ellipse(...)` used at five values, driven by `data-oval-scroll`:

```css
ellipse(100% 0% at 50% 0)     /* closed */
ellipse(70% 100% at 50% 0)
ellipse(100% 120% at 50% 0)
ellipse(120% 100% at 50% 20%)
ellipse(120% 120% at 50% 0)   /* open */
```

Sections arrive under a domed edge that flattens as you scroll. Far more distinctive than a fade-up, costs one animated property, and GPU-composites cleanly. Also `--oval-side-offset: 3rem` and one `polygon(0 -2%, 0 94%, 100% 94%, 100% -2%)` for a straight variant.

**Theme switching.** Invisible sentinel elements (`.hero-nav-theme.is-1` at 10vh, `.is-2` at 90vh, `.sticky-track-theme-change`, `.helmet-nav-theme-target`) trigger a wholesale palette flip for the section and invert the nav. The nav logo also uses `mix-blend-mode: difference` so it stays legible across the boundary. `mix-blend-mode: saturation` is used for the greyscale image treatment, and `plus-lighter` for glows.

**Page transitions.** A fixed `.transition-w` at `z-index: 9999`, `background-color: var(--color--lime)`, `100vw × 100svh`, containing a full-bleed Rive animation (`page-transition.riv`). Taxi.js swaps the view underneath.

**Nav menu** ([reference/lando-menu.png](reference/lando-menu.png)). Full-screen dark green. Right-aligned list in heavy sans caps. The current page is struck through with a hand-drawn wobbly lime line (Rive), not a CSS underline. Left: a 2×2 grid of black and white photos. Laurel badge and "MCLAREN F1 SINCE 2019" beneath the list. Business enquiries and socials at the bottom. Hamburger morphs to an × in a white rounded square.

**Buttons.**

```css
.btn-w          { background: var(--color--lime); border: 1px solid var(--color--lime);
                  color: var(--color--dark-green); height: 3rem;
                  border-radius: .54rem; padding-inline: 1rem; }
.btn-w.icon-only{ aspect-ratio: 1; width: 3.75rem; height: 3.75rem; }
.btn-w.is-nav   { height: 3.75rem; }
.btn-w.tertiary { background: var(--color--lime-zero); color: currentColor;
                  border-color: currentColor; border-radius: .411875rem; height: 2.5rem; }
```

The radii are `.54rem` and `.411875rem`. Not 4, 8 or 12px. Those oddly specific values are a fingerprint of a design that was drawn, not assembled from a UI kit. Every button icon is a Rive animation (`btn-ui.riv`) rather than a static SVG arrow, which is how they get an animated arrow without appending an arrow glyph to the label.

**Accessible animated text.** Every split-text headline exists twice in the DOM: the real, semantic, readable element, plus an `aria-hidden` per-character or per-line clone that carries the animation. Verified on `/on-track`. This is the correct pattern and we should use it.

## 1.9 Data presentation (most relevant part for us)

The `/on-track` and `/calendar` pages are a masterclass in turning sport data into design.

**Hero data strip** ([reference/lando-ontrack-hero.png](reference/lando-ontrack-hero.png)). Under a giant "ON TRACK" that bleeds off both edges, a row of three facts spread across the full width in small bold caps: `LAST LAP LANDO` / `26 Y.O` / `BRISTOL, UK 🇬🇧`. Spread and aligned, not joined by middle dots.

**Modular scoreboard.** Bottom right of that hero: a grid of hairline-divided cells holding PREVIOUS / SPAIN GP / 3RD, NEXT / RND.17 / BAKU, a laurel badge, a Rive circuit map, the race number in lime, and the signature. It reads like a timing screen. This is the single most directly transferable block on either site for John's world-ranking story.

**Full-bleed stat numerals** ([reference/lando-ontrack-stats.png](reference/lando-ontrack-stats.png), [reference/lando-ontrack-stats2.png](reference/lando-ontrack-stats2.png)). "49" set so large it fills the screen, with "PODIUMS" locked to its baseline. Then a career stats grid: two-line label in tiny bold caps above, enormous numeral below, and a lime handwritten annotation ("P1") scribbled over one of them.

**Race card** ([reference/lando-calendar.png](reference/lando-calendar.png)). Labels at 10px bold uppercase (WHEN, LENGTH, DISTANCE, FIRST COMPETED, LAPS); values large in lime with units small in white; a session schedule as a hairline-ruled table where the single important row (RACE) is lime; the city name set vertically down the left outside the panel; the circuit map with numbered turns drawn beneath; tertiary outline buttons "TRACK VISUALISER" and "CALENDAR LIST".

**Numbers animate as odometers,** and a countdown runs to the next race.

## 1.10 Mobile

[reference/lando-mobile.png](reference/lando-mobile.png). The logo recomposes to a single centred line, "LANDO" serif plus "NORRIS" sans, with "MCLAREN F1 SINCE 2019" beneath. The store button moves top-left, menu top-right. The 3D helmet visor animates across the face. Bottom right: a lime button labelled **"TAP TO LOCK"** with a hand icon, which hands the helmet's rotation to touch or gyroscope. A dedicated `mob-landscape.riv` prompts rotation where needed.

The lesson: the hero interaction was redesigned for touch rather than disabled.

## 1.11 Where it falls short

Measured, not guessed:

- **Zero `prefers-reduced-motion` handling.** Not one occurrence in 188 KB of CSS or 1.32 MB of JS. On a site that scrubs 26 ScrollTriggers and runs Three.js plus twenty Rive canvases, this is a real accessibility failure.
- **No `:focus-visible` styling.** The stylesheet contains `outline: 0` eight times and `outline: none` once. Keyboard focus is invisible.
- **Weight.** 1.32 MB of custom JS before GSAP, Three.js and the Rive runtime.
- The `--gap--med` CSS variable is literally named `--gap--med<deleted|variable-196f1660-...>`, a leaked Webflow artefact. Harmless, but it shows through.

Our brief sets a hard quality floor on all four points. We take the ideas and fix the failures.

---

# 2. nickho-motorsports.nl

## 2.1 Verdict first

A much smaller budget, spent with precision. One page, one accent colour, two typefaces, black and white photography, and a visible column grid. It succeeds because it commits absolutely to a monochrome system and then spends all its colour on three moments: the cursor trail, the highlighted calendar row, and the helmet.

The single most important thing to learn here: **this site is structured as a sponsor pitch and it never pretends otherwise.** Credentials, proof, story, schedule, media validation, downloadable sponsor deck, contact. If our site's job is booking enquiries, this is closer to our brief than Lando's is.

## 2.2 Tech stack (verified)

```
Platform      Webflow + Slater (assets.slater.app) for code, Finsweet Attributes v2
Smooth scroll Lenis 1.1.18
Animation     GSAP 3.15.0 + ScrollTrigger + SplitText + CustomEase (global builds)
3D / WebGL    Three.js r128, two canvases: hero fluid stage + helmet
Slider        Swiper 12
Video         hls.js 1.6.11 streaming from Bunny CDN (b-cdn.net, .m3u8)
Fonts         3 subset .woff files: Anton Regular, Helvetica, Helvetica Bold
Custom JS     26 ES modules, ~95 KB total, one concern each
```

The Slater module architecture is genuinely worth copying as an organising principle. Each module is one self-contained effect with a config object at the top:

| Module | Purpose |
|---|---|
| `initPageLoader` | Loader gate, feature-detects the fluid hero before deciding |
| `initLoaderNumberScroll` | Odometer digits on the loader |
| `heroFluid` (20 KB) | Depth-map fluid trail |
| `initLineScroll` | Animates the background grid lines |
| `initGlobalParallax` | Generic `data-parallax` system |
| `initScrollReveal` | SplitText line/word reveals |
| `initAboutActiveImages` | The chaptered history section |
| `initDynamicTextCursor` | Contextual cursor label |
| `initButton099` | Per-character button hover |
| `initNumberOdometer` | Stat counters |
| `initRaceCountdown` | Countdown to next race |
| `initCardSliders` | Swiper config |
| `initMarqueeScrollDirection` | Marquees that reverse with scroll direction |
| `initSvgScroll` | The gallery arc |
| (radial slider) | The dial gallery |
| (agenda car) | The car driving down the calendar |
| (overlap) | Section overlap on scroll |
| (video expand) | Video growing to full bleed |
| (helmet stage) | Helmet float and mouse tilt |
| (bg finish) | Chequered-flag shimmer |
| (bunny sound) | Video sound toggle |

## 2.3 Design tokens (exact, from CSS)

```
--_colors---primary--100        #fed60a   the only chromatic colour in the system
--_colors---black--100          black
--_colors---black--80           #333
--_colors---black--50/20/10/5   rgba steps
--_colors---white--100          white
--_colors---white--80/50/20/10/5 rgba steps

--_typography---fonts--heading-font   Anton, Arial, sans-serif
--_typography---fonts--primary-font   Helvetica, Arial, sans-serif
--_typography---heading-size--xlarge  10rem
--_typography---heading-size--large   3.125rem
--_typography---heading-size--medium  2rem
--_typography---heading-size--small   2rem
--_typography---heading-size--xsmall  1.625rem
--_typography---body-size--large      1.25rem
--_typography---body-size--medium     1.15rem
--_typography---body-size--regular    1rem
--_typography---body-size--small      .875rem
--_typography---line-height--body     1.4
--_typography---line-height--heading  1
--_typography---line-height--button   1

--border-radius--small    .125rem    (2px)
--border-radius--regular  .25rem     (4px)
--border-radius--medium   .5rem      (8px)
--border-radius--large    0em        (zero, deliberately)
--padding-section--small/regular/large/xlarge   5 / 8 / 10.5 / 12rem
--padding-global--regular  5rem
--gap-spacing--small/regular/large  1em / 1.5rem / 4em
```

The radii are the tell. 2px and 4px, and "large" is defined as zero. Nothing is soft. Combined with the exposed grid it produces a technical, instrument-panel character. Compare with Lando's `.54rem`: both are specific, neither is a default.

Colour discipline: **one hue in the entire system.** `#fed60a` is a warm, slightly orange yellow, not a cold lemon. It appears on: the menu toggle, the loader start lights, the highlighted words in the manifesto, the highlighted calendar row, the skip and submit buttons, the chapter counter tick, and the gallery needle. Nowhere else.

## 2.4 Typography

**Anton** for every heading, every button label, every stat numeral. Uppercase, line-height 1, no tracking adjustments. Anton is free on Google Fonts, has one weight, and is extremely condensed and heavy. Its limitation is its strength here: it forces every headline to be short and every layout to be decisive.

**Helvetica** for all body copy at 1rem/1.4. No display tricks, no rag control, no drop caps.

There is no mixing of families inside a sentence, unlike Lando. Emphasis is carried entirely by colour: yellow words inside black Anton ([reference/nick-1000.png](reference/nick-1000.png)).

**Ghost headings.** "MEDIA & ARTICLES", "GALLERY", "CONTACT" are set at `10rem` and above in a value one or two percent away from the background (near-white on white, near-black on black), so the section name is enormous but almost invisible behind the content. See [reference/nick-9600.png](reference/nick-9600.png) and [reference/nick-footer.png](reference/nick-footer.png). Cheap, striking, and it fails safely because the content in front does not depend on it.

## 2.5 The exposed grid

Every section renders its own column overlay:

```html
<div class="bg_lines_wrapper">
  <div class="line-wrapper">
    <div class="invisible_bg_line"></div>
    <div class="bg_line is-dark"></div>
    <div class="bg_line is-dark hide-mobile-landscape"></div>
    ...
  </div>
</div>
```

1px lines, `is-dark` variant for light sections, `hide-mobile-landscape` on interior lines so the column count drops on small screens, and `invisible_bg_line` at the outer edges to keep the spacing honest.

They are not static. `initLineScroll` animates each from `height: 0%` to `100%` across the section, each with an **independently randomised scrub lag between 1.75 and 5**:

```js
const e = { lag: {min: 1.75, max: 5}, ease: "none",
            scrollTrigger: {start: "top bottom", end: "bottom bottom"} };
// per line:
gsap.fromTo(line, {height:"0%"}, {height:"100%", ease:"none",
  scrollTrigger: {trigger: section, start, end,
                  scrub: gsap.utils.random(1.75, 5)}});
```

And it degrades correctly:

```js
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced) gsap.set(lines, {height: "100%"});
```

This is the whole site's personality in about fifteen lines: the design grid is made visible, and it draws itself in at different speeds as you scroll, like an instrument warming up.

## 2.6 The bold element: the depth-map fluid hero

[reference/nick-hero.png](reference/nick-hero.png) and [reference/nick-hero-fluid.png](reference/nick-hero-fluid.png).

The hero is a full-bleed black and white photograph of the driver beside his car. Moving the cursor across it wipes **colour** back into the image, in a trailing, smoke-like plume that dissipates. In the second screenshot you can see the yellow of the car's livery and a teal reflection revealed along the path the cursor took.

It is not a simple mask. The scene is split into three photographic layers, each with its own greyscale depth map served as AVIF:

```
depth-map-nick.avif    layer 0, "driver",     depthFill 0.40
depth-map-car.avif     layer 1, "car",        depthFill 0.10
depth-map-bg.avif      layer 2, "background", depthFill 0.03
```

The production config, read out of the module:

```js
{ stageSelector: '[data-trail="stage"]', layerSelector: '[data-trail="layer"]',
  depthMapSelector: "[data-depth-map]",
  depthAssign: {0:"driver", 1:"car", 2:"background"},
  depthFill: {0:0.4, 1:0.1, 2:0.03},
  parallax: 0.015, focus: 0, inertia: 0.025,
  brushSize: 2.8, force: 3, dyeAmount: 0.65, curl: 4,
  velocityFade: 0.906, trailFade: 0.947, pressureIters: 12,
  depthBlock: 0.33, depthCling: 0.9, depthBias: 0.9,
  threshold: 0.66, edgeHardness: 0.97,
  graySaturation: 0, grayBrightness: 0.92,
  simScale: 0.4, maxPixelRatio: 1.5 }
```

`curl`, `pressureIters`, `dyeAmount` and `velocityFade` mean this is a real fluid simulation (a Navier-Stokes style solver) rendered at 40% resolution and capped at 1.5× device pixel ratio, with the dye masked and displaced by the depth maps. The trail clings to near objects and skims past far ones.

And critically, it is feature-gated:

```js
function willApply() {
  const fine   = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced= matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !(navigator.maxTouchPoints > 0 || "ontouchstart" in window || !fine || reduced)
      && typeof THREE !== "undefined"
      && document.querySelector('[data-trail="stage"]')
      && document.querySelector("[data-depth-map]");
}
```

Touch devices and reduced-motion users get the flat photograph, and the loader knows in advance which path it is taking. **This is the model for how we should ship one bold element: expensive on capable hardware, gracefully absent everywhere else, decided before the loader finishes.**

## 2.7 The loader

[reference/nick-loader1.png](reference/nick-loader1.png), [reference/nick-loader2.png](reference/nick-loader2.png).

White screen. A giant Anton percentage counter whose digits roll vertically like a mechanical odometer. Beneath it, five black squares that turn yellow one at a time as loading progresses. Five lights going out is how an F1 race starts.

The metaphor costs almost nothing and it tells you what kind of site you are about to see. Both sites use the loader as brand space rather than as a spinner. Ours should too, if we have a loader at all.

## 2.8 Section-by-section storyline

Page height ~11,670px at 900px viewport. Structure: hero, manifesto, partners, history, media, calendar, sponsor guide, video, gallery, contact, footer.

**1. Hero.** Black. B&W photo with fluid trail. Left column: `98 / Car number`, `17 / Career podiums`, `14 / Circuits raced`, numerals in Anton with a small Helvetica label under each. Right column, right-aligned: a quote, `Rotterdam / The Netherlands`, `10+ / Years in motorsport`, `21 / Years old`. Centre: a huge "98" (his car number). Bottom left: "NICK HO" in Anton with a three-line first-person intro. Bottom right: the next race and a live countdown, `25:14:45:24`.

Everything a sponsor needs to qualify him is on the first screen, and it is all numbers. No scroll required. That is the structural lesson for our hero: John's numbers (two years, 5000m, Olympic final, fastest rise in the sport's history) can carry the same load.

**2. Manifesto** ([reference/nick-1000.png](reference/nick-1000.png)). Theme flips to white. One long first-person sentence in centred Anton, with phrases turning yellow as you scroll through it. Two small rounded photographs float at either side at different parallax speeds.

**3. Partners** ([reference/nick-2000.png](reference/nick-2000.png)). Four columns of partner logos scrolling vertically at different speeds, all in flat black, with his helmet, in full colour and slowly rotating, anchored in the centre. The only colour on a white screen. A "Become partner" button sits at the end of the wall.

The helmet is an image sequence drawn to a canvas (`data-helmet-canvas`, preloaded frames, `dprCap`, `capCanvasToDisplay`), not a live 3D model. It also floats and tilts:

```js
{ selector: "[data-helmet-stage]", perspective, floatAmount, floatDuration,
  ease, lagMove, lagTilt, moveMax, tiltMax, pauseOffscreen: true }
// sine.inOut yoyo repeat:-1 float,
// gsap.quickTo for x and rotationY from mouse X,
// IntersectionObserver pauses it offscreen,
// wrapped in matchMedia(`${query} and (prefers-reduced-motion: no-preference)`)
```

Pre-rendered frames plus a canvas is a good trade: photoreal quality, no shader work, no model licensing, and it scrubs perfectly.

**4. History** ([reference/nick-3200.png](reference/nick-3200.png), [reference/nick-4600.png](reference/nick-4600.png)). The narrative core. Pinned, black. Five chapters: The Foundation, First Victories, Proving Speed, Going International, Pole position. Chapter title large in Anton on the left, body copy right, and a single column of photographs scrolling vertically through the centre. **Only the image at the centre of the viewport is in colour; the ones above and below are desaturated and dimmed.** A yellow "SKIP ⟩⟩" button and a "1/5" counter with a small yellow tick sit bottom right.

Implementation (`initAboutActiveImages`): `gsap.to(img, {filter: active ? "saturate(1)" : "saturate(0)"})` with a trigger point at a fraction of viewport height, and SplitText with `mask: "lines"` cross-fading the chapter title and copy.

This is the closest thing on either site to what John's story needs: a chaptered, scroll-driven narrative with a skip control for people who only came for the booking form. The skip button is the detail to steal. It respects the visitor who is there to buy.

**5. Media and articles** ([reference/nick-6200.png](reference/nick-6200.png)). Horizontal Swiper of press links, each a B&W photo with the original Dutch headline beneath, linking out to racexpress.nl, autosport.nu, Erasmus Magazine. Ghost "MEDIA & ARTICLES" heading behind. Swiper config: `speed: 1200, easing: cubic-bezier(0.16, 1, 0.3, 1)`.

Third-party validation presented as a design element rather than a logo bar. Applicable to John's press and client list.

**6. Race calendar** ([reference/nick-6200.png](reference/nick-6200.png), [reference/nick-7000.png](reference/nick-7000.png)). The best single idea on the site. Black section. The heading "RACE CALENDAR 2026" is partly occluded by a top-down photograph of his car, which sits *in front of* the type. Below, the season as a list: race name in Anton, series in Helvetica beneath, dates right-aligned, hairline divider per row.

Then the car **drives down the list as you scroll**, and whichever row it is passing turns yellow.

```js
{ carInDuration: .8,  carInEase: "expo.out",
  carOutDuration: .8, carOutEase: "expo.in",
  carStart: "top center", carEnd: "bottom center",
  highlightColor: "#fed60a",
  yellowDuration: .2, yellowEase: "power2.out",
  resetDuration: .6,  resetEase: "power2.inOut",
  itemStart: "top center", itemEnd: "bottom center" }
```

The car also rotates 180° depending on whether it entered from above or below, and the whole thing is Lenis-aware. Ten rows, one moving object, one colour. This is what our brief means by "one memorable element; everything around it quiet and disciplined".

**7. Sponsor guide** ([reference/nick-8200.png](reference/nick-8200.png)). White. Anton question headline, two lines of copy, one yellow button: **"DOWNLOAD SPONSORGUIDE 2026"** with a download icon, linking to a PDF on the CDN. The commercial ask, stated plainly, in the middle of the page rather than buried in the footer.

**8. Video.** A widescreen Bunny-hosted HLS video that grows from a 70vw × 70vh rounded box to full bleed as you scroll, with the radius animating to zero:

```js
{ trigger: ".section_video", target: ".video_wrapper",
  from: {width:"70vw", height:"70vh"},
  to:   {width:"100vw", height:"100vh", borderRadius: 0},
  start: "top 80%", end: "top top", scrub: true }
```

A sound toggle uses the custom cursor, whose label switches between "sound on" and "sound off".

**9. Gallery** ([reference/nick-9600.png](reference/nick-9600.png)). Photographs arranged along a visible hairline arc and rotated to follow it, with the centre image upright, larger and in colour while the others are tilted and desaturated. A yellow needle graphic sits at the centre of the arc, like a rev counter. Prev and next chevron buttons below. Positions are computed with trigonometry:

```js
// angle per card derived from card width + gap over radius
step = (cardWidth + gap) / radius * (180 / Math.PI);
angle = index * step;
x =  radius * Math.sin(angle * Math.PI/180);
y = -radius * Math.cos(angle * Math.PI/180);
rotation = angle;
```

The arc SVG itself grows on scroll via `initSvgScroll`: `scaleY` from 0.2 to 1 and back to 0.2 with `transformOrigin: 50% 0%`, gated behind `(min-width: 768px) and (prefers-reduced-motion: no-preference)`.

The steering-wheel or rev-counter metaphor is doing the work. The cursor reads "drag" over it.

**10. Contact** ([reference/nick-footer.png](reference/nick-footer.png)). A white rounded card floating over a black section that carries a giant near-invisible "CONTACT". Labels above grey-filled rounded inputs, four fields, yellow "SUBMIT ⟩⟩". Plain, fast, no friction.

**11. Footer.** White, grid lines still on. Logo left, three columns (Menu, Socials, Contact) right, a credits row at the bottom with "Web Credits" and "Disclaimer & Privacy Policy".

## 2.9 The custom cursor

```css
.cursor        { position: fixed; z-index: 25; pointer-events: none;
                 padding-top: .8em; padding-left: .8em; display: flex; }
.cursor-bubble { background: #fff; color: #000; border-radius: 50em;
                 height: 3.625em; padding-inline: 2em; opacity: 0; }
.cursor-bubble__text { font-size: 1em; font-weight: 500; letter-spacing: -.02em; }
```

A white pill that fades in near the pointer carrying a contextual verb: **"drag"** over the gallery, **"See more"** over media cards, **"Sound on"** over the video. Text is rebuilt per character when it changes, and the labels animate in with the same per-character stagger as the buttons.

It works because the labels are instructions, not decoration. A cursor bubble that just says the site's name would be noise.

## 2.10 The button component

One component, `button-099`, covers every button on the site:

```html
<a data-button-099 class="button-099" aria-label="drag">
  <span class="button-099__bg"></span>
  <span class="button-099__inner">
    <div class="button-099__content">
      <span aria-hidden="true" data-button-099-text class="button-099__text is--default">
        <span class="button-099__split-char" style="--char:1">d</span>
        <span class="button-099__split-char" style="--char:2">r</span>
        ...
      </span>
      <svg class="button-099__icon is-drag">...</svg>
    </div>
    <div class="button-099__content"><!-- .is--hover duplicate --></div>
  </span>
</a>
```

```css
.button-099        { display: inline-grid; position: relative; line-height: 1; }
.button-099__bg    { grid-area: 1/1; border-radius: var(--border-radius--regular); }
.button-099__inner { grid-area: 1/1; display: grid; overflow: hidden;
                     padding: .8rem 1.1rem; }
.button-099__text  { font-family: Anton; font-size: 1rem; text-transform: uppercase; }
.button-099__content { grid-area: 1/1; display: flex; align-items: center; gap: .7rem; }
.button-099__icon  { width: .95rem; overflow: visible; }
```

Background and content stacked in the same grid cell, `overflow: hidden` on the inner so the default and hover text layers can roll vertically, characters split for a staggered reveal.

The detail worth copying verbatim, given our English and Dutch requirement:

```js
const BASE_CHARS = 10;
const TOTAL = (BASE_CHARS - 1) * 0.018;         // fixed total stagger budget
// after splitting and indexing characters:
if (charCount > BASE_CHARS) {
  el.style.setProperty("--button-099-stagger",
    (TOTAL / (charCount - 1)).toFixed(4) + "s");
}
```

The per-character delay is recomputed so the **total** animation duration stays constant regardless of label length. "Boek John" and "Check John's availability" finish at the same moment. SplitText is called with `aria: "none"` and the full label is restored to `aria-label`, so the split does not damage the accessible name. That is exactly the kind of i18n-safe detail our brief demands.

## 2.11 Other reusable mechanics

**Generic parallax system** (`data-parallax`), configured per element in markup:

```html
<div data-parallax="trigger"
     data-parallax-direction="vertical|horizontal"
     data-parallax-start="20" data-parallax-end="-20"
     data-parallax-scrub="1"
     data-parallax-scroll-start="top bottom"
     data-parallax-scroll-end="bottom top"
     data-parallax-disable="mobile|mobileLandscape|tablet">
  <div data-parallax="target">...</div>
</div>
```

Driven by `gsap.matchMedia()` with named conditions (`isMobile` 479, `isMobileLandscape` 767, `isTablet` 991, `isDesktop` 992+), using `yPercent`/`xPercent` and `clamp()` inside the ScrollTrigger start and end strings. Reverted properly on breakpoint change via `gsap.context`.

**Scroll reveal** (`data-reveal`, with a `data-reveal-mobile` override):

```js
{ distance: 110, duration: .6, ease: "expo.out",
  lines: {stagger: .04}, words: {stagger: .06},
  fade:  {y: 40, duration: .8, ease: "expo.out"},
  slide: {x: "100vw", duration: 1, ease: "expo.out"},
  group: {stagger: .12},
  mobile: {maxWidth: 479}, start: "top 85%",
  once: false, directionAware: true }
```

`directionAware: true` means elements animate in from the direction you are scrolling, and `once: false` means they replay when you scroll back. Both make a long page feel responsive rather than spent.

**Section overlap** (`data-overlap`, `data-overlap-amount`, default 30vh, desktop only): sections are given ascending z-index and the outgoing one translates up by the given vh as it leaves, so the next section slides over it. One property, big spatial effect.

**Number odometer:**

```js
{ duration: 1, ease: "power3.out", elementStagger: .1, digitStagger: .04,
  revealDuration: .5, revealEase: "power2.out",
  triggerStart: "top 80%", staggerOrder: "left", digitCycles: 2 }
```

**Greyscale to colour on scroll** (`data-quote-image` inside `data-quote-trigger`): image parallaxes within its container, and crosses from `saturate(0)` to `saturate(1)` over 0.6s `power2.out` when it hits 25% of centre, re-desaturating on scroll back. Reduced-motion users get `saturate(1)` immediately.

**Chequered-flag shimmer** (`.bg_finish`): individual `<rect>` elements in the SVG randomly dip their `fill-opacity` and return, with randomised down, hold and up durations, a maximum of 16 concurrent, and a `document.hidden` check so it stops in background tabs. A living texture with no video and no canvas.

## 2.12 Where it falls short

- Fonts are `.woff`, not `.woff2`. Easy win missed.
- Helvetica as a self-hosted web font is an odd, slightly dated choice, and it makes all body copy feel like system UI.
- Anton has one weight and no italic, so there is no typographic hierarchy inside a heading. Emphasis is colour-only.
- Three.js r128 is several years old.
- The contact form's submit is an `<a href="#">` rather than a real submit button.
- Reduced-motion handling is good in the individual modules but the hero image sequence and Swiper are not obviously gated.

---

# 3. What to take, what to avoid

## 3.1 Shared patterns across both sites

Both independently arrived at all of these. That makes them the genre conventions of the premium athlete site, and we should assume our audience reads them as the price of entry:

1. **Lenis smooth scroll plus GSAP ScrollTrigger.** Both. The scroll feel is the first thing that separates a premium site from a template.
2. **The loader is brand space.** A click gate on lime; five start lights going out. Neither is a spinner.
3. **A full-screen overlay menu**, brand-coloured, oversized type, socials and contact at the bottom.
4. **Numbers at display scale.** Podium counts, car numbers, years, countdowns, all set enormous with a tiny label.
5. **A live countdown to the next competitive date.** Both. It makes the site feel current even when nothing has been updated.
6. **Black and white as the default photographic register, with colour as an event.** Both sites desaturate by default and spend colour deliberately.
7. **Section-level theme flips** rather than one background for the whole page.
8. **Multi-speed columns and parallax** as the primary way of making a grid feel alive.
9. **Photographs with place-and-date captions.** Turns a gallery into a record.
10. **Tiny uppercase labels above large values**, everywhere. This is the sport-data vernacular and it is what makes both sites feel specific rather than generic.
11. **Business contact stated plainly once**, in the subject's own register.
12. **Split-text reveals with an aria-hidden clone** so the semantic text is untouched.

## 3.2 Directly applicable to John

**The hero must carry the numbers.** Nick Ho puts every qualifying fact on screen one: car number, podiums, circuits, age, location, next race, countdown. We have stronger material: two years, 5000m, Olympic finalist, fastest rise in the sport's history. Our brief says the hero lands the hook without scrolling; both sites prove you can do that with data rather than with a claim.

**The chaptered scroll story with a skip control.** Nick Ho's five-chapter history, with the centre image in colour and a "SKIP" button for people who only want the booking form, is a near-perfect template for "two years, from deciding to try, to the Olympic final". The chapters write themselves. The skip button is what makes it safe for a corporate decision-maker who is not here for the narrative.

**The modular scoreboard.** Lando's `/on-track` data panel and `/calendar` race card are the right vernacular for the world-ranking story. Hairline-divided cells, 10px uppercase labels, large values, one row or cell in the accent colour. That is how we present a ranking climb without it looking like a chart in a deck.

**The moving object that highlights a list.** The car driving down the race calendar is the most copyable single idea across both sites. Our version could be a runner, a split marker, or a position indicator moving down a season of races while the row it passes lights up, showing the ranking climb the algorithm produced. It is one element, one colour, and it does the "fastest rise in the sport's history" claim visually instead of stating it.

**The subject's own graphic property as the background pattern.** Lando's helmet-blob contours. Ours is not a helmet. It might be the pace curve, the ranking trajectory, lane geometry, or the algorithm's actual output plot. The rule is: derive the pattern from something only John has.

**Wordmark as a miniature of the type system.** "LANDO" serif plus "NORRIS" sans, then that pairing repeated as the emphasis device in every headline. If we choose a two-family system, the lockup should encode it.

**The one-file-per-effect JS architecture.** Nick Ho's Slater modules each own one effect with a config object at the top. In our Next.js build that maps to one hook or component per effect with an exported config. It keeps a heavily animated site maintainable and makes reduced-motion gating systematic rather than ad hoc.

**Feature-gate the bold element before the loader finishes.** Nick Ho's `willApply()` checks pointer type, touch, reduced-motion, WebGL and required DOM before committing, and the loader branches on the answer. That is how we can ship something expensive without punishing phones or violating our own accessibility floor.

**Constant-duration character stagger.** The `--char` index plus recomputed stagger budget keeps English and Dutch button labels animating identically. Our brief requires Dutch running 15 to 20 percent longer. This solves it.

**The fluid scaling root font.** Lando's `viewport / design-width × 16` with everything in rem. Adopt it.

## 3.3 What to avoid

**From the sites themselves:**

- Lando's complete absence of `prefers-reduced-motion` and `:focus-visible`. Non-negotiable for us.
- 1.32 MB of custom JS. We can get most of the effect with GSAP, ScrollTrigger, SplitText, Lenis and a handful of CSS techniques.
- Rive as a dependency for basic UI. Twenty canvases for button arrows and icons is a studio flexing. An animated SVG or a CSS transition gets 80% of it.
- Webflow-isms: leaked variable names, `<a href="#">` used as a submit button, `.woff` instead of `.woff2`.

**From our own brief, reinforced by what these sites did not do:**

Neither site used a cream background with a high-contrast serif and a terracotta accent. Neither used identical rounded cards with soft grey shadows. Neither used tracked-out all-caps eyebrows (Lando explicitly set `letter-spacing: 0`). Neither used middle-dot meta strings (both spread and aligned their meta instead). Neither appended arrows to button text (both used a separate icon slot). Neither relied on fade-and-slide-up as the only reveal (elliptical clips, direction-aware reveals, saturation crossfades, height draws).

The banned-defaults list in CLAUDE.md is consistent with what two well-funded, independent studios actually shipped. That is a useful confirmation.

## 3.4 Open questions for our build

1. **Which is our one bold element?** The brief says spend boldness in one place. Lando chose an assembling 3D helmet on a live portrait. Nick Ho chose a depth-aware fluid trail that wipes colour into a photograph. Ours has to come from the algorithm-and-risk story, not from athletics stock imagery. Candidates: the ranking-climb playhead moving down the season; the algorithm's plotted schedule as a navigable object; the gap between predicted and actual drawn as two lines.
2. **Hero: film or booking modal primary?** Both sites answer the equivalent question by making the *image* primary and putting the commercial action low-key but permanent. Nick Ho makes the commercial ask explicit mid-page (the sponsor guide download). Worth considering a permanent, quiet enquiry affordance plus one loud mid-page ask, rather than fighting for hero primacy.
3. **Monochrome or two-tone photography?** Both sites desaturate by default. Our photo credits requirement (Jelle Jansegers, Raf Thomas) is easier to honour elegantly with Lando's caption-above-image treatment than with a footer credit block.
4. **Do we want a loader at all?** Both use one, and both make it brand space. A Next.js site can be fast enough not to need one, but the loader is where Nick Ho decides whether the expensive hero applies.

---

## Appendix: source files captured

Stylesheets and bundles were downloaded and read in full for this teardown:

- `lando-offbrand.shared.6e09a725a.css` (188 KB)
- `lando-by-OFF+BRAND.05.js` (1.32 MB, requires a `landonorris.com` referrer)
- `nick-ho.webflow.shared.bb9185789.css` (113 KB)
- 26 Slater modules from `assets.slater.app/slater/20545/` (95 KB total)

Screenshots in [reference/](reference/), named by site and scroll position in pixels:

`lando-hero`, `lando-900`, `lando-1800`, `lando-2900`, `lando-4200`, `lando-5600`, `lando-6800`, `lando-7700`, `lando-9000`, `lando-10200`, `lando-footer`, `lando-menu`, `lando-loader`, `lando-mobile`, `lando-ontrack-hero`, `lando-ontrack-stats`, `lando-ontrack-stats2`, `lando-calendar`, `nick-hero`, `nick-hero-fluid`, `nick-loader1`, `nick-loader2`, `nick-1000`, `nick-2000`, `nick-3200`, `nick-4600`, `nick-6200`, `nick-7000`, `nick-8200`, `nick-9600`, `nick-footer`, `nick-menu`.

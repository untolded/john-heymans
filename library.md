# Reference library

Teardowns of six reference sites, recorded for the John Heymans build. Every claim here comes from inspecting the live sites: rendered DOM, computed styles, downloaded stylesheets, downloaded JS bundles, and screenshots at multiple scroll positions and viewports. Screenshots referenced below live in [reference/](reference/).

- **Part 1, sections 1 to 3:** two athlete personal-brand sites, landonorris.com and nickho-motorsports.nl. Analysed 14 September 2026.
- **Part 2, sections 4 to 10:** the four storytelling references John named after round 3: usavionix.com, seasats.com, unitedcarriers.com and lisa.locomotive.ca. Analysed 21 September 2026, with the emphasis on how each animation framework is built and how each story flows.

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

# Part 1: athlete sites

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

---
---

# Part 2: the storytelling references

John named these four sites after round 3 as his benchmark for "a big story, not a website". This pass looks at two things in depth: how each animation framework is built (what drives what, frame by frame), and how each story is paced from first screen to last.

Method: each site was loaded in desktop Chrome at 1440 × 900 and stepped through with real wheel events, screenshotting after every step; the DOM, computed styles and every stylesheet were read; every JavaScript bundle and chunk was downloaded and searched; network requests were logged to see which models, frame sequences, videos and sounds each page actually loads. Each site was also opened at iPhone 13 size. LISA was walked through its conversation step by step. The walkthrough stopped at the reCAPTCHA challenge before the final submit, so no enquiry was sent to Locomotive.

| | usavionix.com | seasats.com | unitedcarriers.com | lisa.locomotive.ca |
|---|---|---|---|---|
| Sells | Jet drone plus AI command software, defence and public safety | Autonomous surface vessels | Freight forwarding across APAC | An agency (Locomotive, Montréal) |
| Story format | One continuous simulated mission | A guided film, then a product catalogue | One container's journey, leg by leg | A conversation |
| Page length at 900px | 64,664px, about 72 screens | 34,130px, about 38 screens | about 28,200px, about 31 screens | One screen, no scrolling |
| Platform | Next.js App Router, Tailwind v4 | Next.js App Router, Payload CMS, CSS Modules | Webflow plus a custom Vite bundle hosted on Netlify | Twig templates, Locomotive's modularJS, a Vue 3 app |
| Smooth scroll | Lenis 1.3.17 | Lenis 1.3.13 | Lenis 1.3.23 | none |
| Animation engine | Framer Motion for the DOM, React Three Fiber `useFrame` for 3D; no GSAP | GSAP 3.15 with ScrollTrigger and SplitText | GSAP 3.15 with ScrollTrigger and a home-made text splitter | Vue transitions and CSS; GSAP 3.14.2 present |
| 3D | Three.js r180 through React Three Fiber, carries the whole story | Three.js r180, the missions globe only | Three.js r184: hero globe, ocean scene with a wake simulation | Three.js r165: the character |
| Signature asset | Camera and drone paths authored in Blender, exported as animation clips, scrubbed by scroll | A 511-frame AVIF flythrough filmed from the bow of a vessel | Frame sequences of a reach stacker loading a container onto a truck | A voiced 3D character with a CRT television for a head |
| The one bold element | The camera never cuts: you fly the whole mission | The ground itself, three gradient themes crossfading under everything | The container you follow from crane to ship to sky | She talks to you, and the enquiry form is the conversation |

A correction to `docs/storytelling-teardown.md`, which fed the round 5 build: it describes the USAvionix aircraft as an image sequence and says Seasats uses no smooth-scroll library. Both are wrong. USAvionix is a real-time 3D scene (section 4.3), and Seasats runs Lenis with `lerp: 0.12` (section 5.3). It also describes LISA as built on Next, which it is not (section 7.2). The conclusions drawn from that document still mostly hold; the mechanics are corrected here.

---

# 4. usavionix.com

## 4.1 Verdict first

The most cinematic of the four and the most instructive for John, because it solves the exact problem he has: **how to make an invisible technology (autonomous AI) visible and dramatic.** It does not explain the AI. It shows the AI working, in real time, on one mission, from boot sequence to resolved incident, and lets you drive the playhead with your scroll wheel.

Three decisions carry it:

1. **The camera never cuts.** Seventy-two screens of scrolling are one continuous camera move over one landscape. There are no section boundaries at all until the story ends.
2. **The world is scrubbed; the words are swapped.** The 3D scene follows your scroll position exactly. The copy does not. Exactly one text block is on screen at a time, and it is replaced by a short, discrete animation when you cross a threshold. This is why it reads like a film with title cards rather than a web page with parallax.
3. **A telemetry layer makes the machine feel alive.** Monospaced status lines (`BOOT SEQUENCE…`, `THERMAL / LIDAR / RGB / IR [ONLINE]`, `COORD: [37.4419°N / 119.8772°W]`, `32 CAR / 4 TRUCK / 1 PERSON / 2 UAV`) appear bottom right as the mission progresses. They are the AI's inner voice.

## 4.2 Stack (verified)

```
Framework      Next.js App Router (self.__next_f streaming payload), deployed with dpl_ ids
Styling        Tailwind CSS v4 (@theme tokens: --text-d-h0, --color-bg, --tw-* variables)
Smooth scroll  Lenis 1.3.17 (html class "lenis lenis-stopped" while loading)
3D             Three.js r180 via React Three Fiber; drei helpers (useGLTF, Outlines)
DOM motion     Framer Motion (window.MotionIsMounted; AnimatePresence mode="wait")
State          one global store created with Zustand's create()() signature
Decoders       Draco (gstatic draco 1.5.5 wasm)
Fonts          Geist and Geist Mono, variable, via next/font
```

No GSAP anywhere in the bundle. No ScrollTrigger. The scroll-to-animation mapping is about fifteen lines of their own code (section 4.4).

**Assets fetched during one scroll-through:**

```
/assets/models/loading-delta.glb          wireframe drone shown by the loader
/assets/models/delta-pbr.glb              the hero drone, full PBR materials
/assets/models/delta-lowpoly.glb          swarm copies
/assets/models/terrain.glb                the mountain landscape
/assets/models/city-terrain.glb, grid.glb, grid-city.glb, building.glb, power-station.glb
/assets/models/camera-animations.glb      the camera path, authored in Blender
/assets/models/camera-animations-mobile.glb
/assets/models/drone-animations.glb       every drone path, authored in Blender
/assets/models/drone-animations-mobile.glb
/assets/textures/environment/env.exr      lighting
/assets/textures/terrain/bnoise.png, city.webp
/assets/textures/fx/noise.webp, wind.webp, fire.webp
/assets/textures/globe/earth_normal.webp, earth_outline.webp
/assets/3d-fonts/orbitron-bold.json       typeface for 3D text
/assets/3d-fonts/Geist-SemiBold.woff      font loaded for text drawn inside the canvas
/assets/images/landing-sequence/NNNN.avif AVIF frame sequence, matches the drone landing at the end
```

Note the two animation files. **Nothing about the camera or the drones is hand-coded in JavaScript.** A 3D artist animated the entire mission in Blender, including separate, re-framed versions for portrait phones, and the site plays those clips.

## 4.3 Story flow

The story is fifteen named scenes. Each has a scroll length in viewport heights, declared in one object:

```js
{ "intro-scene": 100, "delta-drone": 500, "swarm-scene": 500, "mission-preset": 500,
  "flock-scene": 500, "real-time-detection": 500, "thermal-irregularity": 500,
  "ignition-verified": 500, "phalanx-ai": 500, "analysis-evaluation": 500,
  "integrated-notifications": 500, "interdrone-coordination": 500,
  "extra-support": 500, "zone-stabilized": 100, "multi-threat-response": 500 }
```

That is 6,700vh of story: **five full screens of scrolling per idea.** It is the slowest pacing of the four sites by a wide margin, and it is deliberate. At five screens per beat, the camera has time to travel, the swarm has time to assemble, and the reader has time to read two lines.

Beat by beat, with the copy as shipped ([reference/usavionix-00-loader.jpg](reference/usavionix-00-loader.jpg) onward):

| Scene | Chapter label | What the camera does | Copy on screen |
|---|---|---|---|
| Loader | | Dark vignette, a thin wireframe drone outlined in grey, a short progress line and `LOADING ASSETS`, then `CALIBRATING`. A diagonal wipe reveals the terrain. | none |
| intro | | Drone banks over mountains, seen from above | "Securing the skies with autonomous intelligence" / "The first agent in the air, built with the speed, range, and onboard intelligence to search vast areas on its own." |
| delta-drone | Specs | Camera moves to directly above; thin callout lines draw out from the airframe | Spec callouts |
| swarm-scene | Swarm | More drones fade in; each gets an ID tag (`DS4B11`); lines connect them | "Understanding the Swarm System" / a four-row spec table: Autonomy, Scalability, Collaboration, Coverage |
| mission-preset | Mission | Three drones in formation | "Mission preset" / "Monitor a wide operational area continuously…" / a `Start Mission` pill |
| flock-scene | Sync | Camera pulls back until the drones become nodes in a network over a grid | Boot log bottom right; "Coordinated in real time, Delta units share intelligence and respond as one synchronized system." |
| real-time-detection | Detection | Back over terrain; dozens of yellow bounding boxes label objects (`CAMPFIRE 80%`, `ROAD OBSTRUCTION 80%`, `PERSON 80%`) | "Real-time detection" / "Real-time detection and classification of tens of thousands of objects across the battlespace." |
| thermal-irregularity | Detection | Low angle; a sensor cone projects from the drone | "Thermal irregularity detected" / "Thermal sensors detect an abnormal heat pattern and smoke, prompting an automatic alert to authorities." |
| ignition-verified | Detection | Drone reaches a village; smoke | "Ignition verified" / "The Delta drone reaches the anomaly and confirms active flames…" |
| phalanx-ai | Phalanx AI | The photographic world dissolves into a dark tactical map: grid, a survey-area outline, glowing hotspots | "Phalanx AI" / "AI-powered command layer for autonomous drone operations and synchronized mission intelligence." |
| analysis-evaluation | Sys Analysis | Hotspots turn red; drone icons trace paths | "Analysis & evaluation" |
| integrated-notifications | Int Alerts | Callouts fly out to `FIREFIGHTERS`, `AMBULANCE`, `POLICE`, `EMERGENCY SERVICES` | "Integrated notifications" |
| interdrone-coordination | Coordination | A second zone appears; a drone is reassigned | "Inter-drone coordination" |
| extra-support | Coordination | Extruded building blocks turn red, `ALERT AREA` | "The swarm detects the need for extra support and deploys another drone…" |
| zone-stabilized | Coordination | Blocks turn cyan, `AREA SECURED` | "Zone stabilized" plus a small `M-2 Completed` badge |
| multi-threat-response | Response | Camera pulls up to show five zones at once | "Multi-threat response" |

After the last scene the canvas fades and ordinary DOM sections take over on black: "One platform, many missions." with a row of use-case cards (Wildfire Cascade and others), a wireframe globe ("USAvionix covers vast areas and long distances…"), "Autonomy in real operations" with a close-up of the engine and a `Request Access` pill ("Demo access is limited, so request a slot and we will reach out."), a logo row of where the founders come from (SpaceX, Apple, Tesla, Palantir, Skycatch, Navy SEALs, Google, JPL), and a footer with a giant ghosted wordmark, the drone standing on its landing gear, and "Ready to talk to us?" See [reference/usavionix-09-use-cases.jpg](reference/usavionix-09-use-cases.jpg) and [reference/usavionix-10-footer.jpg](reference/usavionix-10-footer.jpg).

**The narrative shape is a three-act film:**
- Act 1, the hero and its powers (intro, specs, swarm, mission preset, sync).
- Act 2, the inciting incident and escalation (detection, thermal irregularity, ignition verified, analysis, alerts).
- Act 3, resolution and scale (coordination, extra support, zone stabilized, multi-threat response).
- Epilogue: proof (use cases, reach, founders) and the ask (limited demo slots).

The product is never described in the abstract once the mission starts. Every capability is introduced at the moment the plot needs it. Thermal cameras appear because there is a fire. Integrations appear because firefighters need to be told. That is the lesson.

## 4.4 Animation framework: how it is wired

Four layers, each with one job.

**Layer 1: scroll to scene progress.** An invisible column of DOM spacers, one per scene, sized by the vh table above. On every Lenis scroll event, one function measures the spacers and writes four numbers per scene into the global store (reconstructed from the minified bundle):

```js
lenis.on("scroll", ({ scroll }) => {
  for (const { id, start, height, end } of scenes) {
    const showStart = (id === first) ? start - innerHeight : start;
    const progress  = clamp((scroll - start) / height, 0, 1);      // 0..1 inside the scene
    const showRatio = clamp((scroll - showStart) / innerHeight, 0, 1); // entering, over one screen
    const hideRatio = clamp((scroll - end) / innerHeight, 0, 1);       // leaving, over one screen
    const isActive  = showRatio > 0 && hideRatio <= 1;
    store.getState().updateSceneData(id, { progress, isActive, showRatio, hideRatio });
  }
});
```

The store only notifies subscribers when a value actually changes. Everything downstream reads these four numbers. Nothing else in the site knows what `scrollY` is.

**Layer 2: the 3D world reads progress every frame.** Inside React Three Fiber, each animated object has a `useFrame` hook that reads its scene's progress straight from the store (not through React state, so there are no re-renders) and scrubs a Blender clip:

```js
useFrame(() => {
  const { progress } = store.getState()[sceneId];
  if (progress > 0) {
    action.time = clip.duration * progress - 1e-6;   // scrub the Blender clip
    action.play(); action.paused = true;
    drone.position.copy(tracker.position);            // copy the animated empty's transform
    drone.rotation.copy(tracker.rotation);
  }
});
```

The clips animate invisible "tracker" empties, and the real meshes copy their transforms. That lets the same clip drive a PBR drone on desktop and a low-poly drone in the swarm. The mobile clip set is swapped in with a `(min-width: 768px)` media query.

Custom shader materials receive `progress` and `hideRatio` as uniforms, so fire, smoke, map outlines and hotspots fade and grow with the scroll. A range-mapping helper converts slices of a scene's progress into effect parameters with an easing curve, for example "fade the fire in over the first half of the Phalanx scene": `mapRange(progress, 0, 0.5, 0, 1, ease)`. A post-processing pass carries a vignette, a crossfade between the photographic and tactical looks (`mixFactor` from 0.75 to 1 of the Sync scene), and a thermal-invert effect with its own position and size.

**Layer 3: the copy is declared against the story, not the page.** Every headline and body block is an entry in one array with a time window expressed in scene progress:

```js
{ component: RealTimeDetectionCopy,
  timeWindow: { startScene: REAL_TIME_DETECTION, startSceneProgress: 0.5,
                endScene: THERMAL_IRREGULARITY,  endSceneProgress: 0.075 } }
```

One fixed overlay subscribes to the store, finds the single entry whose window contains the current state, and renders it inside `AnimatePresence mode="wait"`. The outgoing block finishes its exit before the incoming block enters. The telemetry lines work the same way:

```js
{ label: "BOOT SEQUENCE…",                        scene: "flock-scene",         progress: 0.10 },
{ label: "THERMAL / LIDAR / RGB / IR [ONLINE]",   scene: "flock-scene",         progress: 0.15 },
{ label: "AI: 2 AGENTS / DUAL GPU [ACTIVE]",      scene: "flock-scene",         progress: 0.20 },
{ label: "LINK: PHALANX SYSTEM [ESTABLISHED]",    scene: "flock-scene",         progress: 0.25 },
{ label: "SCAN MODE: ACTIVE",                     scene: "real-time-detection", progress: 0.25 },
{ label: "COORD: [37.4419°N / 119.8772°W]",       scene: "real-time-detection", progress: 0.30 },
{ label: "ALT 1,240M | SPEED 74 KM/H",            scene: "real-time-detection", progress: 0.35 },
{ label: "32 CAR / 4 TRUCK / 1 PERSON / 2 UAV",   scene: "real-time-detection", progress: 0.40 },
```

This is the single most transferable idea in Part 2. The script of the story lives in data, keyed to story time. Rewriting a line, moving it later, or adding a telemetry line is a one-line edit that cannot break the layout.

**Layer 4: the headline motion.** Every heading uses one component:

```js
<AnimatePresence mode="wait" propagate>
  <motion.h2
    initial={{ opacity: 0, y: 8,  color: "#FF2200" }}
    animate={{ opacity: 1, y: 0,  color: "#FFFFFF" }}
    exit=   {{ opacity: 0, y: -8, color: "#FF2200" }}
    transition={{ duration: 0.4, ease: "easeInOut" }} />
</AnimatePresence>
```

Eight pixels of travel and a red flash as the text arrives and leaves, like a phosphor display catching a signal. The whole block moves as one; there is no per-letter animation on headings. Restraint in the type animation is what lets the 3D be the spectacle. Map-overlay labels use `pathLength` 0 to 1 on their leader lines, then fade the label in.

The chapter indicator top centre (`SPECS`, `SWARM`, `MISSION`, `SYNC`, `DETECTION`, `PHALANX AI`, `SYS ANALYSIS`, `INT ALERTS`, `COORDINATION`, `RESPONSE`) is derived from the same store: whichever scene is active names the chapter, flanked by tick marks.

## 4.5 Design system

**Colour.** `--color-bg: #0f0f0f`, white text, and three signal colours used only inside the simulation: `--color-yellow: #ffcb47` (detection boxes, hotspots, "sensitive"), `--color-red: #f66` (threats, alerts), and a cyan they named `--color-green: #7aebff` (secured, resolved). Colour carries plot: yellow means "noticed", red means "danger", cyan means "handled". Neutrals: `#f2f2f2`, `#ccc`.

**Type.** Geist for everything readable, Geist Mono for telemetry and labels. Two scales, desktop and mobile, as Tailwind v4 tokens:

```
d-h0   5rem      / 4.75rem  / -0.04em / 600       m-h0  2.6875rem / 2.41875rem / -0.04em / 600
d-h1   4.75rem   / 5rem     / -0.04em / 600       m-h1  2.125rem  / 2.25rem    / -0.04em / 600
d-h2   3.125rem  / 3.25rem  / -0.03em / 600       m-h2  1.875rem  / 2rem       / -0.04em / 600
d-h3   1.8125rem / 2rem     / -0.01em / 500       m-h3  1.1875rem / 1.25rem    / 0       / 500
d-body-l 1.1875rem / 1.5rem / 500                 m-body-l .875rem / 1rem / 500
d-body-s 1rem / 1.25rem / 500                     m-body-s .8125rem / 1rem / 500
d-cta  1.0625rem / 1.25rem / 500
d-mono .75rem / 1rem / +0.06em / 500              m-mono .6875rem / 1rem / +0.06em / 500
```

Headlines at 600 with -4% tracking; body at 500; mono at 500 with +6% tracking and uppercase. There is no display face. The drama is carried by the image, and the type is simply clear.

**Frame.** The layout is a fixed frame that never changes while the content inside it does: wordmark top left, chapter label top centre, `Contact` pill and hamburger top right, headline top left, body copy bottom left, telemetry bottom right in mono, right-aligned. See [reference/usavionix-05-detection-hud.jpg](reference/usavionix-05-detection-hud.jpg). Because the frame is constant, the eye learns where to look within two scenes and the reading cost drops to almost nothing.

## 4.6 Mobile

Same experience, portrait. The loader is the same diagonal wipe with `LOADING ASSETS`. The hero adds a `Scroll To Explore` pill with a down arrow. The chapter indicator stays top centre next to the logomark. The camera and drone paths come from the separate `-mobile.glb` clips, re-framed so the drone sits in the upper half and copy sits at the bottom. See [reference/usavionix-11-mobile.jpg](reference/usavionix-11-mobile.jpg).

## 4.7 Where it falls short

- **No `prefers-reduced-motion` handling at all.** Zero occurrences across every chunk and the stylesheet. Seventy screens of scrubbed camera motion with no alternative.
- The copy exists only inside a canvas-driven overlay that shows one block at a time. There is no readable, linear version of the story for a screen reader or a skim reader.
- Heavy: a dozen GLB files, an EXR environment, noise and fire textures, Draco wasm, all before the first headline is useful.

## 4.8 What John should take from it

1. **Show the algorithm working, on one real problem, in real time.** Not a diagram of an algorithm. His schedule optimiser choosing races, the ranking responding, the doubters' advice arriving as "alerts" and being overridden. The AI becomes a character with an inner voice.
2. **Declare the script as data keyed to story progress.** One array of `{ copy, startBeat, startProgress, endBeat, endProgress }`. One overlay renders one block at a time. This is buildable today in our Next.js stack with GSAP or with a small store like theirs.
3. **Scrub the world, swap the words.** Our round 5 build scrubs text opacity with the timeline. Swapping text blocks with a short discrete animation (400ms, a few pixels of travel) will read more like film and far more legibly.
4. **A telemetry layer in mono** is the cheapest possible way to make AI visible. Real values only: his ranking positions, race counts, dates, points. The pattern is established; the content must be true.
5. **Colour as plot.** One colour for "noticed", one for "risk", one for "resolved". In the signal palette that could be lavender for the algorithm, amber for risk and the final, paper for resolution.
6. **Pacing.** Five screens per beat is too slow for a keynote buyer, but it proves the point: give each beat far more scroll than feels natural, and the story slows down to reading speed.

---

# 5. seasats.com

## 5.1 Verdict first

The most beautiful of the four, and the one whose techniques are closest to what we already build. It is two sites in one: a **film** for the first twelve screens, then a **catalogue** that keeps the film's atmosphere. The film is carried by an image sequence shot from the bow of the vessel; the atmosphere is carried by a single fixed background that crossfades between three gradient "themes" as you scroll, so the page never has a hard section edge.

What to notice first: **the copy is almost entirely one-line statements.** "The coordinates of the ghost fleet." "No matter the unknown, we will find it." "Deploy in minutes. Detect from miles. React at once." Short enough to read in the time a frame sequence plays.

## 5.2 Stack (verified)

```
Framework      Next.js App Router, CSS Modules (ThemeBackground_background__xCT8k)
CMS            Payload (twitter:creator is Payload's default @payloadcms; content fetched as .docs)
Smooth scroll  Lenis 1.3.13 through ReactLenis, root, { lerp: 0.12, autoRaf: false }
               ticked from gsap.ticker with lagSmoothing(0)
Animation      GSAP 3.15 + ScrollTrigger + SplitText, via useGSAP
3D             Three.js r180, only for the missions globe (boat-only.glb, KTX2 textures)
Frames         AVIF image sequences drawn to <canvas> (component AnimateFrames)
Video          26 <video autoplay muted loop preload="auto"> elements, none with a poster
Fonts          seasonMix (400, 500), seasonSans (400), supplyMono (400)
Root size      html { font-size: 10px }, so 1rem = 10px throughout
```

A component inventory, read from the CSS module names, is effectively their design system: `ThemeBackground`, `ThemeSwitch`, `ThemeHeaderTrigger`, `ThemeHeaderBackdrop`, `Preloader`, `HeroMedia`, `HeroText`, `FlythroughPoints`, `NarrativeHighlight`, `StoryTimeline`, `VirtuesDesktop`, `VirtuesMobile`, `Missions`, `MissionsGlobe`, `MissionsSlider`, `MissionsFilter`, `MissionsPopover`, `ModalMission`, `ProductComparison`, `ProductStory`, `ProductStoryFrames`, `ProductOverview`, `ProductOverviewHotspots`, `ProductOverviewSpecs`, `ProductOverviewTabs`, `ProductNav`, `AnimateFrames`, `AnimatedText`, `InViewText`, `InViewElement`, `LeadersSlider`, `Careers`, `Press`, `LivestreamWidget`, `ScrollStatsSpeed`, `ScrollStatsDistance`, `Nav`, `NavThumbnails`, `NavProgress`, `NavProximityOffsetter`, `ScrollOverlay`, `DevGrid`.

## 5.3 Story flow

([reference/seasats-00-loader.jpg](reference/seasats-00-loader.jpg) to [reference/seasats-12-footer-scroll-stats.jpg](reference/seasats-12-footer-scroll-stats.jpg).)

**Loader.** The pale "aura" gradient with the wordmark centred. Nothing else. The gradient is the same one the page will use, so the loader is already the first frame of the site.

**Act 1, the film (about 12 screens).**

1. **Hero** ([seasats-01-hero-nav.jpg](reference/seasats-01-hero-nav.jpg)). A looping idle video of vessels on still water at dusk. "Ocean Autonomy That Works" in a light, wide serif, centred, huge. One small pill: `EXPLORE PRODUCTS`.
2. **The flythrough** ([seasats-02-ghost-fleet.jpg](reference/seasats-02-ghost-fleet.jpg), [seasats-03-flythrough-cards.jpg](reference/seasats-03-flythrough-cards.jpg)). The hero dissolves into a first-person view from the bow: the mast and sensor dome in the centre, the deck running away from you, the sea ahead. As you scroll, the vessel moves forward (511 frames). Above, a centred list of six statements; the active one is full white, the others dimmed:
   - The coordinates of the ghost fleet.
   - The path of hurricanes.
   - The location of smuggling and illegal fishing.
   - The spread of toxic algal blooms.
   - The signals of submarines.
   - The status of pipelines.

   Each statement brings in one or two small photographs with mono labels (`GHOST FLEET`, `SUBMARINE SIGNALS`, `THE SPREAD OF TOXIC ALGAL BLOOMS`), floating either side of the mast.
3. **The line** ([seasats-04-no-matter.jpg](reference/seasats-04-no-matter.jpg)). The camera emerges into open, foggy sea with other vessels around. "No matter the unknown, we will find it."
4. **Virtues** ([seasats-05-virtues.jpg](reference/seasats-05-virtues.jpg), [seasats-06-deploy-expanded.jpg](reference/seasats-06-deploy-expanded.jpg)). The ground turns to the pale aura gradient. "Deploy in minutes. Detect from miles. React at once." stacked, with a strip of three small thumbnails under it. The first thumbnail grows until it fills the screen and becomes a full-bleed video of the vessels being handled in a workshop, headline top left, four feature columns along the bottom (Deploys by hand, Ships anywhere fast, Mastered with ease, Priced for scale). Then the next virtue, then the next.

**Act 2, the evidence.**

5. **Mission after mission** ([seasats-07-missions-globe.jpg](reference/seasats-07-missions-globe.jpg)). Theme crossfades to "oxidised" teal. A 3D globe with mission routes and markers, filter tabs `ALL / COMMERCIAL / DEFENSE / SCIENCE`, "Click and drag to explore featured missions."
6. **Satellites at sea.** Back to aura. The three vessels side by side, "Vessels designed to work independently, team up for coordinated maneuvers, and form vast networks for ocean-wide intelligence."

**Act 3, the catalogue.**

7. **Engineered for every need** ([seasats-08-comparison.jpg](reference/seasats-08-comparison.jpg)). Three product cards and a comparison table in mono (Endurance, Payload capacity, Deployment, Ideal use cases).
8. **Lightfish, Quickfish, Heavyfish** ([seasats-09-lightfish-frames.jpg](reference/seasats-09-lightfish-frames.jpg), [seasats-10-quickfish-copper.jpg](reference/seasats-10-quickfish-copper.jpg), [seasats-11-hotspots.jpg](reference/seasats-11-hotspots.jpg)). Each vessel gets a pinned story: a 529-frame rendered turntable that rotates as you scroll, a short intro, "The vessel, in brief", six one-word virtues with a line each, "Mission-ready from the start" with payload tabs, hotspot boxes on the render, a mono spec table, `DOWNLOAD FULL STATS`, and an `X-RAY VIEW` toggle. A pill switcher (`LIGHTFISH / QUICKFISH / HEAVYFISH`) is pinned at the bottom. **The theme changes per product**: Lightfish on aura, Quickfish on copper (orange to rust), Heavyfish on oxidised (teal to deep green).
9. **Leadership, careers, press, contact.** Back on aura. Portrait slider, "Join the crew. Build the future.", press cards, "Take action".

**Footer** ([seasats-12-footer-scroll-stats.jpg](reference/seasats-12-footer-scroll-stats.jpg)). A copper sea-and-sky image with Lightfish's hydrofoil breaking the frame, a giant wide wordmark, the links, and two numbers: `DISTANCE SCROLLED 3.3 METERS` and `AV SCROLL SPEED 0.174 KNOTS`, with a caption that changes with your speed:

```js
[ { max: .15,           message: "That's like a feather floating on a glass-still tide" },
  { min: .15, max: .3,  message: "That's like seaweed gliding on a lazy current" },
  { min: .3,  max: .5,  message: "That's like a buoy drifting with the sway" },
  { min: .5,            message: "That's like driftwood nudging along a quiet swell" } ]
```

A joke in the brand's own units, rewarding the visitor who reached the end. United Carriers does the same thing independently (section 6.5).

## 5.4 Animation framework: how it is wired

Seasats is component-first GSAP: every component owns its own ScrollTrigger, created in `useGSAP` so it is reverted on unmount. There is no central timeline. What makes it feel continuous is two shared pieces: the theme background and the Lenis instance.

**Lenis and GSAP share one clock.**

```js
<ReactLenis root options={{ lerp: 0.12, autoRaf: false }}>
// and once:
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**The theme background.** One fixed element, full viewport, behind everything (`z-index: -1`, `pointer-events: none`), containing one gradient layer per theme. The live values:

```css
.ThemeBackground_background { position: fixed; inset: 0 0 auto; height: 100vh; z-index: -1; }
.ThemeBackground_gradient   { position: absolute; inset: 0; background-size: 100% 100vh;
                              will-change: opacity; }
[data-theme="aura"]     { opacity: var(--opacity-aura, 1);
  background-image: linear-gradient(#eef4ef 59.27%, #ffefd2 84.29%, #e2ffdb 97.88%, #fff 112.27%); }
[data-theme="oxidised"] { opacity: var(--opacity-oxidised, 0);
  background-image: linear-gradient(#4e9a85, #183f34 52.82%, #2b3922 75.83%); }
[data-theme="copper"]   { opacity: var(--opacity-copper, 0);
  background-image: linear-gradient(#e08826 -48.83%, #eca43b -22.63%, #ca612a 33.9%,
                                    #752210 75.45%, #370e0a 116.33%); }
[data-theme-top="aura"] [data-theme="aura"] { z-index: 1; }   /* current theme on top */
```

Between content sections sits a dedicated spacer component, `<ThemeSwitch theme="copper" lastTheme="aura">`. Its ScrollTrigger scrubs two CSS variables on the background element, overlapping by half:

```js
gsap.timeline({ scrollTrigger: { trigger: spacer, start: "top top", end: "bottom bottom", scrub: true,
    onEnter:     () => gsap.set(bg, { attr: { "data-theme-top": theme } }),
    onLeaveBack: () => gsap.set(bg, { attr: { "data-theme-top": lastTheme } }) } })
  .fromTo(bg, { [`--opacity-${theme}`]: 0 },     { [`--opacity-${theme}`]: 1,     duration: .75, ease: "sine.inOut" }, 0)
  .fromTo(bg, { [`--opacity-${lastTheme}`]: 1 }, { [`--opacity-${lastTheme}`]: 0, duration: .75, ease: "sine.inOut" }, .25);
```

Why this is better than animating `background-color`: gradients cannot be interpolated by the browser, but stacked layers with animated opacity can, on the compositor, at no layout cost. And because the colour change is its own scroll span, a theme change is a moment in the story, not a side effect of a section boundary.

The header inverts through `ThemeHeaderTrigger` elements placed inside sections, each watched by an IntersectionObserver that increments or decrements a counter of "dark triggers under the header". The header is light whenever the counter is above zero. Inset rules per section (`calc(66vh - 4rem)` and similar) decide exactly when the flip happens.

**Frame sequences.** `AnimateFrames` is a tall "track" with a sticky container holding a canvas:

```js
// frame list built from a pattern
frames = pattern("/frames/intro-25/frame_%04d", 511, "avif");      // desktop
frames = pattern("/frames/intro-25-mobile/frame_%04d", 511, "avif"); // below 1024px

gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: true,
  onUpdate: (st) => draw(nearestLoaded(Math.floor(st.progress * (frames.length - 1)))) } });

function nearestLoaded(i, maxDistance = 20) {        // never show a blank frame
  if (loaded[i]) return i;
  for (let d = 1; d <= maxDistance; d++) {
    if (loaded[i - d]) return i - d;
    if (loaded[i + d]) return i + d;
  }
  return -1;
}
function draw(img) {                                  // object-fit: cover, in canvas
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2,
                img.naturalWidth * s, img.naturalHeight * s);
}
```

Loading is thinned in time: during one scroll-through, the Lightfish requests were every second frame and the Quickfish requests every fourth, so a sequence plays at a lower frame rate rather than stalling, and the nearest-loaded search covers the gaps. A separate invisible `loadTrigger` element starts loading before the track reaches the viewport. Product turntables are 60 fps renders (529 frames); mobile versions are 25 fps with 221 frames.

**The flythrough statements.** The intro timeline maps progress to the active statement with an offset so the first and last statements get breathing room:

```js
onUpdate: (st) => {
  const index = Math.max(0, Math.floor(st.progress * (count + 2) - 1.5));
  setActive(index);
  setVisible(st.progress > 0 && index < count);
}
```

**Word reveals.** `NarrativeHighlight` pins a block, splits its rich text into words with SplitText, and scrubs each word's opacity to 1 with a 0.1 stagger, starting at 1.2 on a timeline whose visual layer (a `topography.webp` image) ramps a `--progressVisual` CSS variable from 0 to 1 and back. The heading has its own track that drives `--progressHeading` from 0 to 1 with `power2.in`. **GSAP writes a single number into a CSS variable and CSS turns it into transforms, masks or opacity.** This pattern recurs throughout Seasats and United Carriers, and it keeps the JavaScript tiny.

A general `TextSplitter` component tags every split piece with `--char-index`, `--word-index` or `--line-index` so CSS can compute staggered transition delays without JavaScript.

Easing vocabulary across the bundle: `none` (10, all scrubbed), `power2.inOut` (7), `power4.out` (6), `power2.in` (5), `sine.inOut` (4, the theme fades). Masked reveals use `clip-path: inset(100% 0 0 0)` to `inset(0 0 0 0)`.

**The nav.** On desktop, a column of menu items slides out at the right edge when the pointer comes close (`Nav_proximity`), and the whole page frame shrinks into a rounded card to make room ([seasats-01-hero-nav.jpg](reference/seasats-01-hero-nav.jpg)). Each menu item is painted in the colour of the theme its section uses, from peach through sage to dark green, so **the menu is a colour map of the page.** A thin vertical progress rail with chapter chunks and a marker sits at the right edge, and `NavThumbnails` shows a thumbnail per section with the current one highlighted. On mobile the whole mechanism becomes one `MENU` pill.

## 5.5 Design system

**Colour.** No flat brand palette at all: the three theme gradients are the palette. Text is `#232323` on aura and white on oxidised and copper. Accents come from photography.

**Type.** Three families, each with one job:
- **seasonMix**, a light, wide serif with soft wedge serifs, for all headlines. Always sentence case, always light (400), never bold. "Ocean Autonomy That Works" at about 11rem.
- **seasonSans** for body copy, small and quiet.
- **supplyMono** for labels, tabs, spec tables and buttons, uppercase: `EXPLORE PRODUCTS`, `GHOST FLEET`, `DOWNLOAD FULL STATS`, `X-RAY VIEW`.

The contrast between a light, graceful serif and hard-edged defence hardware is the whole brand. Nothing shouts; the product looks confident because the type is calm.

**Buttons.** White pills with mono uppercase labels and a separate dark square icon cell holding an arrow. The arrow is never part of the label.

## 5.6 Mobile

The film survives intact in portrait ([seasats-13-mobile.jpg](reference/seasats-13-mobile.jpg)): the same bow flythrough (dedicated mobile frames), the six statements at the top, the labelled image cards below them. The virtues become stacked cards with an image, a rule and a short list. The proximity nav becomes a `MENU` pill.

## 5.7 Where it falls short

- `prefers-reduced-motion` appears once across the downloaded JavaScript and not at all in the stylesheets. The flythrough and turntables scrub regardless.
- Twenty-six videos, every one with `preload="auto"` and none with a poster, on a single page.
- The `og:image` URL is malformed in production (`https://www.seasats.comhttps//seasats.sfo3.cdn…`), so link previews break.

## 5.8 What John should take from it

1. **The theme background as stacked gradient layers with opacity variables.** This is exactly how our night-to-paper colour journey in `/signal` should work, and it allows the journey to pass through gradients (night violet into amber for the final, amber into paper for the practical part), not just flat colours.
2. **Theme changes as their own scroll span**, placed between beats. A colour change is a story moment.
3. **The six-statement list with the active line lit.** A strong shape for his five lessons: all five visible, the current one lit, one image card per lesson.
4. **Frame sequences from his real footage.** If the keynote film or race footage can be cut into a 10 to 20 second continuous shot, it can be exported to AVIF frames and scrubbed exactly like the bow flythrough: nearest-loaded frame, cover-fit, progressive stride loading, a separate mobile set.
5. **The scroll-speed joke, in his units.** Seasats converts scroll speed to knots; United Carriers puts it on a truck speedometer. Ours converts scroll speed into running pace per kilometre. Ownable, costs twenty lines, and rewards the visitor who reaches the footer.
6. **A light, calm serif against hard subject matter.** Worth keeping in mind for the display face: the calm carries more confidence than weight does.

---

# 6. unitedcarriers.com

## 6.1 Verdict first

A logistics company, which makes the achievement more impressive: they turned "we do freight forwarding" into a story by **following one shipping container through every leg of its journey.** A reach stacker lifts it, a truck carries it, the camera rises to watch the truck drive the road, the road ends at the sea and the container is on a ship, the camera climbs through clouds and a plane wing appears. The company's claim, "Every leg of the journey", is made literal by the scroll.

This is the site's lesson for John: **pick one object and let the audience follow it.** Everything else, the services, the stats, the testimonials, hangs off the object's journey.

## 6.2 Stack (verified)

```
Platform       Webflow (design, CMS, e-commerce for merch via Stripe)
Custom code    a Vite (rolldown) build hosted on Netlify: united-carriers.netlify.app/main.js
               plus 32 lazy chunks: one per page template, one per heavy feature
Dev workflow   an inline script loads the Vite dev client only on united-carriers.webflow.io,
               so developers get hot reload against the real Webflow staging site
Transitions    Barba.js (data-barba="container", data-barba-namespace)
Smooth scroll  Lenis 1.3.23
Animation      GSAP 3.15 + ScrollTrigger
Text splitting their own splitter (Intl.Segmenter, canvas text metrics), no SplitText
3D             Three.js r184 (hero globe); a Webflow <webflow-3d scene="OceanScene"> element
               with its own WakeSimulation module for the ship's wake
2D canvas      frame sequences (crane, truck), footer particle wordmark
Other          Swiper, Finsweet Attributes v2, Mixpanel, CookieYes, Awwwards "Site of the Day" badge
Fonts          BT Steinhart 500 and 700, BT Steinhart Mono 400, Helvetica Neue 400 and 500
Root size      html { font-size: 0.5787vw }  (100 / 172.8: 1rem = 10px at a 1728px design width)
```

The chunk list is a map of the architecture: `main.js`, `layout`, `helpers`, `scroll`, `navigation`, `popup`, `vendor-gsap`, `vendor-three`, `vendor-barba`, `lenis`, `swiper`, `frame-sequence`, `globe`, `OceanScene`, `WakeSimulation`, `my-flights`, and one chunk per page: `Home`, `About`, `Service`, `Industry`, `Career`, `Community`, `Contact`, `Article`, `TpInsight`, `TpProduct`, `Merchandise`, `Checkout`, `Payment`, `Terms`.

## 6.3 Story flow

([reference/unitedcarriers-00-loader.jpg](reference/unitedcarriers-00-loader.jpg) to [reference/unitedcarriers-11-footer-particles.jpg](reference/unitedcarriers-11-footer-particles.jpg).)

**Loader** ([unitedcarriers-00-loader.jpg](reference/unitedcarriers-00-loader.jpg)). Black. Wordmark left, a dotted world map centre with the company's offices lit in brand blue, a scrolling list of countries under the wordmark (New Zealand, Hong Kong, China, Vietnam, United States, Thailand, Germany, United Kingdom, Australia), a scrolling list of services on the right (Air freight, Ocean freight, Customs brokerage, Warehousing & 3PL, Project cargo, Domestic & linehaul transport), and a percentage counter with a small spinner. Behind it, concentric circles at 30, 45 and 75vmax pulse outward. The loader is already a summary of the company: where, what, how far.

**1. Space** ([unitedcarriers-01-globe-hero.jpg](reference/unitedcarriers-01-globe-hero.jpg)). A dotted globe in black space, orange arcs flying from the office to labelled countries (Spain, Italy, UK, Germany, Turkey, Israel, Egypt, Qatar, Saudi Arabia, Kenya). "ONE OPERATOR / EVERY LEG OF THE JOURNEY". As you scroll, the camera falls through the atmosphere: black becomes ultramarine becomes white.

**2. Arrival on the ground** ([unitedcarriers-02-stats.jpg](reference/unitedcarriers-02-stats.jpg)). White page. An aerial thumbnail of a motorway interchange, "WE MOVE FREIGHT. WE OWN THE OUTCOME.", "From countless journeys, clarity emerges", three counters: 2,500+ shipments per month, 98.2% on-time delivery, 8+ years in operation.

**3. The container is lifted** ([unitedcarriers-03-crane.jpg](reference/unitedcarriers-03-crane.jpg)). A reach stacker, shot in profile on white, drives in, lifts a container off a stack, swings it over and lowers it onto a waiting truck. Frame sequence, scrubbed.

**4. The truck** ([unitedcarriers-04-truck.jpg](reference/unitedcarriers-04-truck.jpg), [unitedcarriers-05-services.jpg](reference/unitedcarriers-05-services.jpg)). The truck sits on a black road band. Behind it, "OUR SERVICES" in giant ghost type slides past. "EVERYTHING YOUR FREIGHT NEEDS. UNDER ONE GROUP." Six services in columns: Air freight, Ocean freight, Customs brokerage, Warehousing and 3PL, Project cargo, Domestic and interstate transport. A speedometer in the truck scene shows your own scroll speed.

**5. The road** ([unitedcarriers-06-road.jpg](reference/unitedcarriers-06-road.jpg)). The camera goes overhead. The truck drives along a road that turns a corner; "RELIABILITY AT EVERY MILESTONE" and three features (Real-time freight tracking, Global network coverage, 24/7 customer support) appear beside the road as it passes them. Features are placed like milestones on the route.

**6. The sea** ([unitedcarriers-07-ship.jpg](reference/unitedcarriers-07-ship.jpg), [unitedcarriers-08-ship-headline.jpg](reference/unitedcarriers-08-ship-headline.jpg)). The road ends; a container ship, seen from directly above, sails up the screen through deep blue water with a simulated wake. "LOGISTICS THAT WORKS AS HARD AS YOU DO." Five features (One point of contact, Full supply chain visibility, Compliance you can trust, Competitive transparent pricing, Fast issue resolution) are arranged around the ship as it passes.

**7. The sky** ([unitedcarriers-09-plane-testimonials.jpg](reference/unitedcarriers-09-plane-testimonials.jpg)). The camera rises into cloud. A plane wing cuts in from the right. "TRUSTED BY BUSINESSES ACROSS APAC", long testimonials with portraits, then logo grids of partner airlines and shipping lines on hairline cells.

**8. Back to earth.** A blue gradient, "WHAT'S MOVING IN YOUR INDUSTRY" and a news list; an FAQ; "READY TO MOVE SMARTER?" on black with concentric circles.

**9. Footer** ([unitedcarriers-11-footer-particles.jpg](reference/unitedcarriers-11-footer-particles.jpg)). Contact details, a map with offices, an industries marquee, payment icons for the store, and a huge wordmark made of particles that scatter from the cursor and drift back.

The route is land, sea, air, and back to land, which is also the order of their services. **The information architecture and the story are the same thing.**

## 6.4 Animation framework: how it is wired

This is the most "engineered" framework of the four, and the easiest to learn from because every section follows the same contract.

**Page lifecycle through Barba.** `main.js` maps each Barba namespace to a lazily imported page module (`Home`, `About`, `Service`…). A page module exports a registry of section classes:

```js
const Home = { Hero, Intro, Service, Why, Testi, Partners, Insight, Faq, Cta, Footer };
```

**Every section implements the same interface:**

```js
class Hero {
  setup(data, mode)   // mode is "once" (first load, after the loader) or "enter" (after a Barba transition)
  setupOnce(data)     // build a paused reveal timeline; play it when the loader finishes;
                      // onStart removes [data-init-hidden]; onComplete starts animationScrub()
  setupEnter(data)    // same reveal, but played by a once:true ScrollTrigger
                      // (start "top bottom+=50%") after a page transition
  animationReveal(tl) // declarative reveal: a list of reveal primitives added to one timeline
  animationScrub()    // everything tied to scroll position (globe, crane, truck, road, ship)
  interact()          // hover, cursor, drag
  playOnce() / playEnter()
  destroy()           // kill timelines, tickers, WebGL; deferred until after the leave
                      // animation when deferDestroyUntilAfterLeave is true
}
```

Two consequences. First, **reveal animations and scroll animations are separate methods**, so a section can finish its entrance before scrubbing starts (`onComplete: () => this.animationScrub()`). Second, the same section works whether you arrive from the loader or from another page, because "once" and "enter" are distinct paths into the same reveal.

**Reveal primitives.** `animationReveal` never writes raw tweens. It assembles small objects from `layout.js`, each wrapping one element and one kind of reveal, into a helper that owns the timeline and ScrollTrigger:

```js
new RevealGroup({ timeline: tl, tweenArr: () => [
  new LineReveal({ el: label }),          // the ink sweep, below
  new LineReveal({ el: heading }),
  new LineReveal({ el: description }),
  ...buttons.map(el => new FadeUp({ el, from: { y: rem(10) } })),
]});
```

Card lists use `ScrollTrigger.batch(items, { start: "top 85%", batchMax: 1, once: true })`, with each card's inner reveals delayed by `0.15 × index`.

**The ink-sweep line reveal.** Their signature text effect. Headlines are split into lines with their own splitter, which measures line breaks with canvas text metrics and `Intl.Segmenter` (so Chinese, Japanese and Thai break correctly, which matters for an APAC business). Each line gets:

```css
.split-line-p {
  --bg-progress: 0;
  color: transparent;
  background: linear-gradient(90deg,
    var(--color-final) 0%, var(--color-final) 30%,   /* written text */
    var(--_color---content--brand) 40%,               /* a blue leading edge */
    transparent 50%, transparent 100%);               /* not yet written */
  background-size: 350% 100%;
  background-position-x: calc((100 - var(--bg-progress)) * 1%);
  background-clip: text;
}
```

```js
gsap.set(lines, { "--color-final": getComputedStyle(parent).color, "--bg-progress": 30 });
gsap.to(lines, { "--bg-progress": 100, stagger: 0.1, duration: 1.2, ease: "power1.inOut",
                 onComplete: () => split.revert() });   // back to plain text afterwards
```

Each line is written left to right with a brand-blue nib, one line after another. It reads as handwriting or a printer head rather than a fade, it costs one CSS variable per line, and it reverts to plain text when finished so nothing is left split in the DOM. See the half-written "RELIABILITY AT EVERY MILESTONE" in [reference/unitedcarriers-06-road.jpg](reference/unitedcarriers-06-road.jpg).

**Scrubbed scenes.** The crane is a `FrameSequence` of AVIF frames on Webflow's CDN (one of the sequences is exported at every second frame: `frame_66`, `frame_68`…), with separate desktop and mobile setups (`setupFrameSequenceDesktop`, `setupFrameSequenceMobile`, `animationScrubDesktop`, `animationScrubMobile`). The truck has separately animated wheel elements. The road scales with a `--scale-factor` variable and brightens with `--bright-fade`. The ship scene is Webflow's own 3D element, preloaded one section early and configured through a controls object:

```js
{ zoomFactor: 8, fov: 35, wakeCenterY: -0.5, wakeSpeed: 50, wakeIntensity: 0.4,
  wakeWidth: 2.2, height: 1.7, overlayScale: 1 / 0.082 }   // desktop values
```

The hero globe is a Three.js sphere of dots sampled from TopoJSON country shapes, with flight arcs from a `my-flights` module, rotated on a GSAP ticker (starting at `phi = 3.8`), with country labels that arrive from `autoAlpha: 0, y: 10, filter: blur(5px)` and blue and orange glow layers that scale in from `blur(20px)`.

**The speedometer.** The truck's speedometer reads your scroll:

```js
gsap.ticker.add((time, deltaMs) => {
  const y = lenis.scroll;
  let target = 0;
  if (panel.active) {
    let pxPerSec = Math.abs(y - lastY) / (deltaMs / 1000);
    target = Math.min(95, pxPerSec / 25 + (pxPerSec > 500 ? Math.random() * 2 - 1 : 0)); // needle jitter at speed
  }
  const k = target > shown ? 0.1 : target === 0 ? 0.15 : 0.06;   // accelerate, coast, stop
  shown += (target - shown) * k;
  display.textContent = String(Math.round(shown)).padStart(2, "0");
  lastY = y;
});
```

Asymmetric easing (quick to rise, slow to fall) is what makes a needle feel physical.

**Page transitions.** A fixed `.trans` layer with `clip-path: circle(0%)` expands over the page with concentric outline circles (`16.088vmax`) rippling out, in the same language as the loader.

**Cursor.** A full-screen fixed layer with `mix-blend-mode: difference`, plus a trail of small orange (`#f50`) dots with `filter: blur(2.5px)`. 121 elements carry `data-cursor` states.

**Footer particles.** The wordmark is sampled from an image into particles (`color: #111116`, `scale: 0.8`); each particle has an origin and eases back to it (`ease = 0.04 + random × 0.04`) after the cursor pushes it away.

**Hover underline.** `::before` line with `transform: scaleX(0)`, origin swapping from right to left, `0.6s cubic-bezier(0.66, 0, 0.15, 1)`.

Easing vocabulary in the reveal library: `power2.out` (14), `power2.in` (7), then `expo.out`, `power1.inOut`, `power3.out`, `back.out(1.5)`. Durations cluster at 0.4s and 0.2s for UI, 1.2s for the ink sweep.

## 6.5 Design system

**Colour.** `--_color---primary: #0016cb` (ultramarine, the leading edge of every headline, office dots, gradients), `--_color---secondary: #f50` (orange: globe arcs, cursor trail), `#111` text on `white`, a surface grey `#f4f4f4`, and text opacities as tokens (`#111111e0` sub, `#111111b8` soft, `#1116` note). The big gradients (black to ultramarine to white) are atmosphere, used at the transitions between altitudes.

**Type.** BT Steinhart 700 uppercase for headlines (a squarish, wide, techno grotesque), BT Steinhart Mono for buttons and labels, Helvetica Neue for body. `h1` 9.6rem, `h2` 7.2rem, both `line-height: 1.05`. With `1rem = 10px` at 1728px wide, sizes read like pixel values in the design file.

**Grid.** 16 columns, `2rem` gutter, `4rem` page padding, all as tokens (`--container--column: 16`, `--container--one-column: calc(...)`).

## 6.6 Mobile

The globe hero survives, with a thin utility bar on top (`CARBON CALCULATOR | LIVE TRACKING PORTAL`) and a `MENU` button with three dots ([unitedcarriers-12-mobile.jpg](reference/unitedcarriers-12-mobile.jpg)). Mobile-specific classes (`home-service-mb-crane`, `-mb-road`, `-mb-truck-stick`) show that the crane-truck-road sequence is rebuilt for portrait rather than scaled down. The cookie banner covers a third of the first mobile screen.

## 6.7 Where it falls short

- **No `:focus-visible` styles** in the stylesheet at all; `prefers-reduced-motion` appears twice in the JavaScript and never in CSS.
- Counters and the ink sweep only resolve when their trigger fires; screenshots taken mid-scroll show half-written headlines and counters at 2,455 instead of 2,500.
- A live typo in a feature title: "Global Network overage".

## 6.8 What John should take from it

1. **Follow one object.** United Carriers follows a container. John's story has natural candidates: the world-ranking number itself travelling through the page and changing as it goes; the race bib; the competition schedule as a physical sheet; the words on his arm. The object gives the scroll a direction and makes every section part of one journey.
2. **Make the structure the story.** Their route (land, sea, air) is their service list. Our five lessons can be the legs of John's journey rather than a list after it.
3. **The section contract.** `setup`, `animationReveal`, `animationScrub`, `interact`, `destroy`, with reveal and scrub kept separate. In our Next.js build this maps to one hook per section with the same four parts, and it makes the mobile and reduced-motion branches explicit instead of accidental (the bug class recorded in our round 5 notes).
4. **The ink sweep for the five lessons.** Written left to right with an amber leading edge, then reverting to plain text. It reads as writing, it stays legible, and it is a far better fit for "Hey mom, made it" (literally written) than a fade.
5. **The loader as a summary.** Where, what, how far, in the three seconds before the site starts. John's could be the ranking count climbing.

---

# 7. lisa.locomotive.ca

## 7.1 Verdict first

LISA is not a scrolling story at all. It is a one-screen, click-driven conversation with a 3D character, built by an agency as its own new-business front door. The page is 900px tall and never scrolls. What makes it a reference for John is not the 3D; it is that **the enquiry form has been turned into the experience.** Every question LISA asks is a field in a brief. Name, company, job title, project type, budget, deadline, the brief itself, email. By the time you reach the end you have filled in a qualified lead form, and it felt like a conversation with a character who has opinions.

## 7.2 Stack (verified)

```
Server         Twig templates (console: "preloaderEnterPromise created in preloader.twig")
Front end      Locomotive's modularJS (data-module-header, data-module-lisa,
               data-module-lisa-visualizer, data-module-video-modal, data-module-cookie-consent)
               with a Vue 3 app mounted inside for the conversation (data-v-app, __VUE__)
3D             Three.js r165: lisa.glb (2.9 MB), KTX2 and Draco loaders, envmap.exr
Video          Mux HLS streams played on the television screen as reaction clips;
               running_code.mp4 and idea.mp4 as screen content
Audio          ambient.mp3 (about 4 MB), plus one recorded voice line per step, per language:
               /assets/lisa/en/lisa.intro.1.mp3, lisa.greeting.13.mp3, lisa.project.budget.5.mp3 …
               Web Audio AnalyserNode for speech volume
Forms          invisible reCAPTCHA; posts JSON to /api/rfp-enquiries, /api/job-enquiries
               or /api/general-enquiries depending on the chosen path
Analytics      gtag events flow_submit, flow_exit, page change attempts with step and audio state
Motion         Vue <Transition> classes plus CSS; one easing everywhere
Fonts          HelveticaNowDisplay Regular, PPLocomotiveNew Light
Access         js-focus-visible polyfill on <html>; focus-visible appears 35 times and
               prefers-reduced-motion 5 times in the stylesheet
```

## 7.3 Story flow

([reference/lisa-00-loader.jpg](reference/lisa-00-loader.jpg) to [reference/lisa-07-mobile.jpg](reference/lisa-07-mobile.jpg).)

1. **Loader.** Black screen, the Locomotive wordmark with its asterisk mark, centred. A 1.2 second promise gates the entrance.
2. **The character** ([lisa-01-click-to-start.jpg](reference/lisa-01-click-to-start.jpg)). A studio-grey backdrop. A figure in a pale roll-neck jumper, cropped at the chest, whose head is a CRT television trailing cables. The screen shows static and `[CLICK] TO START`. Under the screen, six small LEDs; one is lit. The header is just `Locomotive®`, the asterisk mark and `Let's talk`.
3. **The greeting** ([lisa-02-greeting.jpg](reference/lisa-02-greeting.jpg)). On click, the character turns to the right half of the screen and the conversation appears on the left. Her lines type out character by character with a blinking block cursor, and characters scramble before they settle (one capture caught "Can I ibwp?" resolving into "Can I help?"). She speaks each line aloud:

   > Oh, hi! I'm L.I.S.A, your trusty (and slightly opinionated) assistant at Locomotive.
   >
   > I was about to log off and start a new life. But for you? I'll stay. Can I help?

   Choices: Start a project, Join the team, Drop a quick word, Discover our culture, and a plain fallback, "Write us: info@locomotive.ca".
4. **The project path.** Each question is set up or followed by a reaction line, and the television plays a matching clip:

   | Step | LISA says | You give | Screen |
   |---|---|---|---|
   | intro | "I've pushed all my other meetings into the void. This one's got priority." | | |
   | name | "Step one to working together: you tell me your name, I pretend not to already know it." | Your name | |
   | reaction | "We're officially on a first-name basis. Let's go." | | |
   | company | "Give me the name of your company, and I'll give you goosebumps." | Company, job title | |
   | type | "Alright, let's get into the juicy stuff. What are we building together?" | Branding / Web / Branding & Web / I have custom needs | |
   | reaction | "Ah, the brand. The foundation. The capital 'B.' Let's shape something iconic." (one line per type) | | |
   | budget | "This is the least fun part of the conversation. Unless you're into spreadsheets. What's your budget range?" | 25k to 50k / 50k to 75k / 75k to 100k / 100k+ | found-footage glitch clip ([lisa-04-budget-step.jpg](reference/lisa-04-budget-step.jpg)) |
   | deadline | "Let's pin down a deadline before things get too dreamy." | As soon as possible / In the next 6 months / Let's talk about it / I have an exact date | a clock face ([lisa-05-deadline-step.jpg](reference/lisa-05-deadline-step.jpg)) |
   | reaction | "All synced up. Let's bring this thing to life." then "Think of this as the first date, minus the awkward small talk." | | |
   | brief | "Tell us about your project, or upload a brief if you have one." | Free text, file upload, a "What's a good brief?" note | two glowing eyes ([lisa-06-brief-step.jpg](reference/lisa-06-brief-step.jpg)) |
   | reaction | "Loving the vision so far. I'm already picturing the moodboard." | | |
   | email | "Email, please. I'll take it from here." | Email | |
   | processing | "Email noted. Spinning up the recap, flexing my digital muscles." | invisible reCAPTCHA, then submit | all six LEDs lit |

   Progress is shown twice: the LEDs under the screen, and a 4px bar across the bottom of the viewport driven by `--progress` (0.1, 0.2, 0.25, 0.3, 0.4, 0.45, 0.5, 0.6 … 1).
5. **Navigating away mid-flow** triggers a browser confirm with a custom message and logs a `flow_exit` event with the step and whether audio was on.

LISA's lines contain em dashes in the original; per this project's no-em-dash rule they are replaced with full stops or commas in the quotes above. Wording is otherwise verbatim.

**What makes the conversation work:** the reaction lines. Every question is paid for with a line of personality. The budget question admits it is the least fun part. The deadline question jokes about dreaminess. The brief question offers help ("What's a good brief?"). Voice lines have numbered variants (`lisa.intro.1` in one session, `lisa.intro.2` in another; `lisa.greeting.13`), so repeat visitors hear different takes.

## 7.4 Animation framework: how it is wired

**The conversation is a state machine, not a timeline.** The Vue app holds the current step; each step component renders a dialog line, an optional set of choices or inputs, and a "previous" line. Transitions are Vue `<Transition>` classes styled in CSS, with one easing for everything: `cubic-bezier(0.215, 0.61, 0.355, 1)` (ease-out cubic) at 0.3s, used 43 times in the stylesheet.

**The dialog hand-off.** When a step advances, the current line becomes the previous line by moving up, shrinking and blurring:

```css
.c-lisa-step.default-leave-to .c-lisa-step_dialog {
  transform: translate3d(0, calc(-100% - 2.667rem), 0) scale(0.8);
  filter: blur(4px);
  transition: transform .3s var(--ease), filter .3s var(--ease);
}
.c-lisa-step_previous {                      /* the line above the current one */
  position: absolute; cursor: pointer;
  transform: translate3d(0, calc(-100% - 2.667rem), 0) scale(0.8);
}
.c-lisa-step_previous:hover { filter: blur(3px); }       /* click it to go back */
.c-lisa-step.default-leave-to .c-lisa-step_previous {    /* the older line leaves entirely */
  transform: translate3d(0, calc(-200% - 2.667rem), 0) scale(0.5); opacity: 0;
}
```

Going backwards runs the reverse transition set (`backwards-enter-*`, `backwards-leave-*`), so the blurred line slides back down and sharpens. The effect is a conversation receding into depth of field: the current line sharp, the last one out of focus above it, anything older gone.

**Typing and choices.** The current line types out with a blinking block cursor drawn in CSS (`::after`, `0.4em × 0.5em`, `scaleY(1.75)`, `animation: lisaCursor 1s linear infinite`). When typing finishes, the step becomes `-expanded`: the dialog scales to 0.9 and the choices fade in 0.1s later from `translateY(1.333rem)`.

**Voice drives the character.** An `AnalyserNode` samples the voice track on a throttled loop:

```js
analyser.getByteFrequencyData(freq);
const volume = average(freq) / 64;
lisa.speechVolume = volume;              // uniform on the LED materials: they pulse as she talks
if (volume > 0.2 && !ducking) duckAmbient();      // lower the music under speech
else if (volume < 0.2 && ducking) unduckAmbient();
```

The same scene exposes `displayCode`, `displayRunningCode`, `darkMode` and `xDecay` on the screen material, with a Tweakpane debug panel (including a "Say Yes" button) left in the build. Custom shader uniforms across the scene include `uOn`, `uDarkMode`, `uMouse`, `uScrollSpeed` and `uTime`, and the bundle registers pointer listeners, so the scene responds to the cursor.

**Sound is a first-class control.** A pill toggle bottom right with a white knob that slides between speaker and muted states (`transform .3s`). Going back is a black circular button bottom left.

**Mobile.** The dialog becomes a bottom sheet: `.c-lisa_main { inset: calc(50% - 8px) 0 0 0; border-radius: 8px 8px 0 0; }`, with the character in the top half ([lisa-07-mobile.jpg](reference/lisa-07-mobile.jpg)).

**Design tokens.** Black text on a white-to-grey studio gradient; the menu is electric blue `#312DFB` with white. A spacing scale with explicit mobile values (`micro 14/8`, `tiny 20/20`, `small 30/30`, `medium 40/40`, `large 80/52`, `big 150/80`, `huge 200/100`, `enormous 250/140`), a 12-column grid with a 20px gutter, `--font-size-huge: 7.64vw`, `h1: 4.67rem`.

## 7.5 Where it falls short

- The flow is long: about twelve screens of conversation for a project enquiry. It works for an agency because a qualified brief is valuable; it would exhaust a buyer who only wants to check a date.
- No way to see all questions at once or skip to a plain form except the email fallback on the first screen.
- 2.9 MB model, 4 MB ambient track, several HLS streams, before the first question.

## 7.6 What John should take from it

1. **The booking enquiry as a short conversation in John's voice.** Four or five questions, each with one line of personality, in the direct, dry register CLAUDE.md sets: event date, audience size, format (keynote, keynote plus Q&A, workshop), city, email. A progress bar. The previous answer blurred above the current question. It turns the least exciting part of the site into something that sounds like him.
2. **Recorded voice, optional and muted by default.** John is a speaker. His own recorded lines guiding the enquiry would be the most ownable asset on the site. It must stay optional: sound only after an explicit toggle, captions always on screen.
3. **Keep the plain route visible.** LISA keeps "Write us: info@…" on the first screen. We keep a plain email and a one-screen form one click away.
4. **The depth-of-field hand-off** (move up, scale 0.8, blur 4px) is a cheap, elegant transition for any sequence of statements, including the five lessons.
5. **Log where people drop out.** LISA records the step and audio state when someone leaves. For a site whose one job is enquiries, knowing which question loses people is worth more than any visual effect.

---

# 8. The four animation frameworks side by side

| | USAvionix | Seasats | United Carriers | LISA |
|---|---|---|---|---|
| Source of truth | Lenis scroll mapped to `{progress, showRatio, hideRatio, isActive}` per scene, in one store | A ScrollTrigger per component | A ScrollTrigger per section class, inside a Barba page lifecycle | The current step of a Vue state machine |
| Who knows about `scrollY` | One fifteen-line function | Every component | Every section | Nothing |
| Scrubbed by scroll | Camera and drone clips from Blender, shader uniforms, fire and map effects | Frame sequences, theme crossfades, word opacity, CSS progress variables | Frame sequences, globe, truck, road, ship camera, glow layers | Nothing |
| Triggered, not scrubbed | Every headline and body block (one at a time), telemetry lines | Section reveals | Ink-sweep lines, counters, card batches | Every step change |
| Text reveal | Whole block: 8px rise, red to white, 0.4s | SplitText words, opacity scrubbed with 0.1 stagger | Own splitter, per-line gradient sweep 30 to 100, 1.2s, 0.1 stagger, then revert | Typing with a scramble and a block cursor; previous line blurs up |
| Copy lives in | A data array keyed to scene progress | Payload CMS blocks | Webflow CMS and markup | Step definitions in the Vue app |
| Heavy media | GLB models (Draco), EXR, noise textures, one AVIF sequence | AVIF sequences at 25 and 60 fps, 25+ MP4 loops, KTX2 globe | AVIF sequences (every second frame), Webflow 3D ocean with wake simulation, MP4 wave | GLB character, EXR, Mux HLS on the screen, MP3 voice and ambient |
| Mobile strategy | Separate camera and drone clips, same experience | Separate 25 fps frame sets, stacked cards, `MENU` pill | Separate mobile scrub methods and DOM | Bottom-sheet dialog |
| `prefers-reduced-motion` | None found | 1 occurrence in JS, none in CSS | 2 in JS, none in CSS | 5 in CSS |
| `:focus-visible` in CSS | 11 occurrences | 36 | 0 | 35, plus a polyfill |
| Easing signature | `easeInOut` 0.4s on copy; linear scrub | `none` for scrub, `sine.inOut` for theme fades, `power4.out` for reveals | `power2.out` UI, `power1.inOut` for the sweep | ease-out cubic, 0.3s, everywhere |

Four patterns recur and are worth naming, because we can use all of them:

1. **One number, many consumers.** USAvionix writes `progress` to a store; Seasats and United Carriers write `--progress`, `--bg-progress`, `--progressHeading` to CSS variables. In every case, a single normalised number drives many visual properties, and the animation code stays small.
2. **Scrub the world, trigger the words.** The two most film-like sites (USAvionix, and United Carriers in its reveals) never scrub text. Images, cameras and colour follow the scroll; words arrive as discrete events that finish on their own. Scrubbed text is the main source of the "effortful to read" complaint John made about round 3.
3. **Media as frame sequences, loaded progressively.** Seasats and United Carriers both export motion as AVIF frames and draw them to canvas, with nearest-frame fallbacks and stride loading. It gives film quality with total scroll control and no video decoder seeking.
4. **The loader is the first scene.** Every one of the four uses the loader as brand space: USAvionix calibrates a wireframe drone, Seasats shows the gradient the site is made of, United Carriers summarises the network, LISA shows a wordmark and then a character waiting for a click.

---

# 9. The four story flows side by side

| | USAvionix | Seasats | United Carriers | LISA |
|---|---|---|---|---|
| Narrative device | The product performs one mission | A film, then evidence, then a catalogue | Follow one object through every leg | A conversation with a character |
| Protagonist | The drone, then the swarm, then the AI | The ocean, then the vessels | The container | The visitor |
| Structure | Three acts plus epilogue | Manifesto, virtues, proof, products, people | Space, land, road, sea, sky, earth | Greeting, qualification, brief, contact |
| Scroll per beat | 5 screens | 2 to 4 screens | 3 to 6 screens | one click |
| Copy per beat | A headline and one or two sentences | One line | A headline, one paragraph, or a feature list | One line from LISA, one answer from you |
| Where the ask sits | End only: limited demo slots, then "Ready to talk to us?" | End only, "Take action" | Twice: a header button throughout, and "Ready to move smarter?" | The whole experience is the ask |
| How it ends | Proof (use cases, reach, founders), then the drone landing | A joke about your scroll speed | Particles and a map of offices | A recap and a sent brief |
| Interface while the story runs | Wordmark, chapter label, `Contact`, menu | Wordmark, a proximity nav that hides | Wordmark, menu, cursor | Wordmark, `Let's talk`, back, sound |

What they share:

- **The story is the product demonstration.** None of them explains first and shows second. USAvionix introduces thermal imaging because there is a fire. United Carriers introduces ocean freight because the road reached the sea.
- **One continuous space.** A single landscape, a single sea, a single route, a single room. Section boundaries are hidden until the story ends, then allowed to show for the practical part.
- **Very little text per screen.** One line, or a headline and a sentence. The longest copy in any of the four stories (Seasats' six statements) is still one line per statement.
- **An inner voice.** USAvionix's telemetry, Seasats' labelled image cards, United Carriers' speedometer, LISA's reactions. A second, smaller channel that comments on what the main channel shows.
- **A persistent, quiet way to contact.** Every one keeps a contact affordance in the frame at all times, and none interrupts the story to ask.

---

# 10. What this means for John's site

Read against John's round 3 verdict (film-first hero, story not website, half the text, no menu, colour on a dark ground, AI visible, five lessons explicit, bio secondary) and the round 5 build at `/signal`:

1. **Pick the object.** United Carriers' container and USAvionix's drone show that a story needs something to follow. For John, the strongest candidate is the world-ranking position itself: a number that starts far down, is acted on by the algorithm's choices, the doubters and the setbacks, and ends at the Olympic final. It can travel through every beat as a single element.
2. **Make the algorithm a character with an inner voice.** A mono telemetry line, bottom right, declared against story progress, in the USAvionix pattern. Only true values from background.md: dates, races, ranking positions. This is the most direct answer to "AI must be visible".
3. **Put the copy in data, keyed to beats.** One array of `{ lines, startBeat, startProgress, endBeat, endProgress }`, one overlay, one block at a time, swapped with a short discrete animation. Stop scrubbing text opacity. This addresses both "half the text" (each block must fit the window) and "readability first" (text is never half-faded).
4. **Five screens per beat is too slow; one is too fast.** USAvionix gives 5, Seasats 2 to 4, United Carriers 3 to 6. For a buyer who has not chosen to be there, about two screens per beat, with a visible chapter label and a skip, is the right range.
5. **Theme background as stacked gradient layers with CSS opacity variables**, crossfaded in their own scroll spans (Seasats). It is the correct mechanism for the night-violet to paper journey already in `/signal`, and it lets the final beat pass through amber.
6. **Frame sequences from real footage** (Seasats, United Carriers): nearest-loaded frame, cover-fit canvas, stride loading, separate mobile frames. If a continuous shot exists in the keynote film or race footage, this is how it becomes scroll-driven without a 3D budget.
7. **The ink-sweep reveal** (United Carriers) for the five lessons and for "Hey mom, made it": written left to right with an amber leading edge, then reverted to plain text.
8. **The enquiry as a short conversation** (LISA), in John's voice, five questions, progress bar, previous answer blurred above, plain route always visible. Optional recorded voice lines, off by default.
9. **Scroll speed as running pace** (Seasats' knots, United Carriers' speedometer): a footer or margin readout in minutes per kilometre. Small, ownable, and it rewards reaching the end.
10. **The quality floor none of them fully meets.** USAvionix has no reduced-motion path; United Carriers has no focus styles. Our rule stays: the default CSS is the readable, stacked layout; script adds the cinema only for fine pointers with motion allowed; every element the timeline reveals must also be resolved in the mobile and reduced-motion branch.

---

## Appendix to Part 2: what was captured

**Bundles and styles read in full:**

- usavionix.com: 42 Next.js chunks (the story, scene store and overlay live in two chunks of about 186 KB and 35 KB), one Tailwind stylesheet (78 KB).
- seasats.com: 20 Next.js chunks, 4 stylesheets (178 KB combined), the live theme-background rules read from the DOM.
- unitedcarriers.com: `main.js` (52 KB) and 32 Vite chunks from Netlify, including `Home` (130 KB), `layout` (92 KB), `OceanScene`, `WakeSimulation`, `frame-sequence`, `globe`; the Webflow stylesheet (439 KB); the embedded style blocks read from the DOM.
- lisa.locomotive.ca: `app.js` (2.55 MB uncompressed), `vendors.js`, `main.css` (200 KB).

**Screenshots in [reference/](reference/):**

- `usavionix-00-loader` to `usavionix-11-mobile`
- `seasats-00-loader` to `seasats-13-mobile`
- `unitedcarriers-00-loader` to `unitedcarriers-12-mobile` (a cookie banner covers the bottom right of most desktop frames)
- `lisa-00-loader` to `lisa-07-mobile`

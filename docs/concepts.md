# Three landing-page concepts — design plan

Revised after the first review (17 September 2026). The brief from that review: B's cinematic, high-energy register is the bar; A and C are rebuilt to meet it with their own ideas rather than a quieter register. One accent per concept, used consistently. Footers that read as footers. Social links in nav and footer. No labels above headings.

| | A. Velocity | B. Made it | C. Stadium |
|---|---|---|---|
| Route | `/concept-a` | `/concept-b` | `/concept-c` |
| Register | Speed. Blue-black, motion-blur photography, condensed capitals. | Cinema. Warm black, full-bleed photography, condensed capitals, Belgian yellow. | Film poster. Black, black-and-white photography, high-contrast serif capitals, one red line. |
| Accent | Paris-track lavender `#A895DD`, on every CTA, every numeral, the race clock, the ranking line, and the enquiry band. | Belgian yellow `#F2C230`, on the nav CTA, chapter numbers, numerals, rules, the marker text, the play disc, the enquiry button, the footer line. | Belgian red `#E4322B`, on the finish line, every title rule, the distance counter, part numbers, the nav CTA and enquiry button. |
| Hero primary action | Enquiry. Film secondary. | The film. Enquiry secondary. | Enquiry and film side by side, enquiry filled. |
| The one bold element | The page is one 5000m: a race clock in the nav runs from 0:00.00 to his 13:03.46 personal best as you scroll. The five chapters run sideways in a pinned strip with the world-ranking line drawn across them. | The final chapter: "Hey mom" and "Made it" are written in marker across the Olympic-final photograph, one word per scroll pass. | The last lap: one pinned scene, five black-and-white frames cross-fading with a red finish line travelling in and a distance counter running 400 to 0. He crosses the line and the page shows colour for the first time. |
| Type | Archivo variable, width 66, uppercase. | Big Shoulders + Hanken Grotesk. | Bricolage Grotesque only, heavy and mixed case. Replaced Bodoni Moda in round 3: too classical and hard to read. |
| Photography | Pan-blur race shots in colour (VSP Pictures, Jacob Jasper, Belga). | Full colour, licensed Paris heats and final. | Grayscale by default; colour only at the finish and on hover. |

## Why the two rebuilds are different from each other and from B

All three are now dark and photographic, so the differences are carried by type, colour and the bold element. A is cool and technical (blue-black, lavender, a grotesque, data). B is warm and loud (black, yellow, Big Shoulders, the marker). C is monochrome and theatrical (black, red, Bodoni, the finish). None of the three shares a typeface, an accent, or a scroll device.

## Photo licensing

Belga Image photographs are used only from `media/photos/01_Commercial License Pics`. Every other Belga file in the library is excluded from the build. New photographers in this round are credited by handle where no name is known: @vspicturescom, @jacobjasper, @ryanxallek, @quintenfelden, @erkipictures.

## Concept A. Velocity (rebuilt)

Palette: `--ground #0B0A12`, `--ink #F1EFFF`, `--lane #A895DD`, `--lane-deep #2B2150`. Archivo at width 66, weight 800, uppercase for every headline and numeral. The nav carries the race clock and a lavender progress line. The strip pins for the width of its five panels; the ranking line is an SVG with a clip that widens with scroll, so it survives the non-uniform scaling. Phones get the panels stacked and the line omitted.

### Earlier direction, superseded

## Concept A. Ranking (first round)

**Idea.** The site is the algorithm's output rendered as a timing screen. Lane geometry and world-ranking data are the visual vernacular. It says: this speaker thinks in systems.

**Colour**
- `--ground #F3F2EE` warm-grey paper (not cream; no yellow cast)
- `--ink #101014`
- `--lane #A895DD` Paris 2024 track lavender, the only accent
- `--lane-deep #2B2150` deep violet, the pinned data section and the footer
- `--rule #CFCDC6` hairlines
- `--muted #6B6A66` secondary text

**Type.** One family: Archivo (variable, width axis 62 to 125). Condensed heavy for numerals and headlines (wdth 75, wght 700, line-height 0.9, negative tracking), normal width for body at 1.0625rem/1.55, tiny labels at wdth 90 in sentence case with no tracking.

**Layout.** A 12-column hairline grid with horizontal lane lines that draw in as sections enter. Left-aligned throughout. Stats sit in hairline-divided cells. Sections are separated by lane lines rather than padding blocks.

```
+--------------------------------------------------------------+
| JH  Keynote  Story  Proof                  [Check availability]|
|--------------------------------------------------------------|
| Two years from deciding to try,          | 2 yrs | 5000m     |
| to the Olympic final.                    |-------+-----------|
|                                          | Final | Fastest   |
| I got there on a race schedule my        | Paris | rise ever |
| federation told me not to run.           |-------------------|
| [Check John's availability] [Watch film] | [poster ▶ 60s]    |
+--------------------------------------------------------------+
```

**Principles.** Numbers carry the argument. Nothing is decorated; every rule encodes a division. Colour appears only where the data is (the climbing line, the qualifying row, one CTA).

## Concept B. Made it

**Idea.** The site is the film extended. Black, photographs at full bleed, condensed capitals big enough to touch the edges. The story is told in five theme-flipping chapters and ends with the two words on his arms.

**Colour**
- `--black #0C0B0A` warm black
- `--bone #EDE7DA` type on dark
- `--flag #F2C230` Belgian yellow, used for the marker text and one CTA only
- `--smoke #2A2724` secondary surfaces
- `--paper #E9E4D8` the two light chapters (Iten, the village)

**Type.** Big Shoulders Display (condensed, athletic, one idea) for every headline and numeral, uppercase, line-height 0.85. Hanken Grotesk for body at 1.0625rem/1.6 and for all labels, sentence case.

**Layout.** Full-bleed. Text blocks pinned to the edges of the viewport, photographs bleeding under them. Chapters alternate dark and paper with the nav inverting. Centre-aligned only for the single closing statement.

```
+--------------------------------------------------------------+
| JOHN HEYMANS                                        Enquire  |
|                                                              |
|      [full-bleed photo: Paris final, lavender track]         |
|                                                              |
| TWO YEARS.                                                   |
| ONE ALGORITHM.                                               |
| AN OLYMPIC FINAL.                                            |
| ( ▶ Watch the 60-second film )      Check John's availability|
+--------------------------------------------------------------+
```

**Principles.** One typeface does the shouting so nothing else has to. Yellow is spent twice. The most emotional asset is held back until the end and earned by the four chapters before it.

## Concept C. Stadium (rebuilt)

Palette: `--black #050505`, `--white #F4F2EE`, `--red #E4322B`. Bricolage Grotesque for everything: optical size 96, weight 700 to 800, mixed case for headlines; optical size 14 for body. The first version used Bodoni Moda capitals, which John and Maarten found too classical and hard to read. Photographs are grayscale by CSS filter, so colour can be revealed: on the last frame of the lap, on the Supernova recording on hover, and on the part thumbnails on hover. The red line under every title draws in before the title rises.

### Earlier direction, superseded

## Concept C. The log (first round)

**Idea.** The site is John's own account, read like a long piece of writing with his training log laid across it. Ink on stone, one serif, the pen the constant. Handwriting appears only where he actually wrote something: on his arm.

**Colour**
- `--stone #ECEAE4` cool light ground
- `--ink #15171C`
- `--pen #1E3FBF` cobalt, used for links, the log's active entry and the desk
- `--pencil #8A8D95` secondary text and rules
- `--card #F6F5F1` the desk and quotes

**Type.** Newsreader (variable, optical size, true italics) for everything: display at wght 400 with tight leading, body at 1.125rem/1.6, small text at 0.875rem. Italic carries emphasis. No sans anywhere.

**Layout.** A reading measure of 34rem left of centre, with a wide right margin used for photographs, marginal notes and the log. The horizontal training log breaks the measure and runs edge to edge. Justified left, ragged right.

```
+--------------------------------------------------------------+
| John Heymans                        Keynote  Story  Enquire  |
|                                                              |
| I built an algorithm to get to      +----------------------+ |
| the Olympics. Everyone with         | Check availability   | |
| experience told me not to run it.   | Event date  [      ] | |
|                                     | Your email  [      ] | |
| Olympic 5000m finalist. Keynote     | [Send enquiry]       | |
| for teams that need a different     +----------------------+ |
| edge.                               [▶ 60-second film]       |
+--------------------------------------------------------------+
```

**Principles.** The voice is the design. Restraint everywhere except the log, which is allowed to be long. Colour appears where the pen touched: his arm, the active log entry, the desk.

## Check against the brief

Where the first draft was something I would produce for any speaker, and what changed:

- **A's palette** started as near-black with one bright accent. That is a listed default. Changed to a light instrument panel with the Paris track lavender, which only John can claim.
- **B's accent** was first a red-orange; near-black plus vermilion is a listed default and reads as generic sport. Changed to Belgian yellow, which the singlet and the flag justify, and limited to two uses.
- **C** started as cream, serif and terracotta. Listed default, explicitly banned. Changed to a cool stone ground, no warm accent, cobalt as "ink". The serif stays because the concept is writing.
- **Eyebrows**: all three had tracked-out uppercase labels above headings. Removed. Labels are sentence case, tracking zero, and only appear where they encode a value (a stat, a date, a credit).
- **Section reveals**: the fallback was fade-and-slide-up per section. Replaced with per-concept devices: lane lines drawing (A), theme flips and a scrubbed marker reveal (B), saturate-on-centre and horizontal travel (C). Reduced motion gets the end state immediately in all three.
- **Numbered chapters**: kept, because the keynote genuinely is a five-part sequence.

## Shared quality floor

- Real copy throughout, first person, sentence case, no exclamation marks, no em-dashes.
- Booking modal and film modal in every hero; keyboard focus visible; Escape closes; focus returns.
- `prefers-reduced-motion` disables all scrubbed and autonomous motion via `gsap.matchMedia` and Framer's `useReducedMotion`.
- Photo credits shown with every image (Jelle Jansegers, Raf Thomas, Arthur Vermeylen, Belga Image, Ruben Redant).
- Copy lives in one dictionary (`lib/content.ts`) so Dutch and French can be added without touching layout.
- Root font size scales with viewport from 1440px to 1920px so the layout holds on large screens.

## Open items for John and Maarten

0. Testimonial portraits and organisation logos from `media/Testimonials` are in place. The source portraits are under 110px, so they are shown small; higher-resolution versions would allow a larger treatment.

1. The 60-second film is not in the repo. Both film modals show the poster frame and say the film is in final edit. Drop the MP4 into `public/media/promo.mp4` and it plays.
2. The Supernova recording is not in the repo. Concept B has a slot for it in the keynote section.
3. Testimonial pull-quotes are written from the substance described in `background.md`. They must be checked against the original texts before anything ships.
4. The world-ranking chart in A and the dated log entries in C use the known milestones only. Real ranking data and dates would make both stronger.
5. Client logos are set as wordmarks in type. Logo files are needed.

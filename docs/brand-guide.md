# John Heymans. Brand guide

Version 1.0, 22 September 2026. The live reference, with every element running
and downloadable, is at `/brand/fe331dc0ae83be5b`. Unlisted: anyone with the
link can open it, nothing links to it, and search engines are told to skip it.

This document is the same guide in writing. Where the two differ, the website
is right, because it is generated from the code the site actually runs.

---

## 1. What this brand is about

Two years from deciding to try, to the Olympic 5000m final. He got there on a
race schedule an algorithm he built chose for him, against the advice of his
federation, his coach and his competitors. It produced the fastest rise up the
world rankings in the history of his event.

It is a strategy and risk story that happens to take place on a running track.
Not an athlete telling a room to believe in itself.

Written on his arm at the Games: **Hey mom, made it.** The most ownable thing
in the brand. Use it where it has been earned, never as a tagline.

### Voice

Every word in the brand is his, in the first person. Short sentences. Specific
about the method: name the tool, name the risk, name who said no. The numbers
are extraordinary enough that they do not need adjectives.

**Never:** inspiring, unique energy, authenticity, captivated the audience,
powerful lessons, takes you on a journey. No exclamation marks. No third person
about himself. No em dashes. Sentence case everywhere, including buttons and
captions; the display type puts headlines into capitals, the copy underneath
never does.

---

## 2. Colour

Eight values, fixed. Everything else is one of them at an opacity.

| Name | Hex | RGB | Where it goes |
| --- | --- | --- | --- |
| Night | `#070613` | 7, 6, 19 | The ground the story runs on |
| Deep | `#151038` | 21, 16, 56 | Where the ground lifts: Iten upward |
| Violet | `#3a2c91` | 58, 44, 145 | Altitude, stadium light, the dim over photographs |
| Lavender | `#b9a8f5` | 185, 168, 245 | The machine voice: telemetry, chart guides, labels |
| Amber | `#ff7a2f` | 255, 122, 47 | The one accent |
| Paper | `#f3f1ea` | 243, 241, 234 | The sheet under the keynote details, and text on night |
| Ink | `#141019` | 20, 16, 25 | Text on paper, and text inside the amber pill |
| Amber deep | `#a8400d` | 168, 64, 13 | The accent on paper, where amber would not hold contrast |

**Amber is the only accent, and it is spent, not spread.** It marks the thing
that is happening: an action the viewer can take, a line being drawn, a word
being underlined, the one cell on the results board that is his. If two amber
things are on screen at once, one of them is wrong.

**Lavender is not a second accent.** It is the colour of anything the machine
says: readouts, axis labels, chart guides, the log. It never carries a message
from John.

### The grounds

The story never cuts between backgrounds, it crossfades between seven:

```
night     linear-gradient(180deg, #070613 0%, #0b0920 60%, #151038 100%)
altitude  linear-gradient(180deg, #151038 0%, #3a2c91 58%, #ff7a2f 135%)
signal    radial-gradient(120% 80% at 50% 110%, #3a2c91 0%, #151038 45%, #070613 100%)
low       linear-gradient(180deg, #070613 0%, #0e0a22 100%)
warm      linear-gradient(180deg, #151038 0%, #3a2c91 45%, #ff7a2f 150%)
stadium   radial-gradient(90% 60% at 50% 100%, #b9a8f5 0%, #3a2c91 38%, #070613 82%)
paper     #f3f1ea
```

In video, treat these as the grade: night for the opening, altitude as it
climbs, stadium for the final, paper for anything practical.

### Contrast

Paper on night is 17.8:1 and ink on paper is 16.6:1, which is where the
readability comes from. Amber on night is 7.7:1, and ink on amber is 7.2:1, so
the accent works as type on the dark ground and as a fill behind dark type. On
paper, amber falls to 2.3:1, which is why amber deep (5.5:1) exists. Lavender on
night is 9.6:1. Nothing below 4.5:1 carries information.

**Download:** `palette.css`, `palette.json`, `john-heymans.ase` (Adobe swatches
for Premiere, After Effects, Illustrator and Photoshop).

---

## 3. Typography

Two faces and one monospace. All three are open licence (SIL OFL 1.1) and can
be installed and shipped freely.

| Role | Face | Setting |
| --- | --- | --- |
| Display | Big Shoulders | Optical size 72, weight 600 to 800, capitals |
| Reading | Instrument Sans | Width 96, weight 400 to 600, sentence case |
| Readouts | Geist Mono | Weight 400 to 600, capitals, tracking 0.04em to 0.08em |

**Big Shoulders is signage type.** It is drawn to be read at distance in a
narrow column, and it is the reason the page can shout without getting loud.
Always at optical size 72, always in capitals, tracking −0.002em, line height
0.86 to 0.96 depending on size. Never for anything longer than a sentence.

**Instrument Sans carries everything a person actually reads,** at width 96 so
it sits under the display face without arguing with it. Tracking −0.004em.

**Geist Mono is the machine.** Telemetry lines, chart labels, the algorithm's
own output, the scramble. In lavender, in capitals, letter-spaced. It never
speaks for John.

### The scale

Sizes are given at a 1728px design width, which is the size the site is drawn
at. Everything scales with the viewport between 992px and 1920px.

| Role | Size | Line height | Weight |
| --- | --- | --- | --- |
| Opener card | 197px | 0.86 | 800 |
| Chapter title | 107px | 0.92 | 700 |
| Record line | 67px | 0.96 | 700 |
| Lesson card | 94px | 0.93 | 700 |
| Hero line | 81px | 0.92 | 700 |
| Section heading | 90px | 0.92 | 700 |
| Figure | 143px | 0.82 | 700 |
| Story sentence | 38px | 1.16 | 500 (Instrument Sans) |
| Body | 20px | 1.5 | 400 (Instrument Sans) |
| Readout | 13px | 1.6 | 600 (Geist Mono) |

### The rule that matters most

**Line breaks are decided, not left to the browser.** Headlines are set to a
measure in characters (title cards 20ch, record lines 24ch, lesson cards 13ch)
and where a break reads badly it is written into the copy with a vertical bar:

```
"That's the story.|Here's what your team takes from it."
```

No `text-wrap: balance` on anything that animates, because the reveal splits
the text into lines and balance would regroup the words when it unsplits them.
The same applies in video: type is set once and does not re-wrap on screen.

**Download:** the variable fonts, static instances cut at the exact settings
the brand uses (`Big Shoulders Display Bold` and `ExtraBold`,
`Instrument Sans Narrow Regular`, `Medium`, `SemiBold`), and the licences. The
static instances are the ones to install for Premiere and After Effects, which
handle variable axes unevenly.

---

## 4. The wordmark

The wordmark is the name, set in Big Shoulders Display Bold, in capitals, at
−0.002em. There is no logo, no monogram and no symbol, and there should not be
one: the name in this face at this size is the mark.

- **Clear space:** half the cap height on every side. Nothing enters it.
- **Minimum size:** 90px wide on screen, 18mm in print. Below that the counters
  close up.
- **Colour:** paper on night, ink on paper, amber only when it is the single
  element in the frame.
- **Never:** stretch it, re-space it, add a strapline inside the clear space,
  set it in another face, outline it, put it on a photograph without a scrim.

**Download:** SVG with outlines (no font needed) in paper, ink and amber, plus
2000px transparent PNGs.

---

## 5. Motion

Motion is the brand's largest asset and the hardest to get right. Three rules
hold it together.

**1. The scroll is the timeline.** Nothing in the story plays on its own clock.
Every beat is a paused timeline scrubbed by the scroll position, so the viewer
sets the pace and can stop anywhere. Anything tied to the scroll is linear,
never eased: the hand is the ease.

**2. Things arrive, they do not appear.** Every element enters with one of six
reveals and leaves with one of three exits. Nothing fades in place.

**3. One thing moves at a time.** If the type is arriving, the photograph is
still. If the chart is drawing, the copy has already landed.

### Easing

| Name | CSS | GSAP | Use |
| --- | --- | --- | --- |
| Out | `cubic-bezier(0.215, 0.61, 0.355, 1)` | `power3.out` | Anything arriving. The default |
| In | `cubic-bezier(0.55, 0.085, 0.68, 0.53)` | `power2.in` | Anything leaving |
| In-out | `cubic-bezier(0.65, 0, 0.35, 1)` | `power3.inOut` | One gesture that moves and settles |
| Linear | `linear` | `none` | Anything scrubbed by the scroll |

### The six reveals

| Reveal | What it does | Duration | Stagger |
| --- | --- | --- | --- |
| **Rise** | Lines rise from behind a mask | 0.6s | 0.07s per line |
| **Words** | Words arrive one at a time from 112% and 10px of blur | 0.55s | 0.11s per word |
| **Ink** | The line is written left to right with an amber nib | 1.1s | 0.1s per line |
| **Type** | Characters appended into the chat | 38 to 72ms per character, 0.22s after a comma | |
| **Flash** | In from 24px right with a one-frame paper border | 0.35s | |
| **Scribble** | Strokes drawn like a marker | 1.6s per phrase | |

Exits: **rise** (up 8px, fade, 0.25s), **blur** (up 24px, to 90%, 4px blur,
0.3s), **cut**.

### In video

- Match the easing. A linear fade in a cut where the site would use `power3.out`
  reads as a different brand.
- Title cards use **words**: each word arrives from slightly large and out of
  focus, 0.11s apart. This is the single most recognisable move in the brand.
- Key lines use **ink**: a left-to-right wipe with an amber leading edge, 1.1s.
- Lines, rules and underlines are always **drawn**, never faded, and always in
  amber, left to right, 0.4s to 1.4s depending on length.
- Nothing bounces, nothing overshoots, nothing spins.

### Grain

A 256px tile at 3.5% opacity (5% on the darkest ground), jumping through six
positions every 0.72s. It sits over everything except the paper ground. In
video, add it as an overlay at the same strength, animated at the same rate.
Not a film-burn, not scratches, not vignette.

**Download:** the grain tile and `motion-tokens.json`, which holds every value
above in a form you can read in code.

---

## 6. Video

### Formats

| Use | Frame | Sound | Notes |
| --- | --- | --- | --- |
| Hero loop | 1920 wide, 16:9 | None | Must work muted and looped. No burned-in titles |
| Portrait loop | 720 × 1280 | None | Phone hero |
| The film | 1920 wide, 16:9 | Yes | Plays in a dialog, with captions |
| Audience clips | 1280 tall, 9:16 | Yes | Subtitles required, audience speaks Dutch |
| Reel | 9:16 | Yes, muted by default | The about section |

### Safe area

The site's margin is 3.7% of the width, so a 1920 frame gets **72px** on every
side and nothing important sits outside it. Type sits **bottom left** in the
hero and **centred** in title cards, matching the site.

### Scrim

Type over footage always gets the scrim, never a flat black box:

```
linear-gradient(to top,
  rgba(7, 6, 19, 0.85) 0%,
  rgba(7, 6, 19, 0.35) 45%,
  rgba(7, 6, 19, 0) 100%)
```

Where a photograph needs to sit back behind copy, the site multiplies violet
over it at 50% rather than dimming to black. Colour, not grey.

### Encoding

The site self-hosts everything, AV1 in WebM first and H.264 in MP4 as the
fallback:

```bash
# muted hero loop
ffmpeg -i in.mov -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an out.mp4
ffmpeg -i in.mov -vf scale=1920:-2 -c:v libsvtav1 -crf 38 -preset 6 \
  -pix_fmt yuv420p10le -an out.webm

# the film, with sound
ffmpeg -i in.mov -vf scale=1920:-2 -c:v libx264 -crf 24 -preset slow \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart film.mp4

# an audience clip
ffmpeg -i in.mov -vf scale=-2:1280 -c:v libx264 -crf 24 -preset slow \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart clip.mp4
```

Budgets: desktop loop under 4 MB, phone loop under 2.5 MB. `scripts/encode-video.sh`
in the repository runs all of these.

### Captions

WebVTT, alongside the file, named `<file>.en.vtt`. Dutch runs 15 to 20 percent
longer than English, so never time a caption to the frame it sits on.

**Download:** title card templates for 16:9 and 9:16 and a lower third, as SVG
with live text and PNG previews.

---

## 7. Photography

- Full colour, always. The brand was explicitly built away from black and white.
- Photographs are dimmed with violet at 50% multiply, never desaturated to grey.
- Grain sits over them at the same strength as everywhere else.
- **Every photograph carries its photographer, wherever it appears.** Jelle
  Jansegers, Raf Thomas, Arthur Vermeylen, Belga Image and others. This is a
  licence condition, not a courtesy. The only exception is the one image marked
  copyright free in `lib/photos.json`.
- Belga Image files may only come from the commercial licence folder.

---

## 8. Downloads

Everything below is on the live guide page, and in `public/brand/` in the
repository. **All of it in one file:** `john-heymans-brand-kit.zip`, 719 KB,
linked at the top of the downloads section on the guide page.

```
fonts/     BigShoulders[opsz,wght].ttf          variable, the original
           BigShouldersDisplay-Bold.ttf         static, opsz 72 / wght 700
           BigShouldersDisplay-ExtraBold.ttf    static, opsz 72 / wght 800
           InstrumentSans[wdth,wght].ttf        variable, the original
           InstrumentSansNarrow-Regular.ttf     static, wdth 96 / wght 400
           InstrumentSansNarrow-Medium.ttf      static, wdth 96 / wght 500
           InstrumentSansNarrow-SemiBold.ttf    static, wdth 96 / wght 600
           GeistMono[wght].ttf                  variable, the original
           *-OFL.txt                            the licences, ship them with the fonts
wordmark/  wordmark-paper.svg  wordmark-ink.svg  wordmark-amber.svg   outlined, no font needed
           wordmark-paper.png  wordmark-ink.png                       2000px, transparent
palette/   palette.css  palette.json  john-heymans.ase
templates/ title-16x9.svg  title-9x16.svg  lower-third-16x9.svg       live text
           and a PNG preview of each
texture/   grain.png
motion/    motion-tokens.json
```

---

## 9. Where the brand lives

| | |
| --- | --- |
| The site | `johnheymans.com` |
| This guide | `/brand/fe331dc0ae83be5b`, unlisted |
| Instagram | [@heymans.john](https://www.instagram.com/heymans.john/) |
| LinkedIn | [John Heymans](https://www.linkedin.com/in/john-heymans-308aa7154/) |
| Enquiries | hello@johnheymans.com |

Earlier design rounds, including the two typefaces that were not chosen, are
kept at `/archive`.

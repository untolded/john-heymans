# Build brief: the John Heymans story site

Written for Claude Code, to build from. Date: 21 September 2026.

This brief turns Maarten's twelve-part storyline into a buildable specification. It is based on the teardowns in `library.md` (Part 2, sections 4 to 10), on John's own feedback, and on the rules in `CLAUDE.md`. The assets it depends on are listed in `docs/asset-brief.md`, with IDs (`F1`, `K2`, `A4`, and so on) that this brief refers to.

**Do not start by writing code.** Read the whole brief first, then the files in section 0.2, then build in the order of section 17.

---

## 0. Before you start

### 0.1 What you are building

A single scrolling page that works like a short film, then turns into a clear, calm place to book John. The film half tells how John went from deciding to try to the Olympic 5000m final in two years, with an algorithm at the centre. The practical half tells an event buyer what they get, who else booked him, and how to enquire.

Route during review: **`/story`**. Build it so that promoting it to `/` at launch is a one-line change (the page component only imports from `components/story` and `lib/story`). Leave `/signal` and `/concept-a`, `/concept-b`, `/concept-c` untouched; they are the history of this project.

### 0.2 Read these first, in this order

1. `CLAUDE.md`: tone of voice, banned words, design non-negotiables, the no-em-dash rule.
2. `AGENTS.md`: this is Next.js 16.3.5. Read the relevant guides in `node_modules/next/dist/docs/` before writing any Next code. Do not rely on memory of older Next versions.
3. `background.md`: the facts. Nothing on the site may go beyond it or beyond the confirmed data files.
4. `library.md` Part 2, sections 4 to 10: the reference sites and the patterns this brief borrows. Section numbers are cited throughout as `[L4.4]` and so on.
5. `docs/asset-brief.md`: what exists, what is coming, and the fallbacks when it is not there yet.
6. The existing code you will reuse: `lib/content.ts`, `lib/photos.ts` and `lib/photos.json`, `lib/gsap.ts`, `components/shared/Modal.tsx`, `components/shared/Social.tsx`, `components/shared/ScrollManager.tsx`, `components/signal/Room.tsx` (the clip wall), `public/videos/`, `public/logos/`.

### 0.3 Rules that override everything else

- **Never invent a fact, number, quote or headline.** Every number shown on the site comes from a data file with `status: "confirmed"`. If a value is `pending`, the component renders without it (section 3.3). This covers ranking positions, race names, dates, the number of meets scored, the doubters' exact words, news headlines and the Olympic result.
- **No em dashes anywhere**, in copy, in `alt` text, in comments that ship, in data files.
- **First person** in all body copy. Sentence case in source strings; capitals only through CSS `text-transform`.
- **No exclamation marks.** No banned words from `CLAUDE.md`.
- **Only licensed photos.** Belga images only from the six cleared files. Every photo on screen shows its credit (section 7.11).
- **No black-and-white treatment** of any photo or video. John rejected it. Dimming is done with a violet multiply, never desaturation.
- **Every string lives in `lib/content.ts`** (new `story` namespace). No copy in components. Dutch runs 15 to 20 percent longer; no layout may depend on string length. Do not build a language switcher.

### 0.4 John's test, in his words and ours

From his round 3 review (see memory and `docs/round4-plan.md`): would someone paying a premium fee be impressed on sight; it must feel like a big story, not a website; half the text; readable; no top menu; no black and white; the AI must be visible; the five business lessons must be explicit, one per chapter; the bio is secondary; the film opens the site.

Every decision below is checked against that list.

---

## 1. The concept: the line

**One idea carries the whole story: a single amber line.** It is the start line, the flight path to Kenya, the altitude John climbed, the caret in the ChatGPT box, the path through the season that the algorithm chose, the ranking curve that climbed, the divider between pressure and enjoyment, and finally the ink of "Hey mom, made it" written on his arms.

Every transition between beats is a match cut carried by that line: the line from one scene becomes the line of the next. The visitor follows it the way United Carriers makes you follow a container `[L6.1]`, and it gives a long scroll a direction.

From the algorithm chapter onwards the line is joined by **one number: John's world ranking**, shown in a small persistent readout in the frame. It is born when the algorithm defines its objective, moves with the climb, dips with the setbacks, crosses the Olympic quota, and ends as "Olympic final". This is the object you follow `[L10.1]`.

**Where the boldness is spent.** One place: the algorithm sequence (ChatGPT prompt, the burst into data, the chosen season, the climb). That is the centre of John's story (`background.md` part 2) and the thing no other speaker can show. Everything else is disciplined: photographs, type, and the line.

| Tier | Beats | Motion budget |
|---|---|---|
| Set piece | The algorithm (beats 5 and 6) | Full: UI recreation, typing, scramble, data grid, chart |
| Supporting | Iten (beat 3), the final (beat 9) | A drawn path, a counter, handwriting |
| Quiet | Opener, edge, setbacks, village, handover | Type, one photo, the line |

---

## 2. Design plan

`CLAUDE.md` asks for a plan and a check before anything visual. This is it.

### 2.1 Colour tokens

Carried over from round 5, which followed John's rejection of black and white. Two colours have jobs: **lavender is the algorithm, amber is the human decision.** Colour carries plot the way USAvionix uses yellow, red and cyan `[L4.5]`.

```css
--night:      #070613;  /* ground of the story, near-black with violet in it */
--deep:       #151038;  /* panels, second stop of every gradient */
--violet:     #3A2C91;  /* glows, the dimming multiply over photos */
--lavender:   #B9A8F5;  /* the algorithm: data, grid, ranking curve, telemetry */
--amber:      #FF7A2F;  /* the line, the one action colour, the decisive moment */
--paper:      #F3F1EA;  /* all text on dark; the ground of the practical part */
--ink:        #141019;  /* text on paper */
--amber-deep: #A8400D;  /* amber for text and links on paper (amber itself fails there) */
```

Measured contrast: paper on night 17.8:1, paper on deep 16.0:1, lavender on night 9.6:1, amber on night 7.7:1, night on amber 7.7:1, ink on paper 16.6:1, ink on amber 7.2:1, amber-deep on paper 5.5:1. **Amber on paper is 2.3:1 and must never be used for text**; use `--amber-deep`, or amber as a fill with ink text.

Secondary text is paper at 72 percent opacity (about 11:1 on night), never lower.

### 2.2 Ground themes

The ground is one fixed element with stacked gradient layers whose opacity is driven by CSS variables, crossfaded in dedicated scroll spans between beats. This is Seasats' mechanism `[L5.4]`, and it is what makes the page feel like one continuous space instead of stacked sections.

| Theme | Used in | Starting gradient (tune visually) |
|---|---|---|
| `night` | hero edges, opener, edge | `linear-gradient(180deg, #070613 0%, #0B0920 60%, #151038 100%)` |
| `altitude` | Iten | `linear-gradient(180deg, #151038 0%, #3A2C91 58%, #FF7A2F 135%)`, a dawn glow at the horizon |
| `signal` | the algorithm, the doubters | `radial-gradient(120% 80% at 50% 110%, #3A2C91 0%, #151038 45%, #070613 100%)` |
| `low` | setbacks | `linear-gradient(180deg, #070613 0%, #0E0A22 100%)` plus 4 percent grain |
| `warm` | village | `linear-gradient(180deg, #151038 0%, #3A2C91 45%, #FF7A2F 150%)` |
| `stadium` | the final | `radial-gradient(90% 60% at 50% 100%, #B9A8F5 0%, #3A2C91 38%, #070613 82%)`, the lavender of the Paris track |
| `paper` | practical part, bio, footer | `#F3F1EA` flat |

### 2.3 Typefaces and roles

| Role | Face | Setting |
|---|---|---|
| Display | **Archivo** variable (Google Fonts, OFL), `wght` 700 to 850, `wdth` 75 to 90 | Uppercase for title cards only, `line-height` 0.88 to 0.95, tracking -0.01em to -0.02em. Never below 28px. |
| Body | **Geist** (already in the project) | 20px desktop, 18px mobile, `line-height` 1.5, measure 34rem, weight 400 to 500 |
| The algorithm's voice | **Geist Mono** | Only for telemetry, the data burst, the calendar and the ranking axis. Uppercase, +0.04em tracking, 12 to 14px. |
| Handwriting | **Traced from the real writing on his arms** in the licensed Belga photo `final-arms`, as SVG paths | Only for "HEY MOM" and "MADE IT", in the block capitals he actually wrote. A higher-resolution close-up (`O1`) improves the trace but is not required. Permanent Marker is not needed any more. |

Readability rule from John: body copy never sits directly on a busy image. It sits on the ground, or on a scrim that takes the area behind the text to at least 70 percent `--night`.

### 2.4 Layout concept: a fixed frame

USAvionix's lesson `[L4.5]`: a frame that never moves, with content changing inside it. The eye learns where to look in two scenes and reading costs almost nothing. The frame, at the 1728px design width:

```
┌───────────────────────────────────────────────────────────────────────┐
│ JOHN HEYMANS          ─ ─ ITEN ─ ─ ─ ─ ─ ─          ◎ in  [Check availability] │  top row
│                                                                          │
│                                                                          │
│                        (centre slot: title cards,                        │
│                         lesson cards, set pieces)                        │
│                                                                          │
│                                                                          │
│ Headline, two lines max                                     RANKING  64  │
│ One or two sentences of story.                          TELEMETRY LINE 1 │
│ Photo: Jelle Jansegers          Skip the story ↓        TELEMETRY LINE 2 │  bottom row
├───────────────────────────────────────────────────────────────────────┤
  progress hairline (lavender, full width, 2px)
```

(The arrow in the sketch is the icon slot of the skip button; the label never contains an arrow character.)

Slots: `wordmark` top left; `chapter` top centre; `social` and `cta` top right; `centre` for title and lesson cards and set pieces; `copy` bottom left; `credit` under the copy; `skip` bottom centre; `chip` (ranking) and `telemetry` bottom right; `progress` along the bottom edge.

Page padding 4rem desktop, 1.25rem mobile. Everything in `rem` with the fluid root size of section 7.1.

### 2.5 Principles specific to John

1. **Show the method, not the medal.** The screen time goes to the algorithm and the decision, not to the podium.
2. **One line, one number.** The amber line is the path; the ranking is the object. Nothing else is persistent.
3. **Scrub the world, swap the words.** Images, the line, charts and colour follow the scroll exactly. Text never fades with the scroll; it arrives as a discrete event and stays fully legible `[L8, pattern 2]`.
4. **Real data or nothing.** The data layer is the identity, so its numbers must be true.
5. **The practical part breaks the spell on purpose.** Paper ground, calm motion, facts. That contrast is the signal that the story is over and the buying starts.

### 2.6 Check against `CLAUDE.md`, and what changed

| Default the brief bans | This plan | Change made |
|---|---|---|
| Cream + high-contrast serif + terracotta | Night violet ground, grotesque display, amber | None needed. Paper only appears after the story, with ink and amber-deep, and no serif. |
| Near-black + one acid-green or vermilion accent | Near-black is violet-tinted; two accents with defined jobs; amber is not vermilion | Kept lavender as a second, functional colour so the page is not "black plus one accent". |
| Hairline rules and dense columns | Practical part uses a filmstrip, a scale and quotes | The audience sizes become a drawn scale (section 11.3) rather than a ruled table. |
| Identical rounded cards with the same shadow | No cards in the story; the chat window and notifications are recreations of real interfaces | The five lessons in the practical part are a filmstrip of frames from the story, not cards. |
| Tracked-out all-caps eyebrows | None. Chapter name sits in the frame, not above headings. Lesson numbers sit below lesson titles. | None needed. |
| Middle-dot meta strings | Place and date lines are separate lines or telemetry | None needed. |
| Monospace micro-labels | Mono is reserved for the algorithm's voice only | Written down as a rule, because the telemetry layer makes mono tempting elsewhere: buttons, captions, credits and chapter names stay Geist or Archivo. |
| Arrows appended to button text | Icons live in a separate slot; labels never contain arrow characters | None needed. |
| Fade-and-slide-up on every section | Six distinct reveals, each with one job (section 7.7) | Round 5 used the same rise on every copy block; replaced by the reveal map. |

What would make this "any speaker's website": a hero video with a quote over it, a grid of stats, logos, testimonials. The hero here is quiet on purpose, and the proof lives after the story, where it confirms rather than introduces.

---

## 3. Facts register and data files

### 3.1 Confirmed in `background.md`

Two years from decision to Olympic final; Olympic 5000m finalist; Iten, Kenya, 2,400 m; trained with the best African athletes; built an AI algorithm that chose competitions to maximise world ranking; against the advice of his federation, his coach and his fellow competitors; fastest rise up the world rankings in his sport's history; Olympic qualification; setbacks with controllables (sleep, nutrition, training) and uncontrollables (illness, weather, injury); two kinds of athlete in the village, he chose to enjoy it; "Hey mom, made it" written on his arm; keynote 30 minutes, optional Q&A, English, Dutch or French; about 15 keynotes by word of mouth; the four audience contexts; the named clients; the two testimonials.

### 3.2 In the repo but not yet confirmed by John

Treat as `pending` until Maarten marks them confirmed in the data files: the Games year and venue (Paris 2024, Stade de France) and the final's date (10 August 2024); the final placing (11th); the 5000m personal best (13:03.46); Brussels as departure point and "76 m" as its altitude; "212 meets scored"; the three doubters' lines in `lib/content.ts`; the exact ChatGPT prompt. Photo captions in `lib/photos.json` are treated as confirmed because they came with the licensed files.

### 3.3 Data files

Create `lib/story/data/` with one JSON file per dataset. Every value carries its status and source:

```ts
// lib/story/data/types.ts
export type Sourced<T> = {
  value: T;
  status: "confirmed" | "pending";
  source?: string;            // e.g. "World Athletics profile, screenshot 2024-06-30"
};
```

| File | Content | Filled from asset |
|---|---|---|
| `result.json` | Games, venue, date, final placing, time, personal best | `O3`, `B2` |
| `route.json` | Departure city and coordinates, stops, Iten coordinates and altitude, trip dates and duration | `K3` |
| `ranking.json` | Ranking history: `{ date, rank, points }[]`, the quota cut-off, the start and end of the qualifying window | `A4` |
| `races.json` | Candidate meets `{ id, name, city, country, date, category }[]`, the chosen subset in order, results `{ place, time, points }` | `A3` |
| `algorithm.json` | Meets evaluated (count), inputs, the objective in John's words, the real prompt | `A1`, `A2` |
| `doubters.json` | Three messages `{ role, text }` approved by John | `D1` |
| `headlines.json` | Real headlines `{ outlet, date, headline, language, url }` | `D2`, `A5` |
| `setbacks.json` | Two to four events `{ date, kind, line }` | `S1` |
| `qualification.json` | Date, how, quota position | `S4` |
| `controllables.json` | Optional real readouts for sleep, nutrition, training | `S3` |

**The rendering rule.** A helper `show(s: Sourced<T>)` returns the value only if `status === "confirmed"`. In development, pending values render with a visible dashed amber outline and the word PENDING so Maarten can see the gaps. In production builds they render as absent and the surrounding component adapts (a chart without axis numbers, a chip without a number, a telemetry line skipped). Add a build-time check (`scripts/check-pending.mjs`, run in `prebuild`) that prints every pending value and fails the production build when `STRICT_FACTS=1` is set.

Until real data arrives, `ranking.json` and `races.json` may hold **shape-only placeholders** (`status: "pending"`, flagged `placeholder: true`) so the charts can be built. Their numbers must never render in production.

---

## 4. The storyline, beat by beat (overview)

Maarten's twelve parts map to one hero, nine story beats, and three normal sections.

| # | Part | Beat id | Scroll (desktop / mobile) | Ground | Lesson card |
|---|---|---|---|---|---|
| 1 | Hero with the promo film | `hero` (normal section, 100svh) | 100svh | film | |
| 2 | "They all said it couldn't be done" | `opener` | 140vh / 110vh | night | |
| 3 | Iten, Kenya, 2,400 m | `iten` | 300vh / 240vh | altitude | 1 of 5 |
| 4 | "I needed an edge" | `edge` | 100vh / 80vh | night | |
| 5 | ChatGPT and the algorithm | `algorithm` | 320vh / 260vh | signal | |
| 6 | The doubters, then the record rise | `doubt` | 240vh / 200vh | signal | 2 of 5 |
| 7 | Setbacks, controllables, qualified | `setback` | 220vh / 180vh | low | 3 of 5 |
| 8 | The Olympic village | `village` | 180vh / 150vh | warm | 4 of 5 |
| 9 | The final, "Hey mom, made it", "Dare to dream big" | `final` | 300vh / 240vh | stadium | 5 of 5 |
| 10 | Handover to the practical part | `handover` | 100vh / 80vh | stadium to paper | |
| 10 | Practical part | normal sections | natural height | paper | |
| 11 | Biography | normal section | natural | paper | |
| 12 | Footer | normal section | natural | paper | |

Story length is about 19 screens on desktop. Every length lives in one config (`lib/story/beats.ts`) and will be tuned after the first review; research puts the readable range at about two screens per idea `[L10.4]`. A "Skip the story" control is always available during the story.

**The five lessons, one per chapter, made explicit.** John requires this. The lessons follow the five parts of the keynote in `background.md`:

| Card | Chapter | Lesson title | Line under it |
|---|---|---|---|
| 1 of 5 | Iten | Your environment sets your ceiling. | And consistency beats hard work. |
| 2 of 5 | Algorithm and doubters | The edge is where the consensus isn't. | Don't be afraid to challenge the status quo. |
| 3 of 5 | Setbacks | Focus on what you can control. | And stop overthinking what you can't. |
| 4 of 5 | Village | Embrace the pressure. | It comes with the moments that matter. |
| 5 of 5 | Final | Dare to dream big. | Your dreams set your ceiling. |

`lib/content.ts` currently lists takeaways that drop "embrace the pressure" and split Kenya into two. Replace that list in the new `story` namespace with these five so the story and the practical part say the same thing.

---

## 5. Architecture

### 5.1 Overview

Four layers, borrowed from USAvionix's structure `[L4.4]` and implemented with GSAP, which the project already uses.

```
Scroll (Lenis on desktop, native on touch)
   │
   ▼
Driver ──► story store: per beat { progress, show, hide, active }, plus activeBeat, storyProgress
   │                         │
   │         ┌───────────────┼───────────────────────┬─────────────────────┐
   ▼         ▼               ▼                       ▼                     ▼
Beat timelines         Copy overlay            Telemetry             Frame UI
(paused GSAP,          (script entries keyed   (log lines keyed      (chapter name,
 .progress(p) set      to beat progress;       to beat progress)     progress hairline,
 every frame)          one block per slot,                           ranking chip, credit)
 media, line, charts   discrete reveals)
   │
   ▼
Ground (stacked gradients, CSS variables crossfaded in their own spans)
```

Nothing except the driver reads `scrollY`. Everything else reads the store.

### 5.2 Dependencies

Already installed: `next` 16.3.5, `react` 19.2.8, `gsap` 3.15 (ScrollTrigger, SplitText, DrawSVG, MotionPath, ScrambleText are registered in `lib/gsap.ts`), `@gsap/react`, `sharp`, `tailwindcss` 4.

Add:
- `lenis` (smooth scroll on desktop, via `lenis/react`)
- `d3-geo` and `topojson-client` (the flight globe, 2D canvas)
- `world-atlas` as a dev dependency (land shapes, public domain, used only at build time)

Do not add Three.js, a state library, or a second animation engine. New story code uses GSAP only. `components/shared/Modal.tsx` uses `framer-motion` and may be reused as it is.

### 5.3 File structure

```
app/story/
  page.tsx                 server component: static markup of the whole page, metadata
  layout.tsx               fonts (next/font), root class, story.css
  story.css                tokens, frame, ground, static layout, cinema overrides
lib/story/
  beats.ts                 beat order, lengths, ground theme, chapter name, lesson index
  script.ts                every copy entry: slot, beat window, reveal (section 7.6)
  telemetry.ts             every telemetry line: beat, at, text or data reference
  store.ts                 the story store (section 5.4)
  modes.ts                 cinema-desktop / cinema-touch / static detection
  reveals.ts               the reveal primitives (section 7.7)
  media.ts                 load queue, preloading by beat
  audio.ts                 sound manager (section 7.10)
  data/                    the JSON files of section 3.3, plus types.ts and show()
components/story/
  StoryPage.tsx            client root: decides the mode, mounts driver, stage, overlay
  Driver.tsx               spacers and the scroll-to-store function
  Stage.tsx                the sticky 100svh stage and its layers
  Ground.tsx               theme layers
  Frame.tsx                wordmark, chapter, social, CTA, skip, progress, chip, credit
  CopyOverlay.tsx          slots and entry swapping
  Telemetry.tsx
  RankingChip.tsx
  Line.tsx                 the amber line helpers (SVG and canvas)
  media/HeroFilm.tsx, FilmModal.tsx, VideoLayer.tsx, PhotoLayer.tsx, FrameSequence.tsx
  beats/Opener.tsx, Iten.tsx, Edge.tsx, Algorithm.tsx, Doubt.tsx, Setback.tsx,
        Village.tsx, Final.tsx, Handover.tsx
  set-pieces/Globe.tsx, AltitudeProfile.tsx, ChatWindow.tsx, DataBurst.tsx,
             SeasonGrid.tsx, RankingChart.tsx, Notifications.tsx, Headlines.tsx,
             Handwriting.tsx
  practical/Keynote.tsx, Lessons.tsx, AudienceScale.tsx, Proof.tsx, ClipWall.tsx,
            Recording.tsx
  Bio.tsx, Footer.tsx, Enquiry.tsx, ScrollPace.tsx
scripts/
  encode-video.sh, export-frames.mjs, build-globe-points.mjs, check-pending.mjs
```

### 5.4 The story store

A small store with two kinds of subscribers: React components that change rarely (chapter name, active copy entry), and imperative per-frame callbacks (timelines, canvases) that must not trigger React renders.

```ts
// lib/story/store.ts  (shape, not final code)
export type BeatId = "opener" | "iten" | "edge" | "algorithm" | "doubt"
                   | "setback" | "village" | "final" | "handover";
export type BeatState = { progress: number; show: number; hide: number; active: boolean };

type State = { beats: Record<BeatId, BeatState>; active: BeatId | null; story: number };

let state: State = /* all zeros */;
const reactListeners = new Set<() => void>();
const frameListeners = new Map<BeatId, Set<(b: BeatState) => void>>();

export const story = {
  get: () => state,
  update(id: BeatId, next: BeatState) {
    const prev = state.beats[id];
    if (same(prev, next)) return;                    // only notify on change
    state = { ...state, beats: { ...state.beats, [id]: next } };
    frameListeners.get(id)?.forEach((fn) => fn(next));
    if (prev.active !== next.active) { state = { ...state, active: pickActive(state) }; emitReact(); }
  },
  onBeat(id: BeatId, fn: (b: BeatState) => void) { /* add, call once with current, return unsubscribe */ },
  subscribe(fn: () => void) { /* for useSyncExternalStore */ },
};
export const useStory = <T,>(select: (s: State) => T) =>
  useSyncExternalStore(story.subscribe, () => select(story.get()), () => select(initial));
```

Copy entries change on thresholds, so `CopyOverlay` also subscribes imperatively and only calls `setState` when the resolved entry for a slot changes.

### 5.5 The driver

The story track is a tall element holding the sticky stage and, behind it, one spacer per beat whose height is the beat length. The driver measures the spacers and computes four numbers per beat on every scroll event, exactly as USAvionix does `[L4.4, layer 1]`:

```ts
// per scroll event (Lenis "scroll" on desktop, a passive scroll listener on touch)
for (const { id, start, height, end } of measured) {
  const showStart = id === FIRST ? start - vh : start;
  const progress = clamp((y - start) / height, 0, 1);
  const show     = clamp((y - showStart) / vh, 0, 1);   // entering, over one viewport
  const hide     = clamp((y - end) / vh, 0, 1);         // leaving, over one viewport
  story.update(id, { progress, show, hide, active: show > 0 && hide < 1 });
}
```

Re-measure on `ScrollTrigger.refresh` and on `ResizeObserver` of the track, after `document.fonts.ready`, and after the hero film's metadata loads. Beat transitions overlap: a beat's `show` runs during the last viewport of the previous beat, so every change of scene is a crossfade or match cut, never a gap.

### 5.6 Beat timelines

Each beat component builds **one paused GSAP timeline of duration 1** in `useGSAP`, and subscribes with `story.onBeat(id, (b) => tl.progress(b.progress))`. Entry and exit (dissolves, match cuts) are driven from `show` and `hide` in the same callback. No beat creates its own ScrollTrigger. That keeps the scroll logic in one place and makes every beat testable by setting its progress directly (section 17.3).

Positions inside a timeline are written in beat progress (0 to 1), so the per-beat tables in section 8 translate directly into code.

### 5.7 Modes

Decided once on mount, re-evaluated on `matchMedia` change:

| Mode | When | Behaviour |
|---|---|---|
| `cinema-desktop` | fine pointer, width ≥ 992px, motion allowed | Lenis (`lerp: 0.1`, `autoRaf: false`, ticked from `gsap.ticker`, `lagSmoothing(0)`), full stage, all set pieces |
| `cinema-touch` | coarse pointer or width < 992px, motion allowed | Native scroll (no Lenis), `ScrollTrigger.config({ ignoreMobileResize: true })`, `100svh` stage, portrait assets, shorter beats, simplified set pieces (section 9) |
| `static` | `prefers-reduced-motion: reduce`, or JavaScript unavailable | The server-rendered stacked layout, every end state visible, no autoplay, no smooth scroll (section 12.3) |

**The server renders the static layout.** Client code adds `is-cinema` to the root only after the mode is decided and the first beat is ready. That is how round 5 works and it must stay that way: every element a timeline reveals must also be visible in the static layout, or it will be invisible for reduced-motion users and on slow connections.

---

## 6. The hero (part 1)

**Purpose.** Open on the film, land the hook, invite the scroll. Nothing else.

**Layers.**
1. `HeroFilm`: the clean loop `F2` (desktop) or `F3` (portrait phones), `autoplay muted loop playsInline`, `preload="metadata"`, poster `F5` preloaded as the LCP image. Fallback when `F2` does not exist yet: the full film `F1`, muted, with the quiet cues below. Fallback before `F1` exists: `public/media/hero.mp4` (the round 5 stand-in).
2. A scrim only in the bottom 32 percent: `linear-gradient(to top, rgba(7,6,19,.72), transparent)`. No full-screen darkening; the film stays bright.
3. Copy, bottom left, inside the safe zone of section 6.1.
4. The frame (section 7.3) in its hero state: wordmark, social icons, `Check availability`. No chapter name, no progress, no chip.

**Copy** (`content.story.hero`):
- Line (Archivo 800, uppercase, 4.5rem desktop, 2.4rem mobile): "Two years. One algorithm. The Olympic final."
- Sub (Geist 20px, paper 85 percent): "A 30-minute keynote on strategy, risk and finding the edge."
- Primary action: `Watch the film with sound` (amber pill, play icon in its own slot). Opens `FilmModal` with `F1`, sound on, captions `F4` on by default.
- Scroll cue, bottom centre: the words "Scroll to begin" above a 48px amber line that draws downward on a two-second loop (the line's first appearance). Clicking it scrolls to the opener.

This satisfies the `CLAUDE.md` requirement that both the film and the booking enquiry live in the hero. **The stated choice: the film is primary.** The enquiry is present but secondary, as the persistent `Check availability` pill in the frame, which opens the enquiry (section 13).

### 6.1 Avoiding the film's own text

Maarten's note: the film contains burned-in text. Two protections:

1. **Safe zone.** Our copy occupies only the bottom-left 40 percent width and bottom 30 percent height. Ask the editor for the positions of the film's text (`F6`) and confirm they do not use that zone.
2. **Quiet cues.** `content.story.hero.quietCues` holds `{ start, end }` second ranges when the film shows its own text. `HeroFilm` listens to `timeupdate` and fades our line and sub to 0 over 300ms during those ranges, back to 1 after. The action button and scroll cue stay. With the clean loop `F2` this list is empty.

### 6.2 Entrance

No blocking loader. The poster is visible immediately. When the video can play, it fades over the poster in 400ms. The line then reveals with the `rise` primitive, lines staggered 0.08s, starting 600ms after first paint; the sub and button follow at +0.25s; the scroll cue last. Total under 1.6s, and none of it delays the film.

### 6.3 Sound

The film loop never plays sound. `Watch the film with sound` is the only path to sound in the hero. The frame's sound toggle (section 7.10) controls story ambience, not the hero loop.

### 6.4 Leaving the hero

The hero is a normal section. As it scrolls away, the film's opacity follows `1 - show(opener)` and it pauses when fully hidden. The opener's first word arrives while the last frames of the film are still fading, so there is no black gap.

---

## 7. Shared systems

### 7.1 Fluid root size

From Lando Norris `[L1.3]` and United Carriers `[L6.2]`: the root font size scales with the viewport against a 1728px design width, so the whole composition scales like a zoomed design file between 992px and 1920px.

```css
html { font-size: calc(clamp(992px, 100vw, 1920px) / 1728 * 16); }
@media (max-width: 991px) { html { font-size: 16px; } }
```

All sizes in `rem`. Body text has a floor: `font-size: max(1.25rem, 18px)`.

### 7.2 The ground

`Ground.tsx` renders one fixed element (`position: fixed; inset: 0; z-index: -1; pointer-events: none`) with one absolutely positioned layer per theme. Each layer's opacity is `var(--o-<theme>, 0)`. A `ThemeSwitch` span sits between beats in the driver config (`{ from: "night", to: "altitude", at: ["iten", 0], length: 0.35 }`), and the driver crossfades the two variables over that span with `sine.inOut`, the new one from 0 to 1 over the first 75 percent and the old one from 1 to 0 over the last 75 percent, as in Seasats `[L5.4]`. The active theme also sets `data-ground` on the root, which the frame uses to invert (night text on paper).

A grain layer sits above the ground: a 256px tiled noise PNG at 3 to 4 percent opacity, shifted by `steps(6)` every 120ms. It is removed in static mode.

### 7.3 The frame

`Frame.tsx` is fixed above the stage (`z-index` above media, below modals).

- **Wordmark**, top left: "John Heymans" in Archivo 800, uppercase, 1.125rem. Links to the top.
- **Chapter name**, top centre, only during the story: the active beat's chapter (`Iten`, `The edge`, `The algorithm`, `The doubters`, `Setbacks`, `The village`, `The final`) in Geist 500, 0.875rem, flanked by eight short ticks, one per beat, the passed ones amber. It swaps with the `rise` primitive when the chapter changes. Hidden on phones under 400px wide.
- **Social**, top right: Instagram and LinkedIn icons (20px, from `components/shared/Social.tsx`), `aria-label` with the handle. Required in the nav by Maarten's feedback.
- **CTA**, top right: `Check availability`, amber pill, ink text, opens the enquiry. Always visible. On phones: `Availability`.
- **Skip**, bottom centre, only during the story: `Skip the story` with a down icon. Scrolls (Lenis `scrollTo`, 1.2s) to the practical part and records an analytics event. It is the first focusable element after the hero for keyboard users.
- **Progress**, a 2px lavender hairline along the bottom edge, `transform: scaleX(storyProgress)`, only during the story.
- **Ranking chip and telemetry**, bottom right (sections 7.8 and 7.9).
- **Credit**, bottom left under the copy (section 7.11).

The frame inverts on paper ground: text to `--ink`, CTA stays amber with ink text.

### 7.4 The stage and its layers

`Stage.tsx`: `position: sticky; top: 0; height: 100svh; overflow: hidden`. Inside, in paint order:

1. `media`: each beat's photos, videos and frame sequences (absolutely positioned, `object-fit: cover`, per-asset focus point, separate mobile focus point).
2. `dim`: a violet multiply layer (`background: var(--violet); mix-blend-mode: multiply`) whose opacity each beat controls. This is how photos are pushed back. Never `filter: grayscale`.
3. `set`: SVG and canvas set pieces (globe, chart, grid, notifications, chat window).
4. `line`: a full-stage SVG for the amber line, so the line can travel across beats.
5. Copy slots `centre` and `copy` (from `CopyOverlay`).

Layers of inactive beats are `visibility: hidden` and their videos paused, canvases stopped.

### 7.5 Media handling

- **Photos** (`PhotoLayer`): `next/image` with `sizes="100vw"`, AVIF and WebP, `priority` only for the hero poster. A slow scale from 1.08 to 1 across the beat (scrubbed). Per-photo `focus` and `focusMobile` object positions in `lib/photos.json`.
- **Video layers** (`VideoLayer`): muted, looped, `playsInline`, `preload="none"` until the beat is next in line, then `preload="auto"`. `play()` when the beat becomes active, `pause()` when it is not.
- **Frame sequences** (`FrameSequence`): the Seasats component `[L5.4]`. A canvas drawing AVIF frames with cover-fit math; frame index `floor(progress * (n - 1))`; `nearestLoaded(i, 20)` so no blank frame ever shows; loading thinned in time (every fourth frame first, then every second, then the rest); a separate portrait frame set on phones; device pixel ratio capped at 1.5. Loading starts when the previous beat becomes active.
- **Load queue** (`lib/story/media.ts`): on beat N active, queue beat N+1's media at high priority and N+2 at low priority. Never load more than two beats ahead on phones.

### 7.6 The copy script

All story copy is declared as data keyed to story time, not to page position. This is the USAvionix pattern `[L4.4, layer 3]` and the single most important change from round 5, which scrubbed copy opacity with the timeline.

```ts
// lib/story/script.ts
export type Slot = "centre" | "copy" | "lesson";
export type Reveal = "words" | "rise" | "ink" | "type" | "flash" | "scribble";
export type CopyEntry = {
  id: string;
  slot: Slot;
  text: (c: StoryContent) => string | string[];   // always read from lib/content.ts
  from: [BeatId, number];                          // appears when this beat reaches this progress
  to: [BeatId, number];                            // leaves when this beat reaches this progress
  reveal: Reveal;
  exit?: "rise" | "blur" | "cut";                  // default "rise"
  minHold?: number;                                // ms it stays after revealing, default 700
};
```

`CopyOverlay` resolves, per slot, the one entry whose window contains the current state, and swaps with exit (250ms) then reveal. If the visitor scrolls fast, the outgoing tween is killed and the new entry reveals immediately; `minHold` stops flicker when scrolling back and forth around a threshold.

In static mode, the same script renders all entries in order as plain elements in each beat's section, so the text a screen reader hears is exactly the text the film shows.

### 7.7 Reveal primitives

Implemented once in `lib/story/reveals.ts`, each returning a GSAP timeline. Every split waits for `document.fonts.ready`, uses `SplitText` with `autoSplit: true` and `mask: "lines"` where masking is needed, keeps the original text for assistive technology (SplitText `aria: "auto"`), and reverts after the reveal.

| Reveal | Used for | Motion |
|---|---|---|
| `words` | Title cards: the opener, "Dare to dream big" | Words arrive one at a time: from `scale 1.12`, `filter: blur(10px)`, `opacity 0` to rest; 0.55s `power3.out`; stagger 0.11s. The line underneath draws once the last word lands. |
| `rise` | Story copy, chapter name, UI | Lines from `yPercent 100` inside a mask, 0.6s `power3.out`, stagger 0.07s. Only 12px of travel for single-line UI. |
| `ink` | Lesson cards and a few key lines | United Carriers' sweep `[L6.4]`: per line, `background-clip: text`, gradient of paper up to 30 percent, amber nib at 40 percent, transparent from 50 percent, `background-size: 350%`, `--sweep` from 30 to 100 over 1.1s `power1.inOut`, stagger 0.1s. On paper ground the nib is `--amber-deep` and the text `--ink`. |
| `type` | The ChatGPT prompt | Characters appended with 38 to 72ms random intervals, a blinking 2px amber caret, a 220ms pause at spaces after commas |
| `flash` | Notifications and headlines | From `x: 24px, opacity 0` to rest in 0.35s `power3.out`, with a 1-frame paper border flash |
| `scribble` | "Hey mom" and "made it" | DrawSVG on the traced handwriting paths, 1.6s per phrase, `power1.inOut`, round caps |

Exits: `rise` goes to `y: -8px, opacity 0` in 0.25s `power2.in`; `blur` moves up 24px, scales to 0.9 and blurs 4px (LISA's hand-off `[L7.4]`); `cut` removes instantly.

### 7.8 The ranking chip

`RankingChip.tsx`, bottom right, first shown in the algorithm beat.

- A label, "World ranking", in Geist 500, 0.8125rem, paper 72 percent.
- A number in Archivo 800, 3rem, tabular figures, that rolls like an odometer (each digit a masked column, 0.6s `power3.out`, digits staggered 0.04s) when it changes.
- A 64px sparkline in lavender of the ranking so far.

Its states are set by the beats (section 8) from `ranking.json`. If the ranking data is pending, the chip shows the label and a text state instead of a number: "Outside the quota", then "Climbing", then "Inside the quota", then "Olympic final". The last state, in the final beat, replaces the number with the final placing when `result.json` confirms it.

### 7.9 Telemetry: the algorithm's voice

`Telemetry.tsx`, bottom right above the chip. Up to four lines, Geist Mono, uppercase, lavender, right-aligned. Each entry in `lib/story/telemetry.ts` has a beat, a progress threshold and either a string key or a data reference. When the threshold is crossed, the line types on with `ScrambleText` (0.4s, characters `01<>/[]=+`). Older lines fade to 45 percent, the oldest drops out. The log clears when the chapter changes. Scrolling backwards removes lines past their threshold.

Only true values. A telemetry line that depends on a pending value is skipped, not shown with a placeholder.

Telemetry is active in the algorithm, doubters and setbacks beats only. It is the AI thinking out loud, and it goes quiet once John is in Paris.

### 7.10 Sound

Sound is off by default and only ever starts from a click. One toggle in the frame (speaker icon, bottom right next to the chip on desktop, top right on phones) switches story sound on and off. When on:

- A quiet ambient bed (asset `X2`) loops under the story at -24 LUFS, ducked by 8dB when a cue plays.
- Cues keyed to beat progress, all optional assets: keyboard taps while the prompt types, a soft notification tone per doubters' message, a low swell as the ranking crosses the quota, the crowd of the stadium in the final, silence for the handwriting.
- If the film modal opens, story sound pauses.

Build the audio manager with Web Audio so cues can be scheduled from progress thresholds and never double-fire when scrolling back and forth. With no audio assets present, the toggle is not rendered.

### 7.11 Photo credits

`CLAUDE.md` requires credits wherever images appear. While a photo layer is at more than 50 percent opacity, its credit ("Photo: Jelle Jansegers") shows in the frame's credit slot, bottom left, Geist 0.75rem, paper 72 percent, swapping with `rise`. Frame sequences and video from the promo film carry the production's credit. The footer lists every photographer whose work appears on the page, built from `lib/photos.json` (the existing `photographers` export).

---

## 8. The story beats in detail

Timeline positions are beat progress, 0 to 1. Copy entries are listed with their slot, window and reveal. "The line" means the amber line on the `line` layer.

### 8.1 Opener: "They all said it couldn't be done" (part 2)

**Purpose.** The title card of the film. Set up the doubt that the whole story answers.

**Media.** No photo. The ground is `night`. Behind the type, a very dark, slow frame sequence or video (asset `F7a`, John running towards the camera, from the promo shoot's b-roll), dimmed to 22 percent with the violet multiply and blurred 6px. If `F7a` does not exist, the ground alone.

**Type as the visual.** The sentence fills the screen in Archivo 850, uppercase, `wdth` 78, about 11rem desktop, four lines: THEY ALL SAID / IT COULDN'T / BE / DONE.

**Depth.** Two ghost copies of the sentence sit behind the real one at 6 and 3 percent opacity, scaled 1.4 and 1.8, moving at 0.4 and 0.2 of the scroll speed. As the words arrive, the ghosts drift apart, which gives a slow push-in without any 3D.

**Timeline.**

| Progress | Event |
|---|---|
| 0.00 to 0.40 | Words arrive one at a time with `words` (they are revealed by thresholds at 0.04, 0.10, 0.16, 0.22, 0.28, 0.34, so fast scrolling still gets the full cadence) |
| 0.40 to 0.55 | Hold |
| 0.55 to 0.75 | A 2px amber line draws from left to right under DONE: the start line |
| 0.75 to 1.00 | The sentence exits up with `blur`; the start line stays and slides to the left edge of the stage, where it becomes the origin of the flight path in the next beat |

**Copy.** `centre`: `story.opener.title` = "They all said it couldn't be done." (`opener` 0.02 to `opener` 0.78, reveal `words`, exit `blur`). No second line; the round 5 sub-line is dropped to halve the text.

**Mobile.** Type at 3.4rem, same four lines. Ghosts off.

**Static.** The sentence as an `h2`, the start line as a static rule.

### 8.2 Iten: "So I trained with the best and learned their ways" (part 3)

**Purpose.** Make the journey physical: he travelled to Africa and climbed to 2,400 m. End on the first lesson.

**Three movements.** Ground crossfades from `night` to `altitude` over the first 35 percent.

**Movement A, the flight (0.00 to 0.40).** `Globe.tsx`, a 2D canvas with `d3-geo`:
- An orthographic globe of about 8,000 land dots (precomputed by `scripts/build-globe-points.mjs` from `world-atlas` `land-110m`, a 1.2 degree grid tested with `d3.geoContains`, written to `public/story/data/land-points.json`). Dots are 1.1px, paper at 40 percent; back-hemisphere dots hidden.
- The globe starts centred on the departure city from `route.json` and rotates, following the progress, to centre on Iten.
- The start line from the opener sweeps in from the left and becomes the flight path: a great-circle arc (`d3.geoInterpolate`) drawn progressively in amber, 2px.
- A small plane glyph (inline SVG, 18px, paper) rides the head of the arc, rotated to the bearing of the path.
- Two labels, in Geist 500: the departure city and "Iten, Kenya". No telemetry here; this is still the human part of the story.
- If `route.json` confirms stops (for example Nairobi, Eldoret), the arc passes through them with small paper markers.

**Movement B, the climb (0.40 to 0.65).** The globe zooms (scale ×6) into western Kenya and dissolves. In its place, `AltitudeProfile.tsx`:
- Horizontal altitude lines every 400 m draw in from the left, labelled 400 m to 2,400 m at the right in Geist.
- The amber line continues from the arc into a climb: a rising path from the departure altitude to 2,400 m.
- A large counter in Archivo 800 (7rem desktop, tabular figures) counts in step with the line, from the departure altitude to "2,400 m". The departure altitude comes from `route.json`; if it is pending, the counter starts at 0 m.
- As the line reaches the top, the Iten photograph (`K1`) rises into the frame from below, as if the line had carried us up to it.

**Movement C, the training (0.65 to 1.00).**
- Media: a frame sequence of a group run on the red roads around Iten (`K2`, exported as frames). If `K2` does not exist, two or three `K1` photos in sequence with slow scale. The violet dim at 25 percent so the copy reads.
- `copy`: `story.iten.line` = "So I trained with the best, and learned their ways." (`iten` 0.66 to `iten` 0.86, `rise`).
- `lesson`: card 1 (`iten` 0.87 to `edge` 0.10, `ink`): "Your environment sets your ceiling." with "And consistency beats hard work." below, and "1 of 5" below that in Geist 0.8125rem.

**Credits.** `K1`, `K2` credits in the credit slot.

**Mobile.** Globe centred in the upper half, 90vw wide. The altitude profile runs vertically on phones: the line climbs up the screen, the counter beside it.

**Static.** A static SVG map with the route drawn, the counter showing 2,400 m, the Iten photo, the line and the lesson.

### 8.3 The edge: "However, this wouldn't be enough. I needed an edge." (part 4)

**Purpose.** The turn. Everyone at the top trains like that; consistency gets you into the group, not past it.

**Media.** The last frame of the Iten sequence holds and the violet dim rises to 70 percent. No new image.

**Timeline.**

| Progress | Event |
|---|---|
| 0.00 to 0.30 | `centre`: "However, this wouldn't be enough." (`rise`) |
| 0.30 to 0.45 | Hold, then it exits with `blur` |
| 0.45 to 0.70 | `centre`: "I needed an edge." (`rise`); at 0.60 an amber underline draws under "edge" |
| 0.70 to 1.00 | The match cut: the underline shrinks to 2px wide and becomes a blinking caret; the sentence fades; the caret slides to the centre of the stage, where the chat window will open around it |

**Copy.** `story.edge.a` = "However, this wouldn't be enough." `story.edge.b` = "I needed an edge." Both are Maarten's lines with punctuation adjusted.

**Static.** Both lines, the Iten photo dimmed.

### 8.4 The algorithm: ChatGPT and the data burst (part 5, the set piece)

**Purpose.** Make the AI visible: a real-looking conversation, then the machine thinking, then the season it chose. This is the one place the site spends everything.

**Ground.** `signal`, crossfading in over 0.00 to 0.20.

**Movement A, the conversation (0.00 to 0.35).** `ChatWindow.tsx`:
- The window opens around the caret: a rounded rectangle grows from 2px to 56rem × 36rem (desktop) in 0.00 to 0.08, using `clip-path: inset()` from the centre.
- It is a faithful but generic recreation of a chat interface in its own neutral colours (so it reads as a real app, not as the site): window `#212121`, user bubble `#303030`, text `#ECECEC`, composer a rounded pill `#2F2F2F` with a round send button. Title at the top: "ChatGPT", as text only. **No OpenAI logo or wordmark**; the assistant avatar is a neutral circle. The name is used because it is what John used and it is how he tells the story.
- 0.08 to 0.20: the prompt types into the composer with `type`: `algorithm.json` prompt when confirmed, otherwise `story.algorithm.prompt` = "Build an algorithm that gets me to the Olympics." At 0.20 the send button pulses and the text moves up into a user bubble.
- 0.20 to 0.35: the assistant reply streams in word by word, three short lines from `story.algorithm.reply` (round 5's lines about points not personal bests, to be confirmed by John).

**Movement B, the burst (0.35 to 0.60).** `DataBurst.tsx`:
- 0.35: every character in the window scrambles (`ScrambleText`, mono, 0.8s) into data strings. The window's background and border fade; the text remains, now lavender and mono.
- 0.38 to 0.50: the text shatters into rows. A table of candidate meets streams upward across the stage like a fast log: date, meet, country, category, a projected points value. Rows come from `races.json`. A scanning bar (1px lavender, 20 percent glow) sweeps down repeatedly. If `races.json` is pending, rows show only date and category shapes with the values masked by a bar, never invented names.
- Telemetry, in order: "READING THE INTERNATIONAL CALENDAR" (0.38), "MEETS SCORED: {n}" (0.44, count rolls up, only if confirmed), "PROJECTING RANKING AFTER EVERY COMBINATION" (0.50), "OPTIMISING FOR POINTS PER RACE" (0.55).

**Movement C, the season it chose (0.60 to 1.00).** `SeasonGrid.tsx`:
- 0.60 to 0.72: the rows collapse into a calendar grid of the qualifying window: months across, weeks down, each candidate meet a lavender dot at 50 percent.
- 0.72 to 0.85: dots that the algorithm rejected dim to 15 percent. The chosen meets flare amber one by one, in date order.
- 0.85 to 0.95: **the amber line connects the chosen meets in sequence.** This is the path through the season, and it is the same line that flew to Kenya.
- 0.90: the ranking chip appears in the frame for the first time, showing the starting position from `ranking.json` (or "Outside the quota").
- `copy`: `story.algorithm.caption` = "Not one of those races was the one anyone would have chosen for me." (0.86 to `doubt` 0.05, `rise`).

**Mobile.** The chat window is full width and 70svh tall, like the app on a phone. The data log shows fewer columns (date, category, points). The season grid becomes a vertical list of months with dots in a row.

**Static.** The conversation as a real text transcript in a styled block, the list of chosen races (if confirmed) as a list, and a static grid image generated at build time by rendering `SeasonGrid` without motion.

### 8.5 The doubters, then the record rise (part 6)

**Purpose.** The risk, then the proof. Everyone with experience said no; the ranking answered.

**Movement A, the messages (0.00 to 0.40).** `Notifications.tsx`:
- Three notifications slide in at the top right and stack, as on a phone lock screen: a rounded rectangle 22rem wide, deep background, a small circular icon with initials of the role, the sender's role in Geist 600 ("My federation", "My coach", "My competitors"), the message in Geist 400, and "now" at the right.
- They arrive at 0.05, 0.15, 0.25 with `flash`. Behind them, the season grid dims to 30 percent. With sound on, each plays the notification tone.
- Text from `doubters.json`. If John has not approved exact wording, show the roles only with the single line "That will never work." (Maarten's storyline wording), attributed to all three.

**Movement B, the answer (0.40 to 0.55).**
- `centre`: `story.doubt.answer` = "I ran it anyway." (0.40 to 0.55, `rise`).
- At 0.48, the amber line sweeps across the stage from left to right and pushes the notifications off the right edge.

**Movement C, the rise (0.55 to 1.00).** `RankingChart.tsx` and `Headlines.tsx`:
- A chart fills the lower two thirds: time across the qualifying window, ranking position up the side (inverted, so better is higher), lavender grid, Geist Mono axis labels. The Olympic quota is a dashed paper line.
- The amber line draws the climb from `ranking.json`, synced to progress. The ranking chip's number rolls with it.
- Headlines from `headlines.json` arrive one after another in the upper third with `flash`: outlet and date in Geist 500, headline in Archivo 700, sentence case. Each headline's position in time is marked on the chart with a small paper tick. Two to four headlines, never invented.
- 0.88: the flash that closes the proof, `centre`: `story.doubt.record` = "The fastest rise up the world rankings in the history of my event." (`ink`). The source from `A5` shows in the credit slot while it is on screen.
- `lesson`: card 2 (0.94 to `setback` 0.08, `ink`): "The edge is where the consensus isn't." / "Don't be afraid to challenge the status quo." / "2 of 5".

**Mobile.** Notifications full width at the top, as on a phone. Chart takes the lower half. Headlines one at a time above it.

**Static.** The three messages as quotes, "I ran it anyway.", a static chart, the headlines as a list with links, the lesson.

### 8.6 Setbacks, controllables, qualified (part 7)

**Purpose.** It did not go to plan. He sorted what he could control from what he could not, and qualified anyway.

**Ground.** `low`, crossfading in over 0.00 to 0.20. Grain up to 5 percent.

**Movement A, the setbacks (0.00 to 0.30).**
- The chart stays but the view zooms to the setback period. The amber line dips where `setbacks.json` places events; each event gets a paper marker and a one-line label ("Illness", "Injury") in Geist 500. The ranking chip rolls backwards with the dips if the data shows it.
- Media: a photo of a hard moment (`S2a`, for example `track-lying` from the existing set, Arthur Vermeylen), at 35 percent behind the chart.
- `copy`: `story.setback.line` = "It didn't always go to plan. Setbacks came, one after another." (0.04 to 0.30, `rise`).

**Movement B, sorting (0.30 to 0.65).**
- The chart fades. Two columns appear in the centre in Archivo 700, 3rem: on the left, "Illness", "Weather", "Injury"; on the right, "Sleep", "Nutrition", "Training". No column headings (no labels above headings).
- 0.40 to 0.52: the left column loosens and drifts down, blurring to 6px and fading to 12 percent.
- 0.45 to 0.58: the right column locks in: each word gets an amber underline drawn by the line, and, if `controllables.json` has confirmed readouts, a small Geist Mono lavender value under each (for example average hours of sleep).
- `copy`: `story.setback.focus` = "So I focused on what I could control." (0.36 to 0.64, `rise`).

**Movement C, qualified (0.65 to 1.00).**
- The chart returns. The amber line climbs back and crosses the quota line at the date in `qualification.json`. At the crossing, the dashed quota line turns solid amber for 0.8s, and with sound on, the low swell plays.
- The ranking chip reads its qualifying position, or "Inside the quota".
- `centre`: `story.setback.qualified` = "In the end, I qualified." (0.72 to 0.90, `words`), with the date and how from `qualification.json` under it in Geist if confirmed.
- `lesson`: card 3 (0.90 to `village` 0.08, `ink`): "Focus on what you can control." / "And stop overthinking what you can't." / "3 of 5".

**Static.** The setbacks as a short list, the two columns, the qualification line and date, the lesson.

### 8.7 The Olympic village (part 8)

**Purpose.** Arriving, and choosing to enjoy it. The one warm, human, smiling beat.

**Ground.** `warm`. The telemetry goes silent and the chip sits still.

**The split.** The stage divides vertically. Left: a tense frame, the same photo as the right but cropped tight, dimmed with the violet multiply to 60 percent and softened (4px blur). Right: John smiling in the village (`V1`), full colour, sharp. The divider is the amber line, standing vertical.

Until `V1` arrives, use `lavender-race` (Belga Image, licensed, Olympic 5000m heats, Paris), which shows him relaxed mid-race in Paris. Do not use a training photo from another year to stand in for the village; the credit line would show the wrong place and date.

| Progress | Event |
|---|---|
| 0.00 to 0.20 | The village photo enters; the split sits at 50 percent |
| 0.10 to 0.35 | `copy`: `story.village.a` = "The day I arrived in the Olympic village, I had a choice." (`rise`) |
| 0.35 to 0.60 | `copy`: `story.village.b` = "Let the pressure get to me, or enjoy every minute of it." (`rise`) |
| 0.55 to 0.80 | The amber divider slides to the left edge; the smiling photo takes the whole frame |
| 0.70 to 0.88 | `centre`: `story.village.c` = "I chose to enjoy it." (`ink`) |
| 0.88 to `final` 0.06 | `lesson`: card 4, "Embrace the pressure." / "It comes with the moments that matter." / "4 of 5" (`ink`) |

**Legal note.** Olympic rings, the Paris 2024 emblem and similar marks may not be used as graphics on a commercial site. They may appear incidentally in a photograph if the photo's licence allows it. Do not crop to feature them, do not recreate them, do not use them as decoration. Describe John factually ("Olympic 5000m finalist").

**Static.** The photo, the three lines, the lesson.

### 8.8 The final: "Hey mom, made it" and "Dare to dream big" (part 9)

**Purpose.** The emotional peak and the close. Nobody believed him; he made the final; two words on each arm.

**Ground.** `stadium`, the lavender glow of the Paris track.

**Movement A, the stadium (0.00 to 0.30).**
- 0.00 to 0.16: `heats-pack` (Belga Image, licensed, Olympic 5000m heats, Paris, 7 August 2024): John crossing the line with his fist up, the moment he made the final. `copy`: `story.final.a` = "Nobody believed I'd make that final." (0.04 to 0.18, `rise`).
- 0.16 to 0.30: crossfade to `final-pan` (Belga Image, licensed, the final itself), full bleed, slow scale. `copy`: `story.final.b` = "I was the underdog." (0.18 to 0.30, `rise`).
- The ranking chip changes label and value: "Olympic 5000m" / "Final". At 0.26, if `result.json` confirms the placing, it rolls to it.

**Movement B, the arms (0.30 to 0.62).**
- Media crossfades to `final-arms` (Belga Image, licensed): John with both hands on his head, "HEY MOM" on his right arm and "MADE IT" on his left, on the lavender Paris track. The frame starts tight on the arms (focus point at the writing) and slowly widens to show his face, so the writing is read before the expression. If the close-up `O1` arrives, it replaces the tight opening frame.
- `Handwriting.tsx`: SVG paths traced by hand from the letters in `final-arms` (capitals, marker strokes, the slight slant of each arm) are drawn with `scribble` in amber, registered exactly over the real writing, "HEY MOM" from 0.34 to 0.44 and "MADE IT" from 0.44 to 0.54. Store the trace and its registration points (image coordinates) in `lib/story/data/handwriting.json`. This is the line becoming ink.
- 0.54 to 0.62: the photo dims to 20 percent and the two traced phrases lift off his arms, straighten, scale up and move to the centre of the stage, one above the other, at display size. Hold. The accessible text is "Hey mom, made it."
- There is no other copy in this movement. With sound on, the crowd drops to silence.

**Movement C, the close (0.62 to 1.00).**
- 0.62 to 0.70: the handwriting settles to the upper third.
- `centre`: `story.final.close` = "Dare to dream big." (0.70 to `handover` 0.30, `words`, Archivo 850 at the opener's size). The start line from the opener draws under it, closing the loop.
- `lesson`: card 5 shares this moment: under "Dare to dream big." the line "Your dreams set your ceiling." and "5 of 5" (0.78, `rise`).

**Static.** The photo with the handwriting as a static SVG, the two lines, the close.

### 8.9 Handover to the practical part (part 10, first half)

**Purpose.** The deliberate break John asked for: the story is over, now the buyer's questions.

| Progress | Event |
|---|---|
| 0.00 to 0.60 | The ground crossfades from `stadium` to `paper`. The frame inverts at 0.50 (`data-ground="paper"`). |
| 0.10 to 0.60 | `centre`: `story.handover.line` = "That's the story. Here's what your team takes from it." (`rise`, ink on paper) |
| 0.60 to 1.00 | The stage releases; the chapter name, progress hairline, telemetry and chip leave; normal document flow begins |

---

## 9. Mobile cinema (`cinema-touch`)

Most first visits from LinkedIn will be on a phone, so the film must work there, not only the static layout.

- Native scroll. No Lenis. `touch-action` untouched.
- Beat lengths from the mobile column of section 4.
- Portrait assets: `F3` for the hero, portrait frame sets for every sequence, `focusMobile` for every photo.
- Frame on phones: wordmark top left, `Availability` top right, the progress hairline at the very top, the chip top right under the CTA, one telemetry line above the copy. Chapter name hidden below 400px wide.
- Copy slot bottom, full width minus padding, above `env(safe-area-inset-bottom)`.
- Set pieces simplified as described per beat. Canvas DPR cap 2. The globe renders 4,000 dots, not 8,000.
- Stage height `100svh` so the address bar does not resize it mid-scroll.
- Test at 390 × 844 (iPhone 13) and 360 × 800 (small Android).

---

## 10. Static mode and progressive enhancement

The server renders the full page as a readable document, in story order:

- The hero with the poster and a play button (no autoplay).
- Each beat as a `<section>` with an `h2`, the script entries in order, its main image with credit, and a static version of its set piece (static SVG or a pre-rendered image).
- The practical part, bio and footer as normal.

`static` mode is what visitors with `prefers-reduced-motion: reduce` get, what search engines index, and what anyone sees before JavaScript runs. Cinema mode must never hide content that static mode shows; it only re-positions and animates it.

---

## 11. The practical part (part 10)

Paper ground, ink text, amber-deep links, amber pills with ink labels. Motion calms down: only `rise` and `ink` reveals, triggered once by `ScrollTrigger` at `top 80%`, no scrubbing. Normal document flow, 12-column grid, 4rem padding.

### 11.1 The keynote

- `h2`: "The keynote" (Archivo 800, 4.5rem).
- One sentence (`story.practical.lead`): "Thirty minutes, five lessons, one story your team can use on Monday morning."
- Four facts in a row, each a large figure over a short line: "30" / "minutes, plus optional Q&A"; "3" / "languages: English, Dutch or French"; "5" / "lessons, one per chapter of the story"; the format line "In person, on your stage or at your table" set as text, not a figure.

### 11.2 The five lessons, as a filmstrip

A horizontal strip of five frames, each a still from its chapter (Iten, the season grid, the controllables, the village, the arms), 4:5, with the lesson title under it in Archivo 700 and its line in Geist. On desktop all five fit the width; on phones the strip scrolls horizontally with snap. Clicking a frame scrolls back to that chapter's lesson card in the story. This replaces cards with the story's own images.

### 11.3 Where it works: the audience scale

A horizontal logarithmic scale from 8 to 1,000+ people, drawn as the amber line on paper, with four marks: "Leadership dinners, 8 to 20"; "Executive offsites, 20 to 50"; "Company events, 100+"; "Conferences and business fairs, 1,000+". Each mark has one line of detail from `content.signal.practical.audience`. One sentence above it: "As comfortable at a boardroom table as on a main stage." The line draws when the section enters.

### 11.4 Proof

- **Logos.** One row of client logos from `public/logos` plus the new SVGs (`P1`), in ink at 80 percent, optically balanced: each logo gets a scale factor in `content` so their visual weight matches, not their bounding boxes. Named, never captioned by category.
- **Written testimonials.** The two pull-quotes from `content.proof.quotes`, set large (Geist 500, 1.75rem, ink), one at a time with a slow crossfade, portrait and organisation logo beside each. Attribution by role and organisation until names are approved (`P2`).
- **The room.** The seven Supernova clips (`public/videos/testimonial-01` to `07`) as a drifting wall of vertical cards, muted, playing, reusing the logic of `components/signal/Room.tsx`. Shortest clips first (03, 04, 07). Hover pauses the drift; click opens a lightbox with sound and English captions (`F9`). The wall has a visible pause control (WCAG 2.2.2). One line above: "Filmed straight after the keynote at Supernova, Antwerp."

### 11.5 The recording

A stage photo from Supernova (`stage-wide`, Jelle Jansegers) with one line: "A full recording of the keynote exists. Ask for the private link when you enquire." If the excerpt `F8` arrives, it plays here with sound behind a play button.

### 11.6 Enquiry block

The practical part ends with the enquiry (section 13), inline, under the heading "Bring this to your team."

---

## 12. Biography and footer (parts 11 and 12)

### 12.1 Biography

Kept secondary, as John asked. Paper ground, two columns on desktop: a colour portrait (`B1`, or `outdoor-portrait` from the existing set) and the short bio from `content.signal.bio.body`, first person. Below, four figures from `result.json` and `content`, each shown only if confirmed: Olympic final placing, personal best, "2 years" from decision to final, "15+" keynotes by word of mouth. Links to Instagram and LinkedIn.

### 12.2 Footer

It must look like a footer (Maarten's rule):
- The wordmark set across the full width in Archivo 850, ink, `wdth` 75.
- The email address (`L1`) as a large link, the `Check availability` pill, Instagram and LinkedIn with handles.
- The credits line: "Photography:" followed by every photographer shown on the page, from `photographers`.
- Legal: privacy policy link, company number and address if `L2` provides them, © John Heymans and the year.
- **The scroll pace**, one small line at the bottom, from Seasats and United Carriers `[L10.9]`. `ScrollPace.tsx` measures the distance scrolled (CSS pixels × 0.2646 mm) and the average speed, and writes: "You scrolled {d} m at a pace of {p} per km. At that pace, 5,000 m would take you {t}." If the personal best is confirmed, add: "I needed {pb}." Values update when the footer enters and freeze after. No mono, no label.

### 12.3 Static and phones

Footer stacks to one column on phones. The wordmark still spans the width.

---

## 13. The enquiry

The site's one job is enquiries. LISA shows that the form can be the experience `[L7.6]`; here it stays short.

### 13.1 Conversational enquiry

`Enquiry.tsx`, used inline at the end of the practical part and inside `Modal` when `Check availability` is clicked anywhere. Five steps, each with one line in John's voice (first person, dry, no exclamation marks):

| Step | John's line | Input |
|---|---|---|
| 1 | "What kind of event is it?" | Choice: Conference or business fair / Company event / Executive offsite / Leadership dinner / Something else |
| 2 | "When is it?" | Date picker, or "Not fixed yet" |
| 3 | "Roughly how many people will be in the room?" | Choice: 8 to 20 / 20 to 50 / 100 or more / 1,000 or more |
| 4 | "Which language?" | English / Dutch / French |
| 5 | "Who should I reply to?" | Name, organisation, work email, optional message |

After sending: "Thanks. You'll hear from me within two working days." with the email address for anything urgent.

Behaviour, from LISA `[L7.4]`:
- The current question is sharp; the previous question and its answer move up, scale to 0.8 and blur 4px. Clicking it goes back.
- A 3px progress bar along the bottom of the block, `transform: scaleX(step / 5)`.
- Choices appear 0.1s after the question, from 1.33rem below.
- A back button and full keyboard operation: choices are radio groups, Enter advances, Escape in the modal closes.
- **The plain route is always visible**: a "Prefer one form?" link switches to all fields on one screen, and the email address is shown under the block.

### 13.2 Sending

A Next route handler (`app/api/enquiry/route.ts`; read the Next 16 route handler guide first) validates fields server-side, rejects a filled honeypot field, rate-limits by IP (5 per hour), and sends an email to the address in `L1` through the provider Maarten chooses (section 19). No reCAPTCHA: it adds friction for the exact people the site is for. Personal data is not stored beyond the email. Until the provider is set up, the handler returns an error and the block shows the plain email address.

---

## 14. Accessibility

The quality floor in `CLAUDE.md` and the gaps found in every reference site `[L8]` make this non-negotiable.

- **Reduced motion**: `static` mode, as section 10. Test by emulating `prefers-reduced-motion: reduce`.
- **Keyboard**: a visible skip link to the practical part at the top of the page; focus order follows the story; `:focus-visible` on everything, a 2px amber outline with 3px offset on dark, `--amber-deep` on paper. Modals trap focus and return it (`components/shared/Modal.tsx` already does).
- **Screen readers**: real headings in story order; split text keeps its accessible text; decorative canvases `aria-hidden`; the chat window's transcript is real text; charts have a text summary from the same data ("World ranking from {a} to {b} between {date} and {date}"), rendered only with confirmed data.
- **Moving content**: the hero loop and the clip wall have visible pause controls.
- **Captions**: the film (`F4`) and all seven clips (`F9`), English first.
- **Contrast**: section 2.1 values. Text over imagery only on a scrim reaching 70 percent night.
- **Motion safety**: no flashing faster than three times a second; the data burst scan runs at under 2Hz.
- **Touch targets**: 44 × 44px minimum.

---

## 15. Performance and the media pipeline

### 15.1 Budgets

| Metric | Target |
|---|---|
| LCP (hero poster) | under 2.5s on a mid-range phone over 4G |
| CLS | under 0.05 |
| INP | under 200ms |
| JavaScript for `/story` | under 250 KB gzipped including GSAP and Lenis |
| Hero loop | desktop 1920 × 1080 under 4 MB; phone 720 × 1280 under 2.5 MB |
| Each frame sequence | desktop under 8 MB, phone under 4 MB |
| Lighthouse (phone) | Performance 85+, Accessibility 100, Best Practices 95+, SEO 100 |

### 15.2 Scripts to write

- `scripts/encode-video.sh`: the recipe from project memory (`/opt/homebrew/bin/ffmpeg`, export it to `PATH` first). Hero loops: `-c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an`, plus an AV1 WebM source listed first in `<video>`. Testimonials and film modal: keep audio, `-crf 24`. Posters: first clean frame as AVIF quality 55 and JPEG quality 82.
- `scripts/export-frames.mjs`: for a source clip, a frame rate (24 desktop, 20 phone) and a width (1920 desktop, 1080 portrait phone): ffmpeg to PNG frames in a temporary folder, then `sharp` to AVIF (quality 50, effort 6), written to `public/story/frames/<id>/<desktop|mobile>/frame_0001.avif`, with a `manifest.json` (count, fps, width, height, credit). Maximum 240 frames per sequence.
- `scripts/build-globe-points.mjs`: `world-atlas` land to dots, as section 8.2.
- `scripts/check-pending.mjs`: section 3.3.
- New photos go through the same export process as `lib/photos.json` (sizes 2400 on the long edge, credit and caption required; Belga only from the licence folder).

### 15.3 Loading strategy

Fonts through `next/font` (Archivo variable subset Latin, preloaded; Geist and Geist Mono as now). The hero poster is the only preloaded image. Beat components are code-split with `next/dynamic` but their static markup is server-rendered. The set pieces' client code loads when the previous beat becomes active.

---

## 16. i18n, analytics, metadata

**i18n.** All strings in `lib/content.ts` under `story`. Allow 20 percent growth: no fixed-width copy boxes, no layouts tuned to one line length. Split-text reveals re-split on resize (`autoSplit`). The handwriting stays English (it is the literal writing on his arms); in a future Dutch version it is accompanied by a translation in the copy slot.

**Analytics.** Events, whichever provider Maarten chooses: `film_opened`, `film_sound_on`, `story_skipped` (with the beat), `beat_reached` (per beat, to see where people stop, as LISA logs `[L7.6]`), `cta_clicked` (with location), `enquiry_step` (step number), `enquiry_sent`, `clip_opened`. No personal data in events.

**Metadata.** Title: "John Heymans, Olympic 5000m finalist and keynote speaker". Description in first person from the hero line. An Open Graph image (`X3`, 1200 × 630, a frame from the film with the hero line). `Person` structured data with name, description, `sameAs` for Instagram and LinkedIn. Keep `public/llms.txt` in step with the page.

---

## 17. Build order and acceptance

Build in this order. Stop at each milestone, run the checks, and show Maarten screenshots.

| # | Milestone | Done when |
|---|---|---|
| M0 | Setup | Next 16 docs read for routing, fonts, images, route handlers. `/story` route renders the static layout of the whole page from `content` with placeholder media. Dependencies added. |
| M1 | Story engine | Driver, store, stage, ground with theme switches, frame, copy overlay with all six reveals, telemetry, chip. Every beat present as a placeholder that shows its id and progress. Scrolling through shows the right copy entry in the right slot at the right time, and scrolling back reverses it cleanly. |
| M2 | Hero | Film loop, poster, quiet cues, film modal with sound and captions, frame in hero state. |
| M3 | Opener and edge | Both quiet beats finished, including the start line and the caret match cut. |
| M4 | Iten | Globe, flight, altitude climb, training media, lesson 1. |
| M5 | Algorithm | Chat window, typing, reply, burst, season grid, the path through the season, chip appears. |
| M6 | Doubters | Notifications, the sweep, chart, headlines, record flash, lesson 2. |
| M7 | Setbacks | Dips, sorting, qualification crossing, lesson 3. |
| M8 | Village and final | Split and divider, handwriting, close, lessons 4 and 5, handover. |
| M9 | Practical, bio, footer | All of section 11 and 12, clip wall with captions. |
| M10 | Enquiry | Conversational and plain versions, route handler, error and success states. |
| M11 | Mobile cinema | Section 9 complete at 390 × 844 and 360 × 800. |
| M12 | Static mode | Every end state visible with reduced motion; no content hidden. |
| M13 | Performance and accessibility | Budgets of 15.1 met; keyboard walk-through; no console errors; `scripts/check-pending.mjs` lists only the pending facts Maarten already knows about. The launch build runs with `STRICT_FACTS=1` and passes only when that list is empty. |

### 17.1 Visual checks

Use the project workflow in memory: run `next dev -p 3111`, then a `playwright-core` script against the installed Chrome (`channel: "chrome"`) that steps with `page.mouse.wheel` in viewport-height steps and saves one JPEG per step, at 1440 × 900 and at the iPhone 13 profile. Pinned and sticky scenes distort in full-page screenshots, so never use those. Also capture with `emulateMedia({ reducedMotion: "reduce" })`.

### 17.2 Content checks

- Search the built output for em dashes and exclamation marks; there must be none in user-facing text.
- Every image on screen shows a credit.
- Every number on screen traces to a confirmed data value.

### 17.3 Beat checks

Expose, in development only, `window.__story.seek(beatId, progress)` so any moment of any beat can be screenshotted directly. Screenshot every beat at progress 0.1, 0.3, 0.5, 0.7 and 0.9 for review.

---

## 18. What not to do

- Do not scrub text opacity or position with the scroll. Text arrives and stays.
- Do not put more than one text block per slot on screen.
- Do not use black-and-white or desaturation filters.
- Do not use the OpenAI logo, Olympic rings or event emblems as graphics.
- Do not add a top menu. The frame is the interface.
- Do not use mono for anything except the algorithm's voice.
- Do not invent data to make a chart look better. A chart with fewer confirmed points is better than a pretty wrong one.
- Do not block the first screen with a loader.
- Do not autoplay sound, ever.

---

## 19. Decisions for Maarten

These affect the build but do not block starting it. Defaults are in brackets.

1. **Enquiry email provider** for the route handler: Resend, Postmark or a form service. [Resend; needs DNS access for the sending domain.]
2. **Analytics provider.** [Plausible or Vercel Analytics, both cookie-free, so no consent banner is needed.]
3. **Sound.** Whether to license an ambient bed and cues (`X2`), or ship with the film's sound only. [Film sound only for launch; the story toggle is hidden until assets exist.]
4. **Showing ranking numbers.** If John prefers not to show exact positions, the chip and chart run on states and shape only. [Show them if he confirms them.]
5. **Where the site goes live.** `/story` for review, then `/`. [Promote after John's sign-off.]
6. **Recorded voice.** Whether John records short lines for the enquiry or the story (`X2`). [Not for launch.]

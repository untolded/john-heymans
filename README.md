# John Heymans, personal-brand website

Next.js 16 (App Router, Turbopack), GSAP 3.15 with ScrollTrigger and SplitText, Framer Motion 13.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Route | What it is |
|---|---|
| `/` | The live page. The approved design, described under Round 6 below |
| `/brand/fe331dc0ae83be5b` | The brand guide. Unlisted: `noindex`, disallowed in robots, linked from nowhere |
| `/archive` | Index of the earlier rounds. `noindex` |
| `/archive/type` | The typeface review, with Scoreboard marked as chosen |
| `/archive/type/trap`, `/archive/type/readout` | The two typefaces John did not choose, still running |
| `/archive/signal`, `/archive/concept-a`, `-b`, `-c`, `/archive/brief` | The earlier designs, untouched |

`/story`, `/signal`, `/concept-*` and `/type/*` redirect permanently to their new homes, so links
already sent to John keep working. `docs/design-tokens.md` has the settled colours and type
tokens, `docs/brand-guide.md` is the brand guide in writing, and the earlier design plan is in
`docs/concepts.md`.

## Where things live

- `lib/content.ts`: every string on the site, in one dictionary, ready for Dutch and French.
- `lib/photos.json` and `public/photos/`: the selected photographs with credits and captions. Belga Image files come only from the commercial-licence folder.
- `public/logos/`: the ten client logos, rendered monochrome by CSS filter.
- `components/shared/`: the booking modal, film modal, photo-with-credit component.
- `components/story/` and `lib/story/`: the live page. `components/story/kits/`: one module per proposed typeface, so a kit's fonts only load on its own route.
- `app/story.css`: the live page's stylesheet, and the type tokens every kit overrides. `app/type/kits.css`: the three kits, as values only.
- `components/archive/{a,b,c,signal}` and `app/archive/*`: the earlier rounds. Kept working, not maintained.

## Not yet in the repo

- The 60-second film. Drop it at `public/media/promo.mp4` and the film modals play it.
- The Supernova recording of the full keynote.
- Client logo files. Clients are set as wordmarks in type for now.
- A form backend. Submitting the enquiry shows the success state after a short delay.

## Round 4 and 5, archived: one continuous story at `/archive/signal`

The film opens the page, autoplaying muted with one sound control. From there a single sticky stage carries eight cross-fading beats, from "they all said it couldn't be done" through Iten, the ChatGPT conversation that produced the race schedule, the doubters, the setbacks and the Olympic final. The ground then turns from night to paper for the keynote details, audience sizes, takeaways, audience clips, logos, testimonials, bio and booking.

Interface is a wordmark, one permanent enquiry button and a progress hairline.

- `components/archive/signal/Story.tsx` holds the master scrubbed timeline. Default CSS is the stacked layout; the script adds `.is-cinema` on desktop when motion is allowed. Anything the timeline reveals must also be resolved in the mobile and reduced-motion branch.
- `public/media/hero.mp4` is an 18-second cut built from stills. Drop the real film in at that path and the hero is finished.
- `docs/round4-plan.md` holds the plan and both build logs. `docs/storytelling-teardown.md` is the analysis of the four reference sites the storytelling is based on.

## Round 6: the story site, now at `/`

Built from `docs/build-brief.md`, approved by John, and now the live page at `/`. One scrolling page that plays like a short film (nine beats on one sticky stage), then turns to paper for the keynote, proof, enquiry, bio and footer. Everything it needs lives in `components/story` and `lib/story`.

**Modes.** The server renders a readable static document (what reduced-motion visitors, visitors without JavaScript and search engines get, and what screen readers read in every mode). On mount the client picks `cinema-desktop` (Lenis, full stage) or `cinema-touch` (native scroll, portrait layouts) and only then adds `is-cinema`. In development, `?mode=static` forces a mode.

**How it is wired.**
- `lib/story/beats.ts`: beat order, scroll lengths (desktop and touch), grounds and their crossfades. Tune pacing here.
- `lib/story/driver.ts` + `components/story/Driver.tsx`: the only code that reads the scroll position. It writes progress, show, hide and active per beat into `lib/story/store.ts`, plus story time (beat index + progress).
- `lib/story/script.ts`: every line of story copy, keyed to story time. `components/story/CopyOverlay.tsx` shows one entry per slot and swaps them with the reveals in `lib/story/reveals.ts`.
- `lib/story/telemetry.ts` and `lib/story/ranking.ts`: the algorithm's voice and the ranking chip, both driven by story time.
- `components/story/beats/*`: one paused GSAP timeline per beat, set from the store every frame. `Chart.tsx` is shared by the doubters and the setbacks.
- All copy is in `lib/content.ts` under `story`. A vertical bar is a line break in a title card; a word in asterisks is underlined by the amber line.

**Facts.** Every number the page can show lives in `lib/story/data/*.json` with a status and a source, and only reaches the page through `show()`. Pending values render in development, outlined and labelled PENDING or PLACEHOLDER, and never in production (the chip falls back to text states, the chart loses its axis numbers, telemetry lines that need a pending value are skipped). `npm run build` lists everything still pending; `npm run build:launch` fails until the list is empty. Flip a value by setting `"status": "confirmed"` once the source is in.

**Dropping in assets.** `lib/story/assets.ts` checks at build time which files exist, so no code changes are needed for these:
- `public/story/film/hero-loop.mp4` (+ `.webm`, `hero-loop-portrait.mp4`): the clean hero loop (F2, F3). `scripts/encode-video.sh loop|portrait <source> hero-loop`.
- `public/story/film/film.mp4` and `film.en.vtt`: the film with sound and its captions (F1, F4). `scripts/encode-video.sh film <source> film`.
- `public/story/film/poster.jpg`: the poster frame (F5).
- `public/videos/testimonial-0N.en.vtt`: subtitles for the audience clips (F9).
- Frame sequences (F7, K2): `node scripts/export-frames.mjs <id> <source> desktop|mobile "<credit>"`.
- Sharing image (X3): `node scripts/make-og.mjs` against a running server.

**Enquiries.** `app/api/enquiry/route.ts` validates, drops honeypot hits, allows five per hour per visitor and sends through Resend once `RESEND_API_KEY` and `ENQUIRY_FROM` are set (`ENQUIRY_TO` defaults to the address on the site). Until then it answers 503 and the form shows the email address.

**Checking a moment.** In development, `window.__story.seek("final", 0.6)` jumps to any point of any beat.

### Round 7 changes (21 September 2026)

- **Facts** now come from `docs/john_heymans_olympic_journey_ai_strategy.md`: the final (11th, 13:19.25), the qualifying run (13:03.46 indoors in Boston on 26 January 2024, under the 13:05.00 standard), the ranking milestones, the quota of 42, the ChatGPT prompt and the method behind the reply. The ranking history is five milestones, several of them ranges; `lib/story/ranking.ts` draws a monotone curve through them (no invented dips) and the chip only ever shows the milestones' own labels ("Top 100", "37", "Top 40", "Top 30").
- **Chart**: the rise crosses the quota in July 2023; the setbacks chapter zooms in time and rank on the months spent just inside the top 42, then marks the Boston run.
- **Film**: `public/story/film/` holds a clean hero loop cut from the six title-free shots of the keynote film (landscape and portrait, cropped above the burned-in subtitles), posters taken from the loops' first frames, and the full film with sound for the modal.
- **Video hosting**: every video is served from the site itself, twice: AV1 in WebM first (`lib/story/video.ts`), H.264 in MP4 as the fallback for browsers without AV1. WebM sizes: hero loop 1.9 MB, portrait loop 0.9 MB, film 18 MB, reel 10.4 MB, audience clips 0.8 to 4.3 MB. Encoded with SVT-AV1 (`-preset 4-5 -crf 35-46 -svtav1-params tune=0`, Opus audio, `-cues_to_front 1`). The two source files over 100 MB are in `.gitignore`.
- **Facts are complete**: `npm run build:launch` passes. The doubters' notifications are written for the story (no real messages exist), grounded in the strategy doc's account of the conventional advice. The season grid's grey dots are an illustration of the calendar; only Boston, Liévin and Glasgow are real races, and the page never names or dates the others.
- **Handover**: the story ends on the dark ground; the practical part rises over the held stage as a sheet of paper (`margin-top: -100svh` in cinema, one extra screen of tail in `Driver.tsx`). The frame flips to ink from an IntersectionObserver, only once paper fills the header band.
- **Enquiry**: one component, styled as a ChatGPT conversation, inline and in the modal (`Dialog size="gpt"`). The logo files are in `public/story/brand/`.
- **Village**: two photos (`outdoor-portrait` tense, `track-laugh` laughing), side by side on landscape screens and stacked on portrait ones.
- **About**: the vertical reel (`public/story/reel/about.mp4`), muted on screen, sound one tap away.
- **Footer**: the scroll pace is now a results board at the top of the footer.
- Photos marked `"free": true` in `lib/photos.json` (the Iten photo) are copyright free and carry no credit. Any other photo without a photographer is listed by `npm run build` and blocks `build:launch`.

### Round 8: the live page, the archive and three typefaces (22 September 2026)

John approved the round 7 page, so it moved from `/story` to `/` and everything earlier moved
under `/archive`, which is `noindex` and linked from nowhere. Nothing in the archived designs
was changed beyond their import paths and their own cross-links.

**The colours are settled.** The six tokens and the two support values are recorded in
`docs/design-tokens.md` and shown on `/type`. They do not change again.

**The type is not.** Every typographic decision in `app/story.css` now reads a token, so a
typeface is a block of values rather than a rewrite: `--d-face`, four display weights, four sets
of variable axes, `--d-case`, three tracking steps, `--d-scale` (multiplies every display size,
desktop and mobile) and `--d-mark-div` (sizes the footer wordmark to the page width). Defaults in
`.story-root` are the live setting; `app/type/kits.css` overrides them per `[data-type]`.

The live page renders `StoryDocument` with no kit; each route under `/type` passes one. Kits live
one per module in `components/story/kits/` so their fonts never reach the live page.

| Kit | Route | Display | Reading | The idea |
|---|---|---|---|---|
| Ink trap | `/type/trap` | Bricolage Grotesque | Bricolage Grotesque | One family. The optical size axis opens the traps at headline size and closes them at reading size. The only kit set in sentence case |
| Scoreboard | `/type/board` | Big Shoulders | Instrument Sans | Stadium signage. Narrowest of the three, so it is set 12 percent larger |
| Readout | `/type/readout` | Martian Mono | Host Grotesk | Fixed pitch: a results list, a split time, the schedule the model produced. Headlines and readouts are one voice |

Verified: production build clean, the live page pixel-identical to the round 7 build through every
beat, axe 0 violations on `/`, `/type`, `/archive` and all three kit routes. One warning to settle
if Scoreboard wins: `next build` finds no font override metrics for Big Shoulders, so there is no
size-adjusted fallback and the swap shifts layout slightly.

### Round 9: Scoreboard goes live, and the brand guide (22 September 2026)

John picked **Scoreboard**. Big Shoulders over Instrument Sans, with Geist Mono for readouts, is
now the default in `.story-root`; the display sizes absorbed the 1.12 scale it was reviewed at, so
`app/story.css` states the real sizes and `--d-scale` is back to 1. `/type` moved to
`/archive/type` with the review page reframed as the record of the decision, and the two rejected
kits still run there.

**The reported text shift is fixed.** On "However, this wouldn't be enough" the word "this" moved
between lines as the reveal finished. Cause: the rise and ink reveals split the text into one
block per line and then unsplit it, and `text-wrap: balance` regrouped the words at that moment,
because the split itself measures the plain greedy layout. Two changes, both needed:
`.slot > .entry` now fills its slot so the max-widths resolve against a definite width, and
nothing that gets split carries `balance` or `pretty` any more. Where greedy wrapping reads badly
the break is written into the copy with a vertical bar. Verified with a probe that compares the
geometry of every entry mid-reveal and settled, at 1280, 1440 and 1728: no line-grouping changes
anywhere.

Two more shifts went with it. Big Shoulders is missing from next/font's fallback metrics table, so
`app/story.css` declares a size-adjusted `local("Arial")` stand-in measured against the real font,
which brings a fallback headline to within 1.5% of the real width. And the chat window's two
messages now hold the height they are measured at, because the scramble switches them to the
monospace, which wraps wider. Scroll CLS: 0.045 desktop and 0.027 mobile, down from 0.057 and
0.146. Load CLS is 0.

**The brand guide** is at `/brand/fe331dc0ae83be5b`: `noindex`, `Disallow: /brand/` in
`app/robots.ts` (the path itself is not named there, since a robots file is public), and nothing
links to it. `docs/brand-guide.md` is the same document in writing. The motion demos import
`lib/story/reveals` directly, so the guide cannot drift from the site. Assets are in
`public/brand/`: variable and static fonts, the outlined wordmark, palette as CSS, JSON and Adobe
`.ase`, title-card and lower-third templates, the grain tile and `motion-tokens.json`.
`scripts/build-brand-kit.sh` zips all of it into one download.

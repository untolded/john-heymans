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
- `public/logos/`: the client logos for the marquee, drawn as one ink silhouette by CSS filter. Logos that arrived as colour on white were converted to black on transparent first (see Round 10).
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

**Enquiries.** `app/api/enquiry/route.ts` validates, drops honeypot hits, allows five per hour per visitor and sends through Resend once `RESEND_API_KEY` and `ENQUIRY_FROM` are set (`ENQUIRY_TO` defaults to the address on the site). Until then it answers 503 and the form shows the email address. Five questions: name, company or organisation, email, phone (optional) and a free text about the event (2,000 characters); the email lists them and sets Reply-To to the visitor.

**Enquiry: captcha and spam.** No account, no third party, no cookie. [ALTCHA](https://altcha.org) proof of work (`altcha-lib`, MIT): `app/api/altcha/route.ts` issues a signed PBKDF2 challenge (`lib/altcha.ts`), the browser solves it in the background from the moment the enquiry comes into view (`lib/story/pow.ts`, solver loaded on demand, about 4 kB gzipped), and `/api/enquiry` verifies it and refuses a solution used twice. On top: the honeypot, a minimum of 4 seconds between the first question on screen and a send (signed into the challenge; faster is accepted and dropped), link markup or a link in the name dropped silently, more than two links in the event text answered with a request to trim, and the rate limit. Rules shared by page and route live in `lib/enquiry-rules.ts`. If the check can't finish, the visitor gets "Try again" and the email address.
- `ALTCHA_HMAC_KEY`: required in production, a long random secret (`openssl rand -hex 32`). Without it, development uses a dev-only key and logs a warning; production answers 503 and the page shows the email address.

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

### Round 10: Maarten's feedback on the live page (28 September 2026)

Less text, and the visuals carry more of the story. What changed:

**Hero.** The line is "Two-year journey. One AI algorithm. The Olympic final." and the sub-line is
gone. The loop now opens on John facing the camera, arms up in the Stade de France (a fresh
1920 x 1080 crop of the 4K master at 39.20 s, the only front-facing shot in the film without
burned-in titles), followed by the Budapest pack, the Paris pack head-on, the Supernova room, the
stage from behind and the Paris wide shot, which runs straight back into the arms-up when it loops.
Posters and `public/story/og.jpg` were regenerated from it (`scripts/make-og.mjs`).

**A first page.** A new `prologue` beat opens the story: "How far can AI take an Olympic dream?"
on a page that is already there as the stage slides over the film, then turns on its left edge
like the first page of a book.

**Iten.** "The day after his graduation, John booked a plane ticket to Kenya." over the globe,
then the flight. The altitude chart is gone: the dive into Kenya lands on the top-down drone shot
of the red road, then the pack running at the camera carries "To train with and learn from the
best runners in the world", then John and lesson 1. The Kenya clips are in `public/story/kenya`,
landscape crops for wide screens and the vertical originals for phones.

**The algorithm.** "However, training hard wouldn't be enough." The amber underline under "edge"
pulls into a dot and drops into a Mac dock as ChatGPT's running light; the icon bounces and the
window zooms out of it. The prompt is "Help me build an AI-algorithm to get me to the Olympics",
and the whole answer stays in the window: thinking, three agents, the code, then "Recommendation:
a competition calendar that's different from everyone else" with a two-lane calendar (everyone
else's twelve to fifteen outdoor races, John's three indoor ones). The data log and the season
grid outside the window are gone. The thread is laid out in full from the start and scrolls by
transform, so it never shifts the layout.

**The doubters and the chart.** The window folds back into the dock; the three messages arrive
large, in the middle, and the amber line pushes them off before "I ran it anyway." The chart
names only its ends: 200+ and a large 31, "Olympic qualification", which is how John tells it.
The ranking data's last milestone is now 31 (it was "top 30"), and the Boston standard mark is
off the chart. Title: "The fastest rise up the world rankings in the history of athletics."

**Removed.** The setbacks and Olympic village chapters, the chapter names in the top bar (the
ticks stay), the telemetry lines, the ranking chip, every lesson subtitle and "n of 5" tag, the
keynote lead and format lines, the scale's lead, axis label and detail lines, the clip durations
and the full-recording section.

**The practical part.** The keynote facts sit in three lanes drawn with hairlines, and the third
reads "lessons with clear parallels in business". The lessons have a new title, credits in the
corner of each photo, and titles only; lessons 3 and 4 are no longer in the story, so their frames
do not link back. "Small room or full house, expect to feel high energy." Booked by is now a slow
marquee of sixteen logos with a pause button (still, and wrapping, with reduced motion), De Warande
has its name under its symbol, and two new testimonials, translated from Dutch, join the two
there were: Andrés Jorge Buysse (Deutsche Bank) and Marina De Groof (DGI Immo), named and linked
to LinkedIn as they were supplied.

**Scroll pace.** The page counts as one kilometre and the clock pauses itself after 20 seconds
without scrolling, like a running watch, so a normal visit lands on a runner's numbers rather
than days.

**Open.** Who filmed the Kenya footage: `lib/story/data/footage.json` is pending, development shows
"photographer to confirm", production shows no credit, and `npm run build:launch` fails until it is
filled in.

Measured on the production build: JS 243.9 KB transferred (budget 250), scroll CLS 0.008 desktop
and 0.006 mobile, axe 0 violations in cinema, phone and reduced-motion modes.

### Round 11: first person, a cinematic prologue, tighter timing (28 September 2026)

**First person everywhere.** Story, lessons title, bio heading, the enquiry chat and the photo alt
texts now speak as John. His name stays where it is a name: the wordmark, the page title, the share
image's alt text and the testimonials, which are other people's words.

**The prologue** is John opening the story, three lines one at a time: "My story is about taking
a different road." "Two years before Paris, I wasn't even in the world's top 200." "So I used AI to
find a road nobody else was taking." It is shot like the start of a film: a drone following him
alone along a red road in Iten (`public/story/kenya/road-follow`, slowed to 0.72), graded into the
night palette with grain, letterbox bars closing in and opening again into "They all said it
couldn't be done." The page-turn is gone.

**The flight** marks both places with real dots, "Brussels, Belgium" and "Iten, Kenya", each with a
ping. The chapter title has left before Brussels appears, and both dots stay until the dive.

**Timing.** Every beat is now laid out in viewport heights of scroll (`v()` in `lib/story/beats.ts`),
so each moment gets scroll in proportion to what is on screen. The story is 1,583 viewport heights
on desktop, down from 1,880 with a longer prologue in it. The biggest cut is after the ChatGPT
answer: about 35 viewport heights to read the calendar, where it was about 125.

**The doubters** arrive under "My team and my peers called me crazy."

**The pace board** says what it means: "Scrolling down this page counts as a 1 km run. Here's how
fast you went." Then your time for 1 km, your 5 km at that speed, and John's fastest 5 km.

Measured on the production build: JS 244.4 KB transferred, scroll CLS 0.006 desktop and mobile,
0 in reduced motion, axe 0 violations in all three.

**Follow-up (28 September 2026).** The audience clips carry a muted-speaker badge that opens into
"Play with sound" on hover or focus (always open on touch screens). The pace board can no longer
beat John: the clock starts from his pace per kilometre (13:03.46 over 5 km, 2:36.7) and adds the
time spent moving down the page. Seppe Teunis is named in the footer's photography line
(`EXTRA_PHOTOGRAPHERS` in `lib/story/photos.ts`); which images are Seppe Teunis's is not recorded yet.

### Round 12: Maarten's feedback, sharper media (29 September 2026)

**The story is shorter and goes straight to the point.** The prologue is two lines, the first now
"My story starts 2 years before the Olympics in Paris when I wasn't even in the world's top 200
yet." "They all said it couldn't be done" is gone, so the letterbox opens straight onto the flight.
The globe's dive lands in the pack running at the camera (the top-down road shot is gone), and
lesson 1 and its photo are gone. The ChatGPT answer is thinking, code and the recommendation: no
agents, no calendar. The doubters, their messages and "I ran it anyway" are gone; the window folds
into the dock and the ranking chart comes straight up under "This led to the fastest rise up the
world rankings in the history of athletics." Lesson 2 is gone. The beat is now called `climb`.

**The chart** is a real chart: "World ranking" over a vertical axis marked 200, 100 and 50, the
years at the two ends of the time axis, gridlines that stop short of the "200+" label, the quota
line, and the big 200+ and 31. The line is one steady climb (`climb()` in `lib/story/ranking.ts`)
rather than a curve through the milestones, which had a flat stretch in 2023. It is a shape, not a
record of the months in between, so only its ends are ever labelled.

**Motion after the story** is one vocabulary across the practical part, the bio and the footer
(`PracticalMotion`): headings rise line by line in a mask, as the story's title cards do; lesson
titles ink in; supporting text and figures fade up in staggered groups; lines draw; photos push in.
The bio's heading was not animated before because the bio sat outside the practical part.

**About me** is a dark, full-bleed panel between the paper sections: John on the Supernova stage,
mid-sentence (Jelle Jansegers, re-exported at 3600 px from the original), the copy in the shadow
to his left, and the four figures as a results strip under an amber finish line. The reel is gone.

**The audience clips** have a play button in the middle of every clip, which fills amber on hover
or focus.

**Media.** Every video is re-encoded by a committed script, straight from the masters:
`scripts/encode-hero.sh` for the hero loop, `scripts/encode-video.sh` for the Kenya clips, the
audience clips and the film. The round 10 hero loop re-used five shots from earlier web encodes and
scored VMAF 90 to 92 against a clean master; the new one scores 97 to 98. Each video ships as AV1
(WebM), HEVC (MP4, for Safari and iPhones without AV1) and H.264 (MP4), best first; the hero adds a
1440p cut for large and high-density screens and an art-directed poster. The Kenya band is scaled
to 1920 with Lanczos before encoding, which beats letting the browser stretch 1080 pixels. The
audience wall plays ten-second silent previews; the dialog loads the full clip with sound. Photos
are served as AVIF where possible, full-bleed ones at quality 85.

### Round 13: AI surfaces, icons, search, 404, legal (29 September 2026)

**AI surfaces.** Everything that was filled with plain amber (the pills, the pace board's own cell, the
chat's send button, the skip link, the clip play button on hover, checked boxes) now carries one
gradient made from the brand colours, amber into lavender through the rose where they meet
(`--ai` in `app/story.css`; ink text stays at 7:1 or better). It drifts slowly and a thin sheen
crosses it every seven seconds; reduced motion keeps it still. The thin amber lines are unchanged:
they are the story's line, not surfaces.

**Icons.** The icons are John himself, a round portrait from the licensed `final-arms` photo
(hands on his head down to the bib): `node scripts/make-icons.mjs` writes the tab sizes
(`app/icon.png`, `favicon.ico` at 16, 32 and 48) transparent around the circle, and the iOS web
clip and manifest icons with the circle on the night ground.

**Search and AI assistants.** One module, `lib/seo.ts`, builds the structured data (WebSite,
ProfilePage, Person with sameAs, the keynote as a Service), `/llms.txt` (generated from the page's
own copy and confirmed facts, so it cannot drift) and the per-page metadata. Canonical URLs,
hreflang, large image previews, a sitemap with images, and a robots file that names the AI search
crawlers and the training crawlers separately (both allowed; the comment says how to opt out of
training only). The share image is the photo from the final, "Hey mom" and "Made it" on his arms
(`scripts/make-og.mjs`).

**404.** The ranking chart again: "404" where "200+" was, the climb drawing itself to the top of the
screen, "This page didn't qualify." and the way back to the start. It returns a real 404 status.

**Legal pages and cookies.** `/privacy`, `/cookies` and `/legal`, written for John to check, in his
voice. What they say matches the code: enquiries go out as one email through Resend and nothing is
stored, the rate limit keeps a hashed IP in memory for an hour, the site sets one cookie (the consent
choice) and uses session storage for the scroll position, and nothing measures visits. The facts only
John can supply (business name and form, address, enterprise and VAT numbers, host, email provider,
court district) are pending in `lib/story/data/legal.json`: they show as "To confirm" on every build,
and `npm run build:launch` fails until they are filled. The cookie banner asks once, with two answers
of equal weight, remembers the choice for six months, and "Cookie settings" in the footer opens it
again. `track()` sends nothing unless statistics are allowed. The legal and 404 copy lives in
`lib/content-pages.ts`, so it never ships in the story page's JavaScript.

Measured on the production build: JS 248.5 KB transferred (budget 250), scroll CLS 0.006, axe 0
violations on the story, the three legal pages and the 404, with the cookie banner open.

## Round 13: John's review and the film playbook

John's review (6 October 2026) and Parter Studios' film playbook, done in six parallel workstreams.

- **Story.** The prologue opens "My story began two years before the Paris Olympics" and its lines
  appear whole (a `fade` reveal). The ChatGPT scene has a title, "I built an AI algorithm with
  ChatGPT", loses the recommendation line, and wraps its code on phones. The chart labels "My
  position" on the dot and "Position:" over 200+ and 31; the quota label sits on a dark backing
  and shows on phones. "At the Olympics nobody believed / I'd make the final" is two lines on desktop.
- **Scroll stops.** `lib/story/stops.ts` lists 15 moments; `lib/story/stopper.ts` eases a fast flick
  or trackpad fling into the next one and holds it until the next gesture (Lenis `virtualScroll` on
  desktop, a post-fling settle on touch, Space and Page Down step). Slow scrolling never notices
  them. Stops written in vh follow the set pieces; retune them there when a timeline changes.
- **Story media.** Story clips preload nothing and load 1.5 screens ahead, after the page has loaded.
  Only the cut that fits the screen is rendered (no more double request on phones), clips start
  from their first frame when they appear, and rewind out of sight.
- **Hero.** The loop is the film's own first 10.4 s with its commentary captions, cut on "Hey mom,
  I made it" (`scripts/encode-hero.sh`). It is chosen by aspect ratio (square cut on upright
  screens, a band below 3:2, full bleed above), autoplays from the markup once the page has loaded
  (so the poster stays the LCP) and retries on the first gesture. A centre play button with a slow
  pulse says "Watch the film, 53 seconds" and "See me on stage at Supernova".
- **Film.** Self-hosted HLS (`scripts/encode-film-hls.sh`, 360p to 1080p, 2 s segments) plays
  natively where possible and through a lazily loaded hls.js light elsewhere; the progressive files
  stay as the fallback. Phones go full screen on open; scroll is locked and restored exactly.
  `film.en.vtt` is transcribed from the burned-in text and loads hidden (it would double the burned
  English), feeding a transcript; a Dutch or French track would show by default. Closing mid-film
  leaves a mini player bottom left. Two more ways in: a card after the story and one beside the enquiry.
- **Practical part.** "More than an AI story" with one plain lead. The audience ruler is replaced by
  two stages, each a silent loop. Testimonials highlight their key phrases (`*...*` in the copy)
  and their logos sit in one fixed box. The header wears a frosted band wherever content scrolls
  under it, the enquiry stays in its own section, a big amber "Check my availability" closes the
  bio and the footer, a back-to-top button appears in the practical part, and the clip dialog fits
  its 9:16 video. The 1 km pace board is gone.

Measured on the production build (6 October 2026): first-load video 2.7 MB desktop, 1.6 MB phone
(was about 7 and 5 MB); Lighthouse mobile LCP 5.2 s simulated (was 7.1 s), 2.9 s with devtools
throttling, CLS 0, accessibility 100; JS 256 KB transferred including the film player's code,
which is prefetched after load. Still open: an iPhone check of the
full-screen film and the touch scroll stops, and `jh-film-start` in the privacy page once
analytics goes live.

Round 13b (6 October 2026): the small room is real footage now, a leadership lunch from March 2025
(`media/Videos/Small keynote videos`, five takes cut by `scripts/encode-video.sh stage <folder>` with
`STAGE_CRF="38 30 27"`, VMAF 90 to 93; 2.4 MB AV1). The film's card after the story moved into "The
keynote" section: a small silent preview beside the heading (the hero's own loop, already cached)
and one "Watch the film, 53 seconds" button. Testimonial highlights are bold only, no marker.

Round 13c (9 October 2026), a double check of every point. Scroll stops, measured on the production
build: a wheel or trackpad hold is now timed from the moment the page arrives on the stop (it used to
start when the stop was chosen, so a new gesture during the half-second glide could carry on past it),
and a stop the page has not reached still counts even if the target already passed it. A wheel spun
on and on is released 0.8 s after arriving. Touch may brake up to 10x harder than native momentum,
and a fling the finger dragged just past a stop lands just after it (within a quarter screen).
Results: trackpad flings, mouse wheel spins, Space, and touch flicks up to 3000 px/s each land on all
15 stops in order; slow scrolling is never held. On phones the quota label is a legend under the
years, and short phones start the chart lower. The back-to-top button steps aside for corner controls.

Round 13d (9 October 2026): the favicon is a round portrait from `final-arms` (hands on his head
down to the HEYMANS bib, both arms in frame), transparent around the circle at tab sizes and on the
night ground for the home screen and manifest (`node scripts/make-icons.mjs`). The flash between
"Dare to dream big" and "That's my story" is gone: the violet dim multiplies the photo, and fading
both together lifted the dim off a still-visible photo. Now the photo fades under the full dim, then
the dim goes, so the screen only gets darker (measured: luminance 75 down to 27, no step up).

## Round 14: John's review of 13 October 2026, a shorter story

Goal of the round: a visitor scrolls fast and still gets the concept, and is moved to book.

- **Story, 38 percent shorter** (1148 to 714 vh on desktop, 956 to 599 on touch): prologue, Iten (the
  graduation line now sits on the flight, the globe behind it at reduced opacity; the pack line appears
  whole), edge (one screen: "However, training hard wasn't enough. I needed an edge."), algorithm (title,
  then only the code of `media/ChatGPT code example.txt` being written; no prompt, no thinking), climb, final
  (straight from the chart to "Hey mom, made it", then "Dare to dream big"; the "nobody believed" and
  "impossible" screens and their photos are gone) and a 40 vh handover with no line. Nine stops
  (`lib/story/stops.ts`); measured on the production build: trackpad flings, wheel spins, Space and touch
  flicks up to 3000 px/s land on all nine. "Skip the story" lands on the lessons.
- **Practical part**: the five lessons open it (no motion, no credits on the cards; new photos for
  lessons 1 and 4), then the keynote with its film. Booked by runs as two rows in opposite directions.
  Testimonials bold the whole "I'm comparing you with the so-called top names in keynote speaking."
  About me has John's new text; the figures say 50+ keynotes (`lib/story/data/speaker.json`).
- **Enquiry**: five questions (name, company, email, phone optional, the event in a long field), with
  ALTCHA proof-of-work and the spam rules described in "Enquiry: captcha and spam" above.

Open: a
larger original of the lesson 4 photo (566 px wide, soft on phones); the new bio photo from John;
`ALTCHA_HMAC_KEY` in production.

Round 14b (13 October 2026): Iten sets the title left (low on phones) with the globe beside it at full
strength, so the flight reads and never runs behind a letter. The edge sentence gets line-height 1.04.
The lessons heading breaks after "That's the story." (a bar in the copy). `lesson-average.jpg` is
re-cut at 4:5 from the original, centred on John. Bram Vandenbroeck is credited for both new lesson photos.

### The film's two numbers

Four events measure the film (`lib/story/analytics.ts`, all with `from`: `hero`, `story`,
`enquiry` or `mini`): `film_impression` when a play button is properly on screen, `film_start`
when the film really plays, `film_progress` at 50 and 100 percent, and `film_to_enquiry` when the
enquiry is opened (`stage: opened`) or sent (`stage: sent`) after a film start in the same tab.

- **Start rate** = `film_start` / `film_impression`, per `from`. It says whether the button and its
  label make people want to watch. Low on the hero: work on the button, the label, the poster.
- **Completion** = `film_progress` with `pct: 100` / `film_start`. It says whether the film holds
  people. `pct: 50` against 100 shows where they leave. Low completion is the film's problem
  (its opening seconds), not the page's.
- Then `film_to_enquiry` / `film_start` is what the film is for: the share of viewers who go on
  to the enquiry. Compare it with the enquiry rate of visitors who never started the film.

Read them over weeks, not days: at a few hundred visits a month, single-day rates are noise.
Nothing is sent until the visitor allows statistics; sessionStorage keeps only where the film
was started (`jh-film-start`), so the enquiry can be credited to it.

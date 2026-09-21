# John Heymans, personal-brand website

Next.js 16 (App Router, Turbopack), GSAP 3.15 with ScrollTrigger and SplitText, Framer Motion 13.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The index lists the three concepts:

| Route | Concept |
|---|---|
| `/concept-a` | Velocity. Blue-black, motion-blur photography, Archivo condensed, Paris lavender. A race clock in the nav runs to his personal best as you scroll; the story runs sideways with the ranking line drawn across it. |
| `/concept-b` | Made it. Warm black, full-bleed photography, Big Shoulders. Bold element: the words on his arms, written on scroll. |
| `/concept-c` | Stadium. Black, black-and-white photography, Bodoni Moda capitals, one red line. The last lap: five frames, a finish line, and colour only when he crosses it. |

The design plan and the check against the brief are in `docs/concepts.md`.

## Where things live

- `lib/content.ts`: every string on the site, in one dictionary, ready for Dutch and French.
- `lib/photos.json` and `public/photos/`: the selected photographs with credits and captions. Belga Image files come only from the commercial-licence folder.
- `public/logos/`: the ten client logos, rendered monochrome by CSS filter.
- `components/shared/`: the booking modal, film modal, photo-with-credit component.
- `components/a`, `components/b`, `components/c`: one folder per concept. GSAP lives in `useGSAP` hooks with `gsap.matchMedia`, so reduced motion and phones get the finished state.
- `app/concept-*/`: route, per-concept fonts and stylesheet.

## Not yet in the repo

- The 60-second film. Drop it at `public/media/promo.mp4` and the film modals play it.
- The Supernova recording of the full keynote.
- Client logo files. Clients are set as wordmarks in type for now.
- A form backend. Submitting the enquiry shows the success state after a short delay.

## The current build: one continuous story at `/signal`

The film opens the page, autoplaying muted with one sound control. From there a single sticky stage carries eight cross-fading beats, from "they all said it couldn't be done" through Iten, the ChatGPT conversation that produced the race schedule, the doubters, the setbacks and the Olympic final. The ground then turns from night to paper for the keynote details, audience sizes, takeaways, audience clips, logos, testimonials, bio and booking.

Interface is a wordmark, one permanent enquiry button and a progress hairline.

- `components/signal/Story.tsx` holds the master scrubbed timeline. Default CSS is the stacked layout; the script adds `.is-cinema` on desktop when motion is allowed. Anything the timeline reveals must also be resolved in the mobile and reduced-motion branch.
- `public/media/hero.mp4` is an 18-second cut built from stills. Drop the real film in at that path and the hero is finished.
- `docs/round4-plan.md` holds the plan and both build logs. `docs/storytelling-teardown.md` is the analysis of the four reference sites the storytelling is based on.

## Round 6: the story site at `/story`

Built from `docs/build-brief.md`. One scrolling page that plays like a short film (nine beats on one sticky stage), then turns to paper for the keynote, proof, enquiry, bio and footer. Everything it needs lives in `components/story` and `lib/story`, so moving it to `/` at launch is one line in `app/page.tsx`: `export { default, metadata } from "./story/page";`.

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

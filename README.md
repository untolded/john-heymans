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
| `/concept-a` | Ranking. Light instrument panel, Archivo, Paris lavender. Bold element: the scroll-scrubbed world-ranking climb. |
| `/concept-b` | Made it. Warm black, full-bleed photography, Big Shoulders. Bold element: the words on his arms, written on scroll. |
| `/concept-c` | The log. Stone paper, Newsreader, cobalt ink. Bold element: the two years as a horizontal training log. |

The design plan and the check against the brief are in `docs/concepts.md`.

## Where things live

- `lib/content.ts`: every string on the site, in one dictionary, ready for Dutch and French.
- `lib/photos.json` and `public/photos/`: the selected photographs with credits and captions. Regenerate from `media/` if the selection changes.
- `components/shared/`: the booking modal, film modal, photo-with-credit component.
- `components/a`, `components/b`, `components/c`: one folder per concept. GSAP lives in `useGSAP` hooks with `gsap.matchMedia`, so reduced motion and phones get the finished state.
- `app/concept-*/`: route, per-concept fonts and stylesheet.

## Not yet in the repo

- The 60-second film. Drop it at `public/media/promo.mp4` and the film modals play it.
- The Supernova recording of the full keynote.
- Client logo files. Clients are set as wordmarks in type for now.
- A form backend. Submitting the enquiry shows the success state after a short delay.

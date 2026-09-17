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

# Design tokens

The settled decisions for the live page. Source of truth is `app/story.css`;
this file records what each value is for and why. The brand guide at
`/brand/fe331dc0ae83be5b`, and `docs/brand-guide.md` beside it, say the same
thing for people outside the codebase.

---

## Colour: locked

Approved by John on 22 September 2026, and unchanged by the typeface decision. Every one is
defined once, at the top of `app/story.css`, and nothing else in the codebase
should introduce a colour.

| Token | Hex | What it is for |
| --- | --- | --- |
| `--night` | `#070613` | The ground the story runs on, and the page background before paint |
| `--deep` | `#151038` | Where the ground lifts: Iten upward, the top of the night gradient |
| `--violet` | `#3a2c91` | Altitude, the stadium light, the multiply dim over photographs |
| `--lavender` | `#b9a8f5` | The machine voice: telemetry, chart guides, axis labels, placeholders |
| `--amber` | `#ff7a2f` | The one accent. Every action, every line that gets drawn, every underline |
| `--paper` | `#f3f1ea` | The sheet that rises for the keynote details, and all text on night |

Two support values exist because the accent and the text have to survive on
paper as well as on night:

| Token | Hex | What it is for |
| --- | --- | --- |
| `--ink` | `#141019` | Text on paper, and text inside the amber pill |
| `--amber-deep` | `#a8400d` | The accent on paper, where `--amber` would not hold contrast |

Everything else is one of these at an opacity: `--paper-72`, `--paper-85`,
`--ink-72`. The grounds in `.gl-*` and `.sb[data-ground]` are gradients built
from the same six.

The ChatGPT window is the deliberate exception. It uses ChatGPT's own neutrals
(`--gpt-bg: #212121` and friends) because the point of that set piece is that it
is recognisably not our page. The only accent inside it is the send button.

---

## Type: settled

John chose **Scoreboard** on 22 September 2026: Big Shoulders over Instrument
Sans, with Geist Mono for readouts. Its values are the defaults in
`.story-root`, and the display sizes absorbed the 1.12 scale it was reviewed
at, so the stylesheet states the real size.

| Token | Live value | What it controls |
| --- | --- | --- |
| `--d-face` / `--t-face` / `--m-face` | Big Shoulders / Instrument Sans / Geist Mono | Display, reading, readouts |
| `--d-wght` `-xl` `-mid` `-sm` | 700 / 800 / 650 / 600 | The four display weights |
| `--d-axes` `-xl` `-mark` `-board` | `"opsz" 72` throughout | Big Shoulders has no width axis |
| `--d-case` | `uppercase` | Human-voice headlines. Readouts are uppercase regardless |
| `--d-track` `-xl` `-sm` | −0.002em / −0.006em / 0 | Display tracking per step |
| `--d-scale` | `1` | Multiplies every display size, desktop and mobile |
| `--d-mark-div` | `5.4` | Divides the page width to size the footer wordmark |
| `--t-axes` / `--t-track` / `--t-scale` | `"wdth" 96` / −0.004em / 1 | The reading face |

The token layer stays because it is what makes a typeface swap a block of
values. The two faces John did not choose are frozen in
`app/archive/type/kits.css`, still running at `/archive/type`.

### Two rules the type depends on

**Line breaks must be identical before, during and after a reveal.** The rise
and ink reveals wrap every line in a block and then unwrap it. Two things keep
the breaks stable, and both are needed:

1. `.slot > .entry` fills its slot, so the max-widths below resolve against a
   definite width instead of shrink-wrapping to the longest line.
2. Nothing that gets split carries `text-wrap: balance` or `pretty`. Both
   regroup words at the last moment, and the split measures the plain greedy
   layout, so the words jump when the split reverts. This was the reported bug
   on "However, this wouldn't be enough": the word "this" moved between lines
   as the reveal finished.

Where greedy wrapping reads badly, the break is written into the copy with a
vertical bar, which `components/story/Text.tsx` turns into blocks:

```
"That's the story.|Here's what your team takes from it."
```

**Big Shoulders needs a hand-written fallback.** It is not in next/font's table
of fallback metrics, so `next build` warns and no size-adjusted stand-in is
generated. `app/story.css` declares one: `local("Arial")` at `size-adjust:
65.6%` with `ascent-override: 150.3%` and `descent-override: 32.7%`, measured
against the real font. With it, a headline rendered in the fallback is within
1.5% of the real width, so the swap does not re-wrap anything. The build
warning stays; it is expected.

---

## The brand guide

`/brand/fe331dc0ae83be5b` is the guide, unlisted: `noindex`, `Disallow:
/brand/` in `app/robots.ts`, and nothing links to it. `docs/brand-guide.md` is
the same document in writing. Its motion demos import `lib/story/reveals`
directly, so they cannot drift from the site.

Downloadable assets live in `public/brand/`: the three typefaces as variable
originals and as static instances cut at the brand's settings, the outlined
wordmark, the palette as CSS, JSON and an Adobe `.ase`, title-card and
lower-third templates, the grain tile and `motion-tokens.json`.
`scripts/build-brand-kit.sh` zips the lot; re-run it whenever an asset changes.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | The live page. The approved design, in the live type kit |
| `/brand/fe331dc0ae83be5b` | The brand guide, unlisted |
| `/archive` | Index of earlier rounds, `noindex` |
| `/archive/type` | The typeface review, with Scoreboard marked as chosen |
| `/archive/type/{trap,readout}` | The two typefaces that were not chosen, still running |
| `/archive/{signal,concept-a,concept-b,concept-c,brief}` | The earlier designs, unchanged |

`/story`, `/signal`, `/concept-*` and `/type/*` redirect permanently to their
new homes, so links already sent to John keep working.

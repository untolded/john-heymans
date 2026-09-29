# Text motion for Premiere Pro

Four of the site's reveals, for the films. Each one is rendered by the website's
own code, so type in the films moves exactly the way it moves on
johnheymans.com.

| Style | What it does | Use it for |
| --- | --- | --- |
| Rise | Lines rise from behind a mask, 0.07s apart | Titles and copy that reads as a sentence |
| Words | Words arrive one at a time, from 112% and out of focus | Title cards and the opening lines |
| Ink | Each line is written left to right with an amber nib | The line that lands, and the lessons |
| Flash | A message slides in from the right with one frame of paper border | What other people said: the federation, the coach, the rivals |

`examples/` has a short film of each one.

## The overlays

Every line the website animates with these four styles, as a video with a
transparent background, in 16:9 and 9:16:

```
rise-graduation-16x9.mov         words-two-years-16x9.mov       ink-best-runners-16x9.mov
rise-training-alone-16x9.mov     words-different-road-16x9.mov  ink-called-me-crazy-16x9.mov
rise-edge-16x9.mov               words-top-200-16x9.mov         ink-fastest-rise-16x9.mov
rise-ran-it-anyway-16x9.mov      words-used-ai-16x9.mov         ink-lesson-average-16x9.mov
rise-nobody-believed-16x9.mov    flash-federation-16x9.mov      ink-lesson-status-quo-16x9.mov
rise-underdog-16x9.mov           flash-coach-16x9.mov           ink-lesson-control-16x9.mov
                                 flash-competitors-16x9.mov     ink-lesson-pressure-16x9.mov
... and the same in 9x16, plus scrim-16x9.png and scrim-9x16.png
```

They are Apple ProRes 4444 at 25 fps, the frame rate of the keynote film.

**To use one:** import it and put it on a track above the footage. The
transparency comes with it; there is nothing to key.

**Timing.** The reveal starts on the first frame and the exit ends on the last,
with two seconds of hold in between. To hold longer, put the playhead in the
hold, right-click the clip and choose Insert Frame Hold Segment, then trim the
hold to length. Do not speed or slow the clip: the timing is the brand's.

**Over footage,** put `scrim-16x9.png` (or `scrim-9x16.png`) between the footage
and the type. It is the brand's gradient for type over footage.

**Size.** Use them at 100%. Scaling up softens the type; ask for a new render at
the size you need instead.

## New text

The overlays are made by a script in the website's repository. Send the line,
the style and the format to whoever maintains the site, or run it yourself:

```bash
npm i --no-save esbuild playwright-core     # once

node scripts/mogrt/render/render.mjs one words "Two years.|One algorithm." --format 9x16
```

A vertical bar breaks the line, as in the site's copy, in Flash messages too.
Options:

- `--format 16x9` or `9x16`
- `--type display` (Big Shoulders, capitals) or `sentence` (Instrument Sans)
- `--role lesson` for Ink at the size of the site's lesson cards
- `--size 100` as a percentage of the brand size
- `--placement centre` or `bottom-left` (on the safe margin)
- `--background none`, `scrim`, `night` or `paper` (on paper the type turns to ink)
- `--exit blur`, `rise` or `cut`
- `--hold 2` in seconds
- for Flash: `--sender "My coach" --initial C --time now`, and the text is the message

To render a whole set, list the lines in `scripts/mogrt/render/overlays.json`
and run `node scripts/mogrt/render/render.mjs overlays`. Everything lands in
`media/premiere-overlays/`. A line that breaks badly on the narrow 9:16 frame
can have its own breaks there, as `text_9x16`.

## Editable templates (.mogrt)

`scripts/mogrt/build-mogrts.jsx` builds the same four styles as Motion Graphics
templates, where the text is edited inside Premiere's Essential Graphics panel.
It needs After Effects to build them; they are not made yet.

## Keep it on brand

- One thing moves at a time. Let the type land before you cut or move the camera.
- One amber thing on screen at a time. Ink's nib counts.
- Fonts, if you set any type by hand: the static instances in the brand kit's `fonts/` folder.
- The grain is not in the overlays. Add the brand kit's `texture/grain.png` as an
  overlay at 3.5%, as the brand guide describes.

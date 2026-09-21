# How the reference sites are built, and what we take

Measured on 20 September 2026 by loading each site, reading the rendered DOM, computed styles and script bundles. This is the basis for the rebuild of the John Heymans page into one continuous story.

---

## 1. seasats.com, the closest model for us

**Stack.** Next.js with GSAP. No smooth-scroll library, so the browser's own scrolling is used and everything hangs off scroll position.

**Numbers that matter.** The page is 34,212 pixels tall, about 38 screens. It holds 34 sticky elements, 84 elements with a `clip-path`, 26 autoplaying muted looping videos and 5 canvases running image sequences.

**The mechanic that makes it feel like one film.** There is a single element, fixed to the viewport, sitting behind everything: `ThemeBackground`. It never unmounts. Sections carry `data-theme` and `data-theme-top` attributes, and as each passes the top of the screen, that one background element changes colour. The navigation carries `data-inversed` and flips with it. Nothing ever "ends" and nothing "begins". The ground under the content simply changes colour.

**How media and copy relate.** Media is sticky and copy scrolls over it. The hero media stays pinned while the text column scrolls through it. Further down, a pinned list of six statements sits beside a sticky animation, and as each statement becomes active a small labelled image card appears next to it. The copy never sits in a box below an image; it always sits over or beside media that is already on screen.

**Video as a living still.** Twenty-six short muted loops, all autoplaying, none with a poster frame. They are used the way photographs would be used. That is what removes the "slideshow" feeling.

**Reveals.** Eighty-four clip-path elements means almost every appearance is a mask wipe rather than a fade. Masked reveals read as film; fades read as a website.

## 2. usavionix.com, the long scroll

**Stack.** Next.js, pure black body, Geist and Geist Mono only.

**Numbers.** 64,664 pixels tall, about 72 screens, for a site with very little text. Four canvases, no video elements at all.

**The mechanic.** The aircraft is not a video and not a 3D model in the browser. It is a rendered image sequence drawn frame by frame into a fixed, full-screen canvas, scrubbed by scroll. Layers are fixed and full-viewport (`z-scroll-sequence`), and the copy is a thin layer above them.

**What to take.** Give each beat a lot of scroll distance. Roughly one and a half to two screens of scrolling per idea. That slowness is most of the cinema. Also: the loader is part of the film, and the interface is almost absent, two items in the nav.

## 3. unitedcarriers.com, the graphic layer

**Stack.** Webflow with Three.js for the globe, a custom cursor using `mix-blend-mode`, marquees, 16 sticky elements.

**The mechanic.** One hero object, the globe, rendered in WebGL with labels floating over it. Headlines fade line by line as you scroll, giving the impression that the sentence is being spoken rather than displayed. A theme attribute on the header switches the nav between light and dark as sections pass.

**What to take.** Type that reveals line by line with the top line already gone dim, so the eye is always moving down the sentence. And one graphic system, used throughout, rather than decoration that changes per section.

## 4. lisa.locomotive.ca, the single object

**Stack.** Locomotive's own module system on top of Next, one full-screen fixed canvas, the page itself only one screen tall.

**The mechanic.** The whole site is one object you interact with, gated behind a click. Not a scrolling page at all.

**What to take.** The gate. One deliberate action from the visitor before the experience starts. For us, the equivalent is turning the sound on.

---

## 5. What the four have in common

1. **One persistent background layer** that changes colour and media rather than a stack of sections with their own backgrounds.
2. **Media is sticky, copy moves.** The screen holds still while the story advances.
3. **Long scroll distance per idea.** One to two screens per beat.
4. **Masked reveals, not fades.**
5. **Short muted loops used as stills.**
6. **Almost no interface.** Two or three permanent items, a progress indicator, and nothing else.
7. **Theme attributes**, set per section, driving the colour of the persistent layer and inverting the nav.

None of them has a traditional menu. All of them have a permanent way to contact the company.

---

## 6. How that maps onto John's page

The problem with the current build is exactly the one John described: it is eleven sections stacked on top of each other, each with its own background, each starting and ending. The fix is structural, not decorative.

- The story becomes **one sticky stage**. The stage holds every beat's media, stacked as layers, cross-fading into each other. The viewer never sees a section boundary between the opening line and the Olympic final.
- Each beat gets **about one and a half screens of scroll**. Eight beats, roughly twelve screens, then the practical part.
- The **background colour is one element** that travels from night violet through to the paper white of the practical part. The nav inverts with it.
- **Reveals are masks and wipes**, matching the data-layer language: lines draw, panels wipe, type rises behind a mask.
- The **interface is a wordmark and one button**, which is what John asked for, plus a progress hairline.
- The **practical part deliberately breaks the spell**: the ground turns to paper, the motion calms down, and the page becomes a place to read facts and book a date. That contrast is the point, and it is where the section boundary is allowed to show.

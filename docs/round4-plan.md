# Round 4 plan: one concept, built for the "wow"

Written for Maarten, to take into the next conversation with John. Date: 20 September 2026.

John's verdict: structure and content are right, none of the three has the wow. His test is whether a buyer paying a premium fee is impressed on sight. His words: it feels like a website, not like a big story.

The diagnosis is that all three concepts are **pages about a story** rather than **the story itself**. They open with a headline and a photo, then explain. The sites he pointed at open with a moving object and make you watch it before they tell you anything. That is the change.

**Recommendation: stop presenting three options. Build one concept to a high finish.** Three half-finished directions read as three compromises. One direction, made properly, is what a premium buyer sees.

---

## 1. What the reference sites actually do

| Site | The move to steal |
|---|---|
| usavionix.com | Full-screen object, almost no interface. A loader that says "calibrating", then the aircraft over terrain. Nav is two items. The product performs; the page explains later. |
| seasats.com | Full-bleed video behind a quiet serif headline. Then a pinned list of six statements where the active line lights up and a labelled image card pops in beside it. Lines of meaning, not paragraphs. |
| unitedcarriers.com | Dark to deep-blue gradient, one enormous stat per screen, headline type that fades line by line. Colour is a glow, not a fill. |
| lisa.locomotive.ca | A single interactive object you must click to start. The site is the experience. |

Common to all four: **one moving thing on screen at a time, almost no body copy, and interface reduced to nearly nothing.** None of them uses a top menu in the traditional sense.

---

## 2. The concept: Signal

**The idea in one line.** John's edge was an algorithm reading the sport as data. So the site shows the human footage with the algorithm's data layer drawn over it, live, as you scroll.

Every section is footage of John or his audience. Over that footage sits a thin lavender data layer: race markers, a ranking line, a schedule grid, split times. The layer behaves like a system watching the athlete. It is the thing nobody else in the speaker market has, it makes the AI visible without a word of explanation, and it turns his five lessons into a spectacle instead of a text block.

**Why this answers the feedback**
- The AI becomes the visual identity, not a sentence in a paragraph.
- The footage does the talking, so the text can drop by half.
- It gives the page a single memorable device, which is what "wow" means in practice.

---

## 3. Colour and type

Black and white is out. The palette is night violet with one warm signal colour. It comes from the Paris 2024 track, which is lavender, and from a stadium at night.

```
--night     #070613   ground, almost black with violet in it
--deep      #151038   panels and the second layer of the gradient
--violet    #3A2C91   the glow behind the hero and section transitions
--lavender  #B9A8F5   the data layer: lines, markers, the ranking curve
--amber     #FF7A2F   the one action colour: CTAs, the live moment, the sound toggle
--paper     #F5F3FF   all body text
```

Two colours with two jobs, which keeps it disciplined: **lavender is the algorithm, amber is the human decision.** Text is paper on night at roughly 15:1 contrast, so reading is effortless.

**Type.** Display stays a heavy condensed face, which John never objected to. Body moves up to 20px with a 34rem measure and 1.6 line height, and never sits directly on a busy photo. Every text block over footage gets a solid scrim, not a soft gradient. That is the readability fix.

---

## 4. The page, screen by screen

Roughly eight screens, down from fifteen. No section exists unless it earns its screen.

```
1  FILM            Full-bleed keynote film, autoplaying, muted, loud "Sound on" control.
                   Two lines of type. A scroll cue. Nothing else.
2  PROMISE         One sentence on black-violet: what the room gets. 12 words.
3-7 FIVE LESSONS   Five full screens. Each: the business lesson as the headline,
                   footage behind, one line of story, the data layer marking the moment.
8  THE ALGORITHM   The set piece. Scroll-scrubbed: race options appear, the model picks
                   the schedule, the ranking line climbs to qualification.
9  THE ROOM        The seven vertical testimonial clips, playing, in a moving wall.
10 BOOKED BY       Ten logos, quiet, one row.
11 ENQUIRE         Big, simple, one form.
```

**Bio lives in a drawer.** A small "Who is John" button, fixed next to the enquiry CTA, slides in a panel with the short bio and the hard numbers: Olympic 5000m finalist in Paris, eleventh in the world, 13:03.46 personal best, qualified on a schedule an algorithm chose. The page stays about the keynote; the proof is one click away. This is where the deleted stats section goes.

### The hero, in detail

John asked whether the film should be first and whether it can autoplay with sound. My answer: **yes to first, no to sound by default, and here is why.** Every browser blocks autoplay with sound, and it would simply not play. Muted autoplay always plays. So:

- The film fills the screen from the first frame, already running.
- An amber "Sound on" control sits over it, large, impossible to miss. One click unmutes and restarts from the top.
- The film is the page's first screen, not a button. There is no way to arrive and not see it.

### The five lessons

This is the part event buyers actually buy. Each screen leads with the lesson, in business language, and keeps the athletics as the short supporting line.

| | Lesson on screen | Story line under it |
|---|---|---|
| 1 | Your environment sets your ceiling | Iten, Kenya. 2,400 m. Training with people who were better than me. |
| 2 | Consistency beats intensity | Africa's best are not training harder. They are training every day. |
| 3 | The edge is where the consensus isn't | I built a model that picked my races. My federation, my coach and my rivals all said no. |
| 4 | Control what you can control | Illness, weather, injury, against sleep, food and training. |
| 5 | Big goals set the height of the ceiling | Two words on each arm at the Olympic final. |

Five screens, roughly 25 words each. That alone is most of the 50% cut.

### The algorithm set piece

The one place the site gets technical, told with motion instead of text. Pinned for about three screens:

1. A calendar grid of the season appears, every race a lavender dot.
2. Dots that cost ranking points dim. The model's chosen races light amber.
3. The ranking line climbs from outside the quota to inside it, the qualifying line crossing in amber.
4. One line of copy lands: the fastest rise in the sport's history, on a schedule everyone advised against.

### The testimonial wall

The seven clips from Supernova are perfect for this: vertical, 9 to 49 seconds, real faces with lanyards and a microphone, shot in daylight. They run as a wall of portrait cards, muted and playing, drifting slowly. Click one and it takes the screen with sound.

| Clip | Length |
|---|---|
| 03 | 9 s |
| 04 | 15 s |
| 07 | 18 s |
| 01 | 26 s |
| 05 | 44 s |
| 02 | 48 s |
| 06 | 49 s |

The three short ones lead the wall, because a nine-second clip is watched to the end.

They are already prepared. The originals are 1080x1920 H.264, 376 MB in total, now in `media/Videos`. Web versions at 720x1280 with poster frames are in `public/videos`, 28 MB for all seven, which is light enough to autoplay several at once.

---

## 5. The menu question

**Drop the top bar.** John's instinct is right and all four reference sites agree. Replace it with:

- a hairline scroll progress line at the very top, lavender;
- one fixed amber pill, bottom right: "Check availability";
- a small "Who is John" link beside it, opening the bio drawer;
- full navigation in the footer, where it belongs.

Sections then fill the screen with nothing competing for attention.

---

## 6. What I need from John

The concept depends on footage. This is the critical path.

1. **The keynote film.** The whole hero is built on it. Nothing else can carry screen one. If the 60-second film is not ready, the best stand-in is a 20 to 30 second cut of the Supernova stage recording.
2. **The Supernova keynote recording**, even as a rough file, both as the hero stand-in and for the full-talk link.
3. **Subtitles for the seven clips.** The audience speaks Dutch. English buyers need subtitles, and I need a transcript, or permission to draft one from the audio, to caption them correctly. Everything else about the clips is ready.
4. **The real ranking data**, or a good approximation: which races the model picked, dates, points, and where he stood before and after. The set piece is much stronger with true numbers.
5. **Confirmation of the three headline numbers** for the bio drawer: Olympic final placing, personal best, and how the qualification was secured.

Without 1 and 2 the hero cannot be finished, and the hero is the whole point of this round.

---

## 7. Build sequence

1. Palette, type and the data-layer system, applied to one screen so the look can be judged early.
2. The hero with whatever film exists, including the sound control.
3. The five lesson screens.
4. The algorithm set piece.
5. The testimonial wall, using the clips already in the repo.
6. Bio drawer, logos, enquiry, footer.
7. Pass for readability, phone layout, reduced motion and keyboard access.

The three current concepts stay online for reference. The new one gets its own address, and the brief page becomes a short note pointing John at it.

---

## 8. What to say to John

Short version for the next message to him:

> We took the feedback as a reset rather than a tweak. One direction, not three. The film now opens the site full screen and plays by itself, with one button for sound. The five lessons each get their own screen, so an event buyer sees what their audience gets without reading a paragraph. The algorithm that got you to Paris is now something people watch happening, which is the part no other speaker can show. Your audience's own words carry the proof, straight from the Supernova clips. Your story is one click away, so the page stays about the keynote. We need the film file to finish screen one.


---

## 9. Build status, 20 September 2026

Signal is built and running at `/signal`. The brief page at `/` now leads with it, and the three earlier concepts stay below for reference.

**In place**
- Film hero, autoplaying muted, with a large sound control that unmutes and restarts from the top.
- Five lesson screens, lesson first, one line of story, a lavender bracket and reading over the footage.
- The algorithm scene, pinned over about four screens: the season of races, the ones that cost points, the model's picks, and the ranking climb to the quota line.
- The room: the seven Supernova clips playing in a drifting wall that stops when you point at it, click for sound.
- Client logos, both written testimonials with portraits and organisation marks, enquiry form.
- Bio drawer behind "Who is John", holding the short introduction and the four numbers.
- No top menu. A lavender progress hairline, one orange enquiry pill and the bio button, which appear once the film has had the first screen.

**Verified in the browser:** hero autoplays muted and unmutes on click, seven clips play at once, the clip lightbox plays with sound, the drawer and the enquiry form open and trap focus, no console errors, reduced motion shows every end state, and the phone layout keeps clear of the fixed buttons.

**The stand-in film.** `public/media/hero.mp4` is an 18-second cut built from six stills with slow pans and cross-fades, 2.2 MB. It exists so the hero behaves exactly as it will with the real film. Replace that one file and the page is finished.

---

## 10. Round 5, 20 September 2026: the story rebuild

John's second round of feedback: the page still read as separate sections rather than one unfolding story, the navigation needed a wordmark and a permanent button, the AI had to be shown as an actual ChatGPT conversation, and the keynote practicalities had to be on the page.

The teardown of his four reference sites is in `docs/storytelling-teardown.md`. The short version: they all use one persistent background layer, sticky media with copy moving over it, one to two screens of scroll per idea, masked reveals, and almost no interface.

**What the page does now**

1. **Hero.** The film, full screen, autoplaying muted, with the wordmark and one button above it, a single line of copy, a sound control and a scroll cue.
2. **One sticky stage, eight beats.** The stage holds every beat's media as layers that cross-fade into each other. There are no section boundaries between the opening line and the Olympic final.
   - They all said it couldn't be done
   - Iten, Kenya, with the flight drawn across the screen and the altitude counting from 76 m to 2,400 m
   - It still wasn't enough, I needed an edge
   - The ChatGPT conversation: the prompt types itself, the answer streams, the compute lines scramble, and the schedule wipes in
   - My federation, my coach and my rivals say no, then the ranking answers with two flashes
   - Setbacks, and the short list of what he could control lighting up
   - The Olympic village and the decision to enjoy it
   - The final, where "Hey mom" and "Made it" are written across his arms, closing on "Dare to dream big"
3. **The handover.** The ground moves from night to paper over half a screen, which is the deliberate break John asked for.
4. **The practical part.** Length, languages, format, who it is for at four audience sizes, the five takeaways, the Supernova recording, the audience clips, client logos and both written testimonials.
5. **Biography** with four numbers, then the enquiry and the footer.

**Interface.** A wordmark, one permanent button, and a progress hairline. Nothing else. The nav inverts when the ground turns to paper.

**Verified:** desktop cinema mode and the stacked phone layout both resolve every end state, reduced motion shows the whole story statically, no console errors, production build clean.

**Copy.** Everything visible is draft-ready. Two things need John's confirmation before launch: the three lines attributed to his federation, coach and rivals, and the claim that 212 meets were scored.

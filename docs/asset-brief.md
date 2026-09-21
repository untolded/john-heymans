# Asset brief: what the story site still needs

Written for Maarten, to collect from John, the film editor and the photographers. Date: 21 September 2026.

The build brief (`docs/build-brief.md`) describes how the site will be built. This document lists every asset and fact it depends on, what already exists in the repo, and exactly what to get for everything else. Each item has an ID; the build brief refers to the same IDs.

**Priority**
- **P0**: that part of the site cannot be finished properly without it. The fallback works but looks visibly weaker, or a fact cannot be shown at all.
- **P1**: strongly improves the "wow".
- **P2**: nice to have.

---

## 1. The short version

If you only chase eight things this week, chase these, in this order:

1. **The clean hero loop (`F2`)** from the film editor: 12 to 20 seconds of the promo film with no text in it. Without it, the hero has to dodge the film's own titles.
2. **John's world ranking history (`A4`)** and **the races the algorithm chose (`A3`)**. The whole algorithm set piece runs on this data.
3. **How the algorithm worked, and the real ChatGPT conversation (`A1`, `A2`)**, plus **the source for "fastest rise in the sport's history" (`A5`)**.
4. **Photos from Iten (`K1`)** and **the trip facts (`K3`)**. There is not a single Kenya image in the repo.
5. **Photos in the Olympic village (`V1`)**. None in the repo either.
6. **The facts to confirm (`O3`, `B2`, `S4`, `D1`, `S1`)**: final placing, personal best, qualification date, what the doubters said, the real setbacks.
7. **English subtitles for the seven audience clips (`F9`)**.
8. **The enquiry email and legal details (`L1`, `L2`)**, needed before launch.

---

## 2. How to deliver

**Where.** Put everything in `media/story/`, one folder per group:

```
media/story/
  film/         F1 to F9
  iten/         K1 to K4
  algorithm/    A1 to A5
  doubters/     D1, D2
  setbacks/     S1 to S4
  village/      V1, V2
  final/        O1 to O3
  practical/    P1 to P5
  bio/          B1, B2
  legal/        L1 to L3
  brand/        X1 to X3
```

**Names.** `<ID>-<short-description>-<photographer>.<ext>`, for example `K1-group-run-dawn-@johnphone.jpg` or `V1-dining-hall-teamgenk.jpg`. Keep the original file as it came off the camera or phone; the site makes its own web versions.

**Credits and rights.** Each folder gets a `credits.txt` with one line per file: file name, who took it (real name or Instagram handle), date, place, and whether it may be used on a commercial website. If you do not know the photographer, write "unknown" and we will not use it until you do. Only licensed Belga images may be used: the six in `media/photos/01_Commercial License Pics` are cleared; any other Belga image needs a new licence.

**Big files.** GitHub refuses files over 100 MB, and the repo already carries 1.8 GB of photos. For the film master and raw b-roll, put the files on a shared drive and write the link in `media/story/film/README.md`. Claude Code will download them, make the web versions and commit only those. (Alternatively, set up Git LFS for `media/story/film/`.)

**Facts and data.** Fill in the templates in section 5 as CSV or plain text files. For anything John remembers roughly but cannot prove, write "approximate" next to it. We will only show what is confirmed.

---

## 3. What already exists (no need to resend)

| What | Where | Used for |
|---|---|---|
| Stand-in hero film, 18 s, built from stills | `public/media/hero.mp4` | Placeholder until `F1` and `F2` arrive |
| Seven Supernova audience clips, web versions with posters | `public/videos/testimonial-01` to `07` | The clip wall in the practical part |
| 43 photos with credits and captions | `public/photos`, `lib/photos.json` | Throughout |
| Of which six licensed Belga Image photos from Paris 2024 and Apeldoorn 2025 | `final-arms`, `final-pan`, `final-help`, `heats-pack`, `lavender-race`, `race-orange` | The final beat |
| Supernova stage photos | `stage-wide`, `stage-lookup` and others (Jelle Jansegers, Raf Thomas) | The practical part |
| Ten client logos (SVG) | `public/logos` | Proof |
| Two written testimonials with portraits and logos | `public/testimonials`, `lib/content.ts` | Proof |
| The keynote facts and background | `background.md` | Copy |

**Good news on the final beat.** The licensed photo `final-arms` shows "HEY MOM" and "MADE IT" clearly on his arms, sharp enough to trace. The handwriting effect can be built from it; no extra close-up is required.

**A question for John.** In `final-arms` and `lavender-race` he wears a beaded bracelet in red, green, black and white. If it came from Iten, the site can use it as a small visual link between the Kenya chapter and the final. Worth asking.

---

## 4. The asset list

### 4.1 Film and video

| ID | What | Priority |
|---|---|---|
| F1 | Promo film, final master with final sound | P0 |
| F2 | Clean hero loop, landscape | P0 |
| F3 | Clean hero loop, vertical | P1 |
| F4 | Captions for the film | P0 for launch |
| F5 | Poster frames | P1 |
| F6 | Timecodes of the film's on-screen text | P0 if no `F2` |
| F7 | Clean b-roll takes from the promo shoot | P1 |
| F8 | Supernova keynote recording and an excerpt | P1 |
| F9 | English subtitles and consent for the seven audience clips | P0 |

**F1. Promo film master.** The finished 60-second film, as the editor's highest-quality export: 3840 × 2160 or 1920 × 1080, ProRes 422 HQ or H.264 at 20 Mbit/s or more, stereo final mix. Also the credit wording the production wants (director, production company, commentator). It plays in full, with sound, when a visitor clicks "Watch the film with sound". *Fallback: the current stand-in.*

**F2. Clean hero loop, landscape.** This is the most important request. The film plays muted behind the first screen, and Maarten noted that it contains text, which will clash with our line. Ask the editor for a separate cut:
- 12 to 20 seconds, 16:9, same grade as the film;
- **no burned-in titles, captions, logos or lower thirds**;
- mostly movement and John, no hard cut to black;
- loopable: the last frame matches the first, or the editor builds in a short crossfade;
- the same export quality as `F1`.

*Fallback: `F1` muted, with our text fading out whenever the film shows its own (needs `F6`).*

**F3. Clean hero loop, vertical.** The same brief as `F2`, reframed for phones at 1080 × 1920 so John is not cut off. Most first visits from LinkedIn will be on a phone. *Fallback: a centre crop of `F2`, which may lose him at the edges.*

**F4. Captions for the film.** An `.srt` or `.vtt` file in English with exact timings; Dutch and French later. Required for accessibility. *If the editor cannot supply it, we draft from the audio and John approves.*

**F5. Poster frames.** The still that shows before the video starts, for `F2` and `F3`. Just name the timecode you want; we can extract it.

**F6. Timecodes of on-screen text.** Only needed if `F2` does not come. For every title or caption in `F1`: start second, end second, and where on screen it sits (for example "0:04 to 0:07, bottom centre").

**F7. Clean b-roll from the promo shoot.** Continuous takes of 5 to 15 seconds with no cuts and no text, graded, 4K or 1080p. The site turns continuous takes into scroll-driven sequences, as Seasats does with its boat footage. Useful shots, in order of value:
- **F7a**: John running towards the camera or alongside it, ideally in low light (the background of "They all said it couldn't be done").
- **F7b**: hands on a laptop keyboard, a screen glow on his face (the move into the ChatGPT scene).
- **F7c**: a slow push-in on his face (the "I needed an edge" beat).
- **F7d**: any long tracking shot on a track.

*Fallback: the story beats run on photographs and type.*

**F8. Supernova keynote recording.** The private link to the full talk, plus a 20 to 40 second excerpt with sound of a strong moment, 1920 × 1080. It plays in the practical part to show him on stage.

**F9. The seven audience clips.** The web versions exist. What is missing:
- English subtitles (`.vtt`) for each clip, because the audience speaks Dutch and English-speaking buyers cannot follow;
- each speaker's name, role and organisation, if they agree to be named;
- confirmation that every person agreed to appear on the website.

*If no transcripts exist, we can draft subtitles from the audio for John to approve.*

### 4.2 Iten, Kenya

| ID | What | Priority |
|---|---|---|
| K1 | Photos from Iten | P0 |
| K2 | Video clips from Iten | P1 |
| K3 | The trip facts, optional boarding pass | P0 for facts, P2 for the image |
| K4 | A run recording at altitude | P2 |

**K1. Photos from Iten.** Six to ten photos, landscape and portrait, sharp phone photos are fine: John training with Kenyan athletes, a group run on the red roads, the track, the camp, the landscape and the escarpment, the "Home of Champions" gate at the entrance to Iten if he has it. There is no Kenya imagery in the repo at all. *Fallback: the flight and altitude animation carry the chapter and the training part becomes text only.*

**K2. Video from Iten.** Any phone clips of group runs or training, 5 to 15 seconds, as steady as possible, 1080p or better. One good continuous clip becomes the scroll-driven sequence behind "So I trained with the best, and learned their ways."

**K3. The trip facts.** Where he flew from, where he landed, how he got to Iten (for example via Nairobi and Eldoret), the dates of the first trip, how long he stayed, how often he went back. The flight path on the globe is drawn from these facts. A photo of the booking confirmation or boarding pass, with personal details blacked out, would be a nice detail given he "impulsively booked a flight".

**K4. A run recorded at altitude.** A screenshot from Strava, Garmin or similar of a run in Iten that shows the altitude. Optional.

### 4.3 The algorithm

| ID | What | Priority |
|---|---|---|
| A1 | The real ChatGPT conversation and first prompt | P0 |
| A2 | How the algorithm worked, in John's words | P0 |
| A3 | The race data: candidates and chosen races | P0 |
| A4 | World ranking history and the quota line | P0 |
| A5 | The source for "fastest rise in the sport's history" | P0 |

This is the centre of John's story and the site's main set piece. It runs on real data. Placeholder data will never be shown to visitors, so without these files the set piece shows shapes without numbers.

**A1. The ChatGPT conversation.** The export (ChatGPT, Settings, Data controls, Export data) or screenshots of the conversation where he started building the algorithm, and the actual first prompt he typed. The site recreates the interface in its own design, so the screenshots are for accuracy, not for display. Until confirmed, the site uses the storyline's prompt: "Build an algorithm that gets me to the Olympics."

**A2. How it worked.** Five to ten bullet points in John's words: what went in (the competition calendar, meeting categories, ranking point tables, his own level), what it optimised, what came out, what it was built in (Python, a spreadsheet, ChatGPT's code, something else), roughly how many meetings it evaluated. The round 5 build shows "212 meets scored"; that number is not confirmed and will not be shown until John confirms or corrects it.

**A3. The race data.** One row per meeting in the qualifying window that the algorithm considered. Template in section 5.1. Transcribing from the World Athletics calendar and his results page is fine.

**A4. The world ranking history.** His position and score over time, from before he started the plan until after he qualified, plus the Olympic quota cut-off and the qualification window dates. Template in section 5.2. Screenshots of his World Athletics profile are fine; we transcribe.

**A5. The source for the record rise.** The site says, in John's voice, that his was the fastest rise up the world rankings in his sport's history. We need where that comes from: an article, a statement by the federation or World Athletics, or who calculated it and how. It is the strongest claim on the site, so it must have a source.

### 4.4 The doubters and the rise

| ID | What | Priority |
|---|---|---|
| D1 | What the federation, the coach and the competitors said | P0 |
| D2 | Real news headlines about the rise and the qualification | P1 |

**D1. The three messages.** What his federation, his coach and his fellow competitors said about the plan, in a sentence each. Paraphrased is fine. John must approve the wording and agree that they appear as anonymous messages from "My federation", "My coach" and "My competitors". No names and no screenshots of real chats. The round 5 lines ("That is not how qualification works." and so on) are drafts, not quotes. *Fallback: all three say "That will never work.", as in the storyline.*

**D2. News headlines.** Three to six real articles about his rise and his qualification: outlet, date, the headline exactly as published, language, and the link. A PDF or screenshot helps us check. We set the headlines in our own type; outlet logos are only used with permission. *Fallback: the chart and the record line without headlines.*

### 4.5 Setbacks and qualification

| ID | What | Priority |
|---|---|---|
| S1 | The real setbacks, with dates | P0 |
| S2 | Photos: a hard moment, and sleep, nutrition, training | P2 |
| S3 | Real readouts for sleep, nutrition, training | P2 |
| S4 | The qualification: date, how, proof | P0 for the facts |

**S1. The setbacks.** Two to four real setbacks in the period (illness, injury, a bad race), each with the month and year, one sentence in John's words, and whether he is happy for it to be named. They appear as dips in the ranking line. *Fallback: the dips are shown without labels or dates.*

**S2. Photos.**
- **S2a**, a hard moment: exhausted, in the rain, alone. The existing `track-lying` (Arthur Vermeylen) can stand in, but it is from 2025; a photo from the actual period is better.
- **S2b**, the controllables: sleep and recovery, a real meal, a training session. This can be a small new shoot, in colour.

**S3. Real readouts.** Anything he tracked in that period: average sleep, training volume, recovery scores from Garmin, Whoop, Strava or a training log. Shown small under the words sleep, nutrition and training. Optional; nothing is shown without it.

**S4. The qualification.** The date he qualified, how (his position inside the ranking quota), and proof: a screenshot of the World Athletics list or the federation's selection announcement. A photo from that day if one exists.

### 4.6 The Olympic village

| ID | What | Priority |
|---|---|---|
| V1 | Photos of John in the village, enjoying it | P0 |
| V2 | Short phone videos from the village | P2 |

**V1. Village photos.** The storyline asks for "a photo of him smiling and enjoying the journey". There is none in the repo. Anything true works: in the village, the dining hall, with teammates, on the balcony, walking to training. Phone photos are fine; landscape and portrait both useful; name who took each one. Check that the photos may be used on a commercial website (village photography rules, and the rights of whoever took them). Olympic rings may appear in the background but will not be used as a graphic. *Fallback: `lavender-race` (licensed, Paris heats), which is Paris but not the village.*

**V2. Village videos.** Short vertical clips, 5 to 15 seconds. Optional.

### 4.7 The final

| ID | What | Priority |
|---|---|---|
| O1 | A higher-resolution close-up of the arm writing | P2 |
| O2 | More licensed images of the final | P2 |
| O3 | The result, confirmed | P0 |

**O1. Arm close-up.** Not needed: `final-arms` already works. If Belga has a tighter frame of the writing in a licence John can buy, or John has his own photo from that morning, it improves the opening shot.

**O2. More images of the final.** The start line, a wide shot of the stadium, John right after the finish, if Belga can license them. Olympic broadcast footage (the television feed) is not usable without a broadcast licence, so do not spend time on it unless the promo film already licensed some.

**O3. The result.** Confirm: the Games (Paris 2024), the date of the final (10 August 2024), his final placing (the repo says 11th), his time, and his 5000m personal best (the repo says 13:03.46) with where and when he set it.

### 4.8 The practical part

| ID | What | Priority |
|---|---|---|
| P1 | Missing client logos as SVG, with permission | P1 |
| P2 | Approved short testimonials, names if agreed | P1 |
| P3 | Photos of John in a small-room setting | P2 |
| P4 | The keynote facts confirmed | P1 |
| P5 | A one-page speaker sheet (PDF) | P2 |

**P1. Logos.** Vector SVG files, approved for display, for White & Case, Cobepa and The Merode, and for any of the ten existing logos that is out of date. Every logo must be named, never captioned by category.

**P2. Testimonials.** The two written testimonials cut to pull-quotes of 25 to 40 words, approved by the authors, with their names if they agree (currently only their roles are shown), and confirmation that their portraits may be used.

**P3. Small-room photos.** John speaking at a boardroom table, a dinner or a workshop. The practical part says he is as comfortable at a table of eight as on a main stage; a photo proves it. Optional.

**P4. Keynote facts.** Confirm the formats he offers (keynote, keynote with Q&A, workshop), whether he travels abroad, typical lead time, the languages (English, Dutch, French), and any technical needs.

**P5. Speaker sheet.** A one-page PDF buyers can forward internally. Optional.

### 4.9 Biography

| ID | What | Priority |
|---|---|---|
| B1 | A recent colour portrait with room for text | P2 |
| B2 | The bio facts confirmed | P0 |

**B1. Portrait.** Landscape 3:2 and portrait 4:5, in colour, with space beside him for text. The existing `outdoor-portrait` (Arthur Vermeylen) works if nothing newer exists.

**B2. Bio facts.** Confirm the four numbers shown in the bio (final placing, personal best, two years from decision to final, number of keynotes, currently "15+") and anything to add: bio-engineering degree, whether he still competes.

### 4.10 Contact and legal

| ID | What | Priority |
|---|---|---|
| L1 | The enquiry email, and DNS access for sending | P0 |
| L2 | Legal details and a privacy policy | P0 for launch |
| L3 | Social handles confirmed | P1 |

**L1. Enquiry email.** The repo uses `hello@johnheymans.com`. Confirm it exists and someone reads it. The enquiry form sends email through a provider (Resend is the default choice), which needs access to the DNS of `johnheymans.com` to add two records.

**L2. Legal.** His company or self-employed number (KBO/BCE), a registered address if he wants it shown, and either a privacy policy text or permission for us to draft one covering the enquiry form.

**L3. Socials.** Confirm Instagram `@heymans.john` and the LinkedIn profile URL in `lib/content.ts`.

### 4.11 Brand, sound and sharing

| ID | What | Priority |
|---|---|---|
| X1 | A wordmark or logo, if one exists | P2 |
| X2 | Sound: film stems, an ambient bed and effects, optional voice lines | P2 |
| X3 | The image for social sharing | P1 |

**X1. Wordmark.** If John has a logo, send it as SVG. Otherwise the site sets his name in the display type, which is the plan.

**X2. Sound.** Sound is off by default and only plays if the visitor turns it on. For launch the film's own sound is enough. If there is budget for more:
- the music and sound-design stems of the promo film, if its licence covers the website;
- a quiet ambient bed and four effects (keyboard typing, a notification tone, a low swell, a stadium crowd) from a licensed library such as Artlist or Epidemic Sound;
- optionally, John recording eight to ten short lines in his own voice. This would be the most personal asset on the site; it can follow after launch.

**X3. Sharing image.** Pick the still from the film that should appear when the site is shared on LinkedIn. We compose it at 1200 × 630 with the hero line.

---

## 5. Templates

### 5.1 Race data (`A3`), as `media/story/algorithm/races.csv`

```
date,meet,city,country,category,considered,chosen,place,time,ranking_points,notes
2023-05-20,Example Meeting,Example City,BEL,C,yes,yes,2,13:25.10,1180,approximate
```

One row per meeting the algorithm looked at. `considered` and `chosen` are yes or no. Leave result columns empty for meetings he did not run. The example row is fictional and shows the format only.

### 5.2 Ranking history (`A4`), as `media/story/algorithm/ranking.csv`

```
date,world_rank,ranking_score,event,source
2023-01-03,,,"5000m","World Athletics profile screenshot"
```

One row per date you have (weekly or monthly is fine). Then add, as a separate text file `quota.txt`: the qualification window dates, the number of quota places for the 5000m, and his position on the final list.

### 5.3 Facts to confirm (`K3`, `D1`, `S1`, `S4`, `O3`, `B2`), as `media/story/facts.md`

```
Trip to Iten
  Flew from:
  Via:
  Dates of first trip:
  Length of stay:

The three messages (paraphrase, approved by John: yes/no)
  My federation:
  My coach:
  My competitors:

Setbacks (month/year, one sentence, may we name it: yes/no)
  1.
  2.

Qualification
  Date:
  How:
  Proof (file name):

Result
  Games and venue:
  Date of final:
  Final placing:
  Final time:
  5000m personal best, where and when:

Bio numbers
  Keynotes delivered:
  Anything to add:
```

---

## 6. What we source ourselves

No action needed for: the world map for the flight animation (Natural Earth data, public domain), fonts (Archivo and Geist, open licences), icons, the Iten altitude (2,400 m, from `background.md`), city coordinates (checked at build time), and the favicon (made from the wordmark).

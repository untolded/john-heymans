import Image from "next/image";
import { content } from "@/lib/content";
import { fill, plain } from "@/lib/story/format";
import { photo, type PhotoSlug } from "@/lib/photos";
import { clipCaptions, filmAssets } from "@/lib/story/assets";
import { lessonEntry } from "@/lib/story/script";
import { photoAlt } from "../StoryPhoto";
import { Enquiry } from "../Enquiry";
import { LessonLink } from "./Actions";
import { Stages } from "./Stages";
import { Quotes } from "./Quotes";
import { ClipWall } from "./ClipWall";
import { LogoMarquee } from "./LogoMarquee";
import { PracticalMotion } from "./PracticalMotion";
import { FilmEntry } from "../media/FilmEntry";
import { KeynoteFilm } from "../media/KeynoteFilm";

const c = content.story;
const p = c.practical;

/**
 * Each lesson's frame: John in the moment it comes from. The section is still on purpose (no
 * reveals, no push) and the frames carry no credit: the footer names every photographer.
 * focus is the object-position that keeps John in the 4:5 card on desktop and phone.
 */
const FRAMES: { slug: PhotoSlug; focus: string }[] = [
  { slug: "lesson-average", focus: "50% 30%" },
  { slug: "kit-portrait", focus: "50% 22%" },
  { slug: "shoes", focus: "52% 45%" },
  { slug: "lesson-pressure", focus: "50% 100%" },
  { slug: "final-arms", focus: "46% 24%" },
];

function Frame({ n }: { n: number }) {
  const f = FRAMES[n - 1];
  return (
    <span className="lf-art lf-photo">
      {/* Sized for the crop, not the card: a landscape photo cut down to a portrait card must be
          about twice as wide as the card to stay sharp. */}
      <Image src={photo(f.slug).src} alt={photoAlt(f.slug)} fill sizes="(min-width: 992px) 40vw, 150vw" quality={85} style={{ objectPosition: f.focus }} />
    </span>
  );
}

/**
 * The practical part. The story is over and the spell breaks on purpose:
 * paper ground, calm motion, facts. Its motion (PracticalMotion) also plays
 * the bio and the footer. The five lessons (straight after "Dare to dream
 * big", still), the keynote, where it works, who booked it, what the room
 * said, and the enquiry.
 */
export function Practical() {
  const film = filmAssets();
  return (
    <div className="practical" data-ground="paper">
      <PracticalMotion />

      {/* First after the story, and still: the lessons are read, not performed. */}
      <section className="pr pr-lessons" id="lessons" aria-labelledby="pr-lessons">
        <h2 id="pr-lessons" className="pr-h3" tabIndex={-1}>
          {/* Two lines, as written: "That's the story." on its own, the promise under it. */}
          {p.lessonsTitle.split("|").map((line) => (
            <span className="pr-h-line" key={line}>
              {line}
            </span>
          ))}
        </h2>
        <p className="pr-lead">
          {p.lessonsLead}
        </p>
        <ol className="filmstrip">
          {c.lessons.map((lesson, i) => {
            const n = i + 1;
            const inStory = !!lessonEntry(n);
            return (
              <li className="lf" key={lesson.title}>
                {inStory ? (
                  <LessonLink n={n} className="lf-link" label={fill(p.lessonBack, { n })}>
                    <Frame n={n} />
                  </LessonLink>
                ) : (
                  <div className="lf-link">
                    <Frame n={n} />
                  </div>
                )}
                <p className="lf-title">
                  {plain(lesson.title)}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="pr pr-keynote" id="keynote" aria-labelledby="pr-keynote">
        {/* The heading and, beside it, the film: what a booker sees right after the lessons. */}
        <div className="pr-keynote-head">
          <h2 id="pr-keynote" className="pr-h2" data-reveal="rise">
            {p.title}
          </h2>
          <KeynoteFilm loop={film.loop} poster={film.poster} />
        </div>
        {/* Three lanes, marked out like a track seen from above. The lines draw in (data-draw). */}
        <div className="pr-lanes" data-draw="x">
          <dl className="pr-facts">
            {p.facts.map((f) => (
              <div className="pr-fact" key={f.line} data-draw="y">
                <dt className="pr-figure" data-reveal="rise">
                  {f.figure}
                </dt>
                <dd data-reveal="fade">{f.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pr pr-scale" aria-labelledby="pr-scale">
        <h3 id="pr-scale" className="pr-h3" data-reveal="rise">
          {p.scaleTitle}
        </h3>
        <Stages />
      </section>

      <section className="pr pr-proof" id="proof" aria-labelledby="pr-proof">
        <h2 id="pr-proof" className="pr-h2" data-reveal="rise">
          {p.proofTitle}
        </h2>
        <LogoMarquee />
        <Quotes />
      </section>

      <ClipWall captions={Object.fromEntries(["01", "02", "03", "04", "05", "06", "07"].map((id) => [id, clipCaptions(id)]))} />

      <section className="pr pr-enquiry" id="enquiry" aria-labelledby="pr-enquiry">
        <div className="pr-enquiry-copy">
          <h2 id="pr-enquiry" className="pr-h2" data-reveal="rise">
            {c.enquiry.title}
          </h2>
          <p className="pr-lead" data-reveal="fade">
            {c.enquiry.intro}
          </p>
          <FilmEntry at="enquiry" />
        </div>
        <Enquiry context="inline" />
      </section>
    </div>
  );
}

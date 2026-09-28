import Image from "next/image";
import { content } from "@/lib/content";
import { fill, plain } from "@/lib/story/format";
import { photo, type PhotoSlug } from "@/lib/photos";
import { clipCaptions } from "@/lib/story/assets";
import { lessonEntry } from "@/lib/story/script";
import { photoAlt, photoCredit } from "../StoryPhoto";
import { Enquiry } from "../Enquiry";
import { LessonLink } from "./Actions";
import { AudienceScale } from "./AudienceScale";
import { Quotes } from "./Quotes";
import { ClipWall } from "./ClipWall";
import { LogoMarquee } from "./LogoMarquee";
import { PracticalMotion } from "./PracticalMotion";

const c = content.story;
const p = c.practical;

/** Each lesson's frame: John in the moment it comes from. */
const FRAMES: { slug: PhotoSlug; focus: string }[] = [
  { slug: "iten", focus: "50% 30%" },
  { slug: "kit-portrait", focus: "50% 22%" },
  { slug: "shoes", focus: "52% 45%" },
  { slug: "lavender-race", focus: "50% 30%" },
  { slug: "final-arms", focus: "58% 24%" },
];

/** A lesson's photo, its credit set in the corner of the frame. */
function Frame({ n }: { n: number }) {
  const f = FRAMES[n - 1];
  const credit = photoCredit(f.slug);
  return (
    <>
      <span className="lf-art lf-photo">
        <Image src={photo(f.slug).src} alt={photoAlt(f.slug)} fill sizes="(min-width: 992px) 20vw, 72vw" style={{ objectPosition: f.focus }} />
      </span>
      {credit && <span className="lf-credit">{credit}</span>}
    </>
  );
}

/**
 * The practical part. The story is over and the spell breaks on purpose:
 * paper ground, calm motion, facts. The keynote, the five lessons, where it
 * works, who booked it, what the room said, and the enquiry.
 */
export function Practical() {
  return (
    <div className="practical" data-ground="paper">
      <PracticalMotion />

      <section className="pr pr-keynote" id="keynote" aria-labelledby="pr-keynote">
        <h2 id="pr-keynote" className="pr-h2" data-reveal="rise">
          {p.title}
        </h2>
        {/* Three lanes, marked out like a track seen from above. The lines draw in (data-draw). */}
        <div className="pr-lanes" data-draw="x">
          <dl className="pr-facts">
            {p.facts.map((f) => (
              <div className="pr-fact" key={f.line} data-draw="y">
                <dt className="pr-figure" data-reveal="rise">
                  {f.figure}
                </dt>
                <dd data-reveal="rise">{f.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pr pr-lessons" aria-labelledby="pr-lessons">
        <h3 id="pr-lessons" className="pr-h3 pr-h3-long" data-reveal="rise">
          {p.lessonsTitle}
        </h3>
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
                <p className="lf-title" data-reveal="ink">
                  {plain(lesson.title)}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="pr pr-scale" aria-labelledby="pr-scale">
        <h3 id="pr-scale" className="pr-h3 pr-h3-long" data-reveal="rise">
          {p.scaleTitle}
        </h3>
        <AudienceScale />
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
          <h2 id="pr-enquiry" className="pr-h2" data-reveal="ink">
            {c.enquiry.title}
          </h2>
          <p className="pr-lead">{c.enquiry.intro}</p>
        </div>
        <Enquiry context="inline" />
      </section>
    </div>
  );
}

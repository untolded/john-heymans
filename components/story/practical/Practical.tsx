import Image from "next/image";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { photo } from "@/lib/photos";
import { clipCaptions } from "@/lib/story/assets";
import { StoryPhoto, photoAlt, photoCredit } from "../StoryPhoto";
import { ItenMapSvg } from "../set-pieces/ItenMap";
import { SeasonGridSvg } from "../set-pieces/SeasonGrid";
import { Enquiry } from "../Enquiry";
import { LessonLink } from "./Actions";
import { AudienceScale } from "./AudienceScale";
import { Quotes } from "./Quotes";
import { ClipWall } from "./ClipWall";
import { PracticalMotion } from "./PracticalMotion";

const c = content.story;
const p = c.practical;

/** Each lesson's frame: a still from its chapter, as the story drew it. */
function Frame({ n }: { n: number }) {
  switch (n) {
    case 1:
      return (
        <div className="lf-art lf-iten">
          <ItenMapSvg labels={false} />
          <span className="lf-readout">{fill(c.iten.altitude, { n: "2,400" })}</span>
        </div>
      );
    case 2:
      return (
        <div className="lf-art lf-grid">
          <SeasonGridSvg vertical />
        </div>
      );
    case 3:
      return (
        <div className="lf-art lf-columns" aria-hidden="true">
          <ul className="lf-cannot">
            {c.setback.uncontrollable.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <ul className="lf-can">
            {c.setback.controllable.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      );
    case 4:
      return (
        <div className="lf-art lf-photo">
          <Image src={photo("lavender-race").src} alt={photoAlt("lavender-race")} fill sizes="(min-width: 992px) 20vw, 70vw" style={{ objectPosition: "50% 30%" }} />
        </div>
      );
    default:
      return (
        <div className="lf-art lf-photo">
          <Image src={photo("final-arms").src} alt={photoAlt("final-arms")} fill sizes="(min-width: 992px) 20vw, 70vw" style={{ objectPosition: "58% 24%" }} />
        </div>
      );
  }
}

const FRAME_CREDIT: Record<number, string | null> = { 1: null, 2: null, 3: null, 4: photoCredit("lavender-race"), 5: photoCredit("final-arms") };

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
        <p className="pr-lead" data-reveal="rise">
          {p.lead}
        </p>
        <dl className="pr-facts">
          {p.facts.map((f) => (
            <div className="pr-fact" key={f.line} data-reveal="rise">
              <dt className="pr-figure">{f.figure}</dt>
              <dd>{f.line}</dd>
            </div>
          ))}
        </dl>
        <p className="pr-format" data-reveal="rise">
          {p.format}
        </p>
      </section>

      <section className="pr pr-lessons" aria-labelledby="pr-lessons">
        <h3 id="pr-lessons" className="pr-h3" data-reveal="rise">
          {p.lessonsTitle}
        </h3>
        <ol className="filmstrip">
          {c.lessons.map((lesson, i) => (
            <li className="lf" key={lesson.title}>
              <LessonLink n={i + 1} className="lf-link" label={fill(p.lessonBack, { n: i + 1 })}>
                <Frame n={i + 1} />
                <span className="lf-n" aria-hidden="true">
                  {fill(c.lessonOf, { n: i + 1, total: c.lessons.length })}
                </span>
              </LessonLink>
              {FRAME_CREDIT[i + 1] && <p className="lf-credit">{FRAME_CREDIT[i + 1]}</p>}
              <p className="lf-title" data-reveal="ink">
                {lesson.title}
              </p>
              <p className="lf-line">{lesson.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pr pr-scale" aria-labelledby="pr-scale">
        <h3 id="pr-scale" className="pr-h3" data-reveal="rise">
          {p.scaleTitle}
        </h3>
        <p className="pr-lead" data-reveal="rise">
          {p.scaleLead}
        </p>
        <AudienceScale />
      </section>

      <section className="pr pr-proof" id="proof" aria-labelledby="pr-proof">
        <h2 id="pr-proof" className="pr-h2" data-reveal="rise">
          {p.proofTitle}
        </h2>
        <ul className="logos">
          {content.proof.logos.map((l) => (
            <li key={l.slug}>
              <Image
                src={`/logos/${l.slug}.svg`}
                alt={l.name}
                width={200}
                height={80}
                unoptimized
                style={{ height: `${p.logoHeights[l.slug as keyof typeof p.logoHeights] ?? 2.6}rem`, width: "auto" }}
              />
            </li>
          ))}
        </ul>
        <p className="pr-note">{p.proofNote}</p>
        <Quotes />
      </section>

      <ClipWall captions={Object.fromEntries(["01", "02", "03", "04", "05", "06", "07"].map((id) => [id, clipCaptions(id)]))} />

      <section className="pr pr-recording" aria-label={p.recording}>
        <StoryPhoto slug="stage-wide" sizes="100vw" className="rec-photo" focus="50% 35%" />
        <p className="rec-line" data-reveal="rise">
          {p.recording}
        </p>
      </section>

      <section className="pr pr-enquiry" id="enquiry" aria-labelledby="pr-enquiry">
        <h2 id="pr-enquiry" className="pr-h2" data-reveal="ink">
          {c.enquiry.title}
        </h2>
        <p className="pr-lead">{c.enquiry.intro}</p>
        <Enquiry context="inline" />
      </section>
    </div>
  );
}

import Image from "next/image";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { photo, type PhotoSlug } from "@/lib/photos";
import { clipCaptions } from "@/lib/story/assets";
import { StoryPhoto, photoAlt, photoCredit } from "../StoryPhoto";
import { Enquiry } from "../Enquiry";
import { LessonLink } from "./Actions";
import { AudienceScale } from "./AudienceScale";
import { Quotes } from "./Quotes";
import { ClipWall } from "./ClipWall";
import { PracticalMotion } from "./PracticalMotion";

/** Each logo's own proportions (from its SVG), so its width is known before it loads and the row never reflows. */
const LOGO_SIZE: Record<string, [number, number]> = {
  ypo: [433, 163],
  kbc: [320, 320],
  dell: [58, 33],
  engie: [78, 28],
  "sd-worx": [128, 41],
  duvel: [676, 312],
  unizo: [200, 92],
  warande: [46, 38],
  garrincha: [751, 100],
  supernova: [163, 25],
};

const c = content.story;
const p = c.practical;

/** Each lesson's frame: John in the chapter it comes from. */
const FRAMES: { slug: PhotoSlug; focus: string }[] = [
  { slug: "iten", focus: "50% 30%" },
  { slug: "kit-portrait", focus: "50% 22%" },
  { slug: "shoes", focus: "52% 45%" },
  { slug: "lavender-race", focus: "50% 30%" },
  { slug: "final-arms", focus: "58% 24%" },
];

function Frame({ n }: { n: number }) {
  const f = FRAMES[n - 1];
  return (
    <div className="lf-art lf-photo">
      <Image src={photo(f.slug).src} alt={photoAlt(f.slug)} fill sizes="(min-width: 992px) 20vw, 72vw" style={{ objectPosition: f.focus }} />
    </div>
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
              {photoCredit(FRAMES[i].slug) && <p className="lf-credit">{photoCredit(FRAMES[i].slug)}</p>}
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
                width={LOGO_SIZE[l.slug]?.[0] ?? 200}
                height={LOGO_SIZE[l.slug]?.[1] ?? 80}
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

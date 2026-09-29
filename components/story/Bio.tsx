import Image from "next/image";
import { content } from "@/lib/content";
import { photo } from "@/lib/photos";
import { facts, show, mark } from "@/lib/story/data";
import { fill, ordinal } from "@/lib/story/format";
import { Social } from "@/components/shared/Social";
import { photoAlt, photoCredit } from "./StoryPhoto";

const b = content.story.bio;
const STAGE = photo(b.photo);

type Figure = { value: string; label: string; marker: "" | "pending" | "placeholder" };

/** The four figures, each only when its fact may be shown. */
function figures(): Figure[] {
  const out: Figure[] = [];
  const placing = show(facts.result.placing);
  if (placing != null) out.push({ value: ordinal(placing), label: b.figures.placing, marker: mark(facts.result.placing) });
  const pb = show(facts.result.personalBest);
  if (pb) out.push({ value: pb, label: b.figures.pb, marker: mark(facts.result.personalBest) });
  const years = show(facts.speaker.yearsToFinal);
  if (years != null) out.push({ value: fill(b.years, { n: years }), label: b.figures.years, marker: mark(facts.speaker.yearsToFinal) });
  const keynotes = show(facts.speaker.keynotes);
  if (keynotes != null) out.push({ value: String(keynotes), label: b.figures.keynotes, marker: mark(facts.speaker.keynotes) });
  return out;
}

/**
 * The short bio, kept secondary as John asked: after the keynote details.
 * One photograph carries it: John on the Supernova stage, mid-sentence, full
 * bleed and dark between two paper sections, like a cut back to the story.
 * The copy sits in the shadow to his left; the figures run along the bottom
 * as a results strip, under an amber finish line that draws in.
 */
export function Bio() {
  const list = figures();
  const credit = photoCredit(b.photo);
  return (
    <section className="bio" id="about" data-ground="night" aria-labelledby="bio-title">
      <div className="bio-media">
        <div className="bio-photo" data-push>
          <Image src={STAGE.src} alt={photoAlt(b.photo)} fill sizes="(min-width: 992px) 84vw, 100vw" quality={85} />
        </div>
        <div className="bio-scrim" />
        {credit && <p className="bio-credit">{credit}</p>}
      </div>
      <div className="bio-copy">
        <h2 id="bio-title" className="pr-h2" data-reveal="rise">
          {b.title}
        </h2>
        {b.body.map((para) => (
          <p className="bio-p" key={para} data-reveal="fade">
            {para}
          </p>
        ))}
        <div className="bio-social" data-reveal="fade">
          <p className="bio-follow">{b.follow}</p>
          <Social variant="full" />
        </div>
      </div>
      {list.length > 0 && (
        <dl className="bio-board" data-draw="x">
          {list.map((f) => (
            <div key={f.label} className="bio-figure" data-reveal="fade" data-marker={f.marker ? content.story.dev[f.marker] : undefined}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

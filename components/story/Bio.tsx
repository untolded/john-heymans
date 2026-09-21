import { content } from "@/lib/content";
import { facts, show, mark } from "@/lib/story/data";
import { fill, ordinal } from "@/lib/story/format";
import { Social } from "@/components/shared/Social";
import { StoryPhoto } from "./StoryPhoto";

const b = content.story.bio;

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

/** The short bio, kept secondary as John asked: after the keynote details. */
export function Bio() {
  const list = figures();
  return (
    <section className="bio" id="about" data-ground="paper" aria-labelledby="bio-title">
      <StoryPhoto slug="outdoor-portrait" sizes="(min-width: 992px) 38vw, 100vw" className="bio-photo" focus="50% 30%" />
      <div className="bio-copy">
        <h2 id="bio-title" className="pr-h2" data-reveal="rise">
          {b.title}
        </h2>
        {b.body.map((para) => (
          <p className="bio-p" key={para}>
            {para}
          </p>
        ))}
        {list.length > 0 && (
          <dl className="bio-figures">
            {list.map((f) => (
              <div key={f.label} className="bio-figure" data-marker={f.marker ? content.story.dev[f.marker] : undefined}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="bio-social">
          <p className="bio-follow">{b.follow}</p>
          <Social variant="full" />
        </div>
      </div>
    </section>
  );
}

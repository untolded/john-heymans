"use client";

import Image from "next/image";
import { content } from "@/lib/content";
import { photo } from "@/lib/photos";
import { Logos } from "@/components/shared/Logos";
import { Quote } from "@/components/shared/Quote";
import { Room } from "./Room";

const t = content.signal.practical;

/**
 * The spell breaks here on purpose: the ground turns to paper, the motion
 * calms down, and the page becomes a place to read facts and book a date.
 */
export function Practical() {
  return (
    <div className="practical" id="keynote" data-theme="paper">
      <section className="keynote wrap" aria-labelledby="keynote-title">
        <div className="keynote-head">
          <h2 id="keynote-title" className="display d-xl" data-rise>{t.title}</h2>
          <p className="lede" data-reveal>{t.lead}</p>
        </div>

        <dl className="facts">
          {t.facts.map((f) => (
            <div className="fact" key={f.label} data-reveal>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <h3 className="display d-l section-h" data-rise>{t.audienceTitle}</h3>
        <ul className="audience">
          {t.audience.map((a) => (
            <li className="audience-item" key={a.title} data-reveal>
              <span className="audience-size">{a.size}</span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="display d-l section-h" data-rise>{t.takeawayTitle}</h3>
        <ol className="takeaways">
          {t.takeaways.map((k) => (
            <li className="takeaway" key={k.n} data-reveal>
              <span className="takeaway-n">{k.n}</span>
              <div>
                <strong>{k.title}</strong>
                <p>{k.line}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="recording" data-reveal>
          <Image src={photo("stage-wide").src} alt="John on stage at Supernova, Antwerp" fill sizes="100vw" />
          <p className="recording-copy">{t.recording}</p>
          <span className="photo-credit recording-credit">Photo {photo("stage-wide").credit}</span>
        </div>
      </section>

      <Room />

      <section className="proof wrap" id="proof" aria-labelledby="proof-title">
        <div className="proof-head">
          <h2 id="proof-title" className="display d-l" data-rise>{content.proof.title}</h2>
          <p className="note" data-reveal>{content.proof.footnote}</p>
        </div>
        <Logos />
        <div className="quotes">
          {content.proof.quotes.map((q) => <Quote key={q.org} q={q} />)}
        </div>
      </section>
    </div>
  );
}

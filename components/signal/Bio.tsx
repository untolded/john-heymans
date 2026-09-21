"use client";

import { content } from "@/lib/content";
import { Photo } from "@/components/shared/Photo";

const t = content.signal.bio;

/** The bio, after the keynote details: the page is about the talk first. */
export function Bio() {
  return (
    <section className="bio wrap" id="about" data-theme="paper" aria-labelledby="bio-title">
      <div className="bio-grid">
        <Photo slug="outdoor-portrait" alt="John Heymans on the track" sizes="(min-width: 992px) 40vw, 100vw" className="bio-photo" credit="below" />
        <div className="bio-copy">
          <h2 id="bio-title" className="display d-xl" data-rise>{t.title}</h2>
          <p className="bio-role" data-reveal>{t.role}</p>
          {t.body.map((p) => <p className="body" key={p} data-reveal>{p}</p>)}
          <ul className="bio-stats">
            {t.stats.map((st) => (
              <li key={st.label} data-reveal>
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { Photo } from "@/components/shared/Photo";
import type { PhotoSlug } from "@/lib/photos";

/**
 * The bold element of Concept C. The two years as a training log laid out
 * sideways: the section pins and vertical scroll travels along the line.
 * The entry crossing the centre is the one being written. Phones and
 * reduced motion get the same log as a vertical list.
 *
 * Dates are approximate and are marked as such in the copy.
 */
type Entry = { when: string; note: string } | { photo: PhotoSlug; alt: string };

const ENTRIES: Entry[] = [
  { when: "Graduation, during Covid", note: "Bio-engineering degree finished into a lockdown. No plan for the next year." },
  { when: "The week after", note: "One-way ticket to Iten, Kenya. 2,400 metres above sea level." },
  { when: "Iten", note: "Training with people who were better than me. Every day. Nothing spectacular, ever." },
  { photo: "xc-run", alt: "John running in a cross country race" },
  { when: "Twenty-four months to Paris", note: "The decision. An Olympic final, or nothing worth writing down." },
  { when: "A laptop, Belgium", note: "Built a model to pick the races that move a world ranking. Its first schedule looks wrong to everyone." },
  { when: "Federation, coach, competitors", note: "All advise against it. Ran the schedule anyway." },
  { when: "The season", note: "Points where nobody expected points. The fastest climb up the rankings the sport has recorded." },
  { photo: "track-lying", alt: "John lying on the track after a session" },
  { when: "A bad block", note: "Illness. Separated what I controlled from what I did not, and kept the schedule." },
  { when: "Qualification", note: "Inside the Olympic quota." },
  { when: "Olympic Village, Paris", note: "Two kinds of athlete. Chose which one to be." },
  { when: "10 August 2024, Stade de France", note: "5000m final. Two words on each arm." },
  { photo: "final-walk", alt: "John waving to the crowd after the Olympic final" },
  { when: "Now", note: "The same two years, in thirty minutes, for teams that need to perform this year." },
];

export function Log() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".log-track")!;
      const entries = gsap.utils.toArray<HTMLElement>(".entry", root.current);
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".log-stage",
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        entries.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: travel,
            start: "left 62%",
            end: "right 38%",
            toggleClass: { targets: el, className: "is-now" },
          });
        });
        return () => entries.forEach((el) => el.classList.add("is-now"));
      });
      mm.add(`not all and ${DESKTOP}, not all and ${MOTION_OK}`, () => {
        entries.forEach((el) => el.classList.add("is-now"));
      });
    },
    { scope: root },
  );

  return (
    <section className="log" id="log" ref={root} aria-labelledby="log-title">
      <div className="log-head wrap">
        <h2 id="log-title" className="display display-l">The log. Two years, one line at a time.</h2>
        <p className="note">Scroll to travel along it.</p>
      </div>
      <div className="log-stage">
        <div className="log-line" aria-hidden="true" />
        <ol className="log-track">
          {ENTRIES.map((e, i) =>
            "photo" in e ? (
              <li key={i} className="entry is-photo">
                <Photo slug={e.photo} alt={e.alt} sizes="(min-width: 992px) 30rem, 80vw" />
              </li>
            ) : (
              <li key={i} className="entry">
                <p className="entry-when">{e.when}</p>
                <span className="entry-gap" aria-hidden="true" />
                <p className="entry-note">{e.note}</p>
              </li>
            ),
          )}
        </ol>
      </div>
      <div className="log-foot wrap">
        <p className="note">Dates approximate. The full log, with the parts that hurt, is in the keynote.</p>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { Photo } from "@/components/shared/Photo";
import { photo, type PhotoSlug } from "@/lib/photos";

/**
 * The bold element of Concept C. One pinned scene, the last 400 metres.
 * Five black-and-white frames cross-fade as you scroll, each carrying one
 * part of the keynote. A red finish line travels in from the right and the
 * distance counter runs down. On the last frame he crosses the line and the
 * page shows colour for the first time. Phones and reduced motion get the
 * frames stacked, the last one in colour.
 */
const FRAMES: { slug: PhotoSlug; alt: string; metres: number }[] = [
  { slug: "budapest-line", alt: "Athletes waiting on the start line", metres: 400 },
  { slug: "tokyo-pack", alt: "John in the pack", metres: 300 },
  { slug: "pan-2", alt: "John at full speed, motion blurred", metres: 200 },
  { slug: "lavender-race", alt: "John racing in Paris", metres: 100 },
  { slug: "final-arms", alt: "John after the Olympic final, hands on his head", metres: 0 },
];

export function LastLap() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const frames = gsap.utils.toArray<HTMLElement>(".lap-frame", root.current);
      const caps = gsap.utils.toArray<HTMLElement>(".lap-caption", root.current);
      const finish = root.current!.querySelector<HTMLElement>(".lap-finish")!;
      const dist = root.current!.querySelector<HTMLElement>("[data-metres]")!;
      const mm = gsap.matchMedia();
      const lastImg = frames[frames.length - 1].querySelector("img")!;
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        // Initial state is set explicitly so a re-run (React dev double mount) never inherits the finished state.
        frames.forEach((f, i) => gsap.set(f, { opacity: i === 0 ? 1 : 0 }));
        caps.forEach((c, i) => gsap.set(c, { opacity: i === 0 ? 1 : 0, y: 0 }));
        gsap.set(finish, { left: "100%" });
        gsap.set(lastImg, { filter: "grayscale(1) contrast(1.08) brightness(0.75)" });
        dist.textContent = "400";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".lap-stage",
            start: "top top",
            end: "+=450%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const metres = Math.round(400 * (1 - Math.min(1, self.progress / 0.9)));
              dist.textContent = String(metres);
            },
          },
        });
        const step = 1 / FRAMES.length;
        frames.forEach((f, i) => {
          if (i === 0) return;
          tl.to(f, { opacity: 1, duration: step * 0.35 }, i * step - step * 0.1);
          tl.to(caps[i - 1], { opacity: 0, y: -10, duration: step * 0.2 }, i * step - step * 0.15);
          tl.fromTo(caps[i], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: step * 0.25 }, i * step + step * 0.05);
        });
        tl.to(finish, { left: "50%", duration: 0.9 }, 0);
        tl.to(lastImg, { filter: "grayscale(0) contrast(1) brightness(0.92)", duration: 0.1 }, 0.9);
        return () => {
          frames.forEach((f, i) => gsap.set(f, { opacity: i === frames.length - 1 ? 1 : 0 }));
          caps.forEach((c, i) => gsap.set(c, { opacity: i === caps.length - 1 ? 1 : 0 }));
          gsap.set(lastImg, { filter: "none" });
          dist.textContent = "0";
        };
      });
      mm.add(`not all and ${DESKTOP}, not all and ${MOTION_OK}`, () => { dist.textContent = "0"; });
    },
    { scope: root },
  );

  const chapters = content.chapters;

  return (
    <section className="lap" id="story" ref={root} aria-labelledby="lap-title">
      <h2 id="lap-title" className="sr-only">The last lap: five parts of the keynote</h2>
      <div className="lap-stage" aria-hidden="true">
        <div className="lap-frames">
          {FRAMES.map((f) => (
            <div key={f.slug} className="lap-frame"><Photo slug={f.slug} alt="" sizes="100vw" credit="hidden" /></div>
          ))}
        </div>
        <span className="lap-finish" />
        <div className="lap-hud">
          <div className="lap-distance">
            <p className="numeral"><span data-metres>400</span><small>m to go</small></p>
          </div>
          <div />
          <div className="lap-captions">
            {chapters.map((c) => (
              <div key={c.n} className="lap-caption">
                <p className="display display-l">{c.title}</p>
                <span className="ital">{c.tease}</span>
                <p className="label">{c.hook}</p>
              </div>
            ))}
          </div>
        </div>
        <span className="lap-credit">Photos {Array.from(new Set(FRAMES.map((f) => photo(f.slug).credit))).join(", ")}</span>
      </div>
      {/* Phones and reduced motion: the same five frames, stacked. */}
      <ol className="lap-list wrap">
        {chapters.map((c, i) => (
          <li key={c.n}>
            <Photo slug={FRAMES[i].slug} alt={FRAMES[i].alt} sizes="100vw" className="bw" />
            <p className="display display-l">{c.title}</p>
            <p className="lede" style={{ marginTop: "0.5rem" }}>{c.tease}</p>
            <p className="label" style={{ marginTop: "0.5rem" }}>{c.hook}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

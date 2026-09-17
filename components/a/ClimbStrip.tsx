"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { Photo } from "@/components/shared/Photo";
import type { PhotoSlug } from "@/lib/photos";

/**
 * The bold element of Concept A. The five chapters stand side by side and
 * the section pins while vertical scroll travels along them. Over the whole
 * strip the world-ranking line draws itself, milestone by milestone, and
 * the month counter runs to 24. Phones and reduced motion get the panels
 * stacked with the line omitted.
 *
 * The curve is illustrative until real ranking data is supplied.
 */
const PANELS: { slug: PhotoSlug; alt: string }[] = [
  { slug: "pan-1", alt: "John at full speed, motion blurred" },
  { slug: "watch", alt: "A running watch in a hand" },
  { slug: "track-lying", alt: "John flat on the track after a session" },
  { slug: "budapest-line", alt: "Athletes on the start line at the World Championships" },
  { slug: "final-arms", alt: "John after the Olympic final, hands on his head" },
];
// Percent coordinates across the whole strip. x tracks the five panels; y is ranking (top = better).
const POINTS: [number, number][] = [[3, 88], [16, 80], [30, 70], [44, 50], [58, 40], [68, 46], [84, 18], [96, 8]];

export function ClimbStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".strip-track")!;
      const clip = root.current!.querySelector<SVGRectElement>(".strip-line clipPath rect")!;
      const dots = gsap.utils.toArray<SVGCircleElement>(".strip-line circle", root.current);
      const month = root.current!.querySelector<HTMLElement>("[data-month]")!;
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        // Initial state is set explicitly so a re-run (React dev double mount) never inherits the finished state.
        gsap.set(clip, { attr: { width: 0 } });
        gsap.set(dots, { scale: 0, transformOrigin: "center" });
        month.textContent = "01";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".strip-stage",
            start: "top top",
            end: () => "+=" + distance() * 1.15,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => { month.textContent = String(Math.max(1, Math.min(24, Math.round(self.progress * 24)))).padStart(2, "0"); },
          },
        });
        tl.to(track, { x: () => -distance(), duration: 1 }, 0);
        tl.to(clip, { attr: { width: 100 }, duration: 1 }, 0);
        dots.forEach((d, i) => tl.to(d, { scale: 1, duration: 0.03, ease: "back.out(2)" }, (i / (dots.length - 1)) * 0.97));
        return () => { gsap.set(clip, { attr: { width: 100 } }); gsap.set(dots, { scale: 1 }); month.textContent = "24"; };
      });
      mm.add(`not all and ${DESKTOP}, not all and ${MOTION_OK}`, () => { gsap.set(clip, { attr: { width: 100 } }); month.textContent = "24"; });
    },
    { scope: root },
  );

  const d = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

  return (
    <section className="strip" id="story" ref={root} aria-labelledby="strip-title">
      <div className="strip-stage">
        <div className="strip-head wrap">
          <h2 id="strip-title" className="display display-l">Twenty-four months. One line going the wrong way for everyone else.</h2>
          <div className="strip-month">
            <p className="numeral" aria-hidden="true"><span data-month>01</span><small>/ 24 months</small></p>
          </div>
        </div>
        <ol className="strip-track">
          {content.chapters.map((c, i) => (
            <li key={c.n} className="panel">
              <div className="panel-img"><Photo slug={PANELS[i].slug} alt={PANELS[i].alt} sizes="(min-width: 992px) 60rem, 100vw" /></div>
              <div className="panel-copy">
                <span className="panel-n">{c.n}</span>
                <div>
                  <h3 className="panel-title">{c.title}</h3>
                  <p className="panel-place">{c.place}</p>
                  <p className="panel-tease">{c.tease} <span style={{ color: "var(--ink)" }}>{c.hook}</span></p>
                </div>
              </div>
            </li>
          ))}
          <svg className="strip-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs><clipPath id="stripClip"><rect x="0" y="0" width="100" height="100" /></clipPath></defs>
            <path d={d} clipPath="url(#stripClip)" />
            {POINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === POINTS.length - 1 ? 0.9 : 0.6} />)}
          </svg>
        </ol>
      </div>
      <p className="label strip-note wrap">World ranking, men&apos;s 5000m. Illustrative curve until the real ranking data is in.</p>
    </section>
  );
}

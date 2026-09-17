"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";

/**
 * The bold element of Concept A. A pinned section: the world-ranking curve
 * draws itself as you scroll while the milestone list beside it lights up
 * row by row and a month counter runs from 01 to 24. Desktop with motion
 * allowed gets the scrubbed version; everyone else gets the finished chart.
 *
 * The curve is illustrative until real ranking data is supplied.
 */
const MILESTONES = [
  { n: "01", title: "The decision", note: "Paris is 24 months away. No standard, no ranking to speak of." },
  { n: "02", title: "Iten, 2,400 m", note: "Weeks at altitude with people who are better than me." },
  { n: "03", title: "The model", note: "First schedule produced. Federation, coach and rivals disagree." },
  { n: "04", title: "First race it picked", note: "Points from a start nobody would have chosen." },
  { n: "05", title: "The schedule holds", note: "Every start chosen for ranking value, not prestige." },
  { n: "06", title: "Setback", note: "A lost block of training. Controllables only." },
  { n: "07", title: "Qualification", note: "Inside the Olympic quota. The fastest climb on record." },
  { n: "08", title: "Olympic final", note: "Stade de France, 10 August 2024." },
];

const POINTS: [number, number][] = [
  [20, 372], [110, 344], [190, 304], [270, 206], [360, 154], [450, 178], [560, 74], [680, 30],
];

export function RankingClimb() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const path = root.current!.querySelector<SVGPathElement>(".chart-line")!;
      const clip = root.current!.querySelector<SVGRectElement>("#climbClip rect")!;
      const dots = gsap.utils.toArray<SVGCircleElement>(".chart-dot", root.current);
      const rows = gsap.utils.toArray<HTMLElement>(".climb-row", root.current);
      const month = root.current!.querySelector<HTMLElement>("[data-month]")!;
      const len = path.getTotalLength();

      const finish = () => {
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
        gsap.set(clip, { attr: { width: 700 } });
        gsap.set(dots, { scale: 1, transformOrigin: "center" });
        rows.forEach((r) => (r.dataset.active = "true"));
        month.textContent = "24";
      };

      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(clip, { attr: { width: 0 } });
        gsap.set(dots, { scale: 0, transformOrigin: "center" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=260%",
            pin: root.current!.querySelector(".climb-stage"),
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              const active = Math.min(rows.length, Math.floor(p * rows.length + 0.02) + (p > 0.98 ? 1 : 0));
              rows.forEach((r, i) => (r.dataset.active = i < active ? "true" : "false"));
              month.textContent = String(Math.max(1, Math.min(24, Math.round(p * 24)))).padStart(2, "0");
            },
          },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
        tl.to(clip, { attr: { width: 700 }, duration: 1 }, 0);
        dots.forEach((d, i) => tl.to(d, { scale: 1, duration: 0.04, ease: "back.out(2)" }, (i / (dots.length - 1)) * 0.96));
        return () => finish();
      });
      mm.add(`not all and ${DESKTOP}, not all and ${MOTION_OK}`, finish);
    },
    { scope: root },
  );

  const d = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const areaD = `${d} L680 400 L20 400 Z`;

  return (
    <section className="climb" id="climb" ref={root} aria-label="The ranking climb">
      <div className="climb-stage wrap">
        <div className="climb-head">
          <div>
            <p className="label">World ranking, men&apos;s 5000m</p>
            <h2 className="display display-l" style={{ marginTop: "0.5rem" }}>Twenty-four months, one line going the wrong way for everyone else.</h2>
          </div>
          <div className="climb-month">
            <p className="label">Month</p>
            <p className="numeral" aria-live="off"><span data-month>01</span><small style={{ fontSize: "0.35em", marginLeft: "0.15em" }}>/ 24</small></p>
          </div>
        </div>
        <div className="climb-grid">
          <div className="chart">
            <svg viewBox="0 0 700 400" role="img" aria-label="Line chart of John's world ranking rising over 24 months from far outside the top ranks to the Olympic final">
              <defs>
                <linearGradient id="climbFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#a895dd" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#a895dd" stopOpacity="0" />
                </linearGradient>
                <clipPath id="climbClip"><rect x="0" y="0" width="700" height="400" /></clipPath>
              </defs>
              <g className="chart-grid">
                {[30, 104, 178, 252, 326, 400].map((y) => <line key={y} x1="20" x2="680" y1={y} y2={y} />)}
                {[20, 130, 240, 350, 460, 570, 680].map((x) => <line key={x} y1="30" y2="400" x1={x} x2={x} />)}
              </g>
              <text className="chart-axis" x="20" y="18">Higher ranking</text>
              <text className="chart-axis" x="680" y="392" textAnchor="end" dy="-6">24 months</text>
              <path className="chart-area" d={areaD} clipPath="url(#climbClip)" />
              <path className="chart-line" d={d} />
              {POINTS.map(([x, y], i) => (
                <circle key={i} className={`chart-dot ${i === POINTS.length - 1 ? "is-final" : ""}`} cx={x} cy={y} r={i === POINTS.length - 1 ? 8 : 5} />
              ))}
            </svg>
            <p className="chart-note">Illustrative curve. Real ranking data replaces it before launch.</p>
          </div>
          <ol className="climb-list">
            {MILESTONES.map((m) => (
              <li key={m.n} className="climb-row" data-active="false">
                <b>{m.n}</b>
                <div>
                  <strong>{m.title}</strong>
                  <span>{m.note}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

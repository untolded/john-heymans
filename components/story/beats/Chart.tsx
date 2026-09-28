"use client";

import { useEffect, useRef } from "react";
import { at, span, v, type Moment } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { SERIES, MILESTONES, QUOTA, T_CROSS, drawnIndex, rankAt } from "@/lib/story/ranking";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { useStageSize } from "./stage";

const time = (d: string) => Date.parse(d);
const copy = content.story.ranking;
const SHOWN = show(facts.ranking.series) != null;
const END = SHOWN ? MILESTONES[MILESTONES.length - 1]?.label ?? "" : "";
const QUOTA_LABEL = QUOTA != null && show(facts.ranking.quota) != null ? fill(copy.quotaLine, { n: QUOTA }) : "";

// When the chart is on screen.
const IN: [Moment, Moment] = [["doubt", v("doubt", 138)], ["doubt", v("doubt", 146)]];
const OUT: [Moment, Moment] = [["final", 0], ["final", v("final", 10)]];

const GUIDES = [300, 200, 100, 60, 40, 30, 20];

/**
 * The world ranking across two years: time across, position up the side
 * (better is higher, on a log scale), the Olympic quota as a dashed line. The
 * climb is the point, so only its two ends are named, as large as the chart
 * allows: outside the top 200 where it starts, 31st where it ends, which was
 * the Olympic qualification. Redrawn every frame from story time.
 */
export function Chart() {
  const size = useStageSize();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !size.w || SERIES.length < 2) return;
    const svg = el.querySelector("svg")!;
    const w = el.clientWidth;
    const h = el.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Room either side for the two numbers.
    const padL = size.touch ? 4.4 * rem : 11 * rem;
    const padR = size.touch ? 4.4 * rem : 11 * rem;
    const padT = 18;
    const padB = 18;
    const line = el.querySelector<SVGPathElement>(".rc-line")!;
    const head = el.querySelector<SVGCircleElement>(".rc-head")!;
    const quota = el.querySelector<SVGLineElement>(".rc-quota")!;
    const quotaText = el.querySelector<SVGTextElement>(".rc-quota-label");
    const guides = el.querySelector<SVGGElement>(".rc-guides")!;
    const startDot = el.querySelector<SVGCircleElement>(".rc-start-dot")!;
    const endDot = el.querySelector<SVGCircleElement>(".rc-end-dot")!;
    const startLabel = el.querySelector<HTMLElement>(".rc-start");
    const endLabel = el.querySelector<HTMLElement>(".rc-end");

    const ranks = SERIES.map((p) => p.rank);
    const best = Math.log(Math.min(...ranks, QUOTA ?? Infinity) * 0.8);
    const worst = Math.log(Math.max(...ranks) * 1.12);
    const T0 = time(SERIES[0].date);
    const T1 = time(SERIES[SERIES.length - 1].date);
    const x = (ms: number) => padL + ((ms - T0) / (T1 - T0)) * (w - padL - padR);
    const y = (rank: number) => padT + ((Math.log(rank) - best) / (worst - best)) * (h - padT - padB);
    const pts = SERIES.map((p) => [x(time(p.date)), y(p.rank)] as const);
    const [x0, y0] = pts[0];
    const [x1, y1] = pts[pts.length - 1];

    // Everything that does not move is laid out once.
    let prev = -Infinity;
    guides.innerHTML = GUIDES.filter((r) => Math.log(r) > best && Math.log(r) < worst)
      .filter((r) => {
        const yy = y(r);
        if (Math.abs(yy - prev) < 36) return false;
        prev = yy;
        return true;
      })
      .map((r) => `<line x1="${padL}" x2="${w - padR}" y1="${y(r)}" y2="${y(r)}"/>`)
      .join("");
    if (QUOTA != null) {
      const qy = y(QUOTA);
      quota.setAttribute("x1", String(padL));
      quota.setAttribute("x2", String(w - padR));
      quota.setAttribute("y1", String(qy));
      quota.setAttribute("y2", String(qy));
      // Under the dashed line at its right end, where the ranking line is always above it. A phone's
      // chart is too narrow for it anywhere the climb does not cross, so there the line stands alone.
      quotaText?.setAttribute("x", String(w - padR));
      quotaText?.setAttribute("y", String(qy + 22));
      quotaText?.setAttribute("display", size.touch ? "none" : "inline");
    }
    startDot.setAttribute("cx", String(x0));
    startDot.setAttribute("cy", String(y0));
    endDot.setAttribute("cx", String(x1));
    endDot.setAttribute("cy", String(y1));
    const gap = size.touch ? 10 : 22;
    if (startLabel) Object.assign(startLabel.style, { left: `${x0 - gap}px`, top: `${y0}px` });
    if (endLabel) {
      endLabel.dataset.side = size.touch ? "above" : "right";
      Object.assign(endLabel.style, size.touch ? { left: `${x1 - 4}px`, top: `${y1 - 16}px` } : { left: `${x1 + gap}px`, top: `${y1}px` });
    }

    let flashed = false;
    let flash: gsap.core.Timeline | null = null;
    let ended = false;
    const last = SERIES.length - 1;

    const render = (t: number) => {
      const out = 1 - span(t, ...OUT);
      el.style.opacity = String(Math.min(span(t, ...IN), out));
      el.dataset.on = String(t >= at(IN[0]) && t < at(OUT[1]));
      if (t < at(IN[0]) || t >= at(OUT[1])) return;

      const f = drawnIndex(t);
      const whole = Math.floor(f);
      let d = "";
      for (let i = 0; i <= whole && i <= last; i++) d += `${i ? "L" : "M"}${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
      let [hx, hy] = pts[Math.min(whole, last)];
      const u = f - whole;
      if (u > 0 && whole < last) {
        const a = time(SERIES[whole].date);
        const b = time(SERIES[whole + 1].date);
        hx = x(a + (b - a) * u);
        hy = y(rankAt(f));
        d += `L${hx.toFixed(1)} ${hy.toFixed(1)}`;
      }
      line.setAttribute("d", d);
      head.setAttribute("cx", hx.toFixed(1));
      head.setAttribute("cy", hy.toFixed(1));
      head.style.opacity = f > 0 && f < last ? "1" : "0";

      // The end: 31st, and the qualification that came with it.
      const done = f >= last - 0.001;
      if (done !== ended) {
        ended = done;
        gsap.killTweensOf([endLabel, endDot, ...(endLabel ? Array.from(endLabel.children) : [])].filter(Boolean));
        if (done) {
          gsap.fromTo(endDot, { attr: { r: 5 } }, { attr: { r: 9 }, duration: 0.5, ease: "back.out(3)" });
          if (endLabel) {
            // The label is centred on the point by its own transform, so the slide moves its contents.
            gsap.fromTo(endLabel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
            gsap.fromTo(endLabel.children, { x: -14 }, { x: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
          }
        } else {
          gsap.set(endDot, { attr: { r: 0 } });
          if (endLabel) gsap.set(endLabel, { autoAlpha: 0 });
        }
      }

      // Crossing into the quota: the dashed line turns solid amber for a moment.
      if (!flashed && t >= T_CROSS) {
        flashed = true;
        flash?.kill();
        flash = gsap
          .timeline()
          .set(quota, { stroke: "#FF7A2F", strokeDasharray: "none", strokeOpacity: 1, strokeWidth: 3 })
          .to(quota, { strokeWidth: 1.5, duration: 0.25 }, 0.8)
          .set(quota, { clearProps: "stroke,strokeDasharray,strokeOpacity,strokeWidth" }, 1.05);
      } else if (flashed && t < T_CROSS) {
        flashed = false;
        flash?.progress(1);
      }
    };

    gsap.set(endDot, { attr: { r: 0 } });
    if (endLabel) gsap.set(endLabel, { autoAlpha: 0 });
    const off = story.onTime((t) => render(t));
    return () => {
      off();
      flash?.kill();
      gsap.killTweensOf([endLabel, endDot].filter(Boolean));
    };
  }, [size.w, size.h, size.touch]);

  return (
    <div className="L L-set chart" ref={root} data-on="false">
      <svg className="ranking-chart" preserveAspectRatio="none" aria-hidden="true">
        <g className="rc-guides" />
        <line className="rc-quota" />
        {QUOTA_LABEL && (
          <text className="rc-quota-label" textAnchor="end">
            {QUOTA_LABEL}
          </text>
        )}
        <path className="rc-line" />
        <circle className="rc-start-dot" r="5" />
        <circle className="rc-end-dot" r="0" />
        <circle className="rc-head" r="5" />
      </svg>
      {SHOWN && (
        <>
          <p className="rc-big rc-start" aria-hidden="true">
            {copy.startValue}
          </p>
          <p className="rc-big rc-end" aria-hidden="true">
            <span className="rc-end-n">{END}</span>
            <span className="rc-end-note">{copy.endNote}</span>
          </p>
        </>
      )}
      {SHOW_PENDING && facts.ranking.series.placeholder && <span className="dev-chip">{content.story.dev.placeholder}</span>}
    </div>
  );
}

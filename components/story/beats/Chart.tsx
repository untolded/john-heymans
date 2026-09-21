"use client";

import { useEffect, useRef } from "react";
import { at, span, type Moment } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { SERIES, QUOTA, T_CROSS, drawnIndex, rankAt } from "@/lib/story/ranking";
import { content } from "@/lib/content";
import { useStageSize } from "./stage";

const inOut = gsap.parseEase("power2.inOut");
const time = (d: string) => Date.parse(d);
const T0 = SERIES.length ? time(SERIES[0].date) : 0;
const T1 = SERIES.length ? time(SERIES[SERIES.length - 1].date) : 1;
const SPAN = facts.ranking.setbackSpan.value;
const Z0 = SPAN ? time(SPAN.start) - (time(SPAN.end) - time(SPAN.start)) * 0.25 : T0;
const Z1 = SPAN ? time(SPAN.end) + (time(SPAN.end) - time(SPAN.start)) * 0.25 : T1;
const LABELS = show(facts.ranking.series) != null;
const month = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

// When the chart is on screen, and when it looks at the setbacks up close.
const IN: [Moment, Moment] = [["doubt", 0.52], ["doubt", 0.58]];
const OUT_SORT: [Moment, Moment] = [["setback", 0.29], ["setback", 0.34]];
const BACK: [Moment, Moment] = [["setback", 0.62], ["setback", 0.67]];
const OUT: [Moment, Moment] = [["village", 0], ["village", 0.08]];
const ZOOM_IN: [Moment, Moment] = [["setback", 0], ["setback", 0.12]];
const ZOOM_OUT: [Moment, Moment] = [["setback", 0.6], ["setback", 0.66]];

/**
 * The world ranking across the qualifying window, from the doubters to the
 * qualification: time across, position up the side (better is higher, on a
 * log scale), the Olympic quota as a dashed line. The amber line is the same
 * line as ever, now drawing the climb. It is redrawn every frame from story
 * time, so the chart, the chip and the sparkline always agree.
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
    const padL = 8;
    const padR = size.touch ? 48 : 72;
    const padT = 24;
    const padB = LABELS ? 34 : 12;
    const line = el.querySelector<SVGPathElement>(".rc-line")!;
    const head = el.querySelector<SVGCircleElement>(".rc-head")!;
    const quota = el.querySelector<SVGLineElement>(".rc-quota")!;
    const guides = el.querySelector<SVGGElement>(".rc-guides")!;
    const axis = el.querySelector<SVGGElement>(".rc-axis")!;

    const ranks = SERIES.map((p) => p.rank);
    const best = Math.log(Math.min(...ranks, QUOTA ?? Infinity) * 0.8);
    const worst = Math.log(Math.max(...ranks) * 1.12);
    const y = (rank: number) => padT + ((Math.log(rank) - best) / (worst - best)) * (h - padT - padB);

    // Guides at round ranks, labelled only when the ranking may be shown.
    guides.innerHTML = [500, 300, 200, 100, 50, 25, 10]
      .filter((r) => Math.log(r) > best && Math.log(r) < worst)
      .map((r) => `<line x1="${padL}" x2="${w - padR}" y1="${y(r)}" y2="${y(r)}"/>${LABELS ? `<text x="${w - padR + 12}" y="${y(r) + 4}">${r}</text>` : ""}`)
      .join("");
    if (QUOTA != null) {
      quota.setAttribute("x1", String(padL));
      quota.setAttribute("x2", String(w - padR));
      quota.setAttribute("y1", String(y(QUOTA)));
      quota.setAttribute("y2", String(y(QUOTA)));
    }

    let flashed = false;
    let flash: gsap.core.Timeline | null = null;

    const render = (t: number) => {
      const fadeIn = span(t, ...IN);
      const sortOut = 1 - span(t, ...OUT_SORT) + span(t, ...BACK);
      const out = 1 - span(t, ...OUT);
      el.style.opacity = String(Math.min(fadeIn, Math.min(1, sortOut), out));
      el.dataset.on = String(t >= at(IN[0]) && t < at(OUT[1]));
      if (t < at(IN[0]) || t >= at(OUT[1])) return;

      // The view closes in on the setbacks, then opens up again for the recovery.
      const z = inOut(span(t, ...ZOOM_IN)) * (1 - inOut(span(t, ...ZOOM_OUT)));
      const d0 = T0 + (Z0 - T0) * z;
      const d1 = T1 + (Z1 - T1) * z;
      const x = (ms: number) => padL + ((ms - d0) / (d1 - d0)) * (w - padL - padR);

      const f = drawnIndex(t);
      const whole = Math.floor(f);
      let d = "";
      for (let i = 0; i <= whole && i < SERIES.length; i++) d += `${i ? "L" : "M"}${x(time(SERIES[i].date)).toFixed(1)} ${y(SERIES[i].rank).toFixed(1)}`;
      const u = f - whole;
      let hx = x(time(SERIES[whole].date));
      let hy = y(SERIES[whole].rank);
      if (u > 0 && whole + 1 < SERIES.length) {
        const a = time(SERIES[whole].date);
        const b = time(SERIES[whole + 1].date);
        hx = x(a + (b - a) * u);
        hy = y(rankAt(f));
        d += `L${hx.toFixed(1)} ${hy.toFixed(1)}`;
      }
      line.setAttribute("d", d);
      head.setAttribute("cx", hx.toFixed(1));
      head.setAttribute("cy", hy.toFixed(1));
      head.style.opacity = f > 0 && f < SERIES.length - 1 ? "1" : "0";

      if (LABELS) {
        axis.innerHTML = SERIES.filter((_, i) => i % 4 === 0)
          .map((p) => `<text x="${x(time(p.date)).toFixed(1)}" y="${h - 8}" text-anchor="middle">${month.format(new Date(p.date)).toUpperCase()}</text>`)
          .join("");
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

    const off = story.onTime((t) => render(t));
    return () => {
      off();
      flash?.kill();
    };
  }, [size.w, size.h, size.touch]);

  return (
    <div className="L L-set chart" ref={root} data-on="false">
      <svg className="ranking-chart" preserveAspectRatio="none" aria-hidden="true">
        <g className="rc-guides" />
        <line className="rc-quota" />
        <path className="rc-line" />
        <circle className="rc-head" r="5" />
        <g className="rc-axis" />
      </svg>
      {SHOW_PENDING && facts.ranking.series.placeholder && <span className="dev-chip">{content.story.dev.placeholder}</span>}
    </div>
  );
}

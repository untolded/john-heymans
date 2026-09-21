"use client";

import { useEffect, useRef } from "react";
import { at, span, type Moment } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { SERIES, QUOTA, I_HOLD_END, T_CROSS, T_QUALIFIED, drawnIndex, rankAt, quarterTicks } from "@/lib/story/ranking";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { useStageSize } from "./stage";

const inOut = gsap.parseEase("power2.inOut");
const time = (d: string) => Date.parse(d);
const T0 = SERIES.length ? time(SERIES[0].date) : 0;
const T1 = SERIES.length ? time(SERIES[SERIES.length - 1].date) : 1;
const HOLD = facts.ranking.hold.value;
const Z0 = HOLD ? time(HOLD.start) - (time(HOLD.end) - time(HOLD.start)) * 0.3 : T0;
const Z1 = HOLD ? time(HOLD.end) + (time(HOLD.end) - time(HOLD.start)) * 0.2 : T1;
/** Up close, the view spans these ranks, so the line visibly hugs the quota. */
const ZOOM_RANKS = [24, 70];
const LABELS = show(facts.ranking.series) != null;
const month = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });
const copy = content.story.ranking;

const q = facts.qualification;
const QUALIFIED = show(q.date) && show(facts.result.personalBest) && show(q.city) && show(q.standard);
const Q_TITLE = QUALIFIED ? fill(copy.qualifiedTitle, { time: show(facts.result.personalBest)!, city: show(q.city)! }) : "";
const Q_LINE = QUALIFIED ? fill(copy.qualifiedLine, { standard: show(q.standard)! }) : "";
const QUOTA_LABEL = QUOTA != null && show(facts.ranking.quota) != null ? fill(copy.quotaLine, { n: QUOTA }) : "";

// When the chart is on screen, and when it looks at the hold up close.
const IN: [Moment, Moment] = [["doubt", 0.52], ["doubt", 0.58]];
const OUT_SORT: [Moment, Moment] = [["setback", 0.29], ["setback", 0.34]];
const BACK: [Moment, Moment] = [["setback", 0.62], ["setback", 0.67]];
const OUT: [Moment, Moment] = [["village", 0], ["village", 0.08]];
const ZOOM_IN: [Moment, Moment] = [["setback", 0], ["setback", 0.12]];
const ZOOM_OUT: [Moment, Moment] = [["setback", 0.6], ["setback", 0.66]];

const GUIDES = [300, 200, 100, 60, 50, 40, 30, 25, 20, 10];

/**
 * The world ranking across two years, from the doubters to the qualification:
 * time across, position up the side (better is higher, on a log scale), the
 * Olympic quota as a dashed line. The amber line is the same line as ever,
 * now drawing the climb. In the setbacks it closes in on the months spent
 * just inside the quota, then opens up again for the run in Boston. It is
 * redrawn every frame from story time, so the chart, the chip and the
 * sparkline always agree.
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
    const padR = size.touch ? 40 : 72;
    const padT = 24;
    const padB = LABELS ? 34 : 12;
    const line = el.querySelector<SVGPathElement>(".rc-line")!;
    const head = el.querySelector<SVGCircleElement>(".rc-head")!;
    const quota = el.querySelector<SVGLineElement>(".rc-quota")!;
    const quotaText = el.querySelector<SVGTextElement>(".rc-quota-label");
    const guides = el.querySelector<SVGGElement>(".rc-guides")!;
    const axis = el.querySelector<SVGGElement>(".rc-axis")!;
    const qMark = el.querySelector<SVGGElement>(".rc-qual");

    const ranks = SERIES.map((p) => p.rank);
    const fullBest = Math.log(Math.min(...ranks, QUOTA ?? Infinity) * 0.8);
    const fullWorst = Math.log(Math.max(...ranks) * 1.12);
    const zoomBest = Math.log(ZOOM_RANKS[0]);
    const zoomWorst = Math.log(ZOOM_RANKS[1]);

    let flashed = false;
    let flash: gsap.core.Timeline | null = null;
    let lastZ = -1;
    let qualShown = false;

    const render = (t: number) => {
      const fadeIn = span(t, ...IN);
      const sortOut = 1 - span(t, ...OUT_SORT) + span(t, ...BACK);
      const out = 1 - span(t, ...OUT);
      el.style.opacity = String(Math.min(fadeIn, Math.min(1, sortOut), out));
      el.dataset.on = String(t >= at(IN[0]) && t < at(OUT[1]));
      if (t < at(IN[0]) || t >= at(OUT[1])) return;

      // The view closes in on the hold, in time and in rank, then opens up again.
      const z = inOut(span(t, ...ZOOM_IN)) * (1 - inOut(span(t, ...ZOOM_OUT)));
      const d0 = T0 + (Z0 - T0) * z;
      const d1 = T1 + (Z1 - T1) * z;
      const best = fullBest + (zoomBest - fullBest) * z;
      const worst = fullWorst + (zoomWorst - fullWorst) * z;
      const x = (ms: number) => padL + ((ms - d0) / (d1 - d0)) * (w - padL - padR);
      const y = (rank: number) => padT + ((Math.log(rank) - best) / (worst - best)) * (h - padT - padB);

      if (Math.abs(z - lastZ) > 0.001) {
        lastZ = z;
        // Guides at round ranks, at least 40px apart, labelled only when the ranking may be shown.
        let prev = -Infinity;
        guides.innerHTML = GUIDES.filter((r) => Math.log(r) > best && Math.log(r) < worst)
          .filter((r) => {
            const yy = y(r);
            if (Math.abs(yy - prev) < 40) return false;
            prev = yy;
            return true;
          })
          .map((r) => `<line x1="${padL}" x2="${w - padR}" y1="${y(r)}" y2="${y(r)}"/>${LABELS ? `<text x="${w - padR + 12}" y="${y(r) + 4}">${r}</text>` : ""}`)
          .join("");
        if (QUOTA != null) {
          const qy = y(QUOTA);
          quota.setAttribute("x1", String(padL));
          quota.setAttribute("x2", String(w - padR));
          quota.setAttribute("y1", String(qy));
          quota.setAttribute("y2", String(qy));
          // Under the dashed line at its right end, where the ranking line is always above it.
          quotaText?.setAttribute("x", String(w - padR));
          quotaText?.setAttribute("y", String(qy + 22));
        }
        if (LABELS) {
          // Quarters, thinned to one label per 76px so narrow screens stay legible.
          let last = -Infinity;
          axis.innerHTML = quarterTicks(d0, d1)
            .filter((ms) => {
              const px = x(ms);
              if (px - last < 76 || px < padL + 24 || px > w - padR - 8) return false;
              last = px;
              return true;
            })
            .map((ms) => `<text x="${x(ms).toFixed(1)}" y="${h - 8}" text-anchor="middle">${month.format(new Date(ms)).toUpperCase()}</text>`)
            .join("");
        }
      }

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

      // The qualifying run: a mark on the line where it happened.
      if (qMark) {
        const p = SERIES[I_HOLD_END];
        const mx = x(time(p.date));
        const my = y(p.rank);
        qMark.setAttribute("transform", `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
        // Right of centre, the label ends at the mark so it never runs off the chart.
        const anchor = mx > w * 0.55 ? "end" : "middle";
        qMark.querySelectorAll("text").forEach((tx) => {
          tx.setAttribute("text-anchor", anchor);
          tx.setAttribute("x", anchor === "end" ? "14" : "0");
        });
        const on = t >= T_QUALIFIED;
        if (on !== qualShown) {
          qualShown = on;
          gsap.killTweensOf(qMark);
          if (on) gsap.fromTo(qMark, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
          else gsap.set(qMark, { opacity: 0 });
          const ring = qMark.querySelector(".rc-qual-ring");
          if (on && ring) gsap.fromTo(ring, { attr: { r: 6 }, opacity: 0.9 }, { attr: { r: 26 }, opacity: 0, duration: 0.9, ease: "power2.out" });
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

    const off = story.onTime((t) => render(t));
    return () => {
      off();
      flash?.kill();
      if (qMark) gsap.killTweensOf(qMark);
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
        <circle className="rc-head" r="5" />
        {QUALIFIED && (
          <g className="rc-qual" opacity="0">
            <circle className="rc-qual-ring" r="6" />
            <circle className="rc-qual-dot" r="6" />
            <text className="rc-qual-title" x="0" y="-58" textAnchor="middle">
              {Q_TITLE}
            </text>
            <text className="rc-qual-line" x="0" y="-34" textAnchor="middle">
              {Q_LINE}
            </text>
          </g>
        )}
        <g className="rc-axis" />
      </svg>
      {SHOW_PENDING && facts.ranking.series.placeholder && <span className="dev-chip">{content.story.dev.placeholder}</span>}
    </div>
  );
}

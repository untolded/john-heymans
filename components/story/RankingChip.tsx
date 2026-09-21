"use client";

import { useEffect, useRef } from "react";
import { chipAt, SERIES, rankAt, type ChipState } from "@/lib/story/ranking";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import { content } from "@/lib/content";

const COLUMNS = 4;
const DIGITS = "0123456789".split("");
const SPARK_W = 64;
const SPARK_H = 22;

/**
 * The one number the story follows: John's world ranking. It rolls like an
 * odometer, carries a sparkline of the climb so far, and falls back to a
 * text state whenever the number itself may not be shown.
 */
export function RankingChip() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const label = el.querySelector<HTMLElement>(".chip-label")!;
    const state = el.querySelector<HTMLElement>(".chip-state")!;
    const cols = Array.from(el.querySelectorAll<HTMLElement>(".odo-col"));
    const strips = cols.map((c) => c.firstElementChild as HTMLElement);
    const spark = el.querySelector<SVGPathElement>(".chip-spark path");
    let last: ChipState | null = null;

    const swap = (node: HTMLElement, text: string) => {
      gsap.killTweensOf(node);
      gsap.to(node, {
        y: -8,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          node.textContent = text;
          gsap.fromTo(node, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
        },
      });
    };

    const roll = (value: string | null) => {
      const padded = (value ?? "").padStart(COLUMNS, " ").slice(-COLUMNS);
      padded.split("").forEach((ch, i) => {
        const blank = ch === " ";
        cols[i].dataset.blank = String(blank);
        if (!blank) gsap.to(strips[i], { yPercent: -Number(ch) * 10, duration: 0.6, ease: "power3.out", delay: i * 0.04, overwrite: true });
      });
    };

    const drawSpark = (f: number) => {
      if (!spark || SERIES.length < 2) return;
      const logs = SERIES.map((p) => Math.log(p.rank));
      const lo = Math.min(...logs);
      const hi = Math.max(...logs);
      const x = (i: number) => (i / (SERIES.length - 1)) * SPARK_W;
      const y = (v: number) => 2 + ((v - lo) / (hi - lo || 1)) * (SPARK_H - 4);
      const whole = Math.floor(f);
      let d = "";
      for (let i = 0; i <= whole && i < SERIES.length; i++) d += `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(logs[i]).toFixed(1)}`;
      if (f > whole && whole + 1 < SERIES.length) d += `L${x(f).toFixed(1)} ${y(Math.log(rankAt(f))).toFixed(1)}`;
      spark.setAttribute("d", d);
    };

    return story.onTime((t) => {
      const c = chipAt(t);
      if (c.visible !== last?.visible) el.dataset.on = String(c.visible);
      if (c.label !== last?.label) swap(label, c.label);
      if (c.value !== last?.value) roll(c.value);
      if (c.state !== last?.state && c.state) swap(state, c.state);
      el.dataset.kind = c.value != null ? "number" : "state";
      if (c.marker) el.dataset.marker = c.marker === "placeholder" ? content.story.dev.placeholder : content.story.dev.pending;
      else delete el.dataset.marker;
      if (!last || Math.abs(c.spark - last.spark) > 0.005) drawSpark(c.spark);
      last = c;
    });
  }, []);

  return (
    <div className="chip" ref={root} data-on="false">
      <p className="chip-label" />
      <div className="chip-row">
        <p className="chip-number" aria-hidden="true">
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span className="odo-col" key={i} data-blank="true">
              <span className="odo-strip">
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ))}
        </p>
        <p className="chip-state" />
        {SERIES.length > 1 && (
          <svg className="chip-spark" viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width={SPARK_W} height={SPARK_H} aria-hidden="true">
            <path d="" />
          </svg>
        )}
      </div>
    </div>
  );
}

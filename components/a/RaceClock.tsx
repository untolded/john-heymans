"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { content } from "@/lib/content";

const PB_SECONDS = 13 * 60 + 3.46;

export function formatSplit(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

/**
 * The whole page is one 5000m. The clock in the nav runs from 0:00.00 at the
 * top to John's personal best at the bottom, and a lavender line under the
 * nav is the distance covered. Scroll-linked, so it works with reduced motion.
 */
export function RaceClock() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const time = root.current!.querySelector<HTMLElement>("[data-time]")!;
      const bar = document.querySelector<HTMLElement>(".nav-progress");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          time.textContent = formatSplit(self.progress * PB_SECONDS);
          if (bar) gsap.set(bar, { scaleX: self.progress });
        },
      });
    },
    { scope: root },
  );
  return (
    <div className="race-clock" ref={root} aria-live="off" title={`${content.brand.pbLabel} ${content.brand.pb}`}>
      <span className="clock" data-time>0:00.00</span>
      <span className="label">/ {content.brand.pb}</span>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { facts, show } from "@/lib/story/data";
import { fill } from "@/lib/story/format";

const f = content.story.footer.pace;
const MM_PER_PX = 0.2646;

/** Running notation: 37:06, then 3:05:30, then days once it gets silly. */
function runTime(total: number): string {
  const s = Math.max(0, Math.round(total));
  if (s >= 86400) return fill(f.days, { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600) });
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

type Result = { metres: string; pace: string; five: string };

const pb = show(facts.result.personalBest);
const qDate = show(facts.qualification.date);
const qCity = show(facts.qualification.city);
const mine = qCity && qDate ? fill(f.mine, { city: qCity, year: new Date(qDate).getUTCFullYear() }) : f.mineShort;

/**
 * Seasats measures scroll in knots; this measures it in running pace. It
 * counts every pixel scrolled since the page opened and, when the footer
 * comes into view, posts your result on a board next to John's: your pace
 * per kilometre, your 5,000 m at that pace, and his. The board is laid out
 * from the start with blank splits, so filling it in never moves the page.
 */
export function ScrollPace() {
  const el = useRef<HTMLElement>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const start = performance.now();
    let travelled = 0;
    let lastY = window.scrollY;
    let frozen = false;

    const onScroll = () => {
      const y = window.scrollY;
      travelled += Math.abs(y - lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frozen) return;
        frozen = true;
        const metres = Math.max(0.1, (travelled * MM_PER_PX) / 1000);
        const seconds = (performance.now() - start) / 1000;
        const perKm = seconds / (metres / 1000);
        setResult({ metres: metres.toLocaleString("en-GB", { maximumFractionDigits: 1 }), pace: runTime(perKm), five: runTime(perKm * 5) });
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    if (el.current) io.observe(el.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <section className="pace" ref={el} aria-label={f.title} data-done={!!result}>
      <p className="pace-lead" aria-live="polite">
        {result ? fill(f.lead, { d: result.metres }) : f.waiting}
      </p>
      <dl className="pace-board">
        <div className="pace-cell">
          <dt>{f.pace}</dt>
          <dd>{result ? fill(f.perKm, { p: result.pace }) : f.blank}</dd>
        </div>
        <div className="pace-cell">
          <dt>{f.five}</dt>
          <dd>{result ? result.five : f.blank}</dd>
        </div>
        {pb && (
          <div className="pace-cell pace-mine">
            <dt>{mine}</dt>
            <dd>{pb}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

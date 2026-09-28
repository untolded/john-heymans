"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { facts, show } from "@/lib/story/data";
import { fill } from "@/lib/story/format";

const f = content.story.footer.pace;
/** The whole page, top to bottom, counts as this many metres. */
const PAGE_METRES = 1000;
/** Like a running watch's auto-pause: a stop longer than this counts only this long. */
const AUTO_PAUSE = 20;

/** Running notation: 37:06, then 3:05:30, then days once it gets silly. */
function runTime(total: number): string {
  const s = Math.max(0, Math.round(total));
  if (s >= 86400) return fill(f.days, { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600) });
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

type Result = { pace: string; five: string };

const pb = show(facts.result.personalBest);
/** "13:03.46" in seconds. */
const seconds = (t: string) => t.split(":").reduce((acc, part) => acc * 60 + Number(part), 0);
/** John's pace per kilometre over his fastest 5 km: the floor nobody on this page gets under. */
const JOHN_PER_KM = (pb ? seconds(pb) : 783.46) / 5;
const qDate = show(facts.qualification.date);
const qCity = show(facts.qualification.city);
const mine = qCity && qDate ? fill(f.mine, { city: qCity, year: new Date(qDate).getUTCFullYear() }) : f.mineShort;

/**
 * Seasats measures scroll in knots; this measures it as a run. Scrolling
 * the whole page counts as one kilometre, so a visit lands on numbers
 * anyone can place, not a physical scroll of a few metres. It counts every
 * pixel scrolled, up and down, and the time spent moving, with the watch
 * pausing itself while you stop to read. Your time starts from John's own
 * pace per kilometre and grows with the time you spent moving, so nobody
 * posts a time faster than an Olympic finalist. When the footer comes into
 * view it posts the result next to John's: your time for 1 km, your 5 km at
 * that speed, and his fastest 5 km. The board is laid out from the start with
 * blank times, so filling it in never moves the page.
 */
export function ScrollPace() {
  const el = useRef<HTMLElement>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let travelled = 0;
    let moving = 0;
    let lastY = window.scrollY;
    let lastAt = 0;
    let frozen = false;

    const onScroll = () => {
      const y = window.scrollY;
      const now = performance.now() / 1000;
      travelled += Math.abs(y - lastY);
      if (lastAt) moving += Math.min(now - lastAt, AUTO_PAUSE);
      lastAt = now;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frozen) return;
        frozen = true;
        const length = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const metres = Math.max(1, (travelled / length) * PAGE_METRES);
        // Nobody runs faster than John here: the clock starts from his pace, and every second
        // spent moving down the page is added to it. A skim lands near a good club runner,
        // a proper read at jogging pace.
        const perKm = JOHN_PER_KM + Math.max(3, moving) / (metres / 1000);
        setResult({ pace: runTime(perKm), five: runTime(perKm * 5) });
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
        {result ? f.lead : f.waiting}
      </p>
      <dl className="pace-board">
        <div className="pace-cell">
          <dt>{f.pace}</dt>
          <dd>{result ? result.pace : f.blank}</dd>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { facts, show } from "@/lib/story/data";
import { duration, fill } from "@/lib/story/format";

const f = content.story.footer;
const MM_PER_PX = 0.2646;

/**
 * Seasats measures scroll in knots; this measures it in running pace. It
 * counts every pixel scrolled since the page opened and, when the footer
 * comes into view, turns distance and time into a pace per kilometre and a
 * 5,000 m time. The line then freezes.
 */
export function ScrollPace() {
  const el = useRef<HTMLParagraphElement>(null);
  const [line, setLine] = useState<string | null>(null);

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

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || frozen) return;
      frozen = true;
      const metres = (travelled * MM_PER_PX) / 1000;
      if (metres < 0.5) return;
      const seconds = (performance.now() - start) / 1000;
      const perKm = seconds / (metres / 1000);
      let text = fill(f.pace, {
        d: metres.toLocaleString("en-GB", { maximumFractionDigits: 1 }),
        p: duration(perKm),
        t: duration(perKm * 5),
      });
      const pb = show(facts.result.personalBest);
      if (pb) text += ` ${fill(f.pb, { pb })}`;
      setLine(text);
      io.disconnect();
    });
    if (el.current) io.observe(el.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <p className="pace" ref={el} aria-live="polite">
      {line}
    </p>
  );
}

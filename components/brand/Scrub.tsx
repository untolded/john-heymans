"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/story/gsap";

/**
 * The one rule behind all of it: the scroll is the timeline. The slider is
 * standing in for the scroll wheel, and the timeline underneath is paused and
 * scrubbed, exactly as every beat on the site is.
 */
export function Scrub() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const out = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      t.fromTo(".scrub-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "none" }, 0);
      t.fromTo(".scrub-w", { opacity: 0, scale: 1.12, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.25, ease: "power3.out", stagger: 0.08 }, 0.1);
      t.fromTo(".scrub-sub", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }, 0.55);
      t.to(".scrub-ground", { "--o": 1, duration: 0.5, ease: "none" }, 0.2);
      t.progress(0.28);
      tl.current = t;
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="scrub" ref={root}>
      <div className="scrub-stage">
        <div className="scrub-ground" />
        <span className="scrub-rule" />
        <p className="scrub-line">
          {["Two", "years.", "One", "algorithm."].map((w) => (
            <span className="scrub-w" key={w}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="scrub-sub">An Olympic final.</p>
      </div>
      <label className="scrub-control">
        <span className="scrub-label">
          Scroll position <span ref={out}>28%</span>
        </span>
        <input
          type="range"
          min={0}
          max={1000}
          defaultValue={280}
          aria-label="Scroll position"
          onInput={(e) => {
            const v = Number(e.currentTarget.value) / 1000;
            tl.current?.progress(v);
            if (out.current) out.current.textContent = `${Math.round(v * 100)}%`;
          }}
        />
      </label>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/story/gsap";
import { EASES } from "./motion";


/** The four curves, with a marker running each one so the shape is felt, not read. */
export function Easings() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      EASES.forEach((e) => {
        gsap.to(`[data-ease="${e.name}"] .ease-dot`, {
          x: 132,
          duration: 1.6,
          ease: e.gsap,
          repeat: -1,
          repeatDelay: 0.7,
          yoyo: false,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="eases" ref={root}>
      {EASES.map((e) => {
        const [x1, y1, x2, y2] = e.p;
        return (
          <figure className="ease" key={e.name} data-ease={e.name}>
            <svg viewBox="0 0 100 100" className="ease-svg" aria-hidden="true">
              <path d="M0 100 H100" className="ease-axis" />
              <path d="M0 100 V0" className="ease-axis" />
              <path
                d={`M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`}
                className="ease-curve"
              />
            </svg>
            <div className="ease-track" aria-hidden="true">
              <span className="ease-dot" />
            </div>
            <figcaption>
              <b>{e.name}</b>
              <code>{e.gsap}</code>
              <code className="ease-css">{e.css}</code>
              <span>{e.use}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

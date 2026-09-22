"use client";

import { useEffect, useRef, useState } from "react";

export const GROUNDS = [
  { id: "night", label: "Night", where: "The opening, the edge, the handover", css: "linear-gradient(180deg, #070613 0%, #0b0920 60%, #151038 100%)" },
  { id: "altitude", label: "Altitude", where: "Iten, and the climb to 2,400 m", css: "linear-gradient(180deg, #151038 0%, #3a2c91 58%, #ff7a2f 135%)" },
  { id: "signal", label: "Signal", where: "The algorithm and the doubters", css: "radial-gradient(120% 80% at 50% 110%, #3a2c91 0%, #151038 45%, #070613 100%)" },
  { id: "low", label: "Low", where: "The setbacks", css: "linear-gradient(180deg, #070613 0%, #0e0a22 100%)" },
  { id: "warm", label: "Warm", where: "The Olympic village", css: "linear-gradient(180deg, #151038 0%, #3a2c91 45%, #ff7a2f 150%)" },
  { id: "stadium", label: "Stadium", where: "The final", css: "radial-gradient(90% 60% at 50% 100%, #b9a8f5 0%, #3a2c91 38%, #070613 82%)" },
  { id: "paper", label: "Paper", where: "Everything practical: keynote, proof, booking", css: "#f3f1ea" },
] as const;

/**
 * The seven grounds. The story never cuts between them: each one crossfades
 * over the last across a whole beat, which is why a screenshot of the site
 * rarely shows a colour that is in the palette.
 */
export function Grounds() {
  const [active, setActive] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setInterval(() => setActive((i) => (i + 1) % GROUNDS.length), 2600);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  return (
    <div className="grounds">
      <div className="grounds-stage" data-paper={GROUNDS[active].id === "paper" ? "true" : undefined}>
        {GROUNDS.map((g, i) => (
          <span key={g.id} className="grounds-layer" style={{ background: g.css, opacity: i === active ? 1 : 0 }} />
        ))}
        <span className="grain" aria-hidden="true" />
        <p className="grounds-name">
          <b>{GROUNDS[active].label}</b>
          <span>{GROUNDS[active].where}</span>
        </p>
      </div>
      <ul className="grounds-picker">
        {GROUNDS.map((g, i) => (
          <li key={g.id}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => {
                stop();
                setActive(i);
              }}
            >
              {g.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

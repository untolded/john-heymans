"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { HandwritingSvg } from "@/components/story/set-pieces/Handwriting";

type Kind = "rise" | "words" | "ink" | "type" | "flash" | "scribble";

const PROMPT = "Build an algorithm that gets me to the Olympics.";

/**
 * One reveal, running the same code the site runs: the demos import
 * lib/story/reveals directly, so a change to the motion changes the guide.
 * Each plays once when it comes into view, and again on demand.
 */
export function Demo({ kind, text, className = "" }: { kind: Kind; text: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLParagraphElement>(null);
  const live = useRef<{ revert?: () => void } | null>(null);
  const [count, setCount] = useState(0);

  const play = useCallback(() => {
    const el = target.current;
    if (!el) return;
    live.current?.revert?.();
    gsap.killTweensOf(el);
    if (kind === "scribble") {
      const paths = box.current?.querySelectorAll(".hw-stroke");
      if (paths?.length) R.scribble([...paths]);
      return;
    }
    if (kind === "type") {
      R.type(el, PROMPT);
      return;
    }
    gsap.set(el, { clearProps: "all" });
    if (kind === "rise") live.current = R.rise(el);
    else if (kind === "words") live.current = R.words(el);
    else if (kind === "ink") live.current = R.ink(el);
    else if (kind === "flash") R.flash(el);
  }, [kind]);

  // The handwriting is traced in the photograph's own coordinates, so on its
  // own it sits wherever his arms were in the frame. Crop the view to the ink.
  useEffect(() => {
    if (kind !== "scribble") return;
    const svg = box.current?.querySelector<SVGSVGElement>("svg");
    if (!svg) return;
    const b = svg.getBBox();
    if (!b.width || !b.height) return;
    const pad = b.width * 0.05;
    svg.setAttribute("viewBox", `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
  }, [kind]);

  // Plays once when it arrives, like everything else in the brand.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          play();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <div className={`demo ${className}`} ref={box} data-kind={kind}>
      <div className="demo-stage">
        {kind === "scribble" ? (
          <div className="demo-hw">
            <HandwritingSvg />
          </div>
        ) : (
          <p className="demo-text" ref={target} key={count}>
            {kind === "type" ? "" : text}
          </p>
        )}
      </div>
      <button
        type="button"
        className="demo-play"
        onClick={() => {
          setCount((c) => c + 1);
          requestAnimationFrame(play);
        }}
      >
        Play again
      </button>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Photo } from "@/components/shared/Photo";
import { photo } from "@/lib/photos";

/**
 * The bold element of Concept B. Pinned for two viewport heights: the two
 * words John wrote on his arms are written across the photograph, one wipe
 * per word, in the order he wrote them. The chapter earns this by coming
 * fifth. Reduced motion and phones show the finished frame.
 */
export function Arms({ tease, hook }: { tease: string; hook: string }) {
  const root = useRef<HTMLElement>(null);
  const p = photo("final-arms");

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".arms-word", root.current);
      const copy = root.current!.querySelectorAll(".arms-copy > *");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(words, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(copy, { opacity: 0, y: 14 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", pin: ".arms-stage", scrub: 0.5 },
        });
        tl.to(words[0], { clipPath: "inset(0 0% 0 0)", duration: 0.34 }, 0.05);
        tl.to(words[1], { clipPath: "inset(0 0% 0 0)", duration: 0.34 }, 0.46);
        tl.to(copy, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04, ease: "power2.out" }, 0.8);
        return () => { gsap.set(words, { clipPath: "inset(0 0% 0 0)" }); gsap.set(copy, { opacity: 1, y: 0 }); };
      });
      mm.add(`not all and ${MOTION_OK}`, () => {
        gsap.set(words, { clipPath: "inset(0 0% 0 0)" });
      });
    },
    { scope: root },
  );

  return (
    <section className="arms" ref={root} data-theme="dark" aria-labelledby="arms-title">
      <div className="arms-stage">
        <div className="arms-media"><Photo slug="final-arms" alt="John Heymans after the Olympic 5000m final, hands on his head, the words written on his arms" sizes="100vw" credit="hidden" /></div>
        <div className="arms-words" aria-hidden="true">
          <span className="marker arms-word">Hey mom</span>
          <span className="marker arms-word">Made it</span>
        </div>
        <div className="arms-copy wrap">
          <p className="label">05. Stade de France, 10 August 2024</p>
          <h2 id="arms-title" className="display display-l">The final</h2>
          <p className="lede">{tease}</p>
          <p className="label">{hook}</p>
        </div>
        <span className="photo-credit arms-credit">{p.caption}. Photo {p.credit}</span>
      </div>
    </section>
  );
}

"use client";

import { gsap } from "@/lib/story/gsap";
import { useBeat } from "./useBeat";
import { useStageSize, boxOf } from "./stage";

/**
 * The turn. Two lines, then the amber line underlines "edge", shrinks into a
 * blinking caret and slides to the centre of the stage, where the chat window
 * will open around it. That match cut carries the story into the algorithm.
 */
export function Edge() {
  const size = useStageSize();

  const scope = useBeat(
    "edge",
    ({ tl, q }) => {
      if (!size.w) return;
      const caret = q(".caret-el")[0];
      const entry = document.querySelector<HTMLElement>('[data-entry="edge.b"]');
      const mark = entry?.querySelector<HTMLElement>(".mark");
      const m = boxOf(mark ?? null);
      if (!entry || !mark || !m) return;

      const em = parseFloat(getComputedStyle(mark).fontSize);
      const caretH = Math.round(em * 0.8);
      const underline = m.y + m.h - Math.max(3, em * 0.055);

      // The underline is drawn inside the text, then handed to the line layer.
      tl.fromTo(entry, { "--u": 0 }, { "--u": 1, duration: 0.06, ease: "power2.out" }, 0.58);
      tl.set(entry, { "--u": 0 }, 0.7);

      const thick = Math.max(3, em * 0.055);
      gsap.set(caret, { x: m.x, y: underline, width: m.w, height: thick, autoAlpha: 0 });
      tl.set(caret, { autoAlpha: 1 }, 0.7);
      // Collapse to the end of the word, then stand up as a caret.
      tl.to(caret, { x: m.x + m.w - 2, width: 2, duration: 0.06, ease: "power2.in" }, 0.7);
      tl.to(caret, { y: underline + thick - caretH, height: caretH, duration: 0.05, ease: "power2.out" }, 0.76);
      tl.to(caret, { x: size.w / 2 - 1, y: size.h / 2 - caretH / 2, duration: 0.19, ease: "power2.inOut" }, 0.81);
      tl.set(caret, { autoAlpha: 0 }, 0.999);

      return (b) => caret.classList.toggle("is-blinking", b.progress > 0.81 && b.progress < 0.999);
    },
    [size.w, size.h],
  );

  return (
    <div className="beat" ref={scope} data-beat="edge">
      <div className="L L-line">
        <span className="caret-el" />
      </div>
    </div>
  );
}

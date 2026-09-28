"use client";

import { gsap } from "@/lib/story/gsap";
import { v } from "@/lib/story/beats";
import { useBeat } from "./useBeat";
import { useStageSize, boxOf, layoutBox } from "./stage";

const at = (vh: number) => v("edge", vh);

/**
 * The turn. Two lines, then the amber line underlines "edge", pulls itself
 * into a dot and drops to the bottom of the screen, where it becomes the
 * running light under ChatGPT in the dock. The app then opens from there.
 */
export function Edge() {
  const size = useStageSize();

  const scope = useBeat(
    "edge",
    ({ tl, q }) => {
      if (!size.w) return;
      const dot = q(".caret-el")[0];
      const entry = document.querySelector<HTMLElement>('[data-entry="edge.b"]');
      const mark = entry?.querySelector<HTMLElement>(".mark");
      const m = boxOf(mark ?? null);
      const target = layoutBox(document.querySelector<HTMLElement>(".dock-dot"));
      if (!entry || !mark || !m || !target) return;

      const em = parseFloat(getComputedStyle(mark).fontSize);
      const thick = Math.max(3, em * 0.055);
      const underline = m.y + m.h - thick;
      const d = target.w;

      // The underline is drawn inside the text, then handed to the line layer.
      tl.fromTo(entry, { "--u": 0 }, { "--u": 1, duration: at(8), ease: "power2.out" }, at(68));
      tl.set(entry, { "--u": 0 }, at(84));

      gsap.set(dot, { x: m.x, y: underline, width: m.w, height: thick, borderRadius: thick, autoAlpha: 0 });
      tl.set(dot, { autoAlpha: 1 }, at(84));
      // Pulls into a dot at the middle of the word, then falls to the dock.
      tl.to(dot, { x: m.x + m.w / 2 - d / 2, y: underline + thick / 2 - d / 2, width: d, height: d, borderRadius: d, duration: at(10), ease: "power2.inOut" }, at(84));
      tl.to(dot, { x: target.x, duration: at(30), ease: "power1.inOut" }, at(96));
      tl.to(dot, { y: target.y, duration: at(30), ease: "power2.in" }, at(96));
      tl.set(dot, { autoAlpha: 0 }, 0.999);
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

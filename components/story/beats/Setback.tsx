"use client";

import { content } from "@/lib/content";
import { PhotoLayer, reportCredits } from "../media/PhotoLayer";
import { useBeat } from "./useBeat";
import { useStageSize } from "./stage";

const c = content.story.setback;

/**
 * It did not go to plan. The chart (its own element) closes in on the
 * setbacks over a photo of a hard moment. Then the two lists: what John
 * could not control loosens, blurs and sinks; what he could control locks in,
 * each word underlined by the line. The chart returns for the qualification.
 */
export function Setback() {
  const size = useStageSize();

  const scope = useBeat(
    "setback",
    ({ tl, q, root }) => {
      if (!size.w) return;
      const photo = q(".photo-layer")[0];
      const inner = q(".photo-layer .pl-inner")[0];
      const cols = q(".sort")[0];
      const cannot = q(".sort-cannot li");
      const can = q(".sort-can li");
      const lines = q(".sort-can .u-line");

      tl.fromTo(photo, { opacity: 0 }, { opacity: 0.35, duration: 0.08 }, 0);
      tl.fromTo(inner, { scale: 1.08 }, { scale: 1, duration: 0.34 }, 0);
      tl.to(photo, { opacity: 0, duration: 0.06 }, 0.28);

      tl.fromTo(cols, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.31);
      tl.fromTo([...cannot, ...can], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.04, stagger: 0.006, ease: "power2.out" }, 0.31);

      // What he could not control comes loose and sinks out of focus.
      cannot.forEach((li, i) => {
        tl.to(li, { y: size.h * (0.06 + i * 0.035), rotation: i % 2 ? 4 : -3, filter: "blur(6px)", opacity: 0.12, duration: 0.12, ease: "power1.in" }, 0.4 + i * 0.012);
      });
      // What he could control locks in.
      tl.fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.05, stagger: 0.03, ease: "power2.out" }, 0.45);
      tl.to(cols, { autoAlpha: 0, duration: 0.04 }, 0.62);

      return (b) => {
        reportCredits(root, b.active);
      };
    },
    [size.w, size.h],
  );

  return (
    <div className="beat" ref={scope} data-beat="setback">
      <PhotoLayer slug="track-lying" beat="setback" focus="50% 45%" />
      <div className="L L-set">
        <div className="sort" aria-hidden="true">
          <ul className="sort-cannot">
            {c.uncontrollable.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <ul className="sort-can">
            {c.controllable.map((w) => (
              <li key={w}>
                {w}
                <span className="u-line" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

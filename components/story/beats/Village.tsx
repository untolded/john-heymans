"use client";

import Image from "next/image";
import { photo } from "@/lib/photos";
import { credits } from "@/lib/story/credits";
import { useLoadGate } from "@/lib/story/media";
import { useBeat } from "./useBeat";
import { useStageSize } from "./stage";

const P = photo("lavender-race");
const FOCUS = "58% 18%";

/**
 * The one warm, human beat. The stage splits: on the left the same photo
 * cropped tight, dimmed and out of focus, the pressure; on the right John,
 * sharp and in full colour. The divider is the amber line. When he chooses to
 * enjoy it, the line slides away and the smiling frame takes the screen.
 *
 * Stand-in until village photos (V1) arrive: lavender-race, Paris 2024,
 * which is Paris but not the village.
 */
export function Village() {
  const size = useStageSize();
  const gate = useLoadGate("village");

  const scope = useBeat(
    "village",
    ({ tl, q, root }) => {
      if (!size.w) return;
      const set = q(".village")[0];
      const right = q(".vl-right")[0];
      const divider = q(".vl-divider")[0];
      const scrim = q(".vl-scrim")[0];

      tl.fromTo(right, { scale: 1.06 }, { scale: 1, duration: 0.55 }, 0);
      tl.fromTo(divider, { scaleY: 0 }, { scaleY: 1, duration: 0.1, ease: "power2.inOut" }, 0.04);
      // The choice: the line slides to the edge and the smiling frame takes the screen.
      // Clip paths and transforms only, so nothing on the page is laid out again.
      tl.fromTo(root, { "--split": 50 }, { "--split": 0, duration: 0.25, ease: "power2.inOut" }, 0.55);
      // On the right, his face sits in the middle of the right half, then of the whole frame.
      tl.fromTo(q(".vl-right .vl-shift"), { xPercent: 17 }, { xPercent: 0, duration: 0.25, ease: "power2.inOut" }, 0.55);
      tl.to(divider, { opacity: 0, duration: 0.04 }, 0.78);
      tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.67);

      // Entry and exit in one place, so nothing else writes this opacity.
      return (b) => {
        const enter = Math.min(1, b.progress / 0.1);
        const exit = b.hide < 0.3 ? 1 - b.hide / 0.3 : 0;
        const o = b.active ? enter * exit : 0;
        set.style.opacity = String(o);
        credits.report("lavender-race@village", P.credit, o > 0.25 ? 1 : 0);
      };
    },
    [size.w, size.h],
  );

  return (
    <div className="beat" ref={scope} data-beat="village">
      <div className="L L-media village">
        <div className="vl-left">
          <div className="vl-shift">
            {gate.load && <Image src={P.src} alt="" fill sizes="100vw" fetchPriority={gate.priority} className="vl-img" style={{ objectPosition: FOCUS }} />}
          </div>
          <div className="vl-dim" />
        </div>
        <div className="vl-right">
          <div className="vl-shift">
            {gate.load && <Image src={P.src} alt="" fill sizes="100vw" fetchPriority={gate.priority} className="vl-img" style={{ objectPosition: FOCUS }} />}
          </div>
        </div>
        <div className="vl-scrim" />
        <div className="vl-copy-scrim" />
      </div>
      <div className="L L-line">
        {/* The wrapper carries the position; GSAP scales the line inside and would clear a translate on it. */}
        <span className="vl-divider-pos">
          <span className="vl-divider" />
        </span>
      </div>
    </div>
  );
}

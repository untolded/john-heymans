"use client";

import Image from "next/image";
import { photo } from "@/lib/photos";
import { credits } from "@/lib/story/credits";
import { useLoadGate } from "@/lib/story/media";
import { useBeat } from "./useBeat";
import { useStageSize } from "./stage";

// No photos exist from inside the village. These two carry the choice instead:
// the pressure on one side, the enjoyment on the other.
const TENSE = photo("outdoor-portrait");
const JOY = photo("track-laugh");
const TENSE_FOCUS = "30% 14%";
/** Focus of the smiling frame when it fills the screen, per orientation. */
const JOY_FOCUS = { x: "38% 42%", y: "10% 30%" };
/**
 * How far the smiling frame starts pushed into its half, as a percentage of
 * the stage, so his face sits in the middle of that half. It eases to zero
 * with the split, and never runs ahead of it, so no edge is ever uncovered.
 */
const JOY_PUSH = { x: 37, y: 44 };

/**
 * The one warm, human beat. The stage splits: on one side John under
 * pressure, dimmed; on the other John laughing, in full colour. The divider
 * is the amber line. When he chooses to enjoy it, the line slides away and
 * the smiling frame takes the screen. Side by side on landscape screens,
 * stacked on portrait ones.
 */
export function Village() {
  const size = useStageSize();
  const gate = useLoadGate("village");
  const axis = size.w && size.w < size.h ? "y" : "x";

  const scope = useBeat(
    "village",
    ({ tl, q, root }) => {
      if (!size.w) return;
      const set = q(".village")[0];
      const right = q(".vl-right")[0];
      const divider = q(".vl-divider")[0];
      const scrim = q(".vl-scrim")[0];
      const shift = q(".vl-right .vl-shift");
      const push = JOY_PUSH[axis];

      tl.fromTo(right, { scale: 1.06 }, { scale: 1, duration: 0.55 }, 0);
      tl.fromTo(divider, axis === "x" ? { scaleY: 0 } : { scaleX: 0 }, { ...(axis === "x" ? { scaleY: 1 } : { scaleX: 1 }), duration: 0.1, ease: "power2.inOut" }, 0.04);
      // The choice: the line slides to the edge and the smiling frame takes the screen.
      // Clip paths and transforms only, so nothing on the page is laid out again.
      tl.fromTo(root, { "--split": 50 }, { "--split": 0, duration: 0.25, ease: "power2.inOut" }, 0.55);
      tl.fromTo(shift, axis === "x" ? { xPercent: push } : { yPercent: push }, { ...(axis === "x" ? { xPercent: 0 } : { yPercent: 0 }), duration: 0.25, ease: "power2.inOut" }, 0.55);
      tl.to(divider, { opacity: 0, duration: 0.04 }, 0.78);
      tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.67);

      // Entry and exit in one place, so nothing else writes this opacity.
      return (b) => {
        const enter = Math.min(1, b.progress / 0.1);
        const exit = b.hide < 0.3 ? 1 - b.hide / 0.3 : 0;
        const o = b.active ? enter * exit : 0;
        set.style.opacity = String(o);
        // The tense frame has gone once the split is nearly closed.
        credits.report("outdoor-portrait@village", TENSE.credit, o > 0.25 && b.progress < 0.74 ? 1 : 0);
        credits.report("track-laugh@village", JOY.credit, o > 0.25 ? 1 : 0);
      };
    },
    [size.w, size.h, axis],
  );

  return (
    <div className="beat" ref={scope} data-beat="village">
      <div className="L L-media village" data-axis={axis}>
        <div className="vl-left">
          <div className="vl-box">
            {gate.load && <Image src={TENSE.src} alt="" fill sizes="(orientation: portrait) 100vw, 50vw" fetchPriority={gate.priority} className="vl-img" style={{ objectPosition: TENSE_FOCUS }} />}
          </div>
          <div className="vl-dim" />
        </div>
        <div className="vl-right">
          <div className="vl-shift">
            {gate.load && <Image src={JOY.src} alt="" fill sizes="100vw" fetchPriority={gate.priority} className="vl-img" style={{ objectPosition: JOY_FOCUS[axis] }} />}
          </div>
        </div>
        <div className="vl-scrim" />
        <div className="vl-copy-scrim" />
      </div>
      <div className="L L-line">
        {/* The wrapper carries the position; GSAP scales the line inside and would clear a translate on it. */}
        <span className="vl-divider-pos" data-axis={axis}>
          <span className="vl-divider" />
        </span>
      </div>
    </div>
  );
}

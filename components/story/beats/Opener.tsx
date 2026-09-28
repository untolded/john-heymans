"use client";

import { content } from "@/lib/content";
import { gsap } from "@/lib/story/gsap";
import { BEATS, BEAT_INDEX, v } from "@/lib/story/beats";
import { Text } from "../Text";
import { useBeat } from "./useBeat";
import { useStageSize, boxOf, entryEl } from "./stage";

const c = content.story;
const LENGTH = BEATS[BEAT_INDEX.opener].length.desktop / 100; // the opener's scroll length in stage heights
const at = (vh: number) => v("opener", vh);

/**
 * The title card. The sentence fills the screen word by word (the overlay
 * paces it by scroll). Two ghost copies behind it drift apart at 0.4 and 0.2
 * of the scroll speed. Then the start line draws under DONE, the sentence
 * leaves, and the line slides to the left edge, where the flight to Kenya
 * will pick it up.
 */
export function Opener() {
  const size = useStageSize();

  const scope = useBeat(
    "opener",
    ({ tl, q }) => {
      if (!size.w) return;
      const line = q(".startline")[0];
      const done = entryEl("opener.title", ".tl:last-child") ?? entryEl("opener.title");
      const b = boxOf(done);
      if (!b) return;

      if (!size.touch) {
        const [g1, g2] = q(".ghost");
        tl.fromTo(g1, { opacity: 0 }, { opacity: 0.06, duration: at(10) }, at(2));
        tl.fromTo(g2, { opacity: 0 }, { opacity: 0.03, duration: at(10) }, at(2));
        tl.fromTo(g1, { y: 0, scale: 1.4 }, { y: -0.4 * LENGTH * size.h, scale: 1.46, duration: 1 }, 0);
        tl.fromTo(g2, { y: 0, scale: 1.8 }, { y: -0.2 * LENGTH * size.h, scale: 1.9, duration: 1 }, 0);
        tl.to([g1, g2], { opacity: 0, duration: at(14) }, at(86));
      }

      const y = b.y + b.h + Math.max(8, size.h * 0.014);
      gsap.set(line, { x: b.x, y, width: b.w, scaleX: 0 });
      tl.to(line, { scaleX: 1, duration: at(24), ease: "power2.inOut" }, at(60));
      tl.to(line, { x: 48 - b.w, duration: at(30), ease: "power2.in" }, at(90));

      // Iten's sweep draws straight over the stub, then the stub is no longer needed.
      return (s) => {
        line.style.opacity = s.hide > 0.05 ? "0" : "1";
      };
    },
    [size.w, size.h, size.touch],
  );

  return (
    <div className="beat" ref={scope} data-beat="opener">
      <div className="L L-set opener-ghosts">
        <p className="ghost">
          <Text text={c.opener.title} />
        </p>
        <p className="ghost">
          <Text text={c.opener.title} />
        </p>
      </div>
      <div className="L L-line">
        <span className="startline" />
      </div>
    </div>
  );
}

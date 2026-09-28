"use client";

import { v } from "@/lib/story/beats";
import { gsap } from "@/lib/story/gsap";
import { VideoLayer, playWhile } from "../media/VideoLayer";
import { useBeat } from "./useBeat";
import { useStageSize } from "./stage";

const at = (vh: number) => v("prologue", vh);

/**
 * John's prologue, shot like the opening of a film. As the stage comes up
 * over the hero, the frame is already running: a drone following him alone
 * along a red road in Iten, graded down into the night palette, with grain.
 * Letterbox bars close in, and his three lines arrive one at a time (the
 * overlay sets them, see lib/story/script). The camera keeps pushing in. On
 * the last line the bars open, the road fades, and the story starts.
 */
export function Prologue() {
  const size = useStageSize();

  const scope = useBeat(
    "prologue",
    ({ tl, q }) => {
      if (!size.w) return;
      const [top, bottom] = q(".pro-bar");
      const media = q(".pro-media")[0];
      const video = q(".vd-follow")[0];

      tl.fromTo([top, bottom], { scaleY: 0 }, { scaleY: 1, duration: at(14), ease: "power2.inOut" }, 0);
      tl.fromTo(q(".vd-follow .pl-inner"), { scale: 1.04 }, { scale: 1.2, duration: 1, ease: "none" }, 0);
      tl.to([top, bottom], { scaleY: 0, duration: at(22), ease: "power2.inOut" }, at(160));
      tl.to(media, { opacity: 0, duration: at(22), ease: "power1.in" }, at(164));

      return (b) => {
        // The film runs from the moment the stage starts to cover the hero.
        media.style.visibility = b.show > 0 && b.hide < 1 ? "visible" : "hidden";
        playWhile(video, b.active && b.show > 0 ? Number(gsap.getProperty(media, "opacity")) : 0, "follow@prologue");
      };
    },
    [size.w, size.h],
  );

  return (
    <div className="beat" ref={scope} data-beat="prologue">
      <div className="L L-media pro-media">
        <VideoLayer name="road-follow" beat="prologue" className="vd-follow" preload="none" rate={0.72} />
        <div className="L pro-grade" />
        <div className="L pro-grain" />
      </div>
      <div className="L L-set pro-set" aria-hidden="true">
        <span className="pro-bar pro-bar-top" />
        <span className="pro-bar pro-bar-bottom" />
      </div>
    </div>
  );
}

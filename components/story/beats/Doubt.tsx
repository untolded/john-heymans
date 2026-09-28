"use client";

import { gsap } from "@/lib/story/gsap";
import { v } from "@/lib/story/beats";
import * as R from "@/lib/story/reveals";
import { NotificationCard, doubterMessages } from "../set-pieces/Notification";
import { useBeat, cues } from "./useBeat";
import { useStageSize, boxOf } from "./stage";

const MESSAGES = doubterMessages();
/** A moment in this beat, in viewport heights of scroll. */
const at = (vh: number) => v("doubt", vh);

/**
 * The risk. As the ChatGPT window folds back into the dock, federation,
 * coach and competitors arrive where it was, under "My team and my peers
 * called me crazy": three messages, large, in the middle of the screen. Then
 * the amber line sweeps across the stage and pushes them off the edge, and
 * "I ran it anyway". The ranking chart that follows is its own element
 * (Chart).
 */
export function Doubt() {
  const size = useStageSize();

  const scope = useBeat(
    "doubt",
    ({ tl, q }) => {
      if (!size.w) return;
      const cards = q(".notif");
      const stack = q(".notif-stack")[0];
      const line = q(".push-line")[0];
      gsap.set(cards, { autoAlpha: 0 });

      const onCue = cues(
        cards.map((card, i) => ({
          at: at(18 + i * 14),
          on: () => R.flash(card),
          off: () => void gsap.set(card, { autoAlpha: 0, x: 0 }),
        })),
      );

      // The line's head meets the cards and carries them off at its own speed.
      const s = boxOf(stack)!;
      const midY = s.y + s.h / 2;
      const start = at(80);
      const dur = at(16);
      const meet = start + dur * (s.x / size.w);
      gsap.set(line, { y: midY, scaleX: 0 });
      tl.to(line, { scaleX: 1, duration: dur, ease: "none" }, start);
      tl.to(stack, { x: size.w - s.x + 32, duration: start + dur - meet + dur * ((s.w + 32) / size.w), ease: "none" }, meet);
      tl.to(line, { opacity: 0, duration: at(10) }, start + dur + at(2));

      return (b) => onCue(b.progress);
    },
    [size.w, size.h],
  );

  return (
    <div className="beat" ref={scope} data-beat="doubt">
      <div className="L L-set">
        <div className="notif-stack">
          {MESSAGES.map((m) => (
            <NotificationCard key={m.role} m={m} />
          ))}
        </div>
      </div>
      <div className="L L-line">
        <span className="push-line" />
      </div>
    </div>
  );
}

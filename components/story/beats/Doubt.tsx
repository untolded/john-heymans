"use client";

import { gsap } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { NotificationCard, doubterMessages } from "../set-pieces/Notification";
import { useBeat, cues } from "./useBeat";
import { useStageSize, boxOf } from "./stage";

const MESSAGES = doubterMessages();

/**
 * The risk. Federation, coach and competitors arrive as notifications, the
 * season the algorithm chose dimmed behind them. Then "I ran it anyway", and
 * the amber line sweeps across the stage and pushes them off the edge. The
 * chart that follows is its own element (Chart), because it runs on into the
 * setbacks.
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
          at: 0.05 + i * 0.1,
          on: () => R.flash(card),
          off: () => void gsap.set(card, { autoAlpha: 0, x: 0 }),
        })),
      );

      // The line's head meets the cards and carries them off at its own speed.
      const s = boxOf(stack)!;
      const midY = s.y + s.h / 2;
      const start = 0.46;
      const dur = 0.05;
      const meet = start + dur * (s.x / size.w);
      gsap.set(line, { y: midY, scaleX: 0 });
      tl.to(line, { scaleX: 1, duration: dur, ease: "none" }, start);
      tl.to(stack, { x: size.w - s.x + 32, duration: start + dur - meet + dur * ((s.w + 32) / size.w), ease: "none" }, meet);
      tl.to(line, { opacity: 0, duration: 0.04 }, start + dur + 0.01);

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

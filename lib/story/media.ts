"use client";

import { useEffect, useState } from "react";
import { BEAT_INDEX, at, type BeatId, type Moment } from "./beats";
import { driver } from "./driver";
import { scroller } from "./scroll";
import { story } from "./store";

/**
 * The load queue. All beats share one sticky stage, so the browser's own
 * lazy loading would fetch every photo the moment the stage appears. Instead
 * a beat's media mounts when the story is close enough: while beat N is
 * current, beat N+1 loads at high priority and N+2 at low priority. Phones
 * look ahead the same two beats and never further.
 */

const AHEAD = 2;

export type LoadState = { load: boolean; priority: "high" | "low" };

export function useLoadGate(beat: BeatId): LoadState {
  const target = BEAT_INDEX[beat];
  const [state, setState] = useState<LoadState>({ load: target <= AHEAD - 1, priority: target === 0 ? "high" : "low" });

  useEffect(() => {
    if (state.load && state.priority === "high") return;
    return story.onTime((t) => {
      const current = Math.max(0, Math.floor(t));
      const distance = target - current;
      if (distance <= 1) setState({ load: true, priority: "high" });
      else if (distance <= AHEAD && !state.load) setState({ load: true, priority: "low" });
    });
  }, [target, state.load, state.priority]);

  return state;
}

/** Screens of scroll before a clip appears at which its poster and file start loading. */
const WARM = 1.5;

/** Which cut fits the screen, decided once, when the clip is first needed. */
export type Warm = { poster: boolean; video: boolean; portrait: boolean };

const portrait = () => typeof window !== "undefined" && matchMedia("(orientation: portrait)").matches;

/**
 * When a story clip may load: its poster once the scroll is WARM screens from
 * the moment it appears, the clip itself at the same distance but never before
 * the reader has scrolled at all, so the first load is the hero and nothing
 * else. `now` loads both at once.
 */
export function useWarm(appear: Moment, mounted: boolean, now = false): Warm {
  const [warm, setWarm] = useState<Warm>(() => ({ poster: now, video: now, portrait: portrait() }));
  const [beat, p] = appear;

  useEffect(() => {
    if (!mounted || (warm.poster && warm.video)) return;
    const t = at([beat, p]);
    const check = () => {
      if (!driver.ready()) return;
      const y = scroller.y();
      if (driver.yAt(t) - y > WARM * window.innerHeight) return;
      const video = y > 4;
      if (!warm.poster || video !== warm.video) setWarm({ poster: true, video, portrait: warm.poster ? warm.portrait : portrait() });
    };
    // Story time only changes with the scroll, so look once the driver has measured, too.
    // Never before the page has loaded: the hero's poster comes first.
    let first = 0;
    const later = () => void (first = window.setTimeout(check, 400));
    if (document.readyState === "complete") later();
    else addEventListener("load", later, { once: true });
    const off = story.onTime(() => document.readyState === "complete" && check());
    return () => {
      removeEventListener("load", later);
      clearTimeout(first);
      off();
    };
  }, [mounted, beat, p, warm.poster, warm.video, warm.portrait]);

  return warm;
}

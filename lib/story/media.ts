"use client";

import { useEffect, useState } from "react";
import { BEAT_INDEX, type BeatId } from "./beats";
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

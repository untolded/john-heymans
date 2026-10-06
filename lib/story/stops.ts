import { v, type BeatId, type Moment } from "./beats";
import { SCRIPT } from "./script";
import { DRAW } from "./ranking";

/**
 * The stops: moments where one piece of the story is whole on screen and
 * readable. A fast flick or a trackpad fling eases into the next stop and
 * holds there, so it can never carry the reader past a line unread; the
 * next gesture carries on (lib/story/stopper.ts). Slow scrolling never
 * notices them.
 *
 * Most stops sit a little after a script line arrives, so its reveal plays
 * while the page holds and they follow the line if its timing is tuned.
 * The rest are set pieces with no line of copy: the landing in Iten, the
 * ChatGPT window, the finished chart, the handwriting. Offsets are viewport
 * heights of scroll (desktop lengths), like everything else in beats.ts.
 */

export type Stop = { id: string; at: Moment };

/** vh of scroll after a script line arrives, never later than halfway through its stay. */
const after = (entry: string, vh: number): Stop => {
  const e = SCRIPT.find((s) => s.id === entry);
  if (!e) throw new Error(`stops: no script entry "${entry}"`);
  const [beat, from] = e.from;
  const room = e.to[0] === beat ? (e.to[1] - from) / 2 : Infinity;
  return { id: entry, at: [beat, from + Math.min(v(beat, vh), room)] };
};

/** A moment in a set piece, in vh of scroll into its beat. */
const moment = (id: string, beat: BeatId, vh: number): Stop => ({ id, at: [beat, v(beat, vh)] });

export const STOPS: readonly Stop[] = [
  after("prologue.1", 18),
  after("prologue.2", 14),
  after("iten.title", 18),
  // The flight has landed: Brussels and Iten both marked, before the dive.
  moment("iten.landed", "iten", 99),
  after("iten.line", 18),
  after("edge.a", 14),
  // "I needed an edge", with its underline drawn.
  after("edge.b", 22),
  // The prompt has been sent.
  moment("algorithm.prompt", "algorithm", 42),
  // ChatGPT's two thinking steps.
  moment("algorithm.thinking", "algorithm", 72),
  // The whole code block, every line written (lines arrive from 92 to 154 vh, Algorithm.tsx).
  moment("algorithm.code", "algorithm", 158),
  // The ranking line has reached 31st.
  { id: "climb.chart", at: [DRAW.to[0], DRAW.to[1] + v("climb", 4)] },
  after("final.a", 14),
  after("final.b", 14),
  // "Hey mom, made it": both phrases written on the arms.
  moment("final.arms", "final", 136),
  // "Dare to dream big", with its finish line.
  after("final.close", 26),
];

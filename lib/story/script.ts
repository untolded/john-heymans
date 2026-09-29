import { content } from "@/lib/content";
import { v, type BeatId, type Moment } from "./beats";

/**
 * The script of the story. Every line of story copy is declared here against
 * story time, never against page position (the USAvionix pattern). The copy
 * overlay shows at most one entry per slot, swapped with a short discrete
 * reveal. In static mode the same entries render in order, so what a screen
 * reader hears is exactly what the film shows.
 */

export type StoryContent = typeof content.story;

/** Every card shares one slot, in the middle of the stage. */
export type Slot = "centre";
export type Reveal = "words" | "rise" | "ink" | "type" | "flash" | "scribble";
export type Exit = "rise" | "blur" | "cut";
/** Visual weight of the entry. */
export type Kind = "prologue" | "close" | "title" | "record";

export type CopyEntry = {
  id: string;
  beat: BeatId;
  slot: Slot;
  kind: Kind;
  text: (c: StoryContent) => string;
  from: Moment;
  to: Moment;
  reveal: Reveal;
  exit?: Exit;
  /** Milliseconds an entry stays after revealing before a small scroll back can remove it. */
  minHold?: number;
  /** Beat progress at which each word arrives, for title cards paced by the scroll. */
  steps?: number[];
  /** Lesson number, for the practical part to link back to. */
  lesson?: number;
  /** A centre card set in the lower third, over a scrim, clear of the faces in the photo behind it. */
  low?: boolean;
  /** The bars in the copy are for wide screens only; on a phone the card wraps on its own. */
  flow?: boolean;
};

/** A moment written as viewport heights of scroll into a beat. */
const m = (beat: BeatId, vh: number): Moment => [beat, v(beat, vh)];

const prologueLine = (i: 0 | 1, from: number, to: number): CopyEntry => ({
  id: `prologue.${i + 1}`,
  beat: "prologue",
  slot: "centre",
  kind: "prologue",
  text: (c) => c.prologue.lines[i],
  from: m("prologue", from),
  to: m("prologue", to),
  reveal: "words",
  exit: "blur",
  flow: true,
});

export const SCRIPT: readonly CopyEntry[] = [
  // John's prologue, one line at a time inside the letterbox. The first line is the long one.
  prologueLine(0, 12, 74),
  prologueLine(1, 80, 124),

  // Starts while the letterbox is still opening, so there is no empty screen. The globe steps
  // back behind the title; it has gone before Brussels is marked.
  { id: "iten.title", beat: "iten", slot: "centre", kind: "title", text: (c) => c.iten.title, from: m("iten", -4), to: m("iten", 38), reveal: "rise", exit: "blur", flow: true },
  // Set high, over the dust, so the pack coming at the camera stays in view.
  { id: "iten.line", beat: "iten", slot: "centre", kind: "record", text: (c) => c.iten.line, from: m("iten", 130), to: m("iten", 196), reveal: "ink", exit: "blur", flow: true },

  { id: "edge.a", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.a, from: m("edge", 14), to: m("edge", 52), reveal: "rise", exit: "blur" },
  { id: "edge.b", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.b, from: m("edge", 55), to: m("edge", 96), reveal: "rise", exit: "rise" },

  // The algorithm speaks only inside its own window (beats/Algorithm).

  // Above the chart from the moment it appears, until the stadium takes over.
  { id: "climb.record", beat: "climb", slot: "centre", kind: "record", text: (c) => c.climb.record, from: m("climb", 14), to: m("climb", 154), reveal: "ink", exit: "blur", flow: true },

  // Title cards in the lower third, so the story keeps talking over the heats.
  { id: "final.a", beat: "final", slot: "centre", kind: "title", text: (c) => c.final.a, from: m("final", 16), to: m("final", 52), reveal: "rise", exit: "blur", low: true },
  { id: "final.b", beat: "final", slot: "centre", kind: "title", text: (c) => c.final.b, from: m("final", 56), to: m("final", 88), reveal: "rise", exit: "blur", low: true },
  { id: "final.close", beat: "final", slot: "centre", kind: "close", text: (c) => c.final.close, from: m("final", 198), to: m("handover", 10), reveal: "words", exit: "blur", lesson: 5 },

  // Stays until the stage has scrolled away.
  { id: "handover.line", beat: "handover", slot: "centre", kind: "title", text: (c) => c.handover.line, from: m("handover", 13), to: ["handover", 9], reveal: "rise" },
];

/** The script entries of one beat, in order, for the static layout. */
export const entriesOf = (beat: BeatId) => SCRIPT.filter((e) => e.beat === beat);

/** Where a lesson sits in the story, if it does: the line it is. */
export const lessonEntry = (n: number) => SCRIPT.find((e) => e.lesson === n);

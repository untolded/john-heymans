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
export type Reveal = "fade" | "words" | "rise" | "ink" | "type" | "flash" | "scribble";
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
  /** On wide screens the written lines set the measure, so each bar-separated line stays one line. */
  wide?: boolean;
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
  // Each line is there whole, at once: a short fade, no typing.
  reveal: "fade",
  exit: "blur",
  flow: true,
});

export const SCRIPT: readonly CopyEntry[] = [
  // John's prologue, one line at a time inside the letterbox. The first line is the long one.
  prologueLine(0, 10, 60),
  prologueLine(1, 64, 104),

  // Starts while the letterbox is still opening, so there is no empty screen. The flight plays behind
  // it, smaller and dimmer, so title and globe are read in one look (beats/Iten).
  { id: "iten.title", beat: "iten", slot: "centre", kind: "title", text: (c) => c.iten.title, from: m("iten", -4), to: m("iten", 46), reveal: "rise", exit: "blur", flow: true },
  // Set high, over the dust, so the pack coming at the camera stays in view. There whole, at once.
  { id: "iten.line", beat: "iten", slot: "centre", kind: "record", text: (c) => c.iten.line, from: m("iten", 70), to: m("iten", 122), reveal: "fade", exit: "blur", flow: true },

  // One sentence; its underline becomes the dock's running light (beats/Edge).
  { id: "edge.line", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.line, from: m("edge", 6), to: m("edge", 60), reveal: "rise", exit: "rise" },

  // The algorithm speaks only inside its own window (beats/Algorithm).

  // Above the chart from the moment it appears, until the stadium takes over.
  { id: "climb.record", beat: "climb", slot: "centre", kind: "record", text: (c) => c.climb.record, from: m("climb", 14), to: m("climb", 116), reveal: "ink", exit: "blur", flow: true },

  // The chart goes straight to the arms; "Hey mom, made it" is written on them (beats/Final). The
  // close stays while the photo goes dark and the practical part rises over it.
  { id: "final.close", beat: "final", slot: "centre", kind: "close", text: (c) => c.final.close, from: m("final", 94), to: ["handover", 2.5], reveal: "words", exit: "blur", lesson: 5 },
];

/** The script entries of one beat, in order, for the static layout. */
export const entriesOf = (beat: BeatId) => SCRIPT.filter((e) => e.beat === beat);

/** Where a lesson sits in the story, if it does: the line it is. */
export const lessonEntry = (n: number) => SCRIPT.find((e) => e.lesson === n);

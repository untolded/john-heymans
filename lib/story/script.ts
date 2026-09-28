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

/** centre: title cards. lesson: the lesson cards. */
export type Slot = "centre" | "lesson";
export type Reveal = "words" | "rise" | "ink" | "type" | "flash" | "scribble";
export type Exit = "rise" | "blur" | "cut";
/** Visual weight of the entry. */
export type Kind = "prologue" | "opener" | "title" | "record" | "lesson";

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

const lessonCard = (n: 1 | 2, beat: BeatId, from: Moment, to: Moment): CopyEntry => ({
  id: `lesson.${n}`,
  beat,
  slot: "lesson",
  kind: "lesson",
  lesson: n,
  text: (c) => c.lessons[n - 1].title,
  from,
  to,
  reveal: "ink",
  exit: "blur",
});

/** A moment written as viewport heights of scroll into a beat. */
const m = (beat: BeatId, vh: number): Moment => [beat, v(beat, vh)];

const prologueLine = (i: 0 | 1 | 2, from: number, to: number): CopyEntry => ({
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
  // John's prologue, one line at a time inside the letterbox.
  prologueLine(0, 12, 58),
  prologueLine(1, 64, 110),
  prologueLine(2, 116, 158),

  {
    id: "opener.title",
    beat: "opener",
    slot: "centre",
    kind: "opener",
    text: (c) => c.opener.title,
    // Starts while the letterbox is still opening, so there is no empty screen.
    from: m("opener", -22),
    to: m("opener", 92),
    reveal: "words",
    // One word per threshold, so a fast scroll still gets the full cadence.
    steps: [-17, -6, 4, 13, 21, 29, 38].map((vh) => v("opener", vh)),
    exit: "blur",
  },

  // The globe steps back behind the title; it has gone before Brussels is marked.
  { id: "iten.title", beat: "iten", slot: "centre", kind: "title", text: (c) => c.iten.title, from: m("iten", 3), to: m("iten", 38), reveal: "rise", exit: "blur", flow: true },
  // Set high, over the dust, so the pack coming at the camera stays in view.
  { id: "iten.line", beat: "iten", slot: "centre", kind: "record", text: (c) => c.iten.line, from: m("iten", 160), to: m("iten", 222), reveal: "ink", exit: "blur", flow: true },
  lessonCard(1, "iten", m("iten", 237), m("edge", 12)),

  { id: "edge.a", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.a, from: m("edge", 14), to: m("edge", 52), reveal: "rise", exit: "blur" },
  { id: "edge.b", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.b, from: m("edge", 55), to: m("edge", 96), reveal: "rise", exit: "rise" },

  // The algorithm speaks only inside its own window (beats/Algorithm).

  // Above the three messages while they arrive, gone before the line pushes them off.
  { id: "doubt.title", beat: "doubt", slot: "centre", kind: "record", text: (c) => c.doubt.title, from: m("doubt", 10), to: m("doubt", 78), reveal: "ink", exit: "blur", flow: true },
  { id: "doubt.answer", beat: "doubt", slot: "centre", kind: "title", text: (c) => c.doubt.answer, from: m("doubt", 100), to: m("doubt", 136), reveal: "rise", exit: "blur" },
  { id: "doubt.record", beat: "doubt", slot: "centre", kind: "record", text: (c) => c.doubt.record, from: m("doubt", 142), to: m("doubt", 228), reveal: "ink", exit: "blur" },
  lessonCard(2, "doubt", m("doubt", 231), m("final", 12)),

  // Title cards in the lower third, so the story keeps talking over the heats.
  { id: "final.a", beat: "final", slot: "centre", kind: "title", text: (c) => c.final.a, from: m("final", 16), to: m("final", 52), reveal: "rise", exit: "blur", low: true },
  { id: "final.b", beat: "final", slot: "centre", kind: "title", text: (c) => c.final.b, from: m("final", 56), to: m("final", 88), reveal: "rise", exit: "blur", low: true },
  { id: "final.close", beat: "final", slot: "centre", kind: "opener", text: (c) => c.final.close, from: m("final", 198), to: m("handover", 10), reveal: "words", exit: "blur", lesson: 5 },

  // Stays until the stage has scrolled away.
  { id: "handover.line", beat: "handover", slot: "centre", kind: "title", text: (c) => c.handover.line, from: m("handover", 13), to: ["handover", 9], reveal: "rise" },
];

/** The script entries of one beat, in order, for the static layout. */
export const entriesOf = (beat: BeatId) => SCRIPT.filter((e) => e.beat === beat);

/** Where a lesson sits in the story, if it does: its card, or the line it is. */
export const lessonEntry = (n: number) => SCRIPT.find((e) => e.lesson === n && e.slot === "lesson") ?? SCRIPT.find((e) => e.lesson === n);

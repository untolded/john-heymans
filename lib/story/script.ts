import { content } from "@/lib/content";
import { fill } from "./format";
import type { BeatId, Moment } from "./beats";

/**
 * The script of the story. Every line of story copy is declared here against
 * story time, never against page position (the USAvionix pattern). The copy
 * overlay shows at most one entry per slot, swapped with a short discrete
 * reveal. In static mode the same entries render in order, so what a screen
 * reader hears is exactly what the film shows.
 */

export type StoryContent = typeof content.story;

/** centre: title cards. copy: bottom left, story sentences. lesson: the lesson cards. under: below the centre card. */
export type Slot = "centre" | "copy" | "lesson" | "under";
export type Reveal = "words" | "rise" | "ink" | "type" | "flash" | "scribble";
export type Exit = "rise" | "blur" | "cut";
/** Visual weight of the entry. */
export type Kind = "opener" | "title" | "sentence" | "record" | "lesson" | "lesson-line";

export type CopyEntry = {
  id: string;
  beat: BeatId;
  slot: Slot;
  kind: Kind;
  text: (c: StoryContent) => string;
  sub?: (c: StoryContent) => string;
  meta?: (c: StoryContent) => string;
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
};

const lessonCard = (n: 1 | 2 | 3 | 4, beat: BeatId, from: Moment, to: Moment): CopyEntry => ({
  id: `lesson.${n}`,
  beat,
  slot: "lesson",
  kind: "lesson",
  lesson: n,
  text: (c) => c.lessons[n - 1].title,
  sub: (c) => c.lessons[n - 1].line,
  meta: (c) => fill(c.lessonOf, { n, total: c.lessons.length }),
  from,
  to,
  reveal: "ink",
  exit: "blur",
});

export const SCRIPT: readonly CopyEntry[] = [
  {
    id: "opener.title",
    beat: "opener",
    slot: "centre",
    kind: "opener",
    text: (c) => c.opener.title,
    // Starts while the stage is still sliding in over the film, so there is no empty screen.
    from: ["opener", -0.3],
    to: ["opener", 0.78],
    reveal: "words",
    // One word per threshold, so a fast scroll still gets the full cadence.
    steps: [-0.26, -0.16, -0.07, 0.02, 0.09, 0.16, 0.23],
    exit: "blur",
  },

  { id: "iten.line", beat: "iten", slot: "copy", kind: "sentence", text: (c) => c.iten.line, from: ["iten", 0.66], to: ["iten", 0.86], reveal: "rise" },
  lessonCard(1, "iten", ["iten", 0.87], ["edge", 0.1]),

  { id: "edge.a", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.a, from: ["edge", 0.12], to: ["edge", 0.42], reveal: "rise", exit: "blur" },
  { id: "edge.b", beat: "edge", slot: "centre", kind: "title", text: (c) => c.edge.b, from: ["edge", 0.45], to: ["edge", 0.76], reveal: "rise", exit: "rise" },

  { id: "algorithm.caption", beat: "algorithm", slot: "copy", kind: "sentence", text: (c) => c.algorithm.caption, from: ["algorithm", 0.86], to: ["doubt", 0.05], reveal: "rise" },

  { id: "doubt.answer", beat: "doubt", slot: "centre", kind: "title", text: (c) => c.doubt.answer, from: ["doubt", 0.4], to: ["doubt", 0.55], reveal: "rise", exit: "blur" },
  { id: "doubt.record", beat: "doubt", slot: "centre", kind: "record", text: (c) => c.doubt.record, from: ["doubt", 0.8], to: ["doubt", 0.92], reveal: "ink", exit: "blur" },
  lessonCard(2, "doubt", ["doubt", 0.93], ["setback", 0.08]),

  { id: "setback.line", beat: "setback", slot: "copy", kind: "sentence", text: (c) => c.setback.line, from: ["setback", 0.09], to: ["setback", 0.3], reveal: "rise" },
  { id: "setback.focus", beat: "setback", slot: "copy", kind: "sentence", text: (c) => c.setback.focus, from: ["setback", 0.36], to: ["setback", 0.64], reveal: "rise" },
  { id: "setback.qualified", beat: "setback", slot: "centre", kind: "title", text: (c) => c.setback.qualified, from: ["setback", 0.72], to: ["setback", 0.89], reveal: "words", exit: "blur" },
  lessonCard(3, "setback", ["setback", 0.9], ["village", 0.08]),

  { id: "village.a", beat: "village", slot: "copy", kind: "sentence", text: (c) => c.village.a, from: ["village", 0.1], to: ["village", 0.35], reveal: "rise" },
  { id: "village.b", beat: "village", slot: "copy", kind: "sentence", text: (c) => c.village.b, from: ["village", 0.35], to: ["village", 0.6], reveal: "rise" },
  { id: "village.c", beat: "village", slot: "centre", kind: "title", text: (c) => c.village.c, from: ["village", 0.7], to: ["village", 0.87], reveal: "ink", exit: "blur" },
  lessonCard(4, "village", ["village", 0.88], ["final", 0.06]),

  { id: "final.a", beat: "final", slot: "copy", kind: "sentence", text: (c) => c.final.a, from: ["final", 0.07], to: ["final", 0.18], reveal: "rise" },
  { id: "final.b", beat: "final", slot: "copy", kind: "sentence", text: (c) => c.final.b, from: ["final", 0.18], to: ["final", 0.3], reveal: "rise" },
  { id: "final.close", beat: "final", slot: "centre", kind: "opener", text: (c) => c.final.close, from: ["final", 0.7], to: ["handover", 0.22], reveal: "words", exit: "blur", lesson: 5 },
  {
    id: "lesson.5",
    beat: "final",
    slot: "under",
    kind: "lesson-line",
    lesson: 5,
    text: (c) => c.lessons[4].line,
    meta: (c) => fill(c.lessonOf, { n: 5, total: c.lessons.length }),
    from: ["final", 0.78],
    to: ["handover", 0.22],
    reveal: "rise",
    exit: "blur",
  },

  // Stays until the stage has scrolled away.
  { id: "handover.line", beat: "handover", slot: "centre", kind: "title", text: (c) => c.handover.line, from: ["handover", 0.3], to: ["handover", 9], reveal: "rise" },
];

/** The script entries of one beat, in order, for the static layout. */
export const entriesOf = (beat: BeatId) => SCRIPT.filter((e) => e.beat === beat);

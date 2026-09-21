/**
 * The order, length and ground of every beat. Lengths are in viewport
 * heights and are the first thing to tune after a review: about two screens
 * per idea reads comfortably.
 *
 * Story time is one number for the whole film: the beat's index plus its
 * progress. ["iten", 0.4] is story time 1.4. Everything keyed to the story
 * (copy, telemetry, the ranking chip) is written in beat moments and
 * compared in story time.
 */

export const BEAT_IDS = ["opener", "iten", "edge", "algorithm", "doubt", "setback", "village", "final", "handover"] as const;
export type BeatId = (typeof BEAT_IDS)[number];

export const GROUNDS = ["night", "altitude", "signal", "low", "warm", "stadium", "paper"] as const;
export type Ground = (typeof GROUNDS)[number];

export type BeatConfig = {
  id: BeatId;
  /** Scroll length in viewport heights. */
  length: { desktop: number; touch: number };
  ground: Ground;
  /** Named in the frame's chapter indicator. */
  chapter: boolean;
  /** The lesson card this chapter ends on. */
  lesson?: 1 | 2 | 3 | 4 | 5;
};

export const BEATS: readonly BeatConfig[] = [
  { id: "opener", length: { desktop: 140, touch: 110 }, ground: "night", chapter: true },
  { id: "iten", length: { desktop: 300, touch: 240 }, ground: "altitude", chapter: true, lesson: 1 },
  // Longer than the first draft's 100vh: it carries the end of lesson 1, two lines and the caret cut.
  { id: "edge", length: { desktop: 140, touch: 110 }, ground: "night", chapter: true },
  { id: "algorithm", length: { desktop: 320, touch: 260 }, ground: "signal", chapter: true },
  { id: "doubt", length: { desktop: 240, touch: 200 }, ground: "signal", chapter: true, lesson: 2 },
  { id: "setback", length: { desktop: 220, touch: 180 }, ground: "low", chapter: true, lesson: 3 },
  { id: "village", length: { desktop: 180, touch: 150 }, ground: "warm", chapter: true, lesson: 4 },
  { id: "final", length: { desktop: 300, touch: 240 }, ground: "stadium", chapter: true, lesson: 5 },
  // The story ends on the dark. The practical part then rises over it as a sheet of paper.
  { id: "handover", length: { desktop: 100, touch: 80 }, ground: "night", chapter: false },
];

export const BEAT_INDEX = Object.fromEntries(BEATS.map((b, i) => [b.id, i])) as Record<BeatId, number>;
export const CHAPTERS = BEATS.filter((b) => b.chapter);

/** A point in the story: a beat and a progress inside it. */
export type Moment = readonly [BeatId, number];

/** Story time of a moment. */
export const at = ([id, p]: Moment): number => BEAT_INDEX[id] + p;

/** Progress of one beat at a given story time, 0 before it and 1 after it. */
export const local = (t: number, id: BeatId): number => Math.min(1, Math.max(0, t - BEAT_INDEX[id]));

/** Where t sits between two moments, clamped to 0..1. */
export const span = (t: number, from: Moment, to: Moment): number => {
  const a = at(from);
  const b = at(to);
  return Math.min(1, Math.max(0, (t - a) / (b - a)));
};

/**
 * Ground crossfades, each in its own span of story time, as in Seasats: the
 * new theme fades in over the first 75 percent, the old one out over the last
 * 75 percent, both with sine.inOut.
 */
export type GroundSwitch = { from: Ground; to: Ground; at: Moment; length: number };

export const GROUND_START: Ground = "night";

export const GROUND_SWITCHES: readonly GroundSwitch[] = [
  { from: "night", to: "altitude", at: ["iten", 0], length: 0.35 },
  { from: "altitude", to: "night", at: ["edge", 0.08], length: 0.5 },
  { from: "night", to: "signal", at: ["algorithm", 0], length: 0.2 },
  { from: "signal", to: "low", at: ["setback", 0], length: 0.2 },
  { from: "low", to: "warm", at: ["village", 0], length: 0.2 },
  { from: "warm", to: "stadium", at: ["final", 0], length: 0.16 },
  { from: "stadium", to: "night", at: ["handover", 0], length: 0.3 },
];

/**
 * Handover progress at which the story is over: the paper sheet of the
 * practical part starts rising over the held stage. The stage lets go one
 * screen later, once the sheet covers it.
 */
export const RELEASE_AT = 0.6;

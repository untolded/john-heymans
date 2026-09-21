import data from "./data/handwriting.json";

/**
 * The trace of the writing on John's arms in final-arms. Each word's strokes
 * are centre lines in its own upright frame (cap height in `cap`), and
 * `matrix` places that frame on the arm in the photo's pixel coordinates.
 */

export type Word = {
  id: string;
  /** SVG matrix(a b c d e f) from the upright frame to image pixels. */
  matrix: [number, number, number, number, number, number];
  /** Marker width in the upright frame. */
  weight: number;
  /** Top and bottom of the letters' centre lines, in the upright frame. */
  cap: [number, number];
  strokes: string[];
};

export type Phrase = { id: "hey-mom" | "made-it"; text: string; words: Word[] };
export type Handwriting = { image: { slug: "final-arms"; width: number; height: number }; phrases: Phrase[] };

export const HANDWRITING = data as unknown as Handwriting;

/** A word's registration as translate, rotate (degrees) and scale, for tweening. */
export function pose(w: Word) {
  const [a, b, , , e, f] = w.matrix;
  return { x: e, y: f, rotation: (Math.atan2(b, a) * 180) / Math.PI, scale: Math.hypot(a, b) };
}

/** Horizontal extent of a word's strokes in its upright frame, read from the path numbers. */
export function extent(w: Word): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const d of w.strokes) {
    const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    for (let i = 0; i < nums.length; i += 2) {
      lo = Math.min(lo, nums[i]);
      hi = Math.max(hi, nums[i]);
    }
  }
  return [lo - w.weight / 2, hi + w.weight / 2];
}

import { facts, type RankPoint } from "./data";
import { at, span, v, type Moment } from "./beats";

/**
 * The world ranking is what the doubters chapter ends on: one climb, from
 * outside the top 200 to 31st, drawn as the reader scrolls. One function maps
 * story time to how much of the line is drawn.
 *
 * The history is a handful of milestones, several of them ranges ("about 80
 * to 100"). The line passes through them on a monotone curve, so it never
 * invents a dip or a peak between two milestones, and visitors only ever read
 * the milestones' own labels, never a number interpolated between them.
 */

const r = facts.ranking;

const time = (d: string) => Date.parse(d);
const DAY = 86_400_000;

/** The milestones as supplied. The chart only ever names the first and the last. */
export const MILESTONES: RankPoint[] = r.series.value ?? [];
export const QUOTA: number | null = r.quota.value ?? null;
const HOLD = r.hold.value;

/**
 * Monotone cubic (Fritsch and Carlson) through the milestones in log rank, so
 * the curve between two milestones stays between them.
 */
function monotone(xs: number[], ys: number[]) {
  const n = xs.length;
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const m = xs.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  return (x: number) => {
    let i = xs.findIndex((v, j) => j < n - 1 && x <= xs[j + 1]);
    if (i < 0) i = n - 2;
    const h = xs[i + 1] - xs[i];
    const u = Math.min(1, Math.max(0, (x - xs[i]) / h));
    const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
    const h10 = u ** 3 - 2 * u ** 2 + u;
    const h01 = -2 * u ** 3 + 3 * u ** 2;
    const h11 = u ** 3 - u ** 2;
    return h00 * ys[i] + h10 * h * m[i] + h01 * ys[i + 1] + h11 * h * m[i + 1];
  };
}

/** Label of the latest milestone on or before a date. */
const labelOn = (ms: number) => {
  let label = MILESTONES[0]?.label ?? "";
  for (const p of MILESTONES) if (time(p.date) <= ms) label = p.label;
  return label;
};

/**
 * Geometry only: the curve sampled every fortnight, plus every milestone and
 * the hold's ends, so segments can start and stop exactly on them. Never
 * render these ranks as text: labels come from the milestones.
 */
export const SERIES: RankPoint[] = (() => {
  if (MILESTONES.length < 2) return MILESTONES;
  const xs = MILESTONES.map((p) => time(p.date));
  const curve = monotone(xs, MILESTONES.map((p) => Math.log(p.rank)));
  const stamps = new Set<number>(xs);
  for (let x = xs[0]; x < xs[xs.length - 1]; x += 14 * DAY) stamps.add(x);
  if (HOLD) [HOLD.start, HOLD.end].forEach((d) => stamps.add(time(d)));
  return [...stamps]
    .filter((x) => x >= xs[0] && x <= xs[xs.length - 1])
    .sort((a, b) => a - b)
    .map((x) => ({ date: new Date(x).toISOString().slice(0, 10), rank: Math.exp(curve(x)), points: null, label: labelOn(x) }));
})();

const last = Math.max(0, SERIES.length - 1);

/** First point inside the quota. */
export const I_CROSS = (() => {
  if (QUOTA == null) return last;
  const i = SERIES.findIndex((p) => p.rank <= QUOTA);
  return i < 0 ? last : i;
})();

/** The story window in which the line draws the whole climb. */
export const DRAW: { from: Moment; to: Moment } = { from: ["doubt", v("doubt", 148)], to: ["doubt", v("doubt", 200)] };

/** Fractional index into the series that is drawn at story time t. */
export function drawnIndex(t: number): number {
  return last * span(t, DRAW.from, DRAW.to);
}

/** Story time at which the line crosses into the quota. */
export const T_CROSS = at(DRAW.from) + (at(DRAW.to) - at(DRAW.from)) * (last ? I_CROSS / last : 1);

/** Rank at a fractional index, interpolated in log space like the chart. Geometry only. */
export function rankAt(f: number): number {
  if (!SERIES.length) return 0;
  const i = Math.min(last, Math.max(0, Math.floor(f)));
  const j = Math.min(last, i + 1);
  const u = f - i;
  return Math.exp(Math.log(SERIES[i].rank) * (1 - u) + Math.log(SERIES[j].rank) * u);
}

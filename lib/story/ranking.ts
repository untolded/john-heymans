import { facts, type RankPoint } from "./data";
import { at, span, v, type Moment } from "./beats";

/**
 * The world ranking is the chapter after the algorithm: one climb, from
 * outside the top 200 to 31st, drawn as the reader scrolls. One function maps
 * story time to how much of the line is drawn.
 *
 * The line is one steady climb from the first milestone to the last (round
 * 12: no plateau). It is a shape, not a record of the months in between, so
 * visitors only ever read the two ends: where it starts, where it finishes,
 * and the years on the time axis.
 */

const r = facts.ranking;

const time = (d: string) => Date.parse(d);
const DAY = 86_400_000;

/** The milestones as supplied. The chart only ever names the first and the last. */
export const MILESTONES: RankPoint[] = r.series.value ?? [];
export const QUOTA: number | null = r.quota.value ?? null;

/**
 * How far along the climb is, in log rank, at a fraction u of the time: a
 * little quicker at the start than at the end, as it was, and never flat.
 */
const climb = (u: number) => u + 0.1 * Math.sin(Math.PI * u);

/**
 * Geometry only: the climb sampled every fortnight between the first
 * milestone and the last. Never render these ranks as text: labels come from
 * the milestones.
 */
export const SERIES: RankPoint[] = (() => {
  if (MILESTONES.length < 2) return MILESTONES;
  const first = MILESTONES[0];
  const last = MILESTONES[MILESTONES.length - 1];
  const t0 = time(first.date);
  const t1 = time(last.date);
  const l0 = Math.log(first.rank);
  const l1 = Math.log(last.rank);
  const stamps: number[] = [];
  for (let x = t0; x < t1; x += 14 * DAY) stamps.push(x);
  stamps.push(t1);
  return stamps.map((x, i) => ({
    date: new Date(x).toISOString().slice(0, 10),
    rank: Math.exp(l0 + (l1 - l0) * climb((x - t0) / (t1 - t0))),
    points: null,
    label: i === stamps.length - 1 ? last.label : first.label,
  }));
})();

const last = Math.max(0, SERIES.length - 1);

/** First point inside the quota. */
export const I_CROSS = (() => {
  if (QUOTA == null) return last;
  const i = SERIES.findIndex((p) => p.rank <= QUOTA);
  return i < 0 ? last : i;
})();

/** The story window in which the line draws the whole climb, at one even pace. */
export const DRAW: { from: Moment; to: Moment } = { from: ["climb", v("climb", 24)], to: ["climb", v("climb", 104)] };

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

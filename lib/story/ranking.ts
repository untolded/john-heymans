import { content } from "@/lib/content";
import { facts, show, mark, type RankPoint } from "./data";
import { at, span, type Moment } from "./beats";
import { ordinal } from "./format";

/**
 * The world ranking is the object the story follows from the algorithm
 * onwards. One function maps story time to how much of the ranking line is
 * drawn, so the chart, the chip and its sparkline always agree.
 *
 * The history is a handful of milestones, several of them ranges ("about 80
 * to 100"). The line passes through them on a monotone curve, so it never
 * invents a dip or a peak between two milestones, and visitors only ever read
 * the milestones' own labels, never a number interpolated between them.
 */

const r = facts.ranking;
const copy = content.story.ranking;

const time = (d: string) => Date.parse(d);
const DAY = 86_400_000;

/** The milestones as supplied. Their labels are the only ranking text the page shows. */
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

const indexAtDate = (d: string | undefined, fallback: number) => {
  if (!d || SERIES.length < 2) return fallback;
  const x = time(d);
  const i = SERIES.findIndex((p) => time(p.date) >= x);
  return i < 0 ? SERIES.length - 1 : i;
};

const last = Math.max(0, SERIES.length - 1);
/** Where the rise ends (inside the quota), and where the hold ends (the qualifying run). */
export const I_RISE_END = indexAtDate(HOLD?.start, Math.round(last * 0.45));
export const I_HOLD_END = indexAtDate(HOLD?.end, Math.round(last * 0.78));

/** First point inside the quota. */
export const I_CROSS = (() => {
  if (QUOTA == null) return last;
  const i = SERIES.findIndex((p) => p.rank <= QUOTA);
  return i < 0 ? last : i;
})();

/** Story windows in which the line advances. Between them it holds. */
export const SEGMENTS: { from: Moment; to: Moment; i0: number; i1: number }[] = [
  { from: ["doubt", 0.55], to: ["doubt", 0.95], i0: 0, i1: I_RISE_END },
  { from: ["setback", 0.02], to: ["setback", 0.3], i0: I_RISE_END, i1: I_HOLD_END },
  { from: ["setback", 0.66], to: ["setback", 0.88], i0: I_HOLD_END, i1: last },
];

/** Fractional index into the series that is drawn at story time t. */
export function drawnIndex(t: number): number {
  let f = 0;
  for (const s of SEGMENTS) {
    if (t < at(s.from)) break;
    f = s.i0 + (s.i1 - s.i0) * span(t, s.from, s.to);
  }
  return f;
}

/** Story time at which the line reaches a series index. */
const timeAtIndex = (i: number) => {
  for (const s of SEGMENTS) {
    if (i > s.i1) continue;
    const u = s.i1 === s.i0 ? 1 : (i - s.i0) / (s.i1 - s.i0);
    return at(s.from) + (at(s.to) - at(s.from)) * Math.min(1, Math.max(0, u));
  }
  return at(SEGMENTS[SEGMENTS.length - 1].to);
};

/** Story time at which the line crosses into the quota. */
export const T_CROSS = timeAtIndex(I_CROSS);
/** Story time at which the line reaches the qualifying run. */
export const T_QUALIFIED = at(SEGMENTS[2].from) + 0.004;

/** Rank at a fractional index, interpolated in log space like the chart. Geometry only. */
export function rankAt(f: number): number {
  if (!SERIES.length) return 0;
  const i = Math.min(last, Math.max(0, Math.floor(f)));
  const j = Math.min(last, i + 1);
  const u = f - i;
  return Math.exp(Math.log(SERIES[i].rank) * (1 - u) + Math.log(SERIES[j].rank) * u);
}

/** Date at a fractional index, in milliseconds. */
export function dateAt(f: number): number {
  if (!SERIES.length) return 0;
  const i = Math.min(last, Math.max(0, Math.floor(f)));
  const j = Math.min(last, i + 1);
  return time(SERIES[i].date) + (time(SERIES[j].date) - time(SERIES[i].date)) * (f - i);
}

export type ChipState = {
  visible: boolean;
  label: string;
  /** An exact rank to roll, when the milestone is one. */
  value: string | null;
  /** A text state otherwise: a range, a band, or the final. */
  state: string | null;
  /** Development marker for pending values. */
  marker: "" | "pending" | "placeholder";
  /** Fractional series index for the sparkline. */
  spark: number;
};

const CHIP_IN: Moment = ["algorithm", 0.9];
const FINAL_IN: Moment = ["final", 0.02];
const PLACING_IN: Moment = ["final", 0.26];
const CHIP_OUT: Moment = ["handover", 0.08];

export function chipAt(t: number): ChipState {
  const visible = t >= at(CHIP_IN) && t < at(CHIP_OUT);
  const f = drawnIndex(t);

  if (t >= at(FINAL_IN)) {
    const placing = t >= at(PLACING_IN) ? show(facts.result.placing) : undefined;
    return {
      visible,
      label: copy.finalLabel,
      value: null,
      state: placing != null ? ordinalState(placing) : copy.finalValue,
      marker: placing != null ? mark(facts.result.placing) : "",
      spark: f,
    };
  }

  if (show(r.series)?.length) {
    const label = labelOn(dateAt(f));
    const exact = /^\d+$/.test(label);
    return { visible, label: copy.label, value: exact ? label : null, state: exact ? null : label, marker: mark(r.series), spark: f };
  }
  const state = t >= T_CROSS ? copy.inside : t >= at(SEGMENTS[0].from) ? copy.climbing : copy.outside;
  return { visible, label: copy.label, value: null, state, marker: "", spark: f };
}

const ordinalState = (n: number) => copy.placing.replace("{ordinal}", ordinal(n));

/** Quarter starts inside a date range, for axis labels. */
export function quarterTicks(from: number, to: number): number[] {
  const out: number[] = [];
  const d = new Date(from);
  let y = d.getUTCFullYear();
  let m = Math.ceil(d.getUTCMonth() / 3) * 3;
  for (;;) {
    if (m >= 12) {
      y += Math.floor(m / 12);
      m %= 12;
    }
    const x = Date.UTC(y, m, 1);
    if (x > to) break;
    if (x >= from) out.push(x);
    m += 3;
  }
  return out;
}

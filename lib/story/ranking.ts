import { content } from "@/lib/content";
import { facts, show, mark, type RankPoint } from "./data";
import { at, span, type Moment } from "./beats";
import { ordinal } from "./format";

/**
 * The world ranking is the object the story follows from the algorithm
 * onwards. One function maps story time to how much of the ranking line is
 * drawn, so the chart, the chip and its sparkline always agree.
 *
 * The line's geometry may come from a shape-only placeholder while the real
 * history (asset A4) is missing. Its numbers only reach the page through
 * show(), which hides them in production.
 */

const r = facts.ranking;
const copy = content.story.ranking;

/** Geometry only. Never render these values as text: use show() for that. */
export const SERIES: RankPoint[] = r.series.value ?? [];
export const QUOTA: number | null = r.quota.value ?? null;

const time = (d: string) => Date.parse(d);
const indexAtDate = (d: string | undefined, fallback: number) => {
  if (!d || SERIES.length < 2) return fallback;
  const x = time(d);
  const i = SERIES.findIndex((p) => time(p.date) >= x);
  return i < 0 ? SERIES.length - 1 : i;
};

const last = Math.max(0, SERIES.length - 1);
/** Where the record rise ends and the setbacks begin, and where they end. */
export const I_RISE_END = indexAtDate(r.setbackSpan.value?.start, Math.round(last * 0.45));
export const I_SETBACK_END = indexAtDate(r.setbackSpan.value?.end, Math.round(last * 0.78));

/** First point after the setbacks that sits inside the quota. */
export const I_CROSS = (() => {
  if (QUOTA == null) return last;
  for (let i = I_SETBACK_END; i < SERIES.length; i++) if (SERIES[i].rank <= QUOTA) return i;
  return last;
})();

/** Story windows in which the line advances. Between them it holds. */
export const SEGMENTS: { from: Moment; to: Moment; i0: number; i1: number }[] = [
  { from: ["doubt", 0.55], to: ["doubt", 0.95], i0: 0, i1: I_RISE_END },
  { from: ["setback", 0.02], to: ["setback", 0.3], i0: I_RISE_END, i1: I_SETBACK_END },
  { from: ["setback", 0.66], to: ["setback", 0.88], i0: I_SETBACK_END, i1: last },
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

/** Story time at which the line crosses into the quota. */
export const T_CROSS = (() => {
  const s = SEGMENTS[2];
  const u = s.i1 === s.i0 ? 1 : (I_CROSS - s.i0) / (s.i1 - s.i0);
  return at(s.from) + (at(s.to) - at(s.from)) * Math.min(1, Math.max(0, u));
})();

/** Rank at a fractional index, interpolated in log space like the chart. */
export function rankAt(f: number): number {
  if (!SERIES.length) return 0;
  const i = Math.min(last, Math.max(0, Math.floor(f)));
  const j = Math.min(last, i + 1);
  const u = f - i;
  return Math.exp(Math.log(SERIES[i].rank) * (1 - u) + Math.log(SERIES[j].rank) * u);
}

export type ChipState = {
  visible: boolean;
  label: string;
  /** A number to roll, when the ranking may be shown. */
  value: string | null;
  /** A text state when it may not. */
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
  const series = show(r.series);

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

  const state = t >= T_CROSS ? copy.inside : t >= at(SEGMENTS[0].from) ? copy.climbing : copy.outside;
  if (series?.length) {
    return { visible, label: copy.label, value: String(Math.round(rankAt(f))), state: null, marker: mark(r.series), spark: f };
  }
  return { visible, label: copy.label, value: null, state, marker: "", spark: f };
}

const ordinalState = (n: number) => copy.placing.replace("{ordinal}", ordinal(n));

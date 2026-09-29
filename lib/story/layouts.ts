import { SERIES, QUOTA } from "./ranking";

/**
 * Geometry for the ranking chart in the static story, drawn from the same
 * series as the animated one. Geometry may come from shape-only
 * placeholders; text never does (see show()).
 */

// Ranking chart: time across, world ranking up the side (better is higher, log scale). The vertical
// axis sits at axisX with its numbers to its left; the start number fits between it and padL.
export const CHART = { w: 1200, h: 600, axisX: 56, padL: 250, padR: 250, padT: 64, baseY: 552, padB: 70 };

const times = SERIES.map((p) => Date.parse(p.date));
const logs = SERIES.map((p) => Math.log(p.rank));
const LOG_BEST = Math.log(Math.max(1, Math.min(...SERIES.map((p) => p.rank), QUOTA ?? Infinity) * 0.8));
const LOG_WORST = Math.log(Math.max(...SERIES.map((p) => p.rank), 1) * 1.12);

export const chartX = (time: number) => {
  const a = times[0] ?? 0;
  const b = times[times.length - 1] ?? 1;
  return CHART.padL + ((time - a) / (b - a || 1)) * (CHART.w - CHART.padL - CHART.padR);
};
export const chartY = (rank: number) =>
  CHART.padT + ((Math.log(rank) - LOG_BEST) / (LOG_WORST - LOG_BEST || 1)) * (CHART.h - CHART.padT - CHART.padB);

/** Points of the ranking line in chart space. */
export const chartPoints = () => SERIES.map((p, i) => ({ x: chartX(times[i]), y: CHART.padT + ((logs[i] - LOG_BEST) / (LOG_WORST - LOG_BEST || 1)) * (CHART.h - CHART.padT - CHART.padB) }));

/** The ranking line drawn up to a fractional index. */
export function chartPath(f: number, pts = chartPoints()): string {
  if (!pts.length) return "";
  const whole = Math.min(pts.length - 1, Math.floor(f));
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i <= whole; i++) d += `L${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  const u = f - whole;
  if (u > 0 && whole + 1 < pts.length) {
    const a = pts[whole];
    const b = pts[whole + 1];
    d += `L${(a.x + (b.x - a.x) * u).toFixed(1)} ${(a.y + (b.y - a.y) * u).toFixed(1)}`;
  }
  return d;
}

export const quotaY = () => (QUOTA != null ? chartY(QUOTA) : null);

/** The round ranks marked on the vertical axis, inside the chart's range. The animated chart marks the same. */
export const rankGuides = () =>
  [200, 100, 50].filter((r) => {
    const l = Math.log(r);
    return l > LOG_BEST && l < LOG_WORST;
  });

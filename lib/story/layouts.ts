import { facts, type Meet } from "./data";
import { SERIES, QUOTA } from "./ranking";

/**
 * Geometry for the data set pieces, shared by the static SVGs, the
 * filmstrip frames and the animated cinema versions, so all three draw the
 * same thing. Geometry may come from shape-only placeholders; text never
 * does (see show()).
 */

// Season grid: months across and weeks down; on phones months down and weeks across.
export const GRID = { w: 1200, h: 520, cols: 12, rows: 5, padX: 40, padTop: 60, padBottom: 40 };
export const GRID_V = { w: 560, h: 1080, padLeft: 110, padRight: 30, padY: 24 };

export type GridDot = { id: string; x: number; y: number; chosen: boolean; order: number; month: number; date: string };

const MEETS: Meet[] = facts.races.candidates.value ?? [];
const CHOSEN_IDS = (facts.races.chosen.value ?? []).map((c) => c.id);
const WINDOW = facts.ranking.window.value;

const monthIndex = (d: Date, start: Date) => (d.getUTCFullYear() - start.getUTCFullYear()) * 12 + d.getUTCMonth() - start.getUTCMonth();

export function gridDots(vertical = false): GridDot[] {
  if (!MEETS.length) return [];
  const start = new Date(WINDOW?.start ?? MEETS[0].date);
  const months = GRID.cols;
  const weeks = GRID.rows;
  const taken = new Map<string, number>();
  const dots = MEETS.map((m) => {
    const d = new Date(m.date);
    const month = Math.min(months - 1, Math.max(0, monthIndex(d, start)));
    const week = Math.min(weeks - 1, Math.floor((d.getUTCDate() - 1) / 7));
    const key = `${month}-${week}`;
    const n = taken.get(key) ?? 0;
    taken.set(key, n + 1);
    // A second meet in the same week sits beside the first.
    const nudge = n === 0 ? 0 : n % 2 ? 16 : -16;
    const cellA = vertical ? (GRID_V.w - GRID_V.padLeft - GRID_V.padRight) / weeks : (GRID.w - GRID.padX * 2) / months;
    const cellB = vertical ? (GRID_V.h - GRID_V.padY * 2) / months : (GRID.h - GRID.padTop - GRID.padBottom) / weeks;
    return {
      id: m.id,
      x: vertical ? GRID_V.padLeft + cellA * (week + 0.5) + nudge : GRID.padX + cellA * (month + 0.5) + nudge,
      y: vertical ? GRID_V.padY + cellB * (month + 0.5) : GRID.padTop + cellB * (week + 0.5),
      chosen: CHOSEN_IDS.includes(m.id),
      order: CHOSEN_IDS.indexOf(m.id),
      month,
      date: m.date,
    };
  });
  return dots;
}

/** The path through the chosen meets, in date order. */
export function seasonPath(dots: GridDot[]): string {
  const chosen = dots.filter((d) => d.chosen).sort((a, b) => a.order - b.order);
  return chosen.map((d, i) => `${i ? "L" : "M"}${d.x.toFixed(1)} ${d.y.toFixed(1)}`).join("");
}

export const monthStarts = () => {
  const start = new Date(WINDOW?.start ?? MEETS[0]?.date ?? Date.now());
  return Array.from({ length: GRID.cols }, (_, i) => new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1)));
};

// Ranking chart: time across, world ranking up the side (better is higher, log scale).
export const CHART = { w: 1200, h: 560, padL: 20, padR: 90, padT: 30, padB: 40 };

const times = SERIES.map((p) => Date.parse(p.date));
const logs = SERIES.map((p) => Math.log(p.rank));
const LOG_BEST = Math.log(Math.max(1, Math.min(...SERIES.map((p) => p.rank), QUOTA ?? Infinity) * 0.8));
const LOG_WORST = Math.log(Math.max(...SERIES.map((p) => p.rank), 1) * 1.1);

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

/** Head of the line at a fractional index. */
export function chartHead(f: number, pts = chartPoints()) {
  if (!pts.length) return { x: 0, y: 0 };
  const whole = Math.min(pts.length - 1, Math.floor(f));
  const u = f - whole;
  const a = pts[whole];
  const b = pts[Math.min(pts.length - 1, whole + 1)];
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
}

export const quotaY = () => (QUOTA != null ? chartY(QUOTA) : null);

/** Horizontal guides at round ranks inside the chart's range. */
export const rankGuides = () =>
  [500, 300, 200, 100, 50, 25, 10].filter((r) => {
    const l = Math.log(r);
    return l > LOG_BEST && l < LOG_WORST;
  });

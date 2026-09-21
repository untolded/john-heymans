"use client";

import { BEATS, GROUNDS, GROUND_START, GROUND_SWITCHES, at, type BeatId, type Ground } from "./beats";
import { story } from "./store";

/**
 * The only code that knows about the scroll position. It measures one
 * spacer per beat and, on every frame the position changes, writes four
 * numbers per beat into the store (the USAvionix layer 1), plus story time,
 * story progress and the ground crossfade.
 */

type Measured = { id: BeatId; start: number; height: number; end: number };

let measured: Measured[] = [];
let vh = 800;
let lastY = Number.NaN;
const lastOpacity: Partial<Record<Ground, number>> = {};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const sineInOut = (u: number) => -(Math.cos(Math.PI * u) - 1) / 2;

/** Story time at a scroll position: beat index plus progress. */
function timeAt(y: number): number {
  const n = measured.length;
  if (!n) return -1;
  if (y < measured[0].start) return (y - measured[0].start) / vh;
  for (let i = 0; i < n; i++) if (y < measured[i].end) return i + (y - measured[i].start) / measured[i].height;
  return n + (y - measured[n - 1].end) / vh;
}

/** Opacity of every ground layer at story time t, and the one that dominates. */
export function groundAt(t: number): { opacity: Record<Ground, number>; dominant: Ground } {
  const opacity = Object.fromEntries(GROUNDS.map((g) => [g, 0])) as Record<Ground, number>;
  let current: Ground = GROUND_START;
  for (const s of GROUND_SWITCHES) {
    const a = at(s.at);
    if (t < a) break;
    const u = clamp((t - a) / s.length);
    if (u < 1) {
      opacity[s.to] = sineInOut(clamp(u / 0.75));
      opacity[s.from] = 1 - sineInOut(clamp((u - 0.25) / 0.75));
      return { opacity, dominant: u < 0.5 ? s.from : s.to };
    }
    current = s.to;
  }
  opacity[current] = 1;
  return { opacity, dominant: current };
}

export const driver = {
  measure(spacers: HTMLElement[], stageHeight: number) {
    vh = stageHeight || window.innerHeight;
    const scrollY = window.scrollY;
    measured = spacers.map((el, i) => {
      const r = el.getBoundingClientRect();
      const start = r.top + scrollY;
      return { id: BEATS[i].id, start, height: Math.max(1, r.height), end: start + r.height };
    });
    lastY = Number.NaN;
  },

  clear() {
    measured = [];
    lastY = Number.NaN;
  },

  /** Runs every frame; does nothing unless the position changed. */
  update(y: number, ground: HTMLElement | null, root: HTMLElement | null) {
    if (y === lastY || !measured.length) return;
    lastY = y;

    measured.forEach((m, i) => {
      const showStart = i === 0 ? m.start - vh : m.start;
      const progress = clamp((y - m.start) / m.height);
      const show = clamp((y - showStart) / vh);
      const hide = clamp((y - m.end) / vh);
      story.update(m.id, { progress, show, hide, active: show > 0 && hide < 1 });
    });

    const t = timeAt(y);
    const first = measured[0];
    const lastM = measured[measured.length - 1];
    const progress = clamp((y - first.start) / (lastM.end - first.start));
    const index = Math.floor(t);
    const current = index >= 0 && index < measured.length ? measured[index].id : null;

    const g = groundAt(t);
    if (ground) {
      for (const name of GROUNDS) {
        const o = Math.round(g.opacity[name] * 1000) / 1000;
        if (lastOpacity[name] !== o) {
          ground.style.setProperty(`--o-${name}`, String(o));
          lastOpacity[name] = o;
        }
      }
    }
    if (root && root.dataset.ground !== g.dominant) root.dataset.ground = g.dominant;

    story.setTime(t, progress, current, g.dominant);
  },

  /** Forces the next update to run even if the position has not moved. */
  invalidate() {
    lastY = Number.NaN;
  },

  /** Scroll position of a moment in the story. */
  yAt(t: number): number {
    const n = measured.length;
    if (!n) return 0;
    if (t < 0) return measured[0].start + t * vh;
    const i = Math.floor(t);
    if (i >= n) return measured[n - 1].end + (t - n) * vh;
    return measured[i].start + (t - i) * measured[i].height;
  },

  /** Where the story ends and the practical part is fully on screen. */
  endY(): number {
    const n = measured.length;
    return n ? measured[n - 1].end : 0;
  },

  ready: () => measured.length > 0,
};

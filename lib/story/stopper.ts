"use client";

import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";
import { at } from "./beats";
import { driver } from "./driver";
import { scroller } from "./scroll";
import { STOPS } from "./stops";

/**
 * Stops in the scroll (the moments are in lib/story/stops.ts). Only fast
 * forward movement is ever touched: a slow scroll, any scroll back, the
 * scrollbar, the hero's cue and every scroller.to() pass straight through.
 *
 * - Wheel and trackpad (desktop, Lenis): when a fast gesture would carry the
 *   target past the next stop, the target is clamped to the stop, so Lenis
 *   eases into it. The rest of that gesture (a trackpad's momentum, a wheel
 *   still spinning) is swallowed; the next gesture carries on. A gesture
 *   held for longer than MAX_HOLD is let go, so nothing can trap the page.
 * - Touch (native momentum): when a fling would coast past the next stop,
 *   the browser's momentum is taken over at the speed it had and eased out
 *   to land on the stop. A finger on the screen cancels it at once.
 * - Keyboard: Space and Page Down go to the next stop when it is closer than
 *   a screen, otherwise the browser scrolls as usual.
 */

const now = () => performance.now();
const vh = () => window.innerHeight;

/** Stop positions in px, in order. Empty until the driver has measured. */
export function stopsY(): number[] {
  if (!driver.ready()) return [];
  const end = driver.endY();
  return STOPS.map((s) => driver.yAt(at(s.at))).filter((y) => y < end);
}

const nextStop = (from: number): number | null => stopsY().find((y) => y > from + 1) ?? null;

const blocked = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest("[data-lenis-prevent], dialog, [role='dialog']");

// ------------------------------------------------------------------ wheel

/** Gap between wheel events, in ms, after which the next one is a new gesture. */
const GESTURE_GAP = 140;
/** A held stop ignores even a new gesture for this long, so a double flick cannot skip it. */
const MIN_HOLD = 240;
/**
 * Longest a stop holds a gesture that keeps its strength (a wheel spun on and
 * on). A trackpad's momentum fades instead, and is held until it ends.
 */
const MAX_HOLD = 1400;
/** A gesture is fast above this many screens of wheel delta per 100 ms. */
const FAST = 0.15;
const WINDOW = 100;
/** Or when the target runs this many screens ahead of the page. */
const LEAD = 0.35;

type Sample = { t: number; d: number };

export function wheelStops(lenis: Lenis) {
  let hold: { y: number; since: number; peak: number } | null = null;
  let last = { t: 0, abs: 0, dir: 0 };
  let recent: Sample[] = [];
  /** The current gesture has been fast at some point; its fading tail still counts as fast. */
  let fast = false;

  /** Lenis's virtualScroll hook: return false to swallow the event, or adjust the delta. */
  return (data: VirtualScrollData): boolean => {
    const e = data.event;
    if (e.type !== "wheel" || e.ctrlKey || lenis.isStopped || blocked(e.target)) return true;
    const d = data.deltaY;
    if (!d || Math.abs(data.deltaX) > Math.abs(d)) return true;

    const t = now();
    const abs = Math.abs(d);
    const dir = Math.sign(d);
    // Momentum decays and a wheel spins at a steady rate; a new swipe starts after a pause or grows.
    const continuing = t - last.t < GESTURE_GAP && dir === last.dir && abs <= last.abs * 1.3 + 4;
    if (dir !== last.dir) recent = [];
    if (!continuing) fast = false;
    last = { t, abs, dir };
    recent.push({ t, d: abs });
    recent = recent.filter((s) => t - s.t <= WINDOW);

    // Moved away by other means (keyboard, scrollbar, a link): the hold is over.
    if (hold && Math.abs(lenis.targetScroll - hold.y) > 2) hold = null;

    if (hold) {
      if (dir < 0) {
        hold = null;
        return true;
      }
      const held = t - hold.since;
      hold.peak = Math.max(hold.peak, abs);
      const insisting = held > MAX_HOLD && abs > 0.5 * hold.peak;
      if ((continuing || held < MIN_HOLD) && !insisting) {
        if (e.cancelable) e.preventDefault();
        return false;
      }
      hold = null;
    }

    if (dir < 0 || !driver.ready()) return true;
    // Fast: a burst of delta, or scroll piling up ahead of the page (which also catches a gesture
    // whose events arrive slowly because the main thread is busy).
    const from = lenis.targetScroll;
    const speed = recent.reduce((a, s) => a + s.d, 0);
    const lead = from + d - lenis.animatedScroll;
    fast ||= speed >= FAST * vh() || lead >= LEAD * vh();
    if (!fast) return true;

    const stop = nextStop(from);
    if (stop == null || from + d <= stop) return true;
    data.deltaY = stop - from;
    hold = { y: stop, since: t, peak: abs };
    return true;
  };
}

// ------------------------------------------------------------------ touch

/** Roughly how far native momentum coasts: speed (px/ms) times this. */
const COAST = 450;
/** Flings slower than this many screens per second are left alone. */
const MIN_FLING = 1.2;
/** The take-over may brake at most this much harder than the browser would. */
const MAX_BRAKE = 4;

function touchStops(): () => void {
  const root = document.documentElement;
  let touching = false;
  let endedAt = -1;
  let samples: Sample[] = [];
  let speed = 0;
  let momentum: Sample[] = [];
  let decided = true;
  let raf = 0;

  const release = () => {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
    root.style.removeProperty("overflow");
  };

  const glide = (stop: number, v: number) => {
    // Stops the browser's momentum; programmatic scrolling still works.
    root.style.overflow = "hidden";
    let y0 = NaN;
    let D = 0;
    let T = 0;
    let t0 = 0;
    let expected = NaN;
    const step = () => {
      const y = window.scrollY;
      if (Number.isNaN(y0)) {
        // Start from wherever the momentum got to before it stopped.
        y0 = y;
        D = stop - y0;
        T = Math.min(1400, (2 * D) / v);
        // One frame in already, so the page does not stand still for a frame at the hand-over.
        t0 = now() - 16;
        if (D < 2) return release();
      } else if (Math.abs(y - expected) > 2) {
        // Something else is moving the page (a browser whose momentum did not stop): let it.
        return release();
      }
      const p = Math.min(1, (now() - t0) / T);
      // Quadratic ease-out: starts at the fling's own speed, ends at rest on the stop.
      window.scrollTo(0, y0 + D * (1 - (1 - p) * (1 - p)));
      expected = window.scrollY;
      if (p < 1) raf = requestAnimationFrame(step);
      else release();
    };
    raf = requestAnimationFrame(step);
  };

  const decide = (y: number, v: number) => {
    if (v < (MIN_FLING * vh()) / 1000) return;
    const coastTo = y + v * COAST;
    for (const stop of stopsY()) {
      if (stop <= y + 1) continue;
      // The fling ends before this stop, or close enough past it: leave it to the browser.
      if (coastTo < stop + 0.1 * vh()) return;
      // Close enough to brake for comfortably? Otherwise it is on screen now; aim for the next.
      if ((v * v) / (2 * (stop - y)) <= (MAX_BRAKE * v) / COAST) return glide(stop, v);
    }
  };

  // The finger's own speed as it lets go is what the browser's momentum starts from, and it is
  // known a few frames before the momentum's scroll events could measure it.
  const onStart = (e: TouchEvent) => {
    touching = true;
    decided = true;
    release();
    samples = [{ t: now(), d: e.touches[0]?.clientY ?? 0 }];
  };
  const onMove = (e: TouchEvent) => {
    const t = now();
    samples.push({ t, d: e.touches[0]?.clientY ?? 0 });
    if (samples.length > 8) samples.shift();
  };
  const onEnd = (e: TouchEvent) => {
    if (e.touches.length) return;
    touching = false;
    endedAt = now();
    const last = samples[samples.length - 1];
    const from = samples.find((s) => last.t - s.t <= 100) ?? last;
    // Finger up the screen is scroll down the page.
    speed = from !== last && endedAt - last.t < 60 ? (from.d - last.d) / (last.t - from.t) : 0;
    decided = false;
    momentum = [];
  };
  const onScroll = () => {
    if (touching || decided || raf) return;
    const t = now();
    if (t - endedAt > 150) {
      decided = true;
      return;
    }
    if (speed > 0) {
      decided = true;
      return decide(window.scrollY, speed);
    }
    // No finger speed to go on (too few touch moves): measure the momentum itself.
    momentum.push({ t, d: window.scrollY });
    const a = momentum[momentum.length - 2];
    const b = momentum[momentum.length - 1];
    if (!a || b.t - a.t < 8) return;
    decided = true;
    const v = (b.d - a.d) / (b.t - a.t);
    if (v > 0) decide(b.d, v);
  };

  window.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onEnd, { passive: true });
  window.addEventListener("touchcancel", onEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    release();
    window.removeEventListener("touchstart", onStart);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onEnd);
    window.removeEventListener("touchcancel", onEnd);
    window.removeEventListener("scroll", onScroll);
  };
}

// ------------------------------------------------------------------ keyboard

const TYPING = "input, textarea, select, button, a, summary, video, audio, [contenteditable], [role='slider']";

function keyStops(): () => void {
  // Where the last press is heading, so a quick second press goes on to the stop after it.
  let heading = { y: -1, t: 0 };
  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== " " && e.key !== "PageDown") return;
    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest(TYPING) || blocked(target) || document.documentElement.classList.contains("is-locked")) return;
    const t = now();
    const y = t - heading.t < 1200 ? Math.max(scroller.y(), heading.y) : scroller.y();
    const stop = nextStop(y);
    if (stop == null || stop - y > 0.92 * vh()) return;
    e.preventDefault();
    heading = { y: stop, t };
    scroller.to(stop, { duration: 0.9 });
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}

/** Touch and keyboard stops for the story; the wheel's live in Lenis (see wheelStops). */
export function attachStops({ touch }: { touch: boolean }): () => void {
  const offTouch = touch ? touchStops() : () => {};
  const offKeys = keyStops();
  return () => {
    offTouch();
    offKeys();
  };
}

"use client";

import type Lenis from "lenis";

/**
 * One place to read and move the scroll position, whichever engine runs it:
 * Lenis on desktop cinema, the browser everywhere else.
 */
let lenis: Lenis | null = null;
const hooks = new Set<() => void>();

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scroller = {
  set(instance: Lenis | null) {
    lenis = instance;
  },
  get: () => lenis,

  /** The page's one clock, run from gsap.ticker: Lenis first, then everything that reads the position. */
  tick(time: number) {
    lenis?.raf(time * 1000);
    hooks.forEach((fn) => fn());
  },

  onFrame(fn: () => void) {
    hooks.add(fn);
    return () => void hooks.delete(fn);
  },

  y: () => (lenis ? lenis.animatedScroll : window.scrollY),

  to(y: number, opts: { immediate?: boolean; duration?: number } = {}) {
    const immediate = opts.immediate || reduced();
    if (lenis) {
      lenis.scrollTo(y, { immediate, duration: opts.duration ?? 1.2, force: true });
      return;
    }
    window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  },

  toElement(el: Element, opts: { immediate?: boolean; offset?: number } = {}) {
    const y = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    scroller.to(y, opts);
  },

  /** Holds the page still while a dialog is open. */
  lock(on: boolean) {
    if (lenis) {
      if (on) lenis.stop();
      else lenis.start();
    }
    document.documentElement.classList.toggle("is-locked", on);
  },
};

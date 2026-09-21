"use client";

import { gsap, SplitText } from "./gsap";

/**
 * The six reveals and three exits, implemented once. Each returns a GSAP
 * timeline, and splits are reverted when the reveal finishes so nothing stays
 * split in the DOM. SplitText keeps the original text for assistive
 * technology.
 *
 *   words     title cards: words arrive one at a time, from scale and blur
 *   rise      story copy and UI: lines rise inside a mask
 *   ink       lesson cards and key lines: written left to right, amber nib
 *   type      the ChatGPT prompt: characters appended, caret blinking
 *   flash     notifications and headlines: slide in with a one-frame flash
 *   scribble  the handwriting: strokes drawn with DrawSVG
 */

export type Revealed = { tl: gsap.core.Timeline; revert: () => void };

const noop = () => {};

/** Lines rise from behind a mask. `small` is for single-line UI: 12px of travel. */
export function rise(el: HTMLElement, opts: { delay?: number; small?: boolean } = {}): Revealed {
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
  if (opts.small) {
    tl.fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    return { tl, revert: noop };
  }
  const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "sl", aria: "auto" });
  tl.from(split.lines, { yPercent: 100, duration: 0.6, ease: "power3.out", stagger: 0.07 });
  tl.call(() => split.revert());
  return { tl, revert: () => split.revert() };
}

/** Words arrive one at a time from a little larger and out of focus. */
export function words(el: HTMLElement, opts: { delay?: number; stagger?: number } = {}): Revealed & { words: HTMLElement[] } {
  gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
  const split = SplitText.create(el, { type: "words", wordsClass: "sw", aria: "auto" });
  const list = split.words as HTMLElement[];
  gsap.set(list, { opacity: 0, scale: 1.12, filter: "blur(10px)" });
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  if (opts.stagger !== 0) tl.add(wordsIn(list, opts.stagger ?? 0.11));
  return { tl, words: list, revert: () => split.revert() };
}

/** The motion of one or more words arriving. Used alone when the scroll paces them. */
export function wordsIn(list: HTMLElement[] | HTMLElement, stagger = 0.11) {
  return gsap.to(list, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out", stagger, overwrite: true });
}

export function wordsOut(list: HTMLElement[] | HTMLElement) {
  return gsap.to(list, { opacity: 0, scale: 1.12, filter: "blur(10px)", duration: 0.25, ease: "power2.in", overwrite: true });
}

/**
 * The United Carriers ink sweep: each line is written left to right with an
 * amber nib, then the split is reverted to plain text. Colours come from the
 * --ink-text and --ink-nib custom properties, so paper grounds swap them.
 */
export function ink(el: HTMLElement, opts: { delay?: number } = {}): Revealed {
  gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
  const split = SplitText.create(el, { type: "lines", linesClass: "ink-line", aria: "auto" });
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  tl.fromTo(split.lines, { "--sweep": 30 }, { "--sweep": 100, duration: 1.1, ease: "power1.inOut", stagger: 0.1 });
  tl.call(() => split.revert());
  return { tl, revert: () => split.revert() };
}

/**
 * Types text into an element: 38 to 72ms between characters, a pause after
 * each comma. The caret is a sibling element styled by CSS.
 */
export function type(target: HTMLElement, text: string, opts: { delay?: number } = {}): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  let at = 0;
  target.textContent = "";
  for (let i = 1; i <= text.length; i++) {
    const slice = text.slice(0, i);
    tl.call(() => void (target.textContent = slice), undefined, at);
    const ch = text[i - 1];
    at += ch === " " && text[i - 2] === "," ? 0.22 : gsap.utils.random(0.038, 0.072);
  }
  return tl;
}

/** Slides in from 24px to the right, with a one-frame paper border. */
export function flash(el: HTMLElement, opts: { delay?: number } = {}): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  tl.set(el, { autoAlpha: 1 });
  tl.fromTo(el, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 0);
  tl.call(() => el.classList.add("is-flash"), undefined, 0);
  tl.call(() => el.classList.remove("is-flash"), undefined, 0.034);
  return tl;
}

/** Strokes drawn like a marker: 1.6s per phrase, round caps set in CSS. */
export function scribble(paths: SVGPathElement[] | Element[], opts: { duration?: number; delay?: number } = {}): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  const per = (opts.duration ?? 1.6) / Math.max(1, paths.length);
  tl.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: per, ease: "power1.inOut", stagger: per });
  return tl;
}

export type ExitKind = "rise" | "blur" | "cut";

/** The three exits. `rise` lifts 8px and fades, `blur` hands off into depth, `cut` removes. */
export function exit(el: HTMLElement, kind: ExitKind = "rise"): gsap.core.Tween | null {
  if (kind === "cut") {
    gsap.set(el, { autoAlpha: 0 });
    return null;
  }
  if (kind === "blur") {
    return gsap.to(el, { y: -24, scale: 0.9, filter: "blur(4px)", opacity: 0, duration: 0.3, ease: "power2.in", overwrite: true });
  }
  return gsap.to(el, { y: -8, opacity: 0, duration: 0.25, ease: "power2.in", overwrite: true });
}

/** Back to the hidden resting state, ready for the next reveal. */
export function reset(el: HTMLElement) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 0, clearProps: "transform,filter" });
}

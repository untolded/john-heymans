"use client";

import { useSyncExternalStore } from "react";
import { BEAT_IDS, type BeatId, type Ground } from "./beats";
import type { Mode } from "./modes";

export type BeatState = { progress: number; show: number; hide: number; active: boolean };

export type StoryState = {
  beats: Record<BeatId, BeatState>;
  /** The beat the scroll position is inside, or null outside the story. */
  current: BeatId | null;
  /** Story time: beat index plus progress. Negative before, beyond the last index after. */
  t: number;
  /** 0 to 1 across the whole story, for the progress hairline. */
  story: number;
  /** The ground most of the screen shows, which the frame reads to invert. */
  ground: Ground;
  mode: Mode | null;
  /** True once the cinema layout is on screen. */
  cinema: boolean;
};

const ZERO: BeatState = { progress: 0, show: 0, hide: 0, active: false };

const initial: StoryState = {
  beats: Object.fromEntries(BEAT_IDS.map((id) => [id, ZERO])) as Record<BeatId, BeatState>,
  current: null,
  t: -1,
  story: 0,
  ground: "night",
  mode: null,
  cinema: false,
};

let state = initial;

type TimeListener = (t: number, s: StoryState) => void;
const reactListeners = new Set<() => void>();
const beatListeners = new Map<BeatId, Set<(b: BeatState) => void>>();
const timeListeners = new Set<TimeListener>();

const emitReact = () => reactListeners.forEach((fn) => fn());
const same = (a: BeatState, b: BeatState) =>
  a.progress === b.progress && a.show === b.show && a.hide === b.hide && a.active === b.active;

/**
 * The story store. Two kinds of subscriber: React components that change
 * rarely (chapter name, mode), and per-frame callbacks (timelines, canvases,
 * the copy overlay) that must never cause a React render.
 */
export const story = {
  get: () => state,

  update(id: BeatId, next: BeatState) {
    if (same(state.beats[id], next)) return;
    state = { ...state, beats: { ...state.beats, [id]: next } };
    beatListeners.get(id)?.forEach((fn) => fn(next));
  },

  /** Called once per frame by the driver, after every beat is updated. */
  setTime(t: number, progress: number, current: BeatId | null, ground: Ground) {
    const reactChanged = current !== state.current || ground !== state.ground;
    if (t === state.t && !reactChanged) return;
    state = { ...state, t, story: progress, current, ground };
    timeListeners.forEach((fn) => fn(t, state));
    if (reactChanged) emitReact();
  },

  setMode(mode: Mode | null, cinema: boolean) {
    if (mode === state.mode && cinema === state.cinema) return;
    state = { ...state, mode, cinema };
    emitReact();
  },

  /** Per-frame subscription to one beat. Called once immediately. */
  onBeat(id: BeatId, fn: (b: BeatState) => void) {
    let set = beatListeners.get(id);
    if (!set) beatListeners.set(id, (set = new Set()));
    set.add(fn);
    fn(state.beats[id]);
    return () => void set!.delete(fn);
  },

  /** Per-frame subscription to story time. Called once immediately. */
  onTime(fn: TimeListener) {
    timeListeners.add(fn);
    fn(state.t, state);
    return () => void timeListeners.delete(fn);
  },

  subscribe(fn: () => void) {
    reactListeners.add(fn);
    return () => void reactListeners.delete(fn);
  },

  reset() {
    state = { ...initial, mode: state.mode };
    emitReact();
  },
};

/** React view of the store. The selector must return a primitive or a stable reference. */
export function useStory<T>(select: (s: StoryState) => T): T {
  return useSyncExternalStore(story.subscribe, () => select(story.get()), () => select(initial));
}

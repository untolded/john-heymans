"use client";

/**
 * Credits in the frame. Every media layer reports its opacity and its credit
 * line ("Photo: ...", "Footage: ...") as it changes; the frame shows the line
 * of the most visible layer above 50 percent, so whoever made an image is
 * named whenever it is on screen.
 */

type Entry = { credit: string; opacity: number };
const layers = new Map<string, Entry>();
const listeners = new Set<(credit: string | null) => void>();
let shown: string | null = null;

function resolve() {
  let best: Entry | null = null;
  layers.forEach((e) => {
    if (e.opacity > 0.5 && (!best || e.opacity > best.opacity)) best = e;
  });
  const next = (best as Entry | null)?.credit ?? null;
  if (next !== shown) {
    shown = next;
    listeners.forEach((fn) => fn(shown));
  }
}

export const credits = {
  report(id: string, credit: string, opacity: number) {
    const prev = layers.get(id);
    if (prev && prev.opacity === opacity && prev.credit === credit) return;
    layers.set(id, { credit, opacity });
    resolve();
  },
  remove(id: string) {
    if (layers.delete(id)) resolve();
  },
  subscribe(fn: (credit: string | null) => void) {
    listeners.add(fn);
    fn(shown);
    return () => void listeners.delete(fn);
  },
};

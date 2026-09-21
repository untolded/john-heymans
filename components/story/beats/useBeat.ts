"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/story/gsap";
import { story, type BeatState } from "@/lib/story/store";
import type { BeatId } from "@/lib/story/beats";

type Build = (ctx: {
  tl: gsap.core.Timeline;
  q: (selector: string) => HTMLElement[];
  root: HTMLDivElement;
}) => ((b: BeatState) => void) | void;

/**
 * Every beat builds one paused GSAP timeline of duration 1, positioned in
 * beat progress, and the store sets its progress every frame. Entry and exit
 * read show and hide in the same callback. No beat creates a ScrollTrigger,
 * so the scroll logic stays in the driver and any moment can be reached by
 * setting progress directly.
 *
 * The wrapper uses display: contents, so each beat's layers join the stage's
 * shared paint order (media, dim, set, line) across beats. An inactive beat
 * is hidden and its per-frame work skipped.
 */
export function useBeat(id: BeatId, build: Build, deps: unknown[] = []) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current!;
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root);
      const onFrame = build({ tl, q, root });
      if (tl.duration() < 1) tl.set({}, {}, 1);

      let active: boolean | null = null;
      return story.onBeat(id, (b) => {
        const changed = b.active !== active;
        if (changed) {
          active = b.active;
          root.dataset.active = String(b.active);
        }
        // Inactive beats skip their work, but hear about it once so they can tidy up.
        if (!b.active && !changed) return;
        tl.progress(b.progress);
        onFrame?.(b);
      });
    },
    { scope, dependencies: deps },
  );

  return scope;
}

/**
 * Time-based moments inside a scrubbed beat: each fires once when progress
 * crosses its threshold going forward, and is undone going back. When a fast
 * scroll crosses several at once, earlier ones are finished first so the
 * sequence always ends in the right state.
 */
export function cues(list: { at: number; on: () => gsap.core.Animation | void; off?: () => void }[]) {
  const fired = list.map(() => false);
  const anims: (gsap.core.Animation | null)[] = list.map(() => null);
  return (p: number) => {
    for (let i = list.length - 1; i >= 0; i--) {
      if (fired[i] && p < list[i].at) {
        fired[i] = false;
        anims[i]?.kill();
        anims[i] = null;
        list[i].off?.();
      }
    }
    list.forEach((c, i) => {
      if (!fired[i] && p >= c.at) {
        // Finish everything before it, including animations started in this same frame.
        anims.forEach((a, j) => {
          if (j < i && a && a.progress() < 1) a.progress(1);
        });
        fired[i] = true;
        anims[i] = c.on() || null;
      }
    });
  };
}
